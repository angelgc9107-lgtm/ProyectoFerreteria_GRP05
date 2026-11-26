# Resultado de la Entrada 3 — revisión de las suites (ejecutada el 2026-11-24)

- **Herramienta:** Claude Code (Claude Sonnet 5.5), con Playwright (Chromium) por script para correr la suite.
- **Prompt:** el de la Entrada 3 de `prompts-tester-qa.md`.
- **Código analizado:** rama `fix/qa-cobertura` sobre `release/cuarta-entrega` (`db683c2`).
- **Método para el punto 2:** cobertura V8 (`cobertura-v8.js --detalle`) y una barrida de 40 mutantes aleatorios (`mut_auto.py`, script propio, no incluido en el repo) sobre `js/models/` y `js/services/`.

## 1. Criterios de aceptación → spec que los cubre

| Criterio (`spec-tester-qa.md`) | Cubierto por | Estado |
|---|---|---|
| `models.spec.js` con constructores, negocio, validaciones y (de)serialización de los 5 modelos | `models.spec.js` (88 specs): `Producto`, `Catalogo`, `Carrito`, `Pago`, `Pedido`, cadenas numéricas | Cubierto |
| `storage.spec.js` con CRUD y errores (lleno, corrupto, inaccesible, no serializable) | `storage.spec.js` (189 specs): «guardar(): errores», «Detección de storage lleno», «Datos corruptos», «Storage inaccesible», «Serialización» | Cubierto |
| Un spec por cada módulo JS | 4 archivos spec para `models/`, `services/`, `utils/storage.js` y `script.js`. `js/data/imagenesCatalogo.js` (solo constantes) no tiene spec propio | Cubierto, con esa excepción |
| `script.spec.js` sin espías de `prompt`/`alert` como mecanismo | «Controlador - requisitos transversales» comprueba que no se los usa | Cubierto |
| Happy path, borde y error por módulo | Las 4 suites; las rutas de error del controlador están en «rutas defensivas y de error» | Cubierto |
| `test-runner.html` carga todo | Corrida completa: 425 specs, 0 failures | Cubierto |
| Ejecución con Playwright MCP | Se ejecutó por script; la corrida con MCP es la Entrada 2 | **No cumplido hasta completar la Entrada 2** |
| Capturas del runner | `js/test/capturas/` (4 capturas) | Cubierto |
| Bugs como issues | H1 a H8 en `testing-doc.md`; falta abrir las 8 issues independientes en GitHub | Pendiente (lo hace el integrante) |
| `testing-doc.md` | Actualizado | Cubierto |
| No dejar datos en el storage real | Aislamiento de `script.spec.js` (guarda, borra y restaura las claves `app:`) y «Web Storage real» sin claves residuales | Cubierto |
| Rama, PR con aprobación y changelog | Proceso en GitHub, no verificable con el código | Fuera del alcance de esta revisión |

## 2. Caminos de error y casos borde sin ejercitar

Con la cobertura V8 sobre 425 specs solo quedan sin ejecutar `Pedido.js:31`, `ServicioOpcionesPago.js:23-27` y `script.js:1104-1105`, que son inalcanzables sin modificar producción (justificado en `testing-doc.md`).

La cobertura no mide si los specs **verifican** algo, así que se complementó con mutación. De 40 mutantes, la suite detectó 33 y dejó pasar 7:

| Mutante | Resultado |
|---|---|
| `Pedido.js:36` `fecha >= 0` → `>= 1` | Sobrevivía: ningún spec reconstruía un pedido con fecha 0. **Spec agregado** |
| `Pedido.js:44` `EPSILON *` → `EPSILON /` en la tolerancia | Sobrevivía: el spec de «ruido de coma flotante» sumaba `Number.EPSILON` a un total de miles, que no cambia el valor. **Spec agregado** (usa el siguiente double) |
| `Carrito.js:40` dos mutaciones en la validación de ítems | Sobrevivían: los specs solo comprobaban el tipo de error, y null/undefined fallaban igual con el error nativo. **Spec agregado** (comprueba el mensaje) |
| `Pedido.js:45` `>` → `>=` | Equivalente: solo difiere si la diferencia es exactamente igual a la tolerancia |
| `Pedido.js:31` `return false` → `return true` | Guarda inalcanzable (ver arriba) |
| `ServicioOpcionesPago.js:42` bucle hasta 13 | Equivalente: `Pago` rechaza 13 cuotas y el `catch` la descarta |

## 3. Specs propuestos y aplicados

Los 4 specs están en `js/test/models.spec.js` (en la PR `fix/qa-cobertura`) y se comprobó que cada mutante pasa de «sobrevive» a «detectado»:

1. «rechaza ítems que no son objetos con el mensaje propio de la validación» (`Carrito`).
2. «fromJSON() acepta un pedido confirmado con fecha 0 (límite inferior del número)» (`Pedido`).
3. «acepta un total que difiere en un solo bit (el siguiente double) del recalculado» (`Pedido`).
4. «rechaza un total que difiere de lo recalculado en un centavo» (`Pedido`; es el contrapeso de la 3: la tolerancia no es demasiado grande).

Resultado: 37 de 40 mutantes detectados; los 3 restantes son equivalentes o inalcanzables.

## 4. Lo que afirma `testing-doc.md` y no coincidía con las suites

- El spec «acepta diferencias que son sólo ruido de coma flotante» parecía probar la tolerancia, pero sumaba `Number.EPSILON` (2,2e-16) a un total de miles de pesos, donde eso no cambia el número. Se mantiene, pero la tolerancia ahora la prueban los specs 3 y 4 de arriba; `testing-doc.md` describe la barrida y este hallazgo.
- La documentación decía que la mutación se probó con siete cambios manuales; ahora son doce manuales más la barrida automática de 40 (se actualizó).

## Limitaciones de esta revisión

- Es una revisión hecha por una IA con acceso al código y a la suite; no reemplaza la revisión humana ni la corrida con Playwright MCP (Entrada 2).
- La barrida es una muestra de 40 sobre 236 mutaciones candidatas, no el universo completo; sus resultados dependen de la semilla (7).
- Los módulos `js/utils/storage.js` y `js/script.js` no entraron en la barrida de mutantes (la cobertura de `storage.js` es 100 %; las mutaciones manuales anteriores sí tocaron `script.js`).
