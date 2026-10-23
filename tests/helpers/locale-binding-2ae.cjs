// Invert only authorised 2AE locale bindings for historical hashes.
const assert=require("node:assert/strict");
const groups={
  "components/sos/SosAssistant.tsx": [
    [
      "import { interfacePendingEs } from \"@/i18n/catalogs/interface-pending.es\";\r\n",
      "import { getEffectiveCatalog } from \"@/i18n/translate\";\r\n",
      1
    ],
    [
      "import { rescueSummaryEs } from \"@/i18n/catalogs/rescue-summary.es\";\r\n",
      "// General text catalogs resolve through the effective locale.\r\n",
      1
    ],
    [
      "rescueSummaryEs.summaryLocation.",
      "generalTexts.summaryLocation.",
      3
    ],
    [
      "rescueSummaryEs.summaryPreview.",
      "generalTexts.summaryPreview.",
      22
    ],
    [
      "interfacePendingEs.assistantCaptureUi.",
      "generalTexts.assistantCaptureUi.",
      24
    ],
    [
      "rescueSummaryEs.summaryInstructions.",
      "generalTexts.summaryInstructions.",
      13
    ],
    [
      "const AnimatedPressable = Animated.createAnimatedComponent(Pressable);",
      "const generalTexts = getEffectiveCatalog();\r\n\r\nconst AnimatedPressable = Animated.createAnimatedComponent(Pressable);",
      1
    ],
    [
      "  const { t } = useI18n();",
      "  const { t, locale } = useI18n();\r\n  const generalTexts = getEffectiveCatalog(locale);",
      1
    ]
  ],
  "app/history.tsx": [
    [
      "import { interfacePendingEs } from \"@/i18n/catalogs/interface-pending.es\";\r\n",
      "import { getEffectiveCatalog } from \"@/i18n/translate\";\r\n",
      1
    ],
    [
      "import { rescueSummaryEs } from \"@/i18n/catalogs/rescue-summary.es\";\r\n",
      "// General text catalogs resolve through the effective locale.\r\n",
      1
    ],
    [
      "rescueSummaryEs.historyAnimalLabels.",
      "generalTexts.historyAnimalLabels.",
      13
    ],
    [
      "rescueSummaryEs.historyStateLabels.",
      "generalTexts.historyStateLabels.",
      2
    ],
    [
      "rescueSummaryEs.historyPlaceLabels.",
      "generalTexts.historyPlaceLabels.",
      9
    ],
    [
      "rescueSummaryEs.historyPositionLabels.",
      "generalTexts.historyPositionLabels.",
      10
    ],
    [
      "rescueSummaryEs.historyEnvironmentLabels.",
      "generalTexts.historyEnvironmentLabels.",
      11
    ],
    [
      "rescueSummaryEs.historyFlagLabels.",
      "generalTexts.historyFlagLabels.",
      17
    ],
    [
      "rescueSummaryEs.summaryHistory.",
      "generalTexts.summaryHistory.",
      12
    ],
    [
      "rescueSummaryEs.summaryLocation.",
      "generalTexts.summaryLocation.",
      8
    ],
    [
      "interfacePendingEs.historyUi.",
      "generalTexts.historyUi.",
      17
    ],
    [
      "const ANIMAL_TYPE_LABELS: Record<RescueAnimalType, string> = {\r\n  smallBird: generalTexts.historyAnimalLabels.smallBird,\r\n  largeBird: generalTexts.historyAnimalLabels.largeBird,\n  bat: generalTexts.historyAnimalLabels.bat,\r\n  smallMammal: generalTexts.historyAnimalLabels.smallMammal,\n  largeMammal: generalTexts.historyAnimalLabels.largeMammal,\n  reptileAmphibian: generalTexts.historyAnimalLabels.reptileAmphibian,\n  dolphin: generalTexts.historyAnimalLabels.dolphin,\n  largeCetacean: generalTexts.historyAnimalLabels.largeCetacean,\n  seal: generalTexts.historyAnimalLabels.seal,\n  seaTurtle: generalTexts.historyAnimalLabels.seaTurtle,\n  sharkRay: generalTexts.historyAnimalLabels.sharkRay,\n  otherMarine: generalTexts.historyAnimalLabels.otherMarine,\n  unknown: generalTexts.historyAnimalLabels.unknown,\n};",
      "const generalTexts = getEffectiveCatalog();\r\n\r\nconst ANIMAL_TYPE_LABELS: Record<RescueAnimalType, string> = {\r\n  smallBird: generalTexts.historyAnimalLabels.smallBird,\r\n  largeBird: generalTexts.historyAnimalLabels.largeBird,\n  bat: generalTexts.historyAnimalLabels.bat,\r\n  smallMammal: generalTexts.historyAnimalLabels.smallMammal,\n  largeMammal: generalTexts.historyAnimalLabels.largeMammal,\n  reptileAmphibian: generalTexts.historyAnimalLabels.reptileAmphibian,\n  dolphin: generalTexts.historyAnimalLabels.dolphin,\n  largeCetacean: generalTexts.historyAnimalLabels.largeCetacean,\n  seal: generalTexts.historyAnimalLabels.seal,\n  seaTurtle: generalTexts.historyAnimalLabels.seaTurtle,\n  sharkRay: generalTexts.historyAnimalLabels.sharkRay,\n  otherMarine: generalTexts.historyAnimalLabels.otherMarine,\n  unknown: generalTexts.historyAnimalLabels.unknown,\n};",
      1
    ],
    [
      "import { getEffectiveCatalog } from \"@/i18n/translate\";",
      "import { getEffectiveCatalog } from \"@/i18n/translate\";\r\nimport { useI18n } from \"@/i18n/I18nProvider\";",
      1
    ],
    [
      "function HistoryCard({\r\n  rescueCase,\r\n  expanded,\r\n  onToggle,\r\n  onCopy,\r\n  onDelete,\r\n}: {\r\n  rescueCase: RescueCase;\r\n  expanded: boolean;\r\n  onToggle: () => void;\r\n  onCopy: () => void;\r\n  onDelete: () => void;\r\n}) {",
      "function HistoryCard({\r\n  rescueCase,\r\n  expanded,\r\n  onToggle,\r\n  onCopy,\r\n  onDelete,\r\n}: {\r\n  rescueCase: RescueCase;\r\n  expanded: boolean;\r\n  onToggle: () => void;\r\n  onCopy: () => void;\r\n  onDelete: () => void;\r\n}) {\r\n  const { locale } = useI18n();\r\n  const generalTexts = getEffectiveCatalog(locale);",
      1
    ],
    [
      "export default function HistoryPage() {",
      "export default function HistoryPage() {\r\n  const { locale } = useI18n();\r\n  const generalTexts = getEffectiveCatalog(locale);",
      1
    ]
  ],
  "app/aviso.tsx": [
    [
      "import { interfacePendingEs } from \"@/i18n/catalogs/interface-pending.es\";\r\n",
      "import { getEffectiveCatalog } from \"@/i18n/translate\";\r\n",
      1
    ],
    [
      "interfacePendingEs.guidePreparationUi.",
      "generalTexts.guidePreparationUi.",
      3
    ],
    [
      "import { getEffectiveCatalog } from \"@/i18n/translate\";",
      "import { getEffectiveCatalog } from \"@/i18n/translate\";\r\nimport { useI18n } from \"@/i18n/I18nProvider\";",
      1
    ],
    [
      "export default function AvisoRoute() {",
      "export default function AvisoRoute() {\r\n  const { locale } = useI18n();\r\n  const generalTexts = getEffectiveCatalog(locale);",
      1
    ]
  ],
  "app/+not-found.tsx": [
    [
      "import { interfacePendingEs } from \"@/i18n/catalogs/interface-pending.es\";\r\n",
      "import { getEffectiveCatalog } from \"@/i18n/translate\";\r\n",
      1
    ],
    [
      "interfacePendingEs.notFoundUi.",
      "generalTexts.notFoundUi.",
      6
    ],
    [
      "import { getEffectiveCatalog } from \"@/i18n/translate\";",
      "import { getEffectiveCatalog } from \"@/i18n/translate\";\r\nimport { useI18n } from \"@/i18n/I18nProvider\";",
      1
    ],
    [
      "export default function NotFoundPage() {",
      "export default function NotFoundPage() {\r\n  const { locale } = useI18n();\r\n  const generalTexts = getEffectiveCatalog(locale);",
      1
    ]
  ],
  "components/AppVersionGate.tsx": [
    [
      "import { interfacePendingEs } from \"@/i18n/catalogs/interface-pending.es\";\r\n",
      "import { getEffectiveCatalog } from \"@/i18n/translate\";\r\n",
      1
    ],
    [
      "interfacePendingEs.versionGateUi.",
      "generalTexts.versionGateUi.",
      4
    ],
    [
      "import { getEffectiveCatalog } from \"@/i18n/translate\";",
      "import { getEffectiveCatalog } from \"@/i18n/translate\";\r\nimport { useI18n } from \"@/i18n/I18nProvider\";",
      1
    ],
    [
      "export default function AppVersionGate({ children }: { children: ReactNode }) {",
      "export default function AppVersionGate({ children }: { children: ReactNode }) {\r\n  const { locale } = useI18n();\r\n  const generalTexts = getEffectiveCatalog(locale);",
      1
    ]
  ],
  "utils/rescueShareMessage.ts": [
    [
      "import { rescueSummaryEs } from \"@/i18n/catalogs/rescue-summary.es\";\r\n",
      "import { getEffectiveCatalog } from \"@/i18n/translate\";\r\n",
      1
    ],
    [
      "rescueSummaryEs.rescueMessage.",
      "generalTexts.rescueMessage.",
      14
    ],
    [
      "const t = createTranslator(DEFAULT_LOCALE);",
      "const generalTexts = getEffectiveCatalog();\r\n\r\nconst t = createTranslator(DEFAULT_LOCALE);",
      1
    ]
  ],
  "i18n/I18nProvider.tsx": [
    [
      "import { languageFeatures } from \"./config\";",
      "import { getEffectiveLocale } from \"./effectiveLocale\";",
      1
    ],
    [
      "  const locale = languageFeatures.englishPublished\n    ? resolveRouteLocale(pathname, Platform.OS === \"web\" ? \"web\" : \"native\")\n    : DEFAULT_LOCALE;",
      "  const platform = Platform.OS === \"web\" ? \"web\" : \"native\";\r\n  const locale = getEffectiveLocale(resolveRouteLocale(pathname, platform), platform);",
      1
    ],
    [
      "import { DEFAULT_LOCALE, type Locale } from \"./types\";",
      "import { type Locale } from \"./types\";",
      1
    ]
  ]
};
function restoreLocaleBinding(source,file){const pairs=groups[file];if(!pairs)return source;for(const [before,after,count]of [...pairs].reverse()){assert.equal(source.split(after).length,count+1,"Unexpected 2AE binding: "+after);source=source.split(after).join(before);}return source;}
module.exports={restoreLocaleBinding};
