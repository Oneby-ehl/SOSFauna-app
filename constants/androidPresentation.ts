import { Platform, StyleSheet, type ImageStyle, type TextStyle, type ViewStyle } from "react-native";

// Visual tokens from landingStyles and the web 2.0 interior presentations.
// Android uses its built-in serif/sans fonts; no remote fonts or assets are needed.
export const fauna = {
  forest: "#102c25", paper: "#f5f3ec", ink: "#17382e",
  surface: "#fffefa", muted: "#495e51", subtle: "#647b6a",
  border: "#e2e5dd", outline: "#d4ddce", sage: "#edf2e8",
  gold: "#d9b96f", danger: "#7d3a2c",
} as const;

export const editorialTitle: TextStyle = {
  fontFamily: "serif", fontWeight: "400", fontSize: 30,
  lineHeight: 38, letterSpacing: -0.4, color: fauna.forest,
};
export const editorialEyebrow: TextStyle = {
  fontSize: 11, lineHeight: 18, fontWeight: "500",
  letterSpacing: 1.4, color: fauna.subtle,
};

// Adapt only the selected screens' existing styles. Semantic warning and marine
// colours are retained. Other platforms receive the original styles verbatim.
const palette: Record<string, string> = {};
function colours(values: string[], target: string) {
  values.forEach(value => { palette[value] = target; });
}
colours(["#14532d", "#123c24", "#183d28"], fauna.forest);
colours(["#166534", "#2f7a48"], "#294b3c");
colours(["#111827", "#1f2937"], fauna.ink);
colours(["#374151", "#4b5563", "#34483a", "#536158", "#3f4d43", "#526158", "#4f5d54"], fauna.muted);
colours(["#6b7280", "#64748b", "#68746b", "#5f6c63", "#647066"], fauna.subtle);
colours(["#f3f7f4", "#f4f7f4"], fauna.paper);
colours(["#ffffff", "#f8fafc", "#fbfdfb"], fauna.surface);
colours(["#eef8f0", "#e7f5ea", "#e4f4e7", "#dfeee2", "#f3f4f6", "#e5e7eb", "#f9fafb", "#f8faf8"], fauna.sage);
colours(["#dbe7dd", "#dfe7df", "#e5e7eb", "#dce8de", "#edf1ed"], fauna.border);
colours(["#b7dfc0", "#cfe8d4", "#d1d5db", "#cbd5e1", "#9ab7a0", "#86c995", "#86c894"], fauna.outline);
colours(["#9b1c1c"], fauna.danger);
colours(["#d9a6a6"], "#bd8f88");

type NativeStyle = ViewStyle | TextStyle | ImageStyle;
export function androidPresentation<T extends { [K in keyof T]: NativeStyle }>(
  base: T,
  overrides: { [K in keyof T]?: NativeStyle } = {},
): T {
  if (Platform.OS !== "android") return base;
  const result = {} as T;
  for (const key in base) {
    const style = { ...StyleSheet.flatten(base[key]) } as Record<string, unknown>;
    for (const property in style) {
      const value = style[property];
      if (property.toLowerCase().includes("color") && typeof value === "string") {
        // Keep white text on dark controls and photos.
        style[property] = property === "color" && value === "#ffffff" ? value
          : property === "backgroundColor" && value === "#e5e7eb" ? fauna.sage
          : palette[value.toLowerCase()] ?? value;
      }
    }
    if (style.fontWeight === "800" || style.fontWeight === "900") style.fontWeight = "600";
    result[key] = { ...style, ...overrides[key] } as T[typeof key];
  }
  return result;
}
