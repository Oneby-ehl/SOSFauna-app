import type { PropsWithChildren } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { SectionCard as OriginalSectionCard } from "./SectionCard";
import { editorialTitle, fauna } from "@/constants/androidPresentation";

type Props = PropsWithChildren<{ title: string; subtitle?: string; step?: number }>;

export function SectionCard({ title, subtitle, step, children }: Props) {
  if (Platform.OS !== "android") {
    return <OriginalSectionCard title={title} subtitle={subtitle}>{children}</OriginalSectionCard>;
  }
  return <View style={styles.card}>
    <Text accessibilityRole="header" style={styles.title}>{title}</Text>
    {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    {step !== undefined ? <View style={styles.progress} accessible accessibilityRole="progressbar"
      accessibilityLabel={title} accessibilityValue={{ min: 0, max: 4, now: step }}>
      {[1, 2, 3, 4].map(number => <View key={number} style={[styles.segment, number <= step && styles.current]} />)}
    </View> : null}
    <View style={styles.content}>{children}</View>
  </View>;
}

const styles = StyleSheet.create({
  card: { backgroundColor: fauna.surface, borderWidth: 1, borderColor: fauna.border, borderRadius: 12, padding: 16, gap: 16 },
  title: { ...editorialTitle, fontSize: 26, lineHeight: 34 },
  subtitle: { color: fauna.muted, fontSize: 14, lineHeight: 22 },
  content: { gap: 12 },
  progress: { flexDirection: "row", gap: 6 },
  segment: { flex: 1, height: 4, borderRadius: 2, backgroundColor: "#dce2d7" },
  current: { backgroundColor: "#234a3a" },
});
