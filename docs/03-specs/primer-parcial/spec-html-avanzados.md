# Spec — Desarrollador de Componentes HTML Avanzados (Primer Parcial)

## Qué se va a hacer

Implementar dos componentes HTML avanzados en la página de FerroLAB:

1. **Iframe de Google Maps**, embebido en el bloque "Ubicación" del footer
   (actualmente un placeholder con imagen estática), apuntando a la
   ubicación real de referencia (Ferretería JYJ) mediante su identificador
   único de lugar (CID).
2. **Input range**, como filtro de precio máximo en el sidebar del
   catálogo, reemplazando los casilleros vacíos de precio mínimo/máximo.

## Por qué

- El footer ya reserva un espacio rotulado "Ubicación" con una imagen
  estática placeholder, señalado como pendiente en revisiones anteriores
  del mockup. Un iframe real de Google Maps cierra ese pendiente con un
  componente HTML avanzado legítimo para la consigna.
- El sidebar del catálogo ya tiene un bloque "Precio" con inputs sin
  completar. Reemplazarlos por un slider de rango es una mejora de UX
  directa: el usuario arrastra para fijar un tope de precio, en vez de
  tipear números a mano, sobre un elemento que ya existía en el diseño.
- Ambos componentes se integran sobre elementos ya construidos,
  minimizando el impacto sobre el layout ya migrado a Bootstrap.

## Criterios de aceptación

- [x] Iframe de Google Maps embebido en el footer, usando el helper
      `ratio` de Bootstrap (`ratio ratio-16x9`) para que se adapte
      correctamente al grid responsive.
- [x] El mapa apunta a la ubicación específica de referencia mediante su
      CID (no a una búsqueda genérica por nombre), y el link "Ver mapa más
      grande" dentro del iframe abre la ficha correcta del lugar.
- [x] Input range funcional en el sidebar del catálogo, con rango de
      `$0` a `$80.000`, valor inicial en `$80.000` (sin filtrar), y el
      valor seleccionado visible en vivo mediante un elemento `<output>`.
- [ ] Ambos componentes conservan la identidad visual del sitio (colores,
      tipografías, bordes redondeados) y no generan overflow horizontal en
      ningún breakpoint.
- [ ] Tests ejecutados con Playwright MCP sobre iPhone 14 Pro, Samsung
      Galaxy S23 y iPad Air, documentados en `test-case-9.md` (mapa) y
      `test-case-10.md` (input range).
- [ ] Issues creados con GitHub MCP por cada hallazgo, resueltos mediante
      ramas `fix/` contra `develop`, documentados en `changelog.md` bajo
      `[Fixed]`.

## Plan de testing (Playwright MCP)

| Test case | Componente | Qué se valida |
|---|---|---|
| `test-case-9.md` | Iframe Google Maps | Carga correcta del iframe, proporción responsive (ratio Bootstrap), que el link "Ver mapa más grande" abra la ubicación correcta, ausencia de overflow en los 3 dispositivos. |
| `test-case-10.md` | Input range (filtro de precio) | El slider se arrastra correctamente en pantallas táctiles, el valor en `<output>` se actualiza en vivo, el componente conserva su estilo visual en los 3 dispositivos. |

## Archivos a modificar

- `index.html`: reemplazar la imagen placeholder del footer por el iframe
  de Google Maps, y reemplazar los inputs de precio vacíos del sidebar del
  catálogo por el input range con su `<output>` asociado.
- `css/components.css` y/o `css/bootstrap-overrides.css`: ajustes de estilo
  puntuales si el slider o el iframe requieren overrides visuales.
- `docs/04-testing/test-case-9.md`, `test-case-10.md`: documentación de
  pruebas.

## PR asociada

`feature/dev-comp-html-avanzados-add-components` → `develop`. Este spec
debe estar commiteado antes de cualquier implementación de código.

---

## Al cierre — evidencia del proceso

### Google Maps — decisión técnica

Se descartó el iframe oficial de "Insertar mapa" de Google (que requiere
API key) y el truco de `q=nombre+coordenadas` (que no garantiza que el
link "Ver mapa más grande" resuelva a la ubicación correcta, mostrando a
veces una búsqueda genérica). Se optó por construir la URL embebible usando
el CID (identificador único del lugar en Google Maps), extraído del link
de "compartir ubicación" y convertido de hexadecimal a decimal, con el
formato:

```
https://www.google.com/maps?cid=<CID_DECIMAL>&output=embed
```

Esto asegura que tanto el mapa embebido como el link "Ver mapa más grande"
apunten exactamente al mismo lugar de referencia.

### Input range — ajustes manuales realizados

- Se definió un único slider de precio máximo (en vez de un rango doble
  mínimo-máximo) para simplificar la implementación sin JavaScript
  funcional completo, acorde a que esta entrega no lo exige como
  obligatorio.
- Se agregó un `oninput` inline mínimo para actualizar el valor mostrado
  en el `<output>` en tiempo real, sin implicar lógica de filtrado real
  de productos (eso queda marcado como JavaScript futuro, según el
  comentario ya presente en el HTML).
- Los límites del slider (`$0` a `$80.000`) se definieron en base al rango
  real de precios visible en el catálogo actual.

