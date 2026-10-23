// Reverse only authorised 2AC interface substitutions for historical hashes.
const assert = require("node:assert/strict");
const groups = {
  "app/history.tsx": {
    "importLine": "import { interfacePendingEs } from \"@/i18n/catalogs/interface-pending.es\";\r\n",
    "edits": [
      [
        "\r\n                Borrar todo el historial\r\n              ",
        "{interfacePendingEs.historyUi.clearButton}",
        1
      ],
      [
        "Volver al inicio",
        "{interfacePendingEs.historyUi.home}",
        1
      ],
      [
        "\r\n              Los avisos aparecerán aquí cuando finalices el proceso del\r\n              asistente.\r\n            ",
        "{interfacePendingEs.historyUi.emptyDescription}",
        1
      ],
      [
        "Todavía no hay avisos guardados",
        "{interfacePendingEs.historyUi.emptyTitle}",
        1
      ],
      [
        "Cargando avisos…",
        "{interfacePendingEs.historyUi.loading}",
        1
      ],
      [
        "Volver",
        "{interfacePendingEs.historyUi.back}",
        1
      ],
      [
        "\r\n              Historial de avisos finalizados y guardados en este dispositivo.\r\n            ",
        "{interfacePendingEs.historyUi.description}",
        1
      ],
      [
        "Mis avisos",
        "{interfacePendingEs.historyUi.heading}",
        1
      ],
      [
        "\"Mis avisos\"",
        "interfacePendingEs.historyUi.navigationTitle",
        1
      ],
      [
        "\"Borrar todo\"",
        "interfacePendingEs.historyUi.clearConfirm",
        1
      ],
      [
        "\"Se eliminarán todos los avisos finalizados guardados en este dispositivo.\"",
        "interfacePendingEs.historyUi.clearMessage",
        1
      ],
      [
        "\"Borrar todo el historial\"",
        "interfacePendingEs.historyUi.clearTitle",
        1
      ],
      [
        "\"Eliminar\"",
        "interfacePendingEs.historyUi.deleteConfirm",
        1
      ],
      [
        "\"Este aviso se eliminará del historial de este dispositivo.\"",
        "interfacePendingEs.historyUi.deleteMessage",
        1
      ],
      [
        "\"Eliminar aviso\"",
        "interfacePendingEs.historyUi.deleteTitle",
        1
      ],
      [
        "\"Cancelar\"",
        "interfacePendingEs.historyUi.cancel",
        1
      ],
      [
        "Eliminar aviso",
        "{interfacePendingEs.historyUi.deleteButton}",
        1
      ]
    ]
  },
  "components/sos/SosAssistant.tsx": {
    "importLine": "import { interfacePendingEs } from \"@/i18n/catalogs/interface-pending.es\";\r\n",
    "edits": [
      [
        "\r\n                    Captura la ubicación para ver aquí el punto del hallazgo.\r\n                  ",
        "{interfacePendingEs.assistantCaptureUi.mapEmpty}",
        1
      ],
      [
        "\r\n                      Abrir en Google Maps\r\n                    ",
        "{interfacePendingEs.assistantCaptureUi.mapOpenButton}",
        1
      ],
      [
        "\r\n                      Puedes abrir la ubicación en Google Maps para ver calles,\r\n                      caminos y referencias cercanas.\r\n                    ",
        "{interfacePendingEs.assistantCaptureUi.mapOpenNotice}",
        1
      ],
      [
        "\r\n                      La referencia del lugar puede no ser exacta. Las\r\n                      coordenadas suelen ofrecer una localización más precisa.\r\n                    ",
        "{interfacePendingEs.assistantCaptureUi.mapAccuracyNotice}",
        1
      ],
      [
        "Coordenadas",
        "{interfacePendingEs.assistantCaptureUi.mapCoordinates}",
        1
      ],
      [
        "\r\n                          Referencia del lugar\r\n                        ",
        "{interfacePendingEs.assistantCaptureUi.mapReference}",
        1
      ],
      [
        "\r\n                      📍 Ubicación capturada\r\n                    ",
        "{interfacePendingEs.assistantCaptureUi.mapCapturedTitle}",
        1
      ],
      [
        "Ubicación del hallazgo",
        "{interfacePendingEs.assistantCaptureUi.mapTitle}",
        1
      ],
      [
        "\"📍 Ubicación: No capturada\"",
        "interfacePendingEs.assistantCaptureUi.notCapturedStatus",
        1
      ],
      [
        "\"📍 Ubicación: Capturada ✓\"",
        "interfacePendingEs.assistantCaptureUi.capturedStatus",
        1
      ],
      [
        "\"Capturar ubicación\"",
        "interfacePendingEs.assistantCaptureUi.capture",
        1
      ],
      [
        "\"Capturando ubicación…\"",
        "interfacePendingEs.assistantCaptureUi.capturing",
        1
      ],
      [
        "\"Inténtalo de nuevo en unos segundos.\"",
        "interfacePendingEs.assistantCaptureUi.locationErrorMessage",
        1
      ],
      [
        "\"No se pudo obtener la ubicación\"",
        "interfacePendingEs.assistantCaptureUi.locationErrorTitle",
        1
      ],
      [
        "\"Necesitamos tu ubicación para enviar el aviso.\"",
        "interfacePendingEs.assistantCaptureUi.locationPermissionMessage",
        1
      ],
      [
        "\"Permiso necesario\"",
        "interfacePendingEs.assistantCaptureUi.locationPermissionTitle",
        1
      ],
      [
        "\"el vídeo\"",
        "interfacePendingEs.assistantCaptureUi.videoObject",
        1
      ],
      [
        "\"la foto\"",
        "interfacePendingEs.assistantCaptureUi.photoObject",
        1
      ],
      [
        "} en la galería del dispositivo.`",
        "}${interfacePendingEs.assistantCaptureUi.galleryErrorSuffix}`",
        1
      ],
      [
        "`No se pudo guardar ${",
        "`${interfacePendingEs.assistantCaptureUi.galleryErrorPrefix}${",
        1
      ],
      [
        "\"No se pudo guardar\"",
        "interfacePendingEs.assistantCaptureUi.galleryErrorTitle",
        1
      ],
      [
        "} en la galería.`",
        "}${interfacePendingEs.assistantCaptureUi.galleryPermissionSuffix}`",
        1
      ],
      [
        "`No se ha concedido permiso para guardar ${",
        "`${interfacePendingEs.assistantCaptureUi.galleryPermissionPrefix}${",
        1
      ],
      [
        "\"Permiso recomendado\"",
        "interfacePendingEs.assistantCaptureUi.galleryPermissionTitle",
        1
      ]
    ]
  },
  "components/AppVersionGate.tsx": {
    "importLine": "import { interfacePendingEs } from \"@/i18n/catalogs/interface-pending.es\";\r\n",
    "edits": [
      [
        "Más tarde",
        "{interfacePendingEs.versionGateUi.later}",
        1
      ],
      [
        "Actualizar ahora",
        "{interfacePendingEs.versionGateUi.update}",
        1
      ],
      [
        "\n              Se ha publicado una nueva versión de SOS Fauna España con mejoras\n              y correcciones.\n            ",
        "{interfacePendingEs.versionGateUi.message}",
        1
      ],
      [
        "Nueva versión disponible",
        "{interfacePendingEs.versionGateUi.title}",
        1
      ]
    ]
  },
  "app/+not-found.tsx": {
    "importLine": "import { interfacePendingEs } from \"@/i18n/catalogs/interface-pending.es\";\r\n",
    "edits": [
      [
        "Volver al inicio",
        "{interfacePendingEs.notFoundUi.homeButton}",
        1
      ],
      [
        "\"Volver al inicio\"",
        "{interfacePendingEs.notFoundUi.homeAccessibility}",
        1
      ],
      [
        "\n            Puedes volver a la página principal de SOS Fauna España.\n          ",
        "{interfacePendingEs.notFoundUi.secondary}",
        1
      ],
      [
        "\n            La dirección que has introducido no existe o ya no está disponible.\n          ",
        "{interfacePendingEs.notFoundUi.message}",
        1
      ],
      [
        "Página no encontrada",
        "{interfacePendingEs.notFoundUi.title}",
        1
      ],
      [
        "\"Página no encontrada | SOS Fauna España\"",
        "interfacePendingEs.notFoundUi.navigationTitle",
        1
      ]
    ]
  },
  "app/aviso.tsx": {
    "importLine": "import { interfacePendingEs } from \"@/i18n/catalogs/interface-pending.es\";\r\n",
    "edits": [
      [
        "Volver a SOS Fauna España",
        "{interfacePendingEs.guidePreparationUi.home}",
        1
      ],
      [
        "\n            No se ha podido preparar la guía. Vuelve al inicio e inténtalo de nuevo.\n          ",
        "{interfacePendingEs.guidePreparationUi.error}",
        1
      ],
      [
        "Preparando guía…",
        "{interfacePendingEs.guidePreparationUi.loading}",
        1
      ]
    ]
  }
};
// Frozen Spanish extraction values, never regenerated by checks.
const spanishCopy = {
  "historyUi": {
    "deleteButton": "Eliminar aviso",
    "cancel": "Cancelar",
    "deleteTitle": "Eliminar aviso",
    "deleteMessage": "Este aviso se eliminará del historial de este dispositivo.",
    "deleteConfirm": "Eliminar",
    "clearTitle": "Borrar todo el historial",
    "clearMessage": "Se eliminarán todos los avisos finalizados guardados en este dispositivo.",
    "clearConfirm": "Borrar todo",
    "navigationTitle": "Mis avisos",
    "heading": "Mis avisos",
    "description": "Historial de avisos finalizados y guardados en este dispositivo.",
    "back": "Volver",
    "loading": "Cargando avisos…",
    "emptyTitle": "Todavía no hay avisos guardados",
    "emptyDescription": "Los avisos aparecerán aquí cuando finalices el proceso del asistente.",
    "home": "Volver al inicio",
    "clearButton": "Borrar todo el historial"
  },
  "assistantCaptureUi": {
    "galleryPermissionTitle": "Permiso recomendado",
    "galleryPermissionPrefix": "No se ha concedido permiso para guardar ",
    "galleryPermissionSuffix": " en la galería.",
    "galleryErrorTitle": "No se pudo guardar",
    "galleryErrorPrefix": "No se pudo guardar ",
    "galleryErrorSuffix": " en la galería del dispositivo.",
    "photoObject": "la foto",
    "videoObject": "el vídeo",
    "locationPermissionTitle": "Permiso necesario",
    "locationPermissionMessage": "Necesitamos tu ubicación para enviar el aviso.",
    "locationErrorTitle": "No se pudo obtener la ubicación",
    "locationErrorMessage": "Inténtalo de nuevo en unos segundos.",
    "capturing": "Capturando ubicación…",
    "capture": "Capturar ubicación",
    "capturedStatus": "📍 Ubicación: Capturada ✓",
    "notCapturedStatus": "📍 Ubicación: No capturada",
    "mapTitle": "Ubicación del hallazgo",
    "mapCapturedTitle": "📍 Ubicación capturada",
    "mapReference": "Referencia del lugar",
    "mapCoordinates": "Coordenadas",
    "mapAccuracyNotice": "La referencia del lugar puede no ser exacta. Las coordenadas suelen ofrecer una localización más precisa.",
    "mapOpenNotice": "Puedes abrir la ubicación en Google Maps para ver calles, caminos y referencias cercanas.",
    "mapOpenButton": "Abrir en Google Maps",
    "mapEmpty": "Captura la ubicación para ver aquí el punto del hallazgo."
  },
  "versionGateUi": {
    "title": "Nueva versión disponible",
    "message": "Se ha publicado una nueva versión de SOS Fauna España con mejoras y correcciones.",
    "update": "Actualizar ahora",
    "later": "Más tarde"
  },
  "notFoundUi": {
    "navigationTitle": "Página no encontrada | SOS Fauna España",
    "title": "Página no encontrada",
    "message": "La dirección que has introducido no existe o ya no está disponible.",
    "secondary": "Puedes volver a la página principal de SOS Fauna España.",
    "homeAccessibility": "Volver al inicio",
    "homeButton": "Volver al inicio"
  },
  "guidePreparationUi": {
    "loading": "Preparando guía…",
    "error": "No se ha podido preparar la guía. Vuelve al inicio e inténtalo de nuevo.",
    "home": "Volver a SOS Fauna España"
  }
};
function restoreInterfaceCopy(source, file) {
  const group=groups[file];
  assert.equal(source.split(group.importLine).length,2);
  source=source.replace(group.importLine, "");
  for(const [before,after,count] of [...group.edits].sort((a,b)=>b[1].length-a[1].length)){
    assert.equal(source.split(after).length,count+1,"Unexpected 2AC interface change: "+after);
    source=source.split(after).join(before);
  }
  return source;
}
function verifyInterfaceCopy(actual) {
  for(const [area,entries] of Object.entries(spanishCopy)) for(const [key,value] of Object.entries(entries)) assert.equal(actual[area]?.[key],value,"Spanish interface value changed: "+area+"."+key);
}
module.exports={restoreInterfaceCopy,verifyInterfaceCopy};
