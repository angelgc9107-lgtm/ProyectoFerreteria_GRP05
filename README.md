# 🌐 Ferretería Online — FerroLab
 
## 🎓 Datos Académicos
 
- **Carrera:** Tecnicatura Universitaria en Programación de Sistemas
- **Materia:** Programación Web I
- **Profesor:** Lic. Matias Velasquez
- **Cuatrimestre / Año:** 2.º Cuatrimestre / 2026
## 📖 Descripción
 
Tienda online de una ferretería que en teoría es física, pero que también
cuenta con venta a través de internet. El sitio permite a los clientes
explorar el catálogo de productos organizados por categoría, agregarlos al
carrito de compras, elegir un método de pago y confirmar su pedido.
 
## 🎯 Objetivo del entregable
 
**Actividad Obligatoria N°1:** construir la estructura base en HTML5 de la
página web, con sus secciones principales (Inicio, Catálogo, Carrito y
Contacto).
 
**Actividad Obligatoria N°2:** incorporar los estilos visuales mediante CSS
a partir del mockup actualizado en Figma (paleta de colores, tipografías,
espaciados y estados de interacción), implementar el diseño responsive para
mobile, tablet y desktop con Flexbox, CSS Grid y media queries, y validar el
sitio con un proceso de QA asistido por Playwright MCP y GitHub MCP.
 
**Primer Parcial:** migrar el sitio a Bootstrap 5 (sistema de 12 columnas y
utilidades responsive) a partir del mockup actualizado en Figma, incorporar
al menos dos componentes avanzados de Bootstrap y dos componentes avanzados
de HTML, y validarlos con test cases automatizados con Playwright MCP y
GitHub MCP.
 
**Actividad Obligatoria N.º 3:** incorporar lógica de programación con
JavaScript mediante cuatro flujos funcionales que permitan procesar datos,
realizar validaciones y mostrar resultados. Los flujos utilizan estructuras
condicionales, ciclos, arreglos y objetos. Su funcionamiento se documentó
mediante diagramas de actividades realizados con PlantUML y se desarrollaron
pruebas automatizadas con Jasmine.
 
**Actividad Obligatoria N.º 4 (Cuarta Entrega):** transformar el proyecto
—que usaba `prompt()` y `alert()`— en una aplicación web interactiva
completa, aplicando cuatro pilares técnicos:
 
- Manipulación del DOM y eventos del usuario.
- Programación Orientada a Objetos, con clases en `js/models/`.
- Almacenamiento persistente con `localStorage` y `sessionStorage`, a través
  de una capa de abstracción en `js/utils/storage.js`, conectada al controlador
  mediante la fachada `js/services/FachadaStorage.js`.
- Testing automatizado con Jasmine.
Esta entrega se construye sobre las correcciones de la Actividad
Obligatoria N.º 3 y es la base técnica del Segundo Parcial Integrador.
 
## 🛠️ Tecnologías utilizadas
 
- HTML5
- CSS3 (`css/styles.css`, `css/components.css`, `css/responsive.css` y `css/bootstrap-overrides.css`)
- Bootstrap 5
- JavaScript (módulos ES6, DOM y eventos)
- Programación Orientada a Objetos (clases de dominio en `js/models/`)
- Web Storage API (`localStorage` y `sessionStorage`)
- PlantUML (diagramas de actividades y diagrama de clases)
- Jasmine (pruebas automatizadas de JavaScript)
- Git y GitHub (control de versiones, Pull Requests, Issues, Projects, Pages y Releases)
- GitHub Copilot Agent Mode y Claude (asistencia al desarrollo y code reviews del rol Coordinador / DevOps; en cada review se documenta la herramienta realmente usada)
- Playwright (validación y pruebas en un navegador real): con Playwright MCP en las actividades anteriores y, en la cuarta entrega, ejecutado por script (ver «Limitaciones conocidas» más abajo)
## ✅ Funcionalidades
 
- Visualización del catálogo de productos por categoría.
- Búsqueda y filtrado de productos.
- Carrito de compras con cantidad editable y cálculo de subtotales.
- Selección de método de pago y cálculo de cuotas.
- Resumen y confirmación de pedido.
- Los cuatro flujos funcionales operan desde la interfaz HTML, con
  formularios, inputs y botones, sin `prompt()` ni `alert()`.
- Validación de las entradas en tiempo real, con feedback visual.
- Resultados mostrados mediante manipulación del DOM.
- **Persistencia del carrito en Web Storage:** el carrito se guarda en `localStorage` (clave `app:carrito:items`) y se restaura al recargar la página. El controlador accede a través de la fachada `js/services/FachadaStorage.js` y no conoce claves ni detalles de `StorageUtil`. Si el navegador no permite guardar, la interfaz avisa y el carrito sigue funcionando en memoria.
- Catálogo, ofertas, tabla de precios, categorías, métodos de pago y cuotas se dibujan desde JavaScript (`index.html` no repite productos ni precios); las ofertas y las opciones de pago salen de `ServicioOfertas` y `ServicioOpcionesPago`.
- Pruebas automatizadas de modelos, servicios, storage y controlador con Jasmine.
## ▶️ Cómo ejecutar el proyecto
 
`index.html` carga el controlador como módulo ES6 (`<script type="module" src="js/script.js">`), por lo que **no funciona abriéndolo con `file://`**: hay que servirlo por HTTP. Desde la raíz del repositorio:
 
```bash
python -m http.server 8080
```
 
- Sitio: <http://localhost:8080/index.html>
- Pruebas: <http://localhost:8080/js/test/test-runner.html>
## 🏗️ Arquitectura del proyecto
 
El código se organiza por responsabilidad:
 
| Archivo / carpeta | Responsabilidad |
|---|---|
| `js/script.js` | Controlador principal: solo manejo de eventos y manipulación del DOM. Invoca a las clases del dominio. |
| `js/models/` | Clases del dominio (PascalCase, un archivo por clase) con la lógica de negocio, validaciones internas y serialización (`toJSON()` / `fromJSON()`). No toca el DOM ni los eventos. |
| `js/services/` | Servicios entre el controlador y el dominio: `FachadaStorage.js` (acceso a storage), `ConfirmadorPedidos.js` (numeración), `ValidacionCarrito.js`, `FormateadorMoneda.js`, `ServicioOfertas.js`, `ServicioCategorias.js` y `ServicioOpcionesPago.js`. |
| `js/data/imagenesCatalogo.js` | Mapa de imágenes de los productos del catálogo. |
| `js/utils/storage.js` | Capa de abstracción para `localStorage` y `sessionStorage`: operaciones CRUD, manejo de errores y serialización de JSON. Solo la usa la fachada `FachadaStorage.js`. |
| `js/test/` | Suites de Jasmine (`script.spec.js`, `models.spec.js`, `services.spec.js`, `storage.spec.js`), el runner `test-runner.html` y `testing-doc.md`. |
 
```
.
├── .github/PULL_REQUEST_TEMPLATE/   # Plantillas de PR (feature y release)
├── README.md
├── changelog.md
├── index.html
├── css/
├── js/
│   ├── script.js                    # Controlador (eventos y DOM)
│   ├── models/                      # Clases del dominio (POO)
│   ├── services/                    # Fachada de storage, ofertas, categorías, opciones de pago, formateo
│   ├── data/imagenesCatalogo.js     # Imágenes del catálogo
│   ├── utils/storage.js             # Utilidades de storage
│   └── test/                        # Jasmine: specs, runner, testing-doc.md y herramientas/ (cobertura)
└── docs/
    ├── 01-mockup/                   # Mockups y estados visuales (cuarta-entrega/)
    ├── 02-prompts/
    ├── 03-specs/                    # Un spec por rol y por actividad
    ├── 04-testing/
    ├── 05-diagramas/
    │   ├── 01-diagrama-de-actividades/
    │   └── 02-diagrama-de-clases/
    └── 06-storage/                  # storage-doc.md
```
 
## 🎨 Maqueta de diseño web
 
El producto final visual es una tienda online con identidad de marca propia (FerroLab), organizada en 4 pantallas principales: Inicio (con carrusel de destacados, ofertas y bloques de confianza), Catálogo (con búsqueda, filtros por categoría y precio, y grid de productos), Carrito de compras (panel lateral deslizable con resumen de costos) y una sección de Contacto/Ubicación integrada en el footer.
 
El diseño completo puede verse en el mockup de Figma enlazado abajo.
 
En el Primer Parcial el mockup se adaptó a la grilla de Bootstrap 5: desktop de 1280 px con container de 1140 px y 12 columnas, mobile de 390 px con las columnas apiladas (`col-12`) y la navbar colapsada, y los componentes señalados en cada pantalla (Navbar, Carousel, Offcanvas, Dropdown e iframe de Google Maps dentro de `.ratio.ratio-16x9`).
 
## 📁 Documentación
 
**Diseño**
 
- [Mockup en Figma (actualizado en el Primer Parcial con Bootstrap)](https://www.figma.com/design/jX7NrMUtt6Tg7oiYqock6s/Sin-t%C3%ADtulo?node-id=191-963&t=ouTMvmvpb279r7wJ-1)
- [Mockup Bootstrap exportado (Primer Parcial)](docs/01-mockup/disenio-bootstrap.png)
- [Estados de interacción Bootstrap (Primer Parcial)](docs/01-mockup/estados-bootstrap.png)
- [Estados visuales de la cuarta entrega](docs/01-mockup/cuarta-entrega/README.md): capturas de la interfaz implementada (carrito vacío, método de pago y cuotas, formulario con errores, resumen, confirmación y cancelación). Son capturas de la aplicación real y complementan el mockup de Figma enlazado debajo.
- [Mockup incorporación de estados visuales del flujo de compra](https://www.figma.com/design/jX7NrMUtt6Tg7oiYqock6s/Sin-t%C3%ADtulo?node-id=13-162&p=f&t=yU37ueX5pAf3yZKM-0)
- [Mockup con estilos exportado (Actividad Obligatoria N°2)](docs/01-mockup/actividad-obligatoria-2/dise%C3%B1o-con-estilos.png)
**Especificaciones por rol**
 
- [Specs del Primer Parcial](docs/03-specs/primer-parcial/)
- [Specs de la Actividad Obligatoria N.º 3](docs/03-specs/actividad-obligatoria-3/)
- [Specs de la Actividad Obligatoria N.º 4](docs/03-specs/actividad-obligatoria-4/)
  - [Coordinador / DevOps](docs/03-specs/actividad-obligatoria-4/spec-devops.md)
  - [Tester QA](docs/03-specs/actividad-obligatoria-4/spec-tester-qa.md)
  - [Desarrollador JS Eventos + DOM](docs/03-specs/actividad-obligatoria-4/spec-dev-eventos-dom.md)
  - [Desarrollador JS POO](docs/03-specs/actividad-obligatoria-4/spec-dev-poo.md)
  - [Desarrollador JS Storage](docs/03-specs/actividad-obligatoria-4/spec-dev-storage.md)
**Diagramas**
 
- [Diagramas de actividades](docs/05-diagramas/01-diagrama-de-actividades/diagramas-doc.md)
- [Diagrama de clases](docs/05-diagramas/02-diagrama-de-clases/diagrama-clases-doc.md)
**Storage**
 
- [Estrategia de almacenamiento (localStorage vs sessionStorage)](docs/06-storage/storage-doc.md)
**Testing**
 
- [Índice de test cases (HTML/CSS)](docs/04-testing/testing-doc.md)
- [Documentación de testing con Jasmine](js/test/testing-doc.md)
- [Pruebas automatizadas con Jasmine](js/test/)
- [Medición de cobertura con V8](js/test/herramientas/cobertura-v8.js)
**Gestión del proyecto**
 
- [Tablero Kanban](https://github.com/users/angelgc9107-lgtm/projects/1)
- [Índice de Prompts](docs/02-prompts/prompts.md)
- [Changelog](changelog.md)
- [Plantillas de Pull Request (feature y release)](.github/PULL_REQUEST_TEMPLATE/)
## 🧪 Pruebas automatizadas con Jasmine
 
Las pruebas verifican el comportamiento de las clases del dominio, de la
capa de storage y del controlador.
 
- **Directorio de pruebas:** `js/test/`
- **Runner:** `js/test/test-runner.html` (se abre en el navegador, servido por HTTP; ver «Cómo ejecutar el proyecto»)
- **Suites:**
  - `js/test/models.spec.js`: clases del dominio (constructores, métodos de negocio, validaciones, casos borde y serialización).
  - `js/test/services.spec.js`: servicios (fachada de storage, confirmación de pedidos, ofertas, categorías, opciones de pago, formateo y validación de cantidades).
  - `js/test/storage.spec.js`: operaciones CRUD y manejo de errores de storage (cuota, lectura, `key()`/`length`, `limpiar()`, storage sin `getItem()`).
  - `js/test/script.spec.js`: controlador principal. Abre el `index.html` real en un iframe por test y recorre los cuatro flujos (búsqueda, carrito, pago y confirmación), la persistencia del carrito al recargar y los casos borde (carrito vacío, acciones repetidas, storage que rechaza escrituras).
- **Resultado actual:** 451 specs, 0 failures (89 de modelos, 189 de storage, 57 de servicios y 116 del controlador).
- **Cobertura** (V8 de Chromium; procedimiento y limitaciones en `js/test/testing-doc.md`): 99,7 % de líneas, 100 % de funciones y 99,7 % de ramas. La cobertura de ramas es una estimación a partir de los bloques que informa V8, no equivale a la de Istanbul; las 2 ramas y las 5 líneas que quedan sin cubrir son guardas defensivas inalcanzables sin modificar el código de producción, y cada una está justificada en el documento.
- **Documentación:** [`js/test/testing-doc.md`](js/test/testing-doc.md), con la estructura de testing, las instrucciones para ejecutar cada módulo, las métricas de cobertura y las capturas de resultados.
## ⚠️ Limitaciones conocidas
 
- **Persistencia:** solo se guarda el carrito. Los pedidos confirmados y la secuencia de numeración **no** se guardan: `ConfirmadorPedidos` numera en memoria y el número vuelve a `0001` al recargar. Tampoco se sincroniza el carrito entre pestañas.
- **Datos de storage reservados:** `FachadaStorage` y `CLAVES` soportan historial y secuencia de pedidos, preferencias, caché del catálogo, borrador del checkout, filtros y mensaje de bienvenida, pero ninguna pantalla los usa (están probados por separado). Está indicado en [`storage-doc.md`](docs/06-storage/storage-doc.md).
- **Validación del formulario del cliente:** se hace al enviar el formulario y muestra el mensaje del modelo; no hay validación por campo mientras se escribe (la cantidad del carrito sí se valida al escribir). Es una decisión del equipo documentada en `js/test/testing-doc.md` (H1).
- **Datos del catálogo en JavaScript:** el catálogo inicial sigue declarado en `js/script.js` y la configuración de ofertas en `js/services/ServicioOfertas.js`; ya no están en `index.html`.
- **Mockup:** además del mockup de Figma, los estados visuales de la aplicación implementada están documentados con capturas en `docs/01-mockup/cuarta-entrega/` (ver «Documentación»).
- **Playwright MCP:** los tests de la cuarta entrega se ejecutaron con Playwright (Chromium) por script, no con el servidor Playwright MCP, y el recorrido manual de los cuatro flujos no se hizo con MCP. El criterio figura como no cumplido en [`spec-tester-qa.md`](docs/03-specs/actividad-obligatoria-4/spec-tester-qa.md).
- **Evidencia de prompts del Tester QA:** no se conservan los prompts exactos con los que se generaron las suites; también figura como no cumplida en `spec-tester-qa.md`.
## 🔍 Code Reviews
 
Los code reviews de las Pull Requests de los demás integrantes son
responsabilidad del rol Coordinador / DevOps. Los prompts utilizados, el
resumen de cada review y los `CHANGES_REQUESTED` cargados se documentan en
la [especificación del Coordinador / DevOps](docs/03-specs/actividad-obligatoria-4/spec-devops.md).
Se revisaron las PRs #140, #141, #144, #150, #156 y #157. La decisión de aprobar e integrar cada cambio es del revisor humano.
 
## 🔀 Flujo de ramas y entrega
 
- Cada rol trabaja en una rama `feature/...` con Pull Request hacia `develop`, aprobada por otro integrante.
- Las correcciones de la tercera entrega se hicieron con PRs `fix/...` contra `release/tercera-entrega` y se sincronizaron con `develop` mediante un backport.
- La cuarta entrega sale de `release/cuarta-entrega`, con PR hacia `master`, y se publica como release `v1.2-cuarta-entrega`.


## 👥 Integrantes del Grupo

| Nombre y Apellido | Matrícula | Usuario de GitHub | Rol (Cuarta Entrega) |
|-----| ----- | ------ | ------ |
| Luciano Barrionuevo | 156398 | @LuchoBarrionuevo13 | Desarrollador JS POO |
| Alan Diaz | 152841 | @alandox1 |Coordinador / DevOps + Tester QA |
| Angel Cuarteron | 159438 | @angelgc9107-lgtm | Desarrollador JS Eventos + DOM |
| Thiago Piastrellini | 158097 | @Piastrellini | Desarrollador JS Local y Session Storage |
