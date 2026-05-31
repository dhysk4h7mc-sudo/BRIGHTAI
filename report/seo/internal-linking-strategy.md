# BrightAI — Internal Linking Architecture

## Pillar Pages

| Page | Role | Priority |
|------|------|----------|
| / | Hub — يربط لكل الحلول والخدمات | P1 |
| /services/ | خدمات التنفيذ — يربط لكل حل | P1 |
| /solutions/ai-governance-platform/ | Pillar — منصة الحوكمة المركزية | P1 |
| /solutions/ai-firewall/ | Pillar — حماية البيانات | P1 |
| /solutions/ai-audit-trail/ | Pillar — سجل التدقيق | P1 |
| /solutions/human-approval-layer/ | Pillar — الموافقات البشرية | P1 |
| /solutions/ai-evidence-file/ | Pillar — ملف الأدلة | P1 |
| /assessment/ai-governance-readiness/ | Lead Gen — تقييم الجاهزية | P1 |
| /docs/ | Knowledge Hub — مركز الوثائق | P2 |
| /contact/ | Conversion — التواصل | P1 |
| /kernel/ | Product Demo — نواة التشغيل | P2 |

## Linking Rules

### 1. الصفحة الرئيسية (/)
تربط إلى:
- /solutions/ai-governance-platform/ (anchor: "منصة حوكمة الذكاء الاصطناعي")
- /solutions/ai-firewall/ (anchor: "حماية بيانات الذكاء الاصطناعي")
- /solutions/ai-audit-trail/ (anchor: "سجل تدقيق استخدام AI")
- /solutions/human-approval-layer/ (anchor: "موافقات بشرية للقرارات عالية المخاطر")
- /solutions/ai-evidence-file/ (anchor: "ملف أدلة امتثال الذكاء الاصطناعي")
- /assessment/ai-governance-readiness/ (anchor: "تقييم جاهزية حوكمة الذكاء الاصطناعي")
- /services/ (anchor: "خدمات حوكمة وأمان الذكاء الاصطناعي")
- /contact/ (anchor: "تواصل مع فريق BrightAI")
- /kernel/ (anchor: "نواة تشغيل BrightAI Kernel")
- /docs/ (anchor: "مركز وثائق حوكمة الذكاء الاصطناعي")
- /blog/ (anchor: "مدونة حوكمة وأمان الذكاء الاصطناعي")

### 2. كل صفحة حل (Solutions)
تربط إلى:
- /solutions/ai-governance-platform/ (إذا لم تكن هي نفسها)
- /solutions/ai-firewall/
- /solutions/ai-audit-trail/
- /solutions/human-approval-layer/
- /solutions/ai-evidence-file/
- /contact/ (CTA)
- /docs/{solution-name}/ (وثائق الحل)
- /kernel/ (ديمو تفاعلي)

### 3. صفحات PDPL و NCA
تربط إلى:
- /solutions/ai-governance-platform/ (anchor: "منصة حوكمة الذكاء الاصطناعي")
- /solutions/ai-firewall/ (anchor: "جدار حماية الذكاء الاصطناعي")
- /solutions/ai-audit-trail/ (anchor: "سجل تدقيق AI")
- /kernel/compliance/ (anchor: "حزم الامتثال")

### 4. صفحات الديمو
تربط إلى:
- /contact/ (anchor: "اطلب ديمو خاص بشركتك")
- /assessment/ai-governance-readiness/ (anchor: "قيّم جاهزية مؤسستك")

### 5. المدونة
كل مقال يربط إلى:
- الحل الأقرب لموضوعه (1-2 روابط)
- /contact/ أو /assessment/ai-governance-readiness/ (CTA)
- مقال آخر ذو صلة (1 رابط)

## Anchor Text Guidelines

### يجب استخدام:
- "منصة حوكمة الذكاء الاصطناعي"
- "حماية بيانات الذكاء الاصطناعي"
- "سجل تدقيق استخدام AI"
- "موافقات بشرية للقرارات عالية المخاطر"
- "ملف أدلة امتثال الذكاء الاصطناعي"
- "تقييم جاهزية حوكمة الذكاء الاصطناعي"
- "جدار حماية الذكاء الاصطناعي"

### يجب تجنب:
- "اضغط هنا"
- "اقرأ المزيد"
- "خدمات الذكاء الاصطناعي" (بدون سياق حوكمة)
- "حلول AI" (عامة جداً)
- روابط عشوائية بدون سياق

## Cross-Linking Matrix

```
                    Gov Platform  Firewall  Audit Trail  Approval  Evidence  Contact  Assessment
Homepage            ✓             ✓         ✓            ✓         ✓         ✓        ✓
Services            ✓             ✓         ✓            ✓         ✓         ✓        ✓
Gov Platform        —             ✓         ✓            ✓         ✓         ✓        ✓
Firewall            ✓             —         ✓            ✓         ✓         ✓        —
Audit Trail         ✓             ✓         —            ✓         ✓         ✓        —
Approval Layer      ✓             —         ✓            —         ✓         ✓        —
Evidence File       ✓             —         ✓            ✓         —         ✓        —
PDPL pages          ✓             ✓         ✓            —         —         ✓        —
NCA pages           ✓             ✓         ✓            —         —         ✓        —
Blog articles       ✓ (relevant)  ✓ (relevant)  —       —         —         ✓        ✓
Demo pages          —             —         —            —         —         ✓        ✓
```
