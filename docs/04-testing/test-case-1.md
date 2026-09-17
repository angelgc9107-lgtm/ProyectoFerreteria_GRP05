## Momento 1 — Testing pre-merge (ramas `feature/`)

**Prompt utilizado en Copilot Agent + Playwright MCP:**

Nota metodológica: el servidor Playwright MCP disponible controla una única instancia
de navegador ya abierta, sin parámetro para elegir motor (Chromium/Firefox/WebKit) ni
falsificar el user agent. Para lograr motores REALES (no simulación), se usó el paquete
`playwright` (ya presente en devDependencies) vía script Node, lanzando Chromium, Firefox
y WebKit de forma directa, sirviendo el sitio con un servidor estático temporal en el
puerto 3000.

**Resultados:**

| Navegador | Resolución | Resultado | Observaciones |
|-----------|------------|-----------|----------------|
| Chromium | 1920×1080 | OK | Sin roturas visuales, sin overflow. Referencia visual base. |
| Firefox | 1440×900 | OK (menor) | Input numérico muestra spinners con fondo gris claro (Chrome no los muestra). |
| WebKit (Safari) | 1280×800 | **FAIL (menor)** | Select "Ordenar por" con bajo contraste, casi ilegible. Spinners con estilo propio. |
| Chromium + UA Edge | 1280×800 | OK | Renderiza igual que Chrome (mismo motor); UA reportado como Edge pero no valida motor real Blink/EdgeHTML con binario propio. |

Sin imágenes rotas, sin overflow horizontal, sin errores 404 en assets, status 200 en los 4 casos.
El recuadro gris junto a "Carrito de compras" es un overlay intencional (`#carrito::before`),
no es un bug — simula el panel lateral abierto, presente igual en los 4 navegadores.

**Capturas:** `capturas/tc-1/momento-1/` (chrome-desktop.png, firefox-desktop.png, safari-desktop.png, edge-desktop.png)

**Issues generados:** [#42](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/issues/42) — bajo contraste en select "Ordenar por" en WebKit/Safari