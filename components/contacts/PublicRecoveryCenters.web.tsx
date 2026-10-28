import { getHelpContactName, getHelpContactNote } from "@/data/helpContactText";
import { useRef, useState } from "react";
import { Link } from "expo-router";
import { getHelpContactsLegalNotice, NATIONAL_HELP_CONTACTS } from "@/data/helpContacts";
import type { PublicRecoveryCentersProps } from "./PublicRecoveryCenters";
import { useI18n } from "@/i18n/I18nProvider";
import { useInformationPagePath } from "@/components/i18n/InformationPageSupport";
import { matchesProvinceHelpGroup } from "./contactSearch";
import { GREFA_WHATSAPP } from "@/data/grefa";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const cleanHeading = (text: string) => text.replace(/^(?:🚨|🌿|🚓|👮|📍|🍃|🌊)\s*/u, "");
const contactIcons = { "112": "warning", "062": "nature-people", "092": "local-police", "091": "shield" } as const;

function DirectoryIcon({ name, light = false }: { name: typeof contactIcons[keyof typeof contactIcons] | "search" | "pets" | "waves" | "close" | "info-outline"; light?: boolean }) {
  return <span className="centros-icon" aria-hidden="true"><MaterialIcons name={name} size={18} color={light ? "#e0e8e0" : "#647b6a"} /></span>;
}

export function PublicCentersBackIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
    <path d="m12 5-7 7 7 7M5 12h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>;
}

export default function PublicRecoveryCenters({ groups, normalizeSearch, nationalContactLabel, marineResourceLabel }: PublicRecoveryCentersProps) {
  const { t, locale } = useI18n();
  const pagePath = useInformationPagePath();
  const [query, setQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const normalizedQuery = normalizeSearch(query);
  const matches = (group: PublicRecoveryCentersProps["groups"][number]) => matchesProvinceHelpGroup(group, normalizedQuery, normalizeSearch, locale);
  const hasMatches = groups.some(matches);

  const contact = (item: { name: string; note: string; phone?: string; displayName?: string }, key: string, domain: "national" | "terrestrial" | "marine", typeLabel?: string, showGrefaWhatsApp = false) => {
    const content = <>
      <span className="centros-contact-text">
        <span className="centros-contact-name">
          {domain === "national" ? <DirectoryIcon name={contactIcons[item.phone as keyof typeof contactIcons]} /> : null}
          <span>{domain === "national" ? cleanHeading(item.displayName ?? getHelpContactName(domain, item, locale)) : item.displayName ?? getHelpContactName(domain, item, locale)}</span>
        </span>
        {typeLabel ? <span className="centros-contact-type">{typeLabel}</span> : null}
        <span className="centros-contact-note">{getHelpContactNote(domain, item, locale)}</span>
      </span>
      <span className={item.phone ? "centros-contact-phone" : "centros-info-label"}>{item.phone || t("centers", "info")}</span>
    </>;
    return <li key={key}>
      {showGrefaWhatsApp && item.phone ? <div className="centros-contact-row centros-contact-with-actions">
        <a className="centros-contact-call" href={"tel:" + item.phone.replace(/\s/g, "")}>{content}</a>
        <a className="centros-whatsapp" href={`https://wa.me/${GREFA_WHATSAPP}`} target="_blank" rel="noopener noreferrer" aria-label={t("centers", "grefaWhatsAppLabel")}>
          <span aria-hidden="true"><MaterialCommunityIcons name="whatsapp" size={18} color="#14532d" /></span>
          <span>WhatsApp</span>
        </a>
      </div> : item.phone ? <a className={"centros-contact-row" + (item.phone === "112" ? " centros-emergency" : "")} href={"tel:" + item.phone.replace(/\s/g, "")}>{content}</a>
        : <div className="centros-contact-row">{content}</div>}
    </li>;
  };

  return <section className="public-centros" aria-labelledby="centros-help-title">
    <style>{`
      [data-centros-page="true"] { background:#f5f3ec!important; }
      [data-centros-page="true"] [data-centros-content="true"] { width:100%!important; max-width:1040px!important; align-self:center!important; padding:32px 32px 48px!important; gap:20px!important; }
      [data-centros-header="true"] { gap:8px!important; }
      [data-centros-header="true"] > div:first-child { font:500 11px/1.5 Arial,Helvetica,sans-serif!important; letter-spacing:1.4px; color:#647b6a!important; }
      [data-centros-header="true"] [role="heading"][aria-level="1"] { font:400 clamp(28px,3.6vw,38px)/1.2 Georgia,'Times New Roman',serif!important; letter-spacing:-.4px; color:#102c25!important; overflow-wrap:anywhere; }
      [data-centros-intro="true"] { font:400 15px/1.65 Arial,Helvetica,sans-serif!important; color:#495e51!important; }
      [data-centros-back="true"] { display:flex; flex-direction:row!important; align-items:center; gap:8px; min-height:44px; padding:8px 14px!important; border:1px solid #b7c7b8!important; border-radius:8px!important; background:#fffefa!important; color:#294b3c; }
      [data-centros-back="true"] > div { font:500 15px/1.45 Arial,Helvetica,sans-serif!important; color:#294b3c!important; }
      [data-centros-back="true"] > svg { flex-shrink:0; }
      [data-centros-back="true"]:hover { background:#edf1e8!important; }
      [data-centros-back="true"]:focus-visible { outline:3px solid #d9b96f; outline-offset:3px; }
      .public-centros { min-width:0; padding:0; border:0; background:transparent; color:#17382e; font:400 15px/1.6 Arial,Helvetica,sans-serif; }
      .public-centros * { box-sizing:border-box; }
      .public-centros h2 { margin:0 0 10px; font-size:18px; line-height:1.4; font-weight:500; color:#102c25; }
      .public-centros h3 { margin:22px 0 10px; font-size:17px; line-height:1.4; font-weight:500; color:#294b3c; }
      .public-centros p { margin:0 0 10px; color:#495e51; font-size:15px; line-height:1.6; }
      .public-centros ul { list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:8px; }
      .public-centros li { min-width:0; }
      .public-centros a { color:#102c25; text-underline-offset:3px; }
      .public-centros .centros-contact-row { display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:8px 12px; min-height:44px; padding:10px 12px; border:1px solid #e2e5dd; border-radius:10px; background:#fffefa; text-decoration:none; }
      .public-centros a.centros-contact-row:hover { border-color:#bcccb7; }
      .public-centros .centros-contact-call { display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; flex:1 1 260px; min-width:0; gap:8px 12px; text-decoration:none; }
      .public-centros .centros-whatsapp { display:inline-flex; align-items:center; justify-content:center; flex-shrink:0; gap:6px; min-height:44px; padding:8px 10px; border:1px solid #d4ddce; border-radius:10px; background:#fffefa; color:#14532d; font-size:13px; font-weight:500; text-decoration:none; }
      .public-centros .centros-whatsapp > span:first-child { display:inline-flex; align-items:center; }
      .public-centros .centros-whatsapp:hover { background:#edf1e8; }
      .public-centros .centros-contact-text { flex:1 1 180px; min-width:0; }
      .public-centros .centros-contact-name { display:flex; align-items:center; gap:8px; color:#17382e; font-size:15px; line-height:1.45; font-weight:500; }
      .public-centros .centros-contact-name > span:last-child { min-width:0; overflow-wrap:anywhere; }
      .public-centros .centros-icon { display:inline-flex; align-items:center; justify-content:center; flex-shrink:0; vertical-align:middle; line-height:1; }
      .public-centros .centros-contact-note { display:block; color:#52695b; font-size:13px; line-height:1.5; margin-top:3px; overflow-wrap:anywhere; }
      .public-centros .centros-contact-type { display:block; color:#647b6a; font-size:12px; font-weight:400; margin-top:3px; }
      .public-centros .centros-contact-phone { flex-shrink:0; max-width:100%; color:#102c25; font-size:15px; font-weight:500; white-space:normal; overflow-wrap:anywhere; }
      .public-centros .centros-info-label { color:#647b6a; font-size:12px; font-weight:400; }
      .public-centros .centros-emergency { background:#d9b96f26; border-color:#d9b96f; }
      .public-centros .centros-national .centros-contact-phone { border-radius:8px; background:#edf1e8; color:#102c25; padding:6px 10px; }
      .public-centros .centros-national .centros-emergency .centros-contact-phone { background:#d9b96f; }
      .public-centros summary { list-style:none; cursor:pointer; }
      .public-centros summary::marker { content:""; }
      .public-centros summary::-webkit-details-marker { display:none; }
      .public-centros summary::after { content:"+"; flex-shrink:0; font-size:20px; line-height:24px; font-weight:400; }
      .public-centros details[open] > summary::after { content:"−"; }
      .public-centros .centros-directory > summary,.public-centros .centros-sources > summary { display:flex; width:100%; align-items:center; gap:10px; min-height:44px; padding:10px 12px; border:1px solid #e2e5dd; border-radius:10px; background:#fffefa; color:#17382e; font-size:15px; font-weight:500; line-height:1.45; }
      .public-centros :is(.centros-directory,.centros-sources) > summary > span:not(.centros-icon) { flex:1; min-width:0; }
      .public-centros .centros-directory-content { margin-top:16px; }
      .public-centros .centros-search { display:flex; flex-direction:column; gap:6px; margin-bottom:12px; font-size:15px; }
      .public-centros .centros-search input { width:100%; min-width:0; min-height:44px; padding:10px 48px 10px 12px; border:1px solid #d4ddce; border-radius:10px; background:#fffefa; color:#17382e; font:inherit; }
      .public-centros .centros-search-field { position:relative; }
      .public-centros .centros-search input::-webkit-search-cancel-button { -webkit-appearance:none; appearance:none; }
      .public-centros .centros-search-clear { display:grid; place-items:center; position:absolute; top:0; right:0; width:44px; height:44px; padding:0; border:0; border-radius:10px; background:transparent; cursor:pointer; }
      .public-centros .centros-province > summary::after,.public-centros .centros-province[open] > summary::after { content:none; }
      .public-centros .centros-province-action { flex-shrink:0; font-size:13px; font-weight:500; }
      .public-centros .centros-province > summary .centros-province-hide { display:none; }
      .public-centros .centros-province[open] > summary .centros-province-view { display:none; }
      .public-centros .centros-province[open] > summary .centros-province-hide { display:inline; }
      .public-centros .centros-province { margin-top:10px; border:1px solid #e2e5dd; border-radius:12px; background:#fffefa; }
      .public-centros .centros-province > summary { display:flex; align-items:center; gap:12px; min-height:44px; padding:10px 12px; color:#294b3c; }
      .public-centros .centros-province > summary h3 { margin:0; color:#17382e; font-size:15px; font-weight:500; }
      .public-centros .centros-province-title { flex:1; min-width:0; overflow-wrap:anywhere; }
      .public-centros .centros-province-count { display:block; color:#52695b; font-size:13px; font-weight:400; margin-top:2px; }
      .public-centros .centros-province-content { padding:10px; border-top:1px solid #e2e5dd; display:flex; flex-direction:column; gap:12px; }
      .public-centros .centros-group { min-width:0; padding:10px; border:1px solid #e2e5dd; border-radius:10px; background:#f5f6f1; }
      .public-centros .centros-group h4 { display:flex; align-items:center; gap:8px; margin:0 0 10px; color:#52695b; font-size:12px; font-weight:500; letter-spacing:.5px; text-transform:uppercase; }
      .public-centros .centros-group p { font-size:13px; line-height:1.5; }
      .public-centros .centros-sources { margin-top:20px; }
      .public-centros .centros-legal { white-space:pre-line; overflow-wrap:anywhere; padding:14px; margin:12px 0 0; background:#f5f3ec; border:1px solid #e2e5dd; border-radius:10px; font-size:15px; line-height:1.65; }
      .public-centros .centros-no-results { padding:12px; background:#d9b96f26; border:1px solid #d9b96f; border-radius:10px; color:#685320; }
      .public-centros :is(summary,a,input,button):focus-visible { outline:3px solid #d9b96f; outline-offset:3px; }
      .public-centros [hidden] { display:none!important; }
      @media(max-width:600px) {
        [data-centros-page="true"] [data-centros-content="true"] { padding:24px 16px 40px!important; }
        .public-centros .centros-directory > summary { width:100%; }
      }
`}</style>
    <h2 id="centros-help-title">{t("centers", "helpTitle")}</h2>
    <p>{t("centers", "chooseServicePrefix")}<Link href={pagePath("faq")}>{t("centers", "appropriateService")}</Link>{t("centers", "chooseServiceSuffix")}</p>
    <p>{t("centers", "emergencyGuidance")}</p>
    <p>{t("centers", "marineGuidance")}</p>
    <h3>{t("centers", "immediateHelp")}</h3>
    <ul className="centros-national">{NATIONAL_HELP_CONTACTS.map((item) => contact({ ...item, displayName: nationalContactLabel(item.phone) }, item.phone, "national"))}</ul>
    <h3>{t("centers", "provinceHelp")}</h3>
    <details className="centros-directory">
      <summary><DirectoryIcon name="search" /><span>{cleanHeading(t("centers", "openProvinceDirectory"))}</span></summary>
      <div className="centros-directory-content">
        <p>{t("centers", "selectProvince")}</p>
        <div className="centros-search">
          <label htmlFor="centros-province-search">{t("centers", "searchProvince")}</label>
          <div className="centros-search-field">
            <input ref={searchInputRef} id="centros-province-search" type="search" placeholder={t("centers", "searchProvince")} value={query} onChange={(event) => setQuery(event.target.value)} autoComplete="off" />
            {query.length > 0 ? <button className="centros-search-clear" type="button" aria-label={t("centers", "clearSearch")} onClick={() => { setQuery(""); searchInputRef.current?.focus(); }}><DirectoryIcon name="close" /></button> : null}
          </div>
        </div>
        <noscript><p>{t("centers", "noScriptHelp")}</p></noscript>
        <p className="centros-no-results" role="status" hidden={hasMatches}>{t("centers", "noResults")}</p>
        {groups.map((group) => {
          const count = group.terrestrialContacts.length + group.marineContacts.filter((item) => Boolean(item.phone)).length;
          return <details className="centros-province" key={group.province} data-province={group.province} hidden={!matches(group)}>
            <summary><h3 className="centros-province-title">{group.province}<span className="centros-province-count">{count}{t("centers", "contactCountNoun")}{count === 1 ? "" : t("centers", "pluralSuffix")}{t("centers", "contactCountAdjective")}{count === 1 ? "" : t("centers", "adjectivePluralSuffix")}</span></h3><span className="centros-province-action centros-province-view" aria-hidden="true">{t("centers", "show")}</span><span className="centros-province-action centros-province-hide" aria-hidden="true">{t("centers", "hide")}</span></summary>
            <div className="centros-province-content">
              <p>{t("centers", "provinceContactsIntro")}</p>
              {group.terrestrialContacts.length ? <section className="centros-group" aria-label={t("centers", "terrestrialAriaPrefix") + group.province}>
                <h4><DirectoryIcon name="pets" /><span>{cleanHeading(t("centers", "terrestrialHeading"))}</span></h4>
                <ul>{group.terrestrialContacts.map((item, index) => contact(item, "terrestrial-" + index, "terrestrial", undefined, group.province === "Madrid" && item.name === "GREFA central"))}</ul>
              </section> : null}
              {group.marineContacts.length ? <section className="centros-group centros-marine" aria-label={t("centers", "marineAriaPrefix") + group.province}>
                <h4><DirectoryIcon name="waves" /><span>{cleanHeading(t("centers", "marineHeading"))}</span></h4>
                <p>{t("centers", "marineIntro")}</p>
                <ul>{group.marineContacts.map((item, index) => contact(item, "marine-" + index, "marine", marineResourceLabel(item.type)))}</ul>
              </section> : null}
            </div>
          </details>;
        })}
      </div>
    </details>
    <details className="centros-sources">
      <summary><DirectoryIcon name="info-outline" /><span>{t("centers", "sourcesAndLegal")}</span></summary>
      <p className="centros-legal">{getHelpContactsLegalNotice(locale)}</p>
    </details>
  </section>;
}
