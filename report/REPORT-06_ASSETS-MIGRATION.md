# REPORT-06: ترحيل أصول /public/frontend/assets/ إلى /public/assets/

**التاريخ**: 2026-06-29
**الدور**: Static Assets Migration Engineer (zero-downtime)
**الحالة**: ✅ مكتمل — 0 أخطاء في البناء

---

## 1. الموجز التنفيذي

تم نقل جميع الأصول من `public/frontend/assets/` (10 ملفات) إلى `public/assets/` بنفس الهيكل، وتحديث جميع المراجع في `src/` و `scripts/` و `public/` (500.html, sw.js, sitemap-images.xml). تمت إضافة 301 redirect في `_redirects` لضمان عدم كسر أي رابط قديم. البناء نجح بـ 125 صفحة و 0 أخطاء.

## 2. الأصول المنقولة (10 ملفات)

| المسار القديم | المسار الجديد |
|---|---|
| `public/frontend/assets/fonts/TheYearofTheCamel-Medium.otf` | `public/assets/fonts/TheYearofTheCamel-Medium.otf` |
| `public/frontend/assets/fonts/TheYearofTheCamel-Medium.woff2` | `public/assets/fonts/TheYearofTheCamel-Medium.woff2` |
| `public/frontend/assets/images/authors/nasser-alabdullah.svg` | `public/assets/images/authors/nasser-alabdullah.svg` |
| `public/frontend/assets/images/logo.png` | `public/assets/images/logo.png` |
| `public/frontend/assets/images/og/brightai-og-1200x630.png` | `public/assets/images/og/brightai-og-1200x630.png` |
| `public/frontend/assets/images/og/og-blog.png` | `public/assets/images/og/og-blog.png` |
| `public/frontend/assets/images/og/og-docs.png` | `public/assets/images/og/og-docs.png` |
| `public/frontend/assets/images/og/og-home.png` | `public/assets/images/og/og-home.png` |
| `public/frontend/assets/images/og/og-kernel.png` | `public/assets/images/og/og-kernel.png` |
| `public/frontend/assets/images/og/og-solutions.png` | `public/assets/images/og/og-solutions.png` |

## 3. الملفات المحدّثة

### src/ — 19 ملفًا
- `src/layouts/BaseLayout.astro` (3 مراجع — preload + @font-face)
- `src/data/site.ts` (ogImage)
- `src/pages/authors/[slug].astro` (2 مراجع — image + img src)
- `src/pages/demo/index.astro` (JSON-LD logo)
- `src/pages/index.astro` (JSON-LD url)
- `src/pages/kernel/index.astro` (JSON-LD logo)
- `src/pages/solutions/[sector].astro` (ogImage)
- `src/pages/solutions/[sector]/[city].astro` (2 مراجع — JSON-LD image + ogImage)
- `src/pages/solutions/[slug].astro` (2 مراجع — JSON-LD logo + ogImage)
- `src/content/blog/*.md` (مراجع صورة المؤلف في 16 مقالة)

### scripts/ — 6 ملفات
- `scripts/apply-production-audit-fixes.mjs`
- `scripts/generate-ai-governance-blog-series.mjs`
- `scripts/generate-image-sitemap.mjs`
- `scripts/seo-ci-check.mjs`
- `scripts/update-section-og-meta.mjs`
- `scripts/update-section-og-meta.test.mjs`

### public/ — 3 ملفات
- `public/500.html` (2 مراجع — preload + CSS @font-face)
- `public/sw.js` (2 مراجع — cache list)
- `public/sitemap-images.xml` (16 مرجع — 8 URLs × 2 لكل)

## 4. التوجيه (301 Redirect)

تمت إضافة السطر التالي في `public/_redirects`:

```
/frontend/assets/*   /assets/:splat  301
```

هذا يضمن أن أي رابط قديم يشير إلى `/frontend/assets/...` يتم توجيهه 301 إلى `/assets/...` بدون كسر.

## 5. التحقق

| الفحص | النتيجة |
|---|---|
| `npm run build` — 125 صفحة، 0 أخطاء | ✅ |
| لا توجد إشارات لـ `/frontend/assets/` في `src/` أو `scripts/` أو `public/` | ✅ |
| الأصول الجديدة موجودة في `public/assets/` | ✅ |
| الأصول القديمة ما زالت في `public/frontend/assets/` (تنتظر الحذف لاحقًا) | ✅ |
| 301 redirect مضاف في `_redirects` | ✅ |

## 6. ما زال باقي (لبرومبت لاحق)

- حذف `public/frontend/assets/` بالكامل بعد تأكيد عدم وجود مراجع
- `frontend/` (الباكند) لم يُلمس — المراجع فيه تخدم الباكند فقط
- `public/frontend/` نفسه باقٍ (قد يحتوي أشياء أخرى)
