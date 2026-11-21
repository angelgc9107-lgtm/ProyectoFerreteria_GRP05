# Spec — Desarrollador JS Local y Session Storage

**Actividad Obligatoria N.º 4 — Programación Web I (UCES)**
**Grupo:** GRP05 · **Rol:** Desarrollador JS Local y Session Storage · **Integrante:** Thiago Piastrellini (@Piastrellini)
**Rama de trabajo:** `feature/dev-storage` → `develop`
**Issue asociada:** [#142](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/issues/142)

**Entregables del rol:**
- `js/utils/storage.js` (capa de abstracción, estilo ORM)
- `docs/06-storage/storage-doc.md` (estrategia y documentación del storage)
- Este archivo: `docs/03-specs/actividad-obligatoria-4/spec-dev-storage.md`

> Orden obligatorio de commits: este archivo (sección BEFORE) se commitea **antes** que `js/utils/storage.js`.

---

# BEFORE — Se completa antes de abrir Claude Code o escribir código

## 1. Estrategia de almacenamiento

El criterio es la vida útil del dato: si debe sobrevivir al cierre del navegador va a `localStorage`; si solo tiene sentido durante la visita actual va a `sessionStorage`.

| Dato | Storage | Justificación |
|---|---|---|
| Carrito de compras | `localStorage` | El cliente espera encontrar su carrito al volver otro día. |
| Historial de pedidos confirmados | `localStorage` | Es información que el usuario consulta entre sesiones. |
| Número correlativo del próximo pedido | `localStorage` | Sin esto la numeración vuelve a 1 al recargar la página. |
| Preferencias del usuario (categoría favorita, método de pago preferido) | `localStorage` | Preferencias que se mantienen entre visitas. |
| Caché del catálogo de productos (con marca de tiempo) | `localStorage` | Evita reconstruir el catálogo en cada visita; se invalida por antigüedad. |
| Borrador del formulario de checkout (datos del cliente, método de pago, cuotas) | `sessionStorage` | Dato sensible y temporal: no debe quedar guardado al cerrar la pestaña. |
| Filtros activos del catálogo (texto, categoría, precio máximo, orden) | `sessionStorage` | Estado de navegación de la visita actual. |
| Indicador de mensaje de bienvenida ya mostrado | `sessionStorage` | Se vuelve a mostrar en cada visita nueva, una sola vez por sesión. |

Regla general: **nunca** se guardan datos de tarjeta ni información que no sea necesaria para reconstruir la interfaz.

## 2. Convención de nombres de claves

Formato: `app:<dominio>:<recurso>` — minúsculas, palabras separadas por guion si hace falta.

| Constante (`CLAVES`) | Clave | Storage |
|---|---|---|
| `CARRITO` | `app:carrito:items` | local |
| `PEDIDOS` | `app:pedidos:historial` | local |
| `SECUENCIA_PEDIDOS` | `app:pedidos:secuencia` | local |
| `PREFERENCIAS` | `app:usuario:preferencias` | local |
| `CACHE_CATALOGO` | `app:catalogo:cache` | local |
| `BORRADOR_CHECKOUT` | `app:checkout:borrador` | session |
| `FILTROS_CATALOGO` | `app:catalogo:filtros` | session |
| `BIENVENIDA_VISTA` | `app:ui:bienvenida-vista` | session |

El prefijo `app:` es obligatorio: permite listar y limpiar solo los datos de este proyecto. En GitHub Pages todos los repositorios del mismo usuario comparten el origen (`usuario.github.io`), así que un `clear()` total podría borrar datos de otros sitios.

## 3. Estructura de datos (schemas JSON)

Todos los valores se guardan serializados con `JSON.stringify`. Los campos del carrito, los pedidos y los productos son los que devuelven `toJSON()` en `js/models/` (confirmados con el código del Desarrollador JS POO); el resto lo define este módulo.

**`app:carrito:items`** — `Carrito.toJSON()`. No se guardan subtotales: los recalcula `resumir()`.

```json
{
  "items": [
    { "codigo": "MARTILLO-001", "nombre": "Martillo", "categoria": "Herramientas", "precio": 1000, "cantidad": 2 }
  ]
}
```

**`app:pedidos:historial`** — array de `Pedido.toJSON()`.

```json
[
  {
    "cliente": { "nombre": "Ana", "correo": "ana@mail.com", "direccion": "Calle 123" },
    "productos": [
      { "codigo": "MARTILLO-001", "nombre": "Martillo", "categoria": "Herramientas", "precio": 1000, "cantidad": 2, "subtotal": 2000 }
    ],
    "total": 2000,
    "pago": {
      "valido": true, "error": null, "metodoPago": "tarjeta", "cuotas": 3,
      "porcentajeRecargo": 10, "totalOriginal": 2000, "interes": 200,
      "totalFinanciado": 2200, "valorCuota": 733.33
    },
    "numero": "FL-1730000000000-0001"
  }
]
```

**`app:pedidos:secuencia`** — próximo número correlativo de pedido.

```json
4
```

**`app:usuario:preferencias`**

```json
{ "categoriaFavorita": "Herramientas", "metodoPagoPreferido": "tarjeta" }
```

**`app:catalogo:cache`** — productos con `Producto.toJSON()`; válida mientras `Date.now() - guardadoEn < ttlMs`.

```json
{
  "guardadoEn": 1730000000000,
  "ttlMs": 3600000,
  "productos": [
    { "codigo": "MARTILLO-001", "nombre": "Martillo", "categoria": "Herramientas", "descripcion": "Martillo de acero", "precio": 1000 }
  ]
}
```

**`app:checkout:borrador`** (session) — sin datos de tarjeta.

```json
{
  "cliente": { "nombre": "Ana", "correo": "ana@mail.com", "direccion": "Calle 123" },
  "metodoPago": "tarjeta",
  "cuotas": 3
}
```

**`app:catalogo:filtros`** (session) — mismos campos que el formulario de búsqueda (`orden`: `asc` o `desc`).

```json
{ "texto": "martillo", "categoria": "Herramientas", "precioMaximo": 5000, "orden": "asc" }
```

**`app:ui:bienvenida-vista`** (session)

```json
true
```

## 4. Diseño de la API (`js/utils/storage.js`)

Módulo ES6 que exporta `StorageUtil` (también como default), `CLAVES` y `PREFIJO_APP`. Todas las funciones reciben `tipo` (`'local'` por defecto, o `'session'`).

| Función | Descripción | Retorno |
|---|---|---|
| `guardar(clave, valor, tipo)` | Crea o reemplaza el dato (serializa a JSON). | `boolean` |
| `obtener(clave, tipo)` | Recupera y deserializa. | valor o `null` |
| `actualizar(clave, valor, tipo)` | Actualiza solo si la clave ya existe. | `boolean` |
| `eliminar(clave, tipo)` | Elimina el dato (idempotente). | `boolean` |
| `listar(prefijo, tipo)` | Claves que empiezan con el prefijo, ordenadas. | `string[]` |
| `limpiar(tipo, soloApp = true)` | Borra las claves `app:*` (o todo si `soloApp = false`). | `boolean` |
| `existe(clave, tipo)` / `estaDisponible(tipo)` | Consultas auxiliares. | `boolean` |
| `guardarInstancia` / `cargarInstancia` / `guardarLista` / `cargarLista` | Integración con las clases de `js/models/` mediante `toJSON()` / `fromJSON()`. | ver doc |

Decisión de diseño: `actualizar()` no crea claves (difiere de `guardar()`), para que un error de tipeo en la clave no genere datos huérfanos.

## 5. Manejo de errores

- Todas las operaciones van dentro de `try/catch`; el módulo **nunca lanza excepciones** hacia el resto de la aplicación.
- Storage lleno (`QuotaExceededError`): se registra con `console.error` y se devuelve `false`.
- Datos corruptos (JSON inválido): se registra con `console.error` y `obtener()` devuelve `null`.
- Storage inaccesible (`SecurityError`, modo privado): se registra y se devuelve el valor de fallo.
- Tipo de storage o clave inválidos: se registra y se devuelve el valor de fallo.
- Valores no serializables (`undefined`, funciones, referencias circulares): se rechazan con `false`.

## 6. Criterios de aceptación

- [X] `js/utils/storage.js` implementa `guardar`, `obtener`, `actualizar`, `eliminar`, `listar` y `limpiar` con la firma definida.
- [X] Todas las operaciones tienen manejo de errores con `try/catch` y no lanzan excepciones.
- [X] Serialización y deserialización automática de JSON.
- [X] Manejo de storage lleno y de datos corruptos con logs informativos.
- [X] Integración con las clases de `js/models/` mediante `toJSON()` / `fromJSON()` coordinada con el Desarrollador JS POO.
- [X] `docs/06-storage/storage-doc.md` documenta qué se guarda, estructura de claves, schemas JSON, diferencia local vs session y ejemplos de uso.
- [X] Código documentado con JSDoc y comentarios.
- [X] Sin `prompt()`, `alert()` ni `console.log` innecesarios en el módulo.
- [X] Rama `feature/dev-storage`, al menos un commit relevante, issue asociada, PR hacia `develop` con aprobación de otro integrante y entrada en `changelog.md`.

## 7. Herramientas y coordinación

**Herramienta:** Claude Code (agente de IA de Anthropic), en lugar de GitHub Copilot en modo Agente, con las clases de `js/models/` y este archivo como contexto. Motivo: no se dispone de tokens en GitHub Copilot Agent Mode. Se deja constancia de que esto difiere de lo que pide la consigna (§2.2.9).

**Coordinación:**
- Con el **Desarrollador JS POO**: confirmar qué clases se persisten (carrito, pedido, producto) y que implementen `toJSON()` / `fromJSON()`.
- Con el **Desarrollador JS Eventos + DOM**: qué claves usa la interfaz y cómo avisar al usuario si `estaDisponible()` devuelve `false`.
- Con el **Tester QA**: simulación de `Storage` en los tests de `storage.spec.js` y atención a los issues que reporte.

---

# AT CLOSE — Se completa al cerrar la tarea (evidencia)

_Esta sección se completa **después** de usar Claude Code, con el contenido real de la sesión._

## 1. Prompt exacto utilizado en Claude Code

Archivos adjuntados como contexto: `js/models/Producto.js`, `js/models/Catalogo.js`, `js/models/Carrito.js`, `js/models/Pago.js`, `js/models/Pedido.js` y `docs/03-specs/actividad-obligatoria-4/spec-dev-storage.md`.

```text
Actuá como un senior JavaScript developer. Necesito implementar el módulo js/utils/storage.js de un proyecto web de ferretería (HTML + JavaScript ES6, sin frameworks), siguiendo la especificación de docs/03-specs/actividad-obligatoria-4/spec-dev-storage.md (adjunta) y las clases de js/models/ (adjuntas: Producto.js, Catalogo.js, Carrito.js, Pago.js, Pedido.js).

Requisitos:

1. Módulo ES6 que exporta `StorageUtil` (también como default), `CLAVES` (objeto congelado) y `PREFIJO_APP = 'app:'`.

2. `CLAVES` con exactamente las claves de la sección 2 del spec (formato app:<dominio>:<recurso>): CARRITO, PEDIDOS, SECUENCIA_PEDIDOS, PREFERENCIAS, CACHE_CATALOGO (local) y BORRADOR_CHECKOUT, FILTROS_CATALOGO, BIENVENIDA_VISTA (session).

3. Funciones de `StorageUtil`, todas con el parámetro `tipo` ('local' por defecto o 'session'):
   - guardar(clave, valor, tipo) -> boolean (serializa con JSON.stringify; rechaza valores no serializables como undefined o referencias circulares)
   - obtener(clave, tipo) -> valor deserializado o null
   - actualizar(clave, valor, tipo) -> boolean (solo si la clave ya existe)
   - eliminar(clave, tipo) -> boolean (idempotente)
   - listar(prefijo, tipo) -> string[] ordenado
   - limpiar(tipo, soloApp = true) -> boolean (por defecto borra solo las claves con prefijo "app:")
   - existe(clave, tipo) y estaDisponible(tipo) -> boolean (esta última prueba una escritura real)
   - guardarInstancia(clave, instancia, tipo), cargarInstancia(clave, Clase, tipo), guardarLista(clave, instancias, tipo), cargarLista(clave, Clase, tipo): integración con las clases de js/models/ usando instancia.toJSON() y Clase.fromJSON(datos). Revisá los archivos adjuntos para respetar sus contratos.

4. Manejo de errores:
   - Todo va dentro de try/catch y el módulo NUNCA lanza excepciones hacia afuera: devuelve false, null o [] según corresponda y registra con console.error.
   - Detectar storage lleno (QuotaExceededError y variantes de otros navegadores) con un mensaje claro.
   - Datos corruptos (JSON inválido) -> obtener() devuelve null.
   - Datos con JSON válido pero que fromJSON() rechaza -> cargarInstancia devuelve null y cargarLista devuelve [].
   - Clave vacía o no string, y tipo distinto de 'local'/'session' -> error registrado y valor de fallo.
   - Storage inaccesible (SecurityError): no acceder a localStorage/sessionStorage al cargar el módulo, resolverlos en cada llamada para poder simularlos en los tests.

5. Estilo: JSDoc en cada función exportada y comentarios breves donde haga falta, sin prompt(), alert() ni console.log innecesarios, sin dependencias externas, sin usar window directamente (usar globalThis).

Devolvé solo el código completo de js/utils/storage.js. No modifiques ningún otro archivo.
```

## 2. Output generado por Claude Code (fragmento de al menos una función CRUD)

Claude Code escribió `js/utils/storage.js` completo (513 líneas) directamente en el repositorio. Fragmento de `guardar()` y `obtener()`, sin modificar:

```javascript
/**
 * Crea o reemplaza un dato serializándolo a JSON.
 * @param {string} clave Clave (preferentemente una de CLAVES).
 * @param {*} valor Valor serializable con JSON.stringify (no undefined, funciones ni ciclos).
 * @param {"local"|"session"} [tipo="local"] Storage destino.
 * @returns {boolean} true si se guardó.
 * @example StorageUtil.guardar(CLAVES.PREFERENCIAS, { categoriaFavorita: "Herramientas" });
 */
function guardar(clave, valor, tipo = "local") {
    try {
        const storage = prepararOperacion(clave, tipo);
        if (!storage) return false;
        const texto = serializar(valor, clave);
        if (texto === null) return false;
        return escribir(storage, clave, texto, tipo);
    } catch (error) {
        registrarError(`Error inesperado al guardar "${String(clave)}".`, error);
        return false;
    }
}

/**
 * Recupera y deserializa un dato.
 * @param {string} clave Clave a leer.
 * @param {"local"|"session"} [tipo="local"] Storage origen.
 * @returns {*} Valor deserializado, o null si no existe, está corrupto o hubo un error.
 * @example const filtros = StorageUtil.obtener(CLAVES.FILTROS_CATALOGO, "session");
 */
function obtener(clave, tipo = "local") {
    try {
        const storage = prepararOperacion(clave, tipo);
        if (!storage) return null;
        const texto = storage.getItem(clave);
        if (texto === null) return null;
        try {
            return JSON.parse(texto);
        } catch (error) {
            registrarError(`Datos corruptos en "${clave}" (${TIPOS[tipo]}): no es JSON válido.`, error);
            return null;
        }
    } catch (error) {
        registrarError(`No se pudo leer "${String(clave)}".`, error);
        return null;
    }
}
```

## 3. Ajustes manuales realizados y justificación

| Ajuste | Justificación |
|---|---|
| `js/utils/storage.js`: versión inicial sin cambios sobre lo generado por Claude Code (el fragmento de la sección 2 corresponde a esa versión). | Se revisó contra la API del spec (firmas, retornos, claves y manejo de errores) y contra los contratos de `toJSON()` / `fromJSON()` de `js/models/`. La revisión posterior de Alan encontró tres fallas en dos rondas, corregidas en las filas siguientes. |
| `storage.js` — `estaDisponible()` (hallazgo #1 de la revisión de la PR): la clave de prueba ahora es única en cada llamada (`app:__prueba-disponibilidad__-<fecha>-<aleatorio>`) y se verifica que se haya borrado; si no, devuelve `false`. | La clave fija podía pisar y luego borrar datos si ya existía con ese nombre. No se usó `crypto.randomUUID()` porque solo existe en contextos seguros (HTTPS). |
| `storage.js` — `serializar()` (hallazgo #2 de la revisión de la PR): se agregó `esEstructuraSerializable()`, que recorre el valor en profundidad y rechaza `undefined`, funciones, símbolos, BigInt y referencias circulares en cualquier nivel (respetando `toJSON()`). | El código generado solo detectaba valores no serializables en el nivel raíz: una función dentro de un objeto se descartaba sin aviso, en contra del criterio de la sección 5 del spec. |
| `storage.js` — `serializar()` (hallazgo #3, segunda revisión de la PR): se reemplazó `esEstructuraSerializable()` por `normalizarParaJSON()` / `normalizarValor()`, que validan y arman en una sola pasada una copia plana del valor; `JSON.stringify()` se aplica sobre esa copia. | La validación anterior ejecutaba `toJSON()` y después `JSON.stringify()` lo volvía a ejecutar: si `toJSON()` tenía efectos secundarios o devolvía otro resultado, se validaba un contenido distinto al que se guardaba. Ahora cada `toJSON()` corre una sola vez y lo validado es exactamente lo guardado. |
| `storage-doc.md`: `listar()` sin prefijo lista solo las claves `app:*` (con `''` lista todas). | Claude Code definió ese valor por defecto por su cuenta; se documentó para que la doc refleje el comportamiento real. |
| `storage-doc.md`: aclarado que `NaN` / `Infinity` se guardan como `null`, que un `null` guardado se lee igual que una clave inexistente (usar `existe()`) y el comportamiento corregido de `estaDisponible()` y del rechazo en profundidad. | Son comportamientos reales del módulo que la documentación debe reflejar. |
| `storage-doc.md`: `guardarLista` rechaza elementos sin `toJSON()` y `cargarLista` es todo o nada. | Evita datos parciales o mezclados en el historial de pedidos. |
| Spec (sección BEFORE): schemas y estrategia alineados con los campos reales de `js/models/` y alta de la clave `SECUENCIA_PEDIDOS`. | Los schemas iniciales eran preliminares; al estar disponible la PR del Desarrollador JS POO se confirmaron con su `toJSON()`. |

## 4. Decisiones finales

- **Estrategia definitiva:** 8 claves con formato `app:<dominio>:<recurso>`: carrito, historial de pedidos, secuencia de pedidos, preferencias y caché del catálogo en `localStorage`; borrador del checkout, filtros del catálogo y mensaje de bienvenida en `sessionStorage`. `limpiar()` borra solo las claves `app:*` porque en GitHub Pages el origen se comparte entre repositorios del mismo usuario.
- **Serialización de instancias:** se tomó el contrato de las clases de la PR del Desarrollador JS POO. `Carrito` se guarda con `toJSON()` (`{items: [...]}`) y se restaura con `Carrito.fromJSON()`; los pedidos se guardan como lista de `Pedido.toJSON()`. Como `fromJSON()` valida los datos, un dato alterado se descarta y la aplicación puede arrancar con un carrito vacío.
- **Decisiones que tomó Claude Code y se aceptaron:** `listar()` sin prefijo usa `app:`; `cargarLista()` es todo o nada; los valores no serializables se rechazan en cualquier nivel (ajustado tras la revisión de la PR); un `null` guardado equivale a clave inexistente (se distingue con `existe()`).
- **Verificación:** además de la revisión manual, el módulo se contrastó con una implementación de referencia y un conjunto de pruebas con `Storage` simulado y con las clases reales, elaborados en una conversación aparte con Claude (claude.ai). El módulo entregado es el generado por Claude Code más las tres correcciones posteriores a las revisiones de @alandox1, redactadas con ayuda de Claude en esa misma conversación aparte y verificadas con pruebas propias (16 pruebas específicas de los hallazgos #1 y #2 más la regresión completa con las clases reales, y 36 pruebas con `Storage` simulado en Node para el hallazgo #3). Queda pendiente la cobertura formal de `storage.spec.js` a cargo del Tester QA.
- **Revisión de la PR:** Alan Diaz (@alandox1) reportó tres hallazgos de severidad media sobre `storage.js`: en la primera revisión, #1 clave fija en `estaDisponible()` y #2 validación solo en el nivel raíz; en la segunda, #3 doble ejecución de `toJSON()` al validar y serializar. Se aceptaron los tres y se corrigieron en commits posteriores.
- **Integración pendiente:** el Desarrollador JS Eventos + DOM todavía no usa `StorageUtil` en `script.js`; los puntos de integración están descriptos en `docs/06-storage/storage-doc.md`.