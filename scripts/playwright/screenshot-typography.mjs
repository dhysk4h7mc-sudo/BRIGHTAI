// Typography reference page screenshot — Playwright one-off script.
// Captures /design/typography/ at mobile (390x844 iPhone 14) + desktop (1440x900)
// viewports. Used to verify the typography system before/after changes.
//
// Usage: node scripts/playwright/screenshot-typography.mjs
// Requires: built dist/ (run `npm run build` first) + `npx playwright install chromium`

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
    const url = `${BASE_URL}/design/typography/`;

    console.log(`→ ${vp.name} (${vp.width}x${vp.height}) — ${url}`);
    const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });

    if (!response || !response.ok()) {
      console.error(`  ✗ HTTP ${response?.status() ?? 'no response'}`);
      continue;
    }

    // Wait briefly for fonts (IBM Plex Sans Arabic Google Fonts)
    await page.waitForTimeout(800);

    const outputPath = join(OUTPUT_DIR, `typography-${vp.name}-${vp.width}x${vp.height}.png`);
    await page.screenshot({ path: outputPath, fullPage: true });
    console.log(`  ✓ ${outputPath}`);

    // Also screenshot just the first viewport (above the fold) for LCP check
    const aboveFoldPath = join(OUTPUT_DIR, `typography-${vp.name}-${vp.width}x${vp.height}-fold.png`);
    await page.screenshot({ path: aboveFoldPath, fullPage: false });
    console.log(`  ✓ ${aboveFoldPath}`);

    await context.close();
  }
} finally {
  await browser.close();
}

console.log('\n✅ Typography screenshots complete.');