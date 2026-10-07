# Test Case 10 — Input range (filtro de precio)

**Componente:** Input range de filtro de precio en el sidebar del catálogo
(`#precio-hasta`), con valor en vivo mostrado en `<output id="precio-hasta-valor">`.

**Herramienta:** Playwright MCP, con emulación de viewport.

**Dispositivos obligatorios:** iPhone 14 Pro (390×844), Samsung Galaxy S23
(412×915), iPad Air (820×1180).

## Prompt utilizado

```
Actuá como QA tester usando Playwright MCP. Necesito que pruebes el input
range de filtro de precio en el sidebar del catálogo (id="precio-hasta")
de mi sitio, corriendo en http://localhost:3000, verificando que el valor
mostrado en el elemento <output id="precio-hasta-valor"> se actualice
correctamente al mover el slider.

Ejecutá las pruebas en 3 viewports: iPhone 14 Pro (390x844), Samsung
Galaxy S23 (412x915), iPad Air (820x1180).

Para cada dispositivo verificá:
- Que el componente se vea completo, sin overflow horizontal.
- Que el input range sea interactuable (se pueda arrastrar/hacer click) y
  que el valor del <output> cambie al mover el slider.
- Tomá una captura de pantalla del componente en cada dispositivo.
```

## Resultados

| Dispositivo / viewport | Resultado |
|---|---|
| iPhone 14 Pro · 390×844 | OK. Al hacer clic en el slider, el valor pasó de $15.000 a $40.000; el `<output>` coincidió con el valor seleccionado. Sin overflow horizontal. |
| Samsung Galaxy S23 · 412×915 | OK. El clic cambió el valor a $18.000; al arrastrar el slider, cambió a $62.000 y el `<output>` mostró $62.000. Sin overflow horizontal. |
| iPad Air · 820×1180 | OK. Al hacer clic, el valor quedó en $40.000 y el `<output>` coincidió. Sin overflow horizontal. |

**Resultado general:** ✅ Aprobado en los tres viewports. El slider
respondió correctamente a interacciones por clic y arrastre, y el valor
mostrado en el `<output>` se mantuvo siempre sincronizado con la posición
del control.

## Observaciones

- La emulación se realizó fijando los viewports indicados, sin configurar
  perfiles físicos de dispositivo (user-agent, densidad de píxeles,
  eventos táctiles).
- No se probó la interacción táctil real (touch events) por fuera de la
  emulación de viewport, ya que Playwright MCP no configuró ese perfil en
  esta corrida.

## Momento de ejecución

Momento 1 — testing sobre la rama `feature/dev-comp-html-avanzados-add-components`,
previo al merge a `develop`.

## Issues generados

No se detectaron hallazgos para este componente. No se generaron issues.
