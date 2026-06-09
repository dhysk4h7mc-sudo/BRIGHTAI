# BRIGHTAI Design System

> نظام التصميم الرسمي لمنصة BRIGHTAI — منصة حوكمة وسلامة الذكاء الاصطناعي في السعودية

**الإصدار:** 1.0.0
**آخر تحديث:** 2026-06-10
**اللغة الأساسية:** العربية (RTL-first)
**السمة الافتراضية:** Dark Mode

---

## 1. Visual Theme & Atmosphere

BRIGHTAI يتبنى هوية بصرية **مؤسسية فاخرة** (Premium Enterprise) تجمع بين:

- **Glassmorphism** — تأثيرات الزجاج الشفاف مع ضبابية الخلفية
- **Dark-First** — سمات داكنة كخيار أساسي مع دعم الوضع الفاتح
- **Neural Aesthetic** — خلفيات شبكات عصبية متحركة وأشكال هندسية رقمية
- **RTL-Native** — مصمم للعربية أولاً مع دعم كامل للإنجليزية (LTR)

الكلمات المفتاحية للهوية: *مؤسسي، موثوق، ذكي، سعودي، فاخر، آمن*

---

## 2. Color Palette & Roles

### 2.1 Brand Colors (Primary)

| الاسم الوصفي | القيمة | الدور الوظيفي |
|---|---|---|
| Deep Navy Abyss | `#07111f` | أعمق خلفية للعلامة التجارية — نادر الاستخدام |
| Ocean Depth Navy | `#0b1f33` | خلفية العناصر الثانوية العميقة |
| Storm Blue | `#10324f` | خلفية البطاقات المميزة |
| Strong Teal-Blue | `#15547a` | حدود وعناصر التمييز |
| Deep Teal | `#0f766e` | النصوص المميزة والروابط (Light mode focus) |
| Vibrant Teal | `#0d9488` | الأزرار الثانوية والشارات |
| Bright Teal | `#2dd4bf` | الأيقونات النشطة والمؤشرات |
| Electric Cyan | `#67e8f9` | **اللون الرئيسي** — التركيز، الحدود المضيئة، الحلقات |
| **Royal Gold** | `#f7c948` | **لون الإجراء الرئيسي (CTA)** — الأزرار الأساسية |
| **Strong Gold** | `#d6a72f` | حالات hover للذهبي، النصوص المميزة |

### 2.2 Accent Gradients

```css
/* Primary CTA Gradient */
background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);

/* Nav CTA */
background: linear-gradient(135deg, #6366f1, #8b5cf6);

/* Tools Section */
background: linear-gradient(135deg, #8b5cf6, #ec4899, #06b6d4);

/* Internal Linking */
background: linear-gradient(135deg, #10b981, #06b6d4);

/* Chat FAB */
background: linear-gradient(135deg, #6366f1, #8b5cf6);
```

### 2.3 Neutral Scale

| الاسم | القيمة | الاستخدام |
|---|---|---|
| Pure White | `#ffffff` | النصوص العلوية، حدود شديدة الوضوح |
| Snow | `#f8fafc` | النصوص الرئيسية (dark mode) |
| Cloud | `#f1f5f9` | خلفية الصفحة (light mode) |
| Mist | `#e2e8f0` | النصوص الأساسية في الوضع الداكن |
| Fog | `#cbd5e1` | النصوص الثانوية، الروابط |
| Silver | `#94a3b8` | النصوص الخافتة، التلميحات |
| Slate | `#64748b` | العناصر المعطلة، العناصر النائبة |
| Iron | `#475569` | النصوص الثانوية (light mode) |
| Steel | `#334155` | حدود خفيفة، فواصل |
| Dark Panel | `#1e293b` | خلفية البطاقات والأسطح المرتفعة |
| Midnight | `#0f172a` | خلفية اللوحات والأسطح |
| Void | `#020617` | **خلفية الصفحة الرئيسية** — أعمق درجة |

### 2.4 Semantic Colors

| الدلالة | القيمة | الاستخدام |
|---|---|---|
| Success | `#22c55e` | حالة النجاح، الاتصال النشط، المؤشرات الإيجابية |
| Warning | `#f59e0b` | التنبيهات، الحالات المتوسطة |
| Danger | `#ef4444` | الأخطاء، الحذف، الحالات الحرجة |
| Info | `#38bdf8` | المعلومات، الروابط الداخلية |
| Focus | `#67e8f9` | حلقات التركيز، حدود حقول الإدخال |

### 2.5 Surface System (Dark Mode)

```css
--ba-surface-page:     #020617;                    /* خلفية الصفحة */
--ba-surface-panel:    rgba(15, 23, 42, 0.86);     /* اللوحات والبطاقات */
--ba-surface-raised:   rgba(30, 41, 59, 0.86);     /* العناصر المرتفعة */
--ba-surface-glass:    rgba(255, 255, 255, 0.045);  /* زجاجي خفيف */
--ba-surface-overlay:  rgba(2, 6, 23, 0.72);       /* طبقات التغطية */
```

### 2.6 Surface System (Light Mode)

```css
--ba-surface-page:     #f8fafc;
--ba-surface-panel:    rgba(255, 255, 255, 0.92);
--ba-surface-raised:   rgba(241, 245, 249, 0.96);
```

---

## 3. Typography Rules

### 3.1 Font Stack

| النوع | الخط | الاستخدام |
|---|---|---|
| **العربية (الأساسي)** | `"BrightAI Official"` (TheYearofTheCamel) | جميع النصوص العربية |
| **Mono** | `"JetBrains Mono", "SFMono-Regular", Consolas` | الأكواد، البيانات التقنية |
| **System Fallback** | `system-ui, -apple-system, "Segoe UI", sans-serif` | النسخ الاحتياطي |

### 3.2 Type Scale

| الحجم | القيمة | الاستخدام |
|---|---|---|
| `--ba-text-xs` | `0.75rem` (12px) | الشارات، الملاحظات الصغيرة، التلميحات |
| `--ba-text-sm` | `0.875rem` (14px) | التسميات، العناصر الثانوية |
| `--ba-text-base` | `1rem` (16px) | النص الأساسي |
| `--ba-text-lg` | `1.125rem` (18px) | النصوص الموسعة، العناوين الفرعية |
| `--ba-text-xl` | `1.25rem` (20px) | عناوين H3 |
| `--ba-text-2xl` | `1.5rem` (24px) | عناوين H2 |
| `--ba-text-3xl` | `1.875rem` (30px) | عناوين H1 |
| `--ba-text-4xl` | `2.25rem` (36px) | العناوين الرئيسية الكبيرة |

**Hero Title Responsive:**
```css
font-size: clamp(2.5rem, 5vw, 3.8rem);
```

### 3.3 Line Heights

| النوع | القيمة | الاستخدام |
|---|---|---|
| Tight | `1.3` | العناوين |
| Normal | `1.65` | النصوص العامة |
| Relaxed | `1.9` | الفقرات الطويلة، المحتوى العربي |

### 3.4 Font Weights

| الوزن | القيمة | الاستخدام |
|---|---|---|
| Normal | `400` | النصوص الأساسية |
| Medium | `500` | التسميات، عناصر التنقل |
| Semi-Bold | `600` | الأزرار، العناوين الفرعية |
| Bold | `700` | العناوين، النصوص المهمة |
| Extra-Bold | `800` | الأزرار الرئيسية (CTA)، الشارات |
| Black | `900-1000` | الشعارات، العناوين البارزة |

---

## 4. Spacing Scale

مبنية على وحدة أساس `0.25rem` (4px):

| المتغير | القيمة | بالـ px | الاستخدام |
|---|---|---|---|
| `--ba-space-0` | `0` | 0 | إعادة التعيين |
| `--ba-space-1` | `0.25rem` | 4px | فواصل دقيقة جداً |
| `--ba-space-2` | `0.5rem` | 8px | فواصل داخلية صغيرة |
| `--ba-space-3` | `0.75rem` | 12px | padding الأزرار، فواصل الأيقونات |
| `--ba-space-4` | `1rem` | 16px | تباعد قياسي بين العناصر |
| `--ba-space-5` | `1.25rem` | 20px | تباعد متوسط |
| `--ba-space-6` | `1.5rem` | 24px | padding البطاقات |
| `--ba-space-8` | `2rem` | 32px | فواصل الأقسام |
| `--ba-space-10` | `2.5rem` | 40px | فواصل كبيرة |
| `--ba-space-12` | `3rem` | 48px | padding الأقسام |
| `--ba-space-16` | `4rem` | 64px | فواصل الأقسام الرئيسية |
| `--ba-space-20` | `5rem` | 80px | فواصل الصفحات |
| `--ba-space-24` | `6rem` | 96px | أقصى تباعد |

### Container Widths

| الاستخدام | القيمة |
|---|---|
| Layout Container | `1180px` |
| Max Content Width | `1280px` |
| Internal Links | `1120px` |

---

## 5. Component Library

### 5.1 Buttons

#### Primary Button (`.btn-primary`)
- **الخلفية:** `#f7c948` (Royal Gold)
- **النص:** `#020617` (Void)
- **الظل:** `0 16px 34px rgba(247, 201, 72, 0.2)`
- **Hover:** خلفية `#ffd95f`، رفع `-1px`
- **الحد الأدنى للارتفاع:** `44px` (tap target)
- **الخط:** Extra-Bold (800)

#### Secondary Button (`.btn-secondary`)
- **الخلفية:** `rgba(30, 41, 59, 0.86)` (Raised)
- **النص:** `#f8fafc` (Snow)
- **الحد:** `1px solid rgba(103, 232, 249, 0.52)` (Strong Cyan)
- **Hover:** خلفية `rgba(45, 212, 191, 0.16)`، حد Teal

#### Ghost Button (`.btn-ghost`)
- **الخلفية:** شفافة
- **النص:** `#f8fafc`
- **الحد:** `1px solid rgba(226, 232, 240, 0.18)` (Subtle)
- **Hover:** خلفية `rgba(255, 255, 255, 0.1)`، حد أقوى

#### Gradient CTA (Nav)
- **الخلفية:** `linear-gradient(135deg, #6366f1, #8b5cf6)`
- **الشكل:** Pill (`999px`)
- **الظل:** `0 2px 12px rgba(99, 102, 241, 0.3)`

### 5.2 Cards

#### Glass Card (`.glass-card`)
- **الخلفية:** `rgba(15, 23, 42, 0.4)` مع `backdrop-filter: blur(20px)`
- **الحدود:** `1px solid rgba(255, 255, 255, 0.06)`
- **الظل:** `0 24px 64px -16px rgba(0, 0, 0, 0.8)`
- **الاستدارة:** `16px`

#### KPI Card (`.kpi-card`)
- **الخلفية:** تدرج رمادي `#1e293b`
- **الحد:** `rgba(255, 255, 255, 0.2)`
- **الاستدارة:** `12px-16px`

#### Feature Card
- **الخلفية:** Panel surface مع حدود خفيفة
- **Hover:** تأثير توهج خفيف
- **الاستدارة:** `16px`

### 5.3 Navigation

#### Unified Nav (`.unified-nav`)
- **الموقع:** `fixed` أعلى الصفحة
- **الارتفاع:** `72px` (Desktop) / `60px` (Mobile)
- **الخلفية:** `rgba(2, 6, 23, 0.65)` مع `backdrop-filter: blur(18px)`
- **الحد:** `1px solid rgba(255, 255, 255, 0.06)`
- **التمرير:** خلفية أكثر كثافة `rgba(2, 6, 23, 0.92)`
- **السلوك:** إخفاء عند التمرير للأسفل، إظهار عند الأعلى

#### Mobile Drawer (`.mobile-menu-drawer`)
- **العرض:** `min(85vw, 360px)` / Mobile: `min(92vw, 380px)`
- **الخلفية:** `rgba(2, 6, 23, 0.98)` مع `backdrop-filter: blur(24px)`
- **الأنيميشن:** انزلاق من الجانب `0.45s cubic-bezier(0.16, 1, 0.3, 1)`

### 5.4 Forms & Inputs

- **الخلفية:** `rgba(255, 255, 255, 0.05)`
- **الحد:** `1px solid rgba(255, 255, 255, 0.08)`
- **الاستدارة:** `12px`
- **التركيز:** حد `rgba(99, 102, 241, 0.4)`
- **الارتفاع الأدنى:** `44px` (tap target)
- **الخط:** موروث من الأب

### 5.5 Chat Widget

- **FAB:** `58x58px`، تدرج `#6366f1 → #8b5cf6`، ظل `0 8px 32px`
- **المربع:** `400x620px`، استدارة `20px`
- **الخلفية:** `#0a0f1e` مع حدود `rgba(99, 102, 241, 0.18)`
- **الموبايل:** ملء الشاشة بالكامل

### 5.6 Modals & Overlays

- **خلفية التغطية:** `rgba(2, 6, 23, 0.72)`
- **انتقال:** `opacity 0.28s, visibility 0.28s`

---

## 6. Border Radius Scale

| المتغير | القيمة | الوصف | الاستخدام |
|---|---|---|---|
| `--ba-radius-sm` | `0.375rem` (6px) | زوايا دقيقة | الحقول الصغيرة، الأيقونات |
| `--ba-radius-md` | `0.5rem` (8px) | زوايا ناعمة | القوائم المنسدلة |
| `--ba-radius-lg` | `0.75rem` (12px) | زوايا مستديرة | الأزرار، الحقول |
| `--ba-radius-xl` | `1rem` (16px) | استدارة واسعة | البطاقات |
| `--ba-radius-2xl` | `1.5rem` (24px) | استدارة كبيرة | النوافذ المنبثقة |
| `--ba-radius-pill` | `999px` | شكل حبة الدواء | الشارات، CTA |
| `--ba-radius-card` | `16px` | استدارة البطاقات | البطاقات الرئيسية |
| `--ba-radius-control` | `8px` | استدارة العناصر | عناصر التحكم |

---

## 7. Shadow Scale

| المتغير | القيمة | الاستخدام |
|---|---|---|
| `--ba-shadow-sm` | `0 1px 2px rgba(2, 6, 23, 0.18)` | عناصر صغيرة، tooltips |
| `--ba-shadow-md` | `0 12px 32px rgba(2, 6, 23, 0.24)` | البطاقات المرتفعة |
| `--ba-shadow-lg` | `0 22px 64px rgba(2, 6, 23, 0.34)` | النوافذ المنبثقة |
| `--ba-shadow-focus` | `0 0 0 6px rgba(103, 232, 249, 0.2)` | حلقة التركيز |
| `--ba-shadow-panel` | `0 18px 48px rgba(2, 6, 23, 0.22)` | اللوحات |

---

## 8. Animation Guidelines

### 8.1 Duration Scale

| المتغير | القيمة | الاستخدام |
|---|---|---|
| `--ba-motion-fast` | `120ms` | التفاعلات الفورية (hover, active) |
| `--ba-motion-base` | `180ms` | الانتقالات القياسية |
| `--ba-motion-slow` | `280ms` | الأنيميشن البطيئة، الكشف |
| Cinematic | `~700ms` | كشف العناصر الرئيسية |
| Confetti | `var` | تأثيرات الاحتفال |

### 8.2 Easing Functions

| المتغير | القيمة | الاستخدام |
|---|---|---|
| `--ba-ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` | الانتقالات العامة |
| `--ba-ease-emphasized` | `cubic-bezier(0.16, 1, 0.3, 1)` | الكشف، الانزلاق، التمدد |

### 8.3 Named Animations

| الاسم | الوصف | الاستخدام |
|---|---|---|
| `bai-cinematic-reveal` | كشف سينمائي مع ضبابية + تكبير | Hero section، العناصر الرئيسية |
| `bai-fade-in` | ظهور تدريجي من الأسفل | الأقسام عند التمرير |
| `bai-ai-pulse` | نبضة توهج ذكية | عناصر الذكاء الاصطناعي |
| `bai-confidence-fill` | تعبئة شريط الثقة تدريجياً | نتائج التحليل |
| `bai-typewriter` | كتابة تدريجية | النصوص المولدة |
| `bai-confetti` | تأثير الاحتفال | إنجاز الإجراءات |

### 8.4 Stagger Pattern

```css
/* تأخير تصاعدي للعناصر المتتالية */
animation-delay: calc(var(--stagger-index, 0) * 70ms);
```

### 8.5 Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
```

---

## 9. RTL Rules

### 9.1 القواعد الأساسية

1. **`dir="rtl"` و `lang="ar-SA"`** على عنصر `<html>` دائماً
2. **استخدام Logical Properties فقط:**
   - `margin-inline-start` بدل `margin-left`
   - `padding-inline-end` بدل `padding-right`
   - `inset-inline-start` بدل `left`
   - `block-size` بدل `height` (في السياق الكتابي)
   - `inline-size` بدل `width` (في السياق الكتابي)
3. **تجنب القيم الصلبة:** لا تستخدم `left`/`right` أبداً — استخدم `start`/`end`

### 9.2 Mixed Content Rules

```css
/* النصوص الإنجليزية داخل المحتوى العربي */
bdi, [dir="ltr"] {
  unicode-bidi: isolate;
}
```

### 9.3 Lists

```css
[dir="rtl"] :where(ul, ol) {
  padding-inline-start: 0;
  padding-inline-end: 1.25em;
}
```

### 9.4 Drawer Behavior

```css
/* RTL: الانزلاق من اليسار */
[dir="rtl"] .mobile-menu-drawer {
  transform: translateX(-100%);
}
[dir="rtl"] .mobile-menu-drawer.active {
  transform: translateX(0);
}
```

### 9.5 Chat Widget Origin

```css
[dir="rtl"] #bai-chat-box {
  transform-origin: bottom right;
}
```

---

## 10. Responsive Breakpoints

| النقطة | العرض | الجهاز |
|---|---|---|
| Mobile | `≤ 767px` | الهواتف |
| Tablet | `768px – 1023px` | الأجهزة اللوحية |
| Desktop | `≥ 1024px` | أجهزة الكمبيوتر |
| Wide | `≥ 1280px` | الشاشات الواسعة |

### Mobile Adaptations
- **الشبكات:** تتحول جميعها إلى عمود واحد (`grid-template-columns: 1fr`)
- **الأزرار:** عرض كامل (`width: 100%`)، ارتفاع أدنى `3.25rem`
- **التنقل:** قائمة جانبية منزلقة
- **Chat Widget:** يملأ الشاشة بالكامل
- **الخلفية المتحركة:** تُخفى لتوفير الأداء

---

## 11. Accessibility (a11y)

### Tap Targets
- **الحد الأدنى:** `44px × 44px`
- **المريح:** `48px × 48px`
- **Focus Ring:** `3px solid var(--ba-color-focus)` مع offset `3px`

### Skip Link
- مخفي افتراضياً، يظهر عند التركيز
- يتيح تخطي التنقل مباشرة للمحتوى

### Screen Reader
- `.sr-only` — عنصر مخفي بصرياً ومتاح للقارئ
- `aria-label` على جميع العناصر التفاعلية
- `role` attributes عند الحاجة

---

## 12. File Architecture

```
frontend/css/
├── design-tokens.css          # المتغيرات الأساسية (:root)
├── design-system.css          # نظام التصميم الشامل (CSS Variables)
├── components.css             # مكونات الواجهة المجمّعة
├── motion.css                 # الأنيميشن والحركات
├── typography.css             # قواعد الخطوط
├── visual-polish.css          # التحسينات البصرية
├── unified-header.css         # رأس الصفحة الموحّد
├── homepage-cta-links.css     # روابط الصفحة الرئيسية
├── sitewide-modernization.css # تحديثات شاملة للموقع
├── legal-and-services-pages.css # صفحات الخدمات والقانونية
└── design-system/
    ├── tokens.css
    ├── typography.css
    ├── components.css
    └── motion.css

components/
├── button-primary.html
├── button-secondary.html
├── button-ghost.html
├── card-glass.html
├── card-feature.html
├── card-kpi.html
├── form-input.html
├── form-search.html
├── modal.html
├── table.html
├── nav-unified.html
├── breadcrumb.html
├── badge.html
├── toast.html
└── chat-widget.html
```

---

## 13. Design Tokens Quick Reference

```css
/* === الألوان === */
--color-primary: #67e8f9;      /* Electric Cyan — التركيز */
--color-secondary: #0d9488;    /* Vibrant Teal — الثانوي */
--color-accent: #f7c948;       /* Royal Gold — CTA */
--color-bg: #020617;           /* Void — خلفية */
--color-surface: #0f172a;      /* Midnight — سطح */
--color-surface-raised: #1e293b; /* Dark Panel — مرتفع */
--color-text: #f8fafc;         /* Snow — نص رئيسي */
--color-text-muted: #94a3b8;   /* Silver — نص ثانوي */
--color-border: rgba(226, 232, 240, 0.18); /* Subtle */
--color-success: #22c55e;
--color-warning: #f59e0b;
--color-danger: #ef4444;
--color-info: #38bdf8;

/* === الخطوط === */
--font-ar: 'BrightAI Official', system-ui, sans-serif;
--font-mono: 'JetBrains Mono', monospace;

/* === التباعد === */
--spacing-xs: 4px;   /* 0.25rem */
--spacing-sm: 8px;   /* 0.5rem */
--spacing-md: 16px;  /* 1rem */
--spacing-lg: 24px;  /* 1.5rem */
--spacing-xl: 32px;  /* 2rem */
--spacing-2xl: 48px; /* 3rem */
--spacing-3xl: 64px; /* 4rem */
```
