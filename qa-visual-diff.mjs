#!/usr/bin/env node
/**
 * Visual QA — pixel-level diff between `before/` and `now/` screenshots.
 * Uses macOS `sips` for image info + `compare` (ImageMagick) if available.
 * Falls back to byte-size comparison + sha256 hash.
 *
 * Output: qa/visual-diff.json + qa/visual-diff.md
 */
import { readFileSync, writeFileSync, existsSync, statSync } from 'node:fs';
import { join, dirname, basename, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const beforeDir = join(__dirname, 'redesign-2026-06-29', 'before');
const nowDir    = join(__dirname, 'redesign-2026-06-29', 'now');
const outJson   = join(__dirname, 'qa', 'visual-diff.json');
const outMd     = join(__dirname, 'qa', 'visual-diff.md');

const { readdirSync } = await import('node:fs');
const beforeFiles = readdirSync(beforeDir).filter((f) => f.endsWith('.png')).sort();
const nowFiles    = readdirSync(nowDir).filter((f) => f.endsWith('.png')).sort();

const imAvailable = spawnSync('which', ['compare']).status === 0;

function sha256(p) {
  return createHash('sha256').update(readFileSync(p)).digest('hex');
}

function fileSize(p) {
  return statSync(p).size;
}

function imageDims(p) {
  try {
    const out = execSync(`sips -g pixelWidth -g pixelHeight "${p}" 2>/dev/null | tail -2`).toString();
    const w = parseInt(out.match(/pixelWidth:\s*(\d+)/)?.[1] || '0', 10);
    const h = parseInt(out.match(/pixelHeight:\s*(\d+)/)?.[1] || '0', 10);
    return { w, h };
  } catch (e) { return { w: 0, h: 0 }; }
}

const result = { generatedAt: new Date().toISOString(), method: imAvailable ? 'imagemagick' : 'byte-hash-fallback', pairs: [] };
const missing = [];
const rows = [];

// Build file map keyed by basename
const beforeMap = Object.fromEntries(beforeFiles.map((f) => [f, join(beforeDir, f)]));
const nowMap    = Object.fromEntries(nowFiles.map((f) => [f, join(nowDir, f)]));

const allFiles = Array.from(new Set([...beforeFiles, ...nowFiles])).sort();

for (const f of allFiles) {
  const b = beforeMap[f];
  const n = nowMap[f];
  if (!b) { missing.push({ file: f, missing: 'before' }); continue; }
  if (!n) { missing.push({ file: f, missing: 'now' }); continue; }

  const bSize = fileSize(b);
  const nSize = fileSize(n);
  const bHash = sha256(b);
  const nHash = sha256(n);
  const bDims = imageDims(b);
  const nDims = imageDims(n);

  let pixelDiff = null;
  let pixelDiffPct = null;
  if (imAvailable && bDims.w === nDims.w && bDims.h === nDims.h) {
    // Use ImageMagick compare
    const tmp = join(__dirname, 'qa', 'diff-' + f);
    try {
      const r = spawnSync('compare', ['-metric', 'AE', '-fuzz', '2%', b, n, tmp]);
      // compare exit code: 0=identical, 1=different (with diff count), 2=error
      const errOut = r.stderr?.toString() || '';
      const num = parseFloat(errOut.replace(/[^\d.eE+-]/g, ''));
      pixelDiff = isFinite(num) ? num : null;
      const total = bDims.w * bDims.h;
      pixelDiffPct = (pixelDiff != null && total > 0) ? +(pixelDiff / total * 100).toFixed(3) : null;
    } catch (e) {
      pixelDiff = null;
    }
  }

  const sizeDelta = nSize - bSize;
  const sizeDeltaPct = bSize > 0 ? +((sizeDelta / bSize) * 100).toFixed(2) : 0;
  const identical = bHash === nHash;

  result.pairs.push({
    file: f,
    identical,
    before: { size: bSize, hash: bHash, dims: bDims },
    now:    { size: nSize, hash: nHash, dims: nDims },
    sizeDeltaBytes: sizeDelta,
    sizeDeltaPct,
    pixelDiff,
    pixelDiffPct,
  });
  rows.push({
    file: f,
    identical: identical ? '✅' : '🔄',
    sizePct: sizeDeltaPct,
    pixelPct: pixelDiffPct,
    dimsMatch: (bDims.w === nDims.w && bDims.h === nDims.h) ? '✅' : '❌',
  });
}

result.missing = missing;

writeFileSync(outJson, JSON.stringify(result, null, 2), 'utf8');

// markdown summary
const lines = [];
lines.push(`# Visual Diff — Before vs Now`);
lines.push(``);
lines.push(`**Generated**: ${result.generatedAt}`);
lines.push(`**Method**: ${result.method}`);
lines.push(`**Pairs compared**: ${result.pairs.length}`);
lines.push(``);

const identicalCount = result.pairs.filter((p) => p.identical).length;
const pixelDiffPairs = result.pairs.filter((p) => p.pixelDiff != null);
const avgPixelDiff = pixelDiffPairs.length
  ? (pixelDiffPairs.reduce((s, p) => s + p.pixelDiffPct, 0) / pixelDiffPairs.length).toFixed(3)
  : 'n/a';

lines.push(`## Summary`);
lines.push(``);
lines.push(`| Metric | Value |`);
lines.push(`|---|---|`);
lines.push(`| Identical (byte hash) | ${identicalCount}/${result.pairs.length} |`);
lines.push(`| Pairs with pixel diff | ${pixelDiffPairs.length} |`);
lines.push(`| Average pixel diff % | ${avgPixelDiff}% |`);
lines.push(`| Missing files | ${missing.length} |`);
lines.push(``);

lines.push(`## Per-page`);
lines.push(``);
lines.push(`| Page | byte-equal | size Δ% | pixel Δ% | dims match |`);
lines.push(`|---|:---:|---:|---:|:---:|`);
for (const r of rows) {
  const sizeStr = r.sizePct === 0 ? '0%' : (r.sizePct > 0 ? `+${r.sizePct}%` : `${r.sizePct}%`);
  const pixStr = r.pixelPct == null ? 'n/a' : (r.pixelPct === 0 ? '0%' : `${r.pixelPct}%`);
  lines.push(`| ${r.file} | ${r.identical} | ${sizeStr} | ${pixStr} | ${r.dimsMatch} |`);
}
lines.push(``);

if (missing.length) {
  lines.push(`## Missing files`);
  missing.forEach((m) => lines.push(`- ❌ ${m.file} missing in ${m.missing}/`));
  lines.push(``);
}

lines.push(`## Reading guide`);
lines.push(``);
lines.push(`- **byte-equal** ✅: ملفا الصورة متطابقان byte-for-byte (نفس الـ hash). يعني الـ layout أو البيكسل ما تغيّر.`);
lines.push(`- **size Δ%**: الفرق في حجم الملف (KB). تغيير > 5% يستحق فحص يدوي.`);
lines.push(`- **pixel Δ%**: نسبة البيكسلات المختلفة (fuzz 2%). < 0.5% = تغييرات طفيفة (anti-aliasing, timing). 0.5-2% = تغييرات ملحوظة. > 2% = regression محتمل.`);
lines.push(`- **dims match**: تطابق أبعاد الصورة. لو مختلفة، الـ layout تغيّر.`);
lines.push(``);

writeFileSync(outMd, lines.join('\n') + '\n', 'utf8');
console.log(`✅ Wrote ${outJson}`);
console.log(`✅ Wrote ${outMd}`);
console.log(`   Identical: ${identicalCount}/${result.pairs.length}`);
console.log(`   Missing: ${missing.length}`);
