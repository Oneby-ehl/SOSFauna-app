import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { fauna } from "@/constants/androidPresentation";
import type { InterfaceIconProps, InterfaceLabelProps } from "./InterfaceLabel";

// Only called for interface labels, never for advice, reports or free-form text.
const prefixes: Record<string, InterfaceIconProps["name"]> = {
  "❤️": "heart-outline", "❤": "heart-outline", "🐾": "paw", "👀": "eye-outline",
  "📍": "map-marker-outline", "🌍": "earth", "🍃": "leaf", "🌿": "leaf",
  "🌊": "waves", "🚨": "alert-outline", "🚓": "car-emergency", "👮": "shield-account-outline",
  "❓": "help-circle-outline", "📞": "phone-outline", "📷": "camera-outline", "🎥": "video-outline",
  "🔊": "volume-high", "⏹": "stop", "🔍": "magnify", "❌": "close-circle-outline",
  "✅": "check-circle-outline", "ℹ️": "information-outline", "ℹ": "information-outline",
  "⚖️": "scale-balance", "⚖": "scale-balance", "🟢": "circle", "⚫": "circle-outline",
  "⚠️": "alert-outline", "⚠": "alert-outline",
  "📋": "content-copy", "🗂️": "folder-outline", "🗂": "folder-outline",
  "🐦": "bird", "🐣": "bird", "🐥": "bird", "🕊️": "bird", "🕊": "bird",
  "🦉": "owl", "🦅": "bird", "🦇": "bat", "🐭": "rabbit", "🐁": "rabbit",
  "🦔": "paw", "🐿️": "rabbit", "🐿": "rabbit", "🦊": "paw", "🦌": "paw",
  "🐬": "dolphin", "🐋": "fish", "🐳": "fish", "🦭": "paw", "🐢": "turtle",
  "🦈": "shark", "🦎": "snake", "🐍": "snake", "🐸": "snake",
  "☠️": "skull-outline", "☠": "skull-outline", "🔎": "magnify", "🚫": "cancel", "❗": "alert-outline",
};

export function InterfaceIcon({ name, size = 18, color = fauna.forest }: InterfaceIconProps) {
  return <MaterialCommunityIcons name={name} size={size} color={color} accessible={false}
    accessibilityElementsHidden importantForAccessibility="no-hide-descendants" />;
}

export function InterfaceLabel({ text, icon, color }: InterfaceLabelProps) {
  let label = text;
  let name = icon;
  for (const [prefix, candidate] of Object.entries(prefixes)) {
    if (label.startsWith(prefix)) {
      name ??= candidate;
      label = label.slice(prefix.length).replace(/^\uFE0F?\s*/u, "");
      break;
    }
  }
  // Unknown decorative prefixes still receive a library icon. This component is
  // deliberately restricted to interface labels, never explanatory paragraphs.
  if (/^\p{Extended_Pictographic}/u.test(label)) {
    name ??= "information-outline";
    label = label.replace(/^\p{Extended_Pictographic}[\uFE0F\u200D]*\s*/u, "");
  }
  const checked = /\s*[✓✅]\s*$/u.test(label);
  if (checked) label = label.replace(/\s*[✓✅]\s*$/u, "");
  return <>{name ? <><InterfaceIcon name={name} color={color} />{" "}</> : null}{label}
    {checked ? <> <InterfaceIcon name="check" color={color} /></> : null}</>;
}
