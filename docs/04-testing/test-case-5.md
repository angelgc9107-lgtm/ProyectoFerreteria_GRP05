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