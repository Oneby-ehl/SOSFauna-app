// Platform presentation only; advice strings and guide logic stay in SosAssistant.
import type { PropsWithChildren } from "react";
import { SectionCard } from "@/components/AndroidSectionCard";
import { InterfaceLabel } from "@/components/ui/InterfaceLabel";

export function StepOneCard({ title, step, children }: PropsWithChildren<{ title: string; step?: number }>) {
  return <SectionCard title={title} step={step}>{children}</SectionCard>;
}

export function StepOneStyles({ active: _active }: { active: boolean }) {
  return null;
}

export function stepOneDataSet(_active: boolean, _markers: Record<string, string>): Record<string, unknown> {
  return {};
}

export function guideQuestionTitle(text: string): string {
  return text;
}

export function guideSummaryText(text: string): string { return text; }
export function GuideAbsenceIndicator({ text }: { text: string }) { return <InterfaceLabel text={text} />; }
export function StepThreeStatus({ kind, text }: { kind: "photo" | "video" | "location"; text: string }) {
  return <InterfaceLabel text={text} icon={kind === "photo" ? "camera-outline" : kind === "video" ? "video-outline" : "map-marker-outline"} />;
}
export { SectionCard as GuideConfirmationCard } from "@/components/AndroidSectionCard";
export function GuideActionIcon(_props: { action: "whatsapp" | "copy" | "help" | "finish" }) { return null; }
export function AdvicePresentation(_props: { text: string; headingLevel?: 2 | 3 | 4 }) { return null; }
export function GuideSpeechLabel({ text }: { text: string }) { return <InterfaceLabel text={text} />; }
