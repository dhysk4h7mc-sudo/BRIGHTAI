/**
 * apply-css-bundle.mjs
 *
 * Walks all HTML files (except kernel/) and replaces the 7 core CSS <link>
 * tags with: inline critical CSS + async bundle preload + noscript fallback.
 *
 * Page-specific CSS links (legal-and-services-pages.css, etc.) are preserved.
 *
 * Usage:
 *   node scripts/apply-css-bundle.mjs
 *   node scripts/apply-css-bundle.mjs --dry-run
 */

import fs from "node:fs";
import path from "node:path";
import { glob } from "glob";

const ROOT = process.cwd();
const DRY_RUN = process.argv.includes("--dry-run");

// ── The 7 core CSS files to replace ─────────────────────────────────────
const CORE_CSS_PATTERNS = [
  /tailwind\.local\.min\.css/,
  /global-fonts\.css/,
  /sitewide-modernization\.css/,
  /production-fixes\.v20260427\.css/,
  /unified-header\.css/,
  /homepage-cta-links\.css/,
  /brightai-ui-hotfix\.css/,
];

// ── Old bundles to also remove (about page had these) ───────────────────
const OLD_BUNDLE_PATTERNS = [
  /main\.bundle\.min\.css/,
  /index-theme\.min\.css/,
  /bundle-critical\.css/,
  /bundle-pages\.css/,
  /extracted-inline-styles\.css/,
  /design-tokens\.css/,
  /ux-audit-fixes\.css/,
];

// ── Regex to match any <link> tag for a core CSS file ───────────────────
// Matches variations: single/double quotes, self-closing, different attr order, query strings
function buildCoreCSSRegex() {
  const allPatterns = [...CORE_CSS_PATTERNS, ...OLD_BUNDLE_PATTERNS];
  const hrefPatterns = allPatterns.map(
    (p) => `(?:[^"']*${p.source.replace(/\\\./g, "\\.")}[^"']*)`
  ).join("|");
  return new RegExp(
    `\\s*<link\\s[^>]*href\\s*=\\s*["'](?:${hrefPatterns})["'][^>]*/?>\\s*\\n?`,
    "gi"
  );
}

// ── Async bundle HTML ────────────────────────────────────────────────────
function buildAsyncBundleHTML(criticalCSS) {
  return [
    "",
    "  <!-- === Critical CSS (inline) + Async Bundle === -->",
    `  <style id="critical-css">${criticalCSS}</style>`,
    '  <link rel="preload" href="/frontend/css/bundle-core.min.css" as="style" onload="this.onload=null;this.rel=\'stylesheet\'">',
    '  <noscript><link rel="stylesheet" href="/frontend/css/bundle-core.min.css"></noscript>',
    "  <!-- === End Critical + Async Bundle === -->",
    "",
  ].join("\n");
}

// ── Detect if a file is a kernel page ────────────────────────────────────
function isKernelPage(filePath) {
  return filePath.includes("/kernel/") || filePath.startsWith("kernel/");
}

// ── Check if HTML already has the bundle ─────────────────────────────────
function alreadyHasBundle(html) {
  return html.includes("bundle-core.min.css");
}

// ── Find insertion point: right after the last <link rel="preload" ... font>
//    or after the last <meta> tag if no font preload exists ──────────────
function findInsertionPoint(html) {
  // Try to find position after font preload links
  const fontPreloadMatch = html.match(
    /<link\s[^>]*rel\s*=\s*["']preload["'][^>]*as\s*=\s*["']font["'][^>]*\/?>[^<\n]*/gi
  );

  if (fontPreloadMatch) {
    const lastFontPreload = fontPreloadMatch[fontPreloadMatch.length - 1];
    const idx = html.lastIndexOf(lastFontPreload);
    if (idx !== -1) {
      return idx + lastFontPreload.length;
    }
  }

  // Fallback: after the last <meta> tag before </head>
  const metaRegex = /<meta\s[^>]*>/gi;
  let lastMetaIdx = -1;
  let match;
  while ((match = metaRegex.exec(html)) !== null) {
    // Only consider <meta> tags inside <head>
    const headEnd = html.indexOf("</head>");
    if (headEnd !== -1 && match.index < headEnd) {
      lastMetaIdx = match.index + match[0].length;
    }
  }

  if (lastMetaIdx !== -1) {
    return lastMetaIdx;
  }

  // Final fallback: right after <head>
  return html.indexOf("<head>") + 6;
}

// ── Process a single HTML file ───────────────────────────────────────────
function processHTML(html, filePath) {
  if (alreadyHasBundle(html)) {
    return { changed: false, reason: "already has bundle" };
  }

  const coreLinkRegex = buildCoreCSSRegex();

  // Find all core CSS links and their positions
  const matches = [];
  let m;
  const regex = new RegExp(coreLinkRegex.source, "gi");
  while ((m = regex.exec(html)) !== null) {
    matches.push({ index: m.index, length: m[0].length, text: m[0] });
  }

  if (matches.length === 0) {
    return { changed: false, reason: "no core CSS links found" };
  }

  // Remove all core CSS links (in reverse to preserve indices)
  let modified = html;
  for (let i = matches.length - 1; i >= 0; i--) {
    const match = matches[i];
    modified = modified.slice(0, match.index) + modified.slice(match.index + match.length);
  }

  // Remove any existing <style id="critical-css">...</style> blocks
  modified = modified.replace(
    /\s*<style\s+id\s*=\s*["']critical-css["']\s*>[\s\S]*?<\/style>\s*\n?/gi,
    ""
  );

  // Load critical CSS
  const criticalPath = path.join(ROOT, "scripts", "critical-css.json");
  const criticalData = JSON.parse(fs.readFileSync(criticalPath, "utf-8"));
  const asyncHTML = buildAsyncBundleHTML(criticalData.css);

  // Find insertion point in the cleaned HTML
  const insertAt = findInsertionPoint(modified);
  modified = modified.slice(0, insertAt) + asyncHTML + modified.slice(insertAt);

  return { changed: true, modified, removedCount: matches.length };
}

// ── Main ─────────────────────────────────────────────────────────────────

async function main() {
  console.log("=== تطبيق حزمة CSS على ملفات HTML ===\n");

  // Find all HTML files
  const htmlFiles = await glob("**/*.html", {
    cwd: ROOT,
    ignore: ["node_modules/**", ".git/**", ".claude/**"],
    absolute: true,
  });

  console.log(`تم العثور على ${htmlFiles.length} ملف HTML\n`);

  let processed = 0;
  let skipped = 0;
  let changed = 0;
  let kernelSkipped = 0;
  const details = [];

  for (const filePath of htmlFiles) {
    const relPath = path.relative(ROOT, filePath);

    // Skip kernel pages entirely
    if (isKernelPage(relPath)) {
      kernelSkipped++;
      continue;
    }

    processed++;

    const html = fs.readFileSync(filePath, "utf-8");
    const result = processHTML(html, relPath);

    if (!result.changed) {
      skipped++;
      details.push(`  ⊘ ${relPath}: ${result.reason}`);
      continue;
    }

    changed++;
    details.push(`  ✓ ${relPath}: أزيل ${result.removedCount} رابط CSS`);

    if (!DRY_RUN) {
      fs.writeFileSync(filePath, result.modified, "utf-8");
    }
  }

  // Print details
  if (details.length > 0) {
    console.log("التفاصيل:");
    for (const d of details) {
      console.log(d);
    }
    console.log("");
  }

  // Summary
  console.log("=== التقرير ===");
  console.log(`   إجمالي الملفات: ${htmlFiles.length}`);
  console.log(`   صفحات Kernel (تخطي): ${kernelSkipped}`);
  console.log(`   تم تحليلها: ${processed}`);
  console.log(`   تم تعديلها: ${changed}`);
  console.log(`   تم تخطيها: ${skipped}`);
  if (DRY_RUN) {
    console.log("\n   [dry-run] لم يتم كتابة أي تغييرات.");
  }
  console.log("===============\n");
}

main().catch((err) => {
  console.error("خطأ في تطبيق حزمة CSS:", err);
  process.exit(1);
});
