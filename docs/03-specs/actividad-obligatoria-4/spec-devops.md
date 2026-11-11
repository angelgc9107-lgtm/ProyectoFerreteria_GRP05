# Spec — Coordinador / DevOps (Actividad Obligatoria N°4)

Rama: `feature/coord-devops-cuarta-entrega` → `develop`

Este spec se commitea **antes** de cualquier otra tarea de coordinación de la entrega.

---

## ANTES — Planificación

### Plan de coordinación

Orden esperado de PRs y de integración:

| # | PR | Base | Cuándo | Notas |
|---|---|---|---|---|
| 1 | `fix/<nombre-del-fix>` (una por cada corrección de la Actividad N°3) | `release/tercera-entrega` | Primero | Merge directo (la release no está protegida); se registra en `changelog.md` bajo `[Fixed]` con el link a la PR; se avisa al docente en Slack con ✅ cuando quedan resueltos todos los comentarios |
| 2 | `backport/release-tercera-entrega` | `develop` | Cuando la release de la tercera entrega esté aprobada (LGTM) y mergeada a `master` | Se crea desde `master`; requiere la aprobación de otro integrante |
| 3 | `feature/coord-devops-cuarta-entrega` | `develop` | Desde el inicio | Este spec va primero; después README, changelog, GitHub Pages y releases |
| 4 | `feature/dev-poo-logica-negocio` | `develop` | Primero entre las de código | Las clases de `js/models/` son la base de los demás roles |
| 5 | `feature/dev-storage` | `develop` | Después de POO | `js/utils/storage.js` usa las clases del dominio |
| 6 | `feature/dev-eventos-dom` | `develop` | Después de POO y Storage | `js/script.js` pasa a ser solo controlador |
| 7 | `feature/tester-qa-specs` | `develop` | Al final, con el código ya integrado | Tests de modelos, storage y `script.js` |
| 8 | `release/cuarta-entrega` | `master` | Con todo integrado en `develop` | Título: `[GRUPO N°5][Cuarta Entrega] Entrega de la actividad`; plantilla de release |

Criterio de aprobación de una PR hacia `develop`:

- La revisa y la aprueba un integrante distinto del autor.
- El spec del rol está commiteado **antes** que el código (se verifica en el historial).
- Hay al menos un commit relevante del autor, una issue asociada y la entrada en `changelog.md` con el link a la PR.
- No quedan `prompt()` ni `alert()`, ni `console.log` innecesarios.
- Se respeta la separación: `script.js` solo eventos y DOM, `js/models/` solo lógica de negocio, `js/utils/storage.js` solo storage.
- Los tests pasan en `test-runner.html`.

### Herramientas

- **GitHub Copilot en modo Agente**, para hacer los code reviews de las PRs de los demás integrantes. Justificación: la consigna lo pide para este rol, y permite revisar el diff contra la arquitectura POO y los diagramas de clases con un criterio uniforme en todas las PRs.
- **GitHub** (Issues, Projects con tablero Kanban, Pages, Releases y tags) para administrar el trabajo.
- **Slack**: hilo de la entrega, para publicar la PR de la release y notificar ✅ y `:pr-merged:`.

### Criterios de aceptación

- [ ] Correcciones de la Actividad Obligatoria N°3 aplicadas con PRs `fix/` contra `release/tercera-entrega` y documentadas en `[Fixed]`
- [ ] Backport realizado (`backport/release-tercera-entrega` → `develop`) y documentado
- [ ] Al menos 4 code reviews con `CHANGES_REQUESTED` documentados
- [ ] Todas las ramas feature integradas en `develop` con revisión y aprobación
- [ ] `release/cuarta-entrega` creada desde `develop`
- [ ] GitHub Pages activo sobre `release/cuarta-entrega`
- [ ] `README.md` actualizado con la información de la cuarta entrega y los enlaces a la documentación
- [ ] `changelog.md` con las contribuciones de cada integrante, con link a su PR y su issue
- [ ] Issues administradas en GitHub Projects (Kanban)
- [ ] Ramas innecesarias eliminadas (solo quedan `master`, `develop` y `release/cuarta-entrega`)
- [ ] Release `v1.2-cuarta-entrega` publicada con el extracto del changelog
- [ ] PR de la release publicada en Slack y enlaces subidos al campus (PR y GitHub Pages)

---

## AL CERRAR — Evidencia del proceso

> Se completa al terminar la tarea, con lo que realmente se hizo.

### Prompts usados en Copilot Agent para cada code review

(Pendiente: un bloque de código por review, indicando qué archivos del diff se adjuntaron como contexto.)

### Resumen de cada review

(Pendiente: qué se validó, qué `CHANGES_REQUESTED` se cargaron y en qué líneas del diff.)

### Obstáculos encontrados y cómo se resolvieron

(Pendiente.)
