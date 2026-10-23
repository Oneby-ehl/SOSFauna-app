/* global __dirname */
// Phase 2AH: search-only comparisons, without export, browser or baseline capture.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { execFileSync } = require("node:child_process");
const { createHarness } = require("./faq-regression.cjs");
const { restoreFaqLocale } = require("./helpers/faq-locale-2ag.cjs");
const root = path.resolve(__dirname, "..");
const hash = value => crypto.createHash("sha256").update(value).digest("hex");
const plain = value => JSON.parse(JSON.stringify(value));
const referenceFile = path.join(__dirname, "fixtures/faq-before-seo.json");
const referenceBytes = fs.readFileSync(referenceFile);
const reference = JSON.parse(referenceBytes);

// These git sources match the pre-2AG backups and original fixture source hashes
// after newline normalization. No algorithm is copied or reimplemented here.
const originalCommit = "a18d2f656b81fdf240b56d7ec4509f6765fb40b8";
const originalSources = {
  "utils/faqSearch.ts": "071dbb0b1812c0a42adf2bf416aa585d8616d2477c4ff27161b3dfc21fce74bb",
  "data/animalSearchCatalog.ts": "8e39628d26a46df10a56ffe24bd8c4459a05280345a4beb858e5679acd8c7ba1",
};
const moduleSources = Object.fromEntries(Object.entries(originalSources).map(([file, sha]) => {
  const source = execFileSync("git", ["show", originalCommit + ":" + file], { cwd: root, encoding: "utf8" });
  assert.equal(hash(source.replace(/\r\n/g, "\n")), sha, "Unrecognised original search source: " + file);
  return [file, source];
}));
const page = fs.readFileSync(path.join(root, "components/faq/FaqPage.tsx"), "utf8");
const originalPage = restoreFaqLocale(page);
// Independently checked against .expo/i18n-2ag/components_faq_FaqPage.tsx,
// captured before phase 2AG; do not update this digest to accept a later change.
assert.equal(hash(originalPage), "e2c4bb6cdd02f186b72a0ab5b499fad2790813819395ab3c15b37edd9c5ef9a1");
// Restore only the resolver binding/factory added in 2AG. Authenticate against
// the independently retained pre-2AG data_faq.ts, not against current output.
const dataSource = fs.readFileSync(path.join(root, "data/faq.ts"), "utf8").replace(/\r\n/g, "\n");
const originalData = 'import { faqContentEs } from "@/i18n/catalogs/faq.es";\n\n' +
  dataSource.slice(dataSource.indexOf("import {\n  FAQ_SEARCH_GROUPS"), dataSource.indexOf("\nexport type LocalizedFaqItem"))
    .replaceAll("faqContent[", "faqContentEs[");
assert.equal(hash(originalData), "de4f97292697471747372a5c47656d29b13106031ad57309f8fcfea405662afb");
moduleSources["data/faq.ts"] = originalData;
const before = createHarness({ faqPageSource: originalPage, moduleSources });
const current = createHarness();
assert.deepEqual(plain(current.catalog.animalSearchCatalog), reference.animalCatalog);
assert.deepEqual(plain(current.data.faqItems), plain(before.data.faqItems));

// Additional metadata introduced in 2AG is not a visible or search result field.
function visibleSnapshots(snapshots) {
  return plain(snapshots).map(snapshot => {
    if (snapshot.intro) {
      delete snapshot.intro.categoryId;
      delete snapshot.intro.categoryLabel;
    }
    return snapshot;
  });
}
let historicalExact = 0;
const historicalDifferences = [];
for (const scenario of reference.scenarios) {
  const expected = visibleSnapshots(before.run(scenario.actions));
  const actual = visibleSnapshots(current.run(scenario.actions));
  assert.deepEqual(actual, expected, "Difference introduced by 2AG: " + scenario.name);
  const selection = snapshots => snapshots.map(({ selected, suggestions, textMatch, categories }) =>
    ({ selected, suggestions, textMatch, categories }));
  assert.deepEqual(selection(actual), selection(scenario.snapshots), "Historical animal/category selection: " + scenario.name);
  try { assert.deepEqual(actual, scenario.snapshots); historicalExact++; }
  catch { historicalDifferences.push(scenario.name); }
}

const queries = new Set(reference.scenarios.flatMap(s => s.actions.filter(a => a.type === "query").map(a => a.value)));
for (const animal of reference.animalCatalog) {
  for (const term of current.catalog.getAnimalSearchTerms(animal)) {
    queries.add(term);
    queries.add("  " + term.toUpperCase() + "  ");
  }
}
const ids = items => items.map(item => item.id);
for (const query of queries) {
  assert.deepEqual(plain(current.catalog.getAnimalCatalogSearchState(query)), plain(before.catalog.getAnimalCatalogSearchState(query)), "Animal aliases/order: " + query);
  for (const topic of [null, "vencejos", "murcielagos"]) {
    const items = topic ? current.topics[topic].items : current.data.faqItems;
    const expected = ids(before.search.searchFaqItems(items, query));
    assert.deepEqual(ids(current.search.searchFaqItems(items, query)), expected, "FAQ relevance/order: " + query);
    assert.deepEqual(ids(current.search.getFaqSearchEngine("es").searchFaqItems(items, query)), expected);
    assert.deepEqual(ids(current.search.getFaqSearchEngine("en").searchFaqItems(items, query)), expected, "Spanish fallback");
  }
}
assert.equal(hash(fs.readFileSync(referenceFile)), hash(referenceBytes), "Historical reference modified");
console.log("PASS: " + reference.scenarios.length + " complete before/after 2AG scenarios; " + queries.size + " alias/query variants in general, swift and bat indexes; exact Spanish selection, categories, relevance and order.");
console.log("Historical pre-SEO fixture: animal selection/categories match all " + reference.scenarios.length + " scenarios; " + historicalExact + " complete scenarios match, " + historicalDifferences.length + " scenarios differ (also before 2AG). Original FAQ answers predate eight snake safety warnings; no reference was updated.");
if (historicalDifferences.length) console.log("Older-reference differences: " + historicalDifferences.join(", "));
