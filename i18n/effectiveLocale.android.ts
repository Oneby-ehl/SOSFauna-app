import { DEFAULT_LOCALE, type LanguagePlatform, type Locale } from "./types";

// Android uses bundled translations without changing web publication gates.
export function getEffectiveLocale(
  requested: Locale = DEFAULT_LOCALE,
  _platform: LanguagePlatform = "web",
): Locale {
  return requested;
}
