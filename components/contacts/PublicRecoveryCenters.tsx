import type { ProvinceHelpGroup } from "./RecoveryCentersPage";
import type { MarineHelpResourceType } from "@/data/marineHelpContacts";

export type PublicRecoveryCentersProps = {
  groups: ProvinceHelpGroup[];
  normalizeSearch: (value: string) => string;
  nationalContactLabel: (phone: string) => string;
  marineResourceLabel: (type: MarineHelpResourceType) => string;
};

// The native public page keeps using RecoveryCentersContent.
export default function PublicRecoveryCenters(_: PublicRecoveryCentersProps) {
  return null;
}

export function PublicCentersBackIcon() { return null; }
