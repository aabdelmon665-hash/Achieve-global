import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { zinora } from "@/config/media";
import { Photo } from "@/components/ui/Photo";
import { ButtonLink } from "@/components/ui/Button";

/** Featured-product block for the company's own brand, ZINORA. */
export function ZinoraShowcase({ locale, dict, withImage = false }: { locale: Locale; dict: Dictionary; withImage?: boolean }) {
  const s = dict.food.showcase;
  return (
    <section aria-labelledby="zinora-title" className="py-16 lg:py-20">
      <div className="container-page">
        <div className={`grid items-center gap-10 border border-line border-s-2 border-s-gold bg-white p-8 sm:p-10 ${withImage ? "lg:grid-cols-12" : ""}`}>
          {withImage && (
            <div className="lg:col-span-5">
              <div className="relative mx-auto aspect-[4/5] w-full max-w-[340px] overflow-hidden rounded-sm" style={{ backgroundColor: zinora.background }}>
                <Photo photo={zinora} locale={locale} sizes="(min-width: 1024px) 340px, 80vw" />
              </div>
            </div>
          )}
          <div className={withImage ? "lg:col-span-7" : "max-w-3xl"}>
            <p className="eyebrow">{s.eyebrow}</p>
            <h2 id="zinora-title" className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              {s.title}
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-ink-muted">{s.text}</p>
            <div className="mt-8">
              <ButtonLink href="#inquiry" variant="primary" arrow>{s.cta}</ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
