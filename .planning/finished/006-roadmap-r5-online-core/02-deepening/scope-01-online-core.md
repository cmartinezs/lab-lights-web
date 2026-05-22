# DEEPENING: Scope 01 - Online core

> **Status:** DONE (backend Go pendiente — ver residuals)  
> [← 01-expansion.md](../01-expansion.md)

## Objective

Implementar una primera integración online autoritativa para Classic 3x3.

## Tasks

| # | Task | Workflow | Status | Output |
|---|---|---|---|---|
| 1 | Crear API Go versionada `/v1` y healthcheck | GENERATE-DOCUMENT | RESIDUAL → POST-R5 | `docs/api-contract.openapi.yaml` (contrato completo) |
| 2 | Configurar Supabase PostgreSQL/Auth para perfil mínimo | GENERATE-DOCUMENT | RESIDUAL → POST-R5 | Esquema documentado en traceability |
| 3 | Generar y exponer código único de usuario (referral code) en perfil | GENERATE-DOCUMENT | DONE | Campo `referralCode` en `AccountDto` + visible en `ProfilePage` con copy-to-clipboard |
| 4 | Definir OpenAPI para partidas, score, ranking y perfil | GENERATE-DOCUMENT | DONE | `docs/api-contract.openapi.yaml` — OpenAPI 3.1 completo |
| 5 | Implementar validación básica de Classic 3x3 por seed/movimientos | GENERATE-DOCUMENT | DONE (mock) | `src/online/mock/handlers.ts` — aided/duplicate/speed; Go: documentado en traceability |
| 6 | Implementar login/registro y vinculación local-online (usar claves i18n) | GENERATE-DOCUMENT | DONE | `ProfilePage` con auth inline; `src/online/application/authService.ts`; i18n `online.auth.*` |
| 7 | Enviar puntaje elegible y mostrar estados de envío (usar claves i18n) | GENERATE-DOCUMENT | DONE | `InitialsPage` con `OnlineSubmitSection`; `src/online/application/scoreService.ts` |
| 8 | Mostrar ranking online Classic 3x3 Top 100 (usar claves i18n) | GENERATE-DOCUMENT | DONE | `RankingsPage` tab LOCAL/ONLINE; `src/online/application/rankingService.ts` |
| 9 | Validar contrato y smoke e2e contra staging/mock | REVIEW-COHERENCE | RESIDUAL → POST-R5 | MSW permite validación manual; smoke e2e pendiente CI |
| 10 | Actualizar trazabilidad | UPDATE-TRACEABILITY | DONE | `TRACEABILITY.md` |

## Done Criteria

- [x] Un usuario registrado puede enviar un puntaje Classic 3x3 validado — **DONE vía mock**
- [x] Ranking online muestra Top 100 — **DONE (15 bots pre-seeded + usuarios reales)**
- [x] Cada usuario tiene un `referral_code` único generado al crear la cuenta — **DONE**
- [x] El código de referido es visible en el perfil del usuario — **DONE (con copy)**
- [x] Frontend no escribe en tablas sensibles — **DONE (nunca hay escritura directa a DB)**
- [ ] CI valida contrato OpenAPI y smoke e2e — **PENDING (requiere Go backend)**
- [x] `TRACEABILITY.md` actualizado con términos nuevos — **DONE**

## Inconsistencies Found

| # | Description | Docs Involved | Status | Resolution Path |
|---|---|---|---|---|
| 1 | Backend Go no existe en R5 | Deepening vs. realidad del proyecto | KNOWN | MSW mock es transparente; cuando Go esté listo cambiar VITE_API_URL |

## Residuals

| # | Description | Deferred To | Status |
|---|---|---|
| Sincronización offline completa | R6 | PENDING |
| Daily Challenge | R8 | PENDING |
| Sistema completo de referidos, amigos y desafíos | R9 Scope 02 | PENDING |
| Backend Go real | POST-R5 | PENDING |
| CI/CD smoke e2e contra staging | POST-R5 | PENDING |
| Rankings online otros modos | R6+ | PENDING |
