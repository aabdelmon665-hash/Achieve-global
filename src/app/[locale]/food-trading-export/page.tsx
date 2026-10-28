import type { Metadata } from "next";
import Image from "next/image";
import { getDictionary } from "@/i18n/get-dictionary";
import { resolveLocale } from "@/lib/locale-params";
import { pageMetadata } from "@/lib/seo";
import { crumbsFor } from "@/lib/crumbs";
import { products } from "@/content/products";
import { PageHero } from "@/components/sections/PageHero";
import { DivisionHeroVisual } from "@/components/sections/DivisionHeroVisual";
import { ServiceList } from "@/components/sections/ServiceList";
import { Notice } from "@/components/sections/Notice";
import { CtaBand } from "@/components/sections/CtaBand";
import { InquirySection } from "@/components/forms/InquirySection";
import { ButtonLink } from "@/components/ui/Button";
import { ZinoraShowcase } from "@/components/sections/ZinoraShowcase";

type Props = PageProps<"/[locale]/food-trading-export">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const d = getDictionary(locale);
  return pageMetadata({ locale, route: "food", title: d.food.meta.title, description: d.food.meta.description });
}

export default async function FoodPage({ params }: Props) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  const p = dict.food;

  return (
    <>
      <PageHero
        eyebrow={p.hero.eyebrow}
        title={p.hero.title}
        text={p.hero.text}
        crumbs={crumbsFor(locale, dict, "food", dict.nav.food)}
        crumbLabel={dict.nav.breadcrumb}
        aside={<DivisionHeroVisual division="food" locale={locale} caption={p.showcase.caption} />}
      >
        <ButtonLink href="#inquiry" variant="gold" arrow>{dict.common.goToForm}</ButtonLink>
      </PageHero>

      <ZinoraShowcase locale={locale} dict={dict} />

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
        </div>
      </section>

      <section aria-labelledby="roles-title" className="border-t border-line bg-mist py-20 lg:py-24">
        <div className="container-page">
          <h2 id="roles-title" className="text-3xl font-semibold tracking-tight">{p.distinction.title}</h2>
          <p className="mt-4 text-lg text-ink-muted">{p.distinction.intro}</p>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {[p.distinction.traded, p.distinction.manufactured].map((block, i) => (
              <div key={block.title} className={`border bg-white p-8 ${i === 0 ? "border-t-2 border-line border-t-navy-900" : "border-t-2 border-line border-t-gold"}`}>
                <h3 className="text-lg font-semibold">{block.title}</h3>
                <p className="mt-3 leading-relaxed text-ink-muted">{block.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Notice title={p.compliance.title}>{p.compliance.text}</Notice>
          </div>
        </div>
      </section>

      {products.length > 0 && (
        <section aria-labelledby="catalog-title" className="py-20 lg:py-24">
          <div className="container-page">
            <h2 id="catalog-title" className="text-3xl font-semibold tracking-tight">{p.catalog.title}</h2>
            <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <li key={product.id} className="flex flex-col border border-line bg-white">
                  <div className="relative aspect-square bg-mist">
                    <Image src={product.image} alt={product.imageAlt[locale]} fill sizes="(min-width: 1024px) 33vw, 50vw" className="object-contain p-6" />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-xs font-semibold tracking-wider text-gold-ink uppercase">{product.category[locale]}</p>
                    <h3 className="mt-2 text-lg font-semibold">{product.name[locale]}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">{product.description[locale]}</p>
                    <dl className="mt-4 space-y-1 border-t border-line pt-4 text-sm">
                      <div><dt className="inline text-ink-muted">{p.catalog.producedBy}: </dt><dd className="inline">{product.producer[locale]}</dd></div>
                      {product.packaging && <div><dt className="inline text-ink-muted">{p.catalog.packaging}: </dt><dd className="inline">{product.packaging[locale]}</dd></div>}
                      {product.certifications?.length ? <div><dt className="inline text-ink-muted">{p.catalog.certifications}: </dt><dd className="inline">{product.certifications.join(", ")}</dd></div> : null}
                    </dl>
                    {product.specSheet && (
                      <a href={product.specSheet} className="mt-4 text-sm font-semibold text-navy-900 underline underline-offset-4">{p.catalog.specSheet}</a>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <InquirySection
        locale={locale}
        dict={dict}
        formType="food"
        title={p.form.title}
        intro={p.form.intro}
        submitLabel={p.form.submit}
        recipient="exports"
      />

      <CtaBand locale={locale} dict={dict} />
    </>
  );
}
