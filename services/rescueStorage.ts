import AsyncStorage from "@react-native-async-storage/async-storage";

import type { RescueCase } from "@/types/rescueCase";

const CURRENT_CASE_KEY = "@sos-fauna/current-case";
const HISTORY_KEY = "@sos-fauna/history";
const MAX_HISTORY_ITEMS = 30;

type StoredObject = Record<string, unknown>;

export class RescueStorageError extends Error {
  constructor(readonly reason: "read" | "write" | "incompatible" | "conflict") {
    // Never include stored content, coordinates or native error details here.
    super(`Local report storage: ${reason}`);
    this.name = "RescueStorageError";
  }
}

const animalTypes = new Set<RescueCase["animalType"]>([
  "smallBird", "largeBird", "bat", "smallMammal", "largeMammal",
  "reptileAmphibian", "dolphin", "largeCetacean", "seal", "seaTurtle",
  "sharkRay", "otherMarine", "unknown",
]);
const places = new Set<NonNullable<RescueCase["animalPlace"]>>([
  "ground", "treeOrBush", "buildingOrRoof", "roadOrStreet", "parkOrGarden",
  "fieldOrNatural", "industrialArea", "water", "otherPlace",
]);
const positions = new Set<NonNullable<RescueCase["animalPosition"]>>([
  "ground", "treeOrBush", "buildingOrRoof", "water", "beachSand",
  "shoreShallowWater", "rocksBreakwater", "portDock", "onBoat", "otherPlace",
]);
const environments = new Set<NonNullable<RescueCase["animalEnvironment"]>>([
  "roadOrStreet", "parkOrGarden", "fieldOrNatural", "industrialArea", "urbanArea",
  "coastBeach", "rockyCoastCliff", "portMarina", "openSea", "estuaryMouth",
  "otherEnvironment",
]);

function isObject(value: unknown): value is StoredObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isOptionalChoice(value: unknown, choices: ReadonlySet<string>): boolean {
  return value == null || (typeof value === "string" && choices.has(value));
}

function isCoordinates(value: unknown): boolean {
  return value == null || (isObject(value)
    && typeof value.latitude === "number" && Number.isFinite(value.latitude)
    && value.latitude >= -90 && value.latitude <= 90
    && typeof value.longitude === "number" && Number.isFinite(value.longitude)
    && value.longitude >= -180 && value.longitude <= 180);
}

function readCase(value: unknown): RescueCase | null {
  if (!isObject(value)
    || typeof value.id !== "string" || value.id.length === 0
    || typeof value.createdAt !== "string" || typeof value.updatedAt !== "string"
    || !(value.completedAt == null || typeof value.completedAt === "string")
    // Five is a real historical step. Keep it for normalizeInitialStep in the
    // assistant; converting it to four here would resume at the wrong step.
    || typeof value.step !== "number" || !Number.isInteger(value.step)
    || value.step < 1 || value.step > 5
    || !(value.animalState === "alive" || value.animalState === "dead")
    || typeof value.animalType !== "string"
    || !animalTypes.has(value.animalType as RescueCase["animalType"])
    || !isOptionalChoice(value.animalPlace, places)
    || !isOptionalChoice(value.animalPosition, positions)
    || !isOptionalChoice(value.animalEnvironment, environments)
    || !isObject(value.flags)
    // Old versions have fewer flags. Unknown boolean flags are retained, not
    // renamed or coerced; other values must not reach Object.values(flags).
    || !Object.values(value.flags).every((flag) => typeof flag === "boolean")
    || typeof value.locationText !== "string"
    || !(value.approximateLocation == null || typeof value.approximateLocation === "string")
    || !isCoordinates(value.coords)
    || !(value.locationCaptured === undefined || typeof value.locationCaptured === "boolean")) {
    return null;
  }

  // Fill only absent, historically optional values in memory. No read writes
  // these defaults back to storage; keep every unknown field and legacy flag.
  return {
    ...value,
    completedAt: value.completedAt ?? null,
    coords: value.coords ?? null,
    locationCaptured: value.locationCaptured ?? false,
  } as unknown as RescueCase;
}

async function readValue(key: string): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(key);
  } catch {
    throw new RescueStorageError("read");
  }
}

function parseValue(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    throw new RescueStorageError("incompatible");
  }
}

async function readCurrentCase(): Promise<RescueCase | null> {
  const stored = await readValue(CURRENT_CASE_KEY);
  if (stored === null) return null;
  const result = readCase(parseValue(stored));
  if (!result) throw new RescueStorageError("incompatible");
  return result;
}

export type HistoryReadResult = {
  cases: RescueCase[];
  hasIncompatibleEntries: boolean;
};

async function readHistory(): Promise<HistoryReadResult & { entries: unknown[] }> {
  const stored = await readValue(HISTORY_KEY);
  const entries: unknown = stored === null ? [] : parseValue(stored);
  if (!Array.isArray(entries)) throw new RescueStorageError("incompatible");
  const cases: RescueCase[] = [];
  const ids = new Set<string>();
  let hasIncompatibleEntries = false;
  for (const entry of entries) {
    const rescueCase = readCase(entry);
    if (!rescueCase || ids.has(rescueCase.id)) {
      hasIncompatibleEntries = true;
      continue;
    }
    ids.add(rescueCase.id);
    cases.push(rescueCase);
  }
  return { entries, cases, hasIncompatibleEntries };
}

function requireWritableHistory(result: HistoryReadResult): void {
  if (result.hasIncompatibleEntries) throw new RescueStorageError("incompatible");
}

function mergeCase(previous: RescueCase | null, next: RescueCase): RescueCase {
  return {
    ...previous,
    ...next,
    flags: { ...previous?.flags, ...next.flags },
    coords: next.coords == null ? null : { ...previous?.coords, ...next.coords },
  };
}

async function writeValue(key: string, value: unknown): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {
    throw new RescueStorageError("write");
  }
}

async function removeValue(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch {
    throw new RescueStorageError("write");
  }
}

// Serialize read/modify/write operations within this JS instance. AsyncStorage
// has no cross-tab compare-and-swap, so this is not a multi-tab transaction.
let pendingMutation: Promise<void> = Promise.resolve();
function mutate(operation: () => Promise<void>): Promise<void> {
  const result = pendingMutation.then(operation);
  pendingMutation = result.catch(() => {});
  return result;
}

export async function saveCurrentCase(
  rescueCase: RescueCase,
): Promise<void> {
  return mutate(async () => {
    if (!readCase(rescueCase)) throw new RescueStorageError("incompatible");
    // A failed or incompatible read must never be treated as an empty slot.
    const previous = await readCurrentCase();
    if (previous && previous.id !== rescueCase.id) throw new RescueStorageError("conflict");
    await writeValue(CURRENT_CASE_KEY, mergeCase(previous, rescueCase));
  });
}

export async function loadCurrentCase(): Promise<RescueCase | null> {
  return readCurrentCase();
}

export async function clearCurrentCase(expectedId?: string | null): Promise<void> {
  return mutate(async () => {
    const current = await readCurrentCase();
    if (expectedId !== undefined && (current?.id ?? null) !== expectedId) {
      throw new RescueStorageError("conflict");
    }
    if (current) await removeValue(CURRENT_CASE_KEY);
  });
}

export async function getHistory(): Promise<RescueCase[]> {
  return (await readHistory()).cases;
}

export async function getHistoryReadResult(): Promise<HistoryReadResult> {
  const { cases, hasIncompatibleEntries } = await readHistory();
  return { cases, hasIncompatibleEntries };
}

export async function saveCompletedCase(
  rescueCase: RescueCase,
): Promise<void> {
  return mutate(async () => {
    if (!readCase(rescueCase)) throw new RescueStorageError("incompatible");
    const history = await readHistory();
    requireWritableHistory(history);
    const previous = history.cases.find((item) => item.id === rescueCase.id) ?? null;
    const pending = await readCurrentCase();
    if (pending && pending.id !== rescueCase.id) throw new RescueStorageError("conflict");
    const completedCase: RescueCase = {
      ...mergeCase(previous, mergeCase(pending, rescueCase)),
      completedAt: rescueCase.completedAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const remaining = history.entries.filter((entry) => (entry as RescueCase).id !== completedCase.id);
    await writeValue(HISTORY_KEY, [completedCase, ...remaining].slice(0, MAX_HISTORY_ITEMS));
  });
}

export async function deleteHistoryItem(
  caseId: string,
): Promise<void> {
  return mutate(async () => {
    const history = await readHistory();
    requireWritableHistory(history);
    await writeValue(HISTORY_KEY, history.entries.filter((entry) => (entry as RescueCase).id !== caseId));
  });
}

export async function clearHistory(): Promise<void> {
  return mutate(async () => {
    requireWritableHistory(await readHistory());
    await removeValue(HISTORY_KEY);
  });
}
