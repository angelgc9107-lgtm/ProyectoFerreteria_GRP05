# 🌐 Ferretería Online — FerroLab

## 🎓 Datos Académicos

- **Carrera:** Tecnicatura Universitaria en Programación de Sistemas
- **Materia:** Programación Web I

## 📖 Descripción

Tienda online de una ferretería que en teoría es física, pero que también cuenta con venta a través de internet. El sitio permite a los clientes explorar el catálogo de productos organizados por categoría, agregarlos al carrito de compras, elegir un método de pago y confirmar su pedido.

## 🎯 Objetivo del entregable

**Actividad Obligatoria N°1:** construir la estructura base en HTML5 de la página web, con sus secciones principales (Inicio, Catálogo, Carrito y Contacto).

**Actividad Obligatoria N°2:** incorporar los estilos visuales mediante CSS a partir del mockup actualizado en Figma (paleta de colores, tipografías, espaciados y estados de interacción), implementar el diseño responsive para mobile, tablet y desktop con Flexbox, CSS Grid y media queries, y validar el sitio con un proceso de QA asistido por Playwright MCP y GitHub MCP.

**Primer Parcial:** migrar el sitio a Bootstrap 5 (sistema de 12 columnas y utilidades responsive) a partir del mockup actualizado en Figma, incorporar al menos dos componentes avanzados de Bootstrap y dos componentes avanzados de HTML, y validarlos con test cases automatizados con Playwright MCP y GitHub MCP.

**Actividad Obligatoria N.º 3:** incorporar lógica de programación con JavaScript mediante cuatro flujos funcionales que permitan procesar datos, realizar validaciones y mostrar resultados. Los flujos deberán utilizar estructuras condicionales, ciclos, arreglos y objetos, según corresponda. Se documentará su funcionamiento mediante diagramas de actividades realizados con PlantUML y se desarrollarán pruebas automatizadas con Jasmine para verificar los resultados esperados.

## 🛠️ Tecnologías utilizadas

- HTML5
- CSS3 (`css/styles.css`, `css/components.css` y `css/responsive.css`)
- Bootstrap 5
- JavaScript
- PlantUML (diagramas de actividades)
- Jasmine (pruebas automatizadas de JavaScript)
- Git y GitHub (control de versiones y gestión de Pull Requests)
- GitHub Copilot Agent Mode (asistencia al desarrollo, cuando corresponda)
- ChatGPT (asistencia en las Code Reviews de la Actividad Obligatoria N.º 3)
- Playwright MCP (validación y pruebas)

## ✅ Funcionalidades previstas

- Visualización del catálogo de productos por categoría.
- Búsqueda y filtrado de productos.
- Carrito de compras con cantidad editable y cálculo de subtotales.
- Selección de método de pago.
- Resumen y confirmación de pedido.
- Ejecución de cuatro flujos funcionales mediante JavaScript.
- Validación de datos ingresados por el usuario.
- Procesamiento de información mediante condicionales, ciclos, arreglos y objetos.
- Presentación de resultados mediante `alert()` y `console.log()`.
- Menú de opciones mediante `prompt()` para ejecutar los flujos de JavaScript.
- Pruebas automatizadas de las funciones JavaScript mediante Jasmine.

## 🎨 Maqueta de diseño web

El producto final visual es una tienda online con identidad de marca propia (FerroLab), organizada en 4 pantallas principales: Inicio (con carrusel de destacados, ofertas y bloques de confianza), Catálogo (con búsqueda, filtros por categoría y precio, y grid de productos), Carrito de compras (panel lateral deslizable con resumen de costos) y una sección de Contacto/Ubicación integrada en el footer.

El diseño completo puede verse en el mockup de Figma enlazado abajo.

En el Primer Parcial el mockup se adaptó a la grilla de Bootstrap 5: desktop de 1280 px con container de 1140 px y 12 columnas, mobile de 390 px con las columnas apiladas (`col-12`) y la navbar colapsada, y los componentes señalados en cada pantalla (Navbar, Carousel, Offcanvas, Dropdown e iframe de Google Maps dentro de `.ratio.ratio-16x9`).

Para la Actividad Obligatoria N.º 3 se incorporará lógica JavaScript mediante un menú de opciones y cuatro flujos funcionales, sin requerir manipulación del DOM ni programación de eventos.

## 📁 Documentación

- [Mockup en Figma (actualizado en el Primer Parcial con Bootstrap)](https://www.figma.com/design/jX7NrMUtt6Tg7oiYqock6s/Sin-t%C3%ADtulo?node-id=191-963&t=ouTMvmvpb279r7wJ-1)
- [Mockup Bootstrap exportado (Primer Parcial)](docs/01-mockup/disenio-bootstrap.png)
- [Estados de interacción Bootstrap (Primer Parcial)](docs/01-mockup/estados-bootstrap.png)
- [Mockup con estilos exportado (Actividad Obligatoria N°2)](docs/01-mockup/actividad-obligatoria-2/dise%C3%B1o-con-estilos.png)
- [Specs del Primer Parcial](docs/03-specs/primer-parcial/)
- [Specs de la Actividad Obligatoria N.º 3](docs/03-specs/actividad-obligatoria-3/)
- [Especificación del Coordinador / DevOps](docs/03-specs/actividad-obligatoria-3/spec-devops.md)
- [Tablero Kanban del Primer Parcial](https://github.com/users/angelgc9107-lgtm/projects/1)
- [Índice de test cases](docs/04-testing/testing-doc.md)
- [Pruebas automatizadas con Jasmine](js/test/)
- [Índice de Prompts](docs/02-prompts/prompts.md)
- [Changelog](changelog.md)

## 🧪 Pruebas automatizadas con Jasmine

Para la Actividad Obligatoria N.º 3 se incorporaron pruebas automatizadas mediante Jasmine, con el objetivo de verificar el comportamiento de las funciones JavaScript desarrolladas.

Las pruebas permiten comprobar los resultados esperados de las funciones y detectar posibles errores en su funcionamiento.

La implementación y los archivos correspondientes a las pruebas se encuentran en:

- **Directorio de pruebas:** `js/test/`
- **Archivo de especificaciones:** `js/test/script.spec.js`

Para consultar las pruebas implementadas, revisar el directorio correspondiente y la documentación del rol Tester JavaScript / QA Engineer.

## 🔍 Code Reviews — Actividad Obligatoria N.º 3

Durante la tercera entrega se realizaron revisiones técnicas de las Pull Requests correspondientes a los integrantes del equipo.

Las revisiones fueron coordinadas por el responsable del rol Coordinador / DevOps, utilizando las especificaciones de cada rol como referencia para analizar los cambios y detectar posibles inconsistencias.

Se utilizó ChatGPT como herramienta de apoyo para el análisis técnico y documental.

Las decisiones de aprobación e integración fueron responsabilidad del revisor humano.

### Pull Requests revisadas

| PR | Integrante | Trabajo | Resultado |
|---|---|---|---|
| [#125](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/pull/125) | Ángel Cuarterón | Implementación JavaScript | Aprobada e integrada |
| [#123](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/pull/123) | Thiago Piastrellini | Pruebas Jasmine | Aprobada e integrada |
| [#122](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/pull/122) | Alan Díaz | Diagramas de actividades | Observaciones identificadas |
| [#132](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/pull/132) | Thiago Piastrellini | Correcciones documentales | Seguimiento de correcciones |

Las observaciones, los hallazgos y las correcciones recomendadas se encuentran documentados en la [especificación del Coordinador / DevOps](docs/03-specs/actividad-obligatoria-3/spec-devops.md).

## 👥 Integrantes del Grupo

| Nombre y Apellido | Matrícula | Usuario de GitHub | Rol |
|---|---|---|---|
| Luciano Barrionuevo | 156398 | @LuchoBarrionuevo13 | Coordinador y DevOps |
| Alan Díaz | 152841 | @alandox1 | Arquitecto de Diagramas |
| Ángel Cuarterón | 159438 | @angelgc9107-lgtm | Desarrollador JavaScript |
| Thiago Piastrellini | 158097 | @Piastrellini | Tester JavaScript / QA Engineer |