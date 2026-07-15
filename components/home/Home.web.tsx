import { Link, Stack } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function HomeWeb() {
  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ title: "SOS Fauna España" }} />

      <View style={styles.container}>
        <Text style={styles.badge}>SOS Fauna España</Text>

        <Text style={styles.title}>
          Ayuda para actuar ante una incidencia con fauna silvestre
        </Text>

        <Text style={styles.description}>
          Sigue un proceso guiado para identificar la situación, consultar
          recomendaciones, capturar la ubicación y preparar la información
          necesaria para solicitar ayuda.
        </Text>

        <Link href="/aviso" asChild>
          <Pressable style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Comenzar aviso</Text>
          </Pressable>
        </Link>

        <Text style={styles.notice}>
          Aplicación independiente de apoyo. Solo cubre España y no sustituye
          las indicaciones de veterinarios, agentes medioambientales o servicios
          de emergencia.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    minHeight: "100%",
    backgroundColor: "#f3f7f4",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  container: {
    width: "100%",
    maxWidth: 900,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#dbe7dd",
    borderRadius: 24,
    padding: 32,
    gap: 22,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#e7f5ea",
    color: "#166534",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    fontSize: 14,
    fontWeight: "800",
  },
  title: {
    maxWidth: 760,
    fontSize: 38,
    lineHeight: 46,
    fontWeight: "900",
    color: "#14532d",
  },
  description: {
    maxWidth: 720,
    fontSize: 18,
    lineHeight: 29,
    color: "#374151",
  },
  primaryButton: {
    alignSelf: "flex-start",
    backgroundColor: "#14532d",
    borderRadius: 14,
    paddingHorizontal: 26,
    paddingVertical: 14,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "800",
  },
  notice: {
    maxWidth: 720,
    fontSize: 13,
    lineHeight: 20,
    color: "#6b7280",
  },
});