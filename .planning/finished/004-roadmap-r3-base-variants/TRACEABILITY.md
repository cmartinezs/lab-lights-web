# Traceability: R3 - Variantes base

> [← README.md](README.md)

## Term Matrix

| Term / Concept | R | S | V | T | W | Notes |
|---|---|---|---|---|---|---|
| `GameMode` | ✅ | ✅ | ✅ | ✅ | ✅ | `'classic' \| 'dimensional' \| 'time-attack' \| 'move-limit'` en `gameConfig.ts` |
| `GameConfig` | ✅ | ✅ | ✅ | ✅ | ✅ | `{ mode, size, timeLimit?, moveLimit? }` — eje de configuración |
| `GameSession` | ✅ | ✅ | ✅ | ✅ | ✅ | Reemplaza `ClassicGameSession`; incluye `status: 'playing' \| 'won' \| 'lost'` |
| `GameStatus` | ✅ | ✅ | ✅ | ✅ | ✅ | Estado `'lost'` nuevo para Time Attack y Move Limit |
| Dimensional | ✅ | ✅ | ✅ | ✅ | ✅ | Mismas reglas, tamaño configurable 3×3–10×10 |
| Time Attack | ✅ | ✅ | ✅ | ✅ | ✅ | `timeLimit = rows × columns × 3 s`; lost cuando el timer llega a 0 |
| Move Limit | ✅ | ✅ | ✅ | ✅ | ✅ | `moveLimit = ceil(rows × columns × 1.5)`; lost al agotar movimientos |
| `calculateTimeLimit` | ✅ | ✅ | ✅ | ✅ | ✅ | `gameConfig.ts` |
| `calculateMoveLimit` | ✅ | ✅ | ✅ | ✅ | ✅ | `gameConfig.ts` |
| `GameResultRecord` | ✅ | ✅ | ✅ | ✅ | ✅ | Reemplaza `ClassicResultRecord`; incluye `mode`, `rows`, `columns` |
| Ranking por modo | ✅ | ✅ | ✅ | ✅ | ✅ | `RankingsPage` con tabs por modo + filtro de tamaño |
| i18n (`react-i18next`) | ✅ | ✅ | ✅ | ✅ | ✅ | `src/shared/i18n/` — locale `es` inicial |

## Decisions Made

| ID | Decision | Rationale | Affects | Date |
|---|---|---|---|---|
| R3-D1 | Planificación escrita sin ejecución | El usuario solicitó no comenzar implementación | W | 2026-05-19 |
| R3-D2 | Classic siempre 3×3; Dimensional para tamaños variados | Preserva identidad del modo original | S, V | 2026-05-20 |
| R3-D3 | Resultados almacenados por modo (no por modo+tamaño) | Permite ranking cruzado de tamaños dentro del mismo modo | V, S | 2026-05-20 |
| R3-D4 | `GamePage` con panel de config inline en lugar de pantalla separada | Minimiza navegación; mantiene contexto de la partida | S | 2026-05-20 |
| R3-D5 | Tableros cuadrados en la UI (N×N); dominio acepta no-cuadrados | Simplifica UX sin limitar el dominio | S | 2026-05-20 |

## Residuals

| ID | Term / Issue | Blocker | Status | Target Resolution |
|---|---|---|---|---|
| R3-R1 | Desbloqueo por niveles | Requiere progresión completa | PENDING | R9 |

