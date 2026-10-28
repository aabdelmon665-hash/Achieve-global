import "server-only";
import type { FormType } from "@/lib/forms/definitions";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { formDefinitions } from "@/lib/forms/definitions";
import { siteConfig } from "@/config/site";

const formTitles: Record<FormType, string> = {
  industrial: "Industrial sourcing inquiry",
  food: "Food export quotation request",
  business: "Business services inquiry",
  contact: "Website contact form",
};

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

/** Strip characters that could break or inject email headers. */
export function headerSafe(s: string) {
  return s.replace(/[\r\n\t]+/g, " ").slice(0, 150);
}

/** Internal notification to the company inbox, always written in English. */
export function buildInternalEmail(type: FormType, values: Record<string, string>, locale: Locale) {
  const en = getDictionary("en");
  const labels = en.forms.fields as Record<string, { label: string }>;
  const optionLabels = en.forms.options as Record<string, Record<string, string>>;
  const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

  const rows = formDefinitions[type]
    .filter((f) => values[f.name])
    .map((f) => {
      let v = values[f.name];
      if (f.kind === "country") v = `${regionNames.of(v) ?? v} (${v})`;
      if (f.kind === "select" && f.optionsKey) v = optionLabels[f.optionsKey]?.[v] ?? v;
      return { label: labels[f.name]?.label ?? f.name, value: v };
    });

  const name = values.fullName ?? "";
  const company = values.companyName || values.companyNameOptional || "";
  const topic = values.subject || values.product || values.foodProduct || "";
  const subject = headerSafe(
    `[${formTitles[type]}] ${[company || name, topic].filter(Boolean).join(" — ")}`,
  );

  const meta = [
    `Submitted: ${new Date().toISOString()}`,
    `Website language: ${locale.toUpperCase()}`,
    `Source: ${siteConfig.url}`,
  ];

  const text = [
    formTitles[type],
    "",
    ...rows.map((r) => `${r.label}:\n${r.value}\n`),
    "—",
    ...meta,
    "",
    "Reply directly to this email to respond to the sender.",
  ].join("\n");

  const html = `<!doctype html><html><body style="font-family:Arial,Helvetica,sans-serif;color:#202833;background:#F4F6F8;padding:24px">
<table role="presentation" width="100%" style="max-width:640px;margin:0 auto;background:#fff;border:1px solid #e3e7ec">
<tr><td style="background:#14243A;color:#fff;padding:20px 24px;font-size:16px;letter-spacing:.04em"><strong>ACHIEVE GLOBAL</strong> · ${escapeHtml(formTitles[type])}</td></tr>
<tr><td style="padding:24px">
${rows
  .map(
    (r) =>
      `<p style="margin:0 0 4px;font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:#6b7684">${escapeHtml(r.label)}</p>
<p style="margin:0 0 18px;font-size:15px;line-height:1.5;white-space:pre-wrap">${escapeHtml(r.value)}</p>`,
  )
  .join("\n")}
<hr style="border:none;border-top:1px solid #e3e7ec;margin:8px 0 16px">
<p style="margin:0;font-size:12px;color:#6b7684;line-height:1.6">${meta.map(escapeHtml).join("<br>")}<br>Reply directly to this email to respond to the sender.</p>
</td></tr></table></body></html>`;

  return { subject, text, html };
}

/**
 * Optional acknowledgement to the sender (EMAIL_SEND_ACKNOWLEDGEMENT=true).
 * Fixed wording only — submitted content is never echoed back, so the form
 * cannot be abused to relay arbitrary text to third parties.
 */
export function buildAcknowledgement(locale: Locale) {
  const d = getDictionary(locale).emailAck;
  const text = `${d.greeting}\n\n${d.body}\n\n${d.signature}\n${siteConfig.brandName}\n${siteConfig.url}`;
  const dir = locale === "ar" ? "rtl" : "ltr";
  const html = `<!doctype html><html lang="${locale}" dir="${dir}"><body style="font-family:Arial,Helvetica,sans-serif;color:#202833;padding:24px">
<p>${escapeHtml(d.greeting)}</p><p style="line-height:1.6">${escapeHtml(d.body)}</p>
<p>${escapeHtml(d.signature)}<br><strong>${siteConfig.brandName}</strong><br><a href="${siteConfig.url}">${siteConfig.url.replace("https://", "")}</a></p></body></html>`;
  return { subject: d.subject, text, html };
}
