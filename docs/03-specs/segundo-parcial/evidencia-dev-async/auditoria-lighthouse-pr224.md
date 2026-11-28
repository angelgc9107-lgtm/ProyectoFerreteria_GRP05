# Auditoría Lighthouse de la PR #224 (rendimiento, issue #212)

**Rol:** Desarrollador JS Asíncrono (Fetch & APIs) · **Autor original:** Alan Díaz · **Continuación y auditoría final:** Thiago Piastrellini (@Piastrellini) · **Fecha:** 27/11/2026

Este documento responde al hallazgo RC01 de la revisión técnica de la PR #224. Registra la auditoría inicial (rama sola) y la auditoría final sobre el commit que queda en `develop`: esta PR combinada con la PR #223 (CLS).

## 1. Auditoría 1: rama de esta PR sola (sin #223)

Realizada por Alan Díaz el 27/11/2026, alrededor de las 15:01, con Lighthouse en Chrome DevTools, sobre la rama `fix/lighthouse-rendimiento-fetch` sin la corrección de CLS de la PR #223.

| Categoría | Resultado |
|---|---:|
| Performance | 86 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |

El commit, las versiones, el servidor, el tamaño de ventana y las métricas de esta corrida **no se registraron**. Se conserva solo como antecedente: no incluía la reserva de altura de la #223 (en esa versión el CLS de escritorio era ~0,15) ni las imágenes en WebP. No se usa para la comparación.

## 2. Auditoría 2: versión final (esta PR + PR #223)

| Dato | Valor |
|---|---|
| Commit auditado | [`d2ca89d`](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/commit/d2ca89d): `fix/lighthouse-rendimiento-fetch` con `develop` mergeado, que ya incluye la PR #223 |
| Cambios de código respecto de `develop` | Imágenes de bienvenida en WebP (`bienvenido1.webp` 57 KB y `bienvenido2.webp` 47 KB, antes 404 KB y 365 KB en PNG), `fetchpriority="high"` y `width`/`height` en esas imágenes, `loading="lazy"` en el listado. Se quitó la reserva de tablet de 600 px de esta PR porque duplicaba la de 615 px de la #223 y, al estar más abajo en el archivo, la pisaba |
| Herramienta | Lighthouse en Chrome DevTools · versión de Lighthouse y de Chrome en `lighthouse/09-runtime-settings.png` |
| Modo y dispositivo | Navigation · Desktop |
| Servidor | `npx http-server -p 8000` (caché por defecto de 3600 s, igual que TC-13) · URL `http://127.0.0.1:8000/` |
| Navegador | Ventana de incógnito maximizada |
| Fecha y hora | 27/11/2026, corridas a las 23:01, 23:03 y 23:04 (hora de Argentina) |

### Resultados (3 corridas)

| Indicador | Corrida 1 | Corrida 2 | Corrida 3 |
|---|---:|---:|---:|
| Performance | **100** | **100** | **100** |
| Accessibility | 100 | 100 | 100 |
| Best Practices | 100 | 100 | 100 |
| SEO | 100 | 100 | 100 |
| FCP | 0,6 s | 0,5 s | 0,5 s |
| LCP | 0,7 s | 0,7 s | 0,7 s |
| TBT | 0 ms | 0 ms | 0 ms |
| CLS | 0 | 0 | 0 |
| Speed Index | 0,6 s | 0,5 s | 0,5 s |

### Corrida en modo Mobile (complementaria)

Antes de las corridas Desktop se ejecutó una por error en modo **Mobile** (red y CPU limitadas): Performance 87, Accessibility 100, Best Practices 100, SEO 100; FCP 2,0 s, LCP 3,8 s, TBT 0 ms, CLS 0, Speed Index 2,0 s. No es comparable con TC-11 a TC-13 (Desktop), pero se conserva como dato: en Mobile el CLS también queda en 0 y lo que más pesa es el LCP.

## 3. Comparación con las auditorías anteriores

| Indicador | TC-11 Baseline | TC-12 Post Fetch | TC-13 Post Library (ventana maximizada) | Final (esta PR + #223) |
|---|---:|---:|---:|---:|
| Performance | 92 | 86 | 96 | **100** |
| Accessibility | 100 | 100 | 100 | 100 |
| Best Practices | 77 | 77 | 100 | 100 |
| SEO | 100 | 100 | 100 | 100 |
| FCP | 0,5 s | 0,5 s | 0,5 s | 0,5–0,6 s |
| LCP | 1,1 s | 1,2 s | 1,2 s | **0,7 s** |
| TBT | 0 ms | 0 ms | 0 ms | 0 ms |
| CLS | 0,148 | 0,230 | 0,075 | **0** |
| Speed Index | 0,5 s | 0,5 s | 0,5 s | 0,5–0,6 s |

**Limitaciones de comparabilidad:** TC-11 y TC-12 se hicieron con Lighthouse 13.5.0 y Chromium 158; TC-13 con Lighthouse 13.3.0 y Chromium 150, en otros equipos. Las condiciones de red y caché de las anteriores no quedaron registradas por completo. Las diferencias de FCP y Speed Index (±0,1 s) están dentro de la variación normal entre corridas.

## 4. Interpretación

- **Se cumple el criterio de la issue #212 (Performance ≥ 95)** en las tres corridas Desktop sobre el commit final, con las demás categorías en 100.
- **CLS 0:** lo aporta la reserva de altura de `#ofertas-productos` de la PR #223 (308 / 615 / 915 px según la cantidad de columnas).
- **LCP de 1,2 s a 0,7 s:** el elemento LCP es la imagen de bienvenida. El cambio a WebP reduce su peso de 404 KB a 57 KB, y `fetchpriority="high"` adelanta su descarga.
- **Best Practices 100:** corrección de la PR #221 (issue #214, Google Maps a pedido), ya presente en `develop`.
- Quedan como propuestas no aplicadas (no necesarias para el criterio): minificación, carga a pedido de SweetAlert2 y caché del servidor.

## 5. Evidencias

Ubicación: `docs/03-specs/segundo-parcial/evidencia-dev-async/lighthouse/`

- `01-desktop-corrida1-puntajes.png` y `02-desktop-corrida1-metricas.png`
- `03-desktop-corrida2-puntajes.png` y `04-desktop-corrida2-metricas.png`
- `05-desktop-corrida3-puntajes.png` y `06-desktop-corrida3-metricas.png`
- `07-mobile-puntajes.png` y `08-mobile-metricas.png` (corrida complementaria en Mobile)
- `09-runtime-settings.png` (versiones y condiciones de la corrida 1)

La verificación final sobre `develop`, una vez mergeada esta PR, queda a cargo del Tester QA/JS según el criterio de cierre de la issue #212.
