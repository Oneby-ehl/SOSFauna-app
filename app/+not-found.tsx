import { Link, Stack } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { SeoHead } from "@/components/seo/SeoHead";

export default function NotFoundPage() {
  return (
    <>
      <SeoHead
        title="Página no encontrada | SOS Fauna España"
        description="La dirección introducida no existe o ya no está disponible."
        robots="noindex, nofollow"
        includeGlobalStructuredData={false}
      />
      <Stack.Screen
        options={{ title: "Página no encontrada | SOS Fauna España" }}
      />

      <View style={styles.screen}>
        <View style={styles.card}>
          <Text style={styles.eyebrow}>SOS FAUNA ESPAÑA</Text>
          <Text style={styles.code}>404</Text>
          <Text style={styles.title}>Página no encontrada</Text>
          <Text style={styles.message}>
            La dirección que has introducido no existe o ya no está disponible.
          </Text>
          <Text style={styles.secondary}>
            Puedes volver a la página principal de SOS Fauna España.
          </Text>

          <Link href="/" asChild>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Volver al inicio"
              style={styles.button}
            >
              <Text style={styles.buttonText}>Volver al inicio</Text>
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
