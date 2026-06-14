#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildRouteSet,
  canonicalPath,
  parseRedirects,
  redirectPath,
  walkFiles,
} from "./indexing-recovery-utils.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function loadRedirects(root) {
  let netlify = [];
  try {
    netlify = parseRedirects(await fs.readFile(path.join(root, "_redirects"), "utf8"), "_redirects");
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
  const json = JSON.parse(await fs.readFile(path.join(root, "redirects.json"), "utf8"));
  return [...netlify, ...(json.redirects || []).map((entry) => ({
    source: "redirects.json",
    from: entry.from,
    to: entry.to,
    status: Number(entry.status || 301),
  }))];
}

export async function checkRedirectDestinations({ root = ROOT } = {}) {
  const htmlFiles = (await walkFiles(root)).filter((file) => file.endsWith(".html"));
  const routes = buildRouteSet(htmlFiles);
  const redirects = await loadRedirects(root);
  const permanentRedirects = redirects.filter(
    (redirect) => redirect.status >= 300 && redirect.status < 400,
  );
  const redirectMap = new Map();
  const redirectSources = new Set();
  const selfRedirects = [];
  const missingDestinations = [];
  const htmlDestinations = [];
  const duplicateSources = [];

  for (const redirect of permanentRedirects) {
    if (/[:*]/.test(redirect.from) || /[:*]/.test(redirect.to)) continue;
    const from = redirectPath(redirect.from);
    const to = redirectPath(redirect.to);
    if (!from || !to) continue;
    redirectSources.add(from);
  }

  for (const redirect of permanentRedirects) {
    if (/[:*]/.test(redirect.from) || /[:*]/.test(redirect.to)) continue;
    const from = redirectPath(redirect.from);
    const to = redirectPath(redirect.to);
    if (!from || !to) continue;
    if (from === to) selfRedirects.push(redirect);
    if (/\.html(?:[?#]|$)/i.test(redirect.to)) htmlDestinations.push(redirect);
    if (!routes.has(canonicalPath(to)) && !redirectSources.has(to)) missingDestinations.push(redirect);
    const sourceKey = `${redirect.source}:${from}`;
    if (redirectMap.has(sourceKey) && redirectMap.get(sourceKey) !== to) {
      duplicateSources.push(redirect);
    } else {
      redirectMap.set(sourceKey, to);
    }
  }

  const routeMap = new Map();
  for (const redirect of permanentRedirects) {
    if (/[:*]/.test(redirect.from) || /[:*]/.test(redirect.to)) continue;
    const from = redirectPath(redirect.from);
    const to = redirectPath(redirect.to);
    if (from && to && !routeMap.has(from)) routeMap.set(from, to);
  }
  const chains = [];
  const cycles = [];
  for (const [start, first] of routeMap) {
    if (routeMap.has(first)) chains.push({ from: start, via: first, to: routeMap.get(first) });
    const seen = new Set([start]);
    let current = first;
    while (routeMap.has(current)) {
      if (seen.has(current)) {
        cycles.push({ from: start, at: current });
        break;
      }
      seen.add(current);
      current = routeMap.get(current);
    }
  }

  return {
    redirectsScanned: redirects.length,
    selfRedirects,
    missingDestinations,
    htmlDestinations,
    duplicateSources,
    chains,
    cycles,
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const result = await checkRedirectDestinations();
  console.log(JSON.stringify(result, null, 2));
  const issueCount = Object.entries(result)
    .filter(([key]) => key !== "redirectsScanned")
    .reduce((sum, [, value]) => sum + value.length, 0);
  if (issueCount) process.exitCode = 1;
}
