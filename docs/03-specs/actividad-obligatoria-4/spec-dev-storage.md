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
| Preferencias del usuario (categoría favorita, método de pago preferido) | `localStorage` | Preferencias que se mantienen entre visitas. |
| Caché del catálogo de productos (con marca de tiempo) | `localStorage` | Evita reconstruir el catálogo en cada visita; se invalida por antigüedad. |
| Borrador del formulario de checkout (dirección, método de pago, cuotas) | `sessionStorage` | Dato sensible y temporal: no debe quedar guardado al cerrar la pestaña. |
| Filtros activos del catálogo (categoría, precio máximo, orden) | `sessionStorage` | Estado de navegación de la visita actual. |
| Indicador de mensaje de bienvenida ya mostrado | `sessionStorage` | Se vuelve a mostrar en cada visita nueva, una sola vez por sesión. |

Regla general: **nunca** se guardan datos de tarjeta ni información que no sea necesaria para reconstruir la interfaz.

## 2. Convención de nombres de claves

Formato: `app:<dominio>:<recurso>` — minúsculas, palabras separadas por guion si hace falta.

| Constante (`CLAVES`) | Clave | Storage |
|---|---|---|
| `CARRITO` | `app:carrito:items` | local |
| `PEDIDOS` | `app:pedidos:historial` | local |
| `PREFERENCIAS` | `app:usuario:preferencias` | local |
| `CACHE_CATALOGO` | `app:catalogo:cache` | local |
| `BORRADOR_CHECKOUT` | `app:checkout:borrador` | session |
| `FILTROS_CATALOGO` | `app:catalogo:filtros` | session |
| `BIENVENIDA_VISTA` | `app:ui:bienvenida-vista` | session |

El prefijo `app:` es obligatorio: permite listar y limpiar solo los datos de este proyecto. En GitHub Pages todos los repositorios del mismo usuario comparten el origen (`usuario.github.io`), así que un `clear()` total podría borrar datos de otros sitios.

## 3. Estructura de datos (schemas JSON preliminares)

Todos los valores se guardan serializados con `JSON.stringify`. Los nombres de campos se confirman con el Desarrollador JS POO antes de cerrar (ver sección 7).

```json
// app:carrito:items
[ { "productoId": 12, "nombre": "Martillo Grande", "precio": 1000, "cantidad": 2 } ]

// app:pedidos:historial
[ { "id": "P-1730000000000", "fecha": "2026-11-10T14:30:00.000Z",
    "items": [ { "productoId": 12, "nombre": "Martillo Grande", "precio": 1000, "cantidad": 2 } ],
    "totalOriginal": 2000, "metodoPago": "tarjeta", "cuotas": 3, "recargoPorcentaje": 10,
    "totalFinanciado": 2200, "valorCuota": 733.33, "direccionEnvio": "Calle 123" } ]

// app:usuario:preferencias
{ "categoriaFavorita": "Herramientas", "metodoPagoPreferido": "tarjeta" }

// app:catalogo:cache
{ "guardadoEn": 1730000000000, "ttlMs": 3600000, "productos": [ { "id": 12, "nombre": "Martillo Grande", "precio": 1000, "categoria": "Herramientas" } ] }

// app:checkout:borrador
{ "metodoPago": "tarjeta", "cuotas": 3, "direccionEnvio": "Calle 123" }

// app:catalogo:filtros
{ "categoria": "Herramientas", "precioMaximo": 5000, "orden": "precio-asc" }

// app:ui:bienvenida-vista
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

- [ ] `js/utils/storage.js` implementa `guardar`, `obtener`, `actualizar`, `eliminar`, `listar` y `limpiar` con la firma definida.
- [ ] Todas las operaciones tienen manejo de errores con `try/catch` y no lanzan excepciones.
- [ ] Serialización y deserialización automática de JSON.
- [ ] Manejo de storage lleno y de datos corruptos con logs informativos.
- [ ] Integración con las clases de `js/models/` mediante `toJSON()` / `fromJSON()` coordinada con el Desarrollador JS POO.
- [ ] `docs/06-storage/storage-doc.md` documenta qué se guarda, estructura de claves, schemas JSON, diferencia local vs session y ejemplos de uso.
- [ ] Código documentado con JSDoc y comentarios.
- [ ] Sin `prompt()`, `alert()` ni `console.log` innecesarios en el módulo.
- [ ] Rama `feature/dev-storage`, al menos un commit relevante, issue asociada, PR hacia `develop` con aprobación de otro integrante y entrada en `changelog.md`.

## 7. Herramientas y coordinación

**Herramienta:** Claude Code (agente de IA de Anthropic), en lugar de GitHub Copilot en modo Agente, con las clases de `js/models/` y este archivo como contexto. Motivo: Sin tokens en GitHub Copilot Agent Mode. Se deja constancia de que esto difiere de lo que pide la consigna (§2.2.9).

**Coordinación:**
- Con el **Desarrollador JS POO**: confirmar qué clases se persisten (carrito, pedido, producto) y que implementen `toJSON()` / `fromJSON()`.
- Con el **Desarrollador JS Eventos + DOM**: qué claves usa la interfaz y cómo avisar al usuario si `estaDisponible()` devuelve `false`.
- Con el **Tester QA**: simulación de `Storage` en los tests de `storage.spec.js` y atención a los issues que reporte.

---

# AT CLOSE — Se completa al cerrar la tarea (evidencia)

_Esta sección se completa **después** de usar Claude Code, con el contenido real de la sesión._

## 1. Prompt exacto utilizado en Claude Code

Archivos adjuntados como contexto: <!-- COMPLETAR: lista real de archivos de js/models/ y spec-dev-storage.md -->

```text
<!-- COMPLETAR: pegar el prompt exacto -->
```

## 2. Output generado por Claude Code (fragmento de al menos una función CRUD)

```javascript
// COMPLETAR: pegar el fragmento generado por Claude Code, sin modificar
```

## 3. Ajustes manuales realizados y justificación

| Ajuste | Justificación |
|---|---|
| <!-- COMPLETAR --> | <!-- COMPLETAR --> |

## 4. Decisiones finales

<!-- COMPLETAR: estrategia de storage definitiva y cómo se coordinó con el Desarrollador JS POO la serialización de instancias. -->