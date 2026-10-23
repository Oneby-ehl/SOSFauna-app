/* global __dirname */
// Phase 2G: execute the actual source in memory; never export/build or touch real storage.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const crypto = require("node:crypto");
const ts = require("typescript");
const { restoreAssistant, restoreFaq } = require("./helpers/advice-composition-2w.cjs");
const { restoreAssistant2x } = require("./helpers/advice-composition-2x.cjs");
const { restoreAssistant2y } = require("./helpers/marine-deduplication-2y.cjs");
const { restoreLocationAssistant, restoreLocationHistory } = require("./helpers/rescue-location-2z.cjs");
const { restoreSummary, verifySummaryCopy } = require("./helpers/rescue-summary-2aa.cjs");
const { restoreInterfaceCopy, verifyInterfaceCopy } = require("./helpers/interface-copy-2ac.cjs");
const { restoreRecommendationCopy, verifyRecommendationCopy } = require("./helpers/recommendation-copy-2ad.cjs");
const { restoreLocaleBinding } = require("./helpers/locale-binding-2ae.cjs");
const { restoreProtocolLocale } = require("./helpers/protocol-locale-2af.cjs");
const { restoreFaqLocale } = require("./helpers/faq-locale-2ag.cjs");
const root = path.resolve(__dirname, "..");
const sourcePath = "components/sos/SosAssistant.tsx";
const baselinePath = path.join(__dirname, "fixtures/protocols-before-i18n-2g.json");
// Recorded after the single capture, before editing SosAssistant.tsx. Never update
// automatically: the reference is independent of subsequent application changes.
const baselineSha256 = "8dde12dc68da520dd7db874c21be707bc41609d3fd995b8435bd5d0e4bec18e0";
const capture = process.argv.includes("--capture");
const protocolsOnly = process.argv.includes("--protocols-only");
const read = file => fs.readFileSync(path.join(root, file), "utf8");
const hash = value => crypto.createHash("sha256").update(value).digest("hex");
const source = read(sourcePath);
const ast = ts.createSourceFile(sourcePath, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const compilerOptions = { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true };
function evaluate(code, name, requireFn, globals = {}) {
  const exports = {};
  vm.runInNewContext("(function(exports, require) {" + ts.transpileModule(code, { fileName: name, compilerOptions }).outputText + "\n})", globals, { filename: name })(exports, requireFn);
  return exports;
}
const modules = new Map();
function load(file) {
  if (modules.has(file)) return modules.get(file);
  const exports = evaluate(read(file), file, specifier => {
    if (specifier === "react-native" || specifier === "expo-clipboard") return {};
    return load((specifier.startsWith("@/") ? specifier.slice(2) : path.posix.join(path.posix.dirname(file), specifier)) + ".ts");
  });
  modules.set(file, exports);
  return exports;
}
const translator = load("i18n/translate.ts").createTranslator("es");

// Undo authorized catalog substitutions and the exact 2W/2X composition and 2Y deduplication edits in
// memory for historical hashes. Actual output checks execute current code.
function normalizedProgram() {
  const normalizedSource = restoreAssistant(restoreAssistant2x(restoreAssistant2y(restoreLocationAssistant(restoreSummary(restoreInterfaceCopy(restoreRecommendationCopy(restoreLocaleBinding(restoreProtocolLocale(source), sourcePath), sourcePath), sourcePath), sourcePath)))));
  const normalizedAst = ts.createSourceFile(sourcePath, normalizedSource, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const transform = context => {
    const visit = node => {
      if (ts.isImportDeclaration(node) && node.moduleSpecifier.text === "@/i18n/I18nProvider") return undefined;
      if (ts.isImportDeclaration(node) && node.moduleSpecifier.text === "@/i18n/catalogs/assistant-options.es") return undefined;
      if (ts.isImportDeclaration(node) && node.moduleSpecifier.text === "@/i18n/catalogs/small-bird.es") return undefined;
      if (ts.isImportDeclaration(node) && node.moduleSpecifier.text === "@/i18n/catalogs/large-bird.es") return undefined;
      if (ts.isImportDeclaration(node) && node.moduleSpecifier.text === "@/i18n/catalogs/bat.es") return undefined;
      if (ts.isImportDeclaration(node) && node.moduleSpecifier.text === "@/i18n/catalogs/small-mammal.es") return undefined;
      if (ts.isImportDeclaration(node) && node.moduleSpecifier.text === "@/i18n/catalogs/large-mammal.es") return undefined;
      if (ts.isImportDeclaration(node) && node.moduleSpecifier.text === "@/i18n/catalogs/reptile-amphibian.es") return undefined;
      if (ts.isImportDeclaration(node) && node.moduleSpecifier.text === "@/i18n/catalogs/unknown-animal.es") return undefined;
      if (ts.isImportDeclaration(node) && node.moduleSpecifier.text === "@/i18n/catalogs/marine-animal.es") return undefined;
      if (ts.isImportDeclaration(node) && node.moduleSpecifier.text === "@/i18n/catalogs/marine-flags.es") return undefined;
      if (ts.isImportDeclaration(node) && node.moduleSpecifier.text === "@/i18n/catalogs/rescue-shared.es") return undefined;
      if (ts.isImportDeclaration(node) && node.moduleSpecifier.text === "@/i18n/catalogs/baby.es") return undefined;
      if (ts.isImportDeclaration(node) && node.moduleSpecifier.text === "@/i18n/catalogs/trapped.es") return undefined;
      if (ts.isImportDeclaration(node) && node.moduleSpecifier.text === "@/i18n/catalogs/dead.es") return undefined;
      if (isSmallBirdLookup(node)) {
        const literal = ts.factory.createStringLiteral(smallBirdValue(node));
        ts.setTextRange(literal, node);
        ts.setEmitFlags(literal, ts.EmitFlags.NoAsciiEscaping);
        return literal;
      }
      if (isLargeBirdLookup(node)) {
        const literal = ts.factory.createStringLiteral(largeBirdValue(node));
        ts.setTextRange(literal, node);
        ts.setEmitFlags(literal, ts.EmitFlags.NoAsciiEscaping);
        return literal;
      }
      if (isBatLookup(node)) {
        const literal = ts.factory.createStringLiteral(batValue(node));
        ts.setTextRange(literal, node);
        ts.setEmitFlags(literal, ts.EmitFlags.NoAsciiEscaping);
        return literal;
      }
      if (isSmallMammalLookup(node)) {
        const literal = ts.factory.createStringLiteral(smallMammalValue(node));
        ts.setTextRange(literal, node);
        ts.setEmitFlags(literal, ts.EmitFlags.NoAsciiEscaping);
        return literal;
      }
      if (isLargeMammalLookup(node)) {
        const literal = ts.factory.createStringLiteral(largeMammalValue(node));
        ts.setTextRange(literal, node);
        ts.setEmitFlags(literal, ts.EmitFlags.NoAsciiEscaping);
        return literal;
      }
      if (isReptileAmphibianLookup(node)) {
        const literal = ts.factory.createStringLiteral(reptileAmphibianValue(node));
        ts.setTextRange(literal, node);
        ts.setEmitFlags(literal, ts.EmitFlags.NoAsciiEscaping);
        return literal;
      }
      if (isUnknownAnimalLookup(node)) {
        const literal = ts.factory.createStringLiteral(unknownAnimalValue(node));
        ts.setTextRange(literal, node);
        ts.setEmitFlags(literal, ts.EmitFlags.NoAsciiEscaping);
        return literal;
      }
      if (isMarineAnimalLookup(node)) {
        const literal = ts.factory.createStringLiteral(marineAnimalValue(node));
        ts.setTextRange(literal, node);
        ts.setEmitFlags(literal, ts.EmitFlags.NoAsciiEscaping);
        return literal;
      }
      if (isMarineFlagLookup(node)) {
        const literal = ts.factory.createStringLiteral(marineFlagValue(node));
        ts.setTextRange(literal, node);
        ts.setEmitFlags(literal, ts.EmitFlags.NoAsciiEscaping);
        return literal;
      }
      if (isSharedRescueLookup(node)) {
        const literal = ts.factory.createStringLiteral(sharedRescueValue(node));
        ts.setTextRange(literal, node);
        ts.setEmitFlags(literal, ts.EmitFlags.NoAsciiEscaping);
        return literal;
      }
      if (isBabyAdviceLookup(node)) {
        const literal = ts.factory.createStringLiteral(babyAdviceValue(node));
        ts.setTextRange(literal, node);
        ts.setEmitFlags(literal, ts.EmitFlags.NoAsciiEscaping);
        return literal;
      }
      if (isTrappedAdviceLookup(node)) {
        const literal = ts.factory.createStringLiteral(trappedAdviceValue(node));
        ts.setTextRange(literal, node);
        ts.setEmitFlags(literal, ts.EmitFlags.NoAsciiEscaping);
        return literal;
      }
      if (ts.isImportDeclaration(node) && node.moduleSpecifier.text === "@/i18n/catalogs/supplemental.es") return undefined;
      if (isSupplementalLookup(node)) {
        const literal = ts.factory.createStringLiteral(supplementalValue(node));
        ts.setTextRange(literal, node);
        ts.setEmitFlags(literal, ts.EmitFlags.NoAsciiEscaping);
        return literal;
      }
      if (isDeadAdviceLookup(node)) {
        const literal = ts.factory.createStringLiteral(deadAdviceValue(node));
        ts.setTextRange(literal, node);
        ts.setEmitFlags(literal, ts.EmitFlags.NoAsciiEscaping);
        return literal;
      }
      // Phase 2H changes only leaf labels in the visible option arrays. Restore
      // their exact Spanish literals in memory; retain the original 2G hash.
      if (ts.isPropertyAccessExpression(node) && ts.isPropertyAccessExpression(node.expression) && ts.isIdentifier(node.expression.expression) && node.expression.expression.text === "assistantOptionsEs") {
        const area = node.expression.name.text, key = node.name.text;
        assert.ok(["assistantPositionOptions", "assistantEnvironmentOptions"].includes(area));
        const value = load("i18n/catalogs/assistant-options.es.ts").assistantOptionsEs[area][key];
        assert.equal(typeof value, "string");
        const literal = ts.factory.createStringLiteral(value);
        ts.setTextRange(literal, node);
        ts.setEmitFlags(literal, ts.EmitFlags.NoAsciiEscaping);
        return literal;
      }
      if (ts.isVariableStatement(node) && node.declarationList.declarations.some(declaration => declaration.initializer && ts.isCallExpression(declaration.initializer) && declaration.initializer.expression.getText(normalizedAst) === "useI18n")) return undefined;
      if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === "t") {
        assert.equal(node.arguments.length, 2);
        const key = node.arguments[1].text;
        const literal = ts.factory.createStringLiteral(translator(node.arguments[0].text, key), ["cannotFlyWarning", "incompatibleFlightWarning"].includes(key));
        ts.setTextRange(literal, node);
        // TypeScript emits original JS string tokens verbatim, but synthesizes
        // escaped literals for JSX text/attributes. Preserve that distinction.
        if (!ts.isJsxExpression(node.parent)) ts.setEmitFlags(literal, ts.EmitFlags.NoAsciiEscaping);
        return literal;
      }
      return ts.visitEachChild(node, visit, context);
    };
    return node => ts.visitNode(node, visit);
  };
  const js = ts.transpileModule(normalizedSource, { fileName: sourcePath, compilerOptions, transformers: { before: [transform] } }).outputText;
  return ts.createPrinter({ removeComments: true }).printFile(ts.createSourceFile("normalized.js", js, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS));
}

const endpoint = ast.statements.find(node => ts.isFunctionDeclaration(node) && node.name?.text === "getAdviceParts").end;
const pureDeclarations = ast.statements.filter(node =>
  (ts.isFunctionDeclaration(node) && node.end <= endpoint) ||
  (ts.isVariableStatement(node) && node.declarationList.declarations.some(declaration => ["COMMON_END", "MARINE_ANIMAL_TYPES"].includes(declaration.name.getText(ast)))));
const protocolSource = pureDeclarations.map(node => node.getText(ast)).join("\n");
function isSmallBirdLookup(node) {
  return ts.isPropertyAccessExpression(node) && ts.isPropertyAccessExpression(node.expression) && ts.isIdentifier(node.expression.expression) && node.expression.expression.text === "smallBirdEs";
}
function smallBirdValue(node) {
  assert.equal(node.expression.name.text, "smallBirdAdvice");
  let owner = node.parent;
  while (owner && !ts.isFunctionDeclaration(owner)) owner = owner.parent;
  assert.equal(owner?.name?.text, "getSmallBirdAdvice", "Only smallBird may use the new protocol catalog");
  const value = load("i18n/catalogs/small-bird.es.ts").smallBirdEs.smallBirdAdvice[node.name.text];
  assert.equal(typeof value, "string");
  return value;
}
function isLargeBirdLookup(node) {
  return ts.isPropertyAccessExpression(node) && ts.isPropertyAccessExpression(node.expression) && ts.isIdentifier(node.expression.expression) && node.expression.expression.text === "largeBirdEs";
}
function largeBirdValue(node) {
  assert.equal(node.expression.name.text, "largeBirdAdvice");
  let owner = node.parent;
  while (owner && !ts.isFunctionDeclaration(owner)) owner = owner.parent;
  assert.equal(owner?.name?.text, "getLargeBirdAdvice", "Only largeBird may use its protocol catalog");
  const value = load("i18n/catalogs/large-bird.es.ts").largeBirdEs.largeBirdAdvice[node.name.text];
  assert.equal(typeof value, "string");
  return value;
}
function isBatLookup(node) {
  return ts.isPropertyAccessExpression(node) && ts.isPropertyAccessExpression(node.expression) && ts.isIdentifier(node.expression.expression) && node.expression.expression.text === "batEs";
}
function batValue(node) {
  assert.equal(node.expression.name.text, "batAdvice");
  let owner = node.parent;
  while (owner && !ts.isFunctionDeclaration(owner)) owner = owner.parent;
  assert.equal(owner?.name?.text, "getBatAdvice", "Only getBatAdvice may use its protocol catalog");
  const value = load("i18n/catalogs/bat.es.ts").batEs.batAdvice[node.name.text];
  assert.equal(typeof value, "string");
  return value;
}
function isSmallMammalLookup(node) {
  return ts.isPropertyAccessExpression(node) && ts.isPropertyAccessExpression(node.expression) && ts.isIdentifier(node.expression.expression) && node.expression.expression.text === "smallMammalEs";
}
function smallMammalValue(node) {
  assert.equal(node.expression.name.text, "smallMammalAdvice");
  let owner = node.parent;
  while (owner && !ts.isFunctionDeclaration(owner)) owner = owner.parent;
  assert.equal(owner?.name?.text, "getSmallMammalAdvice", "Only getSmallMammalAdvice may use its protocol catalog");
  const value = load("i18n/catalogs/small-mammal.es.ts").smallMammalEs.smallMammalAdvice[node.name.text];
  assert.equal(typeof value, "string");
  return value;
}
function isLargeMammalLookup(node) {
  return ts.isPropertyAccessExpression(node) && ts.isPropertyAccessExpression(node.expression) && ts.isIdentifier(node.expression.expression) && node.expression.expression.text === "largeMammalEs";
}
function largeMammalValue(node) {
  assert.equal(node.expression.name.text, "largeMammalAdvice");
  let owner = node.parent;
  while (owner && !ts.isFunctionDeclaration(owner)) owner = owner.parent;
  assert.equal(owner?.name?.text, "getLargeMammalAdvice", "Only getLargeMammalAdvice may use its protocol catalog");
  const value = load("i18n/catalogs/large-mammal.es.ts").largeMammalEs.largeMammalAdvice[node.name.text];
  assert.equal(typeof value, "string");
  return value;
}
function isReptileAmphibianLookup(node) {
  return ts.isPropertyAccessExpression(node) && ts.isPropertyAccessExpression(node.expression) && ts.isIdentifier(node.expression.expression) && node.expression.expression.text === "reptileAmphibianEs";
}
function reptileAmphibianValue(node) {
  assert.equal(node.expression.name.text, "reptileAmphibianAdvice");
  let owner = node.parent;
  while (owner && !ts.isFunctionDeclaration(owner)) owner = owner.parent;
  assert.equal(owner?.name?.text, "getReptileAmphibianAdvice", "Only getReptileAmphibianAdvice may use its protocol catalog");
  const value = load("i18n/catalogs/reptile-amphibian.es.ts").reptileAmphibianEs.reptileAmphibianAdvice[node.name.text];
  assert.equal(typeof value, "string");
  return value;
}
function isUnknownAnimalLookup(node) {
  return ts.isPropertyAccessExpression(node) && ts.isPropertyAccessExpression(node.expression) && ts.isIdentifier(node.expression.expression) && node.expression.expression.text === "unknownAnimalEs";
}
function unknownAnimalValue(node) {
  assert.equal(node.expression.name.text, "unknownAnimalAdvice");
  let owner = node.parent;
  while (owner && !ts.isFunctionDeclaration(owner)) owner = owner.parent;
  assert.equal(owner?.name?.text, "getUnknownAnimalAdvice", "Only getUnknownAnimalAdvice may use its protocol catalog");
  const value = load("i18n/catalogs/unknown-animal.es.ts").unknownAnimalEs.unknownAnimalAdvice[node.name.text];
  assert.equal(typeof value, "string");
  return value;
}
function isMarineAnimalLookup(node) {
  return ts.isPropertyAccessExpression(node) && ts.isPropertyAccessExpression(node.expression) && ts.isIdentifier(node.expression.expression) && node.expression.expression.text === "marineAnimalEs";
}
function marineAnimalValue(node) {
  assert.equal(node.expression.name.text, "marineAnimalAdvice");
  let owner = node.parent;
  while (owner && !ts.isFunctionDeclaration(owner)) owner = owner.parent;
  assert.equal(owner?.name?.text, "getMarineAnimalAdvice", "Only getMarineAnimalAdvice may use its protocol catalog");
  const value = load("i18n/catalogs/marine-animal.es.ts").marineAnimalEs.marineAnimalAdvice[node.name.text];
  assert.equal(typeof value, "string");
  return value;
}
function isMarineFlagLookup(node) {
  return ts.isPropertyAccessExpression(node) && ts.isPropertyAccessExpression(node.expression) && ts.isIdentifier(node.expression.expression) && node.expression.expression.text === "marineFlagsEs";
}
function marineFlagValue(node) {
  assert.equal(node.expression.name.text, "marineFlagAdvice");
  let owner = node.parent;
  while (owner && !ts.isFunctionDeclaration(owner)) owner = owner.parent;
  assert.equal(owner?.name?.text, "addMarineFlagAdvice", "Only addMarineFlagAdvice may use its catalog");
  const value = load("i18n/catalogs/marine-flags.es.ts").marineFlagsEs.marineFlagAdvice[node.name.text];
  assert.equal(typeof value, "string");
  return value;
}
function isSharedRescueLookup(node) {
  return ts.isPropertyAccessExpression(node) && ts.isPropertyAccessExpression(node.expression) && ts.isIdentifier(node.expression.expression) && node.expression.expression.text === "sharedRescueEs";
}
function sharedRescueValue(node) {
  assert.equal(node.expression.name.text, "sharedRescueAdvice");
  let owner = node.parent;
  while (owner && !ts.isFunctionDeclaration(owner)) owner = owner.parent;
  assert.ok(["getSmallBirdAdvice", "getLargeBirdAdvice", "getBatAdvice", "getSmallMammalAdvice", "getLargeMammalAdvice", "getReptileAmphibianAdvice", "getUnknownAnimalAdvice", "getBabyAdvice", "getTrappedAdvice"].includes(owner?.name?.text), "Shared lookups must stay inside authorised generators");
  const value = load("i18n/catalogs/rescue-shared.es.ts").sharedRescueEs.sharedRescueAdvice[node.name.text];
  assert.equal(typeof value, "string");
  return value;
}
function isBabyAdviceLookup(node) {
  return ts.isPropertyAccessExpression(node) && ts.isPropertyAccessExpression(node.expression) && ts.isIdentifier(node.expression.expression) && node.expression.expression.text === "babyEs";
}
function babyAdviceValue(node) {
  assert.equal(node.expression.name.text, "babyAdvice");
  let owner = node.parent;
  while (owner && !ts.isFunctionDeclaration(owner)) owner = owner.parent;
  assert.equal(owner?.name?.text, "getBabyAdvice", "Only getBabyAdvice may use its catalog");
  const value = load("i18n/catalogs/baby.es.ts").babyEs.babyAdvice[node.name.text];
  assert.equal(typeof value, "string");
  return value;
}
function isTrappedAdviceLookup(node) {
  return ts.isPropertyAccessExpression(node) && ts.isPropertyAccessExpression(node.expression) && ts.isIdentifier(node.expression.expression) && node.expression.expression.text === "trappedEs";
}
function trappedAdviceValue(node) {
  assert.equal(node.expression.name.text, "trappedAdvice");
  let owner = node.parent;
  while (owner && !ts.isFunctionDeclaration(owner)) owner = owner.parent;
  assert.equal(owner?.name?.text, "getTrappedAdvice", "Only getTrappedAdvice may use its catalog");
  const value = load("i18n/catalogs/trapped.es.ts").trappedEs.trappedAdvice[node.name.text];
  assert.equal(typeof value, "string");
  return value;
}
function isSupplementalLookup(node) {
  return ts.isPropertyAccessExpression(node) && ts.isPropertyAccessExpression(node.expression) && ts.isIdentifier(node.expression.expression) && node.expression.expression.text === "supplementalEs";
}
function supplementalValue(node) {
  assert.equal(node.expression.name.text, "supplementalAdvice");
  if (node.name.text === "commonEnd") {
    assert.ok(ts.isVariableDeclaration(node.parent) && node.parent.name.getText() === "COMMON_END" && node.parent.initializer === node, "The closing text must remain the exported COMMON_END initializer");
  } else {
    let owner = node.parent;
    while (owner && !ts.isFunctionDeclaration(owner)) owner = owner.parent;
    assert.equal(owner?.name?.text, "addSupplementalAdvice", "Supplement fragments must remain inside addSupplementalAdvice");
  }
  const value = load("i18n/catalogs/supplemental.es.ts").supplementalEs.supplementalAdvice[node.name.text];
  assert.equal(typeof value, "string");
  return value;
}
function isDeadAdviceLookup(node) {
  return ts.isPropertyAccessExpression(node) && ts.isPropertyAccessExpression(node.expression) && ts.isIdentifier(node.expression.expression) && node.expression.expression.text === "deadAnimalEs";
}
function deadAdviceValue(node) {
  assert.equal(node.expression.name.text, "deadAdvice");
  let owner = node;
  let terrestrialDeadBranch = false;
  while (owner.parent && !ts.isFunctionDeclaration(owner)) {
    const parent = owner.parent;
    if (ts.isIfStatement(parent) && parent.thenStatement === owner && parent.expression.getText() === 'animalState === "dead"') terrestrialDeadBranch = true;
    owner = parent;
  }
  assert.ok(owner.name?.text === "getDeadMarineAnimalAdvice" || (["getAdvice", "getAdviceParts"].includes(owner.name?.text) && terrestrialDeadBranch), "Dead catalog lookups must stay in the two authorised dead-animal branches");
  const value = load("i18n/catalogs/dead.es.ts").deadAnimalEs.deadAdvice[node.name.text];
  assert.equal(typeof value, "string");
  return value;
}
// Reverse the explicit 2Y/2X/2W edits, then restore catalog leaves for the original
// source hash. All decisions remain guarded; actual outputs use current code.
function originalProtocolSource() {
  const structuralSource = restoreAssistant(restoreAssistant2x(restoreAssistant2y(restoreRecommendationCopy(restoreProtocolLocale(protocolSource, true), sourcePath, true))));
  const parsed = ts.createSourceFile("protocols.ts", structuralSource, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const edits = [];
  function visit(node) {
    if (isSmallBirdLookup(node)) { edits.push([node.getStart(parsed), node.end, JSON.stringify(smallBirdValue(node))]); return; }
    if (isLargeBirdLookup(node)) { edits.push([node.getStart(parsed), node.end, JSON.stringify(largeBirdValue(node))]); return; }
    if (isBatLookup(node)) { edits.push([node.getStart(parsed), node.end, JSON.stringify(batValue(node))]); return; }
    if (isSmallMammalLookup(node)) { edits.push([node.getStart(parsed), node.end, JSON.stringify(smallMammalValue(node))]); return; }
    if (isLargeMammalLookup(node)) { edits.push([node.getStart(parsed), node.end, JSON.stringify(largeMammalValue(node))]); return; }
    if (isReptileAmphibianLookup(node)) { edits.push([node.getStart(parsed), node.end, JSON.stringify(reptileAmphibianValue(node))]); return; }
    if (isUnknownAnimalLookup(node)) { edits.push([node.getStart(parsed), node.end, JSON.stringify(unknownAnimalValue(node))]); return; }
    if (isMarineAnimalLookup(node)) { edits.push([node.getStart(parsed), node.end, JSON.stringify(marineAnimalValue(node))]); return; }
    if (isMarineFlagLookup(node)) { edits.push([node.getStart(parsed), node.end, JSON.stringify(marineFlagValue(node))]); return; }
    if (isSharedRescueLookup(node)) { edits.push([node.getStart(parsed), node.end, JSON.stringify(sharedRescueValue(node))]); return; }
    if (isBabyAdviceLookup(node)) { edits.push([node.getStart(parsed), node.end, JSON.stringify(babyAdviceValue(node))]); return; }
    if (isTrappedAdviceLookup(node)) { edits.push([node.getStart(parsed), node.end, JSON.stringify(trappedAdviceValue(node))]); return; }
    if (isSupplementalLookup(node)) { edits.push([node.getStart(parsed), node.end, JSON.stringify(supplementalValue(node))]); return; }
    if (isDeadAdviceLookup(node)) { edits.push([node.getStart(parsed), node.end, JSON.stringify(deadAdviceValue(node))]); return; }
    ts.forEachChild(node, visit);
  }
  visit(parsed);
  let restored = structuralSource;
  for (const [start, end, literal] of edits.sort((a, b) => b[0] - a[0])) restored = restored.slice(0, start) + literal + restored.slice(end);
  return restored;
}
const protocolCatalogImports = ["@/i18n/catalogs/small-bird.es", "@/i18n/catalogs/large-bird.es", "@/i18n/catalogs/bat.es", "@/i18n/catalogs/small-mammal.es", "@/i18n/catalogs/large-mammal.es", "@/i18n/catalogs/reptile-amphibian.es", "@/i18n/catalogs/unknown-animal.es", "@/i18n/catalogs/marine-animal.es", "@/i18n/catalogs/marine-flags.es", "@/i18n/catalogs/rescue-shared.es", "@/i18n/catalogs/baby.es", "@/i18n/catalogs/trapped.es", "@/i18n/catalogs/dead.es", "@/i18n/catalogs/supplemental.es", "@/utils/adviceComposition", "@/i18n/catalogs/recommendation-fragments.es", "@/i18n/translate", "@/i18n/types"];
const protocolImports = ast.statements.filter(node => ts.isImportDeclaration(node) && protocolCatalogImports.includes(node.moduleSpecifier.text));
const protocols = evaluate([...protocolImports.map(node => node.getText(ast)), protocolSource].join("\n"), "protocols.ts", specifier => {
  assert.ok(protocolCatalogImports.includes(specifier));
  return load(specifier.slice(2) + ".ts");
});
const animals = ["smallBird", "largeBird", "bat", "smallMammal", "largeMammal", "reptileAmphibian", "dolphin", "largeCetacean", "seal", "seaTurtle", "sharkRay", "otherMarine", "unknown"];
const marine = animals.slice(6, 12);
const flagKeys = Object.keys(protocols.createInitialFlags());
const mask = (...keys) => keys.reduce((value, key) => value | 1 << flagKeys.indexOf(key), 0);
const masks = [...new Set([0, ...flagKeys.map(key => mask(key)),
  mask("trapped", "baby"), mask("trapped", "bleeding", "catDog"), mask("baby", "bleeding"),
  mask("cannotFly", "bleeding"), mask("cannotFly", "roadRisk"), mask("normalAppearance", "ringGps"),
  mask("normalAppearance", "bleeding"), mask("normalAppearance", "trapped", "baby"),
  mask("ringGps", "trapped"), mask("ringGps", "baby"), mask("ringGps", "bleeding"),
  mask("stranded", "trapped", "fishingLineHook"), mask("restingOnLand", "peopleDogsNearby"),
  mask("stranded", "moreAnimals"), mask("bleeding", "weakness", "breathing"), (1 << flagKeys.length) - 1])];
const positions = [null, "ground", "treeOrBush", "buildingOrRoof", "water", "beachSand", "shoreShallowWater", "rocksBreakwater", "portDock", "onBoat", "otherPlace"];
const environments = [null, "roadOrStreet", "parkOrGarden", "fieldOrNatural", "industrialArea", "urbanArea", "coastBeach", "rockyCoastCliff", "portMarina", "openSea", "estuaryMouth", "otherEnvironment"];
function characterize() {
  const outputs = [], outputIndices = new Map(), cases = [], seen = new Set();
  function add(state, animal, value, position = null, environment = null) {
    const input = [state, animal, value, position, environment];
    const key = JSON.stringify(input);
    if (seen.has(key)) return;
    seen.add(key);
    const flags = Object.fromEntries(flagKeys.map((flag, index) => [flag, Boolean(value & 1 << index)]));
    const output = protocols.getAdvice(state, animal, flags, position, environment);
    assert.equal(protocols.getAdviceForLocale("es", state, animal, flags, position, environment), output);
    assert.equal(protocols.getAdviceForLocale("en", state, animal, flags, position, environment), output, "Unpublished English must resolve to identical Spanish advice");
    // Same characterised cases also cover the structured path consumed by FAQ.
    // The oracle remains the historical flat-string contract, never recaptured.
    const parts = protocols.getAdviceParts(state, animal, flags, position, environment);
    const composition = load("utils/adviceComposition.ts");
    assert.equal(parts[0].kind, "body");
    assert.equal(parts.at(-1).kind, "commonEnd");
    assert.equal(parts.filter(part => part.kind === "commonEnd").length, 1);
    assert.ok(parts.slice(1, -1).every(part => part.kind === "supplement"));
    assert.equal(composition.formatAdvice(parts), output);
    assert.ok(output.endsWith(protocols.COMMON_END));
    assert.equal(composition.formatAdvice(parts, false).trim(), output.slice(0, -protocols.COMMON_END.length).trim());
    if (!outputIndices.has(output)) { outputIndices.set(output, outputs.length); outputs.push(output); }
    cases.push([...input, outputIndices.get(output)]);
  }
  for (const animal of animals) for (const state of ["alive", "dead"]) for (const value of masks) add(state, animal, value);
  // All location pairs, each flag independently, priority/supplement combinations,
  // including legacy fields not exposed for the selected species.
  for (const animal of marine) for (const position of positions) for (const environment of environments) {
    for (const value of masks) add("alive", animal, value, position, environment);
    add("dead", animal, (1 << flagKeys.length) - 1, position, environment);
  }
  return { animals, flagKeys, masks, positions, environments, cases, outputs };
}

function assistantRuntime(platform = "web", initialCase = null) {
  let cursor = 0;
  const states = [], calls = [], effects = [], refs = [];
  let refCursor = 0;
  let failLinks = false;
  const permission = { granted: false };
  let confirm = false;
  const record = (name, ...args) => calls.push([name, ...args]);
  const react = {
    useState(initial) { const index = cursor++; if (!(index in states)) states[index] = typeof initial === "function" ? initial() : initial; return [states[index], next => { states[index] = typeof next === "function" ? next(states[index]) : next; }]; },
    useMemo: compute => compute(), useCallback: callback => callback,
    useRef(initial) { const index = refCursor++; if (!(index in refs)) refs[index] = { current: initial }; return refs[index]; },
    useEffect: effect => { effects.push(effect); },
  };
  const jsx = (type, props, key) => ({ type: typeof type === "symbol" ? "Fragment" : type, key, props: props || {} });
  class Value { constructor(value) { this.value = value; } stopAnimation() {} setValue(value) { this.value = value; } }
  const native = Object.fromEntries(["View", "Text", "Pressable", "ScrollView", "TextInput", "KeyboardAvoidingView"].map(name => [name, name]));
  Object.assign(native, { Platform: { OS: platform }, StyleSheet: { create: styles => styles }, useWindowDimensions: () => ({ width: 390 }),
    Alert: { alert: (...args) => record("alert", ...args) }, Easing: { out: x => x, cubic: "cubic", inOut: x => x },
    Animated: { createAnimatedComponent: component => component, Value, sequence: () => ({ start() {} }), parallel: () => ({}), timing: () => ({}) } });
  const router = { replace: route => record("replace", route) };
  const listeners = {};
  const window = { alert: text => record("window.alert", text), confirm: text => { record("window.confirm", text); return confirm; }, open: (...args) => record("open", ...args),
    location: { href: "https://isolated.invalid/aviso" }, history: { pushState: (...args) => record("pushState", ...args) },
    setTimeout: () => 0, clearTimeout() {}, addEventListener: (name, callback) => { listeners[name] = callback; }, removeEventListener: name => { delete listeners[name]; } };
  const runtime = evaluate(source, sourcePath, specifier => {
    if (specifier === "react") return react;
    if (specifier === "react/jsx-runtime") return { jsx, jsxs: jsx, Fragment: "Fragment" };
    if (specifier === "react-native") return native;
    if (specifier === "react-native-safe-area-context") return { SafeAreaView: "SafeAreaView", useSafeAreaInsets: () => ({ bottom: 0 }) };
    if (specifier === "expo-router") return { Stack: { Screen: "Stack.Screen" }, useRouter: () => router };
    if (specifier === "@/components/SectionCard") return { SectionCard: "SectionCard" };
    if (specifier === "@/components/contacts/RecoveryCentersPage") return { RecoveryCentersContent: "RecoveryCentersContent" };
    if (specifier === "@/i18n/I18nProvider") return { useI18n: () => ({ locale: "es", t: translator }) };
    if (specifier === "@/i18n/catalogs/assistant-options.es") return load("i18n/catalogs/assistant-options.es.ts");
    if (specifier === "@/i18n/catalogs/small-bird.es") return load("i18n/catalogs/small-bird.es.ts");
    if (specifier === "@/i18n/catalogs/large-bird.es") return load("i18n/catalogs/large-bird.es.ts");
    if (specifier === "@/i18n/catalogs/bat.es") return load("i18n/catalogs/bat.es.ts");
    if (specifier === "@/i18n/catalogs/small-mammal.es") return load("i18n/catalogs/small-mammal.es.ts");
    if (specifier === "@/i18n/catalogs/large-mammal.es") return load("i18n/catalogs/large-mammal.es.ts");
    if (specifier === "@/i18n/catalogs/reptile-amphibian.es") return load("i18n/catalogs/reptile-amphibian.es.ts");
    if (specifier === "@/i18n/catalogs/unknown-animal.es") return load("i18n/catalogs/unknown-animal.es.ts");
    if (specifier === "@/i18n/catalogs/marine-animal.es") return load("i18n/catalogs/marine-animal.es.ts");
    if (specifier === "@/i18n/catalogs/marine-flags.es") return load("i18n/catalogs/marine-flags.es.ts");
    if (specifier === "@/i18n/catalogs/rescue-shared.es") return load("i18n/catalogs/rescue-shared.es.ts");
    if (specifier === "@/i18n/catalogs/baby.es") return load("i18n/catalogs/baby.es.ts");
    if (specifier === "@/i18n/catalogs/trapped.es") return load("i18n/catalogs/trapped.es.ts");
    if (specifier === "@/i18n/catalogs/dead.es") return load("i18n/catalogs/dead.es.ts");
    if (specifier === "@/i18n/catalogs/supplemental.es") return load("i18n/catalogs/supplemental.es.ts");
    if (specifier === "@/i18n/types") return load("i18n/types.ts");
    if (specifier === "@/i18n/translate") return load("i18n/translate.ts");
    if (specifier === "@/i18n/catalogs/recommendation-fragments.es") return load("i18n/catalogs/recommendation-fragments.es.ts");
    if (specifier === "@/i18n/catalogs/interface-pending.es") return load("i18n/catalogs/interface-pending.es.ts");
    if (specifier === "@/i18n/catalogs/rescue-summary.es") return load("i18n/catalogs/rescue-summary.es.ts");
    if (specifier === "@/utils/rescueLocation") return load("utils/rescueLocation.ts");
    if (specifier === "@/utils/adviceComposition") return load("utils/adviceComposition.ts");
    if (specifier === "@/utils/rescueShareMessage") return load("utils/rescueShareMessage.ts");
    if (specifier === "@/services/rescueCaseService") return {
      persistCurrentCase: async (data, existing) => { record("save", data); return { id: existing?.id || "isolated-case", ...data }; },
      completeCurrentCase: async data => { record("complete", data); return data; },
    };
    if (specifier === "expo-clipboard") return { setStringAsync: async text => record("clipboard", text) };
    if (specifier === "expo-linking") return { openURL: async url => { record("link", url); if (failLinks) throw Error("Simulated unavailable application"); } };
    if (specifier === "expo-image-picker") return { requestCameraPermissionsAsync: async () => permission };
    if (specifier === "expo-media-library") return { requestPermissionsAsync: async () => permission };
    if (specifier === "expo-location") return { requestForegroundPermissionsAsync: async () => permission };
    if (specifier === "expo-speech") return { stop: async () => record("speech.stop"), speak: (text, options) => record("speech.speak", text, options) };
    throw Error("Unexpected dependency " + specifier);
  }, { window, requestAnimationFrame: callback => callback(), setTimeout, clearTimeout });
  function render() { cursor = 0; refCursor = 0; effects.length = 0; return runtime.default({ initialCase }); }
  function nodes(tree) { if (!tree || typeof tree !== "object") return []; if (Array.isArray(tree)) return tree.flatMap(nodes); return [tree, ...nodes(tree.props?.children)]; }
  function text(tree) { if (tree == null || typeof tree === "boolean") return ""; if (Array.isArray(tree)) return tree.map(text).join(""); if (typeof tree !== "object") return String(tree); return text(tree.props?.children); }
  function find(label) { const found = nodes(render()).find(node => node.props?.accessibilityLabel === label || (["Pressable", "TextInput"].includes(node.type) && (text(node) === label || nodes(node.props.children).some(child => child.type === "Text" && text(child) === label) || node.props.placeholder === label))); assert.ok(found, "Missing control: " + label); return found; }
  async function press(label) { const node = find(label); assert.equal(typeof node.props.onPress, "function", label); await node.props.onPress(); await new Promise(resolve => setTimeout(resolve, 0)); }
  function snapshot() { return JSON.parse(JSON.stringify(render(), (key, value) => typeof value === "function" ? "[callback]" : value)); }
  function armExitGuard() {
    render();
    effects.find(effect => effect.toString().includes("shouldConfirmExitRef.current = hasMeaningfulProgress"))();
    effects.find(effect => effect.toString().includes("saveCurrentProgressRef.current = async"))();
    return effects.find(effect => effect.toString().includes("const guardedUrl"))();
  }
  return { render, nodes, text, find, press, snapshot, calls, effects, setConfirm: value => { confirm = value; },
    setLinkFailure: value => { failLinks = value; }, armExitGuard, exit: () => listeners.popstate() };
}

async function checkInterface() {
  const snapshots = {}, traces = {};
  for (const platform of ["web", "android"]) {
    const ui = assistantRuntime(platform);
    snapshots[platform + ":step1"] = ui.snapshot();
    await ui.press("Ave pequeña");
    await ui.press("Herido");
    await ui.press("Continuar");
    assert.ok(ui.text(ui.render()).includes("Antes de intervenir, lee estas recomendaciones."));
    snapshots[platform + ":step2"] = ui.snapshot();
    await ui.press("Escuchar las recomendaciones");
    assert.equal(ui.calls.find(call => call[0] === "speech.speak")[2].language, "es-ES");
    snapshots[platform + ":speaking"] = ui.snapshot();
    await ui.press("Detener lectura de las recomendaciones");
    await ui.press("Continuar");
    snapshots[platform + ":step3"] = ui.snapshot();
    await ui.press("Hacer foto");
    await ui.press("Grabar vídeo");
    await ui.press("Capturar ubicación");
    await ui.press("Continuar");
    snapshots[platform + ":empty-confirm"] = ui.snapshot();
    await ui.press("Volver y añadir información");
    await ui.press("Continuar");
    await ui.press("Continuar sin añadirla");
    snapshots[platform + ":step4"] = ui.snapshot();
    await ui.press("Copiar");
    await ui.press("WhatsApp");
    snapshots[platform + ":send-options"] = ui.snapshot();
    await ui.press("Enviar a otro contacto");
    ui.find("Enviar a otro contacto de WhatsApp").props.onChangeText("123");
    await ui.press("Enviar por WhatsApp");
    ui.find("Enviar a otro contacto de WhatsApp").props.onChangeText("+34 600 123 456");
    await ui.press("Enviar por WhatsApp");
    snapshots[platform + ":send-confirm"] = ui.snapshot();
    await ui.press("Volver a opciones");
    await ui.press("Volver");
    await ui.press("Finalizar");
    if (platform === "web") { assert.equal(ui.calls.some(call => call[0] === "complete"), false); ui.setConfirm(true); await ui.press("Finalizar"); await new Promise(resolve => setTimeout(resolve, 0)); }
    else {
      const confirmation = ui.calls.filter(call => call[0] === "alert" && call[1] === "Finalizar aviso").at(-1);
      confirmation[3].find(button => button.text === "Sí").onPress();
      ui.calls.at(-1)[3][0].onPress();
      await new Promise(resolve => setTimeout(resolve, 0));
    }
    assert.ok(ui.calls.some(call => call[0] === "complete"));
    // Mismatch warnings are text-only; selected flags and type behavior remain real.
    const mismatch = assistantRuntime(platform);
    await mismatch.press("Ave pequeña"); await mismatch.press("No vuela"); await mismatch.press("Mamífero grande");
    traces[platform] = JSON.parse(JSON.stringify([...ui.calls, ...mismatch.calls], (key, value) => typeof value === "function" ? "[callback]" : value));
    if (platform === "web") assert.ok(ui.effects.length > 0);
  }
  return { snapshots, traces };
}

async function checkExitAndUnavailableWhatsApp() {
  const exit = assistantRuntime("web");
  await exit.press("Ave pequeña");
  const cleanup = exit.armExitGuard();
  exit.exit();
  assert.equal(exit.calls.some(call => call[0] === "save"), false, "Cancelled exit must not save/navigate");
  assert.ok(exit.calls.find(call => call[0] === "window.confirm")[1].includes("¿Deseas salir de este aviso?\n\n"));
  exit.setConfirm(true);
  exit.exit();
  await new Promise(resolve => setTimeout(resolve, 0));
  assert.ok(exit.calls.some(call => call[0] === "save"));
  assert.ok(exit.calls.some(call => call[0] === "replace" && call[1] === "/"));
  cleanup();
  const failed = assistantRuntime("android", { step: 5, animalState: "alive", animalType: "unknown", flags: {}, locationText: "Ubicación no capturada todavía." });
  failed.setLinkFailure(true);
  await failed.press("WhatsApp");
  await failed.press("Enviar a GREFA (Madrid)");
  assert.equal(failed.calls.filter(call => call[0] === "link").length, 3);
  assert.ok(failed.calls.some(call => call[0] === "alert" && call[1] === translator("assistantUi", "whatsAppErrorTitle") && call[2] === translator("assistantUi", "whatsAppErrorMessage")));
}

async function main() {
  const resolver = load("i18n/translate.ts");
  assert.equal(resolver.getCatalog("es"), resolver.getCatalog("es"));
  assert.equal(resolver.getCatalog("en"), resolver.getCatalog("en"));
  assert.equal(resolver.getEffectiveCatalog("en"), resolver.getCatalog("es"), "English must remain gated");
  assert.equal(resolver.getEffectiveCatalog("en", "native"), resolver.getCatalog("es"));
  const fallback = resolver.resolveTranslation("en", "historyUi", "heading");
  assert.equal(fallback.usedFallback, true);
  assert.equal(fallback.sourceLocale, "es");
  assert.equal(fallback.value, resolver.getCatalog("es").historyUi.heading);
  verifySummaryCopy(load("i18n/catalogs/rescue-summary.es.ts").rescueSummaryEs);
  verifyInterfaceCopy(load("i18n/catalogs/interface-pending.es.ts").interfacePendingEs);
  verifyRecommendationCopy(load("i18n/catalogs/recommendation-fragments.es.ts").recommendationFragmentsEs);
  assert.ok(!(capture && protocolsOnly), "Protocol-only checks never capture or regenerate references");
  if (capture) assert.equal(fs.existsSync(baselinePath), false, "Reference already exists; never overwrite it");
  else assert.ok(fs.existsSync(baselinePath), "Capture the untouched source first");
  const protectedFiles = ["types/rescueCase.ts", "services/rescueStorage.ts", "services/rescueCaseService.ts", "app/aviso.tsx", "app/history.tsx", "utils/rescueShareMessage.ts", "components/faq/FaqPage.tsx", "i18n/config.ts", "i18n/I18nProvider.tsx", "i18n/routes.ts", "app.json", "package.json", "package-lock.json"];
  const current = { protocolSourceHash: hash(originalProtocolSource()), normalizedProgramHash: hash(normalizedProgram()), protectedFiles: Object.fromEntries(protectedFiles.map(file => [file, hash(file === "components/faq/FaqPage.tsx" ? restoreFaq(restoreRecommendationCopy(restoreFaqLocale(restoreLocaleBinding(read(file), file)), file)) : file === "app/history.tsx" ? restoreLocationHistory(restoreSummary(restoreInterfaceCopy(restoreLocaleBinding(read(file), file), file), file)) : file === "app/aviso.tsx" ? restoreInterfaceCopy(restoreLocaleBinding(read(file), file), file) : file === "utils/rescueShareMessage.ts" ? restoreSummary(restoreLocaleBinding(read(file), file), file) : restoreLocaleBinding(read(file), file))])), recommendations: characterize(), ...(protocolsOnly ? {} : { interface: await checkInterface() }) };
  if (capture) {
    fs.writeFileSync(baselinePath, JSON.stringify({ purpose: "Untouched Spanish recommendations and interface before phase 2G; immutable capture, not a replacement for historical references.", ...current }, null, 2) + "\n", { flag: "wx" });
    console.log("CAPTURED once: " + current.recommendations.cases.length + " cases, " + current.recommendations.outputs.length + " exact outputs; 13 animals, 17 flags, alive/dead, trapping/babies/supplements and all marine location pairs; web/native interface traces.");
  } else {
    const baselineBytes = fs.readFileSync(baselinePath);
    assert.equal(hash(baselineBytes), baselineSha256, "Original phase 2G reference was modified");
    const before = JSON.parse(baselineBytes.toString("utf8"));
    for (const key of Object.keys(current)) assert.deepEqual(current[key], before[key], "Phase 2G difference: " + key);
    if (protocolsOnly) {
      console.log("PASS: " + current.recommendations.cases.length + " exact protocol outputs against the original 2G reference; original source/program hashes preserved after reversing authorised structural edits and catalog leaves; protected files (authorised FAQ/history/sharing/guide edits reversed) and reference SHA-256 unchanged. Interface checks skipped.");
      return;
    }
    await checkExitAndUnavailableWhatsApp();
    console.log("PASS: " + current.recommendations.cases.length + " exact protocol outputs; protocol source and complete program unchanged except equivalent UI lookups; four steps, speech, denied permissions, warnings, copy/WhatsApp, confirmation/cancel/finalization and web/Android simulated UI identical.");
  }
}
module.exports = { assistantRuntime, evaluate, ast, load };
if (require.main === module) main().catch(error => { console.error(error); process.exitCode = 1; });
