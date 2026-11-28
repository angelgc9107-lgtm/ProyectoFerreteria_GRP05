# Test Case 12 — Lighthouse Post Fetch

**Componente:** Página principal de FerroLab (`/`).  
**Herramienta:** Google Chrome DevTools — Lighthouse.  
**Estado:** Ejecutado manualmente. Performance y Best Practices no alcanzan ≥95.

## Objetivo y alcance

Comparar la página posterior a la integración de Fetch de Alan (PR #217) con
el [TC-11 — Lighthouse Baseline](./test-case-11-lighthouse-baseline.md),
anterior a Fetch y SweetAlert2. Se analizan las cuatro categorías, métricas,
recomendaciones y posibles regresiones sin modificar la aplicación. La
auditoría es una única medición, no una prueba causal ni una validación de
SweetAlert2. El umbral del SPEC es ≥95 en cada categoría.

## Versión y condiciones de ejecución

| Dato | TC-12 |
|---|---|
| Fecha y hora | 27/11/2026, 00:56 GMT-3 |
| URL | `http://127.0.0.1:8000/` |
| Versión histórica de `develop` | Merge de #217, [`ca9458f29d283e010c3fd2cafb5d931e3e70b1bb`](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/commit/ca9458f29d283e010c3fd2cafb5d931e3e70b1bb), posterior a Fetch y anterior a SweetAlert2 |
| Checkout | Worktree independiente, HEAD detached en el commit indicado |
| Servidor | `http-server` 14.1.1, puerto 8000, iniciado con `node ...\http-server\bin\http-server -p 8000` desde el worktree |
| Ejecución | Manual mediante Chrome DevTools |
| Lighthouse / Chromium | 13.5.0 / 158.0.0.0 |
| Modo / dispositivo | Navigation / Emulated Desktop |
| Red y carga | Custom throttling; Initial page load; Single page session |
| Categorías | Performance, Accessibility, Best Practices y SEO |

Se sirvió el checkout por HTTP y el usuario ejecutó manualmente Lighthouse en
la URL indicada. Las capturas son de esa ejecución; no identifican por sí
solas el commit ni el directorio servido.

TC-11 registró las mismas versiones, modo, dispositivo, categorías, puerto y
servidor `http-server` 14.1.1. Su URL documentada es la misma, aunque la
captura no confirma el host exacto. Ambos informes indican Custom throttling,
pero no se registraron los valores concretos de latencia, throughput, CPU,
condiciones de red ni configuración/estado de caché del Baseline; tampoco se
pueden reconstruir todos los valores de TC-12 a partir de sus capturas.
**No se garantiza equivalencia exacta.** La variabilidad de una sola medición y
las diferencias de entorno limitan la atribución causal.

### Verificación posterior del servidor

Después de la ejecución, Copilot verificó que el proceso Node PID `35784`
escuchaba en el puerto 8000 y que su directorio efectivo era el worktree
`ProyectoFerreteria_GRP05-TC12-ca9458f`, con HEAD en el commit auditado. Las
respuestas HTTP de `index.html`, `js/api/apiService.js`, `api/productos.json`
y `js/script.js` fueron 200 y coincidieron con los archivos del checkout y sus
objetos Git del commit. El script importaba y ejecutaba `cargarCatalogo`; no
había referencias a SweetAlert2 en el código funcional y
`js/services/ServicioDialogos.js` devolvió 404. El objeto de `index.html`
servido difería de los del repositorio original y del Baseline TC-11.

Esta comprobación aporta trazabilidad **posterior**, no demuestra por sí sola
qué proceso respondía en el instante exacto de la auditoría. Una consulta HTTP
posterior observó `Cache-Control: max-age=3600`; no prueba el estado de caché
del navegador durante la medición.

## Resultados y comparación

| Categoría | TC-11 | TC-12 | Diferencia | TC-12 frente a ≥95 |
|---|---:|---:|---:|---|
| Performance | 92 | 86 | -6 | No cumple |
| Accessibility | 100 | 100 | 0 | Cumple |
| Best Practices | 77 | 77 | 0 | No cumple |
| SEO | 100 | 100 | 0 | Cumple |

| Métrica | TC-11 | TC-12 | Diferencia |
|---|---:|---:|---:|
| FCP | 0.5 s | 0.5 s | 0 s |
| LCP | 1.1 s | 1.2 s | +0.1 s |
| TBT | 0 ms | 0 ms | 0 ms |
| CLS | 0.148 | 0.230 | +0.082 |
| Speed Index | 0.5 s | 0.5 s | 0 s |

El CLS aumenta aproximadamente **55.4 %** sobre 0.148, calculado con los
valores mostrados. Performance baja 6 puntos y LCP sube 0.1 s; las demás
métricas y categorías permanecen iguales en los valores informados. Son
regresiones **observadas entre estas mediciones**, no una demostración de que
Fetch las causó. No se observa una mejora numérica en las categorías ni
métricas principales.

## Performance — Insights y Diagnostics

| Insight | TC-11 | TC-12 |
|---|---:|---:|
| Use efficient cache lifetimes | 849 KiB | 867 KiB |
| Improve image delivery | 862 KiB | 859 KiB |
| Render-blocking requests | 200 ms | 200 ms |
| Document request latency | 9 KiB | 9 KiB |
| Layout shift culprits | Listado | Listado; `section`, 0.230 |
| LCP request discovery | Listado | Listado; ver análisis siguiente |
| Network dependency tree | Listado | Listado |

| Diagnostic | TC-11 | TC-12 |
|---|---:|---:|
| Minify JavaScript | 96 KiB | 108 KiB |
| Minify CSS | 7 KiB | 7 KiB |
| Reduce unused JavaScript | 91 KiB | 92 KiB |
| Reduce unused CSS | Sin valor registrado | 16 KiB |

Las cifras son **ahorros estimados**, no mejoras implementadas, y no deben
sumarse. La reducción de 862 a 859 KiB es una variación del ahorro estimado,
no una demostración de optimización. No registrar un valor en TC-11 no prueba
que el problema de CSS sin usar sea nuevo. Los hallazgos de caché, imágenes,
recursos bloqueantes y JavaScript ya figuraban en TC-11.

### Layout shift culprits

La captura identifica un elemento `section` con score 0.230; la miniatura
resalta visualmente la zona de bienvenida, pero no muestra un selector o DOM
completo que permita identificar con certeza la sección ni el elemento que
originó el movimiento. CLS 0.148 y el insight ya existían en TC-11.

En el [HTML auditado](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/blob/ca9458f29d283e010c3fd2cafb5d931e3e70b1bb/index.html)
`#ofertas-productos` empieza vacío y precede a las secciones de servicios y
bienvenida. En el [script auditado](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/blob/ca9458f29d283e010c3fd2cafb5d931e3e70b1bb/js/script.js),
`cargarCatalogoEnPantalla` espera `cargarCatalogo` y luego `renderizarOfertas`
inserta tarjetas; el mensaje y los resultados del catálogo también cambian
durante la carga. Las tarjetas tienen altura mínima y sus imágenes altura
definida en CSS, pero eso no reserva necesariamente el espacio del contenedor
vacío antes de recibir las tarjetas. La sección de bienvenida tiene imágenes
con altura CSS definida.

**Hipótesis:** la inserción tardía de ofertas u otros cambios de contenido
podrían desplazar secciones posteriores. La captura identifica el elemento
desplazado, no necesariamente el elemento que causó el desplazamiento.
Investigar con un trace de Performance y comparar varias cargas controladas;
evaluar reserva de espacio para contenido dinámico y dimensiones estables sin
presentarlo como corrección comprobada.

### LCP request discovery

Lighthouse indica que la solicitud es detectable en el documento inicial y
que la imagen LCP no usa `loading="lazy"`; recomienda `fetchpriority="high"`.
La miniatura muestra la zona de imágenes de bienvenida; el HTML contiene
`assets/images/bienvenido1.png` y `assets/images/bienvenido2.png` en esa
sección. La miniatura sugiere la primera, pero no muestra la URL ni el nodo
expandido: **identificación exacta pendiente** con el informe o un trace.
Evaluar la prioridad alta en el recurso LCP confirmado y optimizar su entrega,
sin aplicarlo indiscriminadamente ni modificar código en esta auditoría.

## Accessibility, Best Practices y SEO

- **Accessibility:** 100, sin variación en la puntuación automatizada. No
  sustituye las comprobaciones manuales de accesibilidad.
- **Best Practices:** 77 en ambas mediciones; 29 cookies de terceros y un
  issue de tipo Cookie asociado a solicitudes de Google Maps. Es un problema
  preexistente, no una variación atribuible a Fetch. Evaluar alternativas y
  limitaciones externas sin asumir que las cookies puedan corregirse desde el
  sitio.
- **SEO:** 100, sin variación en la puntuación automatizada. La puntuación
  no garantiza la calidad completa del posicionamiento.

## Issues y próximos pasos

Las Issues [#212](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/issues/212),
[#213](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/issues/213)
y [#214](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/issues/214)
fueron actualizadas con los resultados de TC-12 según lo informado y
permanecen abiertas, pendientes de corrección y verificación. El coordinador
definió los siguientes responsables:

| Issue | Responsable | Estado |
|---|---|---|
| #212 | @alandox1 — Desarrollador JS Asíncrono | Abierta; corrección y verificación pendientes |
| #213 | @LuchoBarrionuevo13 — Tester QA/JS | Abierta; corrección y verificación pendientes |
| #214 | @Piastrellini — Desarrollador JS de Librerías Externas | Abierta; corrección y verificación pendientes |

Los hallazgos observados corresponden a problemas ya reportados; no hay
evidencia suficiente de un problema nuevo e independiente que justifique un
borrador de Issue adicional. Por decisión previa de coordinación, se
reevaluarán tras TC-13. RC03 permanece abierto.

En una revisión anterior de #212, la casilla de implementación figuraba
marcada sin evidencia de corrección: revisar si todavía corresponde
desmarcarla manualmente.

### Borradores previos de comentarios para las Issues

Se conservan como referencia histórica los borradores preparados antes de la
actualización de las Issues; no se presupone que coincidan con lo publicado.
Las propuestas de coordinación que contienen no sustituyen los responsables
definidos en la tabla anterior.

Las rutas de evidencia siguientes corresponden al repositorio; estarán
disponibles en GitHub cuando estos archivos se publiquen.

#### #212 — Performance

```markdown
## Seguimiento TC-12 — 27/11/2026

Commit auditado: ca9458f29d283e010c3fd2cafb5d931e3e70b1bb.
Performance pasó de 92 (TC-11) a 86 (TC-12), por debajo de ≥95.
LCP pasó de 1.1 a 1.2 s y CLS de 0.148 a 0.230. Los valores son
una comparación de mediciones únicas; no prueban que Fetch sea la causa.

Lighthouse señala caché (867 KiB), imágenes (859 KiB), recursos bloqueantes
(200 ms), minificación JS (108 KiB) y JS sin usar (92 KiB). Son ahorros
estimados. Revisar recursos, prioridad del LCP, caché y dependencias con
frontend y DevOps; mantener la Issue abierta y coordinar responsables.
Tras TC-13, implementar las mejoras acordadas y verificar con otra auditoría.
Revisar la casilla de implementación marcada: no hay evidencia de corrección.

Evidencia: docs/04-testing/test-case-12-lighthouse-post-fetch.md y
docs/04-testing/screenshots/tc-12/01-lighthouse-scores.png,
02-performance-metrics.png, 03-performance-insights.png,
04-performance-diagnostics.png y 14-lcp-request-discovery.png.
```

#### #213 — CLS

```markdown
## Seguimiento TC-12 — 27/11/2026

Commit auditado: ca9458f29d283e010c3fd2cafb5d931e3e70b1bb.
CLS pasó de 0.148 (TC-11) a 0.230 (TC-12): +0.082, aproximadamente
55.4 %. Lighthouse muestra una section con score 0.230, sin selector
completo ni causa confirmada. La inserción asíncrona de ofertas es una
hipótesis por investigar, no una atribución demostrada.

La Issue continúa abierta. Analizar un trace y cargas controladas, evaluar
reserva de espacio para contenido dinámico y coordinar frontend con JS
Asíncrono si corresponde. Tras TC-13, acordar objetivo, corregir y verificar.
La comparabilidad exacta de red y caché con TC-11 no está garantizada.

Evidencia: docs/04-testing/test-case-12-lighthouse-post-fetch.md y
docs/04-testing/screenshots/tc-12/02-performance-metrics.png y
13-layout-shift-culprits.png.
```

#### #214 — Best Practices y Google Maps

```markdown
## Seguimiento TC-12 — 27/11/2026

Commit auditado: ca9458f29d283e010c3fd2cafb5d931e3e70b1bb.
Best Practices permanece en 77 frente a 77 en TC-11, por debajo de ≥95.
Lighthouse muestra 29 cookies de terceros y un issue Cookie asociado a
Google Maps, ya observados en el Baseline; no se atribuyen a Fetch.

La Issue continúa abierta. Coordinar con frontend y DevOps la evaluación de
alternativas y limitaciones externas de Maps; después de TC-13 acordar qué
correcciones son viables y verificarlas o documentar la limitación.

Evidencia: docs/04-testing/test-case-12-lighthouse-post-fetch.md y
docs/04-testing/screenshots/tc-12/06-best-practices.png,
09-google-maps-devtools-issue.png y 10-google-maps-cookies-1.png a
12-google-maps-cookies-3.png.
```

## Evidencias

Las 14 capturas originales de una misma ejecución se copiaron sin modificar;
sus hashes SHA-256 coinciden con los adjuntos recibidos.

1. [Puntuaciones](./screenshots/tc-12/01-lighthouse-scores.png).
2. [Métricas de Performance](./screenshots/tc-12/02-performance-metrics.png).
3. [Insights](./screenshots/tc-12/03-performance-insights.png).
4. [Diagnostics](./screenshots/tc-12/04-performance-diagnostics.png).
5. [Accessibility](./screenshots/tc-12/05-accessibility.png).
6. [Best Practices](./screenshots/tc-12/06-best-practices.png).
7. [SEO](./screenshots/tc-12/07-seo.png).
8. [Condiciones de ejecución](./screenshots/tc-12/08-lighthouse-execution-conditions.png).
9. [Issue Cookie de Google Maps](./screenshots/tc-12/09-google-maps-devtools-issue.png).
10. [Cookies de Google Maps 1](./screenshots/tc-12/10-google-maps-cookies-1.png).
11. [Cookies de Google Maps 2](./screenshots/tc-12/11-google-maps-cookies-2.png).
12. [Cookies de Google Maps 3](./screenshots/tc-12/12-google-maps-cookies-3.png).
13. [Layout shift culprits](./screenshots/tc-12/13-layout-shift-culprits.png).
14. [LCP request discovery](./screenshots/tc-12/14-lcp-request-discovery.png).

## Conclusión

TC-12 queda ejecutado y documentado, pero no cumple el umbral en Performance
ni Best Practices. El descenso de Performance y el aumento de CLS/LCP
requieren investigación; las condiciones incompletas y una sola medición no
permiten concluir que Fetch sea su causa. Quedan pendientes TC-13 y la
corrección y verificación de las Issues.
