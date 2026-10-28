import { helpContactDescriptionsEs } from "./help-contact-descriptions.es";
import { landingEditorialEs } from "./landing-editorial";
import { assistantDisplayEs } from "./assistant-display.es";
import { faqAnimalsEs } from "./faq-animals.es";
import { faqCategoryEs } from "./faq-categories.es";
import { recommendationFragmentsEs } from "./recommendation-fragments.es";
import { interfacePendingEs } from "./interface-pending.es";
import { rescueSummaryEs } from "./rescue-summary.es";
// Spanish source copy. Keep punctuation, spacing and explicit line breaks verbatim.
import { informationEs } from "./information.es";
import { centersEs } from "./centers.es";
import { faqEs } from "./faq.es";
import { assistantEs } from "./assistant.es";
import { assistantOptionsEs } from "./assistant-options.es";
import { smallBirdEs } from "./small-bird.es";
import { largeBirdEs } from "./large-bird.es";
import { batEs } from "./bat.es";
import { smallMammalEs } from "./small-mammal.es";
import { largeMammalEs } from "./large-mammal.es";
import { reptileAmphibianEs } from "./reptile-amphibian.es";
import { unknownAnimalEs } from "./unknown-animal.es";
import { marineAnimalEs } from "./marine-animal.es";
import { marineFlagsEs } from "./marine-flags.es";
import { sharedRescueEs } from "./rescue-shared.es";
import { babyEs } from "./baby.es";
import { trappedEs } from "./trapped.es";
import { deadAnimalEs } from "./dead.es";
import { supplementalEs } from "./supplemental.es";

export const es = {
  landingEditorial: landingEditorialEs,
  ...faqAnimalsEs,
  ...assistantDisplayEs,
  ...helpContactDescriptionsEs,
  ...faqCategoryEs,
  ...recommendationFragmentsEs,
  ...interfacePendingEs,
  ...rescueSummaryEs,
  ...informationEs,
  ...centersEs,
  ...faqEs,
  ...assistantEs,
  ...assistantOptionsEs,
  ...smallBirdEs,
  ...largeBirdEs,
  ...batEs,
  ...smallMammalEs,
  ...largeMammalEs,
  ...reptileAmphibianEs,
  ...unknownAnimalEs,
  ...marineAnimalEs,
  ...marineFlagsEs,
  ...sharedRescueEs,
  ...babyEs,
  ...trappedEs,
  ...deadAnimalEs,
  ...supplementalEs,
  language: {
    selectorLabel: "Idioma",
    es: "Español",
    en: "English",
  },
  common: {
    brand: "SOS Fauna España",
    cancel: "Cancelar",
    brandEyebrow: "SOS FAUNA ESPAÑA",
    informationUpdated: "Última actualización: julio de 2026",
  },
  navigation: {
    guide: "Guía de ayuda asistida",
    continueCase: "Continuar aviso anterior",
    history: "Ver avisos recientes",
    about: "Sobre SOS Fauna España",
    faq: "Preguntas frecuentes",
    centers: "Centros de Recuperación y teléfonos de ayuda",
    sources: "Recursos de información",
    contact: "Contacto",
    shareApp: "Compartir SOS Fauna España",
    privacy: "Política de privacidad",
    legal: "Aviso legal",
    backToBrand: "Volver a SOS Fauna España",
    backHome: "Volver al inicio",
  },
  home: {
    pendingCaseConfirmation: "Hay un aviso sin finalizar.\n\n¿Deseas eliminarlo e iniciar una nueva guía de ayuda?",
    pendingCaseTitle: "Aviso sin finalizar",
    discardAndStart: "Eliminar e iniciar guía",
    badge: "Ayuda a la fauna silvestre",
    heroTitle: "¿Has encontrado un animal silvestre herido, atrapado o en peligro?",
    heroDescription: "SOS Fauna España te ayuda paso a paso a valorar la situación con calma, recopilar la información necesaria y contactar con los recursos adecuados.",
    calmTitle: "Actúa con calma",
    calmDesktop: "Evita manipular al animal salvo que exista un riesgo inmediato. Mantén una distancia prudente y observa la situación antes de intervenir. Sigue las recomendaciones del asistente para valorar si realmente es necesario actuar.",
    calmMobile: "Evita manipular al animal salvo que exista un riesgo inmediato. Mantén la distancia y sigue las recomendaciones del asistente.",
    checking: "Comprobando…",
    pendingCaseNote: "Tienes un aviso sin finalizar guardado en este dispositivo.",
    historyNote: "Se guardan los últimos 30 avisos en este dispositivo.",
    freeAndNoRegistration: "Gratuito · Sin registro",
    territory: "Diseñado para incidencias en España",
    quickFaq: "❓ Preguntas frecuentes",
    quickCenters: "📞 Centros de Recuperación y teléfonos de ayuda",
    processTitle: "Ayudar también significa no intervenir cuando no es necesario",
    processDescription: "Muchas crías de aves, mamíferos y otros animales no están abandonadas, aunque parezcan solas.",
    processWarning: "Intervenir innecesariamente puede separarlas de sus padres o reducir sus posibilidades de supervivencia.",
    processConclusion: "Por eso SOS Fauna te ayuda primero a valorar la situación para decidir si realmente es necesario intervenir.",
    scopeTitle: "¿Qué animales incluye SOS Fauna España?",
    scopeDescription: "SOS Fauna España ofrece orientación ante las situaciones más habituales que afectan a la fauna silvestre, incluyendo aves, mamíferos, reptiles, anfibios y fauna marina. Su objetivo es ayudarte a valorar cada situación y encontrar la forma más adecuada de actuar, respetando siempre el bienestar del animal.",
    birds: "Aves",
    mammals: "Mamíferos",
    reptiles: "Reptiles y anfibios",
    marine: "Fauna marina",
    installTitle: "¿Quieres tener SOS Fauna siempre a mano?",
    installText: "Instálala en tu dispositivo para acceder más rápidamente cuando la necesites.",
    installAction: "Instalar aplicación",
    installNote: "Ten la aplicación siempre a mano para acceder rápidamente cuando encuentres un animal silvestre.",
    footerDescription: "Asistencia guiada para ayudar a la fauna silvestre de forma segura y responsable.",
    googlePlayAccessibility: "Disponible en Google Play",
  },
  appSharing: {
    description: "Ayuda y orientación si encuentras un animal silvestre herido, atrapado o en peligro.",
    copiedAlert: "Mensaje copiado al portapapeles.",
    copiedTitle: "Mensaje copiado",
    copiedMessage: "El mensaje de SOS Fauna España se ha copiado al portapapeles.",
  },
  versionFooter: {
    versionSeparator: " · Versión ",
    copyright: "© 2026 SOS Fauna España",
  },
} as const;
