import { getEffectiveLocale } from "@/i18n/effectiveLocale";
import { DEFAULT_LOCALE, type Locale } from "@/i18n/types";
export type FaqSearchVocabulary = Readonly<{ locale: Locale; stopWords: readonly string[]; genericRankingTerms: readonly string[]; generalSwiftQueries: ReadonlySet<string>; batFlightOrGroundTerms: readonly string[]; selectedAnimalIntroTerms: readonly string[] }>;
const spanishVocabulary: FaqSearchVocabulary = Object.freeze({ locale: "es", stopWords: [
  "a",
  "al",
  "de",
  "del",
  "el",
  "en",
  "esta",
  "está",
  "he",
  "la",
  "lo",
  "que",
  "qué",
  "un",
  "una",
], genericRankingTerms: ["animal", "animales", "fauna"], generalSwiftQueries: new Set(["vencejo", "vencejos", "apus apus"]), batFlightOrGroundTerms: ["no vuela", "no puede volar", "que no vuela", "en el suelo", "suelo"], selectedAnimalIntroTerms: ["encontr", "que hago", "qué hago"] });
const englishVocabulary: FaqSearchVocabulary = Object.freeze({
  locale: "en",
  stopWords: ["a", "an", "the", "of", "to", "in", "on", "is", "are", "i", "have", "what", "do", "should", "with"],
  genericRankingTerms: ["animal", "animals", "wildlife"],
  generalSwiftQueries: new Set(["swift", "swifts", "common swift", "common swifts", "apus apus"]),
  batFlightOrGroundTerms: ["cannot fly", "can't fly", "can’t fly", "cant fly", "unable to fly", "on the ground", "ground"],
  selectedAnimalIntroTerms: ["found", "find", "what should i do", "what do i do"],
});
const vocabularies: Partial<Record<Locale, FaqSearchVocabulary>> = { es: spanishVocabulary, en: englishVocabulary };
// Whole vocabulary fallback: do not claim a Spanish vocabulary is an English one.
export function getFaqSearchVocabulary(requested: Locale = DEFAULT_LOCALE): FaqSearchVocabulary {
  return vocabularies[getEffectiveLocale(requested)] ?? spanishVocabulary;
}
