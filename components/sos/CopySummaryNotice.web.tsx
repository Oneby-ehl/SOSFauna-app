import { useEffect, useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import type { CopySummaryNoticeProps } from "./CopySummaryNotice";

export default function CopySummaryNotice({ notice }: CopySummaryNoticeProps) {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!notice) return;
    setVisible(true);
    const timer = window.setTimeout(() => setVisible(false), notice.kind === "error" ? 10000 : 7000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  return <>
    <style>{`
      .sg-copy-notice-region{position:fixed;right:24px;bottom:max(20px,env(safe-area-inset-bottom,0px));z-index:150;width:calc(100% - 48px);max-width:360px;pointer-events:none;font-family:Arial,Helvetica,sans-serif}
      .sg-copy-notice{padding:14px 16px;background:#f5f3ec;border:1px solid #d4ddce;border-left:3px solid #d9b96f;border-radius:10px;color:#17382e}
      .sg-copy-notice strong{display:block;font-size:15px;line-height:1.4;font-weight:500;margin-bottom:4px}
      .sg-copy-notice p{font-size:14px;line-height:1.5;font-weight:400;color:#495e51;margin:0}
      .sg-copy-notice[data-error=true]{border-left-color:#7d3a2c}
      @media(max-width:480px){.sg-copy-notice-region{right:16px;width:calc(100% - 32px)}}
    `}</style>
    <div className="sg-copy-notice-region" role="status" aria-live="polite" aria-atomic="true">
      {visible && notice ? <div key={notice.id} className="sg-copy-notice" data-error={notice.kind === "error"}>
        <strong>{t("assistantUi", notice.kind === "error" ? "summaryCopyErrorTitle" : "summaryCopiedTitle")}</strong>
        <p>{t("assistantUi", notice.kind === "error" ? "summaryCopyErrorMessage" : "summaryCopiedMessage")}</p>
      </div> : null}
    </div>
  </>;
}
