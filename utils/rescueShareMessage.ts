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
    .filter(Boolean)
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
