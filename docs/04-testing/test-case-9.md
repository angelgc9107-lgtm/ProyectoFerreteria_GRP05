# Test Case 9 — Iframe de Google Maps

**Componente:** Iframe de Google Maps embebido en la sección "Ubicacion"
del footer (`#direccion`).

**Herramienta:** Playwright MCP, con emulación de viewport.

**Dispositivos obligatorios:** iPhone 14 Pro (390×844), Samsung Galaxy S23
(412×915), iPad Air (820×1180).

## Prompt utilizado

```
Actuá como QA tester usando Playwright MCP. Necesito que pruebes el
iframe de Google Maps embebido en la sección "Ubicacion" del footer
(id="direccion") de mi sitio, corriendo en http://localhost:3000.

Ejecutá las pruebas en 3 viewports: iPhone 14 Pro (390x844), Samsung
Galaxy S23 (412x915), iPad Air (820x1180).

Para cada dispositivo verificá:
- Que el iframe se vea completo, sin overflow horizontal.
- Que cargue correctamente (sin error 404 ni pantalla en blanco).
- Tomá una captura de pantalla del componente en cada dispositivo.
```

## Resultados

| Dispositivo / viewport | Resultado |
|---|---|
| iPhone 14 Pro · 390×844 | OK. Iframe completo dentro del ancho disponible; cargó contenido del mapa, con solicitudes de Maps y teselas respondidas con HTTP 200. Sin overflow horizontal. |
| Samsung Galaxy S23 · 412×915 | OK. Iframe completo y cargado; sin overflow horizontal. |
| iPad Air · 820×1180 | OK. Iframe completo y cargado; sin overflow horizontal. |
| Verificación del link "Ver mapa más grande" | Se hizo clic en el link dentro del iframe embebido y se confirmó que abre la ficha específica de "Ferretería JYJ" en Google Maps (vía CID), no una búsqueda genérica por nombre. |

**Resultado general:** ✅ Aprobado en los tres viewports. No se detectó
overflow horizontal; el mapa cargó correctamente con contenido y controles
en todos los dispositivos probados.

## Observaciones

- No se detectaron errores 404 del iframe ni pantalla en blanco: el frame
  de Google Maps cargó texto, controles e imágenes; las solicitudes de
  mapa respondieron con HTTP 200.
- La consola registró un 404 ajeno al componente (`favicon.ico` del
  sitio), fuera del alcance de este test case.
- La emulación se realizó fijando los viewports indicados, sin configurar
  perfiles físicos de dispositivo (user-agent, densidad de píxeles,
  eventos táctiles).

## Momento de ejecución

Momento 1 — testing sobre la rama `feature/dev-comp-html-avanzados-add-components`,
previo al merge a `develop`.

## Issues generados

No se detectaron hallazgos para este componente. No se generaron issues.