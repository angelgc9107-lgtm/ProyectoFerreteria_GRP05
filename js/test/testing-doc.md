# Documentación de Testing - Suite Jasmine

Proyecto FerroLab - Actividad Obligatoria N°4 - Programación Web I
Módulos testeados: `js/models/*.js`, `js/services/*.js`, `js/utils/storage.js` y `js/script.js` | Framework: Jasmine 5.10.0 (CDN)

## Índice
1. [Estructura de la suite](#estructura-de-la-suite)
2. [Ejecución de Tests](#ejecución-de-tests)
3. [Suites de Tests](#suites-de-tests)
4. [Métricas de Cobertura](#métricas-de-cobertura)
5. [Herramientas y proceso](#herramientas-y-proceso)
6. [Capturas de Pantalla](#capturas-de-pantalla)
7. [Hallazgos e Issues](#hallazgos-e-issues)
8. [Limitaciones del Testing](#limitaciones-del-testing)
9. [Historial: tercera entrega](#historial-tercera-entrega)

---

## Estado de la corrida (leer primero)

Corrida completa de `test-runner.html` sobre la rama `release/cuarta-entrega` con las PR #167, #168, #169 (Desarrollador JS Eventos + DOM), #172 (Local y Session Storage) y #175 (POO) ya integradas, más los specs agregados en esta corrección de QA: **425 specs, 0 failures** (tres corridas con semillas distintas). Sin los specs de esta corrección, la rama de release tenía 405 specs, 0 failures. Después se agregó el spec de la corrección de RC51 (`Pedido.fromJSON()` lee el número una sola vez), y la suite quedó en **426 specs, 0 failures**.

Antes de esta corrección, la suite de la PR #169 tenía **220 specs y 3 failures**. Los tres eran specs desactualizados respecto del controlador (no defectos del código); se adaptaron y el detalle está en [Hallazgos e Issues](#hallazgos-e-issues). El código de producción (`js/script.js`, `index.html`, `js/models/`, `js/services/`, `js/utils/`) no fue modificado por esta corrección de QA, y tampoco la documentación de trazabilidad de los cuatro flujos que agregó la PR #169, que se conserva tal cual.

## Estructura de la suite

En la tercera entrega `js/script.js` tenía la lógica y usaba `prompt()`/`alert()`. En la cuarta entrega se separó en capas y hay un archivo spec por cada una:

| Módulo | Qué contiene | Spec | Specs |
|---|---|---|---|
| `js/models/` (`Producto`, `Catalogo`, `Carrito`, `Pago`, `Pedido`) | Lógica de negocio con clases, sin DOM ni Storage | `js/test/models.spec.js` | 89 |
| `js/utils/storage.js` (`StorageUtil`) | Capa de abstracción de `localStorage`/`sessionStorage` | `js/test/storage.spec.js` | 189 |
| `js/services/` | `FormateadorMoneda`, `ValidacionCarrito`, `ConfirmadorPedidos`, `FachadaStorage`, `ServicioOfertas`, `ServicioCategorias`, `ServicioOpcionesPago` | `js/test/services.spec.js` | 50 |
| `js/script.js` | Controlador: eventos y DOM | `js/test/script.spec.js` | 98 |
| | | **Total** | **426** |

`js/test/test-runner.html` carga los cuatro specs como módulos ES. `js/test/models-test-runner.html` es el runner independiente que armó el Desarrollador JS POO para sus modelos y se conserva.

## Ejecución de Tests

### Pasos para Ejecutar
1. Servir el proyecto por HTTP **desde la raíz del repo**. Los specs usan módulos ES, que el navegador bloquea al abrir el archivo con doble clic (`file://`):
   ```bash
   python -m http.server 8000
   ```
   También sirven `npx serve .` o la extensión Live Preview de VS Code.
2. Abrir el runner:
   ```text
   http://localhost:8000/js/test/test-runner.html
   ```
3. Los tests se ejecutan al cargar la página. La barra superior de Jasmine muestra el total de specs y los fallos.
4. Para correr una sola suite se filtra por nombre con el parámetro `spec`: `?spec=StorageUtil`, `?spec=Controlador`, `?spec=FachadaStorage`. Con `?random=false` el orden es fijo.

Requiere conexión a internet: Jasmine se carga desde `cdnjs.cloudflare.com` y `index.html` (que `script.spec.js` abre en un iframe) carga Bootstrap desde `cdn.jsdelivr.net`.

### Cómo funciona cada spec
- **`models.spec.js`** importa las clases (`import { Carrito } from "../models/Carrito.js"`) y las prueba de forma aislada, incluidos los casos borde de los constructores, de `fromJSON()` y de la numeración de pedidos.
- **`storage.spec.js`** importa `StorageUtil` y reemplaza `localStorage`/`sessionStorage` por un `Storage` simulado en memoria (`StorageFalso`), para forzar errores (cuota llena, `SecurityError`, `getItem()` ausente, `key()` y `length` defectuosos, valores no serializables) sin tocar el almacenamiento real. Un bloque usa los modelos reales de `js/models/` para comprobar los round trips con `toJSON()` / `fromJSON()`. El último bloque usa el Web Storage real del navegador y borra sus propias claves al terminar.
- **`services.spec.js`** prueba cada servicio de `js/services/`. Las pruebas de `FachadaStorage` instalan un `localStorage` y un `sessionStorage` en memoria (y uno que falla, para los casos de error) y restauran los originales al terminar. `ServicioOfertas` se prueba con catálogos armados en el propio spec.
- **`script.spec.js`**: `script.js` no exporta funciones, solo registra eventos sobre `index.html`. Por eso, para cada test se abre una copia nueva de `index.html` en un `<iframe>` del mismo origen, se disparan eventos reales (`click`, `input`, `change`, `submit`) y se comprueba el DOM resultante. Cada copia empieza con el carrito, el pago y el pedido en blanco. Como el controlador guarda el carrito en el Web Storage real (mismo origen que el runner), antes de cada test se guardan los valores originales de `app:carrito:items`, `app:pedidos:secuencia` y `app:pedidos:historial`, se borran, y al terminar el test se restauran (aislamiento incorporado por el Desarrollador Eventos + DOM en la PR #169). Antes de cada test se reemplazan `alert`, `prompt`, `confirm`, `console.log` y `console.error` del iframe por espías.

---

## Suites de Tests

### `models.spec.js` (89 specs)

| Suite | Specs | Qué se prueba |
|---|---|---|
| `Producto` | 5 | Constructor, getters, `coincide()` por texto, categoría y precio; validaciones |
| `Catalogo` | 6 | `buscar()` con filtros y orden, copias independientes, códigos duplicados, errores |
| `Carrito` | 7 | `agregar`, `cambiarCantidad`, `eliminar`, `vaciar`, `resumir()`, desbordes, estado intacto ante errores |
| `Carrito: validación de instantáneas y casos borde` | 14 | Ítems que no son objetos, campos de texto vacíos o de otro tipo, precio y cantidad inválidos, códigos repetidos, totales infinitos o fuera del entero seguro, `cambiarCantidad`/`eliminar` con códigos inexistentes, `fromJSON()` con forma inválida |
| `Pago` | 6 | Efectivo/transferencia, tarjeta en 1/3/6 cuotas (0/10/20 %), redondeo, entradas inválidas |
| `Pago: método con cuotas` | 1 | `Pago.admiteCuotas()` |
| `Pago y Pedido: validaciones restantes` | 3 | Método de pago que no es cadena, desborde a importe infinito, pago que no es instancia de `Pago` |
| `Pedido` | 15 | Validación de cliente, coherencia con el pago, `confirmar()` determinista, `toJSON()`/`fromJSON()` |
| `Pedido: validación de campos, confirmación y reconstrucción` | 4 + 13 | Cliente que no es objeto, campo que informa el error, segunda confirmación, parámetros inválidos de `confirmar()`; y `fromJSON()` con número mal formado, importes o condiciones de pago inconsistentes y cliente inválido (13 specs, incluidos los que agregó el análisis de mutación: fecha 0, total con un bit de diferencia y total con un centavo de diferencia) |
| `Pago y Pedido: validaciones restantes › RC51: límites y contratos complementarios` | 12 | Specs agregados por el Desarrollador JS POO en la PR #175: validación de todos los campos textuales de `Producto`, búsqueda en la descripción, colecciones vacías o dispersas en `Catalogo`, precio cero frente al filtro omitido y tipos de criterios; y un spec de la corrección de RC51 que comprueba que `Pedido.fromJSON()` lee el número una sola vez y guarda el mismo valor que validó |
| `Cadenas numéricas estrictas` | 3 | `"0x10"`, `"1e2"` y `"1e3"` se rechazan en `Carrito`, `Catalogo` y `Pago`; se aceptan dígitos con espacios |

### `storage.spec.js` (189 specs)

| Suite | Specs | Qué se prueba |
|---|---|---|
| Nombres de clave (`CLAVES`) | 3 | Convención `app:<dominio>:<dato>` |
| `guardar()` y `obtener()` | 9 | Ida y vuelta en `localStorage` y `sessionStorage`, valores `null`, anidados, clave inexistente |
| `guardar()`: errores | 16 | Clave o tipo inválidos, referencia circular, otros fallos de escritura y un `console.error` que lanza al registrar el fallo (error inesperado) |
| Detección de storage lleno (cuota) | 8 | `QuotaExceededError` y variantes entre navegadores; otros errores no se confunden con cuota |
| Serialización: valores que no se pueden guardar | 9 | Referencias circulares (también a través de `toJSON()`), `undefined`, funciones, símbolos y `BigInt`; se aceptan `null`, números, booleanos, cadenas y objetos repetidos que no son ciclos |
| Datos corruptos | 4 | JSON inválido: devuelve `null` y registra el error sin lanzar |
| Errores al leer | 6 | `getItem()` que lanza: `obtener()`, `existe()`, `actualizar()` y `estaDisponible()` devuelven el valor de fallo sin lanzar |
| `actualizar()` | 6 | Actualiza claves existentes; no crea las inexistentes |
| `eliminar()` | 6 | Elimina; es idempotente |
| `listar()` | 7 | Claves con prefijo, ordenadas; sin coincidencias |
| `key()` y `length` | 7 | `key()` que devuelve `null` o lanza, `length` que lanza, prefijo o tipo de storage inválidos en `listar()` |
| `limpiar()` | 5 | Borra solo `app:*`; `limpiar(tipo, false)` borra todo |
| `limpiar()`: ramas adicionales | 6 | Con y sin `soloApp`, tipo inválido, `clear()` o `removeItem()` que lanzan, `sessionStorage` sin tocar `localStorage` |
| `existe()` | 4 | Refleja el estado real |
| `estaDisponible()` | 9 | Storage deshabilitado o inaccesible |
| Storage inaccesible (`SecurityError`) | 3 | Ninguna operación lanza |
| Storage no disponible en el entorno | 1 | Entorno sin Web Storage |
| Storage sin `getItem()` o ausente | 24 | Las 12 operaciones con un storage al que le falta `getItem()` y con storage `null` |
| `guardarInstancia()` y `cargarInstancia()` | 8 | Contrato genérico con una clase auxiliar `Modelo` (`toJSON()` / `fromJSON()`) |
| `guardarLista()` y `cargarLista()` | 9 | Contrato genérico con `Modelo`: listas, lista vacía, datos que ya no cumplen las reglas |
| Instancias y listas: ramas de error | 15 | Valor sin `toJSON()` o con `toJSON()` que lanza, clase sin `fromJSON()`, sin datos guardados, lista que no es un arreglo, elemento inválido (se descarta la lista completa) y clase cuyo `fromJSON` lanza al consultarse (`cargarInstancia()`/`cargarLista()` devuelven `null`/`[]` sin lanzar) |
| Integración con los modelos reales de `js/models/` | 9 | Round trip de `Carrito`, `Catalogo`, `Producto` y `Pedido` (sin confirmar y confirmado); datos alterados (cantidad negativa, importe modificado, correo inválido) devuelven `null` o `[]`, sin objetos parciales |
| Ninguna operación lanza excepciones hacia afuera | 12 | Se verifica para cada operación |
| Web Storage real del navegador | 3 | Ciclo completo sin dejar claves |

### `services.spec.js` (50 specs)

| Suite | Specs | Qué se prueba |
|---|---|---|
| `FormateadorMoneda` | 3 | Pesos argentinos con dos decimales, redondeo, importes negativos |
| `ValidacionCarrito.validarCambioCantidad` | 3 | Acepta sin modificar el carrito, rechaza cantidades inválidas y códigos inexistentes |
| `ConfirmadorPedidos.confirmarPedidoConNumeracion` | 5 | Confirma y devuelve el número, números consecutivos, rechaza lo que no es `Pedido`, no confirma dos veces, un rechazo no consume número |
| `FachadaStorage` | 23 | Congelada; carrito (round trip, vacío, datos corruptos o con estructura inválida, storage lleno, valor no serializable); historial y secuencia (round trip, corrupto, no es lista, storage lleno); preferencias y caché del catálogo; datos de sesión (borrador, filtros, bienvenida, en `sessionStorage` y no en `localStorage`); storage bloqueado (`SecurityError`) |
| `ServicioOfertas.obtenerOfertas` | 6 | Las tres ofertas con datos del catálogo, precio actual tomado del catálogo, precio anterior mayor, catálogo inválido (`TypeError`), producto ausente y precio anterior no mayor (`RangeError`) |
| `ServicioCategorias.obtenerCategorias` | 3 | Únicas y ordenadas, orden del español (`Á`, `Ñ`), catálogo vacío |
| `ServicioOpcionesPago` | 7 | Métodos aceptados por `Pago`, cuotas por método (1 para efectivo/transferencia; 1, 3 y 6 para tarjeta con su recargo), sin método → `[]`, método inexistente → `[]` y un error que no es de validación (ni `TypeError` ni `RangeError`) que se relanza en lugar de ocultarse |

### `script.spec.js` (98 specs)

| Suite | Specs | Qué se prueba |
|---|---|---|
| Carga inicial | 4 | 9 productos visibles, carrito vacío, botón deshabilitado, pago y confirmación ocultos |
| RC44: renderizado dinámico | 4 | Generación dinámica del catálogo, ofertas, tabla de precios, categorías y opciones de pago |
| Flujo 1: búsqueda y filtrado | 12 | Texto, tildes y mayúsculas, ausencia de coincidencias, envío del formulario, categoría, orden asc/desc, rango de precio, menú de categorías y recuperación de resultados |
| Flujo 2: carrito | 12 | Agregar productos, actualizar cantidades, validar con input, confirmar cambios con change, rechazar cantidades inválidas, eliminar productos e invalidar el pago |
| Flujo 3: pago y cuotas | 13 | Efectivo/transferencia, tarjeta en 1, 3 y 6 cuotas, cálculo de recargos, validación del método, cambios de cuotas, invalidación de confirmación y cancelación |
| Flujo 4: confirmación del pedido | 13 | Validación al enviar el formulario, corrección de errores, generación del resumen, invalidación y regeneración, confirmación, numeración y cancelación |
| Requisitos transversales | 7 | Uso del DOM y eventos, accesibilidad, mensajes de estado y controles sobre interacciones del navegador |
| Persistencia del carrito en Web Storage | 8 | Guarda el carrito al agregar, lo restaura al recargar la página, conserva cambios de cantidad y eliminaciones, carrito vacío tras vaciar y tras confirmar, ignora datos corruptos o con estructura inválida, nada en `sessionStorage` |
| Casos borde | 11 | Carrito vacío (4: iniciar compra, pago, pedido sin pago, vaciar a mitad del pago), acciones repetidas (5: doble envío del pago, doble resumen, doble confirmación, doble cancelación, doble inicio de compra), storage que rechaza escrituras (2: se avisa al usuario y la compra se completa igual) |
| Eventos que no corresponden a una acción | 2 | Clics fuera de un botón de acción e `input`/`change` en el panel del carrito que no vienen de una cantidad: no cambian nada |
| Rutas defensivas y de error | 12 | Confirmar sin pedido pendiente (RC24), acciones desconocidas en el carrito y en la confirmación, cierre del carrito sin compra iniciada, `input` ajeno al formulario del pedido, reloj del sistema inválido y reintento, filtro de precio alterado a mano, cuota inexistente agregada a mano, error inesperado al generar el resumen (no se oculta), página sin un elemento obligatorio (`#form-pago`) que avisa y no registra eventos, página sin `#estado-aplicacion` que sigue funcionando y comprobación de que `index.html` carga `script.js` como módulo diferido |


### Trazabilidad del Flujo 1

**Diagrama:** `docs/05-diagramas/01-diagrama-de-actividades/actividad-flujo-1-busqueda-filtrado.puml`

**Implementación:** `js/script.js` y `js/models/Catalogo.js`

**Pruebas:** `js/test/script.spec.js`

| Decisión o estado del diagrama | Prueba Jasmine |
|---|---|
| Búsqueda por texto | Filtra por texto mientras se escribe |
| Normalización de texto | Ignora mayúsculas y tildes |
| Búsqueda sin resultados | Muestra «Sin coincidencias.» |
| Filtrado por categoría | Filtra por categoría |
| Ordenamiento | Ordena por precio ascendente y descendente |
| Activación y desactivación del filtro de precio | Pruebas del filtro de precio |
| Recuperación de resultados | Recupera los resultados al corregir una búsqueda sin coincidencias |
| Recuperación después de un filtro restrictivo | Recupera los productos al quitar un filtro de precio sin coincidencias |
| Conservación de los datos originales del catálogo | RC60 - el módulo conserva los nueve productos y sus precios originales |
| Separación de los datos operativos del controlador | RC60 - el controlador importa los productos sin declararlos localmente |
| Integración del módulo de datos con el DOM | RC60 - renderiza correctamente los productos del módulo de datos |

**Observación:** Los datos iniciales del catálogo fueron trasladados a un módulo independiente, manteniendo en el controlador únicamente la inicialización de los modelos, la orquestación, los eventos y la manipulación del DOM. Se verificó que no se produjeran regresiones en los cuatro flujos principales ni en la corrección de RC59.

**Resultado Jasmine:** 12 specs, 0 failures.


### Trazabilidad del Flujo 2 — Carrito

**Diagrama:** `docs/05-diagramas/01-diagrama-de-actividades/actividad-flujo-2-carrito.puml`

**Implementación:** `js/script.js`, `js/models/Carrito.js` y `js/services/FachadaStorage.js`

**Pruebas:** `js/test/script.spec.js`

| Decisión o estado del diagrama | Prueba Jasmine |
|---|---|
| Agregar productos desde el catálogo | Agrega un producto desde el catálogo y actualiza contador, total y botón |
| Agregar desde ofertas | Agrega un producto desde la sección de ofertas |
| Acumular cantidades | Agregar dos veces el mismo producto suma la cantidad y no duplica el ítem |
| Agregar distintos productos | Suma varios productos distintos |
| Modificar cantidades | Cambia la cantidad y recalcula subtotal y total |
| Validación de cantidades inválidas | Una cantidad inválida se marca en el campo sin modificar el carrito |
| Rechazar notación científica | Una cantidad en notación científica se rechaza |
| Rechazar cantidades decimales | Una cantidad decimal se rechaza y deja el carrito igual |
| Eliminar productos | Elimina un producto y vuelve al estado vacío |
| Conservar productos restantes | Eliminar un producto conserva los demás |
| Diferenciar input y change | Valida la cantidad con input sin modificar el total hasta change |
| Invalidar pago por modificación del carrito | Modificar la cantidad después de elegir el pago invalida la confirmación |

**Resultado Jasmine:** 12 specs, 0 failures.

**Ejecución:** suite individual con `random=false`.

**Observación:** La persistencia del carrito y los posibles errores de almacenamiento requieren verificaciones específicas adicionales.

**Actualización de QA (2026-11-23):** esas verificaciones adicionales están en las suites «Persistencia del carrito en Web Storage» y «Casos borde» de `script.spec.js` y en la suite `FachadaStorage` de `services.spec.js` (ver «Suites de Tests»).

### Trazabilidad del Flujo 3 — Pago y cuotas

**Diagrama:** `docs/05-diagramas/01-diagrama-de-actividades/actividad-flujo-3-pago-cuotas.puml`

**Implementación:** `js/script.js` y `js/models/Pago.js`

**Pruebas:** `js/test/script.spec.js`

| Decisión o estado del diagrama | Prueba Jasmine |
|---|---|
| Iniciar proceso de compra | Iniciar la compra muestra la sección de pago y el indicador de carga |
| Transición al pago | Al cerrarse el carrito el indicador pasa a «Pago listo para completar.» |
| Efectivo o transferencia | Efectivo o transferencia: una cuota y sin recargo |
| Tarjeta en 1 cuota | Tarjeta en una cuota no aplica recargo |
| Tarjeta en 3 cuotas | Tarjeta en 3 cuotas aplica 10 % de recargo |
| Tarjeta en 6 cuotas | Tarjeta en 6 cuotas aplica 20 % de recargo |
| Modificación de cuotas | Cambiar las cuotas recalcula y avisa que hay que revisar las condiciones |
| Cambio a efectivo | Volver a efectivo deshabilita las cuotas y las reinicia a 1 |
| Método de pago faltante | Continuar sin elegir método muestra el error y no avanza |
| Condiciones válidas | Continuar con un método válido habilita los datos del cliente |
| Modificación del carrito | Un cambio en el carrito descarta el pago anterior |
| Cancelación de pago | Cancelar el pago oculta la sección y conserva el carrito |
| Cambio de método después de continuar | Cambiar el método de pago invalida la confirmación anterior |

**Resultado Jasmine:** 13 specs, 0 failures.

**Ejecución:** suite individual con `random=false`.

### Trazabilidad del Flujo 4 — Confirmación del pedido

**Diagrama:** `docs/05-diagramas/01-diagrama-de-actividades/actividad-flujo-4-confirmacion-pedido.puml`

**Implementación:** `js/script.js` y `js/models/Pedido.js`

**Pruebas:** `js/test/script.spec.js`

| Decisión o estado del diagrama | Prueba Jasmine |
|---|---|
| Validación del nombre | Valida el nombre al enviar el formulario |
| Validación del correo | Valida el correo al enviar el formulario |
| Correos con caracteres especiales | Acepta correos con caracteres no ASCII |
| Validación de dirección | Valida la dirección al enviar el formulario |
| Datos incompletos | Enviar con campos vacíos muestra el error y no genera resumen |
| Datos válidos | Enviar con datos válidos genera el resumen previo con el botón de confirmar |
| Modificación de datos | Modificar los datos después del resumen lo invalida |
| Confirmación válida | Confirmar muestra el número de pedido y limpia carrito y pago |
| Numeración de pedidos | Una segunda compra obtiene la secuencia siguiente |
| Pago financiado | Confirmar con tarjeta en 6 cuotas refleja el recargo en el resumen |
| Cancelación del pedido y visibilidad del feedback (RC61) | RC61 - cancelar el pedido conserva el carrito y las condiciones de pago |
| Cancelación con campos inválidos y limpieza de estados (RC59 y RC61) | RC61 - muestra el mensaje al cancelar con campos invalidos |
| Corrección de datos inválidos | Permite corregir datos inválidos y generar el resumen |
| Regeneración del resumen | Impide confirmar datos modificados e inválidos hasta regenerar el resumen |
| Validación durante la edición (RC22 y RC59) | RC59 - valida los campos del cliente durante input |
| Validación al abandonar el campo (RC22 y RC59) | RC59 - valida los campos vacíos mediante focusout |
| Corrección del feedback visual y accesible | RC59 - elimina los errores al corregir los datos del cliente |
| Validación individual de los campos | RC59 - valida cada campo independientemente de los demás |
| Conservación del resumen al perder el foco | RC59 - perder el foco sin modificar datos conserva el resumen |
| Conservación del estado de la compra | RC59 - validar los datos no modifica el carrito, pago ni storage |
| Limpieza de estados de validación | RC59 - cancelar el pedido elimina los estados de validación |

**Resultado Jasmine:** 13 specs, 0 failures.

**Ejecución:** suite individual con `random=false`.

**Observación:** La validación individual de los datos del cliente se realiza mediante los eventos `input` y `focusout`, delegando las reglas del dominio al servicio `ValidacionPedido.js`. La validación definitiva continúa realizándose mediante la clase `Pedido` al enviar el formulario.

La pérdida de foco no invalida el resumen del pedido, mientras que la modificación de los datos conserva el comportamiento de invalidación existente.
El mensaje de cancelación se presenta en la región visible `#pago-mensaje`, verificando su visibilidad y accesibilidad. Se conserva el carrito, las condiciones de pago y la posibilidad de retomar el proceso de compra.
Se verificó la compatibilidad entre las correcciones RC59, RC60 y RC61 dentro del flujo de confirmación del pedido.


---

## Métricas de Cobertura

Corrida completa de `test-runner.html`: **426 specs, 0 failures** (ver «Estado de la corrida»).

Se miden tres cosas, con la cobertura de código de V8 (Chromium, vía Playwright) durante esa misma corrida. **No son el mismo número**, y la cobertura de ramas es una estimación, no una medición equivalente a la de Istanbul o c8 (ver más abajo).

| Archivo | Líneas ejecutables | Cubiertas | Líneas | Funciones | Ramas |
|---|---|---|---|---|---|
| `js/models/Carrito.js` | 92 | 92 | 100,0 % | 21/21 (100,0 %) | 68/68 (100,0 %) |
| `js/models/Catalogo.js` | 46 | 46 | 100,0 % | 16/16 (100,0 %) | 36/36 (100,0 %) |
| `js/models/Pago.js` | 49 | 49 | 100,0 % | 7/7 (100,0 %) | 36/36 (100,0 %) |
| `js/models/Pedido.js` | 110 | 110 | 100,0 % | 16/16 (100,0 %) | 96/96 (100,0 %) |
| `js/models/Producto.js` | 44 | 44 | 100,0 % | 13/13 (100,0 %) | 19/19 (100,0 %) |
| `js/script.js` | 729 | 727 | 99,7 % | 60/60 (100,0 %) | 112/113 (99,1 %) |
| `js/services/ConfirmadorPedidos.js` | 10 | 10 | 100,0 % | 2/2 (100,0 %) | 2/2 (100,0 %) |
| `js/services/FachadaStorage.js` | 57 | 57 | 100,0 % | 18/18 (100,0 %) | 1/1 (100,0 %) |
| `js/services/FormateadorMoneda.js` | 9 | 9 | 100,0 % | 3/3 (100,0 %) | sin ramas |
| `js/services/ServicioCategorias.js` | 7 | 7 | 100,0 % | 4/4 (100,0 %) | sin ramas |
| `js/services/ServicioOfertas.js` | 35 | 35 | 100,0 % | 3/3 (100,0 %) | 6/6 (100,0 %) |
| `js/services/ServicioOpcionesPago.js` | 31 | 28 | 90,3 % | 4/4 (100,0 %) | 14/15 (93,3 %) |
| `js/services/ValidacionCarrito.js` | 4 | 4 | 100,0 % | 2/2 (100,0 %) | sin ramas |
| `js/utils/storage.js` | 283 | 283 | 100,0 % | 32/32 (100,0 %) | 199/199 (100,0 %) |
| **Total** | **1506** | **1501** | **99,7 %** | **201/201 (100,0 %)** | **589/591 (99,7 %)** |

El recuento de ramas depende de cómo V8 compila cada función, así que cambia entre corridas y entre versiones de Chromium: en las corridas de la corrección de QA dio entre 577/579 y 581/583, y la corrida de esta tabla (posterior a la corrección de RC51) dio 589/591. El porcentaje se mantiene en 99,7 %. Por eso los números de ramas se leen como aproximados; las líneas y funciones no varían.

`js/data/imagenesCatalogo.js` solo declara un mapa de constantes y no aparece en la tabla porque la herramienta mide `models`, `services`, `utils` y `script.js`.

La medición histórica anterior (94,2 %, sobre 208 specs) era **solo de líneas** y sobre menos archivos; no incluía los servicios nuevos ni medía funciones ni ramas, y por eso se reemplaza. Una cobertura alta no significa que la aplicación esté bien: los 15 métodos de `FachadaStorage` que la página no usa figuran como cubiertos por sus tests propios aunque ningún flujo real los llama.

### Qué falta cubrir y por qué

Antes de la corrección de QA la tabla marcaba 98,1 % de líneas, 99,5 % de funciones y 97,1 % de ramas (394 specs). Con los 20 specs de esa corrección (405 de la rama de release + 20 = 425) y el spec de la corrección de RC51 (426) quedan **sin cubrir 5 líneas y 2 ramas**, y las dos ramas no se pueden alcanzar sin modificar el código de producción. Cada una se justifica con algo comprobable:

- **`js/services/ServicioOpcionesPago.js:23` (líneas 24, 25 y 27)**: el `catch` de `obtenerMetodos()` solo se ejecuta si `new Pago(100, metodo, 1)` lanza. Los dos métodos candidatos (`efectivo-transferencia` y `tarjeta`) son constantes privadas del módulo y siempre son válidos, de modo que `Pago` nunca lanza ahí. Para forzarlo habría que reemplazar el constructor `Pago` importado, y un módulo ES no se puede sustituir con un doble de prueba. El `catch` equivalente de `obtenerCuotas()` sí está cubierto: sus dos caminos (error de validación → cuota descartada, otro error → se relanza) los prueban los specs de `ServicioOpcionesPago`.
- **`js/script.js`, líneas 1104 y 1105** (`document.readyState === "loading"`): `index.html` carga `script.js` como `<script type="module">` sin `async`, y los módulos se ejecutan una vez que el documento terminó de analizarse, así que `readyState` nunca es `"loading"` en ese momento. Un spec de «Rutas defensivas y de error» comprueba justamente que la etiqueta es de tipo módulo y no tiene `async`, que es la razón de que esa rama no se recorra. V8 puede informar la rama como cubierta o no según la corrida; las dos líneas siguen sin ejecutarse.

Lo que antes figuraba como no cubierto y ahora lo prueba un spec: los elementos obligatorios ausentes al cargar (línea 38) y `estado-aplicacion` ausente, `confirmarPedido()` sin pedido pendiente (RC24), el `catch` de `confirmarPedido()` por reloj inválido, la rama `default` de los dos `switch` de acciones, `if (!esperandoCierreCarrito) return;`, `if (!control) return;`, el filtro de precio alterado a mano (RC21), la cuota inexistente, el error inesperado al generar el resumen y los `catch` externos de `guardar()`, `cargarInstancia()` y `cargarLista()` de `storage.js`. La rama de `js/models/Pedido.js:31` (`typeof numero !== "string"` en `numeroValido()`), que antes figuraba como inalcanzable, se eliminó en la corrección de RC51: `Pedido.fromJSON()` ahora lee `datos.numero` una sola vez y valida su tipo antes de llamar a `numeroValido()`, así que esa guarda repetía una validación ya hecha. Además, antes se leía `datos.numero` tres veces (validar el tipo, validar el formato y guardarlo), y un spec comprueba ahora que se lee una sola vez y que se guarda el mismo valor que se validó.

Para cinco de esos caminos se comprobó además que el spec detecta el defecto (ver las pruebas de mutación en «Herramientas y proceso»).

### Cómo se mide cada número

- **Líneas**: líneas ejecutables (sin líneas en blanco, comentarios ni llaves de cierre) que ejecutó al menos un test.
- **Funciones**: funciones (incluidas las flecha y los métodos) que se llamaron al menos una vez.
- **Ramas**: bloques de código que V8 informa dentro de cada función (cuerpos de `if`/`else`, `catch`, `case`, operandos de `&&`, `||` y `??`, operadores ternarios). Un bloque cuenta como cubierto si en alguna ejecución de su función se ejecutó. V8 informa un bloque solo cuando su contador difiere del de la función que lo contiene, por eso la herramienta lo da por cubierto si en alguna llamada no apareció con contador 0.

Limitaciones de la medición de ramas: (1) V8 no informa los bloques internos de una función que nunca se llamó (esa función cuenta como función sin cubrir, pero no suma ramas); (2) cada operando de una cadena `||` o `&&` se cuenta como un bloque, lo que no coincide exactamente con la definición de rama de Istanbul; (3) los números no son comparables con los de otras herramientas. Sirve para ubicar qué ramas ningún test recorre, no como métrica certificada.

Una versión anterior de la herramienta contaba como no cubiertas ramas que sí se ejecutaban (daba 69,5 % de ramas); se corrigió el criterio descrito arriba y las cifras de este documento son las de la herramienta corregida.

### Cómo reproducir la medición

La tabla sale del script `js/test/herramientas/cobertura-v8.js`, que está en el repositorio. No es parte de la aplicación ni de los tests: solo mide.

```bash
# desde la raíz del repo, con Node 18 o superior
npm install --no-save playwright
npx playwright install chromium
node js/test/herramientas/cobertura-v8.js            # tabla
node js/test/herramientas/cobertura-v8.js --detalle  # además, lista las funciones y ramas sin cubrir
```

El script levanta un servidor HTTP temporal sobre el repo, abre `js/test/test-runner.html` en Chromium, toma la cobertura de V8 mientras corre la suite completa y, al terminar, imprime el resultado de Jasmine y la tabla en Markdown. Termina con código 1 si algún spec falla. Necesita internet (Jasmine y Bootstrap vienen de CDN). El resultado es el mismo en corridas sucesivas; si cambian los tests o el código, cambia la tabla.

---

## Herramientas y proceso

Esta sección declara qué se usó realmente, para que la documentación no diga más de lo que pasó.

- **Generación de los tests**: los specs de la cuarta entrega se escribieron con asistencia de **Claude** (modelo Claude Sonnet 5.5). Las PRs de esta etapa se revisaron con Copilot Agent (#140, #141 y #144) y con Claude (#150, #156 y #157).
- **Ejecución**: los tests se ejecutaron con **Playwright (Chromium) por script**, abriendo `js/test/test-runner.html` y leyendo el resultado de Jasmine. **No se usó Playwright MCP**: la consigna lo menciona y este punto queda como desvío declarado. Tampoco se registra ejecución en Edge, Firefox ni Safari para los specs de Jasmine.
- **Prompts**: los prompts con los que se generaron los specs del Tester QA **no se conservaron**, por lo que no hay evidencia de ellos en `docs/02-prompts/` para esas suites. Se declara como **no cumplido**.
- **Verificación de que los tests detectan errores (pruebas de mutación manuales)**: se introdujo un defecto a propósito en una copia del repositorio y se comprobó que la suite, que sin el defecto no falla ningún spec, falla con él. Se probaron doce sobre la suite de 421 specs (antes del análisis de mutación automático de abajo): subir el recargo de 3 cuotas de 10 % a 13 % (5 fallas), que `guardarCarrito()` no guarde (8), que la secuencia de pedidos no avance (3), quitar la regla «precio anterior mayor al actual» de `ServicioOfertas` (1), no ordenar las categorías (2), contar unidades en vez de ítems en el contador del carrito (14) y que `cargarCarrito()` ignore lo guardado (3); y, para los specs agregados en esta corrección: que `confirmarPedido()` no avise cuando no hay pedido pendiente (1), que una cuota inexistente marque el control equivocado (1), que `obtenerCuotas()` oculte un error que no es de validación (1), y que `guardar()` y `cargarInstancia()` dejen salir el error inesperado (1 y 1). Los doce fueron detectados. Son pruebas manuales hechas una vez, no una herramienta de mutación automática.
- **Barrida automática de mutantes (2026-11-24)**: además de las manuales, un script propio (no incluido en el repositorio; no es una herramienta de mutación estándar como Stryker) aplicó 40 mutaciones elegidas al azar sobre `js/models/` y `js/services/` (cambio de `<=`/`>=`/`===`/`&&`/`||`, de `+` por `-` y de constantes) y corrió la suite completa con cada una. La suite detectó 33 y 7 sobrevivieron. Cuatro se resolvieron con specs nuevos (fecha 0 como límite del número de pedido, total con un bit de diferencia y mensaje de validación de los ítems de `Carrito`, que fallaban sin que ningún spec lo notara; además el spec «acepta diferencias que son sólo ruido de coma flotante» sumaba `Number.EPSILON` a un total de miles, lo que no cambia el valor, y por eso no probaba nada). Los 3 restantes son equivalentes o inalcanzables: `Pedido.js:31` (guarda inalcanzable en ese momento; se eliminó en la corrección de RC51, ver «Qué falta cubrir»), `Pedido.js:45` (`>` frente a `>=` solo difiere cuando la diferencia es exactamente igual a la tolerancia) y `ServicioOpcionesPago.js:42` (el bucle hasta 13 cuotas no cambia nada porque `Pago` rechaza 13 cuotas y el `catch` la descarta). Con los 4 specs nuevos, 37 de 40 mutantes quedan detectados.

---

## Capturas de Pantalla

Capturas tomadas con Playwright (Chromium) sobre el runner, con la corrida final sin fallos:

![Corrida completa](./capturas/captura-runner-completo.png)
*Runner completo: 425 specs, 0 failures*

![Modelos](./capturas/captura-models-spec.png)
*`models.spec.js` (runner de modelos): 88 specs, 0 failures*

![Storage](./capturas/captura-storage-spec.png)
*Suite `StorageUtil` (`?spec=StorageUtil`): 189 specs, 0 failures*

![Controlador](./capturas/captura-script-spec.png)
*Suite `Controlador` (`?spec=Controlador`): 98 specs, 0 failures*

Los 50 specs de `services.spec.js` están incluidos en la corrida completa; no tienen un runner propio. No hay capturas de tests fallando porque la corrida final no tuvo fallos; la comprobación de que los specs detectan errores es la de mutación descrita en «Herramientas y proceso».

---

## Hallazgos e Issues

La revisión del docente (RC3) pidió que los hallazgos de QA tengan una issue por caso, con el rol responsable y el criterio afectado. Esta tabla los resume; el texto para abrir cada issue está en `02-issues-qa.md` de la entrega de correcciones.

| # | Caso | Rol responsable | Criterio afectado | Severidad | Estado |
|---|---|---|---|---|---|
| H1 | La validación de los datos del cliente se hacía solo al enviar el formulario, mientras que el spec del rol (`spec-dev-eventos-dom.md`) pide «validaciones en tiempo real» | Desarrollador JS Eventos + DOM | Validación de formularios y manejo de errores | Baja | **Resuelto**: el controlador valida cada campo del pedido en `input` (mientras se escribe) y en `focusout` (al salir del campo) con `actualizarValidacionCampoPedido()`, y vuelve a validar con `Pedido` al enviar. Lo prueban los specs «RC59 - valida los campos vacíos mediante focusout», los de `aria-invalid` / `is-invalid` y «los campos con error quedan asociados a su mensaje (`aria-describedby` / `aria-invalid`)» |
| H2 | Los pedidos y la secuencia no se guardaban: `ConfirmadorPedidos` numeraba en memoria y la numeración volvía a `0001` al recargar | Desarrollador JS Local y Session Storage y Desarrollador JS Eventos + DOM | Integración de Web Storage en la aplicación | Media | **Resuelto en la PR #188** (issue #176 cerrada): `ConfirmadorPedidos` persiste el historial y la secuencia con `FachadaStorage` (`guardarPedidos()` / `guardarSecuenciaPedidos()`) y restaura la secuencia si falla el guardado. Lo prueban «RC62 - conserva la numeracion y el historial despues de recargar», «RC62 - cancelar un pedido no modifica el historial ni la secuencia» y «RC62 - restaura la secuencia cuando falla el guardado del historial» (`script.spec.js`), y «un rechazo no consume número de secuencia» (`services.spec.js`) |
| H3 | 11 de los 17 métodos de `FachadaStorage` no los llama ningún flujo de la aplicación: solo se usan los del carrito (`cargarCarrito`, `guardarCarrito`) y los del historial y la secuencia de pedidos (`cargarPedidos`, `guardarPedidos`, `cargarSecuenciaPedidos`, `guardarSecuenciaPedidos`) | Desarrollador JS Local y Session Storage | Integración de Web Storage / documentación coherente con el código | Baja | **Abierto**; la documentación ya lo declara |
| H4 | El catálogo (`productosIniciales`) y los datos de ofertas estaban declarados en JavaScript dentro del controlador y de `ServicioOfertas` | Desarrollador JS Eventos + DOM | Separación de responsabilidades | Baja | **Resuelto en lo que pedía el hallazgo para el catálogo**: `productosIniciales` ya está en `js/data/productosIniciales.js` y el controlador lo importa. La configuración de ofertas (`OFERTAS`: código, precio anterior e imagen) sigue como constante de `ServicioOfertas.js`; el precio actual y los datos del producto se obtienen de `Catalogo`, y no se considera pendiente |
| H5 | Al cancelar el pedido el mensaje «Pedido cancelado…» se escribía en `#pedido-mensaje`, dentro de la sección de confirmación que se oculta en ese momento, y el usuario no lo veía | Desarrollador JS Eventos + DOM (código) y Tester/QA (spec) | Retroalimentación al usuario / estados de la interfaz | Baja | **Resuelto**: `cancelarPedido()` muestra el mensaje en `#pago-mensaje`, una región `role="status"` de la sección de pago, que queda visible. La suite lo verifica con «RC61 - cancelar el pedido conserva el carrito y las condiciones de pago» y con el spec de cancelación con errores: el mensaje no está dentro de ningún elemento `hidden`, su `display` no es `none`, su `visibility` es `visible` y su alto es mayor que cero (ya no solo se lee el `textContent`) |
| H6 | Cobertura informada solo por líneas, sin ramas ni casos borde | Tester/QA | Cobertura y casos borde de las pruebas | Media | **Resuelto** en esta corrección (se miden líneas, funciones y ramas: 99,7 % / 100 % / 99,7 %; las 2 ramas restantes se justifican en «Qué falta cubrir y por qué») |
| H7 | La suite que dejó la PR #169 terminaba con 3 specs en rojo (220 specs, 3 failures): tres specs del controlador no coincidían con el comportamiento actual | Tester/QA | Aislamiento y mantenimiento de los tests | Media | **Resuelto** en esta corrección (394 specs, 0 failures; ver abajo) |
| H8 | Sin evidencia de prompts ni de Playwright MCP para las suites del Tester QA | Tester/QA | Uso de herramientas de IA y trazabilidad | Media | **No resuelto**: declarado como desvío |

### H7: tres specs del controlador en rojo tras la PR #169

Se corrió la suite sobre el commit de la PR #169 (`c4fd0dc`) antes de tocar nada: 220 specs, 3 failures. Ninguna falla señala un defecto del código; los tres specs se escribieron contra un comportamiento que cambió, y se adaptaron **sin modificar el código del controlador**:

| Spec | Por qué fallaba | Cambio |
|---|---|---|
| Requisitos transversales › los flujos de búsqueda, carrito, pago y cancelaciones tampoco los usan | Tras buscar «zzz» y filtrar por categoría, el catálogo se vuelve a dibujar y las tarjetas que no coinciden ya no existen (`TypeError … reading 'dispatchEvent'`) | Se borra la búsqueda y se vuelve a «todas las categorías» antes del paso que necesita las tarjetas |
| Requisitos transversales › los campos con error quedan asociados a su mensaje (`aria-describedby` / `aria-invalid`) | Escribía un correo inválido y esperaba `aria-invalid="true"`, pero la validación ocurre al enviar (decisión de la PR #169, H1) | Completa los demás datos, escribe el correo inválido y envía el formulario; verifica el mismo `aria-invalid` y el mismo mensaje |
| Requisitos transversales › no modifica `localStorage` ni `sessionStorage` durante una compra completa | La aplicación ahora guarda el carrito en `localStorage`, por lo que la afirmación «no modifica nada» ya no es cierta | Pasa a «una compra completa solo escribe claves de la app en `localStorage` y no toca `sessionStorage`» |

Además, el aislamiento del storage entre tests (guardar, borrar y restaurar las claves `app:`) es el que agregó el Desarrollador Eventos + DOM en la PR #169; se conservó tal cual.

### Otros hallazgos de esta etapa

- **Integración de persistencia del carrito.** La PR #169 dejó anotado que faltaban pruebas de recuperación del carrito tras recargar y de errores de almacenamiento. Quedan cubiertas en `script.spec.js` («Persistencia del carrito en Web Storage» y «Casos borde») y en `services.spec.js` (`FachadaStorage`).
- **Cadenas numéricas (`"0x10"`, `"1e2"`).** Detectado en la revisión de la PR #150 y corregido en la misma PR. El caso queda cubierto en `models.spec.js` y, desde la interfaz, en `script.spec.js` (cantidad `1e2`).
- **Correo con caracteres no ASCII (`ñandú@correo.com`).** Detectado en la revisión de la PR #156 y corregido por el Desarrollador de Eventos + DOM. Queda cubierto en `script.spec.js` y en `models.spec.js`.
- **Error de medición de ramas.** Una primera versión de la herramienta de cobertura subestimaba las ramas (69,5 %); se corrigió (ver «Cómo se mide cada número»).

---

## Limitaciones del Testing

- `script.spec.js` prueba la página real en un iframe, por lo que es más lento que los otros specs (cada test carga `index.html`; la suite completa tarda unos 25 segundos) y depende de los CDN de Bootstrap.
- El cierre del carrito (`offcanvas`) de Bootstrap se simula con el evento `hidden.bs.offcanvas`; no se prueba la animación real.
- Los desplazamientos (`scrollIntoView`) no se verifican.
- La cobertura de ramas es aproximada (ver «Cómo se mide cada número»). El script que la mide está en `js/test/herramientas/` y requiere instalar Playwright aparte (no se agrega como dependencia del proyecto).
- No se probó la carga de la página con el storage deshabilitado por el navegador (la capa `StorageUtil` y `FachadaStorage` sí lo cubren); en la página solo se prueba el rechazo de escrituras.
- Los tests no se corrieron en Firefox, Safari ni Edge; solo en Chromium.
- No se usó Playwright MCP ni se conservaron los prompts de las suites del Tester QA (ver «Herramientas y proceso»).
- El mapa de Google de `index.html` no se carga ni se prueba.
- No hay tests de persistencia de pedidos ni de secuencia en la página porque la aplicación todavía no los persiste (H2).

---

## Historial: tercera entrega

La suite de la tercera entrega (143 tests sobre funciones con `prompt()` y `alert()`) quedó obsoleta al reemplazarse esa lógica por clases, storage y eventos. Sus capturas (`capturas/captura-flujo-*.png`) se conservan solo como referencia histórica. El bug documentado en esa etapa fue:

### Issue #127: Omitir el precio máximo devolvía error y la condición `valor === null` era inalcanzable
- **Severidad:** Baja
- **Suite Afectada:** `describe("buscarProductos")` y `describe("validarPrecioMaximo")`, en "Flujo 1 - Búsqueda y filtrado (lógica pura)"
- **Tests Afectados:** `validarPrecioMaximo › permite omitir el precio máximo (vacío, espacios, null o undefined)`, `buscarProductos › sin precio máximo no filtra por precio` y `buscarProductos › con criterios null o undefined no falla y devuelve todo el catálogo`
- **Comportamiento Esperado:** Que un precio máximo vacío, `null` o `undefined` signifique "no filtrar por precio" (regla acordada con el Desarrollador JavaScript y reflejada en los diagramas de actividades) y que todas las condiciones del filtro puedan evaluarse en algún caso.
- **Comportamiento Obtenido (versión anterior, commit `95d2d5f`):** `validarPrecioMaximo()` trataba el valor vacío como inválido (`valido: false`), por lo que `buscarProductos()` devolvía el error "El precio maximo debe ser un numero mayor o igual a cero." y una lista vacía. Además, la condición `precioValidado.valor === null` de `buscarProductos()` nunca era verdadera, porque si el precio era válido `valor` siempre era un número.
- **Pasos para Reproducir (contra `js/script.js` del commit `95d2d5f`):**
  1. Abrir `js/test/test-runner.html` apuntando a esa versión de `js/script.js`, o cargarla en Node.
  2. Ejecutar `buscarProductos(catalogoPrueba, { texto: "", categoria: "", precioMaximo: "" })`.
  3. Resultado obtenido: `{ valido: false, error: "El precio maximo debe ser un numero mayor o igual a cero.", resultados: [] }`. Resultado esperado: `valido: true` y los 3 productos de `catalogoPrueba`, ordenados por precio.
- **Código del Test que Falla** (contra la versión anterior):
  ```javascript
  it("sin precio máximo no filtra por precio", function () {
      var r = buscarProductos(catalogoPrueba, { texto: "", categoria: "", precioMaximo: "" });
      expect(r.valido).toBeTruthy();
      expect(r.resultados.map(function (p) { return p.codigo; })).toEqual(["C-003", "A-001", "B-002"]);
  });
  ```
  Resultado contra la versión anterior: `Expected false to be truthy.` y `Expected $.length = 0 to equal 3.` Los otros dos tests afectados también fallan contra esa versión; se comprobó ejecutando la suite contra el `script.js` del commit `95d2d5f`.
- **GitHub Issue:** [#127](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/issues/127)
- **Estado:** Resuelto. El Desarrollador JavaScript modificó `validarPrecioMaximo()` para permitir omitir el precio máximo (devuelve `valido: true` y `valor: null`), de modo que la condición ahora es alcanzable. Con `script.js` actual los tres tests pasan.

---

**Última Actualización:** 2026-11-25 (corrección de RC51: `Pedido.fromJSON()` y cobertura de modelos; antes, 2026-11-23, correcciones de la revisión de la cuarta entrega sobre la rama de release con las PR #167, #168 y #169)
**Tester/QA Engineer:** Alan Diaz (@alandox1)
