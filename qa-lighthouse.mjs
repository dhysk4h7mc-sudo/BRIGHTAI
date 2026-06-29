#!/usr/bin/env node
/**
 * Lighthouse Performance Audit — BrightAI
 * Runs Lighthouse on 6 pages × 2 form factors = 12 audits.
 * Outputs: qa/lighthouse/<form>-<slug>.json + summary.json
 */
import { launch } from 'chrome-launcher';
import lighthouse from 'lighthouse';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUT_DIR = join(ROOT, 'qa', 'lighthouse');
const BASE = 'http://127.0.0.1:4321';

const PAGES = [
  { slug: 'home',     url: '/' },
  { slug: 'pricing',  url: '/pricing/' },
  { slug: 'solutions', url: '/solutions/' },
  { slug: 'kernel',   url: '/kernel/' },
  { slug: 'docs',     url: '/docs/' },
  { slug: 'blog',     url: '/blog/' },
];

const FORMS = [
  {
    id: 'mobile',
    label: 'mobile (Slow 4G)',
    settings: {
      formFactor: 'mobile',
      screenEmulation: {
        mobile: true,
        width: 412,
        height: 823,
        deviceScaleFactor: 1.75,
        disabled: false,
      },
      throttling: {
        rttMs: 150,
        throughputKbps: 1638.4,
        cpuSlowdownMultiplier: 4,
        requestLatencyMs: 0,
        downloadThroughputKbps: 0,
        uploadThroughputKbps: 0,
      },
      emulatedUserAgent:
        'Mozilla/5.0 (Linux; Android 11; moto g power (2022)) AppleWebKit/537.36 ' +
        '(KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36 Chrome-Lighthouse',
    },
  },
  {
    id: 'desktop',
    label: 'desktop (cable)',
    settings: {
      formFactor: 'desktop',
      screenEmulation: {
        mobile: false,
        width: 1350,
        height: 940,
        deviceScaleFactor: 1,
        disabled: false,
      },
      throttling: {
        rttMs: 40,
        throughputKbps: 10240,
        cpuSlowdownMultiplier: 1,
        requestLatencyMs: 0,
        downloadThroughputKbps: 0,
        uploadThroughputKbps: 0,
      },
      emulatedUserAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
        '(KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Chrome-Lighthouse',
    },
  },
];

mkdirSync(OUT_DIR, { recursive: true });

const summary = {
  generatedAt: new Date().toISOString(),
  baseUrl: BASE,
  pages: PAGES,
  forms: FORMS.map((f) => f.id),
  runs: [],
};

const chrome = await launch({
  chromeFlags: [
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    '--disable-dev-shm-usage',
    '--no-first-run',
    '--no-default-browser-check',
  ],
});

console.log(`Chrome launched on port ${chrome.port}`);

try {
  let runIdx = 0;
  const total = PAGES.length * FORMS.length;
  for (const form of FORMS) {
    for (const page of PAGES) {
      runIdx++;
      const url = `${BASE}${page.url}`;
      process.stdout.write(`[${runIdx}/${total}] ${form.id.padEnd(7)} ${page.slug.padEnd(10)} → `);
      const t0 = Date.now();
      try {
        const result = await lighthouse(url, {
          port: chrome.port,
          output: 'json',
          logLevel: 'error',
          onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
          ...form.settings,
        });
        const dur = ((Date.now() - t0) / 1000).toFixed(1);
        if (!result) {
          console.log(`FAIL (no result) ${dur}s`);
          summary.runs.push({ page: page.slug, form: form.id, url, error: 'no result' });
          continue;
        }
        const lhr = result.lhr;
        const cats = lhr.categories;
        const audits = lhr.audits;
        const perf = cats.performance?.score !== null && cats.performance?.score !== undefined ? Math.round(cats.performance.score * 100) : null;
        const a11y = cats.accessibility?.score !== null && cats.accessibility?.score !== undefined ? Math.round(cats.accessibility.score * 100) : null;
        const bp   = cats['best-practices']?.score !== null && cats['best-practices']?.score !== undefined ? Math.round(cats['best-practices'].score * 100) : null;
        const seo  = cats.seo?.score !== null && cats.seo?.score !== undefined ? Math.round(cats.seo.score * 100) : null;
        const lcp  = audits['largest-contentful-paint']?.numericValue;
        const cls  = audits['cumulative-layout-shift']?.numericValue;
        const tbt  = audits['total-blocking-time']?.numericValue;
        const fcp  = audits['first-contentful-paint']?.numericValue;
        const tti  = audits['interactive']?.numericValue;
        const si   = audits['speed-index']?.numericValue;

        const outFile = join(OUT_DIR, `${form.id}-${page.slug}.json`);
        writeFileSync(outFile, JSON.stringify(lhr, null, 2));

        const lcpS = lcp !== null && lcp !== undefined ? Number((lcp / 1000).toFixed(3)) : null;
        const cls3 = cls !== null && cls !== undefined ? Number(cls.toFixed(4)) : null;
        const tbtMs = tbt !== null && tbt !== undefined ? Math.round(tbt) : null;

        const f = (v) => (v === null || v === undefined ? '—' : v);
        console.log(
          `P=${f(perf)} A=${f(a11y)} BP=${f(bp)} SEO=${f(seo)} | LCP=${f(lcpS)}s CLS=${f(cls3)} TBT=${f(tbtMs)}ms | ${dur}s`
        );
        summary.runs.push({
          page: page.slug,
          form: form.id,
          url,
          duration: Number(dur),
          performance: perf,
          accessibility: a11y,
          bestPractices: bp,
          seo,
          lcp: lcpS,
          cls: cls3,
          tbt: tbtMs,
          fcp: fcp !== null && fcp !== undefined ? Number((fcp / 1000).toFixed(3)) : null,
          tti: tti !== null && tti !== undefined ? Number((tti / 1000).toFixed(3)) : null,
          speedIndex: si !== null && si !== undefined ? Number((si / 1000).toFixed(3)) : null,
          outputFile: outFile,
        });
      } catch (err) {
        const dur = ((Date.now() - t0) / 1000).toFixed(1);
        console.log(`ERROR ${err.message} ${dur}s`);
        summary.runs.push({ page: page.slug, form: form.id, url, error: err.message });
      }
    }
  }
} finally {
  await chrome.kill();
}

writeFileSync(join(OUT_DIR, 'summary.json'), JSON.stringify(summary, null, 2));
console.log(`\nWrote ${join(OUT_DIR, 'summary.json')}`);
process.exit(0);
