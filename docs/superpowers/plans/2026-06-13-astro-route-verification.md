# Astro Route Verification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and run a repeatable pre-deployment audit for all 105 current sitemap routes, repair Astro migration gaps, and generate `SEO-MIGRATION-CHECK.md`.

**Architecture:** A Node test defines the verifier contract before implementation. The verifier reads `public/sitemap.xml`, invokes the existing Astro build, maps clean trailing-slash routes to `dist/**/index.html`, audits rendered HTML and shared CSS, prints `FOUND`, `MISSING`, and `EXTRA`, and writes one Markdown row per sitemap route plus extra generated routes.

**Tech Stack:** Node.js 22, `node:test`, Cheerio, Astro 6, filesystem APIs, child processes.

---

### Task 1: Define the verifier contract

**Files:**
- Create: `scripts/verify-astro-routes.test.mjs`
- Create: `scripts/verify-astro-routes.mjs`

- [ ] **Step 1: Write failing tests**

Test sitemap parsing, route-to-file mapping, dist route discovery, page SEO auditing, legal-only hreflang validation, CSS overflow-risk detection, Markdown report generation, and non-zero exit behavior for missing routes.

- [ ] **Step 2: Verify RED**

Run: `node --test scripts/verify-astro-routes.test.mjs`

Expected: FAIL because `scripts/verify-astro-routes.mjs` does not exist.

- [ ] **Step 3: Implement the reusable audit functions**

Export pure functions for sitemap parsing, route mapping, route discovery, page auditing, CSS auditing, and report rendering. Keep CLI execution behind a direct-entry guard so tests do not trigger a full build.

- [ ] **Step 4: Verify GREEN**

Run: `node --test scripts/verify-astro-routes.test.mjs`

Expected: all verifier unit tests pass.

### Task 2: Run the full route and rendered-output audit

**Files:**
- Modify only files identified by the verifier under `src/` or `public/`
- Preserve all legacy HTML
- Do not modify: `render.yaml`

- [ ] **Step 1: Run the full verifier**

Run: `node scripts/verify-astro-routes.mjs`

Expected: Astro build runs, 105 sitemap routes are checked, and concrete route/SEO/mobile/content failures are printed.

- [ ] **Step 2: Add regression tests for each discovered gap**

Extend `scripts/verify-astro-routes.test.mjs` with the smallest fixture or rendered-output assertion that reproduces every gap before changing production files.

- [ ] **Step 3: Repair only verified gaps**

Use existing layouts, route data, and CSS patterns. Keep canonical URLs on `https://brightai.site`, navigation links extensionless and trailing-slash normalized, public pages indexable, Arabic RTL, English LTR, GA `G-8LLESL207Q`, WhatsApp `https://wa.me/966538229013`, and booking CTAs on `/contact/`.

- [ ] **Step 4: Re-run the full verifier**

Run: `node scripts/verify-astro-routes.mjs`

Expected: zero missing sitemap routes and all required gates pass.

### Task 3: Produce and validate the migration report

**Files:**
- Create: `SEO-MIGRATION-CHECK.md`

- [ ] **Step 1: Generate the report from audit results**

Write columns `Page | Status | SEO | Mobile | Schema | Fix` for every sitemap route and every extra generated HTML route.

- [ ] **Step 2: Run repository link checks**

Run: `npm run internal-links:audit`

Expected: no safely detectable broken internal routes introduced by this work.

- [ ] **Step 3: Run final verification**

Run:

```bash
node --test scripts/verify-astro-routes.test.mjs
node scripts/verify-astro-routes.mjs
git diff --check
```

Expected: tests pass, verifier exits 0, the report contains all current routes, and the diff has no whitespace errors.
