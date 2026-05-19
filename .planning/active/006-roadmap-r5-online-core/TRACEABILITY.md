# Traceability: R5 - Online core

> [← README.md](README.md)

## Term Matrix

| Term / Concept | R | S | M | V | T | B | W | Notes |
|---|---|---|---|---|---|---|---|---|
| API Go `/v1` | ✅ | ✅ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ✅ | Backend autoritativo |
| OpenAPI | ✅ | N/A | N/A | ⚠️ | ⚠️ | ⚠️ | ✅ | Contrato versionado |
| Ranking online | ✅ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ✅ | Classic 3x3 inicial |
| Validación anti-cheat | ✅ | N/A | ⚠️ | ⚠️ | ⚠️ | N/A | ✅ | Básica en R5 |

## Decisions Made

| ID | Decision | Rationale | Affects | Date |
|---|---|---|---|---|
| R5-D1 | Planificación escrita sin ejecución | El usuario solicitó no comenzar implementación | W | 2026-05-19 |

## Residuals

| ID | Term / Issue | Blocker | Status | Target Resolution |
|---|---|---|---|---|
| R5-R1 | Sync offline-online | Requiere cola e idempotencia extendida | PENDING | R6 |
| R5-R2 | Daily Challenge | Requiere online core estable | PENDING | R8 |

