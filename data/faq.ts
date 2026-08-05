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
    question: "El vencejo parece sano pero no vuela, ¿qué hago?",
    answer:
      "No lo lances ni lo obligues a volar. Un adulto sano puede despegar desde una superficie adecuada o desde la palma de una mano, pero si un vencejo está en el suelo o no inicia o mantiene el vuelo puede haber debilidad, deshidratación, traumatismo, lesión, enfermedad, agotamiento o aturdimiento tras una colisión. Protégelo en una caja de cartón ventilada y pide valoración especializada.",
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
    question: "¿Qué señales indican que un vencejo necesita atención urgente?",
    answer:
      "Necesita ayuda si está en el suelo, ha caído de un nido, permanece inmóvil, se deja recoger sin intentar escapar, tiene un ala caída o las alas asimétricas, presenta sangre o heridas, respira con dificultad, mantiene los ojos cerrados o semicerrados, parece muy débil, no mantiene una postura normal, muestra temblores o falta de coordinación, ha sido atrapado por un gato, ha chocado contra una ventana, está mojado o contaminado, ha quedado atrapado o no puede iniciar o mantener el vuelo.",
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
    question: "¿Qué hago si es un pollo de vencejo caído del nido?",
    answer:
      "Si un pollo de vencejo aparece fuera del nido necesita ayuda. Puede tener plumón, plumas todavía dentro de sus cañones, alas sin desarrollar del todo, cola corta o musculatura insuficiente para volar. Recógelo con cuidado, protégelo en una caja de cartón ventilada y contacta cuanto antes con un centro especializado o con Agentes Forestales o Medioambientales.",
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
    question: "¿Qué hago si un vencejo está atrapado?",
    answer:
      "No tires del animal ni fuerces alas, patas, plumas o articulaciones. Observa el tipo de atrapamiento sin ponerte en riesgo, haz fotos si puedes hacerlo sin causar más estrés y pide ayuda especializada. Si consigues liberarlo siguiendo indicaciones, mantenlo después en una caja de cartón ventilada y comunica exactamente qué ha ocurrido.",
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
    question: "¿Qué hago si un vencejo ha caído en una chimenea, extractor u otra estructura?",
    answer:
      "Trátalo como un atrapamiento que requiere valoración. No tires de él ni intentes sacarlo forzando alas o plumas. Si puedes documentar la situación sin riesgo, hazlo, y contacta con un centro especializado, Agentes Forestales o Medioambientales o emergencias si hace falta una intervención segura.",
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
    question: "¿Qué hago si el vencejo está mojado o manchado de aceite, hollín u otra sustancia?",
    answer:
      "Recógelo y mantenlo en una caja de cartón ventilada. No improvises limpiezas, comida, agua ni liberación. Comunica al centro o a los agentes si estaba mojado, si cayó en agua sucia o si tenía aceite, hollín u otras sustancias, porque esa información puede ayudar a valorar el caso.",
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
    question: "¿Dónde debo dejar al vencejo mientras consigo ayuda?",
    answer:
      "Déjalo dentro de una caja de cartón ventilada, cerrada con seguridad y con papel de cocina limpio en el fondo. Coloca la caja de cartón en un lugar tranquilo, sin ruidos, protegido de animales domésticos, sin exposición directa al sol, sin calor excesivo y sin corrientes de aire. Manipúlalo lo mínimo indispensable.",
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
    question: "¿Es mejor una caja de cartón o una jaula para un vencejo?",
    answer:
      "Para la custodia temporal utiliza una caja de cartón ventilada. No lo mantengas en una jaula: puede golpearse, engancharse o intentar escapar de forma repetida. La caja de cartón debe tener ventilación, estar bien cerrada, permitir que permanezca cómodo y no darle espacio para intentar volar y lesionarse.",
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
    question: "¿Qué pongo en el fondo de la caja de cartón?",
    answer:
      "Pon papel de cocina limpio en el fondo. Además de mantener una superficie sencilla e higiénica, la caja de cartón puede aportar información útil: excrementos, sangre, restos de comida o parásitos deben comunicarse al centro, pero no conviene interpretarlos como un diagnóstico sin valoración especializada.",
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
    question: "¿Cuánto debo manipular a un vencejo recogido?",
    answer:
      "Lo mínimo indispensable. No le abras las alas a la fuerza, no tires de las plumas, no explores la garganta, no fuerces articulaciones ni intentes comprobar fracturas. Una persona sin formación debe limitarse a observaciones visibles y a mantenerlo protegido hasta recibir indicaciones.",
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
    question: "¿Puedo dejar que intente volar dentro de casa?",
    answer:
      "No conviene. La caja de cartón ventilada debe ser suficientemente cómoda, pero sin espacio para que intente volar y se lesione. Tampoco debe lanzarse ni obligarse a volar en una habitación, balcón, ventana o lugar elevado.",
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
    question: "¿Qué puedo observar sin hacer una exploración clínica?",
    answer:
      "Puedes informar de si está alerta o apagado, si abre los ojos, si mantiene la cabeza erguida, si respira con el pico abierto o hace sonidos al respirar, si tiene las plumas erizadas, si las alas están simétricas o hay un ala caída, si sangra, si muestra movimientos anormales, si puede mantenerse apoyado y si responde al entorno. No hagas palpaciones ni manipulaciones invasivas.",
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
    question: "¿Qué fotos pueden ayudar a valorar el caso?",
    answer:
      "Si puedes hacerlas sin causarle más estrés, toma una foto desde arriba en la que se vea el cuerpo completo, otra de la cabeza y la cara, y alguna adicional si hay una lesión visible. Las fotos pueden ayudar al centro o a los agentes, pero no deben retrasar la protección del animal ni el contacto con ayuda especializada.",
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
    question: "¿Qué información preparo para el CRFS o los agentes?",
    answer:
      "Prepara lugar exacto, fecha y hora, si estaba en el suelo, acera, carretera o patio, si estaba mojado o manchado, si hubo gato, ventana, chimenea, extractor u obra, cuánto tiempo lleva recogido, si ha recibido comida, agua o medicamentos, si ha intentado volar y qué ocurrió. Si procede de un nido afectado por obras, indícalo para que puedan valorar otros nidos de la colonia.",
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
    question: "¿Cómo traslado temporalmente a un vencejo?",
    answer:
      "Trasládalo en una caja de cartón ventilada, cerrada con seguridad, con papel de cocina limpio en el fondo y sin espacio para que intente volar. Mantén la caja de cartón estable, tranquila, sin sol directo, sin calor excesivo, sin corrientes de aire y lejos de mascotas. Sigue siempre las indicaciones del centro o de los agentes.",
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
    question: "¿Qué hago si pasan horas y todavía no consigo contactar con un centro?",
    answer:
      "Mantén al vencejo en una caja de cartón ventilada, tranquila y protegida, sin sol directo, sin calor excesivo, sin corrientes de aire y lejos de animales domésticos. No improvises comida, agua ni medicación, no lo pongas en una jaula y no lo fuerces a volar. Sigue intentando contactar con un CRFS, Agentes Forestales o Medioambientales, una entidad especializada o emergencias si la situación lo requiere. No existe un tiempo único de espera que pueda aplicarse con seguridad.",
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
    question: "¿Puedo mantener un vencejo varios días en casa?",
    answer:
      "No debe mantenerse varios días sin solicitar ayuda especializada. La custodia ciudadana debe ser temporal y orientada a protegerlo mientras consigues contacto o traslado. No improvises una atención prolongada, alimentación, hidratación, medicación o rehabilitación en casa.",
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
    question: "¿Puedo cerrar un hueco de un edificio donde entran vencejos?",
    answer:
      "No debe bloquearse ni destruirse un nido activo ni la entrada al hueco de nidificación. Una cavidad pequeña puede ser un lugar de cría reutilizado durante años, y el vencejo muestra mucha fidelidad al edificio, la colonia y el hueco concreto. Documenta la situación si es seguro y contacta con Agentes Forestales, Medioambientales o la autoridad ambiental competente.",
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
    question: "El vencejo está aturdido o desorientado, ¿debo dejarlo descansar?",
    answer:
      "Sí debes reducir estrés y dejarlo tranquilo en una caja de cartón ventilada mientras consigues ayuda. Tras una colisión, un vencejo puede parecer aturdido y recuperarse aparentemente después de descansar, pero también puede tener traumatismos, lesiones internas, daños en alas o problemas neurológicos. No inventes una prueba por tu cuenta ni lo lances para comprobar si vuela.",
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
    question: "Después de descansar parece encontrarse mejor, ¿qué hago?",
    answer:
      "No lo lances ni des por resuelto el caso si había colisión, debilidad, caída al suelo u otra duda. Tras una colisión puede parecer que se recupera y aun así presentar lesiones internas, daños en alas o problemas neurológicos. Mantenlo protegido en una caja de cartón ventilada y consulta con un centro especializado.",
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
    question: "¿Cuándo NO debo plantear una prueba de vuelo con un vencejo?",
    answer:
      "No debe plantearse si hay cualquier sospecha de lesión o enfermedad, debilidad, dificultad respiratoria, heridas, alas asimétricas, postura anómala, plumaje incompleto, restos de cañones o dudas sobre su desarrollo. Tampoco debe usarse para averiguar si un animal dudoso está bien. Ante dudas, prevalece la valoración especializada.",
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
    question: "¿Qué significa que un vencejo no salga volando desde la mano?",
    answer:
      "Si se aferra a la mano, retrocede, cae o no mantiene el vuelo, puede no estar preparado o puede haber un problema. No debe forzarse la salida ni insistir de forma repetida. Si fracasa tras dos intentos realizados en condiciones seguras, debe interrumpirse la prueba y contactar con un centro especializado.",
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
    question: "¿Puede estar deshidratado un vencejo recogido?",
    answer:
      "Sí. La deshidratación es frecuente en pollos caídos del nido, animales expuestos al calor, ejemplares debilitados, aves que llevan tiempo sin alimentarse, animales sometidos a estrés o aves con diarrea u otras pérdidas de líquidos. La valoración correcta depende de peso, edad, temperatura corporal, grado de deshidratación y estado clínico, así que no improvises hidratación por tu cuenta.",
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
    question: "Un CRFS me ha indicado que debo hidratarlo, ¿qué debo tener en cuenta?",
    answer:
      "Hazlo solo si un CRFS o profesional te lo ha indicado de forma expresa y sigue exactamente sus instrucciones. No introduzcas agua directamente dentro del pico, no fuerces al animal a beber y no uses jeringas o goteros si no te lo han indicado claramente. Si la indicación no es precisa, vuelve a contactar antes de actuar.",
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
    question: "¿Por qué una comida incorrecta puede ser tan grave para un vencejo?",
    answer:
      "El vencejo es un insectívoro aéreo especializado. Una alimentación inadecuada puede provocar daños digestivos, crecimiento deficiente, déficits nutricionales, alteraciones musculares, deformaciones o fragilidad del plumaje, pérdida de capacidad de vuelo y menor supervivencia tras la liberación. Aunque llegue a volar al principio, un plumaje defectuoso puede impedirle superar tormentas, migrar, capturar alimento o escapar de depredadores.",
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
    question: "¿Por qué se dice que el vencejo está tan adaptado a la vida aérea?",
    answer:
      "Porque su cuerpo favorece un vuelo rápido, prolongado y eficiente: alas largas, estrechas y en forma de hoz, cuerpo aerodinámico, pico corto con boca muy ancha para capturar insectos en vuelo, patas extremadamente cortas y pies con garras para aferrarse a superficies y entrar en cavidades. Sus patas no están adaptadas para caminar normalmente por el suelo.",
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
    question: "¿Cuánto vuela un vencejo: puede pasar casi diez meses sin posarse?",
    answer:
      "En algunos ejemplares estudiados se ha registrado una fase aérea continua durante aproximadamente los diez meses situados fuera del periodo reproductor. Otros individuos pueden posarse ocasionalmente durante periodos cortos, aunque siguen pasando más del 99 % de ese tiempo en el aire. El dato procede de individuos seguidos con dispositivos y no significa que todos se comporten exactamente igual.",
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
    question: "¿Qué puede hacer un vencejo durante su vida en el aire?",
    answer:
      "Puede alimentarse en vuelo, beber agua en vuelo, descansar o dormir durante el vuelo, realizar migraciones de larga distancia, permanecer meses sin posarse y, en algunos casos, aparearse en vuelo. Durante la reproducción usa el nido para la puesta, incubación, crianza de los pollos y descanso, y la cópula puede producirse tanto en vuelo como en el nido.",
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
    question: "¿Cómo bebe agua un vencejo en vuelo?",
    answer:
      "Bebe agua mediante una maniobra precisa sobre masas de agua: desciende, reduce la velocidad antes del contacto y toca la superficie con el pico durante una pasada rasante. En una muestra de 163 maniobras reconstruidas, la velocidad media al tocar el agua fue de unos 11,7 m/s, aproximadamente 42 km/h.",
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
    question: "¿Cómo duerme un vencejo?",
    answer:
      "La vida aérea prolongada implica que el vencejo debe descansar o dormir durante el vuelo, pero el mecanismo exacto no se ha demostrado directamente mediante registros electroencefalográficos en Apus apus. El sueño unihemisférico es conocido en otras aves, pero no debe presentarse como mecanismo demostrado en el vencejo común.",
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
    question: "¿Por qué los vencejos ascienden al amanecer y al anochecer?",
    answer:
      "Durante la fase aérea prolongada se han observado ascensos alrededor del amanecer y el anochecer, que pueden alcanzar aproximadamente 2,5 kilómetros de altitud. Su función exacta no está demostrada. Se ha propuesto que podrían estar relacionados con información atmosférica, meteorológica u orientativa, pero no deben explicarse como un comportamiento cerrado ni exclusivamente asociado al sueño.",
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
    question: "¿De qué se alimenta un vencejo?",
    answer:
      "Es un insectívoro aéreo especializado. Se alimenta de pequeños organismos voladores que forman el aeroplancton, como moscas, mosquitos, hormigas voladoras, pequeños himenópteros, chinches, neurópteros y otros insectos o artrópodos pequeños. Captura el alimento en vuelo con la boca abierta a modo de colector.",
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
    question: "¿Cómo migra el vencejo entre Europa y África?",
    answer:
      "El vencejo común se reproduce en gran parte del Paleártico y en España es principalmente estival. Regresa desde África en primavera, ocupa colonias sobre todo entre abril y mayo y la mayor parte abandona las colonias entre finales de julio y agosto. Inverna principalmente en África al sur del ecuador. Los estudios con geolocalizadores muestran rutas complejas, no una única ruta simple para todos los vencejos europeos.",
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
    question: "¿Puede recorrer más de 1.000 kilómetros en un día?",
    answer:
      "Durante fases concretas de la migración primaveral se han estimado etapas superiores a 1.000 km al día. En vencejos del norte de Europa también se estimaron velocidades migratorias medias primaverales de unos 570 km/día y un máximo de 832 km/día mantenido durante nueve días. Son estimaciones de desplazamiento obtenidas con geolocalizadores, no recorridos continuos medidos por GPS.",
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
    question: "¿Cómo aprovecha el viento y cómo se orienta?",
    answer:
      "Puede modificar su dirección durante distintas etapas del viaje, ajustar sus desplazamientos a las condiciones de viento y compensar la deriva producida por el viento durante la migración. Como otras aves migratorias, probablemente combina distintas fuentes de información para orientarse, pero no se conoce con precisión qué señales sensoriales utiliza Apus apus ni cómo las integra.",
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
    question: "¿Dónde hacen el nido los vencejos?",
    answer:
      "Instalan el nido dentro de cavidades protegidas: huecos bajo tejados, grietas de fachadas, cámaras de edificios, espacios bajo tejas, aleros, mechinales, huecos en muros, cortados rocosos y, de forma ocasional, huecos de árboles. En España nidifican actualmente casi exclusivamente en construcciones humanas.",
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
    question: "¿Con qué construye el nido un vencejo?",
    answer:
      "Construye una pequeña copa con plumas, fibras vegetales y otros materiales ligeros recogidos durante el vuelo. Usa saliva como elemento aglutinante para unir esos materiales.",
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
    question: "¿Regresa al mismo lugar de nidificación cada año?",
    answer:
      "La especie muestra una elevada fidelidad a la pareja, al edificio, a la colonia y al lugar concreto de nidificación. Muchas parejas regresan cada año al mismo lugar, y estudios de seguimiento a largo plazo han cuantificado una reutilización del lugar de nidificación cercana al 94 % en adultos observados reproduciéndose en años sucesivos.",
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
    question: "¿Cómo encuentra de nuevo el mismo lugar de nidificación después de regresar de África?",
    answer:
      "El vencejo muestra una memoria duradera del lugar de cría, pero no se conoce con precisión qué señales utiliza para identificar la entrada concreta al nido. La memoria espacial y las referencias visuales probablemente intervienen, aunque el mecanismo sensorial exacto sigue sin conocerse.",
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
    question: "¿Cuándo cría el vencejo y cuántos huevos pone?",
    answer:
      "La reproducción se desarrolla principalmente entre mayo y julio. Suele realizar una puesta anual, normalmente de dos o tres huevos, aunque ocasionalmente puede ser de uno a cuatro. Ambos progenitores incuban los huevos, alimentan a los pollos y participan en la crianza.",
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
    question: "¿Cómo se prepara un joven vencejo para su primer vuelo?",
    answer:
      "La salida del nido depende de una preparación física y aerodinámica compleja. Los jóvenes abandonan el nido aproximadamente a los 40-45 días, cuando su plumaje y desarrollo físico les permiten volar de forma autónoma. Durante la última fase pueden perder peso mientras las alas siguen desarrollándose, y los estudios experimentales sugieren que ajustan masa corporal y superficie alar para alcanzar una carga alar adecuada.",
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
    question: "¿Por qué el vencejo no tiene una fase normal de volantón?",
    answer:
      "A diferencia de otras aves, el vencejo no pasa normalmente por una etapa de volantón atendido por sus padres en el suelo o en ramas. Al salir del nido debe ser capaz de mantener un vuelo sostenido, ganar altura, alimentarse por sí mismo y desenvolverse de forma autónoma. Por eso un joven encontrado en el suelo necesita recogida y valoración.",
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
    question: "¿Qué es el torpor en los pollos de vencejo?",
    answer:
      "El torpor es un estado fisiológico reversible de ahorro energético. Durante episodios meteorológicos adversos puede disminuir la disponibilidad de insectos, los adultos pueden alejarse temporalmente y los pollos pueden reducir actividad y metabolismo para conservar energía. En vencejos silvestres se ha medido una reducción metabólica media de aproximadamente el 56 %. Esta adaptación no debe transformarse en una recomendación para mantener sin atención a un pollo encontrado.",
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
    question: "¿Puede una pluma contar algo de lo que le ocurrió mientras crecía?",
    answer:
      "El plumaje debe ser uniforme, con plumas alineadas, barbas cohesionadas, densidad adecuada y plumas de vuelo completas. Las marcas de crecimiento anómalo o marcas de estrés pueden indicar alteraciones durante la formación de la pluma, como falta de alimento, estrés físico, enfermedad u otras alteraciones fisiológicas. No permiten diagnosticar por sí solas una causa concreta sin valoración especializada.",
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
    question: "¿Qué amenazas afectan al vencejo común?",
    answer:
      "Entre sus amenazas están la destrucción de nidos, rehabilitaciones de edificios sin medidas de protección, desaparición de huecos en construcciones modernas, obras durante la época de cría, pérdida de colonias, uso de pesticidas, disminución de insectos y efectos climáticos. La relación entre clima, insectos y reproducción no debe presentarse como una cadena simple: temperatura, lluvia y viento influyen de forma distinta según momento, intensidad y población.",
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
    question: "¿Qué cosas sobre el vencejo común todavía no conocemos bien?",
    answer:
      "Aún hay varias preguntas abiertas: no se ha demostrado directamente el mecanismo exacto del sueño durante el vuelo en Apus apus; la función precisa de los ascensos crepusculares sigue sin estar establecida; no se conocen con precisión las señales sensoriales concretas que usa para navegar; tampoco se sabe exactamente cómo identifica la entrada concreta al nido tras regresar de África.",
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
    question: "¿Un vencejo joven en el suelo es un volantón?",
    answer:
      "No funciona como muchos otros pájaros: el vencejo no pasa normalmente por una fase de volantón atendido por sus padres en el suelo o en ramas. Si ha caído, los padres no bajarán a alimentarlo; protégelo en una caja de cartón ventilada y consulta cuanto antes.",
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
    question: "¿Qué debo hacer si encuentro una cría?",
    answer:
      "No la recojas automáticamente. Observa si está herida, en peligro o expuesta. Muchas crías están atendidas por sus padres aunque parezcan solas. Si hay riesgo real o dudas, contacta con un centro de recuperación o con el servicio competente.",
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
      "Un pollo suele tener poco plumaje o plumón visible y normalmente debería estar en el nido. Un volantón está más emplumado, puede saltar o moverse por el suelo y sus padres suelen seguir alimentándolo mientras aprende. Algunas especies tienen excepciones, así que si tienes dudas conviene pedir orientación.",
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
      "Solo si existe un peligro inmediato, como tráfico, depredadores domésticos o una zona insegura. Siempre que sea posible, mantenla cerca del lugar donde fue encontrada para no romper el vínculo con los adultos. Si no sabes si debes moverla, pide orientación antes de actuar.",
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
    id: "vencejo-gato",
    category: "Animales heridos o atrapados",
    question: "¿Qué hago si un gato ha capturado un vencejo?",
    answer:
      "Recógelo, mantenlo en una caja de cartón ventilada y no lo liberes directamente. Aunque no veas heridas, el contacto con un gato puede causar lesiones pequeñas o profundas que necesitan valoración urgente.",
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
    question: "¿Qué hago si un vencejo ha chocado contra un cristal u obstáculo?",
    answer:
      "No lo lances para comprobar si vuela. Protégelo en una caja de cartón ventilada en un lugar tranquilo y consulta con un centro especializado, porque puede tener traumatismos, lesiones internas o problemas de vuelo aunque parezca recuperarse.",
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
      "Puede tratarse de un volantón, un animal debilitado o un ejemplar lesionado. Observa si hay heridas, peligro o comportamiento anómalo, y no lances al animal al aire para comprobar si vuela. Si tienes dudas, pide orientación antes de manipularlo.",
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
      "Si encuentras un murciélago, evita tocarlo directamente y mantén alejadas a personas y mascotas. Observa si es una cría, un adulto, está en el suelo, atrapado, herido o en un lugar peligroso. Si debes manipularlo siguiendo indicaciones, utiliza guantes adecuados o una toalla, colócalo en una caja de cartón ventilada y bien cerrada y contacta con un centro especializado.",
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
    question: "¿Cómo sé si es una cría de murciélago?",
    answer:
      "No te fíes solo del tamaño: algunos murciélagos adultos son muy pequeños. Para orientar la edad, fíjate en el pelo. Las crías más pequeñas pueden estar rosadas y sin pelo o con muy poco pelo gris; cuando el pelo es compacto, abundante y largo, puede tratarse de un adulto aunque sea pequeño. Si tienes dudas, pide orientación antes de manipularlo.",
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
    question: "¿Qué hago si encuentro una cría de murciélago?",
    answer:
      "Protégela del sol, del frío, del calor y de depredadores, especialmente gatos. No la manipules con las manos desnudas ni le des comida o agua sin indicación. Si parece recién nacida, está fría, deshidratada, herida, muy débil o no puedes devolverla al refugio con seguridad, mantenla en una caja de cartón ventilada y bien cerrada y contacta cuanto antes con un centro de recuperación o entidad especializada.",
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
    question: "¿Puedo devolver una cría de murciélago al refugio o reunificarla con su madre?",
    answer:
      "Puede ser posible si se confirma que es una cría, está en buen estado, se localiza el refugio y la actuación puede hacerse con seguridad. Primero consulta con un centro de recuperación o entidad especializada. Si el refugio es accesible, la prioridad suele ser devolverla cerca de la entrada para que pueda entrar. Si no es posible, la reunificación al anochecer solo debe intentarse cuando te lo indiquen, manteniendo a la cría caliente, protegida y fuera del alcance de gatos u otros depredadores.",
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
    question: "¿Qué hago si me muerde un murciélago?",
    answer:
      "Lava inmediatamente la herida con abundante agua y jabón durante al menos 15 minutos y busca atención sanitaria cuanto antes para que valoren las medidas necesarias. Evita volver a manipular directamente al murciélago. Si el animal permanece localizado, no lo liberes ni intentes capturarlo de nuevo sin indicación y comunícalo al personal sanitario o a los servicios especializados.",
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
    question: "¿Qué hago si un gato ha capturado un murciélago?",
    answer:
      "No lo liberes directamente aunque no veas heridas. Evita tocarlo con las manos desnudas, mantenlo en una caja de cartón ventilada y bien cerrada, alejado de personas y mascotas, y contacta cuanto antes con un centro de recuperación o entidad especializada para que valoren el caso.",
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
    question: "¿Qué hago si encuentro un ave que no puede volar?",
    answer:
      "No siempre significa que esté herida: puede tratarse de un volantón. Observa el plumaje, la postura, la presencia de los padres y posibles signos visibles de lesión antes de intervenir. No la lances al aire para comprobar si vuela.",
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
      "No. Si está débil, lesionado o todavía no está preparado, puede caer y sufrir más daños. Una prueba de vuelo nunca consiste en lanzar ni arrojar al animal desde una altura.",
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
    question: "¿Puedo hacer una prueba de vuelo con un vencejo?",
    answer:
      "No la utilices para averiguar si un animal dudoso está bien. Si hay cualquier duda sobre lesión, debilidad, desarrollo o plumaje, solicita valoración especializada. Y recuerda: nunca debe lanzarse al vencejo ni convertir esta orientación en un procedimiento de liberación.",
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
    question: "¿Puedo darle agua o comida a un vencejo?",
    answer:
      "No le des comida ni agua sin indicación especializada y no introduzcas agua directamente en el pico. Una alimentación inadecuada puede afectar a su desarrollo y al plumaje, esencial para poder volar y sobrevivir tras la liberación.",
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
    question: "¿Por qué es importante meter al vencejo en una caja de cartón?",
    answer:
      "La caja de cartón ventilada reduce el estrés, evita golpes e impide que intente volar dentro de casa o en un espacio inseguro. Debe tener papel de cocina en el fondo y no ser tan grande como para que pueda aletear y lesionarse.",
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
    id: "nidos-vencejo-obras",
    category: "Contacto y emergencias",
    question: "¿Qué hago si hay nidos de vencejo en un edificio o una obra?",
    answer:
      "No retires el nido ni bloquees la entrada al hueco. Los vencejos suelen criar en cavidades de edificios y muestran mucha fidelidad al lugar, así que cerrar un hueco de nidificación activo puede tener consecuencias graves; documenta la situación si es seguro y contacta con Agentes Forestales, Medioambientales o la autoridad ambiental competente.",
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
