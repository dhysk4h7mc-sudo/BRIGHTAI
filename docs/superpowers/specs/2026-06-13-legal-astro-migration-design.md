# Legal Astro Migration Design

## Scope

Migrate the six Arabic and five English legal routes listed in the task to Astro without deleting or modifying their legacy HTML sources. Do not modify `render.yaml`.

## Content Fidelity

The visible legal document content, including headings, paragraphs, lists, notices, dates, contact details, and disclaimers, must be copied verbatim from each route's legacy `index.html`. Astro layouts, semantic wrappers, metadata, JSON-LD, and language-switch controls may use the current component system.

## Internationalization

`src/data/i18n-pairs.ts` is the only source for the five confirmed legal pairs:

- `/privacy-policy/` and `/en/privacy-policy/`
- `/cookie-policy/` and `/en/cookie-policy/`
- `/terms/` and `/en/terms/`
- `/pdpl-statement/` and `/en/pdpl-statement/`
- `/data-processing-agreement/` and `/en/data-processing-agreement/`

`/privacy-cookies/` has no English counterpart. It receives only `ar-SA` and `x-default` alternates and does not display a language switch.

## Page Structure

Arabic routes use `ArabicLayout`; English routes use `EnglishLayout`. Each page has one H1, a self canonical, a combined `WebPage` and `LegalDocument` JSON-LD graph, correct locale metadata, and the existing site-wide Google tag.

The language switch is explicit and optional. Layout and footer props receive the counterpart URL from the page; they never derive a URL by adding or removing `/en/`.

## Verification

A Node acceptance test validates route source files, pair reciprocity, no orphan alternates, one H1, layout selection, canonical URLs, JSON-LD types, and verbatim legal text against legacy HTML. Final verification runs the acceptance test, `npm run build`, `npm run preview`, HTTP checks for all 11 routes, and rendered hreflang/schema checks.

