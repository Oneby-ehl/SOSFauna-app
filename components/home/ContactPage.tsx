import { Link, Stack } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { SeoHead } from "@/components/seo/SeoHead";

const contactPageStructuredData = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contacto - SOS Fauna España",
  url: "https://sosfauna.es/contact",
  inLanguage: "es",
  description:
    "Página de contacto de SOS Fauna España para comunicar errores, sugerencias o consultas relacionadas con el funcionamiento del proyecto.",
  significantLink: [
    "mailto:contacto@sosfauna.es",
    "mailto:privacidad@sosfauna.es",
  ],
};

export default function ContactPage() {
  return (
    <>
      <SeoHead
        title="Contacto | SOS Fauna España"
        description="Contacta con SOS Fauna España para comunicar errores, sugerencias o consultas relacionadas con el funcionamiento del proyecto."
        path="/contact"
        structuredData={contactPageStructuredData}
      />
      <Stack.Screen options={{ title: "Contacto | SOS Fauna España" }} />

      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.container}
      >
        <View style={styles.header}>
          <Text style={styles.eyebrow}>SOS FAUNA ESPAÑA</Text>
          <Text style={styles.title}>Contacto</Text>

          <Text style={styles.intro}>
            SOS Fauna España es un proyecto en evolución. Tus comentarios pueden ayudar a mejorar la información y el funcionamiento del servicio.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Consultas y sugerencias</Text>

          <Text style={styles.paragraph}>Puedes escribirnos si:</Text>

          <View style={styles.list}>
            <Text style={styles.listItem}>{"\u2022"} Has encontrado un error.</Text>
            <Text style={styles.listItem}>{"\u2022"} Quieres proponer una mejora.</Text>
            <Text style={styles.listItem}>{"\u2022"} Deseas comunicar un recurso que debería revisarse.</Text>
            <Text style={styles.listItem}>{"\u2022"} Tienes una sugerencia relacionada con el funcionamiento de SOS Fauna España.</Text>
          </View>

          <Link href="mailto:contacto@sosfauna.es" asChild>
            <Pressable style={styles.mailButton}>
              <Text style={styles.mailButtonText}>contacto@sosfauna.es</Text>
            </Pressable>
          </Link>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacidad</Text>

          <Text style={styles.paragraph}>
            Para cuestiones relacionadas con privacidad, datos almacenados en el dispositivo o ejercicio de derechos:
          </Text>

          <Link href="mailto:privacidad@sosfauna.es" asChild>
            <Pressable style={styles.mailButton}>
              <Text style={styles.mailButtonText}>privacidad@sosfauna.es</Text>
            </Pressable>
          </Link>
        </View>

        <View style={styles.notice}>
          <Text style={styles.noticeTitle}>
            Este correo no es un servicio de emergencias ni de atención inmediata.
          </Text>

          <Text style={styles.noticeText}>
            Si un animal o una persona se encuentra en peligro, contacta directamente con el 112, los agentes medioambientales o el centro de recuperación correspondiente.
          </Text>
        </View>

        <Link href="/" asChild>
          <Pressable style={styles.backButton}>
            <Text style={styles.backButtonText}>Volver al inicio</Text>
          </Pressable>
        </Link>
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
  title: {
    color: "#14532d",
    fontSize: 38,
    lineHeight: 44,
    fontWeight: "900",
  },
  intro: {
    maxWidth: 760,
    color: "#4b5563",
    fontSize: 17,
    lineHeight: 27,
  },
  section: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#dbe7dd",
    borderRadius: 16,
    padding: 20,
    gap: 10,
  },
  sectionTitle: {
    color: "#14532d",
    fontSize: 20,
    fontWeight: "900",
  },
  paragraph: {
    color: "#374151",
    fontSize: 15,
    lineHeight: 23,
  },
  list: {
    gap: 6,
  },
  listItem: {
    color: "#374151",
    fontSize: 15,
    lineHeight: 23,
  },
  mailButton: {
    alignSelf: "flex-start",
    marginTop: 4,
    borderRadius: 10,
    backgroundColor: "#e7f5ea",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  mailButtonText: {
    color: "#166534",
    fontSize: 15,
    fontWeight: "800",
  },
  notice: {
    backgroundColor: "#fff8df",
    borderWidth: 1,
    borderColor: "#ead897",
    borderRadius: 16,
    padding: 20,
    gap: 10,
  },
  noticeTitle: {
    color: "#6f5610",
    fontSize: 18,
    fontWeight: "800",
  },
  noticeText: {
    color: "#665925",
    fontSize: 15,
    lineHeight: 23,
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
