const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const { withBrowser } = require("./browser-local.cjs");
const { createHarness } = require("./faq-regression.cjs");
withBrowser(async ({ origin, newContext }) => {
  const fixturePath = path.join(__dirname, "fixtures/faq-browser-before-seo.json");
  const reference = JSON.parse(fs.readFileSync(path.join(__dirname, "fixtures/faq-before-seo.json"), "utf8"));
  const context = await newContext();
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const state = () => page.evaluate(() => ({
    questions: [...document.querySelectorAll('[aria-label^="Abrir pregunta: "], [aria-label^="Cerrar pregunta: "]')]
      .map((node) => node.getAttribute("aria-label").replace(/^(Abrir|Cerrar) pregunta: /, "")),
    suggestions: [...document.querySelectorAll('[aria-label^="Seleccionar "]')].map((node) => node.getAttribute("aria-label")),
    expanded: [...document.querySelectorAll('[aria-label^="Cerrar pregunta: "]')].map((node) => node.getAttribute("aria-label")),
  }));
  const snapshots = [];
  const h = createHarness();
  for (const scenario of reference.scenarios) {
    await page.goto(origin + "/faq");
    const input = page.getByRole("textbox", { name: "Buscar una pregunta frecuente", exact: true });
    await input.waitFor();
    await page.waitForFunction(() => Object.keys(document.querySelector('input[aria-label="Buscar una pregunta frecuente"]')).some((key) => key.startsWith("__reactProps")));
    const states = [await state()];
    for (const [index, action] of scenario.actions.entries()) {
      if (action.type === "query") await input.fill(action.value);
      else if (action.type === "clear") await page.getByRole("button", { name: "Limpiar búsqueda", exact: true }).click();
      else if (action.type === "select") {
        const animal = h.catalog.animalSearchCatalog.find((item) => item.id === action.value);
        await page.getByRole("button", { name: "Seleccionar " + animal.name, exact: true }).click();
      } else if (action.type === "toggle") {
        const item = action.value === "que-hacer-si-encuentro-animal" ? scenario.snapshots[index].intro
          : h.data.faqItems.find((item) => item.id === action.value);
        await page.getByRole("button", { name: new RegExp("^(Abrir|Cerrar) pregunta: " + item.question.replace(/[.*+?$^{}()|[\]\\]/g, "\\$&") + "$") }).click();
      }
      await page.waitForTimeout(50);
      states.push(await state());
    }
    for (const [index, observed] of states.entries()) {
      const expected = scenario.snapshots[index];
      const ids = expected.visibleGroups.flatMap((group) => group.ids);
      const questionFor = (id) => id === "que-hacer-si-encuentro-animal"
        ? expected.intro.question : h.data.faqItems.find((item) => item.id === id).question;
      assert.deepStrictEqual(observed.questions, ids.map(questionFor), scenario.name + ": source/DOM order");
      assert.deepStrictEqual(observed.suggestions, expected.suggestions.map((id) =>
        "Seleccionar " + h.catalog.animalSearchCatalog.find((item) => item.id === id).name));
      assert.deepStrictEqual(observed.expanded, ids.filter((id) => id === expected.open)
        .map((id) => "Cerrar pregunta: " + questionFor(id)));
    }
    snapshots.push({ name: scenario.name, states });
  }
  if (process.argv.includes("--capture")) {
    assert.ok(!fs.existsSync(fixturePath), "Refusing to overwrite browser baseline");
    fs.writeFileSync(fixturePath, JSON.stringify(snapshots, null, 2) + "\n");
    console.log("Captured " + snapshots.length + " real-browser FAQ scenarios from the original dist.");
  } else {
    assert.deepStrictEqual(snapshots, JSON.parse(fs.readFileSync(fixturePath, "utf8")));
    assert.deepStrictEqual(errors, []);
    console.log("PASS: " + snapshots.length + " FAQ browser scenarios match original export; no browser exceptions.");
  }
  await context.close();
}).catch((error) => { console.error(error); process.exitCode = 1; });
