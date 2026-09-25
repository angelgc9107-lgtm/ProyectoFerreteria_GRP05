## Momento 1 — Testing pre-merge (ramas `feature/`)

Ejecutado contra la rama `feature/responsive-design-add-responsive-styles`, que incluye
el CSS de Frontend más los estilos responsive.

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

Nota metodológica: se utilizó Claude Code en lugar de GitHub Copilot Agent Mode debido a
límite de créditos alcanzado durante la ejecución de esta actividad, con los mismos servidores
MCP (Playwright y GitHub).

**Resultados:**

| Dispositivo | Resolución | Overflow horizontal | Resultado | Observaciones |
|-------------|------------|----------------------|-----------|----------------|
| iPhone 14 Pro | 390×844 | No | OK | Header, nav, cards y filtros se apilan correctamente en 1 columna. Sin elementos cortados. |
| Samsung Galaxy S23 | 412×915 | No | OK | Mismo comportamiento que iPhone, layout consistente y legible. |
| iPad Air | 820×1180 | Sí (scrollWidth 880px vs clientWidth 805px, ~75px) | **Con problema** | Header, nav y grid de cards (2 columnas) correctos. El mapa de la sección "Ubicación" en el footer no tiene max-width, genera overflow en toda la página. |

**Causa raíz:** la imagen del mapa dentro de la sección "Ubicación" del footer tiene un ancho
fijo que excede el espacio de su columna en el breakpoint de tablet. No se detectaron problemas
en menú, cards de producto ni panel de filtros del catálogo en ningún dispositivo.

**Capturas:** `capturas/tc-2/momento-1/` (iphone14pro.png, galaxys23.png, ipadair.png)

**Issues generados:** [#43](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/issues/43) — overflow horizontal en iPad Air por mapa sin responsive (cerrado)

**Seguimiento del hallazgo (issue #43):** El Especialista en Responsive Design aplicó
`max-width: 100%` a la imagen del mapa. Re-verificado con Playwright MCP: iPad Air sin overflow
(scrollWidth 805px = clientWidth 805px, antes 880px vs 805px). Se re-testearon iPhone 14 Pro y
Galaxy S23 para descartar regresión: ambos siguen sin overflow. Issue #43 cerrado.

**Evidencia de verificación:** `capturas/tc-2/momento-1/verificacion-issue-43.png`

---

## Momento 2 — Testing post-merge (rama `develop`)

Ejecutado contra `develop`, tras el merge de las ramas de Frontend y Responsive.

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
- Guardala en docs/04-testing/capturas/tc-2/momento-2/ con nombre según dispositivo
  (iphone14pro.png, galaxys23.png, ipadair.png)
- Contame si el menú de navegación, las cards de producto, el panel de filtros del catálogo,
  o cualquier otro elemento se ve roto, cortado o mal posicionado

Prestá especial atención a la imagen del mapa en la sección "Ubicación" del footer en iPad Air:
en Momento 1 causaba overflow (880px vs 805px) y se corrigió con max-width: 100%. Confirmá
que la corrección siga vigente tras el merge a develop.

Al final dame un resumen en tabla: Dispositivo | Resolución | Overflow horizontal | Resultado | Observaciones

No abras issues ni modifiques archivos CSS.
```

**Resultados:**

| Dispositivo | Resolución | Overflow horizontal | Resultado | Observaciones |
|-------------|------------|----------------------|-----------|----------------|
| iPhone 14 Pro | 390×844 | No | OK | Menú en 2 líneas sin cortarse, cards en 1 columna, panel de filtros a ancho completo sobre el catálogo. La tabla de precios entra justa. |
| Samsung Galaxy S23 | 412×915 | No | OK | Mismo comportamiento que iPhone, layout consistente. Filtros y mapa a 349px, ningún elemento fuera del viewport. |
| iPad Air | 820×1180 | No | OK con observaciones | Menú en una línea, cards en 2 columnas. Panel de filtros angosto (140px): se corta el texto del selector de orden y los campos Desde/Hasta quedan apretados. El carrito ocupa la mitad derecha con altura fija, dejando espacio vacío. El mapa entra bien pero se ve pixelado (imagen original de 382px escalada a 757px). |

**Nota sobre la medición:** el navegador de testing muestra una barra de scroll de 15px, por lo
que `clientWidth` da 375, 397 y 805 en lugar de 390, 412 y 820. Es la misma condición que en
Momento 1, así que los resultados son comparables. Además de comparar `scrollWidth` contra
`clientWidth`, se verificó que ningún elemento del `body` se salga del viewport por izquierda
ni por derecha.

**Comparación con Momento 1:** el issue #43 sigue corregido tras el merge — el mapa mide 757px
dentro de un contenedor de 805px, con `max-width: 100%` vigente. No hubo regresiones de overflow
en ningún dispositivo.

**Issues generados:** Ninguno.

Durante la ejecución se reportó preliminarmente una superposición entre el botón "×" del carrito
y el texto "Precio unitario" en móvil. Al verificarla con mediciones de Playwright se descartó:
hay 6px de separación, el texto es legible, y la disposición es idéntica en todos los viewports
por usar `position: absolute`. Sí se constató que el área táctil del botón es de 20×20px, por
debajo del mínimo de 24×24px que recomienda WCAG 2.5.8 — se evalúa en TC-4 por tratarse de un
criterio de accesibilidad, no de responsive.

**Observaciones no bloqueantes (sin issue):** texto cortado en el selector de orden en iPad Air,
carrito con altura fija que deja espacio vacío en tablet, y pixelado del mapa por escalado de la
imagen original. Son ajustes de diseño para una próxima iteración, no defectos funcionales.

**Capturas:** `capturas/tc-2/momento-2/` (iphone14pro.png, galaxys23.png, ipadair.png)