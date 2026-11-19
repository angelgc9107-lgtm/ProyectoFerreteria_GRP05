# Spec: Implementación de Eventos y Manipulación del DOM

**Rol:** Desarrollador JavaScript Eventos + DOM  
**Se traza contra:** `plan.md` — RF4-RF5, RF9-RF24; RNF3, RNF5, RNF7-RNF11, RNF13-RNF15.  
**Entrega:** Actividad Obligatoria N.º 4 — FerroLab

## BEFORE

## Qué se va a hacer

Se refactorizará `js/script.js` para que actúe como controlador de la aplicación: registrará y atenderá eventos, leerá datos de formularios y controles HTML, coordinará las llamadas a las clases del dominio de `js/models/` y actualizará el DOM. La lógica de búsqueda, carrito, pagos, validaciones y pedidos quedará a cargo del dominio, no se duplicará en el controlador. Las funciones de interacción actuales basadas en `prompt()` y `alert()` serán reemplazadas por formularios, controles, mensajes y regiones de resumen visibles en la página.

Se actualizará `index.html` solo en lo necesario para identificar acciones y productos, completar los controles que faltan para búsqueda, pago y confirmación, y disponer regiones para resultados, errores y estados. El HTML actual ya contiene el formulario de búsqueda, filtros de orden y precio, botones Comprar, un offcanvas de carrito de muestra y un formulario de contacto; este último conservará su propósito y no se reutilizará como formulario del pedido.

## Por qué

La entrega anterior resuelve los cuatro flujos mediante diálogos modales y estado JavaScript, pero no permite operar el proceso desde los controles de la página. La refactorización convierte esa simulación en una experiencia web interactiva, mostrando resultados, carrito, condiciones de financiación y confirmación en el DOM, con validación y respuesta visual durante la interacción.

La tarea conecta búsqueda y filtrado (RF4-RF5), carrito y cálculos (RF9-RF13 y RF20), selección y visualización del pago (RF14-RF19), y validación, resumen y confirmación (RF21-RF24). También contribuye a la accesibilidad y usabilidad (RNF3, RNF5), mantenibilidad, legibilidad y separación de responsabilidades (RNF7-RNF9), escalabilidad y extensibilidad (RNF10-RNF11), compatibilidad (RNF13), precisión de cálculos (RNF14) y claridad financiera (RNF15). La lógica de negocio seguirá siendo responsabilidad de las clases de dominio del rol POO; la persistencia futura corresponderá a Storage.

## Eventos y controles por flujo

### 1. Búsqueda y filtrado del catálogo

- **Existentes:** formulario form[role="search"], campo `#busqueda`, selector `#orden`, rango `#precio-hasta` e indicador `#precio-hasta-valor`. La categoría se ofrece actualmente como enlaces de navegación, sin un valor de filtro identificado.

- **A incorporar o adecuar:** checkbox `#activar-filtro-precio` para habilitar o deshabilitar el filtro de precio máximo; controles de categoría con valores identificables; una región de resultados que pueda actualizarse dinámicamente y botones de compra vinculados al código del producto. Los controles de ordenamiento, categoría y precio deberán formar parte de los criterios enviados al dominio.

- **Eventos:** submit en el formulario de búsqueda para impedir la navegación y mostrar los resultados; input en el campo de texto y el rango de precio para actualizar los resultados cuando corresponda y mostrar el valor seleccionado; change en el checkbox, la categoría y el selector de ordenamiento para aplicar los criterios seleccionados.

- **Comportamiento:** los filtros de texto y categoría vacíos se omitirán. El filtro de precio máximo estará desactivado por defecto, mostrando el texto «Sin límite» en `#precio-hasta-valor` y manteniendo deshabilitado el rango `#precio-hasta`. Al activar el checkbox, se habilitará el rango y se aplicará el precio máximo seleccionado, que deberá ser un valor numérico mayor o igual a cero. Al desactivarlo, se eliminará la restricción de precio y se actualizarán los resultados del catálogo.

### 2. Gestión del carrito de compras

- **Existentes:** botón que abre el offcanvas `#carrito`, artículos de muestra, campos de cantidad, botones Eliminar, importes estáticos y botón Iniciar compra.
- **A incorporar o adecuar:** identificadores de producto en las tarjetas y controles de compra, una región dinámica para los ítems y el estado vacío, contador, subtotales y total. Las acciones de agregar, cambiar cantidad, eliminar y continuar deberán poder identificarse a partir del producto correspondiente.
- **Eventos:** `click` para agregar, eliminar y continuar a pago; `change` en cantidades para validar y actualizar el carrito. Se usará delegación en los contenedores estables de catálogo/ofertas y carrito para las acciones repetidas de elementos creados o actualizados dinámicamente.
- Cada operación válida actualizará visualmente cantidades, subtotales y total. Un cambio en el total invalida las condiciones de pago; una entrada inválida conserva el estado anterior. El botón de compra informará si el carrito está vacío o iniciará el flujo de pago cuando haya productos.

### 3. Pago y cálculo de cuotas

- **Existentes:** texto informativo general sobre tarjeta; no hay controles para elegir el método ni las cuotas.
- **A incorporar:** controles de método de pago, cuotas disponibles, región de condiciones calculadas y acciones para continuar o cancelar. Las cuotas se habilitarán cuando corresponda al método seleccionado.
- **Eventos:** `change` en método y cuotas para actualizar las opciones y la vista de condiciones; `submit` del formulario de pago para validar y solicitar el cálculo al dominio sin recargar la página; `click` para cancelar o volver.
- La interfaz mostrará total original, cuotas, interés/recargo, total financiado y valor por cuota a partir del resultado del dominio. Si no hay productos, informará que no se puede pagar. Cancelar conservará los productos y descartará las condiciones de pago anteriores, según el flujo definido.

### 4. Resumen y confirmación del pedido

- **Existentes:** formulario `#contacto`, destinado a consultas y no al pedido.
- **A incorporar:** formulario de datos del cliente con nombre, correo y dirección de envío; región de resumen del pedido y condiciones de pago; acciones separadas para confirmar o cancelar.
- **Eventos:** `input` y/o `blur` para validar los campos y presentar feedback; `submit` para validar y actualizar el resumen sin navegación; `click` para confirmar o cancelar el pedido.
- La interfaz indicará los errores de nombre vacío o solo numérico, correo inválido y dirección vacía. Si se cancela la carga o se rechaza la confirmación, conservará carrito y pago; al confirmar, mostrará el identificador y resumen y reflejará el vaciado del carrito y las condiciones de pago.

Los cuatro flujos actualizarán regiones identificables del DOM. Los mensajes de estado y resultados se anunciarán de forma accesible. Las reglas detalladas de validación, cuotas, recargos y conservación del estado se mantendrán alineadas con los diagramas y el dominio.

## Decisiones de arquitectura

- **Registro homogéneo:** centralizar el alta de listeners en la inicialización de la aplicación, una vez que el DOM esté disponible, usando `addEventListener()`. Eliminar el arranque automático del menú con `prompt()` asociado a `data-iniciar-menu` y el listener inline del rango; su comportamiento pasará al controlador.
- **Listeners directos y delegación:** registrar directamente los eventos de formularios y controles únicos. Delegar `click` y `change` desde contenedores estables para tarjetas de producto e ítems del carrito; identificar acciones y productos mediante atributos semánticos y comprobar que el elemento activado pertenezca al contenedor. Evitar listeners duplicados al renderizar.
- **Separación controlador/dominio:** `js/script.js` será exclusivamente responsable de eventos, DOM y coordinación. `js/models/` contendrá las clases y reglas de negocio bajo responsabilidad del Desarrollador JS POO. Antes de integrar, se acordará con ese rol el contrato real de entrada y salida; no se presuponen nombres de clases ni métodos. El controlador no volverá a calcular totales, cuotas ni validaciones que correspondan al dominio.
- **Storage futuro:** se mantendrá una frontera para la futura integración con `js/utils/storage.js`, responsabilidad del Desarrollador JS Storage. Esta tarea no implementará persistencia ni decidirá un contrato todavía no definido.
- **Funciones de interfaz:** organizar funciones reutilizables para renderizar o actualizar regiones del DOM, mostrar mensajes, limpiar formularios y reflejar estados. El estado visual se derivará de los resultados del dominio y no se usará el HTML renderizado como fuente de datos.
- **Validación y estados:** validar durante la edición o al salir de cada campo y volver a validar al enviar. Asociar el error al control y actualizar sus estados visuales; habilitar o deshabilitar cuotas, acciones y botones según el método de pago, validez de los datos y estado del carrito. Mostrar u ocultar las secciones de pago y confirmación según el avance del flujo.
- **Seguridad y accesibilidad:** insertar contenido textual con APIs de texto del DOM, sin interpretar como HTML los valores de productos o usuario. Mantener etiquetas y nombres accesibles, foco visible, errores asociados a sus campos y anuncios de cambios relevantes.
- **Bootstrap:** conservar el control del offcanvas mediante sus atributos y comportamiento existentes; el controlador no duplicará listeners que ya gestione Bootstrap.

## Criterios de aceptación

- [ ] Dado que se carga la interfaz de la Actividad 4, cuando se usan los cuatro flujos, entonces `js/script.js` no invoca `prompt()` ni `alert()` y la interacción ocurre mediante controles HTML y mensajes en el DOM.
- [ ] Dado cada formulario y control interactivo de los cuatro flujos, cuando se inicializa la aplicación, entonces su evento relevante queda atendido mediante `addEventListener()` sin listeners duplicados.
- [ ] Dada una búsqueda, cuando se envía el formulario o se cambia un filtro, entonces el controlador captura los valores de inputs y selects y muestra los resultados sin recargar la página.
- [ ] Dado un filtro inválido, cuando se valida, entonces el usuario ve el error junto al control correspondiente y los resultados/estado no se actualizan con datos inválidos.
- [ ] Dado un campo del formulario de pedido, cuando el usuario lo edita o abandona, entonces la validación muestra feedback visual y accesible sin esperar al envío final.
- [ ] Dada una acción sobre un producto o ítem del carrito, cuando se agrega, actualiza o elimina, entonces los elementos, subtotales, total y contador correspondientes se crean, actualizan o eliminan dinámicamente del DOM.
- [ ] Dado un resultado de validación o una operación exitosa, cuando cambia su estado, entonces el control y mensaje aplican las clases visuales de error o éxito definidas para la interfaz.
- [ ] Dado un cambio de flujo, cuando corresponde continuar, volver o finalizar, entonces las regiones de búsqueda, pago y confirmación pertinentes se muestran u ocultan sin perder estado que deba conservarse.
- [ ] Dado un carrito vacío, datos incompletos o un método de pago que no admite cuotas, cuando se actualiza la interfaz, entonces las acciones no disponibles quedan deshabilitadas y las disponibles reflejan el estado actual.
- [ ] Dado el catálogo, cuando se busca o filtra desde la interfaz, entonces se muestran resultados acordes a los criterios y reglas del dominio.
- [ ] Dado el carrito, cuando se modifican productos o cantidades desde la interfaz, entonces se actualizan los importes y se invalida el pago si cambió el total.
- [ ] Dado un carrito con productos, cuando se eligen método y cuotas, entonces se ven las condiciones calculadas antes de confirmar la compra.
- [ ] Dado un carrito con condiciones de pago, cuando se completan y confirman los datos del pedido, entonces la interfaz muestra el resultado del pedido y refleja el vaciado del carrito y del pago.
- [ ] Dado que el usuario cancela el pago o rechaza/cancela el pedido, cuando vuelve al flujo correspondiente, entonces se conserva el estado que establecen los diagramas.
- [ ] Dado el controlador, cuando se revisa su responsabilidad, entonces solo coordina eventos, entradas, llamadas al dominio y actualizaciones del DOM; los cálculos y reglas de negocio pertenecen a `js/models/`.
- [ ] Dada la integración con el dominio, cuando el controlador procesa una acción, entonces utiliza únicamente clases y operaciones efectivamente definidas y acordadas con el Desarrollador JS POO.

## AT CLOSE — Evidencia de implementación

Pendiente de completar al finalizar el desarrollo. Registrar:

- **Prompt exacto de GitHub Copilot Agent Mode:**
  ```text
  [Pendiente: pegar el prompt exacto utilizado.]
  ```
- **Archivos adjuntados como contexto:** `plan.md`, `index.html`, `js/script.js`, los cuatro diagramas de actividades `.puml`, las clases que existan en `js/models/` al momento de la implementación y este `spec-dev-eventos-dom.md`.
- **Fragmento generado por Copilot:**
  ```javascript
  // Pendiente: incluir un fragmento real de al menos un event listener.
  ```
- **Ajustes manuales y justificación:** pendiente de documentar durante la implementación.
- **Decisiones finales sobre el controlador y su integración con las clases del dominio:** pendientes de documentar una vez acordados e implementados.