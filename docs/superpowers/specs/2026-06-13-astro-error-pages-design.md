# Astro Error Pages Design

## Goal

Add branded Arabic 404 and offline routes to the Astro static build, preserve the
legacy 500 page as a public static asset, and add the approved `/report/` redirect
without changing production infrastructure.

## Source Of Truth Decisions

- `ROUTE-INVENTORY.md` confirms `/services/` is a public page, so it must remain a
  real route and must not redirect to `/solutions/`.
- `/report/` is a legacy noindex route and will redirect permanently to `/trust/`.
- `public/sw.js` already defines `/offline/` as `OFFLINE_URL` and includes it in
  `PRECACHE_URLS`; this behavior will be protected by a regression test.
- Existing root legacy HTML files remain untouched.
- `render.yaml` remains untouched.

## Architecture

`src/pages/404.astro` and `src/pages/offline/index.astro` use `ArabicLayout`, which
provides RTL rendering, shared navigation, WhatsApp, and Google Analytics
`G-8LLESL207Q` through `SEOHead`. Both pages use only clean trailing-slash internal
links.

Astro's static redirects configuration will generate a permanent redirect from
`/report/` to `/trust/`. No `.html` redirects are added.

The root `500.html` is copied into `public/500.html` so Astro emits it unchanged as
`dist/500.html`. Existing absolute asset paths are retained because they are
site-root paths.

## Page Content

The 404 page communicates that the page cannot be found, suggests searching the
site through the main content areas, and links to `/`, `/solutions/`, `/kernel/`,
`/blog/`, and `/docs/`.

The offline page communicates that the visitor is offline, suggests returning to
previously cached content, and provides a reconnect action that reloads the page.

## Verification

A Node test validates source and built artifacts: ArabicLayout usage, required
navigation, GA inheritance, offline precache registration, the exact redirect,
absence of a `/services/` redirect, and the static 500 page. After the test passes,
run `npm run build`, start `npm run preview`, and verify HTTP behavior for an
unknown route, `/offline/`, and `/report/`.

