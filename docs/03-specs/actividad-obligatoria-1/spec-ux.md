# Spec — Documentador / Diseñador UX (Actividad Obligatoria N°1)

## Qué se va a hacer

Generar el `README.md` del repositorio y diseñar el mockup inicial de la tienda
online de la ferretería, definiendo la estructura de secciones y la jerarquía
visual de la página, tomando como base los requerimientos funcionales
definidos en `plan.md`.

## Por qué

El README es la primera impresión del proyecto para cualquier persona que
visite el repositorio, y el mockup es la referencia visual que el
Desarrollador Frontend usará (vía MCP de Figma) para generar la estructura
HTML de esta primera entrega. Ambos documentos deben reflejar fielmente el
alcance funcional acordado en `plan.md`, para que el resto del equipo trabaje
sobre una base consistente.

## Proceso con IA (antes de abrir Figma)

Se le pidió a la IA (GitHub Copilot en modo Agente), usando `plan.md` como
contexto, sugerencias de layout, estructura de secciones y jerarquía visual
para la página.

**Sugerido por la IA:**
- Separar la navegación en 4 secciones principales: Inicio, Catálogo,
  Carrito, Contacto.
- En el catálogo, ubicar la búsqueda y los filtros de categoría en la parte
  superior, antes del grid de productos, para priorizar el descubrimiento
  de productos.
- En el carrito, agrupar primero la lista de productos, luego el bloque de
  pago y por último el resumen y confirmación, siguiendo
  un orden de lectura descendente que refleje el flujo de decisión del
  usuario.
- Incluir un contador de productos visible en el ícono del carrito desde
  el header, en todas las páginas.

**Qué se decidió usar:**
- Se adoptó la estructura de 4 secciones y el orden sugerido para el
  carrito (lista → pago → resumen → confirmación), porque respeta
  directamente el orden de los requisitos RF9 a RF24 del `plan.md`.
- Se mantuvo el contador de carrito en el header por consistencia y
  usabilidad (RNF5, RNF6).

**Qué se descartó:**
- La IA sugirió también una sección "Nosotros" con historia de la
  ferretería. Se descartó para esta entrega porque no está contemplada en
  ningún requisito funcional del `plan.md` y agregaría alcance no
  acordado por el equipo; en cambio se puso en la pantalla del inicio abajo una breve presentacion de la ferreteria
- Se descartó agrupar todos los filtros (categoría, precio, marca) desde
  esta entrega, porque el `plan.md` (RF5) solo pide filtrado por
  categoría; los filtros adicionales se dejarán marcados como pendientes
  en el código para etapas futuras.

## Estructura definida

### Inicio
- Header: logo "FerroLAB", barra de búsqueda ("¿Qué estás buscando?"), ícono de carrito con contador, ícono de "Iniciar sesión".
- Barra de navegación secundaria: acceso a menú "CATÁLOGO" (con ícono hamburguesa), y links "INICIO / OFERTAS / DONDE ESTAMOS".
- Carrusel principal: imágenes destacadas con flechas de navegación izquierda/derecha (RF de vidriera de productos/promociones).
- Bloques de confianza: 3 íconos con texto — "Pagá con tarjeta de crédito", "Realizamos envíos a todo el país", "Contactanos!" (vía WhatsApp).
- Sección "OFERTAS": carrusel de productos con imagen, nombre, precio tachado + precio con descuento, y botón "COMPRAR" (RF1, RF2, RF3 del plan.md).
- Galería/foto del local: imagen del local físico de la ferretería, para reforzar la confianza y el hecho de que "en teoría es física"
- Texto de bienvenida: "¡Bienvenidos a FerroLAB!" + párrafo de presentación de la marca.
- Redes sociales: íconos de Instagram, WhatsApp y TikTok.
- Footer: dos columnas — "Contacto" (email, teléfono, horario de atención) y "Ubicación" (mapa embebido).
- Seccion de catalogo que aparece una lista con diferentes tipos,herramientas manuales,herramientas electricas,electricidad y jardineria

### Catálogo
- Header y nav: mismos que en Inicio (buscador, carrito, login, menú CATÁLOGO, nav INICIO/OFERTAS/DONDE ESTAMOS) — mantiene consistencia de navegación en todo el sitio.
- Sidebar de filtros (izquierda):
Filtro por categoría: Accesorios, Herramientas manuales, Herramientas eléctricas,Electricidad y Jardinería (RF5 del plan.md).
Filtro por precio (rango).
- Grid de productos (derecha): tarjetas con imagen, nombre del producto, precio (con precio tachado + descuento cuando aplica), y botón "COMPRAR" (RF1, RF2, RF3).
- Footer: igual al de Inicio — Contacto (email, teléfono, horario) y Ubicación (mapa).

### Carrito
- Formato: panel lateral deslizable ("drawer") que se abre sobre la página actual al hacer clic en el ícono de carrito del header, sin navegar a una página aparte.
- Lista de productos: cada ítem muestra imagen, nombre del producto, precio y selector de cantidad (RF9, RF10, RF11).
- Resumen de costos:
Subtotal (sin envío)
Subtotal (con envío)
Total (RF12, RF13)
- Botón "INICIAR COMPRA": lleva al siguiente paso del proceso de compra.

## Mockup

Diseñado en Figma, exportado como imagen a
`docs/01-mockup/diseño-inicial.png`. Enlace al archivo de Figma incluido
en `README.md` para que el Desarrollador Frontend lo use con el servidor
MCP de Figma.

## Criterios de aceptación

- [ ] `README.md` generado con Copilot en modo Agente, revisado y
      completado manualmente, con toda la información pedida en la
      consigna (título, objetivos, tecnologías, funcionalidades
      previstas, carátula del grupo, enlaces a mockup y prompts).
- [ ] Mockup en Figma exportado a `docs/01-mockup/diseño-inicial.png`,
      mostrando estructura visual clara: secciones, jerarquía de
      contenido y navegación identificables.
- [ ] Enlace al archivo de Figma incluido en `README.md`.
- [ ] Este archivo (`spec-ux.md`) commiteado antes de iniciar el
      desarrollo del README y el mockup.