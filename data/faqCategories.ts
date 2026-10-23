import { getEffectiveCatalog } from "@/i18n/translate";
import { DEFAULT_LOCALE, type Locale } from "@/i18n/types";
export const legacyFaqCategories = {
  "beforeActing": "Antes de actuar",
  "youngAnimals": "Crías y animales jóvenes",
  "injuredOrTrapped": "Animales heridos o atrapados",
  "handlingAndCare": "Manipulación y cuidados",
  "contactAndEmergencies": "Contacto y emergencias",
  "swiftKnowledge": "Conocer al vencejo",
  "application": "La aplicación"
} as const;
export type FaqCategoryId = keyof typeof legacyFaqCategories;
export type LegacyFaqCategory = (typeof legacyFaqCategories)[FaqCategoryId];
export function getFaqCategoryId(category: LegacyFaqCategory): FaqCategoryId {
  return (Object.keys(legacyFaqCategories) as FaqCategoryId[]).find(id => legacyFaqCategories[id] === category)!;
}
export function getFaqCategoryLabel(id: FaqCategoryId, locale: Locale = DEFAULT_LOCALE): string {
  return getEffectiveCatalog(locale).faqCategoryLabels[id];
}
