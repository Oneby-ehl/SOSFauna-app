import Head from "expo-router/head";
import { Platform } from "react-native";

const SITE_NAME = "SOS Fauna España";
const SITE_URL = "https://sosfauna.es";
const ORGANIZATION_LOGO_URL = `${SITE_URL}/google-logo.png`;
const SOCIAL_IMAGE_URL = `${SITE_URL}/og-image.jpg`;
const SOCIAL_IMAGE_ALT =
  "SOS Fauna España - Ayuda a la fauna silvestre";
const SOCIAL_IMAGE_WIDTH = "1200";
const SOCIAL_IMAGE_HEIGHT = "630";
const SITE_DESCRIPTION =
  "SOS Fauna España ofrece orientación paso a paso si encuentras fauna silvestre herida, atrapada, debilitada, varada o en peligro.";

const globalStructuredData = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    inLanguage: "es",
    description: SITE_DESCRIPTION,
  },
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web, Android",
    inLanguage: "es",
    description: SITE_DESCRIPTION,
    offers: {
      "@type": "Offer",
      price: 0,
      priceCurrency: "EUR",
    },
  },
];

const organizationStructuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  alternateName: "SOS Fauna",
  url: `${SITE_URL}/`,
  logo: ORGANIZATION_LOGO_URL,
  description: SITE_DESCRIPTION,
};

type SeoHeadProps = {
  title: string;
  description: string;
  path?: string;
  robots?: "index, follow" | "noindex, nofollow";
  structuredData?: Record<string, unknown>;
  includeGlobalStructuredData?: boolean;
  alternates?: readonly { locale: string; path: string }[];
  locale?: "es" | "en";
};

function absoluteUrl(path = "/") {
  if (path === "/") return `${SITE_URL}/`;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function SeoHead({
  title,
  description,
  path = "/",
  robots = "index, follow",
  structuredData,
  includeGlobalStructuredData = robots === "index, follow",
  alternates,
  locale = "es",
}: SeoHeadProps) {
  if (Platform.OS !== "web") return null;

  const url = absoluteUrl(path);
  const english = locale === "en";
  const siteDescription = english
    ? "SOS Fauna España offers step-by-step guidance if you find wildlife that is injured, trapped, weak, stranded or in danger."
    : SITE_DESCRIPTION;
  const siteHome = english ? `${SITE_URL}/en/` : `${SITE_URL}/`;
  const includeOrganizationStructuredData =
    includeGlobalStructuredData && url === siteHome;
  const sharedData = english
    ? globalStructuredData.map(item => ({ ...item, url: siteHome, inLanguage: "en", description: siteDescription }))
    : globalStructuredData;
  const organizationData = english
    ? { ...organizationStructuredData, description: siteDescription }
    : organizationStructuredData;
  const structuredDataItems = [
    ...(includeGlobalStructuredData ? sharedData : []),
    ...(includeOrganizationStructuredData ? [organizationData] : []),
    ...(structuredData ? [structuredData] : []),
  ];

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={robots} />
      <link rel="canonical" href={url} />
      {alternates?.map((alternate) => (
        <link key={alternate.locale} rel="alternate" hrefLang={alternate.locale} href={absoluteUrl(alternate.path)} />
      ))}

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:locale" content={english ? "en_GB" : "es_ES"} />
      <meta property="og:image" content={SOCIAL_IMAGE_URL} />
      <meta property="og:image:width" content={SOCIAL_IMAGE_WIDTH} />
      <meta property="og:image:height" content={SOCIAL_IMAGE_HEIGHT} />
      <meta property="og:image:alt" content={english ? "SOS Fauna España - Help for wildlife" : SOCIAL_IMAGE_ALT} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={SOCIAL_IMAGE_URL} />

      {structuredDataItems.map((item) => (
        <script key={String(item["@type"])} type="application/ld+json">
          {JSON.stringify(item)}
        </script>
      ))}
    </Head>
  );
}

type NoIndexHeadProps = {
  path: string;
  title?: string;
  locale?: "es" | "en";
};

export function NoIndexHead({
  path,
  title = "SOS Fauna España",
  locale = "es",
}: NoIndexHeadProps) {
  return (
    <SeoHead
      title={title}
      description={locale === "en" ? "Private SOS Fauna España page." : "Pantalla interna de SOS Fauna España."}
      locale={locale}
      path={path}
      robots="noindex, nofollow"
      includeGlobalStructuredData={false}
    />
  );
}
