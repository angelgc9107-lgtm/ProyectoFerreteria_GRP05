## Momento 1 — Testing pre-merge (ramas `feature/`)

**Prompt utilizado en Claude Code + Playwright MCP:**
```
Usá Playwright MCP para emular estos 3 dispositivos en http://127.0.0.1:3000/index.html:

1. iPhone 14 Pro (390x844)
2. Samsung Galaxy S23 (412x915)
3. iPad Air (820x1180)

Para cada uno:
- Navegá a la URL con ese viewport
- Verificá si hay overflow horizontal (comparando document.documentElement.scrollWidth
  contra clientWidth)
- Sacá una captura de pantalla de la vista completa
- Guardala en docs/04-testing/capturas/tc-2/momento-1/ con nombre según dispositivo
  (iphone14pro.png, galaxys23.png, ipadair.png)
- Contame si el menú de navegación, las cards de producto, el panel de filtros del catálogo,
  o cualquier otro elemento se ve roto, cortado o mal posicionado

Al final dame un resumen en tabla: Dispositivo | Resolución | Overflow horizontal | Resultado | Observaciones
``` 

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

**Seguimiento del hallazgo (issue #43):** El Especialista en Responsive Design aplicó
`max-width: 100%` a la imagen del mapa. Re-verificado con Playwright MCP: iPad Air sin overflow
(scrollWidth 805px = clientWidth 805px, antes 880px vs 805px). Se re-testearon iPhone 14 Pro y
Galaxy S23 para descartar regresión: ambos siguen sin overflow. Issue #43 cerrado.

**Evidencia de verificación:** `capturas/tc-2/momento-1/verificacion-issue-43.png`