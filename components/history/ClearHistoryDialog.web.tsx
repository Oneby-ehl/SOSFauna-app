import { useEffect, useId, useRef, useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import type { ClearHistoryDialogProps } from "./ClearHistoryDialog";

export default function ClearHistoryDialog({ open, onCancel, onConfirm }: ClearHistoryDialogProps) {
  const { t } = useI18n();
  const id = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  const cancel = useRef<HTMLButtonElement>(null);
  const submitting = useRef(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const element = dialog.current;
    if (!open || !element) return;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    submitting.current = false;
    setBusy(false);
    if (!element.open) element.showModal();
    cancel.current?.focus({ preventScroll: true });
    return () => {
      element.close();
      const target = previous?.isConnected ? previous
        : document.querySelector<HTMLElement>('[data-history-part="primaryButton"]');
      target?.focus({ preventScroll: true });
    };
  }, [open]);

  const confirm = async () => {
    if (submitting.current) return;
    submitting.current = true;
    setBusy(true);
    try {
      // The page owns the existing clearHistory operation and error handling.
      await onConfirm();
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  };

  return <>
    <style>{styles}</style>
    <dialog ref={dialog} className="sf-dialog sf-history-clear-dialog"
      aria-labelledby={`${id}-title`} aria-describedby={`${id}-message`}
      onCancel={event => { event.preventDefault(); if (!submitting.current) onCancel(); }}
      onClose={() => { if (open && !submitting.current) onCancel(); }}>
      <h2 id={`${id}-title`}>{t("historyUi", "clearTitle")}</h2>
      <p id={`${id}-message`}>{t("historyUi", "clearMessage")}</p>
      <div className="sf-history-clear-actions" aria-busy={busy}>
        <button ref={cancel} type="button" className="sf-secondary" disabled={busy} onClick={onCancel}>{t("historyUi", "cancel")}</button>
        <button type="button" className="sf-primary" disabled={busy} onClick={() => void confirm()}>{t("historyUi", "clearConfirm")}</button>
      </div>
    </dialog>
  </>;
}

const styles = `
.sf-dialog.sf-history-clear-dialog{max-width:520px;padding:28px;background:#f5f3ec;border:1px solid #dde2d8;border-radius:14px;color:#17382e;font-family:Arial,Helvetica,sans-serif}
.sf-dialog.sf-history-clear-dialog h2{font:400 28px/1.2 Georgia,'Times New Roman',serif;letter-spacing:-.3px;margin:0 0 16px;color:#102c25}
.sf-dialog.sf-history-clear-dialog p{font:400 15px/1.6 Arial,Helvetica,sans-serif;margin:0;color:#495e51}
.sf-history-clear-actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:24px}
.sf-history-clear-actions button{flex:1 1 180px;min-height:44px;padding:10px 14px;border-radius:10px;font-size:15px!important;font-weight:500!important;line-height:1.45;text-align:center}
@media(max-width:480px){.sf-dialog.sf-history-clear-dialog{padding:22px}.sf-history-clear-actions{gap:10px;margin-top:20px}}
`;
