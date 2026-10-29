import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type PropsWithChildren } from "react";
import { ActivityIndicator, I18nManager, View } from "react-native";
import { fauna } from "@/constants/androidPresentation";
import { createTranslator } from "./translate";
import { isLocale, type Locale } from "./types";

// Separate from report/history storage and the web's URL-based language setting.
const LANGUAGE_KEY = "sosFauna:android:language";

function deviceLocale(): Locale {
  const identifier = I18nManager.getConstants().localeIdentifier
    ?? Intl.DateTimeFormat().resolvedOptions().locale;
  return /^en(?:[-_]|$)/i.test(identifier) ? "en" : "es";
}

const I18nContext = createContext({
  locale: "es" as Locale, t: createTranslator("es"), languageControlsEnabled: true,
  selectLocale: (_locale: Locale) => {},
});

export function I18nProvider({ children }: PropsWithChildren) {
  const [locale, setLocale] = useState<Locale>(deviceLocale);
  const [ready, setReady] = useState(false);
  const writes = useRef(Promise.resolve());

  useEffect(() => {
    let active = true;
    async function restoreLanguage() {
      try {
        const stored = await AsyncStorage.getItem(LANGUAGE_KEY);
        if (!active) return;
        if (isLocale(stored)) setLocale(stored);
        else await AsyncStorage.setItem(LANGUAGE_KEY, deviceLocale());
      } catch (error) {
        console.warn("Unable to restore the Android language preference.", error);
      } finally {
        if (active) setReady(true);
      }
    }
    void restoreLanguage();
    return () => { active = false; };
  }, []);

  const selectLocale = useCallback((selected: Locale) => {
    if (!isLocale(selected)) return;
    setLocale(selected);
    // Preserve the last selection if storage writes complete at different speeds.
    writes.current = writes.current.then(() => AsyncStorage.setItem(LANGUAGE_KEY, selected))
      .catch(error => { console.warn("Unable to save the Android language preference.", error); });
  }, []);

  const value = useMemo(() => ({ locale, t: createTranslator(locale), languageControlsEnabled: true, selectLocale }), [locale, selectLocale]);
  if (!ready) return <View style={{ flex: 1, backgroundColor: fauna.paper, alignItems: "center", justifyContent: "center" }}>
    <ActivityIndicator color={fauna.forest} />
  </View>;
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() { return useContext(I18nContext); }
