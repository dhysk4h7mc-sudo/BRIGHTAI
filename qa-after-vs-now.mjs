#!/usr/bin/env node
/**
 * Visual QA — diff between `after/` (last baseline) and `now/` (current).
 * Confirms no regression since the 06:10 baseline.
 */
import { readFileSync, writeFileSync, existsSync, statSync } from 'node:fs';
import { readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const baselineDir = join(__dirname, 'redesign-2026-06-29', 'after');
const nowDir      = join(__dirname, 'redesign-2026-06-29', 'now');
const outJson     = join(__dirname, 'qa', 'visual-diff-after-vs-now.json');
const outMd       = join(__dirname, 'qa', 'visual-diff-after-vs-now.md');

const afterFiles = readdirSync(baselineDir).filter((f) => f.endsWith('.png')).sort();
const nowFiles   = readdirSync(nowDir).filter((f) => f.endsWith('.png')).sort();

function sha256(p) { return createHash('sha256').update(readFileSync(p)).digest('hex'); }

const result = { generatedAt: new Date().toISOString(), comparison: 'after vs now', pairs: [] };
const rows = [];

const allFiles = Array.from(new Set([...afterFiles, ...nowFiles])).sort();
for (const f of allFiles) {
  const a = join(baselineDir, f);
  const n = join(nowDir, f);
  if (!existsSync(a) || !existsSync(n)) continue;
  const aHash = sha256(a);
  const nHash = sha256(n);
  const identical = aHash === nHash;
  result.pairs.push({ file: f, identical, afterHash: aHash, nowHash: nHash });
  rows.push({ file: f, identical: identical ? '✅' : '🔴' });
}

writeFileSync(outJson, JSON.stringify(result, null, 2), 'utf8');
const lines = [];
lines.push(`# Visual Diff — after (06:10) vs now (12:04)`);
lines.push(``);
lines.push(`**Generated**: ${result.generatedAt}`);
lines.push(`**Method**: byte-level SHA-256`);
lines.push(`**Pairs compared**: ${result.pairs.length}`);
lines.push(``);
const identical = result.pairs.filter((p) => p.identical).length;
lines.push(`**Identical**: ${identical}/${result.pairs.length}`);
lines.push(``);
lines.push(`| Page | identical |`);
lines.push(`|---|:---:|`);
for (const r of rows) lines.push(`| ${r.file} | ${r.identical} |`);
writeFileSync(outMd, lines.join('\n') + '\n', 'utf8');

console.log(`✅ Wrote ${outJson}`);
console.log(`✅ Wrote ${outMd}`);
console.log(`   Identical: ${identical}/${result.pairs.length}`);
process.exit(identical === result.pairs.length ? 0 : 1);
