import { promises as fs } from "fs";
import path from "path";
import {
  normalizeRelPath,
  relPathToCanonical,
  normalizeSiteUrl,
  isPublicIndexableRelPath,
} from "./scripts/seo-url-map.mjs";
import {
  extractCanonicalHref,
  hasMetaRefresh,
  hasNoindexDirective,
} from "./scripts/sitemap-audit-utils.mjs";

const ROOT = process.cwd();
const BASE_URL = "https://brightai.site";

const IGNORED_SCAN_DIRS = new Set([
  ".git",
  ".next",
  ".render-static",
  ".agents",
  "node_modules",
  "aimais",
  "backend",
  "coverage",
  "dist",
  "build",
  "reports",
  "tmp",
]);

async function walkHtmlFiles(dirPath) {
  const files = [];
  let entries;
  try {
    entries = await fs.readdir(dirPath, { withFileTypes: true });
  } catch {
    return [];
  }

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      if (IGNORED_SCAN_DIRS.has(entry.name) && dirPath === ROOT) {
        continue;
      }
      files.push(...(await walkHtmlFiles(fullPath)));
      continue;
    }
    if (entry.isFile() && entry.name.endsWith(".html")) {
      files.push(fullPath);
    }
  }

  return files;
}

function groupRelPath(relPath) {
  const normalized = relPath.toLowerCase();
  if (normalized.includes("404.html") || normalized.includes("500.html") || normalized.includes("error.html")) {
    return null;
  }
  if (
    normalized.includes("offline") ||
    normalized.includes("login") ||
    normalized.includes("forgot-password") ||
    normalized.includes("reset-password") ||
    normalized.includes("permission-denied") ||
    normalized.includes("profile") ||
    normalized.includes("admin") ||
    normalized.includes("backend") ||
    normalized.includes("/api/") ||
    normalized.includes("/ws/")
  ) {
    return null;
  }
  if (
    normalized.includes("privacy-policy") ||
    normalized.includes("cookie-policy") ||
    normalized.includes("terms") ||
    normalized.includes("pdpl-statement") ||
    normalized.includes("data-processing-agreement") ||
    normalized.includes("privacy-cookies") ||
    normalized.includes("trust")
  ) {
    return "legal";
  }
  if (normalized.startsWith("kernel/")) {
    if (
      normalized === "kernel/index.html" ||
      normalized === "kernel/chat.html" ||
      normalized === "kernel/audit.html" ||
      normalized === "kernel/approvals.html" ||
      normalized === "kernel/stats.html" ||
      normalized === "kernel/compliance.html" ||
      normalized === "kernel/policies.html" ||
      normalized === "kernel/connectors.html" ||
      normalized === "kernel/scenarios.html" ||
      normalized === "kernel/reports.html" ||
      normalized === "kernel/evidence.html"
    ) {
      return "kernel";
    }
    return null;
  }
  if (normalized.startsWith("solutions/") && normalized.endsWith("/index.html")) {
    return "solutions";
  }
  if (normalized.startsWith("hub/") && normalized.endsWith("/index.html")) {
    return "pages";
  }
  if (normalized.startsWith("demo/")) {
    return "demo";
  }
  if (
    normalized === "blog/index.html" ||
    normalized === "report/index.html" ||
    normalized === "assessment/ai-governance-readiness/index.html" ||
    normalized === "index.html" ||
    normalized === "about/index.html" ||
    normalized === "contact/index.html" ||
    normalized === "pricing/index.html" ||
    normalized === "services/index.html" ||
    normalized === "demo/index.html" ||
    normalized === "sitemap/index.html" ||
    (normalized.startsWith("authors/") && normalized.endsWith("/index.html")) ||
    (normalized.startsWith("blog/") && normalized.endsWith("/index.html")) ||
    (normalized.startsWith("docs/") && normalized.endsWith("/index.html")) ||
    normalized === "blog/ai-governance.html"
  ) {
    return "pages";
  }
  return null;
}

async function debug() {
  const allFiles = await walkHtmlFiles(path.join(ROOT, "dist"));
  console.log(`Total html files found: ${allFiles.length}`);
  
  const normalizedRelPaths = allFiles.map((fullPath) => normalizeRelPath(path.relative(path.join(ROOT, "dist"), fullPath)));
  console.log(`Total relative paths: ${normalizedRelPaths.length}`);

  let groupedCount = 0;
  for (const relPath of normalizedRelPaths) {
    const group = groupRelPath(relPath);
    if (!group) continue;
    groupedCount++;
    
    const fullPath = path.join(ROOT, "dist", relPath);
    const html = await fs.readFile(fullPath, "utf8");
    const canonicalTagHref = extractCanonicalHref(html);
    const expectedCanonical = relPathToCanonical(relPath, BASE_URL);
    const canonicalTagNormalized = normalizeSiteUrl(canonicalTagHref, BASE_URL);

    const reasons = [];
    if (hasMetaRefresh(html)) reasons.push("meta_refresh");
    if (hasNoindexDirective(html)) reasons.push("robots_noindex");
    const decodeUrl = (u) => {
      try { return decodeURIComponent(u || ""); } catch { return u || ""; }
    };
    if (!canonicalTagHref || decodeUrl(canonicalTagHref) !== decodeUrl(expectedCanonical) || decodeUrl(canonicalTagNormalized) !== decodeUrl(expectedCanonical)) {
      reasons.push(`canonical_mismatch (tag: ${canonicalTagHref}, expected: ${expectedCanonical})`);
    }
    
    if (reasons.length > 0) {
      console.log(`Excluded ${relPath}: ${reasons.join(", ")}`);
    }
  }
  console.log(`Total grouped: ${groupedCount}`);
}

debug();
