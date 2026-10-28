// Shared web menu and dialog styles, extracted from the home page.
export const siteChromeStyles = `
.sf-dialog,.sf-dialog *{box-sizing:border-box}
.sf-dialog button{font-family:inherit;cursor:pointer}
.sf-dialog button:disabled{cursor:wait;opacity:.7}
.sf-dialog a{color:inherit}
.sf-dialog :focus-visible,.sf-menu-trigger:focus-visible{outline:3px solid #d9b96f;outline-offset:4px}
body:has(dialog.sf-dialog[open]){overflow:hidden}
body:has(dialog.sf-dialog[open]) .sf-scroll,body:has(dialog.sf-dialog[open]) [data-sos-guide-scroll="true"]{overflow:hidden!important;touch-action:none}
.sf-site-header{flex-shrink:0;display:flex;align-items:center;justify-content:space-between;gap:16px;min-height:68px;padding:10px clamp(20px,4vw,56px);background:#102c25;color:#fff;border-bottom:1px solid #ffffff20;font-family:Arial,Helvetica,sans-serif}
.sf-site-header,.sf-site-header *{box-sizing:border-box}
.sf-site-brand-group{display:flex;align-items:center;gap:20px;min-width:0}
.sf-site-brand{font:700 14px/1.5 Arial,Helvetica,sans-serif;letter-spacing:1.7px;color:inherit;text-decoration:none;overflow-wrap:break-word}
.sf-site-languages{flex-shrink:0}
.sf-site-languages div{color:#fff!important}
.sf-site-header :focus-visible,.sf-site-footer :focus-visible{outline:3px solid #d9b96f;outline-offset:4px}
.sf-site-footer{box-sizing:border-box;flex-shrink:0;width:100%;min-width:0;margin-top:auto;padding:20px 0 max(20px,env(safe-area-inset-bottom,0px));background:#102c25;color:#e0e8e0;font-family:Arial,Helvetica,sans-serif}
.sf-site-footer *{box-sizing:border-box}
.sf-site-footer-inner{display:flex;flex-direction:column;gap:8px;width:100%;max-width:1040px;padding:0 32px;margin:0 auto}
.sf-site-footer p{font:400 13px/1.65 Arial,Helvetica,sans-serif;margin:0}
.sf-site-footer .sf-site-footer-brand{font-size:14px;font-weight:700;letter-spacing:1.7px;margin-bottom:6px}
.sf-site-footer .sf-site-service{font:400 13px/1.65 Arial,Helvetica,sans-serif;color:#e0e8e0;margin:4px 0 0}
.sf-site-footer-rule{width:100%;height:0;margin:0;border:0;border-top:1px solid #ffffff26}
.sf-site-footer .sf-site-independence{color:#bccbbf}
.sf-site-footer-meta{display:flex;flex-direction:row;flex-wrap:wrap;justify-content:space-between;align-items:baseline;gap:4px 16px}
.sf-site-footer-meta p{min-width:0;max-width:100%;font-size:12px;line-height:1.5;color:#bccbbf;overflow-wrap:anywhere}
.sf-site-footer-meta p:last-child{margin-left:auto;text-align:right}
.sf-page .sf-site-footer-inner{max-width:1400px;padding-inline:clamp(24px,6vw,100px)}
[data-site-footer-topic="true"] > div{width:100%!important;max-width:none!important;align-self:stretch!important;flex-grow:1;padding:48px 0 0!important}
[data-site-footer-topic="true"] > div > :not(.sf-site-footer){width:calc(100% - 48px);max-width:912px;align-self:center}
[data-site-footer-topic="true"] > div > :nth-last-child(2){padding-bottom:64px}
[data-site-footer-topic="true"] .sf-site-footer-inner{max-width:960px;padding-inline:24px}
@media(max-width:600px){.sf-site-footer-inner{padding-inline:16px}}
[data-sos-guide-scroll="true"] > div{width:100%;max-width:none!important;padding:0!important;gap:0!important;align-self:stretch!important;min-height:100%}
[data-sos-guide-content="true"]{width:100%;min-width:0;box-sizing:border-box}
[data-sos-guide-scroll="true"] .sf-site-footer{margin-top:auto;padding-bottom:max(20px,env(safe-area-inset-bottom,0px))}
.sf-exit-dialog .sf-primary,.sf-exit-dialog .sf-secondary{font-size:15px!important}
@media(max-width:700px){.sf-site-header{padding:8px 16px;gap:12px}.sf-site-brand-group{gap:12px}.sf-site-header .sf-site-brand{font-size:12px;letter-spacing:1px}}

@media(prefers-reduced-motion:reduce){.sf-menu-panel,.sf-menu-panel::backdrop{animation:none!important;transition:none!important}}
.sf-menu-trigger{display:flex;align-items:center;justify-content:center;min-width:44px;min-height:44px;background:none;color:inherit;border:1px solid #ffffff45;border-radius:0}
.sf-menu-icon{width:18px;height:12px;display:block;border-top:1px solid currentColor;border-bottom:1px solid currentColor;position:relative}
.sf-menu-icon:after{content:'';position:absolute;left:0;right:0;top:5px;border-top:1px solid currentColor}
.sf-primary{display:inline-flex;align-items:center;justify-content:center;gap:12px;min-height:48px;padding:13px 20px;border:1px solid #d9b96f;background:#d9b96f;color:#102c25;font-size:13px!important;line-height:1.45;font-weight:700!important;text-align:center;border-radius:0}
.sf-primary:hover{background:#e8ca87}
.sf-dialog{font-family:Arial,Helvetica,sans-serif;color:var(--sf-ink,#17382e);background:var(--sf-paper,#f5f3ec);border:0;max-width:520px;width:calc(100% - 32px);max-height:calc(100dvh - 32px);overflow:auto;padding:32px;margin:auto}
.sf-dialog::backdrop{background:rgba(3,17,12,.7)}
.sf-dialog.sf-menu-panel{position:fixed;inset:0 auto 0 0;margin:0;width:85vw;max-width:360px;height:100vh;height:100dvh;max-height:100vh;max-height:100dvh;padding:8px 28px 16px;border-right:1px solid #ced4c7;overscroll-behavior:contain;touch-action:pan-y;scrollbar-width:none}
.sf-dialog.sf-menu-panel::-webkit-scrollbar{display:none;width:0;height:0}
.sf-menu-panel[open]{animation:sf-menu-open 240ms cubic-bezier(.2,.7,.2,1) both}
.sf-menu-panel[open]::backdrop{animation:sf-menu-shade-in 240ms ease-out both}
.sf-menu-panel[data-closing=true]{animation:sf-menu-close 200ms ease-in both}
.sf-menu-panel[data-closing=true]::backdrop{animation:sf-menu-shade-out 200ms ease-in both}
@keyframes sf-menu-open{from{transform:translateX(-100%)}to{transform:translateX(0)}}
@keyframes sf-menu-close{from{transform:translateX(0)}to{transform:translateX(-100%)}}
@keyframes sf-menu-shade-in{from{background:rgba(3,17,12,0)}to{background:rgba(3,17,12,.7)}}
@keyframes sf-menu-shade-out{from{background:rgba(3,17,12,.7)}to{background:rgba(3,17,12,0)}}
.sf-dialog-heading{display:flex;align-items:center;justify-content:space-between;gap:24px;margin-bottom:24px}
.sf-dialog h2{font:400 28px/1.2 Georgia,serif;margin:0}
.sf-close{border:1px solid #a4b2a4;background:none;min-height:44px;min-width:44px;color:inherit;padding:8px 12px}
.sf-menu-heading{display:flex;justify-content:flex-end;margin-bottom:0}
.sf-menu-close{display:grid;place-items:center;width:44px;height:44px;padding:0;border:0;border-radius:50%;background:none;color:inherit}
.sf-menu-close:hover{background:#e4e8dd}
.sf-dialog p{font-size:15px;line-height:1.7}
.sf-menu-links{display:flex;flex-direction:column;gap:0}
.sf-menu-group{display:flex;flex-direction:column}
.sf-menu-links hr{width:100%;height:0;border:0;border-top:1px solid #d2d8cb;margin:7px 0}
.sf-menu-links a,.sf-menu-links button{display:block;border:0;padding:9px 0;font:inherit;line-height:1.4;background:none;color:inherit;text-decoration:none;text-align:left;min-height:44px}
.sf-menu-links a:hover,.sf-menu-links button:hover{color:#557d55}
.sf-menu-links a[aria-current=page]{font-weight:700}
.sf-dialog-actions{display:flex;flex-direction:column;align-items:stretch;gap:12px;margin-top:24px}
.sf-secondary{border:1px solid #809580;padding:14px 18px;min-height:48px;background:transparent;color:var(--sf-ink,#17382e);line-height:1.5}
@media(max-width:700px){.sf-dialog{padding:24px}}
@media(max-width:650px){.sf-dialog.sf-menu-panel{padding:8px 24px 16px}}
`;
