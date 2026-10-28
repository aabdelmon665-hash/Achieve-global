import "server-only";
import { siteConfig } from "@/config/site";

export type EmailProvider = "resend" | "smtp" | "console";

/**
 * Reads email settings from environment variables at request time.
 * Nothing here is ever sent to the browser.
 */
export function getEmailConfig() {
  const env = process.env;
  const provider = (env.EMAIL_PROVIDER ?? "").toLowerCase() as EmailProvider | "";

  return {
    provider,
    from: env.EMAIL_FROM ?? "",
    replyTo: env.EMAIL_REPLY_TO || siteConfig.emails.general,
    toGeneral: env.EMAIL_TO_GENERAL || siteConfig.emails.general,
    toExports: env.EMAIL_TO_EXPORTS || siteConfig.emails.exports,
    /** Optional dedicated sourcing inbox; falls back to the general inbox. */
    toSourcing: env.EMAIL_TO_SOURCING || env.EMAIL_TO_GENERAL || siteConfig.emails.general,
    apiKey: env.EMAIL_PROVIDER_API_KEY ?? "",
    smtp: {
      host: env.SMTP_HOST ?? "",
      port: Number(env.SMTP_PORT ?? 587),
      secure: env.SMTP_SECURE === "true",
      user: env.SMTP_USER ?? "",
      password: env.SMTP_PASSWORD ?? "",
    },
    sendAcknowledgement: env.EMAIL_SEND_ACKNOWLEDGEMENT === "true",
  };
}

export type EmailConfig = ReturnType<typeof getEmailConfig>;

/** True when a real provider has everything it needs to send. */
export function isEmailConfigured(c: EmailConfig): boolean {
  if (!c.from) return false;
  if (c.provider === "resend") return Boolean(c.apiKey);
  if (c.provider === "smtp") return Boolean(c.smtp.host && c.smtp.user && c.smtp.password);
  return false;
}
