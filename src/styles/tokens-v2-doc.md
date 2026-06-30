---
file: tokens-v2-doc.md
project: BrightAI — Saudi AI Safety OS
date: 2026-06-30
maintained_by: BrightAI Workspace Agent
audience: Design / Frontend engineers
status: living document
---

# BrightAI Design Tokens — توثيق v3.1 (Sovereign Calm Refinement)

> المرجع الموحّد لكل token مُستخدَم في النظام البصري للموقع.
> **القاعدة**: لا تحذف token موجود. الإضافة فقط — لذا الـ file يحوي "legacy" + "v3.1 additions" جنب-جنب.

---

## كيف تستخدم هذا الـ doc

- كل token مقسوم على **مجموعة** (colors, spacing, radii, shadows, motion).
- الـ identifier (الاسم) = الـ CSS variable (`var(--brand-500)`).
- الـ value (القيمة) = القيمة الفعلية بـ CSS.
- تحت كل token — **مثال استخدام** واقعي من BrightAI.
- **Aliases** خُصّصت بعد كل مجموعة (لو أرادت تستخدم الاسم المختصر).

---

## 1) Color System — الألوان

### Brand scale — Deep Teal (DEC-SovB-001)

| Token | Value | Hex | الاستخدام |
|---|---|---|---|
| `--brand-50`  | `0.9 rem`'s lightest wash | `#e6f3f2` | badges, selected states on dark |
| `--brand-100` | ... | `#c2e1de` | hover backgrounds |
| `--brand-200` | ... | `#87c3bd` | borders on light tinted cards |
| `--brand-300` | ... | `#4ba69c` | secondary CTAs (large) |
| `--brand-400` | ... | `#3ba395` | decorative focus |
| `--brand-500` | ... | `#2a8a7e` | **PRIMARY** — buttons, links |
| `--brand-600` | ... | `#1f6f64` | hover state على primary |
| `--brand-700` | ... | `#19574f` | active state، pressed |
| `--brand-800` | ... | `#14433d` | dark backgrounds مع tint |
| `--brand-900` | ... | `#0a201e` | deepest brand-tinted dark |

**مثال**:
```css
.btn-primary {
  background: var(--brand-500);
  color: var(--text-primary);
}
.btn-primary:hover { background: var(--brand-600); }
.btn-primary:active { background: var(--brand-700); }
```

### Accent scale — Green (success semantic)

10 درجات (50→900)، يُستخدم مع status-success. التوكنز `--status-success = #22c55e` (accent-500).

### Indigo scale — Depth Layer

10 درجات (50→900)، يُستخدم للـ gradients والـ subtle accents. `--indigo-400 = #818cf8` هو الأكثر استخداماً.

### Burnished Copper — Saudi accent (DEC-SovB-001)

```css
--accent-warm:        #c08a5a;          /* sparingly — لمسة سعودية */
--accent-warm-soft:   rgba(192,138,90,0.15);  /* tinted backgrounds */
--accent-warm-glow:   rgba(192,138,90,0.3);   /* subtle glow */
```

### Neutrals scale — Slate (v3.1 NEW)

11 درجة (50→950). الـ palette المعتمدة من slate (Tailwind v3). تُستخدم للـ borders, dividers, placeholders, secondary text.

| Token | Hex | ملاحظة |
|---|---|---|
| `--neutral-50`  | `#f8fafc` | almost white (rare على dark theme) |
| `--neutral-100` | `#f1f5f9` | light dividers |
| `--neutral-200` | `#e2e8f0` | light borders |
| `--neutral-300` | `#cbd5e1` | muted text على light |
| `--neutral-400` | `#94a3b8` | secondary text (مطابق text-secondary) |
| `--neutral-500` | `#64748b` | muted text |
| `--neutral-600` | `#475569` | description text |
| `--neutral-700` | `#334155` | emphasized text على dark |
| `--neutral-800` | `#1e293b` | surface dividers |
| `--neutral-900` | `#0f172a` | deep surfaces |
| `--neutral-950` | `#020617` | pitch dark — screenshots showcase |

**مثال**:
```css
.docs-table-row {
  border-bottom: 1px solid var(--neutral-800);
  color: var(--text-secondary); /* = --neutral-400 */
}
```

### Semantic colors — الـ function-based aliases (KEEP)

| Token | Value | ملاحظة |
|---|---|---|
| `--bg-base`       | `#0a0e1a` | page-wide base (أعمق من surface) |
| `--bg-surface`    | `#0f1525` | cards |
| `--bg-elevated`   | `#151c30` | modals، dropdowns |
| `--bg-overlay`    | `rgba(10,14,26,0.8)` | modal scrim |

### Layered surfaces — v3.1 NEW

| Token | Value | استخدام |
|---|---|---|
| `--surface-1` | `var(--bg-base)` | الصفحة الكاملة |
| `--surface-2` | `var(--bg-surface)` | البطاقات الأساسية |
| `--surface-3` | `var(--bg-elevated)` | البطاقات المرفوعة |
| `--surface-4` | `#1c2540` | hover/active state على البطاقات |

**مثال**:
```css
.interactive-card {
  background: var(--surface-3);
  transition: background var(--duration-fast) var(--ease-out);
}
.interactive-card:hover { background: var(--surface-4); }
```

### Border scale — v3.1 extended

| Token | Value | استخدام |
|---|---|---|
| `--border-faint`  | `rgba(148,163,184,0.06)` | فواصل زخرفية، dividers |
| `--border-subtle` | `rgba(148,163,184,0.1)` (KEEP) | default borders |
| `--border-default`| `rgba(148,163,184,0.2)` | emphasized borders |
| `--border-soft`   | `var(--border-subtle)` (alias, KEEP) | shortcut |
| `--border-strong` | `rgba(148,163,184,0.35)` (KEEP) | selected/active |
| `--border-bold`   | `rgba(148,163,184,0.5)` (NEW) | selected focus |

### Overlays — v3.1 NEW

3 شدّات للـ modal scrim / drawer darken:

| Token | Value | استخدام |
|---|---|---|
| `--overlay-light`  | `rgba(10,14,26,0.4)`  | tooltips، dropdowns |
| `--overlay-medium` | `rgba(10,14,26,0.65)` | drawers، sheets |
| `--overlay-heavy`  | `rgba(10,14,26,0.85)` | modals full-screen |

---

## 2) Typography

### Font families

| Token | Value |
|---|---|
| `--font-sans`    | IBM Plex Sans Arabic + system fallbacks |
| `--font-mono`    | IBM Plex Mono، Fira Code |
| `--font-display` | IBM Plex Sans Arabic (مثل sans) |

### Type scale — 1.125 modular (minor third)

| Token | rem | px (approx) | Usage |
|---|---|---|---|
| `--text-2xs` | 0.6875rem | 11 | badges، micro-labels، kbd (NEW) |
| `--text-xs`  | 0.75rem   | 12 | timestamps (KEEP) |
| `--text-sm`  | 0.875rem  | 14 | meta، small captions (KEEP) |
| `--text-base`| 1rem      | 16 | body (KEEP) |
| `--text-md`  | 1.0625rem | 17 | emphasized body (NEW) |
| `--text-lg`  | 1.125rem  | 18 | emphasized paragraphs (KEEP) |
| `--text-xl`  | 1.25rem   | 20 | small headings (KEEP) |
| `--text-2xl` | 1.5rem    | 24 | H4 (KEEP) |
| `--text-3xl` | 1.875rem  | 30 | H3 (KEEP) |
| `--text-4xl` | 2.25rem   | 36 | H2 (KEEP) |
| `--text-5xl` | 3rem      | 48 | H1 inner (KEEP) |
| `--text-6xl` | 3.75rem   | 60 | H1 home page (KEEP) |
| `--text-7xl` | 4.5rem    | 72 | hero display (NEW) |

**مثال**:
```css
.hero-h1 {
  font-size: var(--text-7xl);
  letter-spacing: var(--tracking-tight);
  line-height: var(--leading-tight);
}
```

### Font weights

5 درجات (KEEP):
- `--font-normal` (400), `--font-medium` (500), `--font-semibold` (600), `--font-bold` (700), `--font-extrabold` (800)
- aliases: `--weight-normal`, `--weight-medium`, `--weight-semibold`, `--weight-bold`, `--weight-extrabold`

### Line heights

| Token | Value | Usage |
|---|---|---|
| `--leading-none`  | 1    | icons + badges (NEW) |
| `--leading-tight` | 1.2  | display headings (KEEP) |
| `--leading-snug`  | 1.35 | dense UI rows، kernel (NEW) |
| `--leading-normal` | 1.5  | body default (KEEP) |
| `--leading-relaxed` | 1.75 | readable long-form (KEEP) |
| `--leading-loose` | 2    | accessibility-friendly (NEW) |

### Tracking — v3.1 NEW

```css
--tracking-tight:  -0.02em;   /* display headings, hero H1 */
--tracking-normal:  0;
--tracking-wide:    0.05em;   /* labels, uppercase */
```

### Font feature settings — v3.1 NEW

```css
--font-feature-default:        "kern", "calt";                      /* default */
--font-feature-numerals-tnum:  "tnum", "lnum";                      /* tables, metrics */
--font-feature-arabic-latin:   "kern", "calt", "ss01", "cv01";     /* mixed content */
--font-feature-punctuation:    "kern", "calt", "ss03";
```

**مثال**:
```css
.metrics-cell {
  font-feature-settings: var(--font-feature-numerals-tnum);
  font-variant-numeric: tabular-nums; /* fallback للـ browsers القديمة */
}
```

---

## 3) Spacing — 4px-base scale

| Token | rem | px |
|---|---|---|
| `--space-0`   | 0           | 0 (NEW — reset) |
| `--space-px`  | 1px         | 1 (NEW — borders) |
| `--space-0-5` | 0.125rem    | 2 (KEEP) |
| `--space-1`   | 0.25rem     | 4 (KEEP) |
| `--space-1-5` | 0.375rem    | 6 (KEEP) |
| `--space-2`   | 0.5rem      | 8 (KEEP) |
| `--space-3`   | 0.75rem     | 12 (KEEP) |
| `--space-4`   | 1rem        | 16 (KEEP) |
| `--space-5`   | 1.25rem     | 20 (KEEP) |
| `--space-6`   | 1.5rem      | 24 (KEEP) |
| `--space-7`   | 1.75rem     | 28 (NEW) |
| `--space-8`   | 2rem        | 32 (KEEP) |
| `--space-9`   | 2.25rem     | 36 (NEW) |
| `--space-10`  | 2.5rem      | 40 (KEEP) |
| `--space-11`  | 2.75rem     | 44 (NEW — touch target) |
| `--space-12`  | 3rem        | 48 (KEEP) |
| `--space-14`  | 3.5rem      | 56 (NEW) |
| `--space-16`  | 4rem        | 64 (KEEP) |
| `--space-18`  | 4.5rem      | 72 (NEW) |
| `--space-20`  | 5rem        | 80 (NEW) |
| `--space-24`  | 6rem        | 96 (NEW) |
| `--space-28`  | 7rem        | 112 (NEW) |
| `--space-32`  | 8rem        | 128 (NEW — hero spacing) |

---

## 4) Radius — الزوايا

| Token | Value | Usage |
|---|---|---|
| `--radius-none` | `0` | sharp shapes |
| `--radius-xs`   | `0.25rem` | خفيف (KEEP) |
| `--radius-sm`   | `0.375rem` | inputs، small chips |
| `--radius-md`   | `0.5rem` | buttons default |
| `--radius-lg`   | `0.75rem` | cards default |
| `--radius-xl`   | `1rem` | feature cards |
| `--radius-2xl`  | `1.5rem` | large cards |
| `--radius-3xl`  | `2rem` | **NEW** — feature cards, panel headers |
| `--radius-4xl`  | `2.5rem` | **NEW** — hero panels, modal corners |
| `--radius-full` | `9999px` | pills, avatars |

**مثال**:
```css
.hero-panel {
  border-radius: var(--radius-4xl);
  padding: var(--space-24) var(--space-16);
}
```

---

## 5) Shadow System — 3-layer (ambient + key + spread)

### الـ Philosophy

كل shadow في BrightAI يتبع 3 layers:
1. **Ambient** — hairline ring، يعطي "وزن" للـ element.
2. **Key** — directional shadow (من فوق)، يعطي "ارتفاع".
3. **Spread** — wide soft spread، يعطي "تعليق".

### Layer primitives (v3.1 NEW)

```css
--shadow-ambient: 0 0 0 1px rgba(15,21,37,0.4);
--shadow-key:     0 4px 8px -2px rgba(0,0,0,0.4);
--shadow-spread:  0 16px 32px -8px rgba(0,0,0,0.5);
```

### Combined shadows

| Token | Layers | Usage |
|---|---|---|
| `--shadow-sm`        | `0 1px 2px rgba(0,0,0,0.3)` | chips، tags (KEEP) |
| `--shadow-md`        | `0 4px 6px -1px rgba(0,0,0,0.3), 0 2px 4px -2px rgba(0,0,0,0.3)` | raised cards (KEEP) |
| `--shadow-lg`        | `0 10px 15px -3px rgba(0,0,0,0.3), 0 4px 6px -4px rgba(0,0,0,0.3)` | modals (KEEP) |
| `--shadow-xl`        | `0 20px 25px -5px rgba(0,0,0,0.3), 0 8px 10px -6px rgba(0,0,0,0.3)` | floating panels (KEEP) |
| `--shadow-2xl`       | `0 25px 50px -12px rgba(0,0,0,0.5)` | hero sections (KEEP) |
| `--shadow-elevated`  | `key + spread` | **NEW** — البطاقات المرفوعة |
| `--shadow-overlay`   | `key + extended spread` | **NEW** — dropdowns، drawers |
| `--shadow-hero`      | `0 32px 64px -16px rgba(0,0,0,0.6)` | **NEW** — hero panels |

### Glow shadows — color-tinted (v3.1 extended)

| Token | Color | Usage |
|---|---|---|
| `--shadow-glow`         | Deep Teal (KEEP) | primary CTA glow |
| `--shadow-glow-lg`      | Deep Teal (KEEP) | hero CTA glow |
| `--shadow-glow-brand`   | Deep Teal | **NEW** — primary interactions |
| `--shadow-glow-accent`  | Burnished Copper | **NEW** — sparingly، warm moments |
| `--shadow-glow-danger`  | Red | **NEW** — destructive actions |
| `--shadow-glow-success` | Green | **NEW** — confirmed states |
| `--shadow-cta-glow`     | Deep Teal (KEEP) | الـ CTA primary |
| `--shadow-cta-glow-lg`  | Deep Teal (KEEP) | hero CTA |

### Inset shadows — pressed/selected (v3.1 NEW)

```css
--shadow-inset-sm: inset 0 1px 2px 0 rgba(0,0,0,0.3);
--shadow-inset-md: inset 0 2px 4px 0 rgba(0,0,0,0.4);
--shadow-inset-lg: inset 0 4px 8px 0 rgba(0,0,0,0.5);
--shadow-press:    inset shadow + focus ring;
```

**مثال**:
```css
.btn-primary:active {
  box-shadow: var(--shadow-press);
  transform: translateY(1px);
}
```

---

## 6) Motion

### Easing curves

| Token | Value | Usage |
|---|---|---|
| `--ease-linear`     | `linear` | continuous loops (KEEP) |
| `--ease-in`         | `cubic-bezier(0.4,0,1,1)` | exit (KEEP) |
| `--ease-out`        | `cubic-bezier(0,0,0.2,1)` | entry — default (KEEP) |
| `--ease-in-out`     | `cubic-bezier(0.4,0,0.2,1)` | double-direction (KEEP) |
| `--ease-spring`     | `cubic-bezier(0.34,1.4,0.64,1)` | playful (KEEP) |
| `--ease-emphasized` | `cubic-bezier(0.2,0,0,1)` | **NEW** — Material 3، للـ hero transitions |
| `--ease-decelerated`| `cubic-bezier(0,0,0,1)` | **NEW** — دخول ناعم (open) |
| `--ease-accelerated`| `cubic-bezier(0.3,0,1,1)` | **NEW** — خروج سريع (close) |

### Durations

| Token | Value | Usage |
|---|---|---|
| `--duration-instant` | 75ms  | **NEW** — hover micro-feedback |
| `--duration-snappy`  | 180ms | **NEW** — tap، toggles |
| `--duration-fast`    | 200ms | click feedback (KEEP) |
| `--duration-base`    | 350ms | default transitions (KEEP) |
| `--duration-slow`    | 600ms | section reveals (KEEP) |
| `--duration-slower`  | 900ms | hero animations (KEEP) |

**مثال**:
```css
.btn-primary {
  transition: 
    background var(--duration-snappy) var(--ease-out),
    transform var(--duration-instant) var(--ease-out);
}
.btn-primary:active { transform: scale(0.98); }
```

---

## 7) Misc

| Token | Value | Usage |
|---|---|---|
| `--touch-min` | `2.75rem` (44px) | **NEW** — min touch target |
| `--glass` | `rgba(15,21,37,0.6)` | shortcut alias (KEEP) |
| `--glass-strong` | `rgba(15,21,37,0.72)` | (KEEP) |
| `--glass-blur` | `blur(16px) saturate(180%)` | (KEEP) |
| `--glass-blur-lg` | `blur(24px) saturate(180%)` | (KEEP) |

---

## 8) Aliases (KEEP — لا تكسر الـ legacy)

**سطح**:
- `--surface` = `--bg-surface`
- `--surface-soft` = `--bg-elevated`

**نص**:
- `--text` = `--text-primary`
- `--text-soft` = `--text-secondary`
- `--text-faint` = `--text-muted`

**حدود**:
- `--border` = `--border-default`
- `--border-soft` = `--border-subtle`

**علامة**:
- `--brand` = `--interactive-primary`
- `--brand-hover` = `--interactive-hover`

**حالات** (مع الـ soft variants):
- `--success` / `--success-soft`
- `--info` / `--info-soft`
- `--warning` / `--warning-soft`
- `--error` / `--error-soft`

**أوزان**:
- `--weight-normal`, `--weight-medium`, `--weight-semibold`, `--weight-bold`, `--weight-extrabold`

---

## 9) Acceptance Checklist (لكل PR يضيف/يعدل CSS)

- [ ] استخدمت `--token` بدل raw value (مثلاً `var(--space-4)` بدل `1rem`).
- [ ] للـ borders: استخدمت `--border-*` بدل `rgba(148,163,184,0.X)`.
- [ ] للـ animations: استخدمت `--duration-*` بدل `200ms`.
- [ ] للـ fonts: استخدمت `--font-sans` بدل `'IBM Plex Sans Arabic'`.
- [ ] للـ shadow: استخدمت `--shadow-*` بدل `0 1px 2px rgba(0,0,0,0.3)`.
- [ ] لا أضفت token مو موثّق هنا (أضفته هنا أول شي).
- [ ] لم أحذف/عدّلت أي token موجود.
- [ ] البناء يمر: `npm run build` → 125 صفحة.
- [ ] احترمت `prefers-reduced-motion`.

---

## 10) Migration Map (إذا حبيت تنقل aliases للـ new scale)

| Alias (قديم) | New scale (v3.1) |
|---|---|
| `--surface` | `--surface-2` |
| `--surface-soft` | `--surface-3` |
| `--border-soft` | `--border-faint` (للحالات الخفيفة فقط) |
| `--text-soft` | `--text-secondary` |
| `--shadow-md` | `--shadow-elevated` (للـ raised cards) |

> الـ aliases الأصلية ستبقى تعمل — لكن في الـ new code، استخدم الـ scale الموحّد.

---

## المرجع
- [Material Design 3 Easing](https://m3.material.io/styles/motion/easing-and-duration/tokens-specs)
- [Tailwind Color Palette (slate scale)](https://tailwindcss.com/docs/customizing-colors)
- [WCAG 2.5.5 Target Size (Minimum)](https://www.w3.org/TR/WCAG22/#target-size-minimum)
- BrightAI internal: `reports/01-design-directions.md` — اتجاه B: السكينة السيادية
