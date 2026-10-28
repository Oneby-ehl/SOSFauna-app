import { AdvicePresentation } from "@/components/sos/StepOnePresentation";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import type { FaqIconProps } from "./FaqPresentation";

export function faqWebPart(part: string, active?: boolean): Record<string, unknown> {
  return { dataSet: { faqPart: part, ...(active === undefined ? {} : { faqActive: String(active) }) } };
}

export function FaqIcon({ kind, expanded }: FaqIconProps) {
  const name = kind === "search" ? "search" : kind === "clear" ? "close" : expanded ? "expand-less" : "expand-more";
  return <span className={`sf-faq-icon${kind === "search" ? " sf-faq-search-icon" : ""}`} aria-hidden="true">
    <MaterialIcons name={name} size={18} color="#647b6a" />
  </span>;
}

export function FaqAnswer({ text }: { text: string }) {
  return <div className="sf-faq-advice"><AdvicePresentation text={text} headingLevel={4} /></div>;
}

export function FaqStyles() { return <style>{styles}</style>; }

// Shared presentation for general and species FAQs; other pages are excluded.
const styles = `
.sf-faq-advice{width:100%;max-width:none;min-width:0;box-sizing:border-box}
.sf-faq-advice .sg-advice{width:100%;max-width:none;min-width:0;box-sizing:border-box;padding:0;border:0;background:transparent;border-radius:0;color:#17382e;font:400 15px/1.6 Arial,Helvetica,sans-serif;overflow-wrap:anywhere}
.sf-faq-advice .sg-advice p{font:inherit;margin:0 0 8px;white-space:pre-wrap;overflow-wrap:anywhere}
.sf-faq-advice .sg-advice-heading{font:500 16px/1.45 Arial,Helvetica,sans-serif;color:#294b3c;letter-spacing:.1px;margin:14px 0 8px;padding-bottom:5px;border-bottom:1px solid #e2e5dd}
.sf-faq-advice .sg-advice-heading:first-child{margin-top:0}
.sf-faq-advice .sg-advice-prohibition{color:#7d3a2c;border-color:#dfcfc6}
.sf-faq-advice .sg-advice-safety{color:#685320;border-color:#d9b96f}
.sf-faq-advice .sg-advice-action{color:#234a3a;border-color:#ccd8c6}
.sf-faq-advice .sg-advice-item{padding-left:14px;text-indent:-14px}
.sf-faq-advice .sg-advice-space{height:6px}
.sf-faq-advice .sg-advice-space + .sg-advice-space{display:none}

[data-faq-part="screen"]{background:#f5f3ec!important}
[data-faq-part="screen"] > div{width:100%!important;max-width:none!important;align-self:stretch!important;padding:32px 0 0!important;gap:24px!important;flex-grow:1}
[data-faq-part="screen"] > div > :is([data-faq-part="header"],[data-faq-part="content"],[data-faq-part="emptyState"],[data-faq-part="specializedSection"],[data-faq-part="topicQuestions"],[data-faq-part="topicNavigation"]){width:calc(100% - 64px);max-width:976px;align-self:center}
[data-faq-part="backButton"]{margin-left:max(32px,calc((100% - 976px)/2))!important}
[data-faq-part="screen"] .sf-site-footer{margin-top:auto}

[data-faq-part="screen"] [data-faq-part]{font-family:Arial,Helvetica,sans-serif!important;box-sizing:border-box;min-width:0}
[data-faq-part="header"]{gap:8px!important}
[data-faq-part="eyebrow"]{font-size:11px!important;font-weight:500!important;line-height:1.5!important;letter-spacing:1.4px;color:#647b6a!important}
[data-faq-part="screen"] [data-faq-part="title"]{font:400 clamp(28px,3.6vw,38px)/1.2 Georgia,'Times New Roman',serif!important;letter-spacing:-.4px;color:#102c25!important;overflow-wrap:anywhere}
[data-faq-part="intro"]{font-size:15px!important;line-height:1.65!important;font-weight:400!important;color:#495e51!important;max-width:75ch!important}
[data-faq-part="searchSection"]{width:100%;max-width:1040px;align-self:center;margin-left:0!important;margin-right:0!important;padding:10px 32px 12px!important;gap:10px!important;background:#f5f3ec!important;border-color:#e2e5dd!important}
[data-faq-part="searchInputWrap"]{position:relative}
[data-faq-part="screen"] [data-faq-part="searchInput"]{min-height:44px!important;width:100%;padding:9px 44px 9px 40px!important;border:1px solid #d4ddce!important;border-radius:10px!important;background:#fffefa!important;color:#17382e!important;font:400 15px/1.5 Arial,Helvetica,sans-serif!important}
[data-faq-part="searchInput"]::placeholder{color:#647b6a;opacity:1}
.sf-faq-icon{display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;line-height:1;pointer-events:none}
.sf-faq-search-icon{position:absolute;left:12px;top:50%;transform:translateY(-50%);z-index:1}
[data-faq-part="clearSearchButton"]{width:44px!important;height:44px!important;right:0!important;top:0!important;padding:0!important;border-radius:10px!important;background:transparent!important}
[data-faq-part="categoryList"]{display:flex!important;width:100%;max-width:100%;min-width:0;gap:8px!important;flex-direction:row!important;flex-wrap:wrap!important;align-self:stretch}
[data-faq-part="categoryPill"]{flex:0 1 auto;min-width:0;min-height:44px;max-width:100%;justify-content:center;padding:8px 12px!important;border:1px solid #d4ddce!important;border-radius:8px!important;background:#f5f6f1!important}
[data-faq-part="categoryPillText"]{min-width:0;max-width:100%;flex-shrink:1;font-size:13px!important;font-weight:500!important;line-height:1.5!important;color:#294b3c!important;white-space:normal;overflow-wrap:anywhere}
[data-faq-part="categoryPill"][data-faq-active="true"],[data-faq-part="categoryPill"]:active{background:#102c25!important;border-color:#102c25!important}
[data-faq-part="categoryPill"][data-faq-active="true"] [data-faq-part="categoryPillText"],[data-faq-part="categoryPill"]:active [data-faq-part="categoryPillText"]{color:#fff!important}
[data-faq-part="content"]{gap:24px!important}
[data-faq-part="categorySection"]{gap:10px!important}
[data-faq-part="topicQuestions"]{gap:8px!important}
[data-faq-part="topicAnswerLinks"]{gap:12px!important}
[data-faq-part="topicNavigation"]{gap:12px!important;padding-top:8px!important}
[data-faq-part="topicNavigation"] a{font:400 15px/1.6 Arial,Helvetica,sans-serif;color:#294b3c;overflow-wrap:anywhere;text-underline-offset:3px}

[data-faq-part="categoryTitle"]{font-size:20px!important;font-weight:500!important;line-height:1.4!important;color:#294b3c!important}
[data-faq-part="questionList"]{gap:8px!important}
[data-faq-part="faqCard"]{background:#fffefa!important;border:1px solid #e2e5dd!important;border-radius:10px!important;overflow:visible!important}
[data-faq-part="questionButton"]{min-height:48px!important;padding:10px 12px!important;gap:12px!important;border-radius:10px}
[data-faq-part="questionButton"]:hover{background:#f5f6f1}
[data-faq-part="questionText"]{font-size:17px!important;font-weight:500!important;line-height:1.45!important;color:#17382e!important;white-space:normal;overflow-wrap:anywhere}
[data-faq-part="answerContent"]{padding:14px 12px!important;gap:12px!important;border-color:#e2e5dd!important}
[data-faq-part="answerText"]{max-width:none!important;width:100%;font-size:15px!important;font-weight:400!important;line-height:1.6!important;color:#17382e!important;white-space:pre-wrap;overflow-wrap:anywhere}
[data-faq-part="createNoticeBox"],[data-faq-part="recoveryCentersBox"]{padding:12px!important;gap:8px!important;background:#edf2e8!important;border:1px solid #d8e1d1!important;border-radius:10px!important}
[data-faq-part="createNoticeTitle"],[data-faq-part="recoveryCentersTitle"]{font-size:15px!important;font-weight:500!important;line-height:1.45!important;color:#294b3c!important}
[data-faq-part="createNoticeText"],[data-faq-part="recoveryCentersText"]{max-width:none;font-weight:400!important;line-height:1.6!important;color:#495e51!important}
[data-faq-part="createNoticeButton"],[data-faq-part="recoveryCentersButton"]{min-height:44px!important;padding:9px 14px!important;background:#102c25!important;border-radius:10px!important}
[data-faq-part="createNoticeButtonText"],[data-faq-part="recoveryCentersButtonText"]{font-weight:500!important;line-height:1.45!important;text-align:center;white-space:normal;overflow-wrap:anywhere}
[data-faq-part="createNoticeBox"]{padding:14px!important;gap:10px!important}
[data-faq-part="createNoticeText"]{font-size:15px!important}
[data-faq-part="createNoticeButton"]{align-self:flex-start!important;max-width:100%;background:#fffefa!important;border:1px solid #b7c7b8!important;border-radius:8px!important}
[data-faq-part="createNoticeButtonText"]{font-size:15px!important;font-weight:500!important;color:#294b3c!important}
[data-faq-part="createNoticeButton"]:hover{background:#edf1e8!important}

[data-faq-part="emptyState"]{padding:16px!important;background:#fffefa!important;border:1px solid #e2e5dd!important;border-radius:10px!important}
[data-faq-part="emptyText"]{font-size:15px!important;line-height:1.6!important;color:#495e51!important}
[data-faq-part="specializedSection"]{border-color:#e2e5dd!important;padding-top:16px!important}
[data-faq-part="specializedTitle"]{font-weight:500!important;color:#52695b!important}
[data-faq-part="specializedLink"]{min-height:44px!important;background:#f5f6f1!important;border:1px solid #d4ddce!important;border-radius:8px!important;color:#294b3c!important;font-weight:500!important}
[data-faq-part="backButton"]{min-height:44px!important;max-width:100%;padding:8px 14px!important;border:1px solid #b7c7b8!important;border-radius:8px!important;background:#fffefa!important;justify-content:center}
[data-faq-part="backButton"]:hover{background:#edf1e8!important}
[data-faq-part="backButtonText"]{font-weight:500!important;color:#294b3c!important}

[data-faq-part="screen"] :is([role="button"],a,input,[tabindex]):focus-visible{outline:3px solid #d9b96f!important;outline-offset:3px}
@media(max-width:600px){
  [data-faq-part="screen"] > div{padding-top:24px!important}
  [data-faq-part="screen"] > div > :is([data-faq-part="header"],[data-faq-part="content"],[data-faq-part="emptyState"],[data-faq-part="specializedSection"],[data-faq-part="topicQuestions"],[data-faq-part="topicNavigation"]){width:calc(100% - 32px)}
  [data-faq-part="backButton"]{margin-left:16px!important}
  [data-faq-part="searchSection"]{margin-left:0!important;margin-right:0!important;padding-left:16px!important;padding-right:16px!important}
  [data-faq-part="questionText"]{font-size:16px!important}
}
`;
