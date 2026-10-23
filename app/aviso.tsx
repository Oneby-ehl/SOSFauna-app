import { getEffectiveCatalog } from "@/i18n/translate";
import { useI18n } from "@/i18n/I18nProvider";
import { useInformationPagePath } from "@/components/i18n/InformationPageSupport";
import type { RescueAnimalType, RescueCase } from "@/types/rescueCase";
import { recoverCurrentCase } from "@/services/rescueCaseService";
import SosAssistant from "@/components/sos/SosAssistant";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

import { NoIndexHead } from "@/components/i18n/InformationPageSupport";

type GuidePreparation =
  | {
      requestKey: string;
      status: "ready";
      initialCase: RescueCase | null;
      initialAnimalType: RescueAnimalType | null;
    }
  | { requestKey: string; status: "error" };

export default function AvisoRoute() {
  const { locale } = useI18n();
  const pagePath = useInformationPagePath();
  const homePath = pagePath("home");
  const homePathRef = useRef(homePath);
  homePathRef.current = homePath;
  const generalTexts = getEffectiveCatalog(locale);
  const router = useRouter();
  const { animalType, mode } = useLocalSearchParams<{
    animalType?: string | string[];
    mode?: string | string[];
  }>();
  const modeParam = Array.isArray(mode) ? mode[0] : mode;
  const animalTypeParam = Array.isArray(animalType) ? animalType[0] : animalType;
  const requestKey = JSON.stringify([modeParam ?? null, animalTypeParam ?? null]);
  // The static export and the first browser render always show the same shell.
  const [preparation, setPreparation] = useState<GuidePreparation | null>(null);

  useEffect(() => {
    let active = true;
    setPreparation(null);

    const prepareGuide = async () => {
      try {
        const initialAnimalType = normalizeAnimalTypeParam(animalTypeParam);
        const initialCase = modeParam === "continue"
          ? await recoverCurrentCase()
          : null;

        if (!active) return;

        if (modeParam === "continue" && !initialCase) {
          // Keep the assistant unmounted while returning to the home page.
          router.replace(homePathRef.current);
          return;
        }

        setPreparation({ requestKey, status: "ready", initialCase, initialAnimalType });
      } catch {
        if (active) setPreparation({ requestKey, status: "error" });
      }
    };

    void prepareGuide();

    return () => {
      active = false;
    };
  }, [modeParam, animalTypeParam, requestKey, router]);

  // A new URL must never render the previous request's assistant or error.
  const currentPreparation = preparation?.requestKey === requestKey ? preparation : null;

  return (
    <>
      <NoIndexHead path="/aviso" title="Aviso | SOS Fauna España" />
      {!currentPreparation ? (
        <View style={styles.loadingScreen}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>{generalTexts.guidePreparationUi.loading}</Text>
        </View>
      ) : currentPreparation.status === "error" ? (
        <View style={styles.loadingScreen}>
          <Text style={styles.loadingText} accessibilityRole="alert">{generalTexts.guidePreparationUi.error}</Text>
          <Pressable accessibilityRole="button" style={styles.backButton} onPress={() => router.replace(homePath)}>
            <Text style={styles.backButtonText}>{generalTexts.guidePreparationUi.home}</Text>
          </Pressable>
        </View>
      ) : (
        <SosAssistant
          key={currentPreparation.requestKey}
          initialCase={currentPreparation.initialCase}
          initialAnimalType={currentPreparation.initialAnimalType}
        />
      )}
    </>
  );
}

function normalizeAnimalTypeParam(
  value: string | string[] | undefined,
): RescueAnimalType | null {
  const normalizedValue = Array.isArray(value) ? value[0] : value;
  const validAnimalTypes: RescueAnimalType[] = [
    "smallBird",
    "largeBird",
    "bat",
    "smallMammal",
    "largeMammal",
    "reptileAmphibian",
    "dolphin",
    "largeCetacean",
    "seal",
    "seaTurtle",
    "sharkRay",
    "otherMarine",
    "unknown",
  ];

  return validAnimalTypes.includes(normalizedValue as RescueAnimalType)
    ? (normalizedValue as RescueAnimalType)
    : null;
}

const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    backgroundColor: "#f3f7f4",
  },
  backButton: {
    backgroundColor: "#14532d",
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backButtonText: { color: "#ffffff", fontSize: 15, fontWeight: "700" },
  loadingText: {
    color: "#14532d",
    fontSize: 16,
    fontWeight: "700",
  },
});
