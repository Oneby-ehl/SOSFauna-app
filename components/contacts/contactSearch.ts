import type { Locale } from "@/i18n/types";
import type { ProvinceHelpGroup } from "./RecoveryCentersPage";

export function matchesProvinceHelpGroup(
  group: ProvinceHelpGroup,
  normalizedQuery: string,
  normalizeSearch: (value: string) => string,
  locale: Locale,
): boolean {
  if (normalizeSearch(group.province).includes(normalizedQuery)) return true;
  // Preserve the existing Spanish province filter. English preview also accepts
  // official centre names and towns from the unchanged source contact records.
  return locale === "en" && [...group.terrestrialContacts, ...group.marineContacts]
    .some(contact => [contact.name, contact.note]
      .some(value => normalizeSearch(value).includes(normalizedQuery)));
}
