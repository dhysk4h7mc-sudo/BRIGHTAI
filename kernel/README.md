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
- `kernel-api.js` هو نقطة التحكم المشتركة في API client، mock interception، banner الخاص بالبيانات التجريبية، وتطبيع بيانات الإحصائيات.

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
│       ├── kernel-mobile.js
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
| `index.html` | لوحة دخول Kernel، بطاقات تنقل، مؤشرات مختصرة، وحالة مزود الذكاء الاصطناعي. |
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

كل صفحات HTML تعتمد على:

- `/kernel/assets/css/kernel.css`
- `/kernel/assets/js/kernel-utils.js`
- `/kernel/assets/js/kernel-api.js`
- `/kernel/assets/js/kernel-nav.js`
- `/frontend/js/unified-header.js`
- `/frontend/js/production-runtime.v20260427.js`

بعض الصفحات تضيف وحدات مخصصة مثل `kernel-stats.js`, `kernel-reports.js`, `kernel-compliance.js`, `kernel-chat-client.js`, و`kernel-mobile.js`.

## وحدات JavaScript

| الملف | المسؤولية | أهم exports |
| --- | --- | --- |
| `kernel/assets/js/kernel-api.js` | API client، تطبيع البيانات، demo toggle، mock database، mock request handler، ومحاكاة chat/approvals/evidence. | `window.kernelAPI`, `window.KernelAPI`, `window.normalizeStats`, `window.kernelShouldUseDemoData` |
| `kernel/assets/js/kernel-utils.js` | أدوات مشتركة: escape HTML، formatters، debounce/throttle، theme، clipboard، animations. | `window.KernelUtils` |
| `kernel/assets/js/kernel-nav.js` | تعريف صفحات Kernel، بناء navigation، active route، وعداد الموافقات. | `window.KernelNav` |
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

ملاحظة مهمة: mock handler داخل `kernel-api.js` يغطي مسارات Kernel الأساسية مثل stats/audit/chain/approvals/evidence/compliance/chat/policies/providers/health. أما reports فتملك fallback محلي داخل `kernel-reports.js` عندما تكون `بيانات تجريبية` مفعلة أو عند `file://`.

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

عند تفعيل demo، يحاول `kernel-api.js` تحميل:

- `stats.json`
- `audit.json`
- `approvals.json`
- `evidence.json`
- `compliance.json`
- `policies.json`

إذا فشل تحميل هذه الملفات، يستخدم hardcoded fallback داخل `kernel-api.js`.

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
4. حمّل `kernel-utils.js`, ثم `kernel-api.js`, ثم `kernel-nav.js`.
5. استدع `KernelNav.init('sidebarNav')` واضبط الصفحة النشطة عبر `KernelNav.setActive('<page-id>')`.
6. أضف الصفحة إلى `KernelNav.config.pages` داخل `kernel-nav.js`.
7. إذا استخدمت `/api/kernel` لا تضف fallback demo صامت؛ اعتمد على `window.kernelShouldUseDemoData()`.
8. حدّث هذا README إذا تغيرت البنية أو ظهرت واجهة جديدة.

## تعديل API أو demo mode

قبل تعديل `kernel-api.js` راجع هذه المناطق:

- `normalizeStats`
- `getHardcodedDefaults`
- `ensureDBInitialized`
- `handleMockRequest`
- fetch wrapper حول `window.fetch`
- `injectBannerUI` و`updateBannerUI`
- exports في نهاية الملف

بعد التعديل، شغّل:

```bash
node -c kernel/assets/js/kernel-api.js
```

وشغّل syntax check لأي JS آخر تغير.

## أوامر التحقق

الأوامر الموصى بها بعد أي تعديل في `kernel/`:

```bash
git diff --check
node -c kernel/assets/js/kernel-api.js
node -c kernel/assets/js/kernel-stats.js
node -c kernel/assets/js/kernel-reports.js
npm run seo:gate
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
