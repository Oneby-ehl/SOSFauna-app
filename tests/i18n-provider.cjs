// Render the real root/provider with React; only router and native host APIs are substituted.
/* global __dirname */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const ts = require("typescript");

const root = path.resolve(__dirname, "..");
function createRuntime(platform, pathname, englishPublished = false) {
  const cache = new Map();
  const observed = [];
  let provider;
  function Probe() {
    const value = provider.useI18n();
    observed.push({ locale: value.locale, label: value.t("language", "selectorLabel") });
    return React.createElement("span", null, "Contenido español sin cambios");
  }
  const Stack = () => React.createElement(Probe);
  Stack.Screen = function Screen() { return null; };
  const native = { Platform: { OS: platform } };
  const router = { usePathname: () => pathname, Stack };
  const versionGate = ({ children }) => React.createElement(React.Fragment, null,
    React.createElement(Probe), children);
  function load(relativePath) {
    const filename = path.resolve(root, relativePath);
    if (cache.has(filename)) return cache.get(filename);
    const exports = {};
    cache.set(filename, exports);
    const code = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022,
        jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
      fileName: filename,
    }).outputText;
    vm.runInNewContext("(function(exports, require) {" + code + "\n})", {}, { filename })(exports,
      (specifier) => {
        if (specifier === "react" || specifier === "react/jsx-runtime") return require(specifier);
        if (specifier === "react-native") return native;
        if (specifier === "expo-router") return router;
        if (specifier === "@/components/AppVersionGate") return versionGate;
        if (specifier === "@/components/faq/TopicFaqHeader") return {
          TopicFaqBackButton: () => null, TopicFaqHeaderTitle: () => null,
        };
        const base = specifier.startsWith("@/") ? path.resolve(root, specifier.slice(2))
          : path.resolve(path.dirname(filename), specifier);
        const file = [base + ".ts", base + ".tsx"].find(candidate => fs.existsSync(candidate));
        assert.ok(file, "Unexpected dependency: " + specifier);
        return load(path.relative(root, file));
      });
    return exports;
  }
  // Isolated in-memory future configuration; the actual flags stay disabled.
  load("i18n/config.ts").languageFeatures = {
    englishPublished, selectorEnabled: false, automaticRedirectEnabled: false,
  };
  provider = load("i18n/I18nProvider.tsx");
  return { load, observed, Probe };
}

const unchangedMarkup = "<span>Contenido español sin cambios</span>";
for (const platform of ["web", "android", "ios"]) {
  for (const pathname of ["/", "/about", "/faq", "/faq/vencejos", "/faq/murcielagos",
    "/centros", "/sources", "/contact", "/privacy", "/legal", "/aviso", "/history", "/en/", "/en/faq/bats"]) {
    const runtime = createRuntime(platform, pathname);
    const Root = runtime.load("app/_layout.tsx").default;
    assert.equal(renderToStaticMarkup(React.createElement(Root)), unchangedMarkup.repeat(2), platform + pathname);
    assert.equal(runtime.observed.length, 2, "Provider must cover both version gate and navigation");
    runtime.observed.forEach(value => assert.deepEqual(value, { locale: "es", label: "Idioma" }));
  }
}
for (const platform of ["web", "android"]) {
  const runtime = createRuntime(platform, "/en/", true);
  const Provider = runtime.load("i18n/I18nProvider.tsx").I18nProvider;
  assert.equal(renderToStaticMarkup(React.createElement(Provider, null, React.createElement(runtime.Probe))), unchangedMarkup);
  assert.equal(runtime.observed[0].locale, platform === "web" ? "en" : "es");
}
console.log("PASS: real root/provider context renders without extra DOM; Spanish across current routes on web/Android/iOS, unpublished English stays Spanish, future English remains web-only. Native APIs are simulated, not a device test.");
