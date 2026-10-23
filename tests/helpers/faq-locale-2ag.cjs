// Reverse only authorised FAQ locale bindings for the original protected hash.
const assert=require("node:assert/strict");
const pairs=[
  [
    "import { recommendationFragmentsEs } from \"@/i18n/catalogs/recommendation-fragments.es\";",
    "import { getEffectiveCatalog } from \"@/i18n/translate\";\r\nimport { DEFAULT_LOCALE, type Locale } from \"@/i18n/types\";\r\nimport { getFaqItemsForLocale } from \"@/data/faq\";\r\nimport { getFaqCategoryId, getFaqCategoryLabel } from \"@/data/faqCategories\";\r\nimport { getFaqSearchEngine } from \"@/utils/faqSearch\";\r\nimport { getAnimalSearchEngine } from \"@/data/animalSearchCatalog\";",
    1
  ],
  [
    "  getAdviceParts,",
    "  getAdvicePartsForLocale,",
    1
  ],
  [
    "function getMarineAnimalFaqAnswer(animal: AnimalSearchItem) {",
    "function getMarineAnimalFaqAnswer(animal: AnimalSearchItem, locale: Locale = DEFAULT_LOCALE) {\r\n  const texts = getEffectiveCatalog(locale);",
    1
  ],
  [
    "function getSwiftAnimalFaqAnswer() {",
    "function getSwiftAnimalFaqAnswer(locale: Locale = DEFAULT_LOCALE) {\r\n  const texts = getEffectiveCatalog(locale);",
    1
  ],
  [
    "recommendationFragmentsEs.",
    "texts.",
    27
  ],
  [
    "  const { t } = useI18n();",
    "  const { t, locale } = useI18n();\r\n  const texts = getEffectiveCatalog(locale);\r\n  const faqItems = getFaqItemsForLocale(locale);\r\n  const { searchFaqItems } = getFaqSearchEngine(locale);\r\n  const { getAnimalCatalogSearchState } = getAnimalSearchEngine(locale);\r\n  const categoryLabel = (category: (typeof faqCategories)[number]) => getFaqCategoryLabel(getFaqCategoryId(category), locale);",
    1
  ],
  [
    "getMarineAnimalFaqAnswer(selectedAnimal)",
    "getMarineAnimalFaqAnswer(selectedAnimal, locale)",
    1
  ],
  [
    "getSwiftAnimalFaqAnswer();",
    "getSwiftAnimalFaqAnswer(locale);",
    1
  ],
  [
    "      getAdviceParts(",
    "      getAdvicePartsForLocale(\n        locale,",
    1
  ],
  [
    "category !== \"Conocer al vencejo\"",
    "getFaqCategoryId(category) !== \"swiftKnowledge\"",
    1
  ],
  [
    "key={category}",
    "key={getFaqCategoryId(category)}",
    1
  ],
  [
    "key={group.category}",
    "key={getFaqCategoryId(group.category)}",
    1
  ],
  [
    "${t(\"faqUi\", \"categoryPrefix\")}${category}",
    "${t(\"faqUi\", \"categoryPrefix\")}${categoryLabel(category)}",
    1
  ],
  [
    ">{category}</Text>",
    ">{categoryLabel(category)}</Text>",
    1
  ],
  [
    ">{group.category}</Text>",
    ">{categoryLabel(group.category)}</Text>",
    1
  ],
  [
    "groupsByCategory.get(item.category)",
    "groupsByCategory.get(getFaqCategoryId(item.category))",
    1
  ],
  [
    "groupsByCategory.set(item.category,",
    "groupsByCategory.set(getFaqCategoryId(item.category),",
    1
  ],
  [
    "categoryOffsetsRef.current[category]",
    "categoryOffsetsRef.current[getFaqCategoryId(category as (typeof faqCategories)[number])]",
    1
  ],
  [
    "categoryOffsetsRef.current[group.category]",
    "categoryOffsetsRef.current[getFaqCategoryId(group.category)]",
    1
  ],
  [
    "setFocusedCategory(category)",
    "setFocusedCategory(getFaqCategoryId(category as (typeof faqCategories)[number]))",
    1
  ],
  [
    "focusedCategory === category",
    "focusedCategory === getFaqCategoryId(category)",
    1
  ],
  [
    "[selectedAnimal]);",
    "[selectedAnimal, locale, faqItems]);",
    1
  ],
  [
    "import { getFaqItemsForLocale }",
    "import { getFaqSearchVocabulary } from \"@/data/faqSearchVocabulary\";\r\nimport { getFaqItemsForLocale, type FaqItem }",
    1
  ],
  [
    "  const faqItems = getFaqItemsForLocale(locale);",
    "  const faqItems: FaqItem[] = getFaqItemsForLocale(locale);",
    1
  ],
  [
    "const GENERAL_SWIFT_QUERIES = new Set([\"vencejo\", \"vencejos\", \"apus apus\"]);\r\nconst BAT_FLIGHT_OR_GROUND_TERMS = [\n  \"no vuela\",\n  \"no puede volar\",\n  \"que no vuela\",\n  \"en el suelo\",\n  \"suelo\",\n];\n\nconst marineAnimalCategories",
    "// Intent vocabulary is selected per language without changing Spanish priorities.\r\nconst marineAnimalCategories",
    1
  ],
  [
    "function isGeneralSwiftQuery(query: string) {\n  return GENERAL_SWIFT_QUERIES.has(normalizeSearchText(query));\n}",
    "function isGeneralSwiftQuery(query: string, locale: Locale = DEFAULT_LOCALE) {\n  return getFaqSearchVocabulary(locale).generalSwiftQueries.has(normalizeSearchText(query));\n}",
    1
  ],
  [
    "function isBatFlightOrGroundQuery(\n  query: string,\n  selectedAnimal: AnimalSearchItem | null,\n) {\n  return (\r\n    selectedAnimal?.id.startsWith(\"murcielago\") &&\r\n    BAT_FLIGHT_OR_GROUND_TERMS.some((term) =>\r\n      normalizeSearchText(query).includes(term),\r\n    )\r\n  );\r\n}",
    "function isBatFlightOrGroundQuery(\n  query: string,\n  selectedAnimal: AnimalSearchItem | null, locale: Locale = DEFAULT_LOCALE,\n) {\n  return (\r\n    selectedAnimal?.id.startsWith(\"murcielago\") &&\r\n    getFaqSearchVocabulary(locale).batFlightOrGroundTerms.some((term) =>\r\n      normalizeSearchText(query).includes(term),\r\n    )\r\n  );\r\n}",
    1
  ],
  [
    "function isSelectedAnimalIntroQuery(\r\n  query: string,\r\n  selectedAnimal: AnimalSearchItem | null,\r\n) {\r\n  if (!selectedAnimal) return false;\r\n\r\n  const normalizedQuery = normalizeSearchText(query);\r\n\r\n  return (\r\n    getAnimalSearchTerms(selectedAnimal).some(\r\n      (term) => normalizedQuery === term,\r\n    ) ||\r\n    normalizedQuery.includes(\"encontr\") ||\r\n    normalizedQuery.includes(\"que hago\") ||\r\n    normalizedQuery.includes(\"qué hago\")\r\n  );\r\n}",
    "function isSelectedAnimalIntroQuery(\r\n  query: string,\r\n  selectedAnimal: AnimalSearchItem | null, locale: Locale = DEFAULT_LOCALE,\r\n) {\r\n  if (!selectedAnimal) return false;\r\n\r\n  const normalizedQuery = normalizeSearchText(query);\r\n\r\n  return (\r\n    getAnimalSearchEngine(locale).getAnimalSearchTerms(selectedAnimal).some(\r\n      (term) => normalizedQuery === term,\r\n    ) ||\r\n    getFaqSearchVocabulary(locale).selectedAnimalIntroTerms.some(term => normalizedQuery.includes(term))\r\n  );\r\n}",
    1
  ],
  [
    "function isSelectedAnimalNameOnlyQuery(\r\n  query: string,\r\n  selectedAnimal: AnimalSearchItem | null,\r\n) {\r\n  if (!selectedAnimal) return false;\r\n\r\n  const normalizedQuery = normalizeSearchText(query);\r\n\r\n  return getAnimalSearchTerms(selectedAnimal).some(\r\n    (term) => normalizedQuery === term,\r\n  );\r\n}",
    "function isSelectedAnimalNameOnlyQuery(\r\n  query: string,\r\n  selectedAnimal: AnimalSearchItem | null, locale: Locale = DEFAULT_LOCALE,\r\n) {\r\n  if (!selectedAnimal) return false;\r\n\r\n  const normalizedQuery = normalizeSearchText(query);\r\n\r\n  return getAnimalSearchEngine(locale).getAnimalSearchTerms(selectedAnimal).some(\r\n    (term) => normalizedQuery === term,\r\n  );\r\n}",
    1
  ],
  [
    "isSelectedAnimalIntroQuery(\n        searchQuery,\n        selectedAnimal,\n      )",
    "isSelectedAnimalIntroQuery(\n        searchQuery,\n        selectedAnimal, locale,\n      )",
    1
  ],
  [
    "isBatFlightOrGroundQuery(searchQuery, queryAnimal)",
    "isBatFlightOrGroundQuery(searchQuery, queryAnimal, locale)",
    1
  ],
  [
    "isGeneralSwiftQuery(searchQuery)",
    "isGeneralSwiftQuery(searchQuery, locale)",
    1
  ],
  [
    "isSelectedAnimalNameOnlyQuery(\n        searchQuery,\n        selectedAnimal,\n      )",
    "isSelectedAnimalNameOnlyQuery(\n        searchQuery,\n        selectedAnimal, locale,\n      )",
    1
  ],
  [
    "const speciesOverviewCategoryOrder = [\r\n  \"Antes de actuar\",\r\n  \"Animales heridos o atrapados\",\r\n  \"Crías y animales jóvenes\",\r\n  \"Manipulación y cuidados\",\r\n  \"Contacto y emergencias\",\r\n  \"Conocer al vencejo\",\r\n  \"La aplicación\",\r\n] as const;",
    "const speciesOverviewCategoryOrder = [\r\n  \"beforeActing\",\r\n  \"injuredOrTrapped\",\r\n  \"youngAnimals\",\r\n  \"handlingAndCare\",\r\n  \"contactAndEmergencies\",\r\n  \"swiftKnowledge\",\r\n  \"application\",\r\n] as const;",
    1
  ],
  [
    "  const normalizedCategory = normalizeSearchText(category);",
    "  const normalizedCategory = getFaqCategoryId(category as (typeof faqCategories)[number]);",
    1
  ],
  [
    "normalizeSearchText(orderedCategory) === normalizedCategory",
    "orderedCategory === normalizedCategory",
    1
  ],
  [
    "new Set(visibleFaqCategories)",
    "new Set(visibleFaqCategories.map(getFaqCategoryId))",
    1
  ],
  [
    "visibleCategorySet.has(item.category)",
    "visibleCategorySet.has(getFaqCategoryId(item.category))",
    1
  ],
  [
    "      visibleFaqCategories,\r\n    ],",
    "      visibleFaqCategories,\r\n      locale,\r\n      searchFaqItems,\r\n    ],",
    1
  ],
  [
    "  }, [selectedAnimal, selectedAnimalAdvice]);",
    "  }, [selectedAnimal, selectedAnimalAdvice, faqItems, locale]);",
    1
  ]
];
function restoreFaqLocale(source){for(const [before,after,count]of [...pairs].reverse()){assert.equal(source.split(after).length,count+1,"Unexpected 2AG binding: "+after);source=source.split(after).join(before);}return source;}
module.exports={restoreFaqLocale};
