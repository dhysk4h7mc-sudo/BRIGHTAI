/**
 * /scripts/playwright/screenshot-solutions.mjs
 * REPORT-10 — Solutions redesign visual verification.
 *
 * Captures desktop (1440×900) + mobile (390×844) screenshots for:
 *   - Hub:                     /solutions/
 *   - Products (3):            /solutions/ai-firewall/, /solutions/ai-governance-platform/, /solutions/ai-evidence-file/
 *   - Sectors (2):             /solutions/banking-ai-governance/, /solutions/healthcare-ai-governance/
 *   - City-level (1):          /solutions/banking-ai-governance/riyadh/
 *
 * Output: /Users/yzydalshmry/Desktop/BRIGHTAI/download/qa/solutions/
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const OUT = '/Users/yzydalshmry/Desktop/BRIGHTAI/download/qa/solutions';
mkdirSync(OUT, { recursive: true });

const PAGES = [
  { name: 'hub',                                       url: '/solutions/' },
  { name: 'product-ai-firewall',                       url: '/solutions/ai-firewall/' },
  { name: 'product-ai-governance-platform',            url: '/solutions/ai-governance-platform/' },
  { name: 'product-ai-evidence-file',                 url: '/solutions/ai-evidence-file/' },
  { name: 'sector-banking',                            url: '/solutions/banking-ai-governance/' },
  { name: 'sector-healthcare',                         url: '/solutions/healthcare-ai-governance/' },
  { name: 'city-riyadh-banking',                       url: '/solutions/banking-ai-governance/riyadh/' },
];

const BASE = 'http://localhost:4321';
const browser = await chromium.launch();
const errors = [];

async function capturePage(page, name, url, viewport) {
  const result = await page.goto(BASE + url, { waitUntil: 'networkidle' });
  if (result && !result.ok()) {
    console.warn(`non-200 for ${name}: ${result.status()}`);
    return;
  }
  await page.waitForTimeout(700);
  const prefix = `${OUT}/${name}-${viewport.kind}-fold`;
  await page.screenshot({ path: `${prefix}.png`, fullPage: false });

  // Full only for hub + products + sectors (skip mobile full to keep size down)
  if (viewport.kind === 'desktop') {
    const fullPath = `${OUT}/${name}-${viewport.kind}-full.png`;
    await page.screenshot({ path: fullPath, fullPage: true });
  }
}

// Desktop context (1440×900)
const desktopCtx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const desktopPage = await desktopCtx.newPage();
desktopPage.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(`[${msg.url()}] ${msg.text()}`);
});
for (const p of PAGES) {
  await capturePage(desktopPage, p.name, p.url, { kind: 'desktop', width: 1440, height: 900 });
}

// Mobile context (390×844 iPhone-ish)
const mobileCtx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
  deviceScaleFactor: 2,
});
const mobilePage = await mobileCtx.newPage();
mobilePage.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(`[${msg.url()}] ${msg.text()}`);
});
for (const p of PAGES) {
  await capturePage(mobilePage, p.name, p.url, { kind: 'mobile', width: 390, height: 844 });
}

await browser.close();

console.log(`\n✅ Captured ${PAGES.length * 2} fold screenshots + ${PAGES.length} desktop full pages`);
console.log(`📁 ${OUT}`);
console.log(`📊 Console errors: ${errors.length === 0 ? '0 ✅' : errors.length} ❌`);
if (errors.length) errors.forEach((e) => console.log(`   - ${e}`));
