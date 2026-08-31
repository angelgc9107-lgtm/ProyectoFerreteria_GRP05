# Spec: Configuración inicial del repositorio y gestión DevOps

**Rol:** Coordinador / DevOps
**Se traza contra:** plan.md — RNF7, RNF8, RNF9, RNF10, RNF11, RNF12, RNF13
**Entrega:** Actividad Obligatoria N°1 — FerroLab

## Qué se va a hacer

Se configurará la estructura inicial del repositorio de **FerroLab** en GitHub, estableciendo las ramas `master` y `develop` como ramas principales del flujo de trabajo. Se configurarán reglas de protección para impedir cambios directos y requerir revisión mediante Pull Requests antes de integrar modificaciones.

También se preparará la estructura base de archivos y carpetas definida para la Actividad Obligatoria N°1, incluyendo `index.html`, `README.md`, `plan.md`, `changelog.md`, las plantillas de Pull Request y las carpetas destinadas al mockup, especificaciones técnicas y documentación de prompts de inteligencia artificial.

Como parte del rol se administrarán las Pull Requests del equipo, verificando que las implementaciones cumplan con los requisitos establecidos en `plan.md` y en el `spec-[rol].md` correspondiente. Cada PR deberá contar con al menos una revisión antes de integrarse a `develop`, incluyendo las revisiones asistidas con IA requeridas por la actividad.

Una vez integrados y aprobados los trabajos individuales en `develop`, se creará la rama `release/actividad-obligatoria-1`, se configurará GitHub Pages para publicar la entrega y se preparará la Pull Request final hacia `master`.

## Por qué

Esta tarea permite establecer una estructura de trabajo colaborativa y organizada para el proyecto, facilitando que cada integrante desarrolle sus tareas de manera independiente y que los cambios sean revisados antes de incorporarse al proyecto.

Se relaciona principalmente con los requisitos no funcionales definidos en `plan.md`, especialmente los vinculados con la **mantenibilidad, legibilidad, separación de responsabilidades, escalabilidad, extensibilidad, organización de archivos y compatibilidad del proyecto**.

La configuración de ramas, Pull Requests y revisiones permite además mantener control sobre los cambios realizados y utilizar `plan.md` como referencia general para verificar que cada implementación se mantenga dentro del alcance definido para FerroLab.

## Criterios de aceptación

* [X] Dado que el proyecto FerroLab necesita un repositorio colaborativo, cuando se configure el repositorio en GitHub, entonces deberán existir las ramas `master` y `develop`.

* [X] Dado que `master` representa la versión estable del proyecto, cuando se configure la protección de la rama, entonces deberá requerir al menos una revisión y bloquear los cambios directos.

* [X] Dado que `develop` funciona como rama de integración del equipo, cuando se configure su protección, entonces deberá requerir al menos una revisión y bloquear los cambios directos.

* [X] Dado que el equipo necesita una estructura inicial común, cuando se realice el commit inicial, entonces deberán estar creados `index.html` y las carpetas necesarias definidas para la actividad.

* [X] Dado que `plan.md` es la especificación maestra de FerroLab, cuando comience el desarrollo del proyecto, entonces deberá existir previamente en la raíz del repositorio con los requisitos funcionales, no funcionales y el alcance acordado.

* [X] Dado que el proyecto utiliza Spec-Driven Development, cuando el Coordinador/DevOps comience las tareas correspondientes a su rol, entonces `spec-devops.md` deberá haber sido creado y commiteado previamente.

* [X] Dado que cada integrante deberá trabajar de forma independiente, cuando realice una tarea del proyecto, entonces deberá utilizar una rama con el formato `feature/<rol>-<descripción>` creada desde `develop`.

* [X] Dado que los cambios deben ser controlados antes de integrarse, cuando un integrante finalice su tarea, entonces deberá abrir una Pull Request desde su rama `feature/` hacia `develop`.

* [X] Dado que cada Pull Request debe cumplir con el proceso definido, cuando sea revisada, entonces deberá contener el `spec-[rol].md` correspondiente y deberá verificarse su trazabilidad contra `plan.md`.

* [X] Dado que la actividad exige revisión colaborativa, cuando una Pull Request sea integrada a `develop`, entonces deberá contar previamente con al menos una revisión aprobada.

* [X] Dado que la actividad requiere el uso de IA durante las revisiones, cuando se realicen los Code Reviews del proyecto, entonces deberán completarse como mínimo cuatro revisiones asistidas con IA y conservar evidencia mediante comentarios en las Pull Requests.

* [X] Dado que los Code Reviews deben validar los requisitos del proyecto, cuando se detecte un incumplimiento de `plan.md` o del `spec-[rol].md`, entonces deberá realizarse un `Request Changes` sobre las líneas correspondientes antes de aprobar el PR.

* [X] Dado que cada integrante debe demostrar su participación, cuando una Pull Request sea integrada, entonces su número, enlace, autor y resumen del aporte deberán quedar registrados en `changelog.md`.

* [X] Dado que cada tarea debe encontrarse documentada, cuando se cree una Pull Request, entonces deberá existir una Issue asociada que describa la tarea y que pueda cerrarse luego de realizar el merge.

* [X] Dado que la entrega final debe representar los cambios aprobados del equipo, cuando todos los PR individuales hayan sido integrados en `develop`, entonces deberá crearse desde esa rama `release/actividad-obligatoria-1`.

* [X] Dado que FerroLab debe poder visualizarse públicamente, cuando se prepare la release de la Actividad Obligatoria N°1, entonces GitHub Pages deberá quedar habilitado y el sitio deberá ser accesible mediante una URL pública.

* [X] Dado que la entrega final requiere una revisión del profesor, cuando se complete la release, entonces deberá abrirse una Pull Request desde `release/actividad-obligatoria-1` hacia `master` utilizando la plantilla correspondiente.

* [X] Dado que la actividad requiere evidencia de entrega, cuando se publique la versión final, entonces el enlace de la Pull Request de release deberá compartirse en Slack y los enlaces solicitados deberán entregarse en el campus virtual.
