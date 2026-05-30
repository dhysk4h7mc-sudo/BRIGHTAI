# BrightAI Kernel

توثيق واجهات نواة BrightAI داخل المسار `kernel/`.

آخر تحديث توثيقي: 2026-05-31

## الهدف

`kernel/` هو سطح HTML ثابت لواجهة حوكمة استخدامات الذكاء الاصطناعي في BrightAI. الواجهات هنا تعرض رحلة تشغيل كاملة تشمل المحادثة، الإحصائيات، الموافقات، سجل التدقيق، الأدلة، التقارير، السيناريوهات، الامتثال، السياسات، والموصلات.

هذا المسار يعتمد على HTML/CSS/JavaScript مباشرة بدون React أو إطار Frontend داخل نفس المسار. كل صفحة تستخدم وحدات JavaScript مشتركة تحت `kernel/assets/js/`، وتتصل افتراضياً بواجهة الإنتاج `/api/kernel`.

## القاعدة التشغيلية الحالية

- الوضع الافتراضي هو Production API عبر `/api/kernel`.
- بيانات المحاكاة لا تعمل إلا عند تفعيل toggle واضح باسم `بيانات تجريبية`.
- عند فتح الصفحات مباشرة عبر `file://` يتم تفعيل البيانات التجريبية تلقائياً حتى تبقى المعاينة المحلية شغالة بدون backend.
- لا يتم تحويل جلسة HTTP/HTTPS إلى demo بصمت عند فشل Production API.
- `kernel-api.js` هو API client وتطبيع البيانات فقط، بينما demo store وmock interception وبانر البيانات التجريبية مفصولة في ملفات مستقلة.

## هيكل الملفات

```text
kernel/
├── README.md
├── manifest.json
├── index.html
├── chat.html
├── stats.html
├── approvals.html
├── audit.html
├── evidence.html
├── reports.html
├── scenarios.html
├── compliance.html
├── policies.html
├── connectors.html
├── assets/
│   ├── css/
│   │   └── kernel.css
│   └── js/
│       ├── kernel-api.js
│       ├── kernel-chat-client.js
│       ├── kernel-compliance.js
│       ├── kernel-demo-banner.js
│       ├── kernel-demo-store.js
│       ├── kernel-mobile.js
│       ├── kernel-mock-handlers.js
│       ├── kernel-nav.js
│       ├── kernel-reports.js
│       ├── kernel-stats.js
│       └── kernel-utils.js
└── api/
    └── mock/
        ├── approvals.json
        ├── audit.json
        ├── compliance.json
        ├── connectors.json
        ├── evidence.json
        ├── policies.json
        ├── scenarios.json
        └── stats.json
```

## الصفحات

| الملف | الدور |
| --- | --- |
| `index.html` | Dashboard تشغيلية مختصرة: status strip، ثلاثة إجراءات رئيسية، مؤشرات، وآخر traces. |
| `chat.html` | واجهة محادثة آمنة مع تحليل مخاطر، PII، سياسات، مزود، وسجل trace. |
| `stats.html` | Dashboard للإحصائيات، توزيع الحالات، المخاطر، الأقسام، وآخر Trace IDs. |
| `approvals.html` | لوحة الموافقات البشرية للطلبات عالية المخاطر أو المعلقة. |
| `audit.html` | عارض سلسلة التدقيق والتحقق من سلامة السجلات. |
| `evidence.html` | عرض الأدلة المرتبطة بالقرارات، مع تصدير PDF داخل المتصفح عند الحاجة. |
| `reports.html` | واجهة التقارير، الفلاتر، التحميل، الإنشاء، والجدولة. |
| `scenarios.html` | سيناريوهات اختبار جاهزة ترسل المستخدم إلى `chat.html` مع prompt محدد. |
| `compliance.html` | عرض حزم الامتثال وحالة المتطلبات حسب الإطار التنظيمي. |
| `policies.html` | محرر سياسات بصري مع CRUD، preview محلي، وtoggle `بيانات تجريبية`. |
| `connectors.html` | عرض موصلات قراءة تجريبية لأنظمة المؤسسة بدون الوصول لبيانات حقيقية. |

## تحديث Dashboard الرئيسية

تمت إعادة تنظيم `kernel/index.html` كصفحة dashboard عملية بدل صفحة landing مزخرفة.

ترتيب الصفحة الحالي:

1. `status strip`: يعرض حالة المزود، قاعدة البيانات، ووقت آخر تحديث.
2. `primary actions`: ثلاثة مسارات تشغيل مباشرة فقط:
   - تشغيل محادثة آمنة عبر `/kernel/chat/`.
   - مراجعة الموافقات عبر `/kernel/approvals/`.
   - فتح سجل التدقيق عبر `/kernel/audit/`.
3. `metrics`: إجمالي الطلبات، الطلبات بانتظار الموافقة، متوسط المخاطر، ونسبة كشف `PII`.
4. `recent traces`: آخر خمسة سجلات من `latestTraces`، مع fallback إلى `/api/kernel/audit` إذا لم ترجع الإحصائيات traces.

قواعد التنفيذ:

- لا توجد مكتبات جديدة؛ الصفحة تعتمد على وحدات Kernel المشتركة تحت `kernel/assets/js/` بدون إطار Frontend إضافي.
- الصفحة تستخدم نفس هوية BrightAI الداكنة مع تقليل الزخرفة والحفاظ على سطح تشغيلي واضح.
- `Production API` يبقى الافتراضي، ولا يتم تفعيل demo بصمت عند فشل الاتصال.
- القيم المختلطة مثل `Trace ID` معزولة بصرياً باتجاه `LTR` داخل الواجهة العربية.
- روابط الأدلة في جدول traces تمرر `traceId` إلى `/kernel/evidence/`.
- تم تحديث head للصفحة بإزالة منع التكبير من viewport، وإضافة Open Graph/Twitter tags، وتحويل JSON-LD إلى صيغة array صالحة للفحص المحلي.

## تحديث واجهة المحادثة

تم تحسين `kernel/chat.html` و`kernel/assets/js/kernel-chat-client.js` بحيث تعرض واجهة المحادثة بطاقة حوكمة بعد كل طلب تتم معالجته أو تعليقه أو حظره.

البطاقة تعرض القيم التالية بشكل ثابت:

- `Risk score`: درجة المخاطر كنسبة مئوية مع لون مناسب لمستوى الخطر.
- `PII detected`: هل تم كشف بيانات شخصية أو حساسة، مع عرض نوع البيانات عند توفره.
- `Firewall action`: قرار جدار الحوكمة مثل `allowed`, `blocked`, أو `pending_approval`.
- `Trace ID`: معرف التتبع بصيغة قابلة للقراءة والنسخ البصري، مع عزل اتجاهه كـ LTR داخل واجهة RTL.

وتوفر البطاقة ثلاثة إجراءات مباشرة:

- `Audit`: يفتح سجل التدقيق مع تمرير `trace_id` عند توفره.
- `Evidence`: يفتح صفحة الأدلة المرتبطة بنفس `trace_id`.
- `Create Policy`: يفتح محرر السياسات في وضع إنشاء سياسة جديدة مع ربطها بالسياق عند توفر `trace_id`.

قواعد العرض المهمة:

- البطاقة تظهر في الردود العادية، الطلبات المعلقة للموافقة، ورسائل الحظر.
- تصميم البطاقة يحافظ على `dir="rtl"` مع عزل القيم المختلطة مثل `Trace ID`.
- أزرار `Audit`, `Evidence`, و`Create Policy` تستخدم grid responsive: ثلاثة أعمدة على الشاشات الواسعة، عمودين على الجوال المتوسط، وعمود واحد تحت `420px` لمنع التداخل.
- `kernel-chat-client.js` يحتوي نسخة DOM مستقلة من منطق البطاقة حتى تبقى الرسائل التي ينشئها client module متسقة مع بطاقة `chat.html`.

كل صفحات HTML تعتمد على:

- `/kernel/assets/css/kernel.css`
- `/kernel/assets/js/kernel-utils.js`
- `/kernel/assets/js/kernel-api.js`
- `/kernel/assets/js/kernel-demo-store.js`
- `/kernel/assets/js/kernel-mock-handlers.js`
- `/kernel/assets/js/kernel-demo-banner.js`
- `/kernel/assets/js/kernel-nav.js`
- `/frontend/js/unified-header.js`
- `/frontend/js/production-runtime.v20260427.js`

بعض الصفحات تضيف وحدات مخصصة مثل `kernel-stats.js`, `kernel-reports.js`, `kernel-compliance.js`, `kernel-chat-client.js`, و`kernel-mobile.js`.

## وحدات JavaScript

| الملف | المسؤولية | أهم exports |
| --- | --- | --- |
| `kernel/assets/js/kernel-api.js` | API client، أخطاء API، وتطبيع بيانات الإحصائيات والسجلات. | `window.kernelAPI`, `window.KernelAPI`, `window.APIError`, `window.normalizeStats`, `window.KernelApiHelpers` |
| `kernel/assets/js/kernel-demo-store.js` | حالة demo mode، تحميل mock database، hardcoded fallback، localStorage، live feed، وتحديثات `kernel-demo-update`. | `window.KernelDemoStore`, `window.kernelShouldUseDemoData`, `window.kernelDemoDataSelected` |
| `kernel/assets/js/kernel-mock-handlers.js` | اعتراض `/api/kernel` عند تفعيل demo، ومحاكاة chat/approvals/evidence/policies/providers/health. | `window.KernelMockHandlers` |
| `kernel/assets/js/kernel-demo-banner.js` | واجهة banner وتبديل `بيانات تجريبية` وإعادة تعيين قاعدة demo. | `window.KernelDemoBanner` |
| `kernel/assets/js/kernel-utils.js` | أدوات مشتركة: escape HTML، formatters، debounce/throttle، theme، clipboard، animations. | `window.KernelUtils` |
| `kernel/assets/js/kernel-nav.js` | تعريف صفحات Kernel، بناء navigation، active route، عداد الموافقات، وشريط حالة المزود/قاعدة البيانات المشترك. | `window.KernelNav` |
| `kernel/assets/js/kernel-mobile.js` | drawer، bottom nav، touch gestures، pull-to-refresh، وسلوك الجوال. | `window.KernelMobile` |
| `kernel/assets/js/kernel-chat-client.js` | واجهة المحادثة، retry، typewriter، history، approve/reject من داخل المحادثة. | `window.KernelChatClient` |
| `kernel/assets/js/kernel-stats.js` | تحميل الإحصائيات، refresh دوري، charts، وتفاعل مع حدث `kernel-demo-update`. | `window.KernelStats` |
| `kernel/assets/js/kernel-reports.js` | تحميل التقارير، إنشاء تقرير، تحميل، جدولة، وفلاتر. | `window.KernelReports` |
| `kernel/assets/js/kernel-compliance.js` | تعريف أطر الامتثال ومتطلبات كل إطار وحساب الدرجات وعرض البطاقات. | `KernelCompliance` |

## CSS والتصميم

`kernel/assets/css/kernel.css` هو ملف التصميم الأساسي للواجهات. أهم ما يغطيه:

- متغيرات ألوان ومسافات وظلال داخل `:root`.
- دعم RTL عبر `html[dir="rtl"]`.
- layout مشترك للـ sidebar، main content، cards، tables، forms، badges، buttons، modals، toasts.
- responsive breakpoints للجوال والتابلت.
- حالات status/risk للموافقات، الإحصائيات، وسجل التدقيق.

الهوية البصرية الحالية داكنة ومؤسسية، مع cyan كـ brand color ودرجات success/warning/danger واضحة.

## شريط حالة Kernel المشترك

تمت إضافة status bar مشترك لكل صفحات `kernel/` عبر `kernel/assets/js/kernel-nav.js`، ويظهر مباشرة أسفل تنقل Kernel العلوي. الشريط يقرأ حالتين فقط من واجهات الإنتاج:

- `/api/kernel/providers` لمعرفة المزود النشط وحالته.
- `/api/kernel/health` لمعرفة حالة قاعدة البيانات وصحة Kernel.

قواعد العرض:

- لا يعرض أي API key أو secrets أو raw provider payload.
- يعرض NVIDIA بصيغة `NVIDIA · Connected` فقط إذا كان `configured=true` و`mode=production`.
- يعرض حالة قاعدة البيانات كـ `Connected` أو `Degraded` بناءً على health response.
- يعرض `Degraded` بشكل واضح إذا كان المزود fallback أو `local` أو demo adapter.
- يعرض `Fallback / Local demo` في خانة mode عند تفعيل fallback أو local demo.
- عند تعذر الوصول إلى endpoints، يتحول الشريط إلى degraded state بدل fallback صامت.

التنسيق الخاص بالشريط موجود داخل `kernel/assets/css/kernel.css` تحت قسم `Shared Kernel Status Bar`.

## Production API

الواجهات تتعامل مع API تحت `/api/kernel`. أهم المسارات المستخدمة أو المدعومة من client/mock layer:

| Endpoint | الاستخدام |
| --- | --- |
| `/api/kernel/providers` | حالة المزود النشط وقائمة المزودين. |
| `/api/kernel/health` | صحة Kernel والمزود. |
| `/api/kernel/stats` | مؤشرات الاستخدام، المخاطر، PII، وأحدث traces. |
| `/api/kernel/audit` | سجل التدقيق مع فلاتر search/department/risk. |
| `/api/kernel/chain` | سلسلة التدقيق. |
| `/api/kernel/chain/verify` | التحقق من سلسلة التدقيق. |
| `/api/kernel/approvals` | جلب، اعتماد، أو رفض الطلبات. |
| `/api/kernel/pending` | alias للطلبات المعلقة. |
| `/api/kernel/evidence` | أدلة القرارات مع دعم `traceId` و`trace_id`. |
| `/api/kernel/evidence/:id` | تفاصيل أو تصدير سجل دليل واحد. |
| `/api/kernel/compliance` | حالة الامتثال. |
| `/api/kernel/compliance/check` | فحص امتثال. |
| `/api/kernel/chat` | إرسال رسالة chat إلى Kernel. |
| `/api/kernel/policies` | قراءة/إضافة سياسات. |
| `/api/kernel/policies/:id` | تعديل أو حذف سياسة. |
| `/api/kernel/reports` | تحميل التقارير من صفحة reports. |
| `/api/kernel/reports/generate` | إنشاء تقرير. |
| `/api/kernel/reports/:id/download` | تحميل تقرير. |
| `/api/kernel/reports/schedule` | جدولة تقرير. |

ملاحظة مهمة: mock handler داخل `kernel-mock-handlers.js` يغطي مسارات Kernel الأساسية مثل stats/audit/chain/approvals/evidence/compliance/chat/policies/providers/health. أما reports فتملك fallback محلي داخل `kernel-reports.js` عندما تكون `بيانات تجريبية` مفعلة أو عند `file://`.

## وضع البيانات التجريبية

المفتاح المستخدم:

```text
brightai_kernel_demo_mode
```

القيم:

- `false`: الوضع الافتراضي. استخدم Production API ولا تعترض `/api/kernel`.
- `true`: فعّل mock interception واستخدم بيانات محلية صناعية.
- `file://`: يعتبر demo active تلقائياً مهما كانت قيمة localStorage، لأن fetch إلى API لا يكون متاحاً عادة.

مفاتيح localStorage ذات علاقة:

| المفتاح | الغرض |
| --- | --- |
| `brightai_kernel_demo_mode` | اختيار المستخدم لوضع البيانات التجريبية. |
| `brightai_kernel_mock_db` | قاعدة mock موحدة بعد تحميل ملفات JSON أو hardcoded fallback. |
| `brightai-chat-<sessionId>` | سجل محادثة محلي داخل `kernel-chat-client.js`. |

قواعد مهمة:

- لا تجعل demo هو الافتراضي في HTTP/HTTPS.
- لا تضبط `brightai_kernel_demo_mode` إلى `true` عند فشل production API.
- عند إضافة صفحة جديدة تستخدم `/api/kernel`، تأكد أنها تحمل `kernel-api.js` قبل أي سكربت يعتمد على `kernelAPI`.
- إذا احتجت fallback بصري، اربطه بـ `window.kernelShouldUseDemoData()` بدل fallback صامت دائماً.

## Mock Data

ملفات mock موجودة في `kernel/api/mock/`.

| الملف | الشكل | الاستخدام |
| --- | --- | --- |
| `kernel/api/mock/stats.json` | object | مؤشرات عامة وتوزيع حالات ومخاطر وأقسام. |
| `kernel/api/mock/audit.json` | object | `rows` و`entries` لسجل التدقيق. |
| `kernel/api/mock/approvals.json` | object | `pending`, `recent`, `summary`. |
| `kernel/api/mock/evidence.json` | object | قائمة أدلة وتفاصيل حسب trace/id. |
| `kernel/api/mock/compliance.json` | object | حالة أطر الامتثال. |
| `kernel/api/mock/policies.json` | array | 10 سياسات PII/امتثال افتراضية. |
| `kernel/api/mock/connectors.json` | array | fixture للموصلات. |
| `kernel/api/mock/scenarios.json` | array | fixture للسيناريوهات. |

عند تفعيل demo، يحاول `kernel-demo-store.js` تحميل:

- `stats.json`
- `audit.json`
- `approvals.json`
- `evidence.json`
- `compliance.json`
- `policies.json`

إذا فشل تحميل هذه الملفات، يستخدم hardcoded fallback داخل `kernel-demo-store.js`.

## Manifest

`kernel/manifest.json` يعرّف تجربة PWA باسم:

```text
BrightAI Kernel - Enterprise AI Governance
```

ويحتوي على:

- `start_url: /`
- `scope: /`
- display standalone
- أيقونات inline SVG
- shortcuts إلى `chat.html` و`stats.html`

## إضافة صفحة جديدة

اتبع هذا النمط:

1. أنشئ HTML داخل `kernel/`.
2. استخدم `dir="rtl"` و`lang="ar"` أو ما يطابق الصفحة الحالية.
3. اربط `/kernel/assets/css/kernel.css`.
4. حمّل `kernel-utils.js`, ثم `kernel-api.js`, ثم `kernel-demo-store.js`, ثم `kernel-mock-handlers.js`, ثم `kernel-demo-banner.js`, ثم `kernel-nav.js`.
5. استدع `KernelNav.init('sidebarNav')` واضبط الصفحة النشطة عبر `KernelNav.setActive('<page-id>')`.
6. أضف الصفحة إلى `KernelNav.config.pages` داخل `kernel-nav.js`.
7. إذا استخدمت `/api/kernel` لا تضف fallback demo صامت؛ اعتمد على `window.kernelShouldUseDemoData()`.
8. حدّث هذا README إذا تغيرت البنية أو ظهرت واجهة جديدة.

## تعديل API أو demo mode

قبل تعديل API أو demo mode راجع هذه المناطق:

- `normalizeStats`
- `KernelAPI` داخل `kernel-api.js`
- `getHardcodedDefaults` و`ensureDBInitialized` داخل `kernel-demo-store.js`
- `handleMockRequest` وfetch wrapper حول `window.fetch` داخل `kernel-mock-handlers.js`
- `injectBannerUI` و`updateBannerUI` داخل `kernel-demo-banner.js`
- exports في نهاية كل ملف مشترك

بعد التعديل، شغّل:

```bash
node -c kernel/assets/js/kernel-api.js
node -c kernel/assets/js/kernel-demo-store.js
node -c kernel/assets/js/kernel-mock-handlers.js
node -c kernel/assets/js/kernel-demo-banner.js
```

وشغّل syntax check لأي JS آخر تغير.

## أوامر التحقق

الأوامر الموصى بها بعد أي تعديل في `kernel/`:

```bash
git diff --check
node -c kernel/assets/js/kernel-api.js
node -c kernel/assets/js/kernel-demo-store.js
node -c kernel/assets/js/kernel-mock-handlers.js
node -c kernel/assets/js/kernel-demo-banner.js
node -c kernel/assets/js/kernel-stats.js
node -c kernel/assets/js/kernel-reports.js
npm run seo:gate
```

بعد تعديل `kernel/index.html` تحديداً، تحقق أيضاً من السكربت المضمن وSEO المحلي:

```bash
node -e "const fs=require('fs'); const html=fs.readFileSync('kernel/index.html','utf8'); const scripts=[...html.matchAll(/<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/gi)].map(m=>m[1]); const json=scripts.find(s=>s.includes('schema.org')); JSON.parse(json); scripts.filter(s=>!s.trim().startsWith('{')&&!s.trim().startsWith('[')).forEach(s=>new Function(s)); console.log('json-ld and inline scripts ok');"
node scripts/seo-health-check.mjs
```

وإذا كانت أداة `google-indexing-seo-guardian` متاحة داخل `.agents/skills`، شغّل فحص الصفحة المباشر:

```bash
python3 .agents/skills/google-indexing-seo-guardian/scripts/google_indexing_audit.py kernel/index.html
```

إذا تغيرت روابط داخل HTML أو بنية navigation، شغّل أيضاً:

```bash
npm run internal-links:audit
```

إذا كان التعديل أوسع أو يمس سطح النشر، شغّل:

```bash
npm run verify:all
```

## ملاحظات نشر

- السطح هنا HTML ثابت ويُعامل كجزء من سطح SEO/Render static.
- لا تفترض أن README أو logs القديمة تعكس الحالة الحالية؛ شغّل gate الحي قبل الحكم.
- `render.yaml` هو مصدر الحقيقة لمسار النشر العام في المشروع.
- لا تضع أسرار أو مفاتيح API داخل ملفات `kernel/`؛ واجهات HTML عامة.

## قائمة صيانة سريعة

عند أي تغيير مستقبلي:

- تأكد أن production هو الافتراضي.
- تأكد أن `بيانات تجريبية` اختيار صريح.
- حافظ على fallback `file://`.
- لا تكسر `kernel-demo-update` لأنه ينعش الإحصائيات والموافقات عند demo.
- لا تغيّر mock schema بدون تحديث normalize functions والصفحات المستهلكة.
- حدّث README مع أي صفحة أو ملف mock أو endpoint جديد.
### التعديلات المنفذة

- إزالة `user-scalable=no` و`maximum-scale=1.0` من صفحات Kernel التي كانت تمنع التكبير.
- تحديث `kernel/assets/js/kernel-mobile.js` حتى لا يعيد فرض منع التكبير ديناميكياً.
- إضافة `aria-label` للأزرار الأيقونية المستهدفة مثل تبديل المظهر، فتح القائمة، إغلاق المودال، إغلاق التنبيه، وقائمة المزيد.
- تقوية focus states في CSS المشترك وتحسين ظهور focus في dropdown.
- تحسين contrast لأزرار success/danger وأزرار primary المحلية في صفحات reports/scenarios/compliance.
- احترام `prefers-reduced-motion` في عدادات JS، تأثير typewriter، وscroll smooth في connectors.
- رفع touch targets للأزرار الأساسية إلى 44px أو أكثر.
