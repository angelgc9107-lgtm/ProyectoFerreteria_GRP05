/**
 * Pruebas de Fetch, procesamiento del catálogo e integración de carga en el DOM.
 * Se ejecuta como módulo ES desde test-runner.html; la red se sustituye por dobles.
 */
import {
    URL_CATALOGO,
    ErrorApi,
    obtenerJson,
    obtenerCatalogoRemoto,
    cargarCatalogo
} from "../api/apiService.js";
import {
    filtrarValidos,
    construirProductos,
    resumirCatalogo,
    agruparPorCategoria
} from "../services/ProcesadorCatalogo.js";
import { Producto } from "../models/Producto.js";
import { Catalogo } from "../models/Catalogo.js";
import { FachadaStorage } from "../services/FachadaStorage.js";
import { CLAVES } from "../utils/storage.js";

const { describe, it, expect, beforeEach, afterEach, spyOn } = globalThis;

const URL_APP = new URL("../../index.html", import.meta.url).href;
let cacheOriginal;
const registro = (cambios = {}) => ({
    codigo: "TAL-01",
    nombre: "Taladro",
    categoria: "Herramientas",
    descripcion: "Taladro percutor",
    precio: 100,
    ...cambios
});

beforeEach(function () {
    cacheOriginal = localStorage.getItem(CLAVES.CACHE_CATALOGO);
    localStorage.removeItem(CLAVES.CACHE_CATALOGO);
});

afterEach(function () {
    if (cacheOriginal === null) localStorage.removeItem(CLAVES.CACHE_CATALOGO);
    else localStorage.setItem(CLAVES.CACHE_CATALOGO, cacheOriginal);
    cacheOriginal = null;
});

function respuesta(datos, { ok = true, status = 200, json } = {}) {
    return {
        ok,
        status,
        json: json ?? (() => Promise.resolve(datos))
    };
}

async function errorDe(promesa) {
    try {
        await promesa;
    } catch (error) {
        return error;
    }
    return null;
}

async function esperarHasta(condicion, descripcion, limiteMs = 5000) {
    const inicio = Date.now();
    while (!condicion()) {
        if (Date.now() - inicio > limiteMs) {
            throw new Error(`Tiempo agotado esperando ${descripcion}.`);
        }
        await new Promise((resolver) => setTimeout(resolver, 10));
    }
}

async function abrirAppControlada() {
    const html = await (await fetch(URL_APP)).text();
    const pagina = new DOMParser().parseFromString(html, "text/html");

    pagina.querySelectorAll('link[href^="https://"], script[src^="https://"]')
        .forEach((recurso) => recurso.remove());

    const base = pagina.createElement("base");
    base.href = URL_APP;
    pagina.head.prepend(base);

    const dobleFetch = pagina.createElement("script");
    dobleFetch.textContent =
        "window.__solicitudesCatalogo = [];" +
        "window.fetch = (url, opciones) => new Promise((resolve, reject) => {" +
        "window.__solicitudesCatalogo.push({ url, opciones, resolve, reject });" +
        "});";
    pagina.head.append(dobleFetch);

    const iframe = document.createElement("iframe");
    iframe.title = "integracion-api-bajo-prueba";
    iframe.style.cssText = "position:fixed;left:-10000px;top:0;width:1280px;height:900px;border:0;";
    const cargado = new Promise((resolver) => {
        iframe.addEventListener("load", resolver, { once: true });
    });
    iframe.srcdoc = "<!doctype html>" + pagina.documentElement.outerHTML;
    document.body.append(iframe);
    await cargado;
    await esperarHasta(
        () => iframe.contentWindow.__solicitudesCatalogo?.length > 0,
        "la primera solicitud de catálogo"
    );
    return iframe;
}

describe("apiService.obtenerJson", function () {
    it("rechaza categorías de ErrorApi no permitidas", function () {
        expect(() => new ErrorApi("desconocido", "mensaje")).toThrowError(RangeError);
    });

    it("comunica una función fetch no disponible como error de red", async function () {
        const error = await errorDe(obtenerJson("/catalogo.json", {
            fetchFn: null,
            reintentos: 0
        }));

        expect(error).toEqual(jasmine.any(ErrorApi));
        expect(error.tipo).toBe("red");
    });

    it("procesa el JSON exitoso y llama a fetch con URL, señal y cabecera Accept", async function () {
        const datos = { productos: [registro()] };
        const json = jasmine.createSpy("json").and.resolveTo(datos);
        const fetchFn = jasmine.createSpy("fetchFn").and.resolveTo(
            respuesta(null, { json })
        );

        const resultado = await obtenerJson("/catalogo.json", { fetchFn });

        expect(resultado).toEqual(datos);
        expect(fetchFn).toHaveBeenCalledOnceWith("/catalogo.json", jasmine.objectContaining({
            signal: jasmine.any(AbortSignal),
            headers: { Accept: "application/json" }
        }));
        expect(json).toHaveBeenCalledOnceWith();
    });

    it("comunica un HTTP 404 como ErrorApi y no procesa el cuerpo ni reintenta", async function () {
        const json = jasmine.createSpy("json");
        const fetchFn = jasmine.createSpy("fetchFn").and.resolveTo(
            respuesta(null, { ok: false, status: 404, json })
        );

        const error = await errorDe(obtenerJson("/ausente.json", {
            fetchFn,
            reintentos: 2,
            esperarFn: jasmine.createSpy("esperarFn").and.resolveTo()
        }));

        expect(error).toEqual(jasmine.any(ErrorApi));
        expect(error.tipo).toBe("http");
        expect(error.estado).toBe(404);
        expect(fetchFn).toHaveBeenCalledOnceWith(
            "/ausente.json",
            jasmine.any(Object)
        );
        expect(json).not.toHaveBeenCalled();
    });

    it("reintenta HTTP 5xx con espera creciente y comunica cada reintento", async function () {
        const fetchFn = jasmine.createSpy("fetchFn").and.resolveTo(
            respuesta(null, { ok: false, status: 503 })
        );
        const esperarFn = jasmine.createSpy("esperarFn").and.resolveTo();
        const alReintentar = jasmine.createSpy("alReintentar");

        const error = await errorDe(obtenerJson("/catalogo.json", {
            fetchFn,
            esperarFn,
            alReintentar,
            reintentos: 2,
            esperaBaseMs: 25
        }));

        expect(error.tipo).toBe("http");
        expect(error.estado).toBe(503);
        expect(fetchFn).toHaveBeenCalledTimes(3);
        expect(esperarFn).toHaveBeenCalledWith(25);
        expect(esperarFn).toHaveBeenCalledWith(50);
        expect(alReintentar).toHaveBeenCalledTimes(2);
        expect(alReintentar.calls.argsFor(0)[0]).toBe(1);
        expect(alReintentar.calls.argsFor(0)[1].tipo).toBe("http");
    });

    it("continúa los reintentos aunque falle el aviso al callback", async function () {
        const fetchFn = jasmine.createSpy("fetchFn").and.returnValues(
            Promise.resolve(respuesta(null, { ok: false, status: 503 })),
            Promise.resolve(respuesta({ disponible: true }))
        );
        const errorAviso = new Error("falló el aviso");
        const alReintentar = () => { throw errorAviso; };
        spyOn(console, "error");

        const resultado = await obtenerJson("/catalogo.json", {
            fetchFn,
            esperarFn: jasmine.createSpy("esperarFn").and.resolveTo(),
            reintentos: 1,
            alReintentar
        });

        expect(resultado).toEqual({ disponible: true });
        expect(fetchFn).toHaveBeenCalledTimes(2);
        expect(console.error).toHaveBeenCalledWith(
            "[apiService] Falló la función alReintentar.",
            errorAviso
        );
    });

    it("distingue un rechazo de red del error HTTP y reintenta el rechazo", async function () {
        const causa = new TypeError("sin conexión");
        const fetchFn = jasmine.createSpy("fetchFn").and.rejectWith(causa);

        const error = await errorDe(obtenerJson("/catalogo.json", {
            fetchFn,
            reintentos: 1
        }));

        expect(error).toEqual(jasmine.any(ErrorApi));
        expect(error.tipo).toBe("red");
        expect(error.estado).toBeNull();
        expect(error.causa).toBe(causa);
        expect(fetchFn).toHaveBeenCalledTimes(2);
    });

    it("clasifica como error de red una solicitud abortada por superar el tiempo límite", async function () {
        const fetchFn = jasmine.createSpy("fetchFn").and.callFake((_url, { signal }) =>
            new Promise((_resolve, reject) => {
                signal.addEventListener("abort", () => {
                    const causa = new Error("solicitud abortada");
                    causa.name = "AbortError";
                    reject(causa);
                }, { once: true });
            })
        );

        const error = await errorDe(obtenerJson("/catalogo.json", {
            fetchFn,
            reintentos: 0,
            tiempoLimiteMs: 0
        }));

        expect(error.tipo).toBe("red");
        expect(error.causa.name).toBe("AbortError");
    });

    it("clasifica un cuerpo JSON ilegible como formato y no reintenta", async function () {
        const fetchFn = jasmine.createSpy("fetchFn").and.resolveTo(
            respuesta(null, {
                json: jasmine.createSpy("json").and.rejectWith(new SyntaxError("JSON inválido"))
            })
        );

        const error = await errorDe(obtenerJson("/catalogo.json", {
            fetchFn,
            reintentos: 2
        }));

        expect(error.tipo).toBe("formato");
        expect(fetchFn).toHaveBeenCalledTimes(1);
    });
});

describe("apiService.obtenerCatalogoRemoto y cargarCatalogo", function () {
    it("devuelve registros y aplica versión 1 cuando el JSON no declara una versión numérica", async function () {
        const fetchFn = jasmine.createSpy("fetchFn").and.resolveTo(
            respuesta({ productos: [registro()], version: "no-numérica" })
        );

        const resultado = await obtenerCatalogoRemoto({
            url: "/productos.json",
            fetchFn,
            reintentos: 0
        });

        expect(resultado).toEqual({ version: 1, registros: [registro()] });
        expect(fetchFn.calls.argsFor(0)[0]).toBe("/productos.json");
    });

    it("rechaza estructuras sin una colección productos", async function () {
        const fetchFn = jasmine.createSpy("fetchFn").and.resolveTo(respuesta({ items: [] }));

        const error = await errorDe(obtenerCatalogoRemoto({ fetchFn, reintentos: 0 }));

        expect(error).toEqual(jasmine.any(ErrorApi));
        expect(error.tipo).toBe("formato");
    });

    it("carga y procesa los registros válidos, resume el catálogo y guarda la caché", async function () {
        const datos = {
            productos: [
                registro(),
                registro({ codigo: "MAL", precio: -1 })
            ]
        };
        const fetchFn = jasmine.createSpy("fetchFn").and.resolveTo(respuesta(datos));

        const resultado = await cargarCatalogo({ fetchFn, reintentos: 0 });

        expect(resultado.origen).toBe("red");
        expect(resultado.error).toBeNull();
        expect(resultado.catalogo).toEqual(jasmine.any(Catalogo));
        expect(resultado.catalogo.obtenerProductos().map((producto) => producto.codigo))
            .toEqual(["TAL-01"]);
        expect(resultado.descartados).toEqual([
            { indice: 1, motivo: "precio inválido" }
        ]);
        expect(resultado.resumen).toEqual({
            total: 1,
            porCategoria: { Herramientas: 1 },
            precioMinimo: 100,
            precioMaximo: 100
        });
        expect(FachadaStorage.cargarCatalogo().obtenerProductos().map((producto) => producto.codigo))
            .toEqual(["TAL-01"]);
    });

    it("mantiene la carga remota aunque no pueda persistir la caché", async function () {
        const descriptor = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
        const storageLleno = {
            get length() { return 0; },
            key() { return null; },
            getItem() { return null; },
            setItem() {
                const error = new Error("storage lleno");
                error.name = "QuotaExceededError";
                throw error;
            },
            removeItem() {}
        };
        Object.defineProperty(globalThis, "localStorage", {
            configurable: true,
            get: () => storageLleno
        });
        spyOn(console, "error");
        try {
            const resultado = await cargarCatalogo({
                fetchFn: jasmine.createSpy("fetchFn").and.resolveTo(
                    respuesta({ productos: [registro()] })
                ),
                reintentos: 0
            });

            expect(resultado.origen).toBe("red");
            expect(resultado.error).toBeNull();
            expect(resultado.catalogo.obtenerProductos().length).toBe(1);
        } finally {
            Object.defineProperty(globalThis, "localStorage", descriptor);
        }
    });

    it("usa la caché tras un fallo HTTP y conserva el ErrorApi en el resultado", async function () {
        const cache = new Catalogo([new Producto(registro({ codigo: "CACHE-01" }))]);
        FachadaStorage.guardarCatalogo(cache);
        const fetchFn = jasmine.createSpy("fetchFn").and.resolveTo(
            respuesta(null, { ok: false, status: 404 })
        );
        spyOn(console, "error");

        const resultado = await cargarCatalogo({ fetchFn, reintentos: 2 });

        expect(fetchFn).toHaveBeenCalledTimes(1);
        expect(resultado.origen).toBe("cache");
        expect(resultado.catalogo.obtenerProductos().map((producto) => producto.codigo))
            .toEqual(["CACHE-01"]);
        expect(resultado.error.tipo).toBe("http");
        expect(resultado.error.estado).toBe(404);
    });

    it("usa el catálogo local ante un error HTTP sin caché y nunca presenta la respuesta fallida como exitosa", async function () {
        const json = jasmine.createSpy("json");
        const fetchFn = jasmine.createSpy("fetchFn").and.resolveTo(
            respuesta(null, { ok: false, status: 404, json })
        );
        spyOn(console, "error");
        localStorage.removeItem(CLAVES.CACHE_CATALOGO);

        const resultado = await cargarCatalogo({ fetchFn, reintentos: 2 });

        expect(fetchFn).toHaveBeenCalledTimes(1);
        expect(json).not.toHaveBeenCalled();
        expect(resultado.origen).toBe("local");
        expect(resultado.error.tipo).toBe("http");
        expect(resultado.catalogo.obtenerProductos().length).toBeGreaterThan(0);
    });

    it("usa el respaldo local con error de datos cuando la colección remota está vacía", async function () {
        const fetchFn = jasmine.createSpy("fetchFn").and.resolveTo(
            respuesta({ productos: [] })
        );
        spyOn(console, "error");
        localStorage.removeItem(CLAVES.CACHE_CATALOGO);

        const resultado = await cargarCatalogo({ fetchFn, reintentos: 0 });

        expect(resultado.origen).toBe("local");
        expect(resultado.error.tipo).toBe("datos");
        expect(resultado.catalogo.obtenerProductos().length).toBeGreaterThan(0);
    });
});

describe("ProcesadorCatalogo", function () {
    it("filtra datos inválidos y códigos repetidos conservando el primero", function () {
        const resultado = filtrarValidos([
            registro({ codigo: " TAL-01 " }),
            registro({ codigo: "tal-01" }),
            null,
            registro({ codigo: "SIN-PRECIO", precio: "100" }),
            registro({ codigo: "VACIO", categoria: " " }),
            registro({ codigo: "CAMPO-MAL", nombre: null })
        ]);

        expect(resultado.validos).toEqual([registro({ codigo: " TAL-01 " })]);
        expect(resultado.descartados).toEqual([
            { indice: 1, motivo: "código repetido" },
            { indice: 2, motivo: "el registro no es un objeto" },
            { indice: 3, motivo: "precio inválido" },
            { indice: 4, motivo: "campo vacío: categoria" },
            { indice: 5, motivo: "campo inválido: nombre" }
        ]);
    });

    it("filtra colecciones vacías o no válidas sin lanzar y construye productos con campos normalizados", function () {
        expect(filtrarValidos([])).toEqual({ validos: [], descartados: [] });
        expect(filtrarValidos(null)).toEqual({ validos: [], descartados: [] });

        const productos = construirProductos([
            registro({
                codigo: " TAL-01 ",
                nombre: " Taladro ",
                categoria: " Herramientas ",
                descripcion: " Percutor ",
                precio: 0
            })
        ]);

        expect(productos.length).toBe(1);
        expect(productos[0]).toEqual(jasmine.any(Producto));
        expect(productos[0].toJSON()).toEqual(registro({
            codigo: "TAL-01",
            nombre: "Taladro",
            categoria: "Herramientas",
            descripcion: "Percutor",
            precio: 0
        }));
        expect(construirProductos([])).toEqual([]);
        expect(() => construirProductos([{}])).toThrowError(TypeError);
    });

    it("resume con reduce las cantidades y rango de precios, incluidos los casos vacío y unitario", function () {
        const productos = construirProductos([
            registro(),
            registro({ codigo: "MAR-02", categoria: "Herramientas", precio: 20 }),
            registro({ codigo: "PIN-03", categoria: "Pinturas", precio: 50 })
        ]);

        expect(resumirCatalogo(productos)).toEqual({
            total: 3,
            porCategoria: { Herramientas: 2, Pinturas: 1 },
            precioMinimo: 20,
            precioMaximo: 100
        });
        expect(resumirCatalogo([])).toEqual({
            total: 0,
            porCategoria: {},
            precioMinimo: null,
            precioMaximo: null
        });
        expect(resumirCatalogo(productos.slice(0, 1))).toEqual({
            total: 1,
            porCategoria: { Herramientas: 1 },
            precioMinimo: 100,
            precioMaximo: 100
        });
    });

    it("agrupa por categoría y devuelve un objeto vacío para una colección vacía", function () {
        const productos = construirProductos([
            registro(),
            registro({ codigo: "MAR-02", nombre: "Martillo" })
        ]);
        const grupos = agruparPorCategoria(productos);

        expect(grupos.Herramientas).toEqual(productos);
        expect(agruparPorCategoria([])).toEqual({});
    });
});

describe("Integración asíncrona del catálogo con el DOM", function () {
    let iframe;
    let cacheAntes;
    let cachePreparada;

    beforeEach(function () {
        cacheAntes = localStorage.getItem(CLAVES.CACHE_CATALOGO);
        cachePreparada = true;
        localStorage.removeItem(CLAVES.CACHE_CATALOGO);
    });

    afterEach(function () {
        iframe?.remove();
        iframe = null;
        if (cachePreparada) {
            if (cacheAntes === null) localStorage.removeItem(CLAVES.CACHE_CATALOGO);
            else localStorage.setItem(CLAVES.CACHE_CATALOGO, cacheAntes);
        }
        cachePreparada = false;
    });

    it("mantiene el estado cargando hasta recibir datos y luego renderiza el catálogo remoto", async function () {
        iframe = await abrirAppControlada();
        const doc = iframe.contentDocument;
        const catalogo = doc.querySelector("#catalogo");
        const resultados = doc.querySelector("#resultados-catalogo");
        const mensaje = doc.querySelector("#catalogo-mensaje");

        expect(catalogo.dataset.catalogo).toBe("cargando");
        expect(catalogo.dataset.origen).toBeUndefined();
        expect(resultados.getAttribute("aria-busy")).toBe("true");
        expect(mensaje.classList.contains("is-loading")).toBeTrue();
        expect(doc.querySelector("#busqueda").disabled).toBeTrue();

        const llamada = iframe.contentWindow.__solicitudesCatalogo[0];
        expect(llamada.url).toBe(URL_CATALOGO);
        expect(llamada.opciones.headers).toEqual({ Accept: "application/json" });
        llamada.resolve(respuesta({ productos: [registro()] }));

        await esperarHasta(
            () => catalogo.dataset.catalogo === "disponible",
            "la disponibilidad del catálogo remoto"
        );
        expect(catalogo.dataset.origen).toBe("red");
        expect(resultados.getAttribute("aria-busy")).toBe("false");
        expect(doc.querySelectorAll("#resultados-catalogo article[data-product-code]").length).toBe(1);
        expect(doc.querySelector("#busqueda").disabled).toBeFalse();
        expect(mensaje.classList.contains("text-success")).toBeTrue();
        expect(mensaje.textContent).toContain("1 producto(s) cargado(s)");
    });

    it("muestra fallback y reintento tras HTTP 404, y recupera el render al reintentar", async function () {
        iframe = await abrirAppControlada();
        const doc = iframe.contentDocument;
        const catalogo = doc.querySelector("#catalogo");
        const resultados = doc.querySelector("#resultados-catalogo");
        const mensaje = doc.querySelector("#catalogo-mensaje");
        const reintentar = doc.querySelector("#reintentar-catalogo");

        iframe.contentWindow.__solicitudesCatalogo[0].resolve(
            respuesta(null, { ok: false, status: 404 })
        );
        await esperarHasta(
            () => catalogo.dataset.catalogo === "disponible",
            "el catálogo de respaldo"
        );

        expect(catalogo.dataset.origen).toBe("local");
        expect(resultados.getAttribute("aria-busy")).toBe("false");
        expect(doc.querySelectorAll("#resultados-catalogo article[data-product-code]").length).toBe(9);
        expect(doc.querySelector("#busqueda").disabled).toBeFalse();
        expect(mensaje.classList.contains("text-danger")).toBeTrue();
        expect(mensaje.textContent).toContain("No encontramos el catálogo");
        expect(reintentar.hidden).toBeFalse();

        reintentar.click();
        await esperarHasta(
            () => iframe.contentWindow.__solicitudesCatalogo.length === 2,
            "la solicitud de reintento"
        );
        expect(catalogo.dataset.catalogo).toBe("cargando");
        expect(resultados.getAttribute("aria-busy")).toBe("true");
        expect(doc.querySelector("#busqueda").disabled).toBeTrue();
        reintentar.click();
        expect(iframe.contentWindow.__solicitudesCatalogo.length).toBe(2);

        iframe.contentWindow.__solicitudesCatalogo[1].resolve(
            respuesta({ productos: [registro({ codigo: "RECUPERADO-01" })] })
        );
        await esperarHasta(
            () => catalogo.dataset.origen === "red",
            "la recuperación del catálogo remoto"
        );

        expect(doc.querySelectorAll("#resultados-catalogo article[data-product-code]").length).toBe(1);
        expect(mensaje.classList.contains("text-success")).toBeTrue();
        expect(reintentar.hidden).toBeTrue();
    });
});
