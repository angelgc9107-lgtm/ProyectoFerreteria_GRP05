/**
 * Suites de Jasmine para la lógica de negocio de js/script.js (FerroLab).
 * Se ejecuta en el navegador con js/test/test-runner.html.
 * No se testean funciones con prompt()/alert() (ejecutar*, solicitarDatoValido, preguntarSiNo).
 */

// Catálogo mínimo controlado, independiente del catálogo real.
var catalogoPrueba = [
    { codigo: "A-001", nombre: "Martillo Grande", categoria: "Herramientas manuales", descripcion: "Para obra", precio: 1000 },
    { codigo: "B-002", nombre: "Taladro Eléctrico", categoria: "Herramientas electricas", descripcion: "Perfora hormigón", precio: 5000 },
    { codigo: "C-003", nombre: "Pala", categoria: "Jardineria", descripcion: "Para tierra", precio: 300 }
];

var clienteValido = { nombre: "Juan Pérez", correo: "juan@correo.com", direccion: "Calle 123" };

describe("Flujo 1 - Búsqueda y filtrado", function () {

    describe("normalizarTexto", function () {
        it("pasa a minúsculas, quita tildes y recorta espacios", function () {
            expect(normalizarTexto("  ÁRBOL Eléctrico ")).toBe("arbol electrico");
        });
        it("devuelve string vacío para null, undefined y vacío", function () {
            expect(normalizarTexto(null)).toBe("");
            expect(normalizarTexto(undefined)).toBe("");
            expect(normalizarTexto("")).toBe("");
        });
    });

    describe("validarPrecioMaximo", function () {
        it("acepta números y strings numéricos mayores o iguales a cero", function () {
            expect(validarPrecioMaximo(100)).toEqual({ valido: true, valor: 100 });
            expect(validarPrecioMaximo("250.5").valor).toBe(250.5);
        });
        it("acepta el valor límite 0", function () {
            expect(validarPrecioMaximo(0).valido).toBeTruthy();
            expect(validarPrecioMaximo("0").valor).toBe(0);
        });
        it("rechaza negativos, texto e infinito", function () {
            expect(validarPrecioMaximo(-1).valido).toBeFalsy();
            expect(validarPrecioMaximo("abc").valido).toBeFalsy();
            expect(validarPrecioMaximo(Infinity).valido).toBeFalsy();
        });
        it("permite omitir el precio máximo (vacío, espacios, null o undefined)", function () {
            expect(validarPrecioMaximo("")).toEqual({ valido: true, valor: null });
            expect(validarPrecioMaximo("   ").valido).toBeTruthy();
            expect(validarPrecioMaximo(null).valido).toBeTruthy();
            expect(validarPrecioMaximo(undefined).valor).toBeNull();
        });
        it("informa un mensaje de error y valor null cuando es inválido", function () {
            var r = validarPrecioMaximo("x");
            expect(r.valor).toBeNull();
            expect(r.error).toContain("precio maximo");
        });
    });

    describe("buscarProductos", function () {
        it("filtra por texto sin distinguir mayúsculas ni tildes", function () {
            var r = buscarProductos(catalogoPrueba, { texto: "electrico", categoria: "", precioMaximo: 10000 });
            expect(r.valido).toBeTruthy();
            expect(r.resultados.length).toBe(1);
            expect(r.resultados[0].codigo).toBe("B-002");
        });
        it("filtra por categoría", function () {
            var r = buscarProductos(catalogoPrueba, { texto: "", categoria: "jardineria", precioMaximo: 10000 });
            expect(r.resultados.map(function (p) { return p.codigo; })).toEqual(["C-003"]);
        });
        it("ordena los resultados por precio ascendente", function () {
            var r = buscarProductos(catalogoPrueba, { texto: "", categoria: "", precioMaximo: 10000 });
            expect(r.resultados.map(function (p) { return p.precio; })).toEqual([300, 1000, 5000]);
        });
        it("incluye un producto cuyo precio es exactamente el máximo", function () {
            var r = buscarProductos(catalogoPrueba, { texto: "", categoria: "", precioMaximo: 1000 });
            expect(r.resultados.map(function (p) { return p.codigo; })).toContain("A-001");
            expect(r.resultados.length).toBe(2);
        });
        it("devuelve lista vacía válida cuando nada coincide", function () {
            var r = buscarProductos(catalogoPrueba, { texto: "inexistente", categoria: "", precioMaximo: 10000 });
            expect(r.valido).toBeTruthy();
            expect(r.resultados).toEqual([]);
        });
        it("con precio máximo 0 no devuelve productos", function () {
            var r = buscarProductos(catalogoPrueba, { texto: "", categoria: "", precioMaximo: 0 });
            expect(r.resultados.length).toBe(0);
        });
        it("informa error cuando el precio máximo es inválido", function () {
            var r = buscarProductos(catalogoPrueba, { texto: "", categoria: "", precioMaximo: "abc" });
            expect(r.valido).toBeFalsy();
            expect(r.resultados).toEqual([]);
            expect(r.error).toBeTruthy();
        });
        it("con criterios null o undefined no falla y devuelve todo el catálogo", function () {
            expect(buscarProductos(catalogoPrueba, null).resultados.length).toBe(3);
            expect(buscarProductos(catalogoPrueba, undefined).valido).toBeTruthy();
        });
        it("sin precio máximo no filtra por precio", function () {
            var r = buscarProductos(catalogoPrueba, { texto: "", categoria: "", precioMaximo: "" });
            expect(r.valido).toBeTruthy();
            expect(r.resultados.map(function (p) { return p.codigo; })).toEqual(["C-003", "A-001", "B-002"]);
        });
        it("lanza error si el catálogo es null", function () {
            expect(function () {
                buscarProductos(null, { texto: "", categoria: "", precioMaximo: 100 });
            }).toThrow();
        });
        it("no modifica el catálogo original", function () {
            var copia = JSON.stringify(catalogoPrueba);
            buscarProductos(catalogoPrueba, { texto: "", categoria: "", precioMaximo: 10000 });
            expect(JSON.stringify(catalogoPrueba)).toBe(copia);
        });
    });
});

describe("Flujo 2 - Gestión del carrito", function () {

    describe("validarCantidad", function () {
        it("acepta enteros mayores o iguales a 1, también como string", function () {
            expect(validarCantidad(1)).toBeTruthy();
            expect(validarCantidad("5")).toBeTruthy();
        });
        it("rechaza 0, negativos y decimales", function () {
            expect(validarCantidad(0)).toBeFalsy();
            expect(validarCantidad(-3)).toBeFalsy();
            expect(validarCantidad(2.5)).toBeFalsy();
            expect(validarCantidad("2.5")).toBeFalsy();
        });
        it("rechaza null, undefined, vacío, texto y números fuera de rango seguro", function () {
            expect(validarCantidad(null)).toBeFalsy();
            expect(validarCantidad(undefined)).toBeFalsy();
            expect(validarCantidad("")).toBeFalsy();
            expect(validarCantidad("abc")).toBeFalsy();
            expect(validarCantidad(1e20)).toBeFalsy();
        });
    });

    describe("agregarProductoAlCarrito", function () {
        it("agrega un producto nuevo con su cantidad", function () {
            var r = agregarProductoAlCarrito([], catalogoPrueba, "A-001", 2);
            expect(r.exito).toBeTruthy();
            expect(r.error).toBeNull();
            expect(r.carrito.length).toBe(1);
            expect(r.carrito[0].codigo).toBe("A-001");
            expect(r.carrito[0].cantidad).toBe(2);
            expect(r.carrito[0].precio).toBe(1000);
        });
        it("suma la cantidad si el producto ya estaba en el carrito", function () {
            var inicial = agregarProductoAlCarrito([], catalogoPrueba, "A-001", 2).carrito;
            var r = agregarProductoAlCarrito(inicial, catalogoPrueba, "A-001", 3);
            expect(r.carrito.length).toBe(1);
            expect(r.carrito[0].cantidad).toBe(5);
        });
        it("reconoce el código sin importar mayúsculas ni espacios", function () {
            var r = agregarProductoAlCarrito([], catalogoPrueba, "  a-001 ", 1);
            expect(r.exito).toBeTruthy();
            expect(r.carrito[0].codigo).toBe("A-001");
        });
        it("no modifica el carrito original (inmutabilidad)", function () {
            var original = [];
            agregarProductoAlCarrito(original, catalogoPrueba, "A-001", 1);
            expect(original.length).toBe(0);
        });
        it("falla si el producto no existe en el catálogo", function () {
            var r = agregarProductoAlCarrito([], catalogoPrueba, "ZZZ", 1);
            expect(r.exito).toBeFalsy();
            expect(r.error).toContain("no existe");
        });
        it("falla con código null o undefined", function () {
            expect(agregarProductoAlCarrito([], catalogoPrueba, null, 1).exito).toBeFalsy();
            expect(agregarProductoAlCarrito([], catalogoPrueba, undefined, 1).exito).toBeFalsy();
        });
        it("falla con cantidad 0, negativa, decimal o inválida", function () {
            expect(agregarProductoAlCarrito([], catalogoPrueba, "A-001", 0).exito).toBeFalsy();
            expect(agregarProductoAlCarrito([], catalogoPrueba, "A-001", -1).exito).toBeFalsy();
            expect(agregarProductoAlCarrito([], catalogoPrueba, "A-001", 1.5).exito).toBeFalsy();
            expect(agregarProductoAlCarrito([], catalogoPrueba, "A-001", "x").exito).toBeFalsy();
        });
        it("falla si la cantidad total supera el límite entero seguro", function () {
            var carrito = [{ codigo: "A-001", nombre: "Martillo Grande", categoria: "Herramientas manuales", precio: 1000, cantidad: Number.MAX_SAFE_INTEGER }];
            var r = agregarProductoAlCarrito(carrito, catalogoPrueba, "A-001", 1);
            expect(r.exito).toBeFalsy();
            expect(r.error).toContain("limite");
        });
    });

    describe("cambiarCantidadCarrito", function () {
        var carrito;
        beforeEach(function () {
            carrito = agregarProductoAlCarrito([], catalogoPrueba, "A-001", 2).carrito;
        });
        it("reemplaza la cantidad de un producto del carrito", function () {
            var r = cambiarCantidadCarrito(carrito, "A-001", 7);
            expect(r.exito).toBeTruthy();
            expect(r.carrito[0].cantidad).toBe(7);
        });
        it("no modifica el carrito original", function () {
            cambiarCantidadCarrito(carrito, "A-001", 7);
            expect(carrito[0].cantidad).toBe(2);
        });
        it("falla si el producto no está en el carrito", function () {
            var r = cambiarCantidadCarrito(carrito, "B-002", 3);
            expect(r.exito).toBeFalsy();
            expect(r.error).toContain("no esta en el carrito");
        });
        it("falla con cantidad inválida (0, negativa, null)", function () {
            expect(cambiarCantidadCarrito(carrito, "A-001", 0).exito).toBeFalsy();
            expect(cambiarCantidadCarrito(carrito, "A-001", -2).exito).toBeFalsy();
            expect(cambiarCantidadCarrito(carrito, "A-001", null).exito).toBeFalsy();
        });
    });

    describe("eliminarProductoDelCarrito", function () {
        it("quita el producto indicado", function () {
            var carrito = agregarProductoAlCarrito([], catalogoPrueba, "A-001", 1).carrito;
            carrito = agregarProductoAlCarrito(carrito, catalogoPrueba, "B-002", 1).carrito;
            var r = eliminarProductoDelCarrito(carrito, "A-001");
            expect(r.exito).toBeTruthy();
            expect(r.carrito.length).toBe(1);
            expect(r.carrito[0].codigo).toBe("B-002");
        });
        it("falla si el producto no está en el carrito o el carrito está vacío", function () {
            expect(eliminarProductoDelCarrito([], "A-001").exito).toBeFalsy();
            var carrito = agregarProductoAlCarrito([], catalogoPrueba, "A-001", 1).carrito;
            expect(eliminarProductoDelCarrito(carrito, "ZZZ").exito).toBeFalsy();
        });
        it("falla con código null o undefined", function () {
            var carrito = agregarProductoAlCarrito([], catalogoPrueba, "A-001", 1).carrito;
            expect(eliminarProductoDelCarrito(carrito, null).exito).toBeFalsy();
            expect(eliminarProductoDelCarrito(carrito, undefined).exito).toBeFalsy();
        });
    });

    describe("calcularResumenCarrito", function () {
        it("calcula subtotales y total", function () {
            var carrito = agregarProductoAlCarrito([], catalogoPrueba, "A-001", 2).carrito;
            carrito = agregarProductoAlCarrito(carrito, catalogoPrueba, "C-003", 3).carrito;
            var r = calcularResumenCarrito(carrito);
            expect(r.items[0].subtotal).toBe(2000);
            expect(r.items[1].subtotal).toBe(900);
            expect(r.total).toBe(2900);
            expect(r.cantidadItems).toBe(2);
        });
        it("devuelve total 0 y sin ítems para un carrito vacío", function () {
            expect(calcularResumenCarrito([])).toEqual({ items: [], total: 0, cantidadItems: 0 });
        });
        it("no modifica los ítems del carrito original", function () {
            var carrito = agregarProductoAlCarrito([], catalogoPrueba, "A-001", 1).carrito;
            calcularResumenCarrito(carrito);
            expect(carrito[0].subtotal).toBeUndefined();
        });
    });
});

describe("Flujo 3 - Pago y cálculo de cuotas", function () {

    it("efectivo/transferencia: 1 cuota y 0% de recargo", function () {
        var r = calcularCondicionesPago(10000, "efectivo-transferencia");
        expect(r.valido).toBeTruthy();
        expect(r.cuotas).toBe(1);
        expect(r.porcentajeRecargo).toBe(0);
        expect(r.interes).toBe(0);
        expect(r.totalFinanciado).toBe(10000);
        expect(r.valorCuota).toBe(10000);
    });
    it("tarjeta en 3 cuotas aplica 10% de recargo", function () {
        var r = calcularCondicionesPago(10000, "tarjeta", 3);
        expect(r.valido).toBeTruthy();
        expect(r.porcentajeRecargo).toBe(10);
        expect(r.interes).toBe(1000);
        expect(r.totalFinanciado).toBe(11000);
        expect(r.valorCuota).toBeCloseTo(3666.67, 2);
    });
    it("tarjeta en 6 cuotas aplica 20% de recargo", function () {
        var r = calcularCondicionesPago(6000, "tarjeta", 6);
        expect(r.interes).toBe(1200);
        expect(r.totalFinanciado).toBe(7200);
        expect(r.valorCuota).toBe(1200);
    });
    it("tarjeta en 1 cuota no tiene recargo", function () {
        var r = calcularCondicionesPago(5000, "tarjeta", 1);
        expect(r.valido).toBeTruthy();
        expect(r.totalFinanciado).toBe(5000);
    });
    it("acepta cuotas indicadas como string", function () {
        expect(calcularCondicionesPago(1000, "tarjeta", "3").cuotas).toBe(3);
    });
    it("redondea a dos decimales", function () {
        var r = calcularCondicionesPago(100.555, "tarjeta", 3);
        expect(r.totalOriginal).toBe(100.56);
        expect(r.valorCuota).toBe(Math.round((r.totalFinanciado / 3) * 100) / 100);
    });
    it("funciona con totales muy grandes", function () {
        var r = calcularCondicionesPago(1000000000, "tarjeta", 6);
        expect(r.totalFinanciado).toBe(1200000000);
    });
    it("rechaza total 0, negativo, null, undefined o no numérico", function () {
        expect(calcularCondicionesPago(0, "efectivo-transferencia").valido).toBeFalsy();
        expect(calcularCondicionesPago(-100, "efectivo-transferencia").valido).toBeFalsy();
        expect(calcularCondicionesPago(null, "efectivo-transferencia").valido).toBeFalsy();
        expect(calcularCondicionesPago(undefined, "efectivo-transferencia").valido).toBeFalsy();
        expect(calcularCondicionesPago("abc", "efectivo-transferencia").valido).toBeFalsy();
    });
    it("rechaza un método de pago inválido, null o undefined", function () {
        expect(calcularCondicionesPago(1000, "bitcoin").error).toContain("metodo");
        expect(calcularCondicionesPago(1000, null).valido).toBeFalsy();
        expect(calcularCondicionesPago(1000, undefined).valido).toBeFalsy();
    });
    it("rechaza cantidades de cuotas no ofrecidas con tarjeta", function () {
        expect(calcularCondicionesPago(1000, "tarjeta", 12).valido).toBeFalsy();
        expect(calcularCondicionesPago(1000, "tarjeta", 0).valido).toBeFalsy();
        expect(calcularCondicionesPago(1000, "tarjeta", -3).valido).toBeFalsy();
        expect(calcularCondicionesPago(1000, "tarjeta", undefined).valido).toBeFalsy();
        expect(calcularCondicionesPago(1000, "tarjeta", "abc").valido).toBeFalsy();
    });
    it("la tabla opcionesCuotas ofrece 1, 3 y 6 cuotas", function () {
        expect(Object.keys(opcionesCuotas)).toEqual(["1", "3", "6"]);
    });
});

describe("Flujo 4 - Confirmación del pedido", function () {

    describe("validaciones de datos del cliente", function () {
        it("validarNombre acepta nombres con letras", function () {
            expect(validarNombre("Juan Pérez")).toBeTruthy();
            expect(validarNombre("  Ana ")).toBeTruthy();
        });
        it("validarNombre rechaza vacío, solo espacios y solo números", function () {
            expect(validarNombre("")).toBeFalsy();
            expect(validarNombre("   ")).toBeFalsy();
            expect(validarNombre("12345")).toBeFalsy();
            expect(validarNombre("12,5")).toBeFalsy();
        });
        it("validarNombre rechaza null y undefined", function () {
            expect(validarNombre(null)).toBeFalsy();
            expect(validarNombre(undefined)).toBeFalsy();
        });
        it("validarCorreo acepta un correo con usuario, arroba y dominio", function () {
            expect(validarCorreo("a@b.com")).toBeTruthy();
            expect(validarCorreo("  juan@correo.com ")).toBeTruthy();
        });
        it("validarCorreo rechaza formatos inválidos, null y undefined", function () {
            expect(validarCorreo("sinarroba.com")).toBeFalsy();
            expect(validarCorreo("a@b")).toBeFalsy();
            expect(validarCorreo("@b.com")).toBeFalsy();
            expect(validarCorreo("a b@c.com")).toBeFalsy();
            expect(validarCorreo(null)).toBeFalsy();
            expect(validarCorreo(undefined)).toBeFalsy();
        });
        it("validarDireccion acepta texto y rechaza vacío, espacios, null y undefined", function () {
            expect(validarDireccion("Calle 123")).toBeTruthy();
            expect(validarDireccion("")).toBeFalsy();
            expect(validarDireccion("   ")).toBeFalsy();
            expect(validarDireccion(null)).toBeFalsy();
            expect(validarDireccion(undefined)).toBeFalsy();
        });
        it("validarDatosCliente exige nombre, correo y dirección válidos", function () {
            expect(validarDatosCliente(clienteValido)).toBeTruthy();
            expect(validarDatosCliente({ nombre: "Juan", correo: "mal", direccion: "x" })).toBeFalsy();
            expect(validarDatosCliente({ nombre: "Juan", correo: "j@c.com" })).toBeFalsy();
        });
        it("validarDatosCliente rechaza null, undefined y objeto vacío", function () {
            expect(validarDatosCliente(null)).toBeFalsy();
            expect(validarDatosCliente(undefined)).toBeFalsy();
            expect(validarDatosCliente({})).toBeFalsy();
        });
    });

    describe("crearResumenPedido", function () {
        var carrito, pago;
        beforeEach(function () {
            carrito = agregarProductoAlCarrito([], catalogoPrueba, "A-001", 2).carrito;
            pago = calcularCondicionesPago(calcularResumenCarrito(carrito).total, "tarjeta", 3);
        });
        it("arma el resumen con productos, total y pago", function () {
            var r = crearResumenPedido(carrito, pago, clienteValido);
            expect(r.valido).toBeTruthy();
            expect(r.total).toBe(2000);
            expect(r.productos[0].subtotal).toBe(2000);
            expect(r.pago.cuotas).toBe(3);
            expect(r.cliente.nombre).toBe("Juan Pérez");
        });
        it("recorta los espacios de los datos del cliente", function () {
            var r = crearResumenPedido(carrito, pago, { nombre: " Ana ", correo: " a@b.com ", direccion: " Calle 1 " });
            expect(r.cliente).toEqual({ nombre: "Ana", correo: "a@b.com", direccion: "Calle 1" });
        });
        it("es inválido con carrito vacío", function () {
            expect(crearResumenPedido([], pago, clienteValido).valido).toBeFalsy();
        });
        it("es inválido sin condiciones de pago válidas (null o inválidas)", function () {
            expect(crearResumenPedido(carrito, null, clienteValido).valido).toBeFalsy();
            expect(crearResumenPedido(carrito, { valido: false }, clienteValido).valido).toBeFalsy();
        });
        it("es inválido con datos de cliente incompletos o null", function () {
            expect(crearResumenPedido(carrito, pago, {}).valido).toBeFalsy();
            expect(crearResumenPedido(carrito, pago, null).valido).toBeFalsy();
        });
        it("no comparte la referencia del objeto de pago", function () {
            var r = crearResumenPedido(carrito, pago, clienteValido);
            r.pago.cuotas = 99;
            expect(pago.cuotas).toBe(3);
        });
    });

    describe("crearNumeroPedido", function () {
        it("genera el formato FL-tiempo-secuencia con 4 dígitos", function () {
            expect(crearNumeroPedido(1700000000000, 7)).toBe("FL-1700000000000-0007");
        });
        it("no recorta secuencias de más de 4 dígitos", function () {
            expect(crearNumeroPedido(1, 12345)).toBe("FL-1-12345");
        });
        it("genera números distintos para secuencias distintas", function () {
            expect(crearNumeroPedido(100, 1)).not.toBe(crearNumeroPedido(100, 2));
        });
    });
});