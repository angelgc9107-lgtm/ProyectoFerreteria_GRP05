# Documentación de Storage

Describe cómo la aplicación guarda datos en el navegador mediante `js/utils/storage.js`.
Ninguna otra parte del código debe usar `localStorage` o `sessionStorage` directamente: todo pasa por `StorageUtil`.

## 1. localStorage vs sessionStorage en este proyecto

| | `localStorage` (`tipo = 'local'`) | `sessionStorage` (`tipo = 'session'`) |
|---|---|---|
| Duración | Persiste hasta que se borra explícitamente | Se borra al cerrar la pestaña |
| Alcance | Compartido entre pestañas del mismo origen | Propio de cada pestaña |
| Uso en el proyecto | Datos que el usuario espera encontrar al volver | Estado temporal de la visita actual |
| Capacidad típica | ~5 MB por origen | ~5 MB por origen |

## 2. Qué datos se almacenan

| Dato | Clave | Storage | Justificación |
|---|---|---|---|
| Carrito de compras | `app:carrito:items` | local | El cliente espera encontrar su carrito al volver otro día. |
| Historial de pedidos | `app:pedidos:historial` | local | Se consulta entre sesiones. |
| Secuencia de pedidos | `app:pedidos:secuencia` | local | Mantiene la numeración correlativa tras recargar. |
| Preferencias del usuario | `app:usuario:preferencias` | local | Se mantienen entre visitas. |
| Caché del catálogo | `app:catalogo:cache` | local | Evita reconstruir el catálogo en cada visita; se invalida por antigüedad (`ttlMs`). |
| Borrador del checkout | `app:checkout:borrador` | session | Dato sensible y temporal; no debe quedar al cerrar la pestaña. |
| Filtros del catálogo | `app:catalogo:filtros` | session | Estado de navegación de la visita actual. |
| Mensaje de bienvenida visto | `app:ui:bienvenida-vista` | session | Se muestra una vez por visita. |

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
| `guardar(clave, valor, tipo)` | `boolean` | Crea o reemplaza el dato. `false` si el storage está lleno, el valor no es serializable o hay otro error. |
| `obtener(clave, tipo)` | valor \| `null` | `null` si la clave no existe, el dato está corrupto o hay error. Un `null` guardado a propósito se lee igual que una clave inexistente: para distinguirlos se usa `existe()`. |
| `actualizar(clave, valor, tipo)` | `boolean` | Solo actualiza si la clave existe; si no, devuelve `false` (usar `guardar`). |
| `eliminar(clave, tipo)` | `boolean` | Idempotente: eliminar una clave inexistente devuelve `true`. |
| `listar(prefijo = 'app:', tipo)` | `string[]` | Claves que empiezan con el prefijo, ordenadas. Sin prefijo lista solo las claves de la aplicación; con `''` lista todas. `[]` si no hay. |
| `limpiar(tipo, soloApp = true)` | `boolean` | Borra las claves `app:*`. Con `soloApp = false` ejecuta `Storage.clear()` completo. |
| `existe(clave, tipo)` | `boolean` | Indica si la clave existe. |
| `estaDisponible(tipo)` | `boolean` | Prueba una escritura real con una clave temporal (`app:__prueba-disponibilidad__`) que siempre se borra; `false` en modo privado estricto, con cookies bloqueadas o storage lleno. |
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
| Valor `undefined`, función, símbolo o referencia circular | `console.error`; `guardar` devuelve `false` (no se guarda `"undefined"`). |

Límites de `JSON.stringify`: solo se rechazan los valores de primer nivel que no se pueden serializar. Dentro de un objeto, una función se descarta sin aviso y `NaN` o `Infinity` se guardan como `null`.

La interfaz decide qué mostrar al usuario cuando una operación devuelve `false` o `null`; el módulo solo informa por consola.

## 7. Ejemplos de uso

**Guardar y recuperar el carrito**

```javascript
import { StorageUtil, CLAVES } from './utils/storage.js';
import { Carrito } from './models/Carrito.js';

// Al iniciar: restaura el carrito o crea uno vacío si no hay datos válidos
const carrito = StorageUtil.cargarInstancia(CLAVES.CARRITO, Carrito) ?? new Carrito();

// Después de cada cambio en el carrito:
if (!StorageUtil.guardarInstancia(CLAVES.CARRITO, carrito)) {
  // El storage está lleno o no disponible: avisar en la interfaz
}
```

**Borrador del checkout (solo durante la visita)**

```javascript
StorageUtil.guardar(CLAVES.BORRADOR_CHECKOUT, { cliente: { nombre: 'Ana', correo: 'ana@mail.com', direccion: 'Calle 123' }, metodoPago: 'tarjeta', cuotas: 3 }, 'session');
const borrador = StorageUtil.obtener(CLAVES.BORRADOR_CHECKOUT, 'session');
StorageUtil.eliminar(CLAVES.BORRADOR_CHECKOUT, 'session'); // al confirmar el pedido
```

**Persistir instancias de las clases del dominio**

```javascript
// Las clases de js/models/ implementan toJSON() y static fromJSON(datos)
StorageUtil.guardarLista(CLAVES.PEDIDOS, pedidos);
const historial = StorageUtil.cargarLista(CLAVES.PEDIDOS, Pedido);
```

**Caché del catálogo con vencimiento**

```javascript
const cache = StorageUtil.obtener(CLAVES.CACHE_CATALOGO);
const vigente = cache && (Date.now() - cache.guardadoEn) < cache.ttlMs;
const productos = vigente ? cache.productos : catalogo.toJSON().productos;
if (!vigente) {
  StorageUtil.guardar(CLAVES.CACHE_CATALOGO, { guardadoEn: Date.now(), ttlMs: 3600000, productos });
}
```

**Listar y limpiar datos de la aplicación**

```javascript
StorageUtil.listar('app:pedidos:');   // ['app:pedidos:historial', 'app:pedidos:secuencia']
StorageUtil.limpiar('session');       // borra solo claves app:* de la sesión
```

## 8. Uso del módulo desde `index.html`

`storage.js` es un módulo ES6, por lo que los scripts que lo importan se cargan con `type="module"`:

```html
<script type="module" src="js/script.js"></script>
```

Los módulos se cargan con `http(s)://` (Live Server, `npx serve` o GitHub Pages); no funcionan abriendo el archivo con `file://`.