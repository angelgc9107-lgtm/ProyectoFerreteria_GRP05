## Momento 1 — Testing pre-merge (ramas `feature/`)

**Prompt utilizado en Claude Code + Playwright MCP:**
```
Usá Playwright MCP para abrir http://127.0.0.1:3000/index.html y evaluar la Performance API
  del navegador. Dame estas métricas en milisegundos: DOMContentLoaded, Load completo, y
  DOM Interactive. También dame un listado de los recursos cargados (imágenes, CSS, fuentes)
  con su tamaño en KB y tiempo de descarga en ms, ordenados de mayor a menor tamaño.

  Sacá una captura de pantalla de la vista completa y guardala en
  docs/04-testing/capturas/tc-3/momento-1/performance-screenshot.png

  Al final decime si hay algún recurso que se destaque por ser pesado o lento, y si los tiempos
  de carga te parecen razonables para un sitio de este tipo.
  ``` 

**Resultados:**

| Métrica | Valor |
|---------|-------|
| DOM Interactive | 49 ms |
| DOMContentLoaded | 50 ms |
| Load completo | 158 ms |

**Recursos cargados (ordenados por tamaño, top 5):**

| Recurso | Tipo | Tamaño (KB) | Descarga (ms) |
|---------|------|-------------|----------------|
| assets/images/Bienvenido1.png | img | 394.9 | 99 |
| assets/images/Bienvenido2.png | img | 356.7 | 115 |
| assets/images/ubicacion.png | img | 49.7 | 129 |
| css/components.css | css | 14.9 | 26 |
| css/responsive.css | css | 5.9 | 30 |

**Capturas:** `capturas/tc-3/momento-1/performance-screenshot.png`

**Análisis:**
- Tiempos de carga excelentes en localhost (DOMContentLoaded 50ms, Load 158ms), pero no
  representativos de producción sin latencia de red real.
- Hallazgo de performance (no bloqueante): `Bienvenido1.png` (395 KB) y `Bienvenido2.png`
  (357 KB) representan juntas más de la mitad del peso total de imágenes del sitio (~752 KB
  de ~950 KB), pese a ser contenido decorativo/institucional, no productos. Se recomienda
  comprimir/convertir a WebP antes de desplegar a producción, ya que en redes móviles
  (3G/4G) su peso combinado sí tendría impacto notable en la carga percibida.
- No se encontraron fuentes web (usa fuentes del sistema).

**Issues generados:** Ninguno (hallazgo de optimización, no un defecto funcional o visual).
Se documenta como recomendación para antes del despliegue a producción.