/* global __dirname */
// Phase 2W: undo only the authorised structural edits for the original hashes.
// Actual comparisons always execute the current structured composition.
const assert = require("node:assert/strict");
const assistantEdits = [
  [
    "  let advice = baseAdvice.trimEnd();",
    "  const parts = fromLegacyAdvice(baseAdvice.trimEnd(), COMMON_END);"
  ],
  [
    "  if (advice.endsWith(COMMON_END)) {\r\n    advice = advice.slice(0, -COMMON_END.length).trimEnd();\r\n  }\r\n\r\n  return [advice, ...supplementalBlocks, COMMON_END].join(\"\\n\\n\");",
    "  return withAdviceSupplements(parts, supplementalBlocks, COMMON_END);"
  ],
  [
    "export function getAdvice(\n  animalState: AnimalState,\n  animalType: AnimalType,\n  flags: FlagsState,\n  animalPosition?: AnimalPosition | null,\n  animalEnvironment?: AnimalEnvironment | null,\n) ",
    "export function getAdviceParts(\n  animalState: AnimalState,\n  animalType: AnimalType,\n  flags: FlagsState,\n  animalPosition?: AnimalPosition | null,\n  animalEnvironment?: AnimalEnvironment | null,\n): AdviceParts "
  ],
  [
    "    return getDeadMarineAnimalAdvice(animalType);",
    "    return fromLegacyAdvice(getDeadMarineAnimalAdvice(animalType), COMMON_END);"
  ],
  [
    "return (\n    deadAnimalEs.deadAdvice.terrestrialTitle +\n    \"⚠️ ANTES DE INTERVENIR\\n\" +\r\n    deadAnimalEs.deadAdvice.findingDeadAnimalObserveCalmlyLine +\r\n    deadAnimalEs.deadAdvice.observationsMayPreventOtherDeathsParagraph +\r\n    \"🔍 QUÉ OBSERVAR\\n\" +\r\n    deadAnimalEs.deadAdvice.checkOtherAffectedAnimalsFromDistanceLine +\r\n    deadAnimalEs.deadAdvice.lookForVisibleCausesWithoutTouchingLine +\r\n    deadAnimalEs.deadAdvice.checkPeopleAndPetsRiskParagraph +\r\n    \"❌ QUÉ NO HACER\\n\" +\r\n    deadAnimalEs.deadAdvice.doNotTouchOrMoveExceptDangerAndInstructionLine +\r\n    deadAnimalEs.deadAdvice.doNotHandleSuspiciousObjectsLine +\r\n    deadAnimalEs.deadAdvice.doNotAlterDiscoverySiteParagraph +\r\n    \"✅ QUÉ HACER\\n\" +\r\n    deadAnimalEs.deadAdvice.documentAnimalAndSurroundingsWithoutChangingSceneLine +\r\n    deadAnimalEs.deadAdvice.provideExactLocationForProfessionalsLine +\r\n    deadAnimalEs.deadAdvice.reportToAuthoritiesWithObservationsParagraph+\r\n  commonEnd\r\n  );",
    "return fromLegacyAdvice((\n    deadAnimalEs.deadAdvice.terrestrialTitle +\n    \"⚠️ ANTES DE INTERVENIR\\n\" +\r\n    deadAnimalEs.deadAdvice.findingDeadAnimalObserveCalmlyLine +\r\n    deadAnimalEs.deadAdvice.observationsMayPreventOtherDeathsParagraph +\r\n    \"🔍 QUÉ OBSERVAR\\n\" +\r\n    deadAnimalEs.deadAdvice.checkOtherAffectedAnimalsFromDistanceLine +\r\n    deadAnimalEs.deadAdvice.lookForVisibleCausesWithoutTouchingLine +\r\n    deadAnimalEs.deadAdvice.checkPeopleAndPetsRiskParagraph +\r\n    \"❌ QUÉ NO HACER\\n\" +\r\n    deadAnimalEs.deadAdvice.doNotTouchOrMoveExceptDangerAndInstructionLine +\r\n    deadAnimalEs.deadAdvice.doNotHandleSuspiciousObjectsLine +\r\n    deadAnimalEs.deadAdvice.doNotAlterDiscoverySiteParagraph +\r\n    \"✅ QUÉ HACER\\n\" +\r\n    deadAnimalEs.deadAdvice.documentAnimalAndSurroundingsWithoutChangingSceneLine +\r\n    deadAnimalEs.deadAdvice.provideExactLocationForProfessionalsLine +\r\n    deadAnimalEs.deadAdvice.reportToAuthoritiesWithObservationsParagraph+\r\n  commonEnd\r\n  ), COMMON_END);"
  ]
];
const faqEdits = [
  [
    "  COMMON_END,\r\n",
    ""
  ],
  [
    "  getAdvice,",
    "  getAdviceParts,"
  ],
  [
    "function escapeRegExp(value: string) {\r\n  return value.replace(/[.*+?^${}()|[\\]\\\\]/g, \"\\\\$&\");\r\n}\r\n\r\nfunction removeAssistantNextStepParagraph(advice: string) {\r\n  return advice\r\n    .replace(new RegExp(`\\\\n*${escapeRegExp(COMMON_END)}$`), \"\")\r\n    .trim();\r\n}\r\n\r\n",
    "import { formatAdvice } from \"@/utils/adviceComposition\";\r\n\r\n"
  ],
  [
    "    return removeAssistantNextStepParagraph(\n      getAdvice(\n        \"alive\",\n        selectedAnimal.category as AnimalType,\r\n        createInitialFlags(),\r\n      ),\r\n    );",
    "    return formatAdvice(\n      getAdviceParts(\n        \"alive\",\n        selectedAnimal.category as AnimalType,\r\n        createInitialFlags(),\r\n      ),\r\n      false,\n    ).trim();"
  ]
];
const wrapper = "export function getAdvice(\n  animalState: AnimalState,\n  animalType: AnimalType,\n  flags: FlagsState,\n  animalPosition?: AnimalPosition | null,\n  animalEnvironment?: AnimalEnvironment | null,\n) {\r\n  return formatAdvice(getAdviceParts(animalState, animalType, flags, animalPosition, animalEnvironment));\r\n}";
const compositionImport = "import { type AdviceParts, formatAdvice, fromLegacyAdvice, withAdviceSupplements } from \"@/utils/adviceComposition\";";
function replaceOnce(source, before, after) {
  assert.equal(source.split(before).length, 2, "Unexpected structural change: " + before);
  return source.replace(before, () => after);
}
function restoreAssistant(source) {
  // Pure declarations use LF between functions; full source retains CRLF.
  const wrapperEnd = source.indexOf(wrapper) + wrapper.length;
  assert.ok(wrapperEnd >= wrapper.length && source.includes(wrapper), "Public getAdvice wrapper changed");
  const separator = source.slice(wrapperEnd).match(/^\s*/)[0];
  source = replaceOnce(source, wrapper + separator, "");
  if (source.includes(compositionImport)) source = replaceOnce(source, compositionImport + "\r\n", "");
  for (const [before, after] of [...assistantEdits].reverse()) source = replaceOnce(source, after, before);
  return source;
}
function restoreFaq(source) {
  for (const [before, after] of [...faqEdits].reverse()) {
    // Removing COMMON_END from the import is the only empty replacement.
    if (!after) source = replaceOnce(source, "  type AnimalType,\r\n", "  type AnimalType,\r\n" + before);
    else source = replaceOnce(source, after, before);
  }
  return source;
}
module.exports = { restoreAssistant, restoreFaq };
