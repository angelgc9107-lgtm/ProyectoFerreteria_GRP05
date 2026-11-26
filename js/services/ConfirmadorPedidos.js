import { Pedido } from "../models/Pedido.js";
import { FachadaStorage } from "./FachadaStorage.js";

export class ErrorPersistenciaPedido extends Error {}

/**
 * Confirma un pedido y persiste su numeración e historial.
 * @param {Pedido} pedido Pedido a confirmar.
 * @returns {string} Número del pedido confirmado.
 * @throws {ErrorPersistenciaPedido} Si falla la persistencia.
 */
export function confirmarPedidoConNumeracion(pedido) {
    if (!(pedido instanceof Pedido)) {
        throw new TypeError("El pedido no es válido.");
    }

    const secuencia = FachadaStorage.cargarSecuenciaPedidos() ?? 1;
    const historial = FachadaStorage.cargarPedidos();
    const fecha = Date.now();

    const copiaPedido = Pedido.fromJSON(pedido.toJSON());
    const numero = copiaPedido.confirmar(fecha, secuencia);

    if (!FachadaStorage.guardarSecuenciaPedidos(secuencia + 1)) {
        throw new ErrorPersistenciaPedido(
            "No se pudo guardar la secuencia del pedido."
        );
    }

    if (!FachadaStorage.guardarPedidos([...historial, copiaPedido])) {
        const restaurada =
            FachadaStorage.guardarSecuenciaPedidos(secuencia);

        throw new ErrorPersistenciaPedido(
            restaurada
                ? "No se pudo guardar el pedido."
                : "No se pudo guardar el pedido ni restaurar la secuencia."
        );
    }

    pedido.confirmar(fecha, secuencia);

    return numero;
}