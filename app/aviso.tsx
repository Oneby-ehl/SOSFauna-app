import type { RescueAnimalType, RescueCase } from "@/types/rescueCase";
import { recoverCurrentCase } from "@/services/rescueCaseService";
import SosAssistant from "@/components/sos/SosAssistant";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { NoIndexHead } from "@/components/seo/SeoHead";

export default function AvisoRoute() {
  const router = useRouter();
  const { animalType, mode } = useLocalSearchParams<{
    animalType?: string;
    mode?: string;
  }>();
  const [initialCase, setInitialCase] = useState<RescueCase | null>(null);
  const [loading, setLoading] = useState(mode === "continue");

  useEffect(() => {
    let active = true;

    const prepareCase = async () => {
      if (mode !== "continue") {
        if (active) setLoading(false);
        return;
      }

      const savedCase = await recoverCurrentCase();

      if (!active) return;

      if (!savedCase) {
        setLoading(false);
        router.replace("/");
        return;
      }

      setInitialCase(savedCase);
      setLoading(false);
    };

    void prepareCase();

    return () => {
      active = false;
    };
  }, [mode, router]);

  if (loading) {
    return (
      <>
        <NoIndexHead path="/aviso" title="Aviso | SOS Fauna España" />
        <View style={styles.loadingScreen}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Recuperando aviso…</Text>
        </View>
      </>
    );
  }

  return (
    <>
      <NoIndexHead path="/aviso" title="Aviso | SOS Fauna España" />
      <SosAssistant
        initialCase={initialCase}
        initialAnimalType={normalizeAnimalTypeParam(animalType)}
      />
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
  loadingText: {
    color: "#14532d",
    fontSize: 16,
    fontWeight: "700",
  },
});
