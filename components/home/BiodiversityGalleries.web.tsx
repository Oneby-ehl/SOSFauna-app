import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import type { Locale } from "@/i18n/types";

type Photo = { file: string; species: Record<Locale, string>; position?: string };
type Group = { key: "birds" | "mammals" | "reptiles" | "marine"; photos: Photo[] };

// Illustrative assets supplied by the project owner, never records of real rescues.
const groups: Group[] = [
  { key: "birds", photos: [
    { file: "anade-real-crias.webp", species: { es: "Ánade real con sus crías", en: "Mallard with ducklings" }, position: "65% center" },
    { file: "gaviotas.webp", species: { es: "Gaviotas", en: "Gulls" }, position: "70% center" },
    { file: "flamencos.webp", species: { es: "Flamencos", en: "Flamingos" } },
    { file: "paloma-torcaz.webp", species: { es: "Paloma torcaz", en: "Common wood pigeon" }, position: "65% center" },
    { file: "mochuelo-olivo.webp", species: { es: "Mochuelo en un olivo", en: "Little owl in an olive tree" }, position: "65% center" },
    { file: "vencejos-bebiendo.webp", species: { es: "Vencejos bebiendo agua", en: "Swifts drinking water" }, position: "65% center" },
  ] },
  { key: "mammals", photos: [
    { file: "liebre-crias.webp", species: { es: "Liebre con sus crías", en: "Hare with leverets" }, position: "70% center" },
    { file: "lobo-iberico.webp", species: { es: "Lobo ibérico", en: "Iberian wolf" }, position: "65% center" },
    { file: "ciervos.webp", species: { es: "Ciervos", en: "Deer" }, position: "85% center" },
  ] },
  { key: "reptiles", photos: [
    { file: "vibora-cantabrica.webp", species: { es: "Víbora cantábrica", en: "Seoane’s viper" } },
    { file: "culebra-herradura.webp", species: { es: "Culebra de herradura", en: "Horseshoe whip snake" }, position: "65% center" },
    { file: "sapo-partero.webp", species: { es: "Sapo partero", en: "Midwife toad" }, position: "65% center" },
    { file: "ranita-san-antonio.webp", species: { es: "Ranita de San Antonio", en: "European tree frog" }, position: "65% center" },
  ] },
  { key: "marine", photos: [
    { file: "ballena.webp", species: { es: "Ballena", en: "Whale" } },
    { file: "foca-gris.webp", species: { es: "Foca gris", en: "Grey seal" }, position: "65% center" },
    { file: "delfin-varado.webp", species: { es: "Delfín varado", en: "Stranded dolphin" }, position: "70% center" },
    { file: "tortuga-boba.webp", species: { es: "Tortuga boba", en: "Loggerhead sea turtle" }, position: "65% center" },
  ] },
];

function CategoryGallery({ group, order }: { group: Group; order: number }) {
  const { t, locale } = useI18n();
  const figure = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [entered, setEntered] = useState(false);
  const [reduced, setReduced] = useState(true);
  const [hidden, setHidden] = useState(true);
  const [stopped, setStopped] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [active, setActive] = useState(0);
  const [requested, setRequested] = useState<number[]>([]);
  const [loaded, setLoaded] = useState<number[]>([]);
  const [failed, setFailed] = useState<number[]>([]);
  const decoded = useRef(new Set<number>());
  const waiting = useRef<number | null>(null);
  const firstCycle = useRef(true);
  const available = group.photos.map((_, index) => index).filter(index => !failed.includes(index));
  const current = available.includes(active) ? active : available[0];
  const next = available[(available.indexOf(current) + 1) % available.length];
  const currentReady = loaded.includes(current);
  const rotating = visible && !hidden && !reduced && !stopped && !hovering && available.length > 1;

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => { setReduced(preference.matches); setHidden(document.hidden); };
    const stop = () => setStopped(true);
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") stop(); };
    sync();
    preference.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    document.addEventListener("keydown", escape);
    // No visible playback controls: keyboard navigation, Escape and touch stop motion.
    const page = figure.current?.closest(".sf-page");
    page?.addEventListener("focusin", stop);
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting);
      if (entry.isIntersecting) setEntered(true);
    });
    if (figure.current) observer.observe(figure.current);
    return () => {
      preference.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
      document.removeEventListener("keydown", escape);
      page?.removeEventListener("focusin", stop);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!entered || current === undefined) return;
    // Stagger initial requests as well as playback; the hero remains the priority.
    const timer = window.setTimeout(() => setRequested(previous => previous.includes(current) ? previous : [...previous, current]), order * 180);
    return () => clearTimeout(timer);
  }, [entered, current, order]);

  useEffect(() => {
    if (!rotating || !currentReady) return;
    const offset = firstCycle.current ? order * 450 : 0;
    const preload = window.setTimeout(() => setRequested(previous => previous.includes(next) ? previous : [...previous, next]), 1500 + offset);
    const advance = window.setTimeout(() => {
      firstCycle.current = false;
      if (decoded.current.has(next)) setActive(next);
      else waiting.current = next;
    }, 4000 + offset);
    return () => { clearTimeout(preload); clearTimeout(advance); waiting.current = null; };
  }, [rotating, currentReady, current, next, order]);

  const markFailed = (index: number) => setFailed(previous => previous.includes(index) ? previous : [...previous, index]);
  const markLoaded = async (image: HTMLImageElement, index: number) => {
    try {
      await image.decode();
      decoded.current.add(index);
      setLoaded(previous => previous.includes(index) ? previous : [...previous, index]);
      if (waiting.current === index) { waiting.current = null; setActive(index); }
    } catch { markFailed(index); }
  };

  return <figure ref={figure} className="sf-biodiversity-gallery"
    onPointerDown={() => setStopped(true)}
    onPointerEnter={event => { if (event.pointerType !== "touch") setHovering(true); }}
    onPointerLeave={() => setHovering(false)}>
    <figcaption><h3>{t("home", group.key)}</h3></figcaption>
    <div className="sf-biodiversity-frame" aria-live="off">
      {group.photos.map((photo, index) => requested.includes(index) && !failed.includes(index) ? <img key={photo.file}
        src={`/wildlife/${photo.file}`} alt={index === current ? `${t("landingEditorial", "illustration")}: ${photo.species[locale]}.` : ""}
        aria-hidden={index !== current} className={index === current ? "is-active" : undefined}
        style={{ objectPosition: photo.position ?? "center" }} loading="lazy" decoding="async" fetchPriority="low"
        onLoad={event => void markLoaded(event.currentTarget, index)} onError={() => markFailed(index)} /> : null)}
    </div>
  </figure>;
}

export default function BiodiversityGalleries() {
  const { t } = useI18n();
  return <section className="sf-section sf-scope" aria-labelledby="sf-scope-title" aria-describedby="sf-biodiversity-hint">
    <div><h2 id="sf-scope-title">{t("home", "scopeTitle")}</h2><p>{t("home", "scopeDescription")}</p></div>
    <p className="sf-sr-only" id="sf-biodiversity-hint">{t("landingEditorial", "galleryReadingHint")}</p>
    <div className="sf-biodiversity-grid">{groups.map((group, order) => <CategoryGallery key={group.key} group={group} order={order} />)}</div>
  </section>;
}
