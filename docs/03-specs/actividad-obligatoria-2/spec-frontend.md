# Spec: Generación de estilos desde mockup actualizado con Figma MCP

**Rol:** Desarrollador Frontend
**Se traza contra:** plan.md — RF1-RF3, RF6-RF8; RNF5-RNF13
**Entrega:** Actividad Obligatoria N°2 — FerroLab

## Qué se va a hacer

Se generarán los estilos visuales de la estructura HTML existente a partir del mockup actualizado por el Coordinador en Figma, utilizando el servidor MCP de Figma junto con GitHub Copilot en modo Agente. El resultado se organizará en `css/styles.css`, para las decisiones globales, y `css/components.css`, para los componentes reutilizables.

`css/styles.css` contendrá las variables CSS en `:root`, el reset, las tipografías, la paleta de colores, el box model base, el layout general y las reglas responsive necesarias. `css/components.css` contendrá los estilos de botones, cards, navegación, formularios y estados `hover` y `focus`. La implementación mantendrá separadas la estructura HTML, la presentación CSS y la futura lógica JavaScript.

El flujo de trabajo será: consultar el mockup mediante Figma MCP, extraer variables, tipografías, colores, espaciados y componentes, revisar el código generado contra el diseño, corregir manualmente las inconsistencias y coordinar la comprobación en localhost y GitHub Pages con el Especialista en Responsive.

## Por qué

Esta tarea incorpora la capa de presentación que necesita FerroLab para mostrar de forma clara el catálogo, la información de los productos, la navegación, la información comercial y el formulario de contacto. La correspondencia con `plan.md` es RF1-RF3 y RF6-RF8; la tarea también contribuye a la usabilidad, facilidad de navegación, mantenibilidad, legibilidad, separación de responsabilidades, escalabilidad, organización de archivos y compatibilidad indicadas en RNF5-RNF13.

El spec se documenta antes de crear los archivos CSS para establecer el alcance, conservar la trazabilidad del prompt utilizado y garantizar que el commit del spec preceda al commit de los estilos. La interactividad, los cálculos del carrito, la validación funcional y el procesamiento de pagos no forman parte de esta entrega.

## Criterios de aceptación

- [ ] Dado el repositorio con la estructura HTML de FerroLab, cuando se consulte el mockup actualizado mediante Figma MCP, entonces se identifican y registran las variables, tipografías, colores, espaciados y componentes necesarios para la implementación.
- [ ] Dado el spec preparado, cuando se cree el primer commit de la actividad, entonces este archivo queda commiteado antes que cualquier archivo CSS.
- [ ] Dado el diseño extraído del mockup, cuando se genere `css/styles.css`, entonces incluye variables CSS en `:root`, reset, tipografías, colores, layout base y reglas responsive sin duplicar innecesariamente valores globales.
- [ ] Dado el layout base, cuando se definan tamaños y separaciones, entonces `padding`, `margin`, `border`, `box-sizing` y dimensiones relevantes quedan controlados explícitamente según el box model.
- [ ] Dado el conjunto de componentes de la interfaz, cuando se genere `css/components.css`, entonces existen estilos reutilizables para botones, cards, navegación, formularios y estados `hover` y `focus`.
- [ ] Dado el HTML existente, cuando se apliquen los estilos, entonces los selectores, la herencia y la especificidad producen el resultado esperado sin depender de reglas frágiles o de `!important` innecesarios.
- [ ] Dado el contenido de la página, cuando se renderice, entonces los elementos de bloque y en línea se diferencian mediante reglas CSS apropiadas y el contenido permanece legible y sin solapamientos.
- [ ] Dado el código CSS, cuando se realice una revisión, entonces contiene comentarios breves que explican las decisiones de estilo no evidentes y mantiene una organización clara.
- [ ] Dado el sitio en localhost y GitHub Pages, cuando se realice la prueba de integración con el Especialista en Responsive, entonces las pantallas principales conservan una presentación consistente en los navegadores objetivo y en los tamaños acordados.
- [ ] Dado el cierre de la actividad, cuando se revise este documento, entonces incluye el prompt exacto utilizado con Figma MCP, el resultado obtenido y los ajustes manuales realizados.

## Prompt utilizado con Figma MCP

> Completar al ejecutar el flujo con el enlace del archivo Figma actualizado por el Coordinador. Conservar aquí el texto exacto enviado a GitHub Copilot en modo Agente, incluyendo el enlace o la referencia al archivo consultado.

Prompt base previsto:

> Analiza el archivo Figma actualizado de FerroLab y genera únicamente los estilos CSS necesarios para la estructura HTML existente. Extrae y documenta las variables CSS, tipografías, colores, espaciados, tamaños, bordes, sombras, breakpoints y estados visuales definidos en el diseño. Crea `css/styles.css` con las variables en `:root`, reset, tipografías, colores, box model y layout base; crea `css/components.css` con botones, cards, navegación, formularios y estados `hover` y `focus`. Usa selectores, herencia y especificidad de forma correcta; diferencia elementos de bloque y en línea cuando corresponda; evita `!important` salvo justificación; añade comentarios breves para decisiones no evidentes. No implementes JavaScript ni inventes componentes que no estén en el mockup. Compara los estilos con el HTML del repositorio y señala cualquier dato del diseño que no pueda determinarse con precisión.

## Resultado obtenido

Completar al cierre con la salida revisada de Figma MCP y la relación de estilos generados en `css/styles.css` y `css/components.css`. Registrar también las diferencias detectadas entre el resultado inicial y el mockup actualizado.

## Ajustes manuales realizados

Completar al cierre con cada corrección aplicada después de revisar el resultado de Figma MCP, indicando el archivo afectado y el motivo del ajuste. Incluir, como mínimo, las correcciones de colores, tipografías, espaciados, dimensiones, estados, especificidad o responsive que hayan sido necesarias.

## Evidencia de cierre

- Commit del presente spec anterior a los commits de `css/styles.css` y `css/components.css`: `[completar hash o enlace]`.
- Enlace al archivo Figma actualizado por el Coordinador: `[completar]`.
- Prompt exacto utilizado con Figma MCP: documentado en la sección anterior.
- Resultado obtenido: documentado en la sección anterior.
- Ajustes manuales: documentados en la sección anterior.
- Prueba en localhost: `[completar fecha, viewport y resultado]`.
- Prueba en GitHub Pages: `[completar URL, viewport y resultado]`.
