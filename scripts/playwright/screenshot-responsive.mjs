/**
 * screenshot-responsive.mjs
 *
 * REPORTS-19: Responsive Design Audit.
 * Captures screenshots at all 6 standard breakpoints (320, 390, 768, 1024, 1280, 1536, 1920),
 * detects horizontal-scroll overflow, measures touch-target sizes, and reports.
 */

import { chromium, devices } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';

const BASE = 'http://localhost:4173';
const OUT = 'download/qa/responsive';

const BREAKPOINTS = [
  { name: '320',  width: 320,  height: 720,  tag: 'mobile-xxs',  expected: 'mobile'  },
  { name: '390',  width: 390,  height: 844,  tag: 'mobile-xs',   expected: 'mobile'  },
  { name: '414',  width: 414,  height: 896,  tag: 'mobile-sm',   expected: 'mobile'  },
  { name: '768',  width: 768,  height: 1024, tag: 'tablet-md',   expected: 'tablet'  },
  { name: '1024', width: 1024, height: 768,  tag: 'tablet-lg',   expected: 'tablet'  },
  { name: '1280', width: 1280, height: 800,  tag: 'laptop-xl',   expected: 'desktop' },
  { name: '1440', width: 1440, height: 900,  tag: 'desktop-xxl', expected: 'desktop' },
  { name: '1536', width: 1536, height: 960,  tag: 'desktop-2xl', expected: 'desktop' },
  { name: '1920', width: 1920, height: 1080, tag: 'desktop-hd',  expected: 'desktop' },
];

const PAGES = [
  { slug: 'home',         path: '/' },
  { slug: 'about',        path: '/about/' },
  { slug: 'pricing',      path: '/pricing/' },
  { slug: 'contact',      path: '/contact/' },
  { slug: 'trust',        path: '/trust/' },
  { slug: 'solutions',    path: '/solutions/' },
  { slug: 'kernel',       path: '/kernel/' },
  { slug: 'blog-index',   path: '/blog/' },
  { slug: 'docs-index',   path: '/docs/' },
];

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch();
const results = [];
const consoleErrors = [];
const pageErrors = [];

for (const bp of BREAKPOINTS) {
  const ctx = await browser.newContext({
    viewport: { width: bp.width, height: bp.height },
    deviceScaleFactor: 1,
    isMobile: bp.width < 768,
    hasTouch: bp.width < 1024,
  });

  for (const pageSpec of PAGES) {
    const ctxPage = await ctx.newPage();
    ctxPage.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(`[${bp.name}-${pageSpec.slug}] ${msg.text()}`);
    });
    ctxPage.on('pageerror', (err) => pageErrors.push(`[${bp.name}-${pageSpec.slug}] ${err.message}`));

    try {
      const url = BASE + pageSpec.path;
      await ctxPage.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

      // Detect horizontal overflow
      const overflow = await ctxPage.evaluate(() => {
        const docW = document.documentElement.scrollWidth;
        const winW = window.innerWidth;
        const overflowing = [];
        if (docW > winW + 1) {
          // Find culprits
          const all = document.querySelectorAll('*');
          for (const el of all) {
            const r = el.getBoundingClientRect();
            if (r.right > winW + 1 || r.left < -1) {
              const sel = el.tagName.toLowerCase()
                + (el.id ? '#' + el.id : '')
                + (typeof el.className === 'string' ? '.' + el.className.split(' ').filter(Boolean).slice(0, 3).join('.') : '');
              overflowing.push({
                sel: sel.slice(0, 100),
                right: Math.round(r.right),
                width: Math.round(r.width),
              });
              if (overflowing.length >= 5) break;
            }
          }
        }
        return { docW, winW, overflowing };
      });

      // Detect small touch targets
      const smallTargets = await ctxPage.evaluate(() => {
        if (window.innerWidth >= 1024) return [];
        const small = [];
        const interactive = document.querySelectorAll('button, a[href], input, select, textarea, [role="button"], [tabindex="0"]');
        for (const el of interactive) {
          const r = el.getBoundingClientRect();
          if (r.width === 0 || r.height === 0) continue;
          if (r.width < 44 || r.height < 44) {
            const sel = el.tagName.toLowerCase()
              + (el.id ? '#' + el.id : '')
              + (typeof el.className === 'string' ? '.' + el.className.split(' ').filter(Boolean).slice(0, 2).join('.') : '');
            small.push({
              sel: sel.slice(0, 80),
              w: Math.round(r.width),
              h: Math.round(r.height),
              text: (el.textContent || '').trim().slice(0, 30),
            });
            if (small.length >= 5) break;
          }
        }
        return small;
      });

      // Detect too-small text
      const smallText = await ctxPage.evaluate(() => {
        const issues = [];
        const els = document.querySelectorAll('p, li, span, a, button, td, th, label, small');
        for (const el of els) {
          const r = el.getBoundingClientRect();
          if (r.width === 0) continue;
          const fs = parseFloat(getComputedStyle(el).fontSize);
          if (fs > 0 && fs < 14) {
            issues.push({
              sel: el.tagName.toLowerCase() + (typeof el.className === 'string' ? '.' + el.className.split(' ').filter(Boolean).slice(0, 2).join('.') : ''),
              fs: Math.round(fs * 10) / 10,
              text: (el.textContent || '').trim().slice(0, 30),
            });
            if (issues.length >= 3) break;
          }
        }
        return issues;
      });

      // Screenshot
      const filename = `${OUT}/${pageSpec.slug}-${bp.name}.png`;
      await ctxPage.screenshot({ path: filename, fullPage: false });

      results.push({
        page: pageSpec.slug,
        path: pageSpec.path,
        bp: bp.name,
        width: bp.width,
        docW: overflow.docW,
        horizontalScroll: overflow.docW > overflow.winW + 1,
        scrollDelta: overflow.docW - overflow.winW,
        overflowCulprits: overflow.overflowing,
        smallTargets: smallTargets,
        smallText: smallText,
      });
    } catch (err) {
      results.push({
        page: pageSpec.slug,
        path: pageSpec.path,
        bp: bp.name,
        width: bp.width,
        error: err.message,
      });
    } finally {
      await ctxPage.close();
    }
  }
  await ctx.close();
}

await browser.close();

// Summary
const summary = {
  totalCaptures: results.length,
  horizontalScrollIssues: results.filter((r) => r.horizontalScroll).length,
  smallTargetIssues: results.filter((r) => r.smallTargets && r.smallTargets.length > 0).length,
  smallTextIssues: results.filter((r) => r.smallText && r.smallText.length > 0).length,
  errorCount: results.filter((r) => r.error).length,
  consoleErrors: consoleErrors.length,
  pageErrors: pageErrors.length,
  issuesByPage: {},
  issuesByBreakpoint: {},
};

for (const r of results) {
  if (r.horizontalScroll) {
    summary.issuesByPage[r.page] = (summary.issuesByPage[r.page] || 0) + 1;
    summary.issuesByBreakpoint[r.bp] = (summary.issuesByBreakpoint[r.bp] || 0) + 1;
  }
}

await writeFile(`${OUT}/report.json`, JSON.stringify({ results, summary, consoleErrors, pageErrors }, null, 2));

console.log('\n══ Responsive Audit Summary ══');
console.log(`Captures:       ${summary.totalCaptures}`);
console.log(`H-scroll issues: ${summary.horizontalScrollIssues}`);
console.log(`Small targets:  ${summary.smallTargetIssues}`);
console.log(`Small text:     ${summary.smallTextIssues}`);
console.log(`Errors:         ${summary.errorCount}`);
console.log(`Console errors: ${summary.consoleErrors}`);
console.log(`Page errors:    ${summary.pageErrors}`);
console.log(`\nIssues by page:`, summary.issuesByPage);
console.log(`Issues by bp:`, summary.issuesByBreakpoint);
console.log(`\nScreenshots: ${OUT}/`);
