import type { Catalog } from "../translate";
import { generalFaqContentEn } from "./faq-general.en";
import { swiftFaqContentEn } from "./faq-swifts.en";

export const faqEn = {
  faqContent: { ...generalFaqContentEn, ...swiftFaqContentEn },
  faqTopics: {
    vencejosHeading: "Frequently asked questions about swifts",
    vencejosIntro: "Find answers about helping swifts and learning more about the species. Search within this topic or expand each answer.",
    vencejosSearchLabel: "Search questions about swifts",
    murcielagosHeading: "Frequently asked questions about bats",
    murcielagosIntro: "Find answers to questions specifically about bats. Search within this topic or expand each answer.",
    murcielagosSearchLabel: "Search questions about bats",
  },
  faqUi: {
    caseDoubtTitle: "Unsure about this case?",
    caseDoubtText: "The SOS Fauna España Assisted Care Guide will help you assess the situation step by step.",
    centersPromptTitle: "Need to find a centre?", centersPromptText: "Find wildlife rescue centres and contact numbers in your province.",
    intro: "Have a question? Here you will find answers to common questions about helping wildlife responsibly and how SOS Fauna España works.",
    searchLabel: "Search frequently asked questions", searchPlaceholder: "Search questions…", clearSearch: "Clear search", selectPrefix: "Select ", categoryPrefix: "Go to category ",
    closeQuestion: "Close", openQuestion: "Open", questionLabelSeparator: " question: ", noResults: "We could not find any questions matching your search.",
    specializedTitle: "Specialist information", swiftsLinkLabel: "Questions about swifts", batsLinkLabel: "Questions about bats",
    topicNoResults: "We could not find any questions matching your search in this topic.", backToFaq: "Back to frequently asked questions",
  },
  faqCategoryLabels: {
    beforeActing: "Before you act", youngAnimals: "Young animals", injuredOrTrapped: "Injured or trapped animals", handlingAndCare: "Handling and care",
    contactAndEmergencies: "Contacts and emergencies", swiftKnowledge: "Understanding swifts", application: "The app",
  },
  dynamicFaqGrammar: {
    injuredPlural: "that are injured", injuredFemale: "that is injured", injuredMale: "that is injured",
    strandedPlural: "stranded", strandedFemale: "stranded", strandedMale: "stranded",
    entangledPlural: "entangled", entangledFemale: "entangled", entangledMale: "entangled",
    weakPlural: "weak", weakSingular: "weak",
  },
  dynamicFaqCopy: {
    sealResting: "A seal on land may simply be resting. If it appears injured, very weak or entangled, or anything about the situation concerns you, use the SOS Fauna España guide. It will explain what to look for and how to act according to the situation.",
    otherMarine: "If you have found a marine animal that is injured, stranded, entangled or weak, or in a situation that concerns you, use the SOS Fauna España guide. It will explain what to look for and how to act according to the situation.",
    marinePrefix: "If you have found ", marineSuffix: " or in a situation that concerns you, use the SOS Fauna España guide. It will explain what to look for and how to act according to the situation.",
    animalQuestionPrefix: "What should I do if I find ", animalQuestionSuffix: "?",
  },
} satisfies Pick<Catalog, "faqContent" | "faqTopics" | "faqUi" | "faqCategoryLabels" | "dynamicFaqGrammar" | "dynamicFaqCopy">;
