export type ProvinceContactItem = {
  name: string;
  phone: string;
  note: string;
};

export type ProvinceContactGroup = {
  province: string;
  contacts: ProvinceContactItem[];
};

export const provinceContacts: ProvinceContactGroup[] = [
  
 {
    province: 'Albacete',
    contacts: [
      {
        name: 'CRFS de Albacete',
        phone: '967557852',
        note: 'Alternativo 967198588',
      },
    ],
  },
{
    province: 'Almería',
    contacts: [
      {
        name: 'CREA Las Almohallas',
        phone: '670944592',
        note: 'Vélez-Blanco · Emergencias 112',
      },
    ],
  },
 {
    province: 'Asturias',
    contacts: [
      {
        name: 'Centro de Recuperación de Fauna de Infiesto',
        phone: '985105500',
        note: 'Piloña · Emergencias 112 · Extensión 13704',
      },
    ],
  },
 {
    province: 'Ávila',
    contacts: [
      {
        name: 'Centro de Recuperación de Ávila',
        phone: '920355001',
        note: 'Vivero Forestal El Álamo',
      },
    ],
  },
{
    province: 'Badajoz',
    contacts: [
      {
        name: 'AMUS',
        phone: '924520428',
        note: 'Villafranca de los Barros',
      },
      {
        name: 'DEMA',
        phone: '924671752',
        note: 'Almendralejo · Alternativos 678244414 y 647292776',
      },
    ],
  },
 {
    province: 'Barcelona',
    contacts: [
      {
        name: 'Centre de Fauna de Torreferrussa',
        phone: '935617017',
        note: 'Santa Perpètua de Mogoda · Alternativo 935600052',
      },
    ],
  },
  {
    province: 'Burgos',
    contacts: [
      {
        name: 'Centro de Recuperación de Aves Silvestres de Burgos',
        phone: '947461189',
        note: 'Albillos',
      },
    ],
  },
{
    province: 'Cáceres',
    contacts: [
      {
        name: 'CRFS y Educación Ambiental Los Hornos',
        phone: '900351858',
        note: 'Sierra de Fuentes · Alternativo 927200170',
      },
    ],
  },  
{
    province: 'Cádiz',
    contacts: [
      {
        name: 'CREA Dunas de San Antón',
        phone: '670946198',
        note: 'El Puerto de Santa María · Emergencias 112',
      },
      {
        name: 'ZooBotánico Jerez',
        phone: '956182397',
        note: 'Jerez de la Frontera · Emergencias 112 · Alternativo 956184207',
      },
    ],
  },
 {
    province: 'Cantabria',
    contacts: [
      {
        name: 'CRFS de Cantabria',
        phone: '942564944',
        note: 'Villaescusa · Recinto anexo a Cabárceno',
      },
    ],
  },
  {
    province: 'Ceuta',
    contacts: [
      {
        name: 'CRFS de Ceuta',
        phone: '956520104',
        note: 'OBIMASA',
      },
    ],
  },
  {
    province: 'Ciudad Real',
    contacts: [
      {
        name: 'CRFS El Chaparrillo',
        phone: '926231400',
        note: 'Ciudad Real',
      },
    ],
  },

 {
    province: 'Córdoba',
    contacts: [
      {
        name: 'CREA Los Villares',
        phone: '670947901',
        note: 'Carretera de Obejo-Córdoba · Emergencias 112',
      },
    ],
  },
 {
    province: 'Cuenca',
    contacts: [
      {
        name: 'CRFS El Ardal',
        phone: '969178300',
        note: 'Cuenca',
      },
    ],
  },
 {
    province: 'Girona',
    contacts: [
      {
        name: "Centre de Fauna dels Aiguamolls de l'Empordà",
        phone: '972454222',
        note: "Castelló d'Empúries · Alternativo 675783329",
      },
    ],
  },
  {
    province: 'Granada',
    contacts: [
      {
        name: 'CREA El Blanqueo',
        phone: '670945699',
        note: 'Cenes de la Vega / Pinos Genil · Emergencias 112',
      },
    ],
  },
 {
    province: 'Guadalajara',
    contacts: [
      {
        name: 'CRFS de Guadalajara',
        phone: '949210959',
        note: 'Avenida Pedro San Vázquez',
      },
    ],
  },
  {
    province: 'Huelva',
    contacts: [
      {
        name: 'CREA-CEGMA Marismas del Odiel',
        phone: '671569081',
        note: 'Huelva · Emergencias 112',
      },
      {
        name: 'CRFS El Acebuche',
        phone: '959506170',
        note: 'Matalascañas · Emergencias 112',
      },
    ],
  },
  {
    province: 'Jaén',
    contacts: [
      {
        name: 'CREA Quiebrajano',
        phone: '670946263',
        note: 'Monte La Sierra · Emergencias 112',
      },
    ],
  },
 {
    province: 'Las Palmas',
    contacts: [
      {
        name: 'CRFS de Tafira',
        phone: '928351970',
        note: 'Las Palmas de Gran Canaria',
      },
    ],
  },
  {
    province: 'León',
    contacts: [
      {
        name: 'Centro de Recepción de Fauna de Valsemana',
        phone: '987694219',
        note: 'Lugán · Alternativo 987296168',
      },
    ],
  },
 {
    province: 'Lleida',
    contacts: [
      {
        name: 'Centre de Fauna de Vallcalent',
        phone: '973282276',
        note: 'Lleida',
      },
    ],
  },
  {
    province: 'Málaga',
    contacts: [
      {
        name: 'CREA El Boticario',
        phone: '670944598',
        note: 'Sierra de Tolox · Emergencias 112',
      },
      {
        name: 'CREMA Málaga',
        phone: '952229287',
        note: 'Aula del Mar · Alternativo 689772335',
      },
    ],
  },
  {
    province: 'Mallorca',
    contacts: [
      {
        name: 'Fundació Natura Parc',
        phone: '971144532',
        note: 'Santa Eugènia',
      },
      {
        name: 'Son Reus',
        phone: '971438695',
        note: 'Palma de Mallorca',
      },
      {
        name: 'Fundación Marineland',
        phone: '971675125',
        note: 'Calvià · Alternativo 650965704',
      },
    ],
  },
  {
    province: 'Menorca',
    contacts: [
      {
        name: 'Centre de Recuperació de la Fauna Silvestre de Menorca',
        phone: '971350762',
        note: 'Maó · Móvil 619834597',
      },
    ],
  },
  {
    province: 'Salamanca',
    contacts: [
      {
        name: 'CRFS Las Dunas',
        phone: '639449732',
        note: 'Cabrerizos',
      },
    ],
  },

  {
    province: 'Santa Cruz de Tenerife',
    contacts: [
      {
        name: 'CRFS La Tahonilla',
        phone: '922250002',
        note: 'La Laguna',
      },
    ],
  },
{
    province: 'Segovia',
    contacts: [
      {
        name: 'CRAS Los Lavaderos',
        phone: '921433340',
        note: 'Zamarramala · Oficinas 921417430',
      },
    ],
  },
{
    province: 'Sevilla',
    contacts: [
      {
        name: 'CREA San Jerónimo',
        phone: '670941592',
        note: 'Sevilla · Emergencias 112',
      },
      {
        name: 'Cañada de los Pájaros',
        phone: '955772184',
        note: 'Puebla del Río',
      },
      {
        name: 'Coordinación Red Andaluza de CREA',
        phone: '670945937',
        note: 'Coordinación autonómica',
      },
    ],
  },
{
    province: 'Tarragona',
    contacts: [
      {
        name: 'Centre de Fauna del Canal Vell',
        phone: '977267082',
        note: 'Deltebre · Alternativo 977482181',
      },
    ],
  },
{
    province: 'Teruel',
    contacts: [
      {
        name: 'Centro de Recepción El Planizar',
        phone: '659153108',
        note: 'Teruel · Alternativo 666323678',
      },
    ],
  },
 {
    province: 'Toledo',
    contacts: [
      {
        name: 'CERI',
        phone: '925455156',
        note: 'Sevilleja de la Jara',
      },
    ],
  },
{
    province: 'Valladolid',
    contacts: [
      {
        name: 'Centro de Recuperación de Aves de Valladolid',
        phone: '983410587',
        note: 'Alternativo 608194913',
      },
    ],
  },
 {
    province: 'Zamora',
    contacts: [
      {
        name: 'CRFS de Zamora',
        phone: '618735088',
        note: 'Villaralbo',
      },
    ],
  },  
{
    province: 'Zaragoza',
    contacts: [
      {
        name: 'CRFS La Alfranca',
        phone: '976108190',
        note: 'Pastriz · Emergencias 686528064',
      },
    ],
  },
];