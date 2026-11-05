# Spec — Arquitecto de Diagramas de Actividades (Actividad Obligatoria N°3)

Rama: `feature/arq-diagramas-actividades` → `develop`

Este spec se commitea **antes** de generar o escribir cualquier `.puml`.

---

## ANTES — Planificación

### Flujos principales identificados

Los 4 flujos salen de `plan.md` (RF4–RF24), de las secciones de `index.html`
(buscador, filtros del catálogo, carrito, "Iniciar compra", formulario) y del
mockup. Son los mismos 4 que implementará el Desarrollador JavaScript detrás
de un menú con `prompt()`.

| # | Flujo | Requisitos | Actores | Decisiones principales | Ciclos |
|---|---|---|---|---|---|
| 1 | Búsqueda y filtrado del catálogo | RF4, RF5 | Usuario, Sistema | ¿texto vacío? ¿hay coincidencias? ¿categoría válida? ¿precio dentro del máximo? | Recorrer los productos del catálogo; repetir hasta que el usuario termine de filtrar |
| 2 | Gestión del carrito | RF9–RF13, RF20 | Usuario, Sistema | ¿producto existe? ¿cantidad válida (≥ 1)? ¿ya está en el carrito? ¿carrito vacío? | Menú de acciones (agregar / cambiar cantidad / eliminar / ver) hasta salir; recorrer ítems para sumar subtotales |
| 3 | Pago y cálculo de cuotas | RF14–RF19 | Usuario, Sistema | ¿método permite financiación? ¿cantidad de cuotas válida? ¿qué interés corresponde a esas cuotas? | Repetir la pregunta hasta obtener una cantidad de cuotas válida |
| 4 | Resumen y confirmación del pedido | RF21–RF24 | Usuario, Sistema | ¿datos del cliente válidos? ¿carrito con productos? ¿el usuario confirma? | Repetir la carga de cada dato hasta que sea válido |

Los flujos 2, 3 y 4 son consecutivos (carrito → pago → confirmación), por lo
que el resultado de uno es la entrada del siguiente. El flujo 1 es
independiente y alimenta al 2 (el producto elegido se agrega al carrito).

### Decisión sobre swimlanes

Se usan swimlanes `|Usuario|` y `|Sistema|` en **los cuatro diagramas**.

Motivo: la entrega no usa DOM ni eventos, así que toda la interacción es un
ida y vuelta de `prompt()` (el usuario responde) y `alert()` / `console.log()`
(el sistema muestra resultados). Ese intercambio es exactamente la
separación de responsabilidades que los swimlanes hacen visible, y además
refleja la separación que se pide en el código entre lógica de negocio y
UI. Dentro de cada diagrama:

- `|Usuario|`: ingresa datos con `prompt()` y toma decisiones (elegir opción,
  confirmar, cancelar).
- `|Sistema|`: valida, calcula, recorre colecciones y muestra resultados.

### Criterios de aceptación

- [x] 4 diagramas con `start`, `stop`, actividades, decisiones `if-then-else`
      y ciclos (`while` o `repeat`).
- [x] Swimlanes `|Usuario|` y `|Sistema|` en los flujos donde interviene el
      usuario.
- [x] Flujo lógico coherente con la implementación planificada en `plan.md`
      y con `index.html`.
- [x] Archivos `.puml` y `.png` exportados para cada diagrama (cada `.png`
      se regeneró desde su `.puml` y se comprobó que coincide).
- [x] `diagramas-doc.md` con índice, descripción de cada flujo, enlace al
      `.puml`, imagen `.png` embebida e instrucciones de edición (se
      comprobó que los enlaces relativos apuntan a archivos existentes).
- [x] Coordinación con el Desarrollador JavaScript para que los diagramas
      reflejen la implementación (reglas de cancelación y efectos entre
      flujos acordadas en la issue; ver "Reglas acordadas" en AL CERRAR).

### Herramientas

- **Claude (Anthropic) en modo agente**, con acceso a archivos y a una consola
  de comandos del entorno de trabajo, con `plan.md`, `index.html` y la
  consigna como contexto, para generar el borrador de los `.puml`. Se
  documenta en AL CERRAR (sección "Uso de IA en modo agente"). Originalmente
  se había previsto GitHub Copilot en modo Agente; no se usó.
- **PlantUML** (`plantuml.jar`, ejecutado por el propio agente) para validar
  la sintaxis y exportar a `.png`; también se puede usar la extensión de
  VS Code o plantumleditor.com.

### Archivos a entregar

```
docs/03-specs/actividad-obligatoria-3/spec-arq-diagramas.md
docs/05-diagramas/01-diagrama-de-actividades/diagramas-doc.md
docs/05-diagramas/01-diagrama-de-actividades/actividad-flujo-1-busqueda-filtrado.puml / .png
docs/05-diagramas/01-diagrama-de-actividades/actividad-flujo-2-carrito.puml / .png
docs/05-diagramas/01-diagrama-de-actividades/actividad-flujo-3-pago-cuotas.puml / .png
docs/05-diagramas/01-diagrama-de-actividades/actividad-flujo-4-confirmacion-pedido.puml / .png
```

---

## AL CERRAR — Evidencia del proceso

### Herramienta y contexto

Los borradores de los 4 `.puml` se generaron con **Claude (Anthropic) en modo
agente**, no con GitHub Copilot. La consigna no exige una marca de
herramienta; lo que se documenta es el uso real de la IA en modo agente. Se
le proporcionó como contexto:

- El repositorio del proyecto (`ProyectoFerreteria_GRP05`, rama
  `origin/develop`), del que leyó `plan.md` e `index.html`.
- La consigna de la Actividad Obligatoria N°3 (PDF).

No se adjuntó la imagen del mockup en esa generación; la estructura de
pantallas se tomó de `index.html`.

### Uso de IA en modo agente

Qué hizo el agente por su cuenta (con herramientas), y no solo respondiendo
texto:

1. **Leyó los archivos del repositorio** descomprimido en su entorno
   (`plan.md`, `index.html`, specs de los otros roles) para identificar los
   4 flujos y sus requisitos.
2. **Escribió los archivos** `spec-arq-diagramas.md`, los 4 `.puml` y
   `diagramas-doc.md` directamente en la estructura de carpetas del proyecto.
3. **Ejecutó PlantUML** (`plantuml.jar` 1.2024.7) desde la consola para
   validar la sintaxis y exportar los `.png`. Al detectar que el `.png` del
   flujo 2 salía cortado (límite de 4096 px), lo re-exportó con
   `-DPLANTUML_LIMIT_SIZE=16384`.
4. **Verificó el resultado:** miró cada `.png` exportado, comprobó que
   coincidiera con su `.puml` y que los enlaces de `diagramas-doc.md`
   apuntaran a archivos existentes.
5. **Aplicó las correcciones de las revisiones** (ver "Ajustes manuales y
   correcciones"), re-exportando y re-verificando cada vez.

Las decisiones de contenido (rol elegido, aceptar los 4 flujos propuestos,
reglas de cancelación acordadas con el Desarrollador JavaScript, qué
corrección de revisión aplicar) las tomó el estudiante; la revisión humana
quedó en la PR #122.

Los diagramas se renderizaron con PlantUML (`plantuml.jar` 1.2024.7).

### Prompt utilizado

Mensaje enviado al asistente, junto con el zip del repositorio y el PDF de
la consigna:

```
ya elegi el rol de Arquitecto de Diagramas de Actividades aca tenemos el actual estado del proyecto
```

Mensajes posteriores relevantes al agente (resumidos): pedir pasar a
PlantUML el diagrama del flujo 2 editado a mano (adjuntando la imagen);
enviar los hallazgos del code review para aplicarlos; y enviar las
correcciones de la revisión del profesor.

A partir de eso el asistente propuso los 4 flujos (ver sección ANTES), que
se aceptaron, y generó el spec y los `.puml`. Más tarde se pidió pasar a
PlantUML un diagrama editado a mano (flujo 2) y se aplicaron las
correcciones del code review.

### Fragmento generado (primera versión del flujo 2)

```plantuml
    if (¿El producto existe en el catálogo?) then (no)
      :Muestra error con alert();
    elseif (¿La cantidad es un entero ≥ 1?) then (no)
      :Muestra error con alert();
    elseif (¿El producto ya está en el carrito?) then (sí)
      :Suma la cantidad al ítem existente;
    else (no)
      :Agrega el ítem nuevo al carrito;
    endif
```

### Ajustes manuales y correcciones

- **Flujo 2, menú:** se cambió la opción 4 de "ver" a "comprar" y se agregó
  "(si es que hay productos)" a la opción 2, editando el diagrama a mano.
- **Flujo 2, estructura:** la primera versión resolvía el menú con una
  cadena de `elseif`, que quedaba ancha y difícil de leer; se reescribió con
  `switch`.
- **Flujo 2, validaciones (code review):** la cadena de `elseif` mezclaba
  condiciones formuladas en positivo con ramas `no` de error, lo que hacía
  ambiguo el recorrido. Se reemplazó por decisiones anidadas con una
  condición clara por nivel: primero existencia del producto, después
  cantidad válida y finalmente si ya está en el carrito. Se aplicó el mismo
  criterio al caso "cambiar cantidad".
- **Reglas acordadas con el Desarrollador JavaScript** (issue de
  coordinación): se agregaron a los 4 diagramas las ramas de cancelación de
  `prompt()` y los efectos entre flujos (ver tabla más abajo).
- **Flujo 2, opción "Comprar" (code review):** la opción preparaba la
  visualización del carrito y el flujo volvía al menú, sin mostrar la
  transición al pago. Ahora, si el carrito tiene ítems, marca la salida
  hacia el pago, termina el ciclo del menú y continúa en el flujo 3; con el
  carrito vacío informa que no se puede comprar y permanece en el menú. El
  flujo 3 se ajustó para indicar que puede iniciarse desde el menú
  principal o desde "Comprar".
- **Revisión del profesor (RC1, RC2, RC3):** los flujos 1, 3 y 4 tenían
  varios `stop` (cancelaciones y carrito vacío) además del cierre principal.
  Ahora cada diagrama tiene un único `stop` y las salidas alternativas
  terminan en `end`. Se re-exportaron los `.png` y se actualizó la
  sintaxis en `diagramas-doc.md`.
- **Revisión del profesor (RC4):** el diagrama del flujo 2 define la opción
  `4 - Comprar` con transición al flujo de pago; el menú de `js/script.js`
  todavía mostraba `4. Ver`. El diagrama no cambia: se alinea `script.js` al
  diagrama (corrección a cargo del Desarrollador JavaScript).
- **Revisión del profesor (RC5):** se reescribió la documentación de
  herramienta para registrar con precisión el uso de IA en modo agente
  (sección "Uso de IA en modo agente").
- **Exportación:** el `.png` del flujo 2 superaba el límite por defecto de
  PlantUML (4096 px de ancho) y salía cortado; se re-exportó ampliando el
  límite con `-DPLANTUML_LIMIT_SIZE`.
- **Verificación:** se regeneraron los 4 `.png` desde sus `.puml` y se
  comprobó que coinciden con los archivos exportados.

### Reglas acordadas con el Desarrollador JavaScript

| Flujo | Punto | Regla acordada |
|---|---|---|
| 1 Búsqueda | Filtros vacíos | Texto, categoría o precio vacíos = no se filtra por ese campo |
| 1 Búsqueda | Cancelar un `prompt()` | Vuelve al menú principal sin cambios |
| 2 Carrito | Modificar productos con pago elegido | Si cambia el total, se descartan el método de pago y las cuotas y hay que volver a elegir |
| 2 Carrito | Opción "Comprar" | Con ítems en el carrito, sale del menú y continúa en el flujo de pago; con el carrito vacío informa y permanece en el menú |
| 2 Carrito | Cancelar un `prompt()` | No se modifica el carrito; cancelar el menú equivale a salir |
| 3 Pago | Cancelar la selección | No se guarda método ni cuotas y vuelve al menú principal |
| 3 Pago | Cuotas y recargos | Se consultan en una tabla según la cantidad de cuotas; los valores concretos se definen en `js/script.js` y `spec-dev-javascript.md` |
| 4 Pedido | Al confirmar | Se vacían el carrito y el método de pago |
| 4 Pedido | Cancelar la carga de datos o responder NO | Pedido cancelado; se conservan el carrito y el pago |

### Decisiones de diseño finales

- Swimlanes `|Usuario|` / `|Sistema|` en los cuatro diagramas, porque toda
  la interacción es `prompt()` contra `alert()` / `console.log()` y eso
  deja visible la separación entre interacción y lógica de negocio que se
  pide para facilitar el testing.
- Cada dato que se ingresa con `prompt()` se modela con un ciclo
  `repeat ... repeat while` que vuelve a pedirlo hasta que sea válido.
- Los flujos 2, 3 y 4 son consecutivos (carrito, pago, confirmación); el
  flujo 1 es independiente y alimenta al 2.
- En el flujo 3 se modelan dos métodos de pago: efectivo/transferencia (sin
  cuotas) y tarjeta de crédito (con cuotas). El porcentaje de recargo se
  representa como una consulta a una tabla según la cantidad de cuotas;
  los valores concretos los define la implementación en `js/script.js`.
- El flujo 4 solicita nombre, correo y dirección de envío del comprador.
