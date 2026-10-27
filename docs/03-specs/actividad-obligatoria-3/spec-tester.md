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
| Claude (Anthropic) | Generar `js/test/script.spec.js` con `js/script.js` adjunto como contexto | Asistente de IA que lee el código real de `script.js` y escribe los tests a partir de las funciones y reglas que existen, sin inventar funciones. Se usa en lugar de Copilot Agent Mode (la consigna menciona Copilot): es la herramienta con la que se generaron los tests. Lo generado se ejecuta en el navegador con Jasmine y se revisa antes de commitearlo. |
| Playwright MCP