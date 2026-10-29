import { Fragment } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { fauna } from "@/constants/androidPresentation";
import { useI18n } from "@/i18n/I18nProvider";
import { locales, type Locale } from "@/i18n/types";

type LanguageSelectorProps = { url?: string; onSelect?: (locale: Locale, url: string) => void };

export function LanguageSelector({ url = "/", onSelect }: LanguageSelectorProps = {}) {
  const { locale, t, selectLocale } = useI18n();
  return <View accessibilityLabel={t("language", "selectorLabel")} style={styles.container}>
    {locales.map((option, index) => <Fragment key={option}>
      {index > 0 ? <Text accessible={false} style={styles.separator}>|</Text> : null}
      <Pressable accessibilityRole="button" accessibilityLabel={t("language", option)}
        accessibilityState={{ selected: option === locale }}
        onPress={() => onSelect ? onSelect(option, url) : selectLocale(option)} style={styles.option}>
        <Text style={[styles.label, option === locale && styles.active]}>{option.toUpperCase()}</Text>
      </Pressable>
    </Fragment>)}
  </View>;
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", alignItems: "center", flexShrink: 0 },
  option: { minWidth: 44, minHeight: 48, alignItems: "center", justifyContent: "center" },
  separator: { color: "#c2d0c7" },
  label: { color: "#e0e8e0", fontSize: 14, fontWeight: "400" },
  active: { color: fauna.gold, fontWeight: "600", textDecorationLine: "underline" },
});
