export type ClearHistoryDialogProps = {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => Promise<boolean>;
};

// Native platforms retain their existing confirmation.
export default function ClearHistoryDialog(_props: ClearHistoryDialogProps) { return null; }
