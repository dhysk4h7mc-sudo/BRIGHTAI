# تقرير ترحيل الصفحات القانونية إلى Astro

**التاريخ:** 13 يونيو 2026  
**النطاق:** 6 صفحات عربية و5 صفحات إنجليزية  
**الحالة:** مكتمل ومتحقق منه محلياً

## ما تم تنفيذه

- إنشاء 11 صفحة Astro قانونية باستخدام `ArabicLayout` و`EnglishLayout`.
- إنشاء `src/data/i18n-pairs.ts` بخمسة أزواج مؤكدة فقط.
- الإبقاء على `/privacy-cookies/` كصفحة عربية بلا مقابل إنجليزي.
- استخراج المحتوى القانوني وقت البناء مباشرة من ملفات HTML القديمة، بدون حذفها أو إعادة صياغة النص.
- إضافة `WebPage` و`LegalDocument` داخل JSON-LD لكل صفحة.
- تمرير رابط تبديل اللغة بشكل صريح وإخفاء المفتاح عند عدم وجود مقابل.
- عدم تعديل `render.yaml`.

## أزواج اللغة

| العربية | الإنجليزية |
|---|---|
| `/privacy-policy/` | `/en/privacy-policy/` |
| `/cookie-policy/` | `/en/cookie-policy/` |
| `/terms/` | `/en/terms/` |
| `/pdpl-statement/` | `/en/pdpl-statement/` |
| `/data-processing-agreement/` | `/en/data-processing-agreement/` |

`/privacy-cookies/` تستخدم `ar-SA` و`x-default` فقط، ولا تعرض مفتاح لغة.

## نتائج التحقق

### اختبار القبول

الأمر:

```bash
node --test scripts/legal-astro-migration.test.mjs
```

النتيجة: `24/24` اختبار ناجح.

يشمل الاختبار:

- وجود الصفحات والملفات القديمة.
- خمسة أزواج فقط وعدم اختراع `/en/privacy-cookies/`.
- canonical ذاتي.
- hreflang متبادل واتجاه `x-default` إلى العربية.
- عدم وجود hreflang يتجه إلى صفحة غير موجودة.
- H1 واحد لكل صفحة.
- `lang` و`dir` و`og:locale` الصحيحة.
- وجود GA بالمعرف `G-8LLESL207Q`.
- وجود `WebPage` و`LegalDocument`.
- مقارنة النص القانوني المعروض مع النص المستخرج من HTML القديم لكل صفحة.
- ظهور مفتاح اللغة للأزواج فقط.

### البناء

الأمر:

```bash
npm run build
```

النتيجة: نجح البناء، وتم توليد 104 صفحات، ومنها الصفحات القانونية الـ11. ظهرت تحذيرات سابقة تخص عدم حل خطي `IBM-Plex-Sans-Arabic-var.woff2` و`Inter-var.woff2` وقت البناء، ولم تمنع البناء.

### Preview وHTTP

الأمر:

```bash
npm run preview -- --host 127.0.0.1
```

جميع المسارات التالية أعادت HTTP `200`:

- `/privacy-policy/`
- `/cookie-policy/`
- `/terms/`
- `/pdpl-statement/`
- `/data-processing-agreement/`
- `/privacy-cookies/`
- `/en/privacy-policy/`
- `/en/cookie-policy/`
- `/en/terms/`
- `/en/pdpl-statement/`
- `/en/data-processing-agreement/`

## Gate النهائي

- [x] 11 صفحة قانونية تعيد 200
- [x] hreflang متبادل لكل الأزواج الخمسة
- [x] لا يوجد hreflang إلى صفحة قانونية غير موجودة
- [x] المحتوى القانوني مطابق للنص القديم
- [x] JSON-LD يحتوي `WebPage` و`LegalDocument` في جميع الصفحات
- [x] الإنجليزية: `lang=en` و`dir=ltr` و`og:locale=en_SA`
- [x] العربية: `lang=ar` و`dir=rtl` و`og:locale=ar_SA`
