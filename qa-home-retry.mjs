#!/usr/bin/env node
/**
 * Retry home page screenshot (timed out in qa-screenshots.mjs first run).
 * Captures home__desktop.png into redesign-2026-06-29/now/.
 */
import { chromium } from 'playwright';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = join(__dirname, 'redesign-2026-06-29', 'now', 'home__desktop.png');
const url = 'http://localhost:8765/';

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
  isMobile: false,
  hasTouch: false,
  locale: 'ar-SA',
  timezoneId: 'Asia/Riyadh',
  reducedMotion: 'reduce',
});
const page = await ctx.newPage();

try {
  const resp = await page.goto(url, { waitUntil: 'load', timeout: 60000 });
  console.log(`HTTP ${resp?.status()}`);
  await page.evaluate(() => document.fonts && document.fonts.ready);
  await page.waitForTimeout(2500);
  await page.screenshot({ path: out, fullPage: true, type: 'png' });
  console.log(`OK  → ${out}`);
} catch (err) {
  console.error(`FAIL — ${err.message}`);
  process.exit(1);
}

await browser.close();
