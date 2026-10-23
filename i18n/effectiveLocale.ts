import { languageFeatures } from "./config";
import { DEFAULT_LOCALE, type LanguagePlatform, type Locale } from "./types";

// Pure publication gate: never read browser, storage or mutable global state.
export function getEffectiveLocale(
  requested: Locale = DEFAULT_LOCALE,
  platform: LanguagePlatform = "web",
): Locale {
  const localPreview = typeof __DEV__ !== "undefined" &&
    (__DEV__ || process.env.EXPO_PUBLIC_SOS_FAUNA_STATIC_PREVIEW === "1");
  return platform === "web" && (languageFeatures.englishPublished || localPreview)
    ? requested
    : DEFAULT_LOCALE;
}
