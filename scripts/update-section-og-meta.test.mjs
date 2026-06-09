import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

const scriptUrl = new URL("./update-section-og-meta.mjs", import.meta.url);

function transform(relPath, html) {
  const result = spawnSync(process.execPath, [scriptUrl.pathname, "--transform", relPath], {
    input: html,
    encoding: "utf8",
  });

  assert.equal(result.status, 0, result.stderr);
  return result.stdout;
}

test("assigns the blog OG image and upgrades the Twitter card", () => {
  const output = transform(
    "blog/example/index.html",
    `<!DOCTYPE html><html><head>
<title>مقال تجريبي</title>
<meta name="description" content="وصف المقال">
<link rel="canonical" href="https://brightai.site/blog/example/">
<meta property="og:image" content="https://brightai.site/frontend/assets/images/logo.png">
<meta name="twitter:card" content="summary">
</head><body><h1>مقال تجريبي</h1></body></html>`,
  );

  assert.match(output, /frontend\/assets\/images\/og\/og-blog\.png/);
  assert.match(output, /twitter:card" content="summary_large_image/);
});

test("normalizes Twitter metadata from property to name attributes", () => {
  const output = transform(
    "blog/example/index.html",
    `<!DOCTYPE html><html><head>
<title>مقال تجريبي</title>
<meta name="description" content="وصف المقال">
<link rel="canonical" href="https://brightai.site/blog/example/">
<meta property="twitter:title" content="عنوان قديم">
<meta property="twitter:description" content="وصف قديم">
<meta property="twitter:image" content="https://brightai.site/old.png">
</head><body><h1>مقال تجريبي</h1></body></html>`,
  );

  assert.match(output, /name="twitter:title"/);
  assert.match(output, /name="twitter:description"/);
  assert.match(output, /name="twitter:image"/);
  assert.doesNotMatch(output, /property="twitter:/);
});

test("removes placeholder profile URLs without breaking embedded JSON-LD", () => {
  const output = transform(
    "index.html",
    `<!DOCTYPE html><html><head>
<title>BrightAI</title>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "sameAs": [
    "https://github.com/brightai-site",
    "https://www.wikidata.org/wiki/[QID]"
  ]
}
</script>
</head><body><h1>BrightAI</h1></body></html>`,
  );

  assert.doesNotMatch(output, /\[QID\]/);
  const jsonLd = output.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1];
  assert.deepEqual(JSON.parse(jsonLd).sameAs, ["https://github.com/brightai-site"]);
});

test("adds complete image metadata to a docs page", () => {
  const output = transform(
    "docs/example/index.html",
    `<!DOCTYPE html><html><head>
<title>دليل تجريبي</title>
<meta name="description" content="وصف الدليل">
<link rel="canonical" href="https://brightai.site/docs/example/">
</head><body><h1>دليل تجريبي</h1></body></html>`,
  );

  assert.match(output, /property="og:image" content="https:\/\/brightai\.site\/frontend\/assets\/images\/og\/og-docs\.png"/);
  assert.match(output, /property="og:image:width" content="1200"/);
  assert.match(output, /property="og:image:height" content="630"/);
  assert.match(output, /name="twitter:image" content="https:\/\/brightai\.site\/frontend\/assets\/images\/og\/og-docs\.png"/);
});

test("adds self-referencing Arabic hreflang to kernel pages only when missing", () => {
  const output = transform(
    "kernel/audit.html",
    `<!DOCTYPE html><html><head>
<title>سجل التدقيق</title>
<meta name="description" content="وصف سجل التدقيق">
<link rel="canonical" href="https://brightai.site/kernel/audit/">
</head><body><h1>سجل التدقيق</h1></body></html>`,
  );

  assert.match(output, /hreflang="ar-SA" href="https:\/\/brightai\.site\/kernel\/audit\/"/);
  assert.match(output, /hreflang="x-default" href="https:\/\/brightai\.site\/kernel\/audit\/"/);
  assert.doesNotMatch(output, /hreflang="en-SA"/);
});

test("does not modify HTML inside agent configuration directories", (t) => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), "brightai-og-meta-"));
  t.after(() => fs.rmSync(workspace, { recursive: true, force: true }));
  fs.mkdirSync(path.join(workspace, ".agents", "skills"), { recursive: true });
  fs.mkdirSync(path.join(workspace, "blog"), { recursive: true });

  const protectedHtml = "<!DOCTYPE html><html><head><title>قالب</title></head><body></body></html>";
  fs.writeFileSync(path.join(workspace, ".agents", "skills", "template.html"), protectedHtml);
  fs.writeFileSync(
    path.join(workspace, "blog", "index.html"),
    "<!DOCTYPE html><html><head><title>مدونة</title></head><body></body></html>",
  );

  const result = spawnSync(process.execPath, [scriptUrl.pathname], {
    cwd: workspace,
    encoding: "utf8",
  });

  assert.equal(result.status, 0, result.stderr);
  assert.equal(
    fs.readFileSync(path.join(workspace, ".agents", "skills", "template.html"), "utf8"),
    protectedHtml,
  );
  assert.match(
    fs.readFileSync(path.join(workspace, "blog", "index.html"), "utf8"),
    /og-blog\.png/,
  );
});
