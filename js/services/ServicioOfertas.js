
import { Catalogo } from "../models/Catalogo.js";

/**
 * Configuración de las ofertas disponibles.
 * El precio actual y los datos del producto
 * se obtienen desde Catalogo.
 */
const OFERTAS = [
    {
        codigo: "AMOLADORA-001",
        precioAnterior: 65000,
        imagen: "assets/images/amoladora.png"
    },
    {
        codigo: "KIT-TAPONES-001",
        precioAnterior: 99000,
        imagen: "assets/images/kit-juego-tapones.png"
    },
    {
        codigo: "MARTILLO-001",
        precioAnterior: 25000,
        imagen: "assets/images/martillo-galponero.png"
    }
];

/**
 * Servicio que proporciona los productos en oferta.
 */
export class ServicioOfertas {

    /**
     * Obtiene las ofertas con los datos del catálogo.
     * @param {Catalogo} catalogo
     * @returns {Array<object>}
     */
    static obtenerOfertas(catalogo) {
        if (!(catalogo instanceof Catalogo)) {
            throw new TypeError("El catálogo no es válido.");
        }

        return OFERTAS.map((oferta) => {
            const producto = catalogo.obtenerPorCodigo(
                oferta.codigo
            );

            if (!producto) {
                throw new RangeError(
                    `Producto no encontrado: ${oferta.codigo}`
                );
            }

            if (oferta.precioAnterior <= producto.precio) {
                throw new RangeError(
                    `La oferta de ${oferta.codigo} no tiene un precio anterior mayor al actual.`
                );
            }

            return {
                codigo: producto.codigo,
                nombre: producto.nombre,
                descripcion: producto.descripcion,
                precioActual: producto.precio,
                precioAnterior: oferta.precioAnterior,
                imagen: oferta.imagen
            };
        });
    }
}
