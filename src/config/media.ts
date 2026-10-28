/**
 * Photography slots.
 *
 * No photographs ship with the site: the company has not yet supplied genuine
 * imagery, and stock photos of fictitious products would misrepresent the
 * business. Until a slot is filled, a purpose-made line illustration is shown.
 *
 * To use a real photo: place it in /public/images (landscape, at least
 * 1600px wide, ideally WebP/JPEG under 400 KB) and set `src` and `alt` below.
 * Alt text is per language.
 */
export type PhotoSlot = {
  src: string | null;
  alt: { en: string; tr: string; ar: string };
};

const empty = { en: "", tr: "", ar: "" };

export const media: Record<"hero" | "industrial" | "food" | "business" | "about", PhotoSlot> = {
  hero: { src: null, alt: empty },
  industrial: { src: null, alt: empty },
  food: { src: null, alt: empty },
  business: { src: null, alt: empty },
  about: { src: null, alt: empty },
};
