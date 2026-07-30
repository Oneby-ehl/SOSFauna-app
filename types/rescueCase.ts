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
  | "otherPlace";

export type RescueAnimalEnvironment =
  | "roadOrStreet"
  | "parkOrGarden"
  | "fieldOrNatural"
  | "industrialArea"
  | "otherEnvironment";

export type RescueAnimalType =
  | "smallBird"
  | "largeBird"
  | "bat"
  | "smallMammal"
  | "largeMammal"
  | "reptileAmphibian"
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
