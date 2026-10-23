// Invert only the authorised 2X composition edits for historical source hashes.
// The recommendations themselves always execute the current application code.
const assert = require("node:assert/strict");
const ts = require("typescript");

function replaceOnce(source, before, after) {
  assert.equal(source.split(before).length, 2, "Unexpected 2X structural change: " + before);
  return source.replace(before, () => after);
}

function restoreAssistant2x(source) {
  const ast = ts.createSourceFile("assistant.tsx", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const expected = {
    getTrappedAdvice: 7, getBabyAdvice: 7, getSmallBirdAdvice: 4,
    getLargeBirdAdvice: 4, getBatAdvice: 1, getSmallMammalAdvice: 1,
    getLargeMammalAdvice: 1, getReptileAmphibianAdvice: 1,
    getMarineAnimalAdvice: 1, getDeadMarineAnimalAdvice: 1,
    getUnknownAnimalAdvice: 1, getAdviceParts: 1,
  };
  const counts = {};
  const edits = [];
  function visit(node) {
    if (ts.isCallExpression(node) && node.expression.getText(ast) === "withCommonEnd") {
      assert.ok(ts.isReturnStatement(node.parent), "Closing blocks must remain generator returns");
      assert.equal(node.arguments.length, 2);
      const [body, closing] = node.arguments;
      assert.ok(ts.isIdentifier(closing) && ["COMMON_END", "commonEnd"].includes(closing.text));
      let owner = node.parent;
      while (owner && !ts.isFunctionDeclaration(owner)) owner = owner.parent;
      const name = owner?.name?.text;
      assert.ok(Object.hasOwn(expected, name));
      counts[name] = (counts[name] || 0) + 1;
      const separator = source.slice(body.end, closing.getStart(ast));
      assert.equal(separator.split(",").length, 2);
      // Restore the original '+' in place, preserving every byte of the body.
      let expression = source.slice(node.expression.end, body.end) +
        separator.replace(",", "+") + source.slice(closing.getStart(ast), node.end);
      if (name === "getAdviceParts") expression = "fromLegacyAdvice(" + expression + ", COMMON_END)";
      edits.push([node.getStart(ast), node.end, expression]);
      return;
    }
    ts.forEachChild(node, visit);
  }
  visit(ast);
  assert.deepEqual(counts, expected, "Generator closing-block coverage changed");
  for (const [start, end, text] of edits.sort((a, b) => b[0] - a[0])) {
    source = source.slice(0, start) + text + source.slice(end);
  }
  if (source.includes('from "@/utils/adviceComposition"')) {
    source = replaceOnce(source, "formatAdvice, withCommonEnd, withAdviceSupplements", "formatAdvice, fromLegacyAdvice, withAdviceSupplements");
  }
  source = replaceOnce(source, "function addSupplementalAdvice(parts: AdviceParts, flags: FlagsState)", "function addSupplementalAdvice(baseAdvice: string, flags: FlagsState)");
  source = replaceOnce(source, "  const supplementalBlocks: string[] = [];\r\n", "  const supplementalBlocks: string[] = [];\r\n  const parts = fromLegacyAdvice(baseAdvice.trimEnd(), COMMON_END);\r\n");
  source = replaceOnce(source, "return getDeadMarineAnimalAdvice(animalType);", "return fromLegacyAdvice(getDeadMarineAnimalAdvice(animalType), COMMON_END);");
  return replaceOnce(source, "  let advice: AdviceParts;", "  let advice: string;");
}

module.exports = { restoreAssistant2x };
