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

> **Nota (post-implementación):** durante la implementación se ajustó el
> valor exacto del breakpoint mobile de `max-width: 767px` a
> `max-width: 767.98px`, para evitar un pequeño rango sin cobertura entre
> 767px y 768px. Los rangos conceptuales (mobile / tablet / desktop) se
> mantienen sin cambios respecto de lo planificado. Ver también la sección
> "Decisiones finales de breakpoints y justificación" más abajo.

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

- [x] Breakpoints definidos y documentados para mobile, tablet y desktop.
- [x] Layout mobile-first implementado (con el ajuste documentado en
      "Decisiones finales de breakpoints y justificación").
- [x] Todas las secciones del mockup se adaptan correctamente en los tres breakpoints.
- [x] Flexbox y/o CSS Grid utilizados según las necesidades de las secciones.
- [x] No existe overflow horizontal en ningún dispositivo o breakpoint (verificado visualmente en las pruebas manuales realizadas).
- [x] Se mantiene coherencia visual con el mockup actualizado.
- [x] Se respetan y reutilizan los estilos existentes de styles.css y components.css siempre que sea posible.
- [ ] Pruebas de integración realizadas con el Desarrollador Frontend en localhost y GitHub Pages.

## Evidencia de implementación

### Prompt exacto utilizado en Copilot Agent

```
Pendiente de insertar el prompt exacto utilizado durante la implementación.
```

### Archivos utilizados como contexto

Durante la implementación se utilizaron como contexto:

- `spec-responsive.md`: como referencia principal de la planificación
  (breakpoints, estrategia mobile-first, uso previsto de Flexbox/Grid) que
  debía respetarse en el código final.
- `index.html`: para identificar las secciones, clases e IDs reales sobre
  los que debían aplicarse los ajustes responsive, sin inventar elementos.
- `css/styles.css`: para entender el sistema de variables (espaciados,
  colores, `--cart-width`, `--catalog-columns`) y la estructura Grid base
  del layout (main, catálogo, ofertas, bienvenida).
- `css/components.css`: para analizar en detalle las reglas específicas
  del header, la navegación, el carrito y el footer, y así poder
  complementarlas sin duplicarlas ni reemplazarlas.
- PNG actualizado del mockup: como referencia visual de la distribución
  esperada en los distintos tamaños de pantalla.

### Resultado obtenido

Se creó el archivo `css/responsive.css`, que complementa a `styles.css` y
`components.css` sin modificarlos, adaptando el proyecto a tres rangos de
pantalla (mobile, tablet, desktop). Según lo que puede verificarse leyendo
el archivo final:

- **Header y navegación (mobile):** dentro de `@media (max-width: 767.98px)`,
  el header pasa de un esquema con elementos en `position: absolute`
  (pensado para desktop) a un layout Flexbox en columna, con el logo, el
  buscador, el acceso al carrito y "Iniciar sesión" apilados en flujo
  normal. La navegación (`nav`) permite que sus enlaces envuelvan
  (`flex-wrap: wrap`) en pantallas angostas.
- **Ofertas y servicios:** la grilla (`#ofertas > div` y
  `section[aria-label="Servicios de FerroLab"] > ul`) pasa de 1 columna en
  mobile, a 2 columnas en tablet (`min-width: 768px`) y a 3 columnas en
  desktop (`min-width: 1024px`), reutilizando la misma técnica de Grid ya
  definida en `styles.css`.
- **Sección de bienvenida:** las imágenes y el texto (`section[aria-labelledby="bienvenida"]`)
  se apilan en 1 columna en mobile y vuelven a 2 columnas a partir de
  tablet.
- **Catálogo:** en mobile, `#catalogo` pasa a 1 columna (filtros arriba,
  productos abajo) y el `aside` de filtros ocupa el 100% del ancho. En
  tablet se restaura el esquema de 2 columnas (`140px` + contenido) y la
  grilla de productos pasa a 2 columnas; en desktop, la grilla de
  productos vuelve a usar `var(--catalog-columns)` (3 columnas), tal como
  está definido en `styles.css`.
- **Tabla de precios:** el contenedor de la tabla recibe `overflow-x: auto`
  en mobile, permitiendo scroll horizontal controlado dentro del propio
  contenedor en lugar de desbordar el viewport.
- **Carrito:** en mobile, `#carrito` ocupa el 100% del ancho y se oculta su
  pseudo-elemento `::before` (la sombra lateral pensada para el ancho de
  escritorio); en tablet ocupa un ancho intermedio (60%) también sin la
  sombra; en desktop se restauran el ancho (`var(--cart-width)`) y la
  sombra (`::before`) originales definidos en `components.css`.
- **Footer:** en mobile y tablet, las secciones del footer se apilan en 1
  columna; en desktop se restaura el layout original de 2 columnas
  (`minmax(24rem, 1fr) minmax(28rem, 1fr)`) definido en `components.css`.

### Fidelidad respecto del mockup

La implementación buscó mantener la estructura visual, la jerarquía y los
estilos ya definidos por el Desarrollador Frontend/CSS y por el mockup
actualizado (colores, tipografías, componentes como cards, carrito y
footer). El objetivo del responsive fue reorganizar la distribución de los
elementos existentes según el espacio disponible en cada breakpoint, sin
rediseñar los componentes ni reemplazar innecesariamente los estilos base.

No se afirma una fidelidad perfecta o absoluta respecto del mockup: la
verificación se realizó mediante pruebas manuales de redimensionado del
navegador, revisando visualmente que la distribución general se
correspondiera con lo esperado en mobile, tablet y desktop.

### Ajustes manuales realizados

Durante las pruebas visuales se detectó un problema concreto: al cargar
`responsive.css`, el header cambiaba incorrectamente de posición respecto
del diseño original definido por el Desarrollador Frontend/CSS en
`styles.css` y `components.css`.

Al revisar el código, se identificó que las reglas de adaptación para
mobile (relacionadas con `header`, sus hijos y `nav`) se habían escrito
inicialmente como reglas base, sin encapsularlas en una media query. Esto
provocaba que propiedades como `display: flex`, `padding` y `gap` del
header quedaran activas también en tablet y desktop, alterando el punto de
referencia de los elementos posicionados de forma absoluta (`top`, `left`,
`right`) definidos originalmente en `components.css`.

Para corregirlo:

- Se compararon en detalle las reglas originales del header, sus hijos y
  `nav` en `components.css` con las reglas agregadas en `responsive.css`.
- Se encapsularon todas las reglas específicas de mobile relacionadas con
  el header y la navegación dentro de `@media (max-width: 767.98px)`.
- Se eliminó cualquier regla de header en los bloques de tablet y
  desktop, de forma que en esos rangos el header conserve exactamente el
  diseño original.
- La corrección se realizó únicamente en `css/responsive.css`.
  `css/styles.css` y `css/components.css` se mantuvieron sin
  modificaciones en todo el proceso.

### Decisiones finales de breakpoints y justificación

Breakpoints finales implementados en `responsive.css`:

- **Mobile:** `@media (max-width: 767.98px)`.
- **Tablet:** `@media (min-width: 768px)`.
- **Desktop:** `@media (min-width: 1024px)`.

Cada rango cumple la siguiente función:

- **Mobile** agrupa los ajustes de layout en columna para el header, la
  navegación, y la reducción a 1 columna de las secciones con grillas
  (ofertas, servicios, bienvenida, catálogo, footer), además del scroll
  controlado de la tabla y el ancho completo del carrito.
- **Tablet** restaura progresivamente distribuciones de 2 columnas
  (ofertas, servicios, bienvenida, catálogo) y ajusta el ancho del
  carrito a un valor intermedio.
- **Desktop** restaura por completo el diseño original de escritorio
  definido por el Frontend/CSS: 3 columnas en ofertas/servicios/catálogo,
  ancho y sombra originales del carrito, y el layout de 2 columnas del
  footer.

**Desviación respecto de la estrategia mobile-first inicialmente
planificada:** el spec original planteaba una estrategia mobile-first
"pura", en la que los estilos base estarían pensados para mobile y las
media queries irían agregando progresivamente los ajustes de tablet y
desktop. Durante la implementación se detectó que `styles.css` y
`components.css` ya contienen estilos base orientados principalmente a la
distribución de escritorio, en particular en el header (uso de
`position: absolute` con coordenadas fijas). Debido a esto, aplicar los
ajustes de mobile como reglas base (sin encapsular) generaba conflictos
que alteraban el header en tablet y desktop.

Por ese motivo, se tomó la decisión técnica de encapsular las reglas
específicas de mobile dentro de `@media (max-width: 767.98px)`, en lugar
de dejarlas como reglas base globales. Esto permite seguir priorizando una
correcta adaptación de mobile como objetivo principal del trabajo, pero
integrándose de forma segura con los estilos de escritorio ya existentes,
sin necesidad de modificar `styles.css` ni `components.css`. Se documenta
esta situación de forma transparente: la implementación final no es un
mobile-first "puro" a nivel de cascada CSS, sino una adaptación mobile-first
en cuanto a objetivo y cobertura de breakpoints, ajustada técnicamente para
convivir con un sistema de estilos base pensado originalmente para
desktop.

### Pruebas realizadas

Se realizaron pruebas manuales redimensionando la ventana del navegador,
verificando aproximadamente los siguientes anchos:

- **Mobile:** alrededor de 375px.
- **Tablet:** alrededor de 768px.
- **Desktop:** 1024px y tamaños superiores.

En cada rango se revisó visualmente:

- La distribución general de las secciones (ofertas, servicios,
  bienvenida, catálogo, tabla, carrito, footer).
- El comportamiento del header y la navegación.
- La cantidad de columnas del catálogo y las cards de productos.
- El panel del carrito (ancho y visibilidad de la sombra lateral).
- La distribución del footer.
- La ausencia de desbordamientos horizontales visibles en el viewport.

No se utilizaron herramientas de testing automatizado ni pruebas
automatizadas de regresión visual; las verificaciones fueron manuales,
mediante inspección visual en el navegador.