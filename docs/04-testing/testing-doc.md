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
Frontend + estilos responsive aplicados), antes del merge a `develop`. Frontend y Responsive
fueron notificados de los issues encontrados.

| Test Case | Resultado | Issues creados | Responsable notificado |
|-----------|-----------|-----------------|--------------------------|
| TC-1 — Compatibilidad desktop | OK con hallazgo menor | [#42](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/issues/42) — bajo contraste en select "Ordenar por" en WebKit/Safari | Angel (Frontend) |
| TC-2 — Responsive móvil | OK con hallazgo (iPad Air) | [#43](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/issues/43) — overflow horizontal por mapa sin responsive | Especialista en Responsive |
| TC-3 — Performance | OK (sin issues, recomendación de optimización) | Ninguno | — |
| TC-4 — Accesibilidad | Con hallazgos (6 violaciones serious) | [#44](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/issues/44) — contraste insuficiente en precios tachados y selector de orden | Angel (Frontend) |
| TC-5 — Estructura HTML y CSS | OK (sin issues, observación menor) | Ninguno | — |

## Resumen de Issues — Momento 2 (Testing post-merge a develop)

Pendiente — se ejecuta una vez que el Coordinador confirme que las ramas
`feature/dev-frontend-css-add-styles` y `feature/responsive-design-add-responsive-styles`
fueron mergeadas a `develop`.

| Test Case | Resultado | Issues creados | Notificado al Coordinador |
|-----------|-----------|-----------------|------------------------------|
| TC-1 | Pendiente | — | — |
| TC-2 | Pendiente | — | — |
| TC-3 | Pendiente | — | — |
| TC-4 | Pendiente | — | — |
| TC-5 | Pendiente | — | — |

## Totales (Momento 1)

- Tests ejecutados: 5/5
- Tests con hallazgos: 3 (TC-1, TC-2, TC-4)
- Tests limpios: 2 (TC-3, TC-5)
- Issues bugs creados: 3 (#42, #43, #44)

## Notas

- Nota metodológica general: se utilizó **Claude Code** en lugar de GitHub Copilot Agent Mode
  debido a límite de créditos alcanzado durante la ejecución de esta actividad, con los mismos
  servidores MCP (Playwright y GitHub). Ver detalle en `spec-qa.md`.
- TC-1 se ejecutó usando motores reales de navegador (Chromium, Firefox, WebKit) vía el paquete
  `playwright` en lugar del tool nativo de Playwright MCP, ya que este último no permite
  seleccionar motor. Ver nota metodológica específica en `test-case-1.md`.
- El hallazgo de TC-4 (contraste #777777) explica también el problema visual visto en TC-1
  sobre WebKit/Safari — ambos apuntan a la misma causa raíz en el CSS.