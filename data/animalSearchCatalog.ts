import type { RescueAnimalType } from "@/types/rescueCase";

export type AnimalSearchItem = {
  id: string;
  name: string;
  displayNameWithArticle: string;
  category: RescueAnimalType;
  aliases?: string[];
};

type IndexedAnimalSearchItem = {
  item: AnimalSearchItem;
  terms: string[];
  wholeTermMatchers: ((text: string) => boolean)[];
};

export type AnimalCatalogSearchState = {
  textMatch: AnimalSearchItem | null;
  results: AnimalSearchItem[];
};

export const animalSearchCatalog: AnimalSearchItem[] = [
  {
    id: "abubilla",
    name: "Abubilla",
    displayNameWithArticle: "una abubilla",
    category: "smallBird",
    aliases: ["abubillas"],
  },
  {
    id: "pito-real",
    name: "Pito real",
    displayNameWithArticle: "un pito real",
    category: "smallBird",
    aliases: ["pitos reales"],
  },
  {
    id: "pico-picapinos",
    name: "Pico picapinos",
    displayNameWithArticle: "un pico picapinos",
    category: "smallBird",
  },
  {
    id: "mirlo",
    name: "Mirlo",
    displayNameWithArticle: "un mirlo",
    category: "smallBird",
    aliases: ["mirlos"],
  },
  {
    id: "gorrion",
    name: "Gorrión",
    displayNameWithArticle: "un gorrión",
    category: "smallBird",
    aliases: ["gorrion", "gorriones"],
  },
  {
    id: "vencejo",
    name: "Vencejo",
    displayNameWithArticle: "un vencejo",
    category: "smallBird",
    aliases: ["vencejos"],
  },
  {
    id: "golondrina",
    name: "Golondrina",
    displayNameWithArticle: "una golondrina",
    category: "smallBird",
    aliases: ["golondrinas"],
  },
  {
    id: "avion-comun",
    name: "Avión común",
    displayNameWithArticle: "un avión común",
    category: "smallBird",
    aliases: ["avion comun", "aviones comunes"],
  },
  {
    id: "estornino",
    name: "Estornino",
    displayNameWithArticle: "un estornino",
    category: "smallBird",
    aliases: ["estorninos"],
  },
  {
    id: "petirrojo",
    name: "Petirrojo",
    displayNameWithArticle: "un petirrojo",
    category: "smallBird",
    aliases: ["petirrojos"],
  },
  {
    id: "carbonero",
    name: "Carbonero",
    displayNameWithArticle: "un carbonero",
    category: "smallBird",
    aliases: ["carboneros"],
  },
  {
    id: "herrerillo",
    name: "Herrerillo",
    displayNameWithArticle: "un herrerillo",
    category: "smallBird",
    aliases: ["herrerillos"],
  },
  {
    id: "jilguero",
    name: "Jilguero",
    displayNameWithArticle: "un jilguero",
    category: "smallBird",
    aliases: ["jilgueros"],
  },
  {
    id: "verderon",
    name: "Verderón",
    displayNameWithArticle: "un verderón",
    category: "smallBird",
    aliases: ["verderon", "verderones"],
  },
  {
    id: "pardillo",
    name: "Pardillo",
    displayNameWithArticle: "un pardillo",
    category: "smallBird",
    aliases: ["pardillos"],
  },
  {
    id: "lavandera",
    name: "Lavandera",
    displayNameWithArticle: "una lavandera",
    category: "smallBird",
    aliases: ["lavanderas"],
  },
  {
    id: "curruca",
    name: "Curruca",
    displayNameWithArticle: "una curruca",
    category: "smallBird",
    aliases: ["currucas"],
  },
  {
    id: "ruisenor",
    name: "Ruiseñor",
    displayNameWithArticle: "un ruiseñor",
    category: "smallBird",
    aliases: ["ruisenor", "ruiseñores", "ruisenores"],
  },
  {
    id: "codorniz",
    name: "Codorniz",
    displayNameWithArticle: "una codorniz",
    category: "smallBird",
    aliases: ["codornices"],
  },
  {
    id: "perdiz",
    name: "Perdiz",
    displayNameWithArticle: "una perdiz",
    category: "smallBird",
    aliases: ["perdices"],
  },
  {
    id: "tortola",
    name: "Tórtola",
    displayNameWithArticle: "una tórtola",
    category: "smallBird",
    aliases: ["tortola", "tórtolas", "tortolas"],
  },
  {
    id: "avutarda",
    name: "Avutarda",
    displayNameWithArticle: "una avutarda",
    category: "largeBird",
    aliases: ["avutardas"],
  },
  {
    id: "sison",
    name: "Sisón",
    displayNameWithArticle: "un sisón",
    category: "largeBird",
    aliases: ["sison", "sisones"],
  },
  {
    id: "gaviota",
    name: "Gaviota",
    displayNameWithArticle: "una gaviota",
    category: "largeBird",
    aliases: ["gaviotas"],
  },
  {
    id: "paloma",
    name: "Paloma",
    displayNameWithArticle: "una paloma",
    category: "smallBird",
    aliases: ["palomas"],
  },
  {
    id: "garza",
    name: "Garza",
    displayNameWithArticle: "una garza",
    category: "largeBird",
    aliases: ["garzas"],
  },
  {
    id: "ciguena",
    name: "Cigüeña",
    displayNameWithArticle: "una cigüeña",
    category: "largeBird",
    aliases: ["ciguena", "cigüeñas", "ciguenas"],
  },
  {
    id: "flamenco",
    name: "Flamenco",
    displayNameWithArticle: "un flamenco",
    category: "largeBird",
    aliases: ["flamencos"],
  },
  {
    id: "grulla",
    name: "Grulla",
    displayNameWithArticle: "una grulla",
    category: "largeBird",
    aliases: ["grullas"],
  },
  {
    id: "anade",
    name: "Ánade",
    displayNameWithArticle: "un ánade",
    category: "largeBird",
    aliases: ["anade", "ánades", "anades"],
  },
  {
    id: "pato",
    name: "Pato",
    displayNameWithArticle: "un pato",
    category: "largeBird",
    aliases: ["patos"],
  },
  {
    id: "oca",
    name: "Oca",
    displayNameWithArticle: "una oca",
    category: "largeBird",
    aliases: ["ocas", "ganso", "gansos"],
  },
  {
    id: "cisne",
    name: "Cisne",
    displayNameWithArticle: "un cisne",
    category: "largeBird",
    aliases: ["cisnes"],
  },
  {
    id: "cormoran",
    name: "Cormorán",
    displayNameWithArticle: "un cormorán",
    category: "largeBird",
    aliases: ["cormoran", "cormoranes"],
  },
  {
    id: "pelicano",
    name: "Pelícano",
    displayNameWithArticle: "un pelícano",
    category: "largeBird",
    aliases: ["pelicano", "pelícanos", "pelicanos"],
  },
  {
    id: "buitre",
    name: "Buitre",
    displayNameWithArticle: "un buitre",
    category: "largeBird",
    aliases: ["buitres"],
  },
  {
    id: "rapaz",
    name: "Rapaz",
    displayNameWithArticle: "una rapaz",
    category: "largeBird",
    aliases: ["ave rapaz", "rapaces"],
  },
  {
    id: "aguila",
    name: "Águila",
    displayNameWithArticle: "un águila",
    category: "largeBird",
    aliases: ["aguila", "águilas", "aguilas"],
  },
  {
    id: "milano",
    name: "Milano",
    displayNameWithArticle: "un milano",
    category: "largeBird",
    aliases: ["milanos"],
  },
  {
    id: "halcon",
    name: "Halcón",
    displayNameWithArticle: "un halcón",
    category: "largeBird",
    aliases: ["halcon", "halcones"],
  },
  {
    id: "cernicalo",
    name: "Cernícalo",
    displayNameWithArticle: "un cernícalo",
    category: "largeBird",
    aliases: ["cernicalo", "cernícalos", "cernicalos"],
  },
  {
    id: "buho",
    name: "Búho",
    displayNameWithArticle: "un búho",
    category: "largeBird",
    aliases: ["buho", "búhos", "buhos"],
  },
  {
    id: "lechuza",
    name: "Lechuza",
    displayNameWithArticle: "una lechuza",
    category: "largeBird",
    aliases: ["lechuzas"],
  },
  {
    id: "mochuelo",
    name: "Mochuelo",
    displayNameWithArticle: "un mochuelo",
    category: "largeBird",
    aliases: ["mochuelos"],
  },
  {
    id: "azor",
    name: "Azor",
    displayNameWithArticle: "un azor",
    category: "largeBird",
    aliases: ["azores"],
  },
  {
    id: "gavilan",
    name: "Gavilán",
    displayNameWithArticle: "un gavilán",
    category: "largeBird",
    aliases: ["gavilan", "gavilanes"],
  },
  {
    id: "urraca",
    name: "Urraca",
    displayNameWithArticle: "una urraca",
    category: "smallBird",
    aliases: ["urracas"],
  },
  {
    id: "cotorra",
    name: "Cotorra",
    displayNameWithArticle: "una cotorra",
    category: "largeBird",
    aliases: ["cotorra argentina", "cotorra de Kramer", "cotorras"],
  },
  {
    id: "cuervo",
    name: "Cuervo",
    displayNameWithArticle: "un cuervo",
    category: "largeBird",
    aliases: ["cuervos"],
  },
  {
    id: "corneja",
    name: "Corneja",
    displayNameWithArticle: "una corneja",
    category: "smallBird",
    aliases: ["cornejas"],
  },
  {
    id: "grajilla",
    name: "Grajilla",
    displayNameWithArticle: "una grajilla",
    category: "smallBird",
    aliases: ["grajillas"],
  },
  {
    id: "murcielago",
    name: "Murciélago",
    displayNameWithArticle: "un murciélago",
    category: "bat",
    aliases: ["murcielago", "murciélagos", "murcielagos", "quiróptero", "quiroptero"],
  },
  {
    id: "murcielago-comun",
    name: "Murciélago común",
    displayNameWithArticle: "un murciélago común",
    category: "bat",
    aliases: ["murcielago comun", "murciélagos comunes", "murcielagos comunes"],
  },
  {
    id: "murcielago-enano",
    name: "Murciélago enano",
    displayNameWithArticle: "un murciélago enano",
    category: "bat",
    aliases: ["murcielago enano", "murciélagos enanos", "murcielagos enanos"],
  },
  {
    id: "comadreja",
    name: "Comadreja",
    displayNameWithArticle: "una comadreja",
    category: "largeMammal",
    aliases: ["comadrejas"],
  },
  {
    id: "erizo",
    name: "Erizo",
    displayNameWithArticle: "un erizo",
    category: "smallMammal",
    aliases: ["erizos"],
  },
  {
    id: "ardilla",
    name: "Ardilla",
    displayNameWithArticle: "una ardilla",
    category: "smallMammal",
    aliases: ["ardillas"],
  },
  {
    id: "liron",
    name: "Lirón",
    displayNameWithArticle: "un lirón",
    category: "smallMammal",
    aliases: ["liron", "lirones"],
  },
  {
    id: "raton",
    name: "Ratón",
    displayNameWithArticle: "un ratón",
    category: "smallMammal",
    aliases: ["raton", "ratones"],
  },
  {
    id: "rata",
    name: "Rata",
    displayNameWithArticle: "una rata",
    category: "smallMammal",
    aliases: ["ratas"],
  },
  {
    id: "topillo",
    name: "Topillo",
    displayNameWithArticle: "un topillo",
    category: "smallMammal",
    aliases: ["topillos"],
  },
  {
    id: "topo",
    name: "Topo",
    displayNameWithArticle: "un topo",
    category: "smallMammal",
    aliases: ["topos"],
  },
  {
    id: "musarana",
    name: "Musaraña",
    displayNameWithArticle: "una musaraña",
    category: "smallMammal",
    aliases: ["musarana", "musarañas", "musaranas"],
  },
  {
    id: "conejo",
    name: "Conejo",
    displayNameWithArticle: "un conejo",
    category: "smallMammal",
    aliases: ["conejos"],
  },
  {
    id: "liebre",
    name: "Liebre",
    displayNameWithArticle: "una liebre",
    category: "smallMammal",
    aliases: ["liebres"],
  },
  {
    id: "huron",
    name: "Hurón",
    displayNameWithArticle: "un hurón",
    category: "smallMammal",
    aliases: ["huron", "hurones"],
  },
  {
    id: "garduna",
    name: "Garduña",
    displayNameWithArticle: "una garduña",
    category: "largeMammal",
    aliases: ["garduna", "garduñas", "gardunas"],
  },
  {
    id: "gineta",
    name: "Gineta",
    displayNameWithArticle: "una gineta",
    category: "largeMammal",
    aliases: ["ginetas", "jineta", "jinetas"],
  },
  {
    id: "desman",
    name: "Desmán",
    displayNameWithArticle: "un desmán",
    category: "largeMammal",
    aliases: ["desmán ibérico", "desman", "desman iberico"],
  },
  {
    id: "vison",
    name: "Visón",
    displayNameWithArticle: "un visón",
    category: "largeMammal",
    aliases: ["visón europeo", "visón americano", "vison", "visones"],
  },
  {
    id: "turon",
    name: "Turón",
    displayNameWithArticle: "un turón",
    category: "largeMammal",
    aliases: ["turon", "turones"],
  },
  {
    id: "marta",
    name: "Marta",
    displayNameWithArticle: "una marta",
    category: "largeMammal",
    aliases: ["martas"],
  },
  {
    id: "armino",
    name: "Armiño",
    displayNameWithArticle: "un armiño",
    category: "largeMammal",
    aliases: ["armino", "armiños", "arminos"],
  },
  {
    id: "meloncillo",
    name: "Meloncillo",
    displayNameWithArticle: "un meloncillo",
    category: "largeMammal",
    aliases: ["meloncillos"],
  },
  {
    id: "gato-montes",
    name: "Gato montés",
    displayNameWithArticle: "un gato montés",
    category: "largeMammal",
    aliases: ["gato montes"],
  },
  {
    id: "lince-iberico",
    name: "Lince ibérico",
    displayNameWithArticle: "un lince ibérico",
    category: "largeMammal",
    aliases: ["lince", "linces"],
  },
  {
    id: "oso-pardo",
    name: "Oso pardo",
    displayNameWithArticle: "un oso pardo",
    category: "largeMammal",
    aliases: ["oso", "osos"],
  },
  {
    id: "zorro",
    name: "Zorro",
    displayNameWithArticle: "un zorro",
    category: "largeMammal",
    aliases: ["zorros"],
  },
  {
    id: "tejon",
    name: "Tejón",
    displayNameWithArticle: "un tejón",
    category: "largeMammal",
    aliases: ["tejon", "tejones"],
  },
  {
    id: "nutria",
    name: "Nutria",
    displayNameWithArticle: "una nutria",
    category: "largeMammal",
    aliases: ["nutrias"],
  },
  {
    id: "corzo",
    name: "Corzo",
    displayNameWithArticle: "un corzo",
    category: "largeMammal",
    aliases: ["corzos"],
  },
  {
    id: "ciervo",
    name: "Ciervo",
    displayNameWithArticle: "un ciervo",
    category: "largeMammal",
    aliases: ["ciervos", "venado", "venados"],
  },
  {
    id: "gamo",
    name: "Gamo",
    displayNameWithArticle: "un gamo",
    category: "largeMammal",
    aliases: ["gamos"],
  },
  {
    id: "jabali",
    name: "Jabalí",
    displayNameWithArticle: "un jabalí",
    category: "largeMammal",
    aliases: ["jabali", "jabalíes", "jabalies"],
  },
  {
    id: "cabra-montes",
    name: "Cabra montés",
    displayNameWithArticle: "una cabra montés",
    category: "largeMammal",
    aliases: ["cabra montes", "cabras monteses"],
  },
  {
    id: "lobo",
    name: "Lobo",
    displayNameWithArticle: "un lobo",
    category: "largeMammal",
    aliases: ["lobos"],
  },
  {
    id: "gallipato",
    name: "Gallipato",
    displayNameWithArticle: "un gallipato",
    category: "reptileAmphibian",
    aliases: ["gallipatos"],
  },
  {
    id: "camaleon",
    name: "Camaleón",
    displayNameWithArticle: "un camaleón",
    category: "reptileAmphibian",
    aliases: ["camaleon", "camaleones"],
  },
  {
    id: "eslizon",
    name: "Eslizón",
    displayNameWithArticle: "un eslizón",
    category: "reptileAmphibian",
    aliases: ["eslizon", "eslizones"],
  },
  {
    id: "lucion",
    name: "Lución",
    displayNameWithArticle: "un lución",
    category: "reptileAmphibian",
    aliases: ["lucion", "luciones"],
  },
  {
    id: "serpiente",
    name: "Serpiente",
    displayNameWithArticle: "una serpiente",
    category: "reptileAmphibian",
    aliases: ["serpientes"],
  },
  {
    id: "culebra",
    name: "Culebra",
    displayNameWithArticle: "una culebra",
    category: "reptileAmphibian",
    aliases: ["culebras"],
  },
  {
    id: "vibora",
    name: "Víbora",
    displayNameWithArticle: "una víbora",
    category: "reptileAmphibian",
    aliases: ["vibora", "víboras", "viboras"],
  },
  {
    id: "lagarto",
    name: "Lagarto",
    displayNameWithArticle: "un lagarto",
    category: "reptileAmphibian",
    aliases: ["lagartos"],
  },
  {
    id: "lagartija",
    name: "Lagartija",
    displayNameWithArticle: "una lagartija",
    category: "reptileAmphibian",
    aliases: ["lagartijas"],
  },
  {
    id: "salamanquesa",
    name: "Salamanquesa",
    displayNameWithArticle: "una salamanquesa",
    category: "reptileAmphibian",
    aliases: ["salamanquesas"],
  },
  {
    id: "galapago",
    name: "Galápago",
    displayNameWithArticle: "un galápago",
    category: "reptileAmphibian",
    aliases: ["galapago", "galápagos", "galapagos"],
  },
  {
    id: "tortuga",
    name: "Tortuga",
    displayNameWithArticle: "una tortuga",
    category: "reptileAmphibian",
    aliases: ["tortugas"],
  },
  {
    id: "rana",
    name: "Rana",
    displayNameWithArticle: "una rana",
    category: "reptileAmphibian",
    aliases: ["ranas"],
  },
  {
    id: "sapo",
    name: "Sapo",
    displayNameWithArticle: "un sapo",
    category: "reptileAmphibian",
    aliases: ["sapos"],
  },
  {
    id: "salamandra",
    name: "Salamandra",
    displayNameWithArticle: "una salamandra",
    category: "reptileAmphibian",
    aliases: ["salamandras"],
  },
  {
    id: "triton",
    name: "Tritón",
    displayNameWithArticle: "un tritón",
    category: "reptileAmphibian",
    aliases: ["triton", "tritones"],
  },
];

export function normalizeAnimalSearchText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

function normalizeAnimalSearchTerms(item: AnimalSearchItem) {
  return [item.name, item.id, ...(item.aliases ?? [])].map(
    normalizeAnimalSearchText,
  );
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function containsWholeAnimalTerm(text: string, term: string) {
  return new RegExp(
    `(^|[^\\p{L}\\p{N}])${escapeRegExp(term)}($|[^\\p{L}\\p{N}])`,
    "u",
  ).test(text);
}

function createWholeAnimalTermMatcher(term: string) {
  const matcher = new RegExp(
    `(^|[^\\p{L}\\p{N}])${escapeRegExp(term)}($|[^\\p{L}\\p{N}])`,
    "u",
  );

  return (text: string) => matcher.test(text);
}

const indexedAnimalSearchCatalog: IndexedAnimalSearchItem[] =
  animalSearchCatalog.map((item) => {
    const terms = normalizeAnimalSearchTerms(item);

    return {
      item,
      terms,
      wholeTermMatchers: terms.map(createWholeAnimalTermMatcher),
    };
  });

export function getAnimalSearchTerms(item: AnimalSearchItem) {
  return (
    indexedAnimalSearchCatalog.find(
      (indexedItem) => indexedItem.item === item,
    )?.terms ?? normalizeAnimalSearchTerms(item)
  );
}

function getMentionedAnimalMatchesFromNormalizedQuery(
  normalizedQuery: string,
): AnimalSearchItem[] {
  if (!normalizedQuery) return [];

  const matches = indexedAnimalSearchCatalog
    .map((indexedItem) => {
      const matchedTerms = indexedItem.terms.filter((_, index) =>
        indexedItem.wholeTermMatchers[index](normalizedQuery),
      );
      const longestMatchedTermLength = Math.max(
        0,
        ...matchedTerms.map((term) => term.length),
      );

      return {
        indexedItem,
        longestMatchedTermLength,
      };
    })
    .filter((match) => match.longestMatchedTermLength > 0);

  return matches
    .filter((match) =>
      match.indexedItem.terms.some((term, termIndex) => {
        if (!match.indexedItem.wholeTermMatchers[termIndex](normalizedQuery)) {
          return false;
        }

        return !matches.some((otherMatch) => {
          if (otherMatch.indexedItem.item.id === match.indexedItem.item.id) {
            return false;
          }

          return otherMatch.indexedItem.terms.some(
            (otherTerm) =>
              otherTerm.length > term.length &&
              containsWholeAnimalTerm(otherTerm, term),
          );
        });
      }),
    )
    .sort(
      (firstMatch, secondMatch) =>
        secondMatch.longestMatchedTermLength -
        firstMatch.longestMatchedTermLength,
    )
    .map((match) => match.indexedItem.item);
}

function getExactAnimalCatalogMatchFromNormalizedQuery(
  normalizedQuery: string,
): AnimalSearchItem | null {
  if (!normalizedQuery) return null;

  const exactMatches = indexedAnimalSearchCatalog.filter((indexedItem) =>
    indexedItem.terms.some((term) => term === normalizedQuery),
  );

  return exactMatches.length === 1 ? exactMatches[0].item : null;
}

export function getAnimalCatalogSearchState(
  query: string,
): AnimalCatalogSearchState {
  const normalizedQuery = normalizeAnimalSearchText(query);

  if (!normalizedQuery) {
    return {
      textMatch: null,
      results: [],
    };
  }

  const exactMatch = getExactAnimalCatalogMatchFromNormalizedQuery(
    normalizedQuery,
  );
  const mentionedMatches = getMentionedAnimalMatchesFromNormalizedQuery(
    normalizedQuery,
  );
  const textMatch =
    exactMatch ?? (mentionedMatches.length === 1 ? mentionedMatches[0] : null);

  if (mentionedMatches.length > 0) {
    return {
      textMatch,
      results: mentionedMatches.slice(0, 8),
    };
  }

  return {
    textMatch,
    results: indexedAnimalSearchCatalog
      .filter((indexedItem) =>
        indexedItem.terms.some((term) =>
          term.includes(normalizedQuery),
        ),
      )
      .slice(0, 8)
      .map((indexedItem) => indexedItem.item),
  };
}

export function searchAnimalCatalog(query: string): AnimalSearchItem[] {
  return getAnimalCatalogSearchState(query).results;
}

export function findExactAnimalCatalogMatch(
  query: string,
): AnimalSearchItem | null {
  return getExactAnimalCatalogMatchFromNormalizedQuery(
    normalizeAnimalSearchText(query),
  );
}

export function findAnimalCatalogTextMatch(
  query: string,
): AnimalSearchItem | null {
  return getAnimalCatalogSearchState(query).textMatch;
}
