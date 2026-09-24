## Momento 1 — Testing pre-merge (ramas `feature/`)

**Prompt utilizado en Claude Code + Playwright MCP:**

```
Usá Playwright MCP para abrir http://127.0.0.1:3000/index.html, inyectar axe-core y correr
un análisis de accesibilidad completo (WCAG 2.1).

Dame las violaciones encontradas agrupadas por nivel de impacto (critical, serious, moderate,
minor), indicando para cada una: la regla de axe que la generó, el elemento HTML afectado
(selector), y una breve descripción del problema.

Sacá una captura de pantalla de la vista completa y guardala en
docs/04-testing/capturas/tc-4/momento-1/accesibilidad-screenshot.png

Al final dame un resumen: cuántas violaciones totales, cuántas por cada nivel de impacto.
```

**Resultados (violaciones encontradas):**

| Nivel de impacto | Regla axe | Elemento afectado | Descripción |
|-------------------|-----------|---------------------|--------------|
| Serious | color-contrast | 5x `<del>` (precio tachado) en tarjetas de producto | Contraste 4.47:1 (texto #777777 sobre blanco), por debajo del mínimo 4.5:1 |
| Serious | color-contrast | `#orden` (select "Orden de productos") | Texto blanco sobre fondo gris #777777, contraste 4.47:1 |

**Resumen:** 64 reglas evaluadas — 0 critical, 6 serious, 0 moderate, 0 minor. Total: 6 violaciones,
todas de la misma regla (color-contrast).

**Casos "incomplete" (revisión manual pendiente, no confirmados):**
- Botón "Buscar" (`form[action="#catalogo"] > button[type="submit"]`): contraste 1:1 detectado,
  posible ícono/texto invisible.
- `#carrito > article:nth-child(3) > p:nth-child(2)`: fondo tapado por otro elemento.
- `#mensaje` (textarea del formulario de contacto): fondo parcialmente tapado.

**Capturas:** `capturas/tc-4/momento-1/accesibilidad-screenshot.png`

**Issues generados:** [#44](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/issues/44) — contraste insuficiente en precios tachados y selector de orden

**Seguimiento del hallazgo (issue #44):** El Desarrollador Frontend / CSS aplicó dos rondas
de corrección. En la primera re-verificación, 1 de las 6 violaciones quedó corregida (el select
`#orden`, 5.33:1) y 5 seguían pendientes (los `<del>` de precio tachado, 4.47:1). Tras la
segunda corrección, los 5 `<del>` pasaron a #6b6b6b (5.33:1). Resultado final: 0 violaciones
serious de color-contrast. Issue #44 cerrado.

Observación no bloqueante: el botón "Buscar" aparece como "incomplete" en axe porque su texto
es transparente y el ícono se muestra vía `::after` (patrón de botón-ícono válido).

**Evidencia de verificación:** `capturas/tc-4/momento-1/verificacion-issue-44.png`

---

## Momento 2 — Testing post-merge (rama `develop`)
 
Ejecutado contra `develop`, tras el merge de las ramas de Frontend y Responsive.
 
**Prompt utilizado en Claude Code + Playwright MCP:**
 
```
Usá Playwright MCP para abrir http://127.0.0.1:3000/index.html, inyectar axe-core y correr
un análisis de accesibilidad completo (WCAG 2.1 A + AA).
 
Dame las violaciones encontradas agrupadas por nivel de impacto (critical, serious, moderate,
minor), indicando para cada una: la regla de axe, el elemento afectado (selector) y el ratio
de contraste actual si aplica.
 
Contexto de Momento 1: había 6 violaciones serious de color-contrast (5 elementos <del> de
precio tachado + el select #orden). Todas fueron corregidas antes del merge, pasando el gris
a #6b6b6b. Confirmá que sigan corregidas tras el merge a develop.
 
Adicionalmente, verificá específicamente la regla target-size (WCAG 2.5.8): en TC-2 se midió
que el botón "×" de eliminar ítem del carrito tiene un área táctil de 20x20px, por debajo del
mínimo de 24x24px. Decime si axe la reporta como violación, y si no lo hace, explicame por qué
(si la regla no está activa en el set que estás corriendo, o si el elemento queda exento).
 
Sacá una captura de pantalla de la vista completa y guardala en
docs/04-testing/capturas/tc-4/momento-2/accesibilidad-screenshot.png
 
Al final dame un resumen: cuántas violaciones totales, cuántas por cada nivel de impacto.
 
No abras issues ni modifiques archivos CSS.
```
 
**Condiciones de medición:** axe-core 4.13.0, reglas `wcag2a`, `wcag2aa`, `wcag21a` y `wcag21aa`.
Analizado en dos viewports: desktop (1366×768) e iPhone 14 Pro (390×844).
 
**Resultados:**
 
| Nivel de impacto | Violaciones |
|-------------------|--------------|
| Critical | 0 |
| Serious | 0 |
| Moderate | 0 |
| Minor | 0 |
| **Total** | **0** |
 
28 reglas pasaron, 34 no aplicaban a la página, 1 regla quedó como "incomplete".
 
**Comparación con Momento 1:** las 6 violaciones serious de `color-contrast` detectadas en
Momento 1 siguen corregidas tras el merge:
 
| Elemento | Colores | Ratio | Mínimo |
|----------|---------|-------|--------|
| 5 × `<del>` (precio tachado) | #6b6b6b sobre blanco | 5,33:1 | 4,5:1 |
| `#orden` (select) | #ffffff sobre #6b6b6b | 5,32:1 | 4,5:1 |
 
**Casos "incomplete" (revisados manualmente, sin violación):** axe no pudo calcular el contraste
de 14 elementos. Se verificaron a mano con los colores reales y todos superan el mínimo:
 
- Botón "Buscar" (`form[action="#catalogo"] > button[type="submit"]`): el texto tiene `color:
  transparent` y el ícono de lupa se muestra vía `::after`, por lo que axe reporta 1:1. El ratio
  real del ícono es 13,39:1 y el nombre accesible "Buscar" se mantiene.
- 13 elementos dentro de `#carrito`: la capa semitransparente `#carrito::before`
  (`rgba(0,0,0,.12)`) impide que axe determine el fondo. Los ratios reales van de 5,19:1 en
  adelante, todos por encima del mínimo.
**Sobre la regla `target-size` (WCAG 2.5.8):** no se ejecuta en este análisis porque el criterio
2.5.8 pertenece a **WCAG 2.2**, no a 2.1, que es el alcance de este test case. Corrida por separado:
 
- El botón "×" del carrito (medido en 20×20px en TC-2) **no constituye violación**: queda exento
  por la excepción de espaciado del propio criterio, ya que un círculo de 24px de diámetro centrado
  en el botón no se superpone con ningún otro control. Esto cierra el hallazgo que había quedado
  pendiente de evaluación en TC-2.
- Sí se detectaron 3 violaciones de `target-size` en desktop (links de categorías "Accesorios",
  "Electricidad" y "Jardinería" del panel de filtros, con 14px de alto y 14 a 22,8px de espacio
  libre) que en iPhone 14 Pro suben a 5. Quedan **fuera del alcance de WCAG 2.1** y se documentan
  como observación para una eventual evaluación bajo WCAG 2.2.
**Capturas:** `capturas/tc-4/momento-2/accesibilidad-screenshot.png`
 
**Issues generados:** Ninguno. La accesibilidad del sitio cumple WCAG 2.1 A + AA sin violaciones
tras el merge.