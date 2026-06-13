import { readFileSync } from 'node:fs';
import path from 'node:path';
import { load } from 'cheerio';

export interface LegalContent {
  html: string;
  h1: string;
}

interface ContentMarkers {
  start: string;
  end: string;
}

export function getLegalContent(legacyPath: string, markers?: ContentMarkers): LegalContent {
  const source = readFileSync(path.join(process.cwd(), legacyPath), 'utf8');
  let html: string;

  if (markers) {
    const start = source.indexOf(markers.start);
    const end = source.indexOf(markers.end, start);
    if (start < 0 || end < 0) {
      throw new Error(`Legacy legal markers were not found: ${legacyPath}`);
    }
    html = source.slice(start, end);
  } else {
    const main = source.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
    if (!main) {
      throw new Error(`Legacy legal content has no <main>: ${legacyPath}`);
    }
    html = main[1];
  }

  const $ = load(html, { decodeEntities: false });
  const h1 = $('h1').first().text().trim();
  if (!h1) {
    throw new Error(`Legacy legal content has no H1: ${legacyPath}`);
  }

  return { html, h1 };
}
