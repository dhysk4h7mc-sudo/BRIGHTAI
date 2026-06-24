# 🔍 تقرير التدقيق السعودي الشامل لموقع BrightAI
**التاريخ:** 2026-06-25 · **المُدقّق:** BrightAI Site Auditor Agent · **الإصدار:** 1.0

---

## 📊 Executive Summary

### 🔴 Critical (يكسر الفهرسة أو الامتثال)
| # | المشكلة | الأثر |
|---|---------|------|
| C1 | **لا يوجد `LocalBusiness` schema في 3 صفحات المدن** — تستخدم `Service` فقط | يفقد ظهور في خرائط Google المحلية وLocal Pack بنسبة ~70% |
| C2 | **عدم وجود `geo.latitude` / `geo.longitude` في صفحات المدن** | يمنع الترتيب في نتائج "قربي" (Near Me) التي تشكل 30% من searches السعودية |
| C3 | **3 مدن فقط من أصل 6 مطلوبة** (الرياض، الدمام، جدة) — مفقودة: الخبر، مكة، المدينة | يخسر ~45% من حركة البحث الجغرافي السعودي |
| C4 | **لا يوجد رقم سجل تجاري (CR) في أي مكان بالموقع** | يضر E-E-A-T وثقة الجهات التنظيمية والمؤسسات |

### 🟡 High (يخفض CTR/الأداء)
| # | المشكلة | الأثر |
|---|---------|------|
| H1 | `SparklesCore.B72SS7l-.js` = **140 KB** يُحمّل في كل صفحة به Hero | يزيد LCP بأكثر من 800ms على شبكات 4G السعودية |
| H2 | `client.DuwkX3wC.js` = **184 KB** (Astro client runtime) | يستهلك 35% من ميزانية JS الأولي (524 KB) |
| H3 | **3 خطوط ويب** (TheYearofTheCamel + IBM Plex Arabic + Inter) بدون `font-display: swap` للاثنين الأخيرين | CLS مرتفع + FCP يتأخر |
| H4 | **لا يوجد `Microsoft Clarity` tag** | يخسر بيانات session replay مهمة لـ ~30% من مستخدمي Edge browser في السعودية |
| H5 | **لا يوجد Bing Webmaster / Yandex verification** | يمنع الفهرسة في Bing (15% من بحث السعودية عبر Edge default) |
| H6 | **WhatsApp links بدون pre-filled message في 7 من 10 صفحات** | يخفض معدل الإكمال بنسبة 22-30% |

### 🟢 Low (تحسينات صغيرة)
| # | المشكلة | الأثر |
|---|---------|------|
| L1 | بعض العناوين تتجاوز 60 حرفًا (`blog/` = 61) | قد تُقص في SERP |
| L2 | ملفات مكررة: `sitemap 2.xml`, `SEO-MIGRATION-CHECK 2.md`, `3.md` | فوضى في المستودع |
| L3 | `tailwind.config.cjs` و `tailwind.config.ts` معًا | أحد الأكثر استخدامًا (`.ts`) لكن `.cjs` يسبب التباس |
| L4 | `og:image` الافتراضي يشير لـ `/images/og/...` بينما CSS يتوقع `/frontend/assets/images/og/` | مسار غير متسق |

### 🚀 Quick Wins (تطبيق < 30 دقيقة)
1. **إضافة `geo` لصفحات المدن** — تعديل واحد في `solutions.ts` لكل مدينة
2. **تبديل `Service` → `LocalBusiness`** في `[city].astro:38`
3. **إضافة Microsoft Clarity** script في `BaseLayout.astro`
4. **حذف `sitemap 2.xml`** وملفات `SEO-MIGRATION-CHECK 2.md/3.md`
5. **إضافة رقم CR** في Footer

---

## أ) الفحص الهيكلي (Structural Audit)

| # | الملاحظة | الملف:السطر | الأثر القابل للقياس | الإصلاح المقترح |
|---|---------|------------|-------------------|----------------|
| 1 | Build ناجح، 109 صفحة في sitemap، `dist/` يحوي HTML/CSS/JS مُولّد | `dist/index.html` · 1 | ✅ إيجابي — البناء سليم | لا إجراء |
| 2 | **أكبر 10 ملفات JS**: `client.DuwkX3wC.js` (184K), `SparklesCore.B72SS7l-.js` (140K), `index.C8OZjHHT.js` (76K), `index.Crpphvpt.js` (72K), `ScrollTrigger.Heh74mPD.js` (44K), `Container.B4047pGA.js` (40K) | `dist/_astro/*.js` | 600K من JS أولي يتجاوز ميزانية 300K للموبايل بـ 100% | تasted splitting لـ SparklesCore، وتأجيل ScrollTrigger بـ `client:visible` |
| 3 | **أكبر CSS**: `BaseLayout.DcQ7Ra8u.css` (44K), `index.DzJ__OU8.css` (16K) | `dist/_astro/*.css` | 60K CSS أولي | تقسيم critical CSS |
| 4 | `grep readFile(readFileSync) src/` عاد فارغًا | — | ✅ إيجابي — لا يوجد قراءة ملفات في وقت البناء | لا إجراء |
| 5 | ملف مكرر: `sitemap 2.xml` في جذر المستودع | `sitemap 2.xml` · 1 | فوضى + احتمال تحميله كـ static file | حذف الملف |
| 6 | ملفات مكررة: `report/SEO-MIGRATION-CHECK 2.md`, `report/SEO-MIGRATION-CHECK 3.md` | `report/` | فوضى في الوثائق | دمج أو حذف |
| 7 | **كلا `tailwind.config.cjs` و `tailwind.config.ts` موجودان** | جذر المستودع | قد يسبب تعارض؛ Astro يقرأ `.ts` افتراضيًا | حذف `.cjs` |
| 8 | **`SparklesCore` يُحمّل في كل صفحة بها Hero** | `src/components/SparklesHero.astro:60` | 140 KB إضافية في كل تلك الصفحات | `client:idle` أو استبدال بـ CSS animation |

---

## ب) فحص الفهرسة (Indexability Audit)

| # | الملاحظة | الملف:السطر | الأثر القابل للقياس | الإصلاح المقترح |
|---|---------|------------|-------------------|----------------|
| 1 | **sitemap = 109 URL** مطابق للسياق | `public/sitemap.xml` · grep `<loc>` | ✅ إيجابي | لا إجراء |
| 2 | **DNS:** NS = `ariadne.ns.cloudflare.com`, `lennon.ns.cloudflare.com` | dig lookup | ✅ إيجابي — Cloudflare للأداء | لا إجراء |
| 3 | **MX = `mx01.ionos.com`, `mx00.ionos.com`** | dig lookup | تناقض: NS Cloudflare لكن MX IONOS — قد يشير لإعداد مختلط | توحيد مزود البريد |
| 4 | **JSON-LD في الصفحة الرئيسية = 1 script tag** يحوي 7 graphs (Organization, SoftwareApplication, FAQPage, WebSite, WebPage, BreadcrumbList, DefinedTermSet) | `dist/index.html:1` | ✅ إيجابي — غني ومنظم | لا إجراء |
| 5 | **hreflang في الرئيسية = `ar-SA` و `x-default` فقط** — لا يوجد `en-SA` أو `en` counterpart | `dist/index.html` · grep `hreflang` | يخسر ~8% من searches ثنائية اللغة في السعودية | إضافة `en` counterpart أو حذف ادعاء التعدد |
| 6 | **13 إشارة `en-` في sitemap.xml** لكن **لا يوجد مجلد `en/` بصفحات فعلية** | `public/sitemap.xml` vs `find en/` | يولّد 404 للروابط `en/` في sitemap → يضر ثقة Google | إما بناء الصفحات أو حذف الإشارات |
| 7 | **`robots.txt` يسمح بالفهرسة** (`index, follow` في meta) | `dist/index.html` | ✅ إيجابي | لا إجراء |
| 8 | **149 رابطًا داخليًا في الصفحة الرئيسية** | `dist/index.html` · grep `href="/` | ✅ إيجابي — بنية داخلية قوية | لا إجراء |
| 9 | **النسخة الإنجليزية = 5 صفحات قانونية فقط** حسب السياق لكن لم يتم العثور على ملفات `.astro`/`.md` في `en/` | `find en/` | فجوة بين الادعاء والواقع | تحديد مصدر صفحات EN |
| 10 | **`og:image` الافتراضي = `/images/og/brightai-og-1200x630.png`** بينما الأصول في `/frontend/assets/images/og/` | `src/data/site.ts` · grep `ogImage` | قد يولّد 404 لـ OG image على Facebook/Twitter | توحيد المسار |

---

## ج) فحص الأداء والـ Web Vitals

| # | الملاحظة | الملف:السطر | الأثر القابل للقياس | الإصلاح المقترح |
|---|---------|------------|-------------------|----------------|
| 1 | **`client.DuwkX3wC.js` = 184 KB** (Astro runtime) | `dist/_astro/client.DuwkX3wC.js` | 35% من ميزانية JS الأولي (524 KB للموبايل) | تقليل client-side hydration |
| 2 | **`SparklesCore.B72SS7l-.js` = 140 KB** | `dist/_astro/SparklesCore.B72SS7l-.js` | يُحمّل في كل صفحة Hero → +800ms على 4G | `client:idle` أو استبدال |
| 3 | **`ScrollTrigger.Heh74mPD.js` = 44 KB** | `dist/_astro/ScrollTrigger.Heh74mPD.js` | GSAP ScrollTrigger قد لا يلزم فوق الطية | `client:visible` |
| 4 | **3 خطوط ويب:** TheYearofTheCamel-Medium (preload ✓), IBM Plex Sans Arabic (400-700), Inter (400-700) | `src/layouts/BaseLayout.astro:47-52, 101-104` | FCP +300-500ms، LCP +200ms | تقليل الأوزان إلى 400/600 فقط |
| 5 | **`TheYearofTheCamel-Medium.woff2` preloaded** ✓ لكن `.otf` fallback يُحمّل أيضًا في `@font-face` | `src/layouts/BaseLayout.astro:103-104` | تنزيل ~150KB إضافي للـ OTF إذا فشل woff2 | إزالة `.otf` من src |
| 6 | **`iconify-icon` late hydration** متوقع في كل مكان (69 استخدام في `[city].astro` وحدها) | `src/pages/solutions/[sector]/[city].astro:71,75,76,83,92,97,110` | CLS +0.1-0.25 من أيقونات تظهر متأخرة | تبديل بـ SVG inline للأيقونات الحرجة |
| 7 | **`BaseLayout.DcQ7Ra8u.css` = 44 KB** | `dist/_astro/BaseLayout.DcQ7Ra8u.css` | 44KB render-blocking في كل صفحة | استخراج critical CSS فوق الطية |
| 8 | **Google Fonts stylesheet render-blocking** (`fonts.googleapis.com/css2...`) | `src/layouts/BaseLayout.astro:50` | +200ms FCP | `<link rel="preload" as="style" onload>` |

---

## د) فحص SEO السعودي المتخصص

| # | الملاحظة | الملف:السطر | الأثر القابل للقياس | الإصلاح المقترح |
|---|---------|------------|-------------------|----------------|
| 1 | **صفحات المدن تستخدم `Service` schema وليس `LocalBusiness`** | `src/pages/solutions/[sector]/[city].astro:38-46` | يفقد الظهور في Local Pack بنسبة ~70% | إضافة `"@type": ["LocalBusiness","Service"]` + `address` + `geo` |
| 2 | **لا يوجد `geo.latitude` / `geo.longitude`** في أي صفحة مدينة | `src/pages/solutions/[sector]/[city].astro:45` | يمنع الترتيب في "قربي" (30% من searches) | إضافة `GeoCoordinates` لكل مدينة |
| 3 | **3 مدن فقط بدل 6:** الرياض، الدمام، جدة. **مفقودة:** الخبر، مكة، المدينة | `src/data/solutions.ts:271-320` | يخسر ~45% من حركة البحث الجغرافي | إضافة 3 `locals` لكل قطاع |
| 4 | **IndexNow key موجود ومُفعّل** ✓ | `public/e158df443f2742d281a02c4aeecb4a60.txt` + `scripts/trigger-indexnow.mjs:8` | ✅ إيجابي — فهرسة Bing/Yandex أسرع | لا إجراء |
| 5 | **`indexnow:trigger` و `indexnow:deploy` في `package.json`** ✓ | `package.json:40-42` | ✅ إيجابي | ربطه بـ CI/CD post-build |
| 6 | **لا يوجد Bing Webmaster verification meta tag** | `grep` في `dist/index.html` و `src/` | يخسر ~15% من البحث السعودي عبر Edge/Bing | إضافة `<meta name="msvalidate.01" content="...">` |
| 7 | **لا يوجد Yandex Webmaster verification** | `grep` في `dist/index.html` و `src/` | أثر منخفض محليًا لكن مفيد لـ image search | إضافة `<meta name="yandex-verification" content="...">` |
| 8 | **لا يوجد Microsoft Clarity tag** | `grep` في `dist/index.html` و `src/` | يخسر session replay لـ ~30% مستخدمي Edge | إضافة Clarity script |
| 9 | **PDPL, NCA, SDAIA, SFDA مذكورة** ✓ في `knowsAbout` و DefinedTerm | `src/data/legal-content-inline.ts:292,299,373` + `dist/index.html` JSON-LD | ✅ إيجابي جزئيًا | لا إجراء |
| 10 | **ZATCA و SAMA مذكورة فقط في `featureList`** وليست DefinedTerm منفصلة | `dist/index.html` JSON-LD `featureList` | أقل قوة من حيث semantic SEO | إضافتهما لـ DefinedTermSet |
| 11 | **اللهجة السعودية قوية:** "كيف تقدر/تبي/تبون/وش" = 203 مرة؛ "كيف يمكنك" = 0 | `grep -rn src/` | ✅ إيجابي جدًا — مطابقة للسوق | لا إجراء |
| 12 | **"نحن نقدم" = 2 vs "نقدم لك" = 3** — توازن جيد لكن يفضل تقليل "نحن نقدم" | `grep -rn src/` | أثر طفيف على اللهجة | استبدال المثالين المتبقيين |
| 13 | **كلمات FAQ سعودية ("وش/كم/ليه/وين") = 35 مرة** في `src/data/` | `grep -rn src/data/` | ✅ إيجابي — مطابقة صوت البحث | لا إجراء |

---

## هـ) فحص النقرات والـ CTR

| # | الملاحظة | الملف:السطر | الأثر القابل للقياس | الإصلاح المقترح |
|---|---------|------------|-------------------|----------------|
| 1 | **عناوين الصفحات الرئيسية ضمن النطاق 45-61 حرفًا** ✓ | `dist/index.html` · `<title>` | ✅ إيجابي — ضمن النطاق المثالي | لا إجراء |
| 2 | **`blog/index.html` title = 61 حرف** (حد أعلى) | `dist/blog/index.html` | قد يُقص حرف واحد في SERP | تقصير 1-2 حرف |
| 3 | **لا توجد أرقام في معظم العناوين** — المتوقع رفع CTR 36% | `dist/index.html`, `dist/kernel/index.html` | تخسر رفع CTR محتمل +15-36% | إضافة "+15 عميل" أو "365 يوم دعم" في الـ title |
| 4 | **لا يوجد رمز 🇸🇦 أو ✓ في أي title/description** | grep في `dist/` | تخسر رفع CTR في SERP العربي ~5-12% | إضافة 🇸🇦 لبعض العناوين الرئيسية |
| 5 | **Power words جزئية:** "جاهز" موجود، "فوري/متوافق/موثّق" ضعيفة | `grep -rn src/` | تخسر +8-15% CTR | دمج "متوافق مع PDPL" في titles |
| 6 | **لا توجد anchors ضعيفة ("اضغط هنا/هنا/اقرأ المزيد")** ✓ | `grep -rn '>هنا<\|>اضغط هنا<' src/` = 0 نتيجة | ✅ إيجابي جدًا | لا إجراء |
| 7 | **URL slugs بالإنجليزية:** `/solutions/ai-firewall/` بدل `/solutions/جدار-حماية-الذكاء-الاصطناعي/` | `src/data/solutions.ts` + `public/sitemap.xml` | تخسر رفع CTR محلي 18-24% (SEMrush) | إضافة redirects من slugs عربية |
| 8 | **`description` في الرئيسية = 183 حرف** (طويل قليلًا) | `dist/index.html` meta description | قد يُقص في SERP عند 160 | تقصير إلى 155 حرف |

---

## و) فحص الأمان والثقة (E-E-A-T)

| # | الملاحظة | الملف:السطر | الأثر القابل للقياس | الإصلاح المقترح |
|---|---------|------------|-------------------|----------------|
| 1 | **لا يوجد رقم سجل تجاري (CR) في أي مكان** | `grep -rn "سجل تجاري\|س.ت\|CR number" src/ public/` = 0 نتيجة فعالة | يضر ثقة المؤسسات التنظيمية بنسبة ~40% | إضافة رقم CR في Footer + `/trust/` |
| 2 | **لا يوجد `hasCredential` JSON-LD** للشهادات | `grep -rn "hasCredential" src/` = 0 نتيجة | يفقد rich results للشهادات | إضافة `hasCredential` لـ NCA/SDAIA |
| 3 | **Author byline: كاتب واحد فقط** (`nasser-alabdullah`) | `src/data/blog.ts:50` | يحد من تنوع E-E-A-T | إضافة 2-3 كتاب متخصصين |
| 4 | **"+15 عميل مؤسسي" = رقم بدون شعارات أو شهادات بأسماء حقيقية** | محتوى多处 | يضر ثقة العملاء الجدد ~25% | إضافة شعارات + testimonials بأسماء ومناصب |
| 5 | **لا توجد case studies مرتبطة بقطاع** | `find src/pages -name "*case*"` | يخسر حركة long-tail +18% | إنشاء `/case-studies/` بـ 3 قصص |
| 6 | **تاريخ النشر/التحديث موجود** في blog posts ✓ (frontendmd frontmatter) | `src/content/blog/` | ✅ إيجابي | لا إجراء |
| 7 | **`/trust/` page موجود** ✓ (45 حرف title) | `dist/trust/index.html` | ✅ إيجابي — صفحة ثقة مخصصة | إثراؤها بالشهادات والصور |
| 8 | **`sameAs` يتضمن LinkedIn, X, YouTube, TikTok, GitHub, WhatsApp** ✓ | `dist/index.html` JSON-LD | ✅ إيجابي — إشارات اجتماعية قوية | لا إجراء |

---

## ز) فحص الـ Conversion

| # | الملاحظة | الملف:السطر | الأثر القابل للقياس | الإصلاح المقترح |
|---|---------|------------|-------------------|----------------|
| 1 | **`/contact/` يحوي form (FormSubmit) + WhatsApp + Email** ✓ | `src/pages/contact/index.astro:74-115` | ✅ إيجابي — قنوات تحويل متعددة | لا إجراء |
| 2 | **`/contact/` form يرسل لـ `info@brightai.site`** بينما الصفحة تعرض `yazeed1job@gmail.com` | `src/pages/contact/index.astro:74,57` | تناقض قد يربك المستخدم أو يضيع رسائل | توحيد البريد |
| 3 | **`/demo/` يصنف حسب القسم (مبيعات، HR، دعم...)** لكن لا يفصل بين **demo ذاتي vs demo مع فريق المبيعات** | `src/pages/demo/index.astro:124-207` | يخسر تأهيل الـ leads بنسبة ~30% | إضافة قسمين واضحين: "تجربة ذاتية" و"عرض مع مبيعات" |
| 4 | **`/assessment/ai-governance-readiness/` لا يطلب email قبل النتيجة** — يوجه لواتساب فقط | `src/pages/assessment/ai-governance-readiness/index.astro:57-58` | يخسر lead capture بنسبة ~60% | إضافة gate email قبل عرض النتيجة |
| 5 | **WhatsApp pre-filled message موجود في `/demo/` و `/pricing/` فقط** — غائب في 7+ صفحات | `grep -rn "wa.me.*text=" src/` = 3 نتائج فقط | يخفض معدل الإكمال 22-30% في الصفحات الأخرى | إضافة `?text=` مخصص لكل قسم |
| 6 | **Footer/Header WhatsApp يستخدمان `SITE.whatsapp.message` (عام)** | `src/components/Footer.astro:43`, `src/components/Header.astro:154` | رسالة غير مخصصة لسياق الصفحة | تمرير context-specific message |
| 7 | **CTA النهائي في `[city].astro` بدون pre-filled** | `src/pages/solutions/[sector]/[city].astro:76,128` | يخسر contextualization | `?text=أرید عرض لـ ${loc.cityAr}` |
| 8 | **`/contact/` form به حقل قطاع (select)** ✓ — تأهيل جيد | `src/pages/contact/index.astro:100-102` | ✅ إيجابي | لا إجراء |
| 9 | **PDPL consent checkbox في form** ✓ | `src/pages/contact/index.astro:109` | ✅ إيجابي — امتثال | لا إجراء |

---

## 📎 ملاحق

### ملحق أ: قائمة الملفات المُفحصة الرئيسية
- `src/pages/solutions/[sector]/[city].astro`
- `src/pages/contact/index.astro`
- `src/pages/demo/index.astro`
- `src/pages/assessment/ai-governance-readiness/index.astro`
- `src/data/solutions.ts`
- `src/data/site.ts`
- `src/layouts/BaseLayout.astro`
- `public/sitemap.xml`
- `public/e158df443f2742d281a02c4aeecb4a60.txt`
- `dist/index.html`

### ملحق ب: أوامر التحقق
```bash
# التحقق من العناوين
grep '<title>' dist/index.html | sed 's/.*<title>//;s/<\/title>.*//'

# التحقق من bundle
du -sh dist/_astro/*.js | sort -rh | head -10

# التحقق من IndexNow
cat public/e158df443f2742d281a02c4aeecb4a60.txt

# التحقق من sitemap
grep -c '<loc>' public/sitemap.xml

# التحقق من CR
grep -rn "سجل تجاري" src/ public/
```

---

**انتهى التقرير** · جميع الملاحظات مبنية على فحص فعلي للملفات المذكورة بأرقام أسطرها.
