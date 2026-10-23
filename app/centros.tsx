import { Stack } from "expo-router";

import RecoveryCentersPage from "@/components/contacts/RecoveryCentersPage";
import { SeoHead } from "@/components/i18n/InformationPageSupport";
import { useI18n } from "@/i18n/I18nProvider";

export default function CentrosRoute() {
  const { t, locale } = useI18n();
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
            locale === "en" ? `${t("navigation", "centers")} | SOS Fauna España` : "Centros, redes y teléfonos de ayuda para fauna | SOS Fauna España",
        }}
      />

      <RecoveryCentersPage />
    </>
  );
}
