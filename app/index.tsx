import * as Clipboard from "expo-clipboard";
import * as ImagePicker from "expo-image-picker";
import * as Linking from "expo-linking";
import * as Location from "expo-location";
import * as MediaLibrary from "expo-media-library";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { Stack } from "expo-router";
import { SectionCard } from "@/components/SectionCard";
import { provinceContacts } from "@/lib/provinceContacts";

type FlagsState = {
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

type AnimalType =
  | "smallBird"
  | "largeBird"
  | "bat"
  | "smallMammal"
  | "largeMammal"
  | "reptileAmphibian"
  | "unknown";

type AnimalState = "alive" | "dead";

type Step = 1 | 2 | 3 | 4 | 5;

const GREFA_WHATSAPP = "34648539901";

const ANIMAL_OPTIONS: Array<{ key: AnimalType; label: string }> = [
  { key: "smallBird", label: "Ave pequeña" },
  { key: "largeBird", label: "Ave rapaz / ave grande" },
  { key: "bat", label: "Murciélago" },
  { key: "smallMammal", label: "Pequeño mamífero" },
  { key: "largeMammal", label: "Mamífero grande" },
  { key: "reptileAmphibian", label: "Reptil / anfibio" },
  { key: "unknown", label: "No lo sé" },
];

const ANIMAL_STATE_OPTIONS: Array<{ key: AnimalState; label: string }> = [
  { key: "alive", label: "Vivo" },
  { key: "dead", label: "Muerto" },
];

const FLAG_LABELS: Array<{ key: keyof FlagsState; label: string }> = [
  { key: "bleeding", label: "Sangra" },
  { key: "baby", label: "Es cría" },
  { key: "catDog", label: "Ataque de gato/perro" },
  { key: "canNotMove", label: "No se mueve bien" },
  { key: "roadRisk", label: "Peligro en carretera" },
  { key: "ringGps", label: "Anilla / GPS" },
  { key: "trapped", label: "Atrapado" },
  { key: "cannotFly", label: "No vuela" },
  { key: "weakness", label: "Debilidad / decaimiento" },
  { key: "normalAppearance", label: "Apariencia normal" },
  { key: "breathing", label: "Respiración agitada" },
  { key: "other", label: "Otro" },
];

const NATIONAL_HELP_CONTACTS = [
  { name: "Emergencias", phone: "112", note: "Emergencias generales" },
  {
    name: "SEPRONA",
    phone: "062",
    note: "Guardia Civil · Protección de la naturaleza",
  },
  {
    name: "Policía Municipal / Local",
    phone: "092",
    note: "Policía local del municipio",
  },
  { name: "Policía Nacional", phone: "091", note: "Atención policial" },
];

const MADRID_PROVINCE_CONTACTS = [
  {
    name: "GREFA guardia",
    phone: "648 53 99 01",
    note: "Guardia para avisos de fauna salvaje herida",
  },
  {
    name: "GREFA central",
    phone: "91 638 75 50",
    note: "Teléfono general del centro",
  },
  {
    name: "CRAS Madrid",
    phone: "91 276 06 26",
    note: "Centro de Recuperación de Animales Silvestres de la Comunidad de Madrid",
  },
  {
    name: "Agentes Forestales de Madrid",
    phone: "900 181 628",
    note: "Avisos e incidencias sobre fauna y medio natural",
  },
];

function canUseCannotFly(animalType: AnimalType) {
  return (
    animalType === "smallBird" ||
    animalType === "largeBird" ||
    animalType === "bat" ||
    animalType === "unknown"
  );
}

function getAdvice(
  animalState: AnimalState,
  animalType: AnimalType,
  flags: FlagsState,
) {
  if (animalState === "dead") {
    return "No lo toques ni modifiques el escenario del cadáver porque puede servir como prueba para una investigación pericial o judicial. Observa si encuentras algo extraño alrededor y comunícalo a los agentes de seguridad, a los agentes forestales o a emergencias.";
  }

  if (animalType === "smallBird") {
    if (
      flags.bleeding ||
      flags.catDog ||
      flags.canNotMove ||
      flags.roadRisk ||
      flags.trapped ||
      flags.cannotFly ||
      flags.weakness ||
      flags.breathing ||
      flags.other
    ) {
      return "Parece un caso que puede requerir valoración o ingreso. Colócalo en una caja de cartón cerrada y ventilada, en silencio, sin ruidos y protegido del frío o del calor extremo. No le des comida ni agua sin indicación. Contacta con un centro especializado como GREFA, Agentes Forestales o Emergencias, y facilita toda esta información resumida en el siguiente paso o envíala por WhatsApp.";
    }

    if (flags.baby) {
      return "Puede ser un volantón. Observa antes de recogerlo. Si no hay peligro inmediato, los padres pueden seguir atendiéndolo cerca. Si necesitas retirarlo, colócalo en una caja de cartón cerrada y ventilada, en un lugar tranquilo, sin ruido y protegido del frío o del calor extremo. Contacta con un centro especializado como GREFA, Agentes Forestales o Emergencias, y facilita toda esta información resumida en el siguiente paso o envíala por WhatsApp.";
    }

    return "Si no vuela o parece débil, colócalo en una caja de cartón cerrada y ventilada, en un lugar tranquilo, sin ruido y protegido del frío o del calor extremo. Evita manipularlo más de lo necesario y no le des comida ni agua sin indicación. Contacta con un centro especializado como GREFA, Agentes Forestales o Emergencias, y facilita toda esta información resumida en el siguiente paso o envíala por WhatsApp.";
  }

  if (animalType === "largeBird") {
    return "Precaución: una rapaz o ave grande puede lesionarte con pico, alas o garras. No la manipules salvo peligro inmediato. Si es imprescindible, usa una manta o toalla gruesa. Mantenla apartada de ruido, estrés y de temperaturas extremas. Contacta con un centro especializado como GREFA, Agentes Forestales o Emergencias, y facilita toda esta información resumida en el siguiente paso o envíala por WhatsApp.";
  }

  if (animalType === "bat") {
    return "No lo toques con la mano desnuda. Usa guantes o una tela. Colócalo en una caja de cartón cerrada y ventilada, sin ruidos y protegido del frío o del calor extremo. Evita manipularlo más de lo necesario. Contacta con un centro especializado como GREFA, Agentes Forestales o Emergencias, y facilita toda esta información resumida en el siguiente paso o envíala por WhatsApp.";
  }

  if (animalType === "smallMammal") {
    if (
      flags.bleeding ||
      flags.catDog ||
      flags.canNotMove ||
      flags.roadRisk ||
      flags.trapped ||
      flags.cannotFly ||
      flags.weakness ||
      flags.breathing ||
      flags.other
    ) {
      return "Parece un caso que puede requerir valoración o ingreso. Manipula lo mínimo. Colócalo en una caja de cartón cerrada y ventilada o recipiente seguro ventilado, tranquilo y protegido del frío o del calor extremo. No le des comida ni agua sin indicación. Contacta con un centro especializado como GREFA, Agentes Forestales o Emergencias, y facilita toda esta información resumida en el siguiente paso o envíala por WhatsApp.";
    }

    if (flags.baby) {
      return "Si es una cría, manipúlala lo mínimo. Colócala en una caja de cartón cerrada y ventilada con calor suave, en silencio, sin ruidos y protegida del frío o del calor extremo. No la alimentes salvo indicación expresa. Contacta con un centro especializado como GREFA, Agentes Forestales o Emergencias, y facilita toda esta información resumida en el siguiente paso o envíala por WhatsApp.";
    }

    return "Manipula lo mínimo. Colócalo en una caja de cartón cerrada y ventilada o recipiente seguro ventilado, tranquilo y protegido del frío o del calor extremo. No le des comida ni agua sin indicación. Contacta con un centro especializado como GREFA, Agentes Forestales o Emergencias, y facilita toda esta información resumida en el siguiente paso o envíala por WhatsApp.";
  }

  if (animalType === "largeMammal") {
    return "No intentes capturarlo ni acercarte más de lo necesario. Puede reaccionar con miedo o agresividad. Mantén distancia, evita acorralarlo y procura que quede apartado de ruido, estrés y peligro inmediato. Contacta con un centro especializado como GREFA, Agentes Forestales o Emergencias, y facilita toda esta información resumida en el siguiente paso o envíala por WhatsApp.";
  }

  if (animalType === "reptileAmphibian") {
    return "Evita manipularlo salvo riesgo inmediato. Mantenlo en un recipiente seguro y ventilado o en una zona protegida, sin ruido y evitando frío o calor extremo. Contacta con un centro especializado como GREFA, Agentes Forestales o Emergencias, y facilita toda esta información resumida en el siguiente paso o envíala por WhatsApp.";
  }

  return "Si no sabes qué animal es, mantén distancia, evita manipularlo y no le des comida ni agua. Si es necesario moverlo por seguridad, mantenlo en un lugar tranquilo, sin ruido y protegido del frío o del calor extremo. Contacta con un centro especializado como GREFA, Agentes Forestales o Emergencias, y facilita toda esta información resumida en el siguiente paso o envíala por WhatsApp.";
}

function normalizePhone(phone: string) {
  return phone.replace(/[^\d+]/g, "");
}

function normalizeWhatsAppNumber(phone: string) {
  let normalized = phone.replace(/[^\d+]/g, "").trim();

  if (!normalized) return "";
  if (normalized.startsWith("+")) normalized = normalized.slice(1);
  if (normalized.startsWith("00")) normalized = normalized.slice(2);

  return normalized.replace(/[^\d]/g, "");
}

function countDigits(phone: string) {
  return (phone.match(/\d/g) || []).length;
}

function isValidPhone(phone: string) {
  const normalized = normalizePhone(phone);
  const plusCount = (normalized.match(/\+/g) || []).length;

  if (plusCount > 1) return false;
  if (normalized.includes("+") && !normalized.startsWith("+")) return false;

  return countDigits(normalized) >= 9;
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState<Step>(1);
  const [showWelcome, setShowWelcome] = useState(true);

  const [showContacts, setShowContacts] = useState(false);
  const [showWhatsAppOptions, setShowWhatsAppOptions] = useState(false);
  const [showProvinces, setShowProvinces] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [provinceSearch, setProvinceSearch] = useState("");

  const [customWhatsAppNumber, setCustomWhatsAppNumber] = useState("");
  const [hasSentWhatsApp, setHasSentWhatsApp] = useState(false);
  const [hasOpenedHelpPhones, setHasOpenedHelpPhones] = useState(false);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [animalState, setAnimalState] = useState<AnimalState>("alive");
  const [animalType, setAnimalType] = useState<AnimalType>("unknown");

  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [videoUri, setVideoUri] = useState<string | null>(null);

  const [locationText, setLocationText] = useState(
    "Ubicación no capturada todavía.",
  );
  const [coords, setCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [locationCaptured, setLocationCaptured] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null);
  const [scrollY, setScrollY] = useState(0);
  const [scrollContentHeight, setScrollContentHeight] = useState(0);
  const [scrollLayoutHeight, setScrollLayoutHeight] = useState(0);
  const [flags, setFlags] = useState<FlagsState>({
    bleeding: false,
    baby: false,
    catDog: false,
    canNotMove: false,
    roadRisk: false,
    ringGps: false,
    trapped: false,
    cannotFly: false,
    weakness: false,
    normalAppearance: false,
    breathing: false,
    other: false,
  });

  const advice = useMemo(
    () => getAdvice(animalState, animalType, flags),
    [animalState, animalType, flags],
  );

  const selectedFlags = useMemo(
    () =>
      FLAG_LABELS.filter(({ key }) => flags[key])
        .map(({ label }) => label)
        .join(", ") || "Sin marcas",
    [flags],
  );

  const selectedAnimalLabel = useMemo(
    () =>
      ANIMAL_OPTIONS.find((option) => option.key === animalType)?.label ||
      "No indicado",
    [animalType],
  );

  const selectedAnimalStateLabel = useMemo(
    () =>
      ANIMAL_STATE_OPTIONS.find((option) => option.key === animalState)
        ?.label || "No indicado",
    [animalState],
  );

  const mergedProvinceContacts = useMemo(() => {
    const madridEntry = {
      province: "Madrid",
      contacts: MADRID_PROVINCE_CONTACTS,
    };
    const base = Array.isArray(provinceContacts) ? provinceContacts : [];
    const withoutMadrid = base.filter((item) => item.province !== "Madrid");

    return [madridEntry, ...withoutMadrid].sort((a, b) =>
      a.province.localeCompare(b.province, "es"),
    );
  }, []);

  const filteredProvinceContacts = useMemo(() => {
    const normalizedSearch = provinceSearch.trim().toLowerCase();

    if (!normalizedSearch) return mergedProvinceContacts;

    return mergedProvinceContacts.filter((item) =>
      item.province
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .includes(
          normalizedSearch.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
        ),
    );
  }, [provinceSearch, mergedProvinceContacts]);

  const showStep5ActionBar =
    !showWelcome &&
    step === 5 &&
    !showContacts &&
    !showWhatsAppOptions &&
    !showProvinces &&
    !selectedProvince;

  const canShowStep1ScrollHint =
    !showWelcome &&
    step === 1 &&
    !showContacts &&
    !showWhatsAppOptions &&
    !showProvinces &&
    !selectedProvince &&
    scrollContentHeight > scrollLayoutHeight + 40;

  const isNearBottom =
    scrollY + scrollLayoutHeight >= scrollContentHeight - 80;

  useEffect(() => {
    setScrollY(0);
    requestAnimationFrame(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    });
  }, [
    step,
    showContacts,
    showWhatsAppOptions,
    showProvinces,
    selectedProvince,
    showWelcome,
  ]);

  const generatedSummary = useMemo(() => {
    const mapsUrl = coords
      ? `https://maps.google.com/?q=${coords.latitude},${coords.longitude}`
      : "Sin ubicación";

    return [
      "AVISO DE RESCATE DE FAUNA",
      `Nombre: ${fullName || "No indicado"}`,
      `Teléfono: ${phone || "No indicado"}`,
      `Estado del animal: ${selectedAnimalStateLabel}`,
      `Tipo de animal: ${selectedAnimalLabel}`,
      `Ubicación: ${locationText}`,
      `Mapa: ${mapsUrl}`,
      `Situación observada: ${selectedFlags}`,
      flags.other ? "Situación adicional: Otro" : null,
      `Foto capturada: ${photoUri ? "sí" : "no"}`,
      `Vídeo capturado: ${videoUri ? "sí" : "no"}`,
    ]
      .filter(Boolean)
      .join("\n");
  }, [
    coords,
    flags.other,
    fullName,
    locationText,
    phone,
    photoUri,
    selectedAnimalLabel,
    selectedAnimalStateLabel,
    selectedFlags,
    videoUri,
  ]);

  const saveToGallery = async (uri: string, label: string) => {
    try {
      const permission = await MediaLibrary.requestPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Permiso recomendado",
          `No se ha concedido permiso para guardar ${label} en la galería.`,
        );
        return;
      }

      await MediaLibrary.saveToLibraryAsync(uri);
    } catch {
      Alert.alert(
        "No se pudo guardar",
        `No se pudo guardar ${label} en la galería del dispositivo.`,
      );
    }
  };

  const pickPhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permiso necesario",
        "Necesitamos acceso a la cámara para capturar la foto.",
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      quality: 0.7,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setPhotoUri(uri);
      await saveToGallery(uri, "la foto");
    }
  };

  const pickVideo = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permiso necesario",
        "Necesitamos acceso a la cámara para grabar el vídeo.",
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["videos"],
      quality: 0.7,
      videoMaxDuration: 20,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setVideoUri(uri);
      await saveToGallery(uri, "el vídeo");
    }
  };

  const captureLocation = async () => {
    try {
      setLocationLoading(true);

      const permission = await Location.requestForegroundPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Permiso necesario",
          "Necesitamos tu ubicación para enviar el aviso.",
        );
        return;
      }

      const current = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setCoords({
        latitude: current.coords.latitude,
        longitude: current.coords.longitude,
      });

      setLocationText(
        `${current.coords.latitude.toFixed(5)}, ${current.coords.longitude.toFixed(5)}`,
      );
      setLocationCaptured(true);
    } catch {
      Alert.alert(
        "No se pudo obtener la ubicación",
        "Inténtalo de nuevo en unos segundos.",
      );
    } finally {
      setLocationLoading(false);
    }
  };

  const hasCriticalHealthFlag = (nextFlags: FlagsState) =>
    nextFlags.bleeding ||
    nextFlags.catDog ||
    nextFlags.canNotMove ||
    nextFlags.trapped ||
    nextFlags.cannotFly ||
    nextFlags.weakness ||
    nextFlags.breathing;

  const toggleFlag = (key: keyof FlagsState) => {
    if (
      key === "cannotFly" &&
      !flags.cannotFly &&
      !canUseCannotFly(animalType)
    ) {
      Alert.alert(
        "Revisa el tipo de animal",
        'La opción "No vuela" solo tiene sentido para aves o murciélagos. Cambia primero el tipo de animal si corresponde.',
      );
      return;
    }

    setFlags((prev) => {
      const nextFlags = {
        ...prev,
        [key]: !prev[key],
      };

      if (
        nextFlags.normalAppearance &&
        hasCriticalHealthFlag(nextFlags) &&
        !prev[key]
      ) {
        Alert.alert(
          "Revisa la selección",
          'Has elegido "Apariencia normal" junto con una señal de posible problema. Revisa si es correcto antes de continuar.',
        );
      }

      return nextFlags;
    });
  };

  const selectAnimalType = (nextAnimalType: AnimalType) => {
    if (flags.cannotFly && !canUseCannotFly(nextAnimalType)) {
      Alert.alert(
        "Situación no compatible",
        'Has marcado "No vuela", pero el tipo seleccionado no parece compatible. Se desmarcará esa opción para evitar confusión.',
      );
      setFlags((prev) => ({ ...prev, cannotFly: false }));
    }

    setAnimalType(nextAnimalType);
  };

  const openWhatsAppWithNumber = async (number: string) => {
    const cleaned = normalizeWhatsAppNumber(number);

    if (!cleaned || countDigits(cleaned) < 9) {
      Alert.alert(
        "Número no válido",
        "Introduce un número de WhatsApp válido, con prefijo si hace falta.",
      );
      return;
    }

    const text = encodeURIComponent(generatedSummary);
    const urls = [
      `whatsapp://send?phone=${cleaned}&text=${text}`,
      `https://wa.me/${cleaned}?text=${text}`,
      `https://api.whatsapp.com/send?phone=${cleaned}&text=${text}`,
    ];

    for (const url of urls) {
      try {
        await Linking.openURL(url);
        setHasSentWhatsApp(true);
        return;
      } catch {
        // Probar la siguiente opción
      }
    }

    Alert.alert(
      "No se pudo abrir WhatsApp",
      "Comprueba que WhatsApp está instalado y vuelve a intentarlo.",
    );
  };

  const openMaps = async () => {
    if (!coords) return;

    const url = `https://maps.google.com/?q=${coords.latitude},${coords.longitude}`;
    await Linking.openURL(url);
  };

  const copySummary = async () => {
    await Clipboard.setStringAsync(generatedSummary);
    Alert.alert("Resumen copiado", "El resumen se ha copiado al portapapeles.");
  };

  const callNumber = async (phoneNumber: string) => {
    const url = `tel:${phoneNumber}`;
    await Linking.openURL(url);
  };

  const resetFlow = (returnToWelcome = false) => {
    setShowWelcome(returnToWelcome);
    setStep(1);
    setShowContacts(false);
    setShowWhatsAppOptions(false);
    setShowProvinces(false);
    setSelectedProvince(null);
    setCustomWhatsAppNumber("");
    setHasSentWhatsApp(false);
    setHasOpenedHelpPhones(false);
    setFullName("");
    setPhone("");
    setAnimalState("alive");
    setAnimalType("unknown");
    setPhotoUri(null);
    setVideoUri(null);
    setLocationText("Ubicación no capturada todavía.");
    setCoords(null);
    setLocationCaptured(false);
    setLocationLoading(false);
    setProvinceSearch("");
    setFlags({
      bleeding: false,
      baby: false,
      catDog: false,
      canNotMove: false,
      roadRisk: false,
      ringGps: false,
      trapped: false,
      cannotFly: false,
      weakness: false,
      normalAppearance: false,
      breathing: false,
      other: false,
    });
  };

  const confirmCancelFlow = () => {
    Alert.alert(
      "Cancelar aviso",
      "¿Estás seguro de que deseas cancelar este aviso?\n\nSe perderá toda la información introducida y volverás a la pantalla inicial.",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Sí",
          onPress: () => resetFlow(true),
        },
      ]
    );
  };

  const finishFlow = () => {
    Alert.alert(
      "Finalizar aviso",
      "¿Estás seguro de que deseas finalizar este aviso?\n\nSi continúas se eliminará toda la información introducida y volverás a la pantalla inicial.",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Sí",
          onPress: () => {
            Alert.alert(
              "Gracias",
              "Gracias por colaborar y ayudar a los animales.",
              [
                {
                  text: "Aceptar",
                  onPress: () => resetFlow(true),
                },
              ]
            );
          },
        },
      ]
    );
  };

  const validateStep = () => {
    if (step === 3) {
      if (!fullName.trim()) {
        Alert.alert(
          "Falta el nombre",
          "Introduce tu nombre y apellidos antes de continuar.",
        );
        return false;
      }

      if (!phone.trim()) {
        Alert.alert(
          "Falta el teléfono",
          "Introduce un teléfono de contacto antes de continuar.",
        );
        return false;
      }

      if (!isValidPhone(phone)) {
        Alert.alert(
          "Teléfono no válido",
          "Introduce un teléfono válido, con al menos 9 dígitos.",
        );
        return false;
      }
    }

    if (step === 4) {
      if (!photoUri && !videoUri && !locationCaptured) {
        Alert.alert(
          "Información incompleta",
          "Conviene añadir al menos una foto, un vídeo o capturar la ubicación antes de continuar.",
        );
        return false;
      }
    }

    return true;
  };

  const goNext = () => {
    if (!validateStep()) return;
    if (step < 5) setStep((prev) => (prev + 1) as Step);
  };

  const goBack = () => {
    if (showWhatsAppOptions) {
      setShowWhatsAppOptions(false);
      return;
    }

    if (selectedProvince) {
      setSelectedProvince(null);
      return;
    }

    if (showProvinces) {
      setShowProvinces(false);
      return;
    }

    if (showContacts) {
      setShowContacts(false);
      return;
    }

    if (step > 1) {
      setStep((prev) => (prev - 1) as Step);
    }
  };

  const handleOpenHelp = () => {
    setHasOpenedHelpPhones(true);
    setShowContacts(true);
    setShowProvinces(false);
    setSelectedProvince(null);
  };

  const handleOpenProvincePhones = () => {
    setShowContacts(false);
    setShowProvinces(true);
    setSelectedProvince(null);
    setProvinceSearch("");
  };

  const renderContacts = () => (
    <SectionCard title="Teléfonos de ayuda">
      <View style={styles.sectionContent}>
        <Text style={styles.sectionDescription}>
          Aquí tienes primero los teléfonos nacionales y, debajo, el acceso a
          contactos por provincias.
        </Text>

        {NATIONAL_HELP_CONTACTS.map((contact) => (
          <Pressable
            key={contact.name}
            style={styles.contactRow}
            onPress={() => callNumber(contact.phone)}
          >
            <View style={styles.contactTextBlock}>
              <Text style={styles.contactName}>{contact.name}</Text>
              <Text style={styles.contactNote}>{contact.note}</Text>
            </View>
            <Text style={styles.contactPhone}>{contact.phone}</Text>
          </Pressable>
        ))}

        <Pressable
          style={styles.secondaryButton}
          onPress={handleOpenProvincePhones}
        >
          <Text style={styles.secondaryButtonText}>
            Teléfonos de ayuda por provincias
          </Text>
        </Pressable>
      </View>
    </SectionCard>
  );

  const renderProvinceList = () => (
    <SectionCard title="Teléfonos por provincias">
      <View style={styles.sectionContent}>
        <Text style={styles.sectionDescription}>
          Selecciona una provincia para ver los centros disponibles.
        </Text>

        <TextInput
          placeholder="Buscar provincia"
          value={provinceSearch}
          onChangeText={setProvinceSearch}
          style={styles.input}
          autoCapitalize="words"
        />

        {filteredProvinceContacts.length ? (
          filteredProvinceContacts.map((item) => (
            <Pressable
              key={item.province}
              style={styles.contactRow}
              onPress={() => setSelectedProvince(item.province)}
            >
              <View style={styles.contactTextBlock}>
                <Text style={styles.contactName}>{item.province}</Text>
                <Text style={styles.contactNote}>
                  {item.contacts.length} contacto
                  {item.contacts.length === 1 ? "" : "s"}
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

  const renderProvinceDetail = () => {
    const province = mergedProvinceContacts.find(
      (p) => p.province === selectedProvince,
    );

    if (!province) return null;

    return (
      <SectionCard title={province.province}>
        <View style={styles.sectionContent}>
          <Text style={styles.sectionDescription}>
            Estos son los contactos disponibles para esta provincia.
          </Text>

          {province.contacts.map((contact) => (
            <Pressable
              key={`${province.province}-${contact.name}-${contact.phone}`}
              style={styles.contactRow}
              onPress={() => callNumber(contact.phone)}
            >
              <View style={styles.contactTextBlock}>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactNote}>{contact.note}</Text>
              </View>
              <Text style={styles.contactPhone}>{contact.phone}</Text>
            </Pressable>
          ))}
        </View>
      </SectionCard>
    );
  };

  const renderWhatsAppOptions = () => (
    <SectionCard title="Enviar por WhatsApp">
      <View style={styles.sectionContent}>
        <Text style={styles.sectionDescription}>
          El resumen está listo para WhatsApp. Pulsa la flecha izquierda para
          volver, o Cancelar para descartar el aviso.
        </Text>

        <Pressable
          style={styles.primaryButton}
          onPress={() => openWhatsAppWithNumber(GREFA_WHATSAPP)}
        >
          <Text style={styles.primaryButtonText}>Enviar a GREFA</Text>
        </Pressable>

        <TextInput
          placeholder="Otro número de WhatsApp"
          value={customWhatsAppNumber}
          onChangeText={setCustomWhatsAppNumber}
          keyboardType="phone-pad"
          style={styles.input}
        />

        <Pressable
          style={styles.secondaryButton}
          onPress={() => openWhatsAppWithNumber(customWhatsAppNumber)}
        >
          <Text style={styles.secondaryButtonText}>Enviar a otro número</Text>
        </Pressable>

        <Pressable
          style={[
            styles.primaryButton,
            !hasSentWhatsApp && styles.disabledButton,
          ]}
          onPress={finishFlow}
          disabled={!hasSentWhatsApp}
        >
          <Text style={styles.primaryButtonText}>Finalizar</Text>
        </Pressable>

        <Pressable style={styles.secondaryButton} onPress={confirmCancelFlow}>
          <Text style={styles.secondaryButtonText}>Cancelar</Text>
        </Pressable>
      </View>
    </SectionCard>
  );

  const renderStep5ActionBar = () => {
    if (
      showWhatsAppOptions ||
      showContacts ||
      showProvinces ||
      showWelcome ||
      selectedProvince ||
      step !== 5
    ) {
      return null;
    }

    if (animalState === "dead") {
      return (
        <View style={styles.step5ActionBar}>
          <Pressable style={styles.menuActionButton} onPress={copySummary}>
            <Text style={styles.menuActionEmoji}>📋</Text>
            <Text style={styles.menuActionLabel}>Copiar</Text>
          </Pressable>

          <Pressable style={styles.menuActionButton} onPress={handleOpenHelp}>
            <Text style={styles.menuActionEmoji}>📞</Text>
            <Text style={styles.menuActionLabel}>Ayuda</Text>
          </Pressable>

          <Pressable
            style={[styles.menuActionButton, styles.menuActionButtonPrimary]}
            onPress={finishFlow}
          >
            <Text style={styles.menuActionEmoji}>✅</Text>
            <Text style={styles.menuActionLabelPrimary}>Finalizar</Text>
          </Pressable>
        </View>
      );
    }

    return (
      <View style={styles.step5ActionBar}>
        <Pressable
          style={[styles.menuActionButton, styles.menuActionButtonPrimary]}
          onPress={() => setShowWhatsAppOptions(true)}
        >
          <Text style={styles.menuActionEmoji}>🟢</Text>
          <Text style={styles.menuActionLabelPrimary}>WhatsApp</Text>
        </Pressable>

        <Pressable style={styles.menuActionButton} onPress={copySummary}>
          <Text style={styles.menuActionEmoji}>📋</Text>
          <Text style={styles.menuActionLabel}>Copiar</Text>
        </Pressable>

        <Pressable style={styles.menuActionButton} onPress={handleOpenHelp}>
          <Text style={styles.menuActionEmoji}>📞</Text>
          <Text style={styles.menuActionLabel}>Ayuda</Text>
        </Pressable>

        <Pressable
          style={[styles.menuActionButton, styles.menuActionButtonPrimarySoft]}
          onPress={finishFlow}
        >
          <Text style={styles.menuActionEmoji}>✅</Text>
          <Text style={styles.menuActionLabelPrimary}>Finalizar</Text>
        </Pressable>
      </View>
    );
  };

  const renderNavigationArrows = () => {
    if (showWelcome) return null;

    const isOverlayOpen =
      showContacts ||
      showWhatsAppOptions ||
      showProvinces ||
      !!selectedProvince;
    const canShowBackArrow = isOverlayOpen || step > 1;
    const canShowForwardArrow = !isOverlayOpen && step < 5;

    return (
      <View pointerEvents="box-none" style={styles.sideNavOverlay}>
        {canShowBackArrow ? (
          <Pressable style={styles.sideArrowLeft} onPress={goBack}>
            <Text style={styles.sideArrowText}>‹</Text>
          </Pressable>
        ) : (
          <View style={styles.sideArrowPlaceholder} />
        )}

        {canShowForwardArrow ? (
          <Pressable style={styles.sideArrowRight} onPress={goNext}>
            <Text style={styles.sideArrowText}>›</Text>
          </Pressable>
        ) : (
          <View style={styles.sideArrowPlaceholder} />
        )}
      </View>
    );
  };

  const renderWelcome = () => (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardAvoid}
      keyboardVerticalOffset={90}
    >
      <SectionCard title="SOS Fauna">
        <View style={styles.welcomeContent}>
          <Text style={styles.welcomeTitle}>
            Asistente de rescate de fauna silvestre
          </Text>

          <Text style={styles.welcomeVersion}>Versión 1.0.0</Text>

          <View style={styles.welcomeScopeBox}>
            <Text style={styles.welcomeScopeText}>
              Aplicación de apoyo para comunicar incidencias con fauna silvestre. Solo cubre España.
            </Text>
            <Text style={styles.welcomeScopeSmall}>
              Los contactos y teléfonos incluidos están orientados al ámbito español.
            </Text>
          </View>

          <View style={styles.warningBox}>
            <Text style={styles.warningText}>
              La información proporcionada por esta aplicación es orientativa y no sustituye el criterio de veterinarios, agentes medioambientales ni servicios de emergencia.
            </Text>
          </View>

          <View
            style={{
              backgroundColor: "#f3f4f6",
              borderWidth: 1,
              borderColor: "#d1d5db",
              borderRadius: 12,
              padding: 12,
              gap: 6,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "700",
                color: "#374151",
              }}
            >
              Información importante
            </Text>
          
            <Text
              style={{
                fontSize: 13,
                lineHeight: 18,
                color: "#4b5563",
              }}
            >
              • Esta aplicación es un proyecto independiente de apoyo al rescate de fauna silvestre.
            </Text>
          
            <Text
              style={{
                fontSize: 13,
                lineHeight: 18,
                color: "#4b5563",
              }}
            >
              • No es una aplicación oficial de GREFA ni de ninguna administración pública.
            </Text>
          
            <Text
              style={{
                fontSize: 13,
                lineHeight: 18,
                color: "#4b5563",
              }}
            >
              • Los teléfonos mostrados proceden de fuentes públicas de organismos y entidades dedicadas a la atención de fauna silvestre.
            </Text>
          
            <Text
              style={{
                fontSize: 13,
                lineHeight: 18,
                color: "#4b5563",
              }}
            >
              • Los datos introducidos permanecen en el dispositivo y solo se comparten cuando el usuario decide enviarlos.
            </Text>
          </View>


          <Pressable
            style={styles.primaryButton}
            onPress={() => setShowWelcome(false)}
          >
            <Text style={styles.primaryButtonText}>Comenzar aviso</Text>
          </Pressable>

          <Text style={styles.welcomeFooter}>
            Desarrollado como proyecto de apoyo a la conservación y rescate de fauna silvestre.
          </Text>
        </View>
      </SectionCard>
    </KeyboardAvoidingView>
  );

  const renderStep = () => {
    if (showWelcome) return renderWelcome();
    if (showContacts) return renderContacts();
    if (showProvinces && !selectedProvince) return renderProvinceList();
    if (selectedProvince) return renderProvinceDetail();
    if (showWhatsAppOptions) return renderWhatsAppOptions();

    if (step === 1) {
      return (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoid}
          keyboardVerticalOffset={90}
        >
          <SectionCard title="Paso 1. Tipo y situación del animal">
            <View style={styles.sectionContent}>
              <Text style={styles.sectionDescription}>
                Indica primero si el animal está vivo o muerto. Después completa
                solo los datos que correspondan.
              </Text>

              <View style={styles.sectionGroup}>
                <Text style={styles.subheading}>Estado del animal</Text>
                <View style={styles.flagGrid}>
                  {ANIMAL_STATE_OPTIONS.map((option) => {
                    const active = animalState === option.key;

                    return (
                      <Pressable
                        key={option.key}
                        style={[styles.flag, active && styles.flagActive]}
                        onPress={() => {
                          setAnimalState(option.key);

                          if (option.key === "dead") {
                            setAnimalType("unknown");
                            setFlags({
                              bleeding: false,
                              baby: false,
                              catDog: false,
                              canNotMove: false,
                              roadRisk: false,
                              ringGps: false,
                              trapped: false,
                              cannotFly: false,
                              weakness: false,
                              normalAppearance: false,
                              breathing: false,
                              other: false,
                            });
                          }
                        }}
                      >
                        <Text
                          style={[
                            styles.flagText,
                            active && styles.flagTextActive,
                          ]}
                        >
                          {option.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              {animalState === "dead" ? (
                <View style={styles.warningBox}>
                  <Text style={styles.warningText}>
                    Si el animal está muerto, no lo toques ni modifiques el
                    lugar. Continúa para ver qué hacer.
                  </Text>
                </View>
              ) : (
                <>
                  <View style={styles.sectionGroup}>
                    <Text style={styles.subheading}>Tipo de animal</Text>
                    <View style={styles.flagGrid}>
                      {ANIMAL_OPTIONS.map((option) => {
                        const active = animalType === option.key;

                        return (
                          <Pressable
                            key={option.key}
                            style={[styles.flag, active && styles.flagActive]}
                            onPress={() => selectAnimalType(option.key)}
                          >
                            <Text
                              style={[
                                styles.flagText,
                                active && styles.flagTextActive,
                              ]}
                            >
                              {option.label}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  </View>

                  <View style={styles.sectionGroup}>
                    <Text style={styles.subheading}>Situación observada</Text>
                    <View style={styles.flagGrid}>
                      {FLAG_LABELS.map(({ key, label }) => {
                        const active = flags[key];

                        return (
                          <Pressable
                            key={key}
                            style={[styles.flag, active && styles.flagActive]}
                            onPress={() => toggleFlag(key)}
                          >
                            <Text
                              style={[
                                styles.flagText,
                                active && styles.flagTextActive,
                              ]}
                            >
                              {label}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  </View>
                </>
              )}
            </View>
          </SectionCard>
        </KeyboardAvoidingView>
      );
    }

    if (step === 2) {
      return (
        <SectionCard title="Paso 2. Qué hacer ahora">
          <View style={styles.sectionContent}>
            <Text style={styles.sectionDescription}>
              Sigue estas recomendaciones antes de actuar o mover al animal.
            </Text>

            <Text style={[styles.summaryBox, styles.adviceBox]}>{advice}</Text>
          </View>
        </SectionCard>
      );
    }

    if (step === 3) {
      return (
        <SectionCard title="Paso 3. Datos de contacto">
          <View style={styles.sectionContent}>
            <Text style={styles.sectionDescription}>
              Facilita tu nombre para que los especialistas sepan a quién
              dirigirse y un número de teléfono en caso de que necesiten ponerse
              en contacto contigo.
            </Text>

            <TextInput
              placeholder="Nombre y apellidos"
              value={fullName}
              onChangeText={setFullName}
              style={styles.input}
            />

            <TextInput
              placeholder="Teléfono de contacto"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              style={styles.input}
            />

            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                Tus datos no se almacenan en esta app ni se usan para ningún
                otro fin.
              </Text>
            </View>

            <View style={styles.inlineActionRow}>
              <Pressable
                style={styles.secondaryButtonSmall}
                onPress={resetFlow}
              >
                <Text style={styles.secondaryButtonText}>↺ Limpiar</Text>
              </Pressable>
            </View>
          </View>
        </SectionCard>
      );
    }

    if (step === 4) {
      return (
        <SectionCard title="Paso 4. Foto, vídeo y ubicación">
          <View style={styles.sectionContent}>
            <Text style={styles.sectionDescription}>
              Captura una foto y/o un vídeo y obtén la ubicación del hallazgo.
            </Text>

            <Pressable style={styles.primaryButton} onPress={pickPhoto}>
              <Text style={styles.primaryButtonText}>
                {photoUri ? "Cambiar foto" : "Hacer foto"}
              </Text>
            </Pressable>

            <Pressable style={styles.primaryButton} onPress={pickVideo}>
              <Text style={styles.primaryButtonText}>
                {videoUri ? "Cambiar vídeo" : "Grabar vídeo"}
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.secondaryButton,
                locationLoading && styles.disabledButton,
              ]}
              onPress={captureLocation}
              disabled={locationLoading}
            >
              <Text style={styles.secondaryButtonText}>
                {locationLoading
                  ? "Capturando ubicación…"
                  : "Capturar ubicación"}
              </Text>
            </Pressable>

            {locationCaptured ? (
              <View style={styles.successBox}>
                <Text style={styles.successText}>
                  Ubicación capturada correctamente
                </Text>
              </View>
            ) : null}

            <Text style={styles.helperText}>
              {photoUri
                ? "Foto capturada y guardada en el dispositivo"
                : "Sin foto todavía."}
            </Text>

            <Text style={styles.helperText}>
              {videoUri
                ? "Vídeo capturado y guardado en el dispositivo"
                : "Sin vídeo todavía."}
            </Text>

            <Text style={styles.helperText}>{locationText}</Text>

            <View style={styles.mapCard}>
              <Text style={styles.mapTitle}>Ubicación del hallazgo</Text>

              {coords ? (
                <>
                  <View style={styles.mapLocationBox}>
                    <Text style={styles.mapPin}>📍</Text>
                    <Text style={styles.mapLocationTitle}>
                      Punto capturado correctamente
                    </Text>
                    <Text style={styles.mapCoords}>
                      {coords.latitude.toFixed(5)}, {coords.longitude.toFixed(5)}
                    </Text>
                    <Text style={styles.mapEmptyText}>
                      Puedes abrir la ubicación en Google Maps para ver calles,
                      caminos y referencias cercanas.
                    </Text>
                  </View>

                  <Pressable style={styles.mapOpenButton} onPress={openMaps}>
                    <Text style={styles.mapOpenButtonText}>Abrir mapa</Text>
                  </Pressable>
                </>
              ) : (
                <View style={styles.mapEmptyBox}>
                  <Text style={styles.mapEmptyText}>
                    Captura la ubicación para ver aquí el punto del hallazgo.
                  </Text>
                </View>
              )}
            </View>
          </View>
        </SectionCard>
      );
    }

    if (animalState === "dead") {
      return (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoid}
          keyboardVerticalOffset={90}
        >
          <SectionCard title="Paso 5. Resumen">
            <View style={styles.sectionContent}>
              <Text style={styles.sectionDescription}>
                Lee el resumen y pulsa en Teléfonos de ayuda para llamar a los
                servicios de ayuda o emergencias más cercanos.
              </Text>

              <Text style={[styles.summaryBox, styles.summaryEditor]}>
                {generatedSummary}
              </Text>

              <View style={styles.warningBox}>
                <Text style={styles.warningText}>
                  Llama a Agentes Forestales, seguridad o emergencias según el
                  caso. Puedes copiar el resumen si te lo piden.
                </Text>
              </View>
            </View>
          </SectionCard>
        </KeyboardAvoidingView>
      );
    }

    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
        keyboardVerticalOffset={90}
      >
        <SectionCard title="Paso 5. Resumen">
          <View style={styles.sectionContent}>
            <View style={styles.step5Instructions}>
              <Text style={styles.bulletText}>
                • Revisa si el resumen es correcto o retrocede para corregir.
              </Text>
              <Text style={styles.bulletText}>
                • Usa <Text style={styles.bulletStrong}>WhatsApp</Text> para enviarlo a GREFA Madrid o a otro contacto que elijas.
              </Text>
              <Text style={styles.bulletText}>
                • Usa <Text style={styles.bulletStrong}>Ayuda</Text> para buscar el centro más cercano a tu provincia o servicios de emergencias.
              </Text>
              <Text style={styles.bulletText}>
                • Usa <Text style={styles.bulletStrong}>Finalizar</Text> si ya has informado a un especialista o para descartar el aviso.
              </Text>
            </View>

            <Text style={[styles.summaryBox, styles.summaryEditor]}>
              {generatedSummary}
            </Text>

            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                Importante: la foto y el vídeo no se adjuntan automáticamente.
                Deberás enviarlos manualmente desde WhatsApp.
              </Text>
            </View>
          </View>
        </SectionCard>
      </KeyboardAvoidingView>
    );
  };

  return (
    <SafeAreaView style={styles.screen} edges={["bottom"]}>
      <Stack.Screen options={{ title: "Rescate fauna - Asistente" }} />

      {showStep5ActionBar ? renderStep5ActionBar() : null}

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={[
          styles.container,
          {
            paddingTop: showStep5ActionBar ? 84 : 12,
            paddingBottom: Math.max(220, insets.bottom + 180),
          },
        ]}
        keyboardShouldPersistTaps="handled"
        onScroll={(event) => setScrollY(event.nativeEvent.contentOffset.y)}
        onContentSizeChange={(_, height) => setScrollContentHeight(height)}
        onLayout={(event) => setScrollLayoutHeight(event.nativeEvent.layout.height)}
        scrollEventThrottle={16}
      >
        {renderStep()}
      </ScrollView>

      {canShowStep1ScrollHint ? (
        <Pressable
          style={styles.floatingScrollHint}
          onPress={() =>
            scrollViewRef.current?.scrollTo({
              y: isNearBottom ? 0 : Math.max(0, scrollContentHeight - scrollLayoutHeight),
              animated: true,
            })
          }
        >
          <Text style={styles.floatingScrollHintText}>
            {isNearBottom ? "↑" : "↓"}
          </Text>
        </Pressable>
      ) : null}

      {renderNavigationArrows()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f3f7f4",
  },
  scrollView: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 26,
    paddingTop: 12,
    gap: 16,
  },
  keyboardAvoid: {
    flex: 1,
  },
  hero: {
    backgroundColor: "#e7f5ea",
    borderRadius: 18,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: "#cfe8d4",
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#14532d",
    color: "#ffffff",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    fontSize: 14,
    fontWeight: "800",
  },
  heroText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#374151",
  },
  stepIndicator: {
    fontSize: 13,
    fontWeight: "700",
    color: "#166534",
    marginTop: 4,
  },
  welcomeContent: {
    gap: 14,
  },
  welcomeTitle: {
    fontSize: 20,
    lineHeight: 27,
    fontWeight: "900",
    color: "#14532d",
  },
  welcomeVersion: {
    alignSelf: "flex-start",
    backgroundColor: "#e7f5ea",
    color: "#166534",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    fontSize: 13,
    fontWeight: "800",
  },
  welcomeScopeBox: {
    backgroundColor: "#eef8f0",
    borderWidth: 1,
    borderColor: "#b7dfc0",
    borderRadius: 14,
    padding: 12,
    gap: 6,
  },
  welcomeScopeText: {
    fontSize: 16,
    lineHeight: 23,
    color: "#111827",
    fontWeight: "700",
  },
  welcomeScopeSmall: {
    fontSize: 14,
    lineHeight: 20,
    color: "#374151",
  },
  welcomeFeatureList: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#dbe7dd",
    borderRadius: 14,
    padding: 12,
    gap: 8,
  },
  welcomeFeature: {
    fontSize: 15,
    lineHeight: 22,
    color: "#374151",
    fontWeight: "600",
  },
  welcomeFooter: {
    fontSize: 12,
    lineHeight: 18,
    color: "#6b7280",
    textAlign: "center",
  },
  sectionContent: {
    gap: 12,
  },
  sectionGroup: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#dbe7dd",
    borderRadius: 14,
    padding: 12,
    gap: 10,
  },
  sectionDescription: {
    fontSize: 15,
    color: "#4b5563",
    lineHeight: 22,
  },
  subheading: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginTop: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#ffffff",
  },
  summaryEditor: {
    minHeight: 184,
    lineHeight: 21,
    color: "#111827",
  },
  adviceBox: {
    fontSize: 18,
    lineHeight: 30,
    minHeight: 320,
    paddingTop: 18,
    paddingBottom: 18,
    backgroundColor: "#eef8f0",
    borderColor: "#b7dfc0",
  },
  primaryButton: {
    backgroundColor: "#14532d",
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: "#e5e7eb",
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
  },
  secondaryButtonSmall: {
    backgroundColor: "#e5e7eb",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    minWidth: 96,
  },
  secondaryButtonText: {
    color: "#111827",
    fontWeight: "600",
    fontSize: 16,
    textAlign: "center",
  },
  disabledButton: {
    opacity: 0.6,
  },
  helperText: {
    color: "#4b5563",
    fontSize: 13,
    lineHeight: 18,
  },
  successBox: {
    backgroundColor: "#dcfce7",
    borderWidth: 1,
    borderColor: "#16a34a",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  successText: {
    color: "#166534",
    fontWeight: "700",
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
  flagGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  flag: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#ffffff",
  },
  flagActive: {
    backgroundColor: "#dcfce7",
    borderColor: "#16a34a",
  },
  flagText: {
    color: "#111827",
    fontWeight: "600",
  },
  flagTextActive: {
    color: "#166534",
  },
  summaryBox: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 12,
    lineHeight: 22,
    color: "#111827",
  },
  inlineActionRow: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  step5ActionBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    elevation: 8,
    flexDirection: "row",
    alignItems: "stretch",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#f3f7f4",
    borderBottomWidth: 1,
    borderBottomColor: "#dbe7dd",
  },
  menuActionButton: {
    flex: 1,
    minHeight: 48,
    backgroundColor: "#e5e7eb",
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 4,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  menuActionButtonPrimary: {
    backgroundColor: "#14532d",
  },
  menuActionButtonPrimarySoft: {
    backgroundColor: "#166534",
  },
  menuActionEmoji: {
    fontSize: 15,
  },
  menuActionLabel: {
    color: "#111827",
    fontSize: 11,
    fontWeight: "800",
    textAlign: "center",
  },
  menuActionLabelPrimary: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "800",
    textAlign: "center",
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "space-between",
    rowGap: 10,
    columnGap: 8,
    flexWrap: "wrap",
    marginTop: 4,
  },
  iconActionButton: {
    flexBasis: "48%",
    minHeight: 68,
    backgroundColor: "#e5e7eb",
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  iconActionButtonFull: {
    flexBasis: "100%",
  },
  iconActionButtonPrimary: {
    backgroundColor: "#14532d",
  },
  iconActionButtonPrimarySoft: {
    backgroundColor: "#166534",
  },
  iconActionEmoji: {
    fontSize: 20,
  },
  iconActionLabel: {
    color: "#111827",
    fontSize: 14,
    fontWeight: "800",
    textAlign: "center",
  },
  iconActionLabelPrimary: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "800",
    textAlign: "center",
  },
  bottomHelpRow: {
    marginTop: 8,
  },
  navRowCenter: {
    marginTop: 8,
    alignItems: "center",
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
  contactTextBlock: {
    flex: 1,
  },
  contactName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },
  contactNote: {
    fontSize: 13,
    color: "#4b5563",
    marginTop: 2,
  },
  contactPhone: {
    fontSize: 14,
    fontWeight: "700",
    color: "#14532d",
  },

  step5Instructions: {
    backgroundColor: "#eef8f0",
    borderWidth: 1,
    borderColor: "#b7dfc0",
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  bulletText: {
    color: "#374151",
    fontSize: 15,
    lineHeight: 22,
  },
  bulletStrong: {
    color: "#14532d",
    fontWeight: "900",
  },
  mapCard: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#dbe7dd",
    borderRadius: 14,
    padding: 12,
    gap: 10,
  },
  mapTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111827",
  },
  mapLocationBox: {
    minHeight: 130,
    borderRadius: 14,
    backgroundColor: "#eef8f0",
    borderWidth: 1,
    borderColor: "#b7dfc0",
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    gap: 6,
  },
  mapPin: {
    fontSize: 30,
  },
  mapLocationTitle: {
    color: "#14532d",
    fontSize: 15,
    fontWeight: "900",
    textAlign: "center",
  },
  mapCoords: {
    color: "#374151",
    fontSize: 13,
    fontWeight: "700",
  },
  mapOpenButton: {
    flex: 1,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#14532d",
    alignItems: "center",
    justifyContent: "center",
  },
  mapOpenButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "800",
  },
  mapEmptyBox: {
    minHeight: 120,
    borderRadius: 14,
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
  },
  mapEmptyText: {
    color: "#4b5563",
    textAlign: "center",
    fontSize: 14,
    lineHeight: 20,
  },
  floatingScrollHint: {
    position: "absolute",
    right: 34,
    top: "64%",
    width: 32,
    height: 50,
    borderRadius: 999,
    backgroundColor: "#14532d",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 30,
    elevation: 6,
  },
  floatingScrollHintText: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "900",
  },
  sideNavOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    pointerEvents: "box-none",
  },
  sideArrowLeft: {
    position: "absolute",
    left: 0,
    width: 22,
    height: 120,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    backgroundColor: "#14532d",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },
  sideArrowRight: {
    position: "absolute",
    right: 0,
    width: 22,
    height: 120,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    backgroundColor: "#14532d",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },
  sideArrowPlaceholder: {
    width: 22,
    height: 120,
  },
  sideArrowText: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "800",
    lineHeight: 30,
  },
});
