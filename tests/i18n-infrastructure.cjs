// Pure infrastructure checks. No browser, network, filesystem writes or app storage.
/* global __dirname */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");

const root = path.resolve(__dirname, "..");
const cache = new Map();
function load(relativePath) {
  const filename = path.resolve(root, relativePath);
  if (cache.has(filename)) return cache.get(filename);
  const exports = {};
  cache.set(filename, exports);
  const code = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    fileName: filename,
  }).outputText;
  vm.runInNewContext("(function(exports, require) {" + code + "\n})", {}, { filename })(
    exports,
    (specifier) => {
      assert.ok(specifier.startsWith("."), "Infrastructure must not load platform or external services");
      return load(path.relative(root, path.resolve(path.dirname(filename), specifier + ".ts")));
    },
  );
  return exports;
}

const { languageFeatures } = load("i18n/config.ts");
const { resolveRouteLocale, matchLocalizedRoute, getLocalizedPath, getAvailableLocalizedUrl } = load("i18n/routes.ts");
const { resolveBrowserLocale, resolveInitialNavigation, readLanguagePreference, writeLanguagePreference } = load("i18n/selection.ts");
const { translate, createTranslator } = load("i18n/translate.ts");
const published = { englishPublished: true, selectorEnabled: true, automaticRedirectEnabled: true };

assert.equal(languageFeatures.englishPublished, false);
assert.equal(languageFeatures.selectorEnabled, false);
assert.equal(languageFeatures.automaticRedirectEnabled, false);

const approved = [
  ["home", "/", "/en/"], ["about", "/about", "/en/about"],
  ["faq", "/faq", "/en/faq"], ["swifts", "/faq/vencejos", "/en/faq/swifts"],
  ["bats", "/faq/murcielagos", "/en/faq/bats"], ["centers", "/centros", "/en/wildlife-help"],
  ["sources", "/sources", "/en/sources"], ["contact", "/contact", "/en/contact"],
  ["privacy", "/privacy", "/en/privacy"], ["legal", "/legal", "/en/legal"],
  ["guide", "/aviso", "/en/guide"], ["history", "/history", "/en/history"],
];
for (const [id, es, en] of approved) {
  assert.equal(getLocalizedPath(id, "es"), es);
  assert.equal(getLocalizedPath(id, "en"), en);
  assert.equal(matchLocalizedRoute(es), id);
  assert.equal(matchLocalizedRoute(en), id);
  assert.equal(resolveRouteLocale(es), "es");
  assert.equal(resolveRouteLocale(en), "en");
  assert.equal(resolveRouteLocale(en, "native"), "es");
  assert.equal(getAvailableLocalizedUrl(es, "en", "web"), null);
  assert.equal(getAvailableLocalizedUrl(es, "en", "web", published), en);
  assert.equal(getAvailableLocalizedUrl(en, "es", "web", published), es);
  assert.equal(getAvailableLocalizedUrl(es, "en", "native", published), null);
}
assert.equal(matchLocalizedRoute("/faq/vencejos/?q=bird#answer"), "swifts");
assert.equal(getAvailableLocalizedUrl("/aviso?mode=continue&animalType=bat#step-2", "en", "web", published), "/en/guide?mode=continue&animalType=bat#step-2");
assert.equal(getAvailableLocalizedUrl("/en/guide?mode=continue", "es", "web"), "/aviso?mode=continue");
for (const url of ["/unknown", "/english", "//example.org/en/", "https://example.org/en/", "/en/unknown"]) {
  assert.equal(getAvailableLocalizedUrl(url, "es", "web"), null);
}
assert.equal(resolveRouteLocale("/english"), "es");
assert.equal(resolveRouteLocale("/en"), "en");
assert.equal(resolveBrowserLocale(["fr-FR", "en-US", "es"]), "en");
assert.equal(resolveBrowserLocale(["es-MX", "en"]), "es");
assert.equal(resolveBrowserLocale(["en-GB"]), "en");
assert.equal(resolveBrowserLocale(["fr", "de"]), "es");

const entry = { url: "/", platform: "web", browserLanguages: ["en-GB"], entryIntent: "initial-home" };
assert.equal(resolveInitialNavigation(entry).redirectTo, null);
assert.equal(resolveInitialNavigation({ ...entry, features: { ...published, englishPublished: false } }).redirectTo, null);
assert.equal(resolveInitialNavigation({ ...entry, features: published }).redirectTo, "/en/");
assert.equal(resolveInitialNavigation({ ...entry, features: published, preferredLocale: "es" }).redirectTo, null);
assert.equal(resolveInitialNavigation({ ...entry, features: published, preferredLocale: "en", browserLanguages: ["es"] }).redirectTo, "/en/");
assert.equal(resolveInitialNavigation({ ...entry, features: published, entryIntent: "explicit" }).redirectTo, null);
assert.equal(resolveInitialNavigation({ url: "/", platform: "web", features: published, browserLanguages: ["en"] }).redirectTo, null);
assert.equal(resolveInitialNavigation({ ...entry, features: published, platform: "native" }).redirectTo, null);
for (const url of ["/about", "/?source=shared", "/#help"]) {
  assert.equal(resolveInitialNavigation({ ...entry, url, features: published }).redirectTo, null);
}
const directEnglish = resolveInitialNavigation({ ...entry, url: "/en/faq/bats", preferredLocale: "es", features: published });
assert.equal(directEnglish.locale, "en");
assert.equal(directEnglish.redirectTo, null);

const writes = [];
assert.equal(readLanguagePreference({ getItem: () => "en-GB" }), null);
assert.equal(readLanguagePreference({ getItem: () => "en" }), "en");
assert.equal(readLanguagePreference({ getItem: () => { throw Error("Storage blocked"); } }), null);
assert.equal(writeLanguagePreference({ setItem: (key, value) => writes.push([key, value]) }, "es"), true);
assert.deepEqual(writes, [["sosFauna:preferredLocale", "es"]]);
assert.equal(writeLanguagePreference({ setItem: () => { throw Error("Storage blocked"); } }, "en"), false);
assert.equal(translate("es", "language", "selectorLabel"), "Idioma");
assert.equal(createTranslator("en")("language", "selectorLabel"), "Language");
assert.equal(createTranslator("en")("language", "es"), "Español");
assert.equal(createTranslator("en")("home", "heroTitle"), createTranslator("es")("home", "heroTitle"));
assert.equal(createTranslator("en")("navigation", "guide"), "Guía de ayuda asistida");
assert.equal(translate("es", "home", "pendingCaseConfirmation"), "Hay un aviso sin finalizar.\n\n¿Deseas eliminarlo e iniciar una nueva guía de ayuda?");
assert.equal(translate("es", "versionFooter", "versionSeparator"), " · Versión ");

console.log("PASS: 12 approved route pairs, publication gates, URL precedence, native Spanish, query/fragment preservation, browser preference, storage failures and catalogs.");
