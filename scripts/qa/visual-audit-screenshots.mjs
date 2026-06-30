#!/usr/bin/env node
/**
 * Visual Audit — capture screenshots of all required pages × 2 viewports.
 * Round 1 (00-visual-audit): baseline snapshots before any design unification.
 *
 * Usage:
 *   node scripts/qa/visual-audit-screenshots.mjs
 *
 * Inputs:
 *   QA_URL env (default: http://localhost:4321) — the Astro preview server.
 *
 * Outputs:
 *   reports/screenshots/before/<slug>__<viewport>.png
 *   reports/screenshots/before/_metadata.json  (page status, console errors, paint timing)
 */

import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const PROJECT_ROOT = join(__dirname, '..', '..');
const OUT_DIR = join(PROJECT_ROOT, 'reports', 'screenshots', 'before');
const META_FILE = join(OUT_DIR, '_metadata.json');

await mkdir(OUT_DIR, { recursive: true });

const baseUrl = process.env.QA_URL || 'http://localhost:4321';

// 13 pages required by the audit brief.
const pages = [
  { slug: 'home',                       path: '/' },
  { slug: 'solutions-index',            path: '/solutions/' },
  { slug: 'solutions-ai-firewall',      path: '/solutions/ai-firewall/' },
  { slug: 'kernel-index',               path: '/kernel/' },
  { slug: 'kernel-chat',                path: '/kernel/chat/' },
  { slug: 'pricing',                    path: '/pricing/' },
  { slug: 'blog-index',                 path: '/blog/' },
  { slug: 'docs-index',                 path: '/docs/' },
  { slug: 'about',                      path: '/about/' },
  { slug: 'contact',                    path: '/contact/' },
  { slug: 'trust',                      path: '/trust/' },
  { slug: 'assessment-ai-governance',   path: '/assessment/ai-governance-readiness/' },
  { slug: 'hub-index',                  path: '/hub/' },
];

const viewports = [
  { name: 'desktop', width: 1440, height: 900,  mobile: false },
  { name: 'mobile',  width:  390, height: 844,  mobile: true  },
];

const browser = await chromium.launch({ headless: true });

const metadata = {
  run_at: new Date().toISOString(),
  base_url: baseUrl,
  user_agent: 'Playwright/Chromium (visual-audit)',
  pages: [],
};

let ok = 0, fail = 0;

for (const vp of viewports) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 2,
    isMobile: vp.mobile,
    hasTouch: vp.mobile,
    locale: 'ar-SA',
    timezoneId: 'Asia/Riyadh',
    // NOTE: no reducedMotion override — we want to see real animations for the audit.
  });
  const page = await ctx.newPage();

  const pageErrors = [];
  const consoleErrors = [];
  page.on('pageerror', (e) => pageErrors.push(e.message));
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  for (const p of pages) {
    const url = baseUrl + p.path;
    const file = join(OUT_DIR, `${p.slug}__${vp.name}.png`);
    const entry = {
      slug: p.slug,
      path: p.path,
      viewport: vp.name,
      width: vp.width,
      height: vp.height,
      url,
      file: file.replace(PROJECT_ROOT + '/', ''),
    };

    try {
      const t0 = Date.now();
      const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 20000 });
      const ms = Date.now() - t0;
      entry.status = resp ? resp.status() : 0;
      entry.load_ms = ms;
      if (!resp || resp.status() >= 400) {
        console.error(`SKIP ${p.slug} ${vp.name} — HTTP ${entry.status}`);
        fail++;
        entry.error = 'http_error';
        metadata.pages.push(entry);
        continue;
      }

      // Wait for fonts to be ready so screenshots show real typography.
      await page.evaluate(() => document.fonts && document.fonts.ready);
      // Small settle delay for any view-transition or late-mounted nodes.
      await page.waitForTimeout(600);

      await page.screenshot({ path: file, fullPage: true, type: 'png' });
      console.log(`OK  ${p.slug} ${vp.name} (${entry.status}, ${ms}ms)`);
      ok++;
    } catch (err) {
      console.error(`FAIL ${p.slug} ${vp.name} — ${err.message}`);
      entry.error = err.message;
      fail++;
    }

    metadata.pages.push(entry);
  }

  metadata[`${vp.name}_page_errors`] = [...pageErrors];
  metadata[`${vp.name}_console_errors`] = [...consoleErrors];

  await ctx.close();
}

await browser.close();

await writeFile(META_FILE, JSON.stringify(metadata, null, 2));

console.log(`\n=== Visual Audit screenshots complete ===`);
console.log(`OK:   ${ok}`);
console.log(`FAIL: ${fail}`);
console.log(`Output: ${OUT_DIR}`);
console.log(`Metadata: ${META_FILE}`);
process.exit(fail > 0 ? 1 : 0);