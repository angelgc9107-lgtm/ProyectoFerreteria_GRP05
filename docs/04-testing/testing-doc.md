# Testing Doc — Actividad Obligatoria N°2, Primer Parcial y Segundo Parcial

Índice central de test cases y resumen de issues. Los test cases 1 a 10 se ejecutaron con **Playwright MCP** (vía Claude Code — ver nota en spec-qa.md sobre el cambio de herramienta) y corresponden a la Actividad Obligatoria N°2 y al Primer Parcial. TC-11, TC-12 y TC-13 corresponden al Segundo Parcial y se ejecutaron manualmente con Lighthouse.

## Índice de Test Cases

| # | Test Case | Descripción | Herramienta |
|---|-----------|-------------|-------------|
| 1 | [test-case-1.md](test-case-1.md) | Compatibilidad en navegadores desktop (Chrome, Firefox, Safari, Edge) | Playwright MCP |
| 2 | [test-case-2.md](test-case-2.md) | Responsive en dispositivos móviles (iPhone 14 Pro, Galaxy S23, iPad Air) | Playwright MCP (viewport emulation) |
| 3 | [test-case-3.md](test-case-3.md) | Performance y carga (Performance API) | Playwright MCP |
| 4 | [test-case-4.md](test-case-4.md) | Accesibilidad web (WCAG 2.1) | Playwright MCP + axe-core |
| 5 | [test-case-5.md](test-case-5.md) | Estructura HTML semántica y validación W3C (HTML/CSS) | Playwright MCP + validadores W3C |
| 6 | [test-case-6.md](test-case-6.md) | Testing responsive de la migración del sitio a Bootstrap 5.3.8 | Playwright MCP |
| 7 | [test-case-7.md](test-case-7.md) | Funcionamiento y comportamiento responsive del componente Dropdown de Categorías | Playwright MCP |
| 8 | [test-case-8.md](test-case-8.md) | Funcionamiento y comportamiento responsive del componente Offcanvas del carrito | Playwright MCP |
| 9 | [test-case-9.md](test-case-9.md) | Iframe de Google Maps (carga, responsive, ausencia de overflow) | Playwright MCP |
| 10 | [test-case-10.md](test-case-10.md) | Input range de filtro de precio (interacción, sincronización con output) | Playwright MCP |
| 11 | [test-case-11-lighthouse-baseline.md](test-case-11-lighthouse-baseline.md) | Baseline Lighthouse Desktop / Navigation sobre `develop` | Chrome DevTools Lighthouse 13.5.0 |
| 12 | [test-case-12-lighthouse-post-fetch.md](test-case-12-lighthouse-post-fetch.md) | Lighthouse Post Fetch, comparación con TC-11 | Chrome DevTools Lighthouse 13.5.0 |
| 13 | [test-case-13-lighthouse-post-library.md](test-case-13-lighthouse-post-library.md) | Lighthouse Post Library, comparación con TC-12 | Chrome DevTools Lighthouse 13.3.0 |

## Segundo Parcial — TC-11 Lighthouse Baseline

TC-11 se ejecutó manualmente el 26/11/2026 a las 13:37 GMT-3. Resultados:
Performance 92, Accessibility 100, Best Practices 77 y SEO 100. Performance y
Best Practices no alcanzaron el umbral ≥95. Las cinco métricas, hallazgos,
recomendaciones, limitaciones de reproducibilidad/comparabilidad y 12 capturas
están documentados en [test-case-11-lighthouse-baseline.md](test-case-11-lighthouse-baseline.md).
El commit de referencia del Baseline es
[`0aec81a3d836968ee2e585fcddf4fa03418e659e`](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/commit/0aec81a3d836968ee2e585fcddf4fa03418e659e).
Las Issues [#212](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/issues/212),
[#213](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/issues/213)
y [#214](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/issues/214)
fueron creadas a partir del Baseline. La corrección y verificación final de
#212 y #213 siguen pendientes; el seguimiento posterior de #214 se indica
abajo. En TC-11, el Coordinador/DevOps indicó
mantener RC03 abierto hasta que se subieran Fetch y SweetAlert2. RC03 continúa
abierto; TC-12 y TC-13 se ejecutaron posteriormente.

## Segundo Parcial — TC-12 Lighthouse Post Fetch

TC-12 se ejecutó manualmente el 27/11/2026 a las 00:56 GMT-3 en el commit
`ca9458f29d283e010c3fd2cafb5d931e3e70b1bb`, después de Fetch y antes de
SweetAlert2. El servidor y el worktree se verificaron posteriormente.

| Categoría | TC-11 | TC-12 | Diferencia |
|---|---:|---:|---:|
| Performance | 92 | 86 | -6 |
| Accessibility | 100 | 100 | 0 |
| Best Practices | 77 | 77 | 0 |
| SEO | 100 | 100 | 0 |

| Métrica | TC-11 | TC-12 | Diferencia |
|---|---:|---:|---:|
| FCP | 0.5 s | 0.5 s | 0 s |
| LCP | 1.1 s | 1.2 s | +0.1 s |
| TBT | 0 ms | 0 ms | 0 ms |
| CLS | 0.148 | 0.230 | +0.082 |
| Speed Index | 0.5 s | 0.5 s | 0 s |

Performance y Best Practices no cumplen ≥95. El CLS subió aproximadamente
55.4 % y las capturas muestran una `section` desplazada; la causa no está
confirmada. En esa auditoría, Best Practices mantenía el hallazgo de cookies
de Maps. No se puede
atribuir la variación a Fetch ni garantizar idénticas condiciones de red y
caché; faltan parámetros del Baseline.

Según lo informado, las Issues se actualizaron con los resultados de TC-12 y
el coordinador definió estos responsables:

| Issue | Responsable | Estado |
|---|---|---|
| #212 | @alandox1 — Desarrollador JS Asíncrono | Abierta; corrección y verificación pendientes |
| #213 | @LuchoBarrionuevo13 — Tester QA/JS | Abierta; corrección y verificación pendientes |
| #214 | @Piastrellini — Desarrollador JS de Librerías Externas | Cerrada en GitHub; verificación preliminar realizada |

El [TC-12](./test-case-12-lighthouse-post-fetch.md) contiene análisis,
recomendaciones, comparación y los borradores previos como referencia histórica.
Las [14 capturas](./screenshots/tc-12/) se enlazan individualmente allí.
Los responsables fueron comunicados por el coordinador; la consulta actual
confirma además los Assignees formales @alandox1 en #212,
@angelgc9107-lgtm en #213 y @Piastrellini en #214. El Assignee de #213
difiere de @LuchoBarrionuevo13, responsable comunicado; coordinar su
confirmación sin modificar la Issue. Queda pendiente la
verificación final de #212 y #213. RC03 sigue abierto.

### Seguimiento preliminar de #214

La [PR #221](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/pull/221)
de Thiago fue [aprobada](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/pull/221#pullrequestreview-6083871842)
y se integró en `develop`. Según el
[registro publicado de QA](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/pull/221#issuecomment-7210389785),
en una verificación preliminar sobre su rama se obtuvieron
Performance **97**, Accessibility **100**, Best Practices **100**, SEO **100**
y CLS **0.075**. No se detectaron solicitudes de Google Maps con el filtro
`maps` durante la carga inicial; se comprobó el botón **Ver mapa** y la
visualización del mapa después de pulsarlo. No se inspeccionaron las cookies
después de activarlo. No se localizaron capturas específicas de esa medición;
las capturas de #221 con Performance 91 son de otra medición, como se detalla
en [TC-13](./test-case-13-lighthouse-post-library.md).

GitHub confirma que #214 está **cerrada**, con cierre registrado el
27/11/2026 a las 05:33:04 UTC por @angelgc9107-lgtm. La verificación
informada es preliminar y **no corresponde al TC-13 oficial**, documentado
por separado a continuación. Queda solicitar al coordinador la confirmación
del cierre con la inspección de cookies pendiente.

## Segundo Parcial — TC-13 Lighthouse Post Library

El usuario ejecutó dos mediciones manuales sobre el [commit histórico
`5d6ba926db00137fb53eace818ef5fe8d362bf17`](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/commit/5d6ba926db00137fb53eace818ef5fe8d362bf17), posterior a Fetch y SweetAlert2
y anterior a la corrección de Maps de #221. La segunda, realizada el 27/11/2026
a las 03:19 GMT-3 con la ventana maximizada, se usa como referencia principal:
Performance **96**, Accessibility **100**, Best Practices **100**, SEO **100**
y CLS **0.075**. La primera obtuvo **75, 100, 100, 100** y CLS **0.555**;
Performance 75 no cumple el mínimo de 95. Se conserva sin descartar. La diferencia de visualización es una posible
influencia, no una causa confirmada.

| Categoría o métrica | TC-11 | TC-12 | TC-13 segunda |
|---|---:|---:|---:|
| Performance | 92 | 86 | 96 |
| Accessibility | 100 | 100 | 100 |
| Best Practices | 77 | 77 | 100 |
| SEO | 100 | 100 | 100 |
| FCP | 0.5 s | 0.5 s | 0.5 s |
| LCP | 1.1 s | 1.2 s | 1.2 s |
| TBT | 0 ms | 0 ms | 0 ms |
| CLS | 0.148 | 0.230 | 0.075 |
| Speed Index | 0.5 s | 0.5 s | 0.5 s |

TC-13 utilizó Lighthouse 13.3.0 y Chromium 150.0.7871.250; TC-11 y TC-12
registraron 13.5.0 y 158.0.0.0. Los parámetros anteriores de red y caché
están incompletos, por lo que las diferencias no demuestran causalidad. En la
segunda ejecución persisten recomendaciones estimadas de caché, imágenes,
recursos bloqueantes y JavaScript; Lighthouse identifica una `section` con
CLS 0.075 y recomienda evaluar la prioridad de la imagen LCP. Best Practices
100 no demuestra que Maps estuviera corregido en el commit histórico.

El [TC-13](./test-case-13-lighthouse-post-library.md) conserva el análisis,
las **18 capturas** (12 de la segunda ejecución y 6 de la primera), las
limitaciones y el seguimiento. Los resultados ya se publicaron en
[#212](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/issues/212#issuecomment-7211819949)
y [#213](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/issues/213#issuecomment-7211904775);
ambas permanecen abiertas y su verificación final sobre `develop` actualizado
sigue pendiente. Referencias directas:
[segunda ejecución](./screenshots/tc-13/01-lighthouse-scores-and-metrics.png),
[CLS](./screenshots/tc-13/06-layout-shift-culprits.png) y
[primera ejecución](./screenshots/tc-13/primera-ejecucion/01-lighthouse-scores.png).
El SHA TC-13 fue corregido manualmente y los cuerpos de ambas Issues enlazan
el commit correcto indicado arriba. Enumeran las capturas como rutas y nombres,
no como enlaces directos; estos se conservan en la documentación. #214
continúa cerrada y su verificación preliminar se mantiene separada.

## Segundo Parcial — Pruebas funcionales SweetAlert2

El 27/11/2026 se incorporó `library.spec.js` al runner y se conservaron las
27 pruebas de integración del controlador. Playwright MCP ejecutó la suite
completa en Chromium 158: **501 aprobadas, 0 fallidas, 0 pendientes**, semilla
`61496`; incluye 9/9 pruebas nuevas y 22/22 de API. La medición V8 independiente
con Playwright local registró 501 specs y 0 failures. El fallo manual anterior
de foco no se reprodujo y su causa sigue pendiente de investigación.

Los detalles, la comparación de cobertura y las capturas se encuentran en
[la documentación Jasmine](../../js/test/testing-doc.md). En aquella etapa de
pruebas no se ejecutó Lighthouse; TC-13 se realizó posteriormente.

### Validación manual de SweetAlert2 (27/11/2026)

Según lo informado por el usuario, comprobó personalmente que el diálogo se
visualiza correctamente y que el foco inicial está en **Cancelar**. También
verificó Tab, Shift + Tab y la cancelación con Escape: el carrito permanece
abierto y el foco vuelve al botón de eliminación. Al confirmar, el producto se
elimina y se actualizan la cantidad de productos y el total.

Las capturas muestran el [diálogo de confirmación](../../js/test/capturas/captura-sweetalert2-confirmacion-manual-2026-11-27.png)
y el [carrito después de la eliminación](../../js/test/capturas/captura-sweetalert2-eliminacion-manual-2026-11-27.png);
la navegación con teclado fue comprobada manualmente por el usuario y no se
deduce de las imágenes. El fallo anterior relacionado con el foco no se
reprodujo en esta validación manual; su causa original sigue sin determinarse.
Esta comprobación no es una nueva ejecución de Jasmine ni la auditoría TC-13.

## Resumen de Issues — Momento 1 (Testing pre-merge)

Ejecutado contra la rama `feature/responsive-design-add-responsive-styles` (incluye CSS de
Frontend + estilos responsive aplicados), antes del merge a `develop`. Los responsables de cada
hallazgo fueron notificados y los tres issues quedaron resueltos y verificados antes del merge.

| Test Case | Resultado | Issues creados | Responsable notificado |
|-----------|-----------|-----------------|--------------------------|
| TC-1 — Compatibilidad desktop | OK con hallazgo menor | [#42](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/issues/42) — bajo contraste en select "Ordenar por" en WebKit/Safari (cerrado) | Desarrollador Frontend / CSS |
| TC-2 — Responsive móvil | OK con hallazgo (iPad Air) | [#43](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/issues/43) — overflow horizontal por mapa sin responsive (cerrado) | Especialista en Responsive Design |
| TC-3 — Performance | OK (sin issues, recomendación de optimización) | Ninguno | — |
| TC-4 — Accesibilidad | Con hallazgos (6 violaciones serious) | [#44](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/issues/44) — contraste insuficiente en precios tachados y selector de orden (cerrado) | Desarrollador Frontend / CSS |
| TC-5 — Estructura HTML y CSS | OK (sin issues, observación menor) | Ninguno | — |

## Resumen de Issues — Momento 2 (Testing post-merge a develop)

Ejecutado contra `develop`, tras el merge de las ramas de Frontend y Responsive. El objetivo
fue verificar que las correcciones de Momento 1 sobrevivieran a la integración y detectar
problemas que solo aparecen al combinar el trabajo de ambos roles.

| Test Case | Resultado | Issues creados | Responsable notificado |
|-----------|-----------|-----------------|--------------------------|
| TC-1 — Compatibilidad desktop | OK en los 4 navegadores | Ninguno | — |
| TC-2 — Responsive móvil | OK sin overflow en los 3 dispositivos | Ninguno | — |
| TC-3 — Performance | Con hallazgo | [#46](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/issues/46) — diferencia de mayúsculas en nombres de imágenes causaba 404 en GitHub Pages (cerrado) | Desarrollador Frontend / CSS |
| TC-4 — Accesibilidad | OK — 0 violaciones WCAG 2.1 A+AA | Ninguno | — |
| TC-5 — Estructura HTML y CSS | OK — HTML con 0 errores y 0 warnings | Ninguno | — |

### Verificación de correcciones de Momento 1

| Issue | Estado tras el merge |
|-------|------------------------|
| #42 — contraste en select "Ordenar por" | Sigue corregido (5,32:1) |
| #43 — overflow del mapa en iPad Air | Sigue corregido (805px = 805px) |
| #44 — contraste en precios tachados | Sigue corregido (5,33:1) |

Ninguna corrección se perdió ni fue revertida durante la integración.

### Verificación del hallazgo de Momento 2

El issue #46 fue corregido por el Desarrollador Frontend / CSS y verificado en `develop` mediante
una comparación sensible a mayúsculas entre los archivos versionados en git y las referencias del
HTML: las 16 coinciden exactamente. Como la release desde la que se publica el sitio se genera a
partir de `develop`, el arreglo está en la rama que corresponde. Issue #46 cerrado.

**Los 4 issues de ambos momentos quedaron resueltos y verificados** (#42, #43, #44 y #46). No hay
hallazgos pendientes de QA en la Actividad Obligatoria N°2.

## Totales

| | Momento 1 | Momento 2 |
|---|-----------|-----------|
| Tests ejecutados | 5/5 | 5/5 |
| Tests con hallazgos | 3 (TC-1, TC-2, TC-4) | 1 (TC-3) |
| Tests limpios | 2 (TC-3, TC-5) | 4 (TC-1, TC-2, TC-4, TC-5) |
| Issues creados | 3 (#42, #43, #44) | 1 (#46) |
| Issues cerrados | 3 | 1 |

## Resumen de Issues — Primer Parcial

Los test cases 6 a 10 se ejecutaron sobre las ramas de cada componente del Primer Parcial. Los totales de arriba corresponden solo a la Actividad Obligatoria N°2.

| Test Case | Resultado | Issues / observaciones | Responsable |
|-----------|-----------|------------------------|-------------|
| TC-6 — Responsive de la migración a Bootstrap | OK con observaciones | Sin issues. Las observaciones O-2 (favicon) y O-3 (contador del carrito) se corrigieron en [#103](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/pull/103); O-1 no requirió corrección | Desarrollador Frontend/Bootstrap |
| TC-7 — Dropdown | OK con hallazgo | [#91](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/issues/91) — `--bs-dropdown-box-shadow` definida pero `box-shadow` efectivo `none` (corregido en [#105](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/pull/105)) | Especialista en Componentes Bootstrap |
| TC-8 — Offcanvas | OK con hallazgo | [#97](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/issues/97) — `--bs-offcanvas-box-shadow` definida pero `box-shadow` efectivo `none` (corregido en [#104](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/pull/104)) | Especialista en Componentes Bootstrap |
| TC-9 — Iframe de Google Maps | OK | Ninguno | — |
| TC-10 — Input range de precio | OK | Ninguno | — |

## Observaciones no bloqueantes (sin issue)

Hallazgos documentados en los test cases que no constituyen defectos funcionales:

- **Peso de imágenes (TC-3):** `Bienvenido1.png` y `Bienvenido2.png` suman 751 KB, el 79% del peso
  total de imágenes. Se recomienda convertirlas a WebP o JPG antes del despliegue a producción.
- **Área táctil (TC-4):** 3 links de categorías del panel de filtros quedan por debajo del mínimo
  de `target-size`, que pertenece a WCAG 2.2 y está fuera del alcance de este testing (WCAG 2.1).
- **Semántica de headings (TC-5):** el único `<h1>` es "Ofertas" y no el nombre del sitio.
- **Nombres accesibles (TC-5):** los dos campos "Cantidad" del carrito se anuncian igual, y el
  texto visible del link del carrito no coincide con su `aria-label`.
- **Sintaxis CSS (TC-5):** `clip: rect(0 0 0 0)` en `components.css:36` usa sintaxis legacy sin comas.
- **Layout en tablet (TC-2):** panel de filtros angosto con texto cortado, carrito con altura fija
  que deja espacio vacío, y mapa pixelado por escalado.

## Notas metodológicas

- Se utilizó **Claude Code** en lugar de GitHub Copilot Agent Mode debido a límite de créditos
  alcanzado durante la ejecución de esta actividad, con los mismos servidores MCP (Playwright y
  GitHub). Ver detalle en `spec-qa.md`.
- TC-1 se ejecutó usando motores reales de navegador (Chromium, Firefox, WebKit) vía el paquete
  `playwright` en lugar del tool nativo de Playwright MCP, ya que este último no permite
  seleccionar motor. Ver nota metodológica específica en `test-case-1.md`.
- Las condiciones de medición de TC-3 difieren entre momentos (servidor y estado de caché
  distintos), por lo que los tiempos no son directamente comparables; sí lo es el peso de los
  recursos. Detalle en `test-case-3.md`.
- En TC-2 (Momento 2) se descartó un falso positivo mediante medición con Playwright: una supuesta
  superposición entre el botón "×" del carrito y el texto "Precio unitario" que resultó no existir.
  El hallazgo derivado sobre área táctil se evaluó en TC-4 y tampoco constituye violación.

## Requisitos para QA

- Configurar el token de GitHub en `.vscode/mcp.json` (variable `GITHUB_PERSONAL_ACCESS_TOKEN`)
- Iniciar Playwright MCP desde el entorno local
- Ejecutar la validación de los test cases mediante Playwright MCP (no vía `npm test`)
- Revisar los resultados y capturas bajo `docs/04-testing/`


## Resolución de Issue #213 — Desplazamientos visuales durante la carga (CLS)

**Issue:** [#213 — Desplazamientos visuales durante la carga (CLS)](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/issues/213)  
**PR:** [#223 — Corrección de CLS y documentación de evidencias](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/pull/223)  
**Fecha:** 27/11/2026.  
**Herramientas:** Chrome DevTools, Local Overrides, Lighthouse DevTools y Lighthouse CLI.

### Problema detectado

El contenedor `#ofertas-productos` no reservaba espacio suficiente durante la carga asíncrona de las ofertas mediante Fetch. La incorporación dinámica de las tarjetas provocaba el desplazamiento de las secciones inferiores de la página.

El problema fue identificado inicialmente en Desktop y Mobile. Posteriormente, se amplió la evaluación a Tablet mediante Lighthouse CLI, detectándose también desplazamientos visuales en resoluciones intermedias.

### Corrección realizada

Se realizaron mediciones de la altura del contenedor y pruebas experimentales para determinar el espacio necesario antes de finalizar la carga asíncrona de las ofertas.

Se incorporaron las siguientes modificaciones:

- `css/components.css`: se estableció una altura mínima general de 308 px para el contenedor `#ofertas-productos`.
- `css/responsive.css`: se estableció una altura mínima de 915 px dentro de la media query de Mobile (`max-width: 767.98px`).
- `css/responsive.css`: se incorporó una media query independiente para resoluciones entre 768 px y 991.98 px, estableciendo una altura mínima de 615 px para Tablet.

No se realizaron modificaciones en HTML, JavaScript ni en la implementación de Fetch.

### 1. Mediciones reales del contenedor

Se realizaron mediciones mediante la consola de Chrome DevTools sobre el contenedor `#ofertas-productos`, una vez finalizada la carga asíncrona de las ofertas.

| Dispositivo | Ancho de ventana | Altura real del contenedor | Altura mínima seleccionada |
|---|---:|---:|---:|
| Desktop | 1277 px | 307.55859375 px | 308 px |
| Tablet | 768 px | 614.34375 px | 615 px |
| Mobile | 400 px | 914.34375 px | 915 px |

Las alturas mínimas se determinaron redondeando hacia arriba los valores obtenidos.

La diferencia entre las alturas responde a la distribución responsive de las tarjetas de ofertas:

- Desktop: tres columnas y una fila.
- Tablet: dos columnas y dos filas.
- Mobile: una columna y tres filas.

Para realizar las mediciones y verificar los estilos aplicados se utilizó el siguiente comando:

```javascript
console.table({
    anchoVentana: window.innerWidth,
    altoVentana: window.innerHeight,
    altoContenedor: document.querySelector("#ofertas-productos").getBoundingClientRect().height,
    alturaMinima: getComputedStyle(document.querySelector("#ofertas-productos")).minHeight
});
```

### 2. Resultados de las pruebas experimentales en Desktop y Mobile

Se utilizó Local Overrides de Chrome DevTools para evaluar diferentes alturas mínimas sin modificar inicialmente el código fuente del proyecto.

Posteriormente, se ejecutaron auditorías Lighthouse para comprobar el impacto sobre el CLS.

| Dispositivo | Altura mínima aplicada | CLS obtenido |
|---|---:|---:|
| Desktop | Sin corrección | 0.183 |
| Desktop | 308 px | 0.000 |
| Mobile | Sin corrección | 0.656 |
| Mobile | 308 px | 0.208 |
| Mobile | 915 px | 0.000 |

Los resultados demostraron que la altura mínima de 308 px era suficiente para Desktop, pero no para Mobile, donde todavía se producían desplazamientos visuales.

### 3. Resultados de las auditorías iniciales sobre el código corregido

Una vez incorporadas las correcciones para Desktop y Mobile, se ejecutaron nuevas auditorías Lighthouse.

| Indicador | Desktop antes | Desktop después | Mobile antes | Mobile después |
|---|---:|---:|---:|---:|
| Performance | 56 | 63 | 42 | 63 |
| Accessibility | 100 | 100 | 100 | 100 |
| Best Practices | 100 | 100 | 100 | 100 |
| SEO | 100 | 100 | 100 | 100 |
| FCP | 1.6 s | 1.7 s | 2.8 s | 3.0 s |
| LCP | 4.6 s | 5.4 s | 9.9 s | 10.1 s |
| TBT | 0 ms | 0 ms | 0 ms | 0 ms |
| CLS | 0.183 | 0.000 | 0.656 | 0.000 |
| Speed Index | 3.2 s | 3.4 s | 5.9 s | 7.0 s |

Se alcanzó un CLS de 0.000 en ambas modalidades, eliminando los desplazamientos visuales registrados en las auditorías iniciales.

Si bien Performance presentó una mejora en su puntuación, las métricas FCP, LCP y Speed Index registraron variaciones desfavorables. Por lo tanto, no se considera que la corrección del CLS represente una optimización general de todas las métricas de rendimiento.

**Commit de la corrección inicial:** [7ff4f86ffd3528d6f5fdfdd5334468384a1fad3d](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/pull/223/changes/7ff4f86ffd3528d6f5fdfdd5334468384a1fad3d).

### 4. Ampliación de las pruebas a Tablet mediante Lighthouse CLI

El panel Lighthouse de Chrome DevTools ofrece los perfiles Desktop y Mobile, sin una opción específica para Tablet.

Para ampliar el alcance de las verificaciones, se utilizó Lighthouse CLI, que permite configurar dimensiones personalizadas mediante los parámetros `screenEmulation`.

Se seleccionó una resolución de 768 × 1024 px en orientación vertical.

#### Comando utilizado

```powershell
lighthouse http://127.0.0.1:8000/ --form-factor=mobile --screenEmulation.mobile --screenEmulation.width=768 --screenEmulation.height=1024 --screenEmulation.deviceScaleFactor=2 --output=html --output-path="./lighthouse-tablet.html" --view
```

#### Condiciones de ejecución de la auditoría inicial

| Parámetro | Configuración |
|---|---|
| Fecha | 27/11/2026 |
| Hora | 18:47 GMT-3 |
| URL | `http://127.0.0.1:8000/` |
| Herramienta | Lighthouse CLI |
| Versión de Lighthouse | 13.6.0 |
| Versión de Chromium | 158.0.0.0 |
| Modo | Navigation |
| Perfil de evaluación | Mobile |
| Perfil indicado en el informe | Emulated Moto G Power |
| Resolución configurada | 768 × 1024 px |
| Orientación | Vertical |
| Device Scale Factor | 2 |
| Throttling | Slow 4G |
| Tipo de carga | Initial page load |
| Tipo de sesión | Single page session |
| Servidor local | http-server |
| Caché del navegador | Limpiada antes de la auditoría |

El informe identifica el perfil de emulación como Moto G Power debido a la utilización del perfil Mobile. Las dimensiones personalizadas se encuentran respaldadas por el comando ejecutado mediante CLI.

#### Problema detectado en Tablet

La auditoría inicial obtuvo los siguientes resultados:

| Indicador | Resultado |
|---|---:|
| Performance | 55 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |
| CLS | 0.465 |

Mediante el apartado `Layout shift culprits`, Lighthouse identificó como elemento afectado a:

```html
<section aria-label="Servicios de FerroLab">
```

La sección presentó un desplazamiento correspondiente al CLS total registrado de 0.465.

Posteriormente, mediante Chrome DevTools, se verificó que el contenedor de ofertas tenía una altura real de 614.34375 px, mientras que la altura mínima aplicada era de 308 px.

La altura mínima existente resultaba insuficiente para reservar el espacio requerido por las dos filas de ofertas.

### 5. Corrección específica para Tablet

A partir de las mediciones realizadas, se determinó una altura mínima de 615 px para resoluciones intermedias.

Durante las verificaciones se detectó que la media query de Tablet había quedado inicialmente anidada dentro de la media query de Mobile.

Esta ubicación impedía su aplicación, dado que ambas condiciones de ancho eran incompatibles.

Se corrigió la estructura de `css/responsive.css`, dejando ambas media queries independientes.

#### Estilos aplicados en `css/components.css`

```css
#ofertas-productos {
    min-height: 308px;
}
```

#### Estilos aplicados en `css/responsive.css`

```css
@media (max-width: 767.98px) {
    #ofertas-productos {
        min-height: 915px;
    }
}

@media (min-width: 768px) and (max-width: 991.98px) {
    #ofertas-productos {
        min-height: 615px;
    }
}
```

Los rangos seleccionados responden a los cambios en la distribución responsive de las tarjetas de ofertas.

Durante una ejecución preliminar de Lighthouse se obtuvieron los siguientes resultados:

| Indicador | Tablet inicial | Ejecución preliminar |
|---|---:|---:|
| Performance | 55 | 74 |
| Accessibility | 100 | 100 |
| Best Practices | 100 | 100 |
| SEO | 100 | 100 |
| CLS | 0.465 | 0.000 |

#### Métricas de la ejecución preliminar

| Métrica | Resultado |
|---|---:|
| FCP | 2.1 s |
| LCP | 7.1 s |
| TBT | 0 ms |
| CLS | 0.000 |
| Speed Index | 2.1 s |

Debido a que posteriormente se identificó la ubicación incorrecta de la media query, estos resultados se conservan como evidencia preliminar y no se utilizan por sí solos para validar la aplicación definitiva de los 615 px.

Una vez corregida la estructura de las media queries, se repitió la auditoría Lighthouse y se obtuvo nuevamente un CLS de 0.000.

### 6. Verificaciones de estilos y comportamiento responsive

Se utilizaron las funciones `getComputedStyle()` y `matchMedia()` para verificar las alturas mínimas aplicadas y el cumplimiento de las condiciones de las media queries.

```javascript
getComputedStyle(
    document.querySelector("#ofertas-productos")
).minHeight
```

```javascript
window.matchMedia(
    "(min-width: 768px) and (max-width: 991.98px)"
).matches
```

Durante las verificaciones se registraron las siguientes mediciones:

| Resolución | Altura real | Altura mínima registrada | Distribución |
|---|---:|---:|---|
| 768 × 1024 px | 614.34375 px | 308 px | Dos columnas |
| 960 × 1440 px | 600 px | 308 px | Dos columnas |
| 1032 × 1376 px | 308 px | 308 px | Tres columnas |

Las mediciones de 768 px y 960 px permitieron identificar la necesidad de una corrección específica para Tablet y detectar que la media query no se estaba aplicando correctamente.

La medición de 1032 px permitió verificar que, al superar el breakpoint de 992 px, las ofertas recuperaban la distribución de tres columnas y la altura mínima de 308 px.

Después de corregir las media queries, quedaron establecidos los siguientes valores:

| Rango de resolución | Altura mínima definida |
|---|---:|
| Hasta 767.98 px | 915 px |
| Desde 768 px hasta 991.98 px | 615 px |
| Desde 992 px | 308 px |

Las verificaciones visuales realizadas permitieron observar la distribución de las ofertas en diferentes resoluciones. Las comprobaciones corresponden exclusivamente a las dimensiones evaluadas y no representan una validación exhaustiva de todos los anchos posibles.

### 7. Auditorías definitivas y pruebas de regresión mediante Lighthouse CLI

Después de corregir la ubicación de la media query de Tablet, se ejecutaron nuevas auditorías Lighthouse en Desktop, Tablet y Mobile para verificar la efectividad de la solución y detectar posibles regresiones relacionadas con CLS.

#### Desktop

```powershell
lighthouse http://127.0.0.1:8000/ --preset=desktop --output=html --output-path="./lighthouse-desktop-definitivo.html" --view
```

#### Tablet

```powershell
lighthouse http://127.0.0.1:8000/ --form-factor=mobile --screenEmulation.mobile --screenEmulation.width=768 --screenEmulation.height=1024 --screenEmulation.deviceScaleFactor=2 --output=html --output-path="./lighthouse-tablet-definitivo.html" --view
```

#### Mobile

```powershell
lighthouse http://127.0.0.1:8000/ --form-factor=mobile --screenEmulation.mobile --screenEmulation.width=400 --screenEmulation.height=844 --screenEmulation.deviceScaleFactor=2 --output=html --output-path="./lighthouse-mobile-definitivo.html" --view
```

#### Resultados definitivos de CLS

| Dispositivo | Altura mínima definida | CLS inicial | CLS definitivo | Estado |
|---|---:|---:|---:|---|
| Desktop | 308 px | 0.183 | 0.000 | PASS |
| Tablet | 615 px | 0.465 | 0.000 | PASS |
| Mobile | 915 px | 0.656 | 0.000 | PASS |

Las tres auditorías definitivas obtuvieron un CLS de 0.000, confirmando que no se detectaron desplazamientos visuales durante las cargas evaluadas.

La incorporación de la media query específica para Tablet no produjo regresiones en el CLS de Desktop ni Mobile bajo las condiciones evaluadas.

El estado PASS corresponde exclusivamente a la verificación de CLS y no implica el cumplimiento del umbral de Performance de 95 puntos.

#### Trazabilidad de las auditorías definitivas

Las auditorías definitivas se realizaron localmente mediante Lighthouse CLI sobre el código que incorpora las tres alturas mínimas.

Las condiciones efectivas de cada ejecución deberán quedar respaldadas mediante las capturas de los informes correspondientes.

**Commit definitivo:** pendiente de registrar una vez commiteada la corrección de Tablet.

### 8. Comparación con las auditorías históricas

Se compararon los resultados obtenidos después de la corrección de la Issue #213 con los valores de CLS registrados en las auditorías anteriores del proyecto.

| Auditoría | CLS obtenido |
|---|---:|
| TC-11 — Baseline inicial | 0.148 |
| TC-12 — Post Fetch | 0.230 |
| TC-13 — Post Library (ventana reducida) | 0.555 |
| TC-13 — Post Library (ventana maximizada) | 0.075 |
| Issue #213 — Desktop sin corrección | 0.183 |
| Issue #213 — Tablet sin corrección específica | 0.465 |
| Issue #213 — Mobile sin corrección | 0.656 |
| Issue #213 — Desktop corregido | 0.000 |
| Issue #213 — Tablet corregido | 0.000 |
| Issue #213 — Mobile corregido | 0.000 |

Los resultados muestran una mejora de la estabilidad visual respecto de las auditorías históricas, alcanzando un CLS de 0.000 en las tres modalidades evaluadas.

### 9. Limitaciones de comparabilidad y mantenimiento

Las auditorías históricas se realizaron sobre diferentes versiones del proyecto, utilizando distintas dimensiones de ventana, versiones de Lighthouse y configuraciones del navegador.

Además, no se dispone de un registro completo de las condiciones de red y caché de todas las auditorías anteriores.

Las pruebas iniciales de Desktop y Mobile se realizaron mediante Lighthouse integrado en Chrome DevTools, mientras que las verificaciones definitivas se realizaron mediante Lighthouse CLI.

Por este motivo, la comparación permite observar la evolución del CLS, pero no establecer una equivalencia directa entre todas las mediciones ni atribuir exclusivamente las variaciones de Performance a la corrección implementada.

Las pruebas en Tablet utilizaron dimensiones personalizadas y el perfil de evaluación Mobile, debido a que Lighthouse no dispone de un perfil de puntuación exclusivo para Tablet.

Las alturas mínimas de 308 px, 615 px y 915 px se determinaron en función del contenido y la distribución actual de las ofertas.

En caso de modificarse la cantidad de productos, el contenido de las tarjetas, los estilos o los breakpoints responsive, deberán revisarse las alturas mínimas y ejecutarse nuevas verificaciones para evitar desplazamientos visuales o espacios vacíos excesivos.

### 10. Evidencias

Las evidencias correspondientes a la resolución de la Issue #213 se encuentran organizadas en:

[Capturas de la Issue #213](./screenshots/Issue-213/).

Las evidencias recopiladas comprenden:

- Mediciones reales del contenedor en Desktop, Tablet y Mobile.
- Verificación de las alturas mínimas mediante Chrome DevTools.
- Resultados de las pruebas experimentales con Local Overrides.
- Auditorías iniciales de Desktop y Mobile.
- Comando de configuración de Lighthouse CLI para Tablet.
- Condiciones de ejecución de la auditoría inicial de Tablet.
- Identificación del elemento afectado mediante `Layout shift culprits`.
- Resultados de la auditoría preliminar de Tablet.
- Mediciones y verificaciones visuales en diferentes resoluciones responsive.

Se deberán incorporar los enlaces individuales a las capturas de las auditorías definitivas de Desktop, Tablet y Mobile, sus condiciones de ejecución y las verificaciones visuales finales.


### Conclusión

La corrección permitió reducir el CLS un 100 % respecto de los valores iniciales registrados en Desktop, Tablet y Mobile, obteniendo un valor de 0.000 en las tres auditorías definitivas.

La utilización de Lighthouse CLI permitió ampliar el alcance de las pruebas a resoluciones intermedias, identificar un problema no contemplado inicialmente y verificar su resolución mediante una media query específica para Tablet.

Las pruebas de regresión confirmaron que la incorporación de la nueva media query no afectó negativamente los resultados de CLS de Desktop ni Mobile bajo las condiciones evaluadas.

Las optimizaciones adicionales de Performance corresponden a la Issue #212 y quedan fuera del alcance de esta corrección.

**Estado:** Corrección implementada y validada localmente mediante Lighthouse CLI en Desktop, Tablet y Mobile. Pendiente de completar la trazabilidad documental, integración de la PR y cierre de la Issue #213.