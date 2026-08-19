# Decisiones de SDD (Spec-Driven Development) — Actividad Obligatoria N°1

**Proyecto:** Ferreteria FerroLab
**Responsable:** Especialista en IA y Prompt Engineering

## Qué es SDD

Spec-Driven Development es un enfoque de trabajo donde, antes de escribir código, se redacta una especificación clara de qué se va a construir, por qué y con qué criterios se considera terminado. Esa especificación funciona como el punto de partida tanto para el desarrollo manual como para el trabajo asistido por IA: en vez de pedirle a un agente "hacé la página", se le da contexto estructurado (comportamiento esperado, restricciones, criterios de aceptación), lo que reduce ambigüedad y errores.

A diferencia de metodologías donde todo se documenta una sola vez al principio y no se vuelve a tocar, en SDD las specs son un documento de trabajo: se escriben, se usan para generar o guiar el código, y se revisan si algo cambia — evitando que la spec y el código queden desalineados ("spec drift").

## Por qué se usa en este proyecto

El equipo trabaja con 4 roles distintos en paralelo (Coordinador, Frontend, UX, IA), cada uno con su propia rama y su propio PR. Sin una spec compartida, cada uno podría interpretar el `plan.md` de forma distinta y terminar construyendo cosas que no encajan entre sí. SDD nos da:

- Un único documento de referencia (`plan.md`) contra el cual se valida todo.
- Una spec individual por tarea, que obliga a pensar el "qué" y el "por qué" antes de tocar código, y sirve de checklist para el Coordinador al revisar cada PR.
- Trazabilidad: cualquiera puede abrir una spec y ver a qué requerimiento funcional (RF) del `plan.md` responde.

## Cómo se aplica en esta entrega

**Orden de escritura:**
1. `plan.md` (ya redactado por el Coordinador) — contiene los 24 RF y 15 RNF del proyecto completo.
2. `docs/03-specs/actividad-obligatoria-1/spec-[rol].md` — cada rol completa su copia antes de tocar código, trazando sus tareas contra los RF/RNF puntuales que le corresponden.

**Validación contra `plan.md`:** cada spec de rol tiene que citar explícitamente qué RF o RNF cubre. Si una tarea no puede vincularse a ningún requerimiento del plan, no se hace en esta entrega (evita "scope creep").

**Alcance de esta entrega (Actividad 1):** el equipo decidió construir un **catálogo digital sin carrito ni pago** por ahora. Eso significa:

| Cubre esta entrega | Queda para entregas futuras |
|---|---|
| RF1 (ver catálogo) | RF9-RF13 (carrito, subtotales) |
| RF2 (info de producto: nombre, desc, imagen, precio) | RF14-RF19 (pago, cuotas, intereses) |
| RF3 (categorías) | RF20 (recálculo dinámico) |
| RF4-RF5 (búsqueda y filtrado — estructura, sin lógica JS) | RF21-RF24 (validaciones, confirmación de pedido) |
| RF6 (navegación) | |
| RF7 (info comercial: contacto, horarios, medios de pago) | |
| RF8 (formulario de contacto) | |

Como esta entrega no requiere CSS ni JavaScript funcional (según consigna, punto 2 y 3), los RF de la columna izquierda que dependan de interactividad (por ejemplo RF4/RF5 búsqueda y filtrado) se implementan como **estructura HTML únicamente**, con comentarios `<!-- TODO: lógica de búsqueda/filtro en JS - próxima entrega -->` marcando dónde va a ir la funcionalidad real.

## Template de spec-[rol].md

Se define el template disponible en `docs/03-specs/actividad-obligatoria-1/spec-[rol].md`, que cada rol copia y completa como `spec-<su-rol>.md`. El formato elegido para los criterios de aceptación es **Given/When/Then** (tomado de Behavior-Driven Development), porque da resultados concretos y verificables sin necesidad de enumerar todos los casos posibles — alcanza con cubrir el camino crítico de cada RF.

## Verificación de herramientas

Antes de comenzar el desarrollo, se verificó con los 4 integrantes del equipo que tuvieran instaladas las herramientas necesarias para el flujo de trabajo con IA en VS Code:

| Integrante | Rol | Extensión GitHub Copilot (modo Agente) | Extensión GitHub Pull Requests |
|---|---|---|---|
| Angel Cuarteron | Coordinador / DevOps | ✅ | ✅ |
| Luciano Barrionuevo | Desarrollador Frontend | ✅ | ✅  |
| Alan Diaz | Documentador / Diseñador UX | ✅ | ✅ |
| Thiago Piastrellini | Especialista en IA y Prompt Engineering | ✅ | ✅  |

**Fecha de verificación:** [18/08/2026]