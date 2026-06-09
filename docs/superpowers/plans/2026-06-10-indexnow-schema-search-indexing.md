# IndexNow and Schema Search Indexing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve BRIGHTAI indexing through a testable IndexNow workflow and conservative, content-backed structured data.

**Architecture:** Refactor IndexNow into importable pure helpers plus a small CLI. Add focused schema synchronization and audit scripts that read visible HTML content, update only managed JSON-LD nodes, and fail verification when FAQ, breadcrumbs, HowTo, or Service markup drifts from page content.

**Tech Stack:** Node.js 22, native `node:test`, Cheerio, static HTML, JSON-LD, npm scripts.

---

### Task 1: Make IndexNow deterministic and testable

**Files:**
- Modify: `scripts/trigger-indexnow.mjs`
- Create: `scripts/trigger-indexnow.test.mjs`
- Modify: `package.json`

- [ ] Write tests that require reading the requested root key, validating same-host HTTPS URLs, loading sitemap URLs, deduplicating URLs, and building the IndexNow payload.
- [ ] Run `node --test scripts/trigger-indexnow.test.mjs` and confirm it fails because the current script exports no helpers and embeds the wrong key.
- [ ] Refactor the script to export pure helpers, support `--dry-run`, accept explicit URLs, fall back to `sitemap.xml`, and treat HTTP 200/202 as accepted submissions.
- [ ] Add `indexnow:check` and keep live submission separate from asset building.
- [ ] Run the focused test and dry-run command.

### Task 2: Synchronize solution FAQ schema from visible FAQs

**Files:**
- Create: `scripts/sync-solution-faq-schema.mjs`
- Create: `scripts/sync-solution-faq-schema.test.mjs`
- Modify: `solutions/*/index.html` only where managed FAQ JSON-LD differs
- Modify: `package.json`

- [ ] Write fixture tests proving the synchronizer extracts only `<details>` questions and answers from the visible FAQ section and replaces only the managed `FAQPage` node.
- [ ] Run the test and confirm it fails because the synchronizer does not exist.
- [ ] Implement extraction, JSON-LD graph replacement, deterministic formatting, and `--check`.
- [ ] Run the synchronizer across `solutions/*/index.html`.
- [ ] Run `--check` and the focused test.

### Task 3: Add HowTo only to procedural documentation

**Files:**
- Create: `scripts/sync-docs-howto-schema.mjs`
- Create: `scripts/sync-docs-howto-schema.test.mjs`
- Modify: applicable `docs/*/index.html`
- Modify: `package.json`

- [ ] Write fixture tests proving an ordered list under a procedural heading becomes `HowToStep` entries while a non-procedural list is ignored.
- [ ] Run the test and confirm it fails because the synchronizer does not exist.
- [ ] Implement conservative heading detection, visible step extraction, replacement of a managed `HowTo` node, and `--check`.
- [ ] Run the synchronizer across documentation pages and preserve valid existing HowTo nodes when they match visible content.
- [ ] Run `--check` and the focused test.

### Task 4: Add a structured-data quality gate

**Files:**
- Create: `scripts/seo-schema-audit.mjs`
- Create: `scripts/seo-schema-audit.test.mjs`
- Modify: `package.json`

- [ ] Write tests for invalid JSON-LD, missing solution breadcrumbs, FAQ/content mismatch, HowTo without visible steps, and missing Service on `services/index.html`.
- [ ] Run the test and confirm it fails because the audit module does not exist.
- [ ] Implement the audit with machine-readable failures and a non-zero exit code.
- [ ] Add `seo:schema` and include it in `seo:all` and `verify:all`.
- [ ] Run the focused tests and `npm run seo:schema`.

### Task 5: Update Lighthouse and deployment wiring

**Files:**
- Modify: `.lighthouserc.json`
- Modify: `render.yaml`
- Modify: `package.json`

- [ ] Replace both `max-potential-fid` entries with `interaction-to-next-paint` using a 200 ms budget.
- [ ] Ensure the root key file remains included in `.render-static`.
- [ ] Run IndexNow only as an explicit post-deploy/manual command, not during asset compilation before public files exist.
- [ ] Validate JSON syntax and confirm no old metric remains.

### Task 6: Full verification

**Files:**
- Verify all changed files.

- [ ] Run all new Node tests.
- [ ] Run `npm run indexnow:check`.
- [ ] Run `npm run seo:schema`.
- [ ] Run `npm run seo:gate`.
- [ ] Run `npm run verify:all`.
- [ ] Run `git diff --check` and inspect the final diff for unrelated changes.
