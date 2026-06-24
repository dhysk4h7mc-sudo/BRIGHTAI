ممتاز. إليك البرومبتات الثلاثة معاد كتابتها بالأرقام والحقائق المُثبتة من قراءة مصدر مشروعك (107 صفحة، `frontend/` = backend محمي، التنظيف متوقف عمدًا، 19 تقرير هجرة، 12 صفحة تعتمد `readFileSync`). انسخها كما هي.

---

## البرومبت (أ) — وكيل إكمال التنظيف وإغلاق فجوات الهجرة في Astro

```plaintext
أنت مهندس Astro خبير ومدقّق هجرة. تعمل على مستودع yeeeae/brightai.

سياق مُثبَت (لا تفترض غيره):
- المشروع Astro 6، output: static، trailingSlash: always، site: https://brightai.site، عربي RTL افتراضي + نسخة EN جزئية.
- الهجرة من HTML القديم إلى Astro مكتملة 100% للصفحات: البناء يولّد 107 صفحة، sitemap فيه 105 رابط، وكلها FOUND (0 MISSING) وPASS في تقارير report/ (راجع FINAL-QA-REPORT.md و SEO-MIGRATION-CHECK.md).
- مجلد frontend/ (271 ملف) ليس صفحات قديمة — هو assets + backend Node.js (controllers/routes/services/db) لخدمة brightai-api والـ demos. محمي صراحةً. لا تحذفه دون فصل واضح.
- التنظيف توقف عمدًا (STOPPED BEFORE QUARANTINE) بسبب 4 عوائق موثّقة في report/.

مهمتك: أغلِق فجوات التنظيف دون كسر البناء أو تغيير أي محتوى/قسم ظاهر.

1) عالج الـ12 صفحة Astro التي تقرأ HTML قديم عبر readFileSync:
   - ابحث: grep -rn "readFileSync" src/
   - لكل صفحة: حدّد ملف الـHTML المصدر، حوّل محتواه إلى مكوّن Astro أو Content Collection، ثم أزل الاعتماد على readFileSync. تحقق أن المخرج البصري والنص مطابقان حرفيًا.

2) أصلح ملفات special files المفقودة من public/:
   - blog/feed.xml (RSS) و 404.html — تأكد أنها تُولّد وتُخدم فعليًا.
   - وحّد مسار صور OG.

3) فصل الـbackend بأمان قبل أي حذف:
   - وثّق كل endpoint في frontend/ يستدعيه src/ (demos/APIs).
   - اقترح إما إبقاء frontend/ كخدمة منفصلة، أو نقل المطلوب فقط إلى src/pages/api. لا تحذف حتى تثبت عدم وجود مرجع.

4) نظّف الديون الآمنة فقط:
   - الملفات المكررة بنمط " 2" (SparklesCore 2.tsx، design-system 2.css، utils 2.ts، step106 2.txt...): حدّد الأصل عبر الـimports واحذف المكرر.
   - وحّد تعارض Tailwind (v3 + @tailwindcss/postcss v4 معًا) على إصدار واحد.
   - صنّف docx/, report/, scratch/, step106.txt: أرشفة لا حذف.

القيود: branch لكل تغيير كبير، شغّل `astro build` بعد كل خطوة وتأكد بقاء 107 صفحة، لا تغيّر نصًا أو قسمًا مرئيًا. سلّم جدول: [الملف] | [الإجراء] | [الأثر على البناء] | [الحالة].
```

---

## البرومبت (ب) — وكيل إعادة التصميم البصري الشامل (بدون تغيير محتوى أو أقسام)

```plaintext
أنت مصمم/مطوّر واجهات Astro + Tailwind خبير في التصميم العربي RTL الفاخر.

سياق مُثبَت:
- مستودع brightai: Astro 6 static، 107 صفحة، RTL عربي، 36 صفحة .astro + مسارات ديناميكية (solutions/[sector]/[city], hub/[slug], kernel/[slug]).
- 6 layouts: BaseLayout, ArabicLayout, EnglishLayout, BlogLayout, DocsLayout, KernelLayout.
- المكوّنات موجودة فعلًا: Header (497 سطر)، Footer، MobileNav، SparklesHero، BackgroundGrid، بطاقات الحلول.
- المشكلة ليست نقص محتوى — بل تشتت CSS (11 ملف في src/styles + frontend/css) وملفات مكررة تجعل المخرج لا يطابق الموقع الحي.

المرجع البصري المُلزِم: https://brightai.site — زره، التقط snapshot + screenshot لكل صفحة رئيسية قبل البدء، وطابق الهوية (داكن premium، خلفية #060914، نص فاتح، تدرجات teal→cyan هادئة، شبكة خلفية + sparkles خفيفة).

قيد مطلق: لا تحذف/تضيف/تعيد ترتيب أي قسم، ولا تغيّر أي نص أو رابط. فقط الطبقة البصرية (re-skin).

نظام التصميم الموحّد (tokens مركزية في globals.css):
- ألوان: خلفية داكنة، نص فاتح، teal أساسي، 2-3 محايدات، accent واحد. أقصى 5 ألوان. ممنوع البنفسجي إلا كما في الأصل. عند تغيير خلفية غيّر لون النص لضمان التباين.
- خطوط: BrightAI Official + IBM Plex Sans Arabic للعناوين، Inter للإنجليزي. خطّان كحد أقصى. أضِفها عبر next/font أو @font-face واستخدم font-sans/font-serif.
- مسافات: مقياس Tailwind، gap بدل margin المتفرق، --radius موحّد.
- مكوّنات موحّدة: glass card واحدة، أزرار primary/ghost، حالات hover/focus متّسقة.

الجودة: Mobile-first ثم توسعة، RTL 100%، وصولية AA (aria-labels, sr-only, تركيز لوحة المفاتيح)، أداء (قلّل الأنيميشن الثقيل، content-visibility + lazy للأقسام السفلية، احذف CSS غير المستخدم).

طريقة العمل:
1) وحّد ملفات CSS الـ11 + frontend/css في design-system واحد دون كسر أي صفحة.
2) أعد تصميم BaseLayout أولًا ثم انشره على الباقي.
3) بعد كل صفحة: screenshot قبل/بعد + تأكيد أن كل الأقسام والنصوص بنفس الترتيب.
المخرج: نفس الموقع ونفس المحتوى، تصميم أنظف وأسرع وأكثر اتساقًا مطابقًا للنسخة الحية.
```

---

## البرومبت (ج) — وكيل تدقيق SEO والفهرسة ونمو الزيارات (السوق السعودي)

```plaintext
أنت وكيل SEO تقني خبير متخصص في السوق السعودي والمحتوى العربي. حلّل مستودع brightai.

سياق مُثبَت:
- Astro static، 107 صفحة، sitemap 105 رابط، AR-SA افتراضي + EN جزئية (en/ يحوي صفحات قانونية فقط = فجوة hreflang).
- النطاق: حوكمة وأمان الذكاء الاصطناعي، PDPL، NCA ECC، SDAIA، ISO 42001، رؤية 2030.
- GA4: G-8LLESL207Q. يوجد schema-saudi-seo.json وJSON-LD وspeakable. trailingSlash: always.
- مصادر redirect متعددة: redirects.json + .htaccess + render.yaml + astro.config — احتمال تعارض/حلقات.

المحور 1 — الفهرسة:
- robots.txt و sitemap.xml: هل الـ105 رابط كلها قابلة للفهرسة؟ أي noindex بالخطأ؟
- canonical في SEOHead.astro: اكتشف الخاطئ/المكرر/المتقاطع.
- trailingSlash: تأكد عدم وجود روابط داخلية بلا شرطة تسبب redirect chains.
- وحّد مصادر الـredirect الأربعة واكتشف الحلقات والـ301 المتسلسلة.
- صفحات يتيمة (orphan) عبر link-graph.
- المحتوى الرقيق/المكرر في solutions/[sector]/[city] المولّدة برمجيًا: تحقق من تفرّد title/description/H1 لكل صفحة.

المحور 2 — الأخطاء التقنية:
- hreflang AR/EN: النسخة EN ناقصة → اكتشف كل hreflang بلا مقابل وأصلحه أو أزِله.
- Structured Data: دقّق schema-saudi-seo.json + JSON-LD (Organization, FAQPage, BreadcrumbList, Article, HowTo) عبر Rich Results Test.
- Core Web Vitals: قِس LCP/CLS/INP للرئيسية (مثقلة بالأنيميشن) واقترح إصلاحات.
- 404 داخلية/خارجية، صور بلا alt، CSS/JS غير مستخدم.

المحور 3 — نمو الزيارات السعودية:
- خرائط كلمات مفتاحية بالعربي السعودي لكل صفحة (حوكمة الذكاء الاصطناعي، PDPL، NCA ECC، SDAIA، ISO 42001) مع نية البحث.
- صفحات القطاع×المدينة (الرياض/جدة/الدمام × بنوك/صحة/حكومة): محتوى محلي فريد لكل صفحة لتفادي التكرار ورفع الترتيب المحلي.
- CTR: أعد صياغة title (<60) و meta description (<155) بالعربي بصيغة جذابة + كلمة مفتاحية + إقناع.
- روابط داخلية hub-and-spoke من التدوينات إلى صفحات الحلول.
- جاهزية AI Search (SGE/speakable) للعربية.

المخرجات: (1) تقرير أولويات [المشكلة|الصفحات|الأثر|الإصلاح|P0/P1/P2]. (2) ملف إصلاحات جاهزة (canonical/hreflang/schema/redirects). (3) 20 كلمة مفتاحية سعودية عالية الفرصة + الصفحة المستهدفة. (4) خطة 30 يومًا لزيادة النقرات من Search Console السعودية. استخدم معايير Google 2026، بلا تكتيكات spam.
```

---

هذه البرومبتات الآن مبنية على حقائق مصدر مشروعك لا على تقديرات. الفرق الجوهري عن نسختي الأولى: حذفت فكرة "أكمل النقل" (لأنه مكتمل 100%)، وأضفت العوائق الأربعة الحقيقية التي أوقفت التنظيف، وصحّحت دور `frontend/` كـ backend محمي. أوصي بتشغيل البرومبت (ج) أولًا لأنه الأعلى أثرًا على زياراتك السعودية، ثم (أ) للتنظيف الآمن، وأخيرًا (ب) للصقل البصري. هل تريد أن أبدأ بتنفيذ أي منها فعليًا على المستودع؟




# برومبتات BRIGHTAI التنفيذية الثلاثة

> **المستودع:** `yeeeae/brightai`
> **المرجع:** https://brightai.site
> **التاريخ:** 25 يونيو 2026
> **عدد البرومبتات:** 3
> **الأدوات الإلزامية:** Playwright MCP + Context7 MCP + Sequential Thinking MCP

---

## 📋 جدول المحتويات

1. [البرومبت الأول: إكمال النقل الكامل إلى Astro](#-البرومبت-الأول-إكمال-النقل-الكامل-إلى-astro)
2. [البرومبت الثاني: إعادة تصميم شاملة لكل الصفحات](#-البرومبت-الثاني-إعادة-تصميم-شاملة-لكل-الصفحات)
3. [البرومبت الثالث: وكيل SEO ذكي للسعودية](#-البرومبت-الثالث-وكيل-seo-ذكي-للسعودية)
4. [الترتيب المقترح للتنفيذ](#-الترتيب-المقترح-للتنفيذ)
5. [المتطلبات الأساسية قبل التشغيل](#-المتطلبات-الأساسية-قبل-التشغيل)

---

## 🟢 البرومبت الأول: إكمال النقل الكامل إلى Astro

```text
أنت الآن Senior Astro Migration Engineer + QA Gatekeeper.

المهمة: إكمال الـ 5% المتبقية من نقل مستودع BRIGHTAI من HTML إلى Astro، وحذف كل الملفات المكررة والقديمة بعد التحقق من التكافؤ.

أدوات MCP الإلزامية:
- Playwright MCP — لفتح الموقع في متصفح حقيقي والتحقق من الصفحات بعد الحذف
- Context7 MCP — لجلب توثيق Astro 6.4.6 الحديث قبل كتابة أي كود
- Sequential Thinking MCP — لتقسيم المهمة إلى 12 خطوة مرتبة قبل التنفيذ

اقرأ أولاً:
- HTML_TO_ASTRO_FINAL_INVENTORY.md
- FINAL-QA-REPORT.md
- LEGACY-CLEANUP-REPORT.md
- LEGACY-CLEANUP-INVENTORY.md
- public/sitemap.xml
- render.yaml

المهام الـ 12 بالترتيب:

المجموعة A — ملء جسم الـ 10 docs الناقصة:
1. انسخ محتوى الجسم من docx/ai-governance-saudi-arabia.md إلى src/content/docs/ai-governance-saudi-arabia.md (بعد الـ frontmatter مباشرة).
2. كرّر لـ 9 docs الأخرى: ai-audit-readiness، ai-audit-trail، ai-evidence-file، ai-firewall، ai-governance-platform، ai-risk-management، human-approval-layer، nca-ecc-ai-governance، pdpl-ai-governance.
3. للمصادر غير الموجودة في docx/ (ai-audit-trail، ai-evidence-file، ai-firewall، ai-governance-platform، human-approval-layer)، اعتمد على الـ blog posts ذات الصلة (ai-audit-trail-saudi، ai-firewall-why-you-need-it، ai-governance-vs-ai-safety-vs-ai-security) واكتب جسماً احترافياً بـ ≥2000 كلمة لكل doc.

المجموعة B — حذف الملفات المكررة:
4. احذف: src/components/SparklesCore 2.tsx، src/components/SparklesHero 2.astro، src/components/SparklesCore (ملف فارغ)، src/components/SparklesCore 2 (ملف فارغ)، src/lib/utils 2.ts، src/styles/design-system 2.css، sitemap.xml (من الجذر)، step106 2.txt، report/ي.md.
5. تحقق أن لا استيراد يشير إلى أي ملف محذوف:
   grep -r "SparklesCore 2" src/
   grep -r "utils 2" src/
   grep -r "design-system 2" src/

المجموعة C — حذف الـ HTML القديم:
6. شغّل npm run build وتأكد أن 122 صفحة تُنتج بنجاح.
7. شغّل node scripts/verify-astro-routes.mjs وتأكد أن كل 109 URLs في sitemap.xml موجودة في dist/.
8. احذف الـ 15 legacy component HTML تحت components/ (لها equivalents في src/components/legacy/).
9. احذف الـ 31 proven-equivalent HTML المذكورة في LEGACY-CLEANUP-INVENTORY.md (بعد التأكد عبر Playwright أن URLs لا تزال تعمل).
10. احذف الـ ~80 HTML الإنتاجية المتبقية (لها Astro equivalents مثبتة في HTML_TO_ASTRO_FINAL_INVENTORY.md).
11. احذف الـ scratch/test-sitemap-debug*.mjs.

المجموعة D — التحديث والتحقق النهائي:
12. شغّل npm run seo:gate وتأكد 0 broken links و 29/29 hreflang pass. أعد توليد sitemap عبر npm run sitemap:generate. شغّل npm run indexnow:trigger لإبلاغ Bing/Yandex بالتغييرات. اكتب report/LEGACY-CLEANUP-FINAL-REPORT.md يحوي: قائمة الملفات المحذوفة (مع سبب الحذف لكل ملف)، قائمة الملفات المتبقية (مع سبب الإبقاء)، نتيجة npm run build، نتيجة verify-astro-routes.mjs، تأكيد أن Astro هو مصدر الإنتاج الوحيد.

الممنوعات:
- لا تحذف src/** (كل ملفات Astro المصدرية)
- لا تحذف public/_redirects، public/_headers، public/robots.txt، public/manifest.webmanifest، public/llms.txt، public/llms-full.txt، public/ai.txt
- لا تحذف public/sw.js، public/frontend/assets/fonts/، public/fonts/، public/images/
- لا تحذف render.yaml، package.json، package-lock.json، astro.config.ts، tailwind.config.ts، tsconfig.json
- لا تحذف frontend/** (الخادم API الإنتاجي)
- لا تحذف kernel/** (PWA fallback)
- لا تحذف docs/superpowers/** (workflow موثّق)
- لا تعدّل أي JSON-LD أو canonical أو hreflang
- لا تغير أي نص أو محتوى
- لا تستخدم rm -rf بدون --dry-run أولاً
- لا تحذف أكثر من 20 ملفاً في الجولة الواحدة دون التحقق من البناء بعدها

معايير القبول:
- npm run build ينتج ≥122 صفحة بدون أخطاء
- 0 broken internal links عبر 28903+ مرجع
- 105/105 sitemap URLs موجودة في dist/
- 29/29 hreflang pass
- 15/15 service pages pass
- WCAG 2.1 AA PASS
- 0 ملفات مكررة في src/components/ و src/lib/ و src/styles/
- 0 ملفات HTML قديمة خارج src/ و public/ و frontend/ و kernel/
- 10 docs لها جسم فعلي ≥2000 كلمة لكل منها
- npm run indexnow:trigger نجح
- report/LEGACY-CLEANUP-FINAL-REPORT.md مكتوب

المخرجات:
1. 10 ملفات docs محدّثة في src/content/docs/
2. ملفات محذوفة في src/components/ و src/lib/ و src/styles/ و الجذر
3. ~97 ملف HTML محذوف
4. report/LEGACY-CLEANUP-FINAL-REPORT.md
5. git diff شامل
6. تحديث scripts/README.md

ابدأ الآن بـ Sequential Thinking MCP لتقسيم المهمة، ثم اقرأ الملفات المطلوبة، ثم نفّذ بالترتيب.
```

---

## 🔵 البرومبت الثاني: إعادة تصميم شاملة لكل الصفحات

```text
أنت الآن Senior Visual Designer + Astro Frontend Engineer.

المهمة: نقل تصميم https://brightai.site بالكامل إلى نسخة Astro الحالية، بدون تغيير أي قسم أو محتوى أو JSON-LD أو canonical أو hreflang. القاعدة الذهبية: استبدال الـ visual layer فقط.

أدوات MCP الإلزامية:
- Playwright MCP — إلزامي مطلق: لزيارة brightai.site والتقاط screenshots لكل 9 صفحات رئيسية، وللتحقق من الـ visual parity بعد كل تعديل
- Context7 MCP — لجلب توثيق Astro View Transitions و Tailwind 3.4 و @astrojs/sitemap
- Sequential Thinking MCP — لتقسيم الـ 16 مهمة على 4 batches متوازية

القاعدة الذهبية: لا تغيّر أي نص، عنوان H1/H2/H3، ترتيب قسم، canonical URL، hreflang، JSON-LD، روابط داخلية، meta description، meta title. غيّر فقط: الألوان، الخطوط، الـ background، الـ Hero، الـ Header mega-dropdown، الـ Footer، الـ WhatsApp FAB، الـ icons، الـ animations.

Batch 1 — استخراج المرجع (4 مهام):
1. افتح https://brightai.site/ عبر Playwright والتقط full-page screenshot واحفظه في /home/z/brightai-home-ref.png. كرّر لـ /about/ و /services/ و /kernel/ و /solutions/ و /blog/ و /docs/ و /pricing/ و /contact/ (9 صفحات).
2. افتح view-source:https://brightai.site/ واستخرج الـ vanilla JS script الخاص بـ <canvas id="btNeuralCanvas"> (~3KB inline). احفظه في src/components/NeuralCanvasHero.astro (مع الحفاظ على DPR cap 1.5، FPS cap 45، prefers-reduced-motion، mobile node count). استبدل SparklesHero في src/pages/index.astro بـ NeuralCanvasHero.
3. افتح view-source واستخرج كل 80 CSS custom property من brightai.site (--brightai-* و --b*). اعمل rewrite كامل لـ src/styles/tokens.css بـ:
   --bg: #060914;
   --ink: #08111f;
   --hero-top: #0b1220; --hero-mid: #0a1020; --hero-bot: #070c19;
   --brand: #2dd4bf; --gold: #f7c948; --cyan: #00d4ff; --violet: #7c5cff;
   --signature-gradient: linear-gradient(135deg, #00d4ff, #7c5cff);
   --whatsapp-gradient: linear-gradient(135deg, #25D366, #128C7E);
   --hairline: rgba(255,255,255,0.05);
   --teal-border: rgba(45,212,191,0.38);
   --header-bg: rgba(8,14,28,0.82);
   --dropdown-bg: rgba(6,10,20,0.98);
4. افتح view-source واستخرج body background CSS (dual radial glows + 1px white-4% grid). أضفه إلى BaseLayout inline CSS:
   body {
     background: #060914;
     background-image:
       radial-gradient(circle at 50% 0%, rgba(0,212,255,0.12), transparent 50%),
       radial-gradient(circle at 80% 0%, rgba(124,92,255,0.10), transparent 50%),
       linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
       linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
     background-size: 100% 100%, 100% 100%, 32px 32px, 32px 32px;
     background-attachment: fixed;
   }

Batch 2 — تحديث الـ Layout أساسي (4 مهام):
5. في BaseLayout.astro: احذف السطرَّين اللذين يحملان Google Fonts (IBM Plex Sans Arabic + Inter من fonts.googleapis.com). اكتفِ بـ @font-face BrightAI Official الموجود (preload من /frontend/assets/fonts/TheYearofTheCamel-Medium.woff2). حدّث body style لإضافة dual radial glows + grid.
6. في BaseLayout.astro: أضف Iconify iconify-icon web-component عبر <script type="module" src="https://code.iconify.design/iconify-icon/2.1.0/iconify-icon.min.js"></script> في <head>. استبدل كل <svg> inline في Header و Footer و WhatsAppCTA بـ <iconify-icon icon="mdi:*"></iconify-icon>.
7. في tailwind.config.ts: حدّث brand colors لتطابق brightai.site (navy → #060914، teal → #2dd4bf، gold → #f7c948، إضافة gradient #00d4ff→#7c5cff). احذف tailwind.config.cjs (لم يعد له دور بعد حذف HTML).
8. في src/components/WhatsAppCTA.astro: حدّث إلى fixed bottom-6 left-6 مع green gradient 135deg #25D366→#128C7E + 56px diameter + pulse animation + z-index: 50.

Batch 3 — تحديث Header و Footer و MobileNav (4 مهام):
9. في src/data/navigation.ts: أضف icon (iconify mdi:* name) و description (1 سطر عربي) لكل NavItem. مثال: { label: 'الرئيسية', href: '/', icon: 'mdi:home', description: 'صفحة BrightAI الرئيسية' }.
10. في src/components/Header.astro: أعد بناء Header ليصبح 73px sticky blurred bar مع mega-dropdown متعدد الأعمدة. كل item في الـ dropdown:
    <a class="flex gap-3 p-3 rounded-xl hover:bg-white/5">
      <iconify-icon icon="..." class="text-2xl text-[#2dd4bf]"></iconify-icon>
      <div>
        <div class="font-bold">{title}</div>
        <div class="text-xs text-[#cbd5e1]">{description}</div>
      </div>
    </a>
11. في src/components/Footer.astro: أعد البناء ليصبح 4-column:
    - Brand col: logo + brief description + social icons
    - Product col: Kernel + Solutions + Pricing + Demo
    - Compliance col: PDPL + NCA + SDAIA + SFDA + SAMA
    - Contact col: WhatsApp + Email + Address + Saudi map link
12. في src/components/MobileNav.astro: أعد البناء ليصبح slide-in من اليمين (transform: translateX(100%) → translateX(0)) مع backdrop blur + animated burger → X icon (md:menu ↔ md:close).

Batch 4 — نقل الـ 6 sections الناقصة في index.astro (4 مهام):
13. في src/pages/index.astro: أضف الـ 6 sections الناقصة بترتيب brightai.site (بعد قسم Trust الحالي مباشرة):
    - #problem — "كل شركة تبي AI… بس كلهم خايفين من نفس الأسئلة" (4-5 أسئلة في cards)
    - #ai-governance-center — "مركز حوكمة الذكاء الاصطناعي" (3 cards: Policy Editor + Risk Scoring + Audit Trail)
    - #product — "تخيّل QNX بس للذكاء الاصطناعي" (hero + 6 ميزات في grid)
    - #layers — "طبقات تشغيل لحوكمة وأمان الذكاء الاصطناعي" (5 layers vertical timeline)
    - #choose-governance — "اختَر طبقة الحوكمة المناسبة لمؤسستك" (3 tier cards: Basic / Professional / Enterprise)
    - #why — "Saudi AI Safety OS vs الاستخدامات العامة للـ AI" (comparison table 8 rows)
    انقل النصوص حرفياً من brightai.site عبر Playwright (innerText).
14. في src/styles/home.css: rewrite كامل لـ 17 sections styling (احذف sparkles-bg classes، أضف neural-canvas classes، أضف dual radial glows per section).
15. اختبر الـ visual parity: شغّل Playwright على http://localhost:4321/ (astro dev) وقارن screenshot بـ screenshot لـ brightai.site. كرّر لكل 9 صفحات. اقبل فقط لو screenshot diff ≤ 5%.
16. اكتب report/REDESIGN-REPORT.md يحوي: قائمة الملفات المعدّلة، قائمة الـ 17 sections، screenshot diffs، CWV measurements (LCP + INP + CLS).

الممنوعات:
- لا تغيّر أي نص (H1/H2/H3/p/li) في أي صفحة
- لا تحذف أي section موجود
- لا تغيّر canonical URL لأي صفحة
- لا تغيّر hreflang
- لا تحذف أي JSON-LD (Organization + SoftwareApplication + FAQPage + BreadcrumbList + DefinedTermSet + SpeakableSpecification)
- لا تحذف ClientRouter من BaseLayout
- لا تستخدم GSAP أو Swiper أو AOS (الموقع المثالي لا يستخدمها)
- لا تضف Google Fonts أو أي CDN fonts
- لا تستخدم React islands للمكوّنات البصرية (استخدم vanilla JS أو CSS-only)
- لا تغيّر src/data/solutions.ts أو src/data/kernel.ts أو src/data/blog.ts (المحتوى)
- لا تغيّر أي ملف في frontend/ (الخادم)
- لا تنشر التغييرات بدون Playwright visual parity test

معايير القبول:
- screenshot diff ≤ 5% لكل من 9 صفحات رئيسية مقارنةً بـ brightai.site
- LCP < 2.5s على mobile (PageSpeed Insights)
- INP < 200ms على mobile
- CLS < 0.1
- WCAG 2.1 AA PASS
- 0 broken internal links
- npm run build ينتج 122+ صفحة بدون أخطاء
- 0 React islands على الصفحة الرئيسية (SparklesHero محذوف)
- 0 Google Fonts requests
- 17 sections في index.astro (بدلاً من 11+)
- Header يحوي mega-dropdown متعدد الأعمدة مع icon + title + description لكل item
- Footer يحوي 4-column (Brand + Product + Compliance + Contact)
- WhatsAppCTA fixed bottom-6 left-6 مع green gradient
- كل الأيقونات عبر Iconify mdi:* (بدون SVG inline)
- body bg يحوي dual radial glows + 1px white-4% grid

المخرجات:
1. src/components/NeuralCanvasHero.astro (جديد)
2. src/styles/tokens.css (rewrite كامل)
3. src/layouts/BaseLayout.astro (محدّث)
4. src/components/Header.astro (rewrite mega-dropdown)
5. src/components/Footer.astro (rewrite 4-column)
6. src/components/MobileNav.astro (rewrite slide-in)
7. src/components/WhatsAppCTA.astro (محدّث green gradient)
8. src/pages/index.astro (إضافة 6 sections)
9. src/styles/home.css (rewrite كامل لـ 17 sections)
10. tailwind.config.ts (محدّث) + حذف tailwind.config.cjs
11. src/data/navigation.ts (إضافة icon + description لكل NavItem)
12. report/REDESIGN-REPORT.md
13. 9 screenshot comparisons في /home/z/screenshots/
14. git diff شامل

ابدأ الآن بـ Sequential Thinking MCP لتقسيم الـ 16 مهمة على 4 batches، ثم استخدم Playwright MCP لالتقاط screenshots المرجعية أولاً، ثم نفّذ Batch 1 بالكامل قبل Batch 2.
```

---

## 🟠 البرومبت الثالث: وكيل SEO ذكي للسعودية

```text
أنت الآن Senior Saudi SEO Auditor + AI Search Optimization Specialist.

المهمة: تحليل المستودع لاكتشاف كل مشاكل الفهرسة (Google indexing) وكل الأخطاء التي تمنع ظهور الصفحات في نتائج البحث السعودية، ثم تنفيذ تحسينات شاملة لزيادة الزيارات والنقرات من السعودية عبر 5 محاور.

أدوات MCP الإلزامية:
- Playwright MCP — لفحص الصفحات + اختبار Rich Results Test + فتح Google Search Console
- Context7 MCP — لجلب توثيق schema.org آخر إصدار و Google Search Console API
- Sequential Thinking MCP — لترتيب 28 مهمة على 5 محاور متوازية

اقرأ أولاً:
- report/SEO-MIGRATION-CHECK.md
- seo_gate_log.txt
- public/robots.txt
- public/sitemap.xml
- public/_headers
- public/_redirects
- public/llms.txt + public/llms-full.txt + public/ai.txt
- schema-saudi-seo.json
- src/components/SEOHead.astro
- src/data/site.ts
- كل JSON-LD في src/pages/index.astro (Organization + SoftwareApplication + FAQPage + BreadcrumbList + DefinedTermSet + SpeakableSpecification + WebSite + WebPage)

المحاور الخمسة و 28 مهمة:

المحور 1 — مشاكل الفهرسة (7 مهام):
1. صل Google Search Console عبر API (يحتاج service account JSON). صدّر تقرير Coverage و URL Inspection لكل URL في sitemap.xml.
2. حدد orphan pages (URLs في الموقع لكن غير موجودة في sitemap.xml أو غير مرتبطة داخلياً) عبر تشغيل node scripts/orphan-pages-audit.mjs.
3. تحقق من canonical لكل صفحة (كل صفحة Astro يجب أن تحتوي <link rel="canonical" href="https://brightai.site/.../">).
4. تحقق من hreflang ar-SA ↔ en-SA لكل صفحة (كل صفحة عربية لها نظيرة إنجليزية و العكس، و x-default = ar-SA).
5. تأكد أن كل 109 URLs في sitemap.xml تُرجع HTTP 200 (شغّل node scripts/verify-astro-routes.mjs).
6. شغّل node scripts/trigger-indexnow.mjs --soft-fail لإبلاغ Bing/Yandex بكل URL محدّث.
7. تأكد أن robots.txt لا يحجب أي صفحة إنتاج (Disallow: فقط لـ /api/، /admin/، /_astro/، /search?).

المحور 2 — الكلمات المفتاحية السعودية (5 مهام):
8. ابحث عبر Ahrefs أو SEMrush عن أعلى 30 كلمة مفتاحية لـ AI Governance في السعودية. مثال: "حوكمة الذكاء الاصطناعي"، "PDPL السعودية"، "NCA ECC"، "SDAIA"، "ISO 42001 السعودية"، "AI firewall السعودية"، "حماية بيانات AI"، "حوكمة AI المصانع الطبية"، "حوكمة AI البنوك السعودية"، "حوكمة AI المستشفيات".
9. حلل title و meta description لكل صفحة من 109 صفحات. لكل صفحة تأكد أن: title يحوي الكلمة المفتاحية الأساسية، meta description بين 155-160 حرف، يحوي الكلمة المفتاحية + call-to-action.
10. اكتب meta description محسّن لكل صفحة (استخدم src/data/site.ts و src/data/blog.ts لاستخراج الـ context).
11. أضف JSON-LD LocalBusiness مع areaServed = [Country:SA, City:الرياض, City:جدة, City:الدمام, City:مكة المكرمة, City:المدينة المنورة, City:الخبر] في src/pages/index.astro (مدمج مع Organization الموجود).
12. أنشئ 5 صفحات محلية جديدة لكل مدينة رئيسية لو ما كانت موجودة:
    - /solutions/ai-governance-riyadh/
    - /solutions/ai-governance-jeddah/
    - /solutions/ai-governance-dammam/
    - /solutions/ai-governance-mecca/
    - /solutions/ai-governance-medina/
    كل صفحة: 1500+ كلمة، H1 يحوي اسم المدينة، JSON-LD LocalBusiness مع address في المدينة.

المحور 3 — Core Web Vitals (5 مهام):
13. حلل LCP + INP + CLS عبر PageSpeed Insights API لكل 9 صفحة رئيسية (home + about + services + kernel + solutions + blog + docs + pricing + contact). احفظ النتائج في report/CWV-REPORT.md.
14. حدد LCP element لكل صفحة واتأكد أنه preload (أضف <link rel="preload" as="image" href="..."> في BaseLayout لصورة الـ Hero). لصفحة index.astro الـ LCP يجب أن يكون <h1> hero، تأكد أنه يُعرض خلال أول 2.5s.
15. ضغط كل الصور في public/images/ بـ webp/avif (استخدم npx @squoosh/cli أو cwebp). أضف width/height attributes لكل <img> في src/pages/ و src/components/.
16. أزل render-blocking CSS: استخدم critical CSS inline في BaseLayout (أول 14KB فقط) + defer باقي CSS. استخدم node scripts/build-css-bundle.mjs --critical.
17. استخدم Astro <Image> component (من astro:assets) لكل صورة في src/pages/ — ستحصل على webp + lazy loading + width/height تلقائياً.

المحور 4 — Schema & Rich Results (5 مهام):
18. تحقق من كل JSON-LD عبر Google Rich Results Test (https://search.google.com/test/rich-results). سجّل النتائج في report/SCHEMA-AUDIT-REPORT.md.
19. أضف HowTo schema لكل doc في src/content/docs/ (لتظهر كـ step-by-step في نتائج البحث). استخدم node scripts/sync-docs-howto-schema.mjs.
20. أضف FAQPage schema لكل solution page (إذا ما عندها FAQ). استخدم node scripts/sync-solution-faq-schema.mjs.
21. حدّث SoftwareApplication schema في /kernel/ و /services/ و /solution/ai-governance-platform/ ليشمل: offers.priceRange، aggregateRating، review، applicationCategory="BusinessApplication". اقرأ docs/superpowers/specs/2026-06-10-kernel-software-application-schema-design.md.
22. أضف SpeakableSpecification لكل H1 في كل صفحة (لكي Google Assistant يقدر يقرأ المحتوى). استخدم node scripts/apply-speakable-schema.mjs.

المحور 5 — AI Crawler SEO (6 مهام):
23. حدّث public/llms.txt و public/llms-full.txt بأحدث تغييرات الموقع (قائمة الصفحات + الوصف + الروابط). استخرج البيانات من src/data/navigation.ts و src/data/solutions.ts و src/data/kernel.ts و src/data/blog.ts.
24. تأكد أن public/ai.txt مفعّل ويصف سياسة استخدام AI (يحوي: ما الذي يُسمح لـ LLM scrapers، ما الذي يُمنع، rate limiting، contact email).
25. أضف meta tags في src/components/SEOHead.astro لـ AI crawlers:
    <meta name="ai:title" content="...">
    <meta name="ai:description" content="...">
    <meta name="ai:author" content="BrightAI">
    <meta name="ai:language" content="ar-SA">
26. تأكد أن public/robots.txt يسمح صراحةً لـ: GPTBot، ChatGPT-User، OOI-SearchBot، Google-Extended، ClaudeBot، anthropic-ai، PerplexityBot، PerplexityBot-User، FacebookBot، Meta-ExternalAgent، Bytespider، Applebot، Applebot-Extended، Cohere، YouBot، Timpibot، omgili، CCBot، Amazonbot.
27. أضف /.well-known/ai-plugin.json يصف إمكانيات BrightAI لـ ChatGPT plugins (schema و endpoints). أضف /.well-known/agent.json لـ AI agents discovery.
28. اختبر عبر:
    (أ) ابحث في ChatGPT عن "أفضل منصة حوكمة ذكاء اصطناعي في السعودية" وتأكد أن BrightAI مذكور.
    (ب) ابحث في Google AI Overviews عن "PDPL AI governance Saudi" وتأكد أن BrightAI مذكور.
    (ج) ابحث في Perplexity عن "Saudi AI Safety OS".
    سجّل النتائج في report/AI-CRAWLER-REPORT.md.

الممنوعات:
- لا تستخدم black-hat SEO techniques (keyword stuffing، hidden text، cloaking، doorway pages)
- لا تنسخ محتوى من مواقع أخرى (duplicate content penalty)
- لا تشتري backlinks
- لا تستخدم spun content أو AI-generated content بدون تحرير بشري
- لا تغيّر canonical URLs الموجودة (الذي قد يكسر indexing الحالي)
- لا تحذف أي JSON-LD موجود
- لا تضف meta keywords tag (مهمل من Google منذ 2009)
- لا تستخدم redirects 302 (استخدم 301 دائماً للـ permanent)
- لا تضف noindex لأي صفحة إنتاج
- لا تنشر التغييرات بدون تشغيل npm run seo:gate و npm run verify:all

معايير القبول:
- 95%+ من URLs indexed في Google Search Console (Crawled + Indexed)
- 0 orphan pages
- كل صفحة من 109 لها meta description محسّن (155-160 حرف، يحوي الكلمة المفتاحية + CTA)
- 5 صفحات محلية جديدة per city (الرياض + جدة + الدمام + مكة + المدينة)
- CWV: LCP<2.5s + INP<200ms + CLS<0.1 لكل 9 صفحات رئيسية
- كل JSON-LD valid عبر Rich Results Test
- Rich Results pass لـ FAQ + SoftwareApplication + HowTo + BreadcrumbList
- SpeakableSpecification على كل H1
- 0 صور بدون width/height
- كل صور public/images/ بـ webp/avif
- llms.txt + llms-full.txt + ai.txt محدّثة
- /.well-known/ai-plugin.json + agent.json موجودة
- 5 زواحف AI على الأقل (GPTBot + ClaudeBot + PerplexityBot + Google-Extended + CCBot) يمكنها قراءة المحتوى
- BrightAI مذكور في ChatGPT search + Google AI Overviews + Perplexity لـ "Saudi AI Governance"

المخرجات:
1. report/SEO-AUDIT-REPORT.md (شامل)
2. report/GSC-COVERAGE-REPORT.md (Google Search Console Coverage)
3. report/KEYWORDS-SAUDI-REPORT.md (30 كلمة مفتاحية + positions + gaps)
4. report/CWV-REPORT.md (Core Web Vitals per page)
5. report/SCHEMA-AUDIT-REPORT.md (كل JSON-LD validation)
6. report/AI-CRAWLER-REPORT.md (AI crawler test results)
7. 5 صفحات محلية جديدة في src/pages/solutions/[sector]/[city].astro
8. SEOHead.astro محدّث (ai:* meta tags)
9. public/llms.txt + llms-full.txt + ai.txt محدّثة
10. /.well-known/ai-plugin.json + agent.json
11. 30+ meta description محسّن
12. git diff شامل
13. sitemap.xml محدّث (مع الـ 5 صفحات الجديدة)
14. indexnow trigger للـ URLs الجديدة

ابدأ الآن بـ Sequential Thinking MCP لترتيب 28 مهمة على 5 محاور، ثم اقرأ الملفات المطلوبة، ثم نفّذ المحاور بالتوازي حيثما أمكن.
```

---

## 🎯 الترتيب المقترح للتنفيذ

```
البرومبت الأول (إكمال النقل)         ~4-6 ساعات
        ↓
البرومبت الثالث (SEO للسعودية)       ~6-8 ساعات  (يمكن بالتوازي مع الأول)
        ↓
البرومبت الثاني (إعادة تصميم شاملة)  ~12-16 ساعة
```

**المنطق:**
- **البرومبت 1 أولاً**: لإكمال النقل وحذف المكررات وحلّ الفجوات 1-4 (10 docs ناقصة، 97 HTML غير محذوفة، 8 ملفات مكررة).
- **البرومبت 3 ثانياً**: لحلّ مشاكل الفهرسة المتراكمة. يمكن تشغيله بالتوازي مع البرومبت 1 لأنه لا يتداخل (يقرأ من src/ الموجود، لا يحذف ملفات).
- **البرومبت 2 أخيراً**: بعد استقرار الفهرسة. لا تريد Google أن ترى تغييرات بصرية كبيرة أثناء محاولة فهرسة المحتوى.

---

## 🛠 المتطلبات الأساسية قبل التشغيل

### 1. تفعيل MCPs الثلاثة في محرر الكود (Cline أو Claude Code)

- **Playwright MCP** — لفتح الموقع في متصفح حقيقي والتحقق من الصفحات
- **Context7 MCP** — لجلب توثيق Astro/React/Vite الحديث
- **Sequential Thinking MCP** — لترتيب الخطوات قبل التعديلات الكبيرة

### 2. نسخة احتياطية من المستودع

```bash
git checkout -b backup-before-migration-completion
git push origin backup-before-migration-completion
```

### 3. تأكيد أن `npm run build` يعمل على الوضع الحالي

```bash
npm ci
npm run build
```

### 4. الوصول إلى Google Search Console (للبرومبت الثالث فقط)

- إنشاء service account JSON في Google Cloud Console
- إضافته كـ user في Google Search Console لـ `brightai.site`
- حفظ الـ JSON في مكان آمن على جهازك

### 5. تفعيل staging environment (موصى به للبرومبت الثاني)

- إنشاء `https://brightai-staging.onrender.com` يأخذ الكود من فرع `develop`
- فصل Google Analytics property (staging G-XXX مختلف عن production G-8LLESL207Q)
- إضافة `noindex` لـ staging في `public/robots.txt`

---

## ⚠️ تنبيهات مهمة

- **لا تنشر التغييرات بدون تشغيل** `npm run build` و `npm run seo:gate` و `npm run verify:all` بعد كل برومبت.
- **استخدم staging environment** لاختبار البرومبت الثاني (إعادة التصميم) قبل النشر على production.
- **فعّل Clarity + Sentry في BaseLayout** (موجودان في `frontend/js/` لكن غير مفعّلين في Astro) — مذكور في البرومبت الثاني.
- **لا تحذف `frontend/` أو `kernel/`** — هذه بنية تحتية إنتاجية (خادم API + PWA fallback) وليست أهداف ترحيل.
- **إذا الوكيل لم يستخدم MCPs تلقائياً**، اذكرها صراحةً في بداية البرومبت: "استخدم Playwright MCP أولاً..." أو "استعن بـ Context7 MCP قبل كتابة أي Astro...".

---

## 📊 إحصائيات المستودع الحالية (قبل البرومبتات)

| المقياس | القيمة |
|---------|--------|
| نسبة النقل من HTML إلى Astro | 95% |
| عدد صفحات Astro المُنتَجة في البناء | 122 |
| عدد URLs في `sitemap.xml` | 109 |
| عدد الـ broken links | 0 |
| نسبة hreflang pass | 29/29 (100%) |
| نسبة service pages pass | 15/15 (100%) |
| WCAG 2.1 AA status | PASS |
| عدد ملفات HTML القديمة غير المحذوفة | ~97 |
| عدد ملفات docs ناقصة الجسم | 10 |
| عدد الملفات المكررة | 8 |
| Render deployment status | APPROVED |

---

## 📂 ملفات ذات صلة (في نفس المجلد)

- `BRIGHTAI-Analysis-Report.docx` — التقرير الشامل بالعربية (7 أقسام + 19 قسم فرعي، ~6500 كلمة)
- `README.md` — دليل الاستخدام العام

---

**انتهى الملف.** انسخ أي برومبت من الأقسام الثلاثة أعلاه (المحتوى داخل كتل `text`) والصقه مباشرة في Cline أو Claude Code بعد تفعيل MCPs الثلاثة.
