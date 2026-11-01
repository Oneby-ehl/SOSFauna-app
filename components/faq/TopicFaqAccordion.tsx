import NativeAdvice from "@/components/sos/NativeAdvice";
import { InterfaceLabel } from "@/components/ui/InterfaceLabel";
import { FaqIcon } from "./FaqPresentation";
import { useState, type ReactNode } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { androidPresentation, fauna } from "@/constants/androidPresentation";

export type TopicFaqAccordionProps = {
  id: string;
  question: string;
  answer: string;
  children?: ReactNode;
};

export function TopicFaqAccordionStyles() {
  return null;
}

export default function TopicFaqAccordion({ id, question, answer, children }: TopicFaqAccordionProps) {
  const [open, setOpen] = useState(false);
  return (
    <View style={styles.card}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={question}
        accessibilityState={{ expanded: open }}
        onPress={() => setOpen((current) => !current)}
        style={styles.question}
      >
        <Text accessibilityRole="header" aria-level={2} style={styles.questionText}><InterfaceLabel text={question} /></Text>
        {Platform.OS === "android" ? <FaqIcon kind="expand" expanded={open} /> : <Text style={styles.indicator}>{open ? "−" : "+"}</Text>}
      </Pressable>
      {open ? (
        <View nativeID={id + "-answer"} style={styles.answer}>
          {Platform.OS === "android" ? <NativeAdvice text={answer} /> : <Text style={styles.answerText}>{answer}</Text>}
          {children}
        </View>
      ) : null}
    </View>
  );
}

const styles = androidPresentation(StyleSheet.create({
  card: { borderWidth: 1, borderColor: "#dbe7dd", borderRadius: 16, backgroundColor: "#ffffff", overflow: "hidden" },
  question: { minHeight: 58, paddingHorizontal: 18, paddingVertical: 14, flexDirection: "row", alignItems: "center", gap: 12 },
  questionText: { flex: 1, color: "#14532d", fontSize: 17, lineHeight: 24, fontWeight: "800" },
  indicator: { width: 28, color: "#166534", fontSize: 24, fontWeight: "900", lineHeight: 28, textAlign: "center" },
  answer: { paddingHorizontal: 18, paddingVertical: 16, borderTopWidth: 1, borderTopColor: "#e5e7eb", gap: 14 },
  answerText: { color: "#374151", fontSize: 16, lineHeight: 25 },
}), {
  card: { borderRadius: 10 },
  question: { paddingHorizontal: 14, paddingVertical: 12 },
  questionText: { color: fauna.ink, fontWeight: "500" },
  answer: { paddingHorizontal: 14, gap: 12 },
  answerText: { color: fauna.ink, lineHeight: 26 },
});
