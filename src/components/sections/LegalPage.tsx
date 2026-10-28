import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { siteConfig } from "@/config/site";
import { crumbsFor } from "@/lib/crumbs";
import { fill } from "@/lib/paths";
import { PageHero } from "./PageHero";

type LegalDoc = Dictionary["legal"]["privacy"];

export function LegalPage({
  locale,
  dict,
  doc,
  route,
}: {
  locale: Locale;
  dict: Dictionary;
  doc: LegalDoc;
  route: "privacy" | "cookies" | "terms";
}) {
  const ph = dict.legal.placeholder;
  const vars = {
    legalName: siteConfig.legalName,
    website: siteConfig.url.replace("https://", ""),
    address: siteConfig.legal.registeredAddress ?? ph,
    mersis: siteConfig.legal.mersisNumber ?? ph,
    privacyEmail: siteConfig.emails.privacy,
    generalEmail: siteConfig.emails.general,
  };
  const t = (s: string) => fill(s, vars);
  const updated = new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(new Date(doc.updated));

  return (
    <>
      <PageHero eyebrow={dict.footer.legalTitle} title={doc.title} crumbs={crumbsFor(locale, dict, route, doc.title)} crumbLabel={dict.nav.breadcrumb} />
      <article className="container-page py-16 lg:py-20">
        <div className="prose-legal max-w-3xl">
          <p className="text-sm text-ink-muted">
            {dict.common.lastUpdated}: <time dateTime={doc.updated}>{updated}</time>
          </p>
          <p className="mt-6 text-lg !text-charcoal">{t(doc.intro)}</p>
          {doc.sections.map((s) => (
            <section key={s.heading}>
              <h2>{s.heading}</h2>
              {s.paragraphs.map((p) => <p key={p}>{t(p)}</p>)}
              {s.list && (
                <ul>
                  {s.list.map((li) => <li key={li}>{t(li)}</li>)}
                </ul>
              )}
              {s.after?.map((p) => <p key={p}>{t(p)}</p>)}
            </section>
          ))}
        </div>
      </article>
    </>
  );
}
