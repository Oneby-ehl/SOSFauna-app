import { Stack, useFocusEffect, useRouter } from "expo-router";
import * as Clipboard from "expo-clipboard";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  clearHistory,
  deleteHistoryItem,
  getHistory,
} from "@/services/rescueStorage";
import { NoIndexHead } from "@/components/seo/SeoHead";
import { IconSymbol } from "@/components/ui/icon-symbol";
import type {
  RescueAnimalState,
  RescueAnimalType,
  RescueCase,
  RescueFlags,
} from "@/types/rescueCase";

const ANIMAL_TYPE_LABELS: Record<RescueAnimalType, string> = {
  smallBird: "Ave pequeña",
  largeBird: "Ave grande",
  bat: "Murciélago",
  smallMammal: "Mamífero pequeño",
  largeMammal: "Mamífero grande",
  reptileAmphibian: "Reptil o anfibio",
  unknown: "Animal sin identificar",
};

const ANIMAL_STATE_LABELS: Record<RescueAnimalState, string> = {
  alive: "Vivo",
  dead: "Muerto",
};

const ANIMAL_STATE_ICONS: Record<RescueAnimalState, string> = {
  alive: "🟢",
  dead: "⚫",
};

const FLAG_LABELS: Array<{
  key: keyof RescueFlags;
  label: string;
}> = [
  { key: "bleeding", label: "Sangra" },
  { key: "baby", label: "Es una cría" },
  { key: "catDog", label: "Ha sido atacado por un gato o un perro" },
  { key: "canNotMove", label: "No puede moverse" },
  { key: "roadRisk", label: "Está cerca de una carretera" },
  { key: "ringGps", label: "Lleva anilla o dispositivo GPS" },
  { key: "trapped", label: "Está atrapado" },
  { key: "cannotFly", label: "No puede volar" },
  { key: "weakness", label: "Muestra debilidad" },
  { key: "normalAppearance", label: "Presenta apariencia normal" },
  { key: "breathing", label: "Tiene dificultad para respirar" },
  { key: "other", label: "Presenta otra situación" },
];

function formatDate(value: string | null): string {
  if (!value) return "Fecha no disponible";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Fecha no disponible";
  }

  return new Intl.DateTimeFormat("es-ES", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getActiveFlagLabels(flags: RescueFlags): string[] {
  return FLAG_LABELS.filter(({ key }) => flags[key]).map(
    ({ label }) => label,
  );
}

function formatObservedSituation(flagLabels: string[]): string {
  return flagLabels.length > 0
    ? `${flagLabels.join(". ")}.`
    : "Sin incidencias destacables.";
}

function buildCaseSummary(rescueCase: RescueCase): string {
  const flagLabels = getActiveFlagLabels(rescueCase.flags);
  const coordinates = rescueCase.coords
    ? `${rescueCase.coords.latitude.toFixed(6)}, ${rescueCase.coords.longitude.toFixed(6)}`
    : "No disponibles";

  return [
    "SOS Fauna España",
    "",
    `Fecha del aviso: ${formatDate(
      rescueCase.completedAt ?? rescueCase.updatedAt,
    )}`,
    `Animal: ${ANIMAL_TYPE_LABELS[rescueCase.animalType]}`,
    `Estado: ${ANIMAL_STATE_LABELS[rescueCase.animalState]}`,
    `Situación observada: ${
      flagLabels.length > 0
        ? flagLabels.join(", ")
        : "Sin circunstancias adicionales seleccionadas"
    }`,
    `Ubicación: ${rescueCase.locationText.trim() || "No indicada"}`,
    `Coordenadas: ${coordinates}`,
    `Persona de contacto: ${rescueCase.fullName.trim() || "No indicada"}`,
    `Teléfono: ${rescueCase.phone.trim() || "No indicado"}`,
  ].join("\n");
}

function HistoryCard({
  rescueCase,
  expanded,
  onToggle,
  onCopy,
  onDelete,
}: {
  rescueCase: RescueCase;
  expanded: boolean;
  onToggle: () => void;
  onCopy: () => void;
  onDelete: () => void;
}) {
  const flagLabels = getActiveFlagLabels(rescueCase.flags);
  const observedSituation = formatObservedSituation(flagLabels);

  return (
    <View style={styles.card}>
      <Pressable style={styles.cardHeader} onPress={onToggle}>
        <View style={styles.cardHeaderText}>
          <Text style={styles.cardTitle}>
            {ANIMAL_TYPE_LABELS[rescueCase.animalType]}
          </Text>

          <Text style={styles.cardDate}>
            {formatDate(rescueCase.completedAt ?? rescueCase.updatedAt)}
          </Text>

          <Text style={styles.cardState}>
            {ANIMAL_STATE_ICONS[rescueCase.animalState]}{" "}
            {ANIMAL_STATE_LABELS[rescueCase.animalState]}
          </Text>
        </View>

        <Text style={styles.expandIcon}>{expanded ? "−" : "+"}</Text>
      </Pressable>

      <View style={styles.cardSummary}>
        <Text style={styles.summaryLabel}>Ubicación</Text>
        <Text style={styles.summaryValue}>
          {rescueCase.locationText.trim() || "No indicada"}
        </Text>

        <Text style={styles.summaryLabel}>Situación</Text>
        <Text style={styles.summaryValue}>{observedSituation}</Text>
      </View>

      {expanded ? (
        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Persona de contacto</Text>
            <Text style={styles.detailValue}>
              {rescueCase.fullName.trim() || "No indicada"}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Teléfono</Text>
            <Text style={styles.detailValue}>
              {rescueCase.phone.trim() || "No indicado"}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Situación observada</Text>
            <Text style={styles.detailValue}>{observedSituation}</Text>
          </View>

          {rescueCase.coords ? (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Coordenadas</Text>
              <Text style={styles.detailValue}>
                {rescueCase.coords.latitude.toFixed(6)},{" "}
                {rescueCase.coords.longitude.toFixed(6)}
              </Text>
            </View>
          ) : null}

          <View style={styles.detailActions}>
            <Pressable style={styles.copyButton} onPress={onCopy}>
              <View style={styles.buttonContent}>
                <IconSymbol name="doc.on.doc" size={16} color="#ffffff" />
                <Text style={styles.copyButtonText}>Copiar resumen</Text>
              </View>
            </Pressable>

            <Pressable style={styles.deleteButton} onPress={onDelete}>
              <View style={styles.buttonContent}>
                <IconSymbol name="trash" size={16} color="#9b1c1c" />
                <Text style={styles.deleteButtonText}>Eliminar aviso</Text>
              </View>
            </Pressable>
          </View>
        </View>
      ) : null}
    </View>
  );
}

export default function HistoryPage() {
  const router = useRouter();
  const [history, setHistory] = useState<RescueCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCaseId, setExpandedCaseId] = useState<string | null>(null);

  const loadHistory = useCallback(async () => {
    try {
      setLoading(true);
      setHistory(await getHistory());
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadHistory();
    }, [loadHistory]),
  );

  const confirmAction = (
    title: string,
    message: string,
    confirmText: string,
    action: () => Promise<void>,
  ) => {
    if (Platform.OS === "web") {
      if (window.confirm(`${title}\n\n${message}`)) {
        void action();
      }
      return;
    }

    Alert.alert(title, message, [
      { text: "Cancelar", style: "cancel" },
      {
        text: confirmText,
        style: "destructive",
        onPress: () => void action(),
      },
    ]);
  };

  const handleCopySummary = async (rescueCase: RescueCase) => {
    await Clipboard.setStringAsync(buildCaseSummary(rescueCase));

    if (Platform.OS === "web") {
      window.alert("Resumen copiado al portapapeles.");
      return;
    }

    Alert.alert("Resumen copiado", "El resumen del aviso se ha copiado.");
  };

  const handleDeleteItem = (rescueCase: RescueCase) => {
    confirmAction(
      "Eliminar aviso",
      "Este aviso se eliminará del historial de este dispositivo.",
      "Eliminar",
      async () => {
        await deleteHistoryItem(rescueCase.id);
        setHistory((currentHistory) =>
          currentHistory.filter((item) => item.id !== rescueCase.id),
        );

        if (expandedCaseId === rescueCase.id) {
          setExpandedCaseId(null);
        }
      },
    );
  };

  const handleClearHistory = () => {
    confirmAction(
      "Borrar todo el historial",
      "Se eliminarán todos los avisos finalizados guardados en este dispositivo.",
      "Borrar todo",
      async () => {
        await clearHistory();
        setHistory([]);
        setExpandedCaseId(null);
      },
    );
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.screenContent}
      showsVerticalScrollIndicator
    >
      <NoIndexHead path="/history" title="Mis avisos | SOS Fauna España" />
      <Stack.Screen options={{ title: "Mis avisos" }} />

      <View style={styles.header}>
        <View style={styles.headerInner}>
          <View style={styles.headerText}>
            <Text style={styles.eyebrow}>SOS Fauna España</Text>
            <Text style={styles.title}>Mis avisos</Text>
            <Text style={styles.description}>
              Historial de avisos finalizados y guardados en este dispositivo.
            </Text>
          </View>

          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Volver</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.content}>
        {loading ? (
          <View style={styles.statusPanel}>
            <ActivityIndicator size="large" />
            <Text style={styles.statusText}>Cargando avisos…</Text>
          </View>
        ) : history.length === 0 ? (
          <View style={styles.emptyPanel}>
            <Text style={styles.emptyIcon}>🗂️</Text>
            <Text style={styles.emptyTitle}>Todavía no hay avisos guardados</Text>
            <Text style={styles.emptyText}>
              Los avisos aparecerán aquí cuando finalices el proceso del
              asistente.
            </Text>

            <Pressable style={styles.primaryButton} onPress={() => router.back()}>
              <Text style={styles.primaryButtonText}>Volver al inicio</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <View style={styles.list}>
              {history.map((rescueCase) => (
                <HistoryCard
                  key={rescueCase.id}
                  rescueCase={rescueCase}
                  expanded={expandedCaseId === rescueCase.id}
                  onToggle={() =>
                    setExpandedCaseId((currentId) =>
                      currentId === rescueCase.id ? null : rescueCase.id,
                    )
                  }
                  onCopy={() => void handleCopySummary(rescueCase)}
                  onDelete={() => handleDeleteItem(rescueCase)}
                />
              ))}
            </View>

            <Pressable
              style={styles.clearHistoryButton}
              onPress={handleClearHistory}
            >
              <Text style={styles.clearHistoryButtonText}>
                Borrar todo el historial
              </Text>
            </Pressable>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f4f7f4",
  },
  screenContent: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#dfe7df",
  },
  headerInner: {
    width: "100%",
    maxWidth: 960,
    marginHorizontal: "auto",
    paddingHorizontal: 24,
    paddingVertical: 34,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 24,
    flexWrap: "wrap",
  },
  headerText: {
    flex: 1,
    minWidth: 260,
    gap: 8,
  },
  eyebrow: {
    color: "#2f7a48",
    fontSize: 13,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  title: {
    color: "#123c24",
    fontSize: 36,
    lineHeight: 43,
    fontWeight: "900",
  },
  description: {
    color: "#536158",
    fontSize: 16,
    lineHeight: 25,
  },
  backButton: {
    minHeight: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#9ab7a0",
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonText: {
    color: "#14532d",
    fontSize: 15,
    fontWeight: "800",
  },
  content: {
    width: "100%",
    maxWidth: 960,
    marginHorizontal: "auto",
    paddingHorizontal: 24,
    paddingVertical: 36,
    gap: 24,
  },
  statusPanel: {
    minHeight: 240,
    backgroundColor: "#ffffff",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#dfe7df",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    padding: 28,
  },
  statusText: {
    color: "#536158",
    fontSize: 15,
  },
  emptyPanel: {
    minHeight: 320,
    backgroundColor: "#ffffff",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#dfe7df",
    alignItems: "center",
    justifyContent: "center",
    padding: 34,
    gap: 14,
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyTitle: {
    color: "#183d28",
    fontSize: 24,
    lineHeight: 31,
    fontWeight: "900",
    textAlign: "center",
  },
  emptyText: {
    maxWidth: 520,
    color: "#536158",
    fontSize: 16,
    lineHeight: 25,
    textAlign: "center",
  },
  primaryButton: {
    minHeight: 50,
    marginTop: 8,
    backgroundColor: "#14532d",
    borderRadius: 13,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "900",
  },
  list: {
    gap: 18,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#dfe7df",
    overflow: "hidden",
  },
  cardHeader: {
    minHeight: 78,
    paddingHorizontal: 22,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 18,
  },
  cardHeaderText: {
    flex: 1,
    gap: 4,
  },
  cardTitle: {
    color: "#183d28",
    fontSize: 20,
    fontWeight: "900",
  },
  cardDate: {
    color: "#68746b",
    fontSize: 14,
    lineHeight: 20,
  },
  cardState: {
    color: "#34483a",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "800",
  },
  expandIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#e4f4e7",
    color: "#14532d",
    fontSize: 24,
    lineHeight: 31,
    fontWeight: "700",
    textAlign: "center",
  },
  cardSummary: {
    borderTopWidth: 1,
    borderTopColor: "#edf1ed",
    paddingHorizontal: 22,
    paddingVertical: 17,
    gap: 5,
  },
  summaryLabel: {
    color: "#2f7a48",
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 0.7,
    marginTop: 4,
  },
  summaryValue: {
    color: "#34483a",
    fontSize: 15,
    lineHeight: 23,
  },
  details: {
    backgroundColor: "#f8faf8",
    borderTopWidth: 1,
    borderTopColor: "#dfe7df",
    padding: 22,
    gap: 18,
  },
  detailRow: {
    gap: 5,
  },
  detailLabel: {
    color: "#2f7a48",
    fontSize: 13,
    fontWeight: "900",
  },
  detailValue: {
    color: "#3f4d43",
    fontSize: 15,
    lineHeight: 23,
  },
  detailActions: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 2,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },
  copyButton: {
    minHeight: 44,
    borderRadius: 11,
    backgroundColor: "#14532d",
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  copyButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "900",
  },
  deleteButton: {
    alignSelf: "flex-start",
    minHeight: 44,
    marginTop: 2,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: "#d9a6a6",
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButtonText: {
    color: "#9b1c1c",
    fontSize: 14,
    fontWeight: "800",
  },
  clearHistoryButton: {
    alignSelf: "flex-start",
    minHeight: 48,
    marginTop: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d9a6a6",
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  clearHistoryButtonText: {
    color: "#9b1c1c",
    fontSize: 15,
    fontWeight: "900",
  },
});
