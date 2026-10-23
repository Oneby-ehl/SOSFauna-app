import { Link } from "expo-router";
import * as Linking from "expo-linking";
import { useMemo, useState, type PropsWithChildren } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import PublicRecoveryCenters from "./PublicRecoveryCenters";
import { matchesProvinceHelpGroup } from "./contactSearch";
import { useInformationPagePath } from "@/components/i18n/InformationPageSupport";

import { SectionCard } from "@/components/SectionCard";
import {
  getRecoveryCenterProvinceContacts,
  getHelpContactsLegalNotice,
  NATIONAL_HELP_CONTACTS,
} from "@/data/helpContacts";
import {
  marineHelpContacts,
  type MarineHelpContactItem,
  type MarineHelpResourceType,
} from "@/data/marineHelpContacts";
import type { ProvinceContactItem } from "@/lib/provinceContacts";
import { useI18n } from "@/i18n/I18nProvider";
import { getEffectiveCatalog } from "@/i18n/translate";
import { getHelpContactName, getHelpContactNote } from "@/data/helpContactText";
import { DEFAULT_LOCALE, type Locale } from "@/i18n/types";


type RecoveryCentersContentProps = {
  provinceSearch: string;
  selectedProvince: string | null;
  showHelpSources: boolean;
  showProvinceList: boolean;
  showInternalBackButtons?: boolean;
  publicHeadings?: boolean;
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

export type ProvinceHelpGroup = {
  province: string;
  terrestrialContacts: ProvinceContactItem[];
  marineContacts: MarineHelpContactItem[];
};

const getNationalContactLabel = (phone: string, locale: Locale = DEFAULT_LOCALE) => {
  const labels = getEffectiveCatalog(locale).centers;
  if (phone === "112") return labels.nationalEmergency;
  if (phone === "062") return labels.nationalSeprona;
  if (phone === "092") return labels.nationalLocalPolice;

  return labels.nationalPolice;
};

const getMarineResourceTypeLabel = (type: MarineHelpResourceType, locale: Locale = DEFAULT_LOCALE) => {
  const labels = getEffectiveCatalog(locale).centers;
  if (type === "emergency") return labels.emergencyType;
  if (type === "strandingNetwork") return labels.strandingNetworkType;
  if (type === "recoveryCenter") return labels.recoveryCenterType;
  if (type === "specializedEntity") return labels.specializedEntityType;

  return labels.additionalContactType;
};

const getVisibleContactCount = (item: ProvinceHelpGroup) =>
  item.terrestrialContacts.length +
  item.marineContacts.filter((contact) => Boolean(contact.phone)).length;

export const getProvinceHelpGroups = (): ProvinceHelpGroup[] => {
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

// Preserve the shared assistant cards; only the public page opts into headings.
function PublicContactSection({ title, children }: PropsWithChildren<{ title: string }>) {
  return (
    <View style={publicSectionStyles.card}>
      <Text accessibilityRole="header" aria-level={2} style={publicSectionStyles.title}>{title}</Text>
      <View style={publicSectionStyles.content}>{children}</View>
    </View>
  );
}

export function RecoveryCentersContent({
  provinceSearch,
  selectedProvince,
  showHelpSources,
  showProvinceList,
  showInternalBackButtons = false,
  publicHeadings = false,
  onProvinceSearchChange,
  onSelectedProvinceChange,
  onShowHelpSourcesChange,
  onShowProvinceListChange,
}: RecoveryCentersContentProps) {
  const { t, locale } = useI18n();
  const pagePath = useInformationPagePath();
  const ContactSection = publicHeadings ? PublicContactSection : SectionCard;
  const provinceGroups = useMemo(getProvinceHelpGroups, []);
  const filteredProvinceContacts = useMemo(() => {
    const normalizedSearch = normalizeProvinceSearch(provinceSearch);

    if (!normalizedSearch) return provinceGroups;

    return provinceGroups.filter((item) =>
      matchesProvinceHelpGroup(item, normalizedSearch, normalizeProvinceSearch, locale),
    );
  }, [provinceGroups, provinceSearch, locale]);
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
        <Text style={styles.contactNote}>{getHelpContactNote("terrestrial", contact, locale)}</Text>
      </View>
      <Text style={styles.contactPhone}>{contact.phone}</Text>
    </Pressable>
  );

  const renderMarineContact = (contact: MarineHelpContactItem) => {
    const content = (
      <>
        <View style={styles.contactTextBlock}>
          <Text style={styles.contactName}>{getHelpContactName("marine", contact, locale)}</Text>
          <Text style={styles.contactType}>
            {getMarineResourceTypeLabel(contact.type, locale)}
          </Text>
          <Text style={styles.contactNote}>{getHelpContactNote("marine", contact, locale)}</Text>
        </View>
        {contact.phone ? (
          <Text style={styles.contactPhone}>{contact.phone}</Text>
        ) : (
          <Text style={styles.infoOnlyLabel}>{t("centers", "info")}</Text>
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
      <ContactSection title={province.province}>
        <View style={styles.sectionContent}>
          {showInternalBackButtons ? (
            <Pressable
              style={styles.secondaryButton}
              onPress={() => onSelectedProvinceChange(null)}
            >
              <Text style={styles.secondaryButtonText}>{t("centers", "backToProvinces")}</Text>
            </Pressable>
          ) : null}

          <Text style={styles.sectionDescription}>
            {t("centers", "provinceContactsIntro")}
          </Text>

          {province.terrestrialContacts.length ? (
            <View style={[styles.contactGroup, styles.contactGroupTerrestrial]}>
              <Text accessibilityRole={publicHeadings ? "header" : undefined} aria-level={publicHeadings ? 3 : undefined}
                style={[
                  styles.contactGroupLabel,
                  styles.contactGroupLabelTerrestrial,
                ]}
              >
                {t("centers", "terrestrialHeading")}
              </Text>
              {province.terrestrialContacts.map(renderTerrestrialContact)}
            </View>
          ) : null}

          {province.marineContacts.length ? (
            <View style={[styles.contactGroup, styles.contactGroupMarine]}>
              <Text
                accessibilityRole={publicHeadings ? "header" : undefined} aria-level={publicHeadings ? 3 : undefined} style={[styles.contactGroupLabel, styles.contactGroupLabelMarine]}
              >
                {t("centers", "marineHeading")}
              </Text>
              <Text style={styles.contactGroupDescription}>
                {t("centers", "marineIntro")}
              </Text>
              {province.marineContacts.map(renderMarineContact)}
            </View>
          ) : null}
        </View>
      </ContactSection>
    );
  }

  if (showProvinceList) {
    return (
      <ContactSection title={t("centers", "provincePhonesTitle")}>
        <View style={styles.sectionContent}>
          {showInternalBackButtons ? (
            <Pressable
              style={styles.secondaryButton}
              onPress={() => onShowProvinceListChange(false)}
            >
              <Text style={styles.secondaryButtonText}>{t("centers", "backToPhones")}</Text>
            </Pressable>
          ) : null}

          <Text style={styles.sectionDescription}>
            {t("centers", "selectProvince")}
          </Text>

          <TextInput
            placeholder={t("centers", "searchProvince")}
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
                    {getVisibleContactCount(item)}{t("centers", "contactCountNoun")}
                    {getVisibleContactCount(item) === 1 ? "" : t("centers", "pluralSuffix")}{t("centers", "contactCountAdjective")}
                    {getVisibleContactCount(item) === 1 ? "" : t("centers", "adjectivePluralSuffix")}
                  </Text>
                </View>
                <Text style={styles.contactPhone}>{t("centers", "show")}</Text>
              </Pressable>
            ))
          ) : (
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                {t("centers", "noResults")}
              </Text>
            </View>
          )}
        </View>
      </ContactSection>
    );
  }

  return (
    <ContactSection title={t("centers", "helpTitle")}>
      <View style={styles.sectionContent}>
        <Text style={styles.sectionDescription}>
          {publicHeadings ? (<>{t("centers", "chooseServicePrefix")}<Link href={pagePath("faq")}>{t("centers", "appropriateService")}</Link>{t("centers", "chooseServiceSuffix")}</>) : (t("centers", "chooseService"))}
        </Text>

        <Text style={styles.sectionDescription}>
          {t("centers", "emergencyGuidance")}
        </Text>

        <Text style={styles.sectionDescription}>
          {t("centers", "marineGuidance")}
        </Text>

        <Text accessibilityRole={publicHeadings ? "header" : undefined} aria-level={publicHeadings ? 3 : undefined} style={styles.subheading}>{t("centers", "immediateHelp")}</Text>

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
                {getNationalContactLabel(contact.phone, locale)}
              </Text>
              <Text style={styles.contactNote}>{getHelpContactNote("national", contact, locale)}</Text>
            </View>
            <View style={styles.contactPhonePill}>
              <Text style={styles.contactPhonePillText}>{contact.phone}</Text>
            </View>
          </Pressable>
        ))}

        <Text accessibilityRole={publicHeadings ? "header" : undefined} aria-level={publicHeadings ? 3 : undefined} style={styles.subheading}>{t("centers", "provinceHelp")}</Text>

        <Pressable style={styles.primaryButton} onPress={openProvinceList}>
          <Text style={styles.primaryButtonText}>
            {t("centers", "openProvinceDirectory")}
          </Text>
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          onPress={() => onShowHelpSourcesChange(!showHelpSources)}
        >
          <Text style={styles.secondaryButtonText}>{t("centers", "sourcesAndLegal")}</Text>
        </Pressable>

        {showHelpSources ? (
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>{getHelpContactsLegalNotice(locale)}</Text>
          </View>
        ) : null}
      </View>
    </ContactSection>
  );
}

export default function RecoveryCentersPage() {
  const { t, locale } = useI18n();
  const pagePath = useInformationPagePath();
  const publicProvinceGroups = useMemo(getProvinceHelpGroups, []);
  const [showHelpSources, setShowHelpSources] = useState(false);
  const [showProvinceList, setShowProvinceList] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [provinceSearch, setProvinceSearch] = useState("");

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>{t("common", "brandEyebrow")}</Text>
        <Text accessibilityRole="header" aria-level={1} style={styles.title}>
          {t("navigation", "centers")}
        </Text>
        <Text style={styles.intro}>
          {t("centers", "intro")}
        </Text>
      </View>

      {Platform.OS === "web" ? (
        <PublicRecoveryCenters
          groups={publicProvinceGroups}
          normalizeSearch={normalizeProvinceSearch}
          nationalContactLabel={(phone) => getNationalContactLabel(phone, locale)}
          marineResourceLabel={(type) => getMarineResourceTypeLabel(type, locale)}
        />
      ) : (
      <RecoveryCentersContent
        provinceSearch={provinceSearch}
        selectedProvince={selectedProvince}
        showHelpSources={showHelpSources}
        showProvinceList={showProvinceList}
        showInternalBackButtons
        publicHeadings
        onProvinceSearchChange={setProvinceSearch}
        onSelectedProvinceChange={setSelectedProvince}
        onShowHelpSourcesChange={setShowHelpSources}
        onShowProvinceListChange={setShowProvinceList}
      />
      )}

      <Link href={pagePath("home")} asChild>
        <Pressable style={styles.backButton}>
          <Text style={styles.backButtonText}>{t("navigation", "backToBrand")}</Text>
        </Pressable>
      </Link>
    </ScrollView>
  );
}

const publicSectionStyles = StyleSheet.create({
  card: {
    backgroundColor: "#f8fafc",
    borderRadius: 18,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  title: { fontSize: 18, fontWeight: "700", color: "#111827" },
  content: { gap: 10 },
});

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
