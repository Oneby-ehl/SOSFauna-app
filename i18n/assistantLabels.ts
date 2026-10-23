import { getCatalog, getEffectiveCatalog, type Catalog } from "./translate";
import { DEFAULT_LOCALE, type Locale } from "./types";
import { getEffectiveLocale } from "./effectiveLocale";

type LabelKey = keyof Catalog["assistantDisplayLabels"];
// Compatibility bridge for the assistant's existing fixed Spanish display labels.
// This map is presentation-only; no translated value becomes an option/storage ID.
const labelKeys = new Map<string, LabelKey>(
  Object.entries(getCatalog("es").assistantDisplayLabels).map(([key, text]) => [text, key as LabelKey] as const),
);
export function localiseAssistantLabel(text: string, locale: Locale = DEFAULT_LOCALE): string {
  if (getEffectiveLocale(locale) === "es") return text;
  const key = labelKeys.get(text);
  return key ? getEffectiveCatalog(locale).assistantDisplayLabels[key] : text;
}
