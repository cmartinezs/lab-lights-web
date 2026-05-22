# Traceability: R6 - Sincronización y resiliencia

> [← README.md](README.md)

## Term Matrix

| Term / Concept | R | S | M | V | T | O | W | Notes |
|---|---|---|---|---|---|---|---|---|
| Cola offline | ✅ | N/A | ✅ | ✅ | ✅ | ✅ | ✅ | `syncQueue.ts` + `syncService.ts` |
| `command_id` / `X-Command-Id` | ✅ | N/A | ✅ | ✅ | ✅ | ✅ | ✅ | Header en apiFetch; mock dedup por commandId+accountId |
| Ledger online | ✅ | N/A | ✅ | N/A | N/A | ✅ | ✅ | `claimedRewards` en mockDb; OpenAPI documenta el contrato |
| Recompensas online | ✅ | N/A | ✅ | ✅ | N/A | ✅ | ✅ | `RewardDto` en contrato; UI en InitialsPage y historial |
| Historial de partidas | ✅ | N/A | ✅ | ✅ | N/A | ✅ | ✅ | `GET /v1/me/history` + `historyService.ts` + `OnlineHistoryPanel` |
| Auto-sync | ✅ | N/A | N/A | N/A | N/A | ✅ | ✅ | `setupAutoSync()` en App.tsx; events: online + visibilitychange |

## Decisions Made

| ID | Decision | Rationale | Affects | Date |
|---|---|---|---|---|
| R6-D1 | Planificación escrita sin ejecución | El usuario solicitó no comenzar implementación | W | 2026-05-19 |
| R6-D2 | Rewards inline en SubmitScoreResponse (no endpoint separado) | Reduce round-trips; idempotente por `claimedRewards` en servidor | O, M, V | 2026-05-22 |
| R6-D3 | MAX_ATTEMPTS=3 con backoff implícito por visibility/online events | Balance entre resiliencia y no bombardear el servidor | S | 2026-05-22 |
| R6-D4 | `draining` flag de módulo previene drains concurrentes | Race condition protection sin mutex explícito | S | 2026-05-22 |
| R6-D5 | Estado de cuenta levantado a ProfilePage | Permite que SyncQueuePanel y OnlineHistoryPanel aparezcan/desaparezcan coordinados con el logout | V | 2026-05-22 |

## Residuals

| ID | Term / Issue | Blocker | Status | Target Resolution |
|---|---|---|---|---|
| R6-R1 | Daily competitivo | Requiere sincronización confiable | PENDING | R8 |

