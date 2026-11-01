import { StyleSheet } from "react-native";
import { editorialTitle, fauna } from "@/constants/androidPresentation";

// Applied through the Android-only style adapter in both FAQ presentations.
export const caseHelpStyles = StyleSheet.create({
  card: { backgroundColor: fauna.sage, borderWidth: 1, borderColor: fauna.outline, borderRadius: 12, padding: 16, gap: 12 },
  title: { ...editorialTitle, fontSize: 22, lineHeight: 30, letterSpacing: 0 },
  text: { color: fauna.muted, fontSize: 15, lineHeight: 24, fontWeight: "400" },
  button: { alignSelf: "stretch", minHeight: 48, maxWidth: "100%", borderRadius: 10, backgroundColor: fauna.forest, paddingHorizontal: 16, paddingVertical: 12, alignItems: "center", justifyContent: "center" },
  buttonText: { color: fauna.paper, fontSize: 15, lineHeight: 22, fontWeight: "500", textAlign: "center" },
});
