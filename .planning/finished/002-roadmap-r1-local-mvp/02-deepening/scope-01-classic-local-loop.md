# DEEPENING: Scope 01 - Classic local loop

> **Status:** DONE  
> [← 01-expansion.md](../01-expansion.md)

## Objective

Implementar Classic 3x3 local con inicio, movimientos, victoria, resultado y repetición.

## Tasks

| # | Task | Workflow | Status | Output |
|---|---|---|---|---|
| 1 | Definir dominio puro de tablero 3x3, adyacencias, inversión, seed y victoria | GENERATE-DOCUMENT | DONE | `src/game/domain/board.ts` |
| 2 | Crear caso de uso para iniciar partida, aplicar movimiento y reiniciar | GENERATE-DOCUMENT | DONE | `src/game/application/classicGame.ts` |
| 3 | Construir UI mobile first de tablero, contador y temporizador informativo | GENERATE-DOCUMENT | DONE | `src/game/ui/` |
| 4 | Agregar pantalla de resultado con puntaje simple | GENERATE-DOCUMENT | DONE | `ResultPanel` modal con iniciales arcade |
| 5 | Agregar animación de click e inversión visual | EXPAND-ELEMENT | DONE | `GameBoard` con Anime.js y estados CSS |
| 6 | Cubrir reglas con unit tests | GENERATE-DOCUMENT | DONE | `src/game/domain/board.test.ts` |
| 7 | Cubrir flujo mínimo con smoke/e2e | GENERATE-DOCUMENT | DONE | `src/app/ui/App.test.tsx` cubre inicio y victoria controlada |
| 8 | Revisar coherencia con specs y actualizar trazabilidad | REVIEW-COHERENCE / UPDATE-TRACEABILITY | DONE | tests ejecutados y `TRACEABILITY.md` actualizado |

## Done Criteria

- [x] Un usuario puede abrir la app, jugar Classic 3x3, ganar, grabar resultado y repetir.
- [x] Unit tests cubren reglas del tablero.
- [x] Smoke/e2e cubre inicio y victoria controlada.
- [x] No se incorporan ranking, monedas, power-ups ni backend.
- [x] `TRACEABILITY.md` actualizado con términos nuevos.

## Inconsistencies Found

| # | Description | Docs Involved | Status | Resolution Path |
|---|---|---|---|---|
| — | *None yet* | — | — | — |

## Residuals

| # | Description | Deferred To | Status |
|---|---|---|
| Solvencia garantizada de tableros fuera de Classic 3x3 local | R3/R5 según decisión de ranking | PENDING |
