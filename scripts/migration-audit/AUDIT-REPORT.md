# BrightAI Migration Audit Report

**Date:** ٢٦‏/٦‏/٢٠٢٦
**Total Pages Checked:** 31
**Astro Pages Found:** 36

---

## Summary

| Status | Count | Percentage |
|--------|-------|------------|
| ✅ Complete (≥85%) | 0 | 0% |
| ⚠️ Partial (50-84%) | 1 | 3% |
| ❌ Missing Content (<50%) | 30 | 97% |
| ❌ Missing Astro Page | 0 | 0% |
| ❌ Missing HTML Source | 0 | 0% |
| ❌ Errors | 0 | 0% |

---

## Detailed Results

### ⚠️ demo/index.html → demo/index.astro

- **Status:** partial
- **Coverage:** 54%
- **HTML Size:** 35.5KB
- **Astro Size:** 22.3KB
- **Broken Links:** 39
  - `/contact/` → contactindex.astro (missing_astro_target)
  - `/icons.svg#mdi-calendar-check` → icons.svgindex.astro (missing_astro_target)
  - `/icons.svg#mdi-whatsapp` → icons.svgindex.astro (missing_astro_target)
  - `/contact/` → contactindex.astro (missing_astro_target)
  - `/contact/` → contactindex.astro (missing_astro_target)
  - ... and 34 more
- **Missing Content Samples:**
  - `dataLayer || []; function gtag(){dataLayer....`
  - `org", "@graph": [ { "@type": [ "Organization", "LocalBusiness" ], "@id": "https:...`
  - `site/#website", "url": "https://brightai....`
  - ... and 62 more

### ❌ authors/nasser-alabdullah/index.html → authors/[slug].astro

- **Status:** missing_content
- **Coverage:** 37%
- **HTML Size:** 13.3KB
- **Astro Size:** 7.5KB
- **Broken Links:** 1
  - `/frontend/assets/images/authors/nasser-alabdullah.svg` → frontend/assets/images/authors/nasser-alabdullah.svgindex.astro (missing_astro_target)
- **Missing Content Samples:**
  - `org", "@type": "Person", "@id": "https://brightai....`
  - `site/authors/nasser-alabdullah/#person", "name": "م....`
  - `ناصر العبدالله", "url": "https://brightai....`
  - ... and 43 more
- **Notes:**
  - ⚠️ قسم hero غير موجود في Astro

### ❌ pricing/index.html → pricing/index.astro

- **Status:** missing_content
- **Coverage:** 36%
- **HTML Size:** 40.7KB
- **Astro Size:** 12.5KB
- **Broken Links:** 11
  - `/contact/` → contactindex.astro (missing_astro_target)
  - `/contact/` → contactindex.astro (missing_astro_target)
  - `/services/` → servicesindex.astro (missing_astro_target)
  - `/services/` → servicesindex.astro (missing_astro_target)
  - `/services/` → servicesindex.astro (missing_astro_target)
  - ... and 6 more
- **Missing Content Samples:**
  - `dataLayer || []; function gtag(){dataLayer....`
  - `org", "@type": "BreadcrumbList", "@id": "https://brightai....`
  - `site/pricing/#breadcrumb", "itemListElement": [ { "@type": "ListItem", "position...`
  - ... and 93 more
- **Notes:**
  - ⚠️ قسم hero غير موجود في Astro
  - ⚠️ قسم CTA غير موجود في Astro

### ❌ services/index.html → services/index.astro

- **Status:** missing_content
- **Coverage:** 32%
- **HTML Size:** 50.5KB
- **Astro Size:** 14.8KB
- **Broken Links:** 20
  - `/icons.svg#mdi-cogs` → icons.svgindex.astro (missing_astro_target)
  - `/contact/` → contactindex.astro (missing_astro_target)
  - `/icons.svg#mdi-calendar-check` → icons.svgindex.astro (missing_astro_target)
  - `/icons.svg#mdi-whatsapp` → icons.svgindex.astro (missing_astro_target)
  - `/solutions/government-ai-governance/` → solutions/government-ai-governanceindex.astro (missing_astro_target)
  - ... and 15 more
- **Missing Content Samples:**
  - `dataLayer || []; function gtag(){dataLayer....`
  - `woff2) format("woff2"),url(/frontend/assets/fonts/TheYearofTheCamel-Medium....`
  - `otf) format("opentype");font-weight:400 900;font-style:normal;font-display:swap}...`
  - ... and 112 more

### ❌ index.html → index.astro

- **Status:** missing_content
- **Coverage:** 31%
- **HTML Size:** 133.6KB
- **Astro Size:** 61.4KB
- **Broken Links:** 113
  - `/icons.svg#mdi-shield-home` → icons.svgindex.astro (missing_astro_target)
  - `/icons.svg#mdi-shield-half-full` → icons.svgindex.astro (missing_astro_target)
  - `/icons.svg#mdi-brain` → icons.svgindex.astro (missing_astro_target)
  - `/icons.svg#mdi-medical-bag` → icons.svgindex.astro (missing_astro_target)
  - `/icons.svg#mdi-file-document-outline` → icons.svgindex.astro (missing_astro_target)
  - ... and 108 more
- **Missing Content Samples:**
  - `dataLayer || []; function gtag(){dataLayer....`
  - `push(arguments);} gtag('js', new Date()); gtag('config', 'G-8LLESL207Q'); منصة ح...`
  - `bg-grid { background-image: radial-gradient(ellipse 80% 60% at 50% -10%, rgba(0,...`
  - ... and 294 more

### ❌ trust/index.html → trust/index.astro

- **Status:** missing_content
- **Coverage:** 31%
- **HTML Size:** 65.9KB
- **Astro Size:** 11.4KB
- **Broken Links:** 20
  - `/contact/` → contactindex.astro (missing_astro_target)
  - `/contact/` → contactindex.astro (missing_astro_target)
  - `/solutions/ai-firewall/` → solutions/ai-firewallindex.astro (missing_astro_target)
  - `/solutions/ai-audit-trail/` → solutions/ai-audit-trailindex.astro (missing_astro_target)
  - `/solutions/human-approval-layer/` → solutions/human-approval-layerindex.astro (missing_astro_target)
  - ... and 15 more
- **Missing Content Samples:**
  - `dataLayer || []; function gtag(){dataLayer....`
  - `org", "@type": "BreadcrumbList", "itemListElement": [ { "@type": "ListItem", "po...`
  - `site/" }, { "@type": "ListItem", "position": 2, "name": "مركز الثقة والأمان", "i...`
  - ... and 126 more
- **Notes:**
  - ⚠️ قسم hero غير موجود في Astro
  - ⚠️ قسم CTA غير موجود في Astro

### ❌ assessment/ai-governance-readiness/index.html → assessment/ai-governance-readiness/index.astro

- **Status:** missing_content
- **Coverage:** 26%
- **HTML Size:** 56.5KB
- **Astro Size:** 16.8KB
- **Broken Links:** 14
  - `/icons.svg#mdi-clipboard-check` → icons.svgindex.astro (missing_astro_target)
  - `/icons.svg#mdi-play-circle` → icons.svgindex.astro (missing_astro_target)
  - `/contact/` → contactindex.astro (missing_astro_target)
  - `/icons.svg#mdi-email` → icons.svgindex.astro (missing_astro_target)
  - `/icons.svg#mdi-server` → icons.svgindex.astro (missing_astro_target)
  - ... and 9 more
- **Missing Content Samples:**
  - `dataLayer || []; function gtag(){dataLayer....`
  - `org", "@type": "BreadcrumbList", "itemListElement": [ { "@type": "ListItem", "po...`
  - `site/" }, { "@type": "ListItem", "position": 2, "name": "تقييم الجاهزية", "item"...`
  - ... and 130 more

### ❌ solutions/index.html → solutions/index.astro

- **Status:** missing_content
- **Coverage:** 25%
- **HTML Size:** 38.9KB
- **Astro Size:** 11.3KB
- **Broken Links:** 29
  - `/icons.svg#mdi-wrench` → icons.svgindex.astro (missing_astro_target)
  - `/icons.svg#mdi-lightning-bolt` → icons.svgindex.astro (missing_astro_target)
  - `/icons.svg#mdi-check-circle` → icons.svgindex.astro (missing_astro_target)
  - `/solutions/ai-firewall/` → solutions/ai-firewallindex.astro (missing_astro_target)
  - `/solutions/ai-audit-trail/` → solutions/ai-audit-trailindex.astro (missing_astro_target)
  - ... and 24 more
- **Missing Content Samples:**
  - `dataLayer || []; function gtag(){dataLayer....`
  - `woff2) format("woff2"),url(/frontend/assets/fonts/TheYearofTheCamel-Medium....`
  - `otf) format("opentype");font-weight:400 900;font-style:normal;font-display:swap}...`
  - ... and 131 more

### ❌ contact/index.html → contact/index.astro

- **Status:** missing_content
- **Coverage:** 23%
- **HTML Size:** 58.1KB
- **Astro Size:** 14.1KB
- **Broken Links:** 15
  - `/icons.svg#mdi-message-text` → icons.svgindex.astro (missing_astro_target)
  - `/icons.svg#mdi-whatsapp` → icons.svgindex.astro (missing_astro_target)
  - `/icons.svg#mdi-email` → icons.svgindex.astro (missing_astro_target)
  - `/icons.svg#mdi-map-marker` → icons.svgindex.astro (missing_astro_target)
  - `/icons.svg#mdi-send` → icons.svgindex.astro (missing_astro_target)
  - ... and 10 more
- **Missing Content Samples:**
  - `dataLayer || []; function gtag(){dataLayer....`
  - `push(arguments);} gtag('js', new Date()); gtag('config', 'G-8LLESL207Q'); احجز ع...`
  - `woff2) format("woff2"),url(/frontend/assets/fonts/TheYearofTheCamel-Medium....`
  - ... and 160 more
- **Notes:**
  - ⚠️ قسم CTA غير موجود في Astro

### ❌ about/index.html → about/index.astro

- **Status:** missing_content
- **Coverage:** 18%
- **HTML Size:** 62.7KB
- **Astro Size:** 20.0KB
- **Broken Links:** 9
  - `/icons.svg#mdi-flag` → icons.svgindex.astro (missing_astro_target)
  - `/contact/` → contactindex.astro (missing_astro_target)
  - `/icons.svg#mdi-calendar-check` → icons.svgindex.astro (missing_astro_target)
  - `/icons.svg#mdi-whatsapp` → icons.svgindex.astro (missing_astro_target)
  - `/contact/` → contactindex.astro (missing_astro_target)
  - ... and 4 more
- **Missing Content Samples:**
  - `dataLayer || []; function gtag(){dataLayer....`
  - `push(arguments);} gtag('js', new Date()); gtag('config', 'G-8LLESL207Q'); window...`
  - `addEventListener('load', function() { requestIdleCallback(function() { (function...`
  - ... and 206 more

### ❌ kernel/index.html → kernel/index.astro

- **Status:** missing_content
- **Coverage:** 14%
- **HTML Size:** 40.5KB
- **Astro Size:** 18.4KB
- **Broken Links:** 19
  - `/kernel/chat/` → kernel/chatindex.astro (missing_astro_target)
  - `/kernel/approvals/` → kernel/approvalsindex.astro (missing_astro_target)
  - `/kernel/audit/` → kernel/auditindex.astro (missing_astro_target)
  - `/kernel/reports/` → kernel/reportsindex.astro (missing_astro_target)
  - `/kernel/scenarios/` → kernel/scenariosindex.astro (missing_astro_target)
  - ... and 14 more
- **Missing Content Samples:**
  - `dataLayer || []; function gtag() { dataLayer....`
  - `org", "@graph": [ { "@type": [ "Organization", "LocalBusiness" ], "@id": "https:...`
  - `site/#organization", "name": "BrightAI", "url": "https://brightai....`
  - ... and 130 more

### ❌ sitemap/index.html → sitemap/index.astro

- **Status:** missing_content
- **Coverage:** 11%
- **HTML Size:** 44.9KB
- **Astro Size:** 11.3KB
- **Broken Links:** 3
  - `/icons.svg#mdi-map` → icons.svgindex.astro (missing_astro_target)
  - `/icons.svg#mdi-chevron-left` → icons.svgindex.astro (missing_astro_target)
  - `/icons.svg#mdi-whatsapp` → icons.svgindex.astro (missing_astro_target)
- **Missing Content Samples:**
  - `dataLayer || []; function gtag(){dataLayer....`
  - `push(arguments);} gtag('js', new Date()); gtag('config', 'G-8LLESL207Q'); خريطة ...`
  - `86); --border: rgba(255, 255, 255, 0....`
  - ... and 99 more

### ❌ hub/solutions/index.html → hub/[slug].astro

- **Status:** missing_content
- **Coverage:** 6%
- **HTML Size:** 35.5KB
- **Astro Size:** 6.7KB
- **Missing Content Samples:**
  - `dataLayer || []; function gtag(){dataLayer....`
  - `push(arguments);} gtag('js', new Date()); gtag('config', 'G-8LLESL207Q'); حلول ح...`
  - `woff2) format("woff2"),url(/frontend/assets/fonts/TheYearofTheCamel-Medium....`
  - ... and 146 more
- **Notes:**
  - ⚠️ قسم hero غير موجود في Astro
  - ⚠️ قسم CTA غير موجود في Astro

### ❌ 404.html → 404.astro

- **Status:** missing_content
- **Coverage:** 5%
- **HTML Size:** 23.7KB
- **Astro Size:** 5.3KB
- **Broken Links:** 6
  - `/icons.svg#mdi-map-marker-question-outline` → icons.svgindex.astro (missing_astro_target)
  - `/contact/` → contactindex.astro (missing_astro_target)
  - `/icons.svg#mdi-calendar-check` → icons.svgindex.astro (missing_astro_target)
  - `/icons.svg#mdi-arrow-right` → icons.svgindex.astro (missing_astro_target)
  - `/pricing/` → pricingindex.astro (missing_astro_target)
  - ... and 1 more
- **Missing Content Samples:**
  - `dataLayer || []; function gtag(){dataLayer....`
  - `push(arguments);} gtag('js', new Date()); gtag('config', 'G-8LLESL207Q'); الصفحة...`
  - `org", "@graph": [ { "@type": [ "Organization", "LocalBusiness" ], "@id": "https:...`
  - ... and 79 more
- **Notes:**
  - ⚠️ قسم CTA غير موجود في Astro

### ❌ hub/use-cases/index.html → hub/[slug].astro

- **Status:** missing_content
- **Coverage:** 5%
- **HTML Size:** 38.2KB
- **Astro Size:** 6.7KB
- **Missing Content Samples:**
  - `dataLayer || []; function gtag(){dataLayer....`
  - `push(arguments);} gtag('js', new Date()); gtag('config', 'G-8LLESL207Q'); حالات ...`
  - `woff2) format("woff2"),url(/frontend/assets/fonts/TheYearofTheCamel-Medium....`
  - ... and 159 more
- **Notes:**
  - ⚠️ قسم hero غير موجود في Astro
  - ⚠️ قسم FAQ غير موجود في Astro
  - ⚠️ قسم CTA غير موجود في Astro

### ❌ offline/index.html → offline/index.astro

- **Status:** missing_content
- **Coverage:** 4%
- **HTML Size:** 23.6KB
- **Astro Size:** 4.1KB
- **Broken Links:** 5
  - `/icons.svg#mdi-wifi-off` → icons.svgindex.astro (missing_astro_target)
  - `/icons.svg#mdi-cloud-off-outline` → icons.svgindex.astro (missing_astro_target)
  - `/icons.svg#mdi-archive-check-outline` → icons.svgindex.astro (missing_astro_target)
  - `/icons.svg#mdi-refresh` → icons.svgindex.astro (missing_astro_target)
  - `/icons.svg#mdi-home-outline` → icons.svgindex.astro (missing_astro_target)
- **Missing Content Samples:**
  - `dataLayer || []; function gtag(){dataLayer....`
  - `push(arguments);} gtag('js', new Date()); gtag('config', 'G-8LLESL207Q'); Bright...`
  - `14); --accent: #38bdf8; --accent-strong: #22c55e; } * { box-sizing: border-box; ...`
  - ... and 82 more
- **Notes:**
  - ⚠️ قسم CTA غير موجود في Astro

### ❌ hub/index.html → hub/index.astro

- **Status:** missing_content
- **Coverage:** 4%
- **HTML Size:** 26.5KB
- **Astro Size:** 3.4KB
- **Missing Content Samples:**
  - `dataLayer || []; function gtag(){dataLayer....`
  - `push(arguments);} gtag('js', new Date()); gtag('config', 'G-8LLESL207Q'); مراكز ...`
  - `woff2) format("woff2"),url(/frontend/assets/fonts/TheYearofTheCamel-Medium....`
  - ... and 99 more
- **Notes:**
  - ⚠️ قسم hero غير موجود في Astro
  - ⚠️ قسم FAQ غير موجود في Astro
  - ⚠️ قسم CTA غير موجود في Astro

### ❌ hub/compliance/index.html → hub/[slug].astro

- **Status:** missing_content
- **Coverage:** 3%
- **HTML Size:** 40.5KB
- **Astro Size:** 6.7KB
- **Missing Content Samples:**
  - `dataLayer || []; function gtag(){dataLayer....`
  - `push(arguments);} gtag('js', new Date()); gtag('config', 'G-8LLESL207Q'); الامتث...`
  - `woff2) format("woff2"),url(/frontend/assets/fonts/TheYearofTheCamel-Medium....`
  - ... and 162 more
- **Notes:**
  - ⚠️ قسم hero غير موجود في Astro
  - ⚠️ قسم FAQ غير موجود في Astro
  - ⚠️ قسم CTA غير موجود في Astro

### ❌ hub/ai-governance/index.html → hub/[slug].astro

- **Status:** missing_content
- **Coverage:** 2%
- **HTML Size:** 68.2KB
- **Astro Size:** 6.7KB
- **Missing Content Samples:**
  - `dataLayer || []; function gtag() { dataLayer....`
  - `push(arguments); } gtag('js', new Date()); gtag('config', 'G-8LLESL207Q'); ما هي...`
  - `woff2) format("woff2"),url(/frontend/assets/fonts/TheYearofTheCamel-Medium....`
  - ... and 393 more
- **Notes:**
  - ⚠️ قسم hero غير موجود في Astro
  - ⚠️ قسم FAQ غير موجود في Astro
  - ⚠️ قسم CTA غير موجود في Astro

### ❌ terms/index.html → terms/index.astro

- **Status:** missing_content
- **Coverage:** 0%
- **HTML Size:** 34.2KB
- **Astro Size:** 1.1KB
- **Missing Content Samples:**
  - `dataLayer || []; function gtag(){dataLayer....`
  - `push(arguments);} gtag('js', new Date()); gtag('config', 'G-8LLESL207Q'); شروط ا...`
  - `woff2) format("woff2"),url(/frontend/assets/fonts/TheYearofTheCamel-Medium....`
  - ... and 152 more
- **Notes:**
  - ⚠️ قسم hero غير موجود في Astro
  - ⚠️ قسم FAQ غير موجود في Astro
  - ⚠️ قسم CTA غير موجود في Astro

### ❌ privacy-policy/index.html → privacy-policy/index.astro

- **Status:** missing_content
- **Coverage:** 0%
- **HTML Size:** 34.9KB
- **Astro Size:** 1.1KB
- **Missing Content Samples:**
  - `dataLayer || []; function gtag(){dataLayer....`
  - `push(arguments);} gtag('js', new Date()); gtag('config', 'G-8LLESL207Q'); سياسة ...`
  - `woff2) format("woff2"),url(/frontend/assets/fonts/TheYearofTheCamel-Medium....`
  - ... and 151 more
- **Notes:**
  - ⚠️ قسم hero غير موجود في Astro
  - ⚠️ قسم FAQ غير موجود في Astro
  - ⚠️ قسم CTA غير موجود في Astro

### ❌ cookie-policy/index.html → cookie-policy/index.astro

- **Status:** missing_content
- **Coverage:** 0%
- **HTML Size:** 39.2KB
- **Astro Size:** 1.1KB
- **Missing Content Samples:**
  - `dataLayer || []; function gtag(){dataLayer....`
  - `push(arguments);} gtag('js', new Date()); gtag('config', 'G-8LLESL207Q'); سياسة ...`
  - `woff2) format("woff2"),url(/frontend/assets/fonts/TheYearofTheCamel-Medium....`
  - ... and 205 more
- **Notes:**
  - ⚠️ قسم hero غير موجود في Astro
  - ⚠️ قسم FAQ غير موجود في Astro
  - ⚠️ قسم CTA غير موجود في Astro

### ❌ data-processing-agreement/index.html → data-processing-agreement/index.astro

- **Status:** missing_content
- **Coverage:** 0%
- **HTML Size:** 28.4KB
- **Astro Size:** 1.1KB
- **Missing Content Samples:**
  - `dataLayer || []; function gtag(){dataLayer....`
  - `push(arguments);} gtag('js', new Date()); gtag('config', 'G-8LLESL207Q'); اتفاقي...`
  - `woff2) format("woff2"),url(/frontend/assets/fonts/TheYearofTheCamel-Medium....`
  - ... and 100 more
- **Notes:**
  - ⚠️ قسم hero غير موجود في Astro
  - ⚠️ قسم CTA غير موجود في Astro

### ❌ pdpl-statement/index.html → pdpl-statement/index.astro

- **Status:** missing_content
- **Coverage:** 0%
- **HTML Size:** 29.3KB
- **Astro Size:** 1.1KB
- **Missing Content Samples:**
  - `dataLayer || []; function gtag(){dataLayer....`
  - `push(arguments);} gtag('js', new Date()); gtag('config', 'G-8LLESL207Q'); بيان ا...`
  - `woff2) format("woff2"),url(/frontend/assets/fonts/TheYearofTheCamel-Medium....`
  - ... and 99 more
- **Notes:**
  - ⚠️ قسم hero غير موجود في Astro
  - ⚠️ قسم CTA غير موجود في Astro

### ❌ privacy-cookies/index.html → privacy-cookies/index.astro

- **Status:** missing_content
- **Coverage:** 0%
- **HTML Size:** 45.9KB
- **Astro Size:** 1.0KB
- **Missing Content Samples:**
  - `dataLayer || []; function gtag(){dataLayer....`
  - `push(arguments);} gtag('js', new Date()); gtag('config', 'G-8LLESL207Q'); سياسة ...`
  - `appendChild(link); } function loadScript(src, callback) { var script = document....`
  - ... and 141 more
- **Notes:**
  - ⚠️ قسم hero غير موجود في Astro
  - ⚠️ قسم FAQ غير موجود في Astro
  - ⚠️ قسم CTA غير موجود في Astro

### ❌ en/cookie-policy/index.html → en/cookie-policy/index.astro

- **Status:** missing_content
- **Coverage:** 0%
- **HTML Size:** 28.2KB
- **Astro Size:** 1.1KB
- **Missing Content Samples:**
  - `dataLayer || []; function gtag(){dataLayer....`
  - `push(arguments);} gtag('js', new Date()); gtag('config', 'G-8LLESL207Q'); Bright...`
  - `woff2) format("woff2"),url(/frontend/assets/fonts/TheYearofTheCamel-Medium....`
  - ... and 102 more
- **Notes:**
  - ⚠️ قسم hero غير موجود في Astro
  - ⚠️ قسم CTA غير موجود في Astro

### ❌ en/data-processing-agreement/index.html → en/data-processing-agreement/index.astro

- **Status:** missing_content
- **Coverage:** 0%
- **HTML Size:** 28.5KB
- **Astro Size:** 1.2KB
- **Missing Content Samples:**
  - `dataLayer || []; function gtag(){dataLayer....`
  - `push(arguments);} gtag('js', new Date()); gtag('config', 'G-8LLESL207Q'); Bright...`
  - `woff2) format("woff2"),url(/frontend/assets/fonts/TheYearofTheCamel-Medium....`
  - ... and 101 more
- **Notes:**
  - ⚠️ قسم hero غير موجود في Astro
  - ⚠️ قسم CTA غير موجود في Astro

### ❌ en/pdpl-statement/index.html → en/pdpl-statement/index.astro

- **Status:** missing_content
- **Coverage:** 0%
- **HTML Size:** 28.4KB
- **Astro Size:** 1.1KB
- **Missing Content Samples:**
  - `dataLayer || []; function gtag(){dataLayer....`
  - `push(arguments);} gtag('js', new Date()); gtag('config', 'G-8LLESL207Q'); Bright...`
  - `woff2) format("woff2"),url(/frontend/assets/fonts/TheYearofTheCamel-Medium....`
  - ... and 101 more
- **Notes:**
  - ⚠️ قسم hero غير موجود في Astro
  - ⚠️ قسم CTA غير موجود في Astro

### ❌ en/privacy-policy/index.html → en/privacy-policy/index.astro

- **Status:** missing_content
- **Coverage:** 0%
- **HTML Size:** 29.9KB
- **Astro Size:** 1.1KB
- **Missing Content Samples:**
  - `dataLayer || []; function gtag(){dataLayer....`
  - `push(arguments);} gtag('js', new Date()); gtag('config', 'G-8LLESL207Q'); Bright...`
  - `woff2) format("woff2"),url(/frontend/assets/fonts/TheYearofTheCamel-Medium....`
  - ... and 106 more
- **Notes:**
  - ⚠️ قسم hero غير موجود في Astro
  - ⚠️ قسم CTA غير موجود في Astro

### ❌ en/terms/index.html → en/terms/index.astro

- **Status:** missing_content
- **Coverage:** 0%
- **HTML Size:** 29.8KB
- **Astro Size:** 1.1KB
- **Missing Content Samples:**
  - `dataLayer || []; function gtag(){dataLayer....`
  - `push(arguments);} gtag('js', new Date()); gtag('config', 'G-8LLESL207Q'); Bright...`
  - `woff2) format("woff2"),url(/frontend/assets/fonts/TheYearofTheCamel-Medium....`
  - ... and 104 more
- **Notes:**
  - ⚠️ قسم hero غير موجود في Astro
  - ⚠️ قسم CTA غير موجود في Astro

### ❌ kernel/offline.html → kernel/offline.astro

- **Status:** missing_content
- **Coverage:** 0%
- **HTML Size:** 9.2KB
- **Astro Size:** 0.4KB
- **Missing Content Samples:**
  - `dataLayer || []; function gtag() { dataLayer....`
  - `push(arguments); } gtag('js', new Date()); gtag('config', 'G-8LLESL207Q'); Brigh...`
  - `org", "@type": "DefinedTermSet", "@id": "https://brightai....`
  - ... and 26 more

---

## Recommendations

### Pages needing attention:

- demo/index.html → demo/index.astro (coverage: 54%)
- authors/nasser-alabdullah/index.html → authors/[slug].astro (coverage: 37%)
- pricing/index.html → pricing/index.astro (coverage: 36%)
- services/index.html → services/index.astro (coverage: 32%)
- index.html → index.astro (coverage: 31%)
- trust/index.html → trust/index.astro (coverage: 31%)
- assessment/ai-governance-readiness/index.html → assessment/ai-governance-readiness/index.astro (coverage: 26%)
- solutions/index.html → solutions/index.astro (coverage: 25%)
- contact/index.html → contact/index.astro (coverage: 23%)
- about/index.html → about/index.astro (coverage: 18%)
- kernel/index.html → kernel/index.astro (coverage: 14%)
- sitemap/index.html → sitemap/index.astro (coverage: 11%)
- hub/solutions/index.html → hub/[slug].astro (coverage: 6%)
- 404.html → 404.astro (coverage: 5%)
- hub/use-cases/index.html → hub/[slug].astro (coverage: 5%)
- offline/index.html → offline/index.astro (coverage: 4%)
- hub/index.html → hub/index.astro (coverage: 4%)
- hub/compliance/index.html → hub/[slug].astro (coverage: 3%)
- hub/ai-governance/index.html → hub/[slug].astro (coverage: 2%)
- terms/index.html → terms/index.astro (coverage: 0%)
- privacy-policy/index.html → privacy-policy/index.astro (coverage: 0%)
- cookie-policy/index.html → cookie-policy/index.astro (coverage: 0%)
- data-processing-agreement/index.html → data-processing-agreement/index.astro (coverage: 0%)
- pdpl-statement/index.html → pdpl-statement/index.astro (coverage: 0%)
- privacy-cookies/index.html → privacy-cookies/index.astro (coverage: 0%)
- en/cookie-policy/index.html → en/cookie-policy/index.astro (coverage: 0%)
- en/data-processing-agreement/index.html → en/data-processing-agreement/index.astro (coverage: 0%)
- en/pdpl-statement/index.html → en/pdpl-statement/index.astro (coverage: 0%)
- en/privacy-policy/index.html → en/privacy-policy/index.astro (coverage: 0%)
- en/terms/index.html → en/terms/index.astro (coverage: 0%)
- kernel/offline.html → kernel/offline.astro (coverage: 0%)

### Priority actions:

1. Fix pages with < 85% coverage — add missing sections/content
2. Resolve broken internal links
3. Rebuild Astro pages with unified design system
