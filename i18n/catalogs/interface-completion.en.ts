import type { Catalog } from "../translate";

// Display labels only. Persisted option codes and Spanish source copy are unchanged.
export const interfaceCompletionEn = {
  assistantPositionOptions: {
    ground: "On the ground",
    treeOrBush: "In a tree or bush",
    buildingOrRoof: "On a building or roof",
    water: "In the water",
    otherPlace: "Another place",
    beachSand: "On sand / a beach",
    shoreShallowWater: "At the shoreline / in shallow water",
    rocksBreakwater: "On rocks / a breakwater",
    portDock: "In a port / on a dock",
    rocksStonesBreakwater: "On rocks / stones / a breakwater",
    onBoat: "On a boat",
    beachShore: "On a beach / at the shoreline",
  },
  assistantEnvironmentOptions: {
    roadOrStreet: "On a road or street",
    parkOrGarden: "In a park or garden",
    fieldOrNatural: "In the countryside or a natural area",
    industrialArea: "In an industrial area",
    otherEnvironment: "Another environment",
    urbanArea: "In an urban area",
    coastBeach: "Coast / beach",
    portMarina: "Port / marina",
    openSea: "Open sea",
    estuaryMouth: "River mouth / estuary",
    rockyCoastCliff: "Rocky coast / cliff",
    coastBeachWithPreposition: "On the coast / a beach",
    portMarinaWithPreposition: "In a port / marina",
  },
  notFoundUi: {
    navigationTitle: "Page not found | SOS Fauna España",
    title: "Page not found",
    message: "The address you entered does not exist or is no longer available.",
    secondary: "You can return to the SOS Fauna España home page.",
    homeAccessibility: "Back to home",
    homeButton: "Back to home",
  },
} satisfies Pick<Catalog, "assistantPositionOptions" | "assistantEnvironmentOptions" | "notFoundUi">;
