// Compare current Spanish FAQ content/search/rendering before and after phase 2E.
/* global __dirname */
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");
const { withBrowser } = require("./browser-local.cjs");
const { collect, createHarness } = require("./faq-regression.cjs");
const root = path.resolve(__dirname, "..");
const baselineFile = path.join(root, ".expo/i18n-2e/faq-before.json");
const capture = process.argv.includes("--capture");
const digest = value => crypto.createHash("sha256").update(value).digest("hex");
assert.equal(fs.existsSync(baselineFile), !capture, "Capture once before extraction; do not overwrite the baseline");
function htmlSnapshot(dir, prefix = "") {
  return Object.fromEntries(fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name), name = prefix + entry.name;
    if (entry.isDirectory()) return Object.entries(htmlSnapshot(full, name + "/"));
    return name.endsWith(".html") ? [[name, digest(fs.readFileSync(full, "utf8").replace(/_expo\/static\/js\/web\/entry-[a-f0-9]+\.js/g, "_expo/static/js/web/entry-HASH.js"))]] : [];
  }));
}

withBrowser(async ({ origin, newContext, dist }) => {
  const h = createHarness(), source = collect();
  const snapshots = { records: source.faqItems, scenarios: source.scenarios, topics: h.topics,
    html: htmlSnapshot(dist), sitemap: digest(fs.readFileSync(path.join(dist, "sitemap.xml"))),
    protected: {}, helpers: {}, actions: {}, browserScenarios: [], topicQueries: {}, screens: {} };
  assert.equal(source.faqItems.length, 92);
  assert.equal(new Set(source.faqItems.map(item => item.id)).size, 92);
  assert.equal(h.run([])[0].displayed.length, 32);
  assert.equal(h.topics.vencejos.items.length, 54);
  assert.equal(h.topics.murcielagos.items.length, 6);
  const excluded = ["components/sos/SosAssistant.tsx", "utils/faqSearch.ts", "data/faqSearchKeywords.ts", "data/animalSearchCatalog.ts",
    "services/rescueStorage.ts", "services/rescueCaseService.ts", "app/aviso.tsx", "app/history.tsx", "types/rescueCase.ts",
    "components/contacts/RecoveryCentersPage.tsx", "components/contacts/PublicRecoveryCenters.web.tsx", "data/helpContacts.ts", "data/marineHelpContacts.ts", "lib/provinceContacts.ts",
    "components/faq/TopicFaqAccordion.tsx", "components/faq/TopicFaqAccordion.web.tsx", "components/seo/SeoHead.tsx", "app/+html.tsx", "app/_layout.tsx",
    "app/faq.tsx", "app/faq/vencejos.tsx", "app/faq/murcielagos.tsx", "i18n/config.ts", "i18n/routes.ts", "app.json", "package.json", "package-lock.json", "scripts/generate-sitemap.js"];
  for (const file of excluded) snapshots.protected[file] = digest(fs.readFileSync(path.join(root, file)));
  const code = fs.readFileSync(path.join(root, "components/faq/FaqPage.tsx"), "utf8");
  const ast = ts.createSourceFile("FaqPage.tsx", code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  for (const node of ast.statements.filter(ts.isFunctionDeclaration)) {
    if (node.name?.text !== "FaqPage") snapshots.helpers[node.name.text] = node.getText(ast);
  }
  const component = ast.statements.find(node => ts.isFunctionDeclaration(node) && node.name?.text === "FaqPage");
  for (const node of component.body.statements.filter(ts.isVariableStatement).flatMap(node => node.declarationList.declarations)) {
    if (["startNotice", "toggleItem", "scrollToCategory", "scheduleCategoryScroll", "handleCategoryPress", "clearSearch", "selectAnimalSearchResult", "handleSearchQueryChange"].includes(node.name.getText(ast))) snapshots.actions[node.name.getText(ast)] = node.getText(ast);
  }

  const errors = [];
  const observeErrors = page => {
    page.on("pageerror", error => errors.push(error.message));
    page.on("console", message => { if (message.type() === "error" && /hydrati|did not match|Minified React error/i.test(message.text())) errors.push(message.text()); });
  };
  const context = await newContext({ locale: "en-GB" });
  await context.addInitScript(() => localStorage.setItem("sosFauna:lastVersionCheckAt", new Date().toISOString()));
  const page = await context.newPage();
  observeErrors(page);
  const generalInput = () => page.getByRole("textbox", { name: "Buscar una pregunta frecuente", exact: true });
  const generalState = () => page.evaluate(() => ({
    questions: [...document.querySelectorAll('[aria-label^="Abrir pregunta: "], [aria-label^="Cerrar pregunta: "]')].map(node => node.getAttribute("aria-label").replace(/^(Abrir|Cerrar) pregunta: /, "")),
    suggestions: [...document.querySelectorAll('[aria-label^="Seleccionar "]')].map(node => node.getAttribute("aria-label")),
    expanded: [...document.querySelectorAll('[aria-label^="Cerrar pregunta: "]')].map(node => node.getAttribute("aria-label")),
    cards: [...document.querySelectorAll('[aria-label^="Abrir pregunta: "], [aria-label^="Cerrar pregunta: "]')].map(node => node.parentElement.textContent),
  }));
  for (const scenario of source.scenarios) {
    await page.goto(origin + "/faq");
    await page.waitForFunction(() => Object.keys(document.querySelector("input")).some(key => key.startsWith("__reactProps")));
    const states = [await generalState()];
    for (const [index, action] of scenario.actions.entries()) {
      if (action.type === "query") await generalInput().fill(action.value);
      else if (action.type === "clear") await page.getByRole("button", { name: "Limpiar búsqueda", exact: true }).click();
      else if (action.type === "select") {
        const animal = h.catalog.animalSearchCatalog.find(item => item.id === action.value);
        await page.getByRole("button", { name: "Seleccionar " + animal.name, exact: true }).click();
      } else if (action.type === "toggle") {
        const item = action.value === "que-hacer-si-encuentro-animal" ? scenario.snapshots[index].intro : h.data.faqItems.find(item => item.id === action.value);
        const name = item.question.replace(/[.*+?$^{}()|[\]\\]/g, "\\$&");
        await page.getByRole("button", { name: new RegExp("^(Abrir|Cerrar) pregunta: " + name + "$") }).click();
      }
      await page.waitForTimeout(50);
      states.push(await generalState());
    }
    for (const [index, observed] of states.entries()) {
      const expected = scenario.snapshots[index];
      const ids = expected.visibleGroups.flatMap(group => group.ids);
      const questionFor = id => id === "que-hacer-si-encuentro-animal" ? expected.intro.question : h.data.faqItems.find(item => item.id === id).question;
      assert.deepEqual(observed.questions, ids.map(questionFor), scenario.name + ": source/browser result order");
      assert.deepEqual(observed.suggestions, expected.suggestions.map(id => "Seleccionar " + h.catalog.animalSearchCatalog.find(item => item.id === id).name));
      assert.deepEqual(observed.expanded, ids.filter(id => id === expected.open).map(id => "Cerrar pregunta: " + questionFor(id)));
    }
    snapshots.browserScenarios.push({ name: scenario.name, states });
  }

  const definitions = [
    { route: "/faq", label: "Buscar una pregunta frecuente", items: h.data.faqItems.filter(item => h.run([])[0].displayed.includes(item.id)), count: 32 },
    ...Object.values(h.topics).map(topic => ({ route: topic.path, label: topic.searchLabel, items: topic.items, count: topic.items.length })),
  ];
  for (const definition of definitions) {
    const staticContext = await newContext({ javaScriptEnabled: false });
    const staticPage = await staticContext.newPage();
    await staticPage.goto(origin + definition.route);
    const text = await staticPage.locator("#root").textContent();
    for (const item of definition.items) {
      assert.ok(text.includes(item.question), "Missing static question " + item.id);
      assert.ok(text.includes(item.answer), "Missing static answer " + item.id);
    }
    if (definition.route !== "/faq") {
      assert.equal(await staticPage.locator("details").count(), definition.count);
      await staticPage.locator("summary").first().focus();
      await staticPage.keyboard.press("Enter");
      assert.equal(await staticPage.locator("details[open]").count(), 1);
      await staticPage.keyboard.press("Space");
      assert.equal(await staticPage.locator("details[open]").count(), 0);
    }
    await staticContext.close();
    for (const width of [390, 1280]) {
      await page.setViewportSize({ width, height: 844 });
      await page.goto(origin + definition.route);
      await page.waitForFunction(() => Object.keys(document.querySelector("input")).some(key => key.startsWith("__reactProps")));
      await page.evaluate(async () => { await document.fonts.ready; await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))); });
      assert.equal(await page.locator("html").getAttribute("lang"), "es");
      const screen = async state => {
        snapshots.screens[definition.route + ":" + width + ":" + state] = {
          dom: digest(await page.locator("#root").innerHTML()),
          screenshot: digest(await page.screenshot({ fullPage: true, animations: "disabled" })),
        };
      };
      await screen("closed");
      const first = definition.route === "/faq" ? page.getByRole("button", { name: /^Abrir pregunta: / }).first() : page.locator("summary").first();
      await first.focus();
      await page.keyboard.press("Enter");
      await screen("expanded");
      if (definition.route === "/faq") assert.equal(await page.locator('[aria-label^="Cerrar pregunta: "]').count(), 1);
      else assert.equal(await page.locator("details[open]").count(), 1);
      await page.keyboard.press("Space");
      assert.ok(await page.locator('a[href="/"]').count());
      assert.ok(await page.locator('link[rel="canonical"][href="https://sosfauna.es' + definition.route + '"]').count());
    }
    if (definition.route !== "/faq") {
      const input = page.getByRole("textbox", { name: definition.label, exact: true });
      for (const query of ["", "agua", "caja", "cría", "no vuela", "gato", "vencejo", "murciélago", "caja.", "xyzsinresultado", "que la"]) {
        await input.fill(query);
        const expected = h.search.searchFaqItems(definition.items, query).map(item => item.id);
        await page.waitForFunction(ids => JSON.stringify([...document.querySelectorAll("details")].map(node => node.id)) === JSON.stringify(ids), expected);
        snapshots.topicQueries[definition.route + ":" + query] = expected;
      }
      await page.getByRole("button", { name: "Limpiar búsqueda", exact: true }).click();
      assert.ok(await input.evaluate(node => document.activeElement === node));
      assert.equal(await page.locator("details").count(), definition.count);
    }
  }
  await page.goto(origin + "/faq");
  await page.waitForFunction(() => Object.keys(document.querySelector("input")).some(key => key.startsWith("__reactProps")));
  await generalInput().fill("murciélago");
  await page.locator('[aria-label^="Cerrar pregunta: "]').first().waitFor();
  await page.getByRole("button", { name: "Guía de ayuda asistida", exact: true }).first().click();
  await page.getByText("Vivo", { exact: true }).waitFor();
  // The existing assistant's history guard can replace the transient URL. Check the
  // active screen, as rescue-flows does, and preserve startNotice's exact source above.
  assert.deepEqual(errors, []);
  await context.close();
  if (capture) {
    fs.mkdirSync(path.dirname(baselineFile), { recursive: true });
    fs.writeFileSync(baselineFile, JSON.stringify(snapshots));
    console.log("Captured pre-2E baseline: 92 FAQ records, 49 actual source/browser search scenarios, topics, static HTML, mobile/desktop DOM/screenshots and excluded sources.");
  } else {
    const before = JSON.parse(fs.readFileSync(baselineFile, "utf8"));
    // Modules execute in a VM realm. Compare their full serializable data with
    // the original JSON reference, without realm-specific object/array prototypes.
    const current = JSON.parse(JSON.stringify(snapshots));
    for (const key of ["records", "topics", "scenarios", "html", "sitemap", "protected", "helpers", "actions", "topicQueries", "screens"]) assert.deepEqual(current[key], before[key], "FAQ difference: " + key);
    assert.equal(digest(JSON.stringify(snapshots.browserScenarios)), digest(JSON.stringify(before.browserScenarios)), "FAQ browser results/answers/order changed");
    console.log("PASS: 32 general + 54 swift + 6 bat FAQ identical; 49 source/browser scenarios and 22 topic searches preserve results/order/content; 18 HTML and sitemap identical; native accordions, accessibility, mobile/desktop rendering, guide action and excluded sources preserved.");
  }
}).catch(error => { console.error(error); process.exitCode = 1; });
