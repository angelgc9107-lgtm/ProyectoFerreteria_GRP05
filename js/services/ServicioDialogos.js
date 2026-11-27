/**
 * Servicio de diálogos de confirmación de FerroLab.
 * Encapsula SweetAlert2, que index.html carga por CDN como la global `Swal`:
 * el resto de la aplicación nunca usa `Swal` directamente.
 *
 * Si la librería no cargó o falla al abrir el diálogo, el error queda en la
 * consola y la acción sigue sin confirmación, como antes de integrarla.
 */

// Clases propias definidas en css/components.css (no se modifica el CSS de la librería).
const CLASES = Object.freeze({
    container: "dialogo-confirmacion-fondo",
    popup: "dialogo-confirmacion",
    icon: "dialogo-confirmacion__icono",
    title: "dialogo-confirmacion__titulo",
    htmlContainer: "dialogo-confirmacion__texto",
    actions: "dialogo-confirmacion__acciones",
    cancelButton: "dialogo-confirmacion__boton dialogo-confirmacion__boton--cancelar"
});

const BOTON_CONFIRMAR = "dialogo-confirmacion__boton dialogo-confirmacion__boton--confirmar";
const BOTON_PELIGRO = "dialogo-confirmacion__boton dialogo-confirmacion__boton--peligro";

/**
 * Devuelve la instancia global de SweetAlert2, o null si no está cargada.
 * Se consulta en cada llamada para que las pruebas puedan reemplazarla por un doble.
 * @returns {{ fire: Function } | null}
 */
function obtenerSwal() {
    const swal = globalThis.Swal;
    return swal && typeof swal.fire === "function" ? swal : null;
}

/**
 * Indica si el usuario pidió reducir las animaciones en su sistema.
 * @returns {boolean}
 */
function prefiereMenosMovimiento() {
    return globalThis.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

/**
 * Elige dónde insertar el diálogo. Si el botón que lo abrió está dentro de un
 * diálogo modal abierto (por ejemplo, el Offcanvas del carrito), el diálogo se
 * inserta ahí: así la trampa de foco de Bootstrap no le quita el foco.
 * @param {HTMLElement | null} origen
 * @returns {HTMLElement | string}
 */
function obtenerDestino(origen) {
    return origen?.closest?.('[aria-modal="true"]') ?? "body";
}

/**
 * Arma las opciones de Swal.fire() para una confirmación.
 * Los textos se pasan con titleText y text (nunca title ni html), porque
 * pueden incluir nombres de productos y no deben interpretarse como HTML.
 * @param {object} opciones - Ver ServicioDialogos.confirmar().
 * @returns {object}
 */
function construirOpciones({ titulo, texto, textoConfirmar, textoCancelar, peligroso, origen }) {
    const opciones = {
        titleText: titulo,
        text: texto,
        icon: peligroso ? "warning" : "question",
        showCancelButton: true,
        confirmButtonText: textoConfirmar,
        cancelButtonText: textoCancelar,
        reverseButtons: true,
        focusCancel: peligroso,
        allowEscapeKey: true,
        // Esc cancela el diálogo y no se propaga: el Offcanvas que lo contiene sigue abierto.
        stopKeydownPropagation: true,
        returnFocus: true,
        buttonsStyling: false,
        customClass: { ...CLASES, confirmButton: peligroso ? BOTON_PELIGRO : BOTON_CONFIRMAR },
        target: obtenerDestino(origen)
    };

    if (prefiereMenosMovimiento()) {
        opciones.showClass = { popup: "", backdrop: "swal2-backdrop-show", icon: "" };
        opciones.hideClass = { popup: "", backdrop: "swal2-backdrop-hide", icon: "" };
    }

    return opciones;
}

export const ServicioDialogos = Object.freeze({

    /**
     * Indica si SweetAlert2 está cargada.
     * @returns {boolean}
     */
    disponible() {
        return obtenerSwal() !== null;
    },

    /**
     * Pide al usuario que confirme una acción.
     * Nunca rechaza: si la librería no está o falla, registra el error y
     * devuelve true para que la acción siga como antes de integrarla.
     * @param {object} opciones
     * @param {string} opciones.titulo - Pregunta principal del diálogo.
     * @param {string} [opciones.texto] - Detalle; los saltos de línea se respetan.
     * @param {string} [opciones.textoConfirmar]
     * @param {string} [opciones.textoCancelar]
     * @param {boolean} [opciones.peligroso] - Acción que pierde datos: el foco
     *   inicial queda en «Cancelar» y el botón de confirmar usa el estilo de peligro.
     * @param {HTMLElement | null} [opciones.origen] - Botón que abrió el diálogo;
     *   recibe el foco al cancelar.
     * @returns {Promise<boolean>} true si el usuario confirmó; false si canceló,
     *   cerró el diálogo o presionó Esc.
     */
    async confirmar({
        titulo,
        texto = "",
        textoConfirmar = "Confirmar",
        textoCancelar = "Cancelar",
        peligroso = false,
        origen = null
    } = {}) {
        const swal = obtenerSwal();

        if (!swal) {
            console.error("SweetAlert2 no está disponible: la acción continúa sin confirmación.");
            return true;
        }

        // Algunos navegadores (Safari) no enfocan el botón al hacer clic;
        // SweetAlert2 devuelve el foco al elemento activo al abrir el diálogo.
        if (origen?.isConnected && origen.ownerDocument.activeElement !== origen) {
            origen.focus({ preventScroll: true });
        }

        try {
            const resultado = await swal.fire(
                construirOpciones({ titulo, texto, textoConfirmar, textoCancelar, peligroso, origen })
            );
            return resultado?.isConfirmed === true;
        } catch (error) {
            console.error("No se pudo mostrar el diálogo de confirmación; la acción continúa sin confirmación.", error);
            return true;
        }
    }
});
