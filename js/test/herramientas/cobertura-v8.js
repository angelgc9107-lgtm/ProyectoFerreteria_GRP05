#!/usr/bin/env node
/**
 * Mide la cobertura de líneas, funciones y ramas de js/models/, js/services/,
 * js/utils/storage.js y js/script.js mientras corre la suite completa de
 * js/test/test-runner.html en Chromium.
 *
 * Usa la cobertura de código de V8 que expone Playwright (page.coverage). No forma
 * parte de la aplicación ni de los tests: es una herramienta de medición.
 *
 * Uso (desde la raíz del repo, con Node 18 o superior):
 *     npm install --no-save playwright
 *     npx playwright install chromium
 *     node js/test/herramientas/cobertura-v8.js
 *     node js/test/herramientas/cobertura-v8.js --detalle   (lista además cada rama y función sin cubrir)
 *
 * Levanta su propio servidor HTTP temporal sobre la raíz del repo, abre el runner,
 * espera el resultado de Jasmine y imprime una tabla en Markdown. Necesita internet
 * (Jasmine y Bootstrap se cargan desde CDN). Termina con código 1 si algún spec falla.
 *
 * Cómo se cuenta: una línea es «ejecutable» si no está en blanco, no es un comentario
 * y no es solo un cierre de llaves/paréntesis. Se considera cubierta si el primer
 * carácter de código de la línea fue ejecutado por V8 durante la corrida.
 *
 * Funciones y ramas se toman de la cobertura de bloques de V8 (`detailed: true`):
 * una «función» es cada función que V8 informa, y una «rama» es cada bloque interno
 * que V8 distingue (cada lado de un if/else, operador ternario, `&&`, `||`, `??`,
 * `catch`, `finally`, ciclo o cuerpo de `case`). Una rama está cubierta si se ejecutó al
 * menos una vez. Es una medida aproximada, equivalente a la que informan herramientas
 * como c8: V8 no informa ramas dentro de funciones que nunca se llamaron, de modo que
 * una función sin cubrir cuenta como una función sin cubrir, pero no suma sus ramas.
 */
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const RAIZ = path.resolve(__dirname, "../../..");
const RUNNER = "/js/test/test-runner.html";
const ARCHIVOS = /\/js\/((?:models|services|utils)\/[A-Za-z]+\.js|script\.js)$/;
const TIPOS = {
    ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8", ".png": "image/png", ".json": "application/json",
    ".md": "text/plain; charset=utf-8"
};

function servirRepo() {
    return new Promise((resolve) => {
        const servidor = http.createServer((req, res) => {
            const ruta = path.join(RAIZ, decodeURIComponent(new URL(req.url, "http://x").pathname));
            if (!ruta.startsWith(RAIZ) || !fs.existsSync(ruta) || fs.statSync(ruta).isDirectory()) {
                res.writeHead(404).end("No encontrado");
                return;
            }
            res.writeHead(200, { "Content-Type": TIPOS[path.extname(ruta)] ?? "application/octet-stream" });
            fs.createReadStream(ruta).pipe(res);
        });
        servidor.listen(0, "127.0.0.1", () => resolve(servidor));
    });
}

/**
 * Suma a `archivos[nombre]` lo que V8 informó como ejecutado en una toma de cobertura.
 * El código fuente se lee del disco: los desplazamientos de V8 son sobre ese mismo texto.
 */
function acumular(archivos, nombre, funciones) {
    const destino = (archivos[nombre] ??= (() => {
        const source = fs.readFileSync(path.join(RAIZ, "js", nombre), "utf8");
        return { source, cubierto: new Int8Array(source.length), funciones: new Map(), ramas: new Map() };
    })());
    const parcial = new Int8Array(destino.source.length).fill(-1);
    // V8 informa rangos por función, del más externo al más interno: el interno pisa al externo.
    for (const funcion of funciones) {
        const [propio, ...bloques] = funcion.ranges;
        // El rango externo de cada función indica si se llamó; los internos son sus ramas.
        const claveFuncion = `${propio.startOffset}-${propio.endOffset}`;
        const llamada = propio.count > 0;
        const f = destino.funciones.get(claveFuncion) ?? { cubierta: false, llamadas: 0 };
        f.cubierta ||= llamada;
        if (llamada) f.llamadas++;
        destino.funciones.set(claveFuncion, f);
        // V8 sólo informa un bloque cuando su contador difiere del de la función que lo contiene:
        // un bloque que no aparece se ejecutó tantas veces como la función. Por eso una rama está
        // cubierta si en alguna observación con la función llamada o bien se informa con
        // contador > 0, o bien no se informa con contador 0.
        for (const rango of bloques) {
            const clave = `${rango.startOffset}-${rango.endOffset}`;
            const r = destino.ramas.get(clave) ?? { funcion: claveFuncion, positivos: false, ceros: 0 };
            if (rango.count > 0) r.positivos = true;
            else if (llamada) r.ceros++;
            destino.ramas.set(clave, r);
        }
        for (const rango of funcion.ranges) {
            parcial.fill(rango.count > 0 ? 1 : 0, rango.startOffset, rango.endOffset);
        }
    }
    for (let i = 0; i < parcial.length; i++) if (parcial[i] === 1) destino.cubierto[i] = 1;
}

/** Una rama está cubierta si alguna vez tuvo contador > 0 o si no se informó como 0 en todas las llamadas de su función. */
function ramaCubierta(archivo) {
    return (rama) => rama.positivos || rama.ceros < (archivo.funciones.get(rama.funcion)?.llamadas ?? 0);
}

function contarLineas({ source, cubierto }) {
    let ejecutables = 0;
    let cubiertas = 0;
    let enBloque = false;
    let desplazamiento = 0;
    for (const linea of source.split("\n")) {
        const inicio = desplazamiento;
        desplazamiento += linea.length + 1;
        const texto = linea.trim();
        if (enBloque) { if (texto.includes("*/")) enBloque = false; continue; }
        if (texto.startsWith("/*")) { if (!texto.includes("*/")) enBloque = true; continue; }
        if (!texto || texto.startsWith("//") || /^[})\]];?,?$/.test(texto)) continue;
        ejecutables++;
        const primerCaracter = inicio + linea.length - linea.trimStart().length;
        if (cubierto[primerCaracter] === 1) cubiertas++;
    }
    return { ejecutables, cubiertas };
}

(async () => {
    const servidor = await servirRepo();
    const url = `http://127.0.0.1:${servidor.address().port}${RUNNER}`;
    const navegador = await chromium.launch();
    try {
        const pagina = await navegador.newPage();
        const cdp = await pagina.context().newCDPSession(pagina);
        await cdp.send("Profiler.enable");
        await cdp.send("Profiler.startPreciseCoverage", { callCount: true, detailed: true });

        // Cada toma devuelve lo ejecutado desde la anterior y reinicia los contadores. Se toma
        // seguido porque cada test abre y descarta un iframe con index.html: si se esperara al
        // final, V8 podría haber liberado ya los scripts de esos iframes.
        const archivos = {};
        const tomar = async () => {
            const { result } = await cdp.send("Profiler.takePreciseCoverage");
            for (const script of result) {
                const coincidencia = script.url.match(ARCHIVOS);
                if (coincidencia) acumular(archivos, coincidencia[1], script.functions);
            }
        };

        await pagina.goto(url);
        let terminado = false;
        while (!terminado) {
            await tomar();
            terminado = await pagina.locator(".jasmine-overall-result").count() > 0;
            if (!terminado) await pagina.waitForTimeout(100);
        }
        await tomar();
        const resultado = (await pagina.textContent(".jasmine-overall-result")).trim();

        console.log(`Resultado de Jasmine: ${resultado}\n`);
        console.log("| Archivo | Líneas ejecutables | Cubiertas | Líneas | Funciones | Ramas |");
        console.log("|---|---|---|---|---|---|");
        let totalEjecutables = 0;
        let totalCubiertas = 0;
        let funcionesTotal = 0;
        let funcionesCubiertas = 0;
        let ramasTotal = 0;
        let ramasCubiertas = 0;
        const porcentaje = (parte, total) => (total ? `${(100 * parte / total).toFixed(1)} %` : "n/a");
        for (const nombre of Object.keys(archivos).sort()) {
            const { ejecutables, cubiertas } = contarLineas(archivos[nombre]);
            const f = [...archivos[nombre].funciones.values()].map((x) => x.cubierta);
            const r = [...archivos[nombre].ramas.values()].map(ramaCubierta(archivos[nombre]));
            const fc = f.filter(Boolean).length;
            const rc = r.filter(Boolean).length;
            totalEjecutables += ejecutables;
            totalCubiertas += cubiertas;
            funcionesTotal += f.length; funcionesCubiertas += fc;
            ramasTotal += r.length; ramasCubiertas += rc;
            console.log(`| js/${nombre} | ${ejecutables} | ${cubiertas} | ${porcentaje(cubiertas, ejecutables)} | ${fc}/${f.length} (${porcentaje(fc, f.length)}) | ${rc}/${r.length} (${porcentaje(rc, r.length)}) |`);
        }
        console.log(`| **Total** | **${totalEjecutables}** | **${totalCubiertas}** | **${porcentaje(totalCubiertas, totalEjecutables)}** | **${funcionesCubiertas}/${funcionesTotal} (${porcentaje(funcionesCubiertas, funcionesTotal)})** | **${ramasCubiertas}/${ramasTotal} (${porcentaje(ramasCubiertas, ramasTotal)})** |`);
        if (process.argv.includes("--detalle")) {
            console.log("\nRamas y funciones sin cubrir (archivo:línea, texto de la línea):");
            for (const nombre of Object.keys(archivos).sort()) {
                const { source, funciones: mapaFunciones, ramas } = archivos[nombre];
                const lineaDe = (desplazamiento) => source.slice(0, desplazamiento).split("\n").length;
                const sinCubrir = [
                    ...[...mapaFunciones].filter(([, x]) => !x.cubierta).map(([clave]) => ["función", clave]),
                    ...[...ramas].filter(([, x]) => !ramaCubierta(archivos[nombre])(x)).map(([clave]) => ["rama", clave])
                ].map(([tipo, clave]) => [tipo, lineaDe(Number(clave.split("-")[0]))])
                    .sort((a, b) => a[1] - b[1]);
                for (const [tipo, linea] of sinCubrir) {
                    console.log(`- js/${nombre}:${linea} (${tipo}) ${source.split("\n")[linea - 1].trim().slice(0, 90)}`);
                }
            }
        }
        process.exitCode = /\b0 failures\b/.test(resultado) ? 0 : 1;
    } finally {
        await navegador.close();
        servidor.close();
    }
})();
