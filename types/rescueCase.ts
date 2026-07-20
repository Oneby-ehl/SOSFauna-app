export type RescueAnimalState = "alive" | "dead";

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

export type RescueStep = 1 | 2 | 3 | 4 | 5;

export type RescueCase = {
  id: string;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;

  step: RescueStep;

  fullName: string;
  phone: string;

  animalState: RescueAnimalState;
  animalType: RescueAnimalType;
  flags: RescueFlags;

  locationText: string;
  coords: RescueCoordinates | null;
  locationCaptured: boolean;
};