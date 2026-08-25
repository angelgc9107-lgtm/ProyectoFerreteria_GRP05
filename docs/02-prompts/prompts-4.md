# Prompt 4

**Integrante:** Thiago Piastrellini
**Rol:** Especialista en IA y Prompt Engineering
**Modelo de IA:** Claude (Anthropic)
**Método de prompt:** Zero-shot prompting

## Prompt exacto
```
decime la estructura de como deberian de quedar las carpetas con los archivos que deberia crear yo
``` 

**Captura de pantalla del prompt solicitado:**
![Prompt en Claude](./images/prompt-4-EspecialistaEnIAyPromptEngineering-1.png)

## Resultado esperado

Obtener el árbol completo de carpetas del repositorio, identificando claramente cuáles archivos correspondían al rol de Especialista en IA y Prompt Engineering (tanto de la PR inicial como de la PR final), para no confundirlos con los archivos de los otros roles del equipo.

## Resultado obtenido

La IA devolvió el árbol de carpetas completo del proyecto (`README.md`, `plan.md`, `index.html`, `docs/02-prompts/`, `docs/03-specs/`), marcando explícitamente con "← VOS" los 9 archivos que correspondían a este rol, separados en PR inicial (`spec-ia.md`, `spec-[rol].md`, `sdd-decisions.md`) y PR final (los 5 `prompts-x.md`, `prompts.md` y `comparativa-modelos.md`), y aclaró la nota especial sobre el archivo `spec-[rol].md` como template genérico a copiar por cada rol.

**Captura de pantalla del resultado obtenido:**
![Árbol de carpetas con los archivos marcados](./images/prompt-4-EspecialistaEnIAyPromptEngineering-2.png)
![Árbol de carpetas con los archivos marcados](./images/prompt-4-EspecialistaEnIAyPromptEngineering-3.png)
![Árbol de carpetas con los archivos marcados](./images/prompt-4-EspecialistaEnIAyPromptEngineering-4.png)

## Correcciones manuales realizadas

- Ninguna: la estructura propuesta se usó tal cual para crear los archivos en el repositorio.

## Aplicación en el proyecto

Estructura completa de `docs/02-prompts/` y `docs/03-specs/actividad-obligatoria-1/`.