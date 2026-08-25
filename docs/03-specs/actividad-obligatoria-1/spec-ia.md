# Spec: Especialista en IA y Prompt Engineering

**Rol:** Especialista en IA y Prompt Engineering
**Se traza contra:** plan.md
**Entrega:** Actividad Obligatoria N°1 — FerroLab
## Qué se va a hacer

Este rol se desarrolla en dos etapas, con una Pull Request para cada una:

**Etapa 1 — PR inicial (antes de que el equipo empiece a desarrollar):**
- Investigar la metodología Spec-Driven Development (SDD) y definir cómo se aplica a este proyecto.
- Diseñar el template `spec-[rol].md` que van a usar los 4 roles para documentar sus tareas.
- Documentar todo lo anterior en `docs/02-prompts/sdd-decisions.md`.
- Verificar que todos los integrantes del equipo tengan instalada la extensión de GitHub Copilot (modo Agente) y la extensión de GitHub Pull Requests en VS Code.

**Etapa 2 — PR final (al cierre de la entrega):**
- Recopilar el prompt más valioso de cada integrante del equipo (incluido este rol), documentado en archivos individuales `docs/02-prompts/prompts-1.md` a `prompts-5.md`.
- Cada archivo debe usar un modelo de IA distinto y un método de prompting distinto.
- Comparar dos modelos aplicados a una misma tarea del proyecto en `docs/02-prompts/comparativa-modelos.md`.
- Actualizar `docs/02-prompts/prompts.md` como índice con enlaces a los 5 prompts.

## Por qué

`plan.md` establece que el uso de IA en el proyecto no es opcional ni superficial, y que cada rol debe tener un punto de contacto concreto con modelos de lenguaje. Este rol existe para garantizar que ese uso sea intencional, documentado y trazable — no que se use más IA, sino que el equipo la use bien.

## Criterios de aceptación

**Etapa 1:**
- [ ] Dado que el equipo va a empezar a desarrollar, cuando revisan `docs/02-prompts/sdd-decisions.md`, entonces encuentran qué es SDD, por qué se usa en este proyecto y cómo se aplica.
- [ ] Dado que un integrante necesita escribir su spec de rol, cuando abre `docs/03-specs/actividad-obligatoria-1/spec-[rol].md`, entonces encuentra un template claro para completar.
- [ ] Dado que se revisa el equipo, cuando se consulta la instalación de herramientas, entonces está confirmado que los 4 integrantes tienen Copilot (modo Agente) y GitHub Pull Requests instalados.

**Etapa 2:**
- [ ] Dado que se revisa `docs/02-prompts/`, cuando se cuentan los archivos `prompts-x.md`, entonces hay exactamente 5, cada uno con modelo y método distintos.
- [ ] Dado que se abre `comparativa-modelos.md`, cuando se lee el contenido, entonces hay una conclusión fundada sobre qué modelo fue más útil y por qué.
- [ ] Dado que se abre `prompts.md`, cuando se hace click en cada enlace, entonces lleva al archivo de prompt correspondiente.