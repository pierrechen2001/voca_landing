/**
 * 產生 i18n-data-terms.js（九語 terms 譯文）
 * 執行：node scripts/build-terms-i18n.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const out = path.join(root, "i18n-data-terms.js");
const metaPath = path.join(__dirname, "terms", "meta.json");
const bodiesDir = path.join(__dirname, "terms", "bodies");

const locales = ["zh-TW", "zh-CN", "ja", "ko", "id", "vi", "th", "es", "pt"];
const meta = JSON.parse(fs.readFileSync(metaPath, "utf8"));

/** @type {Record<string, Record<string, string>>} */
const merged = {};

for (const loc of locales) {
  const bodyFile = path.join(bodiesDir, `${loc}.html`);
  if (!fs.existsSync(bodyFile)) {
    throw new Error(`Missing terms body: ${bodyFile}`);
  }
  if (!meta[loc]) {
    throw new Error(`Missing terms meta for locale: ${loc}`);
  }
  merged[loc] = {
    ...meta[loc],
    terms_body_html: fs.readFileSync(bodyFile, "utf8").trim(),
  };
}

const payload =
  "window.VOCA_LANDING_MERGE(" +
  JSON.stringify(merged, null, 0) +
  ");\n";

fs.writeFileSync(out, payload, "utf8");
console.log("Wrote", out, "(locales:", locales.join(", "), ")");
