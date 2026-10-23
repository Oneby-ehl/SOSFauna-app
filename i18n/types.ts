export const locales = ["es", "en"] as const;

export type Locale = (typeof locales)[number];
export type LanguagePlatform = "web" | "native";

export const DEFAULT_LOCALE: Locale = "es";

export function isLocale(value: unknown): value is Locale {
  return value === "es" || value === "en";
}
