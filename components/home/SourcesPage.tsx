import { Link, Stack } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { ExternalLink } from "@/components/external-link";
import { SeoHead, useInformationPagePath } from "@/components/i18n/InformationPageSupport";
import { useI18n } from "@/i18n/I18nProvider";

const institutionalSources = [
  {
    nameKey: "institutional1Name",
    descriptionKey:
      "institutional1Description",
    url: "https://www.proteccioncivil.es/catalogo/info112/",
    displayUrlKey: "institutional1DisplayUrl",
  },
  {
    nameKey: "institutional2Name",
    descriptionKey:
      "institutional2Description",
    url: "https://www.guardiacivil.es",
    displayUrlKey: "institutional2DisplayUrl",
  },
  {
    nameKey: "institutional3Name",
    descriptionKey:
      "institutional3Description",
    url: "https://www.policia.es",
    displayUrlKey: "institutional3DisplayUrl",
  },
  {
    nameKey: "institutional4Name",
    descriptionKey:
      "institutional4Description",
    url: "https://www.comunidad.madrid/centros/emisora-cuerpo-agentes-forestales",
    displayUrlKey: "institutional4DisplayUrl",
  },
] as const;

const legalSources = [
  {
    nameKey: "legal1Name",
    descriptionKey:
      "legal1Description",
    url: "https://www.boe.es/buscar/act.php?id=BOE-A-2007-21490",
    displayUrlKey: "legal1DisplayUrl",
  },
  {
    nameKey: "legal2Name",
    descriptionKey:
      "legal2Description",
    url: "https://www.boe.es/buscar/act.php?id=BOE-A-2011-3582",
    displayUrlKey: "legal2DisplayUrl",
  },
  {
    nameKey: "legal3Name",
    descriptionKey:
      "legal3Description",
    url: "https://www.miteco.gob.es/es/biodiversidad/temas/conservacion-de-especies/especies-silvestres/ce-silvestres-conservacion-normativa.html",
    displayUrlKey: "legal3DisplayUrl",
  },
] as const;

const terrestrialSources = [
  {
    nameKey: "terrestrial1Name",
    descriptionKey:
      "terrestrial1Description",
    url: "https://seo.org/",
    displayUrlKey: "terrestrial1DisplayUrl",
  },
  {
    nameKey: "terrestrial2Name",
    descriptionKey:
      "terrestrial2Description",
    url: "https://grefa.org/",
    displayUrlKey: "terrestrial2DisplayUrl",
  },
  {
    nameKey: "terrestrial3Name",
    descriptionKey:
      "terrestrial3Description",
    url: "http://www.falciotnegre.com/",
    displayUrlKey: "terrestrial3DisplayUrl",
  },
  {
    nameKey: "terrestrial4Name",
    descriptionKey:
      "terrestrial4Description",
    url: "https://secemu.org/recomendaciones/que-hacer-si-te-encuentras-un-murcielago/",
    displayUrlKey: "terrestrial4DisplayUrl",
  },
] as const;

const marineSources = [
  {
    nameKey: "marine1Name",
    descriptionKey:
      "marine1Description",
    url: "https://fundacionoceanografic.org/sumate/que-hacer-si-encuentras-un-animalmarino-en-problemas/",
    displayUrlKey: "marine1DisplayUrl",
  },
  {
    nameKey: "marine2Name",
    descriptionKey:
      "marine2Description",
    url: "https://palmaaquarium.com/tortugas-del-centro-de-rescate",
    displayUrlKey: "marine2DisplayUrl",
  },
  {
    nameKey: "marine3Name",
    descriptionKey:
      "marine3Description",
    url: "https://www.juntadeandalucia.es/medioambiente/portal/areas-tematicas/biodiversidad-y-vegetacion/ecosistemas-y-capital-natural/medio-marino/atencion-de-emergencias-frente-a-varamientos-de-mamiferos-y-tortugas-marinas",
    displayUrlKey: "marine3DisplayUrl",
  },
  {
    nameKey: "marine4Name",
    descriptionKey:
      "marine4Description",
    url: "https://www.gobiernodecanarias.org/medioambiente/publicaciones/material-publicado/libros/varamiento-cetaceos-tortugas/index.html",
    displayUrlKey: "marine4DisplayUrl",
  },
  {
    nameKey: "marine5Name",
    descriptionKey:
      "marine5Description",
    url: "https://www.gobiernodecanarias.org/medioambiente/descargas/Biodiversidad/documentos-interes/buenas-practicas/2012_09_18_Guia_BPRCT_REDNATURA_web_tcm7-229984.pdf",
    displayUrlKey: "marine5DisplayUrl",
  },
] as const;

export default function SourcesPage() {
  const { t, locale } = useI18n();
  const pagePath = useInformationPagePath();
  return (
    <>
      <SeoHead
        title="Recursos de información sobre fauna silvestre | SOS Fauna España"
        description="Organismos públicos, normativa y recursos útiles para actuar ante incidencias con fauna silvestre terrestre o marina en España."
        path="/sources"
      />
      <Stack.Screen
        options={{ title: locale === "en" ? `${t("navigation", "sources")} | SOS Fauna España` : "Recursos de información | SOS Fauna España" }}
      />

      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.container}
      >
        <View style={styles.header}>
          <Text style={styles.eyebrow}>{t("common", "brandEyebrow")}</Text>
          <Text accessibilityRole="header" aria-level={1} style={styles.title}>{t("navigation", "sources")}</Text>

          <Text style={styles.intro}>
            {t("sources", "intro1")}
          </Text>
        </View>

        <View style={styles.section}>
          <Text accessibilityRole="header" aria-level={2} style={styles.sectionTitle}>{t("navigation", "sources")}</Text>

          {institutionalSources.map((source) => (
            <View key={source.nameKey} style={styles.card}>
              <Text accessibilityRole="header" aria-level={3} style={styles.cardTitle}>{t("sources", source.nameKey)}</Text>

              <Text style={styles.cardText}>{t("sources", source.descriptionKey)}</Text>

              <ExternalLink href={source.url} asChild>
                <Pressable style={styles.linkButton}>
                  <Text style={styles.linkButtonText}>
                    {t("sources", "visitPrefix")}{t("sources", source.displayUrlKey)}
                  </Text>
                </Pressable>
              </ExternalLink>
            </View>
          ))}
        </View>

        <View style={styles.notice}>
          <Text accessibilityRole="header" aria-level={2} style={styles.noticeTitle}>
            {t("sources", "noticeTitle1")}
          </Text>
        
          <Text style={styles.noticeText}>
            {t("sources", "noticeText1")}
          </Text>
        
          <Text style={styles.noticeText}>
            {t("sources", "noticeText2")}
          </Text>
        </View>

        <View style={styles.notice}>
          <Text accessibilityRole="header" aria-level={2} style={styles.noticeTitle}><Link href="/centros">{t("sources", "text1")}</Link></Text>

          <Text style={styles.noticeText}>
            {t("sources", "noticeText3")}
          </Text>

          <Text style={styles.noticeText}>
            {t("sources", "noticeText4")}
          </Text>
        </View>

        <View style={styles.section}>
          <Text accessibilityRole="header" aria-level={2} style={styles.sectionTitle}>{t("sources", "sectionTitle1")}</Text>

          <Text style={styles.sectionIntro}>
            {t("sources", "sectionIntro1")}
          </Text>

          {terrestrialSources.map((source) => (
            <View key={source.nameKey} style={styles.card}>
              <Text accessibilityRole="header" aria-level={3} style={styles.cardTitle}>{t("sources", source.nameKey)}</Text>

              <Text style={styles.cardText}>{t("sources", source.descriptionKey)}</Text>

              <ExternalLink href={source.url} asChild>
                <Pressable style={styles.linkButton}>
                  <Text style={styles.linkButtonText}>
                    {t("sources", "visitPrefix")}{t("sources", source.displayUrlKey)}
                  </Text>
                </Pressable>
              </ExternalLink>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text accessibilityRole="header" aria-level={2} style={styles.sectionTitle}>{t("sources", "sectionTitle2")}</Text>

          {marineSources.map((source) => (
            <View key={source.nameKey} style={styles.card}>
              <Text accessibilityRole="header" aria-level={3} style={styles.cardTitle}>{t("sources", source.nameKey)}</Text>

              <Text style={styles.cardText}>{t("sources", source.descriptionKey)}</Text>

              <ExternalLink href={source.url} asChild>
                <Pressable style={styles.linkButton}>
                  <Text style={styles.linkButtonText}>
                    {t("sources", "visitPrefix")}{t("sources", source.displayUrlKey)}
                  </Text>
                </Pressable>
              </ExternalLink>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeadingRow}>
            <Text style={styles.sectionIcon}>⚖️</Text>
            <Text accessibilityRole="header" aria-level={2} style={styles.sectionTitle}>
              {t("sources", "sectionTitle3")}
            </Text>
          </View>

          <Text style={styles.sectionIntro}>
            {t("sources", "sectionIntro2")}
          </Text>

          {legalSources.map((source) => (
            <View key={source.nameKey} style={styles.card}>
              <Text accessibilityRole="header" aria-level={3} style={styles.cardTitle}>{t("sources", source.nameKey)}</Text>

              <Text style={styles.cardText}>{t("sources", source.descriptionKey)}</Text>

              <ExternalLink href={source.url} asChild>
                <Pressable style={styles.linkButton}>
                  <Text style={styles.linkButtonText}>
                    {t("sources", "visitPrefix")}{t("sources", source.displayUrlKey)}
                  </Text>
                </Pressable>
              </ExternalLink>
            </View>
          ))}

          <Text style={styles.orientationNote}>
            {t("sources", "orientationNote1")}
          </Text>
        </View>

        <Link href={pagePath("home")} asChild>
          <Pressable style={styles.backButton}>
            <Text style={styles.backButtonText}>{t("navigation", "backToBrand")}</Text>
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
