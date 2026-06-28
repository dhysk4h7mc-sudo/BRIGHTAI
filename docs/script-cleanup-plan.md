# Script Cleanup Plan

## Scripts Referenced in package.json (KEEP)
- scripts/apply-css-bundle.mjs
- scripts/apply-production-audit-fixes.mjs
- scripts/build-css-bundle.mjs
- scripts/build-tailwind-purged.mjs
- scripts/check-performance-budget.js
- scripts/check-redirect-destinations.mjs
- scripts/check-render-readiness.mjs
- scripts/check-render-route-hygiene.mjs
- scripts/check-speakable-schema.mjs
- scripts/check-word-count.mjs
- scripts/content-acceptance.test.mjs
- scripts/fix-internal-links.mjs
- scripts/fix-resource-paths.mjs
- scripts/generate-image-sitemap.mjs
- scripts/generate-sitemap-all-pages.mjs
- scripts/internal-linking-architecture.mjs
- scripts/internal-links-audit.mjs
- scripts/legacy-paths-audit.mjs
- scripts/legacy-seo-surface.test.mjs
- scripts/link-graph-validator.mjs
- scripts/minify-seo-assets.mjs
- scripts/replace-unminified-refs.mjs
- scripts/resource-paths-audit.mjs
- scripts/seo-ci-check.mjs
- scripts/seo-health-check.mjs
- scripts/seo-production-guard.mjs
- scripts/seo-schema-audit.mjs
- scripts/sync-docs-howto-schema.mjs
- scripts/sync-solution-faq-schema.mjs
- scripts/sync-docs-howto-schema.test.mjs
- scripts/sync-solution-faq-schema.test.mjs
- scripts/trigger-indexnow.mjs
- scripts/trigger-indexnow.test.mjs
- scripts/verify-all.mjs
- scripts/verify-astro-routes.mjs
- scripts/verify-astro-routes.test.mjs

## Standalone Scripts (Review for archival)
Scripts NOT referenced in package.json. These are migration/audit/test scripts:
- scripts/_check-kernel.mjs
- scripts/add-cross-links.mjs
- scripts/add-hub-backlinks.mjs
- scripts/astro-error-pages.test.mjs
- scripts/check-render-readiness.mjs
- scripts/compare-blog-posts.mjs
- scripts/extract-blog-articles.mjs
- scripts/extract-one-legacy-page.mjs
- scripts/fix-blog-content-artifacts.mjs
- scripts/fix-docs-schema.py
- scripts/fix-iconify-json.mjs
- scripts/generate-ai-governance-blog-series.mjs
- scripts/generate-inventory.py
- scripts/high-confidence-sitemap-config.mjs
- scripts/home-kernel-astro-parity.test.mjs
- scripts/indexing-recovery-audits.test.mjs
- scripts/indexing-recovery-utils.mjs
- scripts/internal-links-common.mjs
- scripts/legal-astro-migration.test.mjs
- scripts/migrate-blog-html-to-md.mjs
- scripts/migrate-docs-html-to-md.mjs
- scripts/migrate-partial-posts.mjs
- scripts/normalize-legacy-redirects.mjs
- scripts/orphan-pages-audit.mjs
- scripts/replace-iconify-with-svg.mjs
- scripts/replace-one-content-body.mjs
- scripts/seo-extract.py
- scripts/seo-extract.sh
- scripts/seo-scan-scope.test.mjs
- scripts/seo-url-map.mjs
- scripts/sitemap-audit-utils.mjs
- scripts/software-application-schema.test.mjs
- scripts/temp_audit.js
- scripts/test_chat_function.js
- scripts/update-section-og-meta.mjs
- scripts/update-section-og-meta.test.mjs
- scripts/migration-audit/ (directory)
- scripts/seo-data.json
- scripts/performance-budget.config.json
- scripts/critical-css.json
- scripts/.scripts-manifest.json
- scripts/README.md

## Recommended Action
1. Keep all scripts referenced in package.json
2. Migration scripts (migrate-*) → move to _archive/scripts/
3. Standalone audit scripts can stay if still useful
4. Remove temp_audit.js and test_chat_function.js (dev artifacts)
5. Consider running npm run build to verify

## Stats
- Total scripts: 77
- In package.json: ~36 (including .test.mjs counterparts)
- Standalone: ~41
- Archive candidates: ~10-15
