# BrightAI Visual Reskin Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Unify the Astro visual layer so Arabic RTL pages share the same premium dark BrightAI identity without changing content, links, or section order.

**Architecture:** Keep all rendered page structure intact and centralize visual behavior through `src/styles/tokens.css`, `global.css`, `components.css`, `design-system.css`, `home.css`, `inner-pages.css`, and `legal-pages.css`. `BaseLayout.astro` remains the single global style entrypoint; page-local CSS imports stay only where they apply page-family classes.

**Tech Stack:** Astro 6 static, Tailwind utility classes already present in markup, plain CSS custom properties, RTL logical properties.

---

### Task 1: Consolidate Design Tokens

**Files:**
- Modify: `src/styles/tokens.css`
- Modify: `src/styles/global.css`

- [ ] **Step 1: Replace scattered color intent with central tokens**

Update `src/styles/tokens.css` so the active palette is dark base, elevated dark, cyan/teal brand, neutral text, and one operational accent. Keep legacy aliases only when existing classes consume them.

- [ ] **Step 2: Normalize global body, headings, links, focus, and background**

Update `src/styles/global.css` to use the token names, keep `dir="rtl"`/`lang="ar"` behavior, reduce duplicate production classes, and add global lower-section performance helpers such as `content-visibility` for section-like blocks.

- [ ] **Step 3: Verify no content selectors changed**

Run: `rg -n "content:|innerText|textContent|href=" src/styles src/layouts/BaseLayout.astro`

Expected: CSS changes do not introduce text/link mutations.

### Task 2: Unify Components And Page Families

**Files:**
- Modify: `src/styles/components.css`
- Modify: `src/styles/design-system.css`
- Modify: `src/styles/home.css`
- Modify: `src/styles/inner-pages.css`
- Modify: `src/styles/legal-pages.css`
- Modify: `src/styles/mobile.css`

- [ ] **Step 1: Make one glass card and one button system**

Keep existing class names such as `.glass`, `.glass-card`, `.inner-card`, `.glow-btn`, `.wa-btn`, `.btn--primary`, and `.btn--ghost`, but make them draw from the same tokens and radius scale.

- [ ] **Step 2: Keep homepage classes but remove conflicting duplicates**

Let `home.css` own homepage-specific composition only. Shared classes such as `.gradient-text`, `.glass`, `.glow-btn`, `.wa-btn`, `.chip`, `.feature-card`, `.bg-grid`, and footer styling should resolve consistently through `design-system.css`.

- [ ] **Step 3: Re-skin inner and legal pages**

Keep all `.inner-*` and legal class contracts intact while aligning colors, spacing, borders, hover, focus, and RTL logical properties to the shared system.

- [ ] **Step 4: Check physical left/right usage**

Run: `rg -n "margin-left|margin-right|padding-left|padding-right|left:|right:|border-left|border-right" src/styles src/components`

Expected: remaining physical directions are decorative or SVG/canvas-specific, not layout-critical RTL spacing.

### Task 3: BaseLayout Style Entry

**Files:**
- Modify: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Keep SEO, analytics, header, footer, and slots unchanged**

Do not edit text, links, SEO props, JSON-LD, or component ordering.

- [ ] **Step 2: Keep one global style chain**

Ensure `BaseLayout.astro` imports global CSS once in stable order: `global.css`, `layout.css`, `components.css`, `animations.css`, `mobile.css`, `design-system.css`. Keep page-family imports for `home.css`, `inner-pages.css`, and `legal-pages.css`.

- [ ] **Step 3: Align theme meta**

Set the theme color to the same dark background token value used by the page.

### Task 4: Verification

**Files:**
- Read: generated `dist/`

- [ ] **Step 1: Build**

Run: `npm run build`

Expected: Astro build completes and schema sync scripts complete.

- [ ] **Step 2: Static route/content sanity**

Run: `node scripts/verify-astro-routes.mjs`

Expected: no missing sitemap routes.

- [ ] **Step 3: CSS surface check**

Run: `rg -n "#7c5cff|#ff5ca7|a78bfa|purple|pink|violet" src/styles`

Expected: purple/pink usage is removed or limited to explicitly legacy-compatible decorative gradient remnants.

- [ ] **Step 4: Manual note**

If Playwright remains unavailable, report that screenshot verification was blocked by CLI install/runtime and provide build plus CSS/route evidence instead of claiming visual screenshot completion.
