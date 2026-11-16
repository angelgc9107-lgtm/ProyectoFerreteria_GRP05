import { Producto } from "./models/Producto.js";
import { Catalogo } from "./models/Catalogo.js";
import { Carrito } from "./models/Carrito.js";
import { Pago } from "./models/Pago.js";
import { Pedido } from "./models/Pedido.js";

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
const carrito = new Carrito();
let pagoActual = null;
let pedidoPendiente = null;
let secuenciaPedidos = 1;

const elemento = (selector) => {
    const encontrado = document.querySelector(selector);
    if (!encontrado) {
        throw new Error(`No se encontro el elemento requerido: ${selector}`);
    }
    return encontrado;
};

const elementos = {
    busqueda: elemento("#busqueda"),
    formBusqueda: elemento("#form-busqueda"),
    estadoAplicacion: elemento("#estado-aplicacion"),
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
    resumenPedido: elemento("#resumen-pedido")
};

const tarjetasCatalogo = new Map(
    Array.from(elementos.resultados.querySelectorAll("article[data-product-code]"))
        .map((tarjeta) => [tarjeta.dataset.productCode, tarjeta.parentElement])
);

function formatearMoneda(importe) {
    return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(importe);
}

function mostrarMensaje(destino, mensaje, tipo = "info") {
    destino.textContent = mensaje;
    destino.classList.remove("text-danger", "text-success", "text-muted");
    if (tipo === "error") destino.classList.add("text-danger");
    if (tipo === "success") destino.classList.add("text-success");
    if (tipo === "info") destino.classList.add("text-muted");
}

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

function limpiarEstadoControl(control) {
    control.classList.remove("is-invalid", "is-valid");
    control.removeAttribute("aria-invalid");
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

function renderizarCarrito() {
    const resumen = carrito.resumir();
    elementos.carritoItems.replaceChildren();
    elementos.contadorCarrito.textContent = String(resumen.cantidadItems);
    elementos.carritoTotal.textContent = formatearMoneda(resumen.total);
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
        precio.textContent = `Precio unitario: ${formatearMoneda(item.precio)}`;

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
        subtotal.textContent = `Subtotal: ${formatearMoneda(item.subtotal)}`;
        const eliminar = document.createElement("button");
        eliminar.type = "button";
        eliminar.dataset.action = "eliminar-carrito";
        eliminar.dataset.productCode = item.codigo;
        eliminar.textContent = "Eliminar";

        articulo.append(titulo, precio, label, cantidad, errorCantidad, subtotal, eliminar);
        elementos.carritoItems.append(articulo);
    });
}

function ocultarFlujosPosteriores() {
    elementos.seccionPago.hidden = true;
    elementos.seccionConfirmacion.hidden = true;
    elementos.condicionesPago.replaceChildren();
    elementos.resumenPedido.replaceChildren();
    elementos.formPedido.hidden = false;
    pedidoPendiente = null;
}

function renderizarCondiciones(condiciones) {
    elementos.condicionesPago.replaceChildren();
    const lista = document.createElement("dl");
    const datos = [
        ["Total original", formatearMoneda(condiciones.totalOriginal)],
        ["Cuotas", String(condiciones.cuotas)],
        ["Interes / recargo", `${condiciones.porcentajeRecargo}% (${formatearMoneda(condiciones.interes)})`],
        ["Total financiado", formatearMoneda(condiciones.totalFinanciado)],
        ["Valor de cada cuota", formatearMoneda(condiciones.valorCuota)]
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
    if (!elementos.metodoPago.value) {
        mostrarMensaje(elementos.pagoMensaje, "Selecciona un metodo de pago.", "error");
        marcarControl(elementos.metodoPago, false);
        return null;
    }

    try {
        const pago = new Pago(
            resumen.total,
            elementos.metodoPago.value,
            elementos.metodoPago.value === "tarjeta" ? elementos.cuotas.value : 1
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
            elementos.metodoPago.value === "tarjeta" ? elementos.cuotas : elementos.metodoPago,
            false,
            error.message
        );
        return null;
    }
}

function clienteDesdeFormulario() {
    return {
        nombre: elementos.formPedido.elements.nombre.value,
        correo: elementos.formPedido.elements.correo.value,
        direccion: elementos.formPedido.elements.direccion.value
    };
}

function validarCampoPedido(control) {
    if (!carrito.resumir().items.length || !pagoActual) return;
    const cliente = {
        nombre: "Cliente",
        correo: "cliente@ferrolab.com",
        direccion: "Direccion de prueba"
    };
    cliente[control.name] = control.value;
    try {
        new Pedido(carrito, pagoActual, cliente);
        marcarControl(control, true);
    } catch (error) {
        if (!(error instanceof TypeError || error instanceof RangeError)) throw error;
        if (error.campo !== control.name) throw error;
        marcarControl(control, false, error.message);
    }
}

function agregarDatosResumen(contenedor, resumen) {
    const titulo = document.createElement("h3");
    titulo.textContent = "Resumen del pedido";
    const productos = document.createElement("ul");
    resumen.productos.forEach((item) => {
        const linea = document.createElement("li");
        linea.textContent = `${item.nombre} | ${item.cantidad} x ${formatearMoneda(item.precio)} = ${formatearMoneda(item.subtotal)}`;
        productos.append(linea);
    });

    const cliente = document.createElement("p");
    cliente.textContent = `Cliente: ${resumen.cliente.nombre} · ${resumen.cliente.correo} · Envio a: ${resumen.cliente.direccion}`;
    const condiciones = document.createElement("p");
    condiciones.textContent = `Total original: ${formatearMoneda(resumen.pago.totalOriginal)} · Metodo: ${resumen.pago.metodoPago} · ${resumen.pago.cuotas} cuota(s) · Recargo: ${resumen.pago.porcentajeRecargo}% · Total financiado: ${formatearMoneda(resumen.pago.totalFinanciado)} · Valor de cuota: ${formatearMoneda(resumen.pago.valorCuota)}`;
    const boton = document.createElement("button");
    boton.type = "button";
    boton.dataset.action = "confirmar-pedido";
    boton.textContent = "Confirmar pedido";
    contenedor.append(titulo, productos, cliente, condiciones, boton);
}

function invalidarPagoSiCambioTotal(totalAnterior, totalNuevo) {
    if (totalAnterior === totalNuevo) return false;
    const habiaPago = pagoActual !== null;
    pagoActual = null;
    ocultarFlujosPosteriores();
    if (habiaPago) {
        mostrarMensaje(elementos.pagoMensaje, "El total cambio. Debes volver a elegir el metodo de pago y las cuotas.", "info");
    }
    return habiaPago;
}

function procesarOperacionCarrito(operacion, codigoCantidad = null) {
    const totalAnterior = carrito.resumir().total;
    const resultado = operacion();
    if (!resultado.exito) {
        renderizarCarrito();
        mostrarMensaje(elementos.carritoMensaje, resultado.error, "error");
        mostrarMensaje(elementos.estadoAplicacion, resultado.error, "error");
        if (codigoCantidad) {
            const control = Array.from(elementos.carritoItems.querySelectorAll('[data-action="cambiar-cantidad"]'))
                .find((entrada) => entrada.dataset.productCode === codigoCantidad);
            if (control) marcarControl(control, false, resultado.error);
        }
        return false;
    }
    const totalNuevo = carrito.resumir().total;
    const pagoInvalidado = invalidarPagoSiCambioTotal(totalAnterior, totalNuevo);
    renderizarCarrito();
    if (pagoInvalidado) {
        const mensaje = "Carrito actualizado; el pago debe seleccionarse nuevamente.";
        mostrarMensaje(elementos.carritoMensaje, mensaje, "info");
        mostrarMensaje(elementos.estadoAplicacion, mensaje, "info");
    } else {
        mostrarMensaje(elementos.estadoAplicacion, "Carrito actualizado.", "success");
    }
    return true;
}

function iniciarPago() {
    if (!carrito.resumir().items.length) {
        mostrarMensaje(elementos.carritoMensaje, "No se puede comprar con el carrito vacio.", "error");
        return;
    }
    pagoActual = null;
    pedidoPendiente = null;
    elementos.formPedido.hidden = false;
    elementos.formPedido.reset();
    elementos.formPedido.querySelectorAll("input").forEach((control) => marcarControl(control, true));
    elementos.resumenPedido.replaceChildren();
    elementos.metodoPago.value = "";
    elementos.cuotas.value = "1";
    elementos.cuotas.disabled = true;
    elementos.condicionesPago.replaceChildren();
    elementos.seccionConfirmacion.hidden = true;
    elementos.seccionPago.hidden = false;
    mostrarMensaje(elementos.pagoMensaje, "Selecciona el metodo de pago.", "info");
    elementos.seccionPago.scrollIntoView({ behavior: "smooth", block: "start" });
}

function cancelarPago() {
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
        const numero = pedidoPendiente.confirmar(Date.now(), secuenciaPedidos);
        secuenciaPedidos += 1;
        const resumen = pedidoPendiente.resumir();
        elementos.resumenPedido.replaceChildren();
        const mensaje = document.createElement("p");
        mensaje.textContent = `Pedido confirmado: ${numero}`;
        elementos.resumenPedido.append(mensaje);
        agregarDatosResumen(elementos.resumenPedido, resumen);
        elementos.resumenPedido.querySelector('[data-action="confirmar-pedido"]').remove();
        elementos.formPedido.hidden = true;
        carrito.vaciar();
        pagoActual = null;
        pedidoPendiente = null;
        renderizarCarrito();
        elementos.seccionPago.hidden = true;
        mostrarMensaje(elementos.pedidoMensaje, "La operacion se realizo correctamente.", "success");
    } catch (error) {
        if (!(error instanceof TypeError || error instanceof RangeError)) throw error;
        mostrarMensaje(elementos.pedidoMensaje, error.message, "error");
    }
}

function cancelarPedido() {
    pedidoPendiente = null;
    elementos.resumenPedido.replaceChildren();
    elementos.seccionConfirmacion.hidden = true;
    elementos.formPedido.reset();
    elementos.formPedido.querySelectorAll("input").forEach((control) => marcarControl(control, true));
    mostrarMensaje(elementos.pedidoMensaje, "Pedido cancelado. Se conservaron el carrito y las condiciones de pago.", "info");
    elementos.seccionPago.scrollIntoView({ behavior: "smooth", block: "start" });
}

function inicializarEventos() {
    buscarYMostrarCatalogo();
    renderizarCarrito();

    elementos.formBusqueda.addEventListener("submit", (evento) => {
        evento.preventDefault();
        buscarYMostrarCatalogo();
        elemento("#catalogo").scrollIntoView({ behavior: "smooth", block: "start" });
    });
    elementos.busqueda.addEventListener("input", buscarYMostrarCatalogo);
    elementos.categoria.addEventListener("change", buscarYMostrarCatalogo);
    elementos.orden.addEventListener("change", buscarYMostrarCatalogo);
    elementos.activarPrecio.addEventListener("change", () => {
        elementos.precio.disabled = !elementos.activarPrecio.checked;
        elementos.precioValor.textContent = elementos.activarPrecio.checked
            ? formatearMoneda(Number(elementos.precio.value))
            : "Sin limite";
        buscarYMostrarCatalogo();
    });
    elementos.precio.addEventListener("input", () => {
        elementos.precioValor.textContent = formatearMoneda(Number(elementos.precio.value));
        buscarYMostrarCatalogo();
    });

    document.addEventListener("click", (evento) => {
        const accion = evento.target.closest("[data-action]");
        if (!accion) {
            const filtroCategoria = evento.target.closest("[data-categoria]");
            if (filtroCategoria) {
                evento.preventDefault();
                elementos.categoria.value = filtroCategoria.dataset.categoria;
                buscarYMostrarCatalogo();
                elemento("#catalogo").scrollIntoView({ behavior: "smooth", block: "start" });
            }
            return;
        }
        const codigo = accion.dataset.productCode;
        switch (accion.dataset.action) {
            case "agregar-carrito":
                procesarOperacionCarrito(() => carrito.agregar(catalogo, codigo, 1));
                break;
            case "eliminar-carrito":
                procesarOperacionCarrito(() => carrito.eliminar(codigo));
                break;
            case "iniciar-compra":
                iniciarPago();
                break;
            case "cancelar-pago":
                cancelarPago();
                break;
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

    elementos.carritoItems.addEventListener("change", (evento) => {
        const control = evento.target.closest('[data-action="cambiar-cantidad"]');
        if (!control) return;
        procesarOperacionCarrito(
            () => carrito.cambiarCantidad(control.dataset.productCode, control.value),
            control.dataset.productCode
        );
    });

    elementos.metodoPago.addEventListener("change", () => {
        const tarjeta = elementos.metodoPago.value === "tarjeta";
        elementos.cuotas.disabled = !tarjeta;
        if (!tarjeta) elementos.cuotas.value = "1";
        elementos.condicionesPago.replaceChildren();
        pagoActual = null;
        pedidoPendiente = null;
        elementos.seccionConfirmacion.hidden = true;
        elementos.resumenPedido.replaceChildren();
        if (elementos.metodoPago.value) obtenerCondicionesPago();
    });
    elementos.cuotas.addEventListener("change", obtenerCondicionesPago);
    elementos.formPago.addEventListener("submit", (evento) => {
        evento.preventDefault();
        if (!obtenerCondicionesPago()) return;
        elementos.seccionConfirmacion.hidden = false;
        elementos.resumenPedido.replaceChildren();
        pedidoPendiente = null;
        mostrarMensaje(elementos.pedidoMensaje, "Completa tus datos para revisar el pedido.", "info");
        elementos.seccionConfirmacion.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    elementos.formPedido.addEventListener("input", (evento) => {
        const control = evento.target.closest("input");
        if (control) validarCampoPedido(control);
    });
    elementos.formPedido.addEventListener("submit", (evento) => {
        evento.preventDefault();
        elementos.formPedido.querySelectorAll("input").forEach(validarCampoPedido);
        try {
            pedidoPendiente = new Pedido(carrito, pagoActual, clienteDesdeFormulario());
            const resumen = pedidoPendiente.resumir();
            elementos.resumenPedido.replaceChildren();
            agregarDatosResumen(elementos.resumenPedido, resumen);
            mostrarMensaje(elementos.pedidoMensaje, "Revisa el resumen y confirma o cancela el pedido.", "success");
        } catch (error) {
            if (!(error instanceof TypeError || error instanceof RangeError)) throw error;
            pedidoPendiente = null;
            const campo = error.campo && elementos.formPedido.elements[error.campo];
            if (campo) {
                marcarControl(campo, false, error.message);
                campo.focus();
            }
            mostrarMensaje(elementos.pedidoMensaje, error.message, "error");
        }
    });
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inicializarEventos, { once: true });
} else {
    inicializarEventos();
}
