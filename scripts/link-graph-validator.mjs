#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildRouteSet,
  canonicalPath,
  walkFiles,
} from "./indexing-recovery-utils.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export async function validateLinkGraph({ root = ROOT } = {}) {
  const htmlFiles = (await walkFiles(root)).filter((file) => file.endsWith(".html"));
  const routes = buildRouteSet(htmlFiles);
  const allFiles = new Set(await walkFiles(root));
  const brokenLinks = [];
  const legacyPaths = [];
  const htmlSuffixes = [];

  for (const relPath of htmlFiles) {
    const html = await fs.readFile(path.join(root, relPath), "utf8");
    for (const match of html.matchAll(/<a\b[^>]*\bhref\s*=\s*["']([^"'#]+)["']/gi)) {
      const href = match[1].trim();
      if (/^(?:mailto:|tel:|javascript:|https?:\/\/(?!brightai\.site)|\/\/)/i.test(href)) continue;
      if (href.includes("${")) continue;
      const normalized = canonicalPath(href);
      if (!normalized) continue;
      const finding = { relPath, originalHref: href, normalized };
      if (/\/(?:demo)\/pages\//i.test(href)) legacyPaths.push(finding);
      if (/\.html(?:[?#]|$)/i.test(href) && !/(?:404|500|error)\.html/i.test(href)) {
        htmlSuffixes.push(finding);
      }
      const pathname = new URL(href, "https://brightai.site").pathname.replace(/^\/+/, "");
      if (!routes.has(normalized) && !allFiles.has(pathname)) brokenLinks.push(finding);
    }
  }

  return { filesScanned: htmlFiles.length, brokenLinks, legacyPaths, htmlSuffixes };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const result = await validateLinkGraph();
  console.log(JSON.stringify(result, null, 2));
  const issues = result.brokenLinks.length + result.legacyPaths.length + result.htmlSuffixes.length;
  if (process.argv.includes("--strict") && issues) process.exitCode = 1;
}
