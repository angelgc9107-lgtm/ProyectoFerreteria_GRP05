# Prompt 5

**Integrante:** Thiago Piastrellini  
**Rol:** Especialista en IA y Prompt Engineering  
**Modelo de IA:** Gemini (Google)  
**Método de prompt:** Few-shot prompting  

## Prompt exacto
```
Explicame las diferencias entre zero-shot, few-shot, chain-of-thought y role prompting.
Te doy dos ejemplos de cómo quiero que estructures la respuesta:
Ejemplo 1:
Técnica: Zero-shot
Definición: ...
Cuándo usarla: ...
Ejemplo: ...
Ejemplo 2:
Técnica: Few-shot
Definición: ...
Cuándo usarla: ...
Ejemplo: ...
Ahora, usando exactamente el mismo formato, explicá las cuatro técnicas (zero-shot, few-shot, chain-of-thought y role prompting) e incluí al final una tabla comparativa.
```

**Captura de pantalla del prompt solicitado:**  
![Prompt en Gemini](./images/prompt-5-EspecialistaEnIAyPromptEngineering-1.png)

## Resultado esperado

Obtener una explicación clara y estructurada de las cuatro técnicas de prompting (Zero-shot, Few-shot, Chain-of-thought y Role prompting), con definición, cuándo usarla y un ejemplo concreto de cada una, más una tabla comparativa final, para poder clasificar correctamente el método usado en cada uno de los 5 prompts del equipo.

## Resultado obtenido

Gemini generó la explicación de las cuatro técnicas siguiendo el formato solicitado:

- **Zero-shot**: definición, cuándo usarla y ejemplo de clasificación de sentimiento.
- **Few-shot**: definición, cuándo usarla y ejemplos de pares entrada-salida.
- **Chain-of-thought (CoT)**: definición, cuándo usarla y ejemplo de problema matemático paso a paso.
- **Role prompting**: definición, cuándo usarla y ejemplo de “Actúa como un Senior Software Engineer…”.

Al final incluyó una tabla comparativa con las columnas: Técnica, Complejidad del Prompt, Enfoque Principal y Mayor Fortaleza.

**Captura de pantalla del resultado obtenido:**  
![Explicación completa con tabla comparativa](./images/prompt-5-EspecialistaEnIAyPromptEngineering-2.png)  
![Explicación completa con tabla comparativa](./images/prompt-5-EspecialistaEnIAyPromptEngineering-3.png)

## Correcciones manuales realizadas

- Ninguna. El resultado se usó directamente como criterio para clasificar el método de prompting de los 5 archivos `prompts-x.md` del equipo.

## Aplicación en el proyecto

Criterio de clasificación aplicado en `docs/02-prompts/prompts-1.md` a `prompts-5.md`, para determinar qué método de prompting corresponde a cada prompt documentado.