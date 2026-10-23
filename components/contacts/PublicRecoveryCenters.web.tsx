import { getHelpContactName, getHelpContactNote } from "@/data/helpContactText";
import { useRef, useState } from "react";
import { Link } from "expo-router";
import { getHelpContactsLegalNotice, NATIONAL_HELP_CONTACTS } from "@/data/helpContacts";
import type { PublicRecoveryCentersProps } from "./PublicRecoveryCenters";
import { useI18n } from "@/i18n/I18nProvider";
import { useInformationPagePath } from "@/components/i18n/InformationPageSupport";
import { matchesProvinceHelpGroup } from "./contactSearch";

export default function PublicRecoveryCenters({ groups, normalizeSearch, nationalContactLabel, marineResourceLabel }: PublicRecoveryCentersProps) {
  const { t, locale } = useI18n();
  const pagePath = useInformationPagePath();
  const [query, setQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const normalizedQuery = normalizeSearch(query);
  const matches = (group: PublicRecoveryCentersProps["groups"][number]) => matchesProvinceHelpGroup(group, normalizedQuery, normalizeSearch, locale);
  const hasMatches = groups.some(matches);

  const contact = (item: { name: string; note: string; phone?: string; displayName?: string }, key: string, domain: "national" | "terrestrial" | "marine", typeLabel?: string) => {
    const content = <>
      <span className="centros-contact-text">
        <span className="centros-contact-name">{item.displayName ?? getHelpContactName(domain, item, locale)}</span>
        {typeLabel ? <span className="centros-contact-type">{typeLabel}</span> : null}
        <span className="centros-contact-note">{getHelpContactNote(domain, item, locale)}</span>
      </span>
      <span className={item.phone ? "centros-contact-phone" : "centros-info-label"}>{item.phone || t("centers", "info")}</span>
    </>;
    return <li key={key}>
      {item.phone ? <a className={"centros-contact-row" + (item.phone === "112" ? " centros-emergency" : "")} href={"tel:" + item.phone.replace(/\s/g, "")}>{content}</a>
        : <div className="centros-contact-row">{content}</div>}
    </li>;
  };

  return <section className="public-centros" aria-labelledby="centros-help-title">
    <style>{`
      .public-centros { padding:16px; border:1px solid #e5e7eb; border-radius:18px; background:#f8fafc; color:#111827; font-family:system-ui,"Segoe UI",Roboto,Helvetica,Arial,sans-serif; }
      .public-centros * { box-sizing:border-box; }
      .public-centros h2 { margin:0 0 10px; font-size:18px; font-weight:700; }
      .public-centros h3 { margin:16px 0 12px; font-size:15px; font-weight:700; }
      .public-centros p { margin:0 0 12px; color:#4b5563; font-size:15px; line-height:22px; }
      .public-centros ul { list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:12px; }
      .public-centros a { color:#14532d; }
      .public-centros .centros-contact-row { display:flex; align-items:center; justify-content:space-between; gap:12px; padding:12px; border:1px solid #e5e7eb; border-radius:14px; background:#fff; text-decoration:none; }
      .centros-contact-text { flex:1; min-width:0; }
      .centros-contact-name { display:block; color:#111827; font-size:15px; font-weight:700; overflow-wrap:anywhere; }
      .centros-contact-note { display:block; color:#4b5563; font-size:13px; line-height:19px; margin-top:2px; }
      .centros-contact-type { display:block; color:#1e6091; font-size:12px; font-weight:800; margin-top:2px; }
      .centros-contact-phone { color:#14532d; font-size:14px; font-weight:700; white-space:nowrap; }
      .centros-info-label { color:#64748b; font-size:12px; font-weight:800; }
      .public-centros .centros-emergency { background:#fef3c7; border-color:#f59e0b; }
      .centros-national .centros-contact-phone { border-radius:999px; background:#14532d; color:#fff; padding:8px 12px; }
      .public-centros summary { list-style:none; cursor:pointer; }
      .public-centros summary::marker { content:""; }
      .public-centros summary::-webkit-details-marker { display:none; }
      .public-centros summary::after { content:"+"; flex-shrink:0; font-size:22px; line-height:24px; font-weight:700; }
      .public-centros details[open] > summary::after { content:"−"; }
      .centros-directory > summary { display:flex; justify-content:center; align-items:center; gap:12px; padding:12px; border-radius:14px; background:#14532d; color:white; font-size:16px; font-weight:700; }
      .centros-directory-content { margin-top:16px; }
      .centros-search { display:flex; flex-direction:column; gap:6px; margin-bottom:12px; font-size:15px; }
      .centros-search input { width:100%; min-height:44px; padding:10px 48px 10px 12px; border:1px solid #d1d5db; border-radius:12px; background:white; color:#111827; font:inherit; }
      .centros-search-field { position:relative; }
      .centros-search input::-webkit-search-cancel-button { -webkit-appearance:none; appearance:none; }
      .centros-search-clear { position:absolute; top:0; right:0; width:44px; height:44px; padding:0; border:0; border-radius:12px; background:transparent; color:#14532d; font-size:24px; cursor:pointer; }
      .public-centros .centros-province > summary::after { content:none; }
      .public-centros .centros-province[open] > summary::after { content:none; }
      .centros-province-action { flex-shrink:0; font-size:14px; font-weight:700; }
      .centros-province > summary .centros-province-hide { display:none; }
      .centros-province[open] > summary .centros-province-view { display:none; }
      .centros-province[open] > summary .centros-province-hide { display:inline; }
      .centros-province { margin-top:12px; border:1px solid #e5e7eb; border-radius:14px; background:white; overflow:hidden; }
      .centros-province > summary { display:flex; align-items:center; gap:12px; padding:12px; color:#14532d; }
      .centros-province > summary h3 { margin:0; color:#111827; font-size:15px; }
      .centros-province-title { flex:1; min-width:0; }
      .centros-province-count { display:block; color:#4b5563; font-size:13px; margin-top:2px; }
      .centros-province-content { padding:12px; border-top:1px solid #e5e7eb; display:flex; flex-direction:column; gap:12px; }
      .centros-group { padding:10px; border:1px solid #d7eadb; border-radius:12px; background:#f4fbf5; }
      .centros-group.centros-marine { border-color:#d5e7f0; background:#f3f8fb; }
      .public-centros .centros-group h4 { margin:0 0 9px; color:#166534; font-size:12px; font-weight:800; text-transform:uppercase; }
      .public-centros .centros-marine h4 { color:#1e6091; }
      .public-centros .centros-group p { font-size:13px; line-height:18px; }
      .centros-sources { margin-top:12px; }
      .centros-sources > summary { display:flex; align-items:center; justify-content:center; gap:12px; padding:12px; background:#e5e7eb; border-radius:14px; font-size:16px; font-weight:600; }
      .public-centros .centros-legal { white-space:pre-line; padding:12px; margin:12px 0 0; background:#f3f4f6; border:1px solid #d1d5db; border-radius:12px; font-size:13px; }
      .public-centros .centros-no-results { padding:12px; background:#fef3c7; border:1px solid #f59e0b; border-radius:12px; color:#92400e; }
      .public-centros :is(summary,a,input,button):focus-visible { outline:2px solid #166534; outline-offset:3px; }
      .public-centros [hidden] { display:none !important; }
      @media(max-width:420px) { .public-centros .centros-contact-row { flex-wrap:wrap; } .centros-contact-text { flex-basis:65%; } }
    `}</style>
    <h2 id="centros-help-title">{t("centers", "helpTitle")}</h2>
    <p>{t("centers", "chooseServicePrefix")}<Link href={pagePath("faq")}>{t("centers", "appropriateService")}</Link>{t("centers", "chooseServiceSuffix")}</p>
    <p>{t("centers", "emergencyGuidance")}</p>
    <p>{t("centers", "marineGuidance")}</p>
    <h3>{t("centers", "immediateHelp")}</h3>
    <ul className="centros-national">{NATIONAL_HELP_CONTACTS.map((item) => contact({ ...item, displayName: nationalContactLabel(item.phone) }, item.phone, "national"))}</ul>
    <h3>{t("centers", "provinceHelp")}</h3>
    <details className="centros-directory">
      <summary>{t("centers", "openProvinceDirectory")}</summary>
      <div className="centros-directory-content">
        <p>{t("centers", "selectProvince")}</p>
        <div className="centros-search">
          <label htmlFor="centros-province-search">{t("centers", "searchProvince")}</label>
          <div className="centros-search-field">
            <input ref={searchInputRef} id="centros-province-search" type="search" placeholder={t("centers", "searchProvince")} value={query} onChange={(event) => setQuery(event.target.value)} autoComplete="off" />
            {query.length > 0 ? <button className="centros-search-clear" type="button" aria-label={t("centers", "clearSearch")} onClick={() => { setQuery(""); searchInputRef.current?.focus(); }}><span aria-hidden="true">×</span></button> : null}
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
                <h4>{t("centers", "terrestrialHeading")}</h4>
                <ul>{group.terrestrialContacts.map((item, index) => contact(item, "terrestrial-" + index, "terrestrial"))}</ul>
              </section> : null}
              {group.marineContacts.length ? <section className="centros-group centros-marine" aria-label={t("centers", "marineAriaPrefix") + group.province}>
                <h4>{t("centers", "marineHeading")}</h4>
                <p>{t("centers", "marineIntro")}</p>
                <ul>{group.marineContacts.map((item, index) => contact(item, "marine-" + index, "marine", marineResourceLabel(item.type)))}</ul>
              </section> : null}
            </div>
          </details>;
        })}
      </div>
    </details>
    <details className="centros-sources">
      <summary>{t("centers", "sourcesAndLegal")}</summary>
      <p className="centros-legal">{getHelpContactsLegalNotice(locale)}</p>
    </details>
  </section>;
}
