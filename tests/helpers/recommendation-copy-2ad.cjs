// Reverse only authorised 2AD fragment lookups for historical hashes.
const assert=require("node:assert/strict");
const groups={
  "components/sos/SosAssistant.tsx": {
    "importLine": "import { recommendationFragmentsEs } from \"@/i18n/catalogs/recommendation-fragments.es\";\r\n",
    "edits": [
      [
        "\"✅ QUÉ HACER\\n\"",
        "recommendationFragmentsEs.rescueHeadings.actionsLine",
        30
      ],
      [
        "\"❌ QUÉ NO HACER\\n\"",
        "recommendationFragmentsEs.rescueHeadings.doNotLine",
        28
      ],
      [
        "\"🔍 QUÉ OBSERVAR\\n\"",
        "recommendationFragmentsEs.rescueHeadings.whatToObserveLine",
        1
      ],
      [
        "\"⚠️ ANTES DE INTERVENIR\\n\"",
        "recommendationFragmentsEs.rescueHeadings.beforeInterveningLine",
        17
      ],
      [
        "\"🚨 SEÑALES OBSERVADAS\\n\"",
        "recommendationFragmentsEs.rescueHeadings.observedSignsLine",
        10
      ],
      [
        "\"❓ NO ESTOY SEGURO\\n\\n\"",
        "recommendationFragmentsEs.rescueHeadings.unknownAnimalParagraph",
        1
      ],
      [
        "\"\\n\\n⚠️ ANTES DE INTERVENIR\\n\"",
        "recommendationFragmentsEs.rescueHeadings.beforeInterveningAfterParagraph",
        2
      ],
      [
        "\"\\n🚨 SEÑALES OBSERVADAS\\n\"",
        "recommendationFragmentsEs.rescueHeadings.observedSignsAfterLine",
        1
      ],
      [
        "\"• Mantén personas y perros alejados si puedes hacerlo sin riesgo.\"",
        "recommendationFragmentsEs.rescueInstructions.keepPeopleAndDogsAway",
        1
      ],
      [
        "\"• Reduce los ruidos y evita la presencia de personas y animales domésticos.\\n\"",
        "recommendationFragmentsEs.rescueInstructions.reduceNoisePeopleAndPetsLine",
        1
      ],
      [
        "\"• No intentes coger, capturar, manipular ni trasladar serpientes, culebras o víboras, aunque creas haber identificado la especie. Si no puedes descartar que sea una serpiente, culebra o víbora, mantén la distancia y no intentes cogerla, capturarla, manipularla, liberarla ni trasladarla.\\n\"",
        "recommendationFragmentsEs.rescueInstructions.snakeNoHandlingOrTransferLine",
        1
      ],
      [
        "\"• Sigue siempre las indicaciones del personal especializado.\\n\\n\"",
        "recommendationFragmentsEs.rescueInstructions.followSpecialistsParagraph",
        1
      ],
      [
        "\"• No lo manipules más de lo necesario.\\n\"",
        "recommendationFragmentsEs.rescueInstructions.minimalHandlingMaleLine",
        1
      ],
      [
        "\"• Mantén la caja en un lugar tranquilo, oscuro y protegido del frío o del calor extremo.\\n\"",
        "recommendationFragmentsEs.rescueInstructions.quietDarkProtectedBoxLine",
        1
      ],
      [
        "\"• No lo manipules más de lo necesario.\\n\\n\"",
        "recommendationFragmentsEs.rescueInstructions.minimalHandlingMaleParagraph",
        1
      ],
      [
        "\"• Si observas cualquiera de estas señales, vuelve al paso anterior y marca las opciones correspondientes.\\n\"",
        "recommendationFragmentsEs.rescueInstructions.returnToSignsLine",
        1
      ],
      [
        "\"• No acerques la cara ni las manos desnudas.\\n\"",
        "recommendationFragmentsEs.rescueInstructions.keepFaceAndBareHandsAwayLine",
        2
      ],
      [
        "\"• No la manipules para comprobar si está sana.\\n\"",
        "recommendationFragmentsEs.rescueInstructions.doNotTestHealthFemaleLine",
        1
      ],
      [
        "\"🚨 PUEDE NECESITAR AYUDA SI\\n\"",
        "recommendationFragmentsEs.rescueHeadings.mayNeedHelpLine",
        7
      ],
      [
        "\"• Si observas cualquiera de estas señales, vuelve al paso anterior y marca las opciones correspondientes.\\n\\n\"",
        "recommendationFragmentsEs.rescueInstructions.returnToSignsParagraph",
        1
      ],
      [
        "\"• No la manipules para comprobar si está sana.\\n\\n\"",
        "recommendationFragmentsEs.rescueInstructions.doNotTestHealthFemaleParagraph",
        1
      ],
      [
        "\"• No la recojas automáticamente por estar en el suelo.\\n\"",
        "recommendationFragmentsEs.rescueInstructions.doNotCollectAutomaticallyLine",
        1
      ],
      [
        "\"\\n\\n❌ QUÉ NO HACER\\n\"",
        "recommendationFragmentsEs.rescueHeadings.doNotAfterParagraph",
        2
      ],
      [
        "\"• No la manipules más de lo necesario.\\n\"",
        "recommendationFragmentsEs.rescueInstructions.minimalHandlingFemaleLine",
        1
      ],
      [
        "\"• Se ha observado otra circunstancia que genera preocupación.\"",
        "recommendationFragmentsEs.observedSigns.other",
        1
      ],
      [
        "\"• Se encuentra en una zona con tráfico o peligro inmediato.\"",
        "recommendationFragmentsEs.observedSigns.roadRisk",
        1
      ],
      [
        "\"• Está descansando en tierra.\"",
        "recommendationFragmentsEs.observedSigns.restingOnLand",
        1
      ],
      [
        "\"• Hay personas o perros cerca del animal.\"",
        "recommendationFragmentsEs.observedSigns.peopleDogsNearby",
        1
      ],
      [
        "\"• Hay más animales afectados.\"",
        "recommendationFragmentsEs.observedSigns.moreAnimals",
        1
      ],
      [
        "\"• Tiene sedal, anzuelo o aparejos.\"",
        "recommendationFragmentsEs.observedSigns.fishingLineHook",
        1
      ],
      [
        "\"• Está varado o fuera del agua.\"",
        "recommendationFragmentsEs.observedSigns.stranded",
        1
      ],
      [
        "\"• Presenta respiración agitada.\"",
        "recommendationFragmentsEs.observedSigns.breathing",
        1
      ],
      [
        "\"• Presenta debilidad o decaimiento.\"",
        "recommendationFragmentsEs.observedSigns.weakness",
        1
      ],
      [
        "\"• No puede volar.\"",
        "recommendationFragmentsEs.observedSigns.cannotFly",
        1
      ],
      [
        "\"• No se mueve con normalidad.\"",
        "recommendationFragmentsEs.observedSigns.canNotMove",
        1
      ],
      [
        "\"• Ha sufrido un ataque de gato o perro.\"",
        "recommendationFragmentsEs.observedSigns.catDog",
        1
      ],
      [
        "\"• Presenta signos de lesión.\"",
        "recommendationFragmentsEs.observedSigns.bleeding",
        1
      ],
      [
        "\"🚨 SI NECESITA AYUDA\\n\\n\"",
        "recommendationFragmentsEs.rescueHeadings.ifNeedsHelpParagraph",
        1
      ],
      [
        "\"🚨 ACTÚA CON CALMA\\n\"",
        "recommendationFragmentsEs.rescueHeadings.actCalmlyLine",
        7
      ]
    ]
  },
  "components/faq/FaqPage.tsx": {
    "importLine": "import { recommendationFragmentsEs } from \"@/i18n/catalogs/recommendation-fragments.es\";\r\n",
    "edits": [
      [
        "}?`",
        "}${recommendationFragmentsEs.dynamicFaqCopy.animalQuestionSuffix}`",
        1
      ],
      [
        "`¿Qué debo hacer si encuentro ${",
        "`${recommendationFragmentsEs.dynamicFaqCopy.animalQuestionPrefix}${",
        1
      ],
      [
        "\"• Contacta cuanto antes con un centro especializado, Agentes Forestales o Medioambientales.\"",
        "recommendationFragmentsEs.rescueInstructions.swiftContactSpecialists",
        1
      ],
      [
        "\"• Mantenlo en una caja de cartón ventilada y bien cerrada, en un lugar tranquilo y protegido del frío o del calor extremo.\\n\"",
        "recommendationFragmentsEs.rescueInstructions.swiftClosedVentilatedBoxLine",
        1
      ],
      [
        "\"• Recógelo con cuidado y con la mínima manipulación posible.\\n\"",
        "recommendationFragmentsEs.rescueInstructions.swiftCollectWithMinimalHandlingLine",
        1
      ],
      [
        "\"✅ QUÉ HACER\\n\"",
        "recommendationFragmentsEs.rescueHeadings.actionsLine",
        1
      ],
      [
        "\"• No lo manipules para comprobar si está sano.\\n\\n\"",
        "recommendationFragmentsEs.rescueInstructions.doNotTestHealthMaleParagraph",
        1
      ],
      [
        "\"• No le des comida ni agua sin indicación.\\n\"",
        "recommendationFragmentsEs.rescueInstructions.swiftNoFoodOrWaterLine",
        1
      ],
      [
        "\"❌ QUÉ NO HACER\\n\"",
        "recommendationFragmentsEs.rescueHeadings.doNotLine",
        1
      ],
      [
        "\"• Si parece un vencejo, estar en el suelo no es normal: protégelo en una caja de cartón ventilada y consulta cuanto antes.\\n\\n\"",
        "recommendationFragmentsEs.rescueInstructions.swiftOnGroundParagraph",
        1
      ],
      [
        "\"⚠️ ANTES DE INTERVENIR\\n\"",
        "recommendationFragmentsEs.rescueHeadings.beforeInterveningLine",
        1
      ],
      [
        "\"🐦 AVE PEQUEÑA\\n\\n\"",
        "recommendationFragmentsEs.rescueHeadings.smallBirdParagraph",
        1
      ],
      [
        "} o en una situación que te preocupa, utiliza el asistente de SOS Fauna España. Te indicará qué observar y cómo actuar según la situación.`",
        "}${recommendationFragmentsEs.dynamicFaqCopy.marineSuffix}`",
        1
      ],
      [
        "`Si has encontrado ${",
        "`${recommendationFragmentsEs.dynamicFaqCopy.marinePrefix}${",
        1
      ],
      [
        "\"Si has encontrado un animal marino herido, varado, enredado, débil o en una situación que te preocupa, utiliza el asistente de SOS Fauna España. Te indicará qué observar y cómo actuar según la situación.\"",
        "recommendationFragmentsEs.dynamicFaqCopy.otherMarine",
        1
      ],
      [
        "\"Una foca en tierra puede estar simplemente descansando. Si parece herida, muy débil, enredada o hay alguna situación que te preocupa, utiliza el asistente de SOS Fauna España. Te indicará qué observar y cómo actuar según la situación.\"",
        "recommendationFragmentsEs.dynamicFaqCopy.sealResting",
        1
      ],
      [
        "\"débil\"",
        "recommendationFragmentsEs.dynamicFaqGrammar.weakSingular",
        1
      ],
      [
        "\"débiles\"",
        "recommendationFragmentsEs.dynamicFaqGrammar.weakPlural",
        1
      ],
      [
        "\"enredado\"",
        "recommendationFragmentsEs.dynamicFaqGrammar.entangledMale",
        1
      ],
      [
        "\"enredada\"",
        "recommendationFragmentsEs.dynamicFaqGrammar.entangledFemale",
        1
      ],
      [
        "\"enredados\"",
        "recommendationFragmentsEs.dynamicFaqGrammar.entangledPlural",
        1
      ],
      [
        "\"varado\"",
        "recommendationFragmentsEs.dynamicFaqGrammar.strandedMale",
        1
      ],
      [
        "\"varada\"",
        "recommendationFragmentsEs.dynamicFaqGrammar.strandedFemale",
        1
      ],
      [
        "\"varados\"",
        "recommendationFragmentsEs.dynamicFaqGrammar.strandedPlural",
        1
      ],
      [
        "\"herido\"",
        "recommendationFragmentsEs.dynamicFaqGrammar.injuredMale",
        1
      ],
      [
        "\"herida\"",
        "recommendationFragmentsEs.dynamicFaqGrammar.injuredFemale",
        1
      ],
      [
        "\"heridos\"",
        "recommendationFragmentsEs.dynamicFaqGrammar.injuredPlural",
        1
      ]
    ]
  }
};
const spanishCopy={
  "rescueHeadings": {
    "actCalmlyLine": "🚨 ACTÚA CON CALMA\n",
    "doNotLine": "❌ QUÉ NO HACER\n",
    "actionsLine": "✅ QUÉ HACER\n",
    "beforeInterveningLine": "⚠️ ANTES DE INTERVENIR\n",
    "ifNeedsHelpParagraph": "🚨 SI NECESITA AYUDA\n\n",
    "mayNeedHelpLine": "🚨 PUEDE NECESITAR AYUDA SI\n",
    "observedSignsLine": "🚨 SEÑALES OBSERVADAS\n",
    "doNotAfterParagraph": "\n\n❌ QUÉ NO HACER\n",
    "beforeInterveningAfterParagraph": "\n\n⚠️ ANTES DE INTERVENIR\n",
    "observedSignsAfterLine": "\n🚨 SEÑALES OBSERVADAS\n",
    "unknownAnimalParagraph": "❓ NO ESTOY SEGURO\n\n",
    "whatToObserveLine": "🔍 QUÉ OBSERVAR\n",
    "smallBirdParagraph": "🐦 AVE PEQUEÑA\n\n"
  },
  "observedSigns": {
    "bleeding": "• Presenta signos de lesión.",
    "catDog": "• Ha sufrido un ataque de gato o perro.",
    "canNotMove": "• No se mueve con normalidad.",
    "cannotFly": "• No puede volar.",
    "weakness": "• Presenta debilidad o decaimiento.",
    "breathing": "• Presenta respiración agitada.",
    "stranded": "• Está varado o fuera del agua.",
    "fishingLineHook": "• Tiene sedal, anzuelo o aparejos.",
    "moreAnimals": "• Hay más animales afectados.",
    "peopleDogsNearby": "• Hay personas o perros cerca del animal.",
    "restingOnLand": "• Está descansando en tierra.",
    "roadRisk": "• Se encuentra en una zona con tráfico o peligro inmediato.",
    "other": "• Se ha observado otra circunstancia que genera preocupación."
  },
  "rescueInstructions": {
    "minimalHandlingFemaleLine": "• No la manipules más de lo necesario.\n",
    "doNotCollectAutomaticallyLine": "• No la recojas automáticamente por estar en el suelo.\n",
    "doNotTestHealthFemaleParagraph": "• No la manipules para comprobar si está sana.\n\n",
    "returnToSignsParagraph": "• Si observas cualquiera de estas señales, vuelve al paso anterior y marca las opciones correspondientes.\n\n",
    "keepFaceAndBareHandsAwayLine": "• No acerques la cara ni las manos desnudas.\n",
    "doNotTestHealthFemaleLine": "• No la manipules para comprobar si está sana.\n",
    "returnToSignsLine": "• Si observas cualquiera de estas señales, vuelve al paso anterior y marca las opciones correspondientes.\n",
    "minimalHandlingMaleParagraph": "• No lo manipules más de lo necesario.\n\n",
    "quietDarkProtectedBoxLine": "• Mantén la caja en un lugar tranquilo, oscuro y protegido del frío o del calor extremo.\n",
    "minimalHandlingMaleLine": "• No lo manipules más de lo necesario.\n",
    "followSpecialistsParagraph": "• Sigue siempre las indicaciones del personal especializado.\n\n",
    "snakeNoHandlingOrTransferLine": "• No intentes coger, capturar, manipular ni trasladar serpientes, culebras o víboras, aunque creas haber identificado la especie. Si no puedes descartar que sea una serpiente, culebra o víbora, mantén la distancia y no intentes cogerla, capturarla, manipularla, liberarla ni trasladarla.\n",
    "reduceNoisePeopleAndPetsLine": "• Reduce los ruidos y evita la presencia de personas y animales domésticos.\n",
    "keepPeopleAndDogsAway": "• Mantén personas y perros alejados si puedes hacerlo sin riesgo.",
    "swiftOnGroundParagraph": "• Si parece un vencejo, estar en el suelo no es normal: protégelo en una caja de cartón ventilada y consulta cuanto antes.\n\n",
    "swiftNoFoodOrWaterLine": "• No le des comida ni agua sin indicación.\n",
    "doNotTestHealthMaleParagraph": "• No lo manipules para comprobar si está sano.\n\n",
    "swiftCollectWithMinimalHandlingLine": "• Recógelo con cuidado y con la mínima manipulación posible.\n",
    "swiftClosedVentilatedBoxLine": "• Mantenlo en una caja de cartón ventilada y bien cerrada, en un lugar tranquilo y protegido del frío o del calor extremo.\n",
    "swiftContactSpecialists": "• Contacta cuanto antes con un centro especializado, Agentes Forestales o Medioambientales."
  },
  "dynamicFaqGrammar": {
    "injuredPlural": "heridos",
    "injuredFemale": "herida",
    "injuredMale": "herido",
    "strandedPlural": "varados",
    "strandedFemale": "varada",
    "strandedMale": "varado",
    "entangledPlural": "enredados",
    "entangledFemale": "enredada",
    "entangledMale": "enredado",
    "weakPlural": "débiles",
    "weakSingular": "débil"
  },
  "dynamicFaqCopy": {
    "sealResting": "Una foca en tierra puede estar simplemente descansando. Si parece herida, muy débil, enredada o hay alguna situación que te preocupa, utiliza el asistente de SOS Fauna España. Te indicará qué observar y cómo actuar según la situación.",
    "otherMarine": "Si has encontrado un animal marino herido, varado, enredado, débil o en una situación que te preocupa, utiliza el asistente de SOS Fauna España. Te indicará qué observar y cómo actuar según la situación.",
    "marinePrefix": "Si has encontrado ",
    "marineSuffix": " o en una situación que te preocupa, utiliza el asistente de SOS Fauna España. Te indicará qué observar y cómo actuar según la situación.",
    "animalQuestionPrefix": "¿Qué debo hacer si encuentro ",
    "animalQuestionSuffix": "?"
  }
};
function restoreRecommendationCopy(source,file,pure=false){
 const group=groups[file];
 if(!pure){assert.equal(source.split(group.importLine).length,2);source=source.replace(group.importLine,"");}
 for(const [before,after,count]of [...group.edits].sort((a,b)=>b[1].length-a[1].length)){assert.equal(source.split(after).length,count+1,"Unexpected 2AD extraction: "+after);source=source.split(after).join(before);}
 return source;
}
function verifyRecommendationCopy(actual){for(const [area,entries]of Object.entries(spanishCopy))for(const [key,value]of Object.entries(entries))assert.equal(actual[area]?.[key],value,"Spanish recommendation/FAQ fragment changed: "+area+"."+key);}
module.exports={restoreRecommendationCopy,verifyRecommendationCopy};
