import { getEffectiveCatalog, type Catalog } from "@/i18n/translate";
import { DEFAULT_LOCALE, type Locale } from "@/i18n/types";

type DescriptionKey = keyof Catalog["helpContactDescriptions"];
export type HelpContactDomain = "national" | "terrestrial" | "marine";
type ContactTextSource = { name: string; phone?: string; note: string };
// Official names/phones identify source records only, never translated labels.
// No record, selection key or stored contact data is rewritten by this overlay.
const bindings: readonly (readonly [HelpContactDomain, string, string, DescriptionKey])[] = [
  [
    "national",
    "Emergencias",
    "112",
    "nationalEmergencyNote"
  ],
  [
    "national",
    "SEPRONA",
    "062",
    "nationalSepronaNote"
  ],
  [
    "national",
    "Policía Municipal / Local",
    "092",
    "nationalLocalPoliceNote"
  ],
  [
    "national",
    "Policía Nacional",
    "091",
    "nationalPoliceNote"
  ],
  [
    "terrestrial",
    "GREFA guardia",
    "627 461 457",
    "madridGrefaDutyNote"
  ],
  [
    "terrestrial",
    "GREFA central",
    "91 638 75 50",
    "madridGrefaGeneralNote"
  ],
  [
    "terrestrial",
    "Agentes Forestales de Madrid",
    "900 181 628",
    "madridForestAgentsNote"
  ],
  [
    "terrestrial",
    "CRFS Santa Faç",
    "965938085",
    "wildlifeRecoveryNote"
  ],
  [
    "terrestrial",
    "CRFS Forn del Vidre",
    "977430821",
    "wildlifeRecoveryNote"
  ],
  [
    "terrestrial",
    "Coordinación Red Andaluza de CREA",
    "670945937",
    "regionalCoordinationNote"
  ],
  [
    "terrestrial",
    "CRFS La Granja / El Saler",
    "963868025",
    "wildlifeRecoveryNote"
  ],
  [
    "marine",
    "Emergencias",
    "112",
    "marineCitizenNotice"
  ],
  [
    "marine",
    "CEMMA",
    "686 989 008",
    "galiciaStrandingNetwork"
  ],
  [
    "marine",
    "Red de Varamientos del Principado / CRAMA BIOPARC",
    "",
    "marineCareNetwork"
  ],
  [
    "marine",
    "Servicios especializados territoriales",
    "",
    "specializedContactUnverified"
  ],
  [
    "marine",
    "Cos d'Agents Rurals",
    "93 561 70 00",
    "catalunyaVerifiedContact"
  ],
  [
    "marine",
    "Xarxa de rescat de fauna marina",
    "",
    "catalunyaRescueNetwork"
  ],
  [
    "marine",
    "Red de Varamientos de la Comunitat Valenciana",
    "",
    "valencianActivation"
  ],
  [
    "marine",
    "Fundación Oceanogràfic / Universitat de València / ARCA del Mar",
    "",
    "marineTechnicalEntities"
  ],
  [
    "marine",
    "CECOFOR",
    "968 177 500",
    "murciaVerifiedContact"
  ],
  [
    "marine",
    "Red de Varamientos de Animales Marinos de la Región de Murcia",
    "",
    "marineRegionalNetwork"
  ],
  [
    "marine",
    "Protocolo frente a varamientos de fauna marina",
    "",
    "andaluciaActivation"
  ],
  [
    "marine",
    "CEGMA / equipos provinciales",
    "",
    "marineRecoveryTeams"
  ],
  [
    "marine",
    "Red de Varamientos de Fauna Marina de Baleares",
    "",
    "balearicActivation"
  ],
  [
    "marine",
    "Fundación Palma Aquarium",
    "",
    "marineSpecialisedCentre"
  ],
  [
    "marine",
    "Gobierno de Canarias / protocolos de fauna marina",
    "",
    "canaryProtocolPending"
  ],
  [
    "marine",
    "CECAM",
    "",
    "ceutaProtocolPending"
  ],
  [
    "marine",
    "Protocolo de varamientos de Melilla",
    "",
    "melillaProtocolPending"
  ],
  ["terrestrial","CRFS de Albacete","967198588","albaceteAlternativeNote"],
  ["terrestrial","CRFS de Santa Cruz de Oleiros","881960405","corunaOleirosNote"],
  ["terrestrial","CREA Las Almohallas","670944592","almeriaEmergencyNote"],
  ["terrestrial","Centro de Recuperación de Fauna de Infiesto","985105500","asturiasExtensionNote"],
  ["terrestrial","DEMA","924671752","badajozAlternativesNote"],
  ["terrestrial","Centre de Fauna de Torreferrussa","935617017","barcelonaAlternativeNote"],
  ["terrestrial","CRFS de Bizkaia / Gorliz","944465297","bizkaiaCollectionNote"],
  ["terrestrial","CRFS y Educación Ambiental Los Hornos","900351858","caceresAlternativeNote"],
  ["terrestrial","CREA Dunas de San Antón","670946198","cadizEmergencyNote"],
  ["terrestrial","ZooBotánico Jerez","956182397","jerezAlternativeNote"],
  ["terrestrial","CRFS de Cantabria","942564944","cantabriaSiteNote"],
  ["terrestrial","CREA Los Villares","670947901","cordobaEmergencyNote"],
  ["terrestrial","Centre de Fauna dels Aiguamolls de l'Empordà","972454222","gironaAlternativeNote"],
  ["terrestrial","CREA El Blanqueo","670945699","granadaEmergencyNote"],
  ["terrestrial","CREA-CEGMA Marismas del Odiel","671569081","huelvaEmergencyNote"],
  ["terrestrial","CRFS El Acebuche","959506170","acebucheEmergencyNote"],
  ["terrestrial","CREA Quiebrajano","670946263","jaenEmergencyNote"],
  ["terrestrial","CRFS La Fombera","112","riojaReportingNote"],
  ["terrestrial","Centro de Recepción de Fauna de Valsemana","987694219","leonAlternativeNote"],
  ["terrestrial","CRF O Veral","982828441","lugoAlternativeNote"],
  ["terrestrial","CREA El Boticario","670944598","malagaEmergencyNote"],
  ["terrestrial","CREMA Málaga","952229287","cremaAlternativeNote"],
  ["terrestrial","Fundación Marineland","971675125","mallorcaAlternativeNote"],
  ["terrestrial","Centre de Recuperació de la Fauna Silvestre de Menorca","971350762","menorcaMobileNote"],
  ["terrestrial","CRFS El Valle","968177500","murciaCollectionNote"],
  ["terrestrial","CECOFOR","968177500","murciaCoordinationNote"],
  ["terrestrial","CRAS Los Lavaderos","921433340","segoviaOfficeNote"],
  ["terrestrial","CREA San Jerónimo","670941592","sevillaEmergencyNote"],
  ["terrestrial","Centre de Fauna del Canal Vell","977267082","tarragonaAlternativeNote"],
  ["terrestrial","Centro de Recepción El Planizar","659153108","teruelAlternativeNote"],
  ["terrestrial","Centro de Recuperación de Aves de Valladolid","983410587","valladolidAlternativeNote"],
  ["terrestrial","CRFS de Zamora","618735088","zamoraAlternativeNote"],
  ["terrestrial","CRFS La Alfranca","976108190","zaragozaEmergencyNote"],
  ["terrestrial","Brinzal","91 479 45 65","madridBrinzalNote"]
];
const identity = (domain: HelpContactDomain, name: string, phone: string) => JSON.stringify([domain, name, phone]);
const keys = new Map(bindings.map(([domain, name, phone, key]) => [identity(domain, name, phone), key]));

// Only descriptive service labels are localised. Official institution names stay
// in the source records, which also remain the lookup and search identifiers.
const descriptiveNameKeys: Partial<Record<DescriptionKey, DescriptionKey>> = {
  specializedContactUnverified: "specializedTerritorialServicesName",
  marineRecoveryTeams: "marineProvincialTeamsName",
  canaryProtocolPending: "canaryProtocolsName",
};

export function getHelpContactName(
  domain: HelpContactDomain,
  contact: ContactTextSource,
  locale: Locale = DEFAULT_LOCALE,
): string {
  const noteKey = keys.get(identity(domain, contact.name, contact.phone ?? ""));
  const nameKey = noteKey && descriptiveNameKeys[noteKey];
  return nameKey ? getEffectiveCatalog(locale).helpContactDescriptions[nameKey] : contact.name;
}

export function getHelpContactNote(
  domain: HelpContactDomain,
  contact: ContactTextSource,
  locale: Locale = DEFAULT_LOCALE,
): string {
  const key = keys.get(identity(domain, contact.name, contact.phone ?? ""));
  // Unbound geographic data and official titles deliberately retain source data.
  return key ? getEffectiveCatalog(locale).helpContactDescriptions[key] : contact.note;
}
