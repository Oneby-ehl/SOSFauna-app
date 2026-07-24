import { Stack } from 'expo-router';
import AppVersionGate from "@/components/AppVersionGate";

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
      </Stack>
    </AppVersionGate>
  );
}
