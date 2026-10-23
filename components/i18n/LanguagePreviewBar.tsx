import { Link, usePathname } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { useI18n } from "@/i18n/I18nProvider";
import { getLocalizedPath, matchLocalizedRoute } from "@/i18n/routes";
import { LanguageSelector } from "./LanguageSelector";

export function LanguagePreviewBar() {
  const pathname = usePathname();
  const { locale, t, languageControlsEnabled } = useI18n();
  if (!languageControlsEnabled || matchLocalizedRoute(pathname) === "home") return null;
  return <View style={styles.bar}>
    {matchLocalizedRoute(pathname) === "guide"
      ? <Text style={styles.brand}>{t("common", "brand")}</Text>
      : <Link href={getLocalizedPath("home", locale)} style={styles.brand}>{t("common", "brand")}</Link>}
    <LanguageSelector url={pathname} />
  </View>;
}
const styles = StyleSheet.create({
  bar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12, paddingHorizontal: 16, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#e5e7eb" },
  brand: { fontSize: 16, color: "#14532d", fontWeight: "700", flexShrink: 1 },
});
