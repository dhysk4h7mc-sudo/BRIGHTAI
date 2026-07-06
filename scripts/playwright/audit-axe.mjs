/**
 * axe-core audit script — REPORTS-18 a11y check.
 * Runs axe-core against the local dev build on multiple critical pages
 * and produces a JSON + Markdown report of all violations by severity.
 *
 * Usage:
 *   npm run preview &  # serve dist/ on http://localhost:4321/
 *   node scripts/playwright/audit-axe.mjs
 *
 * Output:
 *   download/qa/a11y/<page>-axe.json    — raw axe violations per page
 *   download/qa/a11y/summary.md         — human-readable summary
 */

import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '..', '..', 'download', 'qa', 'a11y');
fs.mkdirSync(OUT_DIR, { recursive: true });

const PAGES = [
  { name: 'home', url: 'http://localhost:4321/' },
  { name: 'about', url: 'http://localhost:4321/about/' },
  { name: 'contact', url: 'http://localhost:4321/contact/' },
  { name: 'pricing', url: 'http://localhost:4321/pricing/' },
  { name: 'solutions', url: 'http://localhost:4321/solutions/' },
  { name: 'kernel-index', url: 'http://localhost:4321/kernel/' },
  { name: 'kernel-chat', url: 'http://localhost:4321/kernel/chat/' },
  { name: 'privacy-policy', url: 'http://localhost:4321/privacy-policy/' },
];

// Inject axe-core from the project's node_modules
const AXE_PATH = path.join(
  __dirname,
  '..',
  '..',
  'node_modules',
  'axe-core',
  'axe.min.js',
);
if (!fs.existsSync(AXE_PATH)) {
  console.error(`axe.min.js not found at ${AXE_PATH}`);
  console.error('Run: npm install (axe-core is a transitive dep)');
  process.exit(1);
}
const AXE_SRC = fs.readFileSync(AXE_PATH, 'utf-8');

async function auditPage(browser, page, def) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });
  const tab = await context.newPage();
  const consoleErrors = [];
  tab.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  try {
    await tab.goto(def.url, { waitUntil: 'networkidle', timeout: 30_000 });
    // Inject axe-core into the page
    await tab.addScriptTag({ content: AXE_SRC });
    // Run axe — WCAG 2.1 AA + best practices
    const result = await tab.evaluate(async () => {
      return await window.axe.run({
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'],
        },
        resultTypes: ['violations', 'incomplete', 'passes'],
      });
    });

    const summary = {
      page: def.name,
      url: def.url,
      violations: result.violations.length,
      incomplete: result.incomplete.length,
      passes: result.passes.length,
      consoleErrors: consoleErrors.length,
      timestamp: new Date().toISOString(),
      violationsList: result.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        description: v.description,
        help: v.help,
        helpUrl: v.helpUrl,
        nodes: v.nodes.length,
        targets: v.nodes.slice(0, 5).map((n) => n.target),
      })),
      incompleteList: result.incomplete.map((v) => ({
        id: v.id,
        impact: v.impact,
        help: v.help,
        nodes: v.nodes.length,
      })),
      consoleErrorsList: consoleErrors,
    };

    fs.writeFileSync(
      path.join(OUT_DIR, `${def.name}-axe.json`),
      JSON.stringify(summary, null, 2),
    );
    return summary;
  } catch (err) {
    return {
      page: def.name,
      url: def.url,
      error: err.message,
      timestamp: new Date().toISOString(),
    };
  } finally {
    await tab.close();
    await context.close();
  }
}

const browser = await chromium.launch();
console.log(`Auditing ${PAGES.length} pages with axe-core...\n`);

const results = [];
for (const def of PAGES) {
  process.stdout.write(`  ${def.name.padEnd(20)} ${def.url} ... `);
  const r = await auditPage(browser, null, def);
  results.push(r);
  if (r.error) {
    console.log(`ERROR: ${r.error}`);
  } else {
    console.log(`${r.violations} violation(s), ${r.incomplete} incomplete`);
  }
}

await browser.close();

// ─── Markdown summary ──────────────────────────────────────────────────────
let md = `# axe-core Audit — REPORTS-18 (BrightAI A11y)\n\n`;
md += `**Generated**: ${new Date().toISOString()}\n`;
md += `**Rules**: wcag2a, wcag2aa, wcag21a, wcag21aa, best-practice\n`;
md += `**Pages audited**: ${PAGES.length}\n\n`;
md += `## Summary Table\n\n`;
md += `| Page | URL | Violations | Incomplete | Console Errors |\n`;
md += `|---|---|---|---|---|\n`;
for (const r of results) {
  if (r.error) {
    md += `| ${r.page} | ${r.url} | ERROR | — | — |\n`;
  } else {
    md += `| ${r.page} | ${r.url} | ${r.violations} | ${r.incomplete} | ${r.consoleErrors} |\n`;
  }
}

const totalViolations = results.reduce((s, r) => s + (r.violations || 0), 0);
const totalIncomplete = results.reduce((s, r) => s + (r.incomplete || 0), 0);
md += `\n**TOTAL**: ${totalViolations} violations, ${totalIncomplete} incomplete\n\n`;

if (totalViolations > 0) {
  md += `## Violations by Page\n\n`;
  for (const r of results) {
    if (!r.violationsList || r.violationsList.length === 0) continue;
    md += `### ${r.page} (${r.url})\n\n`;
    for (const v of r.violationsList) {
      md += `- **${v.id}** [${v.impact}] (${v.nodes} node${v.nodes !== 1 ? 's' : ''})\n`;
      md += `  ${v.help}\n`;
      md += `  ${v.helpUrl}\n`;
      md += `  Targets: ${v.targets.slice(0, 3).map((t) => '`' + JSON.stringify(t) + '`').join(', ')}\n\n`;
    }
  }
} else {
  md += `✅ **Zero violations across all audited pages.**\n\n`;
}

if (totalIncomplete > 0) {
  md += `## Incomplete (needs manual review)\n\n`;
  for (const r of results) {
    if (!r.incompleteList || r.incompleteList.length === 0) continue;
    md += `### ${r.page}\n\n`;
    for (const v of r.incompleteList) {
      md += `- **${v.id}** [${v.impact}] (${v.nodes} node${v.nodes !== 1 ? 's' : ''}) — ${v.help}\n`;
    }
    md += `\n`;
  }
}

fs.writeFileSync(path.join(OUT_DIR, 'summary.md'), md);
console.log(`\n✅ Wrote summary to ${path.join(OUT_DIR, 'summary.md')}`);

// Exit code reflects whether any critical/serious violations were found
const criticalOrSerious = results.reduce(
  (s, r) =>
    s +
    (r.violationsList || [])
      .filter((v) => v.impact === 'critical' || v.impact === 'serious')
      .reduce((n, v) => n + v.nodes, 0),
  0,
);

if (criticalOrSerious > 0) {
  console.error(
    `\n❌ ${criticalOrSerious} critical/serious violation node(s) across pages`,
  );
  process.exit(1);
} else {
  console.log('\n✅ No critical or serious axe-core violations.');
}