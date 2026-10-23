import { getEffectiveCatalog } from "@/i18n/translate";
import { DEFAULT_LOCALE, type Locale } from "@/i18n/types";
import { getFaqItemsForLocale } from "./faq";
import { getFaqSearchVocabulary } from "./faqSearchVocabulary";
const faqTopicCopy = getEffectiveCatalog().faqTopics;
import { faqItems } from "./faq";

export const faqTopics = {
  vencejos: {
    path: "/faq/vencejos",
    title: "Preguntas sobre vencejos | SOS Fauna España",
    heading: faqTopicCopy.vencejosHeading,
    description: "Qué hacer si encuentras un vencejo en el suelo, herido o que no vuela. Preguntas sobre ayuda, cuidados y conocimiento de la especie.",
    intro: faqTopicCopy.vencejosIntro,
    searchLabel: faqTopicCopy.vencejosSearchLabel,
    items: faqItems.filter((item) => item.id.includes("vencejo")),
  },
  murcielagos: {
    path: "/faq/murcielagos",
    title: "Preguntas sobre murciélagos | SOS Fauna España",
    heading: faqTopicCopy.murcielagosHeading,
    description: "Qué hacer si encuentras un murciélago, una cría o un ejemplar herido. Preguntas sobre identificación, protección y ayuda especializada.",
    intro: faqTopicCopy.murcielagosIntro,
    searchLabel: faqTopicCopy.murcielagosSearchLabel,
    items: faqItems.filter((item) => item.id.startsWith("murcielago")),
  },
} as const;

export type FaqTopicId = keyof typeof faqTopics;

const localizedTopics = new Map<Locale, typeof faqTopics>();
export function getFaqTopicsForLocale(requested: Locale = DEFAULT_LOCALE): typeof faqTopics {
  const locale = getFaqSearchVocabulary(requested).locale;
  const cached = localizedTopics.get(locale);
  if (cached) return cached;
  const copy = getEffectiveCatalog(locale).faqTopics;
  const items = getFaqItemsForLocale(locale);
  const topics = {
    vencejos: { ...faqTopics.vencejos, heading: copy.vencejosHeading, intro: copy.vencejosIntro, searchLabel: copy.vencejosSearchLabel, items: items.filter(item => item.id.includes("vencejo")) },
    murcielagos: { ...faqTopics.murcielagos, heading: copy.murcielagosHeading, intro: copy.murcielagosIntro, searchLabel: copy.murcielagosSearchLabel, items: items.filter(item => item.id.startsWith("murcielago")) },
  };
  localizedTopics.set(locale, topics);
  return topics;
}
