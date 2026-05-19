# Traceability: R2 - MVP+ local

> [← README.md](README.md)

## Term Matrix

| Term / Concept | R | S | M | V | T | W | Notes |
|---|---|---|---|---|---|---|---|
| Ranking local | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | `src/rankings/` — Top 10 Classic 3×3 |
| Iniciales | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 3 caracteres, pre-pobladas desde perfil |
| Perfil local | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | `src/profile/` — initials, gamesRecorded, bestScore, bestTimeSeconds |
| Estadísticas locales | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | `ProfilePage` — partidas grabadas, mejor puntaje, mejor tiempo |
| localStorage | N/A | N/A | ✅ | ✅ | ✅ | ✅ | Persistencia usada en R2; IndexedDB diferido como residual |
| Configuración visual | ✅ | ✅ | ✅ | ✅ | N/A | ✅ | `src/settings/` — reducedMotion, colorBlind |
| Modo daltónico | ✅ | ✅ | N/A | ✅ | N/A | ✅ | data-color-blind en `<html>`, celdas cian |
| Reducir animaciones | ✅ | N/A | N/A | ✅ | N/A | ✅ | override de `canUseMotion()` via dataset |
| Navegación de la app | N/A | ✅ | N/A | ✅ | ✅ | ✅ | `AppNav` — Juego / Ranking / Perfil / Config |

## Decisions Made

| ID | Decision | Rationale | Affects | Date |
|---|---|---|---|---|
| R2-D1 | Planificación escrita sin ejecución | El usuario solicitó no comenzar implementación | W | 2026-05-19 |
| R2-D2 | localStorage en vez de IndexedDB para R2 | IDB requiere async patterns que impactan la arquitectura entera; localStorage es suficiente para los volúmenes locales de R2 | M / V | 2026-05-19 |
| R2-D3 | Modo daltónico via atributo CSS en `<html>` | Permite aplicar el override globalmente sin prop drilling | S / V | 2026-05-19 |
| R2-D4 | Estadísticas de partidas sólo de partidas grabadas | Partidas iniciadas pero no grabadas no son trazables sin un evento de inicio explícito | M | 2026-05-19 |

## Residuals

| ID | Term / Issue | Blocker | Status | Target Resolution |
|---|---|---|---|---|
| R2-R1 | Ranking por modo/configuración | Requiere variantes | PENDING | R3 |
| R2-R2 | Migración de localStorage a IndexedDB | Requiere patrones async en toda la capa de datos | PENDING | R3+ |
