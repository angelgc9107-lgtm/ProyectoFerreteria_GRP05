# Spec: Desarrollador Frontend

**Rol:** Desarrollador Frontend
**Se traza contra:** plan.md — RF1-RF8; RNF1-RNF12
**Entrega:** Actividad Obligatoria N°1 — FerroLab

## Qué se va a hacer

Construir la estructura HTML5 inicial de FerroLab en `index.html`, tomando como referencia el mockup realizado por el Documentador / Diseñador UX. Para obtener una primera estructura alineada con ese mockup, se utilizarán el servidor MCP de Figma y GitHub Copilot en modo Agente. El proceso deberá realizarse sobre el archivo y la estructura de carpetas ya definidos por el proyecto.

La página contendrá un catálogo digital de productos de ferretería, con información específica de FerroLab: nombres, descripciones, imágenes, precios por unidad y categorías. También incluirá enlaces de navegación, información comercial, una lista pertinente, una tabla de productos y un formulario de contacto con al menos tres campos relevantes. La búsqueda y el filtrado quedarán previstos mediante estructura HTML y comentarios para una implementación posterior con JavaScript, sin incorporar lógica funcional en esta entrega.

La estructura deberá utilizar correctamente `<!DOCTYPE html>`, `html` con atributo `lang`, `head`, `meta charset`, meta viewport, `title` y `body`. Se utilizará HTML semántico, incluyendo obligatoriamente `header`, `main` y `footer`, además de al menos dos etiquetas pertinentes entre `nav`, `section`, `article` y `aside`. Todas las imágenes tendrán atributos `alt` descriptivos, los enlaces utilizarán `href` y textos comprensibles, y la tabla utilizará `th`, `tr` y `td`.

No se implementarán CSS ni JavaScript. Dentro del futuro `index.html` se dejarán comentarios específicos que indiquen qué sectores necesitarán estilos, qué tipo de estilos se prevé incorporar y dónde se aplicarán. También se dejarán comentarios que indiquen qué funcionalidades interactivas se incorporarán posteriormente, en qué sectores y qué elementos podrían recibir comportamiento mediante JavaScript.

## Evidencia del proceso con Figma MCP

La evidencia del uso del mockup, Figma MCP y GitHub Copilot en modo Agente se documentará después de realizar el proceso. Esta sección deberá registrar el prompt utilizado, el resultado obtenido y los ajustes manuales realizados sobre la estructura generada; mientras el proceso no se haya ejecutado, esos datos permanecerán pendientes y no se inventarán.

### Prompt utilizado

Pendiente de completar luego de utilizar el servidor MCP de Figma junto con GitHub Copilot en modo Agente.

### Resultado obtenido

Pendiente de completar luego de generar la estructura HTML inicial a partir del mockup.

### Ajustes manuales realizados

Pendiente de completar luego de revisar y adaptar la estructura HTML generada.

## Por qué

`plan.md` establece que FerroLab debe permitir visualizar un catálogo, consultar la información de sus productos, reconocer sus categorías, navegar por el sitio y acceder a la información comercial y al formulario de contacto (RF1-RF8). Esta tarea construye la base HTML que representa esos contenidos y deja preparada la estructura para que búsqueda y filtrado puedan incorporar lógica en una entrega posterior, de acuerdo con el alcance definido para la Actividad Obligatoria N°1.

El uso de HTML5 semántico, metadatos básicos, textos alternativos y una organización clara responde a RNF1-RNF8, especialmente a los requisitos de estructura semántica, accesibilidad, SEO, facilidad de navegación, mantenibilidad y legibilidad. Mantener separadas la estructura, la presentación y la interactividad responde a RNF9. La base organizada y específica de FerroLab permite extender el catálogo y sus funcionalidades en futuras entregas, en línea con RNF10-RNF12, sin implementar todavía carrito, pago, validaciones ni confirmación de pedidos.

## Criterios de aceptación

- [ ] Dado que se revisa `index.html`, cuando se valida su inicio y estructura principal, entonces contiene `<!DOCTYPE html>`, `html` con atributo `lang`, `head`, `meta charset`, meta viewport, `title` y `body`.
- [ ] Dado que se consulta el contenido de la página, cuando se recorren sus textos, entonces los títulos y párrafos describen FerroLab, su catálogo y la temática de ferretería, sin Lorem Ipsum ni contenido genérico de prueba.
- [ ] Dado que se revisan los productos del catálogo, cuando se observa la información presentada, entonces cada producto incluye nombre, descripción, imagen pertinente y precio por unidad.
- [ ] Dado que se revisan las imágenes, cuando se inspecciona cada elemento `img`, entonces todas poseen un atributo `alt` descriptivo y relacionado con su contenido.
- [ ] Dado que se revisan los enlaces, cuando se inspecciona cada elemento `a`, entonces utiliza `href` y un texto descriptivo que permite comprender su destino o propósito.
- [ ] Dado que se consulta la organización del catálogo, cuando se revisa la sección correspondiente, entonces incluye al menos una lista pertinente mediante `ul` u `ol` y sus elementos `li`, relacionada con FerroLab.
- [ ] Dado que se consulta la información de productos, cuando se revisa la tabla, entonces presenta una estructura correcta con encabezados `th`, filas `tr` y celdas de datos `td`.
- [ ] Dado que un usuario desea comunicarse con FerroLab, cuando se revisa el formulario de contacto, entonces contiene al menos tres campos relevantes para una consulta real del proyecto y utiliza elementos de formulario HTML adecuados.
- [ ] Dado que se valida la estructura semántica, cuando se inspecciona el documento, entonces contiene obligatoriamente `header`, `main` y `footer`, además de al menos dos etiquetas adicionales pertinentes entre `nav`, `section`, `article` y `aside`.
- [ ] Dado que se consulta la navegación y la información comercial, cuando se recorren las secciones de la página, entonces se encuentran enlaces hacia las áreas principales y datos relacionados con contacto, horarios, servicios o medios de pago de FerroLab, según corresponda al catálogo.
- [ ] Dado que se revisa el alcance de la entrega, cuando se ejecuta o inspecciona la página, entonces no contiene CSS ni JavaScript funcional y no implementa carrito, pago, validaciones ni confirmación de pedidos.
- [ ] Dado que se prepara una futura entrega visual, cuando se revisan los comentarios de `index.html`, entonces identifican los sectores que necesitarán estilos, el tipo de estilos previsto y dónde se aplicarán, sin limitarse a indicar genéricamente “agregar CSS”.
- [ ] Dado que se prepara una futura entrega interactiva, cuando se revisan los comentarios de `index.html`, entonces identifican las funcionalidades previstas, los sectores donde se incorporarán y los elementos candidatos a recibir comportamiento mediante JavaScript, sin implementar todavía esa lógica.
- [ ] Dado que se compara la estructura con el mockup del Documentador / Diseñador UX, cuando se revisa el resultado HTML inicial, entonces la distribución y las secciones previstas toman ese mockup como referencia.
- [ ] Dado que se revisa el proceso de generación de la estructura inicial, cuando se consulta la evidencia pendiente, entonces se encuentran apartados identificados para documentar el prompt utilizado, el resultado obtenido y los ajustes manuales realizados después de utilizar el servidor MCP de Figma junto con GitHub Copilot en modo Agente.
- [ ] Dado que el proceso con Figma MCP todavía no fue realizado, cuando se consulta la evidencia, entonces no se presentan prompts, resultados ni ajustes inventados y los apartados permanecen pendientes de completar.
