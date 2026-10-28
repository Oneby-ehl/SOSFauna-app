import SiteFooter from "@/components/web/SiteFooter";
import { getEffectiveCatalog } from "@/i18n/translate";
import { DEFAULT_LOCALE, type Locale } from "@/i18n/types";
import { getFaqSearchVocabulary } from "@/data/faqSearchVocabulary";
import { getFaqItemsForLocale, type FaqItem } from "@/data/faq";
import { getFaqCategoryId, getFaqCategoryLabel } from "@/data/faqCategories";
import { getFaqSearchEngine } from "@/utils/faqSearch";
import { getAnimalSearchEngine } from "@/data/animalSearchCatalog";
import {
  type AnimalCatalogSearchState,
  type AnimalSearchItem,
  getAnimalCatalogSearchState,
  getAnimalSearchTerms,
} from "@/data/animalSearchCatalog";
import { faqCategories, faqItems, swiftFaqPriorityIds } from "@/data/faq";
import {
  type AnimalType,
  createInitialFlags,
  getAdvicePartsForLocale,
} from "@/components/sos/SosAssistant";
import { Link, Stack, useRouter } from "expo-router";
import { useMemo, useRef, useState } from "react";
import {
  Pressable,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { SeoHead, useInformationPagePath } from "@/components/i18n/InformationPageSupport";
import { normalizeSearchText, searchFaqItems } from "@/utils/faqSearch";
import { useI18n } from "@/i18n/I18nProvider";

import { formatAdvice } from "@/utils/adviceComposition";
import { FaqStyles, FaqIcon, FaqAnswer, faqWebPart } from "./FaqPresentation";
import { interiorNavigationOptions } from "./TopicFaqHeader";

const swiftFaqPriority = new Map<string, number>(
  swiftFaqPriorityIds.map((itemId, index) => [itemId, index]),
);

const speciesOverviewCategoryOrder = [
  "beforeActing",
  "injuredOrTrapped",
  "youngAnimals",
  "handlingAndCare",
  "contactAndEmergencies",
  "swiftKnowledge",
  "application",
] as const;

function getSpeciesOverviewCategoryIndex(category: string) {
  const normalizedCategory = getFaqCategoryId(category as (typeof faqCategories)[number]);
  const categoryIndex = speciesOverviewCategoryOrder.findIndex(
    (orderedCategory) => orderedCategory === normalizedCategory,
  );

  return categoryIndex === -1
    ? speciesOverviewCategoryOrder.length
    : categoryIndex;
}

function prioritizeSwiftFaqItems(items: typeof faqItems) {
  return [...items].sort((firstItem, secondItem) => {
    const firstPriority = swiftFaqPriority.get(firstItem.id);
    const secondPriority = swiftFaqPriority.get(secondItem.id);

    if (firstPriority !== undefined && secondPriority !== undefined) {
      return firstPriority - secondPriority;
    }

    if (firstPriority !== undefined) return -1;
    if (secondPriority !== undefined) return 1;

    return 0;
  });
}

function prioritizeSelectedAnimalIntroItem(items: typeof faqItems) {
  return [...items].sort((firstItem, secondItem) => {
    if (firstItem.id === "que-hacer-si-encuentro-animal") return -1;
    if (secondItem.id === "que-hacer-si-encuentro-animal") return 1;

    return 0;
  });
}

// Intent vocabulary is selected per language without changing Spanish priorities.
const marineAnimalCategories = new Set<AnimalType>([
  "dolphin",
  "largeCetacean",
  "seal",
  "seaTurtle",
  "sharkRay",
  "otherMarine",
]);

function isGeneralSwiftQuery(query: string, locale: Locale = DEFAULT_LOCALE) {
  return getFaqSearchVocabulary(locale).generalSwiftQueries.has(normalizeSearchText(query));
}

function isMarineAnimal(animal: AnimalSearchItem | null) {
  return Boolean(
    animal && marineAnimalCategories.has(animal.category as AnimalType),
  );
}

function getMarineAnimalFaqAnswer(animal: AnimalSearchItem, locale: Locale = DEFAULT_LOCALE) {
  const texts = getEffectiveCatalog(locale);
  const isFeminine = animal.grammaticalGender === "feminine";
  const marineFaqAnimalName =
    animal.faqDisplayNameWithArticle ?? animal.displayNameWithArticle;
  const usesMixedPluralAgreement = animal.category === "sharkRay";
  const injured = usesMixedPluralAgreement
    ? texts.dynamicFaqGrammar.injuredPlural
    : isFeminine
      ? texts.dynamicFaqGrammar.injuredFemale
      : texts.dynamicFaqGrammar.injuredMale;
  const stranded = usesMixedPluralAgreement
    ? texts.dynamicFaqGrammar.strandedPlural
    : isFeminine
      ? texts.dynamicFaqGrammar.strandedFemale
      : texts.dynamicFaqGrammar.strandedMale;
  const entangled = usesMixedPluralAgreement
    ? texts.dynamicFaqGrammar.entangledPlural
    : isFeminine
      ? texts.dynamicFaqGrammar.entangledFemale
      : texts.dynamicFaqGrammar.entangledMale;
  const weak = usesMixedPluralAgreement ? texts.dynamicFaqGrammar.weakPlural : texts.dynamicFaqGrammar.weakSingular;

  if (animal.category === "seal") {
    return texts.dynamicFaqCopy.sealResting;
  }

  if (animal.category === "otherMarine") {
    return texts.dynamicFaqCopy.otherMarine;
  }

  return `${texts.dynamicFaqCopy.marinePrefix}${marineFaqAnimalName} ${injured}, ${stranded}, ${entangled}, ${weak}${texts.dynamicFaqCopy.marineSuffix}`;
}

function getSwiftAnimalFaqAnswer(locale: Locale = DEFAULT_LOCALE) {
  const texts = getEffectiveCatalog(locale);
  return (
    texts.rescueHeadings.smallBirdParagraph +
    texts.rescueHeadings.beforeInterveningLine +
    texts.rescueInstructions.swiftOnGroundParagraph +
    texts.rescueHeadings.doNotLine +
    texts.rescueInstructions.swiftNoFoodOrWaterLine +
    texts.rescueInstructions.doNotTestHealthMaleParagraph +
    texts.rescueHeadings.actionsLine +
    texts.rescueInstructions.swiftCollectWithMinimalHandlingLine +
    texts.rescueInstructions.swiftClosedVentilatedBoxLine +
    texts.rescueInstructions.swiftContactSpecialists
  );
}

function isBatFlightOrGroundQuery(
  query: string,
  selectedAnimal: AnimalSearchItem | null, locale: Locale = DEFAULT_LOCALE,
) {
  return (
    selectedAnimal?.id.startsWith("murcielago") &&
    getFaqSearchVocabulary(locale).batFlightOrGroundTerms.some((term) =>
      normalizeSearchText(query).includes(term),
    )
  );
}

function prioritizeBatIntroItem(items: typeof faqItems) {
  return [...items].sort((firstItem, secondItem) => {
    if (firstItem.id === "murcielago") return -1;
    if (secondItem.id === "murcielago") return 1;

    return 0;
  });
}

function isSelectedAnimalIntroQuery(
  query: string,
  selectedAnimal: AnimalSearchItem | null, locale: Locale = DEFAULT_LOCALE,
) {
  if (!selectedAnimal) return false;

  const normalizedQuery = normalizeSearchText(query);

  return (
    getAnimalSearchEngine(locale).getAnimalSearchTerms(selectedAnimal).some(
      (term) => normalizedQuery === term,
    ) ||
    getFaqSearchVocabulary(locale).selectedAnimalIntroTerms.some(term => normalizedQuery.includes(term))
  );
}

function isSelectedAnimalNameOnlyQuery(
  query: string,
  selectedAnimal: AnimalSearchItem | null, locale: Locale = DEFAULT_LOCALE,
) {
  if (!selectedAnimal) return false;

  const normalizedQuery = normalizeSearchText(query);

  return getAnimalSearchEngine(locale).getAnimalSearchTerms(selectedAnimal).some(
    (term) => normalizedQuery === term,
  );
}

const swiftRedundantGeneralFaqIds = new Set([
  "que-hacer-si-encuentro-cria",
  "pollo-o-volanton",
  "alejar-cria-padres",
  "hidratar-cria",
  "saber-si-necesita-ayuda",
  "animal-herido",
  "animal-atrapado",
  "no-puede-volar",
  "ave-no-puede-volar",
]);

const extraSwiftFaqIds = new Set([
  "lanzar-vencejo",
  "prueba-vuelo-vencejo",
  "agua-comida-vencejo",
  "caja-vencejo",
  "nidos-vencejo-obras",
]);

function isSwiftFaqItem(itemId: string) {
  return itemId.includes("vencejo") || extraSwiftFaqIds.has(itemId);
}

function getFaqSpeciesId(itemId: string) {
  if (isSwiftFaqItem(itemId)) return "vencejo";
  if (itemId.startsWith("murcielago")) return "murcielago";

  return null;
}

function filterFaqItemsBySelectedAnimal(
  items: typeof faqItems,
  selectedAnimal: AnimalSearchItem | null,
) {
  const selectedAnimalId = selectedAnimal?.id ?? null;

  return items.filter((item) => {
    const itemSpeciesId = getFaqSpeciesId(item.id);

    if (itemSpeciesId !== null && itemSpeciesId !== selectedAnimalId) {
      return false;
    }

    if (
      selectedAnimalId === "vencejo" &&
      swiftRedundantGeneralFaqIds.has(item.id)
    ) {
      return false;
    }

    return true;
  });
}

function getVisibleFaqCategories(selectedAnimal: AnimalSearchItem | null) {
  return faqCategories.filter(
    (category) =>
      getFaqCategoryId(category) !== "swiftKnowledge" || selectedAnimal?.id === "vencejo",
  );
}

const defaultFaqStructuredDataItems = filterFaqItemsBySelectedAnimal(
  faqItems,
  null,
);

const faqPageStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: defaultFaqStructuredDataItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

const emptyAnimalCatalogSearchState: AnimalCatalogSearchState = {
  textMatch: null,
  results: [],
};

export default function FaqPage() {
  const { t, locale } = useI18n();
  const pagePath = useInformationPagePath();
  const texts = getEffectiveCatalog(locale);
  const faqItems: FaqItem[] = getFaqItemsForLocale(locale);
  const { searchFaqItems } = getFaqSearchEngine(locale);
  const { getAnimalCatalogSearchState } = getAnimalSearchEngine(locale);
  const categoryLabel = (category: (typeof faqCategories)[number]) => getFaqCategoryLabel(getFaqCategoryId(category), locale);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [animalCatalogSearchState, setAnimalCatalogSearchState] =
    useState<AnimalCatalogSearchState>(emptyAnimalCatalogSearchState);
  const [selectedAnimal, setSelectedAnimal] =
    useState<AnimalSearchItem | null>(null);
  const [openItemId, setOpenItemId] = useState<string | null>(null);
  const [focusedCategory, setFocusedCategory] = useState<string | null>(null);
  const [stickyHeaderHeight, setStickyHeaderHeight] = useState(0);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const contentOffsetRef = useRef(0);
  const categoryOffsetsRef = useRef<Record<string, number>>({});
  const scrollViewRef = useRef<ScrollView>(null);
  const searchInputRef = useRef<TextInput>(null);

  const selectedAnimalAdvice = useMemo(() => {
    if (!selectedAnimal?.category) return null;

    if (isMarineAnimal(selectedAnimal)) {
      return getMarineAnimalFaqAnswer(selectedAnimal, locale);
    }

    if (selectedAnimal.id === "vencejo") {
      return getSwiftAnimalFaqAnswer(locale);
    }

    return formatAdvice(
      getAdvicePartsForLocale(
        locale,
        "alive",
        selectedAnimal.category as AnimalType,
        createInitialFlags(),
      ),
      false,
    ).trim();
  }, [selectedAnimal, locale, faqItems]);

  const displayedFaqItems = useMemo(() => {
    if (!selectedAnimal || !selectedAnimalAdvice) {
      return filterFaqItemsBySelectedAnimal(faqItems, selectedAnimal);
    }

    const animalSpecificItems = faqItems.map((item) => {
      if (item.id !== "que-hacer-si-encuentro-animal") return item;

      return {
        ...item,
        question: `${texts.dynamicFaqCopy.animalQuestionPrefix}${selectedAnimal.displayNameWithArticle}${texts.dynamicFaqCopy.animalQuestionSuffix}`,
        answer: selectedAnimalAdvice,
      };
    });

    return filterFaqItemsBySelectedAnimal(animalSpecificItems, selectedAnimal);
  }, [selectedAnimal, selectedAnimalAdvice, faqItems, locale]);

  const visibleFaqCategories = useMemo(
    () => getVisibleFaqCategories(selectedAnimal),
    [selectedAnimal],
  );

  const queryAnimal = animalCatalogSearchState.textMatch;
  const animalSearchResults = animalCatalogSearchState.results;

  const groupedItems = useMemo(
    () => {
      const searchSourceItems =
        queryAnimal?.id.startsWith("murcielago")
          ? filterFaqItemsBySelectedAnimal(displayedFaqItems, queryAnimal)
          : displayedFaqItems;
      const searchResults = searchFaqItems(searchSourceItems, searchQuery);
      const rankedResults = isSelectedAnimalIntroQuery(
        searchQuery,
        selectedAnimal, locale,
      )
        ? prioritizeSelectedAnimalIntroItem(searchResults)
        : isBatFlightOrGroundQuery(searchQuery, queryAnimal, locale)
          ? prioritizeBatIntroItem(searchResults)
        : selectedAnimal?.id === "vencejo" && isGeneralSwiftQuery(searchQuery, locale)
          ? prioritizeSwiftFaqItems(searchResults)
          : searchResults;
      const isSearching = searchQuery.trim().length > 0;
      const shouldUseEditorialCategoryOrder = isSelectedAnimalNameOnlyQuery(
        searchQuery,
        selectedAnimal, locale,
      );
      const visibleCategorySet = new Set(visibleFaqCategories.map(getFaqCategoryId));
      const groupsByCategory = new Map<
        string,
        {
          category: (typeof visibleFaqCategories)[number];
          items: typeof faqItems;
          firstRank: number;
        }
      >();

      rankedResults.forEach((item, index) => {
        if (!visibleCategorySet.has(getFaqCategoryId(item.category))) return;

        const existingGroup = groupsByCategory.get(getFaqCategoryId(item.category));

        if (existingGroup) {
          existingGroup.items.push(item);
          return;
        }

        groupsByCategory.set(getFaqCategoryId(item.category), {
          category: item.category,
          items: [item],
          firstRank: index,
        });
      });

      return Array.from(groupsByCategory.values()).sort(
        (firstGroup, secondGroup) => {
          if (shouldUseEditorialCategoryOrder) {
            return (
              getSpeciesOverviewCategoryIndex(firstGroup.category) -
              getSpeciesOverviewCategoryIndex(secondGroup.category)
            );
          }

          if (!isSearching) {
            return (
              visibleFaqCategories.indexOf(firstGroup.category) -
              visibleFaqCategories.indexOf(secondGroup.category)
            );
          }

          return firstGroup.firstRank - secondGroup.firstRank;
        },
      );
    },
    [
      displayedFaqItems,
      queryAnimal,
      searchQuery,
      selectedAnimal,
      visibleFaqCategories,
      locale,
      searchFaqItems,
    ],
  );

  const hasResults = groupedItems.length > 0;
  const shouldShowCategoryNavigation = searchQuery.trim().length === 0;

  const toggleItem = (itemId: string) => {
    setOpenItemId((current) => (current === itemId ? null : itemId));
  };

  const scrollToCategory = (category: string) => {
    const categoryAbsolutePosition =
      contentOffsetRef.current + (categoryOffsetsRef.current[getFaqCategoryId(category as (typeof faqCategories)[number])] ?? 0);
    const visualMargin = 18;

    scrollViewRef.current?.scrollTo({
      y: Math.max(
        0,
        categoryAbsolutePosition - stickyHeaderHeight - visualMargin,
      ),
      animated: true,
    });
  };

  const scheduleCategoryScroll = (category: string) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => scrollToCategory(category));
    });
  };

  const handleCategoryPress = (category: string) => {
    if (selectedAnimal || queryAnimal || searchQuery.trim().length > 0) {
      scheduleCategoryScroll(category);
      return;
    }

    setSearchQuery("");
    setAnimalCatalogSearchState(emptyAnimalCatalogSearchState);
    setSelectedAnimal(null);
    scheduleCategoryScroll(category);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setAnimalCatalogSearchState(emptyAnimalCatalogSearchState);
    setSelectedAnimal(null);
    setOpenItemId(null);
    requestAnimationFrame(() => searchInputRef.current?.focus());
  };

  const startNotice = () => {
    router.push({
      pathname: pagePath("guide"),
      params: {
        mode: "new",
        animalType: selectedAnimal?.category,
      },
    });
  };

  const selectAnimalSearchResult = (animal: AnimalSearchItem) => {
    const nextAnimalCatalogSearchState = getAnimalCatalogSearchState(
      animal.name,
    );

    setSelectedAnimal(animal);
    setSearchQuery(animal.name);
    setAnimalCatalogSearchState(nextAnimalCatalogSearchState);
    setOpenItemId("que-hacer-si-encuentro-animal");
  };

  const handleSearchQueryChange = (value: string) => {
    const nextAnimalCatalogSearchState = getAnimalCatalogSearchState(value);
    const animalMatch = nextAnimalCatalogSearchState.textMatch;

    setSearchQuery(value);
    setAnimalCatalogSearchState(nextAnimalCatalogSearchState);
    setSelectedAnimal(animalMatch);
    setOpenItemId(animalMatch ? "que-hacer-si-encuentro-animal" : null);
  };

  const renderCreateNoticePrompt = () => (
    <View {...faqWebPart("createNoticeBox")} style={styles.createNoticeBox}>
      <Text {...faqWebPart("createNoticeTitle")} style={styles.createNoticeTitle}>
        {t("faqUi", "caseDoubtTitle")}
      </Text>
      <Text {...faqWebPart("createNoticeText")} style={styles.createNoticeText}>
        {t("faqUi", "caseDoubtText")}
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t("navigation", "guide")}
        {...faqWebPart("createNoticeButton")} style={styles.createNoticeButton}
        onPress={startNotice}
      >
        <Text {...faqWebPart("createNoticeButtonText")} style={styles.createNoticeButtonText}>{t("navigation", "guide")}</Text>
      </Pressable>
    </View>
  );

  const renderRecoveryCentersPrompt = () => (
    <View {...faqWebPart("recoveryCentersBox")} style={styles.recoveryCentersBox}>
      <Text {...faqWebPart("recoveryCentersTitle")} style={styles.recoveryCentersTitle}>
        {t("faqUi", "centersPromptTitle")}
      </Text>
      <Text {...faqWebPart("recoveryCentersText")} style={styles.recoveryCentersText}>
        {t("faqUi", "centersPromptText")}
      </Text>
      <Link href={pagePath("centers")} asChild>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t("navigation", "centers")}
          {...faqWebPart("recoveryCentersButton")} style={styles.recoveryCentersButton}
        >
          <Text {...faqWebPart("recoveryCentersButtonText")} style={styles.recoveryCentersButtonText}>
            {t("navigation", "centers")}
          </Text>
        </Pressable>
      </Link>
    </View>
  );

  return (
    <>
      <SeoHead
        title="Preguntas frecuentes sobre fauna silvestre | SOS Fauna España"
        description="Respuestas sobre qué hacer ante fauna silvestre herida, atrapada o varada, incluidas aves, mamíferos, reptiles, anfibios y fauna marina."
        path="/faq"
        structuredData={locale === "en" ? {
          ...faqPageStructuredData,
          mainEntity: filterFaqItemsBySelectedAnimal(faqItems, null).map(item => ({
            "@type": "Question", name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer },
          })),
        } : faqPageStructuredData}
      />
      <Stack.Screen
        options={{
          ...interiorNavigationOptions,
          title: locale === "en" ? `${t("navigation", "faq")} | SOS Fauna España` : "Preguntas frecuentes sobre fauna silvestre | SOS Fauna España",
        }}
      />

      <FaqStyles />
      <ScrollView
        ref={scrollViewRef}
        {...faqWebPart("screen")} style={styles.screen}
        contentContainerStyle={[
          styles.container,
          {
            paddingBottom: Math.max(
              160,
              scrollViewHeight - stickyHeaderHeight + 80,
            ),
          },
        ]}
        keyboardShouldPersistTaps="handled"
        onLayout={(event) => setScrollViewHeight(event.nativeEvent.layout.height)}
        stickyHeaderIndices={[1]}
      >
        <View {...faqWebPart("header")} style={styles.header}>
          <Text {...faqWebPart("eyebrow")} style={styles.eyebrow}>{t("common", "brandEyebrow")}</Text>
          <Text accessibilityRole="header" aria-level={1} {...faqWebPart("title")} style={styles.title}>{t("navigation", "faq")}</Text>
          <Text {...faqWebPart("intro")} style={styles.intro}>
            {t("faqUi", "intro")}
          </Text>
        </View>

        <View
          {...faqWebPart("searchSection")} style={styles.searchSection}
          onLayout={(event) =>
            setStickyHeaderHeight(event.nativeEvent.layout.height)
          }
        >
          <View {...faqWebPart("searchInputWrap")} style={styles.searchInputWrap}>
          <FaqIcon kind="search" />
          <TextInput
            ref={searchInputRef}
            accessibilityLabel={t("faqUi", "searchLabel")}
            placeholder={t("faqUi", "searchPlaceholder")}
            value={searchQuery}
            onChangeText={handleSearchQueryChange}
            {...faqWebPart("searchInput")}
            style={[
              styles.searchInput,
              searchQuery.length > 0 && styles.searchInputWithClear,
            ]}
            returnKeyType="search"
          />
            {searchQuery.length > 0 ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t("faqUi", "clearSearch")}
                hitSlop={8}
                {...faqWebPart("clearSearchButton")} style={styles.clearSearchButton}
                onPress={clearSearch}
              >
                {Platform.OS === "web" ? <FaqIcon kind="clear" /> : <Text {...faqWebPart("clearSearchButtonText")} style={styles.clearSearchButtonText}>✕</Text>}
              </Pressable>
            ) : null}
          </View>

          {animalSearchResults.length > 0 ? (
            <View {...faqWebPart("categoryList")} style={styles.categoryList}>
              {animalSearchResults.map((animal) => (
                <Pressable
                  key={animal.id}
                  accessibilityRole="button"
                  accessibilityLabel={`${t("faqUi", "selectPrefix")}${animal.name}`}
                  onPress={() => selectAnimalSearchResult(animal)}
                  {...faqWebPart("categoryPill")}
                  style={({ pressed }) => [
                    styles.categoryPill,
                    pressed && styles.categoryPillPressed,
                  ]}
                >
                  <Text {...faqWebPart("categoryPillText")} style={styles.categoryPillText}>{animal.name}</Text>
                </Pressable>
              ))}
            </View>
          ) : null}

          {shouldShowCategoryNavigation ? (
            <View {...faqWebPart("categoryList")} style={styles.categoryList}>
              {visibleFaqCategories.map((category) => (
                <Pressable
                  key={getFaqCategoryId(category)}
                  accessibilityRole="button"
                  accessibilityLabel={`${t("faqUi", "categoryPrefix")}${categoryLabel(category)}`}
                  onPress={() => handleCategoryPress(category)}
                  onFocus={() => setFocusedCategory(getFaqCategoryId(category as (typeof faqCategories)[number]))}
                  onBlur={() => setFocusedCategory(null)}
                  {...faqWebPart("categoryPill", focusedCategory === getFaqCategoryId(category))}
                  style={({ pressed }) => [
                    styles.categoryPill,
                    pressed && styles.categoryPillPressed,
                    focusedCategory === getFaqCategoryId(category) && styles.categoryPillFocused,
                  ]}
                >
                  <Text {...faqWebPart("categoryPillText")} style={styles.categoryPillText}>{categoryLabel(category)}</Text>
                </Pressable>
              ))}
            </View>
          ) : null}
        </View>

        {hasResults ? (
          <View
            {...faqWebPart("content")} style={styles.content}
            onLayout={(event) => {
              contentOffsetRef.current = event.nativeEvent.layout.y;
            }}
          >
            {groupedItems.map((group) => (
              <View
                key={getFaqCategoryId(group.category)}
                {...faqWebPart("categorySection")} style={styles.categorySection}
                onLayout={(event) => {
                  categoryOffsetsRef.current[getFaqCategoryId(group.category)] =
                    event.nativeEvent.layout.y;
                }}
              >
                <Text accessibilityRole="header" aria-level={2} {...faqWebPart("categoryTitle")} style={styles.categoryTitle}>{categoryLabel(group.category)}</Text>

                <View {...faqWebPart("questionList")} style={styles.questionList}>
                  {group.items.map((item) => {
                    const isOpen = openItemId === item.id;
                    const shouldRenderAnswer = isOpen || Platform.OS === "web";

                    return (
                      <View key={item.id} {...faqWebPart("faqCard")} style={styles.faqCard}>
                        <Pressable
                          accessibilityRole="button"
                          accessibilityLabel={`${isOpen ? t("faqUi", "closeQuestion") : t("faqUi", "openQuestion")}${t("faqUi", "questionLabelSeparator")}${item.question}`}
                          accessibilityState={{ expanded: isOpen }}
                          onPress={() => toggleItem(item.id)}
                          {...faqWebPart("questionButton")} style={styles.questionButton}
                        >
                          <Text accessibilityRole="header" aria-level={3} {...faqWebPart("questionText")} style={styles.questionText}>
                            {item.question}
                          </Text>
                          {Platform.OS === "web" ? <FaqIcon kind="expand" expanded={isOpen} /> : <Text {...faqWebPart("questionIndicator")} style={styles.questionIndicator}>
                            {isOpen ? "−" : "+"}
                          </Text>}
                        </Pressable>

                        {shouldRenderAnswer ? (
                          <View
                            accessibilityElementsHidden={!isOpen}
                            importantForAccessibility={
                              isOpen ? "auto" : "no-hide-descendants"
                            }
                            {...faqWebPart("answerContent")}
                            style={[
                              styles.answerContent,
                              !isOpen && styles.hiddenAnswerContent,
                            ]}
                          >
                            {Platform.OS === "web" ? <FaqAnswer text={item.answer} /> : <Text style={styles.answerText}>{item.answer}</Text>}
                            {item.showCreateNotice
                              ? renderCreateNoticePrompt()
                              : null}
                            {item.showRecoveryCenters
                              ? renderRecoveryCentersPrompt()
                              : null}
                          </View>
                        ) : null}
                      </View>
                    );
                  })}
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View {...faqWebPart("emptyState")} style={styles.emptyState}>
            <Text {...faqWebPart("emptyText")} style={styles.emptyText}>
              {t("faqUi", "noResults")}
            </Text>
          </View>
        )}

        {Platform.OS !== "web" ? <View {...faqWebPart("specializedSection")} style={styles.specializedSection}>
          <Text accessibilityRole="header" aria-level={2} {...faqWebPart("specializedTitle")} style={styles.specializedTitle}>
            {t("faqUi", "specializedTitle")}
          </Text>
          <View {...faqWebPart("specializedLinks")} style={styles.specializedLinks}>
            <Link href={pagePath("swifts")} {...faqWebPart("specializedLink")} style={styles.specializedLink}>
              {t("faqUi", "swiftsLinkLabel")}
            </Link>
            <Link href={pagePath("bats")} {...faqWebPart("specializedLink")} style={styles.specializedLink}>
              {t("faqUi", "batsLinkLabel")}
            </Link>
          </View>
        </View> : null}

        {Platform.OS !== "web" ? <Link href={pagePath("home")} asChild>
          <Pressable {...faqWebPart("backButton")} style={styles.backButton}>
            <Text {...faqWebPart("backButtonText")} style={styles.backButtonText}>{t("navigation", "backToBrand")}</Text>
          </Pressable>
        </Link> : null}
        <SiteFooter />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f3f7f4",
  },
  container: {
    width: "100%",
    maxWidth: 960,
    alignSelf: "center",
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 64,
    gap: 28,
  },
  header: {
    gap: 12,
  },
  eyebrow: {
    color: "#166534",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  title: {
    color: "#14532d",
    fontSize: 38,
    lineHeight: 44,
    fontWeight: "900",
  },
  intro: {
    maxWidth: 760,
    color: "#4b5563",
    fontSize: 17,
    lineHeight: 27,
  },
  searchSection: {
    gap: 14,
    marginHorizontal: -24,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 14,
    backgroundColor: "#f3f7f4",
    borderBottomWidth: 1,
    borderBottomColor: "#dbe7dd",
    zIndex: 10,
  },
  searchInputWrap: {
    position: "relative",
  },
  searchInput: {
    minHeight: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#b7dfc0",
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: "#111827",
    fontSize: 16,
  },
  searchInputWithClear: {
    paddingRight: 52,
  },
  clearSearchButton: {
    position: "absolute",
    right: 10,
    top: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eef8f0",
  },
  clearSearchButtonText: {
    color: "#166534",
    fontSize: 16,
    fontWeight: "900",
    lineHeight: 20,
  },
  categoryList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryPill: {
    backgroundColor: "#e7f5ea",
    borderWidth: 1,
    borderColor: "#cfe8d4",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  categoryPillPressed: {
    backgroundColor: "#dcfce7",
    borderColor: "#86c894",
  },
  categoryPillFocused: {
    borderColor: "#166534",
  },
  categoryPillText: {
    color: "#166534",
    fontSize: 13,
    fontWeight: "800",
  },
  content: {
    gap: 24,
  },
  categorySection: {
    gap: 12,
  },
  categoryTitle: {
    color: "#111827",
    fontSize: 22,
    fontWeight: "900",
    lineHeight: 28,
  },
  questionList: {
    gap: 10,
  },
  faqCard: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#dbe7dd",
    borderRadius: 16,
    overflow: "hidden",
  },
  questionButton: {
    minHeight: 58,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  questionText: {
    flex: 1,
    color: "#14532d",
    fontSize: 17,
    fontWeight: "800",
    lineHeight: 24,
  },
  questionIndicator: {
    width: 28,
    color: "#166534",
    fontSize: 24,
    fontWeight: "900",
    lineHeight: 28,
    textAlign: "center",
  },
  answerContent: {
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    gap: 14,
    color: "#374151",
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  hiddenAnswerContent: {
    display: "none",
  },
  answerText: {
    color: "#374151",
    fontSize: 16,
    lineHeight: 25,
  },
  createNoticeBox: {
    backgroundColor: "#eef8f0",
    borderWidth: 1,
    borderColor: "#b7dfc0",
    borderRadius: 14,
    padding: 14,
    gap: 8,
  },
  createNoticeTitle: {
    color: "#14532d",
    fontSize: 15,
    fontWeight: "900",
    lineHeight: 21,
  },
  createNoticeText: {
    color: "#374151",
    fontSize: 14,
    lineHeight: 21,
  },
  createNoticeButton: {
    alignSelf: "flex-start",
    minHeight: 42,
    marginTop: 2,
    backgroundColor: "#14532d",
    borderRadius: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  createNoticeButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "900",
  },
  recoveryCentersBox: {
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 14,
    padding: 14,
    gap: 8,
  },
  recoveryCentersTitle: {
    color: "#14532d",
    fontSize: 15,
    fontWeight: "900",
    lineHeight: 21,
  },
  recoveryCentersText: {
    color: "#374151",
    fontSize: 14,
    lineHeight: 21,
  },
  recoveryCentersButton: {
    alignSelf: "flex-start",
    minHeight: 42,
    marginTop: 2,
    backgroundColor: "#14532d",
    borderRadius: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  recoveryCentersButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "900",
  },
  emptyState: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#dbe7dd",
    borderRadius: 16,
    padding: 20,
  },
  emptyText: {
    color: "#4b5563",
    fontSize: 16,
    lineHeight: 25,
  },
  specializedSection: {
    borderTopWidth: 1,
    borderTopColor: "#dbe7dd",
    paddingTop: 18,
    gap: 10,
  },
  specializedTitle: {
    color: "#4b5563",
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 22,
  },
  specializedLinks: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
    gap: 10,
  },
  specializedLink: {
    alignSelf: "flex-start",
    flexShrink: 1,
    maxWidth: "100%",
    minHeight: 44,
    backgroundColor: "#e7f5ea",
    borderWidth: 1,
    borderColor: "#cfe8d4",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: "#166534",
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 22,
    textAlign: "center",
    textDecorationLine: "none",
  },
  backButton: {
    alignSelf: "flex-start",
    backgroundColor: "#14532d",
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "800",
  },
});
