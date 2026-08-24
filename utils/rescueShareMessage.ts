import * as Clipboard from "expo-clipboard";
import { Alert, Platform, Share } from "react-native";

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

function lowercaseFirst(value: string) {
  if (!value) return value;
  return value.charAt(0).toLocaleLowerCase("es-ES") + value.slice(1);
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
}: RescueShareMessageInput) {
  const normalizedAnimalPositionLabel = normalizeLine(animalPositionLabel);
  const normalizedAnimalEnvironmentLabel = normalizeLine(
    animalEnvironmentLabel,
  );
  const normalizedAnimalPlaceLabel = normalizeLine(animalPlaceLabel);
  const normalizedDateLine = normalizeLine(dateLine);
  const situationLines = [
    `• Estado: ${lowercaseFirst(animalStateLabel)}`,
    `• Tipo: ${lowercaseFirst(animalTypeLabel)}`,
    normalizedAnimalPositionLabel
      ? `• Dónde está: ${lowercaseFirst(normalizedAnimalPositionLabel)}`
      : null,
    normalizedAnimalEnvironmentLabel
      ? `• Entorno: ${lowercaseFirst(normalizedAnimalEnvironmentLabel)}`
      : null,
    !normalizedAnimalPositionLabel &&
    !normalizedAnimalEnvironmentLabel &&
    normalizedAnimalPlaceLabel
      ? `• Dónde está el animal: ${lowercaseFirst(normalizedAnimalPlaceLabel)}`
      : null,
    observedSigns.length > 0
      ? `• Señales observadas: ${observedSigns
          .map(lowercaseFirst)
          .join(", ")}`
      : null,
  ].filter(Boolean);

  const usefulLocationLines = locationLines
    .map(normalizeLine)
    .filter((line): line is string => Boolean(line));
  const mediaLines = [
    hasPhoto ? "• Foto disponible" : null,
    hasVideo ? "• Vídeo disponible" : null,
  ].filter(Boolean);
  const detailLines = [...usefulLocationLines, ...mediaLines];

  return [
    "AVISO DE RESCATE DE FAUNA",
    "",
    `He encontrado un animal ${lowercaseFirst(
      animalStateLabel,
    )} que puede necesitar ayuda.`,
    "",
    "Situación",
    ...situationLines,
    detailLines.length > 0 ? "" : null,
    detailLines.length > 0 ? "Información adicional" : null,
    ...detailLines,
    normalizedDateLine ? "" : null,
    normalizedDateLine,
    "",
    "Información recopilada con SOS Fauna España",
    "https://sosfauna.es",
  ]
    .filter(keepMessageLine)
    .join("\n");
}

export const SOS_FAUNA_SHARE_TITLE = "SOS Fauna España";
export const SOS_FAUNA_SHARE_URL = "https://sosfauna.es";
export const SOS_FAUNA_SHARE_TEXT =
  "Ayuda y orientación si encuentras un animal silvestre herido, atrapado o en peligro.";

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
    window.alert("Mensaje copiado al portapapeles.");
    return;
  }

  Alert.alert(
    "Mensaje copiado",
    "El mensaje de SOS Fauna España se ha copiado al portapapeles.",
  );
}
