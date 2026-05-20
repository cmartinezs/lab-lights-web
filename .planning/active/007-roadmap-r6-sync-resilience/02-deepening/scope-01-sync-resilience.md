# DEEPENING: Scope 01 - Sync and resilience

> **Status:** PENDING  
> [← 01-expansion.md](../01-expansion.md)

## Objective

Implementar cola offline, sincronización posterior, recompensas idempotentes y estados claros.

## Tasks

| # | Task | Workflow | Status | Output |
|---|---|---|---|---|
| 1 | Diseñar cola offline para partidas y comandos sincronizables | GENERATE-DOCUMENT | PENDING | modelo frontend |
| 2 | Implementar estados offline, sincronizando, fallido, rechazado y desactualizado (usar claves i18n en mensajes de estado) | GENERATE-DOCUMENT | PENDING | UI de estados |
| 3 | Implementar `command_id` e idempotencia backend | EXPAND-ELEMENT | PENDING | comandos backend |
| 4 | Implementar ledger online y `reward_claims` idempotentes | GENERATE-DOCUMENT | PENDING | data/backend |
| 5 | Agregar recompensas online iniciales | GENERATE-DOCUMENT | PENDING | rewards |
| 6 | Agregar historial online de partidas | GENERATE-DOCUMENT | PENDING | perfil/historial |
| 7 | Probar reintentos, duplicados, rechazos y recuperación | GENERATE-DOCUMENT | PENDING | tests |
| 8 | Revisar coherencia y trazabilidad | REVIEW-COHERENCE / UPDATE-TRACEABILITY | PENDING | revisión y `TRACEABILITY.md` |

## Done Criteria

- [ ] Partida jugada offline con cuenta puede sincronizarse después.
- [ ] Reintentos no duplican monedas ni recompensas.
- [ ] Errores se explican sin perder progreso local.
- [ ] `TRACEABILITY.md` actualizado con términos nuevos.

## Inconsistencies Found

| # | Description | Docs Involved | Status | Resolution Path |
|---|---|---|---|---|
| — | *None yet* | — | — | — |

## Residuals

| # | Description | Deferred To | Status |
|---|---|---|
| Daily competitivo | R8 | PENDING |

