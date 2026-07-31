import {
  FAQ_SEARCH_GROUPS,
  mergeFaqSearchKeywords,
} from "./faqSearchKeywords";

/*
Para añadir una FAQ:
1. Copia uno de los bloques existentes.
2. Usa un id único, en minúsculas y sin espacios.
3. Elige una de las categorías permitidas.
4. Edita question y answer.

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

const allWildlifeSearchGroups = [
  animals.birds,
  animals.mammals,
  animals.bats,
  animals.reptiles,
  animals.amphibians,
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
  "La aplicación",
];

export const faqItems: FaqItem[] = [
  {
    id: "vencejo-en-suelo",
    category: "Antes de actuar",
    question: "¿Qué hago si encuentro un vencejo en el suelo?",
    answer:
      "Recógelo con cuidado, mételo en una caja de cartón ventilada con papel de cocina en el fondo y déjalo en un lugar tranquilo, protegido del calor y de animales domésticos. Contacta cuanto antes con un centro especializado, Agentes Forestales o Medioambientales.",
    keywords: mergeFaqSearchKeywords(animals.birds, situations.contact, situations.transport, [
      "vencejo",
      "vencejos",
      "suelo",
      "caja",
      "papel de cocina",
    ]),
    showCreateNotice: true,
  },
  {
    id: "cuando-ayudar-vencejo",
    category: "Antes de actuar",
    question: "¿Cuándo necesita ayuda un vencejo?",
    answer:
      "Necesita ayuda si está en el suelo, ha caído de un nido, tiene sangre o heridas, un ala caída, está muy débil, respira con dificultad, ha chocado contra un cristal, ha estado en contacto con un gato o no consigue mantener el vuelo.",
    keywords: mergeFaqSearchKeywords(animals.birds, situations.injured, situations.baby, [
      "vencejo",
      "vencejos",
      "cristal",
      "ventana",
      "gato",
      "no vuela",
    ]),
    showCreateNotice: true,
  },
  {
    id: "que-hacer-si-encuentro-animal",
    category: "Antes de actuar",
    question: "¿Qué debo hacer si encuentro un animal silvestre?",
    answer:
      "Observa primero desde una distancia prudente, evita ruidos y mantén alejadas a personas y animales domésticos. Valora si hay peligro inmediato y contacta con un centro especializado, agentes medioambientales o emergencias si no sabes cómo actuar.",
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
    question: "¿Ayudar siempre significa recoger al animal?",
    answer:
      "No. En muchos casos ayudar significa observar, reducir riesgos, avisar al servicio adecuado o dejar al animal donde está. Recogerlo sin necesidad puede separarlo de sus padres, aumentar su estrés o dificultar su recuperación.",
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
    question: "¿Cómo sé si realmente necesita ayuda?",
    answer:
      "Puede necesitar ayuda si presenta heridas, sangrado, debilidad marcada, dificultad para moverse, atrapamiento, riesgo por tráfico o ataque de otro animal. Si tienes dudas razonables, pide orientación antes de manipularlo.",
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
    question: "¿Debo dejar un vencejo en el suelo para que sus padres lo atiendan?",
    answer:
      "No. Los padres no bajarán al suelo para alimentar a un pollo de vencejo caído del nido. Un vencejo joven encontrado en el suelo debe recogerse y recibir valoración.",
    keywords: mergeFaqSearchKeywords(animals.birds, situations.baby, situations.contact, [
      "vencejo",
      "vencejos",
      "padres",
      "suelo",
      "caído del nido",
      "caido del nido",
    ]),
    showCreateNotice: true,
  },
  {
    id: "que-hacer-si-encuentro-cria",
    category: "Crías y animales jóvenes",
    question: "¿Qué debo hacer si encuentro una cría?",
    answer:
      "No la recojas automáticamente. Observa si está herida, en peligro o expuesta. Muchas crías están atendidas por sus padres aunque parezcan solas. En vencejos caídos del nido, los padres no bajan al suelo a alimentarlos. Si hay riesgo real o dudas, contacta con un centro de recuperación o con el servicio competente.",
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
    question: "¿Cómo distingo un pollo de un volantón?",
    answer:
      "Un pollo suele tener poco plumaje o plumón visible y normalmente debería estar en el nido. Un volantón está más emplumado, puede saltar o moverse por el suelo y sus padres suelen seguir alimentándolo mientras aprende. Esta pauta no se aplica a vencejos: un vencejo en el suelo debe recogerse y valorarse.",
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
    question: "¿Debo alejar una cría de sus padres?",
    answer:
      "Solo si existe un peligro inmediato, como tráfico, depredadores domésticos o una zona insegura. Siempre que sea posible, mantenla cerca del lugar donde fue encontrada para no romper el vínculo con los adultos. En vencejos encontrados en el suelo, protégelos en una caja ventilada y consulta cuanto antes.",
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
    question: "Me han indicado que lo hidrate, ¿cómo debo hacerlo?",
    answer:
      "Solo debe hacerse siguiendo exactamente las instrucciones de un centro especializado o profesional. No introduzcas agua directamente en el pico o la boca ni fuerces al animal a beber. Si las indicaciones no están claras, vuelve a contactar antes de actuar.",
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
    id: "leche-a-cria",
    category: "Crías y animales jóvenes",
    question: "¿Puedo darle leche a una cría?",
    answer:
      "No le des leche salvo que un especialista te lo indique expresamente para esa especie. Muchos animales silvestres no pueden digerirla adecuadamente y podría empeorar su estado.",
    keywords: mergeFaqSearchKeywords(animals.mammals, situations.baby, situations.feeding, [
      "leche",
      "biberón",
      "biberon",
      "recién nacido",
      "recien nacido",
      "cachorro",
    ]),
  },
  {
    id: "vencejo-gato",
    category: "Animales heridos o atrapados",
    question: "¿Qué hago si un gato ha tocado un vencejo?",
    answer:
      "Recógelo, mantenlo en una caja y no lo liberes directamente. Aunque no veas heridas, necesita valoración cuanto antes por un centro especializado.",
    keywords: mergeFaqSearchKeywords(animals.birds, situations.injured, situations.contact, [
      "vencejo",
      "vencejos",
      "gato",
      "boca",
      "patas",
    ]),
    showCreateNotice: true,
  },
  {
    id: "vencejo-cristal",
    category: "Animales heridos o atrapados",
    question: "¿Qué hago si un vencejo ha chocado contra un cristal?",
    answer:
      "No lo lances al aire para comprobar si vuela. Protégelo en una caja tranquila y consulta con un centro especializado, porque puede tener lesiones aunque parezca recuperarse.",
    keywords: mergeFaqSearchKeywords(animals.birds, situations.injured, situations.contact, [
      "vencejo",
      "vencejos",
      "cristal",
      "ventana",
      "colisión",
      "colision",
      "aturdido",
    ]),
    showCreateNotice: true,
  },
  {
    id: "animal-herido",
    category: "Animales heridos o atrapados",
    question: "¿Qué hago si el animal está herido?",
    answer:
      "Evita manipularlo salvo que sea necesario para apartarlo de un peligro inmediato. Mantén alejadas a personas y mascotas, reduce el ruido y no le des comida ni agua. Contacta con un centro de recuperación, Agentes Forestales o Emergencias según la situación.",
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
    question: "¿Qué hago si está atrapado?",
    answer:
      "No tires del animal ni fuerces alas, patas, cuello o cola. Observa el tipo de atrapamiento, valora tu seguridad y pide ayuda especializada. Si puedes aportar fotos o vídeos sin molestar, pueden ayudar a valorar la intervención.",
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
    question: "¿Qué hago si no puede volar?",
    answer:
      "Puede tratarse de un volantón, un animal debilitado o un ejemplar lesionado. Observa si hay heridas, peligro o comportamiento anómalo. En vencejos, estar en el suelo o no mantener el vuelo requiere recogida y valoración. No lances al animal al aire para comprobar si vuela.",
    keywords: mergeFaqSearchKeywords(animals.birds, situations.injured, situations.baby, [
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
    question: "¿Qué hago si parece muerto?",
    answer:
      "No lo manipules sin necesidad. Si está en una vía o supone un riesgo, avisa al servicio competente. En caso de especies protegidas, atropellos, venenos o sospecha de delito ambiental, contacta con agentes medioambientales, SEPRONA o emergencias.",
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
    question: "¿Qué hago si encuentro un murciélago?",
    answer:
      "Evita tocarlo directamente y mantén alejadas a personas y mascotas. Observa si es una cría, un adulto, está atrapado, herido o en un lugar peligroso. Si debes manipularlo siguiendo indicaciones, utiliza guantes adecuados o una toalla y contacta con un centro especializado.",
    keywords: mergeFaqSearchKeywords(
      animals.bats,
      situations.baby,
      situations.injured,
      situations.trapped,
      situations.contact,
      situations.stress,
      ["pared", "suelo", "balcón", "balcon", "guantes", "toalla"],
    ),
    showCreateNotice: true,
  },
  {
    id: "ave-no-puede-volar",
    category: "Animales heridos o atrapados",
    question: "¿Qué hago si encuentro un ave que no puede volar?",
    answer:
      "No siempre significa que esté herida: puede tratarse de un volantón. Observa el plumaje, la postura, la presencia de los padres y posibles signos visibles de lesión antes de intervenir. En vencejos, no lo dejes en el suelo ni lo lances al aire: protégelo y consulta con un centro especializado.",
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
    question: "¿Puedo lanzar un vencejo al aire para ver si vuela?",
    answer:
      "No. Si está débil, lesionado o todavía no está preparado, puede caer y sufrir más daños. Una prueba de vuelo no consiste en lanzar al animal.",
    keywords: mergeFaqSearchKeywords(animals.birds, situations.injured, [
      "vencejo",
      "vencejos",
      "lanzar",
      "lanzarlo",
      "tirar",
      "vuelo",
    ]),
    showCreateNotice: true,
  },
  {
    id: "prueba-vuelo-vencejo",
    category: "Manipulación y cuidados",
    question: "¿Cómo se hace una prueba de vuelo con un vencejo?",
    answer:
      "Solo debe plantearse si no hay lesiones, muestra buen estado general y el plumaje está completamente desarrollado. Se coloca sobre la palma abierta y debe despegar por sí mismo. Si se aferra, cae o no mantiene el vuelo, recógelo y solicita ayuda especializada.",
    keywords: mergeFaqSearchKeywords(animals.birds, situations.injured, [
      "vencejo",
      "vencejos",
      "prueba de vuelo",
      "palma",
      "plumaje",
      "cañones",
      "canones",
    ]),
    showCreateNotice: true,
  },
  {
    id: "agua-comida-vencejo",
    category: "Manipulación y cuidados",
    question: "¿Puedo darle agua o comida a un vencejo?",
    answer:
      "No introduzcas agua directamente en el pico y no le des pan, leche, carne ni pienso. Para una atención inicial breve, es más seguro mantenerlo tranquilo y pedir ayuda que improvisar comida o hidratación.",
    keywords: mergeFaqSearchKeywords(animals.birds, situations.feeding, situations.hydration, [
      "vencejo",
      "vencejos",
      "agua",
      "pan",
      "leche",
      "carne",
      "pienso",
      "hidratar",
    ]),
    showCreateNotice: true,
  },
  {
    id: "caja-vencejo",
    category: "Manipulación y cuidados",
    question: "¿Por qué es importante meter al vencejo en una caja?",
    answer:
      "La caja reduce el estrés, evita que se golpee intentando escapar y permite mantenerlo protegido hasta recibir indicaciones. Debe ser de cartón, estar ventilada y no dejar espacio para intentar volar dentro.",
    keywords: mergeFaqSearchKeywords(animals.birds, situations.transport, situations.stress, [
      "vencejo",
      "vencejos",
      "caja",
      "cartón",
      "carton",
      "jaula",
      "estrés",
      "estres",
    ]),
    showCreateNotice: true,
  },
  {
    id: "debo-tocarlo",
    category: "Manipulación y cuidados",
    question: "¿Debo tocarlo o cogerlo?",
    answer:
      "Solo si te lo indican los especialistas o si es imprescindible para apartarlo de un peligro inmediato y puedes hacerlo sin riesgo. Utiliza guantes o una tela cuando sea necesario, evita el contacto directo y manipúlalo lo mínimo posible. Algunas especies pueden morder, arañar o sufrir más estrés al ser sujetadas.",
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
    question: "¿Puedo darle comida o agua?",
    answer:
      "No le des comida ni agua sin indicación especializada. Una alimentación incorrecta, líquidos administrados a la fuerza o ciertos alimentos pueden empeorar su estado.",
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
    question: "¿Cómo debo transportarlo?",
    answer:
      "Si te indican trasladarlo, sigue las instrucciones recibidas, porque el recipiente y la forma de transporte dependen de la especie, el tamaño y su estado. Para muchas aves y pequeños animales puede utilizarse una caja de cartón ventilada y bien cerrada, pero no es adecuada para todos los casos. No intentes transportar por tus medios animales grandes, peligrosos o que no puedas contener con seguridad.",
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
    question: "¿Puedo llevármelo a casa?",
    answer:
      "No debe mantenerse fauna silvestre en casa salvo indicación temporal de un servicio competente. Lo adecuado es contactar cuanto antes con profesionales o autoridades que puedan hacerse cargo del caso.",
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
    question: "¿Es mejor una caja de cartón o una jaula?",
    answer:
      "Para un traslado provisional suele ser preferible una caja de cartón resistente, ventilada, cerrada y adaptada al tamaño del animal. Una jaula puede favorecer golpes, enganches o intentos continuos de escapar. Dependerá de la especie y de las indicaciones recibidas.",
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
    question: "¿Qué tamaño debe tener la caja?",
    answer:
      "Debe permitir que el animal permanezca en una postura natural y pueda acomodarse, pero no ser tan grande como para que se desplace o se golpee durante el traslado. Debe estar bien ventilada y cerrada con seguridad.",
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
    question: "¿Cómo puedo reducir el estrés de un animal silvestre?",
    answer:
      "Conviene reducir ruido, luz, manipulación, personas alrededor y contacto con mascotas. Mantén al animal en un lugar tranquilo, seguro, oscuro o con poca luz y con temperatura moderada mientras sigues las indicaciones recibidas. Si un profesional te indica cubrir parcialmente al animal, utiliza una tela ligera y asegúrate de no dificultar su respiración ni aumentar su temperatura. No lo intentes con animales grandes, peligrosos o que no puedas manipular con seguridad.",
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
    question: "¿Por qué no debo darle comida o agua sin indicación especializada?",
    answer:
      "Las necesidades varían según la especie, la edad y el estado del animal. Una alimentación incorrecta o administrar líquidos de forma inadecuada puede empeorar la situación.",
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
    question: "¿Cuándo debo llamar al 112?",
    answer:
      "Llama al 112 si hay peligro para personas, tráfico, fuego, riesgo sanitario, un animal grande en zona urbana o carretera, o si no sabes qué organismo es competente en tu zona.",
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
    id: "nidos-vencejo-edificios",
    category: "Contacto y emergencias",
    question: "¿Los vencejos hacen nidos en edificios?",
    answer:
      "Sí. En España suelen criar en huecos de edificios y muchas parejas regresan cada año al mismo nido. Si hay actividad de vencejos en un hueco, conviene no bloquearlo y consultar con la autoridad ambiental competente.",
    keywords: mergeFaqSearchKeywords(animals.birds, situations.baby, situations.contact, [
      "vencejo",
      "vencejos",
      "nido",
      "nidos",
      "edificio",
      "fachada",
      "tejado",
      "hueco",
      "alero",
    ]),
    showRecoveryCenters: true,
  },
  {
    id: "nidos-vencejo-obras",
    category: "Contacto y emergencias",
    question: "¿Qué hago si una obra afecta a un nido de vencejo?",
    answer:
      "No retires el nido ni bloquees la entrada al hueco. Si puedes hacerlo con seguridad, documenta la situación, la ubicación y si hay adultos entrando, huevos o pollos. Contacta con Agentes Forestales, Medioambientales o la autoridad ambiental competente.",
    keywords: mergeFaqSearchKeywords(animals.birds, situations.baby, situations.contact, [
      "vencejo",
      "vencejos",
      "obra",
      "obras",
      "fachada",
      "tejado",
      "hueco",
      "colonia",
      "nido activo",
      "bloquear",
    ]),
    showRecoveryCenters: true,
  },
  {
    id: "con-quien-contactar",
    category: "Contacto y emergencias",
    question: "¿Con quién debo contactar?",
    answer:
      "Según el caso y el territorio, puede corresponder a un centro de recuperación de fauna, agentes forestales o medioambientales, policía local, SEPRONA o emergencias. Conviene preparar la información básica del caso para comunicarla con claridad.",
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
    question: "¿Qué información debo facilitar?",
    answer:
      "Indica especie o tipo de animal si lo sabes, estado aparente, señales observadas, ubicación precisa, riesgos cercanos y si tienes fotos o vídeos. También conviene explicar qué has hecho ya y si el animal sigue en el lugar.",
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
    question: "¿Debo permanecer junto al animal después de pedir ayuda?",
    answer:
      "Permanece a una distancia segura desde la que puedas localizar al animal y facilitar su posición, siempre que hacerlo no suponga ningún riesgo. No lo pierdas de vista hasta recibir indicaciones o hasta que lleguen los servicios movilizados.",
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
    question: "¿Por qué es importante compartir la ubicación?",
    answer:
      "La ubicación permite valorar la urgencia, encontrar el punto del hallazgo y derivar el aviso al recurso adecuado. Las coordenadas suelen ser más precisas que una descripción verbal del lugar.",
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
    question: "¿SOS Fauna España es un servicio oficial?",
    answer:
      "No. SOS Fauna España es un proyecto independiente de orientación. No representa a administraciones públicas, servicios de emergencias, cuerpos policiales ni centros de recuperación.",
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
      "¿La aplicación sustituye a un centro de recuperación o a Emergencias?",
    answer:
      "No. La aplicación ofrece orientación y ayuda a preparar un aviso, pero no sustituye la valoración de profesionales ni la intervención de servicios oficiales o de emergencia.",
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
    question: "¿Funciona sin conexión?",
    answer:
      "Algunas funciones y contenidos pueden seguir disponibles sin conexión si se han cargado anteriormente o si SOS Fauna España está instalada en el dispositivo. Los mapas, el envío de información y algunos recursos externos pueden necesitar conexión.",
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
    question: "¿Dónde se guardan mis datos?",
    answer:
      "Los datos del aviso se guardan localmente en tu dispositivo cuando es necesario para recuperar un aviso, mantener historial o preparar el resumen. No se envían automáticamente a servidores propios de SOS Fauna España.",
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
    question: "¿Qué ocurre con las fotos y los vídeos?",
    answer:
      "Las fotos y vídeos se usan para preparar el aviso y pueden guardarse localmente o en la galería si eliges hacerlo. No se adjuntan automáticamente a mensajes: debes compartirlos manualmente si lo consideras necesario.",
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
    question: "¿Puedo recuperar un aviso sin finalizar?",
    answer:
      "Sí. La aplicación puede conservar avisos no finalizados en el dispositivo para que puedas retomarlos más tarde, siempre que no borres los datos locales o el historial correspondiente.",
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
    question: "¿Puedo consultar mis avisos anteriores?",
    answer:
      "Sí. La sección Historial permite consultar los avisos guardados recientemente y volver a copiar su resumen. Los avisos se conservan en el dispositivo utilizado y pueden desaparecer si se eliminan los datos del navegador o de la aplicación.",
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
