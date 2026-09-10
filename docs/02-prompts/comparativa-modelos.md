# Comparativa de Modelos de IA

## Tarea comparada

Se comparó la misma tarea documentada en `prompts-1.md`: extraer y
estructurar los requisitos funcionales y no funcionales del proyecto de
ferretería a partir de un alcance textual, distinguir los requisitos de la
Actividad Obligatoria N°1 de las funcionalidades futuras y señalar qué queda
fuera de alcance.

Para mantener las condiciones comparables, ambos modelos recibieron el mismo
prompt base, sin agregar instrucciones específicas para favorecer a uno de
ellos.

## Modelo A: ChatGPT (OpenAI)

**Prompt usado:** En base al alcance del proyecto de ferretería necesito que extraigas y estructures los requisitos funcionales y no funcionales para este proyecto, dejo el alcance del proyecto:

El proyecto contempla el desarrollo de un sitio web para una ferretería destinado a exhibir y comercializar sus productos por Internet. En la primera etapa se desarrollará principalmente la estructura utilizando HTML5, presentando el catálogo de productos, categorías, información comercial, imágenes, precios, enlaces, formularios, listas y tablas.
La estructura utilizará etiquetas semánticas y tendrá en cuenta aspectos básicos de accesibilidad y SEO. Además, el código incluirá comentarios y marcadores que identifiquen las funcionalidades que serán incorporadas posteriormente mediante CSS y JavaScript.
El proyecto quedará preparado para evolucionar hacia una plataforma de venta más completa, incorporando posteriormente funcionalidades como carrito de compras, búsqueda y filtrado de productos, cálculo de totales, validación de formularios y confirmación de pedidos.

**Resultado:** ChatGPT produjo 18 requisitos funcionales y 15 requisitos no
funcionales. Identificó RF1-RF8 como parte de la primera etapa y RF9-RF18
como funcionalidades futuras. También agregó una sección de funcionalidades
fuera de alcance con gestión de stock, registro de clientes, login, pagos
electrónicos reales, facturación electrónica e integración logística.

**Fortalezas:** Entregó una enumeración amplia, separó el alcance inicial de
la evolución futura y agregó explícitamente aspectos que no debían
implementarse en la primera etapa.

**Debilidades:** Algunos requisitos quedaron formulados de manera amplia y
podían interpretarse de más de una forma, especialmente los relacionados con
la compra y los pagos. La respuesta también necesitaba una revisión humana
para separar mejor las funcionalidades obligatorias de las futuras y evitar
solapamientos entre requisitos relacionados.

## Modelo B: GitHub Copilot Chat (modo Agente)

**Prompt usado:** El mismo texto del prompt utilizado para ChatGPT, sin agregar contexto ni restricciones adicionales.

El proyecto contempla el desarrollo de un sitio web para una ferretería destinado a exhibir y comercializar sus productos por Internet. En la primera etapa se desarrollará principalmente la estructura utilizando HTML5, presentando el catálogo de productos, categorías, información comercial, imágenes, precios, enlaces, formularios, listas y tablas.
La estructura utilizará etiquetas semánticas y tendrá en cuenta aspectos básicos de accesibilidad y SEO. Además, el código incluirá comentarios y marcadores que identifiquen las funcionalidades que serán incorporadas posteriormente mediante CSS y JavaScript.
El proyecto quedará preparado para evolucionar hacia una plataforma de venta más completa, incorporando posteriormente funcionalidades como carrito de compras, búsqueda y filtrado de productos, cálculo de totales, validación de formularios y confirmación de pedidos.

**Resultado:** La extracción produjo 24 requisitos funcionales y 15
requisitos no funcionales a partir del alcance proporcionado. Para la
Actividad Obligatoria N°1 identificó RF1-RF3 y RF6-RF8: catálogo, información
de productos, categorías, navegación, información comercial y formulario de
contacto. Dejó RF4-RF5 y RF9-RF24 como funcionalidades previstas para etapas
posteriores con CSS y JavaScript. También mantuvo fuera de alcance el
procesamiento real de pagos, la facturación electrónica, la gestión
administrativa de stock, el registro e inicio de sesión y la integración con
sistemas logísticos externos.

**Fortalezas:** Conservó la separación entre requisitos estructurales y
funcionales, distinguió las funcionalidades de la primera etapa de las
funcionalidades futuras y explicitó los límites de la solución.

**Debilidades:** La respuesta fue más detallada de lo necesario para una
primera definición del alcance y convirtió algunas ideas generales en
requisitos muy específicos. También podía incorporar supuestos no expresados
de forma literal, por lo que fue necesario revisar cada requisito y confirmar
que conservara una única responsabilidad y que no ampliara el alcance sin
justificación.

## Comparación de resultados

| Criterio | ChatGPT | GitHub Copilot Chat |
|---|---|---|
| Requisitos funcionales | 18 | 24 en la extracción del alcance proporcionado |
| Requisitos no funcionales | 15 | 15 |
| Primera entrega | RF1-RF8 | RF1-RF3 y RF6-RF8 |
| Funcionalidades futuras | RF9-RF18 | RF4-RF5 y RF9-RF24 |
| Fuera de alcance explícito | Sí | Sí |
| Correspondencia con el alcance del prompt | Alta | Alta |

## Checklist de validación

- [x] Se ejecutó la misma tarea con ChatGPT y GitHub Copilot Chat.
- [x] Se mantuvieron el mismo objetivo, contexto y restricciones en ambos
	prompts.
- [x] Se documentaron los resultados de ambas ejecuciones.
- [x] Se compararon ambos resultados con los mismos criterios: cantidad,
	alcance inicial, funcionalidades futuras, fuera de alcance y correspondencia
	con el alcance del prompt.
- [x] Se redactó una conclusión basada en los resultados de ambos modelos.

## Conclusión

ChatGPT produjo una primera clasificación clara y útil del alcance, con una
buena separación entre la entrega inicial y las etapas futuras. GitHub Copilot
Chat resultó más adecuado cuando se necesitó mayor nivel de detalle y una
separación más precisa de las funcionalidades. Para esta tarea, la respuesta
de Copilot es la más útil como base de documentación, mientras que la respuesta
de ChatGPT fue una buena síntesis inicial del alcance.
