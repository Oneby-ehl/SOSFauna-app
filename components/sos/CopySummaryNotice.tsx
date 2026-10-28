export type CopySummaryNoticeProps = {
  notice: { kind: "success" | "error"; id: number } | null;
};

// Native retains its existing copy acknowledgement.
export default function CopySummaryNotice(_props: CopySummaryNoticeProps) { return null; }
