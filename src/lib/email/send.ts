import "server-only";
import type { EmailConfig } from "./config";

export type OutgoingEmail = {
  to: string;
  replyTo?: string;
  subject: string;
  text: string;
  html: string;
};

export class EmailNotConfiguredError extends Error {}

/** Deliver one email through the configured provider. Throws on failure. */
export async function sendEmail(c: EmailConfig, mail: OutgoingEmail): Promise<void> {
  if (c.provider === "resend") {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${c.apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: c.from,
        to: [mail.to],
        reply_to: mail.replyTo,
        subject: mail.subject,
        text: mail.text,
        html: mail.html,
      }),
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) {
      // Log status and provider message only — never the API key or the submission.
      const detail = await res.text().catch(() => "");
      throw new Error(`Resend responded ${res.status}: ${detail.slice(0, 300)}`);
    }
    return;
  }

  if (c.provider === "smtp") {
    const nodemailer = await import("nodemailer");
    const transport = nodemailer.createTransport({
      host: c.smtp.host,
      port: c.smtp.port,
      secure: c.smtp.secure,
      auth: { user: c.smtp.user, pass: c.smtp.password },
      connectionTimeout: 15_000,
      greetingTimeout: 15_000,
      socketTimeout: 20_000,
    });
    await transport.sendMail({
      from: c.from,
      to: mail.to,
      replyTo: mail.replyTo,
      subject: mail.subject,
      text: mail.text,
      html: mail.html,
    });
    return;
  }

  if (c.provider === "console" && process.env.NODE_ENV !== "production") {
    console.info(`[email:console] to=${mail.to} replyTo=${mail.replyTo ?? "-"}\nSubject: ${mail.subject}\n\n${mail.text}`);
    return;
  }

  throw new EmailNotConfiguredError("No email provider configured");
}
