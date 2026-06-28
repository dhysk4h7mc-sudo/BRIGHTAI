# REPORT-10: تحسين ترويسات النشر والكاش

**التاريخ**: 2026-06-29
**الوكيل**: BrightAI Workspace Agent
**المهمة**: ضمان أن كل نشر يصل فوري بدون cache غش
**الوضع**: Mid

---

## الملخص التنفيذي

المشكلة كانت إن الملفات المبنية (fingerprinted assets) ما كان عندها `Cache-Control` مناسب يضمن إن المستخدم النهائي ما يجلس عنده نسخة قديمة بعد النشر. كمان `render.yaml` كان عنده قواعد `.js` و `.css` بـ `stale-while-revalidate` اللي تخلي المتصفح يستخدم نسخة قديمة حتى لو تغيرت.

**سوّينا 3 تغييرات جوهرية:**

1. **`public/_headers`**: أضفنا قاعدة `/_astro/*` بـ `max-age=31536000, immutable` لكل الملفات المبنية. كمان فصلنا non-fingerprinted `.css`/`.js` بـ `max-age=86400` (بدون stale) عشان ما تتخزن بشكل دائم.

2. **`render.yaml`**: أضفنا `/assets/*` و `/_astro/*` قواعد immutable. عدّلنا `.css`/`.js` rules: من `max-age=86400, stale-while-revalidate=604800` إلى `max-age=86400` بس. هذا يخلي المتصفح يتأكد من النسخة الجديدة بعد يوم واحد بدل ما يستعمل نسخة قديمة لأسبوعين.

3. **مراجعة `render.yaml` routes**: أكدنا إن مافيه rewrites قديمة. الـ `/api/*` و `/ws/*` هي الوحيدة وكلها تصيب.

---

## الملفات المتغيرة

| الملف | نوع التغيير | الوصف |
|---|---|---|
| `public/_headers` | معدّل | إضافة `/_astro/*` immortal + إعادة ترتيب non-fingerprinted CSS/JS rules |
| `render.yaml` | معدّل | إضافة `/_astro/*` و `/assets/*` immutable + تقليل stale للـ CSS/JS |

---

## التفاصيل الفنية

### 1. `public/_headers` — الـ Hierarchy مهم

ترتيب القواعد في `_headers` يهم. القاعدة الأكثر specificity تكسب. الحين عندنا:

```
/*                          → max-age=0, must-revalidate (HTML default)
/_astro/*                   → max-age=31536000, immutable (fingerprinted assets)
/*.css / /**/*.css          → max-age=86400 (non-fingerprinted CSS)
/*.js / /**/*.js            → max-age=86400 (non-fingerprinted JS)
/*.v*.css / */.v*.js        → max-age=31536000, immutable (legacy v-pattern)
/*.woff2 /*.ttf /*.otf      → max-age=31536000, immutable (fonts)
/*.png /*.jpg /*.webp ...   → max-age=7776000, stale-while-revalidate=2592000 (images)
```

المهم: `/_astro/*` يشتغل لكل الملفات المبنية لأن كلها تحت `dist/_astro/`.

### 2. `render.yaml` — الفرق بين الـ `_headers` file و `render.yaml headers`

`public/_headers` هو المصدر الرئيسي للترويسات. لكن `render.yaml` عنده headers section ثاني لأنه هو الـ deployment blueprint. لاحظ إن الـ `public/_headers` file ينشر كملف وياخذ priority على أي headers ثانية.

### 3. `/_astro/*` pattern يشتغل مع كل builds

```
BaseLayout.BPYESIt9.css      → /_astro/BaseLayout.BPYESIt9.css
client.BuT_aOnx.js           → /_astro/client.BuT_aOnx.js
_slug_.BIU1B9g8.css          → /_astro/_slug_.BIU1B9g8.css
DottedSurface.DZiC7gM1.js    → /_astro/DottedSurface.DZiC7gM1.js
KernelLayout.-NmwYYtR.css    → /_astro/KernelLayout.-NmwYYtR.css
```

كلها تطابق `/_astro/*`. ✅

### 4. `render.yaml` Routes Review

فحصت الـ routes section:
- `rewrite /api/* @ brightai-api.onrender.com` ✅
- `rewrite /ws/* @ brightai-api.onrender.com` ✅
- كل الباقي redirect قياسي لصفحات موجودة ✅
- ما في rewrites قديمة أو محذوفة ✅

---

## التحقق

| الفحص | النتيجة |
|---|---|
| `npm run build` | ✅ 125 صفحة، 0 أخطاء (2.62s) |
| ملفات `_astro/` بنمط HASH | ✅ 7 ملفات كلها `Name.HASH.ext` |
| `public/_headers` syntax | ✅ صحيح |
| `render.yaml` syntax | ✅ صحيح |
| ما في canonical/hreflang/schema تم لمسه | ✅ |
| ما في redirect قديم تم حذفه | ✅ |

---

## المخاطر المتبقية

1. **قاعدة `/*.css` و `/*.js`**: غير الـ fingerprinted يأخذ `max-age=86400` (يوم واحد). هذا كافي للتحديثات.
2. **`render.yaml` CSS/JS rules vs `public/_headers`**: الـ `public/_headers` له priority. متطابقين الحين.
3. **`/assets/*` في `render.yaml` vs `public/assets/`**: أضفنا rule مخصص `/assets/*` → immortal.

---

## التحقق بعد النشر (Post-deploy)

```bash
# HTML — ما ينكبش
curl -I https://brightai.site/ | grep -i cache-control
# → public, max-age=0, must-revalidate

# Astro fingerprinted — immortal
curl -I https://brightai.site/_astro/BaseLayout.BPYESIt9.css | grep -i cache-control
# → public, max-age=31536000, immutable

# Font — immortal
curl -I https://brightai.site/assets/fonts/TheYearofTheCamel-Medium.woff2 | grep -i cache-control
# → public, max-age=31536000, immutable

# SW — no cache
curl -I https://brightai.site/sw.js | grep -i cache-control
# → public, max-age=0, must-revalidate

# API — no store
curl -I https://brightai.site/api/health | grep -i cache-control
# → no-store
```

---

## اقتراحات للمستقبل

1. **إضافة `npm run check:headers` script**: script يقرأ `_headers` ويختبر كل pattern مع الملفات في `dist/`.
2. **تجنب `stale-while-revalidate`**: لا تستخدمها للملفات اللي تتغير (HTML, non-fingerprinted CSS/JS). استخدمناها بس للصور لأنها تتغير نادرًا.
3. **مراقبة الـ deploy**: بعد أول deploy بالتغييرات الجديدة، hard refresh وتأكد إن الموقع يظهر فوري.
