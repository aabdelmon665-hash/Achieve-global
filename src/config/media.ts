/**
 * Photography used on the site.
 *
 * Originals live in assets/images/originals; `node scripts/build-images.mjs`
 * writes the resized WebP files referenced here (public/images/<name>-<w>.webp).
 * Images are served as-is (no runtime optimizer), so every width listed must
 * exist. Set a slot to `null` to fall back to the line illustration.
 *
 * `illustrative: true` marks generated/stock visuals that do not show
 * ACHIEVE GLOBAL's own facilities, people or shipments; their alt text says so.
 */
export type Photo = {
  name: string;
  widths: number[];
  /** Intrinsic size of the largest file, for layout reservation. */
  width: number;
  height: number;
  alt: { en: string; tr: string; ar: string };
  /** "contain" shows the whole image (products); "cover" fills the frame. */
  fit: "cover" | "contain";
  /** Backdrop behind a "contain" image, matched to the photo's own background. */
  background?: string;
  /** Large placements use the image's own aspect ratio, so nothing is cropped. */
  nativeFrame?: boolean;
  illustrative: boolean;
};

export const zinora: Photo = {
  name: "zinora-rice-chips-factory",
  widths: [640, 1024, 1672],
  width: 1672,
  height: 941,
  fit: "cover",
  nativeFrame: true,
  illustrative: false,
  alt: {
    en: "ZINORA Rice Chips packs on a food packaging line",
    tr: "Gıda paketleme hattında ZINORA Rice Chips paketleri",
    ar: "عبوات رقائق الأرز ZINORA على خط تعبئة للأغذية",
  },
};

export const media: Record<"industrial" | "food" | "business" | "logistics", Photo | null> = {
  industrial: {
    name: "industrial-sourcing",
    widths: [480, 764],
    width: 764,
    height: 508,
    fit: "cover",
    illustrative: true,
    alt: {
      en: "Illustrative image: steel coils and processing machinery in an industrial plant",
      tr: "Temsili görsel: endüstriyel bir tesiste çelik rulolar ve işleme makineleri",
      ar: "صورة توضيحية: لفائف صلب وآلات معالجة في منشأة صناعية",
    },
  },
  // The food division is represented by the company's own product, ZINORA.
  food: zinora,
  business: {
    name: "business-services-istanbul",
    widths: [480, 764],
    width: 764,
    height: 507,
    fit: "cover",
    illustrative: true,
    alt: {
      en: "Illustrative image: business meeting in an office overlooking the Bosphorus, Istanbul",
      tr: "Temsili görsel: İstanbul'da Boğaz manzaralı bir ofiste iş toplantısı",
      ar: "صورة توضيحية: اجتماع عمل في مكتب يطل على مضيق البوسفور في إسطنبول",
    },
  },
  logistics: {
    name: "global-logistics-port",
    widths: [480, 765],
    width: 765,
    height: 507,
    fit: "cover",
    illustrative: true,
    alt: {
      en: "Illustrative image: container ship and cranes at a commercial port",
      tr: "Temsili görsel: ticari bir limanda konteyner gemisi ve vinçler",
      ar: "صورة توضيحية: سفينة حاويات ورافعات في ميناء تجاري",
    },
  },
};
