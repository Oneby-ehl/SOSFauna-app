import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export function historyWebPart(part: string): Record<string, unknown> {
  return { dataSet: { historyPart: part } };
}

export function HistoryStateIndicator({ state }: { state: "alive" | "dead" }) {
  return <span className="sf-history-state" data-state={state} aria-hidden="true" />;
}

export function HistoryExpansionIcon({ expanded }: { expanded: boolean }) {
  return <span className="sf-history-expansion" aria-hidden="true"><MaterialIcons name={expanded ? "expand-less" : "expand-more"} size={18} color="#647b6a" /></span>;
}

export function HistoryLocationLine({ text }: { text: string }) {
  const match = /https:\/\/maps\.google\.com\/\?q=[^\s]+/u.exec(text);
  if (!match) return <>{text}</>;
  const start = match.index;
  const url = match[0];
  return <>{text.slice(0, start)}<a className="sf-history-map-link" href={url} target="_blank" rel="noopener noreferrer">{url}</a>{text.slice(start + url.length)}</>;
}

export function HistoryStyles() { return <style>{styles}</style>; }

export function HistoryEmptyIcon() {
  return <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#294b3c"
    strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <path d="M3 7V5a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Zm0 2h18" />
  </svg>;
}

const styles = `
[data-history-part="screen"]{background:#f5f3ec!important}
[data-history-part="screen"] [data-history-part]{font-family:Arial,Helvetica,sans-serif!important;box-sizing:border-box;min-width:0}
[data-history-part="header"]{background:#f5f3ec!important;border-bottom-width:0!important}
[data-history-part="headerInner"],[data-history-part="content"]{width:100%!important;max-width:1040px!important;margin-left:auto!important;margin-right:auto!important;padding-left:32px!important;padding-right:32px!important}
[data-history-part="headerInner"]{padding-top:32px!important;padding-bottom:20px!important;gap:12px!important;align-items:flex-start!important}
[data-history-part="headerText"]{min-width:0!important;gap:8px!important}
[data-history-part="eyebrow"]{font-size:11px!important;line-height:1.5!important;font-weight:500!important;letter-spacing:1.4px;color:#647b6a!important}
[data-history-part="screen"] [data-history-part="title"]{font:400 clamp(28px,3.6vw,36px)/1.2 Georgia,'Times New Roman',serif!important;letter-spacing:-.4px;color:#102c25!important;overflow-wrap:anywhere}
[data-history-part="description"]{max-width:75ch;font-size:15px!important;line-height:1.65!important;font-weight:400!important;color:#495e51!important}
[data-history-part="backButton"]{min-height:44px!important;max-width:100%;padding:8px 14px!important;border:1px solid #b7c7b8!important;border-radius:8px!important;background:#fffefa!important;justify-content:center}
[data-history-part="backButton"]:hover{background:#edf1e8!important}
[data-history-part="backButtonText"]{font-weight:500!important;color:#294b3c!important}
[data-history-part="content"]{padding-top:12px!important;padding-bottom:48px!important;gap:20px!important}
[data-history-part="list"]{gap:12px!important}
[data-history-part="card"]{background:#fffefa!important;border:1px solid #e2e5dd!important;border-radius:12px!important;box-shadow:none!important;overflow:visible!important}
[data-history-part="cardHeader"]{min-height:44px!important;padding:14px 16px!important;gap:12px!important;border-radius:12px}
[data-history-part="cardHeader"]:hover{background:#f5f6f1}
[data-history-part="cardHeaderText"]{min-width:0!important;gap:4px!important}
[data-history-part="cardTitle"]{font-size:18px!important;font-weight:500!important;line-height:1.4!important;color:#17382e!important;overflow-wrap:anywhere}
[data-history-part="cardDate"]{font-size:13px!important;font-weight:400!important;line-height:1.5!important;color:#647b6a!important;white-space:normal}
[data-history-part="cardState"]{font-size:14px!important;font-weight:400!important;line-height:1.45!important;color:#495e51!important}
.sf-history-state{display:inline-block;width:6px;height:6px;border-radius:50%;background:#426351;margin-right:6px;vertical-align:2px}
.sf-history-state[data-state="dead"]{background:#647b6a}
.sf-history-expansion{display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;line-height:1}
[data-history-part="cardSummary"]{padding:12px 16px!important;border-color:#e2e5dd!important;gap:5px!important}
[data-history-part="summaryLabel"]{font-size:12px!important;font-weight:500!important;line-height:1.5!important;letter-spacing:.5px;color:#647b6a!important}
[data-history-part="summaryValue"]{font-size:15px!important;font-weight:400!important;line-height:1.6!important;color:#495e51!important;white-space:pre-wrap;overflow-wrap:anywhere;word-break:break-word}
.sf-history-map-link{color:#294b3c;text-decoration:underline;text-underline-offset:3px;overflow-wrap:anywhere;word-break:break-word}
[data-history-part="details"]{padding:12px 16px!important;gap:12px!important;border-color:#e2e5dd!important;background:#f5f6f1!important;border-radius:0 0 12px 12px}
[data-history-part="detailActions"]{gap:10px!important;flex-wrap:wrap!important}
[data-history-part="copyButton"],[data-history-part="deleteButton"],[data-history-part="clearHistoryButton"]{min-height:44px!important;max-width:100%;padding:9px 14px!important;border-radius:10px!important}
[data-history-part="copyButton"]{background:#102c25!important}
[data-history-part="copyButtonText"],[data-history-part="deleteButtonText"],[data-history-part="clearHistoryButtonText"]{font-weight:500!important;line-height:1.45!important;white-space:normal;overflow-wrap:anywhere;text-align:center}
[data-history-part="deleteButton"],[data-history-part="clearHistoryButton"]{background:transparent!important;border:1px solid #bd8f88!important}
[data-history-part="deleteButtonText"],[data-history-part="clearHistoryButtonText"]{color:#7d3a2c!important}
[data-history-part="clearHistoryButton"]:hover,[data-history-part="deleteButton"]:hover{background:#f4ece6!important}
[data-history-part="emptyPanel"],[data-history-part="statusPanel"]{min-height:220px!important;padding:24px!important;gap:12px!important;background:#fffefa!important;border:1px solid #e2e5dd!important;border-radius:12px!important}
[data-history-part="emptyIcon"]{font-size:32px!important}
[data-history-part="emptyTitle"]{font-size:20px!important;font-weight:500!important;line-height:1.4!important;color:#294b3c!important}
[data-history-part="emptyText"]{font-size:15px!important;line-height:1.6!important;color:#495e51!important}
[data-history-part="statusText"]{font-weight:400!important;color:#495e51!important}
[data-history-part="primaryButton"]{min-height:44px!important;padding:9px 16px!important;background:#102c25!important;border-radius:10px!important}
[data-history-part="primaryButtonText"]{font-size:15px!important;font-weight:500!important;line-height:1.45!important;white-space:normal;text-align:center}
[data-history-part="screen"] :is([role="button"],a,[tabindex]):focus-visible{outline:3px solid #d9b96f!important;outline-offset:3px}
@media(max-width:600px){
  [data-history-part="headerInner"],[data-history-part="content"]{padding-left:16px!important;padding-right:16px!important}
  [data-history-part="headerInner"]{padding-top:24px!important}
}
`;
