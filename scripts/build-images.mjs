// Generates web versions of the supplied photographs (assets/images/originals)
// into public/images. Images are only resized and re-encoded — never cropped,
// retouched or recoloured. Run: node scripts/build-images.mjs
import sharp from "sharp";

const jobs = [
  // ZINORA Rice Chips on a packaging line: keep the full composition.
  { name: "zinora-rice-chips-factory", ext: "png", widths: [640, 1024, 1672], quality: 84 },
  // Illustrative corporate visuals (supplied at ~765 px wide; never upscaled).
  { name: "industrial-sourcing", widths: [480, 764], quality: 82 },
  { name: "business-services-istanbul", widths: [480, 764], quality: 82 },
  { name: "global-logistics-port", widths: [480, 765], quality: 82 },
];

for (const job of jobs) {
  const src = `assets/images/originals/${job.name}.${job.ext ?? "jpg"}`;
  const { width: original } = await sharp(src).metadata();
  for (const w of job.widths) {
    const width = Math.min(w, original);
    const out = `public/images/${job.name}-${w}.webp`;
    const info = await sharp(src).resize({ width, withoutEnlargement: true }).webp({ quality: job.quality }).toFile(out);
    console.log(out, `${info.width}x${info.height}`, `${Math.round(info.size / 1024)} KB`);
  }
}
