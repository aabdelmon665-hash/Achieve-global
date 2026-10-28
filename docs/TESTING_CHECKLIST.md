# Launch testing checklist

Tick each item on the **production** domain after deployment.

## Already verified during development (local production build)

- [x] `npm run build` succeeds; 30 localized pages pre-render (10 pages × 3 languages).
- [x] `npm run lint`, `npm run typecheck`, `npm run check:i18n` pass.
- [x] `/` redirects to `/en/`; paths without a language prefix redirect to `/en/…`.
- [x] Unknown URLs return HTTP 404 with a translated page.
- [x] Arabic pages render with `dir="rtl"`, mirrored layout and Arabic font.
- [x] No horizontal overflow at 390 px, 768 px and 1440 px on sampled pages.
- [x] Mobile menu opens, closes, and the language switcher keeps the current page.
- [x] Client and server validation show translated, field-level errors; focus moves to the first invalid field.
- [x] Submissions delivered through SMTP to a **local test server** (not a real mailbox) with correct routing:
      food form and contact/Food → exports@; industrial, business, and contact/General, Industrial,
      Business, Partnership, Other → info@.
- [x] With `EXPORTS_MAILBOX_ACTIVE = false`, exports@ disappears from every page and food inquiries go to info@.
- [x] Every page in all three languages shows only info@ and exports@ as clickable `mailto:` links.
- [x] Official logo renders in the header (72 px desktop / 58 px mobile) and footer (white panel) in EN, TR and AR; favicon, app icons and social image served.
- [x] Reply-To is the visitor's address; HTML in submissions is escaped.
- [x] Without email configuration the API returns 503 and the form tells visitors to email directly.
- [x] Honeypot, 3-second minimum, cross-origin rejection and rate limiting respond as designed.
- [x] Security headers (CSP, HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy) present.
- [x] Canonical and hreflang (en, tr, ar, x-default) tags on every page; sitemap lists all 30 URLs with alternates.
- [x] No analytics or tracking script loads without `NEXT_PUBLIC_GA_MEASUREMENT_ID` and consent.

## To verify on production

- [ ] HTTPS valid on `achieveglobal.com.tr` and `www` (www redirects to the bare domain).
- [ ] exports@ created (or switch set to false) **before** the site goes live.
- [ ] Email provider variables set; real-mailbox tests in `docs/EMAIL_SETUP.md` → "Testing real delivery" all pass. Date/result: ____________
- [ ] Replying to a notification addresses the visitor.
- [ ] Existing mail to info@ and exports@ still arrives after DNS changes.
- [ ] `/sitemap.xml` and `/robots.txt` load; sitemap submitted in Search Console.
- [ ] Social share preview (LinkedIn Post Inspector / Facebook Sharing Debugger) shows the title and image.
- [ ] Every page checked once on a real iPhone and Android phone, in each language.
- [ ] Lighthouse (mobile) run on `/en/`, `/ar/` and one form page; review any accessibility issues.
- [ ] Keyboard-only pass: skip link, menu, language switcher, forms and consent banner.
- [ ] Legal pages reviewed by a qualified Turkish lawyer; placeholders completed.
- [ ] If analytics is enabled: banner appears, "Reject" loads no analytics requests (check DevTools → Network), Cookie Policy names the provider.
- [ ] Owner information list (`docs/OWNER_INFORMATION_REQUIRED.md`) completed.
