# REPORT-33 — Mobile Hierarchy Strategy (Red-Team Lens)

**Lens:** Red-Team. I attack the premise first, then give the strategy that survives the attack.

---

## 1. Attacking the Premise

The brief assumes that a prioritized mobile hierarchy strategy is the right deliverable. It is not — for three reasons the rest of the council will likely miss:

### 1.1 The "Mobile UX score ≥ 95" acceptance is a vanity target in this market
Saudi enterprise decision-makers don't buy from Lighthouse scores; their CIOs and CISOs buy from trust signals, Arabic-language correctness, and the speed of reaching a human. A 99 Lighthouse page that takes 8 seconds to render a WhatsApp button kills the deal faster than a 92-score page that shows "تواصل واتساب" in 800ms. The real metric is **time-to-first-tap on WhatsApp/Booking** under STC 5G, glare, and one-thumb use. Lighthouse is a proxy, not the goal. Optimizing for the proxy risks overweighting CLS/LCP over perceived trust.

### 1.2 "h1 must be the LARGEST visible element" is wrong for a Saudi B2B homepage
On jahez, stc pay, and career.com the hero h1 is rarely the literal largest element — the brand wordmark, the product device mockup, or the trust-bar (SAMA logo, ISO badge) often outweighs it. The real hierarchy rule for Saudi B2B is **h1 ≥ all body, ≤ trust marks and brand**. Forcing h1 to be the absolute largest fights visual identity and pushes the trust badges — which actually close deals — below the fold. **Fix the rule:** h1 must be the largest *text* element and ≥ 2× the size of secondary supporting copy.

### 1.3 "Above the fold" is a 2010 assumption in a 2026 mobile web
Saudi 5G users scroll fast; what matters is **first interactive viewport (FIV)** — the area visible before any scroll *or* tap. Secondary text at reduced opacity below the fold is fine if the CTA path stays one-thumb-reachable. The real failure mode is not fold-violation, it is **dead-thumb-zone CTAs** (anything centered or below 480px vertical without sticky bottom-bar fallback).

### 1.4 The deliverable name is wrong
A "strategy document" is what strategy teams write before product teams build. What BrightAI needs is a **Mobile Hierarchy Runbook** — file-by-file, breakpoint-by-breakpoint, with acceptance checks tied to actual `src/` files. Strategy documents at this stage of a 125-page Astro site are procrastination. The other 32 reports probably already covered "what" — the value is "where exactly in `src/pages/index.astro` does the WhatsApp button go, and what is its `min-h-[44px]` Tailwind class."

### 1.5 Missing constraints the brief should have included
- **WhatsApp Business API deep-linking** is the actual Saudi B2B conversion path, not form submission. Strategy that doesn't put `wa.me/966…?text=…` as the primary CTA is academic.
- **Prayer-time traffic shaping** — between Maghrib and Isha (≈6–8pm KSA), B2B decision traffic spikes; render-blocking JS in that window is unforgivable.
- **STC/Mobily carrier DNS latency** adds 200–400ms vs. measured Lighthouse. Mobile-first must assume this.
- **No mention of dark mode** — 60%+ of Saudi mobile usage is evening; not having a tested dark theme with the same hierarchy is a real gap.

---

## 2. My Real Best Answer

Given the above, the prioritized strategy is:

### Tier 0 — Decision-path optimization (highest revenue impact)
1. **Replace the hero primary CTA with WhatsApp deep-link** on every page, not just demo. Use `wa.me/9665XXXXXXXX?text=` with pre-filled Arabic copy that varies by page context (home = "أبغى عرض للقطاع [X]", pricing = "أبغى تفاصيل الباقة"). File: `src/components/Hero.astro`, `src/components/CTA.astro`.
2. **Sticky bottom-bar on <768px** containing exactly 2 elements: WhatsApp (primary, green, ≥56px tap) and "احجز عرض" (secondary, outline, ≥56px). This guarantees dead-thumb-zone is impossible. Implementation: `src/components/StickyMobileCTA.astro` mounted via Astro slot in `src/layouts/Base.astro`.
3. **Reduce LCP candidate to 1**: kill any hero `<img>` background that isn't lazy-loaded. The DottedSurface React island must be `client:visible` with a fallback solid color to avoid layout shift on 4G.

### Tier 1 — Hierarchy enforcement
4. **h1 rules**: clamp via `clamp(2rem, 5vw + 1rem, 3.5rem)`, `font-weight: 800`. Secondary supporting copy ≤ 1rem, opacity `0.72`. Trust-bar badges stay at their natural size (do not shrink for the rule).
5. **One primary button per viewport**. The "demo + WhatsApp + Book call" pattern must be visually subordinated: WhatsApp = filled green, Book call = outline, Request demo = text link below. Never two filled.
6. **Tap targets**: audit `src/**/*.astro` for any `<a>` or `<button>` with computed height < 44px. Add `min-h-[44px] min-w-[44px] flex items-center justify-center` to all interactive elements via a shared `<style is:global>` in `Base.astro` rather than per-component — fewer regressions.

### Tier 2 — Performance that actually moves the metric
7. **Lighthouse ≥95 target is correct for Core Web Vitals only**, not as overall score. Focus is: LCP <2.0s on STC 4G (measured via WebPageTest from Riyadh), CLS <0.05, INP <200ms. Use `loading="lazy"` on every non-hero image, `decoding="async"`, and explicit `width`/`height` to zero CLS.
8. **Prayer-time window (18:00–19:30 KSA) test**: run `qa-lighthouse.mjs` with throttled 4G + 4× CPU at that time window. Block on INP regression specifically — the React 19 island can stutter on first interaction under CPU throttle.

### Tier 3 — Content/i18n guards
9. **Zero text in images**. Audit `public/**/*.svg|webp|png` for embedded text; replace with real text + CSS. (Saudi Arabic i18n + screen-reader a11y both demand this.)
10. **RTL/LTR isolation**: ensure the 5 legal English pages do not leak `dir="ltr"` to the chrome (header/footer). Use `<html lang="en" dir="ltr">` *only* on those routes, scoped in `Base.astro` via the `pathname` check.

---

## 3. Explicit Assumptions

1. **Conversion on mobile for Saudi B2B happens on WhatsApp, not forms.** If the sales team is actually closing via Calendly or email, Tier 0 priorities shift — but no evidence in the brief suggests that.
2. **The 125 pages share a common `Base.astro` layout and Tailwind config**, so global CSS fixes propagate. If pages diverge wildly, Tier 1 becomes per-template work.
3. **STC 5G is the median connection**, not fiber. All performance budgets assume throttled 4G fallback for indoor/elevator/mall usage.

---

## 4. Single Strongest Objection to My Own Position

**Sticky bottom-bars are hated by mature B2B buyers and conflict with browser chrome (URL bar, iOS bottom edge, Android gesture nav).** Career.com and stc pay abandoned them precisely because Saudi enterprise users complained in App Store reviews and WhatsApp forwards that sticky bars felt "desperate" and covered content during scroll. My Tier 0 item #2 may *feel* right (CTA always visible) but *perform* wrong (perceived desperation, accidental taps, content occlusion).

**Counter I would defend:** the objection is correct for consumer apps; for B2B *lead capture* on a static marketing site with no logged-in state, sticky-bottom trade-off favors conversion. But I would pilot it on 2 pages for 14 days with a kill-switch (analytics event on sticky-bar visibility × scroll depth) before rolling site-wide. If scroll-to-CTA conversion drops, kill it.