# 🛠️ Spec — Coordinador / DevOps — Actividad Obligatoria N°3

## 📌 Datos

- **Integrante:** Luciano Barrionuevo
- **Rol:** Coordinador / DevOps
- **Rama:** `feature/coord-devops-tercera-entrega`
- **Fecha de inicio:** 19/10/2026
- **Fecha límite de entrega:** 02/11/2026

---

## 1. ANTES de comenzar (planificación)

### 1.1 Plan de coordinación

Se coordinará la integración de las tareas correspondientes a la Actividad Obligatoria N°3, verificando primero las correcciones del Primer Parcial y el backport de `master` hacia `develop`. También se mantendrán organizados los Issues y el tablero Kanban de GitHub Projects para dar seguimiento a las tareas y sus responsables.

Las PR del equipo se revisarán contra la consigna vigente, `plan.md` y la especificación del rol correspondiente. Se dará seguimiento a las observaciones y correcciones solicitadas y se integrarán en `develop` únicamente cuando estén revisadas y aprobadas. El orden se ajustará según las dependencias entre cambios.

Como parte del cierre, se actualizarán y verificarán `README.md` y `changelog.md`, se preparará `release/tercera-entrega`, se comprobará la publicación en GitHub Pages y se coordinará la PR de release hacia `master`. Luego de la aprobación y el merge correspondiente, se comunicará la entrega por Slack y campus, se limpiarán las ramas según lo solicitado y se creará el tag `v1.1-tercera-entrega`.

| Orden | Responsabilidad / cambio | Criterio para avanzar | Referencia / evidencia |
|-------|--------------------------|-----------------------|------------------------|
| 1 | Verificar las correcciones del Primer Parcial y el backport de `master` hacia `develop` | Confirmar que las correcciones requeridas estén integradas y que `develop` contenga el backport esperado | [x] |
| 2 | Coordinar Issues y tablero Kanban de GitHub Projects | Verificar que las tareas de AO3 estén registradas y que el tablero refleje su seguimiento | [Pendiente] |
| 3 | Revisar y dar seguimiento a las PR del equipo | Contrastar cada PR con la consigna y el spec del rol; verificar correcciones y aprobación antes de integrar | [Pendiente] |
| 4 | Actualizar y verificar `README.md` y `changelog.md` | Comprobar que la documentación describa correctamente la entrega y sus cambios integrados | [Pendiente] |
| 5 | Preparar `release/tercera-entrega` | Preparar la rama de release desde la base acordada, con los cambios aprobados | [Pendiente] |
| 6 | Verificar GitHub Pages | Confirmar que el sitio publicado corresponda a la entrega y sea accesible | [Pendiente] |
| 7 | Coordinar la PR final hacia `master` | Preparar la PR de release con la información y plantilla requeridas, y dar seguimiento a su aprobación | [Pendiente] |
| 8 | Comunicar la entrega por Slack y campus | Compartir los enlaces e información solicitados por la consigna | [Pendiente] |
| 9 | Limpiar ramas | Dejar las ramas según la política indicada para el cierre de la actividad | [Pendiente] |
| 10 | Crear el tag `v1.1-tercera-entrega` y la release final | Hacerlo únicamente después de la aprobación y del merge correspondiente | [Pendiente] |

### 1.2 Criterios de revisión y aprobación

Cada PR se revisará contra la consigna de la Actividad Obligatoria N°3, `plan.md` y la especificación correspondiente al rol. La revisión se limitará al alcance de esos documentos, sin dejar de señalar cambios que introduzcan errores, conflictos o impactos negativos en el proyecto.

- Verificar que la PR incluya los archivos y cambios previstos para el rol y no incorpore trabajo ajeno a su alcance.
- Comprobar coherencia con la estructura y las convenciones existentes en el repositorio.
- Revisar el diff completo y respaldar cada observación con evidencia concreta (archivo y línea o sección).
- Solicitar cambios antes de aprobar cuando haya incumplimientos o problemas que bloqueen la integración; verificar las correcciones antes de aprobar.
- No integrar una PR sin una revisión aprobada y sin resolver los bloqueos identificados.
- Mantener trazabilidad de PR, revisión, observaciones y decisión en la documentación de cierre.
- Completar como mínimo cuatro code reviews asistidos con Copilot Agent Mode sobre PR de otros integrantes, y conservar la evidencia correspondiente.

### 1.3 Uso de Copilot Agent Mode

Se utilizará Copilot Agent Mode como apoyo para analizar el diff de cada PR y contrastarlo con la consigna, `plan.md` y la especificación del rol. Su uso permite contextualizar la revisión en el repositorio y estructurar observaciones concretas y trazables, además de dejar documentado el proceso de revisión asistida con IA requerido para esta tarea.

La herramienta no reemplazará el criterio del revisor humano: cada observación deberá verificarse contra el código y los requisitos antes de solicitar cambios o aprobar. No se considerará válido un hallazgo hipotético ni se publicará una recomendación de la IA sin validación humana.

### 1.4 Criterios de aceptación

- [ ] Esta especificación está disponible antes de iniciar la implementación de las tareas del rol.
- [ ] Se identificaron las PR de AO3 y sus dependencias antes de establecer el orden definitivo de integración.
- [ ] Cada PR se contrastó con la consigna vigente y la especificación del rol correspondiente.
- [ ] Ninguna PR se integra sin una revisión aprobada y sin resolver los bloqueos detectados.
- [ ] Se completaron como mínimo cuatro code reviews asistidos con Copilot Agent Mode sobre PR de otros integrantes.
- [ ] Se documentaron los prompts exactos, las observaciones, las correcciones solicitadas y las decisiones del revisor humano.
- [ ] Se conservaron evidencias verificables de las cuatro revisiones.
- [ ] El estado final de integración y los obstáculos relevantes quedaron documentados al cierre.
- [ ] Se verificaron las correcciones del Primer Parcial y el backport de `master` hacia `develop`.
- [ ] Los Issues y el tablero Kanban de GitHub Projects se coordinaron y actualizaron para reflejar el seguimiento de AO3.
- [ ] Se revisaron y se dio seguimiento a las Pull Requests del equipo; las correcciones solicitadas se verificaron antes de aprobar e integrar.
- [ ] `README.md` y `changelog.md` se actualizaron y verificaron contra los cambios integrados.
- [ ] Se preparó `release/tercera-entrega` con los cambios aprobados.
- [ ] Se verificó GitHub Pages y la publicación correspondiente a la entrega.
- [ ] Se coordinó la PR final de release hacia `master` y se verificó su aprobación y merge.
- [ ] La entrega se comunicó mediante Slack y campus según lo solicitado.
- [ ] Se limpiaron las ramas según los requisitos de cierre de la actividad.
- [ ] Después de la aprobación y el merge correspondiente, se creó el tag `v1.1-tercera-entrega` y la release final.

---

## 2. AL CERRAR la tarea

> Completar esta sección al finalizar el trabajo. No se registran aquí revisiones, decisiones ni evidencias hasta que hayan ocurrido y puedan verificarse.

### 2.1 Prompts exactos utilizados

Registrar el texto íntegro de cada prompt realmente utilizado con Copilot Agent Mode, incluyendo cualquier adaptación aplicada a una PR. No reemplazar el prompt utilizado por una versión reconstruida.

Registrar debajo de cada revisión el prompt íntegro utilizado con Copilot Agent Mode. Estos bloques son espacios para completar; no contienen prompts realizados ni resultados.

#### Revisión 1 — PR [Pendiente]

```text
[Pendiente: pegar el prompt exacto utilizado]
```

#### Revisión 2 — PR [Pendiente]

```text
[Pendiente: pegar el prompt exacto utilizado]
```

#### Revisión 3 — PR [Pendiente]

```text
[Pendiente: pegar el prompt exacto utilizado]
```

#### Revisión 4 — PR [Pendiente]

```text
[Pendiente: pegar el prompt exacto utilizado]
```

### 2.2 Code reviews obligatorias

Completar una fila por cada una de las cuatro revisiones asistidas como mínimo. Registrar también las re-reviews, si las hubiera, sin contabilizarlas como sustituto de una revisión inicial de otra PR.

| # | PR revisada | Integrante / rol | Fecha | Resultado de la revisión | ¿Se realizó `CHANGES_REQUESTED`? | Enlace a la evidencia |
|---|-------------|------------------|-------|--------------------------|----------------------------------|-----------------------|
| 1 | [Pendiente] | [Pendiente] | [Pendiente] | [Pendiente] | [Pendiente] | [Pendiente] |
| 2 | [Pendiente] | [Pendiente] | [Pendiente] | [Pendiente] | [Pendiente] | [Pendiente] |
| 3 | [Pendiente] | [Pendiente] | [Pendiente] | [Pendiente] | [Pendiente] | [Pendiente] |
| 4 | [Pendiente] | [Pendiente] | [Pendiente] | [Pendiente] | [Pendiente] | [Pendiente] |

### 2.3 Observaciones y correcciones solicitadas

Registrar los hallazgos verificados, las solicitudes realizadas y el resultado de su seguimiento. Si no hubo observaciones o correcciones, indicarlo al completar el cierre.

| PR | Archivo / línea o sección | Observación verificada | Corrección solicitada | Estado / verificación |
|----|---------------------------|------------------------|-----------------------|------------------------|
| [Pendiente] | [Pendiente] | [Pendiente] | [Pendiente] | [Pendiente] |

### 2.4 Obstáculos y resolución

Documentar únicamente obstáculos que hayan ocurrido durante la coordinación y su resolución. Si no hubo obstáculos, dejarlo asentado al cierre.

| Obstáculo | Impacto en la integración | Resolución |
|-----------|----------------------------|------------|
| [Pendiente] | [Pendiente] | [Pendiente] |

### 2.5 Evidencias

- Tablero Kanban de GitHub Projects: [Pendiente]
- Pull Requests revisadas: [Pendiente]
- Solicitudes de cambios y seguimiento de correcciones: [Pendiente]
- Integraciones realizadas a `develop`: [Pendiente]
- Actualización y verificación de `README.md`: [Pendiente]
- Actualización y verificación de `changelog.md`: [Pendiente]
- Verificación de GitHub Pages: [Pendiente]
- Rama y PR de `release/tercera-entrega` hacia `master`: [Pendiente]
- Publicación / comunicación en Slack: [Pendiente]
- Entrega de enlaces o información en campus: [Pendiente]
- Limpieza de ramas según lo solicitado: [Pendiente]
- Tag `v1.1-tercera-entrega` y release final: [Pendiente]
- Evidencia de uso de Copilot Agent Mode para las cuatro revisiones como mínimo: [Pendiente]
