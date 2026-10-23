import { languageFeatures, type LanguageFeatures } from "./config";
import { DEFAULT_LOCALE, type LanguagePlatform, type Locale } from "./types";

// A correspondence is not an Expo route. No English screen is published in phase 1.
export const localizedRoutes = {
  home: { es: "/", en: "/en/" },
  about: { es: "/about", en: "/en/about" },
  faq: { es: "/faq", en: "/en/faq" },
  swifts: { es: "/faq/vencejos", en: "/en/faq/vencejos" },
  bats: { es: "/faq/murcielagos", en: "/en/faq/murcielagos" },
  centers: { es: "/centros", en: "/en/centros" },
  sources: { es: "/sources", en: "/en/sources" },
  contact: { es: "/contact", en: "/en/contact" },
  privacy: { es: "/privacy", en: "/en/privacy" },
  legal: { es: "/legal", en: "/en/legal" },
  guide: { es: "/aviso", en: "/en/guide" },
  history: { es: "/history", en: "/en/history" },
} as const satisfies Record<string, Record<Locale, string>>;

export type RouteId = keyof typeof localizedRoutes;

function splitLocalUrl(url: string) {
  // Only local, absolute paths. Never transform external or protocol-relative URLs.
  if (!url.startsWith("/") || url.startsWith("//") || /[\\\s]/u.test(url)) return null;
  const suffixIndex = url.search(/[?#]/u);
  const pathname = suffixIndex < 0 ? url : url.slice(0, suffixIndex);
  const suffix = suffixIndex < 0 ? "" : url.slice(suffixIndex);
  return { pathname: pathname.replace(/\/+$/u, "") || "/", suffix };
}

export function resolveRouteLocale(
  url: string,
  platform: LanguagePlatform = "web",
): Locale {
  if (platform !== "web") return DEFAULT_LOCALE;
  const pathname = splitLocalUrl(url)?.pathname;
  return pathname === "/en" || pathname?.startsWith("/en/") ? "en" : DEFAULT_LOCALE;
}

export function matchLocalizedRoute(url: string): RouteId | null {
  const parts = splitLocalUrl(url);
  if (!parts) return null;
  for (const id of Object.keys(localizedRoutes) as RouteId[]) {
    if (Object.values(localizedRoutes[id]).some(
      (path) => (path.replace(/\/+$/u, "") || "/") === parts.pathname,
    )) return id;
  }
  return null;
}

// Pure lookup, including unpublished routes; callers must check availability before navigation.
export function getLocalizedPath(id: RouteId, locale: Locale): string {
  return localizedRoutes[id][locale];
}

export function isLocaleAvailable(
  locale: Locale,
  platform: LanguagePlatform,
  features: LanguageFeatures = languageFeatures,
): boolean {
  return locale === "es" || (platform === "web" && features.englishPublished);
}

// Navigation-safe counterpart. Unknown paths never silently fall back to the home page.
export function getAvailableLocalizedUrl(
  url: string,
  locale: Locale,
  platform: LanguagePlatform,
  features: LanguageFeatures = languageFeatures,
): string | null {
  if (!isLocaleAvailable(locale, platform, features)) return null;
  const id = matchLocalizedRoute(url);
  const parts = splitLocalUrl(url);
  return id && parts ? getLocalizedPath(id, locale) + parts.suffix : null;
}
