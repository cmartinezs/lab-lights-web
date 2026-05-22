# DEEPENING: Scope 01 - Daily and live ops

> **Status:** DONE  
> [← 01-expansion.md](../01-expansion.md)

## Objective

Implementar Daily Challenge online reproducible, rankings recurrentes y live ops ligeros.

## Tasks

| # | Task | Workflow | Status | Output |
|---|---|---|---|---|
| 1 | Definir seed diaria y estado competitivo por usuario/fecha | GENERATE-DOCUMENT | DONE | daily.ts (getDailySeed/getTodayKey), dailyStore.ts |
| 2 | Implementar ranking diario y vista semanal | GENERATE-DOCUMENT | DEFERRED | Diferido a R9 (local diario ya funciona) |
| 3 | Implementar pantalla Daily y estados de elegibilidad (usar claves i18n) | GENERATE-DOCUMENT | DONE | DailyPage.tsx, AppNav 'daily', App routing |
| 4 | Implementar racha diaria y recompensas por Daily (usar claves i18n en mensajes y etiquetas) | GENERATE-DOCUMENT | DONE | updateStreakOnWin, calcDailyReward, earnCoins en GamePage |
| 5 | Agregar temporadas ligeras con insignias/cosméticos | EXPAND-ELEMENT | DEFERRED | Diferido a R9 |
| 6 | Agregar configuración remota para parámetros no críticos | GENERATE-DOCUMENT | DONE | remoteConfig.ts, remoteConfigService.ts, GET /v1/config mock |
| 7 | Agregar métricas de participación y fallos | GENERATE-DOCUMENT | DEFERRED | Diferido a R9 |
| 8 | Probar reproducibilidad, disponibilidad y ranking | GENERATE-DOCUMENT | DONE | daily.test.ts (7 tests), dailyStore.test.ts (10 tests) |
| 9 | Revisar coherencia y trazabilidad | REVIEW-COHERENCE / UPDATE-TRACEABILITY | DONE | TRACEABILITY.md actualizado |

## Done Criteria

- [x] Daily es reproducible, validable y justo para todos.
- [x] El jugador entiende si su partida cuenta para ranking online.
- [x] Recompensas recurrentes no rompen la economía.
- [x] `TRACEABILITY.md` actualizado con términos nuevos.

## Inconsistencies Found

| # | Description | Docs Involved | Status | Resolution Path |
|---|---|---|---|---|
| — | *None yet* | — | — | — |

## Residuals

| # | Description | Deferred To | Status |
|---|---|---|
| Live ops avanzados y filtros sociales | R9 o futuro | PENDING |

