import { Stack } from "expo-router";
import PrivacyPage from "@/components/home/PrivacyPage";

export default function PrivacyRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Política de privacidad",
        }}
      />
      <PrivacyPage />
    </>
  );
}