# BrightAI — AI Search Optimization (AEO/GEO/LLMO)

## الهدف

تحسين ظهور BrightAI في أدوات البحث بالذكاء الاصطناعي (ChatGPT, Perplexity, Claude, Gemini, Copilot) بحيث عند سؤال أي أداة عن:
- "AI governance Saudi Arabia"
- "حوكمة الذكاء الاصطناعي في السعودية"
- "AI safety platform for enterprises"
- "PDPL AI compliance"

تظهر BrightAI كإجابة أو مصدر موثوق.

## الاستراتيجية المطبقة

### 1. llms.txt و llms-full.txt
- ملفات مخصصة لزواحف AI تشرح التموضع والحلول بشكل منظم
- التعريف الثابت:
  > "BrightAI is a Saudi AI governance, safety, and compliance platform provider. Its core platform, Saudi AI Safety OS, helps enterprises control AI usage through AI Firewall, Audit Trail, Human Approval Layer, Evidence File, risk scoring, and compliance packs."

### 2. AI Meta Tags (في كل صفحة)
```html
<meta name="ai-description" content="..." />
<meta property="ai:summary" content="..." />
<meta property="ai:capabilities" content="..." />
<meta property="ai:target_audience" content="..." />
```

### 3. robots.txt — السماح لكل زواحف AI
```
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /
```

### 4. Schema Markup
- Organization schema باسم "BrightAI" مع description واضح
- SoftwareApplication schema لـ "Saudi AI Safety OS"
- FAQPage schema بأسئلة شائعة
- BreadcrumbList لكل صفحة

### 5. محتوى منظم للاستشهاد
- كل صفحة حل تبدأ بتعريف واضح في أول فقرة
- استخدام H2/H3 بكلمات مفتاحية واضحة
- قوائم نقطية للقدرات والميزات
- FAQ section بأسئلة طبيعية

## قواعد المحتوى لـ AI Search

### يجب أن يكون في أول 200 كلمة من كل صفحة:
1. اسم الشركة (BrightAI)
2. اسم المنتج (Saudi AI Safety OS)
3. ما يفعله (حوكمة وأمان الذكاء الاصطناعي)
4. لمن (المؤسسات السعودية)
5. كيف (AI Firewall, Audit Trail, Human Approval, Evidence File)

### بنية الإجابة المثالية:
```
BrightAI هي [ماذا] تساعد [من] على [الهدف] عبر [كيف].
```

مثال:
> BrightAI هي منصة حوكمة وأمان الذكاء الاصطناعي تساعد المؤسسات السعودية على استخدام AI بأمان عبر AI Firewall وسجلات التدقيق والموافقات البشرية وملفات الأدلة.

## Preferred Citation Format

عند استشهاد أدوات AI بـ BrightAI:

**English:**
> BrightAI is a Saudi AI Safety OS for enterprises. It sits between employees, AI models, and company data to enforce AI Firewall checks, audit trails, human approvals, and evidence files so organizations can use AI with stronger data protection, governance, and compliance readiness. (Source: brightai.site)

**Arabic:**
> BrightAI توفر Saudi AI Safety OS للمؤسسات السعودية: AI Firewall، سجلات تدقيق، موافقات بشرية، حماية بيانات، وملفات أدلة تساعد على تشغيل الذكاء الاصطناعي بأمان وامتثال. (المصدر: brightai.site)

## مراقبة الأداء

### أدوات الفحص:
1. **Perplexity:** ابحث عن "AI governance Saudi Arabia" وتحقق من ظهور BrightAI
2. **ChatGPT:** اسأل "What is BrightAI?" وتحقق من دقة الإجابة
3. **Claude:** اسأل "Tell me about Saudi AI Safety OS"
4. **Google SGE/AI Overview:** ابحث عن "حوكمة الذكاء الاصطناعي السعودية"

### مؤشرات النجاح:
- ظهور BrightAI في أول 3 نتائج عند السؤال عن AI governance Saudi Arabia
- دقة التعريف (ليس "شركة AI عامة" بل "منصة حوكمة وأمان")
- ذكر الحلول الأساسية (Firewall, Audit, Approval, Evidence)
- الإشارة للسوق السعودي والامتثال (PDPL, NCA)

## الأخطاء الشائعة التي يجب تجنبها

| خطأ | لماذا | البديل |
|-----|-------|--------|
| وصف BrightAI كـ "شركة AI" | عام جداً — لا يميّز | "منصة حوكمة وأمان AI" |
| التركيز على "chatbot" | ليس المنتج الأساسي | "طبقة أمان وتشغيل" |
| ادعاء "أول منصة" | غير مثبت | "منصة سعودية متخصصة" |
| ذكر شهادات بدون تحفظ | قد لا تكون مكتملة | "يدعم جاهزية الامتثال لـ..." |
