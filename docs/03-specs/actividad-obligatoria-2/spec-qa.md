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

✅ **COMPLETADO**

- [x] 5 test cases ejecutados: TC-1 (compatibilidad desktop), TC-2 (responsive móvil), TC-3 (performance), TC-4 (accesibilidad WCAG 2.1), TC-5 (estructura HTML + validación W3C)
- [x] 3 issues de bug creados: #42 (contraste en WebKit), #43 (overflow iPad Air), #44 (contraste WCAG)
- [x] Responsables notificados: Angel (Frontend) y Lucho (Responsive)
- [x] Documentación actualizada: spec-qa.md, 5 test-case-*.md, testing-doc.md, changelog.md
- [x] Herramienta utilizada: Claude Code + Playwright MCP (en lugar de Copilot Agent por límite de créditos)

**Resultados resumidos:**
- TC-1: OK con hallazgo menor (contraste)
- TC-2: OK con hallazgo de overflow en iPad Air
- TC-3: OK sin issues
- TC-4: 6 violaciones serious de contraste
- TC-5: OK sin issues

### Momento 2 — Testing post-merge

⏳ **PENDIENTE** — Se ejecuta una vez que el Coordinador confirme que ambas ramas de feature/ fueron mergeadas a `develop`. Los 5 test cases se repetirán contra la versión integrada para detectar problemas de interacción entre CSS y responsive.

### Nota: 
Se utilizó Claude Code en lugar de GitHub Copilot debido a límite de créditos alcanzado durante la ejecución de esta actividad, con los mismos servidores MCP (Playwright y GitHub).'