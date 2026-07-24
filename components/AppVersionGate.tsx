import { useCallback, useEffect, useState, type ReactNode } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

import { getAppVersion } from "@/components/AppVersionFooter";

const CHECK_INTERVAL_MS = 24 * 60 * 60 * 1000;
const LAST_CHECK_AT_KEY = "sosFauna:lastVersionCheckAt";
const LAST_DETECTED_VERSION_KEY = "sosFauna:lastDetectedVersion";
const PROMPTED_VERSION_KEY = "sosFauna:promptedVersion";

type VersionFile = {
  version?: unknown;
};

function canCheckForUpdates(now: number): boolean {
  const lastCheckAt = window.localStorage.getItem(LAST_CHECK_AT_KEY);

  if (!lastCheckAt) return true;

  const lastCheckTime = Date.parse(lastCheckAt);

  return Number.isNaN(lastCheckTime) || now - lastCheckTime >= CHECK_INTERVAL_MS;
}

export default function AppVersionGate({ children }: { children: ReactNode }) {
  const [availableVersion, setAvailableVersion] = useState<string | null>(null);

  const checkForUpdates = useCallback(async () => {
    if (Platform.OS !== "web" || typeof window === "undefined") return;

    const now = Date.now();

    if (!canCheckForUpdates(now)) return;

    window.localStorage.setItem(LAST_CHECK_AT_KEY, new Date(now).toISOString());

    try {
      const response = await fetch(`/version.json?ts=${now}`, {
        cache: "no-store",
      });

      if (!response.ok) return;

      const versionFile = (await response.json()) as VersionFile;
      const detectedVersion =
        typeof versionFile.version === "string" ? versionFile.version : null;

      if (!detectedVersion) return;

      window.localStorage.setItem(LAST_DETECTED_VERSION_KEY, detectedVersion);

      const promptedVersion =
        window.localStorage.getItem(PROMPTED_VERSION_KEY);

      if (
        detectedVersion !== getAppVersion() &&
        promptedVersion !== detectedVersion
      ) {
        window.localStorage.setItem(PROMPTED_VERSION_KEY, detectedVersion);
        setAvailableVersion(detectedVersion);
      }
    } catch {
      // The version check is opportunistic and should never interrupt the app.
    }
  }, []);

  useEffect(() => {
    if (Platform.OS !== "web" || typeof window === "undefined") return;

    void checkForUpdates();

    const handleFocus = () => {
      void checkForUpdates();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void checkForUpdates();
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [checkForUpdates]);

  const handleDismiss = () => {
    if (availableVersion && typeof window !== "undefined") {
      window.localStorage.setItem(PROMPTED_VERSION_KEY, availableVersion);
    }

    setAvailableVersion(null);
  };

  const handleReload = () => {
    if (availableVersion && typeof window !== "undefined") {
      window.localStorage.setItem(PROMPTED_VERSION_KEY, availableVersion);
      window.location.reload();
    }
  };

  return (
    <>
      {children}

      {availableVersion ? (
        <View style={styles.overlay}>
          <View style={styles.dialog}>
            <Text style={styles.title}>Nueva versión disponible</Text>
            <Text style={styles.message}>
              Se ha publicado una nueva versión de SOS Fauna España con mejoras
              y correcciones.
            </Text>

            <View style={styles.actions}>
              <Pressable style={styles.primaryButton} onPress={handleReload}>
                <Text style={styles.primaryButtonText}>Actualizar ahora</Text>
              </Pressable>

              <Pressable style={styles.secondaryButton} onPress={handleDismiss}>
                <Text style={styles.secondaryButtonText}>Más tarde</Text>
              </Pressable>
            </View>
          </View>
        </View>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 1000,
    backgroundColor: "rgba(18, 60, 36, 0.18)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  dialog: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#ffffff",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#dfe7df",
    padding: 22,
    gap: 14,
  },
  title: {
    color: "#123c24",
    fontSize: 20,
    lineHeight: 26,
    fontWeight: "900",
  },
  message: {
    color: "#536158",
    fontSize: 15,
    lineHeight: 23,
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 4,
  },
  primaryButton: {
    minHeight: 44,
    backgroundColor: "#14532d",
    borderRadius: 11,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "900",
  },
  secondaryButton: {
    minHeight: 44,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: "#9ab7a0",
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    color: "#14532d",
    fontSize: 14,
    fontWeight: "900",
  },
});
