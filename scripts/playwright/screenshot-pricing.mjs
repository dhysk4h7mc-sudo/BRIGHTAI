/**
 * screenshot-pricing.mjs
 *
 * REPORT-11: Pricing Page Visual Refresh — Playwright verification
 * Captures desktop + mobile screenshots of the redesigned pricing page,
 * measures basic Core Web Vitals, and checks for console errors.
 */

import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const BASE = 'http://localhost:4321';
const URL = `${BASE}/pricing/`;
const OUT = 'download/qa/pricing';

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch();

// Desktop viewport
const desktopCtx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
});

const mobileCtx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
});

const consoleErrors = [];
const pageErrors = [];

async function capture(ctx, label) {
  const page = await ctx.newPage();
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(`[${label}] ${msg.text()}`);
  });
  page.on('pageerror', (err) => pageErrors.push(`[${label}] ${err.message}`));

  await page.goto(URL, { waitUntil: 'networkidle', timeout: 30000 });

  // Full page
  await page.screenshot({ path: `${OUT}/${label}-full.png`, fullPage: true });
  // Fold
  await page.screenshot({ path: `${OUT}/${label}-fold.png`, fullPage: false });

  // Section captures (desktop only — mobile handled separately)
  if (label.startsWith('desktop')) {
    const sections = [
      { selector: '.pricing-hero', name: 'hero' },
      { selector: '.pricing-grid--4col', name: 'cards' },
      { selector: '.pricing-faq', name: 'faq' },
      { selector: '.inner-cta-final', name: 'final-cta' },
    ];
    for (const s of sections) {
      const el = await page.$(s.selector);
      if (el) {
        await el.screenshot({ path: `${OUT}/${label}-${s.name}.png` });
      }
    }
  }

  // Measure basic vitals
  const metrics = await page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0];
    return {
      ttfb: nav ? Math.round(nav.responseStart) : null,
      domContentLoaded: nav ? Math.round(nav.domContentLoadedEventEnd) : null,
      loadComplete: nav ? Math.round(nav.loadEventEnd) : null,
    };
  });

  // Count pricing cards + FAQ items
  const counts = await page.evaluate(() => ({
    pricingCards: document.querySelectorAll('.card--pricing').length,
    featuredCards: document.querySelectorAll('.card--pricing--featured').length,
    badges: document.querySelectorAll('.card__pricing-badge').length,
    faqItems: document.querySelectorAll('.home-faq-item').length,
    faqOpen: document.querySelectorAll('.home-faq-item[open]').length,
    ctaLinks: document.querySelectorAll('.pricing-hero__actions a').length,
    finalCtaLinks: document.querySelectorAll('.inner-cta-final__actions a').length,
    tableRows: document.querySelectorAll('.pricing-table tbody tr').length,
    sections: document.querySelectorAll('.pricing-section').length,
  }));

  await page.close();
  return { metrics, counts };
}

const d = await capture(desktopCtx, 'desktop');
const m = await capture(mobileCtx, 'mobile');

await browser.close();

const summary = {
  url: URL,
  desktop: d,
  mobile: m,
  consoleErrors,
  pageErrors,
};

console.log(JSON.stringify(summary, null, 2));
console.log(`\nScreenshots saved to ${OUT}/`);
console.log(`Console errors: ${consoleErrors.length}`);
console.log(`Page errors: ${pageErrors.length}`);

// Acceptance gate
const ok =
  consoleErrors.length === 0 &&
  pageErrors.length === 0 &&
  d.counts.pricingCards === 4 &&
  m.counts.pricingCards === 4 &&
  d.counts.faqItems === 6 &&
  m.counts.faqItems === 6 &&
  d.counts.ctaLinks >= 2 &&
  d.counts.finalCtaLinks >= 2 &&
  d.counts.featuredCards === 1 &&
  d.counts.badges === 1;

if (!ok) {
  console.error('\n❌ Acceptance gate failed');
  process.exit(1);
}
console.log('\n✅ Acceptance gate passed');