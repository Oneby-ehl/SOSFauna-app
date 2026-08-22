export type MarineHelpResourceType =
  | "emergency"
  | "strandingNetwork"
  | "recoveryCenter"
  | "specializedEntity"
  | "additionalContact";

export type MarineHelpContactItem = {
  name: string;
  type: MarineHelpResourceType;
  note: string;
  phone?: string;
};

export type MarineHelpProvinceGroup = {
  province: string;
  contacts: MarineHelpContactItem[];
};

const marineEmergencyContact: MarineHelpContactItem = {
  name: "Emergencias",
  type: "emergency",
  phone: "112",
  note: "Vía ciudadana de aviso para fauna marina varada, herida o en problemas",
};

const createMarineEmergency = (): MarineHelpContactItem => ({
  ...marineEmergencyContact,
});

const createInfoContact = (
  name: string,
  type: Exclude<MarineHelpResourceType, "emergency" | "additionalContact">,
  note: string,
): MarineHelpContactItem => ({
  name,
  type,
  note,
});

const createProvinceContacts = (
  provinces: string[],
  contacts: MarineHelpContactItem[],
): MarineHelpProvinceGroup[] =>
  provinces.map((province) => ({
    province,
    contacts: contacts.map((contact) => ({ ...contact })),
  }));

const galiciaContacts: MarineHelpContactItem[] = [
  createMarineEmergency(),
  {
    name: "CEMMA",
    type: "strandingNetwork",
    phone: "686 989 008",
    note: "Red de asistencia a varamientos de fauna marina en Galicia",
  },
];

const asturiasContacts: MarineHelpContactItem[] = [
  createMarineEmergency(),
  createInfoContact(
    "Red de Varamientos del Principado / CRAMA BIOPARC",
    "strandingNetwork",
    "Red y centro especializado asociados a la atención de fauna marina",
  ),
];

const cantabriaContacts: MarineHelpContactItem[] = [
  createMarineEmergency(),
  createInfoContact(
    "ReVarCa",
    "strandingNetwork",
    "Red de Varamientos del Gobierno de Cantabria",
  ),
];

const euskadiContacts: MarineHelpContactItem[] = [
  createMarineEmergency(),
  createInfoContact(
    "Servicios especializados territoriales",
    "strandingNetwork",
    "Contacto especializado directo pendiente de verificación",
  ),
];

const catalunyaContacts: MarineHelpContactItem[] = [
  createMarineEmergency(),
  {
    name: "Cos d'Agents Rurals",
    type: "additionalContact",
    phone: "93 561 70 00",
    note: "Contacto verificado de la Xarxa de rescat de fauna marina",
  },
  createInfoContact(
    "Xarxa de rescat de fauna marina",
    "strandingNetwork",
    "Red de rescate de fauna marina de la Generalitat de Catalunya",
  ),
];

const valencianCommunityContacts: MarineHelpContactItem[] = [
  createMarineEmergency(),
  createInfoContact(
    "Red de Varamientos de la Comunitat Valenciana",
    "strandingNetwork",
    "El 112 activa la red especializada correspondiente",
  ),
  createInfoContact(
    "Fundación Oceanogràfic / Universitat de València / ARCA del Mar",
    "specializedEntity",
    "Entidades técnicas vinculadas a la atención de fauna marina",
  ),
];

const murciaContacts: MarineHelpContactItem[] = [
  createMarineEmergency(),
  {
    name: "CECOFOR",
    type: "additionalContact",
    phone: "968 177 500",
    note: "Contacto adicional verificado de la Región de Murcia",
  },
  createInfoContact(
    "Red de Varamientos de Animales Marinos de la Región de Murcia",
    "strandingNetwork",
    "Red autonómica para cetáceos y tortugas marinas",
  ),
];

const andaluciaContacts: MarineHelpContactItem[] = [
  createMarineEmergency(),
  createInfoContact(
    "Protocolo frente a varamientos de fauna marina",
    "strandingNetwork",
    "El 112 activa los equipos técnicos competentes",
  ),
  createInfoContact(
    "CEGMA / equipos provinciales",
    "recoveryCenter",
    "Centros y equipos especializados; no sustituye la vía ciudadana 112",
  ),
];

const balearicContacts: MarineHelpContactItem[] = [
  createMarineEmergency(),
  createInfoContact(
    "Red de Varamientos de Fauna Marina de Baleares",
    "strandingNetwork",
    "El 112 canaliza el aviso y activa la respuesta especializada",
  ),
  createInfoContact(
    "Fundación Palma Aquarium",
    "recoveryCenter",
    "Centro especializado vinculado a la atención de fauna marina",
  ),
];

const canaryContacts: MarineHelpContactItem[] = [
  createMarineEmergency(),
  createInfoContact(
    "Gobierno de Canarias / protocolos de fauna marina",
    "strandingNetwork",
    "Red y protocolos territoriales pendientes de extracción operativa completa",
  ),
];

const ceutaContacts: MarineHelpContactItem[] = [
  createMarineEmergency(),
  createInfoContact(
    "CECAM",
    "specializedEntity",
    "Centro de estudio y conservación de fauna marina; vía ciudadana directa pendiente de verificación",
  ),
];

const melillaContacts: MarineHelpContactItem[] = [
  createMarineEmergency(),
  createInfoContact(
    "Protocolo de varamientos de Melilla",
    "strandingNetwork",
    "Protocolo territorial en desarrollo; vía ciudadana directa pendiente de verificación",
  ),
];

export const marineHelpContacts: MarineHelpProvinceGroup[] = [
  ...createProvinceContacts(["A Coruña", "Lugo", "Pontevedra"], galiciaContacts),
  ...createProvinceContacts(["Asturias"], asturiasContacts),
  ...createProvinceContacts(["Cantabria"], cantabriaContacts),
  ...createProvinceContacts(["Bizkaia", "Gipuzkoa"], euskadiContacts),
  ...createProvinceContacts(["Barcelona", "Girona", "Tarragona"], catalunyaContacts),
  ...createProvinceContacts(
    ["Alicante", "Castellón", "Valencia"],
    valencianCommunityContacts,
  ),
  ...createProvinceContacts(["Murcia"], murciaContacts),
  ...createProvinceContacts(
    ["Almería", "Cádiz", "Granada", "Huelva", "Málaga"],
    andaluciaContacts,
  ),
  ...createProvinceContacts(
    ["Formentera", "Ibiza", "Mallorca", "Menorca"],
    balearicContacts,
  ),
  ...createProvinceContacts(["Las Palmas", "Santa Cruz de Tenerife"], canaryContacts),
  ...createProvinceContacts(["Ceuta"], ceutaContacts),
  ...createProvinceContacts(["Melilla"], melillaContacts),
];
