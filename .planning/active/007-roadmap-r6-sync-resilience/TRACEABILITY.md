# Traceability: R6 - Sincronización y resiliencia

> [← README.md](README.md)

## Term Matrix

| Term / Concept | R | S | M | V | T | O | W | Notes |
|---|---|---|---|---|---|---|---|---|
| Cola offline | ✅ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ✅ | Sincronización posterior |
| `command_id` | ✅ | N/A | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ✅ | Idempotencia |
| Ledger online | ✅ | N/A | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ✅ | Economía autoritativa |
| Recompensas online | ✅ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ✅ | Reclamo idempotente |

## Decisions Made

| ID | Decision | Rationale | Affects | Date |
|---|---|---|---|---|
| R6-D1 | Planificación escrita sin ejecución | El usuario solicitó no comenzar implementación | W | 2026-05-19 |

## Residuals

| ID | Term / Issue | Blocker | Status | Target Resolution |
|---|---|---|---|---|
| R6-R1 | Daily competitivo | Requiere sincronización confiable | PENDING | R8 |

