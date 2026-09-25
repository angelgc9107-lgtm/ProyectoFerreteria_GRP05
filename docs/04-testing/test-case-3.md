## Momento 1 — Testing pre-merge (ramas `feature/`)

**Prompt utilizado en Claude Code + Playwright MCP:**
```
Usá Playwright MCP para abrir http://127.0.0.1:3000/index.html y evaluar la Performance API
  del navegador. Dame estas métricas en milisegundos: DOMContentLoaded, Load completo, y
  DOM Interactive. También dame un listado de los recursos cargados (imágenes, CSS, fuentes)
  con su tamaño en KB y tiempo de descarga en ms, ordenados de mayor a menor tamaño.

  Sacá una captura de pantalla de la vista completa y guardala en
  docs/04-testing/capturas/tc-3/momento-1/performance-screenshot.png

  Al final decime si hay algún recurso que se destaque por ser pesado o lento, y si los tiempos
  de carga te parecen razonables para un sitio de este tipo.
  ``` 

**Resultados:**

| Métrica | Valor |
|---------|-------|
| DOM Interactive | 49 ms |
| DOMContentLoaded | 50 ms |
| Load completo | 158 ms |

**Recursos cargados (ordenados por tamaño, top 5):**

| Recurso | Tipo | Tamaño (KB) | Descarga (ms) |
|---------|------|-------------|----------------|
| assets/images/Bienvenido1.png | img | 394.9 | 99 |
| assets/images/Bienvenido2.png | img | 356.7 | 115 |
| assets/images/ubicacion.png | img | 49.7 | 129 |
| css/components.css | css | 14.9 | 26 |
| css/responsive.css | css | 5.9 | 30 |

**Capturas:** `capturas/tc-3/momento-1/performance-screenshot.png`

**Análisis:**
- Tiempos de carga excelentes en localhost (DOMContentLoaded 50ms, Load 158ms), pero no
  representativos de producción sin latencia de red real.
- Hallazgo de performance (no bloqueante): `Bienvenido1.png` (395 KB) y `Bienvenido2.png`
  (357 KB) representan juntas más de la mitad del peso total de imágenes del sitio (~752 KB
  de ~950 KB), pese a ser contenido decorativo/institucional, no productos. Se recomienda
  comprimir/convertir a WebP antes de desplegar a producción, ya que en redes móviles
  (3G/4G) su peso combinado sí tendría impacto notable en la carga percibida.
- No se encontraron fuentes web (usa fuentes del sistema).

**Issues generados:** Ninguno (hallazgo de optimización, no un defecto funcional o visual).
Se documenta como recomendación para antes del despliegue a producción.

---
 
## Momento 2 — Testing post-merge (rama `develop`)
 
Ejecutado contra `develop`, tras el merge de las ramas de Frontend y Responsive.
 
**Prompt utilizado en Claude Code + Playwright MCP:**
 
```
Usá Playwright MCP para abrir http://127.0.0.1:3000/index.html y evaluar la Performance API
del navegador. Dame estas métricas en milisegundos: DOMContentLoaded, Load completo, y
DOM Interactive. También dame un listado de los recursos cargados (imágenes, CSS, fuentes)
con su tamaño en KB y tiempo de descarga en ms, ordenados de mayor a menor tamaño.
 
Sacá una captura de pantalla de la vista completa y guardala en
docs/04-testing/capturas/tc-3/momento-2/performance-screenshot.png
 
En Momento 1 el hallazgo principal fue que Bienvenido1.png (395 KB) y Bienvenido2.png (357 KB)
representaban juntas más de la mitad del peso total de imágenes (~752 KB de ~950 KB). Confirmá
si siguen igual o si se optimizaron, y si apareció algún recurso nuevo tras el merge.
 
Al final decime si hay algún recurso que se destaque por ser pesado o lento, y si los tiempos
de carga te parecen razonables.
 
No abras issues ni modifiques archivos.
```
 
**Condiciones de medición:** viewport 1366×768, caché desactivada (todos los recursos
descargados de cero), servidor estático local.
 
**Resultados:**
 
| Métrica | Valor |
|---------|-------|
| DOM Interactive | 29,6 ms |
| DOMContentLoaded | 29,6 ms |
| Load completo | 155,6 ms |
 
**Recursos cargados (top 6 por tamaño):**
 
| Recurso | Tipo | Tamaño (KB) | Descarga (ms) | Tiempo total (ms) |
|---------|------|-------------|----------------|--------------------|
| assets/images/Bienvenido1.png | img | 394,6 | 4,2 | 26,0 |
| assets/images/Bienvenido2.png | img | 356,4 | 4,0 | 25,4 |
| assets/images/ubicacion.png | img | 49,4 | 0,4 | 34,0 |
| assets/images/guantes-moteados.png | img | 36,2 | 0,7 | 31,4 |
| assets/images/enchufe-adaptador.png | img | 23,8 | 0,6 | 32,4 |
| css/components.css | css | 14,6 | 0,4 | 8,4 |
 
**Totales:** imágenes 953,1 KB · CSS 25,7 KB · HTML 16,6 KB · ~995 KB en total.
Sin fuentes web (usa fuentes del sistema).
 
**Comparación con Momento 1:** las imágenes `Bienvenido1.png` y `Bienvenido2.png` no se
optimizaron — pesan exactamente lo mismo (751 KB combinadas, el 79% del peso total de imágenes).
No apareció ningún recurso nuevo tras el merge: siguen siendo las mismas 13 imágenes únicas.
La única novedad es `responsive.css` (7,7 KB), que no impacta en la carga.
 
Los tiempos de Momento 2 son menores que los de Momento 1 (29,6 ms vs 50 ms de DOMContentLoaded),
pero **no representan una mejora del sitio**: se midió con caché desactivada y un servidor estático
distinto al de Momento 1, así que las condiciones no son equivalentes. Lo comparable es el peso de
los recursos, que se mantuvo igual.
 
**Hallazgo nuevo de Momento 2 (issue #46):** el HTML referenciaba las imágenes con mayúscula
inicial (`Bienvenido1.png`, `Bienvenido2.png` en index.html:90-91) mientras que los archivos
versionados en el repositorio estaban en minúscula (`bienvenido1.png`, `bienvenido2.png`). En
Windows el sitio funciona porque el sistema de archivos no distingue mayúsculas, pero GitHub Pages
corre sobre Linux, que sí las distingue: al publicar, ambas imágenes habrían devuelto 404. Es un
defecto que no se manifiesta en desarrollo local, solo en producción.
 
**Análisis:**
- Los tiempos en localhost no son representativos de un usuario real. Con los mismos ~1 MB en una
  red 4G lenta (~1,6 Mbps), la carga rondaría los 5 segundos, de los cuales ~3,8 s corresponderían
  únicamente a las dos imágenes `Bienvenido`.
- Las imágenes `Bienvenido` miden 414×416 px y se muestran en un recuadro de 544×208 px, por lo que
  se recortan y amplían. Un PNG de ~400 KB para ese uso es excesivo: convertidas a WebP o JPG
  quedarían en 30-60 KB cada una. La recomendación de optimizarlas sigue vigente desde Momento 1.
**Observaciones no bloqueantes (sin issue):** falta `favicon.ico` (genera un 404 en consola, sin
impacto en la carga) y hay imágenes sin usar en `assets/images/`.
 
**Capturas:** `capturas/tc-3/momento-2/performance-screenshot.png`
 
**Issues generados:** [#46](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/issues/46) — diferencia de mayúsculas en nombres de imágenes causará 404 en GitHub Pages (cerrado)
 
**Seguimiento del hallazgo (issue #46):** El Desarrollador Frontend / CSS unificó los nombres a
minúscula. Verificado en `develop` comparando `git ls-files assets/images/` contra los `src` del
HTML con `LC_ALL=C` (comparación sensible a mayúsculas, hecha contra el índice de git y no contra
el sistema de archivos local, ya que el clon tiene `core.ignorecase = true` y una comparación contra
disco daría un falso positivo en Windows). Las 16 referencias coinciden exactamente y no quedan
versiones con mayúscula inicial en el árbol del commit. La release desde la que se publica el sitio
se genera a partir de `develop`, por lo que el arreglo está en la rama que corresponde.
Issue #46 cerrado.
 
**Observación adicional:** hay 3 archivos en `assets/images/` que no están referenciados por ninguna
etiqueta `<img>` del HTML (capturas de evidencia del rol Frontend). Sin impacto funcional.
 