import Head from "expo-router/head";
import { usePathname } from "expo-router";
import type { ComponentProps } from "react";
import { Platform } from "react-native";

import { SeoHead as PublicSeoHead } from "@/components/seo/SeoHead";
import { useI18n } from "@/i18n/I18nProvider";
import { getEnglishDevelopmentPage, isLocalLanguagePreview, isWebLanguageEnabled, type InformationPageId } from "@/i18n/developmentPreview";
import { getLocalizedPath, matchLocalizedRoute } from "@/i18n/routes";
import { getCatalog } from "@/i18n/translate";

const englishSeo: Partial<Record<InformationPageId, { title: string; description: string }>> = {
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
};

export function useInformationPagePath() {
  const { locale } = useI18n();
  const preview = isWebLanguageEnabled(Platform.OS === "web" ? "web" : "native") && locale === "en";
  return (id: InformationPageId) => getLocalizedPath(id, preview ? "en" : "es");
}

// Preview-only reciprocal metadata. Public Spanish SEO and Open Graph retain
// their existing inputs. Both languages remain noindex until publication approval.
export function SeoHead(props: ComponentProps<typeof PublicSeoHead>) {
  const pathname = usePathname();
  const { t, locale } = useI18n();
  const platform = Platform.OS === "web" ? "web" : "native";
  const id = matchLocalizedRoute(pathname);
  const page = id && getEnglishDevelopmentPage(getLocalizedPath(id, "en"), platform);
  if (!isWebLanguageEnabled(platform) || !page) return <PublicSeoHead {...props} />;
  const robots = isLocalLanguagePreview(platform)
    ? "noindex, nofollow" : props.robots ?? "index, follow";
  const es = getLocalizedPath(page, "es"), en = getLocalizedPath(page, "en");
  const alternates = [{ locale: "es", path: es }, { locale: "en", path: en }, { locale: "x-default", path: es }];
  if (locale === "es") return <PublicSeoHead {...props} robots={robots} alternates={alternates} />;
  const metadata = englishSeo[page];
  const title = metadata?.title ?? (page === "home" ? t("common", "brand")
    : page === "swifts" ? t("faqTopics", "vencejosHeading")
    : page === "bats" ? t("faqTopics", "murcielagosHeading")
    : t("navigation", page));
  const c = getCatalog("en");
  const descriptions: Record<InformationPageId, string> = {
    home: c.home.heroDescription, about: c.about.intro1, sources: c.sources.intro1,
    contact: c.contact.intro1, privacy: c.privacy.paragraph3, legal: c.legal.guidanceParagraph1,
    faq: c.faqUi.intro, swifts: c.faqTopics.vencejosIntro, bats: c.faqTopics.murcielagosIntro,
    centers: c.centers.intro, guide: c.home.heroDescription,
  };
  return <Head>
    <title>{title}</title><meta name="description" content={metadata?.description ?? descriptions[page]} />
    <meta name="robots" content={robots} />
    <link rel="canonical" href={`https://sosfauna.es${en}`} />
    {alternates.map(item => <link key={item.locale} rel="alternate" hrefLang={item.locale} href={`https://sosfauna.es${item.path}`} />)}
  </Head>;
}

export function NoIndexHead({ path, title = "SOS Fauna España" }: { path: string; title?: string }) {
  return <SeoHead path={path} title={title} description="Pantalla interna de SOS Fauna España." robots="noindex, nofollow" includeGlobalStructuredData={false} />;
}
