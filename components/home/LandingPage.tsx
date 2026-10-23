import { Link, Stack, useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import type { RescueCase } from "@/types/rescueCase";
import {
  discardCurrentCase,
  recoverCurrentCase,
} from "@/services/rescueCaseService";
import AppVersionFooter from "@/components/AppVersionFooter";
import { SeoHead, useInformationPagePath } from "@/components/i18n/InformationPageSupport";
import { LanguageSelector } from "@/components/i18n/LanguageSelector";
import { getHistory } from "@/services/rescueStorage";
import { shareSosFaunaApp } from "@/utils/rescueShareMessage";
import { useI18n } from "@/i18n/I18nProvider";
import {
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type AnimalScopeGroupProps = {
  icon: string;
  label: string;
};

function AnimalScopeGroup({ icon, label }: AnimalScopeGroupProps) {
  return (
    <View style={styles.animalScopeGroup}>
      <Text style={styles.animalScopeIcon}>{icon}</Text>
      <Text style={styles.animalScopeLabel}>{label}</Text>
    </View>
  );
}

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

type LandingDataState = "checking" | "ready" | "failed";

const LANDING_DATA_TIMEOUT_MS = 4000;
const GOOGLE_PLAY_APP_URL =
  "https://play.google.com/store/apps/details?id=com.onebyehl.sosfauna";
const GOOGLE_PLAY_BADGE_SRC = "/google-play-badge-es.png";

const homePageStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "SOS Fauna España",
  url: "https://sosfauna.es/",
  primaryImageOfPage: "https://sosfauna.es/search-preview.png",
  image: "https://sosfauna.es/search-preview.png",
  inLanguage: "es",
  isPartOf: {
    "@type": "WebSite",
    name: "SOS Fauna España",
    url: "https://sosfauna.es/",
  },
  description:
    "SOS Fauna España ofrece orientación paso a paso si encuentras fauna silvestre herida, atrapada, debilitada, varada o en peligro.",
};

function withTimeout<T>(promise: Promise<T>, timeoutMs: number) {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => {
        reject(new Error("Landing data check timed out."));
      }, timeoutMs);
    }),
  ]);
}

export default function LandingPage() {
  const { t, locale, languageControlsEnabled } = useI18n();
  const pagePath = useInformationPagePath();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [hydrated, setHydrated] = useState(false);
  const isCompact = !hydrated || width < 760;
  const [pendingCase, setPendingCase] = useState<RescueCase | null>(null);
  const [hasHistory, setHasHistory] = useState(false);
  const [landingDataState, setLandingDataState] =
    useState<LandingDataState>("checking");
  const checkingCase = landingDataState === "checking";
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (Platform.OS !== "web" || typeof window === "undefined") return;

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setInstallPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const refreshLandingData = useCallback(async () => {
    try {
      setLandingDataState("checking");

      const [currentCase, history] = await withTimeout(
        Promise.all([recoverCurrentCase(), getHistory()]),
        LANDING_DATA_TIMEOUT_MS,
      );

      setPendingCase(currentCase);
      setHasHistory(history.length > 0);
      setLandingDataState("ready");
    } catch {
      setLandingDataState("failed");
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void refreshLandingData();
    }, [refreshLandingData]),
  );

  const openNewCase = async () => {
    await discardCurrentCase();
    setPendingCase(null);
    router.push({ pathname: pagePath("guide"), params: { mode: "new" } });
  };

  const openNewCaseWithoutDiscardingStoredCase = () => {
    router.push({ pathname: pagePath("guide"), params: { mode: "new" } });
  };

  const handleStartNewCase = () => {
    if (landingDataState === "failed" && !pendingCase) {
      openNewCaseWithoutDiscardingStoredCase();
      return;
    }

    if (!pendingCase) {
      void openNewCase();
      return;
    }

    const message = t("home", "pendingCaseConfirmation");

    if (Platform.OS === "web") {
      if (window.confirm(message)) void openNewCase();
      return;
    }

    Alert.alert(t("home", "pendingCaseTitle"), message, [
      { text: t("common", "cancel"), style: "cancel" },
      {
        text: t("home", "discardAndStart"),
        style: "destructive",
        onPress: () => void openNewCase(),
      },
    ]);
  };

  const handleContinueCase = () => {
    router.push({ pathname: pagePath("guide"), params: { mode: "continue" } });
  };

  const handleOpenHistory = () => {
    router.push("/history");
  };

  const handleOpenFaq = () => {
    router.push(pagePath("faq"));
  };

  const handleOpenRecoveryCenters = () => {
    router.push(pagePath("centers"));
  };

  const handleInstallApp = async () => {
    if (!installPrompt) return;

    await installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
  };

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.screenContent}
        showsVerticalScrollIndicator
      >
        <SeoHead
          title="SOS Fauna España | Qué hacer ante fauna silvestre herida o varada"
          description="SOS Fauna España te orienta paso a paso si encuentras fauna silvestre herida, atrapada, debilitada, varada o en peligro, terrestre o marina."
          path="/"
          structuredData={homePageStructuredData}
        />
        <Stack.Screen
          options={{
            title:
              locale === "en" ? t("common", "brand") : "SOS Fauna España | Qué hacer ante fauna silvestre herida o varada",
          }}
        />

      <View style={styles.header}>
        <View style={styles.headerInner}>
          <Link href={pagePath("home")}>
            <Text style={styles.brand}>{t("common", "brand")}</Text>
          </Link>

          {languageControlsEnabled ? <LanguageSelector /> : <Pressable
            style={styles.headerButton}
            onPress={handleStartNewCase}
            disabled={checkingCase}
          >
            <Text style={styles.headerButtonText}>{t("navigation", "guide")}</Text>
          </Pressable>}
        </View>
      </View>

      <View style={[styles.main, isCompact && styles.mainCompact]}>
        <View style={[styles.hero, isCompact && styles.heroCompact]}>
          <View style={[styles.heroContent, isCompact && styles.heroContentCompact]}>
            <Text style={styles.badge}>{t("home", "badge")}</Text>

            <Text
              accessibilityRole="header"
              aria-level={1}
              style={[styles.heroTitle, isCompact && styles.heroTitleCompact]}
            >
              {t("home", "heroTitle")}
            </Text>

            <Text style={styles.heroDescription}>
              {t("home", "heroDescription")}
            </Text>

            {!isCompact ? (
            <View style={styles.heroGuidance}>
              <Text style={styles.heroGuidanceTitle}>{t("home", "calmTitle")}</Text>
              <Text style={styles.heroGuidanceText}>
                {t("home", "calmDesktop")}
              </Text>
            </View>
            ) : null}

          </View>

          <View style={[styles.heroPanel, isCompact && styles.heroPanelCompact]}>
            <View
              style={[
                styles.heroOwlGroup,
                isCompact && styles.heroOwlGroupCompact,
              ]}
            >
              <Text style={[styles.heroPanelIcon, isCompact && styles.heroPanelIconCompact]}>🦉</Text>
              <View style={styles.owlBase}>
                <Text style={styles.owlBaseText}>🌿</Text>
                <View style={styles.owlStone} />
                <Text style={styles.owlBaseText}>🍃</Text>
              </View>
            </View>

            <View style={[styles.heroActions, isCompact && styles.heroActionsCompact]}>
              <Pressable
                style={[
                  styles.caseButton,
                  isCompact && styles.caseButtonCompact,
                  styles.primaryButton,
                ]}
                onPress={handleStartNewCase}
                disabled={checkingCase}
              >
                <Text
                  style={[
                    styles.primaryButtonText,
                    isCompact && styles.caseButtonTextCompact,
                  ]}
                >
                  {checkingCase ? t("home", "checking") : t("navigation", "guide")}
                </Text>
              </Pressable>

              {pendingCase ? (
                <View style={styles.pendingBlock}>
                  <Text style={styles.pendingNote}>
                    {t("home", "pendingCaseNote")}
                  </Text>

                  <Pressable
                    style={[
                      styles.caseButton,
                      isCompact && styles.caseButtonCompact,
                      styles.continueButton,
                    ]}
                    onPress={handleContinueCase}
                  >
                    <Text
                      style={[
                        styles.continueButtonText,
                        isCompact && styles.caseButtonTextCompact,
                      ]}
                    >
                      {t("navigation", "continueCase")}
                    </Text>
                  </Pressable>
                </View>
              ) : null}

              {hasHistory ? (
                <View style={styles.historyBlock}>
                  <Pressable
                    style={[
                      styles.caseButton,
                      isCompact && styles.caseButtonCompact,
                      styles.historyButton,
                    ]}
                    onPress={handleOpenHistory}
                  >
                    <Text
                      style={[
                        styles.historyButtonText,
                        isCompact && styles.caseButtonTextCompact,
                      ]}
                    >
                      {t("navigation", "history")}
                    </Text>
                  </Pressable>
                  <Text style={styles.historyNote}>
                    {t("home", "historyNote")}
                  </Text>
                </View>
              ) : null}

            </View>

            <View
              style={[
                styles.heroPanelBottom,
                isCompact && styles.heroPanelBottomCompact,
              ]}
            >
              <Text style={styles.heroNote}>
                {t("home", "freeAndNoRegistration")}{"\n"}
                {t("home", "territory")}
              </Text>

              <View style={styles.quickAccessBlock}>
                <Pressable
                  accessibilityRole="button"
                  style={[
                    styles.caseButton,
                    isCompact && styles.caseButtonCompact,
                    styles.quickAccessButton,
                    isCompact && styles.quickAccessButtonCompact,
                  ]}
                  onPress={handleOpenFaq}
                >
                  <Text
                    style={[
                      styles.quickAccessButtonText,
                      isCompact && styles.caseButtonTextCompact,
                    ]}
                  >
                    {t("home", "quickFaq")}
                  </Text>
                </Pressable>

                <Pressable
                  accessibilityRole="button"
                  style={[
                    styles.caseButton,
                    isCompact && styles.caseButtonCompact,
                    styles.quickAccessButton,
                    isCompact && styles.quickAccessButtonCompact,
                  ]}
                  onPress={handleOpenRecoveryCenters}
                >
                  <Text
                    style={[
                      styles.quickAccessButtonText,
                      isCompact && styles.caseButtonTextCompact,
                    ]}
                  >
                    {t("home", "quickCenters")}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>

          {isCompact ? (
            <View style={[styles.heroGuidance, styles.heroGuidanceCompact]}>
              <Text style={styles.heroGuidanceTitle}>{t("home", "calmTitle")}</Text>
              <Text style={styles.heroGuidanceText}>
                {t("home", "calmMobile")}
              </Text>
            </View>
          ) : null}
        </View>

        <View style={[styles.section, styles.processSection]}>
          <View style={styles.processIntro}>
            <Text accessibilityRole="header" aria-level={2} style={[styles.sectionTitle, styles.processTitle]}>
              {t("home", "processTitle")}
            </Text>

            <Text style={[styles.sectionDescription, styles.processDescription]}>
              {t("home", "processDescription")}
            </Text>

            <Text style={[styles.sectionDescription, styles.processDescription]}>
              {t("home", "processWarning")}
            </Text>

            <Text
              style={[
                styles.sectionDescription,
                styles.processDescription,
                {
                  fontWeight: "700",
                  color: "#14532d",
                  marginTop: 6,
                },
              ]}
            >
              {t("home", "processConclusion")}
            </Text>
          </View>
        </View>

        <View style={[styles.section, styles.animalScopeSection]}>
          <Text accessibilityRole="header" aria-level={2} style={[styles.sectionTitle, styles.animalScopeTitle]}>
            {t("home", "scopeTitle")}
          </Text>

          <Text style={[styles.sectionDescription, styles.animalScopeText]}>
            {t("home", "scopeDescription")}
          </Text>

          <View style={styles.animalScopeGrid}>
            <AnimalScopeGroup icon="🦉" label={t("home", "birds")} />
            <AnimalScopeGroup icon="🦊" label={t("home", "mammals")} />
            <AnimalScopeGroup icon="🦎" label={t("home", "reptiles")} />
            <AnimalScopeGroup icon="🌊" label={t("home", "marine")} />
          </View>
        </View>

        {installPrompt ? (
          <View style={styles.installSection}>
            <Text style={styles.installTitle}>
              {t("home", "installTitle")}
            </Text>
            <Text style={styles.installText}>
              {t("home", "installText")}
            </Text>
            <Pressable style={styles.installButton} onPress={handleInstallApp}>
              <Text style={styles.installButtonText}>{t("home", "installAction")}</Text>
            </Pressable>
            <Text style={styles.installNote}>
              {t("home", "installNote")}
            </Text>
          </View>
        ) : null}
      </View>

      <View style={styles.footer}>
        <View style={styles.footerInner}>
          <View>
            <Link href={pagePath("home")}>
              <Text style={styles.footerBrand}>{t("common", "brand")}</Text>
            </Link>
            <Text style={styles.footerText}>
              {t("home", "footerDescription")}
            </Text>
            {Platform.OS === "web" ? (
              <Link
                href={GOOGLE_PLAY_APP_URL}
                target="_blank"
                accessibilityLabel={t("home", "googlePlayAccessibility")}
                style={styles.googlePlayBadgeLink}
              >
                {locale === "en" ? <Text style={styles.footerLink}>{t("home", "googlePlayAccessibility")}</Text> : <Image
                  source={{ uri: GOOGLE_PLAY_BADGE_SRC }}
                  resizeMode="contain"
                  style={styles.googlePlayBadge}
                />}
              </Link>
            ) : null}
          </View>

          <View style={styles.footerLinks}>
             <Link href={pagePath("about")}>
               <Text style={styles.footerLink}>{t("navigation", "about")}</Text>
             </Link>

             <Link href={pagePath("faq")}>
               <Text style={styles.footerLink}>{t("navigation", "faq")}</Text>
             </Link>

             <Link href={pagePath("centers")}>
               <Text style={styles.footerLink}>
                 {t("navigation", "centers")}
               </Text>
             </Link>

             <Link href={pagePath("sources")}>
               <Text style={styles.footerLink}>{t("navigation", "sources")}</Text>
             </Link>

             <Link href={pagePath("contact")}>
               <Text style={styles.footerLink}>{t("navigation", "contact")}</Text>
             </Link>

             <Pressable
               accessibilityRole="button"
               onPress={shareSosFaunaApp}
             >
               <Text style={styles.footerLink}>{t("navigation", "shareApp")}</Text>
             </Pressable>

             <View style={styles.footerLegalLinks}>
               <Link href={pagePath("privacy")}>
                 <Text style={styles.footerLink}>{t("navigation", "privacy")}</Text>
               </Link>

               <Link href={pagePath("legal")}>
                 <Text style={styles.footerLink}>{t("navigation", "legal")}</Text>
               </Link>
             </View>
           </View>
        </View>
      </View>

        <View style={styles.versionFooter}>
          <AppVersionFooter />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f4f7f4",
  },
  screenContent: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#dfe7df",
  },
  headerInner: {
    width: "100%",
    maxWidth: 1120,
    minHeight: 72,
    marginHorizontal: "auto",
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  brand: {
    color: "#14532d",
    fontSize: 20,
    fontWeight: "900",
  },
  headerButton: {
    flexShrink: 1,
    backgroundColor: "#14532d",
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 11,
  },
  headerButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "800",
  },
  main: {
    width: "100%",
    maxWidth: 1120,
    marginHorizontal: "auto",
    paddingHorizontal: 24,
    paddingVertical: 42,
    gap: 64,
  },
  mainCompact: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 32,
  },
  hero: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: 28,
  },
  heroCompact: {
    flexDirection: "column",
    alignItems: "stretch",
    gap: 14,
  },
  heroContent: {
    flex: 1.6,
    backgroundColor: "#ffffff",
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#dce8de",
    padding: 40,
    gap: 22,
  },
  heroContentCompact: {
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: "auto",
    width: "100%",
    alignSelf: "stretch",
    backgroundColor: "transparent",
    borderRadius: 0,
    borderWidth: 0,
    padding: 0,
    gap: 12,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#e4f4e7",
    color: "#166534",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 14,
    fontWeight: "800",
  },
  heroTitle: {
    maxWidth: 720,
    color: "#123c24",
    fontSize: 46,
    lineHeight: 54,
    fontWeight: "900",
  },
  heroTitleCompact: {
    fontSize: 34,
    lineHeight: 42,
  },
  heroDescription: {
    maxWidth: 680,
    color: "#3f4d43",
    fontSize: 18,
    lineHeight: 29,
  },
  heroGuidance: {
    maxWidth: 680,
    backgroundColor: "#eef8f0",
    borderWidth: 1,
    borderColor: "#cfe8d4",
    borderRadius: 18,
    padding: 20,
    gap: 9,
  },
  heroGuidanceCompact: {
    maxWidth: "100%",
    padding: 14,
    borderRadius: 14,
    gap: 6,
  },
  heroGuidanceTitle: {
    color: "#14532d",
    fontSize: 20,
    fontWeight: "900",
  },
  heroGuidanceText: {
    color: "#34483a",
    fontSize: 16,
    lineHeight: 25,
  },
  heroActions: {
    width: "100%",
    alignItems: "stretch",
    gap: 12,
  },
  heroActionsCompact: {
    gap: 10,
  },
  caseButton: {
    width: "100%",
    minHeight: 58,
    borderRadius: 14,
    paddingHorizontal: 28,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  caseButtonCompact: {
    minHeight: 46,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  caseButtonTextCompact: {
    fontSize: 15,
  },
  primaryButton: {
    backgroundColor: "#14532d",
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "900",
  },
  continueButton: {
    backgroundColor: "#e4f4e7",
    borderWidth: 1,
    borderColor: "#86c995",
  },
  continueButtonText: {
    color: "#14532d",
    fontSize: 17,
    fontWeight: "900",
  },
  historyButton: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#9ab7a0",
  },
  historyButtonText: {
    color: "#14532d",
    fontSize: 17,
    fontWeight: "900",
  },
  quickAccessBlock: {
    gap: 10,
  },
  quickAccessButton: {
    minHeight: 50,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#9ab7a0",
    paddingVertical: 12,
  },
  quickAccessButtonCompact: {
    minHeight: 44,
    paddingVertical: 9,
  },
  quickAccessButtonText: {
    color: "#14532d",
    fontSize: 16,
    fontWeight: "900",
    textAlign: "center",
  },
  pendingBlock: {
    gap: 10,
  },
  historyBlock: {
    gap: 8,
  },
  historyNote: {
    color: "#5f6c63",
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
  },
  pendingNote: {
    color: "#166534",
    fontSize: 13,
    lineHeight: 20,
    fontWeight: "700",
  },
  heroNote: {
    color: "#4f5d54",
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
  },
  heroPanelBottom: {
    width: "100%",
    marginTop: "auto",
    gap: 10,
  },
  heroPanelBottomCompact: {
    gap: 10,
  },
  heroPanel: {
    flex: 0.75,
    minWidth: 280,
    backgroundColor: "#dfeee2",
    borderRadius: 28,
    padding: 28,
    justifyContent: "flex-start",
    gap: 16,
  },
  heroPanelCompact: {
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: "auto",
    minWidth: 0,
    width: "100%",
    alignSelf: "stretch",
    padding: 18,
    borderRadius: 18,
    gap: 10,
  },
  heroPanelIcon: {
    fontSize: 48,
  },
  heroPanelIconCompact: {
    fontSize: 34,
  },
  heroOwlGroup: {
    alignSelf: "flex-start",
    alignItems: "center",
    marginTop: -24,
    marginBottom: 4,
  },
  heroOwlGroupCompact: {
    marginTop: -10,
    marginBottom: 0,
  },
  owlBase: {
    marginTop: -4,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    gap: 4,
  },
  owlBaseText: {
    fontSize: 15,
    lineHeight: 17,
  },
  owlStone: {
    width: 28,
    height: 8,
    borderRadius: 999,
    backgroundColor: "#b8c8b2",
  },
  installSection: {
    width: "100%",
    maxWidth: 760,
    alignSelf: "center",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 24,
    paddingVertical: 4,
  },
  installTitle: {
    color: "#14532d",
    fontSize: 20,
    lineHeight: 27,
    fontWeight: "900",
    textAlign: "center",
  },
  installText: {
    color: "#526158",
    fontSize: 15,
    lineHeight: 23,
    textAlign: "center",
  },
  installButton: {
    backgroundColor: "#14532d",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  installButtonText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "800",
  },
  installNote: {
    maxWidth: 560,
    color: "#647066",
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
  },
  section: {
    gap: 24,
  },
  sectionEyebrow: {
    color: "#2f7a48",
    fontSize: 14,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  sectionTitle: {
    maxWidth: 760,
    color: "#183d28",
    fontSize: 32,
    lineHeight: 40,
    fontWeight: "900",
  },
  sectionDescription: {
    maxWidth: 660,
    color: "#536158",
    fontSize: 17,
    lineHeight: 27,
  },
  animalScopeSection: {
    backgroundColor: "#ffffff",
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#dfe7df",
    paddingHorizontal: 30,
    paddingTop: 26,
    paddingBottom: 22,
    gap: 15,
  },
  animalScopeTitle: {
    maxWidth: "100%",
    textAlign: "center",
  },
  animalScopeText: {
    maxWidth: "100%",
    textAlign: "center",
  },
  animalScopeGrid: {
    width: "100%",
    maxWidth: 760,
    alignSelf: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  animalScopeGroup: {
    flex: 1,
    minWidth: 180,
    alignItems: "center",
    gap: 6,
    paddingVertical: 4,
  },
  animalScopeIcon: {
    fontSize: 34,
    lineHeight: 41,
  },
  animalScopeLabel: {
    color: "#183d28",
    fontSize: 17,
    lineHeight: 23,
    fontWeight: "900",
    textAlign: "center",
  },
  versionFooter: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 24,
  },
  processSection: {
    backgroundColor: "#ffffff",
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#dfe7df",
    padding: 34,
  },
  processIntro: {
    width: "100%",
    maxWidth: "100%",
    gap: 14,
  },
  processTitle: {
    maxWidth: 880,
  },
  processDescription: {
    maxWidth: 860,
  },
  steps: {
    width: "100%",
    maxWidth: "100%",
    gap: 22,
  },
  step: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 18,
  },
  stepNumber: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#14532d",
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumberText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "900",
  },
  stepContent: {
    flex: 1,
    gap: 5,
  },
  stepTitle: {
    color: "#183d28",
    fontSize: 18,
    fontWeight: "900",
  },
  stepDescription: {
    color: "#5f6c63",
    fontSize: 15,
    lineHeight: 23,
  },
  footer: {
    backgroundColor: "#123c24",
    marginTop: 16,
  },
  footerInner: {
    width: "100%",
    maxWidth: 1120,
    marginHorizontal: "auto",
    paddingHorizontal: 24,
    paddingVertical: 34,
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 28,
  },
  footerBrand: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 8,
  },
  footerText: {
    color: "#d7e5da",
    fontSize: 14,
    lineHeight: 21,
  },
  googlePlayBadgeLink: {
    alignSelf: "flex-start",
    marginTop: 12,
  },
  googlePlayBadge: {
    width: 155,
    height: 60,
  },
  footerLinks: {
    gap: 10,
  },
  footerLegalLinks: {
    borderTopWidth: 1,
    borderTopColor: "rgba(226, 238, 228, 0.22)",
    gap: 10,
    paddingTop: 12,
  },
  footerLink: {
    color: "#e2eee4",
    fontSize: 14,
  },
});
