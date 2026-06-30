// Homepage before/after screenshot for typography change — Playwright one-off script.
// Captures / at mobile + desktop to verify hero h1 + body line-height improvements.
//
// Usage: node scripts/playwright/screenshot-homepage-typography.mjs

import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = join(__dirname, '..', '..', 'download', 'qa', 'typography');
const BASE_URL = 'http://localhost:4321';

const viewports = [
  { name: 'mobile', width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  { name: 'desktop', width: 1440, height: 900, deviceScaleFactor: 1, isMobile: false },
];

await mkdir(OUTPUT_DIR, { recursive: true });

const browser = await chromium.launch();

try {
  for (const vp of viewports) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: vp.deviceScaleFactor,
      isMobile: vp.isMobile ?? false,
      hasTouch: vp.hasTouch ?? false,
    });

    const page = await context.newPage();
    const url = `${BASE_URL}/`;

    console.log(`→ ${vp.name} (${vp.width}x${vp.height}) — ${url}`);
    const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 20000 });

    if (!response || !response.ok()) {
      console.error(`  ✗ HTTP ${response?.status() ?? 'no response'}`);
      continue;
    }

    await page.waitForTimeout(1000);  // fonts

    // Above-the-fold only (for LCP check)
    const foldPath = join(OUTPUT_DIR, `homepage-${vp.name}-${vp.width}x${vp.height}-fold.png`);
    await page.screenshot({ path: foldPath, fullPage: false });
    console.log(`  ✓ ${foldPath}`);

    await context.close();
  }
} finally {
  await browser.close();
}

console.log('\n✅ Homepage typography screenshots complete.');