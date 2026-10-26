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
| 1. Búsqueda y filtrado | normalizarTexto, validarPrecioMaximo, buscarProductos | filtro por texto, por categoría, orden por precio | precio máximo 0, precio igual al máximo, sin resultados | precio no numérico, negativo, null, undefined, catálogo null |
| 2. Gestión de carrito | validarCantidad, agregarProductoAlCarrito, cambiarCantidadCarrito, eliminarProductoDelCarrito, calcularResumenCarrito | agregar, sumar, cambiar, eliminar, total | carrito vacío, código con mayúsculas o espacios, cantidad en el límite seguro | producto inexistente, cantidad 0, negativa, decimal, null |
| 3. Pago y cuotas | calcularCondicionesPago | contado, tarjeta en 1, 3 y 6 cuotas | redondeo a 2 decimales, total muy grande, cuotas como string | total 0, negativo o null; método inválido; cuotas no ofrecidas |
| 4. Confirmación de pedido | validarNombre, validarCorreo, validarDireccion, validarDatosCliente, crearResumenPedido, crearNumeroPedido | cliente válido, resumen completo, formato FL-…-0007 | espacios recortados, secuencia de más de 4 dígitos | nombre solo numérico, correo sin dominio, carrito vacío, pago o cliente null |

Categorías que cubre cada suite:

- **Funcionalidad básica (happy path):** casos normales de uso.
- **Casos borde y valores límite:** 0, negativos, números muy grandes, strings vacíos.
- **Validación de errores y datos inválidos:** tipos incorrectos, `null` y `undefined`.
- **Operaciones con arrays y objetos:** agregar, eliminar, buscar y filtrar elementos; crear objetos, modificar propiedades y ejecutar métodos.
- **Cálculos y algoritmos:** verificar que las operaciones matemáticas sean correctas.

Alcance: solo se testean funciones de lógica de negocio. Las funciones que llaman a `prompt()` o `alert()` no se testean directamente, porque la entrega no permite manipulación del DOM ni eventos.

### 1.2 Herramientas a utilizar

| Herramienta | Uso | Justificación |
|-------------|-----|---------------|
| Claude (Anthropic) | Generar `js/test/script.spec.js` con `js/script.js` adjunto como contexto | Asistente de IA que lee el código real de `script.js` y escribe los tests a partir de las funciones y reglas que existen, sin inventar funciones. Se usa en lugar de Copilot Agent Mode (la consigna menciona Copilot): es la herramienta con la que se generaron los tests.  Lo generado se ejecuta en el navegador con Jasmine y se revisa antes de commitearlo.
| Playwright MCP (`@playwright/mcp`) | Abrir `js/test/test-runner.html` en un browser real, ejecutar las suites de Jasmine y capturar screenshots PASS/FAIL | Permite ejecutar los tests en un navegador real, igual que en producción, y capturar evidencia visual (screenshots) del resultado sin hacerlo a mano. Lo exige la consigna. |
| Jasmine 5.10.0 (CDN) | Framework de testing en el navegador | Lo exige la consigna; no requiere instalación |

### 1.3 Criterios de aceptación

- [ ] `spec-tester.md` commiteado en `docs/03-specs/actividad-obligatoria-3/` antes que `script.spec.js`
- [ ] 4 suites de tests (una por flujo), mínimo 3 tests por suite
- [ ] Tests ejecutados exitosamente en `test-runner.html` vía Playwright MCP
- [ ] Screenshots del test runner con resultados PASS/FAIL capturados
- [ ] Bugs reportados como issues en GitHub con pasos para reproducir y test case que falla
- [ ] `js/test/test-runner.html` con la configuración correcta de Jasmine y carga de archivos
- [ ] `js/test/testing-doc.md` con instrucciones de ejecución, descripción de suites y cobertura, métricas y capturas
- [ ] Coordinación con el Desarrollador JavaScript para mejorar la testabilidad del código
- [ ] Rama `feature/` con formato correcto, issue asociada al rol, PR hacia `develop` con revisión de otro integrante y entrada en `changelog.md`

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

### 2.2 Screenshots del test runner (Playwright MCP)

| Suite | Resultado | Captura |
|-------|-----------|---------|
| Flujo 1 | 16 specs, 0 failures | [captura-flujo-1.png](../../../js/test/capturas/captura-flujo-1.png) |
| Flujo 2 | 21 specs, 0 failures | [captura-flujo-2.png](../../../js/test/capturas/captura-flujo-2.png) |
| Flujo 3 | 11 specs, 0 failures | [captura-flujo-3.png](../../../js/test/capturas/captura-flujo-3.png) |
| Flujo 4 | 17 specs, 0 failures | [captura-flujo-4.png](../../../js/test/capturas/captura-flujo-4.png) |

### 2.3 Resumen de resultados

| Métrica | Valor |
|---------|-------|
| Tests totales | 65 |
| Tests que pasaron | 65 |
| Tests que fallaron | 0 |
| Bugs reportados como issues | 1 (observación de código, no falla ningún test) |

### 2.4 Ajustes manuales y coordinación con el Desarrollador JavaScript

| Ajuste / pedido | Resultado |
|-----------------|-----------|
| COMPLETAR | COMPLETAR |