# Testing Doc — Actividad Obligatoria N°2

Índice central de test cases ejecutados con **Playwright MCP** y resumen de issues creados con **GitHub MCP** en cada momento de testing.

## Índice de Test Cases

| # | Test Case | Descripción | Herramienta |
|---|-----------|-------------|-------------|
| 1 | [test-case-1.md](test-case-1.md) | Compatibilidad en navegadores desktop (Chrome, Firefox, Safari, Edge) | Playwright MCP |
| 2 | [test-case-2.md](test-case-2.md) | Responsive en dispositivos móviles (iPhone 14 Pro, Galaxy S23, iPad Air) | Playwright MCP (viewport emulation) |
| 3 | [test-case-3.md](test-case-3.md) | Performance y carga (Performance API) | Playwright MCP |
| 4 | [test-case-4.md](test-case-4.md) | Accesibilidad web (WCAG 2.1) | Playwright MCP + axe-core |
| 5 | [test-case-5.md](test-case-5.md) | Estructura HTML semántica y validación W3C (HTML/CSS) | Playwright MCP + validadores W3C |

## Resumen de Issues — Momento 1 (Testing pre-merge)

Ejecutado contra las ramas `feature/` del Desarrollador Frontend y del Especialista en Responsive, antes del merge a `develop`.

| Test Case | Resultado | Issues creados | Responsable notificado |
|-----------|-----------|-----------------|--------------------------|
| TC-1 | Pendiente | — | — |
| TC-2 | Pendiente | — | — |
| TC-3 | Pendiente | — | — |
| TC-4 | Pendiente | — | — |
| TC-5 | Pendiente | — | — |

## Resumen de Issues — Momento 2 (Testing post-merge a develop)

Ejecutado contra `develop` una vez integradas todas las ramas `feature/`, como revisión final antes de la creación de la release.

| Test Case | Resultado | Issues creados | Notificado al Coordinador |
|-----------|-----------|-----------------|------------------------------|
| TC-1 | Pendiente | — | — |
| TC-2 | Pendiente | — | — |
| TC-3 | Pendiente | — | — |
| TC-4 | Pendiente | — | — |
| TC-5 | Pendiente | — | — |

## Totales

- Tests pasados: —
- Tests fallidos: —
- Issues bugs totales creados: —

## Notas

Este archivo se completa a medida que se ejecutan los test cases en cada momento. Cada fila de "Issues creados" debe llevar el link directo al issue de GitHub (ej. `#12`, `#15`). El campo "Resultado" se actualiza a **OK** o **FAIL** después de correr el test con Playwright MCP.