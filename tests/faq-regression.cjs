// Local regression harness: executes original TypeScript expressions in memory.
// No network, React Native runtime, source rewrites or alternate search algorithm.
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
const ts = require("typescript");
const root = path.resolve(__dirname, "..");
const baselinePath = path.join(__dirname, "fixtures", "faq-before-seo.json");
const read = (name) => fs.readFileSync(path.join(root, name), "utf8");
const digest = (value) => crypto.createHash("sha256").update(value).digest("hex");
const protectedFiles = [
  "utils/faqSearch.ts", "data/faq.ts", "data/faqSearchKeywords.ts",
  "data/animalSearchCatalog.ts", "components/sos/SosAssistant.tsx",
  "types/rescueCase.ts", "services/rescueStorage.ts", "services/rescueCaseService.ts",
  "app/aviso.tsx", "app/history.tsx",
];
function parse(name) {
  return ts.createSourceFile(name, read(name), ts.ScriptTarget.Latest, true,
    name.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
}
function evaluate(source, name, requireFn, globals = {}) {
  const code = ts.transpileModule(source, {
    fileName: name,
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022,
      jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  }).outputText;
  const exports = {};
  vm.runInNewContext("(function(exports, require) {" + code + "\n})", globals,
    { filename: name })(exports, requireFn);
  return exports;
}
function createHarness() {
  const modules = new Map();
  const load = (name) => {
    if (modules.has(name)) return modules.get(name);
    const value = evaluate(read(name), name, (specifier) => {
      const base = specifier.startsWith("@/") ? specifier.slice(2)
        : path.posix.join(path.posix.dirname(name), specifier);
      return load(base + ".ts");
    });
    modules.set(name, value);
    return value;
  };
  const data = load("data/faq.ts");
  const catalog = load("data/animalSearchCatalog.ts");
  const search = load("utils/faqSearch.ts");
  // Select the existing pure declarations. Do not reimplement advice decisions.
  const assistant = parse("components/sos/SosAssistant.tsx");
  const endpoint = assistant.statements.find((n) =>
    ts.isFunctionDeclaration(n) && n.name?.text === "getAdvice").end;
  const declarations = assistant.statements.filter((n) =>
    (ts.isFunctionDeclaration(n) && n.end <= endpoint) ||
    (ts.isVariableStatement(n) && n.declarationList.declarations.some((d) =>
      ["COMMON_END", "MARINE_ANIMAL_TYPES"].includes(d.name.getText(assistant)))));
  const advice = evaluate(declarations.map((n) => n.getText(assistant)).join("\n"),
    "advice.ts", () => { throw Error("Unexpected advice import"); });
  const page = parse("components/faq/FaqPage.tsx");
  const component = page.statements.find((n) =>
    ts.isFunctionDeclaration(n) && n.name?.text === "FaqPage");
  const lastReturn = [...component.body.statements].reverse().find(ts.isReturnStatement);
  const fields = [
    "searchQuery", "animalCatalogSearchState", "selectedAnimal", "openItemId",
    "selectedAnimalAdvice", "displayedFaqItems", "visibleFaqCategories", "groupedItems",
    "handleSearchQueryChange", "selectAnimalSearchResult", "clearSearch", "toggleItem",
  ];
  // Replace ONLY the final JSX return in memory to observe the actual component state.
  const original = read("components/faq/FaqPage.tsx");
  const instrumented = original.slice(0, lastReturn.getStart(page)) +
    "return {" + fields.join(",") + "};" + original.slice(lastReturn.end);
  // Freeze all computation before JSX as an additional guard against refactoring.
  const logicHash = digest(original.slice(0, lastReturn.getStart(page)));
  let states = [];
  let cursor = 0;
  let lastSearch = null;
  const react = {
    useMemo: (compute) => compute(),
    useRef: (current) => ({ current }),
    useState: (initial) => {
      const index = cursor++;
      if (!(index in states)) states[index] = typeof initial === "function" ? initial() : initial;
      return [states[index], (next) => {
        states[index] = typeof next === "function" ? next(states[index]) : next;
      }];
    },
  };
  const observedSearch = { ...search, searchFaqItems: (items, query) => {
    const results = search.searchFaqItems(items, query);
    lastSearch = { input: items.map((x) => x.id), output: results.map((x) => x.id) };
    return results;
  }};
  const runtime = evaluate(instrumented, "FaqPage.tsx", (specifier) => {
    if (specifier === "react") return react;
    if (specifier === "react/jsx-runtime") return {};
    if (specifier === "react-native") return { Platform: { OS: "web" }, StyleSheet: { create: (styles) => styles } };
    if (specifier === "expo-router") return { useRouter: () => ({ push() {} }) };
    if (specifier === "@/components/sos/SosAssistant") return advice;
    if (specifier === "@/components/seo/SeoHead") return {};
    if (specifier === "@/utils/faqSearch") return observedSearch;
    if (specifier === "@/data/faq") return data;
    if (specifier === "@/data/animalSearchCatalog") return catalog;
    throw Error("Unexpected page import " + specifier);
  }, { requestAnimationFrame: (fn) => fn() });
  const render = () => { cursor = 0; return runtime.default(); };
  const snapshot = (view) => ({
    query: view.searchQuery,
    selected: view.selectedAnimal?.id ?? null,
    suggestions: view.animalCatalogSearchState.results.map((x) => x.id),
    textMatch: view.animalCatalogSearchState.textMatch?.id ?? null,
    open: view.openItemId,
    categories: [...view.visibleFaqCategories],
    displayed: view.displayedFaqItems.map((x) => x.id),
    engine: lastSearch,
    visibleGroups: view.groupedItems.map((g) => ({
      category: g.category, ids: g.items.map((x) => x.id),
    })),
    intro: view.displayedFaqItems.find((x) => x.id === "que-hacer-si-encuentro-animal"),
  });
  const run = (actions) => {
    states = [];
    let view = render();
    const snapshots = [snapshot(view)];
    for (const action of actions) {
      if (action.type === "query") view.handleSearchQueryChange(action.value);
      else if (action.type === "select") {
        const animal = catalog.animalSearchCatalog.find((x) => x.id === action.value);
        assert.ok(animal, action.value);
        view.selectAnimalSearchResult(animal);
      } else if (action.type === "toggle") view.toggleItem(action.value);
      else if (action.type === "clear") view.clearSearch();
      else throw Error(action.type);
      view = render();
      snapshots.push(snapshot(view));
    }
    return snapshots;
  };
  return { data, catalog, search, run, logicHash };
}
const queries = [
  "", "   ", "que la", "animal herido", "fauna comida", "caja", "caja.",
  "agua", "¿agua?", "agua agua", "  AGUA   comida  ", "no puede volar",
  "ave que no vuela", "cría", "atrapado", "vencejo", "vencejos", "VÉNCEJOS",
  "apus apus", "vencejo en el suelo", "vencejo no vuela", "que hago con un vencejo",
  "encuentro un vencejo", "vencejo gato", "vencejo cristal", "agua vencejo",
  "murciélago", "murcielago", "murciélago en el suelo", "murciélago no vuela",
  "murciélago cría", "murciélago común", "murciélago enano",
  "vencejo murciélago", "mur", "gato", "zorro", "águila", "foca", "delfín",
  "ballena", "tortuga marina", "raya", "fauna marina", "tortuga", "xyzsinresultado",
];
function collect() {
  const h = createHarness();
  const cases = queries.map((query) => ({
    name: "query:" + query,
    actions: [{ type: "query", value: query }],
  }));
  cases.push(
    { name: "select-clear", actions: [
      { type: "query", value: "mur" }, { type: "select", value: "murcielago" },
      { type: "toggle", value: "murcielago" }, { type: "clear" },
    ] },
    { name: "switch-species", actions: ["vencejo", "murciélago cría", "foca", ""]
      .map((value) => ({ type: "query", value })) },
    { name: "select-specific-bat", actions: [
      { type: "query", value: "mur" }, { type: "select", value: "murcielago-comun" },
      { type: "query", value: "murciélago en el suelo" }, { type: "clear" },
    ] },
  );
  const assets = fs.readdirSync(path.join(root, "dist/_expo/static/js/web"))
    .filter((name) => name.endsWith(".js")).map((name) => ({
      name, bytes: fs.statSync(path.join(root, "dist/_expo/static/js/web", name)).size,
    }));
  return JSON.parse(JSON.stringify({
    protectedHashes: Object.fromEntries(protectedFiles.map((name) =>
      [name, digest(fs.readFileSync(path.join(root, name)))])),
    faqLogicHash: h.logicHash,
    landingLogicHash: digest(read("components/home/LandingPage.tsx").split("  return (\n    <SafeAreaView")[0]),
    faqItems: h.data.faqItems,
    animalCatalog: h.catalog.animalSearchCatalog,
    scenarios: cases.map((c) => ({ ...c, snapshots: h.run(c.actions) })),
    exportReference: {
      javascript: assets,
      faqBytes: fs.statSync(path.join(root, "dist/faq.html")).size,
      homeBytes: fs.statSync(path.join(root, "dist/index.html")).size,
    },
  }));
}
if (require.main === module) {
  const current = collect();
  if (process.argv.includes("--capture")) {
    assert.ok(!fs.existsSync(baselinePath), "Refusing to overwrite original baseline");
    fs.mkdirSync(path.dirname(baselinePath), { recursive: true });
    fs.writeFileSync(baselinePath, JSON.stringify(current, null, 2) + "\n");
    console.log("Captured " + current.scenarios.length + " scenarios, " +
      current.faqItems.length + " FAQ and " + current.animalCatalog.length + " animals.");
  } else {
    const baseline = JSON.parse(fs.readFileSync(baselinePath, "utf8"));
    for (const key of ["protectedHashes", "faqLogicHash", "landingLogicHash",
      "faqItems", "animalCatalog", "scenarios"]) {
      assert.deepStrictEqual(current[key], baseline[key], "Regression in " + key);
    }
    console.log("PASS: " + current.scenarios.length +
      " original FAQ scenarios; protected sources, content, suggestions and visible order unchanged.");
  }
}
module.exports = { createHarness, collect };
