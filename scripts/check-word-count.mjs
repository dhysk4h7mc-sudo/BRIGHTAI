#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { stripHtml } from "./indexing-recovery-utils.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const DEFAULT_TARGETS = {
  "contact/index.html": 800,
  "solutions/index.html": 900,
  "trust/index.html": 800,
  "assessment/ai-governance-readiness/index.html": 900,
  "solutions/healthcare-ai-governance/jeddah/index.html": 900,
  "solutions/government-ai-governance/dammam/index.html": 900,
  "solutions/banking-ai-governance/riyadh/index.html": 900,
};

export async function checkWordCounts({ root = ROOT, targets = DEFAULT_TARGETS } = {}) {
  const results = [];
  for (const [relPath, minimum] of Object.entries(targets)) {
    if (relPath === "kernel/offline.html") continue;
    const html = await fs.readFile(path.join(root, relPath), "utf8");
    const count = stripHtml(html).split(/\s+/).filter(Boolean).length;
    results.push({ relPath, minimum, count, passed: count >= minimum });
  }
  return { results, failures: results.filter((entry) => !entry.passed) };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const result = await checkWordCounts();
  console.log(JSON.stringify(result, null, 2));
  if (result.failures.length) process.exitCode = 1;
}
