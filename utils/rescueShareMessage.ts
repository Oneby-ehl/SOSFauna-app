import { getEffectiveCatalog } from "@/i18n/translate";
import * as Clipboard from "expo-clipboard";
import { Alert, Platform, Share } from "react-native";
import { createTranslator } from "@/i18n/translate";
import { DEFAULT_LOCALE, type Locale } from "@/i18n/types";

// Keep the public sharing API and callbacks unchanged during Spanish-only extraction.
const generalTexts = getEffectiveCatalog();

const t = createTranslator(DEFAULT_LOCALE);

type RescueShareMessageInput = {
  animalStateLabel: string;
  animalTypeLabel: string;
  animalPositionLabel?: string | null;
  animalEnvironmentLabel?: string | null;
  animalPlaceLabel?: string | null;
  observedSigns: string[];
  locationLines?: string[];
  hasPhoto?: boolean;
  hasVideo?: boolean;
  dateLine?: string;
};

function lowercaseFirst(value: string, locale: Locale = DEFAULT_LOCALE) {
  if (!value) return value;
  return value.charAt(0).toLocaleLowerCase(locale === "en" ? "en-GB" : "es-ES") + value.slice(1);
}

function normalizeLine(value: string | null | undefined) {
  const normalized = value?.trim();
  return normalized && normalized.length > 0 ? normalized : undefined;
}

function keepMessageLine(line: string | null | undefined): line is string {
  return line !== null && line !== undefined;
}

export function buildRescueShareMessage({
  animalStateLabel,
  animalTypeLabel,
  animalPositionLabel,
  animalEnvironmentLabel,
  animalPlaceLabel,
  observedSigns,
  locationLines = [],
  hasPhoto = false,
  hasVideo = false,
  dateLine,
}: RescueShareMessageInput, locale: Locale = DEFAULT_LOCALE) {
  const generalTexts = getEffectiveCatalog(locale);
  const lowercaseLabel = (value: string) => lowercaseFirst(value, locale);
  const normalizedAnimalPositionLabel = normalizeLine(animalPositionLabel);
  const normalizedAnimalEnvironmentLabel = normalizeLine(
    animalEnvironmentLabel,
  );
  const normalizedAnimalPlaceLabel = normalizeLine(animalPlaceLabel);
  const normalizedDateLine = normalizeLine(dateLine);
  const situationLines = [
    `${generalTexts.rescueMessage.statePrefix}${lowercaseLabel(animalStateLabel)}`,
    `${generalTexts.rescueMessage.animalTypePrefix}${lowercaseLabel(animalTypeLabel)}`,
    normalizedAnimalPositionLabel
      ? `${generalTexts.rescueMessage.positionPrefix}${lowercaseLabel(normalizedAnimalPositionLabel)}`
      : null,
    normalizedAnimalEnvironmentLabel
      ? `${generalTexts.rescueMessage.environmentPrefix}${lowercaseLabel(normalizedAnimalEnvironmentLabel)}`
      : null,
    !normalizedAnimalPositionLabel &&
    !normalizedAnimalEnvironmentLabel &&
    normalizedAnimalPlaceLabel
      ? `${generalTexts.rescueMessage.legacyPlacePrefix}${lowercaseLabel(normalizedAnimalPlaceLabel)}`
      : null,
    observedSigns.length > 0
      ? `${generalTexts.rescueMessage.observedSignsPrefix}${observedSigns
          .map(lowercaseLabel)
          .join(", ")}`
      : null,
  ].filter(Boolean);

  const usefulLocationLines = locationLines
    .map(normalizeLine)
    .filter((line): line is string => Boolean(line));
  const mediaLines = [
    hasPhoto ? generalTexts.rescueMessage.photoAvailable : null,
    hasVideo ? generalTexts.rescueMessage.videoAvailable : null,
  ].filter(Boolean);
  const detailLines = [...usefulLocationLines, ...mediaLines];

  return [
    generalTexts.rescueMessage.title,
    "",
    `${generalTexts.rescueMessage.introductionPrefix}${lowercaseLabel(
      animalStateLabel,
    )}${generalTexts.rescueMessage.introductionSuffix}`,
    "",
    generalTexts.rescueMessage.situationHeading,
    ...situationLines,
    detailLines.length > 0 ? "" : null,
    detailLines.length > 0 ? generalTexts.rescueMessage.additionalHeading : null,
    ...detailLines,
    normalizedDateLine ? "" : null,
    normalizedDateLine,
    "",
    generalTexts.rescueMessage.attribution,
    "https://sosfauna.es",
  ]
    .filter(keepMessageLine)
    .join("\n");
}

export const SOS_FAUNA_SHARE_TITLE = t("common", "brand");
export const SOS_FAUNA_SHARE_URL = "https://sosfauna.es";
export const SOS_FAUNA_SHARE_TEXT = t("appSharing", "description");

export function buildSosFaunaShareMessage() {
  return [
    SOS_FAUNA_SHARE_TITLE,
    SOS_FAUNA_SHARE_TEXT,
    SOS_FAUNA_SHARE_URL,
  ].join("\n");
}

export async function shareSosFaunaApp() {
  if (Platform.OS !== "web") {
    try {
      await Share.share({
        title: SOS_FAUNA_SHARE_TITLE,
        message: buildSosFaunaShareMessage(),
      });
    } catch (error) {
      console.warn("No se pudo abrir el diálogo nativo de compartir.", error);
    }
    return;
  }

  if (
    typeof navigator !== "undefined" &&
    navigator.share
  ) {
    try {
      await navigator.share({
        title: SOS_FAUNA_SHARE_TITLE,
        text: SOS_FAUNA_SHARE_TEXT,
        url: SOS_FAUNA_SHARE_URL,
      });
      return;
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }
    }
  }

  await Clipboard.setStringAsync(buildSosFaunaShareMessage());

  if (Platform.OS === "web") {
    window.alert(t("appSharing", "copiedAlert"));
    return;
  }

  Alert.alert(
    t("appSharing", "copiedTitle"),
    t("appSharing", "copiedMessage"),
  );
}
