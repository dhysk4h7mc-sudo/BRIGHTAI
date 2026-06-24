# Frontend Static Assets Used By Astro

> Updated: 2026-06-24

`frontend/` يبقى خدمة منفصلة لـ `brightai-api` ولا يدخل ضمن حذف legacy HTML. لكن بعض صفحات Astro تشير إلى أصول ثابتة بمسار `/frontend/...`، لذلك يجب أن تكون النسخ العامة موجودة تحت `public/frontend/` حتى ينسخها `astro build` إلى `dist/frontend/`.

## Current Asset Contract

| Source references | Public asset required |
|---|---|
| `src/content/blog/*.md` author images | `public/frontend/assets/images/authors/nasser-alabdullah.svg` |
| `src/layouts/BaseLayout.astro` font preload and `@font-face` | `public/frontend/assets/fonts/TheYearofTheCamel-Medium.woff2` |
| `src/layouts/BaseLayout.astro` font fallback | `public/frontend/assets/fonts/TheYearofTheCamel-Medium.otf` |
| `src/data/legal-content-inline.ts` legacy script reference | `public/frontend/js/vendor/aos.js` |

## Rule

Do not delete `frontend/` as part of Astro cleanup. If an Astro page references `/frontend/...`, keep a matching static copy in `public/frontend/...` or update the source reference in the same change.
