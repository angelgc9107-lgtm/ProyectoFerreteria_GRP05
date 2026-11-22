import { Carrito } from "./Carrito.js";
import { Pago } from "./Pago.js";

function validarCliente(cliente) {
    if (!cliente || typeof cliente !== "object" || Array.isArray(cliente)) {
        throw new TypeError("El cliente debe ser un objeto.");
    }
    const resultado = {};
    for (const campo of ["nombre", "correo", "direccion"]) {
        if (typeof cliente[campo] !== "string") {
            const error = new TypeError(`${campo} debe ser una cadena.`);
            error.campo = campo;
            throw error;
        }
        resultado[campo] = cliente[campo].trim();
        const invalido = campo === "nombre"
            ? !resultado[campo] || /^\d+(?:[.,]\d+)?$/.test(resultado[campo])
            : campo === "correo"
                ? !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resultado[campo])
                : !resultado[campo];
        if (invalido) {
            const error = new RangeError(`${campo} no es valido.`);
            error.campo = campo;
            throw error;
        }
    }
    return resultado;
}

function numeroValido(numero) {
    if (typeof numero !== "string") return false;
    const partes = /^FL-(\d+)-(\d{4,})$/.exec(numero);
    if (!partes) return false;
    const fecha = Number(partes[1]);
    const secuencia = Number(partes[2]);
    return Number.isSafeInteger(fecha) && fecha >= 0 &&
        Number.isSafeInteger(secuencia) && secuencia > 0 &&
        numero === `FL-${fecha}-${String(secuencia).padStart(4, "0")}`;
}

function importesIguales(actual, esperado) {
    if (!Number.isFinite(actual) || !Number.isFinite(esperado)) return false;
    if (actual === esperado) return true;
    const tolerancia = Math.min(1e-12, Number.EPSILON * Math.max(Math.abs(actual), Math.abs(esperado)));
    if (Math.abs(actual - esperado) > tolerancia) return false;
    // Exige un valor decimal de referencia, sin truncar dos importes de alta precisión.
    const normalizado = Number(esperado.toPrecision(15));
    return (actual === normalizado || esperado === normalizado) &&
        Number(actual.toPrecision(15)) === normalizado;
}

export class Pedido {
    #cliente;
    #productos;
    #total;
    #pago;
    #numero = null;

    /**
     * Crea una instantánea del carrito, el pago y los datos del cliente.
     * @param {Carrito} carrito Carrito no vacío.
     * @param {Pago} pago Pago correspondiente al total actual.
     * @param {{nombre: string, correo: string, direccion: string}} cliente Datos de contacto y envío.
     * @throws {TypeError|RangeError} Si los datos son inválidos; los errores de cliente indican `campo`.
     */
    constructor(carrito, pago, cliente) {
        if (!(carrito instanceof Carrito)) throw new TypeError("El carrito debe ser una instancia de Carrito.");
        if (!(pago instanceof Pago)) throw new TypeError("El pago debe ser una instancia de Pago.");
        const resumen = carrito.resumir();
        if (!resumen.items.length) throw new RangeError("El carrito no puede estar vacio.");
        const condiciones = pago.calcular();
        if (!importesIguales(condiciones.totalOriginal, Math.round(resumen.total * 100) / 100)) {
            throw new RangeError("El pago no corresponde al total del carrito.");
        }
        this.#cliente = validarCliente(cliente);
        this.#productos = resumen.items.map((item) => ({ ...item }));
        this.#total = resumen.total;
        this.#pago = { ...condiciones };
    }

    /** @returns {{valido: boolean, cliente: object, productos: object[], total: number, pago: object}} Copia del resumen. */
    resumir() {
        return {
            valido: true,
            cliente: { ...this.#cliente },
            productos: this.#productos.map((producto) => ({ ...producto })),
            total: this.#total,
            pago: { ...this.#pago }
        };
    }

    /**
     * Confirma una sola vez con la marca temporal y secuencia proporcionadas.
     * @param {number} fechaEnMilisegundos Marca temporal entera no negativa.
     * @param {number} secuencia Número entero positivo.
     * @returns {string} Número de pedido.
     * @throws {TypeError|RangeError} Si los parámetros son inválidos o ya se confirmó.
     */
    confirmar(fechaEnMilisegundos, secuencia) {
        if (this.#numero !== null) throw new RangeError("El pedido ya fue confirmado.");
        if (typeof fechaEnMilisegundos !== "number" || typeof secuencia !== "number") {
            throw new TypeError("La fecha y la secuencia deben ser numeros.");
        }
        if (!Number.isSafeInteger(fechaEnMilisegundos) || fechaEnMilisegundos < 0 ||
                !Number.isSafeInteger(secuencia) || secuencia < 1) {
            throw new RangeError("La fecha o la secuencia no son validas.");
        }
        this.#numero = `FL-${fechaEnMilisegundos}-${String(secuencia).padStart(4, "0")}`;
        return this.#numero;
    }

    /** @returns {{cliente: object, productos: object[], total: number, pago: object, numero: string|null}} Instantánea serializable. */
    toJSON() {
        const { cliente, productos, total, pago } = this.resumir();
        return { cliente, productos, total, pago, numero: this.#numero };
    }

    /**
     * Reconstruye y valida una instantánea sin usar el catálogo actual.
     * @param {{cliente: object, productos: object[], total: number, pago: object, numero: string|null}} datos Instantánea serializada.
     * @returns {Pedido} Pedido reconstruido.
     * @throws {TypeError|RangeError} Si faltan datos o los importes son inconsistentes.
     */
    static fromJSON(datos) {
        if (!datos || typeof datos !== "object" || Array.isArray(datos) ||
                !Array.isArray(datos.productos) || !datos.pago ||
                typeof datos.pago !== "object" || Array.isArray(datos.pago) ||
                typeof datos.total !== "number" || !Object.hasOwn(datos, "numero")) {
            throw new TypeError("Los datos del pedido son invalidos.");
        }
        if (datos.numero !== null && typeof datos.numero !== "string") {
            throw new TypeError("El numero del pedido debe ser una cadena o null.");
        }
        const carrito = new Carrito(datos.productos);
        const resumen = carrito.resumir();
        if (datos.productos.some((producto) => typeof producto.subtotal !== "number")) {
            throw new TypeError("Los subtotales deben ser numeros.");
        }
        if (!importesIguales(datos.total, resumen.total) || datos.productos.some((producto, indice) =>
            !importesIguales(producto.subtotal, resumen.items[indice].subtotal))) {
            throw new RangeError("Los importes del pedido son inconsistentes.");
        }
        const camposNumericos = ["cuotas", "porcentajeRecargo", "totalOriginal", "interes", "totalFinanciado", "valorCuota"];
        if (typeof datos.pago.valido !== "boolean" ||
                (datos.pago.error !== null && typeof datos.pago.error !== "string") ||
                typeof datos.pago.metodoPago !== "string" ||
                camposNumericos.some((campo) => typeof datos.pago[campo] !== "number")) {
            throw new TypeError("Los tipos de las condiciones de pago son invalidos.");
        }
        const pago = new Pago(resumen.total, datos.pago.metodoPago, datos.pago.cuotas);
        const condiciones = pago.calcular();
        const importesPago = ["totalOriginal", "interes", "totalFinanciado", "valorCuota"];
        if (Object.keys(condiciones).some((campo) => importesPago.includes(campo)
            ? !importesIguales(datos.pago[campo], condiciones[campo])
            : datos.pago[campo] !== condiciones[campo])) {
            throw new RangeError("Las condiciones de pago son inconsistentes.");
        }
        if (datos.numero !== null && !numeroValido(datos.numero)) {
            throw new RangeError("El numero del pedido no es valido.");
        }
        const pedido = new Pedido(carrito, pago, datos.cliente);
        pedido.#numero = datos.numero;
        return pedido;
    }
}

export default Pedido;
