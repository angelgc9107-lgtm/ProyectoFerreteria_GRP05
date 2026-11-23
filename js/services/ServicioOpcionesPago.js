
import { Pago } from "../models/Pago.js";

/**
 * Servicio que consulta las opciones aceptadas por Pago.
 */
const METODOS_CANDIDATOS = [
    { valor: "efectivo-transferencia", etiqueta: "Efectivo / transferencia" },
    { valor: "tarjeta", etiqueta: "Tarjeta de credito" }
];

export class ServicioOpcionesPago {

    /**
     * Obtiene los métodos de pago aceptados.
     * @returns {Array<object>}
     */
    static obtenerMetodos() {
        return METODOS_CANDIDATOS.filter((metodo) => {
            try {
                new Pago(100, metodo.valor, 1);
                return true;
            } catch (error) {
                if (error instanceof TypeError || error instanceof RangeError) {
                    return false;
                }
                throw error;
            }
        });
    }

    /**
     * Obtiene las cuotas aceptadas y sus recargos.
     * @param {string} metodo
     * @returns {Array<object>}
     */
    static obtenerCuotas(metodo) {
        if (!metodo) return [];

        const opciones = [];

        for (let cantidad = 1; cantidad <= 12; cantidad++) {
            try {
                const pago = new Pago(100, metodo, cantidad);
                const condiciones = pago.calcular();

                if (condiciones.cuotas !== cantidad) continue;

                opciones.push({
                    valor: String(cantidad),
                    etiqueta: `${cantidad} cuota${cantidad === 1 ? "" : "s"} (${condiciones.porcentajeRecargo}%)`
                });
            } catch (error) {
                if (!(error instanceof TypeError || error instanceof RangeError)) {
                    throw error;
                }
            }
        }

        return opciones;
    }
}
