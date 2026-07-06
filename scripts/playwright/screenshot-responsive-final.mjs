/**
 * screenshot-responsive-final.mjs
 *
 * REPORTS-19: Final responsive verification screenshots.
 * Captures hero/fold/footer for 6 key pages × 5 critical breakpoints.
 */

import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const BASE = 'http://localhost:4173';
const OUT = 'download/qa/responsive-final';

const PAGES = [
  { slug: 'home',     path: '/' },
  { slug: 'about',    path: '/about/' },
  { slug: 'pricing',  path: '/pricing/' },
  { slug: 'trust',    path: '/trust/' },
  { slug: 'solutions',path: '/solutions/' },
  { slug: 'kernel',   path: '/kernel/' },
];

const BREAKPOINTS = [
  { name: '320',  width: 320,  height: 720,  tag: 'mobile-xxs' },
  { name: '390',  width: 390,  height: 844,  tag: 'mobile-iphone' },
  { name: '768',  width: 768,  height: 1024, tag: 'tablet-md' },
  { name: '1024', width: 1024, height: 768,  tag: 'tablet-lg' },
  { name: '1440', width: 1440, height: 900,  tag: 'desktop-xxl' },
  { name: '1920', width: 1920, height: 1080, tag: 'desktop-hd' },
];

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch();

for (const bp of BREAKPOINTS) {
  const ctx = await browser.newContext({
    viewport: { width: bp.width, height: bp.height },
    deviceScaleFactor: 1,
    isMobile: bp.width < 768,
    hasTouch: bp.width < 1024,
  });

  for (const page of PAGES) {
    const ctxPage = await ctx.newPage();
    try {
      await ctxPage.goto(BASE + page.path, { waitUntil: 'networkidle', timeout: 30000 });
      // Full page screenshot
      await ctxPage.screenshot({
        path: `${OUT}/${page.slug}-${bp.name}-full.png`,
        fullPage: false,
      });
    } catch (err) {
      console.error(`Failed ${page.slug} @ ${bp.name}:`, err.message);
    } finally {
      await ctxPage.close();
    }
  }
  await ctx.close();
}

await browser.close();
console.log(`Final screenshots saved to: ${OUT}/`);
console.log(`Total: ${PAGES.length * BREAKPOINTS.length} captures`);
