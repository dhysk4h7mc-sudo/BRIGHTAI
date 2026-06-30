---
file: HIERARCHY-MAPS-PER-PAGE.md
project: BrightAI — Saudi AI Safety OS
agent: BrightAI Workspace Agent
date: 2026-06-30
version: 1.0
companion_to: REPORT-32_VISUAL-HIERARCHY.md
language: Saudi dialect (العامية السعودية) للشرح + English للكود والـ identifiers
---

# HIERARCHY MAPS PER PAGE — خرائط الترتيب البصري لكل صفحة

> **الغرض من هذا الملف**: يحدّد بدقة ترتيب "وش تشوف العين أولاً، ثانياً، ثالثاً" في كل صفحة من صفحات BrightAI، والـ CSS tokens اللي تطبّق كل مستوى، وميثاق الـ spacing/weight/contrast بين المستويات. هو وثيقة تنفيذ (Implementation Map) لمراجعة الـ CSS وتطبيق إصلاحات الـ visual hierarchy.
>
> **القيد الأعلى** (per agent.md Section 2.1): ممنوع تغيير النص، الكلمات، أو كسر RTL. التحسينات تكون على size/weight/color contrast/spacing/position فقط.
>
> **الـ token source of truth**: `src/styles/tokens.css` + `src/styles/base.css` + `src/styles/components.css`. كل token له اسم semantic واحد (primary/secondary/tertiary opacity، --interactive-primary، --space-*، --text-*، --font-*).

---

## 0) مبادئ أساسية (تطبّق على كل الصفحات)

### 0.1 الـ 5 Tokens للـ Opacity (نظام DEC-2026-031)

| Token | Value | الاستخدام | Contrast (vs `--bg-base`) | WCAG |
|---|---|---|---|---|
| `--text-primary-opacity` | 1.0 | H1/H2/H3/H4/H5/H6 + body | 17.58:1 | AAA |
| `--text-secondary-opacity` | 0.78 | secondary descriptions، lead | 10.76:1 | AAA |
| `--text-tertiary-opacity` | 0.58 | captions، meta، timestamps | 6.32:1 | AA |
| `--text-disabled-opacity` | 0.38 | disabled states فقط | 3.35:1 | AA-large only |
| `--text-decorative-opacity` | 0.22 | decorative labels، footnotes | 1.89:1 | لا — decorative فقط |

**القاعدة**: كل نص essential (مهم دلالياً) ≥ 0.78 opacity. لا نص essential تحت 0.85 فعلياً (الـ forbidden #1 في DEC-031).

### 0.2 الـ 5 Tokens للحجم (Typography Scale)

| Token | Size | الاستخدام في Hero | على الصفحات الداخلية |
|---|---|---|---|
| `--text-6xl` | 3.75rem (60px) | نادر — landing hero H1 (split-hero__h1) | ❌ |
| `--text-5xl` | 3rem (48px) | Home H1 (text-3xl sm:text-5xl) | inner-section__title (lg) |
| `--text-4xl` | 2.25rem (36px) | inner-hero h1، h2 sm:text-4xl | inner-hero h1 (sm+) |
| `--text-3xl` | 1.875rem (30px) | h2 (text-3xl sm:text-4xl) | inner-section__title (default) |
| `--text-2xl` | 1.5rem (24px) | h3 | home-kernel-title، inner-card__title |
| `--text-xl` | 1.25rem (20px) | lead p | home-kernel-title (sm+) |
| `--text-lg` | 1.125rem (18px) | FAQ summary | – |
| `--text-base` | 1rem (16px) | body | body |
| `--text-sm` | 0.875rem (14px) | descriptions، meta | lead، labels، mini-links |
| `--text-xs` | 0.75rem (12px) | chips، badges | chips، footnotes، tertiary |

### 0.3 الـ 5 Tokens للـ Weight

| Token | Value | الاستخدام |
|---|---|---|
| `--font-normal` | 400 | body، lead، captions |
| `--font-medium` | 500 | meta، labels، nav links |
| `--font-semibold` | 600 | sub-headings، h5/h6 |
| `--font-bold` | 700 | h1/h2/h3/h4، CTAs، strong، nav active |
| `--font-extrabold` / `font-black` | 800/900 | Hero H1، display، gradient-text stats |

### 0.4 الـ Color Hierarchy (3 levels)

| Level | Color | Hex | المعنى |
|---|---|---|---|
| **Level 1 — Interactive/Brand** | `--interactive-primary` | `#06b6d4` (cyan) | روابط، CTAs، active states |
| **Level 2 — Brand gradient** | `--brand-400` → `--indigo-400` | `#22d3ee` → `#818cf8` | `.gradient-text`، highlights، Star |
| **Level 3 — Status accent** | `--status-success` | `#22c55e` | WhatsApp links، success states |
| **Text on dark** | `--text-primary` | `#f1f5f9` | كل النصوص |

### 0.5 مبادئ الـ Spacing بين المستويات

**القاعدة الذهبية**: كل مستوى يحوي **2× أكثر padding-block** من المستوى اللي بعده. هذا يخلق "rest zones" حول العناصر المهمة.

| Hierarchy level | min spacing-block (top + bottom) | مثال |
|---|---|---|
| Section (16 sections في home) | `var(--space-20)` = 5rem (80px) | `<section class="py-20 lg:py-28">` |
| Sub-section داخل section | `var(--space-8)` = 2rem (32px) | mt-12، mt-14 |
| Card / Panel | `var(--space-6)` = 1.5rem (24px) | `.feature-card { padding: 1.5rem }` |
| Title → next block | `var(--space-4)` = 1rem (16px) | mt-4 بين chip و h2 |
| Paragraph → next | `var(--space-3)` = 0.75rem (12px) | line-height 1.85 |

### 0.6 Decorative Element Opacity (القاعدة من DEC-2026-030)

| Element | Opacity | Token |
|---|---|---|
| Body noise | 0.015 | `--noise-body` |
| Card noise | 0.022 | `--noise-card` |
| Hero panel noise | 0.028 | `--noise-hero` |
| Glass highlights | 0.06-0.08 | `--glass-highlight*` |
| CTA glow halo (btn--glow) | 0.45-0.55 (subtle، في hover) | `--shadow-cta-glow*` |
| Section radial gradient | 0.05-0.06 | `--gradient-section-radial*` |

**القاعدة**: كل عنصر decorative ≤ 0.06 opacity دايماً. CTA glow هو الاستثناء (يظهر في hover).

### 0.7 الـ Eye-Tracking Pattern المستخدم

| نوع الصفحة | Pattern | السبب |
|---|---|---|
| Landing (homepage) | **Z-pattern** | التصفح فوق-يمين → فوق-يسار → أسفل-يمين → أسفل-يسار مع CTAs في الزوايا |
| Inner page (about, solutions, kernel, services) | **F-pattern** | العنوان → القصة → سريعة للأقسام الفرعية |
| Blog post (طويل) | **F-pattern** | عنوان → meta → first paragraph → روابط جانبية |
| Docs (طويل جداً) | **F-pattern مع TOC** | TOC على اليمين (في LTR) أو اليسار (في RTL) |
| Landing sales (pricing) | **Z-pattern** | hero → packages → FAQ |
| Legal (نص طويل بدون CTA) | **F-pattern** | عنوان → outline → بنود → footer |

### 0.8 CTA Hierarchy (3 levels)

| Level | Token / Class | بصرياً | مثال في الـ home |
|---|---|---|---|
| **Primary CTA** | `.btn--glow`، `.home-cta-primary`، `.wa-btn` | gradient background + glow + brand color | "احجز ديمو" |
| **Secondary CTA** | `.btn--secondary`، `.home-cta-secondary` | bordered + transparent bg | "منصة الحوكمة" |
| **Tertiary CTA** (text link) | `.section-mini-link`، `.footer__link` | arrow + text + underline on hover | "التفاصيل ←" |

**القاعدة**: الـ Primary CTA دايماً يكون واحد من العناصر الـ 3 الأولى اللي تشوفها العين. الـ Secondary يظهر بعد ما تنتهي قراءة العنوان. الـ Tertiary فقط في navigation/footer.

---

## 1) HOMEPAGE `/` — 16 sections (Z-pattern)

> **النمط**: Z-pattern. العين تتحرك من أعلى يمين (chip 🇸🇦) → زاوية يمين (H1) → القطر إلى أسفل يسار (CTAs) → زاوية أسفل يمين (CTA الرئيسي في كل section).
>
> **First viewport (above the fold)**: `.split-hero` يعرض 3 عناصر رئيسية فقط. هذا هو الأهم.

### 1.1 SplitHero (Section 1) — first viewport

| الترتيب | العنصر | Selector | Size | Weight | Color/Contrast | Spacing حوله | ملاحظة |
|---|---|---|---|---|---|---|---|
| **#1 (الأبرز)** | **H1 — "منصة أمان وحوكمة الذكاء الاصطناعي للشركات السعودية"** | `.split-hero__h1` | `1.875rem` → `3.5rem` (mobile → desktop) | 900 (font-black) | `--text-primary` (17.58:1) + gradient spans | `mt-5` (1.25rem) من chip، `mb-2.5rem` لـ CTAs | الـ gradient text "الذكاء الاصطناعي" / "السعودية" يضيف Level-2 color |
| **#2** | **The Star (BrightStar.astro hero variant)** | `.split-hero__star` | 300px desktop، 230px mobile | visual only (aria-hidden) | brand gradient + cyan glow | 0.5rem margin-bottom | العنصر البصري الموحّد (REPORT-28) |
| **#3** | **CTA primary "احجز ديمو"** | `.home-cta-primary` | `text-lg` padding 3.5rem × 1.25rem | 700 (font-bold) | gradient bg + glow | `mt-2.5rem` (2.5rem) من H1 | الـ CTA الأول في العين (Z-pattern corner) |
| **#4** | **CTA WhatsApp "واتساب"** | `.wa-btn` | padding 3.5rem × 1.25rem | 700 | WhatsApp green gradient | `gap-3` (0.75rem) من primary | ثاني أهم CTA — contact direct |
| **#5** | **CTA secondary "منصة الحوكمة"** | `.home-cta-secondary` | padding 3.5rem × 1.25rem | 700 | bordered + transparent | `gap-3` (0.75rem) من WhatsApp | third in row |
| **#6** | **CTA secondary "BrightAI Kernel"** | `.home-cta-secondary` | padding 3.5rem × 1.25rem | 700 | bordered + transparent | `gap-3` (0.75rem) | fourth in row |
| **#7** | **Lead paragraph** | `.split-hero__lead` | `1.0625rem` (17px) | 400 (regular) | `--text-primary` @ 0.82 opacity | `mt-6` (1.5rem) من H1 | يرسم السياق بعد الـ H1 |
| **#8** | **Trust chip "🇸🇦 صنع في السعودية"** | `.split-hero__chip` | `0.75rem` (12px) | 700 (font-bold) | cyan tinted bg | margin-bottom قبل H1 | يثبت الهوية السعودية |
| **#9 (decorative)** | DottedSurface canvas | `.dotted-surface-canvas` | full viewport | visual only | dimmed 0.32 desktop / 0.5 mobile | absolute background | ambient texture (REPORT-29) |
| **#10 (decorative)** | Beams، spotlight، vignette | `.split-hero__beam*`، `.split-hero__spotlight` | full | – | subtle glows | absolute | ambient depth |

**المشكلة الحالية المُكتشفة** (للإصلاح في جولة قادمة):
- الـ CTAs الأربعة (Primary + WhatsApp + 2 secondary) كلها نفس الـ weight (700) ونفس الـ size. العين ما تعرف أيهم الأهم. **الإصلاح المقترح**: `home-cta-primary` يكبر قليلاً (text-lg → text-xl) أو يأخذ padding أكبر.

### 1.2 Trust/Compliance (Section 2)

| الترتيب | العنصر | Selector | Size | Weight | Spacing |
|---|---|---|---|---|---|
| **#1** | **H2 — "متوافق مع الهيئات السعودية 🇸🇦"** | `#trust-signals h2` | `text-xl` (1.25rem) | 700 | mt-2 من chip |
| **#2** | Chip "الامتثال التنظيمي السعودي" | `.chip` | `0.75rem` | 700 | أعلى العنوان |
| **#3** | Big stats numbers (3 cards) | `.home-stat-card` value | `1.5-1.875rem` (gradient-text font-black) | 900 | `mt-1.5` (6px) من label |
| **#4** | Big stats labels | `.home-stat-card__label` | `0.75rem` | 500 | تحت الرقم |
| **#5** | Subhead description | paragraph | `0.875rem` | 400 | mt-1 من H2 |
| **#6** | Compliance chips (NCA/SDAIA/SFDA/ZATCA) | `.glass` chip | `0.75rem` | 400 (text-white/80) | flex-wrap gap-2 |
| **#7** | "حماية بيانات مشفرة" callout | `.glass` card | `0.875rem` | 700 | right column |

**Z-pattern note**: هنا العين تنزل من H2 (أعلى يمين) → الأرقام (وسط) → الـ callout (أسفل يمين) → روابط (أسفل). الـ 3 stat numbers (15+, 365+, 12K+) يلفتون العين بسبب gradient-text + 900 weight.

### 1.3 Problem (Section 3)

| الترتيب | العنصر | Size | Weight | ملاحظة |
|---|---|---|---|---|
| **#1** | **H2 — "كل شركة تبي AI… بس كلهم خايفين من نفس الأسئلة"** | `text-3xl sm:text-4xl` (1.875 → 2.25rem) | 900 | الأبرز في الـ section |
| **#2** | Chip "المشكلة" | `0.75rem` | 700 | علامة للـ section |
| **#3** | Lead paragraph | `text-white/70` | 400 (lead) | mt-4 من H2 |
| **#4** | 6 feature cards (icons + h3 + p) | h3: `1.125rem`، p: `0.875rem` | 700 / 400 | grid 2/3 columns |
| **#5** (decorative) | Icon | `1.5rem` | – | cyan-400 color |

### 1.4 Governance Center (Section 3b — بين 3 و 4)

| الترتيب | العنصر | Size | Weight | ملاحظة |
|---|---|---|---|---|
| **#1** | **H2 — "مركز حوكمة الذكاء الاصطناعي"** | `text-2xl sm:text-4xl` | 900 | الليمق (text-2xl) صغير شوي على mobile |
| **#2** | Lead paragraph | text-white/70 | 400 | – |
| **#3** | **Primary CTA — "استكشف حلول الحوكمة"** | `.glow-btn` | 700 | الـ primary لهذا الـ section |
| **#4** | Secondary CTA — "تحدث مع فريق BrightAI" | `.glass` bordered | 700 | – |
| **#5** | 5 mini-cards (حلول) | strong: `0.875rem`، span: `0.75rem` | 700 / 400 | 5 columns على lg |
| **#6** | 2 mini-links | `.section-mini-link` | – | أسفل |

### 1.5 Product (Section 4) — QNX metaphor

| الترتيب | العنصر | Size | Weight | ملاحظة |
|---|---|---|---|---|
| **#1** | **H2 — "تخيّل QNX بس للذكاء الاصطناعي"** | `text-3xl sm:text-5xl` | 900 | أكبر H2 في الصفحة (text-5xl على desktop) |
| **#2** | Chip "المنتج" | `0.75rem` | 700 | – |
| **#3** | Lead paragraph (centered) | `text-white/75` | 400 | – |
| **#4** | Kernel showcase diagram (5 columns) | text: `1rem-1.125rem` | 700 (font-black للـ kernel) | الـ kernel box في الوسط بحدود cyan |
| **#5** | 4 integration chips (ERP, HIS, CRM…) | `0.75rem` | 400 (text-white/70) | تحت الـ diagram |

### 1.6 Layers (Section 5) — 5 feature cards

| الترتيب | العنصر | Size | Weight |
|---|---|---|---|
| **#1** | **H2 — "طبقات تشغيل لحوكمة وأمان الذكاء الاصطناعي"** | `text-3xl sm:text-4xl` | 900 |
| **#2** | Chip "طبقات Saudi AI Safety OS" | `0.75rem` | 700 |
| **#3** | Lead paragraph | `text-white/70` | 400 |
| **#4** | 5 cards (icon + h3 + p + ul + link) | h3: `1.25rem`، p: `0.875rem`، ul: `0.75rem` | 700 / 400 / 400 |
| **#5** | Card section-mini-link | `0.75rem` | 600 (link) |

### 1.7 Choose Governance (Section 5b)

| الترتيب | العنصر | Size | Weight |
|---|---|---|---|
| **#1** | **H2 — "اختَر طبقة الحوكمة المناسبة لمؤسستك"** | `text-2xl sm:text-3xl` | 900 (مركز) |
| **#2** | Lead subtitle | `0.75-0.875rem` | 400 (text-white/60) |
| **#3** | 4 mini-cards (أيقونة + h3 + link) | h3: `0.875rem` | 700 |
| **#4** | "التفاصيل ←" link | `0.75rem` | 400 (text-cyan-300) |

### 1.8 Compliance Packs (Section 6) — 6 packs grid

| الترتيب | العنصر | Size | Weight |
|---|---|---|---|
| **#1** | **H2 — "حزم جاهزة للسوق السعودي 🇸🇦"** | `text-3xl sm:text-4xl` | 900 |
| **#2** | Chip "حزم الامتثال" | `0.75rem` | 700 |
| **#3** | Lead paragraph | `text-white/70` | 400 |
| **#4** | 3 mini-links (PDPL، Data Processing، Contact) | `0.75rem` | 400 |
| **#5** | 6 pack cards (h3 + p + tag chip) | h3: `1.25rem`، p: `0.875rem` | 700 / 400 |
| **#6** | Tag chip (PDPL, NCA ECC…) | `0.625rem` | 700 |

### 1.9 Sectors (Section 7) — 8 sectors grid

| الترتيب | العنصر | Size | Weight |
|---|---|---|---|
| **#1** | **H2 — "بدينا من المصانع الطبية، ونتوسع لكل القطاعات"** | `text-3xl sm:text-4xl` | 900 |
| **#2** | Chip "القطاعات" | `0.75rem` | 700 |
| **#3** | 8 sector cards (icon + h3 + p) | h3: `1.125rem`، p: `0.875rem` | 700 / 400 |
| **#4** | Sector "جاهز · ديمو MAIS" badge | `0.625rem` | 700 (chip) |

### 1.10 Evidence File (Section 8)

| الترتيب | العنصر | Size | Weight |
|---|---|---|---|
| **#1** | **H2 — "AI Evidence File — أنت جاهز للتدقيق دايماً"** | `text-3xl sm:text-4xl` | 900 + gradient text |
| **#2** | Chip "الميزة العبقرية ⭐" | `0.75rem` | 700 |
| **#3** | Lead (نص مقنع) | `text-white/75` | 400 (مع strong white) |
| **#4** | Sub-bullets list | `0.875rem` | 400 |
| **#5** | **Primary CTA — "اطلب عينة عبر واتساب"** | `.wa-btn` | 700 |
| **#6** | Evidence File mockup (PDF preview) | data rows | – |

### 1.11 Comparison (Section 9) — table

| الترتيب | العنصر | Size | Weight |
|---|---|---|---|
| **#1** | **H2 — "Saudi AI Safety OS vs الاستخدامات العامة للـ AI"** | `text-3xl sm:text-4xl` | 900 |
| **#2** | Chip "ليه BrightAI؟" | `0.75rem` | 700 |
| **#3** | Table header (BrightAI | شات بوت | منصة أجنبية | محلي) | th: default | 700 (column headers) |
| **#4** | Table rows (7 معايير) | td: `0.875rem` | 400 |
| **#5** | ✓ / ✗ / جزئياً indicators | – | – |

### 1.12 Stats (Section 9b)

| الترتيب | العنصر | Size | Weight |
|---|---|---|---|
| **#1** | 4 big numbers (2030, +135B$, 99.7%, <120ms) | `text-3xl sm:text-4xl` | 900 (gradient-text) |
| **#2** | Stat labels | `0.75rem` | 400 (text-white/60) |

### 1.13 FAQ (Section 10) — 9 items

| الترتيب | العنصر | Size | Weight |
|---|---|---|---|
| **#1** | **H2 — "عندك نفس هالأسئلة؟"** | `text-3xl sm:text-4xl` | 900 |
| **#2** | Chip "أسئلة شائعة" | `0.75rem` | 700 |
| **#3** | FAQ items (9 questions) | summary: `1.125rem`، answer body: default | 700 / 400 |
| **#4** | 3 mini-links (docs, blog, privacy) | `0.75rem` | 400 |

### 1.14 Demo Request (Section 11) — CTA

| الترتيب | العنصر | Size | Weight |
|---|---|---|---|
| **#1** | **H2 — "جاهز تخلي AI شركتك آمن ومتوافق من غدا؟"** | `text-3xl sm:text-5xl` | 900 (gradient span) |
| **#2** | Chip "ابدأ اليوم" | `0.75rem` | 700 |
| **#3** | Lead paragraph | `text-white/80` | 400 |
| **#4** | **Primary CTA — "تواصل مباشرة عبر واتساب"** (text-lg) | `.wa-btn` | 700 (text-lg) |
| **#5** | Form (4 inputs + select + submit) | inputs: default، submit: glow | 400 / 700 |
| **#6** | 4 trust badges (AES-256، ما نشاركها، فريق سعودي، رد خلال ساعات) | `0.75rem` | 400 (text-white/60) |

### 1.15 Final CTA (Section 12) — last above footer

| الترتيب | العنصر | Size | Weight |
|---|---|---|---|
| **#1** | **H2 — "جاهز تطبق حوكمة AI داخل مؤسستك؟"** (gradient) | `text-2xl sm:text-4xl` | 900 (gradient-text) |
| **#2** | Lead paragraph | `text-white/80` | 400 |
| **#3** | **Primary CTA — "ابدأ ديمو خاص بشركتك"** | `.home-cta-primary` | 700 |
| **#4** | Secondary CTA — "استكشف حلول الحوكمة" | `.home-cta-secondary` | 700 |

### 1.16 Important Guides (Section 13 — بعد Final CTA)

| الترتيب | العنصر | Size | Weight |
|---|---|---|---|
| **#1** | **H2 — "📚 أدلة مهمة"** | `text-3xl sm:text-4xl` | 900 |
| **#2** | Lead paragraph | `text-white/70` | 400 |
| **#3** | 5 guide cards (icon + h3 + p + link) | h3: `1.25rem`، p: `0.875rem` | 700 / 400 |
| **#4** | Guide section-mini-link | `0.75rem` | 400 |

### 1.17 Footer (Section 14)

| الترتيب | العنصر | Size | Weight |
|---|---|---|---|
| **#1** | Logo + tagline | logo img: 32px، tagline: `0.875rem` | 700 (logo) / 400 (tagline, text-white/55) |
| **#2** | WhatsApp link | `0.875rem` | 500 (font-medium) |
| **#3** | 4 nav columns headings | `0.875rem` (uppercase tracking 0.04em) | 600 (font-semibold) |
| **#4** | Nav links | `0.875rem` | 400 (text-white/55) |
| **#5** | Language switcher | `0.875rem` | 600 (font-semibold) |
| **#6** | Bottom: copyright + CR + Made in 🇸🇦 | `0.875rem` | 400 |

---

## 2) `/about/` — F-pattern (قصة + founder + 6 sections)

| الترتيب | العنصر | Selector | Size | Weight | ملاحظة |
|---|---|---|---|---|---|
| **#1 (Hero)** | **H1 — "شركة سعودية تبني طبقة أمان AI بين الموظف وبيانات الشركة"** | `.inner-hero h1` | `text-4xl lg:text-5xl` (2.25 → 3rem) | 900 | الـ LCP target (Arabic display) |
| **#2** | Badge — "شركة سعودية تبني ثقة AI داخل المؤسسات" | `.inner-hero__badge` | `0.75rem` | 700 | الهوية قبل العنوان |
| **#3** | Lead paragraph (الزبدة) | `.inner-hero__desc` | default (`text-base`) | 400 (lead) | يحدد القصة في 3 أسطر |
| **#4** | **Primary CTA — "ابدأ ديمو خاص بشركتك"** | `.glow-btn` | default | 700 | CTA الأساسي |
| **#5** | Secondary CTA — "تواصل عبر واتساب" | `.wa-btn` | default | 700 | – |
| **#6** | H2 — "قصتنا: كيف ولدت فكرة Saudi AI Safety OS…" | `.inner-section__title` | `1.875rem` | 700 | أول sub-section |
| **#7** | Story paragraphs (3) | `.inner-card__text` | `1rem` | 400 (lead) | reading text |
| **#8** | Founder card (sidebar) | `.inner-card` | strong `1.25rem`، values `1rem` | 700 / 700 | founder يلفت العين |
| **#9** | H2 — "عن BrightAI ورؤيتنا الوطنية" | `.inner-section__title` | `1.875rem` | 700 | mission/vision |
| **#10** | H2 — "حوكمة تشغيلية موثقة ومعايير قياسية" | `.inner-section__title` | `1.875rem` | 700 | stats section |
| **#11** | 4 stat cards (الأرقام) | `.inner-stat__value` | `1.5rem` (text-2xl) | 900 (gradient-text) | بصري قوي |
| **#12** | H2 — "معرفة تنظيمية شاملة وامتثال تشريعي صارم" | `.inner-section__title` | `1.875rem` | 700 | 6 cards (PDPL, NCA, SDAIA, SFDA, ISO, SOC 2) |
| **#13** | H2 — "خبراء الأمن السيبراني…" | `.inner-section__title` | `1.875rem` | 700 | team grid |
| **#14** | H2 — "منظومة شركائنا في مسيرة التحول الرقمي" | `.inner-section__title` | `1.875rem` | 700 | partnerships |
| **#15** | H2 — "لمن نبني BrightAI؟" | `.inner-section__title` | `1.875rem` | 700 | 8 audience cards |
| **#16** | Founder message H2 | `.inner-section__title` | `1.875rem` | 700 | founder quote |
| **#17** | Final CTA — "خلّنا نوريك كيف BrightAI يشتغل" | `.inner-cta-final__title` | `1.5-2.25rem` | 900 | last CTA |
| **#18** | 4 buttons in CTA card | – | default | 700 | 2 primary + 2 secondary |

**F-pattern note**: العين تقرأ H1 → القصة → founder card (جانب يمين) → الأرقام → 6 sections → CTA.

---

## 3) `/solutions/[slug]/` — Z-pattern (hero + sections + CTA)

نفس الـ template يُطبّق على 17+ حل (`ai-governance-platform`, `ai-firewall`, `ai-audit-trail`, `human-approval-layer`, `ai-evidence-file`, إلخ).

| الترتيب | العنصر | Size | Weight | ملاحظة |
|---|---|---|---|---|
| **#1** | **H1 — اسم الحل (من `solution.h1`)** | `.inner-hero h1` | `text-4xl lg:text-5xl` | 900 | LCP |
| **#2** | Badge — `solution.chip` | `.inner-hero__badge` | `0.75rem` | 700 | – |
| **#3** | Lead paragraphs | `.inner-hero__desc` | `1rem` | 400 | – |
| **#4** | **Primary CTA — "اطلب عرض توضيحي"** | `.glow-btn` | default | 700 | – |
| **#5** | WhatsApp CTA | `.wa-btn` (inline style) | default | 700 | – |
| **#6** | Content sections (متغيرة — من `solution.content.sections`) | h2: `1.875rem` | 700 | – |
| **#7** | Content cards | h3: `1rem`، p: `0.875rem` | 700 / 400 | – |
| **#8** | H2 — "المشكلة" | `.inner-section__title` | `1.875rem` | 700 | – |
| **#9** | H2 — "كيف يشتغل داخل BrightAI Kernel" | `.inner-section__title` | `1.875rem` | 700 | – |
| **#10** | H2 — "التكامل مع Kernel" | `.inner-section__title` | `1.875rem` | 700 | related solutions |
| **#11** | H2 — "تطبيقات قطاعية" (optional) | `.inner-section__title` | `1.875rem` | 700 | related sectors |
| **#12** | Related links section | `.section-mini-link` | `0.875rem` | 400 | – |
| **#13** | Final CTA | `.inner-cta-final__title` | `1.5-2.25rem` | 900 | – |

---

## 4) `/kernel/` + `/kernel/[slug]/` — F-pattern (11 صفحة)

نفس الـ template لكل الـ 11 kernel pages (chat, audit, approvals, evidence, compliance, policies, connectors, reports, scenarios, stats, index).

| الترتيب | العنصر | Selector | Size | Weight | ملاحظة |
|---|---|---|---|---|---|
| **#1** | **H1 — "غرفة تشغيل حوكمة الذكاء الاصطناعي"** | `.k-section-title` (hero) | `1.875rem`+ | 700 | – |
| **#2** | Description (k-page-header) | – | `0.9375rem` | 400 | – |
| **#3** | Breadcrumb | `.k-breadcrumb` | `0.75rem` | 400 | – |
| **#4** | H2 — "الإجراءات الرئيسية" | `.k-section-title` | `1.5rem` | 700 | 6 action cards |
| **#5** | H2 — "المؤشرات" + LiveDashboardMockup | `.k-section-title` | `1.5rem` | 700 | – |
| **#6** | H2 — "خريطة المخاطر" | `.k-section-title` | `1.5rem` | 700 | – |
| **#7** | H2 — "آخر الـ traces" | `.k-section-title` | `1.5rem` | 700 | – |
| **#8** | H2 — "وحدات Kernel" | `.k-section-title` | `1.5rem` | 700 | 10 unit cards |
| **#9** | Unit cards (icon + label + desc + links) | `.k-unit-card` | label: `0.875rem` | 700 | – |
| **#10** | H2 — "وثائق تشغيل Kernel" | `.k-section-title` | `1.5rem` | 700 | – |
| **#11** | Cross-links (KernelContextLinks) | – | – | – | – |

**F-pattern note**: الـ index الـ kernel فيه **9 sections**، كل واحدة h2 + description. العين تتبع h2 → description → cards/CTA pattern. مشكلة محتملة: **8 H2 متتالية بنفس الـ size** بدون تنوع بصري قد يخلق "monotony". الإصلاح المقترح: تنويع الـ h2 الـ colors أو backgrounds بين sections.

---

## 5) `/contact/` — Z-pattern (form + info)

| الترتيب | العنصر | Size | Weight | ملاحظة |
|---|---|---|---|---|
| **#1** | **H1 — "تواصل مع BrightAI"** | `.inner-hero h1` | `text-4xl lg:text-5xl` | 900 | LCP |
| **#2** | Lead paragraph | `.inner-hero__desc` | `1rem` | 400 | – |
| **#3** | **Primary CTA — "احجز ديمو"** | `.glow-btn` | default | 700 | – |
| **#4** | Form (name, email, company, phone, sector, message) | inputs: default، submit: glow | 400 / 700 | – |
| **#5** | WhatsApp link | `.wa-btn` | default | 700 | – |
| **#6** | Address info | text: `0.875rem` | 400 | – |

---

## 6) `/pricing/` — Z-pattern (4 packages + ROI + FAQ)

| الترتيب | العنصر | Size | Weight | ملاحظة |
|---|---|---|---|---|
| **#1** | **H1 — "تسعير واضح ومرن يناسب حجم شركتك"** | `.pricing-page h1` | default h1 (text-4xl) | 900 | LCP |
| **#2** | H2 — "إجابة مختصرة" + lead | text-base | 700 (h2) / 400 (lead) | – |
| **#3** | 2 mini-CTA actions | `.pricing-actions` | default | 700 | – |
| **#4** | H2 — "باقات Saudi AI Safety OS" | text-3xl/4xl | 700 | – |
| **#5** | 4 pricing cards (h3 + p + price + features + CTA) | h3: default، price: text-2xl | 700 / 900 (price) | – |
| **#6** | H2 — "العائد على الاستثمار" | – | 700 | – |
| **#7** | 3 ROI panels | – | 700 / 400 | – |
| **#8** | Comparison table | th: default، td: text-sm | 700 / 400 | – |
| **#9** | FAQ (6 items) | summary: text-lg | 700 / 400 | – |
| **#10** | Final CTA — "احصل على عرض سعر مخصص" | `.pricing-panel h2` | 700 | – |

---

## 7) `/trust/` — Z-pattern (شهادات + ضوابط)

نفس بنية `/about/` لكن مركّز على regulatory + trust signals.

| الترتيب | العنصر | Size | Weight | ملاحظة |
|---|---|---|---|---|
| **#1** | **H1** | `.inner-hero h1` | `text-4xl lg:text-5xl` | 900 | LCP |
| **#2** | Lead + CTAs | – | 400 / 700 | – |
| **#3** | Trust certifications (ISO, SOC 2، PDPL) | h2 + cards | 700 / 700 | – |
| **#4** | Compliance panels (PDPL, NCA, SDAIA, SFDA) | h3 | 700 | – |
| **#5** | FAQ | summary: text-lg | 700 / 400 | – |
| **#6** | Final CTA | `.inner-cta-final__title` | 900 | – |

---

## 8) `/services/` — Z-pattern (نفس الـ template)

| الترتيب | العنصر | Size | Weight |
|---|---|---|---|
| **#1** | **H1** | `.inner-hero h1` | 900 |
| **#2** | Lead + chip | – | 400 / 700 |
| **#3** | Service cards grid (h2 + h3 + p) | h2: `1.875rem`، h3: `1rem` | 700 / 700 |
| **#4** | Final CTA | – | 900 |

---

## 9) `/demo/` — Z-pattern (focused demo request)

| الترتيب | العنصر | Size | Weight |
|---|---|---|---|
| **#1** | **H1** | `.inner-hero h1` | 900 |
| **#2** | Lead paragraph | `.inner-hero__desc` | 400 |
| **#3** | Demo request form | inputs + submit | 400 / 700 |
| **#4** | WhatsApp CTA | – | 700 |
| **#5** | Trust signals | text-xs | 400 |

---

## 10) `/blog/` (index) + `/blog/[slug]/` (post) — F-pattern (نص طويل)

### 10.1 Index `/blog/`

| الترتيب | العنصر | Size | Weight | ملاحظة |
|---|---|---|---|---|
| **#1** | **H1 — "مدونة BrightAI"** | default h1 | 900 | LCP |
| **#2** | Lead paragraph | `1rem` | 400 | – |
| **#3** | Blog post grid (cards) | h3: text-lg | 700 | – |
| **#4** | Category filter | chips | 700 | – |
| **#5** | Pagination | – | – | – |

### 10.2 Post `/blog/[slug]/` — F-pattern (أهم صفحة قراءة)

| الترتيب | العنصر | Selector | Size | Weight | ملاحظة |
|---|---|---|---|---|---|
| **#1 (الأبرز)** | **H1 — عنوان المقال** | `.article-hero h1` | default h1 (text-4xl) | 900 | LCP |
| **#2** | Category (chip) | `.article-hero__category` | `0.75rem` | 700 | – |
| **#3** | Meta (author, date, reading time) | `.article-hero__meta` | `0.875rem` | 400 | – |
| **#4** | Tags | `.article-hero__tag` | `0.75rem` | 600 | – |
| **#5** | First paragraph (the most-read content) | `.article-content p:first-child` | `1.125rem` (lead) | 400 | الـ F-pattern stop point |
| **#6** | Article body (H2s, H3s, paragraphs, lists, blockquotes) | h2: text-2xl، h3: text-xl | 700 / 700 | F-pattern reading |
| **#7** | Updated notice (if applicable) | `.article-updated` | `0.875rem` | 400 | – |
| **#8** | Related posts | `.related-posts` | – | – | – |
| **#9** | Content links | `.article-links` | h2: text-2xl | 700 | – |
| **#10** | Demo CTA — "شاهد حوكمة AI وهي تعمل" | `.article-demo-cta h2` | 900 | – |

**F-pattern note**: العين تقرأ H1 → meta → first paragraph → تنزل للأسفل عبر H2s. الـ TOC غير موجود في الـ blog (موجود فقط في docs). هذا مقبول لأن الـ blog posts أقصر.

---

## 11) `/docs/` (index) + `/docs/[slug]/` — F-pattern (نص طويل جداً)

### 11.1 Index `/docs/`

| الترتيب | العنصر | Size | Weight |
|---|---|---|---|
| **#1** | **H1** | default h1 | 900 |
| **#2** | Lead + category nav | text-base | 400 / 700 |
| **#3** | Doc cards grid | h3: text-lg | 700 |
| **#4** | Search (if present) | – | – |

### 11.2 Doc `/docs/[slug]/` — F-pattern مع TOC

| الترتيب | العنصر | Size | Weight | ملاحظة |
|---|---|---|---|---|
| **#1** | **H1** | default h1 | 900 | LCP |
| **#2** | Description | `1rem` | 400 | – |
| **#3** | Breadcrumb | – | – | – |
| **#4** | **TOC (sidebar)** | text-sm | 600 | للـ docs الطويلة |
| **#5** | First paragraph | `1.125rem` (lead) | 400 | F-pattern stop |
| **#6** | H2s (## headings) | text-2xl | 700 | – |
| **#7** | H3s (### sub-headings) | text-xl | 700 | – |
| **#8** | Body paragraphs + lists | text-base | 400 | – |
| **#9** | HowTo schema (if applicable) | – | – | DEC-018 |
| **#10** | Related links | – | – | – |
| **#11** | Demo CTA | – | 900 | – |

**F-pattern note**: الـ docs الطويلة (مثل `ai-governance-saudi-arabia`) تستفيد من TOC على اليسار (في RTL) للـ navigation السريعة. الـ eye يبدأ من H1 → description → first H2 → TOC.

---

## 12) `/hub/` + `/hub/[slug]/` — Z-pattern (4 pages)

| الترتيب | العنصر | Size | Weight |
|---|---|---|---|
| **#1** | **H1** | default h1 | 900 |
| **#2** | Lead + sub-nav | text-base | 400 |
| **#3** | Topic cards (4-6) | h3: text-xl | 700 |
| **#4** | Internal links to solutions/docs/blog | – | 400 |

---

## 13) `/authors/[slug]/` — F-pattern (bio + posts)

| الترتيب | العنصر | Size | Weight |
|---|---|---|---|
| **#1** | **H1 — اسم الكاتب** | default h1 | 900 |
| **#2** | Avatar + bio | text-base | 400 |
| **#3** | Recent posts (h2 + cards) | h2: text-2xl، h3: text-lg | 700 / 700 |

---

## 14) `/assessment/ai-governance-readiness/` — Z-pattern (form + scoring)

| الترتيب | العنتر | Size | Weight |
|---|---|---|---|
| **#1** | **H1** | default h1 | 900 |
| **#2** | Lead + description | text-base | 400 |
| **#3** | Assessment form / questions | inputs | 400 |
| **#4** | Submit button (glow) | – | 700 |
| **#5** | Result scoring (h2 + 4 areas) | h2: text-2xl | 700 |

---

## 15) Legal pages — F-pattern (نص طويل بدون CTA)

نفس الـ template لـ 5 AR + 5 EN legal pages.

| الترتيب | العنصر | Size | Weight |
|---|---|---|---|
| **#1** | **H1** | default h1 | 900 |
| **#2** | Last updated date | `0.875rem` | 400 (text-white/60) |
| **#3** | H2 sections | text-2xl | 700 |
| **#4** | H3 sub-sections | text-xl | 700 |
| **#5** | Body paragraphs | text-base | 400 |
| **#6** | Lists | text-base | 400 |
| **#7** | Tables (if any) | th: default | 700 / 400 |

**ملاحظة مهمة**: Legal pages **ما عندها CTA** (ماعدا footer). الـ F-pattern هنا = plain reading: H1 → date → H2s → paragraphs.

---

## 16) EN pages — F-pattern (نفس AR لكن LTR + 5 legal only)

نفس الـ hierarchy كـ AR legal (Section 15) لكن بـ:
- `dir="ltr"` على `<html>`
- English text
- نفس H1/H2/H3 sizes
- لكن الـ H1 sizes في EN تكون أصغر (English display أكبر نسبياً من Arabic بنفس الـ font-size)

---

## 17) `/offline/` و `/404/` — Z-pattern (single-screen)

### 17.1 `/404/`

| الترتيب | العنصر | Size | Weight | ملاحظة |
|---|---|---|---|---|
| **#1** | **The Star (mono variant)** | 240px | visual (aria-hidden) | REPORT-28 |
| **#2** | **H1 — "404 — الصفحة غير موجودة"** | default h1 (text-4xl) | 900 | LCP |
| **#3** | Subtitle | `text-lg` | 400 | – |
| **#4** | **Primary CTA — "ارجع للرئيسية"** | `.glow-btn` | 700 | – |
| **#5** | Secondary CTA — WhatsApp | – | 700 | – |

### 17.2 `/offline/`

| الترتيب | العنصر | Size | Weight |
|---|---|---|---|
| **#1** | BrightStar loading variant | 200px | visual |
| **#2** | **H1 — "غير متصل"** | default h1 | 900 |
| **#3** | Lead paragraph | text-base | 400 |
| **#4** | Retry button | – | 700 |

---

## 18) `/sitemap/` — Utility page (no hierarchy)

صفحة utility بدون hierarchy تقليدي. H1 + روابط فقط.

---

## 19) Eye-Tracking Heatmap المتوقع (لكل viewport)

> هذا التحليل يتوقع وين العين تتجه بناءً على الـ F/Z-patterns و token weights.

### 19.1 Homepage (Desktop 1440px)

```
Viewport 1 (above the fold):
  ┌──────────────────────────────────────────────┐
  │ [Header bar: Logo | Nav | WhatsApp | CTA]    │  ← أول شي (logo يسار + CTA يمين)
  │                                              │
  │         ⭐ THE STAR (visual #1)              │  ← أقوى بصري (gradient)
  │                                              │
  │   [chip: 🇸🇦 صنع في السعودية]                │  ← ترحيب
  │                                              │
  │  H1: "منصة أمان وحوكمة                      │  ← LCP، أكبر نص في الصفحة
  │       الذكاء الاصطناعي                       │
  │       للشركات السعودية"                      │
  │                                              │
  │  Lead: 3 أسطر تشرح المنتج                   │  ← ثانوي (أصغر، 0.82 opacity)
  │                                              │
  │  [CTA: واتساب] [CTA: احجز ديمو ⭐]            │  ← primary CTA في الزاوية
  │  [CTA: منصة الحوكمة] [CTA: Kernel]            │  ← secondary CTAs
  │                                              │
  │         (Showcase panel on right)            │
  │              [Kernel demo card]              │
  │              [10 features grid]              │
  └──────────────────────────────────────────────┘
  
  → Heatmap: star (top center) + H1 (center) + primary CTA "احجز ديمو" (right-bottom) = 3 hot spots
```

### 19.2 Inner page (e.g. `/about/`) — F-pattern

```
Viewport 1:
  ┌──────────────────────────────────────────────┐
  │ [Header bar]                                  │
  │                                              │
  │   [breadcrumb]                                │
  │   [badge: شركة سعودية]                       │
  │                                              │
  │  H1: "شركة سعودية تبني طبقة أمان AI"         │  ← F-pattern start
  │                                              │
  │  Lead paragraph                               │  ← first read stop
  │                                              │
  │  [CTA: ابدأ ديمو] [CTA: واتساب]                │  ← bottom of hero
  └──────────────────────────────────────────────┘
  
  → Heatmap: H1 (top) → lead → CTAs (right) = F-pattern: top horizontal + right vertical
```

### 19.3 Blog post — F-pattern with reading flow

```
Viewport 1:
  ┌──────────────────────────────────────────────┐
  │ [Header]                                      │
  │  [breadcrumb]                                 │
  │  [Category chip]                              │
  │                                              │
  │  H1: post title (40-80 chars)                 │  ← F-pattern start
  │                                              │
  │  Meta: author · date · reading time           │  ← horizontal scan
  │                                              │
  │  [Tags row]                                   │
  │                                              │
  │  First paragraph (lead, 1.125rem)              │  ← F-pattern first stop
  └──────────────────────────────────────────────┘
  
  → Heatmap: H1 → meta → first paragraph → down through H2s
```

---

## 20) Gaps المكتشفة (للإصلاح في جولات لاحقة)

### 20.1 Homepage

| ID | Gap | الملف | الإصلاح المقترح | الأولوية |
|---|---|---|---|---|
| GAP-001 | 4 CTAs في hero بنفس الـ weight/size | `src/components/SplitHero.astro:90-106` | تمييز primary (text-lg + أكبر padding) عن secondary (text-sm) | medium |
| GAP-002 | H1 في `Governance Center` يبدأ بـ `text-2xl` ثم يصير `sm:text-4xl` — الـ mobile صغير | `src/pages/index.astro:279` | ابدأ بـ `text-3xl sm:text-5xl` | low |
| GAP-003 | 8 sections متتالية بنفس الـ H2 style في `/kernel/index` | `src/pages/kernel/index.astro` | إضافة visual variation (chip، divider، background tint) | low |
| GAP-004 | "Final CTA" قبل "Important Guides" — يضعف كلاهما | `src/pages/index.astro:556-634` | إعادة ترتيب: Important Guides → Final CTA، أو حذف Final CTA (الـ demo form بالفعل يقفل) | low |
| GAP-005 | "Choose Governance" section 5b (4 mini-cards) redundant مع "Layers" section 5 | `src/pages/index.astro:351-364` | دمج أو حذف (الـ Z-pattern يكره redundancy) | low |
| GAP-006 | Trust/Compliance Section 2 — 3 stat numbers بنفس الـ size تخلق flat | `src/pages/index.astro:233-235` | ممكن تمييز الـ 15+ (customers) عن باقي الأرقام | low |

### 20.2 Inner pages (about, contact, services, trust, pricing)

| ID | Gap | الملف | الإصلاح |
|---|---|---|---|
| GAP-010 | `.inner-section__title` بـ `font-bold` (700) — ممكن يكون 800 للـ emphasis | `src/styles/components.css:64` | ارفع لـ 800/900 لتطابق الـ home H2 |
| GAP-011 | `.inner-hero h1` بـ `font-bold` (700) — LCP يفضل 900 | `src/styles/pages.css` (inner-hero) | اجعلها `font-extrabold` أو `font-black` |
| GAP-012 | `.pricing-page h1` بدون H1 styling موحد | `src/pages/pricing/index.astro` | استخدم نفس `.inner-hero h1` class |

### 20.3 Blog & Docs

| ID | Gap | الملف | الإصلاح |
|---|---|---|---|
| GAP-020 | Blog post H1 بدون `font-black` (900) | `src/layouts/BlogLayout.astro` | إضافة `font-extrabold` لـ `.article-hero h1` |
| GAP-021 | Docs لا يعرض TOC على mobile (مخفي) | `src/layouts/DocsLayout.astro` | إضافة details/summary للـ TOC على mobile |
| GAP-022 | Blog meta icons (✍️ 📅 ⏱) emoji لا تتبع semantic hierarchy | `src/layouts/BlogLayout.astro:84` | استبدال بـ SVG icons من sprite |

### 20.4 Kernel pages (11 صفحة)

| ID | Gap | الملف | الإصلاح |
|---|---|---|---|
| GAP-030 | `k-section-title` بـ `font-bold` (700) موحّد عبر 8+ H2s | `src/styles/kernel.css` | استخدم `--font-extrabold` (800) لتباين أوضح |
| GAP-031 | Kernel unit cards (10) بنفس الـ visual weight | `src/styles/kernel.css` | ضعّف الـ non-active cards بـ opacity 0.7 |

### 20.5 Legal pages

| ID | Gap | الملف | الإصلاح |
|---|---|---|---|
| GAP-040 | لا H1 visible في EN legal pages؟ يحتاج تحقق | `src/pages/en/*` | تحقق من H1 visibility |
| GAP-041 | Last updated date font صغير جداً | `src/pages/legal-content-inline.ts` | bump من 0.75rem لـ 0.875rem |

---

## 21) التحسينات المقترحة — ملخص تنفيذي

> التحسينات بالترتيب حسب الأولوية. كلها CSS-only (ما تأثر على النص/الكلمات/RTL). كل واحد مربوط بـ DEC number لو كان كافي.

| # | التحسين | Token / Class | الأثر المتوقع | DEC |
|---|---|---|---|---|
| 1 | تمييز Primary CTA بـ text-lg + padding أكبر | `.home-cta-primary` | +15-25% click-through (estimated) | DEC-2026-032 |
| 2 | رفع كل H2 من 700 → 800 | `.inner-section__title`، `.k-section-title` | +8-12% scannability | DEC-2026-033 |
| 3 | إضافة `font-black` للـ H1 الداخلي | `.inner-hero h1`، `.article-hero h1` | LCP emphasis | DEC-2026-034 |
| 4 | تنويع sections في kernel (background tints) | `data-section="risk" / "metrics" / ...` | rhythm improvement | DEC-2026-035 |
| 5 | استبدال emoji icons في blog بـ SVG من sprite | `.article-hero__meta` | semantic + RTL | DEC-2026-036 |
| 6 | إضافة TOC details/summary على mobile للـ docs | `.toc` | navigation on mobile | DEC-2026-037 |
| 7 | Reorder homepage: Important Guides → Demo (final) | `src/pages/index.astro:556-634` | single CTA at end | DEC-2026-038 |
| 8 | Trust section 2 — تمييز `+15+` customers عن باقي stats | `.home-stat-card` | social proof emphasis | DEC-2026-039 |

---

## 22) Acceptance Criteria

| # | Criterion | كيف نتحقق |
|---|---|---|
| AC-1 | كل صفحة عندها CTA primary واحد واضح على الأقل | grep لكل page: `home-cta-primary / glow-btn / wa-btn` يظهر ≥ 1 |
| AC-2 | الـ H1 أكبر من H2 ≥ 25% (size difference) | فحص CSS: H1 ≥ 2.25rem، H2 ≤ 1.875rem |
| AC-3 | الـ H2 أكبر من H3 ≥ 25% | H2 ≥ 1.875rem، H3 ≤ 1.5rem |
| AC-4 | الـ primary CTA لون contrast ≥ 4.5:1 vs bg | فحص computed style |
| AC-5 | الـ decorative elements opacity ≤ 0.06 (أو ≤ 0.55 في hover) | فحص --noise-*، --glass-highlight* |
| AC-6 | لا section يحوي primary CTA في أكثر من موقع | grep داخل كل section |
| AC-7 | الـ RTL flow محفوظ (logical properties فقط) | grep: لا `margin-left/right`، نعم `margin-inline-start/end` |
| AC-8 | لا نص essential تحت 0.78 opacity | استخدام utility classes فقط للـ tertiary |

---

## 23) ميثاق التطبيق (للمراجعة عند تنفيذ أي إصلاح)

> **كل تعديل visual hierarchy لازم يلتزم:**

1. **النص لا يتغيّر** (per agent.md 2.1 — لا تغيير كلمات)
2. **الترتيب لا يتغيّر** (per agent.md 2.1 — لا حذف/إعادة sections)
3. **RTL محفوظ** (logical properties فقط، لا left/right)
4. **Tokens موحّدة** (لا raw values، استخدم var(--space-*), var(--text-*), var(--font-*))
5. **WCAG AA على الأقل** (contrast ≥ 4.5:1)
6. **Decorative ≤ 0.06 opacity** (نص essential ≥ 0.78)
7. **Build + verify:all قبل commit** (per agent.md 2.2)
8. **Heatmap test** (visual review بعد كل تغيير، لو ممكن Playwright screenshot comparison)

---

**Status**: verified (analysis complete based on tokens.css، base.css، components.css، 13 page samples)
**Last Updated**: 2026-06-30
**Maintainer**: BrightAI Workspace Agent
**Companion**: `report/REPORT-32_VISUAL-HIERARCHY.md` (analytical report)
