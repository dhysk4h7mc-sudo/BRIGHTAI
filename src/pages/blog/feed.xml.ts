/**
 * RSS Feed — /blog/feed.xml
 * Uses @astrojs/rss to generate a valid RSS 2.0 feed.
 * Matches the exact path of the existing static feed.xml.
 */
import rss from '@astrojs/rss';
import { getPublishedPosts } from '../../data/blog';
import { SITE } from '../../data/site';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = getPublishedPosts();

  return rss({
    title: 'مدونة BrightAI',
    description: 'مقالات عملية حول حوكمة الذكاء الاصطناعي في السعودية والامتثال والأنظمة',
    site: context.site || SITE.url,
    items: posts.map(post => ({
      title: post.title,
      pubDate: new Date(post.pubDate),
      description: post.description,
      link: `/blog/${post.slug}/`,
      categories: post.tags,
      author: post.author.nameEn,
    })),
    customData: `<language>ar-SA</language>
<link href="${SITE.url}/blog/feed.xml" rel="self" type="application/rss+xml"/>
<link href="${SITE.url}/blog/" rel="alternate" type="text/html"/>`,
    stylesheet: false,
  });
}