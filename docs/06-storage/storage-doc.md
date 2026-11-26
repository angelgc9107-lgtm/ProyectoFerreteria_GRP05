# Documentación de Storage

Describe cómo la aplicación guarda datos en el navegador mediante `js/utils/storage.js`.
Ninguna otra parte del código debe usar `localStorage` o `sessionStorage` directamente: todo pasa por `StorageUtil`. La interfaz (`js/script.js`) no llama a `StorageUtil` directamente, sino a `js/services/FachadaStorage.js`, que agrupa una operación por dato (ver sección 7).

## 1. localStorage vs sessionStorage en este proyecto

| | `localStorage` (`tipo = 'local'`) | `sessionStorage` (`tipo = 'session'`) |
|---|---|---|
| Duración | Persiste hasta que se borra explícitamente | Se borra al cerrar la pestaña |
| Alcance | Compartido entre pestañas del mismo origen | Propio de cada pestaña |
| Uso en el proyecto | Datos que el usuario espera encontrar al volver | Estado temporal de la visita actual |
| Capacidad típica | ~5 MB por origen | ~5 MB por origen |

## 2. Qué datos se almacenan

| Dato | Clave | Storage | Justificación | Uso actual en la aplicación |
|---|---|---|---|---|
| Carrito de compras | `app:carrito:items` | local | El cliente espera encontrar su carrito al volver otro día. | **En uso**: se carga al iniciar y se guarda después de cada cambio (sección 7.1). |
| Historial de pedidos | `app:pedidos:historial` | local | Se consulta entre sesiones. | Definido; la interfaz todavía no lo usa. |
| Secuencia de pedidos | `app:pedidos:secuencia` | local | Mantiene la numeración correlativa tras recargar. | Definido; la interfaz todavía no lo usa. |
| Preferencias del usuario | `app:usuario:preferencias` | local | Se mantienen entre visitas. | Definido; la interfaz todavía no lo usa. |
| Caché del catálogo | `app:catalogo:cache` | local | Evita reconstruir el catálogo en cada visita; se invalida por antigüedad (`ttlMs`). | Definido; la interfaz todavía no lo usa. |
| Borrador del checkout | `app:checkout:borrador` | session | Dato sensible y temporal; no debe quedar al cerrar la pestaña. | Definido; la interfaz todavía no lo usa. |
| Filtros del catálogo | `app:catalogo:filtros` | session | Estado de navegación de la visita actual. | Definido; la interfaz todavía no lo usa. |
| Mensaje de bienvenida visto | `app:ui:bienvenida-vista` | session | Se muestra una vez por visita. | Definido; la interfaz todavía no lo usa. |

Las claves y schemas de los datos que todavía no se usan quedan definidos para que la integración futura no tenga que rediseñar el almacenamiento.

No se guardan datos de tarjeta de crédito ni información que no sea necesaria para reconstruir la interfaz.

## 3. Convención de nombres de claves

```text
app:<dominio>:<recurso>
```

- `app:` — prefijo obligatorio. Permite listar y limpiar solo los datos del proyecto.
- `<dominio>` — área funcional: `carrito`, `pedidos`, `usuario`, `catalogo`, `checkout`, `ui`.
- `<recurso>` — qué se guarda dentro del dominio: `items`, `historial`, `preferencias`, etc.
- Todo en minúsculas; si hace falta separar palabras, con guion (`bienvenida-vista`).

Las claves oficiales están en la constante `CLAVES` exportada por el módulo; se deben usar en lugar de escribir el texto a mano.

```javascript
import { StorageUtil, CLAVES } from './utils/storage.js';
StorageUtil.guardarInstancia(CLAVES.CARRITO, carrito);   // en lugar de 'app:carrito:items'
```

## 4. Estructura de datos (schemas JSON)

Los valores se guardan siempre serializados con `JSON.stringify`, incluso los strings y los números, para que `obtener()` devuelva el mismo tipo que se guardó.

**`app:carrito:items`** — resultado de `Carrito.toJSON()` (se guarda con `guardarInstancia`, se recupera con `cargarInstancia(CLAVES.CARRITO, Carrito)`). Los subtotales no se guardan: los recalcula `Carrito.resumir()`.

```json
{
  "items": [
    { "codigo": "MARTILLO-001", "nombre": "Martillo", "categoria": "Herramientas", "precio": 1000, "cantidad": 2 },
    { "codigo": "PALA-001", "nombre": "Pala", "categoria": "Jardin", "precio": 300, "cantidad": 3 }
  ]
}
```

**`app:pedidos:historial`** — array de `Pedido.toJSON()` (`guardarLista` / `cargarLista(CLAVES.PEDIDOS, Pedido)`). `Pedido.fromJSON()` valida totales, subtotales y número; un pedido alterado a mano se descarta.

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

**`app:pedidos:secuencia`** — próximo número correlativo de pedido (evita que `secuenciaPedidos` vuelva a 1 al recargar).

```json
4
```

**`app:usuario:preferencias`**

```json
{ "categoriaFavorita": "Herramientas", "metodoPagoPreferido": "tarjeta" }
```

**`app:catalogo:cache`** — la caché es válida mientras `Date.now() - guardadoEn < ttlMs`. Los productos son `Producto.toJSON()`.

```json
{
  "guardadoEn": 1730000000000,
  "ttlMs": 3600000,
  "productos": [
    { "codigo": "MARTILLO-001", "nombre": "Martillo", "categoria": "Herramientas", "descripcion": "Martillo de acero", "precio": 1000 }
  ]
}
```

**`app:checkout:borrador`** (session) — datos del formulario de pedido y del pago; sin datos de tarjeta.

```json
{
  "cliente": { "nombre": "Ana", "correo": "ana@mail.com", "direccion": "Calle 123" },
  "metodoPago": "tarjeta",
  "cuotas": 3
}
```

**`app:catalogo:filtros`** (session) — coincide con los campos del formulario de búsqueda (`orden`: `asc` o `desc`).

```json
{ "texto": "martillo", "categoria": "Herramientas", "precioMaximo": 5000, "orden": "asc" }
```

**`app:ui:bienvenida-vista`** (session)

```json
true
```

> Los campos del carrito, pedido y producto son los que definen `toJSON()` en `js/models/`. Si esas clases cambian, se actualiza esta sección.

## 5. Referencia de la API

Todas las funciones reciben `tipo` como último parámetro (`'local'` por defecto o `'session'`) y **nunca lanzan excepciones**.

| Función | Retorno | Comportamiento |
|---|---|---|
| `guardar(clave, valor, tipo)` | `boolean` | Crea o reemplaza el dato. `false` si el storage está lleno, el valor contiene datos no serializables (en cualquier nivel) o hay otro error. |
| `obtener(clave, tipo)` | valor \| `null` | `null` si la clave no existe, el dato está corrupto o hay error. Un `null` guardado a propósito se lee igual que una clave inexistente: para distinguirlos se usa `existe()`. |
| `actualizar(clave, valor, tipo)` | `boolean` | Solo actualiza si la clave existe; si no, devuelve `false` (usar `guardar`). |
| `eliminar(clave, tipo)` | `boolean` | Idempotente: eliminar una clave inexistente devuelve `true`. |
| `listar(prefijo = 'app:', tipo)` | `string[]` | Claves que empiezan con el prefijo, ordenadas. Sin prefijo lista solo las claves de la aplicación; con `''` lista todas. `[]` si no hay. |
| `limpiar(tipo, soloApp = true)` | `boolean` | Borra las claves `app:*`. Con `soloApp = false` ejecuta `Storage.clear()` completo. |
| `existe(clave, tipo)` | `boolean` | Indica si la clave existe. |
| `estaDisponible(tipo)` | `boolean` | Prueba una escritura real con una clave temporal única en cada llamada (`app:__prueba-disponibilidad__-<id>`), que nunca pisa datos existentes y se verifica como borrada; `false` en modo privado estricto, con cookies bloqueadas, storage lleno o si no se pudo borrar la clave de prueba. |
| `guardarInstancia(clave, instancia, tipo)` | `boolean` | Guarda `instancia.toJSON()`. |
| `cargarInstancia(clave, Clase, tipo)` | instancia \| `null` | Reconstruye con `Clase.fromJSON()`. |
| `guardarLista(clave, instancias, tipo)` | `boolean` | Guarda un array de instancias con `toJSON()`; si algún elemento no lo tiene, devuelve `false` y no guarda nada. |
| `cargarLista(clave, Clase, tipo)` | `Array` | Reconstruye cada elemento con `Clase.fromJSON()`. Es todo o nada: si un elemento es inválido devuelve `[]` (no muestra datos parciales). |

## 6. Manejo de errores

| Situación | Qué hace el módulo |
|---|---|
| Storage lleno (`QuotaExceededError`) | `console.error` con mensaje de "storage lleno"; `guardar` devuelve `false`. |
| JSON corrupto o mal formateado | `console.error` con la clave afectada; `obtener` devuelve `null`. |
| Storage inaccesible (`SecurityError`) | `console.error`; devuelve el valor de fallo (`false`, `null` o `[]`). |
| Clave vacía o no string | `console.error`; devuelve el valor de fallo. |
| Tipo distinto de `'local'` / `'session'` | `console.error`; devuelve el valor de fallo. |
| Valor con `undefined`, función, símbolo, BigInt o referencia circular, **en cualquier nivel** | `console.error`; `guardar` devuelve `false` y no guarda nada (tampoco se guarda `"undefined"`). |

Antes de serializar, el módulo recorre todo el valor (objetos y arrays anidados, respetando `toJSON()`) para que `JSON.stringify` no descarte datos sin avisar. Único límite que se mantiene: `NaN` e `Infinity` se guardan como `null`, porque JSON no puede representarlos.

La interfaz decide qué mostrar al usuario cuando una operación devuelve `false` o `null`; el módulo solo informa por consola.

## 7. Uso en la aplicación

La interfaz usa el storage en tres capas:

```text
js/script.js  →  js/services/FachadaStorage.js  →  js/utils/storage.js (StorageUtil)  →  localStorage / sessionStorage
```

`FachadaStorage` le da a cada dato una operación con nombre propio (`cargarCarrito()`, `guardarCarrito()`, etc.), así `script.js` no necesita conocer las claves ni el tipo de storage.

### 7.1 Persistencia del carrito (en uso)

Es el único dato que la aplicación guarda hoy. Los fragmentos son del código real.

**`js/services/FachadaStorage.js`**: restaura el carrito con `Carrito.fromJSON()` o crea uno vacío si no hay datos válidos, y lo guarda con `toJSON()`.

```javascript
cargarCarrito() {
    return StorageUtil.cargarInstancia(
        CLAVES.CARRITO, Carrito
    ) ?? new Carrito();
},

guardarCarrito(carrito) {
    return StorageUtil.guardarInstancia(
        CLAVES.CARRITO, carrito
    );
},
```

**`js/script.js`, al cargar la página**: el carrito arranca con lo que había guardado.

```javascript
const carrito = FachadaStorage.cargarCarrito();
```

**`js/script.js`, en `procesarOperacionCarrito()`**: después de agregar, quitar o cambiar cantidades se guarda el carrito. Si `guardarCarrito()` devuelve `false` (storage lleno o bloqueado), la interfaz avisa al usuario.

```javascript
const guardado = FachadaStorage.guardarCarrito(carrito);
// ...
if (!guardado) {
    const mensaje = "El carrito se actualizó, pero no pudo guardarse. Los cambios podrían perderse al recargar.";

    mostrarMensaje(elementos.carritoMensaje, mensaje, "error");
    mostrarMensaje(elementos.estadoAplicacion, mensaje, "error");
}
```

**`js/script.js`, en `confirmarPedido()`**: al confirmar el pedido se vacía el carrito y se guarda vacío, para que los productos no reaparezcan al recargar. Si no se puede guardar, se informa.

```javascript
carrito.vaciar();
const carritoGuardado = FachadaStorage.guardarCarrito(carrito);
// ...
mostrarMensaje(elementos.pedidoMensaje,carritoGuardado
        ? "La operacion se realizo correctamente."
        : "Pedido confirmado, pero no se pudo guardar el carrito vacío. Los productos podrían reaparecer al recargar.",
    carritoGuardado ? "success" : "error"
);
```

Así se cumple lo indicado en la sección 6: `StorageUtil` solo registra el error por consola y es `script.js` el que decide qué mostrar.

### 7.2 Operaciones disponibles que la interfaz todavía no usa

`FachadaStorage` ya expone operaciones para el resto de los datos de la sección 2, pero `script.js` no las llama en esta entrega. Quedan como punto de integración para entregas futuras:

| Dato | Operaciones de `FachadaStorage` | Llamada a `StorageUtil` |
|---|---|---|
| Historial de pedidos | `cargarPedidos()` / `guardarPedidos(pedidos)` | `cargarLista` / `guardarLista` con `Pedido` |
| Secuencia de pedidos | `cargarSecuenciaPedidos()` / `guardarSecuenciaPedidos(n)` | `obtener` / `guardar` |
| Preferencias | `cargarPreferencias()` / `guardarPreferencias(p)` | `obtener` / `guardar` |
| Caché del catálogo | `cargarCatalogo()` / `guardarCatalogo(catalogo)` | `cargarInstancia` / `guardarInstancia` con `Catalogo` |
| Borrador del checkout | `cargarBorrador()` / `guardarBorrador(b)` / `eliminarBorrador()` | `obtener` / `guardar` / `eliminar` en `session` |
| Filtros del catálogo | `cargarFiltros()` / `guardarFiltros(f)` | `obtener` / `guardar` en `session` |
| Mensaje de bienvenida | `bienvenidaVista()` / `guardarBienvenidaVista()` | `obtener` / `guardar` en `session` |

Al integrar la caché del catálogo hay que ajustar la fachada: hoy guarda `Catalogo.toJSON()` directamente, sin `guardadoEn` ni `ttlMs`, así que no sigue el schema de la sección 4 y no se invalida por antigüedad.

## 8. Uso del módulo desde `index.html`

`storage.js` es un módulo ES6, por lo que los scripts que lo importan se cargan con `type="module"`:

```html
<script type="module" src="js/script.js"></script>
```

Los módulos se cargan con `http(s)://` (Live Server, `npx serve` o GitHub Pages); no funcionan abriendo el archivo con `file://`.