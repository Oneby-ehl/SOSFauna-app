import { Link, Stack } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { SeoHead, useInformationPagePath } from "@/components/i18n/InformationPageSupport";
import { useI18n } from "@/i18n/I18nProvider";

const contactPageStructuredData = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contacto - SOS Fauna España",
  url: "https://sosfauna.es/contact",
  inLanguage: "es",
  description:
    "Página de contacto de SOS Fauna España para comunicar errores, sugerencias o consultas relacionadas con el funcionamiento del proyecto.",
  significantLink: [
    "mailto:contacto@sosfauna.es",
    "mailto:privacidad@sosfauna.es",
  ],
};

export default function ContactPage() {
  const { t, locale } = useI18n();
  const pagePath = useInformationPagePath();
  return (
    <>
      <SeoHead
        title="Contacto | SOS Fauna España"
        description="Contacta con SOS Fauna España para comunicar errores, sugerencias o consultas relacionadas con el funcionamiento del proyecto."
        path="/contact"
        structuredData={contactPageStructuredData}
      />
      <Stack.Screen options={{ title: locale === "en" ? `${t("navigation", "contact")} | SOS Fauna España` : "Contacto | SOS Fauna España" }} />

      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.container}
      >
        <View style={styles.header}>
          <Text style={styles.eyebrow}>{t("common", "brandEyebrow")}</Text>
          <Text accessibilityRole={locale === "en" ? "header" : undefined} aria-level={locale === "en" ? 1 : undefined} style={styles.title}>{t("navigation", "contact")}</Text>

          <Text style={styles.intro}>
            {t("contact", "intro1")}
          </Text>
        </View>

        <View style={styles.section}>
          <Text accessibilityRole={locale === "en" ? "header" : undefined} aria-level={locale === "en" ? 2 : undefined} style={styles.sectionTitle}>{t("contact", "sectionTitle1")}</Text>

          <Text style={styles.paragraph}>{t("contact", "paragraph1")}</Text>

          <View style={styles.list}>
            <Text style={styles.listItem}>{"\u2022"}{t("contact", "listItem1")}</Text>
            <Text style={styles.listItem}>{"\u2022"}{t("contact", "listItem2")}</Text>
            <Text style={styles.listItem}>{"\u2022"}{t("contact", "listItem3")}</Text>
            <Text style={styles.listItem}>{"\u2022"}{t("contact", "listItem4")}</Text>
          </View>

          <Link href="mailto:contacto@sosfauna.es" asChild>
            <Pressable style={styles.mailButton}>
              <Text style={styles.mailButtonText}>contacto@sosfauna.es</Text>
            </Pressable>
          </Link>
        </View>

        <View style={styles.section}>
          <Text accessibilityRole={locale === "en" ? "header" : undefined} aria-level={locale === "en" ? 2 : undefined} style={styles.sectionTitle}>{t("contact", "sectionTitle2")}</Text>

          <Text style={styles.paragraph}>
            {t("contact", "paragraph2")}
          </Text>

          <Link href="mailto:privacidad@sosfauna.es" asChild>
            <Pressable style={styles.mailButton}>
              <Text style={styles.mailButtonText}>privacidad@sosfauna.es</Text>
            </Pressable>
          </Link>
        </View>

        <View style={styles.notice}>
          <Text accessibilityRole={locale === "en" ? "header" : undefined} aria-level={locale === "en" ? 2 : undefined} style={styles.noticeTitle}>
            {t("contact", "noticeTitle1")}
          </Text>

          <Text style={styles.noticeText}>
            {t("contact", "noticeText1")}
          </Text>
        </View>

        <Link href={pagePath("home")} asChild>
          <Pressable style={styles.backButton}>
            <Text style={styles.backButtonText}>{t("navigation", "backToBrand")}</Text>
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
  intro: {
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
  list: {
    gap: 6,
  },
  listItem: {
    color: "#374151",
    fontSize: 15,
    lineHeight: 23,
  },
  mailButton: {
    alignSelf: "flex-start",
    marginTop: 4,
    borderRadius: 10,
    backgroundColor: "#e7f5ea",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  mailButtonText: {
    color: "#166534",
    fontSize: 15,
    fontWeight: "800",
  },
  notice: {
    backgroundColor: "#fff8df",
    borderWidth: 1,
    borderColor: "#ead897",
    borderRadius: 16,
    padding: 20,
    gap: 10,
  },
  noticeTitle: {
    color: "#6f5610",
    fontSize: 18,
    fontWeight: "800",
  },
  noticeText: {
    color: "#665925",
    fontSize: 15,
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
