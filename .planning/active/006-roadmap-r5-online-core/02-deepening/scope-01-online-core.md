# DEEPENING: Scope 01 - Online core

> **Status:** PENDING  
> [← 01-expansion.md](../01-expansion.md)

## Objective

Implementar una primera integración online autoritativa para Classic 3x3.

## Tasks

| # | Task | Workflow | Status | Output |
|---|---|---|---|---|
| 1 | Crear API Go versionada `/v1` y healthcheck | GENERATE-DOCUMENT | PENDING | `lab-lights-api` |
| 2 | Configurar Supabase PostgreSQL/Auth para perfil mínimo | GENERATE-DOCUMENT | PENDING | esquema inicial |
| 3 | Generar y exponer código único de usuario (referral code) en perfil | GENERATE-DOCUMENT | PENDING | campo `referral_code` en Supabase + UI |
| 4 | Definir OpenAPI para partidas, score, ranking y perfil | GENERATE-DOCUMENT | PENDING | contrato OpenAPI |
| 5 | Implementar validación básica de Classic 3x3 por seed/movimientos | GENERATE-DOCUMENT | PENDING | dominio backend |
| 6 | Implementar login/registro y vinculación local-online (usar claves i18n) | GENERATE-DOCUMENT | PENDING | frontend auth |
| 7 | Enviar puntaje elegible y mostrar estados de envío (usar claves i18n) | GENERATE-DOCUMENT | PENDING | flujo web |
| 8 | Mostrar ranking online Classic 3x3 Top 100 (usar claves i18n) | GENERATE-DOCUMENT | PENDING | pantalla ranking |
| 9 | Validar contrato y smoke e2e contra staging/mock | REVIEW-COHERENCE | PENDING | reporte |
| 10 | Actualizar trazabilidad | UPDATE-TRACEABILITY | PENDING | `TRACEABILITY.md` |

## Done Criteria

- [ ] Un usuario registrado puede enviar un puntaje Classic 3x3 validado.
- [ ] Ranking online muestra Top 100.
- [ ] Cada usuario tiene un `referral_code` único generado al crear la cuenta.
- [ ] El código de referido es visible en el perfil del usuario.
- [ ] Frontend no escribe en tablas sensibles.
- [ ] CI valida contrato OpenAPI y smoke e2e.
- [ ] `TRACEABILITY.md` actualizado con términos nuevos.

## Inconsistencies Found

| # | Description | Docs Involved | Status | Resolution Path |
|---|---|---|---|---|
| — | *None yet* | — | — | — |

## Residuals

| # | Description | Deferred To | Status |
|---|---|---|
| Sincronización offline completa | R6 | PENDING |
| Daily Challenge | R8 | PENDING |
| Sistema completo de referidos, amigos y desafíos | R9 Scope 02 | PENDING |

