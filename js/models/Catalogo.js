import { Producto, normalizarCodigo, normalizarTexto } from "./Producto.js";

export class Catalogo {
    #productos;

    /**
     * Crea un catálogo de productos con códigos únicos.
     * @param {Producto[]} [productos=[]] Productos iniciales.
     * @throws {TypeError|RangeError} Si la colección es inválida.
     */
    constructor(productos = []) {
        if (!Array.isArray(productos) || Array.from(productos).some((producto) => !(producto instanceof Producto))) {
            throw new TypeError("El catalogo debe contener instancias de Producto.");
        }
        const codigos = new Set(productos.map((producto) => normalizarCodigo(producto.codigo)));
        if (codigos.size !== productos.length) {
            throw new RangeError("Los codigos del catalogo deben ser unicos.");
        }
        this.#productos = [...productos];
    }

    /** @returns {Producto[]} Copia de la colección. */
    obtenerProductos() {
        return [...this.#productos];
    }

    /**
     * Busca un producto por código sin distinguir mayúsculas ni espacios exteriores.
     * @param {string} codigo Código buscado.
     * @returns {Producto|null} Producto encontrado o null.
     */
    obtenerPorCodigo(codigo) {
        if (typeof codigo !== "string") return null;
        const buscado = normalizarCodigo(codigo);
        return this.#productos.find((producto) => normalizarCodigo(producto.codigo) === buscado) || null;
    }

    /**
     * Filtra y ordena productos por precio.
     * @param {{texto?: string, categoria?: string, precioMaximo?: number|string|null, orden?: "asc"|"desc"}} [criterios={}] Filtros.
     * @returns {{valido: boolean, error: string|null, resultados: Producto[]}} Resultado de la búsqueda.
     */
    buscar(criterios = {}) {
        const error = (mensaje) => ({ valido: false, error: mensaje, resultados: [] });
        if (!criterios || typeof criterios !== "object" || Array.isArray(criterios)) {
            return error("Los criterios deben ser un objeto.");
        }
        const { texto = "", categoria = "", precioMaximo = null, orden = "asc" } = criterios;
        if (typeof texto !== "string" || typeof categoria !== "string") {
            return error("El texto y la categoria deben ser cadenas.");
        }
        if (orden !== "asc" && orden !== "desc") {
            return error("El orden debe ser asc o desc.");
        }
        let precio = null;
        if (precioMaximo !== null && precioMaximo !== undefined &&
                !(typeof precioMaximo === "string" && precioMaximo.trim() === "")) {
            if (typeof precioMaximo !== "number" &&
                    !(typeof precioMaximo === "string" && /^\s*\d+(\.\d+)?\s*$/.test(precioMaximo))) {
                return error("El precio maximo debe ser un numero mayor o igual a cero.");
            }
            precio = Number(precioMaximo);
            if (!Number.isFinite(precio) || precio < 0) {
                return error("El precio maximo debe ser un numero mayor o igual a cero.");
            }
        }
        const filtros = {
            texto: normalizarTexto(texto), categoria: normalizarTexto(categoria), precioMaximo: precio
        };
        const resultados = this.#productos.filter((producto) => producto.coincide(filtros));
        resultados.sort((a, b) => orden === "asc" ? a.precio - b.precio : b.precio - a.precio);
        return { valido: true, error: null, resultados };
    }

    /** @returns {{productos: object[]}} Productos serializados. */
    toJSON() {
        return { productos: this.#productos.map((producto) => producto.toJSON()) };
    }

    /**
     * Reconstruye el catálogo y valida sus productos.
     * @param {{productos: object[]}} datos Datos serializados.
     * @returns {Catalogo} Catálogo reconstruido.
     * @throws {TypeError|RangeError} Si los datos son inválidos.
     */
    static fromJSON(datos) {
        if (!datos || typeof datos !== "object" || Array.isArray(datos) || !Array.isArray(datos.productos)) {
            throw new TypeError("Los datos del catalogo deben contener un arreglo de productos.");
        }
        return new Catalogo(datos.productos.map((producto) => Producto.fromJSON(producto)));
    }
}

export default Catalogo;
