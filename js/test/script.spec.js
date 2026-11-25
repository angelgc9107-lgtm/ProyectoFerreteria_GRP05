/**
 * Suites de Jasmine para el controlador js/script.js (eventos y DOM) de FerroLab.
 *
 * script.js ya no exporta funciones: al cargarse registra sus eventos sobre el
 * index.html real. Por eso cada test abre una copia nueva de index.html en un
 * <iframe> (mismo origen), dispara eventos reales sobre sus controles y comprueba
 * lo que queda en el DOM. Así el estado interno del controlador (carrito, pago,
 * pedido) empieza limpio en cada test y no se necesita storage simulado.
 *
 * Se ejecuta con js/test/test-runner.html, servido por HTTP desde la raíz del repo.
 */

const { describe, it, expect, beforeEach, afterEach } = globalThis;

const URL_APP = new URL("../../index.html", import.meta.url).href;
const TIEMPO_CARGA_MS = 30000;

let marco;
let win;
let doc;
let espiaAlert;
let espiaPrompt;
let espiaConfirm;
let espiaConsoleLog;
let espiaConsoleError;
let storageAntes;

const CLAVES_STORAGE_PRUEBAS = [
    "app:carrito:items",
    "app:pedidos:secuencia",
    "app:pedidos:historial"
];

let valoresOriginalesStorage;

// ---------------------------------------------------------------------------
// Utilidades
// ---------------------------------------------------------------------------

function abrirApp() {
    return new Promise((resolve) => {
        const iframe = document.createElement("iframe");
        iframe.title = "app-bajo-prueba";
        iframe.style.cssText =
            "position:fixed;left:-10000px;top:0;width:1280px;height:900px;border:0;";
        iframe.addEventListener("load", () => resolve(iframe), { once: true });
        iframe.src = URL_APP;
        document.body.append(iframe);
    });
}

const q = (selector) => doc.querySelector(selector);
const qa = (selector) => Array.from(doc.querySelectorAll(selector));
const texto = (selector) => q(selector).textContent.replace(/\s+/g, " ").trim();
const pausa = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function disparar(elemento, tipo, opciones = {}) {
    const evento = new win.Event(tipo, { bubbles: true, cancelable: true, ...opciones });
    elemento.dispatchEvent(evento);
    return evento;
}

function clic(elemento) {
    elemento.dispatchEvent(new win.MouseEvent("click", { bubbles: true, cancelable: true }));
}

function escribir(selectorOControl, valor) {
    const control = typeof selectorOControl === "string" ? q(selectorOControl) : selectorOControl;
    control.value = valor;
    disparar(control, "input");
    return control;
}

function elegir(selectorOControl, valor) {
    const control = typeof selectorOControl === "string" ? q(selectorOControl) : selectorOControl;
    control.value = valor;
    disparar(control, "change");
    return control;
}

function enviar(selector) {
    return disparar(q(selector), "submit");
}

function botonAgregar(codigo) {
    return q(`#catalogo [data-action="agregar-carrito"][data-product-code="${codigo}"]`);
}

function agregarAlCarrito(codigo) {
    clic(botonAgregar(codigo));
}

function codigosVisibles() {
    return qa("#resultados-catalogo article[data-product-code]")
        .filter((tarjeta) => !tarjeta.parentElement.hidden)
        .map((tarjeta) => tarjeta.dataset.productCode);
}

function cantidadEnCarrito(codigo) {
    const control = q(`#carrito-items [data-action="cambiar-cantidad"][data-product-code="${codigo}"]`);
    return control ? control.value : null;
}

function iniciarCompra() {
    clic(q('[data-action="iniciar-compra"]'));
}

/** Copia el contenido de un Web Storage para compararlo después. */
function instantanea(almacen) {
    return Object.fromEntries(
        Array.from({ length: almacen.length }, (_, i) => almacen.key(i))
            .filter((clave) => clave !== null)
            .map((clave) => [clave, almacen.getItem(clave)])
    );
}

function irAlPago(codigo = "GUANTES-001") {
    agregarAlCarrito(codigo);
    iniciarCompra();
}

function irAConfirmacion(metodo = "efectivo-transferencia", cuotas = "1") {
    irAlPago();
    elegir("#metodo-pago", metodo);
    if (metodo === "tarjeta") elegir("#cuotas", cuotas);
    enviar("#form-pago");
}

function completarCliente(
    nombre = "Ana Pérez", correo = "ana@correo.com", direccion = "Calle Falsa 123"
) {
    escribir("#pedido-nombre", nombre);
    escribir("#pedido-correo", correo);
    escribir("#pedido-direccion", direccion);
}

function llegarAlResumen() {
    irAConfirmacion();
    completarCliente();
    enviar("#form-pedido");
}

// ---------------------------------------------------------------------------
// Preparación común: una copia nueva de la página para cada test
// ---------------------------------------------------------------------------


beforeEach(async function () {
    // Guarda los datos originales del usuario.
    valoresOriginalesStorage = new Map(
        CLAVES_STORAGE_PRUEBAS.map((clave) => [
            clave,
            window.localStorage.getItem(clave)
        ])
    );

    // Cada prueba debe comenzar sin carrito ni pedidos anteriores.
    CLAVES_STORAGE_PRUEBAS.forEach((clave) => {
        window.localStorage.removeItem(clave);
    });

    // Carga una instancia limpia de la aplicación.
    marco = await abrirApp();
    win = marco.contentWindow;
    doc = marco.contentDocument;

    espiaAlert = jasmine.createSpy("alert");
    espiaPrompt = jasmine.createSpy("prompt");
    espiaConfirm = jasmine.createSpy("confirm");

    win.alert = espiaAlert;
    win.prompt = espiaPrompt;
    win.confirm = espiaConfirm;

    espiaConsoleLog = spyOn(win.console, "log");
    espiaConsoleError = spyOn(win.console, "error");

    storageAntes = {
        local: instantanea(win.localStorage),
        session: instantanea(win.sessionStorage)
    };
}, TIEMPO_CARGA_MS);


afterEach(function () {
    if (marco) {
        marco.remove();
    }

    // Restaura los datos originales del localStorage.
    if (valoresOriginalesStorage) {
        for (const [clave, valor] of valoresOriginalesStorage) {
            if (valor === null) {
                window.localStorage.removeItem(clave);
            } else {
                window.localStorage.setItem(clave, valor);
            }
        }
    }

    valoresOriginalesStorage = null;
    marco = win = doc = null;
});

/**
 * Cierra la página y la abre de nuevo SIN borrar el storage, como una recarga del
 * navegador. Se usa en las pruebas de persistencia; el aislamiento entre tests lo
 * siguen resolviendo el beforeEach y el afterEach de arriba.
 */
async function recargarApp() {
    marco.remove();
    marco = await abrirApp();
    win = marco.contentWindow;
    doc = marco.contentDocument;

    espiaAlert = jasmine.createSpy("alert");
    espiaPrompt = jasmine.createSpy("prompt");
    espiaConfirm = jasmine.createSpy("confirm");
    win.alert = espiaAlert;
    win.prompt = espiaPrompt;
    win.confirm = espiaConfirm;

    espiaConsoleLog = spyOn(win.console, "log");
    espiaConsoleError = spyOn(win.console, "error");
}

// ---------------------------------------------------------------------------
// Carga inicial
// ---------------------------------------------------------------------------

describe("Controlador - carga inicial", function () {
    it("muestra los 9 productos del catálogo y el mensaje de resultados", function () {
        expect(codigosVisibles().length).toBe(9);
        expect(texto("#catalogo-mensaje")).toBe("9 producto(s) encontrado(s).");
    });

    it("arranca con el carrito vacío y el botón de compra deshabilitado", function () {
        expect(texto("#contador-carrito")).toBe("0");
        expect(texto("#carrito-total")).toMatch(/^\$\s?0,00$/);
        expect(texto("#carrito-mensaje")).toBe("El carrito esta vacio.");
        expect(q('[data-action="iniciar-compra"]').disabled).toBeTrue();
        expect(qa("#carrito-items article").length).toBe(0);
    });

    it("mantiene ocultas las secciones de pago y confirmación", function () {
        expect(q("#pago").hidden).toBeTrue();
        expect(q("#confirmacion").hidden).toBeTrue();
    });

    it("el filtro de precio máximo arranca desactivado", function () {
        expect(q("#activar-filtro-precio").checked).toBeFalse();
        expect(q("#precio-hasta").disabled).toBeTrue();
        expect(texto("#precio-hasta-valor")).toBe("Sin limite");
    });
});


/**
 *  - Flujo 1 Pruebas de renderizado dinámico del DOM.
 */
describe("Controlador - RC44: renderizado dinámico", function () {

    it("el HTML original no contiene tarjetas ni filas de productos", async function () {
        const respuesta = await fetch(URL_APP, { cache: "no-store" });
        expect(respuesta.ok).toBeTrue();

        const html = await respuesta.text();
        const documentoOriginal = new DOMParser().parseFromString(
            html,
            "text/html"
        );

        expect(
            documentoOriginal.querySelectorAll("#resultados-catalogo article").length
        ).toBe(0);

        expect(
            documentoOriginal.querySelectorAll("#ofertas-productos article").length
        ).toBe(0);

        expect(
            documentoOriginal.querySelectorAll("#tabla-precios-cuerpo tr").length
        ).toBe(0);

        expect(
            documentoOriginal.querySelectorAll("#carrito-items article").length
        ).toBe(0);
    });

    it("el controlador genera las tarjetas, ofertas y tabla de precios", function () {
        expect(
            qa("#resultados-catalogo article[data-product-code]").length
        ).toBe(9);

        expect(
            qa("#ofertas-productos article[data-product-code]").length
        ).toBe(3);

        expect(
            qa("#tabla-precios-cuerpo tr").length
        ).toBe(9);

        expect(
            q('#resultados-catalogo [data-product-code="GUANTES-001"]')
        ).not.toBeNull();
    });

    it("la búsqueda actualiza dinámicamente las tarjetas del catálogo", function () {
        const tarjetaOriginal = q(
            '#resultados-catalogo article[data-product-code="GUANTES-001"]'
        );

        escribir("#busqueda", "guantes");

        expect(codigosVisibles()).toEqual(["GUANTES-001"]);

        const tarjetaNueva = q(
            '#resultados-catalogo article[data-product-code="GUANTES-001"]'
        );

        expect(tarjetaNueva).not.toBeNull();
        expect(tarjetaNueva).not.toBe(tarjetaOriginal);
    });

    it("genera dinámicamente las categorías y las opciones de pago", function () {
        expect(qa("#menu-categorias li").length).toBe(6);
        expect(qa("#categoria option").length).toBe(6);

        expect(
            Array.from(q("#metodo-pago").options).map((opcion) => opcion.value)
        ).toEqual(["", "efectivo-transferencia", "tarjeta"]);

        elegir("#metodo-pago", "tarjeta");

        expect(
            Array.from(q("#cuotas").options).map((opcion) => opcion.value)
        ).toEqual(["1", "3", "6"]);
    });

});

describe("Controlador - RC60: separación de datos del catálogo", function () {

    it("RC60 - el módulo conserva los nueve productos y sus precios originales", async function () {

        const { productosIniciales } = await import(
            "../data/productosIniciales.js"
        );

        expect(productosIniciales.length).toBe(9);

        expect(
            productosIniciales.map((producto) => [
                producto.codigo,
                producto.precio
            ])
        ).toEqual([
            ["GUANTES-001", 4401],
            ["DESTORNILLADOR-001", 6026],
            ["PINZA-001", 6426],
            ["ENCHUFE-001", 10282],
            ["MARTILLO-001", 16000],
            ["PALA-001", 21329],
            ["AMOLADORA-001", 50000],
            ["KIT-TAPONES-001", 55000],
            ["TALADRO-001", 79999]
        ]);
    });


    it("RC60 - el controlador importa los productos sin declararlos localmente", async function () {

        const respuesta = await fetch(
            new URL("../script.js", import.meta.url),
            { cache: "no-store" }
        );

        expect(respuesta.ok).toBeTrue();

        const codigo = await respuesta.text();

        const codigoNormalizado = codigo
            .replace(/\s/g, "")
            .replaceAll("'", '"');

        expect(codigoNormalizado).toContain(
            'import{productosIniciales}from"./data/productosIniciales.js"'
        );

        expect(codigoNormalizado).not.toContain(
            "constproductosIniciales="
        );

        expect(codigoNormalizado).not.toContain(
            "letproductosIniciales="
        );

        expect(codigoNormalizado).not.toContain(
            "varproductosIniciales="
        );
    });


    it("RC60 - renderiza correctamente los productos del módulo de datos", async function () {

        const { productosIniciales } = await import(
            "../data/productosIniciales.js"
        );

        const formateador = new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

        expect(codigosVisibles().length).toBe(9);
        expect(qa("#tabla-precios-cuerpo tr").length).toBe(9);
        expect(qa("#ofertas-productos article").length).toBe(3);

        for (const producto of productosIniciales) {

            const tarjeta = q(
                `#resultados-catalogo article[data-product-code="${producto.codigo}"]`
            );

            expect(tarjeta).not.toBeNull();

            expect(tarjeta.querySelector("h3").textContent)
                .toBe(producto.nombre);

            expect(tarjeta.textContent)
                .toContain(producto.categoria);

            expect(tarjeta.textContent)
                .toContain(producto.descripcion);

            expect(tarjeta.querySelector("strong").textContent)
                .toBe(formateador.format(producto.precio));
        }
    });

});


// ---------------------------------------------------------------------------
// Flujo 1: búsqueda y filtrado
// ---------------------------------------------------------------------------

describe("Controlador - Flujo 1: búsqueda y filtrado", function () {
    it("filtra por texto mientras se escribe", function () {
        escribir("#busqueda", "taladro");
        expect(codigosVisibles()).toEqual(["TALADRO-001"]);
        expect(texto("#catalogo-mensaje")).toBe("1 producto(s) encontrado(s).");
    });

    it("ignora mayúsculas y tildes", function () {
        escribir("#busqueda", "AMOLADORA");
        expect(codigosVisibles()).toEqual(["AMOLADORA-001"]);
        escribir("#busqueda", "inalámbric");
        expect(codigosVisibles()).toEqual(["AMOLADORA-001", "TALADRO-001"]);
    });

    it("muestra «Sin coincidencias.» cuando no hay resultados", function () {
        escribir("#busqueda", "zzzzzz");
        expect(codigosVisibles()).toEqual([]);
        expect(texto("#catalogo-mensaje")).toBe("Sin coincidencias.");
    });

    it("al enviar el formulario evita la recarga y aplica el filtro", function () {
        q("#busqueda").value = "pala";
        const evento = enviar("#form-busqueda");
        expect(evento.defaultPrevented).toBeTrue();
        expect(codigosVisibles()).toEqual(["PALA-001"]);
    });

    it("filtra por categoría", function () {
        elegir("#categoria", "Jardineria");
        expect(codigosVisibles()).toEqual(["PALA-001"]);
        elegir("#categoria", "Electricidad");
        expect(codigosVisibles()).toEqual(["ENCHUFE-001"]);
        elegir("#categoria", "");
        expect(codigosVisibles().length).toBe(9);
    });

    it("combina texto y categoría", function () {
        elegir("#categoria", "Herramientas manuales");
        escribir("#busqueda", "pinza");
        expect(codigosVisibles()).toEqual(["PINZA-001"]);
    });

    it("ordena por precio ascendente y descendente", function () {
        const asc = codigosVisibles();
        expect(asc[0]).toBe("GUANTES-001");
        expect(asc[asc.length - 1]).toBe("TALADRO-001");
        elegir("#orden", "desc");
        const desc = codigosVisibles();
        expect(desc[0]).toBe("TALADRO-001");
        expect(desc[desc.length - 1]).toBe("GUANTES-001");
    });

    it("activar el filtro de precio habilita el rango y actualiza el indicador", function () {
        const activar = q("#activar-filtro-precio");
        activar.checked = true;
        disparar(activar, "change");
        expect(q("#precio-hasta").disabled).toBeFalse();
        expect(texto("#precio-hasta-valor")).toMatch(/80\.000,00/);
        escribir("#precio-hasta", "10000");
        expect(texto("#precio-hasta-valor")).toMatch(/10\.000,00/);
        expect(codigosVisibles()).toEqual(["GUANTES-001", "DESTORNILLADOR-001", "PINZA-001"]);
    });

    it("desactivar el filtro de precio vuelve a mostrar todo", function () {
        const activar = q("#activar-filtro-precio");
        activar.checked = true;
        disparar(activar, "change");
        escribir("#precio-hasta", "5000");
        expect(codigosVisibles()).toEqual(["GUANTES-001"]);
        activar.checked = false;
        disparar(activar, "change");
        expect(q("#precio-hasta").disabled).toBeTrue();
        expect(texto("#precio-hasta-valor")).toBe("Sin limite");
        expect(codigosVisibles().length).toBe(9);
    });

    it("el menú de categorías filtra, limpia la búsqueda y evita la navegación", function () {
        escribir("#busqueda", "algo que no existe");
        const enlace = q('nav [data-categoria="Jardineria"]');
        const evento = new win.MouseEvent("click", { bubbles: true, cancelable: true });
        enlace.dispatchEvent(evento);
        expect(evento.defaultPrevented).toBeTrue();
        expect(q("#busqueda").value).toBe("");
        expect(q("#categoria").value).toBe("Jardineria");
        expect(codigosVisibles()).toEqual(["PALA-001"]);
        clic(q('nav [data-categoria=""]'));
        expect(codigosVisibles().length).toBe(9);
        
    });

    it("recupera los resultados al corregir una búsqueda sin coincidencias", function () {
    escribir("#busqueda", "producto-inexistente");

    expect(codigosVisibles()).toEqual([]);
    expect(texto("#catalogo-mensaje")).toBe("Sin coincidencias.");

    escribir("#busqueda", "taladro");

    expect(codigosVisibles()).toEqual(["TALADRO-001"]);
    expect(texto("#catalogo-mensaje"))
        .toBe("1 producto(s) encontrado(s).");

    escribir("#busqueda", "");

    expect(codigosVisibles().length).toBe(9);
    });

    it("recupera los productos al quitar un filtro de precio sin coincidencias", function () {
        elegir("#categoria", "Jardineria");

        const activar = q("#activar-filtro-precio");
        activar.checked = true;
        disparar(activar, "change");

        escribir("#precio-hasta", "10000");

        expect(codigosVisibles()).toEqual([]);
        expect(texto("#catalogo-mensaje")).toBe("Sin coincidencias.");

        activar.checked = false;
        disparar(activar, "change");

        expect(codigosVisibles()).toEqual(["PALA-001"]);
        expect(texto("#catalogo-mensaje"))
            .toBe("1 producto(s) encontrado(s).");

    });
});

// ---------------------------------------------------------------------------
// Flujo 2: carrito
// ---------------------------------------------------------------------------

describe("Controlador - Flujo 2: carrito", function () {
    it("agrega un producto desde el catálogo y actualiza contador, total y botón", function () {
        agregarAlCarrito("GUANTES-001");
        expect(texto("#contador-carrito")).toBe("1");
        expect(texto("#carrito-total")).toMatch(/4\.401,00/);
        expect(cantidadEnCarrito("GUANTES-001")).toBe("1");
        expect(q('[data-action="iniciar-compra"]').disabled).toBeFalse();
        expect(texto("#carrito-mensaje")).toBe("1 producto(s) en el carrito.");
        expect(texto("#estado-aplicacion")).toBe("Carrito actualizado.");
    });

    it("agrega un producto desde la sección de ofertas", function () {
        clic(q('#ofertas [data-action="agregar-carrito"][data-product-code="AMOLADORA-001"]'));
        expect(cantidadEnCarrito("AMOLADORA-001")).toBe("1");
        expect(texto("#carrito-total")).toMatch(/50\.000,00/);
    });

    it("agregar dos veces el mismo producto suma la cantidad y no duplica el ítem", function () {
        agregarAlCarrito("GUANTES-001");
        agregarAlCarrito("GUANTES-001");
        expect(cantidadEnCarrito("GUANTES-001")).toBe("2");
        expect(texto("#contador-carrito")).toBe("1");
        expect(texto("#carrito-total")).toMatch(/8\.802,00/);
    });

    it("suma varios productos distintos", function () {
        agregarAlCarrito("GUANTES-001");
        agregarAlCarrito("DESTORNILLADOR-001");
        expect(texto("#contador-carrito")).toBe("2");
        expect(texto("#carrito-total")).toMatch(/10\.427,00/);
    });

    it("cambia la cantidad y recalcula subtotal y total", function () {
        agregarAlCarrito("GUANTES-001");
        elegir(q('[data-action="cambiar-cantidad"]'), "3");
        expect(cantidadEnCarrito("GUANTES-001")).toBe("3");
        expect(texto("#carrito-total")).toMatch(/13\.203,00/);
        expect(texto("#carrito-items")).toMatch(/Subtotal: \$\s?13\.203,00/);
    });

    it("una cantidad inválida se marca en el campo sin modificar el carrito", function () {
        agregarAlCarrito("GUANTES-001");
        const control = q('[data-action="cambiar-cantidad"]');
        escribir(control, "0");
        expect(control.classList.contains("is-invalid")).toBeTrue();
        expect(texto("#error-cantidad-guantes-001"))
            .toBe("La cantidad debe ser un entero seguro mayor o igual a uno.");
        elegir(control, "0");
        expect(texto("#carrito-total")).toMatch(/4\.401,00/);
        expect(texto("#carrito-mensaje")).toMatch(/entero seguro mayor o igual a uno/);
    });

    it("una cantidad en notación científica se rechaza (no se interpreta como 100)", function () {
        agregarAlCarrito("GUANTES-001");
        elegir(q('[data-action="cambiar-cantidad"]'), "1e2");
        expect(texto("#carrito-total")).toMatch(/4\.401,00/);
        expect(texto("#carrito-total")).not.toMatch(/440\.100,00/);
    });


    it("una cantidad decimal se rechaza y deja el carrito igual", function () {
        agregarAlCarrito("GUANTES-001");

        const control = q(
            '[data-action="cambiar-cantidad"][data-product-code="GUANTES-001"]'
        );

        // Verifica el estado inicial.
        expect(cantidadEnCarrito("GUANTES-001")).toBe("1");
        expect(texto("#carrito-total")).toMatch(/4\.401,00/);

        // Intenta ingresar una cantidad decimal.
        control.value = "1.5";

        expect(control.value).toBe("1.5");

        disparar(control, "change");

        // La cantidad decimal debe rechazarse.
        expect(cantidadEnCarrito("GUANTES-001")).toBe("1");
        expect(texto("#carrito-total")).toMatch(/4\.401,00/);

        expect(
            q('[data-action="cambiar-cantidad"]').classList.contains("is-invalid")
        ).toBeTrue();
    });


    it("elimina un producto y vuelve al estado vacío", function () {
        agregarAlCarrito("GUANTES-001");
        clic(q('[data-action="eliminar-carrito"]'));
        expect(texto("#contador-carrito")).toBe("0");
        expect(qa("#carrito-items article").length).toBe(0);
        expect(texto("#carrito-mensaje")).toBe("El carrito esta vacio.");
        expect(q('[data-action="iniciar-compra"]').disabled).toBeTrue();
    });

    it("eliminar un producto conserva los demás", function () {
        agregarAlCarrito("GUANTES-001");
        agregarAlCarrito("PINZA-001");
        clic(q('[data-action="eliminar-carrito"][data-product-code="GUANTES-001"]'));
        expect(cantidadEnCarrito("GUANTES-001")).toBeNull();
        expect(cantidadEnCarrito("PINZA-001")).toBe("1");
        expect(texto("#carrito-total")).toMatch(/6\.426,00/);
    });

        // Trazabilidad - Flujo 2: validación y actualización
    it("valida la cantidad con input sin modificar el total hasta change", function () {
        agregarAlCarrito("GUANTES-001");

        const control = q(
            '[data-action="cambiar-cantidad"][data-product-code="GUANTES-001"]'
        );

        escribir(control, "2");

        expect(control.classList.contains("is-valid")).toBeTrue();
        expect(texto("#carrito-total")).toMatch(/4\.401,00/);

        elegir(control, "2");

        expect(cantidadEnCarrito("GUANTES-001")).toBe("2");
        expect(texto("#carrito-total")).toMatch(/8\.802,00/);
    });

    // Trazabilidad - Flujo 2: invalidación del pago
    it("modificar la cantidad después de elegir el pago invalida la confirmación", function () {
        irAConfirmacion("tarjeta", "3");

        expect(q("#confirmacion").hidden).toBeFalse();

        const cantidad = q(
            '[data-action="cambiar-cantidad"][data-product-code="GUANTES-001"]'
        );

        elegir(cantidad, "2");

        expect(cantidadEnCarrito("GUANTES-001")).toBe("2");
        expect(q("#pago").hidden).toBeTrue();
        expect(q("#confirmacion").hidden).toBeTrue();
        expect(texto("#condiciones-pago")).toBe("");
        expect(texto("#carrito-mensaje"))
            .toBe("Carrito actualizado; el pago debe seleccionarse nuevamente.");
    });

});

// ---------------------------------------------------------------------------
// Flujo 3: pago y cuotas
// ---------------------------------------------------------------------------

describe("Controlador - Flujo 3: pago y cuotas", function () {
    it("iniciar la compra muestra la sección de pago y el indicador de carga", function () {
        irAlPago();
        expect(q("#pago").hidden).toBeFalse();
        expect(texto("#pago-mensaje")).toBe("Selecciona el metodo de pago.");
        expect(texto("#estado-aplicacion")).toBe("Preparando el pago...");
        expect(q("#estado-aplicacion").classList.contains("is-loading")).toBeTrue();
        expect(q("#cuotas").disabled).toBeTrue();
        expect(q("#cuotas").value).toBe("");
    });

    it("al cerrarse el carrito el indicador pasa a «Pago listo para completar.»", async function () {
        irAlPago();
        q("#carrito").dispatchEvent(new win.Event("hidden.bs.offcanvas"));
        await pausa(1100);
        expect(texto("#estado-aplicacion")).toBe("Pago listo para completar.");
        expect(q("#estado-aplicacion").classList.contains("is-loading")).toBeFalse();
    });

    it("efectivo o transferencia: una cuota y sin recargo", function () {
        irAlPago();
        elegir("#metodo-pago", "efectivo-transferencia");
        const condiciones = texto("#condiciones-pago");
        expect(condiciones).toMatch(/Total original\s*\$\s?4\.401,00/);
        expect(condiciones).toMatch(/Cuotas\s*1/);
        expect(condiciones).toMatch(/0% \(\$\s?0,00\)/);
        expect(condiciones).toMatch(/Total financiado\s*\$\s?4\.401,00/);
        expect(texto("#pago-mensaje")).toBe("Condiciones calculadas. Revisa el resumen antes de continuar.");
        expect(q("#cuotas").disabled).toBeTrue();
    });

    it("tarjeta en 3 cuotas aplica 10 % de recargo", function () {
        irAlPago();
        elegir("#metodo-pago", "tarjeta");
        expect(q("#cuotas").disabled).toBeFalse();
        elegir("#cuotas", "3");
        const condiciones = texto("#condiciones-pago");
        expect(condiciones).toMatch(/Cuotas\s*3/);
        expect(condiciones).toMatch(/10% \(\$\s?440,10\)/);
        expect(condiciones).toMatch(/Total financiado\s*\$\s?4\.841,10/);
        expect(condiciones).toMatch(/Valor de cada cuota\s*\$\s?1\.613,70/);
    });

    it("tarjeta en 6 cuotas aplica 20 % de recargo", function () {
        irAlPago();
        elegir("#metodo-pago", "tarjeta");
        elegir("#cuotas", "6");
        const condiciones = texto("#condiciones-pago");
        expect(condiciones).toMatch(/20% \(\$\s?880,20\)/);
        expect(condiciones).toMatch(/Total financiado\s*\$\s?5\.281,20/);
        expect(condiciones).toMatch(/Valor de cada cuota\s*\$\s?880,20/);
    });

    it("cambiar las cuotas recalcula y avisa que hay que revisar las condiciones", function () {
        irAlPago();
        elegir("#metodo-pago", "tarjeta");
        elegir("#cuotas", "3");
        expect(texto("#pago-mensaje"))
            .toBe("Cambiaste las cuotas. Revisá las condiciones y continuá nuevamente.");
    });

    it("volver a efectivo deshabilita las cuotas y las reinicia a 1", function () {
        irAlPago();
        elegir("#metodo-pago", "tarjeta");
        elegir("#cuotas", "6");
        elegir("#metodo-pago", "efectivo-transferencia");
        expect(q("#cuotas").disabled).toBeTrue();
        expect(q("#cuotas").value).toBe("1");
        expect(texto("#condiciones-pago")).toMatch(/Cuotas\s*1/);
    });

    it("continuar sin elegir método muestra el error y no avanza", function () {
        irAlPago();
        enviar("#form-pago");
        expect(texto("#pago-mensaje")).toBe("El metodo de pago no es valido.");
        expect(q("#metodo-pago").classList.contains("is-invalid")).toBeTrue();
        expect(q("#confirmacion").hidden).toBeTrue();
    });

    it("continuar con un método válido habilita los datos del cliente", function () {
        irAConfirmacion();
        expect(q("#confirmacion").hidden).toBeFalse();
        expect(texto("#pedido-mensaje")).toBe("Completa tus datos para revisar el pedido.");
    });

    it("un cambio en el carrito descarta el pago anterior", function () {
        irAConfirmacion("tarjeta", "3");
        agregarAlCarrito("PINZA-001");
        expect(q("#pago").hidden).toBeTrue();
        expect(q("#confirmacion").hidden).toBeTrue();
        expect(texto("#condiciones-pago")).toBe("");
        expect(texto("#carrito-mensaje"))
            .toBe("Carrito actualizado; el pago debe seleccionarse nuevamente.");
    });

    it("cancelar el pago oculta la sección y conserva el carrito", function () {
        irAConfirmacion();
        clic(q('[data-action="cancelar-pago"]'));
        expect(q("#pago").hidden).toBeTrue();
        expect(q("#confirmacion").hidden).toBeTrue();
        expect(cantidadEnCarrito("GUANTES-001")).toBe("1");
        expect(texto("#carrito-mensaje")).toBe("Pago cancelado. El carrito se conserva.");
    });

    // Trazabilidad - Flujo 3: tarjeta en una cuota
    it("tarjeta en una cuota no aplica recargo", function () {
        irAlPago();

        elegir("#metodo-pago", "tarjeta");
        elegir("#cuotas", "1");

        const condiciones = texto("#condiciones-pago");

        expect(q("#cuotas").disabled).toBeFalse();
        expect(condiciones).toMatch(/Cuotas\s*1/);
        expect(condiciones).toMatch(/0% \(\$\s?0,00\)/);
        expect(condiciones).toMatch(/Total financiado\s*\$\s?4\.401,00/);
    });

    // Trazabilidad - Flujo 3: cambio de método después de continuar
    it("cambiar el método de pago invalida la confirmación anterior", function () {
        irAConfirmacion("tarjeta", "3");

        expect(q("#confirmacion").hidden).toBeFalse();

        elegir("#metodo-pago", "efectivo-transferencia");

        expect(q("#cuotas").disabled).toBeTrue();
        expect(q("#cuotas").value).toBe("1");
        expect(q("#confirmacion").hidden).toBeTrue();
        expect(texto("#resumen-pedido")).toBe("");
        expect(texto("#condiciones-pago")).toMatch(/Cuotas\s*1/);
    });

});

// ---------------------------------------------------------------------------
// Flujo 4: datos del cliente y confirmación del pedido
// ---------------------------------------------------------------------------

describe("Controlador - Flujo 4: confirmación del pedido", function () {
    beforeEach(function () {
        irAConfirmacion();
    });
    
    // RC22 y RC59 - Validación individual durante la edición.
    it("RC59 - valida los campos del cliente durante input", function () {
        const casos = [
            ["nombre", "12345"],
            ["correo", "correo-invalido"],
            ["direccion", "   "]
        ];

        for (const [campo, valor] of casos) {
            const control = escribir(`#pedido-${campo}`, valor);

            expect(control.classList.contains("is-invalid")).toBeTrue();
            expect(control.getAttribute("aria-invalid")).toBe("true");

            expect(texto(`#error-pedido-${campo}`))
                .toBe(`${campo} no es valido.`);
        }

        expect(qa("#resumen-pedido *").length).toBe(0);
    });


    // RC22 y RC59 - Validación al abandonar un campo.
    it("RC59 - valida los campos vacíos mediante focusout", function () {
        const campos = ["nombre", "correo", "direccion"];

        for (const campo of campos) {
            const control = q(`#pedido-${campo}`);

            expect(control.value).toBe("");
            expect(control.classList.contains("is-invalid")).toBeFalse();

            disparar(control, "focusout");

            expect(control.classList.contains("is-invalid")).toBeTrue();
            expect(control.getAttribute("aria-invalid")).toBe("true");

            expect(texto(`#error-pedido-${campo}`))
                .toBe(`${campo} no es valido.`);
        }

        expect(qa("#resumen-pedido *").length).toBe(0);
    });


    // RC59 - Actualización del feedback al corregir los datos.
    it("RC59 - elimina los errores al corregir los datos del cliente", function () {
        const casos = [
            ["nombre", "12345", "Ana Pérez"],
            ["correo", "correo-invalido", "ana@correo.com"],
            ["direccion", "   ", "Calle Falsa 123"]
        ];

        for (const [campo, invalido, valido] of casos) {
            const control = escribir(`#pedido-${campo}`, invalido);

            expect(control.classList.contains("is-invalid")).toBeTrue();

            escribir(control, valido);

            expect(control.classList.contains("is-invalid")).toBeFalse();
            expect(control.classList.contains("is-valid")).toBeTrue();
            expect(control.getAttribute("aria-invalid")).toBe("false");
            expect(texto(`#error-pedido-${campo}`)).toBe("");
        }
    });


    // RC59 - Independencia entre los campos del formulario.
    it("RC59 - valida cada campo independientemente de los demás", function () {
        const correo = escribir("#pedido-correo", "ñandú@correo.com");

        expect(q("#pedido-nombre").value).toBe("");
        expect(q("#pedido-direccion").value).toBe("");

        expect(correo.classList.contains("is-valid")).toBeTrue();
        expect(correo.getAttribute("aria-invalid")).toBe("false");
        expect(texto("#error-pedido-correo")).toBe("");

        expect(q("#pedido-nombre").classList.contains("is-invalid"))
            .toBeFalse();

        expect(q("#pedido-direccion").classList.contains("is-invalid"))
            .toBeFalse();
    });


    // RC59 - Conservación del resumen al perder el foco.
    it("RC59 - perder el foco sin modificar datos conserva el resumen", function () {
        completarCliente();
        enviar("#form-pedido");

        const resumenAnterior = texto("#resumen-pedido");

        expect(q('[data-action="confirmar-pedido"]')).not.toBeNull();

        disparar(q("#pedido-nombre"), "focusout");

        expect(texto("#resumen-pedido")).toBe(resumenAnterior);
        expect(q('[data-action="confirmar-pedido"]')).not.toBeNull();
    });


    // RC59 - Conservación del estado de la compra.
    it("RC59 - validar los datos no modifica el carrito, pago ni storage", function () {
        const totalAnterior = texto("#carrito-total");
        const contadorAnterior = texto("#contador-carrito");
        const condicionesAnteriores = texto("#condiciones-pago");

        const localAnterior = instantanea(win.localStorage);
        const sessionAnterior = instantanea(win.sessionStorage);

        escribir("#pedido-nombre", "12345");
        escribir("#pedido-correo", "correo-invalido");
        disparar(q("#pedido-direccion"), "focusout");

        expect(texto("#carrito-total")).toBe(totalAnterior);
        expect(texto("#contador-carrito")).toBe(contadorAnterior);
        expect(texto("#condiciones-pago")).toBe(condicionesAnteriores);

        expect(instantanea(win.localStorage)).toEqual(localAnterior);
        expect(instantanea(win.sessionStorage)).toEqual(sessionAnterior);
    });


    // RC59 - Compatibilidad con la cancelación del pedido.
    it("RC59 - cancelar el pedido elimina los estados de validación", function () {
        escribir("#pedido-nombre", "12345");
        escribir("#pedido-correo", "correo-invalido");
        disparar(q("#pedido-direccion"), "focusout");

        clic(q('[data-action="cancelar-pedido"]'));

        expect(q("#confirmacion").hidden).toBeTrue();

        for (const campo of ["nombre", "correo", "direccion"]) {
            const control = q(`#pedido-${campo}`);

            expect(control.value).toBe("");
            expect(control.classList.contains("is-invalid")).toBeFalse();
            expect(control.classList.contains("is-valid")).toBeFalse();
            expect(control.hasAttribute("aria-invalid")).toBeFalse();
            expect(texto(`#error-pedido-${campo}`)).toBe("");
        }

        // No debe volver a validar un formulario oculto.
        disparar(q("#pedido-nombre"), "focusout");

        expect(q("#pedido-nombre").classList.contains("is-invalid"))
            .toBeFalse();

        expect(texto("#error-pedido-nombre")).toBe("");

        // Comprueba que se puede volver al formulario sin errores.
        enviar("#form-pago");

        expect(q("#confirmacion").hidden).toBeFalse();
        expect(qa("#form-pedido .is-invalid").length).toBe(0);
    });

    it("valida el nombre al enviar el formulario", function () {
        completarCliente();
        escribir("#pedido-nombre", "12345");
        enviar("#form-pedido");

        expect(q("#pedido-nombre").classList.contains("is-invalid")).toBeTrue();
        expect(texto("#error-pedido-nombre")).toBe("nombre no es valido.");
        expect(qa("#resumen-pedido *").length).toBe(0);

        escribir("#pedido-nombre", "Ana Pérez");
        enviar("#form-pedido");

        expect(q('#resumen-pedido [data-action="confirmar-pedido"]'))
            .not.toBeNull();
    });

    it("valida el correo al enviar el formulario", function () {
        completarCliente();

        escribir("#pedido-correo", "ana@correo");
        enviar("#form-pedido");

        expect(q("#pedido-correo").classList.contains("is-invalid")).toBeTrue();
        expect(texto("#error-pedido-correo")).toBe("correo no es valido.");
        expect(qa("#resumen-pedido *").length).toBe(0);

        escribir("#pedido-correo", "ana@correo.com");
        enviar("#form-pedido");

        expect(q('#resumen-pedido [data-action="confirmar-pedido"]'))
            .not.toBeNull();
        expect(texto("#resumen-pedido")).toContain("ana@correo.com");
    });

    it("acepta correos con caracteres no ASCII", function () {
        completarCliente("Ana Pérez", "ñandú@correo.com", "Calle Falsa 123");

        enviar("#form-pedido");

        expect(q('#resumen-pedido [data-action="confirmar-pedido"]'))
            .not.toBeNull();
        expect(texto("#resumen-pedido")).toContain("ñandú@correo.com");
    });

    it("valida la dirección al enviar el formulario", function () {
        completarCliente();
        escribir("#pedido-direccion", "   ");

        enviar("#form-pedido");

        expect(q("#pedido-direccion").classList.contains("is-invalid"))
            .toBeTrue();
        expect(texto("#error-pedido-direccion")).toBe("direccion no es valido.");
        expect(qa("#resumen-pedido *").length).toBe(0);

        escribir("#pedido-direccion", "Calle Falsa 123");
        enviar("#form-pedido");

        expect(q('#resumen-pedido [data-action="confirmar-pedido"]'))
            .not.toBeNull();
    });

    it("enviar con campos vacíos muestra el error y no genera resumen", function () {
        enviar("#form-pedido");
        expect(texto("#pedido-mensaje")).toBe("nombre no es valido.");
        expect(qa("#resumen-pedido *").length).toBe(0);
        expect(q("#pedido-nombre").classList.contains("is-invalid")).toBeTrue();
    });

    it("enviar con datos válidos genera el resumen previo con el botón de confirmar", function () {
        completarCliente();
        enviar("#form-pedido");
        const resumen = texto("#resumen-pedido");
        expect(resumen).toMatch(/Resumen del pedido/);
        expect(resumen).toMatch(/Cliente: Ana Pérez · ana@correo\.com · Envio a: Calle Falsa 123/);
        expect(resumen).toMatch(/1 x \$\s?4\.401,00 = \$\s?4\.401,00/);
        expect(q('#resumen-pedido [data-action="confirmar-pedido"]')).not.toBeNull();
        expect(texto("#pedido-mensaje")).toBe("Revisa el resumen y confirma o cancela el pedido.");
    });

    it("modificar los datos después del resumen lo invalida", function () {
        completarCliente();
        enviar("#form-pedido");
        escribir("#pedido-nombre", "Ana María Pérez");
        expect(qa("#resumen-pedido *").length).toBe(0);
        expect(texto("#pedido-mensaje"))
            .toBe("Los datos del cliente cambiaron. Revisá nuevamente el resumen antes de confirmar.");
    });

    it("confirmar muestra el número de pedido y limpia carrito y pago", function () {
        completarCliente();
        enviar("#form-pedido");
        clic(q('[data-action="confirmar-pedido"]'));
        expect(texto("#resumen-pedido")).toMatch(/^Pedido confirmado: FL-\d+-0001/);
        expect(q('#resumen-pedido [data-action="confirmar-pedido"]')).toBeNull();
        expect(texto("#pedido-mensaje")).toBe("La operacion se realizo correctamente.");
        expect(texto("#contador-carrito")).toBe("0");
        expect(qa("#carrito-items article").length).toBe(0);
        expect(q("#pago").hidden).toBeTrue();
        expect(q("#form-pedido").hidden).toBeTrue();
    });

    it("una segunda compra obtiene la secuencia siguiente", function () {
        completarCliente();
        enviar("#form-pedido");
        clic(q('[data-action="confirmar-pedido"]'));
        irAConfirmacion();
        expect(q("#form-pedido").hidden).toBeFalse();
        completarCliente("Luis Gómez", "luis@correo.com", "Av. Siempreviva 742");
        enviar("#form-pedido");
        clic(q('[data-action="confirmar-pedido"]'));
        expect(texto("#resumen-pedido")).toMatch(/^Pedido confirmado: FL-\d+-0002/);
    });

    it("confirmar con tarjeta en 6 cuotas refleja el recargo en el resumen", function () {
        elegir("#metodo-pago", "tarjeta");
        elegir("#cuotas", "6");
        enviar("#form-pago");
        completarCliente();
        enviar("#form-pedido");
        expect(texto("#resumen-pedido")).toMatch(/6 cuota\(s\) · Recargo: 20%/);
        expect(texto("#resumen-pedido")).toMatch(/Total financiado: \$\s?5\.281,20/);
    });

    it("cancelar el pedido conserva el carrito y las condiciones de pago", function () {
        completarCliente();
        enviar("#form-pedido");
        clic(q('[data-action="cancelar-pedido"]'));
        expect(q("#confirmacion").hidden).toBeTrue();
        expect(q("#pedido-nombre").value).toBe("");
        expect(qa("#resumen-pedido *").length).toBe(0);
        expect(cantidadEnCarrito("GUANTES-001")).toBe("1");
        expect(q("#pago").hidden).toBeFalse();
        expect(texto("#pedido-mensaje"))
            .toBe("Pedido cancelado. Se conservaron el carrito y las condiciones de pago.");
    });


    // Trazabilidad - Flujo 4: corrección de datos inválidos
    it("permite corregir datos inválidos y generar el resumen", function () {
        enviar("#form-pedido");

        expect(qa("#resumen-pedido *").length).toBe(0);
        expect(q("#pedido-nombre").classList.contains("is-invalid"))
            .toBeTrue();

        completarCliente();

        enviar("#form-pedido");

        expect(q("#pedido-nombre").classList.contains("is-invalid"))
            .toBeFalse();

        expect(
            q('#resumen-pedido [data-action="confirmar-pedido"]')
        ).not.toBeNull();

        expect(texto("#resumen-pedido"))
            .toMatch(/Cliente: Ana Pérez/);
    });

    // Trazabilidad - Flujo 4: invalidación y regeneración del resumen
    it("impide confirmar datos modificados e inválidos hasta regenerar el resumen", function () {
        completarCliente();
        enviar("#form-pedido");

        expect(
            q('#resumen-pedido [data-action="confirmar-pedido"]')
        ).not.toBeNull();

        escribir("#pedido-correo", "correo-invalido");

        expect(qa("#resumen-pedido *").length).toBe(0);

        enviar("#form-pedido");

        expect(q("#pedido-correo").classList.contains("is-invalid"))
            .toBeTrue();
        expect(texto("#error-pedido-correo")).toBe("correo no es valido.");
        expect(qa("#resumen-pedido *").length).toBe(0);

        escribir("#pedido-correo", "ana@correo.com");
        enviar("#form-pedido");

        expect(
            q('#resumen-pedido [data-action="confirmar-pedido"]')
        ).not.toBeNull();

        expect(texto("#resumen-pedido"))
            .toMatch(/ana@correo\.com/);
    });

});

// ---------------------------------------------------------------------------
// Transversal
// ---------------------------------------------------------------------------

describe("Controlador - requisitos transversales", function () {
    it("una compra completa no usa alert(), prompt() ni confirm()", function () {
        llegarAlResumen();
        clic(q('[data-action="confirmar-pedido"]'));
        expect(espiaAlert).not.toHaveBeenCalled();
        expect(espiaPrompt).not.toHaveBeenCalled();
        expect(espiaConfirm).not.toHaveBeenCalled();
    });

    it("los flujos de búsqueda, carrito, pago y cancelaciones tampoco los usan", function () {
        escribir("#busqueda", "zzz");           // sin resultados: el catálogo se vuelve a dibujar sin tarjetas
        escribir("#busqueda", "");
        elegir("#categoria", "Jardineria");
        agregarAlCarrito("PALA-001");
        elegir(q('[data-action="cambiar-cantidad"]'), "0");
        clic(q('[data-action="eliminar-carrito"]'));
        elegir("#categoria", "");               // el catálogo ya no conserva las tarjetas filtradas
        irAConfirmacion();
        clic(q('[data-action="cancelar-pago"]'));
        expect(espiaAlert).not.toHaveBeenCalled();
        expect(espiaPrompt).not.toHaveBeenCalled();
        expect(espiaConfirm).not.toHaveBeenCalled();
    });

    it("no escribe en la consola durante una compra completa", function () {
        llegarAlResumen();
        clic(q('[data-action="confirmar-pedido"]'));
        expect(espiaConsoleLog).not.toHaveBeenCalled();
        expect(espiaConsoleError).not.toHaveBeenCalled();
    });

    it("una compra completa solo escribe claves de la app en localStorage y no toca sessionStorage", function () {
        llegarAlResumen();
        clic(q('[data-action="confirmar-pedido"]'));
        expect(instantanea(win.sessionStorage)).toEqual(storageAntes.session);
        const ajenas = Object.keys(instantanea(win.localStorage))
            .filter((clave) => !clave.startsWith("app:"))
            .filter((clave) => !(clave in storageAntes.local));
        expect(ajenas).toEqual([]);
        expect(Object.keys(instantanea(win.localStorage)).every(
            (clave) => CLAVES_STORAGE_PRUEBAS.includes(clave) || clave in storageAntes.local
        )).toBeTrue();
    });

    it("los eventos se registran con addEventListener, sin manejadores en línea", function () {
        expect(qa("[onclick],[onchange],[oninput],[onsubmit],[onkeyup]").length).toBe(0);
        expect(q('script[type="module"][src$="js/script.js"]')).not.toBeNull();
    });

    it("los mensajes de estado son regiones accesibles (role=status)", function () {
        for (const id of ["catalogo-mensaje", "carrito-mensaje", "pago-mensaje", "pedido-mensaje", "estado-aplicacion"]) {
            expect(q(`#${id}`).getAttribute("role")).toBe("status");
        }
    });

    it("los campos con error quedan asociados a su mensaje (aria-describedby / aria-invalid)", function () {
        irAConfirmacion();
        completarCliente();
        const correo = escribir("#pedido-correo", "mal");
        enviar("#form-pedido");                 // desde #167 el controlador valida al enviar, no al escribir
        expect(correo.getAttribute("aria-invalid")).toBe("true");
        const idMensaje = correo.getAttribute("aria-describedby");
        expect(q(`#${idMensaje}`).textContent).not.toBe("");
    });
});

// ---------------------------------------------------------------------------
// Persistencia del carrito (FachadaStorage → StorageUtil → localStorage)
// ---------------------------------------------------------------------------

describe("Controlador - persistencia del carrito en Web Storage", function () {
    const CLAVE_CARRITO = "app:carrito:items";

    it("guarda el carrito en localStorage al agregar un producto", function () {
        agregarAlCarrito("GUANTES-001");
        const guardado = JSON.parse(win.localStorage.getItem(CLAVE_CARRITO));
        expect(guardado.items.length).toBe(1);
        expect(guardado.items[0].codigo).toBe("GUANTES-001");
        expect(guardado.items[0].cantidad).toBe(1);
    });

    it("restaura el carrito al recargar la página", async function () {
        agregarAlCarrito("GUANTES-001");
        agregarAlCarrito("GUANTES-001");
        agregarAlCarrito("PALA-001");
        await recargarApp();
        expect(cantidadEnCarrito("GUANTES-001")).toBe("2");
        expect(cantidadEnCarrito("PALA-001")).toBe("1");
        expect(texto("#contador-carrito")).toBe("2");
        expect(q('[data-action="iniciar-compra"]').disabled).toBeFalse();
    });

    it("conserva los cambios de cantidad y las eliminaciones tras recargar", async function () {
        agregarAlCarrito("GUANTES-001");
        agregarAlCarrito("PALA-001");
        elegir(q('[data-action="cambiar-cantidad"][data-product-code="GUANTES-001"]'), "4");
        clic(q('[data-action="eliminar-carrito"][data-product-code="PALA-001"]'));
        await recargarApp();
        expect(cantidadEnCarrito("GUANTES-001")).toBe("4");
        expect(cantidadEnCarrito("PALA-001")).toBeNull();
    });

    it("al vaciar el carrito y recargar, la página arranca con el carrito vacío", async function () {
        agregarAlCarrito("GUANTES-001");
        clic(q('[data-action="eliminar-carrito"]'));
        await recargarApp();
        expect(texto("#contador-carrito")).toBe("0");
        expect(q('[data-action="iniciar-compra"]').disabled).toBeTrue();
    });

    it("inicia con el carrito vacío si el dato guardado está corrupto", async function () {
        agregarAlCarrito("GUANTES-001");
        win.localStorage.setItem(CLAVE_CARRITO, "{esto no es json");
        await recargarApp();
        expect(qa("#carrito-items [data-action='cambiar-cantidad']").length).toBe(0);
        expect(q('[data-action="iniciar-compra"]').disabled).toBeTrue();
    });

    it("inicia con el carrito vacío si el dato guardado tiene una estructura inválida", async function () {
        win.localStorage.setItem(CLAVE_CARRITO, JSON.stringify({ items: [{ codigo: "X", cantidad: -3 }] }));
        await recargarApp();
        expect(qa("#carrito-items [data-action='cambiar-cantidad']").length).toBe(0);
    });

    it("al confirmar un pedido el carrito queda vacío también después de recargar", async function () {
        llegarAlResumen();
        clic(q('[data-action="confirmar-pedido"]'));
        await recargarApp();
        expect(texto("#contador-carrito")).toBe("0");
    });

    it("no guarda nada en sessionStorage", function () {
        agregarAlCarrito("GUANTES-001");
        expect(instantanea(win.sessionStorage)).toEqual({});
    });
});

// ---------------------------------------------------------------------------
// Casos borde: carrito vacío, acciones repetidas y errores de storage
// ---------------------------------------------------------------------------

describe("Controlador - casos borde", function () {
    describe("carrito vacío", function () {
        it("no permite iniciar la compra y no muestra la sección de pago", function () {
            iniciarCompra();
            expect(q("#pago").hidden).toBeTrue();
            expect(q('[data-action="iniciar-compra"]').disabled).toBeTrue();
        });

        it("enviar el formulario de pago sin productos avisa y no abre la confirmación", function () {
            enviar("#form-pago");
            expect(texto("#pago-mensaje")).toBe("No hay productos para pagar.");
            expect(q("#confirmacion").hidden).toBeTrue();
        });

        it("el pedido no se puede enviar sin haber elegido un pago", function () {
            enviar("#form-pedido");
            expect(qa("#resumen-pedido *").length).toBe(0);
        });

        it("vaciar el carrito en medio del pago descarta las condiciones calculadas", function () {
            irAConfirmacion();
            clic(q('[data-action="eliminar-carrito"]'));
            expect(texto("#contador-carrito")).toBe("0");
            expect(q("#pago").hidden).toBeTrue();
            expect(q("#confirmacion").hidden).toBeTrue();
            expect(texto("#condiciones-pago")).toBe("");
        });
    });

    describe("acciones repetidas", function () {
        it("enviar dos veces el formulario de pago deja una sola confirmación abierta", function () {
            irAlPago();
            elegir("#metodo-pago", "efectivo-transferencia");
            enviar("#form-pago");
            enviar("#form-pago");
            expect(q("#confirmacion").hidden).toBeFalse();
            expect(qa("#condiciones-pago dl").length).toBe(1);
        });

        it("generar el resumen dos veces no duplica el botón de confirmar", function () {
            irAConfirmacion();
            completarCliente();
            enviar("#form-pedido");
            enviar("#form-pedido");
            expect(qa('#resumen-pedido [data-action="confirmar-pedido"]').length).toBe(1);
        });

        it("confirmar dos veces el mismo pedido muestra un único número de pedido", function () {
            llegarAlResumen();
            const boton = q('[data-action="confirmar-pedido"]');
            clic(boton);
            clic(boton);
            expect(texto("#resumen-pedido")).toMatch(/^Pedido confirmado: FL-\d+-0001/);
            expect(texto("#contador-carrito")).toBe("0");
        });

        it("cancelar dos veces el pedido no cambia el estado", function () {
            llegarAlResumen();
            clic(q('[data-action="cancelar-pedido"]'));
            clic(q('[data-action="cancelar-pedido"]'));
            expect(q("#confirmacion").hidden).toBeTrue();
            expect(cantidadEnCarrito("GUANTES-001")).toBe("1");
        });

        it("iniciar la compra dos veces seguidas no duplica el formulario de pago", function () {
            agregarAlCarrito("GUANTES-001");
            iniciarCompra();
            iniciarCompra();
            expect(q("#pago").hidden).toBeFalse();
            expect(qa("#form-pago").length).toBe(1);
        });
    });

    describe("errores del storage durante el uso", function () {
        let setItemOriginal;

        beforeEach(function () {
            setItemOriginal = win.Storage.prototype.setItem;
            win.Storage.prototype.setItem = function () {
                throw new win.DOMException("Cuota excedida", "QuotaExceededError");
            };
        });

        afterEach(function () {
            win.Storage.prototype.setItem = setItemOriginal;
        });

        it("sigue funcionando si guardar en localStorage falla por cuota y avisa al usuario", function () {
            agregarAlCarrito("GUANTES-001");
            expect(texto("#contador-carrito")).toBe("1");
            expect(cantidadEnCarrito("GUANTES-001")).toBe("1");
            expect(texto("#carrito-mensaje")).toMatch(/no pudo guardarse/);
        });

        it("completa una compra aunque el storage rechace las escrituras", function () {
            llegarAlResumen();
            clic(q('[data-action="confirmar-pedido"]'));
            expect(texto("#resumen-pedido")).toMatch(/^Pedido confirmado: FL-\d+-\d{4}/);
            expect(texto("#contador-carrito")).toBe("0");
        });
    });
});

describe("Controlador - eventos que no corresponden a una acción", function () {
    it("un clic en una zona sin acción no cambia nada", function () {
        irAConfirmacion();
        const estado = () => [texto("#contador-carrito"), q("#pago").hidden, q("#confirmacion").hidden,
            texto("#pago-mensaje"), texto("#pedido-mensaje")];
        const antes = estado();
        ["#catalogo", "#pago", "#confirmacion", "#carrito-items", "nav"].forEach((selector) => {
            const zona = q(selector);
            if (zona) clic(zona);
        });
        expect(estado()).toEqual(antes);
        expect(qa(".is-invalid").length).toBe(0);
    });

    it("un input o change en el panel del carrito que no viene de una cantidad se ignora", function () {
        agregarAlCarrito("GUANTES-001");
        const contenedor = q("#carrito-items");
        disparar(contenedor, "input");
        disparar(contenedor, "change");
        expect(cantidadEnCarrito("GUANTES-001")).toBe("1");
        expect(qa("#carrito-items .is-invalid").length).toBe(0);
    });
});

// ---------------------------------------------------------------------------
// Rutas defensivas y de error (QA: RC2, RC21, RC24)
//
// Cada test de esta sección ejercita un camino que antes no ejecutaba ninguna
// prueba. Los que necesitan una página alterada (sin elementos, con un control
// modificado) lo dicen en su nombre: el usuario puede alterar el DOM desde las
// herramientas del navegador y el controlador no debe romperse.
// ---------------------------------------------------------------------------

describe("Controlador - rutas defensivas y de error", function () {
    /** Inyecta un botón con data-action dentro de un contenedor de la página. */
    function inyectarBoton(contenedor, accion) {
        const boton = doc.createElement("button");
        boton.type = "button";
        boton.dataset.action = accion;
        contenedor.append(boton);
        return boton;
    }

    /**
     * Abre una copia de index.html a la que se le quitó algo, en un iframe con
     * srcdoc (mismo origen). Antes de cargar script.js se registran los errores
     * y los console.error de esa página.
     */
    async function abrirAppModificada(modificar) {
        const html = await (await fetch(URL_APP)).text();
        const pagina = new DOMParser().parseFromString(html, "text/html");
        modificar(pagina);
        const base = pagina.createElement("base");
        base.href = URL_APP;
        const registro = pagina.createElement("script");
        registro.textContent =
            "window.__errores = []; window.__logs = [];" +
            "addEventListener('error', (e) => { __errores.push(String(e.message)); e.preventDefault(); });" +
            "console.error = (...a) => __logs.push(a.join(' '));";
        pagina.head.prepend(registro);
        pagina.head.prepend(base);

        const iframe = document.createElement("iframe");
        iframe.title = "app-modificada";
        iframe.style.cssText = "position:fixed;left:-10000px;top:0;width:1280px;height:900px;border:0;";
        const cargado = new Promise((resolve) => iframe.addEventListener("load", resolve, { once: true }));
        iframe.srcdoc = "<!doctype html>" + pagina.documentElement.outerHTML;
        document.body.append(iframe);
        await cargado;
        await pausa(50);
        return iframe;
    }

    it("confirmar sin pedido pendiente avisa y no confirma nada (RC24)", function () {
        irAConfirmacion();
        // El botón real solo existe dentro del resumen, que no se generó todavía:
        // se inyecta uno con la misma acción para disparar la guardia de confirmarPedido().
        clic(inyectarBoton(q("#confirmacion"), "confirmar-pedido"));

        expect(texto("#pedido-mensaje")).toBe("Revisa los datos y genera el resumen antes de confirmar.");
        expect(q("#pedido-mensaje").classList).toContain("text-danger");
        expect(q("#resumen-pedido").textContent.trim()).toBe("");
        expect(cantidadEnCarrito("GUANTES-001")).toBe("1");
    });

    it("una acción desconocida dentro del panel del carrito se ignora", function () {
        agregarAlCarrito("GUANTES-001");
        clic(inyectarBoton(q("#carrito"), "accion-que-no-existe"));
        expect(cantidadEnCarrito("GUANTES-001")).toBe("1");
        expect(q("#pago").hidden).toBeTrue();
    });

    it("una acción desconocida dentro de la confirmación se ignora", function () {
        llegarAlResumen();
        const antes = texto("#resumen-pedido");
        clic(inyectarBoton(q("#confirmacion"), "accion-que-no-existe"));
        expect(texto("#resumen-pedido")).toBe(antes);
        expect(q("#confirmacion").hidden).toBeFalse();
    });

    it("el cierre del carrito sin haber iniciado la compra no abre el pago", function () {
        agregarAlCarrito("GUANTES-001");
        disparar(q("#carrito"), "hidden.bs.offcanvas");
        expect(q("#pago").hidden).toBeTrue();
    });

    it("un input que no viene de un campo del formulario del pedido no descarta el resumen", function () {
        llegarAlResumen();
        disparar(q("#form-pedido"), "input");
        expect(q('#resumen-pedido [data-action="confirmar-pedido"]')).not.toBeNull();
    });

    it("si el reloj del sistema es inválido, confirmar muestra el error y permite reintentar", function () {
        llegarAlResumen();
        const reloj = spyOn(win.Date, "now").and.returnValue(-1);

        clic(q('#resumen-pedido [data-action="confirmar-pedido"]'));
        expect(texto("#pedido-mensaje")).toBe("La fecha o la secuencia no son validas.");
        expect(q("#pedido-mensaje").classList).toContain("text-danger");
        expect(q('#resumen-pedido [data-action="confirmar-pedido"]')).not.toBeNull();
        expect(cantidadEnCarrito("GUANTES-001")).toBe("1");

        reloj.and.callThrough();
        clic(q('#resumen-pedido [data-action="confirmar-pedido"]'));
        expect(texto("#resumen-pedido")).toMatch(/Pedido confirmado: FL-\d+-0001/);
    });

    it("con una cuota inexistente (opción agregada a mano) marca el campo de cuotas como inválido", function () {
        irAlPago();
        elegir("#metodo-pago", "tarjeta");
        const opcion = doc.createElement("option");
        opcion.value = "99";
        opcion.textContent = "99 cuotas";
        q("#cuotas").append(opcion);
        elegir("#cuotas", "99");
        enviar("#form-pago");

        expect(q("#cuotas").getAttribute("aria-invalid")).toBe("true");
        expect(q("#metodo-pago").getAttribute("aria-invalid")).not.toBe("true");
        expect(q("#pago-mensaje").classList).toContain("text-danger");
        expect(q("#confirmacion").hidden).toBeTrue();
    });

    it("un error inesperado al generar el resumen no se oculta como error de validación", function () {
        irAConfirmacion();
        const errores = [];
        const alError = (e) => { errores.push(e.message); e.preventDefault(); };
        win.addEventListener("error", alError);
        try {
            // El campo falla con un Error común (no TypeError ni RangeError): es un bug, no un dato inválido.
            Object.defineProperty(q("#pedido-nombre"), "value", {
                get() { throw new Error("fallo inesperado del campo"); }
            });
            enviar("#form-pedido");
        } finally {
            win.removeEventListener("error", alError);
        }
        expect(errores.some((m) => m.includes("fallo inesperado del campo"))).toBeTrue();
        expect(q("#resumen-pedido").textContent.trim()).toBe("");
    });

    it("con el filtro de precio alterado (control modificado a mano) muestra el error del modelo", function () {
        const casilla = q("#activar-filtro-precio");
        casilla.checked = true;
        disparar(casilla, "change");
        const control = q("#precio-hasta");
        control.type = "text";               // el usuario edita el HTML desde las herramientas del navegador
        control.value = "abc";
        disparar(control, "input");

        expect(q("#catalogo-mensaje").classList).toContain("text-danger");
        expect(texto("#catalogo-mensaje")).not.toBe("");
        expect(control.getAttribute("aria-invalid")).toBe("true");
    });

    it("una página a la que le falta un elemento obligatorio avisa y no registra eventos", async function () {
        const iframe = await abrirAppModificada((pagina) => pagina.querySelector("#form-pago").remove());
        try {
            const ventana = iframe.contentWindow;
            expect(ventana.__logs.some((l) => l.includes("No se encontró el elemento requerido: #form-pago"))).toBeTrue();
            expect(ventana.__errores.some((m) => m.includes("Faltan elementos obligatorios: formPago"))).toBeTrue();
            // Como la inicialización se detuvo, el catálogo no se dibujó.
            expect(iframe.contentDocument.querySelectorAll("#resultados-catalogo article").length).toBe(0);
        } finally {
            iframe.remove();
        }
    });

    it("una página sin el elemento opcional #estado-aplicacion funciona igual", async function () {
        const iframe = await abrirAppModificada((pagina) => pagina.querySelector("#estado-aplicacion").remove());
        try {
            const ventana = iframe.contentWindow;
            const documento = iframe.contentDocument;
            expect(ventana.__errores).toEqual([]);
            expect(ventana.__logs).toEqual([]);
            documento.querySelector('#catalogo [data-action="agregar-carrito"][data-product-code="GUANTES-001"]')
                .dispatchEvent(new ventana.MouseEvent("click", { bubbles: true }));
            expect(documento.querySelector("#contador-carrito").textContent.trim()).toBe("1");
            documento.querySelector('[data-action="iniciar-compra"]')
                .dispatchEvent(new ventana.MouseEvent("click", { bubbles: true }));
            // Sin #estado-aplicacion, el aviso de carga se muestra en el mensaje del carrito.
            expect(documento.querySelector("#carrito-mensaje").textContent).toContain("Preparando el pago");
        } finally {
            iframe.remove();
        }
    });

    it("script.js se carga como módulo diferido: por eso nunca se ejecuta con el documento en 'loading'", async function () {
        // Justifica la rama `document.readyState === "loading"` del final de script.js (código defensivo
        // para una carga con <script> clásico): con type="module" y sin async, el navegador espera a que
        // termine el análisis del HTML, así que la rama de DOMContentLoaded no puede ejecutarse desde index.html.
        const html = await (await fetch(URL_APP)).text();
        const pagina = new DOMParser().parseFromString(html, "text/html");
        const etiqueta = pagina.querySelector('script[src$="js/script.js"]');
        expect(etiqueta).not.toBeNull();
        expect(etiqueta.type).toBe("module");
        expect(etiqueta.hasAttribute("async")).toBeFalse();
    });
});
