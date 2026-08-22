import { Stack } from "expo-router";

import RecoveryCentersPage from "@/components/contacts/RecoveryCentersPage";
import { SeoHead } from "@/components/seo/SeoHead";

export default function CentrosRoute() {
  return (
    <>
      <SeoHead
        title="Centros, redes y teléfonos de ayuda para fauna | SOS Fauna España"
        description="Consulta por provincia centros de recuperación, redes de varamientos, recursos especializados y teléfonos de ayuda para fauna silvestre."
        path="/centros"
      />
      <Stack.Screen
        options={{
          title:
            "Centros, redes y teléfonos de ayuda para fauna | SOS Fauna España",
        }}
      />

      <RecoveryCentersPage />
    </>
  );
}
