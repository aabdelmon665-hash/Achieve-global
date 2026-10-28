# Information still required from the company

The website shows only facts that were provided. Missing items are hidden or
marked `[to be completed]` until supplied. Nothing below has been invented.

## Received

| Item | Status |
|---|---|
| Official logo | ✅ Integrated (header, footer, favicon, app icons, social image, structured data). Original kept at `assets/brand/achieve-global-logo-original.png`. |
| Official domain | ✅ `https://achieveglobal.com.tr` — set once in `src/config/site.ts`. |
| General email | ✅ info@achieveglobal.com.tr (existing mailbox). |
| Exports email | ⏳ exports@achieveglobal.com.tr — **to be created**; see `docs/EMAIL_SETUP.md` → Mailboxes. |

## Required before launch

| Item | Where it is used | Where to set it |
|---|---|---|
| Create exports@achieveglobal.com.tr (mailbox or alias to info@) — or set `EXPORTS_MAILBOX_ACTIVE = false` | Displayed on site; receives food/export inquiries | Mailbox provider / `src/config/site.ts` |
| Email delivery provider account and credentials (Resend API key or SMTP login), entered by you in the hosting dashboard | All forms | `docs/EMAIL_SETUP.md` |
| Registered company address | Privacy Policy (data controller), structured data | `src/config/site.ts` → `legal.registeredAddress` |
| MERSİS number | Privacy Policy | `legal.mersisNumber` |
| Trade registry number, tax office and number, KEP address (confirm with accountant/lawyer which must be displayed) | Legal pages / footer | `legal.*` |
| Approval of the wording listed in the readiness review (service promises, "no offices outside Türkiye", languages offered, business-services scope) | Content | dictionaries |
| Legal review of Privacy Policy, Cookie Policy, Terms of Use — incl. KVKK Art. 9 cross-border transfer for hosting/email providers | Legal pages | `src/i18n/dictionaries/*.ts` → `legal` |

## Approvals requested on the logo integration

- **Favicon crop:** at 16–48 px the tab icon shows the "A" portion of the
  emblem (the globe is partly cropped) because the full emblem is illegible
  at that size. Larger icons (192 px, Apple 180 px) use the complete emblem.
- **Dark backgrounds:** the logo's navy lettering is not visible on navy, so
  in the footer it sits on a white panel. No colours were changed.
- **Header size:** the stacked logo is shown at 72 px (desktop) / 58 px
  (mobile). A horizontal lockup (emblem beside the lettering) would read
  better at header size, but that changes the logo layout and is **not done
  without your approval** — or supply one from your designer.
- **Source quality:** the supplied file is a 1254 px raster PNG. A vector
  (SVG/AI/EPS) original would give the sharpest results on high-resolution
  screens and in print.

## Recommended

| Item | Notes |
|---|---|
| Genuine photography | Hero, industrial, food, business, about. Set in `src/config/media.ts`; until then line illustrations are shown. |
| Product catalogue: real photos, specifications, producer, verified certificates | `src/content/products.ts`; the section appears automatically. |
| Telephone number | Only if a staffed number exists. Not displayed until provided. |
| Social media profiles | Only real, active accounts → `social` in `src/config/site.ts`. |
| Dedicated sourcing inbox | Set `EMAIL_TO_SOURCING`. |
| Company profile PDF | `public/docs/`, linked from About. |
| Analytics choice | `NEXT_PUBLIC_GA_MEASUREMENT_ID`; update the Cookie Policy. |
| Native-speaker proofreading of Turkish and Arabic | All translations were written for this project. |
