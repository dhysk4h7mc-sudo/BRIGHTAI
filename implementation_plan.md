# محتوى ملف `implementation_plan.md`

```markdown
# Implementation Plan

إنشاء وكيل ذكي متكامل يتحقق من اكتمال ترحيل جميع الملفات من HTML إلى Astro مع المحتوى الحرفي الكامل، ثم إعادة بناء نظام التصميم بالكامل من الصفر مع الحفاظ على نفس المحتوى والألوان الأساسية.

المشروع الحالي (BRIGHTAI) هو موقع Astro ثابت لمنصة Saudi AI Safety OS. تم ترحيل 129 ملف HTML إلى 36 صفحة Astro، لكن التصميم بعد الترحيل يعاني من مشاكل جوهرية: 13 ملف CSS متجزئة (~5000+ سطر) مع تعارضات وتكرار، ملف `DESIGN.md` فارغ (0 بايت)، اختلاط عشوائي بين فئات Tailwind و CSS المخصص، وعدم اتساق بصري بين الصفحات. رغم أن البناء ينجح (125 صفحة في 3.28 ثانية) ولا توجد علامات TODO/FIXME، إلا أن جودة التصميم بعد الترحيل تحتاج إعادة بناء كاملة.

النهج ينقسم إلى مرحلتين رئيسيتين: (1) مرحلة التحقق — فحص كل صفحة Astro مقابل HTML الأصلي المستخرج من git history (commit `eaadccc7~1`) للتأكد من اكتمال المحتوى حرفياً بدون تجاوز أي حرف أو قسم؛ (2) مرحلة إعادة البناء — هندسة نظام تصميم جديد موحد من الصفر بـ 7 ملفات CSS بدلاً من 13، مع إعادة بناء كل صفحة ومكون باستخدام الألوان الأساسية المحفوظة (Cyan `#06b6d4`، Green `#22c55e`، Indigo `#6366f1`).

[Types]

تعريفات الأنواع للأنظمة المساعدة في التحقق وإعادة البناء، تشمل أنواع بيانات التحقق من الترحيل وأنواع نظام التصميم الجديد.

### أنواع بيانات التحقق

```typescript
// scripts/migration-audit/types.ts
interface MigrationAuditResult {
  page: string;                    // مسار صفحة Astro
  htmlSource: string;              // مسار HTML الأصلي
  status: 'complete' | 'partial' | 'missing_content' | 'missing_page';
  contentCoverage: number;         // نسبة 0-100
  missingSections: string[];       // أقسام مفقودة
  missingElements: string[];       // عناصر/أزرار/أيقونات مفقودة
  brokenLinks: BrokenLink[];       // روابط مكسورة
  notes: string;
}

interface BrokenLink {
  href: string;
  type: 'internal' | 'external' | 'asset';
  resolvedTarget: string | null;
  issue: '404' | 'redirect_loop' | 'missing_asset';
}

interface ComponentInventory {
  shared: ComponentDef[];
  individual: ComponentDef[];
  legacy: ComponentDef[];
  kernel: ComponentDef[];
}

interface ComponentDef {
  name: string;
  path: string;
  props: string[];
  usedBy: string[];
  cssClasses: string[];
  hasScopedStyles: boolean;
}
```

### أنواع نظام التصميم الجديد (CSS Custom Properties)

```css
:root {
  /* الألوان الأساسية — محفوظة */
  --brand-50: #ecfeff;  --brand-500: #06b6d4;  --brand-900: #164e63;
  --accent-50: #f0fdf4; --accent-500: #22c55e; --accent-700: #15803d;
  --indigo-300: #a5b4fc; --indigo-500: #6366f1; --indigo-600: #4f46e5;

  /* دلالات جديدة موحدة */
  --bg-base: #0a0e1a; --bg-surface: #0f1525; --bg-elevated: #151c30; --bg-overlay: rgba(10,14,26,0.8);
  --text-primary: #f1f5f9; --text-secondary: #94a3b8; --text-muted: #64748b; --text-inverse: #0a0e1a;
  --border-subtle: rgba(148,163,184,0.1); --border-default: rgba(148,163,184,0.2); --border-strong: rgba(148,163,184,0.35);
  --interactive-primary: #06b6d4; --interactive-hover: #0891b2; --interactive-active: #0e7490;
  --status-success: #22c55e; --status-warning: #f59e0b; --status-danger: #ef4444; --status-info: #6366f1;

  /* تباعد موحد (8px base) */
  --space-1: 0.25rem; --space-2: 0.5rem; --space-3: 0.75rem; --space-4: 1rem;
  --space-6: 1.5rem; --space-8: 2rem; --space-12: 3rem; --space-16: 4rem;

  /* خطوط */
  --font-sans: 'IBM Plex Sans Arabic', system-ui, sans-serif;
  --font-mono: 'IBM Plex Mono', monospace;
  --text-xs: 0.75rem; --text-sm: 0.875rem; --text-base: 1rem; --text-lg: 1.125rem;
  --text-xl: 1.25rem; --text-2xl: 1.5rem; --text-3xl: 2rem; --text-4xl: 2.5rem;

  /* زوايا */
  --radius-sm: 0.375rem; --radius-md: 0.5rem; --radius-lg: 0.75rem; --radius-xl: 1rem; --radius-full: 9999px;

  /* حركات */
  --duration-fast: 150ms; --duration-base: 250ms; --duration-slow: 400ms;
  --ease-out: cubic-bezier(0,0,0.2,1); --ease-in-out: cubic-bezier(0.4,0,0.2,1); --ease-spring: cubic-bezier(0.34,1.56,0.64,1);
}
```

[Files]

تعديلات الملفات تشمل إنشاء ملفات CSS جديدة موحدة، حذف الملفات القديمة المتجزئة، وإعادة بناء جميع مكونات وصفحات Astro.

### ملفات جديدة سيتم إنشاؤها

| الملف | الغرض |
|------|------|
| `scripts/migration-audit/audit.mjs` | سكريبت فحص اكتمال الترحيل من git history |
| `scripts/migration-audit/types.ts` | تعريفات أنواع الفحص |
| `src/styles/tokens.css` | (إعادة كتابة كاملة) نظام التوكنز الموحد |
| `src/styles/base.css` | reset + base + typography |
| `src/styles/components.css` | (إعادة كتابة كاملة) كل المكونات المشتركة |
| `src/styles/pages.css` | أنماط الصفحات الفردية الموحدة |
| `src/styles/utilities.css` | أدوات مساعدة موحدة |
| `src/styles/animations.css` | (إعادة كتابة) حركات موحدة |
| `src/styles/kernel.css` | (إعادة كتابة) أنماط kernel |
| `DESIGN.md` | توثيق نظام التصميم الجديد |

### ملفات CSS سيتم حذفها (بعد دمج محتواها)

| الملف | المصير |
|------|------|
| `src/styles/home.css` (428 سطر) | → يدمج في `pages.css` |
| `src/styles/home-redesign.css` (889 سطر) | → يدمج في `pages.css` |
| `src/styles/design-system.css` (820 سطر) | → يدمج في `components.css` + `tokens.css` |
| `src/styles/content-pages.css` (1009 سطر) | → يدمج في `pages.css` |
| `src/styles/inner-pages.css` (437 سطر) | → يدمج في `pages.css` |
| `src/styles/layout.css` (183 سطر) | → يدمج في `base.css` + `utilities.css` |
| `src/styles/mobile.css` (274 سطر) | → يدمج responsive inline في كل ملف |
| `src/styles/legal-pages.css` (82 سطر) | → يدمج في `pages.css` |
| `src/styles/global.css` (314 سطر) | → يدمج في `base.css` |

### ملفات Astro سيتم تعديلها (إعادة بناء التصميم)

**التخطيطات (2):**
- `src/layouts/BaseLayout.astro` — تحديث استيراد CSS من 13 ملف إلى 7
- `src/layouts/KernelLayout.astro` — تحديث التصميم

**المكونات المشتركة (11):**
- `src/components/Header.astro` — إعادة بناء التصميم مع الحفاظ على منطق dropdown
- `src/components/Footer.astro` — إعادة بناء بـ CSS Grid الموحد
- `src/components/MobileNav.astro` — إعادة بناء التصميم
- `src/components/SplitHero.astro` — إعادة بناء التصميم
- `src/components/SolutionCard.astro` — إعادة بناء بالأصناف الموحدة
- `src/components/SectorCard.astro` — إعادة بناء بالأصناف الموحدة
- `src/components/RelatedLinks.astro` — إعادة بناء
- `src/components/WhatsAppCTA.astro` — إعادة بناء
- `src/components/CookieConsent.astro` — إعادة بناء
- `src/components/SEOHead.astro` — لا تغيير (منطق فقط)
- `src/components/DottedBackground.astro` — إعادة بناء

**مكونات kernel (8):**
- `src/components/kernel/KernelBadge.astro`
- `src/components/kernel/KernelMetric.astro`
- `src/components/kernel/KernelPageHeader.astro`
- `src/components/kernel/KernelSeoSection.astro`
- `src/components/kernel/KernelContextLinks.astro`
- `src/components/kernel/KernelStatCard.astro`
- `src/components/kernel/KernelTable.astro`
- `src/components/kernel/KernelLoadingState.astro`

**مكونات mockup (4):**
- `src/components/LiveDashboardMockup.astro`
- `src/components/EvidenceFileMockup.astro`
- `src/components/ComplianceRadar.astro`
- `src/components/ActivityStream.astro`

**الصفحات (36 صفحة):**
- `src/pages/index.astro` — الصفحة الرئيسية (671 سطر، الأهم)
- `src/pages/solutions/index.astro` + `[slug].astro` + `[sector].astro` + `[sector]/[city].astro`
- `src/pages/about/index.astro`
- `src/pages/pricing/index.astro`
- `src/pages/services/index.astro`
- `src/pages/trust/index.astro`
- `src/pages/contact/index.astro`
- `src/pages/demo/index.astro`
- `src/pages/blog/index.astro` + `[...slug].astro`
- `src/pages/docs/index.astro` + `[...slug].astro`
- `src/pages/hub/index.astro` + `[slug].astro`
- `src/pages/kernel/index.astro` + `[slug].astro` + `offline.astro`
- `src/pages/assessment/ai-governance-readiness/index.astro`
- `src/pages/authors/[slug].astro`
- الصفحات القانونية (12 صفحة): cookie-policy, data-processing-agreement, pdpl-statement, privacy-cookies, privacy-policy, terms + نسخ en/
- `src/pages/404.astro`
- `src/pages/offline/index.astro`
- `src/pages/sitemap/index.astro`

### ملفات سيتم حذفها
- `src/components/legacy/` — 13 مكون غير مستخدم

[Functions]

دوال جديدة للتحقق من الترحيل، وتعديلات على دوال/أقسام موجودة في التخطيطات والصفحات.

### دوال جديدة

| الدالة | التوقيع | الملف | الغرض |
|--------|---------|------|------|
| `auditMigration` | `() => Promise<MigrationAuditResult[]>` | `scripts/migration-audit/audit.mjs` | فحص شامل لكل صفحة مقابل HTML الأصلي |
| `extractHtmlSections` | `(html: string) => string[]` | `scripts/migration-audit/audit.mjs` | استخراج أقسام HTML للمقارنة |
| `compareContent` | `(htmlSections: string[], astroContent: string) => {coverage: number, missing: string[]}` | `scripts/migration-audit/audit.mjs` | مقارنة المحتوى حرفياً |
| `checkLinks` | `(pagePath: string) => Promise<BrokenLink[]>` | `scripts/migration-audit/audit.mjs` | فحص الروابط الداخلية والخارجية |
| `generateAuditReport` | `(results: MigrationAuditResult[]) => string` | `scripts/migration-audit/audit.mjs` | توليد تقرير Markdown |

### دوال/أقسام سيتم تعديلها

| الموقع | التغيير المطلوب |
|--------|-----------------|
| `BaseLayout.astro` → `<style is:global>` | استبدال بـ `import` موحد للـ CSS الجديد (7 ملفات) |
| `index.astro` → `<style is:global>` مع `@import` | حذف، الاعتماد على CSS الموحد |
| كل صفحة → scoped styles | توحيد استخدام التوكنز الجديدة (`var(--brand-500)` بدلاً من `#06b6d4`) |
| `Header.astro` → dropdown logic | إعادة بناء التصميم مع الحفاظ على المنطق (NAV, CTA_NAV) |
| `Footer.astro` → grid layout | إعادة بناء بالـ CSS Grid الموحد |
| `SplitHero.astro` → React island | إعادة بناء التصميم مع الحفاظ على SparklesCore |

[Classes]

أصناف CSS جديدة موحدة تستبدل كل الأصناف المتعارضة في الملفات القديمة.

### أصناف CSS جديدة موحدة

```css
/* أزرار */
.btn { /* base: padding, radius, transition, font */ }
.btn--primary { background: var(--interactive-primary); color: var(--text-inverse); }
.btn--secondary { background: var(--bg-elevated); border: 1px solid var(--border-default); color: var(--text-primary); }
.btn--ghost { background: transparent; border: 1px solid var(--border-subtle); color: var(--text-secondary); }
.btn--icon { /* icon-only button */ }

/* بطاقات */
.card { background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); }
.card--glass { backdrop-filter: blur(12px); background: rgba(15,21,37,0.6); }
.card--solid { background: var(--bg-elevated); }
.card--feature { /* feature card with icon */ }
.card--stat { /* stat card with number */ }

/* أقسام */
.section { padding: var(--space-16) 0; }
.section--alt { background: var(--bg-surface); }
.section__header { text-align: center; margin-bottom: var(--space-12); }
.section__title { font-size: var(--text-3xl); font-weight: 700; }

/* تخطيط */
.container { width: 100%; max-width: 1200px; margin: 0 auto; padding: 0 var(--space-6); }
.grid { display: grid; gap: var(--space-6); }
.grid--2 { grid-template-columns: repeat(2, 1fr); }
.grid--3 { grid-template-columns: repeat(3, 1fr); }
.grid--4 { grid-template-columns: repeat(4, 1fr); }

/* تنقل */
.nav { display: flex; align-items: center; gap: var(--space-6); }
.nav__item { /* nav link */ }
.nav__dropdown { /* dropdown menu */ }

/* شارات */
.badge { display: inline-flex; padding: var(--space-1) var(--space-3); border-radius: var(--radius-full); }
.badge--brand { background: rgba(6,182,212,0.15); color: var(--brand-300); }
.badge--accent { background: rgba(34,197,94,0.15); color: var(--accent-300); }
.badge--neutral { background: var(--bg-elevated); color: var(--text-secondary); }

/* نماذج */
.form { display: flex; flex-direction: column; gap: var(--space-4); }
.form__field { display: flex; flex-direction: column; gap: var(--space-2); }
.form__input { background: var(--bg-elevated); border: 1px solid var(--border-default); border-radius: var(--radius-md); }
.form__label { color: var(--text-secondary); font-size: var(--text-sm); }

/* صفحات داخلية */
.page-hero { padding: var(--space-16) 0; text-align: center; }
.page-content { padding: var(--space-12) 0; }
.page-cta { padding: var(--space-16) 0; text-align: center; }
```

### أصناف CSS سيتم إزالتها
- كل الأصناف المكررة في `home.css` + `home-redesign.css` (مثل `.hero`, `.hero-section` المتعارضة)
- أصناف `design-system.css` المتعارضة مع `components.css`
- أصناف Tailwind المختلطة عشوائياً (مثل `text-white`, `bg-cyan-500`) — تُستبدل بأصناف موحدة

[Dependencies]

لا توجد حزم جديدة مطلوبة. المشروع يستخدم حالياً: `astro` ^6.4.6، `@astrojs/react` ^6.0.0، `@astrojs/sitemap` ^3.7.3، `tailwindcss` ^3.4.1.

### التغييرات في التبعيات
- **تقليل الاعتماد على Tailwind**: استبدال معظم فئات Tailwind بأصناف CSS موحدة مبنية على التوكنز
- **الاحتفاظ بـ Tailwind config**: لكن تقليل الاستخدام للـ utilities فقط (مثل `sr-only`, `hidden`)
- لا توجد حزم npm جديدة مطلوبة

[Testing]

استراتيجية اختبار شاملة تشمل البناء، الترحيل، الفحص البصري، الروابط، والاستجابة.

### استراتيجية الاختبار

1. **اختبار البناء**: `npm run build` يجب أن ينجح بدون أخطاء بعد كل مرحلة
2. **اختبار الترحيل**: السكريبت `scripts/migration-audit/audit.mjs` يولّد تقرير يوضح نسبة الاكتمال لكل صفحة (هدف: ≥95%)
3. **اختبار بصري**: استخدام Playwright MCP لأخذ لقطات شاشة لكل صفحة على desktop (1280×720) وموبايل (375×667)
4. **اختبار الروابط**: فحص أن جميع الروابط الداخلية تعمل (لا 404)
5. **اختبار الاستجابة**: فحص التصميم على أحجام: 375px, 768px, 1024px, 1280px

### ملفات الاختبار
- `scripts/migration-audit/audit.mjs` — سكريبت الفحص
- تشغيل `npm run build` بعد كل مرحلة رئيسية
- استخدام Playwright MCP tools للفحص البصري

[Implementation Order]

تسلسل التنفيذ المنطقي لتقليل التعارضات وضمان التكامل الناجح.

### المرحلة 1: التحقق من الترحيل (Audit)
1. إنشاء سكريبت فحص الترحيل (`scripts/migration-audit/audit.mjs`)
2. استخراج HTML الأصلي من git history (commit `eaadccc7~1`)
3. تشغيل الفحص على كل صفحة Astro (36 صفحة)
4. توليد تقرير بالمحتوى المفقود أو الناقص
5. إصلاح أي محتوى مفقود قبل إعادة التصميم

### المرحلة 2: بناء نظام التصميم الجديد
6. كتابة `DESIGN.md` (توثيق النظام الكامل)
7. إعادة كتابة `src/styles/tokens.css` (التوكنز الموحدة)
8. إنشاء `src/styles/base.css` (reset + base + typography)
9. إنشاء `src/styles/components.css` (كل المكونات المشتركة)
10. إنشاء `src/styles/pages.css` (أنماط الصفحات)
11. إنشاء `src/styles/utilities.css` (أدوات مساعدة)
12. إعادة كتابة `src/styles/animations.css`
13. إعادة كتابة `src/styles/kernel.css`
14. حذف ملفات CSS القديمة المدمجة (9 ملفات)

### المرحلة 3: إعادة بناء المكونات المشتركة
15. إعادة بناء `BaseLayout.astro` (تحديث استيراد CSS)
16. إعادة بناء `Header.astro` + `MobileNav.astro`
17. إعادة بناء `Footer.astro`
18. إعادة بناء `SplitHero.astro`
19. إعادة بناء `SolutionCard.astro` + `SectorCard.astro` + `RelatedLinks.astro`
20. إعادة بناء `WhatsAppCTA.astro` + `CookieConsent.astro` + `DottedBackground.astro`
21. إعادة بناء مكونات kernel (8 مكونات)
22. إعادة بناء مكونات mockup (4 مكونات)
23. حذف `src/components/legacy/`

### المرحلة 4: إعادة بناء الصفحات
24. إعادة بناء `src/pages/index.astro` (الصفحة الرئيسية — الأهم)
25. إعادة بناء صفحات الحلول (4 صفحات)
26. إعادة بناء `about` + `pricing` + `services` + `trust`
27. إعادة بناء `contact` + `demo`
28. إعادة بناء `blog` (index + [slug])
29. إعادة بناء `docs` (index + [slug])
30. إعادة بناء `hub` (index + [slug])
31. إعادة بناء `kernel` (index + [slug] + offline)
32. إعادة بناء `assessment` + `authors`
33. إعادة بناء الصفحات القانونية (12 صفحة)
34. إعادة بناء `404` + `offline` + `sitemap`

### المرحلة 5: التحقق والاختبار النهائي
35. تشغيل `npm run build` والتأكد من النجاح
36. فحص بصري بـ Playwright لكل الصفحات
37. فحص الروابط الداخلية
38. فحص الاستجابة على الجوال
39. توليد تقرير نهائي
```

---

هذا هو محتوى ملف `implementation_plan.md` كاملاً. للبدء بتنفيذ المهمة خطوة بخطوة، الرجاء **التبديل إلى Act mode**.