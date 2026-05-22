# Traceability: R8 - Daily y live ops

> [← README.md](README.md)

## Term Matrix

| Term / Concept | R | S | M | V | T | O | N | W | Notes |
|---|---|---|---|---|---|---|---|---|---|
| Daily Challenge | ✅ | ✅ | ✅ | ✅ | ✅ | N/A | N/A | ✅ | getDailySeed + DailyPage + GameMode |
| Ranking diario | ✅ | N/A | N/A | N/A | N/A | N/A | N/A | ✅ | Diferido a R9 |
| Racha diaria | ✅ | ✅ | ✅ | ✅ | ✅ | N/A | N/A | ✅ | updateStreakOnWin + calcDailyReward |
| Configuración remota | ✅ | N/A | ✅ | ✅ | ✅ | ✅ | N/A | ✅ | remoteConfigService + GET /v1/config mock |

## Decisions Made

| ID | Decision | Rationale | Affects | Date |
|---|---|---|---|---|
| R8-D1 | Planificación escrita sin ejecución | El usuario solicitó no comenzar implementación | W | 2026-05-19 |
| R8-D2 | getTodayKey usa métodos UTC | `new Date('YYYY-MM-DD')` parsea como UTC midnight; getDate() usa timezone local → off-by-one. UTC métodos garantizan consistencia cross-timezone | T | 2026-05-22 |
| R8-D3 | Ranking diario diferido a R9 | El ranking competitivo requiere backend autoritativo; el estado local (streak + score guardado) satisface R8 | R, M | 2026-05-22 |
| R8-D4 | RemoteConfig fetch con fallback silencioso | GET /v1/config falla silenciosamente → DEFAULT_REMOTE_CONFIG; no bloquea gameplay | V, O | 2026-05-22 |

## Residuals

| ID | Term / Issue | Blocker | Status | Target Resolution |
|---|---|---|---|---|
| R8-R1 | Filtros sociales | Producto futuro | PENDING | R9 o futuro |

