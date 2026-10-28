# Deployment

The site is a standard Next.js 16 application. Pages are pre-rendered at
build time; only `/api/inquiry/` runs on demand. It needs a Node.js host:
it cannot be deployed as a purely static export.

**Recommended:** Vercel (zero configuration). Netlify, Render, Railway, or any
Node 20+ server (`npm run build && npm start`) also work.

## 1. Deploy (Vercel)

1. Push this repository to GitHub.
2. In Vercel: *Add New → Project*, import the repository. The framework is
   detected automatically. Node version: 20 or 22.
3. *Settings → Environment Variables*: add the variables from `.env.example`
   for the **Production** environment (see `docs/EMAIL_SETUP.md`).
4. Deploy. Each push to the main branch redeploys automatically; pull
   requests get preview URLs.

### Self-hosted Node server

```bash
npm ci
npm run build
PORT=3000 npm start      # put behind Nginx/Caddy for HTTPS
```

Set the environment variables in the process manager (systemd, PM2, Docker).

## 2. Connect the domain

In Vercel: *Settings → Domains*, add `achieveglobal.com.tr` and
`www.achieveglobal.com.tr`. Set `achieveglobal.com.tr` as primary and let
`www` redirect to it (the site's canonical URLs use the bare domain).

Vercel then lists the exact DNS records to create at your DNS provider,
typically:

| Type | Name | Value |
|---|---|---|
| A | `@` | the IP address shown by Vercel |
| CNAME | `www` | the CNAME target shown by Vercel |

Use the values Vercel shows at the time — they can change.

### Do not break existing email

Only add or change the `A`/`CNAME` records for `@` and `www`. **Do not touch
the `MX`, SPF (`TXT v=spf1 …`), DKIM or `_dmarc` records** that deliver mail
to `info@` and `exports@`. If you move DNS hosting to a new provider, copy
every existing record first. See `docs/EMAIL_SETUP.md`.

## 3. HTTPS

Vercel issues and renews TLS certificates automatically once DNS resolves.
The site sends `Strict-Transport-Security`, so confirm HTTPS works on both
the bare domain and `www` before announcing the site.

## 4. Redirects already built in

- `/` → `/en/` (308). All other paths without a language prefix → `/en/…`.
- URLs without a trailing slash → with trailing slash.
- Unknown pages render a translated 404 page with `noindex`.

If an earlier website existed with different URLs, add permanent redirects
for important old pages in `next.config.ts` (`async redirects()`).

## 5. Search engines

1. Verify the domain in Google Search Console (DNS `TXT` verification —
   this adds a record and does not affect email) and in Bing Webmaster Tools.
2. Submit `https://achieveglobal.com.tr/sitemap.xml`.
3. Use *URL Inspection* on `/en/`, `/tr/`, `/ar/` to request indexing.
4. Check `https://achieveglobal.com.tr/robots.txt` is reachable.

Indexing takes days to weeks; no ranking is guaranteed.

## 6. Updating the site

- Text: `src/i18n/dictionaries/{en,tr,ar}.ts` (keep all three in sync; run
  `npm run check:i18n`).
- Company facts, emails, legal identifiers: `src/config/site.ts`.
- Photos: `src/config/media.ts` + files in `public/images/`.
- Product catalogue: `src/content/products.ts`.
- New page: add a slug in `src/config/routes.ts`, a folder under
  `src/app/[locale]/`, and translations in the dictionaries.
- New language: add it to `src/i18n/config.ts`, create a dictionary file
  typed as `Dictionary`, and register it in `src/i18n/get-dictionary.ts`.

Before pushing: `npm run lint && npm run typecheck && npm run check:i18n && npm run build`.
