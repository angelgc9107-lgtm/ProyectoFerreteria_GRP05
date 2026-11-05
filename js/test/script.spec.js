/**
 * Suites de Jasmine para la lógica de negocio de js/script.js (FerroLab).
 * Se ejecuta en el navegador con js/test/test-runner.html.
 * Las suites "(lógica pura)" prueban funciones que reciben parámetros y devuelven un resultado.
 * Las suites "(interacción)" prueban ejecutar*, solicitarDatoValido y preguntarSiNo
 * reemplazando prompt() y alert() con espías de Jasmine (spyOn): no se abre ningún cuadro real.
 */

// Catálogo mínimo controlado, independiente del catálogo real.
var catalogoPrueba = [
    { codigo: "A-001", nombre: "Martillo Grande", categoria: "Herramientas manuales", descripcion: "Para obra", precio: 1000 },
    { codigo: "B-002", nombre: "Taladro Eléctrico", categoria: "Herramientas electricas", descripcion: "Perfora hormigón", precio: 5000 },
    { codigo: "C-003", nombre: "Pala", categoria: "Jardineria", descripcion: "Para tierra", precio: 300 }
];

var clienteValido = { nombre: "Juan Pérez", correo: "juan@correo.com", direccion: "Calle 123" };

describe("Flujo 1 - Búsqueda y filtrado (lógica pura)", function () {

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

describe("Flujo 2 - Gestión del carrito (lógica pura)", function () {

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

    describe("formatearMoneda", function () {
        it("formatea con símbolo $, separador de miles y dos decimales (es-AR)", function () {
            expect(formatearMoneda(1234.5)).toBe("$1.234,50");
            expect(formatearMoneda(1234567.891)).toBe("$1.234.567,89");
        });
        it("formatea el cero y acepta strings numéricos", function () {
            expect(formatearMoneda(0)).toBe("$0,00");
            expect(formatearMoneda("250")).toBe("$250,00");
        });
    });

    describe("formatearResumenCarrito", function () {
        it("avisa que el carrito está vacío", function () {
            expect(formatearResumenCarrito(calcularResumenCarrito([]))).toBe("El carrito esta vacio.");
        });
        it("arma una línea por producto y el total", function () {
            var carrito = agregarProductoAlCarrito([], catalogoPrueba, "A-001", 2).carrito;
            carrito = agregarProductoAlCarrito(carrito, catalogoPrueba, "C-003", 3).carrito;
            var texto = formatearResumenCarrito(calcularResumenCarrito(carrito));
            expect(texto).toBe(
                "Martillo Grande | 2 x $1.000,00 = $2.000,00\n" +
                "Pala | 3 x $300,00 = $900,00\n" +
                "Total: $2.900,00"
            );
        });
    });

});

describe("Flujo 3 - Pago y cálculo de cuotas (lógica pura)", function () {

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

describe("Flujo 4 - Confirmación del pedido (lógica pura)", function () {

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
    
    describe("formatearResumenPedido", function () {
        var carrito;
        beforeEach(function () {
            carrito = agregarProductoAlCarrito([], catalogoPrueba, "A-001", 2).carrito;
        });
        it("detalla productos, pago en tarjeta, cuotas, recargo y envío", function () {
            var pago = calcularCondicionesPago(2000, "tarjeta", 3);
            var texto = formatearResumenPedido(crearResumenPedido(carrito, pago, clienteValido));
            expect(texto).toBe(
                "Martillo Grande | 2 x $1.000,00 = $2.000,00\n" +
                "Total original: $2.000,00\n" +
                "Metodo: Tarjeta de credito\n" +
                "Cuotas: 3\n" +
                "Recargo: 10% ($200,00)\n" +
                "Total financiado: $2.200,00\n" +
                "Valor de cada cuota: $733,33\n" +
                "Envio a: Calle 123"
            );
        });
        it("indica efectivo / transferencia, 1 cuota y 0% de recargo", function () {
            var pago = calcularCondicionesPago(2000, "efectivo-transferencia");
            var texto = formatearResumenPedido(crearResumenPedido(carrito, pago, clienteValido));
            expect(texto).toContain("Metodo: Efectivo / transferencia");
            expect(texto).toContain("Cuotas: 1");
            expect(texto).toContain("Recargo: 0% ($0,00)");
        });
    });
});

// ---------------------------------------------------------------------------
// Suites de interacción: prompt() y alert() se reemplazan con espías.
// ---------------------------------------------------------------------------

/** Restablece el estado compartido de script.js (carrito, pago y número de pedido). */
function reiniciarEstado() {
    carritoActual = [];
    condicionesPagoActuales = null;
    secuenciaPedidos = 1;
}

/** Simula las respuestas del usuario a los prompt(), en orden. Falla si se piden más de las previstas. */
function responderPrompts(respuestas) {
    var indice = 0;
    if (!jasmine.isSpy(window.prompt)) {
        spyOn(window, "prompt");
    }
    window.prompt.calls.reset();
    window.prompt.and.callFake(function () {
        if (indice >= respuestas.length) {
            throw new Error("prompt() se llamó más veces de las esperadas (" + respuestas.length + ")");
        }
        return respuestas[indice++];
    });
}

/** Devuelve los mensajes mostrados con alert(), en orden. */
function mensajesAlert() {
    return window.alert.calls.allArgs().map(function (args) { return String(args[0]); });
}

/** Indica si algún alert() mostró un mensaje que contiene el texto indicado. */
function alertContiene(texto) {
    return mensajesAlert().some(function (mensaje) { return mensaje.indexOf(texto) !== -1; });
}

/** Carga el carrito con un producto del catálogo real, usando la lógica pura ya testeada. */
function cargarCarrito(codigo, cantidad) {
    carritoActual = agregarProductoAlCarrito(carritoActual, catalogoProductos, codigo, cantidad).carrito;
}

/** Deja un pago por efectivo elegido, como si el usuario hubiera pasado por el Flujo 3. */
function cargarPagoEfectivo() {
    condicionesPagoActuales = calcularCondicionesPago(calcularResumenCarrito(carritoActual).total, "efectivo-transferencia", 1);
}

function prepararEspias() {
    reiniciarEstado();
    spyOn(window, "alert");
    spyOn(console, "log");
}

describe("Flujo 1 - Búsqueda y filtrado (interacción)", function () {
    beforeEach(prepararEspias);

    describe("preguntarSiNo", function () {
        it("devuelve true para SI, S y Sí, sin importar mayúsculas ni espacios", function () {
            ["SI", " s ", "Sí", "si"].forEach(function (respuesta) {
                responderPrompts([respuesta]);
                expect(preguntarSiNo("¿?")).toBe(true);
            });
        });
        it("devuelve false para NO y N", function () {
            ["NO", "n", " No "].forEach(function (respuesta) {
                responderPrompts([respuesta]);
                expect(preguntarSiNo("¿?")).toBe(false);
            });
        });
        it("devuelve null al cancelar, sin mostrar mensajes", function () {
            responderPrompts([null]);
            expect(preguntarSiNo("¿?")).toBeNull();
            expect(window.alert).not.toHaveBeenCalled();
        });
        it("avisa y vuelve a preguntar si la respuesta no es SI ni NO", function () {
            responderPrompts(["tal vez", "SI"]);
            expect(preguntarSiNo("¿?")).toBe(true);
            expect(window.prompt).toHaveBeenCalledTimes(2);
            expect(alertContiene("Ingresa SI o NO")).toBe(true);
        });
    });

    describe("solicitarDatoValido", function () {
        var noVacio = function (texto) { return texto.trim() !== ""; };

        it("devuelve la respuesta recortada cuando es válida", function () {
            responderPrompts(["  Ana  "]);
            expect(solicitarDatoValido("Nombre:", noVacio, "error")).toBe("Ana");
            expect(window.alert).not.toHaveBeenCalled();
        });
        it("muestra el error y repite la pregunta hasta recibir un dato válido", function () {
            responderPrompts(["   ", "", "Ana"]);
            expect(solicitarDatoValido("Nombre:", noVacio, "Dato inválido")).toBe("Ana");
            expect(window.prompt).toHaveBeenCalledTimes(3);
            expect(mensajesAlert()).toEqual(["Dato inválido", "Dato inválido"]);
        });
        it("devuelve null al cancelar", function () {
            responderPrompts([null]);
            expect(solicitarDatoValido("Nombre:", noVacio, "error")).toBeNull();
        });
    });

    describe("ejecutarBusquedaYFiltrado", function () {
        it("busca por texto, informa los resultados y finaliza con NO", function () {
            responderPrompts(["martillo", "", "", "NO"]);
            ejecutarBusquedaYFiltrado();
            expect(window.prompt).toHaveBeenCalledTimes(4);
            expect(alertContiene("Resultados ordenados por precio")).toBe(true);
            expect(alertContiene("Martillo galponero")).toBe(true);
            expect(console.log).toHaveBeenCalledWith("Productos encontrados:", jasmine.any(Array));
        });
        it("filtra por categoría", function () {
            responderPrompts(["", "Jardineria", "", "NO"]);
            ejecutarBusquedaYFiltrado();
            expect(alertContiene("Pala de punta")).toBe(true);
            expect(alertContiene("Martillo")).toBe(false);
        });
        it("filtra por precio máximo y ordena por precio", function () {
            responderPrompts(["", "", "7000", "NO"]);
            ejecutarBusquedaYFiltrado();
            var mensaje = mensajesAlert()[0];
            expect(mensaje).toContain("Guantes");
            expect(mensaje).toContain("Destornillador");
            expect(mensaje).toContain("Pinza");
            expect(mensaje).not.toContain("Martillo");
            expect(mensaje.indexOf("Guantes")).toBeLessThan(mensaje.indexOf("Destornillador"));
            expect(mensaje.indexOf("Destornillador")).toBeLessThan(mensaje.indexOf("Pinza"));
        });
        it("con los tres filtros vacíos muestra todo el catálogo", function () {
            responderPrompts(["", "", "", "NO"]);
            ejecutarBusquedaYFiltrado();
            var mensaje = mensajesAlert()[0];
            expect(mensaje.split("\n").length - 1).toBe(catalogoProductos.length);
        });
        it("informa 'Sin coincidencias' cuando nada cumple los filtros", function () {
            responderPrompts(["producto inexistente", "", "", "NO"]);
            ejecutarBusquedaYFiltrado();
            expect(mensajesAlert()).toEqual(["Sin coincidencias."]);
            expect(console.log).not.toHaveBeenCalled();
        });
        it("con precio inválido muestra el error y permite reintentar con otra búsqueda", function () {
            responderPrompts(["", "", "abc", "SI", "", "", "5000", "NO"]);
            ejecutarBusquedaYFiltrado();
            var mensajes = mensajesAlert();
            expect(mensajes[0]).toBe("El precio maximo debe ser un numero mayor o igual a cero.");
            expect(mensajes[1]).toContain("Guantes");
            expect(window.prompt).toHaveBeenCalledTimes(8);
        });
        it("con precio negativo muestra el error de validación", function () {
            responderPrompts(["", "", "-5", "NO"]);
            ejecutarBusquedaYFiltrado();
            expect(alertContiene("mayor o igual a cero")).toBe(true);
        });
        it("repite la búsqueda mientras el usuario responda SI", function () {
            responderPrompts(["pala", "", "", "SI", "pinza", "", "", "SI", "", "Accesorios", "", "NO"]);
            ejecutarBusquedaYFiltrado();
            expect(window.prompt).toHaveBeenCalledTimes(12);
            expect(window.alert).toHaveBeenCalledTimes(3);
        });
        it("si el usuario cancela la pregunta de repetir, vuelve al menú", function () {
            responderPrompts(["pala", "", "", null]);
            ejecutarBusquedaYFiltrado();
            expect(window.prompt).toHaveBeenCalledTimes(4);
        });
        it("si el usuario cancela el prompt del texto, vuelve al menú sin mostrar nada", function () {
            responderPrompts([null]);
            ejecutarBusquedaYFiltrado();
            expect(window.prompt).toHaveBeenCalledTimes(1);
            expect(window.alert).not.toHaveBeenCalled();
        });
        it("si el usuario cancela el prompt de la categoría, vuelve al menú sin mostrar nada", function () {
            responderPrompts(["pala", null]);
            ejecutarBusquedaYFiltrado();
            expect(window.prompt).toHaveBeenCalledTimes(2);
            expect(window.alert).not.toHaveBeenCalled();
        });
        it("si el usuario cancela el prompt del precio, vuelve al menú sin mostrar nada", function () {
            responderPrompts(["pala", "", null]);
            ejecutarBusquedaYFiltrado();
            expect(window.prompt).toHaveBeenCalledTimes(3);
            expect(window.alert).not.toHaveBeenCalled();
        });
    });
});

describe("Flujo 2 - Gestión del carrito (interacción)", function () {
    beforeEach(prepararEspias);

    describe("mostrarCarrito", function () {
        it("informa que el carrito está vacío", function () {
            mostrarCarrito();
            expect(mensajesAlert()).toEqual(["El carrito esta vacio."]);
        });
        it("muestra los ítems, el subtotal y el total", function () {
            cargarCarrito("GUANTES-001", 2);
            mostrarCarrito();
            expect(alertContiene("2 x " + formatearMoneda(4401) + " = " + formatearMoneda(8802))).toBe(true);
            expect(alertContiene("Total: " + formatearMoneda(8802))).toBe(true);
        });
    });

    describe("ejecutarGestionCarrito", function () {
        it("agrega un producto válido, informa la actualización y muestra el carrito", function () {
            responderPrompts(["1", "GUANTES-001", "2", "0"]);
            ejecutarGestionCarrito();
            expect(carritoActual.length).toBe(1);
            expect(carritoActual[0].cantidad).toBe(2);
            expect(alertContiene("Carrito actualizado.")).toBe(true);
            expect(alertContiene("Total: " + formatearMoneda(8802))).toBe(true);
        });
        it("suma la cantidad cuando el producto ya estaba en el carrito", function () {
            responderPrompts(["1", "GUANTES-001", "2", "1", "guantes-001", "1", "0"]);
            ejecutarGestionCarrito();
            expect(carritoActual.length).toBe(1);
            expect(carritoActual[0].cantidad).toBe(3);
        });
        it("rechaza un producto inexistente y deja el carrito sin cambios", function () {
            responderPrompts(["1", "NO-EXISTE", "1", "0"]);
            ejecutarGestionCarrito();
            expect(carritoActual).toEqual([]);
            expect(alertContiene("El producto no existe en el catalogo.")).toBe(true);
        });
        it("rechaza cantidades inválidas (0, decimal, texto)", function () {
            responderPrompts(["1", "GUANTES-001", "0", "1", "GUANTES-001", "1.5", "1", "GUANTES-001", "abc", "0"]);
            ejecutarGestionCarrito();
            expect(carritoActual).toEqual([]);
            var errores = mensajesAlert().filter(function (m) { return m.indexOf("entero mayor o igual a uno") !== -1; });
            expect(errores.length).toBe(3);
        });
        it("cambia la cantidad de un ítem del carrito", function () {
            cargarCarrito("PALA-001", 1);
            responderPrompts(["2", "PALA-001", "4", "0"]);
            ejecutarGestionCarrito();
            expect(carritoActual[0].cantidad).toBe(4);
        });
        it("rechaza cambiar la cantidad de un producto que no está en el carrito o con cantidad inválida", function () {
            cargarCarrito("PALA-001", 1);
            responderPrompts(["2", "PINZA-001", "2", "2", "PALA-001", "0", "0"]);
            ejecutarGestionCarrito();
            expect(carritoActual[0].cantidad).toBe(1);
            expect(alertContiene("El producto no esta en el carrito.")).toBe(true);
            expect(alertContiene("entero mayor o igual a uno")).toBe(true);
        });
        it("elimina un ítem del carrito y luego muestra el carrito vacío", function () {
            cargarCarrito("PALA-001", 1);
            responderPrompts(["3", "PALA-001", "0"]);
            ejecutarGestionCarrito();
            expect(carritoActual).toEqual([]);
            expect(alertContiene("El carrito esta vacio.")).toBe(true);
        });
        it("informa si se intenta eliminar un producto que no está en el carrito", function () {
            responderPrompts(["3", "PALA-001", "0"]);
            ejecutarGestionCarrito();
            expect(alertContiene("El producto no esta en el carrito.")).toBe(true);
        });
        it("avisa ante una opción inválida y vuelve a mostrar el menú", function () {
            responderPrompts(["9", "0"]);
            ejecutarGestionCarrito();
            expect(alertContiene("Opcion invalida.")).toBe(true);
            expect(window.prompt).toHaveBeenCalledTimes(2);
        });
        it("cancelar el prompt del código no modifica el carrito ni informa actualizaciones ni errores", function () {
            cargarCarrito("PALA-001", 1);
            responderPrompts(["1", null, "2", null, "3", null, "0"]);
            ejecutarGestionCarrito();
            expect(carritoActual.length).toBe(1);
            expect(carritoActual[0].cantidad).toBe(1);
            // El único alert es el que muestra el carrito al salir con la opción 0.
            expect(window.alert).toHaveBeenCalledTimes(1);
            expect(alertContiene("Carrito actualizado.")).toBe(false);
        });
        it("cancelar el prompt de la cantidad no modifica el carrito", function () {
            responderPrompts(["1", "PALA-001", null, "0"]);
            ejecutarGestionCarrito();
            expect(carritoActual).toEqual([]);
            cargarCarrito("PALA-001", 1);
            responderPrompts(["2", "PALA-001", null, "0"]);
            ejecutarGestionCarrito();
            expect(carritoActual[0].cantidad).toBe(1);
            expect(alertContiene("Carrito actualizado.")).toBe(false);
        });
        it("cancelar el menú equivale a salir y conserva el carrito", function () {
            cargarCarrito("PALA-001", 2);
            responderPrompts([null]);
            ejecutarGestionCarrito();
            expect(window.prompt).toHaveBeenCalledTimes(1);
            expect(carritoActual[0].cantidad).toBe(2);
        });
        it("la opción 0 vuelve al menú principal sin pasar al pago", function () {
            cargarCarrito("PALA-001", 1);
            responderPrompts(["0"]);
            ejecutarGestionCarrito();
            expect(window.prompt).toHaveBeenCalledTimes(1);
            expect(condicionesPagoActuales).toBeNull();
        });
        it("si cambia el total y había un pago elegido, lo descarta y avisa", function () {
            cargarCarrito("GUANTES-001", 1);
            responderPrompts(["1"]);
            ejecutarPago();
            expect(condicionesPagoActuales).not.toBeNull();
            window.alert.calls.reset();

            responderPrompts(["1", "PALA-001", "1", "0"]);
            ejecutarGestionCarrito();
            expect(condicionesPagoActuales).toBeNull();
            expect(alertContiene("Debes seleccionar nuevamente el metodo de pago y las cuotas.")).toBe(true);
        });
        it("si el total no cambia, conserva el pago elegido", function () {
            cargarCarrito("GUANTES-001", 1);
            responderPrompts(["1"]);
            ejecutarPago();
            var pagoAntes = condicionesPagoActuales;

            responderPrompts(["2", "GUANTES-001", "1", "0"]);
            ejecutarGestionCarrito();
            expect(condicionesPagoActuales).toBe(pagoAntes);
        });
        it("'Comprar' con el carrito vacío informa y permanece en el menú del carrito", function () {
            responderPrompts(["4", "0"]);
            ejecutarGestionCarrito();
            expect(alertContiene("No se puede comprar con el carrito vacio.")).toBe(true);
            expect(window.prompt).toHaveBeenCalledTimes(2);
            expect(alertContiene("Metodo de pago")).toBe(false);
        });
        it("'Comprar' con ítems sale del menú y continúa en el flujo de pago (transición Comprar → Pago)", function () {
            responderPrompts(["1", "GUANTES-001", "1", "4", "1"]);
            ejecutarGestionCarrito();
            // La 5.ª llamada a prompt() es la del método de pago: el menú del carrito no se vuelve a mostrar.
            expect(window.prompt).toHaveBeenCalledTimes(5);
            expect(window.prompt.calls.argsFor(4)[0]).toContain("Metodo de pago");
            expect(alertContiene("Condiciones de pago")).toBe(true);
            expect(condicionesPagoActuales).not.toBeNull();
            expect(condicionesPagoActuales.metodoPago).toBe("efectivo-transferencia");
        });
        it("'Comprar' deja el carrito intacto al pasar al pago", function () {
            responderPrompts(["1", "PALA-001", "2", "4", "1"]);
            ejecutarGestionCarrito();
            expect(carritoActual.length).toBe(1);
            expect(carritoActual[0].cantidad).toBe(2);
        });
        it("si el usuario cancela en el pago iniciado desde 'Comprar', no se guarda ningún pago", function () {
            cargarCarrito("PALA-001", 1);
            responderPrompts(["4", null]);
            ejecutarGestionCarrito();
            expect(condicionesPagoActuales).toBeNull();
            expect(carritoActual.length).toBe(1);
        });
    });
});

describe("Flujo 3 - Pago y cálculo de cuotas (interacción)", function () {
    beforeEach(prepararEspias);

    it("con el carrito vacío informa que no hay productos para pagar y no pide el método", function () {
        responderPrompts([]);
        ejecutarPago();
        expect(mensajesAlert()).toEqual(["No hay productos para pagar."]);
        expect(window.prompt).not.toHaveBeenCalled();
        expect(condicionesPagoActuales).toBeNull();
    });
    it("efectivo/transferencia: 1 cuota sin recargo, con resumen y pago guardado", function () {
        cargarCarrito("GUANTES-001", 10);
        responderPrompts(["1"]);
        ejecutarPago();
        var resumen = mensajesAlert()[0];
        expect(resumen).toContain("Condiciones de pago");
        expect(resumen).toContain("Total original: " + formatearMoneda(44010));
        expect(resumen).toContain("Cuotas: 1");
        expect(resumen).toContain("Interes: " + formatearMoneda(0));
        expect(resumen).toContain("Total financiado: " + formatearMoneda(44010));
        expect(resumen).toContain("Valor de cada cuota: " + formatearMoneda(44010));
        expect(condicionesPagoActuales).toEqual(jasmine.objectContaining({
            metodoPago: "efectivo-transferencia", cuotas: 1, porcentajeRecargo: 0, totalFinanciado: 44010
        }));
    });
    it("tarjeta en 1 cuota: sin recargo", function () {
        cargarCarrito("GUANTES-001", 10);
        responderPrompts(["2", "1"]);
        ejecutarPago();
        expect(condicionesPagoActuales).toEqual(jasmine.objectContaining({
            metodoPago: "tarjeta", cuotas: 1, interes: 0, totalFinanciado: 44010, valorCuota: 44010
        }));
    });
    it("tarjeta en 3 cuotas: recargo del 10 %", function () {
        cargarCarrito("GUANTES-001", 10);
        responderPrompts(["2", "3"]);
        ejecutarPago();
        expect(condicionesPagoActuales).toEqual(jasmine.objectContaining({
            cuotas: 3, porcentajeRecargo: 10, interes: 4401, totalFinanciado: 48411, valorCuota: 16137
        }));
        expect(alertContiene("Valor de cada cuota: " + formatearMoneda(16137))).toBe(true);
    });
    it("tarjeta en 6 cuotas: recargo del 20 %", function () {
        cargarCarrito("GUANTES-001", 10);
        responderPrompts(["2", "6"]);
        ejecutarPago();
        expect(condicionesPagoActuales).toEqual(jasmine.objectContaining({
            cuotas: 6, porcentajeRecargo: 20, interes: 8802, totalFinanciado: 52812, valorCuota: 8802
        }));
    });
    it("método de pago inválido: avisa y vuelve a pedirlo", function () {
        cargarCarrito("GUANTES-001", 1);
        responderPrompts(["9", "", "abc", "1"]);
        ejecutarPago();
        var errores = mensajesAlert().filter(function (m) { return m === "Opcion de pago invalida."; });
        expect(errores.length).toBe(3);
        expect(window.prompt).toHaveBeenCalledTimes(4);
        expect(condicionesPagoActuales.metodoPago).toBe("efectivo-transferencia");
    });
    it("cuotas no ofrecidas: avisa y vuelve a pedirlas", function () {
        cargarCarrito("GUANTES-001", 1);
        responderPrompts(["2", "2", "12", "abc", "3"]);
        ejecutarPago();
        var errores = mensajesAlert().filter(function (m) { return m === "Selecciona 1, 3 o 6 cuotas."; });
        expect(errores.length).toBe(3);
        expect(condicionesPagoActuales.cuotas).toBe(3);
    });
    it("cancelar el método de pago no guarda condiciones ni muestra el resumen", function () {
        cargarCarrito("GUANTES-001", 1);
        responderPrompts([null]);
        ejecutarPago();
        expect(condicionesPagoActuales).toBeNull();
        expect(window.alert).not.toHaveBeenCalled();
    });
    it("cancelar las cuotas no guarda condiciones ni muestra el resumen", function () {
        cargarCarrito("GUANTES-001", 1);
        responderPrompts(["2", null]);
        ejecutarPago();
        expect(condicionesPagoActuales).toBeNull();
        expect(window.alert).not.toHaveBeenCalled();
    });
    it("al cancelar, el carrito no se modifica", function () {
        cargarCarrito("GUANTES-001", 3);
        responderPrompts(["2", null]);
        ejecutarPago();
        expect(carritoActual.length).toBe(1);
        expect(carritoActual[0].cantidad).toBe(3);
    });
    it("al elegir de nuevo el pago reemplaza las condiciones anteriores", function () {
        cargarCarrito("GUANTES-001", 10);
        responderPrompts(["2", "6"]);
        ejecutarPago();
        responderPrompts(["1"]);
        ejecutarPago();
        expect(condicionesPagoActuales.metodoPago).toBe("efectivo-transferencia");
        expect(condicionesPagoActuales.cuotas).toBe(1);
    });
});

describe("Flujo 4 - Confirmación del pedido (interacción)", function () {
    var mensajeCancelado = "Pedido cancelado. Se conservaron el carrito y las condiciones de pago.";

    beforeEach(function () {
        prepararEspias();
        cargarCarrito("GUANTES-001", 2);
        cargarPagoEfectivo();
    });

    it("con el carrito vacío informa que falta completar y no pide datos", function () {
        reiniciarEstado();
        responderPrompts([]);
        ejecutarConfirmacionPedido();
        expect(mensajesAlert()).toEqual(["Falta completar el carrito o elegir un metodo de pago."]);
        expect(window.prompt).not.toHaveBeenCalled();
    });
    it("sin método de pago elegido informa que falta completar y no pide datos", function () {
        condicionesPagoActuales = null;
        responderPrompts([]);
        ejecutarConfirmacionPedido();
        expect(mensajesAlert()).toEqual(["Falta completar el carrito o elegir un metodo de pago."]);
        expect(window.prompt).not.toHaveBeenCalled();
        expect(carritoActual.length).toBe(1);
    });
    it("nombre vacío o numérico: avisa y vuelve a pedirlo", function () {
        responderPrompts(["   ", "123", "Juan Pérez", "juan@correo.com", "Calle 123", "SI"]);
        ejecutarConfirmacionPedido();
        var errores = mensajesAlert().filter(function (m) { return m.indexOf("El nombre no puede estar vacio") === 0; });
        expect(errores.length).toBe(2);
        expect(alertContiene("Pedido confirmado")).toBe(true);
    });
    it("correo inválido: avisa y vuelve a pedirlo", function () {
        responderPrompts(["Juan Pérez", "juan", "juan@", "juan@correo.com", "Calle 123", "SI"]);
        ejecutarConfirmacionPedido();
        var errores = mensajesAlert().filter(function (m) { return m.indexOf("Ingresa un correo valido") === 0; });
        expect(errores.length).toBe(2);
    });
    it("dirección vacía: avisa y vuelve a pedirla", function () {
        responderPrompts(["Juan Pérez", "juan@correo.com", "  ", "Calle 123", "SI"]);
        ejecutarConfirmacionPedido();
        expect(alertContiene("La direccion no puede estar vacia.")).toBe(true);
        expect(window.prompt).toHaveBeenCalledTimes(5);
    });
    it("muestra el resumen con cliente, productos, importes, pago y envío antes de confirmar", function () {
        responderPrompts(["  Juan Pérez ", "juan@correo.com", " Calle 123 ", "NO"]);
        ejecutarConfirmacionPedido();
        var resumen = mensajesAlert()[0];
        expect(resumen).toContain("Resumen del pedido para Juan Pérez");
        expect(resumen).toContain("2 x " + formatearMoneda(4401) + " = " + formatearMoneda(8802));
        expect(resumen).toContain("Total original: " + formatearMoneda(8802));
        expect(resumen).toContain("Metodo: Efectivo / transferencia");
        expect(resumen).toContain("Envio a: Calle 123");
        expect(resumen).toContain("Correo: juan@correo.com");
    });
    it("al confirmar con SI genera el número de pedido y muestra la confirmación", function () {
        spyOn(Date, "now").and.returnValue(1700000000000);
        responderPrompts(["Juan Pérez", "juan@correo.com", "Calle 123", "SI"]);
        ejecutarConfirmacionPedido();
        expect(alertContiene("Pedido confirmado: FL-1700000000000-0001")).toBe(true);
        expect(secuenciaPedidos).toBe(2);
    });
    it("al confirmar vacía el carrito y el método de pago", function () {
        responderPrompts(["Juan Pérez", "juan@correo.com", "Calle 123", "s"]);
        ejecutarConfirmacionPedido();
        expect(carritoActual).toEqual([]);
        expect(condicionesPagoActuales).toBeNull();
    });
    it("después de confirmar no se puede confirmar de nuevo el mismo pedido", function () {
        responderPrompts(["Juan Pérez", "juan@correo.com", "Calle 123", "SI"]);
        ejecutarConfirmacionPedido();
        window.alert.calls.reset();
        responderPrompts([]);
        ejecutarConfirmacionPedido();
        expect(mensajesAlert()).toEqual(["Falta completar el carrito o elegir un metodo de pago."]);
    });
    it("el número de pedido aumenta en pedidos consecutivos", function () {
        spyOn(Date, "now").and.returnValue(1700000000000);
        responderPrompts(["Juan Pérez", "juan@correo.com", "Calle 123", "SI"]);
        ejecutarConfirmacionPedido();
        cargarCarrito("PALA-001", 1);
        cargarPagoEfectivo();
        responderPrompts(["Juan Pérez", "juan@correo.com", "Calle 123", "SI"]);
        ejecutarConfirmacionPedido();
        expect(alertContiene("FL-1700000000000-0001")).toBe(true);
        expect(alertContiene("FL-1700000000000-0002")).toBe(true);
    });
    it("responder NO cancela el pedido y conserva el carrito y el pago", function () {
        var pagoAntes = condicionesPagoActuales;
        responderPrompts(["Juan Pérez", "juan@correo.com", "Calle 123", "NO"]);
        ejecutarConfirmacionPedido();
        expect(mensajesAlert()[mensajesAlert().length - 1]).toBe(mensajeCancelado);
        expect(carritoActual.length).toBe(1);
        expect(condicionesPagoActuales).toBe(pagoAntes);
        expect(alertContiene("Pedido confirmado")).toBe(false);
    });
    it("cancelar el prompt de SI/NO cancela el pedido y conserva el estado", function () {
        responderPrompts(["Juan Pérez", "juan@correo.com", "Calle 123", null]);
        ejecutarConfirmacionPedido();
        expect(alertContiene(mensajeCancelado)).toBe(true);
        expect(carritoActual.length).toBe(1);
        expect(condicionesPagoActuales).not.toBeNull();
    });
    it("cancelar el nombre cancela el pedido y conserva el estado", function () {
        responderPrompts([null]);
        ejecutarConfirmacionPedido();
        expect(mensajesAlert()).toEqual([mensajeCancelado]);
        expect(window.prompt).toHaveBeenCalledTimes(1);
        expect(carritoActual.length).toBe(1);
        expect(condicionesPagoActuales).not.toBeNull();
    });
    it("cancelar el correo cancela el pedido y conserva el estado", function () {
        responderPrompts(["Juan Pérez", null]);
        ejecutarConfirmacionPedido();
        expect(mensajesAlert()).toEqual([mensajeCancelado]);
        expect(window.prompt).toHaveBeenCalledTimes(2);
        expect(carritoActual.length).toBe(1);
        expect(condicionesPagoActuales).not.toBeNull();
    });
    it("cancelar la dirección cancela el pedido y conserva el estado", function () {
        responderPrompts(["Juan Pérez", "juan@correo.com", null]);
        ejecutarConfirmacionPedido();
        expect(mensajesAlert()).toEqual([mensajeCancelado]);
        expect(window.prompt).toHaveBeenCalledTimes(3);
        expect(carritoActual.length).toBe(1);
        expect(condicionesPagoActuales).not.toBeNull();
    });
});

describe("Menú principal - integración de los flujos", function () {
    beforeEach(prepararEspias);

    it("la opción 0 y cancelar el menú terminan sin mostrar mensajes", function () {
        responderPrompts(["0"]);
        iniciarMenuPrincipal();
        responderPrompts([null]);
        iniciarMenuPrincipal();
        expect(window.alert).not.toHaveBeenCalled();
    });
    it("una opción inválida avisa y vuelve a mostrar el menú", function () {
        responderPrompts(["7", "0"]);
        iniciarMenuPrincipal();
        expect(alertContiene("Opcion invalida.")).toBe(true);
        expect(window.prompt).toHaveBeenCalledTimes(2);
    });
    it("cada opción del menú abre su flujo", function () {
        responderPrompts(["1", null, "2", "0", "3", "4", "0"]);
        iniciarMenuPrincipal();
        expect(alertContiene("No hay productos para pagar.")).toBe(true);
        expect(alertContiene("Falta completar el carrito o elegir un metodo de pago.")).toBe(true);
    });
    it("recorrido completo: agregar al carrito, Comprar, pago y confirmación del pedido", function () {
        spyOn(Date, "now").and.returnValue(1700000000000);
        responderPrompts([
            "2", "1", "GUANTES-001", "1", "4", "2", "3",   // carrito → Comprar → tarjeta en 3 cuotas
            "4", "Juan Pérez", "juan@correo.com", "Calle 123", "SI", // confirmar pedido
            "0"                                                // salir
        ]);
        iniciarMenuPrincipal();
        expect(alertContiene("Condiciones de pago")).toBe(true);
        expect(alertContiene("Pedido confirmado: FL-1700000000000-0001")).toBe(true);
        expect(carritoActual).toEqual([]);
        expect(condicionesPagoActuales).toBeNull();
    });
});
