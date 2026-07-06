# axe-core Audit — REPORTS-18 (BrightAI A11y)

**Generated**: 2026-07-06T17:53:04.001Z
**Rules**: wcag2a, wcag2aa, wcag21a, wcag21aa, best-practice
**Pages audited**: 8

## Summary Table

| Page | URL | Violations | Incomplete | Console Errors |
|---|---|---|---|---|
| home | http://localhost:4321/ | 0 | 3 | 0 |
| about | http://localhost:4321/about/ | 0 | 3 | 0 |
| contact | http://localhost:4321/contact/ | 0 | 4 | 0 |
| pricing | http://localhost:4321/pricing/ | 1 | 3 | 0 |
| solutions | http://localhost:4321/solutions/ | 0 | 3 | 0 |
| kernel-index | http://localhost:4321/kernel/ | 0 | 3 | 0 |
| kernel-chat | http://localhost:4321/kernel/chat/ | 0 | 3 | 0 |
| privacy-policy | http://localhost:4321/privacy-policy/ | 0 | 3 | 0 |

**TOTAL**: 1 violations, 25 incomplete

## Violations by Page

### pricing (http://localhost:4321/pricing/)

- **aria-allowed-role** [minor] (6 nodes)
  ARIA role should be appropriate for the element
  https://dequeuniversity.com/rules/axe/4.12/aria-allowed-role?application=axeAPI
  Targets: `["details[open=\"\"]"]`, `["details:nth-child(2)"]`, `["details:nth-child(3)"]`

## Incomplete (needs manual review)

### home

- **aria-prohibited-attr** [serious] (2 nodes) — Elements must only use permitted ARIA attributes
- **aria-valid-attr-value** [critical] (3 nodes) — ARIA attributes must conform to valid values
- **color-contrast** [serious] (86 nodes) — Elements must meet minimum color contrast ratio thresholds

### about

- **aria-valid-attr-value** [critical] (3 nodes) — ARIA attributes must conform to valid values
- **color-contrast** [serious] (24 nodes) — Elements must meet minimum color contrast ratio thresholds
- **link-in-text-block** [serious] (1 node) — Links must be distinguishable without relying on color

### contact

- **aria-valid-attr-value** [critical] (3 nodes) — ARIA attributes must conform to valid values
- **color-contrast** [serious] (12 nodes) — Elements must meet minimum color contrast ratio thresholds
- **frame-tested** [critical] (1 node) — Frames should be tested with axe-core
- **link-in-text-block** [serious] (1 node) — Links must be distinguishable without relying on color

### pricing

- **aria-valid-attr-value** [critical] (3 nodes) — ARIA attributes must conform to valid values
- **color-contrast** [serious] (27 nodes) — Elements must meet minimum color contrast ratio thresholds
- **link-in-text-block** [serious] (1 node) — Links must be distinguishable without relying on color

### solutions

- **aria-valid-attr-value** [critical] (3 nodes) — ARIA attributes must conform to valid values
- **color-contrast** [serious] (23 nodes) — Elements must meet minimum color contrast ratio thresholds
- **link-in-text-block** [serious] (1 node) — Links must be distinguishable without relying on color

### kernel-index

- **aria-prohibited-attr** [serious] (5 nodes) — Elements must only use permitted ARIA attributes
- **aria-valid-attr-value** [critical] (4 nodes) — ARIA attributes must conform to valid values
- **color-contrast** [serious] (59 nodes) — Elements must meet minimum color contrast ratio thresholds

### kernel-chat

- **aria-prohibited-attr** [serious] (1 node) — Elements must only use permitted ARIA attributes
- **aria-valid-attr-value** [critical] (3 nodes) — ARIA attributes must conform to valid values
- **color-contrast** [serious] (54 nodes) — Elements must meet minimum color contrast ratio thresholds

### privacy-policy

- **aria-prohibited-attr** [serious] (1 node) — Elements must only use permitted ARIA attributes
- **aria-valid-attr-value** [critical] (3 nodes) — ARIA attributes must conform to valid values
- **color-contrast** [serious] (17 nodes) — Elements must meet minimum color contrast ratio thresholds

