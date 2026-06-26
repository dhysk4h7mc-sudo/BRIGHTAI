# نظام التصميم المؤسسي - Saudi AI Safety OS

## 1. الرؤية العامة

نظام تصميم موحد يهدف إلى تحقيق اتساق بصري كامل عبر جميع الصفحات والمكونات، مع الحفاظ على الهوية البصرية الحالية (الألوان الأساسية) وتحسين تجربة المستخدم.

## 2. الألوان

### 2.1 الألوان الأساسية (محفوظة)

#### Cyan (اللون الرئيسي)
```css
--brand-50: #ecfeff;
--brand-100: #cffafe;
--brand-200: #a5f3fc;
--brand-300: #67e8f9;
--brand-400: #22d3ee;
--brand-500: #06b6d4;
--brand-600: #0891b2;
--brand-700: #0e7490;
--brand-800: #155e75;
--brand-900: #164e63;
```

#### Green (لون التميز)
```css
--accent-50: #f0fdf4;
--accent-100: #dcfce7;
--accent-200: #bbf7d0;
--accent-300: #86efac;
--accent-400: #4ade80;
--accent-500: #22c55e;
--accent-600: #16a34a;
--accent-700: #15803d;
--accent-800: #166534;
--accent-900: #14532d;
```

#### Indigo (لون ثانوي)
```css
--indigo-50: #eef2ff;
--indigo-100: #e0e7ff;
--indigo-200: #c7d2fe;
--indigo-300: #a5b4fc;
--indigo-400: #818cf8;
--indigo-500: #6366f1;
--indigo-600: #4f46e5;
--indigo-700: #4338ca;
--indigo-800: #3730a3;
--indigo-900: #312e81;
```

### 2.2 الألوان الدلالية الموحدة

```css
:root {
  --bg-base: #0a0e1a;
  --bg-surface: #0f1525;
  --bg-elevated: #151c30;
  --bg-overlay: rgba(10,14,26,0.8);

  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
  --text-muted: #64748b;
  --text-inverse: #0a0e1a;

  --border-subtle: rgba(148,163,184,0.1);
  --border-default: rgba(148,163,184,0.2);
  --border-strong: rgba(148,163,184,0.35);

  --interactive-primary: #06b6d4;
  --interactive-hover: #0891b2;
  --interactive-active: #0e7490;

  --status-success: #22c55e;
  --status-warning: #f59e0b;
  --status-danger: #ef4444;
  --status-info: #6366f1;
}
```

## 3. التباعد

```css
:root {
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;
  --space-16: 4rem;
}
```

## 4. الخطوط

```css
:root {
  --font-sans: 'IBM Plex Sans Arabic', system-ui, sans-serif;
  --font-mono: 'IBM Plex Mono', monospace;

  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 2rem;
  --text-4xl: 2.5rem;

  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-full: 9999px;
}
```

## 5. استخدام التوكنز

```css
/* ❌ لا تستخدم قيم مباشرة */
.button { background: #06b6d4; }

/* ✅ استخدم التوكنز */
.button { background: var(--interactive-primary); }
```
