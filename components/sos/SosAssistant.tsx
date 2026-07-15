import * as Clipboard from "expo-clipboard";
import * as ImagePicker from "expo-image-picker";
import * as Linking from "expo-linking";
import * as Location from "expo-location";
import * as MediaLibrary from "expo-media-library";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Keyboard,
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

import { Stack } from "expo-router";
import { SectionCard } from "@/components/SectionCard";
import { provinceContacts } from "@/lib/provinceContacts";

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

type Step = 1 | 2 | 3 | 4 | 5;

const GREFA_WHATSAPP = "34648539901";

const ANIMAL_OPTIONS: Array<{ key: AnimalType; label: string }> = [
  { key: "smallBird", label: "Ave pequeña" },
  { key: "largeBird", label: "Ave rapaz / ave grande" },
  { key: "bat", label: "Murciélago" },
  { key: "smallMammal", label: "Pequeño mamífero" },
  { key: "largeMammal", label: "Mamífero grande" },
  { key: "reptileAmphibian", label: "Reptil / anfibio" },
  { key: "unknown", label: "No lo sé" },
];

const ANIMAL_STATE_OPTIONS: Array<{ key: AnimalState; label: string }> = [
  { key: "alive", label: "Vivo" },
  { key: "dead", label: "Muerto" },
];

const FLAG_LABELS: Array<{ key: keyof FlagsState; label: string }> = [
  { key: "bleeding", label: "Sangra" },
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
    phone: "648 53 99 01",
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
    " En el siguiente paso podrás hacer una foto del atrapamiento y capturar la ubicación. Contacta con un centro especializado como GREFA, Agentes Forestales o Emergencias, y facilita toda esta información resumida en el siguiente paso o envíala por WhatsApp.";

  if (animalType === "smallBird") {
    return (
      "🪤 AVE ATRAPADA\n\n" +
      "🚨 RIESGO DE LESIONES\n" +
      "• Una liberación brusca puede provocar lesiones en alas, patas o cuello.\n\n" +
      "❌ QUÉ NO HACER\n" +
      "• No tires ni fuerces para liberar el ave.\n" +
      "• No hagas fotos o vídeos con flash.\n" +
      "• No ofrezcas comida o agua sin indicación.\n" +
      "• Evita manipulaciones innecesarias.\n\n" +
      "✅ QUÉ HACER\n" +
      "• Reduce el ruido y la presencia de personas alrededor.\n" +
      "• Si puedes hacerlo sin riesgo, cúbrela suavemente con una toalla, trapo, jersey o cualquier tela disponible para reducir el estrés.\n" +
      "• Si consigues liberarla sin causarle daño, colócala en una caja de cartón ventilada y mantenla cerrada para evitar fugas.\n" +
      "• Déjala en un lugar tranquilo y protegida del frío o del calor extremo.\n" +
      "• Contacta con el centro de recuperación más cercano para recibir orientación.\n\n" +
      commonEnd
    );
  }

  if (animalType === "largeBird") {
    return (
      "🦉 RAPAZ O AVE GRANDE ATRAPADA\n\n" +
      "⚠️ PRECAUCIÓN\n" +
      "• Puede lesionarte con el pico o las garras.\n" +
      "• No acerques la cara ni las manos desnudas.\n\n" +
      "❌ QUÉ NO HACER\n" +
      "• No tires de alas, patas ni plumas. Puede lesionarte al defenderse.\n" +
      "• No intentes liberarla si no puedes hacerlo con seguridad.\n" +
      "• No le des comida ni agua sin indicación.\n\n" +
      "✅ QUÉ HACER\n" +
      "• Mantén distancia.\n" +
      "• Reduce ruidos y personas alrededor.\n" +
      "• Si existe peligro inmediato y puedes actuar sin riesgo, cúbrela con una manta o toalla gruesa para reducir el estrés, o al menos si es posible la cabeza.\n" +
      "• Si has logrado liberarla y ves que tiene heridas, no vuela o tiene alguna anomalía:\n" +
      "  - Dejalá en un transportín, caja de cartón o recipiente similar.\n" +
      "  - Asegura una ventilación adecuada.\n" +
      "  - Evita que pueda escapar.\n" +
      "• Contacta con el centro de recuperación más cercano para recibir orientación.\n\n" +
      commonEnd
    );
  }

  if (animalType === "bat") {
    return (
      "🦇 MURCIÉLAGO ATRAPADO\n\n" +
      "⚠️ PRECAUCIÓN\n" +
      "• No lo manipules con las manos desnudas.\n" +
      "• Incluso animales aparentemente sanos pueden morder al defenderse.\n\n" +
      "❌ QUÉ NO HACER\n" +
      "• No tires de las alas.\n" +
      "• No intentes despegarlo a la fuerza.\n" +
      "• No le des comida ni agua sin indicación.\n\n" +
      "✅ QUÉ HACER\n" +
      "• Utiliza guantes gruesos o una tela si fuera imprescindible moverlo.\n" +
      "• Si se libera sin daño, colócalo en una caja ventilada.\n" +
      "• Reduce la luz, el ruido y la presencia de personas alrededor.\n" +
      "• Protégelo del frío o del calor extremo.\n" +
      "• Contacta con el centro de recuperación más cercano para recibir orientación.\n\n" +
      commonEnd
    );
  }

  if (animalType === "smallMammal") {
    return (
      "🐾 MAMÍFERO PEQUEÑO ATRAPADO\n\n" +
      "⚠️ ANTES DE INTERVENIR\n" +
      "• Mantén distancia y observa desde lejos.\n" +
      "• Evita acorralarlo y manipulaciones innecesarias.\n" +
      "• Reduce ruidos.\n" +
      "• Aleja a personas, perros y vehículos.\n" +
      "• Contacta con el centro de recuperación más cercano para recibir orientación.\n\n" +
      "❌ QUÉ NO HACER\n" +
      "• No tires de patas, cola ni cabeza para liberarlo. Puede sufrir lesiones o morder por miedo.\n" +
      "• No intentes manipularlo salvo indicación de personal especializado.\n" +
      "• No hagas fotos o vídeos con flash.\n" +
      "• No le des comida ni agua sin indicación.\n\n" +
      "✅ QUÉ HACER\n" +
      "• Si puedes hacerlo sin riesgo -con indicaciones de personal especializado-, cúbrelo suavemente con una toalla, trapo, jersey o cualquier tela disponible para reducir el estrés.\n" +
      "• Si consigues liberarlo sin causarle daño, colócalo en una caja de cartón ventilada o transportín seguro.\n" +
      "• Contacta con el centro de recuperación más cercano para recibir orientación.\n\n" +
      commonEnd
    );
  }

  if (animalType === "largeMammal") {
    return (
      "🦌 MAMÍFERO GRANDE ATRAPADO\n\n" +
      "⚠️ ANTES DE INTERVENIR\n" +
      "• Mantén distancia y observa desde lejos.\n" +
      "• Evita acorralarlo.\n" +
      "• Reduce ruidos.\n" +
      "• Aleja a personas, perros y vehículos.\n" +
      "• Contacta con el centro de recuperación más cercano para recibir orientación.\n\n" +
      "❌ QUÉ NO HACER\n" +
      "• No intentes capturarlo, liberarlo ni acercarte más de lo necesario. Puede reaccionar con fuerza por miedo, estrés o dolor y causar lesiones.\n" +
      "• No intentes cubrirlo ni manipularlo salvo indicación de personal especializado.\n" +
      "• No lo traslades.\n" +
      "• No hagas fotos o vídeos con flash.\n" +
      "• No le des comida ni agua sin indicación.\n\n" +
      "✅ QUÉ HACER\n" +
      "• Contacta cuanto antes con el centro de recuperación o los servicios de emergencia.\n\n" +
      commonEnd
    );
  }

  if (animalType === "reptileAmphibian") {
    return (
      "🐸 REPTIL O ANFIBIO ATRAPADO\n\n" +
      "⚠️ ANTES DE INTERVENIR\n" +
      "• Mantén distancia y observa desde lejos.\n" +
      "• No intentes manipularlo salvo indicación de personal especializado en caso de duda por peligrosidad.\n" +
      "• Aleja a personas, perros y vehículos.\n" +
      "• Contacta con el centro de recuperación más cercano para recibir orientación.\n\n" +
      "❌ QUÉ NO HACER\n" +
      "• No tires de patas, cola ni cuerpo para liberarlo. Puede sufrir lesiones o morder por miedo o defenderse.\n" +
      "• Evita el contacto directo salvo riesgo inmediato.\n" +
      "• No hagas fotos o vídeos con flash.\n" +
      "• No le des comida ni agua sin indicación.\n\n" +
      "✅ QUÉ HACER\n" +
      "• Reduce ruidos y luz directa.\n" +
      "• Mantenlo protegido del frío o del calor extremo.\n" +
      "• Si se libera sin daño y es necesario contenerlo por seguridad, usa un recipiente seguro y ventilado.\n" +
      "• Contacta con el centro de recuperación más cercano para recibir orientación.\n\n" +
      commonEnd
    );
  }

  return (
    "❓ NO SÉ QUÉ ANIMAL ES\n\n" +
    "⚠️ ANTES DE INTERVENIR\n" +
    "• Mantén distancia y observa desde lejos.\n" +
    "• No intentes manipularlo salvo indicación de personal especializado en caso de duda por peligrosidad.\n" +
    "• Aleja a personas, perros y vehículos.\n" +
    "• Contacta con el centro de recuperación más cercano para recibir orientación.\n\n" +
    "❌ QUÉ NO HACER\n" +
    "• No tires de él ni intentes liberarlo a la fuerza. Puede sufrir lesiones o morder por miedo o defenderse.\n" +
    "• Evita el contacto directo salvo riesgo inmediato.\n" +
    "• Reduce ruidos y luz directa.\n" +
    "• No hagas fotos o vídeos con flash.\n" +
    "• No le des comida ni agua sin indicación.\n\n" +
    "✅ QUÉ HACER\n" +
    "• Mantenlo protegido del frío o del calor extremo.\n" +
    "• Si puedes hacerlo sin riesgo, cúbrelo suavemente con una toalla, trapo, jersey o cualquier tela disponible para reducir el estrés.\n" +
    "• Si consigues liberarlo sin causarle daño, mantenlo en una caja de cartón cerrada y ventilada o recipiente seguro ventilado, en silencio y protegido del frío o del calor extremo.\n" +
    "• Contacta con el centro de recuperación más cercano para recibir orientación.\n\n" +
    commonEnd
  );
}
function getBabyAdvice(animalType: AnimalType) {
  const commonEnd =
    " En el siguiente paso podrás hacer una foto del animal y capturar la ubicación. Contacta con un centro especializado como GREFA, Agentes Forestales o Emergencias, y facilita toda esta información resumida en el siguiente paso o envíala por WhatsApp.";

  if (animalType === "smallBird") {
    return (
      "🐣 POLLO O VOLANTÓN\n\n" +
      "Antes de intervenir, intenta distinguir si se trata de un pollo o de un volantón. No todas las aves jóvenes encontradas en el suelo necesitan ayuda.\n\n" +
      "🐥 POLLO\n" +
      "• Tiene poco plumaje, plumón visible o zonas sin plumas.\n" +
      "• Normalmente debería estar en el nido.\n" +
      "• Si localizas el nido y puedes acceder con seguridad, devuélvelo con la mínima manipulación posible.\n" +
      "• Si NO es posible devolverlo al nido, puede necesitar ayuda. Contacta con el centro de recuperación más cercano para recibir orientación.\n\n" +
      "🕊️ VOLANTÓN\n" +
      "• Observa primero desde cierta distancia.\n" +
      "• Suele estar ya emplumado.\n" +
      "• Es normal encontrarlo fuera del nido.\n" +
      "• Puede saltar o moverse por el suelo o ramas bajas.\n" +
      "• Sus padres pueden seguir alimentándolo mientras aprende a volar.\n" +
      "• No lo retires salvo que exista un peligro inmediato.\n" +
      "• Si está decaído, presenta heridas o alguna anomalía, puede necesitar ayuda. Contacta con el centro de recuperación más cercano para recibir orientación.\n\n" +
      "🚨 EN CASO DE NECESITAR AYUDA:\n\n" +
      "❌ QUÉ NO HACER\n" +
      "• No le des comida ni agua sin indicación.\n" +
      "• No lo manipules más de lo necesario.\n" +
      "• No le extiendas las alas.\n\n" +
      "✅ QUÉ HACER\n" +
      "• Si necesita ayuda, colócalo en una caja de cartón ventilada, manteniéndola cerrada para evitar fugas.\n" +
      "• Déjalo en un lugar tranquilo, sin ruido y protegido del frío o del calor extremo.\n" +
      "• Reduce ruidos y evita la presencia innecesaria de personas y animales domésticos cerca del animal.\n" +
      "• Realiza únicamente las fotos o vídeos necesarios para la identificación del caso y evita utilizar flash.\n" +
      "• Contacta con el centro de recuperación más cercano para recibir orientación.\n\n" +
      commonEnd
    );
  }

  if (animalType === "largeBird") {
    return (
      "🦉 CRÍA DE RAPAZ O AVE GRANDE\n\n" +
      "⚠️ ANTES DE INTERVENIR\n" +
      "• No toda cría de rapaz o ave grande fuera del nido necesita recogerse.\n" +
      "• Puede encontrarse en una fase de aprendizaje.\n" +
      "• Los adultos pueden seguir alimentándola y vigilándola cerca.\n" +
      "• Algunas especies pueden permanecer varios días en el suelo o en ramas bajas mientras aprenden a volar.\n\n" +
      "🚨 PUEDE NECESITAR AYUDA SI\n" +
      "• Presenta heridas.\n" +
      "• Está muy débil o decaída.\n" +
      "• Existe peligro inmediato.\n" +
      "• Lleva mucho tiempo expuesta en una zona peligrosa.\n" +
      "• Tienes dudas razonables sobre su estado.\n\n" +
      "❌ QUÉ NO HACER\n" +
      "• No la manipules sin necesidad.\n" +
      "• No la recojas automáticamente por estar en el suelo.\n" +
      "• No le des comida ni agua sin indicación.\n" +
      "• No acerques la cara ni las manos desnudas.\n\n" +
      "✅ QUÉ HACER\n" +
      "• Mantén distancia y observa primero.\n" +
      "• Reduce ruidos y presencia de personas.\n" +
      "• Si puedes hacerlo sin riesgo, introdúcela en un transportín o caja de cartón ventilada.\n" +
      "• Mantén el recipiente en un lugar tranquilo y, si es posible, cúbrelo parcialmente con una toalla o tela sin bloquear la ventilación para reducir el estrés.\n" +
      "• Reduce ruidos y evita la presencia innecesaria de personas y animales domésticos cerca del animal.\n" +
      "• Realiza únicamente las fotos o vídeos necesarios para la identificación del caso y evita utilizar flash.\n" +
      "• Contacta con el centro de recuperación más cercano para recibir orientación.\n\n" +
      commonEnd
    );
  }

  if (animalType === "bat") {
    return (
      "🦇 CRÍA DE MURCIÉLAGO\n\n" +
      "⚠️ ANTES DE INTERVENIR\n" +
      "• Una cría de murciélago no siempre necesita ser trasladada a un centro de recuperación.\n" +
      "• Si localizas la colonia, puedes intentar dejar la cría cerca de ella al atardecer para favorecer la reunificación con los adultos.\n" +
      "• Hazlo únicamente si no presenta heridas ni signos de debilidad.\n" +
      "• Consulta con un centro especializado ante cualquier duda.\n\n" +
      "🚨 PUEDE NECESITAR AYUDA SI\n" +
      "• Presenta heridas.\n" +
      "• Está débil o decaída.\n" +
      "• Ha sido atacada por un gato u otro animal.\n" +
      "• Se encuentra en una situación de peligro.\n" +
      "• Tienes dudas razonables sobre su estado.\n\n" +
      "❌ QUÉ NO HACER\n" +
      "• No la manipules con las manos desnudas.\n" +
      "• No le des comida ni agua sin indicación.\n" +
      "• No la mantengas expuesta al sol, al frío o a fuentes de calor directas.\n\n" +
      "✅ QUÉ HACER\n" +
      "• Utiliza guantes o una tela para manipularla si es necesario.\n" +
      "• Si necesita ayuda, mantenla en una caja ventilada y bien cerrada.\n" +
      "• Déjala en un lugar tranquilo, protegido del frío o del calor extremo.\n" +
      "• Reduce ruidos y evita la presencia innecesaria de personas y animales domésticos cerca del animal.\n" +
      "• Realiza únicamente las fotos o vídeos necesarios para la identificación del caso y evita utilizar flash.\n" +
      "• Contacta con un centro especializado para recibir orientación.\n\n" +
      commonEnd
    );
  }

  if (animalType === "smallMammal") {
    return (
      "🐭 CRÍA DE PEQUEÑO MAMÍFERO\n\n" +
      "⚠️ ANTES DE INTERVENIR\n" +
      "• Muchas crías de pequeños mamíferos permanecen solas temporalmente mientras la madre busca alimento o se mantiene oculta cerca.\n" +
      "• Observa desde una distancia prudente antes de intervenir.\n" +
      "• Evita tocarla o recogerla salvo que exista peligro inmediato.\n\n" +
      "🚨 PUEDE NECESITAR AYUDA SI\n" +
      "• Presenta heridas.\n" +
      "• Está débil o decaída.\n" +
      "• Ha sido atacada por un gato, perro u otro animal.\n" +
      "• Existe un riesgo claro para su seguridad.\n" +
      "• Tienes dudas razonables sobre su estado.\n\n" +
      "❌ QUÉ NO HACER\n" +
      "• No la recojas automáticamente por estar sola.\n" +
      "• No la manipules más de lo necesario.\n" +
      "• No le des comida ni agua sin indicación.\n\n" +
      "✅ QUÉ HACER\n" +
      "• Observa primero si los progenitores continúan atendiéndola.\n" +
      "• Si necesita ayuda, colócala en una caja de cartón cerrada y ventilada o en otro recipiente seguro ventilado.\n" +
      "• Mantén el recipiente en un lugar tranquilo y protegido del frío o del calor extremo.\n" +
      "• Reduce ruidos y evita la presencia innecesaria de personas y animales domésticos cerca del animal.\n" +
      "• Realiza únicamente las fotos o vídeos necesarios para la identificación del caso y evita utilizar flash.\n" +
      "• Contacta con el centro de recuperación más cercano para recibir orientación.\n\n" +
      commonEnd
    );
  }

  if (animalType === "largeMammal") {
    return (
      "🦌 CRÍA DE GRAN MAMÍFERO\n\n" +
      "⚠️ ANTES DE INTERVENIR\n" +
      "• Muchas crías de ciervo, corzo u otros mamíferos permanecen ocultas durante horas mientras la madre se mantiene alejada para no atraer depredadores.\n" +
      "• Permanecer sola no significa necesariamente que esté abandonada.\n" +
      "• Observa la situación desde una distancia prudente.\n\n" +
      "🚨 PUEDE NECESITAR AYUDA SI\n" +
      "• Presenta heridas evidentes.\n" +
      "• Está débil o decaída.\n" +
      "• Existe peligro inmediato.\n" +
      "• Ha sido atacada por perros u otros animales o atropellada.\n" +
      "• Tienes dudas razonables sobre su estado.\n\n" +
      "❌ QUÉ NO HACER\n" +
      "• No la recojas ni la traslades sin necesidad.\n" +
      "• No la manipules ni intentes acariciarla.\n" +
      "• No le des comida ni agua sin indicación.\n" +
      "• No te acerques más de lo necesario.\n\n" +
      "✅ QUÉ HACER\n" +
      "• Mantén distancia y observa desde lejos.\n" +
      "• Reduce ruidos y evita la presencia innecesaria de personas, perros o vehículos cerca de la cría.\n" +
      "• Realiza únicamente las fotos o vídeos necesarios para la identificación del caso y evita utilizar flash.\n" +
      "• Si se encuentra cerca de una carretera o zona de tráfico, extremar la precaución y solicita ayuda especializada.\n" +
      "• Si necesita ayuda, contacta con agentes medioambientales o con un centro especializado para recibir orientación.\n" +
      "• Sigue siempre las indicaciones del personal especializado.\n\n" +
      commonEnd
    );
  }

  if (animalType === "reptileAmphibian") {
    return (
      "🦎 CRÍA DE REPTIL O ANFIBIO\n\n" +
      "⚠️ ANTES DE INTERVENIR\n" +
      "• Las crías de reptiles y anfibios suelen ser independientes desde etapas muy tempranas.\n" +
      "• La presencia de una cría sola no significa necesariamente que necesite ayuda.\n" +
      "• Observa la situación antes de intervenir.\n\n" +
      "🚨 PUEDE NECESITAR AYUDA SI\n" +
      "• Presenta heridas.\n" +
      "• Está atrapada o no puede desplazarse.\n" +
      "• Se encuentra en una carretera, piscina, obra o zona de paso peligrosa.\n" +
      "• Existe riesgo por la presencia de perros, gatos u otros animales.\n" +
      "• Tienes dudas razonables sobre su estado.\n\n" +
      "❌ QUÉ NO HACER\n" +
      "• No la manipules sin necesidad.\n" +
      "• No la traslades a grandes distancias.\n" +
      "• No manipules serpientes o culebras directamente con las manos si no puedes identificarlas con seguridad.\n" +
      "• No le des comida ni agua sin indicación.\n\n" +
      "✅ QUÉ HACER\n" +
      "• Si se trata de una serpiente o culebra y existe riesgo de mordedura, evita manipularla y solicita ayuda especializada.\n" +
      "• Reduce ruidos y evita la presencia innecesaria de personas y animales domésticos cerca del animal.\n" +
      "• Si necesitas moverla por seguridad, utiliza un recipiente seguro y ventilado.\n" +
      "• Déjala en una zona adecuada y lo más cercana posible al lugar donde fue encontrada.\n" +
      "• Evita manipular al animal en exceso para hacer fotos o vídeos y no utilices flash.\n" +
      "• Contacta con el centro de recuperación más cercano para recibir orientación.\n\n" +
      commonEnd
    );
  }

  return (
    "❓ NO SÉ SI ES UNA CRÍA\n\n" +
    "⚠️ ANTES DE INTERVENIR\n" +
    "• Muchas crías no están abandonadas aunque parezcan solas.\n" +
    "• Evita llevártela a casa o alimentarla.\n" +
    "• Observa primero la situación desde cierta distancia.\n\n" +
    "🚨 PUEDE NECESITAR AYUDA SI\n" +
    "• Presenta heridas.\n" +
    "• Está débil o decaída.\n" +
    "• Existe peligro inmediato.\n" +
    "• Ha sido atacada por un perro, gato u otro animal.\n" +
    "• Tienes dudas razonables sobre su estado.\n\n" +
    "❌ QUÉ NO HACER\n" +
    "• No la recojas automáticamente por estar sola.\n" +
    "• No le des comida ni agua sin indicación.\n" +
    "• No la manipules más de lo necesario.\n\n" +
    "✅ QUÉ HACER\n" +
    "• Reduce ruidos y evita la presencia innecesaria de personas y animales domésticos cerca del animal.\n" +
    "• Observa primero la situación desde cierta distancia.\n" +
    "• Si debes moverla por seguridad, mantenla en una caja de cartón cerrada y ventilada o recipiente seguro ventilado.\n" +
    "• Mantén el recipiente en un lugar tranquilo y protegido del frío o del calor extremo.\n" +
    "• Evita manipular al animal en exceso para hacer fotos o vídeos y no utilices flash.\n" +
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

  if (flags.bleeding) signs.push("• Presenta sangrado.");
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
  let advice = baseAdvice.trimEnd();

  if (flags.ringGps) {
    advice +=
      "\n\n🔎 ANILLA O DISPOSITIVO GPS\n" +
      "• No retires la anilla ni el dispositivo.\n" +
      "• Si puedes hacerlo sin manipular al animal en exceso, fotografía números, letras o marcas visibles.\n" +
      "• Comunica esta información al centro especializado o a los agentes medioambientales.";
  }

  if (flags.normalAppearance && !hasAnyConcern(flags) && !flags.cannotFly) {
    advice +=
      "\n\nℹ️ APARIENCIA NORMAL\n" +
      "• Si el animal se comporta con normalidad y no existe peligro inmediato, observa desde cierta distancia antes de intervenir.\n" +
      "• Evita recogerlo o trasladarlo sin necesidad.";
  }

  return advice;
}

function getSmallBirdAdvice(flags: FlagsState) {
  if (hasPhysicalWarning(flags)) {
    const signs = getObservedSigns(flags, true);

    return (
      "🐦 AVE PEQUEÑA QUE PUEDE NECESITAR AYUDA\n\n" +
      "🚨 SEÑALES OBSERVADAS\n" +
      signs +
      "\n\n❌ QUÉ NO HACER\n" +
      "• No le des comida ni agua sin indicación.\n" +
      "• No intentes extenderle las alas ni comprobar lesiones mediante manipulaciones.\n" +
      "• No la persigas ni la lances al aire para comprobar si vuela.\n" +
      "• Evita hacer fotos o vídeos innecesarios y no utilices flash.\n\n" +
      "✅ QUÉ HACER\n" +
      "• Manipúlala lo mínimo imprescindible.\n" +
      "• Colócala en una caja de cartón cerrada y ventilada o en un transportín seguro.\n" +
      "• Mantén el recipiente en un lugar tranquilo y protegido del frío o del calor extremo.\n" +
      "• Si ha sido atacada por un gato o perro, necesita valoración aunque no observes heridas evidentes.\n" +
      "• Contacta con un centro especializado, Agentes Forestales o Emergencias para recibir orientación.\n" +
      "• Continúa con el siguiente paso para compartir la información necesaria y recibir una mejor orientación."
    );
  }

  if (flags.cannotFly) {
    return (
      "🐦 AVE QUE NO VUELA\n\n" +
      "⚠️ ANTES DE INTERVENIR\n" +
      "• Un ave que no vuela no siempre necesita ser rescatada de inmediato.\n" +
      "• Puede tratarse de un volantón que está aprendiendo a volar o de un ave que necesita ayuda.\n" +
      "• Observa primero la situación desde cierta distancia.\n" +
      "• Si tienes dudas sobre si se trata de una cría, pollo o volantón, vuelve al paso anterior y selecciona la opción 'Es cría'.\n\n" +
      "❌ QUÉ NO HACER\n" +
      "• No le des comida ni agua sin indicación.\n" +
      "• No la manipules más de lo necesario.\n" +
      "• No la persigas ni intentes forzar el vuelo.\n\n" +
      "✅ QUÉ HACER\n" +
      "• Mantén alejadas a las personas y a los animales domésticos.\n" +
      "• Reduce ruidos y evita utilizar flash.\n" +
      "• Observa si presenta heridas, debilidad, dificultad para moverse o un comportamiento anómalo.\n" +
      "• Si observas alguno de estos signos, colócala en una caja de cartón cerrada y ventilada o en un transportín seguro.\n" +
      "• Contacta con un centro especializado, Agentes Forestales o Emergencias para recibir orientación.\n" +
      "• Continúa con el siguiente paso para compartir la información necesaria y recibir una mejor orientación."
    );
  }

  if (hasImmediateRisk(flags) || flags.other) {
    return (
      "🐦 AVE PEQUEÑA EN SITUACIÓN DE RIESGO\n\n" +
      "🚨 SITUACIÓN OBSERVADA\n" +
      getObservedSigns(flags) +
      "\n\n❌ QUÉ NO HACER\n" +
      "• No la persigas ni la manipules más de lo necesario.\n" +
      "• No le des comida ni agua sin indicación.\n\n" +
      "✅ QUÉ HACER\n" +
      "• Prioriza tu seguridad y evita detenerte en una zona de tráfico sin protección.\n" +
      "• Si puedes apartarla del peligro sin riesgo, muévela únicamente a un punto cercano y seguro.\n" +
      "• Contacta con un centro especializado, Agentes Forestales o Emergencias para recibir orientación."
    );
  }

  return (
    "🐦 AVE PEQUEÑA\n\n" +
    "⚠️ ANTES DE INTERVENIR\n" +
    "• Observa primero su comportamiento y el entorno desde cierta distancia.\n" +
    "• No todas las aves encontradas en el suelo necesitan ser recogidas.\n\n" +
    "❌ QUÉ NO HACER\n" +
    "• No la recojas automáticamente.\n" +
    "• No le des comida ni agua sin indicación.\n" +
    "• No la manipules para comprobar si está sana.\n\n" +
    "✅ QUÉ HACER\n" +
    "• Comprueba si existe peligro inmediato o alguna señal de lesión, debilidad o dificultad para moverse.\n" +
    "• Si parece una cría, vuelve al paso anterior y selecciona la opción 'Es cría'.\n" +
    "• Si observas alguna anomalía, vuelve al paso anterior y marca las opciones correspondientes."
  );
}

function getLargeBirdAdvice(flags: FlagsState) {
  if (hasPhysicalWarning(flags)) {
    return (
      "🦅 RAPAZ O AVE GRANDE QUE PUEDE NECESITAR AYUDA\n\n" +
      "🚨 SEÑALES OBSERVADAS\n" +
      getObservedSigns(flags, true) +
      "\n\n⚠️ PRECAUCIÓN\n" +
      "• Una rapaz o ave grande puede lesionarte con el pico, las alas o las garras.\n" +
      "• Mantén una distancia prudente y evita acercar la cara o las manos.\n\n" +
      "❌ QUÉ NO HACER\n" +
      "• No intentes sujetarla por las alas, las patas, el cuello o las plumas.\n" +
      "• No la persigas ni intentes comprobar si puede volar lanzándola al aire.\n" +
      "• No le des comida ni agua sin indicación.\n" +
      "• No la manipules más de lo necesario ni utilices flash.\n\n" +
      "✅ QUÉ HACER\n" +
      "• Reduce ruidos y evita la presencia innecesaria de personas y animales domésticos.\n" +
      "• Contacta cuanto antes con un centro especializado, Agentes Forestales o Emergencias para recibir orientación.\n" +
      "• Si te indican que debes contenerla y puedes hacerlo sin riesgo, utiliza una manta o toalla gruesa para cubrirla.\n" +
      "• Introdúcela en un transportín o caja de cartón resistente, cerrada y bien ventilada.\n" +
      "• Mantén el recipiente en un lugar tranquilo y protegido del frío o del calor extremo.\n" +
      "• Si ha sido atacada por un gato o perro, necesita valoración aunque no observes heridas evidentes.\n" +
      "• Continúa con el siguiente paso para compartir la información necesaria y recibir una mejor orientación."
    );
  }

  if (flags.cannotFly) {
    const additionalRisk = hasImmediateRisk(flags) || flags.other;

    return (
      "🦅 RAPAZ O AVE GRANDE QUE NO VUELA\n\n" +
      "⚠️ ANTES DE INTERVENIR\n" +
      "• Una rapaz o ave grande que no vuela no siempre necesita ser rescatada de inmediato.\n" +
      "• Puede tratarse de un ejemplar joven en fase de aprendizaje o emancipación.\n" +
      "• Los adultos pueden continuar alimentándolo y vigilándolo desde las proximidades.\n" +
      "• Observa primero la situación desde una distancia prudente, siempre que no exista peligro inmediato.\n\n" +
      (additionalRisk
        ? "🚨 SITUACIÓN OBSERVADA\n" +
          getObservedSigns(flags, true) +
          "\n\n"
        : "🚨 PUEDE NECESITAR AYUDA SI\n" +
          "• Presenta heridas, sangrado, debilidad o respiración anómala.\n" +
          "• No puede mantenerse erguida o desplazarse con normalidad.\n" +
          "• Tiene un ala caída o en una posición anómala.\n" +
          "• Ha sufrido un ataque de gato o perro.\n" +
          "• Permanece expuesta en una carretera, zona de paso o lugar peligroso.\n" +
          "• Tras observarla a distancia, muestra un comportamiento claramente anómalo.\n\n") +
      "❌ QUÉ NO HACER\n" +
      "• No la recojas automáticamente por estar en el suelo o no volar.\n" +
      "• No la persigas ni la lances al aire para comprobar si vuela.\n" +
      "• No acerques la cara ni las manos desnudas.\n" +
      "• No intentes sujetarla por las alas, las patas o el cuello.\n" +
      "• No le des comida ni agua sin indicación.\n\n" +
      "✅ QUÉ HACER\n" +
      "• Mantén alejadas a personas y animales domésticos y reduce los ruidos.\n" +
      "• Observa si los adultos se mantienen cerca o continúan atendiéndola.\n" +
      (additionalRisk
        ? "• Si existe peligro inmediato, prioriza tu seguridad y solicita ayuda especializada antes de intervenir.\n"
        : "• Si no presenta anomalías y se encuentra en un lugar seguro, evita intervenir y solicita orientación si tienes dudas.\n") +
      "• Si necesita ayuda, contacta con un centro especializado, Agentes Forestales o Emergencias antes de manipularla.\n" +
      "• Realiza únicamente las fotos o vídeos necesarios desde una distancia segura y no utilices flash.\n" +
      "• Continúa con el siguiente paso para compartir la información necesaria y recibir una mejor orientación."
    );
  }

  if (hasImmediateRisk(flags) || flags.other) {
    return (
      "🦅 RAPAZ O AVE GRANDE EN SITUACIÓN DE RIESGO\n\n" +
      "🚨 SITUACIÓN OBSERVADA\n" +
      getObservedSigns(flags) +
      "\n\n⚠️ PRECAUCIÓN\n" +
      "• Una rapaz o ave grande puede lesionarte con el pico, las alas o las garras.\n" +
      "• Mantén una distancia prudente y evita acorralarla.\n\n" +
      "❌ QUÉ NO HACER\n" +
      "• No te pongas en peligro ni intentes detener el tráfico por tu cuenta.\n" +
      "• No la persigas ni intentes capturarla sin orientación.\n" +
      "• No le des comida ni agua sin indicación.\n\n" +
      "✅ QUÉ HACER\n" +
      "• Aleja a personas y animales domésticos si puedes hacerlo con seguridad.\n" +
      "• Si se encuentra en una carretera o zona de tráfico, prioriza tu seguridad y avisa a Emergencias o a los agentes competentes.\n" +
      "• Contacta con un centro especializado, Agentes Forestales o Emergencias para recibir instrucciones.\n" +
      "• Realiza únicamente las fotos o vídeos necesarios desde una distancia segura y no utilices flash."
    );
  }

  return (
    "🦅 RAPAZ O AVE GRANDE\n\n" +
    "⚠️ ANTES DE INTERVENIR\n" +
    "• Mantén una distancia prudente y observa primero su comportamiento y el entorno.\n" +
    "• Una rapaz o ave grande puede lesionarte con el pico, las alas o las garras.\n" +
    "• Su presencia en el suelo o en una rama baja no significa necesariamente que necesite ser recogida.\n\n" +
    "❌ QUÉ NO HACER\n" +
    "• No la manipules para comprobar si está sana.\n" +
    "• No acerques la cara ni las manos desnudas.\n" +
    "• No le des comida ni agua sin indicación.\n" +
    "• No utilices flash.\n\n" +
    "✅ QUÉ HACER\n" +
    "• Comprueba desde lejos si presenta heridas, debilidad, dificultad para moverse o algún comportamiento anómalo.\n" +
    "• Mantén alejadas a personas y animales domésticos y reduce los ruidos.\n" +
    "• Si parece una cría o un ejemplar joven, vuelve al paso anterior y selecciona la opción 'Es cría'.\n" +
    "• Si observas alguna anomalía, vuelve al paso anterior y marca las opciones correspondientes.\n" +
    "• Si tienes dudas, contacta con un centro especializado, Agentes Forestales o Emergencias para recibir orientación."
  );
}

function getBatAdvice(flags: FlagsState) {
  const needsHelp = hasAnyConcern(flags) || flags.cannotFly;

  return (
    "🦇 MURCIÉLAGO\n\n" +
    "⚠️ ANTES DE INTERVENIR\n" +
    "• No lo toques directamente con las manos desnudas, aunque parezca inmóvil.\n" +
    "• Mantén alejados a niños y animales domésticos.\n" +
    (needsHelp
      ? "• Las señales seleccionadas indican que puede necesitar ayuda especializada.\n\n"
      : "• Observa si presenta heridas, debilidad, dificultad para moverse o si permanece en el suelo durante el día.\n\n") +
    (needsHelp
      ? "🚨 SEÑALES OBSERVADAS\n" + getObservedSigns(flags, true) + "\n\n"
      : "") +
    "❌ QUÉ NO HACER\n" +
    "• No lo cojas con las manos desnudas.\n" +
    "• No intentes comprobar si puede volar lanzándolo al aire.\n" +
    "• No le des comida ni agua sin indicación.\n" +
    "• No lo manipules más de lo necesario ni utilices flash.\n\n" +
    "✅ QUÉ HACER\n" +
    "• Si debes recogerlo y puedes hacerlo sin riesgo, utiliza guantes gruesos o una tela.\n" +
    "• Colócalo en una caja de cartón cerrada y ventilada, con una tela o papel absorbente en el fondo.\n" +
    "• Mantén la caja en un lugar tranquilo, oscuro y protegido del frío o del calor extremo.\n" +
    "• Si ha tenido contacto con una persona o un animal doméstico, comunícalo al centro especializado.\n" +
    "• Contacta con un centro especializado, Agentes Forestales o Emergencias para recibir orientación.\n" +
    "• Continúa con el siguiente paso para compartir la información necesaria y recibir una mejor orientación."
  );
}

function getSmallMammalAdvice(flags: FlagsState) {
  const needsHelp = hasAnyConcern(flags);

  return (
    "🐭 PEQUEÑO MAMÍFERO\n\n" +
    "⚠️ ANTES DE INTERVENIR\n" +
    "• Mantén distancia y observa su comportamiento antes de acercarte.\n" +
    (needsHelp
      ? "• Las señales seleccionadas indican que puede necesitar valoración especializada.\n\n"
      : "• Si no presenta anomalías ni existe peligro inmediato, evita recogerlo sin necesidad.\n\n") +
    (needsHelp
      ? "🚨 SEÑALES OBSERVADAS\n" + getObservedSigns(flags) + "\n\n"
      : "") +
    "❌ QUÉ NO HACER\n" +
    "• No lo manipules más de lo necesario.\n" +
    "• No lo sujetes por la cola, las patas o la cabeza.\n" +
    "• No le des comida ni agua sin indicación.\n" +
    "• Evita hacer fotos o vídeos innecesarios y no utilices flash.\n\n" +
    "✅ QUÉ HACER\n" +
    (needsHelp
      ? "• Si puedes hacerlo sin riesgo, colócalo en una caja de cartón cerrada y ventilada o en un recipiente seguro.\n" +
        "• Mantén el recipiente en un lugar tranquilo y protegido del frío o del calor extremo.\n"
      : "• Mantén alejadas a personas y animales domésticos y solicita orientación si tienes dudas.\n") +
    "• Si ha sido atacado por un gato o perro, necesita valoración aunque no observes heridas evidentes.\n" +
    "• Contacta con un centro especializado, Agentes Forestales o Emergencias para recibir orientación."
  );
}

function getLargeMammalAdvice(flags: FlagsState) {
  const needsHelp = hasAnyConcern(flags);

  return (
    "🦌 MAMÍFERO GRANDE\n\n" +
    "⚠️ ANTES DE INTERVENIR\n" +
    "• Mantén distancia y observa desde lejos.\n" +
    "• Puede reaccionar con fuerza por miedo, estrés o dolor.\n" +
    (needsHelp
      ? "• Las señales seleccionadas indican que puede necesitar intervención especializada.\n\n"
      : "• Si no existe peligro ni presenta anomalías, evita acercarte o intervenir.\n\n") +
    (needsHelp
      ? "🚨 SEÑALES OBSERVADAS\n" + getObservedSigns(flags) + "\n\n"
      : "") +
    "❌ QUÉ NO HACER\n" +
    "• No intentes capturarlo, sujetarlo ni trasladarlo.\n" +
    "• No lo acorrales ni bloquees su vía de escape.\n" +
    "• No le des comida ni agua sin indicación.\n" +
    "• No te acerques para hacer fotos o vídeos y no utilices flash.\n\n" +
    "✅ QUÉ HACER\n" +
    "• Reduce ruidos y aleja a personas, perros y vehículos.\n" +
    "• Si está en una carretera, prioriza tu seguridad y avisa a Emergencias o a los agentes competentes.\n" +
    "• Contacta cuanto antes con un centro especializado, Agentes Forestales o Emergencias.\n" +
    "• Sigue siempre las indicaciones del personal especializado."
  );
}

function getReptileAmphibianAdvice(flags: FlagsState) {
  const needsHelp = hasAnyConcern(flags);

  return (
    "🐸 REPTIL O ANFIBIO\n\n" +
    "⚠️ ANTES DE INTERVENIR\n" +
    "• Observa la situación antes de actuar y evita el contacto directo si no puedes identificar el animal con seguridad.\n" +
    (needsHelp
      ? "• Las señales seleccionadas indican que puede necesitar ayuda o ser apartado de un peligro inmediato.\n\n"
      : "• Si se desplaza con normalidad y no existe peligro, evita manipularlo o trasladarlo.\n\n") +
    (needsHelp
      ? "🚨 SEÑALES OBSERVADAS\n" + getObservedSigns(flags) + "\n\n"
      : "") +
    "❌ QUÉ NO HACER\n" +
    "• No lo manipules sin necesidad.\n" +
    "• No manipules serpientes o culebras directamente con las manos si no puedes identificarlas con seguridad.\n" +
    "• No lo traslades a grandes distancias.\n" +
    "• No le des comida ni agua sin indicación.\n\n" +
    "✅ QUÉ HACER\n" +
    "• Reduce ruidos y evita la presencia de personas y animales domésticos.\n" +
    "• Si debes moverlo por seguridad y puedes hacerlo sin riesgo, utiliza un recipiente seguro y ventilado.\n" +
    "• Déjalo en una zona adecuada y lo más cercana posible al lugar donde fue encontrado.\n" +
    "• Evita manipularlo en exceso para hacer fotos o vídeos y no utilices flash.\n" +
    "• Contacta con el centro de recuperación más cercano para recibir orientación."
  );
}

function getUnknownAnimalAdvice(flags: FlagsState) {
  const needsHelp = hasAnyConcern(flags) || flags.cannotFly;

  return (
    "❓ ANIMAL SIN IDENTIFICAR\n\n" +
    "⚠️ ANTES DE INTERVENIR\n" +
    "• Mantén distancia y observa desde lejos.\n" +
    "• No intentes manipularlo si no puedes valorar con seguridad qué animal es.\n" +
    (needsHelp
      ? "• Las señales seleccionadas indican que puede necesitar ayuda especializada.\n\n"
      : "• Si no presenta anomalías ni existe peligro inmediato, evita intervenir.\n\n") +
    (needsHelp
      ? "🚨 SEÑALES OBSERVADAS\n" + getObservedSigns(flags, true) + "\n\n"
      : "") +
    "❌ QUÉ NO HACER\n" +
    "• No lo toques con las manos desnudas.\n" +
    "• No intentes liberarlo, sujetarlo o trasladarlo sin conocer los riesgos.\n" +
    "• No le des comida ni agua sin indicación.\n" +
    "• No utilices flash.\n\n" +
    "✅ QUÉ HACER\n" +
    "• Aleja a personas y animales domésticos.\n" +
    "• Si existe peligro inmediato, solicita ayuda antes de intervenir.\n" +
    "• Realiza únicamente las fotos o vídeos necesarios desde una distancia segura.\n" +
    "• Contacta con un centro especializado, Agentes Forestales o Emergencias para recibir orientación."
  );
}

function getAdvice(
  animalState: AnimalState,
  animalType: AnimalType,
  flags: FlagsState,
) {
  if (animalState === "dead") {
    return (
      "☠️ ANIMAL MUERTO\n\n" +
      "⚠️ ANTES DE INTERVENIR\n" +
      "• No toques ni muevas el cadáver ni alteres el entorno donde se encuentra.\n" +
      "• Puede contener información importante para una investigación pericial o judicial.\n\n" +
      "🔍 QUÉ OBSERVAR\n" +
      "• Comprueba desde una distancia segura si existen cebos, recipientes, tendidos eléctricos, posibles impactos de disparo, lazos, trampas u otros elementos sospechosos.\n" +
      "• Si sospechas de un posible envenenamiento, evita tocar el animal, los cebos o cualquier sustancia cercana.\n\n" +
      "📸 QUÉ HACER\n" +
      "• Si puedes hacerlo con seguridad, realiza fotografías del animal y de la zona sin modificar nada.\n" +
      "• Comunica el hallazgo a los agentes medioambientales, fuerzas de seguridad o servicios de emergencias.\n" +
      "• Informa de cualquier circunstancia que consideres relevante."
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

function normalizePhone(phone: string) {
  return phone.replace(/[^\d+]/g, "");
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

function isValidPhone(phone: string) {
  const normalized = normalizePhone(phone);
  const plusCount = (normalized.match(/\+/g) || []).length;

  if (plusCount > 1) return false;
  if (normalized.includes("+") && !normalized.startsWith("+")) return false;

  return countDigits(normalized) >= 9;
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState<Step>(1);
  const [showWelcome, setShowWelcome] = useState(true);

  const [showContacts, setShowContacts] = useState(false);
  const [showWhatsAppOptions, setShowWhatsAppOptions] = useState(false);
  const [showProvinces, setShowProvinces] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [provinceSearch, setProvinceSearch] = useState("");

  const [customWhatsAppNumber, setCustomWhatsAppNumber] = useState("");
  const [hasSentWhatsApp, setHasSentWhatsApp] = useState(false);
  const [showWhatsAppConfirmation, setShowWhatsAppConfirmation] =
    useState(false);
  const [lastWhatsAppNumber, setLastWhatsAppNumber] = useState("");
  const [hasOpenedHelpPhones, setHasOpenedHelpPhones] = useState(false);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [animalState, setAnimalState] = useState<AnimalState>("alive");
  const [animalType, setAnimalType] = useState<AnimalType>("unknown");

  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [videoUri, setVideoUri] = useState<string | null>(null);

  const [locationText, setLocationText] = useState(
    "Ubicación no capturada todavía.",
  );
  const [coords, setCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [locationCaptured, setLocationCaptured] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null);
  const [scrollY, setScrollY] = useState(0);
  const [scrollContentHeight, setScrollContentHeight] = useState(0);
  const [scrollLayoutHeight, setScrollLayoutHeight] = useState(0);
  const [flags, setFlags] = useState<FlagsState>({
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
  });

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

  const showStep5ActionBar =
    !showWelcome &&
    step === 5 &&
    !showContacts &&
    !showWhatsAppOptions &&
    !showProvinces &&
    !selectedProvince;

  const canShowStep1ScrollHint =
    !showWelcome &&
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
    showWelcome,
  ]);

  const generatedSummary = useMemo(() => {
    const mapsUrl = coords
      ? `https://maps.google.com/?q=${coords.latitude},${coords.longitude}`
      : "Sin ubicación";

    return [
      "AVISO DE RESCATE DE FAUNA",
      `Nombre: ${fullName || "No indicado"}`,
      `Teléfono: ${phone || "No indicado"}`,
      `Estado del animal: ${selectedAnimalStateLabel}`,
      `Tipo de animal: ${selectedAnimalLabel}`,
      `Ubicación: ${locationText}`,
      `Mapa: ${mapsUrl}`,
      `Situación observada: ${selectedFlags}`,
      flags.other ? "Situación adicional: Otro" : null,
      `Foto capturada: ${photoUri ? "sí" : "no"}`,
      `Vídeo capturado: ${videoUri ? "sí" : "no"}`,
    ]
      .filter(Boolean)
      .join("\n");
  }, [
    coords,
    flags.other,
    fullName,
    locationText,
    phone,
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

      setCoords({
        latitude: current.coords.latitude,
        longitude: current.coords.longitude,
      });

      setLocationText(
        `${current.coords.latitude.toFixed(5)}, ${current.coords.longitude.toFixed(5)}`,
      );
      setLocationCaptured(true);
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
  };

  const openWhatsAppWithNumber = async (number: string) => {
    const cleaned = normalizeWhatsAppNumber(number);

    if (!cleaned || countDigits(cleaned) < 9) {
      Alert.alert(
        "Número no válido",
        "Introduce un número de WhatsApp válido, con prefijo si hace falta.",
      );
      return;
    }

    const text = encodeURIComponent(generatedSummary);
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

    Alert.alert(
      "No se pudo abrir WhatsApp",
      "Comprueba que WhatsApp está instalado y vuelve a intentarlo.",
    );
  };

  const openMaps = async () => {
    if (!coords) return;

    const url = `https://maps.google.com/?q=${coords.latitude},${coords.longitude}`;
    await Linking.openURL(url);
  };

  const copySummary = async () => {
    await Clipboard.setStringAsync(generatedSummary);
    Alert.alert("Resumen copiado", "El resumen se ha copiado al portapapeles.");
  };

  const callNumber = async (phoneNumber: string) => {
    const url = `tel:${phoneNumber}`;
    await Linking.openURL(url);
  };

  const resetFlow = (returnToWelcome = false) => {
    setShowWelcome(returnToWelcome);
    setStep(1);
    setShowContacts(false);
    setShowWhatsAppConfirmation(false);
    setLastWhatsAppNumber("");
    setShowWhatsAppOptions(false);
    setShowProvinces(false);
    setSelectedProvince(null);
    setCustomWhatsAppNumber("");
    setHasSentWhatsApp(false);
    setHasOpenedHelpPhones(false);
    setFullName("");
    setPhone("");
    setAnimalState("alive");
    setAnimalType("unknown");
    setPhotoUri(null);
    setVideoUri(null);
    setLocationText("Ubicación no capturada todavía.");
    setCoords(null);
    setLocationCaptured(false);
    setLocationLoading(false);
    setProvinceSearch("");
    setFlags({
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
    });
  };

  const confirmCancelFlow = () => {
    Alert.alert(
      "Cancelar aviso",
      "¿Estás seguro de que deseas cancelar este aviso?\n\nSe perderá toda la información introducida y volverás a la pantalla inicial.",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Sí",
          onPress: () => resetFlow(true),
        },
      ],
    );
  };

  const finishFlow = () => {
    Alert.alert(
      "Finalizar aviso",
      "¿Estás seguro de que deseas finalizar este aviso?\n\nSi continúas se eliminará toda la información introducida y volverás a la pantalla inicial.",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Sí",
          onPress: () => {
            Alert.alert(
              "Gracias",
              "Gracias por colaborar y ayudar a los animales.",
              [
                {
                  text: "Aceptar",
                  onPress: () => resetFlow(true),
                },
              ],
            );
          },
        },
      ],
    );
  };

  const validateStep = () => {
    if (step === 3) {
      if (!fullName.trim()) {
        Alert.alert(
          "Falta el nombre",
          "Introduce tu nombre y apellidos antes de continuar.",
        );
        return false;
      }

      if (!phone.trim()) {
        Alert.alert(
          "Falta el teléfono",
          "Introduce un teléfono de contacto antes de continuar.",
        );
        return false;
      }

      if (!isValidPhone(phone)) {
        Alert.alert(
          "Teléfono no válido",
          "Introduce un teléfono válido, con al menos 9 dígitos.",
        );
        return false;
      }
    }

    if (step === 4) {
      if (!photoUri && !videoUri && !locationCaptured) {
        Alert.alert(
          "Información incompleta",
          "Conviene añadir al menos una foto, un vídeo o capturar la ubicación antes de continuar.",
        );
        return false;
      }
    }

    return true;
  };

  const goNext = () => {
    if (!validateStep()) return;
    if (step < 5) setStep((prev) => (prev + 1) as Step);
  };

  const goBack = () => {
    if (showWhatsAppOptions) {
      setShowWhatsAppOptions(false);
      return;
    }

    if (selectedProvince) {
      setSelectedProvince(null);
      return;
    }

    if (showProvinces) {
      setShowProvinces(false);
      return;
    }

    if (showContacts) {
      setShowContacts(false);
      return;
    }

    if (step > 1) {
      setStep((prev) => (prev - 1) as Step);
    }
  };

  const handleOpenHelp = () => {
    setHasOpenedHelpPhones(true);
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
          Aquí tienes primero los teléfonos nacionales y, debajo, el acceso a
          contactos por provincias.
        </Text>

        {NATIONAL_HELP_CONTACTS.map((contact) => (
          <Pressable
            key={contact.name}
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

        <Pressable
          style={styles.secondaryButton}
          onPress={handleOpenProvincePhones}
        >
          <Text style={styles.secondaryButtonText}>
            Teléfonos de ayuda por provincias
          </Text>
        </Pressable>
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

  const renderWhatsAppOptions = () => (
    <SectionCard title="Enviar por WhatsApp">
      <View style={styles.sectionContent}>
        <Text style={styles.sectionDescription}>
          El resumen está listo para WhatsApp. Pulsa la flecha izquierda para
          volver, o Cancelar para descartar el aviso.
        </Text>

        <Pressable
          style={styles.primaryButton}
          onPress={() => openWhatsAppWithNumber(GREFA_WHATSAPP)}
        >
          <Text style={styles.primaryButtonText}>GREFA (Madrid)</Text>
        </Pressable>

        <View style={styles.warningBox}>
          <Text style={styles.warningText}>
            Grefa (Madrid) es solo para avisos gestionados en la Comunidad de
            Madrid. Para otras provincias utiliza Ayuda del paso anterior y
            busca el centro más cercano.
          </Text>
        </View>

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
          <Text style={styles.secondaryButtonText}>
            Enviar a otro contacto WhatsApp
          </Text>
        </Pressable>

        <View style={styles.warningBox}>
          <Text style={styles.warningText}>
            Si necesitas enviar la información recopilada a otro contacto de
            WhatsApp, introduce el número de WhatsApp y pulsa en Enviar a otro
            contacto WhatsApp
          </Text>
        </View>

        <Pressable
          style={[
            styles.primaryButton,
            !hasSentWhatsApp && styles.disabledButton,
          ]}
          onPress={finishFlow}
          disabled={!hasSentWhatsApp}
        >
          <Text style={styles.primaryButtonText}>Finalizar</Text>
        </Pressable>

        <Pressable style={styles.secondaryButton} onPress={confirmCancelFlow}>
          <Text style={styles.secondaryButtonText}>Cancelar</Text>
        </Pressable>
      </View>
    </SectionCard>
  );

  const renderStep5ActionBar = () => {
    if (
      showWhatsAppOptions ||
      showContacts ||
      showProvinces ||
      showWelcome ||
      selectedProvince ||
      step !== 5
    ) {
      return null;
    }

    if (animalState === "dead") {
      return (
        <View style={styles.step5ActionBar}>
          <Pressable style={styles.menuActionButton} onPress={copySummary}>
            <Text style={styles.menuActionEmoji}>📋</Text>
            <Text style={styles.menuActionLabel}>Copiar</Text>
          </Pressable>

          <Pressable style={styles.menuActionButton} onPress={handleOpenHelp}>
            <Text style={styles.menuActionEmoji}>📞</Text>
            <Text style={styles.menuActionLabel}>Ayuda</Text>
          </Pressable>

          <Pressable
            style={[styles.menuActionButton, styles.menuActionButtonPrimary]}
            onPress={finishFlow}
          >
            <Text style={styles.menuActionEmoji}>✅</Text>
            <Text style={styles.menuActionLabelPrimary}>Finalizar</Text>
          </Pressable>
        </View>
      );
    }

    return (
      <View style={styles.step5ActionBar}>
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
    if (showWelcome) return null;

    const isOverlayOpen =
      showContacts ||
      showWhatsAppOptions ||
      showProvinces ||
      !!selectedProvince;
    const canShowBackArrow = isOverlayOpen || step > 1;
    const canShowForwardArrow = !isOverlayOpen && step < 5;

    return (
      <View pointerEvents="box-none" style={styles.sideNavOverlay}>
        {canShowBackArrow ? (
          <Pressable style={styles.sideArrowLeft} onPress={goBack}>
            <Text style={styles.sideArrowText}>‹</Text>
          </Pressable>
        ) : (
          <View style={styles.sideArrowPlaceholder} />
        )}

        {canShowForwardArrow ? (
          <Pressable style={styles.sideArrowRight} onPress={goNext}>
            <Text style={styles.sideArrowText}>›</Text>
          </Pressable>
        ) : (
          <View style={styles.sideArrowPlaceholder} />
        )}
      </View>
    );
  };

  const renderWelcome = () => (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardAvoid}
      keyboardVerticalOffset={90}
    >
      <SectionCard title="SOS Fauna España">
        <View style={styles.welcomeContent}>
          <Text style={styles.welcomeTitle}>
            Asistente de rescate de fauna silvestre
          </Text>

          <Text style={styles.welcomeVersion}>Versión 1.1.0</Text>

          <View style={styles.welcomeScopeBox}>
            <Text style={styles.welcomeScopeText}>
              Aplicación de apoyo para comunicar incidencias con fauna
              silvestre. Solo cubre España.
            </Text>
            <Text style={styles.welcomeScopeSmall}>
              Los contactos y teléfonos incluidos están orientados al ámbito
              español.
            </Text>
          </View>

          <View style={styles.warningBox}>
            <Text style={styles.warningText}>
              La información proporcionada por esta aplicación es orientativa y
              no sustituye el criterio de veterinarios, agentes medioambientales
              ni servicios de emergencia.
            </Text>
          </View>

          <View
            style={{
              backgroundColor: "#f3f4f6",
              borderWidth: 1,
              borderColor: "#d1d5db",
              borderRadius: 12,
              padding: 12,
              gap: 6,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "700",
                color: "#374151",
              }}
            >
              Información importante
            </Text>

            <Text
              style={{
                fontSize: 13,
                lineHeight: 18,
                color: "#4b5563",
              }}
            >
              • Proyecto independiente de apoyo al rescate de fauna silvestre.
            </Text>

            <Text
              style={{
                fontSize: 13,
                lineHeight: 18,
                color: "#4b5563",
              }}
            >
              • No es una aplicación oficial de ninguna administración pública, servicio de
            emergencias, cuerpo policial o entidad mencionada en esta app.
            </Text>

            <Text
              style={{
                fontSize: 13,
                lineHeight: 18,
                color: "#4b5563",
              }}
            >
              • Los datos introducidos permanecen en el dispositivo y solo se
              comparten cuando el usuario decide enviarlos.
            </Text>

            <Text
              style={{
                fontSize: 13,
                lineHeight: 18,
                color: "#4b5563",
              }}
            >
              • Consulte la política de privacidad para más información.
            </Text>
          </View>

          <Pressable
            style={styles.primaryButton}
            onPress={() => setShowWelcome(false)}
          >
            <Text style={styles.primaryButtonText}>Comenzar aviso</Text>
          </Pressable>

          <Text style={styles.welcomeFooter}>
            Desarrollado como proyecto de apoyo a la conservación y rescate de
            fauna silvestre.
          </Text>
        </View>
      </SectionCard>
    </KeyboardAvoidingView>
  );

  const renderStep = () => {
    if (showWelcome) return renderWelcome();
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
                Indica primero si el animal está vivo o muerto. Después completa
                solo los datos que correspondan.
              </Text>

              <View style={styles.sectionGroup}>
                <Text style={styles.subheading}>Estado del animal</Text>
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
                            setFlags({
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
                            });
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

              {animalState === "dead" ? (
                <View style={styles.warningBox}>
                  <Text style={styles.warningText}>
                    Si el animal está muerto, no lo toques ni modifiques el
                    lugar. Continúa para ver qué hacer.
                  </Text>
                </View>
              ) : (
                <>
                  <View style={styles.sectionGroup}>
                    <Text style={styles.subheading}>Tipo de animal</Text>
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

                  <View style={styles.sectionGroup}>
                    <Text style={styles.subheading}>Situación observada</Text>
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
                </>
              )}
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
              Sigue estas recomendaciones antes de actuar o mover al animal.
            </Text>

            <Text style={[styles.summaryBox, styles.adviceBox]}>{advice}</Text>
          </View>
        </SectionCard>
      );
    }

    if (step === 3) {
      return (
        <SectionCard title="Paso 3. Datos de contacto">
          <View style={styles.sectionContent}>
            <Text style={styles.sectionDescription}>
              Facilita tu nombre para que los especialistas sepan a quién
              dirigirse y un número de teléfono en caso de que necesiten ponerse
              en contacto contigo.
            </Text>

            <TextInput
              placeholder="Nombre y apellidos"
              value={fullName}
              onChangeText={setFullName}
              style={styles.input}
            />

            <TextInput
              placeholder="Teléfono de contacto"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              style={styles.input}
            />

            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                Tus datos no se almacenan en esta app ni se usan para ningún
                otro fin.
              </Text>
            </View>

            <View style={styles.inlineActionRow}>
              <Pressable
                style={styles.secondaryButtonSmall}
                onPress={resetFlow}
              >
                <Text style={styles.secondaryButtonText}>↺ Limpiar</Text>
              </Pressable>
            </View>
          </View>
        </SectionCard>
      );
    }

    if (step === 4) {
      return (
        <SectionCard title="Paso 4. Foto, vídeo y ubicación">
          <View style={styles.sectionContent}>
            <Text style={styles.sectionDescription}>
              Captura una foto y/o un vídeo y obtén la ubicación del hallazgo.
            </Text>

            <Pressable style={styles.primaryButton} onPress={pickPhoto}>
              <Text style={styles.primaryButtonText}>
                {photoUri ? "Cambiar foto" : "Hacer foto"}
              </Text>
            </Pressable>

            <Pressable style={styles.primaryButton} onPress={pickVideo}>
              <Text style={styles.primaryButtonText}>
                {videoUri ? "Cambiar vídeo" : "Grabar vídeo"}
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

            {locationCaptured ? (
              <View style={styles.successBox}>
                <Text style={styles.successText}>
                  Ubicación capturada correctamente
                </Text>
              </View>
            ) : null}

            <Text style={styles.helperText}>
              {photoUri
                ? "Foto capturada y guardada en el dispositivo"
                : "Sin foto todavía."}
            </Text>

            <Text style={styles.helperText}>
              {videoUri
                ? "Vídeo capturado y guardado en el dispositivo"
                : "Sin vídeo todavía."}
            </Text>

            <Text style={styles.helperText}>{locationText}</Text>

            <View style={styles.mapCard}>
              <Text style={styles.mapTitle}>Ubicación del hallazgo</Text>

              {coords ? (
                <>
                  <View style={styles.mapLocationBox}>
                    <Text style={styles.mapPin}>📍</Text>
                    <Text style={styles.mapLocationTitle}>
                      Punto capturado correctamente
                    </Text>
                    <Text style={styles.mapCoords}>
                      {coords.latitude.toFixed(5)},{" "}
                      {coords.longitude.toFixed(5)}
                    </Text>
                    <Text style={styles.mapEmptyText}>
                      Puedes abrir la ubicación en Google Maps para ver calles,
                      caminos y referencias cercanas.
                    </Text>
                  </View>

                  <Pressable style={styles.mapOpenButton} onPress={openMaps}>
                    <Text style={styles.mapOpenButtonText}>Abrir mapa</Text>
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
          <SectionCard title="Paso 5. Resumen">
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
        <SectionCard title="Paso 5. Resumen">
          <View style={styles.sectionContent}>
            <View style={styles.step5Instructions}>
              <Text style={styles.bulletText}>
                • Revisa si el resumen es correcto o retrocede para corregir.
              </Text>
              <Text style={styles.bulletText}>
                • Usa <Text style={styles.bulletStrong}>WhatsApp</Text> para
                enviarlo a GREFA Madrid o a otro contacto que elijas.
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

            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                Importante: la foto y el vídeo no se adjuntan automáticamente.
                Deberás enviarlos manualmente desde WhatsApp.
              </Text>
            </View>
          </View>
        </SectionCard>
      </KeyboardAvoidingView>
    );
  };

  return (
    <SafeAreaView style={styles.screen} edges={["bottom"]}>
      <Stack.Screen
        options={{ title: "Rescate SOS Fauna España - Asistente" }}
      />

      {showStep5ActionBar ? renderStep5ActionBar() : null}

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={[
          styles.container,
          {
            paddingTop: showStep5ActionBar ? 84 : 12,
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
  step5ActionBar: {
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

  step5Instructions: {
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
  sideNavOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    pointerEvents: "box-none",
  },
  sideArrowLeft: {
    position: "absolute",
    left: 0,
    width: 22,
    height: 120,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    backgroundColor: "#14532d",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },
  sideArrowRight: {
    position: "absolute",
    right: 0,
    width: 22,
    height: 120,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    backgroundColor: "#14532d",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },
  sideArrowPlaceholder: {
    width: 22,
    height: 120,
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
