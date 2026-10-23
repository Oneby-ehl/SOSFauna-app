import { Link, Stack } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { SeoHead, useInformationPagePath } from "@/components/i18n/InformationPageSupport";
import { useI18n } from "@/i18n/I18nProvider";

const sections = [
  {
    titleKey: "identificationTitle",
    paragraphKeys: [
      "identificationParagraph1",
      "identificationParagraph2",
      "identificationParagraph3",
    ],
  },
  {
    titleKey: "guidanceTitle",
    paragraphKeys: [
      "guidanceParagraph1",
      "guidanceParagraph2",
    ],
  },
  {
    titleKey: "scopeTitle",
    paragraphKeys: [
      "scopeParagraph1",
      "scopeParagraph2",
    ],
  },
  {
    titleKey: "userResponsibilityTitle",
    paragraphKeys: [
      "userResponsibilityParagraph1",
      "userResponsibilityParagraph2",
    ],
  },
  {
    titleKey: "liabilityTitle",
    paragraphKeys: [
      "liabilityParagraph1",
      "liabilityParagraph2",
      "liabilityParagraph3",
    ],
  },
  {
    titleKey: "intellectualPropertyTitle",
    paragraphKeys: [
      "intellectualPropertyParagraph1",
      "intellectualPropertyParagraph2",
    ],
  },
  {
    titleKey: "externalLinksTitle",
    paragraphKeys: [
      "externalLinksParagraph1",
      "externalLinksParagraph2",
    ],
  },
  {
    titleKey: "updatesTitle",
    paragraphKeys: [
      "updatesParagraph1",
      "updatesParagraph2",
    ],
  },
  {
    titleKey: "beforeCollectingTitle",
    paragraphKeys: [
      "beforeCollectingParagraph1",
      "beforeCollectingParagraph2",
    ],
    highlightedParagraphKey:
      "beforeCollectingHighlight",
  },
  {
    titleKey: "contactTitle",
    paragraphKeys: [
      "contactParagraph1",
    ],
  },
] as const;

export default function LegalPage() {
  const { t, locale } = useI18n();
  const pagePath = useInformationPagePath();
  return (
    <>
      <SeoHead
        title="Aviso legal | SOS Fauna España"
        description="Información legal, condiciones de uso y límites de responsabilidad de SOS Fauna España."
        path="/legal"
      />
      <Stack.Screen options={{ title: locale === "en" ? `${t("navigation", "legal")} | SOS Fauna España` : "Aviso legal | SOS Fauna España" }} />

      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.container}
      >
        <View style={styles.header}>
          <Text style={styles.eyebrow}>{t("common", "brandEyebrow")}</Text>
          <Text style={styles.title}>{t("navigation", "legal")}</Text>
          <Text style={styles.updated}>{t("common", "informationUpdated")}</Text>
        </View>

        {sections.map((section) => (
          <View key={section.titleKey} style={styles.section}>
            <Text style={styles.sectionTitle}>{t("legal", section.titleKey)}</Text>
            {section.paragraphKeys.map((paragraph) => (
              <Text key={paragraph} style={styles.paragraph}>
                {t("legal", paragraph)}
              </Text>
            ))}
            {"highlightedParagraphKey" in section ? (
              <Text style={styles.highlightedParagraph}>
                {t("legal", section.highlightedParagraphKey)}
              </Text>
            ) : null}
          </View>
        ))}

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
  section: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#dbe7dd",
    borderRadius: 16,
    padding: 20,
    gap: 10,
  },
  sectionTitle: {
    color: "#14532d",
    fontSize: 20,
    fontWeight: "900",
  },
  paragraph: {
    color: "#374151",
    fontSize: 15,
    lineHeight: 23,
  },
  highlightedParagraph: {
    color: "#374151",
    fontSize: 15,
    fontWeight: "800",
    lineHeight: 23,
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
