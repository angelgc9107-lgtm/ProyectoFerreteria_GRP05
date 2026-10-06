# Spec: Implementación de Componentes Avanzados Bootstrap

**Rol:** Especialista en Componentes Bootstrap

**Entrega:** Primer Parcial — FerroLab

## Qué se va a hacer

Se implementarán al menos dos componentes avanzados de Bootstrap dentro del sitio web de FerroLab, integrándolos con la estructura existente del proyecto y con la migración a Bootstrap realizada por el Desarrollador Frontend/Bootstrap.

Los componentes seleccionados serán:

- Componente Bootstrap 1:

**Dropdown**

**Ubicación dentro del sitio:** Opción "Categorías" de la navegación principal.

**Justificación:** Se utilizará el componente Dropdown de Bootstrap para
reemplazar el menú desplegable de categorías actualmente implementado mediante
los elementos HTML `details` y `summary`. El componente permitirá mantener las
categorías existentes utilizando un componente avanzado de Bootstrap y
conservando la identidad visual definida para la navegación de FerroLab.


- Componente Bootstrap 2: 

**Offcanvas** 

**Ubicación dentro del sitio:** Carrito de compras.

**Justificación:** Se utilizará el componente Offcanvas de Bootstrap para
implementar el panel lateral del carrito de compras. El proyecto ya cuenta con
un carrito diseñado visualmente como un panel lateral, por lo que este
componente permite adaptar la estructura existente a Bootstrap manteniendo
los productos, cantidades, subtotales y total representativo actualmente
definidos.


Los componentes serán personalizados mediante `css/bootstrap-overrides.css` para mantener la identidad visual del proyecto y la coherencia con los estilos existentes.

La implementación se realizará coordinadamente con el Desarrollador Frontend/Bootstrap para evitar conflictos con la instalación de Bootstrap, el sistema de columnas y los estilos generales de la migración.

Cada componente será validado mediante Playwright MCP contra `http://localhost:3000`, comprobando su funcionamiento e integración en los dispositivos requeridos.

Los resultados se documentarán en:

- `docs/04-testing/test-case-7.md`
- `docs/04-testing/test-case-8.md`

Por cada hallazgo relevante detectado durante las pruebas se creará un issue tipo bug utilizando GitHub MCP desde Copilot Agent Mode.

Las correcciones necesarias se realizarán posteriormente mediante ramas `fix/` contra `develop` y serán documentadas en `[Fixed]` dentro de `changelog.md`.

## Por qué

La implementación de componentes avanzados de Bootstrap permite incorporar componentes reutilizables y funcionales manteniendo una integración coherente con la migración general del proyecto a Bootstrap.

La personalización mediante `bootstrap-overrides.css` permitirá adaptar los componentes seleccionados a la identidad visual de FerroLab sin modificar directamente los archivos originales de Bootstrap.

Las pruebas mediante Playwright MCP permitirán comprobar el funcionamiento de cada componente en distintos dispositivos y detectar posibles problemas de integración, visualización o interacción.

## Criterios de aceptación

- [X] El archivo `spec-componentes-bootstrap.md` fue creado y commiteado antes de implementar componentes Bootstrap.

- [X] Se seleccionaron al menos dos componentes avanzados de Bootstrap y se justificó su utilización.

- [ ] El primer componente Bootstrap fue implementado correctamente.

- [ ] El segundo componente Bootstrap fue implementado correctamente.

- [ ] Los componentes mantienen coherencia con la estructura existente de `index.html`.

- [ ] Los componentes fueron personalizados mediante `css/bootstrap-overrides.css`.

- [ ] La implementación mantiene coherencia visual con los estilos existentes del proyecto.

- [ ] La implementación fue coordinada con los cambios realizados por el Desarrollador Frontend/Bootstrap.

- [ ] Cada componente funciona correctamente en los dispositivos requeridos.

- [ ] El componente 1 fue probado mediante Playwright MCP y documentado en `docs/04-testing/test-case-7.md`.

- [ ] El componente 2 fue probado mediante Playwright MCP y documentado en `docs/04-testing/test-case-8.md`.

- [ ] Las pruebas fueron realizadas en iPhone 14 Pro (iOS Safari).

- [ ] Las pruebas fueron realizadas en Samsung Galaxy S23 (Chrome Android).

- [ ] Las pruebas fueron realizadas en iPad Air (iOS Safari).

- [ ] Por cada hallazgo relevante se creó un issue tipo bug mediante GitHub MCP desde Copilot Agent Mode.

- [X] Los issues encontrados fueron corregidos mediante ramas `fix/` contra `develop`.

- [ ] Las correcciones fueron documentadas en `[Fixed]` dentro de `changelog.md`.

- [ ] Al finalizar la tarea, este spec contiene los prompts utilizados, resultados obtenidos, ajustes manuales y hallazgos de las pruebas.


## Plan de testing con Playwright MCP

Cada componente será probado mediante Playwright MCP utilizando el sitio ejecutado en:

`http://localhost:3000`

Se verificará:

- Correcta visualización del componente.
- Funcionamiento de sus elementos interactivos.
- Integración con la estructura existente.
- Coherencia con los estilos del proyecto.
- Funcionamiento en diferentes dispositivos.
- Ausencia de solapamientos o problemas de visualización.
- Comportamiento esperado de los estados interactivos correspondientes.

Los dispositivos obligatorios serán:

- iPhone 14 Pro (iOS Safari).
- Samsung Galaxy S23 (Chrome Android).
- iPad Air (iOS Safari).

El componente 1 será documentado en:

`docs/04-testing/test-case-7.md`

El componente 2 será documentado en:

`docs/04-testing/test-case-8.md`

## Prompt utilizado con Copilot Agent Mode



## Resultado obtenido del prompt



## Ajustes manuales realizados



## Pruebas realizadas con Playwright MCP


### Test Case 7 — Componente Bootstrap 1



### Test Case 8 — Componente Bootstrap 2



## Hallazgos detectados



## Issues creadas mediante GitHub MCP



## Correcciones realizadas



## Evidencia de cierre

**1° Commit:**


**Commit de implementación:**


**Pull Request:**


**Issues vinculadas:**


**Archivos modificados:**

