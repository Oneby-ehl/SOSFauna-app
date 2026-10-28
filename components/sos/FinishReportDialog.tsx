export type FinishReportDialogProps = {
  open: boolean;
  onCancel: () => void;
  onFinish: (onSaved: () => void) => Promise<void>;
  onHome: () => void;
};

// Native keeps its existing confirmation and acknowledgement.
export default function FinishReportDialog(_props: FinishReportDialogProps) { return null; }
