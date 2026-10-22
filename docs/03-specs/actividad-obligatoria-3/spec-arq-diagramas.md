# Spec — Arquitecto de Diagramas de Actividades (Actividad Obligatoria N°3)

Rama: `feature/arq-diagramas-actividades` → `develop`

Este spec se commitea **antes** de abrir Copilot o escribir cualquier `.puml`.

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

- [ ] 4 diagramas con `start`, `stop`, actividades, decisiones `if-then-else`
      y ciclos (`while` o `repeat`).
- [ ] Swimlanes `|Usuario|` y `|Sistema|` en los flujos donde interviene el
      usuario.
- [ ] Flujo lógico coherente con la implementación planificada en `plan.md`
      y con `index.html`.
- [ ] Archivos `.puml` y `.png` exportados para cada diagrama.
- [ ] `diagramas-doc.md` con índice, descripción de cada flujo, enlace al
      `.puml`, imagen `.png` embebida e instrucciones de edición.
- [ ] Coordinación con el Desarrollador JavaScript para que los diagramas
      reflejen la implementación.

### Herramientas

- **GitHub Copilot en modo Agente**, con `plan.md`, `index.html` y el mockup
  como contexto, para generar el primer borrador de los `.puml`.
- **PlantUML** (extensión de VS Code o plantumleditor.com) para validar la
  sintaxis y exportar a `.png`.

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

*(Completar cuando terminen los diagramas.)*

### Prompt exacto usado en Copilot Agent

Archivos adjuntados como contexto: `plan.md`, `index.html`, mockup
(`docs/01-mockup/...`).

```
(pegar acá el prompt exacto)
```

### Fragmento del `.puml` generado por Copilot

```plantuml
(pegar acá el fragmento de al menos uno de los diagramas, tal como lo generó Copilot)
```

### Ajustes manuales realizados

- (errores de sintaxis PlantUML corregidos)
- (flujos incorrectos o incompletos)
- (swimlanes mal modeladas)

### Decisiones de diseño finales

- (por qué cada flujo quedó modelado como quedó)
- (acuerdos con el Desarrollador JavaScript)
