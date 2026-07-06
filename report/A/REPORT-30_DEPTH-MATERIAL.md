# REPORT-30_DEPTH-MATERIAL — Depth & Material Treatment

**Date**: 2026-06-30
**Agent**: BrightAI Workspace Agent
**Task**: أضف depth & material للـ UI بدون كسر clarity/A11y/perf
**Mode**: Senior
**DEC**: DEC-2026-030 (Depth Tokens)

---

## Executive Summary

أضفنا طبقة عمق هادفة على BrightAI — noise grain خفيف, glass effect قوي, inner-highlight على البطاقات, outer-glow على الـ CTAs, و radial gradients على الأقسام — كل هذا **بدون ما نكسر** الميزانيات والـ A11y والـ perf.

**التوازن اللي وصلناه**: الجسم والبانلات عندها texture ملموس (1.5–2.8% noise opacity)، الـ header/dropdown/drawer عندها frosted glass حقيقي (`backdrop-filter: blur(16-24px) saturate(180%)`)، البطاقات عندها inner top-edge highlight يعطيها sensación بأنها مرفوعة عن السطح، والـ CTAs عندها soft cyan halo بدل ما تكون flat.

كل التأثيرات تحترم `@media (prefers-reduced-transparency: reduce)` — اللي يطلب flat UI يحصل عليه بالضبط: لا noise, لا backdrop-filter, الـ backgrounds تصير opaque solid. **ما ضحّينا بـ accessibility أبداً**.

**Trade-off واحد نوثّقه**: الـ noise كان مفروض inline data URI (صفر HTTP) لكن الـ seo-ci-check يفسر الـ `%23` (URL-encoded `#`) داخل data URI كـ broken anchor link. الحل العملي: نقل الـ SVG للـ public asset (`/noise.svg`, 363 bytes, cacheable 90 يوم عبر `Cache-Control: public, max-age=7776000`). الـ cost: HTTP request واحد cacheable per user per 90 يوم، صفر impact على الـ initial render (الـ noise = background decoration, يخدم بعد first paint).

---

## ما تغيّر

### 1. Tokens جديدة في `tokens.css` (Section 15 — Depth & Material)

```css
--noise-svg: url("/noise.svg");                 /* inline كان يسبّب false-positive في seo-ci-check */
--noise-body: 0.015;                            /* 1.5% — body-wide grain */
--noise-card: 0.022;                            /* 2.2% — card surface grain */
--noise-hero: 0.028;                            /* 2.8% — hero panel grain */

--glass-strong: rgba(15, 21, 37, 0.72);         /* أقوى من --glass القديم (0.6) */
--glass-blur: blur(16px) saturate(180%);
--glass-blur-lg: blur(24px) saturate(180%);
--glass-highlight: rgba(255, 255, 255, 0.06);   /* top-edge hairline */
--glass-highlight-strong: rgba(255, 255, 255, 0.08);

--highlight-inner: inset 0 1px 0 0 var(--glass-highlight);
--highlight-inner-strong: inset 0 1px 0 0 var(--glass-highlight-strong);

--shadow-cta-glow: 0 0 28px -6px rgba(6, 182, 212, 0.45);
--shadow-cta-glow-lg: 0 0 40px -4px rgba(6, 182, 212, 0.55);

--gradient-section-radial: radial-gradient(ellipse 80% 60% at 50% 0%,
                          rgba(6, 182, 212, 0.05), transparent 70%);
--gradient-section-radial-indigo: radial-gradient(ellipse 70% 50% at 80% 100%,
                                  rgba(99, 102, 241, 0.06), transparent 70%);
```

### 2. Body noise overlay (`base.css`)

- `body::before` ثابت position, `z-index: 1`, `pointer-events: none`
- `background-image: var(--noise-svg)`, `background-size: 200px 200px`, `background-repeat: repeat`
- `opacity: var(--noise-body)` = 1.5%
- `mix-blend-mode: overlay` — يدمج مع خلفية `--bg-base` بدون ما يطمس النص
- `mask-image: linear-gradient(to bottom, black 0%, black 90%, transparent 100%)` — يخفي الـ noise في أسفل الـ viewport (عشان ما يكون فوق شريط الـ viewport chrome)
- `body > *` يرفع `z-index: 2` عشان المحتوى فوق الـ noise

### 3. Card noise + inner-highlight (`components.css`)

طبّقنا طبقة واحدة عبر قائمة selectors شاملة (تشمل canonical BEM + legacy aliases):

```css
.card, .card--feature, .feature-card, .inner-card,
.card--pricing, .pricing-card,
.card--metric, .home-stat-card, .inner-stat,
.testimonial, .pricing-panel, .home-faq-item,
.card--cta, .home-cta-card, .inner-cta-final__card {
  position: relative;
  isolation: isolate;
  box-shadow:
    var(--shadow-md),
    var(--highlight-inner);     /* 1px top sheen */
}

.card::after { /* (نفس القائمة) */
  content: '';
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  border-radius: inherit;
  background-image: var(--noise-svg);
  background-size: 200px 200px;
  opacity: var(--noise-card);   /* 2.2% */
  mix-blend-mode: overlay;
  mask-image: linear-gradient(black, black);
}

.card > * { position: relative; z-index: 1; }  /* محتوى فوق الـ noise */
```

### 4. CTA outer-glow (`components.css`)

```css
.btn--primary, .btn-primary, .home-cta-primary, .btn--glow, .glow-btn {
  box-shadow:
    var(--shadow-cta-glow),                  /* halo على الحالة العادية */
    var(--highlight-inner-strong);           /* top-edge sheen */
}

.btn--primary:hover { box-shadow: var(--shadow-cta-glow-lg), var(--highlight-inner-strong); }
.btn--glow:hover { box-shadow: var(--shadow-cta-glow-lg), 0 0 0 1px rgba(255,255,255,0.08) inset; }
```

### 5. Radial gradients + hero noise (`pages.css`, `components.css`)

- `.home-trust::before` = cyan radial من فوق + indigo radial من تحت-يمين
- `.home-trust::after` = noise hero 2.8%
- `.page-hero::before` = نفس الـ cyan radial top + indigo bottom-left
- `.page-hero::after` = noise hero 2.8%

كلهم يحصلون على `.section-block > * { z-index: 1 }` عشان المحتوى فوقهم.

### 6. Header glass upgrade (`Header.astro`)

```css
.site-header {
  background: var(--glass-strong);                 /* rgba(15,21,37,0.72) */
  backdrop-filter: var(--glass-blur);              /* blur(16px) saturate(180%) */
  -webkit-backdrop-filter: var(--glass-blur);
  border-bottom: 1px solid var(--border-subtle);
  isolation: isolate;
}

.site-header::before {     /* top hairline highlight — تدرّج شفاف → أبيض-8% → شفاف */
  top: 0; inset-inline: 0; height: 1px;
  background: linear-gradient(to right,
    transparent 0%, var(--glass-highlight-strong) 50%, transparent 100%);
}

.site-header::after {      /* 2.2% noise overlay */
  inset: 0;
  background-image: var(--noise-svg);
  opacity: var(--noise-card);
  mix-blend-mode: overlay;
}
```

### 7. Dropdown panel glass upgrade (Header.astro)

```css
.site-header__dropdown-panel {
  background: var(--glass-strong);
  backdrop-filter: var(--glass-blur-lg);            /* blur(24px) saturate(180%) */
  border: 1px solid var(--border-default);
  box-shadow:
    var(--shadow-xl),
    var(--highlight-inner-strong);
  isolation: isolate;
  overflow: hidden;
}

.site-header__dropdown-panel::before {     /* cyan top edge */
  top: 0; inset-inline: 0; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(6,182,212,0.35), transparent);
}

.site-header__dropdown-panel::after {      /* 2.2% noise */
  inset: 0;
  background-image: var(--noise-svg);
  opacity: var(--noise-card);
  mix-blend-mode: overlay;
}
```

### 8. Mobile drawer glass (MobileNav.astro)

```css
.mobile-menu {
  background: var(--glass-strong);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  box-shadow:
    -1px 0 0 0 var(--glass-highlight-strong) inset,
    var(--shadow-2xl);
  isolation: isolate;
}

.mobile-menu::before {     /* 2.2% noise overlay */
  inset: 0;
  background-image: var(--noise-svg);
  opacity: var(--noise-card);
  mix-blend-mode: overlay;
}
```

### 9. `prefers-reduced-transparency: reduce` — accessibility fallback

ثلاثة أماكن:

**base.css**:
```css
@media (prefers-reduced-transparency: reduce) {
  body::before { display: none; }   /* kill body noise */
}
```

**Header.astro + MobileNav.astro**:
```css
@media (prefers-reduced-transparency: reduce) {
  .site-header, .site-header__dropdown-panel {
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    background: rgba(10, 14, 26, 0.95);   /* essentially opaque */
  }
  .mobile-menu {
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    background: rgb(10, 14, 26);          /* fully opaque */
  }
  .site-header::after,
  .site-header__dropdown-panel::after,
  .mobile-menu::before { display: none; }
}
```

**components.css** (cards):
```css
@media (prefers-reduced-transparency: reduce) {
  .card::after, .card--feature::after, /* ...كل الـ 16 selectors */ { display: none; }
  .btn--primary { box-shadow: var(--highlight-inner-strong); }   /* drop halo, keep inner sheen */
}
```

النتيجة: اللي يفعّل reduced-transparency يحصل على الـ static flat UI بدون أي noise أو backdrop filter أو halo glow. الـ inner-highlight يبقى لأنها ليست transparency effect (هي solid 1px line).

### 10. `prefers-reduced-motion: reduce`

موجود أصلاً في كل المكونات (Header, MobileNav, components.css, animations). ما أضفنا animations جديدة. الـ `glow-breathe` للـ `.btn--glow` كان محصور مسبقاً:
```css
@media (prefers-reduced-motion: no-preference) {
  .btn--glow { animation: glow-breathe 3.6s ... infinite; }
}
```
يعني اللي يقلل motion ما يشوف الـ pulse أصلاً.

---

## الملفات اللي تغيّرت

| File | Change Type | Description |
|---|---|---|
| `public/noise.svg` | Created | feTurbulence noise texture (363 bytes, cacheable) |
| `src/styles/tokens.css` | Edited | +18 depth tokens (noise, glass, highlight, shadow, radial) |
| `src/styles/base.css` | Edited | body::before noise overlay + reduced-transparency |
| `src/styles/components.css` | Edited | card noise + inner-highlight + CTA outer-glow + page-hero depth |
| `src/styles/pages.css` | Edited | home-trust radial + noise panel |
| `src/components/Header.astro` | Edited | header glass upgrade + dropdown panel glass + top-edge highlight |
| `src/components/MobileNav.astro` | Edited | mobile drawer glass + side highlight + noise |

**لم نلمس**:
- أي محتوى منشور (نصوص, h1-h6, schema)
- أي section في أي صفحة
- canonical, hreflang
- protected files (`astro.config.mjs`, `render.yaml`, `public/_redirects`, `public/_headers`, `public/robots.txt`, ...)

---

## نتائج التحقق

| Check | Result |
|---|---|
| `npm run build` | ✅ 125 pages, 0 errors, 2.48s |
| `npm run verify:all` (→ sitemap + seo:schema + seo:gate) | ✅ exit 0 |
| `seo:ci-check` (broken links + canonical + sitemap) | ✅ 0 errors, 0 warnings |
| `internal-links:audit` | ✅ brokenLinks: 0, orphanPages: 0, hashIssues: 0 |
| Homepage HTML gzipped | 29.6 KB (was ~29.0 KB, +0.6 KB — within <35 KB budget) |
| Homepage CSS gzipped (BaseLayout + index) | 18.3 KB (was ~16.0 KB, **+2.3 KB** — within +20 KB hard limit) |
| Total CSS dist gzipped | 19.6 KB (within <25 KB budget per perf budget) |
| Noise asset: raw / gzipped | 363 / 264 bytes |
| Noise asset cache header | `Cache-Control: public, max-age=7776000, stale-while-revalidate=2592000` (90 days) |
| `noise.svg` Content-Type | `image/svg+xml` |
| `noise.svg` CSP allowance | ✅ `img-src 'self' data: blob: https:` |

### Contrast verification (WCAG 2.2)

| Surface | Foreground | Contrast | Rating |
|---|---|---|---|
| Header glass (text on rgba(15,21,37,0.72) over #0a0e1a) | `#f1f5f9` | **16.89 : 1** | AAA (≥ 7) |
| Card body (text-secondary on `#0f1525`) | `#94a3b8` | **7.10 : 1** | AAA |
| Primary CTA (text-inverse on `#06b6d4`) | `#0a0e1a` | **7.93 : 1** | AAA |
| Reduced-transparency header fallback (text on `#0a0e1af2`) | `#f1f5f9` | **17.58 : 1** | AAA |
| Reduced-transparency drawer fallback (text on `#0a0e1a`) | `#f1f5f9` | **17.74 : 1** | AAA |

كل النصوص ≥ 7:1 = **AAA**. الهدف AAA "حيث ممكن" تحقق. AA تحقق كحد أدنى في كل مكان.

---

## Trade-offs الموثّقة

### 1. SVG noise file بدل inline data URI

**القرار**: نقل الـ noise من data URI داخل `tokens.css` إلى ملف فعلي في `public/noise.svg`.

**السبب**: الـ seo-ci-check يفسر الـ `%23` (URL-encoded `#` لـ filter reference) داخل data URI كـ broken anchor link — `%23n` طلع false positive في الـ verification. الـ inline كان أوفر HTTP request لكنه يكسر pipeline التحقق.

**الأثر**:
- +1 HTTP request لـ `/noise.svg` (363 bytes raw, **264 bytes gzipped**)
- `Cache-Control: public, max-age=7776000` = 90 يوم cache في browser/Cloudflare
- تأثير على LCP = ~0 (الـ noise = background decoration, يخدم بعد first paint)
- SEO + CI verification = clean الآن

**البديل المرفوض**: أعيد تسمية `id="n"` و استخدام entities مختلفة. الـ regex الـ seo-ci-check يلتقط أي `%23<chars>` فلا فائدة. الحل العملي هو الـ public asset.

### 2. الـ performance:budget config قديم

`scripts/performance-budget.config.json` ما يزال يشير لملفات `frontend/...` اللي حذفناها (KI-001). الفشل خارج نطاق مهمتنا وموجود قبل ما نبدأ. ما عدّلنا الـ config لأن هذا قرار منفصل يحتاج تخطيط (الـ budget ذاته يحتاج إعادة تحديد لما frontend/ ما عاد موجود).

---

## المخاطر المتبقية

- **`box-shadow` على الـ cards الآن + الـ transform/translateY على hover = paint composite layer إضافي**. على mobile low-end، هذا قد يرفع 2-5ms في INP. احتماله: متوسط. الـ impact الفعلي على LCP = 0 (الـ cards تحت الـ fold في كل الصفحات الداخلية). ننصح بقياس INP بعد الـ deploy على mobile throttling. لو INP ارتفع > 200ms، الـ fix هو: تحويل الـ noise overlay من `mix-blend-mode: overlay` إلى `opacity` عادي بدون blend (يقلل الـ composite cost بنسبة 30-40%).

- **الـ drop shadow `--shadow-cta-glow` على كل الـ primary CTAs في الـ homepage**. تحت الـ fold كلهم ما يهم، لكن الـ primary CTA فوق الـ fold في الرئيسية. الـ paint cost = ~1ms إضافي. تأثير INP على hover = ~5ms (ضمن < 200ms).

- **CSS repetition للـ noise selectors**: أضفنا نفس قائمة الـ 16 selectors في 4 قواعد مختلفة (position, isolation, shadow, ::after, > *). هذا رفع source CSS بـ 2.1KB. البديل كان class واحدة `.card-noise` على الـ 16 elements، لكن هذا يطلب تعديل HTML/JSX في 14+ صفحة (خارج نطاق مهمتنا — تغيير visual-only, ما يبرر تعديل markup). الحل البديل الموصى به للـ future: `data-depth` attribute أو `--enable-depth: 1` على الـ root + `@supports` query.

---

## Recommendations / Follow-up

- **DEC-029 / DEC-030 sequence**: لو بدّنا نكمل، الـ DEC-029 كان page-hero unification والـ DEC-030 = hero carousel. هذي depth tokens جاهزة تستهلكها.
- **تقليل CSS repetition**: لما نوصل لصفحة P3 (CSS split من pages.css), نستخرج noise/glass rules في ملف `depth.css` بدل تكرارها في 5 ملفات.
- **INP measurement**: لو في وقت, شغّل Playwright `:hover` على primary CTA + card hover وقِس INP. لو ارتفع > 200ms نرجع لـ `opacity` بدون blend mode.
- **performance:budget cleanup** (KI-001 المتبقي): أحدد config جديد مرتبط بالـ Astro output (BaseLayout CSS, Index CSS, total JS) بدل frontend/.

---

## Rollback

```bash
git revert <this-commit-sha>   # يعيد كل التغييرات
# أو
git stash && git checkout HEAD~1 -- src/styles/tokens.css src/styles/base.css \
                                     src/styles/components.css src/styles/pages.css \
                                     src/components/Header.astro src/components/MobileNav.astro
trash public/noise.svg
npm run build && npm run verify:all
```

الـ rollback آمن: ما لمسنا أي markup، نشر، أو schema. التراجع فقط يستعيد الـ flat UI.
