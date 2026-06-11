# ASTRO-MIGRATION-PLAN.md — خطة ترحيل BrightAI إلى Astro

> **المرحلة:** 2 من 5 | **تاريخ:** 2026-06-11
> **الهدف:** ترحيل brightai.site من HTML/CSS/JS خام إلى Astro static — مع الحفاظ المطلق على 107 صفحة و105 رابط sitemap و14 ملف خاص.
> **المصدر:** ROUTE-INVENTORY.md (المرحلة 1)

---

## جدول المحتويات

1. [Route Map — خريطة المسارات](#1-route-map--خريطة-المسارات)
2. [ترتيب التنفيذ](#2-ترتيب-التنفيذ)
3. [استراتيجية المحتوى الديناميكي](#3-استراتيجية-المحتوى-الديناميكي)
4. [خطة الحفاظ على SEO](#4-خطة-الحفاظ-على-seo)
5. [خطة الجوال والأنيميشن](#5-خطة-الجوال-والأنيميشن)
6. [Rollback Plan](#6-rollback-plan)
7. [الملفات الخاصة التي لا تُحذف أبداً](#7-الملفات-الخاصة-التي-لا-تُحذف-أبداً)

---

## 1. Route Map — خريطة المسارات

### مبدأ أساسي: تطابق 1:1 — صفر اختلاف

كل مسار حالي → مسار Astro مطابق بالضبط. لا صفحات جديدة. لا حذف.

### 1.1 الصفحة الرئيسية (1 صفحة)

| # | المسار الحالي | ملف Astro | نوع القالب |
|---|--------------|-----------|------------|
| 1 | `/` | `src/pages/index.astro` | مخصص — Hero + Features + CTA + FAQ |

### 1.2 الصفحات الداخلية الأساسية (15 صفحة)

| # | المسار الحالي | ملف Astro | نوع القالب |
|---|--------------|-----------|------------|
| 2 | `/about/` | `src/pages/about.astro` | صفحة ثابتة مخصصة |
| 3 | `/assessment/ai-governance-readiness/` | `src/pages/assessment/ai-governance-readiness.astro` | نموذج تقييم تفاعلي |
| 4 | `/authors/nasser-alabdullah/` | `src/pages/authors/nasser-alabdullah.astro` | صفحة مؤلف |
| 28 | `/contact/` | `src/pages/contact.astro` | نموذج تواصل + خريطة |
| 29 | `/cookie-policy/` | `src/pages/cookie-policy.astro` | صفحة قانونية |
| 30 | `/data-processing-agreement/` | `src/pages/data-processing-agreement.astro` | صفحة قانونية |
| 31 | `/demo/` | `src/pages/demo.astro` | مركز عروض تفاعلية |
| 82 | `/pdpl-statement/` | `src/pages/pdpl-statement.astro` | صفحة قانونية |
| 83 | `/pricing/` | `src/pages/pricing.astro` | باقات + جدول مقارنة |
| 84 | `/privacy-cookies/` | `src/pages/privacy-cookies.astro` | صفحة قانونية |
| 85 | `/privacy-policy/` | `src/pages/privacy-policy.astro` | صفحة قانونية |
| 86 | `/report/` | `src/pages/report.astro` | ⚠️ noindex — تدقيق داخلي |
| 87 | `/services/` | `src/pages/services.astro` | صفحة خدمات |
| 88 | `/sitemap/` | `src/pages/sitemap.astro` | خريطة موقع HTML |
| 106 | `/terms/` | `src/pages/terms.astro` | صفحة قانونية |
| 107 | `/trust/` | `src/pages/trust.astro` | مركز ثقة وأمان |

### 1.3 الحلول — Solutions (16 صفحة)

| # | المسار الحالي | ملف Astro | نوع القالب |
|---|--------------|-----------|------------|
| 89 | `/solutions/` | `src/pages/solutions/index.astro` | فهرس حلول |
| 90 | `/solutions/ai-audit-trail/` | `src/pages/solutions/ai-audit-trail.astro` | صفحة حل |
| 91 | `/solutions/ai-evidence-file/` | `src/pages/solutions/ai-evidence-file.astro` | صفحة حل |
| 92 | `/solutions/ai-firewall/` | `src/pages/solutions/ai-firewall.astro` | صفحة حل |
| 93 | `/solutions/ai-governance-platform/` | `src/pages/solutions/ai-governance-platform.astro` | صفحة حل |
| 94 | `/solutions/ai-risk-classification/` | `src/pages/solutions/ai-risk-classification.astro` | صفحة حل |
| 95 | `/solutions/ai-use-case-discovery/` | `src/pages/solutions/ai-use-case-discovery.astro` | صفحة حل |
| 96 | `/solutions/banking-ai-governance/` | `src/pages/solutions/banking-ai-governance/index.astro` | صفحة قطاع |
| 97 | `/solutions/banking-ai-governance/riyadh/` | `src/pages/solutions/banking-ai-governance/riyadh.astro` | صفحة مدينة |
| 98 | `/solutions/continuous-ai-governance/` | `src/pages/solutions/continuous-ai-governance.astro` | صفحة حل |
| 99 | `/solutions/government-ai-governance/` | `src/pages/solutions/government-ai-governance/index.astro` | صفحة قطاع |
| 100 | `/solutions/government-ai-governance/dammam/` | `src/pages/solutions/government-ai-governance/dammam.astro` | صفحة مدينة |
| 101 | `/solutions/healthcare-ai-governance/` | `src/pages/solutions/healthcare-ai-governance/index.astro` | صفحة قطاع |
| 102 | `/solutions/healthcare-ai-governance/jeddah/` | `src/pages/solutions/healthcare-ai-governance/jeddah.astro` | صفحة مدينة |
| 103 | `/solutions/human-approval-layer/` | `src/pages/solutions/human-approval-layer.astro` | صفحة حل |
| 104 | `/solutions/manufacturing-ai-governance/` | `src/pages/solutions/manufacturing-ai-governance.astro` | صفحة قطاع |
| 105 | `/solutions/policy-to-control-mapping/` | `src/pages/solutions/policy-to-control-mapping.astro` | صفحة حل |

### 1.4 Kernel — لوحة التحكم (11 صفحة)

> **ملاحظة حرجة:** 10 صفحات kernel حالياً بتنسيق flat HTML (`kernel/chat.html`) مع `_redirects` يحولها إلى trailing slash. في Astro ستُنتج مباشرة كـ `kernel/chat/index.html`.

| # | المسار الحالي | ملف Astro | نوع القالب |
|---|--------------|-----------|------------|
| 70 | `/kernel/` | `src/pages/kernel/index.astro` | لوحة تحكم رئيسية |
| 71 | `/kernel/approvals/` | `src/pages/kernel/approvals.astro` | صفحة kernel تفاعلية |
| 72 | `/kernel/audit/` | `src/pages/kernel/audit.astro` | صفحة kernel تفاعلية |
| 73 | `/kernel/chat/` | `src/pages/kernel/chat.astro` | صفحة kernel تفاعلية |
| 74 | `/kernel/compliance/` | `src/pages/kernel/compliance.astro` | صفحة kernel تفاعلية |
| 75 | `/kernel/connectors/` | `src/pages/kernel/connectors.astro` | صفحة kernel تفاعلية |
| 76 | `/kernel/evidence/` | `src/pages/kernel/evidence.astro` | صفحة kernel تفاعلية |
| 77 | `/kernel/policies/` | `src/pages/kernel/policies.astro` | صفحة kernel تفاعلية |
| 78 | `/kernel/reports/` | `src/pages/kernel/reports.astro` | صفحة kernel تفاعلية |
| 79 | `/kernel/scenarios/` | `src/pages/kernel/scenarios.astro` | صفحة kernel تفاعلية |
| 80 | `/kernel/stats/` | `src/pages/kernel/stats.astro` | صفحة kernel تفاعلية |

### 1.5 التوثيق — Docs (27 صفحة)

| # | المسار الحالي | ملف Astro | نوع القالب |
|---|--------------|-----------|------------|
| 32 | `/docs/` | `src/pages/docs/index.astro` | فهرس توثيق |
| 33 | `/docs/ai-audit-readiness/` | `src/pages/docs/ai-audit-readiness.astro` | صفحة توثيق |
| 34 | `/docs/ai-audit-trail/` | `src/pages/docs/ai-audit-trail.astro` | صفحة توثيق |
| 35 | `/docs/ai-evidence-file/` | `src/pages/docs/ai-evidence-file.astro` | صفحة توثيق |
| 36 | `/docs/ai-firewall/` | `src/pages/docs/ai-firewall.astro` | صفحة توثيق |
| 37 | `/docs/ai-governance-platform/` | `src/pages/docs/ai-governance-platform.astro` | صفحة توثيق |
| 38 | `/docs/ai-governance-saudi-arabia/` | `src/pages/docs/ai-governance-saudi-arabia.astro` | صفحة توثيق |
| 39 | `/docs/ai-risk-management/` | `src/pages/docs/ai-risk-management.astro` | صفحة توثيق |
| 40 | `/docs/governance-application/` | `src/pages/docs/governance-application.astro` | صفحة توثيق |
| 41 | `/docs/human-approval-layer/` | `src/pages/docs/human-approval-layer.astro` | صفحة توثيق |
| 42 | `/docs/kernel-approvals/` | `src/pages/docs/kernel-approvals.astro` | صفحة توثيق kernel |
| 43 | `/docs/kernel-audit-trail/` | `src/pages/docs/kernel-audit-trail.astro` | صفحة توثيق kernel |
| 44 | `/docs/kernel-chat/` | `src/pages/docs/kernel-chat.astro` | صفحة توثيق kernel |
| 45 | `/docs/kernel-compliance/` | `src/pages/docs/kernel-compliance.astro` | صفحة توثيق kernel |
| 46 | `/docs/kernel-connectors/` | `src/pages/docs/kernel-connectors.astro` | صفحة توثيق kernel |
| 47 | `/docs/kernel-evidence/` | `src/pages/docs/kernel-evidence.astro` | صفحة توثيق kernel |
| 48 | `/docs/kernel-policies/` | `src/pages/docs/kernel-policies.astro` | صفحة توثيق kernel |
| 49 | `/docs/kernel-reports/` | `src/pages/docs/kernel-reports.astro` | صفحة توثيق kernel |
| 50 | `/docs/kernel-scenarios/` | `src/pages/docs/kernel-scenarios.astro` | صفحة توثيق kernel |
| 51 | `/docs/kernel-stats/` | `src/pages/docs/kernel-stats.astro` | صفحة توثيق kernel |
| 52 | `/docs/nca-ecc-ai-controls-mapping/` | `src/pages/docs/nca-ecc-ai-controls-mapping.astro` | صفحة توثيق |
| 53 | `/docs/nca-ecc-ai-controls/` | `src/pages/docs/nca-ecc-ai-controls.astro` | صفحة توثيق |
| 54 | `/docs/nca-ecc-ai-governance/` | `src/pages/docs/nca-ecc-ai-governance.astro` | صفحة توثيق |
| 55 | `/docs/nca-ecc-ai-guide/` | `src/pages/docs/nca-ecc-ai-guide.astro` | صفحة توثيق |
| 56 | `/docs/pdpl-ai-complete-guide/` | `src/pages/docs/pdpl-ai-complete-guide.astro` | صفحة توثيق |
| 57 | `/docs/pdpl-ai-governance/` | `src/pages/docs/pdpl-ai-governance.astro` | صفحة توثيق |
| 58 | `/docs/pdpl-chatgpt-data-protection/` | `src/pages/docs/pdpl-chatgpt-data-protection.astro` | صفحة توثيق |
| 59 | `/docs/sdaia-generative-ai-guidelines/` | `src/pages/docs/sdaia-generative-ai-guidelines.astro` | صفحة توثيق |

### 1.6 المدونة — Blog (22 صفحة)

| # | المسار الحالي | ملف Astro | نوع القالب |
|---|--------------|-----------|------------|
| 5 | `/blog/` | `src/pages/blog/index.astro` | فهرس مدونة |
| 6 | `/blog/ai-audit-trail-compliance-path/` | `src/pages/blog/[...slug].astro` أو `src/pages/blog/ai-audit-trail-compliance-path.astro` | مقال |
| 7 | `/blog/ai-audit-trail-saudi/` | — (نفس القالب الديناميكي) | مقال |
| 8 | `/blog/ai-customer-data-protection-saudi/` | — | مقال |
| 9 | `/blog/ai-ethics-saudi-responsible-ai/` | — | مقال |
| 10 | `/blog/ai-firewall-why-you-need-it/` | — | مقال |
| 11 | `/blog/ai-governance-saudi-arabia/` | — | مقال |
| 12 | `/blog/ai-governance-vs-ai-safety-vs-ai-security/` | — | مقال |
| 13 | `/blog/ai-governance/` | — | مقال |
| 14 | `/blog/ai-red-teaming-security-testing/` | — | مقال |
| 15 | `/blog/banking-ai-governance-sama-requirements/` | — | مقال |
| 16 | `/blog/best-ai-governance-platforms-2026/` | — | مقال |
| 17 | `/blog/healthcare-ai-governance-saudi-hospitals/` | — | مقال |
| 18 | `/blog/hidden-ai-risks-saudi-organizations/` | — | مقال |
| 19 | `/blog/iso-42001-saudi-implementation-guide/` | — | مقال |
| 20 | `/blog/nca-ecc-ai-controls-guide/` | — | مقال |
| 21 | `/blog/pdpl-ai-compliance-guide/` | — | مقال |
| 22 | `/blog/pdpl-ai-safety/` | — | مقال |
| 23 | `/blog/pdpl-and-ai-saudi/` | — | مقال |
| 24 | `/blog/sdaia-generative-ai-guidelines-practical-compliance/` | — | مقال |
| 25 | `/blog/shadow-ai-discovery-saudi-company/` | — | مقال |
| 26 | `/blog/vision-2030-ai-governance-roadmap/` | — | مقال |
| 27 | `/blog/what-is-ai-governance-saudi-companies/` | — | مقال |

> **استراتيجية المدونة:** Content Collections (انظر القسم 3) — `src/content/blog/*.md` + `[...slug].astro`

### 1.7 مراكز المحتوى — Hub (5 صفحات)

| # | المسار الحالي | ملف Astro | نوع القالب |
|---|--------------|-----------|------------|
| 65 | `/hub/` | `src/pages/hub/index.astro` | فهرس مراكز محتوى |
| 66 | `/hub/ai-governance/` | `src/pages/hub/ai-governance.astro` | مركز محتوى |
| 67 | `/hub/compliance/` | `src/pages/hub/compliance.astro` | مركز محتوى |
| 68 | `/hub/solutions/` | `src/pages/hub/solutions.astro` | مركز محتوى |
| 69 | `/hub/use-cases/` | `src/pages/hub/use-cases.astro` | مركز محتوى |

### 1.8 الإنجليزية — English (5 صفحات)

| # | المسار الحالي | ملف Astro | نوع القالب |
|---|--------------|-----------|------------|
| 60 | `/en/cookie-policy/` | `src/pages/en/cookie-policy.astro` | صفحة قانونية EN |
| 61 | `/en/data-processing-agreement/` | `src/pages/en/data-processing-agreement.astro` | صفحة قانونية EN |
| 62 | `/en/pdpl-statement/` | `src/pages/en/pdpl-statement.astro` | صفحة قانونية EN |
| 63 | `/en/privacy-policy/` | `src/pages/en/privacy-policy.astro` | صفحة قانونية EN |
| 64 | `/en/terms/` | `src/pages/en/terms.astro` | صفحة قانونية EN |

> **ملاحظة:** لا توجد صفحة `/en/` (صفحة رئيسية إنجليزية) في الجرد الحالي — **لا تُنشأ**.

### 1.9 صفحات خاصة (غير محسوبة في الـ 107)

| المسار | الملف | الملاحظة |
|--------|-------|----------|
| `/offline/` | `src/pages/offline.astro` | صفحة PWA — ليست في sitemap |
| `404.html` | `src/pages/404.astro` | صفحة خطأ مخصصة |
| `500.html` | يُنسخ إلى `public/500.html` | صفحة خطأ خادم |

### ملخص الأرقام

| الفئة | العدد |
|--------|-------|
| الرئيسية | 1 |
| صفحات داخلية أساسية | 15 |
| Solutions | 16 |
| Kernel | 11 |
| Docs | 27 |
| Blog | 22 |
| Hub | 5 |
| English | 5 |
| Offline + أخطاء | 3 |
| **المجموع** | **105 (sitemap) + 2 (offline+report)** |

---

## 2. ترتيب التنفيذ

### المرحلة 2.1 — Skeleton الأساسي (البنية التحتية)

```
أولوية: 🔴 حرج — كل شيء يتوقف على هذا
```

| الخطوة | المهمة | التفاصيل |
|--------|--------|----------|
| 2.1.1 | تثبيت Astro | `npm create astro@latest` — static output mode |
| 2.1.2 | `astro.config.mjs` | `output: 'static'`, `trailingSlash: 'always'`, `build.format: 'directory'` |
| 2.1.3 | `tsconfig.json` | strict mode, paths aliases (`@components/`, `@layouts/`, etc.) |
| 2.1.4 | Tailwind Integration | `@astrojs/tailwind` — نقل `tailwind.config.ts` |
| 2.1.5 | هيكل المجلدات | `src/pages/`, `src/layouts/`, `src/components/`, `src/styles/`, `src/content/`, `public/` |
| 2.1.6 | `public/` ثابت | نسخ: `robots.txt`, `llms.txt`, `llms-full.txt`, `ai.txt`, `CNAME`, `humans.txt`, `manifest.webmanifest`, `sw.js`, `_headers`, `_redirects`, `.htaccess` |
| 2.1.7 | `src/content/config.ts` | تعريف Content Collections: `blog`, `docs` |
| 2.1.8 | `npm run build` أولي | التأكد من بناء نظيف بدون صفحات |

### المرحلة 2.2 — Design System (نظام التصميم)

```
أولوية: 🔴 حرج — كل صفحة تعتمد على هذا
إلهام: antimetal.com (طبقة ذكية، dashboard حي، هدوء واثق)
```

| الخطوة | المهمة | التفاصيل |
|--------|--------|----------|
| 2.2.1 | Tokens تصميم | `src/styles/tokens.css` — ألوان (`ink-900`, `ink-800`), مسافات, ظلال, حدود |
| 2.2.2 | Layout أساسي | `src/layouts/BaseLayout.astro` — `<html>`, `<head>`, GA tag, canonical, hreflang |
| 2.2.3 | Layout عربي | `src/layouts/ArabicLayout.astro` — `dir="rtl"`, `lang="ar-SA"` |
| 2.2.4 | Layout إنجليزي | `src/layouts/EnglishLayout.astro` — `dir="ltr"`, `lang="en-SA"` |
| 2.2.5 | Typography | خط Tajawal (Google Fonts), أحجام H1-H6, فقرات, قوائم |
| 2.2.6 | Glass morphism | `.glass`, `.card-glass` — خلفيات شفافة مع blur |
| 2.2.7 | أزرار | Primary, Secondary, Ghost, WhatsApp floating button |
| 2.2.8 | بطاقات | Feature card, KPI card, Solution card, Testimonial card |
| 2.2.9 | جداول | Pricing table, Compliance table |
| 2.2.10 | `npm run build` | التأكد من نظافة البناء |

### المرحلة 2.3 — Header + Footer

```
أولوية: 🔴 حرج — يظهر في كل صفحة
```

| الخطوة | المهمة | التفاصيل |
|--------|--------|----------|
| 2.3.1 | Header组件 | `src/components/Header.astro` — شعار + تنقل + CTA |
| 2.3.2 | Navigation | الرابط الرئيسية: الرئيسية، عن BrightAI، الخدمات، الحلول، التوثيق، المدونة، التسعير، تواصل |
| 2.3.3 | Mobile menu | hamburger + slide-in drawer (CSS فقط) |
| 2.3.4 | Footer | `src/components/Footer.astro` — روابط, حقوق, شهادات |
| 2.3.5 | Breadcrumb | `src/components/Breadcrumb.astro` — JSON-LD BreadcrumbList |
| 2.3.6 | WhatsApp FAB | `src/components/WhatsAppFAB.astro` — `https://wa.me/966538229013` |
| 2.3.7 | `npm run build` | التأكد |

### المرحلة 2.4 — الصفحة الرئيسية (`/`)

```
أولوية: 🔴 حرج — الصفحة الأكثر زيارة
```

| الخطوة | المهمة | الأقسام (حسب الملف الحالي) |
|--------|--------|---------------------------|
| 2.4.1 | Hero | عنوان + وصف + CTA + خلفية متحركة (GSAP aurora) |
| 2.4.2 | Trusted By | شعارات العملاء/الشهادات |
| 2.4.3 | Features | 6 بطاقات ميزات مع أيقونات |
| 2.4.4 | Kernel Preview | عرض تفاعلي لـ Kernel dashboard |
| 2.4.5 | How It Works | خطوات العمل (3-4 خطوات) |
| 2.4.6 | Testimonials | شهادات عملاء |
| 2.4.7 | FAQ | أسئلة شائعة مع JSON-LD FAQPage |
| 2.4.8 | CTA Final | دعوة نهائية للعمل |
| 2.4.9 | JSON-LD | Organization + WebSite + SearchAction + FAQPage |
| 2.4.10 | `npm run build` + فحص بصري | تأكد من مطابقة التصميم |

### المرحلة 2.5 — الصفحات الداخلية الأساسية

```
أولوية: 🟡 عالي — الصفحات التالية أهمية
```

| الخطوة | الصفحة | التفاصيل |
|--------|--------|----------|
| 2.5.1 | `/about/` | Sections: قصة الشركة، الفريق، القيم، المنهجية |
| 2.5.2 | `/services/` | Sections: الخدمات، القطاعات، المنهجية، لماذا نحن، الموارد، FAQ، CTA |
| 2.5.3 | `/contact/` | نموذج تواصل + خريطة + سيناريوهات + عملية التواصل |
| 2.5.4 | `/pricing/` | جدول باقات + مقارنة + FAQ + CTA |
| 2.5.5 | `/trust/` | حماية البيانات + طبقات الأمان + النشر + الامتثال + FAQ |
| 2.5.6 | `/demo/` | مركز عروض تفاعلية + سيناريوهات |
| 2.5.7 | `/assessment/ai-governance-readiness/` | نموذج تقييم تفاعلي |
| 2.5.8 | `/authors/nasser-alabdullah/` | صفحة مؤلف + مقالات ← **إصلاح GA المفقود** |
| 2.5.9 | `/sitemap/` | خريطة موقع HTML — روابط لكل الأقسام |
| 2.5.10 | `/report/` | لوحة تدقيق — **noindex** |
| 2.5.11 | `npm run build` | فحص |

### المرحلة 2.6 — Solutions (16 صفحة)

```
أولوية: 🟡 عالي — صفحات تحويل رئيسية
```

| الخطوة | التفاصيل |
|--------|----------|
| 2.6.1 | إنشاء `src/layouts/SolutionLayout.astro` — قالب حل موحد |
| 2.6.2 | إنشاء `src/layouts/SectorLayout.astro` — قالب قطاع (banking/government/healthcare) |
| 2.6.3 | إنشاء `src/layouts/CityLayout.astro` — قالب مدينة (riyadh/dammam/jeddah) |
| 2.6.4 | نقل `/solutions/` (فهرس) |
| 2.6.5 | نقل 8 صفحات حلول عامة (ai-audit-trail → policy-to-control-mapping) |
| 2.6.6 | نقل 3 صفحات قطاع + 3 صفحات مدينة |
| 2.6.7 | نقل صفحة manufacturing |
| 2.6.8 | `npm run build` |

### المرحلة 2.7 — Kernel (11 صفحة)

```
أولوية: 🟡 عالي — المنتج الأساسي
ملاحظة: Kernel له CSS/JS خاص — انقل as-is مع wrapper Astro
```

| الخطوة | التفاصيل |
|--------|----------|
| 2.7.1 | إنشاء `src/layouts/KernelLayout.astro` — يشمل kernel.css + kernel JS modules |
| 2.7.2 | نقل `kernel/assets/` → `public/kernel/assets/` (CSS, JS, images, mock API) |
| 2.7.3 | تحويل `kernel/index.html` → `src/pages/kernel/index.astro` |
| 2.7.4 | تحويل 10 صفحات kernel (approvals → stats) من flat HTML إلى Astro pages |
| 2.7.5 | نقل `kernel/api/mock/*.json` → `public/kernel/api/mock/` |
| 2.7.6 | نقل `kernel/kernel-perf.js`, `kernel-web-vitals.js` → `public/kernel/` |
| 2.7.7 | `npm run build` + فحص تفاعلي لكل صفحة kernel |

### المرحلة 2.8 — Docs (27 صفحة)

```
أولوية: 🟢 متوسط — محتوى مرجعي
استراتيجية: Content Collections
```

| الخطوة | التفاصيل |
|--------|----------|
| 2.8.1 | `src/content/docs/*.md` — تحويل كل صفحة docs إلى Markdown frontmatter + body |
| 2.8.2 | `src/content/config.ts` — تعريف docs collection مع schema |
| 2.8.3 | `src/pages/docs/[...slug].astro` — قالب ديناميكي |
| 2.8.4 | `src/pages/docs/index.astro` — فهرس التوثيق |
| 2.8.5 | `npm run build` |

### المرحلة 2.9 — Blog (22 صفحة)

```
أولوية: 🟢 متوسط — محتوى دوري
استراتيجية: Content Collections
```

| الخطوة | التفاصيل |
|--------|----------|
| 2.9.1 | `src/content/blog/*.md` — تحويل 21 مقالة إلى Markdown |
| 2.9.2 | `src/content/config.ts` — تعريف blog collection مع schema |
| 2.9.3 | `src/pages/blog/[...slug].astro` — قالب مقال ديناميكي |
| 2.9.4 | `src/pages/blog/index.astro` — فهرس المدونة |
| 2.9.5 | `npm run build` |

### المرحلة 2.10 — Hub (5 صفحات)

```
أولوية: 🟢 متوسط
```

| الخطوة | التفاصيل |
|--------|----------|
| 2.10.1 | `/hub/` — فهرس المراكز |
| 2.10.2 | `/hub/ai-governance/` — مركز حوكمة |
| 2.10.3 | `/hub/compliance/` — مركز امتثال |
| 2.10.4 | `/hub/solutions/` — مركز حلول |
| 2.10.5 | `/hub/use-cases/` — مركز حالات استخدام |
| 2.10.6 | `npm run build` |

### المرحلة 2.11 — الصفحات القانونية (6 صفحات عربية + 5 إنجليزية)

```
أولوية: 🟢 متوسط
```

| الخطوة | التفاصيل |
|--------|----------|
| 2.11.1 | الصفحات العربية: cookie-policy, data-processing-agreement, pdpl-statement, privacy-cookies, privacy-policy, terms |
| 2.11.2 | الصفحات الإنجليزية (5): `/en/cookie-policy/` → `/en/terms/` |
| 2.11.3 | `npm run build` |

### المرحلة 2.12 — ملفات SEO والبناء النهائي

```
أولوية: 🔴 حرج — المرحلة الأخيرة
```

| الخطوة | التفاصيل |
|--------|----------|
| 2.12.1 | `@astrojs/sitemap` integration — توليد `sitemap.xml` تلقائياً |
| 2.12.2 | `blog/feed.xml` — `@astrojs/rss` لتوليد RSS feed |
| 2.12.3 | فحص `robots.txt` — التأكد من الإشارة إلى sitemap الجديد |
| 2.12.4 | فحص `llms.txt`, `llms-full.txt`, `ai.txt` — نسخ as-is إلى `public/` |
| 2.12.5 | canonical — كل صفحة `https://brightai.site/path/` (non-www, https) |
| 2.12.6 | hreflang — `ar-SA` + `x-default` للعربي، `en-SA` للإنجليزي |
| 2.12.7 | Google Tag `G-8LLESL207Q` — في كل صفحة (بما فيها `/authors/`) |
| 2.12.8 | JSON-LD — نقل كل schema من الملفات الحالية |
| 2.12.9 | `_headers` + `_redirects` — نسخ إلى `public/` |
| 2.12.10 | `404.astro` + `public/500.html` |
| 2.12.11 | `manifest.webmanifest` — تحديث المسارات إذا لزم |
| 2.12.12 | `npm run build` نهائي + تدقيق شامل |

---

## 3. استراتيجية المحتوى الديناميكي

### 3.1 Blog — Content Collections

```
src/content/
├── config.ts          # تعريف collections
├── blog/
│   ├── ai-audit-trail-compliance-path.md
│   ├── ai-audit-trail-saudi.md
│   ├── ai-customer-data-protection-saudi.md
│   ├── ai-ethics-saudi-responsible-ai.md
│   ├── ai-firewall-why-you-need-it.md
│   ├── ai-governance-saudi-arabia.md
│   ├── ai-governance-vs-ai-safety-vs-ai-security.md
│   ├── ai-governance.md
│   ├── ai-red-teaming-security-testing.md
│   ├── banking-ai-governance-sama-requirements.md
│   ├── best-ai-governance-platforms-2026.md
│   ├── healthcare-ai-governance-saudi-hospitals.md
│   ├── hidden-ai-risks-saudi-organizations.md
│   ├── iso-42001-saudi-implementation-guide.md
│   ├── nca-ecc-ai-controls-guide.md
│   ├── pdpl-ai-compliance-guide.md
│   ├── pdpl-ai-safety.md
│   ├── pdpl-and-ai-saudi.md
│   ├── sdaia-generative-ai-guidelines-practical-compliance.md
│   ├── shadow-ai-discovery-saudi-company.md
│   ├── vision-2030-ai-governance-roadmap.md
│   └── what-is-ai-governance-saudi-companies.md
└── docs/
    ├── ai-audit-readiness.md
    ├── ai-audit-trail.md
    ├── ... (27 ملف)
    └── sdaia-generative-ai-guidelines.md
```

### 3.2 Frontmatter Schema — Blog

```yaml
# src/content/blog/*.md frontmatter
---
title: "سجل تدقيق الذكاء الاصطناعي: كيف تبني AI Audit Trail"
description: "دليل لبناء AI Audit Trail يوضح من استخدم النموذج..."
pubDate: 2026-01-15
updatedDate: 2026-03-01
author: "nasser-alabdullah"
slug: "ai-audit-trail-compliance-path"
canonical: "https://brightai.site/blog/ai-audit-trail-compliance-path/"
hreflang: "ar-SA"
jsonLd: "Article"
image: "/frontend/images/og-blog-*.png"
tags: ["audit-trail", "compliance", "saudi"]
---
```

### 3.3 Frontmatter Schema — Docs

```yaml
# src/content/docs/*.md frontmatter
---
title: "دليل جاهزية تدقيق الذكاء الاصطناعي"
description: "تعلم كيف تجهز أنظمة الذكاء الاصطناعي للتدقيق..."
slug: "ai-audit-readiness"
canonical: "https://brightai.site/docs/ai-audit-readiness/"
hreflang: "ar-SA"
jsonLd: "TechArticle"
category: "audit"        # audit | compliance | kernel | pdpl | nca | sdaia
subcategory: "readiness"
order: 1
---
```

### 3.4 القالب الديناميكي

```
src/pages/blog/[...slug].astro
  → getStaticPaths() من content collections
  → يولّد /blog/ai-audit-trail-compliance-path/index.html
  → trailing slash تلقائي

src/pages/docs/[...slug].astro
  → getStaticPaths() من content collections
  → يولّد /docs/ai-audit-readiness/index.html
```

### 3.5 تحويل المحتوى

لكل مقالة/وثيقة:
1. استخراج `<head>` SEO → frontmatter
2. استخراج JSON-LD → frontmatter أو computed في القالب
3. تحويل HTML body → Markdown (مع الحفاظ على البنية)
4. الصور: نسخ as-is إلى `public/` أو `src/assets/`
5. الروابط الداخلية: تحويل `/about/` → `/about/` (لا تغيير)

### 3.6 ملاحظة حول القوالب غير الديناميكية

الصفحات التالية **لا** تستخدم Content Collections — كل صفحة ملف Astro منفصل:
- الرئيسية (`/`)
- الصفحات الداخلية الأساسية (about, contact, pricing, services, trust, demo, sitemap, report)
- Solutions (16 صفحة — كل واحدة لها sections مختلفة)
- Kernel (11 صفحة — تفاعلية مع JS خاص)
- Hub (5 صفحات — كل واحدة تجميعية مختلفة)
- القانونية عربي (6) + إنجليزي (5)
- Authors, Assessment

---

## 4. خطة الحفاظ على SEO

### 4.1 sitemap.xml

| الجانب | الاستراتيجية |
|--------|-------------|
| **التوليد** | `@astrojs/sitemap` integration — توليد تلقائي عند البناء |
| **النطاق** | `site: 'https://brightai.site'` في `astro.config.mjs` |
| **عدد URLs** | 105 (نفس الحالي) |
| **الاستثناءات** | `/offline/` و `/report/` (noindex) — لا تُضاف |
| **التحقق** | مقارنة `dist/sitemap.xml` مع `sitemap.xml` الحالي — يجب تطابق URLs |

### 4.2 blog/feed.xml (RSS)

| الجانب | الاستراتيجية |
|--------|-------------|
| **التوليد** | `@astrojs/rss` — دالة `GET` في `src/pages/blog/feed.xml.ts` |
| **المسار** | `/blog/feed.xml` — نفس المسار الحالي |
| **المحتوى** | 22 مقالة — title, description, link, pubDate |
| **التحقق** | مقارنة مع `blog/feed.xml` الحالي |

### 4.3 robots.txt

| الجاسبة | الاستراتيجية |
|---------|-------------|
| **الملف** | نسخ as-is إلى `public/robots.txt` |
| **المحتوى** | 20 user-agent, AI crawlers allowed, sitemap reference, crawl-delay |
| **المراجع** | `/llms.txt`, `/llms-full.txt`, `/ai.txt` — يجب أن تعمل |

### 4.4 llms.txt / llms-full.txt / ai.txt

| الملف | الاستراتيجية |
|-------|-------------|
| `llms.txt` (7,219 bytes) | `public/llms.txt` — نسخ بدون تعديل |
| `llms-full.txt` (11,509 bytes) | `public/llms-full.txt` — نسخ بدون تعديل |
| `ai.txt` (5,781 bytes) | `public/ai.txt` — نسخ بدون تعديل |

### 4.5 Canonical URLs

```astro
<!-- في BaseLayout.astro — كل صفحة -->
<link rel="canonical" href={`https://brightai.site${canonicalPath}`} />
```

- **الصيغة:** `https://brightai.site/path/` — non-www, https, trailing slash
- **كل صفحة** لها canonical self-reference
- **لا** يوجد canonical متبادل بين ar/en (الإنجليزي فقط 5 صفحات قانونية)

### 4.6 hreflang

```astro
<!-- صفحات عربية -->
<link rel="alternate" hreflang="ar-SA" href={`https://brightai.site${path}`} />
<link rel="alternate" hreflang="x-default" href={`https://brightai.site${path}`} />

<!-- صفحات إنجليزية -->
<link rel="alternate" hreflang="en-SA" href={`https://brightai.site${path}`} />
<link rel="alternate" hreflang="ar-SA" href={`https://brightai.site${arabicEquiv}`} />
<link rel="alternate" hreflang="x-default" href={`https://brightai.site${arabicEquiv}`} />
```

**رسم الخريطة ثنائي الاتجاه (EN ↔ AR):**

| الإنجليزية | العربية المقابلة |
|------------|-----------------|
| `/en/cookie-policy/` | `/cookie-policy/` |
| `/en/data-processing-agreement/` | `/data-processing-agreement/` |
| `/en/pdpl-statement/` | `/pdpl-statement/` |
| `/en/privacy-policy/` | `/privacy-policy/` |
| `/en/terms/` | `/terms/` |

### 4.7 Google Tag (G-8LLESL207Q)

```astro
<!-- في BaseLayout.astro — بعد <head> مباشرة -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-8LLESL207Q"></script>
<script is:inline>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-8LLESL207Q');
</script>
```

- **كل صفحة** بما فيها `/authors/nasser-alabdullah/` (إصلاح الخطأ الحالي)
- ما عدا `/offline/` (غير ضروري)

### 4.8 JSON-LD (البيانات المنظمة)

| نوع Schema | الصفحات | الملف |
|------------|---------|-------|
| `Organization` | الرئيسية | مضمّن في الصفحة |
| `WebSite` + `SearchAction` | الرئيسية | مضمّن |
| `Article` | مقالات المدونة | من frontmatter + قالب |
| `TechArticle` | صفحات kernel docs | من frontmatter + قالب |
| `WebPage` | كل الصفحات | من قالب BaseLayout |
| `BreadcrumbList` | كل الصفحات (ما عدا الرئيسية) | مكوّن Breadcrumb |
| `FAQPage` | الرئيسية, trust, services, pricing, solutions | مضمّن في كل صفحة ذات FAQ |
| `ContactPage` | `/contact/` | مضمّن |
| `Service` | صفحات solutions القطاعية | من frontmatter |
| `Offer` | صفحات kernel | من قالب KernelLayout |
| `DefinedTermSet` | `/report/` | مضمّن |
| `Person` | `/authors/nasser-alabdullah/` | مضمّن |
| `CollectionPage` | `/blog/`, `/hub/` | مضمّن |
| `ItemList` | `/blog/` | مضمّن |

**الاستراتيجية:** نقل كل JSON-LD حرفياً من HTML الحالي إلى قوالب Astro المقابلة.

### 4.9 _redirects (265 قاعدة)

| الجانب | الاستراتيجية |
|--------|-------------|
| **الملف** | `public/_redirects` — نسخ as-is |
| **الأولوية** | تحويل `.html` → trailing slash, www → non-www, renamed URLs |
| **Astro** | `trailingSlash: 'always'` يُنتج `kernel/chat/index.html` تلقائياً — يقلل الحاجة لبعض القواعد |
| **التحقق** | بعد البناء، فحص أن كل redirect ما زال يعمل |

### 4.10 _headers (أمان)

| الجانب | الاستراتيجية |
|--------|-------------|
| **الملف** | `public/_headers` — نسخ as-is |
| **التحديث** | قد تحتاج مسارات CSS/JS الجديدة إضافة إلى CSP |

---

## 5. خطة الجوال والأنيميشن

### 5.1 Mobile-First (الجوال أولاً)

| المبدأ | التطبيق |
|--------|---------|
| **Breakpoints** | `base: 0` → `sm: 640px` → `md: 768px` → `lg: 1024px` → `xl: 1280px` → `2xl: 1536px` |
| **Touch targets** | لا يقل عن 44×44px لكل عنصر تفاعلي |
| **Navigation** | hamburger menu مع slide-in drawer — CSS transitions فقط |
| **Typography** | `text-base` (16px) كحد أدنى، `text-lg` للفقرات الرئيسية |
| **Images** | `loading="lazy"` + `decoding="async"` + أبعاد محددة |
| **Kernel** | تصميم responsive خاص — `kernel-mobile.js` موجود بالفعل |

### 5.2 RTL / LTR

| الجانب | التطبيق |
|--------|---------|
| **Arabic** | `dir="rtl"` + `lang="ar-SA"` على `<html>` |
| **English** | `dir="ltr"` + `lang="en-SA"` على `<html>` |
| **الافتراضي** | عربي (RTL) |
| **CSS** | استخدام `ms-`/`me-` (margin-inline) بدل `ml-`/`mr-` في Tailwind |
| **Logical properties** | `start`/`end` بدل `left`/`right` في كل الأنماط |

### 5.3 الأنيميشن — استراتيجية طبقية

```
المبدأ: CSS أولاً — GSAP فقط حيثما ضروري
الشرط: المحتوى يعمل بدون JS — الأنيميشن = progressive enhancement
```

#### الطبقة 1: CSS Transitions (كل الصفحات)

| العنصر | التقنية | الشرط |
|--------|---------|-------|
| Hover effects | `transition: all 0.2s` | تعمل بدون JS |
| Card hover lift | `transform: translateY(-4px)` | تعمل بدون JS |
| Button glow | `box-shadow` transition | تعمل بدون JS |
| Navigation dropdown | CSS `:hover` + `opacity` transition | تعمل بدون JS |
| Mobile menu | CSS `transform: translateX(100%)` → `0` | تحتاج JS لإضافة class فقط |
| Focus states | `:focus-visible` ring | تعمل بدون JS |
| Scroll reveal | `IntersectionObserver` + CSS class `.revealed` | تحتاج JS بسيط |

#### الطبقة 2: CSS Animations (كل الصفحات)

| العنصر | التقنية | الشرط |
|--------|---------|-------|
| Gradient text shimmer | `@keyframes` + `background-clip` | تعمل بدون JS |
| Subtle float | `@keyframes float` للعناصر الزخرفية | تعمل بدون JS |
| Pulse glow | `@keyframes pulse-glow` للعناصر المهمة | تعمل بدون JS |
| Loading skeleton | `@keyframes shimmer` | تعمل بدون JS |

#### الطبقة 3: IntersectionObserver (كل الصفحات — خفيف)

| العنصر | التقنية | الحجم |
|--------|---------|-------|
| Scroll reveal | `IntersectionObserver` + `.reveal` class | ~1KB |
| Counter animation | أرقام KPI تتحرك عند الظهور | ~0.5KB |
| Staggered cards | بطاقات تظهر بالتتابع | ~0.5KB |

> **التطبيق:** ملف `src/scripts/reveal.js` واحد — يُحمَّل بـ `type="module"` + `defer`

#### الطبقة 4: GSAP (الرئيسية + Kernel فقط)

| الصفحة | العنصر | التقنية | التبرير |
|--------|--------|---------|---------|
| `/` (الرئيسية) | Hero aurora background | GSAP `ScrollTrigger` | إلهام antimetal — خلفية حية هادئة |
| `/` (الرئيسية) | Kernel demo preview | GSAP timeline | عرض تفاعلي للمنتج |
| `/kernel/*` | Dashboard animations | GSAP + kernel JS الموجود | انتقالات لوحة التحكم |

> **تحميل:** `<script>` بـ `type="module"` +动态 import — يُحمَّل فقط في هذه الصفحات

### 5.4 prefers-reduced-motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- **كل أنيميشن** يتوقف أو يُخفف جذرياً
- GSAP: فحص `window.matchMedia('(prefers-reduced-motion: reduce)')` قبل التشغيل
- IntersectionObserver: إذا `prefers-reduced-motion`، أظهر كل العناصر فوراً بدون تأخير

### 5.5 أداء الأنيميشن

| المقياس | الهدف | التقنية |
|---------|-------|---------|
| FCP | < 1.5s | لا JS في critical path |
| LCP | < 2.5s | صور محسّنة، fonts preloaded |
| CLS | < 0.1 | أبعاد محددة لكل عنصر متحرك |
| TBT | < 200ms | GSAP يُحمَّل بعد `requestIdleCallback` |
| SI | < 3s | CSS animations فقط above the fold |

---

## 6. Rollback Plan

### 6.1 استراتيجية Git

```
الفرع الحالي: main (الحالة المستقرة الحالية)
فرع الترحيل: feat/astro-migration
```

| الخطوة | الأمر | الوصف |
|--------|-------|-------|
| قبل البدء | `git checkout -b feat/astro-migration` | فرع جديد |
| بعد كل مرحلة | `git add . && git commit -m "Phase 2.X: description"` | checkpoint |
| إذا فشل build | `git diff HEAD~1` → إصلاح أو `git revert HEAD` | تراجع عن آخر تغيير |
| إذا فشل كل شيء | `git checkout main` | عودة كاملة |

### 6.2 نقاط التحقق (Checkpoints)

| checkpoint | شرط النجاح | إجراء الفشل |
|------------|-----------|------------|
| 2.1 Skeleton | `npm run build` ينجح بدون صفحات | فحص config + dependencies |
| 2.2 Design System | `npm run build` + صفحة تجريبية تعمل | مراجعة tokens + Tailwind |
| 2.3 Header/Footer | `npm run build` + فحص بصري | مقارنة مع HTML الحالي |
| 2.4 الرئيسية | `npm run build` + فحص كامل | تراجع + مقارنة section بـ section |
| 2.5 الداخلية | `npm run build` + فحص كل صفحة | isolate الصفحة المشكلة |
| 2.6 Solutions | `npm run build` + فحص | isolate + rollback صفحة |
| 2.7 Kernel | `npm run build` + فحص تفاعلي | kernel JS مشاكل → giữ nguyên |
| 2.8 Docs | `npm run build` + فحص content | markdown conversion issues |
| 2.9 Blog | `npm run build` + فحص content | same |
| 2.10 Hub | `npm run build` | trivial |
| 2.11 القانونية | `npm run build` | trivial |
| 2.12 SEO | `npm run build` + فحص sitemap/canonical/hreflang/GA | **🔴 حرج** — لا نشر بدون هذا |

### 6.3 خطة الطوارئ

| السيناريو | الإجراء |
|-----------|---------|
| فشل `npm run build` في أي مرحلة | إصلاح + إعادة → إذا استمر 3 محاولات → rollback لآخر checkpoint |
| فشل كامل بعد مراحل عديدة | `git checkout main` → الموقع القديم يعمل كما هو |
| مشاكل kernel JS | الأصل: `public/kernel/` as-is → Astro wrapper فقط |
| فقدان SEO | مقارنة `dist/` مع الموقع الحالي — لا نشر حتى تطابق 100% |
| مشاكل أداء | Lighthouse قبل وبعد → لا نشر إذا تراجع >10% |

### 6.4 عدم حذف الملفات الأصلية

- **كل ملفات HTML/CSS/JS الأصلية تبقى في مكانها** حتى نهاية الترحيل
- `astro.config.mjs` → `outDir: 'dist'` — البناء في مجلد منفصل
- لا حذف إلا بعد التحقق النهائي + نشر ناجح

---

## 7. الملفات الخاصة التي لا تُحذف أبداً

### 7.1 ملفات SEO/AI Discoverability

| الملف | الحجم | الموقع الحالي → الموقع في Astro |
|-------|-------|-------------------------------|
| `robots.txt` | 2,246 bytes | `public/robots.txt` — **لا تعديل** |
| `sitemap.xml` | 35,729 bytes | **يُولّد تلقائياً** بـ `@astrojs/sitemap` |
| `llms.txt` | 7,219 bytes | `public/llms.txt` — **لا تعديل** |
| `llms-full.txt` | 11,509 bytes | `public/llms-full.txt` — **لا تعديل** |
| `ai.txt` | 5,781 bytes | `public/ai.txt` — **لا تعديل** |
| `blog/feed.xml` | RSS | **يُولّد تلقائياً** بـ `@astrojs/rss` |
| `schema-saudi-seo.json` | — | `public/schema-saudi-seo.json` — مرجع |

### 7.2 ملفات البنية التحتية

| الملف | الموقع في Astro |
|-------|----------------|
| `_headers` | `public/_headers` |
| `_redirects` | `public/_redirects` |
| `.htaccess` | `public/.htaccess` |
| `CNAME` | `public/CNAME` |
| `humans.txt` | `public/humans.txt` |
| `manifest.webmanifest` | `public/manifest.webmanifest` |
| `sw.js` | `public/sw.js` — **يُحدّث مسارات الكاش** |

### 7.3 ملفات Kernel

| الملف/المجلد | الموقع في Astro |
|-------------|----------------|
| `kernel/assets/css/` (14 ملف) | `public/kernel/assets/css/` |
| `kernel/assets/js/` (18 ملف) | `public/kernel/assets/js/` |
| `kernel/assets/screenshots/` | `public/kernel/assets/screenshots/` |
| `kernel/api/mock/*.json` (8 ملف) | `public/kernel/api/mock/` |
| `kernel/kernel-perf.js` | `public/kernel/kernel-perf.js` |
| `kernel/kernel-web-vitals.js` | `public/kernel/kernel-web-vitals.js` |
| `kernel/sw.js` | `public/kernel/sw.js` |
| `kernel/tests/` (5 ملف) | `tests/kernel/` (خارج public) |
| `kernel/README.md` | `src/pages/kernel/README.md` (مرجع) |

### 7.4 ملفات أخرى لا تُحذف

| الملف | السبب |
|-------|-------|
| `404.html` | يُستبدل بـ `src/pages/404.astro` — الأصل يُحتفظ به |
| `500.html` | `public/500.html` — لا يُداره بـ Astro |
| `ROUTE-INVENTORY.md` | مرجع الترحيل — لا يُحذف |
| `DESIGN.md` | مرجع التصميم |
| `.env.example` | إعدادات بيئة |
| `.gitignore` | يُحدّث |
| `tailwind.config.ts` | يُنقل إلى `src/` أو جذر Astro |
| `tsconfig.json` | يُحدّث |
| `render.yaml` | إعدادات النشر |
| `package.json` | يُحدّث — إضافة Astro dependencies |
| `frontend/` | **لا يُحذف** — قد يحتوي مسارات وخدمات مستقبلية |
| `docx/` | مستندات مرجعية |
| `scripts/` | سكربتات بناء — قد تُستبدل بـ Astro |

### 7.5 قاعدة ذهبية

> **إذا لم تكن متأكداً مما إذا كان يجب حذف ملف — لا تحذفه.**
> كل ملف في المستودع إما:
> 1. يُنقل إلى Astro structure
> 2. يُنسخ إلى `public/`
> 3. يُبقى في مكانه كمرجع
> 4. يُضاف إلى `.gitignore` إذا كان artifact بناء

---

## ملخص تنفيذي

| المقياس | القيمة |
|---------|--------|
| **إجمالي الصفحات** | 107 (105 في sitemap + offline + report) |
| **Content Collections** | blog (22) + docs (27) = 49 صفحة |
| **صفحات Astro فردية** | 58 صفحة |
| **مراحل التنفيذ** | 12 مرحلة فرعية (2.1 → 2.12) |
| **Checkpoints** | 12 — `npm run build` بعد كل مرحلة |
| **ملفات خاصة محفوظة** | 14+ ملف + kernel assets كاملة |
| **صفحات جديدة** | **صفر** — لا تُنشأ أي صفحة غير موجودة في الجرد |
| **Google Tag** | G-8LLESL207Q في كل صفحة |
| **واتساب** | `https://wa.me/966538229013` — لا تغيير |
| **Rollback** | Git branch `feat/astro-migration` — عودة فورية لـ `main` |

---

*نهاية ASTRO-MIGRATION-PLAN.md — المرحلة 2 (خطة الترحيل فقط — لا تعديل ملفات إنتاج)*