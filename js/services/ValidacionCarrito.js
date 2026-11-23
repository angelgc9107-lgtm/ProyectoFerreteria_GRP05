
import { Carrito } from "../models/Carrito.js";

/**
 * Valida un cambio de cantidad sin modificar el carrito original.
 * @param {Carrito} carrito Carrito actual.
 * @param {string} codigo Código del producto.
 * @param {number|string} cantidad Cantidad ingresada.
 * @returns {{exito: boolean, error: string|null}}
 */
export function validarCambioCantidad(carrito, codigo, cantidad) {
    const carritoTemporal = Carrito.fromJSON(carrito.toJSON());

    return carritoTemporal.cambiarCantidad(codigo, cantidad);
}
