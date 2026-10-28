# Deployment

The site is a standard Next.js 16 application. Pages are pre-rendered at
build time; only `/api/inquiry/` runs on demand. It needs a Node.js host:
it cannot be deployed as a purely static export.

Supported targets:

- **Cloudflare Workers** (free plan) via the OpenNext adapter — configured in
  this repository (`wrangler.jsonc`, `open-next.config.ts`). See below.
- **Vercel** (zero configuration; a commercial site needs the Pro plan).
- Any Node 20+ server (`npm run build && npm start`).

## Cloudflare Workers (Workers Builds from GitHub)

Settings on *Workers & Pages → Create → Import a repository → Set up your application*:

| Field | Value |
|---|---|
| Project name | `achieve-global` (must equal `name` in `wrangler.jsonc`) |
| Build command | `npx opennextjs-cloudflare build` |
| Deploy command | `npx opennextjs-cloudflare deploy` |
| Non-production branch deploy command | `npx opennextjs-cloudflare upload` |
| Path (root directory) | `/` |
| API token | let Cloudflare create one |

Why not `npm run build` / `npx wrangler deploy`: `npm run build` only runs
`next build` and does not produce the Worker in `.open-next/`; and
`wrangler deploy` skips copying the pre-rendered pages into the static-assets
cache, so every visit would be re-rendered (slower, and uses CPU time that is
limited on the free plan). `opennextjs-cloudflare build` runs `npm run build`
itself — keep that script as `next build`.

Production branch: the branch to publish from (currently
`claude/achieve-global-website` until a `main` branch exists).

Runtime variables (email): *Worker → Settings → Variables and Secrets* — add
`EMAIL_PROVIDER`, `EMAIL_FROM` as text and `EMAIL_PROVIDER_API_KEY` as a
**Secret**. `keep_vars: true` in `wrangler.jsonc` stops Git deployments from
deleting dashboard variables. Use **Resend** on Cloudflare: it works over
HTTPS; SMTP over TLS from Workers has not been tested.

Build variables: only `NEXT_PUBLIC_GA_MEASUREMENT_ID`, and only if analytics
is enabled (*Settings → Build → Variables and secrets*), because it is read
at build time.

Local check of the Cloudflare build: `npm run cf:preview` (needs no account).
Put local-only variables in `.dev.vars` (git-ignored).

Free-plan notes: Worker bundle ≈1.4 MiB gzipped (limit 3 MiB). Pages are
served from the pre-rendered cache. Image optimisation is disabled
(`images.unoptimized`) because Cloudflare's optimizer needs Cloudflare
Images; logo files are pre-sized and photos must be exported at web size.

Custom domain on Cloudflare: `achieveglobal.com.tr` must use Cloudflare DNS
(free). When adding the site, Cloudflare imports existing records — compare
them with your current DNS export **before** changing nameservers, make sure
every `MX`, SPF/DKIM/DMARC `TXT` and mail-related `CNAME`/`A` record is
present, and keep mail hostnames (e.g. `mail`, `webmail`, autodiscover) as
**DNS only** (grey cloud). Then *Worker → Settings → Domains & Routes → Add →
Custom domain* for `achieveglobal.com.tr` and `www.achieveglobal.com.tr`.

## Vercel

### Deploy (Vercel)

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
The reverse proxy must set `X-Real-IP` (and overwrite any client-supplied
value), otherwise the form rate limit can be bypassed:
`proxy_set_header X-Real-IP $remote_addr;` in Nginx.

## 2. Connect the domain (Vercel)

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
- Logo: replace `assets/brand/achieve-global-logo-original.png` and run
  `node scripts/build-brand-assets.mjs` to regenerate the header/footer logo,
  favicon, app icons and `public/logo.png`. The social image
  `public/og/achieve-global-og.png` is a separate 1200×630 file.
- Exports mailbox not ready: set `EXPORTS_MAILBOX_ACTIVE = false` in
  `src/config/site.ts` (see `docs/EMAIL_SETUP.md`).
- Product catalogue: `src/content/products.ts`.
- New page: add a slug in `src/config/routes.ts`, a folder under
  `src/app/[locale]/`, and translations in the dictionaries.
- New language: add it to `src/i18n/config.ts`, create a dictionary file
  typed as `Dictionary`, and register it in `src/i18n/get-dictionary.ts`.

Before pushing: `npm run lint && npm run typecheck && npm run check:i18n && npm run build`.
