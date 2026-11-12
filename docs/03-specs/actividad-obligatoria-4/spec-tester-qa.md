# Spec — Tester QA (Actividad Obligatoria N°4)

**Rol:** Tester QA (junto con Coordinador / DevOps) · **Integrante:** Alan Diaz (@alandox1)
**Rama:** `feature/tester-qa-specs` → `develop`
**Issue asociada:** _(completar con el número al crearla)_
**Entrega:** Actividad Obligatoria N.º 4 — FerroLab

**Entregables del rol:**

- `js/test/models.spec.js` (nuevo)
- `js/test/storage.spec.js` (nuevo)
- `js/test/script.spec.js` (refactorizado)
- `js/test/test-runner.html` (adaptado a la nueva forma de carga)
- `js/test/testing-doc.md` (actualizado)
- Este archivo: `docs/03-specs/actividad-obligatoria-4/spec-tester-qa.md`

> Orden obligatorio de commits: este archivo (sección BEFORE) se commitea **antes** que cualquier archivo spec de testing.

---

## BEFORE — Se completa antes de escribir cualquier test

### Qué se va a hacer

Se va a probar de forma automatizada la nueva arquitectura de la entrega:

- las clases del dominio de `js/models/` (`Producto`, `Catalogo`, `Carrito`, `Pago` y `Pedido`);
- la capa de abstracción de `js/utils/storage.js`;
- el controlador `js/script.js`, que pasa a manejar solo eventos y DOM.

Cada módulo JavaScript del proyecto tendrá su archivo spec. Los tests se ejecutan en `js/test/test-runner.html`, abierto en un navegador real con Playwright MCP.

### Por qué

La entrega pasa de funciones con `prompt()` y `alert()` a clases, storage y eventos. Los 143 tests de la tercera entrega verifican la lógica antigua y la interacción por diálogos, que dejan de existir. Hace falta una suite nueva que:

- compruebe el comportamiento de cada clase de forma aislada, sin DOM ni storage real;
- verifique que la persistencia no lanza excepciones ante datos corruptos o storage lleno;
- confirme que el controlador reacciona a los eventos y actualiza el DOM sin llamar a `prompt()` ni `alert()`.

### Qué se reutiliza de la suite actual

- Los 73 tests de lógica pura de `script.spec.js` ya cubren las reglas de negocio de los cuatro flujos. Se migran a `models.spec.js`, adaptados a la API de las clases (`Catalogo.buscar`, `Carrito.agregar`, `Pago.calcular`, `Pedido.confirmar`).
- Los 70 tests de interacción con espías de `prompt`/`alert` pierden sentido. Se reemplazan por tests de eventos y DOM.
- Se mantiene la función auxiliar de reinicio de estado entre tests, adaptada a las nuevas clases.

### Plan de testing

Cada fila indica qué se prueba. Los contratos salen de `spec-dev-poo.md` y `spec-dev-storage.md`; si POO o Storage los cambian al implementar, se ajusta este plan antes de escribir los tests.

#### `js/test/models.spec.js` — clases del dominio

| Clase | Happy path | Casos borde | Errores |
|---|---|---|---|
| `Producto` | Constructor con datos válidos y getters; `coincide()` por texto, categoría y precio máximo | Precio 0; texto con mayúsculas; criterios vacíos | Código, nombre o categoría vacíos; precio negativo, `NaN` o no numérico (`TypeError`/`RangeError`) |
| `Catalogo` | `obtenerProductos()`, `obtenerPorCodigo()` y `buscar()` devuelven los resultados esperados, ordenados por precio ascendente | Búsqueda sin criterios; texto con tildes o mayúsculas; código con espacios; el arreglo devuelto es una copia | Elementos que no son `Producto`; códigos duplicados; precio máximo inválido (`valido: false`, `error`, `resultados: []`) |
| `Carrito` | `agregar`, `cambiarCantidad`, `eliminar`, `vaciar`; `resumir()` con subtotales, total y `cantidadItems` | Sumar cantidad a un ítem existente; cantidad como cadena numérica; `cantidadItems` cuenta ítems distintos, no unidades; el resumen no expone referencias internas | Producto o ítem inexistente; cantidad 0, negativa, decimal o fuera del rango entero seguro; la operación inválida no modifica el carrito |
| `Pago` | Efectivo/transferencia (1 cuota, 0 %); tarjeta en 1, 3 y 6 cuotas (0, 10 y 20 %); `calcular()` con interés, total financiado y valor de cuota | Redondeo a dos decimales; total muy pequeño o muy grande; efectivo ignora el tercer argumento | Total ≤ 0 o no numérico; método inválido; cuotas distintas de 1, 3 o 6 |
| `Pedido` | Constructor con carrito, pago y cliente válidos; `resumir()`; `confirmar(fecha, secuencia)` genera `FL-<tiempo>-<secuencia>` con la secuencia de al menos cuatro dígitos | Copias independientes del carrito y del cliente; limpiar el carrito no altera el pedido; confirmar con tiempo y secuencia fijos da un resultado determinista | Carrito vacío; pago que no coincide con el total del carrito; nombre vacío o solo numérico; correo inválido; dirección vacía; segunda confirmación; fecha o secuencia inválidas |
| Serialización (todas) | `fromJSON(toJSON(x))` reproduce el objeto equivalente | `toJSON()` no incluye valores derivados (subtotales, interés) donde la spec lo indica; `Pedido` con `numero` nulo y con número | `fromJSON` con datos inválidos, campos faltantes o tipos incorrectos lanza `TypeError`/`RangeError` y no crea objetos parciales |

#### `js/test/storage.spec.js` — capa de storage

Los tests usan un `Storage` simulado (objeto en memoria) o espías sobre `localStorage`/`sessionStorage`, para no depender del navegador ni dejar datos entre tests, y para poder forzar errores.

| Función | Happy path | Casos borde | Errores |
|---|---|---|---|
| `guardar` / `obtener` | Guardar y recuperar un objeto en `localStorage` y en `sessionStorage`; el valor vuelve deserializado | Valor `null`, cadena vacía, objetos anidados; clave inexistente devuelve `null` | Storage lleno (`QuotaExceededError`) devuelve `false` y registra el error; valor no serializable (función, referencia circular) devuelve `false`; clave o tipo de storage inválidos |
| `actualizar` | Actualiza una clave existente | Clave inexistente no crea el dato (`false`) | Los mismos errores que `guardar` |
| `eliminar` | Elimina un dato existente | Idempotente: eliminar una clave inexistente no falla | Tipo de storage inválido |
| `listar` / `limpiar` | `listar` devuelve las claves con el prefijo, ordenadas; `limpiar` borra solo `app:*` | Prefijo sin coincidencias devuelve `[]`; `limpiar(tipo, false)` borra todo; no toca claves ajenas a la app | Storage inaccesible (`SecurityError`) |
| `existe` / `estaDisponible` | Reflejan el estado real del storage | Storage deshabilitado devuelve `false` | — |
| Datos corruptos | — | — | JSON inválido en una clave: `obtener` devuelve `null` y registra el error sin lanzar excepción |
| Integración con modelos | `guardarInstancia`/`cargarInstancia` y `guardarLista`/`cargarLista` usan `toJSON()`/`fromJSON()` | Lista vacía | Datos guardados que ya no cumplen las reglas del modelo: se informa el fallo y no se devuelve un objeto parcial |
| Nombres de clave | Las constantes de `CLAVES` coinciden con la convención `app:<dominio>:<dato>` de `spec-dev-storage.md` | — | — |

Ninguna operación del módulo debe lanzar excepciones hacia afuera. Cada test de error lo verifica.

#### `js/test/script.spec.js` — controlador (eventos y DOM)

Los tests montan un fragmento de DOM de prueba o usan el `index.html` real, y disparan eventos con `dispatchEvent`.

| Flujo | Qué se prueba |
|---|---|
| 1. Búsqueda y filtrado | El envío del formulario filtra y renderiza resultados; el filtro por categoría y precio; el orden (ascendente y descendente, según acuerden POO y Eventos + DOM); mensaje de «sin resultados»; precio inválido muestra el error en el DOM; el indicador del rango se actualiza |
| 2. Carrito | Agregar con el botón «Comprar»; cambiar cantidad; eliminar; vaciar; el total y la cantidad de ítems en el DOM; la cantidad inválida muestra un mensaje; el carrito persiste vía storage (con storage simulado) |
| 3. Pago y cuotas | Selección de método y cuotas; el resumen de importes en el DOM; método o cuotas inválidos muestran error; un cambio del carrito descarta el pago anterior |
| 4. Confirmación del pedido | Validación en tiempo real de nombre, correo y dirección con feedback visual; el resumen previo; confirmar muestra el número de pedido y limpia el carrito y el pago; cancelar los conserva |
| Transversal | Ninguna ruta llama a `prompt()` ni `alert()` (espías que verifican que no se invocan); no hay `console.log` innecesarios; los errores inesperados se capturan con `try/catch` |

#### Pruebas con Playwright MCP en navegador real

Playwright MCP abre `js/test/test-runner.html`, deja correr las suites de Jasmine y captura una pantalla del resultado de cada suite (`models`, `storage`, `script`). También abre `index.html` para recorrer a mano los cuatro flujos con la interfaz y comprobar que se comporta como lo verifican los tests. Los bugs que aparezcan se reportan como issues (ver más abajo).

### Orden y dependencias

1. Se commitea este spec (esta PR o esta rama, antes de cualquier test).
2. Se espera a que POO, Storage y Eventos + DOM tengan su código integrado en `develop` (PR 7 de la planificación de `spec-devops.md`).
3. Se escriben los tests contra el código real, sin inventar firmas.
4. Se ejecutan en el navegador con Playwright MCP y se capturan los resultados.
5. Se reportan los bugs, se actualiza `testing-doc.md` y se completa AT CLOSE.

### Herramientas

- **GitHub Copilot en modo Agente**, con `js/models/*.js`, `js/utils/storage.js` y `js/script.js` como contexto, para generar `models.spec.js` y `storage.spec.js` y para refactorizar `script.spec.js`. Justificación: lo pide la consigna para este rol, y trabajar con el código real como contexto evita escribir tests contra firmas que no existen.
- **Playwright MCP** (`@playwright/mcp`), para abrir `test-runner.html` en un navegador real, ejecutar las suites y capturar los resultados PASS/FAIL. Justificación: los tests del controlador dependen del DOM y de eventos reales, y una ejecución en Node no los reproduce igual.
- **Jasmine 5.10.0**, el framework que ya usa el proyecto (cargado desde cdnjs en el runner).
- **c8**, para medir la cobertura de V8 en Node, fuera del repositorio, como se hizo en la tercera entrega. Se documenta en `testing-doc.md`.
- **GitHub Issues**, para reportar los bugs.

Si durante la tarea se usa una herramienta distinta de las previstas aquí, se registra en AT CLOSE con el motivo.

### Reporte de bugs

Cada bug encontrado se reporta como issue en GitHub, con este formato:

- Título claro y descriptivo.
- Comportamiento esperado vs. obtenido.
- Pasos para reproducir.
- Test case que falla (código del test).
- Etiquetas (`bug`, `enhancement`, etc.).
- Asignación al rol correspondiente:
  - lógica de negocio → Desarrollador JS POO;
  - DOM y eventos → Desarrollador JS Eventos + DOM;
  - storage → Desarrollador JS Storage.

### Coordinación y testabilidad

Para que el código sea probable, se acuerda con los demás roles antes de escribir los tests:

- **POO (Luciano):** cómo se cargan las clases en el runner (módulos ES6 o scripts clásicos); contratos finales de los métodos; errores `TypeError`/`RangeError`; tiempo y secuencia pasados como parámetros a `Pedido.confirmar` para tests deterministas.
- **Storage (Thiago):** poder inyectar o simular el objeto `Storage`; nombres de las constantes `CLAVES`.
- **Eventos + DOM (Angel):** identificadores estables de los controles y las regiones de resultado y error en `index.html`; que `script.js` pueda cargarse en el runner sin ejecutar efectos laterales al importarse; el criterio de orden descendente.
- **Runner:** `test-runner.html` carga hoy solo `../script.js` y `script.spec.js`. Debe pasar a cargar los modelos, el storage y los tres specs con la forma de carga que se acuerde.

### Criterios de aceptación

- [ ] Existe `js/test/models.spec.js` con tests de constructores, métodos de negocio, validaciones y serialización/deserialización de `Producto`, `Catalogo`, `Carrito`, `Pago` y `Pedido`.
- [ ] Existe `js/test/storage.spec.js` con tests de las operaciones CRUD y del manejo de errores (storage lleno, datos corruptos, storage inaccesible, valores no serializables).
- [ ] Hay un archivo spec por cada módulo JavaScript del proyecto.
- [ ] `js/test/script.spec.js` está refactorizado para la nueva arquitectura, sin espías de `prompt`/`alert` como mecanismo de prueba.
- [ ] Cada módulo tiene casos happy path, casos borde y casos de error, según el plan de este spec.
- [ ] `js/test/test-runner.html` carga todos los módulos y specs correctamente.
- [ ] Todos los tests se ejecutan en `test-runner.html` con Playwright MCP en un navegador real.
- [ ] Hay capturas del test runner con los resultados PASS/FAIL de cada suite.
- [ ] Los bugs encontrados están reportados como issues, con pasos para reproducir, el test que falla y asignación al rol correspondiente.
- [ ] `js/test/testing-doc.md` documenta la nueva estructura de testing, las instrucciones para ejecutar cada módulo, las métricas de cobertura actualizadas y las capturas.
- [ ] Los tests no dejan datos en el storage real entre ejecuciones.
- [ ] Rama `feature/tester-qa-specs`, este spec commiteado antes que cualquier archivo spec de testing, al menos un commit relevante, issue asociada, PR hacia `develop` con aprobación de otro integrante y entrada en `changelog.md`.

---

## AT CLOSE — Se completa al cerrar la tarea (evidencia)

> Se completa con lo que realmente se hizo.

### Herramienta realmente utilizada

(Pendiente: indicar si se usó GitHub Copilot en modo Agente, otra herramienta o ambas, y por qué.)

### Prompt exacto utilizado para generar `models.spec.js` y `storage.spec.js`

(Pendiente: prompt en bloque de código, indicando los archivos del dominio adjuntados como contexto.)

```text

```

### Prompt utilizado para refactorizar `script.spec.js`

(Pendiente.)

```text

```

### Capturas del test runner con Playwright MCP

(Pendiente: una captura por suite, con los resultados PASS/FAIL.)

### Resumen de resultados

| Métrica | Valor |
|---|---|
| Tests que pasaron | (pendiente) |
| Tests que fallaron | (pendiente) |
| Bugs reportados como issues | (pendiente) |
| Cobertura | (pendiente) |

### Issues reportadas

(Pendiente: lista con enlace, rol asignado y test que falla.)

### Ajustes manuales y coordinación con los desarrolladores

(Pendiente: qué se cambió a mano en los tests generados y qué se acordó con POO, Storage y Eventos + DOM para mejorar la testabilidad.)
