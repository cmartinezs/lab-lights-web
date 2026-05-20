# DEEPENING: Scope 01 - Local economy

> **Status:** DONE  
> [← 01-expansion.md](../01-expansion.md)

## Objective

Implementar economía local con monedas, power-ups básicos, continuaciones y elegibilidad visible.

## Tasks

| # | Task | Workflow | Status | Output |
|---|---|---|---|---|
| 1 | Definir reglas locales de monedas por victoria | GENERATE-DOCUMENT | DONE | `walletStore.ts` — `earnCoins`, `spendCoins`, `getBalance`; bootstrap retroactivo |
| 2 | Crear tienda local inicial | GENERATE-DOCUMENT | DONE | `ShopPage.tsx` — power-ups y temas con "coming soon" notice |
| 3 | Implementar `+30s`, `+5 movimientos`, `Deshacer` y `Reordenar luces` | GENERATE-DOCUMENT | DONE | `gameSession.ts` — `applyAddTime`, `applyAddMoves`, `applyShuffle`, `consumeUndo`; tray funcional en `GamePage.tsx` |
| 4 | Implementar continuación local con penalización −30% | GENERATE-DOCUMENT | DONE | `ContinuePage.tsx` — opción gratis ×1 + opciones de pago; `GameSession.continued`; penalización en score |
| 5 | Mostrar marcas de ayudas en resultado | EXPAND-ELEMENT | DONE | `ResultPage.tsx` — badge "CON AYUDA", fila penalización, bloqueo de ranking |
| 6 | Implementar mejoras permanentes iniciales | GENERATE-DOCUMENT | DEFERRED | → R6 (requiere backend) |
| 7 | Probar cobros, gastos, penalizaciones y no duplicación | GENERATE-DOCUMENT | DONE | `walletStore.test.ts` (6 tests) · `gameSession.test.ts` (14 tests) |
| 8 | Revisar coherencia y trazabilidad | REVIEW-COHERENCE / UPDATE-TRACEABILITY | DONE | archivos de planeación actualizados |

## Done Criteria

- [x] El jugador gana y gasta monedas localmente.
- [x] Las ayudas modifican puntaje y elegibilidad de forma visible.
- [x] No hay doble cobro local por recarga o repetición.
- [ ] `TRACEABILITY.md` actualizado con términos nuevos.

## Inconsistencies Found

| # | Description | Docs Involved | Status | Resolution Path |
|---|---|---|---|---|
| — | *None yet* | — | — | — |

## Residuals

| # | Description | Deferred To | Status |
|---|---|---|
| Mejoras permanentes (unlock progression) | R6 | PENDING |
| Ledger transaccional online | R5/R6 | PENDING |
| Tienda completamente funcional con compras reales | R5 | PENDING |
