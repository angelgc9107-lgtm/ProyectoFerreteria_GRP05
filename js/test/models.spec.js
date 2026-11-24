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

    it("calcula intereses y cuotas para importes con centavos", function () {
        const casos = [
            { total: 10.01, cuotas: 1, recargo: 0, interes: 0, financiado: 10.01, cuota: 10.01 },
            { total: 100.15, cuotas: 3, recargo: 10, interes: 10.02, financiado: 110.17, cuota: 36.72 },
            { total: 0.35, cuotas: 3, recargo: 10, interes: 0.04, financiado: 0.39, cuota: 0.13 },
            { total: 125.49, cuotas: 6, recargo: 20, interes: 25.1, financiado: 150.59, cuota: 25.1 }
        ];
        for (const caso of casos) {
            expect(new Pago(caso.total, "tarjeta", caso.cuotas).calcular()).toEqual(jasmine.objectContaining({
                totalOriginal: caso.total, cuotas: caso.cuotas, porcentajeRecargo: caso.recargo,
                interes: caso.interes, totalFinanciado: caso.financiado, valorCuota: caso.cuota
            }));
        }
    });

    it("calcula el recargo sobre el total redondeado, no sobre la entrada sin redondear", function () {
        const totalSinRedondear = 100.149;
        const totalRedondeado = 100.15;
        const recargo = 10;
        const interesEsperado = 10.02;
        const totalFinanciadoEsperado = 110.17;
        const cuotaEsperada = 36.72;
        expect(new Pago(totalSinRedondear, "tarjeta", 3).calcular()).toEqual(jasmine.objectContaining({
            totalOriginal: totalRedondeado, porcentajeRecargo: recargo, interes: interesEsperado,
            totalFinanciado: totalFinanciadoEsperado, valorCuota: cuotaEsperada
        }));
        expect(Math.round(totalSinRedondear * recargo) / 100).toBe(10.01);
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

    it("compara el total del pago con el carrito redondeado y admite solo ruido binario", function () {
        const totalCarrito = 0.3;
        const totalConRuidoBinario = 0.1 + 0.2;
        const diferenciaReal = 0.01;
        const carrito = new Carrito([{
            codigo: "A", nombre: "A", categoria: "Prueba", precio: totalCarrito, cantidad: 1
        }]);
        const cliente = { nombre: "Ana", correo: "ana@example.com", direccion: "Calle 1" };
        class PagoConTotalCalculado extends Pago {
            calcular() {
                return { ...super.calcular(), totalOriginal: totalConRuidoBinario };
            }
        }
        expect(() => new Pedido(carrito, new PagoConTotalCalculado(totalCarrito, "tarjeta", 1), cliente))
            .not.toThrow();
        expect(() => new Pedido(carrito, new Pago(totalCarrito + diferenciaReal, "tarjeta", 1), cliente))
            .toThrowError(RangeError);
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

    it("restaura importes equivalentes con diferencias de representación binaria", function () {
        const carrito = new Carrito([{
            codigo: "A", nombre: "A", categoria: "Prueba", precio: 0.1, cantidad: 3
        }]);
        const pedido = new Pedido(carrito, new Pago(carrito.resumir().total, "tarjeta", 3), {
            nombre: "Ana", correo: "ana@example.com", direccion: "Calle 1"
        });
        const datos = pedido.toJSON();
        datos.total = 0.3;
        datos.productos[0].subtotal = 0.3;
        datos.pago.totalOriginal = 0.1 + 0.2;
        datos.pago.interes = 0.01 + 0.02;
        expect(Pedido.fromJSON(JSON.parse(JSON.stringify(datos))).toJSON()).toEqual(pedido.toJSON());
    });

    it("conserva los subtotales sin redondear del carrito al restaurar", function () {
        const carrito = new Carrito([{
            codigo: "A", nombre: "A", categoria: "Prueba", precio: 1.234, cantidad: 1
        }]);
        const pedido = new Pedido(carrito, new Pago(carrito.resumir().total, "tarjeta", 3), {
            nombre: "Ana", correo: "ana@example.com", direccion: "Calle 1"
        });
        const datos = JSON.parse(JSON.stringify(pedido.toJSON()));
        expect(datos.productos[0].subtotal).toBe(1.234);
        expect(Pedido.fromJSON(datos).toJSON()).toEqual(datos);
        datos.productos[0].subtotal = 1.23;
        expect(() => Pedido.fromJSON(datos)).toThrowError(RangeError);
    });

    it("rechaza datos obligatorios ausentes, de tipo incorrecto o no finitos", function () {
        const datos = crearPedido().pedido.toJSON();
        for (const campo of ["valido", "error", "metodoPago", "cuotas", "porcentajeRecargo",
            "totalOriginal", "interes", "totalFinanciado", "valorCuota"]) {
            const pago = { ...datos.pago };
            delete pago[campo];
            expect(() => Pedido.fromJSON({ ...datos, pago })).toThrowError(TypeError);
        }
        expect(() => Pedido.fromJSON({ ...datos, total: "200.3" })).toThrowError(TypeError);
        expect(() => Pedido.fromJSON({ ...datos, numero: 1 })).toThrowError(TypeError);
        expect(() => Pedido.fromJSON({ ...datos, cliente: null })).toThrowError(TypeError);
        for (const valor of [NaN, Infinity, -Infinity]) {
            expect(() => Pedido.fromJSON({ ...datos, total: valor })).toThrowError(RangeError);
            expect(() => Pedido.fromJSON({
                ...datos, productos: [{ ...datos.productos[0], subtotal: valor }]
            })).toThrowError(RangeError);
            expect(() => Pedido.fromJSON({
                ...datos, pago: { ...datos.pago, interes: valor }
            })).toThrowError(RangeError);
        }
    });

    it("rechaza alteraciones monetarias y cambios en condiciones no monetarias", function () {
        const datos = crearPedido().pedido.toJSON();
        for (const cambio of [0.01, 0.001]) {
            expect(() => Pedido.fromJSON({ ...datos, total: datos.total + cambio }))
                .toThrowError(RangeError);
            expect(() => Pedido.fromJSON({
                ...datos, productos: [{ ...datos.productos[0], subtotal: datos.productos[0].subtotal + cambio }]
            })).toThrowError(RangeError);
            for (const campo of ["totalOriginal", "interes", "totalFinanciado", "valorCuota"]) {
                expect(() => Pedido.fromJSON({
                    ...datos, pago: { ...datos.pago, [campo]: datos.pago[campo] + cambio }
                })).toThrowError(RangeError);
            }
        }
        for (const [campo, valor] of [
            ["valido", false], ["error", "error"], ["metodoPago", "efectivo-transferencia"],
            ["cuotas", 6], ["porcentajeRecargo", 10 + 1e-14]
        ]) {
            expect(() => Pedido.fromJSON({
                ...datos, pago: { ...datos.pago, [campo]: valor }
            })).toThrowError(RangeError);
        }
    });

    it("rechaza diferencias monetarias representables incluso con importes grandes", function () {
        const carrito = new Carrito([{
            codigo: "A", nombre: "A", categoria: "Prueba", precio: 1e15, cantidad: 1
        }]);
        const pedido = new Pedido(carrito, new Pago(1e15, "tarjeta", 1), {
            nombre: "Ana", correo: "ana@example.com", direccion: "Calle 1"
        });
        const datos = pedido.toJSON();
        expect(() => Pedido.fromJSON({ ...datos, total: datos.total + 0.125 }))
            .toThrowError(RangeError);
    });

    it("rechaza diferencias arbitrarias pequeñas antes admitidas por la tolerancia absoluta", function () {
        const totalOriginal = 1000000;
        const cambioRepresentable = 1e-10;
        const carrito = new Carrito([{
            codigo: "A", nombre: "A", categoria: "Prueba", precio: totalOriginal, cantidad: 1
        }]);
        const pedido = new Pedido(carrito, new Pago(totalOriginal, "tarjeta", 1), {
            nombre: "Ana", correo: "ana@example.com", direccion: "Calle 1"
        });
        const datos = pedido.toJSON();
        const totalAlterado = datos.total + cambioRepresentable;
        expect(totalAlterado).not.toBe(datos.total);
        expect(() => Pedido.fromJSON({ ...datos, total: totalAlterado })).toThrowError(RangeError);
        expect(() => Pedido.fromJSON({
            ...datos, productos: [{ ...datos.productos[0], subtotal: totalAlterado }]
        })).toThrowError(RangeError);
        expect(() => Pedido.fromJSON({
            ...datos, pago: { ...datos.pago, totalOriginal: totalAlterado }
        })).toThrowError(RangeError);
    });

    it("no normaliza dos subtotales distintos con precisión decimal mayor a 15 cifras", function () {
        const subtotalOriginal = 1.234567890123456;
        const subtotalAlterado = 1.2345678901234562;
        const carrito = new Carrito([{
            codigo: "A", nombre: "A", categoria: "Prueba", precio: subtotalOriginal, cantidad: 1
        }]);
        const pedido = new Pedido(carrito, new Pago(subtotalOriginal, "tarjeta", 1), {
            nombre: "Ana", correo: "ana@example.com", direccion: "Calle 1"
        });
        const datos = pedido.toJSON();
        expect(() => Pedido.fromJSON({
            ...datos, productos: [{ ...datos.productos[0], subtotal: subtotalAlterado }]
        })).toThrowError(RangeError);
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

describe("Cadenas numéricas estrictas", function () {
    it("Carrito rechaza cantidades hexadecimales o exponenciales y acepta dígitos con espacios", function () {
        const carrito = new Carrito();
        for (const cantidad of ["0x10", "1e2", "1_0", "+3", "-3"]) {
            expect(carrito.agregar(crearCatalogo(), "TAL-01", cantidad).exito).toBeFalse();
        }
        expect(carrito.resumir().cantidadUnidades).toBe(0);
        expect(carrito.agregar(crearCatalogo(), "TAL-01", " 3 ").exito).toBeTrue();
        expect(carrito.resumir().cantidadUnidades).toBe(3);
    });

    it("Catalogo rechaza precios máximos hexadecimales o exponenciales y acepta decimales simples", function () {
        const catalogo = crearCatalogo();
        for (const precioMaximo of ["0x10", "1e3", "Infinity", "-5"]) {
            expect(catalogo.buscar({ precioMaximo }).valido).toBeFalse();
        }
        const resultado = catalogo.buscar({ precioMaximo: " 50.5 " });
        expect(resultado.valido).toBeTrue();
        expect(resultado.resultados.map((p) => p.codigo)).toEqual(["MAR-02", "PIN-03"]);
    });

    it("Pago rechaza totales y cuotas hexadecimales o exponenciales", function () {
        for (const total of ["0x10", "1e2", "-5"]) {
            expect(() => new Pago(total, "efectivo-transferencia")).toThrow();
        }
        for (const cuotas of ["0x3", "3e0"]) {
            expect(() => new Pago(100, "tarjeta", cuotas)).toThrow();
        }
        expect(new Pago(" 100.5 ", "tarjeta", " 3 ").calcular().cuotas).toBe(3);
    });
});

// ---------------------------------------------------------------------------
// Casos borde y validaciones: ramas que las suites anteriores no recorrían
// ---------------------------------------------------------------------------

describe("Carrito: validación de instantáneas y casos borde", function () {
    const base = { codigo: "A-1", nombre: "Producto", categoria: "Cat", precio: 10, cantidad: 1 };

    it("rechaza un valor que no es un arreglo", function () {
        expect(() => new Carrito("x")).toThrowError(TypeError);
        expect(() => new Carrito({})).toThrowError(TypeError);
    });

    it("rechaza ítems que no son objetos", function () {
        [null, undefined, 5, "x", [], [1]].forEach((item) => {
            expect(() => new Carrito([item])).toThrowError(TypeError);
        });
    });

    it("rechaza campos de texto que no son cadenas o están vacíos", function () {
        ["codigo", "nombre", "categoria"].forEach((campo) => {
            expect(() => new Carrito([{ ...base, [campo]: 5 }])).toThrowError(TypeError, new RegExp(campo));
            expect(() => new Carrito([{ ...base, [campo]: "   " }])).toThrowError(RangeError, /vacio/);
        });
    });

    it("rechaza precio o cantidad que no son números", function () {
        expect(() => new Carrito([{ ...base, precio: "10" }])).toThrowError(TypeError);
        expect(() => new Carrito([{ ...base, cantidad: "1" }])).toThrowError(TypeError);
    });

    it("rechaza precios no finitos o negativos y cantidades no enteras o menores que uno", function () {
        [NaN, Infinity, -1].forEach((precio) => {
            expect(() => new Carrito([{ ...base, precio }])).toThrowError(RangeError);
        });
        [0, -2, 1.5, NaN, Number.MAX_SAFE_INTEGER + 1].forEach((cantidad) => {
            expect(() => new Carrito([{ ...base, cantidad }])).toThrowError(RangeError);
        });
    });

    it("rechaza códigos repetidos sin distinguir mayúsculas ni espacios", function () {
        expect(() => new Carrito([base, { ...base, codigo: " a-1 " }])).toThrowError(RangeError, /unicos/);
    });

    it("rechaza un total que no es finito o una suma de unidades que no es un entero seguro", function () {
        expect(() => new Carrito([{ ...base, precio: 1e308, cantidad: 10 }])).toThrowError(RangeError, /limite/);
        expect(() => new Carrito([
            { ...base, cantidad: Number.MAX_SAFE_INTEGER },
            { ...base, codigo: "B-2", cantidad: 5 }
        ])).toThrowError(RangeError, /limite/);
    });

    it("agregar() informa cuando la cantidad total supera el límite entero seguro", function () {
        const carrito = new Carrito();
        const catalogo = crearCatalogo();
        expect(carrito.agregar(catalogo, "TAL-01", Number.MAX_SAFE_INTEGER).exito).toBeTrue();
        const resultado = carrito.agregar(catalogo, "TAL-01", 1);
        expect(resultado.exito).toBeFalse();
        expect(resultado.error).toMatch(/limite/);
        expect(carrito.resumir().items[0].cantidad).toBe(Number.MAX_SAFE_INTEGER);
    });

    it("cambiarCantidad() rechaza códigos inexistentes o que no son cadenas", function () {
        const carrito = crearCarrito();
        [null, undefined, 5, {}, "NO-EXISTE"].forEach((codigo) => {
            const resultado = carrito.cambiarCantidad(codigo, 3);
            expect(resultado.exito).toBeFalse();
            expect(resultado.error).toBe("El producto no esta en el carrito.");
        });
        expect(carrito.resumir().items[0].cantidad).toBe(2);
    });

    it("cambiarCantidad() rechaza un cambio que haría infinito el total y no modifica el carrito", function () {
        const carrito = new Carrito([{ ...base, precio: 1e300 }]);
        const resultado = carrito.cambiarCantidad("A-1", 1e10);
        expect(resultado.exito).toBeFalse();
        expect(carrito.resumir().items[0].cantidad).toBe(1);
    });

    it("eliminar() rechaza códigos inexistentes o que no son cadenas", function () {
        const carrito = crearCarrito();
        [null, 5, "NO-EXISTE"].forEach((codigo) => {
            expect(carrito.eliminar(codigo).exito).toBeFalse();
        });
        expect(carrito.resumir().items.length).toBe(1);
    });

    it("fromJSON() rechaza datos que no tienen la forma {items: []}", function () {
        [null, undefined, [], "x", {}, { items: "x" }].forEach((datos) => {
            expect(() => Carrito.fromJSON(datos)).toThrowError(TypeError);
        });
    });

    it("vaciar() deja el carrito sin ítems", function () {
        const carrito = crearCarrito();
        carrito.vaciar();
        expect(carrito.resumir().items).toEqual([]);
        expect(carrito.resumir().total).toBe(0);
    });
});

describe("Pedido: validación de campos, confirmación y reconstrucción", function () {
    const cliente = { nombre: "Ana Pérez", correo: "ana@example.com", direccion: "Calle 123" };

    it("el constructor rechaza clientes que no son objetos", function () {
        const carrito = crearCarrito();
        const pago = new Pago(carrito.resumir().total, "efectivo-transferencia");
        [null, undefined, [], "x", 5].forEach((dato) => {
            expect(() => new Pedido(carrito, pago, dato)).toThrowError(TypeError, /cliente/);
        });
    });

    it("el constructor indica el campo cuando un dato del cliente no es una cadena o no es válido", function () {
        const carrito = crearCarrito();
        const pago = new Pago(carrito.resumir().total, "efectivo-transferencia");
        ["nombre", "correo", "direccion"].forEach((campo) => {
            let error = null;
            try { new Pedido(carrito, pago, { ...cliente, [campo]: 7 }); } catch (e) { error = e; }
            expect(error instanceof TypeError).toBeTrue();
            expect(error.campo).toBe(campo);
            error = null;
            try { new Pedido(carrito, pago, { ...cliente, [campo]: " " }); } catch (e) { error = e; }
            expect(error instanceof RangeError).toBeTrue();
            expect(error.campo).toBe(campo);
        });
    });

    it("confirmar() rechaza una segunda confirmación y parámetros inválidos", function () {
        const { pedido } = crearPedido();
        expect(() => pedido.confirmar("1", 1)).toThrowError(TypeError);
        expect(() => pedido.confirmar(1, "1")).toThrowError(TypeError);
        [[-1, 1], [1.5, 1], [Number.MAX_SAFE_INTEGER + 1, 1], [1, 0], [1, 1.5], [1, -3]].forEach(([fecha, secuencia]) => {
            expect(() => pedido.confirmar(fecha, secuencia)).toThrowError(RangeError);
        });
        expect(pedido.confirmar(1700000000000, 7)).toBe("FL-1700000000000-0007");
        expect(() => pedido.confirmar(1700000000001, 8)).toThrowError(RangeError, /ya fue confirmado/);
    });

    it("fromJSON() reconstruye un pedido confirmado con su número", function () {
        const { pedido } = crearPedido();
        pedido.confirmar(1700000000000, 12);
        const copia = Pedido.fromJSON(JSON.parse(JSON.stringify(pedido)));
        expect(copia.toJSON()).toEqual(pedido.toJSON());
    });

    describe("fromJSON() con datos inválidos", function () {
        const datosValidos = () => JSON.parse(JSON.stringify(crearPedido().pedido));

        it("rechaza estructuras incompletas", function () {
            [null, undefined, [], "x", {}, { ...datosValidos(), productos: "x" },
                { ...datosValidos(), pago: null }, { ...datosValidos(), pago: [] },
                { ...datosValidos(), total: "1" }].forEach((datos) => {
                expect(() => Pedido.fromJSON(datos)).toThrowError(TypeError);
            });
            const sinNumero = datosValidos();
            delete sinNumero.numero;
            expect(() => Pedido.fromJSON(sinNumero)).toThrowError(TypeError);
        });

        it("rechaza un número que no es cadena ni null", function () {
            expect(() => Pedido.fromJSON({ ...datosValidos(), numero: 5 })).toThrowError(TypeError, /numero/);
        });

        it("rechaza números con formato incorrecto", function () {
            ["", "XX-1-0001", "FL-1-12", "FL-1-0000", "FL--0001", "FL-1.5-0001", "FL-1-0001x", "fl-1-0001"].forEach((numero) => {
                expect(() => Pedido.fromJSON({ ...datosValidos(), numero })).toThrowError(RangeError, /numero/);
            });
        });

        it("rechaza números con ceros de más en la fecha o en la secuencia sin normalizar", function () {
            expect(() => Pedido.fromJSON({ ...datosValidos(), numero: "FL-01-0001" })).toThrowError(RangeError);
            expect(() => Pedido.fromJSON({ ...datosValidos(), numero: "FL-1-00001" })).toThrowError(RangeError);
        });

        it("rechaza subtotales que no son números", function () {
            const datos = datosValidos();
            datos.productos[0].subtotal = "200.3";
            expect(() => Pedido.fromJSON(datos)).toThrowError(TypeError, /subtotales/);
        });

        it("rechaza importes inconsistentes en el total o en un subtotal", function () {
            const total = datosValidos();
            total.total += 1;
            expect(() => Pedido.fromJSON(total)).toThrowError(RangeError, /inconsistentes/);
            const subtotal = datosValidos();
            subtotal.productos[0].subtotal += 1;
            expect(() => Pedido.fromJSON(subtotal)).toThrowError(RangeError, /inconsistentes/);
        });

        it("acepta diferencias que son sólo ruido de coma flotante", function () {
            const datos = datosValidos();
            datos.total = datos.total + Number.EPSILON;
            expect(() => Pedido.fromJSON(datos)).not.toThrow();
        });

        it("rechaza condiciones de pago con tipos inválidos", function () {
            [["valido", "si"], ["error", 5], ["metodoPago", 5], ["cuotas", "3"], ["porcentajeRecargo", null],
                ["totalOriginal", "x"], ["interes", undefined], ["totalFinanciado", {}], ["valorCuota", "1"]].forEach(([campo, valor]) => {
                const datos = datosValidos();
                datos.pago[campo] = valor;
                expect(() => Pedido.fromJSON(datos)).toThrowError(TypeError, /pago/);
            });
        });

        it("rechaza condiciones de pago que no corresponden al método y las cuotas", function () {
            const interes = datosValidos();
            interes.pago.interes += 1;
            expect(() => Pedido.fromJSON(interes)).toThrowError(RangeError, /inconsistentes/);
            const recargo = datosValidos();
            recargo.pago.porcentajeRecargo = 0;
            expect(() => Pedido.fromJSON(recargo)).toThrowError(RangeError, /inconsistentes/);
        });

        it("rechaza un cliente inválido indicando el campo", function () {
            const datos = datosValidos();
            datos.cliente.correo = "sin-arroba";
            let error = null;
            try { Pedido.fromJSON(datos); } catch (e) { error = e; }
            expect(error instanceof RangeError).toBeTrue();
            expect(error.campo).toBe("correo");
        });
    });
});

describe("Pago: método con cuotas", function () {
    it("admiteCuotas() es verdadero sólo para tarjeta", function () {
        expect(Pago.admiteCuotas("tarjeta")).toBeTrue();
        ["efectivo-transferencia", "", "Tarjeta", undefined, null, 3].forEach((metodo) => {
            expect(Pago.admiteCuotas(metodo)).toBeFalse();
        });
    });
});

describe("Pago y Pedido: validaciones restantes", function () {
    it("Pago rechaza un método de pago que no es una cadena", function () {
        [5, null, undefined, {}].forEach((metodo) => {
            expect(() => new Pago(100, metodo)).toThrowError(TypeError, /metodo de pago/);
        });
    });

    describe("RC51: límites y contratos complementarios", function () {
        it("Producto valida todos los campos textuales y restaura una copia independiente", function () {
            for (const campo of ["codigo", "nombre", "categoria", "descripcion"]) {
                expect(() => crearProducto({ [campo]: null })).toThrowError(TypeError);
                expect(() => crearProducto({ [campo]: " \t " })).toThrowError(RangeError);
            }
            expect(() => Producto.fromJSON({ ...crearProducto().toJSON(), precio: Infinity }))
                .toThrowError(RangeError);
            const datos = crearProducto().toJSON();
            const copia = Producto.fromJSON(datos);
            datos.nombre = "Modificado";
            expect(copia.nombre).toBe("Taladro Eléctrico");
        });

        it("Producto busca en la descripción y combina criterios sin normalizarlos de nuevo", function () {
            const producto = crearProducto();
            expect(producto.coincide({ texto: "hormigon" })).toBeTrue();
            expect(producto.coincide({ texto: "inexistente" })).toBeFalse();
            expect(producto.coincide({ texto: "ELECTRICO" })).toBeFalse();
            expect(producto.coincide({ texto: "taladro", precioMaximo: 0 })).toBeFalse();
        });

        it("Catalogo acepta la colección vacía y rechaza colecciones dispersas o no arreglos", function () {
            const vacio = new Catalogo();
            expect(vacio.buscar()).toEqual({ valido: true, error: null, resultados: [] });
            expect(vacio.obtenerPorCodigo("A")).toBeNull();
            expect(() => new Catalogo(null)).toThrowError(TypeError);
            expect(() => new Catalogo(new Array(1))).toThrowError(TypeError);
            expect(() => Catalogo.fromJSON({ productos: new Array(1) })).toThrowError(TypeError);
        });

        it("Catalogo distingue precio cero del filtro omitido y valida tipos de criterios", function () {
            const gratis = crearProducto({ codigo: "GRATIS", precio: 0 });
            const catalogo = new Catalogo([gratis, crearProducto()]);
            for (const precioMaximo of [null, undefined, "", "  "]) {
                expect(catalogo.buscar({ precioMaximo }).resultados.length).toBe(2);
            }
            expect(catalogo.buscar({ precioMaximo: 0 }).resultados).toEqual([gratis]);
            expect(catalogo.buscar({ precioMaximo: "0" }).resultados).toEqual([gratis]);
            for (const criterios of [{ categoria: null }, { precioMaximo: true },
                { precioMaximo: {} }, { precioMaximo: NaN }, { orden: null }]) {
                expect(catalogo.buscar(criterios).valido).toBeFalse();
            }
        });

        it("Carrito rechaza desbordes del total o de unidades entre ítems sin mutar el estado", function () {
            const catalogo = new Catalogo([
                crearProducto({ codigo: "A", precio: 1e308 }),
                crearProducto({ codigo: "B", precio: 1e308 })
            ]);
            const carrito = new Carrito();
            expect(carrito.agregar(catalogo, "A", 1).exito).toBeTrue();
            const antes = carrito.toJSON();
            expect(carrito.agregar(catalogo, "B", 1).exito).toBeFalse();
            expect(carrito.toJSON()).toEqual(antes);

            const unidades = new Carrito([
                { codigo: "A", nombre: "A", categoria: "Cat", precio: 0, cantidad: Number.MAX_SAFE_INTEGER }
            ]);
            const catalogoGratis = new Catalogo([crearProducto({ codigo: "B", precio: 0 })]);
            const anterior = unidades.toJSON();
            expect(unidades.agregar(catalogoGratis, "B", 1).exito).toBeFalse();
            expect(unidades.toJSON()).toEqual(anterior);
        });

        it("Carrito restaura vacío y sus copias serializadas no alteran las instantáneas", function () {
            expect(Carrito.fromJSON({ items: [] }).resumir()).toEqual({
                items: [], total: 0, cantidadItems: 0, cantidadUnidades: 0
            });
            const carrito = crearCarrito();
            const copia = carrito.toJSON();
            copia.items[0].precio = 0;
            expect(carrito.resumir().total).toBe(200.3);
        });

        it("Pago respeta el redondeo binario y conserva la entrada sin redondear al restaurar", function () {
            expect(new Pago(1.005, "efectivo-transferencia").calcular().totalOriginal).toBe(1);
            const pago = new Pago(1.006, "efectivo-transferencia");
            expect(pago.calcular().totalOriginal).toBe(1.01);
            expect(Pago.fromJSON(JSON.parse(JSON.stringify(pago))).toJSON().totalOriginal).toBe(1.006);
            expect(() => new Pago(Number.MAX_VALUE, "efectivo-transferencia"))
                .toThrowError(RangeError);
        });

        it("Pago rechaza estructuras inválidas y cuotas no numéricas al restaurar", function () {
            for (const datos of [null, [], {}, { totalOriginal: 100, metodoPago: "tarjeta", cuotas: "3" }]) {
                expect(() => Pago.fromJSON(datos)).toThrowError(TypeError);
            }
            expect(() => new Pago(100, "tarjeta", null)).toThrowError(TypeError);
            expect(() => new Pago(100, "tarjeta", 1.5)).toThrowError(RangeError);
        });

        it("Pedido protege las copias del resumen y de la serialización", function () {
            const pedido = crearPedido().pedido;
            const resumen = pedido.resumir();
            resumen.cliente.nombre = "Otro";
            resumen.productos[0].cantidad = 99;
            resumen.pago.cuotas = 6;
            const datos = pedido.toJSON();
            datos.productos[0].precio = 0;
            expect(pedido.resumir().cliente.nombre).toBe("Ana Pérez");
            expect(pedido.resumir().productos[0].cantidad).toBe(2);
            expect(pedido.resumir().productos[0].precio).toBe(100.15);
            expect(pedido.resumir().pago.cuotas).toBe(3);
        });

        it("Pedido admite los enteros seguros máximos y mantiene la confirmación al restaurar", function () {
            const pedido = crearPedido().pedido;
            const maximo = Number.MAX_SAFE_INTEGER;
            const numero = `FL-${maximo}-${maximo}`;
            expect(pedido.confirmar(maximo, maximo)).toBe(numero);
            const restaurado = Pedido.fromJSON(JSON.parse(JSON.stringify(pedido)));
            expect(restaurado.toJSON().numero).toBe(numero);
            expect(() => restaurado.confirmar(1, 1)).toThrowError(RangeError);
        });

        it("Pedido rechaza números restaurados fuera del rango seguro", function () {
            const datos = crearPedido().pedido.toJSON();
            const fueraDeRango = String(Number.MAX_SAFE_INTEGER + 1);
            for (const numero of [`FL-${fueraDeRango}-0001`, `FL-1-${fueraDeRango}`]) {
                expect(() => Pedido.fromJSON({ ...datos, numero })).toThrowError(RangeError);
            }
            expect(() => crearPedido().pedido.confirmar(1, Number.MAX_SAFE_INTEGER + 1))
                .toThrowError(RangeError);
        });
    });

    it("Pago informa si el recargo desborda a un importe infinito", function () {
        expect(() => new Pago(1.7e308, "tarjeta", 3)).toThrowError(RangeError, /finitos/);
    });

    it("Pedido rechaza un pago que no es una instancia de Pago", function () {
        const carrito = crearCarrito();
        [null, {}, { calcular: () => ({}) }].forEach((pago) => {
            expect(() => new Pedido(carrito, pago, { nombre: "Ana", correo: "a@b.co", direccion: "x" }))
                .toThrowError(TypeError, /instancia de Pago/);
        });
    });
});
