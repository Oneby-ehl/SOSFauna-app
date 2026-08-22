import {
  provinceContacts,
  type ProvinceContactGroup,
} from "@/lib/provinceContacts";

export const NATIONAL_HELP_CONTACTS = [
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
] as const;

export const MADRID_PROVINCE_CONTACTS = [
  {
    name: "GREFA guardia",
    phone: "627 461 457",
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
    name: "Brinzal",
    phone: "91 479 45 65",
    note: "Centro especializado en rapaces nocturnas · Urgencias 670 933 240",
  },
  {
    name: "Agentes Forestales de Madrid",
    phone: "900 181 628",
    note: "Avisos e incidencias sobre fauna y medio natural",
  },
] as const;

export const HELP_CONTACTS_LEGAL_NOTICE =
  "Fuentes de información:\n\n" +
  "• Emergencias 112: www.proteccioncivil.es/catalogo/info112/\n" +
  "• Guardia Civil (SEPRONA): www.guardiacivil.es\n" +
  "• Policía Nacional: www.policia.es\n" +
  "• Agentes Forestales de la Comunidad de Madrid:\n" +
  "  www.comunidad.madrid/centros/emisora-cuerpo-agentes-forestales\n\n" +
  "SOS Fauna España es una aplicación independiente y no está afiliada ni representa a ninguna administración pública, servicio de emergencias o cuerpo policial.";

export const getRecoveryCenterProvinceContacts = (): ProvinceContactGroup[] => {
  const madridEntry = {
    province: "Madrid",
    contacts: [...MADRID_PROVINCE_CONTACTS],
  };
  const withoutMadrid = provinceContacts.filter(
    (item) => item.province !== "Madrid",
  );

  return [madridEntry, ...withoutMadrid].sort((a, b) =>
    a.province.localeCompare(b.province, "es"),
  );
};
