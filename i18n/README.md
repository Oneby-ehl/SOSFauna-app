# Internacionalización de SOS Fauna España

**Estado actual:** publicación web bilingüe preparada localmente, con rutas españolas
e inglesas, selector y detección activados para web. Android conserva español.
El artefacto publicable es `dist-public`; `dist` también puede contener una vista
previa y no debe subirse directamente. La sección final «Lanzamiento bilingüe»
describe la configuración vigente. Las secciones anteriores conservan el registro
de fases y sus restricciones históricas, ya superadas cuando así se indica.

## Registro de las fases 1–2D

El proveedor está integrado alrededor de `AppVersionGate` y la navegación raíz.
El idioma efectivo sigue siendo español mientras `englishPublished` esté desactivado,
también en URL inglesas inexistentes. No añade elementos al DOM ni cambia pantallas.
No crea rutas Expo, redirecciones, efectos sobre almacenamiento ni cambios de SEO.
La marca sigue siendo SOS Fauna España. La fase 2B extrae únicamente contenido español
existente de portada/navegación/pie y mensajes para compartir la aplicación.
La fase 2C añade las cinco páginas informativas, conservando íntegros sus metadatos.
La fase 2D extrae la interfaz del directorio público y su ayuda compartida, sin cambiar
los registros de contacto ni su estructura.

## Contratos

- `Locale` solo admite `es` y `en`. Las variantes del navegador se normalizan a esos
  identificadores. El inglés futuro usará ortografía británica y vocabulario internacional.
- `catalogs/es.ts` define áreas y claves. `Catalog` conserva esas claves tipadas;
  `TranslationCatalog` admite traducciones parciales con respaldo explícito en español.
  `catalogs/en.ts` usa `satisfies TranslationCatalog`: 2B no incorpora ninguna traducción.
  Antes de publicar inglés habrá que comprobar cobertura completa para evitar omisiones
  ocultas por el respaldo. No se han duplicado contenidos españoles en el catálogo inglés.
- `translate(locale, area, key)` y `createTranslator(locale)` tienen claves tipadas.
  Ejemplo: `createTranslator("es")("language", "selectorLabel")`.
- `I18nProvider` solo habilitará la resolución por ruta cuando se publique el inglés.
  No lee preferencias ni navegador durante renderizado. En Android/iOS siempre usa español.
  Está montado en `app/_layout.tsx`; `useI18n` expone `locale` y `t` a los componentes,
  con español como valor predeterminado. Portada y pie consumen el contexto desde 2B;
  las cinco páginas informativas lo consumen desde 2C.
- `getLocalizedPath` es una consulta del registro, incluso para rutas no publicadas.
  Para preparar navegación usar `getAvailableLocalizedUrl`, que bloquea inglés sin publicar,
  conserva query y fragmento y devuelve `null` para rutas desconocidas o externas.
  Que una ruta conste en el registro no significa que exista una página accesible.

## Activación futura, explícita

Las tres opciones de `config.ts` están desactivadas. No basta con cambiar las opciones:
habrá que crear páginas completas, conectar controlador/selector y verificar
HTML estático, SEO, alojamiento y precaché en una fase posterior.

`resolveInitialNavigation` solo calcula una decisión; nunca navega. Incluso con todas
las opciones activadas, por defecto respeta la URL. Solo propone `/en/` para una visita
a `/` marcada expresamente `initial-home`, primero según elección manual guardada y
después según la primera lengua compatible del navegador. Las rutas inglesas siempre
mandan sobre preferencias; enlaces españoles deliberados, recargas, navegación interna,
queries y fragmentos no deben marcarse como una entrada inicial elegible.

El navegador no permite distinguir por sí solo una URL `/` escrita deliberadamente de
una primera visita genérica a `/`. El futuro controlador deberá definir esa política:
usar una marca de sesión para limitar detección a una entrada elegible, persistir toda
elección manual y tratar los enlaces internos/selector como explícitos. No activar un
efecto que redirija cada vez que se renderice la portada. Una decisión sin destino
disponible conserva siempre la ruta actual, también sin conexión.

La preferencia usa una clave nueva y almacenamiento inyectado. Los adaptadores capturan
errores de lectura/escritura; no acceden a `window`, avisos ni historial al importar.
La futura integración web debe obtener almacenamiento y lenguas del navegador después
de hidratar, tolerando también que obtener `window.localStorage` lance una excepción.
No necesita servicios externos ni redirecciones del servidor de GitHub Pages.

El selector no está montado y devuelve `null` con las opciones actuales y en nativo.
Tiene botones con nombre accesible, selección y estado deshabilitado. El futuro padre
deberá guardar la elección manual y realizar navegación explícita. El selector se oculta
en el asistente incluso si se activan las opciones: cambiar idioma allí requiere resolver
antes progreso, protección de salida y referencias temporales a fotos/vídeos.

No se ha cambiado `lang`, canonical, sitemap, manifest, service worker, procesos de
publicación ni configuración Expo. No se publican páginas inglesas incompletas.

## Comprobaciones locales

Sin exportar la aplicación ni generar versiones:

```text
node tests/i18n-infrastructure.cjs
node tests/i18n-provider.cjs
node tests/i18n-web.cjs
node tests/faq-regression.cjs
node node_modules/typescript/bin/tsc --noEmit --incremental false
node node_modules/eslint/bin/eslint.js app/_layout.tsx i18n components/i18n tests/i18n-infrastructure.cjs tests/i18n-provider.cjs tests/i18n-web.cjs
```

El primer comando verifica contratos de rutas y selección en memoria, con escenarios
de publicación futura inyectados, sin cambiar las opciones reales. El segundo renderiza
con React el layout/proveedor reales y consumidores de contexto dentro de navegación y
del control de versión. Verifica español y ausencia de DOM adicional, con las API de
router y plataforma simuladas para web/Android/iOS; no es una prueba en dispositivo.
La regresión FAQ existente conserva sus referencias originales.

`i18n-web.cjs` necesita una exportación web actual en `dist`, sitemap y service worker
generados con las herramientas existentes del proyecto, y Playwright/Chrome o Edge ya
disponibles (ver `tests/README.md` y `SOS_FAUNA_PLAYWRIGHT`). Usa almacenamiento aislado
y bloquea peticiones externas. Verifica navegación, recuperación, historial, cancelación
y confirmación de nuevo aviso, ausencia del selector y uso sin conexión con navegador
español/inglés y preferencia inglesa guardada. No utiliza datos reales.

En la verificación de fase 1, la regresión FAQ existente se detiene por diferencias
previas con los hashes de su referencia en `app/aviso.tsx`, `data/faq.ts` y
`components/sos/SosAssistant.tsx`. Ningún archivo existente ha cambiado en esta fase;
no se han regenerado referencias ni alterado esa prueba para hacerla pasar.

## Verificación de la integración 2A

- TypeScript, ESLint de los archivos afectados y ambas comprobaciones de infraestructura/
  proveedor: correctos. El contexto cubre tanto `AppVersionGate` como la navegación.
- Exportación web local offline anterior y posterior a integrar: los 18 HTML son idénticos
  normalizando únicamente el nombre con hash del bundle JavaScript. Sin cambios en textos,
  estilos, metadatos, enlaces ni conjunto de rutas. No hay páginas `/en/` exportadas.
- Comparación con el estado al inicio de 2A: mismos hashes de fuentes protegidas, catálogo,
  FAQ y todos los escenarios de la comprobación FAQ. No se han cambiado fixtures oficiales.
- `i18n-web.cjs`: correcto en Chrome para `es-ES` y `en-GB`, incluso con preferencia `en`.
  Recuperación del aviso de prueba de murciélago, historial y confirmaciones correctos;
  navegación por ambas FAQ temáticas y carga offline correctas, sin errores de hidratación.
- La verificación Android es de contexto React con `Platform.OS = "android"` simulado,
  además de comprobación TypeScript; no se ha hecho build Android ni prueba en dispositivo.

Los artefactos de comparación locales están en `.expo/i18n-2a/` (ignorados por Git).
No son sustitutos de las referencias oficiales ni se usan para justificar sus cambios.

### Diferencias previas de las referencias

El commit ya existente `a18d2f6` contiene cambios de preparación de guía y advertencias
sobre serpientes. Los tres archivos siguientes siguen coincidiendo con HEAD al normalizar
finales de línea; 2A no los ha modificado. La regresión histórica no queda validada solo
por encontrar ese commit: se conserva pendiente la revisión de sus referencias.

| Archivo | Hash esperado (prefijo) | Hash actual (prefijo) | Diferencia identificada en el historial |
| --- | --- | --- | --- |
| `app/aviso.tsx` | `c739f1c1431e` | `3bac0e873482` | Preparación estable entre exportación/hidratación, errores y recuperación ligados a parámetros |
| `components/sos/SosAssistant.tsx` | `6917da4ca5bd` | `acb505638635` | Advertencias de no manipular serpientes en recomendaciones generales, atrapamiento y crías de reptiles |
| `data/faq.ts` | `2e4252e00156` | `62fd79dc8c4f` | Ocho respuestas incorporan exclusiones de serpientes en indicaciones de manipulación y traslado |

Las ocho FAQ afectadas son `alejar-cria-padres`, `animal-herido`, `animal-atrapado`,
`debo-tocarlo`, `como-transportarlo`, `caja-o-jaula`, `tamano-caja` y `reducir-estres`.
La comparación de escenarios con la referencia histórica también detecta diferencias
previas en `ave que no vuela`, `murciélago no vuela` y `tortuga`; no es solo una cuestión
de hashes. El hash de lógica de FAQ incluye textos del bloque JSX auxiliar modificado
en el commit citado. El catálogo de animales coincide con la referencia histórica.

Las pruebas de navegador existentes se han ejecutado sin modificarlas:

- `rescue-flows.cjs` se detiene buscando el enlace `Ir al inicio y abrir el asistente`,
  ausente en la interfaz actual; también espera la antigua etiqueta `Comenzar nuevo aviso`.
  La etiqueta actual es `Guía de ayuda asistida`.
- `faq-seo.cjs` comprueba correctamente las 54 respuestas estáticas de vencejos,
  hidratación, metadatos, teclado y once búsquedas, pero se detiene en la comprobación
  de enlaces de la línea 82. No se considera pasada la suite completa.

Esas expectativas no se han relajado ni las referencias regenerado. La nueva comprobación
de integración usa los controles actuales y verifica el alcance de esta fase por separado.

## Extracción de portada 2B

Se trasladan literalmente los textos visibles de `LandingPage` a las áreas `home`,
`navigation` y `common`: cabecera, instrucciones de móvil/escritorio, aviso pendiente,
confirmación, historial, presentación de animales, instalación, enlaces y accesibilidad
de Google Play. `versionFooter` contiene la etiqueta visible de versión y copyright.
`appSharing` contiene el mensaje promocional y avisos de copia; la API para compartir
conserva sus firmas y callbacks y usa explícitamente español en esta etapa. Su otro
consumidor, la pantalla de información, recibe exactamente las mismas cadenas.

Se conservan los espacios de ` · Versión `, el salto de línea entre gratuidad y ámbito
español y los dos saltos de línea de la confirmación. Los saltos de línea del código JSX
que solo separaban palabras se extraen como los espacios que ya renderizaba React.

Se dejan deliberadamente intactos:

- Metadatos de `SeoHead`, título de `Stack.Screen` y JSON-LD, excluidos de esta fase.
- Rutas, parámetros, claves de almacenamiento, estados (`checking`, `ready`, `failed`),
  valores de eventos y demás identificadores de lógica.
- URLs de Google Play y de compartir, ruta del distintivo español y símbolos decorativos.
- `getAppVersion()` y su valor `desconocida`, porque también se usa para comparar versiones
  en `AppVersionGate`; los nombres de plataforma se conservan igualmente.
- El error técnico `Landing data check timed out.` y el diagnóstico de consola al fallar
  el diálogo nativo de compartir, que no son mensajes mostrados al usuario.
- El diálogo global de actualización de `AppVersionGate`, que no es un componente directo
  de portada, y toda la construcción del resumen de rescate en `rescueShareMessage.ts`.

No se han cambiado condiciones, estilos, handlers, navegación ni SEO. Android no recibe
ninguna implementación específica; los componentes compartidos siguen usando español.

### Comparación antes/después

`tests/i18n-home.cjs` captura una referencia local antes de extraer (`--capture`, que
rechaza sobrescribirla) y la compara después sin modificar fixtures históricos. Requiere
Chrome/Edge y Playwright disponibles como las demás comprobaciones de navegador.

```text
node tests/i18n-home.cjs --capture
node tests/i18n-home.cjs
```

La referencia se guarda solo en `.expo/i18n-2b/home-before.json`. Incluye hashes de los
18 HTML exportados (normalizando solo el nombre del bundle JavaScript), fuentes excluidas,
DOM exacto y hashes de capturas a 390 y 1280 px, con/sin aviso pendiente y con instalación
disponible. Compara el mensaje compartido, copia al portapapeles y confirmación, y comprueba
inicio/recuperación del asistente. No se incorporan imágenes ni exportaciones a Git.

El hash histórico de `LandingPage` cambia por la extracción autorizada. No se actualizan
sus referencias: la comparación específica de 2B comprueba el resultado renderizado.

Resultados de 2B: TypeScript y ESLint correctos; infraestructura/proveedor correctos;
comparación de los 18 HTML, ocho estados visuales/DOM de portada y mensajes de interacción
sin diferencias. `i18n-web.cjs` también pasa navegación, recuperación, historial,
confirmaciones y uso offline. `faq-regression.cjs` sigue deteniéndose en los mismos tres
hashes históricos documentados arriba; no se han actualizado sus referencias.

## Extracción de páginas informativas 2C

`catalogs/information.es.ts` contiene las áreas `about`, `sources`, `contact`, `privacy`
y `legal`, incorporadas al catálogo español por `catalogs/es.ts`. Los componentes usan
claves tipadas mediante `useI18n`; no se añade contenido inglés. Las etiquetas de marca,
fecha de actualización y retorno se comparten en `common` y `navigation`.

Se extraen títulos visibles, párrafos, listas, notas, nombres/descripciones/etiquetas de
fuentes y acciones. El orden de listas, apartados y fuentes sigue definido en cada página;
las claves internas de React usan identificadores estables de presentación, independientes
de los textos traducidos. Las claves de párrafo y fuente no deben renumerarse al insertar
contenido futuro. No representan decisiones del asistente ni identificadores de dominio.

Se conservan literalmente espacios significativos: `Visitar ` mantiene su espacio final
antes de la etiqueta del recurso, y los textos de listas de contacto mantienen el espacio
inicial tras la viñeta. Los fragmentos JSX y los nodos de texto conservan su estructura.

Permanecen intactos los títulos de `Stack.Screen`, `SeoHead`, JSON-LD y demás metadatos;
también las rutas, URLs, direcciones de correo y el comportamiento de `ExternalLink`.
Las direcciones de correo visibles se conservan como identificadores, sin traducción.
No se cambian roles ni atributos de accesibilidad existentes. No se ha tocado portada,
su botón de cabecera, protocolos, FAQ, centros, historial, almacenamiento ni código Android.

`tests/i18n-information.cjs --capture` registra el estado anterior únicamente en
`.expo/i18n-2c/information-before.json`, rechazando sobrescribirlo. Tras exportar la web
y generar el sitemap con el script existente, `node tests/i18n-information.cjs` compara
los 18 HTML (normalizando solo el nombre del bundle), sitemap, fuentes excluidas y diez
estados de las cinco páginas a 390/1280 px: DOM, contenido, capturas, enlaces, atributos
de accesibilidad y foco con teclado. También comprueba el retorno al inicio y errores
de hidratación, con navegador inglés y preferencia `en` para confirmar que sigue español.
Usa el navegador y las dependencias locales ya disponibles; no descarga ni publica nada.

Las referencias históricas no se actualizan. La equivalencia con el estado al inicio
de 2C se verifica por separado y no implica validar los cambios históricos pendientes.

Resultados de 2C: TypeScript, ESLint y comprobaciones de infraestructura/proveedor correctos.
Los 18 HTML y el sitemap coinciden con el estado anterior; en las cinco páginas coinciden
exactamente DOM, capturas, enlaces, accesibilidad y foco a 390 y 1280 px. Retorno al inicio
sin errores de hidratación. También pasa `i18n-home.cjs`, incluida la cabecera inalterada,
instalación, compartir, confirmaciones e inicio/recuperación del asistente. Las fuentes
excluidas permanecen idénticas y todos los temporales están ignorados por Git en `.expo/`.

## Extracción del directorio de centros 2D

`catalogs/centers.es.ts` añade el área tipada `centers` con 41 cadenas españolas de
interfaz. `PublicRecoveryCenters.web.tsx` y `RecoveryCentersPage.tsx` consumen el proveedor.
Se extraen encabezados, introducciones, instrucciones, selección y búsqueda de provincias,
mensajes de ausencia de resultados, limpieza, mostrar/ocultar, retorno, tipos de recurso,
etiquetas nacionales de presentación, texto sin JavaScript y etiquetas de accesibilidad.
Se reutilizan las claves existentes para marca, título público y retorno al inicio.

Se preservan los espacios en los fragmentos con enlaces y cantidades. La composición
`contacto(s) telefónico(s)` mantiene sus condiciones numéricas y la estructura de nodos;
solo sus fragmentos léxicos pasan al catálogo. La adaptación gramatical a inglés se hará
en una fase autorizada posterior. Los callbacks puros de etiquetas nacionales/marinas
usan explícitamente español y conservan sus firmas; no hay activación inglesa.

Permanecen sin extraer y sin modificar:

- Nombres oficiales, provincias, teléfonos, direcciones, correos, enlaces y notas de cada
  registro, definidos en `helpContacts.ts`, `marineHelpContacts.ts` y `provinceContacts.ts`.
  Algunas notas incluyen teléfonos alternativos y otros datos de contacto; separarlos de
  su redacción requerirá una revisión futura. No se altera la estructura de esos módulos.
- `HELP_CONTACTS_LEGAL_NOTICE`: aviso compuesto con nombres de organismos, URLs de fuentes
  y declaración de independencia, compartido desde el módulo de datos. Se conserva su
  única fuente original; una futura localización deberá separar redacción y referencias.
- Los valores utilizados como identidad o decisión: `province`, `selectedProvince`,
  claves React basadas en datos, códigos `MarineHelpResourceType`, teléfonos como `112`,
  IDs HTML y clases. La igualdad de provincia, los mapas y el orden usan los datos
  originales; nunca las etiquetas traducidas. Normalización NFD, eliminación de acentos,
  minúsculas, búsqueda, recuentos y generación de `tel:` no cambian.
- Metadatos de `app/centros.tsx`, rutas, estilos, `<details>/<summary>` y callbacks.

### Comprobación específica

`tests/i18n-centers.cjs --capture` registra una referencia anterior a extraer en
`.expo/i18n-2d/centers-before.json` y rechaza sobrescribirla. Sin `--capture`, compara:

- Los 18 HTML completos (salvo el nombre con hash del bundle) y el sitemap.
- Hashes de todos los datos de contacto y fuentes excluidas, y código exacto de las
  funciones de agrupación, normalización, recuento y llamada.
- Las 50 agrupaciones, 129 registros provinciales y cuatro contactos nacionales,
  con sus nombres, notas, etiquetas, teléfonos y enlaces antes/después de hidratar.
- DOM y capturas a 320, 390, 768 y 1280 px, 13 consultas por ancho, tolerancia a acentos,
  limpieza y foco, mensajes, ausencia de desbordamiento y acordeones múltiples.
- Acordeones nativos sin JavaScript, teclado Enter/Espacio y etiquetas Ver/Ocultar.
- Ayuda compartida dentro de una guía recuperada: pantalla nacional, aviso legal,
  filtro Madrid, contactos, retorno y conservación del identificador del aviso de prueba.

La suite histórica `centros-seo.cjs`, ejecutada antes de tocar fuentes en 2D, ya se detenía
en el hash de `public/version.json`: esperaba `7861c0ee15c6`, mientras el archivo actual
da `fb61411ba57b`. El historial muestra el cambio de `buildTime` en el commit previo
`a18d2f6` (de agosto a octubre de 2026). No se modifica ese archivo ni su referencia.
La extracción autorizada también cambia el texto fuente de `RecoveryCentersContent`,
que esa suite compara literalmente. Su referencia se mantiene sin regenerar; la nueva
comprobación verifica de forma independiente la equivalencia de datos y comportamiento.

Resultados de 2D: TypeScript, ESLint e infraestructura/proveedor correctos. La nueva
comprobación pasa: 18 HTML y sitemap idénticos; datos y funciones protegidos intactos;
50 agrupaciones, 129 contactos provinciales y cuatro nacionales; DOM/capturas idénticos
en cuatro anchos, 13 consultas por ancho, limpieza/foco, acordeones sin JavaScript,
teclado, teléfonos y ayuda compartida de la guía sin diferencias. No se generan rutas
inglesas ni se cambia la configuración de publicación. Todos los temporales permanecen
en `.expo/`, ignorados por Git.

## Extracción de FAQ 2E

`catalogs/faq.es.ts` centraliza las 92 preguntas y respuestas españolas (32 generales,
54 de vencejos y seis de murciélagos), con 184 claves basadas en sus IDs existentes.
Añade seis textos temáticos (encabezados, introducciones y etiquetas del buscador) y
19 textos de interfaz: búsqueda, limpieza, mensajes, ayudas, navegación y accesibilidad.
Marca y acciones comunes reutilizan las claves existentes. No hay traducciones inglesas.

`data/faq.ts` conserva su estructura y sus identificadores, categorías, palabras clave,
orden y opciones de acciones. Solo obtiene preguntas y respuestas del catálogo español
canónico, sin duplicarlas. `data/faqTopics.ts` obtiene los seis textos del mismo catálogo.
Se mantienen los datos españoles para buscar, renderizar y generar JSON-LD; el proveedor
tipado se usa en la interfaz de `FaqPage`, `TopicFaqPage` y `TopicFaqHeader`.

Acoplamientos pendientes que se conservan deliberadamente:

- Las categorías españolas son valores internos del tipo `FaqCategory` y participan en
  agrupación, orden y navegación; se siguen mostrando directamente. Las palabras clave,
  normalización, reconocimiento de intenciones y expresiones españolas de búsqueda no
  se traducen ni se cambian. Los filtros temáticos siguen dependiendo de los IDs.
- La pregunta introductoria dinámica compone `displayNameWithArticle`. Sus respuestas
  incluyen concordancia gramatical española, excepciones marinas/vencejos y consejos
  derivados de `getAdvice` del asistente. Se conservan todos esos helpers y su literal
  `COMMON_END`, utilizado para retirar un párrafo por coincidencia exacta. Localizarlos
  exige separar antes texto, gramática y decisiones, con autorización posterior.
- Los nombres del catálogo de animales, identificadores, rutas y valores usados como
  decisiones se mantienen. Los títulos SEO, descripciones y código de datos estructurados
  quedan intactos. Los acordeones nativos y sus estilos no se modifican.

`tests/i18n-faq.cjs --capture` registra una sola vez el estado real anterior en
`.expo/i18n-2e/faq-before.json`, sin sobrescribirlo. La comparación posterior comprueba
las 92 fichas completas, configuración temática, 49 escenarios reales del buscador y sus
resultados/orden/respuestas en navegador, 22 búsquedas temáticas, los 18 HTML completos
(normalizando únicamente el nombre con hash del bundle) y el sitemap. Incluye DOM y
capturas a 390/1280 px, teclado, foco al limpiar, enlaces, acordeones sin JavaScript y
entrada a la guía. Protege por hash fuentes excluidas y por texto exacto helpers y acciones.
Los datos procedentes del entorno VM se comparan como JSON, igual que la captura original.

El harness de `faq-regression.cjs` solo añade el contexto de traducción para cargar la
interfaz y expone los temas para comprobarlos; sus aserciones y referencias históricas
no se actualizan. La diferencia autorizada de fuente en `data/faq.ts` y del hash del
componente no sustituye la revisión pendiente de las ocho respuestas y tres escenarios
históricos ya documentados en 2A. La nueva referencia local verifica exclusivamente
equivalencia respecto al inicio de 2E. Los temporales permanecen ignorados en `.expo/`.

Resultados de 2E: TypeScript, ESLint de archivos modificados e infraestructura/proveedor
correctos. La comparación específica pasa: 92 fichas idénticas, 49 escenarios generales
y 22 búsquedas temáticas con el mismo contenido y orden; 18 HTML y sitemap idénticos;
DOM/capturas a 390/1280 px, acordeones nativos, teclado, foco, enlaces y acceso a la guía
sin diferencias. Fuentes excluidas y helpers/acciones protegidos intactos. Inglés,
selector y redirecciones siguen desactivados. No se ejecuta build Android ni despliegue.

## Interfaz del asistente y caracterización de protocolos 2G

Antes de tocar `SosAssistant.tsx` se ejecutó `node tests/i18n-assistant.cjs --capture`.
La referencia nueva e independiente `tests/fixtures/protocols-before-i18n-2g.json`
conserva 28.394 entradas y 907 salidas distintas, completas y exactas, sin normalizar
espacios, saltos de línea, emojis ni advertencias. Las salidas repetidas se almacenan
una sola vez y cada entrada referencia su índice. No reemplaza referencias históricas.
La captura exige que el archivo no exista y lo crea con `wx`; la ejecución normal solo
lee la referencia, nunca la regenera ni la actualiza.
Su SHA-256 original también está fijado en el comprobador para detectar alteraciones.

Cobertura: los 13 tipos, vivo/muerto, los 17 flags individualmente y 34 perfiles en total,
incluyendo atrapamiento/cría simultáneos, lesiones, imposibilidad de volar, peligro,
seguimiento, apariencia normal y combinaciones contradictorias/heredadas. Para los seis
tipos marinos se cruzan todos los 11 valores de posición (incluido null) con los 12 de
entorno (incluido null), todos los perfiles vivos y muertos con todos los flags. No se
afirma enumerar las 2^17 combinaciones de flags; las condiciones y generadores completos
se protegen adicionalmente por igualdad exacta de fuente.

`catalogs/assistant.es.ts` añade 71 claves tipadas en `assistantUi`, usadas en 74 lugares:
títulos de los cuatro pasos, introducciones, preguntas de interfaz (no opciones),
botones, controles/estados de lectura, placeholders, información sobre los adjuntos,
confirmaciones de salida/finalización, permisos de cámara, avisos de incompatibilidad,
número inválido, errores de apertura de WhatsApp y confirmación de copia. Los mensajes
que mencionan «No vuela» son avisos de presentación; la decisión sigue usando el flag
`cannotFly` y las mismas condiciones. No se añade ninguna traducción inglesa.

Quedan deliberadamente sin extraer:

- Todos los generadores, `getAdvice`, sus prioridades, `COMMON_END`, suplementos,
  señales de las recomendaciones y deduplicación marina.
- Opciones, etiquetas de datos y títulos usados como claves; no se altera el cálculo
  de anchura basado en longitud ni los flags heredados.
- Captura/geocodificación de ubicación, sus permisos/errores, controles/estados/mapas,
  coordenadas, prefijos y centinela histórico.
- `renderSummaryPreview`, las instrucciones específicas del resumen y el mensaje
  compartido. Los botones de su barra y la confirmación de copia solo cambian su
  procedencia textual, no el contenido copiado/enviado.
- Mensajes de `saveToGallery` que interpolan «la foto»/«el vídeo», conservando el bloque
  multimedia. En cámara únicamente se sustituyen textos de permiso denegado; llamadas,
  opciones, referencias a archivos y persistencia permanecen idénticas.
- El título de `Stack.Screen`, para mantener intacta la configuración de cabecera.

Comprobación de alcance: `node tests/i18n-assistant.cjs` ejecuta las funciones originales
transpiladas en memoria. Compara los 28.394 resultados, el código exacto de los generadores
y el programa completo compilado tras revertir únicamente import/hook y traducciones
de interfaz en memoria. Conserva el formato de emisión de literales de TypeScript para
comparar con el hash capturado originalmente; no se modifica ese hash. También protege
archivos de almacenamiento, historial, FAQ, mensajes compartidos, rutas y configuración.

La referencia contiene 16 árboles de interfaz/estilos y trazas de callbacks anteriores
en web/Android simulados: cuatro pasos, lectura/parada, permisos denegados, confirmación
sin adjuntos, retorno, copia, número inválido, envío y finalización/cancelación. Se añaden
aserciones focalizadas de salida cancelada/confirmada y fallo de los tres enlaces nativos
de WhatsApp. Se ejecuta el código real con estado/JSX y APIs de plataforma simulados;
no es una prueba visual de navegador, dispositivo Android ni de permisos del sistema.

Resultados: TypeScript y la comprobación específica correctos, con recomendaciones,
árboles de interfaz, trazas y fuentes protegidas idénticos. No se ejecutan ESLint, builds,
otras suites, Android ni despliegues. Las referencias históricas permanecen intactas;
inglés, selector y redirecciones siguen desactivados. Los auxiliares de extracción y
diagnóstico quedan solo en `.expo/`, ignorados por Git.

## Opciones seguras del asistente 2H

Inventario revisado: 13 tipos de animal y sus dos grupos, dos estados (vivo/muerto),
17 flags generales y sus variantes por especie, lugar heredado (`animalPlace`), posición
y entorno. Atrapamiento y desarrollo biológico no son campos adicionales: se expresan
mediante `trapped` y `baby`, con etiquetas como «Atrapado», «Enredado», «Enredada» y
«Es cría». También existen flags heredados sin control visible para algunas especies.

Se extrae únicamente la parte separable de la composición de resúmenes: las etiquetas
de `VISIBLE_POSITION_OPTIONS_BY_ANIMAL_TYPE` y `VISIBLE_ENVIRONMENT_OPTIONS_BY_ANIMAL_TYPE`.
`catalogs/assistant-options.es.ts` define 25 claves tipadas (12 de posición y 13 de entorno),
utilizadas en 139 etiquetas. Se mantienen variantes como «En rocas / espigón» frente a
«En rocas / piedras / espigón», «En la orilla / agua somera» frente a «En playa / orilla»,
y los entornos marinos con/sin preposición. Los valores internos siguen siendo los
códigos originales; las claves del catálogo solo resuelven presentación.

Las tablas importan explícitamente el catálogo español, como los datos FAQ de 2E, sin
activar traducción dinámica ni cambiar identidad de opciones durante un aviso. Las
áreas se incorporan al catálogo general para su futura localización. No se añade inglés.
No cambia ningún código, orden, condición, callback, campo guardado ni función del componente.

Por las precauciones de esta fase quedan deliberadamente sin extraer:

- Tipos de animal y estados: sus etiquetas pasan a `generatedSummary` y al mensaje
  compartido, donde se aplica composición gramatical/minúsculas españolas. Se conserva
  esa fuente para abordar conjuntamente presentación y resumen en una fase autorizada.
- Flags/señales, atrapamiento y cría: `selectedFlagLabels` conserva variantes visibles
  y heredadas, ordena ambas listas, compone el resumen y se usa como `key={label}`.
  No se cambia esa identidad textual ni se introduce otra clave en esta fase.
- Títulos de grupos: se utilizan como `key={group.title}`.
- Tablas generales de lugar/posición/entorno que resuelven etiquetas para el resumen,
  incluyendo `ANIMAL_PLACE_OPTIONS` para avisos antiguos. Son distintas de las tablas
  visibles extraídas; no se unifican aunque algunas cadenas coincidan.
- «No indicado», etiquetas de la vista previa, sentinelas, direcciones, mapas y toda
  la lógica de recomendaciones, suplementos y deduplicación.

Antes de extraer se capturó `tests/i18n-assistant-options.cjs --capture` en
`.expo/i18n-2h/options-before.json` (ignorado; rechaza sobrescribir). Sin `--capture`,
la comprobación compara las 13 tablas completas, sus códigos, orden y texto exacto,
y la fuente exacta de `HomeScreen`, que no se modifica en 2H. Recorre todos los controles
visibles de posición/entorno para los 13 animales con estado y APIs web/Android simulados;
comprueba el código guardado, estilos/árboles de interfaz y flags heredados invisibles.
Incluye recuperación de pasos antiguos, `animalPlace`, posición/entorno restaurados y
resúmenes copiados sin cambios. No es una prueba en navegador ni dispositivo Android.

El comprobador de 2G admite únicamente las nuevas lecturas de etiquetas y las revierte
a sus literales españoles en memoria; conserva el hash original del programa y la
referencia `protocols-before-i18n-2g.json` con su SHA-256 fijo. No se recaptura esa referencia
ni se cambia ninguna referencia histórica. Se comparte su harness sin ejecutar otra suite
al importarlo.

Resultados: TypeScript, `node tests/i18n-assistant.cjs` y
`node tests/i18n-assistant-options.cjs` correctos. Los 28.394 casos producen exactamente
las recomendaciones originales; las 13 tablas, selecciones y casos heredados coinciden.
Inglés, selector y redirecciones siguen desactivados. No se ejecutan ESLint, builds,
despliegues ni pruebas ajenas al alcance.

## Textos exclusivos de ave pequeña 2I

`catalogs/small-bird.es.ts` incorpora el área tipada `smallBirdAdvice` con 26 literales
españoles exclusivos de `getSmallBirdAdvice`. Se importa el catálogo español puro,
sin hooks, idioma dinámico ni nuevas dependencias. Solo se sustituyen expresiones de
texto en las concatenaciones existentes; no se reagrupan bloques ni se cambian saltos,
espacios, puntuación, emojis, orden o condiciones.

Distribución de los textos extraídos:

- Lesión/advertencia física: seis, incluyendo el título, precauciones de manipulación,
  caja y contacto con centro/agentes.
- Imposibilidad de volar: ocho, incluyendo el título, volantones, advertencia específica
  sobre vencejos, revisión de la opción de cría y valoración de lesiones.
- Riesgo inmediato u otra preocupación: seis, incluyendo el título, seguridad personal,
  tráfico y traslado cercano cuando sea seguro.
- Rama general: seis, incluyendo el título, observación de aves en el suelo, vencejos
  y revisión de señales/cría.

Se conservaron las 34 apariciones de literales compartidos con otros generadores:
encabezados comunes, no dar comida/agua, observación prudente, evitar flash, protección
térmica de la caja, valoración tras ataque de gato/perro, contacto general y continuación,
entre otros. No se centralizan aquí frases aunque solo difiera su separador final.
La identificación se contrastó con los textos del resto de `SosAssistant.tsx`, por frase
y no únicamente por igualdad del literal completo con sus saltos.

Permanecen intactos `getObservedSigns`, `getAdvice`, `COMMON_END`, `addSupplementalAdvice`,
las prioridades y todos los demás generadores, incluidos crías/atrapamiento/muertos.
Las menciones a «Es cría» son instrucciones; el generador no compara esas frases.
Las coincidencias literales del cierre común y su eliminación en FAQ quedan pendientes
de una fase propia y no se modifican. Tampoco cambian opciones, ubicación o resúmenes.

`tests/i18n-assistant.cjs --protocols-only` resuelve las nuevas lecturas desde el catálogo
real para ejecutar las recomendaciones, y las revierte a sus literales únicamente al
verificar los hashes originales de fuente/programa. Solo admite estas lecturas dentro
de `getSmallBirdAdvice`. El modo no ejecuta comprobaciones de interfaz ni permite capturar
referencias. El harness de FAQ admite el nuevo import puro, sin cambiar sus aserciones
ni sus referencias; esa suite no se ejecuta en 2I.

Resultados: TypeScript correcto y los 28.394 casos idénticos, carácter por carácter,
contra `protocols-before-i18n-2g.json`, que conserva su SHA-256 original. Las cuatro ramas
del ave pequeña y los casos de prioridad incluidos siguen produciendo la misma salida;
los archivos excluidos y los hashes de fuente/programa tras resolver los literales
coinciden. No se regeneran referencias. No se ejecutan ESLint, builds, comprobaciones
de interfaz ni otras suites. Inglés, selector y redirecciones permanecen desactivados.

## Textos exclusivos de ave mediana/grande 2J

`catalogs/large-bird.es.ts` añade 38 claves tipadas en `largeBirdAdvice`, usadas en 42
lugares de `getLargeBirdAdvice`. Incluyen títulos, precauciones de manipulación,
observación de jóvenes/adultos, valoración de vuelo y seguridad ante riesgo. Las frases
repetidas dentro de este generador reutilizan su clave, sin combinar concatenaciones.
Se cubren las cuatro ramas: advertencia física, imposibilidad de volar (incluyendo ambas
alternativas de `additionalRisk`), riesgo y observación general.

La exclusividad se revisó contra el resto de `SosAssistant.tsx` y el catálogo `smallBird`
ya extraído. Se conservan las 34 apariciones de textos compartidos y el separador puro
`"\n\n"`, además de todas las condiciones, prioridades y concatenaciones. No se extraen
encabezados comunes ni advertencias compartidas sobre alimentación, flash, caja,
ataques de gato/perro o continuación. Todos los demás generadores y composición común
permanecen intactos, al igual que opciones, ubicación, resúmenes e historial.

El catálogo se importa explícitamente en español y se agrega a `catalogs/es.ts`.
Los harness de protocolos/FAQ admiten este import puro; el de protocolos solo revierte
las lecturas nuevas a literales dentro de `getLargeBirdAdvice` al comparar los hashes
originales. Las recomendaciones ejecutan el generador actual y el catálogo real.
No se altera ni recaptura ninguna referencia.

Comprobaciones ejecutadas exclusivamente: TypeScript y
`node tests/i18n-assistant.cjs --protocols-only`, ambos correctos. Los 28.394 casos
coinciden exactamente con `protocols-before-i18n-2g.json`, cuyo SHA-256 permanece intacto;
también coinciden los hashes originales de fuente/programa tras resolver los literales.
No se ejecutan ESLint, builds, comprobaciones de interfaz ni otras suites. Inglés,
selector y redirecciones siguen desactivados; no hay cambios SEO o específicos Android.

## Textos exclusivos de murciélagos 2K

`catalogs/bat.es.ts` añade diez claves tipadas en `batAdvice`, utilizadas únicamente
en `getBatAdvice`. Se extraen el título, valoración de presencia diurna/en el suelo,
vulnerabilidad, separación de niños/animales domésticos, señales de ayuda, prohibición
de lanzamiento para comprobar vuelo, protección de manos, manipulación breve y suave,
caja ventilada con fondo absorbente y comunicación de contacto humano/animal doméstico.
Todas las advertencias conservan literalmente su redacción, emojis, espacios y saltos.

La exclusividad se contrastó con el resto del asistente y los catálogos smallBird/largeBird
ya extraídos. Se mantienen once apariciones de textos compartidos y dos separadores
estructurales (incluido el texto vacío). Permanecen en su lugar alimentación/hidratación,
manipulación mínima, caja tranquila/oscura/protegida, flash, contacto y continuación,
así como encabezados y el mensaje común de señales seleccionadas.

No se cambia `needsHelp`, la inclusión de señales, ninguna condición o concatenación,
otros generadores (incluidos crías/atrapamiento/muertos), `COMMON_END`, suplementos,
lógica marina, opciones, ubicación, resúmenes, historial o mensajes compartidos.
El import es español explícito; no hay activación de inglés, selector o redirecciones.

El catálogo se agrega a `catalogs/es.ts`. Los harness de protocolos/FAQ admiten su import
puro; el comparador solo revierte las lecturas de `batEs.batAdvice` dentro de `getBatAdvice`
para verificar los hashes originales. Las recomendaciones se ejecutan desde el código
actual y el catálogo real. No se modifican referencias ni aserciones históricas.

Comprobaciones ejecutadas exclusivamente: TypeScript y
`node tests/i18n-assistant.cjs --protocols-only`, ambos correctos. Los 28.394 casos son
idénticos a `protocols-before-i18n-2g.json`, que conserva su SHA-256 original; también
coinciden los hashes de fuente/programa tras resolver los literales y los archivos
excluidos. No se ejecutan ESLint, builds, comprobaciones de interfaz ni otras suites.
No hay cambios SEO ni específicos de Android; sin commit, push o despliegue.

## Textos exclusivos de pequeños mamíferos 2L

`catalogs/small-mammal.es.ts` añade siete claves tipadas en `smallMammalAdvice`, utilizadas
solo en `getSmallMammalAdvice`: título, observación a distancia, evitar recogida sin
anomalías/peligro, no sujetar por cola/patas/cabeza, caja solo sin riesgo, separación de
personas/animales domésticos y valoración tras ataque de gato/perro aunque no se aprecien
heridas. Se conservan literalmente las advertencias, puntuación, espacios, emojis,
saltos finales y orden, incluidas las alternativas existentes de `needsHelp`.

La revisión de exclusividad incluye el resto de `SosAssistant.tsx` y los catálogos de
smallBird, largeBird y murciélagos. Se mantienen diez apariciones de textos compartidos
y dos separadores estructurales (incluido el vacío). Permanecen alimentación/hidratación,
manipulación mínima, flash, protección térmica, contacto general, encabezados y mensaje
común de señales. No se cambia ninguna condición, decisión, prioridad o concatenación,
ni los otros generadores, crías/atrapamiento/muertos, cierre, suplementos o lógica marina.
Ubicación, opciones, resúmenes, historial, mensajes compartidos, SEO y Android intactos.

El import resuelve explícitamente el catálogo español y `catalogs/es.ts` incorpora el
área. Los harness admiten únicamente el nuevo import puro; el comparador restaura sus
literales solo dentro de `getSmallMammalAdvice` para comprobar los hashes originales.
Las recomendaciones ejecutan el código actual y el catálogo real. No se alteran las
referencias históricas ni `protocols-before-i18n-2g.json`.

Comprobaciones ejecutadas exclusivamente: TypeScript y
`node tests/i18n-assistant.cjs --protocols-only`, ambos correctos. Los 28.394 casos son
idénticos a la referencia 2G, incluido su SHA-256 original; coinciden también los hashes
de fuente/programa tras resolver los literales y los archivos excluidos. No se ejecutan
ESLint, builds, comprobaciones de interfaz ni otras suites. Inglés, selector y
redirecciones siguen desactivados. Sin commit, push ni despliegue.

## Textos exclusivos de mamíferos grandes 2M

`catalogs/large-mammal.es.ts` añade seis claves tipadas en `largeMammalAdvice`, utilizadas
solo en `getLargeMammalAdvice`: título, reacción imprevisible por miedo/estrés/dolor,
evitar acercarse/intervenir sin peligro o anomalías, no capturar/sujetar/trasladar,
no acorralar ni bloquear la salida y reducción segura de ruidos/personas/perros/vehículos.
Se preservan literalmente contenido, puntuación, espacios, emojis, saltos y orden.

La exclusividad se revisó contra el resto del asistente y los catálogos smallBird,
largeBird, murciélagos y pequeños mamíferos. Se conservan once apariciones de textos
compartidos y dos separadores estructurales (incluido el vacío). Permanecen la distancia
prudente, advertencias generales, señales, alimentación/hidratación, flash, seguridad
en carretera, contacto y seguimiento de indicaciones del personal especializado.
No se cambian `needsHelp`, condiciones, prioridades, concatenaciones, otros generadores,
crías/atrapamiento/muertos, cierre común, suplementos ni lógica marina. Ubicación,
resúmenes, historial, mensajes compartidos, opciones, rutas, SEO y Android intactos.

El catálogo español se importa directamente y se agrega a `catalogs/es.ts`. Los harness
de protocolos/FAQ admiten su import puro. El comparador solo restaura los literales
dentro de `getLargeMammalAdvice` al verificar los hashes originales; las recomendaciones
ejecutan el generador actual y el catálogo real. No se cambian referencias históricas.

Comprobaciones ejecutadas exclusivamente: TypeScript y
`node tests/i18n-assistant.cjs --protocols-only`, ambos correctos. Los 28.394 casos son
idénticos a `protocols-before-i18n-2g.json`, que conserva su SHA-256 original. Coinciden
también los hashes originales de fuente/programa tras resolver los literales y los
archivos excluidos. Sin ESLint, builds, comprobaciones de interfaz ni otras suites.
Inglés, selector y redirecciones siguen desactivados. Sin commit, push ni despliegue.

## Textos exclusivos de animal desconocido 2O

`catalogs/unknown-animal.es.ts` añade cuatro claves tipadas en `unknownAnimalAdvice`,
usadas solo en `getUnknownAnimalAdvice`: identificación exacta no necesaria para ayudar,
evitar intervenir sin anomalías/peligro, no manipular/trasladar sin necesidad y no forzar
la liberación. Se conservan literalmente advertencias, puntuación, espacios, emojis,
saltos y orden. Las alternativas de `needsHelp` y todas las concatenaciones son las mismas.

La exclusividad se contrastó con el resto del asistente y los seis catálogos de
protocolos ya extraídos. Se mantienen doce apariciones de texto compartido o base de
otros títulos, y dos separadores estructurales. Por prudencia el título «NO ESTOY SEGURO»
sigue en su lugar: también es la base de los títulos específicos de cría/atrapamiento.
Permanecen encabezados, observación a distancia, señales, alimentación/hidratación,
separación de personas/animales domésticos, seguridad personal, flash y contacto.

No se modifica ninguna condición, decisión, prioridad, otro generador, cría/atrapamiento/
muerto, cierre, suplemento, deduplicación marina, ubicación, resumen, historial o mensaje
compartido. El catálogo se importa explícitamente en español y se agrega a `catalogs/es.ts`.
Los harness admiten el nuevo import puro. El comparador solo restaura sus literales dentro
de `getUnknownAnimalAdvice` para comprobar los hashes originales; las recomendaciones
ejecutan el generador actual y el catálogo real. No se regeneran referencias.

Comprobaciones ejecutadas exclusivamente: TypeScript y
`node tests/i18n-assistant.cjs --protocols-only`, ambos correctos. Los 28.394 casos son
idénticos a `protocols-before-i18n-2g.json`, cuyo SHA-256 original permanece intacto.
También coinciden los hashes de fuente/programa tras resolver los literales y los archivos
excluidos. Sin ESLint, builds, comprobaciones de interfaz ni otras suites. Inglés, selector
y redirecciones siguen desactivados; SEO y Android intactos. Sin commit, push ni despliegue.

## Recomendaciones marinas seguras para extracción 2P

`catalogs/marine-animal.es.ts` añade 37 claves tipadas en `marineAnimalAdvice`, usadas en
41 literales de `getMarineAnimalAdvice`: seis títulos, precauciones iniciales, acciones
generales y recomendaciones específicas para cetáceos, focas, tortugas, tiburones/rayas,
otros animales marinos, embarcaciones y riesgo de entrada al agua. Se importa el catálogo
español explícitamente y se incorpora a `catalogs/es.ts`. No se activa otro idioma.

Se contrastaron las frases con los demás generadores, `addMarineFlagAdvice` y los siete
catálogos de protocolos previos. Las frases extraídas no coinciden con las del helper de
flags. Los literales repetidos dentro del generador («No manipules al animal...» y
«No le des comida ni agua.») reutilizan la misma clave. Cada acceso sigue produciendo
una cadena primitiva exactamente igual, sin trim, formato, interpolación o normalización.
`addUnique` sigue recibiendo cadenas y comparándolas mediante `includes`; las claves del
catálogo no se utilizan como identificadores de recomendaciones o deduplicación.

Los valores del nuevo catálogo se infieren como `string` y sus claves permanecen tipadas.
Esto conserva la inferencia original `string[]` de los arrays mutables sin tener que
anotar/refactorizar `before`, `dont` o `actions` en el generador. La primera comprobación
TypeScript detectó el estrechamiento producido por `as const`; se corrigió solo en el
catálogo. Ambas comprobaciones finales son correctas.

No se dejó pendiente ninguno de los 37 textos por riesgo de deduplicación en español:
la sustitución es literal y conserva todas las igualdades. Permanecen sin extraer los
cuatro encabezados compartidos, separadores, `COMMON_END` y los textos de
`addMarineFlagAdvice` (varamiento, redes/cabos, sedal/anzuelo, varios animales,
personas/perros, heridas, debilidad y otras circunstancias), por composición compartida
y alcance. No se modifica el helper, la deduplicación ni sus condiciones. Antes de
localizar realmente habrá que conservar la coherencia de las cadenas que intervienen
en comparaciones; esta extracción no autoriza traducciones ni sustituye identidad textual.

No se alteran condiciones marinas, prioridades, `getAdvice`, suplementos, crías,
atrapamiento, muertos u otros generadores. También permanecen intactos ubicación,
resúmenes, historial, mensajes compartidos, opciones, rutas, SEO y Android. Los harness
admiten el import puro; el comparador restaura las lecturas solo dentro de
`getMarineAnimalAdvice` al verificar hashes originales, mientras las recomendaciones
ejecutan el código y catálogo actuales. No se modifican ni regeneran referencias.

Comprobaciones ejecutadas exclusivamente: TypeScript y
`node tests/i18n-assistant.cjs --protocols-only`, ambos correctos. Los 28.394 casos son
idénticos a `protocols-before-i18n-2g.json`, cuyo SHA-256 original permanece intacto.
También coinciden los hashes de fuente/programa tras resolver los literales y los archivos
excluidos. La caracterización cubre los seis tipos marinos y las parejas posición/entorno,
con sus perfiles de flags, conservando contenido y orden. Sin ESLint, builds ni otras
pruebas. Inglés, selector y redirecciones desactivados; sin commit, push ni despliegue.

## Textos exclusivos de flags marinos 2Q

`catalogs/marine-flags.es.ts` añade once claves tipadas en `marineFlagAdvice`, utilizadas
solo en `addMarineFlagAdvice`: no devolver al agua, no retirar aparejos, descripción del
enredo, sedal/anzuelo, cantidad/ubicación de animales, heridas, debilidad e información
de otras circunstancias. Se conservan literalmente contenido, puntuación y espacios;
los valores siguen siendo cadenas primitivas españolas idénticas.

La exclusividad se contrastó con el resto del asistente y los ocho catálogos de
protocolos previos. Permanece sin extraer «• Mantén personas y perros alejados si puedes
hacerlo sin riesgo.» porque también se usa en `getDeadMarineAnimalAdvice`. No se modifica
ese generador ni se centraliza todavía la frase compartida. No se detectó otra dependencia
que impida extraer con seguridad los once textos; las igualdades textuales y el orden de
inserción de `addUnique` se conservan. Las nuevas claves solo son claves de traducción,
no identificadores de recomendaciones.

Permanecen intactos `addUnique`, todas las condiciones, prioridades, llamadas y orden
del helper, `getMarineAnimalAdvice`, `getAdvice`, cierre, suplementos y otros generadores.
No se alteran crías/atrapamiento/muertos, ubicación, resúmenes, historial o mensajes
compartidos. El catálogo español se importa directamente y se agrega a `catalogs/es.ts`.
Los harness admiten el nuevo import puro; el comparador restaura las lecturas solo dentro
de `addMarineFlagAdvice` al comprobar hashes originales, ejecutando las recomendaciones
con el código actual y el catálogo real. Las referencias permanecen intactas.

Comprobaciones ejecutadas exclusivamente: TypeScript y
`node tests/i18n-assistant.cjs --protocols-only`, ambos correctos. Los 28.394 casos son
idénticos a `protocols-before-i18n-2g.json`, cuyo SHA-256 original no cambia. Coinciden
también los hashes de fuente/programa tras resolver los literales y los archivos excluidos.
Sin ESLint, builds, comprobaciones de interfaz ni otras suites. Inglés, selector y
redirecciones siguen desactivados; SEO y Android intactos. Sin commit, push ni despliegue.

## Textos exclusivos de reptiles y anfibios 2N

`catalogs/reptile-amphibian.es.ts` añade ocho claves tipadas en `reptileAmphibianAdvice`,
usadas exclusivamente en `getReptileAmphibianAdvice`. Se extraen el título, observación
sin contacto con animales no identificados, las dos alternativas de `needsHelp`, evitar
manipulación innecesaria/traslados lejanos, asistencia especializada para serpientes y
las restricciones de movimiento/liberación para otros reptiles/anfibios identificados.
Se conserva completo el literal que contiene dos viñetas de asistencia/recipiente,
sin dividirlo, reordenarlo ni modificar saltos o concatenaciones.

La exclusividad se contrastó con el resto del asistente y los cinco catálogos de
protocolos ya extraídos. Permanecen nueve apariciones de textos compartidos y dos
separadores estructurales. En particular, la prohibición de coger/capturar/manipular/
trasladar serpientes, culebras o víboras, aunque se crea identificar la especie, sigue
literalmente en su lugar porque está compartida. Las advertencias de distancia,
incertidumbre de identificación y atención especializada conservan toda su redacción.
No se modifica ninguna condición, prioridad, concatenación, otro generador, protocolo
de cría/atrapamiento/muerto, cierre, suplemento o deduplicación marina. Ubicación,
resúmenes, historial, mensajes compartidos, opciones, rutas, SEO y Android intactos.

El catálogo español se importa directamente y se agrega a `catalogs/es.ts`. Los harness
admiten el nuevo import puro; para verificar los hashes originales, el comparador solo
restaura los literales dentro de `getReptileAmphibianAdvice`. Las recomendaciones se
ejecutan con el código actual y el catálogo real. Las referencias no se regeneran.

Comprobaciones ejecutadas exclusivamente: TypeScript y
`node tests/i18n-assistant.cjs --protocols-only`, ambos correctos. Los 28.394 casos son
idénticos a `protocols-before-i18n-2g.json`, cuyo SHA-256 original permanece intacto.
Coinciden también los hashes originales de fuente/programa tras resolver los literales
y los archivos excluidos. Sin ESLint, builds, comprobaciones de interfaz ni otras suites.
Inglés, selector y redirecciones siguen desactivados. Sin commit, push ni despliegue.

## Recomendaciones compartidas seguras 2R

`catalogs/rescue-shared.es.ts` incorpora 15 cadenas españolas completas y tipadas en
`sharedRescueAdvice`, reutilizadas en 60 lugares de siete generadores. Se importa el
catálogo español explícitamente y se agrega a `catalogs/es.ts`. Se sustituye únicamente
cada literal completo: no se separan viñetas/saltos, no se interpolan palabras ni se
reagrupan concatenaciones. Cada igualdad exacta reutiliza una clave. Las variantes de
línea (`\n`) y párrafo (`\n\n`) conservan claves distintas y su terminación original.

Inventario de reutilización (A = ave pequeña; G = ave mediana/grande; B = murciélago;
P = pequeño mamífero; M = mamífero grande; R = reptil/anfibio; D = desconocido):

| Clave | Generadores | Usos |
| --- | --- | --- |
| `documentWithoutFlashLine` | A, G, B, R, D | 6 |
| `documentWithoutFlashParagraph` | A, G, P, M | 6 |
| `noFoodOrWaterLine` | A, G, B, P, M | 9 |
| `noFoodOrWaterParagraph` | G, R, D | 4 |
| `protectBoxOrCarrierLine` | A, G, P | 5 |
| `contactRecoveryCenterLine` | A, G, B, M | 4 |
| `contactRecoveryCenterParagraph` | A, P, R, D | 4 |
| `keepPeopleAndPetsAwayLine` | A, D | 2 |
| `observeFromDistanceLine` | A, D | 3 |
| `catOrDogAttackAssessmentFemaleLine` | A, G | 2 |
| `continueToShareInformationParagraph` | A, G, B | 5 |
| `immediateDangerSafetyLine` | G, D | 2 |
| `trafficSafetyAndEmergencyHelpLine` | G, M | 2 |
| `observeSituationFromDistanceLine` | G, M | 2 |
| `selectedSignsNeedSpecialistHelpParagraph` | B, P, M, D | 4 |

Por generador: `getSmallBirdAdvice` 18 sustituciones, `getLargeBirdAdvice` 16,
`getBatAdvice` 5, `getSmallMammalAdvice` 5, `getLargeMammalAdvice` 6,
`getReptileAmphibianAdvice` 3 y `getUnknownAnimalAdvice` 7. Todas las condiciones,
prioridades, señales observadas y orden de las recomendaciones permanecen idénticos.
No se modifica ningún otro generador/helper, ni opciones, ubicación, resúmenes,
historial, mensajes compartidos, rutas, SEO o configuración Android.

Pendientes por seguridad o alcance:

- `COMMON_END` y los textos de `addSupplementalAdvice`: el cierre se reconoce por
  `endsWith`, longitud y retirada por expresión regular en FAQ. No se modifica su
  identidad textual ni su composición.
- Encabezados compartidos y variantes con saltos iniciales, separadores puros,
  `join`, condiciones y concatenaciones: se mantienen en el código por su función
  estructural, sin centralizarlos como texto de recomendación.
- Apariciones de estas mismas frases en `getBabyAdvice` y `getTrappedAdvice`: quedan
  literalmente intactas. El catálogo está disponible para una futura fase autorizada;
  no se cambia ahora su extracción específica. Los animales muertos también quedan fuera.
- Frases compartidas con protocolos excluidos que solo tienen una aparición entre los
  generadores autorizados no se abordan aquí. Por ejemplo, el texto de mantener alejados
  a personas/perros de `addMarineFlagAdvice` y animales marinos muertos permanece intacto:
  no se extiende la centralización al circuito de deduplicación.
- Variantes de género, redacción o terminación no se fusionan: hacerlo requeriría
  composición nueva. Se conservan los catálogos exclusivos de fases anteriores.

Los textos seleccionados no participan en comparaciones, deduplicación ni reconocimiento
por contenido. El mensaje de continuar al paso siguiente es distinto de `COMMON_END`:
solo se sustituye su literal, manteniendo exactamente el cierre y sus operaciones.
`addUnique`, `addMarineFlagAdvice` y `getMarineAnimalAdvice` permanecen intactos en 2R.

Los harness de protocolos/FAQ admiten el import puro. El comparador restaura las lecturas
solo dentro de los siete generadores autorizados al comprobar los hashes originales;
las recomendaciones se ejecutan con el código y el catálogo actuales. No se modifican
referencias, aserciones históricas ni su SHA-256, y no se utiliza el modo de captura.

Comprobaciones ejecutadas exclusivamente: TypeScript y
`node tests/i18n-assistant.cjs --protocols-only`, ambos correctos. Los 28.394 casos son
idénticos a `protocols-before-i18n-2g.json`, con su SHA-256 original intacto. Coinciden
asimismo los hashes de fuente/programa tras resolver los literales y los archivos
excluidos. Sin ESLint, builds, comprobaciones de interfaz ni otras suites. Inglés,
selector y redirecciones siguen desactivados. Sin commit, push ni despliegue.

## Crías y animales jóvenes 2S

El generador es `getBabyAdvice(animalType)`, con siete ramas: `smallBird`, `largeBird`,
`bat`, `smallMammal`, `largeMammal`, `reptileAmphibian` y la respuesta final de animal
no identificado. La rama de ave pequeña distingue pollo y volantón e incluye la
advertencia específica de vencejos. La entrada al generador y la prioridad de
atrapamiento frente a cría en `getAdvice` permanecen literalmente intactas.

`catalogs/baby.es.ts` añade 85 cadenas completas tipadas en `babyAdvice`, utilizadas
111 veces. Otras 25 apariciones reutilizan seis claves existentes de `sharedRescueAdvice`:

| Clave existente | Usos nuevos en crías |
| --- | --- |
| `observeFromDistanceLine` | 4 |
| `noFoodOrWaterLine` | 4 |
| `noFoodOrWaterParagraph` | 3 |
| `documentWithoutFlashLine` | 7 |
| `contactRecoveryCenterParagraph` | 6 |
| `contactRecoveryCenterLine` | 1 |

Hay 136 sustituciones textuales en total. Las cadenas nuevas repetidas entre ramas
reutilizan su clave. Las variantes de género, redacción y saltos finales conservan
sus valores distintos; no se añaden interpolaciones ni composición nueva. El catálogo
se importa explícitamente en español y se incorpora a `catalogs/es.ts`.

Se conservan íntegramente las diferencias de seguridad de cada rama: nido/volantones,
reunificación y cautelas para murciélagos, ausencia temporal de la madre, observación
sin recoger automáticamente, evitar tocar grandes mamíferos, independencia temprana
de reptiles/anfibios y prohibición de coger/capturar/manipular/liberar/trasladar serpientes,
culebras o víboras aunque se crea identificar la especie. Las condiciones para devolver
al nido, reunificar, observar o solicitar ayuda siguen siendo el mismo contenido español;
no se cambian decisiones, prioridades, orden, concatenaciones ni cierre.

Pendientes por seguridad y alcance:

- `COMMON_END`, sus alias locales y los mecanismos de `addSupplementalAdvice`/FAQ que
  reconocen y retiran el cierre por coincidencia literal permanecen intactos.
- Los encabezados generales de antes de intervenir, señales/necesidad de ayuda, qué
  hacer/no hacer y sus saltos estructurales se conservan en el código. Solo pasan al
  catálogo los títulos específicos de especie y las etiquetas de pollo/volantón.
- Las apariciones de textos iguales en otros generadores no se sustituyen en esta fase.
  En particular, la advertencia completa sobre serpientes se traslada solo en crías;
  su aparición en el protocolo general de reptiles/anfibios permanece intacta.
- No se modifica atrapamiento, animales muertos, deduplicación marina, ubicación,
  resúmenes, historial, mensajes compartidos, opciones, rutas, SEO o Android. Ninguna
  viñeta seleccionada ha requerido cambiar comparaciones o composición compartida.

Los harness de protocolos/FAQ admiten el import puro. El comparador solo restaura las
lecturas nuevas dentro de `getBabyAdvice` al verificar los hashes originales; también
admite allí la reutilización de las seis claves compartidas. Las recomendaciones
se ejecutan desde el código y catálogos reales. No se modifican referencias ni aserciones
históricas y no se utiliza el modo de captura.

Comprobaciones ejecutadas exclusivamente: TypeScript y
`node tests/i18n-assistant.cjs --protocols-only`, ambos correctos. Los 28.394 casos son
idénticos a `protocols-before-i18n-2g.json`, cuyo SHA-256 original permanece intacto.
Coinciden también los hashes originales de fuente/programa tras resolver los literales
y los archivos excluidos. Sin ESLint, builds, comprobaciones de interfaz ni otras suites.
Inglés, selector y redirecciones desactivados. Sin commit, push ni despliegue.

## Animales atrapados 2T

El generador terrestre es `getTrappedAdvice(animalType)`, con siete ramas: `smallBird`,
`largeBird` (título original «RAPAZ ATRAPADA»), `bat`, `smallMammal`, `largeMammal`,
`reptileAmphibian` y respuesta final de animal desconocido. El atrapamiento marino
sigue en el circuito de `getMarineAnimalAdvice`/`addMarineFlagAdvice`, sin cambios.
La prioridad de atrapamiento sobre cría y las demás decisiones de `getAdvice` permanecen
literalmente intactas.

`catalogs/trapped.es.ts` añade 45 cadenas tipadas en `trappedAdvice`, utilizadas 53 veces.
Otras 28 apariciones reutilizan cinco claves existentes de `sharedRescueAdvice`:

| Clave existente | Usos nuevos en atrapamiento |
| --- | --- |
| `documentWithoutFlashLine` | 6 |
| `noFoodOrWaterParagraph` | 7 |
| `protectBoxOrCarrierLine` | 3 |
| `contactRecoveryCenterParagraph` | 6 |
| `keepPeopleAndPetsAwayLine` | 6 |

Hay 81 sustituciones textuales en total. Las cadenas repetidas dentro del generador,
como no tirar del animal o valorar el riesgo antes de intervenir, reutilizan su clave.
Solo se trasladan literales completos: puntuación, espacios, emojis, saltos finales,
variantes de género, orden y concatenaciones permanecen iguales. El catálogo español
se importa directamente y se incorpora a `catalogs/es.ts`.

Se mantienen las advertencias específicas de cada rama: alas/patas/cuello y garras de
aves, manos protegidas para murciélagos, riesgo de mordedura en mamíferos, no liberar
solo ni acercarse a grandes animales peligrosos, y prohibición de coger/capturar/
manipular/liberar/trasladar serpientes, culebras o víboras aunque se crea identificar
la especie. Las instrucciones para otros reptiles/anfibios siguen excluyendo serpientes.
El párrafo extenso de seguridad de serpientes se traslada entero, sin dividir frases.
La redacción original se conserva también cuando presenta irregularidades gramaticales;
no se realiza edición de contenido en esta fase.

Pendientes por seguridad y alcance:

- `COMMON_END`, su alias local y los mecanismos de cierre de `addSupplementalAdvice`
  y FAQ permanecen intactos por sus coincidencias y operaciones textuales.
- Los encabezados generales «ACTÚA CON CALMA», «QUÉ NO HACER» y «QUÉ HACER» y sus saltos
  se conservan en el código por su función estructural. Los siete títulos específicos
  sí se trasladan al catálogo.
- No se modifica el circuito marino, `addUnique` ni su deduplicación, otros generadores,
  crías, animales muertos, ubicación, resúmenes, historial, mensajes compartidos, opciones,
  rutas, SEO o Android. No queda ninguna viñeta de estas siete ramas pendiente por
  comparaciones textuales o dependencia que requiera cambiar lógica o composición.

Los harness de protocolos/FAQ admiten el nuevo import puro. El comparador solo restaura
las lecturas nuevas dentro de `getTrappedAdvice` para verificar los hashes originales;
también permite allí las cinco claves compartidas existentes. Las recomendaciones
se ejecutan con el código y catálogos reales. No se modifican referencias ni aserciones
históricas y no se utiliza el modo de captura.

Comprobaciones ejecutadas exclusivamente: TypeScript y
`node tests/i18n-assistant.cjs --protocols-only`, ambos correctos. Los 28.394 casos son
idénticos a `protocols-before-i18n-2g.json`, cuyo SHA-256 original permanece intacto.
Coinciden también los hashes originales de fuente/programa tras resolver los literales
y los archivos excluidos. Sin ESLint, builds, comprobaciones de interfaz ni otras suites.
Inglés, selector y redirecciones desactivados. Sin commit, push ni despliegue.

## Animales muertos terrestres y marinos 2U

Las recomendaciones de animales muertos se generan mediante dos retornos anticipados
intactos de `getAdvice`: primero `animalState === "dead" && isMarineAnimal(animalType)`,
que delega en `getDeadMarineAnimalAdvice`, y después `animalState === "dead"`, que
atiende a los demás tipos. No se cambia ninguna condición ni orden de retorno, y ambas
ramas continúan terminando antes de las recomendaciones de vivos, crías, atrapamiento
y suplementos.

`catalogs/dead.es.ts` añade 25 cadenas tipadas en `deadAdvice`, utilizadas en 26 lugares.
Se cubren la rama terrestre/general y los seis títulos marinos (delfín, cetáceo grande,
foca, tortuga marina, tiburón/raya y otro animal marino), con sus recomendaciones
comunes. La frase completa «• No alteres el lugar del hallazgo.\n\n» comparte una clave
entre terrestre y marino. No hay coincidencias completas con claves existentes; por
eso no se reutilizan variantes que difieren en redacción o saltos finales.

Se preservan literalmente todas las diferencias: no tocar/mover cadáveres marinos,
la excepción terrestre por peligro inmediato con indicaciones, no manipular cebos u
objetos sospechosos, observación a distancia, documentación del entorno y comunicación
a agentes, seguridad, emergencias o servicios competentes. También se mantienen el
valor sanitario/científico marino y la información de especie, tamaño, hora y otros
ejemplares. No se mezclan instrucciones terrestres y marinas ni se normalizan sus textos.

El catálogo se importa explícitamente en español y se incorpora a `catalogs/es.ts`.
Solo se sustituyen literales completos; quedan intactos puntuación, espacios, emojis,
saltos, orden, concatenaciones y decisiones de los dos recorridos.

Pendientes por seguridad y alcance:

- `COMMON_END` y el alias local terrestre permanecen intactos por las operaciones
  textuales de cierre compartidas con suplementos y FAQ.
- Los encabezados generales de intervención, observación, qué hacer/no hacer y sus
  separadores permanecen en el código por su función estructural.
- Las recomendaciones de vivos, crías y atrapamiento, `addSupplementalAdvice`,
  `addUnique` y la deduplicación marina no se modifican. Tampoco ubicación, resúmenes,
  historial, mensajes compartidos, opciones, rutas, SEO o Android.
- Ninguna viñeta seleccionada requiere cambiar comparaciones o composición. Las
  diferencias con otras cadenas (por ejemplo, personas/perros con o sin salto final)
  se mantienen; no se construyen frases nuevas para reutilizar parcialmente sus claves.

Los harness de protocolos/FAQ admiten el nuevo import puro. Al comprobar hashes, el
comparador solo restaura las lecturas dentro de `getDeadMarineAnimalAdvice` o del bloque
terrestre cuyo `if` sigue siendo exactamente `animalState === "dead"`. No se autoriza
mediante el adaptador ninguna lectura nueva en ramas vivas de `getAdvice`.
Las recomendaciones ejecutan el código y el catálogo reales. No se modifican referencias
ni aserciones históricas y no se utiliza el modo de captura.

Comprobaciones ejecutadas exclusivamente: TypeScript y
`node tests/i18n-assistant.cjs --protocols-only`, ambos correctos. Los 28.394 casos son
idénticos a `protocols-before-i18n-2g.json`, cuyo SHA-256 original permanece intacto.
Coinciden también los hashes originales de fuente/programa tras resolver los literales
y los archivos excluidos. Sin ESLint, builds, comprobaciones de interfaz ni otras suites.
Inglés, selector y redirecciones desactivados. Sin commit, push ni despliegue.

## Fase 2V: cierre común y recomendaciones suplementarias

Se extraen 11 fragmentos exactos a `catalogs/supplemental.es.ts`: el cierre común,
los dos encabezados de suplementos y sus ocho viñetas. Se conservan todos los
saltos finales, espacios, puntuación y emojis. El catálogo español tipado se
incorpora a `catalogs/es.ts` y se importa explícitamente desde el asistente.

`COMMON_END` conserva su exportación y su valor español, ahora obtenido del catálogo.
No se modifican las concatenaciones de los suplementos, las condiciones, el orden
(marca/dispositivo, apariencia normal, cierre), ni `trimEnd`, `endsWith`, `slice`
o el separador `join("\n\n")`. Tampoco se modifican los generadores, sus prioridades,
la deduplicación, los avisos, la ubicación o los mensajes compartidos.

El consumidor de FAQ permanece intacto: sigue importando `COMMON_END` y eliminando
el sufijo mediante su expresión regular escapada. Los harness de protocolos y FAQ
admiten el import del catálogo; no cambian las referencias ni sus aserciones.
El comparador restaura únicamente el inicializador de `COMMON_END` y las lecturas
situadas en `addSupplementalAdvice` al comprobar los hashes originales. Ejecuta las
recomendaciones utilizando el código y los valores reales del catálogo.

Dependencias pendientes antes de traducir al inglés:

- El cierre continúa siendo una dependencia textual. `endsWith`, `slice` con su
  longitud y la expresión regular de FAQ deben utilizar exactamente el mismo cierre
  y el mismo idioma que la respuesta. No se debe traducir uno independientemente.
- La importación explícita española mantiene el comportamiento actual. La futura
  selección de idioma de generadores, suplementos y consumidores necesita una
  decisión coordinada y autorización; no se incorpora ahora resolución dinámica.
- Se mantienen los límites de cada fragmento, incluidos sus saltos finales, y las
  operaciones de composición existentes. Introducir identificadores estructurados
  o refactorizar esa composición queda fuera de esta fase.

No quedan fragmentos de contenido pendientes dentro de este alcance; los separadores
y las operaciones internas permanecen deliberadamente en el código.

Comprobaciones ejecutadas exclusivamente: TypeScript (`--noEmit --incremental false`)
y `node tests/i18n-assistant.cjs --protocols-only`, ambas correctas. Los 28.394 casos
son idénticos a `protocols-before-i18n-2g.json`, sin modificar su SHA-256 original.
Coinciden los hashes originales de fuente/programa tras resolver los literales y los
archivos excluidos. Sin ESLint, builds ni otras suites. Inglés, selector y
redirecciones desactivados. Sin commit, push ni despliegue.

## Fase 2W: composición estructural del cierre común

`utils/adviceComposition.ts` define bloques inmutables de tipo `body`, `supplement`
y `commonEnd`, con texto y separador previo explícitos. `formatAdvice` compone los
bloques y permite omitir el cierre por su tipo, sin examinar su redacción.
`withAdviceSupplements` conserva el orden cuerpo → suplementos → cierre y los dos
saltos entre bloques, incluido el recorte final del cuerpo que ya existía.

`getAdviceParts` contiene las decisiones que antes estaban en `getAdvice`, en el
mismo orden y con las mismas condiciones. Solo cambia la envoltura de composición:
las salidas de animales muertos se adaptan sin recortar espacios; los vivos pasan
por los suplementos con las condiciones originales. No se modifican los generadores,
`addUnique`, la deduplicación marina ni las prioridades. `getAdvice` conserva su firma
y devuelve la cadena renderizada, exactamente como antes. `COMMON_END` conserva su
exportación y el mismo valor español para los consumidores heredados.

La FAQ general usa `formatAdvice(getAdviceParts(...), false).trim()` para omitir el
bloque `commonEnd`. Se eliminan únicamente sus dos helpers de eliminación textual y
el import del cierre; no cambian selección de animales, búsqueda, respuestas propias
de vencejos/marinos, enlaces, contenido del catálogo ni SEO.

Dependencia pendiente, explícita y aislada: los generadores todavía concatenan
`COMMON_END` dentro de cadenas planas. `fromLegacyAdvice` reconoce ese sufijo usando
el cierre recibido como argumento y conserva exactamente el prefijo y sus espacios.
En vivos recibe la cadena con `trimEnd`, igual que la composición anterior; en muertos
recibe la cadena intacta. No contiene redacción española ni usa expresiones regulares,
pero sigue dependiendo de igualdad textual en este límite heredado. Eliminarla por
completo requerirá autorizar que los generadores produzcan bloques o separen el cierre.
Antes de traducir, la salida heredada y el cierre que reciba el adaptador deben usar
el mismo idioma. Los catálogos siguen importándose explícitamente en español.
No se introduce detección heurística, estado global, caché ni cambios de almacenamiento.

Comprobaciones ejecutadas: TypeScript (`--noEmit --incremental false`) correcto y
`node tests/i18n-assistant.cjs --protocols-only` correcto. Los 28.394 casos son
exactamente iguales a la referencia 2G, sin modificarla ni cambiar su SHA-256.
En esos mismos casos se verifica un único cierre final, el orden de tipos de bloque,
la igualdad de la salida renderizada y la equivalencia de la variante sin cierre
que utiliza FAQ respecto al contrato anterior. No se ejecutan otras suites.

Los hashes históricos se conservan mediante el adaptador explícito
`tests/helpers/advice-composition-2w.cjs`: revierte en memoria solo los cambios
estructurales autorizados de asistente y FAQ antes de resolver los literales para
comparar hashes. Cada sustitución exige una coincidencia única; no se actualizan
hashes ni referencias y no se sustituye el código ejecutado en los 28.394 casos.
El harness FAQ admite el nuevo import puro y la declaración `getAdviceParts`, sin
actualizar sus referencias históricas ni ejecutar esa suite en esta fase.

Sin ESLint, builds, pruebas de interfaz ni otras pruebas. Inglés, selector y
redirecciones desactivados; rutas, SEO, configuración Android, avisos e historial
sin cambios. Sin commit, push ni despliegue.

## Fase 2X: cierre estructurado desde los generadores

Se sustituye el último operador de concatenación del cierre por un argumento de
`withCommonEnd(body, commonEnd)` en 30 retornos. Esta función crea los bloques `body`
y `commonEnd` directamente; no inspecciona ni recorta el texto del cierre. El cuerpo
conserva literalmente su contenido y todos sus separadores, incluidos los saltos
finales anteriores al cierre. No se reescriben advertencias, títulos o recomendaciones.

Cobertura de retornos modificados:

- `getTrappedAdvice`: 7 ramas.
- `getBabyAdvice`: 7 ramas.
- `getSmallBirdAdvice` y `getLargeBirdAdvice`: 4 ramas cada uno.
- Murciélagos, pequeños mamíferos, grandes mamíferos, reptiles/anfibios y animal
  desconocido: 1 retorno por generador.
- `getMarineAnimalAdvice`: 1 retorno compartido por los seis tipos marinos.
- `getDeadMarineAnimalAdvice`: 1 retorno para animales marinos muertos.
- `getAdviceParts`: 1 retorno para animales terrestres muertos.

Se elimina `fromLegacyAdvice`, junto con su reconocimiento de sufijos mediante
`endsWith` y el recorte por longitud con `slice`. `addSupplementalAdvice` recibe ahora
los bloques directamente. El cuerpo se sigue recortando con `trimEnd` al componer
suplementos, como antes, sin comparar el contenido del cierre. Los retornos de
animales muertos conservan sus espacios íntegros y sus retornos anticipados.
El orden sigue siendo cuerpo → suplementos → cierre. La deduplicación marina,
`addUnique`, condiciones y prioridades permanecen intactos.

`getAdvice` mantiene su firma y devuelve la misma cadena. Las FAQ siguen utilizando
`getAdviceParts` y `formatAdvice(..., false).trim()` sin cambios en esta fase.
`COMMON_END` conserva su exportación para compatibilidad y obtiene su contenido del
catálogo español. No queda dependencia de su redacción española en los generadores,
la composición o las FAQ: su identidad se establece por el tipo de bloque. No quedan
casos pendientes de reconocimiento textual. La futura selección de idioma de los
catálogos sigue pendiente y desactivada; el cambio no incorpora traducciones.

Comprobaciones ejecutadas exclusivamente: TypeScript (`--noEmit --incremental false`)
y `node tests/i18n-assistant.cjs --protocols-only`, ambas correctas. Los 28.394 casos
son exactamente idénticos a la referencia original 2G, sin modificarla ni su SHA-256.
El comparador mantiene las comprobaciones de orden de bloques, cierre único y salida
sin cierre en esos mismos casos. No se ejecutan ESLint, builds ni otras suites.

Para conservar los hashes históricos, `tests/helpers/advice-composition-2x.cjs`
revierte en memoria únicamente la envoltura de los 30 retornos y el paso de bloques
a suplementos, antes del adaptador 2W existente. Usa el AST, comprueba las funciones
y cantidades autorizadas y conserva todos los bytes del cuerpo y sus decisiones.
Las recomendaciones comparadas ejecutan el código actual, sin esta inversión.
No se actualizan hashes, salidas esperadas ni referencias históricas. Las menciones
textuales heredadas se conservan solo en los adaptadores de prueba y en esta historia.

Archivos afectados: `components/sos/SosAssistant.tsx`, `utils/adviceComposition.ts`,
`tests/i18n-assistant.cjs`, nuevo `tests/helpers/advice-composition-2x.cjs` y este README.
Sin cambios en ubicación, avisos, resúmenes, historial, mensajes compartidos, rutas,
SEO o configuración Android. Inglés, selector y redirecciones desactivados.
Sin commit, push ni despliegue.

## Fase 2Y: deduplicación marina por identificadores estables

Se revisan las 33 llamadas a `addUnique` de `addMarineFlagAdvice` y
`getMarineAnimalAdvice`, las tres variantes de precauciones iniciales, las dos
acciones iniciales y la acción final añadida con `push`. Se identifican 42 cadenas
exactamente distintas, representadas en 46 apariciones de código. Solo se repiten
las precauciones `doNotHandleOrMove` y `noFoodOrWater`, cada una en las tres variantes
iniciales mutuamente excluyentes. No hay otras igualdades exactas entre las entradas
revisadas. No se fusionan frases parecidas ni variantes de singular/plural.

`utils/marineAdvice.ts` declara la unión tipada `MarineAdviceId` con los 42 valores
estables `marine.*` y el tipo inmutable `MarineAdviceRecommendation` (`id`, `text`).
La lista completa de identificadores está en ese archivo. Son valores explícitos;
no se calculan a partir de traducciones ni de claves del catálogo durante la ejecución.
Por ejemplo, `marine.do-not-return-to-water`, `marine.keep-people-and-dogs-away`,
`marine.observe-single-cetacean` y `marine.observe-multiple-cetaceans` tienen identidades
separadas y conservan sus textos actuales. Un cambio futuro de redacción o de clave de
catálogo no debe cambiar estos identificadores.

Las listas marinas `before`, `dont` y `actions` contienen ahora estas entradas.
`addUnique` comprueba únicamente `item.id === recommendation.id` mediante `some`
y añade la entrada solo cuando ese identificador aún no existe en la lista destino.
Así conserva la primera aparición, su texto y su posición, sin ordenar ni fusionar
secciones. Las precauciones iniciales iguales reutilizan sus respectivos IDs.
La acción final conserva el `push` que ya tenía; no se introduce deduplicación nueva
para esa operación. Al renderizar, se obtiene `item.text` y se mantiene el mismo
`join("\n")`, los mismos separadores y el mismo cierre estructurado.

La condición `moreAnimals` se evalúa en el mismo lugar y selecciona una entrada
con ID distinto para singular o plural. El resto de condiciones, combinaciones de
especie/señales/posición/entorno, prioridades y orden permanece intacto. No se cambian
los catálogos ni el literal de personas/perros que sigue compartido con el protocolo
de animales marinos muertos. Solo se envuelve ese literal en una entrada identificada.

No queda deduplicación marina basada en textos españoles: todas las llamadas a
`addUnique` usan entradas identificadas. No quedan casos pendientes de conversión.
La firma y las salidas públicas de `getAdvice`, las FAQ y la composición estructurada
no cambian. Tampoco se modifican protocolos terrestres, crías, atrapamiento, muertos,
ubicación, resúmenes, historial, mensajes compartidos, rutas, SEO o configuración Android.

Comprobaciones ejecutadas exclusivamente: TypeScript (`--noEmit --incremental false`)
y `node tests/i18n-assistant.cjs --protocols-only`, ambas correctas. Los 28.394 casos
son exactamente idénticos a `protocols-before-i18n-2g.json`; referencia y SHA-256
original intactos. El nuevo adaptador `tests/helpers/marine-deduplication-2y.cjs`
revierte en memoria solo las envolturas ID/texto, tipos, lectura de texto y el cuerpo
de `addUnique` antes de los adaptadores históricos 2X/2W para comparar hashes originales.
Comprueba las asociaciones ID/expresión, sus 46 apariciones y su ubicación autorizada.
No modifica el código ejecutado al comparar las recomendaciones reales, ni actualiza
hashes, salidas esperadas o referencias históricas.

Archivos afectados: `components/sos/SosAssistant.tsx`, nuevo `utils/marineAdvice.ts`,
`tests/i18n-assistant.cjs`, nuevo `tests/helpers/marine-deduplication-2y.cjs` y este README.
Sin ESLint, builds ni otras pruebas. Inglés, selector y redirecciones desactivados.
Sin commit, push ni despliegue.

## Fase 2Z: estado de ubicación y compatibilidad histórica

Inventario: el centinela `Ubicación no capturada todavía.` inicializaba el campo
`locationText` del asistente y se comparaba en el fallback del historial. El prefijo
`Mapa:` aparece en la composición de una línea del asistente y dos líneas del historial;
solo la vista previa del asistente lo usaba para tomar una decisión (`startsWith`).
Las otras apariciones en pruebas y adaptadores históricos se conservan como referencia.

`utils/rescueLocation.ts` introduce `StoredLocationValue`: `notCaptured` o `text`,
con el texto original intacto. El asistente mantiene ese valor tipado en memoria y lo
convierte al campo existente `locationText` al preparar los datos que ya guardaba.
No se añade un campo persistido ni se cambian esquemas, claves o servicios. El booleano
`locationCaptured`, `coords` y `approximateLocation` permanecen independientes, con las
mismas inicializaciones, actualizaciones y precedencias; no se reinterpretan estados
históricos incoherentes ni se infieren coordenadas a partir de cadenas.

`readStoredLocationText` es el único punto que reconoce el centinela español histórico.
Valores ausentes o el centinela exacto producen `notCaptured`; cualquier otro texto,
incluidos vacíos, espacios, direcciones o antiguos textos con enlaces, se conserva tal
cual. `writeStoredLocationText` devuelve ese mismo texto o el centinela reservado para
`notCaptured`, manteniendo la representación persistida anterior. El centinela es un
token fijo del formato heredado, no una etiqueta traducible. No se migra ni reescribe
ningún registro al cargarlo. No hay riesgo nuevo de pérdida de datos por una migración.

El historial conserva su normalización previa con `normalizeUsefulText` antes de leer
el valor: sigue omitiendo vacíos y el centinela con espacios externos, y mostrando
los demás textos con el mismo recorte previo. Solo decide ahora mediante `kind`.
Las ubicaciones aproximadas, coordenadas y enlaces del historial no se modifican.

Las líneas de ubicación del asistente incorporan los tipos estables `reference`,
`coordinates` y `map`. La vista previa identifica el mapa por `kind === "map"`,
sin inspeccionar la etiqueta española. Se mantienen literalmente sus textos, claves
React basadas en la línea original, orden, estilos, seis decimales de coordenadas y
URL con los valores originales. Al llamar al generador de mensajes compartidos se
obtienen únicamente los textos con `map(line => line.text)`; ese generador no cambia.
Los prefijos españoles que siguen presentes son presentación, sin comparaciones.
No se traducen direcciones, respuestas de geocodificación ni URL.

Dependencia textual deliberadamente conservada: el adaptador de almacenamiento debe
seguir reconociendo el centinela original para leer avisos anteriores. Eliminar ese
reconocimiento exigiría definir y autorizar una migración o un formato versionado;
queda fuera de esta fase. Un texto histórico idéntico al centinela sigue teniendo
el mismo significado reservado que antes. No se intentan interpretar cadenas `Mapa:`
almacenadas como coordenadas ni cambiar su tratamiento. La presentación futura debe
usar los identificadores, manteniendo fijo el token del formato persistido.

Comprobaciones ejecutadas exclusivamente: TypeScript (`--noEmit --incremental false`)
y `node tests/i18n-assistant.cjs --protocols-only`, ambas correctas. Los 28.394 casos
son idénticos a la referencia original, sin cambiarla ni su SHA-256. El comparador
revierte en memoria los cambios autorizados de ubicación mediante el nuevo adaptador
`tests/helpers/rescue-location-2z.cjs` antes de comparar el hash completo del asistente
y el hash histórico del historial; no actualiza referencias ni cambia las salidas
reales que se ejecutan. Los protocolos y su hash original no cambian en esta fase.
No se ejecutan comprobaciones de interfaz, recuperación real, ESLint, builds ni
otras suites; la compatibilidad se implementa sin modificar el formato de los datos.

Archivos afectados: `components/sos/SosAssistant.tsx`, `app/history.tsx`, nuevo
`utils/rescueLocation.ts`, `tests/i18n-assistant.cjs`, nuevo
`tests/helpers/rescue-location-2z.cjs` y este README. Protocolos, composición,
deduplicación, almacenamiento, rutas, SEO y configuración Android sin cambios.
Inglés, selector y redirecciones desactivados. Sin commit, push ni despliegue.

## Fase 2AA: resúmenes, copia y mensajes compartidos

Se extraen 118 claves españolas a `catalogs/rescue-summary.es.ts`, incorporadas al
catálogo tipado `es.ts`, mediante 134 sustituciones en los tres consumidores:

- 14 claves del mensaje compartido: título, situación, información adicional,
  atribución, introducción (prefijo/sufijo), etiquetas de estado, tipo, posición,
  entorno, lugar heredado y señales; disponibilidad de foto/vídeo.
- 62 etiquetas del historial: 13 tipos de animal, 2 estados, 9 lugares heredados,
  10 posiciones, 11 entornos y 17 flags. Permanecen separadas las variantes propias
  del historial, sin normalizarlas a la redacción del asistente.
- 11 claves de presentación del resumen histórico, fecha no disponible, ausencia de
  incidencias y confirmaciones de copia; 3 prefijos comunes de ubicación.
- 15 claves de vista previa y valores alternativos del asistente; 13 fragmentos de
  las instrucciones para revisar, enviar, copiar, buscar ayuda y finalizar.

Los catálogos se importan explícitamente en español. Los códigos de animales,
estados, flags, lugares, posiciones y entornos, el orden de sus mapas/opciones y
las condiciones de selección no cambian. Solo se extraen valores visibles.
Los encabezados y prefijos se insertan en las mismas plantillas; quedan intactas
las expresiones de datos, filtros de líneas, orden, espacios, `join`, puntuación,
líneas vacías y saltos. El texto JSX extraído conserva el valor literal que producía
TypeScript al compilar cada fragmento, incluidas las separaciones junto al texto en
negrita. No cambian los elementos, estilos ni condiciones de presentación.

La copia del asistente sigue utilizando `generatedSummary`; el historial sigue
llamando a `buildCaseSummary`. WhatsApp continúa codificando el mismo resumen con
`encodeURIComponent`, con los mismos números, URL, parámetros y alternativas de
apertura. Los números, enlaces, coordenadas y datos geográficos no pasan al catálogo.
La marca SOS Fauna España y los nombres GREFA Madrid y WhatsApp conservan su valor.
No se modifica la lógica de envío ni se abre ninguna aplicación externa en esta fase.

Compatibilidad: las claves de flags, incluido `canNotMove`, permanecen intactas.
El asistente conserva la selección de señales visibles seguida de las heredadas,
con las mismas etiquetas contextuales y orden. El historial conserva su lista de 17
flags y su política anterior de representación, aunque difiera de las opciones del
asistente. No se alteran avisos guardados, servicios, esquema o claves de almacenamiento.
El adaptador del centinela histórico de ubicación, las precedencias de coordenadas,
referencias aproximadas y lugar antiguo, así como los recortes existentes, no cambian.

Dependencias pendientes antes de generar resúmenes en inglés:

- Las etiquetas de opciones de animal, estado, lugar y señales contextuales del
  asistente se comparten con controles y, en determinados casos, claves React basadas
  en la etiqueta. No se extraen ahora estas etiquetas pendientes: hay que estabilizar
  primero esas claves sin alterar recuperación o selección. Las etiquetas de posición
  y entorno ya extraídas en 2H siguen usando su catálogo anterior.
- `lowercaseFirst` conserva `toLocaleLowerCase("es-ES")`; el historial conserva
  `Intl.DateTimeFormat("es-ES")`. No se cambia gramática, concordancia ni formato de fecha.
  La generación inglesa necesitará recibir un idioma efectivo coherente junto con las
  etiquetas, elegir la capitalización y validar las plantillas completas. Los prefijos
  y sufijos se extraen ahora para preservar la composición española existente.
- Las claves React basadas en textos de etiquetas o líneas se mantienen intactas;
  su sustitución por códigos estables requiere una fase específica.
- Las acciones y confirmaciones generales de eliminar/vaciar historial, su cabecera,
  estados de carga/vacío y SEO permanecen fuera de este alcance de resúmenes y copia.
  Los textos de copiar/WhatsApp ya extraídos a `assistantUi` siguen en ese catálogo.
- El centinela español de ubicación sigue siendo un token de compatibilidad en
  `rescueLocation.ts`, no una traducción ni una etiqueta nueva de los mensajes.

Comprobaciones ejecutadas exclusivamente: TypeScript (`--noEmit --incremental false`)
y `node tests/i18n-assistant.cjs --protocols-only`, correctos. Los 28.394 casos siguen
siendo exactamente iguales a la referencia original 2G; referencia y SHA-256 intactos.
El comparador verifica además los 118 valores españoles extraídos y revierte solo
las sustituciones autorizadas de resumen antes de comprobar los hashes históricos
del asistente, historial y generador compartido. La referencia de protocolos no se
recaptura. El nuevo adaptador `tests/helpers/rescue-summary-2aa.cjs` fija el alcance y
las cantidades de sustituciones, sin reemplazar el código ejecutado para protocolos.
No se ejecutan suites adicionales, comprobaciones de interfaz, ESLint ni builds.

Archivos afectados: `components/sos/SosAssistant.tsx`, `app/history.tsx`,
`utils/rescueShareMessage.ts`, nuevo `i18n/catalogs/rescue-summary.es.ts`,
`i18n/catalogs/es.ts`, `tests/i18n-assistant.cjs`, nuevo
`tests/helpers/rescue-summary-2aa.cjs` y este README.
Protocolos, `getAdvice`, composición estructurada y deduplicación sin cambios.
Rutas, SEO, configuración Android y publicación intactos. Inglés, selector y
redirecciones desactivados. Sin commit, push ni despliegue.

## Fase 2AC: interfaz pendiente de historial, captura y auxiliares

Se extraen 54 claves a `catalogs/interface-pending.es.ts`, organizadas en cinco áreas
españolas tipadas e incorporadas a `catalogs/es.ts`:

- `historyUi` (17): título visible y de navegación, descripción, carga, estado vacío,
  volver, eliminar, vaciar historial, cancelar y confirmaciones.
- `assistantCaptureUi` (24): permisos, errores, captura y estado de ubicación, textos
  de presentación del mapa, permisos/errores de galería y fragmentos de foto/vídeo.
- `versionGateUi` (4): aviso de versión nueva y sus dos acciones.
- `notFoundUi` (6): contenido de la página 404, título de navegación y accesibilidad
  del botón de regreso.
- `guidePreparationUi` (3): preparación de guía, error y botón de regreso.

Los módulos importan explícitamente el catálogo español. Los fragmentos JSX conservan
exactamente los valores de texto que emitía TypeScript, incluidos espacios entre
líneas del código fuente. No se cambian componentes, estilos, condiciones, callbacks,
permisos solicitados ni tratamiento de multimedia. Los mensajes de galería conservan
la plantilla prefijo + `label` + sufijo; `label` se usa únicamente como texto, nunca
como identificador o condición. Se mantienen sus fragmentos `la foto` y `el vídeo`,
con artículos y espacios literales, y los mismos puntos de interpolación.

Permanecen intactos rutas, botones de navegación en cuanto a acción, códigos internos,
claves de almacenamiento, fechas, coordenadas, geocodificación y enlaces de mapas.
El historial mantiene sus IDs y procedimientos de eliminar/vaciar, sin cambios en
avisos ni compatibilidad histórica. AppVersionGate mantiene todos sus centinelas,
claves, intervalos y comprobaciones de versión. La guía conserva parámetros, clave
React de recuperación y estados de preparación/error.

Se conservan expresamente los títulos/descripciones y demás propiedades de `SeoHead`
y `NoIndexHead`. Solo se extraen los títulos visibles de `Stack.Screen` del historial
y 404, sin alterar sus valores. Marca, código 404, iconos y símbolos de desplegar no
se convierten en datos traducibles nuevos.

Pendientes por alcance o dependencia:

- Las etiquetas contextuales y claves React basadas en texto del asistente siguen
  intactas. No se modifican generadores, FAQ dinámicas, búsqueda, resúmenes ni
  deduplicación; las instrucciones de finalización vinculadas al resumen de animales
  muertos tampoco se abordan aquí.
- El centinela histórico de ubicación y las claves internas de actualización conservan
  su representación de almacenamiento, sin convertirlas en etiquetas traducibles.
- Los metadatos SEO y los títulos restantes de otras pantallas requieren una fase
  específica. El fallback `desconocida` de AppVersionFooter no se modifica: esta fase
  incluye AppVersionGate, no cambia el contrato de versión compartido.
- Antes de traducir, las áreas nuevas tendrán que resolverse según el idioma efectivo.
  La composición de mensajes de galería necesitará revisión gramatical, manteniendo
  el español actual; no se introduce ahora interpolación ni lógica nueva.

Comprobaciones ejecutadas exclusivamente: TypeScript (`--noEmit --incremental false`)
y `node tests/i18n-assistant.cjs --protocols-only`, ambos correctos. Los 28.394 casos
son exactamente iguales a la referencia original 2G, sin modificarla ni su SHA-256.
El comparador también comprueba los 54 valores españoles fijados al extraer y
revierte en memoria solo las sustituciones de interfaz autorizadas antes de los
adaptadores de fases anteriores para los hashes históricos de asistente, historial
y preparación de guía. No se actualizan referencias o hashes esperados.
Las sustituciones y sus cantidades quedan delimitadas en el nuevo adaptador
`tests/helpers/interface-copy-2ac.cjs`. No se ejecutan comprobaciones de interfaz,
ESLint, builds ni otras suites.

Archivos afectados: `app/history.tsx`, `components/sos/SosAssistant.tsx`,
`components/AppVersionGate.tsx`, `app/+not-found.tsx`, `app/aviso.tsx`, nuevo
`i18n/catalogs/interface-pending.es.ts`, `i18n/catalogs/es.ts`,
`tests/i18n-assistant.cjs`, nuevo `tests/helpers/interface-copy-2ac.cjs` y este README.
Sin cambios en protocolos, publicación ni configuración Android. Inglés, selector
y redirecciones desactivados. Sin commit, push ni despliegue.

## Fase 2AD: señales, encabezados, instrucciones y FAQ dinámicas

Se extraen 63 claves a `catalogs/recommendation-fragments.es.ts`, incorporadas al
catálogo español tipado, mediante 162 sustituciones (135 en el asistente y 27 en FAQ):

- `observedSigns`: las 13 descripciones generadas por `getObservedSigns`.
- `rescueHeadings`: 13 variantes literales de encabezados, incluidos sus emojis,
  separadores y saltos anteriores/finales. Variantes con distinto espacio o número
  de saltos mantienen claves distintas; las idénticas reutilizan una misma clave.
- `rescueInstructions`: 20 instrucciones restantes de manipulación, observación,
  retorno a señales, seguridad y respuesta específica del vencejo.
- `dynamicFaqGrammar`: 11 formas españolas de lesión, varamiento, enredo y debilidad,
  conservando exactamente sus ternarios de género y plural.
- `dynamicFaqCopy`: las dos respuestas marinas fijas, prefijo/sufijo de la respuesta
  marina interpolada y prefijo/sufijo de la pregunta construida con el nombre animal.

Las sustituciones son únicamente lecturas del catálogo español. No cambian las
condiciones de `getObservedSigns`, su parámetro `includeCannotFly`, orden, concatenaciones
ni `join("\n")`. Tampoco se cambian los códigos, IDs, condiciones, prioridades de
`getAdvice`, retornos, composición estructurada o mecanismo de deduplicación marina.
La frase de personas/perros en `addMarineFlagAdvice` pasa al catálogo manteniendo el
mismo ID `marine.keep-people-and-dogs-away`; `addUnique` no se modifica.

Se conservan íntegramente las advertencias sobre no coger/capturar/manipular/trasladar
serpientes incluso si se cree reconocer la especie, no manipular fauna innecesariamente,
protegerse de animales grandes y mantener personas/perros alejados sin asumir riesgos.
La respuesta del vencejo conserva su instrucción específica de protección, no dar
comida/agua sin indicación, caja ventilada y consulta especializada. No se normalizan
variantes masculinas/femeninas ni frases que difieren solo por un salto final.

Las respuestas marinas de FAQ conservan `grammaticalGender === "feminine"`, la
excepción plural de `sharkRay`, las ramas `seal`/`otherMarine` y la precedencia
`faqDisplayNameWithArticle ?? displayNameWithArticle`. La respuesta interpolada
mantiene los mismos espacios, comas y orden de adjetivos. La pregunta dinámica conserva
la interpolación del nombre con artículo y su signo de interrogación. Los nombres,
IDs, categorías, selección de resultados, reglas de intención y buscador no cambian.

No queda una construcción sin extraer por riesgo dentro de estos textos seleccionados.
Sí queda pendiente la adaptación gramatical al inglés: artículos y nombres localizados,
concordancias y plantillas completas tendrán que resolverse por idioma sin trasladar
las reglas españolas literalmente. Los fragmentos españoles centralizados no constituyen
por sí solos esa adaptación. Los marcadores de género, códigos e identificadores
permanecen como valores internos. Espacios, comas y separadores técnicos que no son
contenido lingüístico siguen en el código.

Comprobaciones finales ejecutadas exclusivamente: TypeScript (`--noEmit --incremental
false`) correcto y `node tests/i18n-assistant.cjs --protocols-only` correcto. Los 28.394
casos son exactamente iguales a la referencia original 2G, sin modificarla ni su SHA-256.
El comparador también verifica los 63 valores españoles fijados en la extracción y
revierte solo las sustituciones autorizadas, antes de los adaptadores anteriores, al
comparar hashes históricos de protocolos, programa completo y consumidor FAQ.
No se recapturan salidas ni se actualizan hashes esperados.

El nuevo adaptador es `tests/helpers/recommendation-copy-2ad.cjs`. El harness histórico
`tests/faq-regression.cjs` admite únicamente el nuevo import puro; no se cambian sus
referencias ni se ejecuta la suite FAQ en esta fase. No se ejecutan ESLint, builds,
comprobaciones de interfaz u otras pruebas.

Archivos afectados: `components/sos/SosAssistant.tsx`, `components/faq/FaqPage.tsx`,
nuevo `i18n/catalogs/recommendation-fragments.es.ts`, `i18n/catalogs/es.ts`,
`tests/i18n-assistant.cjs`, `tests/faq-regression.cjs`, nuevo
`tests/helpers/recommendation-copy-2ad.cjs` y este README. Sin cambios en búsqueda,
almacenamiento, resúmenes, rutas, SEO, configuración Android o publicación.
Inglés, selector y redirecciones desactivados. Sin commit, push ni despliegue.

## Fase 2AE: resolución tipada de catálogos por idioma

`translate.ts` incorpora `getCatalog(locale)` y `getEffectiveCatalog(requested?,
platform?)`. El primero resuelve un catálogo completo tipado; el segundo aplica antes
la política de idioma efectivo de `effectiveLocale.ts`. Esta política es pura: no
lee navegador, almacenamiento ni estado global mutable. Con `englishPublished: false`
resuelve siempre `es`, incluso si se solicita `en`; en plataforma nativa siempre
resuelve `es`. El proveedor utiliza la misma política, conservando su API `{locale,t}`
y las mismas condiciones de publicación. No se activan rutas ni preferencias nuevas.

Los catálogos resueltos se reutilizan por idioma. Español devuelve el catálogo fuente;
las áreas inglesas ausentes reutilizan el objeto español y solo las áreas parcialmente
traducidas se componen una vez. Los tipos son de solo lectura. No se reconstruyen mapas
por cada render ni se añaden estados, efectos, claves de componentes o persistencia.
`translate` y `createTranslator` conservan sus contratos y resuelven a través del mismo
catálogo. Por ello las páginas informativas, portada y otros componentes que ya usan
`t` quedan conectados sin cambios de archivos ni de presentación.

Fallback explícito: cada clave inglesa ausente o nula utiliza su valor español.
`resolveTranslation(locale, area, key)` permite consultar `value`, `requestedLocale`,
`sourceLocale` y `usedFallback`, sin avisos en consola ni efectos de interfaz. El
catálogo `en.ts` no se modifica: conserva exclusivamente las etiquetas técnicas de
idioma anteriores. No se generan traducciones provisionales ni copias españolas
presentadas como traducciones inglesas. `getCatalog("en")` sirve para preparar y
examinar el contenido; los consumidores de interfaz usan la variante efectiva bloqueada.

Se sustituyen importaciones directas de los catálogos españoles generales de interfaz
y resúmenes por el resolver en seis consumidores: asistente, historial, preparación de
guía, página 404, AppVersionGate y utilidad de mensajes compartidos. En los componentes
se utiliza `locale` del proveedor y se obtiene el objeto estable mediante
`getEffectiveCatalog(locale)`. En el asistente solo cambian las áreas generales de
interfaz, captura, galería, vista previa e instrucciones del resumen, sin tocar los
catálogos de protocolos ni sus decisiones.

Límite deliberado de esta fase: los mapas de etiquetas del historial y funciones puras
que componen ubicación, fecha y mensajes conservan el catálogo efectivo por defecto al
cargar el módulo. Ese valor es español y no depende del idioma del navegador ni de una
variable global de sesión. Su acceso ya está centralizado y tipado, pero NO está
preparado para cambiar dinámicamente con una ruta inglesa. Antes de publicar inglés
habrá que pasar el idioma por llamada o introducir fábricas estables por idioma,
conservando las funciones públicas actuales como entrada española compatible. No se
recrean ahora esos mapas ni se refactoriza la composición para anticipar esa fase.
`buildRescueShareMessage`, las funciones de compartir y todos los componentes mantienen
sus firmas y contratos existentes. La capitalización y fecha españolas permanecen.

Consumidores pendientes de conectar al idioma efectivo:

- Protocolos, `getObservedSigns`, cierre, suplementos y fragmentos de recomendaciones:
  mantienen sus importaciones españolas explícitas. No se cambian condiciones,
  prioridades, composición ni deduplicación marina.
- FAQ estáticas y temáticas (`faq.ts`, `faqTopics.ts`), respuestas dinámicas, categorías,
  nombres/alias animales, concordancias y búsqueda por idioma.
- Opciones del asistente, etiquetas contextuales y claves React pendientes.
- Centros: callbacks de etiquetas nacionales/tipos de recurso con traductor español
  fijo y notas descriptivas de contactos. Datos oficiales/geográficos intactos.
- Propagación explícita de idioma a mapas y constructores puros de resúmenes, descrita
  arriba, y las utilidades de compartir que conservan `DEFAULT_LOCALE`.
- Navegación localizada, SEO y selección automática siguen fuera de esta fase.

Comprobaciones ejecutadas exclusivamente: TypeScript (`--noEmit --incremental false`)
y `node tests/i18n-assistant.cjs --protocols-only`, ambas correctas. Los 28.394 casos
siguen siendo idénticos a la referencia original y su SHA-256 no cambia. El comparador
comprueba también reutilización de catálogos, bloqueo inglés efectivo en web/nativo
y procedencia española del fallback, dentro de la misma comprobación existente.
El adaptador nuevo `tests/helpers/locale-binding-2ae.cjs` revierte solo las vinculaciones
autorizadas antes de los adaptadores anteriores para los hashes históricos; las salidas
comparadas ejecutan código y catálogos actuales. No se actualizan referencias o hashes.
No se ejecutan ESLint, builds, suites de interfaz ni otras pruebas.

Archivos afectados: `i18n/translate.ts`, nuevo `i18n/effectiveLocale.ts`,
`i18n/I18nProvider.tsx`, `components/sos/SosAssistant.tsx`, `app/history.tsx`,
`app/aviso.tsx`, `app/+not-found.tsx`, `components/AppVersionGate.tsx`,
`utils/rescueShareMessage.ts`, `tests/i18n-assistant.cjs`, nuevo
`tests/helpers/locale-binding-2ae.cjs` y este README. Catálogos de contenido, datos,
identificadores, almacenamiento, multimedia, URL, rutas, SEO, Android y publicación
sin cambios. Inglés, selector y redirecciones desactivados. Sin commit, push ni despliegue.

## Fase 2AF: protocolos con catálogo efectivo por llamada

Se eliminan las 15 importaciones directas de catálogos españoles de recomendaciones
del asistente. Todas sus lecturas pasan por un parámetro tipado `protocolTexts: Catalog`,
resuelto mediante `getEffectiveCatalog` de `translate.ts`, que aplica la política de
`effectiveLocale.ts`. El mismo objeto estable se propaga a los generadores, señales,
suplementos y ramas marinas de una llamada; no se introduce idioma global mutable,
estado React, caché de avisos ni datos nuevos persistidos.

Funciones conectadas: los siete generadores terrestres/desconocido (smallBird,
largeBird, bat, smallMammal, largeMammal, reptileAmphibian y unknown), el generador de
los seis tipos marinos, `getBabyAdvice`, `getTrappedAdvice`,
`getDeadMarineAnimalAdvice`, la rama terrestre de animales muertos,
`getObservedSigns`, `addSupplementalAdvice` y `addMarineFlagAdvice`.
Los 15 puntos de entrada internos reciben el catálogo, incluidos el despachador y
los helpers. Las llamadas que antes omitían `includeCannotFly` conservan su valor
predeterminado `false` al propagar el catálogo.

Catálogos/áreas conectados: small-bird, large-bird, bat, small-mammal, large-mammal,
reptile-amphibian, unknown-animal, marine-animal, marine-flags, rescue-shared, baby,
trapped, dead, supplemental y recommendation-fragments. Este último aporta encabezados,
instrucciones y descripciones de señales; las áreas de FAQ contenidas en ese archivo
no se utilizan ni se conectan a otro idioma en esta fase.

Contratos públicos existentes conservados:

- `getAdvice(state, type, flags, position?, environment?)` mantiene su firma y devuelve
  la cadena española compatible mediante `getAdviceParts` y `formatAdvice`.
- `getAdviceParts` mantiene su firma y sus bloques, con adaptador español por defecto.
- `COMMON_END` conserva la exportación y el valor español por defecto, ahora resuelto
  por la misma API. Dentro de los generadores, una constante local de cierre obtiene
  el texto del catálogo recibido; los alias, separadores y composición siguen iguales.

Nuevas entradas explícitas: `getAdviceForLocale(locale, ...)` y
`getAdvicePartsForLocale(locale, ...)`. La segunda resuelve el catálogo una vez y lo
pasa al despachador privado `getAdvicePartsWithTexts`; la primera solo renderiza esos
bloques. La vista del asistente usa la entrada con `locale` del proveedor en su memo
actual. Solo se añade esa dependencia al cálculo; no cambian keys, estado, montaje,
referencias de fotografías/vídeos, almacenamiento o recuperación de avisos.

La selección de recomendaciones sigue exactamente las mismas condiciones y prioridades.
No se cambia `addUnique`, ningún ID marino, orden, advertencia, concatenación, delimitador
ni la composición de cuerpo/suplementos/cierre. Los códigos e identificadores no pasan
por traducción. Todas las advertencias, incluidas serpientes y seguridad marina,
conservan literalmente el texto español.

Estado de preparación y pendientes:

- No quedan generadores de recomendaciones pendientes de propagar el catálogo: las
  ramas vivas, crías, atrapamiento, muertos, señales y suplementos están conectadas.
- Inglés sigue bloqueado por `englishPublished: false`; solicitar `en` a las nuevas
  entradas también resuelve español. No se añaden traducciones provisionales a `en.ts`.
- Los consumidores existentes que llaman a `getAdvice` o `getAdviceParts`, incluida FAQ,
  continúan usando español. Cuando se autorice inglés en esos consumidores deberán
  utilizar la entrada explícita correspondiente, sin cambiar la búsqueda o gramática
  en esta fase. El `COMMON_END` exportado permanece una compatibilidad española;
  cualquier consumidor futuro localizado debe usar los bloques y su cierre recibido.
- Opciones y etiquetas contextuales del asistente, lectura en voz alta `es-ES`, FAQ,
  búsqueda, centros, resúmenes, historial, rutas y SEO siguen fuera de este alcance.
  `assistant-options.es` es la importación española restante del asistente y no forma
  parte de los generadores de recomendaciones.
- Antes de publicar traducciones se requerirá completar y revisar los catálogos ingleses,
  incluidos advertencias y saltos, y la cobertura lingüística para evitar fallback
  visible. No se introduce esa traducción ni se cambia la política de Android.

Comprobaciones finales ejecutadas exclusivamente: TypeScript (`--noEmit --incremental
false`) correcto y `node tests/i18n-assistant.cjs --protocols-only` correcto. Los 28.394
casos conservan las mismas salidas originales; dentro de esos mismos casos se comprueba
la igualdad de las nuevas entradas explícitas `es` y `en` bloqueado con la entrada
compatible. Referencia 2G y SHA-256 originales intactos, sin recapturas ni actualización.
El adaptador `tests/helpers/protocol-locale-2af.cjs` revierte solo el paso de catálogo,
los cierres locales y los adaptadores autorizados para comparar los hashes históricos;
las salidas ejecutadas usan los generadores y catálogos reales.

El harness `tests/faq-regression.cjs` solo amplía su lista de imports puros admitidos
al resolver y los tipos/idioma predeterminado. No se modifica código o contenido FAQ,
su búsqueda, sus referencias, ni se ejecuta esa suite. Sin ESLint, builds u otras pruebas.

Archivos afectados: `components/sos/SosAssistant.tsx`, `tests/i18n-assistant.cjs`,
`tests/faq-regression.cjs`, nuevo `tests/helpers/protocol-locale-2af.cjs` y este README.
Resolver, catálogos de contenido, almacenamiento, rutas, SEO, Android y publicación
sin cambios. Inglés, selector y redirecciones desactivados. Sin commit, push ni despliegue.

## Fase 2AG: FAQ y búsqueda con idioma explícito

Las páginas general y temáticas utilizan `getFaqItemsForLocale(locale)` y
`getFaqTopicsForLocale(locale)`. El contenido de `faqContent`, `faqTopics` y los
fragmentos de respuestas dinámicas se obtiene mediante `getEffectiveCatalog`.
Las respuestas dinámicas usan `getAdvicePartsForLocale` sin modificar protocolos.
Las 92 preguntas base mantienen IDs, textos, keywords y orden españoles; los
consumidores antiguos de `faqItems`, `faqTopics` y las funciones de búsqueda
conservan sus contratos y español por defecto.

`getFaqSearchEngine(locale)` y `getAnimalSearchEngine(locale)` encapsulan los
índices, cachés y funciones actuales. Se reutilizan por idioma de origen del
vocabulario, sin recrearlos en cada render. El perfil de `faqSearchVocabulary`
contiene las mismas stopwords, términos genéricos e intenciones de vencejos y
murciélagos. Solo existe perfil `es`: una petición `en` selecciona explícitamente
ese perfil (`locale: "es"`) y el conjunto español de animales/FAQ. Además continúa
el bloqueo de publicación del resolver. No hay vocabulario ni traducciones
provisionales inglesas.

Las siete categorías disponen de IDs estables y etiquetas tipadas separadas en
`faq-categories.es.ts`. La agrupación, claves y offsets de categorías usan IDs;
`FaqItem.category` conserva los valores heredados por compatibilidad pública.
`getFaqCategoryId` es el puente de esos valores al ID. Las etiquetas se resuelven
por separado y la búsqueda indexa la misma etiqueta española. Los animales
conservan sus IDs, categorías de protocolo, nombres, artículos, género, alias y
orden actuales. Su selección sigue basada en IDs, no en traducciones; no cambian
las prioridades de «Antes de actuar», enlaces o conexión con la guía.

Pendientes antes de habilitar inglés:

- Traducir nombres, artículos, género y alias por los mismos IDs de animales;
  proporcionar el conjunto inglés completo mediante `getAnimalCatalogForLocale`.
- Proporcionar perfiles de keywords y grupos semánticos equivalentes a los de
  `faqSearchKeywords.ts` y `faq.ts`, además del vocabulario de intenciones,
  stopwords y términos genéricos. No basta con añadir `locale: "en"` al perfil:
  deben estar disponibles también sus datos, etiquetas e índices correspondientes.
- Adaptar las plantillas gramaticales dinámicas: artículos/género, concordancias,
  nombres de animales y ramas específicas de vencejo y fauna marina. Se conectan
  al resolver, conservando por ahora exactamente la gramática española.
- Antes de permitir cambios de idioma en caliente, revisar la selección existente
  de animales por ID contra el nuevo conjunto. Hoy ambos idiomas solicitados
  comparten los mismos datos españoles y no se remonta el componente.
- Preparar SEO y rutas inglesas en su fase autorizada. Títulos, descripciones,
  paths, datos estructurados y render completo de preguntas no cambian aquí.

Comprobaciones autorizadas: TypeScript y comparación exacta de los 28.394 casos
originales de protocolos. La referencia 2G y su SHA-256 no se regeneran ni modifican.
No se ejecuta una comparación específica de búsquedas ni de las 92 respuestas FAQ:
se conservan vocabulario, reglas, pesos y orden en el código, pero no se afirma
una equivalencia comprobada de resultados de búsqueda. Sin ESLint, builds ni
otras suites. El harness FAQ solo adapta imports y observación del motor por
idioma para su ejecución futura; no se cambian sus referencias históricas.
El adaptador `faq-locale-2ag.cjs` revierte exclusivamente los enlaces de idioma
para comprobar el hash histórico del consumidor protegido, manteniendo la
comparación real de salidas de protocolos.

Archivos de esta fase: `data/faq.ts`, `data/faqTopics.ts`,
`data/animalSearchCatalog.ts`, nuevos `data/faqCategories.ts` y
`data/faqSearchVocabulary.ts`, `utils/faqSearch.ts`,
`components/faq/FaqPage.tsx`, `components/faq/TopicFaqPage.tsx`,
`i18n/catalogs/es.ts`, nuevo `i18n/catalogs/faq-categories.es.ts`,
`tests/i18n-assistant.cjs`, nuevo `tests/helpers/faq-locale-2ag.cjs`,
`tests/faq-regression.cjs` y este README.
Español sigue forzado; inglés, selector y redirecciones desactivados.
Sin commit, push ni despliegue.

Resultado final de las dos comprobaciones: correctas. Los 28.394 casos son
idénticos a la referencia; SHA-256 original verificado:
`8dde12dc68da520dd7db874c21be707bc41609d3fd995b8435bd5d0e4bec18e0`.

## Fase 2AH: verificación de búsqueda y resolución del directorio

Comprobación específica reproducible: `node tests/i18n-faq-search.cjs`.
No ejecuta la suite completa FAQ, exportaciones ni navegador. El harness existente
acepta fuentes de módulo/página alternativas únicamente para ejecutar el código
anterior en memoria; no se modifica la aplicación FAQ ni sus reglas.

Referencias y límites:

- Los motores originales se leen del commit
  `a18d2f656b81fdf240b56d7ec4509f6765fb40b8`, con hashes normalizados verificados
  contra los ficheros conservados antes de 2AG. Esos originales coinciden con los
  hashes de motores de `faq-before-seo.json` al respetar sus finales de línea.
- El consumidor y los datos anteriores a 2AG se reconstruyen revirtiendo solamente
  los enlaces/fábricas autorizados de esa fase. Se autentican con los SHA-256 de
  las copias independientes de `.expo/i18n-2ag/` conservadas antes de los cambios.
  La prueba no necesita esas copias temporales para ejecutarse de nuevo.
- Se comparan los 49 escenarios anteriores (selección, cambio de especie, alias,
  limpieza, categorías, relevancia, orden y respuestas dinámicas) y 542 variantes
  de consultas/alias en los índices general, vencejos y murciélagos. Coinciden
  exactamente antes/después de 2AG; también los adaptadores españoles y el motor
  FAQ explícito `es`/`en` con fallback español. Las 92 entradas base coinciden.
  Solo se omiten dos propiedades nuevas de metadatos (`categoryId/categoryLabel`)
  al comparar el objeto de respuesta visible con su forma heredada.
- Frente a la referencia más antigua `faq-before-seo.json`, la selección de
  animales, sugerencias y categorías coincide en los 49 escenarios. Coinciden
  completos 46; difieren tres (`ave que no vuela`, `murciélago no vuela`, `tortuga`)
  también al ejecutar el consumidor anterior a 2AG. Aquella referencia precede a
  las advertencias sobre serpientes incorporadas a ocho respuestas indexadas.
  No se afirma equivalencia total con esa referencia antigua ni se retocan las
  recomendaciones, reglas o referencias para forzarla.
- No se verifican todas las combinaciones posibles de consultas, interacción real
  en navegador ni inglés traducido. Las referencias históricas quedan intactas.

Directorio conectado:

- `RecoveryCentersContent` y `PublicRecoveryCenters.web` usan el idioma efectivo
  del proveedor para las etiquetas nacionales, tipos marinos y descripciones.
  Se conserva el catálogo `centers` ya existente, con sus instrucciones, filtros,
  accesibilidad y botones. No cambian estructura HTML, estilos, acordeones,
  normalización por provincia, ordenación ni criterios de selección.
- Nuevo `helpContactDescriptions`: 26 descripciones (cuatro nacionales, tres de
  Madrid, dos compartidas terrestres y 17 marinas) más encabezado de fuentes y
  aviso de independencia: 28 textos. Son copias literales españolas, sin inglés.
- `getHelpContactNote(domain, contact, locale = es)` aplica una capa de presentación
  tipada sobre registros oficiales sin mutarlos. Vincula cada texto por ámbito,
  nombre oficial y teléfono originales; estas identidades no se traducen. Los
  nombres decorados con iconos se mantienen aparte y no participan en la resolución.
  Los campos `note` originales se conservan como datos compatibles/fallback; no se
  usan sus frases para decidir qué traducción corresponde. Al actualizar un nombre
  oficial o teléfono, revisar su vínculo; un registro no reconocido conserva su nota.
- `getHelpContactsLegalNotice(locale = es)` resuelve encabezado/independencia,
  manteniendo exactamente fuentes, URL, separadores y saltos. La constante pública
  `HELP_CONTACTS_LEGAL_NOTICE` conserva el valor y contrato españoles anteriores.
  Se mantiene el aviso de independencia frente a administraciones, emergencias y
  policía. El directorio conserva su ámbito español y todos sus datos territoriales;
  no se añade ni reescribe contenido visible para ampliar ese ámbito.

Pendientes del directorio antes de publicar inglés:

- Separar notas mixtas como `Oleiros · Alternativo 686597745`, las de Brinzal y
  las que contienen ubicaciones, direcciones, extensiones o denominaciones oficiales.
  Por seguridad siguen usando el campo original; no se intenta traducir esos datos.
- Mantener intacta la denominación oficial de CRAS Madrid y la de la red cántabra,
  así como todos los nombres, provincias, teléfonos y URL que aparecen dentro de
  descripciones cuando se autorice su traducción. Los módulos oficiales
  `provinceContacts` y `marineHelpContacts` no se modifican.
- Revisar las composiciones gramaticales del contador (`contacto`/`s`/`telefónico`)
  al traducir; no se refactorizan ahora. Completar el aviso territorial inglés en
  la fase de publicación, conservando la advertencia de independencia.

Comprobaciones finales: TypeScript (`--noEmit --incremental false`) correcto;
28.394 salidas exactas de protocolos correctas y referencia/SHA-256 originales
intactos; comprobación específica de búsqueda correcta con los límites anteriores.
Sin ESLint, builds, navegador ni otras suites. No se prueba visualmente el directorio
en esta fase. Español sigue forzado, con fallback español para áreas no traducidas;
inglés, selector y redirecciones desactivados. Sin cambios de rutas, SEO, protocolos,
almacenamiento o configuración Android. Sin commit, push ni despliegue.

Archivos de esta fase: `components/contacts/RecoveryCentersPage.tsx`,
`components/contacts/PublicRecoveryCenters.web.tsx`, `data/helpContacts.ts`, nuevo
`data/helpContactText.ts`, `i18n/catalogs/es.ts`, nuevo
`i18n/catalogs/help-contact-descriptions.es.ts`, `tests/faq-regression.cjs`, nuevo
`tests/i18n-faq-search.cjs` y este README.

## Previsualización inglesa de las primeras seis páginas

Ejecutar manualmente `npm run web` y abrir el origen local que indique Expo
(normalmente `http://localhost:8081`). URLs preparadas a partir de `i18n/routes.ts`:
`/en/`, `/en/about`, `/en/sources`, `/en/contact`, `/en/privacy` y `/en/legal`.
No se ha iniciado el servidor ni ejecutado comprobaciones para este encargo.

La exportación estática de Expo incluiría cualquier página registrada bajo
`app/en/`. Para mantener estas vistas fuera de la publicación, no se crean esos
archivos: `+not-found` delega exclusivamente en desarrollo web (`__DEV__`) las seis
URL conocidas a `EnglishDevelopmentPreview`. Este componente reutiliza las seis
pantallas existentes. La importación de la vista está dentro de la rama de
 desarrollo, de modo que producción conserva el 404, sin rutas ni HTML ingleses
registrados. Se trata de un acceso de previsualización, no de páginas estáticas
publicables; el tratamiento HTTP de la URL continúa perteneciendo al fallback del
servidor de desarrollo. No se cambia el workflow, la exportación o el sitemap.

El proveedor admite `en` únicamente para estas seis URL en desarrollo web y usa
`createTranslator` con los catálogos británicos ya existentes. Rutas españolas y
Android conservan español. La política pública `englishPublished: false`, el
selector y las redirecciones no cambian. El atributo `lang` del documento se
sincroniza exclusivamente en desarrollo web.

`useInformationPagePath` mantiene en inglés los enlaces entre las seis páginas.
Los destinos aún no habilitados (FAQ, centros, guía e historial) siguen siendo sus
rutas españolas; no se crean equivalentes ingleses. En la portada inglesa, el enlace
a Google Play muestra su etiqueta inglesa en vez de la imagen del distintivo español;
el destino y la portada española se conservan.

El soporte de estas páginas delega al `SeoHead` original con los mismos argumentos
en las páginas públicas. Solo las previsualizaciones emiten un título de desarrollo
y `noindex, nofollow`, sin añadir canonical, hreflang o datos estructurados ingleses.
Los títulos visibles de cabecera se resuelven en inglés en la previsualización;
los títulos españoles mantienen sus valores originales.

Archivos de este encargo: `app/+not-found.tsx`, `i18n/I18nProvider.tsx`, nuevo
`i18n/developmentPreview.ts`, nuevos
`components/i18n/EnglishDevelopmentPreview.tsx` y
`components/i18n/InformationPageSupport.tsx`, las seis pantallas de
`components/home/` (`LandingPage`, `AboutPage`, `SourcesPage`, `ContactPage`,
`PrivacyPage`, `LegalPage`) y este README.
Sin TypeScript, ESLint, builds, comparadores ni pruebas. Sin cambios de referencias
históricas, protocolos, búsqueda, centros o almacenamiento. Sin commit, push ni
despliegue. La futura publicación requerirá autorización y rutas Expo reales con
su SEO y exportación preparados en una fase posterior.

## Vista previa estática local inglesa (sustituye el acceso solo con Expo dev)

Comandos locales habituales:

```powershell
npm.cmd run build
npx.cmd serve dist -l 3000
```

Abrir `http://localhost:3000/en/`, `/en/about`, `/en/sources`, `/en/contact`,
`/en/privacy` o `/en/legal`. No se han ejecutado estos comandos durante el encargo.

`build` es ahora explícitamente una compilación LOCAL de vista previa. El script
copia el árbol de rutas español a `.expo/english-static-preview/app` y genera allí
solo las seis rutas inglesas, leyendo las correspondencias de `i18n/routes.ts` y
reexportando los componentes existentes. `app.config.js` elige ese router alternativo
exclusivamente con el destino privado `local-preview`. No se añaden rutas inglesas
al árbol público `app/`, ni se modifican textos o componentes de contenido.

La variable compilada `EXPO_PUBLIC_SOS_FAUNA_STATIC_PREVIEW=1` permite al proveedor,
la navegación y el soporte de vista previa resolver inglés también en el bundle
estático optimizado. No cambia `englishPublished`, el selector o las redirecciones;
Android y rutas españolas mantienen español. La copia temporal de `+html` no
registra el service worker de producción. `dist/en/index.html` permite servir
`/en/` directamente. El artefacto lleva `LOCAL_PREVIEW_ONLY.txt`; no debe publicarse.
No se ejecutan el generador de sitemap ni Workbox en este destino local.

Separación de publicación, independiente de hacer o no push:

- `npm run build:web` y `npm run build:web:pwa` fuerzan el destino `publication`
  y el indicador de vista previa a `0`, aunque el entorno tuviera otros valores.
- Antes de exportar se limpia la salida anterior para impedir que sobrevivan HTML
  ingleses de una vista previa. La limpieza se limita a una lista cerrada de rutas
  resueltas dentro del repositorio. Expo exporta con caché reiniciada.
- La publicación conserva la secuencia de versión, exportación española, generación
  del sitemap español y Workbox. Sus scripts/configuraciones no cambian. El resultado
  se prepara además en `dist-public` con `PUBLIC_BUILD.json`; se rechaza si contiene
  `en/` o `en.html`.
- El workflow acepta únicamente `dist-public`, con comprobación del marcador y
  ausencia de rutas inglesas antes de preparar 404/subir el artefacto. Ya no sube
  `dist`. Las compilaciones de vista previa están bloqueadas en CI.
- `.expo/`, `dist/` y `dist-public/` quedan fuera de Git. El árbol alternativo no
  participa en la compilación pública o nativa normal.

Archivos: `package.json`, nuevo `app.config.js`, nuevos `scripts/build-web.cjs` y
`scripts/assert-public-build.cjs`, `.github/workflows/deploy-web.yml`, `.gitignore`,
`i18n/developmentPreview.ts`, `i18n/I18nProvider.tsx`,
`components/i18n/InformationPageSupport.tsx` y este README.
Sin cambios de protocolos, FAQ, centros, búsqueda, contenido español, sitemap o
metadatos SEO. Se reutiliza el comportamiento noindex del soporte de vista previa
ya existente; no se prepara SEO inglés. No se han ejecutado builds, TypeScript,
ESLint, comparadores o pruebas. Sin commit, push ni despliegue.

## Traducción británica de la guía (solo vista previa local)

El botón de la guía y la recuperación del aviso desde `/en/` dirigen ahora a
`/en/guide`, conservando los parámetros actuales `mode` y `animalType`. La ruta
se incorpora únicamente al router alternativo generado para `npm run build` y
al acceso de desarrollo. No se registra en `app/` ni se permite en el artefacto
público. Para revisarla manualmente:

```powershell
npm.cmd run build
npx.cmd serve dist -l 3000
```

Abrir `http://localhost:3000/en/` y pulsar «Step-by-step help guide», o abrir
`http://localhost:3000/en/guide` directamente. Estos comandos NO se han ejecutado
durante este encargo.

Contenido propio de la guía traducido: cuatro pasos, opciones y variantes
contextuales, accesibilidad, confirmaciones, captura/galería/permisos, ubicación,
lectura en voz alta (`en-GB`), preparación/error, resumen visual y mensajes para
copiar/WhatsApp. Incluye los trece tipos, crías, atrapamiento, animales muertos,
señales, suplementos y cierre común. Catálogos nuevos: `assistant.en.ts`,
`assistant-display.en.ts`, `rescue-protocols.en.ts`, `rescue-special.en.ts` y
`rescue-summary.en.ts`. El identificador de idioma sigue siendo `en`.

Los generadores mantienen las mismas decisiones, prioridades, composición y IDs
de deduplicación. Las nuevas traducciones preservan las restricciones sobre todas
las serpientes (también si no pueden descartarse), no manipular/capturar/trasladar
ni liberarlas, así como las prohibiciones marinas y los límites de intervención.
No se cambian los textos españoles existentes de protocolos ni sus condiciones.

`assistant-display.es.ts` incorpora alias literales de presentación y dos párrafos
finales/nombre de pantalla aún no centralizados. `assistantLabels.ts` los resuelve
mediante el catálogo existente, solo al mostrarlos o componer el mensaje. Las
opciones originales, sus códigos, su orden, claves y etiquetas heredadas no se
reescriben ni se usan traducciones para tomar decisiones. Para español se devuelve
siempre la etiqueta original. Las dos frases finales españolas se conservan
literalmente al moverlas al catálogo.

El resolver admite inglés en las compilaciones locales señaladas y en desarrollo;
el proveedor limita ese acceso a las páginas aprobadas. La compilación pública
fuerza el indicador local a cero y conserva `englishPublished: false`. Android y
rutas españolas mantienen español. No se modifica el selector ni las redirecciones.

El mensaje compartido acepta un segundo parámetro de idioma opcional con español
por defecto; firmas existentes de consumidores siguen siendo válidas. Se localizan
etiquetas y prefijos, sin cambiar destinatarios, números, URL ni parámetros de
WhatsApp. La composición de ubicación acepta el catálogo para presentar el resumen,
sin traducir las direcciones geocodificadas, coordenadas o URL y sin modificar los
centinelas históricos. Se mantienen almacenamiento, esquemas y recuperación; los
resúmenes preparados desde la guía inglesa se guardan en ese idioma como texto, con
los códigos originales del aviso. No se añaden migraciones ni cambios multimedia.

Pendientes deliberados por exclusión: el directorio abierto mediante «Help» conserva
su interfaz y datos españoles; no se traducen FAQ ni directorio. Nombres oficiales,
direcciones y datos geográficos permanecen como están. El Open Graph/metadatos de
la ruta compartida no se modifica. La revisión visual y funcional está pendiente:
no se ejecutan compilaciones, TypeScript, baterías de pruebas ni auditorías generales,
y no se afirma equivalencia comprobada en este encargo. Referencias intactas.

Archivos de integración: `components/sos/SosAssistant.tsx`, `app/aviso.tsx`,
`components/home/LandingPage.tsx`, `utils/rescueShareMessage.ts`,
`i18n/assistantLabels.ts`, `i18n/effectiveLocale.ts`, `i18n/I18nProvider.tsx`,
`i18n/developmentPreview.ts`, `components/i18n/EnglishDevelopmentPreview.tsx`,
`scripts/build-web.cjs`, `i18n/catalogs/es.ts`, `i18n/catalogs/en.ts`, los seis
catálogos nuevos indicados y este README. Sin cambios de FAQ, directorio, Open Graph,
versiones o dependencias. Sin commit, push ni despliegue.

## FAQ en inglés: vista previa local

Las 92 preguntas y respuestas tienen traducción británica completa: 32 generales,
54 de vencejos y 6 de murciélagos. Se conservan los identificadores, categorías
internas, prioridades y acciones españolas. `faq.en.ts` reúne los textos de
`faq-general.en.ts` y `faq-swifts.en.ts`, además de interfaz, categorías y frases
dinámicas. Los textos científicos y las denominaciones oficiales se conservan.

`faq-animals.es.ts` registra literalmente los nombres, artículos y alias originales
de los 108 animales como claves tipadas; `faq-animals.en.ts` aporta sus etiquetas
y sinónimos ingleses. Los registros españoles originales no se sustituyen.
`getAnimalCatalogForLocale` conserva ese array original para español y cachea las
etiquetas inglesas para la vista previa. `getFaqItemsForLocale` incorpora las
palabras clave inglesas de `data/faqSearchKeywords.en.ts`; el perfil inglés de
`data/faqSearchVocabulary.ts` reutiliza los motores existentes, sin cambiar sus
puntuaciones, umbrales, desempates ni filtros. Español conserva su vocabulario.
Los identificadores españoles, cifras, siglas y nombres científicos pueden seguir
formando parte del índice interno; no se muestran como etiquetas inglesas.

Rutas locales aprobadas: `/en/faq`, `/en/faq/vencejos` y `/en/faq/murcielagos`.
Se registran en `i18n/routes.ts` y `developmentPreview.ts`. El renderizador de
desarrollo y `scripts/build-web.cjs` reutilizan los componentes FAQ existentes;
las rutas estáticas se generan únicamente en el router temporal de vista previa.
La portada enlaza a la FAQ inglesa y las FAQ mantienen los enlaces entre páginas
inglesas, incluido el acceso a la guía ya existente. Los enlaces al directorio
conservan `/centros`, que sigue siendo español y queda fuera de este encargo.
La integración de cabecera reutiliza el soporte de vista previa: noindex local,
sin cambiar el componente SEO público ni Open Graph. El cierre de publicación
sigue desactivado y la compilación pública conserva su bloqueo de rutas inglesas.

Además de los catálogos y datos indicados, se adaptan `FaqPage.tsx`,
`TopicFaqPage.tsx`, `TopicFaqHeader.tsx`, `LandingPage.tsx`,
`EnglishDevelopmentPreview.tsx`, `InformationPageSupport.tsx` y los exports de
`catalogs/es.ts` y `catalogs/en.ts`. No se modifican guía, protocolos, directorio,
almacenamiento ni referencias históricas.

Revisión estática de contenido: 184 claves de preguntas/respuestas cubiertas sin
faltantes ni sobrantes, reparto 32/54/6, 108 animales con las cuatro áreas completas,
y copia española de animales idéntica a los registros originales. Se conservan
`Apus apus`, las ocho advertencias completas sobre serpientes y la instrucción de
lavado de al menos 15 minutos ante mordedura de murciélago. No se han ejecutado
builds, TypeScript, ESLint, baterías de pruebas ni comparadores de protocolos;
la revisión visual y funcional del navegador queda pendiente. No se afirma una
comparación ejecutada de resultados de búsqueda ni del HTML exportado.

Para revisar localmente, generar la vista previa con `npm.cmd run build` y servirla
con `npx.cmd serve dist -l 3000`, y abrir las tres rutas anteriores en localhost.
Estos comandos se documentan para revisión manual; no se ejecutan en este encargo.
No publicar `dist`: el mecanismo existente reserva `dist-public` para publicación.

## Directorio inglés en vista previa local

`/en/centros` reutiliza `app/centros.tsx`, `RecoveryCentersPage` y
`PublicRecoveryCenters.web.tsx`. Se añade al registro central, al listado de páginas
locales y al router temporal del generador de vista previa, sin crear una ruta
inglesa en `app/` ni habilitarla para publicación. Los enlaces de portada y FAQ
apuntan al directorio en su idioma; sus enlaces de vuelta y a FAQ también lo
conservan. La cabecera inglesa reutiliza el soporte noindex local existente y la
cabecera española mantiene sus argumentos originales. Open Graph no se modifica.

Los nuevos `catalogs/centers.en.ts` y `catalogs/help-contact-descriptions.en.ts`
completan interfaz y explicaciones mediante el resolver existente. Se conservan
los nombres oficiales, lugares y datos de contacto. Se añaden 34 notas mixtas a
los catálogos español e inglés y a los enlaces de presentación de
`data/helpContactText.ts`: teléfonos alternativos, urgencias, extensiones, móviles,
oficinas e instrucciones de contacto. Las notas españolas coinciden literalmente
con el origen. Solo tres etiquetas descriptivas de servicio tienen un nombre
localizado; los registros y nombres oficiales originales siguen intactos.

La pluralización conserva «1 contacto telefónico / 2 contactos telefónicos» y
presenta «1 telephone contact / 2 telephone contacts». El directorio inglés aclara
que los contactos son de España, que el proyecto no es oficial y que no se
garantiza atención en inglés. Las fuentes mantienen sus URL y denominaciones
oficiales. El componente compartido de Help recibe los mismos catálogos sin
modificar la guía, su estado, protocolos ni almacenamiento.

`components/contacts/contactSearch.ts` mantiene el filtro español por provincia.
En la vista previa inglesa acepta además nombres oficiales y localidades de las
notas originales, con la misma normalización de acentos. No se traduce ni duplica
la base de datos. Se conservan los acordeones nativos, orden, controles y enlaces
telefónicos originales.

Archivos creados: los dos catálogos ingleses y `components/contacts/contactSearch.ts`.
Archivos adaptados: `app/centros.tsx`, `components/contacts/RecoveryCentersPage.tsx`,
`components/contacts/PublicRecoveryCenters.web.tsx`, `data/helpContactText.ts`,
`i18n/catalogs/centers.es.ts`, `i18n/catalogs/help-contact-descriptions.es.ts`,
`i18n/catalogs/en.ts`, `i18n/routes.ts`, `i18n/developmentPreview.ts`,
`components/i18n/EnglishDevelopmentPreview.tsx`, `scripts/build-web.cjs`,
`components/home/LandingPage.tsx`, los enlaces de `components/faq/FaqPage.tsx` y
`components/faq/TopicFaqPage.tsx`, y este README.

Comprobación estática limitada al contenido: 42 claves de interfaz y 65 claves de
descripciones cubiertas, sin faltantes; notas españolas de los enlaces de
presentación idénticas al origen y números conservados en sus traducciones.
Los datos mantienen 50 grupos, 129 contactos provinciales y cuatro nacionales.
No se modifican `lib/provinceContacts.ts` ni `data/marineHelpContacts.ts`.
Permanecen en español las denominaciones oficiales (por ejemplo Policía Nacional,
Agentes Forestales de Madrid y Centro de Recuperación de Animales Silvestres de
la Comunidad de Madrid), direcciones y localidades. No queda prosa descriptiva
pendiente en el directorio. No se ejecutan builds, TypeScript, ESLint ni pruebas
generales; la revisión visual y funcional queda pendiente.

Tras regenerar manualmente la vista previa con `npm.cmd run build` y servirla con
`npx.cmd serve dist -l 3000`, abrir `http://localhost:3000/en/centros`.
No se ejecutan estos comandos, ni commit, push o despliegue en este encargo.

## Selección automática y manual: solo vista previa

La vista previa web habilita detección y selector mediante `isLocalLanguagePreview`.
Los tres indicadores públicos de `config.ts` siguen en `false`; el despliegue,
las rutas públicas, la protección de `dist-public` y Android no se activan.

En una entrada inicial por `/`, sin parámetros ni fragmento, el proveedor consulta
la preferencia manual `sosFauna:preferredLocale` de localStorage. Si no existe,
recorre `navigator.languages` en orden, acepta las variantes regionales de `es`
y `en`, ignora idiomas no disponibles y utiliza inglés si ninguno es compatible.
Por ejemplo, `[fr-FR, es-ES]` elige español y `[fr-FR, de-DE]` elige inglés.
La detección ocurre una sola vez por montaje del proveedor, mediante replace;
no intercepta enlaces directos españoles/ingleses ni navegación interna. Una URL
inglesa directa conserva inglés incluso si el navegador o preferencia manual son
españoles. La elección ES del selector permite fijar español deliberadamente.

El selector accesible `ES | EN` marca el idioma actual con fondo, subrayado y
estado seleccionado, y permite guardar también la opción que ya está activa.
Sustituye el botón de guía de la cabecera de portada únicamente en vista previa;
en las demás páginas aparece en la barra superior compartida. Las equivalencias
usan el registro existente y conservan parámetros/fragmentos; donde todavía no
hay una ruta inglesa local (por ejemplo historial), se utiliza la portada inglesa.
Las rutas públicas españolas y su cabecera de producción conservan su aspecto.

Durante un aviso, el proveedor cambia contexto y URL mediante replaceState sin
navegar con el router ni desmontar la guía. Esto mantiene selecciones, paso y
referencias multimedia en memoria. `app/aviso.tsx` conserva su preparación al
cambiar idioma; el manejador de vuelta del asistente consulta referencias actuales
para mensaje, portada y URL sin reinstalar el guard ni añadir entradas al cambiar
idioma. No se cambian protocolos, esquemas, claves de avisos ni historial. No se
añade un enlace de salida en la barra superior de la guía que eluda su confirmación.
La URL equivalente queda disponible para recargar o compartir con los parámetros
originales; recargar sigue teniendo las limitaciones normales de archivos temporales.

El soporte SEO de vista previa emite canonical de la página equivalente y enlaces
recíprocos `hreflang="es"`, `hreflang="en"` y `hreflang="x-default"` (equivalente
española). Las páginas locales de ambos idiomas siguen en noindex. Las rutas sin
equivalencia inglesa no anuncian una equivalencia ficticia. Los textos ingleses se
exportan mediante el proveedor ya existente; no se traducen en el navegador.
El generador local ajusta además el atributo lang de cada HTML exportado, pues
el documento +html no recibe contexto de ruta durante la exportación de Expo.
El proveedor lo mantiene al navegar. La rama pública del generador no se modifica;
el SEO español público y Open Graph conservan sus entradas originales.

Archivos: `i18n/selection.ts`, `i18n/developmentPreview.ts`, `i18n/I18nProvider.tsx`,
`components/i18n/LanguageSelector.tsx`, nuevo `LanguagePreviewBar.tsx`,
`components/i18n/InformationPageSupport.tsx`, `components/seo/SeoHead.tsx`,
`app/_layout.tsx`, `components/home/LandingPage.tsx`, `app/aviso.tsx`,
`components/sos/SosAssistant.tsx`, `scripts/build-web.cjs` y este README.

Comprobaciones específicas ejecutadas sin exportar: preferencias de navegador,
fallback, persistencia y almacenamiento bloqueado, enlaces directos, parámetros,
puertas nativa/pública, las once correspondencias locales, sintaxis de TSX
modificados, transformación lang sobre documentos en memoria y simulación del
proveedor en guía ES→EN→ES sin ninguna navegación del router. No equivalen a una
prueba en navegador, una comprobación completa de tipos ni un build. No se ejecutan
baterías generales, ESLint, comparadores ni despliegues; referencias intactas.

Revisión manual local (comandos a ejecutar por quien revisa):

1. `npm.cmd run build` y `npx.cmd serve dist -l 3000`.
2. Abrir `/` en una ventana privada con los idiomas de navegador deseados. Para
   reiniciar solo la preferencia de idioma, ejecutar en la consola de localhost
   `localStorage.removeItem("sosFauna:preferredLocale")` y volver a cargar `/`.
3. Cambiar ES/EN en FAQ, centros y contacto; comprobar equivalencias y persistencia
   al volver a abrir `/`. Visitar una URL inglesa directamente con navegador español.
4. En la guía, avanzar, seleccionar fotos/vídeos y alternar ES/EN: comprobar el
   mismo paso, datos, multimedia y confirmación de vuelta, sin recargar la página.
5. Revisar el código fuente de las páginas exportadas: textos en el idioma de la
   ruta, lang, canonical, alternates y noindex. No publicar la carpeta dist.

## Lanzamiento bilingüe

La activación web está autorizada en `config.ts`: publicación inglesa, selector y
selección automática activos. El bloqueo de Android se mantiene en el resolver y
proveedor. Se conserva el selector ES | EN sin recuadros y «Continue previous report».
No se cambia la versión de Expo, los protocolos, contactos oficiales, esquemas de
avisos, historial, Open Graph ni el distintivo de Google Play.

### Compilación y publicación

`npm.cmd run build:web:pwa` prepara el artefacto público **dist-public**; no despliega.
El generador utiliza un router web temporal `.expo/bilingual-web/app` tanto para
publicación como para vista previa. Lee las URL de `i18n/routes.ts` mediante
`scripts/web-routes.cjs`; las rutas inglesas son adaptadores de los componentes
existentes. `app.config.js` solo selecciona ese router al usar el destino web
explícito, por lo que la configuración normal de Expo/Android no cambia.

Las once rutas inglesas publicadas son `/en/`, `/en/about`, `/en/sources`,
`/en/contact`, `/en/privacy`, `/en/legal`, `/en/faq`, `/en/faq/vencejos`,
`/en/faq/murcielagos`, `/en/centros` y `/en/guide`, junto con todas las rutas
españolas actuales. El historial sigue en su ruta española existente; no se crea
una página inglesa de historial ni se cambia su almacenamiento. El selector mantiene
su fallback a portada inglesa cuando una pantalla no tiene equivalente disponible.

La preparación elimina el destino público anterior antes de comenzar, exporta,
normaliza lang, convierte la portada inglesa a `en/index.html` y elimina `en.html`
para no mantener dos archivos de portada inglesa. Genera sitemap, precache bilingüe,
404 y .nojekyll, copia a dist-public y escribe un marcador de publicación versión 2.
El validador comprueba el marcador, ausencia de señal de vista previa, archivos,
recursos JS, rutas, FAQ temáticas completas, 50 grupos del directorio, lang,
canonical, hreflang, robots, sitemap y precache inglés. Rechaza una vista previa
renombrada o un artefacto incompleto. El workflow valida y sube exclusivamente
ese artefacto ya terminado, sin modificarlo después de validarlo.

`npm.cmd run build` conserva la vista previa en **dist**, con su marcador local,
noindex y sin registrar service worker; está prohibida en CI. No se retiran esas
protecciones y nunca debe publicarse dist como sustituto de dist-public.

### Selección inicial y SEO

La detección revisada conserva el acceso directo a las URL, aplica en `/` la
preferencia manual o el primer idioma es/en del navegador y usa inglés si no hay
ninguno compatible. Un script pequeño en el head toma la misma decisión antes de
pintar el body. Solo oculta el documento español cuando va a sustituirlo por `/en/`;
no utiliza un temporizador que pueda revelar español si la respuesta inglesa tarda.
Si la navegación lanza un error síncrono, restaura la visibilidad. No escribe datos
ni preferencias, no actúa sobre URL inglesas, rutas profundas, query ni fragmentos,
y el proveedor evita una segunda redirección. Sin JavaScript el HTML sigue completo.

Las diez páginas indexables de cada idioma tienen canonical de sosfauna.es,
alternates recíprocos es/en y x-default hacia la equivalente española. El sitemap
contiene las mismas veinte URL canónicas y alternates, sin localhost ni duplicados.
La guía conserva noindex, como su equivalente española; no entra en sitemap.
Historial y páginas internas conservan su noindex. Cada HTML tiene lang correcto
antes de ejecutar JavaScript. La vista previa sigue siendo noindex.

### Comprobaciones y entrega local

Comandos de validación: `node node_modules/typescript/bin/tsc --noEmit`,
`node tests/bilingual-release.cjs`, `npm.cmd run build:web:pwa`,
`node scripts/assert-public-build.cjs` y `node tests/bilingual-public-web.cjs`.
La prueba del navegador reutiliza `tests/browser-local.cjs` y puede necesitar
`SOS_FAUNA_PLAYWRIGHT` si Playwright está en el runtime de herramientas en lugar
de node_modules. Sirve el dist recién exportado en un puerto efímero, usa perfiles
independientes y bloquea peticiones externas/service workers para aislar la prueba.
El contenido exportado es el que se copia a dist-public.

TypeScript pasa; las 28.394 salidas españolas coinciden exactamente con la captura
2G, incluidos orden y espacios. Su SHA-256 original sigue siendo
`8dde12dc68da520dd7db874c21be707bc41609d3fd995b8435bd5d0e4bec18e0`.
La prueba de lanzamiento utiliza los casos, salidas y evaluador originales sin
reescribirlos. El comando histórico i18n-assistant --protocols-only ya no es una
prueba de lanzamiento válida: exige que el inglés siga bloqueado y se detiene en
esa premisa anterior. No se altera esa prueba ni ninguna referencia histórica.

La compilación y la validación del artefacto pasan (22 rutas equivalentes más el
historial español, veinte URL indexables). Se comprueban además rechazo de marcadores
de vista previa/artefactos incompletos, detección y preferencias, idioma nativo es,
URLs directas, navegación equivalente y cambio ES↔EN durante la guía conservando
paso, foto seleccionada y DOM montado, sin cargar otro documento. La comprobación de
pintado incluye una respuesta inglesa retrasada 2,5 segundos. No se realiza una
auditoría general ni se ejecutan suites históricas ajenas al cambio.

Avisos no bloqueantes del build: datos Browserslist antiguos y fallo del comprobador
de actualizaciones de Workbox; no impiden generar ni validar el service worker y
no se actualizan dependencias por esos avisos. `public/version.json` recibe la nueva
fecha de build por el script existente, manteniendo la versión 1.2.0.

Archivos de esta fase: `i18n/config.ts`, `i18n/developmentPreview.ts`,
`i18n/I18nProvider.tsx`, `i18n/selection.ts`, `components/i18n/InformationPageSupport.tsx`,
`app/+html.tsx`, `app.config.js`, `scripts/build-web.cjs`,
`scripts/assert-public-build.cjs`, nuevo `scripts/web-routes.cjs`,
`scripts/generate-sitemap.js`, `.github/workflows/deploy-web.yml`,
`public/version.json`, nuevos `tests/bilingual-release.cjs` y
`tests/bilingual-public-web.cjs`, y este README. Se conservan todos los cambios previos.
No se realiza commit, push ni despliegue. Para revisar el artefacto público local,
utilizar `npx.cmd serve dist-public -l 3000`.

## Comprobaciones SEO adicionales del lanzamiento

Se han añadido comprobaciones dirigidas, sin rehacer las traducciones ni modificar
contenidos, protocolos, contactos, datos de avisos o funciones de visitantes.

Problemas reproducidos y corregidos:

- El script temprano y el proveedor podían enviar a Googlebot desde `/` a `/en/`
  si el navegador de renderizado declaraba inglés, ocultando la portada española.
  `i18n/selection.ts` omite esa redirección para Googlebot y Google-InspectionTool;
  `I18nProvider` pasa el agente al mismo resolver. La excepción solo afecta a la
  navegación automática: el HTML público servido es el mismo para cualquier agente,
  las dos URL siguen siendo accesibles y no se añade contenido especial para robots.
  La detección y la preferencia manual de visitantes se conservan.
- El listado interno de Expo `/_sitemap` carecía de robots noindex. El acabado del
  HTML exportado le añade `noindex, nofollow`; el sitemap XML público no cambia.
  Se comprueba que la etiqueta siga presente después de hidratar esa página.

`scripts/assert-bilingual-seo.cjs` se integra al final del validador público existente.
Comprueba las veinte páginas indexables: HTML estático con contenido, idioma,
título y descripción únicos, canonical propio, alternates recíprocos es/en y
x-default hacia una página existente, canónica e indexable. Contrasta las entradas
y alternates del XML con el HTML, y comprueba `robots.txt` (rastreo permitido y
`Sitemap: https://sosfauna.es/sitemap.xml`). Recorre los demás HTML para exigir
noindex: guía, historial, 404, modal, plantillas internas y listado interno de Expo.
No queda ninguna página indexable inglesa con noindex heredado de la vista previa.
Los títulos/descripciones existentes se revisaron y son distintos y están en su
idioma; no fue necesario modificarlos. Las denominaciones oficiales se conservan.

`tests/bilingual-seo-web.cjs` prueba las veinte URL del exportado con Googlebot y
JavaScript desactivado: HTTP 200, dirección independiente, cuerpo visible, lang,
canonical, robots y ausencia de una cabecera HTTP noindex. Después comprueba, con
JavaScript activado, Googlebot de escritorio, móvil y Google-InspectionTool con
preferencia inglesa: `/` permanece visible en español y `/en/` permanece en inglés
tras la hidratación. Verifica además que un visitante inglés sigue accediendo
 automáticamente a `/en/` y que el listado interno de Expo mantiene noindex.
Las peticiones se limitan al servidor local; no se contacta Google ni se publica.

Resultados: TypeScript, una regeneración pública necesaria para incorporar las dos
correcciones, validación del artefacto y del SEO, y prueba específica del navegador,
todos satisfactorios. No se repiten comparadores de protocolos ni auditorías
ajenas a estas comprobaciones. Los avisos no bloqueantes de Browserslist/Workbox
son los ya documentados. El build actualiza la fecha de public/version.json.

Archivos de este complemento: `i18n/selection.ts`, `i18n/I18nProvider.tsx`,
`scripts/build-web.cjs`, `scripts/assert-public-build.cjs`, nuevos
`scripts/assert-bilingual-seo.cjs` y `tests/bilingual-seo-web.cjs`, este README y la
fecha generada de `public/version.json`. Sitemap, robots, títulos y descripciones
no requieren cambios de contenido.

Criterios contrastados con documentación oficial de Google: [rastreo de páginas
adaptadas al idioma](https://developers.google.com/search/docs/specialty/international/locale-adaptive-pages),
[gestión de sitios multilingües](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites)
y [versiones localizadas y hreflang](https://developers.google.com/search/docs/specialty/international/localized-versions).
La comprobación certifica la preparación técnica local, no que Google haya indexado
un artefacto aún no publicado. La inclusión efectiva y la respuesta del alojamiento
real se podrán comprobar después del despliegue mediante Search Console/inspección
de URL. No se realiza commit, push ni publicación.
