import { usePathname, useRouter } from "expo-router";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type PropsWithChildren } from "react";
import { Platform } from "react-native";

import { getEffectiveLocale } from "./effectiveLocale";
import { getLocalizedPath, matchLocalizedRoute, resolveRouteLocale } from "./routes";
import { createTranslator } from "./translate";
import { type Locale } from "./types";
import { getEnglishDevelopmentPage, isWebLanguageEnabled } from "./developmentPreview";
import { languageFeatures } from "./config";
import { readLanguagePreference, resolveInitialNavigation, writeLanguagePreference } from "./selection";

const I18nContext = createContext({
  locale: "es" as Locale, t: createTranslator("es"), languageControlsEnabled: false,
  selectLocale: (_locale: Locale) => {},
});

// Web-only activation. Native keeps Spanish and never reads language preferences.
export function I18nProvider({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const router = useRouter();
  const platform = Platform.OS === "web" ? "web" : "native";
  const preview = isWebLanguageEnabled(platform);
  const entered = useRef(false);
  const [guideOverride, setGuideOverride] = useState<{ pathname: string; locale: Locale } | null>(null);
  const routeLocale = getEnglishDevelopmentPage(pathname, platform)
    ? "en"
    : getEffectiveLocale(languageFeatures.englishPublished ? resolveRouteLocale(pathname, platform) : "es", platform);
  const locale = preview && guideOverride?.pathname === pathname ? guideOverride.locale : routeLocale;

  useEffect(() => { setGuideOverride(null); }, [pathname]);
  useEffect(() => {
    if (!preview || typeof window === "undefined" || entered.current) return;
    entered.current = true;
    if (document.documentElement.dataset.sosLanguageRedirect === "en") return;
    let preference: Locale | null = null;
    try { preference = readLanguagePreference(window.localStorage); } catch { /* Private browser storage may be unavailable. */ }
    const url = window.location.pathname + window.location.search + window.location.hash;
    const navigation = resolveInitialNavigation({
      url, platform: "web", preferredLocale: preference,
      browserLanguages: navigator.languages?.length ? Array.from(navigator.languages) : [navigator.language],
      userAgent: navigator.userAgent,
      entryIntent: "initial-home",
      features: { englishPublished: true, selectorEnabled: true, automaticRedirectEnabled: true },
    });
    if (navigation.redirectTo && navigation.redirectTo !== url) router.replace(navigation.redirectTo);
  }, [preview, router]);

  const selectLocale = useCallback((selected: Locale) => {
    if (!preview || typeof window === "undefined") return;
    try { writeLanguagePreference(window.localStorage, selected); } catch { /* The current choice still works without persistence. */ }
    const currentUrl = window.location.pathname + window.location.search + window.location.hash;
    const route = matchLocalizedRoute(currentUrl);
    const equivalent = route ? getLocalizedPath(route, selected) : getLocalizedPath("home", selected);
    const available = selected === "es" || Boolean(getEnglishDevelopmentPage(equivalent, "web"));
    const targetPath = available ? equivalent : getLocalizedPath("home", selected);
    const suffix = route && available ? window.location.search + window.location.hash : "";
    const target = targetPath + suffix;
    if (route === "guide") {
      // Keep the mounted assistant, hooks and device-only media references. No router
      // navigation or recovery cycle is needed for a presentation-only language change.
      window.history.replaceState(window.history.state, "", target);
      setGuideOverride({ pathname, locale: selected });
    } else if (target !== currentUrl) router.replace(target);
  }, [pathname, preview, router]);

  useEffect(() => {
    if (preview && typeof document !== "undefined") document.documentElement.lang = locale;
  }, [locale, preview]);
  const value = useMemo(() => ({ locale, t: createTranslator(locale), languageControlsEnabled: preview, selectLocale }), [locale, preview, selectLocale]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() { return useContext(I18nContext); }
