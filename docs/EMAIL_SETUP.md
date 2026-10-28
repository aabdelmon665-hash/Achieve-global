# Email configuration

All forms post to `/api/inquiry/`, which validates input on the server and
sends an email through the provider configured in environment variables.

> **Status:** email delivery has **not** been connected to a live provider.
> Routing and delivery were tested against a local SMTP test server only.
> Until the variables below are set in production, the forms show visitors a
> message asking them to email the company directly (HTTP 503). Nothing is
> lost silently.

## Routing

| Form / category | Destination variable | Default |
|---|---|---|
| Contact — General, Business Services, Partnership, Other | `EMAIL_TO_GENERAL` | info@achieveglobal.com.tr |
| Contact — Industrial Trading & Sourcing | `EMAIL_TO_SOURCING` → `EMAIL_TO_GENERAL` | info@achieveglobal.com.tr |
| Contact — Food Trading & Export | `EMAIL_TO_EXPORTS` | exports@achieveglobal.com.tr |
| Industrial inquiry form | `EMAIL_TO_SOURCING` → `EMAIL_TO_GENERAL` | info@achieveglobal.com.tr |
| Food export quotation form | `EMAIL_TO_EXPORTS` | exports@achieveglobal.com.tr |
| Business services form | `EMAIL_TO_GENERAL` | info@achieveglobal.com.tr |

The routing logic lives in `src/lib/email/routing.ts`. Each notification has
the sender's address as **Reply-To**, so the team can answer directly.

## Option A — Resend (recommended)

1. Create an account at resend.com and add the domain `achieveglobal.com.tr`.
2. Resend shows DNS records (SPF `TXT` on a `send` subdomain, DKIM `TXT`, and
   an optional `MX` on the `send` subdomain). **Add them alongside your
   existing records — do not remove or replace your current MX, SPF or DMARC
   records** (see "Protect existing email DNS" below).
3. Wait until the domain shows *Verified*.
4. Create an API key with "Sending access" only.
5. Set in production:
   ```
   EMAIL_PROVIDER=resend
   EMAIL_FROM=ACHIEVE GLOBAL Website <no-reply@achieveglobal.com.tr>
   EMAIL_PROVIDER_API_KEY=re_…
   ```

## Option B — SMTP (existing mailbox provider)

Use your mailbox provider's authenticated SMTP (e.g. Google Workspace,
Microsoft 365, Yandex, or your hosting company's mail server). Many providers
require an *app password* rather than the normal login password.

```
EMAIL_PROVIDER=smtp
EMAIL_FROM=ACHIEVE GLOBAL Website <no-reply@achieveglobal.com.tr>
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=no-reply@achieveglobal.com.tr
SMTP_PASSWORD=…
```

`EMAIL_FROM` should be an address the SMTP account is allowed to send as.

## Protect existing email DNS

Before changing any DNS record, export or screenshot the current zone. If
`info@` and `exports@` already receive mail:

- **Keep** the existing `MX` records for the root domain.
- **SPF:** a domain may have only **one** SPF `TXT` record on the root. If
  your sending provider asks you to add SPF on the root, merge the `include:`
  into the existing record instead of adding a second one.
- **DKIM:** add the provider's selector record; it does not affect others.
- **DMARC:** keep the existing `_dmarc` record. If none exists, start with
  `v=DMARC1; p=none; rua=mailto:info@achieveglobal.com.tr` and tighten later.

Always check the exact records against your provider's current documentation.

## Optional acknowledgement email

Set `EMAIL_SEND_ACKNOWLEDGEMENT=true` to send visitors a fixed, translated
"we received your inquiry" message. It never repeats the visitor's text, so
the form cannot be abused to relay content to third parties.

## Testing delivery

1. Deploy with the variables set.
2. Submit each form (industrial, food, business, and contact with each
   category) using a real mailbox you control as the sender address.
3. Confirm each notification arrives in the expected inbox (table above),
   is not in spam, and that "Reply" addresses the sender.
4. Check the hosting logs for `[inquiry]` messages if anything fails. Logs
   never include API keys or form contents.

Local development without a provider: `EMAIL_PROVIDER=console npm run dev`
prints each email to the terminal.

## Spam protection and limits

- Hidden honeypot field; submissions that fill it are silently discarded.
- Submissions made less than 3 seconds after the page loads are rejected.
- At most 8 submissions per IP address per 10 minutes, per server instance
  (`src/lib/rate-limit.ts`). For strict limits across many serverless
  instances, add a shared store (e.g. Upstash Redis) or WAF rate-limit rules.
- Cross-site posts are rejected (Origin check); bodies over 32 KB are refused.
- Messages with more than 4 web links are rejected.
