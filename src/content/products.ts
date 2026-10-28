/**
 * Food product catalogue.
 *
 * Intentionally empty. Add entries only for genuine products with real
 * photographs and verified specifications supplied by the company or the
 * producing partner. The catalogue section on the Food Trading & Export page
 * renders automatically once at least one entry exists.
 *
 * `certifications` must list only certificates whose documents have been
 * verified for the specific product and producer.
 */
export type LocalizedText = { en: string; tr: string; ar: string };

export type Product = {
  id: string;
  name: LocalizedText;
  category: LocalizedText;
  description: LocalizedText;
  /** e.g. "/images/products/hazelnut-wafer.webp" */
  image: string;
  imageAlt: LocalizedText;
  /** Who manufactures the product, e.g. "Independent production partner". */
  producer: LocalizedText;
  packaging?: LocalizedText;
  certifications?: string[];
  /** Optional link to a PDF specification sheet in /public/docs. */
  specSheet?: string;
};

export const products: Product[] = [];
