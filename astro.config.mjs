// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

/**
 * astro.config.mjs — REPORTS-SEC-01 hardening (2026-07-06)
 *
 * CHANGE: added `@astrojs/vercel` adapter so the new server endpoint
 * `src/pages/api/ai/chat.ts` can run server-side and read AI provider
 * keys from `import.meta.env` (server-only, never bundled to client).
 *
 * PRESERVATION CONTRACT:
 *  - `output: 'static'` retained → all `.astro` pages remain prerendered HTML.
 *  - API route explicitly opts out via `export const prerender = false`
 *    → it becomes a serverless function; everything else stays static.
 *  - `site`, `trailingSlash: 'always'`, `compressHTML`, `redirects`,
 *    `integrations` (sitemap), `vite` config unchanged.
 *
 * DEPLOYMENT NOTE:
 *  - Vercel: works out-of-the-box. `astro build` will emit
 *    `.vercel/output/functions/api/ai/chat.func/` + static `dist/`.
 *  - Render static: does NOT execute Vercel functions. To deploy on
 *    Render, either (a) swap `vercel(...)` for `node({ mode: 'standalone' })`
 *    + `npm install @astrojs/node`, or (b) migrate hosting to Vercel.
 *    This is documented in reports/2026-07-06-secret-hardening.md.
 */
export default defineConfig({
  site: 'https://brightai.site',
  output: 'static',
  trailingSlash: 'always',
  compressHTML: true,
  redirects: {
    '/report/': {
      status: 301,
      destination: '/trust/',
    },
  },
  build: {
    format: 'directory',
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'ar',
        locales: {
          ar: 'ar-SA',
          en: 'en-SA',
        },
      },
      filter: (page) => !page.includes('/404') && !page.includes('/design'),
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
    }),
  ],
  adapter: vercel({
    // We rely on Astro's built-in image pipeline; do not double-process via Vercel.
    imageService: false,
    // No Vercel Web Analytics — BrightAI uses GA4 + Clarity instead.
    webAnalytics: false,
    // Exclude the legacy preview/manifest paths from edge middleware if any.
    edgeMiddleware: false,
  }),
  vite: {
    build: {
      cssMinify: true,
    },
  },
});