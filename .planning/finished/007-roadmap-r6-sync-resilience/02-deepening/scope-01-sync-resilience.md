# DEEPENING: Scope 01 - Sync and resilience

> **Status:** DONE  
> [← 01-expansion.md](../01-expansion.md)

## Objective

Implementar cola offline, sincronización posterior, recompensas idempotentes y estados claros.

## Tasks

| # | Task | Workflow | Status | Output |
|---|---|---|---|---|
| 1 | Diseñar cola offline para partidas y comandos sincronizables | GENERATE-DOCUMENT | DONE | `syncQueue.ts` + `syncService.ts` |
| 2 | Implementar estados offline, sincronizando, fallido, rechazado y desactualizado (usar claves i18n en mensajes de estado) | GENERATE-DOCUMENT | DONE | `InitialsPage.tsx` OnlineSyncSection + claves `online.sync.*` |
| 3 | Implementar `command_id` e idempotencia backend | EXPAND-ELEMENT | DONE | `X-Command-Id` header en `apiFetch`, mock y OpenAPI |
| 4 | Implementar ledger online y `reward_claims` idempotentes | GENERATE-DOCUMENT | DONE | `computeRewards()` en mockDb + `claimedRewards` por cuenta |
| 5 | Agregar recompensas online iniciales | GENERATE-DOCUMENT | DONE | `RewardDto` en contrato + UI de coins en InitialsPage y historial |
| 6 | Agregar historial online de partidas | GENERATE-DOCUMENT | DONE | `GET /v1/me/history` + `historyService.ts` + `OnlineHistoryPanel` |
| 7 | Probar reintentos, duplicados, rechazos y recuperación | GENERATE-DOCUMENT | DONE | `syncQueue.test.ts` (12 tests) + `syncService.test.ts` (15 tests) |
| 8 | Revisar coherencia y trazabilidad | REVIEW-COHERENCE / UPDATE-TRACEABILITY | DONE | `TRACEABILITY.md` actualizado |

## Done Criteria

- [x] Partida jugada offline con cuenta puede sincronizarse después.
- [x] Reintentos no duplican monedas ni recompensas.
- [x] Errores se explican sin perder progreso local.
- [x] `TRACEABILITY.md` actualizado con términos nuevos.

## Inconsistencies Found

| # | Description | Docs Involved | Status | Resolution Path |
|---|---|---|---|---|
| — | *None yet* | — | — | — |

## Residuals

| # | Description | Deferred To | Status |
|---|---|---|
| Daily competitivo | R8 | PENDING |

