/**
 * @file Tests de los servicios (js/services/).
 *
 * Servicios cubiertos: FormateadorMoneda, ValidacionCarrito, ConfirmadorPedidos,
 * FachadaStorage, ServicioOfertas, ServicioCategorias y ServicioOpcionesPago.
 *
 * Los tests de FachadaStorage no usan el localStorage/sessionStorage reales: instalan un
 * storage en memoria (y, para los casos de error, uno que falla) y restauran el original
 * al terminar, para no ensuciar los datos de la aplicación ni de otros specs.
 *
 * Se carga como módulo ES desde test-runner.html.
 */
import { Producto } from "../models/Producto.js";
import { Catalogo } from "../models/Catalogo.js";
import { Carrito } from "../models/Carrito.js";
import { Pago } from "../models/Pago.js";
import { Pedido } from "../models/Pedido.js";
import { CLAVES } from "../utils/storage.js";
import { FormateadorMoneda } from "../services/FormateadorMoneda.js";
import { validarCambioCantidad } from "../services/ValidacionCarrito.js";
import { confirmarPedidoConNumeracion } from "../services/ConfirmadorPedidos.js";
import { FachadaStorage } from "../services/FachadaStorage.js";
import { ServicioOfertas } from "../services/ServicioOfertas.js";
import { ServicioCategorias } from "../services/ServicioCategorias.js";
import { ServicioOpcionesPago } from "../services/ServicioOpcionesPago.js";

const { describe, it, expect, beforeEach, afterEach, spyOn } = globalThis;

/* ---------------- dobles y fábricas ---------------- */

class StorageEnMemoria {
    constructor() { this.datos = new Map(); this.errorEnSetItem = null; }
    get length() { return this.datos.size; }
    key(i) { return [...this.datos.keys()][i] ?? null; }
    getItem(k) { return this.datos.has(k) ? this.datos.get(k) : null; }
    setItem(k, v) { if (this.errorEnSetItem) throw this.errorEnSetItem; this.datos.set(k, String(v)); }
    removeItem(k) { this.datos.delete(k); }
    clear() { this.datos.clear(); }
}

const ORIGINALES = {
    localStorage: Object.getOwnPropertyDescriptor(globalThis, "localStorage"),
    sessionStorage: Object.getOwnPropertyDescriptor(globalThis, "sessionStorage")
};

function instalar(nombre, storage) {
    Object.defineProperty(globalThis, nombre, { configurable: true, get: () => storage });
}

function restaurar() {
    Object.entries(ORIGINALES).forEach(([nombre, descriptor]) => {
        if (descriptor) Object.defineProperty(globalThis, nombre, descriptor);
        else delete globalThis[nombre];
    });
}

function crearCatalogo() {
    return new Catalogo([
        new Producto({ codigo: "TAL-01", nombre: "Taladro", categoria: "Herramientas eléctricas", descripcion: "Taladro", precio: 100 }),
        new Producto({ codigo: "MAR-02", nombre: "Martillo", categoria: "Herramientas manuales", descripcion: "Martillo", precio: 20 })
    ]);
}

/** Catálogo con los tres códigos que usa ServicioOfertas y precios por debajo del precio anterior. */
function crearCatalogoConOfertas(precios = {}) {
    const base = { "AMOLADORA-001": 50000, "KIT-TAPONES-001": 80000, "MARTILLO-001": 20000 };
    const p = { ...base, ...precios };
    return new Catalogo(Object.entries(p).map(([codigo, precio]) => new Producto({
        codigo, nombre: `Nombre ${codigo}`, categoria: "Herramientas", descripcion: `Desc ${codigo}`, precio
    })));
}

function crearCarrito() {
    const carrito = new Carrito();
    carrito.agregar(crearCatalogo(), "TAL-01", 2);
    return carrito;
}

function crearPedido() {
    const carrito = crearCarrito();
    const pago = new Pago(carrito.resumir().total, "efectivo-transferencia");
    return new Pedido(carrito, pago, { nombre: "Ana", correo: "ana@example.com", direccion: "Calle 1" });
}

/* ---------------- FormateadorMoneda ---------------- */

describe("FormateadorMoneda", function () {
    it("formatea en pesos argentinos con dos decimales", function () {
        const texto = FormateadorMoneda.formatear(1234.5).replace(/\s/g, " ");
        expect(texto).toMatch(/1\.234,50/);
        expect(texto).toMatch(/\$/);
    });

    it("formatea cero y valores con redondeo a dos decimales", function () {
        expect(FormateadorMoneda.formatear(0)).toMatch(/0,00/);
        expect(FormateadorMoneda.formatear(10.005 + 0.001)).toMatch(/10,01/);
    });

    it("conserva el signo de los importes negativos", function () {
        expect(FormateadorMoneda.formatear(-5)).toMatch(/-/);
    });
});

/* ---------------- ValidacionCarrito ---------------- */

describe("ValidacionCarrito.validarCambioCantidad", function () {
    it("acepta una cantidad válida sin modificar el carrito original", function () {
        const carrito = crearCarrito();
        const resultado = validarCambioCantidad(carrito, "TAL-01", 5);
        expect(resultado.exito).toBeTrue();
        expect(carrito.resumir().items[0].cantidad).toBe(2);
    });

    it("rechaza cantidades inválidas con el mensaje del modelo", function () {
        const carrito = crearCarrito();
        ["0", "-1", "1.5", "abc", "", null].forEach((cantidad) => {
            const resultado = validarCambioCantidad(carrito, "TAL-01", cantidad);
            expect(resultado.exito).toBeFalse();
            expect(resultado.error).toBeTruthy();
        });
        expect(carrito.resumir().items[0].cantidad).toBe(2);
    });

    it("rechaza un código que no está en el carrito", function () {
        const resultado = validarCambioCantidad(crearCarrito(), "NO-EXISTE", 1);
        expect(resultado.exito).toBeFalse();
        expect(resultado.error).toBe("El producto no esta en el carrito.");
    });
});

/* ---------------- ConfirmadorPedidos ---------------- */

describe("ConfirmadorPedidos.confirmarPedidoConNumeracion", function () {
    it("confirma el pedido y devuelve su número", function () {
        const pedido = crearPedido();
        const numero = confirmarPedidoConNumeracion(pedido);
        expect(numero).toMatch(/^FL-\d+-\d{4}$/);
        expect(pedido.toJSON().numero).toBe(numero);
    });

    it("genera números distintos y consecutivos para pedidos sucesivos", function () {
        const a = confirmarPedidoConNumeracion(crearPedido());
        const b = confirmarPedidoConNumeracion(crearPedido());
        expect(a).not.toBe(b);
        expect(Number(b.split("-")[2])).toBe(Number(a.split("-")[2]) + 1);
    });

    it("rechaza algo que no es un Pedido", function () {
        [null, undefined, {}, "x", crearCarrito()].forEach((valor) => {
            expect(() => confirmarPedidoConNumeracion(valor)).toThrowError(TypeError, /pedido no es válido/);
        });
    });

    it("no permite confirmar dos veces el mismo pedido", function () {
        const pedido = crearPedido();
        confirmarPedidoConNumeracion(pedido);
        expect(() => confirmarPedidoConNumeracion(pedido)).toThrowError(RangeError, /ya fue confirmado/);
    });

    it("un rechazo no consume número de secuencia", function () {
        const a = confirmarPedidoConNumeracion(crearPedido());
        const pedido = crearPedido();
        confirmarPedidoConNumeracion(pedido);
        expect(() => confirmarPedidoConNumeracion(pedido)).toThrowError(RangeError);
        const c = confirmarPedidoConNumeracion(crearPedido());
        // a → a+1 (pedido) → a+2 (c): el intento fallido no avanzó la secuencia
        expect(Number(c.split("-")[2])).toBe(Number(a.split("-")[2]) + 2);
    });
});

/* ---------------- FachadaStorage ---------------- */

describe("FachadaStorage", function () {
    let local;
    let sesion;

    beforeEach(() => {
        local = new StorageEnMemoria();
        sesion = new StorageEnMemoria();
        instalar("localStorage", local);
        instalar("sessionStorage", sesion);
        spyOn(console, "error");
    });

    afterEach(restaurar);

    it("está congelada: no admite agregar ni reemplazar métodos", function () {
        expect(Object.isFrozen(FachadaStorage)).toBeTrue();
    });

    describe("carrito", function () {
        it("cargarCarrito() devuelve un carrito vacío si no hay nada guardado", function () {
            const carrito = FachadaStorage.cargarCarrito();
            expect(carrito instanceof Carrito).toBeTrue();
            expect(carrito.resumir().items).toEqual([]);
        });

        it("guardarCarrito() y cargarCarrito() hacen un round trip", function () {
            expect(FachadaStorage.guardarCarrito(crearCarrito())).toBeTrue();
            expect(local.getItem(CLAVES.CARRITO)).not.toBeNull();
            const cargado = FachadaStorage.cargarCarrito();
            expect(cargado.resumir().items[0].cantidad).toBe(2);
            expect(cargado.resumir().total).toBe(200);
        });

        it("un carrito vacío guardado se vuelve a cargar vacío", function () {
            FachadaStorage.guardarCarrito(crearCarrito());
            expect(FachadaStorage.guardarCarrito(new Carrito())).toBeTrue();
            expect(FachadaStorage.cargarCarrito().resumir().items).toEqual([]);
        });

        it("cargarCarrito() descarta datos corruptos y devuelve un carrito vacío", function () {
            local.setItem(CLAVES.CARRITO, "{no es json");
            expect(FachadaStorage.cargarCarrito().resumir().items).toEqual([]);
        });

        it("cargarCarrito() descarta un carrito con estructura inválida", function () {
            local.setItem(CLAVES.CARRITO, JSON.stringify({ items: [{ codigo: "X" }] }));
            expect(FachadaStorage.cargarCarrito().resumir().items).toEqual([]);
        });

        it("guardarCarrito() devuelve false y no lanza si el storage está lleno", function () {
            local.errorEnSetItem = new DOMException("Cuota", "QuotaExceededError");
            expect(FachadaStorage.guardarCarrito(crearCarrito())).toBeFalse();
        });

        it("guardarCarrito() devuelve false si se le pasa algo que no es serializable", function () {
            expect(FachadaStorage.guardarCarrito(null)).toBeFalse();
            expect(FachadaStorage.guardarCarrito({})).toBeFalse();
        });
    });

    describe("historial y secuencia de pedidos", function () {
        it("cargarPedidos() devuelve una lista vacía si no hay historial", function () {
            expect(FachadaStorage.cargarPedidos()).toEqual([]);
        });

        it("guardarPedidos() y cargarPedidos() hacen un round trip de pedidos confirmados", function () {
            const pedido = crearPedido();
            const numero = confirmarPedidoConNumeracion(pedido);
            expect(FachadaStorage.guardarPedidos([pedido])).toBeTrue();
            const cargados = FachadaStorage.cargarPedidos();
            expect(cargados.length).toBe(1);
            expect(cargados[0] instanceof Pedido).toBeTrue();
            expect(cargados[0].toJSON().numero).toBe(numero);
        });

        it("cargarPedidos() devuelve [] si el historial está corrupto", function () {
            local.setItem(CLAVES.PEDIDOS, "{no es json");
            expect(FachadaStorage.cargarPedidos()).toEqual([]);
        });

        it("guardarPedidos() devuelve false si no recibe una lista", function () {
            expect(FachadaStorage.guardarPedidos(null)).toBeFalse();
        });

        it("la secuencia es null sin datos y conserva el valor guardado", function () {
            expect(FachadaStorage.cargarSecuenciaPedidos()).toBeNull();
            expect(FachadaStorage.guardarSecuenciaPedidos(7)).toBeTrue();
            expect(FachadaStorage.cargarSecuenciaPedidos()).toBe(7);
        });

        it("guardarSecuenciaPedidos() devuelve false si el storage está lleno", function () {
            local.errorEnSetItem = new DOMException("Cuota", "QuotaExceededError");
            expect(FachadaStorage.guardarSecuenciaPedidos(1)).toBeFalse();
        });
    });

    describe("preferencias y caché del catálogo", function () {
        it("las preferencias hacen round trip y son null sin datos", function () {
            expect(FachadaStorage.cargarPreferencias()).toBeNull();
            expect(FachadaStorage.guardarPreferencias({ tema: "oscuro" })).toBeTrue();
            expect(FachadaStorage.cargarPreferencias()).toEqual({ tema: "oscuro" });
        });

        it("el catálogo en caché hace round trip y es null sin datos", function () {
            expect(FachadaStorage.cargarCatalogo()).toBeNull();
            expect(FachadaStorage.guardarCatalogo(crearCatalogo())).toBeTrue();
            const cargado = FachadaStorage.cargarCatalogo();
            expect(cargado instanceof Catalogo).toBeTrue();
            expect(cargado.obtenerPorCodigo("TAL-01").nombre).toBe("Taladro");
        });

        it("cargarCatalogo() devuelve null si la caché está corrupta", function () {
            local.setItem(CLAVES.CACHE_CATALOGO, "[[");
            expect(FachadaStorage.cargarCatalogo()).toBeNull();
        });
    });

    describe("datos de sesión (sessionStorage)", function () {
        it("el borrador se guarda en sessionStorage, se lee y se elimina", function () {
            expect(FachadaStorage.cargarBorrador()).toBeNull();
            expect(FachadaStorage.guardarBorrador({ nombre: "Ana" })).toBeTrue();
            expect(sesion.getItem(CLAVES.BORRADOR_CHECKOUT)).not.toBeNull();
            expect(local.getItem(CLAVES.BORRADOR_CHECKOUT)).toBeNull();
            expect(FachadaStorage.cargarBorrador()).toEqual({ nombre: "Ana" });
            expect(FachadaStorage.eliminarBorrador()).toBeTrue();
            expect(FachadaStorage.cargarBorrador()).toBeNull();
        });

        it("los filtros se guardan en sessionStorage y se leen", function () {
            expect(FachadaStorage.cargarFiltros()).toBeNull();
            expect(FachadaStorage.guardarFiltros({ categoria: "Jardineria" })).toBeTrue();
            expect(sesion.getItem(CLAVES.FILTROS_CATALOGO)).not.toBeNull();
            expect(FachadaStorage.cargarFiltros()).toEqual({ categoria: "Jardineria" });
        });

        it("la bienvenida figura como no vista hasta que se registra", function () {
            expect(FachadaStorage.bienvenidaVista()).toBeNull();
            expect(FachadaStorage.guardarBienvenidaVista()).toBeTrue();
            expect(FachadaStorage.bienvenidaVista()).toBeTrue();
        });

        it("guardar en sesión devuelve false si el sessionStorage está lleno", function () {
            sesion.errorEnSetItem = new DOMException("Cuota", "QuotaExceededError");
            expect(FachadaStorage.guardarBorrador({ a: 1 })).toBeFalse();
            expect(FachadaStorage.guardarFiltros({ a: 1 })).toBeFalse();
            expect(FachadaStorage.guardarBienvenidaVista()).toBeFalse();
        });
    });

    describe("storage no disponible", function () {
        beforeEach(() => {
            Object.defineProperty(globalThis, "localStorage", {
                configurable: true,
                get() { throw new DOMException("Bloqueado", "SecurityError"); }
            });
        });

        it("cargarCarrito() sigue devolviendo un carrito vacío y guardarCarrito() devuelve false", function () {
            expect(FachadaStorage.cargarCarrito().resumir().items).toEqual([]);
            expect(FachadaStorage.guardarCarrito(crearCarrito())).toBeFalse();
        });

        it("las demás operaciones de localStorage fallan sin lanzar", function () {
            expect(FachadaStorage.cargarPedidos()).toEqual([]);
            expect(FachadaStorage.cargarPreferencias()).toBeNull();
            expect(FachadaStorage.cargarCatalogo()).toBeNull();
            expect(FachadaStorage.guardarPreferencias({ a: 1 })).toBeFalse();
        });
    });
});

/* ---------------- ServicioOfertas ---------------- */

describe("ServicioOfertas.obtenerOfertas", function () {
    it("devuelve las tres ofertas con los datos del catálogo", function () {
        const ofertas = ServicioOfertas.obtenerOfertas(crearCatalogoConOfertas());
        expect(ofertas.map((o) => o.codigo)).toEqual(["AMOLADORA-001", "KIT-TAPONES-001", "MARTILLO-001"]);
        const amoladora = ofertas[0];
        expect(amoladora.nombre).toBe("Nombre AMOLADORA-001");
        expect(amoladora.descripcion).toBe("Desc AMOLADORA-001");
        expect(amoladora.precioActual).toBe(50000);
        expect(amoladora.precioAnterior).toBe(65000);
        expect(amoladora.imagen).toMatch(/^assets\/images\//);
    });

    it("el precio actual sale del catálogo y no de la configuración", function () {
        const ofertas = ServicioOfertas.obtenerOfertas(crearCatalogoConOfertas({ "MARTILLO-001": 12345 }));
        expect(ofertas[2].precioActual).toBe(12345);
    });

    it("el precio anterior siempre es mayor que el actual", function () {
        ServicioOfertas.obtenerOfertas(crearCatalogoConOfertas()).forEach((o) => {
            expect(o.precioAnterior).toBeGreaterThan(o.precioActual);
        });
    });

    it("rechaza algo que no es un Catalogo", function () {
        [null, undefined, {}, [], "x"].forEach((valor) => {
            expect(() => ServicioOfertas.obtenerOfertas(valor)).toThrowError(TypeError, /cat[aá]logo no es v[aá]lido/);
        });
    });

    it("falla con RangeError si falta un producto de la oferta en el catálogo", function () {
        expect(() => ServicioOfertas.obtenerOfertas(crearCatalogo())).toThrowError(RangeError, /Producto no encontrado: AMOLADORA-001/);
    });

    it("falla con RangeError si el precio actual iguala o supera al anterior", function () {
        expect(() => ServicioOfertas.obtenerOfertas(crearCatalogoConOfertas({ "AMOLADORA-001": 65000 })))
            .toThrowError(RangeError, /AMOLADORA-001.*precio anterior/);
        expect(() => ServicioOfertas.obtenerOfertas(crearCatalogoConOfertas({ "KIT-TAPONES-001": 100000 })))
            .toThrowError(RangeError, /KIT-TAPONES-001/);
    });
});

/* ---------------- ServicioCategorias ---------------- */

describe("ServicioCategorias.obtenerCategorias", function () {
    it("devuelve categorías únicas y ordenadas alfabéticamente", function () {
        const catalogo = new Catalogo([
            new Producto({ codigo: "A-1", nombre: "A", categoria: "Jardineria", descripcion: "a", precio: 1 }),
            new Producto({ codigo: "B-1", nombre: "B", categoria: "Accesorios", descripcion: "b", precio: 1 }),
            new Producto({ codigo: "C-1", nombre: "C", categoria: "Jardineria", descripcion: "c", precio: 1 }),
            new Producto({ codigo: "D-1", nombre: "D", categoria: "Electricidad", descripcion: "d", precio: 1 })
        ]);
        expect(ServicioCategorias.obtenerCategorias(catalogo)).toEqual(["Accesorios", "Electricidad", "Jardineria"]);
    });

    it("ordena con criterio del español (una Ñ o una tilde no rompen el orden)", function () {
        const catalogo = new Catalogo([
            new Producto({ codigo: "A-1", nombre: "A", categoria: "Zapatos", descripcion: "a", precio: 1 }),
            new Producto({ codigo: "B-1", nombre: "B", categoria: "Ñandú", descripcion: "b", precio: 1 }),
            new Producto({ codigo: "C-1", nombre: "C", categoria: "Álamo", descripcion: "c", precio: 1 }),
            new Producto({ codigo: "D-1", nombre: "D", categoria: "Nube", descripcion: "d", precio: 1 })
        ]);
        expect(ServicioCategorias.obtenerCategorias(catalogo)).toEqual(["Álamo", "Nube", "Ñandú", "Zapatos"]);
    });

    it("devuelve un arreglo vacío para un catálogo sin productos", function () {
        expect(ServicioCategorias.obtenerCategorias(new Catalogo([]))).toEqual([]);
    });
});

/* ---------------- ServicioOpcionesPago ---------------- */

describe("ServicioOpcionesPago", function () {
    describe("obtenerMetodos", function () {
        it("devuelve los métodos que acepta Pago, con su etiqueta", function () {
            const metodos = ServicioOpcionesPago.obtenerMetodos();
            expect(metodos.map((m) => m.valor)).toEqual(["efectivo-transferencia", "tarjeta"]);
            metodos.forEach((m) => expect(m.etiqueta).toBeTruthy());
        });

        it("cada método devuelto es realmente aceptado por el modelo Pago", function () {
            ServicioOpcionesPago.obtenerMetodos().forEach((m) => {
                expect(() => new Pago(100, m.valor, 1)).not.toThrow();
            });
        });
    });

    describe("obtenerCuotas", function () {
        it("devuelve [] cuando no se eligió método", function () {
            ["", null, undefined].forEach((metodo) => {
                expect(ServicioOpcionesPago.obtenerCuotas(metodo)).toEqual([]);
            });
        });

        it("efectivo/transferencia admite sólo un pago", function () {
            const cuotas = ServicioOpcionesPago.obtenerCuotas("efectivo-transferencia");
            expect(cuotas.length).toBe(1);
            expect(cuotas[0].valor).toBe("1");
            expect(cuotas[0].etiqueta).toMatch(/^1 cuota \(/);
        });

        it("tarjeta ofrece 1, 3, 6 y 12 cuotas según las reglas de Pago", function () {
            const cuotas = ServicioOpcionesPago.obtenerCuotas("tarjeta");
            expect(cuotas.length).toBeGreaterThan(1);
            cuotas.forEach((c) => {
                const n = Number(c.valor);
                const condiciones = new Pago(100, "tarjeta", n).calcular();
                expect(condiciones.cuotas).toBe(n);
                expect(c.etiqueta).toContain(`${condiciones.porcentajeRecargo}%`);
            });
            expect(cuotas[0].valor).toBe("1");
            expect(cuotas[0].etiqueta).toMatch(/^1 cuota \(/);
            expect(cuotas.slice(1).every((c) => /^\d+ cuotas \(/.test(c.etiqueta))).toBeTrue();
        });

        it("un método inexistente no ofrece cuotas", function () {
            expect(ServicioOpcionesPago.obtenerCuotas("cheque")).toEqual([]);
        });
    });
});
