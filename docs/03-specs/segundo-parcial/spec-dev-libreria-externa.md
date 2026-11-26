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

**Si la librería no carga** (CDN caído o bloqueado): `globalThis.Swal` no existe. El wrapper lo detecta, lo registra con `console.error` y devuelve `true`, de modo que la acción sigue como hoy, sin confirmación. Se elige no bloquear la compra por una falla de un recurso externo. El wrapper nunca lanza excepciones hacia `script.js`.

**Consistencia visual con el diseño existente:**
- `buttonsStyling: false` y `customClass` con clases propias, estilizadas igual que los botones que ya tiene el sitio en `css/components.css`, para que los botones del diálogo se vean como los de la página.
- Colores tomados de las variables de `css/styles.css` (`--color-red`, `--color-ink`, `--color-danger`) y tipografía `--font-family-base` (Inter). Los ajustes van en un bloque propio de `css/components.css`, sin modificar el CSS de la librería.
- Acciones destructivas: el foco inicial queda en «Cancelar» (`focusCancel: true`) y el botón de confirmar usa el estilo de peligro.
- Si el usuario tiene activado `prefers-reduced-motion`, se desactivan las animaciones de entrada y salida.

**Accesibilidad:** SweetAlert2 ya marca el diálogo con `role="dialog"` y `aria-modal="true"`, atrapa el foco, cierra con `Esc` (equivale a cancelar) y devuelve el foco al elemento que lo abrió. Se mantienen esos valores por defecto.

**Asincronía:** los manejadores de los tres botones pasan a ser `async` y esperan `await ServicioDialogos.confirmar(...)` antes de ejecutar la acción. Mientras el diálogo está abierto, el fondo no recibe clics, lo que además evita confirmaciones dobles.

**Rendimiento (umbral de Lighthouse ≥95):** se carga una sola librería liviana, con `defer`, versión fija y sin dependencias. El diálogo solo se construye cuando el usuario hace clic, así que no afecta la carga inicial más allá de descargar el archivo.

## 5. Criterios de aceptación

- [ ] SweetAlert2 11.26.25 integrada en `index.html` vía CDN, con `integrity` y `crossorigin`, y funcionando.
- [ ] Configurada según la documentación oficial (`Swal.fire` con opciones y `customClass`), sin modificar archivos de la librería.
- [ ] `js/services/ServicioDialogos.js` encapsula la librería; `script.js` no usa `Swal` directamente.
- [ ] Integrada en al menos 2 puntos diferentes de la aplicación (eliminar del carrito y confirmar pedido).
- [ ] Cancelar el diálogo deja el estado de la aplicación sin cambios.
- [ ] Si la librería no carga, la aplicación sigue funcionando sin confirmación y el error queda registrado en consola, sin excepciones.
- [ ] Los diálogos mantienen la estética del sitio (botones, colores y tipografía) y respetan `prefers-reduced-motion`.
- [ ] `docs/07-librerias/libreria-doc.md` completo: nombre, versión, propósito, instalación, ejemplos de uso, enlaces a la documentación oficial y capturas en `docs/07-librerias/screenshots/`.
- [ ] Código documentado con JSDoc, sin `alert()`, `confirm()` ni `prompt()`.
- [ ] Rama `feature/dev-libreria-externa-sweetalert2`, issue asociada, PR hacia `develop` revisada por el Coordinador/DevOps y entrada en `changelog.md`.

## 6. Herramientas y coordinación

**Herramienta:** Claude (Anthropic), en lugar de GitHub Copilot en modo Agente, con este archivo, `index.html`, `js/script.js` y la suite de `js/test/` como contexto. Se deja constancia de que esto difiere de lo que pide la consigna (§4.2).

**Coordinación:**
- **Tester QA/JS:** `library.spec.js` (inicialización, configuración, funcionalidad, errores e interacción) y el doble de `globalThis.Swal` que necesitan los specs de `script.spec.js` que eliminan del carrito o confirman el pedido, porque esos flujos pasan a esperar el diálogo. También el Test Case 3 de Lighthouse (post-integración de la librería).
- **Desarrollador JS Asíncrono:** si el catálogo pasa a cargarse desde una API, el diálogo del punto 1 muestra el nombre del producto que venga de esos datos; se acuerda que el nombre llegue ya validado por el modelo `Producto`.
- **Coordinador/DevOps:** carpeta `docs/07-librerias/`, revisión de la PR y respuesta a las issues sobre la librería.

---

# AT CLOSE — Se completa al cerrar la tarea (evidencia)

_Esta sección se completa **después** de integrar la librería, con el contenido real del trabajo._

## 1. Prompt exacto utilizado

_Pendiente._

## 2. Código de integración final

_Pendiente._

## 3. Ajustes manuales realizados

_Pendiente._

## 4. Resumen de los puntos de integración y mejora de la experiencia

_Pendiente._

## 5. Coordinación e issues respondidas

_Pendiente._