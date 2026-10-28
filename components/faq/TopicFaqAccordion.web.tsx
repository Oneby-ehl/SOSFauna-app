import type { TopicFaqAccordionProps } from "./TopicFaqAccordion";
import { AdvicePresentation } from "@/components/sos/StepOnePresentation";

export function TopicFaqAccordionStyles() {
  return (
    <style>{`
      .topic-faq-accordion > summary { list-style: none; }
      .topic-faq-accordion > summary::marker { content: ""; }
      .topic-faq-accordion > summary::-webkit-details-marker { display: none; }
      .topic-faq-accordion > summary:focus-visible { outline: 3px solid #d9b96f; outline-offset: 3px; }
      .topic-faq-accordion .topic-faq-indicator { flex-shrink:0; color:#647b6a; }
      .topic-faq-accordion[open] .topic-faq-indicator { transform:rotate(180deg); }
    `}</style>
  );
}

// Native details keeps every answer in static HTML and works before hydration.
export default function TopicFaqAccordion({ id, question, answer, children }: TopicFaqAccordionProps) {
  return (
    <details className="topic-faq-accordion" data-faq-part="faqCard" id={id}>
      <summary data-faq-part="questionButton" id={id + "-question"} aria-controls={id + "-answer"} style={{ cursor: "pointer", display: "flex", alignItems: "center", boxSizing: "border-box" }}>
        <h2 data-faq-part="questionText" style={{ flex: 1, minWidth: 0, margin: 0 }}>{question}</h2>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" focusable="false" className="topic-faq-indicator">
          <path d="m5 7 4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </summary>
      <div data-faq-part="answerContent" id={id + "-answer"} style={{ borderTop: "1px solid #e2e5dd", display: "flex", flexDirection: "column" }}>
        <div className="sf-faq-advice"><AdvicePresentation text={answer} headingLevel={3} /></div>
        {children}
      </div>
    </details>
  );
}
