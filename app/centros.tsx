import { Stack } from "expo-router";

import RecoveryCentersPage from "@/components/contacts/RecoveryCentersPage";
import { SeoHead } from "@/components/seo/SeoHead";

export default function CentrosRoute() {
  return (
    <>
      <SeoHead
        title="Centros de recuperación de fauna y teléfonos de ayuda | SOS Fauna España"
        description="Consulta centros de recuperación de fauna silvestre y teléfonos de ayuda por provincia en España."
        path="/centros"
      />
      <Stack.Screen
        options={{
          title:
            "Centros de recuperación de fauna y teléfonos de ayuda | SOS Fauna España",
        }}
      />

      <RecoveryCentersPage />
    </>
  );
}
