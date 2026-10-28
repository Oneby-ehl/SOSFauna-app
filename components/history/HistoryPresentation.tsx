// Native retains its existing history presentation.
export function HistoryStyles() { return null; }
export function HistoryEmptyIcon() { return null; }
export function historyWebPart(_part: string): Record<string, unknown> { return {}; }
export function HistoryStateIndicator(_props: { state: "alive" | "dead" }) { return null; }
export function HistoryExpansionIcon(_props: { expanded: boolean }) { return null; }
export function HistoryLocationLine({ text }: { text: string }) { return <>{text}</>; }
