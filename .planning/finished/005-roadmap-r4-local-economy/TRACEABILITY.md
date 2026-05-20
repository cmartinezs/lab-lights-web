# Traceability: R4 - Economía local

> [← README.md](README.md)

## Term Matrix

| Term / Concept | R | S | M | V | T | W | Notes |
|---|---|---|---|---|---|---|---|
| Monedas locales | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Saldo por perfil/dispositivo |
| Power-ups básicos | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Ayudas con penalización |
| Continuación | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Derrota por tiempo/movimientos |
| Elegibilidad ranked/casual | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Preparación para online |
| Integridad de tablero (anti-hack) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | `moveSequence` + replay + HMAC |
| `verifyBoardIntegrity` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Replay desde seed + plausibilidad |
| Firma HMAC-SHA256 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | `integrityService.ts`, Web Crypto |
| `verified` flag | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Campo en `GameResultRecord` |

## Decisions Made

| ID | Decision | Rationale | Affects | Date |
|---|---|---|---|---|
| R4-D1 | Planificación escrita sin ejecución | El usuario solicitó no comenzar implementación | W | 2026-05-19 |

## Residuals

| ID | Term / Issue | Blocker | Status | Target Resolution |
|---|---|---|---|---|
| R4-R1 | Economía online | Requiere backend | PENDING | R5/R6 |

