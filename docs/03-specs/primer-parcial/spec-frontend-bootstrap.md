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

Estoy trabajando en el Primer Parcial del proyecto FerroLab.

Mi rol es Desarrollador Frontend/Bootstrap.

Ya fue creado y commiteado previamente:

docs/03-specs/primer-parcial/spec-frontend-bootstrap.md

Ahora debemos comenzar con la migración a Bootstrap.

Para realizar el análisis debes utilizar Figma MCP y tomar como referencia
el siguiente mockup actualizado de FerroLab:

https://www.figma.com/design/jX7NrMUtt6Tg7oiYqock6s/Sin-t%C3%ADtulo?node-id=0-1&m=dev&t=tw3wIJd3yQfMqFWe-1

Antes de modificar cualquier archivo, analiza:

- docs/03-specs/primer-parcial/spec-frontend-bootstrap.md
- index.html
- css/styles.css
- css/components.css
- css/responsive.css
- plan.md
- README.md
- el mockup actualizado indicado anteriormente mediante Figma MCP

En este paso NO realices modificaciones.
Primero necesito el análisis completo de la migración.

--------------------------------------------------
MIGRACIÓN A BOOTSTRAP
--------------------------------------------------

La migración debe cumplir con lo siguiente:

- Integrar Bootstrap mediante CDN jsDelivr.
- Utilizar Bootstrap 5.3.
- Implementar el sistema de columnas de Bootstrap en las secciones
  correspondientes.
- Mantener la apariencia actual de FerroLab.
- Mantener coherencia con el mockup actualizado obtenido mediante Figma MCP.
- Mantener compatibilidad con:
  css/styles.css
  css/components.css
  css/responsive.css
- Evaluar qué estilos Flexbox, Grid y Media Queries existentes deben
  mantenerse, modificarse o dejar de utilizarse.
- Evitar estilos duplicados o conflictos con Bootstrap.
- Mantener el contenido y funcionalidades existentes.
- Crear posteriormente:
  css/bootstrap-overrides.css
  para las personalizaciones necesarias de Bootstrap.

Analiza el uso necesario de clases como:

- container / container-fluid
- row
- col
- col-*
- col-sm-*
- col-md-*
- col-lg-*
- utilities responsive de Bootstrap

No agregues clases Bootstrap si no son necesarias.

--------------------------------------------------
ANÁLISIS DEL FIGMA
--------------------------------------------------

Utiliza Figma MCP para analizar específicamente el diseño disponible en:

https://www.figma.com/design/jX7NrMUtt6Tg7oiYqock6s/Sin-t%C3%ADtulo?node-id=0-1&m=dev&t=tw3wIJd3yQfMqFWe-1

A partir de la información obtenida mediante Figma MCP:

- Identifica las secciones existentes en el diseño.
- Analiza su distribución visual.
- Analiza la organización de filas y columnas.
- Identifica diferencias entre el mockup y la implementación actual.
- Compara el diseño con index.html.
- Determina qué partes del HTML actual necesitan adaptarse durante
  la migración a Bootstrap.
- Mantén la identidad visual mostrada en el diseño.
- No inventes información que Figma MCP no pueda obtener.

--------------------------------------------------
ANÁLISIS QUE NECESITO
--------------------------------------------------

Necesito que me indiques:

1. Qué información pudiste obtener correctamente del mockup mediante
   Figma MCP.

2. Qué CDN de Bootstrap se deberá incorporar en index.html.

3. En qué orden deberán cargarse Bootstrap y los CSS existentes.

4. Qué secciones REALES del index.html deben migrarse al sistema
   de columnas de Bootstrap.

5. Para cada sección:
   - cómo está estructurada actualmente
   - cómo aparece en el mockup de Figma
   - qué estructura Bootstrap propones
   - qué clases Bootstrap utilizarías
   - comportamiento en móvil
   - comportamiento en tablet
   - comportamiento en escritorio

6. Qué diferencias existen entre index.html y el mockup actualizado
   que sean relevantes para esta migración.

7. Qué reglas de styles.css pueden entrar en conflicto con Bootstrap.

8. Qué reglas de components.css pueden entrar en conflicto con Bootstrap.

9. Qué reglas de responsive.css podrían quedar redundantes después
   de la migración.

10. Qué Flexbox/Grid actuales deben mantenerse y cuáles podrían
    reemplazarse por Bootstrap.

11. Qué estilos deberán colocarse posteriormente en:

    css/bootstrap-overrides.css

12. Qué riesgos existen de romper el diseño actual.

13. En qué orden conviene realizar la migración.

14. Qué elementos deberán volver a verificarse posteriormente contra
    el mockup mediante Figma MCP después de implementar Bootstrap.

--------------------------------------------------
RESTRICCIONES
--------------------------------------------------

En este paso NO modifiques ningún archivo.

NO modifiques:

- index.html
- css/styles.css
- css/components.css
- css/responsive.css
- docs/03-specs/primer-parcial/spec-frontend-bootstrap.md
- plan.md
- README.md
- changelog.md

NO crees todavía:

- css/bootstrap-overrides.css
- archivos de testing
- componentes nuevos
- funcionalidades nuevas

NO elimines código existente.

NO reformatees archivos completos.

NO cambies contenido existente.

NO agregues componentes Bootstrap que correspondan al rol de otro
integrante del grupo.

NO inventes secciones que no existan en index.html o en el mockup.

Si Figma MCP no puede acceder a alguna parte del diseño, indícalo
claramente en lugar de asumir su contenido.

Quiero únicamente:

1. análisis del proyecto actual,
2. análisis del mockup mediante Figma MCP,
3. comparación entre ambos,
4. plan de migración a Bootstrap.

Después de revisar este análisis, realizaremos la implementación.

------------------------------------------------------------------

Antes de comenzar la implementación, completa el análisis del mockup
utilizando Figma MCP.

Ya obtuviste la estructura mediante get_metadata.

Ahora utiliza get_design_context sobre el diseño de Figma correspondiente
al nodo 0:1 y, cuando sea necesario, las herramientas de captura disponibles
de Figma MCP.

Necesito completar únicamente la información que quedó pendiente:

- colores
- tipografías
- espaciados
- dimensiones
- distribución visual
- Auto Layout cuando exista
- propiedades relevantes de los componentes
- fidelidad visual de las secciones que serán migradas

Contrasta esta información con el análisis de migración que acabas de realizar.

Si la nueva información requiere corregir alguna parte del plan de migración,
indica exactamente qué punto cambia y por qué.

No modifiques todavía ningún archivo del proyecto.
No generes código todavía.

Quiero completar primero el análisis de Figma antes de comenzar la
implementación de Bootstrap.

------------------------------------------------------------------

Ya completamos el análisis del proyecto y del mockup mediante Figma MCP.

Ahora realiza la implementación de la migración a Bootstrap correspondiente
a mi rol de Desarrollador Frontend/Bootstrap.

Utiliza como base:

- docs/03-specs/primer-parcial/spec-frontend-bootstrap.md
- index.html
- css/styles.css
- css/components.css
- css/responsive.css
- el análisis de migración realizado anteriormente
- el análisis complementario realizado mediante Figma MCP
- el mockup de Figma ya analizado

IMPLEMENTACIÓN

1. Integra Bootstrap 5.3 mediante CDN jsDelivr en index.html.

2. Mantén el orden de estilos definido durante el análisis:

   - Bootstrap
   - styles.css
   - components.css
   - responsive.css
   - bootstrap-overrides.css

3. Crea:

   css/bootstrap-overrides.css

   Utilízalo únicamente para los ajustes necesarios para integrar Bootstrap
   manteniendo la identidad visual existente.

4. Migra al sistema de columnas de Bootstrap únicamente las secciones
   identificadas durante el análisis:

   - Ofertas
   - Servicios
   - Bienvenida
   - Catálogo
   - Footer

5. Utiliza row, col-* y las utilities responsive necesarias según el plan
   previamente definido.

6. Mantén el comportamiento responsive definido:

   Ofertas:
   - móvil: 1 columna
   - tablet: 2 columnas
   - escritorio: 3 columnas

   Servicios:
   - móvil: 1 columna
   - tablet: 2 columnas
   - escritorio: 3 columnas

   Bienvenida:
   - móvil: imágenes apiladas
   - desde tablet: 2 columnas
   - utilizar row g-0 para mantener las imágenes sin separación

   Catálogo:
   - móvil: filtros arriba y productos en 1 columna
   - tablet: filtros a la izquierda y productos en 2 columnas
   - escritorio: filtros a la izquierda y productos en 3 columnas

   Footer:
   - móvil y tablet: contenido apilado
   - escritorio: 2 columnas
   - utilizar g-0 cuando corresponda

7. Mantén los anchos, gutters y ajustes identificados en el análisis de
   Figma cuando sean necesarios para conservar la coherencia visual.

8. Evalúa las reglas existentes de Flexbox, Grid y Media Queries que ahora
   sean reemplazadas por Bootstrap.

   Modifica o elimina únicamente las reglas que resulten realmente
   redundantes o que entren en conflicto con la nueva estructura.

9. Mantén las reglas existentes que siguen siendo necesarias.

10. Utiliza bootstrap-overrides.css para resolver los conflictos de Reboot
    y las personalizaciones identificadas durante el análisis.

RESTRICCIONES

No rediseñes FerroLab.

No agregues contenido nuevo.

No cambies textos existentes.

No implementes el carrusel de ofertas ni agregues sus flechas.

No implementes el carrito como offcanvas.

No agregues funcionalidades JavaScript nuevas.

No implementes componentes que correspondan al rol de otro integrante.

No modifiques el header ni la navegación salvo que sea estrictamente
necesario para evitar un conflicto provocado por Bootstrap.

No modifiques plan.md.

No modifiques README.md.

No modifiques changelog.md.

No completes todavía la evidencia final de
spec-frontend-bootstrap.md.

No crees todavía test-case-6.md.

No reformatees archivos completos.

Conserva la estructura y el formato actual de los archivos siempre que sea
posible y modifica únicamente las líneas necesarias para realizar la
migración.

IMPORTANTE

Antes de finalizar:

- revisa que no hayas eliminado contenido existente;
- revisa que las rutas de imágenes permanezcan iguales;
- revisa que los selectores existentes sigan funcionando;
- revisa que no exista duplicación innecesaria entre Bootstrap y
  responsive.css;
- revisa que la página no genere scroll horizontal;
- informa exactamente qué archivos modificaste y qué cambios realizaste
  en cada uno.

### Archivos utilizados como contexto

Durante la migración a Bootstrap se utilizaron como contexto los siguientes archivos del proyecto:

- `index.html`
- `css/styles.css`
- `css/components.css`
- `css/responsive.css`
- `docs/03-specs/primer-parcial/spec-frontend-bootstrap.md`
- Mockup actualizado de FerroLab consultado mediante Figma MCP.

Además, durante la implementación se creó el archivo:

- `css/bootstrap-overrides.css`

Este archivo se utilizó para complementar Bootstrap y mantener la identidad visual existente del proyecto sin modificar los archivos originales de la librería.


### Resultado obtenido

Se utilizó Figma MCP desde GitHub Copilot en modo Agente para consultar el mockup actualizado de FerroLab y analizar las secciones que debían adaptarse durante la migración a Bootstrap.

A partir del análisis realizado, se incorporó Bootstrap 5.3 mediante CDN y se adaptaron las secciones de **Ofertas, Servicios, Bienvenida, Catálogo y Footer** al sistema de columnas de Bootstrap.

También se creó el archivo `css/bootstrap-overrides.css` para mantener la identidad visual del proyecto y complementar Bootstrap sin modificar sus archivos originales.

Durante la implementación se conservaron los estilos existentes que seguían siendo necesarios y se eliminaron o ajustaron únicamente las reglas de layout que resultaban redundantes con el sistema de columnas de Bootstrap.

### Fidelidad respecto del mockup

La implementación se realizó tomando como referencia el mockup actualizado de FerroLab mediante Figma MCP.

Se mantuvo la estructura visual general del diseño, respetando la distribución de las secciones, colores, tipografías, espaciados y comportamiento responsive.

Durante la revisión se detectó una diferencia en el carrito de compras: los productos se mostraban sin las imágenes presentes en el mockup. Esta diferencia fue corregida reutilizando las imágenes existentes dentro del proyecto y ajustando únicamente la estructura y los estilos necesarios del carrito.

No se agregaron imágenes externas ni funcionalidades nuevas que no estuvieran contempladas en el proyecto.

Las secciones migradas al sistema de columnas de Bootstrap fueron Ofertas, Servicios, Bienvenida, Catálogo y Footer, manteniendo la coherencia visual con el mockup y con los estilos desarrollados en las actividades anteriores.

### Ajustes manuales realizados

Luego de revisar visualmente el resultado de la migración se detectó una diferencia en el carrito de compras respecto del mockup de Figma.

En particular, los productos del carrito no mostraban las imágenes que sí estaban presentes en el diseño original.

Se realizó una corrección tomando nuevamente como referencia el mockup de Figma y reutilizando las imágenes existentes dentro del proyecto, sin incorporar recursos externos.

La corrección se realizó de forma acotada para no modificar las demás secciones ya migradas a Bootstrap ni agregar funcionalidades que no formaran parte del alcance.


### Pruebas a realizar

Para verificar la correcta migración responsive a Bootstrap se realizarán pruebas utilizando Playwright MCP sobre la aplicación ejecutada en `http://localhost:3000`.

Se probarán los siguientes dispositivos requeridos:

- iPhone 14 Pro.
- Samsung Galaxy S23.
- iPad Air.
- Vista de escritorio como comprobación adicional.

Durante las pruebas se verificará:

- Correcta adaptación responsive de las secciones migradas a Bootstrap.
- Ausencia de scroll horizontal.
- Correcta visualización de Ofertas.
- Correcta visualización de Servicios.
- Correcta visualización de Bienvenida.
- Correcta visualización del Catálogo.
- Correcta visualización del Footer.
- Correcta visualización del carrito de compras y sus imágenes.
- Ausencia de textos, imágenes o componentes superpuestos.
- Ausencia de elementos cortados o fuera de pantalla.
- Correcto funcionamiento visual de la navegación.
- Que la incorporación de Bootstrap no haya afectado los estilos existentes del proyecto.

Los resultados obtenidos mediante Playwright MCP serán documentados en:

`docs/04-testing/test-case-6.md`

En caso de detectar errores durante las pruebas, se documentarán y se seguirá el flujo de corrección correspondiente mediante Issues y ramas `fix/`.
