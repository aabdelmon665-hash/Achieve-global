# Email configuration

All forms post to `/api/inquiry/`, which validates input on the server and
sends one notification email per inquiry through the provider configured in
environment variables.

> **Status (not yet live):** no real email provider is connected. Routing and
> delivery have been tested only against a local SMTP test server. Until the
> variables below are set in production, the forms tell visitors to email the
> company directly (HTTP 503) — no inquiry is silently lost. Do not describe
> the forms as working until the real-mailbox tests at the end of this guide
> have passed.

## Mailboxes

| Address | Status | Receives |
|---|---|---|
| info@achieveglobal.com.tr | Exists | General, industrial sourcing, business services, partnership, other |
| exports@achieveglobal.com.tr | **To be created** | Food trading & export inquiries, export quotation requests |

The site currently **displays and routes to exports@**. That address must be
able to receive mail before launch. If you want to launch first, switch it
off (one line):

```ts
// src/config/site.ts
export const EXPORTS_MAILBOX_ACTIVE = false;
```

While `false`, exports@ is not shown anywhere (pages, footer, page
descriptions, structured data) and food/export inquiries are delivered to
info@. Set it back to `true` and redeploy once exports@ works.

Alternatively, create exports@ as an **alias/forwarder to info@** in your
mailbox provider — then everything works immediately and you can split the
inboxes later without touching the site.

## Routing

| Form / category | Destination | Override variable |
|---|---|---|
| Contact — General, Partnership, Other | info@ | `EMAIL_TO_GENERAL` |
| Contact — Industrial Trading & Sourcing; industrial form | info@ | `EMAIL_TO_SOURCING` (falls back to `EMAIL_TO_GENERAL`) |
| Contact — Business Services; business services form | info@ | `EMAIL_TO_GENERAL` |
| Contact — Food Trading & Export; food export quotation form | exports@ | `EMAIL_TO_EXPORTS` |

Defaults come from `src/config/site.ts`; the variables are only needed to
change a destination without a code change. Logic: `src/lib/email/routing.ts`.

## Sender identity — only one is needed

Every notification is sent **from one fixed sender** (`EMAIL_FROM`) and
**to** the routed inbox, with the visitor's address as **Reply-To**. Routing
only changes the recipient, so no other sender has to be authorised, and the
visitor's address is never used as the sender (that would fail SPF/DMARC).

- **Resend:** verifying the domain `achieveglobal.com.tr` authorises any
  sender on it. Use `no-reply@achieveglobal.com.tr` (no mailbox required).
- **SMTP:** the sender must be the mailbox you log in with (or an address
  that mailbox may "send as"), e.g. `EMAIL_FROM=ACHIEVE GLOBAL Website <info@achieveglobal.com.tr>`
  with `SMTP_USER=info@achieveglobal.com.tr`.
  ⚠ Some providers (notably Google Workspace/Gmail) file a message sent from
  info@ to info@ under *Sent* only, so it may not appear in the inbox. If you
  use SMTP with Google, create a separate sending mailbox (e.g.
  website@achieveglobal.com.tr) or use Resend.

## Option A — Resend (recommended)

1. Create an account at resend.com → *Domains* → add `achieveglobal.com.tr`.
2. Add the DNS records Resend shows (by default on a `send.` subdomain plus a
   `resend._domainkey` DKIM record). These **do not** replace your root MX,
   SPF or DMARC records — see "Protect existing email DNS" below.
3. Wait for *Verified*. Create an API key with **Sending access** only.
4. In the hosting dashboard (Vercel → Project → Settings → Environment
   Variables → Production), enter yourself — never in chat, code or GitHub:
   ```
   EMAIL_PROVIDER=resend
   EMAIL_FROM=ACHIEVE GLOBAL Website <no-reply@achieveglobal.com.tr>
   EMAIL_PROVIDER_API_KEY=<key from Resend>
   ```
5. Redeploy (variables apply to new deployments).

## Option B — SMTP (your existing mailbox provider)

```
EMAIL_PROVIDER=smtp
EMAIL_FROM=ACHIEVE GLOBAL Website <the SMTP login address>
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587          # or 465 with SMTP_SECURE=true
SMTP_SECURE=false
SMTP_USER=<mailbox login>
SMTP_PASSWORD=<app password>
```

Many providers require an app-specific password and/or enabling SMTP for
the mailbox. Ask your provider for host and port.

## Protect existing email DNS

Before changing any DNS record, export or screenshot the whole zone. Mail to
info@ already works, so:

- **Keep** the existing root `MX` records.
- **SPF:** a domain may have only **one** SPF `TXT` record on the root. If a
  provider asks for SPF on the root, merge its `include:` into the existing
  record instead of adding a second record.
- **DKIM:** add the provider's selector record; it does not affect others.
- **DMARC:** keep the existing `_dmarc` record. If none exists, you may add
  `v=DMARC1; p=none; rua=mailto:info@achieveglobal.com.tr` and tighten later.

Check the exact records against your providers' current documentation.

## Optional acknowledgement email

`EMAIL_SEND_ACKNOWLEDGEMENT=true` sends visitors a fixed, translated "we
received your inquiry" message from `EMAIL_FROM` with `EMAIL_REPLY_TO` as
Reply-To. It never repeats the visitor's text. Recommended only after the
basic delivery tests pass.

## Testing real delivery (required before launch)

Use a deployment (a Vercel preview URL is fine) with the variables set, and a
personal mailbox you control as the "visitor" address.

1. Submit the **industrial** form → arrives at info@.
2. Submit the **food export** form → arrives at exports@ (or info@ if the switch is off).
3. Submit the **business services** form → arrives at info@.
4. Submit the **contact** form once per category: General, Industrial,
   Business Services, Partnership, Other → info@; Food → exports@.
5. For each message: not in spam; subject starts with the form name; *Reply*
   addresses your personal mailbox.
6. If anything fails, open the hosting logs and search for `[inquiry]`
   (logs never contain API keys or form contents).
7. Record the date and result in `docs/TESTING_CHECKLIST.md`.

Local development without a provider: `EMAIL_PROVIDER=console npm run dev`
prints each email to the terminal.

## Spam protection and limits (unchanged)

- Hidden honeypot field; submissions that fill it are silently discarded.
- Submissions less than 3 seconds after page load are rejected.
- At most 8 submissions per IP per 10 minutes, per server instance
  (`src/lib/rate-limit.ts`). The client IP is read from `X-Real-IP` /
  `X-Forwarded-For`, which Vercel sets itself; on a self-hosted server the
  reverse proxy must overwrite these headers.
- Cross-site posts rejected (Origin check); bodies over 32 KB refused;
  messages with more than 4 web links rejected.
