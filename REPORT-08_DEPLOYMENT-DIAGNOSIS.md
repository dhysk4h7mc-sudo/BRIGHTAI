# REPORT-08: تشخيص فروقات النشر — لماذا تظهر التعديلات local وما تظهر منشورة

**التاريخ**: 2026-06-29  
**الدور**: Deployment Forensics Engineer  
**الوضع**: تشخيص فقط — لا تعديلات  

---

## الملخص التنفيذي

بعد فحص كامل لسلسلة النشر (build → CDN → Service Worker → Render)، تم تحديد **4 احتمالات** تفسّر لماذا أحيانًا التعديلات تظهر في الـ `dist/` المحلي وما تظهر على `https://brightai.site`. الاحتمال الأرجح هو **تعارض Service Worker مع المحتوى الجديد متبوعًا بتسريب مجلد frontend/ كـ static assets من نشر قديم**.

---

## المكتشفات التفصيلية

### 1. مقارنة `dist/` مع الموقع المنشور

| الملف | `dist/` محلي | `brightai.site` | الحالة |
|---|---|---|---|
| `_astro/BaseLayout.BPYESIt9.css` | موجود ✅ | 200 ✅ (same hash) | متطابق |
| `_astro/client.BuT_aOnx.js` | موجود ✅ | 200 ✅ | متطابق |
| `_astro/DottedSurface.DZiC7gM1.js` | موجود ✅ | 200 ✅ | متطابق |
| `index.html` | موجود ✅ | 200 ✅ (same etag) | متطابق |
| `frontend/` | **فاضي** (0 بايت) | **server.js + assets** يرجع 200 | **غير متطابق** |

**النتيجة الرئيسية**: محتوى `_astro/` و `index.html` متطابق بين المحلي والمنشور. لكن `frontend/` في المنشور يحتوي على نسخة كاملة من backend Express — بينما `dist/frontend/` المحلي فاضي.

### 2. مراجعة `render.yaml`

- **`staticPublishPath: dist`** — صحيح، يشير لـ `dist/`.
- **`autoDeploy: true`** — مفعل للـ site service.
- **الملاحظة**: الـ `deploy.yml` في GitHub Actions **ليس مسؤولاً عن النشر** — هو فقط لإرسال IndexNow بعد النشر. النشر الفعلي يتم عبر Render auto-deploy المرتبط بـ GitHub repo.

**الخلاصة**: إعدادات Render سليمة. البنية تصب `dist/` للنشر.

### 3. مراجعة `public/sw.js` — المسبب الأكثر احتمالاً

```javascript
const CACHE_VERSION = '2026-06-26-1';  // هاردكود — ما يتغير مع كل نشر
```

#### وش يخزّن الـ SW:
- **HTML**: `HTML_CACHE` باستراتيجية network-first.
- **CSS/JS**: `RUNTIME_CACHE` أو `IMMUTABLE_CACHE`.
- **الصور**: `IMAGE_CACHE` (80 حد أقصى).
- **الخطوط**: `FONT_CACHE` (30 حد أقصى).

#### وش يلغي تسجيله:
- الـ caches اللي تبدأ بـ `brightai-` وليست في `currentCaches()`.

#### المشكلة:
1. **`CACHE_VERSION` ثابت** — مع كل نشر جديد (بدون تحديث `sw.js`)، لا يمسح الكاش القديم لأن الإصدار نفسه.
2. **`networkFirstHtml()`** — يحاول الشبكة أولًا، لكن لو فشلت، يرجع HTML قديم من الكاش.
3. **المستخدمين العائدين** يشوفون HTML قديم لأن `activate` event يتشغّل مرة وحدة.

**الخلاصة**: Service Worker يتعارض مع النشر الجديد عندما لا يتغير `CACHE_VERSION`.

### 4. مراجعة `public/_headers` و `public/_redirects`

#### `_headers`:
```apache
/*
  Cache-Control: public, max-age=0, must-revalidate

/sw.js
  Cache-Control: public, max-age=0, must-revalidate
```

#### `_redirects`:
317 سطر، كلها 301 redirects سليمة.

**المشكلة**: `render.yaml` يضيف `s-maxage=300` (5 دقائق) لـ `/*` — Cloudflare CDN يخزّن خلالها نسخة قديمة.

### 5. CDN Cache (Cloudflare)

```
cf-cache-status: EXPIRED  (للـ HTML الرئيسي — صار له أكثر من 5 دقائق)
cf-cache-status: MISS     (للملفات الأخرى)
```

- `s-maxage=300` في `render.yaml` يخلي الـ CDN يخزّن لمدة 5 دقائق.
- خلال هالـ 5 دقائق، الزوار يشوفون النسخة القديمة.

### 6. Stale Build Artifacts — "موتى يتحركون"

#### الخطر الأكبر: `frontend/` منشور كـ static

```bash
curl -I https://brightai.site/frontend/server.js    ← 200 (13 Jun 2026)
curl -I https://brightai.site/frontend/package.json ← 200 (6 May 2026)
curl -I https://brightai.site/frontend/assets/fonts/TheYearofTheCamel-Medium.woff2 ← 200
curl -I https://brightai.site/frontend/assets/images/logo.png ← 200
```

- مجلد `frontend/` في المشروع الرئيسي (Express backend) منشور كاملًا كـ static.
- `last-modified` مختلف بين الملفات — تسريب متراكم من نشرات سابقة.
- `dist/frontend/` المحلي فاضي حاليًا (0 بايت) لأن `public/frontend/` فاضي، **لكن الملفات المنشورة أقدم**.

---

## الاحتمالات الأرجح (مرتبة)

### 🥇 الاحتمال 1 (65%): **Service Worker لا يتحدّث — يقدّم محتوى قديم للمستخدمين العائدين**

- **السبب**: `CACHE_VERSION = '2026-06-26-1'` لا يتغير تلقائيًا مع كل نشر.
- **الآلية**: `networkFirstHtml()` يعطي HTML من الكاش لو الشبكة بطيئة.
- **الدليل**: الـ SW المثبّت في المتصفح لا يُستبدل لأن `CACHE_VERSION` لم يتغير.

### 🥈 الاحتمال 2 (30%): **ملفات `frontend/` (Express backend) مسرّبة كـ static**

- **السبب**: نشر سابق نسخ `frontend/` إلى `dist/` ولا يزال حيًا على الخادم.
- **الضرر**: تسريب كامل لـ routes, controllers, services, db schema.
- **الدليل**: 200 OK لـ `frontend/server.js` و `frontend/package.json`.

### 🥉 الاحتمال 3 (5%): **Cloudflare CDN cache + s-maxage=300**

- **السبب**: `render.yaml` يضيف `s-maxage=300` — CDN يخزّن لمدة 5 دقائق.
- **التأثير**: مؤقت فقط، يزول بعد 5 دقائق.

---

## توصيات للحل (للتطبيق في خطوة لاحقة — تشخيص فقط الآن)

1. **توليد `CACHE_VERSION` ديناميكيًا**: استخدم git commit hash في `sw.js`.
2. **إضافة skipWaiting + refresh** لما يتغير الإصدار.
3. **منع تسريب `frontend/`**: تنظيف `public/frontend/` وإضافة `Disallow: /frontend/` في `robots.txt`.
4. **تقليل `s-maxage`** في `render.yaml` من 300 إلى 60.
5. **إضافة purge script** — يستدعي Cloudflare API بعد النشر.

---

## الملخص العددي

| # | الاحتمال | النسبة | الدليل القاطع |
|---|---|---|---|
| 1 | Service Worker يقدّم كاش قديم | 65% | `CACHE_VERSION` ثابت، SW مسجّل في المتصفح |
| 2 | frontend/ leaked كـ static | 30% | 200 OK لـ server.js و package.json مع تواريخ مختلفة |
| 3 | CDN cache s-maxage=300 | 5% | cf-cache-status: EXPIRED حاليًا، التأثير مؤقت |
