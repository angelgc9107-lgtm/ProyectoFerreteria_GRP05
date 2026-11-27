# Testing Doc — Actividad Obligatoria N°2, Primer Parcial y Segundo Parcial

Índice central de test cases y resumen de issues. Los test cases 1 a 10 se ejecutaron con **Playwright MCP** (vía Claude Code — ver nota en spec-qa.md sobre el cambio de herramienta) y corresponden a la Actividad Obligatoria N°2 y al Primer Parcial. TC-11 y TC-12 corresponden al Segundo Parcial y se ejecutaron manualmente con Lighthouse.

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
abierto; TC-12 se ejecutó posteriormente y TC-13 sigue pendiente.

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
Quedan pendientes TC-13 y la verificación final de #212 y #213. RC03 sigue abierto.

### Seguimiento preliminar de #214

La PR #221 de Thiago se integró en `develop`. Según lo informado por el
usuario, en una verificación preliminar sobre su rama se obtuvieron
Performance **97**, Accessibility **100**, Best Practices **100**, SEO **100**
y CLS **0.075**. No se detectaron solicitudes de Google Maps con el filtro
`maps` durante la carga inicial; se comprobó manualmente el botón **Ver mapa**
y se informó al coordinador para gestionar el cierre.

GitHub confirma que #214 está **cerrada**, con cierre registrado el
27/11/2026 a las 05:33:04 UTC por @angelgc9107-lgtm. La verificación
informada es preliminar y **no corresponde al TC-13 oficial**, que permanece
pendiente.

## Segundo Parcial — Pruebas funcionales SweetAlert2

El 27/11/2026 se incorporó `library.spec.js` al runner y se conservaron las
27 pruebas de integración del controlador. Playwright MCP ejecutó la suite
completa en Chromium 158: **501 aprobadas, 0 fallidas, 0 pendientes**, semilla
`61496`; incluye 9/9 pruebas nuevas y 22/22 de API. La medición V8 independiente
con Playwright local registró 501 specs y 0 failures. El fallo manual anterior
de foco no se reprodujo y su causa sigue pendiente de investigación.

Los detalles, la comparación de cobertura y las capturas se encuentran en
[la documentación Jasmine](../../js/test/testing-doc.md). TC-13 sigue
pendiente; no se ejecutó una auditoría Lighthouse en esta etapa.

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