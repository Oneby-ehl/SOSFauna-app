import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Platform, View } from "react-native";
import { fauna } from "@/constants/androidPresentation";

// Native decoration only; filtering and answer text remain in the page.
export function FaqStyles() { return null; }
export function faqWebPart(_part: string, _active?: boolean): Record<string, unknown> { return {}; }
export type FaqIconProps = { kind: "search" | "clear" | "expand"; expanded?: boolean };
export function FaqIcon({ kind }: FaqIconProps) {
  if (Platform.OS !== "android" || kind !== "search") return null;
  return <View pointerEvents="none" accessible={false} style={{ position: "absolute", left: 12, top: 0, bottom: 0, justifyContent: "center", zIndex: 1 }}>
    <MaterialIcons name="search" size={20} color={fauna.subtle} />
  </View>;
}

export function FaqAnswer(_props: { text: string }) { return null; }
