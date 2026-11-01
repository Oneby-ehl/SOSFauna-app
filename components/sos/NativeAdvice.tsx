import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useI18n } from "@/i18n/I18nProvider";
import { getEffectiveCatalog } from "@/i18n/translate";
import { fauna } from "@/constants/androidPresentation";
import { InterfaceLabel } from "@/components/ui/InterfaceLabel";

// Android presentation for every generated protocol and species FAQ. Only exact
// structural catalog headings are decorated; prose, bullets and warnings retain
// their original wording and intentional inline symbols.
export default function NativeAdvice({ text }: { text: string }) {
  const { locale } = useI18n();
  const headings = useMemo(() => {
    const catalog = getEffectiveCatalog(locale);
    const result = new Map<string, "normal" | "warning" | "prohibition">();
    for (const [area, entries] of Object.entries(catalog)) {
      if (area !== "rescueHeadings" && !area.endsWith("Advice")) continue;
      for (const [key, value] of Object.entries(entries)) {
        if (area !== "rescueHeadings" && !/(?:title|heading)$/i.test(key)) continue;
        const line = value.trim();
        if (!line || line.includes("\n")) continue;
        const kind = /^doNot/i.test(key) ? "prohibition"
          : /warning|precaution|beforeIntervening/i.test(key) ? "warning" : "normal";
        result.set(line, kind);
      }
    }
    return result;
  }, [locale]);

  return <View style={styles.content}>{text.split("\n").map((line, index) => {
    const kind = headings.get(line.trim());
    if (kind) return <Text key={index} accessibilityRole="header"
      style={[styles.heading, kind === "warning" && styles.warning, kind === "prohibition" && styles.prohibition]}>
      <InterfaceLabel text={line.trim()} color={kind === "prohibition" ? fauna.danger : kind === "warning" ? "#685320" : fauna.forest} />
    </Text>;
    if (!line.trim()) return <View key={index} style={styles.space} accessible={false} />;
    return <Text key={index} style={styles.paragraph}>{line}</Text>;
  })}</View>;
}

const styles = StyleSheet.create({
  content: { alignSelf: "stretch", minWidth: 0 },
  paragraph: { color: fauna.ink, fontSize: 16, lineHeight: 26 },
  heading: { color: fauna.forest, fontSize: 17, lineHeight: 26, fontWeight: "500", marginTop: 8, marginBottom: 6, paddingBottom: 5, borderBottomWidth: 1, borderBottomColor: fauna.border },
  warning: { color: "#685320", borderBottomColor: fauna.gold },
  prohibition: { color: fauna.danger, borderBottomColor: "#dfcfc6" },
  space: { height: 6 },
});
