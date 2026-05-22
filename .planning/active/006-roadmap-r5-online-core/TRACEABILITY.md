# Traceability: R5 - Online core

> [← README.md](README.md)

## Term Matrix

| Term / Concept | R | S | M | V | T | B | W | Notes |
|---|---|---|---|---|---|---|---|---|
| API Go `/v1` | ✅ | ✅ | ✅ | 📄 | ⚠️ | ✅ | ✅ | Backend Go pendiente; frontend + mock implementados |
| OpenAPI | ✅ | N/A | N/A | ✅ | ⚠️ | ✅ | ✅ | `docs/api-contract.openapi.yaml` |
| MSW mock server | N/A | N/A | N/A | ✅ | N/A | ✅ | ✅ | `src/online/mock/` — intercepta `/v1/*` transparentemente |
| Cuenta online | ✅ | ✅ | ✅ | ✅ | ⚠️ | ✅ | ✅ | Register/login/logout en ProfilePage |
| `referral_code` | ✅ | ✅ | ✅ | ✅ | ⚠️ | ✅ | ✅ | Generado al registrar; visible en perfil con copy |
| Envío de puntaje | ✅ | ✅ | ✅ | ✅ | ⚠️ | ✅ | ✅ | `POST /v1/scores` — validación básica en mock |
| Ranking online | ✅ | ✅ | ✅ | ✅ | ⚠️ | ✅ | ✅ | Tab ONLINE en RankingsPage (Classic 3×3) |
| Validación anti-cheat | ✅ | N/A | ✅ | 📄 | ⚠️ | ✅ | ✅ | Mock: aided/duplicate/speed; Go: replay completo |
| JWT auth | ✅ | ✅ | ✅ | 📄 | ⚠️ | ✅ | ✅ | Mock: tokens en localStorage; Go: HS256 real |
| i18n strings | ✅ | ✅ | ✅ | ✅ | N/A | N/A | ✅ | Clave `online.*` en `es.json` |

Leyenda: ✅ implementado · 📄 documentado (pendiente Go) · ⚠️ pendiente · N/A no aplica

## Decisions Made

| ID | Decision | Rationale | Affects | Date |
|---|---|---|---|---|
| R5-D1 | Planificación escrita sin ejecución | El usuario solicitó no comenzar implementación | W | 2026-05-19 |
| R5-D2 | MSW como mock server | Intercepta `fetch` a nivel Service Worker: cero cambios en código de producción al conectar Go real | B/V | 2026-05-22 |
| R5-D3 | VITE_API_URL controla entorno | Sin variable → MSW activo (dev); con variable → llamadas reales (producción). Sin feature flags en código fuente. | V/B | 2026-05-22 |
| R5-D4 | Mock db en localStorage | Estado del mock persiste entre recargas; facilita testing manual de flujos auth multi-paso | B | 2026-05-22 |
| R5-D5 | Scope R5 solo Classic 3×3 | Minimiza superficie de validación en el backend Go inicial | R/V | 2026-05-22 |
| R5-D6 | Auth inline en ProfilePage | Sin páginas adicionales; el formulario se expande in-place para reducir navegación | S/V | 2026-05-22 |
| R5-D7 | moveSequence en GameResultParams | Necesario para enviar la secuencia al backend para validación replay | M/V | 2026-05-22 |

## Key Files

| File | Role |
|---|---|
| `docs/api-contract.openapi.yaml` | Especificación OpenAPI 3.1 completa del backend Go |
| `src/online/api/contract.ts` | Tipos TypeScript derivados del contrato |
| `src/online/infra/apiFetch.ts` | Cliente HTTP fetch (base URL configurable) |
| `src/online/infra/authStore.ts` | Persistencia token/cuenta en localStorage |
| `src/online/application/authService.ts` | register, login, logout, getAccount |
| `src/online/application/scoreService.ts` | submitScore |
| `src/online/application/rankingService.ts` | fetchOnlineRanking |
| `src/online/mock/mockDb.ts` | Estado del mock (15 bots pre-seeded) |
| `src/online/mock/handlers.ts` | MSW handlers para todos los endpoints R5 |
| `src/online/mock/browser.ts` | Arranca el Service Worker MSW |
| `src/app/main.tsx` | Activa MSW en dev (si no hay VITE_API_URL) |
| `src/profile/ui/pages/ProfilePage.tsx` | Sección CUENTA ONLINE con auth inline |
| `src/rankings/ui/pages/RankingsPage.tsx` | Tab LOCAL/ONLINE para Classic |
| `src/game/ui/pages/InitialsPage.tsx` | Botón "Publicar en ranking online" post-save |

## Backend Go (pendiente — R5 no incluye el servidor)

El servidor Go debe implementar exactamente el contrato en `docs/api-contract.openapi.yaml`.
Puntos críticos para la validación backend real:

1. **Replay validation** — reconstruir tablero con `createBoardFromSeed(seed, {rows:3, cols:3})` y aplicar `moveSequence` en orden. El tablero final debe ser victoria (todos en estado OFF).
2. **HMAC verification** — verificar `HMAC-SHA256("seed:score:moves", "lab-lights-integrity-v1-k7x9q2p")`.
3. **Score recalculation** — calcular puntaje clásico `(9 - moves) * 1000 + max(0, 300 - elapsedSeconds*10)` y comparar con ±5% del enviado.
4. **JWT** — HS256, claim `sub` = user UUID, TTL 24h. Invalidación con lista negra en Redis o tabla de tokens revocados.
5. **Ranking** — best score por usuario, updated en tiempo real. Índice sobre `(mode, rows, columns, score DESC)`.

## Residuals

| ID | Term / Issue | Blocker | Status | Target Resolution |
|---|---|---|---|---|
| R5-R1 | Sincronización offline→online | Cola de envíos + idempotencia extendida en backend | PENDING | R6 |
| R5-R2 | Daily Challenge | Requiere online core estable + seed diaria en backend | PENDING | R8 |
| R5-R3 | Backend Go real `/v1` | Fuera de scope R5; frontend listo para conectar | PENDING | POST-R5 |
| R5-R4 | Tests E2E de contrato | Smoke test contra staging o mock server Node | PENDING | POST-R5 |
| R5-R5 | Rankings otros modos online | R5 solo Classic 3×3 | PENDING | R6+ |
