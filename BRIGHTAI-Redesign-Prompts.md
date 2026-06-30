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

## Prompt 0.2 — اختيار اتجاه التصميم (Design Direction Proposal)

```text
ROLE:
أنت Design Lead لمشروع SaaS تنفيذي (Enterprise B2B) موجّه للسوق السعودي.

CONSTRAINTS:
[انسخ القيود الصارمة المشتركة]

CONTEXT:
- المشروع: BrightAI — منصة حوكمة AI للشركات السعودية
- الجمهور: CIO, CISO, Compliance Officers, IT Directors في بنوك ومستشفيات وحكومة
- النبرة المطلوبة: ثقة، أمان، احترافية، سعودية حديثة
- الموقع حالياً Dark theme — يجب أن يبقى dark
- اللون الأساسي حالياً Cyan (#06b6d4) — يمكن تطويره

TASK:
اقترح 3 اتجاهات تصميمية (Design Directions)، كل واحد يحدد:

1. **Mood & Personality**
   - 3-5 كلمات تصف الإحساس
   - inspiration references (Stripe, Linear, Vercel, Anthropic, etc.)

2. **Color System**
   - Primary brand color (Cyan أو بديل أعمق/أرقى)
   - Secondary accent
   - Neutral scale (5+ درجات للأسود/الرمادي)
   - Semantic colors (success/warning/danger/info)
   - Surface layers (base/elevated/overlay)

3. **Typography**
   - Display font (للعناوين الكبيرة) — يجب أن يكون عربي ممتاز
   - Body font (IBM Plex Sans Arabic ثابت)
   - Type scale (modular: 1.125 أو 1.250)
   - أوزان مقترحة

4. **Surface Treatment**
   - Glass morphism vs flat
   - Border treatment (subtle vs sharp)
   - Shadow philosophy
   - Radius scale

5. **Motion Philosophy**
   - Ease curves
   - Duration scale
   - Micro-interaction style (snappy/smooth/spring)

OUTPUT:
- ملف `reports/01-design-directions.md`
- لكل اتجاه: moodboard (روابط/صور) + color swatches + type sample + mock card
- توصية نهائية مع justification

ACCEPTANCE CRITERIA:
✅ 3 اتجاهات متمايزة فعلاً (مو variants من نفس الفكرة)
✅ كل اتجاه يحترم: RTL، Dark mode، Enterprise B2B feel
✅ التوصية النهائية مدعومة بـ rationale تجاري + بصري
```

---

# 🎨 المرحلة 1 — Design Tokens & Foundations

## Prompt 1.1 — تحديث Design Tokens

```text
ROLE:
أنت Senior Design Systems Engineer.

CONSTRAINTS:
[القيود الصارمة + لا تحذف أي token موجود حالياً — فقط أضف/طوّر]

CONTEXT:
الملف الحالي: src/styles/tokens.css
يحتوي على 15 مجموعة tokens (ألوان brand/accent/indigo، خلفيات، نصوص، حدود، تفاعلية، حالات، تباعد، خطوط، أحجام، أوزان، ارتفاع سطر، زوايا، ظلال، حركات).

التوجيه التصميمي المعتمد: [من Prompt 0.2 — أرفق الاتجاه المختار]

TASK:
1. حدّث `src/styles/tokens.css` بالتالي:

   a) **Color Refinement**
      - حسّن السلم اللوني للـ brand ليكون أكثر deep & professional
      - أضف neutrals scale موسّع (50-950)
      - أضف tokens جديدة لـ:
        * --surface-1, --surface-2, --surface-3 (طبقات سطح متدرجة)
        * --border-faint, --border-soft, --border-strong, --border-bold
        * --overlay-light, --overlay-medium, --overlay-heavy

   b) **Typography Scale**
      - أضف modular scale (1.125 minor third أو 1.200):
        --text-2xs, --text-xs, --text-sm, --text-base, --text-md,
        --text-lg, --text-xl, --text-2xl, --text-3xl, --text-4xl, --text-5xl, --text-6xl, --text-7xl
      - أضف tracking tokens:
        --tracking-tight, --tracking-normal, --tracking-wide
      - أضف font-feature-settings للأرقام العربية والإنجليزية المختلطة

   c) **Spacing**
      - وحّد على سلم 4px أساس
      - أضف space-0, space-px, space-0-5 ... space-32

   d) **Radius**
      - أضف --radius-3xl, --radius-4xl للبطاقات الكبيرة

   e) **Shadow System**
      - استبدل/أضف نظام ظلال جديد بـ 3 layers (ambient + key + spread)
      - أضف --shadow-glow-brand, --shadow-glow-accent, --shadow-glow-danger
      - أضف --shadow-inset-* لـ pressed states

   f) **Motion**
      - أضف ease curves جديدة: --ease-emphasized, --ease-decelerated, --ease-accelerated
      - أضف durations: --duration-instant (75ms), --duration-snappy (180ms)

2. ✅ احتفظ بكل الـ aliases الموجودة (--surface, --text, --brand, ...) — لا تكسر الـ legacy compatibility.

3. أضف ملف جديد `src/styles/tokens-v2-doc.md` يوثّق كل token جديد + مثال استخدام.

OUTPUT:
- src/styles/tokens.css (محدّث)
- src/styles/tokens-v2-doc.md (جديد)
- تقرير `reports/02-tokens-update.md` يوضح:
  * Diff كامل (tokens مضافة، tokens محدّثة، tokens محتفظ بها)
  * Visual comparison لـ color/shadow/type samples

ACCEPTANCE CRITERIA:
✅ زيرو removal لأي token قديم
✅ Build ينجح بدون أخطاء (npm run build)
✅ كل الصفحات لا تزال تعرض نفس المحتوى بنفس الترتيب
✅ التقرير يحتوي before/after لـ design-tokens.html (يمكن إنشاء صفحة عرض tokens داخلية)
```

---

## Prompt 1.2 — Typography Refinement

```text
ROLE:
أنت Typography Specialist مع خبرة في الخط العربي والـ Bi-directional layouts.

CONSTRAINTS:
[القيود الصارمة]
+ ❌ لا تغيّر النصوص العربية ولا الإنجليزية
+ ❌ لا تستبدل IBM Plex Sans Arabic كخط أساسي
+ ✅ يمكن إضافة display font ثانوي للعناوين الضخمة فقط

TASK:
1. حدّث `src/styles/base.css` للـ typography:

   a) Heading hierarchy واضح:
      - h1: 3.5rem → 4.5rem (clamp مع viewport)
      - h2: 2.25rem → 3rem
      - h3: 1.75rem → 2.25rem
      - h4: 1.375rem → 1.5rem
      - استخدم font-weight: 800 للـ h1/h2 (extrabold) و 700 لـ h3/h4

   b) Body text:
      - line-height للنصوص العربية: 1.75 (relaxed) — العربي يحتاج تنفس أكثر
      - tracking-tight للعناوين الكبيرة (-0.02em)
      - tracking-normal للنصوص

   c) أرقام Tabular:
      - أضف utility class `.tabular-nums` بـ font-feature-settings: 'tnum'
      - استخدمها في dashboards/stats/pricing

   d) Lead paragraphs:
      - class جديد `.lead` بـ font-size lg + line-height relaxed + color secondary

   e) أحجام للأقسام المختلفة:
      - .section__title (3xl)
      - .section__eyebrow (sm + uppercase + tracking-wide + brand-color)
      - .section__subtitle (lg + secondary)

2. حدّث `src/components/SplitHero.astro` للعناوين فقط (CSS classes — لا تغيّر النصوص):
   - h1 يصبح بـ display-style أكبر مع clamp responsive
   - تحسين الـ gradient-text (smoother stops)

3. أنشئ صفحة عرض داخلية `src/pages/design/typography.astro` (لا تظهر في sitemap)
   تعرض كل المستويات والأوزان للمراجعة.

OUTPUT:
- src/styles/base.css (محدّث)
- src/styles/components.css (إضافة .lead, .section__eyebrow, .tabular-nums)
- src/pages/design/typography.astro (جديد — internal preview)
- تقرير `reports/03-typography.md` + screenshots

ACCEPTANCE CRITERIA:
✅ كل النصوص قابلة للقراءة بوضوح على RTL
✅ Heading hierarchy متباين بصرياً (≥1.25× بين كل مستوى)
✅ ما تغيّر ولا نص واحد في أي صفحة
✅ صفحة /design/typography تعرض كل الأنماط
```

---

## Prompt 1.3 — Color System Application

```text
ROLE:
أنت Visual Designer مع تركيز على Dark Mode UI.

CONSTRAINTS:
[القيود الصارمة]

TASK:
طبّق الـ color tokens الجديدة على المكونات الأساسية:

1. **Backgrounds (طبقات السطح):**
   - body: --bg-base
   - .section--alt: --surface-1
   - بطاقات elevated: --surface-2
   - بطاقات على بطاقات: --surface-3
   - overlays/modals: --bg-overlay مع backdrop-blur

2. **Borders:**
   - حدود البطاقات العادية: --border-soft
   - الـ hover state: --border-strong
   - الـ focus state: --border-brand (cyan)

3. **Brand Color Usage Rules:**
   - استخدم cyan-500 للـ CTAs الرئيسية فقط
   - cyan-400 للـ links + accents
   - cyan-300 للـ subtle highlights
   - cyan-200/100 لـ glow effects فقط

4. **Status Colors (محافظة على المعنى):**
   - success (green): فقط للـ confirmations + compliance pass
   - warning (amber): tier 2 risks
   - danger (red): tier 3 risks + blocking actions
   - info (indigo): informational tips

5. أنشئ ملف `src/styles/color-usage.css` يحتوي على utility classes:
   - .surface-1, .surface-2, .surface-3
   - .border-soft, .border-strong, .border-brand
   - .text-brand, .text-accent, .text-success, .text-danger
   - .bg-brand-glow, .bg-accent-glow

6. حدّث `src/styles/components.css`:
   - .card → استخدم --surface-2 + --border-soft
   - .card--feature → نفس الشي مع hover state
   - .chip → خلفية brand-soft + border brand
   - .btn--primary → background brand-500, hover brand-400

OUTPUT:
- src/styles/color-usage.css (جديد)
- src/styles/components.css (محدّث)
- صفحة /design/colors.astro (internal preview)
- تقرير `reports/04-colors.md` + screenshots before/after

ACCEPTANCE CRITERIA:
✅ كل البطاقات في الموقع تستخدم نظام الـ surface layers
✅ لا يوجد لون مكتوب يدوياً (hex) في أي مكون — كله tokens
✅ Contrast ratio AA على الأقل لكل combination
✅ كل الصفحات تعرض نفس المحتوى بترتيبه
```

---

# 🧩 المرحلة 2 — Core Components Redesign

## Prompt 2.1 — Header & Navigation Redesign

```text
ROLE:
أنت Senior UI Engineer + Interaction Designer.

CONSTRAINTS:
[القيود الصارمة]
+ ❌ لا تغيّر هيكل NAV في src/data/navigation.ts
+ ❌ لا تغيّر أي href أو label أو labelAr
+ ❌ لا تحذف WhatsApp CTA أو Demo CTA
+ ❌ احتفظ بـ accessibility (aria-labels, role, keyboard nav)
+ ✅ يمكن تغيير: visual style, dropdown animation, spacing, hover states

TARGET FILE: src/components/Header.astro + src/styles/components.css (.site-header__*)

TASK:
1. **Visual Refinement:**
   - Glass blur محسّن: backdrop-filter: saturate(180%) blur(20px)
   - Border bottom subtle: 1px solid rgba(255,255,255,0.06)
   - Padding أكثر تنفس: padding-block 16px → 20px
   - Logo size: 36px → 32px مع spacing أحسن من النص

2. **Nav Links:**
   - Active state يستخدم indicator أسفل الرابط (2px line cyan) بدل background
   - Hover: subtle background + color shift smooth (200ms)
   - Dropdown trigger: chevron يدور 180deg عند الفتح

3. **Dropdown Panel Redesign:**
   - Width أوسع للمحتوى المجمّع (650-720px)
   - Grouped sections: عناوين group بـ uppercase + tracking-wide + smaller font
   - كل link داخل grid: icon (placeholder من /icons.svg) + label + description (لو موجودة)
   - Animation: scale(0.98) + opacity 0 → scale(1) + opacity 1 (180ms emphasized ease)
   - Backdrop: light blur خلف الـ dropdown

4. **CTAs (في أقصى يسار الـ header للـ RTL):**
   - WhatsApp button: outline style أنحف + green accent
   - "Book Demo" CTA: solid brand مع glow subtle عند hover
   - Spacing بين CTAs: 12px

5. **Mobile Behavior:**
   - Hamburger icon أنظف
   - MobileNav.astro panel: full-height drawer من اليمين (RTL natural)
   - Animation: translate-x slide

6. **Scroll Behavior:**
   - عند scroll > 20px: header يصير أصغر شوي + shadow أعمق
   - استخدم IntersectionObserver أو scrollY listener

OUTPUT:
- src/components/Header.astro (محدّث visual فقط)
- src/components/MobileNav.astro (محدّث)
- src/styles/components.css (سكشن .site-header__* محدّث كلياً)
- تقرير `reports/05-header.md` + 4 screenshots (Desktop: closed/dropdown-open، Mobile: closed/drawer-open)

ACCEPTANCE CRITERIA:
✅ كل الروابط لا تزال تشير لنفس الـ URLs
✅ Keyboard navigation شغّال (Tab + Enter + Escape)
✅ ARIA attributes ما تغيّرت
✅ يعمل على Chrome/Safari/Firefox + iOS Safari
✅ Lighthouse a11y score ≥ 95
```

---

## Prompt 2.2 — Footer Redesign

```text
ROLE:
أنت UI Engineer متخصص في معالجة الـ footers الكبيرة للمواقع التنفيذية.

CONSTRAINTS:
[القيود الصارمة]
+ ❌ لا تغيّر أي رابط في FOOTER_NAV
+ ❌ لا تحذف WhatsApp، language switcher، أو الـ legal links
+ ❌ احتفظ بكل الـ branding (logo, tagline, copyright)

TARGET: src/components/Footer.astro + .footer styles في components.css

TASK:
1. **Grid Restructure (visual):**
   - Desktop: 5 columns (Brand wider + 4 nav columns)
   - Tablet: 2 columns
   - Mobile: 1 column مع accordions اختيارية (لو الأقسام كثيرة)

2. **Brand Column:**
   - Logo أكبر شوي + tagline في 2 سطور max
   - WhatsApp CTA: re-styled كزر primary outline مع green icon
   - Language switcher: pill toggle بدل link عادي

3. **Nav Columns:**
   - Heading: uppercase + tracking-wide + size sm + color secondary
   - Links: spacing بينها 12px + hover state (color shift + slight underline)
   - عدد الـ links لو طويل: max-height مع overflow أو split

4. **Bottom Bar:**
   - Separator خفيف فوقها
   - تحتوي: copyright + legal links + social icons (لو موجودة)
   - Centered على mobile، split على desktop

5. **Visual Polish:**
   - Background: --bg-base أو radial gradient subtle
   - Top border: gradient line cyan→transparent
   - Spacing: padding-block 80px desktop, 48px mobile

OUTPUT:
- src/components/Footer.astro (محدّث)
- src/styles/components.css (.footer styles)
- تقرير `reports/06-footer.md` + screenshots

ACCEPTANCE CRITERIA:
✅ كل الـ FOOTER_NAV.items معروضة
✅ Language switcher يشتغل (لو currentPath له counterpart)
✅ Social/contact info كله محفوظ
```

---

## Prompt 2.3 — Card System Unification

```text
ROLE:
Component Systems Designer.

CONSTRAINTS:
[القيود الصارمة]

CONTEXT:
الموقع فيه أنواع بطاقات متعددة بدون توحيد:
- .card, .card--feature, .card--metric, .card--glass
- .inner-card, .home-stat-card
- .home-kernel-feature-link
- SolutionCard, SectorCard (مكونات React/Astro)

TASK:
وحّد كل البطاقات تحت نظام موحّد:

1. **Base Card (`.card`):**
   ```
   background: var(--surface-2);
   border: 1px solid var(--border-soft);
   border-radius: var(--radius-xl);
   padding: var(--space-6);
   transition: all 250ms var(--ease-emphasized);
   ```

2. **Variants:**
   - `.card--feature`: + icon top + hover lift (-4px translateY) + border-strong on hover
   - `.card--metric`: + large number display + label + trend indicator
   - `.card--glass`: + backdrop-filter blur + bg surface-2/60 + border subtle
   - `.card--gradient`: + subtle gradient border (cyan→indigo) using mask trick
   - `.card--interactive`: + cursor pointer + scale(1.01) on hover + active scale(0.99)

3. **Sizes:**
   - `.card--sm` (padding-4)
   - `.card--md` (padding-6, default)
   - `.card--lg` (padding-8)

4. **Card Anatomy:**
   - `.card__icon` (top, 40-48px container with brand glow)
   - `.card__eyebrow` (uppercase tag/category)
   - `.card__title` (h3 style)
   - `.card__desc` (lead style)
   - `.card__meta` (bottom row: stats, badges, link arrow)
   - `.card__action` (cta link with arrow)

5. **Aliases (legacy compatibility):**
   احتفظ بكل classes القديمة كـ aliases في components.css:
   ```
   .inner-card { @extend .card; }
   .home-stat-card { @extend .card--metric; }
   etc.
   ```

6. حدّث المكونات اللي تستخدم cards:
   - SolutionCard.astro
   - SectorCard.astro
   - أي card inline في pages

   ⚠️ لا تغيّر المحتوى داخل البطاقات — فقط الـ wrapping classes والـ structure إن لزم.

OUTPUT:
- src/styles/components.css (.card system موحّد)
- src/components/SolutionCard.astro (محدّث)
- src/components/SectorCard.astro (محدّث)
- src/pages/design/cards.astro (preview صفحة كل الأنواع)
- تقرير `reports/07-cards.md` + screenshots before/after

ACCEPTANCE CRITERIA:
✅ كل البطاقات على الموقع تستخدم نفس الـ base style
✅ Hover/focus states موحّدة
✅ Legacy class names تظل تعمل (aliases)
✅ ما تغيّر محتوى أي بطاقة
```

---

## Prompt 2.4 — Buttons & Form Inputs

```text
ROLE:
Interaction Designer.

CONSTRAINTS:
[القيود الصارمة]

TASK:
وحّد نظام الأزرار والمدخلات:

1. **Button Variants:**
   - `.btn` base
   - `.btn--primary` (solid brand + glow on hover)
   - `.btn--secondary` (subtle bg + border)
   - `.btn--ghost` (transparent + hover bg)
   - `.btn--outline` (border only)
   - `.btn--whatsapp` (green specific)
   - `.btn--danger`

2. **Button Sizes:**
   - `.btn--sm` (height 36, padding-x 12)
   - `.btn--md` (height 44, padding-x 16) — default
   - `.btn--lg` (height 52, padding-x 24)
   - `.btn--xl` (height 60, padding-x 32) — للـ heroes

3. **Button States:**
   - hover: brightness + slight lift + shadow
   - active: scale(0.98) + shadow reduced
   - disabled: opacity 0.5 + cursor not-allowed
   - loading: spinner inside + disable clicks
   - focus-visible: ring offset 2px brand color

4. **Icon Buttons:**
   - `.btn--icon` (square aspect)
   - دعم icon+label أو icon فقط

5. **Form Inputs:**
   - `.input` base (height 44, padding 12-16, radius md)
   - background: --surface-2
   - border: --border-soft → --border-brand on focus
   - placeholder: --text-muted
   - أحجام (sm/md/lg)
   - أنواع: text, email, tel, textarea
   - error state: border danger + helper text

6. **Form Layout Helpers:**
   - .form-field (wrapper)
   - .form-label
   - .form-helper
   - .form-error

⚠️ لا تغيّر أي form موجود في الـ pages — فقط حدّث الـ styles.
⚠️ لا تغيّر أي action/method لأي form.

OUTPUT:
- src/styles/components.css (sections: buttons + forms محدّثة)
- src/pages/design/buttons.astro (preview)
- src/pages/design/forms.astro (preview)
- تقرير `reports/08-buttons-forms.md`

ACCEPTANCE CRITERIA:
✅ كل الأزرار في الموقع تستخدم النظام الجديد
✅ كل الـ forms تشتغل بدون مشاكل (contact, demo, assessment)
✅ Touch targets ≥ 44px على الـ mobile
```

---

# 📄 المرحلة 3 — Page-Level Visual Redesign

## Prompt 3.1 — Homepage (`/`) Redesign

```text
ROLE:
Senior Product Designer.

CONSTRAINTS:
[القيود الصارمة]
+ ❌ لا تحذف أو تضيف أي قسم (11+ قسم موجودة)
+ ❌ لا تغيّر ترتيب الأقسام
+ ❌ لا تغيّر أي نص أو CTA target
+ ❌ احتفظ بكل JSON-LD schemas
+ ✅ يمكن تطوير visual treatment لكل قسم

TARGET: src/pages/index.astro + src/components/SplitHero.astro + relevant styles

ORDER OF SECTIONS (preserved):
1. SplitHero
2. Trust / Compliance signals
3. ... (راجع index.astro لكل الأقسام)
[N. Footer comes via BaseLayout]

TASK:

### 1. SplitHero refinement:
- استبدل DottedSurface canvas (أو حسّنه): nodes أقل ضوضاء + connections smarter
- العنوان h1: حجم أكبر مع clamp(2.5rem, 5vw, 4.5rem)
- Gradient text: smoother stops (cyan-400 → cyan-200 → white)
- CTAs: استخدام النظام الجديد (.btn--xl)
- Kernel showcase panel (الجانب الأيمن): browser chrome محسّن + animation للـ feature grid (stagger)
- Background beams: أقل تشتيت، أكثر اتجاهاً

### 2. Trust section:
- Badges → استخدم .chip الجديد
- Stat cards → .card--metric مع counter animation عند scroll into view
- Logos compliance: row of partner/compliance logos بـ grayscale + hover color

### 3. كل قسم آخر:
- Section header: .section__eyebrow + .section__title + .section__subtitle
- Grid: استخدام .grid--auto أو .grid--3 حسب المحتوى
- Cards: نظام البطاقات الجديد
- مسافات بين الأقسام: section padding-block 96px → 128px desktop, 64px mobile

### 4. CTA Strips (الأقسام النهائية قبل الفوتر):
- Background: gradient subtle radial من cyan-soft
- Big H2 + supporting text + 2 CTAs
- Visual element on the side (illustration placeholder أو mockup)

### 5. FAQ Section:
- Accordion items (HTML <details>) — لكن styled
- Question: bold + chevron right (rotate on open)
- Answer: padding + indent + secondary color
- Animation: max-height + opacity transition

### 6. Background atmosphere:
- في كل قسم بديل: gradient overlay خفيف أو dotted pattern
- تجنّب التشتيت — اجعل البطاقات هي البطل

OUTPUT:
- src/pages/index.astro (محدّث visual فقط)
- src/components/SplitHero.astro (محدّث)
- src/components/hero/DottedSurface.tsx (محدّث أو مستبدل)
- src/styles/pages.css (.home-* sections)
- تقرير `reports/09-home.md` + screenshots Desktop+Mobile لكل قسم

ACCEPTANCE CRITERIA:
✅ كل الـ 11+ قسم موجودة بنفس الترتيب
✅ كل النصوص والروابط محفوظة
✅ JSON-LD ما تغيّر
✅ Lighthouse Performance ≥ 85 mobile
✅ FCP ≤ 2.5s
```

---

## Prompt 3.2 — Solutions Pages Redesign

```text
ROLE:
B2B Product Designer.

CONSTRAINTS:
[القيود الصارمة]
+ ❌ احتفظ بكل الـ 9 منتجات + 4 قطاعات
+ ❌ لا تغيّر أي slug أو path
+ ❌ احتفظ بكل JSON-LD

TARGETS:
- src/pages/solutions/index.astro (hub)
- src/pages/solutions/[slug].astro (individual products)
- src/pages/solutions/[sector].astro (sectors)
- src/pages/solutions/[sector]/[city].astro (city-level)

TASK:

### Solutions Hub (/solutions/):
1. Inner hero محسّن مع pattern background subtle
2. "الإجابة المختصرة" card: featured card مع icon + gradient border
3. "كيف يشتغلون مع بعض" steps:
   - استبدل الـ inner-grid--4 بـ horizontal flow مع connectors
   - كل step: number badge + icon + title + desc
   - desktop: timeline horizontal مع dashed lines
   - mobile: vertical stack
4. Solutions grid (.inner-grid--3):
   - استخدم .card--feature الجديد
   - 9 cards منظمة في 3 columns
   - فلتر/تابز اختياري على top (Products / Sectors)
5. Sectors grid (.inner-grid--2):
   - cards أكبر بسبب التعقيد الأعلى
   - icon + title + sector description + bullet list of regulations
6. "أي حل يناسبني" guide:
   - استبدل الـ flex items بـ decision tree visual
   - أو grid of scenarios cards

### Individual Solution Page (/solutions/ai-firewall/ etc):
1. Page hero: breadcrumb + eyebrow + h1 + subtitle + 2 CTAs
2. Hero visual: mockup placeholder أو animated illustration على الجانب
3. "كيف يشتغل" section: 4-step flow مع icons + arrows
4. Features grid: 6-9 features في .card--feature
5. Use cases section: real scenarios مع before/after
6. Integration section: logos of systems it connects to
7. Final CTA: gradient banner مع 2 actions

### Sector Page (/solutions/banking-ai-governance/ etc):
- نفس template زي individual solution
- مع section إضافي: "اللوائح المنطبقة" (SAMA, NCA, PDPL, etc.)
- Compliance badges grid

⚠️ كل المحتوى الموجود يبقى — فقط wrapping classes + visual layout يتغيّر.

OUTPUT:
- src/pages/solutions/index.astro (محدّث)
- src/pages/solutions/[slug].astro (محدّث)
- src/pages/solutions/[sector].astro (محدّث)
- src/components/SolutionCard.astro (محدّث)
- src/components/SectorCard.astro (محدّث)
- تقرير `reports/10-solutions.md` + screenshots (hub + 3 products + 2 sectors)

ACCEPTANCE CRITERIA:
✅ كل الـ 9 منتجات لها صفحة مع نفس المحتوى
✅ كل الـ 4 قطاعات لها صفحة
✅ City-level pages تعمل
✅ Internal links صحيحة
```

---

## Prompt 3.3 — Pricing Page Redesign

```text
ROLE:
SaaS Pricing UX Specialist.

CONSTRAINTS:
[القيود الصارمة]
+ ❌ احتفظ بالـ 4 باقات بأسماء/أسعار/مزايا حالية حرفياً
+ ❌ احتفظ بـ 6 FAQs

TARGET: src/pages/pricing/index.astro + .pricing-* styles

TASK:

### Hero:
- Breadcrumb + h1 + lead paragraph
- 2 CTAs (WhatsApp + Contact)
- Background: subtle radial gradient

### Pricing Cards Section (الـ 4 باقات):
1. Grid: 4 columns desktop, 2 tablet, 1 mobile
2. كل card:
   - Header: package name (h3) + brief description
   - Price block: kbd-like price + period (smaller, muted)
   - Divider
   - Features list: checkmark icon + feature text + spacing 12px
   - CTA button (full width)
   - Optional badge: "الأكثر طلباً" على الباقة الوسطى (لو موجودة من قبل)
3. Highlighted card: border gradient + glow + slight elevation
4. Hover: lift + brand border

### Comparison Table (اختياري — لو يضيف قيمة بصرية):
- لا تضيف محتوى جديد — فقط لو فيه info متشابهة عبر الباقات يمكن تنظيمها في جدول
- ⚠️ إذا في شك، تجاهل هذه النقطة

### FAQ Section:
- Accordion: <details><summary> مع styling
- Border bottom بين كل سؤال
- Icon chevron rotates on open
- Open state: background subtle highlight

### Final CTA:
- Banner كبير: "احجز موعد للنقاش"
- Background gradient + WhatsApp + Contact buttons

OUTPUT:
- src/pages/pricing/index.astro (محدّث visual)
- src/styles/pages.css (.pricing-* محدّث)
- تقرير `reports/11-pricing.md` + screenshots

ACCEPTANCE CRITERIA:
✅ الـ 4 باقات معروضة بنفس البيانات
✅ كل الـ FAQs قابلة للفتح والإغلاق
✅ كل الـ links/CTAs تشتغل
✅ JSON-LD FAQPage محفوظ كما هو
```

---

## Prompt 3.4 — Blog, Docs, Hub Pages

```text
ROLE:
Content-First UX Designer.

CONSTRAINTS:
[القيود الصارمة]
+ ❌ لا تغيّر أي محتوى في src/content/blog/* أو src/content/docs/*

TARGETS:
- src/pages/blog/index.astro
- src/pages/blog/[...slug].astro
- src/pages/docs/index.astro
- src/pages/docs/[...slug].astro
- src/pages/hub/index.astro
- src/pages/hub/[slug].astro
- src/layouts/BlogLayout.astro
- src/layouts/DocsLayout.astro

TASK:

### Blog Index (/blog/):
1. Hero: مختصر + search input (visual only لو ما هو موجود)
2. Featured post: card كبير في الأعلى (لو موجود)
3. Posts grid: .card--article (image + category + title + excerpt + author + date)
4. Filters: category pills (لو في categories)
5. Pagination: prev/next buttons

### Blog Post (/blog/[slug]/):
1. Article hero: cover image + category + title + meta (author, date, read time)
2. Reading layout:
   - Main content (max-width 720px)
   - Sidebar (sticky TOC + related posts)
3. Typography: line-height 1.75 + paragraph spacing
4. Code blocks: dark syntax theme + copy button
5. Inline images: rounded + shadow
6. Pull quotes: gradient border + larger font
7. Author bio at end
8. Related posts grid

### Docs Index (/docs/):
1. Search input prominent
2. Categories grid (cards)
3. Quick links to popular docs
4. Recent updates feed

### Docs Page (/docs/[slug]/):
1. Sidebar tree navigation (collapsible)
2. Main content + TOC
3. Edit on GitHub link (لو موجود)
4. Previous/Next doc footer
5. Helpful? (yes/no) widget

### Hub:
- Same treatment للـ content hub
- استخدم TableOfContents.astro المحسّن
- استخدم RelatedLinks.astro / DocsRelatedLinks.astro

OUTPUT:
- كل الصفحات المذكورة (محدّثة visual)
- src/layouts/BlogLayout.astro + DocsLayout.astro (محدّثة)
- src/components/TableOfContents.astro (محدّث)
- src/styles/pages.css (.blog-*, .docs-*, .hub-* محدّثة)
- تقرير `reports/12-content-pages.md` + screenshots

ACCEPTANCE CRITERIA:
✅ كل posts/docs/hub-pages تعرض محتواها كاملاً
✅ Frontmatter (title, description, date, author) معروضة صح
✅ Markdown rendering يشتغل (code, images, tables, lists)
✅ Reading experience مريحة على Desktop + Mobile
```

---

## Prompt 3.5 — About, Contact, Trust, Assessment

```text
ROLE:
UX Designer للصفحات الثانوية.

CONSTRAINTS:
[القيود الصارمة]

TARGETS:
- src/pages/about/index.astro
- src/pages/contact/index.astro
- src/pages/trust/index.astro
- src/pages/assessment/ai-governance-readiness/index.astro
- src/pages/demo/index.astro

TASK:

### /about/:
- Hero مختصر
- Story section (timeline أو narrative)
- Team (لو موجود)
- Mission/Vision/Values cards
- Saudi/Made in KSA badge prominent

### /contact/:
- Split layout: form (right RTL) + contact info (left)
- Form fields الموجودة فقط — تنسيق محسّن
- Contact info cards: WhatsApp + Email + Phone + Address
- Map embed (لو موجود)
- Office hours block

### /trust/:
- Compliance badges grid (PDPL, NCA, ISO, ...) — كل واحد card
- Security practices accordion/sections
- Audit reports links
- Data protection details
- Incident response info
- Trust signals: uptime, certifications

### /assessment/ai-governance-readiness/:
- Hero: explain the assessment
- Multi-step form visual:
  - Progress bar
  - Section headers
  - Question groups
  - Submit button
- Result display section (لو فيه preview للنتائج)

### /demo/:
- Calendar embed (لو موجود) أو form
- "What to expect" section
- Testimonials/logos (لو موجودة)

⚠️ كل form fields الموجودة تبقى — فقط styled.
⚠️ كل actions/methods تبقى كما هي.

OUTPUT:
- الصفحات المذكورة (محدّثة visual)
- src/styles/pages.css (sections محدّثة)
- تقرير `reports/13-secondary-pages.md` + screenshots

ACCEPTANCE CRITERIA:
✅ كل forms تشتغل
✅ كل المحتوى معروض
✅ Map/embeds تشتغل لو موجودة
✅ Mobile-friendly
```

---

# 🖥️ المرحلة 4 — Kernel UI (HTML الثابت)

## Prompt 4.1 — Kernel Dashboard Shell

```text
ROLE:
Dashboard UI Designer.

CONSTRAINTS:
[القيود الصارمة]
+ ❌ لا تغيّر API endpoints أو data fetching
+ ❌ لا تغيّر any JS logic في kernel/assets/js/
+ ❌ احتفظ بكل demo data toggles + banners
+ ❌ احتفظ بـ keyboard shortcuts (C, A, S, ...)
+ ✅ يمكن تطوير: layout, CSS, navigation visual

TARGETS:
- kernel/index.html (dashboard)
- kernel/chat.html
- kernel/audit.html
- kernel/approvals.html
- kernel/evidence.html
- kernel/stats.html
- kernel/scenarios.html
- kernel/compliance.html
- kernel/policies.html
- kernel/connectors.html
- kernel/reports.html
- kernel/assets/css/kernel.css

TASK:

### Layout Shell (مشترك لكل الصفحات):
1. **Sidebar (يمين RTL):**
   - Width: 260px desktop, collapsible to 72px
   - Sections: Logo, Nav items (with icons), bottom: user + settings
   - Active item: brand background + border indicator
   - Hover: subtle bg
   - Collapse button في الأسفل
   - Mobile: drawer من اليمين

2. **Top bar:**
   - Breadcrumb يسار
   - Search (cmd+k style)
   - Notifications + user menu يمين
   - Demo data toggle pill بارز

3. **Main canvas:**
   - Page header: title + actions row
   - Tabs (لو الصفحة فيها sections متعددة)
   - Content area: cards/tables/charts

### Dashboard (/kernel/index.html):
- Overview stat cards row (4 metrics)
- Recent activity stream
- Approvals pending widget
- Compliance status widget
- Risk distribution chart
- استخدم LiveDashboardMockup.astro inspiration

### Cards Style:
- White-on-dark surface
- Spacing consistent
- Headers مع icon
- Footer مع "View all" link
- Loading state: skeleton shimmer
- Empty state: illustration + message + CTA

OUTPUT:
- kernel/assets/css/kernel.css (محدّث كلياً)
- kernel/index.html (محدّث visual)
- تقرير `reports/14-kernel-shell.md` + 4 screenshots

ACCEPTANCE CRITERIA:
✅ كل الـ JS scripts تشتغل (kernel-api, kernel-stats, kernel-chat-client, etc.)
✅ Demo data toggle يشتغل
✅ Keyboard shortcuts تعمل
✅ Sidebar collapse/expand smooth
✅ Mobile drawer يشتغل
```

---

## Prompt 4.2 — Kernel Interactive Pages

```text
ROLE:
Enterprise Dashboard Designer.

CONSTRAINTS: [القيود الصارمة]

TARGETS: kernel/chat.html + audit.html + approvals.html + evidence.html

TASK:

### /kernel/chat.html:
- Layout: 3-pane (sidebar + chat thread + context panel)
- Message bubbles: user (right RTL, brand bg) vs AI (left, surface bg)
- Streaming indicator: typing dots
- NVIDIA status card في الـ context panel: 3 fields (configured, model, mode)
- Compose box: textarea + attach + send button
- Policy/firewall notifications inline (banner above blocked messages)

### /kernel/audit.html:
- Filters bar: date range + risk level + status + user
- Table view: timestamp + user + action + risk score + hash + view button
- Detail drawer (slides from right) عند click على row
- Risk score badges: color-coded (green/amber/red)
- Hash display: monospace + copy button + truncate
- Pagination + export buttons

### /kernel/approvals.html:
- Tabs: Pending / Approved / Rejected
- Approval cards: request snippet + risk + requester + actions (approve/reject/discuss)
- Approval modal: full context + signature/comment field
- Notification badge على pending count

### /kernel/evidence.html:
- Evidence file grid/list
- Each item: title + date + signature status + download PDF button
- Filters: date + sector + compliance pack
- Preview modal للملف
- Generate new evidence button

OUTPUT:
- 4 ملفات HTML محدّثة
- kernel/assets/css/kernel.css (sections للصفحات الأربع)
- تقرير `reports/15-kernel-interactive.md` + screenshots

ACCEPTANCE CRITERIA:
✅ كل الـ API calls تشتغل (chat streaming, audit log, approvals fetch, evidence download)
✅ Demo mode يعمل
✅ Mobile responsive
```

---

## Prompt 4.3 — Kernel Data Pages

```text
ROLE: Dashboard UI Designer.
CONSTRAINTS: [القيود الصارمة]

TARGETS: kernel/stats.html + scenarios.html + compliance.html + policies.html + connectors.html + reports.html

TASK:

### /kernel/stats.html:
- KPI cards row (counts + trends)
- Charts: line (requests over time), bar (top users), pie (risk distribution), heatmap (activity)
- Use Chart.js أو نفس library المستخدمة حالياً — لا تستبدل
- Time range selector (24h / 7d / 30d / 90d / custom)

### /kernel/scenarios.html:
- Categories: Finance / HR / Legal / Healthcare / Code Security
- Scenario cards: title + description + try button
- Scenario runner modal: prompt textarea + run + see output + see audit trail

### /kernel/compliance.html:
- Compliance packs grid: PDPL / NCA / SFDA / SAMA / ISO 13485 / Healthcare
- Each pack: progress ring + status + last audit
- Click → expand to controls list
- Map view of regulations

### /kernel/policies.html:
- Policy editor list view
- Each policy: name + status (active/draft) + last modified + edit button
- Editor modal: rule builder UI (visual conditions) + preview + save

### /kernel/connectors.html:
- Connector cards: ERP, CRM, HIS, SharePoint, etc.
- Status indicator (connected/disconnected/error)
- Configure button + last sync time + records flowed

### /kernel/reports.html:
- Reports library
- Each report: title + period + download (PDF/Excel)
- Generate new report wizard

OUTPUT:
- 6 ملفات HTML محدّثة
- kernel/assets/css/kernel.css (final updates)
- تقرير `reports/16-kernel-data.md` + screenshots

ACCEPTANCE CRITERIA:
✅ كل الـ charts ترسم بشكل صحيح
✅ كل التفاعلات تشتغل (modals, drawers, filters)
✅ Demo data تعرض بشكل واقعي
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
