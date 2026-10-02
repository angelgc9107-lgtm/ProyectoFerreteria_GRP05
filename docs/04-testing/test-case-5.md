## Momento 1 — Testing pre-merge (ramas `feature/`)

**Prompt utilizado en Claude Code + Playwright MCP:**
```
Usá Playwright MCP para abrir http://127.0.0.1:3000/index.html y sacar un snapshot de
accesibilidad. Decime si la jerarquía de headings es correcta (h1 único, sin saltos de
nivel), si existen los landmarks section/article/nav/main/footer, y si los inputs de
formulario tienen su label asociado correctamente.

Después usá curl para validar el HTML actual contra
https://validator.w3.org/nu/?out=json y reportame los errores y warnings encontrados.

Sacá una captura de pantalla de la vista completa y guardala en
docs/04-testing/capturas/tc-5/momento-1/estructura-screenshot.png

[Segunda parte del prompt:]
Ahora validá cada archivo CSS por separado contra el CSS Validator del W3C
(https://jigsaw.w3.org/css-validator/validator?output=json), usando curl:
1. css/styles.css
2. css/components.css
3. css/responsive.css
Para cada uno, decime cuántos errores y warnings encontró el validador, y si hay
alguno, el detalle (línea y mensaje).
```

**Estructura semántica (snapshot de accesibilidad):**

| Elemento | Presente | Observaciones |
|----------|----------|-----------------|
| Jerarquía de headings (h1→h6) | ✅ Sí | Un único `<h1>` ("Ofertas"), sin saltos de nivel en toda la página. Nota: el h1 corresponde al título de una sección, no del sitio — es una decisión de diseño válida, pero conviene confirmarla como intencional con el equipo. |
| Landmarks (section, article, nav, main, footer) | ✅ Sí | header (1), nav (1), main (1), footer (1), section (9), article (14), aside (2) |
| Etiquetas de formulario asociadas | ✅ Sí | 10/10 inputs/select/textarea con `<label for="...">` explícito |

**Validación HTML (W3C):**

| Errores | Warnings |
|---------|----------|
| 0 | 1 (ajeno al proyecto — script inyectado por la extensión Live Preview de VS Code) |

**Validación CSS (W3C), por archivo:**

| Archivo | Errores | Warnings | Observaciones |
|---------|---------|----------|-----------------|
| styles.css | 0 | 3 | Informativos (uso de `var()`, prefijo de vendor esperado) |
| components.css | 2 | 135 | Los 2 "errores" son falsos positivos conocidos del validador con `calc(var())` anidado — funciona bien en navegadores reales. 133/135 warnings son informativos de `var()`. Hallazgo menor real: línea 36, `clip: rect(0 0 0 0)` usa sintaxis legacy sin comas (debería ser `rect(0, 0, 0, 0)`) — sigue funcionando en navegadores actuales, pero vale la pena corregirlo. |
| responsive.css | 0 | 10 | Informativos (uso de `var()`) |

**Capturas:** `capturas/tc-5/momento-1/estructura-screenshot.png`

**Issues generados:** Ninguno — no se encontraron problemas que requieran reportarse como bug.
Se deja como observación menor la sintaxis legacy de `clip: rect()` en `components.css:36`
para corrección opcional (no bloqueante).

---
 
## Momento 2 — Testing post-merge (rama `develop`)
 
Ejecutado contra `develop`, tras el merge de las ramas de Frontend y Responsive.
 
**Prompt utilizado en Claude Code + Playwright MCP:**
 
```
Usá Playwright MCP para abrir http://127.0.0.1:3000/index.html y sacar un snapshot de
accesibilidad. Decime si la jerarquía de headings es correcta (h1 único, sin saltos de
nivel), si existen los landmarks section/article/nav/main/footer, y si los inputs de
formulario tienen su label asociado correctamente.
 
Después validá el HTML contra https://validator.w3.org/nu/?out=json usando curl, y cada
archivo CSS por separado contra https://jigsaw.w3.org/css-validator/validator?output=json:
1. css/styles.css
2. css/components.css
3. css/responsive.css
 
Para cada uno, decime cuántos errores y warnings encontró el validador, y el detalle
(línea y mensaje) si hay alguno.
 
Contexto de Momento 1: el HTML validó con 0 errores y 1 warning ajeno al proyecto.
En CSS, styles.css dio 0 errores, components.css dio 2 errores (falsos positivos de
calc() con var() anidado) y 1 warning real (clip: rect() sin comas en línea 36), y
responsive.css dio 0 errores. Confirmá si sigue igual o si algo cambió tras el merge.
 
Sacá una captura de pantalla de la vista completa y guardala en
docs/04-testing/capturas/tc-5/momento-2/estructura-screenshot.png
 
No abras issues ni modifiques archivos.
```
 
**Estructura semántica (snapshot de accesibilidad):**
 
| Elemento | Presente | Observaciones |
|----------|----------|-----------------|
| Jerarquía de headings | Sí | Un único `<h1>` ("Ofertas"), 27 headings en total, sin saltos de nivel (siempre h1→h2→h3). |
| Landmarks | Sí | `header#inicio` (banner), `nav` "Navegación principal", `main`, `footer#ubicacion` (contentinfo, fuera de main), 9 `section` con nombre por `aria-labelledby`/`aria-label`, 14 `article` (3 ofertas, 9 catálogo, 2 carrito), 2 `aside`. |
| Etiquetas de formulario | Sí | 10/10 controles con `<label for>` apuntando a su id, todos con nombre accesible en el snapshot. Ninguna etiqueta apunta a un id inexistente. |
| Otros | — | `role="search"` en el buscador, `lang="es"` declarado, sin IDs duplicados. |
 
**Validación HTML (W3C):**
 
| Errores | Warnings |
|---------|----------|
| 0 | 0 |
 
El warning de Momento 1 (script inyectado por la extensión Live Preview de VS Code) ya no aparece,
porque esta medición se hizo con un servidor estático que no inyecta scripts.
 
**Validación CSS (W3C Jigsaw), por archivo:**
 
| Archivo | Errores | Warnings con contenido real | Observaciones |
|---------|---------|------------------------------|-----------------|
| styles.css | 0 | 1 | `-webkit-tap-highlight-color` en línea 84: extensión de proveedor, esperable. |
| components.css | 2 | 3 | Los 2 errores (líneas 442 y 575) son los mismos falsos positivos de Momento 1: jigsaw no evalúa `var()` dentro de `calc()`, pero los navegadores lo aplican correctamente. Warnings reales: `clip: rect(0 0 0 0)` sin comas en línea 36 (sigue sin corregirse) y `-webkit-appearance` en línea 291 (extensión de proveedor). |
| responsive.css | 0 | 0 | Sin hallazgos. |
 
La cantidad total de warnings varía según el nivel de detalle que se le pida al validador; la
mayoría son avisos genéricos sobre `var()`, propiedades redefinidas o colores declarados sin fondo.
La tabla informa solo los que tienen contenido real.
 
**Comparación con Momento 1:**
 
| Elemento | Momento 1 | Momento 2 | ¿Cambió? |
|----------|-----------|-----------|-----------|
| HTML | 0 errores, 1 warning | 0 errores, 0 warnings | Mejoró |
| styles.css | 0 errores | 0 errores | Igual |
| components.css | 2 errores (falsos positivos) + warning de `clip` en L36 | Los mismos 2 falsos positivos y el mismo warning de `clip` | Igual |
| responsive.css | 0 errores | 0 errores | Igual |
 
**Observaciones de semántica (no afectan la validez, sin issue):**
- El único `<h1>` es "Ofertas" y no el nombre del sitio, por lo que en el árbol de headings las
  demás secciones quedan como hijas de "Ofertas". Los productos de Ofertas usan `h2` (mismo nivel
  que los títulos de sección) mientras que los del catálogo usan `h3`.
- Los dos campos "Cantidad" del carrito se anuncian con el mismo nombre accesible, por lo que un
  lector de pantalla no distingue a qué producto corresponde cada uno.
- El link del carrito muestra "Carrito (0)" en pantalla pero su `aria-label` es "Ver carrito de
  compras": el texto visible no forma parte del nombre accesible (WCAG 2.5.3).
  
**Capturas:** `capturas/tc-5/momento-2/estructura-screenshot.png`
 
**Issues generados:** Ninguno. La estructura semántica y la validación W3C no presentan defectos
tras el merge.