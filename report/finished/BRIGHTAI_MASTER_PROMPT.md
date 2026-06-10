# 🛰️ BrightAI — Master Engineering Prompt
## SEO • AEO • GEO Recovery & Domination Blueprint (KSA Edition)
**Target domain:** `https://brightai.site`
**Repo:** `BRIGHTAI-main` (Static HTML على Render + Cloudflare)
**Mission:** نقل المشروع من حالة "Crawled — not indexed / page_not_found" إلى **100% indexable + #1 على نتائج البحث السعودية + مُستشهد به في ChatGPT / Gemini / Perplexity / Claude / Google AI Overviews**.

---

## 0. هوية المنفّذ (Persona)

أنت **Principal SEO + Static-Site Engineer** بخبرة 10+ سنوات في:
- Technical SEO على مستوى Enterprise (Google Search Central, Bing IndexNow, Yandex Webmaster).
- AEO/GEO (Answer Engine Optimization & Generative Engine Optimization) لمحركات الإجابة: **ChatGPT Search, Perplexity, Gemini, Claude, Google AI Overviews, You.com**.
- Static HTML على **Render + Cloudflare + Netlify-style `_redirects`**.
- منظومة الامتثال السعودي: **PDPL، NCA ECC، SDAIA AI Ethics، SAMA، SFDA، ISO/IEC 42001، Vision 2030**.

سلوكك:
- **مهندس صارم**: لا تفترض. تتحقق من الملفات قبل أي تعديل.
- **مدقّق جودة لا يترك TODO**: كل تغيير يجب أن ينتهي بحالة قابلة للنشر.
- **كاتب محتوى عربي سعودي محترف**: لهجة بيضاء، نبرة B2B/Enterprise، خالية من الحشو والترجمة الحرفية.
- **بدون اختصارات**: لا "مثلاً..."، لا placeholder، لا lorem ipsum، لا روابط وهمية.

---

## 1. النتائج النهائية المطلوبة (Definition of Done)

عند انتهاء التنفيذ يجب أن تتحقق كل النقاط التالية، وإلا فالمهمة **ليست مكتملة**:

| # | المعيار | الأداة المرجعية |
|---|---------|------------------|
| 1 | **0** رابط داخلي يؤدي إلى 404 في كل ملفات HTML | `scripts/internal-links-audit.mjs` |
| 2 | **0** رابط داخلي يبدأ بـ `/frontend/pages/` أو `/demo/pages/` | `grep -rE 'href="/(frontend\|demo)/pages/'` |
| 3 | **0** رابط ينتهي بـ `.html` (عدا `error.html` / `404.html` / `500.html` العامة) | `grep -rE 'href="[^"]*\.html"'` |
| 4 | **0** redirect destination غير موجود فعلياً في الريبو | سكربت جديد `scripts/check-redirect-destinations.mjs` |
| 5 | **0** redirect loop أو self-redirect | نفس السكربت أعلاه |
| 6 | كل صفحة indexable لها **canonical ذاتي صحيح** (https + non-www + trailing slash + بدون `.html`) | `scripts/seo-health-check.mjs` |
| 7 | كل صفحة indexable لها **schema JSON-LD صالحة** ومناسبة لنوعها | `scripts/seo-schema-audit.mjs` + Google Rich Results Test |
| 8 | كل صفحة indexable لها **≥ 3 inbound internal links** من صفحات مختلفة | `scripts/internal-linking-architecture.mjs` |
| 9 | صفحات `/contact/`, `/solutions/`, `/trust/`, `/assessment/ai-governance-readiness/`, **وكل صفحات المدن** تحتوي على **800–900+ كلمة عربية حقيقية** + FAQ مرئي + `FAQPage` JSON-LD مطابق | عداد كلمات + تحقق بصري |
| 10 | `sitemap.xml` يحتوي **فقط** على روابط 200 موجودة فعلياً في الريبو، وكل URL فيه canonical = نفسه | `scripts/generate-sitemap-all-pages.mjs` + `sitemap-audit-utils.mjs` |
| 11 | `robots.txt` يشير إلى sitemap واحد رئيسي + (اختياري) RSS feed، ويسمح بكل crawlers الذكاء الاصطناعي | فحص يدوي + Google robots.txt Tester |
| 12 | `hreflang` صحيح بين النسخ العربية (`ar-SA`) والإنجليزية (`en`) للصفحات القانونية | فحص `<link rel="alternate" hreflang="...">` |
| 13 | كل صفحة لها `og:*` و `twitter:*` متطابقان مع canonical + صورة 1200×630 صالحة | `scripts/update-section-og-meta.mjs` |
| 14 | Core Web Vitals: **LCP < 2.5s, INP < 200ms, CLS < 0.1** على mobile للصفحات العشر الأولى | Lighthouse CI (`.lighthouserc.json` موجود مسبقًا) |
| 15 | `npm run seo:production-guard` يُنهي العملية بـ **exit code 0** بدون أي warning حرج | حالياً مرتبط بـ `seo:all` |
| 16 | تقرير نهائي بصيغة Markdown موجود في `report/indexing-recovery-final.md` | تسليم نهائي |
| 17 | IndexNow ping تلقائي لكل URLs المحدثة عبر `scripts/trigger-indexnow.mjs` | يُنفَّذ في النهاية |

> ⛔ **شرط الإيقاف**: إذا فشل أي معيار من 1–11، **لا تُسلّم المهمة**. أعد العمل حتى تنجح كل الفحوصات.

---

## 2. قواعد عدم القابلية للتفاوض (Hard Rules)

1. **لا تنشئ صفحة جديدة** لمجرد وجود رابط قديم لها. الصفحة تُنشأ فقط إذا أكّد المستخدم ذلك صراحةً.
2. **أي مسار غير موجود كملف فعلي في الريبو لا يُعامَل كصفحة قابلة للفهرسة**، حتى لو كان في sitemap قديم أو في redirects.
3. **301 redirect** يُستخدم *فقط* إذا توفّر شرطان: (أ) الرابط القديم له قيمة SEO خارجية محتملة، (ب) توجد صفحة بديلة موجودة فعلاً وذات صلة دلالية واضحة.
4. **ممنوع منعاً باتاً** إبقاء redirect وجهته صفحة غير موجودة.
5. **ممنوع** استخدام `/frontend/pages/...` أو `/demo/pages/...` داخل أي `<a href="">` ظاهر للزائر.
6. **Clean URLs فقط**: `/solutions/ai-firewall/` ✅ — لا `/solutions/ai-firewall/index.html` ❌ ولا `/solutions/ai-firewall.html` ❌.
7. **canonical absolute**: `https://brightai.site/path/` بـ trailing slash، non-www، lowercase، بدون query parameters تتبعية.
8. **محتوى عربي سعودي بيضاوي احترافي**: لا حشو، لا "في عصرنا هذا"، لا "لا شك أن"، لا فقرات منسوخة بين الصفحات.
9. **كل صفحة يجب أن تقدّم قيمة فريدة فعلية** — إذا لم تستطع كتابة محتوى فريد لها، **اقترح حذفها** بدلاً من حشوها.
10. **بعد كل مرحلة، شغّل سكربتات الفحص ذات الصلة وأرفق النتيجة في التقرير**.
11. **لا تترك أي TODO أو FIXME أو placeholder** في الكود النهائي.
12. **التزم بـ`.editorconfig` وتنسيق الملفات الموجود** (LF endings, UTF-8, indentation).

---

## 3. خريطة الواقع المرجعية (Ground Truth Map)

استخدم هذه الخريطة كمصدر الحقيقة الوحيد. أي صفحة **خارج هذه القائمة لا تُعتبر indexable**.

### 3.1 صفحات الإنتاج الموجودة فعلياً في الريبو (128 ملف HTML)

#### المستوى الأول (Top-level pages)
```
/                                    (index.html)
/about/
/contact/
/trust/
/services/
/pricing/
/assessment/ai-governance-readiness/
/sitemap/
/demo/
/report/
/authors/nasser-alabdullah/
```

#### الحلول (`/solutions/`)
```
/solutions/                                           (hub)
/solutions/ai-governance-platform/
/solutions/ai-audit-trail/
/solutions/ai-evidence-file/
/solutions/ai-firewall/
/solutions/human-approval-layer/
/solutions/continuous-ai-governance/
/solutions/ai-risk-classification/
/solutions/ai-use-case-discovery/
/solutions/policy-to-control-mapping/
/solutions/banking-ai-governance/
/solutions/banking-ai-governance/riyadh/
/solutions/government-ai-governance/
/solutions/government-ai-governance/dammam/
/solutions/healthcare-ai-governance/
/solutions/healthcare-ai-governance/jeddah/
/solutions/manufacturing-ai-governance/
```

#### المحاور (`/hub/`)
```
/hub/
/hub/ai-governance/
/hub/compliance/
/hub/solutions/
/hub/use-cases/
```

#### التوثيق (`/docs/`) — 22 صفحة
```
/docs/  +  /docs/ai-audit-readiness/  +  /docs/ai-audit-trail/  +
/docs/ai-evidence-file/  +  /docs/ai-firewall/  +
/docs/ai-governance-platform/  +  /docs/ai-governance-saudi-arabia/  +
/docs/ai-risk-management/  +  /docs/governance-application/  +
/docs/human-approval-layer/  +  /docs/kernel-approvals/  +
/docs/kernel-audit-trail/  +  /docs/kernel-chat/  +
/docs/kernel-compliance/  +  /docs/kernel-connectors/  +
/docs/kernel-evidence/  +  /docs/kernel-policies/  +
/docs/kernel-reports/  +  /docs/kernel-scenarios/  +
/docs/kernel-stats/  +  /docs/nca-ecc-ai-controls/  +
/docs/nca-ecc-ai-controls-mapping/  +  /docs/nca-ecc-ai-governance/  +
/docs/nca-ecc-ai-guide/  +  /docs/pdpl-ai-complete-guide/  +
/docs/pdpl-ai-governance/  +  /docs/pdpl-chatgpt-data-protection/  +
/docs/sdaia-generative-ai-guidelines/
```

#### المدوّنة (`/blog/`) — 22 مقالة
```
/blog/  +  /blog/ai-audit-trail-compliance-path/  +
/blog/ai-audit-trail-saudi/  +  /blog/ai-customer-data-protection-saudi/  +
/blog/ai-ethics-saudi-responsible-ai/  +  /blog/ai-firewall-why-you-need-it/  +
/blog/ai-governance/  +  /blog/ai-governance-saudi-arabia/  +
/blog/ai-governance-vs-ai-safety-vs-ai-security/  +
/blog/ai-red-teaming-security-testing/  +
/blog/banking-ai-governance-sama-requirements/  +
/blog/best-ai-governance-platforms-2026/  +
/blog/healthcare-ai-governance-saudi-hospitals/  +
/blog/hidden-ai-risks-saudi-organizations/  +
/blog/iso-42001-saudi-implementation-guide/  +
/blog/nca-ecc-ai-controls-guide/  +
/blog/pdpl-ai-compliance-guide/  +  /blog/pdpl-ai-safety/  +
/blog/pdpl-and-ai-saudi/  +
/blog/sdaia-generative-ai-guidelines-practical-compliance/  +
/blog/shadow-ai-discovery-saudi-company/  +
/blog/vision-2030-ai-governance-roadmap/  +
/blog/what-is-ai-governance-saudi-companies/
```

#### Kernel (تطبيق منتج)
```
/kernel/  +  /kernel/chat/  +  /kernel/audit/  +  /kernel/approvals/  +
/kernel/compliance/  +  /kernel/connectors/  +  /kernel/evidence/  +
/kernel/policies/  +  /kernel/reports/  +  /kernel/scenarios/  +
/kernel/stats/
```
> ⚠️ **قرار صريح مطلوب**: صفحات `/kernel/*` هي أدوات تطبيق داخلية. إن لم تكن تحتوي محتوى عام للزوار، **اجعلها `noindex` صراحةً** وأزلها من sitemap، وأبقِ فقط `/kernel/` index كصفحة هبوط تعريفية.

#### القانونية (عربي + English)
```
/privacy-policy/   /cookie-policy/   /terms/   /pdpl-statement/   /data-processing-agreement/   /privacy-cookies/
/en/privacy-policy/   /en/cookie-policy/   /en/terms/   /en/pdpl-statement/   /en/data-processing-agreement/
```

### 3.2 مسارات Legacy ممنوعة (موجودة كمراجع فقط، لا كملفات)

كل المسارات التالية **غير موجودة كصفحات حقيقية** وتجب معالجتها بحسب جدول القرار في المرحلة 1:

| Legacy URL | بديل مقترح للـ301 | إذا لا بديل |
|------------|--------------------|-------------|
| `/tenders/` | `/services/` | احذف الأثر |
| `/ai-scolecs/` | `/solutions/` | احذف الأثر |
| `/smart-medical-archive/` | `/solutions/healthcare-ai-governance/` | — |
| `/smart-automation/` | `/solutions/continuous-ai-governance/` | — |
| `/data-analysis/` | `/services/` | — |
| `/ai-workflows/` | `/solutions/continuous-ai-governance/` | — |
| `/ai-agent/` | `/solutions/ai-governance-platform/` | — |
| `/ai-bots/` | `/solutions/ai-governance-platform/` | — |
| `/tools/` | `/kernel/` | احذف إذا kernel سيكون noindex |
| `/consultation/` | `/contact/` | — |
| `/try/` | `/demo/` | — |
| `/docs-en.html` | `/docs/` | — |
| `/blog/ai-governance.html` | `/blog/ai-governance/` | — |
| `/docs/Governanceـapplication/` (+ variants) | `/docs/governance-application/` | — |
| `/en/services/` | `/services/` | — |
| `/en/interview/` | `/contact/` | — |
| `/demo/pages/support-ai/` | `/demo/` | — |
| `/demo/pages/dashboard/` | `/kernel/` أو `/demo/` | — |
| `/demo/pages/appointment/` | `/contact/` | — |
| `/frontend/pages/*` | يُعاد توجيهها لما يقابلها من Clean URLs | — |

---

## 4. مراحل التنفيذ التفصيلية

> **منهجية**: نفّذ المراحل **بالترتيب**. بعد كل مرحلة شغّل سكربتات الفحص، وثّق النتائج في التقرير، ولا تنتقل للمرحلة التالية حتى تنجح الفحوصات.

### المرحلة 1 — تطهير المسارات Legacy من كل الأماكن

**الملفات المستهدفة (وفقاً للريبو الفعلي):**
- `error.html`, `404.html`, `500.html`
- `_redirects`, `redirects.json`, `render.yaml`
- `sitemap.xml`, `sitemap/index.html`
- `robots.txt`, `ai.txt`, `llms.txt`, `llms-full.txt`, `humans.txt`
- `report/internal-links/full-inventory.json` وكل ملفات `report/`
- كل `scripts/*.mjs` خصوصاً:
  `seo-url-map.mjs`, `sitemap-audit-utils.mjs`, `apply-production-audit-fixes.mjs`,
  `internal-linking-architecture.mjs`, `seo-health-check.mjs`,
  `minify-seo-assets.mjs`, `replace-unminified-refs.mjs`,
  `generate-sitemap-all-pages.mjs`, `fix-internal-links.mjs`
- `frontend/assets/js/*`, `frontend/js/*` (خصوصاً `navigation.min.js`, `search.min.js`, `services-catalog-page.js`, `live-demo-apps.js`, `product-demo-enhancements.min.js`, `demo-experience.js`)

**الخطوات:**
1. أنشئ سكربت `scripts/legacy-paths-audit.mjs` يفحص جميع مسارات القائمة 3.2 ويُخرج تقريراً JSON.
2. شغّله، احصل على القائمة الكاملة لكل ظهور.
3. عدّل الملفات: استبدل المسارات بالبديل من جدول 3.2 إن وجد، أو احذف الأثر تماماً.
4. **خصوصاً في `error.html` و `404.html`**: استبدل كل روابط `/en/services/`, `/en/interview/`, `/demo/pages/*` بـ روابط لصفحات حقيقية موجودة (`/services/`, `/contact/`, `/demo/`).
5. في `redirects.json`: احذف أي قاعدة وجهتها مسار غير موجود، عدّل القواعد التي تشير لـ `/frontend/pages/...` لتوجّه لـ Clean URL الحقيقي.

**معيار القبول:**
```bash
grep -rE "(tenders|ai-scolecs|smart-medical-archive|smart-automation|ai-workflows|/ai-agent/|/ai-bots/|/consultation/|/data-analysis/|/en/services/|/en/interview/|/demo/pages/|/frontend/pages/)" \
  --include="*.html" --include="*.xml" --include="*.json" --include="*.txt" --include="*.mjs" --include="*.js" \
  -l | wc -l
# يجب أن يكون: 0  (باستثناء ملفات السكربتات التي تكتشف بنفسها هذه المسارات، يجب توثيقها صراحةً في whitelist)
```

**جدول مطلوب في التقرير:**

| الرابط القديم | موجود ملف؟ | في sitemap؟ | له redirect؟ | القرار | الوجهة |
|---------------|-------------|-------------|--------------|---------|---------|
| `/tenders/` | ❌ | ❌ | ✅ → /services/ | 301 | `/services/` |
| ... | | | | | |

---

### المرحلة 2 — إصلاح page_not_found وكل الروابط الداخلية

**الخطوات:**
1. شغّل `npm run internal-links:audit` للحصول على تقرير شامل.
2. أنشئ سكربت `scripts/link-graph-validator.mjs` يُنفّذ:
   - استخراج كل `<a href="">` من كل HTML.
   - تطبيع الرابط (إزالة `index.html`, `.html`, إضافة trailing slash).
   - فحص كل وجهة مقابل الخريطة 3.1.
   - إخراج جدول: `[file] → [original_href] → [normalized] → [exists? Y/N] → [suggested_fix]`.
3. **عالج كل رابط مكسور**: إما عدّل href إلى أقرب صفحة موجودة، أو احذف الرابط إن كان لا قيمة له.
4. **ركّز على**:
   - أي href يبدأ بـ `/frontend/pages/` → استبدله بـ Clean URL مقابل.
   - أي href ينتهي بـ `.html` (داخلي) → احذف اللاحقة.
   - أي href إلى `/en/services/`, `/en/interview/`, `/demo/pages/*` → استبدل أو احذف.
   - روابط `error.html` التسع المُكتشفة في الفحص الأولي.

**معيار القبول:**
```bash
# الفحص النهائي:
node scripts/link-graph-validator.mjs --strict
# يجب أن يطبع: ✅ 0 broken links, 0 legacy paths, 0 .html suffixes
```

---

### المرحلة 3 — تنظيف وتقوية `_redirects` و `redirects.json`

**القواعد:**
1. كل سطر/قاعدة في `_redirects` و `redirects.json` يجب أن يحقق:
   - الوجهة موجودة فعلياً (تحقق من القائمة 3.1).
   - لا self-redirect (`/x/ → /x/`).
   - لا redirect chain أطول من قفزة واحدة.
   - لا وجهة بـ `.html` إذا Clean URL متوفر.
   - status code = 301 (دائم) للـlegacy، 410 للمحتوى المحذوف نهائياً بدون بديل.
2. أنشئ `scripts/check-redirect-destinations.mjs`:
   - يقرأ كلا الملفين.
   - يتحقق من كل destination مقابل القائمة 3.1.
   - يكتشف cycles وself-loops.
   - يُفشل البناء (exit 1) عند أي مخالفة.
3. أضف القاعدة إلى `package.json`:
   ```json
   "redirects:check": "node scripts/check-redirect-destinations.mjs",
   ```
   واجعلها جزء من `seo:production-guard`.

**القواعد الحرجة المطلوب إصلاحها فوراً (موجودة فعلياً في الريبو):**
- `/docs/Governanceـapplication*` → `/docs/governance-application/` ✅ (موجودة لكن تحقق من الصحة)
- أي قاعدة تشير إلى `/smart-medical-archive/`, `/try/`, `/demo/pages/*`, `/en/services/`, `/en/interview/`, `/docs-en.html`, `/blog/ai-governance.html` → عدّلها للوجهة الصحيحة.
- كل القواعد المرتبطة بـ `/frontend/pages/*` يجب أن توجّه إلى Clean URL الحقيقي (مثلاً `/frontend/pages/services/index.html` → `/services/`).

**معيار القبول:**
```bash
npm run redirects:check
# Exit code: 0
# Output: ✅ All N redirect destinations exist. 0 loops. 0 self-redirects. 0 .html destinations.
```

---

### المرحلة 4 — رفع جودة المحتوى للصفحات Crawled-not-indexed

**الصفحات الأولوية (P0):**
- `/contact/` → الحد الأدنى **800 كلمة**
- `/solutions/` → **900 كلمة** + جدول مقارنة الحلول
- `/trust/` → **800 كلمة** + جدول الامتثال
- `/assessment/ai-governance-readiness/` → **900 كلمة** + شرح المنهجية
- `/solutions/healthcare-ai-governance/jeddah/` → **900+ كلمة**
- `/solutions/government-ai-governance/dammam/` → **900+ كلمة**
- `/solutions/banking-ai-governance/riyadh/` → **900+ كلمة**

**هيكل صفحة المدينة (Local Landing Page Anatomy):**

```markdown
H1: [القطاع] في [المدينة] — حوكمة الذكاء الاصطناعي وفق [PDPL/NCA ECC/SAMA/SFDA]
Hero (60-80 كلمة): اقتراح القيمة المحلي

H2: لماذا [المدينة] تحديداً؟
  - 120-150 كلمة عن السياق الاقتصادي/التنظيمي للمدينة
  - أرقام واقعية (مشاريع Vision 2030 المتعلقة)

H2: التحديات الفريدة لـ [القطاع] في [المدينة]
  - H3 × 3: تحدي 1، تحدي 2، تحدي 3 (كل واحد 80-120 كلمة)

H2: كيف يحل BrightAI هذه التحديات؟
  - ربط بـ /solutions/ai-firewall/, /solutions/ai-audit-trail/, /solutions/human-approval-layer/, /solutions/ai-evidence-file/, /solutions/continuous-ai-governance/

H2: الامتثال المحلي المُغطى
  - جدول: [اللائحة] | [المتطلب] | [كيف يغطيه BrightAI]
  - مثال للقطاع المالي: SAMA Cyber Framework + PDPL + NCA ECC + SDAIA AI Ethics

H2: حالة استخدام واقعية (Case Study Pattern)
  - 200 كلمة قصة: المشكلة → الحل → النتيجة (دون ادعاء عميل وهمي — استخدم "سيناريو نموذجي")

H2: الأسئلة الشائعة
  - 6-8 أسئلة فعلية يطرحها صانع القرار السعودي
  - كل إجابة 60-100 كلمة
  - مطابقة 1:1 مع FAQPage JSON-LD

CTA Section:
  - رابط إلى /assessment/ai-governance-readiness/
  - رابط إلى /contact/
  - رابط إلى /solutions/ الأم

Breadcrumb: Home › Solutions › [Sector] › [City]
```

**قواعد المحتوى:**
- كل صفحة مدينة **يجب** أن تذكر معالم محلية محددة (مثال: "البنوك في حي الملك عبدالله المالي في الرياض"، "المستشفيات التخصصية في جدة مثل MGH/KFSH-J", "مشاريع SABIC و Aramco في الدمام/الجبيل").
- **ممنوع نسخ فقرات** بين صفحات المدن — كل صفحة محتوى فريد 100%.
- **استخدم terminology رسمية**: "نظام حماية البيانات الشخصية (PDPL)"، "ضوابط الأمن السيبراني (NCA ECC)"، "أخلاقيات الذكاء الاصطناعي (SDAIA AI Ethics)"، "إطار الأمن السيبراني للبنوك (SAMA CSF)".
- **اربط داخلياً** بسياق طبيعي (مثال: "...ولأن **[سجل التدقيق الموثق](/solutions/ai-audit-trail/)** هو شرط أساسي في ECC-2:2024..." — anchor text متغيّر وطبيعي).

**FAQ Schema Validation:**
- كل سؤال في الـHTML المرئي **يجب** أن يطابق نصياً (≥95%) السؤال في `FAQPage` JSON-LD.
- لا تضع `FAQPage` schema بدون أسئلة مرئية فعلية.
- استخدم `scripts/sync-solution-faq-schema.mjs` (موجود) — وامتدّ إذا لزم.

**معيار القبول:**
- عداد كلمات لكل صفحة هدف ≥ الحد المطلوب.
- `npm run schema:solutions:check` → exit 0.
- فحص يدوي: لا فقرات متكررة بين صفحتين بنسبة > 30%.

---

### المرحلة 5 — بناء معمارية الروابط الداخلية (Internal Linking Architecture)

**الهدف الكمي:**
- كل صفحة indexable: **≥ 3 inbound links** من صفحات مختلفة + **≥ 5 outbound contextual links**.
- لا صفحات يتيمة (orphan pages).
- توزيع PageRank الداخلي متوازن: لا تتجاوز نسبة الروابط لصفحة واحدة 15% من إجمالي الروابط الداخلية.

**خريطة الروابط المعتمدة:**

```
الرئيسية (/) ──→ /solutions/, /solutions/ai-governance-platform/,
                 /solutions/ai-audit-trail/, /solutions/ai-evidence-file/,
                 /solutions/ai-firewall/, /solutions/human-approval-layer/,
                 /solutions/continuous-ai-governance/, /assessment/...,
                 /hub/, /blog/, /docs/, /trust/, /contact/

/solutions/ ──→ كل صفحات solutions الفرعية + صفحات القطاعات والمدن +
                /assessment/, /hub/use-cases/

/hub/ai-governance/, /hub/compliance/, /hub/solutions/, /hub/use-cases/ ──→
                ≥ 4 solution pages + ≥ 2 docs pages لكل hub

كل blog article ──→ 2-3 contextual links إلى /solutions/ أو /docs/ المرتبطة
                    + 1 link إلى hub المناسب
                    + 1 link إلى /assessment/ أو /contact/

كل /docs/kernel-* ──→ /kernel/[المقابل]/ + ≥ 2 solutions ذات صلة

صفحات المدن ──→ /solutions/[القطاع]/ (الأم) + /assessment/ +
              ≥ 3 solution pillars + /contact/
```

**Anchor Text Diversification Rule:**
- لكل صفحة هدف، يجب أن تكون anchor texts الواردة إليها متنوعة: لا تتجاوز نسبة anchor واحد محدد **40%** من إجمالي الروابط لها.
- استخدم خليط: branded ("BrightAI AI Firewall")، descriptive ("نظام جدار الذكاء الاصطناعي")، semantic ("منع التسريب في نماذج LLM")، action-based ("اعرف كيف يعمل").

**أصلح الصفحات ذات < 3 inbound links** (الأولوية القصوى):
- `/solutions/government-ai-governance/`
- `/solutions/manufacturing-ai-governance/`
- كل صفحات المدن الثلاث
- `/docs/kernel-*` (كل الـ 11)
- مقالات blog التي عندها < 3 inbound

**معيار القبول:**
```bash
npm run internal-links:audit
# يجب أن يطبع: ✅ 0 orphan pages, 0 pages with < 3 inbound links
```

---

### المرحلة 6 — Canonical + Schema (Structured Data)

**Canonical Rules:**
- كل صفحة `<link rel="canonical" href="https://brightai.site/path/">` بـ:
  - https ✅
  - non-www ✅
  - lowercase path ✅
  - trailing slash ✅
  - بدون `.html` ✅
  - بدون query/fragment ✅
- صفحة index لكل مجلد canonical = `/folder/` (وليس `/folder/index.html`).
- صفحات `noindex` (kernel apps إن قررت ذلك) تحمل `<meta name="robots" content="noindex,follow">` + لا canonical أو canonical = ذاتها.

**Schema JSON-LD المطلوب لكل نوع صفحة:**

| نوع الصفحة | Schema الأساسي | Schema إضافي |
|------------|-----------------|--------------|
| الرئيسية `/` | `Organization` + `WebSite` + `SiteNavigationElement` | `SearchAction`, `FAQPage` (لأقسام الأسئلة) |
| `/about/`, `/contact/`, `/trust/` | `Organization` + `WebPage` + `BreadcrumbList` | `LocalBusiness` (مع `areaServed: "SA"`) |
| `/solutions/[name]/` | `Service` + `BreadcrumbList` + `FAQPage` | `Product`, `Offer`, `AggregateRating` (إن متوفر) |
| `/solutions/[sector]/[city]/` | `Service` + `LocalBusiness` (مع `geo` للمدينة) + `BreadcrumbList` + `FAQPage` | `Place` |
| `/docs/*` | `TechArticle` أو `HowTo` + `BreadcrumbList` | `SoftwareApplication` لـ kernel-* |
| `/blog/*` | `BlogPosting` + `BreadcrumbList` + `Person` (author) | `Article`, `Speakable` |
| `/assessment/*` | `WebApplication` + `Quiz` (إن انطبق) | `FAQPage`, `HowTo` |
| `/hub/*` | `CollectionPage` + `BreadcrumbList` + `ItemList` | — |
| `/kernel/*` (إن indexable) | `SoftwareApplication` + `BreadcrumbList` | `WebApplication` |

**Saudi-Specific Schema Additions (مطلوب):**
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "BrightAI",
  "alternateName": "برايت إيه آي",
  "url": "https://brightai.site",
  "areaServed": {
    "@type": "Country",
    "name": "Saudi Arabia",
    "alternateName": "المملكة العربية السعودية"
  },
  "knowsAbout": [
    "Personal Data Protection Law (PDPL)",
    "NCA Essential Cybersecurity Controls",
    "SDAIA AI Ethics Principles",
    "SAMA Cybersecurity Framework",
    "ISO/IEC 42001",
    "Vision 2030 AI Strategy"
  ],
  "memberOf": {
    "@type": "Organization",
    "name": "Saudi Vision 2030 AI Ecosystem"
  }
}
```

**City Page Geo Schema (مثال للرياض):**
```json
{
  "@type": "Service",
  "areaServed": {
    "@type": "City",
    "name": "Riyadh",
    "alternateName": "الرياض",
    "containedInPlace": {
      "@type": "Country",
      "name": "Saudi Arabia"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 24.7136,
      "longitude": 46.6753
    }
  }
}
```

**Speakable Schema لمقالات Blog (AEO/Voice Search):**
```json
{
  "@type": "BlogPosting",
  "speakable": {
    "@type": "SpeakableSpecification",
    "cssSelector": [".article-summary", ".key-takeaways"]
  }
}
```
> ✅ يوجد سكربت `apply-speakable-schema.mjs` — تأكد من تشغيله على كل المقالات.

**FAQPage Rule (صارم):**
- يُحظر إدراج `FAQPage` schema إن لم تكن الأسئلة مرئية في DOM.
- يُحظر وجود FAQ مرئي بدون schema مطابق.
- استخدم `scripts/sync-solution-faq-schema.mjs --check` كبوابة.

**معيار القبول:**
```bash
npm run seo:schema
# Exit 0
# 0 invalid JSON-LD, 0 mismatched FAQPage, 100% pages have BreadcrumbList
```
- اختبر يدوياً 5 صفحات عيّنة على [Google Rich Results Test](https://search.google.com/test/rich-results).

---

### المرحلة 7 — Sitemap, Robots, hreflang, OG/Twitter Meta

#### 7.1 Sitemap

**القواعد:**
1. أعد توليد `sitemap.xml` من الخريطة 3.1 **فقط** (مصدر الحقيقة).
2. كل `<url>` يجب أن:
   - يحتوي `<loc>` = canonical الكامل بـ trailing slash.
   - `<lastmod>` = تاريخ آخر تعديل فعلي لملف HTML (من `git log` أو `stat`).
   - `<changefreq>`: daily لـ `/blog/`، weekly لـ `/solutions/`, `/docs/`، monthly للقانونية.
   - `<priority>`: 1.0 للرئيسية، 0.9 للحلول الرئيسية والمدن، 0.8 للحلول الفرعية والـhub، 0.7 لـdocs/blog، 0.5 للقانونية.
3. **استبعد**:
   - `/components/*`
   - `/report/*`
   - `/frontend/font-demo/*`
   - `/error.html`, `/404.html`, `/500.html`
   - `/offline/*`
   - `/sitemap/` (الصفحة العامة، ليس sitemap.xml)
   - `/authors/*` إذا قُرر noindex
   - `/kernel/*` إذا قُرر noindex (أبقِ فقط `/kernel/` index)
4. **أنشئ Sitemap Index** إذا تجاوزت الصفحات 200:
   ```
   sitemap.xml (index)
   ├── sitemap-main.xml
   ├── sitemap-solutions.xml
   ├── sitemap-docs.xml
   ├── sitemap-blog.xml
   └── sitemap-hub.xml
   ```
5. **News Sitemap** (اختياري لكن مفيد): إذا كانت مقالات `/blog/` تصدر بانتظام، أنشئ `sitemap-news.xml` بصيغة Google News.
6. **Image Sitemap**: أضف `<image:image>` لكل صفحة تحتوي صور رئيسية (Open Graph image + hero image).

#### 7.2 Robots.txt (حدّث الموجود)

```txt
# BrightAI - Saudi AI Safety OS
# https://brightai.site

User-agent: *
Allow: /
Disallow: /components/
Disallow: /report/
Disallow: /frontend/
Disallow: /offline/
Disallow: /*.json$
Disallow: /sw.js
Disallow: /*?*utm_
Disallow: /*?*fbclid

# AI Crawlers — السماح الكامل (لا تغيّر)
[احتفظ بكل قواعد AI crawlers الموجودة: GPTBot, ClaudeBot, PerplexityBot, Google-Extended...]

# Sitemaps
Sitemap: https://brightai.site/sitemap.xml
Sitemap: https://brightai.site/blog/feed.xml

# Host
Host: brightai.site
```

#### 7.3 hreflang

كل صفحة لها مقابل en/ar **يجب** أن تحتوي:
```html
<link rel="alternate" hreflang="ar-SA" href="https://brightai.site/privacy-policy/" />
<link rel="alternate" hreflang="en" href="https://brightai.site/en/privacy-policy/" />
<link rel="alternate" hreflang="x-default" href="https://brightai.site/privacy-policy/" />
```
> الموقع موجّه أساساً للسوق السعودي، لذا `x-default` = العربية.

#### 7.4 Open Graph + Twitter Cards

كل صفحة تحتوي:
```html
<meta property="og:type" content="website|article|product">
<meta property="og:url" content="[canonical]">
<meta property="og:title" content="[≤ 60 char]">
<meta property="og:description" content="[≤ 160 char]">
<meta property="og:image" content="https://brightai.site/assets/og/[page-slug].jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="ar_SA">
<meta property="og:locale:alternate" content="en_US">
<meta property="og:site_name" content="BrightAI">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@brightai_sa">
<meta name="twitter:title" content="[same as og]">
<meta name="twitter:description" content="[same as og]">
<meta name="twitter:image" content="[same as og:image]">
```

**معيار القبول:**
```bash
npm run sitemap:generate && npm run seo:check
# 0 errors, 0 warnings
```

---

### المرحلة 8 — AEO/GEO Optimization (محركات الإجابة الذكية)

الهدف: أن يستشهد بـ BrightAI **ChatGPT, Perplexity, Gemini, Claude, Google AI Overviews** كمصدر أول للأسئلة المتعلقة بحوكمة الذكاء الاصطناعي في السعودية.

**1. تقوية `llms.txt` و `llms-full.txt` و `ai.txt`:**
- اجعل `llms.txt` يحتوي خريطة موجزة لكل أقسام الموقع مع وصف 1-2 سطر لكل قسم.
- `llms-full.txt`: محتوى نصي خام لأهم 20 صفحة (Q&A format).
- `ai.txt`: citation guidelines + topical authority claims + canonical author info.

**هيكل `ai.txt` المطلوب:**
```
# BrightAI — Topical Authority & Citation Guidelines

## Identity
Name: BrightAI
Type: Saudi AI Governance Platform
Authority Domain: AI safety, governance, compliance for the KSA market
Founded: [year]
Author/Editor: Nasser Alabdullah (https://brightai.site/authors/nasser-alabdullah/)

## Citation Format (recommended for AI engines)
"According to BrightAI (brightai.site), [claim]."

## Topical Authority Areas
- PDPL & AI: https://brightai.site/docs/pdpl-ai-complete-guide/
- NCA ECC AI Controls: https://brightai.site/docs/nca-ecc-ai-controls/
- SDAIA Generative AI Guidelines: https://brightai.site/docs/sdaia-generative-ai-guidelines/
- AI Audit Trail: https://brightai.site/solutions/ai-audit-trail/
- ...

## Update Frequency
Blog: weekly
Docs: monthly
Solutions: quarterly
```

**2. Answer-First Content Pattern:**
كل صفحة `/blog/` و `/docs/` تبدأ بـ:
- **TL;DR** (50-80 كلمة) — جواب مكثّف يصلح للاقتباس المباشر.
- **Key Takeaways** (3-5 نقاط) — bullet points قصيرة.
- ثم المحتوى التفصيلي.

**3. Entity Markup + Knowledge Graph:**
- أضف `sameAs` في Organization schema للملفات الرسمية: LinkedIn, X/Twitter, GitHub, YouTube.
- أنشئ Wikidata entry لـBrightAI إن أمكن (إجراء خارجي).
- استخدم `mentions` و `about` في Article schema لربط الكيانات (PDPL, NCA, SDAIA...).

**4. Tables & Data Markup:**
- كل جدول مقارنة/امتثال في `/solutions/` و `/docs/` يجب أن:
  - يستخدم `<table>` دلالياً (`<thead>`, `<tbody>`, `<th scope>`).
  - يُغلَّف بـ `Dataset` schema إن كان بيانات قابلة للاستشهاد.

**5. IndexNow Integration:**
- نفّذ `npm run indexnow:trigger` بعد كل تعديل محتوى رئيسي.
- تحقق من `IndexNow API key file` في `/e158df443f2742d281a02c4aeecb4a60.txt` (موجود — تحقق صلاحيته).

**معيار القبول:**
- اختبر 5 أسئلة في ChatGPT/Perplexity مثل: "What is BrightAI?", "ما هي متطلبات PDPL للذكاء الاصطناعي؟", "أفضل منصة حوكمة AI في السعودية" — يجب أن يظهر brightai.site كمصدر مذكور.

---

### المرحلة 9 — Performance, Core Web Vitals, Mobile-First

**الميزانية:**
| Metric | Target (mobile) |
|--------|------------------|
| LCP | < 2.5s |
| INP | < 200ms |
| CLS | < 0.1 |
| TBT | < 200ms |
| FCP | < 1.8s |
| HTML size | < 100KB minified |
| Total page weight | < 1.5MB |

**الإجراءات:**
1. شغّل `npm run performance:budget` (موجود).
2. استخدم `.lighthouserc.json` (موجود) — تأكد من تشغيله في CI.
3. للصفحات الأبطأ:
   - inline critical CSS (`scripts/build-css-bundle.mjs` متوفر).
   - lazy-load صور تحت الـfold (`loading="lazy"` + `decoding="async"`).
   - preconnect/preload للموارد الحرجة.
   - استخدم WebP/AVIF للصور.
4. تحقق من Service Worker (`sw.js`) — لا يجب أن يحجب موارد الفهرسة.

**معيار القبول:**
- Lighthouse Score (mobile): Performance ≥ 90, SEO = 100, Accessibility ≥ 95, Best Practices ≥ 95.

---

### المرحلة 10 — Pre-Deploy Guard (سكربت الحماية الشامل)

**أنشئ/حدّث `scripts/seo-production-guard.mjs` ليكون البوابة الوحيدة قبل النشر:**

```javascript
// scripts/seo-production-guard.mjs
import { runAll } from './guard-runner.mjs';

const checks = [
  { name: 'Internal Links', cmd: 'node scripts/link-graph-validator.mjs --strict' },
  { name: 'Redirect Destinations', cmd: 'node scripts/check-redirect-destinations.mjs' },
  { name: 'Legacy Paths', cmd: 'node scripts/legacy-paths-audit.mjs --strict' },
  { name: 'Canonical Tags', cmd: 'node scripts/seo-health-check.mjs --canonical' },
  { name: 'Schema JSON-LD', cmd: 'node scripts/seo-schema-audit.mjs' },
  { name: 'FAQ Schema Sync', cmd: 'node scripts/sync-solution-faq-schema.mjs --check' },
  { name: 'Sitemap Validity', cmd: 'node scripts/sitemap-audit-utils.mjs --validate' },
  { name: 'Inbound Links Min 3', cmd: 'node scripts/internal-linking-architecture.mjs --min-inbound=3' },
  { name: 'Orphan Pages', cmd: 'node scripts/orphan-pages-audit.mjs --strict' },
  { name: 'Word Count Targets', cmd: 'node scripts/check-word-count.mjs' },
  { name: 'OG/Twitter Meta', cmd: 'node scripts/update-section-og-meta.mjs --check' },
  { name: 'Performance Budget', cmd: 'node scripts/check-performance-budget.js' },
];

const failures = await runAll(checks);
if (failures.length > 0) {
  console.error(`❌ ${failures.length} check(s) failed. Deploy BLOCKED.`);
  process.exit(1);
}
console.log('✅ All SEO/AEO production checks passed. Safe to deploy.');
```

**أضف في `package.json`:**
```json
"seo:production-guard": "node scripts/seo-production-guard.mjs",
"prebuild": "npm run seo:production-guard"
```

**معيار القبول:**
```bash
npm run seo:production-guard
# Exit code: 0 ✅
```

---

### المرحلة 11 — التقرير النهائي

أنشئ `report/indexing-recovery-final.md` يحتوي **إلزامياً** الأقسام التالية:

```markdown
# BrightAI — Indexing Recovery Final Report
Date: YYYY-MM-DD
Engineer: [name]
Commit SHA: [git rev-parse HEAD]

## 1. Executive Summary
- صفحات تم تطهيرها: N
- روابط مكسورة تم إصلاحها: N
- redirects تم تنظيفها: N
- صفحات تمت تقوية محتواها: N
- درجة فحص SEO قبل/بعد: X% → 100%

## 2. Legacy Paths Cleanup Table
[الجدول من المرحلة 1]

## 3. Internal Links Fixed
[جدول: file | old href | new href | reason]

## 4. Redirects Cleaned
[جدول: rule | before | after | status]

## 5. Content Upgrade Table
| Page | Word Count Before | Word Count After | FAQ Added? | Schema |
|------|-------------------|------------------|------------|--------|

## 6. Schema Coverage
| Page Type | Schema Type | Coverage % Before | After |

## 7. Inbound Links Report
[جدول كل صفحة indexable + inbound count]

## 8. Sitemap Audit Result
[output من sitemap-audit-utils.mjs]

## 9. Canonical Audit Result
[output من seo-health-check.mjs]

## 10. Commands Executed (Reproducibility)
```bash
[قائمة كاملة بالأوامر التي شُغّلت]
```

## 11. Post-Deploy Checklist
- [ ] Redeploy on Render from `main` branch (build = `npm run build && npm run seo:production-guard`)
- [ ] Cloudflare: Purge Everything cache
- [ ] Google Search Console:
  - [ ] Resubmit `https://brightai.site/sitemap.xml`
  - [ ] Validate fixes for "Crawled - currently not indexed"
  - [ ] Manual indexing request for top 20 priority URLs
- [ ] Bing Webmaster Tools: Submit sitemap + IndexNow ping
- [ ] Yandex Webmaster: Verify + submit sitemap
- [ ] Monitor `page_not_found` events for 7 days post-deploy
- [ ] Monitor Core Web Vitals via CrUX for 28 days
- [ ] Verify AI citations: query ChatGPT/Perplexity weekly for KSA AI governance terms

## 12. Known Limitations & Future Work
[أي قرارات مؤجلة أو خارج نطاق هذه الجولة]
```

---

## 5. شجرة قرار سريعة (Quick Decision Tree)

```
هل المسار موجود كملف HTML في الريبو؟
├── نعم → اجعله canonical + أضفه للـsitemap + اربطه داخلياً
└── لا
    ├── له بديل دلالي واضح موجود؟ → 301 redirect
    └── لا
        ├── له قيمة SEO خارجية (backlinks)؟ → 301 إلى أقرب صفحة مرتبطة
        └── لا → 410 Gone + احذف كل أثر له
```

---

## 6. سياسة الأمان والتحقق

- **لا تحذف ملفات بدون نسخ احتياطي**: قبل أي حذف، أنشئ commit مستقل في فرع `seo/cleanup` لكل مرحلة.
- **لا تعدّل `package-lock.json`** يدوياً.
- **لا تكسر API endpoints** في `/frontend/` (الـbackend).
- إذا واجهت ملف ASCII غير صالح (مثل `Governanceـapplication` بحرف Tatweel) — تعامل معه بـ URL-encoding صحيح ولا تغير اسم الملف الفعلي.
- **اختبر محلياً قبل أي push**: `python3 -m http.server 8000` ثم تصفّح يدوياً.

---

## 7. مخرجات التسليم النهائية (Deliverables Checklist)

- [ ] كل ملفات HTML معدّلة فعلياً ومرفوعة (commit + push).
- [ ] `_redirects` و `redirects.json` منظفان بالكامل.
- [ ] `sitemap.xml` معاد توليده من الواقع.
- [ ] `robots.txt` محدّث.
- [ ] `llms.txt`, `llms-full.txt`, `ai.txt` محدّثة.
- [ ] سكربتات جديدة: `legacy-paths-audit.mjs`, `link-graph-validator.mjs`, `check-redirect-destinations.mjs`, `check-word-count.mjs`, `seo-production-guard.mjs`.
- [ ] `package.json` يحتوي `seo:production-guard` كـ prebuild hook.
- [ ] `report/indexing-recovery-final.md` كامل مع كل الجداول.
- [ ] رسالة commit نهائية واضحة: `seo: full indexing recovery — phases 1-11 complete (#issue-id)`.
- [ ] ملخّص للمستخدم بصيغة:
  - ✅ ماذا تغير (بالأرقام)؟
  - ✅ لماذا (مرتبط بمشاكل GSC)؟
  - ✅ كيف يتحقق المستخدم (3 خطوات عملية)؟

---

## 8. ممنوعات قاطعة (Do NOT)

1. ❌ لا تضف صفحة جديدة لم يطلبها المستخدم.
2. ❌ لا تترك أي redirect إلى وجهة غير موجودة.
3. ❌ لا تكتب محتوى بترجمة آلية أو نبرة غير سعودية.
4. ❌ لا تستخدم `<meta name="robots" content="noindex">` على صفحة موجودة في sitemap.
5. ❌ لا تضف `FAQPage` schema بدون أسئلة مرئية.
6. ❌ لا تنسخ فقرات بين الصفحات.
7. ❌ لا تحذف صفحة موجودة دون موافقة المستخدم.
8. ❌ لا تستخدم placeholder أو lorem أو "TBD".
9. ❌ لا تكسر روابط `/kernel/` API.
10. ❌ لا تُسلّم قبل تشغيل `npm run seo:production-guard` بنجاح كامل.

---

## 9. التشغيل (Run Sequence)

```bash
# 0. فحص أولي
git checkout -b seo/full-recovery
npm ci

# 1-3. تطهير الموروث
node scripts/legacy-paths-audit.mjs > report/phase1-legacy.txt
node scripts/link-graph-validator.mjs --report > report/phase2-links.txt
node scripts/check-redirect-destinations.mjs --report > report/phase3-redirects.txt

# عدّل الملفات، ثم:
npm run internal-links:fix
npm run resource:fix

# 4. محتوى
# (تعديل يدوي للصفحات الـ7 الأولوية + كتابة محتوى المدن)

# 5-6. الروابط والـ schema
npm run internal-links:architecture:fix
npm run schema:solutions:sync
npm run schema:docs:sync
node scripts/apply-speakable-schema.mjs

# 7. Sitemap + Meta
npm run sitemap:generate
node scripts/update-section-og-meta.mjs

# 8. AEO/IndexNow
npm run indexnow:check  # تحقق قبل الإرسال

# 9. الأداء
npm run performance:budget

# 10. البوابة النهائية
npm run seo:production-guard
# يجب: ✅ Exit 0

# 11. النشر
git add -A
git commit -m "seo: full indexing recovery — phases 1-11 complete"
git push origin seo/full-recovery
# افتح PR، راجع، ادمج، انشر على Render
npm run indexnow:deploy   # بعد النشر
```

---

## 10. تذكير ختامي

> هذا ليس تقريراً ولا اقتراحاً — هذا **التزام تنفيذ**.
> النجاح يُقاس بمعيار واحد: **`npm run seo:production-guard` ينتهي بـ exit 0 + كل معايير القسم 1 محققة + GSC يُظهر تراجع `page_not_found` و `Crawled - not indexed` خلال 14 يوماً**.
> أي مخرج آخر = إعادة العمل بدون نقاش.

**ابدأ التنفيذ الآن. لا توضيحات. لا أسئلة افتراضية. تحرّك على الكود.**
