import type { PropsWithChildren } from "react";
import { Platform, ScrollView, View, type StyleProp, type ViewStyle } from "react-native";
import AndroidFooter from "./AndroidFooter";

// Loading/error pages also need a footer reachable on small Android screens.
export default function FooterScreen({ children, style }: PropsWithChildren<{ style: StyleProp<ViewStyle> }>) {
  if (Platform.OS !== "android") return <View style={style}>{children}</View>;
  return <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
    <View style={style}>{children}</View>
    <AndroidFooter safeBottom />
  </ScrollView>;
}
