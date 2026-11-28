/**
 * Contrato del wrapper de SweetAlert2 y navegación del diálogo real.
 * Los flujos del controlador se mantienen en script.spec.js.
 */
import { ServicioDialogos } from "../services/ServicioDialogos.js";

const { describe, it, expect, beforeEach, afterEach, spyOn } = globalThis;

describe("ServicioDialogos - librería externa", function () {
    let swalOriginal;
    let fire;
    let origen;

    beforeEach(function () {
        swalOriginal = Object.getOwnPropertyDescriptor(globalThis, "Swal");
        fire = jasmine.createSpy("Swal.fire").and.resolveTo({ isConfirmed: true });
        globalThis.Swal = { fire };
        origen = document.createElement("button");
        origen.textContent = "Abrir diálogo";
        document.body.append(origen);
    });

    describe("ServicioDialogos - SweetAlert2 real", function () {
        let iframe;
        let win;
        let doc;

        beforeEach(async function () {
            iframe = document.createElement("iframe");
            iframe.title = "sweetalert-real-bajo-prueba";
            iframe.style.cssText = "position:fixed;left:-10000px;top:0;width:1280px;height:900px;border:0;";
            const cargado = new Promise((resolve) => iframe.addEventListener("load", resolve, { once: true }));
            iframe.src = new URL("../../index.html", import.meta.url).href;
            document.body.append(iframe);
            await cargado;
            win = iframe.contentWindow;
            doc = iframe.contentDocument;
            if (!win.Swal || typeof win.Swal.fire !== "function") {
                throw new Error("SweetAlert2 no cargó desde el CDN para la prueba real.");
            }
        }, 30000);

        afterEach(function () {
            iframe?.remove();
            iframe = win = doc = null;
        });

        it("mantiene Tab dentro del diálogo y Escape cancela y devuelve el foco", async function () {
            const url = new URL("../services/ServicioDialogos.js", import.meta.url).href;
            const { ServicioDialogos: servicio } = await new win.Function("url", "return import(url);")(url);
            const origen = doc.createElement("button");
            origen.textContent = "Abrir";
            doc.body.append(origen);
            origen.focus();
            const respuesta = servicio.confirmar({ titulo: "¿Eliminar?", peligroso: true, origen });
            const esperar = async (condicion, mensaje) => {
                const fin = Date.now() + 5000;
                while (!condicion()) {
                    if (Date.now() > fin) throw new Error(`Tiempo agotado: ${mensaje}`);
                    await new Promise((resolve) => setTimeout(resolve, 20));
                }
            };
            await esperar(() => doc.activeElement?.classList.contains("swal2-cancel"), "foco inicial");
            const popup = doc.querySelector(".swal2-popup");
            expect(popup.getAttribute("role")).toBe("dialog");
            expect(popup.getAttribute("aria-modal")).toBe("true");

            doc.activeElement.dispatchEvent(new win.KeyboardEvent("keydown", {
                key: "Tab", bubbles: true, cancelable: true
            }));
            expect(doc.activeElement).toBe(doc.querySelector(".swal2-confirm"));

            doc.activeElement.dispatchEvent(new win.KeyboardEvent("keydown", {
                key: "Tab", shiftKey: true, bubbles: true, cancelable: true
            }));
            expect(doc.activeElement).toBe(doc.querySelector(".swal2-cancel"));

            doc.activeElement.dispatchEvent(new win.KeyboardEvent("keydown", {
                key: "Escape", bubbles: true, cancelable: true
            }));
            expect(await respuesta).toBeFalse();
            await esperar(() => !doc.querySelector(".swal2-container") && doc.activeElement === origen,
                "cierre y retorno del foco");
        }, 30000);
    });

    afterEach(function () {
        origen.remove();
        if (swalOriginal) Object.defineProperty(globalThis, "Swal", swalOriginal);
        else delete globalThis.Swal;
    });

    it("inicializa el diálogo con textos personalizados como texto plano", async function () {
        const titulo = '<img src=x onerror="fallo()">¿Eliminar?';
        const texto = "<strong>Detalle</strong>";

        const resultado = await ServicioDialogos.confirmar({
            titulo, texto, textoConfirmar: "Eliminar", textoCancelar: "Volver", peligroso: true
        });

        expect(resultado).toBeTrue();
        expect(fire).toHaveBeenCalledTimes(1);
        expect(fire).toHaveBeenCalledWith(jasmine.objectContaining({
            titleText: titulo, text: texto, confirmButtonText: "Eliminar",
            cancelButtonText: "Volver", icon: "warning", focusCancel: true,
            showCancelButton: true, reverseButtons: true, returnFocus: true,
            stopKeydownPropagation: true, allowEscapeKey: true
        }));
        const opciones = fire.calls.mostRecent().args[0];
        expect(opciones.title).toBeUndefined();
        expect(opciones.html).toBeUndefined();
        expect(opciones.customClass.confirmButton).toContain("--peligro");
    });

    it("usa las opciones predeterminadas en una confirmación no destructiva", async function () {
        await ServicioDialogos.confirmar({ titulo: "Confirmar compra" });

        expect(fire).toHaveBeenCalledWith(jasmine.objectContaining({
            titleText: "Confirmar compra", text: "", confirmButtonText: "Confirmar",
            cancelButtonText: "Cancelar", icon: "question", focusCancel: false,
            buttonsStyling: false, target: "body"
        }));
        expect(fire.calls.mostRecent().args[0].customClass.confirmButton).toContain("--confirmar");
    });

    it("solo confirma cuando isConfirmed es estrictamente true", async function () {
        for (const respuesta of [undefined, null, {}, { isConfirmed: false }, { isConfirmed: 1 }]) {
            fire.and.resolveTo(respuesta);
            expect(await ServicioDialogos.confirmar({ titulo: "Pregunta" })).toBeFalse();
        }
        fire.and.resolveTo({ isConfirmed: true });
        expect(await ServicioDialogos.confirmar({ titulo: "Pregunta" })).toBeTrue();
    });

    it("espera la respuesta de la librería antes de resolver", async function () {
        let responder;
        fire.and.returnValue(new Promise((resolve) => { responder = resolve; }));
        let terminado = false;
        const resultado = ServicioDialogos.confirmar({ titulo: "Pregunta" })
            .then((valor) => { terminado = true; return valor; });

        await Promise.resolve();
        expect(terminado).toBeFalse();
        responder({ isConfirmed: false, isDismissed: true });
        expect(await resultado).toBeFalse();
    });

    it("enfoca el origen conectado e inserta el diálogo dentro de su modal", async function () {
        const modal = document.createElement("section");
        modal.setAttribute("aria-modal", "true");
        document.body.append(modal);
        modal.append(origen);
        try {
            await ServicioDialogos.confirmar({ titulo: "Pregunta", origen });
            expect(document.activeElement).toBe(origen);
            expect(fire.calls.mostRecent().args[0].target).toBe(modal);
        } finally {
            modal.remove();
        }
    });

    it("no intenta enfocar un origen desconectado y usa body", async function () {
        origen.remove();
        const enfocar = spyOn(origen, "focus");

        await ServicioDialogos.confirmar({ titulo: "Pregunta", origen });

        expect(enfocar).not.toHaveBeenCalled();
        expect(fire.calls.mostRecent().args[0].target).toBe("body");
    });

    it("respeta la preferencia de movimiento reducido en la configuración", async function () {
        spyOn(globalThis, "matchMedia").and.returnValue({ matches: true });

        await ServicioDialogos.confirmar({ titulo: "Pregunta" });

        const opciones = fire.calls.mostRecent().args[0];
        expect(globalThis.matchMedia).toHaveBeenCalledWith("(prefers-reduced-motion: reduce)");
        expect(opciones.showClass.popup).toBe("");
        expect(opciones.hideClass.popup).toBe("");
    });

    it("registra el error y permite continuar si fire no existe o rechaza", async function () {
        const error = new Error("falla de SweetAlert2");
        const registro = spyOn(console, "error");
        globalThis.Swal = {};
        expect(await ServicioDialogos.confirmar({ titulo: "Pregunta" })).toBeTrue();
        expect(registro).toHaveBeenCalledWith(
            "SweetAlert2 no está disponible: la acción continúa sin confirmación."
        );

        globalThis.Swal = { fire };
        fire.and.rejectWith(error);
        expect(await ServicioDialogos.confirmar({ titulo: "Pregunta" })).toBeTrue();
        expect(registro).toHaveBeenCalledWith(
            "No se pudo mostrar el diálogo de confirmación; la acción continúa sin confirmación.",
            error
        );
    });
});
