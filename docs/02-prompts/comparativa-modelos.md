# Comparativa de Modelos de IA

## Tarea comparada

Ambos casos involucran mantener consistencia con las convenciones ya establecidas del proyecto: generar o organizar contenido siguiendo un formato y una estructura previamente definidos por el equipo, en vez de partir de cero.

## Modelo A: GitHub Copilot Chat (modo Agente)

**Prompt usado:** Role prompting — se le pidió actuar como Desarrollador Frontend y generar `spec-frontend.md` tomando `spec-ia.md` como modelo de formato y estilo, trazando el contenido contra `plan.md`.

**Resultado:** Generó el archivo completo con la estructura correcta (Rol, Se traza contra, Qué se va a hacer, Por qué, Criterios de aceptación en Given/When/Then), citando RF1-RF8 y RNF1-RNF12 pertinentes, sin modificar `index.html` ni inventar evidencia de Figma MCP que todavía no existía.

**Fortalezas:** Siguió al pie de la letra las restricciones explícitas del prompt (qué no hacer todavía), y ejecutó una validación automática del archivo generado antes de dar por terminada la tarea.

**Debilidades:** Necesitó un prompt muy largo y detallado (con instrucciones punto por punto) para lograr ese nivel de consistencia — sin ese nivel de detalle, es menos previsible que replique el formato exacto del equipo.

## Modelo B: Claude (Anthropic)

**Prompt usado:** Zero-shot — pedidos cortos y directos ("decime la estructura de como deberían quedar las carpetas...", "revisá que esté todo ok" con un link de GitHub), sin necesidad de repetir instrucciones de formato en cada pedido.

**Resultado:** Mantuvo consistencia con las convenciones del proyecto (nombres de archivos, rutas, formato de specs) a lo largo de una conversación larga, sin que hiciera falta repetir el contexto completo en cada mensaje nuevo.

**Fortalezas:** Retuvo el contexto acumulado de toda la conversación (decisiones previas, nombre del proyecto, estructura ya acordada), permitiendo prompts mucho más cortos para lograr resultados igual de consistentes.

**Debilidades:** Al depender del contexto conversacional acumulado, un prompt aislado sin ese historial (como el que usó Copilot) necesitaría mucha más instrucción explícita para lograr el mismo nivel de detalle.

## Conclusión

GitHub Copilot Chat resultó más adecuado para una tarea puntual y aislada donde se necesita control fino y explícito sobre el resultado en un solo intercambio (ideal para generar un archivo específico con reglas estrictas). Claude resultó más útil en un flujo de trabajo conversacional y extendido, donde mantener contexto entre múltiples pedidos reduce la necesidad de repetir instrucciones. Para tareas de documentación aisladas y muy específicas, recomendaríamos Copilot con prompts detallados; para trabajo iterativo de varias etapas sobre el mismo proyecto, Claude aprovecha mejor el contexto acumulado.