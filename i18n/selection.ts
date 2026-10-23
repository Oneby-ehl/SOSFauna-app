import { languageFeatures, type LanguageFeatures } from "./config";
import { getAvailableLocalizedUrl, resolveRouteLocale } from "./routes";
import { isLocale, type LanguagePlatform, type Locale } from "./types";

// Crawlers must render each public URL in its own language, without a browser-
// preference redirect. This changes navigation only, never the served content.
const searchCrawlerPattern = /Googlebot|Google-InspectionTool/i;
export function isSearchCrawler(userAgent = ""): boolean {
  return searchCrawlerPattern.test(userAgent);
}

export function resolveBrowserLocale(languages: readonly string[]): Locale {
  for (const language of languages) {
    const base = language.toLowerCase().split(/[-_]/u)[0];
    if (isLocale(base)) return base;
  }
  return "en";
}

type InitialNavigationInput = {
  url: string;
  platform: LanguagePlatform;
  preferredLocale?: Locale | null;
  browserLanguages?: readonly string[];
  userAgent?: string;
  // Default is deliberate navigation. A future web entry controller must explicitly
  // mark only an eligible initial home visit, never every reload or Spanish link.
  entryIntent?: "explicit" | "initial-home";
  features?: LanguageFeatures;
};

export function resolveInitialNavigation({
  url,
  platform,
  preferredLocale,
  browserLanguages = [],
  userAgent = "",
  entryIntent = "explicit",
  features = languageFeatures,
}: InitialNavigationInput): { locale: Locale; redirectTo: string | null } {
  const locale = resolveRouteLocale(url, platform);
  const stay = { locale, redirectTo: null };
  if (platform !== "web" || locale === "en" || !features.automaticRedirectEnabled || isSearchCrawler(userAgent)) return stay;
  // Do not change deep links, query parameters or fragments on initial entry.
  if (entryIntent !== "initial-home" || url !== "/") return stay;
  const selected = preferredLocale ?? resolveBrowserLocale(browserLanguages);
  if (selected === locale) return stay;
  return { locale, redirectTo: getAvailableLocalizedUrl(url, selected, platform, features) };
}

const LANGUAGE_PREFERENCE_KEY = "sosFauna:preferredLocale";

// Runs in the static document head before body paint. Keep the small browser
// resolver equivalent to resolveBrowserLocale; no preferences or report data are written.
export const initialLanguageScript = `(function () {
  if (location.pathname !== '/' || location.search || location.hash) return;
  if (${searchCrawlerPattern.toString()}.test(navigator.userAgent || '')) return;
  var selected = null;
  try { selected = localStorage.getItem('${LANGUAGE_PREFERENCE_KEY}'); } catch (_) {}
  if (selected !== 'es' && selected !== 'en') {
    selected = 'en';
    var languages = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language];
    for (var i = 0; i < languages.length; i++) {
      var base = String(languages[i]).toLowerCase().split(/[-_]/)[0];
      if (base === 'es' || base === 'en') { selected = base; break; }
    }
  }
  if (selected === 'en') {
    document.documentElement.dataset.sosLanguageRedirect = 'en';
    document.documentElement.style.visibility = 'hidden';
    try { location.replace('/en/'); } catch (_) { document.documentElement.style.visibility = ''; }
  }
})();`;

type PreferenceReader = { getItem: (key: string) => string | null };
type PreferenceWriter = { setItem: (key: string, value: string) => void };

// Storage is injected: importing this module never touches window or AsyncStorage.
export function readLanguagePreference(storage: PreferenceReader): Locale | null {
  try {
    const value = storage.getItem(LANGUAGE_PREFERENCE_KEY);
    return isLocale(value) ? value : null;
  } catch {
    return null;
  }
}

export function writeLanguagePreference(storage: PreferenceWriter, locale: Locale): boolean {
  try {
    storage.setItem(LANGUAGE_PREFERENCE_KEY, locale);
    return true;
  } catch {
    return false;
  }
}
