# Comparativa de Modelos de IA

## Tarea comparada

Ambos casos involucran mantener consistencia con las convenciones ya establecidas del proyecto: generar o organizar contenido siguiendo un formato y una estructura previamente definidos por el equipo, en vez de partir de cero.

## Modelo A: GitHub Copilot Chat (modo Agente)

**Prompt usado:** Role prompting — se le pidió actuar como Desarrollador Frontend y generar `spec-frontend.md` tomando `spec-ia.md` como modelo de formato y estilo, trazando el contenido contra `plan.md`.

**Resultado:** Generó el archivo completo con la estructura correcta (Rol, Se traza contra, Qué se va a hacer, Por qué, Criterios de aceptación en Given/When/Then), citando RF1-RF8 y RNF1-RNF12 pertinentes, sin modificar `index.html` ni inventar evidencia de Figma MCP que todavía no existía.

**Fortalezas:** Siguió al pie de la letra las restricciones explícitas del prompt (qué no hacer todavía), y ejecutó una validación automática del archivo generado antes de dar por terminada la tarea.

**Debilidades:** Necesitó un prompt muy largo y detallado (con instrucciones punto por punto) para lograr ese nivel de consistencia — sin ese nivel de detalle, es menos previsible que replique el formato exacto del equipo.

## Modelo B: Claude (Anthropic)

**Prompt usado:** Self-consistency — se le pidió generar 3 versiones distintas de la estructura de carpetas del Especialista en IA, analizarlas y elegir la mejor justificando la decisión, identificando además qué archivos correspondían a la PR inicial y a la PR final.

**Resultado:** Generó tres estructuras alternativas (mínima, con carpeta de imágenes y separada por etapas), comparó las tres y seleccionó la Versión B (con carpeta `images/`) como la más alineada con la sección 4.1 de la consigna, explicando claramente por qué las otras dos eran inferiores.

**Fortalezas:** Demostró capacidad de generar múltiples alternativas, evaluarlas críticamente y justificar la elección final de forma clara y alineada con los requisitos del PDF. Mantuvo las rutas exactas que exige la actividad.

**Debilidades:** Al generar varias versiones, el resultado es más largo y requiere que el usuario revise y confirme la elección. En tareas muy simples puede resultar excesivo.

## Conclusión

GitHub Copilot Chat resultó más adecuado para una tarea puntual y aislada donde se necesita control fino y explícito sobre el resultado en un solo intercambio (ideal para generar un archivo específico con reglas estrictas). Claude, usando Self-consistency, resultó más útil cuando se necesita explorar alternativas y tomar una decisión fundamentada. Para tareas de documentación aisladas y muy específicas, recomendaríamos Copilot con Role prompting detallado; para decisiones de estructura o diseño donde conviene comparar opciones, Claude con Self-consistency aporta mayor solidez en la justificación.