import { media } from "@/config/media";
import type { Locale } from "@/i18n/config";
import { Photo } from "@/components/ui/Photo";
import { divisionArt } from "./DivisionArt";

/** Shows the configured photograph for a division, or its line illustration. */
export function DivisionVisual({
  division,
  locale,
  priority = false,
  sizes = "(min-width: 768px) 33vw, 100vw",
}: {
  division: "industrial" | "food" | "business";
  locale: Locale;
  priority?: boolean;
  sizes?: string;
}) {
  const photo = media[division];
  if (photo) {
    return (
      <div className="absolute inset-0" style={photo.background ? { backgroundColor: photo.background } : undefined}>
        <Photo
          photo={photo}
          locale={locale}
          sizes={sizes}
          priority={priority}
          className={photo.fit === "contain" ? "p-3 sm:p-4" : ""}
        />
      </div>
    );
  }
  const Art = divisionArt[division];
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-mist p-6">
      <Art className="h-full w-full max-w-md" />
    </div>
  );
}
