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

Desde TC-12, la [PR #216](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/pull/216)
incorporó SweetAlert2 mediante `ServicioDialogos` en tres puntos, conforme al
[SPEC del Desarrollador JS de Librerías Externas](../03-specs/segundo-parcial/spec-dev-libreria-externa.md):

- **Eliminar un producto:** se solicita confirmación con su nombre y cantidad;
  al cancelar, el carrito no cambia.
- **Confirmar el pedido:** se muestran total financiado, método y cuotas;
  al cancelar se conserva el resumen sin consumir un número de pedido.
  Sin resumen pendiente se muestra el error existente, sin diálogo.
- **Cancelar el pedido:** si hay datos del cliente o un pedido pendiente, se
  confirma su descarte; se conservan carrito y condiciones de pago. Si no hay
  datos ni resumen, se cancela directamente. Rechazar el diálogo conserva los
  datos y el resumen.

La corrección de Google Maps se incorporó posteriormente en la
[PR #221](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/pull/221),
no en el commit auditado. Las variaciones de Lighthouse no se atribuyen
automáticamente a SweetAlert2 ni a esa corrección.

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

Las diferencias son restas del valor posterior menos el anterior; TC-13 en
las tres columnas de diferencias corresponde a la **segunda ejecución**.
Las diferencias de categorías se expresan en puntos.

| Categoría | TC-11 | TC-12 | TC-13 primera | TC-13 segunda | TC-12 − TC-11 | TC-13 − TC-12 | TC-13 − TC-11 | Segunda frente a ≥95 |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| Performance | 92 | 86 | 75 | 96 | -6 | +10 | +4 | Cumple |
| Accessibility | 100 | 100 | 100 | 100 | 0 | 0 | 0 | Cumple |
| Best Practices | 77 | 77 | 100 | 100 | 0 | +23 | +23 | Cumple |
| SEO | 100 | 100 | 100 | 100 | 0 | 0 | 0 | Cumple |

| Métrica | TC-11 | TC-12 | TC-13 primera | TC-13 segunda | TC-12 − TC-11 | TC-13 − TC-12 | TC-13 − TC-11 |
|---|---:|---:|---:|---:|---:|---:|---:|
| FCP | 0.5 s | 0.5 s | 0.5 s | 0.5 s | 0 s | 0 s | 0 s |
| LCP | 1.1 s | 1.2 s | 1.4 s | 1.2 s | +0.1 s | 0 s | +0.1 s |
| TBT | 0 ms | 0 ms | 0 ms | 0 ms | 0 ms | 0 ms | 0 ms |
| CLS | 0.148 | 0.230 | 0.555 | 0.075 | +0.082 | -0.155 | -0.073 |
| Speed Index | 0.5 s | 0.5 s | 0.5 s | 0.5 s | 0 s | 0 s | 0 s |

La primera ejecución obtuvo **75 puntos en Performance**, por debajo del
umbral mínimo de **95** establecido en el SPEC; no cumple ese criterio.

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
`Avoids third-party cookies` y la comprobación aprobada del panel Issues no
demuestran el número exacto de cookies ni el comportamiento después de
activar el mapa. El puntaje de 100 tampoco prueba que el problema estuviera
corregido en ese commit ni se atribuye a SweetAlert2 o #221. Esta auditoría
histórica **no valida la corrección #221**.

### Verificación preliminar independiente de #221

En un worktree de la rama de corrección, sobre el
[commit `c1e02d8`](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/commit/c1e02d88cc7cc37a3fba105b355237d588cd7711),
se informó una medición independiente de Performance **97**, Accessibility
**100**, Best Practices **100**, SEO **100** y CLS **0.075**. Según el
[registro publicado de QA en #221](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/pull/221#issuecomment-7210389785),
se comprobó el botón **Ver mapa**, la visualización del mapa después de
pulsarlo y que no se observaron solicitudes coincidentes con el filtro `maps`
durante la carga inicial. No se inspeccionaron específicamente las cookies
después de activar el mapa. El registro es anterior al merge, no una
verificación definitiva sobre `develop`.

No se localizaron capturas que acrediten específicamente la medición 97 ni
la comprobación manual; se conserva el comentario publicado como evidencia
de lo informado. Las capturas versionadas de la PR
([puntuaciones](./screenshots/issue-214/01-lighthouse-puntajes.png) y
[Best Practices](./screenshots/issue-214/02-best-practices.png)) muestran
otra medición con Performance **91** y Best Practices **100**; no son
evidencia de la medición 97 ni de las cookies tras la interacción.

La [PR #221](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/pull/221)
de @Piastrellini — Desarrollador JS de Librerías Externas — fue
[aprobada](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/pull/221#pullrequestreview-6083871842) y se integró en
`develop` mediante el [merge `bbff1fe`](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/commit/bbff1fe926b842a57c40458a3296824de5d45bc0).
La [Issue #214](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/issues/214)
está cerrada; su cierre se coordinó tras la integración. Solicitar al
coordinador confirmar el cierre teniendo en cuenta la inspección pendiente
de cookies después de activar el mapa y la verificación definitiva sobre
`develop`; no se reabre ni se afirma que esas comprobaciones hayan ocurrido.
La [evaluación previa del coordinador](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/issues/214#issuecomment-7210641964)
era anterior al merge y al cierre.

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

## Seguimiento de Issues

Los resultados de TC-13 ya se incorporaron a las Issues y se anunciaron en
los comentarios publicados de [#212](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/issues/212#issuecomment-7211819949)
y [#213](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/issues/213#issuecomment-7211904775).
Ambas siguen **abiertas** hasta verificar sus respectivas correcciones.
El historial previo de TC-11 y TC-12 se conserva en las Issues y en sus
respectivos test cases.

| Issue | Responsable comunicado por el coordinador | Assignees en GitHub |
|---|---|---|
| #212 | [@alandox1 — Desarrollador JS Asíncrono](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/issues/212#issuecomment-7209702999) | @alandox1 |
| #213 | [@LuchoBarrionuevo13 — Tester QA/JS, Testing Avanzado](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/issues/213#issuecomment-7209708881) | @angelgc9107-lgtm |

La consulta actual muestra una discrepancia en #213 entre el responsable
comunicado y el Assignee formal; coordinar su confirmación sin modificar la
Issue. Referencias directas para ambas Issues:
[commit auditado](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/commit/5d6ba926db00137fb53eace818ef5fe8d362bf17),
[puntuaciones y métricas de la segunda ejecución](./screenshots/tc-13/01-lighthouse-scores-and-metrics.png),
[Insights de Performance](./screenshots/tc-13/02-performance-insights.png),
[CLS](./screenshots/tc-13/06-layout-shift-culprits.png) y
[puntuaciones de la primera ejecución](./screenshots/tc-13/primera-ejecucion/01-lighthouse-scores.png).
Todas las capturas se enlazan también en la sección anterior.

El SHA anteriormente registrado en ambas Issues era
`5d6ba9206db00137fb53eace818ef5fe8d362bf17`. La corrección manual ya fue
realizada: ambos cuerpos muestran y enlazan el commit correcto
`5d6ba926db00137fb53eace818ef5fe8d362bf17`. Los cuerpos enumeran las
capturas como rutas y nombres de archivo, no como enlaces directos; las
capturas se enlazan directamente en este documento. No se modificaron las
Issues durante esta revisión.

## Pendientes

- Coordinar la discrepancia del Assignee de #213; si se requieren enlaces
  directos a las capturas en las Issues, acordar su actualización manual.
- Investigar las variaciones y verificar #212 y #213 sobre `develop` actualizado
  después de las correcciones acordadas.
- Solicitar al coordinador confirmar el cierre de #214 con la limitación
  pendiente de cookies y de verificación definitiva sobre `develop`.
- Mantener RC03 abierto hasta que el equipo indique su resolución.
