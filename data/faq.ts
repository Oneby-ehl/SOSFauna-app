import { getEffectiveCatalog } from "@/i18n/translate";
import { DEFAULT_LOCALE, type Locale } from "@/i18n/types";
import { getFaqCategoryId, getFaqCategoryLabel, type FaqCategoryId } from "./faqCategories";
import { getFaqSearchVocabulary } from "./faqSearchVocabulary";
import { getEnglishFaqKeywords } from "./faqSearchKeywords.en";
const faqContent = getEffectiveCatalog().faqContent;

import {
  FAQ_SEARCH_GROUPS,
  mergeFaqSearchKeywords,
} from "./faqSearchKeywords";

/*
Para añadir una FAQ:
1. Copia uno de los bloques existentes.
2. Usa un id único, en minúsculas y sin espacios.
3. Elige una de las categorías permitidas.
4. Edita question y answer en i18n/catalogs/faq.es.ts usando el mismo id.

El campo keywords es opcional.
Sirve para que una pregunta aparezca al buscar términos relacionados
que no tienen por qué figurar literalmente en la pregunta o respuesta.

showCreateNotice es opcional.
Cuando vale true, la respuesta muestra al final un acceso al asistente
para valorar el caso concreto y comenzar un aviso.
*/

export type FaqCategory =
  | "Antes de actuar"
  | "Crías y animales jóvenes"
  | "Animales heridos o atrapados"
  | "Manipulación y cuidados"
  | "Contacto y emergencias"
  | "Conocer al vencejo"
  | "La aplicación";

export type FaqItem = {
  id: string;
  category: FaqCategory;
  question: string;
  answer: string;
  keywords?: string[];
  showCreateNotice?: boolean;
  showRecoveryCenters?: boolean;
};

const animals = FAQ_SEARCH_GROUPS.animals;
const situations = FAQ_SEARCH_GROUPS.situations;
const swift = FAQ_SEARCH_GROUPS.swift;

const allWildlifeSearchGroups = [
  animals.birds,
  animals.mammals,
  animals.bats,
  animals.reptiles,
  animals.amphibians,
  animals.marine,
] as const;

const transportableSmallWildlifeSearchGroups = [
  animals.birds,
  animals.bats,
  animals.reptiles,
] as const;

const smallMammalTransportSearchTerms = [
  "erizo",
  "garduña",
  "garduna",
  "gineta",
  "ardilla",
  "lirón",
  "liron",
  "conejo",
  "liebre",
  "nutria",
  "meloncillo",
  "comadreja",
  "turón",
  "turon",
] as const;

export const faqCategories: FaqCategory[] = [
  "Antes de actuar",
  "Crías y animales jóvenes",
  "Animales heridos o atrapados",
  "Manipulación y cuidados",
  "Contacto y emergencias",
  "Conocer al vencejo",
  "La aplicación",
];

export const swiftFaqPriorityIds = [
  "que-hacer-si-encuentro-animal",
  "vencejo-no-vuela-parece-sano",
  "vencejo-senales-urgentes",
  "vencejo-pollo-caido",
  "vencejo-padres-suelo",
  "vencejo-gato",
  "vencejo-cristal",
  "vencejo-atrapado",
  "vencejo-chimenea-extractor",
  "vencejo-mojado-contaminado",
  "vencejo-donde-dejarlo",
  "vencejo-caja-carton-jaula",
  "vencejo-fondo-caja",
  "vencejo-manipulacion-minima",
  "vencejo-volar-dentro-casa",
  "vencejo-observar-sin-explorar",
  "vencejo-fotos-utiles",
  "vencejo-informacion-crfs",
  "vencejo-transporte",
  "vencejo-horas-sin-contacto",
  "vencejo-varios-dias",
  "vencejo-aturdido-descansar",
  "vencejo-parece-mejor",
  "lanzar-vencejo",
  "vencejo-cuando-no-prueba-vuelo",
  "prueba-vuelo-vencejo",
  "vencejo-no-sale-volando",
  "vencejo-deshidratado",
  "agua-comida-vencejo",
  "vencejo-hidratar-indicacion-crfs",
  "vencejo-dieta-incorrecta-plumaje",
  "caja-vencejo",
  "nidos-vencejo-obras",
  "vencejo-cerrar-hueco-nido",
] as const;

const swiftRescueKeywords = mergeFaqSearchKeywords(
  swift.animal,
  swift.urgent,
  swift.incidents,
  swift.nest,
  situations.contact,
);

const swiftCareKeywords = mergeFaqSearchKeywords(
  swift.animal,
  swift.care,
  swift.urgent,
  situations.transport,
  situations.stress,
  situations.contact,
);

const swiftFoodWaterKeywords = mergeFaqSearchKeywords(
  swift.animal,
  swift.foodWater,
  situations.feeding,
  situations.hydration,
);

const swiftFlightKeywords = mergeFaqSearchKeywords(
  swift.animal,
  swift.flight,
  swift.urgent,
  situations.injured,
);

const swiftKnowledgeKeywords = mergeFaqSearchKeywords(
  swift.animal,
  swift.knowledge,
);

export const faqItems: FaqItem[] = [
  {
    id: "vencejo-no-vuela-parece-sano",
    category: "Antes de actuar",
    question: faqContent["vencejo-no-vuela-parece-sano.question"],
    answer:
      faqContent["vencejo-no-vuela-parece-sano.answer"],
    keywords: mergeFaqSearchKeywords(swiftRescueKeywords, swiftFlightKeywords, [
      "parece sano",
      "sano",
      "vencejo volar",
      "vencejo no vuela",
      "no despega",
    ]),
    showCreateNotice: true,
  },
  {
    id: "vencejo-senales-urgentes",
    category: "Antes de actuar",
    question: faqContent["vencejo-senales-urgentes.question"],
    answer:
      faqContent["vencejo-senales-urgentes.answer"],
    keywords: mergeFaqSearchKeywords(swiftRescueKeywords, [
      "urgente",
      "vencejo herido",
      "señales",
      "senales",
      "sintomas",
      "síntomas",
      "respira",
      "ojos",
      "temblores",
    ]),
    showCreateNotice: true,
  },
  {
    id: "vencejo-pollo-caido",
    category: "Crías y animales jóvenes",
    question: faqContent["vencejo-pollo-caido.question"],
    answer:
      faqContent["vencejo-pollo-caido.answer"],
    keywords: mergeFaqSearchKeywords(swiftRescueKeywords, swift.nest, [
      "pollo de vencejo",
      "polluelo de vencejo",
      "cria de vencejo",
      "cría de vencejo",
      "vencejo cria",
      "vencejo cría",
    ]),
    showCreateNotice: true,
  },
  {
    id: "vencejo-atrapado",
    category: "Animales heridos o atrapados",
    question: faqContent["vencejo-atrapado.question"],
    answer:
      faqContent["vencejo-atrapado.answer"],
    keywords: mergeFaqSearchKeywords(swiftRescueKeywords, swift.incidents, [
      "enganchado",
      "red",
      "hilo",
      "cuerda",
      "rejilla",
    ]),
    showCreateNotice: true,
  },
  {
    id: "vencejo-chimenea-extractor",
    category: "Animales heridos o atrapados",
    question: faqContent["vencejo-chimenea-extractor.question"],
    answer:
      faqContent["vencejo-chimenea-extractor.answer"],
    keywords: mergeFaqSearchKeywords(swiftRescueKeywords, swift.incidents, [
      "chimenea",
      "extractor",
      "conducto",
      "rejilla",
    ]),
    showCreateNotice: true,
  },
  {
    id: "vencejo-mojado-contaminado",
    category: "Animales heridos o atrapados",
    question: faqContent["vencejo-mojado-contaminado.question"],
    answer:
      faqContent["vencejo-mojado-contaminado.answer"],
    keywords: mergeFaqSearchKeywords(swiftRescueKeywords, swift.incidents, [
      "sustancia",
      "manchado",
      "manchada",
      "limpiar",
    ]),
    showCreateNotice: true,
  },
  {
    id: "vencejo-donde-dejarlo",
    category: "Manipulación y cuidados",
    question: faqContent["vencejo-donde-dejarlo.question"],
    answer:
      faqContent["vencejo-donde-dejarlo.answer"],
    keywords: mergeFaqSearchKeywords(swiftCareKeywords, [
      "donde dejarlo",
      "dónde dejarlo",
      "mientras consigo ayuda",
    ]),
    showCreateNotice: true,
  },
  {
    id: "vencejo-caja-carton-jaula",
    category: "Manipulación y cuidados",
    question: faqContent["vencejo-caja-carton-jaula.question"],
    answer:
      faqContent["vencejo-caja-carton-jaula.answer"],
    keywords: mergeFaqSearchKeywords(swiftCareKeywords, [
      "caja",
      "carton",
      "cartón",
      "jaula",
      "recipiente",
    ]),
    showCreateNotice: true,
  },
  {
    id: "vencejo-fondo-caja",
    category: "Manipulación y cuidados",
    question: faqContent["vencejo-fondo-caja.question"],
    answer:
      faqContent["vencejo-fondo-caja.answer"],
    keywords: mergeFaqSearchKeywords(swiftCareKeywords, [
      "fondo",
      "papel",
      "excrementos",
      "sangre",
      "parasitos",
      "parásitos",
    ]),
    showCreateNotice: true,
  },
  {
    id: "vencejo-manipulacion-minima",
    category: "Manipulación y cuidados",
    question: faqContent["vencejo-manipulacion-minima.question"],
    answer:
      faqContent["vencejo-manipulacion-minima.answer"],
    keywords: mergeFaqSearchKeywords(swiftCareKeywords, [
      "tocar",
      "coger",
      "abrir alas",
      "plumas",
      "explorar",
    ]),
    showCreateNotice: true,
  },
  {
    id: "vencejo-volar-dentro-casa",
    category: "Manipulación y cuidados",
    question: faqContent["vencejo-volar-dentro-casa.question"],
    answer:
      faqContent["vencejo-volar-dentro-casa.answer"],
    keywords: mergeFaqSearchKeywords(swiftCareKeywords, swiftFlightKeywords, [
      "dentro de casa",
      "vencejo volar",
      "habitacion",
      "habitación",
      "balcon",
      "balcón",
    ]),
    showCreateNotice: true,
  },
  {
    id: "vencejo-observar-sin-explorar",
    category: "Manipulación y cuidados",
    question: faqContent["vencejo-observar-sin-explorar.question"],
    answer:
      faqContent["vencejo-observar-sin-explorar.answer"],
    keywords: mergeFaqSearchKeywords(swiftCareKeywords, [
      "observar",
      "alerta",
      "apagado",
      "respiracion",
      "respiración",
      "alas simetricas",
      "alas simétricas",
    ]),
    showCreateNotice: true,
  },
  {
    id: "vencejo-fotos-utiles",
    category: "Manipulación y cuidados",
    question: faqContent["vencejo-fotos-utiles.question"],
    answer:
      faqContent["vencejo-fotos-utiles.answer"],
    keywords: mergeFaqSearchKeywords(swiftCareKeywords, [
      "foto",
      "fotografia",
      "fotografía",
      "video",
      "vídeo",
      "cuerpo completo",
    ]),
    showCreateNotice: true,
  },
  {
    id: "vencejo-informacion-crfs",
    category: "Contacto y emergencias",
    question: faqContent["vencejo-informacion-crfs.question"],
    answer:
      faqContent["vencejo-informacion-crfs.answer"],
    keywords: mergeFaqSearchKeywords(swiftCareKeywords, swiftRescueKeywords, [
      "crfs",
      "centro",
      "agentes",
      "informacion",
      "información",
      "datos",
    ]),
    showCreateNotice: true,
    showRecoveryCenters: true,
  },
  {
    id: "vencejo-transporte",
    category: "Manipulación y cuidados",
    question: faqContent["vencejo-transporte.question"],
    answer:
      faqContent["vencejo-transporte.answer"],
    keywords: mergeFaqSearchKeywords(swiftCareKeywords, [
      "traslado",
      "trasladar",
      "transportar",
      "transporte",
      "coche",
    ]),
    showCreateNotice: true,
  },
  {
    id: "vencejo-horas-sin-contacto",
    category: "Manipulación y cuidados",
    question: faqContent["vencejo-horas-sin-contacto.question"],
    answer:
      faqContent["vencejo-horas-sin-contacto.answer"],
    keywords: mergeFaqSearchKeywords(swiftCareKeywords, swiftFoodWaterKeywords, [
      "horas",
      "no contestan",
      "no consigo contactar",
      "noche",
    ]),
    showCreateNotice: true,
    showRecoveryCenters: true,
  },
  {
    id: "vencejo-varios-dias",
    category: "Manipulación y cuidados",
    question: faqContent["vencejo-varios-dias.question"],
    answer:
      faqContent["vencejo-varios-dias.answer"],
    keywords: mergeFaqSearchKeywords(swiftCareKeywords, [
      "varios dias",
      "varios días",
      "quedarmelo",
      "quedármelo",
      "casa",
      "mascota",
    ]),
    showCreateNotice: true,
  },
  {
    id: "vencejo-cerrar-hueco-nido",
    category: "Contacto y emergencias",
    question: faqContent["vencejo-cerrar-hueco-nido.question"],
    answer:
      faqContent["vencejo-cerrar-hueco-nido.answer"],
    keywords: mergeFaqSearchKeywords(swiftRescueKeywords, swift.nest, [
      "cerrar hueco",
      "bloquear hueco",
      "entrada al nido",
      "hueco de edificio",
      "grieta",
      "cavidad",
    ]),
    showRecoveryCenters: true,
  },
  {
    id: "vencejo-aturdido-descansar",
    category: "Manipulación y cuidados",
    question: faqContent["vencejo-aturdido-descansar.question"],
    answer:
      faqContent["vencejo-aturdido-descansar.answer"],
    keywords: mergeFaqSearchKeywords(swiftFlightKeywords, swiftCareKeywords, [
      "aturdido",
      "aturdida",
      "desorientado",
      "desorientada",
      "descansar",
      "shock",
    ]),
    showCreateNotice: true,
  },
  {
    id: "vencejo-parece-mejor",
    category: "Manipulación y cuidados",
    question: faqContent["vencejo-parece-mejor.question"],
    answer:
      faqContent["vencejo-parece-mejor.answer"],
    keywords: mergeFaqSearchKeywords(swiftFlightKeywords, swiftCareKeywords, [
      "parece mejor",
      "se recupero",
      "se recuperó",
      "recuperado",
      "recuperada",
    ]),
    showCreateNotice: true,
  },
  {
    id: "vencejo-cuando-no-prueba-vuelo",
    category: "Manipulación y cuidados",
    question: faqContent["vencejo-cuando-no-prueba-vuelo.question"],
    answer:
      faqContent["vencejo-cuando-no-prueba-vuelo.answer"],
    keywords: mergeFaqSearchKeywords(swiftFlightKeywords, [
      "cuando no",
      "no hacer prueba",
      "lesion",
      "lesión",
      "cañones",
      "canones",
    ]),
    showCreateNotice: true,
  },
  {
    id: "vencejo-no-sale-volando",
    category: "Manipulación y cuidados",
    question: faqContent["vencejo-no-sale-volando.question"],
    answer:
      faqContent["vencejo-no-sale-volando.answer"],
    keywords: mergeFaqSearchKeywords(swiftFlightKeywords, [
      "no sale",
      "se aferra",
      "retrocede",
      "cae",
      "no mantiene el vuelo",
    ]),
    showCreateNotice: true,
  },
  {
    id: "vencejo-deshidratado",
    category: "Manipulación y cuidados",
    question: faqContent["vencejo-deshidratado.question"],
    answer:
      faqContent["vencejo-deshidratado.answer"],
    keywords: mergeFaqSearchKeywords(swiftFoodWaterKeywords, swiftCareKeywords, [
      "deshidratado",
      "deshidratada",
      "calor",
      "diarrea",
      "liquidos",
      "líquidos",
    ]),
    showCreateNotice: true,
  },
  {
    id: "vencejo-hidratar-indicacion-crfs",
    category: "Manipulación y cuidados",
    question: faqContent["vencejo-hidratar-indicacion-crfs.question"],
    answer:
      faqContent["vencejo-hidratar-indicacion-crfs.answer"],
    keywords: mergeFaqSearchKeywords(swiftFoodWaterKeywords, [
      "crfs hidratar",
      "me han indicado",
      "profesional",
      "jeringa",
      "gotero",
    ]),
    showCreateNotice: true,
  },
  {
    id: "vencejo-dieta-incorrecta-plumaje",
    category: "Manipulación y cuidados",
    question: faqContent["vencejo-dieta-incorrecta-plumaje.question"],
    answer:
      faqContent["vencejo-dieta-incorrecta-plumaje.answer"],
    keywords: mergeFaqSearchKeywords(swiftFoodWaterKeywords, swiftKnowledgeKeywords, [
      "dieta incorrecta",
      "plumaje",
      "plumas",
      "desarrollo",
      "supervivencia",
    ]),
    showCreateNotice: true,
  },
  {
    id: "vencejo-vida-aerea",
    category: "Conocer al vencejo",
    question: faqContent["vencejo-vida-aerea.question"],
    answer:
      faqContent["vencejo-vida-aerea.answer"],
    keywords: mergeFaqSearchKeywords(swiftKnowledgeKeywords, [
      "vida aerea",
      "vida aérea",
      "adaptado",
      "alas",
      "patas",
    ]),
  },
  {
    id: "vencejo-diez-meses-volando",
    category: "Conocer al vencejo",
    question: faqContent["vencejo-diez-meses-volando.question"],
    answer:
      faqContent["vencejo-diez-meses-volando.answer"],
    keywords: mergeFaqSearchKeywords(swiftKnowledgeKeywords, [
      "diez meses",
      "10 meses",
      "99",
      "sin posarse",
      "cuanto vuela un vencejo",
      "cuánto vuela un vencejo",
      "cuanto vuela",
      "cuánto vuela",
    ]),
  },
  {
    id: "vencejo-que-hace-en-vuelo",
    category: "Conocer al vencejo",
    question: faqContent["vencejo-que-hace-en-vuelo.question"],
    answer:
      faqContent["vencejo-que-hace-en-vuelo.answer"],
    keywords: mergeFaqSearchKeywords(swiftKnowledgeKeywords, [
      "que hace",
      "qué hace",
      "alimentarse en vuelo",
      "beber en vuelo",
      "aparearse",
    ]),
  },
  {
    id: "vencejo-como-bebe-agua",
    category: "Conocer al vencejo",
    question: faqContent["vencejo-como-bebe-agua.question"],
    answer:
      faqContent["vencejo-como-bebe-agua.answer"],
    keywords: mergeFaqSearchKeywords(swiftKnowledgeKeywords, swiftFoodWaterKeywords, [
      "como bebe un vencejo",
      "cómo bebe un vencejo",
      "como bebe agua un vencejo",
      "cómo bebe agua un vencejo",
      "beber agua en vuelo",
    ]),
  },
  {
    id: "vencejo-duerme-volando",
    category: "Conocer al vencejo",
    question: faqContent["vencejo-duerme-volando.question"],
    answer:
      faqContent["vencejo-duerme-volando.answer"],
    keywords: mergeFaqSearchKeywords(swiftKnowledgeKeywords, [
      "como duerme un vencejo",
      "cómo duerme un vencejo",
      "dormir",
      "duerme",
      "sueño",
      "sueno",
    ]),
  },
  {
    id: "vencejo-ascensos-crepusculares",
    category: "Conocer al vencejo",
    question: faqContent["vencejo-ascensos-crepusculares.question"],
    answer:
      faqContent["vencejo-ascensos-crepusculares.answer"],
    keywords: mergeFaqSearchKeywords(swiftKnowledgeKeywords, [
      "ascensos crepusculares",
      "amanecer",
      "anochecer",
      "2,5",
      "altura",
      "altitud",
    ]),
  },
  {
    id: "vencejo-aeroplancton-alimentacion",
    category: "Conocer al vencejo",
    question: faqContent["vencejo-aeroplancton-alimentacion.question"],
    answer:
      faqContent["vencejo-aeroplancton-alimentacion.answer"],
    keywords: mergeFaqSearchKeywords(swiftKnowledgeKeywords, swiftFoodWaterKeywords, [
      "aeroplancton",
      "mosquitos",
      "moscas",
      "insectos",
      "que come",
      "qué come",
    ]),
  },
  {
    id: "vencejo-migracion-africa",
    category: "Conocer al vencejo",
    question: faqContent["vencejo-migracion-africa.question"],
    answer:
      faqContent["vencejo-migracion-africa.answer"],
    keywords: mergeFaqSearchKeywords(swiftKnowledgeKeywords, [
      "migracion",
      "migración",
      "vencejo migracion",
      "vencejo migración",
      "africa",
      "áfrica",
      "rutas",
      "primavera",
      "agosto",
    ]),
  },
  {
    id: "vencejo-mas-mil-km",
    category: "Conocer al vencejo",
    question: faqContent["vencejo-mas-mil-km.question"],
    answer:
      faqContent["vencejo-mas-mil-km.answer"],
    keywords: mergeFaqSearchKeywords(swiftKnowledgeKeywords, [
      "1000 km",
      "1.000 km",
      "mil kilometros",
      "mil kilómetros",
      "km dia",
      "km día",
    ]),
  },
  {
    id: "vencejo-viento-navegacion",
    category: "Conocer al vencejo",
    question: faqContent["vencejo-viento-navegacion.question"],
    answer:
      faqContent["vencejo-viento-navegacion.answer"],
    keywords: mergeFaqSearchKeywords(swiftKnowledgeKeywords, [
      "viento",
      "orientacion",
      "orientación",
      "navegacion",
      "navegación",
      "deriva",
    ]),
  },
  {
    id: "vencejo-nidos-edificios",
    category: "Conocer al vencejo",
    question: faqContent["vencejo-nidos-edificios.question"],
    answer:
      faqContent["vencejo-nidos-edificios.answer"],
    keywords: mergeFaqSearchKeywords(swiftKnowledgeKeywords, swift.nest, [
      "nidos en edificios",
      "huecos",
      "grietas",
      "cavidades",
      "aleros",
      "tejas",
    ]),
  },
  {
    id: "vencejo-materiales-nido",
    category: "Conocer al vencejo",
    question: faqContent["vencejo-materiales-nido.question"],
    answer:
      faqContent["vencejo-materiales-nido.answer"],
    keywords: mergeFaqSearchKeywords(swiftKnowledgeKeywords, swift.nest, [
      "materiales",
      "saliva",
      "plumas",
      "fibras",
      "construye el nido",
    ]),
  },
  {
    id: "vencejo-fidelidad-hueco",
    category: "Conocer al vencejo",
    question: faqContent["vencejo-fidelidad-hueco.question"],
    answer:
      faqContent["vencejo-fidelidad-hueco.answer"],
    keywords: mergeFaqSearchKeywords(swiftKnowledgeKeywords, swift.nest, [
      "mismo lugar",
      "lugar de nidificacion",
      "lugar de nidificación",
      "hueco de nidificacion",
      "hueco de nidificación",
      "fidelidad",
      "regresa",
      "vuelve",
    ]),
  },
  {
    id: "vencejo-localiza-hueco",
    category: "Conocer al vencejo",
    question: faqContent["vencejo-localiza-hueco.question"],
    answer:
      faqContent["vencejo-localiza-hueco.answer"],
    keywords: mergeFaqSearchKeywords(swiftKnowledgeKeywords, swift.nest, [
      "encuentra el nido",
      "localiza el nido",
      "lugar de nidificacion",
      "lugar de nidificación",
      "entrada al nido",
      "memoria",
      "africa",
      "áfrica",
    ]),
  },
  {
    id: "vencejo-reproduccion-huevos",
    category: "Conocer al vencejo",
    question: faqContent["vencejo-reproduccion-huevos.question"],
    answer:
      faqContent["vencejo-reproduccion-huevos.answer"],
    keywords: mergeFaqSearchKeywords(swiftKnowledgeKeywords, swift.nest, [
      "reproduccion",
      "reproducción",
      "huevos",
      "puesta",
      "mayo",
      "julio",
    ]),
  },
  {
    id: "vencejo-primer-vuelo-joven",
    category: "Conocer al vencejo",
    question: faqContent["vencejo-primer-vuelo-joven.question"],
    answer:
      faqContent["vencejo-primer-vuelo-joven.answer"],
    keywords: mergeFaqSearchKeywords(swiftKnowledgeKeywords, swift.nest, swiftFlightKeywords, [
      "primer vuelo",
      "joven",
      "40 dias",
      "45 dias",
      "40-45",
      "carga alar",
    ]),
  },
  {
    id: "vencejo-no-volanton-normal",
    category: "Conocer al vencejo",
    question: faqContent["vencejo-no-volanton-normal.question"],
    answer:
      faqContent["vencejo-no-volanton-normal.answer"],
    keywords: mergeFaqSearchKeywords(swiftKnowledgeKeywords, swift.nest, [
      "volanton",
      "volantón",
      "padres",
      "vencejo cria",
      "vencejo cría",
      "suelo",
      "joven",
    ]),
  },
  {
    id: "vencejo-torpor",
    category: "Conocer al vencejo",
    question: faqContent["vencejo-torpor.question"],
    answer:
      faqContent["vencejo-torpor.answer"],
    keywords: mergeFaqSearchKeywords(swiftKnowledgeKeywords, swift.nest, [
      "torpor",
      "metabolismo",
      "pollos",
      "sin alimento",
      "56",
    ]),
  },
  {
    id: "vencejo-plumaje-marcas",
    category: "Conocer al vencejo",
    question: faqContent["vencejo-plumaje-marcas.question"],
    answer:
      faqContent["vencejo-plumaje-marcas.answer"],
    keywords: mergeFaqSearchKeywords(swiftKnowledgeKeywords, [
      "pluma",
      "plumas",
      "plumaje",
      "marcas de estres",
      "marcas de estrés",
      "crecimiento",
    ]),
  },
  {
    id: "vencejo-amenazas-conservacion",
    category: "Conocer al vencejo",
    question: faqContent["vencejo-amenazas-conservacion.question"],
    answer:
      faqContent["vencejo-amenazas-conservacion.answer"],
    keywords: mergeFaqSearchKeywords(swiftKnowledgeKeywords, swift.nest, [
      "amenazas",
      "conservacion",
      "conservación",
      "pesticidas",
      "clima",
      "insectos",
      "vulnerable",
    ]),
  },
  {
    id: "vencejo-ciencia-desconoce",
    category: "Conocer al vencejo",
    question: faqContent["vencejo-ciencia-desconoce.question"],
    answer:
      faqContent["vencejo-ciencia-desconoce.answer"],
    keywords: mergeFaqSearchKeywords(swiftKnowledgeKeywords, [
      "desconocido",
      "no se sabe",
      "ciencia",
      "investigacion",
      "investigación",
      "pendiente",
    ]),
  },
  {
    id: "que-hacer-si-encuentro-animal",
    category: "Antes de actuar",
    question: faqContent["que-hacer-si-encuentro-animal.question"],
    answer:
      faqContent["que-hacer-si-encuentro-animal.answer"],
    keywords: mergeFaqSearchKeywords(
      ...allWildlifeSearchGroups,
      situations.injured,
      situations.trapped,
      situations.baby,
      situations.contact,
      situations.location,
      situations.stress,
      ["fauna", "silvestre", "encontrado", "primeros pasos"],
    ),
    showCreateNotice: true,
  },
  {
    id: "ayudar-no-siempre-recoger",
    category: "Antes de actuar",
    question: faqContent["ayudar-no-siempre-recoger.question"],
    answer:
      faqContent["ayudar-no-siempre-recoger.answer"],
    keywords: mergeFaqSearchKeywords(
      ...allWildlifeSearchGroups,
      situations.baby,
      situations.stress,
      ["recoger", "capturar", "coger", "dejar", "observar"],
    ),
    showCreateNotice: true,
  },
  {
    id: "saber-si-necesita-ayuda",
    category: "Antes de actuar",
    question: faqContent["saber-si-necesita-ayuda.question"],
    answer:
      faqContent["saber-si-necesita-ayuda.answer"],
    keywords: mergeFaqSearchKeywords(
      ...allWildlifeSearchGroups,
      situations.injured,
      situations.trapped,
      situations.contact,
      ["tráfico", "trafico", "ataque", "dudas"],
    ),
    showCreateNotice: true,
  },
  {
    id: "vencejo-padres-suelo",
    category: "Crías y animales jóvenes",
    question: faqContent["vencejo-padres-suelo.question"],
    answer:
      faqContent["vencejo-padres-suelo.answer"],
    keywords: mergeFaqSearchKeywords(situations.baby, situations.contact, [
      "vencejo",
      "vencejos",
      "padres",
      "suelo",
      "volantón",
      "volanton",
      "caído del nido",
      "caido del nido",
    ]),
    showCreateNotice: true,
  },
  {
    id: "que-hacer-si-encuentro-cria",
    category: "Crías y animales jóvenes",
    question: faqContent["que-hacer-si-encuentro-cria.question"],
    answer:
      faqContent["que-hacer-si-encuentro-cria.answer"],
    keywords: mergeFaqSearchKeywords(
      animals.birds,
      animals.mammals,
      animals.bats,
      situations.baby,
      situations.injured,
      situations.contact,
      ["joven", "padres"],
    ),
    showCreateNotice: true,
  },
  {
    id: "pollo-o-volanton",
    category: "Crías y animales jóvenes",
    question: faqContent["pollo-o-volanton.question"],
    answer:
      faqContent["pollo-o-volanton.answer"],
    keywords: mergeFaqSearchKeywords(animals.birds, situations.baby, [
      "plumaje",
      "plumón",
      "plumon",
      "padres",
    ]),
    showCreateNotice: true,
  },
  {
    id: "alejar-cria-padres",
    category: "Crías y animales jóvenes",
    question: faqContent["alejar-cria-padres.question"],
    answer:
      faqContent["alejar-cria-padres.answer"],
    keywords: mergeFaqSearchKeywords(
      animals.birds,
      animals.mammals,
      animals.bats,
      situations.baby,
      situations.injured,
      situations.stress,
      [
      "padres",
      "adultos",
      "tráfico",
      "trafico",
      "mascotas",
      "gato",
      "perro",
    ],
    ),
    showCreateNotice: true,
  },
  {
    id: "hidratar-cria",
    category: "Crías y animales jóvenes",
    question: faqContent["hidratar-cria.question"],
    answer:
      faqContent["hidratar-cria.answer"],
    keywords: mergeFaqSearchKeywords(
      animals.birds,
      animals.bats,
      situations.baby,
      situations.hydration,
      situations.contact,
      ["pico", "boca"],
    ),
    showCreateNotice: true,
  },
  {
    id: "vencejo-gato",
    category: "Animales heridos o atrapados",
    question: faqContent["vencejo-gato.question"],
    answer:
      faqContent["vencejo-gato.answer"],
    keywords: mergeFaqSearchKeywords(situations.injured, situations.contact, [
      "vencejo",
      "vencejos",
      "gato",
      "boca",
      "patas",
      "lo ha cogido un gato",
      "boca del gato",
    ]),
    showCreateNotice: true,
  },
  {
    id: "vencejo-cristal",
    category: "Animales heridos o atrapados",
    question: faqContent["vencejo-cristal.question"],
    answer:
      faqContent["vencejo-cristal.answer"],
    keywords: mergeFaqSearchKeywords(situations.injured, situations.contact, [
      "vencejo",
      "vencejos",
      "cristal",
      "ventana",
      "colisión",
      "colision",
      "aturdido",
      "obstáculo",
      "obstaculo",
      "fachada",
      "se ha golpeado",
    ]),
    showCreateNotice: true,
  },
  {
    id: "animal-herido",
    category: "Animales heridos o atrapados",
    question: faqContent["animal-herido.question"],
    answer:
      faqContent["animal-herido.answer"],
    keywords: mergeFaqSearchKeywords(
      ...allWildlifeSearchGroups,
      situations.injured,
      situations.contact,
      situations.stress,
      ["mascotas", "ruido"],
    ),
    showCreateNotice: true,
  },
  {
    id: "animal-atrapado",
    category: "Animales heridos o atrapados",
    question: faqContent["animal-atrapado.question"],
    answer:
      faqContent["animal-atrapado.answer"],
    keywords: mergeFaqSearchKeywords(
      animals.birds,
      animals.mammals,
      animals.bats,
      animals.reptiles,
      situations.trapped,
      situations.contact,
      ["ala", "pata", "vídeo", "video", "foto"],
    ),
    showCreateNotice: true,
  },
  {
    id: "no-puede-volar",
    category: "Animales heridos o atrapados",
    question: faqContent["no-puede-volar.question"],
    answer:
      faqContent["no-puede-volar.answer"],
    keywords: mergeFaqSearchKeywords(animals.birds, animals.bats, situations.injured, situations.baby, [
      "ala",
      "vuelo",
      "no vuela",
      "rapaz",
    ]),
    showCreateNotice: true,
  },
  {
    id: "parece-muerto",
    category: "Animales heridos o atrapados",
    question: faqContent["parece-muerto.question"],
    answer:
      faqContent["parece-muerto.answer"],
    keywords: mergeFaqSearchKeywords(
      ...allWildlifeSearchGroups,
      situations.injured,
      situations.contact,
      situations.location,
      ["muerto", "fallecido", "veneno", "venenoso", "carretera"],
    ),
    showCreateNotice: true,
  },
  {
    id: "murcielago",
    category: "Animales heridos o atrapados",
    question: faqContent["murcielago.question"],
    answer:
      faqContent["murcielago.answer"],
    keywords: mergeFaqSearchKeywords(
      animals.bats,
      situations.baby,
      situations.injured,
      situations.trapped,
      situations.contact,
      situations.stress,
      [
        "he encontrado un murciélago",
        "encontrar murciélago",
        "pared",
        "suelo",
        "balcón",
        "balcon",
        "guantes",
        "toalla",
      ],
    ),
    showCreateNotice: true,
  },
  {
    id: "murcielago-cria-identificar",
    category: "Crías y animales jóvenes",
    question: faqContent["murcielago-cria-identificar.question"],
    answer:
      faqContent["murcielago-cria-identificar.answer"],
    keywords: mergeFaqSearchKeywords(
      animals.bats,
      situations.baby,
      situations.contact,
      ["sin pelo", "pelo gris", "pelo", "adulto", "pequeño", "pequeno", "edad"],
    ),
    showCreateNotice: true,
  },
  {
    id: "murcielago-cria",
    category: "Crías y animales jóvenes",
    question: faqContent["murcielago-cria.question"],
    answer:
      faqContent["murcielago-cria.answer"],
    keywords: mergeFaqSearchKeywords(
      animals.bats,
      situations.baby,
      situations.injured,
      situations.hydration,
      situations.contact,
      situations.stress,
      [
        "murciélago cría",
        "murcielago cria",
        "cría de murciélago",
        "cria de murcielago",
        "recién nacido",
        "recien nacido",
        "frío",
        "frio",
        "calor",
        "refugio",
      ],
    ),
    showCreateNotice: true,
  },
  {
    id: "murcielago-cria-refugio-reunificacion",
    category: "Crías y animales jóvenes",
    question: faqContent["murcielago-cria-refugio-reunificacion.question"],
    answer:
      faqContent["murcielago-cria-refugio-reunificacion.answer"],
    keywords: mergeFaqSearchKeywords(
      animals.bats,
      situations.baby,
      situations.location,
      situations.contact,
      [
        "murciélago refugio",
        "murcielago refugio",
        "murciélago colonia",
        "murcielago colonia",
        "refugio",
        "colonia",
        "madre",
        "reunificar",
        "reunificación",
        "reunificacion",
        "atardecer",
        "anochecer",
        "grieta",
        "persiana",
        "tejado",
        "excrementos",
      ],
    ),
    showCreateNotice: true,
  },
  {
    id: "murcielago-mordedura",
    category: "Manipulación y cuidados",
    question: faqContent["murcielago-mordedura.question"],
    answer:
      faqContent["murcielago-mordedura.answer"],
    keywords: mergeFaqSearchKeywords(
      animals.bats,
      situations.injured,
      situations.contact,
      ["mordedura", "mordido", "mordida", "muerde", "rabia", "hospital", "urgencias", "agua y jabón", "agua y jabon", "antiséptico", "antiseptico"],
    ),
    showCreateNotice: true,
  },
  {
    id: "murcielago-gato",
    category: "Animales heridos o atrapados",
    question: faqContent["murcielago-gato.question"],
    answer:
      faqContent["murcielago-gato.answer"],
    keywords: mergeFaqSearchKeywords(
      animals.bats,
      situations.injured,
      situations.contact,
      ["gato", "capturado", "capturada", "boca", "depredador", "mascota"],
    ),
    showCreateNotice: true,
  },
  {
    id: "ave-no-puede-volar",
    category: "Animales heridos o atrapados",
    question: faqContent["ave-no-puede-volar.question"],
    answer:
      faqContent["ave-no-puede-volar.answer"],
    keywords: mergeFaqSearchKeywords(animals.birds, situations.baby, situations.injured, [
      "ala",
      "no vuela",
      "vuelo",
      "plumaje",
      "postura",
    ]),
    showCreateNotice: true,
  },
  {
    id: "lanzar-vencejo",
    category: "Manipulación y cuidados",
    question: faqContent["lanzar-vencejo.question"],
    answer:
      faqContent["lanzar-vencejo.answer"],
    keywords: mergeFaqSearchKeywords(situations.injured, [
      "vencejo",
      "vencejos",
      "lanzar",
      "lanzarlo",
      "tirar",
      "vuelo",
      "volar",
      "vencejo volar",
    ]),
    showCreateNotice: true,
  },
  {
    id: "prueba-vuelo-vencejo",
    category: "Manipulación y cuidados",
    question: faqContent["prueba-vuelo-vencejo.question"],
    answer:
      faqContent["prueba-vuelo-vencejo.answer"],
    keywords: mergeFaqSearchKeywords(situations.injured, [
      "vencejo",
      "vencejos",
      "prueba de vuelo",
      "vencejo volar",
      "palma",
      "plumaje",
      "cañones",
      "canones",
      "cañón",
      "canon",
      "plumas rotas",
    ]),
    showCreateNotice: true,
  },
  {
    id: "agua-comida-vencejo",
    category: "Manipulación y cuidados",
    question: faqContent["agua-comida-vencejo.question"],
    answer:
      faqContent["agua-comida-vencejo.answer"],
    keywords: mergeFaqSearchKeywords(situations.feeding, situations.hydration, [
      "vencejo",
      "vencejos",
      "agua",
      "vencejo agua",
      "dar agua vencejo",
      "vencejo comida",
      "hidratar",
      "pico",
      "plumaje",
    ]),
    showCreateNotice: true,
  },
  {
    id: "caja-vencejo",
    category: "Manipulación y cuidados",
    question: faqContent["caja-vencejo.question"],
    answer:
      faqContent["caja-vencejo.answer"],
    keywords: mergeFaqSearchKeywords(situations.transport, situations.stress, [
      "vencejo",
      "vencejos",
      "caja",
      "cartón",
      "carton",
      "jaula",
      "estrés",
      "estres",
      "balcón",
      "balcon",
    ]),
    showCreateNotice: true,
  },
  {
    id: "debo-tocarlo",
    category: "Manipulación y cuidados",
    question: faqContent["debo-tocarlo.question"],
    answer:
      faqContent["debo-tocarlo.answer"],
    keywords: mergeFaqSearchKeywords(
      ...allWildlifeSearchGroups,
      situations.injured,
      situations.trapped,
      situations.stress,
      ["tocar", "coger", "manipular", "guantes", "mordedura", "arañazo"],
    ),
    showCreateNotice: true,
  },
  {
    id: "comida-o-agua",
    category: "Manipulación y cuidados",
    question: faqContent["comida-o-agua.question"],
    answer:
      faqContent["comida-o-agua.answer"],
    keywords: mergeFaqSearchKeywords(
      ...allWildlifeSearchGroups,
      situations.feeding,
      situations.hydration,
      ["alimentación", "alimentacion", "líquidos", "liquidos"],
    ),
  },
  {
    id: "como-transportarlo",
    category: "Manipulación y cuidados",
    question: faqContent["como-transportarlo.question"],
    answer:
      faqContent["como-transportarlo.answer"],
    keywords: mergeFaqSearchKeywords(
      ...allWildlifeSearchGroups,
      situations.transport,
      situations.injured,
      ["animal grande", "animal pequeño", "animal pequeno", "contener"],
    ),
    showCreateNotice: true,
  },
  {
    id: "llevarmelo-a-casa",
    category: "Manipulación y cuidados",
    question: faqContent["llevarmelo-a-casa.question"],
    answer:
      faqContent["llevarmelo-a-casa.answer"],
    keywords: mergeFaqSearchKeywords(
      ...allWildlifeSearchGroups,
      situations.contact,
      situations.transport,
      ["casa", "quedármelo", "quedarmelo", "mascota", "adoptar", "retener"],
    ),
    showCreateNotice: true,
  },
  {
    id: "caja-o-jaula",
    category: "Manipulación y cuidados",
    question: faqContent["caja-o-jaula.question"],
    answer:
      faqContent["caja-o-jaula.answer"],
    keywords: mergeFaqSearchKeywords(
      ...transportableSmallWildlifeSearchGroups,
      smallMammalTransportSearchTerms,
      situations.transport,
      ["ventilada", "resistente"],
    ),
    showCreateNotice: true,
  },
  {
    id: "tamano-caja",
    category: "Manipulación y cuidados",
    question: faqContent["tamano-caja.question"],
    answer:
      faqContent["tamano-caja.answer"],
    keywords: mergeFaqSearchKeywords(
      ...transportableSmallWildlifeSearchGroups,
      smallMammalTransportSearchTerms,
      situations.transport,
      [
      "tamaño",
      "tamano",
      "espacio",
      "animal grande",
      "animal pequeño",
      "animal pequeno",
    ],
    ),
    showCreateNotice: true,
  },
  {
    id: "reducir-estres",
    category: "Manipulación y cuidados",
    question: faqContent["reducir-estres.question"],
    answer:
      faqContent["reducir-estres.answer"],
    keywords: mergeFaqSearchKeywords(
      animals.birds,
      animals.mammals,
      animals.bats,
      animals.reptiles,
      situations.stress,
      [
      "temperatura",
      "respiración",
      "respiracion",
      "tela",
    ],
    ),
    showCreateNotice: true,
  },
  {
    id: "por-que-no-comida-agua",
    category: "Manipulación y cuidados",
    question: faqContent["por-que-no-comida-agua.question"],
    answer:
      faqContent["por-que-no-comida-agua.answer"],
    keywords: mergeFaqSearchKeywords(
      ...allWildlifeSearchGroups,
      situations.feeding,
      situations.hydration,
      ["alimentación", "alimentacion", "líquidos", "liquidos"],
    ),
  },
  {
    id: "cuando-llamar-112",
    category: "Contacto y emergencias",
    question: faqContent["cuando-llamar-112.question"],
    answer:
      faqContent["cuando-llamar-112.answer"],
    keywords: mergeFaqSearchKeywords(
      ...allWildlifeSearchGroups,
      situations.contact,
      situations.injured,
      situations.location,
      ["tráfico", "trafico", "carretera", "persona", "riesgo", "animal grande"],
    ),
    showCreateNotice: true,
    showRecoveryCenters: true,
  },
  {
    id: "nidos-vencejo-obras",
    category: "Contacto y emergencias",
    question: faqContent["nidos-vencejo-obras.question"],
    answer:
      faqContent["nidos-vencejo-obras.answer"],
    keywords: mergeFaqSearchKeywords(situations.baby, situations.contact, [
      "vencejo",
      "vencejos",
      "nido",
      "nidos",
      "vencejo nido",
      "obra",
      "obras",
      "vencejo obra",
      "fachada",
      "tejado",
      "hueco",
      "rendija",
      "mechinal",
      "alero",
      "colonia",
      "nido activo",
      "bloquear",
      "rehabilitación",
      "rehabilitacion",
      "reforma",
      "andamio",
    ]),
    showRecoveryCenters: true,
  },
  {
    id: "con-quien-contactar",
    category: "Contacto y emergencias",
    question: faqContent["con-quien-contactar.question"],
    answer:
      faqContent["con-quien-contactar.answer"],
    keywords: mergeFaqSearchKeywords(
      ...allWildlifeSearchGroups,
      situations.contact,
      situations.trackingDevice,
      ["comunicar", "información", "informacion"],
    ),
    showCreateNotice: true,
    showRecoveryCenters: true,
  },
  {
    id: "informacion-a-facilitar",
    category: "Contacto y emergencias",
    question: faqContent["informacion-a-facilitar.question"],
    answer:
      faqContent["informacion-a-facilitar.answer"],
    keywords: mergeFaqSearchKeywords(
      ...allWildlifeSearchGroups,
      situations.injured,
      situations.trapped,
      situations.location,
      situations.trackingDevice,
      ["información", "informacion", "datos", "especie", "foto", "vídeo", "video"],
    ),
    showCreateNotice: true,
    showRecoveryCenters: true,
  },
  {
    id: "permanecer-junto-animal",
    category: "Contacto y emergencias",
    question: faqContent["permanecer-junto-animal.question"],
    answer:
      faqContent["permanecer-junto-animal.answer"],
    keywords: mergeFaqSearchKeywords(
      ...allWildlifeSearchGroups,
      situations.contact,
      situations.location,
      [
      "esperar",
      "quedarse",
      "permanecer",
      "no perder de vista",
    ],
    ),
    showCreateNotice: true,
  },
  {
    id: "importancia-ubicacion",
    category: "Contacto y emergencias",
    question: faqContent["importancia-ubicacion.question"],
    answer:
      faqContent["importancia-ubicacion.answer"],
    keywords: mergeFaqSearchKeywords(
      ...allWildlifeSearchGroups,
      situations.location,
      situations.contact,
      ["geolocalización", "geolocalizacion", "lugar"],
    ),
  },
  {
    id: "servicio-oficial",
    category: "La aplicación",
    question: faqContent["servicio-oficial.question"],
    answer:
      faqContent["servicio-oficial.answer"],
    keywords: mergeFaqSearchKeywords(situations.contact, [
      "oficial",
      "administración",
      "administracion",
      "independiente",
    ]),
  },
  {
    id: "sustituye-emergencias",
    category: "La aplicación",
    question:
      faqContent["sustituye-emergencias.question"],
    answer:
      faqContent["sustituye-emergencias.answer"],
    keywords: mergeFaqSearchKeywords(situations.contact, [
      "sustituye",
      "profesional",
      "valoración",
      "valoracion",
      "aplicación",
      "aplicacion",
    ]),
  },
  {
    id: "funciona-sin-conexion",
    category: "La aplicación",
    question: faqContent["funciona-sin-conexion.question"],
    answer:
      faqContent["funciona-sin-conexion.answer"],
    keywords: mergeFaqSearchKeywords(situations.location, [
      "sin conexión",
      "sin conexion",
      "offline",
      "internet",
      "mapas",
      "mapa",
      "recursos",
      "instalada",
    ]),
  },
  {
    id: "donde-se-guardan-datos",
    category: "La aplicación",
    question: faqContent["donde-se-guardan-datos.question"],
    answer:
      faqContent["donde-se-guardan-datos.answer"],
    keywords: mergeFaqSearchKeywords([
      "datos",
      "privacidad",
      "local",
      "dispositivo",
      "historial",
      "resumen",
      "almacenamiento",
      "servidores",
    ]),
  },
  {
    id: "fotos-y-videos",
    category: "La aplicación",
    question: faqContent["fotos-y-videos.question"],
    answer:
      faqContent["fotos-y-videos.answer"],
    keywords: mergeFaqSearchKeywords(situations.location, [
      "foto",
      "fotografía",
      "fotografia",
      "vídeo",
      "video",
      "galería",
      "galeria",
      "WhatsApp",
      "adjuntar",
      "compartir",
    ]),
  },
  {
    id: "recuperar-aviso",
    category: "La aplicación",
    question: faqContent["recuperar-aviso.question"],
    answer:
      faqContent["recuperar-aviso.answer"],
    keywords: mergeFaqSearchKeywords([
      "recuperar",
      "aviso",
      "sin finalizar",
      "historial",
      "continuar",
      "retomar",
      "datos locales",
      "borrado",
    ]),
  },
  {
    id: "consultar-avisos-anteriores",
    category: "La aplicación",
    question: faqContent["consultar-avisos-anteriores.question"],
    answer:
      faqContent["consultar-avisos-anteriores.answer"],
    keywords: mergeFaqSearchKeywords([
      "historial",
      "histórico",
      "historico",
      "avisos anteriores",
      "registros",
      "resumen",
      "recuperar",
      "guardados",
    ]),
  },
];

export type LocalizedFaqItem = FaqItem & { categoryId: FaqCategoryId; categoryLabel: string };
const localizedFaqItems = new Map<Locale, LocalizedFaqItem[]>();
export function getFaqItemsForLocale(requested: Locale = DEFAULT_LOCALE): LocalizedFaqItem[] {
  const locale = getFaqSearchVocabulary(requested).locale;
  const cached = localizedFaqItems.get(locale);
  if (cached) return cached;
  const texts = getEffectiveCatalog(locale);
  const copy = texts.faqContent;
  const items = faqItems.map(item => {
    const categoryId = getFaqCategoryId(item.category);
    return { ...item, categoryId, categoryLabel: getFaqCategoryLabel(categoryId, locale),
      keywords: locale === DEFAULT_LOCALE ? item.keywords : getEnglishFaqKeywords(item.keywords ?? [], texts),
      question: locale === DEFAULT_LOCALE ? item.question : (copy[(item.id + ".question") as keyof typeof copy] ?? item.question),
      answer: locale === DEFAULT_LOCALE ? item.answer : (copy[(item.id + ".answer") as keyof typeof copy] ?? item.answer) };
  });
  localizedFaqItems.set(locale, items);
  return items;
}
