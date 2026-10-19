import type { TopicFaqAccordionProps } from "./TopicFaqAccordion";

export function TopicFaqAccordionStyles() {
  return (
    <style>{`
      .topic-faq-accordion > summary { list-style: none; }
      .topic-faq-accordion > summary::marker { content: ""; }
      .topic-faq-accordion > summary::-webkit-details-marker { display: none; }
      .topic-faq-accordion > summary:focus-visible { outline: 2px solid #166534; outline-offset: -3px; }
      .topic-faq-accordion > summary .topic-faq-indicator::before { content: "+"; }
      .topic-faq-accordion[open] > summary .topic-faq-indicator::before { content: "−"; }
    `}</style>
  );
}

// Native details keeps every answer in static HTML and works before hydration.
export default function TopicFaqAccordion({ id, question, answer, children }: TopicFaqAccordionProps) {
  return (
    <details className="topic-faq-accordion" id={id} style={{ border: "1px solid #dbe7dd", borderRadius: 16, overflow: "hidden", background: "#ffffff", color: "#14532d", fontFamily: 'system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
      <summary id={id + "-question"} aria-controls={id + "-answer"} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", minHeight: 58, boxSizing: "border-box" }}>
        <h2 style={{ flex: 1, margin: 0, fontSize: 17, lineHeight: "24px", fontWeight: 800 }}>{question}</h2>
        <span aria-hidden="true" className="topic-faq-indicator" style={{ width: 28, flexShrink: 0, color: "#166534", fontSize: 24, fontWeight: 900, lineHeight: "28px", textAlign: "center" }} />
      </summary>
      <div id={id + "-answer"} style={{ padding: "16px 18px", borderTop: "1px solid #e5e7eb", display: "flex", flexDirection: "column", gap: 14 }}>
        <p style={{ margin: 0, color: "#374151", fontSize: 16, lineHeight: "25px", whiteSpace: "pre-line" }}>{answer}</p>
        {children}
      </div>
    </details>
  );
}
