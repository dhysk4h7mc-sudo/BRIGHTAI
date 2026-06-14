# Legacy Cleanup Report

> الحالة: **STOPPED BEFORE QUARANTINE**

## النتيجة التنفيذية

- تم جرد **129** ملف HTML tracked خارج `src/`.
- نجح `npm run build` وبنى **107** صفحات في `dist/`.
- الملفات المثبت تكافؤها مبدئيًا: **31**.
- الملفات المحمية أو غير المثبت تكافؤها: **98**.
- لم يتم إنشاء `_legacy_quarantine/`.
- لم يتم نقل أو حذف أي ملف.
- لم يتم تعديل `render.yaml`.
- لم يتم إنشاء commit أو push أو PR.

## أسباب التوقف

- `kernel/offline.html`: لا يوجد له `dist/kernel/offline/index.html`، وفحص preview المحلي رجع 404.
- `report/index.html`: Astro يولد redirect shell إلى `/trust/` بدل محتوى report المكافئ.
- 12 صفحة Astro تعتمد مباشرة على legacy HTML عبر `readFileSync`؛ عزلها يكسر build.
- `components/*.html`: fragments وليست routes عامة، ولا يوجد إثبات one-to-one يسمح بحذفها.
- `frontend/font-demo.html`: محمي صراحة لأن `frontend/` مطلوب لخدمة `brightai-api`.
- صفحات الأخطاء والملفات الخاصة محمية ولا تدخل quarantine قبل إغلاق special-file gate.

## Special Files

| File | In public/ | In dist/ | Result |
|---|---:|---:|---|
| `robots.txt` | Yes | Yes | PASS |
| `sitemap.xml` | Yes | Yes | PASS |
| `blog/feed.xml` | No | Yes | FAIL / needs explicit source mapping |
| `llms.txt` | Yes | Yes | PASS |
| `llms-full.txt` | Yes | Yes | PASS |
| `ai.txt` | Yes | Yes | PASS |
| `manifest.webmanifest` | Yes | Yes | PASS |
| `404.html` | No | Yes | FAIL / needs explicit source mapping |
| `500.html` | Yes | Yes | PASS |
| `favicon files` | Yes | Yes | PASS |
| `og-images` | No | No | FAIL / needs explicit source mapping |

ملاحظات:

- `blog/feed.xml` و`404.html` يتم توليدهما من Astro في `dist/` لكنهما غير موجودين حرفيًا داخل `public/`.
- صور OG موجودة تحت `public/images/og/` وليست تحت المسار المطلوب حرفيًا `public/og-images/`.
- favicon files موجودة تحت `public/images/` وتنسخ إلى `dist/images/`.

## Gate Status

- [x] `LEGACY-CLEANUP-INVENTORY.md` complete
- [x] Every legacy file mapped to Astro counterpart or marked DO NOT DELETE
- [ ] Special files verified in `public/` and `dist/`
- [ ] Build succeeds after quarantine
- [ ] All 87+ routes 200 after quarantine
- [ ] Delete in separate commit from quarantine
- [x] `render.yaml` UNTOUCHED
- [x] Reports created locally

## الخطوة المطلوبة قبل الاستئناف

يجب أولًا ترحيل أو اتخاذ قرار صريح للملفات الموسومة `DO NOT DELETE`، وإغلاق فروقات special files. بعدها فقط يعاد تشغيل التسلسل من Mapping ثم Quarantine.
