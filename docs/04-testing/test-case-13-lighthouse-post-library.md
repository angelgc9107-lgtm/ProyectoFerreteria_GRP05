# Test Case 13 — Lighthouse Post Library

**Componente:** Página principal de FerroLab (`/`).  
**Herramienta:** Chrome DevTools — Lighthouse.  
**Estado:** Ejecutado manualmente por el usuario; se conservan ambas mediciones.

## Objetivo y versión

Comparar la versión posterior a SweetAlert2 con [TC-12](./test-case-12-lighthouse-post-fetch.md)
y [TC-11](./test-case-11-lighthouse-baseline.md). Se utiliza como referencia
principal la segunda ejecución, realizada con la ventana maximizada, no por
haber obtenido una puntuación mayor. La primera no se descarta.

El commit histórico de `develop` auditado es el merge de #216,
[`5d6ba926db00137fb53eace818ef5fe8d362bf17`](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/commit/5d6ba926db00137fb53eace818ef5fe8d362bf17):
incluye Fetch/API y SweetAlert2, pero es anterior a la corrección de Maps de
#221. No confundir esta auditoría con la verificación preliminar independiente
de #221.

## Condiciones y trazabilidad

| Dato | Segunda ejecución |
|---|---|
| Fecha y hora | 27/11/2026, 03:19 GMT-3 |
| URL | `http://127.0.0.1:8000/` |
| Checkout | Worktree independiente, HEAD detached en `5d6ba926db00137fb53eace818ef5fe8d362bf17` |
| Servidor | `http-server` 14.1.1, puerto 8000, caché configurada en 3600 segundos |
| Ejecución | Manual por el usuario, Navigation, ventana maximizada |
| Lighthouse / Chromium | 13.3.0 / 150.0.7871.250 |
| Dispositivo y carga | Emulated Desktop, Custom throttling, Initial page load, Single page session |
| Categorías | Performance, Accessibility, Best Practices y SEO |

Antes de la auditoría se verificaron 31 archivos servidos contra el checkout y
los objetos Git del commit. Después, se comprobó que el PID 46188 escuchaba
en el puerto 8000, que el HEAD seguía en el SHA indicado y que `index.html`,
`js/script.js`, `js/api/apiService.js`, `api/productos.json` y
`js/services/ServicioDialogos.js` servidos coincidían con el checkout y el
commit. La respuesta informó `Cache-Control: max-age=3600`. La comprobación
posterior no demuestra por sí sola el estado de caché del navegador ni qué
proceso respondió en cada instante de la auditoría.

TC-11 y TC-12 registraron Lighthouse 13.5.0 y Chromium 158.0.0.0. No se
conservaron completamente los parámetros de red y caché anteriores; además, las
dos ejecuciones de TC-13 tuvieron diferentes condiciones de visualización.
No existe equivalencia experimental completa y no se puede atribuir una
diferencia exclusivamente a Fetch o SweetAlert2.

## Resultados y comparación

| Categoría | TC-11 | TC-12 | TC-13 primera | TC-13 segunda | Segunda frente a ≥95 |
|---|---:|---:|---:|---:|---|
| Performance | 92 | 86 | 75 | 96 | Cumple |
| Accessibility | 100 | 100 | 100 | 100 | Cumple |
| Best Practices | 77 | 77 | 100 | 100 | Cumple |
| SEO | 100 | 100 | 100 | 100 | Cumple |

| Métrica | TC-11 | TC-12 | TC-13 primera | TC-13 segunda |
|---|---:|---:|---:|---:|
| FCP | 0.5 s | 0.5 s | 0.5 s | 0.5 s |
| LCP | 1.1 s | 1.2 s | 1.4 s | 1.2 s |
| TBT | 0 ms | 0 ms | 0 ms | 0 ms |
| CLS | 0.148 | 0.230 | 0.555 | 0.075 |
| Speed Index | 0.5 s | 0.5 s | 0.5 s | 0.5 s |

En TC-12, después de Fetch, Performance bajó 6 puntos y CLS aumentó 0.082
respecto de TC-11; Best Practices, Accessibility y SEO no variaron. En la
segunda ejecución de TC-13, después de SweetAlert2, Performance aumentó 10
puntos y Best Practices 23 frente a TC-12, mientras Accessibility y SEO se
mantuvieron en 100. El CLS bajó 0.155 y el LCP se mantuvo en 1.2 s frente a
TC-12. Son diferencias observadas, no relaciones causales confirmadas.

En la primera ejecución se observó contenido más estrecho, con una sola
columna de productos, y el usuario informó que la ventana no estaba maximizada.
Esta diferencia de visualización podría influir, pero no se ha confirmado como
causa de los resultados. No se infieren fecha, versiones ni parámetros
adicionales para esa ejecución.

## Performance — Insights y Diagnostics

| Observación | Primera ejecución | Segunda ejecución |
|---|---:|---:|
| Use efficient cache lifetimes | 886 KiB | 878 KiB |
| Improve image delivery | 846 KiB | 862 KiB |
| Render-blocking requests | 150 ms | 150 ms |
| Document request latency | 9 KiB | 9 KiB |
| Minify JavaScript | 51 KiB | 51 KiB |
| Reduce unused JavaScript | 59 KiB | 59 KiB |
| Minify CSS | 7 KiB | 7 KiB |
| Reduce unused CSS | 19 KiB | Aprobado |
| Back/forward cache | 2 motivos | 2 motivos |

Ambas capturas enumeran `Layout shift culprits`, `LCP request discovery` y
`Network dependency tree`; la segunda incluye también `LCP breakdown`. En la
segunda se registraron 16 auditorías aprobadas de Performance, 1625 KiB de
recursos, 0.0 s de ejecución de JavaScript y 0.1 s de trabajo del hilo
principal; la auditoría de dimensiones explícitas de imágenes aprobó.
Los ahorros son estimaciones de Lighthouse, no mejoras implementadas ni
verificadas. Revisar caché, imágenes, recursos bloqueantes, JavaScript y CSS
con el responsable de #212.

## CLS y estabilidad visual — #213

Lighthouse identifica una `section` con contribución 0.075 en la segunda
ejecución. El CLS evoluciona de 0.148 en TC-11 a 0.230 en TC-12, 0.555 en la
primera ejecución de TC-13 y 0.075 en la segunda. Este último valor está
dentro de la referencia recomendada de 0.100 o menos, pero la diferencia entre
ejecuciones requiere investigar la estabilidad en distintas condiciones.

Investigar la distribución dinámica de productos, el espacio reservado, los
cambios responsive y las condiciones de visualización; son hipótesis, no
causas confirmadas. La captura identifica un elemento afectado, no demuestra
qué lo desplazó. No hay evidencia suficiente para responsabilizar a SweetAlert2.

## LCP y back/forward cache — #212

La captura identifica como elemento LCP la imagen del local. El recurso es
detectable en el HTML inicial y no usa `loading=lazy`; Lighthouse recomienda
evaluar `fetchpriority="high"`. El desglose mostrado es: time to first byte
0 ms, resource load delay 10 ms, resource load duration 10 ms y element render
delay 70 ms. No se asume que su suma represente el LCP global de 1.2 s.

Los dos motivos de back/forward cache son `Internal error` y `Back/forward
cache is not supported by delegate`, ambos clasificados como `Not actionable`.
Se registran como observaciones, sin atribuirlos automáticamente al código ni
abrir una Issue independiente.

## Best Practices y seguimiento de #214

La segunda ejecución muestra 100 puntos y 13 auditorías aprobadas:

1. Uses HTTPS.
2. Avoids deprecated APIs.
3. Avoids third-party cookies.
4. Allows users to paste into input fields.
5. Avoids requesting the geolocation permission on page load.
6. Avoids requesting the notification permission on page load.
7. Displays images with correct aspect ratio.
8. Serves images with appropriate resolution.
9. Page has the HTML doctype.
10. Properly defines charset.
11. No browser errors logged to the console.
12. No issues in the Issues panel in Chrome DevTools.
13. Page has valid source maps.

El commit auditado no contiene la corrección de Maps de #221. El resultado
`Avoids third-party cookies` y el puntaje de 100 no prueban por sí solos que
el problema estuviera corregido en ese commit, ni atribuyen la mejora a
SweetAlert2 o #221. #214, responsable @Piastrellini, está cerrada en GitHub
tras la integración de #221 y su verificación preliminar independiente; esta
auditoría histórica no sustituye esa verificación.

## Evidencias originales

Las 18 imágenes fueron copiadas sin alterar y verificadas contra los adjuntos.
Según la aclaración del usuario, son **12 de la segunda ejecución y 6 de la
primera**. La captura adicional de la segunda muestra 96 y CLS 0.075.

### Segunda ejecución

1. [Vista general adicional](./screenshots/tc-13/00-vista-general-adicional.png).
2. [Puntuaciones y métricas](./screenshots/tc-13/01-lighthouse-scores-and-metrics.png).
3. [Performance Insights](./screenshots/tc-13/02-performance-insights.png).
4. [Diagnostics y Accessibility](./screenshots/tc-13/03-performance-diagnostics-accessibility.png).
5. [Best Practices](./screenshots/tc-13/04-best-practices.png).
6. [SEO y condiciones](./screenshots/tc-13/05-seo-execution-conditions.png).
7. [Layout shift culprits](./screenshots/tc-13/06-layout-shift-culprits.png).
8. [LCP breakdown](./screenshots/tc-13/07-lcp-breakdown.png).
9. [Back/forward cache](./screenshots/tc-13/08-back-forward-cache.png).
10. [Performance: auditorías aprobadas](./screenshots/tc-13/09-performance-passed-audits.png).
11. [LCP request discovery](./screenshots/tc-13/10-lcp-request-discovery.png).
12. [Best Practices: auditorías aprobadas](./screenshots/tc-13/11-best-practices-passed-audits.png).

### Primera ejecución

1. [Puntuaciones](./screenshots/tc-13/primera-ejecucion/01-lighthouse-scores.png).
2. [Métricas](./screenshots/tc-13/primera-ejecucion/02-performance-metrics.png).
3. [Performance Insights](./screenshots/tc-13/primera-ejecucion/03-performance-insights.png).
4. [Performance Diagnostics](./screenshots/tc-13/primera-ejecucion/04-performance-diagnostics.png).
5. [Accessibility](./screenshots/tc-13/primera-ejecucion/05-accessibility.png).
6. [Best Practices](./screenshots/tc-13/primera-ejecucion/06-best-practices.png).

## Seguimiento y borradores de comentarios

En la consulta de GitHub, #212 y #213 figuran abiertas y #214 cerrada. Los
responsables informados por el coordinador son @alandox1 para #212,
@LuchoBarrionuevo13 para #213 y @Piastrellini para #214; GitHub no muestra
asignados formales en #212 ni #213. Los siguientes comentarios son borradores:
no se publicaron ni se modificaron las Issues.

### Borrador para #212 — Performance

> **TC-13 Post Library — 27/11/2026.** En el commit histórico
> `5d6ba926db00137fb53eace818ef5fe8d362bf17`, la primera ejecución obtuvo
> Performance 75 y la segunda, con ventana maximizada, 96; TC-11 y TC-12
> obtuvieron 92 y 86. Se toma la segunda como referencia por sus condiciones
> de visualización, sin descartar la primera. Persisten oportunidades estimadas:
> caché 878 KiB, imágenes 862 KiB, recursos bloqueantes 150 ms, JavaScript
> minificable 51 KiB y no utilizado 59 KiB; revisar también la prioridad de la
> imagen LCP. Lighthouse y Chromium difieren de TC-11/TC-12 y no se conservaron
> todas las condiciones anteriores, por lo que no se atribuyen las variaciones
> a una funcionalidad. Solicitar a @alandox1 revisar las recomendaciones y
> verificar las correcciones en `develop` actualizado. No cerrar basándose en
> este resultado histórico.

### Borrador para #213 — CLS

> **TC-13 Post Library — 27/11/2026.** En el commit histórico
> `5d6ba926db00137fb53eace818ef5fe8d362bf17`, CLS fue 0.555 en la primera
> ejecución y 0.075 en la segunda, con ventana maximizada; TC-11 y TC-12
> registraron 0.148 y 0.230. Lighthouse identifica una `section` con
> contribución 0.075 en la segunda. Investigar distribución dinámica,
> reserva de espacio y comportamiento responsive en diferentes condiciones;
> no se ha confirmado la causa ni la influencia de la ventana. Las versiones
> y condiciones no son totalmente equivalentes. Verificar sobre `develop`
> actualizado y no cerrar basándose únicamente en esta medición histórica.

## Pendientes

- Compartir los borradores con los responsables cuando se autorice.
- Investigar las variaciones y verificar #212 y #213 sobre `develop` actualizado
  después de las correcciones acordadas.
- Mantener RC03 abierto hasta que el equipo indique su resolución.
