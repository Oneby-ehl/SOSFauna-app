import { Link, Stack } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { SeoHead, useInformationPagePath } from "@/components/i18n/InformationPageSupport";
import { useI18n } from "@/i18n/I18nProvider";

const storageUses = [
  "storageRecover",
  "storageHistory",
  "storageRemember",
  "storageTemporary",
] as const;

export default function PrivacyPage() {
  const { t, locale } = useI18n();
  const pagePath = useInformationPagePath();
  return (
    <>
      <SeoHead
        title="Política de privacidad | SOS Fauna España"
        description="Consulta cómo SOS Fauna España gestiona los permisos, el almacenamiento local y la información utilizada en la aplicación web y Android."
        path="/privacy"
      />
      <Stack.Screen
        options={{ title: locale === "en" ? `${t("navigation", "privacy")} | SOS Fauna España` : "Política de privacidad | SOS Fauna España" }}
      />

      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.container}
      >
        <View style={styles.header}>
          <Text style={styles.eyebrow}>{t("common", "brandEyebrow")}</Text>
          <Text style={styles.title}>{t("navigation", "privacy")}</Text>
          <Text style={styles.updated}>
            {t("common", "informationUpdated")}
          </Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.heading}>{t("privacy", "heading1")}</Text>

          <Text style={styles.paragraph}>
            {t("privacy", "paragraph1")}
          </Text>

          <Text style={styles.paragraph}>
            {t("privacy", "paragraph2")}
          </Text>

          <Text style={styles.heading}>{t("privacy", "heading2")}</Text>

          <Text style={styles.paragraph}>
            {t("privacy", "paragraph3")}
          </Text>

          <Text style={styles.paragraph}>
            {t("privacy", "paragraph4")}
          </Text>

          <Text style={styles.paragraph}>
            {t("privacy", "paragraph5")}
          </Text>

          <Text style={styles.heading}>{t("privacy", "heading3")}</Text>

          <Text style={styles.paragraph}>
            {t("privacy", "paragraph6")}
          </Text>

          <Text style={styles.paragraph}>
            {t("privacy", "paragraph7")}
          </Text>

          <Text style={styles.paragraph}>
            {t("privacy", "paragraph8")}
          </Text>

          <Text style={styles.heading}>{t("privacy", "heading4")}</Text>

          <Text style={styles.paragraph}>
            {t("privacy", "paragraph9")}
          </Text>

          <Text style={styles.paragraph}>
            {t("privacy", "paragraph10")}
          </Text>

          <View style={styles.list}>
            {storageUses.map((item) => (
              <View key={item} style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.listText}>{t("privacy", item)}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.paragraph}>
            {t("privacy", "paragraph11")}
          </Text>

          <Text style={styles.heading}>
            {t("privacy", "heading5")}
          </Text>

          <Text style={styles.paragraph}>
            {t("privacy", "paragraph12")}
          </Text>

          <Text style={styles.paragraph}>
            {t("privacy", "paragraph13")}
          </Text>

          <Text style={styles.paragraph}>
            {t("privacy", "paragraph14")}
          </Text>

          <Text style={styles.heading}>{t("privacy", "heading6")}</Text>

          <Text style={styles.paragraph}>
            {t("privacy", "paragraph15")}
          </Text>

          <Text style={styles.paragraph}>
            {t("privacy", "paragraph16")}
          </Text>

          <Text style={styles.heading}>{t("privacy", "heading7")}</Text>

          <Text style={styles.paragraph}>
            {t("privacy", "paragraph17")}
          </Text>

          <Text style={styles.paragraph}>
            {t("privacy", "paragraph18")}
          </Text>

          <Text style={styles.paragraph}>
            {t("privacy", "paragraph19")}
          </Text>

          <Text style={styles.paragraph}>
            {t("privacy", "paragraph20")}
          </Text>

          <Text style={styles.heading}>{t("privacy", "heading8")}</Text>

          <Text style={styles.paragraph}>
            {t("privacy", "paragraph21")}
          </Text>

          <Text style={styles.heading}>{t("privacy", "heading9")}</Text>

          <Text style={styles.paragraph}>
            {t("privacy", "paragraph22")}
          </Text>
        </View>

        <Link href={pagePath("home")} asChild>
          <Pressable style={styles.backButton}>
            <Text style={styles.backButtonText}>{t("navigation", "backHome")}</Text>
          </Pressable>
        </Link>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f3f7f4",
  },
  container: {
    width: "100%",
    maxWidth: 960,
    alignSelf: "center",
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 64,
    gap: 28,
  },
  header: {
    gap: 12,
  },
  eyebrow: {
    color: "#166534",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  content: {
    width: "100%",
    maxWidth: 900,
    alignSelf: "center",
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 32,
  },
  title: {
    color: "#14532d",
    fontSize: 38,
    lineHeight: 44,
    fontWeight: "900",
  },
  updated: {
    maxWidth: 760,
    color: "#4b5563",
    fontSize: 17,
    lineHeight: 27,
  },
  heading: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 24,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 25,
    marginBottom: 12,
  },
  list: {
    gap: 8,
    marginBottom: 12,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  bullet: {
    fontSize: 16,
    lineHeight: 25,
  },
  listText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 25,
  },
  backButton: {
    alignSelf: "flex-start",
    backgroundColor: "#14532d",
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "800",
  },
});
