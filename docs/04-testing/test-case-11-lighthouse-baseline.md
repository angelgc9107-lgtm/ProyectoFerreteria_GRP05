# Test Case 11 — Lighthouse Baseline

**Componente:** Página principal de FerroLab (`/`).  
**Herramienta:** Google Chrome DevTools — Lighthouse.  
**Estado:** Ejecutado manualmente. Performance y Best Practices no alcanzan el umbral mínimo.

## Objetivo

Establecer la medición de referencia en Desktop y Navigation sobre `develop`,
después del backport aprobado de la Actividad Obligatoria N.º 4 y antes de
incorporar Fetch o SweetAlert2. El umbral mínimo esperado es **≥95** en cada
una de las cuatro categorías.

## Datos de ejecución

| Dato | Registro |
|---|---|
| Fecha y hora | 26/11/2026, 13:37 GMT-3 |
| URL de la primera ejecución | `http://127.0.0.1:8000/` (referencia local verificada previamente; las capturas no muestran la barra de direcciones, por lo que el host exacto usado durante la auditoría no se puede confirmar solo con esta evidencia) |
| Rama / commit de referencia | `develop` — [`0aec81a3d836968ee2e585fcddf4fa03418e659e`](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/commit/0aec81a3d836968ee2e585fcddf4fa03418e659e), verificado en el historial del repositorio. La captura no contiene SHA ni nombre de rama. |
| Lighthouse | 13.5.0 |
| Chromium informado | 158.0.0.0 |
| Servidor local | `npx http-server -p 8000`, versión 14.1.1 (según los datos de ejecución aportados) |
| Resultado | Auditoría completada; se registran los resultados y hallazgos de las capturas adjuntas. |

El commit de referencia es el HEAD local verificado y coincide con `develop`;
corresponde al backport aprobado de AO4 más los cambios documentales del SPEC.
No se detectaron Fetch ni SweetAlert2 integrados en el código funcional de
ese commit. La evidencia visual no identifica por sí sola el checkout ni
contiene el SHA del informe.

## Configuración de la auditoría

| Parámetro | Valor |
|---|---|
| Modo | Navigation |
| Dispositivo | Desktop emulado |
| Categorías | Performance, Accessibility, Best Practices y SEO |
| Throttling | Custom throttling |
| Carga | Initial page load |
| Sesión | Single page session |

La captura `12-lighthouse-execution-conditions.png` muestra la fecha y hora,
Lighthouse 13.5.0, Chromium 158.0.0.0, Desktop emulado, Navigation/Initial
page load, Custom throttling y Single page session. No muestra los valores
concretos del throttling (por ejemplo, latencia, throughput o CPU), ni las
condiciones de red detalladas ni el estado/configuración de caché. Esos datos
no fueron registrados en las capturas ni en los demás registros disponibles,
por lo que no pueden recuperarse con certeza. No se atribuyen valores de
configuración actuales a esta auditoría.

### Servidores y comparabilidad

- **Baseline:** `npx http-server -p 8000`, versión 14.1.1. La URL local
  documentada es `http://127.0.0.1:8000/`; la captura no muestra la barra de
  direcciones, así que no confirma por sí sola el host exacto.
- **Referencia propuesta para próximas auditorías:** Live Server de Visual
  Studio Code en `http://127.0.0.1:5500/index.html`. No se atribuye esta URL a
  la ejecución del Baseline.

El cambio de servidor puede producir diferencias en políticas de caché,
cabeceras HTTP, tiempos de respuesta y carga de recursos, con efecto potencial
en métricas y puntuaciones de Performance. Para TC-12 y TC-13, priorizar
condiciones equivalentes a las del Baseline; si se utiliza Live Server u otro
servidor, registrar expresamente esa diferencia como limitación de
comparabilidad.

## Resultados

Resultados originales reportados por Lighthouse:

| Categoría | Umbral | Resultado | Estado |
|---|---:|---:|---|
| Performance | ≥95 | 92 | No alcanza |
| Accessibility | ≥95 | 100 | Alcanza |
| Best Practices | ≥95 | 77 | No alcanza |
| SEO | ≥95 | 100 | Alcanza |

| Métrica | Valor | Unidad |
|---|---:|---|
| First Contentful Paint (FCP) | 0.5 | s |
| Largest Contentful Paint (LCP) | 1.1 | s |
| Total Blocking Time (TBT) | 0 | ms |
| Cumulative Layout Shift (CLS) | 0.148 | sin unidad |
| Speed Index | 0.5 | s |

La captura de Accessibility muestra 16 auditorías aprobadas. La de Best
Practices muestra 37 no aplicables y los dos hallazgos documentados abajo. La
captura de SEO muestra 2 no aplicables.

## Hallazgos y recomendaciones Lighthouse

### Performance — Insights

| Insight | Ahorro estimado mostrado |
|---|---:|
| Use efficient cache lifetimes | 849 KiB |
| Improve image delivery | 862 KiB |
| Render-blocking requests | 200 ms |
| Layout shift culprits | Sin cifra visible |
| LCP request discovery | Sin cifra visible |
| Network dependency tree | Sin cifra visible |
| Document request latency | 9 KiB |
| Optimize DOM size | Sin cifra visible |
| LCP breakdown | Sin cifra visible |
| 3rd parties | Sin cifra visible |

### Performance — Diagnostics

| Diagnóstico | Ahorro estimado mostrado |
|---|---:|
| Minify JavaScript | 96 KiB |
| Reduce unused JavaScript | 91 KiB |
| Minify CSS | 7 KiB |

Los ahorros son estimaciones independientes de Lighthouse y no deben sumarse
como un ahorro total. Las capturas muestran los nombres y estimaciones, pero
no los paneles desplegados con detalles adicionales. Lighthouse indica que los
diagnósticos de minificación no afectan directamente la puntuación Performance.
El informe sugiere grabar un trace en el panel Performance de DevTools para
consultar detalles ampliados.

### Best Practices — problemas observados

- **Uses third-party cookies:** 29 cookies detectadas. Las URLs visibles
  corresponden a recursos de Google Maps (`www.google.com/maps?...&output=embed`
  y `/maps/embed?...`); se registran como asociadas a la integración de Maps,
  según la evidencia aportada. Entre los nombres visibles se encuentran
  `COMPASS`, `__Secure-OSID`, `LSOLH`, `__Host-3PLSID`, `__Secure-3PAPISID`,
  `NID`, `__Secure-3PSIDTS` y `__Secure-3PSIDCC`.
- **Issues were logged in the Issues panel in Chrome DevTools:** la captura
  expandida muestra un issue de tipo **Cookie** con solicitudes de Google Maps.
  La explicación del informe indica que los issues de DevTools pueden provenir
  de solicitudes de red, controles de seguridad u otras advertencias del
  navegador; en la evidencia adjunta, el issue visible está vinculado a Maps.

## Issues registradas

Las tres Issues fueron creadas y permanecen abiertas. Ninguna tiene responsable
asignado; el Coordinador/DevOps definirá las asignaciones. No se corrigió el
código funcional.

### [#212 — Performance inferior al umbral mínimo](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/issues/212)

- **Estado:** Abierta.
- **Responsable:** Pendiente de asignación por el Coordinador/DevOps.
- **Contexto:** TC-11, Lighthouse 13.5.0, Navigation, Desktop emulado, Custom
  throttling, commit de referencia
  [`0aec81a3d836968ee2e585fcddf4fa03418e659e`](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/commit/0aec81a3d836968ee2e585fcddf4fa03418e659e).
- **Pasos para reproducir:** servir la página principal en el puerto 8000;
  ejecutar Lighthouse con la configuración de este caso.
- **Esperado:** Performance ≥95, según el umbral del SPEC.
- **Obtenido:** Performance 92. Lighthouse señaló caché (849 KiB), entrega de
  imágenes (862 KiB), recursos que bloquean renderizado (200 ms), latencia del
  documento (9 KiB), minificación de JavaScript (96 KiB), JavaScript no usado
  (91 KiB) y minificación de CSS (7 KiB). También listó el árbol de
  dependencias de red, el descubrimiento y desglose de LCP, el tamaño del DOM,
  terceros y causas de desplazamiento de layout.
- **Evidencia:** `01-lighthouse-scores.png`, `02-performance-metrics.png`,
  `03-performance-insights.png` y `04-performance-diagnostics.png`.

### [#213 — Desplazamientos visuales durante la carga (CLS)](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/issues/213)

- **Estado:** Abierta.
- **Responsable:** Pendiente de asignación por el Coordinador/DevOps.
- **Contexto:** TC-11, mismo entorno y commit de referencia.
- **Pasos para reproducir:** ejecutar la navegación Lighthouse según la
  configuración de este caso y revisar la métrica CLS y el insight **Layout
  shift culprits**.
- **Esperado:** investigar y documentar el origen de los desplazamientos y
  acordar con el equipo el objetivo de corrección; el SPEC no define un
  umbral numérico separado para CLS.
- **Obtenido:** CLS 0.148; Lighthouse lista **Layout shift culprits**.
- **Evidencia:** `02-performance-metrics.png` y `03-performance-insights.png`.

### [#214 — Best Practices y cookies de terceros de Google Maps](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/issues/214)

- **Estado:** Abierta.
- **Responsable:** Pendiente de asignación por el Coordinador/DevOps.
- **Contexto:** TC-11, mismo entorno y commit de referencia.
- **Pasos para reproducir:** ejecutar Lighthouse y abrir los dos hallazgos de
  Best Practices; revisar el issue Cookie en Chrome DevTools.
- **Esperado:** Best Practices ≥95 según el SPEC y análisis del impacto/
  alternativas para la integración de Maps, sin asumir que las cookies de
  terceros puedan corregirse desde el sitio.
- **Obtenido:** Best Practices 77; el informe detecta 29 cookies de terceros y
  registra un issue de tipo Cookie asociado a solicitudes de Google Maps.
- **Evidencia:** `06-best-practices.png` y
  `08-google-maps-cookies-1.png`–`11-google-maps-devtools-issue.png`.

### Trazabilidad para actualizar manualmente las Issues

- **Commit de referencia:** [`0aec81a3d836968ee2e585fcddf4fa03418e659e`](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/commit/0aec81a3d836968ee2e585fcddf4fa03418e659e).
- **Documentación:** este [TC-11 — Lighthouse Baseline](./test-case-11-lighthouse-baseline.md).
- **Evidencias:** [directorio de capturas de TC-11](./screenshots/tc-11/).
- **Capturas por Issue:** #212 — `01-lighthouse-scores.png` a
  `04-performance-diagnostics.png`; #213 — `02-performance-metrics.png` y
  `03-performance-insights.png`; #214 — `06-best-practices.png` y
  `08-google-maps-cookies-1.png` a `11-google-maps-devtools-issue.png`.

En la Issue #212, la tarea “Implementar las mejoras correspondientes” figura
marcada como completada, pero no se realizaron correcciones funcionales. Se
debe desmarcar manualmente en GitHub. No se modificaron las Issues desde esta
actualización documental.

## Evidencias

Se conservan las 11 capturas originales y se añade la captura adjunta con los
detalles visibles de la ejecución, sin modificar las imágenes, en
`docs/04-testing/screenshots/tc-11/`:

1. `01-lighthouse-scores.png`
2. `02-performance-metrics.png`
3. `03-performance-insights.png`
4. `04-performance-diagnostics.png`
5. `05-accessibility.png`
6. `06-best-practices.png`
7. `07-seo.png`
8. `08-google-maps-cookies-1.png`
9. `09-google-maps-cookies-2.png`
10. `10-google-maps-cookies-3.png`
11. `11-google-maps-devtools-issue.png`
12. `12-lighthouse-execution-conditions.png`

## Conclusión

TC-11 registra una auditoría con resultados mixtos. Accessibility y SEO
alcanzaron el umbral mínimo (100 cada una); Performance (92) y Best Practices
(77) quedaron por debajo de 95, por lo que el baseline **no cumple todos los
criterios de aceptación**. FCP (0.5 s), LCP (1.1 s), TBT (0 ms), CLS (0.148) y
Speed Index (0.5 s) quedan registrados como valores originales.

Las Issues #212, #213 y #214 están creadas y abiertas, con asignación pendiente;
la resolución y verificación de los problemas siguen pendientes. Los hallazgos
son del Baseline previo a Fetch y SweetAlert2. Por indicación del
Coordinador/DevOps, RC03 permanece abierto hasta que Alan y Thiago suban sus
respectivas implementaciones; esto no resuelve ni cierra las Issues. El host
exacto y el checkout de la ejecución no aparecen en las capturas. TC-12,
TC-13 y el AT CLOSE definitivo no se realizaron.
