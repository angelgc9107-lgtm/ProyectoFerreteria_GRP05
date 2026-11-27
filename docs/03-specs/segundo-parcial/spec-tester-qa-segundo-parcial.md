# Spec — Tester QA/JS - Testing Avanzado (Segundo Parcial)

**Rol:** Tester QA/JS - Testing Avanzado  
**Proyecto:** FerroLab — Programación Web I  
**Rama:** `feature/tester-qa-js-testing-suite` → `develop`

> Este SPEC se debe commitear antes de comenzar la implementación. En esta
> etapa solo se prepara el plan: no se implementan pruebas ni se ejecuta
> Lighthouse.

---

## BEFORE — Se completa antes de escribir cualquier test

### Qué se va a hacer y por qué

Planificar pruebas funcionales con Jasmine para la integración asíncrona y la
librería externa, y tres auditorías Lighthouse para detectar problemas y
regresiones durante su integración. El plan general del proyecto contempla el
catálogo y los flujos de compra, además de accesibilidad, SEO, mantenibilidad y
compatibilidad; las nuevas pruebas deben preservar los comportamientos existentes
que resulten afectados.

La API, la librería y sus contratos todavía deben ser definidos por los
desarrolladores responsables. No se presupone un proveedor, endpoint, formato
de datos, interfaz ni comportamiento concreto: se ajustarán los casos al código
y a los acuerdos reales antes de escribirlos.

### Qué se reutiliza de la suite actual

- `js/test/test-runner.html` carga Jasmine 5.10.0 desde CDN y los specs como
  módulos ES; se sirve el proyecto por HTTP desde la raíz para ejecutarlo.
- `models.spec.js` prueba las clases del dominio de forma aislada;
  `script.spec.js` prueba eventos y DOM con copias de `index.html` en un
  iframe y restaura el storage utilizado. `storage.spec.js` y
  `services.spec.js` también forman parte de la suite.
- Se conservarán las pruebas existentes y su aislamiento. La documentación de
  `js/test/testing-doc.md` registra corridas anteriores; sus resultados no se
  presentan como resultados del Segundo Parcial.
- En la implementación se deberá integrar la carga de los nuevos specs al
  runner existente, coordinando cualquier cambio necesario en ese archivo.

### Plan de testing funcional con Jasmine

Una vez acordados los contratos y disponibles las integraciones, escribir los
tests contra la implementación real. Usar datos controlados y espías o dobles
de Jasmine para evitar dependencia de la red y reproducir los errores; esperar
las operaciones asíncronas antes de verificar sus resultados. Restaurar los
espías y el estado compartido al terminar cada prueba.

#### `js/test/api.spec.js` — Fetch y procesamiento

| Caso | Qué se verificará |
|---|---|
| Respuesta exitosa | Simular una respuesta HTTP exitosa y comprobar el procesamiento y resultado esperados según el contrato acordado. |
| Error HTTP | Simular una respuesta con `ok` falso y comprobar que se identifica y comunica el error según el contrato; distinguirla de un rechazo de red. |
| Error de red | Simular el rechazo de `fetch` y verificar el manejo del fallo acordado. |
| `map`, `filter` y `reduce` | Comprobar los resultados del procesamiento implementado con datos conocidos, incluyendo colección vacía cuando corresponda, sin probar únicamente el funcionamiento nativo de JavaScript. |
| Integración con DOM | Si la funcionalidad modifica la interfaz, verificar el estado visible resultante y el tratamiento de errores conforme al contrato, aislando el DOM entre pruebas. |

#### `js/test/library.spec.js` — librería externa

| Caso | Qué se verificará |
|---|---|
| Inicialización | Que la integración inicialice la librería en las condiciones previstas. |
| Configuración | Que las opciones relevantes transmitidas coincidan con las acordadas. |
| Funcionalidad principal | Que la funcionalidad integrada produzca el resultado observable esperado. |
| Errores | Que los fallos relevantes de inicialización o uso se manejen y comuniquen según el contrato. |
| Interacción con el sistema | Que la librería interactúe correctamente con los módulos o la interfaz realmente involucrados, sin alterar los flujos existentes. |

Para ambos archivos, cubrir caminos exitosos, errores y casos borde pertinentes.
Usar dobles donde corresponda sin sustituir la verificación de la integración
real. Revisar `script.spec.js` y `models.spec.js` y actualizarlos solo si las
funcionalidades cambian sus contratos o requieren pruebas de regresión; mantener
o mejorar la cobertura existente y ejecutar también las demás suites.

### Plan de auditorías Lighthouse

Ejecutar las auditorías sobre el sitio en los siguientes momentos:

| Test case | Momento | Comparación |
|---|---|---|
| 11 — Baseline inicial | Sobre la rama `develop`, después del backport aprobado de la Actividad Obligatoria N.º 4 y antes de incorporar Fetch o la librería externa. | Punto de referencia inicial para TC-12 y TC-13. |
| 12 — Post Fetch | Después de integrar la funcionalidad asíncrona en `develop`. | Comparar numéricamente puntajes y métricas con el baseline del TC-11; analizar impacto y recomendaciones Lighthouse. |
| 13 — Post Library | Después de integrar la librería externa en `develop`. | Comparar numéricamente puntajes y métricas con TC-12; analizar impacto y recomendaciones Lighthouse. |

En cada auditoría registrar:

- Fecha, URL, rama y commit medido; navegador y versión de Lighthouse,
  dispositivo o modo, configuración de red y caché y demás condiciones
  relevantes. Mantener las condiciones equivalentes entre mediciones y
  documentar cualquier diferencia que limite la comparación.
- Puntajes de **Performance, Accessibility, Best Practices y SEO**, cada uno
  con umbral mínimo **≥95**. Registrar el resultado real incluso si no alcanza
  el umbral; conservar los resultados originales como evidencia y no presentar
  una auditoría pendiente como aprobada. Reportar los incumplimientos mediante
  Issues y verificar nuevamente los resultados después de las correcciones.
- Valores y unidades de **FCP, LCP, TBT, CLS y Speed Index**; para CLS,
  registrar el valor sin unidad.
- Problemas encontrados, capturas del informe y enlaces a las Issues asociadas.

Documentar cada resultado en su test case y guardar sus capturas en
`docs/04-testing/screenshots/`. En TC-12 y TC-13 analizar el impacto de cada
nueva funcionalidad sobre el rendimiento, la accesibilidad, las buenas
prácticas y el SEO; identificar mejoras y regresiones respecto de la auditoría
anterior; documentar las recomendaciones de optimización proporcionadas por
Lighthouse; comparar numéricamente las diferencias de puntajes y métricas; y
documentar las limitaciones de comparabilidad. Reportar los problemas
detectados mediante Issues asignadas al responsable correspondiente y
coordinar y verificar las correcciones necesarias ante hallazgos o puntajes
inferiores a los umbrales.

### Herramientas

| Herramienta | Uso y justificación |
|---|---|
| Jasmine | Framework ya utilizado en el proyecto; permite pruebas de módulos, operaciones asíncronas, espías y verificación de resultados en el navegador. |
| Lighthouse | Auditorías comparables de Performance, Accessibility, Best Practices y SEO, con las métricas y evidencias indicadas. |
| GitHub Copilot Agent Mode | Asistir en la generación y revisión de pruebas usando los contratos y archivos reales como contexto. Revisar y ejecutar lo generado, corregir supuestos y registrar el prompt y los ajustes manuales; la IA no sustituye la validación del equipo. |
| GitHub Issues | Registrar y asignar los problemas encontrados para su seguimiento y verificación. |

### Orden y coordinación con el equipo

1. Preparar y commitear este SPEC antes de implementar las pruebas; la PR del
   trabajo tendrá como destino `develop`.
2. Coordinar con el **Desarrollador JS Asíncrono** la API elegida, contratos,
   procesamiento, manejo de errores, integración en DOM y disponibilidad de
   su implementación para pruebas. Realizar TC-11 sobre la rama `develop`,
   después del backport aprobado de la Actividad Obligatoria N.º 4 y antes de
   incorporar Fetch o la librería externa.
3. Coordinar con el **Desarrollador JS Librerías Externas** la librería elegida,
   inicialización, configuración, comportamiento, errores y puntos de
   integración, así como su disponibilidad para pruebas.
4. Coordinar con el **Coordinador/DevOps** el orden de integración en
   `develop`, las condiciones reproducibles de auditoría, la carga de los
   nuevos specs en el runner y el seguimiento de Issues y PR. Ejecutar TC-12
   después del merge de Fetch y TC-13 después del merge de la librería;
   analizar en ambas auditorías el impacto en rendimiento, accesibilidad,
   buenas prácticas y SEO, las mejoras y regresiones y las recomendaciones de
   optimización de Lighthouse; comparar numéricamente puntajes y métricas,
   documentar limitaciones de comparabilidad y reportar los problemas
   mediante Issues asignadas al responsable correspondiente.
5. Implementar y ejecutar las suites sobre los contratos reales, revisar
   regresiones, documentar evidencias, comparar auditorías y completar AT CLOSE.

Todos los problemas encontrados se reportarán mediante **Issues detalladas**
asignadas al responsable correspondiente. Cada Issue incluirá título, contexto
y versión o commit, pasos para reproducir, resultado esperado y obtenido,
test o auditoría afectada y evidencia; se registrará su estado y se verificará
la corrección con el responsable.

### Entregables del rol

- `js/test/api.spec.js`.
- `js/test/library.spec.js`.
- `js/test/script.spec.js` y `js/test/models.spec.js`, si corresponde.
- `js/test/testing-doc.md`, actualizado con ejecución, suites y resultados.
- `docs/04-testing/testing-doc.md`, actualizado con el índice y seguimiento.
- `docs/04-testing/test-case-11-lighthouse-baseline.md`.
- `docs/04-testing/test-case-12-lighthouse-post-fetch.md`.
- `docs/04-testing/test-case-13-lighthouse-post-library.md`.
- `docs/04-testing/screenshots/`, con las capturas correspondientes.
- `changelog.md`, con la entrada del trabajo.
- Este SPEC, previo a la implementación.

### Criterios de aceptación

- [x] Este SPEC está commiteado antes de implementar cualquier prueba o
      ejecutar Lighthouse; la versión con las correcciones RC01/RC02 quedó
      registrada en el commit [`6cf9536`](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/commit/6cf9536b8f0ccff2bc6403173fb2849ea14246b5)
      a las 13:06 GMT-3, antes de la ejecución de TC-11 a las 13:37 GMT-3.
- [x] `api.spec.js` verifica éxito, error HTTP, error de red y procesamiento
      con `map`, `filter` y `reduce`; incluye DOM si corresponde.
- [ ] `library.spec.js` verifica inicialización, configuración, funcionalidad
      principal, errores e interacción con el sistema según la librería elegida.
- [ ] Los nuevos specs se ejecutan en el runner Jasmine; la suite existente
      sigue pasando y `script.spec.js` y `models.spec.js` se actualizan si
      corresponde, manteniendo o mejorando la cobertura existente.
- [ ] TC-11 se realizó sobre la rama `develop`, después del backport aprobado
      de la Actividad Obligatoria N.º 4 y antes de incorporar Fetch o la
      librería externa; TC-12 después de Fetch en `develop`; TC-13 después de
      la librería en `develop`.
- [ ] Cada auditoría registra las cuatro puntuaciones, FCP, LCP, TBT, CLS,
      Speed Index, condiciones de medición, problemas y capturas.
- [ ] En cada auditoría Performance, Accessibility, Best Practices y SEO
      alcanzan al menos 95 puntos; los resultados y correcciones están
      respaldados por evidencia.
- [ ] TC-12 compara numéricamente sus puntajes y métricas con TC-11, y TC-13
      con TC-12; ambas auditorías analizan el impacto de cada funcionalidad
      sobre rendimiento, accesibilidad, buenas prácticas y SEO, identifican
      mejoras y regresiones, documentan las recomendaciones de optimización de
      Lighthouse y las limitaciones de comparabilidad.
- [ ] Los problemas detectados en TC-12 y TC-13 están reportados mediante
      Issues asignadas al responsable correspondiente.
- [ ] Todos los problemas encontrados están reportados en Issues detalladas,
      asignadas al responsable correspondiente, con estado y verificación.
- [ ] Los documentos de testing, test cases, capturas y `changelog.md` están
      actualizados y AT CLOSE refleja exclusivamente lo realizado.
- [ ] El trabajo se desarrolla en `feature/tester-qa-js-testing-suite` y su PR
      tiene como destino `develop`.

---

## AT CLOSE — Se completa al cerrar la tarea (evidencia)

> AT CLOSE parcialmente actualizado: se documentan TC-11, las pruebas
> funcionales Fetch/API y TC-12, además del estado de las Issues asociadas.
> No representa el cierre definitivo; los demás apartados permanecen pendientes.

### Prompt exacto y contexto

Prompt exacto utilizado para generar `api.spec.js`:

```
# Segundo Parcial — Tester QA/JS - Testing Avanzado
## Implementación de pruebas funcionales Fetch/API

Proyecto: FerroLab
Materia: Programación Web I
Rol: Tester QA/JS - Testing Avanzado

Rama de trabajo:
feature/tester-qa-js-testing-suite

Rama destino:
develop

## 1. Contexto

El SPEC inicial de mi rol y la auditoría Lighthouse Baseline
(TC-11) ya fueron aprobados.

En esta etapa debo realizar las pruebas funcionales correspondientes
al trabajo del Desarrollador JS Asíncrono (Alan).

PR de referencia:

#217 — [Segundo Parcial] Implementación del consumo asíncrono
del catálogo (apiService, ProcesadorCatalogo, carga con estados
en script.js).

https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/pull/217

## 2. Lectura obligatoria del contexto

Antes de implementar cualquier prueba, revisar:

- plan.md.
- El SPEC del Desarrollador JS Asíncrono.
- docs/03-specs/segundo-parcial/spec-tester-qa-segundo-parcial.md.
- Los archivos implementados o modificados en la PR #217.
- La implementación de apiService.
- La implementación de ProcesadorCatalogo.
- Los cambios realizados en script.js.
- js/test/test-runner.html.
- js/test/models.spec.js.
- js/test/script.spec.js.
- js/test/storage.spec.js.
- js/test/services.spec.js.
- js/test/testing-doc.md.

Verificar que la implementación de la PR #217 esté disponible
en la rama de trabajo.

Identificar los contratos reales, métodos, parámetros, retornos,
dependencias, estados de carga y manejo de errores.

No inventar métodos, endpoints, atributos ni funcionalidades.

Si falta algún archivo o la implementación todavía no está
disponible, informar el problema antes de continuar.

## 3. Implementación de api.spec.js

Crear el archivo:

js/test/api.spec.js

Utilizar Jasmine y mantener la estructura, convenciones y
estilo de las pruebas existentes en FerroLab.

Implementar los siguientes grupos de pruebas, respetando
los contratos reales de la implementación de Alan.

### 3.1. Respuestas exitosas de Fetch

- Simular respuestas HTTP exitosas.
- Verificar el procesamiento de los datos recibidos.
- Verificar el resultado retornado por el servicio.
- Comprobar la estructura de los datos según el contrato real.
- Verificar la llamada a fetch y sus argumentos.

### 3.2. Errores HTTP

- Simular respuestas HTTP con ok igual a false.
- Verificar el manejo de errores HTTP.
- Comprobar que el error se comunica según la implementación.
- Verificar que una respuesta HTTP fallida no se procesa
  como una respuesta exitosa.

### 3.3. Errores de red

- Simular el rechazo de la promesa de fetch.
- Verificar el manejo de errores de conexión.
- Comprobar el comportamiento del sistema ante una falla de red.
- Diferenciar los errores HTTP de los errores de red.

### 3.4. ProcesadorCatalogo

Analizar los métodos reales de ProcesadorCatalogo y verificar
el procesamiento de datos mediante:

- map.
- filter.
- reduce.

Utilizar datos de prueba conocidos y comprobar los resultados
esperados.

No probar únicamente el comportamiento nativo de JavaScript.
Las pruebas deben verificar los métodos implementados por Alan.

### 3.5. Integración con el DOM

Analizar los cambios realizados en script.js relacionados
con la carga asíncrona del catálogo.

Verificar los estados implementados realmente:

- Estado de carga.
- Carga exitosa del catálogo.
- Renderizado de los productos.
- Estado de error.
- Estado vacío, si corresponde.
- Recuperación o reintento, si existe.

Comprobar que la integración asíncrona no afecte negativamente
los comportamientos existentes.

Mantener el aislamiento del DOM y restaurar el estado
compartido después de cada prueba.

### 3.6. Casos borde

Incorporar los casos borde pertinentes según los contratos
reales de la implementación:

- Colecciones vacías.
- Colecciones con un único elemento.
- Datos inválidos o incompletos, si corresponde.
- Resultados sin coincidencias.
- Errores durante el procesamiento de datos.

No exigir comportamientos que no estén definidos en el SPEC
o en los contratos acordados.

## 4. Buenas prácticas de testing

- Utilizar describe, it, expect, beforeEach y afterEach
  cuando corresponda.
- Utilizar espías y dobles de Jasmine para simular fetch.
- Evitar solicitudes reales a servicios externos.
- Utilizar async/await para las operaciones asíncronas.
- Restaurar los espías y el estado compartido.
- Mantener las pruebas independientes entre sí.
- Utilizar nombres descriptivos para cada caso.
- Cubrir caminos exitosos, errores y casos borde.
- No modificar el código funcional para forzar que las
  pruebas sean aprobadas.
- No ocultar ni eliminar pruebas fallidas.

## 5. Integración con el runner existente

Actualizar:

js/test/test-runner.html

Incorporar api.spec.js al runner Jasmine existente.

Mantener la versión actual de Jasmine y la carga mediante
módulos ES.

Conservar todas las suites existentes.

Revisar si los cambios de Alan requieren actualizar:

- js/test/script.spec.js.
- js/test/models.spec.js.

Modificar estos archivos únicamente si resulta necesario
por cambios reales en sus contratos o por pruebas de regresión.

Justificar cualquier modificación realizada.

No eliminar pruebas existentes para evitar errores.

## 6. Ejecución y verificación

Ejecutar la suite completa de Jasmine, incluyendo:

- api.spec.js.
- models.spec.js.
- script.spec.js.
- storage.spec.js.
- services.spec.js.

Utilizar el runner existente mediante un servidor HTTP local.

Registrar:

- Cantidad total de pruebas ejecutadas.
- Cantidad de pruebas aprobadas.
- Cantidad de pruebas fallidas.
- Resultados por suite, cuando estén disponibles.
- Errores encontrados.
- Casos cubiertos.
- Regresiones detectadas.

Evaluar la cobertura de líneas, ramas y casos borde mediante
evidencia disponible.

Si no existe una herramienta de cobertura cuantitativa,
aclarar esta limitación y no inventar porcentajes.

Si no es posible ejecutar Jasmine desde el entorno disponible,
indicarlo y proporcionar los pasos exactos para que pueda
realizar la ejecución manualmente desde Chrome.

No presentar pruebas no ejecutadas como aprobadas.

## 7. Reporte de problemas

Si se detectan errores en la implementación de Alan, preparar
un borrador de Issue por cada problema independiente.

Cada Issue deberá incluir:

- Título.
- Descripción.
- Archivo y método afectado.
- Commit evaluado.
- Pasos para reproducir.
- Resultado esperado.
- Resultado obtenido.
- Prueba Jasmine relacionada.
- Evidencia.
- Responsable sugerido: Desarrollador JS Asíncrono,
  cuando corresponda.
- Criterio de cierre.

Diferenciar los problemas nuevos de los hallazgos existentes
del Lighthouse Baseline:

- Issue #212.
- Issue #213.
- Issue #214.

No crear Issues duplicadas ni atribuir a Alan problemas
preexistentes sin evidencia.

## 8. Documentación

Actualizar:

js/test/testing-doc.md

Documentar:

- Objetivo de las pruebas Fetch/API.
- Archivos evaluados.
- Casos de prueba implementados.
- Herramientas utilizadas.
- Resultados reales de ejecución.
- Errores y regresiones encontrados.
- Limitaciones de testing.
- Evidencias disponibles.

Actualizar parcialmente el AT CLOSE de:

docs/03-specs/segundo-parcial/spec-tester-qa-segundo-parcial.md

Registrar:

- El prompt exacto utilizado para generar las pruebas.
- Los archivos realmente utilizados como contexto.
- El uso de GitHub Copilot Agent Mode.
- Las pruebas implementadas.
- Los resultados reales de Jasmine.
- Los ajustes manuales realizados, si corresponde.

Mantener intacta la planificación aprobada de BEFORE.

Conservar los resultados y evidencias originales del TC-11.

Si existen apartados pendientes de validación manual,
dejarlos expresamente como pendientes.

## 9. Restricciones

- Trabajar únicamente sobre mi rol de Tester QA/JS.
- No modificar la implementación funcional de Alan.
- No modificar archivos correspondientes a otros roles.
- No modificar la planificación aprobada del SPEC.
- No implementar library.spec.js todavía.
- No realizar pruebas de la librería externa.
- No ejecutar Lighthouse TC-12 todavía.
- No ejecutar Lighthouse TC-13.
- No alterar los resultados del TC-11.
- No resolver RC03.
- No cerrar las Issues #212, #213 y #214.
- No crear Issues automáticamente.
- No modificar el changelog.md todavía.
- No crear nuevas ramas.
- No realizar commits ni push.
- No crear Pull Requests.
- No inventar resultados ni evidencias.

## 10. Resultado esperado

Al finalizar, presentar un informe con:

1. Resumen de la implementación de Alan analizada.
2. Archivos y contratos identificados.
3. Archivos creados y modificados.
4. Pruebas implementadas en api.spec.js.
5. Casos exitosos, errores y casos borde cubiertos.
6. Resultados reales de ejecución de Jasmine.
7. Cobertura y limitaciones.
8. Problemas detectados y propuestas de Issues.
9. Actualizaciones realizadas en la documentación.
10. Pasos pendientes que requieren intervención manual.
```

No se redactó ni utilizó un prompt independiente adicional.
- Archivos utilizados como contexto: `plan.md`; este SPEC; `spec-dev-async-fetch.md`; `api/productos.json`; `js/api/apiService.js`; `js/services/ProcesadorCatalogo.js`; `js/script.js`; `js/test/test-runner.html`; `models.spec.js`, `script.spec.js`, `storage.spec.js`, `services.spec.js` y `testing-doc.md`; además `js/models/Producto.js`, `js/models/Catalogo.js`, `js/services/FachadaStorage.js`, `js/utils/storage.js`, `index.html` y `js/test/herramientas/cobertura-v8.js`.
- PR #217 está disponible y es ancestro de la rama activa: merge `ca9458f29d283e010c3fd2cafb5d931e3e70b1bb`. Se probó sobre `feature/tester-qa-js-testing-suite`, HEAD `5d6ba92`, con los cambios de QA de esta tarea.
- GitHub Copilot Agent Mode: **no utilizado**; el trabajo se realizó en Copilot SDK en VS Code, sin invocar Agent Mode.

### Resultados de Jasmine

- **Resultado principal:** reejecución del 27/11/2026 por HTTP con Playwright MCP y Chromium 158: **490 pruebas aprobadas, 0 fallidas, 0 pendientes**, semilla `28453`; incluye **22/22 pruebas de API** y 27/27 de SweetAlert2.
- Ejecución manual informada por el usuario: **489 aprobadas y 1 fallida**, semilla `61496`, servidor HTTP en puerto `8000`. La prueba «desde el carrito abierto: foco en Cancelar, Esc cierra solo el diálogo y el foco vuelve al botón» falló con `La condición no se cumplió a tiempo.`, en `script.spec.js:2111:41` y `script.spec.js:2567:13`. No se reprodujo posteriormente mediante Playwright MCP; la causa permanece **pendiente de determinar**.
- Corrida anterior con Jasmine 5.10.0, Chromium y Node 24.21.0: 490 pruebas ejecutadas, 490 aprobadas, 0 fallidas y 0 pendientes (semilla `47158`). Resultado por suite: `models.spec.js` 89/89; `script.spec.js` 140/140; `storage.spec.js` 189/189; `services.spec.js` 50/50; `api.spec.js` 22/22.
- Cobertura V8 anterior (medición aproximada de bloques): `apiService.js` 124/129 líneas (96,1 %), 11/11 funciones (100 %), 56/58 ramas (96,6 %); `ProcesadorCatalogo.js` 59/60 líneas (98,3 %), 18/18 funciones (100 %), 24/25 ramas (96,0 %). Total medido: 1935/1969 líneas (98,3 %), 257/258 funciones (99,6 %) y 725/738 ramas (98,2 %). El detalle y sus limitaciones se documentan en `js/test/testing-doc.md`.
- Cobertura de una corrida independiente con Playwright local, `node js/test/herramientas/cobertura-v8.js --detalle`, semilla `88737`: 490 specs, 0 failures. `apiService.js`: 124/129 líneas, 11/11 funciones, 57/59 ramas; `ProcesadorCatalogo.js`: 59/60 líneas, 18/18 funciones, 24/25 ramas. Total: 1935/1969 líneas, 257/258 funciones y 723/736 ramas. La cobertura de ramas de V8 es aproximada y puede variar entre corridas.
- Capturas: [resultado general](../../../js/test/capturas/captura-jasmine-segundo-parcial-2026-11-27.png), [22 pruebas de API](../../../js/test/capturas/captura-api-22-pruebas-2026-11-27.png), [27 pruebas de SweetAlert2](../../../js/test/capturas/captura-sweetalert2-2026-11-27.png) y [salida de cobertura V8](../../../js/test/capturas/captura-cobertura-v8-2026-11-27.png). Las dos vistas de suites proceden del reporte de la corrida completa, filtrado visualmente después de ejecutarla; la cobertura corresponde a la corrida independiente indicada.

### Resultados de Lighthouse

La auditoría TC-11 — Lighthouse Baseline se ejecutó manualmente mediante
Chrome DevTools el 26/11/2026 a las 13:37 GMT-3. Performance y Best Practices
no alcanzaron el umbral mínimo de 95 puntos.

Commit de referencia del Baseline, verificado en el historial del repositorio:
[`0aec81a3d836968ee2e585fcddf4fa03418e659e`](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/commit/0aec81a3d836968ee2e585fcddf4fa03418e659e).
Los detalles de configuración y las condiciones no recuperables están
documentados en [TC-11](../../04-testing/test-case-11-lighthouse-baseline.md).

| Categoría | Resultado |
|---|---:|
| Performance | 92 |
| Accessibility | 100 |
| Best Practices | 77 |
| SEO | 100 |

| Métrica | Resultado |
|---|---:|
| FCP | 0.5 s |
| LCP | 1.1 s |
| TBT | 0 ms |
| CLS | 0.148 |
| Speed Index | 0.5 s |

Documentación: [TC-11 — Lighthouse Baseline](../../04-testing/test-case-11-lighthouse-baseline.md).
Evidencias: [12 capturas de TC-11](../../04-testing/screenshots/tc-11/).

| Test case | Estado | Comparación |
|---|---|---|
| 12 — Post Fetch | Ejecutado manualmente el 27/11/2026, 00:56 GMT-3 | Comparado con TC-11; detalle abajo |
| 13 — Post Library | Pendiente | Frente a TC-12: pendiente |

#### TC-12 — Lighthouse Post Fetch

La auditoría se ejecutó manualmente en Chrome DevTools sobre
`http://127.0.0.1:8000/`, con `http-server` 14.1.1, Lighthouse 13.5.0,
Chromium 158.0.0.0, Navigation, Emulated Desktop, Custom throttling, Initial
page load y Single page session. Se utilizó un worktree independiente del
commit `ca9458f29d283e010c3fd2cafb5d931e3e70b1bb`, posterior a Fetch (#217)
y anterior a SweetAlert2.

Una verificación **posterior** comprobó el PID 35784 y su directorio en el
worktree, el HEAD, respuestas HTTP 200 para `index.html`, `apiService.js`,
`productos.json` y `script.js` coincidentes con el commit, la importación y
ejecución de `cargarCatalogo`, ausencia de referencias funcionales a
SweetAlert2 y HTTP 404 para `ServicioDialogos.js`. El `index.html` tenía un
objeto Git distinto del repositorio original y del Baseline. La verificación
posterior no acredita por sí sola el proceso durante la auditoría.

| Categoría | TC-11 | TC-12 | Diferencia |
|---|---:|---:|---:|
| Performance | 92 | 86 | -6 |
| Accessibility | 100 | 100 | 0 |
| Best Practices | 77 | 77 | 0 |
| SEO | 100 | 100 | 0 |

| Métrica | TC-11 | TC-12 | Diferencia |
|---|---:|---:|---:|
| FCP | 0.5 s | 0.5 s | 0 s |
| LCP | 1.1 s | 1.2 s | +0.1 s |
| TBT | 0 ms | 0 ms | 0 ms |
| CLS | 0.148 | 0.230 | +0.082 |
| Speed Index | 0.5 s | 0.5 s | 0 s |

Performance y Best Practices no cumplen ≥95; Accessibility y SEO sí. El
incremento de CLS es aproximadamente 55.4 %. Lighthouse identifica una
`section` con score 0.230 y recomienda `fetchpriority="high"` para la imagen
LCP. Reservar espacio para contenido dinámico y evaluar la prioridad de la
imagen son recomendaciones a investigar, no correcciones verificadas. Las
29 cookies y el issue Cookie de Google Maps ya estaban en TC-11. No se
estableció que Fetch causara las diferencias; una sola medición y los datos
de red/caché no conservados del Baseline limitan la comparación.

Análisis completo, Insights, Diagnostics y borradores de comentarios para
#212, #213 y #214: [TC-12 — Lighthouse Post Fetch](../../04-testing/test-case-12-lighthouse-post-fetch.md).
Evidencias originales:

1. [Puntuaciones](../../04-testing/screenshots/tc-12/01-lighthouse-scores.png).
2. [Métricas](../../04-testing/screenshots/tc-12/02-performance-metrics.png).
3. [Insights](../../04-testing/screenshots/tc-12/03-performance-insights.png).
4. [Diagnostics](../../04-testing/screenshots/tc-12/04-performance-diagnostics.png).
5. [Accessibility](../../04-testing/screenshots/tc-12/05-accessibility.png).
6. [Best Practices](../../04-testing/screenshots/tc-12/06-best-practices.png).
7. [SEO](../../04-testing/screenshots/tc-12/07-seo.png).
8. [Condiciones](../../04-testing/screenshots/tc-12/08-lighthouse-execution-conditions.png).
9. [Issue Cookie de Maps](../../04-testing/screenshots/tc-12/09-google-maps-devtools-issue.png).
10. [Cookies de Maps 1](../../04-testing/screenshots/tc-12/10-google-maps-cookies-1.png).
11. [Cookies de Maps 2](../../04-testing/screenshots/tc-12/11-google-maps-cookies-2.png).
12. [Cookies de Maps 3](../../04-testing/screenshots/tc-12/12-google-maps-cookies-3.png).
13. [Layout shift culprits](../../04-testing/screenshots/tc-12/13-layout-shift-culprits.png).
14. [LCP request discovery](../../04-testing/screenshots/tc-12/14-lcp-request-discovery.png).

### Issues reportadas

| Issue | Problema | Responsable | Estado |
|---|---|---|---|
| [#212](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/issues/212) | Performance inferior al umbral mínimo | @alandox1 — Desarrollador JS Asíncrono | Abierta; corrección y verificación pendientes |
| [#213](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/issues/213) | Desplazamientos visuales durante la carga (CLS) | @LuchoBarrionuevo13 — Tester QA/JS | Abierta; corrección y verificación pendientes |
| [#214](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/issues/214) | Best Practices y cookies de terceros de Google Maps | @Piastrellini — Desarrollador JS de Librerías Externas | Abierta; corrección y verificación pendientes |

Las tres Issues corresponden a problemas detectados durante el Baseline,
previo a la incorporación de Fetch y SweetAlert2, y siguen observándose en
TC-12. Según lo informado, las Issues fueron actualizadas con los resultados
de TC-12 y el coordinador definió los responsables de la tabla. Permanecen
abiertas, pendientes de corrección y verificación; RC03 permanece abierto.
Los borradores previos se conservan como referencia histórica en el TC-12.

Para el seguimiento de las Issues, usar como referencias el [commit del
Baseline](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/commit/0aec81a3d836968ee2e585fcddf4fa03418e659e),
el [TC-11](../../04-testing/test-case-11-lighthouse-baseline.md) y las
[12 capturas](../../04-testing/screenshots/tc-11/). En una revisión anterior
de #212, la tarea “Implementar las mejoras correspondientes” aparecía marcada
como completada sin evidencia de corrección; revisar si todavía corresponde
desmarcarla manualmente en GitHub.

### Ajustes manuales a las pruebas generadas mediante IA

- No se generaron pruebas mediante GitHub Copilot Agent Mode; el código de pruebas fue elaborado y ajustado directamente en esta interacción.
- `FachadaStorage` es inmutable; los primeros intentos de espiar sus métodos fallaron por esa característica. Se ajustaron las pruebas para usar la fachada real y Web Storage aislado/restaurado, sin cambiar la implementación funcional.
- Se amplió `js/test/herramientas/cobertura-v8.js` para incluir `js/api/`, de modo que la cobertura incluya `apiService.js`. `script.spec.js` y `models.spec.js` no requirieron cambios; sus suites se conservaron y aprobaron.

### Pendientes para completar AT CLOSE

- TC-13 y su comparación con TC-12 permanecen pendientes.
- Implementar y probar `library.spec.js` en la etapa correspondiente.
- Investigar la causa del fallo manual de SweetAlert2 con las condiciones
  restantes de esa ejecución y, si están disponibles, su captura y consola.
- Corrección y verificación de las Issues #212, #213 y #214.
- Mantener RC03 abierto hasta que el equipo indique su resolución.
