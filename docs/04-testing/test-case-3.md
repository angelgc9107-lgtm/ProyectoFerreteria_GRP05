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
 
**Hallazgo nuevo de Momento 2 (issue #46):** el HTML referencia las imágenes con mayúscula inicial
(`Bienvenido1.png`, `Bienvenido2.png` en index.html:90-91) mientras que los archivos versionados
en el repositorio están en minúscula (`bienvenido1.png`, `bienvenido2.png`). En Windows el sitio
funciona porque el sistema de archivos no distingue mayúsculas, pero GitHub Pages corre sobre Linux,
que sí las distingue: al publicar, ambas imágenes van a devolver 404. Es un defecto que no se
manifiesta en desarrollo local, solo en producción.
 
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
 
**Issues generados:** [#46](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/issues/46) — diferencia de mayúsculas en nombres de imágenes causará 404 en GitHub Pages