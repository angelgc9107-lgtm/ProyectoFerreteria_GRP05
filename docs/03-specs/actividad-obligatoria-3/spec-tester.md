# 🧪 Spec — Tester JavaScript / QA Engineer — Actividad Obligatoria N°3

## 📌 Datos

- **Integrante:** Thiago Piastrellini ([@Piastrellini](https://github.com/Piastrellini)) — Matrícula 158097
- **Rol:** Tester JavaScript / QA Engineer
- **Rama:** `feature/tester-javascript-jasmine`
- **Fecha de inicio:** 2026-10-21
- **Fecha límite de entrega:** 2026-11-02 23:55
- **Archivos de la tarea:** `js/test/test-runner.html`, `js/test/script.spec.js`, `js/test/testing-doc.md`

---

## 1. ANTES de escribir cualquier test (planificación)

### 1.1 Plan de testing

Se testea `js/script.js` (a cargo del Desarrollador JavaScript) con Jasmine en el navegador. Hay una suite por cada flujo principal y cada suite tiene como mínimo 3 tests. Las funciones y los flujos se definieron a partir de `spec-dev-javascript.md` y de los diagramas de actividades del Arquitecto.

| Flujo | Función a testear | Happy path | Casos borde | Errores / datos inválidos |
|-------|-------------------|------------|-------------|---------------------------|
| 1. Búsqueda y filtrado | normalizarTexto, validarPrecioMaximo, buscarProductos | filtro por texto, por categoría, orden por precio | precio máximo 0, precio igual al máximo, sin resultados, precio máximo omitido (vacío, null o undefined) | precio no numérico, negativo, infinito, catálogo null |
| 2. Gestión de carrito | validarCantidad, agregarProductoAlCarrito, cambiarCantidadCarrito, eliminarProductoDelCarrito, calcularResumenCarrito, formatearMoneda, formatearResumenCarrito | agregar, sumar, cambiar, eliminar, total, formato de moneda y de resumen | carrito vacío, código con mayúsculas o espacios, cantidad en el límite seguro | producto inexistente, cantidad 0, negativa, decimal, null |
| 3. Pago y cuotas | calcularCondicionesPago | contado, tarjeta en 1, 3 y 6 cuotas | redondeo a 2 decimales, total muy grande, cuotas como string | total 0, negativo o null; método inválido; cuotas no ofrecidas |
| 4. Confirmación de pedido | validarNombre, validarCorreo, validarDireccion, validarDatosCliente, crearResumenPedido, crearNumeroPedido, formatearResumenPedido | cliente válido, resumen completo, formato FL-…-0007, texto del pedido | espacios recortados, secuencia de más de 4 dígitos, pago en efectivo | nombre solo numérico, correo sin dominio, carrito vacío, pago o cliente null |

Categorías que cubre cada suite:

- **Funcionalidad básica (happy path):** casos normales de uso.
- **Casos borde y valores límite:** 0, negativos, números muy grandes, strings vacíos.
- **Validación de errores y datos inválidos:** tipos incorrectos, `null` y `undefined`.
- **Operaciones con arrays y objetos:** agregar, eliminar, buscar y filtrar elementos; crear objetos, modificar propiedades y ejecutar métodos.
- **Cálculos y algoritmos:** verificar que las operaciones matemáticas sean correctas.

Alcance: las funciones de lógica de negocio se testean directamente. Las funciones que llaman a `prompt()` o `alert()` se testean con espías de Jasmine (`spyOn(window, "prompt")` y `spyOn(window, "alert")`), sin DOM ni eventos, verificando argumentos, cantidad de llamadas, orden de interacción, mensajes y estado final (corrección de la revisión del profesor).

### 1.2 Herramientas a utilizar

| Herramienta | Uso | Justificación |
|-------------|-----|---------------|
| Claude (Anthropic), conversación de chat | Generar la primera versión de `js/test/script.spec.js` (73 tests de lógica pura) con `js/script.js` adjunto como contexto | Asistente de IA que lee el código real de `script.js` y escribe los tests a partir de las funciones y reglas que existen, sin inventar funciones. Lo generado se ejecuta en el navegador con Jasmine y se revisa antes de commitearlo. |
| Claude (Anthropic) **en modo agente** | Correcciones de la revisión del profesor (noviembre): agregar las suites de interacción con `prompt()`/`alert()` y ajustar la documentación | El agente trabaja directamente sobre los archivos del repo: lee `script.js` y los tests, escribe `script.spec.js`, ejecuta Jasmine en Node y en Chromium (Playwright por script), mide cobertura con `c8` y corrige lo que falla hasta que la suite pasa. Ver "2.5 Uso de IA en modo agente". No se usó GitHub Copilot en modo Agente. |
| Playwright MCP (`@playwright/mcp`) | Abrir `js/test/test-runner.html` en un browser real, ejecutar las suites de Jasmine y capturar screenshots PASS/FAIL | Permite ejecutar los tests en un navegador real, igual que en producción, y capturar evidencia visual (screenshots) del resultado sin hacerlo a mano. Lo exige la consigna. |
| Jasmine 5.10.0 (CDN) | Framework de testing en el navegador | Lo exige la consigna; no requiere instalación |

### 1.3 Criterios de aceptación

- [x] `spec-tester.md` commiteado en `docs/03-specs/actividad-obligatoria-3/` antes que `script.spec.js`
- [x] 4 suites de tests (una por flujo), mínimo 3 tests por suite
- [x] Tests ejecutados exitosamente en `test-runner.html` vía Playwright MCP
- [x] Screenshots del test runner con resultados PASS/FAIL capturados
- [x] Bugs reportados como issues en GitHub con pasos para reproducir y test case que falla
- [x] `js/test/test-runner.html` con la configuración correcta de Jasmine y carga de archivos
- [x] `js/test/testing-doc.md` con instrucciones de ejecución, descripción de suites y cobertura, métricas y capturas
- [x] Coordinación con el Desarrollador JavaScript para mejorar la testabilidad del código
- [x] Rama con formato correcto (`feature/tester-javascript-jasmine` en el PR #123 y `docs/tester-spec-review-aprobada` en este PR de seguimiento #132), issue asociada al rol (#124), PR hacia `develop` con revisión de otro integrante (#123, revisado por @LuchoBarrionuevo13) y entrada en `changelog.md`

---

## 2. AL CERRAR la tarea (evidencia)

> Esta sección se completa al terminar la ejecución de los tests.

### 2.1 Prompt utilizado para generar `script.spec.js`

Herramienta: Claude (Anthropic), en una conversación de chat. No se usó Copilot Agent Mode. Contexto adjunto: `js/script.js` de la rama `feature/dev-javascript-logica-negocio` y el PDF de la actividad. No hubo un único prompt: se trabajó en una conversación. Las instrucciones que guiaron la generación fueron:

```text
Adjunto js/script.js. Generá js/test/script.spec.js con Jasmine 5.10.0 para ejecutar en el navegador.
Reglas:
- 4 bloques describe, uno por flujo: (1) Búsqueda y filtrado: normalizarTexto, validarPrecioMaximo, buscarProductos; (2) Gestión de carrito: validarCantidad, agregarProductoAlCarrito, cambiarCantidadCarrito, eliminarProductoDelCarrito, calcularResumenCarrito; (3) Pago y cuotas: calcularCondicionesPago; (4) Confirmación de pedido: validarNombre, validarCorreo, validarDireccion, validarDatosCliente, crearResumenPedido, crearNumeroPedido.
- Mínimo 3 it por describe. Cubrí: happy path, casos borde y valores límite, datos inválidos (tipos incorrectos, null, undefined), operaciones con arrays y objetos, y cálculos.
- Testeá solo lógica de negocio. No uses DOM, eventos, prompt ni alert.
- No inventes funciones ni comportamientos que no existan en script.js.
```

Cuando el Desarrollador JavaScript modificó `validarPrecioMaximo()` (permite omitir el precio máximo), se volvió a adjuntar el `script.js` actualizado y se ajustaron los tests del Flujo 1 con el mismo criterio. Después de la review de un integrante se agregaron tests para las funciones `formatear*`, con el mismo criterio.

### 2.2 Screenshots del test runner (Playwright MCP)

| Suite | Resultado | Captura |
|-------|-----------|---------|
| Flujo 1 (lógica pura) | 18 specs, 0 failures | [captura-flujo-1.png](../../../js/test/capturas/captura-flujo-1.png) |
| Flujo 1 (interacción) | 19 specs, 0 failures | [captura-flujo-1-interaccion.png](../../../js/test/capturas/captura-flujo-1-interaccion.png) |
| Flujo 2 (lógica pura) | 25 specs, 0 failures | [captura-flujo-2.png](../../../js/test/capturas/captura-flujo-2.png) |
| Flujo 2 (interacción) | 21 specs, 0 failures | [captura-flujo-2-interaccion.png](../../../js/test/capturas/captura-flujo-2-interaccion.png) |
| Flujo 3 (lógica pura) | 11 specs, 0 failures | [captura-flujo-3.png](../../../js/test/capturas/captura-flujo-3.png) |
| Flujo 3 (interacción) | 11 specs, 0 failures | [captura-flujo-3-interaccion.png](../../../js/test/capturas/captura-flujo-3-interaccion.png) |
| Flujo 4 (lógica pura) | 19 specs, 0 failures | [captura-flujo-4.png](../../../js/test/capturas/captura-flujo-4.png) |
| Flujo 4 (interacción) | 15 specs, 0 failures | [captura-flujo-4-interaccion.png](../../../js/test/capturas/captura-flujo-4-interaccion.png) |
| Menú principal (integración) | 4 specs, 0 failures | [captura-menu-principal.png](../../../js/test/capturas/captura-menu-principal.png) |

Las capturas de las correcciones de noviembre se tomaron con Playwright por script; las anteriores (73 specs) se habían tomado con Playwright MCP.

### 2.3 Resumen de resultados

| Métrica | Valor |
|---------|-------|
| Tests totales | 143 (73 de lógica pura + 70 de interacción) |
| Tests que pasaron | 143 |
| Tests que fallaron | 0 |
| Bugs reportados como issues | 1 (#127, reproducible: 3 tests fallan contra la versión anterior de `script.js`) |
| Cobertura de `c8` sobre `script.js` | funciones 100 %, ramas 96,27 %, líneas 95,48 % |

### 2.4 Ajustes manuales y coordinación con el Desarrollador JavaScript

| Ajuste / pedido | Resultado |
|-----------------|-----------|
| Pedido al Dev JS: funciones puras, expuestas y menú sin autoejecución en `script.js` | `script.js` entregado en la rama del Dev JS con funciones globales y `module.exports`; las 15 funciones de lógica de negocio quedaron testeables sin cambios |
| Primera corrida sin Playwright MCP conectado (se usó la librería Playwright por script) | Se registró el servidor en Claude Code y se repitió la corrida con Playwright MCP |
| Observación en `buscarProductos`: condición `valor === null` inalcanzable | Reportada como issue [#127](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/issues/127) |
| Cambio del Dev JS en `validarPrecioMaximo()` (permite omitir el precio máximo, respuesta al issue #127) | Se actualizaron 2 tests del Flujo 1 y se agregaron 2 nuevos; se repitió la corrida con Playwright MCP: 67 specs, 0 failures |
| Review de @LuchoBarrionuevo13: hallazgo #1, funciones `formatear*` sin tests | Aceptado. Se agregaron 6 tests (formatearMoneda, formatearResumenCarrito y formatearResumenPedido); se repitió la corrida con Playwright MCP: 73 specs, 0 failures |
| Revisión del profesor: faltaban tests de `ejecutar*`, `solicitarDatoValido` y `preguntarSiNo` | Se agregaron 70 tests con espías de `prompt`/`alert`; se repitió la corrida en Chromium: 143 specs, 0 failures |
| Revisión del profesor: el menú del carrito mostraba «Ver» y el diagrama define «Comprar» con transición al pago | Se alineó `script.js` al diagrama; los tests cubren la transición Comprar → Pago |
| Cancelar nombre, correo o dirección no avisaba «Pedido cancelado» (el diagrama del flujo 4 sí lo indica) | Se agregó el aviso en `script.js`; los tests lo verifican |

### 2.5 Uso de IA en modo agente (correcciones de la revisión del profesor)

La revisión pidió probar con espías las funciones que usan `prompt()` y `alert()` y documentar el uso real de IA en modo agente. En esta etapa se usó **Claude (Anthropic) en modo agente** (no GitHub Copilot), a pedido del Coordinador, con acceso a los archivos del proyecto y a una consola de comandos. Qué hizo el agente:

1. **Leyó el código real:** `js/script.js`, `js/test/script.spec.js`, `testing-doc.md` y los diagramas de actividades, para conocer los mensajes, las reglas de cancelación y el estado compartido (`carritoActual`, `condicionesPagoActuales`).
2. **Escribió las suites de interacción** en `js/test/script.spec.js` (70 tests nuevos) usando `spyOn(window, "prompt")` con `and.callFake` y `spyOn(window, "alert")`, con comprobaciones de argumentos, cantidad de llamadas, orden de interacción, mensajes y estado final.
3. **Ejecutó la suite** en Node con `jasmine` 5 y en Chromium con Playwright (script, no Playwright MCP) sobre una copia local de `test-runner.html`. La primera corrida tuvo 2 fallos: eran supuestos incorrectos del test (al salir con `0` el menú muestra el carrito una última vez, igual que el diagrama). Se corrigieron los tests y la corrida final dio `143 specs, 0 failures`.
4. **Midió la cobertura** con `c8` y documentó el resultado, incluidas las líneas que no se cubren.
5. **Reprodujo el Issue #127:** ejecutó los tests contra `script.js` del commit `95d2d5f` (la versión anterior) y comprobó que 3 de ellos fallan; esa evidencia está en `testing-doc.md`.
6. **Regeneró las capturas** del runner con Playwright.

Las decisiones (qué casos cubrir y cuándo aceptar un cambio en `script.js`) quedan a cargo del Coordinador, que revisa los cambios antes de commitearlos. Instrucción que guió el trabajo (resumida): *"hacer las correcciones de la revisión del profesor: tests con espías de prompt/alert para ejecutar*, solicitarDatoValido y preguntarSiNo, documentación de cobertura real e Issue #127 con evidencia"*.
