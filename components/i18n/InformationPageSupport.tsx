import { usePathname } from "expo-router";
import type { ComponentProps } from "react";
import { Platform } from "react-native";

import { SeoHead as PublicSeoHead } from "@/components/seo/SeoHead";
import { useI18n } from "@/i18n/I18nProvider";
import { getEnglishDevelopmentPage, isLocalLanguagePreview, isWebLanguageEnabled, type InformationPageId } from "@/i18n/developmentPreview";
import { getLocalizedPath, matchLocalizedRoute } from "@/i18n/routes";

const englishSeo: Record<InformationPageId, { title: string; description: string }> = {
  home: {
    title: "Injured Wildlife in Spain: What to Do | SOS Fauna España",
    description: "Found an injured or trapped wild animal in Spain? Get step-by-step guidance and find wildlife rescue centres and emergency contacts. Independent project.",
  },
  faq: {
    title: "Wildlife Help FAQs for Spain | SOS Fauna España",
    description: "Answers about injured birds, baby birds on the ground, trapped animals and finding wildlife help in Spain. Read the precautions before taking action.",
  },
  swifts: {
    title: "Found a Swift on the Ground? Help in Spain | SOS Fauna España",
    description: "Found a swift on the ground in Spain? Read guidance on chicks, injuries and when to seek specialist help, plus answers about swift behaviour and biology.",
  },
  bats: {
    title: "Found a Bat in Spain? What to Do | SOS Fauna España",
    description: "Found a bat in Spain? Read precautions, guidance on young or injured bats and when to seek specialist help. Includes bite and pet-contact safety information.",
  },
  centers: {
    title: "Wildlife Rescue Centres in Spain | SOS Fauna España",
    description: "Wildlife rescue centres and emergency contacts in Spain, organised by province. Independent directory; assistance in English is not guaranteed.",
  },
  about: {
    title: "About SOS Fauna España | Help for Wildlife",
    description: "Learn about SOS Fauna España, an independent project offering guidance on wildlife incidents and helping people find the appropriate services in Spain.",
  },
  contact: {
    title: "Contact | SOS Fauna España",
    description: "Contact SOS Fauna España to report errors, suggest improvements or ask questions about how the project works.",
  },
  privacy: {
    title: "Privacy Policy | SOS Fauna España",
    description: "Find out how SOS Fauna España handles permissions, local storage and information used in the web and Android applications.",
  },
  legal: {
    title: "Legal Notice | SOS Fauna España",
    description: "Legal information, terms of use and limitations of liability for SOS Fauna España, an independent wildlife guidance application.",
  },
  sources: {
    title: "Wildlife Information Sources | SOS Fauna España",
    description: "Public bodies, legislation and useful resources for responding to incidents involving land and marine wildlife in Spain.",
  },
  guide: {
    title: "Assisted Care Guide | SOS Fauna España",
    description: "Step-by-step guidance for assessing a wildlife incident, gathering information and finding appropriate help in Spain.",
  },
  history: {
    title: "My Reports | SOS Fauna España",
    description: "View completed wildlife reports saved on this device.",
  },
};

export function useInformationPagePath() {
  const { locale } = useI18n();
  const preview = isWebLanguageEnabled(Platform.OS === "web" ? "web" : "native") && locale === "en";
  return (id: InformationPageId) => getLocalizedPath(id, preview ? "en" : "es");
}

// Keep Spanish metadata unchanged. English uses the same metadata renderer;
// local previews remain noindex under the existing publication settings.
export function SeoHead(props: ComponentProps<typeof PublicSeoHead>) {
  const pathname = usePathname();
  const { locale } = useI18n();
  const platform = Platform.OS === "web" ? "web" : "native";
  const id = matchLocalizedRoute(pathname);
  const page = id && getEnglishDevelopmentPage(getLocalizedPath(id, "en"), platform);
  if (!isWebLanguageEnabled(platform) || !page) return <PublicSeoHead {...props} />;
  const robots = isLocalLanguagePreview(platform)
    ? "noindex, nofollow" : props.robots ?? "index, follow";
  const es = getLocalizedPath(page, "es"), en = getLocalizedPath(page, "en");
  const alternates = [{ locale: "es", path: es }, { locale: "en", path: en }, { locale: "x-default", path: es }];
  if (locale === "es") return <PublicSeoHead {...props} robots={robots} alternates={alternates} />;
  const { title, description } = englishSeo[page];
  const data = props.structuredData;
  const structuredData = data ? {
    ...data,
    inLanguage: "en",
    ...(typeof data.url === "string" ? { url: `https://sosfauna.es${en}` } : {}),
    ...(typeof data.description === "string" ? { description } : {}),
    ...(typeof data.name === "string" && page !== "home" ? { name: title } : {}),
    ...(data.isPartOf && typeof data.isPartOf === "object" && !Array.isArray(data.isPartOf)
      ? { isPartOf: { ...data.isPartOf, url: "https://sosfauna.es/en/" } } : {}),
  } : undefined;
  return <PublicSeoHead {...props} title={title} description={description} path={en}
    robots={robots} alternates={alternates} locale="en" structuredData={structuredData} />;
}

export function NoIndexHead({ path, title = "SOS Fauna España" }: { path: string; title?: string }) {
  return <SeoHead path={path} title={title} description="Pantalla interna de SOS Fauna España." robots="noindex, nofollow" includeGlobalStructuredData={false} />;
}
