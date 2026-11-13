# Spec — Desarrollador JS POO: lógica de negocio

## 1. Identificación

- **Proyecto:** FerroLab, tienda online de ferretería.
- **Materia:** Programación Web I.
- **Entrega:** Actividad Obligatoria N.º 4.
- **Rol:** Desarrollador JS POO (Lógica de Negocio).
- **Rama prevista:** `feature/dev-poo-logica-negocio`.
- **Integración prevista:** Pull Request hacia `develop`.
- **Estado:** propuesta previa a la implementación, pendiente de revisión y aprobación.

## 2. Objetivo y responsabilidades

Definir clases de dominio que permitan migrar las reglas de negocio actuales
desde `js/script.js`, sin acoplarlas a la interfaz ni al almacenamiento.
La implementación posterior incluirá constructores y métodos documentados
con JSDoc, validaciones internas, encapsulamiento y serialización.

En esta etapa solo se redacta el spec. **Debe guardarse en un commit anterior
a cualquier modificación de `js/models/`**; ese commit queda pendiente y no
se realiza en esta ejecución. Los diagramas, las clases y su integración
también quedan pendientes de aprobación.

## 3. Análisis de la lógica existente

Se consultaron `README.md`, `index.html`, `js/script.js`, los specs de
JavaScript y arquitectura de la Actividad N.º 3, el spec de DevOps de la
Actividad N.º 4 y los cuatro diagramas de actividades `.puml` ubicados en
`docs/05-diagramas/01-diagrama-de-actividades/`.

El README describe una arquitectura y funcionalidades de la cuarta entrega
como objetivo; el código actual todavía corresponde mayormente a la tercera:
`js/script.js` contiene datos, funciones de negocio y un menú de interacción
con `prompt()` y `alert()`. El HTML presenta catálogo y carrito estáticos,
un listener del control de precio y la referencia a `js/script.js`. Los
artículos y totales de ejemplo del carrito no son el estado de
`carritoActual`. No se encontraron clases en `js/models/` ni
`js/utils/storage.js`; las pruebas existentes incluyen `js/test/script.spec.js`.

| Flujo | Comportamiento actual relevante | Destino propuesto |
|---|---|---|
| Búsqueda | `buscarProductos` filtra por nombre/descripción, categoría exacta y precio máximo opcional; normaliza mayúsculas y tildes y ordena por precio ascendente. Precio inválido produce error. | `Catalogo` y `Producto` |
| Carrito | Se agrega por código existente, se acumulan cantidades, se cambia o elimina un ítem y se calculan subtotales y total. Las cantidades deben ser enteros seguros positivos; su suma también debe ser segura. | `Carrito` |
| Pago | Efectivo/transferencia: una cuota, 0 %. Tarjeta: 1, 3 o 6 cuotas, con 0 %, 10 % o 20 % de recargo. El total debe ser finito y mayor que cero. | `Pago` |
| Pedido | Se validan nombre, correo y dirección; se genera un resumen y, al confirmar, un identificador `FL-tiempo-secuencia`. El controlador conserva carrito y pago ante cancelación y los limpia tras confirmar. | `Pedido`; coordinación de la transición en Eventos + DOM |

Al cambiar el total del carrito, la interacción actual invalida las condiciones
de pago; si el total no cambia, las conserva. Al iniciar nuevamente la
selección de pago se descartan las condiciones anteriores, incluso si se
cancela. No hay cálculo de envío ni registro persistente de pedidos en la
lógica actual: los importes de envío del HTML son representativos, no una
regla de negocio implementada. No se propone agregar cobro, autenticación,
stock ni otras funcionalidades no respaldadas por estos flujos.

## 4. Clases propuestas y contratos

Se proponen cinco clases, cada una en su propio archivo PascalCase. Sus
interfaces son una **propuesta para acordar** con Eventos + DOM, Storage y
QA. A continuación, `objeto` significa objeto plano serializable y las
colecciones devueltas son copias; las clases no reciben nodos ni eventos.

**Clases principales (mínimo obligatorio):** `Producto`, `Catalogo` y
`Carrito`. Estas tres cumplen el mínimo de tres clases exigido por la consigna.

**Clases adicionales (alcance complementario):** `Pago` y `Pedido`. Amplían
el diseño para representar los flujos de pago y confirmación del pedido.

Las cinco clases forman parte del diseño propuesto, pero únicamente tres son
necesarias para cumplir el requisito mínimo. Se mantienen las
responsabilidades, propiedades, métodos y relaciones definidos para todas.

### 4.1 `Producto`

**Responsabilidad:** representar los datos de un producto del catálogo y
comprobar si coincide con los criterios de búsqueda. Se justifica por los
objetos de `catalogoProductos` ya existentes.

**Propiedades privadas:** `codigo`, `nombre`, `categoria` y `descripcion`
(`string`); `precio` (`number`). Son datos de lectura sin setters públicos;
se accede mediante getters y copias serializables.

**Constructor:** `new Producto({ codigo, nombre, categoria, descripcion, precio })`.
Recibe cadenas no vacías y precio finito mayor o igual a cero. No introduce
stock, imágenes, precios anteriores ni reglas de descuento.

**Métodos públicos:**

- `coincide({ texto, categoria, precioMaximo }) -> boolean`: aplica los
  criterios ya normalizados/validados por `Catalogo`; texto en nombre y
  descripción, categoría exacta y precio menor o igual al máximo.
- `toJSON() -> objeto`: devuelve `{ codigo, nombre, categoria, descripcion, precio }`.
- `static fromJSON(datos) -> Producto`: reconstruye pasando por el constructor.

### 4.2 `Catalogo`

**Responsabilidad:** mantener la colección de productos y realizar búsquedas.
Se justifica por el arreglo `catalogoProductos` y `buscarProductos`.

**Propiedad privada:** `productos` (`Producto[]`), con códigos únicos al
comparar sin distinguir mayúsculas; no se expone el arreglo interno.

**Constructor:** `new Catalogo(productos = [])`, con un arreglo de instancias
`Producto`; rechaza entradas de otro tipo o códigos duplicados.

**Métodos públicos:**

- `obtenerProductos() -> Producto[]`: copia del arreglo, sin permitir
  modificar la colección interna.
- `obtenerPorCodigo(codigo) -> Producto|null`: busca ignorando espacios
  exteriores y mayúsculas; devuelve `null` si no existe.
- `buscar({ texto, categoria, precioMaximo } = {}) -> { valido, error, resultados }`:
  reproduce `buscarProductos`. Los campos vacíos se omiten; texto y categoría
  se comparan sin tildes ni distinción de mayúsculas. El precio vacío se
  omite; otro valor debe convertirse a número finito no negativo. Devuelve
  resultados por precio ascendente; un precio inválido devuelve
  `{ valido: false, error: string, resultados: [] }`, y en caso válido
  `{ valido: true, error: null, resultados: Producto[] }`.
- `toJSON() -> { productos: objeto[] }`.
- `static fromJSON(datos) -> Catalogo`: reconstruye cada producto y valida la
  colección.

### 4.3 `Carrito`

**Responsabilidad:** administrar los ítems seleccionados y calcular su resumen.
Se justifica por `carritoActual` y las operaciones del flujo de carrito.

**Propiedad privada:** `items` (`Array<{ codigo: string, nombre: string,
categoria: string, precio: number, cantidad: number }>`). Cada ítem es una
instantánea del producto al agregarlo, como en la implementación actual; no
es una nueva clase. La colección comienza vacía y no se expone directamente.

**Constructor:** `new Carrito(items = [])`. Valida cada instantánea, códigos
únicos sin distinción de mayúsculas, precios finitos no negativos y
cantidades enteras seguras mayores o iguales a uno.

**Métodos públicos:**

- `agregar(catalogo, codigo, cantidad) -> { exito, error }`: busca el producto
  en un `Catalogo`; agrega su instantánea o suma la cantidad al ítem
  existente. Acepta cantidades numéricas o cadenas numéricas no vacías y
  rechaza cantidades inválidas o sumas fuera del rango entero seguro.
- `cambiarCantidad(codigo, cantidad) -> { exito, error }`: reemplaza la
  cantidad de un ítem existente; compara el código sin espacios exteriores
  ni distinción de mayúsculas.
- `eliminar(codigo) -> { exito, error }`: elimina el ítem identificado con
  la misma comparación de código.
- `resumir() -> { items, total, cantidadItems }`: incluye `subtotal` en cada
  copia de ítem (`precio * cantidad`), suma los subtotales y devuelve la
  cantidad de **ítems distintos**, no la suma de unidades.
- `vaciar() -> void`: elimina todos los ítems.
- `toJSON() -> { items: objeto[] }` y `static fromJSON(datos) -> Carrito`:
  serializan y reconstruyen las instantáneas sin subtotales derivados.

Las tres operaciones mutadoras devuelven `{ exito: true, error: null }` en
éxito o `{ exito: false, error: string }` en error. Una operación inválida no
modifica el carrito. Se verifican existencia de producto/ítem y cantidad;
`vaciar` no confirma ni guarda un pedido.

### 4.4 `Pago`

**Responsabilidad:** validar y calcular las condiciones de pago de un total,
sin efectuar transacciones. Se justifica por `calcularCondicionesPago`.

**Propiedades privadas:** `metodoPago` (`"efectivo-transferencia"` o
`"tarjeta"`), `cuotas` (`number`), `porcentajeRecargo` (`number`) y
`totalOriginal` (`number`). Interés, total financiado y valor de cuota se
calculan a partir de esos datos y no se editan por separado.

**Constructor:** `new Pago(total, metodoPago, cantidadCuotas)`. `total` debe
convertirse a un número finito mayor que cero. Para
`efectivo-transferencia` se fija una cuota y recargo 0,
independientemente del tercer argumento; para `tarjeta` se aceptan 1, 3 o
6 cuotas, con recargos 0, 10 o 20 respectivamente. Un método o cantidad
inválida se rechaza.

**Métodos públicos:**

- `calcular() -> { valido, error, metodoPago, cuotas, porcentajeRecargo, totalOriginal, interes, totalFinanciado, valorCuota }`:
  en un objeto válido devuelve `valido: true` y `error: null`. Redondea a
  dos decimales como el código actual: primero el total original, luego
  `interes = Math.round(totalOriginal * porcentajeRecargo) / 100`,
  el total financiado y cada cuota. No distribuye diferencias de redondeo
  entre cuotas.
- `toJSON() -> { totalOriginal, metodoPago, cuotas }`: persiste las entradas,
  no los importes derivados.
- `static fromJSON(datos) -> Pago`: reconstruye y vuelve a validar y calcular
  según las reglas vigentes; Storage debe coordinar cualquier cambio futuro
  de esas reglas antes de leer datos antiguos.

### 4.5 `Pedido`

**Responsabilidad:** validar los datos de contacto y envío, generar una
instantánea del resumen y, tras la confirmación del usuario, identificar el
pedido. Se justifica por `crearResumenPedido` y `crearNumeroPedido`.
Los datos del cliente son un objeto de valor, no una clase independiente:
actualmente no hay cuenta ni operaciones propias de cliente.

**Propiedades privadas:** `cliente` (`{ nombre: string, correo: string,
direccion: string }`), `productos` (copias de ítems con `subtotal`),
`total` (`number`), `pago` (copia del resultado de `Pago.calcular()`) y
`numero` (`string|null`, inicialmente `null`).

**Constructor:** `new Pedido(carrito, pago, cliente)`, con instancias de
`Carrito` y `Pago` y objeto de cliente. Exige carrito no vacío, pago válido
para el total actual del carrito y datos válidos. El nombre recortado no
puede estar vacío ni consistir exclusivamente en un número según
`/^\d+(?:[.,]\d+)?$/`; el correo recortado debe cumplir
`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`; la dirección recortada no puede estar vacía.
El total del pago debe coincidir con el total del carrito redondeado a dos
decimales, para evitar confirmar condiciones desactualizadas. Guarda copias,
no referencias mutables al carrito o a los datos del cliente.

**Métodos públicos:**

- `resumir() -> { valido, cliente, productos, total, pago }`: devuelve copias
  del resumen y `valido: true`, sin confirmar ni alterar el carrito.
- `confirmar(fechaEnMilisegundos, secuencia) -> string`: valida marca temporal
  y secuencia como enteros seguros no negativos y positivos respectivamente;
  genera una sola vez `FL-<tiempo>-<secuencia>` con secuencia rellenada a
  cuatro posiciones como mínimo. Rechaza una segunda confirmación. El
  controlador proporciona tiempo y secuencia; no se consulta el reloj ni
  se modifica un contador global dentro del modelo.
- `toJSON() -> { cliente, productos, total, pago, numero }`: devuelve copias
  de la instantánea, también si `numero` es `null`.
- `static fromJSON(datos) -> Pedido`: valida y reconstruye la instantánea,
  incluido `numero`, sin depender del carrito ni del catálogo actuales;
  verifica subtotales, total y consistencia del pago antes de aceptarla.

**Errores de construcción y restauración:** los constructores y `fromJSON`
rechazan datos inválidos con `TypeError` para tipos incorrectos o `RangeError`
para valores fuera de las reglas; no crean objetos parcialmente válidos.
La interfaz captura esos errores y los comunica; Storage informa fallos de
lectura, JSON inválido y errores de reconstrucción, sin sustituirlos
silenciosamente por datos válidos. La búsqueda y las operaciones normales del
carrito mantienen los resultados explícitos indicados arriba.

## 5. Relaciones entre clases

| Relación | Multiplicidad propuesta | Justificación |
|---|---|---|
| Agregación: `Catalogo` — `Producto` | Un catálogo contiene 0..* productos; un producto puede existir independientemente del catálogo. | La colección organiza los productos usados para búsqueda y selección. |
| Asociación/dependencia: `Carrito` → `Catalogo` | Cada llamada a `agregar` recibe un catálogo; un carrito no lo conserva. | El código debe existir antes de agregar; se guarda una instantánea del producto. |
| Asociación: `Carrito` → `Producto` | Cada ítem se origina en un producto del catálogo, pero no conserva una referencia viva. | Los datos y el precio del ítem se copian al agregar. |
| Composición: `Carrito` — ítems | 1 carrito posee 0..* objetos de ítem; cada ítem pertenece a ese carrito. | Las cantidades y la colección tienen el ciclo de vida del carrito. Los ítems son objetos de valor, no clases UML adicionales. |
| Dependencia: `Pedido` → `Carrito` y `Pago` | Un pedido se construye a partir de 1 carrito y 1 pago; posteriormente conserva copias. | El resumen debe sobrevivir a vaciar el carrito o cambiar la selección de pago. |

No se propone herencia: los objetos cumplen responsabilidades distintas y
no hay una relación «es un» que la justifique. El pago seleccionado es estado
del controlador, no una propiedad interna del carrito: eso permite conservar
la regla actual de invalidarlo solo si cambia el total.

## 6. Arquitectura y encapsulamiento

- Los campos privados y la ausencia de setters generales impiden saltar
  validaciones; las mutaciones se realizan mediante métodos de negocio.
  Los getters, resúmenes y `toJSON()` no deben filtrar referencias mutables.
- Cada clase valida sus invariantes al construir y restaurar; las operaciones
  del carrito validan antes de modificar. El catálogo centraliza búsqueda y
  normalización sin duplicar la responsabilidad de almacenar productos.
- La invalidación del pago es una transición entre flujos: Eventos + DOM
  compara el total anterior y posterior a una operación exitosa y descarta
  el pago solo si cambió. Antes de iniciar una nueva selección lo descarta;
  cancelar esa selección conserva el carrito pero no el pago anterior.
- Tras confirmar, Eventos + DOM obtiene el número, muestra el resultado y
  limpia carrito y selección de pago; si se cancela la carga o confirmación,
  no llama a `confirmar` y conserva ambos. La persistencia y el orden exacto
  de esas acciones se acordarán con Storage para que un error no se presente
  como éxito.
- `Pedido` conserva una instantánea, por lo que la limpieza posterior del
  carrito no altera el resumen. No se crean dependencias de navegador en
  los modelos; parámetros explícitos para tiempo y secuencia permiten
  pruebas deterministas. Evitar montos no finitos en resultados y señalar
  errores de cálculo también será responsabilidad de la implementación.

## 7. Separación de negocio, eventos y DOM

Los modelos no usarán DOM, eventos, `prompt()`, `alert()` ni Web Storage.
Las validaciones, filtros, cálculos, instantáneas y numeración pertenecen al
dominio. El controlador leerá formularios, convertirá entradas cuando
corresponda, llamará a los métodos, manejará errores y mostrará resultados.
Los formatos visuales de moneda y mensajes corresponden a la presentación.

La adaptación de `js/script.js` y de los controles HTML corresponde al rol
Eventos + DOM y se coordinará sin asumir que ya existen formularios de pago
o confirmación funcionales. Se preservarán las reglas de los cuatro flujos,
reemplazando la interacción de los diagramas de la entrega anterior por
eventos de interfaz, no migrando sus `prompt()`/`alert()` a las clases.

## 8. Integración prevista con otros roles

- **Eventos + DOM:** acordar firmas, errores, copias y carga de modelos.
  Usar `Catalogo.buscar`, operaciones de `Carrito`, `Pago.calcular` y
  `Pedido.resumir`/`confirmar`; controlar cancelaciones, invalidación del
  pago y limpieza posterior. Resolver la carga de scripts o módulos junto
  con el rol, sin dar por implementado un formato de importación.
- **Storage:** acordar claves, elección entre `localStorage` y
  `sessionStorage`, ciclo de vida y CRUD de cada dato; esas decisiones aún
  no están definidas. La capa de storage guardará objetos planos mediante
  `toJSON()` y usará el `fromJSON()` de la clase correspondiente para
  restaurar y validar. El modelo no accederá directamente al navegador.
  Tratar ausencia de datos por separado de datos corruptos o fallos de
  almacenamiento; evitar persistir datos personales sin acuerdo explícito.
- **Tester QA:** acordar contratos y casos Jasmine para filtros vacíos,
  tildes y precio inválido; códigos inexistentes y cantidades inseguras;
  subtotales y `cantidadItems`; las tres cuotas y redondeos; cliente inválido;
  invalidación/cancelación; confirmación y copias independientes;
  serialización, restauración inválida y errores de storage. Mantener
  accesibilidad de modelos desde el runner que se acuerde.

## 9. Diseño previsto del diagrama UML

Crear posteriormente un diagrama de clases con PlantUML que incluya las cinco
clases, todos sus campos privados, constructores y métodos públicos/estáticos,
tipos, relaciones y multiplicidades de la sección 5. Representar los ítems
y los datos de cliente como objetos de valor, sin inventar entidades o
herencia. Señalar las dependencias de parámetros de construcción y que
`Pedido` conserva instantáneas. Exportar el `.puml` a `.png` y documentar el
contenido, relaciones, generación y enlaces en `diagrama-clases-doc.md`.

**Ruta definitiva:** los diagramas de clases se ubicarán en
`docs/05-diagramas/02-diagrama-de-clases/`, respetando la estructura
existente del proyecto.

## 10. Archivos y entregables esperados

| Entregable | Estado y alcance |
|---|---|
| `docs/03-specs/actividad-obligatoria-4/spec-dev-poo.md` | Este spec; pendiente de revisión y del commit previo. |
| `js/models/Producto.js`, `Catalogo.js`, `Carrito.js` | Clases principales (mínimo obligatorio); propuestas, no implementadas. |
| `js/models/Pago.js`, `Pedido.js` | Clases adicionales (alcance complementario: pago y confirmación del pedido); propuestas, no implementadas. |
| `docs/05-diagramas/02-diagrama-de-clases/diagrama-clases.puml` | Pendiente. |
| `docs/05-diagramas/02-diagrama-de-clases/diagrama-clases.png` | Pendiente de exportación. |
| `docs/05-diagramas/02-diagrama-de-clases/diagrama-clases-doc.md` | Pendiente. |
| `index.html` | Referencias JavaScript necesarias: modificación posterior coordinada con Eventos + DOM. |

La migración y adaptación de `js/script.js`, la implementación de storage
y las suites de QA se coordinan con sus respectivos responsables. No se
realizan en esta primera etapa.

## 11. Criterios de aceptación

Todos quedan pendientes hasta verificar la implementación y la evidencia:

- [ ] Se identificaron y justificaron las entidades del dominio.
- [ ] Se implementaron al menos tres clases en `js/models/`: las principales
  `Producto`, `Catalogo` y `Carrito` cumplen el mínimo exigido.
- [ ] Se implementaron las clases adicionales `Pago` y `Pedido` (alcance
  complementario, no necesarias para el mínimo).
- [ ] Se documentaron constructores y métodos mediante JSDoc.
- [ ] Se aplicó encapsulamiento y validaciones internas.
- [ ] Se separó la lógica de negocio de eventos y DOM.
- [ ] Se implementaron métodos `toJSON()` y `fromJSON()`.
- [ ] Se generó `diagrama-clases.puml`.
- [ ] Se exportó `diagrama-clases.png`.
- [ ] Se creó `diagrama-clases-doc.md`.
- [ ] Se definieron interfaces para Eventos + DOM y Storage.
- [ ] Se prepararon las clases para pruebas de QA.
- [ ] Se documentaron las evidencias de Copilot.

## 12. Evidencias de GitHub Copilot Agent Mode — completar al finalizar

No se atribuye todavía generación de clases, ajustes manuales ni resultados
de implementación a Copilot. Registrar únicamente evidencia real:

### Prompt exacto de implementación

Pendiente: copiar literalmente el prompt utilizado para implementar las clases.

```text
Pendiente de implementación.
```

### Archivos utilizados como contexto

Pendiente de confirmar y registrar los archivos efectivamente utilizados.
Contexto previsto: los cuatro diagramas de actividades `.puml` de
`docs/05-diagramas/01-diagrama-de-actividades/`, `index.html` y este
`spec-dev-poo.md`. Agregar cualquier otro archivo realmente utilizado.

### Fragmento de código generado

Pendiente: incorporar un fragmento real generado por Copilot de al menos una
clase, identificando archivo y versión.

### Ajustes manuales

Pendiente: describir cambios efectivamente realizados para mejorar el
encapsulamiento o la testabilidad y por qué fueron necesarios.

### Decisiones finales y coordinación

Pendiente: registrar decisiones de arquitectura efectivamente adoptadas,
contratos acordados con Storage y casos/resultados coordinados con Tester QA.