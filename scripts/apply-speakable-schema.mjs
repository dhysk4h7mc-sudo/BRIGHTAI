#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import * as cheerio from "cheerio";
import { glob } from "glob";

const FAQ_PATTERN = /"@type"\s*:\s*"FAQPage"/;
const EXCLUDED_PATH_PREFIXES = ["kernel/", "components/"];
const EXCLUDED_PAGES = new Set(["demo/index.html", "report/index.html"]);

function extractCanonical(html) {
  const tag = html.match(/<link\b[^>]*rel=["']canonical["'][^>]*>/i)?.[0];
  return tag?.match(/\bhref=["']([^"']+)["']/i)?.[1] || "";
}

function jsonLdBlocks(html) {
  const blocks = [];
  const pattern =
    /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = pattern.exec(html))) {
    const contentOffset = match.index + match[0].indexOf(match[1]);
    blocks.push({
      content: match[1],
      start: contentOffset,
      end: contentOffset + match[1].length,
    });
  }
  return blocks;
}

function objectRanges(json) {
  const ranges = [];
  const stack = [];
  let inString = false;
  let escaped = false;

  for (let index = 0; index < json.length; index += 1) {
    const char = json[index];
    if (inString) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === '"') inString = false;
      continue;
    }
    if (char === '"') inString = true;
    else if (char === "{") stack.push(index);
    else if (char === "}") {
      const start = stack.pop();
      if (start !== undefined) ranges.push({ start, end: index + 1 });
    }
  }

  return ranges;
}

function isWebPage(node) {
  const type = node?.["@type"];
  return Array.isArray(type) ? type.includes("WebPage") : type === "WebPage";
}

function scoreWebPage(node, canonical) {
  if (!isWebPage(node)) return -1;
  let score = 0;
  if (String(node["@id"] || "").endsWith("#webpage")) score += 100;
  if (canonical && node.url === canonical) score += 100;
  if (node.description) score += 20;
  if (node.isPartOf) score += 10;
  if (node.inLanguage) score += 10;
  score += Math.min(Object.keys(node).length, 10);
  return score;
}

function findPrimaryWebPage(html) {
  const canonical = extractCanonical(html);
  const candidates = [];

  for (const block of jsonLdBlocks(html)) {
    JSON.parse(block.content);
    for (const range of objectRanges(block.content)) {
      const source = block.content.slice(range.start, range.end);
      if (!/"@type"\s*:\s*"WebPage"/.test(source)) continue;
      try {
        const node = JSON.parse(source);
        const score = scoreWebPage(node, canonical);
        if (score >= 0) {
          candidates.push({
            node,
            score,
            start: block.start + range.start,
            end: block.start + range.end,
          });
        }
      } catch {
        // Nested object slices are attempted independently; only complete JSON objects count.
      }
    }
  }

  candidates.sort((left, right) => right.score - left.score);
  return candidates[0] || null;
}

function existingSelectors(html) {
  const $ = cheerio.load(html);
  const selectors = [];
  if ($("h1").length) selectors.push("h1");
  if ($(".tldr").length) selectors.push(".tldr");
  if ($(".key-takeaways").length) selectors.push(".key-takeaways");
  if ($("[data-speakable]").length) selectors.push("[data-speakable]");
  return selectors;
}

function speakableProperty(indent, selectors) {
  const childIndent = `${indent}  `;
  const selectorIndent = `${childIndent}  `;
  const selectorLines = selectors
    .map(
      (selector, index) =>
        `${selectorIndent}${JSON.stringify(selector)}${index < selectors.length - 1 ? "," : ""}`,
    )
    .join("\n");

  return [
    `${indent}"speakable": {`,
    `${childIndent}"@type": "SpeakableSpecification",`,
    `${childIndent}"cssSelector": [`,
    selectorLines,
    `${childIndent}]`,
    `${indent}},`,
  ].join("\n");
}

function addSpeakable(html, primary, selectors) {
  const objectSource = html.slice(primary.start, primary.end);
  const existingSpeakable =
    /^([ \t]*)"speakable"\s*:\s*\{[\s\S]*?^\1\},[^\S\r\n]*(?:\r?\n|$)/m;
  const existingMatch = objectSource.match(existingSpeakable);
  if (existingMatch) {
    const replacement = `${speakableProperty(existingMatch[1], selectors)}\n`;
    const start = primary.start + existingMatch.index;
    const end = start + existingMatch[0].length;
    return html.slice(0, start) + replacement + html.slice(end);
  }

  const typeLine =
    /^([ \t]*)"@type"\s*:\s*"WebPage"\s*,[^\S\r\n]*(?:\r?\n|$)/m;
  const match = objectSource.match(typeLine);
  if (!match) {
    throw new Error("Primary WebPage does not use a supported multiline @type property.");
  }

  const insertionPoint = primary.start + match.index + match[0].length;
  const property = `${speakableProperty(match[1], selectors)}\n`;
  return html.slice(0, insertionPoint) + property + html.slice(insertionPoint);
}

export async function applySpeakable(root = process.cwd()) {
  const files = await glob("**/*.html", {
    cwd: root,
    absolute: true,
    nodir: true,
    ignore: ["node_modules/**", ".git/**", ".render-static/**"],
  });
  const changed = [];
  const skipped = [];

  for (const file of files.sort()) {
    const relPath = path.relative(root, file).replaceAll(path.sep, "/");
    if (EXCLUDED_PAGES.has(relPath)) continue;
    if (EXCLUDED_PATH_PREFIXES.some((prefix) => relPath.startsWith(prefix))) {
      continue;
    }

    const html = await fs.readFile(file, "utf8");
    if (!FAQ_PATTERN.test(html)) continue;

    const selectors = existingSelectors(html);
    if (!selectors.includes("h1")) {
      skipped.push({ relPath, reason: "no readable h1" });
      continue;
    }

    const primary = findPrimaryWebPage(html);
    if (!primary) {
      skipped.push({ relPath, reason: "no primary WebPage node" });
      continue;
    }

    const updated = addSpeakable(html, primary, selectors);
    await fs.writeFile(file, updated);
    changed.push({ relPath, selectors });
  }

  return { changed, skipped };
}

const isDirectRun =
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
  applySpeakable()
    .then(({ changed, skipped }) => {
      console.log(`Added SpeakableSpecification to ${changed.length} page(s).`);
      for (const item of changed) {
        console.log(`  - ${item.relPath}: ${item.selectors.join(", ")}`);
      }
      if (skipped.length) {
        console.log(`Skipped ${skipped.length} page(s):`);
        for (const item of skipped) {
          console.log(`  - ${item.relPath}: ${item.reason}`);
        }
      }
    })
    .catch((error) => {
      console.error(error.stack || error.message);
      process.exitCode = 1;
    });
}
