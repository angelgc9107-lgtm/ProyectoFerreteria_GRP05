# Spec — Desarrollador JS Asíncrono (Fetch & APIs)

**Segundo Parcial — Programación Web I (UCES)**
**Grupo:** GRP05 · **Rol:** Desarrollador JS Asíncrono · **Integrante:** Alan Díaz (@alandox1)
**Rama de trabajo:** `feature/dev-async-fetch-api` → `develop`
**Issue asociada:** [#210](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/issues/210)

**Entregables del rol:**
- `api/productos.json`: catálogo en JSON estático, servido por el propio sitio.
- `js/api/apiService.js`: módulo dedicado al consumo asíncrono (fetch, tiempo límite, reintentos, errores). No toca el DOM.
- `js/services/ProcesadorCatalogo.js`: funciones puras de orden superior (`map`, `filter`, `reduce`) que procesan lo recibido.
- `js/script.js`: carga inicial asíncrona del catálogo y manejo de los estados en pantalla.
- `index.html` y `css/components.css`: contenedores y estilos de los estados de carga (solo lo mínimo).
- Este archivo: `docs/03-specs/segundo-parcial/spec-dev-async-fetch.md`.

> Orden obligatorio de commits: este archivo (sección BEFORE) se commitea **antes** que cualquier cambio de código del rol.

---

# BEFORE — Se completa antes de escribir código

## 1. Selección y justificación de la fuente de datos

Hoy el catálogo es un arreglo escrito en el código (`js/data/productosIniciales.js`) y se carga de forma síncrona al importar `script.js`. La consigna pide que la información se cargue y se use **de forma asíncrona**, desde una API o desde un JSON estático dentro de una carpeta `api/`.

| Opción | Ventajas | Riesgos |
|---|---|---|
| **A. JSON estático propio** (`api/productos.json`) | Los 9 productos son de ferretería y reales del proyecto. Mismo origen que el sitio: sin CORS, sin límites de uso, sin claves y sin depender de un tercero. Funciona en GitHub Pages. Es la opción que la consigna admite expresamente. | No hay servidor: no se puede probar un `POST`. Con `file://` el navegador bloquea `fetch` (hay que servir por HTTP, igual que ya se hace con el runner de Jasmine). |
| B. FakeStoreAPI | Es una API real, con productos y precios. | Sus productos son ropa, joyas y electrónica: no coinciden con una ferretería ni con las categorías del sitio. Servicio gratuito de terceros: puede caer o cambiar. Dependencia externa que se suma al rendimiento medido con Lighthouse. |
| C. JSONPlaceholder | Muy estable y muy usada en ejemplos. | Devuelve publicaciones y usuarios, no productos. Habría que traducir datos que no tienen sentido en este dominio. |
| D. MockAPI | Permite crear un recurso propio con el esquema que se quiera. | Exige cuenta y un proyecto externo; la URL pasa a depender de un tercero y de su plan gratuito. |

**Decisión: opción A.** Es la única que mantiene el dominio de la ferretería, no agrega puntos de falla fuera del repositorio y deja las pruebas del Tester QA/JS reproducibles (se simula `fetch` o se sirve el mismo archivo). El riesgo de que no sea una "API real" se compensa con que el consumo es un `fetch` HTTP verdadero (códigos de estado, JSON, errores de red), igual que con cualquier API.

**Contrato de datos** (`api/productos.json`): el mismo esquema que ya valida `Producto`, para no tocar el modelo del Desarrollador JS POO.

```json
{
  "version": 1,
  "productos": [
    { "codigo": "GUANTES-001", "nombre": "…", "categoria": "Herramientas manuales", "descripcion": "…", "precio": 4401 }
  ]
}
```

El contenido de los 9 productos se toma tal cual de `js/data/productosIniciales.js`, sin cambiar códigos, textos ni precios.

## 2. Diseño de los estados de carga

Se distinguen **dos cosas diferentes** que no deben confundirse:

- **Disponibilidad del catálogo** (el dato): si hay un catálogo usable para los cuatro flujos. Es `cargando` mientras se espera la respuesta y pasa a **`disponible` en cuanto `cargarCatalogo` devuelve un `ResultadoCarga`, sea cual sea su `origen`** (`red`, `cache` o `local`). Nunca queda «no disponible», porque el catálogo local siempre existe.
- **Estado visual del mensaje** (la interfaz): lo que muestra `#catalogo-mensaje`: `loading`, `success` o `error`. Depende de `origen`: `success` si los datos vinieron de la red; `error`, como **advertencia**, si hubo que usar la caché o el catálogo local.

Un mensaje de error por usar un fallback **no significa que el catálogo no esté disponible**: con `cache` o `local` el catálogo está disponible, los controles se habilitan y los cuatro flujos funcionan igual. Se reutilizan los elementos que ya existen en `index.html`: `#catalogo-mensaje` (`role="status"`, `aria-live="polite"`) y `#resultados-catalogo`.

| Situación | Disponibilidad del catálogo | Estado visual del mensaje | Controles y tarjetas | Dónde |
|---|---|---|---|---|
| **Cargando** | `cargando` | **loading**: «Cargando catálogo…» con el indicador que ya genera `mostrarMensaje()` con el tipo `loading` (spinner de Bootstrap) | Controles de búsqueda y filtros deshabilitados | `#catalogo-mensaje`; `#resultados-catalogo` con `aria-busy="true"` |
| **Datos de la red** (`origen: "red"`) | `disponible` | **success**: «N producto(s) cargado(s)» con el resumen del catálogo (sección 3) | Se quitan el indicador y `aria-busy`; se renderizan las tarjetas (flujo actual); controles habilitados | `#catalogo-mensaje`, `#resultados-catalogo` |
| **Respaldo** (`origen: "cache"` o `"local"`) | `disponible` | **error** (advertencia): mensaje amigable y sin detalles técnicos, según la matriz de 4.2 (por ejemplo «No pudimos actualizar el catálogo. Mostramos la última versión guardada.»), y botón **«Reintentar»** | Igual que en la fila anterior: tarjetas renderizadas, controles habilitados y los cuatro flujos operativos | `#catalogo-mensaje` (tipo `error`) |

Reglas:
- El detalle técnico (código HTTP, causa) va a `console.error`, no a la pantalla.
- Se reutiliza `mostrarMensaje()` y los tipos `info` / `success` / `error` / `loading` que ya existen, sin tocar su comportamiento.
- Tiempo máximo de espera por intento: 8 segundos (`AbortController`); pasado ese tiempo se considera error de red.
- Un solo pedido en vuelo: mientras hay una carga en curso, «Reintentar» no inicia otra.
- La búsqueda inicial (`buscarYMostrarCatalogo`) se ejecuta cuando el catálogo queda **disponible**, con cualquier `origen`; no espera al mensaje `success`.

## 3. Funciones de orden superior

Funciones puras en `js/services/ProcesadorCatalogo.js` (sin DOM, sin `fetch`, sin storage), por lo que se prueban fácil.

| Función | Usa | Colección que procesa | Para qué |
|---|---|---|---|
| `filtrarValidos(datos)` | `filter` + `map` | `productos` del JSON | Descarta registros que no cumplen las reglas de `Producto` (campos vacíos, precio no numérico o negativo, código repetido) y devuelve `{ validos, descartados }`. |
| `construirProductos(datos)` | `map` | Registros válidos | Convierte cada registro en una instancia de `Producto` (integración POO). |
| `resumirCatalogo(productos)` | `reduce` | Instancias de `Producto` | Calcula en una sola pasada: cantidad total, cantidad por categoría, precio mínimo y precio máximo. |
| `agruparPorCategoria(productos)` | `reduce` | Instancias de `Producto` | Devuelve un objeto categoría → productos, para el resumen. |

El resumen de `resumirCatalogo` se muestra en el mensaje de éxito («9 productos en 5 categorías. Precios de $4.401 a $79.999»). La búsqueda y los filtros que ya hace `Catalogo.buscar()` **no se tocan**.

## 4. Manejo de errores, validación y sanitización

### 4.1 Contrato público de `apiService.js`

`apiService.js` concentra todo el acceso a datos remotos. **No toca el DOM ni decide qué mostrar**: devuelve resultados o lanza `ErrorApi`, y `script.js` los traduce a pantalla. Los nombres y las firmas de esta sección son **decisiones de diseño** (los módulos todavía no existen); si cambian al implementar, se actualiza este spec.

**Exportaciones nombradas** (módulo ES, sin exportación por defecto):

| Nombre | Firma | Retorno | Errores que lanza |
|---|---|---|---|
| `ErrorApi` | `new ErrorApi(tipo, message, { estado, causa })` | Clase que extiende `Error` | — |
| `obtenerJson` | `obtenerJson(url, opciones?)` | `Promise<unknown>`: el JSON ya parseado | `ErrorApi` de tipo `red`, `http` o `formato` |
| `obtenerCatalogoRemoto` | `obtenerCatalogoRemoto(opciones?)` | `Promise<{ version: number, registros: object[] }>` | Los de `obtenerJson`, más `ErrorApi` de tipo `formato` si la estructura no es `{ productos: [] }` |
| `cargarCatalogo` | `cargarCatalogo(opciones?)` | `Promise<ResultadoCarga>` (nunca rechaza: siempre devuelve un catálogo usable) | Ninguno hacia afuera: captura los `ErrorApi` y aplica los fallbacks |

**`opciones`** (todas opcionales, con valor por defecto; permiten probar sin red):

| Opción | Por defecto | Uso |
|---|---|---|
| `tiempoLimiteMs` | `8000` | Tiempo máximo por intento (`AbortController`) |
| `reintentos` | `2` | Cantidad de reintentos (3 intentos en total) |
| `esperaBaseMs` | `500` | Espera antes del 1.º reintento; se duplica en cada uno (500 ms y 1000 ms) |
| `fetchFn` | `globalThis.fetch` | Reemplazable por un doble de prueba |
| `esperarFn` | `setTimeout` envuelto en promesa | Reemplazable para que los tests no esperen |
| `alReintentar` | — | `function(intento: number, error: ErrorApi): void`; la llama `cargarCatalogo` antes de cada reintento para que `script.js` pueda mostrar «Reintentando…» sin que el módulo toque el DOM |

**`ErrorApi`** (contrato):

| Campo | Tipo | Contenido |
|---|---|---|
| `tipo` | `"red"` \| `"http"` \| `"formato"` \| `"datos"` | Categoría que usa `script.js` para elegir el mensaje. El tiempo agotado es `red` (con `causa` = el `AbortError`). |
| `message` | `string` | Texto **técnico** para `console.error`. No se muestra al usuario. |
| `estado` | `number` \| `null` | Código HTTP (solo en `http`; `null` en el resto). |
| `causa` | `unknown` | Error original, si lo hay. |

El mensaje que ve el usuario **no** viaja en `ErrorApi`: lo elige `script.js` según `tipo` y `origen` (matriz de 4.2).

**`ResultadoCarga`** (retorno de `cargarCatalogo`):

| Campo | Tipo | Contenido |
|---|---|---|
| `catalogo` | `Catalogo` | Catálogo listo para usar, armado con instancias de `Producto` |
| `origen` | `"red"` \| `"cache"` \| `"local"` | De dónde salieron los datos |
| `descartados` | `Array<{ indice: number, motivo: string }>` | Registros inválidos que se descartaron (vacío si no hubo) |
| `resumen` | `{ total, porCategoria, precioMinimo, precioMaximo }` | Resultado de `resumirCatalogo` |
| `error` | `ErrorApi` \| `null` | El error que obligó a usar un fallback (`null` si `origen` es `"red"`) |

`cargarCatalogo` siempre devuelve un catálogo usable: **la disponibilidad no depende de `origen`**. Los campos `origen` y `error` solo informan de dónde salieron los datos, para que `script.js` elija el mensaje (sección 2).

**Exportaciones de `js/services/ProcesadorCatalogo.js`** (funciones puras: sin DOM, sin red y sin storage):

| Nombre | Parámetros | Retorno |
|---|---|---|
| `filtrarValidos` | `datos: object[]` | `{ validos: object[], descartados: Array<{ indice, motivo }> }` |
| `construirProductos` | `validos: object[]` | `Producto[]` |
| `resumirCatalogo` | `productos: Producto[]` | `{ total, porCategoria: Record<string, number>, precioMinimo: number \| null, precioMaximo: number \| null }` (con lista vacía: `total` 0 y precios `null`) |
| `agruparPorCategoria` | `productos: Producto[]` | `Record<string, Producto[]>` |

**Separación de responsabilidades**

| Responsabilidad | `apiService.js` | `ProcesadorCatalogo.js` | `script.js` |
|---|---|---|---|
| `fetch`, tiempo límite, reintentos y espera | ✅ | — | — |
| Validar la estructura de la respuesta (`{ productos: [] }`) | ✅ | — | — |
| Validar y descartar registros, construir `Producto`, resumir | — | ✅ | — |
| Elegir la fuente: red → caché → local, y guardar la caché | ✅ | — | — |
| Lanzar / capturar `ErrorApi` | ✅ | — | — |
| Mostrar el estado visual del mensaje (loading / success / error), los textos y el botón «Reintentar» | — | — | ✅ |
| Habilitar o deshabilitar controles, `aria-busy` | — | — | ✅ |
| Renderizar tarjetas y ejecutar la búsqueda inicial | — | — | ✅ |
| Escribir en el DOM | ❌ nunca | ❌ nunca | ✅ |
| Llamar a `fetch` directamente | ✅ (único lugar) | ❌ | ❌ |

`cargarCatalogo` usa `FachadaStorage` (caché) y `productosIniciales` (fallback local) importados desde sus módulos; no accede a `localStorage` directamente.

**Propagación de `ErrorApi`**

| Función | ¿Lanza `ErrorApi`? | ¿Quién lo captura? |
|---|---|---|
| `obtenerJson` | Sí: `red` (fallo de red o tiempo agotado), `http` (4xx / 5xx) o `formato` (el cuerpo no es JSON). Lo lanza recién cuando se agotan los reintentos aplicables | Quien la llama |
| `obtenerCatalogoRemoto` | Sí: propaga los de `obtenerJson` y agrega `formato` si la estructura no es `{ productos: [] }` | Quien la llama |
| `cargarCatalogo` | **No hacia afuera**: captura el `ErrorApi`, lo escribe en `console.error`, aplica el fallback y lo deja en `ResultadoCarga.error` | — (nunca rechaza) |
| `script.js` | No recibe excepciones de la carga: lee `resultado.origen` y `resultado.error?.tipo` para elegir el mensaje | — |

Los errores `ErrorApi` de tipo `datos` (lista vacía o sin registros válidos) los genera `cargarCatalogo` al revisar lo recibido; siguen el mismo camino: se capturan ahí mismo y se aplica el fallback.

**Caché y fallback local: quién hace qué**

| Acción | Módulo | Detalle |
|---|---|---|
| Descargar y validar la estructura | `apiService.js` (`obtenerCatalogoRemoto`) | No lee ni escribe la caché ni usa el catálogo local |
| Validar registros y construir `Producto` | `ProcesadorCatalogo.js` | Función pura, sin Storage |
| Leer la caché | `apiService.js` (`cargarCatalogo`) | Con `FachadaStorage.cargarCatalogo()`, solo cuando la carga remota falla. Devuelve `Catalogo` o `null` (sin datos, corruptos o rechazados por `fromJSON`); un `Catalogo` sin productos se trata como sin caché |
| Escribir la caché | `apiService.js` (`cargarCatalogo`) | Con `FachadaStorage.guardarCatalogo()`, solo cuando la carga remota termina bien (`origen: "red"`) y con los registros válidos. Si devuelve `false`, no es un error de la carga: se sigue sin caché y se registra en consola |
| Usar el catálogo local | `apiService.js` (`cargarCatalogo`) | Importa `productosIniciales` y construye los `Producto`; es el último recurso y no puede fallar con datos del proyecto |
| Mostrar qué fuente se usó | `script.js` | Según `origen` (`red`, `cache` o `local`) |

`apiService.js` no accede a `localStorage` directamente: todo pasa por `FachadaStorage`, el módulo del Desarrollador JS Storage.

### 4.2 Matriz de errores: reintento, caché, fallback local, `ErrorApi` y mensaje

Orden de respaldo cuando la carga remota falla: **caché** (`FachadaStorage.cargarCatalogo()`, solo si existe y tiene productos) → **catálogo local** (`productosIniciales`, siempre disponible). Los textos de la columna «Mensaje» son los que muestra `script.js` en `#catalogo-mensaje`; el detalle técnico va a `console.error`. Cuando `origen` no es `"red"`, `script.js` muestra el botón «Reintentar».

**El tipo `error` de la columna «Mensaje» es un aviso visual** (advertencia por usar un respaldo), no indica que el catálogo no esté disponible: con `cache` o `local` el catálogo está disponible y los cuatro flujos funcionan (sección 2).

| Escenario | `tipo` | ¿Reintenta? | ¿Usa la caché? | ¿Usa el catálogo local? | ¿`ErrorApi`? | Mensaje al usuario |
|---|---|---|---|---|---|---|
| **Error de red** (sin conexión, CORS, fetch rechazado) o **tiempo agotado** (8 s) | `red` | Sí: 2 reintentos (500 ms y 1000 ms) | Sí, si existe | Sí, si no hay caché | Se lanza al agotar los reintentos; la captura `cargarCatalogo` | Durante los reintentos: «No pudimos conectarnos. Reintentando…» (`loading`). Al agotarlos, con caché: «No pudimos actualizar el catálogo. Mostramos la última versión guardada.»; sin caché: «No pudimos conectarnos. Mostramos el catálogo local.» (`error`) |
| **HTTP 404** (y otros 4xx) | `http` | No | Sí, si existe | Sí, si no hay caché | Se lanza de inmediato; la captura `cargarCatalogo` | Con caché: «No encontramos el catálogo. Mostramos la última versión guardada.»; sin caché: «No encontramos el catálogo. Mostramos el catálogo local.» (`error`) |
| **HTTP 500** (y otros 5xx) | `http` | Sí: igual que el error de red | Sí, si existe | Sí, si no hay caché | Se lanza al agotar los reintentos; la captura `cargarCatalogo` | Igual que el error de red |
| **JSON inválido** (el cuerpo no se puede parsear) | `formato` | No | Sí, si existe | Sí, si no hay caché | Se lanza de inmediato; la captura `cargarCatalogo` | Con caché: «El catálogo recibido no es válido. Mostramos la última versión guardada.»; sin caché: «El catálogo recibido no es válido. Mostramos el catálogo local.» (`error`) |
| **Datos con formato incorrecto** (JSON válido, pero sin `productos` o que no es un arreglo) | `formato` | No | Sí, si existe | Sí, si no hay caché | Se lanza de inmediato; la captura `cargarCatalogo` | Igual que JSON inválido |
| **Datos vacíos** (lista vacía o todos los registros inválidos) | `datos` | No | Sí, si existe | Sí, si no hay caché | Lo genera `cargarCatalogo`; lo captura ahí mismo | Con caché: «El catálogo no tiene productos disponibles. Mostramos la última versión guardada.»; sin caché: «El catálogo no tiene productos disponibles. Mostramos el catálogo local.» (`error`) |
| **Algunos registros inválidos** (el resto es válido) | — (no es un error) | No | No: se usan los registros válidos y se guardan en la caché | No | No se lanza | «Se cargaron N productos (M descartados por datos inválidos).» (`success`, `origen: "red"`) |

**Justificación de cada decisión según la fuente elegida** (JSON estático propio, del mismo origen que el sitio, sección 1):
- **Reintentos solo en red y 5xx:** son fallas que pueden ser pasajeras (conexión inestable, hosting reiniciándose). Con un archivo propio servido por el mismo origen, un reintento tiene sentido; más de 2 solo demoraría al usuario.
- **Sin reintentos en 404 y 4xx:** el archivo no está donde se espera (ruta equivocada o archivo borrado). Repetir el pedido da el mismo resultado; se pasa directo al respaldo.
- **Sin reintentos en JSON inválido, formato incorrecto y datos vacíos:** el servidor respondió, pero el contenido es el problema. Volver a pedirlo trae el mismo archivo.
- **Caché antes que el catálogo local:** la caché es la última versión que el sitio sí pudo descargar y validar (precios al día); el catálogo local es el que viene con el código y puede estar desactualizado.
- **El catálogo local siempre disponible:** al ser una fuente propia, el sitio no depende de un tercero; si falla todo, el usuario sigue pudiendo ver productos y comprar, que es lo que el negocio necesita.
- **Registros inválidos parciales no son un error:** descartar solo lo dañado mantiene el resto del catálogo disponible y evita mostrar un error por un único producto mal cargado.
- La caché no tiene vencimiento propio en este rol: se usa si existe y tiene productos. Si el Coordinador/DevOps o Storage definen una antigüedad máxima, se aplica en `cargarCatalogo` sin cambiar el contrato.

### 4.3 Validación y sanitización de lo que llega de la API

- Se valida que la respuesta sea un objeto con un arreglo `productos`.
- Cada registro se valida creando un `Producto` dentro de `try/catch` (reglas del modelo: textos no vacíos, precio numérico, finito y no negativo); se aplica `trim()` a los textos, como ya hace el modelo.
- Los campos de texto se insertan en el DOM con `textContent`, nunca con `innerHTML`, para que un texto con etiquetas o scripts llegue como texto plano.
- Códigos repetidos: se conserva el primero y se descarta el resto.

## 5. Integración con la arquitectura existente

- **Clases POO (`js/models/`):** `construirProductos` crea instancias de `Producto` y se arma un `Catalogo` con ellas, igual que hoy; no se modifican `Producto.js` ni `Catalogo.js`.
- **Storage (`js/utils/storage.js` y `FachadaStorage`):** al cargar con éxito desde la red, el catálogo se guarda con `FachadaStorage.guardarCatalogo()`; si la red falla, se lee con `cargarCatalogo()`. No se agregan claves nuevas ni se cambia el módulo de Thiago.
- **`script.js` sigue siendo solo eventos y DOM:** el `fetch` vive únicamente en `js/api/apiService.js`. El cambio en `script.js` es que el catálogo deja de crearse al importar el módulo y pasa a cargarse al iniciar con `await`.
  - Riesgo conocido: hoy `catalogo` es una constante que existe desde el primer instante y la suite `script.spec.js` (que abre `index.html` en un iframe) asume eso. Con la carga asíncrona, los tests tendrán que esperar a que el catálogo esté **disponible** (con cualquier `origen`) antes de buscar. Se coordina con el Tester QA/JS.
- **SweetAlert2 (Desarrollador JS Librerías Externas):** el diálogo de «Eliminar del carrito» muestra el nombre del producto; con este rol ese nombre llega siempre ya validado por `Producto`, como se acordó en su spec.
- **Estructura de archivos:**

```
api/
└── productos.json
js/
├── api/
│   └── apiService.js
├── services/
│   └── ProcesadorCatalogo.js
└── models/            # sin cambios
```

## 6. Casos de test a coordinar con Tester QA/JS

### 6.1 Casos de la API y los módulos nuevos

Para `js/test/api.spec.js` (el Tester QA/JS los escribe; este rol deja los módulos listos para ser probados con un `fetch` simulado):

Cada caso indica la **función bajo prueba**, porque no todas se comportan igual ante un error: `obtenerJson` y `obtenerCatalogoRemoto` **lanzan** `ErrorApi`; `cargarCatalogo` **nunca lo lanza**: lo captura, aplica el respaldo y lo deja en `resultado.error` (sección 4.1). Los casos con `fetch` usan dobles de prueba (`fetchFn`, `esperarFn`).

**A. Capa de red — `obtenerJson` y `obtenerCatalogoRemoto` (rechazan con `ErrorApi`)**

| # | Función bajo prueba | Caso | Resultado esperado |
|---|---|---|---|
| A1 | `obtenerJson` | Respuesta 200 con JSON válido | Resuelve con el JSON ya parseado; 1 solo intento |
| A2 | `obtenerJson` | Error HTTP 404 | Rechaza con `ErrorApi` (`tipo: "http"`, `estado: 404`), sin reintentar |
| A3 | `obtenerJson` | Error HTTP 500 | Reintenta 2 veces (3 intentos en total) y rechaza con `ErrorApi` (`tipo: "http"`, `estado: 500`) |
| A4 | `obtenerJson` | Error de red (`fetch` rechazado) | Reintenta 2 veces y rechaza con `ErrorApi` (`tipo: "red"`) |
| A5 | `obtenerJson` | Tiempo agotado | Aborta el intento y se trata como error de red: `ErrorApi` (`tipo: "red"`) con `causa` = `AbortError` |
| A6 | `obtenerJson` | El cuerpo no es JSON | Rechaza con `ErrorApi` (`tipo: "formato"`), sin reintentar |
| A7 | `obtenerCatalogoRemoto` | JSON válido pero sin `productos` o que no es un arreglo | Rechaza con `ErrorApi` (`tipo: "formato"`) |
| A8 | `obtenerCatalogoRemoto` | JSON con la estructura esperada | Resuelve con `{ version, registros }` |

**B. Orquestación — `cargarCatalogo` (nunca rechaza; devuelve `ResultadoCarga`)**

| # | Función bajo prueba | Caso | Resultado esperado |
|---|---|---|---|
| B1 | `cargarCatalogo` | Red correcta | `origen: "red"`, `error: null`; llama a `guardarCatalogo` una vez |
| B2 | `cargarCatalogo` | HTTP 404 con caché disponible | No rechaza: `origen: "cache"` y `error.tipo: "http"` |
| B3 | `cargarCatalogo` | HTTP 500 o red caída, sin caché | No rechaza: reintenta 2 veces y devuelve `origen: "local"` con el catálogo de `productosIniciales` y `error.tipo` según el caso (`http` o `red`) |
| B4 | `cargarCatalogo` | JSON inválido o estructura incorrecta | No rechaza: `origen: "cache"` o `"local"` y `error.tipo: "formato"` |
| B5 | `cargarCatalogo` | Registros inválidos mezclados con válidos | `origen: "red"`; `descartados` con M elementos; en la caché solo quedan los válidos |
| B6 | `cargarCatalogo` | Lista vacía o todos los registros inválidos | No rechaza: `origen: "cache"` o `"local"` y `error.tipo: "datos"` |
| B7 | `cargarCatalogo` | Falla de red con `alReintentar` | Llama a `alReintentar` antes de cada reintento (2 veces) |

**C. Procesamiento y pantalla**

| # | Función bajo prueba | Caso | Resultado esperado |
|---|---|---|---|
| C1 | `filtrarValidos`, `construirProductos`, `resumirCatalogo`, `agruparPorCategoria` | `map` / `filter` / `reduce` con casos normales y de borde (lista vacía, un solo elemento, categorías repetidas) | Resultados correctos |
| C2 | `script.js` (DOM) | Carga con `origen: "red"` | Mensaje `success`; tarjetas renderizadas; controles habilitados |
| C3 | `script.js` (DOM) | Carga con `origen: "cache"` o `"local"` | Mensaje `error` como advertencia y botón «Reintentar»; **el catálogo está disponible**: tarjetas renderizadas, controles habilitados y los cuatro flujos operativos |
| C4 | `script.js` (DOM) | Mientras carga y al pulsar «Reintentar» | Estado `loading` con controles deshabilitados; «Reintentar» vuelve a cargar y no inicia un segundo pedido si ya hay uno en curso |

### 6.2 Matriz mínima de los cuatro flujos

Los cuatro flujos son los de `docs/05-diagramas/01-diagrama-de-actividades/diagramas-doc.md`. Cada fila indica qué debe seguir pasando **después** de pasar el catálogo a carga asíncrona. La columna final es el único comportamiento nuevo; el resto es el comportamiento actual de `script.js`, que no debe cambiar.

| Flujo | Precondición | Acción | Resultado esperado | Verificaciones posteriores | Efecto de la carga asíncrona |
|---|---|---|---|---|---|
| **1. Búsqueda y filtrado** | Catálogo **disponible** (con `origen` `red`, `cache` o `local`; el mensaje puede ser de éxito o de advertencia, sección 2) | Escribir un texto en el buscador, o cambiar categoría, orden o precio máximo | Se renderizan solo las tarjetas que coinciden y `#catalogo-mensaje` dice «N producto(s) encontrado(s).» (o «Sin coincidencias.») | La cantidad de tarjetas en `#resultados-catalogo` es igual a N; el carrito guardado no cambia; con un precio máximo inválido se marca el control y se muestra el error sin borrar las tarjetas | Mientras el catálogo está `cargando` los controles están deshabilitados y la búsqueda no corre. Cuando queda disponible, con cualquier `origen`, se ejecuta la búsqueda inicial (`buscarYMostrarCatalogo`) |
| **2. Carrito** | Catálogo **disponible** (con cualquier `origen`) | Agregar un producto desde su tarjeta, cambiar su cantidad y luego eliminarlo | Tras agregar, el panel del carrito muestra el ítem con su subtotal y el total; tras eliminar, el carrito queda vacío | El carrito se guarda con `FachadaStorage.guardarCarrito` después de cada operación válida; cualquier cambio descarta el pago y el pedido pendientes | No hay tarjetas, y por lo tanto nada que agregar, hasta que el catálogo está disponible. Los productos agregados provienen del catálogo cargado (red, caché o local) |
| **3. Pago y cuotas** | Carrito con al menos un ítem; se pulsó «Iniciar compra» | Elegir el método de pago y, para tarjeta, las cuotas | `#condiciones-pago` muestra total original, recargo, interés, total financiado y valor de cuota, calculados con los precios del carrito | El carrito no se modifica; no se guarda ningún pedido; con «Cancelar pago» se ocultan pago y confirmación y se conservan los productos | No depende del `fetch`. Los precios usados son los del catálogo cargado en ese momento |
| **4. Resumen y confirmación** | Condiciones de pago calculadas y datos del cliente válidos (nombre, correo, dirección) | Confirmar el pedido (y, en otro caso, cancelarlo) | Al confirmar: «Pedido confirmado: *número*» y «La operacion se realizo correctamente.»; al cancelar se conservan el carrito y las condiciones de pago | Al confirmar: el carrito queda vacío en pantalla y en el storage, se guarda el pedido en el historial, la secuencia de pedidos aumenta en 1 y la sección de pago se oculta | No hace ningún `fetch`: la confirmación no puede quedar bloqueada por la red ni por el estado del catálogo |

Verificaciones transversales de la matriz (para cada flujo):
- No se llama a `fetch` fuera de `apiService.js`.
- Con la red caída (respaldo `cache` o `local`), el mensaje es de advertencia pero el catálogo está disponible: los cuatro flujos se completan igual que con `origen: "red"`.
- La carga inicial no deja el catálogo vacío en ningún caso.

### 6.3 Comportamientos a preservar (verificaciones de regresión)

La integración de `fetch` no debe cambiar el comportamiento de los cuatro flujos existentes. Esta sección fija **qué se mantiene**, en términos generales; los casos de prueba específicos se definen después, en coordinación con el Tester QA/JS, a partir de la matriz 6.2.

| Flujo | Comportamiento general que debe mantenerse después de la integración de `fetch` |
|---|---|
| **1. Búsqueda y filtrado** | Los criterios de texto, categoría y precio máximo siguen filtrando; el orden sigue funcionando; un criterio inválido sigue mostrando su error; el mensaje con la cantidad de resultados (o «Sin coincidencias») se mantiene; la selección de categoría desde el menú sigue actualizando el catálogo. |
| **2. Carrito** | Siguen funcionando agregar, cambiar la cantidad (con su validación) y eliminar productos; subtotales y total se recalculan; el carrito se sigue guardando con `FachadaStorage`; cualquier cambio del carrito sigue descartando el pago y el pedido pendientes; «Iniciar compra» sigue exigiendo al menos un ítem. |
| **3. Pago y cuotas** | Siguen la selección del método de pago y de las cuotas para tarjeta; el cálculo de condiciones (total original, recargo, interés, total financiado y valor de cuota) no cambia; «Cancelar pago» sigue conservando el carrito. |
| **4. Resumen y confirmación** | Siguen la validación de los datos del cliente con errores junto a cada control; el resumen del pedido; la confirmación que genera el número de pedido y vacía el carrito y el pago; y la cancelación, que conserva el carrito y las condiciones de pago. |

Regla común: la carga asíncrona **solo cambia cuándo está disponible el catálogo** (y desde qué fuente), no las reglas de ningún flujo. Si algo de esta tabla deja de cumplirse, es una regresión y se reporta como issue al rol correspondiente.

Los tres Test Cases de Lighthouse (baseline, post-fetch y post-librería) son responsabilidad del Tester QA/JS. De este rol dependen dos cosas: el baseline debe medirse **antes** de integrar el fetch, y la carga asíncrona no debe empeorar el rendimiento (umbral ≥ 95).

## 7. Criterios de aceptación

- [ ] `api/productos.json` con los 9 productos del proyecto, sin cambios de códigos ni precios.
- [ ] `js/api/apiService.js` implementado con `fetch`, `async/await` y `try/catch`, documentado con JSDoc.
- [ ] El `fetch` está solo en `apiService.js`; `script.js` no llama a `fetch` directamente.
- [ ] Los tres estados visuales (loading / success / error) se ven en la interfaz, con `aria-busy` y mensajes en `#catalogo-mensaje`, y se distingue la disponibilidad del catálogo del mensaje: con un respaldo (`cache` o `local`) se muestra la advertencia y los cuatro flujos siguen funcionando.
- [ ] Manejo de errores completo: red, HTTP 4xx/5xx, formato inválido y datos inválidos, con mensajes amigables (sin detalles técnicos en pantalla).
- [ ] Reintentos con espera creciente (máx. 2) y tiempo límite de 8 s por intento.
- [ ] Fallbacks funcionando: caché en `localStorage` y luego `productosIniciales`.
- [ ] `map`, `filter` y `reduce` aplicados a la colección en `ProcesadorCatalogo.js`.
- [ ] Datos validados y sanitizados; el contenido de la API se inserta con `textContent`.
- [ ] Datos integrados al DOM dinámicamente y guardados con `FachadaStorage`.
- [ ] Casos de test coordinados con el Tester QA/JS (sección 6).
- [ ] Comportamientos de los cuatro flujos preservados (sección 6.3), con sus casos específicos definidos junto al Tester QA/JS.
- [ ] Issues respondidas, PR a `develop` revisada por el Coordinador/DevOps y línea en `changelog.md` con link a la PR y a la issue.

## 8. Herramientas y coordinación

**Herramienta de IA:** Claude (Anthropic), con este archivo, `js/script.js`, `js/models/`, `js/services/FachadaStorage.js` e `index.html` como contexto. Se registran el prompt exacto y los ajustes manuales en la sección AT CLOSE.

**Coordinación:**
- **Tester QA/JS:** `api.spec.js`, actualización de `script.spec.js` (carga asíncrona) y Lighthouse. Se le avisa cuándo está lista la rama para el Test Case 2.
- **Desarrollador JS Librerías Externas:** el nombre de producto que muestra su diálogo llega validado por `Producto`.
- **Coordinador/DevOps:** revisión de la PR, `changelog.md` y orden de integración a `develop`.

---

# AT CLOSE — Se completa al cerrar la tarea (evidencia)

_Esta sección se completa **después** de terminar el código, con el contenido real del trabajo._

## 1. Prompt exacto utilizado y ajustes manuales realizados

_Pendiente._

## 2. Resumen de la integración con las clases POO y con Storage

_Pendiente._

## 3. Issues respondidas y su resolución

_Pendiente._
