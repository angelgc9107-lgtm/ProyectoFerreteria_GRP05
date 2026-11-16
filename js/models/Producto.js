export function normalizarTexto(valor) {
    return valor.trim().toLocaleLowerCase("es").normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

export function normalizarCodigo(valor) {
    return valor.trim().toLocaleLowerCase("es");
}

export class Producto {
    #codigo;
    #nombre;
    #categoria;
    #descripcion;
    #precio;

    /**
     * Crea un producto con datos de catálogo válidos.
     * @param {{codigo: string, nombre: string, categoria: string, descripcion: string, precio: number}} datos Datos del producto.
     * @throws {TypeError|RangeError} Si los datos no cumplen las reglas.
     */
    constructor(datos) {
        if (!datos || typeof datos !== "object" || Array.isArray(datos)) {
            throw new TypeError("Los datos del producto deben ser un objeto.");
        }
        for (const campo of ["codigo", "nombre", "categoria", "descripcion"]) {
            if (typeof datos[campo] !== "string") {
                throw new TypeError(`${campo} debe ser una cadena.`);
            }
            if (!datos[campo].trim()) {
                throw new RangeError(`${campo} no puede estar vacio.`);
            }
        }
        if (typeof datos.precio !== "number") {
            throw new TypeError("El precio debe ser un numero.");
        }
        if (!Number.isFinite(datos.precio) || datos.precio < 0) {
            throw new RangeError("El precio debe ser finito y no negativo.");
        }
        this.#codigo = datos.codigo.trim();
        this.#nombre = datos.nombre.trim();
        this.#categoria = datos.categoria.trim();
        this.#descripcion = datos.descripcion.trim();
        this.#precio = datos.precio;
    }

    /** @returns {string} Código del producto. */
    get codigo() { return this.#codigo; }
    /** @returns {string} Nombre del producto. */
    get nombre() { return this.#nombre; }
    /** @returns {string} Categoría del producto. */
    get categoria() { return this.#categoria; }
    /** @returns {string} Descripción del producto. */
    get descripcion() { return this.#descripcion; }
    /** @returns {number} Precio unitario. */
    get precio() { return this.#precio; }

    /**
     * Comprueba los criterios normalizados y validados por el catálogo.
     * @param {{texto?: string, categoria?: string, precioMaximo?: number|null}} criterios Criterios de búsqueda.
     * @returns {boolean} Si el producto coincide.
     */
    coincide({ texto = "", categoria = "", precioMaximo = null } = {}) {
        return (!texto || normalizarTexto(`${this.#nombre} ${this.#descripcion}`).includes(texto)) &&
            (!categoria || normalizarTexto(this.#categoria) === categoria) &&
            (precioMaximo === null || this.#precio <= precioMaximo);
    }

    /** @returns {{codigo: string, nombre: string, categoria: string, descripcion: string, precio: number}} Copia serializable. */
    toJSON() {
        return {
            codigo: this.#codigo, nombre: this.#nombre, categoria: this.#categoria,
            descripcion: this.#descripcion, precio: this.#precio
        };
    }

    /**
     * Reconstruye y valida un producto.
     * @param {object} datos Datos serializados.
     * @returns {Producto} Producto reconstruido.
     * @throws {TypeError|RangeError} Si los datos son inválidos.
     */
    static fromJSON(datos) {
        return new Producto(datos);
    }
}

export default Producto;
