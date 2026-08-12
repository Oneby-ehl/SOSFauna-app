import {
  type AnimalCatalogSearchState,
  type AnimalSearchItem,
  getAnimalCatalogSearchState,
  getAnimalSearchTerms,
} from "@/data/animalSearchCatalog";
import { faqCategories, faqItems, swiftFaqPriorityIds } from "@/data/faq";
import {
  type AnimalType,
  COMMON_END,
  createInitialFlags,
  getAdvice,
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

import { SeoHead } from "@/components/seo/SeoHead";
import { normalizeSearchText, searchFaqItems } from "@/utils/faqSearch";

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function removeAssistantNextStepParagraph(advice: string) {
  return advice
    .replace(new RegExp(`\\n*${escapeRegExp(COMMON_END)}$`), "")
    .trim();
}

const swiftFaqPriority = new Map<string, number>(
  swiftFaqPriorityIds.map((itemId, index) => [itemId, index]),
);

const speciesOverviewCategoryOrder = [
  "Antes de actuar",
  "Animales heridos o atrapados",
  "Crías y animales jóvenes",
  "Manipulación y cuidados",
  "Contacto y emergencias",
  "Conocer al vencejo",
  "La aplicación",
] as const;

function getSpeciesOverviewCategoryIndex(category: string) {
  const normalizedCategory = normalizeSearchText(category);
  const categoryIndex = speciesOverviewCategoryOrder.findIndex(
    (orderedCategory) => normalizeSearchText(orderedCategory) === normalizedCategory,
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

const GENERAL_SWIFT_QUERIES = new Set(["vencejo", "vencejos", "apus apus"]);
const BAT_FLIGHT_OR_GROUND_TERMS = [
  "no vuela",
  "no puede volar",
  "que no vuela",
  "en el suelo",
  "suelo",
];

function isGeneralSwiftQuery(query: string) {
  return GENERAL_SWIFT_QUERIES.has(normalizeSearchText(query));
}

function isBatFlightOrGroundQuery(
  query: string,
  selectedAnimal: AnimalSearchItem | null,
) {
  return (
    selectedAnimal?.id.startsWith("murcielago") &&
    BAT_FLIGHT_OR_GROUND_TERMS.some((term) =>
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
  selectedAnimal: AnimalSearchItem | null,
) {
  if (!selectedAnimal) return false;

  const normalizedQuery = normalizeSearchText(query);

  return (
    getAnimalSearchTerms(selectedAnimal).some(
      (term) => normalizedQuery === term,
    ) ||
    normalizedQuery.includes("encontr") ||
    normalizedQuery.includes("que hago") ||
    normalizedQuery.includes("qué hago")
  );
}

function isSelectedAnimalNameOnlyQuery(
  query: string,
  selectedAnimal: AnimalSearchItem | null,
) {
  if (!selectedAnimal) return false;

  const normalizedQuery = normalizeSearchText(query);

  return getAnimalSearchTerms(selectedAnimal).some(
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
      category !== "Conocer al vencejo" || selectedAnimal?.id === "vencejo",
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

    return removeAssistantNextStepParagraph(
      getAdvice(
        "alive",
        selectedAnimal.category as AnimalType,
        createInitialFlags(),
      ),
    );
  }, [selectedAnimal]);

  const displayedFaqItems = useMemo(() => {
    if (!selectedAnimal || !selectedAnimalAdvice) {
      return filterFaqItemsBySelectedAnimal(faqItems, selectedAnimal);
    }

    const animalSpecificItems = faqItems.map((item) => {
      if (item.id !== "que-hacer-si-encuentro-animal") return item;

      return {
        ...item,
        question: `¿Qué debo hacer si encuentro ${selectedAnimal.displayNameWithArticle}?`,
        answer: selectedAnimalAdvice,
      };
    });

    return filterFaqItemsBySelectedAnimal(animalSpecificItems, selectedAnimal);
  }, [selectedAnimal, selectedAnimalAdvice]);

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
        selectedAnimal,
      )
        ? prioritizeSelectedAnimalIntroItem(searchResults)
        : isBatFlightOrGroundQuery(searchQuery, queryAnimal)
          ? prioritizeBatIntroItem(searchResults)
        : selectedAnimal?.id === "vencejo" && isGeneralSwiftQuery(searchQuery)
          ? prioritizeSwiftFaqItems(searchResults)
          : searchResults;
      const isSearching = searchQuery.trim().length > 0;
      const shouldUseEditorialCategoryOrder = isSelectedAnimalNameOnlyQuery(
        searchQuery,
        selectedAnimal,
      );
      const visibleCategorySet = new Set(visibleFaqCategories);
      const groupsByCategory = new Map<
        string,
        {
          category: (typeof visibleFaqCategories)[number];
          items: typeof faqItems;
          firstRank: number;
        }
      >();

      rankedResults.forEach((item, index) => {
        if (!visibleCategorySet.has(item.category)) return;

        const existingGroup = groupsByCategory.get(item.category);

        if (existingGroup) {
          existingGroup.items.push(item);
          return;
        }

        groupsByCategory.set(item.category, {
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
    ],
  );

  const hasResults = groupedItems.length > 0;

  const toggleItem = (itemId: string) => {
    setOpenItemId((current) => (current === itemId ? null : itemId));
  };

  const scrollToCategory = (category: string) => {
    const categoryAbsolutePosition =
      contentOffsetRef.current + (categoryOffsetsRef.current[category] ?? 0);
    const visualMargin = 18;

    scrollViewRef.current?.scrollTo({
      y: Math.max(
        0,
        categoryAbsolutePosition - stickyHeaderHeight - visualMargin,
      ),
      animated: true,
    });
  };

  const handleCategoryPress = (category: string) => {
    setSearchQuery("");
    setAnimalCatalogSearchState(emptyAnimalCatalogSearchState);
    setSelectedAnimal(null);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => scrollToCategory(category));
    });
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
      pathname: "/aviso",
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
    <View style={styles.createNoticeBox}>
      <Text style={styles.createNoticeTitle}>
        ¿Tienes dudas sobre este caso?
      </Text>
      <Text style={styles.createNoticeText}>
        Crea un aviso en SOS Fauna España y el asistente te ayudará a valorar
        la situación paso a paso.
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Comenzar aviso"
        style={styles.createNoticeButton}
        onPress={startNotice}
      >
        <Text style={styles.createNoticeButtonText}>Comenzar aviso</Text>
      </Pressable>
    </View>
  );

  const renderRecoveryCentersPrompt = () => (
    <View style={styles.recoveryCentersBox}>
      <Text style={styles.recoveryCentersTitle}>
        ¿Necesitas localizar un centro?
      </Text>
      <Text style={styles.recoveryCentersText}>
        Consulta los centros de recuperación y teléfonos de ayuda disponibles en
        tu provincia.
      </Text>
      <Link href="/centros" asChild>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Centros de Recuperación y teléfonos de ayuda"
          style={styles.recoveryCentersButton}
        >
          <Text style={styles.recoveryCentersButtonText}>
            Centros de Recuperación y teléfonos de ayuda
          </Text>
        </Pressable>
      </Link>
    </View>
  );

  return (
    <>
      <SeoHead
        title="Preguntas frecuentes | SOS Fauna España"
        description="Respuestas a las preguntas más habituales sobre cómo actuar ante fauna silvestre y sobre el funcionamiento de SOS Fauna España."
        path="/faq"
        structuredData={faqPageStructuredData}
      />
      <Stack.Screen
        options={{ title: "Preguntas frecuentes | SOS Fauna España" }}
      />

      <ScrollView
        ref={scrollViewRef}
        style={styles.screen}
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
        <View style={styles.header}>
          <Text style={styles.eyebrow}>SOS FAUNA ESPAÑA</Text>
          <Text style={styles.title}>Preguntas frecuentes</Text>
          <Text style={styles.intro}>
            ¿Tienes alguna duda? Aquí encontrarás respuestas a las preguntas más
            habituales sobre la ayuda responsable a la fauna silvestre y el
            funcionamiento de SOS Fauna España.
          </Text>
        </View>

        <View
          style={styles.searchSection}
          onLayout={(event) =>
            setStickyHeaderHeight(event.nativeEvent.layout.height)
          }
        >
          <View style={styles.searchInputWrap}>
          <TextInput
            ref={searchInputRef}
            accessibilityLabel="Buscar una pregunta frecuente"
            placeholder="Buscar una pregunta…"
            value={searchQuery}
            onChangeText={handleSearchQueryChange}
            style={[
              styles.searchInput,
              searchQuery.length > 0 && styles.searchInputWithClear,
            ]}
            returnKeyType="search"
          />
            {searchQuery.length > 0 ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Limpiar búsqueda"
                hitSlop={8}
                style={styles.clearSearchButton}
                onPress={clearSearch}
              >
                <Text style={styles.clearSearchButtonText}>✕</Text>
              </Pressable>
            ) : null}
          </View>

          {animalSearchResults.length > 0 ? (
            <View style={styles.categoryList}>
              {animalSearchResults.map((animal) => (
                <Pressable
                  key={animal.id}
                  accessibilityRole="button"
                  accessibilityLabel={`Seleccionar ${animal.name}`}
                  onPress={() => selectAnimalSearchResult(animal)}
                  style={({ pressed }) => [
                    styles.categoryPill,
                    pressed && styles.categoryPillPressed,
                  ]}
                >
                  <Text style={styles.categoryPillText}>{animal.name}</Text>
                </Pressable>
              ))}
            </View>
          ) : null}

          <View style={styles.categoryList}>
            {visibleFaqCategories.map((category) => (
              <Pressable
                key={category}
                accessibilityRole="button"
                accessibilityLabel={`Ir a la categoría ${category}`}
                onPress={() => handleCategoryPress(category)}
                onFocus={() => setFocusedCategory(category)}
                onBlur={() => setFocusedCategory(null)}
                style={({ pressed }) => [
                  styles.categoryPill,
                  pressed && styles.categoryPillPressed,
                  focusedCategory === category && styles.categoryPillFocused,
                ]}
              >
                <Text style={styles.categoryPillText}>{category}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {hasResults ? (
          <View
            style={styles.content}
            onLayout={(event) => {
              contentOffsetRef.current = event.nativeEvent.layout.y;
            }}
          >
            {groupedItems.map((group) => (
              <View
                key={group.category}
                style={styles.categorySection}
                onLayout={(event) => {
                  categoryOffsetsRef.current[group.category] =
                    event.nativeEvent.layout.y;
                }}
              >
                <Text style={styles.categoryTitle}>{group.category}</Text>

                <View style={styles.questionList}>
                  {group.items.map((item) => {
                    const isOpen = openItemId === item.id;
                    const shouldRenderAnswer = isOpen || Platform.OS === "web";

                    return (
                      <View key={item.id} style={styles.faqCard}>
                        <Pressable
                          accessibilityRole="button"
                          accessibilityLabel={`${isOpen ? "Cerrar" : "Abrir"} pregunta: ${item.question}`}
                          accessibilityState={{ expanded: isOpen }}
                          onPress={() => toggleItem(item.id)}
                          style={styles.questionButton}
                        >
                          <Text style={styles.questionText}>
                            {item.question}
                          </Text>
                          <Text style={styles.questionIndicator}>
                            {isOpen ? "−" : "+"}
                          </Text>
                        </Pressable>

                        {shouldRenderAnswer ? (
                          <View
                            accessibilityElementsHidden={!isOpen}
                            importantForAccessibility={
                              isOpen ? "auto" : "no-hide-descendants"
                            }
                            style={[
                              styles.answerContent,
                              !isOpen && styles.hiddenAnswerContent,
                            ]}
                          >
                            <Text style={styles.answerText}>{item.answer}</Text>
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
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              No hemos encontrado preguntas que coincidan con tu búsqueda.
            </Text>
          </View>
        )}

        <Link href="/" asChild>
          <Pressable style={styles.backButton}>
            <Text style={styles.backButtonText}>Volver al inicio</Text>
          </Pressable>
        </Link>
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
