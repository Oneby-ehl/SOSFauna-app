import type { Catalog } from "../translate";

// Presentation only: persisted report codes and location data remain unchanged.
export const historyEn = {
  historyUi: {
    deleteButton: "Delete report",
    cancel: "Cancel",
    deleteTitle: "Delete report",
    deleteMessage: "This report will be deleted from the history on this device.",
    deleteConfirm: "Delete",
    clearTitle: "Delete all history?",
    clearMessage: "All completed reports saved on this device will be permanently deleted.",
    clearConfirm: "Delete history",
    navigationTitle: "My reports",
    heading: "My reports",
    description: "History of completed reports saved on this device",
    back: "Back",
    loading: "Loading reports…",
    emptyTitle: "No reports saved yet",
    emptyDescription: "Reports will appear here when you complete the assisted guide.",
    home: "Back to the home page",
    clearButton: "Clear all history",
  },
  historyAnimalLabels: {
    smallBird: "Small bird", largeBird: "Medium-sized / large bird", bat: "Bat",
    smallMammal: "Small mammal", largeMammal: "Large mammal", reptileAmphibian: "Reptile or amphibian",
    dolphin: "Dolphin", largeCetacean: "Whale / large cetacean", seal: "Seal", seaTurtle: "Sea turtle",
    sharkRay: "Shark / ray", otherMarine: "Other marine animal", unknown: "Unidentified animal",
  },
  historyStateLabels: { alive: "Alive", dead: "Dead" },
  historyPlaceLabels: {
    ground: "On the ground", treeOrBush: "In a tree or bush", buildingOrRoof: "On a building or roof",
    roadOrStreet: "On a road or street", parkOrGarden: "In a park or garden",
    fieldOrNatural: "In the countryside or a natural setting", industrialArea: "In an industrial area",
    water: "In the water", otherPlace: "Somewhere else",
  },
  historyPositionLabels: {
    ground: "On the ground", treeOrBush: "In a tree or bush", buildingOrRoof: "On a building or roof",
    water: "In the water", beachSand: "On sand / a beach", shoreShallowWater: "At the water’s edge / in shallow water",
    rocksBreakwater: "On rocks / a breakwater", portDock: "In a harbour / on a quay", onBoat: "On a boat",
    otherPlace: "Somewhere else",
  },
  historyEnvironmentLabels: {
    roadOrStreet: "On a road or street", parkOrGarden: "In a park or garden",
    fieldOrNatural: "In the countryside or a natural setting", industrialArea: "In an industrial area",
    urbanArea: "In an urban area", coastBeach: "On the coast / a beach", rockyCoastCliff: "Rocky area / cliff",
    portMarina: "In a harbour / marina", openSea: "In the open sea", estuaryMouth: "River mouth / estuary",
    otherEnvironment: "Other surroundings",
  },
  historyFlagLabels: {
    bleeding: "Injured", baby: "It is a young animal", catDog: "It has been attacked by a cat or dog",
    canNotMove: "It cannot move", roadRisk: "It is near a road", ringGps: "It has a tag or tracking device",
    trapped: "It is trapped", cannotFly: "It cannot fly", weakness: "It shows signs of weakness",
    normalAppearance: "It appears normal", breathing: "It is having difficulty breathing",
    stranded: "It is stranded or out of the water", fishingLineHook: "It has fishing line, a hook or fishing gear attached",
    moreAnimals: "Other animals are affected", peopleDogsNearby: "There are people or dogs nearby",
    restingOnLand: "It is resting on land", other: "There is another issue",
  },
  summaryHistory: {
    dateUnavailable: "Date unavailable", noIncidents: "No notable issues.", datePrefix: "Report date: ",
    position: "Position", environment: "Surroundings", legacyPlace: "Where the animal is", situation: "Situation",
    copySummary: "Copy summary", clipboardWeb: "Summary copied to the clipboard.",
    clipboardTitle: "Summary copied", clipboardMessage: "The report summary has been copied.",
  },
} satisfies Pick<Catalog, "historyUi" | "historyAnimalLabels" | "historyStateLabels" |
  "historyPlaceLabels" | "historyPositionLabels" | "historyEnvironmentLabels" |
  "historyFlagLabels" | "summaryHistory">;
