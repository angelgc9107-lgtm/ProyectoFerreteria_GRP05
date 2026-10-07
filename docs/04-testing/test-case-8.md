
test-case-8.md

100 %
# Test Case 8 — Componente Bootstrap 2

## Metadata

| Campo | Valor |
|-------|-------|
| Responsable | Copilot Agent Mode |
| Fecha de ejecución | 2026-10-06 |
| Rama testeada | `feature/esp-com-bootstrap-add-component` |
| URL testeada | `http://localhost:3000` |

## Componente testeado

| Campo | Descripción |
|-------|-------------|
| **Nombre del componente** | Offcanvas del carrito de compras |
| **Selector / ID en el HTML** | `#carrito` |
| **Sección de la página** | Carrito de compras — panel lateral accesible desde el encabezado |
| **Comportamiento esperado** | Al hacer clic en el botón "Carrito", debe abrirse desde el lateral derecho el Offcanvas con el contenido del carrito. Debe mostrarse el backdrop de Bootstrap y permitir el cierre mediante el botón de cierre, la tecla Escape y los mecanismos oficiales de Bootstrap. El componente debe conservar el contenido y la identidad visual de FerroLab y funcionar correctamente en desktop, tablet y mobile. |

---

## Objetivo
Verificar que el segundo componente Bootstrap implementado funciona correctamente,
responde a las interacciones del usuario, se adapta a distintos viewports
y mantiene la identidad visual definida en bootstrap-overrides.css.

## Herramientas utilizadas
- Playwright MCP (`@playwright/mcp`) con viewport emulation e interacción de UI
- GitHub Copilot Agent Mode
- GitHub MCP (`@modelcontextprotocol/server-github`) para registrar issues

---

## Prompt para Copilot Agent Mode

> **Antes de copiar el prompt:** reemplazá `[COMPONENTE]` con el nombre del componente
> y `[SELECTOR]` con el selector CSS o ID del elemento en el HTML.

```
Usando Playwright MCP, necesito testear el componente Bootstrap [Offcanvas del carrito de compras]
en http://localhost:3000.

Ejecutá estos pasos en orden:

1. Navegá a http://localhost:3000 con viewport 1280x800 (desktop)
   - Localizá el elemento [#carrito] en la página
   - Tomá captura del componente en su estado inicial
   - Interactuá con el componente según su tipo:
     · Si es un modal: hacé click en el botón que lo abre y verificá que se abre correctamente
     · Si es un navbar/collapse: hacé click en el toggler y verificá que se despliega
     · Si es un carrusel: avanzá y retrocedé slides, verificá transiciones
     · Si es un accordion: abrí y cerrá secciones, verificá que solo una esté activa
     · Si es un dropdown: hacé click y verificá que el menú aparece correctamente
     · Si es un offcanvas: activá y cerrá, verificá overlay
   - Tomá captura del componente en estado activo/expandido
   - Verificá que los estilos de bootstrap-overrides.css se aplican

2. Cambiá el viewport a 390x844 (iPhone 14 Pro — mobile)
   - Verificá que el componente se adapta correctamente
   - Repetí la interacción y tomá capturas
   - Verificá si hay diferencias respecto al desktop

3. Cambiá el viewport a 768x1024 (iPad — tablet)
   - Verificá comportamiento intermedio
   - Tomá captura

4. Reportá para cada viewport:
   - Si el componente es visible y funcional
   - Si las animaciones/transiciones funcionan
   - Si la identidad visual se mantiene (colores, tipografías de overrides)
   - Cualquier problema visual o de comportamiento

Guardá las capturas en docs/04-testing/capturas/tc-8/
```

---

## Dispositivos testeados
| Viewport | Componente visible | Interacción funcional | Estilos override | Estado |
|----------|-------------------|----------------------|------------------|--------|
| 1280×800 (desktop) | Sí | Sí — abre y cierra | Sí — colores y tipografía verificados | Aprobado |
| 390×844 (mobile) | Sí | Sí — abre y cierra | Sí — colores y tipografía verificados | Aprobado |
| 768×1024 (tablet) | Sí | Sí — abre y cierra | Sí — colores verificados | Aprobado |

### Resultados observados

- **Componente:** Offcanvas del carrito de compras.
- **Selector utilizado:** `#carrito`.
- **Desktop (1280×800):** inicialmente oculto; abrió desde la derecha al activar el botón del carrito. El panel midió 448 px de ancho (35%). Cerró mediante el botón de cierre y también se comprobó Escape en otra interacción.
- **Mobile (390×844):** inicialmente oculto; abrió a ancho completo (390 px). El contenido quedó dentro del panel y no se observó overflow. Cerró mediante el botón de cierre.
- **Tablet (768×1024):** inicialmente oculto; abrió desde la derecha con ancho aproximado de 461 px (60%). No se observó overflow horizontal. Cerró mediante Escape y se verificó la devolución del foco al botón de apertura.
- **Backdrop/overlay:** en los tres viewports Bootstrap creó un único `.offcanvas-backdrop` con opacidad computada `0.5`. Se verificó el cierre al hacer clic en el backdrop en tablet; desaparecieron el panel y el backdrop. También se comprobó que el backdrop desaparece al cerrar mediante botón o Escape.
- **Animaciones/transiciones:** la transición del panel fue `transform 0.3s ease-in-out`; la del backdrop fue `0.15s`.
- **Estilos de `bootstrap-overrides.css`:** se computó el fondo del panel en `rgb(201, 54, 43)`, texto blanco, borde rojo `rgb(199, 55, 43)` y cabecera `rgb(166, 45, 35)`. La tipografía del título fue `Inter, Arial, Helvetica, sans-serif`. Se verificaron los anchos responsivos configurados: 35% desktop, 100% mobile y 60% tablet.
- **Contenido conservado y visible:** dos productos (Amoladora y Martillo), cantidades `1` y `1`, precios unitarios `$50.000` y `$16.000`, subtotales representativos `$50.000` y `$16.000`, resumen de `$66.000` sin envío, `$75.000` con envío y total `$75.000`; también se encontró el botón “Iniciar compra”.
- **Problemas observados:** no se registraron problemas visuales ni funcionales durante la ejecución. La consola no mostró errores.

## Capturas de pantalla
| Viewport / Estado | Captura | Estado |
|-------------------|---------|--------|
| Desktop — estado inicial | ![](capturas/tc-8/desktop-inicial.png) | Capturada |
| Desktop — estado abierto | ![](capturas/tc-8/desktop-abierto.png) | Capturada |
| Desktop — backdrop visible | ![](capturas/tc-8/desktop-overlay.png) | Capturada |
| Mobile — estado inicial | ![](capturas/tc-8/mobile-inicial.png) | Capturada |
| Mobile — estado abierto | ![](capturas/tc-8/mobile-abierto.png) | Capturada |
| Mobile — backdrop visible | ![](capturas/tc-8/mobile-overlay.png) | Capturada |
| Tablet — estado inicial | ![](capturas/tc-8/tablet-inicial.png) | Capturada |
| Tablet — estado abierto | ![](capturas/tc-8/tablet-abierto.png) | Capturada |
| Tablet — backdrop visible | ![](capturas/tc-8/tablet-overlay.png) | Capturada |

## Hallazgos
| # | Viewport | Descripción del problema | Comportamiento esperado | Comportamiento observado | Severidad |
|---|----------|--------------------------|-------------------------|--------------------------|-----------|
| — | — | No se observaron problemas visuales ni funcionales | El Offcanvas abre/cierra, integra el backdrop y conserva el contenido y los estilos en los viewports probados | Comportamiento verificado en desktop, mobile y tablet | — |

### Severidad
- **Alta** — Componente no funciona o no se renderiza
- **Media** — Problema visual o de interacción significativo
- **Baja** — Detalle estético menor

## Issues creados
| Issue | Viewport | Descripción | Severidad | Estado |
|-------|----------|-------------|-----------|--------|
| No creado | — | No se detectaron hallazgos que requieran registrar un issue | — | No aplica |

## Conclusión general
**Resultado final:** APROBADO

El Offcanvas del carrito funcionó en los tres viewports probados. La apertura desde la derecha, el cierre con botón, Escape y backdrop, el overlay oficial, las transiciones y los estilos verificados se comportaron como se esperaba. No se observaron problemas durante la ejecución ni se registraron issues.
Mostrando test-case-8.md.