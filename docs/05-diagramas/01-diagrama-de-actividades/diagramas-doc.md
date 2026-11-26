# Diagramas de actividades — FerroLab

Diagramas de actividades en PlantUML de los 4 flujos principales del
proyecto. Documentan la implementación actual en `js/script.js`, sus
eventos del DOM, validaciones, decisiones y ciclos.

Proceso y decisiones de diseño:
[spec-arq-diagramas.md](../../03-specs/actividad-obligatoria-3/spec-arq-diagramas.md)

## Índice

| # | Flujo | Requisitos | Editable | Imagen |
|---|---|---|---|---|
| 1 | [Búsqueda y filtrado del catálogo](#flujo-1--búsqueda-y-filtrado-del-catálogo) | RF4, RF5 | [.puml](actividad-flujo-1-busqueda-filtrado.puml) | [.jpg](actividad-flujo-1-busqueda-filtrado.jpg) |
| 2 | [Gestión del carrito](#flujo-2--gestión-del-carrito) | RF9 a RF13, RF20 | [.puml](actividad-flujo-2-carrito.puml) | [.jpg](actividad-flujo-2-carrito.jpg) |
| 3 | [Pago y cálculo de cuotas](#flujo-3--pago-y-cálculo-de-cuotas) | RF14 a RF19 | [.puml](actividad-flujo-3-pago-cuotas.puml) | [.jpg](actividad-flujo-3-pago-cuotas.jpg) |
| 4 | [Resumen y confirmación del pedido](#flujo-4--resumen-y-confirmación-del-pedido) | RF21 a RF24 | [.puml](actividad-flujo-4-confirmacion-pedido.puml) | [.jpg](actividad-flujo-4-confirmacion-pedido.jpg) |

Todos usan swimlanes: **Usuario** (interactúa con controles, formularios y
acciones de la interfaz) y **Sistema** (responde a eventos, valida y
actualiza el DOM y los mensajes de estado).

## Flujo 1 — Búsqueda y filtrado del catálogo

El catálogo se actualiza al escribir en el buscador o cambiar categoría,
orden o filtro de precio; también responde al envío del formulario y a la
selección de categoría desde el menú. El sistema valida los criterios,
filtra y ordena los productos y renderiza las tarjetas y el mensaje de
estado. Los criterios de texto, categoría y precio desactivado no limitan
los resultados. El usuario puede cambiar los criterios repetidamente.

![Flujo 1](actividad-flujo-1-busqueda-filtrado.jpg)

## Flujo 2 — Gestión del carrito

El usuario agrega productos desde las tarjetas, cambia cantidades en los
campos numéricos o elimina ítems desde el panel del carrito. Cada operación
valida el producto o la cantidad; si es válida, guarda y renderiza el carrito
con subtotales y total. Si cambia el carrito, se descartan el pago y el pedido
pendiente. "Iniciar compra" solo continúa si hay ítems y lleva al flujo 3.

![Flujo 2](actividad-flujo-2-carrito.jpg)

## Flujo 3 — Pago y cálculo de cuotas

El usuario elige el método y, para tarjeta, una de las cuotas disponibles.
Los eventos de cambio actualizan las opciones y recalculan las condiciones;
el envío del formulario vuelve a validarlas y muestra la sección de datos del
pedido. Las condiciones incluyen total original, recargo, interés, total
financiado y valor de cuota. "Cancelar pago" oculta pago y confirmación y
conserva los productos del carrito.

![Flujo 3](actividad-flujo-3-pago-cuotas.jpg)

## Flujo 4 — Resumen y confirmación del pedido

El usuario completa nombre, correo y dirección en el formulario. El sistema
valida los datos, presenta errores junto a los controles y permite corregirlos
antes de renderizar el resumen. El usuario confirma o cancela mediante los
botones del resumen. Al confirmar, se genera el número de pedido y se vacían
el carrito y el pago; al cancelar, se conserva el carrito y las condiciones
de pago.

![Flujo 4](actividad-flujo-4-confirmacion-pedido.jpg)

## Cómo editar los diagramas

1. Abrí el archivo `.puml` en VS Code con la extensión **PlantUML** (requiere
   Java) y usá `Alt + D` para la vista previa; o pegá el contenido en
   [plantumleditor.com](https://www.plantumleditor.com/).
2. Modificá el texto. Sintaxis usada: `start`, un único `stop` al final del flujo, `end` para las salidas
   alternativas (cancelaciones, carrito vacío), `:Actividad;`,
   `if (...) then (sí) ... else (no) ... endif`, `while` / `repeat`
   para ciclos y `|Usuario|` / `|Sistema|` para los swimlanes.
3. Exportá a PNG (en VS Code: *PlantUML: Export Current Diagram*) y
   convertí la imagen a JPG sin reducir sus dimensiones. Los archivos
   `.puml` ya configuran fondo blanco y resolución de 180 dpi. Reemplazá
   el `.jpg` con el mismo nombre.
