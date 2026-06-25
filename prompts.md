ممتاز. بما إنك وافقت، فهنا **الـ7 prompts كاملة**، مكتوبة **بالإنجليزية بالكامل** ومصممة لتكون **neutral** لأي coding agent، مع مراعاة ما طلبته حرفيًا:

- **2 cleanup prompts**
- **5 execution prompts**
- **بدون حذف أي section**
- **بدون حذف أي content**
- **إعادة تصميم شاملة وحديثة**
- **3D خفيف + animation محسوب**
- **mobile-first + performance-first**
- **الـhero الجديد من مرجع 21st.dev**
- **الخلفية الجديدة من مرجع 21st.dev**
- **التركيز على SEO والفهرسة وزيادة الظهور والنقرات في السعودية**

وقد بُنيت هذه الـprompts على تحليل فعلي لهيكل المشروع الحالي + الصفحة الحية الحالية + مراجع 21st.dev المطلوبة [BrightAI](https://brightai.site) [21st.dev](https://21st.dev/community/components/serafim/splite/default) [21st.dev](https://21st.dev/community/components/efferd/dotted-surface/default)

---

# Prompt 1 — Cleanup Pass A: Remove legacy HTML-era assets safely without breaking Astro

```plaintext
BASE ROLE
You are a senior Astro migration engineer and frontend cleanup specialist. Your job is to perform a surgical cleanup of a partially migrated Astro codebase that still contains HTML-era residual assets and deployment leftovers. You must preserve all visible content, all sections, all routes, all SEO-critical output, and all business logic. You are NOT allowed to remove any current user-facing section or content.

DETAILED TECHNICAL INSTRUCTIONS
Project facts you must assume as verified:
- This is an Astro static site project using src/pages, src/layouts, src/components, src/styles, and public/.
- The design has already been partially migrated to Astro, but legacy HTML-era residual assets still exist.
- There is a root-level `frontend/` directory that is NOT legacy static HTML. Treat it as protected backend/runtime infrastructure unless proven otherwise.
- There is also `public/frontend/` containing CSS/JS leftovers from the old HTML era.
- There is a service worker in `public/sw.js` that still precaches legacy frontend asset paths.
- There are root-level legacy special files like `404.html` and `error.html` that must be audited against Astro-generated equivalents before any archival action.

Your mission:
1. Audit all references to legacy public asset paths, especially anything under:
   - `/frontend/css/`
   - `/frontend/js/`
   - `/frontend/images/`
   - `/frontend/assets/`
2. Identify which files in `public/frontend/` are still actually required by live Astro pages and which are dead leftovers.
3. Preserve required image/font assets if still referenced.
4. Remove or quarantine dead legacy CSS/JS safely.
5. Rewrite `public/sw.js` so it only precaches files that actually exist and are actually needed by the Astro site.
6. Verify that no page loses styling, interactivity, accessibility, or SEO-critical assets after cleanup.
7. Keep all current routes alive.
8. Do not touch the protected backend/runtime root `frontend/` directory unless you produce hard reference evidence and a safety plan.

Required execution process:
A. Build a dependency inventory first.
- Search all `src/`, `public/`, config files, scripts, and generated templates for references to `/frontend/`.
- Produce a file-by-file usage map.
- Separate:
  1) required legacy assets,
  2) removable dead assets,
  3) uncertain assets requiring quarantine instead of deletion.

B. Handle `public/frontend/` safely.
- If CSS/JS files are unreferenced, move them to a quarantine/archive folder instead of immediate permanent deletion.
- Preserve fonts and images still in use.
- Replace any remaining dependency on legacy JS with native Astro, CSS, or small framework-safe equivalents.

C. Repair `public/sw.js`.
- Remove broken precache entries.
- Ensure the service worker only caches real, existing, production-safe assets.
- Avoid caching stale non-existent legacy files.
- Keep offline behavior valid if offline support exists.

D. Handle root-level special files.
- Audit `404.html` and `error.html`.
- If Astro-generated 404 behavior already replaces them, archive legacy root-level copies safely instead of hard-deleting them.
- Do not remove `public/500.html` unless you verify production mapping and fallback behavior.

E. Final verification.
- Run full build.
- Confirm no styling regressions on homepage, docs, blog, solutions, kernel, contact, legal, and English pages.
- Confirm there are no console errors caused by missing legacy assets.
- Confirm service worker installs without failed requests.
- Confirm Lighthouse does not regress on mobile.

PROPOSED IMPROVEMENTS / OPTIMIZATIONS
- Replace legacy global JS behavior with Astro-native islands only where truly needed.
- Prefer CSS transitions and IntersectionObserver over monolithic old JS runtime files.
- Reduce total JS payload by eliminating dead legacy bundles.
- Ensure the cleanup improves cache correctness and reduces unnecessary network requests.
- Keep the output deployment-friendly for static hosting.

RISK WARNINGS
- The root-level `frontend/` directory is protected and must not be treated as disposable legacy HTML.
- Do not delete any images or fonts unless reference tracing proves they are unused.
- Do not break service worker registration or offline fallback.
- Do not remove any legal/special page handling without confirming route ownership.
- Do not silently change page semantics, route structure, or metadata.

LIST OF AFFECTED FILES
Focus especially on:
- `public/frontend/css/*`
- `public/frontend/js/*`
- `public/sw.js`
- `404.html`
- `error.html`
- `public/500.html`
- any `src/layouts/*`, `src/components/*`, `src/pages/*`, or `src/data/*` referencing legacy paths
- any config/scripts that still assume old HTML asset locations

ACCEPTANCE CRITERIA
- No current section or content is removed.
- No route is lost.
- No build errors occur.
- No live page references missing legacy CSS/JS files.
- Service worker precache contains only valid files.
- Legacy dead assets are archived/quarantined safely.
- Mobile performance is same or better than before.
- A clear cleanup inventory is produced with exact reasoning for every moved or removed file.

REQUIRED REPORT NAME
CLEANUP_PASS_A_LEGACY_ASSET_QUARANTINE_REPORT.md
```

---

# Prompt 2 — Cleanup Pass B: Remove code-level HTML migration residue and legacy animation dependencies

```plaintext
BASE ROLE
You are a senior Astro refactoring engineer focused on finishing the last 10% of a difficult migration from legacy HTML patterns to a fully Astro-native implementation. Your task is to remove code-level residue from the old stack without changing visible content, without deleting any section, and without breaking layout parity.

DETAILED TECHNICAL INSTRUCTIONS
Assume these facts are already verified:
- The site is now Astro-based and server-rendered/static-generated.
- Some migration residue still exists in code and content helpers.
- There is at least one legal-content source still using legacy AOS-style attributes and a script-loading pattern for old animation behavior.
- The site already has Astro components and CSS systems that can replace old HTML-era behavior.
- The cleanup must preserve exact visible text and exact section structure.

Your mission:
1. Find all remaining code-level traces of HTML-era implementation patterns, including:
   - `data-aos`
   - dynamic `loadScript(...)` for old animation libraries
   - references to vendor animation scripts from old frontend asset folders
   - leftover utility code written only to support old static HTML structure
2. Replace those patterns with Astro-native or CSS-native equivalents.
3. Reuse existing Astro animation/reveal components if available.
4. Keep all content exactly intact.
5. Improve maintainability by removing “ghost dependencies” on old HTML migration leftovers.

Required execution process:
A. Full residue audit.
- Search the codebase for:
  - `data-aos`
  - `AOS`
  - `loadScript(`
  - `/frontend/js/`
  - HTML fragment usage patterns
  - unsafe innerHTML patterns tied to old markup assumptions
- Produce an itemized list of every legacy residue occurrence.

B. Replace old animation dependency patterns.
- Remove dependency on old AOS or similar vendor animation systems.
- Replace them with:
  - Astro-friendly reveal wrappers,
  - CSS-only transitions,
  - small IntersectionObserver logic only if necessary,
  - full `prefers-reduced-motion` support.
- Preserve timing, hierarchy, and perceived polish, but reduce dependency complexity.

C. Audit configs and deployment leftovers.
- Review `redirects.json`, deployment config files, and any route-mapping artifacts for references to old HTML assumptions.
- Preserve working redirects.
- Remove only clearly obsolete HTML-era rules.
- Keep SEO-safe route behavior.

D. Archive migration artifacts safely.
- Review archival candidates such as:
  - `_archive/`
  - prompt scratch files
  - old analysis docs
  - temporary reports not needed for runtime
- Do not delete blindly.
- Organize them into a non-runtime archival structure if needed.

E. Verify parity.
- Build.
- Check homepage, legal pages, docs pages, blog pages, solutions pages, contact page, and English pages.
- Confirm no old animation library is still required for rendering.
- Confirm no content changed.

PROPOSED IMPROVEMENTS / OPTIMIZATIONS
- Consolidate reveal logic into one reusable Astro pattern.
- Reduce motion on touch devices and coarse pointers.
- Standardize animation timing tokens.
- Improve maintainability by removing hidden coupling to old vendor JS.
- Keep all UX enhancements lightweight and performance-aware.

RISK WARNINGS
- Do not rewrite legal or policy content.
- Do not alter heading text, route paths, canonical behavior, or schema output.
- Do not remove working redirects that still protect indexing.
- Do not change business copy, CTA labels, or page semantics.
- Do not delete archives without first proving they are not needed operationally.

LIST OF AFFECTED FILES
Focus especially on:
- `src/data/legal-content-inline.ts`
- any legal-page helpers
- any animation/reveal component in `src/components/`
- any layout injecting old scripts
- `redirects.json`
- deployment config files
- archival folders and migration leftovers

ACCEPTANCE CRITERIA
- No current visible content changes.
- No section is removed.
- No legacy AOS/vendor animation dependency remains in active page rendering.
- Motion behavior is Astro/CSS-native and accessibility-aware.
- Redirects and SEO behavior remain correct.
- Build succeeds cleanly.
- A residue inventory with actions taken is produced.

REQUIRED REPORT NAME
CLEANUP_PASS_B_CODE_RESIDUE_AND_DEPLOYMENT_HARDENING_REPORT.md
```

---

# Prompt 3 — Execution Pass 1: Build the new visual foundation and design system without changing content or sections

```plaintext
BASE ROLE
You are a senior product designer + Astro design systems engineer. Your task is to redesign the entire website into a modern, premium, human-centered, slightly 3D, animation-polished experience while preserving all current sections, all current content, all current information architecture, and all current business meaning.

DETAILED TECHNICAL INSTRUCTIONS
Non-negotiable constraints:
- Do NOT remove any existing section.
- Do NOT remove any current content.
- Do NOT reduce information density by hiding sections behind tabs or carousels unless the original section content remains fully accessible and indexable.
- The redesign must feel modern, premium, Saudi-enterprise-ready, trustworthy, and human rather than generic template-like.
- 3D and motion should be subtle, lightweight, and performance-safe.
- Mobile experience is a top priority.
- Performance, accessibility, and SEO must remain first-class.

Your mission:
1. Rebuild the entire visual foundation of the site using a new design language.
2. Keep content and section order intact.
3. Replace the old visual system completely.
4. Create a cohesive system that can scale across homepage, solutions, kernel, docs, blog, contact, pricing, hub, legal, and English pages.

Design direction:
- Premium enterprise AI platform
- Saudi market trust cues without cliché over-decoration
- Slight depth, layered surfaces, subtle glow, controlled glass effects
- Strong typography hierarchy
- Clear card systems
- Soft gradients with restrained neon accents
- Modern but credible, not gimmicky
- Human-centered layout rhythm
- Mobile-first spacing and interaction design

Implementation requirements:
A. Rebuild the design tokens.
- Define spacing scale, radius scale, shadow scale, border treatments, blur policy, surface hierarchy, section spacing, container widths, type scale, and motion timing.
- Use CSS variables or a token architecture that is easy to maintain.
- Introduce semantic color roles rather than ad hoc colors.
- Ensure Arabic typography rhythm is strong and legible.

B. Rebuild the CSS architecture.
- Refactor or replace existing visual-system files such as tokens, design-system, components, layout, home, inner-pages, and mobile styles as needed.
- Reduce duplication.
- Prefer a clear architecture over patching old styles endlessly.

C. Establish reusable premium patterns.
Create reusable styles/patterns for:
- section shells
- glass cards
- solid cards
- comparison tables
- pricing/plan cards
- badges/chips
- CTA rows
- trust strips
- stat blocks
- form fields
- sticky/floating UI elements
- docs/article content blocks
- blog cards
- hero support panels

D. Mobile-first rules.
- Optimize spacing, line lengths, button sizing, sticky elements, and card density for mobile first.
- Use responsive typography with `clamp()`.
- Make sure layouts remain premium on small screens, not merely collapsed.

E. Motion rules.
- Use lightweight motion.
- Respect `prefers-reduced-motion`.
- Reduce or disable heavy layered effects on touch devices.
- Keep animation elegant, not noisy.

F. No content changes.
- Preserve all current text, links, headings, CTAs, and sections.
- Only redesign presentation and structure at the component/layout level.

PROPOSED IMPROVEMENTS / OPTIMIZATIONS
- Introduce a scalable visual token system.
- Improve consistency between homepage and inner pages.
- Reduce CSS fragmentation.
- Improve perceived quality without introducing heavy runtime cost.
- Strengthen visual trust for enterprise buyers in Saudi Arabia.

RISK WARNINGS
- Do not accidentally rewrite copy during redesign.
- Do not remove sections because they feel “too long.”
- Do not overuse 3D, blur, or motion.
- Do not make the site visually impressive at the expense of speed.
- Do not make cards/text harder to scan on mobile.

LIST OF AFFECTED FILES
Likely affected:
- `src/styles/tokens.css`
- `src/styles/design-system.css`
- `src/styles/layout.css`
- `src/styles/components.css`
- `src/styles/home.css`
- `src/styles/inner-pages.css`
- `src/styles/mobile.css`
- reusable layout/component files in `src/layouts/` and `src/components/`

ACCEPTANCE CRITERIA
- All current sections and content remain present.
- The old design language is fully replaced.
- The site feels modern, premium, and human.
- Mobile design is first-class, not secondary.
- Motion is subtle and performance-safe.
- CSS architecture becomes more maintainable.
- No significant Lighthouse mobile regression occurs.
- A before/after design-system rationale is documented.

REQUIRED REPORT NAME
EXECUTION_PASS_1_VISUAL_FOUNDATION_AND_DESIGN_SYSTEM_V2_REPORT.md
```

---

# Prompt 4 — Execution Pass 2: Replace the current homepage hero with the real 21st.dev split/Spline-inspired implementation

```plaintext
BASE ROLE
You are a senior Astro + React integration engineer and premium hero-section designer. Your task is to replace the current homepage hero implementation with a faithful, production-safe adaptation of the 21st.dev split/Spline-inspired hero pattern while preserving the existing homepage hero content exactly.

DETAILED TECHNICAL INSTRUCTIONS
References you must use as design/implementation intent:
- 21st.dev component reference: serafim/splite/default
- Live site reference: the current homepage content already contains the approved hero copy, CTA structure, and positioning intent

Non-negotiable constraints:
- Keep the current homepage hero text exactly.
- Keep the current CTA destinations exactly unless a route is broken and you prove it.
- Keep the “Made in Saudi Arabia” trust chip or equivalent current trust marker.
- The hero must become visibly more premium and modern.
- The hero must remain fast and mobile-safe.
- No heavy 3D on low-end mobile.
- If Spline or equivalent scene rendering is too expensive for mobile, provide a graceful fallback.

Your mission:
1. Replace the current hero implementation with a real split-layout premium hero based on the referenced pattern.
2. Use the existing hero copy/content from the live site as the text column.
3. Use the visual scene area for the new premium hero visualization.
4. Integrate the scene in a way compatible with Astro production deployment.
5. Keep the experience elegant on both Arabic desktop and mobile.

Required execution process:
A. Study the current hero source first.
- Preserve exact copy, CTA labels, links, and semantic meaning.
- Preserve SEO-visible text in HTML.
- Do not move critical copy into canvas-only content.

B. Implement the referenced hero approach.
- Recreate the 21st.dev split/Spline visual architecture or a faithful equivalent.
- If the exact implementation requires React, create a minimal React island for the visual side only.
- Keep text content server-rendered in Astro.
- Use lazy hydration such as `client:visible` or equivalent where appropriate.
- Ensure no hydration is required for text content or LCP-critical copy.

C. Performance guards.
- For mobile, low-power, reduced-motion, or poor GPU environments:
  - reduce scene complexity,
  - pause interaction-heavy effects,
  - provide a static or simplified fallback,
  - preserve visual quality without hurting performance.
- Keep bundle impact under control.

D. Arabic layout excellence.
- Ensure the split layout works beautifully in RTL.
- Keep reading flow natural.
- Preserve CTA prominence and trust signals.

E. Validation.
- Confirm hero still contains the same message and actions.
- Confirm hero looks materially more premium than the current CSS-only approximation.
- Confirm no layout shift issues.
- Confirm good LCP behavior.

PROPOSED IMPROVEMENTS / OPTIMIZATIONS
- Keep hero copy fully crawlable in HTML.
- Use progressive enhancement for the visual scene.
- Provide a static poster/fallback image for mobile and reduced motion if needed.
- Make the hero feel flagship-level without turning it into a performance liability.

RISK WARNINGS
- Do not replace the current message.
- Do not move content into inaccessible visual-only layers.
- Do not hard-bind the whole hero to heavy client-side rendering.
- Do not let Spline/3D become the source of poor mobile performance.
- Do not break RTL spacing or CTA clarity.

LIST OF AFFECTED FILES
Likely affected:
- `src/components/SplitHero.astro`
- any new React visual hero component(s)
- `src/pages/index.astro`
- hero-specific style files or shared tokens
- any asset/config needed for the scene integration

ACCEPTANCE CRITERIA
- The existing hero content remains intact.
- The visual side is substantially upgraded using the referenced split/Spline style.
- The text remains server-rendered and SEO-safe.
- Mobile gets a controlled lightweight experience.
- Reduced-motion users get an accessible fallback.
- Homepage performance remains production-safe.
- A short technical note explains hydration strategy and fallback strategy.

REQUIRED REPORT NAME
EXECUTION_PASS_2_HOMEPAGE_HERO_SPLINE_REBUILD_REPORT.md
```

---

# Prompt 5 — Execution Pass 3: Replace the current global page background with the real dotted-surface concept and redesign all homepage sections

```plaintext
BASE ROLE
You are a senior Astro UI engineer, interaction designer, and homepage redesign specialist. Your task is to replace the current CSS-only dotted background approximation with a production-safe implementation inspired by the 21st.dev dotted-surface reference, then redesign every homepage section visually without removing any section or changing any text.

DETAILED TECHNICAL INSTRUCTIONS
References you must use as design intent:
- 21st.dev component reference: efferd/dotted-surface/default
- Live homepage structure and copy must remain intact

Non-negotiable constraints:
- Do NOT remove any homepage section.
- Do NOT change homepage text or CTA destinations.
- Do NOT alter section IDs if they are used for anchors/SEO/navigation.
- The background effect must remain subtle and elegant.
- Performance and mobile safety are mandatory.
- The redesign must feel significantly more modern than the current implementation.

Your mission:
1. Replace the current global dotted background implementation with a real dotted-surface style or a faithful production-safe equivalent.
2. Apply it globally or selectively where it improves the experience.
3. Redesign all homepage sections visually while preserving their content and order.

Required execution process:
A. Replace the background implementation.
- Study the current `DottedBackground` and replace the approximation with a more faithful dotted-surface implementation.
- If a React/Three.js island is required, isolate it carefully and hydrate only where justified.
- Use idle/visible hydration strategies where appropriate.
- Reduce complexity on mobile and touch devices.
- Respect `prefers-reduced-motion`.

B. Homepage section redesign.
Redesign all homepage sections, preserving their structure and content:
- trust signals
- problem
- AI governance center
- product
- layers
- governance choice
- compliance packs
- sectors
- evidence
- why BrightAI / comparison
- stats
- FAQ
- demo form
- final CTA
- important guides
- plus any current hero-adjacent section wrappers

For each section:
- create a clearer surface hierarchy,
- improve card design,
- improve contrast and legibility,
- improve visual rhythm,
- improve CTA clarity,
- add subtle premium depth,
- add lightweight motion only where beneficial,
- keep everything SEO-visible and crawlable.

C. Form and conversion polish.
- Improve the visual clarity of the homepage form and CTA areas.
- Preserve all fields and actions.
- Improve spacing, trust cues, and completion comfort on mobile.

D. Accessibility and performance.
- Maintain readable contrast.
- Keep text over textured/animated backgrounds legible.
- Avoid heavy GPU effects when not needed.
- Ensure the dotted background never harms content readability.

E. Final validation.
- Compare before/after visually.
- Ensure all sections still exist.
- Ensure no hidden content regression.
- Ensure the homepage is clearly better while still fast.

PROPOSED IMPROVEMENTS / OPTIMIZATIONS
- Use layered backgrounds only where they truly add value.
- Let cards and section wrappers carry most of the redesign weight.
- Reduce motion intensity below the “showcase demo” level and keep it product-grade.
- Improve trust and scannability for enterprise buyers.

RISK WARNINGS
- Do not let animated backgrounds overpower content.
- Do not degrade readability for the sake of aesthetics.
- Do not change conversion-critical copy.
- Do not break forms, FAQ behavior, anchors, or CTA targets.
- Do not apply the same visual treatment blindly to every section.

LIST OF AFFECTED FILES
Likely affected:
- `src/components/DottedBackground.astro`
- `src/pages/index.astro`
- homepage-related components
- `src/styles/home.css`
- shared surface/card/token styles
- any new background/visual integration components

ACCEPTANCE CRITERIA
- The homepage keeps all sections and content.
- The old homepage look is fully replaced.
- The new background implementation is more faithful to the dotted-surface intent.
- The homepage feels materially more premium and modern.
- Readability remains excellent.
- Mobile performance remains controlled.
- A section-by-section redesign summary is documented.

REQUIRED REPORT NAME
EXECUTION_PASS_3_HOMEPAGE_SECTION_REDESIGN_AND_DOTTED_SURFACE_REPORT.md
```

---

# Prompt 6 — Execution Pass 4: Redesign the rest of the website page-by-page without removing any section or content

```plaintext
BASE ROLE
You are a senior product UX engineer for Astro websites. Your task is to extend the new premium design system across the entire site page-by-page, preserving all current sections, all current content, all route structures, and all SEO-critical semantics.

DETAILED TECHNICAL INSTRUCTIONS
Non-negotiable constraints:
- No section removal anywhere.
- No content removal anywhere.
- No route restructuring unless absolutely required and explicitly justified.
- All pages must feel like one coherent modern product website.
- Mobile-first quality is mandatory.
- Performance must remain production-grade.
- Documentation/blog/legal readability must stay excellent.

Your mission:
Apply the redesign system comprehensively across the following page groups:
1. Homepage
2. Kernel pages
3. Solutions pages
4. Sector and city solution pages
5. Docs index and article pages
6. Blog index and article pages
7. Services, pricing, contact, about, demo, trust, assessment, hub
8. Legal pages
9. English pages

Required execution process:
A. Build page-group strategy.
For each page group, define:
- content density pattern,
- hero/banner pattern,
- navigation/breadcrumb pattern,
- CTA style,
- card/listing pattern,
- typography rhythm,
- mobile behavior.

B. Redesign shared shells.
- Header
- mobile navigation
- footer
- breadcrumbs
- side TOCs if present
- article shells
- listing pages
- forms
- trust blocks
- section wrappers

C. Docs and blog readability.
- Improve article reading width, heading rhythm, callout blocks, tables, code blocks if any, related links, and sticky navigation behavior.
- Preserve SEO semantics and article content.
- Maintain strong scanability in Arabic and English.

D. Solutions and conversion pages.
- Make solution pages feel high-value and enterprise-grade.
- Improve comparison surfaces, trust strips, sector-specific blocks, CTA transitions, and internal linking presentation.
- Keep all text intact.

E. Legal pages.
- Keep legal readability clean and calm.
- Remove leftover old animation dependencies if still present.
- Do not over-style legal content.

F. English parity.
- Ensure the English pages visually match the premium system and do not feel secondary.
- Preserve LTR correctness.

G. Final validation.
- Check all major templates on desktop and mobile.
- Verify that no page group remains visually “old.”
- Ensure all pages still contain the same content and sections.

PROPOSED IMPROVEMENTS / OPTIMIZATIONS
- Create shared page-shell primitives instead of styling each page ad hoc.
- Strengthen internal consistency across route families.
- Make conversion pages more premium without making docs/blog harder to read.
- Reduce duplicated style logic across page groups.

RISK WARNINGS
- Do not prioritize beauty over readability on docs/blog/legal content.
- Do not introduce fragile one-off page CSS that fights the system.
- Do not break dynamic route templates.
- Do not alter canonical or structured-data logic while restyling.
- Do not remove long-form content because it looks visually heavy.

LIST OF AFFECTED FILES
Likely affected:
- `src/layouts/BaseLayout.astro`
- `src/layouts/ArabicLayout.astro`
- `src/layouts/EnglishLayout.astro`
- `src/layouts/BlogLayout.astro`
- `src/layouts/DocsLayout.astro`
- `src/layouts/KernelLayout.astro`
- shared components in `src/components/*`
- multiple route templates in `src/pages/*`
- shared style files in `src/styles/*`

ACCEPTANCE CRITERIA
- All page groups adopt the new premium design language.
- No visible page remains on the old design system.
- No sections or content are removed.
- Docs/blog/legal pages remain highly readable.
- Arabic and English both feel production-grade.
- Mobile UX is consistently strong.
- A route-family-by-route-family summary is produced.

REQUIRED REPORT NAME
EXECUTION_PASS_4_FULL_SITE_PAGE_BY_PAGE_REDESIGN_REPORT.md
```

---

# Prompt 7 — Execution Pass 5: Deep audit for indexing, Saudi SEO, CTR improvement, mobile performance, and deployment/publish reliability

```plaintext
BASE ROLE
You are a senior technical SEO engineer, performance auditor, and deployment reliability specialist for Astro websites. Your task is to audit the fully redesigned site for indexing quality, Saudi SEO strength, CTR improvement opportunities, mobile performance, and publication reliability. You must identify why previous redesign attempts were not applied correctly or were not published successfully, then harden the delivery process.

DETAILED TECHNICAL INSTRUCTIONS
Business goals:
- Improve indexability and crawl consistency
- Improve CTR from Google results
- Strengthen relevance for Saudi Arabia
- Improve mobile performance
- Ensure deployment/publish reliability after redesign
- Preserve all existing content and sections

Your mission:
1. Audit the site’s technical SEO architecture after redesign.
2. Identify indexing blockers, duplicate-signal issues, weak title/meta patterns, internal-linking gaps, schema gaps, and localization gaps.
3. Improve CTR and relevance for Saudi traffic where appropriate.
4. Audit deployment reliability so the redesign actually ships cleanly.
5. Produce a prioritized action plan with exact file impact.

Required execution process:
A. Technical SEO audit.
Review and validate:
- canonical tags
- hreflang logic
- robots directives
- sitemap coverage
- structured data
- image indexing readiness
- internal links
- 404/500 behavior
- redirect hygiene
- Arabic/English route parity
- sector/city page indexability

B. CTR improvement audit.
Without changing core business meaning, improve:
- title tag patterns
- meta descriptions
- SERP clarity
- trust and specificity cues
- Saudi-market relevance language
- snippet attractiveness for high-intent pages

C. Saudi SEO emphasis.
Strengthen where justified:
- Saudi city relevance
- sector relevance
- Arabic search intent alignment
- internal linking toward high-value Saudi solution pages
- structured data fit for organization/product/local trust signals where appropriate

D. Mobile performance audit.
Run or approximate a production-grade review for:
- LCP
- CLS
- INP
- JavaScript cost
- image sizing
- font loading
- hero rendering weight
- background/rendering cost
- service worker correctness
- hydration scope

E. Publish/deployment reliability.
Investigate why prior redesign attempts may have “seemed applied but not actually published.”
Audit:
- build pipeline
- static output correctness
- asset hashing/paths
- stale service worker behavior
- deployment config assumptions
- caching invalidation issues
- redirects or hosting mismatch
- whether generated assets are actually referenced

F. Deliver fixes, not just findings.
Implement or propose exact corrective actions with priority ordering.

Output format required inside the report:
1. Critical blockers
2. High-impact SEO opportunities
3. CTR opportunities
4. Saudi-localization opportunities
5. Mobile performance risks
6. Deployment/publish reliability risks
7. Exact file changes required
8. Verification checklist after deployment

PROPOSED IMPROVEMENTS / OPTIMIZATIONS
- Tighten metadata quality for key money pages
- Improve internal linking to strategic sector/city pages
- strengthen crawl consistency across Arabic/English variants
- reduce hydration where it is not needed
- guard against stale SW/cached assets after deploy
- produce a post-deploy verification checklist for search and UX

RISK WARNINGS
- Do not mass-change metadata blindly across all pages without intent classification.
- Do not noindex useful pages accidentally.
- Do not over-localize pages in a spammy way.
- Do not degrade readability for SEO gimmicks.
- Do not assume deployment is correct just because local preview works.

LIST OF AFFECTED FILES
Review especially:
- `src/components/SEOHead.astro`
- `src/layouts/*`
- `astro.config.mjs`
- `public/robots.txt`
- `public/sitemap.xml`
- image sitemap generation and schema-related files
- service worker
- deployment config files
- route templates for solutions, sectors, cities, docs, blog, and English pages

ACCEPTANCE CRITERIA
- Clear indexing blockers are identified or ruled out.
- CTR opportunities are specific and actionable.
- Saudi SEO opportunities are concrete and non-spammy.
- Mobile performance risks are measured or strongly evidenced.
- Publish/deploy reliability issues are identified and hardened.
- The final output includes a prioritized implementation roadmap and verification checklist.

REQUIRED REPORT NAME
EXECUTION_PASS_5_SAUDI_SEO_PERFORMANCE_AND_DEPLOY_RELIABILITY_REPORT.md
```

---

## ملاحظات سريعة مهمة لك قبل الاستخدام

### 1) الترتيب الصحيح للتنفيذ
استخدمهم **بنفس الترتيب**:
**Prompt 1 → Prompt 2 → Prompt 3 → Prompt 4 → Prompt 5 → Prompt 6 → Prompt 7**

السبب:  
لو الوكيل بدأ بإعادة التصميم قبل إزالة الـlegacy residue والـservice worker problems، غالبًا سترجع نفس مشكلة:  
**“اتطبق لكن ما اتنشر”** أو يحصل **stale assets / cached old UI**.

### 2) أهم نقطة لازم تشدد عليها للوكيل
في بداية كل جلسة تنفيذ، أضف له هذه الجملة:

```plaintext
Do not stop at code changes only. You must verify the production build output, trace actual referenced assets, and confirm that the final rendered site reflects the redesign rather than only modifying source files.
```

### 3) الجملة التي تمنع حذف الأقسام
ولو عايز تشدد أكثر، أضف هذه الجملة أيضًا:

```plaintext
Any solution that removes, merges away, hides, collapses, or discards an existing section or existing content is invalid.
```

### 4) ليه البرومبتز دي أقوى من المحاولات السابقة؟
لأنها لا تقول فقط “redesign the website”، بل تفصل:
- **ما الذي يجب حمايته**
- **ما الذي يجب تنظيفه**
- **ما الذي يجب إعادة بنائه**
- **ما الذي يجب التحقق منه بعد النشر**
- **وما اسم التقرير المطلوب من الوكيل**

وده بيقلل جدًا من احتمالية إن الوكيل:
- يشتغل cosmetic فقط
- يغير source files بدون ما يتحقق من build output
- يسيب legacy assets شغالة
- أو يحذف sections علشان “يحسن UX”

---

إذا تحب، الخطوة التالية أقدر أعمل لك واحد من الخيارين:

**الخيار الأول:** أحوّلهم فورًا إلى **نسخة أقوى جدًا للـCursor/Claude Code** بصياغة أشد وحزم أكثر.  
**الخيار الثاني:** أعمل لك **Master Prompt واحد** يدير الوكيل عبر كل المراحل السبعة تلقائيًا مع checkpoints صارمة.

لو تريد هذا، قل لي فقط:  
**“حوّلها إلى Master Prompt”**  
أو  
**“خصّصها لـ Cursor/Claude Code”**