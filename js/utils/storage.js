/**
 * @file Capa de abstracción sobre Web Storage (localStorage / sessionStorage).
 *
 * - Serializa y deserializa JSON automáticamente.
 * - Integra las clases de js/models/ mediante toJSON() / fromJSON().
 * - Nunca lanza excepciones: ante cualquier error lo registra con console.error
 *   y devuelve un valor de fallo (false, null o []).
 *
 * Spec: docs/03-specs/actividad-obligatoria-4/spec-dev-storage.md
 * @module utils/storage
 */

/** Prefijo obligatorio de todas las claves del proyecto. */
export const PREFIJO_APP = "app:";

/**
 * Claves del proyecto con formato `app:<dominio>:<recurso>`.
 * Las cinco primeras viven en localStorage y las tres últimas en sessionStorage.
 * @readonly
 * @enum {string}
 */
export const CLAVES = Object.freeze({
    // localStorage
    CARRITO: "app:carrito:items",
    PEDIDOS: "app:pedidos:historial",
    SECUENCIA_PEDIDOS: "app:pedidos:secuencia",
    PREFERENCIAS: "app:usuario:preferencias",
    CACHE_CATALOGO: "app:catalogo:cache",
    // sessionStorage
    BORRADOR_CHECKOUT: "app:checkout:borrador",
    FILTROS_CATALOGO: "app:catalogo:filtros",
    BIENVENIDA_VISTA: "app:ui:bienvenida-vista"
});

/** Tipos de storage admitidos y la propiedad global que les corresponde. */
const TIPOS = Object.freeze({ local: "localStorage", session: "sessionStorage" });

/** Prefijo de las claves temporales de estaDisponible(); a cada prueba se le suma un sufijo único. */
const PREFIJO_PRUEBA = `${PREFIJO_APP}__prueba-disponibilidad__-`;

/**
 * Registra un error con un prefijo común para identificar el módulo.
 * @param {string} mensaje Descripción del problema.
 * @param {unknown} [error] Error original, si lo hay.
 * @returns {void}
 */
function registrarError(mensaje, error) {
    if (error === undefined) {
        console.error(`[StorageUtil] ${mensaje}`);
    } else {
        console.error(`[StorageUtil] ${mensaje}`, error);
    }
}

/**
 * Indica si un error corresponde a storage lleno.
 * Contempla los nombres y códigos usados por los distintos navegadores.
 * @param {unknown} error Error capturado.
 * @returns {boolean} true si es un error de cuota.
 */
function esErrorDeCuota(error) {
    if (!error || typeof error !== "object") return false;
    return error.name === "QuotaExceededError" ||          // estándar
        error.name === "NS_ERROR_DOM_QUOTA_REACHED" ||     // Firefox antiguo
        error.code === 22 ||                               // código DOMException estándar
        error.code === 1014;                               // código Firefox
}

/**
 * Valida el tipo de storage.
 * @param {unknown} tipo Valor recibido.
 * @returns {boolean} true si es 'local' o 'session'.
 */
function tipoValido(tipo) {
    if (typeof tipo === "string" && Object.hasOwn(TIPOS, tipo)) return true;
    registrarError(`Tipo de storage inválido: ${String(tipo)}. Use 'local' o 'session'.`);
    return false;
}

/**
 * Valida que la clave sea un string no vacío.
 * @param {unknown} clave Valor recibido.
 * @returns {boolean} true si la clave es válida.
 */
function claveValida(clave) {
    if (typeof clave === "string" && clave.trim() !== "") return true;
    registrarError(`Clave inválida: ${String(clave)}. Debe ser un string no vacío.`);
    return false;
}

/**
 * Obtiene el objeto Storage correspondiente.
 * Se resuelve en cada llamada (y no al cargar el módulo) para tolerar
 * SecurityError y para permitir reemplazarlo en los tests.
 * @param {"local"|"session"} tipo Tipo ya validado.
 * @returns {Storage|null} Storage o null si no está accesible.
 */
function resolverStorage(tipo) {
    try {
        const storage = globalThis[TIPOS[tipo]];
        if (!storage || typeof storage.getItem !== "function") {
            registrarError(`${TIPOS[tipo]} no está disponible en este entorno.`);
            return null;
        }
        return storage;
    } catch (error) {
        // SecurityError: cookies bloqueadas, modo privado estricto, iframes sandbox, etc.
        registrarError(`No se puede acceder a ${TIPOS[tipo]}.`, error);
        return null;
    }
}

/**
 * Valida tipo y clave y devuelve el storage listo para usar.
 * @param {unknown} clave Clave recibida.
 * @param {unknown} tipo Tipo recibido.
 * @returns {Storage|null} Storage o null si algo es inválido.
 */
function prepararOperacion(clave, tipo) {
    if (!tipoValido(tipo) || !claveValida(clave)) return null;
    return resolverStorage(tipo);
}

/** Marca interna: el valor (o algo dentro de él) no se puede guardar en JSON. */
const NO_SERIALIZABLE = Symbol("no-serializable");

/**
 * Aplica toJSON() a un valor, si lo define, y normaliza el resultado.
 * Igual que JSON.stringify, toJSON() se ejecuta UNA sola vez por valor y recibe
 * la clave de la propiedad; sobre lo que devuelve no se vuelve a aplicar toJSON().
 * @param {unknown} valor Valor a normalizar.
 * @param {string} clave Clave o índice del valor dentro de su contenedor ("" en la raíz).
 * @param {Set<object>} ancestros Objetos del camino actual (para detectar ciclos).
 * @returns {unknown} Copia plana lista para JSON.stringify, o NO_SERIALIZABLE.
 */
function normalizarParaJSON(valor, clave, ancestros) {
    if (valor !== null && typeof valor === "object" && typeof valor.toJSON === "function") {
        if (ancestros.has(valor)) return NO_SERIALIZABLE; // referencia circular
        ancestros.add(valor);
        try {
            return normalizarValor(valor.toJSON(clave), ancestros);
        } finally {
            ancestros.delete(valor);
        }
    }
    return normalizarValor(valor, ancestros);
}

/**
 * Valida un valor ya resuelto (sin toJSON pendiente) y arma su copia plana.
 * Rechaza undefined, funciones, símbolos, BigInt y referencias circulares en cualquier nivel.
 * @param {unknown} valor Valor a normalizar.
 * @param {Set<object>} ancestros Objetos del camino actual (para detectar ciclos).
 * @returns {unknown} Copia plana o NO_SERIALIZABLE.
 */
function normalizarValor(valor, ancestros) {
    if (valor === null) return null;
    const tipo = typeof valor;
    if (tipo === "string" || tipo === "number" || tipo === "boolean") return valor;
    if (tipo !== "object") return NO_SERIALIZABLE; // undefined, function, symbol, bigint
    if (ancestros.has(valor)) return NO_SERIALIZABLE; // referencia circular
    ancestros.add(valor);
    try {
        if (Array.isArray(valor)) {
            const copia = [];
            for (let i = 0; i < valor.length; i++) {
                const elemento = normalizarParaJSON(valor[i], String(i), ancestros);
                if (elemento === NO_SERIALIZABLE) return NO_SERIALIZABLE;
                copia.push(elemento);
            }
            return copia;
        }
        const copia = {};
        for (const [propiedad, contenido] of Object.entries(valor)) {
            const normalizado = normalizarParaJSON(contenido, propiedad, ancestros);
            if (normalizado === NO_SERIALIZABLE) return NO_SERIALIZABLE;
            copia[propiedad] = normalizado;
        }
        return copia;
    } finally {
        ancestros.delete(valor); // un mismo objeto repetido en ramas distintas no es un ciclo
    }
}

/**
 * Serializa un valor a JSON rechazando lo que no se puede guardar.
 * Valida y serializa sobre la MISMA copia: cada toJSON() corre una sola vez, así que
 * lo que se valida es exactamente lo que se guarda.
 * @param {unknown} valor Valor a serializar.
 * @param {string} clave Clave (solo para el mensaje de error).
 * @returns {string|null} Texto JSON o null si no es serializable.
 */
function serializar(valor, clave) {
    try {
        const normalizado = normalizarParaJSON(valor, "", new Set());
        if (normalizado === NO_SERIALIZABLE) {
            registrarError(`El valor para "${clave}" contiene datos no serializables ` +
                "(undefined, funciones, símbolos, BigInt o referencias circulares).");
            return null;
        }
        // La copia es un objeto plano sin toJSON(): JSON.stringify no lo vuelve a ejecutar.
        return JSON.stringify(normalizado);
    } catch (error) {
        // Un toJSON() que lanza, o una estructura demasiado profunda.
        registrarError(`No se pudo serializar el valor para "${clave}".`, error);
        return null;
    }
}

/**
 * Escribe un texto ya serializado, distinguiendo el error de storage lleno.
 * @param {Storage} storage Storage destino.
 * @param {string} clave Clave.
 * @param {string} texto JSON a guardar.
 * @param {string} tipo Tipo (para el mensaje).
 * @returns {boolean} true si se guardó.
 */
function escribir(storage, clave, texto, tipo) {
    try {
        storage.setItem(clave, texto);
        return true;
    } catch (error) {
        if (esErrorDeCuota(error)) {
            registrarError(`Storage lleno: no hay espacio en ${TIPOS[tipo]} para guardar "${clave}" ` +
                `(${texto.length} caracteres). Libere datos con eliminar() o limpiar().`, error);
        } else {
            registrarError(`No se pudo guardar "${clave}" en ${TIPOS[tipo]}.`, error);
        }
        return false;
    }
}

/**
 * Devuelve todas las claves presentes en un storage.
 * @param {Storage} storage Storage a recorrer.
 * @returns {string[]} Claves (sin orden garantizado).
 */
function todasLasClaves(storage) {
    const claves = [];
    for (let i = 0; i < storage.length; i++) {
        const clave = storage.key(i);
        if (clave !== null) claves.push(clave);
    }
    return claves;
}

/**
 * Comprueba que una clase exponga el método estático fromJSON().
 * @param {unknown} Clase Clase recibida.
 * @returns {boolean} true si es utilizable.
 */
function claseValida(Clase) {
    if (typeof Clase === "function" && typeof Clase.fromJSON === "function") return true;
    registrarError("La clase indicada debe tener un método estático fromJSON().");
    return false;
}

/**
 * Comprueba que un objeto exponga el método toJSON().
 * @param {unknown} instancia Instancia recibida.
 * @returns {boolean} true si es serializable mediante toJSON().
 */
function instanciaValida(instancia) {
    return instancia !== null && typeof instancia === "object" && typeof instancia.toJSON === "function";
}

/**
 * Crea o reemplaza un dato serializándolo a JSON.
 * @param {string} clave Clave (preferentemente una de CLAVES).
 * @param {*} valor Valor serializable con JSON.stringify (no undefined, funciones ni ciclos).
 * @param {"local"|"session"} [tipo="local"] Storage destino.
 * @returns {boolean} true si se guardó.
 * @example StorageUtil.guardar(CLAVES.PREFERENCIAS, { categoriaFavorita: "Herramientas" });
 */
function guardar(clave, valor, tipo = "local") {
    try {
        const storage = prepararOperacion(clave, tipo);
        if (!storage) return false;
        const texto = serializar(valor, clave);
        if (texto === null) return false;
        return escribir(storage, clave, texto, tipo);
    } catch (error) {
        registrarError(`Error inesperado al guardar "${String(clave)}".`, error);
        return false;
    }
}

/**
 * Recupera y deserializa un dato.
 * @param {string} clave Clave a leer.
 * @param {"local"|"session"} [tipo="local"] Storage origen.
 * @returns {*} Valor deserializado, o null si no existe, está corrupto o hubo un error.
 * @example const filtros = StorageUtil.obtener(CLAVES.FILTROS_CATALOGO, "session");
 */
function obtener(clave, tipo = "local") {
    try {
        const storage = prepararOperacion(clave, tipo);
        if (!storage) return null;
        const texto = storage.getItem(clave);
        if (texto === null) return null;
        try {
            return JSON.parse(texto);
        } catch (error) {
            registrarError(`Datos corruptos en "${clave}" (${TIPOS[tipo]}): no es JSON válido.`, error);
            return null;
        }
    } catch (error) {
        registrarError(`No se pudo leer "${String(clave)}".`, error);
        return null;
    }
}

/**
 * Actualiza un dato solo si la clave ya existe (no crea claves nuevas,
 * para que un error de tipeo no genere datos huérfanos).
 * @param {string} clave Clave existente.
 * @param {*} valor Nuevo valor serializable.
 * @param {"local"|"session"} [tipo="local"] Storage destino.
 * @returns {boolean} true si se actualizó; false si la clave no existe o hubo un error.
 */
function actualizar(clave, valor, tipo = "local") {
    try {
        const storage = prepararOperacion(clave, tipo);
        if (!storage) return false;
        if (storage.getItem(clave) === null) {
            registrarError(`No se puede actualizar "${clave}": la clave no existe en ${TIPOS[tipo]}.`);
            return false;
        }
        const texto = serializar(valor, clave);
        if (texto === null) return false;
        return escribir(storage, clave, texto, tipo);
    } catch (error) {
        registrarError(`Error inesperado al actualizar "${String(clave)}".`, error);
        return false;
    }
}

/**
 * Elimina un dato. Es idempotente: eliminar una clave inexistente devuelve true.
 * @param {string} clave Clave a eliminar.
 * @param {"local"|"session"} [tipo="local"] Storage.
 * @returns {boolean} true si la clave ya no está; false si hubo un error.
 */
function eliminar(clave, tipo = "local") {
    try {
        const storage = prepararOperacion(clave, tipo);
        if (!storage) return false;
        storage.removeItem(clave);
        return true;
    } catch (error) {
        registrarError(`No se pudo eliminar "${String(clave)}".`, error);
        return false;
    }
}

/**
 * Lista las claves que empiezan con un prefijo, ordenadas alfabéticamente.
 * @param {string} [prefijo=PREFIJO_APP] Prefijo buscado ("" lista todas las claves).
 * @param {"local"|"session"} [tipo="local"] Storage.
 * @returns {string[]} Claves encontradas, o [] si hubo un error.
 * @example StorageUtil.listar("app:pedidos:"); // ["app:pedidos:historial", "app:pedidos:secuencia"]
 */
function listar(prefijo = PREFIJO_APP, tipo = "local") {
    try {
        if (!tipoValido(tipo)) return [];
        if (typeof prefijo !== "string") {
            registrarError(`Prefijo inválido: ${String(prefijo)}. Debe ser un string.`);
            return [];
        }
        const storage = resolverStorage(tipo);
        if (!storage) return [];
        return todasLasClaves(storage).filter((clave) => clave.startsWith(prefijo)).sort();
    } catch (error) {
        registrarError("No se pudieron listar las claves.", error);
        return [];
    }
}

/**
 * Borra los datos del storage. Por defecto solo las claves con prefijo "app:",
 * para no afectar a otros sitios que comparten el origen (p. ej. GitHub Pages).
 * @param {"local"|"session"} [tipo="local"] Storage.
 * @param {boolean} [soloApp=true] false borra todo el storage con clear().
 * @returns {boolean} true si se completó la limpieza.
 */
function limpiar(tipo = "local", soloApp = true) {
    try {
        if (!tipoValido(tipo)) return false;
        const storage = resolverStorage(tipo);
        if (!storage) return false;
        if (soloApp === false) {
            storage.clear();
            return true;
        }
        // Se copian las claves antes de borrar porque removeItem altera los índices.
        todasLasClaves(storage)
            .filter((clave) => clave.startsWith(PREFIJO_APP))
            .forEach((clave) => storage.removeItem(clave));
        return true;
    } catch (error) {
        registrarError(`No se pudo limpiar ${String(TIPOS[tipo] ?? tipo)}.`, error);
        return false;
    }
}

/**
 * Indica si existe una clave (aunque su contenido esté corrupto).
 * @param {string} clave Clave a consultar.
 * @param {"local"|"session"} [tipo="local"] Storage.
 * @returns {boolean} true si la clave existe.
 */
function existe(clave, tipo = "local") {
    try {
        const storage = prepararOperacion(clave, tipo);
        if (!storage) return false;
        return storage.getItem(clave) !== null;
    } catch (error) {
        registrarError(`No se pudo consultar "${String(clave)}".`, error);
        return false;
    }
}

/**
 * Comprueba si el storage se puede usar realizando una escritura y un borrado reales,
 * con una clave temporal única que se verifica como eliminada.
 * Útil para avisar al usuario cuando el navegador bloquea el almacenamiento.
 * @param {"local"|"session"} [tipo="local"] Storage.
 * @returns {boolean} true si se puede escribir y borrar.
 */
function estaDisponible(tipo = "local") {
    let storage = null;
    let clavePrueba = null;
    try {
        if (!tipoValido(tipo)) return false;
        storage = resolverStorage(tipo);
        if (!storage) return false;
        // Clave única en cada prueba: nunca pisa ni borra datos que ya existan.
        // No se usa crypto.randomUUID() porque solo existe en contextos seguros (HTTPS).
        clavePrueba = `${PREFIJO_PRUEBA}${Date.now()}-${Math.random().toString(36).slice(2)}`;
        storage.setItem(clavePrueba, "1");
        storage.removeItem(clavePrueba);
        if (storage.getItem(clavePrueba) !== null) {
            registrarError(`${TIPOS[tipo]}: no se pudo borrar la clave de prueba; se considera no disponible.`);
            return false;
        }
        return true;
    } catch (error) {
        if (esErrorDeCuota(error)) {
            registrarError(`${TIPOS[tipo]} está lleno: no admite nuevas escrituras.`, error);
        } else {
            registrarError(`${String(TIPOS[tipo] ?? tipo)} no está disponible.`, error);
        }
        return false;
    } finally {
        try {
            if (storage && clavePrueba) storage.removeItem(clavePrueba);
        } catch {
            // Si no se pudo borrar la clave de prueba no hay nada más que hacer.
        }
    }
}

/**
 * Guarda una instancia de js/models/ usando su método toJSON().
 * @param {string} clave Clave destino.
 * @param {{toJSON: function(): *}} instancia Instancia (Carrito, Pedido, Producto, Catalogo, Pago...).
 * @param {"local"|"session"} [tipo="local"] Storage destino.
 * @returns {boolean} true si se guardó.
 * @example StorageUtil.guardarInstancia(CLAVES.CARRITO, carrito);
 */
function guardarInstancia(clave, instancia, tipo = "local") {
    try {
        if (!instanciaValida(instancia)) {
            registrarError(`No se puede guardar "${String(clave)}": la instancia no tiene toJSON().`);
            return false;
        }
        return guardar(clave, instancia.toJSON(), tipo);
    } catch (error) {
        // toJSON() de la instancia lanzó una excepción.
        registrarError(`No se pudo serializar la instancia para "${String(clave)}".`, error);
        return false;
    }
}

/**
 * Carga y reconstruye una instancia con Clase.fromJSON().
 * @template T
 * @param {string} clave Clave origen.
 * @param {{fromJSON: function(*): T}} Clase Clase con método estático fromJSON().
 * @param {"local"|"session"} [tipo="local"] Storage origen.
 * @returns {T|null} Instancia reconstruida, o null si no existe, está corrupta o fromJSON() la rechaza.
 * @example const carrito = StorageUtil.cargarInstancia(CLAVES.CARRITO, Carrito) ?? new Carrito();
 */
function cargarInstancia(clave, Clase, tipo = "local") {
    try {
        if (!claseValida(Clase)) return null;
        const datos = obtener(clave, tipo);
        if (datos === null) return null;
        try {
            return Clase.fromJSON(datos);
        } catch (error) {
            registrarError(`Los datos de "${clave}" no son válidos para ${Clase.name || "la clase"}.`, error);
            return null;
        }
    } catch (error) {
        registrarError(`Error inesperado al cargar la instancia de "${String(clave)}".`, error);
        return null;
    }
}

/**
 * Guarda un arreglo de instancias como un arreglo JSON de sus toJSON().
 * @param {string} clave Clave destino.
 * @param {Array<{toJSON: function(): *}>} instancias Instancias a guardar.
 * @param {"local"|"session"} [tipo="local"] Storage destino.
 * @returns {boolean} true si se guardó.
 * @example StorageUtil.guardarLista(CLAVES.PEDIDOS, pedidos);
 */
function guardarLista(clave, instancias, tipo = "local") {
    try {
        if (!Array.isArray(instancias)) {
            registrarError(`No se puede guardar "${String(clave)}": se esperaba un arreglo de instancias.`);
            return false;
        }
        const indiceInvalido = instancias.findIndex((instancia) => !instanciaValida(instancia));
        if (indiceInvalido !== -1) {
            registrarError(`No se puede guardar "${String(clave)}": el elemento ${indiceInvalido} no tiene toJSON().`);
            return false;
        }
        return guardar(clave, instancias.map((instancia) => instancia.toJSON()), tipo);
    } catch (error) {
        registrarError(`No se pudo serializar la lista para "${String(clave)}".`, error);
        return false;
    }
}

/**
 * Carga un arreglo JSON y reconstruye cada elemento con Clase.fromJSON().
 * Es todo o nada: si algún elemento es inválido devuelve [] para no mostrar datos parciales.
 * @template T
 * @param {string} clave Clave origen.
 * @param {{fromJSON: function(*): T}} Clase Clase con método estático fromJSON().
 * @param {"local"|"session"} [tipo="local"] Storage origen.
 * @returns {T[]} Instancias reconstruidas, o [] si no existe, está corrupta o algún elemento es inválido.
 * @example const pedidos = StorageUtil.cargarLista(CLAVES.PEDIDOS, Pedido);
 */
function cargarLista(clave, Clase, tipo = "local") {
    try {
        if (!claseValida(Clase)) return [];
        const datos = obtener(clave, tipo);
        if (datos === null) return [];
        if (!Array.isArray(datos)) {
            registrarError(`Los datos de "${clave}" no son un arreglo.`);
            return [];
        }
        try {
            return datos.map((elemento) => Clase.fromJSON(elemento));
        } catch (error) {
            registrarError(`Los datos de "${clave}" contienen elementos inválidos para ${Clase.name || "la clase"}.`, error);
            return [];
        }
    } catch (error) {
        registrarError(`Error inesperado al cargar la lista de "${String(clave)}".`, error);
        return [];
    }
}

/**
 * API pública del módulo de storage.
 * Todas las funciones aceptan `tipo`: "local" (por defecto) o "session".
 */
export const StorageUtil = Object.freeze({
    guardar,
    obtener,
    actualizar,
    eliminar,
    listar,
    limpiar,
    existe,
    estaDisponible,
    guardarInstancia,
    cargarInstancia,
    guardarLista,
    cargarLista
});

export default StorageUtil;