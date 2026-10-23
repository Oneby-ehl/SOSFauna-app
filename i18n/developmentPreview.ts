import { matchLocalizedRoute, resolveRouteLocale } from "./routes";
import type { LanguagePlatform } from "./types";
import { languageFeatures } from "./config";

// Public app/ has no English routes. The local build creates a separate router root.
const previewPages = {
  home: true,
  about: true,
  sources: true,
  contact: true,
  privacy: true,
  legal: true,
  guide: true,
  faq: true,
  swifts: true,
  bats: true,
  centers: true,
  history: true,
} as const;

export type InformationPageId = keyof typeof previewPages;

export function isLocalLanguagePreview(platform: LanguagePlatform): boolean {
  return platform === "web" && (__DEV__ || process.env.EXPO_PUBLIC_SOS_FAUNA_STATIC_PREVIEW === "1");
}

export function isWebLanguageEnabled(platform: LanguagePlatform): boolean {
  return platform === "web" && (languageFeatures.englishPublished || isLocalLanguagePreview(platform));
}

export function getEnglishDevelopmentPage(
  url: string,
  platform: LanguagePlatform,
): InformationPageId | null {
  const localPreview = __DEV__ || process.env.EXPO_PUBLIC_SOS_FAUNA_STATIC_PREVIEW === "1";
  if ((!localPreview && !languageFeatures.englishPublished) || platform !== "web" || resolveRouteLocale(url, platform) !== "en") return null;
  const id = matchLocalizedRoute(url);
  return id && id in previewPages ? id as InformationPageId : null;
}
