# Spec — Coordinador / DevOps (Actividad Obligatoria N°2)
 
## Qué se va a hacer
 
1. Resolver los Request Changes marcados por el docente sobre la Actividad
   Obligatoria N°1, mediante ramas `fix/` contra `release/actividad-obligatoria-1`.
2. Actualizar el mockup de Figma incorporando la paleta de colores definitiva,
   tipografías por jerarquía, espaciados/tamaños de componentes y estados de
   interacción (hover, focus, disabled).
3. Coordinar la integración de las ramas `feature/` de los demás roles en
   `develop`, con un mínimo de 4 code reviews asistidos con IA.
## Por qué
 
Los Request Changes deben resolverse antes de que el profesor apruebe
formalmente la Actividad 1 y se pueda hacer backport a `develop`, que es la
base sobre la que arranca esta segunda entrega. El mockup actualizado es el
insumo que necesitan el Desarrollador Frontend/CSS y el Especialista en
Responsive Design para generar los archivos de estilos con fidelidad visual
al diseño acordado por el equipo.
 
## Criterios de aceptación
 
- [ ] Cada Request Change de la Actividad 1 resuelto en su propia rama `fix/`,
      con PR contra `release/actividad-obligatoria-1` y entrada en
      `changelog.md` bajo `[Fixed]`.
- [ ] Backport de `release/actividad-obligatoria-1` a `develop` realizado una
      vez aprobada la release por el docente.
- [ ] Mockup en Figma actualizado con paleta de colores, tipografías (H1-H3,
      body, labels), espaciados y estados de interacción.
- [ ] Imagen exportada en
      `docs/01-mockup/actividad-obligatoria-2/diseño-con-estilos.png`.
- [ ] Enlace al archivo de Figma actualizado en `README.md`.
- [ ] `plan.md` actualizado con los requerimientos de esta entrega.
- [ ] Mínimo 4 code reviews asistidos con IA sobre las PRs de los demás
      integrantes, antes del merge a `develop`.
## Proceso — actualización del mockup
 
Este trabajo se realizó de forma completamente manual en Figma, sin
asistencia de modelos de lenguaje, ya que la consigna no exige uso
obligatorio de IA para esta tarea puntual (a diferencia de los code reviews,
donde sí es requisito).
 
### Paleta de colores aplicada
 
| Uso | Color | Hex |
|---|---|---|
| Primario | Rojo FerroLAB | `#C0392B` |
| Primario hover | Rojo oscuro | `#922B21` |
| Secundario | Negro | `#1C1C1C` |
| Fondo | Blanco | `#FFFFFF` |
| Neutro claro | Gris claro | `#F2F2F2` |
| Neutro medio | Gris medio | `#D0D0D0` |

 
Aplicada mediante estilos locales de color en Figma, reutilizables en todos
los frames del proyecto.
 
### Tipografías aplicadas
 
| Nivel | Tamaño | Peso | Uso |
|---|---|---|---|
| H1 | 32px | Bold | Títulos principales de página |
| H2 | 24px | Bold | Títulos de sección (ej. "OFERTAS", bienvenida) |
| H3 | 20px | Semibold | Subtítulos (ej. columnas del footer) |
| Body | 16px | Regular | Texto de contenido, nombres de producto, párrafos |
| Labels | 14px | Semibold | Botones, precios, ítems de menú/filtros |
 
Aplicadas mediante estilos locales de texto en Figma, reutilizables en todos
los frames.
 
### Espaciados y componentes
 
- Padding estándar en cards y botones: `16px`.
- Márgenes entre secciones: `32px`.
- Border-radius en cards y botones: `8px`.
### Estados de interacción documentados
 
- **Botón "COMPRAR" (fondo blanco):** Normal (rojo `#C0392B`), Hover (rojo
  oscuro `#922B21`), Disabled (opacidad 50%).
- **Botón "INICIAR COMPRA" (dentro del carrito, fondo rojo):** se definió en
  blanco con borde, en lugar del rojo estándar, ya que sobre el fondo rojo
  del panel del carrito un botón rojo perdía contraste y legibilidad.
- **Input de búsqueda:** Normal (fondo blanco, borde gris), Focus (borde de
  2px en color primario rojo).
### Ajustes manuales realizados
 
- Se corrigió el color del input de búsqueda en el frame de estados, que
  inicialmente se había armado con fondo oscuro, para que coincida con el
  input real del header (fondo blanco).
- Se decidió no unificar el color del botón "INICIAR COMPRA" con el resto de
  los botones "COMPRAR" del sitio, dado el problema de contraste sobre el
  fondo rojo del carrito.
