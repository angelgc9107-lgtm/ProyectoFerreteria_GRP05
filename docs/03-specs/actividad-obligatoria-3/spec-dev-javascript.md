# Spec: spec-dev-javascript

**Rol:** Desarrollador JavaScript

**Se traza contra:** `plan.md` — RF4-RF5, RF9-RF24, según los cuatro diagramas de actividades.

**Entrega:** Actividad Obligatoria N.º 3 — Programación Web I — FerroLab

**Estado:** Implementado, con ajustes realizados en coordinación con el Arquitecto de Software y correcciones derivadas de las pruebas del Tester.

## Qué se va a hacer

Se implementará la lógica de negocio de FerroLab utilizando JavaScript puro, tomando como referencia los cuatro diagramas de actividades desarrollados por el Arquitecto de Software y los requerimientos funcionales establecidos en `plan.md`.

La implementación se realizará mediante GitHub Copilot en modo Agente y se organizará en `js/script.js`, que será vinculado desde `index.html`.

Se desarrollarán cuatro flujos principales:

1. Búsqueda y filtrado del catálogo.
2. Gestión del carrito de compras.
3. Pago y cálculo de cuotas.
4. Resumen y confirmación del pedido.

Cada flujo contará con entrada de datos mediante `prompt()`, procesamiento mediante funciones JavaScript y presentación de resultados con `alert()` o `console.log()`.

Se utilizarán condicionales, ciclos, arrays y objetos, separando la lógica de negocio de las funciones de interacción con el usuario para facilitar las pruebas automatizadas con Jasmine.


## Por qué

- Permite incorporar las funcionalidades comerciales previstas en FerroLab sin modificar la estructura visual desarrollada en las entregas anteriores.
- Implementa los procesos definidos en los diagramas de actividades, manteniendo la trazabilidad con los requerimientos funcionales.
- Facilita la organización del código mediante funciones reutilizables, parámetros explícitos y valores de retorno.
- Permite realizar pruebas unitarias con Jasmine al mantener la lógica de negocio independiente de `prompt()` y `alert()`.
- Prepara la aplicación para una futura integración con el DOM y eventos, sin incorporarlos en esta actividad.

La manipulación del DOM, la implementación de eventos, las modificaciones visuales y la creación de las suites de Jasmine no forman parte del alcance de este rol.

## Estado actual del proyecto (análisis previo)

- **`index.html`:** contiene la estructura HTML5 de FerroLab, incluyendo catálogo, filtros, productos, carrito y secciones comerciales. La interfaz utiliza Bootstrap y estilos propios.
- **`css/styles.css`, `css/components.css`, `css/responsive.css` y `css/bootstrap-overrides.css`:** contienen los estilos visuales y responsive existentes. No serán modificados.
- **`plan.md`:** establece los requerimientos funcionales y no funcionales del proyecto.
- **Diagramas PlantUML:** describen los cuatro procesos de negocio que deberán implementarse.
- **`js/script.js`:** archivo previsto para centralizar la lógica JavaScript correspondiente a esta entrega.

La implementación deberá respetar los archivos existentes y evitar modificaciones ajenas al alcance del Desarrollador JavaScript.

## Flujos de actividades a implementar

### Flujo 1 — Búsqueda y filtrado del catálogo (RF4, RF5)

Se permitirá buscar productos mediante texto, categoría y precio máximo, pudiendo omitir cualquiera de estos criterios dejando su campo vacío.

El sistema validará que el precio máximo, cuando se ingrese, sea un número mayor o igual a cero. Si el valor está vacío, no se aplicará límite de precio.

Los resultados se ordenarán por precio ascendente. Si el usuario cancela cualquiera de los prompt(), regresará al menú principal sin modificar el estado del sistema.

### Flujo 2 — Gestión del carrito de compras (RF9-RF13, RF20)

Al agregar, modificar o eliminar productos, el sistema actualizará las cantidades y calculará el total del carrito.

Si el total cambia, se invalidarán las condiciones de pago previamente seleccionadas, debiendo elegirse nuevamente el método de pago y las cuotas.

Si el usuario cancela un prompt() durante una operación, el carrito no se modificará y regresará al menú de gestión del carrito. Al seleccionar la opción 0, regresará al menú principal.

### Flujo 3 — Pago y cálculo de cuotas (RF14-RF19)

Se simularán las condiciones de pago utilizando el total calculado a partir del carrito.

El sistema verificará que existan productos y solicitará un método de pago mediante `prompt()`.

Para efectivo o transferencia se establecerá una cuota y un recargo del 0 %. Para tarjeta de crédito se solicitará una cantidad de cuotas ofrecida y se obtendrá de la tabla correspondiente el porcentaje de recargo.

Se calculará el interés como el total multiplicado por el recargo, el total financiado como el total más el interés y el valor de cuota como el total financiado dividido por la cantidad de cuotas.

Se mostrarán con `alert()` el total original, la cantidad de cuotas, el interés, el total financiado y el valor de cada cuota. Después de que el usuario revise las condiciones, se guardarán el método y las cuotas para el resumen del pedido, sin solicitar una aceptación adicional.

Si el carrito está vacío, se informará "No hay productos para pagar" y finalizará el flujo.

Para pagos con tarjeta de crédito se permitirán las siguientes opciones:

1 cuota: 0 % de recargo.

3 cuotas: 10 % de recargo.

6 cuotas: 20 % de recargo.

Al cancelar la selección del método de pago o las cuotas, se descartarán las condiciones de pago anteriores y se regresará al menú principal, conservando los productos del carrito.

### Flujo 4 — Resumen y confirmación del pedido (RF21-RF24)

El sistema verificará que el carrito contenga productos y que exista un método de pago seleccionado.

Se solicitarán el nombre, correo electrónico y dirección de envío. El nombre no podrá estar vacío ni ser únicamente numérico; el correo deberá contener usuario, arroba y dominio válido; y la dirección no podrá estar vacía.

Los datos inválidos se solicitarán nuevamente hasta obtener una entrada válida o hasta que el usuario cancele.

Si el usuario confirma el pedido, se generará un identificador, se mostrará el resumen de la compra y se vaciarán tanto el carrito como las condiciones de pago.

Si cancela el ingreso del nombre, correo o dirección, se interrumpirá la confirmación y regresará al menú principal, conservando el carrito y las condiciones de pago.

Si responde NO o cancela la confirmación final, el pedido no se registrará y se conservarán los productos y las condiciones de pago seleccionadas.

## Menú principal e interacción

Se implementará un menú mediante `prompt()` con las siguientes opciones:

```text
FERROLAB — MENÚ PRINCIPAL

1. Buscar y filtrar productos
2. Gestionar carrito
3. Pagar y calcular cuotas
4. Confirmar pedido
0. Salir
```

El menú se repetirá hasta seleccionar la opción de salida.

Cada flujo regresará al menú principal según los pasos definidos en los diagramas de actividades.

Las cancelaciones de los prompts se gestionarán según las reglasacordadas con el Arquitecto de Software y documentadas en cada flujo.

La interacción se limitará a `prompt()`, `alert()` y `console.log()`, sin modificar elementos HTML ni registrar eventos.

## Estrategia de implementación

1. **Análisis previo:** revisar `plan.md`, los cuatro diagramas PlantUML y este spec antes de generar código.

2. **GitHub Copilot Agent Mode:** utilizar los diagramas y el spec como contexto para implementar los flujos, respetando las decisiones, validaciones y ciclos definidos.

3. **Funciones reutilizables:** implementar funciones con nombres descriptivos en `camelCase`, parámetros explícitos, valores de retorno y una responsabilidad concreta.

4. **Separación de responsabilidades:** mantener las funciones de negocio independientes de `prompt()`, `alert()` y `console.log()`.
    Las funciones de búsqueda, filtrado, validación y cálculo serán puras siempre que sea posible:
    recibirán parámetros y devolverán resultados sin modificar el estado externo. La interacción con el usuario se resolverá mediante funciones separadas.

5. **Arrays y objetos:** utilizar estructuras de datos para representar el catálogo, el carrito, las condiciones de pago y el resumen del pedido.

6. **Estado compartido:** conservar los datos necesarios entre flujos. Si cambia el total del carrito, se invalidarán las condicionesde pago previamente seleccionadas. Al confirmar un pedido, se vaciarán el carrito y las condiciones de pago.

7. **Validaciones:** aplicar las validaciones establecidas en los diagramas de actividades, contemplando entradas inválidas, valores vacíos y cancelaciones de prompts según las reglas acordadas con Arquitectura.

8. **Testabilidad:** declarar las funciones de negocio necesarias para Jasmine en un ámbito accesible desde las pruebas, evitando encapsularlas
    en IIFE o anidarlas dentro de otras funciones. Las funciones recibirán parámetros y devolverán resultados verificables, sin depender de la interacción mediante `prompt()` o `alert()`.

9. **Buenas prácticas:** utilizar indentación consistente, evitar duplicación de código e incorporar JSDoc cuando la complejidad de una función lo justifique.

10. **Integración:** vincular `js/script.js` desde `index.html`, modificando únicamente lo necesario para incorporar el archivo.

## Coordinación con otros roles

- **Arquitecto de Software:** proporciona los cuatro diagramas definitivos y coordina las reglas de negocio, validaciones y posibles ajustes de los flujos.
- **Tester:** desarrolla las suites de Jasmine y ejecuta las pruebas. El Desarrollador JavaScript debe facilitar funciones accesibles y corregir los defectos que le correspondan.
- **Coordinador / DevOps:** gestiona la integración mediante Issues, Pull Requests, revisiones y documentación del proyecto.

Las diferencias entre los diagramas y la implementación deberán revisarse con el Arquitecto y documentarse antes de considerar finalizado el desarrollo.

## Archivos previstos

| Archivo | Intervención |
|---|---|
| `docs/03-specs/actividad-obligatoria-3/spec-dev-javascript.md` | Crear y completar la especificación |
| `js/script.js` | Implementar la lógica de negocio |
| `index.html` | Incorporar la referencia al archivo JavaScript |
| `plan.md` | Consultar como referencia, sin modificar |
| Cuatro diagramas `.puml` | Consultar como contrato de implementación |

No se modificarán archivos CSS, componentes Bootstrap ni documentos pertenecientes a otros roles.

## Criterios de aceptación

- [X] Dado este spec, cuando se inicie la actividad, entonces estará creado y commiteado antes de implementar `js/script.js`.
- [X] Dados los cuatro diagramas PlantUML, cuando se revise la implementación, entonces los procesos, decisiones y ciclos corresponderán con los flujos definidos.
- [X] Dado `index.html`, cuando se revise su estructura, entonces `js/script.js` estará correctamente vinculado.
- [X] Dado el menú principal, cuando el usuario seleccione una opción válida, entonces se ejecutará el flujo correspondiente.
- [X] Dada una entrada inválida, cuando el diagrama indique una validación repetida, entonces se informará el error y se solicitará nuevamente el dato.
- [X] Dado el catálogo, cuando se aplique una búsqueda, entonces se obtendrán los productos que cumplan los criterios ingresados.
- [X] Dado el carrito, cuando se agreguen, modifiquen o eliminen productos, entonces sus cantidades y totales se actualizarán correctamente.
- [X] Dada una búsqueda con filtros vacíos, cuando se ejecute, entonces no se aplicarán los criterios omitidos.
- [X] Dada una operación del carrito, cuando se cancele un prompt(), entonces se conservará el carrito y se regresará a su menú.
- [X] Dado un carrito con condiciones de pago seleccionadas, cuando cambie su total, entonces se invalidarán dichas condiciones.
- [X] Dada una selección de pago cancelada, cuando se regrese al menú principal, entonces no quedarán condiciones de pago guardadas.
- [X] Dado un pedido confirmado, cuando finalice la operación, entonces se vaciarán el carrito y las condiciones de pago.
- [X] Dado un carrito con productos, cuando se seleccione un método de pago, entonces se calcularán correctamente los recargos, el total financiado y las cuotas.
- [X] Dado un pedido válido, cuando el usuario responda SI, entonces se generará un identificador, se informará la confirmación y se vaciará el carrito.
- [X] Dada una respuesta NO a la confirmación del pedido, cuando se cancele, entonces se informará "Pedido cancelado", se conservarán los productos y se regresará al menú principal.
- [X] Dadas las funciones de negocio, cuando el Tester las ejecute mediante Jasmine, entonces podrán recibir parámetros y devolver resultados sin depender de `prompt()` o `alert()`.
- [X] Dado `js/script.js`, cuando se revise, entonces utilizará condicionales, ciclos, arrays, objetos y funciones reutilizables.
- [X] Dada la implementación final, cuando se inspeccione el código, entonces no contendrá manipulación del DOM ni eventos.
- [X] Dado el desarrollo finalizado, cuando se revise este spec, entonces contendrá los prompts reales de Copilot, ejemplos de código y ajustes manuales documentados.
- [X] Dada la Pull Request hacia `develop`, cuando se solicite su integración, entonces contará con la revisión de otro integrante.


### Prompt exacto utilizado con GitHub Copilot Agent Mode
```
Actuá como Desarrollador JavaScript del proyecto FerroLab.
Tomá como contexto plan.md, spec-dev-javascript.md y los cuatro diagramas de actividades .puml proporcionados:

docs\05-diagramas\01-diagrama-de-actividades\actividad-flujo-1-busqueda-filtrado.puml
docs\05-diagramas\01-diagrama-de-actividades\actividad-flujo-2-carrito.puml
docs\05-diagramas\01-diagrama-de-actividades\actividad-flujo-3-pago-cuotas.puml
docs\05-diagramas\01-diagrama-de-actividades\actividad-flujo-4-confirmacion-pedido.puml

Objetivo: implementar en js/script.js la lógica de negocio en JavaScript puro, respetando los flujos, decisiones, validaciones y ciclos establecidos en los diagramas, que serán el contrato de implementación.
Requisitos de implementación
1.	Implementar los cuatro flujos:
o	Búsqueda y filtrado del catálogo.
o	Gestión del carrito de compras.
o	Pago y cálculo de cuotas.
o	Resumen y confirmación del pedido.
2.	Crear un menú principal mediante prompt() con opciones para los cuatro flujos y salir.
3.	Utilizar funciones con nombres descriptivos, responsabilidad única, parámetros y valores de retorno definidos.
4.	Implementar condicionales, ciclos, arrays y objetos para gestionar productos, carrito, pagos y pedidos.
5.	Validar entradas incorrectas, valores vacíos y cancelaciones, mostrando resultados mediante alert() o console.log().
Arquitectura y testabilidad
•	Separar las funciones de negocio de las funciones de interacción con prompt() y alert().
•	Priorizar funciones puras que reciban parámetros y devuelvan resultados verificables.
•	Evitar efectos secundarios innecesarios y exponer las funciones necesarias para Jasmine, sin encapsularlas en IIFE.
•	Documentar funciones complejas mediante JSDoc.
•	No manipular el DOM ni implementar eventos.
Restricciones y verificación
•	Centralizar la lógica en js/script.js y vincularlo desde index.html únicamente si es necesario.
•	No modificar archivos CSS, componentes Bootstrap ni archivos de otros roles.
•	Revisar que los cuatro flujos coincidan con los diagramas .puml.
•	Si existen diferencias o ambigüedades entre los diagramas y el spec, informarlas antes de implementar cambios que alteren las reglas de negocio.
Al finalizar, presentar un resumen de los archivos modificados, las funciones implementadas
```

### Archivos utilizados como contexto

- `plan.md`
- `index.html`
- `docs/03-specs/actividad-obligatoria-3/spec-dev-javascript.md`
- `docs\05-diagramas\01-diagrama-de-actividades\actividad-flujo-1-busqueda-filtrado.puml`
- `docs\05-diagramas\01-diagrama-de-actividades\actividad-flujo-2-carrito.puml`
- `docs\05-diagramas\01-diagrama-de-actividades\actividad-flujo-3-pago-cuotas.puml`
- `docs\05-diagramas\01-diagrama-de-actividades\actividad-flujo-4-confirmacion-pedido.puml`


### Código generado
```
var catalogoProductos = [
    {
        codigo: "GUANTES-001",
        nombre: "Guantes moteados multiuso maxima calidad",
        categoria: "Herramientas manuales",
        descripcion: "Proteccion multiuso para trabajos de ferreteria y mantenimiento.",
        precio: 4401
    },
    {
        codigo: "DESTORNILLADOR-001",
        nombre: "Destornillador punta plana Black Jack 8 x 200 mm",
        categoria: "Herramientas manuales",
        descripcion: "Destornillador con punta plana para tareas de ajuste y reparacion.",
        precio: 6026
    },
    {
        codigo: "PINZA-001",
        nombre: "Pinza punta curva mini 5 pulgadas ideal electronica",
        categoria: "Herramientas manuales",
        descripcion: "Pinza compacta para trabajos de precision en electronica.",
        precio: 6426
    },
```
Esto es solo un fragmento del código generado.

### Resultado obtenido
```
Revisé el spec y los cuatro diagramas. La comparación se limita a esos documentos; no revisé código ni modifiqué archivos.

Flujo afectado	Comportamiento definido en el spec	Comportamiento definido en el .puml	Inconsistencia encontrada	Comportamiento recomendado	Acción necesaria y rol responsable
Búsqueda y filtrado	El precio máximo es opcional; los filtros pueden usarse de forma independiente.	En cada búsqueda se valida que el precio máximo sea un número ≥ 0 y se compara el precio de los productos con ese máximo.	Contradicción: el spec permite omitir el precio; el diagrama lo requiere para filtrar. El diagrama no precisa qué hacer si texto o categoría quedan vacíos.	Permitir omitir criterios para facilitar búsquedas por texto o categoría sin limitar precio.	Coordinar con Arquitectura si el precio debe ser opcional. Luego, el Arquitecto actualiza el diagrama o el Desarrollador JavaScript actualiza el spec según lo acordado. Aclarar también el tratamiento de criterios vacíos.
Gestión del carrito	La opción de salir vuelve directamente al menú principal.	Después de cualquier opción, incluido “0 - Salir”, se recalcula y se muestra el carrito antes de finalizar el ciclo.	Contradicción: el flujo del diagrama muestra el carrito al salir; el spec indica retorno directo al menú.	Al elegir salir, volver al menú sin mostrar otra vez el carrito.	El Arquitecto debería ajustar el flujo del diagrama para que la opción salir omita el paso común de visualización; el Desarrollador JavaScript mantiene el spec como está.
Gestión del carrito	El spec general permite cancelar una operación y volver al menú. También indica que modificar el carrito invalida condiciones de pago anteriores.	El diagrama no incluye pasos de cancelación en las solicitudes de código/cantidad ni especifica qué hacer con el pago guardado cuando cambia el carrito.	Detalle no especificado por el diagrama, no contradicción directa.	Permitir cancelar sin cambios; invalidar el pago asociado a un carrito que fue modificado para no reutilizar condiciones desactualizadas.	El Arquitecto debería explicitar estos casos en el diagrama. El Desarrollador JavaScript puede conservar la descripción del spec una vez confirmada.
Pago y cuotas	Se guarda el método y las cuotas después de mostrar las condiciones. Permite cancelar sin modificar el carrito ni condiciones previas. Especifica 1 cuota sin recargo, 3 con 10 % y 6 con 20 %.	Muestra las condiciones y guarda el método y las cuotas; no modela una ruta de cancelación. La tabla de recargos se menciona, pero no se detallan sus valores.	La ausencia de cancelación en el .puml es una omisión, no una regla contraria. Los porcentajes del spec son un detalle no especificado en el diagrama.	Conservar el carrito y las condiciones previas si se cancela. Usar la tabla de cuotas solo si esos valores están efectivamente acordados por Arquitectura.	Confirmar la tabla con el Arquitecto y documentarla en el artefacto que corresponda. El Arquitecto debería reflejar la cancelación en el diagrama; el Desarrollador JavaScript, mantener el spec alineado con la decisión.
Confirmación del pedido	Indica validar nombre, correo y dirección, pero no define criterios concretos.	El nombre no puede estar vacío ni ser numérico; el correo debe tener “@” y dominio; la dirección no puede estar vacía.	Omisión del spec: no hay criterios para decidir si esos datos son válidos.	Documentar en el spec los criterios del diagrama para que sean verificables y consistentes.	El Desarrollador JavaScript debería ampliar el spec con las validaciones ya definidas por el diagrama. Si se pretende endurecerlas, coordinar primero con el Arquitecto.
Confirmación del pedido	Si se confirma, genera número, informa el resultado y limpia carrito y datos de pago. Si se cancela, conserva productos y vuelve al menú.	Si se confirma, genera número y vacía el carrito; no indica explícitamente borrar las condiciones de pago. Si se cancela, informa y vuelve al menú.	La conservación al cancelar está alineada. Limpiar el pago tras confirmar es un detalle que el diagrama no especifica, no una contradicción expresa.	Limpiar también las condiciones de pago al completar el pedido, para que no queden asociadas a una compra ya confirmada.	El Arquitecto debería explicitar el borrado de las condiciones en el diagrama; el spec puede mantenerse, pues ya define esa limpieza.
Confirmación del pedido	Indica que el usuario confirma o cancela, sin especificar el texto esperado.	Solicita una respuesta SI / NO.	Omisión del spec: no define el formato de respuesta.	Especificar que se espera SI / NO, incluyendo si se aceptan variantes o abreviaturas.	El Desarrollador JavaScript debería documentar el formato en el spec; el Arquitecto confirma si el diagrama debe precisar variantes.
Resumen de coordinación
Antes de modificar reglas, conviene coordinar con el Arquitecto: si el precio máximo es obligatorio; si al salir del carrito se muestra el resumen; cómo se representa la cancelación de pago; si los porcentajes de cuotas están acordados; y que al confirmar se limpien también las condiciones de pago.

Una vez resueltas esas decisiones, el spec debería precisar las validaciones de nombre, correo y dirección, y el formato de respuesta SI / NO. Los puntos sobre cancelación y borrado de datos pueden actualizarse para dejar explícito lo acordado. Las fuentes comparadas son spec-dev-javascript. md y los diagramas de búsqueda y filtrado, gestión del carrito, pago y cuotas y confirmación del pedido.
```

### Ajustes manuales realizados

Se incorporo la documentación JSDoc a las funciones del archivo js\script.js
Se hizo una ajuste al archivo docs\03-specs\actividad-obligatoria-3\spec-dev-javascript. md para reflejar los cuatro diagramas: validaciones, ciclos y resultados
Se corrigió la validación de cuotas para aceptar únicamente las opciones 1, 3 y 6, eliminando espacios y evitando formatos numéricos no previstos.
Se mejoró la validación de cantidades para evitar números que superen el límite de precisión segura de JavaScript.
Se agregó una validación para impedir que la suma de cantidades de un producto supere el límite de enteros seguros de JavaScript.
Se ajustó la validación del precio máximo para permitir omitir el filtro cuando está vacío y se actualizó el mensaje del prompt(), para alinearse con los cambios hechos en el diagrama de flujo de actividades.
Se ajustó la gestión del carrito para regresar a su menú al cancelar un prompt() sin modificar los productos e invalidar el método de pago y las cuotas únicamente cuando cambia el total, alineandose con los cambios  hechos en el diagrama de actividades.
Se ajustó la selección del método de pago para eliminar las condiciones anteriores al cancelar y se definieron en el diagrama las opciones de 1, 3 y 6 cuotas con recargos del 0 %, 10 % y 20 %.
Se ajustó la confirmación del pedido para vaciar el carrito y eliminar las condiciones de pago al finalizar la compra


### Pruebas y verificación
[Spec-primer commit](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/pull/125/changes/0ce45753512765ab4b2e380a8519db06d67130d6)
[Ajustes en los diagramas de actividades coordinados con el Arquitecto de diagramas de actividades](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/issues/126)
[Correcciones de los bugs detectados en las pruebas por el Tester](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/issues/127)


### Evidencia de integración
[Issue con los detalles del spec del rol Desarrollador Javascript](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/issues/112)
[Issue Desarrollador JavaScript - Implementación de la lógica de negocio para el cierre](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/issues/130)
[PR principal](https://github.com/angelgc9107-lgtm/ProyectoFerreteria_GRP05/pull/125)
