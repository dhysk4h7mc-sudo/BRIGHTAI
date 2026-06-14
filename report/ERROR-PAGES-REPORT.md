# تقرير صفحات الأخطاء في Astro

التاريخ: 2026-06-13

## النطاق المنفذ

- إنشاء `src/pages/404.astro` باستخدام `ArabicLayout`.
- إنشاء `src/pages/offline/index.astro` لاستخدامها كـ PWA fallback.
- إضافة redirect من `/report/` إلى `/trust/` في `astro.config.ts` مع `status: 301`.
- الإبقاء على `/services/` كصفحة عامة لأن `ROUTE-INVENTORY.md` يعتمدها.
- التحقق من وجود `/offline/` داخل `PRECACHE_URLS` في `public/sw.js`.
- نسخ legacy `500.html` إلى `public/500.html` بدون حذف الملف الأصلي.
- عدم تعديل `render.yaml`.
- عدم إضافة redirects لمسارات `.html`.

## التحقق

### الاختبارات

الأمر:

```bash
node --test scripts/astro-error-pages.test.mjs
```

النتيجة: `6 passed, 0 failed`.

### البناء

الأمر:

```bash
npm run build
```

النتيجة: نجح البناء وولّد `106` صفحات، ومنها:

- `dist/404.html`
- `dist/offline/index.html`
- `dist/report/index.html`
- `dist/500.html`

ظهر تحذيران سابقان متعلقان بخطي
`/fonts/IBM-Plex-Sans-Arabic-var.woff2` و`/fonts/Inter-var.woff2`، ولم يمنعا
البناء.

### Astro preview

الأمر:

```bash
npm run preview -- --host 127.0.0.1 --port 4321
```

نتائج HTTP:

| المسار | الحالة | النتيجة |
|---|---:|---|
| `/missing-error-page-check/` | `404` | عرض صفحة 404 العربية المخصصة مع `G-8LLESL207Q` |
| `/offline/` | `200` | عرض صفحة عدم الاتصال العربية مع `G-8LLESL207Q` |
| `/report/` | `200` | عرض صفحة Astro static meta-refresh إلى `/trust/` |

## قيد redirect 301

الإعداد المطلوب موجود في `astro.config.ts`:

```ts
redirects: {
  '/report/': {
    status: 301,
    destination: '/trust/',
  },
},
```

لكن المشروع يستخدم `output: 'static'` بدون static adapter. Astro يولّد في هذه
الحالة صفحة HTML تحتوي:

```html
<meta http-equiv="refresh" content="0;url=/trust/">
```

ولذلك `astro preview` يرجع `200` بدل HTTP `301`. تحقيق `301` فعلي على الاستضافة
يتطلب adapter يدعم redirects أو إعداد redirect في طبقة الاستضافة. لم يُنفذ أي
منهما لأن النطاق يمنع تعديل `render.yaml` ويشترط عدم وجود أثر إنتاجي.

## مراجعة الروابط وRTL

- `html` يخرج بـ`lang="ar"` و`dir="rtl"` من `ArabicLayout`.
- جميع الروابط الجديدة clean URLs وتنتهي بـ`/`.
- لا توجد روابط تنتهي بـ`.html` في الصفحتين.
- CTA الحجز يوجّه إلى `/contact/`.
- WhatsApp موروث من layout ويستخدم رقم BrightAI المعتمد.
- فحص بنية الروابط اكتشف `0 brokenLinks` و`0 orphanPages` ضمن inventory الحالي.
- المدقق legacy الأوسع أبلغ عن مراجع قديمة خارج نطاق هذه المهمة ولم تُعدّل.

## Gate

- [x] `404.astro` يعرض صفحة خطأ عربية branded.
- [x] `/offline/` يرجع `200`.
- [ ] `/report/` يرجع HTTP `301` في `astro preview`.
- [x] إعداد `/report/` الدائم موجود في Astro config.
- [x] `public/500.html` موجود ومطابق لملف legacy.
- [x] `public/sw.js` يتضمن `/offline/` في precache.
- [x] لم يُحذف أي legacy HTML.
- [x] لم يُعدّل `render.yaml`.

