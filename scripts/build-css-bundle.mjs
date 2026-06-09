/**
 * build-css-bundle.mjs
 *
 * Concatenates the 7 core CSS files into a single bundle,
 * extracts critical above-the-fold CSS, and minifies both outputs.
 *
 * Usage:
 *   node scripts/build-css-bundle.mjs
 *   node scripts/build-css-bundle.mjs --dry-run
 */

import fs from "node:fs";
import path from "node:path";
import { transform } from "esbuild";

const ROOT = process.cwd();
const DRY_RUN = process.argv.includes("--dry-run");

// ── Source files in cascade order (fonts first, hotfixes last) ──────────
const SOURCE_FILES = [
  "frontend/assets/css/global-fonts.css",
  "frontend/css/tailwind.local.min.css",
  "frontend/css/sitewide-modernization.css",
  "frontend/css/production-fixes.v20260427.css",
  "frontend/css/unified-header.css",
  "frontend/css/homepage-cta-links.css",
  "frontend/css/brightai-ui-hotfix.css",
];

const OUTPUT_BUNDLE = path.join(ROOT, "frontend", "css", "bundle-core.min.css");
const OUTPUT_CRITICAL = path.join(ROOT, "scripts", "critical-css.json");

// ── Critical CSS selectors for above-the-fold content ───────────────────
// These are extracted from the full bundle to be inlined in <head>.
const CRITICAL_PATTERNS = [
  // Font-face declarations (must be first)
  /^@font-face\s*\{/,

  // CSS custom properties (design tokens)
  /^:root\s*\{/,
  /^\[data-theme=/,

  // Base resets and typography
  /^\*\s*,?\s*:after\s*,?\s*:before\s*\{/,
  /^html\s*\{/,
  /^body\s*\{/,
  /^h[1-6]\s*\{/,

  // Navigation (fixed, above-the-fold on every page)
  /^\.unified-nav/,
  /^\.nav-container/,
  /^\.nav-logo/,
  /^\.nav-links/,
  /^\.hamburger/,
  /^\.dropdown/,
  /^\.nav-dropdown/,

  // Hero / page header (above-the-fold)
  /^\.hero[\s{,.]/,
  /^\.hero-section/,
  /^\.hero-container/,
  /^\.hero-content/,
  /^\.hero-title/,
  /^\.hero-subtitle/,
  /^\.hero-badge/,
  /^\.cta-container/,
  /^\.cta-button/,

  // Core UI components visible on load
  /^\.glass-card[\s{,.]/,
  /^\.btn-primary/,
  /^\.btn-secondary/,
  /^\.btn-pulse/,
  /^\.text-gradient[\s{,.]/,
  /^\.text-gradient-gold/,
  /^\.back-to-top/,

  // Scroll progress bar
  /^\.scroll-progress/,

  // Custom scrollbar
  /^::-webkit-scrollbar/,

  // Print and reduced-motion media queries
  /^@media\s*\(prefers-reduced-motion/,
  /^@media\s*print/,

  // RTL-specific critical rules
  /^\[dir=rtl\]/,

  // Prose base styles (used in blog posts)
  /^\.prose[\s{,.]/,

  // Skeleton loading (visible on load)
  /^\.skeleton/,

  // Mobile-specific nav and hero overrides (critical for mobile FCP)
  /^@media\s*\(max-width:\s*768px\)/,
  /^@media\s*\(max-width:\s*1024px\)/,

  // Scrollbar and iconify
  /^iconify-icon/,
];

// ── Helpers ─────────────────────────────────────────────────────────────

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

/**
 * Extract critical CSS rules from a full CSS string.
 * Works with minified CSS by splitting on rule boundaries.
 */
function extractCriticalCSS(css) {
  const rules = [];
  let i = 0;

  while (i < css.length) {
    // Skip whitespace
    if (css[i] === " " || css[i] === "\n" || css[i] === "\t") {
      i++;
      continue;
    }

    // Handle @rules (font-face, media queries, etc.)
    if (css[i] === "@") {
      const atRuleStart = i;
      // Find the end of the @rule (matching brace)
      let braceCount = 0;
      let j = i;
      let foundBrace = false;

      while (j < css.length) {
        if (css[j] === "{") {
          braceCount++;
          foundBrace = true;
        } else if (css[j] === "}") {
          braceCount--;
          if (foundBrace && braceCount === 0) {
            j++;
            break;
          }
        }
        j++;
      }

      const rule = css.slice(atRuleStart, j);

      // Check if this @rule matches critical patterns
      const isCritical = CRITICAL_PATTERNS.some((p) => p.test(rule));
      if (isCritical) {
        rules.push(rule);
      }
      i = j;
      continue;
    }

    // Handle regular rules: selector { ... }
    const ruleStart = i;
    let braceCount = 0;
    let j = i;
    let foundBrace = false;

    while (j < css.length) {
      if (css[j] === "{") {
        braceCount++;
        foundBrace = true;
      } else if (css[j] === "}") {
        braceCount--;
        if (foundBrace && braceCount === 0) {
          j++;
          break;
        }
      }
      j++;
    }

    const rule = css.slice(ruleStart, j);

    // Extract the selector (everything before the first {)
    const braceIdx = rule.indexOf("{");
    const selector = braceIdx > 0 ? rule.slice(0, braceIdx).trim() : rule;

    const isCritical = CRITICAL_PATTERNS.some((p) => p.test(selector));
    if (isCritical) {
      rules.push(rule);
    }

    i = j;
  }

  return rules.join("");
}

// ── Main ────────────────────────────────────────────────────────────────

async function main() {
  console.log("=== بناء حزمة CSS الموحدة ===\n");

  // 1. Read and concatenate source files
  console.log("1. قراءة ودمج الملفات المصدرية...");
  const parts = [];
  let totalSourceSize = 0;

  for (const relPath of SOURCE_FILES) {
    const absPath = path.join(ROOT, relPath);
    try {
      const content = fs.readFileSync(absPath, "utf-8");
      parts.push(`/* === ${path.basename(relPath)} === */\n${content}`);
      totalSourceSize += Buffer.byteLength(content);
      console.log(`   ✓ ${relPath} (${formatSize(Buffer.byteLength(content))})`);
    } catch (err) {
      if (err.code === "ENOENT") {
        console.warn(`   ⚠ تخطي ${relPath} — الملف غير موجود`);
        continue;
      }
      throw err;
    }
  }

  if (parts.length === 0) {
    console.error("خطأ: لم يتم العثور على أي ملفات CSS مصدرية.");
    process.exit(1);
  }

  const concatenated = parts.join("\n\n");
  console.log(`\n   الحجم الإجمالي قبل التصغير: ${formatSize(totalSourceSize)}`);

  if (DRY_RUN) {
    console.log("\n[dry-run] تم التخطي — لن يتم كتابة أي ملفات.");
    return;
  }

  // 2. Minify with esbuild
  console.log("\n2. تصغير الحزمة باستخدام esbuild...");
  const bundleResult = await transform(concatenated, {
    loader: "css",
    minify: true,
    charset: "utf8",
    legalComments: "none",
  });

  const bundleSize = Buffer.byteLength(bundleResult.code);
  console.log(`   ✓ bundle-core.min.css: ${formatSize(bundleSize)} (توفير ${((1 - bundleSize / totalSourceSize) * 100).toFixed(1)}%)`);

  // 3. Extract critical CSS
  console.log("\n3. استخراج Critical CSS...");
  const criticalCSS = extractCriticalCSS(bundleResult.code);
  const criticalSize = Buffer.byteLength(criticalCSS);
  console.log(`   ✓ Critical CSS: ${formatSize(criticalCSS.length)} (${((criticalSize / bundleSize) * 100).toFixed(1)}% من الحزمة)`);

  // 4. Write outputs
  console.log("\n4. كتابة الملفات...");

  fs.writeFileSync(OUTPUT_BUNDLE, bundleResult.code, "utf-8");
  console.log(`   ✓ ${path.relative(ROOT, OUTPUT_BUNDLE)}`);

  fs.writeFileSync(
    OUTPUT_CRITICAL,
    JSON.stringify({ css: criticalCSS, generatedAt: new Date().toISOString() }, null, 2),
    "utf-8"
  );
  console.log(`   ✓ ${path.relative(ROOT, OUTPUT_CRITICAL)}`);

  // 5. Summary
  console.log("\n=== التقرير النهائي ===");
  console.log(`   الملفات المدمجة: ${parts.length}/${SOURCE_FILES.length}`);
  console.log(`   الحجم قبل التصغير: ${formatSize(totalSourceSize)}`);
  console.log(`   الحجم بعد التصغير: ${formatSize(bundleSize)}`);
  console.log(`   Critical CSS (inline): ${formatSize(criticalSize)}`);
  console.log(`   الحزمة (async load): ${formatSize(bundleSize - criticalSize)}`);
  console.log("=========================\n");
}

main().catch((err) => {
  console.error("خطأ في بناء حزمة CSS:", err);
  process.exit(1);
});
