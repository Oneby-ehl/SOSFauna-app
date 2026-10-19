import { HeaderBackButton } from "@react-navigation/elements";
import { useRouter } from "expo-router";
import { Platform, Text } from "react-native";

export function TopicFaqBackButton({ tintColor }: { tintColor?: string }) {
  const router = useRouter();

  return (
    <HeaderBackButton
      href="/faq"
      tintColor={tintColor}
      displayMode="minimal"
      accessibilityLabel="Volver a preguntas frecuentes"
      onPress={() => router.navigate("/faq")}
    />
  );
}

export function TopicFaqHeaderTitle({ children }: { children: string }) {
  return (
    <>
      {Platform.OS === "web" ? (
        <style>{`
div:has(> [data-testid="sos-navigation-title"]) { flex-shrink:1; min-width:0; }
@media (max-width:320px) {
 [data-testid="sos-navigation-title"] { white-space:normal; overflow:visible; text-overflow:clip; font-size:16px !important; line-height:18px; }
}`}</style>
      ) : null}
      <Text testID="sos-navigation-title" numberOfLines={1} style={{ color: "#1f2937", fontSize: 18, fontWeight: "500" }}>
        {children}
      </Text>
    </>
  );
}
