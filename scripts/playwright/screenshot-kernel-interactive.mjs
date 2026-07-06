/**
 * screenshot-kernel-interactive.mjs
 * REPORTS-15 — Capture screenshots for the 4 interactive Kernel pages:
 * chat, audit, approvals, evidence. Desktop + mobile, plus modal/drawer states.
 *
 * Output: /home/z/my-project/download/qa/kernel-interactive/*.png
 */
import { chromium, devices } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const BASE = 'http://localhost:4321';
const OUT_DIR = '/Users/yzydalshmry/Desktop/BRIGHTAI/download/qa/kernel-interactive';

const PAGES = [
  { slug: 'chat',       title: 'chat' },
  { slug: 'audit',      title: 'audit' },
  { slug: 'approvals',  title: 'approvals' },
  { slug: 'evidence',   title: 'evidence' },
];

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900,  deviceScaleFactor: 1 },
  { name: 'mobile',  width: 390,  height: 844,  deviceScaleFactor: 2, isMobile: true },
];

if (!existsSync(OUT_DIR)) {
  await mkdir(OUT_DIR, { recursive: true });
}

const browser = await chromium.launch();
const errors = [];

async function snap(page, slug, viewport, suffix, opts = {}) {
  await page.waitForLoadState('networkidle').catch(() => {});
  if (opts.interactions) {
    for (const step of opts.interactions) await step(page);
  }
  if (opts.waitForSelector) {
    await page.waitForSelector(opts.waitForSelector, { timeout: 4000 }).catch(() => {});
  }
  await page.waitForTimeout(opts.settle || 350);
  const path = join(OUT_DIR, `${slug}-${viewport.name}${suffix ? '-' + suffix : ''}.png`);
  await page.screenshot({ path, fullPage: opts.fullPage !== false });
  console.log(`✓ ${slug}-${viewport.name}${suffix ? '-' + suffix : ''}.png`);
}

async function capturePage(slug, viewport) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: viewport.deviceScaleFactor,
    isMobile: viewport.isMobile,
    hasTouch: viewport.isMobile,
  });
  const page = await context.newPage();

  page.on('pageerror', (e) => errors.push(`${slug} ${viewport.name}: ${e.message}`));
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(`console-error ${slug} ${viewport.name}: ${msg.text()}`);
  });

  const url = `${BASE}/kernel/${slug}/`;
  await page.goto(url, { waitUntil: 'networkidle' });

  // Default full-page screenshot
  await snap(page, slug, viewport);

  // Page-specific interactions
  if (slug === 'chat') {
    // 1) Send a message in the compose box to capture streaming + bubble layout
    const input = await page.locator('[data-kernel-chat-input]').first();
    await input.fill('لو سمحت اشرح لي ضوابط PDPL باختصار.');
    await page.locator('[data-kernel-chat-send]').first().click();
    await snap(page, slug, viewport, 'after-send', {
      interactions: [],
      waitForSelector: '.kernel-chat-message',
      settle: 1200,
    });

    // 2) Capture after AI streams a response (waits extra for fake streaming)
    await page.waitForTimeout(2000);
    await snap(page, slug, viewport, 'after-ai-reply', { settle: 400, fullPage: false });
  }

  if (slug === 'audit') {
    // Open detail drawer by clicking a high-risk row
    const row = await page.locator('[data-kernel-audit-row]').nth(1);
    await row.click();
    await snap(page, slug, viewport, 'drawer-open', {
      waitForSelector: '[data-kernel-audit-drawer][data-open="true"]',
      settle: 500,
      fullPage: false,
    });
    // Close drawer, then filter to critical risk
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);
    const risk = await page.locator('[data-kernel-audit-filter="risk"]').first();
    await risk.selectOption('critical');
    await snap(page, slug, viewport, 'filtered-critical', { settle: 400 });
  }

  if (slug === 'approvals') {
    // Click Approve on the first card to open modal
    const btn = await page.locator('[data-kernel-approval-action="approve"]').first();
    await btn.click();
    await snap(page, slug, viewport, 'approve-modal', {
      waitForSelector: '[data-kernel-approval-modal][data-open="true"]',
      settle: 500,
      fullPage: false,
    });
    // Close + switch to Approved tab
    await page.keyboard.press('Escape');
    await page.waitForTimeout(350);
    await page.locator('[data-tab-id="approved"]').first().click();
    await snap(page, slug, viewport, 'tab-approved', {
      waitForSelector: '#tabpanel-approved:not([hidden])',
      settle: 300,
    });
  }

  if (slug === 'evidence') {
    // Open preview modal
    const btn = await page.locator('[data-kernel-evidence-preview]').first();
    await btn.click();
    await snap(page, slug, viewport, 'preview-modal', {
      waitForSelector: '[data-kernel-evidence-preview-modal][data-open="true"]',
      settle: 700,
      fullPage: false,
    });
    // Close + apply filter
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    await page.locator('[data-kernel-evidence-filter="pack"]').first().selectOption('pdpl');
    await snap(page, slug, viewport, 'filtered-pdpl', { settle: 350 });
  }

  await context.close();
}

console.log('🚀 Capturing screenshots...');
for (const v of VIEWPORTS) {
  for (const p of PAGES) {
    try { await capturePage(p.slug, v); } catch (e) { console.error(`✗ ${p.slug} ${v.name}: ${e.message}`); errors.push(e.message); }
  }
}

await browser.close();

if (errors.length) {
  console.log('\n⚠️  Issues:');
  for (const err of errors) console.log('  • ' + err);
  process.exit(1);
}
console.log('\n✅ All screenshots captured to ' + OUT_DIR);
