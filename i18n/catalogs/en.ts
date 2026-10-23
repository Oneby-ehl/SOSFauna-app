import type { TranslationCatalog } from "../translate";
import { homeEn } from "./home.en";
import { informationEn } from "./information.en";
import { assistantEn } from "./assistant.en";
import { assistantDisplayEn } from "./assistant-display.en";
import { rescueProtocolsEn } from "./rescue-protocols.en";
import { rescueSpecialEn } from "./rescue-special.en";
import { rescueSummaryEn } from "./rescue-summary.en";
import { faqEn } from "./faq.en";
import { faqAnimalsEn } from "./faq-animals.en";
import { centersEn } from "./centers.en";
import { helpContactDescriptionsEn } from "./help-contact-descriptions.en";

// British English copy for home/information pages, the help guide, FAQ and directory.
// Remaining untranslated keys retain explicit Spanish fallback.
// Publication remains gated separately; this catalog does not enable English routes.
export const en = {
  ...centersEn,
  ...helpContactDescriptionsEn,
  ...faqEn,
  ...faqAnimalsEn,
  ...assistantEn,
  ...assistantDisplayEn,
  ...rescueProtocolsEn,
  ...rescueSpecialEn,
  ...rescueSummaryEn,
  ...homeEn,
  ...informationEn,
  language: {
    selectorLabel: "Language",
    es: "Español",
    en: "English",
  },
} satisfies TranslationCatalog;
