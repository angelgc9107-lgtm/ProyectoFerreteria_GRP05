## Momento 1 — Testing pre-merge (ramas `feature/`)

**Prompt utilizado en Claude Code + Playwright MCP:**
```
Usá Playwright MCP para testear compatibilidad visual del sitio en http://127.0.0.1:3000/index.html
en estos 4 navegadores/viewports, usando motores reales de cada uno:

1. Chromium, 1920x1080
2. Firefox, 1440x900
3. WebKit (equivalente a Safari), 1280x800
4. Chromium con user agent de Edge, 1280x800

Para cada uno:
- Navegá a la URL
- Sacá una captura de pantalla de la vista completa
- Guardala en docs/04-testing/capturas/tc-1/momento-1/ con nombre según el navegador
  (chrome-desktop.png, firefox-desktop.png, safari-desktop.png, edge-desktop.png)
- Contame si encontrás algún problema visual: elementos rotos, texto cortado,
  imágenes que no cargan, o diferencias notables entre navegadores

Al final dame un resumen en formato tabla: Navegador | Resolución | Resultado (OK/FAIL) | Observaciones
``` 

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

**Seguimiento del hallazgo (issue #42):** El desarrollador Frontend / CSS aplicó dos rondas de corrección. La primera
verificación mostró que el contraste seguía por debajo del mínimo (~4.48:1). Tras la segunda
corrección (fondo cambiado a #6b6b6b), se verificó nuevamente con Playwright MCP: ratio
actual de 5.33:1, cumple WCAG 2.1 AA con margen. Issue #42 cerrado.

## Momento 2 — Testing post-merge (rama `develop`)

**Prompt utilizado en Claude Code + Playwright MCP:**

Usá Playwright MCP para testear compatibilidad visual del sitio en http://127.0.0.1:3000/index.html
en estos 4 navegadores/viewports, usando motores reales de cada uno:

1. Chromium, 1920x1080
2. Firefox, 1440x900
3. WebKit (equivalente a Safari), 1280x800
4. Chromium con user agent de Edge, 1280x800

Para cada uno:
- Navegá a la URL
- Sacá una captura de pantalla de la vista completa
- Guardala en docs/04-testing/capturas/tc-1/momento-2/ con nombre según el navegador
  (chrome-desktop.png, firefox-desktop.png, safari-desktop.png, edge-desktop.png)
- Contame si encontrás algún problema visual: elementos rotos, texto cortado,
  imágenes que no cargan, o diferencias notables entre navegadores

Al final dame un resumen en formato tabla: Navegador | Resolución | Resultado (OK/FAIL) | Observaciones

No abras issues ni modifiques archivos CSS.

**Resultados:**

| Navegador | Resolución | Resultado | Observaciones |
|-----------|------------|-----------|----------------|
| Chromium | 1920×1080 | OK | Sin errores de consola. Layout completo. Referencia base. |
| Firefox | 1440×900 | OK | Spinner nativo visible en inputs numéricos (diferencia normal de Firefox). |
| WebKit (Safari) | 1280×800 | OK | Spinner nativo visible en inputs numéricos (diferencia normal de WebKit). El select "Ordenar por" ya no presenta el problema de contraste detectado en Momento 1. |
| Chromium + UA Edge | 1280×800 | OK | Idéntico a Chromium puro (mismo motor). UA confirmado como Edge/128. |

Sin errores de JS ni requests fallidos en ningún navegador (solo un 404 de favicon.ico, irrelevante
para el sitio).

**Comparación con Momento 1:** el hallazgo del issue #42 (bajo contraste en el select "Ordenar por"
en WebKit) ya no aparece — la corrección sobrevivió al merge a `develop`. El overlay gris junto a
"Carrito de compras" (`#carrito::before`) y los spinners de los inputs numéricos siguen presentes,
pero ya estaban documentados en Momento 1 como comportamiento intencional y diferencia normal de
renderizado, no como defectos.

**Capturas:** `capturas/tc-1/momento-2/` (chrome-desktop.png, firefox-desktop.png, safari-desktop.png, edge-desktop.png)

**Issues generados:** Ninguno.