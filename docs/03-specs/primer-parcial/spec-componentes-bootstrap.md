# Spec: Implementación de Componentes Avanzados Bootstrap

**Rol:** Especialista en Componentes Bootstrap

**Entrega:** Primer Parcial — FerroLab

## Qué se va a hacer

Se implementarán al menos dos componentes avanzados de Bootstrap dentro del sitio web de FerroLab, integrándolos con la estructura existente del proyecto y con la migración a Bootstrap realizada por el Desarrollador Frontend/Bootstrap.

Los componentes seleccionados serán:

- Componente Bootstrap 1:

**Dropdown**

**Ubicación dentro del sitio:** Opción "Categorías" de la navegación principal.

**Justificación:** Se utilizará el componente Dropdown de Bootstrap para
reemplazar el menú desplegable de categorías actualmente implementado mediante
los elementos HTML `details` y `summary`. El componente permitirá mantener las
categorías existentes utilizando un componente avanzado de Bootstrap y
conservando la identidad visual definida para la navegación de FerroLab.


- Componente Bootstrap 2: 

**Offcanvas** 

**Ubicación dentro del sitio:** Carrito de compras.

**Justificación:** Se utilizará el componente Offcanvas de Bootstrap para
implementar el panel lateral del carrito de compras. El proyecto ya cuenta con
un carrito diseñado visualmente como un panel lateral, por lo que este
componente permite adaptar la estructura existente a Bootstrap manteniendo
los productos, cantidades, subtotales y total representativo actualmente
definidos.


Los componentes serán personalizados mediante `css/bootstrap-overrides.css` para mantener la identidad visual del proyecto y la coherencia con los estilos existentes.

La implementación se realizará coordinadamente con el Desarrollador Frontend/Bootstrap para evitar conflictos con la instalación de Bootstrap, el sistema de columnas y los estilos generales de la migración.

Cada componente será validado mediante Playwright MCP contra `http://localhost:3000`, comprobando su funcionamiento e integración en los dispositivos requeridos.

Los resultados se documentarán en:

- `docs/04-testing/test-case-7.md`
- `docs/04-testing/test-case-8.md`

Por cada hallazgo relevante detectado durante las pruebas se creará un issue tipo bug utilizando GitHub MCP desde Copilot Agent Mode.

Las correcciones necesarias se realizarán posteriormente mediante ramas `fix/` contra `develop` y serán documentadas en `[Fixed]` dentro de `changelog.md`.

## Por qué

La implementación de componentes avanzados de Bootstrap permite incorporar componentes reutilizables y funcionales manteniendo una integración coherente con la migración general del proyecto a Bootstrap.

La personalización mediante `bootstrap-overrides.css` permitirá adaptar los componentes seleccionados a la identidad visual de FerroLab sin modificar directamente los archivos originales de Bootstrap.

Las pruebas mediante Playwright MCP permitirán comprobar el funcionamiento de cada componente en distintos dispositivos y detectar posibles problemas de integración, visualización o interacción.

## Criterios de aceptación

- [X] El archivo `spec-componentes-bootstrap.md` fue creado y commiteado antes de implementar componentes Bootstrap.

- [X] Se seleccionaron al menos dos componentes avanzados de Bootstrap y se justificó su utilización.

- [X] El primer componente Bootstrap fue implementado correctamente.

- [X] El segundo componente Bootstrap fue implementado correctamente.

- [x] Los componentes mantienen coherencia con la estructura existente de `index.html`.

- [x] Los componentes fueron personalizados mediante `css/bootstrap-overrides.css`.

- [x] La implementación mantiene coherencia visual con los estilos existentes del proyecto.

- [X] La implementación fue coordinada con los cambios realizados por el Desarrollador Frontend/Bootstrap.

- [X] Cada componente funciona correctamente en los dispositivos requeridos.

- [X] El componente 1 fue probado mediante Playwright MCP y documentado en `docs/04-testing/test-case-7.md`.

- [X] El componente 2 fue probado mediante Playwright MCP y documentado en `docs/04-testing/test-case-8.md`.

- [X] Las pruebas fueron realizadas en iPhone 14 Pro (iOS Safari).

- [X] Las pruebas fueron realizadas en Samsung Galaxy S23 (Chrome Android).

- [X] Las pruebas fueron realizadas en iPad Air (iOS Safari).

- [X] Por cada hallazgo relevante se creó un issue tipo bug mediante GitHub MCP desde Copilot Agent Mode.

- [X] Los issues encontrados fueron corregidos mediante ramas `fix/` contra `develop`.

- [ ] Las correcciones fueron documentadas en `[Fixed]` dentro de `changelog.md`.

- [ ] Al finalizar la tarea, este spec contiene los prompts utilizados, resultados obtenidos, ajustes manuales y hallazgos de las pruebas.


## Plan de testing con Playwright MCP

Cada componente será probado mediante Playwright MCP utilizando el sitio ejecutado en:

`http://localhost:3000`

Se verificará:

- Correcta visualización del componente.
- Funcionamiento de sus elementos interactivos.
- Integración con la estructura existente.
- Coherencia con los estilos del proyecto.
- Funcionamiento en diferentes dispositivos.
- Ausencia de solapamientos o problemas de visualización.
- Comportamiento esperado de los estados interactivos correspondientes.

Los dispositivos obligatorios serán:

- iPhone 14 Pro (iOS Safari).
- Samsung Galaxy S23 (Chrome Android).
- iPad Air (iOS Safari).

El componente 1 será documentado en:

`docs/04-testing/test-case-7.md`

El componente 2 será documentado en:

`docs/04-testing/test-case-8.md`

## Prompt utilizado con Copilot Agent Mode

# 1° implementación del componente avanzado de Bootstrap

``` 
Actúa exclusivamente como Especialista en Componentes Bootstrap del proyecto FerroLab.

Debes implementar ÚNICAMENTE el primer componente avanzado definido en el spec-especialista-bootstrap.md:

Bootstrap Dropdown

Ubicación:
Opción "Categorías" de la navegación principal.
--------------------------------------------------
CONTEXTO
--------------------------------------------------

Antes de modificar el proyecto:

1. Revisa la implementación actual de la navegación en:
   - index.html
   - css/components.css
   - css/responsive.css
   - css/bootstrap-overrides.css

2. Identifica la implementación actual de "Categorías", realizada mediante
   los elementos HTML <details> y <summary>.

3. Comprueba la integración existente de Bootstrap y utiliza la versión
   actualmente instalada/cargada en el proyecto.

No cambies la instalación ni la versión de Bootstrap.

--------------------------------------------------
IMPLEMENTACIÓN
--------------------------------------------------

Reemplaza exclusivamente la implementación actual de "Categorías" mediante
<details> y <summary> por un componente Dropdown oficial de Bootstrap.

Utiliza las clases y atributos oficiales correspondientes al Dropdown de
Bootstrap 5.3.

El Dropdown debe:

- mantener el texto "Categorías";
- conservar todas las categorías existentes;
- conservar los enlaces y destinos existentes;
- utilizar las clases Bootstrap correspondientes;
- utilizar los atributos data-bs-* necesarios;
- funcionar utilizando el Bootstrap Bundle que ya está incorporado;
- mantener una estructura semántica y accesible;
- integrarse con la navegación existente;
- mantener la identidad visual de FerroLab.

No agregues categorías.
No elimines categorías.
No cambies los href existentes.
No agregues JavaScript personalizado si Bootstrap ya proporciona el
comportamiento necesario.

--------------------------------------------------
PERSONALIZACIÓN VISUAL
--------------------------------------------------

Personaliza el Dropdown para que mantenga coherencia con el diseño actual
de FerroLab.

Las personalizaciones específicas del componente Bootstrap deben realizarse
principalmente en:

css/bootstrap-overrides.css

Utiliza las variables CSS existentes del proyecto siempre que sea posible.

Revisa en components.css los estilos correspondientes a la implementación
anterior, especialmente reglas relacionadas con:

- nav details
- nav summary
- nav details ul
- nav details li

Si alguna regla queda obsoleta exclusivamente porque <details> y <summary>
fueron reemplazados por el Dropdown de Bootstrap, puede eliminarse o
adaptarse.

No elimines reglas que continúen siendo utilizadas por otros elementos.

No realices una refactorización general de components.css.

--------------------------------------------------
RESPONSIVE
--------------------------------------------------

Integra el Dropdown respetando el comportamiento responsive existente.

No rediseñes la navegación.
No agregues un navbar collapse/toggler.
No modifiques breakpoints que no sean necesarios para integrar el Dropdown.
No modifiques otras secciones del sitio.

--------------------------------------------------
LÍMITES
--------------------------------------------------

Implementa ÚNICAMENTE el Dropdown de Categorías.

NO modifiques el carrito.

NO implementes otros componentes avanzados Bootstrap.

NO modifiques innecesariamente:

- Ofertas
- Servicios
- Bienvenida
- Catálogo
- Filtros
- Productos
- Tabla
- Contacto
- Footer

NO realices commits.
NO realices push.
NO realices merges.
NO abras Pull Requests.
NO crees ni cambies ramas Git.

--------------------------------------------------
AL FINALIZAR
--------------------------------------------------

Revisa el diff completo antes de finalizar y confirma que todos los cambios
pertenecen exclusivamente a la implementación del Dropdown de Categorías.

Luego informa:

1. Qué se modificó en index.html.
2. Qué clases Bootstrap fueron utilizadas.
3. Qué atributos data-bs-* fueron utilizados.
4. Qué se modificó en bootstrap-overrides.css.
5. Si fue necesario modificar components.css y por qué.
6. Qué estilos anteriores de <details>/<summary> quedaron obsoletos.
7. Si fue necesario modificar responsive.css.
8. Todos los archivos modificados.
9. Confirma que no se agregó JavaScript personalizado.
10. Confirma que no se modificó ni implementó el Offcanvas del carrito.

No realices ninguna prueba automatizada en esta etapa.
``` 
# 2° implementación del componente avanzado de bootstrap

``` 
Actúa exclusivamente como Especialista en Componentes Bootstrap del proyecto FerroLab.

Debes implementar ÚNICAMENTE el segundo componente avanzado definido en el
spec-especialista-bootstrap.md:

Bootstrap Offcanvas

Ubicación:
Carrito de compras de FerroLab.

--------------------------------------------------
CONTEXTO
--------------------------------------------------

Antes de modificar el proyecto:

1. Revisa la implementación actual del carrito en:
   - index.html
   - css/components.css
   - css/responsive.css
   - css/bootstrap-overrides.css

2. Identifica la implementación actual del panel lateral del carrito,
   incluyendo:
   - botón o control que abre el carrito;
   - panel lateral;
   - botón de cierre;
   - overlay;
   - contenido interno del carrito;
   - badge o contador del carrito;
   - subtotal y demás elementos existentes.

3. Identifica los estilos actuales asociados al carrito en components.css
   y responsive.css.

4. Comprueba la integración existente de Bootstrap y utiliza la versión
   actualmente instalada/cargada en el proyecto.

5. Ten en cuenta que el Dropdown de Categorías ya fue implementado como
   componente Bootstrap y NO debe ser modificado durante esta tarea.

No cambies la instalación ni la versión de Bootstrap.

--------------------------------------------------
IMPLEMENTACIÓN
--------------------------------------------------

Reemplaza exclusivamente el comportamiento actual del panel lateral del
carrito por un componente Offcanvas oficial de Bootstrap.

Utiliza las clases y atributos oficiales correspondientes al Offcanvas de
Bootstrap 5.3.

El Offcanvas debe:

- mantener el carrito existente;
- mantener el botón o control existente que abre el carrito;
- mantener el contenido actual del carrito;
- mantener el badge o contador existente;
- mantener los productos, cantidades, precios, subtotal y demás información
  existente;
- mantener el botón o control de cierre;
- abrirse como panel lateral desde el mismo lado utilizado actualmente por
  el diseño;
- utilizar las clases Bootstrap correspondientes;
- utilizar los atributos data-bs-* necesarios;
- utilizar el backdrop/overlay proporcionado por Bootstrap;
- poder cerrarse mediante el mecanismo oficial de Bootstrap;
- funcionar utilizando el Bootstrap Bundle que ya está incorporado;
- mantener una estructura semántica y accesible;
- mantener la identidad visual de FerroLab.

No elimines funcionalidades existentes del carrito.
No cambies textos, precios, productos o información existente salvo que sea
estrictamente necesario para integrar el componente.
No agregues JavaScript personalizado para abrir o cerrar el Offcanvas si
Bootstrap ya proporciona ese comportamiento mediante su API declarativa.

Si existe actualmente JavaScript personalizado utilizado exclusivamente para
abrir/cerrar el panel lateral o controlar su overlay, revisa si queda obsoleto
al utilizar Bootstrap Offcanvas.

Elimina o adapta únicamente el código que haya quedado obsoleto como
consecuencia directa de la implementación del Offcanvas.

No elimines JavaScript utilizado para otras funcionalidades del carrito.

--------------------------------------------------
PERSONALIZACIÓN VISUAL
--------------------------------------------------

Personaliza el Offcanvas para que mantenga la apariencia actual del carrito
y la identidad visual de FerroLab.

Las personalizaciones específicas del componente Bootstrap deben realizarse
principalmente en:

css/bootstrap-overrides.css

Utiliza las variables CSS existentes del proyecto siempre que sea posible.

Revisa en components.css los estilos correspondientes a la implementación
actual del carrito, especialmente reglas relacionadas con:

- panel lateral del carrito;
- posición y dimensiones;
- encabezado del carrito;
- botón de cierre;
- contenido interno;
- productos;
- cantidades;
- precios;
- subtotal;
- badge del carrito;
- overlay/backdrop.

Si alguna regla queda obsoleta exclusivamente porque el panel actual fue
reemplazado por Bootstrap Offcanvas, puede eliminarse o adaptarse.

No elimines reglas que continúen siendo utilizadas por el contenido interno
o por otras funcionalidades del carrito.

No realices una refactorización general de components.css.

El backdrop del Offcanvas debe integrarse visualmente con el diseño existente
sin crear un segundo overlay personalizado innecesario.

--------------------------------------------------
RESPONSIVE
--------------------------------------------------

Integra el Offcanvas respetando el comportamiento responsive existente del
carrito.

Revisa específicamente su comportamiento en:

- desktop;
- tablet;
- mobile.

Mantén, en la medida de lo posible, las dimensiones y comportamiento visual
actuales definidos para cada viewport.

No cambies breakpoints que no sean necesarios para integrar el Offcanvas.
No rediseñes el carrito.
No modifiques otras secciones del sitio.

--------------------------------------------------
ACCESIBILIDAD
--------------------------------------------------

Utiliza la estructura y atributos recomendados por Bootstrap para el
Offcanvas.

Verifica durante la implementación que:

- el control que abre el carrito esté correctamente asociado al Offcanvas;
- el Offcanvas tenga un identificador único;
- exista un título o encabezado accesible;
- el botón de cierre utilice el mecanismo oficial de Bootstrap;
- los atributos aria-* necesarios estén correctamente asociados;
- la navegación mediante teclado no se vea perjudicada.

No agregues atributos ARIA innecesarios si Bootstrap ya administra
determinados estados automáticamente.

--------------------------------------------------
LÍMITES
--------------------------------------------------

Implementa ÚNICAMENTE el Offcanvas del carrito.

NO modifiques el Dropdown de Categorías ya implementado.

NO implementes otros componentes avanzados Bootstrap.

NO modifiques innecesariamente:

- Navegación
- Ofertas
- Servicios
- Bienvenida
- Catálogo
- Filtros
- Productos
- Tabla
- Contacto
- Footer

NO realices una refactorización general del carrito.

NO realices commits.
NO realices push.
NO realices merges.
NO abras Pull Requests.
NO crees ni cambies ramas Git.

--------------------------------------------------
AL FINALIZAR
--------------------------------------------------

Revisa el diff completo antes de finalizar y confirma que todos los cambios
pertenecen exclusivamente a la implementación del Offcanvas del carrito.

Luego informa:

1. Qué se modificó en index.html.
2. Qué clases Bootstrap Offcanvas fueron utilizadas.
3. Qué atributos data-bs-* fueron utilizados.
4. Qué se modificó en bootstrap-overrides.css.
5. Si fue necesario modificar components.css y por qué.
6. Qué estilos anteriores del panel lateral quedaron obsoletos.
7. Si fue necesario modificar responsive.css y por qué.
8. Si existía un overlay personalizado y qué ocurrió con él al utilizar el
   backdrop oficial de Bootstrap.
9. Si existía JavaScript personalizado para abrir/cerrar el carrito y si fue
   necesario eliminarlo o adaptarlo.
10. Todos los archivos modificados.
11. Confirma que el contenido y las funcionalidades existentes del carrito
    fueron conservados.
12. Confirma que el Dropdown de Categorías no fue modificado.
13. Confirma que no se implementaron otros componentes Bootstrap fuera del
    Offcanvas.

No realices ninguna prueba automatizada en esta etapa.
No utilices Playwright MCP todavía.
``` 

## Resultado obtenido del prompt

# Resultado del prompt de la 1° implementación

``` 
Implementé únicamente el Dropdown de Categorías. Revisé el diff completo: los cambios se limitan al componente y su integración.

En index.html, reemplacé <details>/<summary> por un botón Dropdown y conservé las cinco categorías y sus href="#catalogo". El texto ahora aparece como “Categorías”.
Usé las clases Bootstrap dropdown, btn, dropdown-toggle, dropdown-menu y dropdown-item.
El botón usa data-bs-toggle="dropdown" y aria-expanded="false"; la lista se asocia al botón con aria-labelledby.
En bootstrap-overrides.css, adapté colores, espaciado, bordes, sombra y estados hover/focus para mantener la identidad visual de FerroLab.
Modifiqué components.css para aplicar los estilos de navegación al nuevo botón y retirar reglas exclusivas de <details>/<summary>.
Quedaron obsoletas las reglas nav details, nav details ul y nav details li + li; el espaciado entre opciones se conserva con la nueva estructura.
No fue necesario modificar responsive.css.
Archivos modificados: index.html, components.css y bootstrap-overrides.css.
No agregué JavaScript personalizado. Detecté que, pese a lo indicado en el prompt, el proyecto cargaba Bootstrap CSS 5.3.8 pero no su Bundle JavaScript. Añadí el Bundle oficial 5.3.8 con SRI para que el componente funcione; no cambié la versión.
No modifiqué ni implementé el Offcanvas del carrito.
No ejecuté pruebas automatizadas, según lo solicitado. git diff --check no reportó problemas de formato.
```
# Resultado del prompt de la 2° implementación

``` 
Implementé exclusivamente el Bootstrap Offcanvas del carrito, sin ejecutar Playwright ni pruebas automatizadas.

En index.html, convertí el acceso al carrito en un botón conectado al panel y el <aside> existente en un Offcanvas que se desliza desde la derecha. Conservé el título, los productos, las cantidades, los precios, los subtotales, el total y el botón de compra.
Clases Bootstrap utilizadas: offcanvas, offcanvas-end, offcanvas-header, offcanvas-body, btn-close y btn-close-white.
Atributos de interacción: data-bs-toggle, data-bs-target, data-bs-dismiss, data-bs-backdrop y data-bs-keyboard. El panel mantiene aria-labelledby y tabindex="-1"; el botón de apertura usa aria-controls.
En bootstrap-overrides.css, adapté el color, el ancho, el borde, la sombra, la cabecera y el cierre a las variables FerroLab. Los anchos quedan configurados para desktop (35%), tablet (60%) y mobile (100%).
Modifiqué components.css para adaptar el acceso y los selectores del contenido al nuevo encabezado y cuerpo del Offcanvas.
Retiré los estilos de posicionamiento del panel estático, el cierre personalizado .cart-close y el pseudo-elemento decorativo #carrito::before.
Modifiqué responsive.css para ajustar los selectores del acceso, ahora botón, y retirar reglas de ancho y pseudo-elemento que ya no corresponden al Offcanvas.
El pseudo-elemento anterior era decoración lateral, no un backdrop funcional. Lo eliminé y el panel usa el backdrop oficial de Bootstrap, sin añadir un segundo overlay.
No encontré JavaScript personalizado que abra o cierre el carrito. La apertura, el cierre y el teclado usan los mecanismos declarativos del Bootstrap Bundle 5.3.8 ya cargado.
Archivos modificados: index.html, components.css, responsive.css, bootstrap-overrides.css y styles.css. En este último retiré la asignación de columna de grilla que pertenecía al panel estático.
El contenido y la información del carrito se conservaron; también se mantuvo el control “Carrito (0)”.
El Dropdown de Categorías no fue modificado.
No implementé otros componentes Bootstrap.
Revisé el diff completo y git diff --check no reportó problemas. No hice commits, push, merges ni cambios de rama.
``` 

## Ajustes manuales realizados
- Adaptación de estilos para mantener la identidad visual de FerroLab.
- Ajustes de comportamiento responsive.
- Corrección de sombras en Dropdown y Offcanvas.
- Ajustes menores de accesibilidad e interacción.
## Pruebas realizadas con Playwright MCP

- docs\04-testing\test-case-7.md
- docs\04-testing\test-case-8.md

### Test Case 7 — Componente Bootstrap 1

``` 
Resultado de Playwright
El Dropdown funcionó en los tres tamaños: al activarlo, aria-expanded cambió a true y apareció el menú con las cinco categorías y sus destinos #catalogo. También comprobé que Escape lo cierra y devuelve el foco al botón.

Viewport	Visible y funcional	Adaptación y visual
Desktop, 1280×800	Sí; abre y cierra correctamente.	Mantiene los colores y la tipografía definidos.
Mobile, 390×844	Sí; abre, muestra todas las opciones y se cierra con Escape.	El menú cabe en pantalla y no genera overflow horizontal. El área útil medida por el navegador fue de 375 px por la barra de desplazamiento.
Tablet, 768×1024	Sí; abre y cierra correctamente.	No genera overflow horizontal y conserva los estilos. El área útil medida fue de 753 px por la barra de desplazamiento.
Estilos comprobados: el botón usa texto blanco y la tipografía Inter, Arial, Helvetica, sans-serif; el menú tiene fondo blanco, borde gris y radio de 4 px; al pasar sobre una opción, esta toma el rojo FerroLab con texto blanco. El CSS declara una variable de sombra, pero el navegador computa box-shadow: none: esa sombra no se está aplicando.

Transición: el menú aparece y desaparece de forma instantánea (transition-duration: 0s). Bootstrap Dropdown no anima la apertura por defecto; no observé un fallo funcional.

Bootstrap 5.3.8 y sus estilos cargaron correctamente. La consola mostró un 404 para /favicon.ico, ajeno al Dropdown.

Capturas guardadas
Desktop: inicial · abierto
Mobile: inicial · abierto
Tablet: inicial · abierto
No modifiqué código ni el documento test-case-7.md durante esta comprobación. Dejé detenido el servidor local que inicié para la prueba.
``` 

### Test Case 8 — Componente Bootstrap 2
``` 
Resultado de Playwright — Offcanvas del carrito
El Offcanvas abrió en los tres viewports mediante el botón del carrito y mostró un único backdrop oficial de Bootstrap. El contenido existente —dos productos, cantidades, precios y subtotales— estuvo visible y se conservó.

Viewport	Resultado
Desktop, 1280×800	Abrió desde la derecha con ancho de 448 px, correspondiente al 35% configurado.
Mobile, 390×844	Abrió a ancho completo (390 px); el contenido quedó dentro del panel.
Tablet, 768×1024	Abrió desde la derecha con ancho de aproximadamente 461 px, correspondiente al 60% configurado.
Interacciones y estilos: comprobé cierre con el botón oficial, con Escape —que devolvió el foco al control de apertura— y haciendo clic fuera del panel sobre el backdrop. El panel tuvo una transición de 0.3s; la del backdrop fue 0.15s. Verifiqué el fondo rojo del carrito, la cabecera rojo oscuro y la tipografía FerroLab. No observé errores de consola ni problemas funcionales.

Capturas: guardé estados iniciales, paneles abiertos y viewports con backdrop en capturas/tc-8:

Desktop: inicial, abierto, con backdrop
Mobile: inicial, abierto, con backdrop
Tablet: inicial, abierto, con backdrop
Dejé detenido el servidor local usado para la prueba. No modifiqué código ni actualicé el documento Test Case 8.
``` 

## Hallazgos detectados
# Test-case-7
| # | Viewport | Descripción del problema | Comportamiento esperado | Comportamiento observado | Severidad |
|---|----------|--------------------------|-------------------------|--------------------------|-----------|
| 1 | Todos | La sombra configurada mediante `--bs-dropdown-box-shadow` no se refleja en el menú | Mostrar la sombra FerroLab definida por `--shadow-card` | El valor de la variable está definido, pero el `box-shadow` computado es `none` | Baja |

# Test-case-8
| # | Viewport | Descripción del problema | Comportamiento esperado | Comportamiento observado | Severidad |
|---|----------|--------------------------|-------------------------|--------------------------|-----------|
| 1 | Desktop, mobile y tablet | La sombra configurada no se aplica al panel | El valor de `--bs-offcanvas-box-shadow` debe reflejarse en el `box-shadow` efectivo | La variable computada es `0 1px 3px rgb(0 0 0 / 16%)`, pero `box-shadow` computa como `none` en los tres viewports | Baja |

## Issues creadas mediante GitHub MCP

# Test-case-7
| Issue | Viewport | Descripción | Severidad | Estado |
|-------|----------|-------------|-----------|--------|
| [#91](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/issues/91) | Todos | `--bs-dropdown-box-shadow` está configurada, pero el `box-shadow` computado del Dropdown es `none` | Baja | Abierto |

# Test-case-8
| Issue | Viewport | Descripción | Severidad | Estado |
|-------|----------|-------------|-----------|--------|
| [#97](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/issues/97) | Desktop, mobile y tablet | `--bs-offcanvas-box-shadow` está definida, pero `box-shadow` efectivo es `none` | Baja | Abierto |


## Correcciones realizadas

- test-case-7 Pendiente
- test-case-8 Pendiente

## Evidencia de cierre

**1° Commit:**


**Commit de implementación:**


**Pull Request:**


**Issues vinculadas:**


**Archivos modificados:**
