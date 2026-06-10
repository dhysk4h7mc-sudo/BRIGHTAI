# BrightAI Wikipedia, Wikidata, and Organization Schema Design

## Goal

Prepare a neutral Arabic Wikipedia draft and a Wikidata creation package for
BrightAI, then correct the site's Organization schema so it references only
verified official profiles and, after creation, the real Wikipedia and Wikidata
entities.

## Deliverables

1. An Arabic Wikipedia article draft for BrightAI.
2. Exact account and submission steps for publishing through Wikipedia's Draft
   namespace and Articles for Creation workflow.
3. A Wikidata entity package containing:
   - Human-readable statement instructions.
   - A JSON-LD representation for reuse outside Wikidata.
   - `instance of` statements for software application and company.
   - Country, official website, logo image, and verified social profiles.
4. Corrected Organization JSON-LD in the website source.
5. Validation results for all changed structured data.

## Wikipedia Draft

The draft will be written in Arabic with a neutral encyclopedic tone. It will
cover:

- BrightAI as a Saudi AI safety and governance platform.
- Founding in Saudi Arabia in 2025, based on the existing project data.
- The AI Firewall and AI Governance Dashboard products.
- Product alignment with NCA ECC, NDMO, and PDPL requirements.
- References split by purpose:
  - Independent sources about BrightAI for company-specific claims.
  - Primary BrightAI pages for basic product descriptions only.
  - Government sources for the scope and existence of Saudi regulations.

The article body will not contain editorial warnings about publication
readiness. Unsupported claims, certifications, customer counts, awards, market
leadership, and regulatory approval will not be invented.

## Source Policy

Government regulations can establish what NCA ECC, NDMO, and PDPL require, but
they cannot establish BrightAI's notability or prove that BrightAI is certified
or endorsed. Wording will therefore use accurate descriptions such as
"designed to support alignment" rather than "certified" or "fully compliant"
unless an authoritative source directly verifies certification.

Any independent company coverage found during research will be cited. If a
requested company-specific statement has no reliable source, the draft will
omit or narrowly qualify it rather than fabricate a citation.

## Wikidata Package

Wikidata statements will be represented as an item-creation checklist because
Wikidata does not directly import Schema.org JSON-LD as an item.

Planned statements:

- `P31`: software application.
- `P31`: company.
- `P17`: Saudi Arabia.
- `P856`: `https://brightai.site/`.
- `P571`: 2025, when supported by an acceptable reference.
- `P18`: the Wikimedia Commons filename after the logo is uploaded with valid
  copyright and licensing information.
- Official X username: `yeaeeae`.
- Official Instagram username: `brightai_`.

The accompanying JSON-LD will use Schema.org vocabulary and will not pretend
that Schema.org properties are Wikidata statements. No LinkedIn, GitHub, or
Crunchbase profiles will be included because the user confirmed that BrightAI
does not have official accounts on those services.

## Organization Schema Changes

The site's canonical Organization entity is
`https://brightai.site/#organization`. Its `sameAs` values will be corrected to
contain only verified identity URLs:

- `https://x.com/yeaeeae`
- `https://www.instagram.com/brightai_/`
- The Arabic Wikipedia URL after the article is actually created.
- The Wikidata item URL after the item is actually created.

Nonexistent or incorrectly attributed LinkedIn, GitHub, and Crunchbase URLs
will be removed. Wikipedia and Wikidata placeholders will not be published in
production markup. The implementation will update the source pattern or
generator responsible for repeated Organization schema where one exists;
otherwise, it will update the owned HTML surface consistently.

## Files

Final artifacts will be kept under `reports/wikipedia-wikidata/`:

- `brightai-wikipedia-draft-ar.md`
- `wikipedia-publishing-steps-ar.md`
- `brightai-wikidata-statements-ar.md`
- `brightai-wikidata.jsonld`
- `schema-validation-report.md`

Production HTML and schema source files will be changed only where required to
correct the canonical Organization entity.

## Validation

Validation will include:

1. Parse every changed JSON-LD block as JSON.
2. Confirm that removed LinkedIn, GitHub, and Crunchbase URLs no longer appear
   in Organization `sameAs` arrays on the owned production surface.
3. Confirm the verified X and Instagram URLs are present.
4. Confirm no nonexistent Wikipedia or Wikidata URL is added.
5. Run the repository's schema and SEO checks relevant to the changed files.
6. Report any environmental or pre-existing failures without hiding them.

