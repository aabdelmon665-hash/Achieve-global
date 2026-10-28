import type { Metadata } from "next";
import Link from "next/link";
import { getDictionary } from "@/i18n/get-dictionary";
import { resolveLocale } from "@/lib/locale-params";
import { pageMetadata } from "@/lib/seo";
import { crumbsFor } from "@/lib/crumbs";
import { href } from "@/lib/paths";
import { PageHero } from "@/components/sections/PageHero";
import { DivisionVisual } from "@/components/art/DivisionVisual";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

type Props = PageProps<"/[locale]/request-a-quote">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const d = getDictionary(locale);
  return pageMetadata({ locale, route: "quote", title: d.quote.meta.title, description: d.quote.meta.description });
}

const keys = ["industrial", "food", "business"] as const;

export default async function QuotePage({ params }: Props) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  const q = dict.quote;

  return (
    <>
      <PageHero
        eyebrow={q.hero.eyebrow}
        title={q.hero.title}
        text={q.hero.text}
        crumbs={crumbsFor(locale, dict, "quote", dict.nav.requestQuote)}
        crumbLabel={dict.nav.breadcrumb}
      />

      <section className="py-16 lg:py-24">
        <div className="container-page">
          <ul className="grid gap-6 md:grid-cols-3">
            {q.options.map((opt, i) => (
              <li key={opt.title}>
                <Link
                  href={href(locale, keys[i], "inquiry")}
                  className="group flex h-full flex-col border border-line bg-white transition-shadow hover:shadow-xl hover:shadow-navy-900/8"
                >
                  <div className="relative aspect-[16/9] overflow-hidden border-b border-line">
                    <DivisionVisual division={keys[i]} locale={locale} />
                  </div>
                  <div className="flex flex-1 flex-col p-7">
                    <h2 className="text-xl font-semibold">{opt.title}</h2>
                    <p className="mt-3 flex-1 leading-relaxed text-ink-muted">{opt.text}</p>
                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-navy-900">
                      {opt.cta}
                      <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-12 flex flex-col items-start justify-between gap-6 border border-line bg-mist p-8 md:flex-row md:items-center">
            <div>
              <h2 className="text-xl font-semibold">{q.other.title}</h2>
              <p className="mt-2 text-ink-muted">{q.other.text}</p>
            </div>
            <ButtonLink href={href(locale, "contact", "contact-form")} variant="primary" arrow className="shrink-0">
              {q.other.cta}
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
