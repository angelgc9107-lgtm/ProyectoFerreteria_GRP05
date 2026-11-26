

import { Catalogo } from "../models/Catalogo.js";
import { FachadaStorage } from "../services/FachadaStorage.js";
import { productosIniciales } from "../data/productosIniciales.js";
import {
    filtrarValidos,
    construirProductos,
    resumirCatalogo
} from "../services/ProcesadorCatalogo.js";

/** Dirección del catálogo (JSON estático propio, mismo origen que el sitio). */
export const URL_CATALOGO = new URL("../../api/productos.json", import.meta.url).href;

const TIEMPO_LIMITE_MS = 8000;
const REINTENTOS = 2;
const ESPERA_BASE_MS = 500;
const TIPOS_ERROR = ["red", "http", "formato", "datos"];

/**
 * Error propio del servicio. El `message` es técnico (para `console.error`);
 * el mensaje para el usuario lo elige `script.js` según `tipo` y `origen`.
 */
export class ErrorApi extends Error {
    /**
     * @param {"red"|"http"|"formato"|"datos"} tipo Categoría del error.
     * @param {string} message Texto técnico, no apto para mostrar al usuario.
     * @param {{estado?: number|null, causa?: unknown}} [detalle] Código HTTP y error original.
     * @throws {RangeError} Si el tipo no es uno de los permitidos.
     */
    constructor(tipo, message, { estado = null, causa } = {}) {
        if (!TIPOS_ERROR.includes(tipo)) {
            throw new RangeError(`Tipo de ErrorApi no válido: ${String(tipo)}.`);
        }
        super(message);
        this.name = "ErrorApi";
        /** @type {"red"|"http"|"formato"|"datos"} */
        this.tipo = tipo;
        /** @type {number|null} Código HTTP (solo en `http`). */
        this.estado = estado;
        /** @type {unknown} Error original, si lo hay. */
        this.causa = causa;
    }
}

/**
 * @typedef {Object} OpcionesApi
 * @property {number} [tiempoLimiteMs=8000] Tiempo máximo por intento.
 * @property {number} [reintentos=2] Cantidad de reintentos (3 intentos en total).
 * @property {number} [esperaBaseMs=500] Espera antes del 1.º reintento; se duplica en cada uno.
 * @property {function(string, RequestInit): Promise<Response>} [fetchFn] Reemplazable en pruebas.
 * @property {function(number): Promise<void>} [esperarFn] Reemplazable en pruebas.
 * @property {function(number, ErrorApi): void} [alReintentar] Se llama antes de cada reintento.
 * @property {string} [url] Dirección del catálogo (por defecto `URL_CATALOGO`).
 */

/**
 * @typedef {Object} ResultadoCarga
 * @property {Catalogo} catalogo Catálogo listo para usar.
 * @property {"red"|"cache"|"local"} origen De dónde salieron los datos.
 * @property {Array<{indice: number, motivo: string}>} descartados Registros inválidos descartados.
 * @property {{total: number, porCategoria: Object<string, number>, precioMinimo: number|null, precioMaximo: number|null}} resumen
 *           Resumen del catálogo.
 * @property {ErrorApi|null} error Error que obligó a usar un respaldo (null si `origen` es "red").
 */

/** @param {number} ms Milisegundos. @returns {Promise<void>} */
const esperar = (ms) => new Promise((resolver) => setTimeout(resolver, ms));

/**
 * Hace un único intento de pedido, con tiempo límite.
 * @param {string} url Dirección a pedir.
 * @param {number} tiempoLimiteMs Tiempo máximo del intento.
 * @param {function} fetchFn Función de `fetch`.
 * @returns {Promise<unknown>} JSON parseado.
 * @throws {ErrorApi} De tipo `red`, `http` o `formato`.
 */
async function pedirUnaVez(url, tiempoLimiteMs, fetchFn) {
    if (typeof fetchFn !== "function") {
        throw new ErrorApi("red", "fetch no está disponible en este entorno.");
    }

    const controlador = new AbortController();
    let agotado = false;
    const temporizador = setTimeout(() => {
        agotado = true;
        controlador.abort();
    }, tiempoLimiteMs);

    try {
        let respuesta;
        try {
            respuesta = await fetchFn(url, {
                signal: controlador.signal,
                headers: { Accept: "application/json" }
            });
        } catch (causa) {
            throw new ErrorApi(
                "red",
                agotado
                    ? `Tiempo de espera agotado (${tiempoLimiteMs} ms) al pedir ${url}.`
                    : `No se pudo conectar con ${url}.`,
                { causa }
            );
        }

        if (!respuesta.ok) {
            throw new ErrorApi(
                "http",
                `HTTP ${respuesta.status} al pedir ${url}.`,
                { estado: respuesta.status }
            );
        }

        try {
            return await respuesta.json();
        } catch (causa) {
            const cortado = agotado || causa?.name === "AbortError";
            throw new ErrorApi(
                cortado ? "red" : "formato",
                cortado
                    ? `Tiempo de espera agotado (${tiempoLimiteMs} ms) leyendo ${url}.`
                    : `La respuesta de ${url} no es un JSON válido.`,
                { causa }
            );
        }
    } finally {
        clearTimeout(temporizador);
    }
}

/**
 * Pide un JSON con tiempo límite y reintentos. Reintenta solo fallas que pueden
 * ser pasajeras (red, tiempo agotado y HTTP 5xx), con espera creciente.
 * @param {string} url Dirección a pedir.
 * @param {OpcionesApi} [opciones] Opciones (todas opcionales).
 * @returns {Promise<unknown>} El JSON ya parseado.
 * @throws {ErrorApi} De tipo `red`, `http` o `formato`, cuando se agotan los reintentos aplicables.
 */
export async function obtenerJson(url, opciones = {}) {
    const {
        tiempoLimiteMs = TIEMPO_LIMITE_MS,
        reintentos = REINTENTOS,
        esperaBaseMs = ESPERA_BASE_MS,
        fetchFn = globalThis.fetch?.bind(globalThis),
        esperarFn = esperar,
        alReintentar
    } = opciones;

    for (let intento = 0; ; intento += 1) {
        try {
            return await pedirUnaVez(url, tiempoLimiteMs, fetchFn);
        } catch (error) {
            const pasajero = error.tipo === "red" || (error.tipo === "http" && error.estado >= 500);
            if (!pasajero || intento >= reintentos) throw error;

            try {
                alReintentar?.(intento + 1, error);
            } catch (falloAviso) {
                console.error("[apiService] Falló la función alReintentar.", falloAviso);
            }
            await esperarFn(esperaBaseMs * 2 ** intento);
        }
    }
}

/**
 * Pide el catálogo y valida su estructura (`{ productos: [] }`).
 * No valida cada registro: eso lo hace `ProcesadorCatalogo`.
 * @param {OpcionesApi} [opciones] Opciones (todas opcionales).
 * @returns {Promise<{version: number, registros: object[]}>} Versión y registros recibidos.
 * @throws {ErrorApi} Los de `obtenerJson`, más `formato` si la estructura no es la esperada.
 */
export async function obtenerCatalogoRemoto(opciones = {}) {
    const datos = await obtenerJson(opciones.url ?? URL_CATALOGO, opciones);

    if (typeof datos !== "object" || datos === null || !Array.isArray(datos.productos)) {
        throw new ErrorApi("formato", "El catálogo no tiene la estructura { productos: [] }.");
    }
    return {
        version: Number.isFinite(datos.version) ? datos.version : 1,
        registros: datos.productos
    };
}

/**
 * Lee la caché del catálogo; ignora una caché ausente, dañada o vacía.
 * @returns {Catalogo|null} Catálogo guardado, o null si no hay uno usable.
 */
function leerCache() {
    try {
        const guardado = FachadaStorage.cargarCatalogo();
        return guardado && guardado.obtenerProductos().length > 0 ? guardado : null;
    } catch (error) {
        console.error("[apiService] No se pudo leer la caché del catálogo.", error);
        return null;
    }
}

/**
 * Arma el resultado de un catálogo ya construido.
 * @param {Catalogo} catalogo Catálogo listo.
 * @param {"red"|"cache"|"local"} origen Fuente de los datos.
 * @param {Array<{indice: number, motivo: string}>} descartados Registros descartados.
 * @param {ErrorApi|null} error Error que motivó el respaldo.
 * @returns {ResultadoCarga} Resultado de la carga.
 */
function armarResultado(catalogo, origen, descartados, error) {
    return {
        catalogo,
        origen,
        descartados,
        resumen: resumirCatalogo(catalogo.obtenerProductos()),
        error
    };
}

/**
 * Carga el catálogo: red → caché → catálogo local. Nunca rechaza: siempre
 * devuelve un catálogo usable. Si la red funciona, guarda la caché con los
 * registros válidos; si falla, informa el error en `resultado.error`.
 * @param {OpcionesApi} [opciones] Opciones (todas opcionales).
 * @returns {Promise<ResultadoCarga>} Catálogo y datos de su origen.
 */
export async function cargarCatalogo(opciones = {}) {
    let error;

    try {
        const { registros } = await obtenerCatalogoRemoto(opciones);
        const { validos, descartados } = filtrarValidos(registros);

        if (validos.length === 0) {
            throw new ErrorApi(
                "datos",
                registros.length === 0
                    ? "El catálogo recibido está vacío."
                    : "Ningún registro del catálogo recibido es válido."
            );
        }

        const catalogo = new Catalogo(construirProductos(validos));

        if (!FachadaStorage.guardarCatalogo(catalogo)) {
            console.error("[apiService] No se pudo guardar la caché del catálogo; se continúa sin caché.");
        }
        return armarResultado(catalogo, "red", descartados, null);
    } catch (causa) {
        error = causa instanceof ErrorApi
            ? causa
            : new ErrorApi("formato", `Error inesperado al procesar el catálogo: ${causa?.message}`, { causa });
    }

    console.error("[apiService] No se pudo cargar el catálogo remoto; se usa un respaldo.", error);

    const enCache = leerCache();
    if (enCache) return armarResultado(enCache, "cache", [], error);

    const { validos } = filtrarValidos(productosIniciales);
    return armarResultado(new Catalogo(construirProductos(validos)), "local", [], error);
}
