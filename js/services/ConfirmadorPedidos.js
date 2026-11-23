
import { Pedido } from "../models/Pedido.js";

let siguienteSecuencia = 1;

/**
 * Confirma un pedido generando automáticamente
 * su fecha y secuencia.
 * @param {Pedido} pedido Pedido a confirmar.
 * @returns {string} Número del pedido confirmado.
 */
export function confirmarPedidoConNumeracion(pedido) {
    if (!(pedido instanceof Pedido)) {
        throw new TypeError("El pedido no es válido.");
    }

    const numero = pedido.confirmar(
        Date.now(),
        siguienteSecuencia
    );

    siguienteSecuencia += 1;

    return numero;
}
