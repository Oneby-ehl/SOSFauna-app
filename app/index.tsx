import * as Clipboard from 'expo-clipboard';
import * as ImagePicker from 'expo-image-picker';
import * as Linking from 'expo-linking';
import * as Location from 'expo-location';
import * as MediaLibrary from 'expo-media-library';
import { useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SectionCard } from '@/components/SectionCard';
import { emergencyContacts } from '@/lib/constants';

type FlagsState = {
  bleeding: boolean;
  baby: boolean;
  catDog: boolean;
  canNotMove: boolean;
  roadRisk: boolean;
  other: boolean;
};

type AnimalType =
  | 'smallBird'
  | 'largeBird'
  | 'bat'
  | 'smallMammal'
  | 'largeMammal'
  | 'reptileAmphibian'
  | 'unknown';

type AnimalState = 'alive' | 'dead' | 'unknown';

type Step = 1 | 2 | 3 | 4 | 5;

const GREFA_WHATSAPP = '34648539901';

const ANIMAL_OPTIONS: Array<{ key: AnimalType; label: string }> = [
  { key: 'smallBird', label: 'Ave pequeña' },
  { key: 'largeBird', label: 'Ave rapaz / ave grande' },
  { key: 'bat', label: 'Murciélago' },
  { key: 'smallMammal', label: 'Pequeño mamífero' },
  { key: 'largeMammal', label: 'Mamífero grande' },
  { key: 'reptileAmphibian', label: 'Reptil / anfibio' },
  { key: 'unknown', label: 'No lo sé' },
];

const ANIMAL_STATE_OPTIONS: Array<{ key: AnimalState; label: string }> = [
  { key: 'alive', label: 'Vivo' },
  { key: 'dead', label: 'Muerto' },
  { key: 'unknown', label: 'No lo sé' },
];

const FLAG_LABELS: Array<{ key: keyof FlagsState; label: string }> = [
  { key: 'bleeding', label: 'Sangra' },
  { key: 'baby', label: 'Es cría' },
  { key: 'catDog', label: 'Ataque de gato/perro' },
  { key: 'canNotMove', label: 'No se mueve bien' },
  { key: 'roadRisk', label: 'Peligro en carretera' },
  { key: 'other', label: 'Otro' },
];

function getAdvice(animalState: AnimalState, animalType: AnimalType, flags: FlagsState) {
  if (animalState === 'dead') {
    return 'No lo toques ni modifiques el escenario del cadáver porque puede servir como prueba para una investigación pericial o judicial. Observa si encuentras algo extraño alrededor y comunícalo a los agentes de seguridad, a los agentes forestales o a emergencias.';
  }

  if (animalType === 'smallBird') {
    if (flags.baby) {
      return 'Puede ser un volantón. Observa antes de recogerlo. Si no hay peligro inmediato, los padres pueden seguir atendiéndolo cerca. Si necesitas retirarlo, colócalo en una caja de cartón, en un lugar tranquilo, sin ruido y protegido del frío o del calor extremo. Contacta con un centro especializado como GREFA, Agentes Forestales o Emergencias, y facilita toda esta información resumida en el siguiente paso o envíala por WhatsApp.';
    }

    if (flags.bleeding || flags.catDog || flags.canNotMove || flags.other) {
      return 'Parece un caso que puede requerir valoración o ingreso. Colócalo en una caja de cartón, en silencio, sin ruidos y protegido del frío o del calor extremo. No le des comida ni agua sin indicación. Contacta con un centro especializado como GREFA, Agentes Forestales o Emergencias, y facilita toda esta información resumida en el siguiente paso o envíala por WhatsApp.';
    }

    return 'Si no vuela o parece débil, colócalo en una caja de cartón, en un lugar tranquilo, sin ruido y protegido del frío o del calor extremo. Evita manipularlo más de lo necesario y no le des comida ni agua sin indicación. Contacta con un centro especializado como GREFA, Agentes Forestales o Emergencias, y facilita toda esta información resumida en el siguiente paso o envíala por WhatsApp.';
  }

  if (animalType === 'largeBird') {
    return 'Precaución: una rapaz o ave grande puede lesionarte con pico, alas o garras. No la manipules salvo peligro inmediato. Si es imprescindible, usa una manta o toalla gruesa. Mantenla apartada de ruido, estrés y de temperaturas extremas. Contacta con un centro especializado como GREFA, Agentes Forestales o Emergencias, y facilita toda esta información resumida en el siguiente paso o envíala por WhatsApp.';
  }

  if (animalType === 'bat') {
    return 'No lo toques con la mano desnuda. Usa guantes o una tela. Colócalo en una caja de cartón ventilada, sin ruidos y protegido del frío o del calor extremo. Evita manipularlo más de lo necesario. Contacta con un centro especializado como GREFA, Agentes Forestales o Emergencias, y facilita toda esta información resumida en el siguiente paso o envíala por WhatsApp.';
  }

  if (animalType === 'smallMammal') {
    if (flags.baby) {
      return 'Si es una cría, manipúlala lo mínimo. Colócala en una caja de cartón con calor suave, en silencio, sin ruidos y protegida del frío o del calor extremo. No la alimentes salvo indicación expresa. Contacta con un centro especializado como GREFA, Agentes Forestales o Emergencias, y facilita toda esta información resumida en el siguiente paso o envíala por WhatsApp.';
    }

    return 'Manipula lo mínimo. Colócalo en una caja de cartón o recipiente seguro, tranquilo y protegido del frío o del calor extremo. No le des comida ni agua sin indicación. Contacta con un centro especializado como GREFA, Agentes Forestales o Emergencias, y facilita toda esta información resumida en el siguiente paso o envíala por WhatsApp.';
  }

  if (animalType === 'largeMammal') {
    return 'No intentes capturarlo ni acercarte más de lo necesario. Puede reaccionar con miedo o agresividad. Mantén distancia, evita acorralarlo y procura que quede apartado de ruido, estrés y peligro inmediato. Contacta con un centro especializado como GREFA, Agentes Forestales o Emergencias, y facilita toda esta información resumida en el siguiente paso o envíala por WhatsApp.';
  }

  if (animalType === 'reptileAmphibian') {
    return 'Evita manipularlo salvo riesgo inmediato. Mantenlo en un recipiente seguro y ventilado o en una zona protegida, sin ruido y evitando frío o calor extremo. Contacta con un centro especializado como GREFA, Agentes Forestales o Emergencias, y facilita toda esta información resumida en el siguiente paso o envíala por WhatsApp.';
  }

  return 'Si no sabes qué animal es, mantén distancia, evita manipularlo y no le des comida ni agua. Si es necesario moverlo por seguridad, mantenlo en un lugar tranquilo, sin ruido y protegido del frío o del calor extremo. Contacta con un centro especializado como GREFA, Agentes Forestales o Emergencias, y facilita toda esta información resumida en el siguiente paso o envíala por WhatsApp.';
}

function normalizePhone(phone: string) {
  return phone.replace(/[^\d+]/g, '');
}

function normalizeWhatsAppNumber(phone: string) {
  let normalized = phone.replace(/[^\d+]/g, '').trim();

  if (!normalized) return '';
  if (normalized.startsWith('+')) normalized = normalized.slice(1);
  if (normalized.startsWith('00')) normalized = normalized.slice(2);

  return normalized.replace(/[^\d]/g, '');
}

function countDigits(phone: string) {
  return (phone.match(/\d/g) || []).length;
}

function isValidPhone(phone: string) {
  const normalized = normalizePhone(phone);
  const plusCount = (normalized.match(/\+/g) || []).length;

  if (plusCount > 1) return false;
  if (normalized.includes('+') && !normalized.startsWith('+')) return false;

  return countDigits(normalized) >= 9;
}

export default function HomeScreen() {
  const [step, setStep] = useState<Step>(1);
  const [showContacts, setShowContacts] = useState(false);
  const [showWhatsAppOptions, setShowWhatsAppOptions] = useState(false);
  const [customWhatsAppNumber, setCustomWhatsAppNumber] = useState('');
  const [hasSentWhatsApp, setHasSentWhatsApp] = useState(false);
  const [hasOpenedHelpPhones, setHasOpenedHelpPhones] = useState(false);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [animalState, setAnimalState] = useState<AnimalState>('unknown');
  const [observations, setObservations] = useState('');

  const [animalType, setAnimalType] = useState<AnimalType>('unknown');

  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [videoUri, setVideoUri] = useState<string | null>(null);

  const [locationText, setLocationText] = useState('Ubicación no capturada todavía.');
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationCaptured, setLocationCaptured] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  const [flags, setFlags] = useState<FlagsState>({
    bleeding: false,
    baby: false,
    catDog: false,
    canNotMove: false,
    roadRisk: false,
    other: false,
  });

  const advice = useMemo(
    () => getAdvice(animalState, animalType, flags),
    [animalState, animalType, flags]
  );

  const selectedFlags = useMemo(
    () =>
      FLAG_LABELS.filter(({ key }) => flags[key])
        .map(({ label }) => label)
        .join(', ') || 'Sin marcas',
    [flags]
  );

  const selectedAnimalLabel = useMemo(
    () => ANIMAL_OPTIONS.find((option) => option.key === animalType)?.label || 'No indicado',
    [animalType]
  );

  const selectedAnimalStateLabel = useMemo(
    () =>
      ANIMAL_STATE_OPTIONS.find((option) => option.key === animalState)?.label || 'No indicado',
    [animalState]
  );

  const summary = useMemo(() => {
    const mapsUrl = coords
      ? `https://maps.google.com/?q=${coords.latitude},${coords.longitude}`
      : 'Sin ubicación';

    return [
      'AVISO DE RESCATE DE FAUNA',
      `Nombre: ${fullName || 'No indicado'}`,
      `Teléfono: ${phone || 'No indicado'}`,
      `Estado del animal: ${selectedAnimalStateLabel}`,
      `Tipo de animal: ${selectedAnimalLabel}`,
      `Ubicación: ${locationText}`,
      `Mapa: ${mapsUrl}`,
      `Situación observada: ${selectedFlags}`,
      flags.other ? 'Situación adicional: Otro' : null,
      `Foto capturada: ${photoUri ? 'sí' : 'no'}`,
      `Vídeo capturado: ${videoUri ? 'sí' : 'no'}`,
      observations.trim() ? `Observaciones: ${observations.trim()}` : null,
    ]
      .filter(Boolean)
      .join('\n');
  }, [
    coords,
    flags.other,
    fullName,
    locationText,
    observations,
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
          'Permiso recomendado',
          `No se ha concedido permiso para guardar ${label} en la galería.`
        );
        return;
      }

      await MediaLibrary.saveToLibraryAsync(uri);
    } catch {
      Alert.alert(
        'No se pudo guardar',
        `No se pudo guardar ${label} en la galería del dispositivo.`
      );
    }
  };

  const pickPhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permiso necesario', 'Necesitamos acceso a la cámara para capturar la foto.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 0.7,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setPhotoUri(uri);
      await saveToGallery(uri, 'la foto');
    }
  };

  const pickVideo = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permiso necesario', 'Necesitamos acceso a la cámara para grabar el vídeo.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['videos'],
      quality: 0.7,
      videoMaxDuration: 20,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setVideoUri(uri);
      await saveToGallery(uri, 'el vídeo');
    }
  };

  const captureLocation = async () => {
    try {
      setLocationLoading(true);

      const permission = await Location.requestForegroundPermissionsAsync();

      if (!permission.granted) {
        Alert.alert('Permiso necesario', 'Necesitamos tu ubicación para enviar el aviso.');
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
        `${current.coords.latitude.toFixed(5)}, ${current.coords.longitude.toFixed(5)}`
      );
      setLocationCaptured(true);
    } catch {
      Alert.alert('No se pudo obtener la ubicación', 'Inténtalo de nuevo en unos segundos.');
    } finally {
      setLocationLoading(false);
    }
  };

  const toggleFlag = (key: keyof FlagsState) => {
    setFlags((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const openWhatsAppWithNumber = async (number: string) => {
    const cleaned = normalizeWhatsAppNumber(number);

    if (!cleaned || countDigits(cleaned) < 9) {
      Alert.alert(
        'Número no válido',
        'Introduce un número de WhatsApp válido, con prefijo si hace falta.'
      );
      return;
    }

    const text = encodeURIComponent(summary);
    const url = `https://wa.me/${cleaned}?text=${text}`;
    const supported = await Linking.canOpenURL(url);

    if (!supported) {
      Alert.alert('WhatsApp no disponible', 'No se pudo abrir WhatsApp en este dispositivo.');
      return;
    }

    setHasSentWhatsApp(true);
    await Linking.openURL(url);
  };

  const copySummary = async () => {
    await Clipboard.setStringAsync(summary);
    Alert.alert('Resumen copiado', 'El resumen se ha copiado al portapapeles.');
  };

  const callNumber = async (phoneNumber: string) => {
    const url = `tel:${phoneNumber}`;
    await Linking.openURL(url);
  };

  const showProvincePhones = () => {
    Alert.alert(
      'Pendiente de ampliar',
      'En el siguiente paso añadiremos teléfonos de ayuda por provincias y contactos específicos como “Mis amigas las palomas”.'
    );
  };

  const finishFlow = () => {
    if (animalState === 'dead' && !hasOpenedHelpPhones) return;
    if (animalState !== 'dead' && !hasSentWhatsApp) return;

    Alert.alert('Gracias', 'Gracias por colaborar y ayudar a los animales.', [
      {
        text: 'Aceptar',
        onPress: () => {
          setStep(1);
          setShowContacts(false);
          setShowWhatsAppOptions(false);
          setCustomWhatsAppNumber('');
          setHasSentWhatsApp(false);
          setHasOpenedHelpPhones(false);
          setFullName('');
          setPhone('');
          setAnimalState('unknown');
          setObservations('');
          setAnimalType('unknown');
          setPhotoUri(null);
          setVideoUri(null);
          setLocationText('Ubicación no capturada todavía.');
          setCoords(null);
          setLocationCaptured(false);
          setLocationLoading(false);
          setFlags({
            bleeding: false,
            baby: false,
            catDog: false,
            canNotMove: false,
            roadRisk: false,
            other: false,
          });
        },
      },
    ]);
  };

  const validateStep = () => {
    if (step === 1) {
      if (!fullName.trim()) {
        Alert.alert('Falta el nombre', 'Introduce tu nombre y apellidos antes de continuar.');
        return false;
      }

      if (!phone.trim()) {
        Alert.alert('Falta el teléfono', 'Introduce un teléfono de contacto antes de continuar.');
        return false;
      }

      if (!isValidPhone(phone)) {
        Alert.alert('Teléfono no válido', 'Introduce un teléfono válido, con al menos 9 dígitos.');
        return false;
      }
    }

    if (step === 2) {
      if (!photoUri && !videoUri && !locationCaptured) {
        Alert.alert(
          'Información incompleta',
          'Conviene añadir al menos una foto, un vídeo o capturar la ubicación antes de continuar.'
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

    if (step > 1) {
      setStep((prev) => (prev - 1) as Step);
    }
  };

  const handleOpenHelp = () => {
    setHasOpenedHelpPhones(true);
    setShowContacts(true);
  };

  const renderContacts = () => (
    <SectionCard title="Teléfonos de ayuda">
      <View style={styles.sectionContent}>
        <Text style={styles.sectionDescription}>
          Puedes consultar estos teléfonos y volver después al paso en el que estabas.
        </Text>

        {emergencyContacts.map((contact) => (
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

        <Pressable style={styles.secondaryButton} onPress={showProvincePhones}>
          <Text style={styles.secondaryButtonText}>Teléfonos de ayuda por provincias</Text>
        </Pressable>

        <Pressable style={styles.secondaryButton} onPress={() => setShowContacts(false)}>
          <Text style={styles.secondaryButtonText}>Volver</Text>
        </Pressable>
      </View>
    </SectionCard>
  );

  const renderWhatsAppOptions = () => (
    <SectionCard title="Enviar por WhatsApp">
      <View style={styles.sectionContent}>
        <Text style={styles.sectionDescription}>
          Elige si quieres enviar el resumen directamente a GREFA o a otro número.
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
          style={[styles.primaryButton, !hasSentWhatsApp && styles.disabledButton]}
          onPress={finishFlow}
          disabled={!hasSentWhatsApp}
        >
          <Text style={styles.primaryButtonText}>Finalizar</Text>
        </Pressable>

        <View style={styles.navRowCenter}>
          <Pressable
            style={styles.secondaryButtonSmall}
            onPress={() => setShowWhatsAppOptions(false)}
          >
            <Text style={styles.secondaryButtonText}>Volver</Text>
          </Pressable>
        </View>
      </View>
    </SectionCard>
  );

  const renderNavigationArrows = () => {
    if (showContacts || showWhatsAppOptions) return null;

    return (
      <View pointerEvents="box-none" style={styles.sideNavOverlay}>
        {step > 1 ? (
          <Pressable style={styles.sideArrowLeft} onPress={goBack}>
            <Text style={styles.sideArrowText}>‹</Text>
          </Pressable>
        ) : (
          <View style={styles.sideArrowPlaceholder} />
        )}

        {step < 5 ? (
          <Pressable style={styles.sideArrowRight} onPress={goNext}>
            <Text style={styles.sideArrowText}>›</Text>
          </Pressable>
        ) : (
          <View style={styles.sideArrowPlaceholder} />
        )}
      </View>
    );
  };

  const renderStep = () => {
    if (showContacts) return renderContacts();
    if (showWhatsAppOptions) return renderWhatsAppOptions();

    if (step === 1) {
      return (
        <SectionCard title="Paso 1. Datos de contacto">
          <View style={styles.sectionContent}>
            <Text style={styles.sectionDescription}>
              Introduce tus datos e indica si el animal está vivo o muerto.
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

            <Text style={styles.subheading}>Estado del animal</Text>
            <View style={styles.flagGrid}>
              {ANIMAL_STATE_OPTIONS.map((option) => {
                const active = animalState === option.key;

                return (
                  <Pressable
                    key={option.key}
                    style={[styles.flag, active && styles.flagActive]}
                    onPress={() => setAnimalState(option.key)}
                  >
                    <Text style={[styles.flagText, active && styles.flagTextActive]}>
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                Tus datos no se almacenan en esta app ni se usan para ningún otro fin.
              </Text>
            </View>

            <View style={styles.bottomHelpRow}>
              <Pressable style={styles.secondaryButton} onPress={handleOpenHelp}>
                <Text style={styles.secondaryButtonText}>Teléfonos de ayuda</Text>
              </Pressable>
            </View>
          </View>
        </SectionCard>
      );
    }

    if (step === 2) {
      return (
        <SectionCard title="Paso 2. Foto, vídeo y ubicación">
          <View style={styles.sectionContent}>
            <Text style={styles.sectionDescription}>
              Captura una foto y/o un vídeo y obtén la ubicación del hallazgo.
            </Text>

            <Pressable style={styles.primaryButton} onPress={pickPhoto}>
              <Text style={styles.primaryButtonText}>
                {photoUri ? 'Cambiar foto' : 'Hacer foto'}
              </Text>
            </Pressable>

            <Pressable style={styles.primaryButton} onPress={pickVideo}>
              <Text style={styles.primaryButtonText}>
                {videoUri ? 'Cambiar vídeo' : 'Grabar vídeo'}
              </Text>
            </Pressable>

            <Pressable
              style={[styles.secondaryButton, locationLoading && styles.disabledButton]}
              onPress={captureLocation}
              disabled={locationLoading}
            >
              <Text style={styles.secondaryButtonText}>
                {locationLoading ? 'Capturando ubicación…' : 'Capturar ubicación'}
              </Text>
            </Pressable>

            {locationCaptured ? (
              <View style={styles.successBox}>
                <Text style={styles.successText}>Ubicación capturada correctamente</Text>
              </View>
            ) : null}

            <Text style={styles.helperText}>
              {photoUri ? 'Foto capturada y guardada en el dispositivo' : 'Sin foto todavía.'}
            </Text>

            <Text style={styles.helperText}>
              {videoUri ? 'Vídeo capturado y guardado en el dispositivo' : 'Sin vídeo todavía.'}
            </Text>

            <Text style={styles.helperText}>{locationText}</Text>

            <View style={styles.bottomHelpRow}>
              <Pressable style={styles.secondaryButton} onPress={handleOpenHelp}>
                <Text style={styles.secondaryButtonText}>Teléfonos de ayuda</Text>
              </Pressable>
            </View>
          </View>
        </SectionCard>
      );
    }

    if (step === 3) {
      return (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoid}
          keyboardVerticalOffset={90}
        >
          <SectionCard title="Paso 3. Tipo y situación del animal">
            <View style={styles.sectionContent}>
              <Text style={styles.sectionDescription}>
                Selecciona el tipo de animal y marca solo lo que observes con claridad.
              </Text>

              <Text style={styles.subheading}>Tipo de animal</Text>
              <View style={styles.flagGrid}>
                {ANIMAL_OPTIONS.map((option) => {
                  const active = animalType === option.key;

                  return (
                    <Pressable
                      key={option.key}
                      style={[styles.flag, active && styles.flagActive]}
                      onPress={() => setAnimalType(option.key)}
                    >
                      <Text style={[styles.flagText, active && styles.flagTextActive]}>
                        {option.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <Text style={styles.subheading}>Situación del animal</Text>
              <View style={styles.flagGrid}>
                {FLAG_LABELS.map(({ key, label }) => {
                  const active = flags[key];

                  return (
                    <Pressable
                      key={key}
                      style={[styles.flag, active && styles.flagActive]}
                      onPress={() => toggleFlag(key)}
                    >
                      <Text style={[styles.flagText, active && styles.flagTextActive]}>
                        {label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <View style={styles.bottomHelpRow}>
                <Pressable style={styles.secondaryButton} onPress={handleOpenHelp}>
                  <Text style={styles.secondaryButtonText}>Teléfonos de ayuda</Text>
                </Pressable>
              </View>
            </View>
          </SectionCard>
        </KeyboardAvoidingView>
      );
    }

    if (step === 4) {
      return (
        <SectionCard title="Paso 4. Orientación básica">
          <View style={styles.sectionContent}>
            <Text style={styles.sectionDescription}>
              Orientación básica según lo que has seleccionado:
            </Text>

            <Text style={styles.summaryBox}>{advice}</Text>

            <View style={styles.bottomHelpRow}>
              <Pressable style={styles.secondaryButton} onPress={handleOpenHelp}>
                <Text style={styles.secondaryButtonText}>Teléfonos de ayuda</Text>
              </Pressable>
            </View>
          </View>
        </SectionCard>
      );
    }

    if (animalState === 'dead') {
      return (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoid}
          keyboardVerticalOffset={90}
        >
          <SectionCard title="Paso 5. Resumen">
            <View style={styles.sectionContent}>
              <Text style={styles.sectionDescription}>
                Este es el resumen preparado para comunicar el caso a los servicios adecuados.
              </Text>

              <Text style={styles.summaryBox}>{summary}</Text>

              <TextInput
                placeholder="Observaciones"
                value={observations}
                onChangeText={setObservations}
                multiline
                style={[styles.input, styles.textAreaStep5]}
              />

              <View style={styles.warningBox}>
                <Text style={styles.warningText}>
                  En este caso llama directamente a los agentes forestales, o a seguridad ciudadana más cercana, o a emergencias o a los que consideres más oportunos según tu caso. Tienes abajo los contactos. Puedes copiar el resumen y usarlo si te lo piden los servicios de seguridad o emergencias.
                </Text>
              </View>

              <Pressable style={styles.secondaryButton} onPress={copySummary}>
                <Text style={styles.secondaryButtonText}>Copiar resumen</Text>
              </Pressable>

              <Pressable style={styles.secondaryButton} onPress={handleOpenHelp}>
                <Text style={styles.secondaryButtonText}>Teléfonos de ayuda</Text>
              </Pressable>

              <Pressable
                style={[styles.primaryButton, !hasOpenedHelpPhones && styles.disabledButton]}
                onPress={finishFlow}
                disabled={!hasOpenedHelpPhones}
              >
                <Text style={styles.primaryButtonText}>Finalizar</Text>
              </Pressable>
            </View>
          </SectionCard>
        </KeyboardAvoidingView>
      );
    }

    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
        keyboardVerticalOffset={90}
      >
        <SectionCard title="Paso 5. Resumen">
          <View style={styles.sectionContent}>
            <Text style={styles.sectionDescription}>
              Este es el resumen para enviar el aviso a un centro especializado.
            </Text>

            <Text style={styles.summaryBox}>{summary}</Text>

            <TextInput
              placeholder="Observaciones"
              value={observations}
              onChangeText={setObservations}
              multiline
              style={[styles.input, styles.textAreaStep5]}
            />

            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                Importante: la foto y el vídeo no se adjuntan automáticamente. Deberás enviarlos manualmente desde WhatsApp.
              </Text>
            </View>

            <Pressable style={styles.primaryButton} onPress={() => setShowWhatsAppOptions(true)}>
              <Text style={styles.primaryButtonText}>Enviar por WhatsApp</Text>
            </Pressable>

            <Pressable style={styles.secondaryButton} onPress={copySummary}>
              <Text style={styles.secondaryButtonText}>Copiar resumen</Text>
            </Pressable>

            <Pressable style={styles.secondaryButton} onPress={handleOpenHelp}>
              <Text style={styles.secondaryButtonText}>Teléfonos de ayuda</Text>
            </Pressable>
          </View>
        </SectionCard>
      </KeyboardAvoidingView>
    );
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {!showContacts && (
          <View style={styles.hero}>
            <Text style={styles.badge}>SOS Fauna · Asistente</Text>
            <Text style={styles.heroText}>
              Sigue los pasos para enviar el aviso y recibir una orientación básica.
            </Text>
            {!showWhatsAppOptions ? (
              <Text style={styles.stepIndicator}>Paso {step} de 5</Text>
            ) : null}
          </View>
        )}

        {renderStep()}
      </ScrollView>

      {renderNavigationArrows()}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f3f7f4',
  },
  container: {
    paddingHorizontal: 26,
    paddingVertical: 18,
    gap: 16,
    paddingBottom: 32,
  },
  keyboardAvoid: {
    flex: 1,
  },
  hero: {
    backgroundColor: '#e7f5ea',
    borderRadius: 18,
    padding: 18,
    gap: 8,
    borderWidth: 1,
    borderColor: '#cfe8d4',
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#14532d',
    color: '#ffffff',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    fontSize: 14,
    fontWeight: '800',
  },
  heroText: {
    fontSize: 16,
    lineHeight: 22,
    color: '#374151',
  },
  stepIndicator: {
    fontSize: 13,
    fontWeight: '700',
    color: '#166534',
    marginTop: 4,
  },
  sectionContent: {
    gap: 12,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
  subheading: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginTop: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#ffffff',
  },
  textAreaStep5: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  primaryButton: {
    backgroundColor: '#14532d',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: '#e5e7eb',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryButtonSmall: {
    backgroundColor: '#e5e7eb',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    minWidth: 96,
  },
  secondaryButtonText: {
    color: '#111827',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  helperText: {
    color: '#4b5563',
    fontSize: 13,
    lineHeight: 18,
  },
  successBox: {
    backgroundColor: '#dcfce7',
    borderWidth: 1,
    borderColor: '#16a34a',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  successText: {
    color: '#166534',
    fontWeight: '700',
  },
  warningBox: {
    backgroundColor: '#fef3c7',
    borderWidth: 1,
    borderColor: '#f59e0b',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  warningText: {
    color: '#92400e',
    fontWeight: '700',
    lineHeight: 20,
  },
  flagGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  flag: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#ffffff',
  },
  flagActive: {
    backgroundColor: '#dcfce7',
    borderColor: '#16a34a',
  },
  flagText: {
    color: '#111827',
    fontWeight: '600',
  },
  flagTextActive: {
    color: '#166534',
  },
  summaryBox: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 12,
    lineHeight: 22,
    color: '#111827',
  },
  bottomHelpRow: {
    marginTop: 8,
  },
  navRowCenter: {
    marginTop: 8,
    alignItems: 'center',
  },
  contactRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 14,
    padding: 12,
    backgroundColor: '#ffffff',
  },
  contactTextBlock: {
    flex: 1,
  },
  contactName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  contactNote: {
    fontSize: 13,
    color: '#4b5563',
    marginTop: 2,
  },
  contactPhone: {
    fontSize: 14,
    fontWeight: '700',
    color: '#14532d',
  },
  sideNavOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    pointerEvents: 'box-none',
  },
  sideArrowLeft: {
    position: 'absolute',
    left: 0,
    width: 22,
    height: 120,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    backgroundColor: '#14532d',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  sideArrowRight: {
    position: 'absolute',
    right: 0,
    width: 22,
    height: 120,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    backgroundColor: '#14532d',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  sideArrowPlaceholder: {
    width: 22,
    height: 120,
  },
  sideArrowText: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 30,
  },
});