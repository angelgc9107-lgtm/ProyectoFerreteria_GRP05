import { Producto } from "./models/Producto.js";
import { FachadaStorage } from "./services/FachadaStorage.js";
import { Catalogo } from "./models/Catalogo.js";
import { Carrito } from "./models/Carrito.js";
import { Pago } from "./models/Pago.js";
import { Pedido } from "./models/Pedido.js";
import { FormateadorMoneda } from "./services/FormateadorMoneda.js";
import { validarCambioCantidad } from "./services/ValidacionCarrito.js";
import { confirmarPedidoConNumeracion } from "./services/ConfirmadorPedidos.js";

const productosIniciales = [
    { codigo: "GUANTES-001", nombre: "Guantes moteados multiuso maxima calidad", categoria: "Herramientas manuales", descripcion: "Proteccion multiuso para trabajos de ferreteria y mantenimiento.", precio: 4401 },
    { codigo: "DESTORNILLADOR-001", nombre: "Destornillador punta plana Black Jack 8 x 200 mm", categoria: "Herramientas manuales", descripcion: "Destornillador con punta plana para tareas de ajuste y reparacion.", precio: 6026 },
    { codigo: "PINZA-001", nombre: "Pinza punta curva mini 5 pulgadas ideal electronica", categoria: "Herramientas manuales", descripcion: "Pinza compacta para trabajos de precision en electronica.", precio: 6426 },
    { codigo: "ENCHUFE-001", nombre: "Enchufe adaptador cubo 5 tomas 3 patas 10 amp", categoria: "Electricidad", descripcion: "Adaptador electrico con cinco tomas para conectar herramientas y equipos.", precio: 10282 },
    { codigo: "MARTILLO-001", nombre: "Martillo galponero mango de fibra acero forjado Black Jack", categoria: "Herramientas manuales", descripcion: "Martillo robusto para tareas de obra, reparacion y mantenimiento.", precio: 16000 },
    { codigo: "PALA-001", nombre: "Pala de punta chapa acero estampada cabo metalico", categoria: "Jardineria", descripcion: "Herramienta de punta para tareas de jardineria y movimiento de tierra.", precio: 21329 },
    { codigo: "AMOLADORA-001", nombre: "Amoladora angular inalambrica DeWalt Flexvolt DCG416B", categoria: "Herramientas electricas", descripcion: "Amoladora inalambrica para cortar, desbastar y trabajar distintos materiales.", precio: 50000 },
    { codigo: "KIT-TAPONES-001", nombre: "Kit juego tapones para cano de termofusion", categoria: "Accesorios", descripcion: "Juego de tapones y obturadores para instalaciones de agua.", precio: 55000 },
    { codigo: "TALADRO-001", nombre: "Taladro atornillador inalambrico 10 mm 20 V", categoria: "Herramientas electricas", descripcion: "Atornillador inalambrico para perforar y ajustar en distintos proyectos.", precio: 79999 }
];

const catalogo = new Catalogo(productosIniciales.map((datos) => new Producto(datos)));
const carrito = FachadaStorage.cargarCarrito();
let pagoActual = null;
let pedidoPendiente = null;
let esperandoCierreCarrito = false;

// Obtiene elementos del DOM y permite distinguir
// entre controles obligatorios y opcionales.
const elemento = (selector, obligatorio = true) => {
    const encontrado = document.querySelector(selector);

    if (!encontrado && obligatorio) {
        console.error(`No se encontró el elemento requerido: ${selector}`);
    }

    return encontrado;
};

const elementos = {
    busqueda: elemento("#busqueda"),
    formBusqueda: elemento("#form-busqueda"),
    estadoAplicacion: elemento("#estado-aplicacion", false),
    categoria: elemento("#categoria"),
    orden: elemento("#orden"),
    activarPrecio: elemento("#activar-filtro-precio"),
    precio: elemento("#precio-hasta"),
    precioValor: elemento("#precio-hasta-valor"),
    resultados: elemento("#resultados-catalogo"),
    catalogoMensaje: elemento("#catalogo-mensaje"),
    carritoItems: elemento("#carrito-items"),
    carritoMensaje: elemento("#carrito-mensaje"),
    carritoTotal: elemento("#carrito-total"),
    contadorCarrito: elemento("#contador-carrito"),
    botonIniciarCompra: elemento('[data-action="iniciar-compra"]'),
    seccionPago: elemento("#pago"),
    formPago: elemento("#form-pago"),
    metodoPago: elemento("#metodo-pago"),
    cuotas: elemento("#cuotas"),
    condicionesPago: elemento("#condiciones-pago"),
    pagoMensaje: elemento("#pago-mensaje"),
    seccionConfirmacion: elemento("#confirmacion"),
    formPedido: elemento("#form-pedido"),
    pedidoMensaje: elemento("#pedido-mensaje"),
    resumenPedido: elemento("#resumen-pedido"),
    seccionCatalogo: elemento("#catalogo"),
    panelCarrito: elemento("#carrito"),
    seccionOfertas: elemento("#ofertas"),
    navegacionPrincipal: elemento('nav[aria-label="Navegacion principal"]')
};

// Verifica que existan los elementos obligatorios
// antes de inicializar los eventos de la aplicación.
const elementosFaltantes = Object.entries(elementos)
    .filter(([nombre, control]) =>
        nombre !== "estadoAplicacion" && control === null
    )
    .map(([nombre]) => nombre);

if (elementosFaltantes.length > 0) {
    throw new Error(
        `Faltan elementos obligatorios: ${elementosFaltantes.join(", ")}`
    );
}

const tarjetasCatalogo = new Map(
    Array.from(elementos.resultados.querySelectorAll("article[data-product-code]"))
        .map((tarjeta) => [tarjeta.dataset.productCode, tarjeta.parentElement])
);

// Muestra mensajes informativos, de éxito, error o carga,
// aplicando las clases CSS correspondientes a cada estado.
function mostrarMensaje(destino, mensaje, tipo = "info") {
    if (!destino) return;
    
    destino.replaceChildren();

    destino.classList.remove(
        "text-danger",
        "text-success",
        "text-muted",
        "text-info",
        "is-loading"
    );

    if (tipo === "loading") {
        destino.classList.add("text-info", "is-loading");

        const spinner = document.createElement("span");
        spinner.className = "spinner-border spinner-border-sm me-2";
        spinner.setAttribute("aria-hidden", "true");

        destino.append(spinner, document.createTextNode(mensaje));
        return;
    }

    destino.textContent = mensaje;

    if (tipo === "error") destino.classList.add("text-danger");
    if (tipo === "success") destino.classList.add("text-success");
    if (tipo === "info") destino.classList.add("text-muted");
}

// Aplica validación visual a los controles del formulario
// y actualiza los mensajes de error asociados.
function marcarControl(control, valido, mensaje = "") {
    control.classList.toggle("is-invalid", !valido);
    control.classList.toggle("is-valid", valido);
    control.setAttribute("aria-invalid", String(!valido));
    const mensajeId = control.getAttribute("aria-describedby");
    if (mensajeId) {
        const salida = document.getElementById(mensajeId);
        if (salida) {
            salida.textContent = mensaje;
            salida.classList.toggle("text-danger", !valido && Boolean(mensaje));
        }
    }
}

// Elimina las clases y mensajes de validación para restablecer
// el estado visual inicial de un control.
function limpiarEstadoControl(control) {
    control.classList.remove("is-invalid", "is-valid");
    control.removeAttribute("aria-invalid");
    const mensajeId = control.getAttribute("aria-describedby");

    if (mensajeId) {
        const salida = document.getElementById(mensajeId);

        if (salida) {
            salida.textContent = "";
            salida.classList.remove("text-danger");
        }
    }
}

function buscarYMostrarCatalogo() {
    const criterios = {
        texto: elementos.busqueda.value,
        categoria: elementos.categoria.value,
        precioMaximo: elementos.activarPrecio.checked ? elementos.precio.value : null,
        orden: elementos.orden.value
    };
    const resultado = catalogo.buscar(criterios);

    if (!resultado.valido) {
        marcarControl(elementos.precio, false, resultado.error);
        mostrarMensaje(elementos.catalogoMensaje, resultado.error, "error");
        return;
    }

    if (elementos.activarPrecio.checked) {
        marcarControl(elementos.precio, true);
    } else {
        limpiarEstadoControl(elementos.precio);
    }
    resultado.resultados.forEach((producto) => {
        const tarjeta = tarjetasCatalogo.get(producto.codigo);
        if (!tarjeta) {
            throw new Error(`No hay una tarjeta HTML para el producto ${producto.codigo}.`);
        }
        elementos.resultados.append(tarjeta);
        tarjeta.hidden = false;
    });

    const codigosVisibles = new Set(resultado.resultados.map((producto) => producto.codigo));
    tarjetasCatalogo.forEach((tarjeta, codigo) => {
        tarjeta.hidden = !codigosVisibles.has(codigo);
    });

    mostrarMensaje(
        elementos.catalogoMensaje,
        resultado.resultados.length
            ? `${resultado.resultados.length} producto(s) encontrado(s).`
            : "Sin coincidencias.",
        resultado.resultados.length ? "success" : "info"
    );
}

// Actualiza visualmente los productos, cantidades y totales del carrito
// utilizando la información proporcionada por la clase Carrito.
function renderizarCarrito() {
    const resumen = carrito.resumir();
    elementos.carritoItems.replaceChildren();
    elementos.contadorCarrito.textContent = String(resumen.cantidadItems);
    elementos.carritoTotal.textContent = FormateadorMoneda.formatear(resumen.total);
    elementos.botonIniciarCompra.disabled = resumen.items.length === 0;
    mostrarMensaje(
        elementos.carritoMensaje,
        resumen.items.length ? `${resumen.cantidadItems} producto(s) en el carrito.` : "El carrito esta vacio.",
        resumen.items.length ? "success" : "info"
    );

    resumen.items.forEach((item) => {
        const articulo = document.createElement("article");
        articulo.dataset.productCode = item.codigo;

        const titulo = document.createElement("h3");
        titulo.textContent = item.nombre;
        const precio = document.createElement("p");
        precio.textContent = `Precio unitario: ${FormateadorMoneda.formatear(item.precio)}`;

        const label = document.createElement("label");
        const cantidadId = `cantidad-${item.codigo.toLocaleLowerCase("es")}`;
        label.htmlFor = cantidadId;
        label.textContent = "Cantidad";

        const cantidad = document.createElement("input");
        cantidad.id = cantidadId;
        cantidad.type = "number";
        cantidad.min = "1";
        cantidad.step = "1";
        cantidad.value = String(item.cantidad);
        cantidad.dataset.action = "cambiar-cantidad";
        cantidad.dataset.productCode = item.codigo;
        cantidad.setAttribute("aria-label", `Cantidad de ${item.nombre}`);
        const errorCantidad = document.createElement("span");
        errorCantidad.id = `error-${cantidadId}`;
        errorCantidad.className = "field-error";
        errorCantidad.setAttribute("aria-live", "polite");
        cantidad.setAttribute("aria-describedby", errorCantidad.id);

        const subtotal = document.createElement("p");
        subtotal.textContent = `Subtotal: ${FormateadorMoneda.formatear(item.subtotal)}`;
        const eliminar = document.createElement("button");
        eliminar.type = "button";
        eliminar.dataset.action = "eliminar-carrito";
        eliminar.dataset.productCode = item.codigo;
        eliminar.textContent = "Eliminar";

        articulo.append(titulo, precio, label, cantidad, errorCantidad, subtotal, eliminar);
        elementos.carritoItems.append(articulo);
    });
}

// Oculta las secciones de pago y confirmación,
// limpiando los resultados y estados que ya no son válidos.
function ocultarFlujosPosteriores() {
    elementos.seccionPago.hidden = true;
    elementos.seccionConfirmacion.hidden = true;
    elementos.condicionesPago.replaceChildren();
    elementos.resumenPedido.replaceChildren();
    elementos.formPedido.hidden = false;
    pedidoPendiente = null;
}

// Genera dinámicamente el resumen de las condiciones de pago
// utilizando los resultados calculados por la clase Pago.
function renderizarCondiciones(condiciones) {
    elementos.condicionesPago.replaceChildren();
    const lista = document.createElement("dl");
    const datos = [
        ["Total original", FormateadorMoneda.formatear(condiciones.totalOriginal)],
        ["Cuotas", String(condiciones.cuotas)],
        ["Interes / recargo", `${condiciones.porcentajeRecargo}% (${FormateadorMoneda.formatear(condiciones.interes)})`],
        ["Total financiado", FormateadorMoneda.formatear(condiciones.totalFinanciado)],
        ["Valor de cada cuota", FormateadorMoneda.formatear(condiciones.valorCuota)]
    ];
    datos.forEach(([etiqueta, valor]) => {
        const termino = document.createElement("dt");
        termino.textContent = etiqueta;
        const detalle = document.createElement("dd");
        detalle.textContent = valor;
        lista.append(termino, detalle);
    });
    elementos.condicionesPago.append(lista);
}

function obtenerCondicionesPago() {
    const resumen = carrito.resumir();
    if (!resumen.items.length) {
        mostrarMensaje(elementos.pagoMensaje, "No hay productos para pagar.", "error");
        return null;
    }

    try {
        const pago = new Pago(
            resumen.total,
            elementos.metodoPago.value,
            elementos.cuotas.value
        );
        const condiciones = pago.calcular();
        marcarControl(elementos.metodoPago, true);
        marcarControl(elementos.cuotas, true);
        renderizarCondiciones(condiciones);
        pagoActual = pago;
        mostrarMensaje(elementos.pagoMensaje, "Condiciones calculadas. Revisa el resumen antes de continuar.", "success");
        return condiciones;
    } catch (error) {
        if (!(error instanceof TypeError || error instanceof RangeError)) throw error;
        pagoActual = null;
        mostrarMensaje(elementos.pagoMensaje, error.message, "error");
        marcarControl(
            Pago.admiteCuotas(elementos.metodoPago.value)
                ? elementos.cuotas
                : elementos.metodoPago,
            false,
            error.message
        );
        return null;
    }
}

// Captura los datos ingresados en el formulario del cliente
// y los organiza en un objeto para la clase Pedido.
function clienteDesdeFormulario() {
    return {
        nombre: elementos.formPedido.elements.nombre.value,
        correo: elementos.formPedido.elements.correo.value,
        direccion: elementos.formPedido.elements.direccion.value
    };
}

// Construye los elementos HTML del resumen del pedido
// incluyendo productos, datos del cliente y condiciones de pago.
function agregarDatosResumen(contenedor, resumen) {
    const titulo = document.createElement("h3");
    titulo.textContent = "Resumen del pedido";
    const productos = document.createElement("ul");
    resumen.productos.forEach((item) => {
        const linea = document.createElement("li");
        linea.textContent = `${item.nombre} | ${item.cantidad} x ${FormateadorMoneda.formatear(item.precio)} = ${FormateadorMoneda.formatear(item.subtotal)}`;
        productos.append(linea);
    });

    const cliente = document.createElement("p");
    cliente.textContent = `Cliente: ${resumen.cliente.nombre} · ${resumen.cliente.correo} · Envio a: ${resumen.cliente.direccion}`;
    const condiciones = document.createElement("p");
    condiciones.textContent = `Total original: ${FormateadorMoneda.formatear(resumen.pago.totalOriginal)} · Metodo: ${resumen.pago.metodoPago} · ${resumen.pago.cuotas} cuota(s) · Recargo: ${resumen.pago.porcentajeRecargo}% · Total financiado: ${FormateadorMoneda.formatear(resumen.pago.totalFinanciado)} · Valor de cuota: ${FormateadorMoneda.formatear(resumen.pago.valorCuota)}`;
    const boton = document.createElement("button");
    boton.type = "button";
    boton.dataset.action = "confirmar-pedido";
    boton.textContent = "Confirmar pedido";
    contenedor.append(titulo, productos, cliente, condiciones, boton);
}

 function invalidarPagoPorCambioCarrito() {
    const habiaPago = pagoActual !== null;
    const habiaPedido = pedidoPendiente !== null;

    pagoActual = null;

    ocultarFlujosPosteriores();

    return habiaPago || habiaPedido;
}
 function procesarOperacionCarrito(operacion, codigoCantidad = null) {
    const resultado = operacion();

    if (!resultado.exito) {
        renderizarCarrito();

        mostrarMensaje(elementos.carritoMensaje, resultado.error, "error");
        mostrarMensaje(elementos.estadoAplicacion, resultado.error, "error");

        if (codigoCantidad) {
            const control = Array.from(
                elementos.carritoItems.querySelectorAll('[data-action="cambiar-cantidad"]')
            ).find((entrada) => entrada.dataset.productCode === codigoCantidad);

            if (control) {
                marcarControl(control, false, resultado.error);
            }
        }

        return false;
    }

    const guardado = FachadaStorage.guardarCarrito(carrito);

    const pagoInvalidado = invalidarPagoPorCambioCarrito();

    renderizarCarrito();

    if (!guardado) {
        const mensaje = "El carrito se actualizó, pero no pudo guardarse. Los cambios podrían perderse al recargar.";

        mostrarMensaje(elementos.carritoMensaje, mensaje, "error");
        mostrarMensaje(elementos.estadoAplicacion, mensaje, "error");
    } else if (pagoInvalidado) {
        const mensaje = "Carrito actualizado; el pago debe seleccionarse nuevamente.";

        mostrarMensaje(elementos.carritoMensaje, mensaje, "info");
        mostrarMensaje(elementos.estadoAplicacion, mensaje, "info");
    } else {
        mostrarMensaje(elementos.estadoAplicacion, "Carrito actualizado.", "success");
    }

    return true;
}

// Prepara la interfaz de pago, reinicia los estados anteriores
// y espera el cierre del Offcanvas antes de desplazarse a la sección de pago.
function iniciarPago() {
    if (esperandoCierreCarrito) return;
    
    if (!carrito.resumir().items.length) {
        mostrarMensaje(elementos.carritoMensaje, "No se puede comprar con el carrito vacio.", "error");
        return;
    }
    esperandoCierreCarrito = true;
    pagoActual = null;
    pedidoPendiente = null;

    elementos.formPedido.hidden = false;
    elementos.formPedido.reset();
    elementos.formPedido.querySelectorAll("input").forEach(limpiarEstadoControl);
    elementos.resumenPedido.replaceChildren();
    elementos.metodoPago.value = "";
    elementos.cuotas.value = "1";
    elementos.cuotas.disabled = true;
    elementos.condicionesPago.replaceChildren();
    elementos.seccionConfirmacion.hidden = true;
    elementos.seccionPago.hidden = false;
    mostrarMensaje(elementos.pagoMensaje, "Selecciona el metodo de pago.", "info");

    // Muestra el indicador de carga durante el cierre del carrito.
    mostrarMensaje(
        elementos.estadoAplicacion ?? elementos.carritoMensaje,
        "Preparando el pago...",
        "loading"
    );
    if (elementos.estadoAplicacion) {
        elementos.estadoAplicacion.classList.add(
        "position-fixed",
        "top-0",
        "start-50",
        "translate-middle-x",
        "mt-3",
        "p-3",
        "bg-body",
        "rounded",
        "shadow"
    );
    elementos.estadoAplicacion.style.zIndex = "1100";
}

}

// Cancela el proceso de pago y restablece la interfaz,
// conservando los productos agregados al carrito.
function cancelarPago() {
    esperandoCierreCarrito = false;
    pagoActual = null;
    ocultarFlujosPosteriores();
    mostrarMensaje(elementos.carritoMensaje, "Pago cancelado. El carrito se conserva.", "info");
}

function confirmarPedido() {
    if (!pedidoPendiente) {
        mostrarMensaje(elementos.pedidoMensaje, "Revisa los datos y genera el resumen antes de confirmar.", "error");
        return;
    }
    try {
        const numero = confirmarPedidoConNumeracion(pedidoPendiente);
        const resumen = pedidoPendiente.resumir();
        elementos.resumenPedido.replaceChildren();
        const mensaje = document.createElement("p");
        mensaje.textContent = `Pedido confirmado: ${numero}`;
        elementos.resumenPedido.append(mensaje);
        agregarDatosResumen(elementos.resumenPedido, resumen);
        elementos.resumenPedido.querySelector('[data-action="confirmar-pedido"]').remove();
        elementos.formPedido.hidden = true;
        carrito.vaciar();
        const carritoGuardado = FachadaStorage.guardarCarrito(carrito);
        pagoActual = null;
        pedidoPendiente = null;
        renderizarCarrito();
        elementos.seccionPago.hidden = true;
        mostrarMensaje(elementos.pedidoMensaje,carritoGuardado
                ? "La operacion se realizo correctamente."
                : "Pedido confirmado, pero no se pudo guardar el carrito vacío. Los productos podrían reaparecer al recargar.",
            carritoGuardado ? "success" : "error"
        );
    } catch (error) {
        if (!(error instanceof TypeError || error instanceof RangeError)) throw error;
        mostrarMensaje(elementos.pedidoMensaje, error.message, "error");
    }
}

// Cancela la confirmación del pedido y limpia el formulario,
// conservando el carrito y las condiciones de pago.
function cancelarPedido() {
    pedidoPendiente = null;
    elementos.resumenPedido.replaceChildren();
    elementos.seccionConfirmacion.hidden = true;
    elementos.formPedido.reset();
    elementos.formPedido.querySelectorAll("input").forEach(limpiarEstadoControl);
    mostrarMensaje(elementos.pedidoMensaje, "Pedido cancelado. Se conservaron el carrito y las condiciones de pago.", "info");
    elementos.seccionPago.scrollIntoView({ behavior: "smooth", block: "start" });
}

function inicializarEventos() {
    buscarYMostrarCatalogo();
    renderizarCarrito();
    // Gestiona el cierre del Offcanvas una sola vez.
    // La transición al pago se ejecuta únicamente
    // cuando fue solicitada mediante "Iniciar compra".
    elementos.panelCarrito.addEventListener("hidden.bs.offcanvas", () => {
        if (!esperandoCierreCarrito) return;

        esperandoCierreCarrito = false;

        renderizarCarrito();

        requestAnimationFrame(() => {
            elementos.seccionPago.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });

        // Mantiene visible el indicador de carga durante 900 ms.
        setTimeout(() => {
            if (elementos.estadoAplicacion) {
                elementos.estadoAplicacion.classList.remove(
                    "position-fixed",
                    "top-0",
                    "start-50",
                    "translate-middle-x",
                    "mt-3",
                    "p-3",
                    "bg-body",
                    "rounded",
                    "shadow"
                );

                elementos.estadoAplicacion.style.removeProperty("z-index");
            }

            mostrarMensaje(
                elementos.estadoAplicacion,
                "Pago listo para completar.",
                "success"
            );
        }, 900);
    });


    elementos.formBusqueda.addEventListener("submit", (evento) => {
        evento.preventDefault();
        buscarYMostrarCatalogo();
        elementos.seccionCatalogo.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    elementos.busqueda.addEventListener("input", buscarYMostrarCatalogo);
    elementos.categoria.addEventListener("change", buscarYMostrarCatalogo);
    elementos.orden.addEventListener("change", buscarYMostrarCatalogo);
    elementos.activarPrecio.addEventListener("change", () => {
        elementos.precio.disabled = !elementos.activarPrecio.checked;
        elementos.precioValor.textContent = elementos.activarPrecio.checked
            ? FormateadorMoneda.formatear(Number(elementos.precio.value))
            : "Sin limite";
        buscarYMostrarCatalogo();
    });
    elementos.precio.addEventListener("input", () => {
        elementos.precioValor.textContent = FormateadorMoneda.formatear(Number(elementos.precio.value));
        buscarYMostrarCatalogo();
    });

    // CATÁLOGO Y OFERTAS
    // Delega la acción de agregar productos al carrito.
    function manejarAgregarCarrito(evento) {
        const accion = evento.target.closest('[data-action="agregar-carrito"]');

        if (!accion || !evento.currentTarget.contains(accion)) return;

        const codigo = accion.dataset.productCode;

        procesarOperacionCarrito(
            () => carrito.agregar(catalogo, codigo, 1)
        );
    }

    elementos.seccionCatalogo.addEventListener("click", manejarAgregarCarrito);
    elementos.seccionOfertas.addEventListener("click", manejarAgregarCarrito);


    // NAVEGACIÓN
    // Delega el filtrado de productos desde el menú de categorías.
    elementos.navegacionPrincipal.addEventListener("click", (evento) => {
        const filtroCategoria = evento.target.closest("[data-categoria]");

        if (!filtroCategoria ||
            !elementos.navegacionPrincipal.contains(filtroCategoria)) return;

        evento.preventDefault();

        elementos.busqueda.value = "";
        elementos.categoria.value = filtroCategoria.dataset.categoria;
        elementos.activarPrecio.checked = false;
        elementos.precio.disabled = true;
        elementos.precio.value = elementos.precio.max;
        elementos.precioValor.textContent = "Sin limite";

        buscarYMostrarCatalogo();

        elementos.seccionCatalogo.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });


    // CARRITO
    // Delega la eliminación de productos y el inicio de compra.
    elementos.panelCarrito.addEventListener("click", (evento) => {
        const accion = evento.target.closest("[data-action]");

        if (!accion || !elementos.panelCarrito.contains(accion)) return;

        const codigo = accion.dataset.productCode;

        switch (accion.dataset.action) {
            case "eliminar-carrito":
                procesarOperacionCarrito(
                    () => carrito.eliminar(codigo)
                );
                break;

            case "iniciar-compra":
                iniciarPago();
                break;

            default:
                break;
        }
    });


    // PAGO
    // Delega la cancelación del proceso de pago.
    elementos.seccionPago.addEventListener("click", (evento) => {
        const accion = evento.target.closest('[data-action="cancelar-pago"]');

        if (!accion || !elementos.seccionPago.contains(accion)) return;

        cancelarPago();
    });


    // CONFIRMACIÓN
    // Delega las acciones de cancelar y confirmar el pedido.
    elementos.seccionConfirmacion.addEventListener("click", (evento) => {
        const accion = evento.target.closest("[data-action]");

        if (!accion || !elementos.seccionConfirmacion.contains(accion)) return;

        switch (accion.dataset.action) {
            case "cancelar-pedido":
                cancelarPedido();
                break;

            case "confirmar-pedido":
                confirmarPedido();
                break;

            default:
                break;
        }
    });
    
    // Valida inmediatamente la cantidad ingresada sin modificar el carrito.
    elementos.carritoItems.addEventListener("input", (evento) => {
        const control = evento.target.closest('[data-action="cambiar-cantidad"]');
        if (!control) return;

        const resultado = validarCambioCantidad(
            carrito,
            control.dataset.productCode,
            control.value
        );

        marcarControl(
            control,
            resultado.exito,
            resultado.error ?? ""
        );
    });


    // Actualiza la cantidad mediante la clase Carrito cuando se confirma el cambio.
    elementos.carritoItems.addEventListener("change", (evento) => {
        const control = evento.target.closest('[data-action="cambiar-cantidad"]');
        if (!control) return;
        procesarOperacionCarrito(
            () => carrito.cambiarCantidad(control.dataset.productCode, control.value),
            control.dataset.productCode
        );
    });

    elementos.metodoPago.addEventListener("change", () => {
        const admiteCuotas = Pago.admiteCuotas(
            elementos.metodoPago.value
        );
        elementos.cuotas.disabled = !admiteCuotas;

        if (!admiteCuotas) {
            elementos.cuotas.value = "1";
        }
        elementos.condicionesPago.replaceChildren();
        pagoActual = null;
        pedidoPendiente = null;
        elementos.seccionConfirmacion.hidden = true;
        elementos.resumenPedido.replaceChildren();
        if (elementos.metodoPago.value) obtenerCondicionesPago();
    });

    elementos.cuotas.addEventListener("change", () => {
        pedidoPendiente = null;
        elementos.resumenPedido.replaceChildren();

        elementos.seccionConfirmacion.hidden = true;

        obtenerCondicionesPago();
        mostrarMensaje(
            elementos.pagoMensaje,
            "Cambiaste las cuotas. Revisá las condiciones y continuá nuevamente.",
            "info"
        );
    });

    elementos.formPago.addEventListener("submit", (evento) => {
        evento.preventDefault();
        if (!obtenerCondicionesPago()) return;
        elementos.seccionConfirmacion.hidden = false;
        elementos.resumenPedido.replaceChildren();
        pedidoPendiente = null;
        mostrarMensaje(elementos.pedidoMensaje, "Completa tus datos para revisar el pedido.", "info");
        elementos.seccionConfirmacion.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    // Valida inmediatamente el campo mientras el usuario escribe.
    elementos.formPedido.addEventListener("input", (evento) => {
        const control = evento.target.closest("input");
        if (!control) return;
        if (pedidoPendiente !== null) {
            pedidoPendiente = null;
            elementos.resumenPedido.replaceChildren();

            mostrarMensaje(
                elementos.pedidoMensaje,
                "Los datos del cliente cambiaron. Revisá nuevamente el resumen antes de confirmar.",
                "info"
            );
        }
            
        limpiarEstadoControl(control);
    });
    

    // Valida todos los campos antes de generar el resumen del pedido.
    elementos.formPedido.addEventListener("submit", (evento) => {
        evento.preventDefault();
        
        try {
            // Validación definitiva mediante la clase Pedido.
            pedidoPendiente = new Pedido(
                carrito,
                pagoActual,
                clienteDesdeFormulario()
            );
            
            const resumen = pedidoPendiente.resumir();
            
            elementos.resumenPedido.replaceChildren();
            
            agregarDatosResumen(
                elementos.resumenPedido,
                resumen
            );
            
            mostrarMensaje(
                elementos.pedidoMensaje,
                "Revisa el resumen y confirma o cancela el pedido.",
                "success"
            );
        
        } catch (error) {
            
            if (!(error instanceof TypeError || error instanceof RangeError)) {
                throw error;
            }

            pedidoPendiente = null;
            elementos.resumenPedido.replaceChildren();

            const campo = error.campo && elementos.formPedido.elements[error.campo];

            if (campo) {
                marcarControl(campo, false, error.message);
                campo.focus();
            }
            mostrarMensaje(
                elementos.pedidoMensaje,
                error.message,
                "error"
            );
        }
    });

}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inicializarEventos, { once: true });
} else {
    inicializarEventos();
}
