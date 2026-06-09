import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  buildPayload,
  loadKey,
  loadSitemapUrls,
  normalizeUrls,
} from "./trigger-indexnow.mjs";

test("loads the IndexNow key from a matching root key file", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "brightai-indexnow-"));
  const key = "e158df443f2742d281a02c4aeecb4a60";
  await fs.writeFile(path.join(root, `${key}.txt`), `${key}\n`, "utf8");

  const result = await loadKey(root, `${key}.txt`);

  assert.equal(result, key);
});

test("rejects a key file whose contents do not match its filename", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "brightai-indexnow-"));
  await fs.writeFile(path.join(root, "expected-key.txt"), "different-key\n", "utf8");

  await assert.rejects(
    loadKey(root, "expected-key.txt"),
    /must match the key filename/i,
  );
});

test("loads loc values from sitemap XML", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "brightai-indexnow-"));
  await fs.writeFile(
    path.join(root, "sitemap.xml"),
    [
      '<?xml version="1.0" encoding="UTF-8"?>',
      "<urlset>",
      "  <url><loc>https://brightai.site/</loc></url>",
      "  <url><loc>https://brightai.site/solutions/</loc></url>",
      "</urlset>",
    ].join("\n"),
    "utf8",
  );

  assert.deepEqual(await loadSitemapUrls(root), [
    "https://brightai.site/",
    "https://brightai.site/solutions/",
  ]);
});

test("normalizes, deduplicates, and rejects URLs outside the site host", () => {
  assert.deepEqual(
    normalizeUrls([
      "https://brightai.site/",
      "https://brightai.site/solutions/",
      "https://brightai.site/solutions/",
    ]),
    ["https://brightai.site/", "https://brightai.site/solutions/"],
  );

  assert.throws(
    () => normalizeUrls(["https://example.com/"]),
    /must belong to brightai\.site/i,
  );
  assert.throws(
    () => normalizeUrls(["http://brightai.site/"]),
    /must use https/i,
  );
});

test("builds an IndexNow payload with the public key location", () => {
  const key = "e158df443f2742d281a02c4aeecb4a60";
  assert.deepEqual(buildPayload(key, ["https://brightai.site/"]), {
    host: "brightai.site",
    key,
    keyLocation: `https://brightai.site/${key}.txt`,
    urlList: ["https://brightai.site/"],
  });
});
