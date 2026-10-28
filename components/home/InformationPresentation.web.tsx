import { interiorNavigationOptions } from "@/components/faq/TopicFaqHeader";

// Only navigation presentation changes; each page retains its title and H1.
export const informationStackOptions = interiorNavigationOptions;

export function informationWebPart(part: string): Record<string, unknown> {
  const level = part === "title" ? 1 : part === "cardTitle" ? 3
    : ["sectionTitle", "heading", "noticeTitle", "disclaimerTitle"].includes(part) ? 2 : undefined;
  return {
    dataSet: { informationPart: part },
    ...(level === undefined ? {} : { accessibilityRole: "header", "aria-level": level }),
  };
}

export function InformationStyles() { return <style>{styles}</style>; }

// Opt-in styles only: no shared navigation, footer or other pages are selected.
const styles = `
[data-information-part="screen"]{background:#f5f3ec!important}
[data-information-part="screen"] [data-information-part="pageContent"]{width:100%!important;max-width:1040px!important;align-self:center!important;padding:32px 32px 48px!important;gap:24px!important}
[data-information-part="screen"] [data-information-part]{font-family:Arial,Helvetica,sans-serif!important;box-sizing:border-box;min-width:0;overflow-wrap:anywhere}
[data-information-part="header"]{gap:10px!important}
[data-information-part="eyebrow"]{font-size:11px!important;font-weight:500!important;line-height:1.5!important;letter-spacing:1.4px;color:#52695b!important}
[data-information-part="screen"] [data-information-part="title"]{font:400 clamp(28px,3.6vw,38px)/1.2 Georgia,'Times New Roman',serif!important;letter-spacing:-.4px;color:#102c25!important}
[data-information-part="intro"],[data-information-part="sectionIntro"]{max-width:75ch!important;font-size:16px!important;font-weight:400!important;line-height:1.65!important;color:#495e51!important}
[data-information-part="updated"]{font-size:13px!important;font-weight:400!important;line-height:1.6!important;color:#52695b!important}
[data-information-part="section"]{padding:0!important;gap:12px!important;background:transparent!important;border:0!important;border-radius:0!important}
[data-information-part="content"]{width:100%!important;max-width:none!important;align-self:stretch!important;padding:0!important;gap:12px!important;background:transparent!important;border:0!important;border-radius:0!important}
[data-information-part="sectionTitle"],[data-information-part="heading"]{font-size:20px!important;font-weight:500!important;line-height:1.4!important;color:#294b3c!important;max-width:75ch}
[data-information-part="heading"]{margin-top:12px!important;margin-bottom:0!important}
[data-information-part="content"] > [data-information-part="heading"]:first-child{margin-top:0!important}
[data-information-part="paragraph"],[data-information-part="highlightedParagraph"],[data-information-part="cardText"],[data-information-part="noticeText"],[data-information-part="disclaimerText"]{max-width:75ch!important;font-size:16px!important;font-weight:400!important;line-height:1.7!important;color:#495e51!important;margin:0!important;white-space:pre-wrap}
[data-information-part="highlightedParagraph"]{font-weight:500!important;color:#294b3c!important}
[data-information-part="list"]{gap:8px!important;margin:0!important;max-width:75ch}
[data-information-part="listItem"]{gap:8px!important;font-size:16px!important;font-weight:400!important;line-height:1.7!important;color:#495e51!important}
[data-information-part="listText"],[data-information-part="bullet"]{font-size:16px!important;font-weight:400!important;line-height:1.7!important;color:#495e51!important}
[data-information-part="principles"]{gap:8px!important;flex-wrap:wrap!important}
[data-information-part="principle"]{padding:6px 10px!important;background:#edf1e8!important;border:1px solid #d4ddce!important;border-radius:8px!important}
[data-information-part="principleText"]{font-size:14px!important;font-weight:500!important;line-height:1.5!important;color:#294b3c!important}
[data-information-part="notice"],[data-information-part="disclaimer"]{padding:14px 16px!important;gap:10px!important;background:#edf2e8!important;border:1px solid #d8e1d1!important;border-left:3px solid #d9b96f!important;border-radius:10px!important}
[data-information-part="noticeTitle"],[data-information-part="disclaimerTitle"]{font-size:18px!important;font-weight:500!important;line-height:1.4!important;color:#294b3c!important}
[data-information-part="quote"]{max-width:75ch;border-left:2px solid #ccd5c8!important;padding:4px 0 4px 16px!important}
[data-information-part="quoteText"]{font-size:18px!important;font-weight:500!important;line-height:1.6!important;color:#294b3c!important}
[data-information-part="card"]{padding:12px 0!important;gap:8px!important;background:transparent!important;border:0!important;border-bottom:1px solid #e2e5dd!important;border-radius:0!important}
[data-information-part="cardTitle"]{font-size:17px!important;font-weight:500!important;line-height:1.45!important;color:#294b3c!important}
[data-information-part="orientationNote"]{max-width:75ch;font-size:14px!important;font-weight:400!important;line-height:1.6!important;color:#52695b!important}
[data-information-part="screen"] a{color:#294b3c;text-decoration:underline;text-underline-offset:3px;overflow-wrap:anywhere}
[data-information-part="linkButton"],[data-information-part="mailButton"]{min-height:44px;max-width:100%;padding:8px 0!important;background:transparent!important;border:0!important;border-radius:0!important;justify-content:center}
[data-information-part="linkButtonText"],[data-information-part="mailButtonText"]{font-weight:400!important;line-height:1.55!important;color:#294b3c!important;text-decoration:underline;text-underline-offset:3px;white-space:normal;overflow-wrap:anywhere}
[data-information-part="shareButton"]{min-height:44px;max-width:100%;padding:10px 14px!important;background:#edf1e8!important;border:1px solid #d4ddce!important;border-radius:10px!important;justify-content:center}
[data-information-part="shareButtonText"]{font-weight:500!important;line-height:1.45!important;color:#294b3c!important;white-space:normal}
[data-information-part="backButton"]{min-height:44px!important;max-width:100%;padding:8px 14px!important;border:1px solid #b7c7b8!important;border-radius:8px!important;background:#fffefa!important;justify-content:center}
[data-information-part="backButton"]:hover{background:#edf1e8!important}
[data-information-part="backButtonText"]{font-size:15px!important;font-weight:500!important;line-height:1.45!important;color:#294b3c!important;white-space:normal}

[data-information-part="screen"] :is(a,[role="button"],[tabindex]):focus-visible{outline:3px solid #d9b96f!important;outline-offset:3px}
@media(max-width:600px){[data-information-part="screen"] [data-information-part="pageContent"]{padding:24px 16px 40px!important}}
`;
