# Testing Doc — Actividad Obligatoria N°2

Índice central de test cases ejecutados con **Playwright MCP** (vía Claude Code — ver nota en spec-qa.md sobre el cambio de herramienta) y resumen de issues creados con **GitHub MCP** en cada momento de testing.

## Índice de Test Cases

| # | Test Case | Descripción | Herramienta |
|---|-----------|-------------|-------------|
| 1 | [test-case-1.md](test-case-1.md) | Compatibilidad en navegadores desktop (Chrome, Firefox, Safari, Edge) | Playwright MCP |
| 2 | [test-case-2.md](test-case-2.md) | Responsive en dispositivos móviles (iPhone 14 Pro, Galaxy S23, iPad Air) | Playwright MCP (viewport emulation) |
| 3 | [test-case-3.md](test-case-3.md) | Performance y carga (Performance API) | Playwright MCP |
| 4 | [test-case-4.md](test-case-4.md) | Accesibilidad web (WCAG 2.1) | Playwright MCP + axe-core |
| 5 | [test-case-5.md](test-case-5.md) | Estructura HTML semántica y validación W3C (HTML/CSS) | Playwright MCP + validadores W3C |

## Resumen de Issues — Momento 1 (Testing pre-merge)

Ejecutado contra la rama `feature/responsive-design-add-responsive-styles` (incluye CSS de
Frontend + estilos responsive aplicados), antes del merge a `develop`. Los responsables de cada
hallazgo fueron notificados y los tres issues quedaron resueltos y verificados antes del merge.

| Test Case | Resultado | Issues creados | Responsable notificado |
|-----------|-----------|-----------------|--------------------------|
| TC-1 — Compatibilidad desktop | OK con hallazgo menor | [#42](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/issues/42) — bajo contraste en select "Ordenar por" en WebKit/Safari (cerrado) | Desarrollador Frontend / CSS |
| TC-2 — Responsive móvil | OK con hallazgo (iPad Air) | [#43](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/issues/43) — overflow horizontal por mapa sin responsive (cerrado) | Especialista en Responsive Design |
| TC-3 — Performance | OK (sin issues, recomendación de optimización) | Ninguno | — |
| TC-4 — Accesibilidad | Con hallazgos (6 violaciones serious) | [#44](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/issues/44) — contraste insuficiente en precios tachados y selector de orden (cerrado) | Desarrollador Frontend / CSS |
| TC-5 — Estructura HTML y CSS | OK (sin issues, observación menor) | Ninguno | — |

## Resumen de Issues — Momento 2 (Testing post-merge a develop)

Ejecutado contra `develop`, tras el merge de las ramas de Frontend y Responsive. El objetivo
fue verificar que las correcciones de Momento 1 sobrevivieran a la integración y detectar
problemas que solo aparecen al combinar el trabajo de ambos roles.

| Test Case | Resultado | Issues creados | Responsable notificado |
|-----------|-----------|-----------------|--------------------------|
| TC-1 — Compatibilidad desktop | OK en los 4 navegadores | Ninguno | — |
| TC-2 — Responsive móvil | OK sin overflow en los 3 dispositivos | Ninguno | — |
| TC-3 — Performance | Con hallazgo | [#46](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/issues/46) — diferencia de mayúsculas en nombres de imágenes causaba 404 en GitHub Pages (cerrado) | Desarrollador Frontend / CSS |
| TC-4 — Accesibilidad | OK — 0 violaciones WCAG 2.1 A+AA | Ninguno | — |
| TC-5 — Estructura HTML y CSS | OK — HTML con 0 errores y 0 warnings | Ninguno | — |

### Verificación de correcciones de Momento 1

| Issue | Estado tras el merge |
|-------|------------------------|
| #42 — contraste en select "Ordenar por" | Sigue corregido (5,32:1) |
| #43 — overflow del mapa en iPad Air | Sigue corregido (805px = 805px) |
| #44 — contraste en precios tachados | Sigue corregido (5,33:1) |

Ninguna corrección se perdió ni fue revertida durante la integración.

### Verificación del hallazgo de Momento 2

El issue #46 fue corregido por el Desarrollador Frontend / CSS y verificado en `develop` mediante
una comparación sensible a mayúsculas entre los archivos versionados en git y las referencias del
HTML: las 16 coinciden exactamente. Como la release desde la que se publica el sitio se genera a
partir de `develop`, el arreglo está en la rama que corresponde. Issue #46 cerrado.

**Los 4 issues de ambos momentos quedaron resueltos y verificados** (#42, #43, #44 y #46). No hay
hallazgos pendientes de QA.

## Totales

| | Momento 1 | Momento 2 |
|---|-----------|-----------|
| Tests ejecutados | 5/5 | 5/5 |
| Tests con hallazgos | 3 (TC-1, TC-2, TC-4) | 1 (TC-3) |
| Tests limpios | 2 (TC-3, TC-5) | 4 (TC-1, TC-2, TC-4, TC-5) |
| Issues creados | 3 (#42, #43, #44) | 1 (#46) |
| Issues cerrados | 3 | 1 |

## Observaciones no bloqueantes (sin issue)

Hallazgos documentados en los test cases que no constituyen defectos funcionales:

- **Peso de imágenes (TC-3):** `Bienvenido1.png` y `Bienvenido2.png` suman 751 KB, el 79% del peso
  total de imágenes. Se recomienda convertirlas a WebP o JPG antes del despliegue a producción.
- **Área táctil (TC-4):** 3 links de categorías del panel de filtros quedan por debajo del mínimo
  de `target-size`, que pertenece a WCAG 2.2 y está fuera del alcance de este testing (WCAG 2.1).
- **Semántica de headings (TC-5):** el único `<h1>` es "Ofertas" y no el nombre del sitio.
- **Nombres accesibles (TC-5):** los dos campos "Cantidad" del carrito se anuncian igual, y el
  texto visible del link del carrito no coincide con su `aria-label`.
- **Sintaxis CSS (TC-5):** `clip: rect(0 0 0 0)` en `components.css:36` usa sintaxis legacy sin comas.
- **Layout en tablet (TC-2):** panel de filtros angosto con texto cortado, carrito con altura fija
  que deja espacio vacío, y mapa pixelado por escalado.

## Notas metodológicas

- Se utilizó **Claude Code** en lugar de GitHub Copilot Agent Mode debido a límite de créditos
  alcanzado durante la ejecución de esta actividad, con los mismos servidores MCP (Playwright y
  GitHub). Ver detalle en `spec-qa.md`.
- TC-1 se ejecutó usando motores reales de navegador (Chromium, Firefox, WebKit) vía el paquete
  `playwright` en lugar del tool nativo de Playwright MCP, ya que este último no permite
  seleccionar motor. Ver nota metodológica específica en `test-case-1.md`.
- Las condiciones de medición de TC-3 difieren entre momentos (servidor y estado de caché
  distintos), por lo que los tiempos no son directamente comparables; sí lo es el peso de los
  recursos. Detalle en `test-case-3.md`.
- En TC-2 (Momento 2) se descartó un falso positivo mediante medición con Playwright: una supuesta
  superposición entre el botón "×" del carrito y el texto "Precio unitario" que resultó no existir.
  El hallazgo derivado sobre área táctil se evaluó en TC-4 y tampoco constituye violación.