// Verifies that the Turkish and Arabic dictionaries mirror the English one:
// same keys, same array lengths, no empty strings, same {{placeholders}}.
// TypeScript already enforces the shape; this also catches empty or
// untranslated values. Run with: npm run check:i18n
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import ts from "typescript";

const require = createRequire(import.meta.url);
function load(locale) {
  const src = readFileSync(new URL(`../src/i18n/dictionaries/${locale}.ts`, import.meta.url), "utf8");
  const js = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  const mod = { exports: {} };
  new Function("module", "exports", "require", js)(mod, mod.exports, require);
  return mod.exports.default;
}

const base = load("en");
// Grammatically empty in some languages (e.g. Turkish puts the link first).
const mayBeEmpty = new Set(["dict.forms.consent.before", "dict.forms.consent.after"]);
let problems = 0;
const tokens = (s) => (s.match(/\{\{\w+\}\}/g) ?? []).sort().join(",");

function compare(a, b, path, locale) {
  if (typeof a === "string") {
    if (typeof b !== "string") return report(`${locale}: ${path} should be a string`);
    if (a !== "" && b.trim() === "" && !mayBeEmpty.has(path)) report(`${locale}: ${path} is empty`);
    if (tokens(a) !== tokens(b)) report(`${locale}: ${path} placeholders differ (${tokens(a)} vs ${tokens(b)})`);
    return;
  }
  if (Array.isArray(a)) {
    if (!Array.isArray(b) || a.length !== b.length) return report(`${locale}: ${path} array length differs`);
    a.forEach((v, i) => compare(v, b[i], `${path}[${i}]`, locale));
    return;
  }
  for (const key of Object.keys(a)) {
    if (!(key in b)) report(`${locale}: missing ${path}.${key}`);
    else compare(a[key], b[key], `${path}.${key}`, locale);
  }
  for (const key of Object.keys(b)) if (!(key in a)) report(`${locale}: extra ${path}.${key}`);
}
function report(msg) {
  problems++;
  console.error("✗", msg);
}

for (const locale of ["tr", "ar"]) compare(base, load(locale), "dict", locale);
if (problems) process.exit(1);
console.log("✓ Dictionaries are complete for en, tr, ar");
