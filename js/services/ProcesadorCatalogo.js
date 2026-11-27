/**
 * @file Procesamiento de los datos del catálogo recibidos de la API.
 *
 * Son funciones puras: no tocan el DOM, no hacen peticiones y no usan Storage.
 * Aplican funciones de orden superior (`map`, `filter` y `reduce`) para validar,
 * construir y resumir la colección. Ninguna lanza excepciones por datos inválidos:
 * los registros dañados se devuelven en `descartados` con su motivo.
 */

import { Producto, normalizarCodigo } from "../models/Producto.js";

/** Campos de texto obligatorios de un producto. */
const CAMPOS_TEXTO = ["codigo", "nombre", "categoria", "descripcion"];

/**
 * @typedef {Object} RegistroDescartado
 * @property {number} indice Posición del registro en la colección recibida.
 * @property {string} motivo Motivo por el que se descartó.
 */

/**
 * Indica si un valor es un objeto simple (no nulo y no arreglo).
 * @param {unknown} valor Valor a revisar.
 * @returns {boolean} true si es un objeto simple.
 */
function esObjeto(valor) {
    return typeof valor === "object" && valor !== null && !Array.isArray(valor);
}

/**
 * Revisa un registro por sí solo, sin mirar a los demás.
 * @param {unknown} registro Registro recibido de la API.
 * @returns {string|null} Motivo del descarte, o null si el registro es válido.
 */
function motivoDeDescarte(registro) {
    if (!esObjeto(registro)) return "el registro no es un objeto";

    const campoInvalido = CAMPOS_TEXTO.find((campo) => typeof registro[campo] !== "string");
    if (campoInvalido) return `campo inválido: ${campoInvalido}`;

    const campoVacio = CAMPOS_TEXTO.find((campo) => !registro[campo].trim());
    if (campoVacio) return `campo vacío: ${campoVacio}`;

    if (typeof registro.precio !== "number" ||
        !Number.isFinite(registro.precio) ||
        registro.precio < 0) {
        return "precio inválido";
    }

    // Última defensa: si el modelo cambia sus reglas, el registro no pasa.
    try {
        new Producto(registro);
    } catch (error) {
        return `registro inválido: ${error.message}`;
    }
    return null;
}

/**
 * Separa los registros válidos de los que se deben descartar.
 * Los códigos se comparan igual que en `Catalogo` (sin distinguir mayúsculas y
 * sin espacios exteriores); se conserva el primero y se descartan los repetidos.
 * Nunca lanza: una colección que no es un arreglo se trata como vacía.
 * @param {object[]} datos Registros recibidos de la API.
 * @returns {{validos: object[], descartados: RegistroDescartado[]}} Resultado de la validación.
 */
export function filtrarValidos(datos) {
    if (!Array.isArray(datos)) return { validos: [], descartados: [] };

    const vistos = new Set();

    const evaluados = datos
        .map((registro, indice) => ({ registro, indice, motivo: motivoDeDescarte(registro) }))
        .map((item) => {
            if (item.motivo) return item;
            const clave = normalizarCodigo(item.registro.codigo);
            if (vistos.has(clave)) return { ...item, motivo: "código repetido" };
            vistos.add(clave);
            return item;
        });

    return {
        validos: evaluados.filter((item) => !item.motivo).map((item) => item.registro),
        descartados: evaluados
            .filter((item) => item.motivo)
            .map(({ indice, motivo }) => ({ indice, motivo }))
    };
}

/**
 * Convierte registros válidos en instancias de `Producto`.
 * @param {object[]} validos Registros ya validados con `filtrarValidos`.
 * @returns {Producto[]} Productos del dominio.
 * @throws {TypeError|RangeError} Solo si se pasan registros que no fueron validados.
 */
export function construirProductos(validos) {
    return validos.map((datos) => new Producto(datos));
}

/**
 * Resume el catálogo en una sola pasada.
 * @param {Producto[]} productos Productos del catálogo.
 * @returns {{total: number, porCategoria: Object<string, number>, precioMinimo: number|null, precioMaximo: number|null}}
 *          Cantidad total, cantidad por categoría y rango de precios
 *          (con lista vacía: total 0 y precios null).
 */
export function resumirCatalogo(productos) {
    const resumen = productos.reduce((acumulado, producto) => {
        acumulado.porCategoria.set(
            producto.categoria,
            (acumulado.porCategoria.get(producto.categoria) ?? 0) + 1
        );
        return {
            total: acumulado.total + 1,
            porCategoria: acumulado.porCategoria,
            precioMinimo: acumulado.precioMinimo === null
                ? producto.precio
                : Math.min(acumulado.precioMinimo, producto.precio),
            precioMaximo: acumulado.precioMaximo === null
                ? producto.precio
                : Math.max(acumulado.precioMaximo, producto.precio)
        };
    }, { total: 0, porCategoria: new Map(), precioMinimo: null, precioMaximo: null });

    return { ...resumen, porCategoria: Object.fromEntries(resumen.porCategoria) };
}

/**
 * Agrupa los productos por categoría.
 * @param {Producto[]} productos Productos del catálogo.
 * @returns {Object<string, Producto[]>} Categoría → productos de esa categoría.
 */
export function agruparPorCategoria(productos) {
    return Object.fromEntries(
        productos.reduce((grupos, producto) => {
            grupos.set(producto.categoria, [...(grupos.get(producto.categoria) ?? []), producto]);
            return grupos;
        }, new Map())
    );
}
