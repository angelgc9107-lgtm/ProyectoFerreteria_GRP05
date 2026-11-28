import { Producto } from "./models/Producto.js";
import { FachadaStorage } from "./services/FachadaStorage.js";
import { Carrito } from "./models/Carrito.js";
import { Pago } from "./models/Pago.js";
import { Pedido } from "./models/Pedido.js";
import { FormateadorMoneda } from "./services/FormateadorMoneda.js";
import { validarCambioCantidad } from "./services/ValidacionCarrito.js";
import { confirmarPedidoConNumeracion, ErrorPersistenciaPedido } from "./services/ConfirmadorPedidos.js";
import { ServicioOfertas } from "./services/ServicioOfertas.js";
import { IMAGENES_CATALOGO } from "./data/imagenesCatalogo.js";
import { ServicioCategorias } from "./services/ServicioCategorias.js";
import { ServicioOpcionesPago } from "./services/ServicioOpcionesPago.js";
import { validarCampoPedido } from "./services/ValidacionPedido.js";
import { ServicioDialogos } from "./services/ServicioDialogos.js";
import { cargarCatalogo } from "./api/apiService.js";

// El catálogo se carga de forma asíncrona (api/productos.json, con respaldos).
// Es null mientras se espera la primera respuesta.
let catalogo = null;
let cargaCatalogoEnCurso = null;
// Ofertas vigentes del catálogo cargado; vacío si no se pudieron calcular.
let ofertasVigentes = [];
const carrito = FachadaStorage.cargarCarrito();
let pagoActual = null;
let pedidoPendiente = null;
let esperandoCierreCarrito = false;
let confirmacionEnCurso = false;

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
    menuCategorias: elemento("#menu-categorias"),
    orden: elemento("#orden"),
    activarPrecio: elemento("#activar-filtro-precio"),
    precio: elemento("#precio-hasta"),
    precioValor: elemento("#precio-hasta-valor"),
    resultados: elemento("#resultados-catalogo"),
    tablaPreciosCuerpo: elemento("#tabla-precios-cuerpo"),
    catalogoMensaje: elemento("#catalogo-mensaje"),
    reintentarCatalogo: elemento("#reintentar-catalogo", false),
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
    ofertasProductos: elemento("#ofertas-productos"),
    navegacionPrincipal: elemento('nav[aria-label="Navegacion principal"]')
};

// Verifica que existan los elementos obligatorios
// antes de inicializar los eventos de la aplicación.
const elementosFaltantes = Object.entries(elementos)
    .filter(([nombre, control]) =>
        nombre !== "estadoAplicacion" &&
        nombre !== "reintentarCatalogo" &&
        control === null
    )
    .map(([nombre]) => nombre);

if (elementosFaltantes.length > 0) {
    throw new Error(
        `Faltan elementos obligatorios: ${elementosFaltantes.join(", ")}`
    );
}



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


/**
 * Genera dinámicamente las tarjetas de los productos.
 * Recibe los resultados del catálogo y los representa en el DOM.
 *
 * @param {Producto[]} productos
 * @returns {void}
 */
function renderizarCatalogo(productos) {
    const fragmento = document.createDocumentFragment();

    const ofertasPorCodigo = new Map(
        ofertasVigentes.map((oferta) => [oferta.codigo, oferta])
    );

    productos.forEach((producto) => {
        const oferta = ofertasPorCodigo.get(producto.codigo);

        const columna = document.createElement("div");
        columna.className = "col-12 col-md-6 col-lg-4";

        const articulo = document.createElement("article");
        articulo.className = "h-100";
        articulo.dataset.productCode = producto.codigo;

        // Imagen del producto
        const rutaImagen =
            oferta?.imagen ?? IMAGENES_CATALOGO[producto.codigo];

        if (rutaImagen) {
            const imagen = document.createElement("img");
            imagen.src = rutaImagen;
            imagen.alt = producto.nombre;
            articulo.append(imagen);
        }

        // Categoría
        const categoria = document.createElement("p");
        categoria.textContent = producto.categoria;

        // Nombre
        const titulo = document.createElement("h3");
        titulo.textContent = producto.nombre;

        // Descripción
        const descripcion = document.createElement("p");
        descripcion.textContent = producto.descripcion;

        // Precios
        const precios = document.createElement("p");

        if (oferta) {
            const precioAnterior = document.createElement("del");
            precioAnterior.textContent =
                FormateadorMoneda.formatear(oferta.precioAnterior);

            precios.append(
                precioAnterior,
                document.createTextNode(" ")
            );
        }

        const precioActual = document.createElement("strong");
        precioActual.textContent =
            FormateadorMoneda.formatear(producto.precio);

        precios.append(
            precioActual,
            document.createTextNode(" por unidad")
        );

        // Botón de compra
        const boton = document.createElement("button");
        boton.type = "button";
        boton.dataset.action = "agregar-carrito";
        boton.dataset.productCode = producto.codigo;
        boton.textContent = "Comprar";

        articulo.append(
            categoria,
            titulo,
            descripcion,
            precios,
            boton
        );

        columna.append(articulo);
        fragmento.append(columna);
    });

    elementos.resultados.replaceChildren(fragmento);
}


function buscarYMostrarCatalogo() {
    if (!catalogo) return;

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

    // Genera dinámicamente las tarjetas del catálogo.
    renderizarCatalogo(resultado.resultados);

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

 // Actualiza el estado visual y accesible de un campo
 // del formulario de pedido.
function actualizarValidacionCampoPedido(control) {
    if (elementos.seccionConfirmacion.hidden ||
        elementos.formPedido.hidden
    ) {
        return;
    }

    const resultado = validarCampoPedido(
        control.name,
        control.value
    );

    marcarControl(
        control,
        resultado.exito,
        resultado.error ?? ""
    );
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
    renderizarCuotas("");
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
            if (!(error instanceof TypeError ||
            error instanceof RangeError ||
            error instanceof ErrorPersistenciaPedido)) {
            throw error;
        }

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
    mostrarMensaje(elementos.pagoMensaje, "Pedido cancelado. Se conservaron el carrito y las condiciones de pago.", "info");
    elementos.seccionPago.scrollIntoView({ behavior: "smooth", block: "start" });
}

/**
 * Pide confirmación con ServicioDialogos y ejecuta la acción solo si el usuario acepta.
 * Mientras hay un diálogo abierto ignora nuevos pedidos, para que un doble clic
 * no ejecute la misma acción dos veces.
 * @param {object} opciones - Opciones de ServicioDialogos.confirmar().
 * @param {() => void} accion - Se ejecuta si el usuario confirma.
 * @returns {Promise<boolean>} true si la acción se ejecutó.
 */
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

/**
 * Punto de integración 1: confirma antes de quitar un producto del carrito.
 * @param {HTMLButtonElement} boton - Botón «Eliminar» del ítem.
 * @returns {Promise<void>}
 */
async function solicitarEliminacionCarrito(boton) {
    const codigo = boton.dataset.productCode;
    const eliminar = () => procesarOperacionCarrito(() => carrito.eliminar(codigo));
    const item = carrito.resumir().items.find((producto) => producto.codigo === codigo);

    // Si el ítem no está en el carrito, el modelo informa el error sin abrir el diálogo.
    if (!item) {
        eliminar();
        return;
    }

    const eliminado = await ejecutarConConfirmacion({
        titulo: `¿Eliminar ${item.nombre} del carrito?`,
        texto: `Tenés ${item.cantidad} unidad(es) en el carrito. Si lo eliminás, vas a tener que agregarlo de nuevo.`,
        textoConfirmar: "Eliminar",
        textoCancelar: "Cancelar",
        peligroso: true,
        origen: boton
    }, eliminar);

    // El botón que abrió el diálogo ya no existe: el foco queda en el panel del carrito.
    if (eliminado && elementos.panelCarrito.classList.contains("show")) {
        elementos.panelCarrito.focus();
    }
}

/**
 * Punto de integración 2: confirma la compra mostrando total financiado, método y cuotas.
 * Sin resumen pendiente no abre el diálogo: confirmarPedido() muestra el error (RC24).
 * @param {HTMLButtonElement} boton - Botón «Confirmar pedido» del resumen.
 * @returns {Promise<void>}
 */
async function solicitarConfirmacionPedido(boton) {
    if (!pedidoPendiente) {
        confirmarPedido();
        return;
    }

    const { pago } = pedidoPendiente.resumir();
    const metodo = ServicioOpcionesPago.obtenerMetodos()
        .find((opcion) => opcion.valor === pago.metodoPago)?.etiqueta ?? pago.metodoPago;

    await ejecutarConConfirmacion({
        titulo: "¿Confirmar la compra?",
        texto: [
            `Total financiado: ${FormateadorMoneda.formatear(pago.totalFinanciado)}`,
            `Método de pago: ${metodo}`,
            `Cuotas: ${pago.cuotas} de ${FormateadorMoneda.formatear(pago.valorCuota)}`,
            "Al confirmar se genera el número de pedido y se vacía el carrito."
        ].join("\n"),
        textoConfirmar: "Confirmar compra",
        textoCancelar: "Seguir revisando",
        origen: boton
    }, confirmarPedido);
}

/**
 * Punto de integración 3: confirma antes de descartar los datos del cliente.
 * Si el formulario está vacío y no hay resumen, no hay nada que perder y cancela sin preguntar.
 * @param {HTMLButtonElement} boton - Botón «Cancelar pedido».
 * @returns {Promise<void>}
 */
async function solicitarCancelacionPedido(boton) {
    const hayDatos = pedidoPendiente !== null ||
        Object.values(clienteDesdeFormulario()).some((valor) => valor.trim() !== "");

    if (!hayDatos) {
        cancelarPedido();
        return;
    }

    await ejecutarConConfirmacion({
        titulo: "¿Descartar los datos del pedido?",
        texto: "Se borran el nombre, el correo y la dirección cargados. El carrito y las condiciones de pago se conservan.",
        textoConfirmar: "Descartar datos",
        textoCancelar: "Seguir con el pedido",
        peligroso: true,
        origen: boton
    }, cancelarPedido);
}


/**
 * Renderiza dinámicamente las tarjetas de ofertas
 * utilizando los datos proporcionados por ServicioOfertas.
 * @returns {void}
 */
function renderizarOfertas() {
    const fragmento = document.createDocumentFragment();

    ofertasVigentes.forEach((oferta) => {
        const columna = document.createElement("div");
        columna.className = "col-12 col-md-6 col-lg-4";

        const articulo = document.createElement("article");
        articulo.className = "h-100";
        articulo.dataset.productCode = oferta.codigo;

        const imagen = document.createElement("img");
        imagen.src = oferta.imagen;
        imagen.alt = oferta.nombre;

        const titulo = document.createElement("h2");
        titulo.textContent = oferta.nombre;

        const descripcion = document.createElement("p");
        descripcion.textContent = oferta.descripcion;

        const precios = document.createElement("p");

        const precioAnterior = document.createElement("del");
        precioAnterior.textContent =
            FormateadorMoneda.formatear(oferta.precioAnterior);

        const precioActual = document.createElement("strong");
        precioActual.textContent =
            FormateadorMoneda.formatear(oferta.precioActual);

        precios.append(
            precioAnterior,
            document.createTextNode(" "),
            precioActual,
            document.createTextNode(" por unidad")
        );

        const boton = document.createElement("button");
        boton.type = "button";
        boton.dataset.action = "agregar-carrito";
        boton.dataset.productCode = oferta.codigo;
        boton.textContent = "Comprar";

        articulo.append(
            imagen,
            titulo,
            descripcion,
            precios,
            boton
        );

        columna.append(articulo);
        fragmento.append(columna);
    });

    elementos.ofertasProductos.replaceChildren(fragmento);
}


/**
 * Calcula las ofertas del catálogo recién cargado, de forma independiente.
 * `ServicioOfertas` exige que estén sus tres productos promocionados con un
 * precio válido; con un catálogo parcial (por ejemplo, un registro descartado)
 * lanza una excepción. En ese caso las ofertas se omiten (queda la lista vacía:
 * sin tarjetas de oferta ni precio anterior), el detalle va a `console.error`
 * y el catálogo principal se muestra igual.
 * @returns {void}
 */
function actualizarOfertasVigentes() {
    try {
        ofertasVigentes = ServicioOfertas.obtenerOfertas(catalogo);
    } catch (error) {
        console.error("No se pudieron calcular las ofertas; se omiten.", error);
        ofertasVigentes = [];
    }
}

/**
 * Renderiza dinámicamente la tabla de precios
 * utilizando los productos del catálogo.
 * @returns {void}
 */
function renderizarTablaPrecios() {
    const fragmento = document.createDocumentFragment();

    const productos = catalogo.obtenerProductos();

    productos.forEach((producto) => {
        const fila = document.createElement("tr");

        const nombre = document.createElement("td");
        nombre.textContent = producto.nombre;

        const categoria = document.createElement("td");
        categoria.textContent = producto.categoria;

        const precio = document.createElement("td");
        precio.textContent = FormateadorMoneda.formatear(
            producto.precio
        );

        fila.append(nombre, categoria, precio);
        fragmento.append(fila);
    });

    elementos.tablaPreciosCuerpo.replaceChildren(fragmento);
}


/**
 * Renderiza dinámicamente las categorías en el filtro
 * y en el menú desplegable de navegación.
 * @returns {void}
 */
function renderizarCategorias() {
    const categorias = ServicioCategorias.obtenerCategorias(catalogo);

    const fragmentoSelect = document.createDocumentFragment();
    const fragmentoMenu = document.createDocumentFragment();

    const opciones = ["", ...categorias];

    opciones.forEach((categoria) => {
        const etiqueta = categoria || "Todas las categorias";

        // Opción del filtro de categorías
        const opcion = document.createElement("option");
        opcion.value = categoria;
        opcion.textContent = etiqueta;

        fragmentoSelect.append(opcion);

        // Opción del menú desplegable
        const item = document.createElement("li");

        const enlace = document.createElement("a");
        enlace.className = "dropdown-item";
        enlace.href = "#catalogo";
        enlace.dataset.categoria = categoria;
        enlace.textContent = etiqueta;

        item.append(enlace);
        fragmentoMenu.append(item);
    });

    elementos.categoria.replaceChildren(fragmentoSelect);
    elementos.menuCategorias.replaceChildren(fragmentoMenu);
}


/**
 * Renderiza los métodos de pago disponibles.
 * @returns {void}
 */
function renderizarMetodosPago() {
    const metodos = ServicioOpcionesPago.obtenerMetodos();
    const fragmento = document.createDocumentFragment();

    const inicial = document.createElement("option");
    inicial.value = "";
    inicial.textContent = "Selecciona un metodo";
    fragmento.append(inicial);

    metodos.forEach((metodo) => {
        const opcion = document.createElement("option");
        opcion.value = metodo.valor;
        opcion.textContent = metodo.etiqueta;

        fragmento.append(opcion);
    });

    elementos.metodoPago.replaceChildren(fragmento);
}

/**
 * Renderiza las cuotas disponibles para el método elegido.
 * @param {string} metodo
 * @returns {void}
 */
function renderizarCuotas(metodo) {
    const cuotas = ServicioOpcionesPago.obtenerCuotas(metodo);
    const fragmento = document.createDocumentFragment();

    cuotas.forEach((cuota) => {
        const opcion = document.createElement("option");
        opcion.value = cuota.valor;
        opcion.textContent = cuota.etiqueta;

        fragmento.append(opcion);
    });

    elementos.cuotas.replaceChildren(fragmento);
    elementos.cuotas.disabled = !Pago.admiteCuotas(metodo);
}


// ---------------------------------------------------------------------------
// CARGA ASÍNCRONA DEL CATÁLOGO
// Se distinguen dos cosas: la DISPONIBILIDAD del catálogo (hay uno usable, venga
// de la red, de la caché o del catálogo local) y el ESTADO VISUAL del mensaje
// (loading, success o una advertencia de error si se usó un respaldo).
// ---------------------------------------------------------------------------

/**
 * Habilita o deshabilita los controles de búsqueda y filtros del catálogo.
 * @param {boolean} habilitar true para habilitarlos.
 * @returns {void}
 */
function habilitarControlesCatalogo(habilitar) {
    [elementos.busqueda, elementos.categoria, elementos.orden, elementos.activarPrecio]
        .forEach((control) => {
            control.disabled = !habilitar;
        });
    elementos.precio.disabled = !habilitar || !elementos.activarPrecio.checked;
    elementos.formBusqueda.querySelectorAll("button").forEach((boton) => {
        boton.disabled = !habilitar;
    });
}

/**
 * Registra en el DOM el estado de disponibilidad del catálogo.
 * @param {"cargando"|"disponible"} estado Disponibilidad actual.
 * @param {string} [origen] Origen de los datos ("red", "cache" o "local").
 * @returns {void}
 */
function marcarEstadoCatalogo(estado, origen = "") {
    elementos.seccionCatalogo.dataset.catalogo = estado;
    if (origen) {
        elementos.seccionCatalogo.dataset.origen = origen;
    } else {
        delete elementos.seccionCatalogo.dataset.origen;
    }
    elementos.resultados.setAttribute("aria-busy", String(estado === "cargando"));
}

/**
 * Elige el texto y el tipo del mensaje según cómo terminó la carga.
 * El detalle técnico del error no se muestra: ya quedó en `console.error`.
 * @param {import("./api/apiService.js").ResultadoCarga} resultado Resultado de la carga.
 * @returns {{texto: string, tipo: "success"|"error"}} Mensaje para el usuario.
 */
function describirCarga({ origen, error, descartados, resumen }) {
    if (origen === "red") {
        if (descartados.length > 0) {
            return {
                texto: `Se cargaron ${resumen.total} productos (${descartados.length} descartados por datos inválidos).`,
                tipo: "success"
            };
        }
        const categorias = Object.keys(resumen.porCategoria).length;
        return {
            texto: `${resumen.total} producto(s) cargado(s) en ${categorias} categoría(s). ` +
                `Precios de ${FormateadorMoneda.formatear(resumen.precioMinimo)} ` +
                `a ${FormateadorMoneda.formatear(resumen.precioMaximo)}.`,
            tipo: "success"
        };
    }

    const respaldo = origen === "cache"
        ? "Mostramos la última versión guardada."
        : "Mostramos el catálogo local.";
    const pasajero = error.tipo === "red" ||
        (error.tipo === "http" && error.estado >= 500 && error.estado < 600);
    let causa;
    if (pasajero) {
        causa = origen === "cache" ? "No pudimos actualizar el catálogo." : "No pudimos conectarnos.";
    } else if (error.tipo === "http") {
        causa = "No encontramos el catálogo.";
    } else if (error.tipo === "formato") {
        causa = "El catálogo recibido no es válido.";
    } else {
        causa = "El catálogo no tiene productos disponibles.";
    }
    return { texto: `${causa} ${respaldo}`, tipo: "error" };
}

/**
 * Carga el catálogo y actualiza la pantalla: loading, luego las tarjetas y el
 * mensaje de éxito o de advertencia. Si ya hay una carga en curso, devuelve esa
 * misma promesa (un solo pedido en vuelo). No rechaza.
 * @returns {Promise<void>} Se resuelve cuando la pantalla quedó actualizada.
 */
function cargarCatalogoEnPantalla() {
    if (cargaCatalogoEnCurso) return cargaCatalogoEnCurso;

    cargaCatalogoEnCurso = (async () => {
        const categoriaPrevia = elementos.categoria.value;

        marcarEstadoCatalogo("cargando");
        habilitarControlesCatalogo(false);
        elementos.reintentarCatalogo?.setAttribute("hidden", "");
        mostrarMensaje(elementos.catalogoMensaje, "Cargando catálogo…", "loading");

        try {
            const resultado = await cargarCatalogo({
                alReintentar: () => mostrarMensaje(
                    elementos.catalogoMensaje,
                    "No pudimos conectarnos. Reintentando…",
                    "loading"
                )
            });

            catalogo = resultado.catalogo;
            actualizarOfertasVigentes();
            renderizarCategorias();
            if ([...elementos.categoria.options].some((opcion) => opcion.value === categoriaPrevia)) {
                elementos.categoria.value = categoriaPrevia;
            }
            renderizarOfertas();
            renderizarTablaPrecios();
            habilitarControlesCatalogo(true);
            marcarEstadoCatalogo("disponible", resultado.origen);
            buscarYMostrarCatalogo();

            // El mensaje de la carga se muestra después de la búsqueda inicial,
            // que también escribe en el mismo elemento.
            const { texto, tipo } = describirCarga(resultado);
            mostrarMensaje(elementos.catalogoMensaje, texto, tipo);
            if (resultado.origen !== "red") {
                elementos.reintentarCatalogo?.removeAttribute("hidden");
            }
        } catch (error) {
            console.error("No se pudo mostrar el catálogo.", error);
            habilitarControlesCatalogo(Boolean(catalogo));
            marcarEstadoCatalogo(catalogo ? "disponible" : "cargando");
            mostrarMensaje(elementos.catalogoMensaje, "No pudimos mostrar el catálogo.", "error");
            elementos.reintentarCatalogo?.removeAttribute("hidden");
        } finally {
            cargaCatalogoEnCurso = null;
        }
    })();

    return cargaCatalogoEnCurso;
}

const URL_MAPA = "https://www.google.com/maps?q=-34.8211567,-58.3908095&z=17&output=embed";

/**
 * Reemplaza la fachada del mapa por el iframe de Google Maps.
 * Se ejecuta solo con el clic del usuario en «Ver mapa».
 */
function cargarMapa() {
    const contenedor = document.querySelector("#mapa-ubicacion");
    if (!contenedor) return;

    const iframe = document.createElement("iframe");
    iframe.src = URL_MAPA;
    iframe.title = "Mapa con la ubicacion de FerroLab";
    iframe.referrerPolicy = "no-referrer-when-downgrade";
    iframe.allowFullscreen = true;

    contenedor.replaceChildren(iframe);
    iframe.focus();
}

function inicializarEventos() {
    renderizarMetodosPago();
    renderizarCuotas("");
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

        if (!catalogo) return;

        const codigo = accion.dataset.productCode;

        procesarOperacionCarrito(
            () => carrito.agregar(catalogo, codigo, 1)
        );
    }

    elementos.seccionCatalogo.addEventListener("click", manejarAgregarCarrito);
    elementos.reintentarCatalogo?.addEventListener("click", cargarCatalogoEnPantalla);
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

        switch (accion.dataset.action) {
            case "eliminar-carrito":
                solicitarEliminacionCarrito(accion);
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
                solicitarCancelacionPedido(accion);
                break;

            case "confirmar-pedido":
                solicitarConfirmacionPedido(accion);
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
        renderizarCuotas(elementos.metodoPago.value);

        elementos.condicionesPago.replaceChildren();
        pagoActual = null;
        pedidoPendiente = null;
        elementos.seccionConfirmacion.hidden = true;
        elementos.resumenPedido.replaceChildren();

        if (elementos.metodoPago.value) {
            obtenerCondicionesPago();
        }
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
            
        actualizarValidacionCampoPedido(control);
    });

    // Valida el campo cuando el usuario lo abandona.
    elementos.formPedido.addEventListener("focusout", (evento) => {
        const control = evento.target.closest("input");

        if (!control) return;

        actualizarValidacionCampoPedido(control);
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
    
    // MAPA
    // El iframe de Google Maps se crea recién cuando el usuario lo pide,
    // para no cargar sus cookies de terceros al abrir la página.
    document
        .querySelector('[data-action="cargar-mapa"]')
        ?.addEventListener("click", cargarMapa, { once: true });
    // Arranca la carga asíncrona del catálogo una vez registrados los eventos.
    cargarCatalogoEnPantalla();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inicializarEventos, { once: true });
} else {
    inicializarEventos();
}
