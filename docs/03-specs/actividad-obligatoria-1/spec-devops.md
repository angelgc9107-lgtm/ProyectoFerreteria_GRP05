# Spec — Coordinador / DevOps
## Actividad Obligatoria N.° 1

## 1. Rol

**Coordinador / DevOps**

---

## 2. Objetivo

Configurar la infraestructura del repositorio GitHub y coordinar el flujo de trabajo colaborativo del proyecto **Ferretería Web**, garantizando que las ramas, Pull Requests, revisiones, documentación y publicación de la entrega cumplan con los requisitos establecidos.

El archivo `plan.md` será utilizado como especificación maestra para verificar el cumplimiento de los requerimientos del proyecto.

---

# PARTE 1 — DEVOPS

## 3. Responsabilidades DevOps

El área DevOps será responsable de la configuración técnica del repositorio, ramas, estructura del proyecto y publicación mediante GitHub Pages.

---

## DEVOPS-01 — Configuración del repositorio

Crear y configurar el repositorio GitHub utilizado para el desarrollo colaborativo del proyecto.

### Criterios de aceptación

- [x] El repositorio está creado en GitHub.
- [x] El repositorio puede ser utilizado por los integrantes del equipo.
- [x] La estructura inicial del proyecto está disponible en el repositorio.

---

## DEVOPS-02 — Configuración de ramas principales

Crear las ramas principales:

- `master`
- `develop`

`master` será utilizada como rama estable del proyecto.

`develop` será utilizada para integrar los cambios aprobados provenientes de las ramas `feature/`.

### Criterios de aceptación

- [x] Existe la rama `master`.
- [x] Existe la rama `develop`.
- [x] Las ramas se encuentran disponibles en el repositorio remoto.

---

## DEVOPS-03 — Protección de ramas

Configurar reglas de protección para `master` y `develop` con el objetivo de evitar modificaciones directas sin revisión.

### Criterios de aceptación

- [x] `master` se encuentra protegida.
- [x] `develop` se encuentra protegida.
- [x] Se requiere al menos una revisión antes de integrar cambios.
- [x] Los push directos a las ramas protegidas están restringidos.

---

## DEVOPS-04 — Estructura inicial del proyecto

Crear la estructura base requerida para la Actividad Obligatoria N.° 1.

La estructura deberá contemplar:

```text
/
├── .github/
│   └── PULL_REQUEST_TEMPLATE/
├── docs/
│   ├── 01-mockup/
│   ├── 02-prompts/
│   └── 03-specs/
├── index.html
├── plan.md
└── changelog.md
```

### Criterios de aceptación

- [x] Existe `index.html`.
- [x] Existe `plan.md`.
- [x] Existe `changelog.md`.
- [x] Existe `.github/PULL_REQUEST_TEMPLATE/`.
- [x] Existe la estructura correspondiente dentro de `docs/`.

---

## DEVOPS-05 — Plan maestro

Generar el archivo `plan.md` en la raíz del repositorio utilizando GitHub Copilot en modo Agente.

El archivo deberá contener los requerimientos generales y el alcance definido para el proyecto **Ferretería Web**.

El documento funcionará como referencia principal para los Code Reviews.

### Criterios de aceptación

- [x] `plan.md` existe en la raíz del repositorio.
- [x] Fue generado con asistencia de GitHub Copilot en modo Agente.
- [x] Contiene los requerimientos funcionales del proyecto.
- [x] Contiene los requerimientos no funcionales definidos para el proyecto.
- [x] Los requerimientos están estructurados y pueden utilizarse durante un Code Review.

---

## DEVOPS-06 — Spec del rol

Crear la especificación correspondiente al rol Coordinador / DevOps antes de realizar las tareas especificadas.

Ubicación:

`docs/03-specs/actividad-obligatoria-1/spec-devops.md`

### Criterios de aceptación

- [x] Existe `spec-devops.md`.
- [x] Se encuentra en la ruta correspondiente.
- [x] Fue creado antes de implementar las tareas especificadas.
- [x] Contiene responsabilidades concretas del rol.
- [x] Contiene criterios de aceptación verificables.

---

## DEVOPS-07 — Rama feature del rol

Los cambios correspondientes al rol deberán realizarse desde una rama `feature/` creada desde `develop`.

Rama propuesta:

`feature/coordinador-setup-repo-and-pages`

### Criterios de aceptación

- [x] Existe una rama `feature/` para el trabajo del rol.
- [x] La rama fue creada desde `develop`.
- [x] Los cambios correspondientes fueron realizados en esta rama.
- [x] Existe al menos un commit relevante del rol.

---

## DEVOPS-08 — Plantillas de Pull Request

Configurar las plantillas necesarias para estandarizar los Pull Requests del proyecto.

Se deberán crear:

```text
.github/
└── PULL_REQUEST_TEMPLATE/
    ├── feature-template.md
    └── release-template.md
```

### Criterios de aceptación

- [x] Existe `feature-template.md`.
- [x] Existe `release-template.md`.
- [x] Ambas plantillas se encuentran dentro de `.github/PULL_REQUEST_TEMPLATE/`.
- [x] Las plantillas contienen los campos necesarios para documentar los cambios.
- [x] Las Pull Requests de tipo feature pueden utilizar `feature-template.md`.
- [x] La Pull Request de release puede utilizar `release-template.md`.

---

## DEVOPS-09 — Rama de release

Después de integrar en `develop` los cambios aprobados correspondientes a la actividad, crear la rama:

`release/actividad-obligatoria-1`

### Criterios de aceptación

- [ ] Existe `release/actividad-obligatoria-1`.
- [ ] La rama fue creada desde `develop`.
- [ ] Fue creada después de integrar los cambios aprobados.
- [ ] La rama existe en el repositorio remoto.

---

## DEVOPS-10 — GitHub Pages

Configurar GitHub Pages para publicar la versión correspondiente a la Actividad Obligatoria N.° 1.

### Criterios de aceptación

- [ ] GitHub Pages está habilitado.
- [ ] La publicación utiliza la versión correspondiente a `release/actividad-obligatoria-1`.
- [ ] El sitio es accesible públicamente.
- [ ] `index.html` puede visualizarse correctamente desde GitHub Pages.

---

# PARTE 2 — COORDINADOR

## 4. Responsabilidades del Coordinador

El Coordinador será responsable de organizar y controlar el flujo de trabajo colaborativo, administrar los Pull Requests y verificar que las implementaciones cumplan con `plan.md` y con las especificaciones individuales correspondientes.

---

## COORD-01 — Gestión de colaboradores

Gestionar el acceso de los participantes del proyecto al repositorio.

### Criterios de aceptación

- [x] Todos los integrantes tienen acceso al repositorio.
- [x] El profesor `MVelasquez98` fue agregado como colaborador.

---

## COORD-02 — Organización del trabajo mediante ramas

Verificar que cada integrante realice su trabajo mediante una rama `feature/` creada desde `develop`.

### Criterios de aceptación

- [ ] Cada integrante utiliza una rama `feature/`.
- [ ] Las ramas de trabajo parten de `develop`.
- [x] No se realizan implementaciones directamente sobre `master`.
- [x] No se realizan implementaciones directamente sobre `develop`.

---

## COORD-03 — Control de specs

Verificar que cada integrante haya creado su especificación técnica antes de comenzar la implementación correspondiente.

Los specs deberán encontrarse en:

`docs/03-specs/actividad-obligatoria-1/`

### Criterios de aceptación

- [ ] Cada tarea tiene un spec asociado.
- [ ] Los specs fueron creados antes de las implementaciones correspondientes.
- [ ] Cada spec contiene criterios de aceptación.
- [ ] Los specs pueden relacionarse con los requerimientos de `plan.md`.

---

## COORD-04 — Administración de Pull Requests

Controlar los Pull Requests realizados por los integrantes hacia `develop`.

### Criterios de aceptación

- [ ] Los cambios se integran mediante Pull Requests.
- [ ] Las PR tienen como destino `develop`.
- [ ] Cada PR utiliza la plantilla correspondiente.
- [ ] Cada PR contiene una descripción de los cambios.
- [ ] Cada PR está vinculada con su Issue.
- [ ] Ninguna PR se integra sin la revisión correspondiente.

---

## COORD-05 — Code Reviews

Revisar los Pull Requests comparando:

```text
plan.md
+
spec del rol
+
implementación realizada
```

La revisión deberá comprobar tanto la calidad de la implementación como el cumplimiento de los requerimientos definidos.

### Criterios de aceptación

- [ ] Cada PR tiene al menos una revisión.
- [ ] La revisión contempla `plan.md`.
- [ ] La revisión contempla el spec correspondiente.
- [ ] Se verifican los criterios de aceptación definidos.
- [ ] Se comprueba que los cambios estén dentro del alcance del proyecto.

---

## COORD-06 — Code Reviews asistidos con IA

Realizar como mínimo **4 Code Reviews asistidos con IA** durante el proyecto.

Las recomendaciones generadas por IA deberán ser evaluadas antes de incorporarlas como comentarios de revisión.

### Criterios de aceptación

- [ ] Se realizaron como mínimo 4 revisiones asistidas con IA.
- [ ] Existe evidencia de las revisiones en los Pull Requests.
- [ ] Las revisiones comprueban requerimientos de `plan.md`.
- [ ] Las revisiones comprueban los specs individuales.
- [ ] Se determinó cuáles observaciones generadas por IA eran pertinentes.
- [ ] No se aceptaron automáticamente todas las recomendaciones realizadas por la IA.

---

## COORD-07 — Request Changes

Cuando un Pull Request no cumpla con los requerimientos establecidos, realizar `Request Changes`.

### Criterios de aceptación

- [ ] Se utiliza `Request Changes` cuando corresponde.
- [ ] El comentario identifica claramente el problema encontrado.
- [ ] Se identifica el requerimiento o criterio de aceptación incumplido.
- [ ] Los comentarios se realizan sobre las líneas correspondientes cuando sea aplicable.
- [ ] Las correcciones son verificadas antes de aprobar la PR.

---

## COORD-08 — Control de Issues

Verificar que las tareas realizadas durante la actividad estén asociadas con Issues.

### Criterios de aceptación

- [ ] Cada tarea tiene una Issue.
- [ ] Cada Issue está vinculada con su Pull Request.
- [ ] Las Issues se cierran cuando la tarea fue completada e integrada.

---

## COORD-09 — Control de changelog

Verificar que los Pull Requests integrados estén registrados en `changelog.md`.

### Criterios de aceptación

- [ ] Cada PR mergeada está registrada.
- [ ] Se indica el número de PR.
- [ ] Se incluye el enlace al PR.
- [ ] Se identifica al autor.
- [ ] Se incluye un resumen del aporte realizado.

---

## COORD-10 — Pull Request final

Crear la Pull Request correspondiente a la entrega desde:

`release/actividad-obligatoria-1`

hacia:

`master`

### Criterios de aceptación

- [ ] Existe la PR de release.
- [ ] El origen es `release/actividad-obligatoria-1`.
- [ ] El destino es `master`.
- [ ] Se utiliza `release-template.md`.
- [ ] La PR contiene la información correspondiente a la entrega.
- [ ] La PR permanece sin mergear hasta recibir la aprobación correspondiente.

---

## COORD-11 — Publicación de la entrega

Publicar la PR final en Slack y preparar los enlaces solicitados para el Campus Virtual.

### Criterios de aceptación

- [ ] La PR final fue publicada en Slack.
- [ ] Se mencionó al profesor según lo solicitado.
- [ ] Se dispone del enlace de la PR final.
- [ ] Se dispone del enlace público de GitHub Pages.
- [ ] Los enlaces requeridos fueron preparados para el Campus Virtual.

---

# 5. Definición de terminado

## DevOps

El trabajo técnico de DevOps estará terminado cuando:

- [ ] El repositorio esté configurado.
- [ ] `master` y `develop` existan y estén protegidas.
- [ ] La estructura inicial esté creada.
- [ ] `plan.md` esté disponible.
- [ ] `spec-devops.md` esté disponible.
- [ ] Las plantillas de Pull Request estén configuradas.
- [ ] La rama `feature/` correspondiente haya sido utilizada.
- [ ] `release/actividad-obligatoria-1` esté creada.
- [ ] GitHub Pages esté configurado y funcionando.

## Coordinador

El trabajo de coordinación estará terminado cuando:

- [ ] Los colaboradores estén correctamente configurados.
- [ ] Los integrantes hayan utilizado ramas `feature/`.
- [ ] Los specs individuales hayan sido controlados.
- [ ] Los Pull Requests hayan recibido las revisiones correspondientes.
- [ ] Se hayan realizado como mínimo 4 Code Reviews asistidos con IA.
- [ ] Los `Request Changes` necesarios hayan sido gestionados.
- [ ] Las Issues estén correctamente vinculadas.
- [ ] `changelog.md` registre los PR integrados.
- [ ] La PR final de release esté creada.
- [ ] La entrega haya sido publicada en Slack.
- [ ] Los enlaces correspondientes estén preparados para el Campus Virtual.