# Pruebas de regresión de la PR #224 (rendimiento, issue #212)

**Rol:** Desarrollador JS Asíncrono (Fetch & APIs) · **Fecha de ejecución:** 27/11/2026 · **Navegador:** Chromium (Playwright), sin otros navegadores.

Este documento responde al hallazgo RC03 de la revisión técnica de la PR #224: identifica los commits probados, adjunta las salidas completas y precisa el único fallo.

## 1. Versiones probadas

| Versión | Contenido | Commit |
|---|---|---|
| `develop` | Sin cambios (merge de la PR #222) | `5d578a9` |
| Rama de esta PR | `develop` + commits de CLS en tablet, imágenes y documentación | `193614f` (entorno de pruebas). Tiene el mismo código que el `HEAD` de la rama tras aplicar los parches: `<completar: git rev-parse --short HEAD en tu repo>`. Los commits posteriores son solo documentación y no cambian el código probado. |
| `develop` + PR #223 | `fix/layout-shift-cls` (Angel, #213) mergeada en `develop` de forma local | `71a7d0f` de la rama de Angel; merge local `da209e1` |
| Combinada | Rama de esta PR + `fix/layout-shift-cls`, merge local sin publicar | `9c94a8a` |

Los merges locales se hicieron para probar el orden previsto (primero #223, después esta PR). El merge no tuvo conflictos. No se publicó nada.

## 2. Resultados

### Suites existentes (Jasmine, en Chromium; incluyen las del Tester QA/JS)

| Versión | Resultado | Salida |
|---|---|---|
| `develop` | 501 specs, 1 fallo, 3 pendientes | `salidas/suites-develop.txt` |
| Rama de esta PR | 501 specs, 1 fallo, 3 pendientes | `salidas/suites-rama.txt` |
| Combinada | 501 specs, 1 fallo, 3 pendientes | `salidas/suites-combinada.txt` |

**El único fallo** es el mismo en las tres versiones, incluida `develop` sin cambios: `ServicioDialogos - librería externa > ServicioDialogos - SweetAlert2 real > mantiene Tab dentro del diálogo y Escape cancela y devuelve el foco`, con el error «SweetAlert2 no cargó desde el CDN para la prueba real.» (`library.spec.js`, línea 39). El entorno de pruebas no tiene acceso al CDN. En un equipo con internet esa prueba debería pasar, pero **no se verificó**. Los 3 pendientes son llamadas a `pending(...)` de `script.spec.js` que se activan cuando SweetAlert2 no se puede cargar del CDN.

### Escenarios de carga asíncrona (Playwright)

| Versión | Resultado | Salida |
|---|---|---|
| `develop` | 35 comprobaciones, 34 coinciden | `salidas/escenarios-develop.txt` |
| Rama de esta PR | 35 comprobaciones, 34 coinciden | `salidas/escenarios-rama.txt` |
| Combinada | 35 comprobaciones, 34 coinciden | `salidas/escenarios-combinada.txt` |

La comprobación que no coincide es la misma en las tres: «ÉXITO». Todo lo esperado se cumple (origen red, 9 tarjetas, mensaje de éxito, sin botón, caché guardada, 1 pedido) salvo la condición «sin errores de consola»: hay 2 mensajes de consola por la verificación de integridad de los archivos de SweetAlert2, que en la prueba se reemplazan por archivos vacíos. No es un problema del código de la PR.

### Catálogo parcial (RC03) y reintentos por código HTTP (RC02)

| Prueba | `develop` | Rama | Combinada |
|---|---|---|---|
| Catálogo parcial, 12 comprobaciones (`salidas/rc03-*.txt`) | 12 de 12 | 12 de 12 | 12 de 12 |
| 500, 503 y 599 (3 pedidos) y 404 y 600 (1 pedido) en la página real (`salidas/rc02-*.txt`) | según lo esperado | según lo esperado | según lo esperado |

### CLS (Chromium con Playwright; red 1,6 Mbps / 150 ms, CPU 4× más lenta; 3 corridas por perfil, mediana)

| Perfil | `develop` | `develop` + #223 | Rama de esta PR | Combinada |
|---|---:|---:|---:|---:|
| Escritorio 1350×940 | 0,149 | 0 | 0,149 | 0 |
| Tablet 800×1024 | **0,462** | 0,140 | 0,003 | 0,003 |
| Móvil 390×844 | 0,666 | 0 | 0,666 | 0 |
| Ventana chica 1000×560 | 0,178 | 0 | 0,178 | 0 |
| Maximizada 1920×1080 | 0,077 | 0 | 0,077 | 0 |

Salidas: `salidas/cls-develop.txt`, `salidas/cls-angel.txt`, `salidas/cls-rama.txt` y `salidas/cls-combinada.txt`.

Esta PR sola corrige solo tablet. Escritorio, móvil y las ventanas chica y maximizada las corrige la PR #223. Con ambas, el CLS queda en 0 salvo tablet (0,003). Por eso conviene mergear primero #223.

## 3. Corrección de datos informados antes

- En una versión anterior de la documentación se informó que el CLS de tablet en `develop` era 0,003 y que la rama de Angel lo empeoraba (0,140). **Eso era incorrecto.** El valor de `develop` es 0,462, y la rama de Angel lo mejora a 0,140 sin llegar al 0,1 recomendado.
- Una primera repetición de estas pruebas dio resultados idénticos en las tres versiones porque el servidor de la primera versión seguía respondiendo para las demás. Se repitieron comprobando antes de cada corrida que el servidor entregaba el contenido correcto (presencia de `fetchpriority="high"` en `index.html` y de la regla de las ofertas en `components.css`).

## 4. Limitaciones

- Solo Chromium. No se probó en otros navegadores.
- Bootstrap se sirvió desde una copia local de la misma versión que usa `index.html` (5.3.8); los demás recursos del CDN se reemplazaron por archivos vacíos. La limitación de red y CPU es una aproximación a Lighthouse, no la reemplaza.
- No se midió cobertura de código.
- Los códigos HTTP 4xx y 5xx se simularon interceptando el pedido; no se probó contra un servidor real caído, ni el tiempo límite real de 8 s.
