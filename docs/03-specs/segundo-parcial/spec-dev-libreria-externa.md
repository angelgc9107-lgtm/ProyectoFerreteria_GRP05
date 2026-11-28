# Spec — Desarrollador JS Librerías Externas

**Segundo Parcial — Programación Web I (UCES)**
**Grupo:** GRP05 · **Rol:** Desarrollador JS Librerías Externas · **Integrante:** Thiago Piastrellini (@Piastrellini)
**Rama de trabajo:** `feature/dev-libreria-externa-sweetalert2` → `develop`
**Issue asociada:** [#209](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/issues/209)

**Entregables del rol:**
- `index.html`: hoja de estilos y script de SweetAlert2 por CDN.
- `js/services/ServicioDialogos.js`: módulo wrapper que encapsula SweetAlert2.
- `js/script.js`: uso del wrapper en los puntos de integración de la sección 3.
- `docs/07-librerias/libreria-doc.md` y `docs/07-librerias/screenshots/` (documentación y capturas).
- Este archivo: `docs/03-specs/segundo-parcial/spec-dev-libreria-externa.md`.

> Orden obligatorio de commits: este archivo (sección BEFORE) se commitea **antes** que cualquier cambio de integración de la librería.

> **Carpeta de la documentación:** la consigna nombra `docs/06-librerias/` en el texto del rol y en el puntaje, y `docs/07-librerias/` en la estructura final del repositorio. Como `docs/06-storage/` ya existe, se usa `docs/07-librerias/`, que sigue la numeración de la estructura. Se confirma con el Coordinador/DevOps.

---

# BEFORE — Se completa antes de integrar la librería

> **Actualización por la revisión de la PR #216 (RC01, RC02 y RC03):** se agregaron el orden de integración a `develop` con TC-12 (sección 6), la matriz de regresión de los cuatro flujos (sección 6) y los criterios de compatibilidad con Bootstrap (secciones 4 y 5). El resto del BEFORE se mantiene como se commiteó antes de la integración.

## 1. Necesidad del proyecto

Tres acciones de la aplicación se ejecutan con un solo clic y sin ninguna confirmación previa, aunque tienen consecuencias que el usuario no puede deshacer desde la interfaz:

| Acción | Dónde | Consecuencia |
|---|---|---|
| Eliminar un producto del carrito (`data-action="eliminar-carrito"`) | Flujo 2 — Carrito | El ítem y su cantidad se pierden; hay que buscarlo y agregarlo de nuevo. |
| Confirmar el pedido (`data-action="confirmar-pedido"`) | Flujo 4 — Confirmación | Es irreversible: consume un número de la secuencia de pedidos, vacía el carrito y cierra el pago. |
| Cancelar el pedido (`data-action="cancelar-pedido"`) | Flujo 4 — Confirmación | Se borran los datos del cliente cargados en el formulario. |

Hoy el código propio no resuelve ninguna confirmación: los mensajes de `mostrarMensaje()` informan el resultado **después** de la acción, no piden conformidad **antes**.

**Por qué no se resuelve con código propio:**

- `window.confirm()` no se puede usar: las consignas anteriores prohíben `prompt()`/`alert()`/`confirm()` y la suite (`script.spec.js`) verifica que la aplicación no los llama. Además, no se puede estilizar ni mostrar contenido con formato (total, cuotas).
- Un diálogo accesible hecho a mano exige atrapar el foco dentro del diálogo, cerrarlo con `Esc`, devolver el foco al botón que lo abrió, marcar `role="dialog"` y `aria-modal`, bloquear el fondo y resolver la respuesta del usuario como una promesa. Es una cantidad de código y de casos borde que una librería mantenida ya resuelve y prueba.
- Se evaluó el `Modal` de Bootstrap, que ya está cargado: necesita marcado HTML fijo por cada diálogo y conectar a mano sus eventos con una promesa. SweetAlert2 genera el diálogo con el contenido de cada caso y devuelve una promesa (`await Swal.fire(...)`), que encaja con los flujos asíncronos de este parcial.

## 2. Librería seleccionada

| Dato | Valor |
|---|---|
| Nombre | SweetAlert2 |
| Versión | 11.26.25 (versión fijada; publicada el 23/05/2026) |
| Licencia | MIT |
| Repositorio | https://github.com/sweetalert2/sweetalert2 |
| Documentación oficial | https://sweetalert2.github.io/ |
| Método de integración | CDN (jsDelivr), con versión fija e integridad SRI |
| Peso | `sweetalert2.min.js` ≈ 15,5 KB y `sweetalert2.min.css` ≈ 5,1 KB comprimidos con gzip |

Integración prevista en `index.html`, con el mismo criterio que Bootstrap (versión fija, `integrity`, `crossorigin` y `defer`):

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11.26.25/dist/sweetalert2.min.css"
      integrity="sha384-dCW5imOdApH6OwpFau8cZNKjqVbJYnCA5q+8YsMYP3XwXKsV6Jfz1u6MZLnXaBsS" crossorigin="anonymous">
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11.26.25/dist/sweetalert2.min.js"
        integrity="sha384-hW8ZCQHtRH+nVOAkHZ4amZvYsAtKn1ZOvMV6dNag1Rb1thWmLZMBKTRxFV0cOxiK" crossorigin="anonymous" defer></script>
```

Los hashes SRI se calcularon sobre los archivos `dist/` del paquete `sweetalert2@11.26.25` publicado en npm, que es lo que sirve jsDelivr.

## 3. Puntos de integración

| # | Punto de la aplicación | Diálogo | Si confirma | Si cancela |
|---|---|---|---|---|
| 1 | **Flujo 2 — Carrito**: botón «Eliminar» de cada ítem | «¿Eliminar *[producto]* del carrito?» con la cantidad actual | Se elimina el ítem (comportamiento actual) | El carrito no cambia |
| 2 | **Flujo 4 — Confirmación**: botón «Confirmar pedido» | «¿Confirmar la compra?» con el total financiado, el método de pago y las cuotas | Se confirma el pedido (comportamiento actual) | El resumen sigue pendiente; no se consume número de pedido |
| 3 *(opcional)* | **Flujo 4 — Confirmación**: botón «Cancelar pedido» | «¿Descartar los datos del pedido?» | Se cancela el pedido (comportamiento actual) | Se conservan el resumen y los datos del cliente |

Los puntos 1 y 2 son los obligatorios (consigna: «al menos 2 puntos diferentes»). El punto 3 se agrega si el tiempo lo permite.

## 4. Decisiones de arquitectura

**Módulo wrapper `js/services/ServicioDialogos.js`.** `script.js` no llama a `Swal` directamente; usa el wrapper, igual que usa `FachadaStorage` para el storage:

```javascript
// API prevista
ServicioDialogos.confirmar({ titulo, texto, textoConfirmar, textoCancelar, peligroso })
// → Promise<boolean>: true si el usuario confirmó, false si canceló o cerró el diálogo
ServicioDialogos.disponible()
// → boolean: true si SweetAlert2 está cargado
```

Motivos:
- La configuración (textos, clases, accesibilidad) queda en un solo lugar y los tres puntos se ven iguales.
- Si se cambia de librería, solo cambia el wrapper.
- El Tester QA puede reemplazar `globalThis.Swal` por un doble de prueba en `library.spec.js` y en `script.spec.js`.
- `ServicioDialogos.confirmar()` solo muestra el diálogo y devuelve la respuesta del usuario: no contiene reglas de negocio. Qué se elimina, se confirma o se cancela lo sigue decidiendo `script.js` con los modelos.

**Si la librería no carga** (CDN caído o bloqueado): `globalThis.Swal` no existe. El wrapper lo detecta, lo registra con `console.error` y devuelve `true`, de modo que la acción sigue como hoy, sin confirmación. Se elige no bloquear la compra por una falla de un recurso externo. El wrapper nunca lanza excepciones hacia `script.js`.

**Consistencia visual con el diseño existente:**
- `buttonsStyling: false` y `customClass` con clases propias, estilizadas igual que los botones que ya tiene el sitio en `css/components.css`, para que los botones del diálogo se vean como los de la página.
- Colores tomados de las variables de `css/styles.css` (`--color-red`, `--color-ink`, `--color-danger`) y tipografía `--font-family-base` (Inter). Los ajustes van en un bloque propio de `css/components.css`, sin modificar el CSS de la librería.
- Acciones destructivas: el foco inicial queda en «Cancelar» (`focusCancel: true`) y el botón de confirmar usa el estilo de peligro.
- Si el usuario tiene activado `prefers-reduced-motion`, se desactivan las animaciones de entrada y salida.

**Accesibilidad:** SweetAlert2 ya marca el diálogo con `role="dialog"` y `aria-modal="true"`, atrapa el foco, cierra con `Esc` (equivale a cancelar) y devuelve el foco al elemento que lo abrió. Se mantienen esos valores por defecto.

**Compatibilidad con Bootstrap (RC03):** el botón «Eliminar» está dentro del carrito, que es un `Offcanvas` de Bootstrap. Ese componente atrapa el foco dentro del panel y se cierra con `Esc`, así que el diálogo puede chocar con él. Se verifica:
- que desde el carrito abierto el diálogo reciba el foco y se pueda usar solo con teclado (`Tab` no sale del diálogo);
- que `Esc` cierre solo el diálogo y el carrito quede abierto, y que el foco vuelva al botón que abrió el diálogo;
- que el diálogo quede por encima del carrito y del resto de la página (apilamiento / `z-index`), en escritorio y en celular;
- que la suite completa siga en 0 failures, como prueba de que no hay conflictos con Bootstrap ni con los módulos existentes.

**Asincronía:** los manejadores de los tres botones pasan a ser `async` y esperan `await ServicioDialogos.confirmar(...)` antes de ejecutar la acción. Mientras el diálogo está abierto, el fondo no recibe clics, lo que además evita confirmaciones dobles.

**Rendimiento (umbral de Lighthouse ≥95):** se carga una sola librería liviana, con `defer`, versión fija y sin dependencias. El diálogo solo se construye cuando el usuario hace clic, así que no afecta la carga inicial más allá de descargar el archivo.

## 5. Criterios de aceptación

- [X] SweetAlert2 11.26.25 integrada en `index.html` vía CDN, con `integrity` y `crossorigin`, y funcionando.
- [X] Configurada según la documentación oficial (`Swal.fire` con opciones y `customClass`), sin modificar archivos de la librería.
- [X] `js/services/ServicioDialogos.js` encapsula la librería; `script.js` no usa `Swal` directamente.
- [X] Integrada en al menos 2 puntos diferentes de la aplicación (eliminar del carrito y confirmar pedido).
- [X] Cancelar el diálogo deja el estado de la aplicación sin cambios.
- [X] Si la librería no carga, la aplicación sigue funcionando sin confirmación y el error queda registrado en consola, sin excepciones.
- [X] Los diálogos mantienen la estética del sitio (botones, colores y tipografía) y respetan `prefers-reduced-motion`.
- [X] Desde el carrito (`Offcanvas` de Bootstrap) el diálogo se usa con teclado: foco inicial en «Cancelar», `Tab` no sale del diálogo, `Esc` cierra solo el diálogo (el carrito queda abierto) y el foco vuelve al botón que lo abrió.
- [X] El diálogo se muestra por encima del carrito y del resto de la página (apilamiento / `z-index`) en escritorio y en 390 px de ancho.
- [X] SweetAlert2 no introduce conflictos con Bootstrap ni con los módulos existentes: la suite completa de `js/test/test-runner.html` sigue en 0 failures.
- [ ] La PR se mergea a `develop` recién después de que Fetch esté integrado y TC-12 esté ejecutado y documentado (sección 6). **No cumplido:** la PR #216 se mergeó el 26/11 a las 23:45, antes de que TC-12 estuviera ejecutado (ver AT CLOSE, sección 3).
- [X] `docs/07-librerias/libreria-doc.md` completo: nombre, versión, propósito, instalación, ejemplos de uso, enlaces a la documentación oficial y capturas en `docs/07-librerias/screenshots/`.
- [X] Código documentado con JSDoc, sin `alert()`, `confirm()` ni `prompt()`.
- [X] Rama `feature/dev-libreria-externa-sweetalert2`, issue asociada, PR hacia `develop` revisada por el Coordinador/DevOps y entrada en `changelog.md`.

## 6. Herramientas y coordinación

**Herramienta:** Claude (Anthropic), en lugar de GitHub Copilot en modo Agente, con este archivo, `index.html`, `js/script.js` y la suite de `js/test/` como contexto. Se deja constancia de que esto difiere de lo que pide la consigna (§4.2).

**Coordinación:**
- **Tester QA/JS:** `library.spec.js` (inicialización, configuración, funcionalidad, errores e interacción) y el doble de `globalThis.Swal` que necesitan los specs de `script.spec.js` que eliminan del carrito o confirman el pedido, porque esos flujos pasan a esperar el diálogo. También TC-13 de Lighthouse (post-integración de la librería), que se compara con TC-12.
- **Desarrollador JS Asíncrono:** si el catálogo pasa a cargarse desde una API, el diálogo del punto 1 muestra el nombre del producto que venga de esos datos; se acuerda que el nombre llegue ya validado por el modelo `Producto`.
- **Coordinador/DevOps:** carpeta `docs/07-librerias/`, revisión de la PR y respuesta a las issues sobre la librería.

**Orden de integración a `develop` (RC01):**

1. Fetch integrado y revisado en `develop` (PR #217; la #211 es el spec del rol).
2. El Tester QA/JS ejecuta y documenta **TC-12** (Lighthouse post-Fetch) sobre `develop`.
3. Recién entonces se mergea esta PR a `develop`.
4. El Tester QA/JS ejecuta **TC-13** (Lighthouse post-librería) y lo compara con TC-12.

El código de la librería se desarrolla en la rama `feature/dev-libreria-externa-sweetalert2` y no cambia `develop` hasta el merge, así que no altera la medición de TC-12.

**Matriz de regresión de los cuatro flujos (RC02):** además de la suite propia de la librería, el Tester QA/JS verifica que los flujos existentes de `js/test/script.spec.js` sigan pasando sin debilitar sus comprobaciones:

| Flujo | Suite de `script.spec.js` | ¿Pasa por un diálogo? | Qué se tiene que mantener |
|---|---|---|---|
| 1. Búsqueda y filtrado | «Flujo 1: búsqueda y filtrado» | No | Filtros por texto, categoría, precio y orden; recuperación de resultados. Debe pasar sin cambios. |
| 2. Carrito | «Flujo 2: carrito» y «persistencia del carrito en Web Storage» | Sí (eliminar) | Agregar, cambiar cantidad, eliminar y persistencia. Eliminar pasa por el diálogo con el doble de `Swal`. |
| 3. Pago y cuotas | «Flujo 3: pago y cuotas» | No | Métodos, cuotas, recargos, invalidación y cancelación del pago. Debe pasar sin cambios. |
| 4. Resumen y confirmación | «Flujo 4: confirmación del pedido» y «RC62: persistencia de pedidos» | Sí (confirmar y cancelar) | Validación, resumen, confirmación con número, numeración y cancelación. Confirmar y cancelar pasan por el diálogo con el doble de `Swal`; RC24 sigue sin diálogo. |
| Transversales | «casos borde», «rutas defensivas y de error», «requisitos transversales» | Algunos | Doble clic, acciones repetidas, storage que rechaza escrituras y sin `alert()`/`confirm()`/`prompt()`. |

---

# AT CLOSE — Se completa al cerrar la tarea (evidencia)

_Esta sección se completa **después** de integrar la librería, con el contenido real del trabajo._

## 1. Prompt exacto utilizado

**Herramienta:** Claude Code (Anthropic), en una sesión nueva dentro de VS Code, sobre la rama `feature/dev-libreria-externa-sweetalert2` con el spec BEFORE ya commiteado. El prompt se redactó con ayuda de Claude (claude.ai) a partir de este spec. Registro completo en [`docs/02-prompts/prompts-13.md`](../../02-prompts/prompts-13.md), con la captura `docs/02-prompts/images/prompt-13-DesarrolladorJSLibreriasExternas.png`.

```text
Actuá como un desarrollador senior de JavaScript (ES6, módulos, sin frameworks) y especialista en accesibilidad.

CONTEXTO
Proyecto FerroLab (ferretería), Programación Web I – Segundo Parcial. Mi rol: Desarrollador JS Librerías Externas.
Leé antes de escribir código:
- docs/03-specs/segundo-parcial/spec-dev-libreria-externa.md (sección BEFORE: es la especificación a cumplir)
- index.html, js/script.js, css/styles.css, css/components.css
- js/services/FachadaStorage.js (como ejemplo del estilo de wrapper del proyecto)
- js/test/script.spec.js y js/test/test-runner.html

TAREA
Integrar SweetAlert2 11.26.25 por CDN para pedir confirmación antes de:
1. Eliminar un producto del carrito (data-action="eliminar-carrito").
2. Confirmar el pedido (data-action="confirmar-pedido"), mostrando total financiado, método de pago y cuotas.
3. Cancelar el pedido (data-action="cancelar-pedido").

REQUISITOS
- index.html: CSS y JS de jsDelivr con versión fija, integrity, crossorigin y defer, usando exactamente
  los hashes SRI del spec. El CSS de la librería va antes del CSS propio; el script, antes de js/script.js.
- Crear js/services/ServicioDialogos.js como wrapper: confirmar(opciones) → Promise<boolean> y
  disponible() → boolean. script.js nunca usa Swal directamente.
- Si la librería no cargó, la acción se ejecuta como hoy, sin confirmación, sin lanzar excepciones.
  Si Swal.fire() falla, registrar el error y dejar continuar la acción.
- Seguridad: mostrar los textos con la opción text, nunca html (llevan nombres de productos).
- Accesibilidad: foco inicial en "Cancelar" en acciones que pierden datos, Esc cancela, el foco vuelve
  al botón que abrió el diálogo, respetar prefers-reduced-motion. El carrito es un Offcanvas de
  Bootstrap que atrapa el foco: verificá que el diálogo se pueda usar con teclado desde ahí y que
  Esc cierre solo el diálogo y no el carrito.
- Estética: buttonsStyling: false + customClass con clases propias definidas en css/components.css,
  usando las variables de css/styles.css (colores, tipografía, espaciados). No modificar el CSS de la librería.
- El caso "confirmar sin resumen pendiente" debe seguir mostrando su error actual sin abrir el diálogo (RC24).
- JSDoc en todas las funciones nuevas. Sin alert(), confirm() ni prompt().

TESTS
- La suite actual (js/test/test-runner.html) tiene que seguir en 0 failures. Los specs de los flujos
  esperan que eliminar, confirmar y cancelar tengan efecto inmediato: proponé cómo mantenerlos sin
  debilitarlos.
- Agregar en script.spec.js una suite que pruebe los 3 puntos con un doble de Swal: confirmar,
  cancelar, contenido del diálogo, el caso RC24, la falla de la librería y la carga del CDN con SRI.

NO HACER
- No modificar js/models/, js/utils/storage.js ni otros servicios.
- No agregar dependencias ni archivos fuera de los mencionados.

SALIDA
Hacé los cambios en el repo y al final mostrame: lista de archivos tocados, decisiones que tomaste
y por qué, y cómo verificar a mano cada punto de integración.
```

## 2. Código de integración final

**Wrapper** (`js/services/ServicioDialogos.js`, fragmento):

```javascript
function construirOpciones({ titulo, texto, textoConfirmar, textoCancelar, peligroso, origen }) {
    const opciones = {
        titleText: titulo,
        text: texto,
        icon: peligroso ? "warning" : "question",
        showCancelButton: true,
        confirmButtonText: textoConfirmar,
        cancelButtonText: textoCancelar,
        reverseButtons: true,
        focusCancel: peligroso,
        allowEscapeKey: true,
        // Esc cancela el diálogo y no se propaga: el Offcanvas que lo contiene sigue abierto.
        stopKeydownPropagation: true,
        returnFocus: true,
        buttonsStyling: false,
        customClass: { ...CLASES, confirmButton: peligroso ? BOTON_PELIGRO : BOTON_CONFIRMAR },
        target: obtenerDestino(origen)
    };
    // ...
}
```

**Uso en el controlador** (`js/script.js`, fragmento):

```javascript
async function ejecutarConConfirmacion(opciones, accion) {
    if (confirmacionEnCurso) return false;
    confirmacionEnCurso = true;

    try {
        if (!(await ServicioDialogos.confirmar(opciones))) return false;
        accion();
        return true;
    } finally {
        confirmacionEnCurso = false;
    }
}
```

El código completo de los tres puntos y la configuración están en `docs/07-librerias/libreria-doc.md`.

## 3. Ajustes manuales realizados

Sobre el código que generó Claude Code no se hicieron cambios manuales: se revisó y se aceptó como estaba. Lo que sí se hizo a mano fue la revisión y la verificación:

| Ajuste / verificación | Justificación |
|---|---|
| Revisión del diff de los 5 archivos contra el prompt y el spec BEFORE: solo se tocaron `index.html` (2 etiquetas en el `<head>`), `css/components.css` (bloque nuevo), `js/script.js`, `js/services/ServicioDialogos.js` (nuevo) y `js/test/script.spec.js`. | Comprobar que no modificara modelos, storage ni otros servicios, como pedía el prompt. |
| Corrida de la suite completa: **468 specs, 0 failures**. | Comprobar que la integración no rompe los flujos existentes. |
| Verificación manual de los tres puntos en el navegador, incluido el uso con teclado desde el carrito y con el CDN de SweetAlert2 bloqueado en DevTools. | Comprobar el comportamiento real, no solo los tests. |
| Se aceptaron tres decisiones que el BEFORE no tenía: `titleText` en lugar de `title` (en SweetAlert2 `title` se interpreta como HTML), protección contra doble clic mientras el diálogo está abierto, y que cancelar con el formulario vacío no pregunte. | Las dos primeras corrigen riesgos reales (inyección de HTML y acciones repetidas); la tercera evita preguntar cuando no hay datos que perder. |
| Se aceptó `console.error` (y no `console.warn`) cuando la librería no cargó, como decía el BEFORE. | Es lo especificado en la sección 4. |
| Actualización del BEFORE por la revisión de la PR #216: orden de integración con TC-12 (RC01), matriz de regresión de los cuatro flujos (RC02) y criterios de compatibilidad con Bootstrap (RC03). | Pedido del Coordinador/DevOps en la revisión. Los agregados están marcados en el BEFORE con su RC. |
| Orden real de trabajo: el código se escribió en la rama el 26/11 a las 12:30, antes de que Fetch se integrara a `develop` (PR #217, mergeada el 26/11 a las 23:00). Esta PR (#216) se mergeó a las 23:45 del mismo día, antes de ejecutar TC-12, así que el criterio de orden de la sección 5 queda sin cumplir. | Se deja constancia para que el orden de integración a `develop` no se confunda con el orden de desarrollo en la rama. La versión anterior de esta fila citaba por error la PR #211 (spec de Fetch, mergeada a las 18:16) como si fuera la integración. |
| Claude Code cambió la base de la rama: salía de un `develop` local desactualizado y la rebasó sobre `origin/develop` antes de empezar, conservando el commit del spec. Se verificó con `git log` antes de publicar la rama. | Sin `js/services/` ni el `script.js` actual, la integración no se podía hacer sobre la base anterior. |

## 4. Resumen de los puntos de integración y mejora de la experiencia

| Punto | Antes | Después |
|---|---|---|
| Carrito — eliminar un producto | Se eliminaba con un clic. | Pregunta «¿Eliminar *[producto]* del carrito?» con la cantidad; foco en «Cancelar»; `Esc` cierra solo el diálogo y el carrito queda abierto. |
| Confirmación — confirmar el pedido | Se confirmaba con un clic, de forma irreversible. | Muestra total financiado, método y cuotas; «Seguir revisando» vuelve al resumen sin consumir número de pedido. |
| Confirmación — cancelar el pedido | Se borraban los datos del cliente con un clic. | Si hay datos, pregunta antes de descartarlos; con el formulario vacío cancela directo. |

En los tres casos un doble clic no repite la acción. Si el CDN no carga, la aplicación funciona igual que antes de la integración.

### Compatibilidad con Bootstrap (resultado de las verificaciones)

| Verificación | Resultado | Evidencia |
|---|---|---|
| Foco desde el carrito abierto | El diálogo se inserta dentro del `Offcanvas` (`target`); el foco arranca en «Cancelar» y `Tab` no sale del diálogo. Con `target: "body"` la trampa de foco de Bootstrap le quitaba el foco. | Spec «con la librería real: desde el carrito abierto: foco en Cancelar, Esc cierra solo el diálogo y el foco vuelve al botón»; prueba manual con teclado. |
| `Esc` | Cierra solo el diálogo (`stopKeydownPropagation`); el carrito queda abierto y el foco vuelve a «Eliminar». | Mismo spec; prueba manual. |
| Apilamiento / `z-index` | El diálogo y su fondo quedan por encima del carrito y de la página, en escritorio y en 390 px. | Capturas `01-confirmar-eliminar-producto.png` y `05-confirmar-eliminar-movil.png` de `docs/07-librerias/screenshots/`. |
| Conflictos con módulos existentes | Ninguno: la suite completa queda en 468 specs, 0 failures, con los cuatro flujos de la matriz de regresión. | Corrida de `js/test/test-runner.html`. |

## 5. Coordinación e issues respondidas

- **Tester QA/JS:** `script.spec.js` instala un doble de `Swal` en cada test (`instalarDobleSwal()`) y las acciones con diálogo se esperan con `clicYEsperar()`. Se le pasan esas funciones y la API del wrapper (`confirmar`, `disponible`) para `library.spec.js` y para el Test Case 13 de Lighthouse (post-librería).
- **Lighthouse TC-12 y TC-13:** documentados en [test-case-12-lighthouse-post-fetch.md](../../04-testing/test-case-12-lighthouse-post-fetch.md) (commit `ca9458f`, post-Fetch) y [test-case-13-lighthouse-post-library.md](../../04-testing/test-case-13-lighthouse-post-library.md) (commit `5d6ba92`, post-librería). `library.spec.js` se incorporó en la PR #222.
- **Desarrollador JS Asíncrono:** el diálogo de «Eliminar» toma el nombre del producto del modelo `Carrito` y lo muestra como texto plano, así que funciona igual con productos que vengan de la API.
- **Coordinador/DevOps:** carpeta `docs/07-librerias/`, como en su spec del Segundo Parcial. La PR se mergea después de la de Fetch.
- **Issue asociada:** [#209](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/issues/209).