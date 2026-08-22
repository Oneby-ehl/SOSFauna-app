import { Link, Stack, useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import type { RescueCase } from "@/types/rescueCase";
import {
  discardCurrentCase,
  recoverCurrentCase,
} from "@/services/rescueCaseService";
import AppVersionFooter from "@/components/AppVersionFooter";
import { SeoHead } from "@/components/seo/SeoHead";
import { getHistory } from "@/services/rescueStorage";
import { shareSosFaunaApp } from "@/utils/rescueShareMessage";
import {
  Alert,
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

const homePageStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "SOS Fauna España",
  url: "https://sosfauna.es/",
  inLanguage: "es",
  isPartOf: {
    "@type": "WebSite",
    name: "SOS Fauna España",
    url: "https://sosfauna.es/",
  },
  description:
    "SOS Fauna España ofrece orientación paso a paso para actuar cuando encuentras un animal silvestre herido, atrapado, desorientado o que puede necesitar ayuda.",
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
    router.push({ pathname: "/aviso", params: { mode: "new" } });
  };

  const openNewCaseWithoutDiscardingStoredCase = () => {
    router.push({ pathname: "/aviso", params: { mode: "new" } });
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

    const message =
      "Hay un aviso sin finalizar.\n\n¿Deseas eliminarlo y comenzar uno nuevo?";

    if (Platform.OS === "web") {
      if (window.confirm(message)) void openNewCase();
      return;
    }

    Alert.alert("Aviso sin finalizar", message, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar y comenzar",
        style: "destructive",
        onPress: () => void openNewCase(),
      },
    ]);
  };

  const handleContinueCase = () => {
    router.push({ pathname: "/aviso", params: { mode: "continue" } });
  };

  const handleOpenHistory = () => {
    router.push("/history");
  };

  const handleOpenFaq = () => {
    router.push("/faq");
  };

  const handleOpenRecoveryCenters = () => {
    router.push("/centros");
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
          title="SOS Fauna España | Ayuda a la fauna silvestre"
          description="SOS Fauna España ofrece orientación paso a paso para actuar cuando encuentras un animal silvestre herido, atrapado, desorientado o que puede necesitar ayuda."
          path="/"
          structuredData={homePageStructuredData}
        />
        <Stack.Screen
          options={{ title: "SOS Fauna España | Ayuda a la fauna silvestre" }}
        />

      <View style={styles.header}>
        <View style={styles.headerInner}>
          <Link href="/">
            <Text style={styles.brand}>SOS Fauna España</Text>
          </Link>

          <Pressable
            style={styles.headerButton}
            onPress={handleStartNewCase}
            disabled={checkingCase}
          >
            <Text style={styles.headerButtonText}>Comenzar aviso</Text>
          </Pressable>
        </View>
      </View>

      <View style={[styles.main, isCompact && styles.mainCompact]}>
        <View style={[styles.hero, isCompact && styles.heroCompact]}>
          <View style={[styles.heroContent, isCompact && styles.heroContentCompact]}>
            <Text style={styles.badge}>Ayuda a la fauna silvestre</Text>

            <Text
              accessibilityRole="header"
              aria-level={1}
              style={[styles.heroTitle, isCompact && styles.heroTitleCompact]}
            >
              ¿Has encontrado un animal silvestre herido, atrapado o en peligro?
            </Text>

            <Text style={styles.heroDescription}>
              SOS Fauna España te ayuda paso a paso a valorar la situación con
              calma, recopilar la información necesaria y contactar con los
              recursos adecuados.
            </Text>

            {!isCompact ? (
            <View style={styles.heroGuidance}>
              <Text style={styles.heroGuidanceTitle}>Actúa con calma</Text>
              <Text style={styles.heroGuidanceText}>
                Evita manipular al animal salvo que exista un riesgo inmediato.
                Mantén una distancia prudente y observa la situación antes de intervenir.
                Sigue las recomendaciones del asistente para valorar si realmente es necesario actuar.
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
                  {checkingCase ? "Comprobando…" : "Comenzar nuevo aviso"}
                </Text>
              </Pressable>

              {pendingCase ? (
                <View style={styles.pendingBlock}>
                  <Text style={styles.pendingNote}>
                    Tienes un aviso sin finalizar guardado en este dispositivo.
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
                      Continuar aviso anterior
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
                      Ver avisos recientes
                    </Text>
                  </Pressable>
                  <Text style={styles.historyNote}>
                    Se guardan los últimos 30 avisos en este dispositivo.
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
                Gratuito · Sin registro{"\n"}
                Diseñado para incidencias en España
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
                    ❓ Preguntas frecuentes
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
                    📞 Centros de Recuperación y teléfonos de ayuda
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>

          {isCompact ? (
            <View style={[styles.heroGuidance, styles.heroGuidanceCompact]}>
              <Text style={styles.heroGuidanceTitle}>Actúa con calma</Text>
              <Text style={styles.heroGuidanceText}>
                Evita manipular al animal salvo que exista un riesgo inmediato.
                Mantén la distancia y sigue las recomendaciones del asistente.
              </Text>
            </View>
          ) : null}
        </View>

        <View style={[styles.section, styles.processSection]}>
          <View style={styles.processIntro}>
            <Text style={[styles.sectionTitle, styles.processTitle]}>
              Ayudar también significa no intervenir cuando no es necesario
            </Text>

            <Text style={[styles.sectionDescription, styles.processDescription]}>
              Muchas crías de aves, mamíferos y otros animales no están abandonadas, aunque parezcan solas.
            </Text>

            <Text style={[styles.sectionDescription, styles.processDescription]}>
              Intervenir innecesariamente puede separarlas de sus padres o reducir sus posibilidades de supervivencia.
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
              Por eso SOS Fauna te ayuda primero a valorar la situación para decidir si realmente es necesario intervenir.
            </Text>
          </View>
        </View>

        <View style={[styles.section, styles.animalScopeSection]}>
          <Text style={[styles.sectionTitle, styles.animalScopeTitle]}>
            ¿Qué animales incluye SOS Fauna España?
          </Text>

          <Text style={[styles.sectionDescription, styles.animalScopeText]}>
            SOS Fauna España se centra en cubrir las incidencias más habituales de la fauna silvestre no marina.
          </Text>

          <View style={styles.animalScopeGrid}>
            <AnimalScopeGroup icon="🦉" label="Aves" />
            <AnimalScopeGroup icon="🦊" label="Mamíferos" />
            <AnimalScopeGroup icon="🦎" label="Reptiles y anfibios" />
          </View>
        </View>

        {installPrompt ? (
          <View style={styles.installSection}>
            <Text style={styles.installTitle}>
              ¿Quieres tener SOS Fauna siempre a mano?
            </Text>
            <Text style={styles.installText}>
              Instálala en tu dispositivo para acceder más rápidamente cuando la necesites.
            </Text>
            <Pressable style={styles.installButton} onPress={handleInstallApp}>
              <Text style={styles.installButtonText}>Instalar aplicación</Text>
            </Pressable>
            <Text style={styles.installNote}>
              Ten la aplicación siempre a mano para acceder rápidamente cuando encuentres un animal silvestre.
            </Text>
          </View>
        ) : null}
      </View>

      <View style={styles.footer}>
        <View style={styles.footerInner}>
          <View>
            <Link href="/">
              <Text style={styles.footerBrand}>SOS Fauna España</Text>
            </Link>
            <Text style={styles.footerText}>
              Asistencia guiada para ayudar a la fauna silvestre de forma
              segura y responsable.
            </Text>
            <Text style={styles.footerNote}>
              📱 Aplicación Android disponible próximamente en Google Play
            </Text>
          </View>

          <View style={styles.footerLinks}>
             <Link href="/about">
               <Text style={styles.footerLink}>Sobre SOS Fauna España</Text>
             </Link>

             <Link href="/faq">
               <Text style={styles.footerLink}>Preguntas frecuentes</Text>
             </Link>

             <Link href="/centros">
               <Text style={styles.footerLink}>
                 Centros de Recuperación y teléfonos de ayuda
               </Text>
             </Link>

             <Link href="/sources">
               <Text style={styles.footerLink}>Recursos de información</Text>
             </Link>

             <Link href="/contact">
               <Text style={styles.footerLink}>Contacto</Text>
             </Link>

             <Pressable
               accessibilityRole="button"
               onPress={shareSosFaunaApp}
             >
               <Text style={styles.footerLink}>Compartir SOS Fauna España</Text>
             </Pressable>

             <View style={styles.footerLegalLinks}>
               <Link href="/privacy">
                 <Text style={styles.footerLink}>Política de privacidad</Text>
               </Link>

               <Link href="/legal">
                 <Text style={styles.footerLink}>Aviso legal</Text>
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
  footerNote: {
    color: "#aec8b5",
    fontSize: 13,
    lineHeight: 20,
    marginTop: 12,
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
