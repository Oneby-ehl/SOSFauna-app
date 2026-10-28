type EditorialCardProps = { category: string; title: string; status: string; number: number };

// Deliberately no href or click handler until an actual article is published.
export default function EditorialCard({ category, title, status, number }: EditorialCardProps) {
  return <article className="sf-story">
    <div className={`sf-story-cover sf-story-cover-${number}`} aria-hidden="true">
      <span>{String(number).padStart(2, "0")}</span>
    </div>
    <p className="sf-eyebrow">{category}</p>
    <h3>{title}</h3>
    <p className="sf-story-status">{status}</p>
  </article>;
}
