/**
 * RSS Feed — /rss.xml/
 *
 * REPORT-BLOG-2026-07-07:
 *   New canonical RSS endpoint. Mirrors /blog/feed.xml's content but
 *   lives at the URL the brief asked for (`src/pages/rss.xml.ts` →
 *   `/rss.xml/`).
 *
 *   /blog/feed.xml is kept live as a redirect target — see
 *   `public/_redirects` (`/blog/feed.xml → /rss.xml/`).
 *
 *   Items are sorted newest-first. Includes author + category as
 *   enclosures-style metadata for clients that understand them.
 */
import rss from '@astrojs/rss';
import { getPublishedPosts } from '../data/blog';
import { SITE } from '../data/site';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getPublishedPosts();

  return rss({
    title: 'مدونة BrightAI',
    description: 'مقالات عملية حول حوكمة الذكاء الاصطناعي في السعودية والامتثال للأنظمة (PDPL, NCA ECC, SDAIA, ISO 42001) وتجارب القطاعات',
    site: context.site || SITE.url,
    items: posts.map((post) => ({
      title: post.title,
      pubDate: new Date(post.pubDate),
      description: post.description,
      link: `/blog/${post.slug}/`,
      categories: post.tags,
      author: post.author.nameEn,
    })),
    customData: `<language>ar-SA</language>
<link href="${SITE.url}/rss.xml" rel="self" type="application/rss+xml"/>
<link href="${SITE.url}/blog/" rel="alternate" type="text/html"/>
<atom:link xmlns:atom="http://www.w3.org/2005/Atom" href="${SITE.url}/rss.xml" rel="self" type="application/rss+xml" />`,
    stylesheet: false,
  });
}
