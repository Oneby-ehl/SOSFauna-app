// Invert only the 2Y ID wrappers for historical hashes, never for executed outputs.
const assert = require("node:assert/strict");
const ts = require("typescript");
const expected = {
  "marine.do-not-return-to-water": {
    "expressions": [
      "marineFlagsEs.marineFlagAdvice.doNotReturnToWater"
    ],
    "uses": 1
  },
  "marine.do-not-remove-entangled-gear": {
    "expressions": [
      "marineFlagsEs.marineFlagAdvice.doNotRemoveEntangledGear"
    ],
    "uses": 1
  },
  "marine.describe-entanglement-without-touching": {
    "expressions": [
      "marineFlagsEs.marineFlagAdvice.describeEntanglementWithoutTouching"
    ],
    "uses": 1
  },
  "marine.do-not-pull-line-or-remove-hook": {
    "expressions": [
      "marineFlagsEs.marineFlagAdvice.doNotPullLineOrRemoveHook"
    ],
    "uses": 1
  },
  "marine.report-fishing-gear-location": {
    "expressions": [
      "marineFlagsEs.marineFlagAdvice.reportFishingGearLocation"
    ],
    "uses": 1
  },
  "marine.report-animal-count-and-location": {
    "expressions": [
      "marineFlagsEs.marineFlagAdvice.reportAnimalCountAndLocation"
    ],
    "uses": 1
  },
  "marine.keep-people-and-dogs-away": {
    "expressions": [
      "\"• Mantén personas y perros alejados si puedes hacerlo sin riesgo.\""
    ],
    "uses": 1
  },
  "marine.do-not-treat-wound": {
    "expressions": [
      "marineFlagsEs.marineFlagAdvice.doNotTreatWound"
    ],
    "uses": 1
  },
  "marine.document-visible-injuries-from-distance": {
    "expressions": [
      "marineFlagsEs.marineFlagAdvice.documentVisibleInjuriesFromDistance"
    ],
    "uses": 1
  },
  "marine.do-not-move-to-test-mobility": {
    "expressions": [
      "marineFlagsEs.marineFlagAdvice.doNotMoveToTestMobility"
    ],
    "uses": 1
  },
  "marine.observe-weakness-from-distance": {
    "expressions": [
      "marineFlagsEs.marineFlagAdvice.observeWeaknessFromDistance"
    ],
    "uses": 1
  },
  "marine.describe-other-concerns": {
    "expressions": [
      "marineFlagsEs.marineFlagAdvice.describeOtherConcerns"
    ],
    "uses": 1
  },
  "marine.large-cetacean-distance": {
    "expressions": [
      "marineAnimalEs.marineAnimalAdvice.largeCetaceanDistance"
    ],
    "uses": 1
  },
  "marine.do-not-handle-or-move": {
    "expressions": [
      "marineAnimalEs.marineAnimalAdvice.doNotHandleOrMove"
    ],
    "uses": 3
  },
  "marine.no-food-or-water": {
    "expressions": [
      "marineAnimalEs.marineAnimalAdvice.noFoodOrWater"
    ],
    "uses": 3
  },
  "marine.shark-ray-distance": {
    "expressions": [
      "marineAnimalEs.marineAnimalAdvice.sharkRayDistance"
    ],
    "uses": 1
  },
  "marine.distance-and-quiet": {
    "expressions": [
      "marineAnimalEs.marineAnimalAdvice.distanceAndQuiet"
    ],
    "uses": 1
  },
  "marine.note-exact-location": {
    "expressions": [
      "marineAnimalEs.marineAnimalAdvice.noteExactLocation"
    ],
    "uses": 1
  },
  "marine.document-without-approaching": {
    "expressions": [
      "marineAnimalEs.marineAnimalAdvice.documentWithoutApproaching"
    ],
    "uses": 1
  },
  "marine.seal-may-be-resting": {
    "expressions": [
      "marineAnimalEs.marineAnimalAdvice.sealMayBeResting"
    ],
    "uses": 1
  },
  "marine.do-not-block-seal-return": {
    "expressions": [
      "marineAnimalEs.marineAnimalAdvice.doNotBlockSealReturn"
    ],
    "uses": 1
  },
  "marine.keep-dogs-leashed": {
    "expressions": [
      "marineAnimalEs.marineAnimalAdvice.keepDogsLeashed"
    ],
    "uses": 1
  },
  "marine.allow-seal-rest-and-report-concerns": {
    "expressions": [
      "marineAnimalEs.marineAnimalAdvice.allowSealRestAndReportConcerns"
    ],
    "uses": 1
  },
  "marine.do-not-push-or-drag": {
    "expressions": [
      "marineAnimalEs.marineAnimalAdvice.doNotPushOrDrag"
    ],
    "uses": 1
  },
  "marine.no-mechanical-movement": {
    "expressions": [
      "marineAnimalEs.marineAnimalAdvice.noMechanicalMovement"
    ],
    "uses": 1
  },
  "marine.report-stranding-position": {
    "expressions": [
      "marineAnimalEs.marineAnimalAdvice.reportStrandingPosition"
    ],
    "uses": 1
  },
  "marine.observe-multiple-cetaceans": {
    "expressions": [
      "marineAnimalEs.marineAnimalAdvice.observeMultipleCetaceans"
    ],
    "uses": 1
  },
  "marine.observe-single-cetacean": {
    "expressions": [
      "marineAnimalEs.marineAnimalAdvice.observeSingleCetacean"
    ],
    "uses": 1
  },
  "marine.do-not-pursue-dolphin": {
    "expressions": [
      "marineAnimalEs.marineAnimalAdvice.doNotPursueDolphin"
    ],
    "uses": 1
  },
  "marine.do-not-turn-turtle-over": {
    "expressions": [
      "marineAnimalEs.marineAnimalAdvice.doNotTurnTurtleOver"
    ],
    "uses": 1
  },
  "marine.turtle-fishing-gear-needs-assessment": {
    "expressions": [
      "marineAnimalEs.marineAnimalAdvice.turtleFishingGearNeedsAssessment"
    ],
    "uses": 1
  },
  "marine.do-not-treat-turtle-injuries": {
    "expressions": [
      "marineAnimalEs.marineAnimalAdvice.doNotTreatTurtleInjuries"
    ],
    "uses": 1
  },
  "marine.report-turtle-injuries": {
    "expressions": [
      "marineAnimalEs.marineAnimalAdvice.reportTurtleInjuries"
    ],
    "uses": 1
  },
  "marine.turtle-on-boat-await-instructions": {
    "expressions": [
      "marineAnimalEs.marineAnimalAdvice.turtleOnBoatAwaitInstructions"
    ],
    "uses": 1
  },
  "marine.no-fishing-line-or-sharp-tools": {
    "expressions": [
      "marineAnimalEs.marineAnimalAdvice.noFishingLineOrSharpTools"
    ],
    "uses": 1
  },
  "marine.turtle-air-and-heat-reminder": {
    "expressions": [
      "marineAnimalEs.marineAnimalAdvice.turtleAirAndHeatReminder"
    ],
    "uses": 1
  },
  "marine.avoid-head-tail-and-fins": {
    "expressions": [
      "marineAnimalEs.marineAnimalAdvice.avoidHeadTailAndFins"
    ],
    "uses": 1
  },
  "marine.do-not-touch-to-move": {
    "expressions": [
      "marineAnimalEs.marineAnimalAdvice.doNotTouchToMove"
    ],
    "uses": 1
  },
  "marine.animal-on-boat-seek-help": {
    "expressions": [
      "marineAnimalEs.marineAnimalAdvice.animalOnBoatSeekHelp"
    ],
    "uses": 1
  },
  "marine.observe-other-marine-animal": {
    "expressions": [
      "marineAnimalEs.marineAnimalAdvice.observeOtherMarineAnimal"
    ],
    "uses": 1
  },
  "marine.do-not-enter-water": {
    "expressions": [
      "marineAnimalEs.marineAnimalAdvice.doNotEnterWater"
    ],
    "uses": 1
  },
  "marine.contact-competent-service": {
    "expressions": [
      "marineAnimalEs.marineAnimalAdvice.contactCompetentService"
    ],
    "uses": 1
  }
};
const pairs = [
  [
    "function addUnique(target: string[], text: string) {\n  if (!target.includes(text)) {\n    target.push(text);\n  }\n}",
    "function addUnique(target: MarineAdviceRecommendation[], recommendation: MarineAdviceRecommendation) {\r\n  if (!target.some((item) => item.id === recommendation.id)) {\r\n    target.push(recommendation);\r\n  }\r\n}"
  ],
  [
    "  dont: string[],",
    "  dont: MarineAdviceRecommendation[],"
  ],
  [
    "  actions: string[],",
    "  actions: MarineAdviceRecommendation[],"
  ],
  [
    "  const before =",
    "  const before: MarineAdviceRecommendation[] ="
  ],
  [
    "  const dont: string[] = [];",
    "  const dont: MarineAdviceRecommendation[] = [];"
  ],
  [
    "  const actions = [",
    "  const actions: MarineAdviceRecommendation[] = ["
  ],
  [
    "before.join(\"\\n\")",
    "before.map((item) => item.text).join(\"\\n\")"
  ],
  [
    "dont.join(\"\\n\")",
    "dont.map((item) => item.text).join(\"\\n\")"
  ],
  [
    "actions.join(\"\\n\")",
    "actions.map((item) => item.text).join(\"\\n\")"
  ]
];
const importLine = "import type { MarineAdviceRecommendation } from \"@/utils/marineAdvice\";\r\n";
function replaceOnce(source, before, after) {
  assert.equal(source.split(before).length, 2, "Unexpected 2Y structural change: " + before);
  return source.replace(before, () => after);
}
function restoreAssistant2y(source) {
  const ast = ts.createSourceFile("assistant.tsx", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const edits = [], counts = {};
  function visit(node) {
    if (ts.isObjectLiteralExpression(node) && node.properties.some(p => p.name?.getText(ast) === "id" && ts.isPropertyAssignment(p) && ts.isStringLiteral(p.initializer) && p.initializer.text.startsWith("marine."))) {
      assert.equal(node.properties.length, 2);
      const [id, text] = node.properties;
      assert.ok(ts.isPropertyAssignment(id) && id.name.getText(ast) === "id" && ts.isStringLiteral(id.initializer));
      assert.ok(ts.isPropertyAssignment(text) && text.name.getText(ast) === "text");
      const spec = expected[id.initializer.text];
      assert.ok(spec && spec.expressions.includes(text.initializer.getText(ast)), "ID/text association changed: " + id.initializer.text);
      let owner = node.parent;
      while (owner && !ts.isFunctionDeclaration(owner)) owner = owner.parent;
      assert.ok(["addMarineFlagAdvice", "getMarineAnimalAdvice"].includes(owner?.name?.text));
      counts[id.initializer.text] = (counts[id.initializer.text] || 0) + 1;
      edits.push([node.getStart(ast), node.end, text.initializer.getText(ast)]);
      return;
    }
    ts.forEachChild(node, visit);
  }
  visit(ast);
  assert.deepEqual(counts, Object.fromEntries(Object.entries(expected).map(([id, spec]) => [id, spec.uses])), "Marine ID occurrence coverage changed");
  for (const [start, end, text] of edits.sort((a, b) => b[0] - a[0])) source = source.slice(0, start) + text + source.slice(end);
  for (const [before, after] of [...pairs].reverse()) source = replaceOnce(source, after, before);
  if (source.includes(importLine)) source = replaceOnce(source, importLine, "");
  return source;
}
module.exports = { restoreAssistant2y };
