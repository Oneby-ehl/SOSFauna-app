import { Link, Stack } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { ExternalLink } from "@/components/external-link";
import { SeoHead } from "@/components/seo/SeoHead";

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

const legalSources = [
  {
    name: "Ley 42/2007, de 13 de diciembre, del Patrimonio Natural y de la Biodiversidad",
    description:
      "Es la norma básica estatal para la conservación del patrimonio natural y la biodiversidad. Entre otras cuestiones, establece medidas de protección para las especies silvestres.",
    url: "https://www.boe.es/buscar/act.php?id=BOE-A-2007-21490",
    displayUrl: "texto consolidado del BOE",
  },
  {
    name: "Real Decreto 139/2011: especies en régimen de protección especial y especies amenazadas",
    description:
      "Desarrolla el Listado de Especies Silvestres en Régimen de Protección Especial y el Catálogo Español de Especies Amenazadas.",
    url: "https://www.boe.es/buscar/act.php?id=BOE-A-2011-3582",
    displayUrl: "texto consolidado del BOE",
  },
  {
    name: "Normativa de las especies silvestres — MITECO",
    description:
      "Página oficial del Ministerio para la Transición Ecológica y el Reto Demográfico con el marco normativo estatal, europeo e internacional sobre conservación de especies silvestres.",
    url: "https://www.miteco.gob.es/es/biodiversidad/temas/conservacion-de-especies/especies-silvestres/ce-silvestres-conservacion-normativa.html",
    displayUrl: "MITECO",
  },
];

const terrestrialSources = [
  {
    name: "SEO/BirdLife",
    description:
      "Organización de conservación de referencia para aves. Aporta información sobre aves silvestres, aves jóvenes, vencejos y orientación general útil para decidir cuándo observar y cuándo pedir ayuda especializada.",
    url: "https://seo.org/",
    displayUrl: "SEO/BirdLife",
  },
  {
    name: "GREFA",
    description:
      "Centro especializado y referencia práctica en recuperación de fauna silvestre. Sus recursos ayudan a contextualizar la atención inicial prudente ante animales heridos o debilitados.",
    url: "https://grefa.org/",
    displayUrl: "GREFA",
  },
  {
    name: "Falciot Negre",
    description:
      "Recurso especializado en vencejos. Respalda criterios prácticos sobre cuidados iniciales, comportamiento, biología y liberación segura sin lanzar al animal al aire.",
    url: "http://www.falciotnegre.com/",
    displayUrl: "Falciot Negre",
  },
  {
    name: "SECEMU",
    description:
      "Entidad técnica dedicada al estudio y conservación de los murciélagos. Aporta orientación sobre identificación de crías y adultos, manipulación segura y contacto con centros o especialistas.",
    url: "https://secemu.org/recomendaciones/que-hacer-si-te-encuentras-un-murcielago/",
    displayUrl: "SECEMU",
  },
];

const marineSources = [
  {
    name: "Fundación Oceanogràfic — animales marinos en problemas",
    description:
      "Centro especializado de referencia en la Comunitat Valenciana. Resume criterios ciudadanos generales ante cetáceos, tortugas y tiburones: avisar al 112, mantener distancia, no manipular ni alimentar, no retirar residuos enganchados y registrar información útil.",
    url: "https://fundacionoceanografic.org/sumate/que-hacer-si-encuentras-un-animalmarino-en-problemas/",
    displayUrl: "Fundación Oceanogràfic",
  },
  {
    name: "Fundación Palma Aquarium — tortugas marinas",
    description:
      "Centro de rescate de referencia en Baleares. Aporta pautas específicas para tortugas marinas vivas, como avisar al 112, no retirar redes o sedales, evitar molestias y esperar indicaciones de especialistas.",
    url: "https://palmaaquarium.com/tortugas-del-centro-de-rescate",
    displayUrl: "Palma Aquarium",
  },
  {
    name: "Junta de Andalucía — varamientos de mamíferos y tortugas marinas",
    description:
      "Página oficial sobre la atención de emergencias frente a varamientos en Andalucía. Respalda la comunicación a través del 112 y la intervención de equipos técnicos ante animales vivos o muertos.",
    url: "https://www.juntadeandalucia.es/medioambiente/portal/areas-tematicas/biodiversidad-y-vegetacion/ecosistemas-y-capital-natural/medio-marino/atencion-de-emergencias-frente-a-varamientos-de-mamiferos-y-tortugas-marinas",
    displayUrl: "Junta de Andalucía",
  },
  {
    name: "Gobierno de Canarias — protocolo de tortugas marinas",
    description:
      "Documentación oficial canaria sobre varamientos de tortugas marinas. Sirve como referencia técnica sobre respuesta, toma de datos, recuperación, gestión de animales muertos y liberación de ejemplares recuperados.",
    url: "https://www.gobiernodecanarias.org/medioambiente/publicaciones/material-publicado/libros/varamiento-cetaceos-tortugas/index.html",
    displayUrl: "Gobierno de Canarias",
  },
  {
    name: "MITECO y Gobierno de Canarias — buenas prácticas en ZEC marinas",
    description:
      "Guía institucional de buenas prácticas para Zonas Especiales de Conservación marinas de Canarias. Aporta contexto de conservación, reducción de molestias y prevención de impactos sobre cetáceos y tortugas marinas.",
    url: "https://www.gobiernodecanarias.org/medioambiente/descargas/Biodiversidad/documentos-interes/buenas-practicas/2012_09_18_Guia_BPRCT_REDNATURA_web_tcm7-229984.pdf",
    displayUrl: "guía en PDF",
  },
];

export default function SourcesPage() {
  return (
    <>
      <SeoHead
        title="Recursos de información sobre fauna silvestre | SOS Fauna España"
        description="Organismos públicos, normativa y recursos útiles para actuar ante incidencias con fauna silvestre terrestre o marina en España."
        path="/sources"
      />
      <Stack.Screen
        options={{ title: "Recursos de información | SOS Fauna España" }}
      />

      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.container}
      >
        <View style={styles.header}>
          <Text style={styles.eyebrow}>SOS FAUNA ESPAÑA</Text>
          <Text style={styles.title}>Recursos de información</Text>

          <Text style={styles.intro}>
            La información y los teléfonos incluidos en SOS Fauna España se han
            preparado utilizando referencias institucionales y recursos
            públicos relacionados con emergencias, seguridad y protección de la
            fauna silvestre.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recursos de información</Text>

          {institutionalSources.map((source) => (
            <View key={source.name} style={styles.card}>
              <Text style={styles.cardTitle}>{source.name}</Text>

              <Text style={styles.cardText}>{source.description}</Text>

              <ExternalLink href={source.url} asChild>
                <Pressable style={styles.linkButton}>
                  <Text style={styles.linkButtonText}>
                    Visitar {source.displayUrl}
                  </Text>
                </Pressable>
              </ExternalLink>
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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🍃 Fauna terrestre y aves</Text>

          <Text style={styles.sectionIntro}>
            Estas fuentes recogen algunos de los criterios utilizados para
            orientar la actuación ante aves, vencejos, murciélagos y otros
            animales silvestres terrestres que puedan necesitar ayuda.
          </Text>

          {terrestrialSources.map((source) => (
            <View key={source.name} style={styles.card}>
              <Text style={styles.cardTitle}>{source.name}</Text>

              <Text style={styles.cardText}>{source.description}</Text>

              <ExternalLink href={source.url} asChild>
                <Pressable style={styles.linkButton}>
                  <Text style={styles.linkButtonText}>
                    Visitar {source.displayUrl}
                  </Text>
                </Pressable>
              </ExternalLink>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🌊 Fauna marina</Text>

          {marineSources.map((source) => (
            <View key={source.name} style={styles.card}>
              <Text style={styles.cardTitle}>{source.name}</Text>

              <Text style={styles.cardText}>{source.description}</Text>

              <ExternalLink href={source.url} asChild>
                <Pressable style={styles.linkButton}>
                  <Text style={styles.linkButtonText}>
                    Visitar {source.displayUrl}
                  </Text>
                </Pressable>
              </ExternalLink>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeadingRow}>
            <Text style={styles.sectionIcon}>⚖️</Text>
            <Text style={styles.sectionTitle}>
              Normativa básica sobre fauna silvestre
            </Text>
          </View>

          <Text style={styles.sectionIntro}>
            La normativa española protege la fauna silvestre y regula
            determinadas actuaciones sobre los animales y las especies
            protegidas. En caso de duda, se recomienda contactar con los
            servicios competentes antes de capturar, retener, trasladar o
            manipular un animal silvestre.
          </Text>

          {legalSources.map((source) => (
            <View key={source.name} style={styles.card}>
              <Text style={styles.cardTitle}>{source.name}</Text>

              <Text style={styles.cardText}>{source.description}</Text>

              <ExternalLink href={source.url} asChild>
                <Pressable style={styles.linkButton}>
                  <Text style={styles.linkButtonText}>
                    Visitar {source.displayUrl}
                  </Text>
                </Pressable>
              </ExternalLink>
            </View>
          ))}

          <Text style={styles.orientationNote}>
            Esta información tiene carácter orientativo. La gestión de la fauna
            silvestre corresponde en gran medida a las comunidades autónomas y
            puede variar según el territorio y la especie.
          </Text>
        </View>

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
    gap: 14,
  },
  sectionHeadingRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  sectionIcon: {
    fontSize: 22,
  },
  sectionTitle: {
    color: "#111827",
    fontSize: 24,
    fontWeight: "900",
  },
  sectionIntro: {
    color: "#4b5563",
    fontSize: 16,
    lineHeight: 25,
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
  orientationNote: {
    color: "#4b5563",
    fontSize: 14,
    fontStyle: "italic",
    lineHeight: 22,
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
