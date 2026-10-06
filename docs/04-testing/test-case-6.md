# Test Case 6 — Testing responsive de la migración a Bootstrap (rol Desarrollador Frontend/Bootstrap)

## Objetivo

Verificar con Playwright MCP que, tras la migración a Bootstrap 5.3.8, la página responde correctamente en iPhone 14 Pro, Samsung Galaxy S23, iPad Air y escritorio, sin scroll horizontal, sin elementos superpuestos/cortados/fuera de pantalla y sin que Bootstrap haya roto los estilos existentes del proyecto.

## Entorno

| Dato | Valor |
|------|-------|
| URL | http://localhost:3000 (título: "FerroLab \| Ferreteria") |
| Herramienta | Playwright MCP (navegador controlado: navegación, `resize`, `evaluate`, capturas) |
| Hojas de estilo cargadas | Bootstrap 5.3.8 (CDN jsDelivr), `styles.css`, `components.css`, `responsive.css`, `bootstrap-overrides.css` |
| Fecha | 2026-10-06 |
| Código modificado | Ninguno (no se tocaron `index.html`, CSS ni spec) |

**Alcance del emulador:** los dispositivos se emularon con el tamaño de viewport (`browser_resize`) y recarga de la página en cada tamaño. No se emularon user-agent, touch ni DPR (DPR = 1). El ancho útil (`clientWidth`) es 15 px menor al viewport por la barra de scroll vertical.

## Dispositivos probados

| Dispositivo | Viewport (CSS px) |
|-------------|-------------------|
| iPhone 14 Pro | 393 × 852 |
| Samsung Galaxy S23 | 360 × 780 |
| iPad Air | 820 × 1180 |
| Escritorio | 1440 × 900 |

## Verificaciones realizadas

En cada dispositivo se ejecutó un script de auditoría (`browser_evaluate`) que midió: `scrollWidth` vs `clientWidth`, elementos con `right > clientWidth` o `left < 0`, contenedores con `overflow` que recortan contenido, carga de las 16 imágenes `<img>`, geometría de secciones, solapamiento de cajas entre elementos hoja (h1–h3, p, a, button, label, input, img, summary, li), geometría del carrito (incluidas las imágenes `::before` de cada producto) y estado de la navegación. Además se tomaron capturas de elementos (header, ofertas, catálogo, carrito, footer) y se revisaron visualmente.

Nota: las imágenes de los productos del carrito (`cart-item--grinder` y `cart-item--hammer`) se renderizan como `::before` con `background-image` (`amoladora.png` y `martillo-galponero.png`), por lo que se verificó su tamaño, `display`, `visibility` y la carga real de cada archivo (`new Image()`).

## Resultados reales obtenidos

### Resumen por dispositivo

| Verificación | iPhone 14 Pro (393) | Galaxy S23 (360) | iPad Air (820) | Escritorio (1440) |
|--------------|---------------------|------------------|----------------|-------------------|
| Sin scroll horizontal | ✅ scrollW 378 = clientW 378 | ✅ 345 = 345 | ✅ 805 = 805 | ✅ 1425 = 1425 |
| Elementos fuera de pantalla (`right`/`left`) | ✅ 0 | ✅ 0 | ✅ 0 | ✅ 0 |
| Ofertas | ✅ 3 tarjetas en 1 columna (297 px) | ✅ 1 columna (297 px) | ✅ 2 columnas (3.ª tarjeta en 2.ª fila) | ✅ 3 columnas (275 px) |
| Servicios | ✅ cajas apiladas, sin desborde | ✅ sección 345 px, sin desborde ni solapes | ✅ sin desborde ni solapes | ✅ 3 columnas (275 px) |
| Bienvenida | ✅ 2 imágenes apiladas (297×208) | ✅ apiladas (297×208) | ✅ 2 imágenes lado a lado (379×208) | ✅ lado a lado (552×208) |
| Catálogo (9 productos) | ✅ 1 columna | ✅ 1 columna | ✅ sidebar de filtros + 2 columnas | ✅ sidebar + 3 columnas |
| Footer | ✅ redes en 3 columnas, contacto y mapa apilados | ✅ ancho completo | ✅ redes en fila, mapa a ancho completo | ✅ contacto y ubicación en 2 columnas |
| Carrito visible | ✅ 378 px, panel completo | ✅ 345 px | ✅ 483 px, junto a "Precios destacados" | ✅ 403 px, a la derecha |
| 2 imágenes del carrito visibles | ✅ ambas 72×70 px, `display:block`, `visibility:visible`, archivos cargan | ✅ ambas 72×99 / 72×84 px | ✅ ambas 72×64 px | ✅ ambas 72×64 px |
| Imágenes `<img>` (16) | ✅ 0 rotas, 0 desbordadas | ✅ 0 / 0 | ✅ 0 / 0 | ✅ 0 / 0 |
| Textos/imágenes superpuestos (visual) | ✅ no se observan | ✅ no se observan | ✅ no se observan | ✅ no se observan |
| Elementos cortados | ✅ ninguno visible* | ✅ ninguno visible* | ✅ ninguno visible* | ✅ ninguno visible* |
| Navegación utilizable | ✅ Catálogo, Ofertas, Dónde estamos, Categorías en una línea | ✅ los 3 enlaces en una línea y "Categorías" baja a 2.ª línea (wrap) | ✅ 5 elementos en una línea | ✅ 5 elementos en una línea |
| Estilos existentes no rotos | ✅ | ✅ | ✅ | ✅ |

\* El único elemento con `overflow:hidden` y contenido mayor que su caja es un `<label>` de 1×1 px (clase de texto oculto para accesibilidad, patrón sr-only), presente en los 4 tamaños; no es un defecto.

### Detalle relevante

- **Carrito (imágenes):** en los 4 tamaños, `amoladora.png` (85×50) y `martillo-galponero.png` (58×59) cargaron correctamente y se ven en la captura de cada tamaño junto al título, cantidad, subtotal y botón "Eliminar".
- **Navegación:** el enlace "Inicio" del nav tiene `display:none` en móvil (360 y 393 px) por la regla `nav a[href="#inicio"]` de `responsive.css` (línea 69); es decisión de diseño existente (el logo enlaza a `#inicio`). Aparece en iPad y escritorio.
- **Estilos del proyecto:** tipografía `Inter, Arial…` aplicada, colores rojos de marca, tarjetas, botones "COMPRAR", tabla "Precios destacados", formulario y footer mantienen su aspecto; no se observaron estilos pisados por Bootstrap.
- **Solapamiento de cajas (no visual):** el script detectó intersecciones de cajas delimitadoras entre `h2 "Carrito de compras"` y el botón "Cerrar" (28×28 px), entre cada `h3` de producto y el botón "Eliminar" (20×20 px) y, solo en iPad, `p "Precio unitario"` del martillo con "Eliminar" (20×3 px). Visualmente en las capturas el texto no se pisa con los botones; son cajas contiguas/ancho completo del título bajo el botón posicionado. Se registra como observación, no como fallo.
- **Consola:** 1 error, `404` en `/favicon.ico` (no afecta al responsive).

## Problemas encontrados

No se encontraron fallos bloqueantes de responsive. Observaciones menores (sin corregir, sin Issue):

| # | Observación | Dispositivo | Sección | Pasos | Obtenido | Esperado |
|---|-------------|-------------|---------|-------|----------|----------|
| O-1 | Panel del carrito con mucho espacio vacío | Todos (en móvil ~400 px de rojo vacío bajo "Iniciar compra"; en escritorio además un bloque gris vacío de ~460×768 px a la izquierda del carrito) | Carrito | 1. Abrir http://localhost:3000. 2. Hacer scroll hasta "Carrito de compras" (o capturar `#carrito`). | El `<aside id="carrito">` mide 768 px de alto aunque el contenido ocupa ~300 px; en escritorio queda un área gris vacía a su izquierda. | Altura ajustada al contenido y sin bloque vacío (a confirmar con el mockup/spec si el alto fijo es intencional). |
| O-2 | Error 404 de favicon | Todos | Global | Cargar la página y revisar la consola. | `GET /favicon.ico 404`. | Sin errores en consola (añadir favicon o `<link rel="icon">`). |
| O-3 | Texto "Carrito (0)" en el encabezado con 2 productos en el carrito | iPad Air (820 px) | Header | Cargar la página a 820 px y observar el header. | Muestra "Carrito (0)" mientras el carrito contiene 2 artículos. | Contador coherente con el contenido (es HTML estático; relevante para la futura lógica JS). |

## Estado final de la prueba

**APROBADA con observaciones menores (O-1, O-2, O-3).** Los 12 criterios solicitados se cumplieron en iPhone 14 Pro, Galaxy S23, iPad Air y escritorio según las mediciones y capturas obtenidas con Playwright MCP. No se creó ningún Issue ni rama de corrección; queda pendiente decidir si las observaciones se reportan.
