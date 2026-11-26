# Spec — Desarrollador JS POO: lógica de negocio

## 1. Identificación

- **Proyecto:** FerroLab, tienda online de ferretería.
- **Materia:** Programación Web I.
- **Entrega:** Actividad Obligatoria N.º 4.
- **Rol:** Desarrollador JS POO (Lógica de Negocio).
- **Rama prevista:** `feature/dev-poo-logica-negocio`.
- **Integración prevista:** Pull Request hacia `develop`.
- **Estado:** las cinco clases de dominio están implementadas en `js/models/`.
  La suite de modelos fue ejecutada. Eventos + DOM ya usa los modelos
  (PR #156) y `StorageUtil` (PR #157) está disponible; `script.js` todavía no
  persiste con Storage.
- **Implementado:** modelos, validaciones y serialización/restauración.
- **Pruebas:** Jasmine ejecutó 84 casos, con 0 fallos (sección 12).
- **Integración:** flujos de interfaz integrados en `develop` (PR #156); persistencia con `StorageUtil` (PR #157) aún sin conectar en `script.js`.

## 2. Objetivo y responsabilidades

Documentar las cinco clases de dominio implementadas y sus contratos reales:
`Producto`, `Catalogo`, `Carrito`, `Pago` y `Pedido`. Los modelos encapsulan
sus datos, validan entradas y ofrecen serialización/restauración sin depender
del DOM ni de Web Storage.

Este documento describe el comportamiento actual del código y diferencia la
implementación de la evidencia de pruebas y de la integración con otros roles.

## 3. Análisis de la lógica existente

Se consultaron `README.md`, `index.html`, `js/script.js`, los specs de
JavaScript y arquitectura de la Actividad N.º 3, el spec de DevOps de la
Actividad N.º 4 y los cuatro diagramas de actividades `.puml` ubicados en
`docs/05-diagramas/01-diagrama-de-actividades/`.

Las clases existen en `js/models/` y sus comportamientos se describen en la
sección 4. La interfaz continúa siendo responsabilidad de Eventos + DOM; la
persistencia mediante Storage no forma parte de estos modelos. Por eso, la
presencia de clases no implica que los flujos de la página ya estén conectados
a ellas.

| Flujo | Comportamiento implementado en los modelos | Integración |
|---|---|---|
| Búsqueda | `Catalogo.buscar()` normaliza texto y categoría, admite precio máximo opcional y orden ascendente o descendente, y devuelve un resultado explícito de éxito o error. | Integrada en `script.js` (PR #156). |
| Carrito | `Carrito` mantiene instantáneas, valida operaciones, calcula subtotales, total y ambos contadores. | Controles y estado integrados en `script.js` (PR #156); persistencia pendiente de conectar. |
| Pago | `Pago` valida el total, método y cuotas, y calcula importes redondeados; no procesa transacciones. | Integrada en `script.js` (PR #156). |
| Pedido | `Pedido` valida cliente y consistencia del pago, crea una instantánea y permite confirmar con fecha y secuencia provistas. | Confirmación y cancelación integradas en `script.js` (PR #156); persistencia pendiente de conectar. |

Los modelos no calculan envío, no cobran, no autentican usuarios, no
administran stock y no persisten pedidos. La cancelación, la invalidación de
un pago anterior y la limpieza tras confirmar son transiciones del controlador
que todavía deben integrarse.

## 4. Clases implementadas y contratos reales

Las cinco clases están implementadas en archivos PascalCase. `objeto` significa
objeto plano serializable. Los campos privados no se exponen directamente;
los métodos de resumen y serialización producen copias. Las excepciones de
validación son `TypeError` para tipos o formas incorrectos y `RangeError`
para valores fuera de las reglas, salvo los métodos de operación que declaran
un resultado `{ exito, error }` o `{ valido, error, resultados }`.

**Clases principales (mínimo obligatorio):** `Producto`, `Catalogo` y
`Carrito`. Estas tres cumplen el mínimo de tres clases exigido por la consigna.

**Clases adicionales (alcance complementario):** `Pago` y `Pedido`. Amplían
el diseño para representar los flujos de pago y confirmación del pedido.

`Producto`, `Catalogo` y `Carrito` conforman las tres clases mínimas exigidas;
`Pago` y `Pedido` son clases adicionales implementadas para los flujos de pago
y confirmación.

### 4.1 `Producto` — implementado

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

### 4.2 `Catalogo` — implementado

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
- `buscar(criterios = {}) -> { valido, error, resultados }`: requiere un
  objeto no nulo ni arreglo. `texto` y `categoria` deben ser cadenas; se
  comparan sin distinguir mayúsculas ni tildes. `precioMaximo` acepta número
  o cadena decimal simple no negativa (solo dígitos y un punto; se rechazan `"0x10"` y `"1e3"`); `null`, `undefined`, cadena vacía o
  solo espacios omiten ese filtro. `orden` acepta `"asc"` (predeterminado) o
  `"desc"`. Un criterio inválido devuelve
  `{ valido: false, error: string, resultados: [] }`; el éxito devuelve
  `{ valido: true, error: null, resultados: Producto[] }` ordenados por precio
  según `orden`. Un resultado vacío sin error es válido.
- `toJSON() -> { productos: objeto[] }`.
- `static fromJSON(datos) -> Catalogo`: reconstruye cada producto y valida la
  colección.

### 4.3 `Carrito` — implementado

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
  existente. Acepta cantidades numéricas o cadenas de solo dígitos (se rechazan
  `"0x10"` y `"1e2"`) y rechaza cantidades inválidas o sumas fuera del rango entero seguro.
- `cambiarCantidad(codigo, cantidad) -> { exito, error }`: reemplaza la
  cantidad de un ítem existente; compara el código sin espacios exteriores
  ni distinción de mayúsculas.
- `eliminar(codigo) -> { exito, error }`: elimina el ítem identificado con
  la misma comparación de código.
- `resumir() -> { items, total, cantidadItems, cantidadUnidades }`: cada copia
  de ítem incluye `subtotal` (`precio * cantidad`); devuelve el total, la
  cantidad de ítems distintos y la suma de unidades. Lanza `RangeError` si
  un subtotal o el total no es finito, o si la suma de unidades deja de ser un
  entero seguro.
- `vaciar() -> void`: elimina todos los ítems.
- `toJSON() -> { items: objeto[] }` y `static fromJSON(datos) -> Carrito`:
  serializan y reconstruyen las instantáneas sin subtotales derivados.

Las operaciones `agregar`, `cambiarCantidad` y `eliminar` devuelven
`{ exito: true, error: null }` en éxito o `{ exito: false, error: string }`
en error; los fallos no modifican el carrito. La cantidad del constructor y
los snapshots debe ser un número entero seguro positivo; las operaciones de
cantidad también aceptan cadenas de solo dígitos. Códigos duplicados,
precios no finitos o negativos, cantidades inválidas y desbordes se rechazan.
`toJSON()` omite subtotales derivados y `fromJSON()` vuelve a validar el
arreglo mediante el constructor.

### 4.4 `Pago` — implementado

**Responsabilidad:** validar y calcular las condiciones de pago de un total,
sin efectuar transacciones. Se justifica por `calcularCondicionesPago`.

**Propiedades privadas:** `metodoPago` (`"efectivo-transferencia"` o
`"tarjeta"`), `cuotas` (`number`), `porcentajeRecargo` (`number`) y
`totalOriginal` (`number`). Interés, total financiado y valor de cuota se
calculan a partir de esos datos y no se editan por separado.

**Constructor:** `new Pago(total, metodoPago, cantidadCuotas)`. `total` acepta
un número o cadena decimal simple (dígitos y un punto) mayor que cero. Para
`efectivo-transferencia` se fija una cuota y recargo 0,
independientemente del tercer argumento; para `tarjeta` se aceptan 1, 3 o
6 cuotas, con recargos 0, 10 o 20 respectivamente. Un método o cantidad
inválida se rechaza.

**Métodos públicos:**

- `calcular() -> { valido, error, metodoPago, cuotas, porcentajeRecargo, totalOriginal, interes, totalFinanciado, valorCuota }`:
  devuelve `valido: true` y `error: null`. Redondea el total original a dos
  decimales; usa ese **total ya redondeado**, no la entrada sin redondear, en
  `interes = Math.round(totalOriginal * porcentajeRecargo) / 100`;
  redondea el total financiado y el valor unitario de cuota a dos decimales.
  No distribuye diferencias de redondeo entre cuotas. Si un importe calculado
  no es finito, lanza `RangeError`.
- `toJSON() -> { totalOriginal, metodoPago, cuotas }`: persiste las entradas,
  no los importes derivados.
- `static fromJSON(datos) -> Pago`: reconstruye y vuelve a validar y calcular
  según las reglas vigentes. Requiere `totalOriginal` y `cuotas` de tipo
  número; `metodoPago` se valida al construir. Los datos serializados de
  efectivo/transferencia deben indicar exactamente una cuota. Storage debe
  coordinar cualquier cambio futuro de esas reglas antes de leer datos antiguos.

La política existente usa `Math.round` sobre números binarios de JavaScript.
Por ejemplo, `1.005` como total original se calcula como `1`, no como `1.01`.
Con entrada `100.149` y recargo del 10 %, la base es `100.15` y el interés
es `10.02`; calcular sobre la entrada sin redondear produciría `10.01`.
Una política de redondeo decimal diferente requiere coordinación porque también
afecta la comparación del total del carrito en `Pedido`.

### 4.5 `Pedido` — implementado

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
decimales, usando la misma comparación de importes que en la restauración,
para evitar confirmar condiciones desactualizadas. Guarda copias,
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

`Pedido.fromJSON()` requiere los productos con sus subtotales serializados,
comprueba subtotales y total contra el resumen recalculado, reconstruye las
condiciones de pago y rechaza cualquier campo de pago inconsistente. Para
importes finitos acepta la igualdad exacta y, si difieren, exige que la
diferencia no exceda `Number.EPSILON * max(abs(actual), abs(esperado))` ni
`1e-12`. Además, ambos deben dar el mismo número al redondearse a 15 cifras
significativas y al menos uno debe ser exactamente ese número. Esta regla
restringe la tolerancia anterior y rechaza diferencias de centavos y de
subcentavos como `0.001`; no redondea los subtotales ni el total del carrito,
que pueden tener más de dos decimales. No puede distinguir un cambio
intencional del mismo valor numérico que un artefacto binario admitido.
Los demás campos se comparan estrictamente. El número puede ser
`null` o un identificador `FL-<fecha>-<secuencia>` válido; al restaurarlo
conserva el estado confirmado.

**Errores de construcción y restauración:** los constructores y métodos
`fromJSON()` validan antes de devolver instancias. Los métodos de búsqueda y
operación del carrito comunican los errores con sus objetos de resultado en
vez de lanzar por entradas inválidas de esos métodos. La presentación de
errores en la interfaz y el reporte de fallos de Storage pertenecen a la
integración, no a estas clases.

## 5. Relaciones entre clases implementadas

| Relación | Multiplicidad y comportamiento | Justificación |
|---|---|---|
| Agregación: `Catalogo` — `Producto` | Un catálogo contiene 0..* instancias de `Producto`; cada instancia puede existir fuera del catálogo. | El catálogo almacena una copia del arreglo y no expone la colección interna. |
| Dependencia: `Carrito` → `Catalogo` | Cada llamada a `agregar` recibe un catálogo; el carrito no lo conserva. | Se guarda una instantánea de código, nombre, categoría y precio del producto. |
| Composición: `Carrito` — ítems | Un carrito contiene 0..* snapshots como objetos planos; cada snapshot pertenece a esa colección. | No hay una clase `ItemCarrito`; los snapshots se copian al resumir y serializar. |
| Dependencia: `Pedido` → `Carrito` y `Pago` | Se construye a partir de una instancia de cada tipo y conserva copias de sus datos calculados. | El resumen del pedido no cambia si luego se vacía el carrito. |

No hay herencia entre las clases. El pago elegido no es estado del carrito:
`Pedido` recibe un `Pago` al construirse y valida que corresponda al total
actual redondeado del carrito.

## 6. Arquitectura y encapsulamiento

- Los cinco modelos usan campos privados y no ofrecen setters generales.
  Los getters de `Producto`, los resúmenes y `toJSON()` no exponen las
  colecciones o snapshots internos; `Catalogo.obtenerProductos()` devuelve
  una copia del arreglo.
- Los constructores y `fromJSON()` validan sus invariantes. Las operaciones
  del carrito construyen el estado candidato y lo recalculan antes de
  sustituir el estado actual; un fallo devuelve error sin mutar el carrito.
- `Catalogo.buscar()` valida los criterios y devuelve objetos de resultado
  explícitos; el orden predeterminado es ascendente y `"desc"` habilita el
  orden descendente.
- `Carrito.resumir()` calcula subtotales, total, número de ítems distintos y
  unidades. Detecta subtotales o totales no finitos y sumas de unidades fuera
  del rango entero seguro.
- `Pago` comprueba la finitud de los importes calculados. `Pedido` conserva
  snapshots de cliente, productos y condiciones de pago; valida de nuevo
  subtotales, total y pago al restaurar.
- Los modelos no dependen de navegador, DOM, eventos ni Web Storage. La
  invalidación de un pago al cambiar el total, cancelaciones y limpieza tras
  confirmar corresponden a Eventos + DOM y a Storage, no a los modelos.

## 7. Separación de negocio, eventos y DOM

Los modelos no usan DOM, eventos, `prompt()`, `alert()` ni Web Storage.
Las validaciones, filtros, cálculos, instantáneas y numeración pertenecen al
dominio. El controlador leerá formularios, convertirá entradas cuando
corresponda, llamará a los métodos, manejará errores y mostrará resultados.
Los formatos visuales de moneda y mensajes corresponden a la presentación.

La implementación de los modelos está separada de `js/script.js`; esto no
significa que el controlador ya los invoque. La adaptación del controlador y
de los controles HTML sigue correspondiendo a Eventos + DOM. Aún se debe
integrar la interfaz con los contratos anteriores sin trasladar
`prompt()`/`alert()` a las clases.

## 8. Integración con otros roles: estado actual

- **Eventos + DOM — integrado (PR #156):** `script.js` conecta los formularios
  y acciones de interfaz con `Catalogo.buscar`, `Carrito`, `Pago.calcular` y
  `Pedido.resumir()`/`confirmar()`. Las cancelaciones, la invalidación de pago
  y la limpieza posterior las gestiona el controlador, no los modelos.
- **Storage — implementado (PR #157), sin conectar en `script.js`:**
  `StorageUtil` guarda objetos planos con `toJSON()` y los restaura mediante
  `fromJSON()`; su uso desde la página queda pendiente de coordinación.
  Ausencia de datos, JSON corrupto, fallo de almacenamiento y error de
  validación deben distinguirse. Los modelos no acceden al navegador.
- **Tester QA — suite ejecutada:** existe
  `js/test/models.spec.js` con casos Jasmine de las cinco clases y un runner
  autónomo `js/test/models-test-runner.html`. Resultado verificado: 84 specs,
  0 failures (ver AT CLOSE, sección 12).
  `docs/04-testing/pruebas-modelos-poo.md` contiene instrucciones y el
  resultado de ejecución. La invalidación/cancelación del flujo integrado y Storage
  quedan fuera de esta suite de modelos.

## 9. Diagrama UML: estado actual

En el repositorio existen `diagrama-clases.puml`, `diagrama-clases.png` y
`diagrama-clases-doc.md` bajo `docs/05-diagramas/02-diagrama-de-clases/`.
El diagrama corresponde a las cinco clases, con snapshots de carrito y datos
de cliente como objetos de valor, no como clases adicionales. En RC50 se
precisaron las formas de los objetos de entrada y retorno, el método y las
cuotas de pago, los auxiliares de módulo y las dependencias reales; se
conservaron las multiplicidades de la agregación de catálogo y se aclaró
que el carrito y el pedido guardan copias. También se corrigió la descripción
de `ServicioOpcionesPago` y se representó el campo privado estático de
`FormateadorMoneda`. El detalle está en `diagrama-clases-doc.md`.
Mantenerlo alineado si cambian los contratos detallados en la sección 4.

Los tres entregables UML se encuentran en
`docs/05-diagramas/02-diagrama-de-clases/`.

## 10. Archivos y entregables esperados

| Entregable | Estado y alcance |
|---|---|
| `docs/03-specs/actividad-obligatoria-4/spec-dev-poo.md` | Actualizado para reflejar los contratos observados en los modelos; no implica integración. |
| `js/models/Producto.js`, `Catalogo.js`, `Carrito.js` | Implementados; conforman las clases principales. |
| `js/models/Pago.js`, `Pedido.js` | Implementados como clases adicionales de pago y pedido. |
| `js/test/models.spec.js` | Suite Jasmine para las cinco clases; ejecutada: 84 specs, 0 failures. |
| `js/test/models-test-runner.html` | Runner autónomo que inicializa Jasmine, importa la suite y luego la ejecuta. |
| `docs/04-testing/pruebas-modelos-poo.md` | Instrucciones y estado de ejecución de la suite. |
| `docs/05-diagramas/02-diagrama-de-clases/diagrama-clases.puml` | Archivo presente en el repositorio. |
| `docs/05-diagramas/02-diagrama-de-clases/diagrama-clases.png` | Archivo presente en el repositorio. |
| `docs/05-diagramas/02-diagrama-de-clases/diagrama-clases-doc.md` | Archivo presente en el repositorio. |
| `js/script.js`, `index.html`, Storage | Modelos integrados con la interfaz (PR #156); `StorageUtil` (PR #157) disponible y aún no usado por `script.js`. |

## 11. Criterios de aceptación

| Criterio | Estado |
|---|---|
| Entidades de dominio identificadas y justificadas. | Implementado en este diseño. |
| Clases principales `Producto`, `Catalogo` y `Carrito`; clases complementarias `Pago` y `Pedido`. | Implementadas en `js/models/`. |
| Constructores y métodos documentados con JSDoc. | Implementado en los cinco modelos. |
| Encapsulamiento y validaciones internas. | Implementado en los cinco modelos. |
| Lógica de negocio separada de DOM y eventos. | Implementado en los módulos; consumidos desde `script.js` (PR #156). |
| Serialización y restauración (`toJSON()`/`fromJSON()`). | Implementado en los cinco modelos. |
| Diagrama PlantUML, exportación PNG y documentación UML. | Los tres archivos existen; revisar su alineación cuando cambien contratos. |
| Contratos para Eventos + DOM y Storage. | Documentados; Eventos + DOM integrado (PR #156); Storage compatible (PR #157), sin conectar aún en la página. |
| Suite para QA de modelos. | Jasmine ejecutado: 84 specs, 0 failures (PASS); ramas y sentencias sin porcentaje fiable (sección 12). |
| Evidencia de uso/generación mediante Copilot. | Registrada en la sección 12.1 (prompt, fragmento y ajustes aportados por el responsable del rol). |

## 12. AT CLOSE — Evidencias

### Resultado de pruebas Jasmine (verificado)

- RC51: línea de base **73 specs, 0 failures**, semilla `56412`; después de
  incorporar 11 pruebas, **84 specs, 0 failures**, semilla `15778`. Se
  ejecutó el runner de modelos en navegador, servido por HTTP local.
- Los casos nuevos comprueban textos y criterios de producto; catálogo
  vacío o disperso, filtros y precio cero; desbordes y copias del carrito;
  redondeo, restauración y entradas inválidas de pago; y copias, numeración
  segura y restauración de pedidos.
- Estimación nativa V8 antes y después: 341/341 líneas y 73/73 funciones
  informadas, ambas 100 % según los criterios explicados en
  `docs/04-testing/pruebas-modelos-poo.md`. Los rangos internos de V8 no
  equivalen a todas las ramas; no se midieron porcentajes fiables de ramas
  ni sentencias. El documento incluye pasos y evidencia de reproducción.
- Revisión de cadenas numéricas estrictas (PR #150): 42 ejecutadas, 42
  aprobadas y 0 fallidas; salida `42 specs, 0 failures, randomized with seed 95696`.
  Runner servido por HTTP local y ejecutado en navegador.
- Revisión monetaria de la PR #150: 39 ejecutadas, 39 aprobadas y 0 fallidas;
  salida `39 specs, 0 failures, randomized with seed 86682`. Runner servido
  por HTTP local y ejecutado en navegador mediante Playwright.
- Revisión de hallazgos #2 y #3: 35 ejecutadas, 35 aprobadas y 0 fallidas;
  salida `35 specs, 0 failures, randomized with seed 92645`. Evidencia:
  `docs/04-testing/captura-jasmine-modelos-poo-hallazgos-2-3.png`.
- Ejecución anterior para los hallazgos #1 y #4:
- Runner: `js/test/models-test-runner.html` (Jasmine 5.10.0), servido por HTTP
  local y abierto en navegador.
- Ejecutadas: 29. Aprobadas: 29. Fallidas: 0. Pendientes/omitidas: 0.
- Salida de Jasmine: `29 specs, 0 failures, randomized with seed 13609`.
- Corrección del hallazgo #1: el runner ya no usa `boot1.min.js` (que ejecuta
  la suite en `window.onload`); inicializa el reporter, importa
  `models.spec.js` con `await import()` y recién entonces llama a
  `env.execute()`.
- Evidencia: `docs/04-testing/captura-jasmine-modelos-poo.png` y
  `docs/04-testing/pruebas-modelos-poo.md`.

## 12.1 Evidencias de GitHub Copilot Agent Mode

Evidencia registrada por el responsable del rol (prompt utilizado, fragmento
generado y ajustes manuales):

### Prompt exacto de implementación

```text
Necesito que implementes mi parte de la Actividad Obligatoria N.º 4 del proyecto FerroLab, correspondiente al rol **Desarrollador JS POO (Lógica de Negocio)**.

**IMPORTANTE: antes de modificar cualquier archivo, revisá el repositorio completo y especialmente:**

- `docs/03-specs/actividad-obligatoria-4/spec-dev-poo.md`, que es mi especificación aprobada.
- `plan.md` y los requerimientos funcionales correspondientes.
- Las especificaciones de los compañeros relacionadas con Eventos + DOM y Storage.
- Los archivos existentes en `js/` y la estructura actual del proyecto.
La especificación ya fue aprobada y subida a `develop`, por lo que ahora corresponde implementar las clases.

## 1. Objetivo
Crear las siguientes cinco clases JavaScript utilizando programación orientada a objetos:

1. `Producto`
2. `Catalogo`
3. `Carrito`
4. `Pago`
5. `Pedido`
Las tres primeras son las clases principales de mi rol. Las dos restantes complementan los procesos de pago y confirmación de pedidos.

Los archivos deben ubicarse en `js/models/`, respetando la estructura y las convenciones del repositorio.

## 2. Requisitos generales

- Utilizar JavaScript moderno y clases ES6.
- Implementar constructores, atributos, métodos y validaciones de acuerdo con el spec aprobado.
- Aplicar encapsulamiento cuando corresponda.
- Documentar constructores y métodos públicos mediante JSDoc.
- Implementar `toJSON()` y `static fromJSON()` para facilitar la integración con Storage.
- Mantener la lógica de negocio dentro de las clases.
- No utilizar `document`, `window`, `alert`, `prompt` ni manipulación del DOM dentro de los modelos.
- No modificar `js/script.js`, `index.html` ni archivos correspondientes a otros roles.
- No duplicar validaciones de negocio que deban estar centralizadas en las clases.
- No inventar funcionalidades ajenas a los requerimientos.

## 3. Contratos de integración
Tomar como referencia las observaciones de la Issue #147 del rol Eventos + DOM.

**Producto**

Implementar el constructor, las validaciones y los métodos públicos definidos en el spec.

Contemplar:

- `coincide({texto, categoria, precioMaximo})`
- `toJSON()`
- `static fromJSON(datos)`
Permitir que el controlador consulte los datos del producto mediante `toJSON()`, sin acceder directamente a atributos privados.

**Catalogo**

Contemplar:

- `obtenerProductos()`
- `obtenerPorCodigo(codigo)`
- `buscar({texto, categoria, precioMaximo, orden})`
- `toJSON()`
- `static fromJSON(datos)`
El método `buscar()` debe admitir ordenamiento ascendente (`asc`) y descendente (`desc`), respetando los criterios definidos en el spec.

El filtro de precio máximo desactivado debe representarse mediante `null` o un parámetro omitido. El valor `0` no debe confundirse con un filtro desactivado.

Mantener una respuesta estructurada de búsqueda con `valido`, `error` y `resultados`.

**Carrito**

Contemplar:

- `agregar(catalogo, codigo, cantidad)`
- `cambiarCantidad(codigo, cantidad)`
- `eliminar(codigo)`
- `resumir()`
- `vaciar()`
- `toJSON()`
- `static fromJSON(datos)`
Los métodos que modifican el carrito deben devolver respuestas consistentes de éxito o error.

`resumir()` debe devolver los productos, el total y la cantidad de ítems, diferenciando cantidad de productos distintos y cantidad total de unidades cuando corresponda.

No implementar reglas de envío que no estén especificadas.

**Pago**

Implementar las reglas de cálculo de pago y financiación definidas en el spec.

Contemplar:

- `calcular()`
- `toJSON()`
- `static fromJSON(datos)`
Respetar los métodos de pago, cuotas, porcentajes de recargo y validaciones establecidos en la documentación.

Mantener respuestas de validación consistentes. No inventar porcentajes ni métodos de pago.

**Pedido**

Implementar la creación, validación y confirmación de pedidos.

Contemplar:

- `resumir()`
- `confirmar(fechaEnMilisegundos, secuencia)`
- `toJSON()`
- `static fromJSON(datos)`
Las validaciones del cliente deben permitir identificar qué campo es incorrecto, por ejemplo `nombre`, `correo` o `direccion`.

La generación del número de pedido debe utilizar los parámetros acordados, sin depender directamente del DOM ni de Storage.

Evitar que un mismo pedido se confirme dos veces si el spec establece confirmación única.

## 4. Integración con los compañeros
Preparar las clases para que puedan ser utilizadas desde el controlador Eventos + DOM y desde Storage.

Preferir módulos ES6 con exportaciones e importaciones explícitas, siempre que sean compatibles con la arquitectura acordada.

No modificar el controlador para integrar las clases: esa tarea corresponde al compañero responsable de Eventos + DOM.

No implementar persistencia directamente en los modelos.

## 5. Calidad y comprobaciones

- Verificar que las cinco clases puedan instanciarse correctamente.
- Comprobar validaciones, búsquedas, carrito, pagos y pedidos.
- Revisar los casos de error y los datos inválidos.
- Comprobar la serialización y reconstrucción mediante `toJSON()` y `fromJSON()`.
- Mantener compatibilidad entre los contratos públicos de las cinco clases.
- No agregar dependencias externas innecesarias.

## 6. Restricciones importantes
No modificar archivos de otros integrantes, ni `changelog.md`, ni generar commits, push o pull requests.

No crear todavía el diagrama UML, porque lo vamos a trabajar después.

Si encontrás diferencias entre el spec aprobado y las propuestas de la Issue #147, no cambies silenciosamente los contratos. Informame las diferencias y proponé cómo resolverlas antes de implementar la parte afectada.

## 7. Resultado esperado
Crear estos archivos:

- `js/models/Producto.js`
- `js/models/Catalogo.js`
- `js/models/Carrito.js`
- `js/models/Pago.js`
- `js/models/Pedido.js`
Al finalizar, explicame:

1. Qué archivos creaste.
2. Qué atributos y métodos tiene cada clase.
3. Qué validaciones implementaste.
4. Cómo se relacionan las clases entre sí.
5. Qué decisiones de integración quedan pendientes de confirmar con Eventos + DOM o Storage.
6. Qué pruebas realizaste y cuáles fueron sus resultados.
**Trabajá únicamente sobre mi rol de Desarrollador JS POO y respetá la especificación aprobada como fuente principal.**
```

### Archivos utilizados como contexto

Según el prompt anterior, se indicó a GitHub Copilot Agent Mode que revisara:

- `docs/03-specs/actividad-obligatoria-4/spec-dev-poo.md` (especificación aprobada).
- `plan.md` y los requerimientos funcionales.
- Los specs de Eventos + DOM y de Storage de la Actividad N.º 4.
- Los archivos existentes en `js/` y la estructura del proyecto.

### Fragmento de código generado

Como evidencia de la implementación realizada con GitHub Copilot Agent Mode, seleccioné un fragmento del método `buscar()` de la clase `Catalogo`.

**Archivo:** `js/models/Catalogo.js`

Este método permite filtrar los productos y ordenarlos por precio de manera ascendente o descendente, manteniendo la lógica de negocio separada del DOM.

```javascript
const filtros = {
    texto: normalizarTexto(texto),
    categoria: normalizarTexto(categoria),
    precioMaximo: precio
};

const resultados = this.#productos.filter((producto) =>
    producto.coincide(filtros)
);

resultados.sort((a, b) =>
    orden === "asc" ? a.precio - b.precio : b.precio - a.precio
);

return { valido: true, error: null, resultados };
```

Este fragmento demuestra cómo utilicé programación orientada a objetos para realizar las búsquedas del catálogo, aprovechando el método `coincide()` de la clase `Producto` y devolviendo un resultado estructurado.

### Ajustes manuales

Durante la revisión de la implementación identifiqué problemas relacionados con la validación de arreglos con posiciones vacías, el manejo de errores y los límites seguros de cantidades.

Estas situaciones fueron corregidas con asistencia de GitHub Copilot Agent Mode, manteniendo los contratos definidos para las clases.

También realicé comprobaciones posteriores para verificar el funcionamiento de los modelos.

### Decisiones finales y coordinación

Decidí mantener la lógica de negocio separada del DOM y de Storage, utilizando clases ES6 y métodos `toJSON()` y `fromJSON()` para permitir la serialización y restauración de objetos.

Además, incorporé:

- Ordenamiento ascendente y descendente en `Catalogo.buscar()`.
- Validaciones para las operaciones del carrito.
- Cálculo de cantidades, subtotales y totales.
- Reglas para métodos de pago, cuotas y recargos.
- Validaciones de clientes y confirmación de pedidos.

Eventos + DOM quedó integrado en la PR #156; la conexión de `StorageUtil` en `script.js` continúa pendiente de coordinación con los responsables de esos roles.

Las pruebas automatizadas de los modelos se encuentran en `js/test/models.spec.js`, utilizando un runner independiente para no modificar las pruebas existentes de Tester QA.

Resultado más reciente de Jasmine: 84 specs, 0 failures (sección 12).