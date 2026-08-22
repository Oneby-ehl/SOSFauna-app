import { Link } from "expo-router";
import * as Linking from "expo-linking";
import { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { SectionCard } from "@/components/SectionCard";
import {
  getRecoveryCenterProvinceContacts,
  HELP_CONTACTS_LEGAL_NOTICE,
  NATIONAL_HELP_CONTACTS,
} from "@/data/helpContacts";
import {
  marineHelpContacts,
  type MarineHelpContactItem,
  type MarineHelpResourceType,
} from "@/data/marineHelpContacts";
import type { ProvinceContactItem } from "@/lib/provinceContacts";

type RecoveryCentersContentProps = {
  provinceSearch: string;
  selectedProvince: string | null;
  showHelpSources: boolean;
  showProvinceList: boolean;
  showInternalBackButtons?: boolean;
  onProvinceSearchChange: (value: string) => void;
  onSelectedProvinceChange: (province: string | null) => void;
  onShowHelpSourcesChange: (value: boolean) => void;
  onShowProvinceListChange: (value: boolean) => void;
};

const normalizeProvinceSearch = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const callNumber = async (phoneNumber: string) => {
  await Linking.openURL(`tel:${phoneNumber}`);
};

type ProvinceHelpGroup = {
  province: string;
  terrestrialContacts: ProvinceContactItem[];
  marineContacts: MarineHelpContactItem[];
};

const getNationalContactLabel = (phone: string) => {
  if (phone === "112") return "🚨 Emergencias";
  if (phone === "062") return "🌿 SEPRONA";
  if (phone === "092") return "🚓 Policía Municipal / Local";

  return "👮 Policía Nacional";
};

const getMarineResourceTypeLabel = (type: MarineHelpResourceType) => {
  if (type === "emergency") return "Emergencias";
  if (type === "strandingNetwork") return "Red de varamientos";
  if (type === "recoveryCenter") return "Centro especializado";
  if (type === "specializedEntity") return "Entidad especializada";

  return "Contacto adicional";
};

const getVisibleContactCount = (item: ProvinceHelpGroup) =>
  item.terrestrialContacts.length +
  item.marineContacts.filter((contact) => Boolean(contact.phone)).length;

const getProvinceHelpGroups = (): ProvinceHelpGroup[] => {
  const provinceMap = new Map<string, ProvinceHelpGroup>();

  getRecoveryCenterProvinceContacts().forEach((item) => {
    provinceMap.set(item.province, {
      province: item.province,
      terrestrialContacts: [...item.contacts],
      marineContacts: [],
    });
  });

  marineHelpContacts.forEach((item) => {
    const existing = provinceMap.get(item.province);

    if (existing) {
      existing.marineContacts = [...item.contacts];
      return;
    }

    provinceMap.set(item.province, {
      province: item.province,
      terrestrialContacts: [],
      marineContacts: [...item.contacts],
    });
  });

  return [...provinceMap.values()].sort((a, b) =>
    a.province.localeCompare(b.province, "es"),
  );
};

export function RecoveryCentersContent({
  provinceSearch,
  selectedProvince,
  showHelpSources,
  showProvinceList,
  showInternalBackButtons = false,
  onProvinceSearchChange,
  onSelectedProvinceChange,
  onShowHelpSourcesChange,
  onShowProvinceListChange,
}: RecoveryCentersContentProps) {
  const provinceGroups = useMemo(getProvinceHelpGroups, []);
  const filteredProvinceContacts = useMemo(() => {
    const normalizedSearch = normalizeProvinceSearch(provinceSearch);

    if (!normalizedSearch) return provinceGroups;

    return provinceGroups.filter((item) =>
      normalizeProvinceSearch(item.province).includes(normalizedSearch),
    );
  }, [provinceGroups, provinceSearch]);
  const province = provinceGroups.find(
    (item) => item.province === selectedProvince,
  );

  const renderTerrestrialContact = (contact: ProvinceContactItem) => (
    <Pressable
      key={`terrestrial-${province?.province}-${contact.name}-${contact.phone}`}
      style={styles.contactRow}
      onPress={() => callNumber(contact.phone)}
    >
      <View style={styles.contactTextBlock}>
        <Text style={styles.contactName}>{contact.name}</Text>
        <Text style={styles.contactNote}>{contact.note}</Text>
      </View>
      <Text style={styles.contactPhone}>{contact.phone}</Text>
    </Pressable>
  );

  const renderMarineContact = (contact: MarineHelpContactItem) => {
    const content = (
      <>
        <View style={styles.contactTextBlock}>
          <Text style={styles.contactName}>{contact.name}</Text>
          <Text style={styles.contactType}>
            {getMarineResourceTypeLabel(contact.type)}
          </Text>
          <Text style={styles.contactNote}>{contact.note}</Text>
        </View>
        {contact.phone ? (
          <Text style={styles.contactPhone}>{contact.phone}</Text>
        ) : (
          <Text style={styles.infoOnlyLabel}>Info</Text>
        )}
      </>
    );

    if (!contact.phone) {
      return (
        <View
          key={`marine-${province?.province}-${contact.name}`}
          style={[styles.contactRow, styles.contactRowInfoOnly]}
        >
          {content}
        </View>
      );
    }

    const phone = contact.phone;

    return (
      <Pressable
        key={`marine-${province?.province}-${contact.name}-${phone}`}
        style={[
          styles.contactRow,
          phone === "112" && styles.contactRowEmergency,
        ]}
        onPress={() => callNumber(phone)}
      >
        {content}
      </Pressable>
    );
  };

  const openProvinceList = () => {
    onShowProvinceListChange(true);
    onSelectedProvinceChange(null);
    onProvinceSearchChange("");
  };

  if (province) {
    return (
      <SectionCard title={province.province}>
        <View style={styles.sectionContent}>
          {showInternalBackButtons ? (
            <Pressable
              style={styles.secondaryButton}
              onPress={() => onSelectedProvinceChange(null)}
            >
              <Text style={styles.secondaryButtonText}>Volver a provincias</Text>
            </Pressable>
          ) : null}

          <Text style={styles.sectionDescription}>
            Estos son los contactos disponibles para esta provincia.
          </Text>

          {province.terrestrialContacts.length ? (
            <View style={[styles.contactGroup, styles.contactGroupTerrestrial]}>
              <Text
                style={[
                  styles.contactGroupLabel,
                  styles.contactGroupLabelTerrestrial,
                ]}
              >
                🍃 Fauna terrestre y aves
              </Text>
              {province.terrestrialContacts.map(renderTerrestrialContact)}
            </View>
          ) : null}

          {province.marineContacts.length ? (
            <View style={[styles.contactGroup, styles.contactGroupMarine]}>
              <Text
                style={[styles.contactGroupLabel, styles.contactGroupLabelMarine]}
              >
                🌊 Fauna marina
              </Text>
              <Text style={styles.contactGroupDescription}>
                Cetáceos, tortugas marinas, focas, tiburones/rayas y otros
                animales marinos varados o en problemas.
              </Text>
              {province.marineContacts.map(renderMarineContact)}
            </View>
          ) : null}
        </View>
      </SectionCard>
    );
  }

  if (showProvinceList) {
    return (
      <SectionCard title="Teléfonos por provincias">
        <View style={styles.sectionContent}>
          {showInternalBackButtons ? (
            <Pressable
              style={styles.secondaryButton}
              onPress={() => onShowProvinceListChange(false)}
            >
              <Text style={styles.secondaryButtonText}>Volver a teléfonos</Text>
            </Pressable>
          ) : null}

          <Text style={styles.sectionDescription}>
            Selecciona una provincia para ver los recursos disponibles.
          </Text>

          <TextInput
            placeholder="Buscar provincia"
            value={provinceSearch}
            onChangeText={onProvinceSearchChange}
            style={styles.input}
            autoCapitalize="words"
          />

          {filteredProvinceContacts.length ? (
            filteredProvinceContacts.map((item) => (
              <Pressable
                key={item.province}
                style={styles.contactRow}
                onPress={() => onSelectedProvinceChange(item.province)}
              >
                <View style={styles.contactTextBlock}>
                  <Text style={styles.contactName}>{item.province}</Text>
                  <Text style={styles.contactNote}>
                    {getVisibleContactCount(item)} contacto
                    {getVisibleContactCount(item) === 1 ? "" : "s"} telefónico
                    {getVisibleContactCount(item) === 1 ? "" : "s"}
                  </Text>
                </View>
                <Text style={styles.contactPhone}>Ver</Text>
              </Pressable>
            ))
          ) : (
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                No se han encontrado provincias con ese nombre.
              </Text>
            </View>
          )}
        </View>
      </SectionCard>
    );
  }

  return (
    <SectionCard title="Teléfonos de ayuda">
      <View style={styles.sectionContent}>
        <Text style={styles.sectionDescription}>
          Elige el servicio adecuado según la urgencia y la ubicación del animal.
        </Text>

        <Text style={styles.sectionDescription}>
          Llama al 112 si existe peligro inmediato para personas, tráfico o
          seguridad. Para otros casos, contacta con el servicio más adecuado.
        </Text>

        <Text style={styles.sectionDescription}>
          Ante fauna marina varada, herida o en problemas, el 112 activa los
          servicios correspondientes en muchos territorios.
        </Text>

        <Text style={styles.subheading}>Ayuda inmediata</Text>

        {NATIONAL_HELP_CONTACTS.map((contact) => (
          <Pressable
            key={contact.name}
            style={[
              styles.contactRow,
              contact.phone === "112" && styles.contactRowEmergency,
            ]}
            onPress={() => callNumber(contact.phone)}
          >
            <View style={styles.contactTextBlock}>
              <Text style={styles.contactName}>
                {getNationalContactLabel(contact.phone)}
              </Text>
              <Text style={styles.contactNote}>{contact.note}</Text>
            </View>
            <View style={styles.contactPhonePill}>
              <Text style={styles.contactPhonePillText}>{contact.phone}</Text>
            </View>
          </Pressable>
        ))}

        <Text style={styles.subheading}>Ayuda por provincias</Text>

        <Pressable style={styles.primaryButton} onPress={openProvinceList}>
          <Text style={styles.primaryButtonText}>
            📍 Buscar ayuda en mi provincia
          </Text>
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          onPress={() => onShowHelpSourcesChange(!showHelpSources)}
        >
          <Text style={styles.secondaryButtonText}>Fuentes y aviso legal</Text>
        </Pressable>

        {showHelpSources ? (
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>{HELP_CONTACTS_LEGAL_NOTICE}</Text>
          </View>
        ) : null}
      </View>
    </SectionCard>
  );
}

export default function RecoveryCentersPage() {
  const [showHelpSources, setShowHelpSources] = useState(false);
  const [showProvinceList, setShowProvinceList] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [provinceSearch, setProvinceSearch] = useState("");

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>SOS FAUNA ESPAÑA</Text>
        <Text style={styles.title}>
          Centros de Recuperación y teléfonos de ayuda
        </Text>
        <Text style={styles.intro}>
          Consulta teléfonos de ayuda inmediata, centros de recuperación, redes
          y recursos especializados por provincia.
        </Text>
      </View>

      <RecoveryCentersContent
        provinceSearch={provinceSearch}
        selectedProvince={selectedProvince}
        showHelpSources={showHelpSources}
        showProvinceList={showProvinceList}
        showInternalBackButtons
        onProvinceSearchChange={setProvinceSearch}
        onSelectedProvinceChange={setSelectedProvince}
        onShowHelpSourcesChange={setShowHelpSources}
        onShowProvinceListChange={setShowProvinceList}
      />

      <Link href="/" asChild>
        <Pressable style={styles.backButton}>
          <Text style={styles.backButtonText}>Volver a SOS Fauna España</Text>
        </Pressable>
      </Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f3f7f4",
  },
  container: {
    width: "100%",
    maxWidth: 960,
    alignSelf: "center",
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 64,
    gap: 24,
  },
  header: {
    gap: 12,
  },
  eyebrow: {
    color: "#166534",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  title: {
    color: "#14532d",
    fontSize: 38,
    fontWeight: "900",
    lineHeight: 44,
  },
  intro: {
    maxWidth: 760,
    color: "#4b5563",
    fontSize: 17,
    lineHeight: 27,
  },
  sectionContent: {
    gap: 12,
  },
  sectionDescription: {
    color: "#4b5563",
    fontSize: 15,
    lineHeight: 22,
  },
  subheading: {
    color: "#111827",
    fontSize: 15,
    fontWeight: "700",
    marginTop: 4,
  },
  contactGroup: {
    borderWidth: 1,
    borderRadius: 12,
    gap: 9,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  contactGroupTerrestrial: {
    backgroundColor: "#f4fbf5",
    borderColor: "#d7eadb",
  },
  contactGroupMarine: {
    backgroundColor: "#f3f8fb",
    borderColor: "#d5e7f0",
  },
  contactGroupLabel: {
    color: "#4b5563",
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  contactGroupLabelTerrestrial: {
    color: "#166534",
  },
  contactGroupLabelMarine: {
    color: "#1e6091",
  },
  contactGroupDescription: {
    color: "#4b5563",
    fontSize: 13,
    lineHeight: 18,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#ffffff",
  },
  primaryButton: {
    backgroundColor: "#14532d",
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryButton: {
    backgroundColor: "#e5e7eb",
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  contactRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 14,
    padding: 12,
    backgroundColor: "#ffffff",
  },
  contactRowEmergency: {
    backgroundColor: "#fef3c7",
    borderColor: "#f59e0b",
  },
  contactRowInfoOnly: {
    backgroundColor: "#ffffff",
  },
  contactTextBlock: {
    flex: 1,
    minWidth: 0,
  },
  contactName: {
    color: "#111827",
    fontSize: 15,
    fontWeight: "700",
  },
  contactNote: {
    color: "#4b5563",
    fontSize: 13,
    marginTop: 2,
  },
  contactType: {
    color: "#1e6091",
    fontSize: 12,
    fontWeight: "800",
    marginTop: 2,
  },
  contactPhone: {
    color: "#14532d",
    fontSize: 14,
    fontWeight: "700",
  },
  infoOnlyLabel: {
    color: "#64748b",
    fontSize: 12,
    fontWeight: "800",
  },
  contactPhonePill: {
    backgroundColor: "#14532d",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  contactPhonePillText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "900",
  },
  warningBox: {
    backgroundColor: "#fef3c7",
    borderWidth: 1,
    borderColor: "#f59e0b",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  warningText: {
    color: "#92400e",
    fontWeight: "700",
    lineHeight: 20,
  },
  infoBox: {
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  infoText: {
    color: "#4b5563",
    fontSize: 13,
    lineHeight: 18,
  },
  backButton: {
    alignSelf: "flex-start",
    backgroundColor: "#14532d",
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "800",
  },
});
