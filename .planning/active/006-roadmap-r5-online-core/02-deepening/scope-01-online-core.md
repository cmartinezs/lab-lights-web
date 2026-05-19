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
| 3 | Definir OpenAPI para partidas, score, ranking y perfil | GENERATE-DOCUMENT | PENDING | contrato OpenAPI |
| 4 | Implementar validación básica de Classic 3x3 por seed/movimientos | GENERATE-DOCUMENT | PENDING | dominio backend |
| 5 | Implementar login/registro y vinculación local-online | GENERATE-DOCUMENT | PENDING | frontend auth |
| 6 | Enviar puntaje elegible y mostrar estados de envío | GENERATE-DOCUMENT | PENDING | flujo web |
| 7 | Mostrar ranking online Classic 3x3 Top 100 | GENERATE-DOCUMENT | PENDING | pantalla ranking |
| 8 | Validar contrato y smoke e2e contra staging/mock | REVIEW-COHERENCE | PENDING | reporte |
| 9 | Actualizar trazabilidad | UPDATE-TRACEABILITY | PENDING | `TRACEABILITY.md` |

## Done Criteria

- [ ] Un usuario registrado puede enviar un puntaje Classic 3x3 validado.
- [ ] Ranking online muestra Top 100.
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

