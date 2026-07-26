import type { RescueCase } from "@/types/rescueCase";
import {
  persistCurrentCase,
  completeCurrentCase,
} from "@/services/rescueCaseService";
import * as Clipboard from "expo-clipboard";
import * as ImagePicker from "expo-image-picker";
import * as Linking from "expo-linking";
import * as Location from "expo-location";
import * as MediaLibrary from "expo-media-library";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { Stack, useRouter } from "expo-router";
import { SectionCard } from "@/components/SectionCard";
import { provinceContacts } from "@/lib/provinceContacts";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type FlagsState = {
  bleeding: boolean;
  baby: boolean;
  catDog: boolean;
  canNotMove: boolean;
  roadRisk: boolean;
  ringGps: boolean;
  trapped: boolean;
  cannotFly: boolean;
  weakness: boolean;
  normalAppearance: boolean;
  breathing: boolean;
  other: boolean;
};

type AnimalType =
  | "smallBird"
  | "largeBird"
  | "bat"
  | "smallMammal"
  | "largeMammal"
  | "reptileAmphibian"
  | "unknown";

type AnimalState = "alive" | "dead";

type Step = 1 | 2 | 3 | 4;

const GREFA_WHATSAPP = "34648539901";

const COMMON_END =
  "En el siguiente paso podrás facilitar una foto y la ubicación del hallazgo. Contacta con un centro especializado, con los Agentes Forestales o con Emergencias y facilita la información recopilada por el medio que prefieras.";

const ANIMAL_OPTIONS: Array<{ key: AnimalType; label: string }> = [
  { key: "smallBird", label: "Ave pequeña" },
  { key: "largeBird", label: "Ave rapaz / ave grande" },
  { key: "bat", label: "Murciélago" },
  { key: "smallMammal", label: "Pequeño mamífero" },
  { key: "largeMammal", label: "Mamífero grande" },
  { key: "reptileAmphibian", label: "Reptil / anfibio" },
  { key: "unknown", label: "No estoy seguro" },
];

const ANIMAL_STATE_OPTIONS: Array<{ key: AnimalState; label: string }> = [
  { key: "alive", label: "Vivo" },
  { key: "dead", label: "Muerto" },
];

const FLAG_LABELS: Array<{ key: keyof FlagsState; label: string }> = [
  { key: "bleeding", label: "Herido" },
  { key: "baby", label: "Es cría" },
  { key: "catDog", label: "Ataque de gato/perro" },
  { key: "canNotMove", label: "No se mueve bien" },
  { key: "roadRisk", label: "Peligro en carretera" },
  { key: "ringGps", label: "Anilla / GPS" },
  { key: "trapped", label: "Atrapado" },
  { key: "cannotFly", label: "No vuela" },
  { key: "weakness", label: "Debilidad / decaimiento" },
  { key: "normalAppearance", label: "Apariencia normal" },
  { key: "breathing", label: "Respiración agitada" },
  { key: "other", label: "Otro" },
];

function createInitialFlags(): FlagsState {
  return {
    bleeding: false,
    baby: false,
    catDog: false,
    canNotMove: false,
    roadRisk: false,
    ringGps: false,
    trapped: false,
    cannotFly: false,
    weakness: false,
    normalAppearance: false,
    breathing: false,
    other: false,
  };
}

const NATIONAL_HELP_CONTACTS = [
  { name: "Emergencias", phone: "112", note: "Emergencias generales" },
  {
    name: "SEPRONA",
    phone: "062",
    note: "Guardia Civil · Protección de la naturaleza",
  },
  {
    name: "Policía Municipal / Local",
    phone: "092",
    note: "Policía local del municipio",
  },
  { name: "Policía Nacional", phone: "091", note: "Atención policial" },
];

const MADRID_PROVINCE_CONTACTS = [
  {
    name: "GREFA guardia",
    phone: "627 461 457",
    note: "Guardia para avisos de fauna salvaje herida",
  },
  {
    name: "GREFA central",
    phone: "91 638 75 50",
    note: "Teléfono general del centro",
  },
  {
    name: "CRAS Madrid",
    phone: "91 276 06 26",
    note: "Centro de Recuperación de Animales Silvestres de la Comunidad de Madrid",
  },
  {
    name: "Agentes Forestales de Madrid",
    phone: "900 181 628",
    note: "Avisos e incidencias sobre fauna y medio natural",
  },
];

function canUseCannotFly(animalType: AnimalType) {
  return (
    animalType === "smallBird" ||
    animalType === "largeBird" ||
    animalType === "bat" ||
    animalType === "unknown"
  );
}

function getTrappedAdvice(animalType: AnimalType) {
  const commonEnd =
    COMMON_END;

  if (animalType === "smallBird") {
    return (
  "🪤 AVE ATRAPADA\n\n" +
  "🚨 ACTÚA CON CALMA\n" +
  "• Un intento de liberación precipitado puede provocar lesiones en las alas, las patas o el cuello.\n" +
  "• Antes de intervenir, observa cómo está atrapada y valora si puedes ayudar sin poner en riesgo tu seguridad ni la del animal.\n\n" +
  "❌ QUÉ NO HACER\n" +
  "• No tires del animal para liberarlo.\n" +
  "• No fuerces las alas, las patas o el cuello.\n" +
  "• Realiza únicamente las fotos o vídeos necesarios para la identificación del caso y evita utilizar flash.\n" +
  "• No le des comida ni agua sin indicación.\n\n" +
  "✅ QUÉ HACER\n" +
  "• Reduce los ruidos y evita que se acerquen personas o animales domésticos.\n" +
  "• Si puedes hacerlo sin riesgo, cúbrela suavemente con una toalla, un trapo, un jersey o cualquier otra tela disponible para reducir su estrés.\n" +
  "• Si consigues liberarla sin causarle lesiones, introdúcela en una caja de cartón ventilada y bien cerrada o en un transportín seguro.\n" +
  "• Mantén la caja o el transportín en un lugar tranquilo, protegido del frío o del calor extremo.\n" +
  "• Contacta con el centro de recuperación más cercano para recibir orientación.\n\n" +
  commonEnd
);
  }

  if (animalType === "largeBird") {
    return (
  "🪤 RAPAZ ATRAPADA\n\n" +
  "🚨 ACTÚA CON CALMA\n" +
  "• Una rapaz puede sentirse amenazada y usar sus garras y el pico, aunque parezca inmóvil o debilitada.\n" +
  "• Antes de intervenir, observa cómo está atrapada y valora si puedes ayudar sin poner en riesgo tu seguridad ni la del animal.\n\n" +
  "❌ QUÉ NO HACER\n" +
  "• No tires del animal para liberarlo.\n" +
  "• No sujetes con fuerza las alas, las patas o el cuello.\n" +
  "• Realiza únicamente las fotos o vídeos necesarios para la identificación del caso y evita utilizar flash.\n" +
  "• No le des comida ni agua sin indicación.\n\n" +
  "✅ QUÉ HACER\n" +
  "• Mantén alejadas a las personas y a los animales domésticos.\n" +
  "• Si puedes hacerlo sin riesgo, cúbrela suavemente con una toalla, una manta o una tela gruesa para reducir su estrés y protegerte de las garras.\n" +
  "• Si consigues liberarla sin causarle lesiones, observa si puede ser liberada en el acto. Si presenta alguna anomalía, introdúcela en una caja de cartón ventilada y bien cerrada o en un transportín seguro.\n" +
  "• Mantén la caja o el transportín en un lugar tranquilo, protegido del frío o del calor extremo.\n" +
  "• Contacta con el centro de recuperación más cercano para recibir orientación.\n\n" +
  commonEnd
);
  }

  if (animalType === "bat") {
    return (
  "🪤 MURCIÉLAGO ATRAPADO\n\n" +
  "🚨 ACTÚA CON CALMA\n" +
  "• Antes de intervenir, observa cómo está atrapado y comprueba si puedes ayudar sin poner en riesgo tu seguridad ni la del animal.\n\n" +
  "❌ QUÉ NO HACER\n" +
  "• No lo manipules directamente con las manos desnudas.\n" +
  "• No tires del animal para liberarlo.\n" +
  "• Haz solo las fotos o vídeos necesarios para valorar el caso y evita utilizar flash.\n" +
  "• No le des comida ni agua sin indicación.\n\n" +
  "✅ QUÉ HACER\n" +
  "• Mantén alejadas a las personas y a los animales domésticos.\n" +
  "• Si es necesario manipularlo, utiliza guantes gruesos o una tela resistente para protegerte.\n" +
  "• Si consigues liberarlo sin causarle lesiones, introdúcelo en una caja de cartón ventilada y bien cerrada, con una tela o papel absorbente en el fondo.\n" +
  "• Mantén la caja en un lugar tranquilo, oscuro y protegido del frío y del calor.\n" +
  "• Contacta con el centro de recuperación más cercano para recibir orientación.\n\n" +
  commonEnd
);
  }

  if (animalType === "smallMammal") {
    return (
  "🪤 MAMÍFERO PEQUEÑO ATRAPADO\n\n" +
  "🚨 ACTÚA CON CALMA\n" +
  "• Un mamífero atrapado puede sentirse amenazado siente miedo o dolor.\n" +
  "• Antes de intervenir, observa cómo está atrapado y valora si puedes ayudar sin poner en riesgo tu seguridad ni la del animal.\n\n" +
  "❌ QUÉ NO HACER\n" +
  "• No tires del animal para liberarlo.\n" +
  "• No lo manipules directamente si existe riesgo de mordedura.\n" +
  "• Realiza únicamente las fotos o vídeos necesarios para la identificación del caso y evita utilizar flash.\n" +
  "• No le des comida ni agua sin indicación.\n\n" +
  "✅ QUÉ HACER\n" +
  "• Mantén alejadas a las personas y a los animales domésticos.\n" +
  "• Si puedes hacerlo sin riesgo, utiliza guantes gruesos o una tela resistente para manipularlo.\n" +
  "• Si consigues liberarlo sin causarle lesiones, introdúcelo en una caja de cartón ventilada y bien cerrada o en un transportín seguro.\n" +
  "• Mantén la caja o el transportín en un lugar tranquilo, protegido del frío o del calor extremo.\n" +
  "• Contacta con el centro de recuperación más cercano para recibir orientación.\n\n" +
  commonEnd
);
  }

  if (animalType === "largeMammal") {
    return (
  "🪤 MAMÍFERO GRANDE ATRAPADO\n\n" +
  "🚨 ACTÚA CON CALMA\n" +
  "• Un mamífero grande atrapado puede reaccionar de forma imprevisible e intentar escapar bruscamente, provocando lesiones tanto al animal como a las personas.\n" +
  "• Antes de intervenir, observa cómo está atrapado y valora si puedes ayudar sin poner en riesgo tu seguridad ni la del animal.\n\n" +
  "❌ QUÉ NO HACER\n" +
  "• No intentes liberarlo tú solo.\n" +
  "• No te acerques si el animal está agitado o puede embestir, cocear o morder.\n" +
  "• Realiza únicamente las fotos o vídeos necesarios para la identificación del caso y evita utilizar flash.\n" +
  "• No le des comida ni agua sin indicación.\n\n" +
  "✅ QUÉ HACER\n" +
  "• Mantén alejadas a las personas y a los animales domésticos.\n" +
  "• Si puedes hacerlo sin riesgo, observa el tipo de atrapamiento para poder describirlo a los servicios de ayuda.\n" +
  "• Contacta cuanto antes con el centro de recuperación más cercano para recibir orientación.\n\n" +
  commonEnd
);
  }

  if (animalType === "reptileAmphibian") {
    return (
  "🪤 REPTIL O ANFIBIO ATRAPADO\n\n" +
  "🚨 ACTÚA CON CALMA\n" +
  "• Un reptil o un anfibio atrapado puede sufrir lesiones si intentas liberarlo de forma brusca.\n" +
  "• Antes de intervenir, observa cómo está atrapado y valora si puedes ayudar sin poner en riesgo tu seguridad ni la del animal.\n\n" +
  "❌ QUÉ NO HACER\n" +
  "• No tires del animal para liberarlo.\n" +
  "• No lo sujetes con fuerza ni manipules partes del cuerpo que puedan lesionarse.\n" +
  "• Realiza únicamente las fotos o vídeos necesarios para la identificación del caso y evita utilizar flash.\n" +
  "• No le des comida ni agua sin indicación.\n\n" +
  "✅ QUÉ HACER\n" +
  "• Mantén alejadas a las personas y a los animales domésticos.\n" +
  "• Si puedes hacerlo sin riesgo, intenta reducir su estrés mientras valoras la situación.\n" +
  "• Si consigues liberarlo sin causarle lesiones, colócalo en una caja o recipiente ventilado y bien cerrado.\n" +
  "• Mantén el recipiente en un lugar tranquilo, protegido del frío o del calor extremo.\n" +
  "• Contacta con el centro de recuperación más cercano para recibir orientación.\n\n" +
  commonEnd
);
  }

  return (
  "🪤 ANIMAL ATRAPADO\n\n" +
  "🚨 ACTÚA CON CALMA\n" +
  "• Un animal atrapado puede lesionarse gravemente si intentas liberarlo de forma precipitada.\n" +
  "• Antes de intervenir, observa cómo está atrapado y valora si puedes ayudar sin poner en riesgo tu seguridad ni la del animal.\n\n" +
  "❌ QUÉ NO HACER\n" +
  "• No tires del animal para liberarlo.\n" +
  "• No fuerces ninguna parte de su cuerpo.\n" +
  "• Realiza únicamente las fotos o vídeos necesarios para la identificación del caso y evita utilizar flash.\n" +
  "• No le des comida ni agua sin indicación.\n\n" +
  "✅ QUÉ HACER\n" +
  "• Mantén alejadas a las personas y a los animales domésticos.\n" +
  "• Si puedes hacerlo sin riesgo, cúbrelo suavemente con una tela para reducir su estrés, siempre que sea apropiado para la especie.\n" +
  "• Si consigues liberarlo sin causarle lesiones, colócalo en una caja o recipiente ventilado y bien cerrado.\n" +
  "• Mantén la caja o el recipiente en un lugar tranquilo, protegido del frío o del calor extremo.\n" +
  "• Contacta con el centro de recuperación más cercano para recibir orientación.\n\n" +
  commonEnd
);
}
function getBabyAdvice(animalType: AnimalType) {
  const commonEnd =
    COMMON_END;

  if (animalType === "smallBird") {
return (
  "🐣 POLLO O VOLANTÓN\n\n" +
  "⚠️ ANTES DE INTERVENIR\n" +
  "• Antes de actuar, intenta distinguir si se trata de un pollo o de un volantón. No todas las aves jóvenes encontradas en el suelo necesitan ayuda.\n\n" +

  "🐥 POLLO\n" +
  "• Tiene poco plumaje, plumón visible o zonas sin plumas.\n" +
  "• Normalmente debería permanecer en el nido.\n" +
  "• Si localizas el nido y puedes acceder con seguridad, devuélvelo con la mínima manipulación posible.\n" +
  "• Si no es posible devolverlo al nido, puede necesitar ayuda. Contacta con el centro de recuperación más cercano para recibir orientación.\n\n" +

  "🕊️ VOLANTÓN\n" +
  "• Observa la situación desde una distancia prudente antes de intervenir.\n" +
  "• Suele estar completamente emplumado.\n" +
  "• Es normal encontrarlo fuera del nido.\n" +
  "• Puede desplazarse por el suelo o por ramas bajas mientras aprende a volar.\n" +
  "• Sus padres suelen continuar alimentándolo y protegiéndolo.\n" +
  "• No lo retires salvo que exista un peligro inmediato.\n" +
  "• Si presenta heridas, está muy débil o muestra un comportamiento anómalo, puede necesitar ayuda. Contacta con el centro de recuperación más cercano para recibir orientación.\n\n" +

  "🚨 SI NECESITA AYUDA\n\n" +

  "❌ QUÉ NO HACER\n" +
  "• No le des comida ni agua sin indicación.\n" +
  "• No lo manipules más de lo necesario.\n" +
  "• No le extiendas las alas.\n\n" +

  "✅ QUÉ HACER\n" +
  "• Colócalo en una caja de cartón ventilada y bien cerrada.\n" +
  "• Mantén la caja en un lugar tranquilo, protegido del frío o del calor extremo.\n" +
  "• Reduce los ruidos y evita la presencia de personas y animales domésticos.\n" +
  "• Realiza únicamente las fotos o vídeos necesarios para la identificación del caso y evita utilizar flash.\n" +
  "• Contacta con el centro de recuperación más cercano para recibir orientación.\n\n" +

  commonEnd
);
  }

  if (animalType === "largeBird") {
    return (
  "🦉 CRÍA DE RAPAZ O AVE GRANDE\n\n" +
  "⚠️ ANTES DE INTERVENIR\n" +
  "• No toda cría de rapaz o ave grande encontrada fuera del nido necesita ser recogida.\n" +
  "• Puede encontrarse en una fase de aprendizaje.\n" +
  "• Los adultos pueden continuar alimentándola y vigilándola desde las proximidades.\n" +
  "• Algunas especies permanecen varios días en el suelo o en ramas bajas mientras aprenden a volar.\n\n" +
  "🚨 PUEDE NECESITAR AYUDA SI\n" +
  "• Presenta heridas.\n" +
  "• Está muy débil.\n" +
  "• Existe un peligro inmediato.\n" +
  "• Lleva mucho tiempo expuesta en una zona peligrosa.\n" +
  "• Tienes dudas razonables sobre su estado.\n\n" +
  "❌ QUÉ NO HACER\n" +
  "• No la manipules sin necesidad.\n" +
  "• No la recojas automáticamente por estar en el suelo.\n" +
  "• No le des comida ni agua sin indicación.\n" +
  "• No acerques la cara ni las manos desnudas.\n\n" +
  "✅ QUÉ HACER\n" +
  "• Observa la situación desde una distancia prudente antes de intervenir.\n" +
  "• Reduce los ruidos y evita la presencia de personas y animales domésticos.\n" +
  "• Si puedes hacerlo sin riesgo, introdúcela en una caja de cartón ventilada y bien cerrada o en un transportín seguro.\n" +
  "• Mantén la caja o el transportín en un lugar tranquilo y, si es posible, cúbrelo parcialmente con una toalla o tela sin bloquear la ventilación para reducir el estrés.\n" +
  "• Realiza únicamente las fotos o vídeos necesarios para la identificación del caso y evita utilizar flash.\n" +
  "• Contacta con el centro de recuperación más cercano para recibir orientación.\n\n" +
  commonEnd
);
  }

  if (animalType === "bat") {
  const commonEnd =
    COMMON_END;

 return (
  "🦇 CRÍA DE MURCIÉLAGO\n\n" +
  "⚠️ ANTES DE INTERVENIR\n" +
  "• Una cría de murciélago no siempre necesita ser trasladada a un centro de recuperación.\n" +
  "• Si localizas la colonia, puedes intentar dejar la cría cerca de ella al atardecer para favorecer la reunificación con los adultos.\n" +
  "• Hazlo únicamente si no presenta heridas ni está muy débil.\n" +
  "• Si tienes dudas, consulta con el centro de recuperación más cercano.\n\n" +
  "🚨 PUEDE NECESITAR AYUDA SI\n" +
  "• Presenta heridas.\n" +
  "• Está muy débil.\n" +
  "• Ha sido atacada por un gato u otro animal.\n" +
  "• Se encuentra en una situación de peligro.\n" +
  "• Tienes dudas razonables sobre su estado.\n\n" +
  "❌ QUÉ NO HACER\n" +
  "• No la manipules con las manos desnudas.\n" +
  "• No le des comida ni agua sin indicación.\n" +
  "• No la mantengas expuesta al sol, al frío o a fuentes de calor directas.\n\n" +
  "✅ QUÉ HACER\n" +
  "• Utiliza guantes o una tela si necesitas recogerla.\n" +
  "• Si necesita ayuda, colócala en una caja de cartón ventilada y bien cerrada, con una tela o papel absorbente en el fondo.\n" +
  "• Mantén la caja en un lugar tranquilo, oscuro y protegido del frío o del calor extremo.\n" +
  "• Reduce los ruidos y evita la presencia de personas y animales domésticos.\n" +
  "• Realiza únicamente las fotos o vídeos necesarios para la identificación del caso y evita utilizar flash.\n" +
  "• Contacta con el centro de recuperación más cercano para recibir orientación.\n\n" +
  commonEnd
);
  }

  if (animalType === "smallMammal") {
    return (
  "🐭 CRÍA DE PEQUEÑO MAMÍFERO\n\n" +
  "⚠️ ANTES DE INTERVENIR\n" +
  "• Muchas crías de pequeños mamíferos permanecen solas temporalmente mientras la madre busca alimento o se mantiene oculta en las proximidades.\n" +
  "• Observa la situación desde una distancia prudente antes de intervenir.\n" +
  "• No la recojas salvo que exista un peligro inmediato.\n\n" +
  "🚨 PUEDE NECESITAR AYUDA SI\n" +
  "• Presenta heridas.\n" +
  "• Está muy débil.\n" +
  "• Ha sido atacada por un gato, un perro u otro animal.\n" +
  "• Se encuentra en una situación de peligro.\n" +
  "• Tienes dudas razonables sobre su estado.\n\n" +
  "❌ QUÉ NO HACER\n" +
  "• No la recojas automáticamente por estar sola.\n" +
  "• No la manipules más de lo necesario.\n" +
  "• No le des comida ni agua sin indicación.\n\n" +
  "✅ QUÉ HACER\n" +
  "• Observa primero si la madre continúa atendiéndola.\n" +
  "• Si necesita ayuda, colócala en una caja de cartón ventilada y bien cerrada.\n" +
  "• Mantén la caja en un lugar tranquilo, protegido del frío o del calor extremo.\n" +
  "• Reduce los ruidos y evita la presencia de personas y animales domésticos.\n" +
  "• Realiza únicamente las fotos o vídeos necesarios para la identificación del caso y evita utilizar flash.\n" +
  "• Contacta con el centro de recuperación más cercano para recibir orientación.\n\n" +
  commonEnd
);
  }

  if (animalType === "largeMammal") {
    return (
  "🦌 CRÍA DE GRAN MAMÍFERO\n\n" +
  "⚠️ ANTES DE INTERVENIR\n" +
  "• Muchas crías de ciervo, corzo u otros grandes mamíferos permanecen ocultas durante horas mientras la madre se mantiene alejada para no atraer depredadores.\n" +
  "• Permanecer sola no significa necesariamente que haya sido abandonada.\n" +
  "• Observa la situación desde una distancia prudente antes de intervenir.\n\n" +
  "🚨 PUEDE NECESITAR AYUDA SI\n" +
  "• Presenta heridas evidentes.\n" +
  "• Está muy débil.\n" +
  "• Se encuentra en una situación de peligro.\n" +
  "• Ha sido atacada por un perro u otro animal o ha sufrido un atropello.\n" +
  "• Tienes dudas razonables sobre su estado.\n\n" +
  "❌ QUÉ NO HACER\n" +
  "• No la recojas ni la traslades sin necesidad.\n" +
  "• No la manipules ni intentes acariciarla.\n" +
  "• No le des comida ni agua sin indicación.\n" +
  "• No te acerques más de lo necesario.\n\n" +
  "✅ QUÉ HACER\n" +
  "• Mantén una distancia prudente y observa desde lejos.\n" +
  "• Reduce los ruidos y evita la presencia de personas, animales domésticos y vehículos.\n" +
  "• Realiza únicamente las fotos o vídeos necesarios para la identificación del caso y evita utilizar flash.\n" +
  "• Si se encuentra cerca de una carretera o de una zona con tráfico, prioriza tu seguridad y solicita ayuda.\n" +
  "• Contacta con el centro de recuperación más cercano para recibir orientación.\n" +
  "• Sigue siempre las indicaciones del personal especializado.\n\n" +
  commonEnd
);
  }

  if (animalType === "reptileAmphibian") {
    return (
  "🦎 CRÍA DE REPTIL O ANFIBIO\n\n" +
  "⚠️ ANTES DE INTERVENIR\n" +
  "• Las crías de reptiles y anfibios suelen ser independientes desde etapas muy tempranas.\n" +
  "• Encontrar una cría sola no significa necesariamente que necesite ayuda.\n" +
  "• Observa la situación desde una distancia prudente antes de intervenir.\n\n" +
  "🚨 PUEDE NECESITAR AYUDA SI\n" +
  "• Presenta heridas.\n" +
  "• Está atrapada o no puede desplazarse.\n" +
  "• Se encuentra en una carretera, piscina, obra o cualquier otra zona de peligro.\n" +
  "• Existe riesgo por la presencia de perros, gatos u otros animales.\n" +
  "• Tienes dudas razonables sobre su estado.\n\n" +
  "❌ QUÉ NO HACER\n" +
  "• No la manipules sin necesidad.\n" +
  "• No la traslades a grandes distancias.\n" +
  "• No manipules serpientes o culebras con las manos si no puedes identificarlas con seguridad.\n" +
  "• No le des comida ni agua sin indicación.\n\n" +
  "✅ QUÉ HACER\n" +
  "• Si se trata de una serpiente o culebra y existe riesgo de mordedura, mantén la distancia y solicita ayuda especializada.\n" +
  "• Si necesitas moverla por seguridad, utiliza un recipiente seguro y ventilado.\n" +
  "• Déjala en una zona adecuada, lo más cercana posible al lugar donde fue encontrada.\n" +
  "• Reduce ruidos y evita la presencia innecesaria de personas y animales domésticos cerca del animal.\n" +
  "• Realiza únicamente las fotos o vídeos necesarios para la identificación del caso y evita utilizar flash.\n" +
  "• Contacta con el centro de recuperación más cercano para recibir orientación.\n\n" +
  commonEnd
);
  }

  return (
  "❓ NO ESTOY SEGURO - ES UNA CRÍA\n\n" +
  "⚠️ ANTES DE INTERVENIR\n" +
  "• Muchas crías no están abandonadas aunque parezcan solas.\n" +
  "• Observa la situación desde una distancia prudente antes de intervenir.\n" +
  "• Evita llevártela a casa o alimentarla.\n\n" +
  "🚨 PUEDE NECESITAR AYUDA SI\n" +
  "• Presenta heridas.\n" +
  "• Está muy débil.\n" +
  "• Existe un peligro inmediato.\n" +
  "• Ha sido atacada por un perro, gato u otro animal.\n" +
  "• Tienes dudas razonables sobre su estado.\n\n" +
  "❌ QUÉ NO HACER\n" +
  "• No la recojas automáticamente por estar sola.\n" +
  "• No la manipules más de lo necesario.\n" +
  "• No le des comida ni agua sin indicación.\n\n" +
  "✅ QUÉ HACER\n" +
  "• Reduce ruidos y evita la presencia innecesaria de personas y animales domésticos cerca del animal.\n" +
  "• Si debes moverla por seguridad, mantenla en una caja de cartón ventilada y bien cerrada.\n" +
  "• Mantén la caja en un lugar tranquilo, protegido del frío o del calor extremo.\n" +
  "• Realiza únicamente las fotos o vídeos necesarios para la identificación del caso y evita utilizar flash.\n" +
  "• Contacta con el centro de recuperación más cercano para recibir orientación.\n\n" +
  commonEnd
);
}

function hasPhysicalWarning(flags: FlagsState) {
  return (
    flags.bleeding ||
    flags.catDog ||
    flags.canNotMove ||
    flags.weakness ||
    flags.breathing
  );
}

function hasImmediateRisk(flags: FlagsState) {
  return flags.roadRisk;
}

function hasAnyConcern(flags: FlagsState) {
  return hasPhysicalWarning(flags) || hasImmediateRisk(flags) || flags.other;
}

function getObservedSigns(flags: FlagsState, includeCannotFly = false) {
  const signs: string[] = [];

  if (flags.bleeding) signs.push("• Presenta signos de lesión.");
  if (flags.catDog) signs.push("• Ha sufrido un ataque de gato o perro.");
  if (flags.canNotMove) signs.push("• No se mueve con normalidad.");
  if (includeCannotFly && flags.cannotFly) signs.push("• No puede volar.");
  if (flags.weakness) signs.push("• Presenta debilidad o decaimiento.");
  if (flags.breathing) signs.push("• Presenta respiración agitada.");
  if (flags.roadRisk)
    signs.push("• Se encuentra en una zona con tráfico o peligro inmediato.");
  if (flags.other)
    signs.push("• Se ha observado otra circunstancia que genera preocupación.");

  return signs.join("\n");
}

function addSupplementalAdvice(baseAdvice: string, flags: FlagsState) {
  const supplementalBlocks: string[] = [];
  let advice = baseAdvice.trimEnd();

  if (flags.ringGps) {
    supplementalBlocks.push(
      "🔎 ANILLA O DISPOSITIVO DE SEGUIMIENTO\n" +
        "• La anilla o el dispositivo puede aportar información importante sobre el animal y su seguimiento.\n" +
        "• No retires ni manipules la anilla o el dispositivo.\n" +
        "• Si puedes hacerlo sin molestar al animal, fotografía los números, letras, marcas o etiquetas visibles.\n" +
        "• Anota también cualquier información que puedas leer y comunícala al centro de recuperación o a los agentes medioambientales.",
    );
  }

  if (flags.normalAppearance && !hasAnyConcern(flags) && !flags.cannotFly) {
    supplementalBlocks.push(
      "ℹ️ APARIENCIA NORMAL\n" +
        "• Si el animal se desplaza y se comporta con normalidad, y no existe un peligro inmediato, observa la situación desde una distancia prudente.\n" +
        "• Evita recogerlo o cambiarlo de lugar sin necesidad.\n" +
        "• En muchos casos, la mejor ayuda es permitir que continúe su comportamiento natural.\n" +
        "• Si la situación cambia o detectas alguna anomalía, vuelve al paso anterior y marca las opciones correspondientes.",
    );
  }

  if (advice.endsWith(COMMON_END)) {
    advice = advice.slice(0, -COMMON_END.length).trimEnd();
  }

  return [advice, ...supplementalBlocks, COMMON_END].join("\n\n");
}

function getSmallBirdAdvice(flags: FlagsState) {
  if (hasPhysicalWarning(flags)) {
    const signs = getObservedSigns(flags, true);
    const commonEnd =
    COMMON_END;

    return (
  "🐦 AVE PEQUEÑA QUE PUEDE NECESITAR AYUDA\n\n" +
  "🚨 SEÑALES OBSERVADAS\n" +
  signs +
  "\n\n❌ QUÉ NO HACER\n" +
  "• No le des comida ni agua sin indicación.\n" +
  "• No intentes extenderle las alas ni comprobar lesiones mediante manipulaciones.\n" +
  "• No la persigas ni la lances al aire para comprobar si vuela.\n" +
  "• Realiza únicamente las fotos o vídeos necesarios para la identificación del caso y evita utilizar flash.\n\n" +
  "✅ QUÉ HACER\n" +
  "• Manipúlala únicamente si es necesario.\n" +
  "• Colócala en una caja de cartón ventilada y bien cerrada o en un transportín seguro.\n" +
  "• Mantén la caja o el transportín en un lugar tranquilo, protegido del frío o del calor extremo.\n" +
  "• Si ha sido atacada por un gato o un perro, necesita valoración aunque no observes heridas evidentes.\n" +
  "• Contacta con el centro de recuperación más cercano o con los agentes medioambientales para recibir orientación.\n" +
  "• Continúa con el siguiente paso para compartir la información necesaria y recibir una mejor orientación.\n\n"+
  commonEnd
  );
  }

  if (flags.cannotFly) {
	  const commonEnd =
    COMMON_END;

    return (
  "🐦 AVE QUE NO VUELA\n\n" +
  "⚠️ ANTES DE INTERVENIR\n" +
  "• Un ave que no vuela no siempre necesita ser rescatada de inmediato.\n" +
  "• Puede tratarse de un volantón que está aprendiendo a volar o de un ave que realmente necesite ayuda.\n" +
  "• Observa la situación desde una distancia prudente antes de intervenir.\n" +
  "• Si tienes dudas sobre si se trata de una cría, un pollo o un volantón, vuelve al paso anterior y selecciona la opción «Es cría».\n\n" +
  "❌ QUÉ NO HACER\n" +
  "• No le des comida ni agua sin indicación.\n" +
  "• No la manipules más de lo necesario.\n" +
  "• No la persigas ni intentes forzar el vuelo.\n\n" +
  "✅ QUÉ HACER\n" +
  "• Mantén alejadas a las personas y a los animales domésticos.\n" +
  "• Observa si presenta heridas, está muy débil, tiene dificultad para moverse o muestra un comportamiento anómalo.\n" +
  "• Si observas alguno de estos signos, colócala en una caja de cartón ventilada y bien cerrada o en un transportín seguro.\n" +
  "• Mantén la caja o el transportín en un lugar tranquilo, protegido del frío o del calor extremo.\n" +
  "• Realiza únicamente las fotos o vídeos necesarios para la identificación del caso y evita utilizar flash.\n" +
  "• Contacta con el centro de recuperación más cercano para recibir orientación.\n" +
  "• Continúa con el siguiente paso para compartir la información necesaria y recibir una mejor orientación.\n\n"+
  commonEnd
);
  }

  if (hasImmediateRisk(flags) || flags.other) {
	  const commonEnd =
    COMMON_END;

    return (
  "🐦 AVE PEQUEÑA EN SITUACIÓN DE RIESGO\n\n" +
  "🚨 SEÑALES OBSERVADAS\n" +
  getObservedSigns(flags) +
  "\n\n❌ QUÉ NO HACER\n" +
  "• No la persigas ni la manipules más de lo necesario.\n" +
  "• No le des comida ni agua sin indicación.\n" +
  "• No pongas en riesgo tu propia seguridad para intentar rescatarla.\n\n" +
  "✅ QUÉ HACER\n" +
  "• Prioriza siempre tu seguridad, especialmente si te encuentras en una carretera o zona con tráfico.\n" +
  "• Si puedes apartarla del peligro sin asumir riesgos, muévela únicamente a un lugar cercano y seguro.\n" +
  "• Si necesita ayuda, colócala en una caja de cartón ventilada y bien cerrada o en un transportín seguro.\n" +
  "• Mantén la caja o el transportín en un lugar tranquilo, protegido del frío o del calor extremo.\n" +
  "• Realiza únicamente las fotos o vídeos necesarios para la identificación del caso y evita utilizar flash.\n" +
  "• Contacta con el centro de recuperación más cercano para recibir orientación.\n\n"+
  commonEnd
);
  }

  const commonEnd =
    COMMON_END;

 return (
  "🐦 AVE PEQUEÑA\n\n" +
  "⚠️ ANTES DE INTERVENIR\n" +
  "• No todas las aves pequeñas encontradas en el suelo necesitan ayuda.\n" +
  "• Observa la situación desde una distancia prudente antes de intervenir.\n" +
  "• Si no existe un peligro inmediato, evita recogerla.\n\n" +
  "❌ QUÉ NO HACER\n" +
  "• No la recojas automáticamente por estar en el suelo.\n" +
  "• No le des comida ni agua sin indicación.\n" +
  "• No la manipules para comprobar si está sana.\n\n" +
  "✅ QUÉ HACER\n" +
  "• Comprueba si presenta heridas, está muy débil, tiene dificultad para moverse o se encuentra en una situación de peligro.\n" +
  "• Si crees que puede tratarse de una cría, vuelve al paso anterior y selecciona la opción «Es cría».\n" +
  "• Si observas cualquiera de estas señales, vuelve al paso anterior y marca las opciones correspondientes.\n\n"+
  commonEnd
);
}

function getLargeBirdAdvice(flags: FlagsState) {
  if (hasPhysicalWarning(flags)) {
	  const commonEnd =
    COMMON_END;

    return (
  "🦅 RAPAZ O AVE GRANDE QUE PUEDE NECESITAR AYUDA\n\n" +
  "🚨 SEÑALES OBSERVADAS\n" +
  getObservedSigns(flags, true) +
  "\n\n⚠️ PRECAUCIÓN\n" +
  "• Una rapaz o ave grande puede sentirse amenazada y usar el pico, las alas o las garras.\n" +
  "• Mantén una distancia prudente y evita acercar la cara o las manos.\n\n" +
  "❌ QUÉ NO HACER\n" +
  "• No intentes sujetarla por las alas, las patas, el cuello o las plumas.\n" +
  "• No la persigas ni intentes comprobar si puede volar lanzándola al aire.\n" +
  "• No le des comida ni agua sin indicación.\n" +
  "• Realiza únicamente las fotos o vídeos necesarios para la identificación del caso y evita utilizar flash.\n\n" +
  "✅ QUÉ HACER\n" +
  "• Reduce ruidos y evita la presencia innecesaria de personas y animales domésticos.\n" +
  "• Si puedes hacerlo sin riesgo y te indican que debes contenerla, cúbrela con una manta o toalla gruesa.\n" +
  "• Introdúcela en una caja de cartón resistente, ventilada y bien cerrada o en un transportín seguro.\n" +
  "• Mantén la caja o el transportín en un lugar tranquilo, protegido del frío o del calor extremo.\n" +
  "• Si ha sido atacada por un gato o un perro, necesita valoración aunque no observes heridas evidentes.\n" +
  "• Contacta con el centro de recuperación más cercano para recibir orientación.\n" +
  "• Continúa con el siguiente paso para compartir la información necesaria y recibir una mejor orientación.\n\n"+
  commonEnd
);
  }

  if (flags.cannotFly) {
    const additionalRisk = hasImmediateRisk(flags) || flags.other;
	const commonEnd =
    COMMON_END;

    return (
  "🦅 RAPAZ O AVE GRANDE QUE NO VUELA\n\n" +
  "⚠️ ANTES DE INTERVENIR\n" +
  "• Una rapaz o ave grande que no vuela no siempre necesita ser rescatada de inmediato.\n" +
  "• Puede tratarse de un ejemplar joven en fase de aprendizaje o emancipación.\n" +
  "• Los adultos pueden continuar alimentándolo y vigilándolo desde las proximidades.\n" +
  "• Observa la situación desde una distancia prudente antes de intervenir, siempre que no exista un peligro inmediato.\n\n" +
  (additionalRisk
    ? "🚨 SEÑALES OBSERVADAS\n" + getObservedSigns(flags, true) + "\n\n"
    : "🚨 PUEDE NECESITAR AYUDA SI\n" +
      "• Presenta heridas o signos de lesión, está muy débil o respira con dificultad.\n" +
      "• No puede mantenerse erguida o desplazarse con normalidad.\n" +
      "• Tiene un ala caída o en una posición anómala.\n" +
      "• Ha sido atacada por un gato o un perro.\n" +
      "• Permanece expuesta en una carretera, zona de paso o lugar peligroso.\n" +
      "• Tras observarla a distancia, muestra un comportamiento claramente anómalo.\n\n") +
  "❌ QUÉ NO HACER\n" +
  "• No la recojas automáticamente por estar en el suelo o no volar.\n" +
  "• No la persigas ni la lances al aire para comprobar si puede volar.\n" +
  "• No acerques la cara ni las manos desnudas.\n" +
  "• No intentes sujetarla por las alas, las patas o el cuello.\n" +
  "• No le des comida ni agua sin indicación.\n\n" +
  "✅ QUÉ HACER\n" +
  "• Mantén alejadas a las personas y a los animales domésticos y reduce los ruidos.\n" +
  "• Observa si los adultos permanecen cerca o continúan atendiéndola.\n" +
  (additionalRisk
    ? "• Si existe un peligro inmediato, prioriza tu seguridad y solicita ayuda antes de intervenir.\n"
    : "• Si no presenta anomalías y se encuentra en un lugar seguro, evita intervenir y solicita orientación si tienes dudas.\n") +
  "• Si necesita ayuda, contacta con el centro de recuperación más cercano antes de manipularla.\n" +
  "• Realiza únicamente las fotos o vídeos necesarios para la identificación del caso y evita utilizar flash.\n" +
  "• Continúa con el siguiente paso para compartir la información necesaria y recibir una mejor orientación.\n\n"+
  commonEnd
);
  }

  if (hasImmediateRisk(flags) || flags.other) {
	  const commonEnd =
    COMMON_END;

    return (
  "🦅 RAPAZ O AVE GRANDE EN SITUACIÓN DE RIESGO\n\n" +
  "🚨 SEÑALES OBSERVADAS\n" +
  getObservedSigns(flags) +
  "\n\n⚠️ PRECAUCIÓN\n" +
  "• Una rapaz o ave grande puede sentirse amenazada y usar el pico, las alas o las garras.\n" +
  "• Mantén una distancia prudente y evita acorralarla.\n\n" +
  "❌ QUÉ NO HACER\n" +
  "• No pongas en riesgo tu propia seguridad ni intentes detener el tráfico por tu cuenta.\n" +
  "• No la persigas ni intentes capturarla sin orientación.\n" +
  "• No le des comida ni agua sin indicación.\n\n" +
  "✅ QUÉ HACER\n" +
  "• Aleja a las personas y a los animales domésticos si puedes hacerlo con seguridad.\n" +
  "• Si se encuentra en una carretera o zona con tráfico, prioriza siempre tu seguridad y avisa a Emergencias o a los agentes competentes.\n" +
  "• Si necesita ayuda, contacta con el centro de recuperación más cercano para recibir orientación.\n" +
  "• Realiza únicamente las fotos o vídeos necesarios para la identificación del caso y evita utilizar flash.\n\n"+
  commonEnd
);
  }

  const commonEnd =
    COMMON_END;

  return (
  "🦅 RAPAZ O AVE GRANDE\n\n" +
  "⚠️ ANTES DE INTERVENIR\n" +
  "• Mantén una distancia prudente y observa la situación antes de intervenir.\n" +
  "• Una rapaz o ave grande puede sentirse amenazada y usar el pico, las alas o las garras.\n" +
  "• Su presencia en el suelo o en una rama baja no significa necesariamente que necesite ayuda.\n\n" +
  "❌ QUÉ NO HACER\n" +
  "• No la manipules para comprobar si está sana.\n" +
  "• No acerques la cara ni las manos desnudas.\n" +
  "• No le des comida ni agua sin indicación.\n" +
  "• Realiza únicamente las fotos o vídeos necesarios para la identificación del caso y evita utilizar flash.\n\n" +
  "✅ QUÉ HACER\n" +
  "• Comprueba desde una distancia segura si presenta heridas, está muy débil, tiene dificultad para moverse o muestra un comportamiento anómalo.\n" +
  "• Mantén alejadas a las personas y a los animales domésticos y reduce los ruidos.\n" +
  "• Si crees que puede tratarse de una cría o de un ejemplar joven, vuelve al paso anterior y selecciona la opción «Es cría».\n" +
  "• Si observas cualquiera de estas señales, vuelve al paso anterior y marca las opciones correspondientes.\n" +
  "• Si tienes dudas, contacta con el centro de recuperación más cercano para recibir orientación.\n\n"+
  commonEnd
);
}

function getBatAdvice(flags: FlagsState) {
  const needsHelp = hasAnyConcern(flags) || flags.cannotFly;
const commonEnd =
    COMMON_END;

  return (
    "🦇 MURCIÉLAGO\n\n" +
    "⚠️ ANTES DE INTERVENIR\n" +
    "• Encontrar un murciélago durante el día o en el suelo suele indicar que algo no va bien. Probablemente esté debilitado, desorientado o lesionado.\n" +
    "• Un murciélago encontrado en el suelo suele ser un animal vulnerable, no una amenaza.\n" +
    "• Mantén alejados a los niños y a los animales domésticos y observa la situación con calma.\n" +
    (needsHelp
      ? "• Las señales seleccionadas indican que puede necesitar ayuda especializada.\n\n"
      : "• Puede necesitar ayuda si presenta heridas, está muy débil, tiene dificultad para moverse o permanece en el suelo durante el día.\n\n") +
    (needsHelp
      ? "🚨 SEÑALES OBSERVADAS\n" + getObservedSigns(flags, true) + "\n\n"
      : "") +
    "❌ QUÉ NO HACER\n" +
    "• No intentes comprobar si puede volar lanzándolo al aire.\n" +
    "• No le des comida ni agua sin indicación.\n" +
    "• No lo manipules más de lo necesario.\n\n" +
    "✅ QUÉ HACER\n" +
    "• Si es necesario moverlo para evitar un peligro inmediato, protege tus manos con guantes o, si no dispones de ellos, utiliza un trapo, una toalla o una prenda gruesa.\n" +
    "• Manipúlalo únicamente el tiempo imprescindible y evita sujetarlo con fuerza.\n" +
    "• Colócalo en una caja de cartón ventilada y bien cerrada, con una tela o papel absorbente en el fondo.\n" +
    "• Mantén la caja en un lugar tranquilo, oscuro y protegido del frío o del calor extremo.\n" +
    "• Si ha tenido contacto con una persona o con un animal doméstico, comunícalo al centro de recuperación.\n" +
    "• Realiza únicamente las fotos o vídeos necesarios para la identificación del caso y evita utilizar flash.\n" +
    "• Contacta con el centro de recuperación más cercano para recibir orientación.\n" +
    "• Los murciélagos desempeñan un papel esencial en los ecosistemas y ayudan al control natural de numerosos insectos.\n" +
    "• Continúa con el siguiente paso para compartir la información necesaria y recibir una mejor orientación.\n\n"+
  commonEnd
  );
}

function getSmallMammalAdvice(flags: FlagsState) {
  const needsHelp = hasAnyConcern(flags);
const commonEnd =
    COMMON_END;

  return (
    "🐭 PEQUEÑO MAMÍFERO\n\n" +
    "⚠️ ANTES DE INTERVENIR\n" +
    "• Mantén una distancia prudente y observa su comportamiento antes de intervenir.\n" +
    (needsHelp
      ? "• Las señales seleccionadas indican que puede necesitar ayuda especializada.\n\n"
      : "• Si no presenta anomalías ni existe un peligro inmediato, evita recogerlo.\n\n") +
    (needsHelp
      ? "🚨 SEÑALES OBSERVADAS\n" + getObservedSigns(flags) + "\n\n"
      : "") +
    "❌ QUÉ NO HACER\n" +
    "• No lo manipules más de lo necesario.\n" +
    "• No lo sujetes por la cola, las patas o la cabeza.\n" +
    "• No le des comida ni agua sin indicación.\n" +
    "• Realiza únicamente las fotos o vídeos necesarios para la identificación del caso y evita utilizar flash.\n\n" +
    "✅ QUÉ HACER\n" +
    (needsHelp
      ? "• Si puedes hacerlo sin riesgo, colócalo en una caja de cartón ventilada y bien cerrada o en un transportín seguro.\n" +
        "• Mantén la caja o el transportín en un lugar tranquilo, protegido del frío o del calor extremo.\n"
      : "• Mantén alejadas a las personas y a los animales domésticos y solicita orientación si tienes dudas.\n") +
    "• Si ha sido atacado por un gato o un perro, necesita valoración aunque no observes heridas evidentes.\n" +
    "• Contacta con el centro de recuperación más cercano para recibir orientación.\n\n"+
  commonEnd
  );
}

function getLargeMammalAdvice(flags: FlagsState) {
  const needsHelp = hasAnyConcern(flags);
const commonEnd =
    COMMON_END;

  return (
    "🦌 MAMÍFERO GRANDE\n\n" +
    "⚠️ ANTES DE INTERVENIR\n" +
    "• Mantén una distancia prudente y observa la situación antes de intervenir.\n" +
    "• Puede reaccionar de forma imprevisible por miedo, estrés o dolor.\n" +
    (needsHelp
      ? "• Las señales seleccionadas indican que puede necesitar ayuda especializada.\n\n"
      : "• Si no existe un peligro inmediato ni presenta anomalías, evita acercarte o intervenir.\n\n") +
    (needsHelp
      ? "🚨 SEÑALES OBSERVADAS\n" + getObservedSigns(flags) + "\n\n"
      : "") +
    "❌ QUÉ NO HACER\n" +
    "• No intentes capturarlo, sujetarlo ni trasladarlo.\n" +
    "• No lo acorrales ni bloquees su vía de escape.\n" +
    "• No le des comida ni agua sin indicación.\n" +
    "• Realiza únicamente las fotos o vídeos necesarios para la identificación del caso y evita utilizar flash.\n\n" +
    "✅ QUÉ HACER\n" +
    "• Reduce los ruidos y aleja a las personas, los perros y los vehículos si puedes hacerlo con seguridad.\n" +
    "• Si se encuentra en una carretera o zona con tráfico, prioriza siempre tu seguridad y avisa a Emergencias o a los agentes competentes.\n" +
    "• Contacta con el centro de recuperación más cercano para recibir orientación.\n" +
    "• Sigue siempre las indicaciones del personal especializado.\n\n"+
  commonEnd
  );
}

function getReptileAmphibianAdvice(flags: FlagsState) {
  const needsHelp = hasAnyConcern(flags);
const commonEnd =
    COMMON_END;

  return (
    "🐸 REPTIL O ANFIBIO\n\n" +
    "⚠️ ANTES DE INTERVENIR\n" +
    "• Observa la situación desde una distancia prudente antes de intervenir y evita el contacto directo si no puedes identificar el animal con seguridad.\n" +
    (needsHelp
      ? "• Las señales seleccionadas indican que puede necesitar ayuda o ser apartado de un peligro inmediato.\n\n"
      : "• Si se desplaza con normalidad y no existe un peligro inmediato, evita manipularlo o trasladarlo.\n\n") +
    (needsHelp
      ? "🚨 SEÑALES OBSERVADAS\n" + getObservedSigns(flags) + "\n\n"
      : "") +
    "❌ QUÉ NO HACER\n" +
    "• No lo manipules sin necesidad.\n" +
    "• No manipules serpientes o culebras directamente con las manos si no puedes identificarlas con seguridad.\n" +
    "• No lo traslades a grandes distancias.\n" +
    "• No le des comida ni agua sin indicación.\n\n" +
    "✅ QUÉ HACER\n" +
    "• Reduce los ruidos y evita la presencia de personas y animales domésticos.\n" +
    "• Si debes moverlo por seguridad y puedes hacerlo sin riesgo, utiliza un recipiente seguro y ventilado.\n" +
    "• Déjalo en una zona adecuada, lo más cercana posible al lugar donde fue encontrado.\n" +
    "• Realiza únicamente las fotos o vídeos necesarios para la identificación del caso y evita utilizar flash.\n" +
    "• Contacta con el centro de recuperación más cercano para recibir orientación.\n\n"+
  commonEnd
  );
}

function getUnknownAnimalAdvice(flags: FlagsState) {
  const needsHelp = hasAnyConcern(flags) || flags.cannotFly;
const commonEnd =
    COMMON_END;

  return (
    "❓ NO ESTOY SEGURO\n\n" +
    "⚠️ ANTES DE INTERVENIR\n" +
    "• No pasa nada. No es necesario identificar exactamente al animal para poder ayudar.\n" +
    "• Observa la situación desde una distancia prudente antes de intervenir.\n" +
    (needsHelp
      ? "• Las señales seleccionadas indican que puede necesitar ayuda especializada.\n\n"
      : "• Si no presenta anomalías ni existe un peligro inmediato, evita intervenir.\n\n") +
    (needsHelp
      ? "🚨 SEÑALES OBSERVADAS\n" + getObservedSigns(flags, true) + "\n\n"
      : "") +
    "❌ QUÉ NO HACER\n" +
    "• No lo manipules ni lo traslades sin necesidad.\n" +
    "• No intentes liberarlo a la fuerza.\n" +
    "• No le des comida ni agua sin indicación.\n\n" +
    "✅ QUÉ HACER\n" +
    "• Mantén alejadas a las personas y a los animales domésticos.\n" +
    "• Si existe un peligro inmediato, prioriza tu seguridad y solicita ayuda antes de intervenir.\n" +
    "• Realiza únicamente las fotos o vídeos necesarios para la identificación del caso y evita utilizar flash.\n" +
    "• Contacta con el centro de recuperación más cercano para recibir orientación.\n\n"+
  commonEnd
  );
}

function getAdvice(
  animalState: AnimalState,
  animalType: AnimalType,
  flags: FlagsState,
) {
     if (animalState === "dead") {
		 const commonEnd =
    COMMON_END;

     return (
    "☠️ ANIMAL MUERTO\n\n" +
    "⚠️ ANTES DE INTERVENIR\n" +
    "• Encontrar un animal muerto puede resultar impactante. Antes de actuar, observa la situación con calma y evita modificar el entorno.\n" +
    "• Lo que observes puede ayudar a identificar la causa de la muerte y a prevenir que otros animales sufran el mismo problema.\n\n" +
    "🔍 QUÉ OBSERVAR\n" +
    "• Comprueba desde una distancia segura si hay más animales muertos o afectados en la zona.\n" +
    "• Fíjate si existen posibles causas visibles, como tendidos eléctricos, vallados, carreteras, cristaleras, trampas, cebos o restos sospechosos, sin acercarte ni manipular nada.\n" +
    "• Comprueba también si existe algún riesgo para las personas o los animales domésticos.\n\n" +
    "❌ QUÉ NO HACER\n" +
    "• No toques ni muevas el cadáver, salvo que exista un peligro inmediato y recibas indicaciones para hacerlo.\n" +
    "• No manipules cebos, recipientes, sustancias u otros objetos sospechosos.\n" +
    "• No alteres el lugar del hallazgo.\n\n" +
    "✅ QUÉ HACER\n" +
    "• Realiza únicamente las fotografías o vídeos necesarios para documentar el animal y el entorno, sin modificar la escena.\n" +
    "• Facilita la ubicación exacta del hallazgo. Esta información puede ser fundamental para que los profesionales localicen el lugar, investiguen la causa y adopten las medidas necesarias.\n" +
    "• Comunica el hallazgo a los Agentes Forestales, agentes medioambientales, fuerzas y cuerpos de seguridad o servicios de emergencias, aportando toda la información que hayas podido observar.\n\n"+
  commonEnd
  );
   }

  // Prioridad 1: el atrapamiento requiere instrucciones específicas de liberación y seguridad.
  if (flags.trapped) {
    return addSupplementalAdvice(getTrappedAdvice(animalType), flags);
  }

  // Prioridad 2: una cría necesita primero valorar edad, dependencia y posible reunificación.
  if (flags.baby) {
    return addSupplementalAdvice(getBabyAdvice(animalType), flags);
  }

  let advice: string;

  switch (animalType) {
    case "smallBird":
      advice = getSmallBirdAdvice(flags);
      break;
    case "largeBird":
      advice = getLargeBirdAdvice(flags);
      break;
    case "bat":
      advice = getBatAdvice(flags);
      break;
    case "smallMammal":
      advice = getSmallMammalAdvice(flags);
      break;
    case "largeMammal":
      advice = getLargeMammalAdvice(flags);
      break;
    case "reptileAmphibian":
      advice = getReptileAmphibianAdvice(flags);
      break;
    default:
      advice = getUnknownAnimalAdvice(flags);
  }

  return addSupplementalAdvice(advice, flags);
}

function normalizeWhatsAppNumber(phone: string) {
  let normalized = phone.replace(/[^\d+]/g, "").trim();

  if (!normalized) return "";
  if (normalized.startsWith("+")) normalized = normalized.slice(1);
  if (normalized.startsWith("00")) normalized = normalized.slice(2);

  return normalized.replace(/[^\d]/g, "");
}

function countDigits(phone: string) {
  return (phone.match(/\d/g) || []).length;
}

function showMessage(title: string, message: string) {
  if (Platform.OS === "web") {
    window.alert(`${title}\n\n${message}`);
    return;
  }

  Alert.alert(title, message);
}

type SosAssistantProps = {
  initialCase?: RescueCase | null;
};

type RescueCoordinates = NonNullable<RescueCase["coords"]>;

function normalizeInitialStep(step: number | undefined): Step {
  if (!step) return 1;
  if (step >= 5) return 4;
  if (step >= 4) return 3;
  if (step === 2 || step === 3) return step;
  return 1;
}

function formatCoordinates(coords: RescueCoordinates) {
  return `${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)}`;
}

function normalizeUsefulText(value: string | null | undefined) {
  const normalized = value?.trim();
  return normalized && normalized.length > 0 ? normalized : undefined;
}

function appendUniqueLocationPart(parts: string[], value: string | null | undefined) {
  const normalized = normalizeUsefulText(value);

  if (
    normalized &&
    !parts.some((part) => part.toLowerCase() === normalized.toLowerCase())
  ) {
    parts.push(normalized);
  }
}

function buildApproximateLocation(
  address: Location.LocationGeocodedAddress,
) {
  const parts: string[] = [];
  const primaryParts: string[] = [];

  if (address.street) {
    appendUniqueLocationPart(primaryParts, address.street);
    appendUniqueLocationPart(primaryParts, address.streetNumber);
  }

  const primary = normalizeUsefulText(address.name);

  if (primary && primary !== address.streetNumber) {
    appendUniqueLocationPart(parts, primary);
  } else if (primaryParts.length > 0) {
    appendUniqueLocationPart(parts, primaryParts.join(", "));
  }

  appendUniqueLocationPart(parts, address.district);
  appendUniqueLocationPart(parts, address.city);
  appendUniqueLocationPart(parts, address.subregion);
  appendUniqueLocationPart(parts, address.region);

  return normalizeUsefulText(parts.slice(0, 3).join(", "));
}

async function reverseGeocodeWithTimeout(coords: RescueCoordinates) {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  try {
    const timeout = new Promise<null>((resolve) => {
      timeoutId = setTimeout(() => resolve(null), 3500);
    });

    const result = await Promise.race([
      Location.reverseGeocodeAsync(coords),
      timeout,
    ]);

    if (!result || result.length === 0) return undefined;

    for (const address of result) {
      const approximateLocation = buildApproximateLocation(address);
      if (approximateLocation) return approximateLocation;
    }
  } catch {
    return undefined;
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }

  return undefined;
}

function buildLocationSummaryLines(
  approximateLocation: string | undefined,
  coords: RescueCoordinates | null,
) {
  const lines: string[] = [];

  if (approximateLocation) {
    lines.push(`Referencia del lugar: ${approximateLocation}`);
  }

  if (coords) {
    lines.push(
      `Coordenadas: ${formatCoordinates(coords)}`,
      `Mapa: https://maps.google.com/?q=${coords.latitude},${coords.longitude}`,
    );
  }

  return lines;
}

export default function HomeScreen({ initialCase = null }: SosAssistantProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [currentCase, setCurrentCase] = useState<RescueCase | null>(initialCase);
  const currentCaseRef = useRef<RescueCase | null>(initialCase);
  const [step, setStep] = useState<Step>(normalizeInitialStep(initialCase?.step));

  const [showContacts, setShowContacts] = useState(false);
  const [showWhatsAppOptions, setShowWhatsAppOptions] = useState(false);
  const [showHelpSources, setShowHelpSources] = useState(false);
  const [showProvinces, setShowProvinces] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [provinceSearch, setProvinceSearch] = useState("");

  const [customWhatsAppNumber, setCustomWhatsAppNumber] = useState("");
  const [showOtherContact, setShowOtherContact] = useState(false);
  const [hasSentWhatsApp, setHasSentWhatsApp] = useState(false);
  const [showWhatsAppConfirmation, setShowWhatsAppConfirmation] =
    useState(false);
  const [lastWhatsAppNumber, setLastWhatsAppNumber] = useState("");
  const [showEmptyStep3Confirmation, setShowEmptyStep3Confirmation] =
    useState(false);

  const [animalState, setAnimalState] = useState<AnimalState>(
    (initialCase?.animalState as AnimalState) ?? "alive",
  );
  const [animalType, setAnimalType] = useState<AnimalType>(
    (initialCase?.animalType as AnimalType) ?? "unknown",
  );

  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [videoUri, setVideoUri] = useState<string | null>(null);

  const [locationText, setLocationText] = useState(
    initialCase?.locationText ?? "Ubicación no capturada todavía.",
  );
  const [approximateLocation, setApproximateLocation] = useState(
    normalizeUsefulText(initialCase?.approximateLocation),
  );
  const [coords, setCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(initialCase?.coords ?? null);
  const [locationCaptured, setLocationCaptured] = useState(
    initialCase?.locationCaptured ?? false,
  );
  const [locationLoading, setLocationLoading] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null);
  const shouldConfirmExitRef = useRef(initialCase !== null);
  const saveCurrentProgressRef = useRef<() => Promise<void>>(async () => {});
  const flowCompletedRef = useRef(false);
  const reverseGeocodeCacheRef = useRef<Record<string, string | null>>({});
  const pendingReverseGeocodeRef = useRef<Set<string>>(new Set());
  const forwardArrowHintX = useRef(new Animated.Value(0)).current;
  const forwardArrowHintScale = useRef(new Animated.Value(1)).current;
  const forwardArrowReadinessRef = useRef<{
    ready: boolean;
    step: Step | null;
  }>({ ready: false, step: null });
  const [scrollY, setScrollY] = useState(0);
  const [scrollContentHeight, setScrollContentHeight] = useState(0);
  const [scrollLayoutHeight, setScrollLayoutHeight] = useState(0);
  const [flags, setFlags] = useState<FlagsState>(
    initialCase?.flags ?? createInitialFlags(),
  );

  const advice = useMemo(
    () => getAdvice(animalState, animalType, flags),
    [animalState, animalType, flags],
  );

  const selectedFlags = useMemo(
    () =>
      FLAG_LABELS.filter(({ key }) => flags[key])
        .map(({ label }) => label)
        .join(", ") || "Sin marcas",
    [flags],
  );

  const selectedAnimalLabel = useMemo(
    () =>
      ANIMAL_OPTIONS.find((option) => option.key === animalType)?.label ||
      "No indicado",
    [animalType],
  );

  const selectedAnimalStateLabel = useMemo(
    () =>
      ANIMAL_STATE_OPTIONS.find((option) => option.key === animalState)
        ?.label || "No indicado",
    [animalState],
  );

  const isCurrentStepReadyToContinue = useMemo(
    () => {
      if (step === 1) {
        return (
          Boolean(animalState) &&
          Boolean(animalType) &&
          Object.values(flags).some(Boolean)
        );
      }

      if (step === 3) {
        return Boolean(photoUri || videoUri || coords);
      }

      return false;
    },
    [animalState, animalType, coords, flags, photoUri, step, videoUri],
  );

  const hasMeaningfulProgress = useMemo(() => {
    if (initialCase || currentCase) return true;

    return (
      step !== 1 ||
      animalState !== "alive" ||
      animalType !== "unknown" ||
      Object.values(flags).some(Boolean) ||
      photoUri !== null ||
      videoUri !== null ||
      locationCaptured ||
      coords !== null
    );
  }, [
    animalState,
    animalType,
    coords,
    currentCase,
    flags,
    initialCase,
    locationCaptured,
    photoUri,
    step,
    videoUri,
  ]);

  useEffect(() => {
    shouldConfirmExitRef.current = hasMeaningfulProgress;
  }, [hasMeaningfulProgress]);

  useEffect(() => {
    if (forwardArrowReadinessRef.current.step !== step) {
      forwardArrowReadinessRef.current = {
        ready: isCurrentStepReadyToContinue,
        step,
      };
      forwardArrowHintX.stopAnimation();
      forwardArrowHintScale.stopAnimation();
      forwardArrowHintX.setValue(0);
      forwardArrowHintScale.setValue(1);
      return;
    }

    if (!isCurrentStepReadyToContinue) {
      forwardArrowReadinessRef.current.ready = false;
      forwardArrowHintX.stopAnimation();
      forwardArrowHintScale.stopAnimation();
      forwardArrowHintX.setValue(0);
      forwardArrowHintScale.setValue(1);
      return;
    }

    if (forwardArrowReadinessRef.current.ready) return;

    forwardArrowReadinessRef.current.ready = true;
    forwardArrowHintX.setValue(0);
    forwardArrowHintScale.setValue(1);

    Animated.sequence([
      Animated.parallel([
        Animated.timing(forwardArrowHintX, {
          toValue: 7,
          duration: 320,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: Platform.OS !== "web",
        }),
        Animated.timing(forwardArrowHintScale, {
          toValue: 1.12,
          duration: 320,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: Platform.OS !== "web",
        }),
      ]),
      Animated.parallel([
        Animated.timing(forwardArrowHintX, {
          toValue: 0,
          duration: 360,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: Platform.OS !== "web",
        }),
        Animated.timing(forwardArrowHintScale, {
          toValue: 1,
          duration: 360,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: Platform.OS !== "web",
        }),
      ]),
    ]).start();
  }, [
    forwardArrowHintScale,
    forwardArrowHintX,
    isCurrentStepReadyToContinue,
    step,
  ]);

  const mergedProvinceContacts = useMemo(() => {
    const madridEntry = {
      province: "Madrid",
      contacts: MADRID_PROVINCE_CONTACTS,
    };
    const base = Array.isArray(provinceContacts) ? provinceContacts : [];
    const withoutMadrid = base.filter((item) => item.province !== "Madrid");

    return [madridEntry, ...withoutMadrid].sort((a, b) =>
      a.province.localeCompare(b.province, "es"),
    );
  }, []);

  const filteredProvinceContacts = useMemo(() => {
    const normalizedSearch = provinceSearch.trim().toLowerCase();

    if (!normalizedSearch) return mergedProvinceContacts;

    return mergedProvinceContacts.filter((item) =>
      item.province
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .includes(
          normalizedSearch.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
        ),
    );
  }, [provinceSearch, mergedProvinceContacts]);

  const showSummaryActionBar =
    step === 4 &&
    !showContacts &&
    !showWhatsAppConfirmation &&
    !showWhatsAppOptions &&
    !showProvinces &&
    !selectedProvince;

  const canShowStep1ScrollHint =
    step === 1 &&
    !showContacts &&
    !showWhatsAppOptions &&
    !showProvinces &&
    !selectedProvince &&
    scrollContentHeight > scrollLayoutHeight + 40;

  const isNearBottom = scrollY + scrollLayoutHeight >= scrollContentHeight - 80;


  useEffect(() => {
    setScrollY(0);
    requestAnimationFrame(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    });
  }, [
    step,
    showContacts,
    showWhatsAppOptions,
    showProvinces,
    selectedProvince,
  ]);

  const generatedSummary = useMemo(() => {
    return [
      "AVISO DE RESCATE DE FAUNA",
      `Estado del animal: ${selectedAnimalStateLabel}`,
      `Tipo de animal: ${selectedAnimalLabel}`,
      ...buildLocationSummaryLines(approximateLocation, coords),
      `Señales observadas: ${selectedFlags}`,
      `Foto capturada: ${photoUri ? "sí" : "no"}`,
      `Vídeo capturado: ${videoUri ? "sí" : "no"}`,
    ]
      .filter(Boolean)
      .join("\n");
  }, [
    approximateLocation,
    coords,
    photoUri,
    selectedAnimalLabel,
    selectedAnimalStateLabel,
    selectedFlags,
    videoUri,
  ]);

  const saveToGallery = async (uri: string, label: string) => {
    try {
      const permission = await MediaLibrary.requestPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Permiso recomendado",
          `No se ha concedido permiso para guardar ${label} en la galería.`,
        );
        return;
      }

      await MediaLibrary.saveToLibraryAsync(uri);
    } catch {
      Alert.alert(
        "No se pudo guardar",
        `No se pudo guardar ${label} en la galería del dispositivo.`,
      );
    }
  };

  const pickPhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permiso necesario",
        "Necesitamos acceso a la cámara para capturar la foto.",
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      quality: 0.7,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setPhotoUri(uri);

      await saveCurrentProgress();

      await saveToGallery(uri, "la foto");
    }
  };

  const pickVideo = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permiso necesario",
        "Necesitamos acceso a la cámara para grabar el vídeo.",
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["videos"],
      quality: 0.7,
      videoMaxDuration: 20,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setVideoUri(uri);

      await saveCurrentProgress();

      await saveToGallery(uri, "el vídeo");
    }
  };

  const captureLocation = async () => {
    try {
      setLocationLoading(true);

      const permission = await Location.requestForegroundPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Permiso necesario",
          "Necesitamos tu ubicación para enviar el aviso.",
        );
        return;
      }

      const current = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const newCoords = {
        latitude: current.coords.latitude,
        longitude: current.coords.longitude,
      };

      const newLocationText =
        formatCoordinates(newCoords);

      setCoords(newCoords);
      setLocationText(newLocationText);
      setApproximateLocation(undefined);
      setLocationCaptured(true);

      await saveCurrentProgress(step, {
        coords: newCoords,
        locationText: newLocationText,
        approximateLocation: undefined,
        locationCaptured: true,
      });

      void updateApproximateLocation(newCoords, newLocationText);
    } catch {
      Alert.alert(
        "No se pudo obtener la ubicación",
        "Inténtalo de nuevo en unos segundos.",
      );
    } finally {
      setLocationLoading(false);
    }
  };

  const incompatibleWithNormalAppearance: Array<keyof FlagsState> = [
    "bleeding",
    "catDog",
    "canNotMove",
    "roadRisk",
    "trapped",
    "cannotFly",
    "weakness",
    "breathing",
    "other",
  ];

  const toggleFlag = (key: keyof FlagsState) => {
    if (
      key === "cannotFly" &&
      !flags.cannotFly &&
      !canUseCannotFly(animalType)
    ) {
      Alert.alert(
        "Revisa el tipo de animal",
        'La opción "No vuela" solo tiene sentido para aves o murciélagos. Cambia primero el tipo de animal si corresponde.',
      );
      return;
    }

    setFlags((prev) => {
      const willActivate = !prev[key];

      if (key === "normalAppearance" && willActivate) {
        const clearedFlags = { ...prev, normalAppearance: true };

        incompatibleWithNormalAppearance.forEach((flagKey) => {
          clearedFlags[flagKey] = false;
        });

        return clearedFlags;
      }

      const nextFlags = {
        ...prev,
        [key]: willActivate,
      };

      if (willActivate && incompatibleWithNormalAppearance.includes(key)) {
        nextFlags.normalAppearance = false;
      }

      return nextFlags;
    });
  };

  const selectAnimalType = (nextAnimalType: AnimalType) => {
    if (flags.cannotFly && !canUseCannotFly(nextAnimalType)) {
      Alert.alert(
        "Situación no compatible",
        'Has marcado "No vuela", pero el tipo seleccionado no parece compatible. Se desmarcará esa opción para evitar confusión.',
      );
      setFlags((prev) => ({ ...prev, cannotFly: false }));
    }

    setAnimalType(nextAnimalType);

    if (animalState === "dead") {
      setStep(2);
    }
  };

  const openWhatsAppWithNumber = async (number: string) => {
    const cleaned = normalizeWhatsAppNumber(number);

    if (!cleaned || countDigits(cleaned) < 9) {
      showMessage(
        "Número no válido",
        "Introduce un número de WhatsApp válido, con prefijo si hace falta.",
      );
      return;
    }

    const text = encodeURIComponent(generatedSummary);

    if (Platform.OS === "web") {
      const url = `https://wa.me/${cleaned}?text=${text}`;

      window.open(url, "_blank");

      setLastWhatsAppNumber(cleaned);
      setShowWhatsAppConfirmation(true);
      setHasSentWhatsApp(true);

      return;
    }

    const urls = [
      `whatsapp://send?phone=${cleaned}&text=${text}`,
      `https://wa.me/${cleaned}?text=${text}`,
      `https://api.whatsapp.com/send?phone=${cleaned}&text=${text}`,
    ];

    for (const url of urls) {
      try {
        await Linking.openURL(url);
        setLastWhatsAppNumber(cleaned);
        setShowWhatsAppConfirmation(true);
        setHasSentWhatsApp(true);
        return;
      } catch {
        // Probar la siguiente opción
      }
    }

    showMessage(
      "No se pudo abrir WhatsApp",
      "Comprueba que WhatsApp está instalado y vuelve a intentarlo.",
    );
  };

  const openMaps = async () => {
    if (!coords) return;

    const url = `https://maps.google.com/?q=${coords.latitude},${coords.longitude}`;

    if (Platform.OS === "web") {
      window.open(url, "_blank", "noopener,noreferrer");
      return;
    }

    await Linking.openURL(url);
  };

  const copySummary = async () => {
    await Clipboard.setStringAsync(generatedSummary);
    showMessage("Resumen copiado", "El resumen se ha copiado al portapapeles.");
  };

  const callNumber = async (phoneNumber: string) => {
    const url = `tel:${phoneNumber}`;
    await Linking.openURL(url);
  };

const saveCurrentProgress = async (
  nextStep: Step = step,
  overrides: Partial<
    Pick<
      RescueCase,
      | "animalState"
      | "animalType"
      | "flags"
      | "locationText"
      | "approximateLocation"
      | "coords"
      | "locationCaptured"
    >
  > = {},
) => {
  const savedCase = await persistCurrentCase(
    {
      step: nextStep,
      animalState,
      animalType,
      flags,
      locationText,
      approximateLocation,
      coords,
      locationCaptured,
      ...overrides,
    },
    currentCaseRef.current,
  );

  currentCaseRef.current = savedCase;
  setCurrentCase(savedCase);

  return savedCase;
};

  const updateApproximateLocation = async (
    nextCoords: RescueCoordinates,
    nextLocationText: string,
  ) => {
    const coordsKey = formatCoordinates(nextCoords);

    if (pendingReverseGeocodeRef.current.has(coordsKey)) return;

    const hasCachedLocation = Object.prototype.hasOwnProperty.call(
      reverseGeocodeCacheRef.current,
      coordsKey,
    );
    const cachedLocation = reverseGeocodeCacheRef.current[coordsKey];
    const savedStep = normalizeInitialStep(currentCaseRef.current?.step ?? step);

    if (flowCompletedRef.current) return;

    if (hasCachedLocation && !cachedLocation) return;

    if (cachedLocation) {
      setApproximateLocation(cachedLocation);
      await saveCurrentProgress(savedStep, {
        coords: nextCoords,
        locationText: nextLocationText,
        approximateLocation: cachedLocation,
        locationCaptured: true,
      });
      return;
    }

    pendingReverseGeocodeRef.current.add(coordsKey);

    try {
      const nextApproximateLocation = await reverseGeocodeWithTimeout(nextCoords);

      if (flowCompletedRef.current) return;

      if (!nextApproximateLocation) {
        reverseGeocodeCacheRef.current[coordsKey] = null;
        return;
      }

      reverseGeocodeCacheRef.current[coordsKey] = nextApproximateLocation;
      setApproximateLocation(nextApproximateLocation);

      await saveCurrentProgress(savedStep, {
        coords: nextCoords,
        locationText: nextLocationText,
        approximateLocation: nextApproximateLocation,
        locationCaptured: true,
      });
    } finally {
      pendingReverseGeocodeRef.current.delete(coordsKey);
    }
  };

  useEffect(() => {
    saveCurrentProgressRef.current = async () => {
      await saveCurrentProgress();
    };
  });

  const completeAndReturnHome = async () => {
    flowCompletedRef.current = true;

    await completeCurrentCase(
      {
        step,
        animalState,
        animalType,
        flags,
        locationText,
        approximateLocation,
        coords,
        locationCaptured,
      },
      currentCaseRef.current,
    );

    router.replace("/");
  };

  const finishFlow = () => {
    const confirmationMessage =
      "¿Deseas finalizar este aviso?\n\nSi continúas, el aviso se guardará en el historial y volverás a la pantalla inicial.";

    const thankYouMessage = "Gracias por colaborar y ayudar a los animales.";

    if (Platform.OS === "web") {
      const confirmed = window.confirm(confirmationMessage);

      if (confirmed) {
        window.alert(thankYouMessage);
        void completeAndReturnHome();
      }

      return;
    }

    Alert.alert("Finalizar aviso", confirmationMessage, [
      {
        text: "No",
        style: "cancel",
      },
      {
        text: "Sí",
        onPress: () => {
          Alert.alert("Gracias", thankYouMessage, [
            {
              text: "Aceptar",
              onPress: () => void completeAndReturnHome(),
            },
          ]);
        },
      },
    ]);
  };

  const advanceToNextStep = async () => {
    if (step < 4) {
      const nextStep = (step + 1) as Step;

      await saveCurrentProgress(nextStep);

      setStep(nextStep);
    }
  };

  const goNext = async () => {
    if (step === 3 && !photoUri && !videoUri && !coords) {
      setShowEmptyStep3Confirmation(true);
      return;
    }

    await advanceToNextStep();
  };

  const goBack = useCallback(() => {
    if (showEmptyStep3Confirmation) {
      setShowEmptyStep3Confirmation(false);
      return;
    }

    if (showWhatsAppConfirmation) {
      setShowWhatsAppConfirmation(false);
      return;
    }

    if (selectedProvince) {
      setSelectedProvince(null);
      return;
    }

    if (showProvinces) {
      setShowProvinces(false);
      setShowContacts(true);
      return;
    }

    if (showContacts) {
      setShowContacts(false);
      return;
    }

    if (showWhatsAppOptions) {
      setShowWhatsAppOptions(false);
      return;
    }

    if (step > 1) {
      setStep((prev) => (prev - 1) as Step);
    }
  }, [
    selectedProvince,
    showContacts,
    showEmptyStep3Confirmation,
    showProvinces,
    showWhatsAppConfirmation,
    showWhatsAppOptions,
    step,
  ]);

  useEffect(() => {
    if (Platform.OS !== "web") return;

    let allowNavigation = false;
    const guardedUrl = window.location.href;

    const addGuardEntry = () => {
      window.history.pushState({ sosFaunaBackGuard: true }, "", guardedUrl);
    };

    const guardTimer = window.setTimeout(addGuardEntry, 0);

    const handlePopState = () => {
      if (allowNavigation) return;

      if (!shouldConfirmExitRef.current) {
        allowNavigation = true;
        router.replace("/");
        return;
      }

      const confirmed = window.confirm(
        "¿Deseas salir de este aviso?\n\nEl progreso quedará guardado y podrás continuarlo o eliminarlo desde la pantalla inicial.",
      );

      if (confirmed) {
        allowNavigation = true;

        void (async () => {
          await saveCurrentProgressRef.current();
          router.replace("/");
        })();

        return;
      }

      addGuardEntry();
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.clearTimeout(guardTimer);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [router]);

  const handleOpenHelp = () => {
    setShowContacts(true);
    setShowProvinces(false);
    setSelectedProvince(null);
  };

  const handleOpenProvincePhones = () => {
    setShowContacts(false);
    setShowProvinces(true);
    setSelectedProvince(null);
    setProvinceSearch("");
  };

  const renderContacts = () => (
    <SectionCard title="Teléfonos de ayuda">
      <View style={styles.sectionContent}>
        <Text style={styles.sectionDescription}>
          Elige el servicio adecuado según la urgencia y la ubicación del animal.
        </Text>

        <Text style={styles.sectionDescription}>
          Llama al 112 si existe peligro inmediato para personas, tráfico o seguridad. Para otros casos, contacta con el servicio más adecuado.
        </Text>

        <Text style={styles.subheading}>Ayuda inmediata</Text>

        {NATIONAL_HELP_CONTACTS.map((contact) => (
          <Pressable
            key={contact.name}
            style={[
              styles.contactRow,
              contact.phone === "112" && styles.contactRowEmergency,
            ]}
            onPress={() => callNumber(contact.phone)}
          >
            <View style={styles.contactTextBlock}>
              <Text style={styles.contactName}>
                {contact.phone === "112"
                  ? "🚨 Emergencias"
                  : contact.phone === "062"
                    ? "🌿 SEPRONA"
                    : contact.phone === "092"
                      ? "🚓 Policía Municipal / Local"
                      : "👮 Policía Nacional"}
              </Text>
              <Text style={styles.contactNote}>{contact.note}</Text>
            </View>
            <View style={styles.contactPhonePill}>
              <Text style={styles.contactPhonePillText}>{contact.phone}</Text>
            </View>
          </Pressable>
        ))}

        <Text style={styles.subheading}>Ayuda por provincias</Text>

        <Pressable
          style={styles.primaryButton}
          onPress={handleOpenProvincePhones}
        >
          <Text style={styles.primaryButtonText}>
            📍 Buscar ayuda en mi provincia
          </Text>
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          onPress={() => setShowHelpSources((current) => !current)}
        >
          <Text style={styles.secondaryButtonText}>Fuentes y aviso legal</Text>
        </Pressable>

        {showHelpSources ? (
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              Fuentes de información:
              {"\n\n"}• Emergencias 112: www.proteccioncivil.es/catalogo/info112/
              {"\n"}• Guardia Civil (SEPRONA): www.guardiacivil.es
              {"\n"}• Policía Nacional: www.policia.es
              {"\n"}• Agentes Forestales de la Comunidad de Madrid:
              {"\n"}{" "}
              www.comunidad.madrid/centros/emisora-cuerpo-agentes-forestales
              {"\n\n"}SOS Fauna España es una aplicación independiente y no está
              afiliada ni representa a ninguna administración pública, servicio de
              emergencias o cuerpo policial.
            </Text>
          </View>
        ) : null}
      </View>
    </SectionCard>
  );

  const renderProvinceList = () => (
    <SectionCard title="Teléfonos por provincias">
      <View style={styles.sectionContent}>
        <Text style={styles.sectionDescription}>
          Selecciona una provincia para ver los centros disponibles.
        </Text>

        <TextInput
          placeholder="Buscar provincia"
          value={provinceSearch}
          onChangeText={setProvinceSearch}
          style={styles.input}
          autoCapitalize="words"
        />

        {filteredProvinceContacts.length ? (
          filteredProvinceContacts.map((item) => (
            <Pressable
              key={item.province}
              style={styles.contactRow}
              onPress={() => setSelectedProvince(item.province)}
            >
              <View style={styles.contactTextBlock}>
                <Text style={styles.contactName}>{item.province}</Text>
                <Text style={styles.contactNote}>
                  {item.contacts.length} contacto
                  {item.contacts.length === 1 ? "" : "s"}
                </Text>
              </View>
              <Text style={styles.contactPhone}>Ver</Text>
            </Pressable>
          ))
        ) : (
          <View style={styles.warningBox}>
            <Text style={styles.warningText}>
              No se han encontrado provincias con ese nombre.
            </Text>
          </View>
        )}
      </View>
    </SectionCard>
  );

  const renderProvinceDetail = () => {
    const province = mergedProvinceContacts.find(
      (p) => p.province === selectedProvince,
    );

    if (!province) return null;

    return (
      <SectionCard title={province.province}>
        <View style={styles.sectionContent}>
          <Text style={styles.sectionDescription}>
            Estos son los contactos disponibles para esta provincia.
          </Text>

          {province.contacts.map((contact) => (
            <Pressable
              key={`${province.province}-${contact.name}-${contact.phone}`}
              style={styles.contactRow}
              onPress={() => callNumber(contact.phone)}
            >
              <View style={styles.contactTextBlock}>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactNote}>{contact.note}</Text>
              </View>
              <Text style={styles.contactPhone}>{contact.phone}</Text>
            </Pressable>
          ))}
        </View>
      </SectionCard>
    );
  };

  const renderWhatsAppConfirmation = () => (
    <SectionCard title="Confirmar envío">
      <View style={styles.sectionContent}>
        <Text style={styles.sectionDescription}>
          ¿Has conseguido enviar el aviso al contacto de WhatsApp?
        </Text>

        <Pressable style={styles.primaryButton} onPress={finishFlow}>
          <Text style={styles.primaryButtonText}>Sí, finalizar aviso</Text>
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          onPress={() => {
            setShowWhatsAppConfirmation(false);
            openWhatsAppWithNumber(lastWhatsAppNumber);
          }}
        >
          <Text style={styles.secondaryButtonText}>No, volver a WhatsApp</Text>
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          onPress={() => setShowWhatsAppConfirmation(false)}
        >
          <Text style={styles.secondaryButtonText}>Volver a opciones</Text>
        </Pressable>
      </View>
    </SectionCard>
  );

  const renderEmptyStep3Confirmation = () => (
    <SectionCard title="Continuar sin información">
      <View style={styles.sectionContent}>
        <Text style={styles.sectionDescription}>
          No has añadido ubicación, foto ni vídeo. Esta información puede ser
          muy útil para valorar la situación y localizar al animal. ¿Quieres
          continuar de todos modos?
        </Text>

        <Pressable
          style={styles.secondaryButton}
          onPress={() => setShowEmptyStep3Confirmation(false)}
        >
          <Text style={styles.secondaryButtonText}>
            Volver y añadir información
          </Text>
        </Pressable>

        <Pressable
          style={styles.primaryButton}
          onPress={() => {
            setShowEmptyStep3Confirmation(false);
            void advanceToNextStep();
          }}
        >
          <Text style={styles.primaryButtonText}>Continuar sin añadirla</Text>
        </Pressable>
      </View>
    </SectionCard>
  );

  const renderWhatsAppOptions = () => (
    <SectionCard title="Enviar el aviso">
      <View style={styles.sectionContent}>
        <Text style={styles.sectionDescription}>
          Elige cómo deseas enviar este aviso.
        </Text>

        <View style={styles.sectionGroup}>
          <Pressable
            style={styles.primaryButton}
            onPress={() => openWhatsAppWithNumber(GREFA_WHATSAPP)}
          >
            <Text style={styles.primaryButtonText}>Enviar a GREFA (Madrid)</Text>
          </Pressable>

          <View style={styles.warningBox}>
            <Text style={styles.warningText}>
              ℹ️ Solo para avisos localizados en la Comunidad de Madrid.
            </Text>
          </View>
        </View>

        <Pressable
          style={[styles.secondaryButton, styles.sendOtherContactButton]}
          onPress={() => setShowOtherContact((current) => !current)}
        >
          <Text style={styles.secondaryButtonText}>Enviar a otro contacto</Text>
        </Pressable>

        {showOtherContact ? (
          <>
            <TextInput
              placeholder="Enviar a otro contacto de WhatsApp"
              value={customWhatsAppNumber}
              onChangeText={setCustomWhatsAppNumber}
              keyboardType="phone-pad"
              style={styles.input}
            />

            <Pressable
              style={styles.secondaryButton}
              onPress={() => openWhatsAppWithNumber(customWhatsAppNumber)}
            >
              <Text style={styles.secondaryButtonText}>Enviar por WhatsApp</Text>
            </Pressable>
          </>
        ) : null}

        <View style={[styles.warningBox, styles.sendPhotoNotice]}>
          <Text style={styles.warningText}>
            ℹ️ Importante: La foto y el vídeo no se adjuntan automáticamente al mensaje de WhatsApp. Si deseas enviarlos, deberás añadirlos manualmente desde WhatsApp antes de enviar el aviso.
          </Text>
        </View>

        <Pressable
          style={[
            styles.primaryButton,
            styles.sendFinishButton,
            !hasSentWhatsApp && styles.disabledButton,
          ]}
          onPress={finishFlow}
          disabled={!hasSentWhatsApp}
        >
          <Text style={styles.primaryButtonText}>Finalizar</Text>
        </Pressable>
      </View>
    </SectionCard>
  );

  const renderSummaryActionBar = () => {
    if (
      showWhatsAppOptions ||
      showContacts ||
      showProvinces ||
      selectedProvince ||
      step !== 4
    ) {
      return null;
    }

    return (
      <View style={styles.summaryActionBar}>
        <Pressable
          style={[styles.menuActionButton, styles.menuActionButtonPrimary]}
          onPress={() => setShowWhatsAppOptions(true)}
        >
          <Text style={styles.menuActionEmoji}>🟢</Text>
          <Text style={styles.menuActionLabelPrimary}>WhatsApp</Text>
        </Pressable>

        <Pressable style={styles.menuActionButton} onPress={copySummary}>
          <Text style={styles.menuActionEmoji}>📋</Text>
          <Text style={styles.menuActionLabel}>Copiar</Text>
        </Pressable>

        <Pressable style={styles.menuActionButton} onPress={handleOpenHelp}>
          <Text style={styles.menuActionEmoji}>📞</Text>
          <Text style={styles.menuActionLabel}>Ayuda</Text>
        </Pressable>

        <Pressable
          style={[styles.menuActionButton, styles.menuActionButtonPrimarySoft]}
          onPress={finishFlow}
        >
          <Text style={styles.menuActionEmoji}>✅</Text>
          <Text style={styles.menuActionLabelPrimary}>Finalizar</Text>
        </Pressable>
      </View>
    );
  };

  const renderNavigationArrows = () => {
    const isOverlayOpen =
      showContacts ||
      showEmptyStep3Confirmation ||
      showWhatsAppConfirmation ||
      showWhatsAppOptions ||
      showProvinces ||
      !!selectedProvince;
    const canShowBackArrow = isOverlayOpen || step > 1;
    const canShowForwardArrow = !isOverlayOpen && step < 4;

    return (
      <>
        {canShowBackArrow ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Volver"
            style={styles.sideArrowLeft}
            onPress={goBack}
          >
            <Text style={styles.sideArrowText}>‹</Text>
          </Pressable>
        ) : null}

        {canShowForwardArrow ? (
          <AnimatedPressable
            accessibilityRole="button"
            accessibilityLabel="Continuar"
            style={[
              styles.sideArrowRight,
              {
                transform: [
                  { translateX: forwardArrowHintX },
                  { scale: forwardArrowHintScale },
                ],
              },
            ]}
            onPress={goNext}
          >
            <Text style={styles.sideArrowText}>›</Text>
          </AnimatedPressable>
        ) : null}
      </>
    );
  };

  const renderStep = () => {
    if (showEmptyStep3Confirmation) return renderEmptyStep3Confirmation();
    if (showContacts) return renderContacts();
    if (showProvinces && !selectedProvince) return renderProvinceList();
    if (selectedProvince) return renderProvinceDetail();
    if (showWhatsAppConfirmation) return renderWhatsAppConfirmation();
    if (showWhatsAppOptions) return renderWhatsAppOptions();

    if (step === 1) {
      return (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoid}
          keyboardVerticalOffset={90}
        >
          <SectionCard title="Paso 1. Tipo y situación del animal">
            <View style={styles.sectionContent}>
              <Text style={styles.sectionDescription}>
                Indica qué ocurre y observa algunas señales sencillas. No necesitas identificar exactamente al animal para poder ayudar.
              </Text>

              <View style={styles.sectionGroup}>
                <Text style={styles.subheading}>¿El animal está vivo o muerto?</Text>
                <View style={styles.flagGrid}>
                  {ANIMAL_STATE_OPTIONS.map((option) => {
                    const active = animalState === option.key;

                    return (
                      <Pressable
                        key={option.key}
                        style={[styles.flag, active && styles.flagActive]}
                        onPress={() => {
                          setAnimalState(option.key);

                          if (option.key === "dead") {
                            setAnimalType("unknown");
                            setFlags(createInitialFlags());
                          }
                        }}
                      >
                        <Text
                          style={[
                            styles.flagText,
                            active && styles.flagTextActive,
                          ]}
                        >
                          {option.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              <>
                  <View style={styles.sectionGroup}>
                    <Text style={styles.subheading}>¿Qué animal has encontrado?</Text>
                    <View style={styles.flagGrid}>
                      {ANIMAL_OPTIONS.map((option) => {
                        const active = animalType === option.key;

                        return (
                          <Pressable
                            key={option.key}
                            style={[styles.flag, active && styles.flagActive]}
                            onPress={() => selectAnimalType(option.key)}
                          >
                            <Text
                              style={[
                                styles.flagText,
                                active && styles.flagTextActive,
                              ]}
                            >
                              {option.label}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  </View>

                  {animalState !== "dead" ? (
                  <View style={styles.sectionGroup}>
                    <Text style={styles.subheading}>¿Qué observas?</Text>
                    <View style={styles.flagGrid}>
                      {FLAG_LABELS.map(({ key, label }) => {
                        const active = flags[key];

                        return (
                          <Pressable
                            key={key}
                            style={[styles.flag, active && styles.flagActive]}
                            onPress={() => toggleFlag(key)}
                          >
                            <Text
                              style={[
                                styles.flagText,
                                active && styles.flagTextActive,
                              ]}
                            >
                              {label}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  </View>
                  ) : null}
                </>
            </View>
          </SectionCard>
        </KeyboardAvoidingView>
      );
    }

    if (step === 2) {
      return (
        <SectionCard title="Paso 2. Qué hacer ahora">
          <View style={styles.sectionContent}>
            <Text style={styles.sectionDescription}>
              Antes de intervenir, lee estas recomendaciones.
            </Text>

            <Text style={[styles.summaryBox, styles.adviceBox]}>{advice}</Text>
          </View>
        </SectionCard>
      );
    }

    if (step === 3) {
      return (
        <SectionCard title="Paso 3. Foto, vídeo y ubicación">
          <View style={styles.sectionContent}>
            <Text style={styles.sectionDescription}>
              Facilita una foto, un vídeo o la ubicación del hallazgo. Esta información puede ayudar a valorar mejor la situación y localizar el lugar si fuera necesario.
            </Text>

            <Text style={styles.sectionDescription}>
              La ubicación y las fotografías ayudan a valorar mejor la situación y a localizar al animal. Si puedes aportar ambas, facilitarás la atención del aviso.
            </Text>

            <Text style={styles.subheading}>¿Qué deseas aportar?</Text>

            <Pressable style={styles.primaryButton} onPress={pickPhoto}>
              <Text style={styles.primaryButtonText}>
                {photoUri ? "Repetir foto" : "Hacer foto"}
              </Text>
            </Pressable>

            <Pressable style={styles.primaryButton} onPress={pickVideo}>
              <Text style={styles.primaryButtonText}>
                {videoUri ? "Repetir vídeo" : "Grabar vídeo"}
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.secondaryButton,
                locationLoading && styles.disabledButton,
              ]}
              onPress={captureLocation}
              disabled={locationLoading}
            >
              <Text style={styles.secondaryButtonText}>
                {locationLoading
                  ? "Capturando ubicación…"
                  : "Capturar ubicación"}
              </Text>
            </Pressable>

            <View style={styles.sectionGroup}>
              <Text style={styles.subheading}>Estado de la información</Text>
              <Text style={styles.helperText}>
                {photoUri ? "📷 Foto: Añadida ✓" : "📷 Foto: No añadida"}
              </Text>
              <Text style={styles.helperText}>
                {videoUri ? "🎥 Vídeo: Añadido ✓" : "🎥 Vídeo: No añadido"}
              </Text>
              <Text style={styles.helperText}>
                {locationCaptured
                  ? "📍 Ubicación: Capturada ✓"
                  : "📍 Ubicación: No capturada"}
              </Text>
            </View>

            <View style={styles.mapCard}>
              <Text style={styles.mapTitle}>Ubicación del hallazgo</Text>

              {coords ? (
                <>
                  <View style={styles.mapLocationBox}>
                    <Text style={styles.mapLocationTitle}>
                      📍 Ubicación capturada
                    </Text>

                    {approximateLocation ? (
                      <>
                        <Text style={styles.mapLocationLabel}>
                          Referencia del lugar
                        </Text>
                        <Text style={styles.mapLocationText}>
                          {approximateLocation}
                        </Text>
                      </>
                    ) : null}

                    <Text style={styles.mapLocationLabel}>Coordenadas</Text>
                    <Text style={styles.mapCoords}>
                      {formatCoordinates(coords)}
                    </Text>
                    <Text style={styles.mapEmptyText}>
                      La referencia del lugar puede no ser exacta. Las
                      coordenadas suelen ofrecer una localización más precisa.
                    </Text>
                    <Text style={styles.mapEmptyText}>
                      Puedes abrir la ubicación en Google Maps para ver calles,
                      caminos y referencias cercanas.
                    </Text>
                  </View>

                  <Pressable style={styles.mapOpenButton} onPress={openMaps}>
                    <Text style={styles.mapOpenButtonText}>
                      Abrir en Google Maps
                    </Text>
                  </Pressable>
                </>
              ) : (
                <View style={styles.mapEmptyBox}>
                  <Text style={styles.mapEmptyText}>
                    Captura la ubicación para ver aquí el punto del hallazgo.
                  </Text>
                </View>
              )}
            </View>
          </View>
        </SectionCard>
      );
    }

    if (animalState === "dead") {
      return (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoid}
          keyboardVerticalOffset={90}
        >
          <SectionCard title="Paso 4. Resumen">
            <View style={styles.sectionContent}>
              <Text style={styles.sectionDescription}>
                Lee el resumen y pulsa en Teléfonos de ayuda para llamar a los
                servicios de ayuda o emergencias más cercanos.
              </Text>

              <Text style={[styles.summaryBox, styles.summaryEditor]}>
                {generatedSummary}
              </Text>

              <View style={styles.warningBox}>
                <Text style={styles.warningText}>
                  Llama a Agentes Forestales, seguridad o emergencias según el
                  caso. Puedes copiar el resumen si te lo piden.
                </Text>
              </View>
            </View>
          </SectionCard>
        </KeyboardAvoidingView>
      );
    }

    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
        keyboardVerticalOffset={90}
      >
        <SectionCard title="Paso 4. Resumen">
          <View style={styles.sectionContent}>
            <View style={styles.summaryInstructions}>
              <Text style={styles.bulletText}>
                • Revisa si el resumen es correcto o retrocede para corregir.
              </Text>
              <Text style={styles.bulletText}>
                • Usa <Text style={styles.bulletStrong}>WhatsApp</Text> para
                enviarlo a GREFA Madrid o a otro contacto que elijas.
              </Text>
              <Text style={styles.bulletText}>
                • Usa <Text style={styles.bulletStrong}>Copiar</Text> para
                guardar el resumen en el portapapeles y compartirlo mediante
                cualquier aplicación.
              </Text>
              <Text style={styles.bulletText}>
                • Usa <Text style={styles.bulletStrong}>Ayuda</Text> para buscar
                el centro más cercano a tu provincia o servicios de emergencias.
              </Text>
              <Text style={styles.bulletText}>
                • Usa <Text style={styles.bulletStrong}>Finalizar</Text> si ya
                has informado a un especialista o para descartar el aviso.
              </Text>
            </View>

            <Text style={[styles.summaryBox, styles.summaryEditor]}>
              {generatedSummary}
            </Text>
          </View>
        </SectionCard>
      </KeyboardAvoidingView>
    );
  };

  return (
    <SafeAreaView style={styles.screen} edges={["bottom"]}>
      <Stack.Screen
        options={{
          title: "Rescate SOS Fauna España - Asistente",
          headerLeft: Platform.OS === "web" ? () => null : undefined,
        }}
      />

      {showSummaryActionBar ? renderSummaryActionBar() : null}

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={[
          styles.container,
          {
            paddingTop: showSummaryActionBar ? 84 : 12,
            paddingBottom: Math.max(220, insets.bottom + 180),
          },
        ]}
        keyboardShouldPersistTaps="handled"
        onScroll={(event) => setScrollY(event.nativeEvent.contentOffset.y)}
        onContentSizeChange={(_, height) => setScrollContentHeight(height)}
        onLayout={(event) =>
          setScrollLayoutHeight(event.nativeEvent.layout.height)
        }
        scrollEventThrottle={16}
      >
        {renderStep()}
      </ScrollView>

      {canShowStep1ScrollHint ? (
        <Pressable
          style={styles.floatingScrollHint}
          onPress={() =>
            scrollViewRef.current?.scrollTo({
              y: isNearBottom
                ? 0
                : Math.max(0, scrollContentHeight - scrollLayoutHeight),
              animated: true,
            })
          }
        >
          <Text style={styles.floatingScrollHintText}>
            {isNearBottom ? "↑" : "↓"}
          </Text>
        </Pressable>
      ) : null}

      {renderNavigationArrows()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f3f7f4",
  },
  scrollView: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 26,
    paddingTop: 12,
    gap: 16,
  },
  keyboardAvoid: {
    flex: 1,
  },
  hero: {
    backgroundColor: "#e7f5ea",
    borderRadius: 18,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: "#cfe8d4",
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#14532d",
    color: "#ffffff",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    fontSize: 14,
    fontWeight: "800",
  },
  heroText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#374151",
  },
  stepIndicator: {
    fontSize: 13,
    fontWeight: "700",
    color: "#166534",
    marginTop: 4,
  },
  welcomeContent: {
    gap: 14,
  },
  welcomeTitle: {
    fontSize: 20,
    lineHeight: 27,
    fontWeight: "900",
    color: "#14532d",
  },
  welcomeVersion: {
    alignSelf: "flex-start",
    backgroundColor: "#e7f5ea",
    color: "#166534",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    fontSize: 13,
    fontWeight: "800",
  },
  welcomeScopeBox: {
    backgroundColor: "#eef8f0",
    borderWidth: 1,
    borderColor: "#b7dfc0",
    borderRadius: 14,
    padding: 12,
    gap: 6,
  },
  welcomeScopeText: {
    fontSize: 16,
    lineHeight: 23,
    color: "#111827",
    fontWeight: "700",
  },
  welcomeScopeSmall: {
    fontSize: 14,
    lineHeight: 20,
    color: "#374151",
  },
  welcomeFeatureList: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#dbe7dd",
    borderRadius: 14,
    padding: 12,
    gap: 8,
  },
  welcomeFeature: {
    fontSize: 15,
    lineHeight: 22,
    color: "#374151",
    fontWeight: "600",
  },
  welcomeFooter: {
    fontSize: 12,
    lineHeight: 18,
    color: "#6b7280",
    textAlign: "center",
  },
  sectionContent: {
    gap: 12,
  },
  sectionGroup: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#dbe7dd",
    borderRadius: 14,
    padding: 12,
    gap: 10,
  },
  sectionDescription: {
    fontSize: 15,
    color: "#4b5563",
    lineHeight: 22,
  },
  subheading: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginTop: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#ffffff",
  },
  summaryEditor: {
    minHeight: 184,
    lineHeight: 21,
    color: "#111827",
  },
  adviceBox: {
    fontSize: 18,
    lineHeight: 30,
    minHeight: 320,
    paddingTop: 18,
    paddingBottom: 18,
    backgroundColor: "#eef8f0",
    borderColor: "#b7dfc0",
  },
  primaryButton: {
    backgroundColor: "#14532d",
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 16,
  },
  sendOtherContactButton: {
    marginTop: 16,
  },
  sendPhotoNotice: {
    marginTop: 6,
  },
  sendFinishButton: {
    marginTop: 10,
  },
  secondaryButton: {
    backgroundColor: "#e5e7eb",
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
  },
  secondaryButtonSmall: {
    backgroundColor: "#e5e7eb",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    minWidth: 96,
  },
  secondaryButtonText: {
    color: "#111827",
    fontWeight: "600",
    fontSize: 16,
    textAlign: "center",
  },
  disabledButton: {
    opacity: 0.6,
  },
  helperText: {
    color: "#4b5563",
    fontSize: 13,
    lineHeight: 18,
  },
  successBox: {
    backgroundColor: "#dcfce7",
    borderWidth: 1,
    borderColor: "#16a34a",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  successText: {
    color: "#166534",
    fontWeight: "700",
  },
  warningBox: {
    backgroundColor: "#fef3c7",
    borderWidth: 1,
    borderColor: "#f59e0b",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  warningText: {
    color: "#92400e",
    fontWeight: "700",
    lineHeight: 20,
  },
  flagGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  flag: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#ffffff",
  },
  flagActive: {
    backgroundColor: "#dcfce7",
    borderColor: "#16a34a",
  },
  flagText: {
    color: "#111827",
    fontWeight: "600",
  },
  flagTextActive: {
    color: "#166534",
  },
  summaryBox: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 12,
    lineHeight: 22,
    color: "#111827",
  },
  inlineActionRow: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  summaryActionBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    elevation: 8,
    flexDirection: "row",
    alignItems: "stretch",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#f3f7f4",
    borderBottomWidth: 1,
    borderBottomColor: "#dbe7dd",
  },
  menuActionButton: {
    flex: 1,
    minHeight: 48,
    backgroundColor: "#e5e7eb",
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 4,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  menuActionButtonPrimary: {
    backgroundColor: "#14532d",
  },
  menuActionButtonPrimarySoft: {
    backgroundColor: "#166534",
  },
  menuActionEmoji: {
    fontSize: 15,
  },
  menuActionLabel: {
    color: "#111827",
    fontSize: 11,
    fontWeight: "800",
    textAlign: "center",
  },
  menuActionLabelPrimary: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "800",
    textAlign: "center",
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "space-between",
    rowGap: 10,
    columnGap: 8,
    flexWrap: "wrap",
    marginTop: 4,
  },
  iconActionButton: {
    flexBasis: "48%",
    minHeight: 68,
    backgroundColor: "#e5e7eb",
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  iconActionButtonFull: {
    flexBasis: "100%",
  },
  iconActionButtonPrimary: {
    backgroundColor: "#14532d",
  },
  iconActionButtonPrimarySoft: {
    backgroundColor: "#166534",
  },
  iconActionEmoji: {
    fontSize: 20,
  },
  iconActionLabel: {
    color: "#111827",
    fontSize: 14,
    fontWeight: "800",
    textAlign: "center",
  },
  iconActionLabelPrimary: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "800",
    textAlign: "center",
  },
  bottomHelpRow: {
    marginTop: 8,
  },
  navRowCenter: {
    marginTop: 8,
    alignItems: "center",
  },
  contactRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 14,
    padding: 12,
    backgroundColor: "#ffffff",
  },
  contactRowEmergency: {
    backgroundColor: "#fef3c7",
    borderColor: "#f59e0b",
  },
  contactTextBlock: {
    flex: 1,
  },
  contactName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },
  contactNote: {
    fontSize: 13,
    color: "#4b5563",
    marginTop: 2,
  },
  contactPhone: {
    fontSize: 14,
    fontWeight: "700",
    color: "#14532d",
  },
  contactPhonePill: {
    backgroundColor: "#14532d",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  contactPhonePillText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "900",
  },

  summaryInstructions: {
    backgroundColor: "#eef8f0",
    borderWidth: 1,
    borderColor: "#b7dfc0",
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  bulletText: {
    color: "#374151",
    fontSize: 15,
    lineHeight: 22,
  },
  bulletStrong: {
    color: "#14532d",
    fontWeight: "900",
  },
  mapCard: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#dbe7dd",
    borderRadius: 14,
    padding: 12,
    gap: 10,
  },
  mapTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111827",
  },
  mapLocationBox: {
    minHeight: 130,
    borderRadius: 14,
    backgroundColor: "#eef8f0",
    borderWidth: 1,
    borderColor: "#b7dfc0",
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    gap: 6,
  },
  mapPin: {
    fontSize: 30,
  },
  mapLocationTitle: {
    color: "#14532d",
    fontSize: 15,
    fontWeight: "900",
    textAlign: "center",
  },
  mapLocationLabel: {
    color: "#14532d",
    fontSize: 13,
    fontWeight: "900",
    textAlign: "center",
  },
  mapLocationText: {
    color: "#1f2937",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "700",
    textAlign: "center",
  },
  mapCoords: {
    color: "#374151",
    fontSize: 13,
    fontWeight: "700",
  },
  mapOpenButton: {
    flex: 1,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#14532d",
    alignItems: "center",
    justifyContent: "center",
  },
  mapOpenButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "800",
  },
  mapEmptyBox: {
    minHeight: 120,
    borderRadius: 14,
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
  },
  mapEmptyText: {
    color: "#4b5563",
    textAlign: "center",
    fontSize: 14,
    lineHeight: 20,
  },
  floatingScrollHint: {
    position: "absolute",
    right: 34,
    top: "64%",
    width: 32,
    height: 50,
    borderRadius: 999,
    backgroundColor: "#14532d",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 30,
    elevation: 6,
  },
  floatingScrollHintText: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "900",
  },
  sideArrowLeft: {
    position: "absolute",
    zIndex: 100,
    elevation: 20,
    top: "50%",
    left: 0,
    width: 26,
    height: 120,
    marginTop: -60,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    backgroundColor: "#14532d",
    alignItems: "center",
    justifyContent: "center",
  },
  sideArrowRight: {
    position: "absolute",
    zIndex: 100,
    elevation: 20,
    top: "50%",
    right: 0,
    width: 26,
    height: 120,
    marginTop: -60,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    backgroundColor: "#14532d",
    alignItems: "center",
    justifyContent: "center",
  },
  sideArrowText: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "800",
    lineHeight: 30,
  },
  infoBox: {
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  infoText: {
    color: "#4b5563",
    fontSize: 13,
    lineHeight: 18,
  },
});
