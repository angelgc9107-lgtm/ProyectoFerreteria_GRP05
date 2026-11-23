
import { StorageUtil, CLAVES } from "../utils/storage.js";
import { Carrito } from "../models/Carrito.js";
import { Catalogo } from "../models/Catalogo.js";
import { Pedido } from "../models/Pedido.js";

/**
 * Fachada de persistencia de FerroLab.
 * Centraliza el acceso a StorageUtil.
 */
export const FachadaStorage = Object.freeze({

    // CARRITO
    cargarCarrito() {
        return StorageUtil.cargarInstancia(
            CLAVES.CARRITO, Carrito
        ) ?? new Carrito();
    },

    guardarCarrito(carrito) {
        return StorageUtil.guardarInstancia(
            CLAVES.CARRITO, carrito
        );
    },

    // HISTORIAL DE PEDIDOS
    cargarPedidos() {
        return StorageUtil.cargarLista(
            CLAVES.PEDIDOS, Pedido
        );
    },

    guardarPedidos(pedidos) {
        return StorageUtil.guardarLista(
            CLAVES.PEDIDOS, pedidos
        );
    },

    // SECUENCIA DE PEDIDOS
    cargarSecuenciaPedidos() {
        return StorageUtil.obtener(
            CLAVES.SECUENCIA_PEDIDOS
        );
    },

    guardarSecuenciaPedidos(secuencia) {
        return StorageUtil.guardar(
            CLAVES.SECUENCIA_PEDIDOS, secuencia
        );
    },

    // PREFERENCIAS
    cargarPreferencias() {
        return StorageUtil.obtener(CLAVES.PREFERENCIAS);
    },

    guardarPreferencias(preferencias) {
        return StorageUtil.guardar(
            CLAVES.PREFERENCIAS, preferencias
        );
    },

    // CACHÉ DEL CATÁLOGO
    cargarCatalogo() {
        return StorageUtil.cargarInstancia(
            CLAVES.CACHE_CATALOGO, Catalogo
        );
    },

    guardarCatalogo(catalogo) {
        return StorageUtil.guardarInstancia(
            CLAVES.CACHE_CATALOGO, catalogo
        );
    },

    // BORRADOR DE COMPRA
    cargarBorrador() {
        return StorageUtil.obtener(
            CLAVES.BORRADOR_CHECKOUT, "session"
        );
    },

    guardarBorrador(borrador) {
        return StorageUtil.guardar(
            CLAVES.BORRADOR_CHECKOUT, borrador, "session"
        );
    },

    eliminarBorrador() {
        return StorageUtil.eliminar(
            CLAVES.BORRADOR_CHECKOUT, "session"
        );
    },

    // FILTROS DEL CATÁLOGO
    cargarFiltros() {
        return StorageUtil.obtener(
            CLAVES.FILTROS_CATALOGO, "session"
        );
    },

    guardarFiltros(filtros) {
        return StorageUtil.guardar(
            CLAVES.FILTROS_CATALOGO, filtros, "session"
        );
    },

    // BIENVENIDA
    bienvenidaVista() {
        return StorageUtil.obtener(
            CLAVES.BIENVENIDA_VISTA, "session"
        );
    },

    guardarBienvenidaVista() {
        return StorageUtil.guardar(
            CLAVES.BIENVENIDA_VISTA, true, "session"
        );
    }
});
