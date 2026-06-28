ممتاز. هذه **سلسلة برومبتات تنفيذية مقسّمة لأجزاء صغيرة جدًا** يستطيع أي وكيل ذكي (Claude/GPT/GLM) تنفيذها بإتقان، خطوة بخطوة، **بدون كسر شيء**.

كل برومبت **مستقل قابل للنسخ مباشرة**، يبدأ بـ Role، وينتهي بـ Acceptance Criteria + اسم تقرير.

---

# 🧭 الخريطة الكلية للبرومبتات

```
المرحلة 1 — Cleanup معماري محكوم      → 4 برومبتات (1.1 → 1.4)
المرحلة 2 — حسم الأصول والمسارات       → 3 برومبتات (2.1 → 2.3)
المرحلة 3 — إغلاق النشر والكاش         → 3 برومبتات (3.1 → 3.3)
المرحلة 4 — Redesign System-Wide       → 5 برومبتات (4.1 → 4.5)
المرحلة 5 — QA + Perf + SEO Final      → 4 برومبتات (5.1 → 5.4)
                       الإجمالي = 19 برومبت
```

---

# ⛔ القيود الصارمة المشتركة لكل البرومبتات

> ينسخها الوكيل في أول كل خطوة

```text
NON-NEGOTIABLE CONSTRAINTS (apply to EVERY task):

1. لا تحذف أي section من أي صفحة.
2. لا تغيّر أي نص أو محتوى موجود في أي صفحة Astro.
3. لا تعدّل: sitemap.xml, robots.txt, canonical, hreflang,
   schema/JSON-LD, redirects.json, astro.config redirects,
   .well-known/*, manifest.webmanifest, ai.txt, llms.txt.
4. لا تكسر RTL ولا العربية.
5. لا تنشر مباشرة على main — كل تغيير في فرع منفصل + PR.
6. لا تستخدم npm install عشوائي — احترم نسخ package.json.
7. كل خطوة لازم تنتج تقريرًا .md بالاسم المحدد في البرومبت.
8. ممنوع “refactor شامل” داخل برومبت تنظيف.
9. ممنوع لمس src/pages/**/*.astro في مرحلة Cleanup.
10. لو وجدت أي ملف "غير واضح هل هو legacy"، صنّفه
    كـ Needs-Verification ولا تحذفه.
```

---

# المرحلة 1 — Cleanup معماري محكوم

## 🧹 Prompt 1.1 — جرد آمن للبقايا (Inventory Only — No Deletion)

```text
ROLE:
أنت Senior Astro Project Auditor. مهمتك جرد فقط، بدون أي حذف.

OBJECTIVE:
بناء جرد كامل ودقيق لكل بقايا HTML/Legacy داخل مشروع Astro.

SCOPE:
- مجلد frontend/
- مجلد _archive/
- مجلد scripts/
- ملفات الجذر المشبوهة (package-lock 2.json, seo_gate_log.txt,
  .htaccess, critical-css.json, …)
- ملفات داخل src/components غير المستوردة
- ملفات داخل src/styles المكرّرة أو الميتة
- ملفات داخل public/ غير المستخدمة

TASKS:
1) امسح المشروع بالكامل ولا تحذف أي شيء.
2) أنتج قائمة CSV/Markdown بالأعمدة التالية:
   - path
   - size
   - type (file/dir)
   - category: core | legacy | dead-code | uncertain | seo-critical | deployment-critical
   - is-imported-anywhere (yes/no/maybe)
   - last-related-commit (إن أمكن)
   - recommended-action: keep | move-to-legacy/ | delete | needs-verification
   - risk-level: low | medium | high

3) ابحث صراحة عن:
   - أي ملف JS/CSS قديم لم يعد مرتبطًا بـ src/
   - أي مكون Astro غير مستخدم (مثل SparklesHero, SparklesCore)
   - أي script في scripts/ غير مذكور في package.json أو CI
   - أي ملف داخل public/frontend/ غير مرجوع له من src/

4) أنتج خريطة الاعتمادات (dependency map) بشكل مبسّط:
   - ماذا يستورد ماذا
   - ما الذي يبدو معزولاً
   - ما الذي يستخدم مسارات قديمة

FORBIDDEN:
- ممنوع حذف أو نقل أي ملف.
- ممنوع تعديل أي ملف.
- ممنوع كتابة كود.

ACCEPTANCE CRITERIA:
- جدول كامل لا يقل عن 95% تغطية لمحتوى المجلدات المذكورة.
- كل ملف مصنّف.
- كل ملف uncertain له سبب مكتوب.

DELIVERABLES:
- REPORT-01_LEGACY-INVENTORY.md
- LEGACY-INVENTORY.csv
```

---

## 🧹 Prompt 1.2 — عزل آمن للـ legacy (Move, Do NOT Delete)

```text
ROLE:
Senior Astro Refactor Engineer — safety-first.

PRECONDITION:
يجب أن يكون تقرير REPORT-01_LEGACY-INVENTORY.md جاهزًا ومراجَعًا.

OBJECTIVE:
نقل (مو حذف) كل ما صنّف legacy/dead-code من 1.1
إلى مجلد آمن واحد اسمه:
/_legacy-removed-2026/

SCOPE (نقل فقط):
- frontend/  → /_legacy-removed-2026/frontend/
- _archive/  → /_legacy-removed-2026/_archive/
- ملفات scripts/ المُصنفة dead-code أو unused-only
- ملفات الجذر المكررة (مثل: package-lock 2.json)
- مكونات src/components غير المستخدمة (SparklesHero.*, SparklesCore.*)
  بشرط التأكد عبر grep أنها غير مستوردة في كل src/ بالكامل.

RULES:
1) لا تنقل أي ملف uncertain حتى يُصنّف يدويًا.
2) لا تنقل أي ملف seo-critical أو deployment-critical.
3) قبل النقل: أضف ملف /_legacy-removed-2026/README.md
   فيه: التاريخ، السبب، خطة الحذف المستقبلية.
4) أضف /_legacy-removed-2026/ إلى:
   - astro build ignore (إن لزم)
   - tailwind.config content paths (تأكد ألا يقرأها)
   - tsconfig exclude
   - .gitignore فقط إن طلب المستخدم لاحقًا
   (الافتراضي: يبقى مُتعقّبًا بـ git للحفظ).

VERIFY:
- شغّل `astro check` بدون أخطاء.
- شغّل `astro build` ولا يجب أن يكسر.
- تحقق من السايت بصريًا dev mode.

FORBIDDEN:
- ممنوع الحذف النهائي.
- ممنوع نقل أي شيء غير مذكور أعلاه.

ACCEPTANCE CRITERIA:
- البناء ينجح.
- لا توجد import errors.
- لا تختفي أي صفحة.
- 0 تغيير في صفحات src/pages.

DELIVERABLES:
- REPORT-02_LEGACY-ISOLATION.md
  (يحتوي قائمة كل ملف تم نقله + قبل/بعد)
```

---

## 🧹 Prompt 1.3 — تنظيف package.json scripts من سكربتات الحقبة القديمة

```text
ROLE:
Build Pipeline Hygiene Engineer.

OBJECTIVE:
تنظيف scripts غير المستخدمة من package.json لكن بدون كسر أي build
لا داخل المشروع ولا داخل CI.

TASKS:
1) قارن سكربتات package.json مقابل:
   - .github/workflows/*.yml
   - render.yaml
   - أي ملف CI آخر
2) صنّف كل script إلى:
   - active (مستخدم في dev أو build أو CI)
   - related-to-legacy (مرتبط بـ HTML أو frontend القديم)
   - dead (غير مستخدم في أي مكان)

3) حدّث package.json:
   - أبقِ active كما هي
   - علّق على related-to-legacy بكومنت `// legacy` لكن أبقِها مؤقتًا
   - احذف dead فقط
4) لا تلمس dependencies أو devDependencies.

FORBIDDEN:
- ممنوع تغيير astro, react, tailwind إصدارات.
- ممنوع لمس workspaces.

VERIFY:
- npm run dev يعمل.
- npm run build ينجح.
- CI لا يتعطل (راجع render.yaml + GH actions).

ACCEPTANCE CRITERIA:
- package.json أصغر، أوضح، بدون كسر شيء.
- كل script مفهوم.

DELIVERABLES:
- REPORT-03_BUILD-SCRIPTS-CLEANUP.md
```

---

## 🧹 Prompt 1.4 — تنظيف tailwind/tsconfig/astro config من المسارات القديمة

```text
ROLE:
Astro + Tailwind Config Engineer.

OBJECTIVE:
تنظيف الإعدادات من إشارات المسارات القديمة.

TASKS:
1) tailwind.config.ts:
   - أزل './components/**/*.{ts,tsx}' لو لم يعد المجلد فعّالًا.
   - أبقِ فقط مسارات src/* الحقيقية.
2) tsconfig.json:
   - تأكد أن exclude يشمل /_legacy-removed-2026/.
   - تأكد أن paths مضبوطة فقط لـ src/.
3) astro.config.mjs:
   - لا تلمس redirects.
   - لا تلمس site.
   - فقط أزل أي تكامل غير مستخدم (إن وجد بعد التحقق).

FORBIDDEN:
- ممنوع تغيير compressHTML, trailingSlash, output, integrations الأساسية.
- ممنوع لمس i18n locales.

VERIFY:
- astro check
- astro build
- لا تغيّر شكل أي صفحة.

ACCEPTANCE CRITERIA:
- إعدادات أنظف، مرتبطة فقط بـ Astro core.
- لا تأثير بصري على الموقع.

DELIVERABLES:
- REPORT-04_CONFIG-CLEANUP.md
```

---

# المرحلة 2 — حسم الأصول والمسارات

## 📦 Prompt 2.1 — جرد الأصول (Assets Inventory)

```text
ROLE:
Static Assets Auditor.

OBJECTIVE:
جرد كامل لكل الأصول داخل public/ مع تصنيف مرجعيتها.

TASKS:
1) امسح كل /public.
2) لكل ملف:
   - referenced-by: قائمة الملفات في src/ التي تستخدمه
   - is-orphan: yes/no
   - is-seo-critical: (logo, favicon, og images, sitemap, robots, manifest)
   - is-font: yes/no
   - is-legacy-path: yes/no (مثلاً يبدأ بـ /frontend/assets/)
3) ركّز على:
   - public/frontend/assets/
   - public/images/
   - public/fonts/
   - public/resources/

FORBIDDEN:
- ممنوع نقل أو حذف أي شيء.
- ممنوع تعديل أي مرجع في src/.

ACCEPTANCE CRITERIA:
- جدول كامل + 100% من الأصول مصنّفة.

DELIVERABLES:
- REPORT-05_ASSETS-INVENTORY.md
- ASSETS-INVENTORY.csv
```

---

## 📦 Prompt 2.2 — إعادة هيكلة الأصول إلى /public/assets/ مع 301

```text
ROLE:
Static Assets Migration Engineer (zero-downtime).

PRECONDITION:
يجب أن يكون REPORT-05 جاهزًا.

OBJECTIVE:
نقل أصول /public/frontend/assets/ إلى /public/assets/ بدون كسر أي شيء.

TASKS:
1) أنشئ /public/assets/ بنفس هيكل /public/frontend/assets/.
2) انسخ (مع git mv) كل الملفات.
3) حدّث في src/ كل المراجع من:
   /frontend/assets/...
   إلى:
   /assets/...
4) لا تلمس JSON-LD URLs المطلقة إلا إذا كانت تستخدم
   https://brightai.site/frontend/assets/... وفي هذه الحالة
   حدّثها أيضًا.
5) أضف 301 redirects:
   - في public/_redirects (Netlify-style):
     /frontend/assets/*    /assets/:splat    301
   - في render.yaml إن لزم redirects rules.
6) أبقِ /public/frontend/assets/ موجودة مؤقتًا حتى يتم
   التحقق ثم احذفها في برومبت لاحق.

FORBIDDEN:
- ممنوع تغيير محتوى أي صورة أو فونت.
- ممنوع حذف /public/frontend/ في هذه الخطوة.

VERIFY:
- 0 broken images في dev/build.
- لا تغيّر hash أصول SEO.
- جميع الصفحات تفتح.
- اختبر OG images.

ACCEPTANCE CRITERIA:
- كل /frontend/assets/ في src أصبح /assets/.
- 301 يعمل.
- الموقع يبدو نفس الشيء بالضبط.

DELIVERABLES:
- REPORT-06_ASSETS-MIGRATION.md
```

---

## 📦 Prompt 2.3 — تأكيد سلامة الأصول بعد النقل + حذف القديم

```text
ROLE:
Migration Verifier.

PRECONDITION:
REPORT-06 منفّذ + الموقع شغّال على staging.

OBJECTIVE:
التحقق النهائي ثم حذف /public/frontend/assets/.

TASKS:
1) شغّل crawler داخلي على build output dist/:
   - تأكد 0 broken links.
   - تأكد 0 references متبقية لـ /frontend/assets/.
2) شغّل lighthouse على 5 صفحات أساسية.
3) تأكد من ظهور:
   - logo
   - OG images
   - favicon
   - fonts
4) عندها فقط: احذف /public/frontend/assets/.
5) أبقِ 301 redirects (لا تحذفها أبدًا).

FORBIDDEN:
- ممنوع حذف الـ 301.
- ممنوع حذف /public/frontend/ إن كان فيها ملفات أخرى غير assets.

ACCEPTANCE CRITERIA:
- موقع نظيف.
- 0 broken assets.
- 301 شغّال.

DELIVERABLES:
- REPORT-07_ASSETS-VERIFICATION.md
```

---

# المرحلة 3 — إغلاق النشر والكاش

## 🚀 Prompt 3.1 — تشخيص فجوة النشر (Why “fixed but not visible”)

```text
ROLE:
Deployment Forensics Engineer.

OBJECTIVE:
تحديد لماذا أحيانًا يتم تطبيق تعديلات ولا تظهر بعد النشر.

TASKS:
1) قارن:
   - محتوى dist/ بعد build
   - محتوى الموقع المنشور https://brightai.site
   اكتب ما الذي يظهر في local ولا يظهر منشورًا.
2) راجع:
   - render.yaml
   - .github/workflows/deploy.yml
3) راجع public/sw.js:
   - ما الذي يخزّنه
   - ما الذي يلغي تسجيله
   - هل يتعارض مع نشر جديد
4) راجع public/_headers و public/_redirects.
5) راجع CDN cache (إن وُجد).
6) ابحث عن ملفات stale build artifacts.

FORBIDDEN:
- ممنوع تعديل أي شيء في هذه الخطوة. تشخيص فقط.

ACCEPTANCE CRITERIA:
- تقرير سببي مرتب.
- تحديد على الأقل 3 احتمالات + أيها الأرجح.

DELIVERABLES:
- REPORT-08_DEPLOYMENT-DIAGNOSIS.md
```

---

## 🚀 Prompt 3.2 — إصلاح Service Worker وسياسة الكاش

```text
ROLE:
PWA / Service Worker Engineer.

OBJECTIVE:
ضبط public/sw.js بحيث:
- لا يخزن صفحات HTML بشكل عدواني.
- لا يتسبب في ظهور نسخ قديمة بعد النشر.
- يدعم تحديث فوري.

TASKS:
1) راجع CACHE_VERSION ورفعه عند كل deploy عبر متغير من CI.
2) استراتيجية:
   - HTML: network-first (مع fallback لـ /offline/)
   - Assets immutable (fingerprinted): cache-first
   - Fonts: cache-first
   - Images: stale-while-revalidate
3) أضف skipWaiting + clients.claim بشكل آمن.
4) حدّث precache list لإزالة مراجع /frontend/assets/
   واستبدلها بـ /assets/.
5) أبقِ منطق unregister إن كان يهدف لتنظيف SW قديم،
   لكن لا تجعله يعمل بشكل دائم.

FORBIDDEN:
- ممنوع كسر offline page.
- ممنوع تعطيل SW كليًا إذا كان مذكورًا في manifest.

VERIFY:
- افتح الموقع في tab جديد.
- انشر تعديلًا.
- يجب أن يظهر التعديل خلال refresh واحدة على الأكثر.

ACCEPTANCE CRITERIA:
- لا يوجد stale HTML.
- لا يوجد crash للأوفلاين.
- ترقية CACHE_VERSION واضحة.

DELIVERABLES:
- REPORT-09_SW-CACHE-FIX.md
```

---

## 🚀 Prompt 3.3 — تثبيت headers + redirects + التحقق النهائي للنشر

```text
ROLE:
Hosting Configuration Engineer.

OBJECTIVE:
ضمان أن كل نشر يصل للمستخدم النهائي بسرعة وبدون cache غش.

TASKS:
1) public/_headers:
   - HTML: Cache-Control: public, max-age=0, must-revalidate
   - Fingerprinted assets: immutable, max-age=31536000
   - Fonts: long cache
   - Images: medium cache
2) public/_redirects:
   - الإبقاء على /frontend/assets/* → /assets/:splat 301
   - عدم لمس redirects.json الموجودة.
3) راجع render.yaml لو يحتوي rewrites قديمة.
4) بعد النشر:
   - افتح الموقع
   - hard reload
   - تأكد headers صحيحة
   - تأكد 0 stale.

FORBIDDEN:
- ممنوع تعديل canonical/hreflang/schema.
- ممنوع حذف أي redirect قديم بدون سبب موثّق.

ACCEPTANCE CRITERIA:
- النشر يصل فوريًا.
- لا يحدث “fixed but not visible” مرة أخرى.

DELIVERABLES:
- REPORT-10_DEPLOY-HEADERS.md
```

---

# المرحلة 4 — Redesign System-Wide (بدون لمس النصوص)

## 🎨 Prompt 4.1 — توحيد Design Tokens

```text
ROLE:
Senior Design System Engineer.

OBJECTIVE:
توحيد src/styles/tokens.css بحيث يكون المصدر الأوحد للحقيقة
لكل الألوان، التايبوغرافي، الظلال، الزوايا، وanimation curves.

TASKS:
1) راجع كل ملفات src/styles/.
2) استخرج التوكنز المكررة في base/components/pages.
3) ثبّتها داخل tokens.css.
4) أنشئ طبقات:
   - color tokens
   - typography tokens
   - spacing scale
   - radii
   - shadows
   - motion curves
   - layering/z-index
   - elevation/3D depth (خفيف)
5) لا تغيّر القيم النهائية للون أو الخط الحالي إلا
   لتوحيد التسميات.

FORBIDDEN:
- ممنوع تغيير شكل أي صفحة.
- ممنوع حذف فئة CSS مستخدمة.

ACCEPTANCE CRITERIA:
- tokens.css هو المصدر.
- باقي الملفات تستهلك المتغيرات فقط.

DELIVERABLES:
- REPORT-11_DESIGN-TOKENS.md
```

---

## 🎨 Prompt 4.2 — توحيد Components Layer

```text
ROLE:
Component System Architect.

OBJECTIVE:
توحيد مكونات UI المشتركة عبر كل الصفحات:
- buttons
- cards
- chips/badges
- inputs
- sections wrappers
- table component
- pricing tiles
- testimonial/stat blocks
- FAQ block

TASKS:
1) في src/styles/components.css، وحّد:
   - .btn, .btn-primary, .btn-secondary, .btn-ghost
   - .card, .card--feature, .card--metric
   - .chip, .badge
   - .section, .section--alt
2) أزل التضارب بين utility-heavy و bespoke CSS.
3) لا تلمس بنية HTML داخل الصفحات.
4) عدّل ClassNames في صفحات Astro فقط إذا لزم
   لتوحيد semantics، ولكن دون تغيير نص.

FORBIDDEN:
- ممنوع تغيير أي text node.
- ممنوع حذف أي عنصر بصري.

ACCEPTANCE CRITERIA:
- اتساق بصري واضح بين الصفحات.
- نفس الزر يبدو متطابقًا في كل مكان.

DELIVERABLES:
- REPORT-12_COMPONENTS-UNIFY.md
```

---

## 🎨 Prompt 4.3 — صقل Hero + Background على مستوى الموقع

```text
ROLE:
Senior Motion + Hero Designer.

OBJECTIVE:
رفع جودة SplitHero و DottedBackground إلى مستوى enterprise polished،
دون استبدالهما، ودون كسر الـ semantic HTML.

TASKS:
1) SplitHero.astro:
   - حسّن hierarchy (chip → h1 → lead → CTAs).
   - حسّن tracking/leading للعربية.
   - أضف micro-interaction خفيف على CTA hover.
   - أضف 3D tilt خفيف على الـ kernel showcase (max 6deg).
   - تأكد من LCP < 2.5s mobile.
2) DottedBackground.astro:
   - حسّن depth مع layer parallax خفيف.
   - حسّن fade vignette للقراءة العربية RTL.
   - reduce intensity تلقائيًا على mobile.
3) احترم prefers-reduced-motion دائمًا.
4) ممنوع كسر النصوص أو ترتيب CTAs.

FORBIDDEN:
- ممنوع تغيير النصوص.
- ممنوع تغيير الروابط.
- ممنوع رفع تكلفة الـ JS bundle بأكثر من +5KB gz.

ACCEPTANCE CRITERIA:
- Hero يبدو أنظف وأكثر احترافًا.
- Background موحد في كل الصفحات.
- mobile perf لم تنخفض.

DELIVERABLES:
- REPORT-13_HERO-BG-POLISH.md
```

---

## 🎨 Prompt 4.4 — Redesign الأقسام داخل الصفحات (بدون تعديل النص)

```text
ROLE:
UX Polishing Engineer.

OBJECTIVE:
رفع جودة كل sections في:
- /index
- /about
- /services
- /pricing
- /contact
- /solutions
- /docs
- /blog
- /kernel
- /demo
- /trust
- /hub

TASKS:
1) لكل section:
   - حسّن spacing rhythm
   - حسّن hierarchy
   - حسّن alignment
   - حسّن RTL polish
   - حسّن micro-animations (subtle reveal)
   - حسّن card layouts
   - حسّن CTA emphasis
2) لا تضيف ولا تحذف ولا تستبدل أي نص.
3) لا تحذف أي section.
4) ضمن كل صفحة، تحقق أن الـ visual rhythm متّسق.

FORBIDDEN:
- ممنوع تغيير ترتيب الـ sections.
- ممنوع تغيير نسخة العنوان أو الجملة الترويجية.
- ممنوع كسر RTL.

ACCEPTANCE CRITERIA:
- كل الصفحات بنفس النضج البصري.
- اتساق كامل في cards/CTAs/typography.

DELIVERABLES:
- REPORT-14_PAGES-REDESIGN.md (مع before/after thumbnails)
```

---

## 🎨 Prompt 4.5 — موبايل أولاً + 3D خفيف + احترام الأداء

```text
ROLE:
Mobile-First UX Engineer.

OBJECTIVE:
ضمان أن كل التحسينات لا تكسر الموبايل ولا الأداء.

TASKS:
1) راجع كل breakpoint:
   - <= 480px
   - <= 768px
   - <= 1024px
2) خفّض شدة 3D/animation تلقائيًا على mobile.
3) تأكد touch targets ≥ 44px.
4) تأكد forms لا تستخدم font-size < 16px.
5) قلل عدد الـ reflow على الموبايل.
6) لا تضف أي WebGL ثقيل.
7) ابقِ JS islands فقط على Hero.

FORBIDDEN:
- ممنوع تعطيل dotted background على الموبايل كليًا
  (خفّفه فقط).
- ممنوع كسر السكرول.

ACCEPTANCE CRITERIA:
- mobile LCP < 2.5s
- INP < 200ms
- CLS < 0.05

DELIVERABLES:
- REPORT-15_MOBILE-AND-3D.md
```

---

# المرحلة 5 — QA + Perf + SEO Verification

## ✅ Prompt 5.1 — QA بصري شامل + Visual Regression

```text
ROLE:
Visual QA Engineer.

OBJECTIVE:
التأكد أن أي قسم لم يتغير نصيًا، وأن البصر متّسق.

TASKS:
1) التقط screenshots قبل/بعد لكل صفحة.
2) قارن النصوص قبل/بعد باستخدام diff نصي قاسي.
3) أي اختلاف نصي = bug فوري.
4) قارن بصريًا واطلب موافقة.

FORBIDDEN:
- ممنوع تجاوز أي اختلاف نصي حتى لو “يبدو لا يضر”.

ACCEPTANCE CRITERIA:
- 0 اختلاف نصي.
- اختلاف بصري فقط: تحسين، لا تغيير.

DELIVERABLES:
- REPORT-16_VISUAL-QA.md
```

---

## ✅ Prompt 5.2 — Performance Verification (Mobile + Desktop)

```text
ROLE:
Performance Verification Engineer.

OBJECTIVE:
إثبات أن إعادة التصميم لم تضر الأداء.

TASKS:
1) Lighthouse mobile + desktop على:
   - /
   - /pricing/
   - /solutions/
   - /kernel/
   - /docs/
   - /blog/
2) معايير الحد الأدنى:
   - Performance ≥ 90 mobile
   - Performance ≥ 95 desktop
   - A11y ≥ 95
   - SEO = 100
   - Best Practices ≥ 95
3) Core Web Vitals:
   - LCP < 2.5s
   - INP < 200ms
   - CLS < 0.05

FORBIDDEN:
- ممنوع الاحتفاظ بأي تحسين يكسر هذه الأرقام.

ACCEPTANCE CRITERIA:
- كل الأرقام مطابقة أو أفضل.

DELIVERABLES:
- REPORT-17_PERFORMANCE.md
```

---

## ✅ Prompt 5.3 — SEO + Indexing Verification

```text
ROLE:
Technical SEO Verifier.

OBJECTIVE:
ضمان أن الفهرسة وعناصر SEO لم تتأثر.

TASKS:
1) راجع:
   - sitemap.xml
   - robots.txt
   - canonical على كل صفحة
   - hreflang
   - JSON-LD schemas
   - OG/twitter meta
   - structured data validator
2) تأكد أن:
   - لا توجد صفحات noindex جديدة.
   - 0 broken internal links.
   - 0 duplicate canonicals.
   - 0 mixed-language hreflang.
3) شغّل internal-links-audit.
4) راجع 301 من /frontend/assets/ تعمل.
5) تأكد من schemas الخاصة بـ Saudi market.

FORBIDDEN:
- ممنوع تعديل أي نص schema.
- ممنوع لمس redirects بدون سبب.

ACCEPTANCE CRITERIA:
- جميع pages: SEO=100.
- جميع canonicals صحيحة.

DELIVERABLES:
- REPORT-18_SEO-INDEXING.md
```

---

## ✅ Prompt 5.4 — Final Production Readiness Gate

```text
ROLE:
Production Readiness Auditor (CTO-level).

OBJECTIVE:
البوابة النهائية قبل الإفراج الكامل.

CHECKLIST:
- [ ] جميع التقارير 01–18 موجودة.
- [ ] 0 broken links.
- [ ] 0 missing assets.
- [ ] 0 stale cache.
- [ ] 0 changes to page text.
- [ ] 0 changes to sections order.
- [ ] 0 changes to canonical/hreflang/schema.
- [ ] Lighthouse mobile ≥ 90.
- [ ] A11y ≥ 95.
- [ ] SEO = 100.
- [ ] Visual QA = no regression.
- [ ] Service Worker سياسة جديدة شغّالة.
- [ ] 301 /frontend/assets → /assets شغّال.
- [ ] Dotted background موحّد عبر كل الصفحات.
- [ ] Split hero مصقول.

OUTPUT:
تقرير نهائي يقول:
✅ READY FOR PRODUCTION
أو
❌ BLOCKERS: [list]

FORBIDDEN:
- ممنوع تخطّي أي بند.
- ممنوع تمرير حالة “almost good”.

DELIVERABLES:
- REPORT-19_PRODUCTION-READY.md
```

---

# 📌 ملاحظات تشغيلية مهمة جدًا

1. **شغّل البرومبتات بنفس الترتيب**. كل برومبت يفترض إنجاز اللي قبله.  
2. **كل برومبت ينتج تقريرًا**. هذه التقارير تصير دليلك التنفيذي وسجلك الموثّق.  
3. **ممنوع دمج برومبتين في خطوة واحدة**. الفصل = أمان.  
4. **لا تنفّذ Cleanup و Redesign في نفس PR**. كل مرحلة PR مستقل.  
5. **الاسم الإلزامي للتقارير**: `REPORT-XX_TITLE.md` — هذا يسهّل الأرشفة والمراجعة لاحقًا.  

---

لو تحب، في الرد التالي أقدر أعمل لك:
- **نسخة “GLM 5.2 Optimized”** بصياغة موجّهة لـ GLM تحديدًا.  
- أو **نسخة Markdown جاهزة للتصدير كملف واحد**.  
- أو **نسخة JSON إلى Workflow Agent** للتشغيل بشكل آلي خطوة بخطوة.  

أي نسخة تبيها؟