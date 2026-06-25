#!/usr/bin/env node
/**
 * generate-image-sitemap.mjs
 * Step 11 of Migration Closure: Generate public/sitemap-images.xml
 * Collects all images from src/ and public/ and outputs a sitemap-image XML.
 */
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join, relative, extname } from 'node:path';

const SITE_URL = 'https://brightai.site';
const OUTPUT = 'public/sitemap-images.xml';
const IMAGE_EXTS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.avif', '.ico']);
const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', '.agents', 'report', '.kilo']);

function walkDir(dir, results = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(full, results);
    } else if (IMAGE_EXTS.has(extname(entry.name).toLowerCase())) {
      results.push(full);
    }
  }
  return results;
}

// Collect images from public/ (directly accessible)
const publicImages = [];
for (const entry of readdirSync('public', { withFileTypes: true })) {
  if (entry.isDirectory()) {
    walkDir(join('public', entry.name), publicImages);
  } else if (IMAGE_EXTS.has(extname(entry.name).toLowerCase())) {
    publicImages.push(join('public', entry.name));
  }
}

// Collect images from src/ (these are source files, not directly served)
// We reference them by their expected public path
const srcImages = [];
walkDir('src', srcImages);

// Build URL list
const imageUrls = [];

for (const filePath of publicImages) {
  const rel = '/' + relative('public', filePath).replace(/\\/g, '/');
  imageUrls.push({
    loc: `${SITE_URL}${rel}`,
    image: `${SITE_URL}${rel}`,
    title: rel.split('/').pop().replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
  });
}

// Also check frontend/assets/images if it exists
const frontendImgDir = 'frontend/assets/images';
try {
  walkDir(frontendImgDir, publicImages);
} catch {
  // frontend dir may not exist or have images
}

// Read dist/ for generated og images
try {
  const distOgDir = 'dist/images/og';
  const files = readdirSync(distOgDir);
  for (const f of files) {
    if (IMAGE_EXTS.has(extname(f).toLowerCase())) {
      imageUrls.push({
        loc: `${SITE_URL}/images/og/${f}`,
        image: `${SITE_URL}/images/og/${f}`,
        title: f.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
      });
    }
  }
} catch {
  // dist/images/og may not exist
}

// Deduplicate
const seen = new Set();
const unique = imageUrls.filter(u => {
  if (seen.has(u.loc)) return false;
  seen.add(u.loc);
  return true;
});

// Generate XML
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${unique.map(u => `  <url>
    <loc>${u.loc}</loc>
    <image:image>
      <image:loc>${u.image}</image:loc>
      <image:title>${escapeXml(u.title)}</image:title>
    </image:image>
  </url>`).join('\n')}
</urlset>`;

writeFileSync(OUTPUT, xml, 'utf-8');
console.log(`Generated ${OUTPUT} with ${unique.length} image URLs.`);

function escapeXml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
