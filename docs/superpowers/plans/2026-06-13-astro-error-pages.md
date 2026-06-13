# Astro Error Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add branded Astro 404 and offline pages, a static 500 page, and the approved permanent report redirect.

**Architecture:** Keep error handling static and Astro-native. Shared Arabic presentation and analytics come from `ArabicLayout`; the service worker continues using `/offline/`; the legacy server error document is copied into Astro's public directory.

**Tech Stack:** Astro 6, TypeScript configuration, Node test runner, static HTML, service worker.

---

### Task 1: Add the regression test

**Files:**
- Create: `scripts/astro-error-pages.test.mjs`

- [ ] **Step 1: Write source assertions**

Assert the two Astro routes use `ArabicLayout`, contain the required Arabic
content and clean links, `public/sw.js` precaches `/offline/`, `astro.config.ts`
contains only the approved redirect, and `public/500.html` exists.

- [ ] **Step 2: Run the test and verify RED**

Run: `node --test scripts/astro-error-pages.test.mjs`

Expected: FAIL because the new pages, redirect, and public 500 document do not
exist yet.

### Task 2: Implement the pages and redirect

**Files:**
- Create: `src/pages/404.astro`
- Create: `src/pages/offline/index.astro`
- Modify: `astro.config.ts`
- Create: `public/500.html`

- [ ] **Step 1: Build the Arabic 404 page**

Use `ArabicLayout`; add links to `/`, `/solutions/`, `/kernel/`, `/blog/`, and
`/docs/`; include a search suggestion and a booking CTA to `/contact/`.

- [ ] **Step 2: Build the Arabic offline page**

Use `ArabicLayout`; explain cached-content availability and add a reconnect
button that calls `window.location.reload()`.

- [ ] **Step 3: Configure the redirect**

Add Astro redirect configuration for `/report/` to `/trust/` with status `301`.
Do not configure `/services/` or `.html` redirects.

- [ ] **Step 4: Preserve the legacy 500 page**

Copy the existing root `500.html` byte-for-byte to `public/500.html`; retain the
root file.

- [ ] **Step 5: Run the test and verify GREEN**

Run: `node --test scripts/astro-error-pages.test.mjs`

Expected: PASS.

### Task 3: Build and preview verification

**Files:**
- Create: `ERROR-PAGES-REPORT.md`

- [ ] **Step 1: Build**

Run: `npm run build`

Expected: exit code 0 and generated `dist/404.html`, `dist/offline/index.html`,
and `dist/500.html`.

- [ ] **Step 2: Preview**

Run: `npm run preview -- --host 127.0.0.1`

- [ ] **Step 3: Verify HTTP behavior**

Check an unknown route returns the branded 404 document, `/offline/` returns
`200`, and `/report/` returns `301` with `Location: /trust/`.

- [ ] **Step 4: Write the report**

Record changed files, source-of-truth decisions, exact verification commands,
HTTP results, and the final gate checklist in `ERROR-PAGES-REPORT.md`.

