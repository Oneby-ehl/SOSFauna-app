import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { heroPhotos } from "./heroPhotos";

const PHOTO_INTERVAL_MS = 5000;
const NEXT_PHOTO_PRELOAD_DELAY_MS = 1000;

export default function WildlifeHero() {
  const { locale, t } = useI18n();
  const [activeId, setActiveId] = useState(heroPhotos[0]?.id);
  const [paused, setPaused] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(true);
  const hero = useRef<HTMLElement>(null);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [hidden, setHidden] = useState(true);
  const [failed, setFailed] = useState<string[]>([]);
  // Only the first image has a src on initial render (including static HTML).
  const [requested, setRequested] = useState<string[]>(() => heroPhotos.slice(0, 1).map(photo => photo.id));
  const [loaded, setLoaded] = useState<string[]>([]);
  const decoded = useRef(new Set<string>());
  const waitingFor = useRef<string | null>(null);
  const photos = heroPhotos.filter(photo => !failed.includes(photo.id));
  const current = photos.find(photo => photo.id === activeId) ?? photos[0];
  const index = photos.findIndex(photo => photo.id === current?.id);
  const next = photos[(index + 1) % Math.max(photos.length, 1)];
  const currentReady = Boolean(current && loaded.includes(current.id));
  const canRotate = !paused && !hovering && visible && !reducedMotion && !hidden && photos.length > 1;

  useEffect(() => {
    // A failed current image may require a replacement, even in reduced motion.
    if (current) setRequested(previous => previous.includes(current.id) ? previous : [...previous, current.id]);
  }, [current]);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => setReducedMotion(preference.matches);
    const syncVisibility = () => setHidden(document.hidden);
    syncPreference();
    syncVisibility();
    preference.addEventListener("change", syncPreference);
    document.addEventListener("visibilitychange", syncVisibility);
    return () => {
      preference.removeEventListener("change", syncPreference);
      document.removeEventListener("visibilitychange", syncVisibility);
    };
  }, []);

  useEffect(() => {
    const section = hero.current;
    const page = section?.closest(".sf-page");
    if (!section || !page) return;
    // Keyboard focus stops rotation for the rest of this visit, so reading and
    // opening a menu/dialog never cause the background to start moving again.
    const stopForFocus = () => setPaused(true);
    const stopWithEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPaused(true);
    };
    page.addEventListener("focusin", stopForFocus);
    document.addEventListener("keydown", stopWithEscape);
    // Do not download or advance the gallery while reading sections below it.
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(section);
    return () => {
      page.removeEventListener("focusin", stopForFocus);
      document.removeEventListener("keydown", stopWithEscape);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!canRotate || !currentReady || !next) return;
    // Prepare only the successor early, leaving four seconds for its download.
    // The five-second cycle includes the CSS fade; it never waits for transitionend.
    // Retain mounted images for subsequent loops; never start all nine together.
    const preloadTimer = window.setTimeout(() => {
      setRequested(previous => previous.includes(next.id) ? previous : [...previous, next.id]);
    }, NEXT_PHOTO_PRELOAD_DELAY_MS);
    const advanceTimer = window.setTimeout(() => {
      if (decoded.current.has(next.id)) setActiveId(next.id);
      else waitingFor.current = next.id;
    }, PHOTO_INTERVAL_MS);
    return () => {
      window.clearTimeout(preloadTimer);
      window.clearTimeout(advanceTimer);
      waitingFor.current = null;
    };
  }, [canRotate, currentReady, current?.id, next]);

  const markFailed = (id: string) => {
    setFailed(previous => previous.includes(id) ? previous : [...previous, id]);
  };

  const markLoaded = async (image: HTMLImageElement, id: string) => {
    try {
      await image.decode();
      decoded.current.add(id);
      setLoaded(previous => previous.includes(id) ? previous : [...previous, id]);
      // On a slow connection keep the old image until its successor is decoded.
      if (waitingFor.current === id) {
        waitingFor.current = null;
        setActiveId(id);
      }
    } catch {
      markFailed(id);
    }
  };

  return <section ref={hero} className="sf-hero" aria-label={t("landingEditorial", "gallery")}
    aria-describedby="sf-gallery-reading-hint"
    onPointerEnter={event => { if (event.pointerType !== "touch") setHovering(true); }}
    onPointerLeave={() => setHovering(false)}
    onPointerDown={event => { if (event.pointerType === "touch") setPaused(true); }}>
    <p id="sf-gallery-reading-hint" className="sf-sr-only">{t("landingEditorial", "galleryReadingHint")}</p>
    <div className="sf-hero-images" aria-live="off">
      {photos.filter(photo => requested.includes(photo.id)).map(photo => <img
        key={photo.id} src={photo.src} alt={photo.id === current?.id ? photo.alt[locale] : ""}
        aria-hidden={photo.id !== current?.id} className={photo.id === current?.id ? "is-active" : ""}
        style={{
          "--sf-photo-position": photo.objectPosition ?? "50% center",
          "--sf-photo-mobile-position": photo.mobileObjectPosition ?? photo.objectPosition ?? "65% center",
        } as CSSProperties}
        fetchPriority={photo.id === heroPhotos[0]?.id ? "high" : "low"} decoding="async"
        ref={image => {
          // A cached first image can finish before hydration attaches onLoad.
          if (image?.complete && image.naturalWidth > 0 && !decoded.current.has(photo.id)) {
            void markLoaded(image, photo.id);
          }
        }}
        onLoad={event => void markLoaded(event.currentTarget, photo.id)}
        onError={() => markFailed(photo.id)}
      />)}
    </div>
    <div className="sf-hero-shade" aria-hidden="true" />
    <div className="sf-hero-copy">
      <h1 className="sf-sr-only">{t("home", "heroTitle")}</h1>
      <h2>{t("landingEditorial", "headline")}</h2>
      <p className="sf-hero-subtitle">{t("landingEditorial", "subtitle")}</p>
    </div>
    <div className="sf-hero-bottom">
      <p className="sf-photo-credit" aria-live="off">{current?.species[locale] ?? t("landingEditorial", "photoPending")}</p>
    </div>
  </section>;
}
