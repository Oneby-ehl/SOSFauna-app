// Fixed legacy storage token, never a translated UI label.
const LEGACY_LOCATION_NOT_CAPTURED_ES = "Ubicación no capturada todavía.";

export type StoredLocationValue =
  | Readonly<{ kind: "notCaptured" }>
  | Readonly<{ kind: "text"; text: string }>;

// Decode only at the storage boundary. Do not infer capture status or coordinates
// from text, trim addresses, parse map labels, or discard unknown legacy values.
export function readStoredLocationText(
  value: string | null | undefined,
): StoredLocationValue {
  return value == null || value === LEGACY_LOCATION_NOT_CAPTURED_ES
    ? { kind: "notCaptured" }
    : { kind: "text", text: value };
}

export function writeStoredLocationText(value: StoredLocationValue): string {
  return value.kind === "notCaptured"
    ? LEGACY_LOCATION_NOT_CAPTURED_ES
    : value.text;
}

export type LocationSummaryLine = Readonly<{
  kind: "reference" | "coordinates" | "map";
  text: string;
}>;
