import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getAppVersion } from "./AppVersionFooter";
import { useI18n } from "@/i18n/I18nProvider";
import { fauna } from "@/constants/androidPresentation";

export default function AndroidFooter({ safeBottom = false }: { safeBottom?: boolean } = {}) {
  const { t } = useI18n();
  const insets = useSafeAreaInsets();
  return <View style={styles.slot}>
    <View style={[styles.footer, { paddingBottom: 20 + (safeBottom ? insets.bottom : 0) }]}>
      <Text style={styles.brand}>{t("common", "brandEyebrow")}</Text>
      <Text style={styles.description}>{t("home", "footerDescription")}</Text>
      <Text style={styles.description}>{t("landingEditorial", "freeService")}</Text>
      <Text style={styles.independence}>{t("helpContactDescriptions", "independenceNotice")}</Text>
      <View style={styles.meta}>
        <Text style={styles.version}>{t("versionFooter", "copyright")}</Text>
        <Text style={styles.version}>{t("versionFooter", "versionSeparator").replace(/^[\s·]+/u, "")}{getAppVersion()}</Text>
      </View>
    </View>
  </View>;
}

const styles = StyleSheet.create({
  slot: { alignSelf: "stretch", marginTop: "auto", paddingTop: 24, flexShrink: 0 },
  footer: { alignSelf: "stretch", backgroundColor: fauna.forest, paddingHorizontal: 20, paddingTop: 20, gap: 8 },
  brand: { color: fauna.paper, fontSize: 14, lineHeight: 22, fontWeight: "600", letterSpacing: 0.6 },
  description: { color: "#e0e8e0", fontSize: 13, lineHeight: 20 },
  independence: { color: "#c2d0c7", fontSize: 12, lineHeight: 19 },
  meta: { borderTopWidth: 1, borderTopColor: "#ffffff25", paddingTop: 12, marginTop: 4, gap: 2 },
  version: { color: "#c2d0c7", fontSize: 12, lineHeight: 18 },
});
