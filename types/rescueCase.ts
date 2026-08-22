export type RescueAnimalState = "alive" | "dead";

export type RescueAnimalPlace =
  | "ground"
  | "treeOrBush"
  | "buildingOrRoof"
  | "roadOrStreet"
  | "parkOrGarden"
  | "fieldOrNatural"
  | "industrialArea"
  | "water"
  | "otherPlace";

export type RescueAnimalPosition =
  | "ground"
  | "treeOrBush"
  | "buildingOrRoof"
  | "water"
  | "beachSand"
  | "shoreShallowWater"
  | "rocksBreakwater"
  | "portDock"
  | "onBoat"
  | "otherPlace";

export type RescueAnimalEnvironment =
  | "roadOrStreet"
  | "parkOrGarden"
  | "fieldOrNatural"
  | "industrialArea"
  | "urbanArea"
  | "coastBeach"
  | "rockyCoastCliff"
  | "portMarina"
  | "openSea"
  | "estuaryMouth"
  | "otherEnvironment";

export type RescueAnimalType =
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

export type RescueFlags = {
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

export type RescueCoordinates = {
  latitude: number;
  longitude: number;
};

export type RescueStep = 1 | 2 | 3 | 4;

export type RescueCase = {
  id: string;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;

  step: RescueStep;

  animalState: RescueAnimalState;
  animalType: RescueAnimalType;
  animalPlace?: RescueAnimalPlace | null;
  animalPosition?: RescueAnimalPosition | null;
  animalEnvironment?: RescueAnimalEnvironment | null;
  flags: RescueFlags;

  locationText: string;
  approximateLocation?: string;
  coords: RescueCoordinates | null;
  locationCaptured: boolean;
};
