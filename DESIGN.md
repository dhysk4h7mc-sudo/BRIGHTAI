# BrightAI Design System v3 — Unified Design Reference

**Status:** Active | **Version:** 3.0 | **Last Updated:** 2026-06-26
**Stack:** Astro + CSS Custom Properties + Tailwind Utilities (minimal)
**Theme:** Dark Enterprise SaaS — RTL-first, Arabic-optimized

---

## 1. Design Philosophy

BrightAI هو نظام تشغيل أمن وحوكمة للذكاء الاصطناعي في المؤسسات السعودية. التصميم يعكس:
- **الثقة (Trust):** ألوان هادئة، زوايا ناعمة، مساحات مريحة
- **التقنية (Tech):** تدرجات لونية دقيقة، تأثيرات زجاجية، خلفيات متحركة
- **الامتثال (Compliance):** خطوط واضحة، تدرجات سلالم محكمة، بنية هيكلية

### Core Principles
1. **Dark-first**: خلفية داكنة (#060914) كمحور أساسي
2. **Glass morphism**: طبقات زجاجية بسطحية منظمة
3. **RTL-native**: كل الأنماط مبنية مع مراعاة الكتابة من اليمين لليسار
4. **Performance-safe**: حركات CSS فقط، لا JS ثقيل

---

## 2. Color System

### 2.1 Brand Palette (Cyan/Teal)

| Token | Value | Usage |
|-------|-------|-------|
| `--brand-50` | `#ecfeff` | Brand backgrounds light |
| `--brand-100` | `#cffafe` | Badge backgrounds |
| `--brand-300` | `#67e8f9` | Icons, accent borders |
| `--brand-400` | `#22d3ee` | Primary glow |
| `--brand-500` | `#06b6d4` | **Primary brand color** |
| `--brand-600` | `#0891b2` | Primary hover |
| `--brand-800` | `#155e75` | Secondary backgrounds |

### 2.2 Accent (Green)

| Token | Value | Usage |
|-------|-------|-------|
| `--accent-400` | `#4ade80` | Success indicators |
| `--accent-500` | `#22c55e` | **Accent green** |

### 2.3 Neutral

| Token | Value | Usage |
|-------|-------|-------|
| `--neutral-50` | `#f8fafc` | Text on dark |
| `--neutral-100` | `#f1f5f9` | Subtle text |
| `--neutral-300` | `#cbd5e1` | Secondary text |
| `--neutral-500` | `#64748b` | Muted text |
| `--neutral-800` | `#1e293b` | Card backgrounds |
| `--neutral-950` | `#060914` | **Base background** |

---

## 3. Typography

**Font family:** `'Segoe UI', 'Tahoma', 'Geneva', 'Verdana', sans-serif`
**Mono:** `ui-monospace, 'SF Mono', 'Menlo', 'Monaco', monospace`

| Token | Size | LH | Weight | Usage |
|-------|------|----|--------|-------|
| `--text-xs` | 0.75rem | 1.6 | 700 | Captions |
| `--text-sm` | 0.875rem | 1.7 | 600 | Meta |
| `--text-base` | 1rem | 1.8 | 400 | Body |
| `--text-lg` | 1.125rem | 1.8 | 500 | Lead |
| `--text-xl` | 1.25rem | 1.7 | 700 | Subtitles |
| `--text-2xl` | 1.5rem | 1.4 | 900 | H3 |
| `--text-3xl` | 1.875rem | 1.3 | 900 | H2 |
| `--text-4xl` | 2.25rem | 1.2 | 950 | H1 |

---

## 4. Spacing (8px base)

| Token | Rem | px |
|-------|-----|----|
| `--space-1` | 0.25rem | 4px |
| `--space-2` | 0.5rem | 8px |
| `--space-3` | 0.75rem | 12px |
| `--space-4` | 1rem | 16px |
| `--space-6` | 1.5rem | 24px |
| `--space-8` | 2rem | 32px |
| `--space-10` | 2.5rem | 40px |
| `--space-12` | 3rem | 48px |
| `--space-16` | 4rem | 64px |
| `--space-20` | 5rem | 80px |

---

## 5. Component Classes

| Class | Pattern | Usage |
|-------|---------|-------|
| `.btn--primary` | `linear-gradient(135deg, #5eead4, #38bdf8)` | Main CTA |
| `.btn--secondary` | `border:1px solid rgba(...), bg:rgba(15,23,42,0.62)` | Secondary CTA |
| `.btn--ghost` | `color:rgba(226,232,240,0.75)` | Tertiary |
| `.card--glass` | `bg:rgba(15,23,42,0.82), backdrop-filter:blur(20px)` | Feature cards |
| `.card--feature` | `border-color:rgba(20,184,166,0.18)` | Highlight cards |
| `.badge--brand` | `border:1px solid rgba(20,184,166,0.28)` | Brand badges |
| `.badge--accent` | `border:1px solid rgba(34,197,94,0.28)` | Success badges |
| `.section` | `padding: var(--space-16) 0` | Page sections |
| `.section--alt` | `bg:rgba(15,23,42,0.4)` | Alternate sections |
| `.container` | `max-width:1280px, mx:auto` | Content wrapper |
| `.page-hero` | `padding: var(--space-12) 0` | Inner page hero |

---

## 6. Background Pattern

```css
.bg-grid {
  background-image:
    radial-gradient(ellipse 80% 60% at 50% -10%, rgba(0,212,255,.18), transparent 60%),
    radial-gradient(ellipse 60% 50% at 90% 20%, rgba(124,92,255,.18), transparent 60%),
    linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px);
}
```

## 7. File Structure

```
src/styles/
  ├── tokens.css      # Design tokens + CSS custom properties
  ├── base.css        # Reset + base + typography
  ├── components.css  # All shared component styles
  ├── pages.css       # Page-specific styles (merged from old files)
  ├── utilities.css   # Helper classes
  ├── animations.css  # Keyframes + animation classes
  └── kernel.css      # Kernel-specific styles
```

## 8. Migration Notes

- Old files deleted: home.css, home-redesign.css, design-system.css, content-pages.css, inner-pages.css, layout.css, mobile.css, legal-pages.css, global.css
- Content consolidated into: components.css + pages.css
- Tailwind usage minimized — only for rapid prototyping utilities
- All colors use CSS custom properties
- RTL is default — use margin-inline-start/end
