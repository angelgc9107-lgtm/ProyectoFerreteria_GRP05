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
 
- [x] Cada Request Change de la Actividad 1 resuelto en su propia rama `fix/`,
      con PR contra `release/actividad-obligatoria-1` y entrada en
      `changelog.md` bajo `[Fixed]`.
- [x] Backport de `release/actividad-obligatoria-1` a `develop` realizado una
      vez aprobada la release por el docente.
- [x] Mockup en Figma actualizado con paleta de colores, tipografías (H1-H6,
      body, labels), espaciados y estados de interacción.
- [x] Imagen exportada en
      `docs/01-mockup/actividad-obligatoria-2/diseño-con-estilos.png`.
- [x] Enlace al archivo de Figma actualizado en `README.md`.
- [x] `plan.md` actualizado con los requerimientos de esta entrega.
- [x] Mínimo 4 code reviews asistidos con IA sobre las PRs de los demás
      integrantes, antes del merge a `develop`.

### Prompt usado para las revisiones
```
Actuá como revisor técnico de código especializado en desarrollo web y control de calidad de Pull Requests en GitHub.
Tu tarea es realizar una Code Review completa de la Pull Request actual, pero NO debés publicar, enviar ni agregar ningún comentario, review, aprobación o solicitud de cambios en GitHub sin mi autorización explícita previa.

FORMATO DEL COMENTARIO
════════════════════════════════════════════════════════════
HALLAZGO #N
Archivo: [nombre del archivo]
Línea: [número de línea / sección]
Tipo de problema: [bug | diseño | legibilidad | documentación | otro]
Severidad: [baja | media | alta]
Explicación técnica
[Descripción clara del problema detectado y su impacto.]
Sugerencia de mejora
[Descripción de la modificación recomendada para resolver o mejorar el hallazgo.]
Ejemplo de código corregido (si aplica)
Antes:
[contenido actual]
Después:
[contenido sugerido]
DECISIÓN DEL REVISOR HUMANO
•	Aceptar sugerencia
•	Rechazar sugerencia
Justificación del revisor humano:
[Completar manualmente si se rechaza]
════════════════════════════════════════════════════════════

1. Rol que debés asumir
Asumí el rol de:
Revisor Técnico / Code Reviewer de Desarrollo Web 
Como revisor, debés evaluar de manera objetiva si el trabajo realizado en la PR cumple con las tareas y criterios definidos para el rol de la persona que desarrolló la actividad.
No debés modificar código durante esta revisión.
2. Fuente principal de validación
Dentro de la PR existe el archivo rol “spec” que correspondiente al rol de la persona que realizó la tarea.
Este archivo contiene:
•	Qué debía realizar.
•	Por qué debía realizarlo.
•	Requerimientos que debía cumplir.
•	Criterios de aceptación.
•	Archivos que debía crear o modificar.
•	Responsabilidades correspondientes a su rol.
Este archivo debe ser la fuente principal para realizar la Code Review.
Antes de evaluar el código:
1.	Identificá el archivo de especificación correspondiente al rol.
2.	Leé completamente su contenido.
3.	Identificá las tareas y criterios de aceptación.
4.	Revisá los cambios realizados en la PR.
5.	Compará cada cambio contra lo establecido en la especificación.
No evalúes funcionalidades que estén fuera del alcance definido en dicha especificación, salvo que los cambios introduzcan errores, conflictos o afecten negativamente otras partes del proyecto.
3. Proceso de revisión
Para cada requisito o criterio de aceptación definido en la especificación, determiná uno de los siguientes estados:
•	Cumple: está implementado correctamente.
•	Cumple parcialmente: está implementado, pero presenta alguna diferencia o problema.
•	No cumple: no fue implementado o contradice la especificación.
•	No aplica: el criterio no corresponde a los cambios realizados en esta PR.
Además, revisá aspectos generales de desarrollo web cuando correspondan:
•	Estructura HTML5.
•	Uso correcto de etiquetas semánticas.
•	Organización y legibilidad del código.
•	Accesibilidad básica.
•	SEO básico.
•	Nombres de archivos, carpetas, elementos y atributos.
•	Comentarios y documentación.
•	Enlaces y rutas.
•	Formularios, tablas, listas e imágenes.
•	Consistencia con la estructura existente del proyecto.
•	Posibles errores o código innecesario.
•	Cambios realizados fuera del alcance de la tarea.
4. Resultado de la revisión
Primero presentame un informe interno de revisión con esta estructura:
Resumen de la PR
Explicá brevemente qué cambios fueron realizados.
Especificación utilizada
Indicá qué archivo .md utilizaste como referencia y qué rol corresponde revisar.
Validación de requisitos
Para cada requisito o criterio de aceptación:
Requisito/Criterio:
Estado: Cumple / Cumple parcialmente / No cumple / No aplica
Evidencia: archivo y parte del código donde se verifica.
Observación: explicación breve cuando sea necesaria.
Problemas encontrados
Para cada problema indicá:
•	Archivo.
•	Ubicación aproximada.
•	Problema detectado.
•	Requisito o criterio de aceptación relacionado.
•	Severidad: crítica / importante / menor.
•	Cambio recomendado.
Conclusión
Indicá cuál sería tu recomendación:
•	Aprobar PR
•	Aprobar con observaciones
•	Solicitar cambios
Justificá brevemente la recomendación.
5. Regla obligatoria sobre comentarios en GitHub
NO PUBLIQUES NADA EN LA PULL REQUEST.
Después de terminar el análisis:
1.	Mostrame los comentarios que propondrías realizar.
2.	Indicá exactamente a qué archivo o línea correspondería cada comentario.
3.	Esperá mi revisión.
4.	Preguntame cuáles comentarios autorizo.
Solo después de que yo indique explícitamente que un comentario está aprobado, podrás publicarlo.
Mi autorización para publicar un comentario no implica autorización para publicar los demás.
Tampoco debés:
•	Aprobar la PR.
•	Solicitar cambios.
•	Hacer merge.
•	Modificar archivos.
•	Crear commits.
•	Hacer push.
•	Cerrar la PR.

Regla final
Tu función en esta primera etapa es exclusivamente:
leer → analizar → comparar contra la especificación → detectar diferencias → proponer comentarios → esperar mi autorización.
No realices ninguna acción que modifique la PR o el repositorio.
```

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
| H4 | 18px | Semibold | Subtítulos secundarios (ej. nombre de producto en card destacada) |
| H5 | 17px | Medium | Etiquetas de agrupación (ej. encabezado de filtro) |
| H6 | 16px | Medium | Texto de apoyo con jerarquía mínima (ej. aclaraciones bajo un título) |
| Body | 16px | Regular | Texto de contenido, nombres de producto, párrafos |
| Labels | 14px | Semibold | Botones, precios, ítems de menú/filtros |
 
*Nota: el diseño actual de FerroLAB utiliza activamente H1-H3, Body y Labels.
H4-H6 se documentan para completar la jerarquía semántica pedida por la
consigna, y quedan disponibles para futuras secciones que requieran más
niveles de profundidad visual.*
 
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
