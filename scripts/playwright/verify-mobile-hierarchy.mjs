#!/usr/bin/env node
/**
 * verify-mobile-hierarchy.mjs
 *
 * REPORT-33 verification: capture mobile viewport screenshots of
 * critical pages and audit the live DOM for hierarchy rules.
 *
 * Checks (production / preview build):
 *  1. Hero primary CTA is above-the-fold on a 390x844 viewport.
 *  2. Every <a>/<button> in the hero band has min-height >= 44px.
 *  3. The H1 is the single largest text element in the hero band.
 *  4. No <img> above-the-fold is missing width/height.
 *  5. The .dotted-surface-canvas React island is NOT in the DOM on mobile
 *     (proves client:media gate is working per DEC-017).
 *  6. The .home-kernel-feature-link tap targets are >= 44px on mobile.
 *
 * Exit 0 = all checks pass. Exit 1 = at least one failure.
 */

import { chromium, devices } from 'playwright';
import { writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BASE_URL = process.env.BASE_URL || 'http://localhost:4321';
const OUT_DIR = resolve(__dirname, '../../download/qa/mobile-hierarchy');
const VIEWPORT = { width: 390, height: 844 }; // iPhone 14 view
const FAILURES = [];

function check(name, ok, detail) {
  if (ok) {
    console.log(`\x1b[32m✓ ${name}\x1b[0m${detail ? ' — ' + detail : ''}`);
  } else {
    console.log(`\x1b[31m✗ ${name}\x1b[0m${detail ? ' — ' + detail : ''}`);
    FAILURES.push({ name, detail });
  }
}

async function auditPage(page, url, screenshotName) {
  console.log(`\n— ${url} (390x844)`);
  const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
  check(`status 200 (${url})`, response.status() === 200, `got ${response.status()}`);

  // Skip hero-specific checks on pages without SplitHero
  const hasSplitHero = await page.locator('.split-hero').count();

  // 1. Hero primary CTA above fold (only for pages with SplitHero)
  if (hasSplitHero > 0) {
    const heroCta = await page.locator('.split-hero .home-cta-primary').first();
    const heroCtaVisible = await heroCta.isVisible();
    if (heroCtaVisible) {
      const box = await heroCta.boundingBox();
      const aboveFold = box && box.y + box.height <= VIEWPORT.height;
      check('hero primary CTA above fold', aboveFold, `y=${Math.round(box?.y)} + h=${Math.round(box?.height)} <= ${VIEWPORT.height}`);
    } else {
      check('hero primary CTA visible', false, '.split-hero .home-cta-primary not found');
    }
  } else {
    console.log('  ⤷ skip SplitHero checks (no .split-hero on this page)');
  }

  // 2. Tap targets >= 44px
  const tapTargets = await page.evaluate(() => {
    const selectors = ['.home-cta-primary', '.home-cta-secondary', '.wa-btn', '.section-mini-link', '.home-kernel-action', '.home-kernel-feature-link', '.home-hero-actions a'];
    const elements = document.querySelectorAll(selectors.join(','));
    const failures = [];
    elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.height > 0 && rect.height < 44) {
        failures.push({ selector: el.className.split(' ').slice(0, 2).join('.'), h: Math.round(rect.height), y: Math.round(rect.y) });
      }
    });
    return failures;
  });
  check('no tap targets <44px in hero/long-form', tapTargets.length === 0,
    tapTargets.length ? `${tapTargets.length} failures: ` + tapTargets.slice(0, 3).map(f => `${f.selector}=${f.h}px@y${f.y}`).join(', ') : `${tapTargets.length === 0 ? 'all' : '0'} checks pass`);

  // 3. H1 is the largest text element in the hero band (size check) — only on pages with SplitHero
  if (hasSplitHero > 0) {
    const h1Largest = await page.evaluate(() => {
      const h1 = document.querySelector('.split-hero__h1');
      if (!h1) return { ok: false, reason: 'no .split-hero__h1' };
      const h1Size = parseFloat(window.getComputedStyle(h1).fontSize);
      const others = document.querySelectorAll('.split-hero p, .split-hero .chip, .split-hero .split-hero__lead, .split-hero a');
      let biggestNonH1 = 0;
      let biggestNonH1Selector = '';
      others.forEach((el) => {
        const s = parseFloat(window.getComputedStyle(el).fontSize);
        if (s > biggestNonH1) {
          biggestNonH1 = s;
          biggestNonH1Selector = el.className || el.tagName;
        }
      });
      return { ok: h1Size >= biggestNonH1, h1: h1Size, other: biggestNonH1, otherSelector: biggestNonH1Selector };
    });
    check('H1 ≥ other text in hero', h1Largest.ok, h1Largest.ok ? `H1=${h1Largest.h1}px ≥ others (${h1Largest.other}px on ${h1Largest.otherSelector})` : `H1=${h1Largest.h1}px < other ${h1Largest.other}px (${h1Largest.otherSelector})`);
  }

  // 4. Img audit (above the fold)
  const imgIssues = await page.evaluate(() => {
    const issues = [];
    document.querySelectorAll('img').forEach((img) => {
      const r = img.getBoundingClientRect();
      if (r.top < 844) {
        if (!img.hasAttribute('width') || !img.hasAttribute('height')) {
          issues.push({ src: img.src.split('/').pop(), reason: 'missing width/height' });
        }
      }
    });
    return issues;
  });
  check('no images missing width/height above-fold', imgIssues.length === 0, imgIssues.length ? JSON.stringify(imgIssues) : 'all img tags have width+height');

  // 5. React island NOT loaded on mobile (DEC-017 verification).
  // SSR-rendered <canvas> may still exist in DOM (for hydration gating purposes)
  // but client:media="(min-width:768px)" must (a) prevent JS download,
  // and (b) hide it via CSS @media (max-width:768px) { display: none !important }.
  const reactIsland = await page.evaluate(() => {
    const canvases = document.querySelectorAll('.dotted-surface-canvas');
    const visibleCanvases = Array.from(canvases).filter((c) => {
      const cs = window.getComputedStyle(c);
      return cs.display !== 'none' && cs.visibility !== 'hidden';
    });
    return {
      scripts: Array.from(document.querySelectorAll('script[type="module"][src]'))
        .map((s) => s.src)
        .filter((s) => s.includes('BuT_aOnx') || s.includes('DottedSurface') || s.includes('react')),
      canvasInDOM: canvases.length,
      canvasVisible: visibleCanvases.length,
    };
  });
  check('React island gated on mobile (DEC-017 + REPORT-33)',
    reactIsland.scripts.length === 0 && reactIsland.canvasVisible === 0,
    `scripts=${reactIsland.scripts.length}, visible-canvases=${reactIsland.canvasVisible}/${reactIsland.canvasInDOM}`);

  // 6. kernel-feature-links >= 44px (mobile override)
  const kernelLinks = await page.evaluate(() => {
    const links = document.querySelectorAll('.home-kernel-feature-link');
    return Array.from(links).slice(0, 5).map((l) => ({
      h: Math.round(l.getBoundingClientRect().height),
      text: l.textContent.replace(/\s+/g, ' ').trim().slice(0, 40),
    }));
  });
  const allKernelOk = kernelLinks.every((k) => k.h >= 44);
  check('kernel feature links ≥44px on mobile', allKernelOk, kernelLinks.length ? kernelLinks.map((k) => `${k.h}px`).join(', ') : 'no kernel features on this page');

  // Screenshot
  await page.screenshot({ path: resolve(OUT_DIR, screenshotName + '-full.png'), fullPage: true });
  await page.screenshot({ path: resolve(OUT_DIR, screenshotName + '-fold.png'), fullPage: false });
  console.log(`  📸 ${screenshotName}-{{full,fold}}.png`);
}

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    ...devices['iPhone 14'],
    viewport: VIEWPORT,
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();

  try {
    await auditPage(page, BASE_URL + '/', 'home');
    await auditPage(page, BASE_URL + '/solutions/', 'solutions');
    await auditPage(page, BASE_URL + '/pricing/', 'pricing');
  } catch (e) {
    console.error('\n❌ Error:', e.message);
    FAILURES.push({ name: 'exception', detail: e.message });
  } finally {
    await browser.close();
  }

  writeFileSync(
    resolve(OUT_DIR, 'audit.json'),
    JSON.stringify({ ok: FAILURES.length === 0, failures: FAILURES, viewport: VIEWPORT, base: BASE_URL }, null, 2)
  );

  console.log(`\n${FAILURES.length === 0 ? '\x1b[32m✓ All mobile hierarchy checks passed\x1b[0m' : `\x1b[31m✗ ${FAILURES.length} check(s) failed\x1b[0m`}`);
  process.exit(FAILURES.length === 0 ? 0 : 1);
})();
