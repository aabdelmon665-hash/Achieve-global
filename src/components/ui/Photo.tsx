import type { Photo as PhotoConfig } from "@/config/media";
import type { Locale } from "@/i18n/config";

/**
 * Responsive <img> for pre-sized WebP files (see scripts/build-images.mjs).
 * Fills its positioned parent; lazy-loads unless `priority`.
 */
export function Photo({
  photo,
  locale,
  sizes,
  priority = false,
  className = "",
}: {
  photo: PhotoConfig;
  locale: Locale;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  const file = (w: number) => `/images/${photo.name}-${w}.webp`;
  const fallback = photo.widths[Math.min(1, photo.widths.length - 1)];
  return (
    // eslint-disable-next-line @next/next/no-img-element -- pre-sized static files, no runtime optimizer
    <img
      src={file(fallback)}
      srcSet={photo.widths.map((w) => `${file(w)} ${w}w`).join(", ")}
      sizes={sizes}
      width={photo.width}
      height={photo.height}
      alt={photo.alt[locale]}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      style={photo.background ? { backgroundColor: photo.background } : undefined}
      className={`absolute inset-0 h-full w-full ${photo.fit === "contain" ? "object-contain" : "object-cover"} ${className}`}
    />
  );
}
