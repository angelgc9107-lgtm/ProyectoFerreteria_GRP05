import { Catalogo } from "./Catalogo.js";
import { normalizarCodigo } from "./Producto.js";

function cantidadValida(valor) {
    // Las cadenas solo pueden contener dígitos: Number() aceptaría "0x10" o "1e2".
    const formatoValido = typeof valor === "number" ||
        (typeof valor === "string" && /^\s*\d+\s*$/.test(valor));
    return formatoValido && Number.isSafeInteger(Number(valor)) && Number(valor) >= 1;
}

function calcularResumen(items) {
    let total = 0;
    let cantidadUnidades = 0;
    const resumen = items.map((item) => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        cantidadUnidades += item.cantidad;
        if (!Number.isFinite(subtotal) || !Number.isFinite(total) ||
                !Number.isSafeInteger(cantidadUnidades)) {
            throw new RangeError("El total o la cantidad de unidades supera el limite permitido.");
        }
        return { ...item, subtotal };
    });
    return { items: resumen, total, cantidadItems: items.length, cantidadUnidades };
}

export class Carrito {
    #items;

    /**
     * Crea un carrito con instantáneas de productos.
     * La suma de unidades debe ser un entero seguro para conservar la precisión.
     * @param {Array<{codigo: string, nombre: string, categoria: string, precio: number, cantidad: number}>} [items=[]] Ítems iniciales.
     * @throws {TypeError|RangeError} Si hay instantáneas inválidas o duplicadas.
     */
    constructor(items = []) {
        if (!Array.isArray(items)) throw new TypeError("Los items deben ser un arreglo.");
        const codigos = new Set();
        this.#items = Array.from(items, (item) => {
            if (!item || typeof item !== "object" || Array.isArray(item)) {
                throw new TypeError("Cada item debe ser un objeto.");
            }
            for (const campo of ["codigo", "nombre", "categoria"]) {
                if (typeof item[campo] !== "string") throw new TypeError(`${campo} debe ser una cadena.`);
                if (!item[campo].trim()) throw new RangeError(`${campo} no puede estar vacio.`);
            }
            if (typeof item.precio !== "number" || typeof item.cantidad !== "number") {
                throw new TypeError("El precio y la cantidad deben ser numeros.");
            }
            if (!Number.isFinite(item.precio) || item.precio < 0 || !cantidadValida(item.cantidad)) {
                throw new RangeError("El precio o la cantidad del item no son validos.");
            }
            const codigo = normalizarCodigo(item.codigo);
            if (codigos.has(codigo)) throw new RangeError("Los codigos del carrito deben ser unicos.");
            codigos.add(codigo);
            return {
                codigo: item.codigo.trim(), nombre: item.nombre.trim(), categoria: item.categoria.trim(),
                precio: item.precio, cantidad: item.cantidad
            };
        });
        calcularResumen(this.#items);
    }

    #actualizar(items) {
        try {
            calcularResumen(items);
        } catch (error) {
            if (!(error instanceof RangeError)) throw error;
            return { exito: false, error: error.message };
        }
        this.#items = items;
        return { exito: true, error: null };
    }

    /**
     * Agrega un producto del catálogo o acumula su cantidad.
     * La suma de unidades del carrito no puede superar el límite entero seguro.
     * @param {Catalogo} catalogo Catálogo de origen.
     * @param {string} codigo Código del producto.
     * @param {number|string} cantidad Unidades a agregar.
     * @returns {{exito: boolean, error: string|null}} Resultado de la operación.
     */
    agregar(catalogo, codigo, cantidad) {
        if (!(catalogo instanceof Catalogo)) return { exito: false, error: "El catalogo no es valido." };
        const producto = catalogo.obtenerPorCodigo(codigo);
        if (!producto) return { exito: false, error: "El producto no existe en el catalogo." };
        if (!cantidadValida(cantidad)) return { exito: false, error: "La cantidad debe ser un entero seguro mayor o igual a uno." };
        const datos = producto.toJSON();
        const indice = this.#items.findIndex((item) => normalizarCodigo(item.codigo) === normalizarCodigo(datos.codigo));
        const items = this.#items.map((item) => ({ ...item }));
        if (indice === -1) {
            items.push({
                codigo: datos.codigo, nombre: datos.nombre, categoria: datos.categoria,
                precio: datos.precio, cantidad: Number(cantidad)
            });
        } else {
            items[indice].cantidad += Number(cantidad);
            if (!Number.isSafeInteger(items[indice].cantidad)) {
                return { exito: false, error: "La cantidad total supera el limite permitido." };
            }
        }
        return this.#actualizar(items);
    }

    /**
     * Reemplaza la cantidad de un ítem existente.
     * La suma de unidades del carrito no puede superar el límite entero seguro.
     * @param {string} codigo Código del ítem.
     * @param {number|string} cantidad Nueva cantidad.
     * @returns {{exito: boolean, error: string|null}} Resultado de la operación.
     */
    cambiarCantidad(codigo, cantidad) {
        if (!cantidadValida(cantidad)) return { exito: false, error: "La cantidad debe ser un entero seguro mayor o igual a uno." };
        const buscado = typeof codigo === "string" ? normalizarCodigo(codigo) : "";
        const indice = this.#items.findIndex((item) => normalizarCodigo(item.codigo) === buscado);
        if (indice === -1) return { exito: false, error: "El producto no esta en el carrito." };
        const items = this.#items.map((item) => ({ ...item }));
        items[indice].cantidad = Number(cantidad);
        return this.#actualizar(items);
    }

    /**
     * Elimina un ítem por código.
     * @param {string} codigo Código del ítem.
     * @returns {{exito: boolean, error: string|null}} Resultado de la operación.
     */
    eliminar(codigo) {
        const buscado = typeof codigo === "string" ? normalizarCodigo(codigo) : "";
        const items = this.#items.filter((item) => normalizarCodigo(item.codigo) !== buscado);
        if (items.length === this.#items.length) return { exito: false, error: "El producto no esta en el carrito." };
        return this.#actualizar(items);
    }

    /** @returns {{items: object[], total: number, cantidadItems: number, cantidadUnidades: number}} Resumen con subtotales y contadores. */
    resumir() {
        return calcularResumen(this.#items);
    }

    /** @returns {void} Vacía el carrito. */
    vaciar() {
        this.#items = [];
    }

    /** @returns {{items: object[]}} Copias sin subtotales derivados. */
    toJSON() {
        return { items: this.#items.map((item) => ({ ...item })) };
    }

    /**
     * Reconstruye y valida un carrito.
     * @param {{items: object[]}} datos Datos serializados.
     * @returns {Carrito} Carrito reconstruido.
     * @throws {TypeError|RangeError} Si los datos son inválidos.
     */
    static fromJSON(datos) {
        if (!datos || typeof datos !== "object" || Array.isArray(datos) || !Array.isArray(datos.items)) {
            throw new TypeError("Los datos del carrito deben contener un arreglo de items.");
        }
        return new Carrito(datos.items);
    }
}

export default Carrito;
