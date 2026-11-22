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
