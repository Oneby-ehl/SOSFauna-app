import { Link } from "expo-router";
import type { CSSProperties } from "react";
import { useInformationPagePath } from "@/components/i18n/InformationPageSupport";
import { useI18n } from "@/i18n/I18nProvider";

export default function HomeQuickLinks() {
  const { t } = useI18n();
  const path = useInformationPagePath();
  const links = [
    { id: "centers", title: t("landingEditorial", "centers"), description: t("landingEditorial", "accessCentersDescription"), photo: "/wildlife/centro-recuperacion-fauna-clinica.webp", position: "55% center" },
    { id: "faq", title: t("navigation", "faq"), description: t("landingEditorial", "accessFaqDescription"), photo: "/wildlife/gorrion-alimentando-cria.webp", position: "72% center" },
    { id: "history", title: t("landingEditorial", "history"), description: t("landingEditorial", "accessHistoryDescription"), photo: "/wildlife/rescate-erizo.webp", position: "24% center" },
  ] as const;

  return <section className="sf-section sf-access-section" aria-labelledby="sf-access-title">
    <h2 id="sf-access-title">{t("landingEditorial", "accessTitle")}</h2>
    <div className="sf-access-grid">
      {links.map(link => <Link key={link.id} href={path(link.id)} asChild>
        <a className="sf-access-card" style={{ "--sf-access-position": link.position } as CSSProperties}>
          <img className="sf-access-photo" src={link.photo} alt="" loading="lazy" decoding="async" fetchPriority="low" draggable={false} />
          <div className="sf-access-caption">
            <div className="sf-access-copy">
              <h3>{link.title}</h3>
              <p>{link.description}</p>
            </div>
            <span className="sf-access-arrow" aria-hidden="true">↗</span>
          </div>
        </a>
      </Link>)}
    </div>
  </section>;
}
