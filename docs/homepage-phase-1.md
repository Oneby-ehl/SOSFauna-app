# Portada web — fase 1

## Alcance y estructura

- `Home.web.tsx` conecta la presentación nueva al controlador existente de `LandingPage.tsx` mediante `renderWeb`.
- `LandingPage.tsx` conserva la recuperación, comprobación de historial, borrado protegido por ID, navegación e instalación. La nueva vista recibe manejadores; no accede al almacenamiento.
- El diálogo web de aviso pendiente adapta la confirmación anterior para ofrecer continuar, eliminar e iniciar, y cancelar en una misma ventana accesible. Reutiliza `handleContinueCase` y `openNewCase`; no añade otro mecanismo de recuperación. La confirmación nativa sigue igual.
- `LandingPresentation.web.tsx` contiene cabecera, menú modal, contenido inferior y pie. El menú incluye las ocho entradas solicitadas y la recuperación del aviso pendiente cuando existe. La divulgación futura figura como texto, sin ruta vacía.
- `WildlifeHero.web.tsx`, `heroPhotos.ts` y `landingStyles.ts` preparan fotografía a pantalla completa, fundido de 1,4 s cada 8 s, pausa y créditos. Con movimiento reducido se muestra una fotografía estática sin fundidos. Al ocultar la pestaña se suspende el temporizador. Si una imagen falla, se excluye; sin imágenes queda el fondo provisional.
- `EditorialCard.web.tsx` ofrece cuatro avances temáticos con la indicación «Próximamente». Son elementos `article`, sin enlaces ni acciones. No se han creado artículos, rutas ni base de datos.
- Los nuevos textos ES/EN están en `i18n/catalogs/landing-editorial.ts`, registrado en ambos catálogos.

## Pantalla y navegación

La vista ocupa `100dvh`, con respaldo `100vh`. La cabecera permanece fuera del área desplazable; el hero ocupa el 100 % del espacio que queda debajo. La sección editorial empieza después del hero, sin necesidad de calcular la altura de la cabecera con JavaScript.

En escritorio, la cabecera distribuye marca y menú a la izquierda, pregunta y acción en el centro e idiomas a la derecha. A anchuras intermedias, la pregunta se coloca sobre el botón. En móvil, marca e idiomas comparten la primera fila; pregunta y botón completo ocupan la siguiente. Las tarjetas pasan de cuatro columnas a dos y, en pantallas muy estrechas, a una.

El menú y el diálogo de aviso usan `dialog.showModal()`, con foco contenido, tecla Escape y restitución de foco nativos del navegador. Se conserva el selector de idioma mediante `selectLocale` y los destinos del enrutador mediante `useInformationPagePath`.

## SEO y límites

Se mantienen literalmente título y descripción españoles, datos estructurados y el componente SEO existente, que gestiona inglés, canonical y hreflang. El H1 conserva el texto anterior y está disponible para tecnologías de asistencia; el titular editorial visible es un H2. No se ha editado el sitemap ni la configuración de rutas, publicación o idiomas.

Se mantiene el aviso de independencia en el pie, con su texto existente y traducción. También siguen accesibles enlaces legales, Google Play, instalación cuando el navegador la permite y compartir la aplicación.

No se han editado archivos nativos o configuración Android, protocolos, servicios de almacenamiento ni historial. El componente compartido recibe una presentación opcional que solo utiliza la entrada web; la presentación y los manejadores nativos conservan su comportamiento. No hay dependencias nuevas.

## Fotografías pendientes

Estado de la entrega inicial; sustituido por la integración del 26 de octubre descrita al final de este documento.

No se han identificado en los recursos existentes fotografías adecuadas de estas especies con permisos documentados. No se ha descargado ni incorporado ninguna fotografía externa. El hero muestra un fondo verde estático con una nota provisional; no simula fotografías ni muestra controles de reproducción sin imágenes.

Se necesitan cuatro fotografías documentales de fauna española, preferiblemente horizontales, de al menos 2400 × 1350 px como objetivo de calidad:

| Orden | Recurso | Composición deseada |
| --- | --- | --- |
| 1 | Lince ibérico | Animal hacia el centro/derecha; espacio a la izquierda para texto |
| 2 | Ave rapaz identificada | Ojos, cabeza y alas conservados en recorte móvil |
| 3 | Reptil identificado presente en España | Detalle del animal y contexto de hábitat |
| 4 | Fauna marina identificada de aguas españolas | Sujeto legible en encuadre vertical y horizontal |

Para cada imagen se debe aportar: archivo original, especie concreta, autor, crédito exigido, fuente original, licencia o autorización escrita, condiciones de atribución y permiso para uso web/recorte. Guardar evidencia de los derechos en el proyecto. La licencia MIT del código no sustituye la comprobación de derechos de cada fotografía.

Tras comprobar los permisos:

1. Optimizar los archivos en WebP/AVIF o JPEG adecuado y guardarlos en `public/wildlife/` (directorio aún no creado).
2. Añadir las cuatro entradas a `heroPhotos`, en el orden anterior, con URL local, `species` y `alt` ES/EN, crédito y `rights` (`license`, `source`, `evidence`). `evidence` debe señalar el documento de autorización o licencia conservado.
3. Ajustar `objectPosition` por fotografía, verificando ambos formatos. Si una fotografía necesita un recorte móvil específico, preparar ese recurso antes de publicar.

## Revisión visual previa a publicación

- Primera pantalla a 320/390 px, escritorio a 1280/1440 px y móvil horizontal: cabecera más hero deben llenar el área visible, sin adelantar tarjetas.
- Safari/iOS y Chrome/Android web: barras del navegador, cambios de orientación, tamaño de texto y altura dinámica. La aplicación Android queda fuera del alcance.
- Botón completo en ES/EN, zoom del 200 %, ausencia de solapamientos y acceso al contenido cuando aumenta el tamaño de fuente.
- Menú y diálogo: orden de foco, cierre con Escape, retorno al disparador, distinción de continuar frente a eliminar. Revisar que los navegadores objetivo soporten `dialog.showModal()`.
- Tras incorporar fotos: encuadre del animal, contraste del titular, subtítulo y créditos, nitidez, tamaño de descarga, primer fotograma y suavidad del fundido.
- Pausa y reanudación, preferencia de movimiento reducido y retorno desde pestaña oculta, cuando estén disponibles las imágenes.
- Retirar el carácter provisional del espacio fotográfico solo después de añadir recursos autorizados; mantener los avances editoriales sin enlaces mientras no existan artículos.

## Verificación de esta entrega

Comprobación estática TypeScript (`tsc --noEmit --incremental false`) y revisión de diferencias. Sin builds, pruebas funcionales, servidor de previsualización, capturas de la aplicación, commit, push o despliegue. La apariencia en navegadores y las interacciones quedan pendientes de la revisión autorizada previa a publicar.

## Integración de imágenes — 26 de octubre de 2026

El propietario del proyecto ha proporcionado y solicitado integrar nueve ilustraciones generadas con IA desde `D:\GITHUB\sos-fauna-proyectos\Nuevo diseño\media\frontpage\WEBP`. Se han copiado sin alterar los originales a `public/wildlife/`, verificando la igualdad SHA-256 de cada copia. No se atribuye a estos recursos una licencia de fotografía de terceros.

Orden: `lince-iberico.webp`, `aguila-imperial-iberica.webp`, `abeja-silvestre.webp`, `galapago-europeo.webp`, `murcielago.webp`, `grullas.webp`, `zorro-rojo.webp`, `arana-de-la-cruz.webp`, `gorrion-alimentando-cria.webp`.

El lince es la única imagen solicitada inicialmente y tiene prioridad alta. A los cuatro segundos de mostrarse una imagen se solicita solo su sucesora, con prioridad baja. A los ocho segundos se realiza el fundido; si la siguiente aún no está decodificada, se conserva la actual hasta que esté preparada. Las imágenes ya solicitadas se mantienen montadas para las siguientes vueltas. La pausa, la pestaña oculta y el movimiento reducido detienen tanto el avance como la planificación de nuevas descargas. En movimiento reducido, la entrada inicial carga únicamente el lince.

Cada imagen tiene identificación y texto alternativo ES/EN, encuadre horizontal y un punto de encuadre específico para anchuras de hasta 900 px. El crédito visible es «Imágenes ilustrativas generadas con IA» / «AI-generated illustrative images». El resto de textos, la estructura de primera pantalla y la navegación siguen igual.

Pendiente de revisión visual autorizada: cabezas y extremos de los animales en móvil vertical/horizontal, las dos aves del último fotograma, alas del murciélago, contraste del titular y crédito, y fluidez de la primera transición en una conexión lenta. No se han ejecutado builds ni pruebas funcionales.

## Ajustes finales de portada

- Pregunta de cabecera en blanco, a 15 px (14 px en la distribución compacta), sin el límite de anchura que forzaba saltos de línea. Se conserva la distribución de la cabecera y sus puntos de adaptación.
- Solo el botón principal de cabecera tiene forma de cápsula y un latido de escala máxima 1,02 con pausa entre ciclos. Se detiene con foco, puntero o botón deshabilitado; la preferencia de movimiento reducido anula la animación. Sus manejadores no cambian.
- El pie del carrusel muestra únicamente el nombre del animal. La explicación ES/EN sobre imágenes generadas con IA pasa al apartado de propiedad intelectual del aviso legal web, sin nueva página.
- El delfín varado sustituye a la abeja en el tercer puesto; la abeja se conserva en `public/wildlife/`. La copia del delfín se ha verificado por SHA-256 y tiene punto de encuadre móvil propio; el resto de imágenes y sus encuadres no se modifican.
- Se retira el control visible de pausa. Se conservan los ocho segundos, el fundido y la carga progresiva. La secuencia se suspende al pasar el puntero por el hero y cuando este queda fuera de pantalla; se detiene hasta volver a abrir la portada al recibir foco de teclado, tocar la imagen o pulsar Escape. Una descripción accesible explica estas posibilidades, sin anuncios automáticos de cada imagen. Movimiento reducido mantiene imagen estática y elimina fundidos.

Revisión visual pendiente: pregunta ES/EN en una o varias líneas según espacio, dimensiones del botón en cápsula, sutileza del latido y encuadre del delfín en móvil (cabeza y aleta). Sin builds ni pruebas funcionales.

## Fase 2 — navegación y accesos de portada

El menú conserva el diálogo modal nativo y todos sus textos y destinos, pero se presenta como panel lateral desde el borde izquierdo: máximo 360 px y 85 % del ancho en móvil. Apertura y cierre mediante desplazamiento horizontal de 240/200 ms, sin animación con movimiento reducido. Cierra con el botón, Escape o una pulsación iniciada y terminada en el fondo exterior. El foco queda dentro del diálogo y vuelve al disparador al cerrar; el desplazamiento del contenido de fondo permanece bloqueado hasta que finaliza el cierre. Los enlaces cierran el panel inmediatamente antes de navegar, igual que los accesos a iniciar o continuar un aviso antes de abrir su pantalla o diálogo.

La pregunta pasa a 17,5 px en escritorio. La columna central aprovecha más espacio horizontal, con mayor separación del botón; marca, menú e idiomas mantienen su alineación exterior. La distribución compacta y móvil conserva sus reglas anteriores. El botón mantiene aspecto, tamaño aproximado, latido y manejadores.

`EditorialStories.web.tsx` conserva íntegramente la sección de artículos futuros, sus textos y las cuatro tarjetas. No se monta en la portada pública. En su lugar, `HomeQuickLinks.web.tsx` muestra «Encuentra la información que necesitas» y tres tarjetas completas pulsables hacia centros, preguntas frecuentes e historial. Usan las rutas del idioma activo y las traducciones existentes más cuatro textos nuevos ES/EN. No hay nuevas rutas ni funcionalidades. Distribución de tres columnas en escritorio, dos en tableta y una en móvil, con iconos SVG locales y foco visible.

Revisión visual pendiente: ancho y desplazamiento del panel, cierre exterior y restitución del foco; cabecera ES/EN a 1101, 1280 y 1440 px; tarjetas y foco en tableta/móvil. No se han modificado el carrusel, las fotografías, los textos del hero, SEO, rutas, almacenamiento ni servicios de avisos. Sin builds ni pruebas funcionales.
