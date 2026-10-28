import type { Catalog } from "../translate";
import { homeEn } from "./home.en";
import { landingEditorialEn } from "./landing-editorial";
import { historyEn } from "./history.en";
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
import { interfaceCompletionEn } from "./interface-completion.en";

// British English copy for home/information pages, the help guide, FAQ and directory.
// Require full key coverage so future Spanish additions cannot silently fall back.
// Publication remains gated separately; this catalog does not enable English routes.
export const en = {
  landingEditorial: landingEditorialEn,
  ...historyEn,
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
  ...interfaceCompletionEn,
  language: {
    selectorLabel: "Language",
    es: "Español",
    en: "English",
  },
} satisfies Catalog;
