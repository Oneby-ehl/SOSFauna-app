// Spanish interface copy only. Preserve storage, permission flows and interpolation.
export const interfacePendingEs = {
  "historyUi": {
    "deleteButton": "Eliminar aviso",
    "cancel": "Cancelar",
    "deleteTitle": "Eliminar aviso",
    "deleteMessage": "Este aviso se eliminará del historial de este dispositivo.",
    "deleteConfirm": "Eliminar",
    "clearTitle": "¿Eliminar todo el historial?",
    "clearMessage": "Se eliminarán definitivamente todos los avisos finalizados guardados en este dispositivo",
    "clearConfirm": "Eliminar historial",
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
} as const;
