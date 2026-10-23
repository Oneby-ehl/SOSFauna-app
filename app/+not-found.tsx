import { getEffectiveCatalog } from "@/i18n/translate";
import { useI18n } from "@/i18n/I18nProvider";
import { Link, Stack, usePathname } from "expo-router";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { getEnglishDevelopmentPage } from "@/i18n/developmentPreview";

import { SeoHead } from "@/components/seo/SeoHead";

export default function NotFoundPage() {
  const { locale } = useI18n();
  const pathname = usePathname();
  if (__DEV__ && Platform.OS === "web" && getEnglishDevelopmentPage(pathname, "web")) {
    // Keep the preview module behind Metro's development-only branch.
    const EnglishDevelopmentPreview = require("@/components/i18n/EnglishDevelopmentPreview").default;
    return <EnglishDevelopmentPreview />;
  }
  const generalTexts = getEffectiveCatalog(locale);
  return (
    <>
      <SeoHead
        title="Página no encontrada | SOS Fauna España"
        description="La dirección introducida no existe o ya no está disponible."
        robots="noindex, nofollow"
        includeGlobalStructuredData={false}
      />
      <Stack.Screen
        options={{ title: generalTexts.notFoundUi.navigationTitle }}
      />

      <View style={styles.screen}>
        <View style={styles.card}>
          <Text style={styles.eyebrow}>SOS FAUNA ESPAÑA</Text>
          <Text style={styles.code}>404</Text>
          <Text style={styles.title}>{generalTexts.notFoundUi.title}</Text>
          <Text style={styles.message}>{generalTexts.notFoundUi.message}</Text>
          <Text style={styles.secondary}>{generalTexts.notFoundUi.secondary}</Text>

          <Link href="/" asChild>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={generalTexts.notFoundUi.homeAccessibility}
              style={styles.button}
            >
              <Text style={styles.buttonText}>{generalTexts.notFoundUi.homeButton}</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    minHeight: "100%",
    backgroundColor: "#f3f7f4",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  card: {
    width: "100%",
    maxWidth: 560,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#dbe7dd",
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 28,
    gap: 12,
    alignItems: "flex-start",
  },
  eyebrow: {
    color: "#166534",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  code: {
    color: "#6b7280",
    fontSize: 14,
    fontWeight: "800",
  },
  title: {
    color: "#14532d",
    fontSize: 34,
    fontWeight: "900",
    lineHeight: 40,
  },
  message: {
    color: "#374151",
    fontSize: 17,
    lineHeight: 26,
  },
  secondary: {
    color: "#4b5563",
    fontSize: 15,
    lineHeight: 23,
  },
  button: {
    minHeight: 44,
    marginTop: 6,
    backgroundColor: "#14532d",
    borderRadius: 14,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "800",
  },
});
