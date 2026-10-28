import type { Locale } from "@/i18n/config";
import { media } from "@/config/media";
import { DivisionVisual } from "@/components/art/DivisionVisual";

/**
 * Framed visual for a division page header. Product photos ("contain") get a
 * portrait frame so the whole package is visible; scene photos fill 16:10.
 */
export function DivisionHeroVisual({
  division,
  locale,
  caption,
}: {
  division: "industrial" | "food" | "business";
  locale: Locale;
  caption?: string;
}) {
  const portrait = media[division]?.fit === "contain";
  return (
    <figure className={portrait ? "mx-auto w-full max-w-[360px] lg:me-0" : ""}>
      <div className={`relative overflow-hidden rounded-sm ring-1 ring-white/15 ${portrait ? "aspect-[4/5]" : "aspect-[16/10]"}`}>
        <DivisionVisual
          division={division}
          locale={locale}
          priority
          sizes={portrait ? "(min-width: 1024px) 360px, 90vw" : "(min-width: 1024px) 40vw, 100vw"}
        />
      </div>
      {caption && <figcaption className="mt-3 text-center text-xs tracking-wide text-white/60">{caption}</figcaption>}
    </figure>
  );
}
