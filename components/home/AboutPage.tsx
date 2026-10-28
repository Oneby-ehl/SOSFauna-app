import SiteFooter, { FooterPageContent } from "@/components/web/SiteFooter";
import { InformationStyles, informationWebPart, informationStackOptions } from "./InformationPresentation";
import { Link, Stack } from "expo-router";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { SeoHead, useInformationPagePath } from "@/components/i18n/InformationPageSupport";
import { useI18n } from "@/i18n/I18nProvider";
import { shareSosFaunaApp } from "@/utils/rescueShareMessage";

const principles = ["principleCalm", "principleClarity", "principleCaution", "principleAction"] as const;

const aboutPageStructuredData = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "Sobre SOS Fauna España",
  url: "https://sosfauna.es/about",
  inLanguage: "es",
  description:
    "SOS Fauna España es un proyecto independiente de orientación para incidencias con fauna silvestre.",
};

export default function AboutPage() {
  const { t, locale } = useI18n();
  const pagePath = useInformationPagePath();
  return (
    <>
      <SeoHead
        title="Sobre SOS Fauna España | Ayuda a la fauna silvestre"
        description="Conoce el objetivo y el funcionamiento de SOS Fauna España, un proyecto independiente de orientación ante incidencias con fauna silvestre."
        path="/about"
        structuredData={aboutPageStructuredData}
      />
      <Stack.Screen options={{ ...informationStackOptions, title: locale === "en" ? t("navigation", "about") : "Sobre SOS Fauna España" }} />

      <InformationStyles />
      <ScrollView
        {...informationWebPart("screen")} style={styles.screen}
        contentContainerStyle={Platform.OS === "web" ? { flexGrow: 1 } : styles.container}
      >
        <FooterPageContent {...informationWebPart("pageContent")} style={styles.container}>
        <View {...informationWebPart("header")} style={styles.header}>
          <Text {...informationWebPart("eyebrow")} style={styles.eyebrow}>{t("common", "brandEyebrow")}</Text>
          <Text accessibilityRole={locale === "en" ? "header" : undefined} aria-level={locale === "en" ? 1 : undefined} {...informationWebPart("title")} style={styles.title}>{t("navigation", "about")}</Text>

          <Text {...informationWebPart("intro")} style={styles.intro}>
            {t("about", "intro1")}
          </Text>

          <Text {...informationWebPart("intro")} style={styles.intro}>
            {t("about", "intro2")}
          </Text>
        </View>

        <View {...informationWebPart("section")} style={styles.section}>
          <Text accessibilityRole="header" aria-level={2} {...informationWebPart("sectionTitle")} style={styles.sectionTitle}>{t("about", "sectionTitle1")}</Text>

          <Text {...informationWebPart("paragraph")} style={styles.paragraph}>
            {t("about", "paragraph1")}
          </Text>

          <Text {...informationWebPart("paragraph")} style={styles.paragraph}>
            {t("about", "paragraph2")}
          </Text>

          <Text {...informationWebPart("paragraph")} style={styles.paragraph}>
            {t("about", "paragraph3")}
          </Text>
        </View>

        <View {...informationWebPart("section")} style={styles.section}>
          <Text accessibilityRole="header" aria-level={2} {...informationWebPart("sectionTitle")} style={styles.sectionTitle}>{t("about", "sectionTitle2")}</Text>

          <Text {...informationWebPart("paragraph")} style={styles.paragraph}>
            {t("about", "paragraph4")}
          </Text>

          <Text {...informationWebPart("paragraph")} style={styles.paragraph}>
            {t("about", "paragraph5")}
          </Text>

          <Text {...informationWebPart("paragraph")} style={styles.paragraph}>
            {t("about", "paragraph6")}
          </Text>

          <View {...informationWebPart("principles")} style={styles.principles}>
            {principles.map((principle) => (
              <View key={principle} {...informationWebPart("principle")} style={styles.principle}>
                <Text {...informationWebPart("principleText")} style={styles.principleText}>{t("about", principle)}</Text>
              </View>
            ))}
          </View>
        </View>

        <View {...informationWebPart("section")} style={styles.section}>
          <Text accessibilityRole="header" aria-level={2} {...informationWebPart("sectionTitle")} style={styles.sectionTitle}><Link href={pagePath("sources")}>{t("about", "text1")}</Link></Text>

          <Text {...informationWebPart("paragraph")} style={styles.paragraph}>
            {t("about", "paragraph7")}
          </Text>

          <Text {...informationWebPart("paragraph")} style={styles.paragraph}>
            {t("about", "paragraph8")}
          </Text>
        </View>

        <View {...informationWebPart("disclaimer")} style={styles.disclaimer}>
          <Text accessibilityRole="header" aria-level={2} {...informationWebPart("disclaimerTitle")} style={styles.disclaimerTitle}>{t("about", "disclaimerTitle1")}</Text>

          <Text {...informationWebPart("disclaimerText")} style={styles.disclaimerText}>
            {t("about", "disclaimerText1")}
          </Text>

          <Text {...informationWebPart("disclaimerText")} style={styles.disclaimerText}>
            {t("about", "disclaimerText2")}
          </Text>

          <Text {...informationWebPart("disclaimerText")} style={styles.disclaimerText}>
            {t("about", "disclaimerText3")}
          </Text>

          <Text {...informationWebPart("disclaimerText")} style={styles.disclaimerText}>
            {t("about", "disclaimerText4")}
          </Text>
        </View>

        <View {...informationWebPart("section")} style={styles.section}>
          <Text accessibilityRole="header" aria-level={2} {...informationWebPart("sectionTitle")} style={styles.sectionTitle}>{t("about", "sectionTitle3")}</Text>

          <Text {...informationWebPart("paragraph")} style={styles.paragraph}>
            {t("about", "paragraph9")}
          </Text>
        </View>

        <View {...informationWebPart("quote")} style={styles.quote}>
          <Text {...informationWebPart("quoteText")} style={styles.quoteText}>
            {t("about", "quoteText1")}
          </Text>
        </View>

        {Platform.OS !== "web" ? <>
        <Pressable {...informationWebPart("shareButton")} style={styles.shareButton} onPress={shareSosFaunaApp}>
          <Text {...informationWebPart("shareButtonText")} style={styles.shareButtonText}>{t("navigation", "shareApp")}</Text>
        </Pressable>

        <Link href={pagePath("home")} asChild>
          <Pressable {...informationWebPart("backButton")} style={styles.backButton}>
            <Text {...informationWebPart("backButtonText")} style={styles.backButtonText}>{t("navigation", "backToBrand")}</Text>
          </Pressable>
        </Link>
        </> : null}
        </FooterPageContent>
        <SiteFooter />
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
  principles: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 2,
  },
  principle: {
    borderWidth: 1,
    borderColor: "#b7dfc0",
    borderRadius: 999,
    backgroundColor: "#eef8f0",
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  principleText: {
    color: "#166534",
    fontSize: 14,
    fontWeight: "800",
  },
  disclaimer: {
    backgroundColor: "#fef3c7",
    borderWidth: 1,
    borderColor: "#f59e0b",
    borderRadius: 16,
    padding: 20,
    gap: 10,
  },
  disclaimerTitle: {
    color: "#92400e",
    fontSize: 18,
    fontWeight: "800",
  },
  disclaimerText: {
    color: "#92400e",
    fontSize: 15,
    lineHeight: 23,
  },
  quote: {
    borderLeftWidth: 4,
    borderLeftColor: "#14532d",
    paddingLeft: 18,
    paddingVertical: 8,
  },
  quoteText: {
    color: "#14532d",
    fontSize: 20,
    lineHeight: 30,
    fontWeight: "800",
  },
  shareButton: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#b7dfc0",
    borderRadius: 14,
    backgroundColor: "#eef8f0",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  shareButtonText: {
    color: "#166534",
    fontSize: 15,
    fontWeight: "800",
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
