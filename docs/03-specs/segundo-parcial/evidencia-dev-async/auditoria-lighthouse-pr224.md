# Auditoría Lighthouse de la PR #224 (rendimiento, issue #212)

**Rol:** Desarrollador JS Asíncrono (Fetch & APIs) · **Responsable de la ejecución:** Alan Díaz · **Fecha:** 27/11/2026

Este documento responde al hallazgo RC01 de la revisión técnica de la PR #224. Registra una primera auditoría sobre la rama de esta PR **sola** y deja marcado lo que falta completar. La issue #212 **sigue abierta**: el criterio de cierre es Performance ≥ 95 verificado con una auditoría sobre `develop` actualizado, que corresponde al Tester QA/JS.

## 1. Auditoría 1: rama de esta PR sola (sin #213)

**Alcance:** rama `fix/lighthouse-rendimiento-fetch` sola, sin la rama `fix/layout-shift-cls` de Angel (#213). No incluye su reserva de espacio para `#ofertas-productos`.

| Dato | Valor |
|---|---|
| Fecha y hora | 27/11/2026, alrededor de las 15:01 (hora de Argentina) |
| Herramienta | Lighthouse en Chrome DevTools |
| Commit auditado | `<completar: git rev-parse --short HEAD de la rama al momento de la auditoría>` |
| Chrome y versión de Lighthouse | `<completar: se ven al final del reporte, en «Runtime settings»>` |
| Servidor | `<completar: Live Server, http-server u otro, y puerto>` |
| Modo y dispositivo | `<completar: Navigation / Desktop u otro>` |
| Tamaño de la ventana | `<completar: maximizada o reducida>` |
| Limitación de red y CPU | `<completar: según «Runtime settings»>` |

### Resultados

| Categoría o métrica | Auditoría 1 (esta rama sola) |
|---|---|
| Performance | **86** |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |
| FCP | `<completar>` |
| LCP | `<completar>` |
| TBT | `<completar>` |
| CLS | `<completar>` |
| Speed Index | `<completar>` |

Evidencia: captura del puntaje (Captura de pantalla 2026-11-27 15:01). Falta adjuntar la captura de las métricas y la de «Runtime settings».

## 2. Comparación con las auditorías anteriores

Valores tomados de la issue #212 (TC-11, TC-12, TC-13). Las condiciones no son idénticas: TC-11 y TC-12 se hicieron con Lighthouse 13.5.0 y Chromium 158; el TC-13 (segunda ejecución) con Lighthouse 13.3.0, Chromium 150, servidor `http-server` con caché de 3600 s y ventana maximizada. Las condiciones de red y caché de las anteriores no quedaron completamente registradas.

| Indicador | TC-11 Baseline | TC-12 Post Fetch | TC-13 Post Library (ventana maximizada) | TC-13 (ventana reducida) | Auditoría 1 (esta rama sola) |
|---|---:|---:|---:|---:|---:|
| Performance | 92 | 86 | 96 | 75 | 86 |
| FCP | 0,5 s | 0,5 s | 0,5 s | 0,5 s | `<completar>` |
| LCP | 1,1 s | 1,2 s | 1,2 s | 1,4 s | `<completar>` |
| TBT | 0 ms | 0 ms | 0 ms | 0 ms | `<completar>` |
| CLS | 0,148 | 0,230 | 0,075 | 0,555 | `<completar>` |
| Speed Index | 0,5 s | 0,5 s | 0,5 s | 0,5 s | `<completar>` |

## 3. Interpretación

- **No se cumple el criterio de cierre.** 86 está por debajo de 95. No se afirma que esta PR cumpla la issue #212.
- **No se atribuye una causa** hasta tener las métricas de la auditoría. Como dato de contexto, la simulación en Chromium con red y CPU limitadas (no es Lighthouse) da para esta rama sola el mismo CLS en escritorio que `develop` (0,149): la reserva de espacio de escritorio y móvil la aporta la PR #223, que esta auditoría no incluía. Es una hipótesis para contrastar con el CLS real de la auditoría, no una conclusión.
- Lo que sí cambia esta PR: la corrección de CLS en tablet (768 a 991 px), la prioridad y las dimensiones de la imagen LCP y la carga diferida de las imágenes del listado. Una auditoría de escritorio no mide el efecto en tablet.
- Quedan sin aplicar las propuestas de `PROPUESTAS-RENDIMIENTO.md` (imágenes a WebP, minificación, SweetAlert2 a pedido y caché). La de mayor peso es la de imágenes (862 KiB según TC-13). No se convierten imágenes sin confirmación del integrante.

## 4. Auditoría 2 pendiente: rama + PR #223 combinadas

Debe repetirse con las dos correcciones juntas, que es lo que quedará en `develop`:

1. Crear una rama local de prueba a partir de esta rama y mergear la de Angel (sin publicar):
   ```
   git checkout fix/lighthouse-rendimiento-fetch
   git checkout -b prueba-lighthouse
   git fetch origin fix/layout-shift-cls
   git merge origin/fix/layout-shift-cls
   ```
2. Servir el proyecto, abrir en una ventana de incógnito, y ejecutar Lighthouse con las mismas opciones que la auditoría 1 (o con las del Tester, y anotar cuáles).
3. Registrar en la tabla de abajo el commit (`git rev-parse --short HEAD`), las versiones, el servidor, el tamaño de la ventana y las métricas. Repetir al menos 3 veces y anotar todas las corridas.

| Dato | Auditoría 2 (combinada) |
|---|---|
| Commit | `<completar>` |
| Chrome / Lighthouse | `<completar>` |
| Servidor y ventana | `<completar>` |
| Performance (corridas 1, 2, 3) | `<completar>` |
| FCP / LCP / TBT / CLS / Speed Index | `<completar>` |

La verificación final del criterio de cierre sobre `develop` actualizado le corresponde al Tester QA/JS, después del merge de #223 y de esta PR.
