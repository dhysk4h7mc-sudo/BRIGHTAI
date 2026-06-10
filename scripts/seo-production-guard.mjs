#!/usr/bin/env node
import { spawnSync } from "node:child_process";

const checks = [
  ["Unit tests", "node", ["--test", "scripts/indexing-recovery-audits.test.mjs"]],
  ["Legacy paths", "node", ["scripts/legacy-paths-audit.mjs", "--strict"]],
  ["Internal link graph", "node", ["scripts/link-graph-validator.mjs", "--strict"]],
  ["Redirect destinations", "node", ["scripts/check-redirect-destinations.mjs"]],
  ["Canonical and indexability", "node", ["scripts/seo-health-check.mjs"]],
  ["Content targets", "node", ["scripts/check-word-count.mjs"]],
  ["FAQ schema", "node", ["scripts/sync-solution-faq-schema.mjs", "--check"]],
  ["Docs HowTo schema", "node", ["scripts/sync-docs-howto-schema.mjs", "--check"]],
  ["JSON-LD schema", "node", ["scripts/seo-schema-audit.mjs"]],
  ["Speakable schema", "node", ["scripts/check-speakable-schema.mjs"]],
  ["Inbound links", "node", ["scripts/internal-linking-architecture.mjs"]],
  ["SEO CI gate", "node", ["scripts/seo-ci-check.mjs"]],
  ["Performance budget", "node", ["scripts/check-performance-budget.js"]],
];

const failures = [];
for (const [name, command, args] of checks) {
  console.log(`\n=== ${name} ===`);
  const result = spawnSync(command, args, { cwd: process.cwd(), encoding: "utf8" });
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  if (result.status !== 0) failures.push(name);
}

if (failures.length) {
  console.error(`\nDeploy blocked: ${failures.length} check(s) failed: ${failures.join(", ")}`);
  process.exit(1);
}

console.log(`\nAll ${checks.length} SEO/AEO production checks passed.`);
