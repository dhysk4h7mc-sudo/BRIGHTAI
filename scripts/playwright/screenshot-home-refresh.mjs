// REPORT-09 Homepage visual refresh — Playwright screenshot script.
// Captures desktop + mobile (full page + above-the-fold) for the visual review.
//
// Usage: node scripts/playwright/screenshot-home-refresh.mjs
//
// Outputs to: download/qa/home-refresh/

import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = join(__dirname, '..', '..', 'download', 'qa', 'home-refresh');
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
    const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

    if (!response || !response.ok()) {
      console.error(`  ✗ HTTP ${response?.status() ?? 'no response'}`);
      continue;
    }

    // Wait for fonts + any client-side hydration
    await page.waitForTimeout(1500);

    // 1. Above-the-fold (hero)
    const foldPath = join(OUTPUT_DIR, `home-${vp.name}-fold.png`);
    await page.screenshot({ path: foldPath, fullPage: false });
    console.log(`  ✓ ${foldPath}`);

    // 2. Full page
    const fullPath = join(OUTPUT_DIR, `home-${vp.name}-full.png`);
    await page.screenshot({ path: fullPath, fullPage: true });
    console.log(`  ✓ ${fullPath}`);

    // 3. Per-section screenshots (desktop only — keep artifact count sane)
    if (vp.name === 'desktop') {
      const sections = [
        { id: 'trust-signals', name: 'trust' },
        { id: 'problem', name: 'problem' },
        { id: 'ai-governance-center', name: 'governance-center' },
        { id: 'product', name: 'product' },
        { id: 'layers', name: 'layers' },
        { id: 'compliance', name: 'compliance' },
        { id: 'sectors', name: 'sectors' },
        { id: 'evidence', name: 'evidence' },
        { id: 'why', name: 'comparison' },
        { id: 'faq', name: 'faq' },
        { id: 'demo', name: 'demo' },
        { id: 'final-cta', name: 'final-cta' },
      ];

      for (const section of sections) {
        try {
          const el = await page.$(`#${section.id}`);
          if (!el) {
            console.log(`  ⚠ Section #${section.id} not found`);
            continue;
          }
          await el.scrollIntoViewIfNeeded();
          await page.waitForTimeout(400);  // counter animation settle
          const sectionPath = join(OUTPUT_DIR, `section-${section.name}-${vp.name}.png`);
          await el.screenshot({ path: sectionPath });
          console.log(`  ✓ ${sectionPath}`);
        } catch (err) {
          console.error(`  ✗ Section ${section.name}: ${err.message}`);
        }
      }
    }

    await context.close();
  }
} finally {
  await browser.close();
}

console.log('\n✅ REPORT-09 screenshots complete. Output:', OUTPUT_DIR);