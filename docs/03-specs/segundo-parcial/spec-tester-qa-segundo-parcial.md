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
| 11 — Baseline inicial | Antes de integrar las nuevas funcionalidades. | Punto de referencia inicial. |
| 12 — Post Fetch | Después de integrar la funcionalidad asíncrona en `develop`. | Comparar con el baseline del TC-11. |
| 13 — Post Library | Después de integrar la librería externa en `develop`. | Comparar con el post-fetch del TC-12. |

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
`docs/04-testing/screenshots/`. En TC-12 y TC-13 registrar las diferencias de
puntajes y métricas respecto del momento anterior, identificar mejoras o
regresiones y aclarar las limitaciones cuando las condiciones no permitan una
comparación directa. Coordinar y verificar las correcciones necesarias ante
hallazgos o puntajes inferiores a los umbrales.

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
   su implementación para pruebas. Realizar el TC-11 antes de integrar las
   nuevas funcionalidades.
3. Coordinar con el **Desarrollador JS Librerías Externas** la librería elegida,
   inicialización, configuración, comportamiento, errores y puntos de
   integración, así como su disponibilidad para pruebas.
4. Coordinar con el **Coordinador/DevOps** el orden de integración en
   `develop`, las condiciones reproducibles de auditoría, la carga de los
   nuevos specs en el runner y el seguimiento de Issues y PR. Ejecutar TC-12
   después del merge de Fetch y TC-13 después del merge de la librería.
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

- [ ] Este SPEC está commiteado antes de implementar cualquier prueba o
      ejecutar Lighthouse.
- [ ] `api.spec.js` verifica éxito, error HTTP, error de red y procesamiento
      con `map`, `filter` y `reduce`; incluye DOM si corresponde.
- [ ] `library.spec.js` verifica inicialización, configuración, funcionalidad
      principal, errores e interacción con el sistema según la librería elegida.
- [ ] Los nuevos specs se ejecutan en el runner Jasmine; la suite existente
      sigue pasando y `script.spec.js` y `models.spec.js` se actualizan si
      corresponde, manteniendo o mejorando la cobertura existente.
- [ ] TC-11 se realizó antes de las integraciones; TC-12 después de Fetch en
      `develop`; TC-13 después de la librería en `develop`.
- [ ] Cada auditoría registra las cuatro puntuaciones, FCP, LCP, TBT, CLS,
      Speed Index, condiciones de medición, problemas y capturas.
- [ ] En cada auditoría Performance, Accessibility, Best Practices y SEO
      alcanzan al menos 95 puntos; los resultados y correcciones están
      respaldados por evidencia.
- [ ] TC-12 compara sus resultados con TC-11 y TC-13 con TC-12, indicando
      diferencias y posibles limitaciones de comparabilidad.
- [ ] Todos los problemas encontrados están reportados en Issues detalladas,
      asignadas al responsable correspondiente, con estado y verificación.
- [ ] Los documentos de testing, test cases, capturas y `changelog.md` están
      actualizados y AT CLOSE refleja exclusivamente lo realizado.
- [ ] El trabajo se desarrolla en `feature/tester-qa-js-testing-suite` y su PR
      tiene como destino `develop`.

---

## AT CLOSE — Se completa al cerrar la tarea (evidencia)

> Pendiente. Registrar únicamente lo efectivamente realizado, sin anticipar
> resultados ni inventar evidencias.

### Prompt exacto y contexto

- Prompt exacto utilizado para generar las pruebas: **pendiente**.
- Archivos utilizados como contexto: **pendiente**.
- Herramienta utilizada y eventuales diferencias respecto del plan: **pendiente**.

### Resultados de Jasmine

- Cantidad de pruebas aprobadas: **pendiente**.
- Cantidad de pruebas fallidas: **pendiente**.
- Ejecución, cobertura y evidencias: **pendiente**.

### Resultados de Lighthouse

| Test case | Puntajes y métricas | Comparación | Capturas |
|---|---|---|---|
| 11 — Baseline | Pendiente | Referencia inicial | Pendiente |
| 12 — Post Fetch | Pendiente | Frente a TC-11: pendiente | Pendiente |
| 13 — Post Library | Pendiente | Frente a TC-12: pendiente | Pendiente |

### Issues reportadas

| Issue | Problema | Responsable | Estado de resolución y verificación |
|---|---|---|---|
| Pendiente | Pendiente | Pendiente | Pendiente |

### Ajustes manuales a las pruebas generadas mediante IA

**Pendiente:** describir los ajustes realizados y su motivo.
