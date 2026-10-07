# 🛠️ Spec — Coordinador / DevOps — Primer Parcial

## 📌 Datos

- **Integrante:** Thiago Piastrellini ([@Piastrellini](https://github.com/Piastrellini)) — Matrícula 158097
- **Rol:** Coordinador / DevOps
- **Ramas:** `feature/coord-devops-update-figma-and-readme` ([#88](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/pull/88)) y `feature/coord-devops-close-primer-parcial` (cierre)
- **Fecha de inicio:** 2026-10-05
- **Fecha límite de entrega:** 2026-10-07 23:55

---

## 1. ANTES de comenzar (planificación)

### 1.1 Correcciones de la Actividad Obligatoria N°2

Los Request Changes marcados por el docente en la release de la Actividad Obligatoria N°2 ([#49](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/pull/49)) se resolvieron mediante ramas `fix/` creadas desde `release/actividad-obligatoria-2`, con una PR por corrección mergeada directamente en la release y registrada en `changelog.md` bajo `[Fixed]`. Una vez que el docente aprobó la release (LGTM) y se hizo el merge a `master`, se realizó el backport hacia `develop` como base del Primer Parcial.

| RC | Corrección | Rama | PR |
|----|------------|------|----|
| RC1 | Criterios de aceptación de AO2 actualizados en `plan.md` | `fix/rc1-plan-criterios-aceptacion` | [#76](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/pull/76) |
| RC2 | Uso de IA y prompt de las revisiones documentados en `spec-devops.md` | `fix/spec-devops.md` | [#52](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/pull/52) |
| RC3 | Plantilla de release completada con los datos de AO2 | — | Descripción de [#49](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/pull/49) |
| RC4 | Revalidación QA sincronizada en `spec-frontend.md` | `fix/spec-frontend.md` | [#54](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/pull/54) |
| RC5 | Criterios de `spec-responsive.md` sincronizados con los resultados de QA | `fix/rc5-spec-responsive-criterios` | [#74](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/pull/74) |
| RC6 | README actualizado con el objetivo y la documentación de AO2 | `fix/readme-actividad-2` | [#58](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/pull/58) |
| RC7 | Proporción del botón Buscar respecto del input de búsqueda | `fix/rc7-boton-buscar` | [#68](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/pull/68) |
| RC8 | Centrado de sesión y carrito en el header y distribución mobile | `fix/rc8-header-sesion-carrito` | [#62](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/pull/62) |
| RC9 | Menú Categorías sin ancho completo en mobile (+ corrección post-merge) | `fix/rc9-nav-categorias-mobile` | [#64](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/pull/64), [#72](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/pull/72) |
| RC10 | Imágenes de productos sin ampliación que degrade la calidad | `fix/rc10-imagenes-pixeladas` | [#66](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/pull/66) |
| RC11 | Texto cortado en el selector de orden del catálogo | `fix/rc11-selector-orden` | [#70](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/pull/70) |
| RC12–RC20 | Títulos del changelog según los títulos reales de las PR | `fix/changelog-titulos-prs` | [#56](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/pull/56) |
| RC21 | Issue de tracking del rol QA vinculado a #45 | — | Issue #60 |
| RC22 | Alineación de la lista de servicios en mobile | `fix/rc22-servicios-alineacion-mobile` | [#80](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/pull/80) |
| RC23 | Título de servicios sin palabra aislada en mobile | `fix/rc23-titulo-servicios-mobile` | [#82](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/pull/82) |
| RC24 | Navegación mobile en una sola fila | `fix/rc24-nav-mobile-una-fila` | [#78](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/pull/78) |
| Backport | `release/actividad-obligatoria-2` → `develop` (base del Primer Parcial) | `backport/release-actividad-obligatoria-2` | [#84](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/pull/84) |

### 1.2 Cambios a incorporar en el mockup de Figma

Se trabaja sobre el mismo archivo de Figma enlazado en el README, agregando una página nueva **"Primer Parcial – Bootstrap"** a partir del diseño con estilos de la Actividad Obligatoria N°2.

**Grilla de Bootstrap 5:**

- Layout grid de 12 columnas con gutter de 24 px (`1.5rem`, valor por defecto de Bootstrap).
- Frames por breakpoint: mobile 390 px (`< 576`), tablet 768 px (`md`) y desktop 1280 px (`xl`, container de 1140 px).
- Mapeo propuesto de secciones a columnas (a validar con el Desarrollador Frontend/Bootstrap):
  - Grid de productos del catálogo: `col-12` → `col-md-6` → `col-lg-4`.
  - Filtros del catálogo: `col-12` en mobile y `col-lg-3` en desktop, con el grid de productos en `col-lg-9`.
  - Ofertas y servicios: `col-12` → `col-md-6` → `col-lg-3`/`col-lg-4`, según la cantidad de tarjetas.
  - Footer: `col-12` → `col-md-4`.

**Componentes avanzados (definidos con cada rol):**

| Rol | Componente | Clase / elemento | Dónde aparece en el mockup |
|---|---|---|---|
| Especialista en Componentes Bootstrap (@angelgc9107-lgtm) | Dropdown | `.dropdown`, `.dropdown-menu` | Frame "Catalogo – Dropdown": menú de categorías desde CATÁLOGO |
| Especialista en Componentes Bootstrap (@angelgc9107-lgtm) | Offcanvas | `.offcanvas.offcanvas-end` | Frame "Carrito – Offcanvas": panel lateral del carrito |
| Desarrollador de Componentes HTML Avanzados (@alandox1) | iframe de Google Maps | `<iframe>` dentro de `.ratio.ratio-16x9` | Footer de INICIO (desktop, tablet y mobile), sección Ubicación |
| Desarrollador de Componentes HTML Avanzados (@alandox1) | Control deslizante de precio | `<input type="range">` con `.form-range` | Frame "Catalogo – Desktop xl": panel de filtros, sección PRECIO |

Componentes de la migración (Desarrollador Frontend/Bootstrap, @LuchoBarrionuevo13): el mockup incluye una Navbar responsive con `navbar-expand-lg` y `navbar-toggler`, y un Carousel de ofertas, como propuesta de diseño. En #96 se migraron al sistema de columnas Ofertas, Servicios, Bienvenida, Catálogo y Footer. La Navbar y el Carousel quedaron fuera de alcance según `spec-frontend-bootstrap.md`.

**Paleta, tipografías y estados de interacción (mapeo a Bootstrap 5):**

Tokens tomados de `css/styles.css` (`:root`) y su equivalencia en variables de Bootstrap, para usar en `bootstrap-overrides.css`:

| Token del proyecto | Valor | Variable Bootstrap | Uso |
|---|---|---|---|
| `--color-red` | `#c7372b` | `--bs-primary` | Botones primarios, franja de redes |
| `--color-red-dark` | `#9f2b22` | `:hover` de `.btn-primary` | Footer, hover de botones |
| `--color-red-muted` | `#c9918d` | `:disabled` de `.btn-primary` | Botón deshabilitado |
| `--color-ink` | `#2f2f2f` | `--bs-body-color` | Texto general, `:active` de botones, fondo del buscador |
| `--color-gray-500` | `#9b9b9b` | — | Bordes de inputs y del botón "Iniciar compra" |
| `--color-gray-700` | `#777777` | — | `:hover` del botón "Iniciar compra" |
| `--color-text-secondary` | `#6b6b6b` | `--bs-secondary-color` | Texto secundario |
| `--color-gray-300` | `#d9d9d9` | `--bs-border-color` | Bordes y tarjetas |
| `--color-gray-100` | `#f4f4f4` | `--bs-tertiary-bg` | Fondos claros |
| `--color-white` | `#ffffff` | `--bs-body-bg` | Fondo |
| `--color-danger` | `#b3261e` | `--bs-danger` | Errores |
| `--font-family-base` | `"Inter", Arial, Helvetica, sans-serif` | `--bs-body-font-family` | Tipografía base |

Escala tipográfica: `h1` 32 px · `h2` 24 px · `h3` 20 px · `body` 16 px.

Estados representados en el mockup (frame "Estados Bootstrap", exportado en `docs/01-mockup/estados-bootstrap.png`). Cada estado se tomó de las reglas reales de `css/components.css`; los estados sin regla en el CSS no se diseñaron.

| Componente (selector real) | Equiv. Bootstrap | Estado | Fondo | Texto | Borde |
|---|---|---|---|---|---|
| `button` | `.btn-primary` | normal | `#c7372b` | `#ffffff`, 12 px bold | ninguno, radio 2 px |
| `button` | `.btn-primary` | `:hover` | `#9f2b22` | `#ffffff` | ninguno |
| `button` | `.btn-primary` | `:active` | `#2f2f2f` | `#ffffff` | ninguno |
| `button` | `.btn-primary` | `:disabled` | `#c9918d` | `#ffffff` | ninguno (`cursor: not-allowed`) |
| `#carrito > button:last-child` | `.btn` | normal | `#ffffff` | `#2f2f2f`, 12 px bold | 1 px `#9b9b9b` |
| `#carrito > button:last-child` | `.btn` | `:hover` | `#777777` | `#ffffff` | 1 px `#9b9b9b` |
| `#carrito > button:last-child` | `.btn` | `:active` | sin regla propia: al hacer clic se ve igual que `:hover` | | |
| `header > form input` | `.form-control` | normal | `#2f2f2f` | `#ffffff` (placeholder) | 1 px `#2f2f2f`, radio 0 |
| `header > form input` | `.form-control` | `:focus` | `#2f2f2f` | `#ffffff` | 1 px `#c7372b` |
| `nav a` | `.nav-link` | normal | `#c9362b` | `#ffffff`, 12 px, mayúsculas | sin subrayado |
| `nav a` | `.nav-link` | `:hover` / `:focus-visible` | `#c9362b` | `#ffffff` | subrayado |
| `nav a` | `.nav-link` | `:active` | sin regla propia: se ve el subrayado de `:hover` | | |

Sin regla en el CSS, por lo que no se diseñaron: `button:focus`, `header > form input:disabled` y `nav a:disabled`.

Nota de tokens: el fondo del `nav` está definido como `rgb(201 54 43)` (`#c9362b`) y no usa `--color-red` (`#c7372b`).

**Exportación:**

- Exportar el mockup a `docs/01-mockup/disenio-bootstrap.png` y el frame de estados a `docs/01-mockup/estados-bootstrap.png`.
- Actualizar el enlace al archivo de Figma y a la imagen exportada en `README.md`.
- Compartir el archivo de Figma con el Desarrollador Frontend/Bootstrap para que lo use con el MCP de Figma.

### 1.3 Criterios de aceptación

- [x] `spec-devops.md` commiteado en `docs/03-specs/primer-parcial/` antes que cualquier otro cambio
- [x] Backport `release/actividad-obligatoria-2` → `develop` mergeado con aprobación de otro integrante ([#84](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/pull/84))
- [x] Mockup de Figma actualizado con la grilla de Bootstrap y los componentes elegidos (desktop 1280, tablet 768 y mobile 390)
- [x] Paleta, tipografías y estados de interacción coherentes con Bootstrap
- [x] Imágenes exportadas en `docs/01-mockup/disenio-bootstrap.png` y `docs/01-mockup/estados-bootstrap.png`
- [x] Enlace al Figma actualizado en `README.md`
- [x] Tablero Kanban creado en GitHub Projects ([FerroLab – Primer Parcial](https://github.com/users/angelgc9107-lgtm/projects/1))
- [x] Issues de todo el equipo cargadas y actualizadas en el tablero Kanban
- [x] Mínimo 4 code reviews asistidos con IA (Claude Code; la especificación indicaba Copilot Agent Mode), documentados en este spec
- [x] Request Changes cargados en las líneas del diff
- [ ] Todas las PR con al menos 1 revisión aprobada antes del merge
- [x] `changelog.md` con las contribuciones de todo el equipo
- [ ] `release/primer-parcial` creada desde `develop` y GitHub Pages habilitado
- [ ] PR de release creada con el template, publicada en Slack y subida al campus
- [ ] Ramas limpias: solo `master`, `develop` y `release/primer-parcial`
- [ ] Tag `v1.1-primer-parcial` y release de GitHub creados después del merge a `master`

---

## 2. AL CERRAR la tarea

### 2.1 Prompts de code review utilizados con Claude Code

Las revisiones se realizaron con asistencia de IA (Claude, de Anthropic), sobre el diff completo de cada PR generado desde la terminal (`git diff origin/develop...<rama>`) y capturas de la pestaña Files changed. Cada hallazgo se verificó contra el código antes de publicarlo, y la decisión final de cada review la tomó el revisor humano.

Prompt base utilizado en cada revisión:

```text
Actúa como un Senior Software Engineer realizando una code review profesional de esta Pull Request <URL de la PR>
INSTRUCCIONES IMPORTANTES: Identifica SOLO problemas reales del código. Enumera los hallazgos (1, 2, 3...). Cada hallazgo debe ser independiente. Sé claro, técnico y concreto. No inventes problemas hipotéticos sin evidencia en el código. No incluyas sugerencias de tests.
PARA CADA HALLAZGO USA EXACTAMENTE ESTA ESTRUCTURA:
HALLAZGO #<número> / Archivo / Línea / Tipo de problema (bug | performance | seguridad | legibilidad | diseño | otro) / Severidad (baja | media | alta | crítica) / Explicación técnica / Sugerencia de mejora / Ejemplo de código corregido (si aplica) / DECISIÓN DEL REVISOR HUMANO: [ ] Aceptar sugerencia [ ] Rechazar sugerencia / Justificación del revisor humano.
Al final agrega: RESUMEN GENERAL DE LA PR y DECISIÓN FINAL SUGERIDA POR IA: APPROVE | REQUEST CHANGES | COMMENT ONLY.
Publica comentarios directamente en el código si lo consideras necesario.
```

| # | PR revisada | Integrante | Rol | Hallazgos | Request Changes en el diff |
|---|-------------|------------|-----|-----------|----------------------------|
| 1 | [#90](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/pull/90) | @alandox1 | Desarrollador de Componentes HTML Avanzados | 8 — REQUEST CHANGES | Sí, comentarios inline |
| 2 | [#96](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/pull/96) | @LuchoBarrionuevo13 | Desarrollador Frontend/Bootstrap | 9 (8 aceptados, 1 rechazado: #6) — REQUEST CHANGES | Sí, comentarios inline |
| 3 | [#99](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/pull/99) | @angelgc9107-lgtm | Especialista en Componentes Bootstrap | 12 (#6 reatribuido a #96 tras verificar el origen) — REQUEST CHANGES | Sí, comentarios inline |
| 4 | [#90](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/pull/90) (re-review) | @alandox1 | Desarrollador de Componentes HTML Avanzados | 6 verificados como resueltos (#2 a #7), 2 abiertos (#1 y #8) y 4 nuevos (#9 a #12) — REQUEST CHANGES | Sí, comentarios inline |
| 5 | [#96](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/pull/96) (re-review) | @LuchoBarrionuevo13 | Desarrollador Frontend/Bootstrap | 8 (#7 retirado por el revisor) — APPROVE tras correcciones | Sí, comentarios inline |
| 6 | [#103](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/pull/103) | @LuchoBarrionuevo13 | Desarrollador Frontend/Bootstrap | 1 (aplicado) — APPROVE | Sí, comentario inline |
| 7 | [#90](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/pull/90) (re-review 2) | @alandox1 | Desarrollador de Componentes HTML Avanzados | 1 (el commit eliminaba `spec-componentes-bootstrap.md` de #99 y dejaba un spec duplicado) — REQUEST CHANGES | Solo en la conversación |
| 8 | [#90](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/pull/90) (re-review 3) | @alandox1 | Desarrollador de Componentes HTML Avanzados | 0 — APPROVE | No aplica |
| 9 | [#104](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/pull/104) | @angelgc9107-lgtm | Especialista en Componentes Bootstrap | 5 — REQUEST CHANGES | Solo en la conversación |
| 10 | [#104](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/pull/104) (re-review) | @angelgc9107-lgtm | Especialista en Componentes Bootstrap | 2 (changelog: entrada de #103 pisada y enlace a #99 en vez de #104) — REQUEST CHANGES | Sí, comentario inline |
| 11 | [#104](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/pull/104) (re-review 2) | @angelgc9107-lgtm | Especialista en Componentes Bootstrap | 0 — APPROVE | No aplica |
| 12 | [#105](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/pull/105) | @angelgc9107-lgtm | Especialista en Componentes Bootstrap | 1 (orden en el CSS, no bloqueante) — APPROVE | Solo en la conversación |

### 2.2 Decisiones del mockup

| Componente / decisión | Motivo |
|-----------------------|--------|
| Estados diseñados a partir de `css/components.css` | El mockup tiene que reflejar el comportamiento real del sitio y no los valores por defecto de Bootstrap |
| Se quitaron `:focus` de botones y `:disabled` del buscador y del nav | No existe ninguna regla en el CSS que los defina |
| Rótulos con selector real y su equivalente Bootstrap | Trazabilidad entre el diseño, el código y la nomenclatura de Bootstrap |
| Nota sobre el color del `nav` | Usa `#c9362b` escrito a mano en lugar del token `--color-red` |

### 2.3 Obstáculos y resolución

| Obstáculo | Resolución |
|-----------|------------|
| Tres PRs (#90, #96, #99) cargaban su propio bundle JS de Bootstrap, lo que duplicaba los handlers de los componentes | Se definió un único dueño del bundle (#99, el único con componentes que usan JS); se quitó de #96 (bfda121) y se pidió quitarlo de #90 |
| La rama de #99 traía una copia de la migración de #96, lo que generaba conflictos y diffs ajenos | Se fijó el orden de merge #96 → #88 → #99 → #103 → #90 y cada rama se actualizó con develop antes de su merge |
| Conflictos en changelog.md por varias PRs que agregaban la cabecera del Primer Parcial | Se unificó en una sola cabecera `# [Primer Parcial] Unreleased` con secciones Added, Changed y Fixed |
| El push del merge de #88 fue rechazado por GitHub con Internal Server Error, aun a una rama nueva | Se descartó el commit de merge local, se subió la corrección del README como commit independiente y se rehízo el merge |
| En la review de #99 se atribuyó a Angel un cambio en los totales del carrito que venía de #96 | Se verificó el origen en el diff de #96, se corrigió el hallazgo en #99 y se pidió documentarlo en el spec de #96 |
| Criterio cambiado sobre el bundle de #96: la primera review pidió agregarlo y la re-review, quitarlo | El cambio se debió a la integración: al revisar #99 se detectó que el bundle quedaba duplicado |
| El autor de #103 no podía resolver los conflictos por horario laboral | Con su OK escrito, el coordinador resolvió los conflictos en la rama y lo dejó documentado en la PR |
| La fix de #104 reemplazaba la entrada de #103 en el changelog en lugar de agregarse debajo, y Git no marcaba conflicto con develop | Se detectó comparando el changelog resultante contra develop; se corrigió en la rama antes del merge y el changelog final conserva las entradas de #88, #90, #96, #99, #103 y #104 |
| #90 acumuló varias rondas de Request Changes con hallazgos nuevos en cada una, y el autor no lograba converger a tiempo | El coordinador entregó `index.html` y `components.css` corregidos y verificados contra develop para que el autor los incorporara en su rama; antes del merge se comprobó que no hubiera conflictos ni bundle de Bootstrap duplicado |
| #105 (fix de #91) y la rama de cierre completaban a la vez el índice de `testing-doc.md` con los test cases 6, 7 y 8, lo que generó conflicto | Se resolvió por terminal conservando una sola versión de las filas del índice (la de develop) y la sección de issues del Primer Parcial |
| Las code reviews se realizaron con Claude Code y no con Copilot Agent Mode, que era lo indicado en la especificación | Se agotaron los créditos de Copilot (límite de tokens). Se documentó el prompt y la herramienta en la sección 2.1 y cada hallazgo se verificó contra el código |

### 2.4 Evidencia

- Mockup exportado: [`docs/01-mockup/disenio-bootstrap.png`](../../01-mockup/disenio-bootstrap.png)
- Estados de interacción: [`docs/01-mockup/estados-bootstrap.png`](../../01-mockup/estados-bootstrap.png)
- Tablero Kanban: [FerroLab – Primer Parcial](https://github.com/users/angelgc9107-lgtm/projects/1)
- PR de release: COMPLETAR link
- GitHub Pages: COMPLETAR link
- Release / tag `v1.1-primer-parcial`: COMPLETAR link