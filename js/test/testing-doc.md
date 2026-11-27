# Documentación de Testing - Suite Jasmine

Proyecto FerroLab - Actividad Obligatoria N°4 y Segundo Parcial - Programación Web I
Módulos testeados: `js/api/*.js`, `js/models/*.js`, `js/services/*.js`, `js/utils/storage.js` y `js/script.js` | Framework: Jasmine 5.10.0 (CDN)

## Segundo Parcial — SweetAlert2 y regresión (27/11/2026)

Se evaluó `feature/tester-qa-js-testing-suite`, HEAD
`c008e2fa8cf92f6312efc75479fcf19aeefa9315`, igual a `origin/develop` después
de las PR #220 y #221; SweetAlert2 se integró en #216. Se añadieron nueve
pruebas en `library.spec.js` para `ServicioDialogos`: configuración y textos
planos; valores predeterminados; confirmación estricta, cancelación y espera
asíncrona; foco y destino modal; origen desconectado; movimiento reducido;
errores de la librería y fallback. Una prueba usa SweetAlert2 real para
comprobar `role`, `aria-modal`, Tab, Shift+Tab, Escape y retorno del foco.
Los eventos de teclado son sintéticos: no sustituyen la comprobación manual
con teclado físico y tecnologías de asistencia.

Se conservaron las 27 pruebas de SweetAlert2 en `script.spec.js`: verifican
los flujos de controlador, el CDN y la integración real con Bootstrap. No se
trasladaron ni eliminaron; las pruebas nuevas cubren el contrato directo del
wrapper. El runner incorpora `library.spec.js` como módulo ES.

### Ejecuciones y fallo de foco

- Antes de agregar la suite, Playwright MCP y Chromium 158.0.0.0 ejecutaron
  492/492 pruebas, 0 fallidas, semilla `61496`, por HTTP en puerto `18765`.
- Con la nueva suite, la ejecución filtrada por `ServicioDialogos - ` obtuvo
  **9/9 aprobadas, 0 fallidas y 0 pendientes**, semilla `61496`.
- La suite completa en Playwright MCP y Chromium 158.0.0.0 obtuvo **501
  ejecutadas, 501 aprobadas, 0 fallidas y 0 pendientes**, semilla `61496`:
  modelos 89, storage 189, servicios 50, API 22, biblioteca 9 y controlador
  142, incluidas las 27 de SweetAlert2. Se usó `http-server` 14.1.1 en
  `127.0.0.1:18765`, con caché deshabilitada.
- La ejecución manual informada previamente sigue registrada más abajo:
  489 aprobadas, 1 fallida, semilla `61496`, puerto 8000. El fallo no se
  reprodujo en las dos corridas completas anteriores. La semilla no reproduce
  por sí sola el entorno ni el conjunto de pruebas: aquí hay otro commit,
  puerto y navegador controlado por Playwright.
- La línea `script.spec.js:2567` de la ejecución original esperaba que
  desapareciera el contenedor y volviera el foco, mediante un sondeo con
  límite de tres segundos. Foco, animaciones, programación de tareas y
  carga del CDN son condiciones posibles a investigar, no causas probadas.
  No se puede clasificar aún como fallo funcional, de sincronización o del
  entorno; faltan datos de la ejecución manual y una reproducción.
- Durante la validación se detectó una respuesta cacheada del runner que
  todavía mostraba 492 pruebas después del cambio. Se descartó esa corrida y
  se repitió con caché deshabilitada y contexto aislado; los 501 corresponden
  al runner actualizado.

### Cobertura V8 independiente

`node js/test/herramientas/cobertura-v8.js --detalle`, Playwright local y
Chromium 159.0.8154.6: **501 specs, 0 failures**, semilla `60944`.
Es una ejecución distinta de Playwright MCP.

| Medición | Líneas | Funciones | Ramas V8 aproximadas |
|---|---:|---:|---:|
| Anterior, semilla `88737` | 1935/1969 (98,3 %) | 257/258 (99,6 %) | 723/736 (98,2 %) |
| Actual, total | 1949/1983 (98,3 %) | 258/259 (99,6 %) | 733/746 (98,3 %) |
| Actual, `ServicioDialogos.js` | 63/63 (100 %) | 7/7 (100 %) | 21/22 (95,5 %) |
| Actual, `apiService.js` | 124/129 (96,1 %) | 11/11 (100 %) | 57/59 (96,6 %) |
| Actual, `ProcesadorCatalogo.js` | 59/60 (98,3 %) | 18/18 (100 %) | 24/25 (96,0 %) |

Las bases de código y pruebas difieren por la integración de #221 y las
nuevas pruebas; la variación de ramas es aproximada y no demuestra una mejora
causal. No se detectaron problemas funcionales nuevos en estas ejecuciones.

Evidencias: [semilla antes de library](./capturas/captura-seed-61496-antes-library-2026-11-27.png),
[suite library filtrada](./capturas/captura-library-2026-11-27.png),
[suite completa](./capturas/captura-jasmine-library-2026-11-27.png) y
[salida de cobertura V8](./capturas/captura-cobertura-library-2026-11-27.png).
La captura de cobertura muestra la salida textual de la ejecución independiente.
No se ejecutó Lighthouse TC-13.

### Validación manual de SweetAlert2 (27/11/2026)

Según lo informado por el usuario, realizó personalmente la validación con
resultados favorables:

- Visualización correcta del diálogo y foco inicial en **Cancelar**.
- Navegación correcta con Tab y Shift + Tab; Escape cancela el diálogo.
- Al cancelar, el carrito permanece abierto y el foco vuelve al botón de
  eliminación.
- Al confirmar, se elimina el producto y se actualizan la cantidad de productos
  y el total.

Las capturas muestran el [diálogo de confirmación](./capturas/captura-sweetalert2-confirmacion-manual-2026-11-27.png)
y el [carrito después de la eliminación](./capturas/captura-sweetalert2-eliminacion-manual-2026-11-27.png).
La navegación con teclado fue comprobada manualmente por el usuario, no por
las capturas. El fallo anterior relacionado con el foco no se reprodujo en
esta validación manual; su causa original continúa sin determinarse. Esta
comprobación no es una nueva ejecución de Jasmine.

## Segundo Parcial — Fetch/API y regresión (etapa anterior)

### Reejecución del 27/11/2026 y resultado manual informado

Se volvió a ejecutar el runner completo en Chromium 158 mediante **Playwright MCP**, servido por HTTP desde la raíz del proyecto (`http://127.0.0.1:18765/js/test/test-runner.html`), sobre `HEAD` `5d6ba92` y los cambios de QA sin commitear. **490 pruebas ejecutadas: 490 aprobadas, 0 fallidas, 0 pendientes**, con la semilla `28453`. Las 22 pruebas de `api.spec.js` y las 27 de la suite de diálogos SweetAlert2 aprobaron. Dentro de estas últimas aprobaron los dos casos con la librería real y la comprobación de hashes SRI del CDN.

El usuario informó una ejecución manual distinta: **489 aprobadas y 1 fallida**, semilla `61496`, con servidor HTTP en el puerto `8000`. La prueba «desde el carrito abierto: foco en Cancelar, Esc cierra solo el diálogo y el foco vuelve al botón» falló con `La condición no se cumplió a tiempo.`, en `script.spec.js:2111:41` y `script.spec.js:2567:13`. Este resultado no se descarta ni se presenta como aprobado. El fallo no se reprodujo posteriormente con Playwright MCP, por lo que su causa **no está determinada**. Las pruebas existentes incluyen dependencias de CDN, foco, animaciones y tiempos de espera; son condiciones a comparar, no causas comprobadas. Para investigar siguen pendientes la versión del navegador y, de ser posible, una captura del panel de fallos de Jasmine y la consola. La semilla informada permite repetir la secuencia mediante `http://localhost:8000/js/test/test-runner.html?seed=61496`.

Se ejecutó además una medición **independiente** con `node js/test/herramientas/cobertura-v8.js --detalle` (Chromium mediante Playwright local, no MCP): **490 specs, 0 failures**, semilla `88737`. La captura reproduce íntegramente la salida textual obtenida en esa medición:

| Archivo | Líneas | Funciones | Ramas V8 aproximadas |
|---|---:|---:|---:|
| `js/api/apiService.js` | 124/129 (96,1 %) | 11/11 (100 %) | 57/59 (96,6 %) |
| `js/services/ProcesadorCatalogo.js` | 59/60 (98,3 %) | 18/18 (100 %) | 24/25 (96,0 %) |
| **Total medido** | **1935/1969 (98,3 %)** | **257/258 (99,6 %)** | **723/736 (98,2 %)** |

Evidencias obtenidas con Playwright MCP:

- [Resultado general de Jasmine](./capturas/captura-jasmine-segundo-parcial-2026-11-27.png).
- [Las 22 pruebas de API](./capturas/captura-api-22-pruebas-2026-11-27.png).
- [Las 27 pruebas de SweetAlert2](./capturas/captura-sweetalert2-2026-11-27.png).
- [Salida de cobertura V8 y ramas sin cubrir](./capturas/captura-cobertura-v8-2026-11-27.png).

Las capturas de API y SweetAlert2 muestran una vista del reporte de la **misma corrida completa**, con las demás suites ocultadas después de la ejecución; no son ejecuciones filtradas ni cambian los resultados de Jasmine. La captura de cobertura muestra la salida de la medición independiente, servida como texto local para fotografiarla; los totales de ramas pueden variar entre corridas por la forma en que V8 informa los bloques.

### Corrida anterior del 26/11/2026

**Fecha:** 26/11/2026. **Rama:** `feature/tester-qa-js-testing-suite`.
**Código de Alan evaluado:** merge de la PR #217, commit `ca9458f29d283e010c3fd2cafb5d931e3e70b1bb`; la suite se ejecutó sobre `HEAD` `5d6ba92` más los cambios de QA de esta tarea.

La suite se ejecutó desde `js/test/test-runner.html` por HTTP. La verificación final fue `node js/test/herramientas/cobertura-v8.js --detalle`, que levanta un servidor local temporal, abre el runner en Chromium y mide cobertura V8.

**Resultado final: 490 specs, 0 failures, 0 pendientes** (Jasmine 5.10.0; semilla aleatoria `47158`).

| Suite | Specs aprobados | Fallidos |
|---|---:|---:|
| `models.spec.js` | 89 | 0 |
| `storage.spec.js` | 189 | 0 |
| `services.spec.js` | 50 | 0 |
| `api.spec.js` | 22 | 0 |
| `script.spec.js` | 140 | 0 |
| **Total** | **490** | **0** |

`api.spec.js` cubre respuestas válidas y argumentos de `fetch`, errores HTTP y de red diferenciados, reintentos y espera creciente, callback de reintento fallido, timeout, JSON y estructura inválidos, fetch no disponible, fallback por caché/local, caché no persistible, colecciones inválidas/vacías, duplicados, normalización, construcción, resumen `reduce`, agrupación y estados DOM de carga, éxito, error y recuperación por reintento. Los dobles sustituyen `fetch`; ninguna prueba consulta un servicio de API externo. El DOM se crea en iframes `srcdoc` y se restaura la clave de caché al terminar.

**Cobertura V8 de los módulos del catálogo:**

| Archivo | Líneas | Funciones | Ramas |
|---|---:|---:|---:|
| `js/api/apiService.js` | 124/129 (96,1 %) | 11/11 (100 %) | 56/58 (96,6 %) |
| `js/services/ProcesadorCatalogo.js` | 59/60 (98,3 %) | 18/18 (100 %) | 24/25 (96,0 %) |
| **Total medido por la herramienta** | **1935/1969 (98,3 %)** | **257/258 (99,6 %)** | **725/738 (98,2 %)** |

La cobertura de ramas es la aproximación de bloques de V8 descrita en «Cómo se mide cada número»; puede variar según la compilación/semilla y no equivale a Istanbul/c8. El detalle también marca la salida del ciclo de reintentos de `obtenerJson`, el `catch` defensivo de lectura de caché (`apiService.js`) y la última defensa de construcción de `Producto` (`ProcesadorCatalogo.js`). El primer camino no es alcanzable por el bucle sin condición; los otros dos corresponden a defensas detrás de validaciones/abstracciones que ya capturan los errores según sus contratos. No se modificó código funcional para alcanzar porcentajes.

**Hallazgos y regresiones:** la primera corrida de desarrollo detectó cuatro fallos del propio test harness al intentar espiar métodos de `FachadaStorage`, que es inmutable (`Object.freeze`). Se ajustaron esas pruebas para usar la fachada real y aislar/restaurar la clave de caché. En esa corrida final no hubo fallos Jasmine ni regresiones detectadas; no hubo borradores de Issues nuevos. #212, #213 y #214 siguen siendo hallazgos preexistentes del TC-11 y no se modificaron. La evidencia de esa corrida quedó en la sesión; las capturas posteriores se indican arriba.

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

## Historial de la corrida de la cuarta entrega

Corrida completa de `test-runner.html` sobre la rama `release/cuarta-entrega` con las PR #167, #168, #169 (Desarrollador JS Eventos + DOM), #172 (Local y Session Storage) y #175 (POO) ya integradas, más los specs agregados en esta corrección de QA: **425 specs, 0 failures** (tres corridas con semillas distintas). Sin los specs de esta corrección, la rama de release tenía 405 specs, 0 failures. Después se agregó el spec de la corrección de RC51 (`Pedido.fromJSON()` lee el número una sola vez), y la suite quedó en **426 specs, 0 failures**. Con las PR #186 y #188 (Eventos + DOM) integradas pasó a 441 specs, y con los 10 specs agregados en esta corrección (RC81 a RC84: 3 de fallos de persistencia de `ConfirmadorPedidos`, 4 de `ValidacionPedido` y 3 del controlador) quedó en **451 specs, 0 failures** (tres corridas con semillas distintas).

Antes de esta corrección, la suite de la PR #169 tenía **220 specs y 3 failures**. Los tres eran specs desactualizados respecto del controlador (no defectos del código); se adaptaron y el detalle está en [Hallazgos e Issues](#hallazgos-e-issues). El código de producción (`js/script.js`, `index.html`, `js/models/`, `js/services/`, `js/utils/`) no fue modificado por esta corrección de QA, y tampoco la documentación de trazabilidad de los cuatro flujos que agregó la PR #169, que se conserva tal cual.

## Estructura de la suite

La siguiente estructura de cuatro archivos y 451 pruebas corresponde al
historial de la cuarta entrega; no describe el runner actual del Segundo
Parcial, cuyos resultados se documentan al inicio de este archivo.

En la tercera entrega `js/script.js` tenía la lógica y usaba `prompt()`/`alert()`. En la cuarta entrega se separó en capas y hay un archivo spec por cada una:

| Módulo | Qué contiene | Spec | Specs |
|---|---|---|---|
| `js/models/` (`Producto`, `Catalogo`, `Carrito`, `Pago`, `Pedido`) | Lógica de negocio con clases, sin DOM ni Storage | `js/test/models.spec.js` | 89 |
| `js/utils/storage.js` (`StorageUtil`) | Capa de abstracción de `localStorage`/`sessionStorage` | `js/test/storage.spec.js` | 189 |
| `js/services/` | `FormateadorMoneda`, `ValidacionCarrito`, `ConfirmadorPedidos`, `FachadaStorage`, `ServicioOfertas`, `ServicioCategorias`, `ServicioOpcionesPago`, `ValidacionPedido` | `js/test/services.spec.js` | 57 |
| `js/script.js` | Controlador: eventos y DOM | `js/test/script.spec.js` | 116 |
| | | **Total** | **451** |

En esa etapa, `js/test/test-runner.html` cargaba los cuatro specs como módulos ES. `js/test/models-test-runner.html` es el runner independiente que armó el Desarrollador JS POO para sus modelos y se conserva.

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

### `services.spec.js` (57 specs)

| Suite | Specs | Qué se prueba |
|---|---|---|
| `FormateadorMoneda` | 3 | Pesos argentinos con dos decimales, redondeo, importes negativos |
| `ValidacionCarrito.validarCambioCantidad` | 3 | Acepta sin modificar el carrito, rechaza cantidades inválidas y códigos inexistentes |
| `ConfirmadorPedidos.confirmarPedidoConNumeracion` | 5 | Confirma y devuelve el número, números consecutivos, rechaza lo que no es `Pedido`, no confirma dos veces, un rechazo no consume número |
| `ConfirmadorPedidos: fallos de persistencia` | 3 | Con un storage en memoria que rechaza escrituras: falla la secuencia (no se guarda el historial), falla el historial (se restaura la secuencia) y falla el historial sin poder restaurarla |
| `ValidacionPedido.validarCampoPedido` | 4 | Valor válido en cada campo, mensaje del modelo para un valor inválido, campo desconocido (`RangeError`) y error inesperado que no se oculta como error de validación |
| `FachadaStorage` | 23 | Congelada; carrito (round trip, vacío, datos corruptos o con estructura inválida, storage lleno, valor no serializable); historial y secuencia (round trip, corrupto, no es lista, storage lleno); preferencias y caché del catálogo; datos de sesión (borrador, filtros, bienvenida, en `sessionStorage` y no en `localStorage`); storage bloqueado (`SecurityError`) |
| `ServicioOfertas.obtenerOfertas` | 6 | Las tres ofertas con datos del catálogo, precio actual tomado del catálogo, precio anterior mayor, catálogo inválido (`TypeError`), producto ausente y precio anterior no mayor (`RangeError`) |
| `ServicioCategorias.obtenerCategorias` | 3 | Únicas y ordenadas, orden del español (`Á`, `Ñ`), catálogo vacío |
| `ServicioOpcionesPago` | 7 | Métodos aceptados por `Pago`, cuotas por método (1 para efectivo/transferencia; 1, 3 y 6 para tarjeta con su recargo), sin método → `[]`, método inexistente → `[]` y un error que no es de validación (ni `TypeError` ni `RangeError`) que se relanza en lugar de ocultarse |

### `script.spec.js` (116 specs)

| Suite | Specs | Qué se prueba |
|---|---|---|
| Carga inicial | 4 | 9 productos visibles, carrito vacío, botón deshabilitado, pago y confirmación ocultos |
| RC44: renderizado dinámico | 4 | Generación dinámica del catálogo, ofertas, tabla de precios, categorías y opciones de pago |
| Flujo 1: búsqueda y filtrado | 12 | Texto, tildes y mayúsculas, ausencia de coincidencias, envío del formulario, categoría, orden asc/desc, rango de precio, menú de categorías y recuperación de resultados |
| Flujo 2: carrito | 12 | Agregar productos, actualizar cantidades, validar con input, confirmar cambios con change, rechazar cantidades inválidas, eliminar productos e invalidar el pago |
| Flujo 3: pago y cuotas | 13 | Efectivo/transferencia, tarjeta en 1, 3 y 6 cuotas, cálculo de recargos, validación del método, cambios de cuotas, invalidación de confirmación y cancelación |
| Flujo 4: confirmación del pedido | 21 | Validación por campo mientras se escribe (`input`) y al salir (`focusout`), validación al enviar el formulario, corrección de errores, generación del resumen, invalidación y regeneración, confirmación, numeración y cancelación con el mensaje visible en `#pago-mensaje` (RC59 y RC61) |
| RC60: separación de datos del catálogo | 3 | El catálogo se arma desde `js/data/productosIniciales.js` y el controlador no lo declara |
| RC62: persistencia de pedidos | 4 | La numeración y el historial se conservan al recargar, cancelar no modifica el historial ni la secuencia, y la secuencia se restaura si falla el guardado del historial |
| Requisitos transversales | 7 | Uso del DOM y eventos, accesibilidad, mensajes de estado y controles sobre interacciones del navegador |
| Persistencia del carrito en Web Storage | 8 | Guarda el carrito al agregar, lo restaura al recargar la página, conserva cambios de cantidad y eliminaciones, carrito vacío tras vaciar y tras confirmar, ignora datos corruptos o con estructura inválida, nada en `sessionStorage` |
| Casos borde | 11 | Carrito vacío (4: iniciar compra, pago, pedido sin pago, vaciar a mitad del pago), acciones repetidas (5: doble envío del pago, doble resumen, doble confirmación, doble cancelación, doble inicio de compra), storage que rechaza escrituras (2: se avisa al usuario y la compra se completa igual) |
| Eventos que no corresponden a una acción | 2 | Clics fuera de un botón de acción e `input`/`change` en el panel del carrito que no vienen de una cantidad: no cambian nada |
| Rutas defensivas y de error | 15 | Confirmar sin pedido pendiente (RC24), acciones desconocidas en el carrito y en la confirmación, cierre del carrito sin compra iniciada, `input` ajeno al formulario del pedido, reloj del sistema inválido y reintento, filtro de precio alterado a mano, cuota inexistente agregada a mano, error inesperado al generar el resumen (no se oculta), página sin un elemento obligatorio (`#form-pago`) que avisa y no registra eventos, página sin `#estado-aplicacion` que sigue funcionando, comprobación de que `index.html` carga `script.js` como módulo diferido, `focusout` que no viene de un campo del formulario, carrito vacío que no se puede guardar tras confirmar el pedido (se informa como error) y error inesperado al confirmar (no se oculta) |


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

Corrida completa de `test-runner.html`: **451 specs, 0 failures** (ver «Estado de la corrida»).

Se miden tres cosas, con la cobertura de código de V8 (Chromium, vía Playwright) durante esa misma corrida. **No son el mismo número**, y la cobertura de ramas es una estimación, no una medición equivalente a la de Istanbul o c8 (ver más abajo).

| Archivo | Líneas ejecutables | Cubiertas | Líneas | Funciones | Ramas |
|---|---|---|---|---|---|
| `js/models/Carrito.js` | 92 | 92 | 100,0 % | 21/21 (100,0 %) | 66/66 (100,0 %) |
| `js/models/Catalogo.js` | 46 | 46 | 100,0 % | 16/16 (100,0 %) | 36/36 (100,0 %) |
| `js/models/Pago.js` | 49 | 49 | 100,0 % | 7/7 (100,0 %) | 39/39 (100,0 %) |
| `js/models/Pedido.js` | 110 | 110 | 100,0 % | 16/16 (100,0 %) | 102/102 (100,0 %) |
| `js/models/Producto.js` | 44 | 44 | 100,0 % | 13/13 (100,0 %) | 21/21 (100,0 %) |
| `js/script.js` | 741 | 739 | 99,7 % | 62/62 (100,0 %) | 119/119 (100,0 %) |
| `js/services/ConfirmadorPedidos.js` | 23 | 23 | 100,0 % | 2/2 (100,0 %) | 12/12 (100,0 %) |
| `js/services/FachadaStorage.js` | 57 | 57 | 100,0 % | 18/18 (100,0 %) | 1/1 (100,0 %) |
| `js/services/FormateadorMoneda.js` | 9 | 9 | 100,0 % | 3/3 (100,0 %) | sin ramas |
| `js/services/ServicioCategorias.js` | 7 | 7 | 100,0 % | 4/4 (100,0 %) | sin ramas |
| `js/services/ServicioOfertas.js` | 35 | 35 | 100,0 % | 3/3 (100,0 %) | 6/6 (100,0 %) |
| `js/services/ServicioOpcionesPago.js` | 31 | 28 | 90,3 % | 4/4 (100,0 %) | 15/16 (93,8 %) |
| `js/services/ValidacionCarrito.js` | 4 | 4 | 100,0 % | 2/2 (100,0 %) | sin ramas |
| `js/services/ValidacionPedido.js` | 37 | 37 | 100,0 % | 2/2 (100,0 %) | 6/6 (100,0 %) |
| `js/utils/storage.js` | 283 | 283 | 100,0 % | 32/32 (100,0 %) | 187/187 (100,0 %) |
| **Total** | **1568** | **1563** | **99,7 %** | **205/205 (100,0 %)** | **610/611 (99,8 %)** |

El recuento de ramas depende de cómo V8 compila cada función, así que cambia entre corridas y entre versiones de Chromium: en las corridas de la corrección de QA dio entre 577/579 y 581/583, y la corrida de esta tabla (451 specs, con las PR #186 y #188 y los specs de RC81 a RC84) dio 610/611; en otras corridas con la misma suite dio entre 606/608 y 611/612. El porcentaje se mantiene en 99,7 % - 99,8 %. Por eso los números de ramas se leen como aproximados; las líneas y funciones no varían.

`js/data/imagenesCatalogo.js` solo declara un mapa de constantes y no aparece en la tabla porque la herramienta mide `models`, `services`, `utils` y `script.js`.

La medición histórica anterior (94,2 %, sobre 208 specs) era **solo de líneas** y sobre menos archivos; no incluía los servicios nuevos ni medía funciones ni ramas, y por eso se reemplaza. Una cobertura alta no significa que la aplicación esté bien: los 11 métodos de `FachadaStorage` que la página no usa figuran como cubiertos por sus tests propios aunque ningún flujo real los llama.

### Qué falta cubrir y por qué

Antes de la corrección de QA la tabla marcaba 98,1 % de líneas, 99,5 % de funciones y 97,1 % de ramas (394 specs). Con los 20 specs de esa corrección (405 de la rama de release + 20 = 425) y el spec de la corrección de RC51 (426) quedaban **5 líneas y 2 ramas sin cubrir**. Al integrarse las PR #186 y #188 (441 specs) apareció código nuevo (`ValidacionPedido.js`, la persistencia de pedidos en `ConfirmadorPedidos.js` y rutas de error del controlador) y la medición bajó a 99,4 % de líneas y 99,2 % de ramas (595/600). Con los 10 specs de RC81 a RC84 (451 specs) vuelven a quedar **sin cubrir 5 líneas y 1 o 2 ramas** (según la corrida), y no se pueden alcanzar sin modificar el código de producción. Cada una se justifica con algo comprobable:

- **`js/services/ServicioOpcionesPago.js:23` (líneas 24, 25 y 27)**: el `catch` de `obtenerMetodos()` solo se ejecuta si `new Pago(100, metodo, 1)` lanza. Los dos métodos candidatos (`efectivo-transferencia` y `tarjeta`) son constantes privadas del módulo y siempre son válidos, de modo que `Pago` nunca lanza ahí. Para forzarlo habría que reemplazar el constructor `Pago` importado, y un módulo ES no se puede sustituir con un doble de prueba. El `catch` equivalente de `obtenerCuotas()` sí está cubierto: sus dos caminos (error de validación → cuota descartada, otro error → se relanza) los prueban los specs de `ServicioOpcionesPago`.
- **`js/script.js`, líneas 1131 y 1132** (`document.readyState === "loading"`): `index.html` carga `script.js` como `<script type="module">` sin `async`, y los módulos se ejecutan una vez que el documento terminó de analizarse, así que `readyState` nunca es `"loading"` en ese momento. Un spec de «Rutas defensivas y de error» comprueba justamente que la etiqueta es de tipo módulo y no tiene `async`, que es la razón de que esa rama no se recorra. V8 puede informar la rama como cubierta o no según la corrida; las dos líneas siguen sin ejecutarse.

Lo que antes figuraba como no cubierto y ahora lo prueba un spec: los elementos obligatorios ausentes al cargar (línea 38) y `estado-aplicacion` ausente, `confirmarPedido()` sin pedido pendiente (RC24), el `catch` de `confirmarPedido()` por reloj inválido, la rama `default` de los dos `switch` de acciones, `if (!esperandoCierreCarrito) return;`, `if (!control) return;`, el filtro de precio alterado a mano (RC21), la cuota inexistente, el error inesperado al generar el resumen y los `catch` externos de `guardar()`, `cargarInstancia()` y `cargarLista()` de `storage.js`. Con RC81 a RC84 se agregaron además los de `ValidacionPedido.js` (campo desconocido y error inesperado), `ConfirmadorPedidos.js` (fallo al guardar la secuencia, el historial o su restauración) y `script.js` (`focusout` fuera de un campo, carrito vacío que no se puede guardar tras confirmar, y error inesperado al confirmar). La rama de `js/models/Pedido.js:31` (`typeof numero !== "string"` en `numeroValido()`), que antes figuraba como inalcanzable, se eliminó en la corrección de RC51: `Pedido.fromJSON()` ahora lee `datos.numero` una sola vez y valida su tipo antes de llamar a `numeroValido()`, así que esa guarda repetía una validación ya hecha. Además, antes se leía `datos.numero` tres veces (validar el tipo, validar el formato y guardarlo), y un spec comprueba ahora que se lee una sola vez y que se guarda el mismo valor que se validó.

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
- **Prompts**: los prompts originales con los que se generaron las suites del Tester QA (`models`, `storage`, `services` y `script`) **se perdieron** y no se pueden recuperar. En su lugar se documenta una reconstrucción aproximada, identificada como tal, en `docs/02-prompts/prompts-8.md`: no son los originales y no hay capturas de los originales. Desde el 2026-11-24 los prompts del Tester QA se conservan con el formato completo (`prompts-6.md` y `prompts-7.md`). El criterio de conservar los prompts originales se declara como **no cumplido** para las suites anteriores a esa fecha.
- **Verificación de que los tests detectan errores (pruebas de mutación manuales)**: se introdujo un defecto a propósito en una copia del repositorio y se comprobó que la suite, que sin el defecto no falla ningún spec, falla con él. Se probaron doce sobre la suite de 421 specs (antes del análisis de mutación automático de abajo): subir el recargo de 3 cuotas de 10 % a 13 % (5 fallas), que `guardarCarrito()` no guarde (8), que la secuencia de pedidos no avance (3), quitar la regla «precio anterior mayor al actual» de `ServicioOfertas` (1), no ordenar las categorías (2), contar unidades en vez de ítems en el contador del carrito (14) y que `cargarCarrito()` ignore lo guardado (3); y, para los specs agregados en esta corrección: que `confirmarPedido()` no avise cuando no hay pedido pendiente (1), que una cuota inexistente marque el control equivocado (1), que `obtenerCuotas()` oculte un error que no es de validación (1), y que `guardar()` y `cargarInstancia()` dejen salir el error inesperado (1 y 1). Los doce fueron detectados. Son pruebas manuales hechas una vez, no una herramienta de mutación automática.
- **Barrida automática de mutantes (2026-11-24)**: además de las manuales, un script propio (no incluido en el repositorio; no es una herramienta de mutación estándar como Stryker) aplicó 40 mutaciones elegidas al azar sobre `js/models/` y `js/services/` (cambio de `<=`/`>=`/`===`/`&&`/`||`, de `+` por `-` y de constantes) y corrió la suite completa con cada una. La suite detectó 33 y 7 sobrevivieron. Cuatro se resolvieron con specs nuevos (fecha 0 como límite del número de pedido, total con un bit de diferencia y mensaje de validación de los ítems de `Carrito`, que fallaban sin que ningún spec lo notara; además el spec «acepta diferencias que son sólo ruido de coma flotante» sumaba `Number.EPSILON` a un total de miles, lo que no cambia el valor, y por eso no probaba nada). Los 3 restantes son equivalentes o inalcanzables: `Pedido.js:31` (guarda inalcanzable en ese momento; se eliminó en la corrección de RC51, ver «Qué falta cubrir»), `Pedido.js:45` (`>` frente a `>=` solo difiere cuando la diferencia es exactamente igual a la tolerancia) y `ServicioOpcionesPago.js:42` (el bucle hasta 13 cuotas no cambia nada porque `Pago` rechaza 13 cuotas y el `catch` la descarta). Con los 4 specs nuevos, 37 de 40 mutantes quedan detectados.

---

## Capturas de Pantalla

Capturas tomadas con Playwright (Chromium) sobre el runner, con la corrida final sin fallos:

![Corrida completa](./capturas/captura-runner-completo.png)
*Runner completo: 451 specs, 0 failures*

![Modelos](./capturas/captura-models-spec.png)
*`models.spec.js` (runner de modelos): 89 specs, 0 failures*

![Storage](./capturas/captura-storage-spec.png)
*Suite `StorageUtil` (`?spec=StorageUtil`): 189 specs, 0 failures*

![Controlador](./capturas/captura-script-spec.png)
*Suite `Controlador` (`?spec=Controlador`): 116 specs, 0 failures*

Los 50 specs de `services.spec.js` están incluidos en la corrida completa; no tienen un runner propio. No hay capturas de tests fallando porque la corrida final no tuvo fallos; la comprobación de que los specs detectan errores es la de mutación descrita en «Herramientas y proceso».

---

## Hallazgos e Issues

La revisión del docente (RC3) pidió que los hallazgos de QA tengan una issue por caso, con el rol responsable y el criterio afectado. Esta tabla los resume; el texto para abrir cada issue está en `02-issues-qa.md` de la entrega de correcciones.

| # | Caso | Rol responsable | Criterio afectado | Severidad | Estado |
|---|---|---|---|---|---|
| H1 | Inicialmente, la validación de los datos del cliente se realizaba al enviar el formulario. Actualmente, el controlador implementa la validación individual mediante los eventos `input` y `focusout`, delegando las reglas de validación al servicio `ValidacionPedido.js` y proporcionando feedback visual y accesible. La validación definitiva al enviar el formulario continúa a cargo de la clase `Pedido`. La suite `script.spec.js` contempla las pruebas correspondientes a RC59. | Desarrollador JS Eventos + DOM | Validación de formularios y manejo de errores | Baja | **Resuelto** mediante la PR [#186](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/pull/186) (RC22 y RC59). Trazabilidad actualizada según RC81 |
| H2 | Inicialmente, los pedidos y su secuencia no se persistían y la numeración volvía a `0001` al recargar la página. Actualmente, `ConfirmadorPedidos` recupera y almacena el historial y la secuencia mediante `FachadaStorage` en `localStorage`, utilizando las claves `app:pedidos:historial` y `app:pedidos:secuencia`. La suite `script.spec.js` contempla pruebas de persistencia después de recargar, cancelación y manejo de errores de almacenamiento. | Desarrollador JS Local y Session Storage y Desarrollador JS Eventos + DOM | Integración de Web Storage en la aplicación | Media | **Resuelto** mediante la PR [#188](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/pull/188) (RC62). Issue [#176](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/issues/176) cerrada según la revisión del docente. Trazabilidad actualizada según RC82 |
| H3 | 11 de los 17 métodos de `FachadaStorage` no los llama ningún flujo de la aplicación: solo se usan los del carrito (`cargarCarrito`, `guardarCarrito`) y los del historial y la secuencia de pedidos (`cargarPedidos`, `guardarPedidos`, `cargarSecuenciaPedidos`, `guardarSecuenciaPedidos`) | Desarrollador JS Local y Session Storage | Integración de Web Storage / documentación coherente con el código | Baja | **Abierto**; la documentación ya lo declara |
| H4 | Inicialmente, los datos del catálogo (`productosIniciales`) se encontraban declarados dentro del controlador. Actualmente, los datos se encuentran en el módulo independiente `js/data/productosIniciales.js` y se importan desde `js/script.js`. La configuración de ofertas permanece encapsulada en `ServicioOfertas.js`, fuera del controlador, y los datos de los productos se recuperan desde el catálogo. La suite `script.spec.js` contempla pruebas de separación de responsabilidades, conservación de los datos originales y renderizado dinámico. | Desarrollador JS Eventos + DOM | Separación de responsabilidades | Baja | **Resuelto respecto de la separación de los datos del catálogo** mediante la PR [#186](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/pull/186) (RC60). Trazabilidad actualizada según RC83 |
| H5 | Inicialmente, al cancelar el pedido, el mensaje se mostraba en `#pedido-mensaje`, dentro de la sección de confirmación que se ocultaba. Actualmente, `cancelarPedido()` muestra el mensaje en la región visible `#pago-mensaje`, conservando el carrito y las condiciones de pago y limpiando los estados de validación del formulario. La suite `script.spec.js` contempla pruebas que verifican el contenido, la visibilidad y los atributos de accesibilidad del mensaje, además de la posibilidad de retomar el proceso de compra. | Desarrollador JS Eventos + DOM (código) y Tester/QA (spec) | Retroalimentación al usuario / estados de la interfaz | Baja | **Resuelto** mediante la PR [#186](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/pull/186) (RC61). Trazabilidad actualizada según RC84 |
| H6 | Cobertura informada solo por líneas, sin ramas ni casos borde | Tester/QA | Cobertura y casos borde de las pruebas | Media | **Resuelto** en esta corrección (se miden líneas, funciones y ramas: 99,7 % / 100 % / 99,7 %; las 2 ramas restantes se justifican en «Qué falta cubrir y por qué») |
| H7 | La suite que dejó la PR #169 terminaba con 3 specs en rojo (220 specs, 3 failures): tres specs del controlador no coincidían con el comportamiento actual | Tester/QA | Aislamiento y mantenimiento de los tests | Media | **Resuelto** en esta corrección (394 specs, 0 failures; ver abajo) |
| H8 | Sin evidencia de prompts ni de Playwright MCP para las suites del Tester QA | Tester/QA | Uso de herramientas de IA y trazabilidad | Media | **No resuelto**: declarado como desvío |

### H7: tres specs del controlador en rojo tras la PR #169

Se corrió la suite sobre el commit de la PR #169 (`c4fd0dc`) antes de tocar nada: 220 specs, 3 failures. Ninguna falla señala un defecto del código; los tres specs se escribieron contra un comportamiento que cambió, y se adaptaron **sin modificar el código del controlador**:

| Spec | Por qué fallaba | Cambio |
|---|---|---|
| Requisitos transversales › los flujos de búsqueda, carrito, pago y cancelaciones tampoco los usan | Tras buscar «zzz» y filtrar por categoría, el catálogo se vuelve a dibujar y las tarjetas que no coinciden ya no existen (`TypeError … reading 'dispatchEvent'`) | Se borra la búsqueda y se vuelve a «todas las categorías» antes del paso que necesita las tarjetas |
| Requisitos transversales › los campos con error quedan asociados a su mensaje (`aria-describedby` / `aria-invalid`) | Escribía un correo inválido y esperaba `aria-invalid="true"`, pero en la versión correspondiente a la PR #169 la validación se realizaba al enviar el formulario (estado histórico de H1, corregido posteriormente mediante RC59) | Completa los demás datos, escribe el correo inválido y envía el formulario; verifica el mismo `aria-invalid` y el mismo mensaje |
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
- La limitación identificada originalmente en H2 fue resuelta mediante RC62 en la PR [#188](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/pull/188). Actualmente, `script.spec.js` incluye pruebas de persistencia del historial y la secuencia después de recargar la página, cancelación de pedidos sin modificar los datos almacenados y manejo de errores durante el almacenamiento.

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

**Última Actualización:** 27/11/2026 (testing funcional Fetch/API del Segundo Parcial; antes, 2026-11-25, corrección de RC51: `Pedido.fromJSON()` y cobertura de modelos; antes, 2026-11-23, correcciones de la revisión de la cuarta entrega sobre la rama de release con las PR #167, #168 y #169)
**Tester/QA Engineer:** Alan Diaz (@alandox1)
**Tester QA/JS - Segundo Parcial:** @LuchoBarrionuevo13
