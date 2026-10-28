import { useI18n } from "@/i18n/I18nProvider";
import EditorialCard from "./EditorialCard.web";

// Retained for a future editorial launch; intentionally not mounted on the home page.
export default function EditorialStories() {
  const { t } = useI18n();
  const stories = [
    { category: "wildlife", title: "wildlifeTitle" },
    { category: "biodiversity", title: "biodiversityTitle" },
    { category: "habitats", title: "habitatsTitle" },
    { category: "conservation", title: "conservationTitle" },
  ] as const;

  return <section className="sf-section" aria-labelledby="sf-stories-title">
    <div className="sf-section-heading">
      <div><p className="sf-eyebrow">{t("landingEditorial", "explore")}</p>
        <h2 id="sf-stories-title">{t("landingEditorial", "stories")}</h2></div>
      <p className="sf-section-intro">{t("landingEditorial", "storiesIntro")}</p>
    </div>
    <div className="sf-stories">
      {stories.map((story, index) => <EditorialCard key={story.category} number={index + 1}
        category={t("landingEditorial", story.category)} title={t("landingEditorial", story.title)}
        status={t("landingEditorial", "soon")} />)}
    </div>
  </section>;
}
