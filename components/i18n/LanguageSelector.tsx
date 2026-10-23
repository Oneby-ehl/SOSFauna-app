import { Fragment } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useI18n } from "@/i18n/I18nProvider";
import { getLocalizedPath, matchLocalizedRoute } from "@/i18n/routes";
import { getEnglishDevelopmentPage } from "@/i18n/developmentPreview";
import { locales, type Locale } from "@/i18n/types";

type LanguageSelectorProps = { url?: string; onSelect?: (locale: Locale, url: string) => void };

export function LanguageSelector({ url = "/", onSelect }: LanguageSelectorProps = {}) {
  const { locale, t, languageControlsEnabled, selectLocale } = useI18n();
  if (Platform.OS !== "web" || !languageControlsEnabled) return null;
  return (
    <View accessibilityLabel={t("language", "selectorLabel")} style={styles.container}>
      {locales.map((option, index) => {
        const route = matchLocalizedRoute(url);
        const equivalent = getLocalizedPath(route ?? "home", option);
        const target = option === "es" || getEnglishDevelopmentPage(equivalent, "web") ? equivalent : getLocalizedPath("home", option);
        const selected = option === locale;
        return <Fragment key={option}>
          {index > 0 ? <Text accessibilityElementsHidden style={styles.separator}>|</Text> : null}
          <Pressable accessibilityRole="button" accessibilityLabel={t("language", option)} accessibilityState={{ selected }}
            onPress={() => onSelect ? onSelect(option, target) : selectLocale(option)}
            style={styles.option}>
            <Text style={[styles.label, selected && styles.selectedLabel]}>{option.toUpperCase()}</Text>
          </Pressable>
        </Fragment>;
      })}
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flexDirection: "row", alignItems: "center", flexShrink: 0, gap: 2 },
  option: { minHeight: 44, minWidth: 44, justifyContent: "center", alignItems: "center" },
  separator: { color: "#14532d" },
  label: { color: "#14532d", fontSize: 15, fontWeight: "400" },
  selectedLabel: { fontWeight: "700" },
});
