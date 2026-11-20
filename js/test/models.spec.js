import { Producto } from "../models/Producto.js";
import { Catalogo } from "../models/Catalogo.js";
import { Carrito } from "../models/Carrito.js";
import { Pago } from "../models/Pago.js";
import { Pedido } from "../models/Pedido.js";

const { describe, it, expect } = globalThis;

function crearProducto(datos = {}) {
    return new Producto({
        codigo: "TAL-01",
        nombre: "Taladro Eléctrico",
        categoria: "Herramientas eléctricas",
        descripcion: "Taladro percutor para hormigón",
        precio: 100.15,
        ...datos
    });
}

function crearCatalogo() {
    return new Catalogo([
        crearProducto(),
        crearProducto({
            codigo: "MAR-02", nombre: "Martillo", categoria: "Herramientas manuales",
            descripcion: "Martillo de acero", precio: 20
        }),
        crearProducto({
            codigo: "PIN-03", nombre: "Pintura", categoria: "Pinturas",
            descripcion: "Pintura para exterior", precio: 50
        })
    ]);
}

function crearCarrito() {
    const carrito = new Carrito();
    carrito.agregar(crearCatalogo(), "TAL-01", 2);
    return carrito;
}

function crearPedido() {
    const carrito = crearCarrito();
    const pago = new Pago(carrito.resumir().total, "tarjeta", 3);
    const cliente = { nombre: " Ana Pérez ", correo: "ana@example.com", direccion: " Calle 123 " };
    return { carrito, pago, cliente, pedido: new Pedido(carrito, pago, cliente) };
}

describe("Producto", function () {
    it("recorta y expone los datos válidos mediante getters", function () {
        const producto = crearProducto({
            codigo: " TAL-01 ", nombre: " Taladro ", categoria: " Herramientas ",
            descripcion: " Para obra ", precio: 0
        });
        expect(producto.codigo).toBe("TAL-01");
        expect(producto.nombre).toBe("Taladro");
        expect(producto.categoria).toBe("Herramientas");
        expect(producto.descripcion).toBe("Para obra");
        expect(producto.precio).toBe(0);
    });

    it("rechaza datos que no son un objeto y campos de texto no válidos", function () {
        expect(() => new Producto(null)).toThrowError(TypeError);
        expect(() => new Producto([])).toThrowError(TypeError);
        expect(() => crearProducto({ nombre: "" })).toThrowError(RangeError);
        expect(() => crearProducto({ categoria: 4 })).toThrowError(TypeError);
    });

    it("rechaza precios no numéricos, no finitos o negativos", function () {
        expect(() => crearProducto({ precio: "10" })).toThrowError(TypeError);
        expect(() => crearProducto({ precio: NaN })).toThrowError(RangeError);
        expect(() => crearProducto({ precio: -0.01 })).toThrowError(RangeError);
    });

    it("coincide con texto, categoría y precio máximo ya normalizados", function () {
        const producto = crearProducto();
        expect(producto.coincide({
            texto: "electrico", categoria: "herramientas electricas", precioMaximo: 100.15
        })).toBeTrue();
        expect(producto.coincide({ precioMaximo: 100 })).toBeFalse();
        expect(producto.coincide({ categoria: "pinturas" })).toBeFalse();
        expect(producto.coincide()).toBeTrue();
    });

    it("serializa y restaura una copia validada", function () {
        const original = crearProducto();
        const datos = original.toJSON();
        const restaurado = Producto.fromJSON(datos);
        expect(datos).toEqual({
            codigo: "TAL-01", nombre: "Taladro Eléctrico",
            categoria: "Herramientas eléctricas",
            descripcion: "Taladro percutor para hormigón", precio: 100.15
        });
        expect(restaurado.toJSON()).toEqual(original.toJSON());
        expect(() => Producto.fromJSON({ ...datos, precio: -1 })).toThrowError(RangeError);
    });
});

describe("Catalogo", function () {
    it("conserva productos únicos y devuelve una copia del arreglo", function () {
        const catalogo = crearCatalogo();
        const productos = catalogo.obtenerProductos();
        productos.pop();
        expect(catalogo.obtenerProductos().length).toBe(3);
        expect(catalogo.obtenerPorCodigo(" tal-01 ")).toBe(catalogo.obtenerProductos()[0]);
        expect(catalogo.obtenerPorCodigo(1)).toBeNull();
        expect(catalogo.obtenerPorCodigo("no-existe")).toBeNull();
    });

    it("rechaza elementos que no son Producto y códigos duplicados sin distinguir mayúsculas", function () {
        expect(() => new Catalogo([{}])).toThrowError(TypeError);
        expect(() => new Catalogo([crearProducto(), crearProducto({ codigo: " tal-01 " })]))
            .toThrowError(RangeError);
    });

    it("busca por texto y categoría sin distinguir mayúsculas ni tildes", function () {
        const resultado = crearCatalogo().buscar({
            texto: "ELECTRICO", categoria: "herramientas electricas"
        });
        expect(resultado.valido).toBeTrue();
        expect(resultado.error).toBeNull();
        expect(resultado.resultados.map((producto) => producto.codigo)).toEqual(["TAL-01"]);
    });

    it("acepta búsqueda vacía, límite inclusivo y orden ascendente o descendente", function () {
        const catalogo = crearCatalogo();
        expect(catalogo.buscar().resultados.map((producto) => producto.precio))
            .toEqual([20, 50, 100.15]);
        expect(catalogo.buscar({ precioMaximo: "50" }).resultados.map((producto) => producto.precio))
            .toEqual([20, 50]);
        expect(catalogo.buscar({ orden: "desc" }).resultados.map((producto) => producto.precio))
            .toEqual([100.15, 50, 20]);
    });

    it("devuelve un resultado explícito de error ante criterios inválidos", function () {
        const catalogo = crearCatalogo();
        for (const criterios of [null, [], { texto: 2 }, { orden: "random" },
            { precioMaximo: -1 }, { precioMaximo: Infinity }]) {
            const resultado = catalogo.buscar(criterios);
            expect(resultado.valido).toBeFalse();
            expect(resultado.error).toEqual(jasmine.any(String));
            expect(resultado.resultados).toEqual([]);
        }
    });

    it("serializa y restaura el catálogo validando sus productos y códigos", function () {
        const catalogo = crearCatalogo();
        const datos = catalogo.toJSON();
        expect(Catalogo.fromJSON(datos).toJSON()).toEqual(datos);
        expect(Catalogo.fromJSON({ productos: [] }).obtenerProductos()).toEqual([]);
        expect(() => Catalogo.fromJSON({
            productos: [datos.productos[0], datos.productos[0]]
        })).toThrowError(RangeError);
        expect(() => Catalogo.fromJSON({})).toThrowError(TypeError);
    });
});

describe("Carrito", function () {
    it("agrega productos y resume subtotales, total, ítems y unidades", function () {
        const resumen = crearCarrito().resumir();
        expect(resumen).toEqual({
            items: [{
                codigo: "TAL-01", nombre: "Taladro Eléctrico",
                categoria: "Herramientas eléctricas", precio: 100.15,
                cantidad: 2, subtotal: 200.3
            }],
            total: 200.3, cantidadItems: 1, cantidadUnidades: 2
        });
    });

    it("suma cantidades existentes y acepta cantidades como cadena numérica", function () {
        const carrito = crearCarrito();
        expect(carrito.agregar(crearCatalogo(), " tal-01 ", "3"))
            .toEqual({ exito: true, error: null });
        expect(carrito.resumir().items[0].cantidad).toBe(5);
        expect(carrito.resumir().cantidadItems).toBe(1);
        expect(carrito.resumir().cantidadUnidades).toBe(5);
    });

    it("rechaza catálogo, producto y cantidad inválidos sin cambiar el carrito", function () {
        const carrito = crearCarrito();
        const antes = carrito.toJSON();
        for (const [catalogo, codigo, cantidad] of [
            [{}, "TAL-01", 1], [crearCatalogo(), "no-existe", 1],
            [crearCatalogo(), "TAL-01", 0], [crearCatalogo(), "TAL-01", 1.5],
            [crearCatalogo(), "TAL-01", " "]
        ]) {
            expect(carrito.agregar(catalogo, codigo, cantidad).exito).toBeFalse();
        }
        expect(carrito.toJSON()).toEqual(antes);
    });

    it("rechaza desbordes de cantidad y mantiene el estado anterior", function () {
        const carrito = new Carrito([{
            codigo: "A", nombre: "Producto A", categoria: "Prueba",
            precio: 1, cantidad: Number.MAX_SAFE_INTEGER
        }]);
        const resultado = carrito.agregar(
            new Catalogo([crearProducto({ codigo: "A" })]), "A", 1
        );
        expect(resultado.exito).toBeFalse();
        expect(carrito.resumir().items[0].cantidad).toBe(Number.MAX_SAFE_INTEGER);
        expect(() => new Carrito([{
            codigo: "A", nombre: "A", categoria: "Prueba", precio: 1,
            cantidad: Number.MAX_SAFE_INTEGER + 1
        }])).toThrowError(RangeError);
    });

    it("cambia y elimina cantidades por código normalizado y reporta ítems ausentes", function () {
        const carrito = crearCarrito();
        expect(carrito.cambiarCantidad(" tal-01 ", "4"))
            .toEqual({ exito: true, error: null });
        expect(carrito.resumir().cantidadUnidades).toBe(4);
        expect(carrito.cambiarCantidad("otro", 1).exito).toBeFalse();
        expect(carrito.cambiarCantidad("TAL-01", 0).exito).toBeFalse();
        expect(carrito.eliminar("TAL-01")).toEqual({ exito: true, error: null });
        expect(carrito.eliminar("TAL-01").exito).toBeFalse();
        expect(carrito.resumir()).toEqual({
            items: [], total: 0, cantidadItems: 0, cantidadUnidades: 0
        });
    });

    it("no expone referencias modificables en el resumen y vacía el carrito", function () {
        const carrito = crearCarrito();
        const resumen = carrito.resumir();
        resumen.items[0].cantidad = 99;
        resumen.items[0].nombre = "Alterado";
        expect(carrito.resumir().items[0].cantidad).toBe(2);
        carrito.vaciar();
        expect(carrito.resumir().items).toEqual([]);
    });

    it("valida snapshots y serializa sin incluir subtotales derivados", function () {
        const datos = crearCarrito().toJSON();
        expect(datos.items[0].subtotal).toBeUndefined();
        expect(Carrito.fromJSON(datos).toJSON()).toEqual(datos);
        expect(() => new Carrito({})).toThrowError(TypeError);
        expect(() => new Carrito([{
            codigo: "A", nombre: "A", categoria: "Prueba", precio: -1, cantidad: 1
        }])).toThrowError(RangeError);
        expect(() => Carrito.fromJSON({})).toThrowError(TypeError);
    });
});

describe("Pago", function () {
    it("calcula efectivo o transferencia sin recargo e ignora las cuotas recibidas", function () {
        const resultado = new Pago(
            "100.15", "efectivo-transferencia", "no aplica"
        ).calcular();
        expect(resultado).toEqual({
            valido: true, error: null, metodoPago: "efectivo-transferencia",
            cuotas: 1, porcentajeRecargo: 0, totalOriginal: 100.15,
            interes: 0, totalFinanciado: 100.15, valorCuota: 100.15
        });
    });

    it("aplica las tasas disponibles de tarjeta y redondea importes", function () {
        expect(new Pago(100, "tarjeta", 1).calcular().porcentajeRecargo).toBe(0);
        const tresCuotas = new Pago(100.1, "tarjeta", "3").calcular();
        expect(tresCuotas).toEqual(jasmine.objectContaining({
            porcentajeRecargo: 10, totalOriginal: 100.1, interes: 10.01,
            totalFinanciado: 110.11, valorCuota: 36.7
        }));
        expect(new Pago(100, "tarjeta", 6).calcular().porcentajeRecargo).toBe(20);
    });

    it("rechaza totales, métodos y cuotas inválidos", function () {
        for (const total of [0, -1, NaN, Infinity, "", null]) {
            expect(() => new Pago(total, "tarjeta", 3)).toThrow();
        }
        expect(() => new Pago(100, "bitcoin")).toThrowError(RangeError);
        expect(() => new Pago(100, "tarjeta", 2)).toThrowError(RangeError);
        expect(() => new Pago(100, "tarjeta", "")).toThrowError(TypeError);
    });

    it("serializa solo entradas y recalcula condiciones al restaurar", function () {
        const pago = new Pago(125.45, "tarjeta", 6);
        const datos = pago.toJSON();
        expect(datos).toEqual({ totalOriginal: 125.45, metodoPago: "tarjeta", cuotas: 6 });
        expect(Pago.fromJSON(datos).calcular()).toEqual(pago.calcular());
        expect(() => Pago.fromJSON({ ...datos, cuotas: 2 })).toThrowError(RangeError);
        expect(() => Pago.fromJSON({ ...datos, totalOriginal: "125.45" }))
            .toThrowError(TypeError);
        expect(() => Pago.fromJSON({
            totalOriginal: 100, metodoPago: "efectivo-transferencia", cuotas: 3
        })).toThrowError(RangeError);
    });
});

describe("Pedido", function () {
    it("crea una instantánea válida con cliente recortado y resumen del pago", function () {
        const { pedido, cliente } = crearPedido();
        cliente.nombre = "Modificado";
        expect(pedido.resumir().cliente.nombre).toBe("Ana Pérez");
        expect(pedido.resumir().total).toBe(200.3);
        expect(pedido.resumir().productos[0].subtotal).toBe(200.3);
        expect(pedido.resumir().valido).toBeTrue();
    });

    it("rechaza carrito vacío, pago desactualizado y tipos de modelos incorrectos", function () {
        expect(() => new Pedido(
            new Carrito(), new Pago(1, "efectivo-transferencia"), {}
        )).toThrowError(RangeError);
        const carrito = crearCarrito();
        expect(() => new Pedido(
            carrito, new Pago(300, "efectivo-transferencia"),
            { nombre: "Ana", correo: "ana@example.com", direccion: "Calle 1" }
        )).toThrowError(RangeError);
        expect(() => new Pedido(
            {}, new Pago(1, "efectivo-transferencia"), {}
        )).toThrowError(TypeError);
    });

    it("valida cada dato del cliente e indica el campo inválido", function () {
        const carrito = crearCarrito();
        const pago = new Pago(carrito.resumir().total, "efectivo-transferencia");
        for (const [cliente, campo] of [
            [{ nombre: "123.4", correo: "ana@example.com", direccion: "Calle 1" }, "nombre"],
            [{ nombre: "Ana", correo: "inválido", direccion: "Calle 1" }, "correo"],
            [{ nombre: "Ana", correo: "ana@example.com", direccion: " " }, "direccion"]
        ]) {
            try {
                new Pedido(carrito, pago, cliente);
                fail(`Se esperaba validación para ${campo}.`);
            } catch (error) {
                expect(error).toEqual(jasmine.any(RangeError));
                expect(error.campo).toBe(campo);
            }
        }
        expect(() => new Pedido(carrito, pago, {
            nombre: 12, correo: "ana@example.com", direccion: "Calle 1"
        })).toThrowError(TypeError);
    });

    it("confirma una sola vez con números deterministas y rechaza parámetros inválidos", function () {
        const { pedido } = crearPedido();
        expect(pedido.confirmar(0, 1)).toBe("FL-0-0001");
        expect(() => pedido.confirmar(0, 2)).toThrowError(RangeError);
        const sinConfirmar = crearPedido().pedido;
        expect(() => sinConfirmar.confirmar(-1, 1)).toThrowError(RangeError);
        expect(() => sinConfirmar.confirmar(1, 0)).toThrowError(RangeError);
        expect(() => sinConfirmar.confirmar("1", 1)).toThrowError(TypeError);
        expect(sinConfirmar.confirmar(10, 12345)).toBe("FL-10-12345");
    });

    it("mantiene la instantánea al cambiar o vaciar el carrito", function () {
        const { carrito, pedido } = crearPedido();
        const resumenAnterior = pedido.resumir();
        carrito.vaciar();
        expect(pedido.resumir()).toEqual(resumenAnterior);
    });

    it("serializa y restaura pedidos confirmados y pendientes", function () {
        const pendiente = crearPedido().pedido;
        expect(Pedido.fromJSON(pendiente.toJSON()).toJSON()).toEqual(pendiente.toJSON());
        pendiente.confirmar(123, 2);
        const confirmado = Pedido.fromJSON(pendiente.toJSON());
        expect(confirmado.toJSON()).toEqual(pendiente.toJSON());
        expect(() => Pedido.fromJSON({})).toThrowError(TypeError);
    });

    it("rechaza importes, subtotales, pagos y números de pedido inconsistentes", function () {
        const datos = crearPedido().pedido.toJSON();
        expect(() => Pedido.fromJSON({ ...datos, total: datos.total + 1 }))
            .toThrowError(RangeError);
        expect(() => Pedido.fromJSON({
            ...datos, productos: [{ ...datos.productos[0], subtotal: 1 }]
        })).toThrowError(RangeError);
        expect(() => Pedido.fromJSON({
            ...datos, productos: [{ ...datos.productos[0], subtotal: undefined }]
        })).toThrowError(TypeError);
        expect(() => Pedido.fromJSON({
            ...datos, pago: { ...datos.pago, interes: datos.pago.interes + 1 }
        })).toThrowError(RangeError);
        expect(() => Pedido.fromJSON({ ...datos, numero: "pedido-1" }))
            .toThrowError(RangeError);
    });
});