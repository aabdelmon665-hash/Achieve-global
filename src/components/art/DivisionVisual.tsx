import Image from "next/image";
import { media } from "@/config/media";
import type { Locale } from "@/i18n/config";
import { divisionArt } from "./DivisionArt";

/** Shows the configured photograph for a division, or its line illustration. */
export function DivisionVisual({
  division,
  locale,
  priority = false,
  sizes = "(min-width: 1024px) 33vw, 100vw",
}: {
  division: "industrial" | "food" | "business";
  locale: Locale;
  priority?: boolean;
  sizes?: string;
}) {
  const photo = media[division];
  if (photo.src) {
    return <Image src={photo.src} alt={photo.alt[locale]} fill sizes={sizes} priority={priority} className="object-cover" />;
  }
  const Art = divisionArt[division];
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-mist p-6">
      <Art className="h-full w-full max-w-md" />
    </div>
  );
}
