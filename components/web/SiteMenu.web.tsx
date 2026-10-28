import { usePathname } from "expo-router";
import { useEffect, useId, useRef, useState } from "react";
import { useInformationPagePath } from "@/components/i18n/InformationPageSupport";
import { LanguageSelector } from "@/components/i18n/LanguageSelector";
import { useI18n } from "@/i18n/I18nProvider";
import { matchLocalizedRoute } from "@/i18n/routes";
import { shareSosFaunaApp } from "@/utils/rescueShareMessage";
import { recoverCurrentCase } from "@/services/rescueCaseService";
import { SiteLink, useWebNavigation } from "./WebNavigation";
import type { SiteMenuProps } from "./SiteMenu";

export default function SiteMenu({ onGuide, onContinue, checkingCase = false }: SiteMenuProps) {
  const { t, locale } = useI18n();
  const path = useInformationPagePath();
  const pathname = usePathname();
  const { navigate } = useWebNavigation();
  const id = useId();
  const menu = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [hasPendingCase, setHasPendingCase] = useState(false);
  useEffect(() => {
    if (!open || onGuide) return;
    let cancelled = false;
    setHasPendingCase(false);
    void recoverCurrentCase().then(report => {
      if (!cancelled) setHasPendingCase(Boolean(report));
    }).catch(() => { if (!cancelled) setHasPendingCase(false); });
    return () => { cancelled = true; };
  }, [open, onGuide]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const backdropPointerDown = useRef(false);
  useEffect(() => () => { if (timer.current !== null) clearTimeout(timer.current); }, []);
  const finishClose = () => {
    if (timer.current !== null) clearTimeout(timer.current);
    timer.current = null;
    menu.current?.close();
    setOpen(false);
    setClosing(false);
  };
  const close = (immediate = false) => {
    if (immediate || !menu.current?.open || window.matchMedia("(prefers-reduced-motion: reduce)").matches) { finishClose(); return; }
    if (closing) return;
    setClosing(true);
    timer.current = setTimeout(finishClose, 240);
  };
  const isOutside = (x: number, y: number) => {
    const bounds = menu.current?.getBoundingClientRect();
    return Boolean(bounds && (x < bounds.left || x > bounds.right || y < bounds.top || y > bounds.bottom));
  };
  const helpLinks = [
    { id: "faq", label: t("navigation", "faq") },
    { id: "centers", label: t("landingEditorial", "centers") },
  ] as const;
  const projectLinks = [
    { id: "about", label: t("landingEditorial", "about") },
    { id: "contact", label: t("navigation", "contact") },
    { id: "privacy", label: t("navigation", "privacy") },
    { id: "legal", label: t("navigation", "legal") },
    { id: "sources", label: t("landingEditorial", "sources") },
  ] as const;
  const route = matchLocalizedRoute(pathname);
  return <>
    <button type="button" className="sf-menu-trigger" aria-label={t("landingEditorial", "menu")}
      aria-haspopup="dialog" aria-expanded={open} aria-controls={id}
      onClick={() => { setClosing(false); menu.current?.showModal(); setOpen(true); }}>
      <span className="sf-menu-icon" aria-hidden="true" />
    </button>
    <dialog ref={menu} id={id} className="sf-dialog sf-menu-panel" aria-label={t("landingEditorial", "menu")} data-closing={closing}
      onCancel={event => { event.preventDefault(); close(); }} onClose={finishClose}
      onAnimationEnd={event => { if (event.target === event.currentTarget && event.animationName === "sf-menu-close") finishClose(); }}
      onPointerDown={event => { backdropPointerDown.current = event.target === event.currentTarget && isOutside(event.clientX, event.clientY); }}
      onClick={event => {
        if (backdropPointerDown.current && event.target === event.currentTarget && isOutside(event.clientX, event.clientY)) close();
        backdropPointerDown.current = false;
      }}>
      <div className="sf-menu-heading">
        <button type="button" className="sf-menu-close" aria-label={t("landingEditorial", "close")} onClick={() => close()}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false"><path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
        </button></div>
      <nav className="sf-menu-links" aria-label={t("landingEditorial", "navigation")}>
        <div className="sf-menu-group">
        <SiteLink href={path("home")} aria-current={route === "home" ? "page" : undefined} onNavigate={() => close(true)}>{t("landingEditorial", "home")}</SiteLink>
        <button type="button" disabled={checkingCase} aria-current={route === "guide" ? "page" : undefined} onClick={() => {
          close(true);
          if (onGuide) onGuide();
          else if (route !== "guide") {
            // Reuse the route's recovery path instead of silently starting over.
            // With no stored report it already returns to the home/start screen.
            void navigate({ pathname: path("guide"), params: { mode: "continue" } });
          }
        }}>{t("navigation", "guide")}</button>
        {onContinue || hasPendingCase ? <button type="button" onClick={() => {
          close(true);
          if (onContinue) onContinue();
          else if (route !== "guide") void navigate({ pathname: path("guide"), params: { mode: "continue" } });
        }}>{t("navigation", "continueCase")}</button> : null}
        <SiteLink href={path("history")} aria-current={route === "history" ? "page" : undefined} onNavigate={() => close(true)}>{t("landingEditorial", "history")}</SiteLink>
        </div>
        <hr />
        <div className="sf-menu-group">{helpLinks.map(link => <SiteLink key={link.id} href={path(link.id)} aria-current={route === link.id ? "page" : undefined} onNavigate={() => close(true)}>{link.label}</SiteLink>)}</div>
        <hr />
        <div className="sf-menu-group">
        <button type="button" onClick={() => { close(true); void shareSosFaunaApp(locale); }}>{t("navigation", "shareApp")}</button>
        <hr />
        {projectLinks.map(link => <SiteLink key={link.id} href={path(link.id)} aria-current={route === link.id ? "page" : undefined} onNavigate={() => close(true)}>{link.label}</SiteLink>)}
        </div>
      </nav>
    </dialog>
  </>;
}

export function SiteHeader() {
  const { t } = useI18n();
  const path = useInformationPagePath();
  const pathname = usePathname();
  return <header className="sf-site-header">
    <div className="sf-site-brand-group"><SiteMenu /><SiteLink href={path("home")} className="sf-site-brand">{t("common", "brandEyebrow")}</SiteLink></div>
    <div className="sf-site-languages"><LanguageSelector url={pathname} /></div>
  </header>;
}
