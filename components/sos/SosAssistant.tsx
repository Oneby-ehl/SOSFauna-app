import { localiseAssistantLabel } from "@/i18n/assistantLabels";
import { useInformationPagePath } from "@/components/i18n/InformationPageSupport";
// Protocol catalog recommendationFragmentsEs resolves per invocation.
import { getEffectiveCatalog, type Catalog } from "@/i18n/translate";
import { DEFAULT_LOCALE, type Locale } from "@/i18n/types";
// General text catalogs resolve through the effective locale.
import { type LocationSummaryLine, type StoredLocationValue, readStoredLocationText, writeStoredLocationText } from "@/utils/rescueLocation";
import type { MarineAdviceRecommendation } from "@/utils/marineAdvice";
import { type AdviceParts, formatAdvice, withCommonEnd, withAdviceSupplements } from "@/utils/adviceComposition";
// Protocol catalog supplementalEs resolves per invocation.
// Protocol catalog deadAnimalEs resolves per invocation.
// Protocol catalog trappedEs resolves per invocation.
// Protocol catalog babyEs resolves per invocation.
// Protocol catalog sharedRescueEs resolves per invocation.
// Protocol catalog marineFlagsEs resolves per invocation.
// Protocol catalog marineAnimalEs resolves per invocation.
// Protocol catalog unknownAnimalEs resolves per invocation.
// Protocol catalog reptileAmphibianEs resolves per invocation.
// Protocol catalog largeMammalEs resolves per invocation.
// Protocol catalog smallMammalEs resolves per invocation.
// Protocol catalog batEs resolves per invocation.
// Protocol catalog largeBirdEs resolves per invocation.
// Protocol catalog smallBirdEs resolves per invocation.
import { assistantOptionsEs } from "@/i18n/catalogs/assistant-options.es";
import { useI18n } from "@/i18n/I18nProvider";
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
import * as Speech from "expo-speech";
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
  useWindowDimensions,
  View,
} from "react-native";

import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { Stack, useRouter } from "expo-router";
import { RecoveryCentersContent } from "@/components/contacts/RecoveryCentersPage";
import { SectionCard } from "@/components/SectionCard";
import { buildRescueShareMessage } from "@/utils/rescueShareMessage";

const generalTexts = getEffectiveCatalog();

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type FlagsState = {
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
  stranded: boolean;
  fishingLineHook: boolean;
  moreAnimals: boolean;
  peopleDogsNearby: boolean;
  restingOnLand: boolean;
  other: boolean;
};

export type AnimalType =
  | "smallBird"
  | "largeBird"
  | "bat"
  | "smallMammal"
  | "largeMammal"
  | "reptileAmphibian"
  | "dolphin"
  | "largeCetacean"
  | "seal"
  | "seaTurtle"
  | "sharkRay"
  | "otherMarine"
  | "unknown";

export type AnimalState = "alive" | "dead";

type AnimalPlace = NonNullable<RescueCase["animalPlace"]>;
type AnimalPosition = NonNullable<RescueCase["animalPosition"]>;
type AnimalEnvironment = NonNullable<RescueCase["animalEnvironment"]>;

type Step = 1 | 2 | 3 | 4;

const GREFA_WHATSAPP = "34648539901";

export const COMMON_END =
  getEffectiveCatalog().supplementalAdvice.commonEnd;

type AnimalOption = { key: AnimalType; label: string };
type FlagOption = { key: keyof FlagsState; label: string };
type PositionOption = { key: AnimalPosition; label: string };
type EnvironmentOption = { key: AnimalEnvironment; label: string };

const TERRESTRIAL_ANIMAL_OPTIONS: AnimalOption[] = [
  { key: "smallBird", label: "Ave pequeña" },
  { key: "largeBird", label: "Ave mediana / grande" },
  { key: "bat", label: "Murciélago" },
  { key: "smallMammal", label: "Pequeño mamífero" },
  { key: "largeMammal", label: "Mamífero grande" },
  { key: "reptileAmphibian", label: "Reptil / anfibio" },
];

const MARINE_ANIMAL_OPTIONS: AnimalOption[] = [
  { key: "dolphin", label: "Delfín" },
  { key: "largeCetacean", label: "Ballena / cetáceo grande" },
  { key: "seal", label: "Foca" },
  { key: "seaTurtle", label: "Tortuga marina" },
  { key: "sharkRay", label: "Tiburón / raya" },
  { key: "otherMarine", label: "Otro animal marino" },
];

const UNKNOWN_ANIMAL_OPTION: AnimalOption = {
  key: "unknown",
  label: "No estoy seguro",
};

const ANIMAL_OPTIONS: AnimalOption[] = [
  ...TERRESTRIAL_ANIMAL_OPTIONS,
  ...MARINE_ANIMAL_OPTIONS,
  UNKNOWN_ANIMAL_OPTION,
];

const ANIMAL_OPTION_GROUPS: {
  title: string;
  options: AnimalOption[];
  kind: "terrestrial" | "marine";
}[] = [
  {
    title: "🍃 Fauna terrestre y aves",
    options: TERRESTRIAL_ANIMAL_OPTIONS,
    kind: "terrestrial",
  },
  {
    title: "🌊 Fauna marina",
    options: MARINE_ANIMAL_OPTIONS,
    kind: "marine",
  },
];

const MARINE_ANIMAL_TYPES = new Set<AnimalType>([
  "dolphin",
  "largeCetacean",
  "seal",
  "seaTurtle",
  "sharkRay",
  "otherMarine",
]);

function isMarineAnimal(animalType: AnimalType) {
  return MARINE_ANIMAL_TYPES.has(animalType);
}

const ANIMAL_STATE_OPTIONS: { key: AnimalState; label: string }[] = [
  { key: "alive", label: "Vivo" },
  { key: "dead", label: "Muerto" },
];

const ANIMAL_PLACE_OPTIONS: { key: AnimalPlace; label: string }[] = [
  { key: "ground", label: "En el suelo" },
  { key: "treeOrBush", label: "En un árbol o arbusto" },
  { key: "buildingOrRoof", label: "En un edificio o tejado" },
  { key: "roadOrStreet", label: "En una carretera o calle" },
  { key: "parkOrGarden", label: "En un parque o jardín" },
  { key: "fieldOrNatural", label: "En el campo o entorno natural" },
  { key: "industrialArea", label: "En una zona industrial" },
  { key: "water", label: "En el agua" },
  { key: "otherPlace", label: "Otro lugar" },
];

const ANIMAL_POSITION_OPTIONS: PositionOption[] = [
  { key: "ground", label: "En el suelo" },
  { key: "treeOrBush", label: "En un árbol o arbusto" },
  { key: "buildingOrRoof", label: "En un edificio o tejado" },
  { key: "water", label: "En el agua" },
  { key: "beachSand", label: "En arena / playa" },
  { key: "shoreShallowWater", label: "En la orilla / agua somera" },
  { key: "rocksBreakwater", label: "En rocas / espigón" },
  { key: "portDock", label: "En un puerto / muelle" },
  { key: "onBoat", label: "En una embarcación" },
  { key: "otherPlace", label: "Otro lugar" },
];

const ANIMAL_ENVIRONMENT_OPTIONS: EnvironmentOption[] = [
  { key: "roadOrStreet", label: "En una carretera o calle" },
  { key: "parkOrGarden", label: "En un parque o jardín" },
  { key: "fieldOrNatural", label: "En el campo o entorno natural" },
  { key: "industrialArea", label: "En una zona industrial" },
  { key: "urbanArea", label: "En una zona urbana" },
  { key: "coastBeach", label: "En costa / playa" },
  { key: "rockyCoastCliff", label: "Zona rocosa / acantilado" },
  { key: "portMarina", label: "En puerto / marina" },
  { key: "openSea", label: "En mar abierto" },
  { key: "estuaryMouth", label: "Desembocadura / estuario" },
  { key: "otherEnvironment", label: "Otro entorno" },
];

const VISIBLE_POSITION_OPTIONS_BY_ANIMAL_TYPE: Record<
  AnimalType,
  PositionOption[]
> = {
  smallBird: [
    { key: "ground", label: assistantOptionsEs.assistantPositionOptions.ground },
    { key: "treeOrBush", label: assistantOptionsEs.assistantPositionOptions.treeOrBush },
    { key: "buildingOrRoof", label: assistantOptionsEs.assistantPositionOptions.buildingOrRoof },
    { key: "water", label: assistantOptionsEs.assistantPositionOptions.water },
    { key: "otherPlace", label: assistantOptionsEs.assistantPositionOptions.otherPlace },
  ],
  largeBird: [
    { key: "ground", label: assistantOptionsEs.assistantPositionOptions.ground },
    { key: "treeOrBush", label: assistantOptionsEs.assistantPositionOptions.treeOrBush },
    { key: "buildingOrRoof", label: assistantOptionsEs.assistantPositionOptions.buildingOrRoof },
    { key: "water", label: assistantOptionsEs.assistantPositionOptions.water },
    { key: "otherPlace", label: assistantOptionsEs.assistantPositionOptions.otherPlace },
  ],
  bat: [
    { key: "ground", label: assistantOptionsEs.assistantPositionOptions.ground },
    { key: "treeOrBush", label: assistantOptionsEs.assistantPositionOptions.treeOrBush },
    { key: "buildingOrRoof", label: assistantOptionsEs.assistantPositionOptions.buildingOrRoof },
    { key: "otherPlace", label: assistantOptionsEs.assistantPositionOptions.otherPlace },
  ],
  smallMammal: [
    { key: "ground", label: assistantOptionsEs.assistantPositionOptions.ground },
    { key: "treeOrBush", label: assistantOptionsEs.assistantPositionOptions.treeOrBush },
    { key: "buildingOrRoof", label: assistantOptionsEs.assistantPositionOptions.buildingOrRoof },
    { key: "water", label: assistantOptionsEs.assistantPositionOptions.water },
    { key: "otherPlace", label: assistantOptionsEs.assistantPositionOptions.otherPlace },
  ],
  largeMammal: [
    { key: "ground", label: assistantOptionsEs.assistantPositionOptions.ground },
    { key: "buildingOrRoof", label: assistantOptionsEs.assistantPositionOptions.buildingOrRoof },
    { key: "water", label: assistantOptionsEs.assistantPositionOptions.water },
    { key: "otherPlace", label: assistantOptionsEs.assistantPositionOptions.otherPlace },
  ],
  reptileAmphibian: [
    { key: "ground", label: assistantOptionsEs.assistantPositionOptions.ground },
    { key: "treeOrBush", label: assistantOptionsEs.assistantPositionOptions.treeOrBush },
    { key: "buildingOrRoof", label: assistantOptionsEs.assistantPositionOptions.buildingOrRoof },
    { key: "water", label: assistantOptionsEs.assistantPositionOptions.water },
    { key: "otherPlace", label: assistantOptionsEs.assistantPositionOptions.otherPlace },
  ],
  dolphin: [
    { key: "beachSand", label: assistantOptionsEs.assistantPositionOptions.beachSand },
    { key: "shoreShallowWater", label: assistantOptionsEs.assistantPositionOptions.shoreShallowWater },
    { key: "water", label: assistantOptionsEs.assistantPositionOptions.water },
    { key: "rocksBreakwater", label: assistantOptionsEs.assistantPositionOptions.rocksBreakwater },
    { key: "portDock", label: assistantOptionsEs.assistantPositionOptions.portDock },
    { key: "otherPlace", label: assistantOptionsEs.assistantPositionOptions.otherPlace },
  ],
  largeCetacean: [
    { key: "beachSand", label: assistantOptionsEs.assistantPositionOptions.beachSand },
    { key: "shoreShallowWater", label: assistantOptionsEs.assistantPositionOptions.shoreShallowWater },
    { key: "water", label: assistantOptionsEs.assistantPositionOptions.water },
    { key: "rocksBreakwater", label: assistantOptionsEs.assistantPositionOptions.rocksBreakwater },
    { key: "otherPlace", label: assistantOptionsEs.assistantPositionOptions.otherPlace },
  ],
  seal: [
    { key: "beachSand", label: assistantOptionsEs.assistantPositionOptions.beachSand },
    { key: "rocksBreakwater", label: assistantOptionsEs.assistantPositionOptions.rocksStonesBreakwater },
    { key: "portDock", label: assistantOptionsEs.assistantPositionOptions.portDock },
    { key: "water", label: assistantOptionsEs.assistantPositionOptions.water },
    { key: "otherPlace", label: assistantOptionsEs.assistantPositionOptions.otherPlace },
  ],
  seaTurtle: [
    { key: "beachSand", label: assistantOptionsEs.assistantPositionOptions.beachSand },
    { key: "shoreShallowWater", label: assistantOptionsEs.assistantPositionOptions.shoreShallowWater },
    { key: "water", label: assistantOptionsEs.assistantPositionOptions.water },
    { key: "rocksBreakwater", label: assistantOptionsEs.assistantPositionOptions.rocksBreakwater },
    { key: "portDock", label: assistantOptionsEs.assistantPositionOptions.portDock },
    { key: "onBoat", label: assistantOptionsEs.assistantPositionOptions.onBoat },
    { key: "otherPlace", label: assistantOptionsEs.assistantPositionOptions.otherPlace },
  ],
  sharkRay: [
    { key: "shoreShallowWater", label: assistantOptionsEs.assistantPositionOptions.shoreShallowWater },
    { key: "water", label: assistantOptionsEs.assistantPositionOptions.water },
    { key: "beachSand", label: assistantOptionsEs.assistantPositionOptions.beachSand },
    { key: "rocksBreakwater", label: assistantOptionsEs.assistantPositionOptions.rocksBreakwater },
    { key: "portDock", label: assistantOptionsEs.assistantPositionOptions.portDock },
    { key: "onBoat", label: assistantOptionsEs.assistantPositionOptions.onBoat },
    { key: "otherPlace", label: assistantOptionsEs.assistantPositionOptions.otherPlace },
  ],
  otherMarine: [
    { key: "beachSand", label: assistantOptionsEs.assistantPositionOptions.beachSand },
    { key: "shoreShallowWater", label: assistantOptionsEs.assistantPositionOptions.shoreShallowWater },
    { key: "water", label: assistantOptionsEs.assistantPositionOptions.water },
    { key: "rocksBreakwater", label: assistantOptionsEs.assistantPositionOptions.rocksStonesBreakwater },
    { key: "portDock", label: assistantOptionsEs.assistantPositionOptions.portDock },
    { key: "onBoat", label: assistantOptionsEs.assistantPositionOptions.onBoat },
    { key: "otherPlace", label: assistantOptionsEs.assistantPositionOptions.otherPlace },
  ],
  unknown: [
    { key: "ground", label: assistantOptionsEs.assistantPositionOptions.ground },
    { key: "treeOrBush", label: assistantOptionsEs.assistantPositionOptions.treeOrBush },
    { key: "buildingOrRoof", label: assistantOptionsEs.assistantPositionOptions.buildingOrRoof },
    { key: "water", label: assistantOptionsEs.assistantPositionOptions.water },
    { key: "shoreShallowWater", label: assistantOptionsEs.assistantPositionOptions.beachShore },
    { key: "otherPlace", label: assistantOptionsEs.assistantPositionOptions.otherPlace },
  ],
};

const VISIBLE_ENVIRONMENT_OPTIONS_BY_ANIMAL_TYPE: Record<
  AnimalType,
  EnvironmentOption[]
> = {
  smallBird: [
    { key: "roadOrStreet", label: assistantOptionsEs.assistantEnvironmentOptions.roadOrStreet },
    { key: "parkOrGarden", label: assistantOptionsEs.assistantEnvironmentOptions.parkOrGarden },
    { key: "fieldOrNatural", label: assistantOptionsEs.assistantEnvironmentOptions.fieldOrNatural },
    { key: "industrialArea", label: assistantOptionsEs.assistantEnvironmentOptions.industrialArea },
    { key: "otherEnvironment", label: assistantOptionsEs.assistantEnvironmentOptions.otherEnvironment },
  ],
  largeBird: [
    { key: "roadOrStreet", label: assistantOptionsEs.assistantEnvironmentOptions.roadOrStreet },
    { key: "parkOrGarden", label: assistantOptionsEs.assistantEnvironmentOptions.parkOrGarden },
    { key: "fieldOrNatural", label: assistantOptionsEs.assistantEnvironmentOptions.fieldOrNatural },
    { key: "industrialArea", label: assistantOptionsEs.assistantEnvironmentOptions.industrialArea },
    { key: "otherEnvironment", label: assistantOptionsEs.assistantEnvironmentOptions.otherEnvironment },
  ],
  bat: [
    { key: "urbanArea", label: assistantOptionsEs.assistantEnvironmentOptions.urbanArea },
    { key: "parkOrGarden", label: assistantOptionsEs.assistantEnvironmentOptions.parkOrGarden },
    { key: "fieldOrNatural", label: assistantOptionsEs.assistantEnvironmentOptions.fieldOrNatural },
    { key: "industrialArea", label: assistantOptionsEs.assistantEnvironmentOptions.industrialArea },
    { key: "otherEnvironment", label: assistantOptionsEs.assistantEnvironmentOptions.otherEnvironment },
  ],
  smallMammal: [
    { key: "roadOrStreet", label: assistantOptionsEs.assistantEnvironmentOptions.roadOrStreet },
    { key: "parkOrGarden", label: assistantOptionsEs.assistantEnvironmentOptions.parkOrGarden },
    { key: "fieldOrNatural", label: assistantOptionsEs.assistantEnvironmentOptions.fieldOrNatural },
    { key: "urbanArea", label: assistantOptionsEs.assistantEnvironmentOptions.urbanArea },
    { key: "otherEnvironment", label: assistantOptionsEs.assistantEnvironmentOptions.otherEnvironment },
  ],
  largeMammal: [
    { key: "roadOrStreet", label: assistantOptionsEs.assistantEnvironmentOptions.roadOrStreet },
    { key: "fieldOrNatural", label: assistantOptionsEs.assistantEnvironmentOptions.fieldOrNatural },
    { key: "urbanArea", label: assistantOptionsEs.assistantEnvironmentOptions.urbanArea },
    { key: "parkOrGarden", label: assistantOptionsEs.assistantEnvironmentOptions.parkOrGarden },
    { key: "otherEnvironment", label: assistantOptionsEs.assistantEnvironmentOptions.otherEnvironment },
  ],
  reptileAmphibian: [
    { key: "roadOrStreet", label: assistantOptionsEs.assistantEnvironmentOptions.roadOrStreet },
    { key: "parkOrGarden", label: assistantOptionsEs.assistantEnvironmentOptions.parkOrGarden },
    { key: "fieldOrNatural", label: assistantOptionsEs.assistantEnvironmentOptions.fieldOrNatural },
    { key: "urbanArea", label: assistantOptionsEs.assistantEnvironmentOptions.urbanArea },
    { key: "otherEnvironment", label: assistantOptionsEs.assistantEnvironmentOptions.otherEnvironment },
  ],
  dolphin: [
    { key: "coastBeach", label: assistantOptionsEs.assistantEnvironmentOptions.coastBeach },
    { key: "portMarina", label: assistantOptionsEs.assistantEnvironmentOptions.portMarina },
    { key: "openSea", label: assistantOptionsEs.assistantEnvironmentOptions.openSea },
    { key: "estuaryMouth", label: assistantOptionsEs.assistantEnvironmentOptions.estuaryMouth },
    { key: "otherEnvironment", label: assistantOptionsEs.assistantEnvironmentOptions.otherEnvironment },
  ],
  largeCetacean: [
    { key: "coastBeach", label: assistantOptionsEs.assistantEnvironmentOptions.coastBeach },
    { key: "rockyCoastCliff", label: assistantOptionsEs.assistantEnvironmentOptions.rockyCoastCliff },
    { key: "portMarina", label: assistantOptionsEs.assistantEnvironmentOptions.portMarina },
    { key: "openSea", label: assistantOptionsEs.assistantEnvironmentOptions.openSea },
    { key: "otherEnvironment", label: assistantOptionsEs.assistantEnvironmentOptions.otherEnvironment },
  ],
  seal: [
    { key: "coastBeach", label: assistantOptionsEs.assistantEnvironmentOptions.coastBeach },
    { key: "rockyCoastCliff", label: assistantOptionsEs.assistantEnvironmentOptions.rockyCoastCliff },
    { key: "portMarina", label: assistantOptionsEs.assistantEnvironmentOptions.portMarina },
    { key: "otherEnvironment", label: assistantOptionsEs.assistantEnvironmentOptions.otherEnvironment },
  ],
  seaTurtle: [
    { key: "coastBeach", label: assistantOptionsEs.assistantEnvironmentOptions.coastBeach },
    { key: "rockyCoastCliff", label: assistantOptionsEs.assistantEnvironmentOptions.rockyCoastCliff },
    { key: "portMarina", label: assistantOptionsEs.assistantEnvironmentOptions.portMarina },
    { key: "openSea", label: assistantOptionsEs.assistantEnvironmentOptions.openSea },
    { key: "estuaryMouth", label: assistantOptionsEs.assistantEnvironmentOptions.estuaryMouth },
    { key: "otherEnvironment", label: assistantOptionsEs.assistantEnvironmentOptions.otherEnvironment },
  ],
  sharkRay: [
    { key: "coastBeach", label: assistantOptionsEs.assistantEnvironmentOptions.coastBeach },
    { key: "rockyCoastCliff", label: assistantOptionsEs.assistantEnvironmentOptions.rockyCoastCliff },
    { key: "portMarina", label: assistantOptionsEs.assistantEnvironmentOptions.portMarina },
    { key: "openSea", label: assistantOptionsEs.assistantEnvironmentOptions.openSea },
    { key: "estuaryMouth", label: assistantOptionsEs.assistantEnvironmentOptions.estuaryMouth },
    { key: "otherEnvironment", label: assistantOptionsEs.assistantEnvironmentOptions.otherEnvironment },
  ],
  otherMarine: [
    { key: "coastBeach", label: assistantOptionsEs.assistantEnvironmentOptions.coastBeach },
    { key: "rockyCoastCliff", label: assistantOptionsEs.assistantEnvironmentOptions.rockyCoastCliff },
    { key: "portMarina", label: assistantOptionsEs.assistantEnvironmentOptions.portMarina },
    { key: "openSea", label: assistantOptionsEs.assistantEnvironmentOptions.openSea },
    { key: "estuaryMouth", label: assistantOptionsEs.assistantEnvironmentOptions.estuaryMouth },
    { key: "otherEnvironment", label: assistantOptionsEs.assistantEnvironmentOptions.otherEnvironment },
  ],
  unknown: [
    { key: "roadOrStreet", label: assistantOptionsEs.assistantEnvironmentOptions.roadOrStreet },
    { key: "parkOrGarden", label: assistantOptionsEs.assistantEnvironmentOptions.parkOrGarden },
    { key: "fieldOrNatural", label: assistantOptionsEs.assistantEnvironmentOptions.fieldOrNatural },
    { key: "coastBeach", label: assistantOptionsEs.assistantEnvironmentOptions.coastBeachWithPreposition },
    { key: "portMarina", label: assistantOptionsEs.assistantEnvironmentOptions.portMarinaWithPreposition },
    { key: "otherEnvironment", label: assistantOptionsEs.assistantEnvironmentOptions.otherEnvironment },
  ],
};

const FLAG_LABELS: FlagOption[] = [
  { key: "bleeding", label: "Herido" },
  { key: "baby", label: "Es cría" },
  { key: "catDog", label: "Ataque de gato/perro" },
  { key: "canNotMove", label: "No se mueve bien" },
  { key: "roadRisk", label: "Peligro en carretera" },
  { key: "ringGps", label: "Marca o dispositivo de seguimiento" },
  { key: "trapped", label: "Atrapado" },
  { key: "cannotFly", label: "No vuela" },
  { key: "weakness", label: "Debilidad / inmovilidad" },
  { key: "normalAppearance", label: "Apariencia normal" },
  { key: "breathing", label: "Respiración agitada" },
  { key: "stranded", label: "Varado / fuera del agua" },
  { key: "fishingLineHook", label: "Sedal / anzuelo" },
  { key: "moreAnimals", label: "Hay más animales" },
  { key: "peopleDogsNearby", label: "Personas/perros cerca" },
  { key: "restingOnLand", label: "Está descansando en tierra" },
  { key: "other", label: "Otro / No estoy seguro" },
];

const VISIBLE_FLAG_LABELS_BY_ANIMAL_TYPE: Record<AnimalType, FlagOption[]> = {
  smallBird: [
    { key: "bleeding", label: "Herido" },
    { key: "baby", label: "Es cría" },
    { key: "catDog", label: "Ataque de gato/perro" },
    { key: "trapped", label: "Atrapado" },
    { key: "cannotFly", label: "No vuela" },
    { key: "weakness", label: "Debilidad / inmovilidad" },
    { key: "roadRisk", label: "Peligro en carretera" },
    { key: "ringGps", label: "Marca o dispositivo de seguimiento" },
    { key: "other", label: "Otro / No estoy seguro" },
  ],
  largeBird: [
    { key: "bleeding", label: "Herido" },
    { key: "baby", label: "Es cría" },
    { key: "catDog", label: "Ataque de gato/perro" },
    { key: "trapped", label: "Atrapado" },
    { key: "cannotFly", label: "No vuela" },
    { key: "weakness", label: "Debilidad / inmovilidad" },
    { key: "roadRisk", label: "Peligro en carretera" },
    { key: "ringGps", label: "Marca o dispositivo de seguimiento" },
    { key: "other", label: "Otro / No estoy seguro" },
  ],
  bat: [
    { key: "bleeding", label: "Herido" },
    { key: "baby", label: "Es cría" },
    { key: "catDog", label: "Ataque de gato/perro" },
    { key: "trapped", label: "Atrapado" },
    { key: "cannotFly", label: "No vuela" },
    { key: "weakness", label: "Debilidad / inmovilidad" },
    { key: "other", label: "Otro / No estoy seguro" },
  ],
  smallMammal: [
    { key: "bleeding", label: "Herido" },
    { key: "baby", label: "Es cría" },
    { key: "catDog", label: "Ataque de gato/perro" },
    { key: "trapped", label: "Atrapado" },
    { key: "weakness", label: "Debilidad / inmovilidad" },
    { key: "roadRisk", label: "Peligro en carretera" },
    { key: "ringGps", label: "Marca o dispositivo de seguimiento" },
    { key: "peopleDogsNearby", label: "Personas/perros cerca" },
    { key: "other", label: "Otro / No estoy seguro" },
  ],
  largeMammal: [
    { key: "bleeding", label: "Herido" },
    { key: "baby", label: "Es cría" },
    { key: "catDog", label: "Ataque de gato/perro" },
    { key: "trapped", label: "Atrapado" },
    { key: "weakness", label: "Debilidad / inmovilidad" },
    { key: "roadRisk", label: "Peligro en carretera" },
    { key: "ringGps", label: "Marca o dispositivo de seguimiento" },
    { key: "peopleDogsNearby", label: "Personas/perros cerca" },
    { key: "other", label: "Otro / No estoy seguro" },
  ],
  reptileAmphibian: [
    { key: "bleeding", label: "Herido" },
    { key: "baby", label: "Es cría" },
    { key: "catDog", label: "Ataque de gato/perro" },
    { key: "trapped", label: "Atrapado" },
    { key: "weakness", label: "Debilidad / inmovilidad" },
    { key: "roadRisk", label: "Peligro en carretera" },
    { key: "peopleDogsNearby", label: "Personas/perros cerca" },
    { key: "other", label: "Otro / No estoy seguro" },
  ],
  dolphin: [
    { key: "stranded", label: "Varado / fuera del agua" },
    { key: "trapped", label: "Enredado" },
    { key: "bleeding", label: "Herido" },
    { key: "weakness", label: "Muy débil / inmóvil" },
    { key: "moreAnimals", label: "Hay más animales" },
    { key: "peopleDogsNearby", label: "Personas/perros cerca" },
    { key: "other", label: "Otro / No estoy seguro" },
  ],
  largeCetacean: [
    { key: "stranded", label: "Varado / fuera del agua" },
    { key: "trapped", label: "Enredado" },
    { key: "bleeding", label: "Herido" },
    { key: "weakness", label: "Muy débil / inmóvil" },
    { key: "moreAnimals", label: "Hay más animales" },
    { key: "peopleDogsNearby", label: "Personas/perros cerca" },
    { key: "other", label: "Otro / No estoy seguro" },
  ],
  seal: [
    { key: "restingOnLand", label: "Está descansando en tierra" },
    { key: "bleeding", label: "Herida" },
    { key: "weakness", label: "Muy débil / inmóvil" },
    { key: "trapped", label: "Enredada" },
    { key: "peopleDogsNearby", label: "Personas/perros cerca" },
    { key: "other", label: "Otro / No estoy seguro" },
  ],
  seaTurtle: [
    { key: "trapped", label: "Enredada" },
    { key: "fishingLineHook", label: "Sedal / anzuelo" },
    { key: "bleeding", label: "Herida / caparazón dañado" },
    { key: "weakness", label: "Muy débil / inmóvil" },
    { key: "stranded", label: "En playa / fuera del agua" },
    { key: "peopleDogsNearby", label: "Personas/perros cerca" },
    { key: "other", label: "Otro / No estoy seguro" },
  ],
  sharkRay: [
    { key: "stranded", label: "Varado / fuera del agua" },
    { key: "trapped", label: "Enredado / aparejos" },
    { key: "fishingLineHook", label: "Sedal / anzuelo" },
    { key: "bleeding", label: "Herido" },
    { key: "weakness", label: "Muy débil / inmóvil" },
    { key: "peopleDogsNearby", label: "Personas/perros cerca" },
    { key: "other", label: "Otro / No estoy seguro" },
  ],
  otherMarine: [
    { key: "stranded", label: "Varado / fuera del agua" },
    { key: "trapped", label: "Enredado" },
    { key: "fishingLineHook", label: "Sedal / anzuelo" },
    { key: "bleeding", label: "Herido" },
    { key: "weakness", label: "Muy débil / inmóvil" },
    { key: "moreAnimals", label: "Hay más animales" },
    { key: "peopleDogsNearby", label: "Personas/perros cerca" },
    { key: "other", label: "Otro / No estoy seguro" },
  ],
  unknown: [
    { key: "bleeding", label: "Herido" },
    { key: "baby", label: "Es cría" },
    { key: "catDog", label: "Ataque de gato/perro" },
    { key: "trapped", label: "Atrapado" },
    { key: "cannotFly", label: "No vuela" },
    { key: "weakness", label: "Debilidad / inmovilidad" },
    { key: "roadRisk", label: "Peligro en carretera" },
    { key: "ringGps", label: "Marca o dispositivo de seguimiento" },
    { key: "peopleDogsNearby", label: "Personas/perros cerca" },
    { key: "other", label: "Otro / No estoy seguro" },
  ],
};

export function createInitialFlags(): FlagsState {
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
    stranded: false,
    fishingLineHook: false,
    moreAnimals: false,
    peopleDogsNearby: false,
    restingOnLand: false,
    other: false,
  };
}

function normalizeFlags(flags?: Partial<FlagsState> | null): FlagsState {
  return {
    ...createInitialFlags(),
    ...(flags ?? {}),
  };
}

function canUseCannotFly(animalType: AnimalType) {
  return (
    animalType === "smallBird" ||
    animalType === "largeBird" ||
    animalType === "bat" ||
    animalType === "unknown"
  );
}

function getTrappedAdvice(animalType: AnimalType, protocolTexts: Catalog = getEffectiveCatalog()) {
  const COMMON_END = protocolTexts.supplementalAdvice.commonEnd;
  const commonEnd =
    COMMON_END;

  if (animalType === "smallBird") {
    return withCommonEnd(
  protocolTexts.trappedAdvice.smallBirdTitle +
  protocolTexts.rescueHeadings.actCalmlyLine +
  protocolTexts.trappedAdvice.rushedReleaseInjuresBird +
  protocolTexts.trappedAdvice.assessTrappedBirdSafetyParagraph +
  protocolTexts.rescueHeadings.doNotLine +
  protocolTexts.trappedAdvice.doNotPullAnimalLine +
  protocolTexts.trappedAdvice.doNotForceWingsLegsOrNeck +
  protocolTexts.sharedRescueAdvice.documentWithoutFlashLine +
  protocolTexts.sharedRescueAdvice.noFoodOrWaterParagraph +
  protocolTexts.rescueHeadings.actionsLine +
  protocolTexts.trappedAdvice.reduceNoiseAndBystanders +
  protocolTexts.trappedAdvice.coverBirdGentlyIfSafe +
  protocolTexts.trappedAdvice.releasedBirdBoxOrCarrier +
  protocolTexts.sharedRescueAdvice.protectBoxOrCarrierLine +
  protocolTexts.sharedRescueAdvice.contactRecoveryCenterParagraph ,
  commonEnd
);
  }

  if (animalType === "largeBird") {
    return withCommonEnd(
  protocolTexts.trappedAdvice.largeBirdTitle +
  protocolTexts.rescueHeadings.actCalmlyLine +
  protocolTexts.trappedAdvice.defensiveBirdEvenWhenWeak +
  protocolTexts.trappedAdvice.assessTrappedBirdSafetyParagraph +
  protocolTexts.rescueHeadings.doNotLine +
  protocolTexts.trappedAdvice.doNotPullAnimalLine +
  protocolTexts.trappedAdvice.doNotGripWingsLegsOrNeck +
  protocolTexts.sharedRescueAdvice.documentWithoutFlashLine +
  protocolTexts.sharedRescueAdvice.noFoodOrWaterParagraph +
  protocolTexts.rescueHeadings.actionsLine +
  protocolTexts.sharedRescueAdvice.keepPeopleAndPetsAwayLine +
  protocolTexts.trappedAdvice.coverLargeBirdAndProtectFromClaws +
  protocolTexts.trappedAdvice.assessReleasedBirdBeforeRelease +
  protocolTexts.sharedRescueAdvice.protectBoxOrCarrierLine +
  protocolTexts.sharedRescueAdvice.contactRecoveryCenterParagraph ,
  commonEnd
);
  }

  if (animalType === "bat") {
    return withCommonEnd(
  protocolTexts.trappedAdvice.batTitle +
  protocolTexts.rescueHeadings.actCalmlyLine +
  protocolTexts.trappedAdvice.assessTrappedBatSafetyParagraph +
  protocolTexts.rescueHeadings.doNotLine +
  protocolTexts.trappedAdvice.noDirectBareHandHandling +
  protocolTexts.trappedAdvice.doNotPullAnimalLine +
  protocolTexts.trappedAdvice.documentBatWithoutFlash +
  protocolTexts.sharedRescueAdvice.noFoodOrWaterParagraph +
  protocolTexts.rescueHeadings.actionsLine +
  protocolTexts.sharedRescueAdvice.keepPeopleAndPetsAwayLine +
  protocolTexts.trappedAdvice.thickGlovesOrClothIfNecessary +
  protocolTexts.trappedAdvice.releasedBatLinedBox +
  protocolTexts.trappedAdvice.quietDarkBoxProtectedFromColdAndHeat +
  protocolTexts.sharedRescueAdvice.contactRecoveryCenterParagraph ,
  commonEnd
);
  }

  if (animalType === "smallMammal") {
    return withCommonEnd(
  protocolTexts.trappedAdvice.smallMammalTitle +
  protocolTexts.rescueHeadings.actCalmlyLine +
  protocolTexts.trappedAdvice.trappedMammalFearOrPain +
  protocolTexts.trappedAdvice.assessTrappedAnimalSafetyParagraph +
  protocolTexts.rescueHeadings.doNotLine +
  protocolTexts.trappedAdvice.doNotPullAnimalLine +
  protocolTexts.trappedAdvice.avoidDirectHandlingIfBiteRisk +
  protocolTexts.sharedRescueAdvice.documentWithoutFlashLine +
  protocolTexts.sharedRescueAdvice.noFoodOrWaterParagraph +
  protocolTexts.rescueHeadings.actionsLine +
  protocolTexts.sharedRescueAdvice.keepPeopleAndPetsAwayLine +
  protocolTexts.trappedAdvice.thickGlovesOrClothOnlyIfSafe +
  protocolTexts.trappedAdvice.releasedMammalBoxOrCarrier +
  protocolTexts.sharedRescueAdvice.protectBoxOrCarrierLine +
  protocolTexts.sharedRescueAdvice.contactRecoveryCenterParagraph ,
  commonEnd
);
  }

  if (animalType === "largeMammal") {
    return withCommonEnd(
  protocolTexts.trappedAdvice.largeMammalTitle +
  protocolTexts.rescueHeadings.actCalmlyLine +
  protocolTexts.trappedAdvice.unpredictableEscapeRisksPeopleAndAnimal +
  protocolTexts.trappedAdvice.assessTrappedAnimalSafetyParagraph +
  protocolTexts.rescueHeadings.doNotLine +
  protocolTexts.trappedAdvice.doNotReleaseAlone +
  protocolTexts.trappedAdvice.avoidAgitatedOrDangerousAnimal +
  protocolTexts.sharedRescueAdvice.documentWithoutFlashLine +
  protocolTexts.sharedRescueAdvice.noFoodOrWaterParagraph +
  protocolTexts.rescueHeadings.actionsLine +
  protocolTexts.sharedRescueAdvice.keepPeopleAndPetsAwayLine +
  protocolTexts.trappedAdvice.observeTrappingOnlyIfSafe +
  protocolTexts.trappedAdvice.contactRecoveryCenterPromptlyParagraph ,
  commonEnd
);
  }

  if (animalType === "reptileAmphibian") {
    return withCommonEnd(
  protocolTexts.trappedAdvice.reptileAmphibianTitle +
  protocolTexts.rescueHeadings.actCalmlyLine +
  protocolTexts.trappedAdvice.roughReleaseMayInjureReptile +
  protocolTexts.trappedAdvice.snakeDistanceNoHandlingOrReleaseParagraph +
  protocolTexts.rescueHeadings.doNotLine +
  protocolTexts.trappedAdvice.doNotPullAnimalLine +
  protocolTexts.trappedAdvice.noForcefulGripOrInjuriousHandling +
  protocolTexts.sharedRescueAdvice.documentWithoutFlashLine +
  protocolTexts.sharedRescueAdvice.noFoodOrWaterParagraph +
  protocolTexts.rescueHeadings.actionsLine +
  protocolTexts.sharedRescueAdvice.keepPeopleAndPetsAwayLine +
  protocolTexts.trappedAdvice.reduceNoiseAndMaintainDistance +
  protocolTexts.trappedAdvice.releaseAndBoxOnlyOtherIdentifiedSpecies +
  protocolTexts.trappedAdvice.protectContainerOnlyOtherIdentifiedSpecies +
  protocolTexts.sharedRescueAdvice.contactRecoveryCenterParagraph ,
  commonEnd
);
  }

  return withCommonEnd(
  protocolTexts.trappedAdvice.unknownTitle +
  protocolTexts.rescueHeadings.actCalmlyLine +
  protocolTexts.trappedAdvice.rushedReleaseMayCauseSeriousInjury +
  protocolTexts.trappedAdvice.assessTrappedAnimalSafetyParagraph +
  protocolTexts.rescueHeadings.doNotLine +
  protocolTexts.trappedAdvice.doNotPullAnimalLine +
  protocolTexts.trappedAdvice.doNotForceBodyParts +
  protocolTexts.sharedRescueAdvice.documentWithoutFlashLine +
  protocolTexts.sharedRescueAdvice.noFoodOrWaterParagraph +
  protocolTexts.rescueHeadings.actionsLine +
  protocolTexts.sharedRescueAdvice.keepPeopleAndPetsAwayLine +
  protocolTexts.trappedAdvice.coverOnlyIfSafeAndAppropriateForSpecies +
  protocolTexts.trappedAdvice.releasedAnimalVentilatedContainer +
  protocolTexts.trappedAdvice.quietProtectedBoxOrContainer +
  protocolTexts.sharedRescueAdvice.contactRecoveryCenterParagraph ,
  commonEnd
);
}
function getBabyAdvice(animalType: AnimalType, protocolTexts: Catalog = getEffectiveCatalog()) {
  const COMMON_END = protocolTexts.supplementalAdvice.commonEnd;
  const commonEnd =
    COMMON_END;

  if (animalType === "smallBird") {
return withCommonEnd(
  protocolTexts.babyAdvice.smallBirdTitle +
  protocolTexts.rescueHeadings.beforeInterveningLine +
  protocolTexts.babyAdvice.distinguishNestlingAndFledgling +
  protocolTexts.babyAdvice.groundedSwiftNeedsSpecialist +

  protocolTexts.babyAdvice.nestlingHeading +
  protocolTexts.babyAdvice.limitedFeathering +
  protocolTexts.babyAdvice.nestlingNormallyInNest +
  protocolTexts.babyAdvice.returnNestOnlySafely +
  protocolTexts.babyAdvice.seekHelpIfCannotReturnNest +

  protocolTexts.babyAdvice.fledglingHeading +
  protocolTexts.sharedRescueAdvice.observeFromDistanceLine +
  protocolTexts.babyAdvice.fullyFeathered +
  protocolTexts.babyAdvice.fledglingOutsideNestNormal +
  protocolTexts.babyAdvice.fledglingLearningFlight +
  protocolTexts.babyAdvice.parentsContinueCare +
  protocolTexts.babyAdvice.doNotRemoveUnlessDanger +
  protocolTexts.babyAdvice.fledglingWarningSignsSeekHelp +

  protocolTexts.rescueHeadings.ifNeedsHelpParagraph +

  protocolTexts.rescueHeadings.doNotLine +
  protocolTexts.sharedRescueAdvice.noFoodOrWaterLine +
  protocolTexts.babyAdvice.minimalHandlingLine +
  protocolTexts.babyAdvice.noWingExtensionParagraph +

  protocolTexts.rescueHeadings.actionsLine +
  protocolTexts.babyAdvice.ventilatedClosedBoxLine +
  protocolTexts.babyAdvice.quietProtectedBoxLine +
  protocolTexts.babyAdvice.reduceNoisePeopleAndPetsLine +
  protocolTexts.sharedRescueAdvice.documentWithoutFlashLine +
  protocolTexts.sharedRescueAdvice.contactRecoveryCenterParagraph ,

  commonEnd
);
  }

  if (animalType === "largeBird") {
    return withCommonEnd(
  protocolTexts.babyAdvice.largeBirdTitle +
  protocolTexts.rescueHeadings.beforeInterveningLine +
  protocolTexts.babyAdvice.youngLargeBirdNotAlwaysNeedsCollection +
  protocolTexts.babyAdvice.learningStage +
  protocolTexts.babyAdvice.nearbyAdultsContinueCare +
  protocolTexts.babyAdvice.lowBranchesLearningFlight +
  protocolTexts.rescueHeadings.mayNeedHelpLine +
  protocolTexts.babyAdvice.injuryLine +
  protocolTexts.babyAdvice.severeWeaknessLine +
  protocolTexts.babyAdvice.immediateDangerLine +
  protocolTexts.babyAdvice.prolongedDangerExposure +
  protocolTexts.babyAdvice.reasonableDoubtsParagraph +
  protocolTexts.rescueHeadings.doNotLine +
  protocolTexts.babyAdvice.avoidUnnecessaryHandlingLine +
  protocolTexts.babyAdvice.doNotCollectGroundedAutomatically +
  protocolTexts.sharedRescueAdvice.noFoodOrWaterLine +
  protocolTexts.babyAdvice.avoidBareFaceAndHandsParagraph +
  protocolTexts.rescueHeadings.actionsLine +
  protocolTexts.sharedRescueAdvice.observeFromDistanceLine +
  protocolTexts.babyAdvice.reduceNoisePeopleAndPetsLine +
  protocolTexts.babyAdvice.boxOrCarrierOnlyIfSafe +
  protocolTexts.babyAdvice.partiallyCoverCarrierWithVentilation +
  protocolTexts.sharedRescueAdvice.documentWithoutFlashLine +
  protocolTexts.sharedRescueAdvice.contactRecoveryCenterParagraph ,
  commonEnd
);
  }

  if (animalType === "bat") {
  const commonEnd =
    COMMON_END;

 return withCommonEnd(
  protocolTexts.babyAdvice.batTitle +
  protocolTexts.rescueHeadings.beforeInterveningLine +
  protocolTexts.babyAdvice.sizeNotReliable +
  protocolTexts.babyAdvice.locateBatRoost +
  protocolTexts.babyAdvice.adviceBeforeReunification +
  protocolTexts.babyAdvice.reuniteOnlyWhenHealthyAndAdvised +
  protocolTexts.rescueHeadings.mayNeedHelpLine +
  protocolTexts.babyAdvice.injuryLine +
  protocolTexts.babyAdvice.severeWeaknessLine +
  protocolTexts.babyAdvice.catOrOtherAnimalAttackLine +
  protocolTexts.babyAdvice.dangerousSituationLine +
  protocolTexts.babyAdvice.reasonableDoubtsParagraph +
  protocolTexts.rescueHeadings.doNotLine +
  protocolTexts.babyAdvice.noBareHandHandlingLine +
  protocolTexts.sharedRescueAdvice.noFoodOrWaterLine +
  protocolTexts.babyAdvice.avoidDirectSunColdHeatParagraph +
  protocolTexts.rescueHeadings.actionsLine +
  protocolTexts.babyAdvice.glovesOrClothForCollection +
  protocolTexts.babyAdvice.batBoxWithLiningIfNeedsHelp +
  protocolTexts.babyAdvice.quietDarkProtectedBoxLine +
  protocolTexts.babyAdvice.reduceNoisePeopleAndPetsLine +
  protocolTexts.sharedRescueAdvice.documentWithoutFlashLine +
  protocolTexts.sharedRescueAdvice.contactRecoveryCenterParagraph ,
  commonEnd
);
  }

  if (animalType === "smallMammal") {
    return withCommonEnd(
  protocolTexts.babyAdvice.smallMammalTitle +
  protocolTexts.rescueHeadings.beforeInterveningLine +
  protocolTexts.babyAdvice.motherMayBeNearby +
  protocolTexts.sharedRescueAdvice.observeFromDistanceLine +
  protocolTexts.babyAdvice.noCollectionExceptDangerParagraph +
  protocolTexts.rescueHeadings.mayNeedHelpLine +
  protocolTexts.babyAdvice.injuryLine +
  protocolTexts.babyAdvice.severeWeaknessLine +
  protocolTexts.babyAdvice.catDogOrOtherAttackLine +
  protocolTexts.babyAdvice.dangerousSituationLine +
  protocolTexts.babyAdvice.reasonableDoubtsParagraph +
  protocolTexts.rescueHeadings.doNotLine +
  protocolTexts.babyAdvice.doNotCollectBecauseAlone +
  protocolTexts.babyAdvice.minimizeFemaleHandlingLine +
  protocolTexts.sharedRescueAdvice.noFoodOrWaterParagraph +
  protocolTexts.rescueHeadings.actionsLine +
  protocolTexts.babyAdvice.observeMotherCareFirst +
  protocolTexts.babyAdvice.boxIfNeedsHelpLine +
  protocolTexts.babyAdvice.quietProtectedBoxLine +
  protocolTexts.babyAdvice.reduceNoisePeopleAndPetsLine +
  protocolTexts.sharedRescueAdvice.documentWithoutFlashLine +
  protocolTexts.sharedRescueAdvice.contactRecoveryCenterParagraph ,
  commonEnd
);
  }

  if (animalType === "largeMammal") {
    return withCommonEnd(
  protocolTexts.babyAdvice.largeMammalTitle +
  protocolTexts.rescueHeadings.beforeInterveningLine +
  protocolTexts.babyAdvice.hiddenYoungMotherAvoidsPredators +
  protocolTexts.babyAdvice.aloneDoesNotMeanAbandoned +
  protocolTexts.babyAdvice.observeDistanceParagraph +
  protocolTexts.rescueHeadings.mayNeedHelpLine +
  protocolTexts.babyAdvice.evidentInjuriesLine +
  protocolTexts.babyAdvice.severeWeaknessLine +
  protocolTexts.babyAdvice.dangerousSituationLine +
  protocolTexts.babyAdvice.dogAttackOrRoadCollisionLine +
  protocolTexts.babyAdvice.reasonableDoubtsParagraph +
  protocolTexts.rescueHeadings.doNotLine +
  protocolTexts.babyAdvice.noUnnecessaryCollectionOrTransportLine +
  protocolTexts.babyAdvice.noHandlingOrStrokingLine +
  protocolTexts.sharedRescueAdvice.noFoodOrWaterLine +
  protocolTexts.babyAdvice.noUnnecessaryApproachParagraph +
  protocolTexts.rescueHeadings.actionsLine +
  protocolTexts.babyAdvice.distanceObserveFarAwayLine +
  protocolTexts.babyAdvice.reduceNoisePeoplePetsVehiclesLine +
  protocolTexts.sharedRescueAdvice.documentWithoutFlashLine +
  protocolTexts.babyAdvice.roadSafetySeekHelpLine +
  protocolTexts.sharedRescueAdvice.contactRecoveryCenterLine +
  protocolTexts.babyAdvice.followSpecialistsParagraph ,
  commonEnd
);
  }

  if (animalType === "reptileAmphibian") {
    return withCommonEnd(
  protocolTexts.babyAdvice.reptileAmphibianTitle +
  protocolTexts.rescueHeadings.beforeInterveningLine +
  protocolTexts.babyAdvice.earlyIndependence +
  protocolTexts.babyAdvice.aloneNotNecessarilyNeedsHelp +
  protocolTexts.babyAdvice.observeDistanceParagraph +
  protocolTexts.rescueHeadings.mayNeedHelpLine +
  protocolTexts.babyAdvice.injuryLine +
  protocolTexts.babyAdvice.trappedOrCannotMoveLine +
  protocolTexts.babyAdvice.roadPoolConstructionDangerLine +
  protocolTexts.babyAdvice.petsPredationRiskLine +
  protocolTexts.babyAdvice.reasonableDoubtsParagraph +
  protocolTexts.rescueHeadings.doNotLine +
  protocolTexts.babyAdvice.avoidUnnecessaryHandlingLine +
  protocolTexts.babyAdvice.noLongDistanceTransportLine +
  protocolTexts.babyAdvice.neverCaptureHandleOrMoveSnakesLine +
  protocolTexts.sharedRescueAdvice.noFoodOrWaterParagraph +
  protocolTexts.rescueHeadings.actionsLine +
  protocolTexts.babyAdvice.snakesSpecialistHelpNoReleaseLine +
  protocolTexts.babyAdvice.moveOnlyOtherIdentifiedReptileYoungLine +
  protocolTexts.babyAdvice.releaseNearbyOnlyOtherIdentifiedReptileYoungLine +
  protocolTexts.babyAdvice.reduceNoisePeoplePetsNearbyLine +
  protocolTexts.sharedRescueAdvice.documentWithoutFlashLine +
  protocolTexts.sharedRescueAdvice.contactRecoveryCenterParagraph ,
  commonEnd
);
  }

  return withCommonEnd(
  protocolTexts.babyAdvice.unknownTitle +
  protocolTexts.rescueHeadings.beforeInterveningLine +
  protocolTexts.babyAdvice.apparentlyAloneNotAbandoned +
  protocolTexts.sharedRescueAdvice.observeFromDistanceLine +
  protocolTexts.babyAdvice.doNotTakeHomeOrFeedParagraph +
  protocolTexts.rescueHeadings.mayNeedHelpLine +
  protocolTexts.babyAdvice.injuryLine +
  protocolTexts.babyAdvice.severeWeaknessLine +
  protocolTexts.babyAdvice.immediateDangerLine +
  protocolTexts.babyAdvice.dogCatOtherAnimalAttackLine +
  protocolTexts.babyAdvice.reasonableDoubtsParagraph +
  protocolTexts.rescueHeadings.doNotLine +
  protocolTexts.babyAdvice.doNotCollectBecauseAlone +
  protocolTexts.babyAdvice.minimizeFemaleHandlingLine +
  protocolTexts.sharedRescueAdvice.noFoodOrWaterParagraph +
  protocolTexts.rescueHeadings.actionsLine +
  protocolTexts.babyAdvice.reduceNoisePeoplePetsNearbyLine +
  protocolTexts.babyAdvice.safeBoxIfMustMoveLine +
  protocolTexts.babyAdvice.quietProtectedBoxLine +
  protocolTexts.sharedRescueAdvice.documentWithoutFlashLine +
  protocolTexts.sharedRescueAdvice.contactRecoveryCenterParagraph ,
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
  return flags.roadRisk || flags.peopleDogsNearby;
}

function hasAnyConcern(flags: FlagsState) {
  return (
    hasPhysicalWarning(flags) ||
    hasImmediateRisk(flags) ||
    flags.stranded ||
    flags.fishingLineHook ||
    flags.moreAnimals ||
    flags.restingOnLand ||
    flags.other
  );
}

function getObservedSigns(flags: FlagsState, includeCannotFly = false, protocolTexts: Catalog = getEffectiveCatalog()) {
  const signs: string[] = [];

  if (flags.bleeding) signs.push(protocolTexts.observedSigns.bleeding);
  if (flags.catDog) signs.push(protocolTexts.observedSigns.catDog);
  if (flags.canNotMove) signs.push(protocolTexts.observedSigns.canNotMove);
  if (includeCannotFly && flags.cannotFly) signs.push(protocolTexts.observedSigns.cannotFly);
  if (flags.weakness) signs.push(protocolTexts.observedSigns.weakness);
  if (flags.breathing) signs.push(protocolTexts.observedSigns.breathing);
  if (flags.stranded) signs.push(protocolTexts.observedSigns.stranded);
  if (flags.fishingLineHook)
    signs.push(protocolTexts.observedSigns.fishingLineHook);
  if (flags.moreAnimals) signs.push(protocolTexts.observedSigns.moreAnimals);
  if (flags.peopleDogsNearby)
    signs.push(protocolTexts.observedSigns.peopleDogsNearby);
  if (flags.restingOnLand) signs.push(protocolTexts.observedSigns.restingOnLand);
  if (flags.roadRisk)
    signs.push(protocolTexts.observedSigns.roadRisk);
  if (flags.other)
    signs.push(protocolTexts.observedSigns.other);

  return signs.join("\n");
}

function addSupplementalAdvice(parts: AdviceParts, flags: FlagsState, protocolTexts: Catalog = getEffectiveCatalog()) {
  const COMMON_END = protocolTexts.supplementalAdvice.commonEnd;
  const supplementalBlocks: string[] = [];

  if (flags.ringGps) {
    supplementalBlocks.push(
      protocolTexts.supplementalAdvice.trackingHeading +
        protocolTexts.supplementalAdvice.trackingInformation +
        protocolTexts.supplementalAdvice.trackingDoNotRemove +
        protocolTexts.supplementalAdvice.trackingPhotograph +
        protocolTexts.supplementalAdvice.trackingReport,
    );
  }

  if (flags.normalAppearance && !hasAnyConcern(flags) && !flags.cannotFly) {
    supplementalBlocks.push(
      protocolTexts.supplementalAdvice.normalHeading +
        protocolTexts.supplementalAdvice.normalObserve +
        protocolTexts.supplementalAdvice.normalAvoidCollection +
        protocolTexts.supplementalAdvice.normalNaturalBehaviour +
        protocolTexts.supplementalAdvice.normalUpdateFlags,
    );
  }

  return withAdviceSupplements(parts, supplementalBlocks, COMMON_END);
}

function getSmallBirdAdvice(flags: FlagsState, protocolTexts: Catalog = getEffectiveCatalog()) {
  const COMMON_END = protocolTexts.supplementalAdvice.commonEnd;
  if (hasPhysicalWarning(flags)) {
    const signs = getObservedSigns(flags, true, protocolTexts);
    const commonEnd =
    COMMON_END;

    return withCommonEnd(
  protocolTexts.smallBirdAdvice.physicalWarningTitle +
  protocolTexts.rescueHeadings.observedSignsLine +
  signs +
  protocolTexts.rescueHeadings.doNotAfterParagraph +
  protocolTexts.sharedRescueAdvice.noFoodOrWaterLine +
  protocolTexts.smallBirdAdvice.avoidWingExamination +
  protocolTexts.smallBirdAdvice.avoidChasingOrThrowing +
  protocolTexts.sharedRescueAdvice.documentWithoutFlashParagraph +
  protocolTexts.rescueHeadings.actionsLine +
  protocolTexts.smallBirdAdvice.handleOnlyWhenNecessary +
  protocolTexts.smallBirdAdvice.safeBoxForInjuredBird +
  protocolTexts.sharedRescueAdvice.protectBoxOrCarrierLine +
  protocolTexts.sharedRescueAdvice.catOrDogAttackAssessmentFemaleLine +
  protocolTexts.smallBirdAdvice.contactCenterOrAgents +
  protocolTexts.sharedRescueAdvice.continueToShareInformationParagraph,
  commonEnd
  );
  }

  if (flags.cannotFly) {
	  const commonEnd =
    COMMON_END;

    return withCommonEnd(
  protocolTexts.smallBirdAdvice.cannotFlyTitle +
  protocolTexts.rescueHeadings.beforeInterveningLine +
  protocolTexts.smallBirdAdvice.flightDoesNotAlwaysRequireRescue +
  protocolTexts.smallBirdAdvice.fledglingsMayBeAttended +
  protocolTexts.smallBirdAdvice.groundedSwiftsNeedAssessment +
  protocolTexts.sharedRescueAdvice.observeFromDistanceLine +
  protocolTexts.smallBirdAdvice.reviewBabySelection +
  protocolTexts.rescueHeadings.doNotLine +
  protocolTexts.sharedRescueAdvice.noFoodOrWaterLine +
  protocolTexts.rescueInstructions.minimalHandlingFemaleLine +
  protocolTexts.smallBirdAdvice.avoidForcingFlight +
  protocolTexts.rescueHeadings.actionsLine +
  protocolTexts.sharedRescueAdvice.keepPeopleAndPetsAwayLine +
  protocolTexts.smallBirdAdvice.observeInjuryOrWeakness +
  protocolTexts.smallBirdAdvice.safeBoxIfWarningSigns +
  protocolTexts.sharedRescueAdvice.protectBoxOrCarrierLine +
  protocolTexts.sharedRescueAdvice.documentWithoutFlashLine +
  protocolTexts.sharedRescueAdvice.contactRecoveryCenterLine +
  protocolTexts.sharedRescueAdvice.continueToShareInformationParagraph,
  commonEnd
);
  }

  if (hasImmediateRisk(flags) || flags.other) {
	  const commonEnd =
    COMMON_END;

    return withCommonEnd(
  protocolTexts.smallBirdAdvice.riskTitle +
  protocolTexts.rescueHeadings.observedSignsLine +
  getObservedSigns(flags, false, protocolTexts) +
  protocolTexts.rescueHeadings.doNotAfterParagraph +
  protocolTexts.smallBirdAdvice.avoidChasingOrHandling +
  protocolTexts.sharedRescueAdvice.noFoodOrWaterLine +
  protocolTexts.smallBirdAdvice.avoidPersonalRisk +
  protocolTexts.rescueHeadings.actionsLine +
  protocolTexts.smallBirdAdvice.roadSafetyFirst +
  protocolTexts.smallBirdAdvice.moveNearbyIfSafe +
  protocolTexts.smallBirdAdvice.safeBoxIfNeedsHelp +
  protocolTexts.sharedRescueAdvice.protectBoxOrCarrierLine +
  protocolTexts.sharedRescueAdvice.documentWithoutFlashLine +
  protocolTexts.sharedRescueAdvice.contactRecoveryCenterParagraph,
  commonEnd
);
  }

  const commonEnd =
    COMMON_END;

 return withCommonEnd(
  protocolTexts.smallBirdAdvice.defaultTitle +
  protocolTexts.rescueHeadings.beforeInterveningLine +
  protocolTexts.smallBirdAdvice.notAllGroundedBirdsNeedHelp +
  protocolTexts.smallBirdAdvice.groundedSwiftBoxAndConsult +
  protocolTexts.sharedRescueAdvice.observeFromDistanceLine +
  protocolTexts.smallBirdAdvice.avoidCollectingWithoutDanger +
  protocolTexts.rescueHeadings.doNotLine +
  protocolTexts.rescueInstructions.doNotCollectAutomaticallyLine +
  protocolTexts.sharedRescueAdvice.noFoodOrWaterLine +
  protocolTexts.rescueInstructions.doNotTestHealthFemaleParagraph +
  protocolTexts.rescueHeadings.actionsLine +
  protocolTexts.smallBirdAdvice.checkInjuryMovementAndDanger +
  protocolTexts.smallBirdAdvice.reviewPossibleBabySelection +
  protocolTexts.rescueInstructions.returnToSignsParagraph,
  commonEnd
);
}

function getLargeBirdAdvice(flags: FlagsState, protocolTexts: Catalog = getEffectiveCatalog()) {
  const COMMON_END = protocolTexts.supplementalAdvice.commonEnd;
  if (hasPhysicalWarning(flags)) {
	  const commonEnd =
    COMMON_END;

    return withCommonEnd(
  protocolTexts.largeBirdAdvice.physicalWarningTitle +
  protocolTexts.rescueHeadings.observedSignsLine +
  getObservedSigns(flags, true, protocolTexts) +
  protocolTexts.largeBirdAdvice.precautionHeading +
  protocolTexts.largeBirdAdvice.defensiveReaction +
  protocolTexts.largeBirdAdvice.avoidFaceAndHands +
  protocolTexts.rescueHeadings.doNotLine +
  protocolTexts.largeBirdAdvice.avoidHoldingByWingsLegsNeckFeathers +
  protocolTexts.largeBirdAdvice.avoidFlightTests +
  protocolTexts.sharedRescueAdvice.noFoodOrWaterLine +
  protocolTexts.sharedRescueAdvice.documentWithoutFlashParagraph +
  protocolTexts.rescueHeadings.actionsLine +
  protocolTexts.largeBirdAdvice.reduceNoiseAndBystanders +
  protocolTexts.largeBirdAdvice.coverOnlyWhenAdvised +
  protocolTexts.largeBirdAdvice.secureSturdyBox +
  protocolTexts.sharedRescueAdvice.protectBoxOrCarrierLine +
  protocolTexts.sharedRescueAdvice.catOrDogAttackAssessmentFemaleLine +
  protocolTexts.sharedRescueAdvice.contactRecoveryCenterLine +
  protocolTexts.sharedRescueAdvice.continueToShareInformationParagraph,
  commonEnd
);
  }

  if (flags.cannotFly) {
    const additionalRisk = hasImmediateRisk(flags) || flags.other;
	const commonEnd =
    COMMON_END;

    return withCommonEnd(
  protocolTexts.largeBirdAdvice.cannotFlyTitle +
  protocolTexts.rescueHeadings.beforeInterveningLine +
  protocolTexts.largeBirdAdvice.flightDoesNotAlwaysRequireRescue +
  protocolTexts.largeBirdAdvice.youngBirdLearning +
  protocolTexts.largeBirdAdvice.adultsMayStillCare +
  protocolTexts.largeBirdAdvice.observeSafelyWithoutImmediateDanger +
  (additionalRisk
    ? protocolTexts.rescueHeadings.observedSignsLine + getObservedSigns(flags, true, protocolTexts) + "\n\n"
    : protocolTexts.rescueHeadings.mayNeedHelpLine +
      protocolTexts.largeBirdAdvice.injuryWeaknessOrBreathing +
      protocolTexts.largeBirdAdvice.cannotStandOrMoveNormally +
      protocolTexts.largeBirdAdvice.abnormalWingPosition +
      protocolTexts.largeBirdAdvice.catOrDogAttack +
      protocolTexts.largeBirdAdvice.exposedToTrafficOrDanger +
      protocolTexts.largeBirdAdvice.abnormalBehaviourAfterObservation) +
  protocolTexts.rescueHeadings.doNotLine +
  protocolTexts.largeBirdAdvice.avoidAutomaticCollection +
  protocolTexts.largeBirdAdvice.avoidChasingOrThrowing +
  protocolTexts.rescueInstructions.keepFaceAndBareHandsAwayLine +
  protocolTexts.largeBirdAdvice.avoidHoldingByWingsLegsNeck +
  protocolTexts.sharedRescueAdvice.noFoodOrWaterParagraph +
  protocolTexts.rescueHeadings.actionsLine +
  protocolTexts.largeBirdAdvice.keepPeopleAndPetsAway +
  protocolTexts.largeBirdAdvice.observeAdultsCare +
  (additionalRisk
    ? protocolTexts.sharedRescueAdvice.immediateDangerSafetyLine
    : protocolTexts.largeBirdAdvice.avoidInterventionWhenSafe) +
  protocolTexts.largeBirdAdvice.contactBeforeHandling +
  protocolTexts.sharedRescueAdvice.documentWithoutFlashLine +
  protocolTexts.sharedRescueAdvice.continueToShareInformationParagraph,
  commonEnd
);
  }

  if (hasImmediateRisk(flags) || flags.other) {
	  const commonEnd =
    COMMON_END;

    return withCommonEnd(
  protocolTexts.largeBirdAdvice.riskTitle +
  protocolTexts.rescueHeadings.observedSignsLine +
  getObservedSigns(flags, false, protocolTexts) +
  protocolTexts.largeBirdAdvice.precautionHeading +
  protocolTexts.largeBirdAdvice.defensiveReaction +
  protocolTexts.largeBirdAdvice.avoidCornering +
  protocolTexts.rescueHeadings.doNotLine +
  protocolTexts.largeBirdAdvice.avoidTrafficIntervention +
  protocolTexts.largeBirdAdvice.avoidCaptureWithoutAdvice +
  protocolTexts.sharedRescueAdvice.noFoodOrWaterParagraph +
  protocolTexts.rescueHeadings.actionsLine +
  protocolTexts.largeBirdAdvice.movePeopleAndPetsAwaySafely +
  protocolTexts.sharedRescueAdvice.trafficSafetyAndEmergencyHelpLine +
  protocolTexts.largeBirdAdvice.contactIfHelpNeeded +
  protocolTexts.sharedRescueAdvice.documentWithoutFlashParagraph,
  commonEnd
);
  }

  const commonEnd =
    COMMON_END;

  return withCommonEnd(
  protocolTexts.largeBirdAdvice.defaultTitle +
  protocolTexts.rescueHeadings.beforeInterveningLine +
  protocolTexts.sharedRescueAdvice.observeSituationFromDistanceLine +
  protocolTexts.largeBirdAdvice.defensiveReaction +
  protocolTexts.largeBirdAdvice.groundOrLowBranchNotEnough +
  protocolTexts.rescueHeadings.doNotLine +
  protocolTexts.rescueInstructions.doNotTestHealthFemaleLine +
  protocolTexts.rescueInstructions.keepFaceAndBareHandsAwayLine +
  protocolTexts.sharedRescueAdvice.noFoodOrWaterLine +
  protocolTexts.sharedRescueAdvice.documentWithoutFlashParagraph +
  protocolTexts.rescueHeadings.actionsLine +
  protocolTexts.largeBirdAdvice.checkInjuryMovementAndBehaviour +
  protocolTexts.largeBirdAdvice.keepPeopleAndPetsAway +
  protocolTexts.largeBirdAdvice.reviewPossibleYoungBird +
  protocolTexts.rescueInstructions.returnToSignsLine +
  protocolTexts.largeBirdAdvice.contactIfUnsure,
  commonEnd
);
}

function getBatAdvice(flags: FlagsState, protocolTexts: Catalog = getEffectiveCatalog()) {
  const COMMON_END = protocolTexts.supplementalAdvice.commonEnd;
  const needsHelp = hasAnyConcern(flags) || flags.cannotFly;
const commonEnd =
    COMMON_END;

  return withCommonEnd(
    protocolTexts.batAdvice.title +
    protocolTexts.rescueHeadings.beforeInterveningLine +
    protocolTexts.batAdvice.daytimeOrGroundAssessment +
    protocolTexts.batAdvice.vulnerableNotThreatening +
    protocolTexts.batAdvice.keepChildrenAndPetsAway +
    (needsHelp
      ? protocolTexts.sharedRescueAdvice.selectedSignsNeedSpecialistHelpParagraph
      : protocolTexts.batAdvice.warningSignsAssessment) +
    (needsHelp
      ? protocolTexts.rescueHeadings.observedSignsLine + getObservedSigns(flags, true, protocolTexts) + "\n\n"
      : "") +
    protocolTexts.rescueHeadings.doNotLine +
    protocolTexts.batAdvice.neverThrowToTestFlight +
    protocolTexts.sharedRescueAdvice.noFoodOrWaterLine +
    protocolTexts.rescueInstructions.minimalHandlingMaleParagraph +
    protocolTexts.rescueHeadings.actionsLine +
    protocolTexts.batAdvice.protectHandsWhenMovementNecessary +
    protocolTexts.batAdvice.handleBrieflyAndGently +
    protocolTexts.batAdvice.ventilatedBoxWithAbsorbentLining +
    protocolTexts.rescueInstructions.quietDarkProtectedBoxLine +
    protocolTexts.batAdvice.reportHumanOrDomesticAnimalContact +
    protocolTexts.sharedRescueAdvice.documentWithoutFlashLine +
    protocolTexts.sharedRescueAdvice.contactRecoveryCenterLine +
    protocolTexts.sharedRescueAdvice.continueToShareInformationParagraph,
  commonEnd
  );
}

function getSmallMammalAdvice(flags: FlagsState, protocolTexts: Catalog = getEffectiveCatalog()) {
  const COMMON_END = protocolTexts.supplementalAdvice.commonEnd;
  const needsHelp = hasAnyConcern(flags);
const commonEnd =
    COMMON_END;

  return withCommonEnd(
    protocolTexts.smallMammalAdvice.title +
    protocolTexts.rescueHeadings.beforeInterveningLine +
    protocolTexts.smallMammalAdvice.observeBehaviourFromDistance +
    (needsHelp
      ? protocolTexts.sharedRescueAdvice.selectedSignsNeedSpecialistHelpParagraph
      : protocolTexts.smallMammalAdvice.avoidCollectingWithoutConcern) +
    (needsHelp
      ? protocolTexts.rescueHeadings.observedSignsLine + getObservedSigns(flags, false, protocolTexts) + "\n\n"
      : "") +
    protocolTexts.rescueHeadings.doNotLine +
    protocolTexts.rescueInstructions.minimalHandlingMaleLine +
    protocolTexts.smallMammalAdvice.neverHoldTailLegsOrHead +
    protocolTexts.sharedRescueAdvice.noFoodOrWaterLine +
    protocolTexts.sharedRescueAdvice.documentWithoutFlashParagraph +
    protocolTexts.rescueHeadings.actionsLine +
    (needsHelp
      ? protocolTexts.smallMammalAdvice.safeBoxOnlyWithoutRisk +
        protocolTexts.sharedRescueAdvice.protectBoxOrCarrierLine
      : protocolTexts.smallMammalAdvice.keepPeopleAndPetsAwayAndSeekAdvice) +
    protocolTexts.smallMammalAdvice.assessmentAfterCatOrDogAttack +
    protocolTexts.sharedRescueAdvice.contactRecoveryCenterParagraph,
  commonEnd
  );
}

function getLargeMammalAdvice(flags: FlagsState, protocolTexts: Catalog = getEffectiveCatalog()) {
  const COMMON_END = protocolTexts.supplementalAdvice.commonEnd;
  const needsHelp = hasAnyConcern(flags);
const commonEnd =
    COMMON_END;

  return withCommonEnd(
    protocolTexts.largeMammalAdvice.title +
    protocolTexts.rescueHeadings.beforeInterveningLine +
    protocolTexts.sharedRescueAdvice.observeSituationFromDistanceLine +
    protocolTexts.largeMammalAdvice.unpredictableReaction +
    (needsHelp
      ? protocolTexts.sharedRescueAdvice.selectedSignsNeedSpecialistHelpParagraph
      : protocolTexts.largeMammalAdvice.avoidApproachWithoutConcern) +
    (needsHelp
      ? protocolTexts.rescueHeadings.observedSignsLine + getObservedSigns(flags, false, protocolTexts) + "\n\n"
      : "") +
    protocolTexts.rescueHeadings.doNotLine +
    protocolTexts.largeMammalAdvice.neverCaptureRestrainOrTransport +
    protocolTexts.largeMammalAdvice.neverCornerOrBlockEscape +
    protocolTexts.sharedRescueAdvice.noFoodOrWaterLine +
    protocolTexts.sharedRescueAdvice.documentWithoutFlashParagraph +
    protocolTexts.rescueHeadings.actionsLine +
    protocolTexts.largeMammalAdvice.reduceNoiseAndKeepOthersAwaySafely +
    protocolTexts.sharedRescueAdvice.trafficSafetyAndEmergencyHelpLine +
    protocolTexts.sharedRescueAdvice.contactRecoveryCenterLine +
    protocolTexts.rescueInstructions.followSpecialistsParagraph,
  commonEnd
  );
}

function getReptileAmphibianAdvice(flags: FlagsState, protocolTexts: Catalog = getEffectiveCatalog()) {
  const COMMON_END = protocolTexts.supplementalAdvice.commonEnd;
  const needsHelp = hasAnyConcern(flags);
const commonEnd =
    COMMON_END;

  return withCommonEnd(
    protocolTexts.reptileAmphibianAdvice.title +
    protocolTexts.rescueHeadings.beforeInterveningLine +
    protocolTexts.reptileAmphibianAdvice.observeAndAvoidUnidentifiedContact +
    (needsHelp
      ? protocolTexts.reptileAmphibianAdvice.warningSignsExcludeSnakesFromMovementAdvice
      : protocolTexts.reptileAmphibianAdvice.avoidHandlingWithoutDanger) +
    (needsHelp
      ? protocolTexts.rescueHeadings.observedSignsLine + getObservedSigns(flags, false, protocolTexts) + "\n\n"
      : "") +
    protocolTexts.rescueHeadings.doNotLine +
    protocolTexts.reptileAmphibianAdvice.avoidUnnecessaryHandling +
    protocolTexts.rescueInstructions.snakeNoHandlingOrTransferLine +
    protocolTexts.reptileAmphibianAdvice.avoidLongDistanceTransport +
    protocolTexts.sharedRescueAdvice.noFoodOrWaterParagraph +
    protocolTexts.rescueHeadings.actionsLine +
    protocolTexts.rescueInstructions.reduceNoisePeopleAndPetsLine +
    protocolTexts.reptileAmphibianAdvice.snakeSpecialistHelpAndOtherSpeciesContainer +
    protocolTexts.reptileAmphibianAdvice.nearbyReleaseOnlyForOtherIdentifiedSpecies +
    protocolTexts.sharedRescueAdvice.documentWithoutFlashLine +
    protocolTexts.sharedRescueAdvice.contactRecoveryCenterParagraph,
  commonEnd
  );
}

function hasMarineWaterInterventionRisk(
  animalPosition?: AnimalPosition | null,
  animalEnvironment?: AnimalEnvironment | null,
) {
  return (
    animalPosition === "water" ||
    animalPosition === "shoreShallowWater" ||
    animalPosition === "beachSand" ||
    animalEnvironment === "coastBeach" ||
    animalEnvironment === "openSea" ||
    animalEnvironment === "estuaryMouth"
  );
}

function isCoastalSealPosition(
  animalPosition?: AnimalPosition | null,
  animalEnvironment?: AnimalEnvironment | null,
) {
  return (
    animalPosition === "beachSand" ||
    animalPosition === "rocksBreakwater" ||
    animalPosition === "portDock" ||
    animalEnvironment === "coastBeach" ||
    animalEnvironment === "rockyCoastCliff" ||
    animalEnvironment === "portMarina"
  );
}

function isStrandedCetaceanPosition(
  animalPosition?: AnimalPosition | null,
  animalEnvironment?: AnimalEnvironment | null,
) {
  return (
    animalPosition === "beachSand" ||
    animalPosition === "shoreShallowWater" ||
    animalPosition === "water" ||
    animalEnvironment === "coastBeach"
  );
}

function mayNeedTurtleHeatOrAirReminder(
  flags: FlagsState,
  animalPosition?: AnimalPosition | null,
) {
  return (
    flags.stranded ||
    animalPosition === "beachSand" ||
    animalPosition === "onBoat"
  );
}

function addUnique(target: MarineAdviceRecommendation[], recommendation: MarineAdviceRecommendation) {
  if (!target.some((item) => item.id === recommendation.id)) {
    target.push(recommendation);
  }
}

function addMarineFlagAdvice(
  flags: FlagsState,
  dont: MarineAdviceRecommendation[],
  actions: MarineAdviceRecommendation[], protocolTexts: Catalog = getEffectiveCatalog(),
) {
  if (flags.stranded) {
    addUnique(dont, { id: "marine.do-not-return-to-water", text: protocolTexts.marineFlagAdvice.doNotReturnToWater });
  }

  if (flags.trapped) {
    addUnique(
      dont,
      { id: "marine.do-not-remove-entangled-gear", text: protocolTexts.marineFlagAdvice.doNotRemoveEntangledGear },
    );
    addUnique(
      actions,
      { id: "marine.describe-entanglement-without-touching", text: protocolTexts.marineFlagAdvice.describeEntanglementWithoutTouching },
    );
  }

  if (flags.fishingLineHook) {
    addUnique(
      dont,
      { id: "marine.do-not-pull-line-or-remove-hook", text: protocolTexts.marineFlagAdvice.doNotPullLineOrRemoveHook },
    );
    addUnique(
      actions,
      { id: "marine.report-fishing-gear-location", text: protocolTexts.marineFlagAdvice.reportFishingGearLocation },
    );
  }

  if (flags.moreAnimals) {
    addUnique(
      actions,
      { id: "marine.report-animal-count-and-location", text: protocolTexts.marineFlagAdvice.reportAnimalCountAndLocation },
    );
  }

  if (flags.peopleDogsNearby) {
    addUnique(
      actions,
      { id: "marine.keep-people-and-dogs-away", text: protocolTexts.rescueInstructions.keepPeopleAndDogsAway },
    );
  }

  if (flags.bleeding) {
    addUnique(dont, { id: "marine.do-not-treat-wound", text: protocolTexts.marineFlagAdvice.doNotTreatWound });
    addUnique(
      actions,
      { id: "marine.document-visible-injuries-from-distance", text: protocolTexts.marineFlagAdvice.documentVisibleInjuriesFromDistance },
    );
  }

  if (flags.weakness) {
    addUnique(
      dont,
      { id: "marine.do-not-move-to-test-mobility", text: protocolTexts.marineFlagAdvice.doNotMoveToTestMobility },
    );
    addUnique(
      actions,
      { id: "marine.observe-weakness-from-distance", text: protocolTexts.marineFlagAdvice.observeWeaknessFromDistance },
    );
  }

  if (flags.other) {
    addUnique(
      actions,
      { id: "marine.describe-other-concerns", text: protocolTexts.marineFlagAdvice.describeOtherConcerns },
    );
  }
}

function getMarineAnimalAdvice(
  animalType: AnimalType,
  flags: FlagsState,
  animalPosition?: AnimalPosition | null,
  animalEnvironment?: AnimalEnvironment | null, protocolTexts: Catalog = getEffectiveCatalog(),
) {
  const COMMON_END = protocolTexts.supplementalAdvice.commonEnd;
  const signs = getObservedSigns(flags, false, protocolTexts);
  const hasSigns = signs.length > 0;
  const title =
    animalType === "dolphin"
      ? protocolTexts.marineAnimalAdvice.dolphinTitle
      : animalType === "largeCetacean"
        ? protocolTexts.marineAnimalAdvice.largeCetaceanTitle
        : animalType === "seal"
          ? protocolTexts.marineAnimalAdvice.sealTitle
          : animalType === "seaTurtle"
            ? protocolTexts.marineAnimalAdvice.seaTurtleTitle
            : animalType === "sharkRay"
              ? protocolTexts.marineAnimalAdvice.sharkRayTitle
              : protocolTexts.marineAnimalAdvice.otherMarineTitle;
  const isCetacean =
    animalType === "dolphin" || animalType === "largeCetacean";

  const before: MarineAdviceRecommendation[] =
    animalType === "largeCetacean"
      ? [
          { id: "marine.large-cetacean-distance", text: protocolTexts.marineAnimalAdvice.largeCetaceanDistance },
          { id: "marine.do-not-handle-or-move", text: protocolTexts.marineAnimalAdvice.doNotHandleOrMove },
          { id: "marine.no-food-or-water", text: protocolTexts.marineAnimalAdvice.noFoodOrWater },
        ]
      : animalType === "sharkRay"
        ? [
            { id: "marine.shark-ray-distance", text: protocolTexts.marineAnimalAdvice.sharkRayDistance },
            { id: "marine.do-not-handle-or-move", text: protocolTexts.marineAnimalAdvice.doNotHandleOrMove },
            { id: "marine.no-food-or-water", text: protocolTexts.marineAnimalAdvice.noFoodOrWater },
          ]
        : [
            { id: "marine.distance-and-quiet", text: protocolTexts.marineAnimalAdvice.distanceAndQuiet },
            { id: "marine.do-not-handle-or-move", text: protocolTexts.marineAnimalAdvice.doNotHandleOrMove },
            { id: "marine.no-food-or-water", text: protocolTexts.marineAnimalAdvice.noFoodOrWater },
          ];
  const dont: MarineAdviceRecommendation[] = [];
  const actions: MarineAdviceRecommendation[] = [
    { id: "marine.note-exact-location", text: protocolTexts.marineAnimalAdvice.noteExactLocation },
    { id: "marine.document-without-approaching", text: protocolTexts.marineAnimalAdvice.documentWithoutApproaching },
  ];

  if (animalType === "seal") {
    if (flags.restingOnLand || isCoastalSealPosition(animalPosition, animalEnvironment)) {
      addUnique(
        before,
        { id: "marine.seal-may-be-resting", text: protocolTexts.marineAnimalAdvice.sealMayBeResting },
      );
      addUnique(dont, { id: "marine.do-not-block-seal-return", text: protocolTexts.marineAnimalAdvice.doNotBlockSealReturn });
      if (!flags.peopleDogsNearby) {
        addUnique(
          actions,
          { id: "marine.keep-dogs-leashed", text: protocolTexts.marineAnimalAdvice.keepDogsLeashed },
        );
      }
    }

    if (flags.restingOnLand) {
      addUnique(
        actions,
        { id: "marine.allow-seal-rest-and-report-concerns", text: protocolTexts.marineAnimalAdvice.allowSealRestAndReportConcerns },
      );
    }
  }

  if (
    isCetacean &&
    flags.stranded
  ) {
    addUnique(dont, { id: "marine.do-not-push-or-drag", text: protocolTexts.marineAnimalAdvice.doNotPushOrDrag });

    if (animalType === "largeCetacean") {
      addUnique(
        dont,
        { id: "marine.no-mechanical-movement", text: protocolTexts.marineAnimalAdvice.noMechanicalMovement },
      );
    }
  }

  if (
    isCetacean &&
    flags.stranded &&
    isStrandedCetaceanPosition(animalPosition, animalEnvironment)
  ) {
    addUnique(
      actions,
      { id: "marine.report-stranding-position", text: protocolTexts.marineAnimalAdvice.reportStrandingPosition },
    );
  }

  if (isCetacean) {
    addUnique(
      actions,
      flags.moreAnimals
        ? { id: "marine.observe-multiple-cetaceans", text: protocolTexts.marineAnimalAdvice.observeMultipleCetaceans }
        : { id: "marine.observe-single-cetacean", text: protocolTexts.marineAnimalAdvice.observeSingleCetacean },
    );
  }

  if (
    animalType === "dolphin" &&
    animalEnvironment === "openSea" &&
    !flags.stranded
  ) {
    addUnique(
      dont,
      { id: "marine.do-not-pursue-dolphin", text: protocolTexts.marineAnimalAdvice.doNotPursueDolphin },
    );
  }

  if (animalType === "seaTurtle") {
    addUnique(dont, { id: "marine.do-not-turn-turtle-over", text: protocolTexts.marineAnimalAdvice.doNotTurnTurtleOver });

    if (flags.trapped || flags.fishingLineHook) {
      addUnique(
        before,
        { id: "marine.turtle-fishing-gear-needs-assessment", text: protocolTexts.marineAnimalAdvice.turtleFishingGearNeedsAssessment },
      );
    }

    if (flags.bleeding) {
      addUnique(
        dont,
        { id: "marine.do-not-treat-turtle-injuries", text: protocolTexts.marineAnimalAdvice.doNotTreatTurtleInjuries },
      );
      addUnique(
        actions,
        { id: "marine.report-turtle-injuries", text: protocolTexts.marineAnimalAdvice.reportTurtleInjuries },
      );
    }

    if (animalPosition === "onBoat") {
      addUnique(
        actions,
        { id: "marine.turtle-on-boat-await-instructions", text: protocolTexts.marineAnimalAdvice.turtleOnBoatAwaitInstructions },
      );
    }

    if (flags.fishingLineHook && animalPosition === "onBoat") {
      addUnique(
        dont,
        { id: "marine.no-fishing-line-or-sharp-tools", text: protocolTexts.marineAnimalAdvice.noFishingLineOrSharpTools },
      );
    }

    if (mayNeedTurtleHeatOrAirReminder(flags, animalPosition)) {
      addUnique(
        before,
        { id: "marine.turtle-air-and-heat-reminder", text: protocolTexts.marineAnimalAdvice.turtleAirAndHeatReminder },
      );
    }
  }

  if (animalType === "sharkRay") {
    addUnique(dont, { id: "marine.avoid-head-tail-and-fins", text: protocolTexts.marineAnimalAdvice.avoidHeadTailAndFins });

    if (flags.stranded || animalPosition === "shoreShallowWater") {
      addUnique(
        dont,
        { id: "marine.do-not-touch-to-move", text: protocolTexts.marineAnimalAdvice.doNotTouchToMove },
      );
    }
  }

  if (animalPosition === "onBoat" && animalType !== "seaTurtle") {
    addUnique(
      actions,
      { id: "marine.animal-on-boat-seek-help", text: protocolTexts.marineAnimalAdvice.animalOnBoatSeekHelp },
    );
  }

  if (animalType === "otherMarine") {
    addUnique(
      actions,
      { id: "marine.observe-other-marine-animal", text: protocolTexts.marineAnimalAdvice.observeOtherMarineAnimal },
    );
  }

  if (hasMarineWaterInterventionRisk(animalPosition, animalEnvironment)) {
    addUnique(
      dont,
      { id: "marine.do-not-enter-water", text: protocolTexts.marineAnimalAdvice.doNotEnterWater },
    );
  }

  addMarineFlagAdvice(flags, dont, actions, protocolTexts);

  actions.push(
    { id: "marine.contact-competent-service", text: protocolTexts.marineAnimalAdvice.contactCompetentService },
  );

  return withCommonEnd(
    title +
    protocolTexts.rescueHeadings.beforeInterveningAfterParagraph +
    before.map((item) => item.text).join("\n") +
    "\n" +
    (hasSigns ? protocolTexts.rescueHeadings.observedSignsAfterLine + signs + "\n\n" : "\n") +
    protocolTexts.rescueHeadings.doNotLine +
    (dont.length > 0
      ? dont.map((item) => item.text).join("\n")
      : protocolTexts.marineAnimalAdvice.noImprovisedRescue) +
    "\n\n" +
    protocolTexts.rescueHeadings.actionsLine +
    actions.map((item) => item.text).join("\n") +
    "\n\n" ,
    COMMON_END
  );
}

function getDeadMarineAnimalAdvice(animalType: AnimalType, protocolTexts: Catalog = getEffectiveCatalog()) {
  const COMMON_END = protocolTexts.supplementalAdvice.commonEnd;
  const title =
    animalType === "dolphin"
      ? protocolTexts.deadAdvice.marineDolphinTitle
      : animalType === "largeCetacean"
        ? protocolTexts.deadAdvice.marineLargeCetaceanTitle
        : animalType === "seal"
          ? protocolTexts.deadAdvice.marineSealTitle
          : animalType === "seaTurtle"
            ? protocolTexts.deadAdvice.marineSeaTurtleTitle
            : animalType === "sharkRay"
              ? protocolTexts.deadAdvice.marineSharkRayTitle
              : protocolTexts.deadAdvice.marineOtherTitle;

  return withCommonEnd(
    title +
    protocolTexts.rescueHeadings.beforeInterveningAfterParagraph +
    protocolTexts.deadAdvice.marineScientificValueLine +
    protocolTexts.deadAdvice.marineKeepPeopleAndDogsAwayParagraph +
    protocolTexts.rescueHeadings.doNotLine +
    protocolTexts.deadAdvice.marineDoNotTouchOrMoveBodyLine +
    protocolTexts.deadAdvice.doNotAlterDiscoverySiteParagraph +
    protocolTexts.rescueHeadings.actionsLine +
    protocolTexts.deadAdvice.recordExactLocationLine +
    protocolTexts.deadAdvice.safePhotosLine +
    protocolTexts.deadAdvice.notifyCompetentServiceLine +
    protocolTexts.deadAdvice.marineReportSpeciesSizeTimeAndOthersParagraph ,
    COMMON_END
  );
}

function getUnknownAnimalAdvice(flags: FlagsState, protocolTexts: Catalog = getEffectiveCatalog()) {
  const COMMON_END = protocolTexts.supplementalAdvice.commonEnd;
  const needsHelp = hasAnyConcern(flags) || flags.cannotFly;
const commonEnd =
    COMMON_END;

  return withCommonEnd(
    protocolTexts.rescueHeadings.unknownAnimalParagraph +
    protocolTexts.rescueHeadings.beforeInterveningLine +
    protocolTexts.unknownAnimalAdvice.exactIdentificationNotRequired +
    protocolTexts.sharedRescueAdvice.observeFromDistanceLine +
    (needsHelp
      ? protocolTexts.sharedRescueAdvice.selectedSignsNeedSpecialistHelpParagraph
      : protocolTexts.unknownAnimalAdvice.avoidInterventionWithoutConcern) +
    (needsHelp
      ? protocolTexts.rescueHeadings.observedSignsLine + getObservedSigns(flags, true, protocolTexts) + "\n\n"
      : "") +
    protocolTexts.rescueHeadings.doNotLine +
    protocolTexts.unknownAnimalAdvice.avoidUnnecessaryHandlingOrTransport +
    protocolTexts.unknownAnimalAdvice.neverForceRelease +
    protocolTexts.sharedRescueAdvice.noFoodOrWaterParagraph +
    protocolTexts.rescueHeadings.actionsLine +
    protocolTexts.sharedRescueAdvice.keepPeopleAndPetsAwayLine +
    protocolTexts.sharedRescueAdvice.immediateDangerSafetyLine +
    protocolTexts.sharedRescueAdvice.documentWithoutFlashLine +
    protocolTexts.sharedRescueAdvice.contactRecoveryCenterParagraph,
  commonEnd
  );
}

export function getAdvice(
  animalState: AnimalState,
  animalType: AnimalType,
  flags: FlagsState,
  animalPosition?: AnimalPosition | null,
  animalEnvironment?: AnimalEnvironment | null,
) {
  return formatAdvice(getAdviceParts(animalState, animalType, flags, animalPosition, animalEnvironment));
}

function getAdvicePartsWithTexts(
  animalState: AnimalState,
  animalType: AnimalType,
  flags: FlagsState,
  animalPosition?: AnimalPosition | null,
  animalEnvironment?: AnimalEnvironment | null, protocolTexts: Catalog = getEffectiveCatalog(),
): AdviceParts {
  const COMMON_END = protocolTexts.supplementalAdvice.commonEnd;
  if (animalState === "dead" && isMarineAnimal(animalType)) {
    return getDeadMarineAnimalAdvice(animalType, protocolTexts);
  }

     if (animalState === "dead") {
		 const commonEnd =
    COMMON_END;

     return withCommonEnd(
    protocolTexts.deadAdvice.terrestrialTitle +
    protocolTexts.rescueHeadings.beforeInterveningLine +
    protocolTexts.deadAdvice.findingDeadAnimalObserveCalmlyLine +
    protocolTexts.deadAdvice.observationsMayPreventOtherDeathsParagraph +
    protocolTexts.rescueHeadings.whatToObserveLine +
    protocolTexts.deadAdvice.checkOtherAffectedAnimalsFromDistanceLine +
    protocolTexts.deadAdvice.lookForVisibleCausesWithoutTouchingLine +
    protocolTexts.deadAdvice.checkPeopleAndPetsRiskParagraph +
    protocolTexts.rescueHeadings.doNotLine +
    protocolTexts.deadAdvice.doNotTouchOrMoveExceptDangerAndInstructionLine +
    protocolTexts.deadAdvice.doNotHandleSuspiciousObjectsLine +
    protocolTexts.deadAdvice.doNotAlterDiscoverySiteParagraph +
    protocolTexts.rescueHeadings.actionsLine +
    protocolTexts.deadAdvice.documentAnimalAndSurroundingsWithoutChangingSceneLine +
    protocolTexts.deadAdvice.provideExactLocationForProfessionalsLine +
    protocolTexts.deadAdvice.reportToAuthoritiesWithObservationsParagraph,
  commonEnd
  );
   }

  if (isMarineAnimal(animalType)) {
    return addSupplementalAdvice(
      getMarineAnimalAdvice(
        animalType,
        flags,
        animalPosition,
        animalEnvironment, protocolTexts,
      ),
      {
        ...flags,
        normalAppearance: false,
      }, protocolTexts,
    );
  }

  // Prioridad 1: el atrapamiento requiere instrucciones específicas de liberación y seguridad.
  if (flags.trapped) {
    return addSupplementalAdvice(getTrappedAdvice(animalType, protocolTexts), flags, protocolTexts);
  }

  // Prioridad 2: una cría necesita primero valorar edad, dependencia y posible reunificación.
  if (flags.baby) {
    return addSupplementalAdvice(getBabyAdvice(animalType, protocolTexts), flags, protocolTexts);
  }

  let advice: AdviceParts;

  switch (animalType) {
    case "smallBird":
      advice = getSmallBirdAdvice(flags, protocolTexts);
      break;
    case "largeBird":
      advice = getLargeBirdAdvice(flags, protocolTexts);
      break;
    case "bat":
      advice = getBatAdvice(flags, protocolTexts);
      break;
    case "smallMammal":
      advice = getSmallMammalAdvice(flags, protocolTexts);
      break;
    case "largeMammal":
      advice = getLargeMammalAdvice(flags, protocolTexts);
      break;
    case "reptileAmphibian":
      advice = getReptileAmphibianAdvice(flags, protocolTexts);
      break;
    default:
      advice = getUnknownAnimalAdvice(flags, protocolTexts);
  }

  return addSupplementalAdvice(advice, flags, protocolTexts);
}

export function getAdviceForLocale(
  locale: Locale,
  animalState: AnimalState,
  animalType: AnimalType,
  flags: FlagsState,
  animalPosition?: AnimalPosition | null,
  animalEnvironment?: AnimalEnvironment | null,
): string {
  return formatAdvice(getAdvicePartsForLocale(locale, animalState, animalType, flags, animalPosition, animalEnvironment));
}

export function getAdvicePartsForLocale(
  locale: Locale,
  animalState: AnimalState,
  animalType: AnimalType,
  flags: FlagsState,
  animalPosition?: AnimalPosition | null,
  animalEnvironment?: AnimalEnvironment | null,
): AdviceParts {
  return getAdvicePartsWithTexts(animalState, animalType, flags, animalPosition, animalEnvironment, getEffectiveCatalog(locale));
}

export function getAdviceParts(
  animalState: AnimalState,
  animalType: AnimalType,
  flags: FlagsState,
  animalPosition?: AnimalPosition | null,
  animalEnvironment?: AnimalEnvironment | null,
): AdviceParts {
  return getAdvicePartsForLocale(DEFAULT_LOCALE, animalState, animalType, flags, animalPosition, animalEnvironment);
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
  initialAnimalType?: AnimalType | null;
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
  texts: Catalog = generalTexts,
) {
  const lines: LocationSummaryLine[] = [];

  if (approximateLocation) {
    lines.push({ kind: "reference", text: `${texts.summaryLocation.referencePrefix}${approximateLocation}` });
  }

  if (coords) {
    lines.push(
      { kind: "coordinates", text: `${texts.summaryLocation.coordinatesPrefix}${formatCoordinates(coords)}` },
      { kind: "map", text: `${texts.summaryLocation.mapPrefix}https://maps.google.com/?q=${coords.latitude},${coords.longitude}` },
    );
  }

  return lines;
}

function cleanTextForSpeech(text: string) {
  return text
    .replace(
      /[\u{1F1E6}-\u{1F1FF}\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{200D}]/gu,
      " ",
    )
    .replace(/[•·▪◦●○■□◆◇★☆▶▷►]/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\s*\n\s*/g, "\n")
    .replace(/\n{2,}/g, "\n")
    .trim();
}

export default function HomeScreen({
  initialCase = null,
  initialAnimalType = null,
}: SosAssistantProps) {
  const { t, locale } = useI18n();
  const generalTexts = getEffectiveCatalog(locale);
  const pagePath = useInformationPagePath();
  const homePath = pagePath("home");
  const backNavigationRef = useRef({ homePath, t, url: "" });
  backNavigationRef.current = { homePath, t, url: Platform.OS === "web" && typeof window !== "undefined" ? window.location.href : "" };
  const displayLabel = useCallback((text: string) => localiseAssistantLabel(text, locale), [locale]);
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const router = useRouter();
  const isMobileAdviceText = width <= 480;
  const isNarrowFlagLayout = width <= 430;
  const shouldUseFullWidthFlag = (label: string) =>
    isNarrowFlagLayout && label.length >= 19;
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
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showEmptyStep3Confirmation, setShowEmptyStep3Confirmation] =
    useState(false);

  const [animalState, setAnimalState] = useState<AnimalState>(
    (initialCase?.animalState as AnimalState) ?? "alive",
  );
  const [animalType, setAnimalType] = useState<AnimalType>(
    (initialCase?.animalType as AnimalType) ?? initialAnimalType ?? "unknown",
  );
  const [animalPlace] = useState<AnimalPlace | null>(
    initialCase?.animalPlace ?? null,
  );
  const [animalPosition, setAnimalPosition] = useState<AnimalPosition | null>(
    initialCase?.animalPosition ?? null,
  );
  const [animalEnvironment, setAnimalEnvironment] =
    useState<AnimalEnvironment | null>(
      initialCase?.animalEnvironment ?? null,
    );

  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [videoUri, setVideoUri] = useState<string | null>(null);

  const [locationValue, setLocationValue] = useState<StoredLocationValue>(() =>
    readStoredLocationText(initialCase?.locationText),
  );
  const locationText = writeStoredLocationText(locationValue);
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
  const isMountedRef = useRef(true);
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
    normalizeFlags(initialCase?.flags),
  );
  const step2ScrollProgress =
    scrollContentHeight <= scrollLayoutHeight
      ? 0
      : (scrollY + scrollLayoutHeight) / scrollContentHeight;

  const advice = useMemo(
    () =>
      getAdviceForLocale(
        locale,
        animalState,
        animalType,
        flags,
        animalPosition,
        animalEnvironment,
      ),
    [animalState, animalType, flags, animalPosition, animalEnvironment, locale],
  );

  const finishSpeaking = useCallback(() => {
    if (isMountedRef.current) {
      setIsSpeaking(false);
    }
  }, []);

  const toggleAdviceSpeech = useCallback(async () => {
    if (isSpeaking) {
      await Speech.stop();
      finishSpeaking();
      return;
    }

    await Speech.stop();

    const speechText = cleanTextForSpeech(advice);
    if (!speechText) return;

    setIsSpeaking(true);

    try {
      Speech.speak(speechText, {
        language: locale === "en" ? "en-GB" : "es-ES",
        rate: 0.9,
        onDone: finishSpeaking,
        onStopped: finishSpeaking,
        onError: finishSpeaking,
      });
    } catch {
      finishSpeaking();
    }
  }, [advice, finishSpeaking, isSpeaking, locale]);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      void Speech.stop();
    };
  }, []);

  useEffect(() => {
    if (step !== 2) {
      void Speech.stop();
      setIsSpeaking(false);
    }

    return () => {
      void Speech.stop();
    };
  }, [advice, step]);

  const visibleFlagLabels = useMemo(
    () => VISIBLE_FLAG_LABELS_BY_ANIMAL_TYPE[animalType],
    [animalType],
  );

  const visiblePositionOptions = useMemo(
    () => VISIBLE_POSITION_OPTIONS_BY_ANIMAL_TYPE[animalType],
    [animalType],
  );

  const visibleEnvironmentOptions = useMemo(
    () => VISIBLE_ENVIRONMENT_OPTIONS_BY_ANIMAL_TYPE[animalType],
    [animalType],
  );

  const selectedFlagLabels = useMemo(
    () => {
      const visibleKeys = new Set(visibleFlagLabels.map(({ key }) => key));
      const visibleLabels = visibleFlagLabels
        .filter(({ key }) => flags[key])
        .map(({ label }) => label);
      const legacyLabels = FLAG_LABELS.filter(
        ({ key }) => !visibleKeys.has(key) && flags[key],
      ).map(({ label }) => label);

      return [...visibleLabels, ...legacyLabels];
    },
    [flags, visibleFlagLabels],
  );

  const selectedAnimalLabel = useMemo(
    () =>
      ANIMAL_OPTIONS.find((option) => option.key === animalType)?.label ||
      generalTexts.summaryPreview.notSpecified,
    [animalType],
  );

  const selectedAnimalStateLabel = useMemo(
    () =>
      ANIMAL_STATE_OPTIONS.find((option) => option.key === animalState)
        ?.label || generalTexts.summaryPreview.notSpecified,
    [animalState],
  );

  const selectedAnimalPlaceLabel = useMemo(
    () =>
      ANIMAL_PLACE_OPTIONS.find((option) => option.key === animalPlace)
        ?.label || generalTexts.summaryPreview.notSpecified,
    [animalPlace],
  );

  const selectedAnimalPositionLabel = useMemo(
    () =>
      ANIMAL_POSITION_OPTIONS.find((option) => option.key === animalPosition)
        ?.label || generalTexts.summaryPreview.notSpecified,
    [animalPosition],
  );

  const selectedAnimalEnvironmentLabel = useMemo(
    () =>
      ANIMAL_ENVIRONMENT_OPTIONS.find(
        (option) => option.key === animalEnvironment,
      )?.label || generalTexts.summaryPreview.notSpecified,
    [animalEnvironment],
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

  const shouldShowForwardArrowHint = useMemo(() => {
    if (step === 1) {
      return isCurrentStepReadyToContinue;
    }

    if (step === 2) {
      return scrollY > 0 && step2ScrollProgress >= 0.9;
    }

    if (step === 3) {
      return Boolean(photoUri || videoUri || coords);
    }

    return false;
  }, [
    coords,
    isCurrentStepReadyToContinue,
    photoUri,
    scrollY,
    step,
    step2ScrollProgress,
    videoUri,
  ]);

  const hasMeaningfulProgress = useMemo(() => {
    if (initialCase || currentCase) return true;

    return (
      step !== 1 ||
      animalState !== "alive" ||
      animalType !== "unknown" ||
      animalPlace !== null ||
      animalPosition !== null ||
      animalEnvironment !== null ||
      Object.values(flags).some(Boolean) ||
      photoUri !== null ||
      videoUri !== null ||
      locationCaptured ||
      coords !== null
    );
  }, [
    animalState,
    animalEnvironment,
    animalPlace,
    animalPosition,
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

  const resetForwardArrowHint = useCallback(() => {
    forwardArrowHintX.stopAnimation();
    forwardArrowHintScale.stopAnimation();
    forwardArrowHintX.setValue(0);
    forwardArrowHintScale.setValue(1);
  }, [forwardArrowHintScale, forwardArrowHintX]);

  const playForwardArrowHint = useCallback(() => {
    forwardArrowHintX.setValue(0);
    forwardArrowHintScale.setValue(1);

    Animated.sequence([
      Animated.parallel([
        Animated.timing(forwardArrowHintX, {
          toValue: 11,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: Platform.OS !== "web",
        }),
        Animated.timing(forwardArrowHintScale, {
          toValue: 1.18,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: Platform.OS !== "web",
        }),
      ]),
      Animated.parallel([
        Animated.timing(forwardArrowHintX, {
          toValue: 0,
          duration: 380,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: Platform.OS !== "web",
        }),
        Animated.timing(forwardArrowHintScale, {
          toValue: 1,
          duration: 380,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: Platform.OS !== "web",
        }),
      ]),
    ]).start();
  }, [forwardArrowHintScale, forwardArrowHintX]);

  useEffect(() => {
    if (forwardArrowReadinessRef.current.step !== step) {
      forwardArrowReadinessRef.current = {
        ready: shouldShowForwardArrowHint,
        step,
      };
      resetForwardArrowHint();
      return;
    }

    if (!shouldShowForwardArrowHint) {
      forwardArrowReadinessRef.current.ready = false;
      resetForwardArrowHint();
      return;
    }

    if (forwardArrowReadinessRef.current.ready) return;

    forwardArrowReadinessRef.current.ready = true;
    playForwardArrowHint();
  }, [
    playForwardArrowHint,
    resetForwardArrowHint,
    shouldShowForwardArrowHint,
    step,
  ]);

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

  const locationSummaryLines = useMemo(
    () => buildLocationSummaryLines(approximateLocation, coords, generalTexts),
    [approximateLocation, coords, generalTexts],
  );

  const generatedSummary = useMemo(() => {
    return buildRescueShareMessage({
      animalStateLabel: displayLabel(selectedAnimalStateLabel),
      animalTypeLabel: displayLabel(selectedAnimalLabel),
      animalPositionLabel: animalPosition ? displayLabel(selectedAnimalPositionLabel) : null,
      animalEnvironmentLabel: animalEnvironment
        ? displayLabel(selectedAnimalEnvironmentLabel)
        : null,
      animalPlaceLabel:
        !animalPosition && !animalEnvironment && animalPlace
          ? displayLabel(selectedAnimalPlaceLabel)
          : null,
      observedSigns: selectedFlagLabels.map(displayLabel),
      locationLines: locationSummaryLines.map((line) => line.text),
      hasPhoto: Boolean(photoUri),
      hasVideo: Boolean(videoUri),
    }, locale);
  }, [
    locale,
    displayLabel,
    locationSummaryLines,
    animalEnvironment,
    animalPlace,
    animalPosition,
    photoUri,
    selectedAnimalEnvironmentLabel,
    selectedAnimalLabel,
    selectedAnimalPlaceLabel,
    selectedAnimalPositionLabel,
    selectedAnimalStateLabel,
    selectedFlagLabels,
    videoUri,
  ]);

  const saveToGallery = async (uri: string, label: string) => {
    try {
      const permission = await MediaLibrary.requestPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          generalTexts.assistantCaptureUi.galleryPermissionTitle,
          `${generalTexts.assistantCaptureUi.galleryPermissionPrefix}${label}${generalTexts.assistantCaptureUi.galleryPermissionSuffix}`,
        );
        return;
      }

      await MediaLibrary.saveToLibraryAsync(uri);
    } catch {
      Alert.alert(
        generalTexts.assistantCaptureUi.galleryErrorTitle,
        `${generalTexts.assistantCaptureUi.galleryErrorPrefix}${label}${generalTexts.assistantCaptureUi.galleryErrorSuffix}`,
      );
    }
  };

  const pickPhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        t("assistantUi", "permissionRequired"),
        t("assistantUi", "photoPermissionMessage"),
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

      await saveToGallery(uri, generalTexts.assistantCaptureUi.photoObject);
    }
  };

  const pickVideo = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        t("assistantUi", "permissionRequired"),
        t("assistantUi", "videoPermissionMessage"),
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

      await saveToGallery(uri, generalTexts.assistantCaptureUi.videoObject);
    }
  };

  const captureLocation = async () => {
    try {
      setLocationLoading(true);

      const permission = await Location.requestForegroundPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          generalTexts.assistantCaptureUi.locationPermissionTitle,
          generalTexts.assistantCaptureUi.locationPermissionMessage,
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
      setLocationValue({ kind: "text", text: newLocationText });
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
        generalTexts.assistantCaptureUi.locationErrorTitle,
        generalTexts.assistantCaptureUi.locationErrorMessage,
      );
    } finally {
      setLocationLoading(false);
    }
  };

  const incompatibleWithNormalAppearance: (keyof FlagsState)[] = [
    "bleeding",
    "catDog",
    "canNotMove",
    "roadRisk",
    "trapped",
    "cannotFly",
    "weakness",
    "breathing",
    "stranded",
    "fishingLineHook",
    "moreAnimals",
    "peopleDogsNearby",
    "restingOnLand",
    "other",
  ];

  const toggleFlag = (key: keyof FlagsState) => {
    if (
      key === "cannotFly" &&
      !flags.cannotFly &&
      !canUseCannotFly(animalType)
    ) {
      Alert.alert(
        t("assistantUi", "reviewAnimalTitle"),
        t("assistantUi", "cannotFlyWarning"),
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
        t("assistantUi", "incompatibleSituationTitle"),
        t("assistantUi", "incompatibleFlightWarning"),
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
        t("assistantUi", "invalidNumberTitle"),
        t("assistantUi", "invalidNumberMessage"),
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
      t("assistantUi", "whatsAppErrorTitle"),
      t("assistantUi", "whatsAppErrorMessage"),
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
    showMessage(t("assistantUi", "summaryCopiedTitle"), t("assistantUi", "summaryCopiedMessage"));
  };

const saveCurrentProgress = async (
  nextStep: Step = step,
  overrides: Partial<
    Pick<
      RescueCase,
      | "animalState"
      | "animalType"
      | "animalPlace"
      | "animalPosition"
      | "animalEnvironment"
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
      animalPlace,
      animalPosition,
      animalEnvironment,
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
        animalPlace,
        animalPosition,
        animalEnvironment,
        flags,
        locationText,
        approximateLocation,
        coords,
        locationCaptured,
      },
      currentCaseRef.current,
    );

    router.replace(homePath);
  };

  const finishFlow = () => {
    const confirmationMessage =
      t("assistantUi", "finishConfirmation");

    const thankYouMessage = t("assistantUi", "thankYouMessage");

    if (Platform.OS === "web") {
      const confirmed = window.confirm(confirmationMessage);

      if (confirmed) {
        window.alert(thankYouMessage);
        void completeAndReturnHome();
      }

      return;
    }

    Alert.alert(t("assistantUi", "finishNoticeTitle"), confirmationMessage, [
      {
        text: t("assistantUi", "no"),
        style: "cancel",
      },
      {
        text: t("assistantUi", "yes"),
        onPress: () => {
          Alert.alert(t("assistantUi", "thankYouTitle"), thankYouMessage, [
            {
              text: t("assistantUi", "accept"),
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

    const addGuardEntry = () => {
      window.history.pushState({ sosFaunaBackGuard: true }, "", backNavigationRef.current.url);
    };

    const guardTimer = window.setTimeout(addGuardEntry, 0);

    const handlePopState = () => {
      if (allowNavigation) return;

      if (!shouldConfirmExitRef.current) {
        allowNavigation = true;
        router.replace(backNavigationRef.current.homePath);
        return;
      }

      const confirmed = window.confirm(
        backNavigationRef.current.t("assistantUi", "exitConfirmation"),
      );

      if (confirmed) {
        allowNavigation = true;

        void (async () => {
          await saveCurrentProgressRef.current();
          router.replace(backNavigationRef.current.homePath);
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

  const renderRecoveryCenters = () => (
    <RecoveryCentersContent
      provinceSearch={provinceSearch}
      selectedProvince={selectedProvince}
      showHelpSources={showHelpSources}
      showProvinceList={showProvinces}
      onProvinceSearchChange={setProvinceSearch}
      onSelectedProvinceChange={setSelectedProvince}
      onShowHelpSourcesChange={setShowHelpSources}
      onShowProvinceListChange={(value) => {
        setShowProvinces(value);
        setShowContacts(!value);
        if (!value) {
          setSelectedProvince(null);
        }
      }}
    />
  );

  const renderWhatsAppConfirmation = () => (
    <SectionCard title={t("assistantUi", "sendConfirmationTitle")}>
      <View style={styles.sectionContent}>
        <Text style={styles.sectionDescription}>
          {t("assistantUi", "sendConfirmationQuestion")}
        </Text>

        <Pressable style={styles.primaryButton} onPress={finishFlow}>
          <Text style={styles.primaryButtonText}>{t("assistantUi", "finishAfterSending")}</Text>
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          onPress={() => {
            setShowWhatsAppConfirmation(false);
            openWhatsAppWithNumber(lastWhatsAppNumber);
          }}
        >
          <Text style={styles.secondaryButtonText}>{t("assistantUi", "returnToWhatsApp")}</Text>
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          onPress={() => setShowWhatsAppConfirmation(false)}
        >
          <Text style={styles.secondaryButtonText}>{t("assistantUi", "returnToOptions")}</Text>
        </Pressable>
      </View>
    </SectionCard>
  );

  const renderEmptyStep3Confirmation = () => (
    <SectionCard title={t("assistantUi", "emptyInformationTitle")}>
      <View style={styles.sectionContent}>
        <Text style={styles.sectionDescription}>
          {t("assistantUi", "emptyInformationQuestion")}
        </Text>

        <Pressable
          style={styles.secondaryButton}
          onPress={() => setShowEmptyStep3Confirmation(false)}
        >
          <Text style={styles.secondaryButtonText}>
            {t("assistantUi", "returnAndAddInformation")}
          </Text>
        </Pressable>

        <Pressable
          style={styles.primaryButton}
          onPress={() => {
            setShowEmptyStep3Confirmation(false);
            void advanceToNextStep();
          }}
        >
          <Text style={styles.primaryButtonText}>{t("assistantUi", "continueWithoutInformation")}</Text>
        </Pressable>
      </View>
    </SectionCard>
  );

  const renderWhatsAppOptions = () => (
    <SectionCard title={t("assistantUi", "sendTitle")}>
      <View style={styles.sectionContent}>
        <Text style={styles.sectionDescription}>
          {t("assistantUi", "sendIntro")}
        </Text>

        <View style={styles.sectionGroup}>
          <Pressable
            style={styles.primaryButton}
            onPress={() => openWhatsAppWithNumber(GREFA_WHATSAPP)}
          >
            <Text style={styles.primaryButtonText}>{t("assistantUi", "sendToGrefa")}</Text>
          </Pressable>

          <View style={styles.warningBox}>
            <Text style={styles.warningText}>
              {t("assistantUi", "madridOnlyNotice")}
            </Text>
          </View>
        </View>

        <Pressable
          style={[styles.secondaryButton, styles.sendOtherContactButton]}
          onPress={() => setShowOtherContact((current) => !current)}
        >
          <Text style={styles.secondaryButtonText}>{t("assistantUi", "sendToOtherContact")}</Text>
        </Pressable>

        {showOtherContact ? (
          <>
            <TextInput
              placeholder={t("assistantUi", "otherContactPlaceholder")}
              value={customWhatsAppNumber}
              onChangeText={setCustomWhatsAppNumber}
              keyboardType="phone-pad"
              style={styles.input}
            />

            <Pressable
              style={styles.secondaryButton}
              onPress={() => openWhatsAppWithNumber(customWhatsAppNumber)}
            >
              <Text style={styles.secondaryButtonText}>{t("assistantUi", "sendViaWhatsApp")}</Text>
            </Pressable>
          </>
        ) : null}

        <View style={[styles.warningBox, styles.sendPhotoNotice]}>
          <Text style={styles.warningText}>
            {t("assistantUi", "attachmentsNotice")}
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
          <Text style={styles.primaryButtonText}>{t("assistantUi", "finish")}</Text>
        </Pressable>
      </View>
    </SectionCard>
  );

  const renderSummaryPreview = () => (
    <View style={[styles.summaryBox, styles.summaryPreview]}>
      <Text style={styles.summaryPreviewTitle}>{generalTexts.summaryPreview.title}</Text>

      <View style={styles.summaryPreviewSection}>
        <Text style={styles.summaryPreviewLabel}>{generalTexts.summaryPreview.animal}</Text>
        <Text style={styles.summaryPreviewValue}>{displayLabel(selectedAnimalLabel)}</Text>
      </View>

      <View style={styles.summaryPreviewSection}>
        <Text style={styles.summaryPreviewLabel}>{generalTexts.summaryPreview.state}</Text>
        <Text style={styles.summaryPreviewValue}>
          {displayLabel(selectedAnimalStateLabel)}
        </Text>
      </View>

      {animalPosition ? (
        <View style={styles.summaryPreviewSection}>
          <Text style={styles.summaryPreviewLabel}>{generalTexts.summaryPreview.position}</Text>
          <Text style={styles.summaryPreviewValue}>
            {displayLabel(selectedAnimalPositionLabel)}
          </Text>
        </View>
      ) : null}

      {animalEnvironment ? (
        <View style={styles.summaryPreviewSection}>
          <Text style={styles.summaryPreviewLabel}>{generalTexts.summaryPreview.environment}</Text>
          <Text style={styles.summaryPreviewValue}>
            {displayLabel(selectedAnimalEnvironmentLabel)}
          </Text>
        </View>
      ) : null}

      {!animalPosition && !animalEnvironment && animalPlace ? (
        <View style={styles.summaryPreviewSection}>
          <Text style={styles.summaryPreviewLabel}>{generalTexts.summaryPreview.legacyPlace}</Text>
          <Text style={styles.summaryPreviewValue}>
            {displayLabel(selectedAnimalPlaceLabel)}
          </Text>
        </View>
      ) : null}

      <View style={styles.summaryPreviewSection}>
        <Text style={styles.summaryPreviewLabel}>{generalTexts.summaryPreview.observedSituation}</Text>
        {selectedFlagLabels.length > 0 ? (
          <View style={styles.summaryPreviewList}>
            {selectedFlagLabels.map((label) => (
              <Text key={label} style={styles.summaryPreviewListItem}>
                • {displayLabel(label)}
              </Text>
            ))}
          </View>
        ) : (
          <Text style={styles.summaryPreviewValue}>{generalTexts.summaryPreview.noFlags}</Text>
        )}
      </View>

      <View style={styles.summaryPreviewSection}>
        <Text style={styles.summaryPreviewLabel}>{generalTexts.summaryPreview.location}</Text>
        {locationSummaryLines.length > 0 ? (
          <View style={styles.summaryPreviewList}>
            {locationSummaryLines.map((entry) => {
              const line = entry.text;
              const displayLine = entry.kind === "map"
                ? generalTexts.summaryPreview.mapIncluded
                : line;

              return (
                <Text key={line} style={styles.summaryPreviewValue}>
                  {displayLine}
                </Text>
              );
            })}
          </View>
        ) : (
          <Text style={styles.summaryPreviewValue}>{generalTexts.summaryPreview.no}</Text>
        )}
      </View>

      <View style={styles.summaryPreviewMetaRow}>
        <View style={styles.summaryPreviewMetaItem}>
          <Text style={styles.summaryPreviewLabel}>{generalTexts.summaryPreview.photo}</Text>
          <Text style={styles.summaryPreviewValue}>
            {photoUri ? generalTexts.summaryPreview.yes : generalTexts.summaryPreview.no}
          </Text>
        </View>

        <View style={styles.summaryPreviewMetaItem}>
          <Text style={styles.summaryPreviewLabel}>{generalTexts.summaryPreview.video}</Text>
          <Text style={styles.summaryPreviewValue}>
            {videoUri ? generalTexts.summaryPreview.yes : generalTexts.summaryPreview.no}
          </Text>
        </View>
      </View>
    </View>
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
          <Text style={styles.menuActionLabel}>{t("assistantUi", "copy")}</Text>
        </Pressable>

        <Pressable style={styles.menuActionButton} onPress={handleOpenHelp}>
          <Text style={styles.menuActionEmoji}>📞</Text>
          <Text style={styles.menuActionLabel}>{t("assistantUi", "help")}</Text>
        </Pressable>

        <Pressable
          style={[styles.menuActionButton, styles.menuActionButtonPrimarySoft]}
          onPress={finishFlow}
        >
          <Text style={styles.menuActionEmoji}>✅</Text>
          <Text style={styles.menuActionLabelPrimary}>{t("assistantUi", "finish")}</Text>
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
            accessibilityLabel={t("assistantUi", "back")}
            style={styles.sideArrowLeft}
            onPress={goBack}
          >
            <Text style={styles.sideArrowText}>‹</Text>
          </Pressable>
        ) : null}

        {canShowForwardArrow ? (
          <AnimatedPressable
            accessibilityRole="button"
            accessibilityLabel={t("assistantUi", "continue")}
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
    if (showContacts || showProvinces || selectedProvince) {
      return renderRecoveryCenters();
    }
    if (showWhatsAppConfirmation) return renderWhatsAppConfirmation();
    if (showWhatsAppOptions) return renderWhatsAppOptions();

    if (step === 1) {
      return (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoid}
          keyboardVerticalOffset={90}
        >
          <SectionCard title={t("assistantUi", "step1Title")}>
            <View style={styles.sectionContent}>
              <Text style={styles.sectionDescription}>
                {t("assistantUi", "step1Intro")}
              </Text>

              <View style={styles.sectionGroup}>
                <Text style={styles.subheading}>{t("assistantUi", "animalStateQuestion")}</Text>
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
                          {displayLabel(option.label)}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              <>
                  <View style={styles.sectionGroup}>
                    <Text style={styles.subheading}>{t("assistantUi", "animalTypeQuestion")}</Text>
                    {ANIMAL_OPTION_GROUPS.map((group) => (
                      <View
                        key={displayLabel(group.title)}
                        style={[
                          styles.optionGroup,
                          group.kind === "terrestrial" &&
                            styles.optionGroupTerrestrial,
                          group.kind === "marine" && styles.optionGroupMarine,
                        ]}
                      >
                        <Text
                          style={[
                            styles.optionGroupLabel,
                            group.kind === "terrestrial" &&
                              styles.optionGroupLabelTerrestrial,
                            group.kind === "marine" &&
                              styles.optionGroupLabelMarine,
                          ]}
                        >
                          {displayLabel(group.title)}
                        </Text>
                        <View style={styles.flagGrid}>
                          {group.options.map((option) => {
                            const active = animalType === option.key;

                            return (
                              <Pressable
                                key={option.key}
                                style={[
                                  styles.flag,
                                  styles.optionGroupFlag,
                                  shouldUseFullWidthFlag(option.label) &&
                                    styles.flagFullWidthNarrow,
                                  active && styles.flagActive,
                                ]}
                                onPress={() => selectAnimalType(option.key)}
                              >
                                <Text
                                  style={[
                                    styles.flagText,
                                    styles.optionGroupFlagText,
                                    active && styles.flagTextActive,
                                  ]}
                                >
                                  {displayLabel(option.label)}
                                </Text>
                              </Pressable>
                            );
                          })}
                        </View>
                      </View>
                    ))}
                    <View style={styles.unknownAnimalRow}>
                      <Pressable
                        style={[
                          styles.flag,
                          animalType === UNKNOWN_ANIMAL_OPTION.key &&
                            styles.flagActive,
                        ]}
                        onPress={() => selectAnimalType(UNKNOWN_ANIMAL_OPTION.key)}
                      >
                        <Text
                          style={[
                            styles.flagText,
                            animalType === UNKNOWN_ANIMAL_OPTION.key &&
                              styles.flagTextActive,
                          ]}
                        >
                          🔍 {displayLabel(UNKNOWN_ANIMAL_OPTION.label)}
                        </Text>
                      </Pressable>
                    </View>
                  </View>

                  {animalState !== "dead" ? (
                  <View style={styles.sectionGroup}>
                    <Text style={styles.subheading}>{t("assistantUi", "observedSignsQuestion")}</Text>
                    <View style={styles.flagGrid}>
                      {visibleFlagLabels.map(({ key, label }) => {
                        const active = flags[key];

                        return (
                          <Pressable
                            key={key}
                            style={[
                              styles.flag,
                              shouldUseFullWidthFlag(label) &&
                                styles.flagFullWidthNarrow,
                              active && styles.flagActive,
                            ]}
                            onPress={() => toggleFlag(key)}
                          >
                            <Text
                              style={[
                                styles.flagText,
                                active && styles.flagTextActive,
                              ]}
                            >
                              {displayLabel(label)}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  </View>
                  ) : null}

                  <View style={styles.sectionGroup}>
                    <Text style={styles.subheading}>{t("assistantUi", "positionQuestion")}</Text>
                    <View style={styles.flagGrid}>
                      {visiblePositionOptions.map((option) => {
                        const active = animalPosition === option.key;

                        return (
                          <Pressable
                            key={option.key}
                            style={[
                              styles.flag,
                              shouldUseFullWidthFlag(option.label) &&
                                styles.flagFullWidthNarrow,
                              active && styles.flagActive,
                            ]}
                            onPress={() => setAnimalPosition(option.key)}
                          >
                            <Text
                              style={[
                                styles.flagText,
                                active && styles.flagTextActive,
                              ]}
                            >
                              {displayLabel(option.label)}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  </View>

                  <View style={styles.sectionGroup}>
                    <Text style={styles.subheading}>{t("assistantUi", "environmentQuestion")}</Text>
                    <View style={styles.flagGrid}>
                      {visibleEnvironmentOptions.map((option) => {
                        const active = animalEnvironment === option.key;

                        return (
                          <Pressable
                            key={option.key}
                            style={[
                              styles.flag,
                              shouldUseFullWidthFlag(option.label) &&
                                styles.flagFullWidthNarrow,
                              active && styles.flagActive,
                            ]}
                            onPress={() => setAnimalEnvironment(option.key)}
                          >
                            <Text
                              style={[
                                styles.flagText,
                                active && styles.flagTextActive,
                              ]}
                            >
                              {displayLabel(option.label)}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  </View>
                </>
            </View>
          </SectionCard>
        </KeyboardAvoidingView>
      );
    }

    if (step === 2) {
      return (
        <SectionCard title={t("assistantUi", "step2Title")}>
          <View style={styles.sectionContent}>
            <Text style={styles.sectionDescription}>
              {t("assistantUi", "step2Intro")}
            </Text>

            <View style={styles.speechControlRow}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={
                  isSpeaking
                    ? t("assistantUi", "stopSpeechLabel")
                    : t("assistantUi", "startSpeechLabel")
                }
                style={styles.speechButton}
                onPress={toggleAdviceSpeech}
              >
                <Text style={styles.speechButtonText}>
                  {isSpeaking
                    ? t("assistantUi", "stopSpeech")
                    : t("assistantUi", "startSpeech")}
                </Text>
              </Pressable>

              {isSpeaking ? (
                <Text style={styles.speechStatusText}>
                  {t("assistantUi", "speechStatus")}
                </Text>
              ) : null}
            </View>

            <Text
              style={[
                styles.summaryBox,
                styles.adviceBox,
                isMobileAdviceText && styles.adviceBoxMobile,
              ]}
            >
              {advice}
            </Text>
          </View>
        </SectionCard>
      );
    }

    if (step === 3) {
      return (
        <SectionCard title={t("assistantUi", "step3Title")}>
          <View style={styles.sectionContent}>
            <Text style={styles.sectionDescription}>
              {t("assistantUi", "step3Intro")}
            </Text>

            <Text style={styles.sectionDescription}>
              {t("assistantUi", "informationHelp")}
            </Text>

            <Text style={styles.subheading}>{t("assistantUi", "contributionQuestion")}</Text>

            <Pressable style={styles.primaryButton} onPress={pickPhoto}>
              <Text style={styles.primaryButtonText}>
                {photoUri ? t("assistantUi", "repeatPhoto") : t("assistantUi", "takePhoto")}
              </Text>
            </Pressable>

            <Pressable style={styles.primaryButton} onPress={pickVideo}>
              <Text style={styles.primaryButtonText}>
                {videoUri ? t("assistantUi", "repeatVideo") : t("assistantUi", "recordVideo")}
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
                  ? generalTexts.assistantCaptureUi.capturing
                  : generalTexts.assistantCaptureUi.capture}
              </Text>
            </Pressable>

            <View style={styles.sectionGroup}>
              <Text style={styles.subheading}>{t("assistantUi", "informationStatus")}</Text>
              <Text style={styles.helperText}>
                {photoUri ? t("assistantUi", "photoAdded") : t("assistantUi", "photoMissing")}
              </Text>
              <Text style={styles.helperText}>
                {videoUri ? t("assistantUi", "videoAdded") : t("assistantUi", "videoMissing")}
              </Text>
              <Text style={styles.helperText}>
                {locationCaptured
                  ? generalTexts.assistantCaptureUi.capturedStatus
                  : generalTexts.assistantCaptureUi.notCapturedStatus}
              </Text>
            </View>

            <View style={styles.mapCard}>
              <Text style={styles.mapTitle}>{generalTexts.assistantCaptureUi.mapTitle}</Text>

              {coords ? (
                <>
                  <View style={styles.mapLocationBox}>
                    <Text style={styles.mapLocationTitle}>{generalTexts.assistantCaptureUi.mapCapturedTitle}</Text>

                    {approximateLocation ? (
                      <>
                        <Text style={styles.mapLocationLabel}>{generalTexts.assistantCaptureUi.mapReference}</Text>
                        <Text style={styles.mapLocationText}>
                          {approximateLocation}
                        </Text>
                      </>
                    ) : null}

                    <Text style={styles.mapLocationLabel}>{generalTexts.assistantCaptureUi.mapCoordinates}</Text>
                    <Text style={styles.mapCoords}>
                      {formatCoordinates(coords)}
                    </Text>
                    <Text style={styles.mapEmptyText}>{generalTexts.assistantCaptureUi.mapAccuracyNotice}</Text>
                    <Text style={styles.mapEmptyText}>{generalTexts.assistantCaptureUi.mapOpenNotice}</Text>
                  </View>

                  <Pressable style={styles.mapOpenButton} onPress={openMaps}>
                    <Text style={styles.mapOpenButtonText}>{generalTexts.assistantCaptureUi.mapOpenButton}</Text>
                  </Pressable>
                </>
              ) : (
                <View style={styles.mapEmptyBox}>
                  <Text style={styles.mapEmptyText}>{generalTexts.assistantCaptureUi.mapEmpty}</Text>
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
          <SectionCard title={t("assistantUi", "step4Title")}>
            <View style={styles.sectionContent}>
              <Text style={styles.sectionDescription}>
                {generalTexts.assistantExtraUi.deadSummaryIntro}
              </Text>

              {renderSummaryPreview()}

              <View style={styles.warningBox}>
                <Text style={styles.warningText}>
                  {generalTexts.assistantExtraUi.deadSummaryWarning}
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
        <SectionCard title={t("assistantUi", "step4Title")}>
          <View style={styles.sectionContent}>
            <View style={styles.summaryInstructions}>
              <Text style={styles.bulletText}>{generalTexts.summaryInstructions.review}</Text>
              <Text style={styles.bulletText}>{generalTexts.summaryInstructions.whatsappPrefix}<Text style={styles.bulletStrong}>{generalTexts.summaryInstructions.whatsappName}</Text>{generalTexts.summaryInstructions.whatsappSuffix}</Text>
              <Text style={styles.bulletText}>{generalTexts.summaryInstructions.copyPrefix}<Text style={styles.bulletStrong}>{generalTexts.summaryInstructions.copyName}</Text>{generalTexts.summaryInstructions.copySuffix}</Text>
              <Text style={styles.bulletText}>{generalTexts.summaryInstructions.helpPrefix}<Text style={styles.bulletStrong}>{generalTexts.summaryInstructions.helpName}</Text>{generalTexts.summaryInstructions.helpSuffix}</Text>
              <Text style={styles.bulletText}>{generalTexts.summaryInstructions.finishPrefix}<Text style={styles.bulletStrong}>{generalTexts.summaryInstructions.finishName}</Text>{generalTexts.summaryInstructions.finishSuffix}</Text>
            </View>

            {renderSummaryPreview()}
          </View>
        </SectionCard>
      </KeyboardAvoidingView>
    );
  };

  return (
    <SafeAreaView style={styles.screen} edges={["bottom"]}>
      <Stack.Screen
        options={{
          title: generalTexts.assistantExtraUi.navigationTitle,
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
  adviceBoxMobile: {
    fontSize: 16,
    lineHeight: 24,
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
  speechControlRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 10,
  },
  speechButton: {
    minHeight: 46,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "#e5e7eb",
    borderWidth: 1,
    borderColor: "#d1d5db",
    alignItems: "center",
    justifyContent: "center",
  },
  speechButtonText: {
    color: "#111827",
    fontWeight: "800",
    fontSize: 15,
    textAlign: "center",
  },
  speechStatusText: {
    color: "#4b5563",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18,
  },
  disabledButton: {
    opacity: 0.6,
  },
  helperText: {
    color: "#4b5563",
    fontSize: 13,
    lineHeight: 18,
  },
  optionGroup: {
    borderWidth: 1,
    borderRadius: 12,
    gap: 9,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  optionGroupTerrestrial: {
    backgroundColor: "#f4fbf5",
    borderColor: "#d7eadb",
  },
  optionGroupMarine: {
    backgroundColor: "#f3f8fb",
    borderColor: "#d5e7f0",
  },
  optionGroupLabel: {
    color: "#4b5563",
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  optionGroupLabelTerrestrial: {
    color: "#166534",
  },
  optionGroupLabelMarine: {
    color: "#1e6091",
  },
  optionGroupFlag: {
    maxWidth: "100%",
  },
  optionGroupFlagText: {
    flexShrink: 1,
  },
  unknownAnimalRow: {
    alignItems: "flex-start",
    marginTop: 2,
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
    maxWidth: "100%",
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
    flexShrink: 1,
    fontWeight: "600",
  },
  flagFullWidthNarrow: {
    flexBasis: "100%",
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
  summaryPreview: {
    gap: 14,
    borderColor: "#b7dfc0",
    backgroundColor: "#fbfdfb",
  },
  summaryPreviewTitle: {
    color: "#14532d",
    fontSize: 15,
    fontWeight: "900",
    lineHeight: 21,
  },
  summaryPreviewSection: {
    gap: 4,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 12,
  },
  summaryPreviewLabel: {
    color: "#6b7280",
    fontSize: 13,
    fontWeight: "800",
    lineHeight: 18,
  },
  summaryPreviewValue: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "800",
    lineHeight: 23,
  },
  summaryPreviewList: {
    gap: 4,
  },
  summaryPreviewListItem: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "800",
    lineHeight: 24,
  },
  summaryPreviewMetaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 12,
  },
  summaryPreviewMetaItem: {
    flexGrow: 1,
    flexBasis: 140,
    gap: 4,
    backgroundColor: "#eef8f0",
    borderWidth: 1,
    borderColor: "#dbe7dd",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
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
