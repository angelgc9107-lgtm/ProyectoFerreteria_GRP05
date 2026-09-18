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