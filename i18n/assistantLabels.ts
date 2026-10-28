import { getCatalog, getEffectiveCatalog, type Catalog } from "./translate";
import { DEFAULT_LOCALE, type Locale } from "./types";
import { getEffectiveLocale } from "./effectiveLocale";

type LabelKey = keyof Catalog["assistantDisplayLabels"];
type OptionArea = "assistantPositionOptions" | "assistantEnvironmentOptions";
const optionLabels = new Map<string, { area: OptionArea; key: string }>();
for (const area of ["assistantPositionOptions", "assistantEnvironmentOptions"] as const) {
  for (const [key, text] of Object.entries(getCatalog("es")[area])) optionLabels.set(text, { area, key });
}
// Compatibility bridge for the assistant's existing fixed Spanish display labels.
// This map is presentation-only; no translated value becomes an option/storage ID.
const labelKeys = new Map<string, LabelKey>(
  Object.entries(getCatalog("es").assistantDisplayLabels).map(([key, text]) => [text, key as LabelKey] as const),
);
export function localiseAssistantLabel(text: string, locale: Locale = DEFAULT_LOCALE): string {
  if (getEffectiveLocale(locale) === "es") return text;
  const option = optionLabels.get(text);
  if (option) {
    const labels = getEffectiveCatalog(locale)[option.area] as Readonly<Record<string, string>>;
    return labels[option.key];
  }
  const key = labelKeys.get(text);
  return key ? getEffectiveCatalog(locale).assistantDisplayLabels[key] : text;
}
