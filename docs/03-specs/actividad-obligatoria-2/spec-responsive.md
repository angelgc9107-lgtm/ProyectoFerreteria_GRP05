# Spec — Especialista en Responsive Design (Actividad Obligatoria N°2)

## Qué se va a hacer

Se implementará la adaptación responsive del sitio FerroLab mediante un nuevo
archivo `css/responsive.css`, que se sumará a los estilos ya existentes
(`css/styles.css` y `css/components.css`) sin reemplazarlos ni modificarlos.

La estrategia de trabajo será **mobile-first**: primero se validará que el
contenido se vea correctamente en pantallas pequeñas y luego se irán
agregando media queries para adaptar el layout a tablet y desktop.

`responsive.css` deberá cargarse después de `styles.css` y `components.css`
en `index.html`, de forma que sus reglas puedan sobrescribir puntualmente el
comportamiento en cada breakpoint sin duplicar estilos base ya definidos
(colores, tipografías, botones, cards, etc.).

## Por qué

FerroLab debe poder visualizarse correctamente en distintos dispositivos
(celulares, tablets y computadoras), ya que actualmente los estilos base
(`styles.css` y `components.css`) están pensados principalmente para un
layout de escritorio. Sin una capa responsive, el sitio puede presentar
problemas de usabilidad, overflow horizontal o mala distribución de
componentes en pantallas más pequeñas.

Esta implementación es necesaria para:

- Mantener la fidelidad respecto del mockup actualizado de la Actividad
  Obligatoria N.º 2 en los distintos tamaños de pantalla.
- Garantizar una buena experiencia de usuario (usabilidad) en mobile,
  tablet y desktop.
- Reutilizar el trabajo ya realizado por el Desarrollador Frontend/CSS,
  evitando duplicar o reescribir estilos existentes.
- Cumplir con los requisitos de diseño responsive establecidos en `plan.md`
  para esta actividad.

## Breakpoints propuestos

Siguiendo un enfoque mobile-first, se proponen los siguientes breakpoints:

- **Mobile (base, sin media query):** hasta 767px.
- **Tablet:** `min-width: 768px`.
- **Desktop:** `min-width: 1024px`.

Justificación:

- **768px** es el punto donde, según el mockup, el header y la navegación
  dejan de apilarse verticalmente y el buscador puede ubicarse junto al
  logo/menú en una misma línea. Además, las cards de productos y servicios
  pasan de una columna a dos, aprovechando el ancho disponible sin perder
  legibilidad.
- **1024px** corresponde al punto donde el catálogo de productos y las
  secciones de servicios pueden mostrarse en tres o más columnas, tal como
  se observa en el mockup para la versión de escritorio, y donde el header
  completo (logo, navegación y buscador) tiene espacio suficiente para
  mostrarse en una sola fila sin comprimirse.

Estos valores se basan en los breakpoints estándar de la industria y en la
distribución de contenido observable tanto en `index.html` como en el
mockup, evitando elegir valores arbitrarios.

## Uso de Flexbox y CSS Grid

Analizando `index.html`, `styles.css` y `components.css`, se plantea el
siguiente uso de técnicas de layout:

- **Header y navegación:** Flexbox, para alinear logo, menú de navegación y
  buscador en fila (desktop/tablet) o en columna (mobile).
- **Buscador:** Flexbox, para alinear el input y el botón de búsqueda,
  ajustando su ancho según el breakpoint.
- **Sección de ofertas/servicios:** Flexbox o Grid según la estructura real
  de las cards en `index.html`, permitiendo pasar de una columna en mobile
  a varias columnas en tablet/desktop.
- **Catálogo de productos:** CSS Grid, ya que es la técnica más adecuada
  para organizar múltiples cards de producto en una grilla que cambie de
  cantidad de columnas según el breakpoint (1 columna en mobile, 2 en
  tablet, 3 o más en desktop).
- **Footer:** Flexbox, para distribuir los bloques de información que lo
  componen, apilándolos en mobile y alineándolos en fila en tablet/desktop.

No se modificará la estructura HTML existente ni se agregarán nuevas
clases; el uso de Flexbox/Grid se aplicará sobre las clases y componentes
ya definidos en `styles.css` y `components.css`.

## Comportamiento responsive esperado

De forma general, se planifica el siguiente comportamiento entre breakpoints:

- **Header y navegación:** en mobile se apilan verticalmente (o se
  simplifican); en tablet y desktop se muestran en una fila horizontal.
- **Buscador:** ocupa el ancho disponible en mobile; en tablet/desktop se
  integra junto al menú sin ocupar todo el ancho.
- **Catálogo de productos / cards de servicios:** 1 columna en mobile,
  2 columnas en tablet, 3 o más columnas en desktop.
- **Imágenes:** deberán escalar de forma fluida (ancho relativo al
  contenedor) para no desbordar en ningún breakpoint.
- **Formularios:** los campos deberán ocupar el ancho disponible en mobile
  y podrán distribuirse en varias columnas en tablet/desktop si el mockup
  lo indica.
- **Tipografías y espaciados:** se ajustarán tamaños de fuente y márgenes/
  paddings de forma progresiva entre breakpoints, priorizando legibilidad
  en mobile.
- **Footer:** bloques apilados en mobile, distribuidos en fila en tablet y
  desktop.

Estas decisiones son de planificación; la implementación concreta se
realizará en `responsive.css` en una etapa posterior.

## Overflow horizontal

Queda documentado que **el sitio no deberá presentar overflow horizontal
en ninguno de los tres breakpoints** (mobile, tablet, desktop).

Durante la futura implementación, deberán revisarse especialmente:

- Imágenes y sus contenedores.
- Grillas (Grid) del catálogo de productos.
- Contenedores Flexbox del header, navegación y footer.
- Formularios e inputs, verificando que no excedan el ancho del viewport.
- Cards de productos/servicios y sus paddings/márgenes.

Esta verificación deberá realizarse en cada breakpoint definido antes de
dar por finalizada la implementación.

## Criterios de aceptación

- [ ] Breakpoints definidos y documentados para mobile, tablet y desktop.
- [ ] Layout mobile-first implementado.
- [ ] Todas las secciones del mockup se adaptan correctamente en los tres breakpoints.
- [ ] Flexbox y/o CSS Grid utilizados según las necesidades de las secciones.
- [ ] No existe overflow horizontal en ningún dispositivo o breakpoint.
- [ ] Se mantiene coherencia visual con el mockup actualizado.
- [ ] Se respetan y reutilizan los estilos existentes de styles.css y components.css siempre que sea posible.
- [ ] Pruebas de integración realizadas con el Desarrollador Frontend en localhost y GitHub Pages.

## Evidencia de implementación

### Prompt exacto utilizado en Copilot Agent

Pendiente de completar.

### Archivos utilizados como contexto

Pendiente de completar.

### Resultado obtenido

Pendiente de completar.

### Fidelidad respecto del mockup

Pendiente de completar.

### Ajustes manuales realizados

Pendiente de completar.

### Decisiones finales de breakpoints y justificación

Pendiente de completar.