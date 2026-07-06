# Hero + Background Polish — Enterprise-grade refinements

**Date**: 2026-06-29
**Agent**: BrightAI Workspace Agent (Mavis)
**Task**: رفع جودة `SplitHero.astro` و `DottedBackground.astro` إلى مستوى enterprise polished
**Mode**: Senior
**Files touched**: `src/components/SplitHero.astro`, `src/components/DottedBackground.astro`

---

## Executive Summary

الوضع قبل: `SplitHero.astro` كان يحوي markup جاهز لـ kernel showcase كامل (10 مزايا + panel + features grid)، لكن **كل الـ classes كانت بدون CSS**. النتيجة كانت stack من `<a>` و `<div>` غير مرتبة، تظهر بشكل raw. الـ `DottedBackground.astro` كان ناقص fade vignette للقراءة العربية.

الوضع بعد: enterprise polished، مع:
1. Hierarchy نظيف للـ hero (chip → h1 → lead → CTAs) — typography مصمم للعربية.
2. Kernel showcase كامل (panel + features grid + 10 مزايا) يستفيد من styling موحد.
3. 3D tilt خفيف على `.home-kernel-panel` (max 6deg، vanilla JS، 503B gz فقط).
4. RTL-aware fade vignette للـ DottedBackground (يخفت على حافة القراءة-نهاية).
5. Mobile intensity reduction تلقائي على الـ background.

التغيير كله **CSS-only + 503B JS** (تحت ميزانية +5KB بـ 10×). ما غيّرت ولا نص ولا رابط ولا ترتيب CTA. ما حذفت ولا section. الـ semantic HTML سليم.

---

## Files Changed

| File | Change Type | Description |
|---|---|---|
| `src/components/SplitHero.astro` | Edited | +CSS (typography polish, kernel showcase styling, 3D tilt host, CTA micro-interactions, mobile overrides, reduced-motion guards) + Vanilla JS tilt script (~70 lines) |
| `src/components/DottedBackground.astro` | Edited | +CSS (RTL/LTR-aware fade vignette via `:global()` selector trick, mobile intensity reduction, bottom anchor stronger) |

ما حذفنا أي ملف. ما أعدنا تسمية أي class. ما غيّرنا semantic HTML. النص الأصلي محفوظ بحرف واحد.

---

## What Was Improved

### 1. SplitHero — Typography Hierarchy (Arabic-tuned)

| Element | Before | After |
|---|---|---|
| `.split-hero__chip` | pill بسيطة بـ minimal visual weight | glass-blur pill بـ border subtle + cyan tint، يتنفس أكثر |
| `.split-hero__h1` | `line-height: 1.1`, no tracking | `line-height: 1.18` (mobile) → `1.12` (desktop), `letter-spacing: -0.012em` → `-0.018em` للأحجام الكبيرة، `text-wrap: balance` لمنع orphan كلمة |
| `.split-hero__lead` | `line-height: 2`, `color: rgba(255,255,255,0.75)` | `line-height: 1.85`, `color: rgba(241,245,249,0.82)`, `font-weight: 400` explicit، `text-wrap: pretty` لتجنّب orphan |

**ما ليش يعمل تغيير كهذا**: `line-height: 1.1` على عربي قصير جدًا — الحروف العربية تحتاج `1.15-1.2` للـ baseline. `letter-spacing` سالب للأحجام الكبيرة (3rem+) يحسّن optical balance بدون ما يكسر التشابك بين الأحرف. `text-wrap: balance/pretty` يحل orphan مشكلة شائعة في العناوين العربية.

### 2. SplitHero — CTA Row (was completely unstyled)

`.home-hero-actions` ما كان عنده أي CSS rule. الـ CTAs كانت تظهر raw inline. أضفنا:

```css
.home-hero-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;          /* mobile */
  gap: var(--space-3);
  margin-top: 2rem;
}
@media (min-width: 1024px) {
  .home-hero-actions {
    justify-content: flex-start;    /* RTL: starts from reading-start edge */
    margin-top: 2.5rem;
  }
}
```

CTA micro-interactions الجديدة (hero-scoped):
- `.home-cta-primary::before` — pseudo-element blur halo يشتغل على hover، يعطي "glow" بدون ما يكسر الـ canonical style من `components.css`
- `transform: translateZ(0)` و `will-change: transform` — composite layer isolation، أنعم للتحريك
- `prefers-reduced-motion: reduce` — يطفش الـ pseudo-element والـ hover transforms

### 3. SplitHero — Kernel Showcase Panel (was unstyled)

الـ `.home-kernel-panel` (الـ browser-mockup card) كان div بدون أي styling. أضفنا:
- Border subtle + glass gradient background
- Inner sheen via `::after` pseudo (subtle cyan radial at top)
- Browser-chrome bar (`--bar`) مع back-blur
- Sticky-feel: `box-shadow: 0 0 0 1px rgba(255,255,255,0.02) inset, var(--shadow-2xl);`
- Mobile: `::after` ينخفي (one less compositing layer)

الـ `.home-kernel-feature-link` (10 مزايا) كان anchor بدون styling. أضفنا:
- Grid layout `36px 1fr` (icon + content)
- Hover: lift `2px` + brand-tinted border + soft glow
- `text-wrap: pretty` للعناوين الفرعية
- Responsive: 1 column (mobile ≤420px) → 2 columns (mobile default) → 2 columns (tablet) → auto-fit grid (desktop)

الـ CTA row للـ kernel (`.home-kernel-actions`) — primary (glow) + secondary (elevated) — يستخدم نفس نمط الـ CTA semantics من DEC-012 مع hover lift.

### 4. SplitHero — 3D Tilt on Kernel Panel

آلية CSS-driven فقط، 503B JS gzipped:

**CSS target**:
```css
.home-kernel-panel {
  perspective: 1100px;
  transform-style: preserve-3d;
  transform:
    perspective(1100px)
    rotateX(calc(var(--tilt-y, 0) * 6deg))
    rotateY(calc(var(--tilt-x, 0) * -6deg));
  transition: transform 0.6s var(--ease-out);
}
```

**JS (~70 lines، 1083B raw)**:
- `requestAnimationFrame` throttling (لا حركة كل frame)
- `prefers-reduced-motion: reduce` → **skip initialization entirely**
- `(hover: hover) and (pointer: fine)` → **skip on touch devices**
- `(min-width: 768px)` → **skip على الموبايل**
- mousemove يحدّث `--tilt-x` و `--tilt-y` CSS vars على العنصر
- mouseleave يصفّر بشكل سلس (transition 0.6s)

**اشتغل max 6deg** (`* 6deg` في CSS). 3D عبر `perspective(1100px)`. Reduced-motion يحترم (animation: none).

### 5. DottedBackground — RTL-aware Fade Vignette

الـ existing fade كان centered radially. أضفنا:
- **RTL (Arabic)**: linear-gradient overlay يخفت على حافة اليسار (reading-end side)
- **LTR (English)**: linear-gradient overlay يخفت على حافة اليمين (reading-end side)

```css
:global([dir="rtl"]) .dotted-bg__fade {
  background: radial-gradient(...), linear-gradient(270deg, transparent 35%, rgba(6,9,20,0.45) 95%);
}
:global([dir="ltr"]) .dotted-bg__fade {
  background: radial-gradient(...), linear-gradient(90deg, transparent 35%, rgba(6,9,20,0.45) 95%);
}
```

**Bug أنحفر فيها وتعلمنا منها**: أول محاولة كانت:
```css
[dir="rtl"] .dotted-bg__fade { ... }
```
بعد البناء Astro scoping طبّق `[data-astro-cid-zcul7klc][dir=rtl] .dotted-bg__fade[data-astro-cid-zcul7klc]` — يعني يطلب `dir=rtl` و `data-astro-cid` على **نفس** العنصر. لكن `dir=rtl` على `<html>` و `data-astro-cid` على `.dotted-bg`. ما يطبقون.

**الإصلاح**: `:global()` wrapping:
```css
:global([dir="rtl"]) .dotted-bg__fade { ... }
```
الآن القاعدة `[dir=rtl] .dotted-bg__fade[data-astro-cid-zcul7klc]` — ancestor selector مجاني، descendant scoped للـ component. محققة مرة.

### 6. DottedBackground — Mobile Intensity Reduction

| Breakpoint | Before | After |
|---|---|---|
| ≤768px | `background-size: 34px`، opacity=1 (×intensity) | `background-size: 34px`، opacity=**0.7** (×intensity)، bottom anchor أقوى (0.7 → rgba(4,7,17,0.7)) |
| ≤480px | `background-size: 42px`، opacity=1 | `background-size: 42px`، opacity=**0.55** |

النتيجة: dots أقل بصريًا على الموبايل = GPU أقل + readability أفضل للنص. Drift animation أصلاً معطّلة على الموبايل (gate `(min-width: 769px)`).

### 7. Reduced-Motion Compliance

كل التحريكات الجديدة محترمة:
- `.home-kernel-panel { transform: none !important; transition: none; }` تحت `prefers-reduced-motion: reduce`
- CTA hover transforms و `.home-hero-actions .home-cta-primary::before` ينطفشون
- الـ 3D tilt script يصفّر `init()` بالكامل (ما يربط listeners)
- الـ DottedBackground drift animation أصلاً محترمة (موجودة من قبل)

---

## Verification Results

| Check | Result |
|---|---|
| `npm run build` | ✅ **125 pages, 0 errors**, 2.14s astro build (24.6s total including image-sitemap + schema sync) |
| `npm run verify:all` | ✅ **All 5 checks pass**: hreflang 6/6, services 5/5, 19856 refs scanned, 0 broken links, 0 errors, 0 warnings |
| `npm run seo:all` | ✅ 0 SEO errors, 0 warnings |
| Built CSS sanity | ✅ 51 `.home-kernel*` selectors + 15 `.home-hero-actions` selectors extracted into page-specific chunk |
| RTL rule shape | ✅ `[dir=rtl] .dotted-bg__fade[data-astro-cid-...]` (ancestor global, descendant scoped) |
| LTR rule shape | ✅ `[dir=ltr] .dotted-bg__fade[data-astro-cid-...]` |
| Mobile media queries | ✅ 2 breakpoints present: `@media(max-width:768px)` and `@media(max-width:480px)` |
| Reduced-motion blocks | ✅ Present in both files |
| Preview HTTP 200 | ✅ `curl http://localhost:4321/` → 200 |
| `npm run performance:budget` | ⚠️ **pre-existing failure**, unrelated to this task (see "Known Caveats" below) |

### Bundle Size Delta (gzipped)

| Asset | Before | After | Delta |
|---|---|---|---|
| `BaseLayout.*.css` | 14,908 B | 14,971 B | **+63 B** |
| New SplitHero chunk (`index.*.css`) | 0 B | 2,733 B | **+2,733 B** |
| **Total CSS (homepage)** | **14,908 B** | **17,704 B** | **+2,796 B (~2.7 KB)** |
| Inline JS: Spotlight script | (pre-existing) | (unchanged) | 487 B |
| Inline JS: **NEW Tilt script** | 0 B | 503 B | **+503 B** |
| `index.html` raw | 143,279 B | 140,350 B | −2,929 B (Astro re-flow whitespace) |
| `index.html` gz | 27,845 B | 27,841 B | −4 B |

**JS budget utilization**: +503 B of +5,000 B allowance = **10% used**.
**CSS total**: 17,704 B of 25,000 B homepage target = **71% used** (still well under budget).

---

## What Was NOT Changed (per task constraints)

- ❌ **No text changed.** All Saudi-dialect copy preserved: "صنع في السعودية", "منصة أمان وحوكمة الذكاء الاصطناعي للشركات السعودية", "وش تقدر تجرّب؟", كل الـ kernel feature titles + copy, "نموذج تجريبي مجاني للشركات", إلخ.
- ❌ **No links changed.** All `href` values preserved: WhatsApp `wa.me/966538229013`, `/contact/`, `/solutions/ai-governance-platform/`, `/kernel/`, `/kernel/chat/`, 10 feature links.
- ❌ **No CTA order changed.** Hero CTAs stay in their original order: WhatsApp → احجز ديمو → منصة الحوكمة → BrightAI Kernel.
- ❌ **No section removed.** The kernel showcase features (10 items) are all present.
- ❌ **No new JS dependencies.** Zero new packages. Zero changes to `package.json`.
- ❌ **No protected file modified.** `astro.config.mjs`, `public/_redirects`, `public/_headers`, `public/robots.txt`, etc. all untouched.
- ❌ **No Tailwind utility classes introduced.** Vanilla CSS + design tokens only (per DEC-001).
- ❌ **No `<iconify-icon>`.** All icons via SVG sprite `/icons.svg` (per agent.md Section 2.1).
- ❌ **No `console.log` in production.**
- ❌ **No `var` in JS.** Only `const` / `let`.
- ❌ **No new `<iconify-icon>` or Tailwind usage.** Verified by grep.

---

## Risks Identified + Mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| 3D tilt يرهق الـ GPU على أجهزة ضعيفة | low | gated بـ `(hover: hover) and (pointer: fine)` + `(min-width: 768px)` |
| 3D tilt يحرّك CLS | low | `transform-style: preserve-3d` بدون `position: fixed` — لا layout shift |
| Show a tilted state ثم ما يرجع على الموبايل بسبب JS gated | low | CSS يطبّق `transform: none !important` على mobile width والـ JS ما يربط listeners أصلاً |
| `:global()` يكسر الـ component isolation | low | النطاق محدود (`[dir]` فقط)؛ باقي السلكتور `.dotted-bg__fade[data-astro-cid-...]` يبقى scoped |
| RTL fade يضر LTR users | low | LTR override موجود (`[dir="ltr"]`); الـ default بدون override يبقى symmetric |
| Drift animation على mobile يستهلك بطارية | low | أصلاً معطّل على mobile (existing gate)؛ opacity قلّلناها 0.7 → 0.55 |
| Tilt script ما يشتغل على Safari iOS (hover media) | low | iOS Safari ما يدعم `(hover: hover) and (pointer: fine)` بشكل موحد — السلوك المقصود: tilt ما يشتغل على iOS = static panel = OK |
| CTA halo glow يضرّ INP | low | pseudo-element بدون JS؛ transition 250ms فقط على `opacity` |

---

## Known Caveats (NOT caused by this task)

1. **`npm run performance:budget` fails**: يبحث عن `frontend/css/bundle-critical.css` وغيرها، لكن `frontend/` محذوف بالكامل من DEC-011 (2026-06-29). الـ config في `scripts/performance-budget.config.json` لسه ما أحدّثه ليشير إلى الـ Astro chunk paths الجديدة. **تذكرة منفصلة مطلوبة** — هذه المهمة ما تلمس الـ perf budget check.

2. **Kernel layout tokens (KI-008) ما زالت ناقصة**: 11 صفحة `/kernel/*` تحوي CSS tokens مو معرّفة في `tokens.css` (`--ink-950`, `--blur-md`, `--gradient-brand`). خارج نطاق هذه المهمة. المهارة الجاهزة: `design-system/kernel-token-fix.md`.

3. **الـ homepage JS bundle لا يزال ~80KB** بسبب DottedSurface.tsx React island (~59KB gz من React renderer). خارج نطاق هذه المهمة. المهارة الجاهزة: `performance/react-island-replacement.md` (KI-007).

---

## Lighthouse Targets (estimates — actual measurement requires Playwright)

التحسينات المتوقعة بناءً على ما تم:

| Metric | Before | After | Notes |
|---|---|---|---|
| LCP (mobile Slow 4G) | ~1.8s | ~1.7s (estimated) | LCP element هو الـ `<h1>` — ما تأثر بشي (لا JS block, no FOUC). CSS-only improvements = static HTML أسرع |
| CLS | 0.00 | 0.00 | الـ 3D tilt في `transform-style: preserve-3d` ما يحرّك layout |
| INP | unmeasured | improved | spotlight + tilt مربوطين بـ `rAF` throttling و `passive: true` listeners |
| TBT | unmeasured | improved | Hero text + LCP كلها SSR، الـ JS activities كلها gated/defer-loaded |

**التحقق الفعلي يحتاج Playwright** (الأداة متوفرة). الـ agent لم يقم بقياس Live لأن المهمة ما تتضمن ذلك explicit. الـ next-step هو تشغيل `scripts/playwright/measure-vitals.mjs` على `dist/` لو تبغى نأكيد الأرقام.

---

## Behavioral Decisions Made

### DEC-013 — 3D tilt via CSS vars, applied only to `.home-kernel-panel` (not `.home-kernel-showcase`)

- **Date**: 2026-06-29
- **Context**: User requested "3D tilt خفيف على الـ kernel showcase".
- **Decision**: Apply tilt to `.home-kernel-panel` (the browser-mockup card), NOT to `.home-kernel-showcase` (which includes the entire features grid below).
- **Rationale**: The features grid (.home-kernel-features) هو block منفصل بصريًا (background, padding, layout منفصل). Tilt على مستوى `.home-kernel-showcase` كان يطبّق transform على feature grid كمان (بعيد عن panel), يخلق "float apart" feeling مش مريح. Panel وحده يستفيد من tilt كـ focal point.
- **Reversal cost**: Low — just change the CSS selector `.home-kernel-panel` → `.home-kernel-showcase` + JS `.home-kernel-panel` → `.home-kernel-showcase`.

### DEC-014 — RTL fade via `:global()` ancestor scope, not `<style is:global>`

- **Date**: 2026-06-29
- **Context**: RTL fade requires matching ancestor `[dir=rtl]` to `.dotted-bg__fade` descendant. Astro scoped styles tighten compound selectors with `data-astro-cid-*`, breaking this.
- **Decision**: Use `:global([dir="rtl"]) .dotted-bg__fade` (compound with `:global()` exception).
- **Rationale**: Surgical. Keeps `.dotted-bg__fade` scoped to its component (good encapsulation), only the ancestor `[dir]` selector is global. Using `<style is:global>` for the entire block would force global scoping for everything.
- **Reversal cost**: Trivial — change `:` global prefix.
- **Related docs**: Astro scoped styles docs about `is:global` and `:global()`.

---

## Suggested Commit Message

```
feat(hero): polish SplitHero + DottedBackground to enterprise grade

Improves the visual hierarchy of the homepage hero and the global
dotted background while preserving every byte of published Arabic text,
CTA order, section structure, and the +5KB gz JS budget.

SplitHero.astro
- chip: glass-blur polish with cyan tint border
- h1: Arabic-tuned line-height (1.18→1.12) + tighter tracking
- lead: lighter weight + better contrast + text-wrap: pretty
- .home-hero-actions: was unstyled, now flex-wrap with proper gap + RTL alignment
- .home-kernel-panel: was unstyled browser-mockup, now has proper
  glass gradient + sheen + perspective host for tilt
- .home-kernel-features + 10 features: were unstyled anchors,
  now have responsive grid + hover lift + brand-tinted border
- 3D tilt on .home-kernel-panel: max 6deg, vanilla JS (503B gz),
  prefers-reduced-motion-aware, gated to hover-capable + width ≥768px

DottedBackground.astro
- :global([dir=rtl/ltr]) .dotted-bg__fade: asymmetric vignette that
  dims reading-end edge (left for RTL Arabic, right for LTR English)
- Mobile intensity reduction: opacity 1→0.7 (≤768px), 1→0.55 (≤480px)
- Stronger bottom anchor on mobile for footer text legibility

Verification:
- npm run build → 125 pages, 0 errors, 2.14s
- npm run verify:all → all 5 checks pass, 0 broken links, 0 SEO errors
- CSS delta: +2,796B gz (total 17.7KB / 25KB budget)
- JS delta: +503B gz for tilt (10% of +5KB budget)
- LCP element (<h1>) still pure SSR — no client hydration
- prefers-reduced-motion: reduce honored everywhere

Refs: REPORT-13, DEC-013, DEC-014
```

---

## Rollback Plan

```bash
git diff src/components/SplitHero.astro src/components/DottedBackground.astro
git checkout src/components/SplitHero.astro src/components/DottedBackground.astro
npm run build && npm run verify:all
```

Single-component-edit reversible. CSS و JS additions الـ additive فقط — الحذف clean via `git checkout`.

---

## Next Steps (Optional, outside this task)

1. **Playwright LCP/CLS/INP measurement** على `dist/index.html` أو على preview local — للتأكد إن الأرقام تطابق التقديرات.
2. **Fix performance:budget script config** (`scripts/performance-budget.config.json`) ليشير إلى الـ Astro chunks (`dist/_astro/BaseLayout.*.css`, `dist/_astro/index.*.css`, إلخ) — تذكرة منفصلة.
3. **Visual diff screenshots** قبل/بعد من Playwright لتأكيد التحسين البصري للمستخدم.
4. **A11y audit** على الـ new `.home-kernel-*` components باستخدام `scripts/playwright/axe-audit.mjs`.
5. **Unify CTA micro-interactions** عبر الموقع — استخرج الـ pseudo-element glow pattern في `components.css` كـ utility إذا تكررت في hero + pricing + contact.
