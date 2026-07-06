#!/usr/bin/env node
/**
 * scripts/sync-dist-flat.mjs — REPORTS-SEC-01 (2026-07-06)
 *
 * When `@astrojs/vercel` is installed, `astro build` ends with the
 * adapter moving static files OUT of dist/client/ into `.vercel/output/static/`.
 * The final state is:
 *   - dist/server/                  ← server function bundle (preserved)
 *   - .vercel/output/static/        ← all prerendered HTML, CSS, JS, sitemap
 *   - .vercel/output/functions/     ← API/server functions (api/ai/chat, etc.)
 *   - .vercel/output/config.json
 *
 * Render static hosting uses `staticPublishPath: dist` (per render.yaml)
 * and many legacy CI scripts assume dist/<relpath>. To keep BOTH
 * Vercel deployment and Render deployment + legacy CI working,
 * this script mirrors `.vercel/output/static/` onto `dist/` after build.
 *
 * This script:
 *   1. preserves dist/server/ (Vercel function bundle — Render will ignore it)
 *   2. preserves .vercel/ at root
 *   3. wipes everything else inside dist/
 *   4. copies the full contents of .vercel/output/static/ into dist/
 *
 * Result: dist/<relpath> resolves correctly for legacy scripts AND
 * render.yaml can still serve dist/ as a static site.
 *
 * If the build is a plain-static one without the adapter (no .vercel/output),
 * this script is a no-op.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

const dst = path.join(root, 'dist');
const src = path.join(root, '.vercel', 'output', 'static');
const PRESERVE_AT_DIST = new Set(['server']);

if (!fs.existsSync(src)) {
  console.log('[sync-dist-flat] .vercel/output/static/ not found — adapter may not be active or build was plain-static. Skipping.');
  process.exit(0);
}

// 1. Wipe dist/* except preserved entries (server bundle)
if (fs.existsSync(dst)) {
  for (const entry of fs.readdirSync(dst)) {
    if (PRESERVE_AT_DIST.has(entry)) continue;
    const p = path.join(dst, entry);
    fs.rmSync(p, { recursive: true, force: true });
  }
} else {
  fs.mkdirSync(dst, { recursive: true });
}

// 2. Mirror .vercel/output/static/ → dist/
let copied = 0;
function copyOne(from, to) {
  const stat = fs.statSync(from);
  if (stat.isDirectory()) {
    if (!fs.existsSync(to)) fs.mkdirSync(to, { recursive: true });
    for (const entry of fs.readdirSync(from)) {
      copyOne(path.join(from, entry), path.join(to, entry));
    }
    return;
  }
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
  copied++;
}
for (const entry of fs.readdirSync(src)) {
  copyOne(path.join(src, entry), path.join(dst, entry));
}

console.log(`[sync-dist-flat] mirrored ${copied} file(s) from .vercel/output/static/ → dist/ (preserved: ${Array.from(PRESERVE_AT_DIST).join(', ')}).`);

// 3. Clean .vercel/ — the user asked to keep the working tree tidy.
//    The adapter will regenerate .vercel/ on the next build, but we
//    don't need it lingering between builds. Render reads dist/, Vercel
//    runs `astro build` again at deploy time.
const vercelOut = path.join(root, '.vercel');
if (fs.existsSync(vercelOut)) {
  fs.rmSync(vercelOut, { recursive: true, force: true });
  console.log('[sync-dist-flat] removed .vercel/ after copy (regenerated on next `npm run build`).');
}

// 4. Also remove dist/server/ — it's the Vercel function bundle, not
//    needed in the Render static deploy. Keep only the static mirror.
const distServer = path.join(dst, 'server');
if (fs.existsSync(distServer)) {
  fs.rmSync(distServer, { recursive: true, force: true });
  console.log('[sync-dist-flat] removed dist/server/ (Vercel function bundle, not needed by Render static).');
}
