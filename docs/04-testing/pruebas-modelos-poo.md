# Pruebas automatizadas de modelos POO

Suite Jasmine 5.10.0 para `Producto`, `Catalogo`, `Carrito`, `Pago` y
`Pedido`. Los casos cubren operaciones normales, validaciones, errores,
límites, serialización y restauración según los contratos implementados.

## Ejecución

1. Desde la raíz del repositorio, iniciar un servidor HTTP:

   ```bash
   python -m http.server 8000
   ```

2. Abrir en el navegador:

   ```text
   http://127.0.0.1:8000/js/test/models-test-runner.html
   ```

3. Esperar a que Jasmine muestre el resultado de la suite. Se requiere acceso a
   `cdnjs.cloudflare.com` para cargar Jasmine 5.10.0.

Se agregó un runner autónomo porque los modelos son módulos ES y el runner
existente ejecuta `js/script.js` con specs clásicos. Este runner nuevo permite
probar los modelos sin alterar ese runner ni los archivos de configuración.

## Resultado de ejecución

Ejecutado con Jasmine 5.10.0 en navegador (servidor HTTP local):

- RC51, después de agregar 11 casos: **84 specs, 0 failures**, semilla
  `15778`. Línea de base antes de editar: **73 specs, 0 failures**, semilla
  `56412`. No hubo pruebas fallidas en ninguna de las dos ejecuciones.
- Evidencia: salida del reporter Jasmine y medición mediante Chrome DevTools
  Protocol (CDP) durante cada ejecución; no se generó una captura nueva.
- Nuevos casos: validación de todos los textos y restauración independiente de
  `Producto`; búsqueda por descripción y filtros normalizados; catálogo vacío,
  disperso, precio cero y criterios de tipos inválidos; desbordes entre ítems y
  copias del carrito; redondeo binario, restauración y entradas inválidas de
  `Pago`; copias, enteros seguros máximos y números restaurados fuera de rango
  de `Pedido`.

### Cobertura V8 de los modelos (RC51)

Se usó la cobertura precisa de V8 mediante CDP, sobre el runner de modelos,
sin instalar paquetes ni modificar configuración. La tabla muestra líneas
estimadas según el primer carácter de código de cada línea no vacía, excluyendo
comentarios y líneas que solo cierran delimitadores; y funciones informadas
por V8 que se ejecutaron. Este criterio de líneas, basado en
`js/test/herramientas/cobertura-v8.js`, **no garantiza que cada expresión o
sentencia dentro de la línea haya sido ejecutada**.

| Modelo | Líneas antes y después | Funciones antes y después |
|---|---|---|
| Producto | 44/44 (100 %) | 13/13 (100 %) |
| Catalogo | 46/46 (100 %) | 16/16 (100 %) |
| Carrito | 92/92 (100 %) | 21/21 (100 %) |
| Pago | 49/49 (100 %) | 7/7 (100 %) |
| Pedido | 110/110 (100 %) | 16/16 (100 %) |
| **Total** | **341/341 (100 %)** | **73/73 (100 %)** |

Estos porcentajes son estimaciones V8 con el criterio indicado, no cobertura
Istanbul de líneas. Los rangos internos informados por V8 fueron 208/210
ejecutados antes y 215/217 después; **no son un porcentaje fiable de ramas**:
V8 no enumera de manera estable todas las alternativas y el denominador puede
cambiar entre ejecuciones. No se midió cobertura de sentencias. La ausencia
de herramientas de instrumentación no permite afirmar una cobertura completa
de ramas ni de sentencias.

Los dos rangos V8 no ejecutados corresponden a `Carrito.#actualizar()` al
relanzar un error distinto de `RangeError` (el cálculo interno normal solo
lanza `RangeError`) y a `numeroValido()` con un argumento no string (el
llamador lo rechaza antes). No se alteraron funciones nativas para forzarlos.

Para repetir la medición se necesita Playwright y Chromium ya disponibles.
Con el servidor del apartado anterior activo, este código ejecuta el runner
y consulta CDP sin modificar el proyecto (cambiar el puerto si corresponde):

```powershell
@'
const { chromium } = require("playwright");
(async () => {
    const browser = await chromium.launch();
    try {
        const page = await browser.newPage();
        const cdp = await page.context().newCDPSession(page);
        await cdp.send("Debugger.enable");
        await cdp.send("Profiler.enable");
        await cdp.send("Profiler.startPreciseCoverage", { callCount: true, detailed: true });
        await page.goto("http://127.0.0.1:8000/js/test/models-test-runner.html");
        await page.waitForFunction(() => window.jasmineDone === true);
        const { result } = await cdp.send("Profiler.takePreciseCoverage");
        console.log(await page.locator(".jasmine-overall-result").innerText());
        for (const script of result.filter(s => /\/js\/models\/(Producto|Catalogo|Carrito|Pago|Pedido)\.js$/.test(s.url))) {
            const source = (await cdp.send("Debugger.getScriptSource", { scriptId: script.scriptId })).scriptSource;
            const covered = new Int8Array(source.length).fill(-1);
            for (const fn of script.functions) for (const r of fn.ranges)
                covered.fill(r.count > 0 ? 1 : 0, r.startOffset, r.endOffset);
            let offset = 0, lines = 0, hit = 0, comment = false;
            for (const line of source.split("\n")) {
                const start = offset; offset += line.length + 1;
                const text = line.trim();
                if (comment) { if (text.includes("*/")) comment = false; continue; }
                if (text.startsWith("/*")) { if (!text.includes("*/")) comment = true; continue; }
                if (!text || text.startsWith("//") || /^[})\]];?,?$/.test(text)) continue;
                lines++;
                if (covered[start + line.length - line.trimStart().length] === 1) hit++;
            }
            const functions = script.functions.filter(fn => fn.ranges[0].count > 0).length;
            const blocks = script.functions.flatMap(fn => fn.ranges.slice(1));
            console.log(script.url.split("/").pop(), `líneas ${hit}/${lines}`,
                `funciones ${functions}/${script.functions.length}`,
                `bloques V8 ${blocks.filter(r => r.count > 0).length}/${blocks.length}`);
        }
    } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
'@ | node -
```

La herramienta existente `cobertura-v8.js` ejecuta la suite general, no el
runner de modelos; sus resultados no son directamente comparables con esta
tabla. La reproducción anterior necesita que Playwright y Chromium estén
disponibles; no se instalaron para esta revisión.

### Ejecuciones históricas

- Revisión de cadenas numéricas estrictas de la PR #150: 42 ejecutadas, 42
  aprobadas, 0 fallidas. Salida: `42 specs, 0 failures, randomized with seed 95696`.
  Casos nuevos: `"0x10"`, `"1e2"`, `"1e3"` y `"0x3"` rechazados en `Carrito`,
  `Catalogo` y `Pago`; cadenas con espacios (`" 3 "`) aceptadas.

Ejecución anterior:

- Revisión monetaria de la PR #150: 39 ejecutadas, 39 aprobadas, 0 fallidas
  y 0 pendientes. Salida: `39 specs, 0 failures, randomized with seed 86682`.
- Runner abierto mediante Playwright en
  `http://127.0.0.1:18753/js/test/models-test-runner.html`, servido por un
  servidor HTTP local temporal con Node.js.
- Casos nuevos: base del interés ya redondeada (incluido `100.149`), comparación
  del constructor, rechazo de diferencias pequeñas y preservación de la
  precisión de subtotales.

Ejecución anterior:

- Revisión de hallazgos #2 y #3: 35 ejecutadas, 35 aprobadas y 0 fallidas.
- Salida: `35 specs, 0 failures, randomized with seed 92645`.
- Captura: [captura-jasmine-modelos-poo-hallazgos-2-3.png](./captura-jasmine-modelos-poo-hallazgos-2-3.png).
- Nuevos casos: intereses y cuotas con centavos, restauración con diferencias
  de representación binaria, subtotales sin redondear, tipos incorrectos,
  importes no finitos y alteraciones de importes y condiciones de pago.

Ejecución previa:

- Ejecutadas: 29. Aprobadas: 29. Fallidas: 0.
- Salida: `29 specs, 0 failures, randomized with seed 13609`.
- Captura: [captura-jasmine-modelos-poo.png](./captura-jasmine-modelos-poo.png).

El runner inicializa Jasmine (boot0 + reporter manual), importa
`models.spec.js` y luego ejecuta `env.execute()`, en lugar de usar `boot1`,
que ejecuta en `window.onload`.

## Política monetaria comprobada

`Pago` redondea la entrada a dos decimales con `Math.round` y calcula el
interés sobre ese total redondeado; después redondea interés, total financiado
y cuota. Las pruebas incluyen `100.15` al 10 % y `100.149`, cuyo interés
diferiría si se usara la entrada sin redondear.

`Pedido` compara importes finitos por igualdad exacta o mediante la misma
regla restrictiva en construcción y restauración: diferencia de hasta
`Number.EPSILON * max(abs(actual), abs(esperado))`, con máximo de `1e-12`,
y coincidencia a 15 cifras significativas, siendo al menos uno igual a ese
valor normalizado. Se rechazan diferencias de centavos, subcentavos y
alteraciones pequeñas que no cumplen esa regla. Los subtotales y el total
del carrito no se redondean. Un cambio intencional idéntico a un artefacto
binario admitido no puede distinguirse a partir de los números serializados.
