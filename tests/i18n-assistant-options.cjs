/* global __dirname */
// Phase 2H: compare option data and actual callbacks without builds or real storage.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const ts = require("typescript");
const { assistantRuntime, evaluate, ast, load } = require("./i18n-assistant.cjs");
const root = path.resolve(__dirname, "..");
const baselinePath = path.join(root, ".expo/i18n-2h/options-before.json");
const capture = process.argv.includes("--capture");
const hash = text => crypto.createHash("sha256").update(text).digest("hex");
const names = ["TERRESTRIAL_ANIMAL_OPTIONS", "MARINE_ANIMAL_OPTIONS", "UNKNOWN_ANIMAL_OPTION", "ANIMAL_OPTIONS", "ANIMAL_OPTION_GROUPS", "ANIMAL_STATE_OPTIONS", "ANIMAL_PLACE_OPTIONS", "ANIMAL_POSITION_OPTIONS", "ANIMAL_ENVIRONMENT_OPTIONS", "VISIBLE_POSITION_OPTIONS_BY_ANIMAL_TYPE", "VISIBLE_ENVIRONMENT_OPTIONS_BY_ANIMAL_TYPE", "FLAG_LABELS", "VISIBLE_FLAG_LABELS_BY_ANIMAL_TYPE"];
const declarations = ast.statements.filter(node => ts.isVariableStatement(node) && node.declarationList.declarations.some(declaration => names.includes(declaration.name.getText(ast))));
const imports = ast.statements.filter(node => ts.isImportDeclaration(node) && node.moduleSpecifier.text === "@/i18n/catalogs/assistant-options.es");
const data = evaluate([...imports, ...declarations].map(node => node.getText(ast)).join("\n") + "\nexports.options = {" + names.join(",") + "};", "options.ts", specifier => load(specifier.slice(2) + ".ts")).options;
function seed(animalType, overrides = {}) {
  return { id: "legacy-options-local", createdAt: "2026-01-01T10:00:00.000Z", updatedAt: "2026-01-01T10:00:00.000Z", completedAt: null,
    step: 1, animalState: "alive", animalType, animalPlace: "treeOrBush", animalPosition: null, animalEnvironment: null,
    // Flags invisible for some species must survive recovery and selection.
    flags: { canNotMove: true, breathing: true, baby: true, ringGps: true, normalAppearance: false },
    locationText: "Ubicación no capturada todavía.", coords: null, locationCaptured: false, ...overrides };
}
async function snapshot() {
  const result = { options: JSON.parse(JSON.stringify(data)), component: hash(ast.statements.find(node => ts.isFunctionDeclaration(node) && node.name?.text === "HomeScreen").getText(ast)), interactions: {} };
  for (const platform of ["web", "android"]) for (const animal of data.ANIMAL_OPTIONS) {
    const ui = assistantRuntime(platform, seed(animal.key));
    const screens = [ui.snapshot()];
    for (const option of data.VISIBLE_POSITION_OPTIONS_BY_ANIMAL_TYPE[animal.key]) { await ui.press(option.label); screens.push(ui.snapshot()); }
    for (const option of data.VISIBLE_ENVIRONMENT_OPTIONS_BY_ANIMAL_TYPE[animal.key]) { await ui.press(option.label); screens.push(ui.snapshot()); }
    await ui.press("Continuar");
    const saved = ui.calls.find(call => call[0] === "save")[1];
    assert.equal(saved.animalType, animal.key);
    assert.equal(saved.animalPosition, data.VISIBLE_POSITION_OPTIONS_BY_ANIMAL_TYPE[animal.key].at(-1).key);
    assert.equal(saved.animalEnvironment, data.VISIBLE_ENVIRONMENT_OPTIONS_BY_ANIMAL_TYPE[animal.key].at(-1).key);
    for (const flag of ["canNotMove", "breathing", "baby", "ringGps"]) assert.equal(saved.flags[flag], true);
    screens.push(ui.snapshot());
    result.interactions[platform + ":" + animal.key] = { screens, calls: ui.calls };
  }
  // Old step/animalPlace fallback and restored contextual position/environment.
  for (const legacy of [seed("smallBird", { step: 5 }), seed("seal", { step: 5, animalPosition: "rocksBreakwater", animalEnvironment: "coastBeach" }), seed("unknown", { step: 4, flags: {} })]) {
    const ui = assistantRuntime("web", legacy);
    if (legacy.step === 4) {
      await ui.press("Continuar");
      await ui.press("Continuar sin añadirla");
    }
    const screen = ui.snapshot();
    await ui.press("Copiar");
    result.interactions["legacy:" + legacy.animalType] = { screen, calls: ui.calls };
  }
  return JSON.parse(JSON.stringify(result));
}
async function main() {
  assert.equal(fs.existsSync(baselinePath), !capture, "Capture once before extraction; never overwrite");
  const current = await snapshot();
  if (capture) {
    fs.mkdirSync(path.dirname(baselinePath), { recursive: true });
    fs.writeFileSync(baselinePath, JSON.stringify(current), { flag: "wx" });
    console.log("CAPTURED pre-2H: 13 option tables, every visible position/environment in web/Android simulation, legacy flags/animalPlace/steps and copied summaries.");
  } else {
    assert.deepEqual(current, JSON.parse(fs.readFileSync(baselinePath, "utf8")), "Options, identifiers/order/labels/layout/selection or legacy recovery changed");
    console.log("PASS: all 13 option tables identical; every visible position/environment selects the same code; Spanish trees/styles and legacy flags/animalPlace/steps/copied summaries preserved (web/Android simulated).");
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
