# ACHIEVE GLOBAL — corporate website

Multilingual (English, Turkish, Arabic RTL) corporate website for
**ACHIEVE GLOBAL DANIŞMANLIK VE DIŞ TİCARET LİMİTED ŞİRKETİ**, Istanbul —
<https://achieveglobal.com.tr>.

Built with Next.js 16 (App Router), React 19, TypeScript and Tailwind CSS 4.

## Quick start

```bash
nvm use            # Node 22 (20.9+ works)
npm install
cp .env.example .env.local
# For local testing without a mail provider:  EMAIL_PROVIDER=console
npm run dev        # http://localhost:3000 → redirects to /en/
```

| Command | Purpose |
|---|---|
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build / server |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript (run `npx next typegen` first on a fresh clone) |
| `npm run check:i18n` | Confirms TR and AR translations match EN |

## Pages (each under `/en/`, `/tr/`, `/ar/`)

Home · About Us · Industrial Trading & Sourcing · Food Trading & Export ·
Business Services in Türkiye · Contact · Request a Quote · Privacy Policy ·
Cookie Policy · Terms of Use · localized 404.

## Project structure

```
src/
  app/[locale]/        pages (one folder per route) + layout, 404
  app/api/inquiry/     server-side form handler (validation, spam checks, email)
  app/sitemap.ts, robots.ts, icon.svg
  proxy.ts             redirects paths without a language prefix
  i18n/                locale config + dictionaries (all page text)
  config/              site.ts (company facts, emails), routes.ts, media.ts
  content/products.ts  food catalogue (empty until real products are supplied)
  components/          layout, sections, forms, art (SVG illustrations), consent, seo
  lib/                 forms (shared validation), email (provider, routing, templates), seo, analytics
docs/                  deployment, email setup, testing checklist, owner information
```

## Content principles

The site states only facts supplied by the company. It contains no
testimonials, statistics, certifications, client names, offices, phone
numbers or street addresses. Unverified legal identifiers are kept in
`src/config/site.ts` as `null` and appear as `[to be completed]` in the
legal pages until filled in.

## Documentation

- [Deployment & domain](docs/DEPLOYMENT.md)
- [Email configuration](docs/EMAIL_SETUP.md)
- [Testing checklist](docs/TESTING_CHECKLIST.md)
- [Information still required](docs/OWNER_INFORMATION_REQUIRED.md)

The legal page texts are templates written with KVKK and GDPR in mind. They
are not a statement of compliance and should be reviewed by a qualified
lawyer before launch.
