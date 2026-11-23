
/**
 * Servicio que obtiene las categorías disponibles
 * a partir de los productos del catálogo.
 */
export class ServicioCategorias {

    /**
     * Obtiene las categorías únicas y ordenadas.
     * @param {Catalogo} catalogo
     * @returns {string[]}
     */
    static obtenerCategorias(catalogo) {
        const productos = catalogo.obtenerProductos();

        const categorias = productos.map(
            (producto) => producto.categoria
        );

        return [...new Set(categorias)].sort(
            (a, b) => a.localeCompare(b, "es")
        );
    }
}
