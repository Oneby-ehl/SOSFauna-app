// Native keeps the existing FAQ presentation.
export function FaqStyles() { return null; }
export function faqWebPart(_part: string, _active?: boolean): Record<string, unknown> { return {}; }
export type FaqIconProps = { kind: "search" | "clear" | "expand"; expanded?: boolean };
export function FaqIcon(_props: FaqIconProps) { return null; }

export function FaqAnswer(_props: { text: string }) { return null; }
