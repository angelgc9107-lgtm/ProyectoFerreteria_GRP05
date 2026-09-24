# Spec QA — Actividad Obligatoria N°2

**Rol:** Documentador / QA Tester
**Rama:** `feature/doc-qa-tester-add-test-cases`

## Plan de testing

Se van a ejecutar 5 test cases automatizados con Playwright MCP contra `http://localhost:3000`, en dos momentos: pre-merge (sobre las ramas `feature/` del Desarrollador Frontend y del Especialista en Responsive) y post-merge (sobre `develop`, una vez integradas todas las features).

| Test Case | Qué se prueba | Por qué es relevante |
|-----------|----------------|------------------------|
| TC-1: Compatibilidad desktop | Renderizado visual en Chrome (1920×1080), Firefox (1440×900), Safari/macOS (1280×800) y Edge (1280×800) | El CSS generado con Figma MCP puede tener inconsistencias entre motores de renderizado; hay que garantizar que el sitio se vea igual en los navegadores más usados |
| TC-2: Responsive móvil | Adaptación del layout en iPhone 14 Pro (390×844), Samsung Galaxy S23 (412×915) y iPad Air (820×1180) usando viewport emulation | Es el requisito central de esta entrega (diseño responsive); hay que confirmar que no haya overflow horizontal ni elementos rotos en ningún breakpoint |
| TC-3: Performance y carga | Métricas de la Performance API: DOMContentLoaded, Load completo, DOM Interactive, y listado de recursos con tamaño/tiempo de descarga | Un sitio con estilos y assets nuevos puede degradar los tiempos de carga; conviene detectarlo temprano antes de la entrega final |
| TC-4: Accesibilidad web | Inyección de axe-core para detectar violaciones WCAG 2.1 por nivel de impacto (critical, serious, moderate, minor) | La accesibilidad no se valida visualmente; axe-core permite encontrar problemas de contraste, etiquetado y semántica que pasan desapercibidos a simple vista |
| TC-5: Estructura HTML semántica y validación W3C | Jerarquía de headings, landmarks (section, article, nav, main, footer), etiquetas de formulario, y validación de HTML/CSS vía API del W3C | Una estructura semántica correcta es base tanto de accesibilidad como de SEO, y los validadores W3C detectan errores de sintaxis que el navegador tolera pero no son válidos |

## Herramientas a utilizar

- **Playwright MCP (`@playwright/mcp`):** servidor MCP oficial de Microsoft que le da a Claude Code control de un navegador real. Se elige porque permite ejecutar los 5 test cases (incluyendo viewport emulation y evaluación de APIs del browser) directamente desde prompts en el chat, sin escribir scripts de test a mano.
- **GitHub MCP (`@modelcontextprotocol/server-github`):** permite crear issues de tipo bug directamente desde Claude Code por cada hallazgo, evitando el paso manual de ir a GitHub y agilizando la trazabilidad entre hallazgo → issue → PR que lo resuelve.

## Criterios de aceptación

### Momento 1 — Testing pre-merge

**COMPLETADO**

Ejecutado contra la rama `feature/responsive-design-add-responsive-styles`, que integra el CSS
de Frontend con los estilos responsive.

- [x] 5 test cases ejecutados: TC-1 (compatibilidad desktop), TC-2 (responsive móvil), TC-3 (performance), TC-4 (accesibilidad WCAG 2.1), TC-5 (estructura HTML + validación W3C)
- [x] 3 issues de bug creados: #42 (contraste en select en WebKit), #43 (overflow en iPad Air por mapa sin responsive), #44 (contraste insuficiente en precios tachados y selector)
- [x] Responsables notificados: Desarrollador Frontend / CSS (#42, #44) y Especialista en Responsive Design (#43)
- [x] Correcciones verificadas y los 3 issues cerrados antes del merge
- [x] Documentación actualizada: spec-qa.md, 5 test-case-*.md, testing-doc.md, changelog.md

**Resultados:**

| Test Case | Resultado | Issues |
|-----------|-----------|--------|
| TC-1 — Compatibilidad desktop | OK con hallazgo menor de contraste en WebKit | #42 (cerrado) |
| TC-2 — Responsive móvil | Overflow horizontal en iPad Air | #43 (cerrado) |
| TC-3 — Performance | OK, sin issues (recomendación de optimizar imágenes) | — |
| TC-4 — Accesibilidad | 6 violaciones serious de color-contrast | #44 (cerrado) |
| TC-5 — Estructura HTML y CSS | OK, sin issues | — |

**Decisiones de clasificación:** se reportaron como issue únicamente los hallazgos que constituyen
defectos verificables (overflow de layout y violaciones WCAG medidas con axe-core). Las
recomendaciones de optimización y los ajustes de diseño se documentaron como observaciones no
bloqueantes en cada test case, sin abrir issue.

### Momento 2 — Testing post-merge

**COMPLETADO**

Ejecutado contra `develop`, tras el merge de las ramas de Frontend y Responsive. El objetivo fue
verificar que las correcciones de Momento 1 sobrevivieran a la integración y detectar problemas
que solo aparecen al combinar el trabajo de ambos roles.

- [x] 5 test cases repetidos contra `develop`
- [x] Verificado que los 3 issues de Momento 1 siguen corregidos tras el merge (sin regresiones)
- [x] 1 issue de bug creado: #46 (diferencia de mayúsculas en nombres de imágenes)
- [x] Responsable notificado: Desarrollador Frontend / CSS
- [x] Documentación actualizada: 5 test-case-*.md y testing-doc.md con resultados de ambos momentos

**Resultados:**

| Test Case | Resultado | Issues |
|-----------|-----------|--------|
| TC-1 — Compatibilidad desktop | OK en los 4 navegadores | — |
| TC-2 — Responsive móvil | OK, sin overflow en los 3 dispositivos | — |
| TC-3 — Performance | Hallazgo: nombres de imágenes con mayúsculas romperán el sitio en GitHub Pages | #46 (abierto) |
| TC-4 — Accesibilidad | OK, 0 violaciones WCAG 2.1 A+AA | — |
| TC-5 — Estructura HTML y CSS | OK, HTML con 0 errores y 0 warnings | — |

**Verificación de correcciones de Momento 1:** #42 sigue en 5,32:1, #43 sin overflow (805px =
805px) y #44 en 5,33:1. Ninguna corrección se perdió durante la integración.

**Pendiente antes de la release:** el issue #46 sigue abierto. Es el único hallazgo con impacto en
producción, ya que el sitio funciona correctamente en desarrollo local (Windows) pero las imágenes
de la sección "Bienvenidos a FerroLab" devolverán 404 al publicarse en GitHub Pages, que corre
sobre Linux.

### Nota metodológica

Se utilizó Claude Code en lugar de GitHub Copilot Agent Mode debido a límite de créditos alcanzado
durante la ejecución de esta actividad, con los mismos servidores MCP (Playwright y GitHub).

En TC-1, el servidor Playwright MCP controla una única instancia de navegador sin permitir
seleccionar el motor, por lo que para probar Chromium, Firefox y WebKit reales se utilizó el
paquete `playwright` instalado como dependencia de desarrollo. Detalle en `test-case-1.md`.