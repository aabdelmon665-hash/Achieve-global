import type { Metadata } from "next";
import Link from "next/link";
import { getDictionary } from "@/i18n/get-dictionary";
import { resolveLocale } from "@/lib/locale-params";
import { pageMetadata } from "@/lib/seo";
import { href } from "@/lib/paths";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { HeroGlobe } from "@/components/art/HeroGlobe";
import { DivisionCards } from "@/components/sections/DivisionCards";
import { CtaBand } from "@/components/sections/CtaBand";
import { Photo } from "@/components/ui/Photo";
import { media } from "@/config/media";

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const d = getDictionary(locale);
  return pageMetadata({
    locale,
    route: "home",
    title: `${d.meta.siteName} — ${d.meta.home.title}`,
    description: d.meta.home.description,
    absoluteTitle: true,
  });
}

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  const h = dict.home;
  const divisionLinks = [
    { key: "industrial", label: dict.nav.industrial },
    { key: "food", label: dict.nav.food },
    { key: "business", label: dict.nav.business },
  ] as const;

  return (
    <>
      {/* Hero */}
      <section className="on-dark relative overflow-hidden bg-navy-900 text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
            backgroundSize: "72px 72px",
            maskImage: "radial-gradient(ellipse at 30% 40%, black, transparent 75%)",
          }}
        />
        <div className="container-page relative grid items-center gap-10 pt-16 pb-12 lg:grid-cols-12 lg:pt-24 lg:pb-16">
          <div className="lg:col-span-7">
            <p className="eyebrow">{h.hero.eyebrow}</p>
            <h1 className="mt-6 text-[2.5rem] leading-[1.08] font-semibold tracking-tight !text-white sm:text-6xl lg:text-[4.1rem]">
              {h.hero.title}
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-white/75 sm:text-xl">{h.hero.text}</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <ButtonLink href={href(locale, "quote")} variant="gold" arrow>
                {dict.common.requestQuote}
              </ButtonLink>
              <ButtonLink href="#divisions" variant="outlineLight">
                {dict.common.exploreServices}
              </ButtonLink>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none" role="img" aria-label={h.hero.artLabel}>
            <HeroGlobe label="ISTANBUL" className="h-auto w-full" />
          </div>
        </div>

        <div className="relative border-t border-line-dark">
          <ul className="container-page grid divide-y divide-line-dark md:grid-cols-3 md:divide-x md:divide-y-0 rtl:md:divide-x-reverse">
            {divisionLinks.map((d, i) => (
              <li key={d.key}>
                <Link
                  href={href(locale, d.key)}
                  className="group flex items-center justify-between gap-4 py-5 text-sm font-medium text-white/80 transition-colors hover:text-white md:px-6 md:first:ps-0"
                >
                  <span className="flex items-center gap-4">
                    <span className="font-display text-xs font-semibold text-gold" aria-hidden="true">
                      {["A", "B", "C"][i]}
                    </span>
                    {d.label}
                  </span>
                  <Icon name="arrow" className="h-4 w-4 text-white/40 transition-transform group-hover:translate-x-1 group-hover:text-gold rtl:-scale-x-100 rtl:group-hover:-translate-x-1" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Divisions */}
      <section id="divisions" aria-labelledby="divisions-title" className="scroll-mt-20 py-20 lg:py-28">
        <div className="container-page">
          <SectionHeading id="divisions-title" eyebrow={h.divisions.eyebrow} title={h.divisions.title} intro={h.divisions.intro} />
          <div className="mt-14">
            <DivisionCards locale={locale} dict={dict} />
          </div>
        </div>
      </section>

      {/* How we work */}
      <section aria-labelledby="process-title" className="bg-mist py-20 lg:py-28">
        <div className="container-page">
          <SectionHeading id="process-title" eyebrow={h.process.eyebrow} title={h.process.title} intro={h.process.intro} />
          <ol className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {h.process.steps.map((step, i) => (
              <li key={step.title} className="relative border-t-2 border-navy-900 bg-white p-7">
                <span className="font-display text-4xl font-light text-gold tabular-nums" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-5 text-lg font-semibold">{step.title}</h3>
                <p className="mt-3 leading-relaxed text-ink-muted">{step.text}</p>
              </li>
            ))}
          </ol>
          <p className="mt-8 flex items-start gap-3 text-sm text-ink-muted">
            <Icon name="info" className="mt-0.5 h-4 w-4 shrink-0 text-gold-ink" />
            {h.process.note}
          </p>
        </div>
      </section>

      {/* Why work with us */}
      <section aria-labelledby="why-title" className="py-20 lg:py-28">
        <div className="container-page grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <SectionHeading id="why-title" eyebrow={h.why.eyebrow} title={h.why.title} />
              <div className="mt-8">
                <ButtonLink href={href(locale, "about")} variant="outline" arrow>
                  {dict.nav.about}
                </ButtonLink>
              </div>
            </div>
          </div>
          <ul className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:col-span-8">
            {h.why.items.map((item) => (
              <li key={item.title} className="border-t border-line pt-6">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/50 text-gold-ink">
                  <Icon name="check" className="h-4 w-4" />
                </span>
                <h3 className="mt-5 text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 leading-relaxed text-ink-muted">{item.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Markets */}
      <section aria-labelledby="markets-title" className="border-t border-line bg-mist py-20 lg:py-28">
        <div className="container-page grid items-center gap-14 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <SectionHeading id="markets-title" eyebrow={h.markets.eyebrow} title={h.markets.title} intro={h.markets.text} />
            <ul className="mt-10 space-y-4">
              {h.markets.points.map((p) => (
                <li key={p} className="flex items-start gap-3">
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 bg-gold" aria-hidden="true" />
                  <span className="text-charcoal">{p}</span>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-sm text-ink-muted">{h.markets.note}</p>
          </div>
          <div className="lg:col-span-6">
            {media.logistics ? (
              <div className="relative aspect-[3/2] overflow-hidden rounded-sm border border-line">
                <Photo photo={media.logistics} locale={locale} sizes="(min-width: 1024px) 45vw, 100vw" />
              </div>
            ) : (
              <HeroGlobe tone="light" className="mx-auto h-auto w-full max-w-lg" />
            )}
          </div>
        </div>
      </section>

      <CtaBand locale={locale} dict={dict} />
    </>
  );
}
