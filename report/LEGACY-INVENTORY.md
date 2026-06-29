# BRIGHTAI — Legacy Code Inventory & Audit Report

**Generated:** 2026-06-28
**Scope:** Full repository audit (Astro frontend + legacy frontend + scripts + archives)
**Companion file:** `LEGACY-INVENTORY.csv` (207 entries, machine-readable)

---

## 1. Executive Summary

This audit catalogs **207 files** across the BRIGHTAI repository and classifies each by category, usage, and risk. The goal is to identify dead code, redundant assets, and legacy artifacts that can be safely removed or quarantined without breaking the production build.

### Headline Findings

| Metric | Value |
|---|---|
| Total files inventoried | **207** |
| Active production files | **~70** (components, layouts, pages, data, styles) |
| Dead code (zero imports) | **6 components** (~643 lines) |
| Internal-only components (used by layouts/other components) | **14** |
| Archived legacy files | **22** (no `src/` references) |
| Legacy frontend (Express app, not part of Astro build) | **7** |
| Build/audit/migration scripts | **82** |
| High-risk items | **6** (all dead components) |
| Medium-risk items | **21** (internal components + legacy frontend) |
| Low-risk items | **179** (active code, archives, scripts) |

### Top Recommendation

**Delete 6 dead components** (~643 lines, ~30 KB) and **archive the legacy `frontend/` Express app** to a separate branch or external repo. These actions carry zero risk to the production Astro build and immediately reduce maintenance surface area.

---

## 2. Inventory by Category

| Category | Count | Risk Profile | Description |
|---|---|---|---|
| **Active** | 70 | Low | Components, layouts, pages, data modules, styles actively used in production |
| **Internal** | 14 | Medium | Components used only by layouts or other components (not directly by pages) |
| **Dead Code** | 6 | **High** | Components with zero imports anywhere in the project |
| **Archive** | 22 | Low | Files in `_archive/` from pre-Astro migration; no `src/` references |
| **Legacy** | 7 | Medium | Express/Node frontend (`frontend/`) not part of Astro build |
| **Tool** | 82 | Low | Build, audit, migration, SEO scripts in `scripts/` |
| **Asset** | 6 | Low | Duplicated fonts/images in `public/frontend/assets/` |

---

## 3. Dead Code Findings (HIGH RISK)

These **6 components** have **zero imports** anywhere in the project. They are safe to delete.

| File | Lines | Notes |
|---|---|---|
| `src/components/KernelStatCard.astro` | 54 | Kernel dashboard stat card; never imported |
| `src/components/KernelTable.astro` | 77 | Kernel data table; never imported |
| `src/components/KernelLoadingState.astro` | 53 | Kernel loading skeleton; never imported |
| `src/components/SparklesCore.tsx` | 180 | React particle effect; only imported by `SparklesHero.astro` (also dead) |
| `src/components/SparklesHero.astro` | 257 | Particle-effect hero; no page imports it |
| `src/components/SectionReveal.astro` | 22 | Scroll-reveal wrapper; never imported |

**Total dead code:** ~643 lines, ~30 KB

### Why These Are Safe to Remove

- No `import` statement references them in any `.astro`, `.tsx`, `.ts`, or `.js` file under `src/`
- They are not referenced in `astro.config.mjs`, `tailwind.config.ts`, or any config file
- They are not dynamically loaded (no string-based imports)
- Deletion will not affect the production build or any rendered page

### Recommended Action

```bash
git rm src/components/KernelStatCard.astro \
       src/components/KernelTable.astro \
       src/components/KernelLoadingState.astro \
       src/components/SparklesCore.tsx \
       src/components/SparklesHero.astro \
       src/components/SectionReveal.astro
```

---

## 4. Internal-Only Components (MEDIUM RISK)

These **14 components** are not imported directly by pages but are used by layouts or other components. They are **active production code** and must be preserved.

| Component | Used By | Purpose |
|---|---|---|
| `Header.astro` | `BaseLayout.astro` | Site-wide header (507 lines) |
| `Footer.astro` | `BaseLayout.astro`, `KernelLayout.astro` | Site-wide footer (292 lines) |
| `MobileNav.astro` | `BaseLayout.astro` | Mobile navigation drawer (393 lines) |
| `SEOHead.astro` | `BaseLayout.astro` | Meta tags, OG, JSON-LD (98 lines) |
| `CookieConsent.astro` | `BaseLayout.astro` | GDPR/PDPL cookie banner (93 lines) |
| `WhatsAppCTA.astro` | `BaseLayout.astro` | Floating WhatsApp button (86 lines) |
| `DottedBackground.astro` | `BaseLayout.astro` | Animated background (200 lines) |
| `Breadcrumbs.astro` | `BlogLayout`, `DocsLayout`, 15 pages | Breadcrumb nav (63 lines) |
| `TableOfContents.astro` | `DocsLayout.astro` | Docs sidebar TOC (26 lines) |
| `DocsRelatedLinks.astro` | `DocsLayout.astro` | Docs cross-links (28 lines) |
| `RelatedPosts.astro` | `BlogLayout.astro` | Blog post suggestions (91 lines) |
| `KernelBadge.astro` | `ActivityStream`, `ComplianceRadar`, `EvidenceFileMockup`, `KernelPageHeader` | Status badge (internal) |
| `KernelMetric.astro` | `LiveDashboardMockup` | Metric display (internal) |
| `DottedSurface.tsx` | `SplitHero.astro` | React island for hero surface |
| `HeroVisual.tsx` | `SplitHero.astro` | React island for hero visual |

**Risk note:** Medium risk only because they are not directly visible in page-level grep. They are **critical** to the layout chain and must not be removed.

---

## 5. Legacy Frontend (`frontend/`) — MEDIUM RISK

The `frontend/` directory contains a **legacy Express/Node.js application** that predates the Astro migration. It is **not part of the current Astro build**.

| File | Notes |
|---|---|
| `frontend/server.js` | Express server entry point |
| `frontend/demoGeminiApp.js` | Gemini AI demo app |
| `frontend/package.json` | Separate Node package manifest |
| `frontend/vitest.config.mjs` | Separate test config |
| `frontend/rag-search.functional.test.js` | RAG search test |
| `frontend/static-seo-headers.e2e.test.js` | SEO headers E2E test |
| `frontend/stream-routes.e2e.test.js` | Stream routes E2E test |

### Recommended Action

- **Option A (preferred):** Move to a separate branch `legacy/express-frontend` or external repo
- **Option B:** Keep in repo but add a `frontend/README.md` clearly stating it is **not deployed** and is kept for reference only
- **Do not** delete without confirming no CI/CD pipeline references it

---

## 6. Archived Files (`_archive/`) — LOW RISK

**22 files** in `_archive/` from the pre-Astro migration. No `src/` code references them.

| Subdirectory | Files | Content |
|---|---|---|
| `_archive/docx/` | 5 | Governance docs (AI audit, NCA-ECC, PDPL) |
| `_archive/legacy-public-frontend/css/` | 3 | Legacy CSS bundles |
| `_archive/legacy-public-frontend/html/` | 2 | Legacy 404/error pages |
| `_archive/legacy-public-frontend/js/` | 8 | Legacy JS (analytics, header, vendor) |
| `_archive/legacy-public-frontend/js/vendor/` | 1 | AOS animation library |
| `_archive/scratch/` | 2 | CSS analysis scratch files |

### Recommended Action

- Keep `_archive/` as-is for historical reference
- Add a top-level `_archive/README.md` documenting the archive policy and date
- Consider compressing to `.tar.gz` if repo size becomes a concern

---

## 7. Duplicated Assets — LOW RISK

The directory `public/frontend/assets/` contains **duplicates** of fonts and images that already exist in `public/fonts/` and `public/images/`.

| Asset Type | Location | Duplicate Location |
|---|---|---|
| Fonts | `public/fonts/` | `public/frontend/assets/fonts/` |
| Images | `public/images/` | `public/frontend/assets/images/` |

### Recommended Action

- Verify no HTML/CSS references `public/frontend/assets/` paths
- If confirmed unused, delete the entire `public/frontend/assets/` directory
- This will reduce the deployed bundle size

---

## 8. Risk Matrix

| Risk Level | Count | Action |
|---|---|---|
| **High** | 6 | Delete dead components immediately |
| **Medium** | 21 | Review internal components (keep) + quarantine legacy frontend |
| **Low** | 179 | No action required (active code, archives, scripts) |

---

## 9. Dependency Map (Core Layout Chain)

```
BaseLayout.astro (used by 34 pages)
├── SEOHead.astro
├── Header.astro
├── MobileNav.astro
├── Footer.astro (also used by KernelLayout)
├── WhatsAppCTA.astro
├── DottedBackground.astro
├── CookieConsent.astro
└── 7 CSS stylesheets (tokens, base, components, pages, utilities, animations, kernel)

ArabicLayout.astro → BaseLayout.astro
EnglishLayout.astro → BaseLayout.astro
BlogLayout.astro → ArabicLayout.astro + Breadcrumbs + RelatedPosts
DocsLayout.astro → ArabicLayout.astro + TableOfContents + DocsRelatedLinks + Breadcrumbs
KernelLayout.astro → BaseLayout.astro + Footer
```

---

## 10. Remediation Plan

### Phase 1: Immediate (zero risk, ~5 minutes)

1. Delete 6 dead components:
   - `KernelStatCard.astro`
   - `KernelTable.astro`
   - `KernelLoadingState.astro`
   - `SparklesCore.tsx`
   - `SparklesHero.astro`
   - `SectionReveal.astro`

2. Run `npm run build` to verify no breakage

### Phase 2: Short-term (low risk, ~30 minutes)

3. Verify `public/frontend/assets/` is unused, then delete duplicates
4. Add `_archive/README.md` documenting archive policy
5. Add `frontend/README.md` marking it as legacy/non-deployed

### Phase 3: Medium-term (requires coordination)

6. Move `frontend/` to a separate branch or external repo
7. Audit the 82 scripts in `scripts/` and consolidate duplicates
8. Consider compressing `_archive/` to reduce repo size

---

## 11. Verification Checklist

After applying Phase 1 changes, verify:

- [ ] `npm run build` completes without errors
- [ ] All 35 pages render correctly
- [ ] No console errors in browser
- [ ] No 404s for deleted component references
- [ ] Lighthouse scores unchanged
- [ ] SEO meta tags still present (SEOHead still works)
- [ ] Mobile nav still works (MobileNav still works)
- [ ] Cookie consent banner still appears
- [ ] WhatsApp CTA still functional

---

## 12. Files Referenced

- **CSV inventory:** `LEGACY-INVENTORY.csv` (207 rows)
- **This report:** `LEGACY-INVENTORY.md`
- **Astro config:** `astro.config.mjs`
- **Package manifest:** `package.json`

---

*Report generated as part of the BRIGHTAI legacy code audit initiative.*
