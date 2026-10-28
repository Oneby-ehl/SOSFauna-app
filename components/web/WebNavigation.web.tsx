import { Link, usePathname, useRouter, type Href } from "expo-router";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ComponentProps, type PropsWithChildren } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { matchLocalizedRoute } from "@/i18n/routes";
import { siteChromeStyles } from "./siteChromeStyles";

type LeaveGuard = () => Promise<boolean>;
type ExitRequest = { save: () => Promise<boolean>; resolve: (leave: boolean) => void };
const NavigationContext = createContext<{
  registerLeaveGuard: (guard: LeaveGuard) => () => void;
  requestExit: (save: () => Promise<boolean>) => Promise<boolean>;
  navigate: (href: Href) => Promise<void>;
} | null>(null);

export function WebNavigationProvider({ children }: PropsWithChildren) {
  const { t } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const pathnameRef = useRef(pathname);
  pathnameRef.current = pathname;
  const leaveGuard = useRef<LeaveGuard | null>(null);
  const navigating = useRef(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const cancelButton = useRef<HTMLButtonElement>(null);
  const requestRef = useRef<ExitRequest | null>(null);
  const [exitRequest, setExitRequest] = useState<ExitRequest | null>(null);
  const [saving, setSaving] = useState(false);
  const savingRef = useRef(false);

  const registerLeaveGuard = useCallback((guard: LeaveGuard) => {
    leaveGuard.current = guard;
    return () => { if (leaveGuard.current === guard) leaveGuard.current = null; };
  }, []);
  const requestExit = useCallback((save: () => Promise<boolean>) => {
    // One pending decision at a time; a second navigation cannot replace it.
    if (requestRef.current) return Promise.resolve(false);
    return new Promise<boolean>(resolve => {
      const request = { save, resolve };
      requestRef.current = request;
      setExitRequest(request);
    });
  }, []);
  const finishDecision = (leave: boolean) => {
    const request = requestRef.current;
    requestRef.current = null;
    dialog.current?.close();
    setExitRequest(null);
    setSaving(false);
    savingRef.current = false;
    request?.resolve(leave);
  };
  const saveAndLeave = async () => {
    const request = requestRef.current;
    if (!request || savingRef.current) return;
    savingRef.current = true;
    setSaving(true);
    try {
      if (await request.save()) finishDecision(true);
      // Existing save code reports errors; failure keeps the guide and dialog.
    } catch {
      // A failed save must never resolve the navigation as approved.
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  };
  useEffect(() => {
    if (exitRequest && dialog.current && !dialog.current.open) {
      dialog.current.showModal();
      cancelButton.current?.focus({ preventScroll: true });
    }
  }, [exitRequest]);
  useEffect(() => () => { requestRef.current?.resolve(false); }, []);

  const navigate = useCallback(async (href: Href) => {
    if (navigating.current) return;
    const inGuide = matchLocalizedRoute(pathnameRef.current) === "guide";
    // The guide menu entry must not restart the mounted report.
    if (inGuide && typeof href === "string" && matchLocalizedRoute(href) === "guide") return;
    navigating.current = true;
    try {
      if (inGuide && leaveGuard.current && !(await leaveGuard.current())) return;
      // As with the existing exit flow, replace the guide after saving so its
      // browser-back listener is unmounted rather than retained under a page.
      if (inGuide) router.replace(href);
      else router.push(href);
    } finally { navigating.current = false; }
  }, [router]);

  return <NavigationContext.Provider value={{ registerLeaveGuard, requestExit, navigate }}>
    <style>{siteChromeStyles}</style>
    {children}
    <dialog ref={dialog} className="sf-dialog sf-exit-dialog" aria-labelledby="sf-exit-title" aria-describedby="sf-exit-description"
      onCancel={event => { event.preventDefault(); if (!savingRef.current) finishDecision(false); }}>
      <h2 id="sf-exit-title">{t("assistantUi", "exitDialogTitle")}</h2>
      <p id="sf-exit-description">{t("assistantUi", "exitDialogDescription")}</p>
      <div className="sf-dialog-actions" aria-busy={saving}>
        <button type="button" className="sf-primary" disabled={saving} onClick={() => void saveAndLeave()}>{t("assistantUi", "saveAndExit")}</button>
        <button ref={cancelButton} type="button" className="sf-secondary" disabled={saving} onClick={() => finishDecision(false)}>{t("assistantUi", "continueReport")}</button>
      </div>
    </dialog>
  </NavigationContext.Provider>;
}

export function useWebNavigation() {
  const navigation = useContext(NavigationContext);
  if (!navigation) throw new Error("Web navigation must be inside WebNavigationProvider");
  return navigation;
}

export function SiteLink({ href, children, onNavigate, ...props }: PropsWithChildren<
  Omit<ComponentProps<"a">, "href"> & { href: Href; onNavigate?: () => void }
>) {
  const { navigate } = useWebNavigation();
  return <Link href={href} asChild>
    <a {...props} onClick={event => {
      props.onClick?.(event);
      if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || props.target === "_blank" || props.download) return;
      event.preventDefault();
      onNavigate?.();
      void navigate(href);
    }}>{children}</a>
  </Link>;
}
