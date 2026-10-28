import { FaqStyles, FaqIcon, faqWebPart } from "./FaqPresentation";
import SiteFooter from "@/components/web/SiteFooter";
import { Link, Stack } from "expo-router";
import { useMemo, useRef, useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { SeoHead, useInformationPagePath } from "@/components/i18n/InformationPageSupport";
import { interiorNavigationAppearance, TopicFaqBackButton, TopicFaqHeaderTitle } from "./TopicFaqHeader";
import { getFaqTopicsForLocale, type FaqTopicId } from "@/data/faqTopics";
import { getFaqSearchEngine } from "@/utils/faqSearch";
import TopicFaqAccordion, { TopicFaqAccordionStyles } from "./TopicFaqAccordion";
import { useI18n } from "@/i18n/I18nProvider";

export default function TopicFaqPage({ topicId }: { topicId: FaqTopicId }) {
  const { t, locale } = useI18n();
  const pagePath = useInformationPagePath();
  const faqTopics = getFaqTopicsForLocale(locale);
  const { searchFaqItems } = getFaqSearchEngine(locale);
  const topic = faqTopics[topicId];
  const [query, setQuery] = useState("");
  const inputRef = useRef<TextInput>(null);
  const results = useMemo(() => searchFaqItems(topic.items, query), [topic.items, query, searchFaqItems]);
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
      <Stack.Screen options={{ ...interiorNavigationAppearance, headerShown: true, title: topic.heading, ...(locale === "en" ? {
        headerTitle: TopicFaqHeaderTitle,
        headerLeft: ({ tintColor }: { tintColor?: string }) => <TopicFaqBackButton tintColor={tintColor} />,
      } : {}) }} />
      <FaqStyles />
      <TopicFaqAccordionStyles />
      <ScrollView {...faqWebPart("screen")} role="main" style={styles.screen} contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" stickyHeaderIndices={[1]}>
        <View {...faqWebPart("header")} style={styles.header}>
          <Text {...faqWebPart("eyebrow")} style={styles.eyebrow}>{t("common", "brandEyebrow")}</Text>
          <Text accessibilityRole="header" aria-level={1} {...faqWebPart("title")} style={styles.title}>{topic.heading}</Text>
          <Text {...faqWebPart("intro")} style={styles.intro}>{topic.intro}</Text>
        </View>
        <View {...faqWebPart("searchSection")} style={styles.search}>
          <View {...faqWebPart("searchInputWrap")} style={styles.inputWrap}>
            <FaqIcon kind="search" />
            <TextInput
              {...faqWebPart("searchInput")}
              ref={inputRef}
              accessibilityLabel={topic.searchLabel}
              placeholder={t("faqUi", "searchPlaceholder")}
              value={query}
              onChangeText={setQuery}
              returnKeyType="search"
              style={[styles.input, query.length > 0 && styles.inputWithClear]}
            />
            {query.length > 0 ? (
              <Pressable accessibilityRole="button" accessibilityLabel={t("faqUi", "clearSearch")} hitSlop={8} onPress={clearSearch} {...faqWebPart("clearSearchButton")} style={styles.clear}>
                {Platform.OS === "web" ? <FaqIcon kind="clear" /> : <Text style={styles.clearText}>✕</Text>}
              </Pressable>
            ) : null}
          </View>
        </View>
        <View {...faqWebPart("topicQuestions")} style={styles.questions}>
          {results.map((item) => (
            <TopicFaqAccordion key={item.id} id={item.id} question={item.question} answer={item.answer}>
              {item.showCreateNotice || item.showRecoveryCenters ? (
                <View {...faqWebPart("topicAnswerLinks")} style={styles.answerLinks}>
                  {item.showCreateNotice ? (
                    <View {...faqWebPart("createNoticeBox")} style={styles.createNoticeBox}>
                      <Text {...faqWebPart("createNoticeTitle")} style={styles.helpTitle}>{t("faqUi", "caseDoubtTitle")}</Text>
                      <Text {...faqWebPart("createNoticeText")} style={styles.helpText}>{t("faqUi", "caseDoubtText")}</Text>
                      <Link href={pagePath("home")} asChild>
                        <Pressable accessibilityRole="button" accessibilityLabel={t("navigation", "guide")} {...faqWebPart("createNoticeButton")} style={styles.helpButton}>
                          <Text {...faqWebPart("createNoticeButtonText")} style={styles.helpButtonText}>{t("navigation", "guide")}</Text>
                        </Pressable>
                      </Link>
                    </View>
                  ) : null}
                  {item.showRecoveryCenters ? (
                    <View {...faqWebPart("recoveryCentersBox")} style={styles.recoveryCentersBox}>
                      <Text {...faqWebPart("recoveryCentersTitle")} style={styles.helpTitle}>{t("faqUi", "centersPromptTitle")}</Text>
                      <Text {...faqWebPart("recoveryCentersText")} style={styles.helpText}>{t("faqUi", "centersPromptText")}</Text>
                      <Link href={pagePath("centers")} asChild>
                        <Pressable accessibilityRole="button" {...faqWebPart("recoveryCentersButton")} style={styles.helpButton}>
                          <Text {...faqWebPart("recoveryCentersButtonText")} style={styles.helpButtonText}>{t("navigation", "centers")}</Text>
                        </Pressable>
                      </Link>
                    </View>
                  ) : null}
                </View>
              ) : null}
            </TopicFaqAccordion>
          ))}
          {results.length === 0 ? <Text {...faqWebPart("intro")} style={styles.intro}>{t("faqUi", "topicNoResults")}</Text> : null}
        </View>
        {Platform.OS !== "web" ? <View {...faqWebPart("topicNavigation")} style={styles.navigation}>
          {locale === "en" ? (
            <>
              <Link href={pagePath("faq")} {...faqWebPart("intro")} style={styles.intro}>
                {t("faqUi", "backToFaq")}
              </Link>
              {topicId === "murcielagos" ? (
                <Link href={pagePath("centers")} {...faqWebPart("intro")} style={styles.intro}>
                  {t("navigation", "centers")}
                </Link>
              ) : null}
            </>
          ) : null}
          {Platform.OS !== "web" ? <Link href={pagePath("home")} asChild>
            <Pressable style={styles.backButton}>
              <Text style={styles.backButtonText}>{t("navigation", "backToBrand")}</Text>
            </Pressable>
          </Link> : null}
        </View> : null}
        <SiteFooter />
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
