import type { Metadata } from "next";
import { getDictionary } from "@/i18n/get-dictionary";
import { resolveLocale } from "@/lib/locale-params";
import { pageMetadata } from "@/lib/seo";
import { crumbsFor } from "@/lib/crumbs";
import { PageHero } from "@/components/sections/PageHero";
import { DivisionHeroVisual } from "@/components/sections/DivisionHeroVisual";
import { ServiceList } from "@/components/sections/ServiceList";
import { CtaBand } from "@/components/sections/CtaBand";
import { InquirySection } from "@/components/forms/InquirySection";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

type Props = PageProps<"/[locale]/business-services-turkiye">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const d = getDictionary(locale);
  return pageMetadata({ locale, route: "business", title: d.business.meta.title, description: d.business.meta.description });
}

export default async function BusinessPage({ params }: Props) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  const p = dict.business;

  return (
    <>
      <PageHero
        eyebrow={p.hero.eyebrow}
        title={p.hero.title}
        text={p.hero.text}
        crumbs={crumbsFor(locale, dict, "business", dict.nav.business)}
        crumbLabel={dict.nav.breadcrumb}
        aside={<DivisionHeroVisual division="business" locale={locale} />}
      >
        <ButtonLink href="#inquiry" variant="gold" arrow>{dict.common.goToForm}</ButtonLink>
      </PageHero>

      <section aria-labelledby="intro-title" className="py-20 lg:py-24">
        <div className="container-page grid gap-10 lg:grid-cols-12">
          <h2 id="intro-title" className="text-3xl font-semibold tracking-tight lg:col-span-5">{p.intro.title}</h2>
          <p className="text-lg leading-relaxed text-ink-muted lg:col-span-7">{p.intro.text}</p>
        </div>
      </section>

      <section aria-labelledby="services-title" className="pb-20 lg:pb-24">
        <div className="container-page">
          <h2 id="services-title" className="mb-10 text-2xl font-semibold tracking-tight">{p.sectionsTitle}</h2>
          <ServiceList items={p.items} />
        </div>
      </section>

      <section aria-labelledby="disclaimer-title" className="pb-20 lg:pb-28">
        <div className="container-page">
          <div className="border border-line border-s-2 border-s-gold bg-mist p-8 sm:p-10">
            <h2 id="disclaimer-title" className="flex items-center gap-3 text-xl font-semibold">
              <Icon name="info" className="h-5 w-5 text-gold-ink" />
              {p.disclaimer.title}
            </h2>
            <ul className="mt-6 grid gap-4 md:grid-cols-2">
              {p.disclaimer.points.map((pt) => (
                <li key={pt} className="flex items-start gap-3 text-sm leading-relaxed text-charcoal">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-gold" aria-hidden="true" />
                  {pt}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <InquirySection
        locale={locale}
        dict={dict}
        formType="business"
        title={p.form.title}
        intro={p.form.intro}
        submitLabel={p.form.submit}
        recipient="general"
      />

      <CtaBand locale={locale} dict={dict} />
    </>
  );
}
