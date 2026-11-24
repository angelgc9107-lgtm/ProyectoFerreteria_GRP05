# Estados visuales de la cuarta entrega

Capturas de la interfaz **implementada** (`index.html` + `js/script.js`, rama `release/cuarta-entrega` con las PR #167, #168 y #169) en cada estado del flujo de compra: carrito vacío, método de pago y cuotas, errores de validación, resumen, confirmación, cancelación y carrito vacío tras confirmar.

> **Qué son y qué no son.** Son capturas de la aplicación real, tomadas con Playwright (Chromium) por script sobre `http://localhost`, a 1280 × 900 px (desktop) y a 390 × 844 px (móvil, captura 13). **No son el mockup de Figma ni reemplazan las imágenes de `docs/01-mockup/actividad-obligatoria-4/`** (estados visuales diseñados, incorporados en la PR #169): las complementan mostrando cómo se ve cada estado en la página ya implementada.

| # | Archivo | Estado | Qué muestra |
|---|---|---|---|
| 1 | `01-catalogo.png` | Inicio y catálogo | Página al cargar, con el carrito vacío |
| 2 | `02-carrito-vacio.png` | **Carrito vacío** | Panel del carrito sin productos; «Iniciar compra» deshabilitado |
| 3 | `03-carrito-con-productos.png` | Carrito con productos | Dos productos, cantidades editables, subtotales y total |
| 4 | `04-carrito-cantidad-invalida.png` | **Error de validación** (carrito) | Cantidad `0` marcada como inválida; el carrito no cambia |
| 5 | `05-pago-metodo-sin-elegir.png` | **Error** (método de pago) | Se pulsa «Ver condiciones y continuar» sin elegir método: se muestra el mensaje del modelo («El metodo de pago no es valido.») y el campo queda marcado |
| 6 | `06-pago-tarjeta-6-cuotas.png` | **Método de pago y cuotas** | Tarjeta en 6 cuotas: total original, recargo 20 %, total financiado y valor de cada cuota |
| 7 | `07-cliente-nombre-vacio.png` | **Formulario con error** | Se envía con el nombre vacío: campo marcado y mensaje del modelo («nombre no es valido.») |
| 8 | `08-cliente-correo-invalido.png` | **Formulario con error** | Se envía con un correo sin dominio: campo marcado y mensaje del modelo |
| 9 | `09-resumen-del-pedido.png` | **Resumen** | Cliente, productos, condiciones de pago y botones «Confirmar» y «Cancelar» |
| 10 | `10-pedido-cancelado.png` | **Cancelación** | Tras cancelar el pedido se cierra la confirmación y se conservan el carrito y las condiciones de pago. Se ve que **no aparece el mensaje «Pedido cancelado…»**: está en la sección oculta (hallazgo H5 de `js/test/testing-doc.md`) |
| 11 | `11-pedido-confirmado.png` | **Confirmación** | Número de pedido (`FL-<ms>-<secuencia>`) y mensaje de éxito |
| 12 | `12-carrito-vacio-tras-confirmar.png` | **Carrito vacío** tras confirmar | El pedido confirmado vacía el carrito |
| 13 | `13-movil-pago-y-validacion.png` | Móvil (390 px) | Pago con tarjeta en 3 cuotas y error de validación al enviar el formulario |

**Lo que estas capturas no muestran:** validación de cada campo mientras se escribe (el controlador valida los datos del cliente al enviar el formulario; ver hallazgo H1) ni un estado de «cargando» fuera del breve «Preparando el pago…».

## Cómo regenerarlas

Con el repositorio servido por HTTP (`python -m http.server 8777`) y Playwright instalado, se recorre el flujo en este orden: abrir el carrito vacío, agregar dos productos, cantidad `0`, «Iniciar compra», enviar el pago sin método, elegir tarjeta en 6 cuotas, enviar el formulario con el nombre vacío y con un correo inválido, generar el resumen, cancelar, repetir hasta confirmar y abrir el carrito. El guion que se usó no se versiona en el repositorio.
