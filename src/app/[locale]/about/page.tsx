import type { Metadata } from "next";
import { getDictionary } from "@/i18n/get-dictionary";
import { resolveLocale } from "@/lib/locale-params";
import { pageMetadata } from "@/lib/seo";
import { crumbsFor } from "@/lib/crumbs";
import { siteConfig } from "@/config/site";
import { PageHero } from "@/components/sections/PageHero";
import { DivisionCards } from "@/components/sections/DivisionCards";
import { CtaBand } from "@/components/sections/CtaBand";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";

export async function generateMetadata({ params }: PageProps<"/[locale]/about">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const d = getDictionary(locale);
  return pageMetadata({ locale, route: "about", title: d.about.meta.title, description: d.about.meta.description });
}

export default async function AboutPage({ params }: PageProps<"/[locale]/about">) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  const a = dict.about;

  return (
    <>
      <PageHero
        eyebrow={a.hero.eyebrow}
        title={a.hero.title}
        text={a.hero.text}
        crumbs={crumbsFor(locale, dict, "about", dict.nav.about)}
        crumbLabel={dict.nav.breadcrumb}
      />

      <section aria-labelledby="overview-title" className="py-20 lg:py-28">
        <div className="container-page grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 id="overview-title" className="text-3xl font-semibold tracking-tight">{a.overview.title}</h2>
            <div className="mt-6 space-y-5 text-lg leading-relaxed text-ink-muted">
              {a.overview.paragraphs.map((p) => <p key={p}>{p}</p>)}
            </div>
          </div>
          <aside aria-labelledby="facts-title" className="lg:col-span-5">
            <div className="border border-line bg-mist p-8">
              <h2 id="facts-title" className="text-sm font-semibold tracking-[0.14em] text-gold-ink uppercase">{a.facts.title}</h2>
              <dl className="mt-6 divide-y divide-line">
                {a.facts.items.map((f) => (
                  <div key={f.label} className="py-4 first:pt-0">
                    <dt className="text-xs font-medium tracking-wide text-ink-muted uppercase">{f.label}</dt>
                    <dd className="mt-1 font-medium text-navy-900">{f.value}</dd>
                  </div>
                ))}
                <div className="py-4 last:pb-0">
                  <dt className="text-xs font-medium tracking-wide text-ink-muted uppercase">{dict.common.officialWebsite}</dt>
                  <dd className="mt-1 font-medium text-navy-900" dir="ltr">{siteConfig.url.replace("https://", "")}</dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </section>

      <section aria-labelledby="about-divisions" className="bg-mist py-20 lg:py-28">
        <div className="container-page">
          <SectionHeading id="about-divisions" title={a.divisions.title} intro={a.divisions.intro} />
          <div className="mt-14">
            <DivisionCards locale={locale} dict={dict} />
          </div>
        </div>
      </section>

      <section aria-labelledby="principles-title" className="py-20 lg:py-28">
        <div className="container-page">
          <SectionHeading id="principles-title" title={a.principles.title} />
          <ul className="mt-14 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {a.principles.items.map((p, i) => (
              <li key={p.title} className="bg-white p-8">
                <span className="font-display text-sm font-semibold text-gold-ink" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-4 text-lg font-semibold">{p.title}</h3>
                <p className="mt-3 leading-relaxed text-ink-muted">{p.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-line py-20 lg:py-28">
        <div className="container-page grid gap-14 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">{a.relationships.title}</h2>
            <div className="mt-6 space-y-5 leading-relaxed text-ink-muted">
              {a.relationships.paragraphs.map((p) => <p key={p}>{p}</p>)}
            </div>
          </div>
          <div className="border-s-2 border-gold ps-8 lg:ps-12">
            <h2 className="text-3xl font-semibold tracking-tight">{a.commitment.title}</h2>
            <p className="mt-6 leading-relaxed text-ink-muted">{a.commitment.text}</p>
            <ul className="mt-8 space-y-4">
              {a.commitment.points.map((p) => (
                <li key={p} className="flex items-start gap-3">
                  <Icon name="check" className="mt-0.5 h-5 w-5 shrink-0 text-gold-ink" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <CtaBand locale={locale} dict={dict} />
    </>
  );
}
