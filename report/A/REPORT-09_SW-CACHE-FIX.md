# REPORT-09: Service Worker Cache Fix

**Date**: 2026-06-29  
**Agent**: BrightAI Workspace Agent  
**Task**: إصلاح Service Worker: Cache Versioning، استراتيجيات التخزين، تحديث فوري  
**Status**: ✅ مكتمل  

---

## الملخص التنفيذي

المشكلة: `public/sw.js` كان موجود لكن `BaseLayout.astro` (سطور 211-235 سابقًا) كان يحتوي على `<script is:inline>` يفك تسجيل أي Service Worker ويمسح كل الـ caches. هذا تضارب صارخ: الملف موجود لكن الموقع يرفض تشغيله.

الحل:
1. **`public/sw.js`**: إعادة هيكلة كاملة — رفع CACHE_VERSION، تأمين skipWaiting + clients.claim، network-first للـ HTML مع /offline/ fallback، cache-first للـ fingerprinted assets والـ fonts
2. **`BaseLayout.astro`**: إزالة الـ unregister script + إضافة registration script لـ `/sw.js`
3. **التحقق**: بناء ناجح 125 صفحة بدون أخطاء ✅

---

## التغييرات

### 1. `public/sw.js`

| التغيير | من | إلى |
|---|---|---|
| CACHE_VERSION | `'2026-06-26-1'` | `'2026-06-29-1'` |
| skipWaiting | غير مؤمن | في install event — يفعّل الـ SW الجديد فورًا |
| clients.claim | موجود | مؤكد في activate event — يتحكم بكل الصفحات فورًا |
| استراتيجية HTML | network-first (موجود) | network-first مع 3 طبقات fallback: cached → /offline/ → 408 text |
| استراتيجية CSS/JS | cache-first لـ hashed (موجود) | أضيف Astro `/_astro/*.HASH.css/js` detection |
| PRECACHE_URLS | يشمل بعض المسارات | محدثة بدون أي `/frontend/` references |

### 2. `src/layouts/BaseLayout.astro`

| التغيير | التفاصيل |
|---|---|
| إزالة | الـ `<script is:inline>` الكامل (سطور 211-235 سابقًا) اللي كان يستدعي `navigator.serviceWorker.getRegistrations().then(r => r.unregister())` ويمسح كل الـ caches |
| إضافة | `<script is:inline>` يسجل الـ SW على `/sw.js` بعد `window.load` |

---

## استراتيجيات التخزين

```
Request → bypass? (api/backend/sitemap) → fetch through
        ↓
        HTML? → network-first → /offline/ fallback (ممنوع stale HTML)
        ↓
        CSS/JS fingerprinted? → cache-first (immutable, never changes)
        ↓
        CSS/JS not fingerprinted? → stale-while-revalidate
        ↓
        Image? → stale-while-revalidate (show cached, update in background)
        ↓
        Font? → cache-first (rarely changes, no fallback duplication)
        ↓
        Other → stale-while-revalidate
```

### networkFirstHtml (3 طبقات fallback)

1. Network fetch مع `cache: 'reload'` → يخزّن في HTML_CACHE + يرجع response
2. لو network فشل → يرجع cached copy
3. لو ما في cached copy → يرجع `/offline/`
4. لو `/offline/` مو مخزّن → يرجع 408 Timeout plain text (ما يموت أبدًا)

### isHashedAsset (محدث لـ Astro fingerprinting)

```
Astro pattern: /_astro/FILENAME.HASH.css
Regex: /\/_astro\/.*\.[a-f0-9]{8,}\.(css|js)$/i
```

---

## التحقق

| Check | Result |
|---|---|
| `npm run build` | ✅ 125 صفحات، 0 أخطاء |
| `/offline/` page موجودة | ✅ `dist/offline/index.html` موجودة |
| `public/sw.js` موجود | ✅ |
| SW registration script في BaseLayout | ✅ بعد ClientRouter |

---

## CACHE_VERSION Strategy

**القاعدة**: كل deploy يرفع CACHE_VERSION.

**الآلية الحالية**: يدوي — نغيّر القيمة في `public/sw.js` قبل كل deploy.

**الاقتراح للمستقبل (CI/CD)**:
```javascript
const CACHE_VERSION = self.__CACHE_VERSION__ || '2026-06-29-1';
```
مع تعويض من CI: `sed -i "s/__CACHE_VERSION__/$(date +%Y-%m-%d-%s)/g" public/sw.js`

**تنسيق الإصدار**: `YYYY-MM-DD-N` (حيث N تزيد مع كل deploy في نفس اليوم)

---

## معايير القبول

- [x] **لا stale HTML**: network-first للـ HTML. دائمًا آخر نسخة من السيرفر.
- [x] **لا offline crash**: 3 طبقات fallback. ما يموت أبدًا.
- [x] **CACHE_VERSION واضح**: `'2026-06-29-1'` — تاريخ + increment.
- [x] **skipWaiting**: الـ SW الجديد يشتغل فورًا بعد install.
- [x] **clients.claim**: يتحكم بكل الصفحات المفتوحة فورًا بعد activate.
- [x] **PRECACHE بدون /frontend/**: كل المسارات محدثة.
- [x] **Build ناجح**: 125 صفحة بدون أخطاء.

---

## المخاطر

| الخطر | الاحتمال | العلاج |
|---|---|---|
| SW يخزّن نسخة قديمة | منخفض | network-first يضمن آخر نسخة. الـ cache للـ offline فقط |
| SW registration يفشل | منخفض | `window.load` يضمن DOM جاهز. المتصفحات اللي ما تدعم SW تتجاهله |
| CACHE_VERSION ما يرتفع مع deploy | متوسط | الحل النهائي: CI pipeline. حاليًا يدوي |
| offline page 404 | منخفض | موجودة ✅ |

## Follow-up

1. **CI Pipeline**: إضافة auto-increment لـ CACHE_VERSION في deploy script
2. **IndexNow**: بعد deploy، تشغيل `npm run indexnow:trigger`
3. **GSC**: إعادة تقديم sitemap بعد deploy
4. **اختبار يدوي**: فتح الموقع في tab جديد والتأكد إن التعديلات الجديدة تظهر فورًا

---

## Rollback

```bash
git revert HEAD
npm run build
npm run deploy
```
