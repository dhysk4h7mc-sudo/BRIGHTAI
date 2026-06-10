# Kernel Software Application Schema Design

## Goal

إضافة تعريف موحد لمنتج BrightAI بصيغة `SoftwareApplication` و`WebApplication` إلى صفحات Kernel وصفحة الخدمات، مع الحفاظ على جميع كيانات JSON-LD الحالية.

## Scope

- صفحات `kernel/*.html` القابلة للفهرسة وعددها 12 صفحة.
- صفحة `services/index.html`.
- لا تغيير في المحتوى المرئي أو الأسعار أو Schema الحالي.

## Schema Design

يضاف كيان واحد بالمعرف `https://brightai.site/#product` إلى `@graph` الحالي:

- `@type`: `SoftwareApplication` و`WebApplication`.
- `name`: `BrightAI Kernel`.
- `applicationCategory`: `BusinessApplication`.
- `operatingSystem`: `Cloud, Hybrid, On-Premise`.
- وصف عربي يشرح الحوكمة، جدار الحماية، التدقيق، الموافقات، والأدلة.
- `provider`: مرجع إلى `https://brightai.site/#organization`.
- `offers`: عرض بعملة `SAR`، وتوفر `InStock`، ورابط التواصل، بدون سعر رقمي غير معلن.

يرتبط كيان `WebPage` في كل صفحة بالمنتج عبر `mainEntity`.

## Validation

- تحليل كل كتل JSON-LD كـ JSON صالح.
- التحقق من وجود الكيان والخصائص المطلوبة في جميع الصفحات المستهدفة.
- التأكد من بقاء كيانات `Organization` و`WebSite` و`WebPage` و`BreadcrumbList`.
- تشغيل `npm run seo:schema` و`npm run seo:gate`.

