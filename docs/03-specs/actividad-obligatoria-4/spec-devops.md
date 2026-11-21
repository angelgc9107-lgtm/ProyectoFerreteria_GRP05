# Spec — Coordinador / DevOps (Actividad Obligatoria N°4)

Rama: `feature/coord-devops-cuarta-entrega` → `develop`

Este spec se commitea **antes** de cualquier otra tarea de coordinación de la entrega.

---

## BEFORE — Planificación

### Plan de coordinación

Orden esperado de PRs y de integración:

| # | PR | Base | Cuándo | Notas |
|---|---|---|---|---|
| 1 | `fix/<nombre-del-fix>` (una por cada corrección de la Actividad N°3) | `release/tercera-entrega` | Primero | Merge directo (la release no está protegida); se registra en `changelog.md` bajo `[Fixed]` con el link a la PR; se avisa al docente en Slack con ✅ cuando quedan resueltos todos los comentarios |
| 2 | `backport/release-tercera-entrega` | `develop` | Cuando la release de la tercera entrega esté aprobada (LGTM) y mergeada a `master` | Se crea desde `master`; requiere la aprobación de otro integrante |
| 3 | `feature/coord-devops-cuarta-entrega` | `develop` | Desde el inicio | Este spec va primero; después README, changelog, GitHub Pages y releases |
| 4 | `feature/dev-poo-logica-negocio` | `develop` | Primero entre las de código | Las clases de `js/models/` son la base de los demás roles |
| 5 | `feature/dev-storage` | `develop` | Después de POO | `js/utils/storage.js` usa las clases del dominio |
| 6 | `feature/dev-eventos-dom` | `develop` | Después de POO y Storage | `js/script.js` pasa a ser solo controlador |
| 7 | `feature/tester-qa-specs` | `develop` | Al final, con el código ya integrado | Tests de modelos, storage y `script.js` |
| 8 | `release/cuarta-entrega` | `master` | Con todo integrado en `develop` | Título: `[GRUPO N°5][Cuarta Entrega] Entrega de la actividad`; plantilla de release |

Criterio de aprobación de una PR hacia `develop`:

- La revisa y la aprueba un integrante distinto del autor.
- El spec del rol está commiteado **antes** que el código (se verifica en el historial).
- Hay al menos un commit relevante del autor, una issue asociada y la entrada en `changelog.md` con el link a la PR.
- No quedan `prompt()` ni `alert()`, ni `console.log` innecesarios.
- Se respeta la separación: `script.js` solo eventos y DOM, `js/models/` solo lógica de negocio, `js/utils/storage.js` solo storage.
- Los tests pasan en `test-runner.html` (aplica desde la PR 7; las PRs 4 a 6 se validan manualmente contra los criterios de arquitectura de este spec).

### Herramientas

- **GitHub Copilot en modo Agente**, para hacer los code reviews de las PRs de los demás integrantes. Justificación: la consigna lo pide para este rol, y permite revisar el diff contra la arquitectura POO y los diagramas de clases con un criterio uniforme en todas las PRs.
- **GitHub** (Issues, Projects con tablero Kanban, Pages, Releases y tags) para administrar el trabajo.
- **Slack**: hilo de la entrega, para publicar la PR de la release y notificar ✅ y `:pr-merged:`.

### Criterios de aceptación

- [ ] Correcciones de la Actividad Obligatoria N°3 aplicadas con PRs `fix/` contra `release/tercera-entrega` y documentadas en `[Fixed]`
- [ ] Backport realizado (`backport/release-tercera-entrega` → `develop`) y documentado
- [ ] Al menos 4 code reviews con `CHANGES_REQUESTED` documentados
- [ ] Todas las ramas feature integradas en `develop` con revisión y aprobación
- [ ] `release/cuarta-entrega` creada desde `develop`
- [ ] GitHub Pages activo sobre `release/cuarta-entrega`
- [ ] `README.md` actualizado con la información de la cuarta entrega y los enlaces a la documentación
- [ ] `changelog.md` con las contribuciones de cada integrante, con link a su PR y su issue
- [ ] Issues administradas en GitHub Projects (Kanban)
- [ ] Ramas innecesarias eliminadas (quedan `master`, `develop`, `release/tercera-entrega` y `release/cuarta-entrega`; la rama de la tercera entrega se conserva porque es la base de las correcciones `[Fixed]` y del backport)
- [ ] Release `v1.2-cuarta-entrega` publicada con el extracto del changelog
- [ ] PR de la release publicada en Slack y enlaces subidos al campus (PR y GitHub Pages)

---

## AT CLOSE — Evidencia del proceso

> Se completa al terminar la tarea, con lo que realmente se hizo.

### Prompts usados en cada code review

(Pendiente: un bloque de código por review, indicando qué archivos del diff se adjuntaron como contexto.)

### Resumen de cada review

(Pendiente: qué se validó, qué `CHANGES_REQUESTED` se cargaron y en qué líneas del diff.)

### Obstáculos encontrados y cómo se resolvieron

(Pendiente.)
### Prompts usados en cada code review
 
Todas las reviews se hicieron con **GitHub Copilot en modo Agente**. Se usó el mismo prompt en todas. Lo que cambia entre una review y otra es el spec del rol, que es la fuente principal, y el diff de la PR, que se le entrega como contexto.
 
```text
Actuá como revisor técnico de código especializado en desarrollo web y control de calidad de Pull Requests en GitHub.
Tu tarea es realizar una Code Review completa de la Pull Request actual, pero NO debés publicar, enviar ni agregar ningún comentario, review, aprobación o solicitud de cambios en GitHub sin mi autorización explícita previa.
 
FORMATO DEL COMENTARIO
════════════════════════════════════════════════════════════
HALLAZGO #N
Archivo: [nombre del archivo]
Línea: [número de línea / sección]
Tipo de problema: [bug | diseño | legibilidad | documentación | otro]
Severidad: [baja | media | alta]
Explicación técnica
[Descripción clara del problema detectado y su impacto.]
Sugerencia de mejora
[Descripción de la modificación recomendada para resolver o mejorar el hallazgo.]
Ejemplo de código corregido (si aplica)
Antes:
[contenido actual]
Después:
[contenido sugerido]
DECISIÓN DEL REVISOR HUMANO
•	Aceptar sugerencia
•	Rechazar sugerencia
Justificación del revisor humano:
[Completar manualmente si se rechaza]
════════════════════════════════════════════════════════════
 
1. Rol que debés asumir
Asumí el rol de:
Revisor Técnico / Code Reviewer de Desarrollo Web
Como revisor, debés evaluar de manera objetiva si el trabajo realizado en la PR cumple con las tareas y criterios definidos para el rol de la persona que desarrolló la actividad.
No debés modificar código durante esta revisión.
2. Fuente principal de validación
Dentro de la PR existe el archivo rol "spec" que correspondiente al rol de la persona que realizó la tarea.
Este archivo contiene:
•	Qué debía realizar.
•	Por qué debía realizarlo.
•	Requerimientos que debía cumplir.
•	Criterios de aceptación.
•	Archivos que debía crear o modificar.
•	Responsabilidades correspondientes a su rol.
Este archivo debe ser la fuente principal para realizar la Code Review.
Antes de evaluar el código:
1.	Identificá el archivo de especificación correspondiente al rol.
2.	Leé completamente su contenido.
3.	Identificá las tareas y criterios de aceptación.
4.	Revisá los cambios realizados en la PR.
5.	Compará cada cambio contra lo establecido en la especificación.
No evalúes funcionalidades que estén fuera del alcance definido en dicha especificación, salvo que los cambios introduzcan errores, conflictos o afecten negativamente otras partes del proyecto.
3. Proceso de revisión
Para cada requisito o criterio de aceptación definido en la especificación, determiná uno de los siguientes estados:
•	Cumple: está implementado correctamente.
•	Cumple parcialmente: está implementado, pero presenta alguna diferencia o problema.
•	No cumple: no fue implementado o contradice la especificación.
•	No aplica: el criterio no corresponde a los cambios realizados en esta PR.
Además, revisá aspectos generales de desarrollo web cuando correspondan:
•	Estructura HTML5.
•	Uso correcto de etiquetas semánticas.
•	Organización y legibilidad del código.
•	Accesibilidad básica.
•	SEO básico.
•	Nombres de archivos, carpetas, elementos y atributos.
•	Comentarios y documentación.
•	Enlaces y rutas.
•	Formularios, tablas, listas e imágenes.
•	Consistencia con la estructura existente del proyecto.
•	Posibles errores o código innecesario.
•	Cambios realizados fuera del alcance de la tarea.
4. Resultado de la revisión
Primero presentame un informe interno de revisión con esta estructura:
Resumen de la PR
Explicá brevemente qué cambios fueron realizados.
Especificación utilizada
Indicá qué archivo .md utilizaste como referencia y qué rol corresponde revisar.
Validación de requisitos
Para cada requisito o criterio de aceptación:
Requisito/Criterio:
Estado: Cumple / Cumple parcialmente / No cumple / No aplica
Evidencia: archivo y parte del código donde se verifica.
Observación: explicación breve cuando sea necesaria.
Problemas encontrados
Para cada problema indicá:
•	Archivo.
•	Ubicación aproximada.
•	Problema detectado.
•	Requisito o criterio de aceptación relacionado.
•	Severidad: crítica / importante / menor.
•	Cambio recomendado.
Conclusión
Indicá cuál sería tu recomendación:
•	Aprobar PR
•	Aprobar con observaciones
•	Solicitar cambios
Justificá brevemente la recomendación.
5. Regla obligatoria sobre comentarios en GitHub
NO PUBLIQUES NADA EN LA PULL REQUEST.
Después de terminar el análisis:
1.	Mostrame los comentarios que propondrías realizar.
2.	Indicá exactamente a qué archivo o línea correspondería cada comentario.
3.	Esperá mi revisión.
4.	Preguntame cuáles comentarios autorizo.
Solo después de que yo indique explícitamente que un comentario está aprobado, podrás publicarlo.
Mi autorización para publicar un comentario no implica autorización para publicar los demás.
Tampoco debés:
•	Aprobar la PR.
•	Solicitar cambios.
•	Hacer merge.
•	Modificar archivos.
•	Crear commits.
•	Hacer push.
•	Cerrar la PR.
 
Regla final
Tu función en esta primera etapa es exclusivamente:
leer → analizar → comparar contra la especificación → detectar diferencias → proponer comentarios → esperar mi autorización.
No realices ninguna acción que modifique la PR o el repositorio.
```
 
Contexto entregado en cada review: el diff de la PR y el spec del rol incluido en ella.
 
| Review | PR | Spec o código usado como fuente |
|---|---|---|
| 1 | #140 (Angel) | `spec-dev-eventos-dom.md` |
| 2 | #141 (Thiago) | `spec-dev-storage.md` |
| 3 | #144 (Luciano) | `spec-dev-poo.md` |
 
### Resumen de cada review
 
| PR | Autor y rol | Hallazgos | Decisión | Estado en GitHub |
|---|---|---|---|---|
| #140 | Angel, Eventos + DOM | 1 hallazgo y 1 observación de checklist | Aceptar | (completar) |
| #141 | Thiago, Storage | 1 hallazgo | Aceptar | (completar) |
| #144 | Luciano, POO | 2 hallazgos | Aceptar los 2 | (completar) |

 
#### PR #140 — `spec-dev-eventos-dom.md`
 
- **Hallazgo #1** — líneas 25–28, diseño, severidad media. El spec dice que el filtro de precio puede omitirse y que un valor inválido debe producir un error, pero el control existente es un `input[type="range"]`, que no puede quedar vacío. No define cómo se desactiva el filtro ni qué valor sería inválido. Se sugirió definir una opción explícita para desactivar el límite de precio y alinear la regla de omisión y la validación con esa decisión.
- **Observación de checklist:** la PR marcaba como completada la actualización de `changelog.md`, pero el listado de cambios indicaba que solo se agregó el archivo del spec.
- **Corrección:** el autor respondió con el commit `73f4c94` («Corrección al spec solicitada por el coordinador»), donde incorporó un control explícito para activar el filtro de precio.
#### PR #141 — `spec-dev-storage.md`
 
- **Hallazgo #1** — líneas 55–79, documentación, severidad baja. Los ejemplos de schemas estaban en un bloque `json` con comentarios `//` y varios valores raíz, por lo que no eran JSON válido y no se podían copiar a un parser. Se sugirió separar cada schema en su propio bloque JSON válido y trasladar la etiqueta de la clave fuera del bloque.
- **Corrección:** el commit `634ecf3` del autor separó los schemas en bloques JSON válidos.
#### PR #144 — `spec-dev-poo.md`
 
- **Hallazgo #1** — líneas 311–325, documentación, severidad media. El spec proponía los entregables del diagrama de clases en `docs/04-diagramas/02-diagrama-de-clases/`, pero el README documenta `docs/05-diagramas/02-diagrama-de-clases/`. Se pidió acordar una única ruta antes de usar el spec como guía de implementación.
- **Hallazgo #2** — líneas 332–347, diseño, severidad baja. El spec propone cinco clases, pero el criterio de aceptación exigía «al menos tres», lo que permitía cumplir el checklist sin implementar `Pago` ni `Pedido`. Se pidió distinguir el mínimo académico de las clases que son obligatorias para el diseño.
- **Corrección:** el commit `9de01fb` («corregir hallazgos del spec JS POO») fijó la ruta `docs/05-diagramas/02-diagrama-de-clases/` y aclaró cuáles son las tres clases mínimas y cuáles las adicionales.
#### PR #157 — `js/utils/storage.js` (código)
 
- **Hallazgo #1** — líneas 371–382, bug, severidad media. `estaDisponible()` usa una clave fija, `app:__prueba-disponibilidad__`, y la elimina siempre en el bloque `finally`. Si esa clave ya existía con datos de la aplicación, la prueba los sobrescribe y luego los borra: una pérdida silenciosa de datos posible. Esa clave no figura entre las claves oficiales de `CLAVES`. Se sugirió usar una clave temporal única por prueba, con `crypto.randomUUID()`, verificar su eliminación y devolver `false` si no se puede completar la prueba sin dejar cambios.
- **Hallazgo #2** — líneas 130–138, bug, severidad media. `serializar()` comprueba que `JSON.stringify()` devuelva una cadena, pero no detecta propiedades no serializables dentro de objetos o arreglos: `JSON.stringify({ callback: () => {} })` produce `"{}"` y la operación devuelve éxito, perdiendo la propiedad en silencio. El criterio del spec indica que los valores no serializables, como funciones, deben rechazarse con `false`. Se sugirió validar recursivamente el valor antes de serializar, o limitar explícitamente el criterio del spec al nivel raíz.
- **Corrección:** pendiente de que el autor suba los arreglos.
 
### Obstáculos encontrados y cómo se resolvieron
 
- **Ruta del diagrama de clases.** El spec de POO indicaba `docs/04-diagramas/` y el README usa `docs/05-diagramas/`. Se detectó en la review de #144 y se resolvió dejando `docs/05-diagramas/02-diagrama-de-clases/` como única ruta.
- **Filtro de precio sin valor vacío.** El spec de Eventos + DOM trataba el filtro de precio como omitible, pero el control es un rango. Se resolvió en la review de #140 con una opción explícita para activar o desactivar el filtro.
- **Schemas de ejemplo con JSON inválido.** El spec de Storage mezclaba comentarios y varios valores raíz en un mismo bloque `json`. Se resolvió separándolos en bloques válidos.
- **Conflictos en `changelog.md`.** Todas las PRs agregan su entrada en el mismo lugar de la sección `Unreleased`, y cada rama que se creó antes de integrarse otra tuvo conflicto. Se resolvió actualizando la rama desde `develop` y conservando todas las entradas.