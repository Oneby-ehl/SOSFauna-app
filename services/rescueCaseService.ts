import type {
  RescueAnimalState,
  RescueAnimalType,
  RescueCase,
  RescueCoordinates,
  RescueFlags,
  RescueStep,
} from "@/types/rescueCase";

import {
  clearCurrentCase,
  loadCurrentCase,
  saveCompletedCase,
  saveCurrentCase,
} from "@/services/rescueStorage";

type RescueCaseData = {
  step: RescueStep;
  animalState: RescueAnimalState;
  animalType: RescueAnimalType;
  flags: RescueFlags;
  locationText: string;
  approximateLocation?: string;
  coords: RescueCoordinates | null;
  locationCaptured: boolean;
};

function generateCaseId(): string {
  return `rescue-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function createRescueCase(
  data: RescueCaseData,
  existingCase?: RescueCase | null,
): RescueCase {
  const now = new Date().toISOString();

  return {
    id: existingCase?.id ?? generateCaseId(),
    createdAt: existingCase?.createdAt ?? now,
    updatedAt: now,
    completedAt: existingCase?.completedAt ?? null,
    ...data,
  };
}

export async function persistCurrentCase(
  data: RescueCaseData,
  existingCase?: RescueCase | null,
): Promise<RescueCase> {
  const rescueCase = createRescueCase(data, existingCase);

  await saveCurrentCase(rescueCase);

  return rescueCase;
}

export async function recoverCurrentCase(): Promise<RescueCase | null> {
  return loadCurrentCase();
}

export async function discardCurrentCase(): Promise<void> {
  await clearCurrentCase();
}

export async function completeCurrentCase(
  data: RescueCaseData,
  existingCase?: RescueCase | null,
): Promise<RescueCase> {
  const rescueCase = createRescueCase(data, existingCase);

  const completedCase: RescueCase = {
    ...rescueCase,
    completedAt: new Date().toISOString(),
  };

  await saveCompletedCase(completedCase);
  await clearCurrentCase();

  return completedCase;
}
