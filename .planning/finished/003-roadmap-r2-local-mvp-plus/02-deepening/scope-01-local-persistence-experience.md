# DEEPENING: Scope 01 - Local persistence and experience

> **Status:** DONE  
> [← 01-expansion.md](../01-expansion.md)

## Objective

Persistir progreso local y presentar ranking, perfil, estadísticas y configuración básica.

## Tasks

| # | Task | Workflow | Status | Output |
|---|---|---|---|---|
| 1 | Diseñar modelo local para perfiles, partidas y rankings | GENERATE-DOCUMENT | DONE | `src/profile/domain/profile.ts`, `src/settings/domain/settings.ts`, `src/rankings/domain/ranking.ts` + stores localStorage |
| 2 | Implementar ingreso de iniciales arcade | GENERATE-DOCUMENT | DONE | `ResultPanel` con `defaultInitials` desde perfil |
| 3 | Implementar ranking local Top 10 para Classic 3x3 | GENERATE-DOCUMENT | DONE | `src/rankings/ui/pages/RankingsPage.tsx` |
| 4 | Implementar perfil local mínimo y estadísticas básicas | GENERATE-DOCUMENT | DONE | `src/profile/` — initials, gamesRecorded, bestScore, bestTimeSeconds |
| 5 | Implementar configuración visual mínima | GENERATE-DOCUMENT | DONE | `src/settings/` — reducedMotion, colorBlind; toggles persistidos |
| 6 | Pulir look and feel en menú, partida, resultado y ranking | EXPAND-ELEMENT | DONE | `AppNav`, sidebar de jugador, páginas R2 responsive |
| 7 | Agregar tests de persistencia y componentes críticos | GENERATE-DOCUMENT | DONE | `profileService.test.ts` (7 tests) + `App.test.tsx` (7 tests, +4 nuevos) |
| 8 | Revisar coherencia y trazabilidad | REVIEW-COHERENCE / UPDATE-TRACEABILITY | DONE | `TRACEABILITY.md` actualizado |

## Done Criteria

- [x] El progreso local sobrevive a recarga/cierre.
- [x] El jugador puede registrar iniciales al entrar al ranking.
- [x] Existen estadísticas locales básicas.
- [x] La experiencia se ve bien en mobile y desktop.
- [x] `TRACEABILITY.md` actualizado con términos nuevos.

## Inconsistencies Found

| # | Description | Docs Involved | Status | Resolution Path |
|---|---|---|---|---|
| — | *None yet* | — | — | — |

## Residuals

| # | Description | Deferred To | Status |
|---|---|---|
| Rankings por múltiples modos | R3 | PENDING |

