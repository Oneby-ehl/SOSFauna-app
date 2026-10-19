import { Link, Stack } from "expo-router";
import { useMemo, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { SeoHead } from "@/components/seo/SeoHead";
import { faqTopics, type FaqTopicId } from "@/data/faqTopics";
import { searchFaqItems } from "@/utils/faqSearch";
import TopicFaqAccordion, { TopicFaqAccordionStyles } from "./TopicFaqAccordion";

export default function TopicFaqPage({ topicId }: { topicId: FaqTopicId }) {
  const topic = faqTopics[topicId];
  const [query, setQuery] = useState("");
  const inputRef = useRef<TextInput>(null);
  const results = useMemo(() => searchFaqItems(topic.items, query), [topic.items, query]);
  const structuredData = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: topic.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  }), [topic.items]);

  const clearSearch = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  return (
    <>
      <SeoHead title={topic.title} description={topic.description} path={topic.path} structuredData={query.trim() ? undefined : structuredData} />
      <Stack.Screen options={{ headerShown: true, title: topic.heading }} />
      <TopicFaqAccordionStyles />
      <ScrollView role="main" style={styles.screen} contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" stickyHeaderIndices={[1]}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>SOS FAUNA ESPAÑA</Text>
          <Text accessibilityRole="header" aria-level={1} style={styles.title}>{topic.heading}</Text>
          <Text style={styles.intro}>{topic.intro}</Text>
        </View>
        <View style={styles.search}>
          <View style={styles.inputWrap}>
            <TextInput
              ref={inputRef}
              accessibilityLabel={topic.searchLabel}
              placeholder="Buscar una pregunta…"
              value={query}
              onChangeText={setQuery}
              returnKeyType="search"
              style={[styles.input, query.length > 0 && styles.inputWithClear]}
            />
            {query.length > 0 ? (
              <Pressable accessibilityRole="button" accessibilityLabel="Limpiar búsqueda" hitSlop={8} onPress={clearSearch} style={styles.clear}>
                <Text style={styles.clearText}>✕</Text>
              </Pressable>
            ) : null}
          </View>
        </View>
        <View style={styles.questions}>
          {results.map((item) => (
            <TopicFaqAccordion key={item.id} id={item.id} question={item.question} answer={item.answer}>
              {item.showCreateNotice || item.showRecoveryCenters ? (
                <View style={styles.answerLinks}>
                  {item.showCreateNotice ? (
                    <View style={styles.createNoticeBox}>
                      <Text style={styles.helpTitle}>¿Tienes dudas sobre este caso?</Text>
                      <Text style={styles.helpText}>La Guía de ayuda asistida de SOS Fauna España te ayudará a valorar la situación paso a paso.</Text>
                      <Link href="/" asChild>
                        <Pressable accessibilityRole="button" accessibilityLabel="Guía de ayuda asistida" style={styles.helpButton}>
                          <Text style={styles.helpButtonText}>Guía de ayuda asistida</Text>
                        </Pressable>
                      </Link>
                    </View>
                  ) : null}
                  {item.showRecoveryCenters ? (
                    <View style={styles.recoveryCentersBox}>
                      <Text style={styles.helpTitle}>¿Necesitas localizar un centro?</Text>
                      <Text style={styles.helpText}>Consulta los centros de recuperación y teléfonos de ayuda disponibles en tu provincia.</Text>
                      <Link href="/centros" asChild>
                        <Pressable accessibilityRole="button" style={styles.helpButton}>
                          <Text style={styles.helpButtonText}>Centros de Recuperación y teléfonos de ayuda</Text>
                        </Pressable>
                      </Link>
                    </View>
                  ) : null}
                </View>
              ) : null}
            </TopicFaqAccordion>
          ))}
          {results.length === 0 ? <Text style={styles.intro}>No hemos encontrado preguntas que coincidan con tu búsqueda en este tema.</Text> : null}
        </View>
        <View style={styles.navigation}>
          <Link href="/" asChild>
            <Pressable style={styles.backButton}>
              <Text style={styles.backButtonText}>Volver a SOS Fauna España</Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f3f7f4" },
  container: { width: "100%", maxWidth: 960, alignSelf: "center", paddingHorizontal: 24, paddingTop: 48, paddingBottom: 64, gap: 28 },
  header: { gap: 12 },
  eyebrow: { color: "#166534", fontSize: 13, fontWeight: "800", letterSpacing: 1.2 },
  title: { color: "#14532d", fontSize: 38, lineHeight: 44, fontWeight: "900" },
  intro: { maxWidth: 760, color: "#4b5563", fontSize: 17, lineHeight: 27 },
  search: { gap: 14, marginHorizontal: -24, paddingHorizontal: 24, paddingTop: 12, paddingBottom: 14, backgroundColor: "#f3f7f4", borderBottomWidth: 1, borderBottomColor: "#dbe7dd", zIndex: 10 },
  inputWrap: { position: "relative" },
  input: { minHeight: 52, borderWidth: 1, borderColor: "#b7dfc0", borderRadius: 14, backgroundColor: "#ffffff", paddingHorizontal: 16, paddingVertical: 12, color: "#111827", fontSize: 16 },
  inputWithClear: { paddingRight: 52 },
  clear: { position: "absolute", right: 10, top: 8, width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center", backgroundColor: "#eef8f0" },
  clearText: { color: "#166534", fontSize: 16, fontWeight: "900", lineHeight: 20 },
  questions: { gap: 10 },
  answerLinks: { gap: 14 },
  createNoticeBox: { backgroundColor: "#eef8f0", borderWidth: 1, borderColor: "#b7dfc0", borderRadius: 14, padding: 14, gap: 8 },
  recoveryCentersBox: { backgroundColor: "#f3f4f6", borderWidth: 1, borderColor: "#d1d5db", borderRadius: 14, padding: 14, gap: 8 },
  helpTitle: { color: "#14532d", fontSize: 15, fontWeight: "900", lineHeight: 21 },
  helpText: { color: "#374151", fontSize: 14, lineHeight: 21 },
  helpButton: { alignSelf: "flex-start", minHeight: 42, marginTop: 2, backgroundColor: "#14532d", borderRadius: 12, paddingHorizontal: 16, alignItems: "center", justifyContent: "center" },
  helpButtonText: { color: "#ffffff", fontSize: 14, fontWeight: "900" },
  navigation: { gap: 16, paddingTop: 8 },
  backButton: { alignSelf: "flex-start", backgroundColor: "#14532d", borderRadius: 14, paddingHorizontal: 20, paddingVertical: 12 },
  backButtonText: { color: "#ffffff", fontSize: 15, fontWeight: "800" },
});
