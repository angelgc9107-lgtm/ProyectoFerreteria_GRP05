# Spec: Generación de estilos desde mockup actualizado con Figma MCP

**Rol:** Desarrollador Frontend

**Se traza contra:** plan.md — RF1-RF3, RF6-RF8; RNF5-RNF13

**Entrega:** Actividad Obligatoria N°2 — FerroLab

## Qué se va a hacer

Se generarán los estilos visuales de la estructura HTML existente a partir del mockup actualizado por el Coordinador en Figma, utilizando el servidor MCP de Figma junto con GitHub Copilot en modo Agente. El resultado se organizará en `css/styles.css`, para los estilos globales y estructurales, y `css/components.css`, para los componentes reutilizables.

`css/styles.css` contendrá variables CSS en `:root`, reset, tipografías, colores, espaciados, box model y layout base. `css/components.css` contendrá los estilos de botones, cards, navegación, formularios y estados visuales como `hover` y `focus`.

El flujo de trabajo será consultar el mockup mediante Figma MCP, extraer variables, tipografías, colores, espaciados, dimensiones y componentes, generar los estilos, compararlos con el diseño y corregir manualmente las inconsistencias detectadas.

La implementación mantendrá separadas la estructura HTML, la presentación CSS y la futura lógica JavaScript.

## Por qué

Esta tarea incorpora la capa de presentación necesaria para mostrar de forma clara el catálogo, los productos, la navegación, la información comercial y el formulario de contacto de FerroLab.

La correspondencia con `plan.md` es RF1-RF3 y RF6-RF8; también contribuye a la usabilidad, mantenibilidad, legibilidad, separación de responsabilidades, organización de archivos y compatibilidad indicadas en RNF5-RNF13.

La interactividad, JavaScript, cálculos del carrito, validación funcional, procesamiento de pagos y Responsive Design no forman parte del alcance de este rol.

## Criterios de aceptación

- [ ] Dado el mockup actualizado, cuando se consulte mediante Figma MCP, entonces se identifican las variables, tipografías, colores, espaciados, dimensiones y componentes necesarios.

- [X] Dado el spec preparado, cuando se cree el primer commit de la actividad, entonces este archivo queda commiteado antes que cualquier archivo CSS.

- [ ] Dado el diseño extraído, cuando se genere `css/styles.css`, entonces incluye variables CSS en `:root`, reset, tipografías, colores, box model y layout base.

- [ ] Dado el layout base, cuando se definan tamaños y separaciones, entonces `padding`, `margin`, `border`, `box-sizing` y dimensiones relevantes quedan controlados según el box model.

- [ ] Dado el conjunto de componentes, cuando se genere `css/components.css`, entonces existen estilos reutilizables para botones, cards, navegación, formularios y estados `hover` y `focus`.

- [ ] Dado el HTML existente, cuando se apliquen los estilos, entonces los selectores, herencia y especificidad producen el resultado esperado sin utilizar reglas frágiles o `!important` innecesarios.

- [ ] Dado el contenido de la página, cuando se renderice, entonces los elementos de bloque y en línea se diferencian correctamente y el contenido permanece legible y sin solapamientos.

- [ ] Dado el código CSS, cuando se revise, entonces mantiene una organización clara y contiene comentarios breves para decisiones de estilo no evidentes.

- [ ] Dado el sitio ejecutado en localhost y GitHub Pages, cuando se realice la comprobación visual, entonces los estilos mantienen las proporciones, colores, tipografías y espaciados definidos en el mockup.

- [ ] Dado el cierre de la actividad, cuando se revise este documento, entonces incluye el prompt utilizado, el resultado obtenido y los ajustes manuales realizados.

## Prompt utilizado para con Copilot para extraer todos los estilos
```
Necesito que te pongas en rol de un especialista de prompt y
generes un prompt limpio para extraer todos los estilos del enlace al servidor
de Figma que esta conectado por MCP, tene en cuenta los siguientes puntos

- Utilizar
     el archivo docs\03-specs\actividad-obligatoria-2\spec-frontend.md para verificar
     las limitaciones que deben tener los archivos generados
- Extraer
     todos los estilos: variables CSS, tipografías, colores, espaciados y componentes.
- Formato
     estructurado
- Archivos
     css/styles.css: variables CSS en :root, reset, tipografías, colores,
     layout base.
- css/components.css:
     botones, cards, navegación, formularios, estados hover/focus.

```

## Resultado obtenido del prompt a copilot para extraer los estilos al Mockup con Figma MCP
```
Analiza el diseño disponible en Figma y la estructura HTML existente del proyecto.

El objetivo es extraer e implementar exclusivamente los estilos correspondientes al rol Desarrollador Frontend.


## Información que debes extraer

Analiza y documenta únicamente los elementos identificables en el FRAME 15 del enlace de Figma: https://www.figma.com/design/jX7NrMUtt6Tg7oiYqock6s/Sin-t%C3%ADtulo?node-id=0-1&t=WQbUPZNRHeUilp9W-1

- Variables y tokens de diseño.
- Variables CSS.
- Familias tipográficas.
- Pesos, tamaños, alturas de línea y espaciado entre letras.
- Colores sólidos, transparencias y gradientes.
- Colores utilizados para estados visuales.
- Espaciados, márgenes, paddings y gaps.
- Anchos, alturas y dimensiones relevantes.
- Bordes, radios, sombras y opacidades.
- Box Model.
- Contenedores, grids y layouts base.
- Componentes visibles.
- Variantes disponibles.
- Estados `default`, `hover`, `focus`, `active`, `disabled`,
  `selected` y `error`, únicamente cuando existan en Figma.

## Archivos que debes generar o actualizar

### `css/styles.css`

Debe contener exclusivamente estilos globales y estructurales.

1. Variables CSS dentro de `:root`, agrupadas por categorías:
   - Colores.
   - Tipografías.
   - Espaciados.
   - Dimensiones.
   - Bordes y radios.
   - Sombras.
   - Layout.

2. Reset CSS.
3. Configuración global de tipografías.
4. Estilos base para `html` y `body`.
5. Box Model global mediante `box-sizing`.
6. Colores globales.
7. Layout base.
8. Contenedores y grids.
9. Utilidades generales estrictamente necesarias.

Controla explícitamente:

- `padding`
- `margin`
- `border`
- `box-sizing`
- `width`
- `height`
- `gap`

### `css/components.css`

Debe contener únicamente estilos correspondientes a componentes reutilizables:

- Botones y sus variantes.
- Cards o tarjetas de productos.
- Navegación.
- Formularios.
- Labels.
- Inputs.
- Selects.
- Textareas.
- Filtros.
- Carrito, únicamente si está presente en el HTML o mockup.
- Otros componentes visibles identificados en Figma.
- Estados `hover`.
- Estados `focus`.
- Estados `active`.
- Estados `disabled`.
- Estados `selected`.
- Estados `error`, únicamente si existen.
- Transiciones coherentes con el diseño.

Todos los estados de foco deben ser visibles y accesibles para navegación mediante teclado.

## Reglas de implementación

- Respeta la estructura HTML existente del repositorio.
- Respeta el diseño definido en Figma.
- Mantén separadas la estructura HTML, la presentación CSS y la futura lógica JavaScript.
- Usa nombres semánticos y consistentes para clases y variables CSS.
- Reutiliza las variables definidas en `:root`.
- Evita duplicar valores globales.
- Aplica correctamente selectores, herencia y especificidad.
- Usa selectores estables y mantén una especificidad controlada.
- No uses `!important`, salvo que exista una justificación técnica explícita.
- Implementa correctamente el Box Model.
- Controla explícitamente `padding`, `margin`, `border` y dimensiones cuando corresponda.
- Diferencia correctamente elementos de bloque y elementos en línea.
- Utiliza Flexbox o CSS Grid cuando sean necesarios para reproducir el layout base del diseño.
- Evita reglas frágiles basadas en posiciones accidentales del DOM.
- Usa CSS moderno, claro, organizado y mantenible.
- Añade comentarios breves únicamente para decisiones de estilo que no sean evidentes.
- Conserva las proporciones, jerarquía visual y espaciados definidos en Figma.
- Mantén la legibilidad y evita solapamientos de contenido.
- No uses estilos inline.
- No agregues JavaScript.
- No modifiques la lógica o funcionalidad existente del HTML.
- No inventes información, componentes, estados o valores que no estén disponibles en Figma o en el proyecto.

## Fuera del alcance del rol
- No implementes Media Queries.
- No definas breakpoints.
- No adaptes componentes específicamente para dispositivos móviles, tablets o diferentes tamaños de pantalla.
- No modifiques el layout en función del ancho o alto del viewport.
- No agregues reglas CSS específicas para resoluciones de pantalla.
```

## Resultado obtenido prompt para Figma MCP

- components.css
- styles.css

## Ajustes manuales realizados

- css/styles.css: se ajustó el layout general para mejorar la alineación, distribución y proporción de las distintas secciones respecto del mockup.
- css/styles.css: se corrigió la estructura visual del footer, ajustando la distribución de contacto, redes sociales, ubicación y mapa.
- css/components.css: se corrigieron los colores y la estructura visual del carrito, diferenciando correctamente el encabezado, las tarjetas de productos y el cuerpo del panel.
- css/components.css: se ajustaron padding, márgenes, gap y dimensiones del carrito para obtener una distribución más compacta y similar al mockup.
- css/components.css: se reorganizaron las tarjetas del carrito, mejorando la posición y tamaño de imágenes, descripción, cantidad, precios, subtotales y controles.
- css/components.css: se ajustó el panel de filtros del catálogo para aproximar su color, ancho, tipografía, categorías, selector y campos de precio al diseño de referencia.
- css/components.css: se corrigieron tamaños, alineaciones, bordes y box model de botones, inputs y demás componentes visuales.
- css/components.css: se revisaron los estados hover, focus y disabled para mantener una apariencia coherente con los estados definidos en el mockup.
- css/styles.css y css/components.css: se realizaron correcciones finales de colores, tipografías, espaciados, dimensiones, alineaciones, box model y especificidad detectadas durante la comparación visual con el mockup.

## Evidencia de cierre

- Commit del spec anterior a los commits de `css/styles.css` y `css/components.css`: `[]`.
- Enlace al archivo Figma actualizado: `[]`.
- Prompt exacto utilizado con Figma MCP: documentado en la sección anterior.
- Resultado obtenido: documentado en la sección anterior.
- Ajustes manuales: documentados en la sección anterior.
- Prueba en GitHub Pages: `[]`.