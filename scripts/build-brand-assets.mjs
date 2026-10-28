// Generates web assets from the official logo without altering its design:
// crops transparent margins, resizes, and (for icons only) adds padding or a
// plain white backdrop. Run: node scripts/build-brand-assets.mjs
import sharp from "sharp";
import { writeFileSync } from "node:fs";

const SRC = "assets/brand/achieve-global-logo-original.png";
// Source rows 113–914 hold the emblem ("A", globe, swoosh); lettering starts at 940.
const EMBLEM_BOTTOM = 928;
const transparent = { r: 0, g: 0, b: 0, alpha: 0 };

const full = await sharp(SRC).trim({ threshold: 1 }).png().toBuffer();
const emblemArea = await sharp(SRC).extract({ left: 0, top: 0, width: 1254, height: EMBLEM_BOTTOM }).png().toBuffer();
const emblem = await sharp(emblemArea).trim({ threshold: 1 }).png().toBuffer();
// Tab favicons (16–48 px): crop to the "A" so it stays legible; the globe is partly cut.
const aArea = await sharp(SRC).extract({ left: 79, top: 113, width: 900, height: 815 }).png().toBuffer();
const aSymbol = await sharp(aArea).trim({ threshold: 1 }).png().toBuffer();

const meta = async (b) => sharp(b).metadata();
console.log("full", (await meta(full)).width, (await meta(full)).height);
console.log("emblem", (await meta(emblem)).width, (await meta(emblem)).height);

// Full logo, trimmed — next/image serves resized AVIF/WebP from this.
await sharp(full).resize({ width: 900 }).png({ compressionLevel: 9, palette: false }).toFile("public/brand/achieve-global-logo.png");
await sharp(full).resize({ width: 900 }).webp({ quality: 90 }).toFile("public/brand/achieve-global-logo.webp");
// Emblem only (icons, compact placements).
await sharp(emblem).resize({ width: 600 }).png({ compressionLevel: 9 }).toFile("public/brand/achieve-global-emblem.png");

// Square logo for structured data (Organization.logo).
await sharp(full).resize(480, 480, { fit: "contain", background: transparent }).extend({ top: 16, bottom: 16, left: 16, right: 16, background: transparent }).png().toFile("public/logo.png");

const square = (size, pad, background, source = emblem) =>
  sharp(source)
    .resize(size - pad * 2, size - pad * 2, { fit: "contain", background: transparent })
    .extend({ top: pad, bottom: pad, left: pad, right: pad, background: transparent })
    .flatten(background ? { background } : false)
    .png();

await square(192, 8).toFile("src/app/icon.png");
await square(180, 14, "#FFFFFF").toFile("src/app/apple-icon.png");

// favicon.ico with embedded PNG images (16, 32, 48).
const sizes = [16, 32, 48];
const pngs = await Promise.all(sizes.map((s) => square(s, 0, undefined, aSymbol).toBuffer()));
const header = Buffer.alloc(6 + 16 * sizes.length);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
sizes.forEach((s, i) => {
  const e = 6 + i * 16;
  header.writeUInt8(s, e);
  header.writeUInt8(s, e + 1);
  header.writeUInt16LE(1, e + 4);
  header.writeUInt16LE(32, e + 6);
  header.writeUInt32LE(pngs[i].length, e + 8);
  header.writeUInt32LE(offset, e + 12);
  offset += pngs[i].length;
});
writeFileSync("src/app/favicon.ico", Buffer.concat([header, ...pngs]));
console.log("done");
