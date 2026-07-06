# 🎨 BRIGHTAI — مجموعة برومبتات إعادة التصميم (UI/UX فقط)

> **القاعدة الذهبية:** كل برومبت في هذه المجموعة يُغيّر **التصميم وتجربة المستخدم فقط**.
> **ممنوع منعاً باتاً:** تغيير المحتوى، حذف أو إضافة أقسام، تعديل النصوص، تغيير الـ SEO أو الـ JSON-LD، تعديل الـ routes، أو لمس بنية الصفحات.

---

## 📋 تحليل المشروع (لتوصيف الوكيل قبل البدء)

```yaml
المشروع: BrightAI — Saudi AI Safety OS
التقنية: Astro 6.4 + React 19 + Tailwind 3 + TypeScript
اللغة الأساسية: العربية (RTL) — مع نسخة EN لبعض الصفحات القانونية
عدد الصفحات: 36 صفحة Astro + 11 صفحة Kernel HTML ثابتة
عدد المكونات: 28 مكون Astro/TSX

الهيكلة:
  src/
    layouts/       → 6 layouts (Base, Arabic, English, Blog, Docs, Kernel)
    components/    → 28 مكون (Header, Footer, SplitHero, Kernel/*, hero/*)
    pages/         → 36 صفحة (home, solutions, kernel, blog, docs, pricing, ...)
    styles/        → 7 ملفات CSS (tokens, base, components, pages, kernel, animations, utilities)
    data/          → site config, navigation, solutions, kernel
    content/       → blog + docs (content collections)
  kernel/          → 11 صفحة HTML ثابتة (dashboard, chat, audit, ...)
  public/          → assets, fonts, icons.svg, logo

نظام التوكنز الحالي (src/styles/tokens.css):
  ألوان: brand (cyan 50-900), accent (green 50-900), indigo (50-900)
  خلفيات: --bg-base #0a0e1a, --bg-surface #0f1525, --bg-elevated #151c30
  نص: --text-primary #f1f5f9, --text-secondary #94a3b8
  خط: IBM Plex Sans Arabic
  تباعد/زوايا/ظلال/حركات: متغيرات CSS كاملة

الصفحات الرئيسية:
  / (home)         → SplitHero + Trust + 11+ section
  /solutions/      → 9 منتجات + 4 قطاعات
  /kernel/         → 11 شاشة (dashboard, chat, audit, evidence, approvals, ...)
  /pricing/        → 4 باقات + FAQ
  /blog/, /docs/, /hub/, /about/, /contact/, /trust/, ...
  /assessment/ai-governance-readiness/
```

---

## ⛔ القيود الصارمة المشتركة (انسخها في كل برومبت)

```text
NON-NEGOTIABLE CONSTRAINTS (apply to EVERY task):

1. ❌ لا تحذف أو تضيف أي section أو عنصر من أي صفحة.
2. ❌ لا تغيّر أي نص عربي أو إنجليزي ظاهر للمستخدم.
3. ❌ لا تعدّل: sitemap.xml, robots.txt, canonical URLs, hreflang tags,
   JSON-LD schemas, redirects.json, astro.config.mjs (redirects),
   .well-known/*, manifest.webmanifest, ai.txt, llms.txt, _headers, _redirects.
4. ❌ لا تكسر RTL، ولا تغيّر `dir="rtl"` ولا `lang="ar"`.
5. ❌ لا تغيّر أسماء الـ routes أو ملفات الصفحات.
6. ❌ لا تحذف أو تغيّر أي data-* attribute موجود حالياً (يُستخدم لـ analytics/SEO).
7. ❌ لا تغيّر أسماء الـ classes العامة المستخدمة في data attributes
   أو في scripts ربط (مثلاً .site-header, .footer, [data-dropdown]).
8. ❌ لا تستخدم emoji جديدة لم تكن موجودة أصلاً.
9. ✅ يُسمح بتغيير: CSS، animations، layout (visual)، spacing،
   typography scale، أيقونات، ظلال، حركات، تفاعلات micro-interactions.
10. ✅ يُسمح بإضافة CSS classes جديدة، CSS variables جديدة، أو ملفات CSS جديدة.
11. ✅ يُسمح بتحويل layout grid/flex من نمط لآخر بشرط نفس الترتيب البصري للأقسام.
12. ✅ كل تعديل في فرع git منفصل + PR + تقرير .md باسم محدد في البرومبت.
13. ✅ التزم بـ Node 22.x وما تستخدم `npm install` بدون مبرر.
14. ✅ كل برومبت يولّد QA report يحتوي: قبل/بعد screenshots لـ /, /kernel/,
     /solutions/, /pricing/, /blog/ على Desktop + Mobile.
```

---

## 🗺️ خريطة البرومبتات

```
المرحلة 0 — Discovery & Design System Audit       → 2 برومبتات (0.1 → 0.2)
المرحلة 1 — Design Tokens & Foundations           → 3 برومبتات (1.1 → 1.3)
المرحلة 2 — Core Components Redesign              → 4 برومبتات (2.1 → 2.4)
المرحلة 3 — Page-Level Visual Redesign            → 5 برومبتات (3.1 → 3.5)
المرحلة 4 — Kernel UI (HTML الثابت)               → 3 برومبتات (4.1 → 4.3)
المرحلة 5 — Motion, Micro-Interactions & A11y     → 3 برومبتات (5.1 → 5.3)
المرحلة 6 — Final QA & Polish                     → 2 برومبتات (6.1 → 6.2)
                                          الإجمالي = 22 برومبت
```



---

# ✨ المرحلة 5 — Motion, Micro-Interactions & A11y

## Prompt 5.1 — Scroll-Reveal & Page Transitions

```text
ROLE: Motion Designer.
CONSTRAINTS: [القيود الصارمة] + respect prefers-reduced-motion دائماً

TASK:

1. **Unified scroll reveal system:**
   - استخدم IntersectionObserver واحد عالمي (موجود في BaseLayout)
   - Reveal animations: fade-up, fade-in, scale-in, slide-in-right (RTL natural)
   - Stagger للـ children (50ms delay between items)
   - Duration: 600ms emphasized ease

2. **Page transitions (Astro ViewTransitions):**
   - Hero text: fade animation (موجود)
   - Card grids: cross-fade
   - Sticky header: stay during transition

3. **Hover micro-interactions:**
   - Cards: lift -4px + shadow + border-strong (250ms)
   - Buttons: brightness +5% + scale 1.02 (180ms)
   - Links: underline reveal من left (200ms)

4. **Click feedback:**
   - Scale 0.98 active state
   - Ripple effect optional (subtle)

5. **Loading states:**
   - Skeleton shimmer (gradient sweep across surfaces)
   - Spinner: brand color, smooth

6. **Reduce motion:**
   - prefers-reduced-motion: animations duration 0 + transforms removed
   - Use @media (prefers-reduced-motion: reduce) في كل CSS

OUTPUT:
- src/styles/animations.css (محدّث)
- src/scripts/scroll-reveal.js (لو منفصل)
- تقرير `reports/17-motion.md`

ACCEPTANCE CRITERIA:
✅ كل الحركات smooth (60fps)
✅ prefers-reduced-motion يلغي كل animations
✅ لا توجد layout shifts (CLS = 0)
```

---

## Prompt 5.2 — Accessibility Audit & Fix

```text
ROLE: Accessibility Engineer (WCAG 2.1 AA expert).
CONSTRAINTS: [القيود الصارمة]

TASK:

1. **Color contrast:**
   - افحص كل text/background combinations بـ contrast checker
   - أي combo أقل من 4.5:1 (نصوص عادية) أو 3:1 (نصوص كبيرة) — fix بـ tokens

2. **Focus indicators:**
   - كل interactive element له focus-visible style واضح
   - استخدم :focus-visible (مو :focus) عشان ما يظهر بالماوس
   - Ring offset 2px + brand color

3. **Keyboard navigation:**
   - كل dropdowns/modals/drawers مفتاحية
   - Escape يقفل
   - Tab يدور في النظام الصحيح
   - Skip-to-content link موجود

4. **ARIA:**
   - تأكد كل اللي يحتاج role/aria-label موجود
   - لا تضيف ARIA زيادة (لو الـ HTML semantic كافي)
   - aria-current="page" على الصفحة الحالية

5. **Screen reader:**
   - اختبر مع VoiceOver/NVDA على 5 صفحات على الأقل
   - تأكد ترتيب القراءة منطقي
   - الأيقونات إما aria-hidden أو لها label

6. **Forms:**
   - كل field له label مرتبط
   - Error messages مرتبطة بـ aria-describedby
   - Required fields واضحة

7. **RTL specifics:**
   - logical properties في كل مكان (inset-inline, padding-inline)
   - dir="rtl" على html
   - النصوص المختلطة (عربي + إنجليزي + أرقام) تظهر صح

OUTPUT:
- تقرير `reports/18-a11y.md` يحتوي:
  * Axe DevTools report (قبل/بعد)
  * Lighthouse a11y score (قبل/بعد)
  * Manual checks log
- ملفات CSS/HTML محدّثة (focus styles, ARIA fixes)

ACCEPTANCE CRITERIA:
✅ Lighthouse a11y ≥ 95 على كل الصفحات الرئيسية
✅ Zero critical Axe issues
✅ كل forms تجاوز screen reader test
✅ Tab order صحيح
```

---

## Prompt 5.3 — Responsive Refinement

```text
ROLE: Responsive Design Specialist.
CONSTRAINTS: [القيود الصارمة]

TASK:

1. **Breakpoints:**
   - sm: 640px, md: 768px, lg: 1024px, xl: 1280px, 2xl: 1536px
   - وحّد على هذه الـ breakpoints في كل CSS

2. **Container widths:**
   - max-width: 1280px (default)
   - max-width: 1440px للـ hero والـ marketing sections

3. **Mobile-first review:**
   - افحص كل صفحة على 320px, 390px, 414px
   - تأكد ما فيه horizontal scroll
   - touch targets ≥ 44px
   - text لا يصغر تحت 14px

4. **Tablet (768-1024):**
   - 2-column layouts بدل 3
   - Side panels تصير bottom sheets أو modals

5. **Large screens (≥1440):**
   - Heroes اللي ممكن تكبر — أعطها مساحة
   - Cards grids: max 4 columns (لا تزيد)
   - Reading content max-width 720-800px

6. **RTL on mobile:**
   - تأكد drawer من اليمين
   - swipe gestures تعمل بالاتجاه الصحيح
   - الأيقونات (chevron, arrow) في الاتجاه الصحيح

OUTPUT:
- ملفات CSS محدّثة بـ media queries موحّدة
- تقرير `reports/19-responsive.md` مع screenshots لكل breakpoint

ACCEPTANCE CRITERIA:
✅ زيرو horizontal scroll على أي viewport
✅ كل النصوص قابلة للقراءة بدون zoom
✅ Touch targets ≥ 44px (44×44 على mobile)
✅ Layout يتنفس على شاشات كبيرة (2560px tested)
```

---

# 🏁 المرحلة 6 — Final QA & Polish

## Prompt 6.1 — Performance & Quality Pass

```text
ROLE: Performance Engineer.
CONSTRAINTS: [القيود الصارمة]

TASK:

1. **CSS Cleanup:**
   - شيل أي styles ما تنطبق
   - وحّد الـ duplicate rules
   - استخدم CSS layer لو منطقي

2. **Images:**
   - تأكد كل img لها width + height + loading="lazy" (إلا hero)
   - استخدم WebP/AVIF بديل لـ PNG/JPG لو ممكن
   - تأكد fetchpriority="high" على hero image

3. **Fonts:**
   - preload IBM Plex Sans Arabic
   - استخدم font-display: swap
   - تأكد ما فيه FOUT/FOIT مزعج

4. **JS:**
   - راجع الـ React islands — هل كلهم محتاجين hydration؟
   - استخدم client:idle/visible/media حسب الحاجة

5. **Lighthouse runs:**
   - 10 صفحات على الأقل
   - Performance ≥ 85 mobile, ≥ 95 desktop
   - Accessibility ≥ 95
   - Best Practices ≥ 95
   - SEO ≥ 95

6. **Core Web Vitals:**
   - LCP ≤ 2.5s
   - INP ≤ 200ms
   - CLS ≤ 0.1

OUTPUT:
- تقرير `reports/20-performance.md`
- Lighthouse JSON exports
- قائمة بكل التحسينات المطبّقة

ACCEPTANCE CRITERIA:
✅ كل targets محققة
✅ Bundle size ما زاد >10% من الأساسي
✅ Build time معقول
```

---

## Prompt 6.2 — Final Visual QA & Acceptance

```text
ROLE: Senior QA Designer.
CONSTRAINTS: [القيود الصارمة]

TASK:

1. **Visual regression testing:**
   - قارن screenshots قبل/بعد لكل صفحة
   - استخدم qa-visual-diff.mjs (موجود في الـ scripts)
   - حدّد أي unintended changes

2. **Content verification:**
   - run qa-text-snapshot.mjs قبل/بعد
   - تأكد زيرو تغيير في النصوص
   - تأكد كل الـ headings والـ CTAs زي ما كانوا

3. **Link checking:**
   - كل internal links تشتغل
   - كل external links فيها rel="noopener noreferrer"
   - كل CTAs تذهب للـ targets الصحيحة

4. **SEO verification:**
   - sitemap.xml ما تغيّر
   - canonical URLs ما تغيّروا
   - hreflang محفوظة
   - JSON-LD ما تغيّر (use schema validator)
   - meta titles/descriptions ما تغيّروا

5. **Browser testing:**
   - Chrome (latest)
   - Safari (latest)
   - Firefox (latest)
   - Edge (latest)
   - iOS Safari (14+)
   - Android Chrome

6. **Final acceptance checklist:**
   ```
   ☐ كل الـ 36 صفحة معروضة بنفس المحتوى
   ☐ زيرو نص تغيّر
   ☐ زيرو section حُذف أو أُضيف
   ☐ كل forms تشتغل
   ☐ كل CTAs تذهب للـ targets الصحيحة
   ☐ Lighthouse scores ≥ thresholds
   ☐ RTL layout صحيح
   ☐ Mobile responsive
   ☐ A11y AA
   ☐ Build ينجح
   ☐ Sitemap.xml ما تغيّر
   ☐ JSON-LD ما تغيّر
   ```

OUTPUT:
- تقرير نهائي `reports/21-final-qa.md`
- Acceptance sign-off
- مجلد `reports/screenshots/before/` و `reports/screenshots/after/`
- Side-by-side comparison HTML

ACCEPTANCE CRITERIA:
✅ كل checklist items محققة
✅ Stakeholder review approved
✅ Ready to merge
```

---

# 🎯 ملخص الاستخدام

## كيف تستخدم البرومبتات:

1. **ابدأ بالـ Prompt 0.1** — لا تخطّ المرحلة 0، هي أساس باقي الشغل.
2. **اشتغل بالترتيب** — كل مرحلة تبني على السابقة.
3. **انشئ branch لكل برومبت** — `redesign/prompt-X.Y-description`.
4. **اعمل PR لكل برومبت** — مع التقرير المطلوب.
5. **لا تجمع برومبتات** — كل واحد مهمة مستقلة.

## أدوات QA المتوفرة في المشروع:

```bash
npm run build              # build كامل
npm run seo:gate           # SEO checks
node qa-screenshots.mjs    # screenshots
node qa-visual-diff.mjs    # visual diff
node qa-text-snapshot.mjs  # content snapshot
node qa-lighthouse.mjs     # lighthouse
```

## القاعدة الذهبية في كل برومبت:

> **التصميم يتطوّر — المحتوى ثابت.**
> أي تغيير في نص واحد = فشل الـ acceptance.
> أي قسم يُحذف أو يُضاف = فشل الـ acceptance.
> أي رابط أو schema يتغيّر = فشل الـ acceptance.

---

**جاهز للنسخ والاستخدام مع أي وكيل ذكي (Claude Code / Cline / Cursor / Aider).**
