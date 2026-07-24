import Constants from "expo-constants";
import { Platform, StyleSheet, Text } from "react-native";

function getPlatformName(): string {
  return Platform.select({
    ios: "iOS",
    android: "Android",
    web: "Web",
    default: Platform.OS,
  });
}

export function getAppVersion(): string {
  return Constants.expoConfig?.version ?? "desconocida";
}

export default function AppVersionFooter() {
  return (
    <>
      <Text style={styles.text}>
        {getPlatformName()} · Versión {getAppVersion()}
      </Text>
      <Text style={styles.text}>© 2026 SOS Fauna España</Text>
    </>
  );
}

const styles = StyleSheet.create({
  text: {
    color: "#7a877f",
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
  },
});
