# CSS Duplication Audit

> Generated: 2026-06-25 as part of Migration Closure Step 3

## Summary

Two `design-system.css` files exist with **different purposes**. Both are retained.

## File Comparison

| Aspect | `src/styles/design-system.css` | `frontend/css/design-system.css` |
|---|---|---|
| Lines | 193 | 477 |
| Role | Production utility classes (`.gradient-text`, `.glass`, `.glow-btn`) | Master CSS variable library (`:root` tokens, brand colors, neutral scale) |
| Loaded by | `BaseLayout.astro` via `@import` (global) | Backend (`frontend/`) asset pipeline — NOT loaded by Astro pages |
| Overlap | None — class-based | None — variable-based |

## Decision

**Both files are retained.** They serve different consumers:
- `src/styles/design-system.css` → Astro frontend pages (loaded globally via `BaseLayout.astro`)
- `frontend/css/design-system.css` → Node.js backend (`frontend/`) which is out-of-scope per migration constraints

No merge or deletion is safe without breaking the backend asset pipeline.
