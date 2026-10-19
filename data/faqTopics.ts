import { faqItems } from "./faq";

export const faqTopics = {
  vencejos: {
    path: "/faq/vencejos",
    title: "Preguntas sobre vencejos | SOS Fauna España",
    heading: "Preguntas frecuentes sobre vencejos",
    description: "Qué hacer si encuentras un vencejo en el suelo, herido o que no vuela. Preguntas sobre ayuda, cuidados y conocimiento de la especie.",
    intro: "Consulta las preguntas sobre cómo ayudar a los vencejos y conocer mejor la especie. Puedes buscar dentro de este tema o desplegar cada respuesta.",
    searchLabel: "Buscar en las preguntas sobre vencejos",
    items: faqItems.filter((item) => item.id.includes("vencejo")),
  },
  murcielagos: {
    path: "/faq/murcielagos",
    title: "Preguntas sobre murciélagos | SOS Fauna España",
    heading: "Preguntas frecuentes sobre murciélagos",
    description: "Qué hacer si encuentras un murciélago, una cría o un ejemplar herido. Preguntas sobre identificación, protección y ayuda especializada.",
    intro: "Consulta las preguntas específicas sobre murciélagos. Puedes buscar dentro de este tema o desplegar cada respuesta.",
    searchLabel: "Buscar en las preguntas sobre murciélagos",
    items: faqItems.filter((item) => item.id.startsWith("murcielago")),
  },
} as const;

export type FaqTopicId = keyof typeof faqTopics;
