import { Link, Stack } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

const institutionalSources = [
  {
    name: "Emergencias 112",
    description:
      "Servicio de emergencias disponible en toda España. Puede derivar el aviso al organismo competente de cada comunidad autónoma.",
    url: "https://www.proteccioncivil.es/catalogo/info112/",
    displayUrl: "Protección Civil — Información 112",
  },
  {
    name: "Guardia Civil — SEPRONA",
    description:
      "Servicio de Protección de la Naturaleza de la Guardia Civil.",
    url: "https://www.guardiacivil.es",
    displayUrl: "www.guardiacivil.es",
  },
  {
    name: "Policía Nacional",
    description:
      "Información y canales oficiales de atención de la Policía Nacional.",
    url: "https://www.policia.es",
    displayUrl: "www.policia.es",
  },
  {
    name: "Agentes Forestales de la Comunidad de Madrid",
    description:
      "Servicio competente en materia de fauna silvestre y medio natural dentro de la Comunidad de Madrid.",
    url: "https://www.comunidad.madrid/centros/emisora-cuerpo-agentes-forestales",
    displayUrl: "Emisora del Cuerpo de Agentes Forestales",
  },
];

export default function SourcesPage() {
  return (
    <>
      <Stack.Screen options={{ title: "Recursos oficiales | SOS Fauna España" }} />

      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.container}
      >
        <View style={styles.header}>
          <Text style={styles.eyebrow}>SOS FAUNA ESPAÑA</Text>
          <Text style={styles.title}>Recursos oficiales</Text>

          <Text style={styles.intro}>
            La información y los teléfonos incluidos en SOS Fauna España se han
            preparado utilizando referencias institucionales y recursos
            públicos relacionados con emergencias, seguridad y protección de la
            fauna silvestre.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recursos oficiales</Text>

          {institutionalSources.map((source) => (
            <View key={source.name} style={styles.card}>
              <Text style={styles.cardTitle}>{source.name}</Text>

              <Text style={styles.cardText}>{source.description}</Text>

              <Link href={source.url as never} asChild>
                <Pressable style={styles.linkButton}>
                  <Text style={styles.linkButtonText}>
                    Visitar {source.displayUrl}
                  </Text>
                </Pressable>
              </Link>
            </View>
          ))}
        </View>

        <View style={styles.notice}>
          <Text style={styles.noticeTitle}>
            Contacto fuera de la Comunidad de Madrid
          </Text>
        
          <Text style={styles.noticeText}>
            Los organismos responsables de la fauna silvestre dependen de cada
            comunidad autónoma y pueden recibir distintas denominaciones, como agentes
            forestales, agentes medioambientales o agentes rurales.
          </Text>
        
          <Text style={styles.noticeText}>
            No existe un directorio nacional único y suficientemente claro que reúna
            todos estos servicios. Si la incidencia se produce fuera de la Comunidad
            de Madrid y no conoces el organismo competente, contacta con el 112 para
            que el aviso sea derivado al servicio correspondiente.
          </Text>
        </View>

        <View style={styles.notice}>
          <Text style={styles.noticeTitle}>Contactos de ayuda</Text>

          <Text style={styles.noticeText}>
            La aplicación también facilita teléfonos nacionales y contactos de
            centros de recuperación, agentes medioambientales y otros recursos
            organizados por provincias.
          </Text>

          <Text style={styles.noticeText}>
            Los datos de contacto pueden cambiar. Antes de realizar un
            desplazamiento, conviene confirmar que el teléfono o el centro
            continúan operativos.
          </Text>
        </View>

        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerTitle}>Proyecto independiente</Text>

          <Text style={styles.disclaimerText}>
            SOS Fauna España es un proyecto independiente. No es una aplicación
            oficial de GREFA ni de ninguna administración pública, servicio de
            emergencias, cuerpo policial o entidad mencionada en esta página.
          </Text>

          <Text style={styles.disclaimerText}>
            La información proporcionada es orientativa y no sustituye las
            instrucciones de veterinarios, centros de recuperación, agentes
            medioambientales o servicios de emergencia.
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
    gap: 14,
  },
  sectionTitle: {
    color: "#111827",
    fontSize: 24,
    fontWeight: "900",
  },
  card: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#dbe7dd",
    borderRadius: 16,
    padding: 20,
    gap: 10,
  },
  cardTitle: {
    color: "#14532d",
    fontSize: 18,
    fontWeight: "800",
  },
  cardText: {
    color: "#4b5563",
    fontSize: 15,
    lineHeight: 23,
  },
  linkButton: {
    alignSelf: "flex-start",
    marginTop: 4,
    borderRadius: 10,
    backgroundColor: "#e7f5ea",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  linkButtonText: {
    color: "#166534",
    fontSize: 14,
    fontWeight: "800",
  },
  notice: {
    backgroundColor: "#eef8f0",
    borderWidth: 1,
    borderColor: "#b7dfc0",
    borderRadius: 16,
    padding: 20,
    gap: 10,
  },
  noticeTitle: {
    color: "#14532d",
    fontSize: 18,
    fontWeight: "800",
  },
  noticeText: {
    color: "#374151",
    fontSize: 15,
    lineHeight: 23,
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