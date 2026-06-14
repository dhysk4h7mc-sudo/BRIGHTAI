#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export function findHtmlDestinations(yaml) {
  const findings = [];

  for (const [index, line] of yaml.split(/\r?\n/).entries()) {
    const match = line.match(/^\s*destination:\s*(\S+)\s*$/);
    if (match && /\.html(?:[?#]|$)/i.test(match[1])) {
      findings.push({
        line: index + 1,
        destination: match[1],
      });
    }
  }

  return findings;
}

export async function checkRenderRouteHygiene({ root = ROOT } = {}) {
  const renderPath = path.join(root, "render.yaml");
  const yaml = await fs.readFile(renderPath, "utf8");
  return findHtmlDestinations(yaml);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const findings = await checkRenderRouteHygiene();
  console.log(JSON.stringify({
    htmlDestinations: findings,
  }, null, 2));
  if (findings.length) process.exitCode = 1;
}
