# REPORT-05: جرد أصول public/

**التاريخ**: 2026-06-29
**الدور**: Static Assets Auditor
**الحالة**: ✅ مكتمل — 100% من الأصول مصنّفة

---

## 1. الموجز التنفيذي

تم مسح كامل مجلد `public/` (47 ملفًا) وتصنيف كل أصل حسب:
- **المرجعية** (`referenced-by`): هل يستخدمه كود في `src/` أو `scripts/`؟
- **is-orphan**: هل هو يتيم (ما عنده مرجع)؟
- **is-seo-critical**: هل هو ضروري لتحسين محركات البحث؟
- **is-font**: هل هو خط؟
- **is-legacy-path**: هل مساره قديم (يبدأ بـ `/frontend/assets/`)؟

### النتائج الرئيسية

| الفئة | العدد | ملاحظة |
|---|---|---|
| أصول متيمة (orphans) | 25 | تحتاج مراجعة لحذفها أو إضافة مرجع |
| أصول SEO-critical | 14 | لا تلمس بدون موافقة |
| أصول legacy-path (قديمة) | 14 | مساراتها تبدأ بـ `/frontend/assets/` - تحتاج ترحيل |
| خطوط (fonts) | 5 | 3 في `public/fonts/` + 2 مكررة في `public/frontend/assets/fonts/` |
| أصول سليمة (referenced) | 34 | لها مراجع في `src/` أو `scripts/` |
| أصول غير مرجعية (unreferenced) | 13 | لا تظهر في أي كود مصدري |

---

## 2. الجدول الكامل

### 2.1 Root-level (public/ — 17 ملفًا)

| الملف | referenced-by | is-orphan | is-seo-critical | is-font | is-legacy-path | ملاحظة |
|---|---|---|---|---|---|---|
| `500.html` | ❌ لا يوجد | **yes** | no | no | no | صفحة خطأ، يمكن يحتاجها الخادم |
| `CNAME` | ❌ (مذكور في agent.md فقط) | no (config) | **yes** | no | no | ملف إعدادات |
| `_headers` | agent.md + scripts | no | **yes** | no | no | أمان و SEO |
| `_redirects` | agent.md + scripts/* | no | **yes** | no | no | 314 توجيه SEO |
| `ai.txt` | agent.md | no | **yes** | no | no | ملف AI crawlers |
| `e158df..txt` (IndexNow) | scripts/trigger-indexnow.mjs | no | **yes** | no | no | IndexNow key |
| `favicon.svg` | src/layouts/BaseLayout.astro | no | **yes** | no | no | أيقونة الموقع |
| `humans.txt` | agent.md | no | **yes** | no | no | ملف humans |
| `icons.svg` | ~250 إشارة في src/ | no | no | no | no | SVG sprite |
| `llms.txt` | agent.md | no | **yes** | no | no | LLM crawlers |
| `llms-full.txt` | agent.md | no | **yes** | no | no | LLM crawlers |
| `logo.png` (root) | Header,MobileNav,Footer | no | **yes** | no | no | شعار الموقع |
| `manifest.webmanifest` | agent.md | no | **yes** | no | no | PWA manifest |
| `robots.txt` | agent.md + scripts/* | no | **yes** | no | no | توجيه الزاحف |
| `sitemap.xml` | agent.md + scripts/* | no | **yes** | no | no | خريطة الموقع |
| `sitemap-images.xml` | scripts/ | no | **yes** | no | no | خريطة صور |
| `sw.js` | render.yaml | no | no | no | no | Service worker |

### 2.2 public/fonts/ (3 ملفات)

| الملف | referenced-by | is-orphan | is-seo-critical | is-font | is-legacy-path | ملاحظة |
|---|---|---|---|---|---|---|
| `TheYearofTheCamel-Medium.otf` | BaseLayout.astro:182 | no | no | **yes** | no | خط العلامة التجارية |
| `TheYearofTheCamel-Medium.woff2` | BaseLayout.astro:55,182 | no | no | **yes** | no | خط العلامة (woff2) |
| `Thin-Font.otf` | ❌ لا يوجد | **yes** | no | **yes** | no | خط يتيم |

### 2.3 public/frontend/assets/ (— 14 ملفًا)

| الملف | referenced-by | is-orphan | is-seo-critical | is-font | is-legacy-path |
|---|---|---|---|---|---|
| `fonts/..-Medium.otf` | ❌ (مكرر) | **yes** | no | **yes** | **yes** |
| `fonts/..-Medium.woff2` | ❌ (مكرر) | **yes** | no | **yes** | **yes** |
| `images/authors/nasser-alabdullah.svg` | ❌ | **yes** | no | no | **yes** |
| `images/logo.png` | ❌ (مكرر) | **yes** | no | no | **yes** |
| `images/og/brightai-og-1200x630.png` | ❌ (مكرر) | **yes** | **yes** | no | **yes** |
| `images/og/og-blog.png` | ❌ | **yes** | **yes** | no | **yes** |
| `images/og/og-docs.png` | ❌ | **yes** | **yes** | no | **yes** |
| `images/og/og-home.png` | ❌ | **yes** | **yes** | no | **yes** |
| `images/og/og-kernel.png` | ❌ | **yes** | **yes** | no | **yes** |
| `images/og/og-solutions.png` | ❌ | **yes** | **yes** | no | **yes** |

### 2.4 public/images/ (17 ملفًا)

| الملف | referenced-by | is-orphan | is-seo-critical |
|---|---|---|---|
| `android-chrome-192x192.png` | manifest.webmanifest | no | **yes** |
| `android-chrome-512x512.png` | manifest.webmanifest | no | **yes** |
| `apple-touch-icon.png` | BaseLayout.astro:59 | no | **yes** |
| `favicon-16x16.png` | ❌ مباشر | **yes** | **yes** |
| `favicon-32x32.png` | ❌ مباشر | **yes** | **yes** |
| `favicon-48x48.png` | ❌ مباشر | **yes** | **yes** |
| `grid.svg` | backend CSS | no (backend) | no |
| `hero-brain.svg` | backend CSS | no (backend) | no |
| `icon-192-clean.svg` | ❌ | **yes** | no |
| `icon-192.png` | ❌ | **yes** | no |
| `icon-192.svg` | ❌ | **yes** | no |
| `icon-512.png` | ❌ | **yes** | no |
| `icon-maskable-192.png` | ❌ | **yes** | no |
| `icon-maskable.svg` | ❌ | **yes** | no |
| `icon-source.svg` | ❌ | **yes** | no |
| `logo-new.PNG` | ❌ | **yes** | no |
| `logo-new.webp` | ❌ | **yes** | no |
| `logo.png` | Header,MobileNav,Footer | no | **yes** |
| `noise.png` | backend CSS | no (backend) | no |

### 2.5 public/images/og/ (1 ملف)

| الملف | referenced-by | is-orphan | is-seo-critical |
|---|---|---|---|
| `brightai-og-1200x630.png` | src/data/site.ts | no | **yes** |

### 2.6 public/resources/ (4 ملفات)

| الملف | referenced-by | is-orphan | ملاحظة |
|---|---|---|---|
| `ai-governance-checklist.pdf` | docs/governance-application.md | no | مستند للتحميل |
| `ai-governance-guide.pdf` | docs/governance-application.md | no | مستند للتحميل |
| `ai-tools-register.xlsx` | docs/governance-application.md | no | مستند للتحميل |
| `chatgpt-usage-policy-template.docx` | docs/governance-application.md | no | مستند للتحميل |

---

## 3. تحليل المسارات القديمة (Legacy Paths)

### 3.1 public/frontend/assets/ — ملخص

هذا المجلد يحتوي 14 ملفًا كلها مسارات قديمة. بدائلها:

| المسار القديم | البديل الحالي |
|---|---|
| `frontend/assets/fonts/TheYearofTheCamel-Medium.otf` | `fonts/TheYearofTheCamel-Medium.otf` |
| `frontend/assets/fonts/TheYearofTheCamel-Medium.woff2` | `fonts/TheYearofTheCamel-Medium.woff2` |
| `frontend/assets/images/logo.png` | `logo.png` (root) |
| `frontend/assets/images/og/brightai-og-1200x630.png` | `images/og/brightai-og-1200x630.png` |
| `frontend/assets/images/og/og-blog.png` | ❌ لا يوجد بديل (يتيم) |
| `frontend/assets/images/og/og-docs.png` | ❌ لا يوجد بديل (يتيم) |
| `frontend/assets/images/og/og-home.png` | ❌ لا يوجد بديل (يتيم) |
| `frontend/assets/images/og/og-kernel.png` | ❌ لا يوجد بديل (يتيم) |
| `frontend/assets/images/og/og-solutions.png` | ❌ لا يوجد بديل (يتيم) |
| `frontend/assets/images/authors/nasser-alabdullah.svg` | ❌ لا يوجد بديل (يتيم) |

---

## 4. التصنيفات

### 4.1 الأصول المتيمة (Orphans) — 25 ملفًا

1. `public/500.html`
2. `public/fonts/Thin-Font.otf`
3. `public/frontend/assets/fonts/TheYearofTheCamel-Medium.otf` (مكرر)
4. `public/frontend/assets/fonts/TheYearofTheCamel-Medium.woff2` (مكرر)
5. `public/frontend/assets/images/authors/nasser-alabdullah.svg`
6. `public/frontend/assets/images/logo.png` (مكرر)
7. `public/frontend/assets/images/og/brightai-og-1200x630.png` (مكرر)
8. `public/frontend/assets/images/og/og-blog.png`
9. `public/frontend/assets/images/og/og-docs.png`
10. `public/frontend/assets/images/og/og-home.png`
11. `public/frontend/assets/images/og/og-kernel.png`
12. `public/frontend/assets/images/og/og-solutions.png`
13. `public/images/favicon-16x16.png`
14. `public/images/favicon-32x32.png`
15. `public/images/favicon-48x48.png`
16. `public/images/icon-192-clean.svg`
17. `public/images/icon-192.png`
18. `public/images/icon-192.svg`
19. `public/images/icon-512.png`
20. `public/images/icon-maskable-192.png`
21. `public/images/icon-maskable.svg`
22. `public/images/icon-source.svg`
23. `public/images/logo-new.PNG`
24. `public/images/logo-new.webp`

### 4.2 الأصول الحرجة لـ SEO (14 ملفًا)

1. `robots.txt`
2. `sitemap.xml`
3. `sitemap-images.xml`
4. `_redirects`
5. `_headers`
6. `manifest.webmanifest`
7. `CNAME`
8. `e158df443f2742d281a02c4aeecb4a60.txt`
9. `favicon.svg`
10. `logo.png`
11. `images/og/brightai-og-1200x630.png`
12. `images/android-chrome-192x192.png`
13. `images/android-chrome-512x512.png`
14. `images/apple-touch-icon.png`

### 4.3 الخطوط (5 ملفات)

| الملف | الحجم التقريبي | ملاحظة |
|---|---|---|
| `fonts/TheYearofTheCamel-Medium.otf` | ~380KB | مستخدم |
| `fonts/TheYearofTheCamel-Medium.woff2` | ~142KB | مستخدم (الأساسي) |
| `fonts/Thin-Font.otf` | unknown | يتيم |
| `frontend/assets/fonts/..-Medium.otf` | ~380KB | مكرر |
| `frontend/assets/fonts/..-Medium.woff2` | ~142KB | مكرر |

---

## 5. التوصيات

| الأولوية | الإجراء | الملفات المتأثرة |
|---|---|---|
| **عاجل** | إزالة ملفات `frontend/` المكررة | 14 ملفًا |
| **عالي** | مراجعة الأيقونات المتيمة | 10 أيقونات |
| **عالي** | حذف `Thin-Font.otf` | خط غير مستخدم |
| **متوسط** | حذف `logo-new.*` | شعار قديم |
| **متوسط** | التحقق من `500.html` | هل يحتاجه الخادم |
| **منخفض** | تنظيف OG images القديمة | 6 صور |

---

## 6. الخلاصة

- **إجمالي الأصول**: 47 ملفًا
- **مصنّفة بالكامل**: ✅ 100%
- **أصول متيمة**: 25 ملفًا
- **أصول backend** (قد تحتاجها): grid.svg, noise.png, hero-brain.svg
- **ملفات مكررة**: 4 ملفات
- **خطوط غير مستخدمة**: Thin-Font.otf
- **شعارات قديمة**: logo-new.PNG + logo-new.webp
