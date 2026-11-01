var catalogoProductos = [
    {
        codigo: "GUANTES-001",
        nombre: "Guantes moteados multiuso maxima calidad",
        categoria: "Herramientas manuales",
        descripcion: "Proteccion multiuso para trabajos de ferreteria y mantenimiento.",
        precio: 4401
    },
    {
        codigo: "DESTORNILLADOR-001",
        nombre: "Destornillador punta plana Black Jack 8 x 200 mm",
        categoria: "Herramientas manuales",
        descripcion: "Destornillador con punta plana para tareas de ajuste y reparacion.",
        precio: 6026
    },
    {
        codigo: "PINZA-001",
        nombre: "Pinza punta curva mini 5 pulgadas ideal electronica",
        categoria: "Herramientas manuales",
        descripcion: "Pinza compacta para trabajos de precision en electronica.",
        precio: 6426
    },
    {
        codigo: "ENCHUFE-001",
        nombre: "Enchufe adaptador cubo 5 tomas 3 patas 10 amp",
        categoria: "Electricidad",
        descripcion: "Adaptador electrico con cinco tomas para conectar herramientas y equipos.",
        precio: 10282
    },
    {
        codigo: "MARTILLO-001",
        nombre: "Martillo galponero mango de fibra acero forjado Black Jack",
        categoria: "Herramientas manuales",
        descripcion: "Martillo robusto para tareas de obra, reparacion y mantenimiento.",
        precio: 16000
    },
    {
        codigo: "PALA-001",
        nombre: "Pala de punta chapa acero estampada cabo metalico",
        categoria: "Jardineria",
        descripcion: "Herramienta de punta para tareas de jardineria y movimiento de tierra.",
        precio: 21329
    },
    {
        codigo: "AMOLADORA-001",
        nombre: "Amoladora angular inalambrica DeWalt Flexvolt DCG416B",
        categoria: "Herramientas electricas",
        descripcion: "Amoladora inalambrica para cortar, desbastar y trabajar distintos materiales.",
        precio: 50000
    },
    {
        codigo: "KIT-TAPONES-001",
        nombre: "Kit juego tapones para cano de termofusion",
        categoria: "Accesorios",
        descripcion: "Juego de tapones y obturadores para instalaciones de agua.",
        precio: 55000
    },
    {
        codigo: "TALADRO-001",
        nombre: "Taladro atornillador inalambrico 10 mm 20 V",
        categoria: "Herramientas electricas",
        descripcion: "Atornillador inalambrico para perforar y ajustar en distintos proyectos.",
        precio: 79999
    }
];

var opcionesCuotas = {
    1: 0,
    3: 10,
    6: 20
};

var carritoActual = [];
var condicionesPagoActuales = null;
var secuenciaPedidos = 1;

/**
 * Normaliza texto para comparar búsquedas sin distinguir mayúsculas ni tildes.
 * @param {string} texto Texto que se desea normalizar.
 * @returns {string} Texto recortado, en minúsculas y sin diacríticos.
 */
function normalizarTexto(texto) {
    return String(texto || "")
        .trim()
        .toLocaleLowerCase("es")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

/**
 * Comprueba que el precio máximo ingresado sea un número mayor o igual a cero.
 * @param {string|number|null|undefined} valor Precio máximo ingresado.
 * @returns {{valido: boolean, valor: number|null, error?: string}} Resultado de la validación.
 */
function validarPrecioMaximo(valor) {
    if (valor === null || valor === undefined || String(valor).trim() === "") {
        return {
            valido: true,
            valor: null,
        };
    }

    var precioMaximo = Number(valor);
    if (!Number.isFinite(precioMaximo) || precioMaximo < 0) {
        return {
            valido: false,
            valor: null,
            error: "El precio maximo debe ser un numero mayor o igual a cero."
        };
    }

    return { valido: true, valor: precioMaximo };
}

/**
 * Filtra productos por texto, categoría y precio máximo y los ordena por precio ascendente.
 * @param {Array<Object>} productos Catálogo de productos a revisar.
 * @param {{texto?: string, categoria?: string, precioMaximo: string|number}} criterios Criterios de búsqueda.
 * @returns {{valido: boolean, error: string|null, resultados: Array<Object>}} Estado de búsqueda y productos coincidentes.
 */
function buscarProductos(productos, criterios) {
    var filtros = criterios || {};
    var precioValidado = validarPrecioMaximo(filtros.precioMaximo);
    if (!precioValidado.valido) {
        return {
            valido: false,
            error: precioValidado.error,
            resultados: []
        };
    }

    var texto = normalizarTexto(filtros.texto);
    var categoria = normalizarTexto(filtros.categoria);
    var resultados = [];

    for (var indice = 0; indice < productos.length; indice += 1) {
        var producto = productos[indice];
        var coincideTexto = !texto ||
            normalizarTexto(producto.nombre + " " + producto.descripcion).includes(texto);
        var coincideCategoria = !categoria ||
            normalizarTexto(producto.categoria) === categoria;
        var coincidePrecio = precioValidado.valor === null ||
            producto.precio <= precioValidado.valor;

        if (coincideTexto && coincideCategoria && coincidePrecio) {
            resultados.push(producto);
        }
    }

    resultados.sort(function (productoA, productoB) {
        return productoA.precio - productoB.precio;
    });

    return { valido: true, error: null, resultados: resultados };
}

/**
 * Verifica que una cantidad represente un entero positivo.
 * @param {string|number|null|undefined} cantidad Cantidad que se desea validar.
 * @returns {boolean} `true` si la cantidad es un entero mayor o igual a uno.
 */
function validarCantidad(cantidad) {
    if (cantidad === null || cantidad === undefined || String(cantidad).trim() === "") {
        return false;
    }

    var valor = Number(cantidad);
    return Number.isSafeInteger(valor) && valor >= 1;
}

/**
 * Agrega un producto al carrito o suma su cantidad si ya estaba incluido.
 * @param {Array<Object>} carrito Carrito actual, que no se modifica.
 * @param {Array<Object>} productos Catálogo donde se busca el producto.
 * @param {string} codigo Código del producto que se agregará.
 * @param {string|number} cantidad Cantidad que se agregará.
 * @returns {{exito: boolean, carrito: Array<Object>, error: string|null}} Resultado y carrito actualizado.
 */
function agregarProductoAlCarrito(carrito, productos, codigo, cantidad) {
    var producto = productos.find(function (item) {
        return item.codigo.toLocaleLowerCase("es") === String(codigo || "").trim().toLocaleLowerCase("es");
    });

    if (!producto) {
        return { exito: false, carrito: carrito, error: "El producto no existe en el catalogo." };
    }
    if (!validarCantidad(cantidad)) {
        return { exito: false, carrito: carrito, error: "La cantidad debe ser un entero mayor o igual a uno." };
    }

    var nuevaCantidad = Number(cantidad);
    var indiceExistente = carrito.findIndex(function (item) {
        return item.codigo === producto.codigo;
    });
    var nuevoCarrito = carrito.map(function (item) {
        return Object.assign({}, item);
    });

    if (indiceExistente >= 0) {
        var cantidadTotal = nuevoCarrito[indiceExistente].cantidad + nuevaCantidad;

        if (!Number.isSafeInteger(cantidadTotal)) {
            return {
                exito: false,
                carrito: carrito,
            error: "La cantidad total supera el limite permitido."
        };
    }

    nuevoCarrito[indiceExistente].cantidad = cantidadTotal;
} else {
    nuevoCarrito.push({
        codigo: producto.codigo,
        nombre: producto.nombre,
        categoria: producto.categoria,
        precio: producto.precio,
        cantidad: nuevaCantidad
    });
}

    return { exito: true, carrito: nuevoCarrito, error: null };
}

/**
 * Reemplaza la cantidad de un producto que ya está en el carrito.
 * @param {Array<Object>} carrito Carrito actual, que no se modifica.
 * @param {string} codigo Código del producto por actualizar.
 * @param {string|number} nuevaCantidad Cantidad que se establecerá.
 * @returns {{exito: boolean, carrito: Array<Object>, error: string|null}} Resultado y carrito actualizado.
 */
function cambiarCantidadCarrito(carrito, codigo, nuevaCantidad) {
    if (!validarCantidad(nuevaCantidad)) {
        return { exito: false, carrito: carrito, error: "La cantidad debe ser un entero mayor o igual a uno." };
    }

    var encontrado = carrito.some(function (item) {
        return item.codigo.toLocaleLowerCase("es") === String(codigo || "").trim().toLocaleLowerCase("es");
    });
    if (!encontrado) {
        return { exito: false, carrito: carrito, error: "El producto no esta en el carrito." };
    }

    var nuevoCarrito = carrito.map(function (item) {
        var copia = Object.assign({}, item);
        if (copia.codigo.toLocaleLowerCase("es") === String(codigo).trim().toLocaleLowerCase("es")) {
            copia.cantidad = Number(nuevaCantidad);
        }
        return copia;
    });

    return { exito: true, carrito: nuevoCarrito, error: null };
}

/**
 * Quita del carrito el producto identificado por su código.
 * @param {Array<Object>} carrito Carrito actual, que no se modifica.
 * @param {string} codigo Código del producto que se eliminará.
 * @returns {{exito: boolean, carrito: Array<Object>, error: string|null}} Resultado y carrito actualizado.
 */
function eliminarProductoDelCarrito(carrito, codigo) {
    var nuevoCarrito = carrito.filter(function (item) {
        return item.codigo.toLocaleLowerCase("es") !== String(codigo || "").trim().toLocaleLowerCase("es");
    });

    if (nuevoCarrito.length === carrito.length) {
        return { exito: false, carrito: carrito, error: "El producto no esta en el carrito." };
    }
    return { exito: true, carrito: nuevoCarrito, error: null };
}

/**
 * Calcula el subtotal de cada producto y el total general del carrito.
 * @param {Array<Object>} carrito Productos y cantidades que se resumirán.
 * @returns {{items: Array<Object>, total: number, cantidadItems: number}} Ítems con subtotal y total acumulado.
 */
function calcularResumenCarrito(carrito) {
    var total = 0;
    var items = carrito.map(function (item) {
        var subtotal = item.precio * item.cantidad;
        total += subtotal;
        return Object.assign({}, item, { subtotal: subtotal });
    });

    return { items: items, total: total, cantidadItems: items.length };
}

/**
 * Calcula interés, total financiado y valor de cuota según el método de pago.
 * @param {number} total Total original de la compra.
 * @param {"efectivo-transferencia"|"tarjeta"} metodoPago Método elegido.
 * @param {number} [cantidadCuotas] Cuotas disponibles para tarjeta; no aplica a efectivo o transferencia.
 * @returns {{valido: boolean, error?: string, metodoPago?: string, cuotas?: number, porcentajeRecargo?: number, totalOriginal?: number, interes?: number, totalFinanciado?: number, valorCuota?: number}} Condiciones calculadas o error de validación.
 */
function calcularCondicionesPago(total, metodoPago, cantidadCuotas) {
    if (!Number.isFinite(Number(total)) || Number(total) <= 0) {
        return { valido: false, error: "El total debe ser mayor que cero." };
    }

    var cuotas;
    var recargo;
    if (metodoPago === "efectivo-transferencia") {
        cuotas = 1;
        recargo = 0;
    } else if (metodoPago === "tarjeta") {
        cuotas = Number(cantidadCuotas);
        if (!Object.prototype.hasOwnProperty.call(opcionesCuotas, cuotas)) {
            return { valido: false, error: "La cantidad de cuotas no esta disponible." };
        }
        recargo = opcionesCuotas[cuotas];
    } else {
        return { valido: false, error: "El metodo de pago no es valido." };
    }

    var totalOriginal = Math.round(Number(total) * 100) / 100;
    var interes = Math.round(totalOriginal * recargo) / 100;
    var totalFinanciado = Math.round((totalOriginal + interes) * 100) / 100;

    return {
        valido: true,
        error: null,
        metodoPago: metodoPago,
        cuotas: cuotas,
        porcentajeRecargo: recargo,
        totalOriginal: totalOriginal,
        interes: interes,
        totalFinanciado: totalFinanciado,
        valorCuota: Math.round((totalFinanciado / cuotas) * 100) / 100
    };
}

/**
 * Valida que el nombre no esté vacío ni esté compuesto solo por un número.
 * @param {string} nombre Nombre ingresado por el cliente.
 * @returns {boolean} `true` si el nombre cumple la validación.
 */
function validarNombre(nombre) {
    var valor = String(nombre || "").trim();
    return valor !== "" && !/^\d+(?:[.,]\d+)?$/.test(valor);
}

/**
 * Comprueba que el correo tenga usuario, arroba y dominio.
 * @param {string} correo Correo electrónico ingresado.
 * @returns {boolean} `true` si el correo tiene un formato válido.
 */
function validarCorreo(correo) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(correo || "").trim());
}

/**
 * Comprueba que la dirección de envío no esté vacía.
 * @param {string} direccion Dirección ingresada por el cliente.
 * @returns {boolean} `true` si la dirección contiene texto.
 */
function validarDireccion(direccion) {
    return String(direccion || "").trim() !== "";
}

/**
 * Valida conjuntamente los datos de contacto y envío del cliente.
 * @param {{nombre: string, correo: string, direccion: string}} cliente Datos del cliente.
 * @returns {boolean} `true` si nombre, correo y dirección son válidos.
 */
function validarDatosCliente(cliente) {
    return Boolean(
        cliente &&
        validarNombre(cliente.nombre) &&
        validarCorreo(cliente.correo) &&
        validarDireccion(cliente.direccion)
    );
}

/**
 * Construye un resumen de pedido si hay productos, condiciones de pago y cliente válidos.
 * @param {Array<Object>} carrito Productos y cantidades del pedido.
 * @param {Object} condicionesPago Condiciones válidas generadas por `calcularCondicionesPago`.
 * @param {{nombre: string, correo: string, direccion: string}} cliente Datos validados del cliente.
 * @returns {{valido: boolean, error?: string, cliente?: Object, productos?: Array<Object>, total?: number, pago?: Object}} Resumen del pedido o descripción del error.
 */
function crearResumenPedido(carrito, condicionesPago, cliente) {
    if (!carrito.length || !condicionesPago || !condicionesPago.valido ||
        !validarDatosCliente(cliente)) {
        return { valido: false, error: "Faltan productos, pago o datos del cliente validos." };
    }

    var resumenCarrito = calcularResumenCarrito(carrito);
    return {
        valido: true,
        cliente: {
            nombre: cliente.nombre.trim(),
            correo: cliente.correo.trim(),
            direccion: cliente.direccion.trim()
        },
        productos: resumenCarrito.items,
        total: resumenCarrito.total,
        pago: Object.assign({}, condicionesPago)
    };
}

/**
 * Genera un identificador de pedido a partir del momento y la secuencia.
 * @param {number} fechaEnMilisegundos Marca temporal del pedido.
 * @param {number} secuencia Número secuencial del pedido.
 * @returns {string} Identificador con formato `FL-tiempo-secuencia`.
 */
function crearNumeroPedido(fechaEnMilisegundos, secuencia) {
    return "FL-" + fechaEnMilisegundos + "-" + String(secuencia).padStart(4, "0");
}

/**
 * Formatea un importe como moneda argentina.
 * @param {number} importe Importe que se mostrará.
 * @returns {string} Importe con símbolo monetario y dos decimales.
 */
function formatearMoneda(importe) {
    return "$" + Number(importe).toLocaleString("es-AR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

/**
 * Convierte el contenido y total del carrito en texto legible.
 * @param {{items: Array<Object>, total: number}} resumen Resumen calculado del carrito.
 * @returns {string} Líneas de productos y total, o aviso si está vacío.
 */
function formatearResumenCarrito(resumen) {
    if (!resumen.items.length) {
        return "El carrito esta vacio.";
    }

    var lineas = resumen.items.map(function (item) {
        return item.nombre + " | " + item.cantidad + " x " +
            formatearMoneda(item.precio) + " = " + formatearMoneda(item.subtotal);
    });
    lineas.push("Total: " + formatearMoneda(resumen.total));
    return lineas.join("\n");
}

/**
 * Convierte productos, cliente y condiciones de pago en el texto del pedido.
 * @param {{productos: Array<Object>, pago: Object, cliente: Object}} resumen Resumen validado del pedido.
 * @returns {string} Detalle textual de productos, importes, pago y envío.
 */
function formatearResumenPedido(resumen) {
    var lineas = resumen.productos.map(function (item) {
        return item.nombre + " | " + item.cantidad + " x " +
            formatearMoneda(item.precio) + " = " + formatearMoneda(item.subtotal);
    });
    lineas.push("Total original: " + formatearMoneda(resumen.pago.totalOriginal));
    lineas.push("Metodo: " + (resumen.pago.metodoPago === "tarjeta" ? "Tarjeta de credito" : "Efectivo / transferencia"));
    lineas.push("Cuotas: " + resumen.pago.cuotas);
    lineas.push("Recargo: " + resumen.pago.porcentajeRecargo + "% (" + formatearMoneda(resumen.pago.interes) + ")");
    lineas.push("Total financiado: " + formatearMoneda(resumen.pago.totalFinanciado));
    lineas.push("Valor de cada cuota: " + formatearMoneda(resumen.pago.valorCuota));
    lineas.push("Envio a: " + resumen.cliente.direccion);
    return lineas.join("\n");
}

/**
 * Solicita un dato hasta que sea válido o el usuario cancele.
 * @param {string} mensaje Texto de la solicitud.
 * @param {(respuesta: string) => boolean} validador Función que determina si la respuesta es válida.
 * @param {string} mensajeError Aviso que se muestra cuando falla la validación.
 * @returns {string|null} Respuesta recortada o `null` si se cancela.
 */
function solicitarDatoValido(mensaje, validador, mensajeError) {
    while (true) {
        var respuesta = prompt(mensaje);
        if (respuesta === null) {
            return null;
        }
        if (validador(respuesta)) {
            return respuesta.trim();
        }
        alert(mensajeError);
    }
}

/**
 * Solicita una respuesta afirmativa o negativa, aceptando también su forma abreviada.
 * @param {string} mensaje Texto de la pregunta.
 * @returns {boolean|null} `true` para sí, `false` para no o `null` si se cancela.
 */
function preguntarSiNo(mensaje) {
    while (true) {
        var respuesta = prompt(mensaje);
        if (respuesta === null) {
            return null;
        }
        var opcion = normalizarTexto(respuesta);
        if (opcion === "si" || opcion === "s") {
            return true;
        }
        if (opcion === "no" || opcion === "n") {
            return false;
        }
        alert("Ingresa SI o NO. Cancela el cuadro para volver al menu.");
    }
}

/**
 * Ejecuta el flujo interactivo de búsqueda, filtrado y repetición de consultas.
 * @returns {void}
 */
function ejecutarBusquedaYFiltrado() {
    var repetir = true;
    while (repetir) {
        var texto = prompt("Texto de busqueda (vacio para omitir):");
        if (texto === null) {
            return;
        }
        var categoria = prompt("Categoria (vacia para omitir):");
        if (categoria === null) {
            return;
        }
        var precioMaximo = prompt("Precio maximo (vacio para omitir, o numero mayor o igual a cero):");
        if (precioMaximo === null) {
            return;
        }

        var resultado = buscarProductos(catalogoProductos, {
            texto: texto,
            categoria: categoria,
            precioMaximo: precioMaximo
        });

        if (!resultado.valido) {
            alert(resultado.error);
        } else if (!resultado.resultados.length) {
            alert("Sin coincidencias.");
        } else {
            console.log("Productos encontrados:", resultado.resultados);
            alert("Resultados ordenados por precio:\n" + resultado.resultados.map(function (producto) {
                return producto.nombre + " — " + formatearMoneda(producto.precio);
            }).join("\n"));
        }

        repetir = preguntarSiNo("¿Filtrar de nuevo? (SI / NO)") === true;
    }
}

/**
 * Muestra el contenido actual del carrito y su total.
 * @returns {void}
 */
function mostrarCarrito() {
    var resumen = calcularResumenCarrito(carritoActual);
    var mensaje = formatearResumenCarrito(resumen);
    console.log("Carrito:", resumen);
    alert(mensaje);
}

/**
 * Aplica al estado compartido un resultado de operación del carrito e invalida el pago anterior.
 * @param {{exito: boolean, carrito: Array<Object>, error: string|null}} resultado Resultado de una operación del carrito.
 * @returns {void}
 */
function actualizarCarrito(resultado) {
    if (resultado.exito) {
        var totalAnterior = calcularResumenCarrito(carritoActual).total;
        var totalNuevo = calcularResumenCarrito(resultado.carrito).total;

        carritoActual = resultado.carrito;

        if (totalAnterior !== totalNuevo) {
            condicionesPagoActuales = null;
            alert("Carrito actualizado. Debes seleccionar nuevamente el metodo de pago y las cuotas.");
        } else {
            alert("Carrito actualizado.");
        }
    } else {
        alert(resultado.error);
    }
}

/**
 * Ejecuta el menú interactivo para agregar, actualizar, eliminar o consultar productos.
 * @returns {void}
 */
function ejecutarGestionCarrito() {
    var salir = false;
    while (!salir) {
        var opcion = prompt(
            "GESTIONAR CARRITO\n1. Agregar\n2. Cambiar cantidad\n3. Eliminar\n4. Ver\n0. Volver al menu"
        );
        if (opcion === null || opcion.trim() === "0") {
            salir = true;
        } else if (opcion.trim() === "1") {
            var codigosDisponibles = catalogoProductos.map(function (producto) {
                return producto.codigo + " - " + producto.nombre;
            }).join("\n");
            var codigoNuevo = prompt("Codigo de producto:\n" + codigosDisponibles);
            if (codigoNuevo === null) {
                continue;
            }
            var cantidadNueva = prompt("Cantidad (entero mayor o igual a 1):");
            if (cantidadNueva === null) {
                continue;
            }
            actualizarCarrito(agregarProductoAlCarrito(
                carritoActual,
                catalogoProductos,
                codigoNuevo,
                cantidadNueva
            ));
        } else if (opcion.trim() === "2") {
            var codigoActualizar = prompt("Codigo del producto en el carrito:");
            if (codigoActualizar === null) {
                continue;
            }
            var cantidadActualizar = prompt("Nueva cantidad (entero mayor o igual a 1):");
            if (cantidadActualizar === null) {
                continue;
            }
            actualizarCarrito(cambiarCantidadCarrito(
                carritoActual,
                codigoActualizar,
                cantidadActualizar
            ));
        } else if (opcion.trim() === "3") {
            var codigoEliminar = prompt("Codigo del producto a eliminar:");
            if (codigoEliminar === null) {
                continue;
            }
            actualizarCarrito(eliminarProductoDelCarrito(carritoActual, codigoEliminar));
        } else if (opcion.trim() !== "4") {
            alert("Opcion invalida.");
        }

        mostrarCarrito();
    }
}

/**
 * Ejecuta la selección de método de pago y, si corresponde, de cuotas.
 * @returns {void}
 */
function ejecutarPago() {
    condicionesPagoActuales = null;
    var resumen = calcularResumenCarrito(carritoActual);
    if (!resumen.items.length) {
        alert("No hay productos para pagar.");
        return;
    }

    var metodoPago;
    while (!metodoPago) {
        var opcionMetodo = prompt("Metodo de pago:\n1. Efectivo / transferencia\n2. Tarjeta de credito");
        if (opcionMetodo === null) {
            return;
        }
        if (opcionMetodo.trim() === "1") {
            metodoPago = "efectivo-transferencia";
        } else if (opcionMetodo.trim() === "2") {
            metodoPago = "tarjeta";
        } else {
            alert("Opcion de pago invalida.");
        }
    }

var cuotas = 1;

if (metodoPago === "tarjeta") {
    while (true) {
        var entradaCuotas = prompt("Cuotas disponibles: 1 (0%), 3 (10%), 6 (20%).");

        if (entradaCuotas === null) {
            return;
        }

        var opcionCuotas = entradaCuotas.trim();

        if (Object.prototype.hasOwnProperty.call(opcionesCuotas, opcionCuotas)) {
            cuotas = Number(opcionCuotas);
            break;
        }

        alert("Selecciona 1, 3 o 6 cuotas.");
    }
}

    var condiciones = calcularCondicionesPago(resumen.total, metodoPago, cuotas);
    if (!condiciones.valido) {
        alert(condiciones.error);
        return;
    }

    alert(
        "Condiciones de pago\n" +
        "Total original: " + formatearMoneda(condiciones.totalOriginal) + "\n" +
        "Cuotas: " + condiciones.cuotas + "\n" +
        "Interes: " + formatearMoneda(condiciones.interes) + "\n" +
        "Total financiado: " + formatearMoneda(condiciones.totalFinanciado) + "\n" +
        "Valor de cada cuota: " + formatearMoneda(condiciones.valorCuota)
    );
    condicionesPagoActuales = condiciones;
}

/**
 * Solicita los datos del cliente, muestra el resumen y procesa la confirmación del pedido.
 * @returns {void}
 */
function ejecutarConfirmacionPedido() {
    if (!carritoActual.length || !condicionesPagoActuales) {
        alert("Falta completar el carrito o elegir un metodo de pago.");
        return;
    }

    var nombre = solicitarDatoValido(
        "Nombre y apellido:",
        validarNombre,
        "El nombre no puede estar vacio ni ser unicamente numerico."
    );
    if (nombre === null) {
        return;
    }

    var correo = solicitarDatoValido(
        "Correo electronico:",
        validarCorreo,
        "Ingresa un correo valido con usuario y dominio."
    );
    if (correo === null) {
        return;
    }

    var direccion = solicitarDatoValido(
        "Direccion de envio:",
        validarDireccion,
        "La direccion no puede estar vacia."
    );
    if (direccion === null) {
        return;
    }

    var resumen = crearResumenPedido(carritoActual, condicionesPagoActuales, {
        nombre: nombre,
        correo: correo,
        direccion: direccion
    });
    if (!resumen.valido) {
        alert(resumen.error);
        return;
    }

    alert(
        "Resumen del pedido para " + resumen.cliente.nombre + "\n" +
        formatearResumenPedido(resumen) +
        "\nCorreo: " + resumen.cliente.correo
    );

    var confirmar = preguntarSiNo("¿Confirmas el pedido? (SI / NO)");
    if (confirmar === null || !confirmar) {
        alert("Pedido cancelado. Se conservaron el carrito y las condiciones de pago.");
        return;
    }

    var numeroPedido = crearNumeroPedido(Date.now(), secuenciaPedidos);
    secuenciaPedidos += 1;
    alert(
        "Pedido confirmado: " + numeroPedido + "\n" +
        formatearResumenPedido(resumen)
    );
    carritoActual = [];
    condicionesPagoActuales = null;
}

/**
 * Presenta el menú principal y despacha los cuatro flujos hasta que el usuario salga.
 * @returns {void}
 */
function iniciarMenuPrincipal() {
    var salir = false;
    while (!salir) {
        var opcion = prompt(
            "FERROLAB — MENU PRINCIPAL\n\n" +
            "1. Buscar y filtrar productos\n" +
            "2. Gestionar carrito\n" +
            "3. Pagar y calcular cuotas\n" +
            "4. Confirmar pedido\n" +
            "0. Salir"
        );

        if (opcion === null || opcion.trim() === "0") {
            salir = true;
        } else if (opcion.trim() === "1") {
            ejecutarBusquedaYFiltrado();
        } else if (opcion.trim() === "2") {
            ejecutarGestionCarrito();
        } else if (opcion.trim() === "3") {
            ejecutarPago();
        } else if (opcion.trim() === "4") {
            ejecutarConfirmacionPedido();
        } else {
            alert("Opcion invalida.");
        }
    }
}

if (typeof module !== "undefined" && module.exports) {
    module.exports = {
        catalogoProductos: catalogoProductos,
        opcionesCuotas: opcionesCuotas,
        normalizarTexto: normalizarTexto,
        validarPrecioMaximo: validarPrecioMaximo,
        buscarProductos: buscarProductos,
        validarCantidad: validarCantidad,
        agregarProductoAlCarrito: agregarProductoAlCarrito,
        cambiarCantidadCarrito: cambiarCantidadCarrito,
        eliminarProductoDelCarrito: eliminarProductoDelCarrito,
        calcularResumenCarrito: calcularResumenCarrito,
        calcularCondicionesPago: calcularCondicionesPago,
        validarNombre: validarNombre,
        validarCorreo: validarCorreo,
        validarDireccion: validarDireccion,
        validarDatosCliente: validarDatosCliente,
        crearResumenPedido: crearResumenPedido,
        crearNumeroPedido: crearNumeroPedido,
        iniciarMenuPrincipal: iniciarMenuPrincipal
    };
}
