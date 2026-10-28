# Information still required from the company

The website deliberately shows only facts that were provided. The items
below are missing, and the related content is hidden or marked
`[to be completed]` until they are supplied.

## Required before launch

| Item | Where it is used | Where to set it |
|---|---|---|
| Email delivery provider and credentials (Resend API key or SMTP login) | All forms | Hosting environment variables — `docs/EMAIL_SETUP.md` |
| Registered company address | Privacy Policy (data controller), structured data | `src/config/site.ts` → `legal.registeredAddress` |
| MERSİS number | Privacy Policy | `legal.mersisNumber` |
| Legal review of Privacy Policy, Cookie Policy and Terms of Use (KVKK/GDPR) | Legal pages | `src/i18n/dictionaries/*.ts` → `legal` |
| Confirmation of which business services the company is legally permitted and operationally ready to offer | Business Services page | `business.items` in the dictionaries |
| Confirmation of activity descriptions (industrial, food) | Division pages | dictionaries |

## Recommended

| Item | Notes |
|---|---|
| Official logo (SVG + PNG) | Current mark is a typographic placeholder: `src/components/layout/Logo.tsx`, `src/app/icon.svg`, `public/logo.png`, `public/og/`. |
| Genuine photography | Industrial, food, business, about, hero. Set in `src/config/media.ts`. Without photos, line illustrations are shown. |
| Trade registry number, tax office and tax number, KEP address | Often expected in Turkish company website footers / legal pages (Turkish Commercial Code art. 39 and related rules — confirm with your accountant/lawyer). Fields exist in `src/config/site.ts`. |
| Telephone number | Only if a staffed number exists. Not displayed until provided. |
| Social media profiles | Only real, active accounts. Add to `social` in `src/config/site.ts`. |
| Dedicated sourcing inbox | Set `EMAIL_TO_SOURCING`. |
| Product catalogue: real photos, specifications, producer, verified certificates | `src/content/products.ts`; the catalogue section appears automatically. |
| Company profile PDF | Place in `public/docs/` and link from the About page. |
| Analytics choice (e.g. Google Analytics 4, or a cookieless tool) | Set `NEXT_PUBLIC_GA_MEASUREMENT_ID`; update the Cookie Policy. |
| Native-speaker proofreading of the Turkish and Arabic text | All translations were written for this project and should be reviewed. |
