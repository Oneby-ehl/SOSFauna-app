// Native keeps its existing card and never imports DOM markup or web CSS.
import type { PropsWithChildren } from "react";
import { SectionCard } from "@/components/SectionCard";

export function StepOneCard({ title, children }: PropsWithChildren<{ title: string; step?: number }>) {
  return <SectionCard title={title}>{children}</SectionCard>;
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
export function GuideAbsenceIndicator({ text }: { text: string }) { return <>{text}</>; }
export function StepThreeStatus({ text }: { kind: "photo" | "video" | "location"; text: string }) { return <>{text}</>; }
export { SectionCard as GuideConfirmationCard } from "@/components/SectionCard";
export function GuideActionIcon(_props: { action: "whatsapp" | "copy" | "help" | "finish" }) { return null; }
export function AdvicePresentation(_props: { text: string; headingLevel?: 2 | 3 | 4 }) { return null; }
export function GuideSpeechLabel({ text }: { text: string }) { return <>{text}</>; }
