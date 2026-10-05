# 🛠️ Spec — Coordinador / DevOps — Primer Parcial

## 📌 Datos

- **Integrante:** Thiago Piastrellini ([@Piastrellini](https://github.com/Piastrellini)) — Matrícula 158097
- **Rol:** Coordinador / DevOps
- **Rama:** `feature/coord-devops-update-figma-and-readme`
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

**Componentes avanzados (definición final con cada rol):**

- Bootstrap (Especialista en Componentes Bootstrap): COMPLETAR los 2 componentes elegidos (propuesta: Navbar con `collapse` en mobile y Carousel de destacados en Inicio).
- HTML avanzados (Desarrollador de Componentes HTML Avanzados): COMPLETAR los 2 componentes elegidos (propuesta: `iframe` de Google Maps en Contacto/Ubicación dentro de `.ratio .ratio-16x9`).

**Paleta, tipografías y estados de interacción:**

- Mapear los tokens de `css/styles.css` a las variables de Bootstrap (`--bs-primary`, `--bs-secondary`, `--bs-body-font-family`, etc.) para mantener la identidad de FerroLab.
- Representar los estados hover, focus, active y disabled de `.btn`, `.nav-link` y `.form-control`.

**Exportación:**

- Exportar el mockup a `docs/01-mockup/disenio-bootstrap.png`.
- Actualizar el enlace al archivo de Figma y a la imagen exportada en `README.md`.
- Compartir el archivo de Figma con el Desarrollador Frontend/Bootstrap para que lo use con el MCP de Figma.

### 1.3 Criterios de aceptación

- [x] `spec-devops.md` commiteado en `docs/03-specs/primer-parcial/` antes que cualquier otro cambio
- [x] Backport `release/actividad-obligatoria-2` → `develop` mergeado con aprobación de otro integrante ([#84](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/pull/84))
- [x] Mockup de Figma actualizado con la grilla de Bootstrap y los componentes elegidos (desktop 1280, tablet 768 y mobile 390)
- [x] Paleta, tipografías y estados de interacción coherentes con Bootstrap
- [x] Imagen exportada en `docs/01-mockup/disenio-bootstrap.png`
- [x] Enlace al Figma actualizado en `README.md`
- [x] Tablero Kanban creado en GitHub Projects ([FerroLab – Primer Parcial](https://github.com/users/angelgc9107-lgtm/projects/1))
- [ ] Issues de todo el equipo cargadas y actualizadas en el tablero Kanban
- [ ] Mínimo 4 code reviews asistidos con Copilot Agent Mode, documentados en este spec
- [ ] Request Changes cargados en las líneas del diff
- [ ] Todas las PR con al menos 1 revisión aprobada antes del merge
- [ ] `changelog.md` con las contribuciones de todo el equipo
- [ ] `release/primer-parcial` creada desde `develop` y GitHub Pages habilitado
- [ ] PR de release creada con el template, publicada en Slack y subida al campus
- [ ] Ramas limpias: solo `master`, `develop` y `release/primer-parcial`
- [ ] Tag `v1.1-primer-parcial` y release de GitHub creados después del merge a `master`

---

## 2. AL CERRAR la tarea

### 2.1 Prompts de code review utilizados con Copilot Agent Mode

Prompt base utilizado en cada revisión:

```text
COMPLETAR con el prompt exacto utilizado
```

| # | PR revisada | Integrante | Rol | Hallazgos | Request Changes en el diff |
|---|-------------|------------|-----|-----------|----------------------------|
| 1 | #NN | | | | |
| 2 | #NN | | | | |
| 3 | #NN | | | | |
| 4 | #NN | | | | |

### 2.2 Decisiones del mockup

| Componente / decisión | Motivo |
|-----------------------|--------|
| | |

### 2.3 Obstáculos y resolución

| Obstáculo | Resolución |
|-----------|------------|
| | |

### 2.4 Evidencia

- Mockup exportado: [`docs/01-mockup/disenio-bootstrap.png`](../../01-mockup/disenio-bootstrap.png)
- Tablero Kanban: COMPLETAR link
- PR de release: COMPLETAR link
- GitHub Pages: COMPLETAR link
- Release / tag `v1.1-primer-parcial`: COMPLETAR link