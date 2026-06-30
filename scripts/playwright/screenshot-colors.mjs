// Colors reference page screenshot — Playwright one-off script.
// Captures /design/colors/ at mobile + desktop, plus the homepage and a
// solutions page to verify the updated card/button/chip tokens in
// production. Used to validate the v3.1 color system (DEC-2026-033).
//
// Usage: node scripts/playwright/screenshot-colors.mjs
// Requires: built dist/ (run `npm run build` first) + `npx playwright install chromium`

import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = join(__dirname, '..', '..', 'download', 'qa', 'colors');
const BASE_URL = 'http://localhost:4321';

const viewports = [
  { name: 'mobile', width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  { name: 'desktop', width: 1440, height: 900, deviceScaleFactor: 1, isMobile: false },
];

const targets = [
  { name: 'colors', url: '/design/colors/', desc: 'Colors reference page' },
  { name: 'homepage', url: '/', desc: 'Homepage (cards + buttons + chips)' },
  { name: 'solutions', url: '/solutions/', desc: 'Solutions index (feature cards)' },
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

    for (const target of targets) {
      const url = `${BASE_URL}${target.url}`;
      console.log(`→ ${vp.name} (${vp.width}x${vp.height}) — ${url}`);

      const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });

      if (!response || !response.ok()) {
        console.error(`  ✗ HTTP ${response?.status() ?? 'no response'}`);
        continue;
      }

      // Wait briefly for fonts (IBM Plex Sans Arabic Google Fonts)
      await page.waitForTimeout(800);

      const outputPath = join(OUTPUT_DIR, `${target.name}-${vp.name}-${vp.width}x${vp.height}.png`);
      await page.screenshot({ path: outputPath, fullPage: true });

      const foldPath = join(OUTPUT_DIR, `${target.name}-${vp.name}-fold.png`);
      await page.screenshot({ path: foldPath, fullPage: false });

      console.log(`  ✓ ${outputPath}`);
    }

    await context.close();
  }
} finally {
  await browser.close();
}

console.log(`\n✅ Screenshots saved to ${OUTPUT_DIR}`);