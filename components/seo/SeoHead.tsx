import Head from "expo-router/head";
import { Platform } from "react-native";

const SITE_NAME = "SOS Fauna España";
const SITE_URL = "https://sosfauna.es";
const THEME_COLOR = "#14532d";
const SOCIAL_IMAGE_URL: string | null = null;

type SeoHeadProps = {
  title: string;
  description: string;
  path?: string;
  robots?: "index, follow" | "noindex, nofollow";
  structuredData?: Record<string, unknown>;
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
}: SeoHeadProps) {
  if (Platform.OS !== "web") return null;

  const url = absoluteUrl(path);
  const jsonLd = structuredData ? JSON.stringify(structuredData) : null;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={robots} />
      <meta name="theme-color" content={THEME_COLOR} />
      <link rel="canonical" href={url} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:locale" content="es_ES" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />

      {SOCIAL_IMAGE_URL ? (
        <>
          <meta property="og:image" content={SOCIAL_IMAGE_URL} />
          <meta name="twitter:image" content={SOCIAL_IMAGE_URL} />
        </>
      ) : null}

      {jsonLd ? <script type="application/ld+json">{jsonLd}</script> : null}
    </Head>
  );
}

type NoIndexHeadProps = {
  path: string;
  title?: string;
};

export function NoIndexHead({
  path,
  title = "SOS Fauna España",
}: NoIndexHeadProps) {
  return (
    <SeoHead
      title={title}
      description="Pantalla interna de SOS Fauna España."
      path={path}
      robots="noindex, nofollow"
    />
  );
}

export const homeStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Web, Android",
  inLanguage: "es",
  description:
    "SOS Fauna España ofrece orientación paso a paso para actuar cuando encuentras un animal silvestre herido, atrapado, desorientado o que puede necesitar ayuda.",
  isAccessibleForFree: true,
  browserRequirements: "Requiere un navegador moderno compatible con aplicaciones web.",
};
