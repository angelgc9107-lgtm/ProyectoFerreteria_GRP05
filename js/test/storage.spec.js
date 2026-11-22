/**
 * @file Tests de la capa de storage (js/utils/storage.js).
 *
 * Spec: docs/03-specs/actividad-obligatoria-4/spec-tester-qa.md (sección storage.spec.js).
 *
 * Los tests NO tocan el localStorage ni el sessionStorage reales: antes de cada test se
 * reemplazan por un StorageFalso en memoria, que además permite forzar errores
 * (storage lleno, acceso denegado, borrado que no funciona). Solo el bloque final
 * «Web Storage real» usa el storage del navegador, y limpia lo que escribe.
 *
 * Se carga como módulo ES desde test-runner.html (<script type="module">).
 */
import { StorageUtil, CLAVES, PREFIJO_APP } from "../utils/storage.js";
import { Producto } from "../models/Producto.js";
import { Catalogo } from "../models/Catalogo.js";
import { Carrito } from "../models/Carrito.js";
import { Pago } from "../models/Pago.js";
import { Pedido } from "../models/Pedido.js";

/* ------------------------------------------------------------------ */
/* Dobles de prueba                                                    */
/* ------------------------------------------------------------------ */

/** Storage en memoria con ganchos para simular fallos. */
class StorageFalso {
    constructor() {
        this.datos = new Map();
        /** Error que lanza setItem (p. ej. QuotaExceededError). */
        this.errorEnSetItem = null;
        /** Error que lanza removeItem. */
        this.errorEnRemoveItem = null;
        /** Si es true, removeItem no borra nada (simula un storage defectuoso). */
        this.removeItemIgnorado = false;
    }
    get length() { return this.datos.size; }
    key(indice) { return [...this.datos.keys()][indice] ?? null; }
    getItem(clave) { return this.datos.has(clave) ? this.datos.get(clave) : null; }
    setItem(clave, valor) {
        if (this.errorEnSetItem) throw this.errorEnSetItem;
        this.datos.set(clave, String(valor));
    }
    removeItem(clave) {
        if (this.errorEnRemoveItem) throw this.errorEnRemoveItem;
        if (!this.removeItemIgnorado) this.datos.delete(clave);
    }
    clear() { this.datos.clear(); }
}

/** Clase mínima con el contrato toJSON()/fromJSON() de js/models/. */
class Modelo {
    constructor(nombre) {
        if (typeof nombre !== "string" || nombre.trim() === "") {
            throw new TypeError("nombre inválido");
        }
        this.nombre = nombre;
    }
    toJSON() { return { nombre: this.nombre }; }
    static fromJSON(datos) { return new Modelo(datos?.nombre); }
}

const NOMBRES_GLOBALES = { local: "localStorage", session: "sessionStorage" };
const DESCRIPTORES_ORIGINALES = {
    local: Object.getOwnPropertyDescriptor(globalThis, "localStorage"),
    session: Object.getOwnPropertyDescriptor(globalThis, "sessionStorage")
};

/** Reemplaza globalThis.localStorage / sessionStorage por un doble. */
function instalarStorage(tipo, storage) {
    Object.defineProperty(globalThis, NOMBRES_GLOBALES[tipo], {
        configurable: true,
        get: () => storage
    });
}

/** Hace que acceder al storage lance SecurityError (cookies bloqueadas, iframe sandbox...). */
function instalarStorageInaccesible(tipo) {
    Object.defineProperty(globalThis, NOMBRES_GLOBALES[tipo], {
        configurable: true,
        get: () => { throw new DOMException("Acceso denegado", "SecurityError"); }
    });
}

function restaurarStorageReal() {
    for (const tipo of Object.keys(NOMBRES_GLOBALES)) {
        const descriptor = DESCRIPTORES_ORIGINALES[tipo];
        if (descriptor) {
            Object.defineProperty(globalThis, NOMBRES_GLOBALES[tipo], descriptor);
        } else {
            delete globalThis[NOMBRES_GLOBALES[tipo]];
        }
    }
}

function errorDeCuota() {
    return new DOMException("Cuota excedida", "QuotaExceededError");
}

/** Catálogo, carrito y pedido reales de js/models/, para los round trips con StorageUtil. */
function crearCatalogoReal() {
    return new Catalogo([
        new Producto({
            codigo: "MAR-01", nombre: "Martillo", categoria: "Herramientas manuales",
            descripcion: "Martillo de acero", precio: 16000
        }),
        new Producto({
            codigo: "PAL-01", nombre: "Pala", categoria: "Jardineria",
            descripcion: "Pala de punta", precio: 21329.5
        })
    ]);
}

function crearCarritoReal() {
    const carrito = new Carrito();
    const catalogo = crearCatalogoReal();
    carrito.agregar(catalogo, "MAR-01", 2);
    carrito.agregar(catalogo, "PAL-01", 1);
    return carrito;
}

function crearPedidoReal() {
    const carrito = crearCarritoReal();
    const pago = new Pago(carrito.resumir().total, "tarjeta", 3);
    return new Pedido(carrito, pago, {
        nombre: "Ana Pérez", correo: "ana@correo.com", direccion: "Calle Falsa 123"
    });
}

/* ------------------------------------------------------------------ */
/* Suite                                                               */
/* ------------------------------------------------------------------ */

describe("StorageUtil (js/utils/storage.js)", () => {
    let local;
    let session;

    beforeEach(() => {
        local = new StorageFalso();
        session = new StorageFalso();
        instalarStorage("local", local);
        instalarStorage("session", session);
        // Los errores esperados se registran con console.error: se espían para
        // verificarlos y para no llenar la consola del runner.
        spyOn(console, "error");
    });

    afterEach(() => {
        restaurarStorageReal();
    });

    /* ---------------- Nombres de clave ---------------- */

    describe("Nombres de clave (CLAVES)", () => {
        it("todas las claves siguen la convención app:<dominio>:<dato>", () => {
            const valores = Object.values(CLAVES);
            expect(valores.length).toBe(8);
            valores.forEach((clave) => {
                expect(clave).toMatch(/^app:[a-z0-9-]+:[a-z0-9-]+$/);
                expect(clave.startsWith(PREFIJO_APP)).toBeTrue();
            });
        });

        it("las claves no se repiten", () => {
            const valores = Object.values(CLAVES);
            expect(new Set(valores).size).toBe(valores.length);
        });

        it("CLAVES, PREFIJO_APP y StorageUtil son inmutables", () => {
            expect(PREFIJO_APP).toBe("app:");
            expect(Object.isFrozen(CLAVES)).toBeTrue();
            expect(Object.isFrozen(StorageUtil)).toBeTrue();
        });
    });

    /* ---------------- guardar / obtener ---------------- */

    describe("guardar() y obtener()", () => {
        it("guarda y recupera un objeto en localStorage", () => {
            const valor = { categoriaFavorita: "Herramientas", visitas: 3 };
            expect(StorageUtil.guardar(CLAVES.PREFERENCIAS, valor)).toBeTrue();
            expect(StorageUtil.obtener(CLAVES.PREFERENCIAS)).toEqual(valor);
            expect(local.getItem(CLAVES.PREFERENCIAS)).toBe(JSON.stringify(valor));
        });

        it("guarda y recupera un objeto en sessionStorage", () => {
            const valor = { texto: "taladro", precioMaximo: 5000 };
            expect(StorageUtil.guardar(CLAVES.FILTROS_CATALOGO, valor, "session")).toBeTrue();
            expect(StorageUtil.obtener(CLAVES.FILTROS_CATALOGO, "session")).toEqual(valor);
        });

        it("el tipo por defecto es local y no mezcla ambos storages", () => {
            StorageUtil.guardar("app:test:a", 1);
            StorageUtil.guardar("app:test:b", 2, "session");
            expect(local.getItem("app:test:a")).toBe("1");
            expect(local.getItem("app:test:b")).toBeNull();
            expect(session.getItem("app:test:b")).toBe("2");
            expect(session.getItem("app:test:a")).toBeNull();
        });

        it("devuelve el valor deserializado, no el texto", () => {
            StorageUtil.guardar("app:test:n", 42);
            expect(StorageUtil.obtener("app:test:n")).toBe(42);
            expect(typeof StorageUtil.obtener("app:test:n")).toBe("number");
        });

        it("acepta null y cadena vacía como valores", () => {
            expect(StorageUtil.guardar("app:test:nulo", null)).toBeTrue();
            expect(StorageUtil.existe("app:test:nulo")).toBeTrue();
            expect(StorageUtil.obtener("app:test:nulo")).toBeNull();
            expect(StorageUtil.guardar("app:test:vacio", "")).toBeTrue();
            expect(StorageUtil.obtener("app:test:vacio")).toBe("");
        });

        it("guarda objetos y arreglos anidados", () => {
            const valor = { a: { b: [1, 2, { c: "x" }] }, lista: [[], [1]] };
            expect(StorageUtil.guardar("app:test:anidado", valor)).toBeTrue();
            expect(StorageUtil.obtener("app:test:anidado")).toEqual(valor);
        });

        it("guardar sobrescribe el valor anterior", () => {
            StorageUtil.guardar("app:test:k", "uno");
            StorageUtil.guardar("app:test:k", "dos");
            expect(StorageUtil.obtener("app:test:k")).toBe("dos");
        });

        it("obtener de una clave inexistente devuelve null sin registrar error", () => {
            expect(StorageUtil.obtener("app:test:no-existe")).toBeNull();
            expect(console.error).not.toHaveBeenCalled();
        });

        it("el valor recuperado es una copia, no la misma referencia", () => {
            const original = { x: 1 };
            StorageUtil.guardar("app:test:copia", original);
            const recuperado = StorageUtil.obtener("app:test:copia");
            expect(recuperado).not.toBe(original);
            expect(recuperado).toEqual(original);
        });
    });

    describe("guardar(): errores", () => {
        it("storage lleno (QuotaExceededError): devuelve false y registra «Storage lleno»", () => {
            local.errorEnSetItem = errorDeCuota();
            expect(StorageUtil.guardar("app:test:k", { a: 1 })).toBeFalse();
            expect(console.error).toHaveBeenCalledWith(
                jasmine.stringContaining("Storage lleno"), jasmine.anything());
        });

        it("también reconoce el error de cuota de Firefox antiguo (NS_ERROR_DOM_QUOTA_REACHED)", () => {
            local.errorEnSetItem = Object.assign(new Error("lleno"), { name: "NS_ERROR_DOM_QUOTA_REACHED" });
            expect(StorageUtil.guardar("app:test:k", 1)).toBeFalse();
            expect(console.error).toHaveBeenCalledWith(
                jasmine.stringContaining("Storage lleno"), jasmine.anything());
        });

        it("otro error de escritura devuelve false y se registra sin decir «Storage lleno»", () => {
            local.errorEnSetItem = new Error("fallo cualquiera");
            expect(StorageUtil.guardar("app:test:k", 1)).toBeFalse();
            expect(console.error).toHaveBeenCalledWith(
                jasmine.stringContaining("No se pudo guardar"), jasmine.anything());
        });

        it("una función como valor devuelve false y no guarda nada", () => {
            expect(StorageUtil.guardar("app:test:k", () => {})).toBeFalse();
            expect(local.length).toBe(0);
            expect(console.error).toHaveBeenCalled();
        });

        it("undefined, símbolo y BigInt devuelven false", () => {
            expect(StorageUtil.guardar("app:test:k", undefined)).toBeFalse();
            expect(StorageUtil.guardar("app:test:k", Symbol("x"))).toBeFalse();
            expect(StorageUtil.guardar("app:test:k", 10n)).toBeFalse();
            expect(local.length).toBe(0);
        });

        it("una referencia circular devuelve false", () => {
            const circular = { nombre: "a" };
            circular.yo = circular;
            expect(StorageUtil.guardar("app:test:k", circular)).toBeFalse();
            expect(local.length).toBe(0);
        });

        it("una función dentro de un objeto devuelve false (no se pierde en silencio)", () => {
            // JSON.stringify({ callback: () => {} }) daría "{}" y perdería la propiedad.
            expect(StorageUtil.guardar("app:test:k", { callback: () => {} })).toBeFalse();
            expect(local.length).toBe(0);
        });

        it("una función dentro de un arreglo anidado devuelve false", () => {
            expect(StorageUtil.guardar("app:test:k", { lista: [1, [2, () => {}]] })).toBeFalse();
            expect(local.length).toBe(0);
        });

        it("undefined dentro de un objeto devuelve false", () => {
            expect(StorageUtil.guardar("app:test:k", { a: 1, b: undefined })).toBeFalse();
        });

        it("el mismo objeto repetido en ramas distintas NO es una referencia circular", () => {
            const compartido = { x: 1 };
            expect(StorageUtil.guardar("app:test:k", { a: compartido, b: compartido })).toBeTrue();
            expect(StorageUtil.obtener("app:test:k")).toEqual({ a: { x: 1 }, b: { x: 1 } });
        });

        it("ejecuta toJSON() una sola vez por valor", () => {
            let llamadas = 0;
            const valor = { toJSON() { llamadas++; return { ok: true }; } };
            expect(StorageUtil.guardar("app:test:k", valor)).toBeTrue();
            expect(llamadas).toBe(1);
            expect(StorageUtil.obtener("app:test:k")).toEqual({ ok: true });
        });

        it("un toJSON() que lanza una excepción devuelve false sin propagarla", () => {
            const valor = { toJSON() { throw new Error("toJSON roto"); } };
            expect(() => StorageUtil.guardar("app:test:k", valor)).not.toThrow();
            expect(StorageUtil.guardar("app:test:k", valor)).toBeFalse();
        });

        it("clave inválida (vacía, solo espacios, no string) devuelve false", () => {
            ["", "   ", null, undefined, 5, {}].forEach((clave) => {
                expect(StorageUtil.guardar(clave, 1)).toBeFalse();
            });
            expect(local.length).toBe(0);
        });

        it("tipo de storage inválido devuelve false", () => {
            ["otro", "", null, 1, "LOCAL"].forEach((tipo) => {
                expect(StorageUtil.guardar("app:test:k", 1, tipo)).toBeFalse();
            });
            expect(local.length).toBe(0);
            expect(session.length).toBe(0);
        });

        it("un tipo con nombre heredado de Object (toString, constructor) también es inválido", () => {
            expect(StorageUtil.guardar("app:test:k", 1, "toString")).toBeFalse();
            expect(StorageUtil.guardar("app:test:k", 1, "constructor")).toBeFalse();
        });
    });

    describe("Datos corruptos", () => {
        it("JSON inválido: obtener devuelve null, registra el error y no lanza", () => {
            local.setItem("app:test:roto", "{esto no es json");
            expect(() => StorageUtil.obtener("app:test:roto")).not.toThrow();
            expect(StorageUtil.obtener("app:test:roto")).toBeNull();
            expect(console.error).toHaveBeenCalledWith(
                jasmine.stringContaining("Datos corruptos"), jasmine.anything());
        });

        it("el dato corrupto sigue existiendo (existe() lo informa) hasta que se elimine", () => {
            local.setItem("app:test:roto", "{no-json");
            expect(StorageUtil.existe("app:test:roto")).toBeTrue();
            expect(StorageUtil.eliminar("app:test:roto")).toBeTrue();
            expect(StorageUtil.existe("app:test:roto")).toBeFalse();
        });

        it("un dato corrupto se puede reemplazar con guardar()", () => {
            local.setItem("app:test:roto", "{no-json");
            expect(StorageUtil.guardar("app:test:roto", { ok: 1 })).toBeTrue();
            expect(StorageUtil.obtener("app:test:roto")).toEqual({ ok: 1 });
        });

        it("cargarInstancia y cargarLista con JSON corrupto devuelven null y []", () => {
            local.setItem("app:test:roto", "{no-json");
            expect(StorageUtil.cargarInstancia("app:test:roto", Modelo)).toBeNull();
            expect(StorageUtil.cargarLista("app:test:roto", Modelo)).toEqual([]);
        });
    });

    /* ---------------- actualizar ---------------- */

    describe("actualizar()", () => {
        it("actualiza una clave existente", () => {
            StorageUtil.guardar("app:test:k", { v: 1 });
            expect(StorageUtil.actualizar("app:test:k", { v: 2 })).toBeTrue();
            expect(StorageUtil.obtener("app:test:k")).toEqual({ v: 2 });
        });

        it("funciona en sessionStorage", () => {
            StorageUtil.guardar("app:test:k", 1, "session");
            expect(StorageUtil.actualizar("app:test:k", 2, "session")).toBeTrue();
            expect(StorageUtil.obtener("app:test:k", "session")).toBe(2);
        });

        it("una clave inexistente NO se crea: devuelve false", () => {
            expect(StorageUtil.actualizar("app:test:nueva", 1)).toBeFalse();
            expect(StorageUtil.existe("app:test:nueva")).toBeFalse();
            expect(local.length).toBe(0);
        });

        it("storage lleno devuelve false y conserva el valor anterior", () => {
            StorageUtil.guardar("app:test:k", "original");
            local.errorEnSetItem = errorDeCuota();
            expect(StorageUtil.actualizar("app:test:k", "nuevo")).toBeFalse();
            local.errorEnSetItem = null;
            expect(StorageUtil.obtener("app:test:k")).toBe("original");
        });

        it("un valor no serializable devuelve false y conserva el valor anterior", () => {
            StorageUtil.guardar("app:test:k", "original");
            expect(StorageUtil.actualizar("app:test:k", { f: () => {} })).toBeFalse();
            expect(StorageUtil.obtener("app:test:k")).toBe("original");
        });

        it("clave o tipo inválidos devuelven false", () => {
            expect(StorageUtil.actualizar("", 1)).toBeFalse();
            expect(StorageUtil.actualizar("app:test:k", 1, "otro")).toBeFalse();
        });
    });

    /* ---------------- eliminar ---------------- */

    describe("eliminar()", () => {
        it("elimina un dato existente", () => {
            StorageUtil.guardar("app:test:k", 1);
            expect(StorageUtil.eliminar("app:test:k")).toBeTrue();
            expect(StorageUtil.existe("app:test:k")).toBeFalse();
            expect(StorageUtil.obtener("app:test:k")).toBeNull();
        });

        it("es idempotente: eliminar una clave inexistente devuelve true y no falla", () => {
            expect(StorageUtil.eliminar("app:test:no-existe")).toBeTrue();
            expect(StorageUtil.eliminar("app:test:no-existe")).toBeTrue();
            expect(console.error).not.toHaveBeenCalled();
        });

        it("solo elimina la clave indicada y solo del storage indicado", () => {
            StorageUtil.guardar("app:test:a", 1);
            StorageUtil.guardar("app:test:b", 2);
            StorageUtil.guardar("app:test:a", 3, "session");
            StorageUtil.eliminar("app:test:a");
            expect(StorageUtil.existe("app:test:b")).toBeTrue();
            expect(StorageUtil.existe("app:test:a", "session")).toBeTrue();
        });

        it("tipo de storage inválido devuelve false", () => {
            expect(StorageUtil.eliminar("app:test:k", "otro")).toBeFalse();
        });

        it("clave inválida devuelve false", () => {
            expect(StorageUtil.eliminar("")).toBeFalse();
            expect(StorageUtil.eliminar(null)).toBeFalse();
        });

        it("si removeItem lanza una excepción devuelve false sin propagarla", () => {
            StorageUtil.guardar("app:test:k", 1);
            local.errorEnRemoveItem = new Error("fallo");
            expect(() => StorageUtil.eliminar("app:test:k")).not.toThrow();
            expect(StorageUtil.eliminar("app:test:k")).toBeFalse();
        });
    });

    /* ---------------- listar / limpiar ---------------- */

    describe("listar()", () => {
        it("devuelve las claves con el prefijo de la app, ordenadas alfabéticamente", () => {
            local.setItem("app:c", "1");
            local.setItem("app:a", "1");
            local.setItem("app:b", "1");
            local.setItem("otra-app:x", "1");
            expect(StorageUtil.listar()).toEqual(["app:a", "app:b", "app:c"]);
        });

        it("filtra por un prefijo propio", () => {
            StorageUtil.guardar(CLAVES.PEDIDOS, []);
            StorageUtil.guardar(CLAVES.SECUENCIA_PEDIDOS, 1);
            StorageUtil.guardar(CLAVES.CARRITO, {});
            expect(StorageUtil.listar("app:pedidos:")).toEqual([CLAVES.PEDIDOS, CLAVES.SECUENCIA_PEDIDOS].sort());
        });

        it("un prefijo sin coincidencias devuelve []", () => {
            StorageUtil.guardar(CLAVES.CARRITO, {});
            expect(StorageUtil.listar("zzz:")).toEqual([]);
        });

        it("el prefijo vacío lista todas las claves, también las ajenas a la app", () => {
            local.setItem("app:a", "1");
            local.setItem("ajena", "1");
            expect(StorageUtil.listar("")).toEqual(["ajena", "app:a"]);
        });

        it("respeta el tipo de storage", () => {
            StorageUtil.guardar("app:test:l", 1, "local");
            StorageUtil.guardar("app:test:s", 1, "session");
            expect(StorageUtil.listar(PREFIJO_APP, "local")).toEqual(["app:test:l"]);
            expect(StorageUtil.listar(PREFIJO_APP, "session")).toEqual(["app:test:s"]);
        });

        it("storage vacío devuelve []", () => {
            expect(StorageUtil.listar()).toEqual([]);
        });

        it("tipo o prefijo inválidos devuelven []", () => {
            expect(StorageUtil.listar(PREFIJO_APP, "otro")).toEqual([]);
            expect(StorageUtil.listar(123)).toEqual([]);
            expect(StorageUtil.listar(null)).toEqual([]);
        });
    });

    describe("limpiar()", () => {
        beforeEach(() => {
            local.setItem("app:a", "1");
            local.setItem("app:b", "1");
            local.setItem("ajena:x", "1");
            session.setItem("app:s", "1");
        });

        it("por defecto borra solo las claves app:* y no toca las ajenas", () => {
            expect(StorageUtil.limpiar()).toBeTrue();
            expect(local.getItem("app:a")).toBeNull();
            expect(local.getItem("app:b")).toBeNull();
            expect(local.getItem("ajena:x")).toBe("1");
        });

        it("borra todas las claves app:* aunque sean muchas (no se saltea ninguna al borrar)", () => {
            for (let i = 0; i < 25; i++) local.setItem(`app:masiva:${i}`, "1");
            StorageUtil.limpiar();
            expect(StorageUtil.listar()).toEqual([]);
            expect(local.getItem("ajena:x")).toBe("1");
        });

        it("limpiar(tipo, false) borra todo el storage, incluidas las claves ajenas", () => {
            expect(StorageUtil.limpiar("local", false)).toBeTrue();
            expect(local.length).toBe(0);
        });

        it("solo afecta al storage indicado", () => {
            StorageUtil.limpiar("local");
            expect(session.getItem("app:s")).toBe("1");
            StorageUtil.limpiar("session");
            expect(session.length).toBe(0);
        });

        it("tipo inválido devuelve false y no borra nada", () => {
            expect(StorageUtil.limpiar("otro")).toBeFalse();
            expect(local.length).toBe(3);
        });
    });

    /* ---------------- existe / estaDisponible ---------------- */

    describe("existe()", () => {
        it("refleja el estado real del storage", () => {
            expect(StorageUtil.existe("app:test:k")).toBeFalse();
            StorageUtil.guardar("app:test:k", 0);
            expect(StorageUtil.existe("app:test:k")).toBeTrue();
            StorageUtil.eliminar("app:test:k");
            expect(StorageUtil.existe("app:test:k")).toBeFalse();
        });

        it("un valor falsy como 0, false o \"\" cuenta como existente", () => {
            StorageUtil.guardar("app:test:cero", 0);
            StorageUtil.guardar("app:test:falso", false);
            StorageUtil.guardar("app:test:vacio", "");
            expect(StorageUtil.existe("app:test:cero")).toBeTrue();
            expect(StorageUtil.existe("app:test:falso")).toBeTrue();
            expect(StorageUtil.existe("app:test:vacio")).toBeTrue();
        });

        it("distingue entre local y session", () => {
            StorageUtil.guardar("app:test:k", 1, "session");
            expect(StorageUtil.existe("app:test:k", "session")).toBeTrue();
            expect(StorageUtil.existe("app:test:k", "local")).toBeFalse();
        });

        it("clave o tipo inválidos devuelven false", () => {
            expect(StorageUtil.existe("")).toBeFalse();
            expect(StorageUtil.existe("app:test:k", "otro")).toBeFalse();
        });
    });

    describe("estaDisponible()", () => {
        it("devuelve true en un storage que funciona, para local y para session", () => {
            expect(StorageUtil.estaDisponible()).toBeTrue();
            expect(StorageUtil.estaDisponible("local")).toBeTrue();
            expect(StorageUtil.estaDisponible("session")).toBeTrue();
        });

        it("no deja ninguna clave temporal en el storage", () => {
            StorageUtil.guardar("app:test:k", 1);
            StorageUtil.estaDisponible();
            expect(local.length).toBe(1);
            expect(StorageUtil.listar()).toEqual(["app:test:k"]);
        });

        it("no pisa ni borra datos existentes, tampoco en la clave fija del diseño anterior", () => {
            local.setItem("app:__prueba-disponibilidad__", '{"datos":"importantes"}');
            expect(StorageUtil.estaDisponible()).toBeTrue();
            expect(local.getItem("app:__prueba-disponibilidad__")).toBe('{"datos":"importantes"}');
        });

        it("usa una clave distinta en cada prueba", () => {
            const claves = [];
            const setOriginal = local.setItem.bind(local);
            local.setItem = (clave, valor) => { claves.push(clave); setOriginal(clave, valor); };
            StorageUtil.estaDisponible();
            StorageUtil.estaDisponible();
            expect(claves.length).toBe(2);
            expect(claves[0]).not.toBe(claves[1]);
        });

        it("storage lleno devuelve false y registra el motivo", () => {
            local.errorEnSetItem = errorDeCuota();
            expect(StorageUtil.estaDisponible()).toBeFalse();
            expect(console.error).toHaveBeenCalledWith(
                jasmine.stringContaining("lleno"), jasmine.anything());
        });

        it("si no se puede borrar la clave de prueba devuelve false", () => {
            local.removeItemIgnorado = true;
            expect(StorageUtil.estaDisponible()).toBeFalse();
            expect(console.error).toHaveBeenCalled();
        });

        it("si removeItem lanza una excepción devuelve false sin propagarla", () => {
            local.errorEnRemoveItem = new Error("fallo");
            expect(() => StorageUtil.estaDisponible()).not.toThrow();
            expect(StorageUtil.estaDisponible()).toBeFalse();
        });

        it("storage deshabilitado (SecurityError) devuelve false", () => {
            instalarStorageInaccesible("local");
            expect(StorageUtil.estaDisponible("local")).toBeFalse();
        });

        it("tipo inválido devuelve false", () => {
            expect(StorageUtil.estaDisponible("otro")).toBeFalse();
        });
    });

    /* ---------------- storage inaccesible ---------------- */

    describe("Storage inaccesible (SecurityError)", () => {
        beforeEach(() => {
            instalarStorageInaccesible("local");
        });

        it("ninguna operación lanza una excepción y todas devuelven su valor de fallo", () => {
            expect(() => {
                expect(StorageUtil.guardar("app:test:k", 1)).toBeFalse();
                expect(StorageUtil.obtener("app:test:k")).toBeNull();
                expect(StorageUtil.actualizar("app:test:k", 1)).toBeFalse();
                expect(StorageUtil.eliminar("app:test:k")).toBeFalse();
                expect(StorageUtil.existe("app:test:k")).toBeFalse();
                expect(StorageUtil.listar()).toEqual([]);
                expect(StorageUtil.limpiar()).toBeFalse();
                expect(StorageUtil.guardarInstancia("app:test:k", new Modelo("a"))).toBeFalse();
                expect(StorageUtil.cargarInstancia("app:test:k", Modelo)).toBeNull();
                expect(StorageUtil.guardarLista("app:test:k", [new Modelo("a")])).toBeFalse();
                expect(StorageUtil.cargarLista("app:test:k", Modelo)).toEqual([]);
            }).not.toThrow();
        });

        it("registra el problema con console.error", () => {
            StorageUtil.guardar("app:test:k", 1);
            expect(console.error).toHaveBeenCalled();
        });

        it("el otro storage sigue funcionando", () => {
            expect(StorageUtil.guardar("app:test:k", 1, "session")).toBeTrue();
        });
    });

    describe("Storage no disponible en el entorno", () => {
        it("si globalThis.localStorage no existe, devuelve los valores de fallo", () => {
            Object.defineProperty(globalThis, "localStorage", { configurable: true, get: () => undefined });
            expect(StorageUtil.guardar("app:test:k", 1)).toBeFalse();
            expect(StorageUtil.obtener("app:test:k")).toBeNull();
            expect(StorageUtil.estaDisponible()).toBeFalse();
        });
    });

    /* ---------------- integración con modelos ---------------- */

    describe("Integración con modelos (toJSON / fromJSON)", () => {
        describe("guardarInstancia() y cargarInstancia()", () => {
            it("guarda usando toJSON() y reconstruye con fromJSON()", () => {
                expect(StorageUtil.guardarInstancia(CLAVES.CARRITO, new Modelo("Ana"))).toBeTrue();
                expect(local.getItem(CLAVES.CARRITO)).toBe('{"nombre":"Ana"}');
                const recuperada = StorageUtil.cargarInstancia(CLAVES.CARRITO, Modelo);
                expect(recuperada instanceof Modelo).toBeTrue();
                expect(recuperada.nombre).toBe("Ana");
            });

            it("funciona en sessionStorage", () => {
                StorageUtil.guardarInstancia(CLAVES.BORRADOR_CHECKOUT, new Modelo("Beto"), "session");
                expect(StorageUtil.cargarInstancia(CLAVES.BORRADOR_CHECKOUT, Modelo, "session").nombre).toBe("Beto");
                expect(StorageUtil.cargarInstancia(CLAVES.BORRADOR_CHECKOUT, Modelo, "local")).toBeNull();
            });

            it("una instancia sin toJSON() devuelve false y no guarda nada", () => {
                expect(StorageUtil.guardarInstancia("app:test:k", { nombre: "x" })).toBeFalse();
                expect(StorageUtil.guardarInstancia("app:test:k", null)).toBeFalse();
                expect(StorageUtil.guardarInstancia("app:test:k", "texto")).toBeFalse();
                expect(local.length).toBe(0);
            });

            it("un toJSON() que lanza devuelve false sin propagar la excepción", () => {
                const rota = { toJSON() { throw new Error("roto"); } };
                expect(() => StorageUtil.guardarInstancia("app:test:k", rota)).not.toThrow();
                expect(StorageUtil.guardarInstancia("app:test:k", rota)).toBeFalse();
            });

            it("cargarInstancia de una clave inexistente devuelve null", () => {
                expect(StorageUtil.cargarInstancia("app:test:no-existe", Modelo)).toBeNull();
            });

            it("una clase sin fromJSON() devuelve null", () => {
                StorageUtil.guardarInstancia("app:test:k", new Modelo("a"));
                expect(StorageUtil.cargarInstancia("app:test:k", class SinFromJSON {})).toBeNull();
                expect(StorageUtil.cargarInstancia("app:test:k", null)).toBeNull();
                expect(StorageUtil.cargarInstancia("app:test:k", {})).toBeNull();
            });

            it("datos guardados que ya no cumplen las reglas del modelo: devuelve null, informa y no devuelve un objeto parcial", () => {
                StorageUtil.guardar("app:test:k", { nombre: "" });
                expect(StorageUtil.cargarInstancia("app:test:k", Modelo)).toBeNull();
                expect(console.error).toHaveBeenCalledWith(
                    jasmine.stringContaining("no son válidos"), jasmine.anything());
            });

            it("datos con otra forma (un arreglo, un número) devuelven null", () => {
                StorageUtil.guardar("app:test:k", [1, 2]);
                expect(StorageUtil.cargarInstancia("app:test:k", Modelo)).toBeNull();
                StorageUtil.guardar("app:test:k", 7);
                expect(StorageUtil.cargarInstancia("app:test:k", Modelo)).toBeNull();
            });
        });

        describe("guardarLista() y cargarLista()", () => {
            it("guarda un arreglo de toJSON() y reconstruye cada elemento", () => {
                const lista = [new Modelo("a"), new Modelo("b"), new Modelo("c")];
                expect(StorageUtil.guardarLista(CLAVES.PEDIDOS, lista)).toBeTrue();
                expect(local.getItem(CLAVES.PEDIDOS)).toBe('[{"nombre":"a"},{"nombre":"b"},{"nombre":"c"}]');
                const recuperada = StorageUtil.cargarLista(CLAVES.PEDIDOS, Modelo);
                expect(recuperada.length).toBe(3);
                expect(recuperada.every((m) => m instanceof Modelo)).toBeTrue();
                expect(recuperada.map((m) => m.nombre)).toEqual(["a", "b", "c"]);
            });

            it("lista vacía: se guarda como [] y se carga como []", () => {
                expect(StorageUtil.guardarLista(CLAVES.PEDIDOS, [])).toBeTrue();
                expect(local.getItem(CLAVES.PEDIDOS)).toBe("[]");
                expect(StorageUtil.cargarLista(CLAVES.PEDIDOS, Modelo)).toEqual([]);
            });

            it("cargarLista de una clave inexistente devuelve []", () => {
                expect(StorageUtil.cargarLista("app:test:no-existe", Modelo)).toEqual([]);
            });

            it("guardarLista con algo que no es un arreglo devuelve false", () => {
                expect(StorageUtil.guardarLista("app:test:k", new Modelo("a"))).toBeFalse();
                expect(StorageUtil.guardarLista("app:test:k", null)).toBeFalse();
                expect(local.length).toBe(0);
            });

            it("si un elemento no tiene toJSON() devuelve false y no guarda nada", () => {
                expect(StorageUtil.guardarLista("app:test:k", [new Modelo("a"), { nombre: "b" }])).toBeFalse();
                expect(local.length).toBe(0);
                expect(console.error).toHaveBeenCalledWith(jasmine.stringContaining("elemento 1"));
            });

            it("es todo o nada: si un elemento guardado es inválido devuelve [] (sin datos parciales)", () => {
                StorageUtil.guardar("app:test:k", [{ nombre: "ok" }, { nombre: "" }, { nombre: "ok2" }]);
                expect(StorageUtil.cargarLista("app:test:k", Modelo)).toEqual([]);
                expect(console.error).toHaveBeenCalledWith(
                    jasmine.stringContaining("elementos inválidos"), jasmine.anything());
            });

            it("si lo guardado no es un arreglo devuelve []", () => {
                StorageUtil.guardar("app:test:k", { nombre: "a" });
                expect(StorageUtil.cargarLista("app:test:k", Modelo)).toEqual([]);
            });

            it("una clase sin fromJSON() devuelve []", () => {
                StorageUtil.guardarLista("app:test:k", [new Modelo("a")]);
                expect(StorageUtil.cargarLista("app:test:k", class SinFromJSON {})).toEqual([]);
            });

            it("un toJSON() que lanza en un elemento devuelve false sin propagar", () => {
                const rota = { toJSON() { throw new Error("roto"); } };
                expect(() => StorageUtil.guardarLista("app:test:k", [new Modelo("a"), rota])).not.toThrow();
                expect(StorageUtil.guardarLista("app:test:k", [new Modelo("a"), rota])).toBeFalse();
            });
        });
    });

    /* ---------------- integración con los modelos reales ---------------- */

    describe("Integración con los modelos reales de js/models/", () => {
        it("Carrito: guardarInstancia + cargarInstancia reproduce el mismo carrito", () => {
            const original = crearCarritoReal();
            expect(StorageUtil.guardarInstancia(CLAVES.CARRITO, original)).toBeTrue();
            const restaurado = StorageUtil.cargarInstancia(CLAVES.CARRITO, Carrito);
            expect(restaurado instanceof Carrito).toBeTrue();
            expect(restaurado.toJSON()).toEqual(original.toJSON());
            expect(restaurado.resumir()).toEqual(original.resumir());
        });

        it("Carrito: el restaurado es independiente del original", () => {
            const original = crearCarritoReal();
            StorageUtil.guardarInstancia(CLAVES.CARRITO, original);
            const restaurado = StorageUtil.cargarInstancia(CLAVES.CARRITO, Carrito);
            restaurado.vaciar();
            expect(original.resumir().cantidadItems).toBe(2);
        });

        it("Catalogo: guardarInstancia + cargarInstancia conserva los productos", () => {
            const original = crearCatalogoReal();
            expect(StorageUtil.guardarInstancia(CLAVES.CACHE_CATALOGO, original)).toBeTrue();
            const restaurado = StorageUtil.cargarInstancia(CLAVES.CACHE_CATALOGO, Catalogo);
            expect(restaurado instanceof Catalogo).toBeTrue();
            expect(restaurado.toJSON()).toEqual(original.toJSON());
            expect(restaurado.buscar({ texto: "pala" }).resultados.map((p) => p.codigo)).toEqual(["PAL-01"]);
        });

        it("Producto: guardarLista + cargarLista conserva cada producto", () => {
            const productos = crearCatalogoReal().buscar({}).resultados;
            expect(StorageUtil.guardarLista("app:test:productos", productos)).toBeTrue();
            const restaurados = StorageUtil.cargarLista("app:test:productos", Producto);
            expect(restaurados.every((p) => p instanceof Producto)).toBeTrue();
            expect(restaurados.map((p) => p.toJSON())).toEqual(productos.map((p) => p.toJSON()));
        });

        it("Pedido sin confirmar: round trip completo (cliente, productos, pago)", () => {
            const original = crearPedidoReal();
            expect(StorageUtil.guardarInstancia("app:test:pedido", original)).toBeTrue();
            const restaurado = StorageUtil.cargarInstancia("app:test:pedido", Pedido);
            expect(restaurado instanceof Pedido).toBeTrue();
            expect(restaurado.resumir()).toEqual(original.resumir());
            expect(restaurado.resumir().pago.cuotas).toBe(3);
        });

        it("Pedido confirmado: el historial guardado con guardarLista conserva el número", () => {
            const confirmado = crearPedidoReal();
            const numero = confirmado.confirmar(1700000000000, 1);
            expect(numero).toBe("FL-1700000000000-0001");
            expect(StorageUtil.guardarLista(CLAVES.PEDIDOS, [confirmado, crearPedidoReal()])).toBeTrue();
            const historial = StorageUtil.cargarLista(CLAVES.PEDIDOS, Pedido);
            expect(historial.length).toBe(2);
            expect(historial[0].toJSON().numero).toBe(numero);
            expect(historial[1].toJSON().numero).toBeNull();
        });

        it("Carrito guardado con una cantidad inválida: devuelve null y no un carrito parcial", () => {
            const datos = crearCarritoReal().toJSON();
            datos.items[0].cantidad = -3;
            StorageUtil.guardar(CLAVES.CARRITO, datos);
            expect(StorageUtil.cargarInstancia(CLAVES.CARRITO, Carrito)).toBeNull();
            expect(console.error).toHaveBeenCalled();
        });

        it("Pedido guardado con un importe alterado: devuelve null", () => {
            const datos = crearPedidoReal().toJSON();
            datos.pago.totalFinanciado += 1;
            StorageUtil.guardar("app:test:pedido", datos);
            expect(StorageUtil.cargarInstancia("app:test:pedido", Pedido)).toBeNull();
        });

        it("Historial con un pedido dañado: cargarLista devuelve [] (todo o nada)", () => {
            const bueno = crearPedidoReal().toJSON();
            const danado = crearPedidoReal().toJSON();
            danado.cliente.correo = "no-es-un-correo";
            StorageUtil.guardar(CLAVES.PEDIDOS, [bueno, danado]);
            expect(StorageUtil.cargarLista(CLAVES.PEDIDOS, Pedido)).toEqual([]);
        });
    });

    /* ---------------- ninguna operación lanza ---------------- */

    describe("Ninguna operación lanza excepciones hacia afuera", () => {
        const VALORES_RAROS = [
            undefined, null, 0, NaN, "", "  ", {}, [], () => {}, Symbol("x"), 10n,
            { toJSON() { throw new Error("roto"); } }
        ];
        const OPERACIONES = [
            "guardar", "obtener", "actualizar", "eliminar", "listar", "limpiar", "existe",
            "estaDisponible", "guardarInstancia", "cargarInstancia", "guardarLista", "cargarLista"
        ];

        OPERACIONES.forEach((operacion) => {
            it(`${operacion}() tolera argumentos inválidos`, () => {
                VALORES_RAROS.forEach((a) => {
                    VALORES_RAROS.forEach((b) => {
                        expect(() => StorageUtil[operacion](a, b, a)).not.toThrow();
                    });
                });
                expect(() => StorageUtil[operacion]()).not.toThrow();
            });
        });
    });
});

/* ------------------------------------------------------------------ */
/* Web Storage real (verificación mínima, sin dobles)                   */
/* ------------------------------------------------------------------ */

describe("StorageUtil con Web Storage real del navegador", () => {
    const CLAVE = "app:test-qa:real";

    beforeEach(() => {
        restaurarStorageReal();
        spyOn(console, "error");
    });

    afterEach(() => {
        // No se deja ningún dato de los tests en el navegador.
        StorageUtil.eliminar(CLAVE, "local");
        StorageUtil.eliminar(CLAVE, "session");
    });

    it("estaDisponible() es true en el navegador de pruebas", () => {
        expect(StorageUtil.estaDisponible("local")).toBeTrue();
        expect(StorageUtil.estaDisponible("session")).toBeTrue();
    });

    it("ida y vuelta real por localStorage y sessionStorage", () => {
        const valor = { total: 1500, items: [1, 2] };
        expect(StorageUtil.guardar(CLAVE, valor, "local")).toBeTrue();
        expect(StorageUtil.guardar(CLAVE, valor, "session")).toBeTrue();
        expect(StorageUtil.obtener(CLAVE, "local")).toEqual(valor);
        expect(StorageUtil.obtener(CLAVE, "session")).toEqual(valor);
        expect(window.localStorage.getItem(CLAVE)).toBe(JSON.stringify(valor));
    });

    it("listar() incluye la clave y eliminar() la quita", () => {
        StorageUtil.guardar(CLAVE, 1);
        expect(StorageUtil.listar()).toContain(CLAVE);
        StorageUtil.eliminar(CLAVE);
        expect(StorageUtil.listar()).not.toContain(CLAVE);
    });
});
