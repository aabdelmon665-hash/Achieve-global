import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { siteConfig } from "@/config/site";
import { href } from "@/lib/paths";
import { analyticsAvailable } from "@/lib/analytics";
import { EmailLink } from "@/components/ui/EmailLink";
import { CookieSettingsButton } from "@/components/consent/CookieSettingsButton";
import { Logo } from "./Logo";

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const f = dict.footer;
  const n = dict.nav;
  const linkClass = "text-sm text-white/70 transition-colors hover:text-white";
  const headingClass = "mb-5 text-xs font-semibold tracking-[0.16em] text-gold-soft uppercase";

  return (
    <footer className="on-dark bg-navy-950 text-white">
      <div className="container-page grid gap-12 py-16 lg:grid-cols-12 lg:py-20">
        <div className="lg:col-span-4">
          <Logo tone="light" />
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/65">{f.tagline}</p>
          <p className="mt-6 text-sm font-medium text-white/85">{dict.common.location}</p>
        </div>

        <nav aria-labelledby="footer-divisions" className="lg:col-span-3">
          <h2 id="footer-divisions" className={headingClass}>
            {f.divisionsTitle}
          </h2>
          <ul className="space-y-3">
            <li><Link className={linkClass} href={href(locale, "industrial")}>{n.industrial}</Link></li>
            <li><Link className={linkClass} href={href(locale, "food")}>{n.food}</Link></li>
            <li><Link className={linkClass} href={href(locale, "business")}>{n.business}</Link></li>
          </ul>
        </nav>

        <nav aria-labelledby="footer-company" className="lg:col-span-2">
          <h2 id="footer-company" className={headingClass}>
            {f.companyTitle}
          </h2>
          <ul className="space-y-3">
            <li><Link className={linkClass} href={href(locale, "about")}>{n.about}</Link></li>
            <li><Link className={linkClass} href={href(locale, "quote")}>{n.requestQuote}</Link></li>
            <li><Link className={linkClass} href={href(locale, "contact")}>{n.contact}</Link></li>
          </ul>
        </nav>

        <div className="lg:col-span-3">
          <h2 className={headingClass}>
            {f.contactTitle}
          </h2>
          <dl className="space-y-4 text-sm">
            <div>
              <dt className="text-white/50">{dict.common.generalInquiries}</dt>
              <dd><EmailLink email={siteConfig.emails.general} className="text-white/85 hover:text-white" /></dd>
            </div>
            <div>
              <dt className="text-white/50">{dict.common.exportsInquiries}</dt>
              <dd><EmailLink email={siteConfig.emails.exports} className="text-white/85 hover:text-white" /></dd>
            </div>
            <div>
              <dt className="text-white/50">{dict.common.officialWebsite}</dt>
              <dd>
                <a href={siteConfig.url} dir="ltr" className="text-white/85 hover:text-white">
                  {siteConfig.url.replace("https://", "")}
                </a>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="border-t border-line-dark">
        <div className="container-page flex flex-col gap-4 py-6 text-xs text-white/55 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} <span dir="ltr">{siteConfig.legalName}</span>. {f.rights}
          </p>
          <nav aria-label={f.legalTitle}>
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              <li><Link className="hover:text-white" href={href(locale, "privacy")}>{f.privacy}</Link></li>
              <li><Link className="hover:text-white" href={href(locale, "cookies")}>{f.cookies}</Link></li>
              <li><Link className="hover:text-white" href={href(locale, "terms")}>{f.terms}</Link></li>
              {analyticsAvailable && (
                <li><CookieSettingsButton className="hover:text-white">{f.cookieSettings}</CookieSettingsButton></li>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
