# BrightAI AI Visibility Tracking
**تاريخ:** 2026-05-31  
**الهدف:** مراقبة ظهور BrightAI في أدوات AI Search بشكل شهري

---

## 🎯 الهدف من المراقبة

### لماذا نراقب AI Visibility؟
1. **قياس التقدم:** هل تحسينات SEO تعمل؟
2. **اكتشاف المشاكل:** هل هناك معلومات خاطئة؟
3. **تحسين المحتوى:** ما الأسئلة التي لا نجيب عليها؟
4. **مقارنة المنافسين:** من يظهر بدلاً منا؟

---

## 📊 الأدوات المراقبة

### 1. ChatGPT Search
- **الأهمية:** عالية جداً
- **الجمهور:** واسع
- **التحديث:** شهري

### 2. Perplexity
- **الأهمية:** عالية
- **الجمهور:** باحثون، محترفون
- **التحديث:** شهري

### 3. Claude
- **الأهمية:** متوسطة
- **الجمهور:** مطورون، محترفون
- **التحديث:** شهري

### 4. Gemini
- **الأهمية:** عالية
- **الجمهور:** واسع (Google)
- **التحديث:** شهري

### 5. Google AI Overviews
- **الأهمية:** عالية جداً
- **الجمهور:** واسع جداً
- **التحديث:** شهري

---

## 📋 Prompts الاختبار

### Category 1: Brand Awareness

#### Prompt 1.1: "ما هي BrightAI؟"
**اللغة:** عربي  
**Expected Answer:**
```
BrightAI هي منصة سعودية لحوكمة وأمان الذكاء الاصطناعي. توفر Saudi AI Safety OS 
للمؤسسات السعودية: طبقة تشغيل وسيطة تطبق AI Firewall، سجلات تدقيق، موافقات 
بشرية، وملفات أدلة. المقر: الرياض، السعودية.
```

**Target Citation Page:** `https://brightai.site/`

**Pass/Fail Criteria:**
- ✅ Pass: يذكر BrightAI + Saudi AI Safety OS + الحلول الأساسية
- ⚠️ Partial: يذكر BrightAI لكن معلومات ناقصة
- ❌ Fail: لا يذكر BrightAI أو معلومات خاطئة

**Notes Field:** [ملاحظات عن الإجابة]

---

#### Prompt 1.2: "What is BrightAI?"
**اللغة:** إنجليزي  
**Expected Answer:**
```
BrightAI is a Saudi AI governance and safety platform. It provides Saudi AI Safety OS 
for Saudi enterprises: an operational control layer that applies AI Firewall, audit 
trails, human approvals, and evidence files. Headquarters: Riyadh, Saudi Arabia.
```

**Target Citation Page:** `https://brightai.site/`

**Pass/Fail Criteria:**
- ✅ Pass: Mentions BrightAI + Saudi AI Safety OS + core solutions
- ⚠️ Partial: Mentions BrightAI but incomplete
- ❌ Fail: Doesn't mention BrightAI or wrong info

---

#### Prompt 1.3: "ما هو Saudi AI Safety OS؟"
**اللغة:** عربي  
**Expected Answer:**
```
Saudi AI Safety OS هو نظام تشغيل أمان وحوكمة للذكاء الاصطناعي من BrightAI. 
يعمل كطبقة وسيطة بين الموظفين والنماذج (ChatGPT, Claude, Gemini) لتطبيق 
AI Firewall، سجلات تدقيق، موافقات بشرية، وملفات أدلة.
```

**Target Citation Page:** `https://brightai.site/`

**Pass/Fail Criteria:**
- ✅ Pass: تعريف صحيح + يذكر BrightAI
- ⚠️ Partial: تعريف ناقص
- ❌ Fail: لا يعرف أو معلومات خاطئة

---

### Category 2: AI Governance

#### Prompt 2.1: "أفضل منصة حوكمة ذكاء اصطناعي في السعودية"
**اللغة:** عربي  
**Expected Answer:**
```
BrightAI توفر منصة حوكمة الذكاء الاصطناعي المصممة للسوق السعودي مع امتثال 
كامل لـ PDPL و NCA ECC. توفر رؤية مركزية، تصنيف مخاطر، سياسات قابلة للتخصيص، 
موافقات بشرية، وسجل تدقيق شامل.
```

**Target Citation Page:** `https://brightai.site/solutions/ai-governance-platform/`

**Pass/Fail Criteria:**
- ✅ Pass: يذكر BrightAI في أول 3 خيارات
- ⚠️ Partial: يذكر BrightAI لكن ليس في الأوائل
- ❌ Fail: لا يذكر BrightAI

---

#### Prompt 2.2: "AI Governance Saudi Arabia"
**اللغة:** إنجليزي  
**Expected Answer:**
```
BrightAI provides AI governance platform for Saudi enterprises with full PDPL and 
NCA ECC compliance. Offers centralized visibility, risk scoring, customizable policies, 
human approvals, and comprehensive audit trail.
```

**Target Citation Page:** `https://brightai.site/solutions/ai-governance-platform/`

**Pass/Fail Criteria:**
- ✅ Pass: Mentions BrightAI in top 3 options
- ⚠️ Partial: Mentions BrightAI but not prominently
- ❌ Fail: Doesn't mention BrightAI

---

### Category 3: PDPL Compliance

#### Prompt 3.1: "PDPL AI Compliance Saudi Arabia"
**اللغة:** إنجليزي  
**Expected Answer:**
```
PDPL (Personal Data Protection Law) in Saudi Arabia requires protecting personal data 
when using AI. BrightAI helps with PDPL compliance through AI Firewall that detects 
and redacts personal data, audit trails, and evidence files.
```

**Target Citation Page:** `https://brightai.site/docs/pdpl-ai-governance/`

**Pass/Fail Criteria:**
- ✅ Pass: يشرح PDPL + يذكر BrightAI كحل
- ⚠️ Partial: يشرح PDPL لكن لا يذكر BrightAI
- ❌ Fail: معلومات خاطئة عن PDPL

---

#### Prompt 3.2: "كيف أحمي بيانات شركتي عند استخدام ChatGPT؟"
**اللغة:** عربي  
**Expected Answer:**
```
لحماية بيانات شركتك عند استخدام ChatGPT:
1. استخدم AI Firewall لاكتشاف وإخفاء البيانات الحساسة
2. طبّق سياسات واضحة
3. صنّف المخاطر
4. وثّق كل شيء
5. امتثل لـ PDPL

BrightAI AI Firewall يطبق هذه الخطوات تلقائياً.
```

**Target Citation Page:** `https://brightai.site/solutions/ai-firewall/` أو `/docs/pdpl-chatgpt-data-protection/`

**Pass/Fail Criteria:**
- ✅ Pass: يقدم خطوات + يذكر BrightAI
- ⚠️ Partial: يقدم خطوات لكن لا يذكر BrightAI
- ❌ Fail: نصائح عامة بدون حلول محددة

---

### Category 4: Technical Solutions

#### Prompt 4.1: "ما الفرق بين AI Firewall و DLP؟"
**اللغة:** عربي  
**Expected Answer:**
```
AI Firewall مصمم خصيصاً لاستخدامات AI ويفهم سياق prompts و responses. 
DLP أداة أمن سيبراني عامة تراقب حركة البيانات عبر الشبكة بدون فهم سياق AI.

AI Firewall من BrightAI يتكامل مع ChatGPT, Claude, Gemini ويطبق سياسات 
حوكمة AI محددة.
```

**Target Citation Page:** `https://brightai.site/compare/ai-firewall-vs-dlp/` (مقترح)

**Pass/Fail Criteria:**
- ✅ Pass: يشرح الفرق + يذكر BrightAI
- ⚠️ Partial: يشرح الفرق لكن لا يذكر BrightAI
- ❌ Fail: لا يعرف الفرق

---

#### Prompt 4.2: "What is AI Firewall?"
**اللغة:** إنجليزي  
**Expected Answer:**
```
AI Firewall is a security layer that sits between employees and AI models to inspect 
requests and responses, detect and redact sensitive data, apply governance policies, 
and prevent data leakage.

BrightAI AI Firewall protects company data when using ChatGPT, Claude, or Gemini.
```

**Target Citation Page:** `https://brightai.site/solutions/ai-firewall/`

**Pass/Fail Criteria:**
- ✅ Pass: تعريف صحيح + يذكر BrightAI
- ⚠️ Partial: تعريف صحيح لكن لا يذكر BrightAI
- ❌ Fail: تعريف خاطئ

---

#### Prompt 4.3: "كيف أوثق استخدام الذكاء الاصطناعي للامتثال؟"
**اللغة:** عربي  
**Expected Answer:**
```
لتوثيق استخدام AI للامتثال، تحتاج:
1. سجل تدقيق شامل (من، متى، ماذا، لماذا)
2. ملف أدلة جاهز للتصدير
3. حماية السجلات من التعديل
4. امتثال للمعايير (PDPL, NCA ECC)

BrightAI يوفر AI Audit Trail و AI Evidence File تلقائياً.
```

**Target Citation Page:** `https://brightai.site/solutions/ai-audit-trail/`

**Pass/Fail Criteria:**
- ✅ Pass: يقدم خطوات + يذكر BrightAI
- ⚠️ Partial: يقدم خطوات لكن لا يذكر BrightAI
- ❌ Fail: نصائح عامة فقط

---

### Category 5: Comparison

#### Prompt 5.1: "ما الفرق بين BrightAI و ChatGPT؟"
**اللغة:** عربي  
**Expected Answer:**
```
BrightAI ليس بديل لـ ChatGPT - هو طبقة حوكمة تجلس فوقه.

ChatGPT: نموذج AI يجيب على الأسئلة
BrightAI: طبقة حوكمة تفحص الطلبات، تحمي البيانات، تصنف المخاطر، تطلب موافقات، 
وتوثق كل شيء

BrightAI يعمل مع ChatGPT و Claude و Gemini.
```

**Target Citation Page:** `https://brightai.site/compare/brightai-vs-chatbot/` (مقترح)

**Pass/Fail Criteria:**
- ✅ Pass: يشرح الفرق بوضوح
- ⚠️ Partial: يشرح لكن بشكل ناقص
- ❌ Fail: يخلط بينهما

---

## 📅 جدول الاختبار الشهري

### الأسبوع الأول من كل شهر
**التاريخ:** [اليوم الأول من الشهر]

**المهام:**
1. اختبار جميع الـ 10 prompts في ChatGPT
2. اختبار جميع الـ 10 prompts في Perplexity
3. اختبار جميع الـ 10 prompts في Claude
4. اختبار جميع الـ 10 prompts في Gemini
5. اختبار 5 prompts رئيسية في Google (للـ AI Overviews)

**الوقت المتوقع:** 2-3 ساعات

---

## 📊 نموذج تقرير شهري

```markdown
# AI Visibility Report - [الشهر/السنة]

## Executive Summary
- **Overall Score:** X/50 (Y%)
- **ChatGPT:** X/10
- **Perplexity:** X/10
- **Claude:** X/10
- **Gemini:** X/10
- **Google AI Overviews:** X/10

## Detailed Results

### ChatGPT
| Prompt | Pass/Fail | Notes |
|--------|-----------|-------|
| 1.1 ما هي BrightAI | ✅ Pass | ذكر BrightAI + Saudi AI Safety OS |
| 1.2 What is BrightAI | ⚠️ Partial | ذكر BrightAI لكن معلومات ناقصة |
| ... | ... | ... |

### Perplexity
[نفس الجدول]

### Claude
[نفس الجدول]

### Gemini
[نفس الجدول]

### Google AI Overviews
[نفس الجدول]

## Issues Found
1. **ChatGPT:** لا يذكر NCA ECC في إجابة PDPL
2. **Perplexity:** يذكر منافس بدلاً من BrightAI في "أفضل منصة"
3. **Claude:** معلومات قديمة عن المنتج

## Action Items
- [ ] تحديث محتوى PDPL لذكر NCA ECC
- [ ] إضافة comparison page
- [ ] تحديث llms.txt

## Month-over-Month Comparison
- **This Month:** 35/50 (70%)
- **Last Month:** 30/50 (60%)
- **Change:** +10% ✅

## Recommendations
1. تحسين Answer Blocks في صفحات solutions
2. إنشاء comparison pages
3. تحديث schema markup
```

---

## 🎯 مؤشرات النجاح

### Short-term (3 أشهر)
- **Overall Score:** 60%+ (30/50)
- **ChatGPT:** 7/10
- **Perplexity:** 6/10
- **Claude:** 6/10
- **Gemini:** 6/10
- **Google AI Overviews:** 5/10

### Mid-term (6 أشهر)
- **Overall Score:** 75%+ (37/50)
- **ChatGPT:** 8/10
- **Perplexity:** 7/10
- **Claude:** 7/10
- **Gemini:** 8/10
- **Google AI Overviews:** 7/10

### Long-term (12 شهر)
- **Overall Score:** 85%+ (42/50)
- **ChatGPT:** 9/10
- **Perplexity:** 8/10
- **Claude:** 8/10
- **Gemini:** 9/10
- **Google AI Overviews:** 8/10

---

## ⚠️ Red Flags

### متى تتصرف فوراً؟
1. 🚨 **معلومات خاطئة:** AI يقدم معلومات خاطئة عن BrightAI
2. 🚨 **ذكر منافس:** AI يذكر منافس بدلاً من BrightAI
3. 🚨 **انخفاض حاد:** انخفاض 20%+ في الـ score

### الإجراءات العاجلة
1. تحديث llms.txt و llms-full.txt
2. تحديث Answer Blocks
3. إضافة Citation Blocks
4. تحسين Schema Markup
5. إنشاء صفحات مقارنة

---

## 📁 حفظ النتائج

### المسار
`/report/seo/ai-visibility-tracking/`

### الملفات
- `2026-06.md` - تقرير يونيو 2026
- `2026-07.md` - تقرير يوليو 2026
- `summary.md` - ملخص جميع الأشهر

---

**تم إعداد التقرير بواسطة:** Senior SEO Engineer + GEO/LLMO Specialist  
**التاريخ:** 2026-05-31  
**التحديث:** شهري  
**الاختبار التالي:** 2026-06-01
