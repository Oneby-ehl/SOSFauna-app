// Reverse only authorised Spanish summary lookups for historical hashes.
// Executed recommendation comparisons always use the current application.
const assert = require("node:assert/strict");
const groups = {
  "utils/rescueShareMessage.ts": {
    "importLine": "import { rescueSummaryEs } from \"@/i18n/catalogs/rescue-summary.es\";\r\n",
    "edits": [
      [
        "\"Información recopilada con SOS Fauna España\"",
        "rescueSummaryEs.rescueMessage.attribution",
        1
      ],
      [
        "\"Información adicional\"",
        "rescueSummaryEs.rescueMessage.additionalHeading",
        1
      ],
      [
        "\"Situación\"",
        "rescueSummaryEs.rescueMessage.situationHeading",
        1
      ],
      [
        "} que puede necesitar ayuda.`",
        "}${rescueSummaryEs.rescueMessage.introductionSuffix}`",
        1
      ],
      [
        "`He encontrado un animal ${",
        "`${rescueSummaryEs.rescueMessage.introductionPrefix}${",
        1
      ],
      [
        "\"AVISO DE RESCATE DE FAUNA\"",
        "rescueSummaryEs.rescueMessage.title",
        1
      ],
      [
        "\"• Vídeo disponible\"",
        "rescueSummaryEs.rescueMessage.videoAvailable",
        1
      ],
      [
        "\"• Foto disponible\"",
        "rescueSummaryEs.rescueMessage.photoAvailable",
        1
      ],
      [
        "`• Señales observadas: ${",
        "`${rescueSummaryEs.rescueMessage.observedSignsPrefix}${",
        1
      ],
      [
        "`• Dónde está el animal: ${",
        "`${rescueSummaryEs.rescueMessage.legacyPlacePrefix}${",
        1
      ],
      [
        "`• Entorno: ${",
        "`${rescueSummaryEs.rescueMessage.environmentPrefix}${",
        1
      ],
      [
        "`• Dónde está: ${",
        "`${rescueSummaryEs.rescueMessage.positionPrefix}${",
        1
      ],
      [
        "`• Tipo: ${",
        "`${rescueSummaryEs.rescueMessage.animalTypePrefix}${",
        1
      ],
      [
        "`• Estado: ${",
        "`${rescueSummaryEs.rescueMessage.statePrefix}${",
        1
      ]
    ]
  },
  "app/history.tsx": {
    "importLine": "import { rescueSummaryEs } from \"@/i18n/catalogs/rescue-summary.es\";\r\n",
    "edits": [
      [
        "\"El resumen del aviso se ha copiado.\"",
        "rescueSummaryEs.summaryHistory.clipboardMessage",
        1
      ],
      [
        "\"Resumen copiado\"",
        "rescueSummaryEs.summaryHistory.clipboardTitle",
        1
      ],
      [
        "\"Resumen copiado al portapapeles.\"",
        "rescueSummaryEs.summaryHistory.clipboardWeb",
        1
      ],
      [
        "Copiar resumen",
        "{rescueSummaryEs.summaryHistory.copySummary}",
        1
      ],
      [
        "Situación",
        "{rescueSummaryEs.summaryHistory.situation}",
        1
      ],
      [
        "Dónde está el animal",
        "{rescueSummaryEs.summaryHistory.legacyPlace}",
        1
      ],
      [
        "Entorno",
        "{rescueSummaryEs.summaryHistory.environment}",
        1
      ],
      [
        "Dónde está",
        "{rescueSummaryEs.summaryHistory.position}",
        1
      ],
      [
        "`Fecha del aviso: ${",
        "`${rescueSummaryEs.summaryHistory.datePrefix}${",
        1
      ],
      [
        "`Referencia del lugar: ${",
        "`${rescueSummaryEs.summaryLocation.referencePrefix}${",
        4
      ],
      [
        "`Mapa: https://maps.google.com/?q=${",
        "`${rescueSummaryEs.summaryLocation.mapPrefix}https://maps.google.com/?q=${",
        2
      ],
      [
        "`Coordenadas: ${",
        "`${rescueSummaryEs.summaryLocation.coordinatesPrefix}${",
        2
      ],
      [
        "\"Sin incidencias destacables.\"",
        "rescueSummaryEs.summaryHistory.noIncidents",
        1
      ],
      [
        "\"Fecha no disponible\"",
        "rescueSummaryEs.summaryHistory.dateUnavailable",
        2
      ],
      [
        "\"Presenta otra situación\"",
        "rescueSummaryEs.historyFlagLabels.other",
        1
      ],
      [
        "\"Está descansando en tierra\"",
        "rescueSummaryEs.historyFlagLabels.restingOnLand",
        1
      ],
      [
        "\"Hay personas o perros cerca\"",
        "rescueSummaryEs.historyFlagLabels.peopleDogsNearby",
        1
      ],
      [
        "\"Hay más animales afectados\"",
        "rescueSummaryEs.historyFlagLabels.moreAnimals",
        1
      ],
      [
        "\"Tiene sedal, anzuelo o aparejos\"",
        "rescueSummaryEs.historyFlagLabels.fishingLineHook",
        1
      ],
      [
        "\"Está varado o fuera del agua\"",
        "rescueSummaryEs.historyFlagLabels.stranded",
        1
      ],
      [
        "\"Tiene dificultad para respirar\"",
        "rescueSummaryEs.historyFlagLabels.breathing",
        1
      ],
      [
        "\"Presenta apariencia normal\"",
        "rescueSummaryEs.historyFlagLabels.normalAppearance",
        1
      ],
      [
        "\"Muestra debilidad\"",
        "rescueSummaryEs.historyFlagLabels.weakness",
        1
      ],
      [
        "\"No puede volar\"",
        "rescueSummaryEs.historyFlagLabels.cannotFly",
        1
      ],
      [
        "\"Está atrapado\"",
        "rescueSummaryEs.historyFlagLabels.trapped",
        1
      ],
      [
        "\"Lleva marca o dispositivo de seguimiento\"",
        "rescueSummaryEs.historyFlagLabels.ringGps",
        1
      ],
      [
        "\"Está cerca de una carretera\"",
        "rescueSummaryEs.historyFlagLabels.roadRisk",
        1
      ],
      [
        "\"No puede moverse\"",
        "rescueSummaryEs.historyFlagLabels.canNotMove",
        1
      ],
      [
        "\"Ha sido atacado por un gato o un perro\"",
        "rescueSummaryEs.historyFlagLabels.catDog",
        1
      ],
      [
        "\"Es una cría\"",
        "rescueSummaryEs.historyFlagLabels.baby",
        1
      ],
      [
        "\"Herido\"",
        "rescueSummaryEs.historyFlagLabels.bleeding",
        1
      ],
      [
        "\"Otro entorno\"",
        "rescueSummaryEs.historyEnvironmentLabels.otherEnvironment",
        1
      ],
      [
        "\"Desembocadura / estuario\"",
        "rescueSummaryEs.historyEnvironmentLabels.estuaryMouth",
        1
      ],
      [
        "\"En mar abierto\"",
        "rescueSummaryEs.historyEnvironmentLabels.openSea",
        1
      ],
      [
        "\"En puerto / marina\"",
        "rescueSummaryEs.historyEnvironmentLabels.portMarina",
        1
      ],
      [
        "\"Zona rocosa / acantilado\"",
        "rescueSummaryEs.historyEnvironmentLabels.rockyCoastCliff",
        1
      ],
      [
        "\"En costa / playa\"",
        "rescueSummaryEs.historyEnvironmentLabels.coastBeach",
        1
      ],
      [
        "\"En una zona urbana\"",
        "rescueSummaryEs.historyEnvironmentLabels.urbanArea",
        1
      ],
      [
        "\"En una zona industrial\"",
        "rescueSummaryEs.historyEnvironmentLabels.industrialArea",
        1
      ],
      [
        "\"En el campo o entorno natural\"",
        "rescueSummaryEs.historyEnvironmentLabels.fieldOrNatural",
        1
      ],
      [
        "\"En un parque o jardín\"",
        "rescueSummaryEs.historyEnvironmentLabels.parkOrGarden",
        1
      ],
      [
        "\"En una carretera o calle\"",
        "rescueSummaryEs.historyEnvironmentLabels.roadOrStreet",
        1
      ],
      [
        "\"Otro lugar\"",
        "rescueSummaryEs.historyPositionLabels.otherPlace",
        1
      ],
      [
        "\"En una embarcación\"",
        "rescueSummaryEs.historyPositionLabels.onBoat",
        1
      ],
      [
        "\"En un puerto / muelle\"",
        "rescueSummaryEs.historyPositionLabels.portDock",
        1
      ],
      [
        "\"En rocas / espigón\"",
        "rescueSummaryEs.historyPositionLabels.rocksBreakwater",
        1
      ],
      [
        "\"En la orilla / agua somera\"",
        "rescueSummaryEs.historyPositionLabels.shoreShallowWater",
        1
      ],
      [
        "\"En arena / playa\"",
        "rescueSummaryEs.historyPositionLabels.beachSand",
        1
      ],
      [
        "\"En el agua\"",
        "rescueSummaryEs.historyPositionLabels.water",
        1
      ],
      [
        "\"En un edificio o tejado\"",
        "rescueSummaryEs.historyPositionLabels.buildingOrRoof",
        1
      ],
      [
        "\"En un árbol o arbusto\"",
        "rescueSummaryEs.historyPositionLabels.treeOrBush",
        1
      ],
      [
        "\"En el suelo\"",
        "rescueSummaryEs.historyPositionLabels.ground",
        1
      ],
      [
        "\"Otro lugar\"",
        "rescueSummaryEs.historyPlaceLabels.otherPlace",
        1
      ],
      [
        "\"En el agua\"",
        "rescueSummaryEs.historyPlaceLabels.water",
        1
      ],
      [
        "\"En una zona industrial\"",
        "rescueSummaryEs.historyPlaceLabels.industrialArea",
        1
      ],
      [
        "\"En el campo o entorno natural\"",
        "rescueSummaryEs.historyPlaceLabels.fieldOrNatural",
        1
      ],
      [
        "\"En un parque o jardín\"",
        "rescueSummaryEs.historyPlaceLabels.parkOrGarden",
        1
      ],
      [
        "\"En una carretera o calle\"",
        "rescueSummaryEs.historyPlaceLabels.roadOrStreet",
        1
      ],
      [
        "\"En un edificio o tejado\"",
        "rescueSummaryEs.historyPlaceLabels.buildingOrRoof",
        1
      ],
      [
        "\"En un árbol o arbusto\"",
        "rescueSummaryEs.historyPlaceLabels.treeOrBush",
        1
      ],
      [
        "\"En el suelo\"",
        "rescueSummaryEs.historyPlaceLabels.ground",
        1
      ],
      [
        "\"Muerto\"",
        "rescueSummaryEs.historyStateLabels.dead",
        1
      ],
      [
        "\"Vivo\"",
        "rescueSummaryEs.historyStateLabels.alive",
        1
      ],
      [
        "\"Animal sin identificar\"",
        "rescueSummaryEs.historyAnimalLabels.unknown",
        1
      ],
      [
        "\"Otro animal marino\"",
        "rescueSummaryEs.historyAnimalLabels.otherMarine",
        1
      ],
      [
        "\"Tiburón / raya\"",
        "rescueSummaryEs.historyAnimalLabels.sharkRay",
        1
      ],
      [
        "\"Tortuga marina\"",
        "rescueSummaryEs.historyAnimalLabels.seaTurtle",
        1
      ],
      [
        "\"Foca\"",
        "rescueSummaryEs.historyAnimalLabels.seal",
        1
      ],
      [
        "\"Ballena / cetáceo grande\"",
        "rescueSummaryEs.historyAnimalLabels.largeCetacean",
        1
      ],
      [
        "\"Delfín\"",
        "rescueSummaryEs.historyAnimalLabels.dolphin",
        1
      ],
      [
        "\"Reptil o anfibio\"",
        "rescueSummaryEs.historyAnimalLabels.reptileAmphibian",
        1
      ],
      [
        "\"Mamífero grande\"",
        "rescueSummaryEs.historyAnimalLabels.largeMammal",
        1
      ],
      [
        "\"Mamífero pequeño\"",
        "rescueSummaryEs.historyAnimalLabels.smallMammal",
        1
      ],
      [
        "\"Murciélago\"",
        "rescueSummaryEs.historyAnimalLabels.bat",
        1
      ],
      [
        "\"Ave mediana / grande\"",
        "rescueSummaryEs.historyAnimalLabels.largeBird",
        1
      ],
      [
        "\"Ave pequeña\"",
        "rescueSummaryEs.historyAnimalLabels.smallBird",
        1
      ]
    ]
  },
  "components/sos/SosAssistant.tsx": {
    "importLine": "import { rescueSummaryEs } from \"@/i18n/catalogs/rescue-summary.es\";\r\n",
    "edits": [
      [
        " si ya\r\n                has informado a un especialista o para descartar el aviso.\r\n              ",
        "{rescueSummaryEs.summaryInstructions.finishSuffix}",
        1
      ],
      [
        "Finalizar",
        "{rescueSummaryEs.summaryInstructions.finishName}",
        1
      ],
      [
        "\r\n                • Usa ",
        "{rescueSummaryEs.summaryInstructions.finishPrefix}",
        1
      ],
      [
        " para buscar\r\n                el centro más cercano a tu provincia o servicios de emergencias.\r\n              ",
        "{rescueSummaryEs.summaryInstructions.helpSuffix}",
        1
      ],
      [
        "Ayuda",
        "{rescueSummaryEs.summaryInstructions.helpName}",
        1
      ],
      [
        "\r\n                • Usa ",
        "{rescueSummaryEs.summaryInstructions.helpPrefix}",
        1
      ],
      [
        " para\r\n                guardar el resumen en el portapapeles y compartirlo mediante\r\n                cualquier aplicación.\r\n              ",
        "{rescueSummaryEs.summaryInstructions.copySuffix}",
        1
      ],
      [
        "Copiar",
        "{rescueSummaryEs.summaryInstructions.copyName}",
        1
      ],
      [
        "\r\n                • Usa ",
        "{rescueSummaryEs.summaryInstructions.copyPrefix}",
        1
      ],
      [
        " para\r\n                enviarlo a GREFA Madrid o a otro contacto que elijas.\r\n              ",
        "{rescueSummaryEs.summaryInstructions.whatsappSuffix}",
        1
      ],
      [
        "WhatsApp",
        "{rescueSummaryEs.summaryInstructions.whatsappName}",
        1
      ],
      [
        "\r\n                • Usa ",
        "{rescueSummaryEs.summaryInstructions.whatsappPrefix}",
        1
      ],
      [
        "\r\n                • Revisa si el resumen es correcto o retrocede para corregir.\r\n              ",
        "{rescueSummaryEs.summaryInstructions.review}",
        1
      ],
      [
        "\"❌ No\"",
        "rescueSummaryEs.summaryPreview.no",
        2
      ],
      [
        "\"✅ Sí\"",
        "rescueSummaryEs.summaryPreview.yes",
        2
      ],
      [
        "🎥 Vídeo",
        "{rescueSummaryEs.summaryPreview.video}",
        1
      ],
      [
        "📷 Fotografía",
        "{rescueSummaryEs.summaryPreview.photo}",
        1
      ],
      [
        "❌ No",
        "{rescueSummaryEs.summaryPreview.no}",
        1
      ],
      [
        "\"Mapa incluido en el aviso\"",
        "rescueSummaryEs.summaryPreview.mapIncluded",
        1
      ],
      [
        "📍 Ubicación",
        "{rescueSummaryEs.summaryPreview.location}",
        1
      ],
      [
        "Sin marcas",
        "{rescueSummaryEs.summaryPreview.noFlags}",
        1
      ],
      [
        "⚠️ Situación observada",
        "{rescueSummaryEs.summaryPreview.observedSituation}",
        1
      ],
      [
        "📍 Dónde está el animal",
        "{rescueSummaryEs.summaryPreview.legacyPlace}",
        1
      ],
      [
        "🌍 Entorno",
        "{rescueSummaryEs.summaryPreview.environment}",
        1
      ],
      [
        "📍 Dónde está",
        "{rescueSummaryEs.summaryPreview.position}",
        1
      ],
      [
        "❤️ Estado",
        "{rescueSummaryEs.summaryPreview.state}",
        1
      ],
      [
        "🐾 Animal",
        "{rescueSummaryEs.summaryPreview.animal}",
        1
      ],
      [
        "📋 RESUMEN DEL AVISO",
        "{rescueSummaryEs.summaryPreview.title}",
        1
      ],
      [
        "\"No indicado\"",
        "rescueSummaryEs.summaryPreview.notSpecified",
        5
      ],
      [
        "`Mapa: https://maps.google.com/?q=${",
        "`${rescueSummaryEs.summaryLocation.mapPrefix}https://maps.google.com/?q=${",
        1
      ],
      [
        "`Coordenadas: ${",
        "`${rescueSummaryEs.summaryLocation.coordinatesPrefix}${",
        1
      ],
      [
        "`Referencia del lugar: ${",
        "`${rescueSummaryEs.summaryLocation.referencePrefix}${",
        1
      ]
    ]
  }
};
function restoreSummary(source, file) {
  const group = groups[file];
  assert.equal(source.split(group.importLine).length, 2);
  source = source.replace(group.importLine, "");
  for (const [before, after, count] of [...group.edits].sort((a,b) => b[1].length-a[1].length)) {
    assert.equal(source.split(after).length, count + 1, "Unexpected 2AA summary change: " + after);
    source = source.split(after).join(before);
  }
  return source;
}
// Frozen Spanish values from the 2AA extraction, never recaptured during checks.
const spanishCopy = {
  "rescueMessage": {
    "statePrefix": "• Estado: ",
    "animalTypePrefix": "• Tipo: ",
    "positionPrefix": "• Dónde está: ",
    "environmentPrefix": "• Entorno: ",
    "legacyPlacePrefix": "• Dónde está el animal: ",
    "observedSignsPrefix": "• Señales observadas: ",
    "photoAvailable": "• Foto disponible",
    "videoAvailable": "• Vídeo disponible",
    "title": "AVISO DE RESCATE DE FAUNA",
    "introductionPrefix": "He encontrado un animal ",
    "introductionSuffix": " que puede necesitar ayuda.",
    "situationHeading": "Situación",
    "additionalHeading": "Información adicional",
    "attribution": "Información recopilada con SOS Fauna España"
  },
  "historyAnimalLabels": {
    "smallBird": "Ave pequeña",
    "largeBird": "Ave mediana / grande",
    "bat": "Murciélago",
    "smallMammal": "Mamífero pequeño",
    "largeMammal": "Mamífero grande",
    "reptileAmphibian": "Reptil o anfibio",
    "dolphin": "Delfín",
    "largeCetacean": "Ballena / cetáceo grande",
    "seal": "Foca",
    "seaTurtle": "Tortuga marina",
    "sharkRay": "Tiburón / raya",
    "otherMarine": "Otro animal marino",
    "unknown": "Animal sin identificar"
  },
  "historyStateLabels": {
    "alive": "Vivo",
    "dead": "Muerto"
  },
  "historyPlaceLabels": {
    "ground": "En el suelo",
    "treeOrBush": "En un árbol o arbusto",
    "buildingOrRoof": "En un edificio o tejado",
    "roadOrStreet": "En una carretera o calle",
    "parkOrGarden": "En un parque o jardín",
    "fieldOrNatural": "En el campo o entorno natural",
    "industrialArea": "En una zona industrial",
    "water": "En el agua",
    "otherPlace": "Otro lugar"
  },
  "historyPositionLabels": {
    "ground": "En el suelo",
    "treeOrBush": "En un árbol o arbusto",
    "buildingOrRoof": "En un edificio o tejado",
    "water": "En el agua",
    "beachSand": "En arena / playa",
    "shoreShallowWater": "En la orilla / agua somera",
    "rocksBreakwater": "En rocas / espigón",
    "portDock": "En un puerto / muelle",
    "onBoat": "En una embarcación",
    "otherPlace": "Otro lugar"
  },
  "historyEnvironmentLabels": {
    "roadOrStreet": "En una carretera o calle",
    "parkOrGarden": "En un parque o jardín",
    "fieldOrNatural": "En el campo o entorno natural",
    "industrialArea": "En una zona industrial",
    "urbanArea": "En una zona urbana",
    "coastBeach": "En costa / playa",
    "rockyCoastCliff": "Zona rocosa / acantilado",
    "portMarina": "En puerto / marina",
    "openSea": "En mar abierto",
    "estuaryMouth": "Desembocadura / estuario",
    "otherEnvironment": "Otro entorno"
  },
  "historyFlagLabels": {
    "bleeding": "Herido",
    "baby": "Es una cría",
    "catDog": "Ha sido atacado por un gato o un perro",
    "canNotMove": "No puede moverse",
    "roadRisk": "Está cerca de una carretera",
    "ringGps": "Lleva marca o dispositivo de seguimiento",
    "trapped": "Está atrapado",
    "cannotFly": "No puede volar",
    "weakness": "Muestra debilidad",
    "normalAppearance": "Presenta apariencia normal",
    "breathing": "Tiene dificultad para respirar",
    "stranded": "Está varado o fuera del agua",
    "fishingLineHook": "Tiene sedal, anzuelo o aparejos",
    "moreAnimals": "Hay más animales afectados",
    "peopleDogsNearby": "Hay personas o perros cerca",
    "restingOnLand": "Está descansando en tierra",
    "other": "Presenta otra situación"
  },
  "summaryHistory": {
    "dateUnavailable": "Fecha no disponible",
    "noIncidents": "Sin incidencias destacables.",
    "datePrefix": "Fecha del aviso: ",
    "position": "Dónde está",
    "environment": "Entorno",
    "legacyPlace": "Dónde está el animal",
    "situation": "Situación",
    "copySummary": "Copiar resumen",
    "clipboardWeb": "Resumen copiado al portapapeles.",
    "clipboardTitle": "Resumen copiado",
    "clipboardMessage": "El resumen del aviso se ha copiado."
  },
  "summaryLocation": {
    "referencePrefix": "Referencia del lugar: ",
    "coordinatesPrefix": "Coordenadas: ",
    "mapPrefix": "Mapa: "
  },
  "summaryPreview": {
    "notSpecified": "No indicado",
    "title": "📋 RESUMEN DEL AVISO",
    "animal": "🐾 Animal",
    "state": "❤️ Estado",
    "position": "📍 Dónde está",
    "environment": "🌍 Entorno",
    "legacyPlace": "📍 Dónde está el animal",
    "observedSituation": "⚠️ Situación observada",
    "noFlags": "Sin marcas",
    "location": "📍 Ubicación",
    "mapIncluded": "Mapa incluido en el aviso",
    "no": "❌ No",
    "photo": "📷 Fotografía",
    "yes": "✅ Sí",
    "video": "🎥 Vídeo"
  },
  "summaryInstructions": {
    "review": "• Revisa si el resumen es correcto o retrocede para corregir.",
    "whatsappPrefix": "• Usa ",
    "whatsappName": "WhatsApp",
    "whatsappSuffix": " para enviarlo a GREFA Madrid o a otro contacto que elijas.",
    "copyPrefix": "• Usa ",
    "copyName": "Copiar",
    "copySuffix": " para guardar el resumen en el portapapeles y compartirlo mediante cualquier aplicación.",
    "helpPrefix": "• Usa ",
    "helpName": "Ayuda",
    "helpSuffix": " para buscar el centro más cercano a tu provincia o servicios de emergencias.",
    "finishPrefix": "• Usa ",
    "finishName": "Finalizar",
    "finishSuffix": " si ya has informado a un especialista o para descartar el aviso."
  }
};
function verifySummaryCopy(actual) {
  for (const [area, entries] of Object.entries(spanishCopy)) {
    for (const [key, value] of Object.entries(entries)) assert.equal(actual[area]?.[key], value, "Spanish summary copy changed: " + area + "." + key);
  }
}
module.exports = { restoreSummary, verifySummaryCopy };
