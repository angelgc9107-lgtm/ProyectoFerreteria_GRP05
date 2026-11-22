const RECARGOS = { 1: 0, 3: 10, 6: 20 };

export class Pago {
    #totalOriginal;
    #metodoPago;
    #cuotas;
    #porcentajeRecargo;

    /**
     * Valida las entradas para calcular condiciones de pago.
     * @param {number|string} total Total original sin redondear.
     * @param {"efectivo-transferencia"|"tarjeta"} metodoPago Método elegido.
     * @param {number|string} [cantidadCuotas] Cuotas para tarjeta.
     * @throws {TypeError|RangeError} Si las entradas o importes calculados son inválidos.
     */
    constructor(total, metodoPago, cantidadCuotas) {
        // Las cadenas solo admiten dígitos y un decimal simple: Number() aceptaría "0x10" o "1e2".
        if ((typeof total !== "number" && typeof total !== "string") ||
                (typeof total === "string" && !/^\s*\d+(\.\d+)?\s*$/.test(total))) {
            throw new TypeError("El total debe ser un numero.");
        }
        const monto = Number(total);
        if (!Number.isFinite(monto) || monto <= 0) throw new RangeError("El total debe ser finito y mayor que cero.");
        if (typeof metodoPago !== "string") throw new TypeError("El metodo de pago debe ser una cadena.");
        if (metodoPago !== "efectivo-transferencia" && metodoPago !== "tarjeta") {
            throw new RangeError("El metodo de pago no es valido.");
        }
        let cuotas = 1;
        if (metodoPago === "tarjeta") {
            if ((typeof cantidadCuotas !== "number" && typeof cantidadCuotas !== "string") ||
                    (typeof cantidadCuotas === "string" && !/^\s*\d+\s*$/.test(cantidadCuotas))) {
                throw new TypeError("Las cuotas deben ser un numero.");
            }
            cuotas = Number(cantidadCuotas);
            if (!Object.hasOwn(RECARGOS, cuotas)) throw new RangeError("La cantidad de cuotas no esta disponible.");
        }
        this.#totalOriginal = monto;
        this.#metodoPago = metodoPago;
        this.#cuotas = cuotas;
        this.#porcentajeRecargo = RECARGOS[cuotas];
        this.calcular();
    }

    /**
     * Calcula el interés sobre el total original ya redondeado a dos decimales.
     * Redondea también el interés, el total financiado y el valor de cuota.
     * @returns {{valido: boolean, error: null, metodoPago: string, cuotas: number, porcentajeRecargo: number, totalOriginal: number, interes: number, totalFinanciado: number, valorCuota: number}} Condiciones de pago.
     * @throws {RangeError} Si algún importe no es finito.
     */
    calcular() {
        const totalOriginal = Math.round(this.#totalOriginal * 100) / 100;
        const interes = Math.round(totalOriginal * this.#porcentajeRecargo) / 100;
        const totalFinanciado = Math.round((totalOriginal + interes) * 100) / 100;
        const valorCuota = Math.round((totalFinanciado / this.#cuotas) * 100) / 100;
        if (![totalOriginal, interes, totalFinanciado, valorCuota].every(Number.isFinite)) {
            throw new RangeError("Los importes calculados deben ser finitos.");
        }
        return {
            valido: true, error: null, metodoPago: this.#metodoPago, cuotas: this.#cuotas,
            porcentajeRecargo: this.#porcentajeRecargo, totalOriginal, interes, totalFinanciado, valorCuota
        };
    }

    /** @returns {{totalOriginal: number, metodoPago: string, cuotas: number}} Entradas serializables. */
    toJSON() {
        return { totalOriginal: this.#totalOriginal, metodoPago: this.#metodoPago, cuotas: this.#cuotas };
    }

    /**
     * Reconstruye el pago y vuelve a validar sus entradas.
     * @param {{totalOriginal: number, metodoPago: string, cuotas: number}} datos Datos serializados.
     * @returns {Pago} Pago reconstruido.
     * @throws {TypeError|RangeError} Si los datos son inválidos.
     */
    static fromJSON(datos) {
        if (!datos || typeof datos !== "object" || Array.isArray(datos) ||
                typeof datos.totalOriginal !== "number" || typeof datos.cuotas !== "number") {
            throw new TypeError("Los datos del pago son invalidos.");
        }
        if (datos.metodoPago === "efectivo-transferencia" && datos.cuotas !== 1) {
            throw new RangeError("El pago en efectivo o transferencia debe tener una cuota.");
        }
        return new Pago(datos.totalOriginal, datos.metodoPago, datos.cuotas);
    }
}

export default Pago;
