import type { Locale } from "@/i18n/types";
import { landingEditorialEs, landingEditorialEn } from "@/i18n/catalogs/landing-editorial";

export type HeroPhoto = {
  id: string;
  src: string;
  species: Record<Locale, string>;
  alt: Record<Locale, string>;
  credit: Record<Locale, string>;
  rights: { license: string; source: string; evidence: string };
  objectPosition?: string;
  mobileObjectPosition?: string;
};

const credit = { es: landingEditorialEs.aiImagesCredit, en: landingEditorialEn.aiImagesCredit };
const rights = {
  license: "AI-generated assets supplied by the project owner; no third-party photography licence claimed",
  source: "D:/GITHUB/sos-fauna-proyectos/Nuevo diseño/media/frontpage/WEBP",
  evidence: "docs/homepage-phase-1.md#integración-de-imágenes--26-de-octubre-de-2026",
};

// User-supplied AI illustrations, in the explicitly requested playback order.
export const heroPhotos: readonly HeroPhoto[] = [
  {
    id: "lynx", src: "/wildlife/lince-iberico.webp",
    species: { es: "Lince ibérico", en: "Iberian lynx" },
    alt: { es: "Ilustración de un lince ibérico entre rocas y matorral mediterráneo.", en: "Illustration of an Iberian lynx among rocks and Mediterranean scrub." },
    objectPosition: "50% center", mobileObjectPosition: "68% center", credit, rights,
  },
  {
    id: "imperial-eagle", src: "/wildlife/aguila-imperial-iberica.webp",
    species: { es: "Águila imperial ibérica", en: "Spanish imperial eagle" },
    alt: { es: "Ilustración de un águila imperial ibérica posada en una roca.", en: "Illustration of a Spanish imperial eagle perched on a rock." },
    objectPosition: "50% center", mobileObjectPosition: "62% center", credit, rights,
  },
  {
    id: "stranded-dolphin", src: "/wildlife/delfin-varado.webp",
    species: { es: "Delfín varado", en: "Stranded dolphin" },
    alt: { es: "Ilustración de un delfín varado sobre la arena húmeda de una playa al atardecer.", en: "Illustration of a stranded dolphin on wet beach sand at sunset." },
    objectPosition: "50% center", mobileObjectPosition: "70% center", credit, rights,
  },
  {
    id: "european-pond-turtle", src: "/wildlife/galapago-europeo.webp",
    species: { es: "Galápago europeo", en: "European pond turtle" },
    alt: { es: "Ilustración de un galápago europeo junto a una laguna.", en: "Illustration of a European pond turtle beside a pond." },
    objectPosition: "50% center", mobileObjectPosition: "62% center", credit, rights,
  },
  {
    id: "bat", src: "/wildlife/murcielago.webp",
    species: { es: "Murciélago", en: "Bat" },
    alt: { es: "Ilustración de un murciélago en vuelo junto a un árbol al atardecer.", en: "Illustration of a bat flying beside a tree at sunset." },
    objectPosition: "50% center", mobileObjectPosition: "62% center", credit, rights,
  },
  {
    id: "cranes", src: "/wildlife/grullas.webp",
    species: { es: "Grullas", en: "Cranes" },
    alt: { es: "Ilustración de varias grullas en un humedal al atardecer.", en: "Illustration of cranes in a wetland at sunset." },
    objectPosition: "50% center", mobileObjectPosition: "72% center", credit, rights,
  },
  {
    id: "red-fox", src: "/wildlife/zorro-rojo.webp",
    species: { es: "Zorro rojo", en: "Red fox" },
    alt: { es: "Ilustración de un zorro rojo sobre unas rocas al atardecer.", en: "Illustration of a red fox on rocks at sunset." },
    objectPosition: "50% center", mobileObjectPosition: "54% center", credit, rights,
  },
  {
    id: "sparrow-feeding-chick", src: "/wildlife/gorrion-alimentando-cria.webp",
    species: { es: "Gorrión alimentando a su cría", en: "Sparrow feeding its chick" },
    alt: { es: "Ilustración de un gorrión adulto alimentando a su cría.", en: "Illustration of an adult sparrow feeding its chick." },
    objectPosition: "50% center", mobileObjectPosition: "78% center", credit, rights,
  },
  {
    id: "swifts-drinking", src: "/wildlife/vencejos-bebiendo.webp",
    species: { es: "Vencejos bebiendo agua", en: "Swifts drinking water" },
    alt: { es: "Ilustración de vencejos bebiendo agua en vuelo sobre una charca.", en: "Illustration of swifts drinking in flight over a pool of water." },
    objectPosition: "50% center", mobileObjectPosition: "70% center", credit, rights,
  },
];
