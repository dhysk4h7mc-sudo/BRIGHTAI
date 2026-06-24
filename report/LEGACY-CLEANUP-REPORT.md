# Legacy Cleanup Report

> الحالة: **STOPPED BEFORE QUARANTINE**
> تحديث متابعة: 2026-06-24

## النتيجة التنفيذية

- تم جرد **129** ملف HTML tracked خارج `src/`.
- نجح `npm run build` وبنى **107** صفحات في `dist/`.
- الملفات المثبت تكافؤها مبدئيًا: **31**.
- الملفات المحمية أو غير المثبت تكافؤها: **98**.
- لم يتم إنشاء `_legacy_quarantine/`.
- لم يتم نقل أو حذف أي ملف.
- لم يتم تعديل `render.yaml`.
- لم يتم إنشاء commit أو push أو PR.

## تحديث 2026-06-24

- فحص `src/` الحالي لا يحتوي على `readFileSync` أو `readFile(`؛ اعتماد صفحات Astro على legacy HTML لم يعد موجودًا في source الحالي.
- صفحات legal/hub التي كانت مذكورة كاعتماد مباشر صارت مبنية من ملفات بيانات inline داخل `src/data/`.
- `blog/feed.xml` له مصدر Astro صريح: `src/pages/blog/feed.xml.ts`.
- `404.html` له مصدر Astro صريح: `src/pages/404.astro`.
- صورة OG الافتراضية معرفة في `src/data/site.ts` وتتحول إلى URL كامل عبر `src/components/SEOHead.astro`، والملف موجود في `public/images/og/brightai-og-1200x630.png`.
- أصول `frontend/` الثابتة التي يشير لها `src/` يجب أن تبقى mirrored تحت `public/frontend/` حتى تظهر في `dist/`.

## أسباب التوقف

- `kernel/offline.html`: لا يوجد له `dist/kernel/offline/index.html`، وفحص preview المحلي رجع 404.
- `report/index.html`: Astro يولد redirect shell إلى `/trust/` بدل محتوى report المكافئ.
- تم حل اعتماد `src/` على legacy HTML عبر `readFileSync` في الحالة الحالية؛ يبقى منع quarantine العام قائمًا بسبب صفحات/Fragments أخرى غير مثبت تكافؤها.
- `components/*.html`: fragments وليست routes عامة، ولا يوجد إثبات one-to-one يسمح بحذفها.
- `frontend/font-demo.html`: محمي صراحة لأن `frontend/` مطلوب لخدمة `brightai-api`.
- صفحات الأخطاء والملفات الخاصة محمية ولا تدخل quarantine قبل إغلاق special-file gate.

## Special Files

| File | In public/ | In dist/ | Result |
|---|---:|---:|---|
| `robots.txt` | Yes | Yes | PASS |
| `sitemap.xml` | Yes | Yes | PASS |
| `blog/feed.xml` | Generated | Yes | PASS |
| `llms.txt` | Yes | Yes | PASS |
| `llms-full.txt` | Yes | Yes | PASS |
| `ai.txt` | Yes | Yes | PASS |
| `manifest.webmanifest` | Yes | Yes | PASS |
| `404.html` | Generated | Yes | PASS |
| `500.html` | Yes | Yes | PASS |
| `favicon files` | Yes | Yes | PASS |
| `og-images` | Yes | Yes | PASS |

ملاحظات:

- `blog/feed.xml` و`404.html` يتم توليدهما من Astro في `dist/` عبر `src/pages/blog/feed.xml.ts` و`src/pages/404.astro`.
- صور OG موجودة تحت `public/images/og/`، وهذا هو المسار المستخدم فعليًا في `SITE.ogImage`.
- favicon files موجودة تحت `public/images/` وتنسخ إلى `dist/images/`.

## Gate Status

- [x] `LEGACY-CLEANUP-INVENTORY.md` complete
- [x] Every legacy file mapped to Astro counterpart or marked DO NOT DELETE
- [x] Special files verified in `public/` and `dist/`
- [ ] Build succeeds after quarantine
- [ ] All 87+ routes 200 after quarantine
- [ ] Delete in separate commit from quarantine
- [x] `render.yaml` UNTOUCHED
- [x] Reports created locally

## الخطوة المطلوبة قبل الاستئناف

يجب أولًا ترحيل أو اتخاذ قرار صريح للملفات الموسومة `DO NOT DELETE`، وإغلاق فروقات special files. بعدها فقط يعاد تشغيل التسلسل من Mapping ثم Quarantine.
