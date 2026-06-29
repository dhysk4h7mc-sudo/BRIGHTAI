#!/usr/bin/env node
/**
 * Polish QA — capture all 14 pages × 2 viewports (desktop + mobile) for before/after.
 * Usage:
 *   node qa-screenshots.mjs before
 *   node qa-screenshots.mjs after
 *
 * Saves PNGs under:
 *   qa/redesign-2026-06-29/before/<page>-<viewport>.png
 *   qa/redesign-2026-06-29/after/<page>-<viewport>.png
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const phase = process.argv[2] || 'before';
const baseUrl = process.env.QA_URL || 'http://localhost:8765';
const outRoot = join(__dirname, 'redesign-2026-06-29', phase);
await mkdir(outRoot, { recursive: true });

const pages = [
  { slug: 'home',            path: '/' },
  { slug: 'about',           path: '/about/' },
  { slug: 'services',        path: '/services/' },
  { slug: 'pricing',         path: '/pricing/' },
  { slug: 'contact',         path: '/contact/' },
  { slug: 'demo',            path: '/demo/' },
  { slug: 'trust',           path: '/trust/' },
  { slug: 'hub',             path: '/hub/' },
  { slug: 'solutions-index', path: '/solutions/' },
  { slug: 'solution-ai-firewall', path: '/solutions/ai-firewall/' },
  { slug: 'kernel-index',    path: '/kernel/' },
  { slug: 'kernel-audit',    path: '/kernel/audit/' },
  { slug: 'blog-index',      path: '/blog/' },
  { slug: 'docs-index',      path: '/docs/' },
];

const viewports = [
  { name: 'desktop', width: 1440, height: 900,  mobile: false },
  { name: 'mobile',  width:  390, height: 844,  mobile: true  },
];

const browser = await chromium.launch({ headless: true });

let okCount = 0, failCount = 0;
const errors = [];

for (const vp of viewports) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 2,
    isMobile: vp.mobile,
    hasTouch: vp.mobile,
    locale: 'ar-SA',
    timezoneId: 'Asia/Riyadh',
    reducedMotion: 'reduce', // makes static CSS show final state for fair comparison
  });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => errors.push(`PAGE ERROR [${vp.name}]: ${e.message}`));
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(`CONSOLE [${vp.name}]: ${msg.text()}`);
  });

  for (const p of pages) {
    const url = baseUrl + p.path;
    const file = join(outRoot, `${p.slug}__${vp.name}.png`);
    try {
      const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
      if (!resp || resp.status() >= 400) {
        console.error(`SKIP ${p.slug} ${vp.name} — HTTP ${resp?.status()}`);
        failCount++;
        continue;
      }
      // Wait for fonts and reveal animations to settle
      await page.evaluate(() => document.fonts && document.fonts.ready);
      await page.waitForTimeout(800);
      await page.screenshot({ path: file, fullPage: true, type: 'png' });
      const size = (await import('node:fs/promises')).stat ? '' : '';
      console.log(`OK  ${p.slug} ${vp.name} → ${file.replace(__dirname + '/', '')}`);
      okCount++;
    } catch (err) {
      console.error(`FAIL ${p.slug} ${vp.name} — ${err.message}`);
      failCount++;
    }
  }
  await ctx.close();
}

await browser.close();

console.log(`\n=== ${phase.toUpperCase()} complete ===`);
console.log(`OK: ${okCount}  FAIL: ${failCount}`);
if (errors.length) {
  console.log(`\nNon-fatal errors (${errors.length}):`);
  errors.slice(0, 10).forEach((e) => console.log(`  ${e}`));
}
process.exit(failCount > 0 ? 1 : 0);
