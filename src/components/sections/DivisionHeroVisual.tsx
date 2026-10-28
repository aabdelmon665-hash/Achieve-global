import type { Locale } from "@/i18n/config";
import { DivisionVisual } from "@/components/art/DivisionVisual";

export function DivisionHeroVisual({ division, locale }: { division: "industrial" | "food" | "business"; locale: Locale }) {
  return (
    <div className="relative aspect-[16/10] overflow-hidden rounded-sm ring-1 ring-white/15">
      <DivisionVisual division={division} locale={locale} priority sizes="(min-width: 1024px) 40vw, 100vw" />
    </div>
  );
}
