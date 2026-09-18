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
  - Contame si el menú de navegación, las cards de producto o cualquier otro elemento
    se ve roto, cortado o mal posicionado

  Al final dame un resumen en tabla: Dispositivo | Resolución | Overflow horizontal | Resultado | Observaciones

  Called MCP, ran 1 shell command

Voy a emular los 3 dispositivos con Playwright MCP, uno por uno, verificando overflow y capturando pantallas.

  - Navegá a la URL con ese viewport
  - Verificá si hay overflow horizontal (comparando document.documentElement.scrollWidth
    contra clientWidth)
  - Sacá una captura de pantalla de la vista completa
  - Guardala en docs/04-testing/capturas/tc-2/momento-1/ con nombre según dispositivo
    (iphone14pro.png, galaxys23.png, ipadair.png)
  - Contame si el menú de navegación, las cards de producto o cualquier otro elemento
    se ve roto, cortado o mal posicionado

  Al final dame un resumen en tabla: Dispositivo | Resolución | Overflow horizontal | Resultado | Observaciones
  ``` 

**Nota:** Este test se corrió contra la rama feature/dev-frontend-css-add-styles.
Al momento de esta ejecución, el Especialista en Responsive Design todavía no había
subido su rama ni existe responsive.css — por lo tanto, los resultados abajo son
una línea base PRE-responsive, no un fallo de la implementación de Frontend.
Se debe repetir este test case una vez exista la rama de Responsive Design.

**Resultados:**

| Dispositivo | Resolución | Overflow horizontal | Resultado | Observaciones |
|-------------|------------|----------------------|-----------|----------------|
| iPhone 14 Pro | 390×844 | Sí (scrollWidth 880px vs clientWidth 390px) | Baseline pre-responsive | Layout fijo ~880px tipo desktop comprimido. Nav y filtros de catálogo no colapsan a una columna. |
| Samsung Galaxy S23 | 412×915 | Sí (leve, imagen del mapa ~416px fija) | Baseline pre-responsive (aceptable) | Layout de 3 columnas se ve razonable, sin roturas. Overflow menor por imagen de mapa sin max-width. |
| iPad Air | 820×1180 | [completar] | [completar] | [completar] |

**Causa raíz identificada:** el sitio no tiene media queries/breakpoints para viewports
móviles (~375-412px); el contenido mantiene un ancho mínimo cercano a 880px, probablemente
por el grid de catálogo con sidebar de filtros + 3 columnas de producto.

**Capturas:** `capturas/tc-2/momento-1/` (iphone14pro.png, galaxys23.png, ipadair.png)

**Issues generados:** Ninguno en esta instancia — el hallazgo corresponde a trabajo pendiente
del Especialista en Responsive Design (breakpoints y media queries), no a un defecto de
Frontend/CSS. Se documenta como referencia para el testing post-implementación.