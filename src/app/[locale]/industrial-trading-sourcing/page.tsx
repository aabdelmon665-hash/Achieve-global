import type { Metadata } from "next";
import { getDictionary } from "@/i18n/get-dictionary";
import { resolveLocale } from "@/lib/locale-params";
import { pageMetadata } from "@/lib/seo";
import { crumbsFor } from "@/lib/crumbs";
import { PageHero } from "@/components/sections/PageHero";
import { DivisionHeroVisual } from "@/components/sections/DivisionHeroVisual";
import { ServiceList } from "@/components/sections/ServiceList";
import { Notice } from "@/components/sections/Notice";
import { CtaBand } from "@/components/sections/CtaBand";
import { InquirySection } from "@/components/forms/InquirySection";
import { ButtonLink } from "@/components/ui/Button";

type Props = PageProps<"/[locale]/industrial-trading-sourcing">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const d = getDictionary(locale);
  return pageMetadata({ locale, route: "industrial", title: d.industrial.meta.title, description: d.industrial.meta.description });
}

export default async function IndustrialPage({ params }: Props) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  const p = dict.industrial;

  return (
    <>
      <PageHero
        eyebrow={p.hero.eyebrow}
        title={p.hero.title}
        text={p.hero.text}
        crumbs={crumbsFor(locale, dict, "industrial", dict.nav.industrial)}
        crumbLabel={dict.nav.breadcrumb}
        aside={<DivisionHeroVisual division="industrial" locale={locale} />}
      >
        <ButtonLink href="#inquiry" variant="gold" arrow>{dict.common.goToForm}</ButtonLink>
      </PageHero>

      <section aria-labelledby="intro-title" className="py-20 lg:py-24">
        <div className="container-page grid gap-10 lg:grid-cols-12">
          <h2 id="intro-title" className="text-3xl font-semibold tracking-tight lg:col-span-5">{p.intro.title}</h2>
          <p className="text-lg leading-relaxed text-ink-muted lg:col-span-7">{p.intro.text}</p>
        </div>
      </section>

      <section aria-labelledby="services-title" className="pb-20 lg:pb-28">
        <div className="container-page">
          <h2 id="services-title" className="mb-10 text-2xl font-semibold tracking-tight">{p.sectionsTitle}</h2>
          <ServiceList items={p.items} />
          <div className="mt-10">
            <Notice>{p.notice}</Notice>
          </div>
        </div>
      </section>

      <InquirySection
        locale={locale}
        dict={dict}
        formType="industrial"
        title={p.form.title}
        intro={p.form.intro}
        submitLabel={p.form.submit}
        recipient="general"
      />

      <CtaBand locale={locale} dict={dict} />
    </>
  );
}
