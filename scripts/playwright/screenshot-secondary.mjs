/**
 * screenshot-secondary.mjs
 *
 * REPORT-13: Secondary Pages Visual Refresh — Playwright verification.
 * Captures desktop + mobile screenshots of the 5 redesigned pages, plus
 * basic Core Web Vitals timing and acceptance gate.
 */

import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const BASE = 'http://localhost:4321';
const OUT = 'download/qa/secondary';

const PAGES = [
  { slug: 'about',         path: '/about/',                                  sections: ['.page-hero', '.inner-section', '.inner-cta-final'] },
  { slug: 'contact',       path: '/contact/',                                sections: ['.page-hero', '.contact-split', '.inner-cta-final'] },
  { slug: 'trust',         path: '/trust/',                                  sections: ['.page-hero', '.trust-compliance-grid', '.inner-faq', '.inner-cta-final'] },
  { slug: 'demo',          path: '/demo/',                                   sections: ['.page-hero', '.demo-stat-strip', '.demo-expect-timeline', '.inner-faq', '.inner-cta-final'] },
  { slug: 'assessment',    path: '/assessment/ai-governance-readiness/',     sections: ['.page-hero', '.assessment-progress', '.inner-cta-final'] },
];

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch();

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

async function capture(ctx, label, pageSpec) {
  const ctxPage = await ctx.newPage();
  ctxPage.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(`[${label}-${pageSpec.slug}] ${msg.text()}`);
  });
  ctxPage.on('pageerror', (err) => pageErrors.push(`[${label}-${pageSpec.slug}] ${err.message}`));

  const url = BASE + pageSpec.path;
  await ctxPage.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

  // Full page
  await ctxPage.screenshot({ path: `${OUT}/${pageSpec.slug}-${label}-full.png`, fullPage: true });
  // Fold (above the fold)
  await ctxPage.screenshot({ path: `${OUT}/${pageSpec.slug}-${label}-fold.png`, fullPage: false });

  // Section captures (desktop only — mobile handled by full)
  if (label === 'desktop') {
    for (const selector of pageSpec.sections) {
      const el = await ctxPage.$(selector);
      if (el) {
        const safe = selector.replace(/[^a-z0-9-]/gi, '');
        await el.screenshot({ path: `${OUT}/${pageSpec.slug}-${label}-${safe}.png` });
      }
    }
  }

  // Measure basic vitals
  const metrics = await ctxPage.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0];
    return nav ? {
      ttfb: Math.round(nav.responseStart),
      domContentLoaded: Math.round(nav.domContentLoadedEventEnd),
      loadComplete: Math.round(nav.loadEventEnd),
    } : null;
  });

  // Section counts for acceptance gate
  const counts = await ctxPage.evaluate((spec) => {
    const out = {};
    for (const sel of spec.sections) {
      const safe = sel.replace(/[^a-z0-9-]/gi, '');
      out[safe] = document.querySelectorAll(sel).length;
    }
    out.formActionExists = !!document.querySelector('form[action*="formsubmit"]');
    out.allActionsCount = document.querySelectorAll('a, button').length;
    out.h1Count = document.querySelectorAll('h1').length;
    return out;
  }, pageSpec);

  await ctxPage.close();
  return { metrics, counts };
}

const results = [];
for (const spec of PAGES) {
  const d = await capture(desktopCtx, 'desktop', spec);
  const m = await capture(mobileCtx, 'mobile', spec);
  results.push({ slug: spec.slug, desktop: d, mobile: m });
}

await browser.close();

console.log(JSON.stringify({ results, consoleErrors, pageErrors }, null, 2));
console.log(`\nScreenshots saved to ${OUT}/`);
console.log(`Console errors: ${consoleErrors.length}`);
console.log(`Page errors: ${pageErrors.length}`);

// Acceptance gate — each page must:
//   - have exactly 1 <h1>
//   - keep its form (Contact page specifically)
//   - have no console / page errors
const ok =
  consoleErrors.length === 0 &&
  pageErrors.length === 0 &&
  results.every(r => r.desktop.counts.h1Count === 1 && r.mobile.counts.h1Count === 1) &&
  results.find(r => r.slug === 'contact').desktop.counts.formActionExists === true;

if (!ok) {
  console.error('\n❌ Acceptance gate failed');
  process.exit(1);
}
console.log('\n✅ Acceptance gate passed');
