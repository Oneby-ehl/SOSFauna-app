import { Link } from "expo-router";
import { useEffect, useRef, useState } from "react";
import SiteMenu from "@/components/web/SiteMenu";
import SiteFooter from "@/components/web/SiteFooter";
import { useInformationPagePath } from "@/components/i18n/InformationPageSupport";
import { useI18n } from "@/i18n/I18nProvider";

import type { LandingPresentationProps } from "./LandingPage";
import HomeQuickLinks from "./HomeQuickLinks.web";
import BiodiversityGalleries from "./BiodiversityGalleries.web";
import WildlifeHero from "./WildlifeHero.web";
import { landingStyles } from "./landingStyles";

export default function LandingPresentation(props: LandingPresentationProps) {
  const { t, locale, languageControlsEnabled, selectLocale } = useI18n();
  const path = useInformationPagePath();

  const pending = useRef<HTMLDialogElement>(null);
  const main = useRef<HTMLElement>(null);
  const [discarding, setDiscarding] = useState(false);
  useEffect(() => {
    const dialog = pending.current;
    if (props.pendingDialogOpen && dialog && !dialog.open) dialog.showModal();
    if (!props.pendingDialogOpen && dialog?.open) dialog.close();
  }, [props.pendingDialogOpen]);

  const start = props.onStart;
  const continueCase = () => { props.onClosePending(); props.onContinue(); };
  const discard = async () => {
    if (discarding) return;
    setDiscarding(true);
    try { await props.onDiscard(); } finally { setDiscarding(false); props.onClosePending(); }
  };
  return <div className="sf-page">
    <style>{landingStyles}</style>
    <a className="sf-skip" href="#sf-main" onClick={() => main.current?.focus()}>{t("landingEditorial", "skip")}</a>
    <header className="sf-header">
      <div className="sf-brand-group">
        <SiteMenu checkingCase={props.checkingCase} onGuide={props.onStart} onContinue={props.hasPendingCase ? continueCase : undefined} />
        <Link href={path("home")} className="sf-brand">{t("common", "brandEyebrow")}</Link>
      </div>
      <div className="sf-header-help">
        <p className="sf-question">{t("landingEditorial", "question")}</p>
        <button type="button" className="sf-primary" onClick={start} disabled={props.checkingCase}
          aria-busy={props.checkingCase}>
          {t("landingEditorial", "start")}<span aria-hidden="true">↗</span>
        </button>
        {props.checkingCase ? <span className="sf-sr-only" role="status">{t("home", "checking")}</span> : null}
      </div>
      {languageControlsEnabled ? <div className="sf-languages" role="group" aria-label={t("language", "selectorLabel")}>
        <button type="button" lang="es" aria-label={t("language", "es")} aria-pressed={locale === "es"} onClick={() => selectLocale("es")}>ES</button>
        <span aria-hidden="true">|</span>
        <button type="button" lang="en" aria-label={t("language", "en")} aria-pressed={locale === "en"} onClick={() => selectLocale("en")}>EN</button>
      </div> : null}
    </header>

    <main className="sf-scroll" id="sf-main" ref={main} tabIndex={-1}>
      <WildlifeHero />
      <HomeQuickLinks />

      <section className="sf-section sf-guidance" aria-labelledby="sf-guidance-title">
        <header>
          <p className="sf-eyebrow">{t("landingEditorial", "responsibleHelpLabel")}</p>
          <h2 id="sf-guidance-title">{t("landingEditorial", "responsibleHelpTitle")}</h2>
        </header>
        <div className="sf-guidance-copy">
          <p>{t("landingEditorial", "responsibleHelpDescription")}</p>
          <p>{t("landingEditorial", "responsibleHelpObservation")}</p>
          <p>{t("landingEditorial", "responsibleHelpConclusion")}</p>
        </div>
      </section>
      <BiodiversityGalleries />

      <SiteFooter />
    </main>

    <dialog ref={pending} className="sf-dialog" aria-labelledby="sf-pending-title" aria-describedby="sf-pending-description"
      onCancel={event => { if (discarding) event.preventDefault(); else props.onClosePending(); }}>
      <h2 id="sf-pending-title">{t("home", "pendingCaseTitle")}</h2>
      <p id="sf-pending-description">{t("home", "pendingCaseNote")} {t("landingEditorial", "pendingExplanation")}</p>
      <div className="sf-dialog-actions">
        <button type="button" className="sf-primary" disabled={discarding} onClick={continueCase}>{t("navigation", "continueCase")}</button>
        <button type="button" className="sf-secondary" disabled={discarding} onClick={() => void discard()}>{t("home", "discardAndStart")}</button>
        <button type="button" className="sf-secondary" disabled={discarding} onClick={props.onClosePending}>{t("common", "cancel")}</button>
      </div>
    </dialog>
  </div>;
}
