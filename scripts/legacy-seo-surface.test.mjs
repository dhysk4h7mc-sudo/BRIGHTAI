import assert from "node:assert/strict";
import test from "node:test";
import { auditLegacySeoSurface } from "./legacy-seo-surface-audit.mjs";

test("public SEO surfaces contain no broken legacy references", async () => {
  const result = await auditLegacySeoSurface();

  assert.deepEqual(result.selfRedirects, [], "self redirects must be removed");
  assert.deepEqual(result.missingRedirectDestinations, [], "redirect destinations must exist");
  assert.deepEqual(result.publicLegacyLinks, [], "public pages must not link to legacy routes");
  assert.deepEqual(result.missingMachineReadableUrls, [], "AI discovery files must reference real pages");
  assert.deepEqual(result.legacyRuntimeDestinations, [], "runtime redirect code must not restore legacy destinations");
});
