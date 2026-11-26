# Spec — Desarrollador JS Asíncrono (Fetch & APIs)

- **Segundo Parcial — Programación Web I (UCES)**
- **Grupo:** GRP05 · **Rol:** Desarrollador JS Asíncrono · **Integrante:** Alan Díaz (@alandox1)
- **Rama de trabajo:** `feature/dev-async-fetch-api` → `develop`
- **Issue asociada:** [#<completar>](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/issues/<completar>)

**Entregables del rol:**
- `api/productos.json`: catálogo en JSON estático, servido por el propio sitio.
- `js/api/apiService.js`: módulo dedicado al consumo asíncrono (fetch, tiempo límite, reintentos, errores). No toca el DOM.
- `js/services/ProcesadorCatalogo.js`: funciones puras de orden superior (`map`, `filter`, `reduce`) que procesan lo recibido.
- `js/script.js`: carga inicial asíncrona del catálogo y manejo de los estados en pantalla.
- `index.html` y `css/components.css`: contenedores y estilos de los estados de carga (solo lo mínimo).
- Este archivo: `docs/03-specs/segundo-parcial/spec-dev-async-fetch.md`.

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

El catálogo pasa a tener tres estados visibles. Se reutilizan los elementos que ya existen en `index.html`: `#catalogo-mensaje` (`role="status"`, `aria-live="polite"`) y `#resultados-catalogo`.

| Estado | Qué ve el usuario | Dónde |
|---|---|---|
| **loading** | Mensaje «Cargando catálogo…» y un indicador de carga (spinner de Bootstrap con texto accesible). Los controles de búsqueda y filtros quedan deshabilitados. | `#catalogo-mensaje`, `#resultados-catalogo` con `aria-busy="true"` |
| **success** | Se quitan el indicador y `aria-busy`; se renderizan las tarjetas (flujo actual) y el mensaje indica «N producto(s) cargado(s)» con el resumen del catálogo (sección 3). Los controles se habilitan. | `#catalogo-mensaje`, `#resultados-catalogo` |
| **error** | Mensaje amigable, sin detalles técnicos («No pudimos cargar el catálogo. Mostramos la última versión guardada» o «…Reintentá en unos minutos»), según el caso de la sección 4, y botón **«Reintentar»**. | `#catalogo-mensaje` (tipo `error`) |

Reglas:
- El detalle técnico (código HTTP, causa) va a `console.error`, no a la pantalla.
- Se reutiliza `mostrarMensaje()` y los tipos `info` / `success` / `error` que ya existen, sin tocar su comportamiento.
- Tiempo máximo de espera por intento: 8 segundos (`AbortController`); pasado ese tiempo se considera error de red.
- Un solo pedido en vuelo: mientras hay una carga en curso, «Reintentar» no inicia otra.

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

**Estructura en `apiService.js`:** una función `async` por responsabilidad, con `try/catch`, que lanza un error propio (`ErrorApi`) con un `tipo` para que la interfaz decida qué mostrar, sin depender del texto del mensaje.

| Caso | `tipo` | Qué hace | Mensaje al usuario |
|---|---|---|---|
| Sin conexión / red caída / CORS / tiempo agotado | `red` | Reintenta hasta 2 veces con espera creciente (500 ms y 1000 ms) | «No pudimos conectarnos. Reintentando…» y, si falla, error con botón «Reintentar» |
| HTTP 5xx | `http` | Reintenta como el caso anterior | Igual que el anterior |
| HTTP 4xx (ej. 404) | `http` | No reintenta (no se va a arreglar solo) | «No encontramos el catálogo.» |
| Respuesta que no es JSON válido | `formato` | No reintenta | «El catálogo recibido no es válido.» |
| JSON válido pero con estructura inesperada (sin `productos`, no es un arreglo) | `formato` | No reintenta | Igual que el anterior |
| Algunos registros inválidos | — | Se descartan solo esos; los demás se usan | «Se cargaron N productos (M descartados por datos inválidos).» |
| Todos los registros inválidos o lista vacía | `datos` | Se trata como error | «El catálogo no tiene productos disponibles.» |

**Fallbacks (en este orden):**
1. Caché del catálogo en `localStorage` (`CLAVES.CACHE_CATALOGO`, vía `FachadaStorage.cargarCatalogo()`).
2. `productosIniciales`, el arreglo local que ya existe, como último recurso, para que el sitio nunca quede sin catálogo (por ejemplo, abierto sin servidor).

El mensaje indica siempre cuál se está usando («Mostrando la última versión guardada» / «Mostrando el catálogo local»).

**Validación y sanitización de lo que llega de la API:**
- Se valida que la respuesta sea un objeto con un arreglo `productos`.
- Cada registro se valida creando un `Producto` dentro de `try/catch` (reglas del modelo: textos no vacíos, precio numérico, finito y no negativo); se aplica `trim()` a los textos, como ya hace el modelo.
- Los campos de texto se insertan en el DOM con `textContent`, nunca con `innerHTML`, para que un texto con etiquetas o scripts llegue como texto plano.
- Códigos repetidos: se conserva el primero y se descarta el resto.

## 5. Integración con la arquitectura existente

- **Clases POO (`js/models/`):** `construirProductos` crea instancias de `Producto` y se arma un `Catalogo` con ellas, igual que hoy; no se modifican `Producto.js` ni `Catalogo.js`.
- **Storage (`js/utils/storage.js` y `FachadaStorage`):** al cargar con éxito desde la red, el catálogo se guarda con `FachadaStorage.guardarCatalogo()`; si la red falla, se lee con `cargarCatalogo()`. No se agregan claves nuevas ni se cambia el módulo de Thiago.
- **`script.js` sigue siendo solo eventos y DOM:** el `fetch` vive únicamente en `js/api/apiService.js`. El cambio en `script.js` es que el catálogo deja de crearse al importar el módulo y pasa a cargarse al iniciar con `await`.
  - Riesgo conocido: hoy `catalogo` es una constante que existe desde el primer instante y la suite `script.spec.js` (que abre `index.html` en un iframe) asume eso. Con la carga asíncrona, los tests tendrán que esperar al estado «success» antes de buscar. Se coordina con el Tester QA/JS.
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

Para `js/test/api.spec.js` (el Tester QA/JS los escribe; este rol deja los módulos listos para ser probados con un `fetch` simulado):

| # | Caso | Resultado esperado |
|---|---|---|
| 1 | `fetch` exitoso con JSON válido | Devuelve los productos y llama a `guardarCatalogo` |
| 2 | Error HTTP 404 | Lanza `ErrorApi` con `tipo: "http"`, sin reintentar |
| 3 | Error HTTP 500 | Reintenta 2 veces y luego lanza `ErrorApi` |
| 4 | Error de red (`fetch` rechazado) | Reintenta y, si sigue fallando, usa el fallback |
| 5 | Tiempo agotado | Aborta y se trata como error de red |
| 6 | Respuesta que no es JSON / estructura inesperada | `ErrorApi` con `tipo: "formato"` |
| 7 | Registros inválidos mezclados con válidos | Descarta solo los inválidos y reporta cuántos |
| 8 | `map` / `filter` / `reduce` de `ProcesadorCatalogo` | Resultados correctos con casos normales y de borde (lista vacía, un solo elemento, categorías repetidas) |
| 9 | Integración con el DOM | Los tres estados (loading / success / error) se ven y el botón «Reintentar» vuelve a cargar |
| 10 | Fallbacks | Con red caída y caché disponible usa la caché; sin caché usa `productosIniciales` |

Los tres Test Cases de Lighthouse (baseline, post-fetch y post-librería) son responsabilidad del Tester QA/JS. De este rol dependen dos cosas: el baseline debe medirse **antes** de integrar el fetch, y la carga asíncrona no debe empeorar el rendimiento (umbral ≥ 95).

## 7. Criterios de aceptación

- [ ] `api/productos.json` con los 9 productos del proyecto, sin cambios de códigos ni precios.
- [ ] `js/api/apiService.js` implementado con `fetch`, `async/await` y `try/catch`, documentado con JSDoc.
- [ ] El `fetch` está solo en `apiService.js`; `script.js` no llama a `fetch` directamente.
- [ ] Los tres estados (loading / success / error) se ven en la interfaz, con `aria-busy` y mensajes en `#catalogo-mensaje`.
- [ ] Manejo de errores completo: red, HTTP 4xx/5xx, formato inválido y datos inválidos, con mensajes amigables (sin detalles técnicos en pantalla).
- [ ] Reintentos con espera creciente (máx. 2) y tiempo límite de 8 s por intento.
- [ ] Fallbacks funcionando: caché en `localStorage` y luego `productosIniciales`.
- [ ] `map`, `filter` y `reduce` aplicados a la colección en `ProcesadorCatalogo.js`.
- [ ] Datos validados y sanitizados; el contenido de la API se inserta con `textContent`.
- [ ] Datos integrados al DOM dinámicamente y guardados con `FachadaStorage`.
- [ ] Casos de test coordinados con el Tester QA/JS (sección 6).
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
