## Momento 1 — Testing pre-merge (ramas `feature/`)

**Prompt utilizado en Claude Code + Playwright MCP:**
[el mismo prompt de TC-2 que usamos]

**Resultados:**

| Dispositivo | Resolución | Overflow horizontal | Resultado | Observaciones |
|-------------|------------|----------------------|-----------|----------------|
| iPhone 14 Pro | 390×844 | No | OK | Header, nav, cards y filtros se apilan correctamente en 1 columna. Sin elementos cortados. |
| Samsung Galaxy S23 | 412×915 | No | OK | Mismo comportamiento que iPhone, layout consistente y legible. |
| iPad Air | 820×1180 | Sí (scrollWidth 880px vs clientWidth 805px, ~75px) | **Con problema** | Header, nav y grid de cards (2 columnas) correctos. El mapa de la sección "Ubicación" en el footer no tiene max-width, genera overflow en toda la página. |

**Causa raíz:** la imagen del mapa (`#direccion`) dentro de la sección "Ubicación" del footer
tiene un ancho fijo que excede el espacio de su columna en el breakpoint de tablet.
No se detectaron problemas en menú, cards de producto ni panel de filtros del catálogo
en ningún dispositivo.

**Capturas:** `capturas/tc-2/momento-1/` (iphone14pro.png, galaxys23.png, ipadair.png)

**Issues generados:** [#43](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/issues/43) — overflow horizontal en iPad Air por mapa sin responsive