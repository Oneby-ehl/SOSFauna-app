import AsyncStorage from "@react-native-async-storage/async-storage";

import type { RescueCase } from "@/types/rescueCase";

const CURRENT_CASE_KEY = "@sos-fauna/current-case";
const HISTORY_KEY = "@sos-fauna/history";
const REMEMBERED_CONTACT_KEY = "@sos-fauna/remembered-contact";
const MAX_HISTORY_ITEMS = 30;

export type RememberedContact = {
  fullName: string;
  phone: string;
};

export async function saveCurrentCase(
  rescueCase: RescueCase,
): Promise<void> {
  await AsyncStorage.setItem(
    CURRENT_CASE_KEY,
    JSON.stringify(rescueCase),
  );
}

export async function loadCurrentCase(): Promise<RescueCase | null> {
  const storedValue = await AsyncStorage.getItem(CURRENT_CASE_KEY);

  if (!storedValue) {
    return null;
  }

  try {
    return JSON.parse(storedValue) as RescueCase;
  } catch {
    await AsyncStorage.removeItem(CURRENT_CASE_KEY);
    return null;
  }
}

export async function clearCurrentCase(): Promise<void> {
  await AsyncStorage.removeItem(CURRENT_CASE_KEY);
}

export async function getHistory(): Promise<RescueCase[]> {
  const storedValue = await AsyncStorage.getItem(HISTORY_KEY);

  if (!storedValue) {
    return [];
  }

  try {
    const parsedValue = JSON.parse(storedValue);

    return Array.isArray(parsedValue)
      ? (parsedValue as RescueCase[])
      : [];
  } catch {
    await AsyncStorage.removeItem(HISTORY_KEY);
    return [];
  }
}

export async function saveCompletedCase(
  rescueCase: RescueCase,
): Promise<void> {
  const currentHistory = await getHistory();

  const completedCase: RescueCase = {
    ...rescueCase,
    completedAt: rescueCase.completedAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const updatedHistory = [
    completedCase,
    ...currentHistory.filter(
      (historyItem) => historyItem.id !== completedCase.id,
    ),
  ].slice(0, MAX_HISTORY_ITEMS);

  await AsyncStorage.setItem(
    HISTORY_KEY,
    JSON.stringify(updatedHistory),
  );
}

export async function deleteHistoryItem(
  caseId: string,
): Promise<void> {
  const currentHistory = await getHistory();

  const updatedHistory = currentHistory.filter(
    (historyItem) => historyItem.id !== caseId,
  );

  await AsyncStorage.setItem(
    HISTORY_KEY,
    JSON.stringify(updatedHistory),
  );
}

export async function clearHistory(): Promise<void> {
  await AsyncStorage.removeItem(HISTORY_KEY);
}

export async function loadRememberedContact(): Promise<RememberedContact | null> {
  const storedValue = await AsyncStorage.getItem(REMEMBERED_CONTACT_KEY);

  if (!storedValue) {
    return null;
  }

  try {
    const parsedValue = JSON.parse(storedValue);

    if (
      typeof parsedValue?.fullName === "string" &&
      typeof parsedValue?.phone === "string"
    ) {
      return parsedValue as RememberedContact;
    }
  } catch {
    // Invalid stored contact data is cleared below.
  }

  await AsyncStorage.removeItem(REMEMBERED_CONTACT_KEY);
  return null;
}

export async function saveRememberedContact(
  contact: RememberedContact,
): Promise<void> {
  await AsyncStorage.setItem(
    REMEMBERED_CONTACT_KEY,
    JSON.stringify(contact),
  );
}

export async function clearRememberedContact(): Promise<void> {
  await AsyncStorage.removeItem(REMEMBERED_CONTACT_KEY);
}
