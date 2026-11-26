import { Carrito } from "../models/Carrito.js";
import { Pago } from "../models/Pago.js";
import { Pedido } from "../models/Pedido.js";

const CLIENTE_REFERENCIA = Object.freeze({
    nombre: "Cliente de referencia",
    correo: "cliente@example.com",
    direccion: "Direccion de referencia"
});

/**
 * Valida individualmente un campo del cliente utilizando
 * las reglas existentes de la clase Pedido.
 * No modifica el estado de la compra real.
 *
 * @param {string} campo Nombre del campo a validar.
 * @param {string} valor Valor ingresado por el usuario.
 * @returns {{exito: boolean, error: string|null}}
 */
export function validarCampoPedido(campo, valor) {
    if (!Object.hasOwn(CLIENTE_REFERENCIA, campo)) {
        throw new RangeError("Campo de cliente desconocido.");
    }

    const carritoTemporal = new Carrito([{
        codigo: "VALIDACION-001",
        nombre: "Producto de referencia",
        categoria: "Validacion",
        precio: 1,
        cantidad: 1
    }]);

    const pagoTemporal = new Pago(
        carritoTemporal.resumir().total,
        "efectivo-transferencia"
    );

    const cliente = {
        ...CLIENTE_REFERENCIA,
        [campo]: valor
    };

    try {
        new Pedido(carritoTemporal, pagoTemporal, cliente);

        return { exito: true, error: null };

    } catch (error) {
        if (
            (error instanceof TypeError ||
                error instanceof RangeError) &&
            error.campo === campo
        ) {
            return {
                exito: false,
                error: error.message
            };
        }

        throw error;
    }
}