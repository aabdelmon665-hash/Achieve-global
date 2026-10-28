import { NextResponse, type NextRequest } from "next/server";
import { isFormType, validateForm } from "@/lib/forms/definitions";
import { isLocale, defaultLocale } from "@/i18n/config";
import { getEmailConfig, isEmailConfigured } from "@/lib/email/config";
import { resolveRecipient } from "@/lib/email/routing";
import { buildAcknowledgement, buildInternalEmail } from "@/lib/email/templates";
import { EmailNotConfiguredError, sendEmail } from "@/lib/email/send";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 32_000;
const MIN_FILL_MS = 3_000;
const MAX_LINKS = 4;

type ErrorKey = "badRequest" | "validation" | "rateLimited" | "tooFast" | "links" | "notConfigured" | "sendFailed";

function fail(error: ErrorKey, status: number, extra: Record<string, unknown> = {}, headers?: HeadersInit) {
  return NextResponse.json({ ok: false, error, ...extra }, { status, headers });
}

/**
 * Client IP for rate limiting, from the header the hosting platform itself
 * sets (and overwrites), so visitors cannot spoof it.
 */
function clientIp(req: NextRequest) {
  const onCloudflare = typeof navigator !== "undefined" && navigator.userAgent === "Cloudflare-Workers";
  if (onCloudflare) return req.headers.get("cf-connecting-ip") ?? "unknown";
  return (
    req.headers.get("x-real-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

/** Reject posts coming from other sites (basic CSRF protection). */
function sameOrigin(req: NextRequest) {
  const origin = req.headers.get("origin");
  if (!origin) return true; // some privacy tools strip Origin; other checks still apply
  try {
    return new URL(origin).host === req.headers.get("host");
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return fail("badRequest", 403);
  if (!req.headers.get("content-type")?.includes("application/json")) return fail("badRequest", 415);

  const limit = rateLimit(`inquiry:${clientIp(req)}`, 8, 10 * 60 * 1000);
  if (!limit.allowed) return fail("rateLimited", 429, {}, { "Retry-After": String(limit.retryAfter) });

  let body: Record<string, unknown>;
  try {
    const raw = await req.text();
    if (raw.length > MAX_BODY_BYTES) return fail("badRequest", 413);
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return fail("badRequest", 400);
    body = parsed as Record<string, unknown>;
  } catch {
    return fail("badRequest", 400);
  }

  const { formType, locale: rawLocale, fields, website, startedAt } = body as {
    formType?: unknown;
    locale?: unknown;
    fields?: unknown;
    website?: unknown;
    startedAt?: unknown;
  };
  if (!isFormType(formType) || !fields || typeof fields !== "object") return fail("badRequest", 400);
  const locale = typeof rawLocale === "string" && isLocale(rawLocale) ? rawLocale : defaultLocale;

  // Honeypot: real visitors never see or fill this field. Answer as if
  // accepted so automated senders get no signal, but send nothing.
  if (typeof website === "string" && website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  if (typeof startedAt !== "number" || Date.now() - startedAt < MIN_FILL_MS) {
    return fail("tooFast", 400);
  }

  const result = validateForm(formType, fields as Record<string, unknown>);
  if (!result.ok) return fail("validation", 422, { fields: result.errors });

  const linkCount = Object.values(result.values).join(" ").match(/https?:\/\/|www\./gi)?.length ?? 0;
  if (linkCount > MAX_LINKS) return fail("links", 422);

  const config = getEmailConfig();
  const devConsole = config.provider === "console" && process.env.NODE_ENV !== "production";
  if (!isEmailConfigured(config) && !devConsole) {
    console.error("[inquiry] Email delivery is not configured — see docs/EMAIL_SETUP.md");
    return fail("notConfigured", 503);
  }

  const to = resolveRecipient(formType, result.values, config);
  const senderEmail = result.values.email ?? result.values.contactEmail;
  const message = buildInternalEmail(formType, result.values, locale);

  try {
    await sendEmail(config, { to, replyTo: senderEmail, ...message });
  } catch (err) {
    if (err instanceof EmailNotConfiguredError) return fail("notConfigured", 503);
    console.error("[inquiry] Delivery failed:", err instanceof Error ? err.message : err);
    return fail("sendFailed", 502);
  }

  if (config.sendAcknowledgement && senderEmail) {
    // Best effort: the inquiry itself has already been delivered.
    await sendEmail(config, { to: senderEmail, replyTo: config.replyTo, ...buildAcknowledgement(locale) }).catch((err) =>
      console.warn("[inquiry] Acknowledgement not sent:", err instanceof Error ? err.message : err),
    );
  }

  return NextResponse.json({ ok: true });
}

export function GET() {
  return fail("badRequest", 405, {}, { Allow: "POST" });
}
