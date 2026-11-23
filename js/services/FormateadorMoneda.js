
/**
 * Servicio encargado de formatear importes monetarios
 * para su presentación en la interfaz.
 */
export class FormateadorMoneda {
    static #formateador = new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    /**
     * Formatea un importe numérico en pesos argentinos.
     * @param {number} importe Importe a formatear.
     * @returns {string} Importe formateado en ARS.
     */
    static formatear(importe) {
        return this.#formateador.format(importe);
    }
}
