# خطة تنفيذ تحسين السيو السعودي والأداء وموثوقية النشر لموقع BrightAI

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** إصلاح أخطاء أرشفة hreflang، وإلغاء تسجيل الـ Service Worker القديم ومسح الكاش محلياً وعلى Render، وتحسين الميتادات لصفحات الحلول والمدن السعودية لرفع الـ CTR وتجنب أخطاء الزحف.

**Architecture:** 
1. تعديل `SEOHead.astro` للتحقق ديناميكياً من التكافؤ القانوني قبل توليد hreflang الإنجليزي.
2. إضافة سكربت تنظيف في `BaseLayout.astro` لإلغاء تسجيل الـ Service Workers القديمة ومسح الكاش في المتصفحات.
3. استبعاد ملفات الـ Service Worker من التخزين المؤقت في `render.yaml`.
4. تحسين نصوص الميتادات وعلامات السيو لصفحات الحلول والمدن في `solutions.ts`.

**Tech Stack:** Astro, JavaScript, YAML, JSON-LD Schema.

---

### Task 1: إصلاح منطق الـ Hreflang في `SEOHead.astro`

**Files:**
- Modify: `src/components/SEOHead.astro`

- [ ] **Step 1: تعديل كود `src/components/SEOHead.astro` لمنع توليد روابط `/en/` غير الموجودة**

استبدل الأسطر 37-48 في `src/components/SEOHead.astro`:
```typescript
/* ─── Auto-derive en-SA hreflang for Arabic pages ───
   If the page is Arabic (locale='ar') and an en-SA alternate isn't
   already provided, derive it from the canonical URL so search
   engines can find the English counterpart. */
const isArabic = locale === 'ar';
const hasEnSA = hreflang.some((link) => link.lang === 'en-SA');
const enrichedHreflang = [...hreflang];
if (isArabic && !hasEnSA && canonical) {
  const enHref = canonical.replace(`${SITE.url}/`, `${SITE.url}/en/`);
  enrichedHreflang.push({ lang: 'en-SA', href: enHref });
}
const finalHasXDefault = enrichedHreflang.some((link) => link.lang === 'x-default');
```

بالكود التالي الذي يستورد `LEGAL_I18N_PAIRS` ويتحقق من تواجد الصفحة الفعلية بالإنجليزية قبل التوليد التلقائي:
```typescript
import { LEGAL_I18N_PAIRS } from '../data/i18n-pairs';

const isArabic = locale === 'ar';
const hasEnSA = hreflang.some((link) => link.lang === 'en-SA');
const enrichedHreflang = [...hreflang];

// التحقق من أن المسار الحالي يحتوي على ترجمة إنجليزية معتمدة
let hasEnglishCounterpart = false;
if (canonical) {
  try {
    const urlObj = new URL(canonical);
    const cleanPathname = urlObj.pathname;
    const foundPair = LEGAL_I18N_PAIRS.find(
      (pair) => pair.arabic === cleanPathname || pair.english === cleanPathname
    );
    if (foundPair) {
      hasEnglishCounterpart = true;
    }
  } catch (e) {
    hasEnglishCounterpart = false;
  }
}

if (isArabic && !hasEnSA && canonical && hasEnglishCounterpart) {
  const enHref = canonical.replace(`${SITE.url}/`, `${SITE.url}/en/`);
  enrichedHreflang.push({ lang: 'en-SA', href: enHref });
}
const finalHasXDefault = enrichedHreflang.some((link) => link.lang === 'x-default');
```

- [ ] **Step 2: التحقق من خلو البناء من الأخطاء**
قم بتشغيل البناء للتأكد من توافق التغيير:
Run: `npm run build`
Expected: البناء ينتهي بنجاح وبدون أخطاء تجميع.

---

### Task 2: التخلص من كاش الـ Service Worker القديم ومسح ذاكرة المتصفح

**Files:**
- Modify: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: إضافة سكربت مضمن (inline) في وسم `<head>` في `src/layouts/BaseLayout.astro` لإلغاء تسجيل الـ Service Worker ومسح الكاش**

أضف الكود التالي في `src/layouts/BaseLayout.astro` قبل إغلاق وسم `</head>` (مثلاً بعد كود Microsoft Clarity أو في نهاية الرأس):
```astro
  {/* Unregister old Service Workers and clear caches */}
  <script is:inline>
    (function() {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(function(registrations) {
          for (let registration of registrations) {
            registration.unregister().then(function() {
              console.log('Old Service Worker unregistered successfully.');
            });
          }
        }).catch(function(err) {
          console.error('Error unregistering service workers:', err);
        });
      }
      if ('caches' in window) {
        caches.keys().then(function(names) {
          for (let name of names) {
            caches.delete(name);
          }
        }).catch(function(err) {
          console.error('Error clearing caches:', err);
        });
      }
    })();
  </script>
```

- [ ] **Step 2: التحقق من البناء محلياً**
Run: `npm run build`
Expected: البناء يمر بنجاح.

---

### Task 3: تحديث إعدادات التخزين المؤقت (Cache) في Render لمنع كش الـ Service Worker

**Files:**
- Modify: `render.yaml`

- [ ] **Step 1: إضافة استثناءات لملفات `sw.js` و `service-worker.js` في `render.yaml`**

في ملف `render.yaml` تحت الخدمة `brightai-site` وبداخل قسم `headers` وقبل القاعدة العامة لـ `*.js` (تقريباً عند السطر 142):
أضف القواعد التالية:
```yaml
      - path: /sw.js
        name: Cache-Control
        value: no-store, no-cache, must-revalidate, max-age=0
      - path: /service-worker.js
        name: Cache-Control
        value: no-store, no-cache, must-revalidate, max-age=0
```

- [ ] **Step 2: التحقق من بنية ملف `render.yaml`**
تأكد من صحة مسافات الـ YAML والمسافات البادئة لتطابق باقي ملف `render.yaml`.

---

### Task 4: تحسين ميتادات صفحات الحلول والقطاعات والمدن السعودية لرفع الـ CTR

**Files:**
- Modify: `src/data/solutions.ts`

- [ ] **Step 1: تحديث العناوين والأوصاف التعريفية للحلول الرئيسية في `src/data/solutions.ts`**

قم بتحديث قيم `title` و `description` للحلول التالية:
1. `ai-governance-platform` (منصة حوكمة الذكاء الاصطناعي):
```typescript
    title:'منصة حوكمة الذكاء الاصطناعي للشركات السعودية | امتثال PDPL & NCA',
    description:'منصة BrightAI لحوكمة الذكاء الاصطناعي تمنح المؤسسات رؤية مركزية على استخدام AI، متوافقة مع نظام حماية البيانات الشخصية PDPL وضوابط الأمن السيبراني NCA.',
```

2. `ai-firewall` (جدار حماية الذكاء الاصطناعي):
```typescript
    title:'AI Firewall لحماية بيانات الشركات | منع تسريب البيانات الشخصية',
    description:'جدار حماية الذكاء الاصطناعي (AI Firewall) يفحص مدخلات ومخرجات LLM ويمنع تسريب البيانات الحساسة للمؤسسات السعودية متوافقاً مع ضوابط الأمن السيبراني NCA.',
```

3. `ai-audit-trail` (سجل تدقيق الذكاء الاصطناعي):
```typescript
    title:'سجل تدقيق الذكاء الاصطناعي (AI Audit Trail) | امتثال NCA و PDPL',
    description:'سجل تدقيق مشفر وغير قابل للتعديل لكافة عمليات الذكاء الاصطناعي داخل المؤسسة. يوثق طلبات وردود نماذج الذكاء الاصطناعي لضمان الامتثال التام للجهات التنظيمية.',
```

4. `ai-evidence-file` (ملف أدلة الامتثال للذكاء الاصطناعي):
```typescript
    title:'ملف أدلة امتثال الذكاء الاصطناعي (AI Evidence File) | جاهز للتدقيق',
    description:'توليد ملفات أدلة الامتثال والتقارير الموقعة رقمياً لتقديمها للمدققين والجهات التنظيمية السعودية مثل سدايا (SDAIA) وهيئة الأمن السيبراني (NCA).',
```

- [ ] **Step 2: التحقق من عمل السكربتات المخصصة للسيو والتأكد من مطابقتها بعد البناء**
Run: `npm run build`
Expected: البناء ينتهي بنجاح ويقوم بتشغيل سكربتات المزامنة للسيو والـ schemas.
