import { Link, Stack, useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import type { RescueCase } from "@/types/rescueCase";
import {
  discardCurrentCase,
  recoverCurrentCase,
} from "@/services/rescueCaseService";
import { getHistory } from "@/services/rescueStorage";
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

type FeatureCardProps = {
  icon: string;
  title: string;
  description: string;
};

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <View style={styles.featureCard}>
      <Text style={styles.featureIcon}>{icon}</Text>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </View>
  );
}

type StepProps = {
  number: string;
  title: string;
  description: string;
};

function Step({ number, title, description }: StepProps) {
  return (
    <View style={styles.step}>
      <View style={styles.stepNumber}>
        <Text style={styles.stepNumberText}>{number}</Text>
      </View>

      <View style={styles.stepContent}>
        <Text style={styles.stepTitle}>{title}</Text>
        <Text style={styles.stepDescription}>{description}</Text>
      </View>
    </View>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isCompact = width < 760;
  const [pendingCase, setPendingCase] = useState<RescueCase | null>(null);
  const [hasHistory, setHasHistory] = useState(false);
  const [checkingCase, setCheckingCase] = useState(true);

  const refreshLandingData = useCallback(async () => {
    try {
      setCheckingCase(true);

      const [currentCase, history] = await Promise.all([
        recoverCurrentCase(),
        getHistory(),
      ]);

      setPendingCase(currentCase);
      setHasHistory(history.length > 0);
    } finally {
      setCheckingCase(false);
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

  const handleStartNewCase = () => {
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

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.screenContent}
      showsVerticalScrollIndicator
    >
      <Stack.Screen options={{ title: "SOS Fauna España" }} />

      <View style={styles.header}>
        <View style={styles.headerInner}>
          <Text style={styles.brand}>SOS Fauna España</Text>

          <Pressable
            style={styles.headerButton}
            onPress={handleStartNewCase}
            disabled={checkingCase}
          >
            <Text style={styles.headerButtonText}>Comenzar aviso</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.main}>
        <View style={[styles.hero, isCompact && styles.heroCompact]}>
          <View style={styles.heroContent}>
            <Text style={styles.badge}>Ayuda ante fauna silvestre</Text>

            <Text style={[styles.heroTitle, isCompact && styles.heroTitleCompact]}>
              ¿Has encontrado un animal silvestre herido, atrapado o en peligro?
            </Text>

            <Text style={styles.heroDescription}>
              Te ayudaremos paso a paso a valorar la situación, recopilar 
			  la información necesaria y contactar con los recursos adecuados.
            </Text>

            <View style={styles.heroGuidance}>
              <Text style={styles.heroGuidanceTitle}>Actúa con calma</Text>
              <Text style={styles.heroGuidanceText}>
                Evita manipular al animal salvo que exista un riesgo inmediato.
                Mantén la distancia y sigue las recomendaciones del asistente.
              </Text>

              <Text style={styles.heroNote}>
                Gratuito, sin registro y pensado para incidencias en España.
              </Text>
            </View>
          </View>

          <View style={styles.heroPanel}>
            <Text style={styles.heroPanelIcon}>🦉</Text>

            <View style={styles.heroActions}>
              {pendingCase ? (
                <Text style={styles.pendingNote}>
                  Tienes un aviso sin finalizar guardado en este dispositivo.
                </Text>
              ) : null}

              {pendingCase ? (
                <Pressable
                  style={[styles.caseButton, styles.continueButton]}
                  onPress={handleContinueCase}
                >
                  <Text style={styles.continueButtonText}>
                    Continuar aviso anterior
                  </Text>
                </Pressable>
              ) : null}

              <Pressable
                style={[styles.caseButton, styles.primaryButton]}
                onPress={handleStartNewCase}
                disabled={checkingCase}
              >
                <Text style={styles.primaryButtonText}>
                  {checkingCase ? "Comprobando…" : "Comenzar nuevo aviso"}
                </Text>
              </Pressable>

              {hasHistory ? (
                <Pressable
                  style={[styles.caseButton, styles.historyButton]}
                  onPress={handleOpenHistory}
                >
                  <Text style={styles.historyButtonText}>
                    Ver avisos recientes
                  </Text>
                </Pressable>
              ) : null}
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionEyebrow}>¿Cómo puede ayudarte?</Text>
          <Text style={styles.sectionTitle}>
            Toda la información esencial en un único proceso
          </Text>

          <View
            style={[
              styles.featureGrid,
              isCompact && styles.featureGridCompact,
            ]}
          >
            <FeatureCard
              icon="📍"
              title="Ubicación"
              description="Recoge las coordenadas del lugar donde se encuentra el animal."
            />

            <FeatureCard
              icon="📷"
              title="Fotos y vídeos"
              description="Documenta el caso para facilitar su valoración por profesionales."
            />

            <FeatureCard
              icon="☎️"
              title="Contactos útiles"
              description="Consulta servicios de emergencia y centros de recuperación."
            />
          </View>
        </View>

        <View style={[styles.section, styles.processSection]}>
          <View style={styles.processIntro}>
            <Text style={styles.sectionEyebrow}>Cómo funciona</Text>
            <Text style={styles.sectionTitle}>
              Cuatro pasos para preparar un aviso completo
            </Text>
            <Text style={styles.sectionDescription}>
              El asistente adapta las recomendaciones según el tipo de animal y
              la situación que observes.
            </Text>
          </View>

          <View style={styles.steps}>
            <Step
              number="1"
              title="Describe la situación"
              description="Indica qué animal has encontrado y qué está ocurriendo."
            />

            <Step
              number="2"
              title="Añade información"
              description="Incluye ubicación, fotografías o vídeos cuando sea posible."
            />

            <Step
              number="3"
              title="Consulta las recomendaciones"
              description="Recibe indicaciones adaptadas al caso antes de intervenir."
            />

            <Step
              number="4"
              title="Contacta con ayuda"
              description="Prepara un resumen y localiza los recursos disponibles."
            />
          </View>
        </View>

        <View style={styles.notice}>
          <Text style={styles.noticeTitle}>Información importante</Text>

          <Text style={styles.noticeText}>
            Herramienta independiente de apoyo para incidencias con fauna
            silvestre en España. No sustituye las indicaciones de los servicios
            de emergencia o profesionales especializados.
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.footerInner}>
          <View>
            <Text style={styles.footerBrand}>SOS Fauna España</Text>
            <Text style={styles.footerText}>
              Asistencia guiada ante incidencias con fauna silvestre.
            </Text>
          </View>

          <View style={styles.footerLinks}>
             <Link href="/privacy">
               <Text style={styles.footerLink}>Política de privacidad</Text>
             </Link>
           
             <Link href="/sources">
               <Text style={styles.footerLink}>Recursos oficiales</Text>
             </Link>
           
             <Text style={styles.footerLink}>
               Aplicación Android próximamente
             </Text>
           </View>
        </View>
      </View>
    </ScrollView>
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
  hero: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: 28,
  },
  heroCompact: {
    flexDirection: "column",
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
    gap: 14,
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
  pendingNote: {
    color: "#166534",
    fontSize: 13,
    lineHeight: 20,
    fontWeight: "700",
  },
  heroNote: {
    color: "#6b756d",
    fontSize: 13,
    lineHeight: 20,
  },
  heroPanel: {
    flex: 0.75,
    minWidth: 280,
    backgroundColor: "#dfeee2",
    borderRadius: 28,
    padding: 32,
    justifyContent: "center",
    gap: 22,
  },
  heroPanelIcon: {
    fontSize: 48,
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
  featureGrid: {
    flexDirection: "row",
    gap: 20,
  },
  featureGridCompact: {
    flexDirection: "column",
  },
  featureCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#dfe7df",
    padding: 26,
    gap: 12,
  },
  featureIcon: {
    fontSize: 34,
  },
  featureTitle: {
    color: "#183d28",
    fontSize: 20,
    fontWeight: "900",
  },
  featureDescription: {
    color: "#536158",
    fontSize: 15,
    lineHeight: 24,
  },
  processSection: {
    backgroundColor: "#ffffff",
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#dfe7df",
    padding: 34,
  },
  processIntro: {
    gap: 14,
  },
  steps: {
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
  notice: {
    backgroundColor: "#fff8df",
    borderWidth: 1,
    borderColor: "#ead897",
    borderRadius: 20,
    padding: 28,
    gap: 10,
  },
  noticeTitle: {
    color: "#6f5610",
    fontSize: 19,
    fontWeight: "900",
  },
  noticeText: {
    maxWidth: 920,
    color: "#665925",
    fontSize: 15,
    lineHeight: 24,
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
  footerLinks: {
    gap: 10,
  },
  footerLink: {
    color: "#e2eee4",
    fontSize: 14,
  },
});