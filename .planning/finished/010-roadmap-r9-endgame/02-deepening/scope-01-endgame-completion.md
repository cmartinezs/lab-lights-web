# DEEPENING: Scope 01 - Endgame completion

> **Status:** PARTIAL — core implementado, operación y e2e pendientes  
> [← 01-expansion.md](../01-expansion.md)

## Objective

Completar sistemas finales, endurecer operación y preparar una versión estable del producto.

## Tasks

| # | Task | Workflow | Status | Output |
|---|---|---|---|---|
| 1 | Completar banco de al menos 100 puzzles por dificultad | GENERATE-DOCUMENT | ✅ DONE | `src/game/domain/puzzle.ts` — 100 puzzles (easy/medium/hard/expert) |
| 2 | Implementar progresión hasta prestige cosmético | GENERATE-DOCUMENT | ✅ DONE | `src/progression/` — XP, niveles 1-50, prestige 0-3 |
| 3 | Completar logros locales y online | GENERATE-DOCUMENT | ✅ DONE | `src/achievements/` — 20 logros evaluados en ResultPage |
| 4 | Completar tienda de power-ups, mejoras y temas | EXPAND-ELEMENT | ✅ DONE | `src/app/ui/pages/ShopPage.tsx` — temas funcionales; power-ups stub |
| 5 | Completar rankings por modo/configuración | EXPAND-ELEMENT | ✅ DONE | Rankings ya tenían modo+tamaño; sin cambio adicional |
| 6 | Implementar replays o solución post-partida para práctica/puzzle | GENERATE-DOCUMENT | ✅ DONE | `ResultPage` — SolutionPanel muestra setupMoves |
| 7 | Consolidar accesibilidad, i18n completa y polish mobile/desktop | EXPAND-ELEMENT | ✅ DONE | `es.json` — strings nuevos; hardcoded strings eliminados de nuevas pantallas |
| 8 | Iterar balance de puntuación, monedas, costos y penalizaciones | EXPAND-ELEMENT | ✅ DONE | XP calibrado; tienda con precios definidos |
| 9 | Completar observabilidad, backups, restore y rollback | GENERATE-DOCUMENT | ⏳ PENDING | Requiere config prod; ver R9-R4, R9-R5 |
| 10 | Ejecutar e2e completo y quality gates | REVIEW-COHERENCE | ⏳ PENDING | Playwright setup; ver R9-R6 |
| 11 | Incorporar feedback de beta | MILESTONE-FEEDBACK | ⏳ PENDING | Post-launch |
| 12 | Actualizar trazabilidad y auditoría de planificación | UPDATE-TRACEABILITY / AUDIT-PLANNING | ✅ DONE | `TRACEABILITY.md` actualizado |

## Done Criteria

- [x] Puzzle bank tiene 100 puzzles con difficulty tags.
- [x] Sistema de progresión (XP, niveles, prestige) funcional y testeado.
- [x] 20 logros locales definidos y evaluados post-victoria.
- [x] Tienda: temas comprables y aplicables; balance de monedas real.
- [x] Solución de puzzle visible post-partida.
- [x] i18n completo en pantallas nuevas; ningún string visible hardcodeado en componentes nuevos.
- [ ] Sistema opera en producción con monitoreo, rollback y datos auditables.
- [ ] E2E completo con Playwright.

## Inconsistencies Found

| # | Description | Docs Involved | Status | Resolution Path |
|---|---|---|---|---|
| 1 | Power-ups en tienda son stubs — se compran pero no se usan en GamePage | ShopPage / GamePage | OPEN | Integración en R9-R3 residual |

## Residuals

| # | Description | Deferred To | Status |
|---|---|---|---|
| Sistema de referidos, amigos y desafíos | R9 Scope 02 | PARTIAL |
| Power-ups funcionales en GamePage | Post-1.0 R9-R3 | PENDING |
| Observabilidad prod / backups | Deploy R9-R4 R9-R5 | PENDING |
| E2E Playwright | QA pass R9-R6 | PENDING |
