import type { RescueCase } from "@/types/rescueCase";
import { recoverCurrentCase } from "@/services/rescueCaseService";
import SosAssistant from "@/components/sos/SosAssistant";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export default function AvisoRoute() {
  const router = useRouter();
  const { mode } = useLocalSearchParams<{ mode?: string }>();
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
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Recuperando aviso…</Text>
      </View>
    );
  }

  return <SosAssistant initialCase={initialCase} />;
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
