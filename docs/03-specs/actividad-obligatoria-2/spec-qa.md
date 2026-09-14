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

- **Playwright MCP (`@playwright/mcp`):** servidor MCP oficial de Microsoft que le da a Copilot Agent Mode control de un navegador real. Se elige porque permite ejecutar los 5 test cases (incluyendo viewport emulation y evaluación de APIs del browser) directamente desde prompts en el chat, sin escribir scripts de test a mano.
- **GitHub MCP (`@modelcontextprotocol/server-github`):** permite crear issues de tipo bug directamente desde Copilot Agent Mode por cada hallazgo, evitando el paso manual de ir a GitHub y agilizando la trazabilidad entre hallazgo → issue → PR que lo resuelve.

## Criterios de aceptación

- [ ] 5 test cases ejecutados con Playwright MCP contra `http://localhost:3000` (o el puerto por defecto)
- [ ] Al menos un issue bug creado con GitHub MCP por cada hallazgo relevante
- [ ] Todos los test cases documentados con capturas de pantalla
- [ ] `testing-doc.md` completo con índice y resumen de issues
- [ ] Desarrollador Frontend y Especialista en Responsive notificados sobre los bugs encontrados

---

## Evidencia de cierre (completar al finalizar ambos momentos)

### Prompts utilizados en Copilot Agent + Playwright MCP

_Pendiente — se completa por cada test case a medida que se ejecutan._

### Resumen de resultados

- Tests pasados: —
- Tests fallidos: —
- Bugs creados: —

### Decisiones sobre qué hallazgos se registraron como bugs y cuáles no

_Pendiente — justificar acá los casos donde se decidió NO abrir un issue (ej. hallazgo menor, ya reportado, comportamiento esperado)._