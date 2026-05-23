# Traceability: R9 - Endgame

> [← README.md](README.md)

## Term Matrix

| Term / Concept | R | S | M | V | T | B | O | N | F | W | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Puzzle bank | ✅ | ✅ | ✅ | ✅ | ✅ | N/A | N/A | N/A | ⚠️ | ✅ | 100 puzzles con difficulty tags |
| Prestige | ✅ | ✅ | ✅ | ✅ | ✅ | N/A | N/A | N/A | ⚠️ | ✅ | Cosmético: Investigador/Senior/Experto |
| Logros | ✅ | ✅ | ✅ | ✅ | ✅ | N/A | N/A | N/A | ⚠️ | ✅ | 20 logros locales implementados |
| Tienda funcional | ✅ | ✅ | ✅ | ✅ | ✅ | N/A | N/A | N/A | ⚠️ | ✅ | Temas comprables, power-ups stub |
| Rankings completos | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ✅ | Por modo/configuración |
| Observabilidad | ✅ | N/A | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | N/A | ✅ | Pendiente hardening prod |
| Balance | ✅ | ✅ | ✅ | ✅ | ✅ | N/A | N/A | N/A | ⚠️ | ✅ | XP y monedas calibrados |
| Solución puzzle | ✅ | ✅ | ✅ | ✅ | ✅ | N/A | N/A | N/A | ⚠️ | ✅ | Setup moves como solución óptima |
| Social - referido | ✅ | ✅ | ✅ | ✅ | ✅ | N/A | N/A | N/A | ⚠️ | ✅ | Código visible + Share API |
| Social - amigos | ✅ | ✅ | ✅ | ⚠️ | ⚠️ | N/A | N/A | N/A | ⚠️ | ✅ | UI + backend pendiente Supabase |
| Social - desafíos | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | N/A | N/A | N/A | ⚠️ | ✅ | Post-1.0 |

## Decisions Made

| ID | Decision | Rationale | Affects | Date |
|---|---|---|---|---|
| R9-D1 | Planificación escrita sin ejecución | El usuario solicitó no comenzar implementación | W | 2026-05-19 |
| R9-D2 | 100 puzzles con difficulty tags (easy/medium/hard/expert) | Cumple goal de banco amplio; difficulty guía la progresión | M V | 2026-05-22 |
| R9-D3 | XP formula: max(1, round(score/100)) | Calibrado al rango de puntaje existente; sin cambio al display previo | M V | 2026-05-22 |
| R9-D4 | Prestige ciclo de 50 niveles + MAX_CYCLE_XP | Curva 4*(level-1)^1.5; recompensa juego consistente | M V | 2026-05-22 |
| R9-D5 | 20 logros locales, evaluados en ResultPage | Sin backend requerido; extensible online later | V T | 2026-05-22 |
| R9-D6 | Social: UI + Share API; backend Supabase como residual | Friends/challenges requieren schema no existente aún | V | 2026-05-22 |
| R9-D7 | Tienda: temas comprables funcionales, power-ups son stubs | Power-ups requieren integración GamePage más profunda | V | 2026-05-22 |
| R9-D8 | Solución puzzle = setupMoves (moves de scramble = moves óptimos) | Lights-out: cada toggle es su propio inverso | V | 2026-05-22 |
| R9-D9 | Temas persistidos en themeStore; aplicados al inicio via applyPersistedTheme() | Necesario para que el tema sobreviva refreshes | V | 2026-05-22 |

## Residuals

| ID | Term / Issue | Blocker | Status | Target Resolution |
|---|---|---|---|---|
| R9-R1 | Sistema de desafíos entre amigos | Supabase `challenges` table | PENDING | Post-1.0 |
| R9-R2 | Notificaciones push | FCM / VAPID setup | PENDING | Post-1.0 |
| R9-R3 | Power-ups funcionales en partida | Integración GamePage profunda | PENDING | Post-1.0 |
| R9-R4 | Observabilidad producción (Sentry, métricas) | Config prod | PENDING | Deploy |
| R9-R5 | Backups / restore Supabase | Config prod | PENDING | Deploy |
| R9-R6 | E2E Playwright completo | Playwright setup | PENDING | QA pass |
| R9-R7 | Lector QR para código de referido | Permisos cámara mobile | PENDING | Post-1.0 |
