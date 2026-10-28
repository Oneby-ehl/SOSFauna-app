import { useEffect, useId, useRef, useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import type { FinishReportDialogProps } from "./FinishReportDialog";

export default function FinishReportDialog({ open, onCancel, onFinish, onHome }: FinishReportDialogProps) {
  const { t } = useI18n();
  const id = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  const cancel = useRef<HTMLButtonElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const saving = useRef(false);
  const [busy, setBusy] = useState(false);
  const [phase, setPhase] = useState<"confirm" | "thanks">("confirm");

  useEffect(() => {
    const element = dialog.current;
    if (!open || !element) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setPhase("confirm");
    saving.current = false;
    setBusy(false);
    if (!element.open) element.showModal();
    cancel.current?.focus({ preventScroll: true });
    return () => {
      element.close();
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, [open]);

  useEffect(() => {
    if (open && phase === "thanks") title.current?.focus({ preventScroll: true });
  }, [open, phase]);

  const finish = async () => {
    if (saving.current || phase !== "confirm") return;
    saving.current = true;
    setBusy(true);
    try {
      // The existing completion routine owns persistence and error reporting.
      // Only its success callback can advance to the acknowledgement.
      await onFinish(() => setPhase("thanks"));
    } finally {
      saving.current = false;
      setBusy(false);
    }
  };

  return <>
    <style>{styles}</style>
    <dialog ref={dialog} className="sf-dialog sf-finish-dialog" aria-labelledby={`${id}-title`} aria-describedby={`${id}-description`}
      onCancel={event => {
        event.preventDefault();
        if (saving.current) return;
        if (phase === "thanks") onHome();
        else onCancel();
      }}>
      <h2 ref={title} id={`${id}-title`} tabIndex={-1}>{t("assistantUi", phase === "thanks" ? "finishThanksTitle" : "finishDialogTitle")}</h2>
      <p id={`${id}-description`}>{t("assistantUi", phase === "thanks" ? "finishThanksDescription" : "finishDialogDescription")}</p>
      <div className="sf-finish-actions" aria-busy={busy}>
        {phase === "confirm" ? <>
          <button ref={cancel} type="button" className="sf-secondary" disabled={busy} onClick={onCancel}>{t("assistantUi", "finishReturnToReport")}</button>
          <button type="button" className="sf-primary" disabled={busy} onClick={() => void finish()}>{t("assistantUi", "finishReportAction")}</button>
        </> : <button type="button" className="sf-primary" onClick={onHome}>{t("assistantUi", "finishReturnHome")}</button>}
      </div>
    </dialog>
  </>;
}

const styles = `
.sf-dialog.sf-finish-dialog{max-width:520px;padding:28px;background:#f5f3ec;border:1px solid #dde2d8;border-radius:14px;color:#17382e;font-family:Arial,Helvetica,sans-serif}
.sf-dialog.sf-finish-dialog h2{font:400 28px/1.2 Georgia,'Times New Roman',serif;letter-spacing:-.3px;margin:0 0 16px;color:#102c25}
.sf-dialog.sf-finish-dialog h2:focus{outline:none}
.sf-dialog.sf-finish-dialog p{font:400 15px/1.6 Arial,Helvetica,sans-serif;margin:0;color:#495e51}
.sf-finish-actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:24px}
.sf-finish-actions button{flex:1 1 180px;min-height:44px;padding:10px 14px;border-radius:10px;font-size:15px!important;font-weight:500!important;line-height:1.45;text-align:center}
.sf-finish-actions .sf-secondary{border-color:#809580}
@media(max-width:480px){.sf-dialog.sf-finish-dialog{padding:22px}.sf-dialog.sf-finish-dialog h2{font-size:26px}.sf-finish-actions{gap:10px;margin-top:20px}}
`;
