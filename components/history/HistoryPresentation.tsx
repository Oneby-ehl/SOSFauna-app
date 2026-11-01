import { Platform } from "react-native";
import { InterfaceIcon } from "@/components/ui/InterfaceLabel";
import { fauna } from "@/constants/androidPresentation";
export function HistoryStyles() { return null; }
export function HistoryEmptyIcon() { return Platform.OS === "android" ? <InterfaceIcon name="folder-outline" size={32} /> : null; }
export function historyWebPart(_part: string): Record<string, unknown> { return {}; }
export function HistoryStateIndicator({ state }: { state: "alive" | "dead" }) {
  return Platform.OS === "android" ? <><InterfaceIcon name={state === "alive" ? "circle" : "circle-outline"} size={10} color={state === "alive" ? fauna.forest : fauna.subtle} />{" "}</> : null;
}
export function HistoryExpansionIcon(_props: { expanded: boolean }) { return null; }
export function HistoryLocationLine({ text }: { text: string }) { return <>{text}</>; }
