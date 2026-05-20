# DEEPENING: Scope 01 - Base variants

> **Status:** DONE  
> [← 01-expansion.md](../01-expansion.md)

## Objective

Implementar modos locales parametrizados y actualizar rankings/historial para distinguir configuraciones.

## Tasks

| # | Task | Workflow | Status | Output |
|---|---|---|---|---|
| 1 | Configurar react-i18next e infraestructura i18n con locale `es` inicial | GENERATE-DOCUMENT | DONE | `src/shared/i18n/` |
| 2 | Extender dominio para tableros 3x3 a 10x10 | EXPAND-ELEMENT | DONE | `board.ts` — `createBoardFromSeed(seed, size)` |
| 3 | Implementar Time Attack con cálculo de tiempo base | GENERATE-DOCUMENT | DONE | `gameConfig.ts` — `calculateTimeLimit` · `gameSession.ts` — lost por tiempo |
| 4 | Implementar Move Limit con cálculo de movimientos | GENERATE-DOCUMENT | DONE | `gameConfig.ts` — `calculateMoveLimit` · `gameSession.ts` — lost por movimientos |
| 5 | Crear selección de modo y configuración previa (usar claves i18n) | GENERATE-DOCUMENT | DONE | `GamePage.tsx` — panel de configuración inline |
| 6 | Extender puntaje e historial local por modo/configuración | EXPAND-ELEMENT | DONE | `score.ts` + `gameLocalStore.ts` — registro por modo |
| 7 | Ajustar ranking local por modo/configuración | EXPAND-ELEMENT | DONE | `RankingsPage.tsx` — tabs por modo + filtro de tamaño |
| 8 | Agregar tests de límites, tamaños y responsive 10x10 | GENERATE-DOCUMENT | DONE | `board.test.ts` · `gameSession.test.ts` · `gameLocalStore.test.ts` |
| 9 | Revisar coherencia y trazabilidad | REVIEW-COHERENCE / UPDATE-TRACEABILITY | PENDING | revisión y `TRACEABILITY.md` |

## Done Criteria

- [x] Classic, Dimensional, Time Attack y Move Limit son jugables localmente.
- [x] Rankings locales separan modo y configuración relevante.
- [x] La UI soporta 3x3 a 10x10 en mobile y desktop.
- [x] Infraestructura i18n configurada; todos los textos nuevos de UI usan claves de locale.
- [ ] `TRACEABILITY.md` actualizado con términos nuevos.

## Inconsistencies Found

| # | Description | Docs Involved | Status | Resolution Path |
|---|---|---|---|---|
| — | *None yet* | — | — | — |

## Residuals

| # | Description | Deferred To | Status |
|---|---|---|---|
| Progresión por niveles para desbloquear tamaños | R9 | PENDING |

