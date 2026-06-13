# Render Deployment Check — BrightAI Astro Cutover

> Generated: 2026-06-13T21:56:00+03:00  
> Decision: **Render switch APPROVED** — proof below

---

## Proof Summary

| Requirement | Evidence |
|-------------|----------|
| ≥87 sitemap URLs in `dist/` | **105/105 FOUND** — `node scripts/verify-astro-routes.mjs` exit 0 |
| Special files in `dist/` | `llms.txt`, `llms-full.txt`, `ai.txt`, `robots.txt`, `manifest.webmanifest`, `sitemap.xml`, `blog/feed.xml` — all present |
| SEO gate on every sitemap page | 0 failures — see `SEO-MIGRATION-CHECK.md` |
| No orphan sitemap pages | 0 — dist link graph after footer fix |
| Legacy HTML not deleted | Repo root HTML preserved (hybrid project rule) |

**Conclusion:** Conditions met. `brightai-site` publish path switched from `.render-static` to `dist`.

---

## What Changed in `render.yaml`

### `brightai-site` ONLY

**Before:**
```yaml
buildCommand: |
  set -eu
  npm ci ...
  rsync ... .render-static/
  node (html cleanup)
  npm run seo:production-guard
staticPublishPath: .render-static
```

**After:**
```yaml
buildCommand: npm install && npx astro build
staticPublishPath: dist
```

### Preserved unchanged

- **`brightai-api` service** — entire block untouched (`rootDir: frontend`, `healthCheckPath: /api/health`, all `envVars`, `DATABASE_URL`)
- **API rewrites** — `/api/*` → `brightai-api.onrender.com/api/*`
- **WebSocket rewrites** — `/ws/*` → `brightai-api.onrender.com/ws/*`
- **Security headers** — full `headers:` block on `brightai-site`
- **301 redirects** — all existing `.html` → clean URL rules retained (265+ rules)
- **`brightai-db`** database block

---

## Build Commands (local parity with Render)

```bash
npm install
npx astro build
# Output: dist/
node scripts/verify-astro-routes.mjs --no-build  # if dist already built
```

Root `package.json` `"build": "astro build"` — Render uses explicit `npx astro build` per migration spec.

---

## Deploy Checklist

### Pre-deploy

- [x] `verify-astro-routes.mjs` exit 0
- [x] `SEO-MIGRATION-CHECK.md` generated
- [x] `FINAL-QA-REPORT.md` generated
- [ ] Push branch and trigger Render auto-deploy (human step)

### Post-deploy verification

```bash
# Site pages
curl -sI https://brightai.site/ | head -1
curl -sI https://brightai.site/blog/ | head -1
curl -sI https://brightai.site/kernel/ | head -1

# Legacy .html redirect
curl -sI https://brightai.site/services.html | grep -i location

# API proxy (must still work)
curl -s https://brightai.site/api/health

# Special files
curl -sI https://brightai.site/robots.txt | head -1
curl -sI https://brightai.site/llms.txt | head -1
curl -sI https://brightai.site/blog/feed.xml | head -1
```

Expected: all site/special files **200**; `.html` URLs **301** to trailing-slash clean URLs; `/api/health` JSON from backend.

---

## Rollback Plan

If production 404s appear after deploy:

1. Revert `brightai-site` in `render.yaml` to previous `.render-static` build block
2. Redeploy — legacy rsync pipeline serves last-known-good static tree
3. Do **not** touch `brightai-api`

Rollback commit should only change lines 96–102 area of `render.yaml` (`buildCommand` + `staticPublishPath`).

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Missing route → 404 | Blocked by `verify-astro-routes.mjs` gate (105/105) |
| API break from yaml edit | Only `brightai-site` lines changed; rewrites verified present |
| Indexed `.html` URLs | Existing 301 redirect rules preserved in `routes:` |
| Kernel `.html` rewrites | Astro outputs `dist/kernel/chat/index.html` etc.; existing kernel redirect/rewrite rules still apply |

---

## Status

**Render switch: EXECUTED** (not deferred)

Log entry: All 105 sitemap routes + special files verified in `dist/` on 2026-06-13. `brightai-site` build/publish updated. `brightai-api` not modified.
