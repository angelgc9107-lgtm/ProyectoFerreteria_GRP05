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

- Revisión de hallazgos #2 y #3: 35 ejecutadas, 35 aprobadas y 0 fallidas.
- Salida: `35 specs, 0 failures, randomized with seed 92645`.
- Captura: [captura-jasmine-modelos-poo-hallazgos-2-3.png](./captura-jasmine-modelos-poo-hallazgos-2-3.png).
- Nuevos casos: intereses y cuotas con centavos, restauración con diferencias
  de representación binaria, subtotales sin redondear, tipos incorrectos,
  importes no finitos y alteraciones de importes y condiciones de pago.

Ejecución anterior:

- Ejecutadas: 29. Aprobadas: 29. Fallidas: 0.
- Salida: `29 specs, 0 failures, randomized with seed 13609`.
- Captura: [captura-jasmine-modelos-poo.png](./captura-jasmine-modelos-poo.png).

El runner inicializa Jasmine (boot0 + reporter manual), importa
`models.spec.js` y luego ejecuta `env.execute()`, en lugar de usar `boot1`,
que ejecuta en `window.onload`.
