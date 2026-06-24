#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import * as cheerio from "cheerio";
import { glob } from "glob";

const PROCEDURAL_HEADING =
  /^(?:كيف|طريقة|مسار|خطة|بناء|تصميم|ضبط|ربط|خريطة تشغيل)/i;
const EXCLUDED_HEADING =
  /قائمة (?:تحقق|مراجعة|أدلة)|المؤشرات|مكونات|وش معنى|^كيف يساعد/i;

function normalizeText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function hasType(node, type) {
  const value = node?.["@type"];
  return Array.isArray(value) ? value.includes(type) : value === type;
}

export function extractVisibleHowTo(html) {
  const $ = cheerio.load(html);
  let result = null;

  $("ol").each((_, list) => {
    if (result) return;

    const heading = normalizeText(
      $(list).prevAll("h2, h3").first().text(),
    );
    if (
      !heading ||
      EXCLUDED_HEADING.test(heading) ||
      !PROCEDURAL_HEADING.test(heading)
    ) {
      return;
    }

    const steps = $(list)
      .children("li")
      .map((__, item) => normalizeText($(item).text()))
      .get()
      .filter(Boolean);
    if (steps.length < 2) return;

    result = { name: heading, steps };
  });

  return result;
}

function extractCanonical(html) {
  const tag = html.match(/<link\b[^>]*rel=["']canonical["'][^>]*>/i)?.[0];
  const href = tag?.match(/\bhref=["']([^"']+)["']/i)?.[1];
  if (!href) throw new Error("Documentation page is missing a canonical URL.");
  return href;
}

function findTargetScript(html) {
  const pattern =
    /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let pageSchema = null;
  let productionSchema = null;
  let match;

  while ((match = pattern.exec(html))) {
    let schema;
    try {
      schema = JSON.parse(match[1]);
    } catch {
      continue;
    }
    if (hasType(schema, "HowTo")) {
      return {
        full: match[0],
        inner: match[1],
        schema,
        graph: [schema],
        standalone: true,
      };
    }
    let graph;
    if (Array.isArray(schema)) {
      graph = schema;
    } else if (Array.isArray(schema?.["@graph"])) {
      graph = schema["@graph"];
    } else {
      graph = null;
    }

    if (graph) {
      const candidate = {
        full: match[0],
        inner: match[1],
        schema,
        graph,
      };
      if (candidate.graph.some((node) => hasType(node, "HowTo"))) {
        return candidate;
      }
      if (/\bid=["']brightai-page-schema["']/i.test(match[0])) {
        pageSchema = candidate;
      }
      if (/\bid=["']brightai-production-schema["']/i.test(match[0])) {
        productionSchema = candidate;
      }
    }
  }

  return pageSchema || productionSchema;
}

export function syncDocsHowToSchema(html) {
  const visible = extractVisibleHowTo(html);
  if (!visible) {
    const target = findTargetScript(html);
    if (!target || !target.graph.some((node) => hasType(node, "HowTo"))) {
      return html;
    }
    if (target.standalone) {
      return html.replace(`${target.full}\n`, "").replace(target.full, "");
    }

    target.schema["@graph"] = target.graph.filter(
      (node) => !hasType(node, "HowTo"),
    );
    const replacement = target.full.replace(
      target.inner,
      `\n${JSON.stringify(target.schema, null, 2)}\n`,
    );
    return html.replace(target.full, replacement);
  }

  const canonical = extractCanonical(html);
  const target = findTargetScript(html);
  const existingHowTo = target?.graph.find((node) => hasType(node, "HowTo"));
  const howTo = {
    ...(existingHowTo || {}),
    "@context": "https://schema.org",
    "@type": "HowTo",
    "@id": `${canonical}#howto`,
    name: visible.name,
    inLanguage: "ar-SA",
    step: visible.steps.map((text, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: text,
      text,
    })),
  };

  if (!target) {
    const standalone = `<script id="brightai-howto-schema" type="application/ld+json">\n${JSON.stringify(howTo, null, 2)}\n</script>`;
    return html.replace(/<\/head>/i, `${standalone}\n</head>`);
  }

  if (target.standalone) {
    const replacement = target.full.replace(
      target.inner,
      `\n${JSON.stringify(howTo, null, 2)}\n`,
    );
    return html.replace(target.full, replacement);
  }

  delete howTo["@context"];
  const index = target.graph.findIndex((node) => hasType(node, "HowTo"));
  if (index === -1) target.graph.push(howTo);
  else target.graph[index] = howTo;

  const replacement = target.full.replace(
    target.inner,
    `\n${JSON.stringify(target.schema, null, 2)}\n`,
  );
  return html.replace(target.full, replacement);
}

export async function runSync({
  root = path.join(process.cwd(), "dist"),
  check = false,
} = {}) {
  const files = await glob("docs/*/index.html", {
    cwd: root,
    absolute: true,
    nodir: true,
  });
  const changed = [];

  for (const file of files.sort()) {
    const before = await fs.readFile(file, "utf8");
    const after = syncDocsHowToSchema(before);
    if (after === before) continue;

    changed.push(path.relative(root, file));
    if (!check) await fs.writeFile(file, after, "utf8");
  }

  if (check && changed.length) {
    throw new Error(`Docs HowTo schema is out of sync:\n${changed.join("\n")}`);
  }

  return changed;
}

const isDirectRun =
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
  runSync({ check: process.argv.includes("--check") })
    .then((changed) => {
      const action = process.argv.includes("--check") ? "checked" : "updated";
      console.log(`Docs HowTo schema ${action}: ${changed.length} file(s).`);
    })
    .catch((error) => {
      console.error(`Docs HowTo schema failed: ${error.message}`);
      process.exitCode = 1;
    });
}
