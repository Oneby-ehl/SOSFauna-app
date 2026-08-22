import { Link, Stack } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { SeoHead } from "@/components/seo/SeoHead";
import { shareSosFaunaApp } from "@/utils/rescueShareMessage";

const principles = ["Calma", "Claridad", "Prudencia", "Acción"];

const aboutPageStructuredData = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "Sobre SOS Fauna España",
  url: "https://sosfauna.es/about",
  inLanguage: "es",
  description:
    "SOS Fauna España es un proyecto independiente de orientación para incidencias con fauna silvestre.",
};

export default function AboutPage() {
  return (
    <>
      <SeoHead
        title="Sobre SOS Fauna España | Ayuda a la fauna silvestre"
        description="Conoce el objetivo y el funcionamiento de SOS Fauna España, un proyecto independiente de orientación ante incidencias con fauna silvestre."
        path="/about"
        structuredData={aboutPageStructuredData}
      />
      <Stack.Screen options={{ title: "Sobre SOS Fauna España" }} />

      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.container}
      >
        <View style={styles.header}>
          <Text style={styles.eyebrow}>SOS FAUNA ESPAÑA</Text>
          <Text style={styles.title}>Sobre SOS Fauna España</Text>

          <Text style={styles.intro}>
            SOS Fauna España es un proyecto independiente de orientación para incidencias con fauna silvestre.
          </Text>

          <Text style={styles.intro}>
            Su objetivo es ayudarte a valorar la situación con calma, recopilar la información necesaria y facilitar el contacto con los recursos adecuados.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>¿Por qué nace este proyecto?</Text>

          <Text style={styles.paragraph}>
            SOS Fauna España nace de una idea sencilla: muchas personas quieren ayudar cuando encuentran un animal silvestre herido, atrapado o aparentemente abandonado, pero no siempre saben cuál es la mejor forma de hacerlo.
          </Text>

          <Text style={styles.paragraph}>
            En algunas situaciones, actuar con rapidez puede marcar la diferencia. En otras, la mejor ayuda consiste en mantener la distancia, observar y evitar una intervención innecesaria.
          </Text>

          <Text style={styles.paragraph}>
            El proyecto pretende ofrecer una orientación clara y prudente para facilitar una primera valoración del caso y ayudar a localizar los recursos adecuados.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nuestra forma de entender la ayuda</Text>

          <Text style={styles.paragraph}>
            Ayudar a la fauna silvestre no siempre significa recoger o manipular al animal.
          </Text>

          <Text style={styles.paragraph}>
            También significa respetar su espacio, evitar alimentarlo sin indicación profesional, proteger su hábitat y contactar con personas especializadas cuando exista una duda o un riesgo real.
          </Text>

          <Text style={styles.paragraph}>
            SOS Fauna España se basa en cuatro principios:
          </Text>

          <View style={styles.principles}>
            {principles.map((principle) => (
              <View key={principle} style={styles.principle}>
                <Text style={styles.principleText}>{principle}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información y criterios técnicos</Text>

          <Text style={styles.paragraph}>
            El contenido del proyecto se elabora a partir de recursos oficiales, criterios técnicos, documentación especializada y formación en recuperación de fauna silvestre. Para fauna marina, se apoya también en documentación técnica, redes de varamientos, entidades especializadas y servicios competentes.
          </Text>

          <Text style={styles.paragraph}>
            SOS Fauna España es un proyecto desarrollado por una persona formada en recuperación de fauna silvestre en la Facultad de Veterinaria de la Universidad Complutense de Madrid y GREFA.
          </Text>
        </View>

        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerTitle}>Límites del servicio</Text>

          <Text style={styles.disclaimerText}>
            SOS Fauna España ofrece orientación básica y ayuda a recopilar información sobre una incidencia.
          </Text>

          <Text style={styles.disclaimerText}>
            No pertenece a ninguna administración pública, centro de recuperación ni servicio de emergencias.
          </Text>

          <Text style={styles.disclaimerText}>
            No sustituye la valoración de veterinarios, centros de recuperación de fauna, redes de varamientos, entidades especializadas, agentes medioambientales, fuerzas de seguridad o servicios de emergencia.
          </Text>

          <Text style={styles.disclaimerText}>
            Cuando exista peligro para personas o animales, debe contactarse directamente con el 112 o con los servicios competentes.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Agradecimiento</Text>

          <Text style={styles.paragraph}>
            Gracias a todas las personas, profesionales, administraciones y organizaciones que trabajan cada día por la conservación, protección y recuperación de la fauna silvestre.
          </Text>
        </View>

        <View style={styles.quote}>
          <Text style={styles.quoteText}>
            La forma en que tratamos a los animales refleja el tipo de sociedad que estamos construyendo.
          </Text>
        </View>

        <Pressable style={styles.shareButton} onPress={shareSosFaunaApp}>
          <Text style={styles.shareButtonText}>Compartir SOS Fauna España</Text>
        </Pressable>

        <Link href="/" asChild>
          <Pressable style={styles.backButton}>
            <Text style={styles.backButtonText}>Volver a SOS Fauna España</Text>
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
  principles: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 2,
  },
  principle: {
    borderWidth: 1,
    borderColor: "#b7dfc0",
    borderRadius: 999,
    backgroundColor: "#eef8f0",
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  principleText: {
    color: "#166534",
    fontSize: 14,
    fontWeight: "800",
  },
  disclaimer: {
    backgroundColor: "#fef3c7",
    borderWidth: 1,
    borderColor: "#f59e0b",
    borderRadius: 16,
    padding: 20,
    gap: 10,
  },
  disclaimerTitle: {
    color: "#92400e",
    fontSize: 18,
    fontWeight: "800",
  },
  disclaimerText: {
    color: "#92400e",
    fontSize: 15,
    lineHeight: 23,
  },
  quote: {
    borderLeftWidth: 4,
    borderLeftColor: "#14532d",
    paddingLeft: 18,
    paddingVertical: 8,
  },
  quoteText: {
    color: "#14532d",
    fontSize: 20,
    lineHeight: 30,
    fontWeight: "800",
  },
  shareButton: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#b7dfc0",
    borderRadius: 14,
    backgroundColor: "#eef8f0",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  shareButtonText: {
    color: "#166534",
    fontSize: 15,
    fontWeight: "800",
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
