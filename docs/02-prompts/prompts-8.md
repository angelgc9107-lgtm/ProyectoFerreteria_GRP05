# Prompt 8

**Integrante:** Alan Díaz
**Rol:** Tester QA
**Modelo de IA:** Claude (Anthropic); la versión exacta no se registró
**Método de prompt:** Role prompting

> ## ⚠ Aviso: estos NO son los prompts originales
> Los prompts con los que se generaron las cuatro suites (`models.spec.js`, `storage.spec.js`, `services.spec.js` y `script.spec.js`) **se perdieron**: no se guardaron el texto, las capturas ni las respuestas de esas conversaciones.
> Los textos de abajo fueron **reconstruidos el 2026-11-25** a partir de lo que las suites hacen hoy y de lo que se le pidió a la IA. Son una **aproximación** al pedido original, no una copia. No hay captura del prompt ni del resultado original, y no se afirma que estos textos, ejecutados de nuevo, produzcan exactamente los mismos specs.
> Lo que sí es verificable es el resultado: las suites están en el repositorio, con su historial de commits y con la corrida actual (425 specs, 0 failures).

## Prompts reconstruidos (aproximación)

**8.1 — `js/test/models.spec.js`**
```
Actuá como Tester QA de FerroLab (HTML + JS con módulos ES, sin framework ni backend).
Generá js/test/models.spec.js con Jasmine para js/models/{Producto,Catalogo,Carrito,Pago,Pedido}.js:
constructores y validaciones (TypeError / RangeError con mensaje), reglas de negocio (recargo de tarjeta
10 % en 3 cuotas y 20 % en 6, redondeo), toJSON/fromJSON con datos inválidos, y casos borde (precios no
finitos, cantidades no enteras, códigos repetidos). Un describe por clase. Sin dependencias externas.
```

**8.2 — `js/test/storage.spec.js`**
```
Actuá como Tester QA de FerroLab. Generá js/test/storage.spec.js con Jasmine para StorageUtil
(js/utils/storage.js): guardar, cargar, eliminar, limpiar, instancias y listas, con un storage simulado.
Cubrí los errores: cuota llena, JSON corrupto, storage inaccesible (SecurityError), referencia circular,
claves o tipos inválidos. Los tests no deben dejar datos en el storage real.
```

**8.3 — `js/test/services.spec.js`**
```
Actuá como Tester QA de FerroLab. Generá js/test/services.spec.js con Jasmine para js/services
(ConfirmadorPedidos, FachadaStorage, FormateadorMoneda, ServicioCategorias, ServicioOfertas,
ServicioOpcionesPago, ValidacionCarrito): caso feliz, bordes y errores de cada servicio.
```

**8.4 — `js/test/script.spec.js`**
```
Actuá como Tester QA de FerroLab. Generá js/test/script.spec.js con Jasmine para el controlador
js/script.js, cargando index.html real en un iframe por test. Cubrí los cuatro flujos (búsqueda y filtro,
carrito, pago y cuotas, confirmación del pedido), la accesibilidad de los mensajes (role=status,
aria-invalid) y que no se usen alert(), prompt() ni confirm(). Aislá el localStorage entre tests.
```

## Resultado esperado

Cuatro suites de Jasmine que corran en `js/test/test-runner.html` y cubran modelos, storage, servicios y controlador.

## Resultado obtenido (verificable)

Las suites que están hoy en el repositorio: 425 specs, 0 failures (88 de modelos, 189 de storage, 50 de servicios y 98 del controlador), con cobertura de ≈99,7 % de líneas y ramas (`js/test/testing-doc.md`). Su historial se puede revisar con `git log -- js/test/`.

## Correcciones manuales realizadas

No hay registro de las correcciones manuales hechas sobre las suites originales.

## Aplicación en el proyecto

Justificación formal, en respuesta a la observación RC1 y a la issue #182, de que los prompts originales de generación de las suites no se conservaron. Desde el 2026-11-24 los prompts se guardan con el formato completo (`prompts-6.md` y `prompts-7.md`).
