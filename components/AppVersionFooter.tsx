import Constants from "expo-constants";
import { Platform, StyleSheet, Text } from "react-native";
import { useI18n } from "@/i18n/I18nProvider";

function getPlatformName(): string {
  return Platform.select({
    ios: "iOS",
    android: "Android",
    web: "Web",
    default: Platform.OS,
  });
}

export function getAppVersion(): string {
  return Constants.expoConfig?.version ?? "desconocida";
}

export default function AppVersionFooter() {
  const { t } = useI18n();
  return (
    <>
      <Text style={styles.text}>
        {getPlatformName()}{t("versionFooter", "versionSeparator")}{getAppVersion()}
      </Text>
      <Text style={styles.text}>{t("versionFooter", "copyright")}</Text>
    </>
  );
}

const styles = StyleSheet.create({
  text: {
    color: "#7a877f",
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
  },
});
