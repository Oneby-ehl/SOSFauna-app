import SiteFooter, { FooterPageContent } from "@/components/web/SiteFooter";
import { InformationStyles, informationWebPart, informationStackOptions } from "./InformationPresentation";
import { Link, Stack } from "expo-router";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

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
        options={{ ...informationStackOptions, title: locale === "en" ? `${t("navigation", "privacy")} | SOS Fauna España` : "Política de privacidad | SOS Fauna España" }}
      />

      <InformationStyles />
      <ScrollView
        {...informationWebPart("screen")} style={styles.screen}
        contentContainerStyle={Platform.OS === "web" ? { flexGrow: 1 } : styles.container}
      >
        <FooterPageContent {...informationWebPart("pageContent")} style={styles.container}>
        <View {...informationWebPart("header")} style={styles.header}>
          <Text {...informationWebPart("eyebrow")} style={styles.eyebrow}>{t("common", "brandEyebrow")}</Text>
          <Text accessibilityRole={locale === "en" ? "header" : undefined} aria-level={locale === "en" ? 1 : undefined} {...informationWebPart("title")} style={styles.title}>{t("navigation", "privacy")}</Text>
          <Text {...informationWebPart("updated")} style={styles.updated}>
            {t("common", "informationUpdated")}
          </Text>
        </View>

        <View {...informationWebPart("content")} style={styles.content}>
          <Text accessibilityRole={locale === "en" ? "header" : undefined} aria-level={locale === "en" ? 2 : undefined} {...informationWebPart("heading")} style={styles.heading}>{t("privacy", "heading1")}</Text>

          <Text {...informationWebPart("paragraph")} style={styles.paragraph}>
            {t("privacy", "paragraph1")}
          </Text>

          <Text {...informationWebPart("paragraph")} style={styles.paragraph}>
            {t("privacy", "paragraph2")}
          </Text>

          <Text accessibilityRole={locale === "en" ? "header" : undefined} aria-level={locale === "en" ? 2 : undefined} {...informationWebPart("heading")} style={styles.heading}>{t("privacy", "heading2")}</Text>

          <Text {...informationWebPart("paragraph")} style={styles.paragraph}>
            {t("privacy", "paragraph3")}
          </Text>

          <Text {...informationWebPart("paragraph")} style={styles.paragraph}>
            {t("privacy", "paragraph4")}
          </Text>

          <Text {...informationWebPart("paragraph")} style={styles.paragraph}>
            {t("privacy", "paragraph5")}
          </Text>

          <Text accessibilityRole={locale === "en" ? "header" : undefined} aria-level={locale === "en" ? 2 : undefined} {...informationWebPart("heading")} style={styles.heading}>{t("privacy", "heading3")}</Text>

          <Text {...informationWebPart("paragraph")} style={styles.paragraph}>
            {t("privacy", "paragraph6")}
          </Text>

          <Text {...informationWebPart("paragraph")} style={styles.paragraph}>
            {t("privacy", "paragraph7")}
          </Text>

          <Text {...informationWebPart("paragraph")} style={styles.paragraph}>
            {t("privacy", "paragraph8")}
          </Text>

          <Text accessibilityRole={locale === "en" ? "header" : undefined} aria-level={locale === "en" ? 2 : undefined} {...informationWebPart("heading")} style={styles.heading}>{t("privacy", "heading4")}</Text>

          <Text {...informationWebPart("paragraph")} style={styles.paragraph}>
            {t("privacy", "paragraph9")}
          </Text>

          <Text {...informationWebPart("paragraph")} style={styles.paragraph}>
            {t("privacy", "paragraph10")}
          </Text>

          <View {...informationWebPart("list")} style={styles.list}>
            {storageUses.map((item) => (
              <View key={item} {...informationWebPart("listItem")} style={styles.listItem}>
                <Text {...informationWebPart("bullet")} style={styles.bullet}>•</Text>
                <Text {...informationWebPart("listText")} style={styles.listText}>{t("privacy", item)}</Text>
              </View>
            ))}
          </View>

          <Text {...informationWebPart("paragraph")} style={styles.paragraph}>
            {t("privacy", "paragraph11")}
          </Text>

          <Text accessibilityRole={locale === "en" ? "header" : undefined} aria-level={locale === "en" ? 2 : undefined} {...informationWebPart("heading")} style={styles.heading}>
            {t("privacy", "heading5")}
          </Text>

          <Text {...informationWebPart("paragraph")} style={styles.paragraph}>
            {t("privacy", "paragraph12")}
          </Text>

          <Text {...informationWebPart("paragraph")} style={styles.paragraph}>
            {t("privacy", "paragraph13")}
          </Text>

          <Text {...informationWebPart("paragraph")} style={styles.paragraph}>
            {t("privacy", "paragraph14")}
          </Text>

          <Text accessibilityRole={locale === "en" ? "header" : undefined} aria-level={locale === "en" ? 2 : undefined} {...informationWebPart("heading")} style={styles.heading}>{t("privacy", "heading6")}</Text>

          <Text {...informationWebPart("paragraph")} style={styles.paragraph}>
            {t("privacy", "paragraph15")}
          </Text>

          <Text {...informationWebPart("paragraph")} style={styles.paragraph}>
            {t("privacy", "paragraph16")}
          </Text>

          <Text accessibilityRole={locale === "en" ? "header" : undefined} aria-level={locale === "en" ? 2 : undefined} {...informationWebPart("heading")} style={styles.heading}>{t("privacy", "heading7")}</Text>

          <Text {...informationWebPart("paragraph")} style={styles.paragraph}>
            {t("privacy", "paragraph17")}
          </Text>

          <Text {...informationWebPart("paragraph")} style={styles.paragraph}>
            {t("privacy", "paragraph18")}
          </Text>

          <Text {...informationWebPart("paragraph")} style={styles.paragraph}>
            {t("privacy", "paragraph19")}
          </Text>

          <Text {...informationWebPart("paragraph")} style={styles.paragraph}>
            {t("privacy", "paragraph20")}
          </Text>

          <Text accessibilityRole={locale === "en" ? "header" : undefined} aria-level={locale === "en" ? 2 : undefined} {...informationWebPart("heading")} style={styles.heading}>{t("privacy", "heading8")}</Text>

          <Text {...informationWebPart("paragraph")} style={styles.paragraph}>
            {t("privacy", "paragraph21")}
          </Text>

          <Text accessibilityRole={locale === "en" ? "header" : undefined} aria-level={locale === "en" ? 2 : undefined} {...informationWebPart("heading")} style={styles.heading}>{t("privacy", "heading9")}</Text>

          <Text {...informationWebPart("paragraph")} style={styles.paragraph}>
            {t("privacy", "paragraph22")}
          </Text>
        </View>

        {Platform.OS !== "web" ? <Link href={pagePath("home")} asChild>
          <Pressable {...informationWebPart("backButton")} style={styles.backButton}>
            <Text {...informationWebPart("backButtonText")} style={styles.backButtonText}>{t("navigation", "backHome")}</Text>
          </Pressable>
        </Link> : null}
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
