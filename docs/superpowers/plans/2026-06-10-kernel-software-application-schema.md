# Kernel Software Application Schema Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add valid SoftwareApplication/WebApplication JSON-LD to all indexed Kernel pages and the services product page without removing existing schema.

**Architecture:** Extend each page's existing JSON-LD `@graph` with the same product entity and connect its `WebPage` through `mainEntity`. Add a repository test that parses every target page and validates both the new product entity and the existing core graph nodes.

**Tech Stack:** Static HTML, JSON-LD, Node.js built-in test runner.

---

### Task 1: Add the schema regression test

**Files:**
- Create: `scripts/software-application-schema.test.mjs`

- [ ] **Step 1: Write a test that scans the 12 Kernel pages and `services/index.html`.**
- [ ] **Step 2: Require valid JSON-LD, the shared product `@id`, both application types, category, operating system, Arabic description, provider, SAR offer, and page linkage.**
- [ ] **Step 3: Require existing Organization, WebSite, WebPage, and BreadcrumbList nodes to remain.**
- [ ] **Step 4: Run `node --test scripts/software-application-schema.test.mjs` and confirm it fails because the product entity is missing.**

### Task 2: Add the shared application entity

**Files:**
- Modify: `kernel/index.html`
- Modify: `kernel/chat.html`
- Modify: `kernel/stats.html`
- Modify: `kernel/approvals.html`
- Modify: `kernel/audit.html`
- Modify: `kernel/evidence.html`
- Modify: `kernel/reports.html`
- Modify: `kernel/scenarios.html`
- Modify: `kernel/compliance.html`
- Modify: `kernel/policies.html`
- Modify: `kernel/connectors.html`
- Modify: `kernel/offline.html`
- Modify: `services/index.html`

- [ ] **Step 1: Add `mainEntity` to each existing WebPage node.**
- [ ] **Step 2: Add the shared SoftwareApplication/WebApplication node to each existing managed graph.**
- [ ] **Step 3: Keep every pre-existing graph node and standalone JSON-LD block unchanged.**
- [ ] **Step 4: Run the schema regression test and confirm it passes.**

### Task 3: Verify repository SEO gates

**Files:**
- Test: `scripts/software-application-schema.test.mjs`

- [ ] **Step 1: Run `npm run seo:schema`.**
- [ ] **Step 2: Run `npm run seo:gate`.**
- [ ] **Step 3: Inspect the final diff to confirm only the planned schema, test, and documentation changes were introduced.**

