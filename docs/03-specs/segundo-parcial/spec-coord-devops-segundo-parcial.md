# Spec: Coordinación, integración y resolución de correcciones del Segundo Parcial

**Rol:** Coordinador/DevOps  
**Se traza contra:** `plan.md` — consigna del Segundo Parcial, secciones 2.1, 2.2, 3, 4.1 a 4.4, 5, 6 y 7; especificaciones de los roles participantes.  
**Entrega:** Segundo Parcial — FerroLab

## BEFORE

## Qué se va a hacer

Se coordinará la revisión, aprobación e integración de las Pull Requests (PRs) de los integrantes del equipo, verificando el cumplimiento de las responsabilidades de cada rol, sus especificaciones y los criterios de evaluación de la consigna.

Se verificará la resolución de las correcciones de las Actividades Obligatorias N.º 4. Las correcciones pendientes de la cuarta entrega se gestionarán sobre `release/cuarta-entrega` mediante PRs de ramas `fix/`. Una vez obtenido el LGTM y Approve del docente, se realizará el merge a `master` y el backport hacia `develop`, estableciendo la base del Segundo Parcial.

Se utilizará GitHub Copilot en modo Agente para asistir en las code reviews de al menos cuatro PRs de los demás integrantes, documentando los prompts, el contexto, las observaciones inline y los resultados de las revisiones.

Se coordinará el orden de integración de Fetch y la librería externa para permitir las tres auditorías Lighthouse, se administrarán las issues mediante GitHub Projects, se actualizarán `README.md` y `changelog.md`, se preparará `release/segundo-parcial` y se gestionarán los Request Changes del docente hasta la aprobación definitiva, la publicación del release y el backport final.

## Por qué

El consumo asíncrono de datos, la incorporación de una librería externa y el testing avanzado requieren una coordinación que preserve la arquitectura existente y permita identificar errores, incumplimientos y regresiones antes de integrar los cambios.

La integración progresiva permitirá comparar el estado inicial del proyecto con el estado posterior a Fetch y a la librería externa. La revisión asistida por IA permitirá contrastar sistemáticamente los cambios con la consigna, los specs y los contratos existentes, sin reemplazar la revisión manual del Coordinador.

La trazabilidad mediante issues, commits, PRs, specs y changelog permitirá identificar las contribuciones individuales, las correcciones realizadas y las evidencias de cumplimiento.

## Plan de coordinación y Pull Requests esperadas

### 1. Desarrollador JS Asíncrono - Fetch & APIs

**Rama:** `feature/dev-async-fetch-api`  
**Destino:** `develop`  
**Spec:** `docs/03-specs/segundo-parcial/spec-dev-async-fetch.md`

#### Qué se espera de la PR

Implementación del consumo asíncrono mediante Fetch API y promesas, utilizando una API externa o un archivo JSON estático debidamente justificado. Los datos deberán procesarse, validarse e integrarse con el DOM y las clases del dominio, contemplando los estados de carga y los errores, sin alterar innecesariamente las responsabilidades de los módulos existentes.

#### Archivos esperados

- `js/api/apiService.js`.
- `api/productos.json` o archivo equivalente, si se selecciona JSON estático.
- `js/script.js`, `index.html`, estilos, clases de `js/models/` y `js/utils/storage.js`, únicamente según las necesidades justificadas de integración.
- `docs/03-specs/segundo-parcial/spec-dev-async-fetch.md`.
- `changelog.md`.

#### Criterios de revisión y aprobación — Planificación
- [X] El BEFORE del spec se encuentra commiteado antes de escribir código e incluye la selección y justificación de la fuente de datos, el diseño de los estados de carga, las funciones de orden superior previstas y los criterios de aceptación.
- [X] El BEFORE define la estructura y responsabilidades de apiService.js, la estrategia de gestión de errores, reintentos y fallbacks, la validación y sanitización de datos, y la integración con el DOM, POO y Storage, respetando las responsabilidades de js/script.js como controlador.
- [X] Se planifican los casos de prueba en coordinación con el Tester QA y las verificaciones necesarias para evitar regresiones en los cuatro flujos existentes.
#### Criterios de revisión y aprobación
- [X] Se implementa el consumo asíncrono de datos mediante `fetch()` y promesas.
- [X] Se verifica el estado de la respuesta HTTP y se procesa correctamente el JSON.
- [X] Se implementa `try-catch` para gestionar los errores de las operaciones asíncronas, incluyendo errores HTTP y de red.
- [X] Se muestran estados visuales `loading`, `success` y `error` en la interfaz.
- [X] Se presentan mensajes de error comprensibles para el usuario.
- [X] Se implementan reintentos o fallbacks cuando corresponda, o se justifica por qué no son necesarios.
- [X] Se utilizan `map()`, `filter()` y `reduce()` para transformar, filtrar y agregar o calcular datos respectivamente, con un propósito coherente con la implementación.
- [X] Los datos recibidos se validan y sanitizan antes de ser utilizados.
- [X] Los datos obtenidos se integran dinámicamente con el DOM.
- [X] El consumo de datos se encuentra encapsulado en un módulo dedicado.
- [X] Se respetan los contratos de las clases POO existentes y se coordina la persistencia con Storage cuando resulte necesaria.
- [X] `js/script.js` conserva exclusivamente sus responsabilidades de controlador, eventos, DOM y orquestación; no duplica reglas de negocio ni incorpora detalles de persistencia o consumo de API.
- [X] Los cuatro flujos existentes de FerroLab mantienen su funcionamiento: búsqueda y filtrado, carrito, pago y cuotas, y resumen y confirmación del pedido.
- [X] Se incorporan comentarios JSDoc en los módulos nuevos y funciones complejas.
- [X] Se coordinan con el Tester QA los casos de prueba de las funciones asíncronas.
- [X] Se responden las issues reportadas por QA y se documenta su resolución.
- [X] El AT CLOSE del spec contiene el prompt exacto utilizado, los ajustes manuales realizados, el resumen de integración con POO y Storage, y las issues respondidas con su resolución.
- [X] Se cumplen los criterios generales de aprobación y se actualiza el changelog.

### 2. Desarrollador JS Librerías Externas

**Rama:** `feature/dev-libreria-externa-[nombre]`  
**Destino:** `develop`  
**Spec:** `docs/03-specs/segundo-parcial/spec-dev-libreria-externa.md`

#### Qué se espera de la PR

Selección e integración mediante CDN de al menos una librería externa de JavaScript que resuelva una necesidad específica del proyecto no cubierta por código propio. La librería deberá utilizarse en al menos dos puntos diferentes de la aplicación, aportar una mejora a la experiencia del usuario y respetar el diseño y la arquitectura existentes.

#### Archivos esperados

- `index.html`, para incorporar el CDN.
- `js/script.js` y archivos de estilos, según las necesidades justificadas de integración.
- Módulo wrapper, si corresponde.
- `docs/07-librerias/libreria-doc.md`.
- `docs/07-librerias/screenshots/`.
- `docs/03-specs/segundo-parcial/spec-dev-libreria-externa.md`.
- `changelog.md`.

#### Criterios de revisión y aprobación — Planificación
- [X] El BEFORE del spec se encuentra commiteado antes de integrar la librería e incluye la necesidad, justificación, nombre, versión, CDN, al menos dos puntos de integración, decisiones de arquitectura, consistencia visual y criterios de aceptación.
- [X] El BEFORE define la estrategia de integración y configuración de la librería, la necesidad de un módulo wrapper, la compatibilidad con Bootstrap y los módulos existentes, respetando las responsabilidades de js/script.js como controlador.
- [X] Se planifican los casos de prueba en coordinación con el Tester QA, las verificaciones necesarias para evitar regresiones en los cuatro flujos existentes y la coordinación con el Desarrollador JS Asíncrono cuando corresponda.
#### Criterios de revisión y aprobación
- [X] La necesidad que justifica la librería se encuentra identificada y documentada.
- [X] La librería aporta una funcionalidad no resuelta mediante código propio; no se limita a sustituir una funcionalidad existente.
- [X] Se identifica el nombre y la versión utilizada.
- [X] La integración se realiza correctamente mediante CDN y la configuración respeta la documentación oficial.
- [X] Se justifica la decisión de implementar o no un módulo wrapper y se incorpora cuando resulte necesario.
- [X] La librería funciona en al menos dos puntos diferentes de la aplicación.
- [X] La funcionalidad incorporada mejora la experiencia del usuario y mantiene la consistencia visual con FerroLab.
- [X] No se incorpora lógica de negocio dentro de `js/script.js` ni se duplican responsabilidades del dominio.
- [X] No se introducen incompatibilidades con Bootstrap o los módulos existentes ni regresiones en los cuatro flujos.
- [X] `libreria-doc.md` contiene nombre, versión, propósito, beneficios, justificación técnica, instalación e integración, ejemplos de uso y enlaces a la documentación oficial.
- [X] Se incluyen capturas de pantalla de los puntos de integración.
- [X] Se coordina con el Tester QA la validación de la librería y con el Desarrollador JS Asíncrono cuando la librería interactúe con datos de la API.
- [X] Se responden las issues relacionadas con el funcionamiento de la librería.
- [X] El AT CLOSE contiene el prompt exacto utilizado en Copilot Agent en bloque de código, un fragmento de la integración final, los ajustes manuales, los dos puntos de uso y cómo mejoran la experiencia del usuario, la coordinación con Fetch si corresponde y las issues respondidas.
- [X] Se cumplen los criterios generales de aprobación y se actualiza el changelog.

### 3. Tester QA/JS - Testing Avanzado

**Rama principal:** `feature/tester-qa-js-testing-suite`  
**Rama adicional propuesta:** `feature/tester-qa-js-lighthouse-baseline`  
**Destino:** `develop`  
**Spec:** `docs/03-specs/segundo-parcial/spec-tester-qa-segundo-parcial.md`

#### Qué se espera de las PRs

Implementación de las suites de Jasmine para Fetch y la librería externa, actualización de las pruebas existentes cuando corresponda, ejecución y documentación de las tres auditorías Lighthouse en los momentos establecidos, y gestión de las issues detectadas durante el testing.

#### Archivos esperados

- `js/test/api.spec.js`.
- `js/test/library.spec.js`.
- `js/test/test-runner.html`, si requiere adaptación para ejecutar las nuevas suites.
- `js/test/script.spec.js` y `js/test/models.spec.js`, si requieren actualización.
- `js/test/testing-doc.md`.
- `docs/04-testing/test-case-11-lighthouse-baseline.md`.
- `docs/04-testing/test-case-12-lighthouse-post-fetch.md`.
- `docs/04-testing/test-case-13-lighthouse-post-library.md`.
- `docs/04-testing/testing-doc.md`.
- `docs/04-testing/screenshots/`.
- `docs/03-specs/segundo-parcial/spec-tester-qa-segundo-parcial.md`.
- `changelog.md`.

#### Criterios de revisión y aprobación — Planificación

- [X] El BEFORE del spec se encuentra commiteado antes de escribir tests o ejecutar Lighthouse.
- [X] Se definen los casos de prueba de Fetch y de la librería externa, los tres momentos de auditoría, los umbrales mínimos, las herramientas a utilizar y su justificación, y los criterios de aceptación.

#### Criterios de revisión y aprobación — Jasmine

- [X] `api.spec.js` contiene pruebas de respuesta exitosa, error HTTP y error de red.
- [X] Se verifica el procesamiento de datos mediante `map()`, `filter()` y `reduce()`.
- [X] Se prueba la integración de los datos con el DOM cuando corresponde.
- [X] `library.spec.js` contiene pruebas de inicialización, configuración correcta, funcionalidad principal, manejo de errores e interacción con otras partes del sistema.
- [X] Las pruebas verifican comportamientos reales de los módulos y no dependen innecesariamente de servicios externos; se utilizan mocks o spies cuando corresponde.
- [X] Las nuevas suites se ejecutan correctamente mediante el runner de Jasmine.
- [X] Se refactoriza `script.spec.js` si resulta necesario y se actualiza `models.spec.js` si se modifican las clases POO.
- [X] Se mantiene o mejora la cobertura de testing y se verifica que no se introduzcan regresiones en las pruebas existentes.
- [X] Se documentan los resultados reales de ejecución, incluyendo la cantidad de tests exitosos y fallidos.

#### Criterios de revisión y aprobación — Lighthouse

- [X] El Test Case 11 (Baseline) se ejecuta sobre `develop` después del backport de la cuarta entrega y antes de incorporar las nuevas funcionalidades.
- [X] El Test Case 12 (Post-Fetch) se ejecuta después de integrar Fetch en `develop` y antes de integrar la librería externa.
- [X] El Test Case 13 (Post-Librería) se ejecuta después de integrar la librería externa en `develop`.
- [X] Se establecen umbrales mínimos de 95 puntos para Performance, Accessibility, Best Practices y SEO.
- [X] Cada auditoría identifica la fecha, URL evaluada, rama, navegador y versión; se registra también el commit evaluado y se mantienen condiciones de medición comparables como criterio adicional de coordinación.
- [X] Se documentan los puntajes de las cuatro categorías y las métricas de Performance: First Contentful Paint (FCP), Largest Contentful Paint (LCP), Total Blocking Time (TBT), Cumulative Layout Shift (CLS) y Speed Index.
- [X] Se documentan los problemas y observaciones de Accessibility, Best Practices y SEO.
- [X] El Test Case 12 compara sus resultados con el baseline, analiza el impacto de Fetch y documenta las recomendaciones de optimización.
- [X] El Test Case 13 compara sus resultados con el estado post-fetch, presenta la evolución completa y analiza el impacto de la librería con recomendaciones finales.
- [X] Se adjuntan capturas de pantalla correspondientes a los tres momentos de ejecución.
- [X] Los resultados inferiores a los umbrales se documentan sin alterar las mediciones y generan issues de mejora; se verifica su resolución según corresponda.

#### Criterios de revisión y aprobación — Issues, documentación y cierre

- [X] Se crean issues detalladas para todos los problemas detectados en las pruebas y auditorías y se asignan a los roles correspondientes.
- [X] Se coordina con el Coordinador/DevOps la priorización de las correcciones y con los desarrolladores la definición y validación de los casos de prueba.
- [X] Se verifica y documenta el estado de resolución de las issues.
- [X] Se actualiza `js/test/testing-doc.md` y `docs/04-testing/testing-doc.md`, incluyendo los enlaces a los nuevos test cases.
- [X] El AT CLOSE contiene el prompt exacto utilizado para generar los tests en bloque de código y los archivos adjuntados como contexto, cuando se utilice IA; si no se utiliza, se documenta la decisión conforme a la planificación.
- [X] El AT CLOSE contiene los resultados de los tests (exitosos y fallidos), las capturas de las tres auditorías, la cantidad de issues reportadas, sus responsables y estados de resolución, y los ajustes manuales sobre los tests generados con IA cuando corresponda.
- [X] Se cumplen los criterios generales de aprobación y se actualiza el changelog.

## Cantidad de Pull Requests y orden de integración

Se revisarán como mínimo cuatro PRs de los demás integrantes mediante GitHub Copilot en modo Agente. Para alcanzar este mínimo y respetar las dependencias de Lighthouse, se propone dividir los entregables del Tester QA en dos PRs diferenciadas.

| Orden | Rol | PR esperada | Condición de integración |
|---|---|---|---|
| 1 | Tester QA/JS | Plan de testing y auditoría Lighthouse inicial | Baseline ejecutado y documentado sobre develop con la base corregida de la AO4, antes de incorporar las nuevas funcionalidades. |
| 2 | Desarrollador JS Asíncrono | Consumo asíncrono con Fetch e integración de datos | Baseline registrado; implementación revisada, probada y aprobada por el Coordinador/DevOps. |
| 3 | Desarrollador JS Librerías Externas | Integración y documentación de la librería | Fetch integrado en develop; auditoría post-fetch ejecutada y documentada; implementación de la librería revisada y validada. |
| 4 | Tester QA/JS | Suites Jasmine, auditorías posteriores y documentación final | Librería integrada; auditoría post-librería ejecutada; pruebas automatizadas y de regresión realizadas; resultados documentados. |
| 5 | Coordinador/DevOps | Actualización de documentación y cierre de integración | PRs de todos los roles integradas, criterios de aceptación verificados, README y changelog actualizados y documentación consolidada. |

La PR inicial del Tester QA/JS deberá incluir el plan de testing, la auditoría Lighthouse baseline, sus evidencias y las issues correspondientes a los problemas detectados. No estará obligada a incluir las suites o auditorías que dependan de las implementaciones posteriores. Cada PR se evaluará según su alcance y los criterios que correspondan a su etapa, sin omitir requisitos en el cierre del rol.

El Desarrollador JS Asíncrono y el Desarrollador JS Librerías Externas podrán trabajar en paralelo si sus implementaciones son independientes, pero sus merges deberán respetar la secuencia de auditorías. Se coordinará la ejecución y documentación del Test Case 12 inmediatamente después de integrar Fetch en develop y antes de integrar la librería externa.

Las PRs adicionales deberán contener aportes diferenciados, relevantes y asociados a issues. El número mínimo de cuatro reviews asistidas por IA se contabilizará sobre PRs distintas de otros integrantes, no sobre la cantidad de rondas de revisión de una misma PR.

La PR `feature/coord-devops-segundo-parcial` hacia `develop` podrá abrirse desde el inicio para registrar el spec BEFORE y los avances de coordinación. Su integración definitiva se realizará una vez integradas las PRs de los demás roles, previa revisión y aprobación por otro integrante del equipo.

Se completarán las evidencias de coordinación disponibles antes de preparar la rama `release/segundo-parcial`. Las evidencias posteriores se incorporarán de manera trazable mediante las PRs correspondientes, respetando el flujo de corrección, revisión y aprobación establecido.

## Formato y requisitos generales de las Pull Requests

Cada PR utilizará la plantilla de feature branches existente en `.github/PULL_REQUEST_TEMPLATE/feature-template.md`, adaptada al Segundo Parcial.

Deberá identificar al integrante y su rol, la rama, la descripción del trabajo, los archivos creados o modificados, la issue asociada, el spec correspondiente, los criterios de aceptación aplicables, las pruebas realizadas, las limitaciones o dependencias pendientes y la actualización del changelog.

### Criterios generales de aprobación

- [X] La rama utiliza el prefijo `feature/` y nomenclatura kebab-case conforme al rol y la tarea.
- [X] Existe al menos una issue asociada a la tarea y un commit relevante del integrante en su PR.
- [X] Se utiliza la plantilla correspondiente y la PR tiene como destino `develop`.
- [X] El BEFORE del spec se encuentra commiteado antes de comenzar las tareas y el AT CLOSE se completa con las evidencias reales al finalizar el rol.
- [X] Los cambios respetan el alcance del rol y cualquier modificación adicional se encuentra justificada.
- [X] Los archivos respetan las convenciones de nomenclatura y la estructura del proyecto.
- [X] No se incorporan `console.log` innecesarios ni código comentado sin justificación.
- [X] Las funciones complejas y módulos nuevos cuentan con comentarios JSDoc.
- [X] El código funciona y no introduce errores críticos ni regresiones en las funcionalidades existentes.
- [ ] La documentación se encuentra actualizada y coincide con la implementación.
- [ ] Se verifica la trazabilidad entre issue, commits, spec, PR y `changelog.md`, incluyendo los enlaces correspondientes una vez disponibles.
- [ ] La rama se encuentra actualizada respecto de `develop` y no presenta conflictos pendientes.
- [X] La PR cuenta con code review asistida con IA, revisión manual y aprobación antes de realizar el Rebase and merge a `develop`, respetando la protección de ramas.

## Proceso de code review

Se utilizará GitHub Copilot en modo Agente para asistir en las revisiones, adjuntando como contexto la consigna del Segundo Parcial, `plan.md`, el spec del rol evaluado, el presente spec, el diff respecto de la rama de destino, los archivos modificados y los módulos o documentación relacionados cuando corresponda.

Se solicitará verificar los requisitos del rol, los criterios de aceptación aplicables, los errores funcionales, problemas de arquitectura, regresiones y documentación faltante. La revisión se limitará al alcance de la PR, sin realizar modificaciones automáticas en el código de otros integrantes.

El Coordinador contrastará manualmente las observaciones de IA con los archivos y la consigna. Los incumplimientos confirmados se registrarán mediante comentarios inline en las líneas correspondientes del diff y se solicitarán Request Changes cuando corresponda. La aprobación se realizará después de verificar las correcciones y los criterios aplicables. No se generarán observaciones artificiales para alcanzar el mínimo de revisiones.

Se registrará por cada PR el prompt exacto utilizado y la respuesta dada por copilot en bloque de código.

Se conservarán los prompts originales utilizados en cada code review, junto con capturas, con el objetivo de garantizar la trazabilidad y transparencia del proceso de revisión de las Pull Requests.

## Decisiones de coordinación y arquitectura

- **Separación de responsabilidades:** `js/script.js` conservará exclusivamente eventos, DOM y orquestación; las reglas de negocio permanecerán en `js/models/`, la persistencia en `js/utils/storage.js` y el consumo asíncrono en un módulo dedicado. La integración de la librería se encapsulará cuando resulte necesario.
- **Integración progresiva:** se respetarán los tres momentos de Lighthouse; se coordinará una URL de GitHub Pages que corresponda al estado evaluado, verificando el despliegue antes de cada auditoría y dejando la configuración final en `release/segundo-parcial`.
- **Prevención de conflictos:** se coordinarán las modificaciones de `js/script.js`, `index.html`, estilos y `changelog.md` entre los roles que los compartan.
- **Protección de ramas:** `develop` y `master` permanecerán protegidas; no se omitirán las PRs ni las aprobaciones correspondientes.
- **Trazabilidad:** se registrarán las contribuciones individuales de las ramas feature en `Added` y correcciones con enlaces a PRs e issues; las correcciones de release se documentarán en `[Fixed]`.
- **Estructura:** se mantendrán los nuevos specs en `docs/03-specs/segundo-parcial/`, las auditorías en `docs/04-testing/` y la documentación de librerías en `docs/07-librerias/`, siguiendo la estructura final del apartado 5.1 de la consigna.
- **Umbrales:** se utilizará ≥95 en Performance, Accessibility, Best Practices y SEO, conforme al apartado 4.3, por encima de los valores ilustrativos inferiores del ejemplo de auditoría.
- **Storage:** se coordinarán los ajustes necesarios con los responsables de la implementación existente; el parcial no contempla un rol Storage independiente.
- **Responsabilidades:** el Coordinador revisará y gestionará las implementaciones de los demás roles sin asumirlas automáticamente; las reasignaciones formales se documentarán conforme a la consigna.

## Gestión de correcciones de las Actividades Obligatorias N.º 4

Se verificará que las correcciones de la actividad que se encuentren resueltas e incorporadas en la base del proyecto. Para la Actividad Obligatoria N.º 4 se utilizará la rama existente `release/cuarta-entrega`, correspondiente a la release anterior de FerroLab.

1. Revisar los Request Changes del docente y verificar o crear las issues correspondientes.
2. Coordinar las correcciones mediante ramas `fix/` y PRs hacia `release/cuarta-entrega`, registrándolas en `[Fixed]` del changelog.
3. Notificar al docente en el hilo de Slack con ✅ (`:white_check_mark:`) cuando se hayan resuelto todos los comentarios.
4. Obtener el LGTM y Approve del docente antes de integrar la release a `master`.
5. Realizar el merge y notificarlo mediante `:pr-merged:` en Slack.
6. Crear `backport/release-actividad-obligatoria-4` desde `master` actualizado, abrir una PR hacia `develop` y obtener la aprobación de otro integrante antes del merge.
7. Verificar que `develop` incorpore las correcciones aprobadas y constituya la base del Segundo Parcial.

## Gestión del equipo y preparación de la entrega

Se administrarán las issues mediante GitHub Projects (Kanban), identificando responsables, prioridades, estados y bloqueos. Se coordinarán reuniones y, cuando resulte necesario, reuniones de emergencia para resolver impedimentos que comprometan la entrega. Se documentarán las contingencias reales en el changelog.

Se verificará que el repositorio utilizado durante la cursada permanezca público y que el docente `MVelasquez98` y todos los integrantes del equipo cuenten con las invitaciones o accesos correspondientes como colaboradores.

Se actualizará `README.md` con la descripción de las funcionalidades del Segundo Parcial, las instrucciones de instalación y uso, las tecnologías y librerías utilizadas y los enlaces a la documentación. Se verificará que `changelog.md` registre las contribuciones de cada integrante, sus PRs e issues y las correcciones realizadas. Se mantendrán la estructura de carpetas y las plantillas de PR correspondientes.

Una vez integradas las implementaciones y las evidencias disponibles en `develop`, se creará `release/segundo-parcial` y se configurará GitHub Pages sobre esta rama, verificando su funcionamiento.

Se abrirá la PR de `release/segundo-parcial` hacia `master` utilizando `.github/PULL_REQUEST_TEMPLATE/release-template.md` adaptado al parcial, con el título:

`[GRUPO N°5][Segundo Parcial] Entrega de la actividad`

La entrega inicial deberá realizarse antes del **27 de noviembre de 2026 a las 23:55 hs**. El Coordinador publicará la PR en `#2026-2do-cuat-pw1` de Slack, mencionando en el hilo a `@Matias Velasquez` y a todos los integrantes. Cada integrante deberá subir individualmente el mismo enlace de la PR de release al campus virtual, incluido el Coordinador. No se realizará el merge a `master` hasta obtener la aprobación formal del docente.

## Plan de la Fase 2 — Resolución de Request Changes

El período de correcciones se extenderá desde la devolución del docente hasta el **30 de noviembre de 2026 a las 22:00 hs**.

Se analizará cada Request Change de la PR de release y se creará una issue específica que identifique la observación, los archivos afectados, el responsable, la prioridad y los criterios de aceptación de la corrección.

| Prioridad | Criterio |
|---|---|
| Crítica | Errores que impiden la ejecución, la entrega o el cumplimiento de requisitos fundamentales. |
| Alta | Incumplimientos funcionales, problemas de arquitectura o pruebas obligatorias faltantes. |
| Media | Problemas de documentación, mantenibilidad o implementación que no bloquean los flujos principales. |
| Baja | Ajustes menores de presentación, nomenclatura u organización. |

La prioridad determinará el orden de resolución, pero no excluirá ninguna corrección solicitada por el docente.

1. Asignar las issues al rol correspondiente y gestionar su seguimiento en GitHub Projects.
2. Aplicar las correcciones mediante ramas `fix/` con PR hacia `release/segundo-parcial`, commits descriptivos y registro en `[Fixed]` de `changelog.md`.
3. Revisar las correcciones, verificar el cumplimiento de los criterios de aceptación y documentar la resolución de las issues.
4. Si el docente dispone una reasignación formal por baja participación o incidencias, documentar la decisión, fecha, justificación y responsable en la PR de release, notificar al equipo y registrar la contingencia en el changelog. La reasignación no modificará el plazo general.
5. Notificar al docente en el hilo de Slack con ✅ (`:white_check_mark:`) cuando se resuelvan las observaciones de cada ronda, manteniendo la comunicación durante el proceso.
6. Repetir el proceso hasta resolver todos los Request Changes y obtener el LGTM y Approve definitivo antes de la fecha límite.
7. Realizar el merge de `release/segundo-parcial` a `master` y notificarlo con `:pr-merged:`.
8. Crear y publicar el tag y release `v2.0-segundo-parcial` sobre la versión aprobada, incorporando el extracto correspondiente de `changelog.md`.
9. Realizar el backport final hacia `develop` mediante `backport/release-segundo-parcial`, con revisión y aprobación de otro integrante, y notificar en el hilo de Slack con `:pr-merged:` y el mensaje «BACKPORT completado».
10. Verificar que las issues resueltas se encuentren cerradas y con sus resoluciones documentadas.

### Condición crítica de aprobación

El Coordinador/DevOps será responsable de garantizar la resolución de la totalidad de los Request Changes y obtener el LGTM y Approve del docente antes del 30 de noviembre de 2026 a las 22:00 hs. No obtener dicha aprobación dentro del plazo implicará la desaprobación del Segundo Parcial para este rol y la instancia de recuperatorio, independientemente del puntaje de la Fase 1 y de la calificación del resto del equipo.

## Criterios de aceptación

### Fase 1 — Coordinación y desarrollo

- [X] Dadas las correcciones de AO3 y AO4, cuando se establece la base del parcial, entonces se verifica que se encuentren resueltas, incorporadas y documentadas.
- [X] Dada la cuarta entrega, cuando se obtiene el LGTM y Approve, entonces se realiza el merge a `master` y el backport aprobado hacia `develop`.
- [X] Dado cada integrante, cuando comienza sus tareas, entonces cuenta con la issue, rama y spec correspondiente commiteado previamente.
- [X] Dadas las PRs del equipo, cuando se realiza su revisión, entonces se verifican los criterios generales y específicos aplicables a cada rol.
- [X] Dadas las PRs de los demás integrantes, cuando se realiza la coordinación, entonces se documentan al menos cuatro PRs distintas revisadas mediante IA, con prompts.
- [X] Dado un incumplimiento confirmado, cuando se revisa la PR, entonces se realizan comentarios inline y se solicitan Request Changes cuando corresponde.
- [X] Dada una PR con Request Changes, cuando vuelve a revisión, entonces se verifica su resolución antes de aprobarla.
- [X] Dadas las nuevas funcionalidades, cuando se integran en `develop`, entonces se respeta el orden de las tres auditorías Lighthouse. (  **Cumplimiento parcial:** la rama correspondiente a la librería
  externa se integró antes de ejecutar el TC-12 (Post Fetch).
  Para preservar la evaluación de cada etapa, se realizaron las
  auditorías sobre los estados correspondientes del repositorio.
  La desviación del orden de integración y las medidas adoptadas
  se encuentran documentadas en el spec del Desarrollador JS
  Librerías Externas y en el hallazgo F02 de su PR.)
- [X] Dadas las tareas del equipo, cuando se consulta GitHub Projects, entonces se identifican responsables, prioridades y estados.
- [X] Dadas las contribuciones individuales, cuando se revisa el changelog, entonces se encuentran sus aportes y enlaces a PRs e issues.
- [X] Dado el repositorio, cuando se prepara la entrega, entonces se verifica su visibilidad pública, colaboradores, estructura, protección de ramas y plantillas.
- [X] Dada la finalización del desarrollo, cuando se prepara la release, entonces `README.md` y `changelog.md` se encuentran actualizados.
- [X] Dada la PR propia del Coordinador, cuando se integra a `develop`, entonces cuenta con la revisión y aprobación de otro integrante.
- [X] Dada la rama `release/segundo-parcial` creada desde `develop`, cuando se verifica GitHub Pages, entonces la aplicación se encuentra publicada y funcionando en esa rama.
- [X] Dada la entrega inicial, cuando se publica la PR de release antes del 27 de noviembre de 2026 a las 23:55 hs, entonces se respeta el título, se notifica en Slack al docente y al equipo, y se realiza la entrega individual en el campus.

### Fase 2 — Resolución de correcciones

- [ ] Dado cada Request Change del docente, cuando se recibe, entonces se analiza, prioriza y registra mediante una issue específica asignada al responsable correspondiente.
- [ ] Dada una corrección, cuando se implementa, entonces se utiliza una rama `fix/` con PR hacia `release/segundo-parcial`, commits descriptivos y registro en `[Fixed]` del changelog.
- [ ] Dada una reasignación formal dispuesta por el docente, cuando corresponde aplicarla, entonces se documenta su justificación, fecha y responsable y se notifica al equipo.
- [ ] Dada cada ronda de correcciones, cuando se resuelven las observaciones, entonces se verifica su resolución y se notifica al docente mediante ✅ en Slack.
- [ ] Dada la totalidad de Request Changes, cuando finaliza el proceso, entonces se obtiene el LGTM y Approve antes del 30 de noviembre de 2026 a las 22:00 hs.
- [ ] Dada la aprobación, cuando se realiza el merge a `master`, entonces se notifica mediante `:pr-merged:`.
- [ ] Dada la versión aprobada, cuando se publica el release, entonces se crea `v2.0-segundo-parcial` con el extracto correspondiente del changelog.
- [ ] Dada la finalización del proceso, cuando se realiza el backport aprobado hacia `develop`, entonces se incorporan las correcciones y se notifica su finalización en Slack.
- [ ] Dadas las issues resueltas, cuando se verifica su estado, entonces se encuentran cerradas con sus resoluciones documentadas.

## AT CLOSE — Evidencia de coordinación e implementación

*Se completará progresivamente con evidencias reales. Los resultados no disponibles permanecerán pendientes hasta su verificación.*

### Code reviews realizadas mediante GitHub Copilot Agent Mode

Para cada una de las cuatro PRs mínimas (y las adicionales, si corresponde) se completará el siguiente registro:

| Revisión | PR / enlace | Rol | Fecha | Resultado |
|---|---|---|---|---|
| 1 | [PR: 208](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/pull/208) | Tester QA/JS - Testing Avanzado | 26/11/2026 | Mergeado |
| 2 | [PR: 211](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/pull/211) | Desarrollador JS Asíncrono (Fetch & APIs) | 26/11/2026 | Mergeado |
| 3 | [PR: 215](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/pull/215) | Tester QA/JS - Testing Avanzado | 26/11/2026 | Mergeado |
| 4 | [PR: 216](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/pull/216) | Desarrollador JS Librerías Externas | 26/11/2026 | Mergeado |
| 5 | [PR: 217](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/pull/217) | Desarrollador JS Asíncrono (Fetch & APIs) | 26/11/2026 | Mergedo |
| 7 | [PR: 219](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/pull/219) | Desarrollador JS Librerías Externas | 27/11/2026 | Mergeado |
| 8 | [PR: 220](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/pull/220) | Tester QA/JS - Testing Avanzado | 27/11/2026 | Mergeado |
| 9 | [PR: 221](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/pull/221) | Desarrollador JS Librerías Externas | 27/11/2026 | Mergeado |
| 10 | [PR: 222](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/pull/222) | Tester QA/JS - Testing Avanzado | 27/11/2026 | Mergeado |
| 11 | [PR: 223](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/pull/223) | Coordinador/DevOps | 27/11/2026 | Mergeado |
| 12 | [PR: 224](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/pull/224) | Desarrollador JS Asíncrono (Fetch & APIs) | 27/11/2026 | Pendiente |
| 13 | [PR: 226](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/pull/226) | Coordinador/DevOps | 27/11/2026 | Pendiente |



### Correcciones de AO4, aprobación y backport inicial

[[GRUPO N°5] [Backport Cuarta Entrega] Sincronización de master hacia develop](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/pull/206).

### Integración de ramas feature y coordinación de auditorías Lighthouse

[feature/tester-qa-js-testing-suite](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/pull/208)
[feature/dev-async-fetch-api](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/pull/211)
[feature/dev-libreria-externa-sweetalert2](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/pull/216)
[feature/coord-devops-segundo-parcial](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/pull/226)


### Actualización de README.md, changelog.md y estructura del proyecto

- README.md
- changelog.md
- Estructura correcta

### Gestión de issues y GitHub Projects

[Kanban Segundo parcial](https://github.com/users/angelgc9107-lgtm/projects/6/views/1)

### Preparación de release, GitHub Pages, Slack y entrega en campus

Pendiente al finalizar.

### Fase 2 — Request Changes del docente

| Request Change / enlace | Issue | Rol asignado | Prioridad | PR de corrección | Estado / resolución |
|---|---|---|---|---|---|
| Pendiente | Pendiente | Pendiente | Pendiente | Pendiente | Pendiente |

### Reasignaciones de responsabilidades y contingencias

La PR [#224](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/pull/224),
iniciada por el Desarrollador JS Asíncrono (Fetch & APIs), debió ser
retomada por el Desarrollador JS Librerías Externas debido a que
el responsable original no disponía de acceso a una computadora
para realizar las correcciones solicitadas mediante Request Changes (RC).

Esta decisión fue coordinada para garantizar la continuidad de las
tareas y evitar demoras que comprometieran los plazos de entrega
del Segundo Parcial.

### Aprobación definitiva, merge, tag, release y backport final

Pendiente fase 2.

### Justificación y evidencias

#### Detalle de cada code review (repetir por PR)

- **PR revisada y rol:** PR 208 - Tester QA/JS - Testing Avanzado .
- **Archivos diff de contexto**
- `docs/03-specs/segundo-parcial/spec-coord-devops-segundo-parcial.md`
- `docs/03-specs/segundo-parcial/spec-tester-qa-segundo-parcial.md`
- **Request Changed en PR**
RC01 – Falta precisar la base exacta del baseline Lighthouse
Severidad: Medio
La descripción de TC-11 debe indicar explícitamente que se ejecuta sobre develop después del backport aprobado de la AO4 y antes de incorporar Fetch o la librería, tal como exige el spec del Coordinador.

RC02 – Faltan explícitamente el análisis de impacto y las recomendaciones Lighthouse
Severidad: Medio
Completar el plan de TC-12 y TC-13 con el análisis de impacto y las recomendaciones exigidos por el spec del Coordinador, además de las diferencias numéricas y las limitaciones de comparabilidad.
- **Prompt exacto utilizado (en bloque de código):**
```
# Code Review N.º 1 – Spec Tester QA/JS
## Rol y objetivo
Asumí el rol de Coordinador/DevOps y revisor técnico.
Realizá una code review del spec del Tester QA/JS, verificando el cumplimiento de los requisitos del docente y de los criterios establecidos en el spec del Coordinador/DevOps.
## Archivos de contexto

- `docs/03-specs/segundo-parcial/spec-tester-qa-segundo-parcial.md`: archivo objeto de revisión.
- `docs/03-specs/segundo-parcial/spec-coord-devops-segundo-parcial.md`: criterios de coordinación y aprobación.

## Requisitos obligatorios del spec
- Plan de testing funcional: qué casos de éxito, error HTTP, error de red y procesamiento con map/filter/reduce se van a cubrir en api.spec.js, y qué casos (inicialización, configuración, funcionalidad principal, errores) se van a cubrir en library.spec.js.
- Plan de auditorías Lighthouse: en qué momentos se va a correr (baseline, post-fetch, post-librería) y los umbrales mínimos definidos (Performance ≥95, Accessibility ≥95, Best Practices ≥95, SEO ≥95).
- Herramientas a utilizar: Copilot Agent (si corresponde) para generación de tests, con justificación.
- Criterios de aceptación en formato checklist: api.spec.js y library.spec.js completos, los 3 test cases de Lighthouse documentados con comparaciones, issues creadas y asignadas a los roles correspondientes.

## Verificaciones solicitadas

- Verificar el cumplimiento de cada requisito obligatorio
- Verificar el cumplimiento de todos los criterios aplicables al Tester QA/JS establecidos en el spec del Coordinador/DevOps.
- Validar que la planificación respete el orden de integración a develop y las dependencias entre los roles.
- Verificar que las auditorías Lighthouse se planifiquen en los tres momentos correspondientes.
- Verificar que los criterios de aceptación sean claros, completos y verificables.
- Identificar omisiones, contradicciones y posibles problemas en la planificación.
- Verificar que se contemple la documentación de resultados, issues, contribuciones en changelog.md y prompts originales utilizados, si corresponde.
- Verificar que el spec BEFORE haya sido commiteado antes de comenzar las pruebas, si el historial está disponible.

## Resultado esperado
1. Una tabla de cumplimiento de los requisitos, indicando requisito, fuente, evidencia y estado (Cumple, No cumple, Cumple parcialmente o No verificable).
2. Los hallazgos identificados, utilizando la siguiente estructura:
### RC01 – Título del hallazgo

- Severidad: Crítico / Alto / Medio / Bajo.
- Archivo:
- Línea o rango de líneas:
- Requisito incumplido:
- Problema detectado:
- Corrección solicitada:
- Comentario inline para GitHub:
3. Recomendaciones no bloqueantes, si corresponde.
4. Resultado final de la revisión: APPROVE, REQUEST CHANGES o COMMENT, con su justificación.
## Restricciones
- Evaluar exclusivamente la etapa BEFORE del spec del Tester QA/JS.
- No exigir pruebas implementadas, auditorías ejecutadas ni evidencias correspondientes a la etapa AT CLOSE.
- No generar Request Changes por requisitos ajenos al rol o mejoras opcionales.
- No inventar requisitos, evidencias ni números de línea.
- No modificar archivos, realizar commits, aprobar PRs ni realizar merges.

Realizá únicamente la code review. La decisión final será responsabilidad del Coordinador/DevOps. Si el coordinador lo autoriza se puede comentar los hallazgos
```
- **PR revisada y rol:** PR 211
- **Archivos diff de contexto**
- `docs/03-specs/segundo-parcial/spec-dev-async-fetch.md`
- `docs/03-specs/segundo-parcial/spec-coord-devops-segundo-parcial.md`
- **Request Changed en PR**
Incorporar una matriz mínima con resultado esperado y verificaciones posteriores para los cuatro flujos.
docs/03-specs/segundo-parcial/spec-dev-async-fetch.md linea 121

Documentar el contrato público, nombres y exportaciones de las funciones, tipos de retorno y separación de responsabilidades entre apiService.js y script.js.
docs/03-specs/segundo-parcial/spec-dev-async-fetch.md linea 77

Completar una matriz por tipo de error con caché/fallback aplicable, reintento y mensaje asociado.
docs/03-specs/segundo-parcial/spec-dev-async-fetch.md  linea 87
- **Prompt exacto utilizado (en bloque de código):**
```
Code Review N.º 1 – Spec Desarrollador JS Asíncrono - Fetch & APIs
Rol y objetivo
Asumí el rol de Coordinador/DevOps y revisor técnico.
Realizá una code review del spec del Desarrollador JS Asíncrono - Fetch & APIs, verificando el cumplimiento de los requisitos del docente y de los criterios establecidos en el spec del Coordinador/DevOps.
Archivos de contexto
•	docs/03-specs/segundo-parcial/spec-dev-async-fetch.md: archivo objeto de revisión.
•	docs/03-specs/segundo-parcial/spec-coord-devops-segundo-parcial.md: criterios de coordinación y aprobación.
Requisitos obligatorios del spec
•	Selección y justificación de la API o JSON estático a utilizar.
•	Diseño de los estados de carga (loading/success/error) y de las funciones de orden superior a aplicar.
•	Criterios de aceptación en checklist: fetch con manejo de errores implementado, datos integrados al DOM, casos de test coordinados con Tester QA.
Verificaciones solicitadas
•	Verificar el cumplimiento de cada requisito obligatorio.
•	Verificar el cumplimiento de todos los criterios aplicables al Desarrollador JS Asíncrono - Fetch & APIs establecidos en el spec del Coordinador/DevOps.
•	Validar que la planificación respete el orden de integración a develop y las dependencias entre los roles.
•	Verificar que se defina la estructura y las responsabilidades de js/api/apiService.js, la estrategia de gestión de errores HTTP y de red, reintentos y fallbacks.
•	Verificar que se planifique el procesamiento de datos mediante map(), filter() y reduce(), incluyendo su validación y sanitización.
•	Verificar que se contemple la integración de los datos con el DOM, las clases POO y Storage, cuando corresponda, respetando las responsabilidades de js/script.js como controlador.
•	Verificar que se planifique la coordinación con el Tester QA y las verificaciones necesarias para evitar regresiones en los cuatro flujos existentes.
•	Verificar que los criterios de aceptación sean claros, completos y verificables.
•	Identificar omisiones, contradicciones y posibles problemas en la planificación.
•	Verificar que se contemple la documentación de resultados, issues, contribuciones en changelog.md y prompts originales utilizados, si corresponde.
•	Verificar que el spec BEFORE haya sido commiteado antes de comenzar la implementación, si el historial está disponible.
Resultado esperado
1.	Una tabla de cumplimiento de los requisitos, indicando requisito, fuente, evidencia y estado (Cumple, No cumple, Cumple parcialmente o No verificable).
2.	Los hallazgos identificados, utilizando la siguiente estructura:
RC01 – Título del hallazgo
•	Severidad: Crítico / Alto / Medio / Bajo.
•	Archivo:
•	Línea o rango de líneas:
•	Requisito incumplido:
•	Problema detectado:
•	Corrección solicitada:
•	Comentario inline para GitHub:
3.	Recomendaciones no bloqueantes, si corresponde.
4.	Resultado final de la revisión: APPROVE, REQUEST CHANGES o COMMENT, con su justificación.
Restricciones
•	Evaluar exclusivamente la etapa BEFORE del spec del Desarrollador JS Asíncrono - Fetch & APIs.
•	No exigir código implementado, consumo de API funcionando, pruebas ejecutadas ni evidencias correspondientes a la etapa AT CLOSE.
•	No generar Request Changes por requisitos ajenos al rol o mejoras opcionales.
•	No inventar requisitos, evidencias ni números de línea.
•	No modificar archivos, realizar commits, aprobar PRs ni realizar merges.
Realizá únicamente la code review. La decisión final será responsabilidad del Coordinador/DevOps. Si el coordinador lo autoriza se puede comentar los hallazgos.
```
- **PR revisada y rol:** PR 215
- **Archivos diff de contexto**
- ``
- `docs/03-specs/segundo-parcial/spec-tester-qa-segundo-parcial.md`
- `docs/03-specs/segundo-parcial/spec-coord-devops-segundo-parcial.md`
- `docs/04-testing/test-case-11-lighthouse-baseline.md`
- `docs/04-testing/screenshots/tc-11/`
- `docs/04-testing/testing-doc.md`
- `changelog.md`
- **Request Changed en PR**
RC01 — Documentación desactualizada: las Issues 212, 213 y 214 ya existen y están registradas en el changelog y en el AT CLOSE del SPEC. Actualizar esta frase y TC-11 para reflejar su estado real (abiertas, pendientes de asignación) y enlazarlas.
docs/04-testing/testing-doc.md linea 28

RC02 — Reproducibilidad: “Custom throttling” no documenta los valores del perfil ni la configuración de caché/red. Registrar los parámetros reales usados; además, explicar la limitación comparativa del cambio de http-server:8000 a Live Server en :5500 o mantener el entorno equivalente.
docs/04-testing/test-case-11-lighthouse-baseline.md linea 39

RC03 — Seguimiento de issues:212, 213 y 214 siguen sin asignados. Además, 212 marca implementadas las mejoras, aunque TC-11 dice que no hubo correcciones funcionales; las issues no identifican consistentemente el SHA evaluado. Coordinar la asignación al rol correspondiente, registrar el commit/evidencias y ajustar los estados de tareas a lo realmente verificado. No se solicita resolver ahora los hallazgos.
docs/03-specs/segundo-parcial/spec-tester-qa-segundo-parcial.md linea 255
- **Prompt exacto utilizado (en bloque de código):**
```
Code Review N.º 2 – Tester QA/JS — Lighthouse Baseline (TC-11)
Rol y objetivo
Asumí el rol de Coordinador/DevOps y revisor técnico.
Realizá una code review de la ejecución y documentación de la auditoría Lighthouse Baseline (TC-11) del Tester QA/JS, verificando el cumplimiento de los requisitos del docente, la planificación establecida en su spec y los criterios de revisión y aprobación del spec del Coordinador/DevOps.
Archivos de contexto
•	docs/03-specs/segundo-parcial/spec-tester-qa-segundo-parcial.md: especificación del rol.
•	docs/03-specs/segundo-parcial/spec-coord-devops-segundo-parcial.md: criterios de coordinación y aprobación.
•	docs/04-testing/test-case-11-lighthouse-baseline.md: documentación de la auditoría.
•	docs/04-testing/screenshots/tc-11/: evidencias de ejecución.
•	docs/04-testing/testing-doc.md: documentación general de testing.
•	changelog.md: registro de contribuciones.
•	Diff, historial de commits e issues asociadas a la PR.
Requisitos obligatorios del rol — Lighthouse Baseline
•	Ejecutar la auditoría Lighthouse sobre develop, después del backport aprobado de la Actividad Obligatoria N.º 4 y antes de incorporar Fetch y la librería externa.
•	Verificar los umbrales mínimos establecidos: Performance ≥95, Accessibility ≥95, Best Practices ≥95 y SEO ≥95.
•	Documentar la fecha, URL evaluada, rama, commit, navegador, versión y condiciones de ejecución de la auditoría.
•	Registrar los puntajes de las cuatro categorías y las métricas de Performance: First Contentful Paint (FCP), Largest Contentful Paint (LCP), Total Blocking Time (TBT), Cumulative Layout Shift (CLS) y Speed Index.
•	Documentar los problemas detectados, las observaciones y las recomendaciones de optimización proporcionadas por Lighthouse.
•	Adjuntar las capturas de pantalla correspondientes a los resultados obtenidos.
•	Crear issues detalladas para los problemas detectados y los resultados inferiores a los umbrales establecidos.
•	Coordinar con el Coordinador/DevOps la asignación y priorización de las correcciones.
•	Actualizar la documentación de testing y registrar las contribuciones correspondientes en changelog.md.
Verificaciones solicitadas
•	Verificar el cumplimiento de cada requisito obligatorio correspondiente al TC-11.
•	Comparar la ejecución y documentación del Baseline con la planificación establecida en el BEFORE del Tester QA/JS.
•	Verificar el cumplimiento de todos los criterios aplicables al TC-11 establecidos en el spec del Coordinador/DevOps.
•	Validar que la auditoría se haya ejecutado sobre la versión correcta de develop, respetando el orden de integración establecido.
•	Contrastar los puntajes, métricas y observaciones documentadas con las capturas de pantalla disponibles.
•	Verificar que las condiciones de ejecución estén documentadas para permitir comparaciones posteriores con TC-12 y TC-13.
•	Verificar que las recomendaciones proporcionadas por Lighthouse estén correctamente identificadas e interpretadas.
•	Verificar que los problemas detectados y los resultados inferiores a los umbrales se encuentren respaldados mediante issues.
•	Verificar que las issues incluyan la descripción del problema, pasos para reproducir, evidencias y criterios de cierre, y que se contemple su asignación al rol correspondiente.
•	Verificar que las mediciones originales del Baseline se conserven sin alteraciones.
•	Verificar la trazabilidad entre spec, test case, evidencias, issues, commits, PR y changelog.md.
•	Identificar omisiones, contradicciones, errores de interpretación y documentación faltante.
Resultado esperado
1.	Una tabla de cumplimiento de los requisitos, indicando requisito, fuente, evidencia y estado (Cumple, No cumple, Cumple parcialmente o No verificable).
2.	Los hallazgos identificados, utilizando la siguiente estructura:
RC01 – Título del hallazgo
•	Severidad: Crítico / Alto / Medio / Bajo.
•	Archivo:
•	Línea o rango de líneas:
•	Requisito incumplido:
•	Problema detectado:
•	Corrección solicitada:
•	Comentario inline para GitHub:
3.	Recomendaciones no bloqueantes, si corresponde.
4.	Resultado final de la revisión: APPROVE, REQUEST CHANGES o COMMENT, con su justificación.
Formato de los comentarios en GitHub
Los hallazgos deben ser un comentario general en la PR que incluya la totalidad de los hallazgos identificados durante la code review, utilizando obligatoriamente la estructura definida anteriormente, en caso de ser aprobado.
Cada hallazgo deberá presentarse individualmente dentro del comentario general, manteniendo su numeración y trazabilidad con el resultado de la revisión.
En caso de solicitarlo el coordinador puedes dejar los hallazgos inline con una expliación del cambio a solicitar.
Ambos formatos son complementarios y los comentarios inline no reemplazan ni eliminan los hallazgos registrados en el comentario general.
FORMATO DEL COMENTARIO
════════════════════════════════════════════════════════════
HALLAZGO #N
Archivo: [nombre del archivo]
Línea: [número de línea / sección]
Tipo de problema: [bug | diseño | legibilidad | documentación | otro]
Severidad: [baja | media | alta]
Explicación técnica
[Descripción clara del problema detectado, el requisito incumplido y su impacto.]
Sugerencia de mejora
[Descripción de la modificación recomendada para resolver o mejorar el hallazgo.]
Ejemplo de código corregido (si aplica)
Antes:
[Contenido actual]
Después:
[Contenido sugerido]
DECISIÓN DEL REVISOR HUMANO
•	Aceptar sugerencia.
•	Rechazar sugerencia.
Justificación del revisor humano:
[Completar manualmente si se rechaza]
════════════════════════════════════════════════════════════
Consideraciones para los comentarios
•	Mantener la correspondencia entre el número del hallazgo y su identificador RC.
•	Si no existe una línea específica, indicar la sección o el archivo afectado.
•	Si el problema corresponde a documentación, utilizar ejemplos de texto o Markdown en lugar de código, cuando resulte aplicable.
•	No inventar contenido actual, números de línea ni evidencias.
•	Dejar sin completar la decisión y la justificación del revisor humano.
•	No publicar comentarios hasta contar con la autorización expresa del Coordinador/DevOps.
Restricciones
•	Evaluar exclusivamente la ejecución y documentación de Lighthouse Baseline (TC-11).
•	Utilizar el BEFORE aprobado como referencia, sin repetir su revisión.
•	No evaluar ni exigir la implementación de api.spec.js, library.spec.js ni otras pruebas automatizadas.
•	No exigir la ejecución de TC-12 y TC-13 ni las comparaciones correspondientes a dichas auditorías.
•	No exigir la resolución inmediata de las issues detectadas durante el Baseline.
•	No considerar los puntajes inferiores a los umbrales como un incumplimiento del Tester QA si fueron correctamente documentados y reportados, sin considerar por ello alcanzados los objetivos del proyecto.
•	No atribuir al Tester QA la responsabilidad de corregir el código de producción.
•	No exigir el AT CLOSE completo del rol.
•	No generar Request Changes por requisitos ajenos al alcance del TC-11 o mejoras opcionales.
•	No inventar requisitos, evidencias, resultados ni números de línea.
•	No modificar archivos, realizar commits, aprobar PRs ni realizar merges.
Realizá únicamente la code review. La decisión final será responsabilidad del Coordinador/DevOps. Si el Coordinador lo autoriza, se pueden comentar los hallazgos respetando los formatos establecidos.
```
- **PR revisada y rol:** PR 216
- **Archivos diff de contexto**
- `docs/03-specs/segundo-parcial/spec-dev-libreria-externa.md`
- `docs/03-specs/segundo-parcial/spec-coord-devops-segundo-parcial.md`
- **Request Changed en PR**
RC01 – Falta explicitar TC-12 y el orden obligatorio de integración
Archivo: docs/03-specs/segundo-parcial/spec-dev-libreria-externa.md Línea: 122-123
No se contempla explícitamente la auditoría Lighthouse TC-12 antes de integrar la librería ni su dependencia respecto de Fetch. Esto puede alterar el orden obligatorio de integración a develop.
Añadir una condición previa que indique: Fetch integrado y revisado → TC-12 ejecutado y documentado → inicio de la integración de SweetAlert2.

RC02 – Planificación incompleta de regresiones en los cuatro flujos
Archivo: docs/03-specs/segundo-parcial/spec-dev-libreria-externa.md Línea: 122-123
La coordinación menciona pruebas de la librería y actualizaciones de script.spec.js para eliminar y confirmar, pero no declara explícitamente las verificaciones de búsqueda y filtrado, pago y cuotas y resumen y confirmación del pedido. Añadir una matriz o lista mínima que indique qué casos existentes deben mantenerse y qué regresiones verificará el Tester QA.

RC03 – Falta explícita compatibilidad de Bootstrap y aceptación verificable
Añadir al checklist una verificación de uso desde el carrito, cierre con Escape, foco, z-index o apilamiento y ausencia de conflictos con módulos existentes.
Aunque se evalúa el Modal de Bootstrap y se explica la estética, el BEFORE no incorpora una verificación específica de coexistencia con el Offcanvas ni una condición de aceptación sobre Bootstrap.
Archivo: docs/03-specs/segundo-parcial/spec-dev-libreria-externa.md Línea: 93-101 y 107-116

- **Prompt exacto utilizado (en bloque de código):**
```
Code Review N.º 1 – Desarrollador JS Librerías Externas — Spec BEFORE
Rol y objetivo
Asumí el rol de Coordinador/DevOps y revisor técnico.
Realizá una code review del spec del Desarrollador JS Librerías Externas, verificando el cumplimiento de los requisitos del docente y de los criterios de revisión y aprobación establecidos en el spec del Coordinador/DevOps.
La revisión deberá centrarse exclusivamente en la planificación previa a la integración de la librería externa.
Archivos de contexto
•	docs/03-specs/segundo-parcial/spec-dev-libreria-externa.md: archivo objeto de revisión.
•	docs/03-specs/segundo-parcial/spec-coord-devops-segundo-parcial.md: criterios de coordinación y aprobación.
•	plan.md: requisitos funcionales y no funcionales del proyecto.
Requisitos obligatorios del spec
•	Necesidad específica del proyecto que justifica incorporar una librería externa, y por qué no se resuelve con código propio.
•	Librería seleccionada (nombre y versión), método de integración previsto (CDN) y los al menos 2 puntos de la aplicación donde se integrará.
•	Decisiones de arquitectura: si se va a crear un módulo wrapper, y cómo se mantendrá la consistencia visual con el diseño existente.
•	Criterios de aceptación en formato checklist: librería integrada vía CDN y funcionando, implementada en al menos 2 puntos de la app, documentación en libreria-doc.md completa con capturas.
Verificaciones solicitadas
•	Verificar el cumplimiento de cada requisito obligatorio establecido por el docente.
•	Verificar el cumplimiento de todos los criterios de planificación aplicables al Desarrollador JS Librerías Externas establecidos en el spec del Coordinador/DevOps.
•	Verificar que la necesidad identificada justifique la incorporación de la librería externa y que no se limite a reemplazar una funcionalidad ya resuelta mediante código propio.
•	Verificar que se identifique claramente el nombre, la versión y el método de integración mediante CDN.
•	Verificar que se definan al menos dos puntos diferentes de integración y que se explique qué funcionalidad aportará la librería en cada uno.
•	Validar que los puntos de integración previstos aporten una mejora a la experiencia del usuario.
•	Verificar que se justifique la decisión de implementar o no un módulo wrapper.
•	Verificar que la estrategia de integración contemple la compatibilidad con Bootstrap, los módulos existentes y la consistencia visual del proyecto.
•	Verificar que la planificación respete las responsabilidades de js/script.js como controlador, sin incorporar lógica de negocio ni duplicar responsabilidades de las clases del dominio.
•	Verificar que se contemplen los casos generales de prueba en coordinación con el Tester QA/JS y las verificaciones necesarias para evitar regresiones en los cuatro flujos existentes.
•	Verificar que se contemple la coordinación con el Desarrollador JS Asíncrono cuando exista una dependencia entre ambas implementaciones.
•	Validar que la planificación respete el orden de integración a develop y las dependencias entre los roles, incluyendo la auditoría Lighthouse Post-Fetch (TC-12) antes de integrar la librería externa.
•	Verificar que los criterios de aceptación estén expresados mediante un checklist y sean claros, completos y verificables.
•	Verificar que se contemple la elaboración de docs/07-librerias/libreria-doc.md, las capturas de los puntos de integración, la gestión de issues, la actualización de changelog.md y el registro del prompt original utilizado, cuando corresponda.
•	Verificar que el spec BEFORE haya sido commiteado antes de comenzar la integración de la librería, si el historial está disponible.
•	Identificar omisiones, contradicciones y posibles problemas en la planificación.
Resultado esperado
1.	Una tabla de cumplimiento de los requisitos, indicando requisito, fuente, evidencia y estado (Cumple, No cumple, Cumple parcialmente o No verificable).
2.	Los hallazgos identificados, utilizando la siguiente estructura:
RC01 – Título del hallazgo
•	Severidad: Crítico / Alto / Medio / Bajo.
•	Archivo:
•	Línea o rango de líneas:
•	Requisito incumplido:
•	Problema detectado:
•	Corrección solicitada:
•	Comentario inline para GitHub:
3.	Recomendaciones no bloqueantes, si corresponde.
4.	Resultado final de la revisión: APPROVE, REQUEST CHANGES o COMMENT, con su justificación.
Formato de los comentarios en GitHub
Una vez realizada la code review, presentar la totalidad de los hallazgos y solicitar autorización al Coordinador/DevOps para publicarlos.
Una vez autorizada la publicación, deberá registrarse obligatoriamente un comentario general en la PR que incluya todos los hallazgos identificados durante la code review, utilizando la estructura definida a continuación.
Cada hallazgo deberá presentarse individualmente dentro del comentario general, manteniendo su numeración y trazabilidad con el resultado de la revisión.
En caso de solicitarlo el Coordinador/DevOps, se podrán registrar adicionalmente los hallazgos mediante comentarios inline, incluyendo una explicación de la corrección solicitada.
Ambos formatos son complementarios. Los comentarios inline no reemplazan ni eliminan los hallazgos registrados en el comentario general.
FORMATO DEL COMENTARIO
════════════════════════════════════════════════════════════
HALLAZGO #N
Archivo: [nombre del archivo]
Línea: [número de línea / sección]
Tipo de problema: [bug | diseño | legibilidad | documentación | otro]
Severidad: [baja | media | alta]
Explicación técnica
[Descripción clara del problema detectado, el requisito incumplido y su impacto.]
Sugerencia de mejora
[Descripción de la modificación recomendada para resolver o mejorar el hallazgo.]
Ejemplo de código corregido (si aplica)
Antes:
[Contenido actual]
Después:
[Contenido sugerido]
DECISIÓN DEL REVISOR HUMANO
•	Aceptar sugerencia.
•	Rechazar sugerencia.
Justificación del revisor humano:
[Completar manualmente si se rechaza]
════════════════════════════════════════════════════════════
Consideraciones para los comentarios
•	Mantener la correspondencia entre el número del hallazgo y su identificador RC.
•	Si no existe una línea específica, indicar la sección o el archivo afectado.
•	Si el problema corresponde a documentación, utilizar ejemplos de texto o Markdown en lugar de código, cuando resulte aplicable.
•	Diferenciar los incumplimientos obligatorios de las recomendaciones de mejora no bloqueantes.
•	No inventar contenido actual, números de línea ni evidencias.
•	Dejar sin completar la decisión y la justificación del revisor humano.
•	No publicar comentarios hasta contar con la autorización expresa del Coordinador/DevOps.
Restricciones
•	Evaluar exclusivamente la etapa BEFORE del spec del Desarrollador JS Librerías Externas.
•	No exigir que la librería externa se encuentre instalada, integrada o funcionando durante esta etapa.
•	No exigir la implementación del módulo wrapper, únicamente la decisión y su justificación.
•	No exigir la ejecución de los casos de prueba ni que la coordinación con el Tester QA/JS haya finalizado. Verificar que estas actividades estén contempladas en la planificación.
•	No exigir resultados de Lighthouse ni evidencias de auditorías correspondientes al Tester QA/JS.
•	No exigir que libreria-doc.md y las capturas de pantalla estén completos durante el BEFORE, únicamente que se encuentren contemplados como entregables.
•	No exigir prompts de implementación, ajustes manuales ni evidencias correspondientes a la etapa AT CLOSE.
•	No generar Request Changes por requisitos ajenos al rol, actividades de etapas posteriores o mejoras opcionales.
•	Diferenciar los requisitos explícitos del docente de los criterios adicionales establecidos por el Coordinador/DevOps.
•	No inventar requisitos, evidencias, resultados ni números de línea.
•	No modificar archivos, realizar commits, aprobar PRs ni realizar merges.
Realizá únicamente la code review. La decisión final será responsabilidad del Coordinador/DevOps. Si el Coordinador lo autoriza, se pueden comentar los hallazgos respetando los formatos establecidos.
```
- **PR revisada y rol:** PR 217
- **Archivos diff de contexto**
- `docs/03-specs/segundo-parcial/spec-dev-async-fetch.md`
- `docs/03-specs/segundo-parcial/spec-coord-devops-segundo-parcial.md`
- `plan.md`
- `api/productos.json`
- `js/api/apiService.js`
- `js/services/ProcesadorCatalogo.js`
- `js/script.js`
- `js/models/`
- `js/services/FachadaStorage.js y js/utils/storage.js`
- `js/data/productosIniciales.js`
- `index.html y css/components.css`
- `changelog.md`
- `docs/03-specs/segundo-parcial/spec-tester-qa-segundo-parcial.md`
- **Request Changed en PR**
RC02 — Reintentos fuera del rango HTTP 5xx
La condición error.estado >= 500 también considera reintentables estados fuera del rango 500–599 (por ejemplo, 600), aunque el spec limita los reintentos a errores 5xx. Esto amplía el comportamiento definido en la matriz de errores. Limite la condición al rango 500–599:
js/api/apiService.js Linea 154

RC03 — El renderizado de ofertas bloquea un catálogo válido parcial
Cuando un registro promocionado es descartado por inválido, renderizarOfertas() llama a ServicioOfertas.obtenerOfertas(), que lanza si falta cualquiera de sus códigos configurados. La excepción detiene esta carga antes de renderizar los productos válidos restantes. En la prueba con AMOLADORA-001 inválida, el catálogo quedó sin tarjetas y mostró “No pudimos mostrar el catálogo”. Aísle el renderizado de ofertas para que una oferta ausente no interrumpa el catálogo principal, de acuerdo con el manejo de registros inválidos del spec.
js/script.js Linea 926
- **Prompt exacto utilizado (en bloque de código):**
```
Code Review N.º 2 – Desarrollador JS Asíncrono - Fetch & APIs — Implementación
Rol y objetivo
Asumí el rol de Coordinador/DevOps y revisor técnico.
Realizá una code review de la implementación del Desarrollador JS Asíncrono - Fetch & APIs, verificando el cumplimiento de los requisitos del docente, la planificación establecida en el BEFORE aprobado y los criterios de revisión y aprobación del spec del Coordinador/DevOps.
El objetivo es verificar que la implementación sea funcional, respete la arquitectura existente y cumpla con las decisiones técnicas y los criterios de aceptación definidos en el spec del rol.
Archivos de contexto
•	docs/03-specs/segundo-parcial/spec-dev-async-fetch.md: contrato de implementación del rol.
•	docs/03-specs/segundo-parcial/spec-coord-devops-segundo-parcial.md: criterios de coordinación y aprobación.
•	plan.md: requisitos funcionales y no funcionales del proyecto.
•	api/productos.json: fuente de datos seleccionada.
•	js/api/apiService.js: módulo de consumo asíncrono.
•	js/services/ProcesadorCatalogo.js: procesamiento y validación de datos.
•	js/script.js: controlador principal.
•	js/models/: clases del dominio.
•	js/services/FachadaStorage.js y js/utils/storage.js: persistencia.
•	js/data/productosIniciales.js: catálogo local utilizado como fallback.
•	index.html y css/components.css: integración y estados visuales.
•	changelog.md: registro de contribuciones.
•	Diff, historial de commits, issues y comentarios de revisiones anteriores asociados a la PR.
Requisitos obligatorios del rol — Implementación
•	Implementar el consumo asíncrono de datos mediante fetch(), promesas y async/await, utilizando la fuente seleccionada y justificada en el BEFORE.
•	Verificar el estado de las respuestas HTTP y procesar correctamente los datos JSON.
•	Implementar try/catch para gestionar errores HTTP, errores de red y errores de procesamiento de datos.
•	Implementar los estados visuales loading, success y error, proporcionando mensajes comprensibles para el usuario.
•	Implementar los mecanismos de reintento y fallback definidos en el spec.
•	Utilizar las funciones de orden superior map(), filter() y reduce() para procesar los datos obtenidos.
•	Validar y sanitizar los datos antes de utilizarlos.
•	Integrar dinámicamente los datos obtenidos con el DOM.
•	Encapsular el consumo asíncrono en un módulo dedicado, respetando la separación de responsabilidades.
•	Integrar los datos con las clases POO y Storage según lo establecido en el spec.
•	Incorporar comentarios JSDoc en los módulos nuevos y las funciones complejas.
•	Coordinar con el Tester QA/JS los casos de prueba correspondientes a la implementación.
•	Responder las issues relacionadas con el rol y documentar su resolución cuando corresponda.
•	Completar el AT CLOSE con el prompt exacto utilizado, los ajustes manuales realizados, el resumen de integración con POO y Storage y las issues respondidas.
•	Registrar las contribuciones correspondientes en changelog.md.
Verificaciones solicitadas
1. Cumplimiento del spec y consumo asíncrono
•	Verificar el cumplimiento de cada requisito obligatorio del rol.
•	Verificar el cumplimiento de todos los criterios aplicables al Desarrollador JS Asíncrono establecidos en el spec del Coordinador/DevOps.
•	Comparar la implementación con las decisiones técnicas, contratos y criterios de aceptación definidos en el BEFORE aprobado.
•	Verificar que api/productos.json respete la estructura de datos establecida y conserve los productos, códigos y precios originales del proyecto.
•	Verificar el uso correcto de fetch(), promesas, async/await, try/catch, validación de respuestas HTTP y procesamiento de JSON.
•	Verificar que las operaciones asíncronas no generen errores sin gestionar ni solicitudes duplicadas innecesarias.
2. Contrato público y separación de responsabilidades
•	Verificar que las funciones exportadas por apiService.js respeten los nombres, parámetros, tipos de retorno y responsabilidades definidos en el spec:
o	ErrorApi.
o	obtenerJson().
o	obtenerCatalogoRemoto().
o	cargarCatalogo().
•	Verificar que ResultadoCarga respete la estructura definida en el contrato público.
•	Verificar que obtenerJson() y obtenerCatalogoRemoto() propaguen los errores correspondientes y que cargarCatalogo() los capture y aplique los mecanismos de respaldo.
•	Verificar que js/script.js conserve exclusivamente sus responsabilidades de controlador: eventos, manipulación del DOM y orquestación de clases y servicios.
•	Verificar que script.js no incorpore llamadas directas a fetch(), lógica de negocio, reglas de validación del dominio ni detalles de persistencia.
•	Verificar que apiService.js y ProcesadorCatalogo.js no manipulen directamente el DOM.
3. Gestión de errores, reintentos y fallbacks
•	Contrastar la implementación con la matriz de errores definida en el spec.
•	Verificar el tratamiento de errores de red, tiempo agotado, HTTP 4xx, HTTP 5xx, JSON inválido, estructura incorrecta y registros inválidos o vacíos.
•	Verificar que se respete el tiempo límite de 8 segundos por intento.
•	Verificar que se realicen como máximo dos reintentos, con esperas de 500 ms y 1000 ms, en los escenarios definidos.
•	Verificar que no se realicen reintentos en los escenarios donde el spec establece que no corresponde.
•	Verificar el orden de recuperación establecido: red → caché válida → catálogo local.
•	Verificar que el almacenamiento y recuperación de la caché se realicen mediante FachadaStorage, sin duplicar responsabilidades de Storage.
•	Verificar que los mensajes presentados al usuario sean coherentes con el tipo de error y el origen del catálogo.
4. Procesamiento, validación y sanitización de datos
•	Verificar que ProcesadorCatalogo.js implemente las funciones previstas en el spec y utilice correctamente map(), filter() y reduce().
•	Verificar que las funciones de procesamiento sean puras y testeables, sin dependencias del DOM, Fetch o Storage.
•	Verificar que se utilicen las clases del dominio para validar y construir los productos.
•	Verificar que se gestionen correctamente los registros inválidos y códigos duplicados.
•	Verificar que los datos recibidos se incorporen al DOM de manera segura, utilizando textContent según lo establecido en el spec.
•	Verificar que no se dupliquen las reglas de negocio existentes en las clases POO.
5. Estados visuales e integración con el DOM
•	Verificar el funcionamiento de los estados loading, success y error.
•	Verificar el indicador de carga, los mensajes al usuario, el atributo aria-busy y la habilitación o deshabilitación de los controles.
•	Verificar el funcionamiento del botón «Reintentar».
•	Verificar que la disponibilidad del catálogo sea independiente del estado visual del mensaje.
•	Verificar que, cuando se utilice un fallback válido, los productos se rendericen y los controles se habiliten, aunque se muestre un mensaje de tipo error.
•	Verificar que la búsqueda inicial no sobrescriba indebidamente el mensaje que informa sobre la utilización de un fallback.
6. Regresiones y coordinación con Tester QA/JS
•	Verificar que la implementación preserve el comportamiento de los cuatro flujos existentes:
o	Búsqueda y filtrado.
o	Carrito.
o	Pago y cuotas.
o	Resumen y confirmación del pedido.
•	Contrastar el comportamiento implementado con la matriz de verificaciones y resultados esperados definida en el spec.
•	Verificar que los cuatro flujos puedan ejecutarse utilizando productos provenientes de la red, la caché o el catálogo local.
•	Verificar que no se modifiquen innecesariamente las funcionalidades, reglas de negocio ni contratos existentes.
•	Verificar que los módulos implementados permitan realizar las pruebas previstas en coordinación con el Tester QA/JS.
•	Verificar que los casos de prueba planificados sean coherentes con las funciones y contratos finalmente implementados.
•	Identificar posibles regresiones mediante la revisión del código y, cuando el entorno lo permita, mediante la ejecución de las pruebas disponibles.
7. Documentación, coordinación y cierre
•	Verificar que se hayan resuelto las observaciones solicitadas durante la revisión del BEFORE.
•	Verificar que las modificaciones respecto de la planificación original se encuentren justificadas y documentadas.
•	Verificar que se hayan incorporado comentarios JSDoc en los módulos nuevos y funciones complejas.
•	Verificar que se respete el orden de integración a develop, considerando la ejecución previa del Lighthouse Baseline (TC-11) y la posterior auditoría Post-Fetch (TC-12).
•	Verificar que el AT CLOSE contenga el prompt exacto utilizado en bloque de código, los ajustes manuales realizados, la integración con POO y Storage y las issues respondidas con su resolución, cuando corresponda.
•	Verificar la trazabilidad entre spec, implementación, criterios de aceptación, commits, issues, PR y changelog.md.
•	Verificar que el spec BEFORE haya sido commiteado antes de comenzar la implementación, si el historial está disponible.
•	Identificar errores funcionales, incumplimientos, contradicciones, problemas de arquitectura y documentación faltante.
Resultado esperado
1.	Una tabla de cumplimiento de los requisitos, indicando requisito, fuente, evidencia y estado (Cumple, No cumple, Cumple parcialmente o No verificable).
2.	Los hallazgos identificados, utilizando la siguiente estructura:
RC01 – Título del hallazgo
•	Severidad: Crítico / Alto / Medio / Bajo.
•	Archivo:
•	Línea o rango de líneas:
•	Requisito incumplido:
•	Problema detectado:
•	Corrección solicitada:
•	Comentario inline para GitHub:
3.	Recomendaciones no bloqueantes, si corresponde.
4.	Resultado final de la revisión: APPROVE, REQUEST CHANGES o COMMENT, con su justificación.
Formato de los comentarios en GitHub
Una vez realizada la code review, presentar la totalidad de los hallazgos y solicitar autorización al Coordinador/DevOps para publicarlos.
Una vez autorizada la publicación, deberá registrarse obligatoriamente un comentario general en la PR que incluya todos los hallazgos identificados durante la code review, utilizando la estructura definida a continuación.
Cada hallazgo deberá presentarse individualmente dentro del comentario general, manteniendo su numeración y trazabilidad con el resultado de la revisión.
Solicitar autorización adicional al Coordinador/DevOps para publicar los hallazgos mediante comentarios inline sobre las líneas correspondientes del diff, incluyendo una explicación de la corrección solicitada.
Ambos formatos son complementarios. Los comentarios inline no reemplazan ni eliminan los hallazgos registrados en el comentario general.
FORMATO DEL COMENTARIO
════════════════════════════════════════════════════════════
HALLAZGO #N
Archivo: [nombre del archivo]
Línea: [número de línea / sección]
Tipo de problema: [bug | diseño | legibilidad | documentación | otro]
Severidad: [baja | media | alta | crítica]
Explicación técnica
[Descripción clara del problema detectado, el requisito incumplido y su impacto.]
Sugerencia de mejora
[Descripción de la modificación recomendada para resolver o mejorar el hallazgo.]
Ejemplo de código corregido (si aplica)
Antes:
[Contenido actual]
Después:
[Contenido sugerido]
DECISIÓN DEL REVISOR HUMANO
•	Aceptar sugerencia.
•	Rechazar sugerencia.
Justificación del revisor humano:
[Completar manualmente si se rechaza]
════════════════════════════════════════════════════════════
Consideraciones para los comentarios
•	Mantener la correspondencia entre el número del hallazgo y su identificador RC.
•	Si no existe una línea específica, indicar la sección o el archivo afectado.
•	Si el problema corresponde a documentación, utilizar ejemplos de texto o Markdown en lugar de código, cuando corresponda.
•	Diferenciar los incumplimientos obligatorios de las recomendaciones no bloqueantes.
•	No inventar contenido actual, números de línea ni evidencias.
•	Dejar sin completar la decisión y la justificación del revisor humano.
•	Utilizar obligatoriamente codificación UTF-8.
•	Preservar las tildes, la letra ñ, los caracteres especiales, los separadores y el formato Markdown.
•	Si se utiliza GitHub CLI, preparar el comentario en un archivo Markdown temporal con codificación UTF-8 y publicarlo mediante --body-file.
•	Verificar que el comentario publicado conserve correctamente los caracteres y el formato original.
•	No publicar comentarios sin autorización expresa del Coordinador/DevOps.
Restricciones
•	Evaluar exclusivamente la implementación y documentación correspondientes al Desarrollador JS Asíncrono - Fetch & APIs.
•	Utilizar el BEFORE aprobado como contrato de implementación, sin repetir innecesariamente su revisión.
•	No exigir funcionalidades, módulos o comportamientos que no estén contemplados en la consigna o en los specs aplicables.
•	No exigir la implementación de api.spec.js, library.spec.js ni otras pruebas que sean responsabilidad del Tester QA/JS.
•	No exigir la ejecución de TC-12 antes de que Fetch se encuentre integrado en develop.
•	No exigir la implementación de la librería externa ni actividades correspondientes a otros roles.
•	No atribuir al Desarrollador JS Asíncrono la responsabilidad de resolver problemas preexistentes ajenos a su implementación.
•	Diferenciar los requisitos explícitos del docente, los criterios adicionales del Coordinador/DevOps y las decisiones técnicas asumidas en el BEFORE del rol.
•	No generar Request Changes por mejoras opcionales o requisitos ajenos al alcance de la PR.
•	No presentar como ejecutadas pruebas que únicamente fueron analizadas mediante la revisión del código.
•	No inventar requisitos, evidencias, resultados ni números de línea.
•	No modificar archivos del proyecto, realizar commits, aprobar PRs ni realizar merges.
Realizá únicamente la code review. La decisión final será responsabilidad del Coordinador/DevOps. Si el Coordinador lo autoriza, se pueden comentar los hallazgos respetando los formatos establecidos.
```
- **PR revisada y rol:** PR 219
- **Archivos diff de contexto**
- `docs/03-specs/segundo-parcial/spec-coord-devops-segundo-parcial.md`
- `docs/03-specs/segundo-parcial/spec-dev-libreria-externa.md`
- `docs/03-specs/segundo-parcial/spec-coord-devops-segundo-parcial.md`
- `docs/03-specs/segundo-parcial/spec-dev-async-fetch.md`
- `plan.md`
- `index.html`
- `js/script.js`
- `js/services/`
- `js/models/`
- `css`
- `docs/07-librerias/libreria-doc.md`
- `docs/07-librerias/screenshots/`
- `changelog.md`
- **Request Changed en PR**
Sin RC
- **Prompt exacto utilizado (en bloque de código):**
```
Code Review N.º 2 – Desarrollador JS Librerías Externas — Implementación y cierre
Rol y objetivo
Asumí el rol de Coordinador/DevOps y revisor técnico.
Realizá una code review completa del trabajo realizado por el Desarrollador JS Librerías Externas, verificando el cumplimiento de los requisitos del docente, las decisiones técnicas establecidas en el BEFORE aprobado y los criterios de revisión y aprobación del spec del Coordinador/DevOps.
El objetivo es verificar que la implementación de la librería externa sea funcional, aporte una mejora a la experiencia del usuario, respete la arquitectura existente y cumpla con todos los entregables correspondientes al rol.
Archivos de contexto
•	docs/03-specs/segundo-parcial/spec-dev-libreria-externa.md: contrato de implementación del rol.
•	docs/03-specs/segundo-parcial/spec-coord-devops-segundo-parcial.md: criterios de coordinación y aprobación.
•	docs/03-specs/segundo-parcial/spec-dev-async-fetch.md: contexto de integración con Fetch, cuando corresponda.
•	plan.md: requisitos funcionales y no funcionales del proyecto.
•	index.html: incorporación del CDN e integración con la interfaz.
•	js/script.js: controlador principal.
•	js/services/: módulo wrapper de la librería y servicios relacionados.
•	js/models/: clases del dominio.
•	css/: estilos y consistencia visual.
•	docs/07-librerias/libreria-doc.md: documentación de la librería.
•	docs/07-librerias/screenshots/: evidencias de implementación.
•	changelog.md: registro de contribuciones.
•	Diff, historial de commits, issues y comentarios de revisiones anteriores asociados a la PR.
Requisitos obligatorios del rol
Selección e integración de la librería externa
•	Identificar y justificar una necesidad específica del proyecto que no se encuentre resuelta mediante código propio.
•	Documentar el nombre, la versión, el propósito y los beneficios de la librería seleccionada.
•	Integrar correctamente la librería externa mediante CDN.
•	Configurar la librería según su documentación oficial.
•	Crear un módulo wrapper cuando resulte necesario, respetando las decisiones de arquitectura establecidas en el spec.
•	Implementar la librería en al menos dos puntos diferentes de la aplicación.
•	Mejorar la experiencia del usuario y mantener la consistencia visual con el diseño existente.
Arquitectura y funcionamiento
•	Respetar la separación de responsabilidades entre el controlador, los servicios y las clases del dominio.
•	Mantener la compatibilidad con Bootstrap y los módulos existentes.
•	Preservar el funcionamiento de los cuatro flujos principales del proyecto.
•	Coordinar con el Tester QA/JS los casos de prueba relacionados con la librería.
•	Coordinar con el Desarrollador JS Asíncrono cuando la librería interactúe con los datos obtenidos mediante Fetch.
•	Responder las issues relacionadas con la implementación y documentar su resolución cuando corresponda.
Documentación y cierre
•	Crear docs/07-librerias/libreria-doc.md, incluyendo nombre, versión, propósito, beneficios, justificación técnica, método de instalación, ejemplos de uso y enlaces a la documentación oficial.
•	Incorporar capturas de pantalla de los puntos de integración.
•	Incorporar comentarios JSDoc en los módulos nuevos y funciones complejas.
•	Completar el AT CLOSE del spec con las evidencias reales del trabajo realizado.
•	Registrar las contribuciones correspondientes en changelog.md, incluyendo los enlaces a PRs e issues.
Verificaciones solicitadas
1. Cumplimiento de la consigna y del spec
•	Verificar el cumplimiento de cada requisito obligatorio establecido por el docente.
•	Verificar el cumplimiento de todos los criterios aplicables al Desarrollador JS Librerías Externas establecidos en el spec del Coordinador/DevOps.
•	Comparar la implementación con las decisiones técnicas y los criterios de aceptación definidos en el BEFORE aprobado.
•	Verificar que las correcciones solicitadas durante la revisión del BEFORE hayan sido incorporadas.
•	Verificar que la necesidad identificada justifique la utilización de SweetAlert2 y que su incorporación no se limite a reemplazar una funcionalidad existente sin aportar valor adicional.
•	Verificar que cualquier modificación respecto de la planificación original esté justificada y documentada.
•	Verificar que el BEFORE haya sido commiteado antes de comenzar la integración, si el historial está disponible.
2. Integración y configuración de SweetAlert2
•	Verificar que el CDN incorporado en index.html corresponda al nombre y versión establecidos en el spec.
•	Verificar que los recursos necesarios de la librería se carguen correctamente y en el orden correspondiente.
•	Verificar que la configuración de SweetAlert2 sea correcta y coherente con su documentación oficial.
•	Verificar que no existan dependencias duplicadas o innecesarias.
•	Identificar los puntos reales de integración y contrastarlos con los definidos en el BEFORE.
•	Verificar que existan al menos dos puntos diferentes de integración funcional.
•	Verificar que cada punto de integración aporte una mejora concreta a la experiencia del usuario.
•	Verificar el tratamiento de las confirmaciones, cancelaciones y cierres de los diálogos, según corresponda.
3. Arquitectura y separación de responsabilidades
•	Verificar que el módulo wrapper previsto en el spec se encuentre correctamente implementado.
•	Verificar que las funciones exportadas, parámetros, retornos y responsabilidades del wrapper sean coherentes con la planificación.
•	Verificar que ServicioDialogos, si corresponde al contrato aprobado, encapsule la interacción con SweetAlert2 sin incorporar reglas de negocio.
•	Verificar que js/script.js conserve exclusivamente sus responsabilidades de controlador: eventos, manipulación del DOM y orquestación de clases y servicios.
•	Verificar que no se incorporen reglas de negocio, cálculos, validaciones del dominio ni detalles de persistencia dentro de script.js o del wrapper.
•	Verificar que no se dupliquen ni modifiquen innecesariamente las responsabilidades de las clases POO y Storage.
•	Verificar que las operaciones del dominio se ejecuten únicamente cuando corresponda, según el resultado de los diálogos.
•	Verificar que las operaciones asíncronas relacionadas con SweetAlert2 se gestionen correctamente.
•	Verificar que los módulos implementados sean mantenibles y testeables.
4. Compatibilidad con Bootstrap y consistencia visual
•	Verificar que los diálogos mantengan la identidad visual de FerroLab, respetando colores, tipografías, botones y estilos existentes.
•	Verificar que la implementación sea compatible con Bootstrap y los componentes utilizados en la aplicación.
•	Verificar especialmente la interacción entre SweetAlert2 y el Offcanvas del carrito.
•	Identificar posibles conflictos de foco, superposición de elementos, z-index, navegación mediante teclado y comportamiento de la tecla Escape.
•	Verificar que la apertura, confirmación, cancelación y cierre de los diálogos no alteren indebidamente el funcionamiento del Offcanvas.
•	Verificar que los estilos incorporados no produzcan regresiones visuales en otros componentes.
•	Verificar que los diálogos sean utilizables en las resoluciones y dispositivos contemplados por el proyecto.
•	Evaluar las verificaciones específicas de compatibilidad comprometidas en el BEFORE.
5. Regresiones en los cuatro flujos existentes
Verificar que la incorporación de la librería preserve los comportamientos de los cuatro flujos principales del proyecto:
Flujo 1 — Búsqueda y filtrado
•	Búsqueda de productos.
•	Filtrado por categoría y precio.
•	Ordenamiento y visualización de resultados.
Flujo 2 — Carrito
•	Incorporación, modificación y eliminación de productos.
•	Actualización de cantidades, subtotales y totales.
•	Confirmación y cancelación de la eliminación de productos, según el spec.
•	Persistencia del carrito.
Flujo 3 — Pago y cuotas
•	Selección del método de pago.
•	Selección de cuotas.
•	Cálculos y validaciones correspondientes.
•	Conservación de los comportamientos existentes.
Flujo 4 — Resumen y confirmación del pedido
•	Validación de los datos del cliente.
•	Visualización del resumen del pedido.
•	Confirmación y cancelación según los comportamientos definidos.
•	Persistencia del pedido y actualización del carrito.
•	Verificar que cancelar un diálogo no ejecute operaciones de negocio que requieran confirmación.
Contrastar estos comportamientos con la matriz de regresiones definida en el BEFORE y verificar que SweetAlert2 no modifique las reglas de negocio existentes.
6. Coordinación con Fetch y Tester QA/JS
•	Verificar que la librería sea compatible con la implementación asíncrona y con el catálogo obtenido mediante Fetch, caché o catálogo local, cuando corresponda.
•	Verificar que no se introduzcan dependencias innecesarias respecto del origen de los datos.
•	Verificar que los datos utilizados en los diálogos respeten las validaciones y sanitización existentes.
•	Verificar que se hayan coordinado con el Tester QA/JS los casos de prueba correspondientes a la librería.
•	Verificar que el wrapper y los puntos de integración permitan realizar las pruebas de inicialización, configuración, funcionalidad principal y manejo de errores.
•	Verificar que puedan utilizarse dobles de prueba cuando corresponda.
•	Identificar posibles regresiones mediante la revisión del código y, cuando el entorno lo permita, mediante la ejecución de las pruebas disponibles.
•	Verificar que el orden de integración a develop respete la siguiente secuencia: Fetch integrado → TC-12 ejecutado y documentado → integración de SweetAlert2 → TC-13.
•	Diferenciar el desarrollo de la librería en su rama feature de su integración definitiva mediante merge a develop.
7. Documentación de la librería
Verificar que docs/07-librerias/libreria-doc.md incluya:
•	Nombre y versión de la librería.
•	Propósito y necesidad que resuelve.
•	Beneficios para el proyecto.
•	Justificación técnica de su selección.
•	Método de instalación e integración mediante CDN.
•	Configuración utilizada.
•	Ejemplos de uso correspondientes a la implementación real.
•	Descripción de los puntos de integración.
•	Enlaces a la documentación oficial.
•	Capturas de pantalla de los puntos de integración.
Verificar que la documentación coincida con el código implementado y que las capturas correspondan a funcionalidades reales de la aplicación.
8. AT CLOSE, issues y trazabilidad
•	Verificar que el AT CLOSE contenga el prompt exacto utilizado en Copilot Agent u otra herramienta de IA, en bloque de código.
•	Verificar que se identifiquen los archivos utilizados como contexto, cuando corresponda.
•	Verificar que se incluya un fragmento representativo de la integración final.
•	Verificar que se documenten los ajustes manuales realizados sobre el código generado.
•	Verificar que se describan los dos o más puntos de integración y cómo mejoran la experiencia del usuario.
•	Verificar que se documente la coordinación con Fetch, cuando corresponda.
•	Verificar que las issues relacionadas con el rol hayan sido respondidas y que se documente su resolución o estado.
•	Verificar el cumplimiento de los criterios de aceptación establecidos en el BEFORE.
•	Verificar que se hayan incorporado comentarios JSDoc en los módulos nuevos y funciones complejas.
•	Verificar que changelog.md registre las contribuciones realizadas y los enlaces correspondientes.
•	Verificar la trazabilidad entre spec, implementación, criterios de aceptación, commits, issues, evidencias y PR.
•	Identificar errores funcionales, incumplimientos, contradicciones, problemas de arquitectura y documentación faltante.
Resultado esperado
1.	Una tabla de cumplimiento de los requisitos, indicando requisito, fuente, evidencia y estado (Cumple, No cumple, Cumple parcialmente o No verificable).
2.	Los hallazgos identificados, utilizando la siguiente estructura:
RC01 – Título del hallazgo
•	Severidad: Crítico / Alto / Medio / Bajo.
•	Archivo:
•	Línea o rango de líneas:
•	Requisito incumplido:
•	Problema detectado:
•	Corrección solicitada:
•	Comentario inline para GitHub:
3.	Estado de las correcciones solicitadas durante las revisiones anteriores, indicando si se encuentran resueltas, parcialmente resueltas o pendientes.
4.	Recomendaciones no bloqueantes, si corresponde.
5.	Resultado final de la revisión: APPROVE, REQUEST CHANGES o COMMENT, con su justificación.
Formato de los comentarios en GitHub
Una vez realizada la code review, presentar la totalidad de los hallazgos y solicitar autorización al Coordinador/DevOps para publicarlos.
Una vez autorizada la publicación, deberá registrarse obligatoriamente un comentario general en la PR que incluya todos los hallazgos identificados durante la code review, utilizando la estructura definida a continuación.
Cada hallazgo deberá presentarse individualmente dentro del comentario general, manteniendo su numeración y trazabilidad con el resultado de la revisión.
Solicitar autorización adicional al Coordinador/DevOps para publicar los hallazgos mediante comentarios inline sobre las líneas correspondientes del diff, incluyendo una explicación de la corrección solicitada.
Ambos formatos son complementarios. Los comentarios inline no reemplazan ni eliminan los hallazgos registrados en el comentario general.
FORMATO DEL COMENTARIO
════════════════════════════════════════════════════════════
HALLAZGO #N
Archivo: [nombre del archivo]
Línea: [número de línea / sección]
Tipo de problema: [bug | diseño | legibilidad | documentación | otro]
Severidad: [baja | media | alta | crítica]
Explicación técnica
[Descripción clara del problema detectado, el requisito incumplido y su impacto.]
Sugerencia de mejora
[Descripción de la modificación recomendada para resolver o mejorar el hallazgo.]
Ejemplo de código corregido (si aplica)
Antes:
[Contenido actual]
Después:
[Contenido sugerido]
DECISIÓN DEL REVISOR HUMANO
•	Aceptar sugerencia.
•	Rechazar sugerencia.
Justificación del revisor humano:
[Completar manualmente si se rechaza]
════════════════════════════════════════════════════════════
Consideraciones para los comentarios
•	Mantener la correspondencia entre el número del hallazgo y su identificador RC.
•	Si no existe una línea específica, indicar la sección o el archivo afectado.
•	Si el problema corresponde a documentación, utilizar ejemplos de texto o Markdown en lugar de código, cuando corresponda.
•	Diferenciar los incumplimientos obligatorios de las recomendaciones no bloqueantes.
•	No duplicar hallazgos que correspondan al mismo problema.
•	No inventar contenido actual, números de línea ni evidencias.
•	Dejar sin completar la decisión y la justificación del revisor humano.
•	Utilizar obligatoriamente codificación UTF-8.
•	Preservar las tildes, la letra ñ, los caracteres especiales, los separadores y el formato Markdown.
•	Si se utiliza GitHub CLI, preparar el comentario en un archivo Markdown temporal con codificación UTF-8 y publicarlo mediante --body-file.
•	Verificar que el comentario publicado conserve correctamente los caracteres y el formato original.
•	No publicar comentarios sin autorización expresa del Coordinador/DevOps.
Restricciones
•	Evaluar de manera completa la planificación, implementación, documentación y cierre correspondientes al Desarrollador JS Librerías Externas.
•	Utilizar el BEFORE aprobado como contrato de implementación, sin repetir innecesariamente su revisión.
•	No exigir funcionalidades, módulos o comportamientos que no estén contemplados en la consigna o en los specs aplicables.
•	No exigir más de dos puntos de integración como requisito obligatorio del docente, sin perjuicio de verificar los compromisos adicionales asumidos en el spec aprobado.
•	No exigir la implementación de library.spec.js, api.spec.js ni otras pruebas correspondientes al Tester QA/JS.
•	No exigir la ejecución de TC-13 antes de que la librería externa se encuentre integrada en develop.
•	No atribuir al Desarrollador JS Librerías Externas la responsabilidad de ejecutar o documentar las auditorías Lighthouse correspondientes al Tester QA/JS.
•	No considerar el desarrollo en paralelo de las ramas feature como incumplimiento del orden de integración, siempre que sus merges respeten las dependencias establecidas.
•	No atribuir al rol la responsabilidad de corregir problemas preexistentes ajenos a su implementación.
•	No exigir la resolución de las issues del Baseline que hayan sido postergadas expresamente por el Coordinador/DevOps y no correspondan a problemas introducidos por la librería.
•	Diferenciar los requisitos explícitos del docente, los criterios adicionales establecidos por el Coordinador/DevOps y las decisiones técnicas asumidas en el BEFORE del rol.
•	No generar Request Changes por mejoras opcionales, requisitos ajenos al alcance de la PR o tareas pendientes justificadas por dependencias con otros roles.
•	No presentar como ejecutadas pruebas que únicamente fueron analizadas mediante la revisión del código.
•	No inventar requisitos, evidencias, resultados ni números de línea.
•	No modificar archivos del proyecto, realizar commits, aprobar PRs ni realizar merges.
Realizá únicamente la code review. La decisión final será responsabilidad del Coordinador/DevOps. Si el Coordinador lo autoriza, se pueden comentar los hallazgos respetando los formatos establecidos.
```

- **PR revisada y rol:** PR 220
- **Archivos diff de contexto**
- `docs/03-specs/segundo-parcial/spec-coord-devops-segundo-parcial.md`
- `docs/03-specs/segundo-parcial/spec-tester-qa-segundo-parcial.md`
- `docs/03-specs/segundo-parcial/spec-coord-devops-segundo-parcial.md`
- `docs/03-specs/segundo-parcial/spec-dev-async-fetch.md`
- `docs/04-testing/test-case-11-lighthouse-baseline.md`
- `docs/04-testing/test-case-12-lighthouse-post-fetch.md`
- `docs/04-testing/screenshots/tc-11/`
- `docs/04-testing/screenshots/tc-12/`
- `docs/04-testing/testing-doc.md`
- `changelog.md`
- **Request Changed en PR**
Sin RC
- **Prompt exacto utilizado (en bloque de código):**
```
# Code Review N.º 3 – Tester QA/JS — Lighthouse Post-Fetch (TC-12)

## Rol y objetivo
Asumí el rol de Coordinador/DevOps y revisor técnico.

Realizá una code review de la ejecución y documentación de la auditoría Lighthouse Post-Fetch (TC-12) del Tester QA/JS, verificando el cumplimiento de los requisitos del docente, la planificación establecida en su spec y los criterios de revisión y aprobación del spec del Coordinador/DevOps.

El objetivo es verificar que la auditoría se haya realizado correctamente después de integrar Fetch en `develop` y antes de integrar la librería externa, evaluando el impacto de la implementación asíncrona mediante la comparación con los resultados del Baseline (TC-11).

## Archivos de contexto

- `docs/03-specs/segundo-parcial/spec-tester-qa-segundo-parcial.md`: especificación del rol.
- `docs/03-specs/segundo-parcial/spec-coord-devops-segundo-parcial.md`: criterios de coordinación y aprobación.
- `docs/03-specs/segundo-parcial/spec-dev-async-fetch.md`: contexto de la implementación asíncrona.
- `docs/04-testing/test-case-11-lighthouse-baseline.md`: auditoría de referencia.
- `docs/04-testing/test-case-12-lighthouse-post-fetch.md`: documentación objeto de revisión.
- `docs/04-testing/screenshots/tc-11/`: evidencias del Baseline.
- `docs/04-testing/screenshots/tc-12/`: evidencias de la auditoría Post-Fetch.
- `docs/04-testing/testing-doc.md`: documentación general de testing.
- `changelog.md`: registro de contribuciones.
- Diff, historial de commits, issues y comentarios de revisiones anteriores asociados a la PR.

## Requisitos obligatorios del rol — Lighthouse Post-Fetch

- Ejecutar la auditoría Lighthouse sobre `develop`, después de integrar la implementación de Fetch y antes de integrar la librería externa.
- Verificar los umbrales mínimos establecidos: Performance ≥95, Accessibility ≥95, Best Practices ≥95 y SEO ≥95.
- Documentar la fecha, URL evaluada, rama, commit, navegador y versión de la auditoría, según los criterios de coordinación.
- Identificar los cambios implementados respecto del Baseline: consumo de API mediante Fetch, procesamiento asíncrono de datos y actualización dinámica del DOM.
- Registrar los puntajes de las cuatro categorías y las métricas de Performance: First Contentful Paint (FCP), Largest Contentful Paint (LCP), Total Blocking Time (TBT), Cumulative Layout Shift (CLS) y Speed Index.
- Comparar numéricamente los puntajes y métricas obtenidos con los resultados del TC-11.
- Analizar el impacto de Fetch sobre el rendimiento, la accesibilidad, las buenas prácticas y el SEO.
- Identificar las mejoras, regresiones y resultados que permanecen sin cambios respecto del Baseline.
- Documentar los problemas detectados, las observaciones y las recomendaciones de optimización proporcionadas por Lighthouse.
- Documentar las limitaciones de comparabilidad cuando existan diferencias relevantes entre las condiciones de ejecución.
- Adjuntar las capturas de pantalla correspondientes a los resultados obtenidos.
- Crear issues detalladas para los problemas detectados y los resultados inferiores a los umbrales establecidos, verificando previamente si existen issues relacionadas.
- Coordinar con el Coordinador/DevOps la asignación y priorización de las correcciones.
- Actualizar la documentación de testing y registrar las contribuciones correspondientes en `changelog.md`.

## Verificaciones solicitadas

### 1. Cumplimiento de la consigna y planificación

- Verificar el cumplimiento de cada requisito obligatorio correspondiente al TC-12.
- Comparar la ejecución y documentación de la auditoría con la planificación establecida en el BEFORE del Tester QA/JS.
- Verificar el cumplimiento de todos los criterios aplicables al TC-12 establecidos en el spec del Coordinador/DevOps.
- Validar que la auditoría se haya ejecutado sobre la versión correcta de `develop`, respetando el orden de integración establecido.
- Verificar mediante el historial de commits que la implementación de Fetch se encontraba integrada y que la librería externa todavía no había sido incorporada.
- Verificar que los cambios implementados descritos en el test case coincidan con la implementación real del Desarrollador JS Asíncrono.

### 2. Resultados y evidencias de Lighthouse

- Contrastar los puntajes, métricas y observaciones documentadas con las capturas de pantalla y demás evidencias disponibles.
- Verificar que se documenten las cuatro categorías de Lighthouse.
- Verificar que se registren todas las métricas de Performance solicitadas.
- Verificar que los resultados se evalúen utilizando los umbrales mínimos establecidos de 95 puntos.
- Identificar resultados inferiores a los umbrales y verificar su documentación.
- Verificar que las mediciones originales del TC-12 se conserven sin alteraciones.
- Verificar que las capturas correspondan efectivamente a la auditoría Post-Fetch y que sus enlaces sean correctos.

### 3. Comparación con el Baseline (TC-11)

- Verificar que los valores utilizados como referencia coincidan con los resultados originales documentados en el TC-11.
- Verificar que se presente una comparación numérica de los puntajes de Performance, Accessibility, Best Practices y SEO.
- Verificar que se comparen numéricamente las métricas FCP, LCP, TBT, CLS y Speed Index.
- Verificar que las diferencias calculadas sean correctas y que las unidades de medida sean consistentes.
- Verificar que se interprete correctamente si cada diferencia representa una mejora, una regresión o un resultado sin cambios.
- Verificar que las condiciones de ejecución sean suficientemente comparables.
- Identificar diferencias relevantes de navegador, dispositivo, configuración, servidor o entorno de ejecución que puedan afectar la comparación.
- Verificar que las limitaciones de comparabilidad estén documentadas cuando corresponda.
- No exigir parámetros específicos de throttling, caché o red que no hayan sido establecidos como requisitos obligatorios. Si su ausencia limita la interpretación, registrarlo como recomendación de mejora, según su impacto.

### 4. Análisis del impacto de Fetch

- Verificar que se analice el impacto de la implementación asíncrona sobre las cuatro categorías de Lighthouse.
- Identificar mejoras y regresiones respecto del TC-11.
- Verificar que las conclusiones se encuentren respaldadas por los resultados y evidencias disponibles.
- Diferenciar los problemas preexistentes del Baseline de aquellos detectados después de integrar Fetch.
- Verificar que no se atribuyan automáticamente las variaciones de rendimiento a Fetch sin evidencia suficiente.
- Verificar que las recomendaciones de optimización proporcionadas por Lighthouse estén correctamente identificadas e interpretadas.
- Diferenciar las recomendaciones originales de Lighthouse de las propuestas adicionales realizadas por el Tester QA/JS.
- Verificar que las conclusiones permitan establecer el estado del proyecto antes de incorporar la librería externa.

### 5. Gestión de issues y coordinación

- Verificar que los problemas detectados y los resultados inferiores a los umbrales se encuentren respaldados mediante issues.
- Contrastar los problemas identificados en TC-12 con las issues existentes del TC-11.
- Verificar que los problemas persistentes se encuentren vinculados a las issues correspondientes, evitando duplicaciones innecesarias.
- Verificar que las nuevas regresiones o problemas detectados generen issues cuando corresponda.
- Verificar que las issues incluyan la descripción del problema, pasos para reproducir, evidencias y criterios de cierre.
- Verificar que se contemple su asignación al rol correspondiente y su priorización en coordinación con el Coordinador/DevOps.
- Respetar las decisiones previas del Coordinador/DevOps sobre la postergación de las correcciones hasta finalizar las auditorías Post-Fetch y Post-Librería.
- Verificar que las issues postergadas permanezcan abiertas y disponibles para su posterior evaluación.
- No considerar resuelto un problema únicamente porque su corrección haya sido postergada.

### 6. Documentación y trazabilidad

- Verificar que `test-case-12-lighthouse-post-fetch.md` contenga todos los apartados solicitados.
- Verificar que se actualice `docs/04-testing/testing-doc.md` con la información y los enlaces correspondientes al TC-12.
- Verificar que `changelog.md` registre las contribuciones realizadas.
- Verificar la trazabilidad entre spec, test case, evidencias, issues, commits, PR y `changelog.md`.
- Verificar que se respeten las mediciones originales del TC-11 y del TC-12.
- Verificar el cumplimiento de los criterios de aceptación del spec correspondientes a esta auditoría.
- Identificar omisiones, contradicciones, errores de interpretación, diferencias numéricas incorrectas y documentación faltante.

## Resultado esperado

1. Una tabla de cumplimiento de los requisitos, indicando requisito, fuente, evidencia y estado (Cumple, No cumple, Cumple parcialmente o No verificable).
2. Una tabla de validación de las comparaciones entre TC-11 y TC-12, utilizando la siguiente estructura:

Categoría o métrica | TC-11 | TC-12 | Diferencia | Interpretación | Estado de validación

1. Los hallazgos identificados, utilizando la siguiente estructura:

### RC01 – Título del hallazgo

- Severidad: Crítico / Alto / Medio / Bajo.
- Archivo:
- Línea o rango de líneas:
- Requisito incumplido:
- Problema detectado:
- Corrección solicitada:
- Comentario inline para GitHub:

1. Estado de las issues relacionadas con la auditoría, diferenciando problemas preexistentes, problemas nuevos y correcciones postergadas.
2. Recomendaciones no bloqueantes, si corresponde.
3. Resultado final de la revisión: APPROVE, REQUEST CHANGES o COMMENT, con su justificación.

## Formato de los comentarios en GitHub
Una vez realizada la code review, presentar la totalidad de los hallazgos y solicitar autorización al Coordinador/DevOps para publicarlos.

Una vez autorizada la publicación, deberá registrarse obligatoriamente un comentario general en la PR que incluya todos los hallazgos identificados durante la code review, utilizando la estructura definida a continuación.

Cada hallazgo deberá presentarse individualmente dentro del comentario general, manteniendo su numeración y trazabilidad con el resultado de la revisión.

Solicitar autorización adicional al Coordinador/DevOps para publicar los hallazgos mediante comentarios inline sobre las líneas correspondientes del diff, incluyendo una explicación de la corrección solicitada.

Ambos formatos son complementarios. Los comentarios inline no reemplazan ni eliminan los hallazgos registrados en el comentario general.

### FORMATO DEL COMENTARIO
════════════════════════════════════════════════════════════

**HALLAZGO #N**

**Archivo:** [nombre del archivo]

**Línea:** [número de línea / sección]

**Tipo de problema:** [bug | diseño | legibilidad | documentación | otro]

**Severidad:** [baja | media | alta | crítica]

**Explicación técnica**

[Descripción clara del problema detectado, el requisito incumplido y su impacto.]

**Sugerencia de mejora**

[Descripción de la modificación recomendada para resolver o mejorar el hallazgo.]

**Ejemplo de código corregido (si aplica)**

**Antes:**

[Contenido actual]

**Después:**

[Contenido sugerido]

**DECISIÓN DEL REVISOR HUMANO**

- Aceptar sugerencia.
- Rechazar sugerencia.
**Justificación del revisor humano:**

[Completar manualmente si se rechaza]

════════════════════════════════════════════════════════════

### Consideraciones para los comentarios

- Mantener la correspondencia entre el número del hallazgo y su identificador RC.
- Si no existe una línea específica, indicar la sección o el archivo afectado.
- Si el problema corresponde a documentación, utilizar ejemplos de texto, tablas o Markdown en lugar de código, cuando corresponda.
- Diferenciar los incumplimientos obligatorios de las recomendaciones no bloqueantes.
- No duplicar hallazgos que correspondan al mismo problema.
- No inventar contenido actual, números de línea, métricas ni evidencias.
- Dejar sin completar la decisión y la justificación del revisor humano.
- Utilizar obligatoriamente codificación UTF-8.
- Preservar las tildes, la letra ñ, los caracteres especiales, los separadores y el formato Markdown.
- Si se utiliza GitHub CLI, preparar el comentario en un archivo Markdown temporal con codificación UTF-8 y publicarlo mediante `--body-file`.
- Verificar que el comentario publicado conserve correctamente los caracteres y el formato original.
- No publicar comentarios hasta contar con la autorización expresa del Coordinador/DevOps.

## Restricciones

- Evaluar exclusivamente la ejecución y documentación de Lighthouse Post-Fetch (TC-12).
- Utilizar el BEFORE aprobado como referencia, sin repetir su revisión.
- Utilizar el TC-11 exclusivamente como referencia comparativa, sin realizar nuevamente su code review.
- No exigir la implementación de `api.spec.js`, `library.spec.js` ni otras pruebas automatizadas.
- No exigir la ejecución de TC-13 ni las comparaciones correspondientes a la auditoría Post-Librería.
- No realizar una nueva code review de la implementación del Desarrollador JS Asíncrono.
- No exigir la resolución inmediata de las issues detectadas durante TC-11 o TC-12 cuando su corrección haya sido postergada expresamente por el Coordinador/DevOps.
- No considerar los puntajes inferiores a los umbrales como un incumplimiento del Tester QA si fueron correctamente documentados, analizados y reportados, sin considerar por ello alcanzados los objetivos del proyecto.
- No atribuir al Tester QA la responsabilidad de corregir el código de producción.
- No exigir parámetros de ejecución que no estén establecidos en la consigna o en los specs aplicables.
- Diferenciar los requisitos explícitos del docente de los criterios adicionales del Coordinador/DevOps.
- No exigir el AT CLOSE completo del rol.
- No generar Request Changes por requisitos ajenos al alcance del TC-12 o mejoras opcionales.
- No presentar como verificadas evidencias que no se encuentren disponibles.
- No inventar requisitos, evidencias, resultados ni números de línea.
- No modificar archivos, realizar commits, cerrar issues, aprobar PRs ni realizar merges.
Realizá únicamente la code review. La decisión final será responsabilidad del Coordinador/DevOps. Si el Coordinador lo autoriza, se pueden comentar los hallazgos respetando los formatos establecidos.
```

- **PR revisada y rol:** PR 221
- **Archivos diff de contexto**
- `docs/03-specs/segundo-parcial/spec-coord-devops-segundo-parcial.md`
- `Issue asociada y sus actualizaciones`.
- `docs/03-specs/segundo-parcial/spec-dev-libreria-externa.md`.
- `docs/03-specs/segundo-parcial/spec-coord-devops-segundo-parcial.md`
- `docs/04-testing/test-case-11-lighthouse-baseline.md`
- `docs/04-testing/test-case-12-lighthouse-post-fetch.md`
- `docs/04-testing/test-case-13-lighthouse-post-library.md`
- `docs/04-testing/screenshots/`
- `index.html`
- `changelog.md`
- **Request Changed en PR**
Sin RC
- **Prompt exacto utilizado (en bloque de código):**
```
Verificación de resolución de Issue — Google Maps y Best Practices
Rol y objetivo
Asumí el rol de Coordinador/DevOps y revisor técnico.
Verificá si el Desarrollador JS Librerías Externas realizó las correcciones correspondientes a la issue relacionada con las cookies de terceros de Google Maps y el puntaje insuficiente de Best Practices detectado durante las auditorías Lighthouse TC-11 y TC-12.
Archivos de contexto
•	Issue asociada y sus actualizaciones.
•	docs/03-specs/segundo-parcial/spec-dev-libreria-externa.md.
•	docs/03-specs/segundo-parcial/spec-coord-devops-segundo-parcial.md.
•	docs/04-testing/test-case-11-lighthouse-baseline.md.
•	docs/04-testing/test-case-12-lighthouse-post-fetch.md.
•	docs/04-testing/test-case-13-lighthouse-post-library.md, si se encuentra disponible.
•	docs/04-testing/screenshots/.
•	index.html y archivos relacionados con la integración de Google Maps.
•	changelog.md.
•	Diff, historial de commits y PR del responsable de la corrección.
Verificaciones solicitadas
•	Verificar que se haya analizado la integración de Google Maps y su relación con las cookies de terceros.
•	Verificar que se hayan investigado las advertencias registradas en Chrome DevTools.
•	Identificar las alternativas de mejora evaluadas y su justificación técnica.
•	Identificar las modificaciones realizadas para resolver o mitigar el problema.
•	Verificar que las correcciones sean funcionales y no afecten negativamente la experiencia del usuario ni otras funcionalidades del proyecto.
•	Verificar que se haya ejecutado una nueva auditoría Lighthouse sobre una versión que incluya las correcciones.
•	Comparar los resultados obtenidos con los valores originales de TC-11 y TC-12: Best Practices de 77 puntos, 29 cookies de terceros y advertencias de tipo Cookie.
•	Verificar si se alcanzó el umbral mínimo de 95 puntos en Best Practices.
•	Verificar si las cookies de terceros y las advertencias de Chrome DevTools fueron eliminadas, reducidas o permanecen sin cambios.
•	Verificar que los resultados estén respaldados mediante evidencias.
•	Verificar que las posibles limitaciones dependientes de servicios externos estén justificadas y documentadas.
•	Verificar que las contribuciones y la resolución de la issue estén registradas en changelog.md y vinculadas a la PR correspondiente.
Resultado esperado
Presentar una tabla de cumplimiento:
Tarea de la issue	Evidencia	Estado
Análisis de Google Maps		
Investigación de las advertencias		
Evaluación de alternativas		
Implementación de correcciones		
Nueva auditoría Lighthouse		
Documentación de resultados y limitaciones		
Cumplimiento del criterio de cierre		
Presentar una comparación de resultados:
Indicador	TC-11	TC-12	Nueva auditoría
Best Practices	77	77	
Cookies de terceros	29	29	
Advertencias de tipo Cookie	Presentes	Presentes	
Finalmente, determinar el estado de la issue:
•	Resuelta: se verificaron las correcciones y se alcanzó el umbral mínimo establecido.
•	Parcialmente resuelta: existen correcciones implementadas, pero quedan verificaciones o tareas pendientes.
•	No resuelta: no se identifican correcciones suficientes.
•	Pendiente de evaluación del Coordinador: existen limitaciones externas debidamente documentadas que impiden alcanzar el criterio de cierre.
Indicar las tareas pendientes, las evidencias que respaldan el resultado y si corresponde recomendar el cierre de la issue.
Restricciones
•	Evaluar exclusivamente los requisitos y el criterio de cierre de esta issue.
•	No considerar la persistencia del problema en TC-12 como un incumplimiento del responsable, dado que esa auditoría es anterior a sus correcciones.
•	No considerar resuelta la issue únicamente porque se haya modificado el código.
•	Si todavía no se ejecutó TC-13 u otra auditoría posterior a las correcciones, diferenciar la implementación realizada de la validación pendiente.
•	No modificar las mediciones originales de TC-11 y TC-12.
•	No inventar evidencias, resultados ni limitaciones técnicas.
•	No modificar archivos, realizar commits, publicar comentarios ni cerrar la issue.
Realizá únicamente la verificación y presentá el resultado. La decisión final sobre el cierre será responsabilidad del Coordinador/DevOps.
```

- **PR revisada y rol:** PR 222
- **Archivos diff de contexto**
- `docs/03-specs/segundo-parcial/spec-tester-qa-segundo-parcial.md`
- `docs/03-specs/segundo-parcial/spec-coord-devops-segundo-parcial.md`
- `docs/03-specs/segundo-parcial/spec-dev-async-fetch.md`
- `docs/03-specs/segundo-parcial/spec-dev-libreria-externa.md`
- `docs/07-librerias/libreria-doc.md`
- `docs/04-testing/test-case-11-lighthouse-baseline.md`
- `docs/04-testing/test-case-12-lighthouse-post-fetch.md`
- `docs/04-testing/test-case-13-lighthouse-post-library.md`
- `docs/04-testing/screenshots/tc-11/`
- `docs/04-testing/screenshots/tc-12/`
- `docs/04-testing/screenshots/tc-13/`
- `docs/04-testing/testing-doc.md`
- `changelog.md`
- **Request Changed en PR**
RC01 — Comparación incompleta. Agregá las deltas explícitas TC-12/TC-11, TC-13/TC-12 y TC-13/TC-11 para las categorías y métricas. Indicá también que Performance 75 en la primera ejecución queda por debajo de 95, sin alterar los resultados originales.
docs/04-testing/test-case-13-lighthouse-post-library.md Linea 50

RC02 — Cambios desde TC-12. Describí los puntos de integración de SweetAlert2 (eliminación de productos; confirmar/cancelar pedido) y aclará que la corrección de Maps 221 no está en el commit auditado. Evitá atribuir causalidad a las puntuaciones.
docs/04-testing/test-case-13-lighthouse-post-library.md Linea 9

RC03 — Seguimiento desactualizado.212 y213 ya tienen comentarios con resultados TC-13; no son borradores pendientes. Actualizá esta sección y testing-doc, enlazá commit/capturas y coordiná la asignación formal: ambas issues siguen abiertas y sin asignados formales en GitHub.
docs/04-testing/test-case-13-lighthouse-post-library.md Linea 187

RC04 — Estado de Maps. TC-13 es anterior a 221 y no valida esa corrección. La captura con Best Practices 100 no verifica cookies después de activar el mapa. Enlazá la comprobación separada de 221 y pedí al Coordinador confirmar el estado de cierre de 214, documentando la limitación sin atribuirle este resultado.
docs/04-testing/test-case-13-lighthouse-post-library.md Linea 148
- **Prompt exacto utilizado (en bloque de código):**
```
Code Review N.º 4 – Tester QA/JS — Lighthouse Post-Library (TC-13)
Rol y objetivo
Asumí el rol de Coordinador/DevOps y revisor técnico.
Realizá una code review de la ejecución y documentación de la auditoría Lighthouse Post-Library (TC-13) del Tester QA/JS, verificando el cumplimiento de los requisitos del docente, la planificación establecida en su spec y los criterios de revisión y aprobación del spec del Coordinador/DevOps.
El objetivo es verificar que la auditoría se haya realizado correctamente después de integrar Fetch y SweetAlert2 en develop, evaluando el impacto de la librería externa mediante la comparación con los resultados del Post-Fetch (TC-12) y analizando la evolución completa del proyecto desde el Baseline (TC-11).
Archivos de contexto
•	docs/03-specs/segundo-parcial/spec-tester-qa-segundo-parcial.md: especificación del rol.
•	docs/03-specs/segundo-parcial/spec-coord-devops-segundo-parcial.md: criterios de coordinación y aprobación.
•	docs/03-specs/segundo-parcial/spec-dev-async-fetch.md: contexto de la implementación asíncrona.
•	docs/03-specs/segundo-parcial/spec-dev-libreria-externa.md: contexto de la integración de SweetAlert2.
•	docs/07-librerias/libreria-doc.md: documentación de la librería externa.
•	docs/04-testing/test-case-11-lighthouse-baseline.md: auditoría inicial.
•	docs/04-testing/test-case-12-lighthouse-post-fetch.md: auditoría de referencia inmediata.
•	docs/04-testing/test-case-13-lighthouse-post-library.md: documentación objeto de revisión.
•	docs/04-testing/screenshots/tc-11/: evidencias del Baseline.
•	docs/04-testing/screenshots/tc-12/: evidencias de la auditoría Post-Fetch.
•	docs/04-testing/screenshots/tc-13/: evidencias de la auditoría Post-Library.
•	docs/04-testing/testing-doc.md: documentación general de testing.
•	changelog.md: registro de contribuciones.
•	Diff, historial de commits, issues y comentarios de revisiones anteriores asociados a la PR.
Requisitos obligatorios del rol — Lighthouse Post-Library
•	Ejecutar la auditoría Lighthouse sobre develop, después de integrar la implementación de Fetch y la librería externa.
•	Verificar los umbrales mínimos establecidos: Performance ≥95, Accessibility ≥95, Best Practices ≥95 y SEO ≥95.
•	Documentar la fecha, URL evaluada, rama, commit, navegador y versión de la auditoría, según los criterios de coordinación.
•	Identificar los cambios implementados respecto del TC-12, incluyendo la incorporación de SweetAlert2, sus puntos de integración y las correcciones adicionales que puedan afectar los resultados.
•	Registrar los puntajes de las cuatro categorías y las métricas de Performance: First Contentful Paint (FCP), Largest Contentful Paint (LCP), Total Blocking Time (TBT), Cumulative Layout Shift (CLS) y Speed Index.
•	Comparar numéricamente los puntajes y métricas obtenidos con los resultados del TC-12.
•	Presentar una comparación evolutiva completa de las tres auditorías: TC-11, TC-12 y TC-13.
•	Analizar el impacto de la librería externa sobre el rendimiento, la accesibilidad, las buenas prácticas y el SEO.
•	Identificar las mejoras, regresiones y resultados que permanecen sin cambios respecto de las auditorías anteriores.
•	Documentar los problemas detectados, las observaciones y las recomendaciones de optimización proporcionadas por Lighthouse.
•	Documentar las limitaciones de comparabilidad cuando existan diferencias relevantes entre las condiciones de ejecución.
•	Adjuntar las capturas de pantalla correspondientes a los resultados obtenidos.
•	Verificar el estado de las issues detectadas durante TC-11 y TC-12, incluyendo las correcciones implementadas por los responsables.
•	Crear o actualizar las issues correspondientes a los problemas persistentes, las nuevas regresiones y los resultados inferiores a los umbrales establecidos.
•	Coordinar con el Coordinador/DevOps la asignación y priorización de las correcciones pendientes.
•	Documentar las conclusiones y recomendaciones finales de las tres auditorías.
•	Actualizar la documentación de testing y registrar las contribuciones correspondientes en changelog.md.
Verificaciones solicitadas
1. Cumplimiento de la consigna y planificación
•	Verificar el cumplimiento de cada requisito obligatorio correspondiente al TC-13.
•	Comparar la ejecución y documentación de la auditoría con la planificación establecida en el BEFORE del Tester QA/JS.
•	Verificar el cumplimiento de todos los criterios aplicables al TC-13 establecidos en el spec del Coordinador/DevOps.
•	Validar que la auditoría se haya ejecutado sobre la versión correcta de develop, respetando el orden de integración establecido.
•	Verificar mediante el historial de commits que las implementaciones de Fetch y SweetAlert2 se encontraban integradas al momento de ejecutar la auditoría.
•	Verificar que los cambios implementados descritos en el test case coincidan con la implementación real del Desarrollador JS Librerías Externas.
•	Identificar las correcciones adicionales incorporadas entre TC-12 y TC-13 que puedan influir en los resultados.
2. Resultados y evidencias de Lighthouse
•	Contrastar los puntajes, métricas y observaciones documentadas con las capturas de pantalla y demás evidencias disponibles.
•	Verificar que se documenten las cuatro categorías de Lighthouse.
•	Verificar que se registren todas las métricas de Performance solicitadas.
•	Verificar que los resultados se evalúen utilizando los umbrales mínimos establecidos de 95 puntos.
•	Identificar resultados inferiores a los umbrales y verificar su documentación.
•	Verificar que las mediciones originales del TC-13 se conserven sin alteraciones.
•	Verificar que las capturas correspondan efectivamente a la auditoría Post-Library y que sus enlaces sean correctos.
3. Comparación con Post-Fetch (TC-12)
•	Verificar que los valores utilizados como referencia coincidan con los resultados originales documentados en el TC-12.
•	Verificar que se presente una comparación numérica de los puntajes de Performance, Accessibility, Best Practices y SEO.
•	Verificar que se comparen numéricamente las métricas FCP, LCP, TBT, CLS y Speed Index.
•	Verificar que las diferencias calculadas sean correctas y que las unidades de medida sean consistentes.
•	Verificar que se interprete correctamente si cada diferencia representa una mejora, una regresión o un resultado sin cambios.
•	Verificar que las condiciones de ejecución sean suficientemente comparables.
•	Identificar diferencias relevantes de navegador, dispositivo, configuración, servidor o entorno de ejecución que puedan afectar la comparación.
•	Verificar que las limitaciones de comparabilidad estén documentadas cuando corresponda.
•	No exigir parámetros específicos de throttling, caché o red que no hayan sido establecidos como requisitos obligatorios. Si su ausencia limita la interpretación, registrarlo como recomendación de mejora, según su impacto.
4. Comparación evolutiva completa — TC-11, TC-12 y TC-13
•	Verificar que se presente una comparación evolutiva de las tres auditorías Lighthouse.
•	Contrastar los puntajes y métricas utilizados con los resultados originales de cada test case.
•	Verificar las diferencias numéricas correspondientes a:
•	TC-12 respecto de TC-11.
•	TC-13 respecto de TC-12.
•	TC-13 respecto de TC-11.
•	Verificar que se identifiquen las mejoras, regresiones y problemas persistentes durante las distintas etapas del desarrollo.
•	Verificar que se determine el estado final de cada categoría respecto del umbral mínimo establecido.
•	Diferenciar el impacto de Fetch, el impacto de SweetAlert2 y el impacto de las correcciones adicionales incorporadas.
•	Verificar que las conclusiones reflejen correctamente la evolución del proyecto durante el Segundo Parcial.
5. Análisis del impacto de la librería externa
•	Verificar que se analice el impacto de SweetAlert2 sobre las cuatro categorías de Lighthouse.
•	Identificar mejoras y regresiones respecto del TC-12.
•	Verificar que las conclusiones se encuentren respaldadas por los resultados y evidencias disponibles.
•	Diferenciar los problemas preexistentes de TC-11 y TC-12 de aquellos detectados después de integrar SweetAlert2.
•	Verificar que no se atribuyan automáticamente las variaciones de rendimiento, accesibilidad, buenas prácticas o SEO a la librería externa sin evidencia suficiente.
•	Considerar las modificaciones adicionales incorporadas durante el mismo período que puedan afectar los resultados.
•	Verificar que las recomendaciones de optimización proporcionadas por Lighthouse estén correctamente identificadas e interpretadas.
•	Diferenciar las recomendaciones originales de Lighthouse de las propuestas adicionales realizadas por el Tester QA/JS.
•	Verificar que las conclusiones permitan establecer el estado del proyecto después de incorporar las dos funcionalidades principales del Segundo Parcial.
6. Gestión de issues y verificación de correcciones anteriores
•	Verificar que los problemas detectados y los resultados inferiores a los umbrales se encuentren respaldados mediante issues.
•	Contrastar los problemas identificados en TC-13 con las issues existentes del TC-11 y TC-12.
•	Verificar que se hayan reevaluado las issues cuya corrección fue postergada por el Coordinador/DevOps.
•	Identificar las correcciones realizadas por los responsables y verificar sus resultados mediante las evidencias de TC-13, siempre que dichas correcciones estén incluidas en el commit evaluado.
•	Verificar que se diferencie entre problemas resueltos, parcialmente resueltos, persistentes y nuevos.
•	Verificar que los problemas persistentes se encuentren vinculados a las issues correspondientes, evitando duplicaciones innecesarias.
•	Verificar que las nuevas regresiones o problemas detectados generen issues cuando corresponda.
•	Verificar que las issues incluyan la descripción del problema, pasos para reproducir, evidencias y criterios de cierre.
•	Verificar que se contemple su asignación al rol correspondiente y su priorización en coordinación con el Coordinador/DevOps.
•	Verificar que las issues actualizadas incorporen los resultados y evidencias del TC-13.
•	Verificar que las issues que todavía no cumplan su criterio de cierre permanezcan abiertas.
•	Verificar que no se considere resuelta una issue únicamente porque se haya modificado el código.
•	Identificar si resulta necesario realizar auditorías adicionales después de implementar las correcciones pendientes.
7. Verificación de la issue de Google Maps y Best Practices
Verificar específicamente el estado de la issue relacionada con las cookies de terceros de Google Maps, asignada al Desarrollador JS Librerías Externas.
Utilizar como referencia los siguientes resultados documentados:
Indicador | TC-11 | TC-12
Best Practices | 77 | 77
Cookies de terceros | 29 | 29
Advertencias de tipo Cookie | Presentes | Presentes
Realizar las siguientes verificaciones:
•	Verificar si las correcciones realizadas por el responsable se encuentran incorporadas en el commit evaluado durante TC-13.
•	Identificar el puntaje obtenido en Best Practices.
•	Verificar si las cookies de terceros asociadas a Google Maps fueron eliminadas, reducidas o permanecen sin cambios.
•	Verificar si persisten las advertencias relacionadas con cookies en Chrome DevTools.
•	Contrastar los resultados con las evidencias disponibles.
•	Verificar si se alcanzó el criterio de cierre establecido de 95 puntos en Best Practices.
•	Verificar que las posibles limitaciones dependientes de servicios externos estén documentadas.
•	Verificar que la issue haya sido actualizada con los resultados del TC-13.
•	Determinar si corresponde recomendar su cierre, mantenerla abierta o solicitar una evaluación del Coordinador/DevOps por limitaciones externas.
No considerar resuelta la issue si las correcciones todavía no fueron evaluadas mediante una auditoría correspondiente a la versión que las incorpora.
8. Documentación, conclusiones finales y trazabilidad
•	Verificar que test-case-13-lighthouse-post-library.md contenga todos los apartados solicitados.
•	Verificar que se actualice docs/04-testing/testing-doc.md con la información y los enlaces correspondientes al TC-13.
•	Verificar que changelog.md registre las contribuciones realizadas.
•	Verificar la trazabilidad entre spec, test cases, evidencias, issues, commits, PR y changelog.md.
•	Verificar que se respeten las mediciones originales de TC-11, TC-12 y TC-13.
•	Verificar el cumplimiento de los criterios de aceptación del spec correspondientes a las auditorías Lighthouse.
•	Verificar que se documenten las conclusiones finales de la evolución del proyecto.
•	Verificar que se identifiquen las categorías que alcanzaron los umbrales y aquellas que todavía requieren optimización.
•	Verificar que se documenten las recomendaciones finales y las acciones pendientes.
•	Identificar omisiones, contradicciones, errores de interpretación, diferencias numéricas incorrectas y documentación faltante.
Resultado esperado
1.	Una tabla de cumplimiento de los requisitos, indicando requisito, fuente, evidencia y estado (Cumple, No cumple, Cumple parcialmente o No verificable).
2.	Una tabla de validación de las comparaciones entre TC-12 y TC-13, utilizando la siguiente estructura:
Categoría o métrica | TC-12 | TC-13 | Diferencia | Interpretación | Estado de validación
1.	Una tabla de evolución completa de las tres auditorías:
Categoría o métrica | TC-11 | TC-12 | TC-13 | Diferencia TC-12/TC-11 | Diferencia TC-13/TC-12 | Diferencia TC-13/TC-11
1.	Una tabla del estado final de los umbrales establecidos:
Categoría | Umbral mínimo | Resultado TC-13 | Estado
1.	Los hallazgos identificados, utilizando la siguiente estructura:
RC01 – Título del hallazgo
•	Severidad: Crítico / Alto / Medio / Bajo.
•	Archivo:
•	Línea o rango de líneas:
•	Requisito incumplido:
•	Problema detectado:
•	Corrección solicitada:
•	Comentario inline para GitHub:
1.	Estado de las issues relacionadas con las tres auditorías:
Issue | Problema | Evidencia TC-13 | Criterio de cierre | Estado | Acción pendiente
Diferenciar problemas resueltos, parcialmente resueltos, persistentes, nuevos y pendientes de evaluación.
1.	Recomendaciones no bloqueantes, si corresponde.
2.	Resultado final de la revisión: APPROVE, REQUEST CHANGES o COMMENT, con su justificación.
Formato de los comentarios en GitHub
Una vez realizada la code review, presentar la totalidad de los hallazgos y solicitar autorización al Coordinador/DevOps para publicarlos.
Una vez autorizada la publicación, deberá registrarse obligatoriamente un comentario general en la PR que incluya todos los hallazgos identificados durante la code review, utilizando la estructura definida a continuación.
Cada hallazgo deberá presentarse individualmente dentro del comentario general, manteniendo su numeración y trazabilidad con el resultado de la revisión.
Solicitar autorización adicional al Coordinador/DevOps para publicar los hallazgos mediante comentarios inline sobre las líneas correspondientes del diff, incluyendo una explicación de la corrección solicitada.
Ambos formatos son complementarios. Los comentarios inline no reemplazan ni eliminan los hallazgos registrados en el comentario general.
FORMATO DEL COMENTARIO
════════════════════════════════════════════════════════════
HALLAZGO #N
Archivo: [nombre del archivo]
Línea: [número de línea / sección]
Tipo de problema: [bug | diseño | legibilidad | documentación | otro]
Severidad: [baja | media | alta | crítica]
Explicación técnica
[Descripción clara del problema detectado, el requisito incumplido y su impacto.]
Sugerencia de mejora
[Descripción de la modificación recomendada para resolver o mejorar el hallazgo.]
Ejemplo de código corregido (si aplica)
Antes:
[Contenido actual]
Después:
[Contenido sugerido]
DECISIÓN DEL REVISOR HUMANO
•	Aceptar sugerencia.
•	Rechazar sugerencia.
Justificación del revisor humano:
[Completar manualmente si se rechaza]
════════════════════════════════════════════════════════════
Consideraciones para los comentarios
•	Mantener la correspondencia entre el número del hallazgo y su identificador RC.
•	Si no existe una línea específica, indicar la sección o el archivo afectado.
•	Si el problema corresponde a documentación, utilizar ejemplos de texto, tablas o Markdown en lugar de código, cuando corresponda.
•	Diferenciar los incumplimientos obligatorios de las recomendaciones no bloqueantes.
•	No duplicar hallazgos que correspondan al mismo problema.
•	No inventar contenido actual, números de línea, métricas ni evidencias.
•	Dejar sin completar la decisión y la justificación del revisor humano.
•	Utilizar obligatoriamente codificación UTF-8.
•	Preservar las tildes, la letra ñ, los caracteres especiales, los separadores y el formato Markdown.
•	Si se utiliza GitHub CLI, preparar el comentario en un archivo Markdown temporal con codificación UTF-8 y publicarlo mediante --body-file.
•	Verificar que el comentario publicado conserve correctamente los caracteres y el formato original.
•	No publicar comentarios hasta contar con la autorización expresa del Coordinador/DevOps.
Restricciones
•	Evaluar exclusivamente la ejecución y documentación de Lighthouse Post-Library (TC-13) y la comparación evolutiva de las tres auditorías.
•	Utilizar el BEFORE aprobado como referencia, sin repetir su revisión.
•	Utilizar TC-11 y TC-12 como referencias comparativas, sin realizar nuevamente sus code reviews.
•	No exigir la implementación de api.spec.js, library.spec.js ni otras pruebas automatizadas.
•	No realizar una nueva code review completa de las implementaciones del Desarrollador JS Asíncrono o del Desarrollador JS Librerías Externas.
•	No atribuir al Tester QA la responsabilidad de corregir el código de producción.
•	No considerar los puntajes inferiores a los umbrales como un incumplimiento del Tester QA si fueron correctamente documentados, analizados y reportados, sin considerar por ello alcanzados los objetivos del proyecto.
•	No exigir al Tester QA resolver las issues correspondientes a otros roles, pero sí verificar, documentar y reportar su estado.
•	No considerar cerradas las issues cuyas correcciones todavía no hayan sido validadas o evaluadas por el Coordinador/DevOps.
•	No exigir que TC-13 demuestre la efectividad de correcciones que no se encuentren incorporadas en el commit auditado.
•	No modificar las mediciones originales para reflejar correcciones posteriores. Las nuevas mediciones deberán documentarse como auditorías adicionales.
•	No exigir parámetros de ejecución que no estén establecidos en la consigna o en los specs aplicables.
•	Diferenciar los requisitos explícitos del docente de los criterios adicionales del Coordinador/DevOps.
•	No exigir el AT CLOSE completo del rol, dado que esta revisión se limita a las auditorías Lighthouse.
•	No generar Request Changes por requisitos ajenos al alcance del TC-13 o mejoras opcionales.
•	No presentar como verificadas evidencias que no se encuentren disponibles.
•	No inventar requisitos, evidencias, resultados ni números de línea.
•	No modificar archivos, realizar commits, cerrar issues, aprobar PRs ni realizar merges.
Realizá únicamente la code review. La decisión final será responsabilidad del Coordinador/DevOps. Si el Coordinador lo autoriza, se pueden comentar los hallazgos respetando los formatos establecidos.
```

- **PR revisada y rol:** PR 224
- **Archivos diff de contexto**
- `docs/03-specs/segundo-parcial/spec-coord-devops-segundo-parcial.md`
- `Issue 212, incluyendo sus actualizaciones de TC-11, TC-12 y TC-13`
- `docs/03-specs/segundo-parcial/spec-tester-qa-segundo-parcial.md`
- `docs/04-testing/test-case-11-lighthouse-baseline.md`
- `docs/04-testing/test-case-12-lighthouse-post-fetch.md`
- `docs/04-testing/test-case-13-lighthouse-post-library.md`
- `docs/04-testing/testing-doc.md`
- **Request Changed en PR**
- **Prompt exacto utilizado (en bloque de código):**
```
Asumí el rol de Tester QA/JS - Testing Avanzado del proyecto FerroLab y realizá una revisión técnica de la Pull Request correspondiente a la resolución de la Issue #212 — Performance inferior al umbral mínimo.
Contexto de la revisión
Utilizá como referencia:
•	Issue #212, incluyendo sus actualizaciones de TC-11, TC-12 y TC-13.
•	docs/03-specs/segundo-parcial/spec-tester-qa-segundo-parcial.md
•	docs/04-testing/test-case-11-lighthouse-baseline.md
•	docs/04-testing/test-case-12-lighthouse-post-fetch.md
•	docs/04-testing/test-case-13-lighthouse-post-library.md
•	docs/04-testing/testing-doc.md
•	Evidencias de Lighthouse incorporadas en la PR.
•	Archivos modificados y diferencias de la PR respecto de develop.
Puntos que deben verificarse
1.	Correcciones implementadas: verificar que las optimizaciones respondan a los hallazgos de Lighthouse relacionados con imágenes, caché, recursos que bloquean el renderizado, minificación, código no utilizado y descubrimiento del recurso LCP. Identificar cuáles fueron resueltos y cuáles permanecen pendientes, verificando su justificación.
2.	Criterio de cierre: comprobar mediante una nueva auditoría Lighthouse, en modo Navigation y dispositivo Desktop, que Performance alcance un mínimo de 95 puntos. No considerar suficiente el resultado histórico de 96 puntos obtenido en TC-13.
3.	Trazabilidad: verificar que se identifique el commit evaluado, las condiciones de ejecución, la versión del navegador y Lighthouse, el servidor utilizado, las condiciones de red y caché, las dimensiones de visualización y la desactivación de Local Overrides.
4.	Comparación de resultados: comprobar que se comparen numéricamente Performance, FCP, LCP, TBT, CLS y Speed Index respecto de TC-11, TC-12 y TC-13. Verificar que se documenten las limitaciones de comparabilidad.
5.	Regresiones: verificar que las optimizaciones no afecten los cuatro flujos funcionales, la carga asíncrona mediante Fetch, los mecanismos de respaldo, SweetAlert2 ni las correcciones correspondientes a las Issues #213 (CLS) y #214 (Google Maps). Revisar las evidencias de las pruebas Jasmine y comprobar que Accessibility, Best Practices y SEO mantengan el umbral mínimo de 95 puntos.
6.	Documentación y evidencias: verificar que las correcciones, resultados, capturas y contribuciones estén correctamente documentados y sean trazables con la Issue #212.
Criterios de revisión
No exigir la implementación de todas las recomendaciones de Lighthouse si las optimizaciones realizadas permiten cumplir el criterio de cierre y las recomendaciones restantes están justificadas.
No atribuir mejoras de rendimiento a una modificación específica sin evidencia que lo demuestre.
Formato de los hallazgos
Por cada incumplimiento detectado, indicar:
•	Identificador: RC01, RC02, RC03, etc.
•	Título del hallazgo.
•	Archivo y línea.
•	Severidad: crítica, alta, media o baja.
•	Explicación técnica.
•	Corrección solicitada.
Finalizar con un checklist de cumplimiento de la Issue #212 y un veredicto que indique si la PR cumple el criterio de cierre, requiere correcciones o presenta evidencias insuficientes.
Realizá únicamente la revisión técnica. No modifiques archivos, no generes commits, no apruebes la PR ni cierres la Issue. No declares verificaciones exitosas si no pudieron ejecutarse o comprobarse mediante evidencias.
```