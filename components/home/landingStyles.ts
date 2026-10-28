// Scoped to the web presentation; no global body rules or native styles.
export const landingStyles = `
.sf-page{--sf-forest:#102c25;--sf-paper:#f5f3ec;--sf-ink:#17382e;box-sizing:border-box;display:flex;flex-direction:column;height:100vh;height:100dvh;overflow:hidden;background:var(--sf-paper);color:var(--sf-ink);font-family:Arial,Helvetica,sans-serif}
.sf-page *{box-sizing:border-box}
.sf-page button,.sf-page a{-webkit-tap-highlight-color:transparent}
.sf-page button{font:inherit;cursor:pointer}
.sf-page button:disabled{cursor:wait;opacity:.7}
.sf-page a{color:inherit}
.sf-page :focus-visible{outline:3px solid #d9b96f;outline-offset:5px}
.sf-sr-only{position:absolute!important;width:1px;height:1px;padding:0;overflow:hidden;clip-path:inset(50%);white-space:nowrap;border:0}
.sf-skip{position:absolute;top:8px;left:16px;z-index:20;padding:12px;background:var(--sf-paper);transform:translateY(-180%)}
.sf-skip:focus{transform:translateY(0)}
.sf-header{flex-shrink:0;position:relative;z-index:5;display:grid;grid-template-columns:minmax(235px,1fr) minmax(0,2fr) minmax(100px,1fr);align-items:center;gap:24px;padding:20px clamp(20px,3vw,56px);background:var(--sf-forest);color:#fff;border-bottom:1px solid #ffffff20}
.sf-brand-group{display:flex;align-items:center;gap:20px;min-width:0}
.sf-brand{font-size:14px;font-weight:700;letter-spacing:1.7px;text-decoration:none;line-height:1.5}
.sf-header-help{display:flex;align-items:center;justify-content:center;gap:18px;min-width:0}
.sf-question{font-size:17.5px;line-height:1.5;min-width:0;max-width:none;margin:0;color:#fff}
.sf-header-help > .sf-primary{flex-shrink:0;border-radius:999px;animation:sf-guide-heartbeat 5s ease-in-out infinite;transform-origin:center}
.sf-header-help > .sf-primary:hover,.sf-header-help > .sf-primary:focus-visible,.sf-header-help > .sf-primary:disabled{animation:none}
@keyframes sf-guide-heartbeat{0%,18%,34%,100%{transform:scale(1)}9%,26%{transform:scale(1.02)}}
.sf-languages{justify-self:end;display:flex;align-items:center;gap:2px;font-size:13px;color:#c2d0c7}
.sf-languages button{border:0;background:none;color:inherit;min-width:44px;min-height:44px;padding:8px;font-size:13px}
.sf-languages button[aria-pressed=true]{font-weight:700;color:#fff;text-decoration:underline;text-underline-offset:6px}
.sf-scroll{flex:1;min-height:0;overflow-y:auto;overflow-x:hidden;overscroll-behavior-y:contain;scrollbar-gutter:stable}
.sf-page[data-menu-open=true] .sf-scroll{overflow:hidden;touch-action:none}
.sf-hero{height:100%;min-height:0;position:relative;isolation:isolate;display:flex;flex-direction:column;justify-content:flex-end;overflow:hidden;background:radial-gradient(ellipse at 75% 25%,#3a594a 0%,#223d32 42%,#112b25 100%);color:#fff}
.sf-hero-images,.sf-hero-shade{position:absolute;inset:0;z-index:-1}
.sf-hero-images img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:var(--sf-photo-position,50% center);opacity:0;transition:opacity 1s ease-in-out}
.sf-hero-images img.is-active{opacity:1}
@media(max-width:900px){.sf-hero-images img{object-position:var(--sf-photo-mobile-position,65% center)}}
.sf-hero-shade{background:linear-gradient(90deg,rgba(5,21,16,.65),transparent 80%),linear-gradient(0deg,rgba(5,21,16,.72),transparent 72%)}
.sf-hero-copy{padding:clamp(24px,6vw,100px) clamp(24px,6vw,100px) 28px;max-width:1060px}
.sf-eyebrow{font-size:11px;font-weight:700;letter-spacing:2.2px;line-height:1.6;text-transform:uppercase;margin:0 0 20px}
.sf-hero h2{font-family:Georgia,'Times New Roman',serif;font-size:clamp(38px,5.5vw,84px);font-weight:400;line-height:1.06;letter-spacing:-1.5px;margin:0 0 26px;max-width:850px;text-wrap:balance}
.sf-hero-subtitle{font-size:clamp(15px,1.3vw,19px);line-height:1.7;max-width:615px;margin:0;color:#f2f2e9;text-wrap:pretty}
.sf-hero-bottom{display:flex;align-items:center;justify-content:space-between;gap:20px;padding:0 clamp(24px,6vw,100px) 26px}
.sf-photo-credit{font-size:10px;letter-spacing:.5px;line-height:1.6;color:#d9e1d8;margin:0;max-width:75%}
.sf-section{max-width:1400px;width:100%;margin:0 auto;padding:clamp(56px,7vw,104px) clamp(24px,6vw,100px)}
.sf-section-heading{display:grid;grid-template-columns:1.3fr 1fr;align-items:end;gap:48px;margin-bottom:42px}
.sf-section h2{font:400 clamp(32px,3.5vw,51px)/1.15 Georgia,'Times New Roman',serif;margin:0;text-wrap:balance}
.sf-section-intro{font-size:15px;line-height:1.8;color:#536358;max-width:430px;margin:0}
.sf-access-section{background:var(--sf-paper);padding-top:clamp(32px,4vw,56px);padding-bottom:clamp(28px,3vw,40px)}
.sf-access-section > h2{max-width:none;margin-bottom:36px;text-wrap:wrap}
.sf-access-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:24px}
.sf-page .sf-access-card{position:relative;isolation:isolate;overflow:hidden;display:flex;flex-direction:column;justify-content:flex-end;min-width:0;min-height:180px;aspect-ratio:16/10;padding:24px;text-decoration:none;color:#fff;background:var(--sf-forest);border:0;border-radius:24px 8px 24px 8px}
.sf-access-photo{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:var(--sf-access-position,60% center);transition:transform 300ms ease-out;pointer-events:none}
.sf-access-card:after{content:'';position:absolute;inset:0;background:linear-gradient(0deg,rgba(5,21,16,.8),rgba(5,21,16,.46) 28%,rgba(5,21,16,.16) 48%,transparent 65%);pointer-events:none}
.sf-access-caption{position:relative;z-index:1;display:flex;align-items:flex-end;justify-content:space-between;gap:16px}
.sf-access-copy{flex:1;min-width:0;text-shadow:0 1px 3px rgba(5,21,16,.65)}
.sf-access-arrow{display:grid;place-items:center;flex-shrink:0;width:40px;height:40px;border-radius:50%;background:#d9b96f;color:var(--sf-forest);font-size:26px;line-height:1}
.sf-access-card h3{min-width:0;font:400 clamp(21px,2vw,27px)/1.2 Georgia,'Times New Roman',serif;margin:0;text-wrap:balance;overflow-wrap:break-word}
.sf-access-copy p{margin:8px 0 0;color:#fff;font-size:13px;line-height:1.5;text-wrap:pretty;overflow-wrap:break-word}
.sf-page .sf-access-card:focus-visible{outline:3px solid #315f48;outline-offset:5px}
@media(hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference){.sf-access-card:hover .sf-access-photo{transform:scale(1.025)}}
.sf-stories{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:24px}
.sf-story{min-width:0;border-top:1px solid #c6cec1;padding-top:16px}
.sf-story-cover{aspect-ratio:4/3;display:flex;align-items:flex-end;padding:20px;background:#d8dfd0;color:#4b6654;margin-bottom:24px}
.sf-story-cover-2{background:#e4dfcf;color:#6b6657}.sf-story-cover-3{background:#cbd9d4;color:#42645c}.sf-story-cover-4{background:#ccd9df;color:#3b5b69}
.sf-story-cover span{font:400 54px/1 Georgia,serif;opacity:.45}
.sf-story .sf-eyebrow{font-size:10px;letter-spacing:1.6px;margin-bottom:12px}
.sf-story h3{font:400 24px/1.25 Georgia,serif;margin:0 0 18px}
.sf-story-status{font-size:11px;color:#677364;letter-spacing:.5px;margin:0}
.sf-guidance{border-top:1px solid #ced4c7;border-bottom:1px solid #ced4c7;padding-top:40px;padding-bottom:40px;display:grid;grid-template-columns:minmax(0,1fr);gap:24px;align-items:start;text-align:left}
.sf-access-section + .sf-guidance{padding-top:clamp(28px,3vw,40px)}
.sf-guidance h2{font-size:clamp(32px,3.8vw,54px);line-height:1.1}
.sf-guidance .sf-eyebrow{font-size:11px;line-height:1.5;margin:0 0 12px;color:#426351}
.sf-guidance-copy{min-width:0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px 40px}
.sf-guidance-copy p{min-width:0;font-size:16px;line-height:1.75;margin:0;color:#536358;text-wrap:pretty;overflow-wrap:break-word}
@media(max-width:900px){.sf-guidance-copy{grid-template-columns:minmax(0,1fr)}}
.sf-scope{padding-top:52px;padding-bottom:52px;display:grid;grid-template-columns:minmax(0,.8fr) minmax(0,1.6fr);gap:48px;align-items:start}
.sf-page .sf-scope + .sf-site-footer{margin-top:0}
.sf-scope p{font-size:15px;line-height:1.8;color:#536358}
.sf-biodiversity-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:28px 24px;min-width:0}
.sf-biodiversity-gallery{margin:0;min-width:0}
.sf-biodiversity-gallery h3{font:400 clamp(20px,1.8vw,25px)/1.25 Georgia,'Times New Roman',serif;margin:0 0 12px;overflow-wrap:break-word}
.sf-biodiversity-frame{position:relative;isolation:isolate;overflow:hidden;aspect-ratio:21/10;border-radius:36px 10px 36px 10px;background:#dce3d6}
.sf-biodiversity-frame img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity 600ms ease-in-out}
.sf-biodiversity-frame img.is-active{opacity:1}
@media(max-width:1050px){.sf-page .sf-scope{grid-template-columns:1fr;gap:32px}.sf-scope > div:first-child{max-width:720px}}
@media(max-width:600px){.sf-biodiversity-grid{grid-template-columns:1fr;gap:28px}.sf-biodiversity-frame{aspect-ratio:21/10;border-radius:32px 8px 32px 8px}}
.sf-footer{background:var(--sf-forest);color:#e0e8e0;padding:52px clamp(24px,6vw,100px) 24px}
.sf-footer-main{max-width:1200px;margin:auto;display:grid;grid-template-columns:1.5fr 1fr;gap:64px}
.sf-footer-brand{letter-spacing:2px;font-size:14px;color:#fff;text-decoration:none;font-weight:700}
.sf-footer p{font-size:13px;line-height:1.8;max-width:600px}
.sf-independence{color:#bccbbf}
.sf-footer-links{display:grid;grid-template-columns:1fr 1fr;gap:18px;align-content:start;font-size:13px}
.sf-footer-links a{text-decoration:none}
.sf-footer-links a:hover{text-decoration:underline}
.sf-footer button:not(.sf-primary){background:none;border:0;padding:0;color:inherit;text-align:left;font-size:13px;line-height:1.6}
.sf-play-badge{display:inline-block;margin-top:12px;font-size:13px}
.sf-play-badge img{display:block;width:155px;height:60px;object-fit:contain}
.sf-version{padding-top:32px;max-width:1200px;margin:24px auto 0;border-top:1px solid #ffffff25}
@media(min-width:1101px){.sf-header{grid-template-columns:minmax(235px,1fr) minmax(0,max-content) minmax(100px,1fr)}.sf-header-help{gap:24px}.sf-header-help > .sf-primary{font-size:16px!important;font-weight:600!important;padding-inline:22px}}
@media(max-width:1000px){.sf-access-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:650px){.sf-access-grid{grid-template-columns:1fr;gap:18px}.sf-page .sf-access-card{aspect-ratio:16/9;padding:22px}}
@media(max-width:1100px){.sf-header{grid-template-columns:minmax(200px,1fr) minmax(0,1.5fr) 100px;gap:20px;padding:16px 24px}.sf-header-help{flex-direction:column;gap:8px}.sf-question{max-width:none;text-align:center;font-size:14px}.sf-primary{padding:10px 16px}.sf-stories{grid-template-columns:repeat(2,minmax(0,1fr));gap:36px 24px}}
@media(max-width:700px){.sf-header{grid-template-columns:1fr auto;padding:10px 16px 14px;gap:8px 12px}.sf-brand-group{gap:12px}.sf-brand{font-size:12px;letter-spacing:1px}.sf-header-help{grid-row:2;grid-column:1/-1;gap:8px}.sf-header-help .sf-primary{width:100%;min-height:44px}.sf-languages{grid-column:2;grid-row:1}.sf-languages button{min-width:36px}.sf-hero-copy{padding:24px 24px 20px}.sf-hero h2{font-size:clamp(34px,8.5vw,55px);line-height:1.1;letter-spacing:-.8px;margin-bottom:18px}.sf-hero .sf-eyebrow{font-size:9px;margin-bottom:16px}.sf-hero-subtitle{font-size:14px;line-height:1.65}.sf-hero-bottom{padding:0 24px 20px;gap:12px;align-items:flex-end}.sf-photo-credit{max-width:65%;font-size:9px}.sf-section-heading,.sf-guidance,.sf-scope{grid-template-columns:1fr;gap:24px}.sf-section-heading{margin-bottom:32px}.sf-section-intro{max-width:none}.sf-stories{gap:32px 18px}.sf-story-cover{padding:14px;margin-bottom:18px}.sf-story-cover span{font-size:40px}.sf-story h3{font-size:21px}.sf-story .sf-eyebrow{font-size:9px;letter-spacing:1px}.sf-footer-main{grid-template-columns:1fr;gap:32px}.sf-dialog{padding:24px}}
@media(max-width:370px){.sf-stories{grid-template-columns:1fr}.sf-brand{max-width:115px}.sf-header{padding-inline:12px}.sf-languages button{min-width:32px}.sf-hero-copy{padding-inline:20px}.sf-hero-bottom{padding-inline:20px}}
@media(max-height:600px){.sf-hero-copy{padding-top:16px;padding-bottom:16px}.sf-hero h2{font-size:clamp(28px,5vw,52px);margin-bottom:14px}.sf-hero .sf-eyebrow{display:none}.sf-hero-subtitle{font-size:13px;line-height:1.5}.sf-hero-bottom{padding-bottom:14px}}
@media(max-height:420px) and (min-width:701px){.sf-header{padding-block:8px}.sf-header-help{flex-direction:row}.sf-question{max-width:none}.sf-hero-copy{max-width:850px}.sf-hero h2{font-size:32px}.sf-hero-subtitle{max-width:700px}}
@media(prefers-reduced-motion:reduce){.sf-page *{scroll-behavior:auto!important;transition:none!important;animation:none!important}}
@media(prefers-reduced-motion:reduce){.sf-menu-panel::backdrop{animation:none!important}}
`;
