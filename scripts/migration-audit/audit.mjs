#!/usr/bin/env node
/**
 * BrightAI Migration Audit — فحص اكتمال ترحيل HTML → Astro
 * يقارن محتوى HTML الأصلي (من git history) بصفحات Astro الحالية
 * ويتحقق من اكتمال الأقسام والعناصر والروابط.
 *
 * Usage: node scripts/migration-audit/audit.mjs
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, resolve, dirname } from 'path';

const ROOT = resolve(import.meta.dirname, '../..');
const COMMIT = 'eaadccc7~1'; // commit قبل حذف ملفات HTML
const ASTRO_DIR = join(ROOT, 'src/pages');
const REPORT_DIR = join(ROOT, 'scripts/migration-audit');
const REPORT_FILE = join(REPORT_DIR, 'AUDIT-REPORT.md');

// ─── 1. HTML files mapping ───
const HTML_PAGES = [
  ['index.html', 'index.astro'],
  ['about/index.html', 'about/index.astro'],
  ['contact/index.html', 'contact/index.astro'],
  ['demo/index.html', 'demo/index.astro'],
  ['pricing/index.html', 'pricing/index.astro'],
  ['services/index.html', 'services/index.astro'],
  ['trust/index.html', 'trust/index.astro'],
  ['sitemap/index.html', 'sitemap/index.astro'],
  ['offline/index.html', 'offline/index.astro'],
  ['terms/index.html', 'terms/index.astro'],
  ['privacy-policy/index.html', 'privacy-policy/index.astro'],
  ['cookie-policy/index.html', 'cookie-policy/index.astro'],
  ['data-processing-agreement/index.html', 'data-processing-agreement/index.astro'],
  ['pdpl-statement/index.html', 'pdpl-statement/index.astro'],
  ['privacy-cookies/index.html', 'privacy-cookies/index.astro'],
  ['solutions/index.html', 'solutions/index.astro'],
  ['404.html', '404.astro'],
  ['assessment/ai-governance-readiness/index.html', 'assessment/ai-governance-readiness/index.astro'],
  ['authors/nasser-alabdullah/index.html', 'authors/[slug].astro'],
  ['hub/index.html', 'hub/index.astro'],
  ['hub/ai-governance/index.html', 'hub/[slug].astro'],
  ['hub/compliance/index.html', 'hub/[slug].astro'],
  ['hub/solutions/index.html', 'hub/[slug].astro'],
  ['hub/use-cases/index.html', 'hub/[slug].astro'],
  ['en/cookie-policy/index.html', 'en/cookie-policy/index.astro'],
  ['en/data-processing-agreement/index.html', 'en/data-processing-agreement/index.astro'],
  ['en/pdpl-statement/index.html', 'en/pdpl-statement/index.astro'],
  ['en/privacy-policy/index.html', 'en/privacy-policy/index.astro'],
  ['en/terms/index.html', 'en/terms/index.astro'],
  ['kernel/index.html', 'kernel/index.astro'],
  ['kernel/offline.html', 'kernel/offline.astro'],
];

// ─── 2. Section markers for content extraction ───
// نحدد علامات الأقسام في HTML الأصلي لنتمكن من مقارنتها
const SECTION_MARKERS = [
  'id="', 'class="hero', 'class="section', 'class="faq', 'class="cta',
  'class="footer', 'class="header', 'class="nav', 'class="features',
  'class="pricing', 'class="stats', 'class="trust', 'class="contact',
  'class="demo', 'class="solutions', 'class="about',
];

// ─── 3. Content extraction helpers ───

/** استخراج النص من HTML (إزالة الوسوم) */
function stripTags(html) {
  return html.replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** استخراج أقسام HTML حسب العلامات */
function extractHtmlSections(html) {
  const sections = {};
  for (const marker of SECTION_MARKERS) {
    const regex = new RegExp(`<[^>]*${marker}[^>]*>[\\s\\S]*?(?=<[^>]*${marker}|$)`, 'g');
    const matches = html.match(regex);
    if (matches) {
      const key = marker.replace(/[^a-zA-Z0-9]/g, '_');
      sections[key] = matches.join('\n');
    }
  }
  return sections;
}

/** مقارنة نصية بين محتوى HTML و Astro */
function compareTextualContent(htmlContent, astroContent) {
  const htmlText = stripTags(htmlContent);
  const astroText = stripTags(astroContent);

  // استخراج الجمل المهمة (أكثر من 30 حرف)
  const htmlSentences = htmlText.match(/[^.]+[.]/g)?.filter(s => s.trim().length > 30) || [];
  const astroSentences = astroText.match(/[^.]*[.]/g)?.filter(s => s.trim().length > 30) || [];

  const missing = [];
  for (const sentence of htmlSentences) {
    const trimmed = sentence.trim();
    const found = astroSentences.some(as => as.trim().includes(trimmed.slice(0, 40)));
    if (!found) {
      // تحقق أوسع
      const wordCount = trimmed.split(/\s+/).length;
      const astroWords = astroText.split(/\s+/);
      let matchCount = 0;
      const words = trimmed.split(/\s+/);
      for (const w of words) {
        if (w.length > 3 && astroWords.includes(w)) matchCount++;
      }
      if (matchCount < Math.max(3, words.length * 0.3)) {
        missing.push(trimmed.slice(0, 100));
      }
    }
  }

  const coverage = htmlSentences.length > 0
    ? Math.round(((htmlSentences.length - missing.length) / htmlSentences.length) * 100)
    : 50;

  return { coverage, missing, totalSentences: htmlSentences.length };
}

/** استخراج الروابط من HTML أو Astro */
function extractLinks(content) {
  const hrefRegex = /href=["']([^"']+)["']/g;
  const srcRegex = /src=["']([^"']+)["']/g;
  const links = [];
  let match;
  while ((match = hrefRegex.exec(content)) !== null) {
    links.push({ href: match[1], type: 'href' });
  }
  while ((match = srcRegex.exec(content)) !== null) {
    links.push({ href: match[1], type: 'src' });
  }
  return links;
}

/** فحص الروابط الداخلية */
function checkInternalLinks(links, astroFiles) {
  const broken = [];
  for (const link of links) {
    const href = link.href;
    if (href.startsWith('http') || href.startsWith('#') || href.startsWith('//')) continue;
    if (href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('data:')) continue;

    // تنظيف الرابط
    let cleanHref = href.split('?')[0].split('#')[0];
    if (cleanHref.endsWith('/')) cleanHref = cleanHref.slice(0, -1);
    if (cleanHref.endsWith('.html')) cleanHref = cleanHref.replace('.html', '');

    // تحويل لمسار Astro
    const astroPath = cleanHref === '' || cleanHref === '.' || cleanHref === './'
      ? 'index.astro'
      : `${cleanHref.replace(/^\//, '').replace(/index$/, '')}index.astro`;

    const exists = astroFiles.some(f => f.includes(astroPath) || f.includes(cleanHref));
    if (!exists && cleanHref.length > 1) {
      broken.push({ href: link.href, resolvedTarget: astroPath, issue: 'missing_astro_target' });
    }
  }
  return broken;
}

// ─── 4. Main audit function ───

async function auditMigration() {
  console.log('🔍 BrightAI Migration Audit — بدء الفحص...\n');

  // الحصول على قائمة ملفات Astro الموجودة
  const astroFiles = execSync(`find ${ASTRO_DIR} -name "*.astro"`, { encoding: 'utf8' })
    .split('\n')
    .filter(Boolean)
    .map(f => f.replace(ASTRO_DIR + '/', ''));

  console.log(`📄 عدد صفحات Astro: ${astroFiles.length}`);

  const results = [];

  for (const [htmlPath, astroRelPath] of HTML_PAGES) {
    const result = {
      htmlPath,
      astroPath: astroRelPath,
      status: 'unknown',
      htmlSize: 0,
      astroSize: 0,
      coverage: 0,
      missingSections: [],
      brokenLinks: [],
      notes: [],
    };

    // استخراج HTML الأصلي من git
    try {
      const htmlContent = execSync(
        `cd ${ROOT} && git show ${COMMIT}:${htmlPath} 2>/dev/null || echo "NOT_FOUND"`,
        { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 }
      );

      if (htmlContent.includes('NOT_FOUND') || !htmlContent.trim()) {
        result.status = 'missing_html_source';
        result.notes.push(`❌ ملف HTML الأصلي غير موجود: ${htmlPath}`);
        results.push(result);
        continue;
      }

      result.htmlSize = htmlContent.length;
      result.htmlContent = htmlContent; // للاستخدام الداخلي
    } catch (e) {
      result.status = 'missing_html_source';
      result.notes.push(`❌ فشل استخراج HTML: ${e.message}`);
      results.push(result);
      continue;
    }

    // محاولة تحويل مسار Astro للصحيح
    let astroFullPath = null;
    if (htmlPath.startsWith('kernel/')) {
      // ملفات kernel لها مسار مختلف
      const kernelFile = htmlPath.replace('kernel/', '').replace('.html', '.astro');
      const possiblePaths = [
        join(ASTRO_DIR, `kernel/${kernelFile}`),
        join(ASTRO_DIR, `kernel/[slug].astro`),
      ];
      for (const p of possiblePaths) {
        if (existsSync(p)) { astroFullPath = p; break; }
      }
    } else if (htmlPath.includes('hub/') && !htmlPath.endsWith('index.html')) {
      // صفحات hub الفرعية تستخدم [slug].astro
      astroFullPath = join(ASTRO_DIR, 'hub/[slug].astro');
    } else if (htmlPath.includes('solutions/') && !htmlPath.endsWith('solutions/index.html')) {
      // صفحات solutions الفرعية
      const parts = htmlPath.split('/');
      if (parts.length === 3) {
        astroFullPath = join(ASTRO_DIR, `solutions/[slug].astro`);
      } else if (parts.length === 4) {
        astroFullPath = join(ASTRO_DIR, `solutions/[sector]/[city].astro`);
      }
    } else {
      const possiblePath = join(ASTRO_DIR, astroRelPath);
      if (existsSync(possiblePath)) {
        astroFullPath = possiblePath;
      } else {
        // بحث عن المسار
        for (const af of astroFiles) {
          if (af === astroRelPath || af.endsWith(astroRelPath)) {
            astroFullPath = join(ASTRO_DIR, af);
            break;
          }
        }
      }
    }

    if (!astroFullPath || !existsSync(astroFullPath)) {
      result.status = 'missing_astro_page';
      result.notes.push(`❌ صفحة Astro غير موجودة: ${astroRelPath}`);
      results.push(result);
      continue;
    }

    // قراءة محتوى Astro
    try {
      const astroContent = readFileSync(astroFullPath, 'utf8');
      result.astroSize = astroContent.length;

      // استخراج أقسام HTML
      const htmlSections = extractHtmlSections(result.htmlContent);

      // مقارنة المحتوى النصي
      const textComparison = compareTextualContent(result.htmlContent, astroContent);
      result.coverage = textComparison.coverage;
      result.missingSections = textComparison.missing;

      // فحص الروابط في صفحة Astro
      const astroLinks = extractLinks(astroContent);
      result.brokenLinks = checkInternalLinks(astroLinks, astroFiles);

      // فحص وجود أقسام رئيسية
      const htmlHasHero = result.htmlContent.includes('hero') || result.htmlContent.includes('Hero');
      const astroHasHero = astroContent.includes('hero') || astroContent.includes('Hero');
      const htmlHasFAQ = result.htmlContent.includes('faq') || result.htmlContent.includes('FAQ');
      const astroHasFAQ = astroContent.includes('faq') || astroContent.includes('FAQ');
      const htmlHasCTA = result.htmlContent.includes('cta') || result.htmlContent.includes('CTA');
      const astroHasCTA = astroContent.includes('cta') || astroContent.includes('CTA');

      if (htmlHasHero && !astroHasHero) result.notes.push('⚠️ قسم hero غير موجود في Astro');
      if (htmlHasFAQ && !astroHasFAQ) result.notes.push('⚠️ قسم FAQ غير موجود في Astro');
      if (htmlHasCTA && !astroHasCTA) result.notes.push('⚠️ قسم CTA غير موجود في Astro');

      // تحديد الحالة النهائية
      if (result.coverage >= 85 && result.brokenLinks.length === 0) {
        result.status = 'complete';
      } else if (result.coverage >= 50) {
        result.status = 'partial';
      } else {
        result.status = 'missing_content';
      }

    } catch (e) {
      result.status = 'error_reading_astro';
      result.notes.push(`❌ خطأ في قراءة Astro: ${e.message}`);
    }

    results.push(result);
  }

  // ─── توليد التقرير ───

  generateReport(results, astroFiles);

  console.log('\n✅ تم الانتهاء من فحص الترحيل.');
}

function generateReport(results, astroFiles) {
  const complete = results.filter(r => r.status === 'complete');
  const partial = results.filter(r => r.status === 'partial');
  const missing = results.filter(r => r.status === 'missing_content');
  const missingPage = results.filter(r => r.status === 'missing_astro_page');
  const missingSource = results.filter(r => r.status === 'missing_html_source');
  const errors = results.filter(r => r.status === 'error_reading_astro');

  const totalPages = HTML_PAGES.length;

  let report = `# BrightAI Migration Audit Report

**Date:** ${new Date().toLocaleDateString('ar-SA')}
**Total Pages Checked:** ${totalPages}
**Astro Pages Found:** ${astroFiles.length}

---

## Summary

| Status | Count | Percentage |
|--------|-------|------------|
| ✅ Complete (≥85%) | ${complete.length} | ${Math.round(complete.length / totalPages * 100)}% |
| ⚠️ Partial (50-84%) | ${partial.length} | ${Math.round(partial.length / totalPages * 100)}% |
| ❌ Missing Content (<50%) | ${missing.length} | ${Math.round(missing.length / totalPages * 100)}% |
| ❌ Missing Astro Page | ${missingPage.length} | ${Math.round(missingPage.length / totalPages * 100)}% |
| ❌ Missing HTML Source | ${missingSource.length} | ${Math.round(missingSource.length / totalPages * 100)}% |
| ❌ Errors | ${errors.length} | ${Math.round(errors.length / totalPages * 100)}% |

---

## Detailed Results

`;

  // ترتيب النتائج حسب الحالة
  const ordered = [
    ...complete.sort((a, b) => b.coverage - a.coverage),
    ...partial.sort((a, b) => b.coverage - a.coverage),
    ...missing.sort((a, b) => b.coverage - a.coverage),
    ...missingPage,
    ...missingSource,
    ...errors,
  ];

  for (const r of ordered) {
    const statusEmoji = r.status === 'complete' ? '✅' :
      r.status === 'partial' ? '⚠️' :
      r.status === 'missing_content' ? '❌' :
      r.status === 'missing_astro_page' ? '🚫' :
      r.status === 'missing_html_source' ? '📂' : '❗';

    report += `### ${statusEmoji} ${r.htmlPath} → ${r.astroPath}\n\n`;
    report += `- **Status:** ${r.status}\n`;
    report += `- **Coverage:** ${r.coverage}%\n`;
    if (r.htmlSize) report += `- **HTML Size:** ${(r.htmlSize / 1024).toFixed(1)}KB\n`;
    if (r.astroSize) report += `- **Astro Size:** ${(r.astroSize / 1024).toFixed(1)}KB\n`;
    if (r.brokenLinks?.length > 0) {
      report += `- **Broken Links:** ${r.brokenLinks.length}\n`;
      for (const bl of r.brokenLinks.slice(0, 5)) {
        report += `  - \`${bl.href}\` → ${bl.resolvedTarget} (${bl.issue})\n`;
      }
      if (r.brokenLinks.length > 5) {
        report += `  - ... and ${r.brokenLinks.length - 5} more\n`;
      }
    }
    if (r.missingSections?.length > 0) {
      report += `- **Missing Content Samples:**\n`;
      for (const ms of r.missingSections.slice(0, 3)) {
        report += `  - \`${ms.slice(0, 80)}...\`\n`;
      }
      if (r.missingSections.length > 3) {
        report += `  - ... and ${r.missingSections.length - 3} more\n`;
      }
    }
    if (r.notes?.length > 0) {
      report += `- **Notes:**\n`;
      for (const n of r.notes) {
        report += `  - ${n}\n`;
      }
    }
    report += '\n';
  }

  // ─── Recommendations ───

  report += `---

## Recommendations

`;

  const needsFix = [...partial, ...missing, ...missingPage];
  if (needsFix.length === 0) {
    report += '🎉 **All pages are fully migrated!** No content remediation needed.\n';
  } else {
    report += '### Pages needing attention:\n\n';
    for (const r of needsFix) {
      report += `- ${r.htmlPath} → ${r.astroPath} (coverage: ${r.coverage}%)\n`;
    }
    report += '\n';
    report += '### Priority actions:\n\n';
    report += '1. Fix pages with < 85% coverage — add missing sections/content\n';
    report += '2. Resolve broken internal links\n';
    report += '3. Rebuild Astro pages with unified design system\n';
  }

  // Save report
  if (!existsSync(REPORT_DIR)) mkdirSync(REPORT_DIR, { recursive: true });
  writeFileSync(REPORT_FILE, report, 'utf8');
  console.log(`📄 Report saved: ${REPORT_FILE}`);
}

// Run
auditMigration().catch(console.error);