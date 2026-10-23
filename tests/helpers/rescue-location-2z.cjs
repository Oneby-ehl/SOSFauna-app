// Undo only authorised location presentation/state edits for historical hashes.
// These adapters never replace the code executed for protocol comparisons.
const assert = require("node:assert/strict");
const groups = {
  "assistant": [
    [
      "import type { MarineAdviceRecommendation }",
      "import { type LocationSummaryLine, type StoredLocationValue, readStoredLocationText, writeStoredLocationText } from \"@/utils/rescueLocation\";\r\nimport type { MarineAdviceRecommendation }"
    ],
    [
      "function buildLocationSummaryLines(\r\n  approximateLocation: string | undefined,\r\n  coords: RescueCoordinates | null,\r\n) {\r\n  const lines: string[] = [];\r\n\r\n  if (approximateLocation) {\r\n    lines.push(`Referencia del lugar: ${approximateLocation}`);\r\n  }\r\n\r\n  if (coords) {\r\n    lines.push(\r\n      `Coordenadas: ${formatCoordinates(coords)}`,\r\n      `Mapa: https://maps.google.com/?q=${coords.latitude},${coords.longitude}`,\r\n    );\r\n  }\r\n\r\n  return lines;\r\n}",
      "function buildLocationSummaryLines(\r\n  approximateLocation: string | undefined,\r\n  coords: RescueCoordinates | null,\r\n) {\r\n  const lines: LocationSummaryLine[] = [];\r\n\r\n  if (approximateLocation) {\r\n    lines.push({ kind: \"reference\", text: `Referencia del lugar: ${approximateLocation}` });\r\n  }\r\n\r\n  if (coords) {\r\n    lines.push(\r\n      { kind: \"coordinates\", text: `Coordenadas: ${formatCoordinates(coords)}` },\r\n      { kind: \"map\", text: `Mapa: https://maps.google.com/?q=${coords.latitude},${coords.longitude}` },\r\n    );\r\n  }\r\n\r\n  return lines;\r\n}"
    ],
    [
      "  const [locationText, setLocationText] = useState(\r\n    initialCase?.locationText ?? \"Ubicación no capturada todavía.\",\r\n  );",
      "  const [locationValue, setLocationValue] = useState<StoredLocationValue>(() =>\r\n    readStoredLocationText(initialCase?.locationText),\r\n  );\r\n  const locationText = writeStoredLocationText(locationValue);"
    ],
    [
      "      setLocationText(newLocationText);",
      "      setLocationValue({ kind: \"text\", text: newLocationText });"
    ],
    [
      "      locationLines: locationSummaryLines,",
      "      locationLines: locationSummaryLines.map((line) => line.text),"
    ],
    [
      "            {locationSummaryLines.map((line) => {\r\n              const displayLine = line.startsWith(\"Mapa:\")",
      "            {locationSummaryLines.map((entry) => {\r\n              const line = entry.text;\r\n              const displayLine = entry.kind === \"map\""
    ]
  ],
  "history": [
    [
      "import { Stack, useFocusEffect, useRouter }",
      "import { readStoredLocationText } from \"@/utils/rescueLocation\";\r\nimport { Stack, useFocusEffect, useRouter }"
    ],
    [
      "function getStoredLocationFallback(rescueCase: RescueCase) {\n  const locationText = normalizeUsefulText(rescueCase.locationText);\n\n  if (!locationText || locationText === \"Ubicación no capturada todavía.\") {\n    return undefined;\n  }\n\n  return locationText;\n}",
      "function getStoredLocationFallback(rescueCase: RescueCase) {\r\n  const location = readStoredLocationText(normalizeUsefulText(rescueCase.locationText));\r\n  return location.kind === \"text\" ? location.text : undefined;\r\n}"
    ]
  ]
};
function restore(source, group) {
  for (const [before, after] of [...groups[group]].reverse()) {
    assert.equal(source.split(after).length, 2, "Unexpected 2Z structural change: " + after);
    source = source.replace(after, () => before);
  }
  return source;
}
module.exports = { restoreLocationAssistant: source => restore(source, "assistant"), restoreLocationHistory: source => restore(source, "history") };
