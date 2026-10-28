import type { PropsWithChildren } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { getEffectiveCatalog } from "@/i18n/translate";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export function StepOneCard({ title, step = 1, children }: PropsWithChildren<{ title: string; step?: number }>) {
  const { t } = useI18n();
  return <section className="sg-step-one-card" aria-labelledby="sg-step-one-title">
    <header className="sg-step-one-heading">
      <p className="sg-step-one-eyebrow">{t("assistantExtraUi", "navigationTitle")}</p>
      <h1 id="sg-step-one-title">{title}</h1>
      {step === 1 ? <p className="sg-step-one-counter">{t("assistantUi", "step1Progress")}</p> : null}
      {/* Step is actually 1 | 2 | 3 | 4; sharing/help are overlays, not steps. */}
      <div className="sg-step-one-progress" role="progressbar" aria-valuemin={0} aria-valuemax={4}
        aria-valuenow={step} aria-label={t("navigation", "guide")} aria-valuetext={step === 1 ? t("assistantUi", "step1Progress") : title}>
        {[1, 2, 3, 4].map(number => <span key={number} className={number <= step ? "is-current" : undefined} aria-hidden="true" />)}
      </div>
    </header>
    <div className="sg-step-one-body">{children}</div>
  </section>;
}

export function StepOneStyles({ active }: { active: boolean }) {
  return active ? <style>{stepOneStyles}</style> : null;
}

// React Native's native prop types omit dataSet; the web adapter supplies it
// only on web, leaving native props and styles untouched.
export function stepOneDataSet(active: boolean, markers: Record<string, string>): Record<string, unknown> {
  return active ? { dataSet: markers } : {};
}

// Presentation only: remove the known decorative question prefixes, keeping
// translated wording and functional/warning symbols in all other content.
export function guideQuestionTitle(text: string): string {
  return text.replace(/^(?:❤️|🐾|👀|📍|🌍)\s*/u, "");
}

export function guideSummaryText(text: string): string {
  // Prefixes only: keep the meaningful red cross and all actual report text.
  return text.replace(/^(?:(?!❌)\p{Extended_Pictographic}[\uFE0F\u200D]*\s*|[•·]\s*)+/u, "");
}

export function GuideAbsenceIndicator({ text }: { text: string }) {
  return <span className="sg-absence-indicator">
    <svg className="sg-absence-icon" width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">
      <path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
    <span>{text.replace(/^❌\s*/u, "")}</span>
  </span>;
}

export function StepThreeStatus({ kind, text }: { kind: "photo" | "video" | "location"; text: string }) {
  const names = { photo: "photo-camera", video: "videocam", location: "place" } as const;
  const checked = /[✓✅]\s*$/u.test(text);
  const label = text.replace(/^(?:📷|🎥|📍)\s*/u, "").replace(/\s*[✓✅]\s*$/u, "");
  return <span className="sg-step-three-status">
    <span className="sg-step-three-icon" aria-hidden="true"><MaterialIcons name={names[kind]} size={16} color="#426351" /></span>
    <span className="sg-step-three-label">{label}</span>
    {checked ? <span className="sg-step-three-icon" aria-hidden="true"><MaterialIcons name="check" size={16} color="#426351" /></span> : null}
  </span>;
}

export function GuideActionIcon({ action }: { action: "whatsapp" | "copy" | "help" | "finish" }) {
  const names = { whatsapp: "chat-bubble-outline", copy: "content-copy", help: "phone", finish: "check-circle-outline" } as const;
  return <span className="sg-action-icon" aria-hidden="true"><MaterialIcons name={names[action]} size={18} color="#102c25" /></span>;
}

export function GuideConfirmationCard({ title, children }: PropsWithChildren<{ title: string }>) {
  return <section className="sg-empty-confirm" aria-labelledby="sg-empty-confirm-title">
    <h1 id="sg-empty-confirm-title">{title}</h1>{children}
  </section>;
}

function RecommendationIcon({ kind }: { kind: "warning" | "speaker" | "stop" }) {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"
    style={{ verticalAlign: "-2px", marginRight: 6 }}>
    {kind === "warning" ? <><path d="m12 3 10 18H2L12 3Z" /><path d="M12 9v5m0 3h.01" /></>
      : kind === "stop" ? <rect x="5" y="5" width="14" height="14" rx="1" />
      : <><path d="M11 4 6 8H3v8h3l5 4V4Z" /><path d="M15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14" /></>}
  </svg>;
}

export function GuideSpeechLabel({ text }: { text: string }) {
  return <><RecommendationIcon kind={text.startsWith("⏹") ? "stop" : "speaker"} />{text.replace(/^(?:🔊|⏹)\uFE0F?\s*/u, "")}</>;
}

export function AdvicePresentation({ text, headingLevel = 2 }: { text: string; headingLevel?: 2 | 3 | 4 }) {
  const Heading = headingLevel === 4 ? "h4" : headingLevel === 3 ? "h3" : "h2";
  const { locale } = useI18n();
  const catalog = getEffectiveCatalog(locale);
  const headings = new Map<string, { text: string; kind: string; warningIcon?: boolean }>();
  const cleanHeading = (line: string) => line.replace(/^\p{Extended_Pictographic}[\uFE0F\u200D]*\s*/u, "");
  // Exact catalog matches only; never strip warning symbols from advice prose.
  for (const [key, value] of Object.entries(catalog.rescueHeadings)) {
    const line = value.trim();
    const kind = key.startsWith("doNot") ? "prohibition" : key.startsWith("actions") ? "action" : "safety";
    headings.set(line, { text: cleanHeading(line), kind, warningIcon: key.startsWith("beforeIntervening") });
  }
  for (const [group, values] of Object.entries(catalog)) {
    if (!group.endsWith("Advice") || !values || typeof values !== "object") continue;
    for (const [key, value] of Object.entries(values)) {
      if (typeof value !== "string" || !/(?:title|heading)$/i.test(key)) continue;
      const line = value.trim();
      if (line.includes("\n")) continue;
      const warning = /warning|precaution/i.test(key);
      headings.set(line, { text: warning && !/title$/i.test(key) ? line : cleanHeading(line), kind: warning ? "safety" : "context" });
    }
  }
  return <div className="sg-advice">{text.split("\n").map((line, index) => {
    const heading = headings.get(line.trim());
    if (heading) return <Heading key={index} className={`sg-advice-heading sg-advice-${heading.kind}`}>{heading.warningIcon ? <RecommendationIcon kind="warning" /> : null}{heading.text}</Heading>;
    if (!line.trim()) return <div className="sg-advice-space" aria-hidden="true" key={index} />;
    return <p key={index} className={line.startsWith("• ") ? "sg-advice-item" : undefined}>{line}</p>;
  })}</div>;
}

// Web guide presentation only; confirmations, shared menu and footer retain their own styles.
const stepOneStyles = `
[data-sos-guide-visual="true"]{background:#f5f3ec!important;color:#17382e}
[data-sos-guide-visual="true"] [data-sos-guide-content="true"]{width:100%;max-width:1040px;align-self:center;padding-left:32px!important;padding-right:32px!important;padding-bottom:44px!important}
[data-sos-guide-visual="true"] .sg-step-one-card{width:100%;min-width:0;color:#17382e}
[data-sos-guide-visual="true"] .sg-step-one-heading{padding:4px 0 20px}
[data-sos-guide-visual="true"] .sg-step-one-eyebrow{margin:0 0 8px;font:500 12px/1.5 Arial,Helvetica,sans-serif;letter-spacing:.35px;color:#647b6a}
[data-sos-guide-visual="true"] .sg-step-one-counter{margin:0 0 12px;font:500 13px/1.5 Arial,Helvetica,sans-serif;color:#52695b}
[data-sos-guide-visual="true"] .sg-step-one-heading h1{font:400 clamp(28px,3.6vw,42px)/1.2 Georgia,'Times New Roman',serif;letter-spacing:-.5px;margin:0 0 12px;color:#102c25;overflow-wrap:break-word}
[data-sos-guide-visual="true"] .sg-step-one-progress{display:flex;gap:6px;max-width:440px}
[data-sos-guide-visual="true"] .sg-step-one-progress span{height:4px;flex:1;border-radius:2px;background:#dce2d7}
[data-sos-guide-visual="true"] .sg-step-one-progress .is-current{background:#234a3a}
[data-sos-guide-visual="true"] .sg-step-one-body > div{gap:18px!important}
[data-sos-guide-visual="true"] [data-sos-step-intro="true"]{font:400 15px/1.6 Arial,Helvetica,sans-serif!important;color:#495e51!important;max-width:760px}
[data-sos-guide-visual="true"] [data-sos-question="true"]{padding:12px 22px!important;gap:10px!important;background:#fffefa!important;border:1px solid #e2e5dd!important;border-radius:12px!important}
[data-sos-guide-visual="true"] [data-sos-question-title="true"]{font:500 17px/1.4 Arial,Helvetica,sans-serif!important;letter-spacing:.1px;color:#294b3c!important;margin-top:0!important}
[data-sos-guide-visual="true"] [data-sos-animal-group]{background:transparent!important;border:0!important;padding:4px 0!important;gap:8px!important}
[data-sos-guide-visual="true"] [data-sos-animal-group] > div:first-child{font-size:12px!important;font-weight:400!important;line-height:18px!important;letter-spacing:.4px;color:#647b6a!important}
[data-sos-guide-visual="true"] [data-sos-option="true"]{box-sizing:border-box;min-height:44px;min-width:48px;max-width:100%;justify-content:center;padding:8px 14px!important;border:1px solid #d4ddce!important;border-radius:10px!important;background:#f5f6f1!important;color:#17382e!important}
[data-sos-guide-visual="true"] [data-sos-option="true"] > div{font:400 15px/1.45 Arial,Helvetica,sans-serif!important;letter-spacing:.1px;color:inherit!important;white-space:normal;overflow-wrap:break-word}
[data-sos-guide-visual="true"] [data-sos-option="true"][aria-pressed="true"]{background:#102c25!important;border-color:#102c25!important;color:#fff!important}
[data-sos-guide-visual="true"] [role="button"]:focus-visible{outline:3px solid #b58c32!important;outline-offset:3px}
[data-sos-guide-visual="true"] [data-sos-guide-scroll-hint="true"]{top:auto!important;right:auto!important;left:24px;bottom:calc(22px + env(safe-area-inset-bottom,0px))!important;width:44px!important;height:48px!important;background:#426351!important;box-shadow:none!important}
[data-sos-guide-visual="true"] .sg-step-one-body,[data-sos-guide-visual="true"] .sg-step-one-body *{font-family:Arial,Helvetica,sans-serif!important}
[data-sos-guide-visual="true"][data-sos-guide-step="1"] [data-sos-guide-content="true"]{padding-top:20px!important}
[data-sos-guide-visual="true"] [data-sos-guide-ui="sectionContent"]{gap:18px!important;min-width:0}
[data-sos-guide-visual="true"] [data-sos-guide-ui="sectionDescription"]{font-size:15px!important;line-height:1.6!important;color:#495e51!important;max-width:760px}
[data-sos-guide-visual="true"] [data-sos-guide-ui="subheading"]{font-size:17px!important;font-weight:500!important;line-height:1.4!important;letter-spacing:.1px;color:#294b3c!important;margin-top:0!important}
[data-sos-guide-visual="true"] [data-sos-guide-ui="sectionGroup"],
[data-sos-guide-visual="true"] [data-sos-guide-ui="mapCard"],
[data-sos-guide-visual="true"] [data-sos-guide-ui="summaryPreview"]{padding:12px 22px!important;border:1px solid #e2e5dd!important;border-radius:12px!important;background:#fffefa!important;box-shadow:none!important;min-width:0}
[data-sos-guide-visual="true"] [data-sos-guide-ui="flagGrid"]{gap:8px!important;min-width:0}
[data-sos-guide-visual="true"] [data-sos-option="true"]:active:not([aria-disabled="true"]){border-color:#557461!important}
[data-sos-guide-visual="true"] [data-sos-option="true"][aria-disabled="true"]{opacity:.6}
[data-sos-guide-visual="true"] [data-sos-guide-content="true"] :is([role="button"],[tabindex],input,textarea):focus-visible{outline:3px solid #b58c32!important;outline-offset:3px}
[data-sos-guide-visual="true"] [data-sos-guide-ui="primaryButton"],
[data-sos-guide-visual="true"] [data-sos-guide-ui="secondaryButton"],
[data-sos-guide-visual="true"] [data-sos-guide-ui="speechButton"],
[data-sos-guide-visual="true"] [data-sos-guide-ui="mapOpenButton"]{min-height:44px!important;max-width:100%;border-radius:10px!important;padding:8px 14px!important;justify-content:center}
[data-sos-guide-visual="true"] [data-sos-guide-ui="primaryButton"],
[data-sos-guide-visual="true"] [data-sos-guide-ui="mapOpenButton"]{background:#102c25!important}
[data-sos-guide-visual="true"] [data-sos-guide-ui="primaryButtonText"],
[data-sos-guide-visual="true"] [data-sos-guide-ui="mapOpenButtonText"]{font-size:15px!important;line-height:1.45!important;font-weight:400!important;letter-spacing:.1px;color:#fff!important;text-align:center;white-space:normal;overflow-wrap:anywhere}
[data-sos-guide-visual="true"] [data-sos-guide-ui="secondaryButton"],
[data-sos-guide-visual="true"] [data-sos-guide-ui="speechButton"]{background:#edf1e8!important;border:1px solid #d4ddce!important}
[data-sos-guide-visual="true"] [data-sos-guide-ui="secondaryButtonText"],
[data-sos-guide-visual="true"] [data-sos-guide-ui="speechButtonText"]{font-size:15px!important;line-height:1.45!important;font-weight:400!important;letter-spacing:.1px;color:#17382e!important;white-space:normal;overflow-wrap:anywhere}
[data-sos-guide-visual="true"] [data-sos-guide-ui="speechStatusText"]{font-weight:400!important;color:#52695b!important}
[data-sos-guide-visual="true"] [data-sos-guide-ui="helperText"],
[data-sos-guide-visual="true"] [data-sos-guide-ui="mapEmptyText"]{font-size:14px!important;line-height:1.55!important;color:#52695b!important}
[data-sos-guide-visual="true"] [data-sos-guide-ui="advice"]{min-height:0!important;padding:12px 22px!important;background:#edf2e8!important;border-color:#d8e1d1!important;border-radius:12px!important;color:#17382e!important;font-size:16px!important;line-height:1.6!important}
[data-sos-guide-visual="true"] [data-sos-guide-ui="summaryPreviewTitle"],
[data-sos-guide-visual="true"] [data-sos-guide-ui="mapTitle"]{font-size:17px!important;line-height:1.4!important;font-weight:500!important;color:#102c25!important}
[data-sos-guide-visual="true"] [data-sos-guide-ui="summaryPreviewLabel"],
[data-sos-guide-visual="true"] [data-sos-guide-ui="mapLocationLabel"]{font-weight:500!important;color:#647b6a!important;line-height:1.5!important}
[data-sos-guide-visual="true"] [data-sos-guide-ui="summaryPreviewValue"],
[data-sos-guide-visual="true"] [data-sos-guide-ui="summaryPreviewListItem"],
[data-sos-guide-visual="true"] [data-sos-guide-ui="mapLocationTitle"]{font-weight:500!important;color:#17382e!important;line-height:1.5!important;overflow-wrap:anywhere}
[data-sos-guide-visual="true"] [data-sos-guide-ui="summaryPreviewValue"],
[data-sos-guide-visual="true"] [data-sos-guide-ui="summaryPreviewListItem"]{font-size:15px!important;font-weight:400!important;line-height:1.45!important;letter-spacing:.1px}
[data-sos-guide-visual="true"] [data-sos-guide-ui="mapLocationText"],
[data-sos-guide-visual="true"] [data-sos-guide-ui="mapCoords"]{font-weight:400!important}
[data-sos-guide-visual="true"] [data-sos-guide-ui="summaryPreviewSection"]{border-color:#e2e5dd!important;padding-top:10px!important}
[data-sos-guide-visual="true"] [data-sos-guide-ui="summaryPreviewMetaRow"]{border-color:#e2e5dd!important;gap:8px!important;padding-top:10px!important}
[data-sos-guide-visual="true"] [data-sos-guide-ui="summaryPreviewMetaItem"],
[data-sos-guide-visual="true"] [data-sos-guide-ui="summaryInstructions"],
[data-sos-guide-visual="true"] [data-sos-guide-ui="mapLocationBox"],
[data-sos-guide-visual="true"] [data-sos-guide-ui="mapEmptyBox"]{background:#edf2e8!important;border-color:#d8e1d1!important;border-radius:10px!important}
[data-sos-guide-visual="true"] [data-sos-guide-ui="mapLocationBox"],
[data-sos-guide-visual="true"] [data-sos-guide-ui="mapEmptyBox"]{min-height:0!important;padding:12px!important}
[data-sos-guide-visual="true"] [data-sos-guide-ui="summaryInstructions"]{padding:10px 12px!important;gap:6px!important}
[data-sos-guide-visual="true"] [data-sos-guide-ui="summaryPreview"]{gap:10px!important}
[data-sos-guide-visual="true"] [data-sos-guide-ui="bulletText"] > span{font-weight:500!important;color:#294b3c!important}
[data-sos-guide-visual="true"] [data-sos-guide-ui="bulletText"]{font-size:15px!important;line-height:1.6!important;color:#495e51!important}
[data-sos-guide-visual="true"] [data-sos-guide-ui="summaryActionBar"]{background:#f5f3ec!important;border-color:#d8e1d1!important;box-shadow:none!important}
[data-sos-guide-visual="true"] [data-sos-guide-ui="menuActionButton"]{background:#edf1e8!important;border-radius:10px!important}
[data-sos-guide-visual="true"] [data-sos-guide-ui="menuPrimary"]{background:#102c25!important;border-radius:10px!important}
[data-sos-guide-visual="true"] [data-sos-guide-ui="menuActionEmoji"]{font-size:16px!important;line-height:22px!important;text-align:center}
[data-sos-guide-visual="true"] [data-sos-guide-ui="menuActionLabel"]{font-family:Arial,Helvetica,sans-serif!important;font-weight:500!important;color:#17382e!important}
[data-sos-guide-visual="true"] [data-sos-guide-ui="menuActionLabelPrimary"]{font-family:Arial,Helvetica,sans-serif!important;font-weight:500!important;color:#fff!important}
/* Exact palette of the existing exit dialog's .sf-primary in siteChromeStyles. */
[data-sos-guide-step] [data-sos-guide-arrow]{background:#d9b96f!important;color:#102c25!important;box-shadow:none!important}
[data-sos-guide-step] [data-sos-guide-arrow] > *{color:#102c25!important}
[data-sos-guide-visual="true"] [data-sos-guide-arrow]:focus-visible{outline:3px solid #b58c32!important;outline-offset:2px}
.sg-advice{padding:12px 22px;background:#fffefa;border:1px solid #e2e5dd;border-radius:12px;color:#17382e;font:400 15px/1.6 Arial,Helvetica,sans-serif;min-width:0}
.sg-advice p{font:inherit;margin:0 0 6px;white-space:pre-wrap;overflow-wrap:anywhere}
.sg-advice .sg-advice-heading{font:500 16px/1.45 Arial,Helvetica,sans-serif;margin:14px 0 8px;padding-bottom:5px;border-bottom:1px solid #e2e5dd;letter-spacing:.1px;color:#294b3c}
.sg-advice .sg-advice-heading:first-child{margin-top:0}
.sg-advice .sg-advice-prohibition{color:#7d3a2c;border-color:#dfcfc6}
.sg-advice .sg-advice-safety{color:#685320;border-color:#d9b96f}
.sg-advice .sg-advice-action{color:#234a3a;border-color:#ccd8c6}
.sg-advice-item{padding-left:14px;text-indent:-14px}
.sg-advice-space{height:6px}
.sg-advice-space + .sg-advice-space{display:none}
[data-sos-guide-visual="true"] [data-sos-guide-ui="summaryActionBar"]{position:relative!important;top:auto!important;left:auto!important;right:auto!important;flex-shrink:0;display:grid!important;grid-template-columns:repeat(4,minmax(0,180px));justify-content:center;gap:8px!important;padding:8px 32px!important;font-family:Arial,Helvetica,sans-serif;box-sizing:border-box}
[data-sos-guide-visual="true"] [data-sos-guide-ui="summaryActionBar"] > [data-sos-guide-action]{display:flex!important;flex-direction:row!important;flex:initial!important;align-items:center;justify-content:center;gap:8px!important;min-width:0;min-height:44px!important;padding:8px 12px!important;border:1px solid #d4ddce;border-radius:10px!important;background:#edf1e8!important;box-sizing:border-box}
[data-sos-guide-visual="true"] [data-sos-guide-ui="summaryActionBar"] > [data-sos-guide-action="finish"]{background:#d9b96f!important;border-color:#d9b96f}
[data-sos-guide-visual="true"] [data-sos-guide-ui="summaryActionBar"] [data-sos-guide-ui="menuActionLabel"],
[data-sos-guide-visual="true"] [data-sos-guide-ui="summaryActionBar"] [data-sos-guide-ui="menuActionLabelPrimary"]{font:500 13px/1.4 Arial,Helvetica,sans-serif!important;color:#102c25!important;white-space:normal;overflow-wrap:anywhere}
.sg-action-icon{display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;line-height:1}
.sg-absence-indicator{display:inline-flex;align-items:center;gap:4px;vertical-align:middle;font:inherit;line-height:inherit}
.sg-absence-icon{flex-shrink:0;color:#7d3a2c}
[data-sos-guide-visual="true"][data-sos-guide-step="3"] .sg-step-three-status{display:inline-flex;align-items:center;gap:6px;max-width:100%;vertical-align:middle;font:inherit;line-height:inherit}
[data-sos-guide-visual="true"][data-sos-guide-step="3"] .sg-step-three-label{min-width:0;white-space:normal;overflow-wrap:break-word}
[data-sos-guide-visual="true"][data-sos-guide-step="3"] .sg-step-three-icon{display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;line-height:1}
/* The guide's sans-serif rule must not replace the existing vector icon font. */
[data-sos-guide-visual="true"][data-sos-guide-step="3"] .sg-step-three-icon > :is(div,span){font-family:material!important}
[data-sos-guide-visual="true"][data-sos-guide-step="3"] :is([data-sos-guide-ui="mapLocationBox"],[data-sos-guide-ui="mapEmptyBox"]){align-items:flex-start!important;justify-content:flex-start!important;gap:4px!important;padding:10px 12px!important}
[data-sos-guide-visual="true"][data-sos-guide-step="3"] :is([data-sos-guide-ui="mapLocationBox"],[data-sos-guide-ui="mapEmptyBox"]) > div{max-width:100%;text-align:left!important}
[data-sos-guide-visual="true"][data-sos-guide-step="3"] [data-sos-guide-ui="mapCoords"]{-webkit-user-select:text!important;user-select:text!important;cursor:text}
[data-sos-guide-visual="true"][data-sos-guide-step="4"]:has([data-sos-guide-ui="summaryActionBar"]) [data-sos-guide-content="true"]{padding-top:12px!important}
[data-sos-guide-visual="true"] [data-sos-guide-ui="summaryPreviewSection"]{border-color:#e4e7df!important}
.sg-empty-confirm{box-sizing:border-box;max-width:640px;width:100%;align-self:center;margin:12px auto;padding:22px;background:#fffefa;border:1px solid #e2e5dd;border-radius:12px;color:#17382e;font-family:Arial,Helvetica,sans-serif}
.sg-empty-confirm h1{font:400 26px/1.25 Georgia,'Times New Roman',serif;color:#102c25;margin:0 0 16px}
.sg-empty-confirm [data-sos-confirm-ui="content"]{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px!important}
.sg-empty-confirm [data-sos-confirm-ui="description"]{grid-column:1/-1;font:400 15px/1.6 Arial,Helvetica,sans-serif!important;color:#495e51!important}
.sg-empty-confirm [data-sos-confirm-ui="primary"],.sg-empty-confirm [data-sos-confirm-ui="secondary"]{min-height:44px;min-width:0;border-radius:10px!important;padding:8px 14px!important;justify-content:center;background:#edf1e8!important;border:1px solid #d4ddce}
.sg-empty-confirm [data-sos-confirm-ui="primary"]{background:#102c25!important;border-color:#102c25}
.sg-empty-confirm [data-sos-confirm-ui="primary"] > div,.sg-empty-confirm [data-sos-confirm-ui="secondary"] > div{font:400 15px/1.45 Arial,Helvetica,sans-serif!important;text-align:center;white-space:normal;overflow-wrap:anywhere}
.sg-empty-confirm [data-sos-confirm-ui="primary"] > div{color:#fff!important}
.sg-empty-confirm [data-sos-confirm-ui="secondary"] > div{color:#17382e!important}
@media(max-width:600px){
  .sg-advice{padding:12px 16px}
  [data-sos-guide-visual="true"] [data-sos-guide-ui="summaryActionBar"]{grid-template-columns:repeat(2,minmax(0,1fr))}
  .sg-empty-confirm{padding:18px;margin-block:8px}
  .sg-empty-confirm [data-sos-confirm-ui="content"]{grid-template-columns:1fr}
  [data-sos-guide-visual="true"] [data-sos-guide-content="true"]{padding-left:32px!important;padding-right:32px!important}
  [data-sos-guide-visual="true"] [data-sos-question="true"]{padding:12px 16px!important;gap:10px!important}
  [data-sos-guide-visual="true"] [data-sos-question-title="true"]{font-size:17px!important}
  [data-sos-guide-visual="true"] [data-sos-option="true"]{padding:8px 12px!important}
  [data-sos-guide-visual="true"] :is([data-sos-guide-ui="primaryButton"],[data-sos-guide-ui="secondaryButton"],[data-sos-guide-ui="speechButton"],[data-sos-guide-ui="mapOpenButton"]){padding:8px 12px!important}
  [data-sos-guide-visual="true"] [data-sos-guide-scroll-hint="true"]{left:16px}
  [data-sos-guide-visual="true"] [data-sos-guide-ui="sectionContent"]{gap:16px!important}
  [data-sos-guide-visual="true"] [data-sos-guide-ui="sectionGroup"],
  [data-sos-guide-visual="true"] [data-sos-guide-ui="mapCard"],
  [data-sos-guide-visual="true"] [data-sos-guide-ui="summaryPreview"],
  [data-sos-guide-visual="true"] [data-sos-guide-ui="advice"]{padding:12px 16px!important}
  [data-sos-guide-visual="true"] [data-sos-guide-ui="advice"]{font-size:16px!important;line-height:1.6!important}
}
@media(prefers-reduced-motion:reduce){[data-sos-guide-visual="true"] *,[data-sos-guide-visual="true"] *:before,[data-sos-guide-visual="true"] *:after{animation:none!important;transition:none!important;scroll-behavior:auto!important}[data-sos-guide-visual="true"] [data-sos-guide-next="true"]{transform:none!important}}
`;
