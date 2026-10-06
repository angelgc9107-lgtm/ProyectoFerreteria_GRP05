# Spec: Integración de Bootstrap y migración al sistema de columnas

**Rol:** Desarrollador Frontend/Bootstrap

**Se traza contra:** plan.md — RF1-RF3 y RF6-RF8; RNF5-RNF13

**Entrega:** Primer Parcial de Programación Web I — FerroLab

**Estado:** Documento previo al desarrollo. La implementación todavía no fue realizada.

## Qué se va a hacer

Se incorporará Bootstrap al sitio de FerroLab y se migrarán al sistema de columnas (`container`, `row` y `col-*`) las secciones existentes de `index.html` cuyo layout hoy se resuelve con reglas propias de CSS Grid y Flexbox. La migración se realizará a partir del mockup actualizado (`docs/01-mockup/actividad-obligatoria-2/diseno-con-estilos.png`), utilizando el servidor MCP de Figma junto con GitHub Copilot en modo Agente, y se corregirá manualmente el resultado cuando existan diferencias con el diseño.

Bootstrap se incorporará como una capa adicional. No se reemplazarán los archivos CSS existentes: `css/styles.css`, `css/components.css` y `css/responsive.css` seguirán siendo la base visual del proyecto, y solo se retirarán o ajustarán las reglas de layout que dupliquen o entren en conflicto con las clases de Bootstrap.

Las personalizaciones necesarias para que Bootstrap respete la identidad visual de FerroLab se documentarán aquí y se implementarán posteriormente en un archivo nuevo, `css/bootstrap-overrides.css` (ver sección correspondiente).

En esta instancia únicamente se redacta este spec. No se modifica ningún archivo existente ni se genera código Bootstrap.

## Por qué

- El layout actual depende de reglas propias (`display: grid` en `main`, `#ofertas > div`, `#catalogo > div`, `footer`) y de media queries manuales en `css/responsive.css`. Bootstrap aporta una grilla de 12 columnas y breakpoints estandarizados que simplifican el mantenimiento.
- Permite reducir el CSS de layout propio y mejorar la legibilidad y la mantenibilidad (RNF7, RNF8, RNF10).
- Facilita la compatibilidad con distintos tamaños de pantalla (RNF13) manteniendo la presentación clara de productos, precios y opciones de compra (RNF5, RNF6).
- La correspondencia funcional con `plan.md` sigue siendo RF1-RF3 y RF6-RF8, ya que no se agregan funcionalidades nuevas: se cambia la forma de maquetar el contenido existente.

La interactividad con JavaScript (búsqueda, filtros, carrito, cálculos, validación y pagos) no forma parte del alcance de este rol.

## Versión e instalación de Bootstrap

- **Versión prevista:** Bootstrap 5.3.x (se fijará una versión exacta, por ejemplo la última 5.3 estable disponible en jsDelivr al momento de implementar, sin usar `@latest`).
- **Forma de instalación:** CDN jsDelivr, sin instalar dependencias locales ni agregar un proceso de compilación.
- **Recursos a incluir:**
  - CSS de Bootstrap en el `<head>` de `index.html`.
  - Bundle JS de Bootstrap (incluye Popper) antes del cierre de `</body>`, solo si algún componente lo requiere (por ejemplo, menú colapsable de navegación).
- **Integridad:** se agregarán los atributos `integrity` y `crossorigin="anonymous"` con los valores publicados por jsDelivr para la versión elegida; no se transcribirán hashes de memoria.
- **Orden de carga de los CSS previsto:**
  1. Bootstrap (CDN jsDelivr).
  2. `css/styles.css`.
  3. `css/components.css`.
  4. `css/responsive.css`.
  5. `css/bootstrap-overrides.css`.

Bootstrap se carga primero para que los estilos propios del proyecto puedan sobrescribirlo sin recurrir a `!important`. El archivo de overrides se carga al final por ser el que concilia ambas capas.

## Estado actual del proyecto (análisis previo)

- **`index.html`:** estructura semántica sin clases de layout. Contiene `header#inicio` (logo, buscador, carrito, "Iniciar sesion" y `nav` con `details` de categorías), `main` con seis bloques y `footer#ubicacion` con tres secciones. Solo existen algunas clases puntuales (`filter-heading--*`, `cart-item--*`).
- **`css/styles.css`:** variables en `:root` (colores, tipografía, espaciados, bordes, `--content-width`, `--cart-width`, `--catalog-columns`, `--filters-width`), reset, `box-sizing` global, estilos base y layout con `display: grid` en `main`.
- **`css/components.css`:** estilos de header, navegación, tarjetas del catálogo, botones, filtros del catálogo (posicionados por `grid-row`/`grid-column`), servicios, bienvenida, formulario de contacto, tabla y carrito.
- **`css/responsive.css`:** media queries manuales para mobile (hasta 767.98px), tablet (desde 768px) y desktop (desde 1024px).
- **`plan.md`:** define RF1-RF24 y RNF1-RNF15; el alcance actual corresponde a la estructura y presentación de RF1-RF3 y RF6-RF8.
- **Mockup:** `diseno-con-estilos.png` (versión con estilos) y `diseño-inicial.png` (versión inicial), tomados como referencia visual.

## Secciones a migrar al sistema de columnas

Solo se contemplan secciones que existen actualmente en `index.html`.

| Sección (selector actual) | Contenido real | Propuesta con Bootstrap |
|---|---|---|
| `header#inicio` | Logo, buscador, enlace "Carrito (0)", "Iniciar sesion" y `nav` | `container`/`row` con columnas para logo, buscador y accesos; evaluar `navbar` de Bootstrap para la navegación. |
| `#ofertas` | 3 `article` (amoladora, kit de tapones, martillo) | `row` con `col-12 col-md-6 col-lg-4` por tarjeta. |
| Servicios (`section[aria-label="Servicios de FerroLab"]`) | 3 ítems de lista (tarjeta, envíos, asesoramiento) | `row` con `col-12 col-md-4` por ítem. |
| Bienvenida (`section[aria-labelledby="bienvenida"]`) | 2 imágenes, título y texto | `row` con columna de imágenes y columna de texto, apiladas en pantallas chicas. |
| `#catalogo` | `aside` de filtros y 9 tarjetas de producto | `row` con `col-lg-3` para filtros y `col-lg-9` para el listado; dentro, `row` con `col-12 col-sm-6 col-xl-4` por tarjeta. |
| "Precios destacados" | Tabla de 4 productos | Mantener `table`; evaluar contenedor `table-responsive`. |
| `#carrito` | Panel con 2 ítems, total y botón "Iniciar compra" | Mantener su presentación actual; migrar solo la distribución interna si el mockup lo permite. |
| `#contacto` | Formulario con nombre, correo, motivo y mensaje | `container` y `row` con columnas para los campos. |
| `footer#ubicacion` | Redes sociales, contacto y ubicación (mapa) | `row` con `col-12 col-md-4` por bloque. |

Los selectores y las clases exactas se confirmarán al implementar, contrastando el resultado con el mockup. Si una sección no puede migrarse sin perder fidelidad visual, se mantendrá con su CSS actual y se dejará constancia en la evidencia.

## Estrategia de integración con los estilos existentes

1. **Preservar el diseño del mockup:** la apariencia visual definida en `styles.css` y `components.css` (colores, tipografía Inter, tarjetas, botones rojos, carrito) tiene prioridad sobre los valores por defecto de Bootstrap.
2. **Reutilizar las variables propias:** las personalizaciones se apoyarán en las variables de `:root` (`--color-red`, `--space-*`, `--font-family-base`, etc.) y, cuando corresponda, en las variables CSS de Bootstrap 5.3 (`--bs-*`).
3. **`css/styles.css`:** se retirarán o ajustarán únicamente las reglas de layout que Bootstrap reemplace (por ejemplo, la grilla de `main` y las grillas de `#ofertas` y el catálogo). Las variables, el reset y los estilos globales se conservan.
4. **`css/components.css`:** se mantienen los estilos de componentes (botones, tarjetas, formularios, navegación, carrito). Se revisarán posibles choques con clases de Bootstrap como `.btn`, `.card`, `.navbar` o `.form-control`, y se evitará duplicar valores.
5. **`css/responsive.css`:** se revisarán las media queries manuales (767.98px, 768px y 1024px) frente a los breakpoints de Bootstrap (`sm` 576px, `md` 768px, `lg` 992px, `xl` 1200px). Las reglas que Bootstrap cubra se eliminarán para evitar duplicación; las que sigan siendo necesarias se conservarán y se documentarán.
6. **Especificidad:** se evitará `!important` salvo justificación técnica explícita, aprovechando el orden de carga de los CSS.
7. **Semántica y accesibilidad:** se mantiene la estructura semántica existente (`header`, `main`, `section`, `article`, `aside`, `footer`), los textos alternativos y los `label` de los formularios.
8. **Separación de responsabilidades:** HTML para estructura, CSS para presentación y JavaScript para interactividad. No se agrega lógica propia de FerroLab.

## Archivo `css/bootstrap-overrides.css` (creación posterior)

No se crea en esta instancia. Una vez integrado Bootstrap, se creará `css/bootstrap-overrides.css` para centralizar las personalizaciones y evitar modificar los archivos de Bootstrap o dispersar ajustes en los demás CSS. Su contenido previsto:

- Variables `--bs-*` alineadas con la paleta de FerroLab (colores primarios, texto y fondo) y la tipografía base.
- Ajuste de gutters, anchos máximos de `container` y espaciados para respetar las proporciones del mockup.
- Adaptación de componentes de Bootstrap usados (botones, formularios, navegación) para igualar colores, bordes, radios y estados `hover`/`focus`/`active`.
- Resolución de conflictos puntuales entre clases de Bootstrap y reglas existentes.

Cada regla llevará un comentario breve cuando su motivo no sea evidente, y el archivo se enlazará al final del `<head>`.

## Criterios de aceptación

- [ ] Dado el spec preparado, cuando se cree el primer commit del parcial, entonces este archivo queda commiteado antes que cualquier cambio de código Bootstrap.
- [ ] Dado `index.html`, cuando se revise el `<head>`, entonces Bootstrap se carga mediante CDN jsDelivr con versión fija e `integrity`/`crossorigin` correctos.
- [ ] Dado el orden de carga, cuando se inspeccionen los enlaces, entonces Bootstrap precede a `styles.css`, `components.css`, `responsive.css` y `bootstrap-overrides.css`.
- [ ] Dadas las secciones existentes indicadas en este spec, cuando se revise el HTML, entonces se maquetan con el sistema de columnas de Bootstrap (`container`, `row`, `col-*`) y no se agregaron secciones inexistentes.
- [ ] Dado el layout migrado, cuando se redimensione la ventana, entonces las columnas se reorganizan correctamente en los breakpoints definidos sin solapamientos ni desbordes horizontales.
- [ ] Dado el resultado, cuando se compare con el mockup, entonces mantiene colores, tipografías, jerarquía, proporciones y espaciados, y las diferencias quedan documentadas.
- [ ] Dado `css/bootstrap-overrides.css`, cuando se revise, entonces contiene únicamente las personalizaciones necesarias, reutiliza las variables del proyecto y no abusa de `!important`.
- [ ] Dados `styles.css`, `components.css` y `responsive.css`, cuando se revisen, entonces no quedan reglas de layout duplicadas o en conflicto con Bootstrap.
- [ ] Dado el HTML final, cuando se revise, entonces conserva la estructura semántica, los textos alternativos y los `label` existentes, y no incluye estilos inline.
- [ ] Dado el sitio ejecutado en localhost y en GitHub Pages, cuando se realice la comprobación visual, entonces se visualiza correctamente en mobile, tablet y desktop.
- [ ] Dado el cierre de la actividad, cuando se revise este documento, entonces la sección de evidencia está completa con información real.

## Evidencia (completar al finalizar el desarrollo)

> Esta sección permanece vacía hasta concluir la implementación. No se debe completar con información estimada ni ficticia.

### Prompt exacto utilizado con Figma MCP / Copilot Agent

```
(pendiente)
```

### Archivos utilizados como contexto

- (pendiente)

### Resultado obtenido

(pendiente)

### Fidelidad respecto del mockup

(pendiente)

### Ajustes manuales realizados

- (pendiente)

### Pruebas realizadas

- (pendiente)
