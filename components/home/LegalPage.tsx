import { Link, Stack } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { SeoHead } from "@/components/seo/SeoHead";

const sections = [
  {
    title: "1. Identificación y finalidad",
    paragraphs: [
      "SOS Fauna España es una herramienta independiente de orientación y apoyo ciudadano ante incidencias relacionadas con fauna silvestre en España.",
      "Su finalidad es ayudar a valorar situaciones habituales, facilitar recomendaciones básicas y preparar la información necesaria para contactar con los servicios o centros competentes.",
      "SOS Fauna España no representa ni forma parte de ninguna administración pública, servicio de emergencias, cuerpo de agentes, centro de recuperación o entidad citada en la aplicación.",
    ],
  },
  {
    title: "2. Carácter orientativo de la información",
    paragraphs: [
      "La información ofrecida por SOS Fauna España tiene carácter general y orientativo. No sustituye la valoración de profesionales especializados, los servicios veterinarios ni las instrucciones de las autoridades y servicios competentes.",
      "Cada situación puede requerir una actuación diferente. Cuando exista un riesgo inmediato para personas o animales, el usuario deberá contactar con los servicios de emergencia o con el organismo competente.",
    ],
  },
  {
    title: "3. Ámbito de la aplicación",
    paragraphs: [
      "SOS Fauna España se centra actualmente en cubrir las incidencias más habituales relacionadas con fauna silvestre no marina, especialmente aves, mamíferos, reptiles y anfibios.",
      "El contenido y los grupos de fauna incluidos podrán ampliarse o modificarse en futuras actualizaciones.",
    ],
  },
  {
    title: "4. Responsabilidad del usuario",
    paragraphs: [
      "El usuario es responsable de valorar las circunstancias concretas antes de actuar y de seguir las indicaciones proporcionadas por los servicios competentes.",
      "La manipulación de fauna silvestre puede implicar riesgos para el animal y para las personas. No debe capturarse, trasladarse o manipularse un animal salvo que sea necesario y pueda hacerse con seguridad.",
    ],
  },
  {
    title: "5. Limitación de responsabilidad",
    paragraphs: [
      "SOS Fauna España procura mantener sus contenidos actualizados y ofrecer información útil y comprensible. No obstante, no puede garantizar que toda la información, teléfonos, enlaces o recursos externos permanezcan disponibles o actualizados en todo momento.",
      "La utilización de la aplicación y las decisiones adoptadas a partir de su contenido son responsabilidad del usuario.",
      "SOS Fauna España no se responsabiliza de los contenidos, disponibilidad o actuaciones de los servicios, páginas web o entidades externas enlazadas o mencionadas.",
    ],
  },
  {
    title: "6. Propiedad intelectual",
    paragraphs: [
      "Los textos, el diseño, la estructura, el logotipo y los demás elementos propios de SOS Fauna España están protegidos por la normativa aplicable en materia de propiedad intelectual.",
      "No se permite su reproducción, modificación o utilización con fines comerciales sin autorización, salvo en los casos permitidos por la ley.",
    ],
  },
  {
    title: "7. Enlaces externos",
    paragraphs: [
      "La aplicación puede incluir enlaces a organismos públicos, centros de recuperación, entidades especializadas y otros recursos de información.",
      "Estos enlaces se facilitan únicamente para ayudar al usuario a localizar recursos adecuados. SOS Fauna España no controla ni se responsabiliza del contenido o funcionamiento de sitios externos.",
    ],
  },
  {
    title: "8. Modificaciones",
    paragraphs: [
      "Este aviso legal podrá actualizarse cuando cambien las funcionalidades, los contenidos o las circunstancias del proyecto.",
      "La fecha de la última actualización se mostrará al comienzo de esta página.",
    ],
  },
  {
    title: "Antes de recoger un animal silvestre",
    paragraphs: [
      "No todos los animales encontrados necesitan ser rescatados. Manipularlos o trasladarlos sin necesidad puede perjudicarles y, en el caso de determinadas especies protegidas, estas actuaciones pueden estar reguladas por la normativa vigente.",
      "Cuando exista duda, lo más adecuado es observar la situación, seguir las recomendaciones de SOS Fauna España y contactar con el centro de recuperación o servicio público competente antes de intervenir.",
    ],
    highlightedParagraph:
      "Ayudar también significa no intervenir cuando no es necesario.",
  },
  {
    title: "9. Contacto",
    paragraphs: [
      "Para comunicar errores, proponer correcciones o realizar consultas relacionadas con SOS Fauna España, puede utilizarse el medio de contacto indicado en la aplicación.",
    ],
  },
];

export default function LegalPage() {
  return (
    <>
      <SeoHead
        title="Aviso legal | SOS Fauna España"
        description="Información legal, condiciones de uso y límites de responsabilidad de SOS Fauna España."
        path="/legal"
      />
      <Stack.Screen options={{ title: "Aviso legal | SOS Fauna España" }} />

      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.container}
      >
        <View style={styles.header}>
          <Text style={styles.eyebrow}>SOS FAUNA ESPAÑA</Text>
          <Text style={styles.title}>Aviso legal</Text>
          <Text style={styles.updated}>Última actualización: julio de 2026</Text>
        </View>

        {sections.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.paragraphs.map((paragraph) => (
              <Text key={paragraph} style={styles.paragraph}>
                {paragraph}
              </Text>
            ))}
            {"highlightedParagraph" in section ? (
              <Text style={styles.highlightedParagraph}>
                {section.highlightedParagraph}
              </Text>
            ) : null}
          </View>
        ))}

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
  updated: {
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
  highlightedParagraph: {
    color: "#374151",
    fontSize: 15,
    fontWeight: "800",
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
