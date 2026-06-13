# Legal Astro Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build 11 legal Astro pages with verbatim legacy content, five reciprocal Arabic-English pairs, valid legal schema, and no orphan language links.

**Architecture:** Keep legal pair knowledge in `src/data/i18n-pairs.ts`, pass explicit language counterpart data through the layouts to the footer, and implement each route as a static Astro page. Use one acceptance test to compare the migrated legal document text with its legacy source and validate SEO contracts.

**Tech Stack:** Astro 6, TypeScript, Node test runner, Cheerio.

---

### Task 1: Acceptance Contract

**Files:**
- Create: `scripts/legal-astro-migration.test.mjs`

- [ ] Write a Node test that declares all 11 routes and five pairs.
- [ ] Assert each requested Astro source is initially missing so the test fails for the intended reason.
- [ ] Add checks for one H1, correct layout, self canonical, locale, reciprocal hreflang, x-default, JSON-LD `WebPage` and `LegalDocument`, and normalized legal-document text equality with legacy HTML.
- [ ] Run `node --test scripts/legal-astro-migration.test.mjs` and confirm failure because the Astro routes and pair map do not exist.

### Task 2: Pair Data and Explicit Switch

**Files:**
- Create: `src/data/i18n-pairs.ts`
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/layouts/ArabicLayout.astro`
- Modify: `src/layouts/EnglishLayout.astro`
- Modify: `src/components/Footer.astro`
- Modify: `src/components/SEOHead.astro`

- [ ] Define exactly five immutable Arabic-English pairs and helpers for counterpart lookup and alternate generation.
- [ ] Add an optional `languageCounterpart` prop through both layouts and `BaseLayout`.
- [ ] Render the footer language switch only when `languageCounterpart` exists.
- [ ] Ensure `SEOHead` does not append an extra x-default and relies on the complete alternate list supplied by each page.
- [ ] Run the acceptance test and confirm failures now concern missing pages only.

### Task 3: Legal Astro Pages

**Files:**
- Create: the 11 requested `src/pages/**/index.astro` files.
- Create: `src/styles/legal-pages.css`

- [ ] Extract each legacy page's legal content region without paraphrasing.
- [ ] Build each page with its language layout, metadata, canonical URL, pair-derived alternates, optional counterpart, and `WebPage` plus `LegalDocument` graph.
- [ ] Preserve original legal disclaimers where present.
- [ ] Keep all internal links trailing-slash and booking CTAs on `/contact/`.
- [ ] Run the acceptance test until all source and content checks pass.

### Task 4: Report and Build

**Files:**
- Create: `LEGAL-EN-MIGRATION-REPORT.md`

- [ ] Document routes, pair mapping, unpaired route behavior, content extraction, schema, and verification evidence.
- [ ] Run `node --test scripts/legal-astro-migration.test.mjs`.
- [ ] Run `npm run build`.
- [ ] Start `npm run preview`.
- [ ] Request all 11 routes and verify HTTP 200.
- [ ] Inspect rendered HTML for reciprocal hreflang, no orphan targets, locale, direction, canonical, GA, and both schema types.
- [ ] Stop the preview process and record exact results in the report.
