/**
 * Screenshot capture for Kernel dashboard (REPORTS-14).
 * 4 captures:
 *  1. /kernel/ — dashboard expanded (1440x900 desktop)
 *  2. /kernel/ — dashboard collapsed sidebar (1440x900 desktop, click collapse)
 *  3. /kernel/ — mobile drawer (390x844 iPhone)
 *  4. /kernel/ — dashboard full page (1440x900)
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const BASE = process.env.BASE || 'http://localhost:8766';
const OUT = '/Users/yzydalshmry/Desktop/BRIGHTAI/download/qa/kernel-shell';
mkdirSync(OUT, { recursive: true });

async function shot(page, name, options = {}) {
  const path = `${OUT}/${name}.png`;
  await page.screenshot({ path, fullPage: options.full ?? false });
  console.log(`  ✓ ${name}.png (${options.full ? 'full page' : 'viewport'})`);
}

async function dismissCookieBanner(page) {
  await page.evaluate(() => {
    const el = document.getElementById('cookie-consent');
    if (el) el.remove();
  });
}

async function main() {
  const browser = await chromium.launch();

  // 1) Desktop expanded
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'ar-SA' });
    const page = await ctx.newPage();
    page.on('console', m => { if (m.type() === 'error') console.log(`  [console.error] ${m.text()}`); });
    page.on('pageerror', e => console.log(`  [pageerror] ${e.message}`));
    await page.goto(`${BASE}/kernel/`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    await dismissCookieBanner(page);
    await shot(page, '01-desktop-expanded');
    await shot(page, '04-desktop-full', { full: true });
    await ctx.close();
  }

  // 2) Desktop collapsed
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'ar-SA' });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/kernel/`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    // Dismiss cookie banner first
    await dismissCookieBanner(page);
    await page.waitForTimeout(300);
    // Click collapse via direct dispatch (force: true can fail with sticky elements)
    await page.evaluate(() => {
      const btn = document.querySelector('[data-kernel-sidebar-collapse]');
      if (btn) btn.click();
    });
    await page.waitForTimeout(600);
    await shot(page, '02-desktop-collapsed');
    await ctx.close();
  }

  // 3) Mobile drawer
  {
    const ctx = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
      locale: 'ar-SA',
    });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/kernel/`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    await dismissCookieBanner(page);
    await shot(page, '03-mobile-fold');

    // Try to open the existing mobile drawer (k-drawer from KernelLayout)
    const drawerToggle = page.locator('[data-kernel-drawer-toggle]');
    if (await drawerToggle.count() > 0 && await drawerToggle.first().isVisible()) {
      await drawerToggle.first().click();
      await page.waitForTimeout(400);
      await shot(page, '03b-mobile-drawer-open');
    }
    await ctx.close();
  }

  await browser.close();
  console.log(`\nAll screenshots saved to ${OUT}`);
}

main().catch(e => { console.error(e); process.exit(1); });