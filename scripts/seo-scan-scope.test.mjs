import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import path from "node:path";
import test from "node:test";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

const execFileAsync = promisify(execFile);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function runSeoScript(scriptName) {
  return execFileAsync(process.execPath, [path.join(ROOT, "scripts", scriptName)], {
    cwd: ROOT,
  });
}

test("SEO scanners ignore internal tooling HTML under .agents", async () => {
  for (const scriptName of ["seo-health-check.mjs", "seo-ci-check.mjs"]) {
    const { stdout } = await runSeoScript(scriptName);
    assert.doesNotMatch(stdout, /\.agents\//);
  }
});
