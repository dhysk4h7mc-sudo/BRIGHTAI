/**
 * screenshot-content-pages.mjs
 *
 * REPORT-12: Blog + Docs + Hub content-pages visual verification.
 *
 * Captures desktop + mobile screenshots of:
 * - /blog/ (index)
 * - /blog/what-is-ai-governance-saudi-companies/ (sample article)
 * - /docs/ (hub index)
 * - /docs/ai-governance-saudi-arabia/ (sample docs page)
 * - /hub/ (hub index)
 * - /hub/ai-governance/ (sample hub sub-page)
 *
 * Saves screenshots under download/qa/content-pages/
 * Reports console errors, page errors, and basic acceptance counts.
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const BASE = 'http://localhost:4321';
const OUT = 'download/qa/content-pages';

await mkdir(OUT, { recursive: true });

const PAGES = [
  { path: '/blog/', name: 'blog-index', sections: [
    { selector: '.blog-index__hero', name: 'hero' },
    { selector: '.blog-paths', name: 'paths' },
    { selector: '.blog-featured', name: 'featured' },
    { selector: '.blog-filters', name: 'filters' },
    { selector: '#blog-grid', name: 'grid' },
    { selector: '.blog-final-cta', name: 'final-cta' },
  ]},
  { path: '/blog/what-is-ai-governance-saudi-companies/', name: 'blog-article', sections: [
    { selector: '.article-hero', name: 'hero' },
    { selector: '.article-content', name: 'content' },
    { selector: '.author-bio', name: 'author' },
    { selector: '.related-posts', name: 'related' },
    { selector: '.article-links', name: 'links' },
    { selector: '.article-demo-cta', name: 'final-cta' },
  ]},
  { path: '/docs/', name: 'docs-index', sections: [
    { selector: '.docs-index__hero', name: 'hero' },
    { selector: '.docs-search', name: 'search' },
    { selector: '#docs-solutions', name: 'section-solutions' },
    { selector: '.docs-cluster', name: 'cluster' },
    { selector: '.docs-quick-links', name: 'quick-links' },
    { selector: '.docs-recent', name: 'recent' },
    { selector: '.docs-faq', name: 'faq' },
    { selector: '.content-cta-final', name: 'final-cta' },
  ]},
  { path: '/docs/ai-governance-saudi-arabia/', name: 'docs-page', sections: [
    { selector: '.article-hero', name: 'hero' },
    { selector: '.article-tldr', name: 'tldr' },
    { selector: '.docs-toc', name: 'toc' },
    { selector: '.article-content', name: 'content' },
    { selector: '.docs-related', name: 'related' },
    { selector: '.docs-helpful', name: 'helpful' },
    { selector: '.docs-prev-next', name: 'prev-next' },
    { selector: '.docs-demo-cta', name: 'final-cta' },
  ]},
  { path: '/hub/', name: 'hub-index', sections: [
    { selector: '.hub-page__hero', name: 'hero' },
    { selector: '.hub-page__grid', name: 'grid' },
    { selector: '.content-cta-final', name: 'final-cta' },
  ]},
  { path: '/hub/ai-governance/', name: 'hub-subpage', sections: [
    { selector: '.hub-subpage__hero', name: 'hero' },
    { selector: '.hub-related', name: 'related' },
    { selector: '.content-cta-final', name: 'final-cta' },
  ]},
];

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

async function capture(ctx, label) {
  const page = await ctx.newPage();
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(`[${label}] ${msg.text()}`);
  });
  page.on('pageerror', (err) => pageErrors.push(`[${label}] ${err.message}`));

  for (const target of PAGES) {
    const url = `${BASE}${target.path}`;
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      // Full page
      await page.screenshot({ path: `${OUT}/${label}-${target.name}-full.png`, fullPage: true });
      // Fold
      await page.screenshot({ path: `${OUT}/${label}-${target.name}-fold.png`, fullPage: false });

      // Section captures (desktop only)
      if (label === 'desktop') {
        for (const s of target.sections) {
          const el = await page.$(s.selector);
          if (el) {
            await el.screenshot({ path: `${OUT}/${label}-${target.name}-${s.name}.png` });
          }
        }
      }
    } catch (err) {
      console.error(`Failed ${label} ${target.path}: ${err.message}`);
    }
  }
  await page.close();
}

await capture(desktopCtx, 'desktop');
await capture(mobileCtx, 'mobile');

// Acceptance counts on the desktop view
const page = await desktopCtx.newPage();
await page.goto(`${BASE}/blog/`, { waitUntil: 'networkidle', timeout: 30000 });
const blogCounts = await page.evaluate(() => ({
  listingCards: document.querySelectorAll('.listing-card').length,
  featuredCards: document.querySelectorAll('.listing-card--featured').length,
  filterButtons: document.querySelectorAll('.blog-filters__btn').length,
  pathsCards: document.querySelectorAll('.blog-path').length,
  featuredCluster: document.querySelectorAll('.blog-featured a').length,
}));

await page.goto(`${BASE}/blog/what-is-ai-governance-saudi-companies/`, { waitUntil: 'networkidle' });
const articleCounts = await page.evaluate(() => ({
  headings: document.querySelectorAll('.article-content h2').length,
  paragraphs: document.querySelectorAll('.article-content p').length,
  pre: document.querySelectorAll('.article-content pre').length,
  tables: document.querySelectorAll('.article-content table').length,
  authorBio: document.querySelectorAll('.author-bio').length,
  relatedPosts: document.querySelectorAll('.related-posts__card').length,
  linksGrid: document.querySelectorAll('.article-links__grid a').length,
}));

await page.goto(`${BASE}/docs/`, { waitUntil: 'networkidle' });
const docsCounts = await page.evaluate(() => ({
  sectionCards: document.querySelectorAll('.docs-index__card').length,
  clusters: document.querySelectorAll('.docs-cluster').length,
  faqItems: document.querySelectorAll('.docs-faq__item').length,
  recentItems: document.querySelectorAll('.docs-recent__item').length,
  quickLinks: document.querySelectorAll('.docs-quick-links__list a').length,
  searchInput: document.querySelectorAll('.docs-search__input').length,
}));

await page.goto(`${BASE}/docs/ai-governance-saudi-arabia/`, { waitUntil: 'networkidle' });
const docsPageCounts = await page.evaluate(() => ({
  tocItems: document.querySelectorAll('.docs-toc__item').length,
  headings: document.querySelectorAll('.article-content h2').length,
  relatedDocs: document.querySelectorAll('.docs-related__card').length,
  helpfulBtn: document.querySelectorAll('.docs-helpful__btn').length,
  prevNextCells: document.querySelectorAll('.docs-prev-next__cell').length,
  metaUpdated: document.querySelectorAll('.docs-meta__updated').length,
  metaEdit: document.querySelectorAll('.docs-meta__edit').length,
}));

await page.goto(`${BASE}/hub/`, { waitUntil: 'networkidle' });
const hubCounts = await page.evaluate(() => ({
  hubCards: document.querySelectorAll('.hub-card--clean').length,
}));

await page.goto(`${BASE}/hub/ai-governance/`, { waitUntil: 'networkidle' });
const hubSubCounts = await page.evaluate(() => ({
  relatedCards: document.querySelectorAll('.hub-related-card').length,
}));

await browser.close();

console.log('=== REPORT-12: Content Pages — Visual + Acceptance ===');
console.log('Console errors:', consoleErrors.length);
consoleErrors.forEach((e) => console.log(' -', e));
console.log('Page errors:', pageErrors.length);
pageErrors.forEach((e) => console.log(' -', e));
console.log('');
console.log('Blog index:', blogCounts);
console.log('Blog article:', articleCounts);
console.log('Docs index:', docsCounts);
console.log('Docs page:', docsPageCounts);
console.log('Hub index:', hubCounts);
console.log('Hub sub-page:', hubSubCounts);

if (pageErrors.length > 0) process.exit(1);
console.log('\nAcceptance gate: ✅ captured, no page errors.');
