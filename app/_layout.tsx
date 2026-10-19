import { Stack } from 'expo-router';
import AppVersionGate from "@/components/AppVersionGate";
import { TopicFaqBackButton, TopicFaqHeaderTitle } from "@/components/faq/TopicFaqHeader";

export default function RootLayout() {
  return (
    <AppVersionGate>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#f5f7f8' },
          headerTintColor: '#1f2937',
          contentStyle: { backgroundColor: '#ffffff' },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: "SOS Fauna España",
            headerShown: false,
            headerBackVisible: false,
            headerLeft: () => null,
          }}
        />
        <Stack.Screen
          name="about"
          options={{ title: "Sobre SOS Fauna España" }}
        />
        <Stack.Screen
          name="faq"
          options={{
            title: "Preguntas frecuentes sobre fauna silvestre | SOS Fauna España",
            headerTitle: TopicFaqHeaderTitle,
          }}
        />
        <Stack.Screen
          name="centros"
          options={{
            title: "Centros, redes y teléfonos de ayuda para fauna | SOS Fauna España",
            headerTitle: TopicFaqHeaderTitle,
          }}
        />
        <Stack.Screen
          name="sources"
          options={{
            title: "Recursos de información | SOS Fauna España",
            headerTitle: TopicFaqHeaderTitle,
          }}
        />
        <Stack.Screen
          name="faq/vencejos"
          options={{
            headerShown: true,
            title: "Preguntas frecuentes sobre vencejos",
            headerTitle: TopicFaqHeaderTitle,
            headerLeft: ({ tintColor }) => <TopicFaqBackButton tintColor={tintColor} />,
          }}
        />
        <Stack.Screen
          name="faq/murcielagos"
          options={{
            headerShown: true,
            title: "Preguntas frecuentes sobre murciélagos",
            headerTitle: TopicFaqHeaderTitle,
            headerLeft: ({ tintColor }) => <TopicFaqBackButton tintColor={tintColor} />,
          }}
        />
      </Stack>
    </AppVersionGate>
  );
}
