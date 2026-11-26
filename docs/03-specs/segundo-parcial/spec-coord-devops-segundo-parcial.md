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
- [ ] El BEFORE del spec se encuentra commiteado antes de escribir código e incluye la selección y justificación de la fuente de datos, el diseño de los estados de carga, las funciones de orden superior previstas y los criterios de aceptación.
- [ ] El BEFORE define la estructura y responsabilidades de apiService.js, la estrategia de gestión de errores, reintentos y fallbacks, la validación y sanitización de datos, y la integración con el DOM, POO y Storage, respetando las responsabilidades de js/script.js como controlador.
- [ ] Se planifican los casos de prueba en coordinación con el Tester QA y las verificaciones necesarias para evitar regresiones en los cuatro flujos existentes.
#### Criterios de revisión y aprobación
- [ ] Se implementa el consumo asíncrono de datos mediante `fetch()` y promesas.
- [ ] Se verifica el estado de la respuesta HTTP y se procesa correctamente el JSON.
- [ ] Se implementa `try-catch` para gestionar los errores de las operaciones asíncronas, incluyendo errores HTTP y de red.
- [ ] Se muestran estados visuales `loading`, `success` y `error` en la interfaz.
- [ ] Se presentan mensajes de error comprensibles para el usuario.
- [ ] Se implementan reintentos o fallbacks cuando corresponda, o se justifica por qué no son necesarios.
- [ ] Se utilizan `map()`, `filter()` y `reduce()` para transformar, filtrar y agregar o calcular datos respectivamente, con un propósito coherente con la implementación.
- [ ] Los datos recibidos se validan y sanitizan antes de ser utilizados.
- [ ] Los datos obtenidos se integran dinámicamente con el DOM.
- [ ] El consumo de datos se encuentra encapsulado en un módulo dedicado.
- [ ] Se respetan los contratos de las clases POO existentes y se coordina la persistencia con Storage cuando resulte necesaria.
- [ ] `js/script.js` conserva exclusivamente sus responsabilidades de controlador, eventos, DOM y orquestación; no duplica reglas de negocio ni incorpora detalles de persistencia o consumo de API.
- [ ] Los cuatro flujos existentes de FerroLab mantienen su funcionamiento: búsqueda y filtrado, carrito, pago y cuotas, y resumen y confirmación del pedido.
- [ ] Se incorporan comentarios JSDoc en los módulos nuevos y funciones complejas.
- [ ] Se coordinan con el Tester QA los casos de prueba de las funciones asíncronas.
- [ ] Se responden las issues reportadas por QA y se documenta su resolución.
- [ ] El AT CLOSE del spec contiene el prompt exacto utilizado, los ajustes manuales realizados, el resumen de integración con POO y Storage, y las issues respondidas con su resolución.
- [ ] Se cumplen los criterios generales de aprobación y se actualiza el changelog.

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
- [ ] El BEFORE del spec se encuentra commiteado antes de integrar la librería e incluye la necesidad, justificación, nombre, versión, CDN, al menos dos puntos de integración, decisiones de arquitectura, consistencia visual y criterios de aceptación.
- [ ] El BEFORE define la estrategia de integración y configuración de la librería, la necesidad de un módulo wrapper, la compatibilidad con Bootstrap y los módulos existentes, respetando las responsabilidades de js/script.js como controlador.
- [ ] Se planifican los casos de prueba en coordinación con el Tester QA, las verificaciones necesarias para evitar regresiones en los cuatro flujos existentes y la coordinación con el Desarrollador JS Asíncrono cuando corresponda.
#### Criterios de revisión y aprobación
- [ ] La necesidad que justifica la librería se encuentra identificada y documentada.
- [ ] La librería aporta una funcionalidad no resuelta mediante código propio; no se limita a sustituir una funcionalidad existente.
- [ ] Se identifica el nombre y la versión utilizada.
- [ ] La integración se realiza correctamente mediante CDN y la configuración respeta la documentación oficial.
- [ ] Se justifica la decisión de implementar o no un módulo wrapper y se incorpora cuando resulte necesario.
- [ ] La librería funciona en al menos dos puntos diferentes de la aplicación.
- [ ] La funcionalidad incorporada mejora la experiencia del usuario y mantiene la consistencia visual con FerroLab.
- [ ] No se incorpora lógica de negocio dentro de `js/script.js` ni se duplican responsabilidades del dominio.
- [ ] No se introducen incompatibilidades con Bootstrap o los módulos existentes ni regresiones en los cuatro flujos.
- [ ] `libreria-doc.md` contiene nombre, versión, propósito, beneficios, justificación técnica, instalación e integración, ejemplos de uso y enlaces a la documentación oficial.
- [ ] Se incluyen capturas de pantalla de los puntos de integración.
- [ ] Se coordina con el Tester QA la validación de la librería y con el Desarrollador JS Asíncrono cuando la librería interactúe con datos de la API.
- [ ] Se responden las issues relacionadas con el funcionamiento de la librería.
- [ ] El AT CLOSE contiene el prompt exacto utilizado en Copilot Agent en bloque de código, un fragmento de la integración final, los ajustes manuales, los dos puntos de uso y cómo mejoran la experiencia del usuario, la coordinación con Fetch si corresponde y las issues respondidas.
- [ ] Se cumplen los criterios generales de aprobación y se actualiza el changelog.

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

- [ ] `api.spec.js` contiene pruebas de respuesta exitosa, error HTTP y error de red.
- [ ] Se verifica el procesamiento de datos mediante `map()`, `filter()` y `reduce()`.
- [ ] Se prueba la integración de los datos con el DOM cuando corresponde.
- [ ] `library.spec.js` contiene pruebas de inicialización, configuración correcta, funcionalidad principal, manejo de errores e interacción con otras partes del sistema.
- [ ] Las pruebas verifican comportamientos reales de los módulos y no dependen innecesariamente de servicios externos; se utilizan mocks o spies cuando corresponde.
- [ ] Las nuevas suites se ejecutan correctamente mediante el runner de Jasmine.
- [ ] Se refactoriza `script.spec.js` si resulta necesario y se actualiza `models.spec.js` si se modifican las clases POO.
- [ ] Se mantiene o mejora la cobertura de testing y se verifica que no se introduzcan regresiones en las pruebas existentes.
- [ ] Se documentan los resultados reales de ejecución, incluyendo la cantidad de tests exitosos y fallidos.

#### Criterios de revisión y aprobación — Lighthouse

- [ ] El Test Case 11 (Baseline) se ejecuta sobre `develop` después del backport de la cuarta entrega y antes de incorporar las nuevas funcionalidades.
- [ ] El Test Case 12 (Post-Fetch) se ejecuta después de integrar Fetch en `develop` y antes de integrar la librería externa.
- [ ] El Test Case 13 (Post-Librería) se ejecuta después de integrar la librería externa en `develop`.
- [ ] Se establecen umbrales mínimos de 95 puntos para Performance, Accessibility, Best Practices y SEO.
- [ ] Cada auditoría identifica la fecha, URL evaluada, rama, navegador y versión; se registra también el commit evaluado y se mantienen condiciones de medición comparables como criterio adicional de coordinación.
- [ ] Se documentan los puntajes de las cuatro categorías y las métricas de Performance: First Contentful Paint (FCP), Largest Contentful Paint (LCP), Total Blocking Time (TBT), Cumulative Layout Shift (CLS) y Speed Index.
- [ ] Se documentan los problemas y observaciones de Accessibility, Best Practices y SEO.
- [ ] El Test Case 12 compara sus resultados con el baseline, analiza el impacto de Fetch y documenta las recomendaciones de optimización.
- [ ] El Test Case 13 compara sus resultados con el estado post-fetch, presenta la evolución completa y analiza el impacto de la librería con recomendaciones finales.
- [ ] Se adjuntan capturas de pantalla correspondientes a los tres momentos de ejecución.
- [ ] Los resultados inferiores a los umbrales se documentan sin alterar las mediciones y generan issues de mejora; se verifica su resolución según corresponda.

#### Criterios de revisión y aprobación — Issues, documentación y cierre

- [ ] Se crean issues detalladas para todos los problemas detectados en las pruebas y auditorías y se asignan a los roles correspondientes.
- [ ] Se coordina con el Coordinador/DevOps la priorización de las correcciones y con los desarrolladores la definición y validación de los casos de prueba.
- [ ] Se verifica y documenta el estado de resolución de las issues.
- [ ] Se actualiza `js/test/testing-doc.md` y `docs/04-testing/testing-doc.md`, incluyendo los enlaces a los nuevos test cases.
- [ ] El AT CLOSE contiene el prompt exacto utilizado para generar los tests en bloque de código y los archivos adjuntados como contexto, cuando se utilice IA; si no se utiliza, se documenta la decisión conforme a la planificación.
- [ ] El AT CLOSE contiene los resultados de los tests (exitosos y fallidos), las capturas de las tres auditorías, la cantidad de issues reportadas, sus responsables y estados de resolución, y los ajustes manuales sobre los tests generados con IA cuando corresponda.
- [ ] Se cumplen los criterios generales de aprobación y se actualiza el changelog.

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

- [ ] La rama utiliza el prefijo `feature/` y nomenclatura kebab-case conforme al rol y la tarea.
- [ ] Existe al menos una issue asociada a la tarea y un commit relevante del integrante en su PR.
- [ ] Se utiliza la plantilla correspondiente y la PR tiene como destino `develop`.
- [ ] El BEFORE del spec se encuentra commiteado antes de comenzar las tareas y el AT CLOSE se completa con las evidencias reales al finalizar el rol.
- [ ] Los cambios respetan el alcance del rol y cualquier modificación adicional se encuentra justificada.
- [ ] Los archivos respetan las convenciones de nomenclatura y la estructura del proyecto.
- [ ] No se incorporan `console.log` innecesarios ni código comentado sin justificación.
- [ ] Las funciones complejas y módulos nuevos cuentan con comentarios JSDoc.
- [ ] El código funciona y no introduce errores críticos ni regresiones en las funcionalidades existentes.
- [ ] La documentación se encuentra actualizada y coincide con la implementación.
- [ ] Se verifica la trazabilidad entre issue, commits, spec, PR y `changelog.md`, incluyendo los enlaces correspondientes una vez disponibles.
- [ ] La rama se encuentra actualizada respecto de `develop` y no presenta conflictos pendientes.
- [ ] La PR cuenta con code review asistida con IA, revisión manual y aprobación antes de realizar el Rebase and merge a `develop`, respetando la protección de ramas.

## Proceso de code review

Se utilizará GitHub Copilot en modo Agente para asistir en las revisiones, adjuntando como contexto la consigna del Segundo Parcial, `plan.md`, el spec del rol evaluado, el presente spec, el diff respecto de la rama de destino, los archivos modificados y los módulos o documentación relacionados cuando corresponda.

Se solicitará verificar los requisitos del rol, los criterios de aceptación aplicables, los errores funcionales, problemas de arquitectura, regresiones y documentación faltante. La revisión se limitará al alcance de la PR, sin realizar modificaciones automáticas en el código de otros integrantes.

El Coordinador contrastará manualmente las observaciones de IA con los archivos y la consigna. Los incumplimientos confirmados se registrarán mediante comentarios inline en las líneas correspondientes del diff y se solicitarán Request Changes cuando corresponda. La aprobación se realizará después de verificar las correcciones y los criterios aplicables. No se generarán observaciones artificiales para alcanzar el mínimo de revisiones.

Se registrará por cada PR el prompt exacto utilizado en bloque de código, los archivos y diff adjuntados como contexto, los requisitos verificados, las observaciones y líneas afectadas, los Request Changes solicitados, las correcciones verificadas y el resultado de la revisión.

Se conservarán los prompts originales utilizados en cada code review, junto con los archivos adjuntados como contexto y las observaciones realizadas, con el objetivo de garantizar la trazabilidad y transparencia del proceso de revisión de las Pull Requests.

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

- [ ] Dadas las correcciones de AO3 y AO4, cuando se establece la base del parcial, entonces se verifica que se encuentren resueltas, incorporadas y documentadas.
- [ ] Dada la cuarta entrega, cuando se obtiene el LGTM y Approve, entonces se realiza el merge a `master` y el backport aprobado hacia `develop`.
- [ ] Dado cada integrante, cuando comienza sus tareas, entonces cuenta con la issue, rama y spec correspondiente commiteado previamente.
- [ ] Dadas las PRs del equipo, cuando se realiza su revisión, entonces se verifican los criterios generales y específicos aplicables a cada rol.
- [ ] Dadas las PRs de los demás integrantes, cuando se realiza la coordinación, entonces se documentan al menos cuatro PRs distintas revisadas mediante IA, con prompts, contexto, observaciones y resultados.
- [ ] Dado un incumplimiento confirmado, cuando se revisa la PR, entonces se realizan comentarios inline y se solicitan Request Changes cuando corresponde.
- [ ] Dada una PR con Request Changes, cuando vuelve a revisión, entonces se verifica su resolución antes de aprobarla.
- [ ] Dadas las nuevas funcionalidades, cuando se integran en `develop`, entonces se respeta el orden de las tres auditorías Lighthouse.
- [ ] Dadas las tareas del equipo, cuando se consulta GitHub Projects, entonces se identifican responsables, prioridades y estados.
- [ ] Dadas las contribuciones individuales, cuando se revisa el changelog, entonces se encuentran sus aportes y enlaces a PRs e issues.
- [ ] Dado el repositorio, cuando se prepara la entrega, entonces se verifica su visibilidad pública, colaboradores, estructura, protección de ramas y plantillas.
- [ ] Dada la finalización del desarrollo, cuando se prepara la release, entonces `README.md` y `changelog.md` se encuentran actualizados.
- [ ] Dada la PR propia del Coordinador, cuando se integra a `develop`, entonces cuenta con la revisión y aprobación de otro integrante.
- [ ] Dada la rama `release/segundo-parcial` creada desde `develop`, cuando se verifica GitHub Pages, entonces la aplicación se encuentra publicada y funcionando en esa rama.
- [ ] Dada la entrega inicial, cuando se publica la PR de release antes del 27 de noviembre de 2026 a las 23:55 hs, entonces se respeta el título, se notifica en Slack al docente y al equipo, y se realiza la entrega individual en el campus.

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
| 1 | Pendiente | Pendiente | Pendiente | Pendiente |
| 2 | Pendiente | Pendiente | Pendiente | Pendiente |
| 3 | Pendiente | Pendiente | Pendiente | Pendiente |
| 4 | Pendiente | Pendiente | Pendiente | Pendiente |

#### Detalle de cada code review (repetir por PR)

- **PR revisada y rol:** Pendiente.
- **Prompt exacto utilizado (en bloque de código):** Pendiente.
- **Archivos y diff adjuntados como contexto:** Pendiente.
- **Requisitos y criterios verificados:** Pendiente.
- **Observaciones, archivos y líneas del diff:** Pendiente.
- **Request Changes solicitados y enlaces a comentarios inline:** Pendiente.
- **Correcciones verificadas y resultado de la revisión:** Pendiente.

### Correcciones de AO4, aprobación y backport inicial

Pendiente.

### Integración de ramas feature y coordinación de auditorías Lighthouse

Pendiente.

### Actualización de README.md, changelog.md y estructura del proyecto

Pendiente.

### Gestión de issues y GitHub Projects

Pendiente.

### Preparación de release, GitHub Pages, Slack y entrega en campus

Pendiente.

### Fase 2 — Request Changes del docente

| Request Change / enlace | Issue | Rol asignado | Prioridad | PR de corrección | Estado / resolución |
|---|---|---|---|---|---|
| Pendiente | Pendiente | Pendiente | Pendiente | Pendiente | Pendiente |

### Reasignaciones de responsabilidades y contingencias

Pendiente. Se documentarán fecha, decisión, justificación, responsable y notificación, si corresponde.

### Obstáculos encontrados durante la coordinación y soluciones aplicadas

Pendiente.

### Aprobación definitiva, merge, tag, release y backport final

Pendiente.

### Justificación y evidencias

Pendiente. Se incorporarán los enlaces a commits, PRs, issues, comentarios de revisión, capturas y demás evidencias correspondientes al trabajo efectivamente realizado.
