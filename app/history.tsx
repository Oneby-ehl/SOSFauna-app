import { getEffectiveCatalog } from "@/i18n/translate";
import { useI18n } from "@/i18n/I18nProvider";
import type { Locale } from "@/i18n/types";
import { getLocalizedPath, resolveRouteLocale } from "@/i18n/routes";
import { HeaderBackButton } from "@react-navigation/elements";
import { readStoredLocationText } from "@/utils/rescueLocation";
import { Stack, useFocusEffect, useNavigation, useRouter } from "expo-router";
import * as Clipboard from "expo-clipboard";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  clearHistory,
  deleteHistoryItem,
  getHistoryReadResult,
} from "@/services/rescueStorage";
import { NoIndexHead } from "@/components/seo/SeoHead";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { buildRescueShareMessage } from "@/utils/rescueShareMessage";
import type {
  RescueAnimalState,
  RescueAnimalEnvironment,
  RescueAnimalPlace,
  RescueAnimalPosition,
  RescueAnimalType,
  RescueCase,
  RescueFlags,
} from "@/types/rescueCase";

function createHistoryPresentation(locale: Locale) {
  const generalTexts = getEffectiveCatalog(locale);

  const ANIMAL_TYPE_LABELS: Record<RescueAnimalType, string> = {
    smallBird: generalTexts.historyAnimalLabels.smallBird,
    largeBird: generalTexts.historyAnimalLabels.largeBird,
    bat: generalTexts.historyAnimalLabels.bat,
    smallMammal: generalTexts.historyAnimalLabels.smallMammal,
    largeMammal: generalTexts.historyAnimalLabels.largeMammal,
    reptileAmphibian: generalTexts.historyAnimalLabels.reptileAmphibian,
    dolphin: generalTexts.historyAnimalLabels.dolphin,
    largeCetacean: generalTexts.historyAnimalLabels.largeCetacean,
    seal: generalTexts.historyAnimalLabels.seal,
    seaTurtle: generalTexts.historyAnimalLabels.seaTurtle,
    sharkRay: generalTexts.historyAnimalLabels.sharkRay,
    otherMarine: generalTexts.historyAnimalLabels.otherMarine,
    unknown: generalTexts.historyAnimalLabels.unknown,
  };

  const ANIMAL_STATE_LABELS: Record<RescueAnimalState, string> = {
    alive: generalTexts.historyStateLabels.alive,
    dead: generalTexts.historyStateLabels.dead,
  };

  const ANIMAL_PLACE_LABELS: Record<RescueAnimalPlace, string> = {
    ground: generalTexts.historyPlaceLabels.ground,
    treeOrBush: generalTexts.historyPlaceLabels.treeOrBush,
    buildingOrRoof: generalTexts.historyPlaceLabels.buildingOrRoof,
    roadOrStreet: generalTexts.historyPlaceLabels.roadOrStreet,
    parkOrGarden: generalTexts.historyPlaceLabels.parkOrGarden,
    fieldOrNatural: generalTexts.historyPlaceLabels.fieldOrNatural,
    industrialArea: generalTexts.historyPlaceLabels.industrialArea,
    water: generalTexts.historyPlaceLabels.water,
    otherPlace: generalTexts.historyPlaceLabels.otherPlace,
  };

  const ANIMAL_POSITION_LABELS: Record<RescueAnimalPosition, string> = {
    ground: generalTexts.historyPositionLabels.ground,
    treeOrBush: generalTexts.historyPositionLabels.treeOrBush,
    buildingOrRoof: generalTexts.historyPositionLabels.buildingOrRoof,
    water: generalTexts.historyPositionLabels.water,
    beachSand: generalTexts.historyPositionLabels.beachSand,
    shoreShallowWater: generalTexts.historyPositionLabels.shoreShallowWater,
    rocksBreakwater: generalTexts.historyPositionLabels.rocksBreakwater,
    portDock: generalTexts.historyPositionLabels.portDock,
    onBoat: generalTexts.historyPositionLabels.onBoat,
    otherPlace: generalTexts.historyPositionLabels.otherPlace,
  };

  const ANIMAL_ENVIRONMENT_LABELS: Record<RescueAnimalEnvironment, string> = {
    roadOrStreet: generalTexts.historyEnvironmentLabels.roadOrStreet,
    parkOrGarden: generalTexts.historyEnvironmentLabels.parkOrGarden,
    fieldOrNatural: generalTexts.historyEnvironmentLabels.fieldOrNatural,
    industrialArea: generalTexts.historyEnvironmentLabels.industrialArea,
    urbanArea: generalTexts.historyEnvironmentLabels.urbanArea,
    coastBeach: generalTexts.historyEnvironmentLabels.coastBeach,
    rockyCoastCliff: generalTexts.historyEnvironmentLabels.rockyCoastCliff,
    portMarina: generalTexts.historyEnvironmentLabels.portMarina,
    openSea: generalTexts.historyEnvironmentLabels.openSea,
    estuaryMouth: generalTexts.historyEnvironmentLabels.estuaryMouth,
    otherEnvironment: generalTexts.historyEnvironmentLabels.otherEnvironment,
  };

  const ANIMAL_STATE_ICONS: Record<RescueAnimalState, string> = {
    alive: "🟢",
    dead: "⚫",
  };

  const FLAG_LABELS: {
    key: keyof RescueFlags;
    label: string;
  }[] = [
    { key: "bleeding", label: generalTexts.historyFlagLabels.bleeding },
    { key: "baby", label: generalTexts.historyFlagLabels.baby },
    { key: "catDog", label: generalTexts.historyFlagLabels.catDog },
    { key: "canNotMove", label: generalTexts.historyFlagLabels.canNotMove },
    { key: "roadRisk", label: generalTexts.historyFlagLabels.roadRisk },
    { key: "ringGps", label: generalTexts.historyFlagLabels.ringGps },
    { key: "trapped", label: generalTexts.historyFlagLabels.trapped },
    { key: "cannotFly", label: generalTexts.historyFlagLabels.cannotFly },
    { key: "weakness", label: generalTexts.historyFlagLabels.weakness },
    { key: "normalAppearance", label: generalTexts.historyFlagLabels.normalAppearance },
    { key: "breathing", label: generalTexts.historyFlagLabels.breathing },
    { key: "stranded", label: generalTexts.historyFlagLabels.stranded },
    { key: "fishingLineHook", label: generalTexts.historyFlagLabels.fishingLineHook },
    { key: "moreAnimals", label: generalTexts.historyFlagLabels.moreAnimals },
    { key: "peopleDogsNearby", label: generalTexts.historyFlagLabels.peopleDogsNearby },
    { key: "restingOnLand", label: generalTexts.historyFlagLabels.restingOnLand },
    { key: "other", label: generalTexts.historyFlagLabels.other },
  ];

  function formatDate(value: string | null): string {
    if (!value) return generalTexts.summaryHistory.dateUnavailable;

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return generalTexts.summaryHistory.dateUnavailable;
    }

    return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "es-ES", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  }

  function getActiveFlagLabels(flags: RescueFlags): string[] {
    return FLAG_LABELS.filter(({ key }) => flags[key]).map(
      ({ label }) => label,
    );
  }

  function formatObservedSituation(flagLabels: string[]): string {
    return flagLabels.length > 0
      ? `${flagLabels.join(". ")}.`
      : generalTexts.summaryHistory.noIncidents;
  }

  function normalizeUsefulText(value: string | null | undefined): string | undefined {
    const normalized = value?.trim();
    return normalized && normalized.length > 0 ? normalized : undefined;
  }

  function formatCoordinates(coords: NonNullable<RescueCase["coords"]>): string {
    return `${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)}`;
  }

  function getAnimalPlaceLabel(rescueCase: RescueCase): string | null {
    return rescueCase.animalPlace
      ? ANIMAL_PLACE_LABELS[rescueCase.animalPlace]
      : null;
  }

  function getAnimalPositionLabel(rescueCase: RescueCase): string | null {
    return rescueCase.animalPosition
      ? ANIMAL_POSITION_LABELS[rescueCase.animalPosition]
      : null;
  }

  function getAnimalEnvironmentLabel(rescueCase: RescueCase): string | null {
    return rescueCase.animalEnvironment
      ? ANIMAL_ENVIRONMENT_LABELS[rescueCase.animalEnvironment]
      : null;
  }

  function getStoredLocationFallback(rescueCase: RescueCase) {
    const location = readStoredLocationText(normalizeUsefulText(rescueCase.locationText));
    return location.kind === "text" ? location.text : undefined;
  }

  function buildLocationSummaryLines(rescueCase: RescueCase): string[] {
    const approximateLocation = normalizeUsefulText(rescueCase.approximateLocation);
    const lines: string[] = [];

    if (approximateLocation) {
      lines.push(`${generalTexts.summaryLocation.referencePrefix}${approximateLocation}`);
    }

    if (rescueCase.coords) {
      lines.push(
        `${generalTexts.summaryLocation.coordinatesPrefix}${formatCoordinates(rescueCase.coords)}`,
        `${generalTexts.summaryLocation.mapPrefix}https://maps.google.com/?q=${rescueCase.coords.latitude},${rescueCase.coords.longitude}`,
      );
    } else {
      const fallbackLocation = getStoredLocationFallback(rescueCase);

      if (fallbackLocation) {
        lines.push(`${generalTexts.summaryLocation.referencePrefix}${fallbackLocation}`);
      }
    }

    return lines;
  }

  function getHistoryLocationFields(rescueCase: RescueCase) {
    const approximateLocation = normalizeUsefulText(rescueCase.approximateLocation);
    const fields: string[] = [];

    if (approximateLocation) {
      fields.push(`${generalTexts.summaryLocation.referencePrefix}${approximateLocation}`);
    }

    if (rescueCase.coords) {
      fields.push(
        `${generalTexts.summaryLocation.coordinatesPrefix}${formatCoordinates(rescueCase.coords)}`,
        `${generalTexts.summaryLocation.mapPrefix}https://maps.google.com/?q=${rescueCase.coords.latitude},${rescueCase.coords.longitude}`,
      );
    } else {
      const fallbackLocation = getStoredLocationFallback(rescueCase);

      if (fallbackLocation) {
        fields.push(`${generalTexts.summaryLocation.referencePrefix}${fallbackLocation}`);
      }
    }

    return fields;
  }

  function buildCaseSummary(rescueCase: RescueCase): string {
    const flagLabels = getActiveFlagLabels(rescueCase.flags);
    const animalPositionLabel = getAnimalPositionLabel(rescueCase);
    const animalEnvironmentLabel = getAnimalEnvironmentLabel(rescueCase);
    const animalPlaceLabel = getAnimalPlaceLabel(rescueCase);

    return buildRescueShareMessage({
      animalStateLabel: ANIMAL_STATE_LABELS[rescueCase.animalState],
      animalTypeLabel: ANIMAL_TYPE_LABELS[rescueCase.animalType],
      animalPositionLabel,
      animalEnvironmentLabel,
      animalPlaceLabel:
        !animalPositionLabel && !animalEnvironmentLabel
          ? animalPlaceLabel
          : null,
      observedSigns: flagLabels,
      locationLines: buildLocationSummaryLines(rescueCase),
      dateLine: `${generalTexts.summaryHistory.datePrefix}${formatDate(
        rescueCase.completedAt ?? rescueCase.updatedAt,
      )}`,
    }, locale);
  }

  return {
    ANIMAL_TYPE_LABELS, ANIMAL_STATE_LABELS, ANIMAL_STATE_ICONS, formatDate,
    getActiveFlagLabels, formatObservedSituation, getHistoryLocationFields,
    getAnimalPositionLabel, getAnimalEnvironmentLabel, getAnimalPlaceLabel, buildCaseSummary,
  };
}

function HistoryCard({
  rescueCase,
  expanded,
  onToggle,
  onCopy,
  onDelete,
}: {
  rescueCase: RescueCase;
  expanded: boolean;
  onToggle: () => void;
  onCopy: () => void;
  onDelete: () => void;
}) {
  const { locale } = useI18n();
  const generalTexts = getEffectiveCatalog(locale);
  const { ANIMAL_TYPE_LABELS, ANIMAL_STATE_LABELS, ANIMAL_STATE_ICONS, formatDate,
    getActiveFlagLabels, formatObservedSituation, getHistoryLocationFields,
    getAnimalPositionLabel, getAnimalEnvironmentLabel, getAnimalPlaceLabel } =
    useMemo(() => createHistoryPresentation(locale), [locale]);
  const flagLabels = getActiveFlagLabels(rescueCase.flags);
  const observedSituation = formatObservedSituation(flagLabels);
  const locationFields = getHistoryLocationFields(rescueCase);
  const animalPositionLabel = getAnimalPositionLabel(rescueCase);
  const animalEnvironmentLabel = getAnimalEnvironmentLabel(rescueCase);
  const animalPlaceLabel = getAnimalPlaceLabel(rescueCase);

  return (
    <View style={styles.card}>
      <Pressable style={styles.cardHeader} onPress={onToggle}>
        <View style={styles.cardHeaderText}>
          <Text style={styles.cardTitle}>
            {ANIMAL_TYPE_LABELS[rescueCase.animalType]}
          </Text>

          <Text style={styles.cardDate}>
            {formatDate(rescueCase.completedAt ?? rescueCase.updatedAt)}
          </Text>

          <Text style={styles.cardState}>
            {ANIMAL_STATE_ICONS[rescueCase.animalState]}{" "}
            {ANIMAL_STATE_LABELS[rescueCase.animalState]}
          </Text>
        </View>

        <Text style={styles.expandIcon}>{expanded ? "−" : "+"}</Text>
      </Pressable>

      <View style={styles.cardSummary}>
        {locationFields.map((field) => (
          <Text key={field} style={styles.summaryValue}>
            {field}
          </Text>
        ))}

        {animalPositionLabel ? (
          <>
            <Text style={styles.summaryLabel}>{generalTexts.summaryHistory.position}</Text>
            <Text style={styles.summaryValue}>{animalPositionLabel}</Text>
          </>
        ) : null}

        {animalEnvironmentLabel ? (
          <>
            <Text style={styles.summaryLabel}>{generalTexts.summaryHistory.environment}</Text>
            <Text style={styles.summaryValue}>{animalEnvironmentLabel}</Text>
          </>
        ) : null}

        {!animalPositionLabel && !animalEnvironmentLabel && animalPlaceLabel ? (
          <>
            <Text style={styles.summaryLabel}>{generalTexts.summaryHistory.legacyPlace}</Text>
            <Text style={styles.summaryValue}>{animalPlaceLabel}</Text>
          </>
        ) : null}

        <Text style={styles.summaryLabel}>{generalTexts.summaryHistory.situation}</Text>
        <Text style={styles.summaryValue}>{observedSituation}</Text>
      </View>

      {expanded ? (
        <View style={styles.details}>
          <View style={styles.detailActions}>
            <Pressable style={styles.copyButton} onPress={onCopy}>
              <View style={styles.buttonContent}>
                <IconSymbol name="doc.on.doc" size={16} color="#ffffff" />
                <Text style={styles.copyButtonText}>{generalTexts.summaryHistory.copySummary}</Text>
              </View>
            </Pressable>

            <Pressable style={styles.deleteButton} onPress={onDelete}>
              <View style={styles.buttonContent}>
                <IconSymbol name="trash" size={16} color="#9b1c1c" />
                <Text style={styles.deleteButtonText}>{generalTexts.historyUi.deleteButton}</Text>
              </View>
            </Pressable>
          </View>
        </View>
      ) : null}
    </View>
  );
}

export default function HistoryPage() {
  const { locale } = useI18n();
  const generalTexts = getEffectiveCatalog(locale);
  const router = useRouter();
  const navigation = useNavigation();
  const { buildCaseSummary } = useMemo(() => createHistoryPresentation(locale), [locale]);
  const homePath = getLocalizedPath("home", locale);
  const goBack = () => {
    if (locale === "es") {
      router.back();
      return;
    }
    const state = navigation.getState();
    const previous = state?.routes[(state.index ?? 0) - 1];
    // A language switch can leave a Spanish entry behind in the stack.
    if (previous && resolveRouteLocale("/" + previous.name, "web") === locale) router.back();
    else router.replace(homePath);
  };
  const [history, setHistory] = useState<RescueCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [historyReadIssue, setHistoryReadIssue] = useState(false);
  const [expandedCaseId, setExpandedCaseId] = useState<string | null>(null);

  const loadHistory = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getHistoryReadResult();
      setHistory(result.cases);
      setHistoryReadIssue(result.hasIncompatibleEntries);
    } catch {
      // Keep any already displayed reports; a failed read is not an empty history.
      setHistoryReadIssue(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadHistory();
    }, [loadHistory]),
  );

  const confirmAction = (
    title: string,
    message: string,
    confirmText: string,
    action: () => Promise<void>,
  ) => {
    const runAction = async () => {
      try {
        await action();
      } catch {
        const title = generalTexts.assistantCaptureUi.galleryErrorTitle;
        const message = generalTexts.assistantCaptureUi.locationErrorMessage;
        if (Platform.OS === "web") window.alert(`${title}\n\n${message}`);
        else Alert.alert(title, message);
      }
    };
    if (Platform.OS === "web") {
      if (window.confirm(`${title}\n\n${message}`)) {
        void runAction();
      }
      return;
    }

    Alert.alert(title, message, [
      { text: generalTexts.historyUi.cancel, style: "cancel" },
      {
        text: confirmText,
        style: "destructive",
        onPress: () => void runAction(),
      },
    ]);
  };

  const handleCopySummary = async (rescueCase: RescueCase) => {
    await Clipboard.setStringAsync(buildCaseSummary(rescueCase));

    if (Platform.OS === "web") {
      window.alert(generalTexts.summaryHistory.clipboardWeb);
      return;
    }

    Alert.alert(generalTexts.summaryHistory.clipboardTitle, generalTexts.summaryHistory.clipboardMessage);
  };

  const handleDeleteItem = (rescueCase: RescueCase) => {
    confirmAction(
      generalTexts.historyUi.deleteTitle,
      generalTexts.historyUi.deleteMessage,
      generalTexts.historyUi.deleteConfirm,
      async () => {
        await deleteHistoryItem(rescueCase.id);
        setHistory((currentHistory) =>
          currentHistory.filter((item) => item.id !== rescueCase.id),
        );

        if (expandedCaseId === rescueCase.id) {
          setExpandedCaseId(null);
        }
      },
    );
  };

  const handleClearHistory = () => {
    confirmAction(
      generalTexts.historyUi.clearTitle,
      generalTexts.historyUi.clearMessage,
      generalTexts.historyUi.clearConfirm,
      async () => {
        await clearHistory();
        setHistory([]);
        setExpandedCaseId(null);
      },
    );
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.screenContent}
      showsVerticalScrollIndicator
    >
      <NoIndexHead path={getLocalizedPath("history", locale)} title={`${generalTexts.historyUi.navigationTitle} | SOS Fauna España`} />
      <Stack.Screen options={{
        title: generalTexts.historyUi.navigationTitle,
        ...(locale === "en" ? {
          headerLeft: ({ tintColor }: { tintColor?: string }) => router.canGoBack() ? (
            <HeaderBackButton
              tintColor={tintColor}
              displayMode="minimal"
              accessibilityLabel={generalTexts.historyUi.back}
              onPress={goBack}
            />
          ) : null,
        } : {}),
      }} />

      <View style={styles.header}>
        <View style={styles.headerInner}>
          <View style={styles.headerText}>
            <Text style={styles.eyebrow}>SOS Fauna España</Text>
            <Text style={styles.title}>{generalTexts.historyUi.heading}</Text>
            <Text style={styles.description}>{generalTexts.historyUi.description}</Text>
          </View>

          <Pressable style={styles.backButton} onPress={goBack}>
            <Text style={styles.backButtonText}>{generalTexts.historyUi.back}</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.content}>
        {!loading && historyReadIssue ? (
          <View style={styles.statusPanel}>
            <Text accessibilityRole="alert" style={styles.statusText}>
              {generalTexts.assistantCaptureUi.locationErrorMessage}
            </Text>
          </View>
        ) : null}
        {loading ? (
          <View style={styles.statusPanel}>
            <ActivityIndicator size="large" />
            <Text style={styles.statusText}>{generalTexts.historyUi.loading}</Text>
          </View>
        ) : history.length === 0 ? (historyReadIssue ? null : (
          <View style={styles.emptyPanel}>
            <Text style={styles.emptyIcon}>🗂️</Text>
            <Text style={styles.emptyTitle}>{generalTexts.historyUi.emptyTitle}</Text>
            <Text style={styles.emptyText}>{generalTexts.historyUi.emptyDescription}</Text>

            <Pressable style={styles.primaryButton} onPress={() => locale === "en" ? router.replace(homePath) : router.back()}>
              <Text style={styles.primaryButtonText}>{generalTexts.historyUi.home}</Text>
            </Pressable>
          </View>
        )) : (
          <>
            <View style={styles.list}>
              {history.map((rescueCase) => (
                <HistoryCard
                  key={rescueCase.id}
                  rescueCase={rescueCase}
                  expanded={expandedCaseId === rescueCase.id}
                  onToggle={() =>
                    setExpandedCaseId((currentId) =>
                      currentId === rescueCase.id ? null : rescueCase.id,
                    )
                  }
                  onCopy={() => void handleCopySummary(rescueCase)}
                  onDelete={() => handleDeleteItem(rescueCase)}
                />
              ))}
            </View>

            <Pressable
              style={styles.clearHistoryButton}
              onPress={handleClearHistory}
            >
              <Text style={styles.clearHistoryButtonText}>{generalTexts.historyUi.clearButton}</Text>
            </Pressable>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f4f7f4",
  },
  screenContent: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#dfe7df",
  },
  headerInner: {
    width: "100%",
    maxWidth: 960,
    marginHorizontal: "auto",
    paddingHorizontal: 24,
    paddingVertical: 34,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 24,
    flexWrap: "wrap",
  },
  headerText: {
    flex: 1,
    minWidth: 260,
    gap: 8,
  },
  eyebrow: {
    color: "#2f7a48",
    fontSize: 13,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  title: {
    color: "#123c24",
    fontSize: 36,
    lineHeight: 43,
    fontWeight: "900",
  },
  description: {
    color: "#536158",
    fontSize: 16,
    lineHeight: 25,
  },
  backButton: {
    minHeight: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#9ab7a0",
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonText: {
    color: "#14532d",
    fontSize: 15,
    fontWeight: "800",
  },
  content: {
    width: "100%",
    maxWidth: 960,
    marginHorizontal: "auto",
    paddingHorizontal: 24,
    paddingVertical: 36,
    gap: 24,
  },
  statusPanel: {
    minHeight: 240,
    backgroundColor: "#ffffff",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#dfe7df",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    padding: 28,
  },
  statusText: {
    color: "#536158",
    fontSize: 15,
  },
  emptyPanel: {
    minHeight: 320,
    backgroundColor: "#ffffff",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#dfe7df",
    alignItems: "center",
    justifyContent: "center",
    padding: 34,
    gap: 14,
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyTitle: {
    color: "#183d28",
    fontSize: 24,
    lineHeight: 31,
    fontWeight: "900",
    textAlign: "center",
  },
  emptyText: {
    maxWidth: 520,
    color: "#536158",
    fontSize: 16,
    lineHeight: 25,
    textAlign: "center",
  },
  primaryButton: {
    minHeight: 50,
    marginTop: 8,
    backgroundColor: "#14532d",
    borderRadius: 13,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "900",
  },
  list: {
    gap: 18,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#dfe7df",
    overflow: "hidden",
  },
  cardHeader: {
    minHeight: 78,
    paddingHorizontal: 22,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 18,
  },
  cardHeaderText: {
    flex: 1,
    gap: 4,
  },
  cardTitle: {
    color: "#183d28",
    fontSize: 20,
    fontWeight: "900",
  },
  cardDate: {
    color: "#68746b",
    fontSize: 14,
    lineHeight: 20,
  },
  cardState: {
    color: "#34483a",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "800",
  },
  expandIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#e4f4e7",
    color: "#14532d",
    fontSize: 24,
    lineHeight: 31,
    fontWeight: "700",
    textAlign: "center",
  },
  cardSummary: {
    borderTopWidth: 1,
    borderTopColor: "#edf1ed",
    paddingHorizontal: 22,
    paddingVertical: 17,
    gap: 5,
  },
  summaryLabel: {
    color: "#2f7a48",
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 0.7,
    marginTop: 4,
  },
  summaryValue: {
    color: "#34483a",
    fontSize: 15,
    lineHeight: 23,
  },
  details: {
    backgroundColor: "#f8faf8",
    borderTopWidth: 1,
    borderTopColor: "#dfe7df",
    padding: 22,
    gap: 18,
  },
  detailActions: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 2,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },
  copyButton: {
    minHeight: 44,
    borderRadius: 11,
    backgroundColor: "#14532d",
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  copyButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "900",
  },
  deleteButton: {
    alignSelf: "flex-start",
    minHeight: 44,
    marginTop: 2,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: "#d9a6a6",
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButtonText: {
    color: "#9b1c1c",
    fontSize: 14,
    fontWeight: "800",
  },
  clearHistoryButton: {
    alignSelf: "flex-start",
    minHeight: 48,
    marginTop: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d9a6a6",
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  clearHistoryButtonText: {
    color: "#9b1c1c",
    fontSize: 15,
    fontWeight: "900",
  },
});
