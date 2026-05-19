# DEEPENING: Scope 01 - Classic local loop

> **Status:** PENDING  
> [← 01-expansion.md](../01-expansion.md)

## Objective

Implementar Classic 3x3 local con inicio, movimientos, victoria, resultado y repetición.

## Tasks

| # | Task | Workflow | Status | Output |
|---|---|---|---|---|
| 1 | Definir dominio puro de tablero 3x3, adyacencias, inversión, seed y victoria | GENERATE-DOCUMENT | PENDING | `src/game/domain/` |
| 2 | Crear caso de uso para iniciar partida, aplicar movimiento y reiniciar | GENERATE-DOCUMENT | PENDING | `src/game/application/` |
| 3 | Construir UI mobile first de tablero, contador y temporizador informativo | GENERATE-DOCUMENT | PENDING | `src/game/ui/` |
| 4 | Agregar pantalla de resultado con puntaje simple | GENERATE-DOCUMENT | PENDING | componentes de resultado |
| 5 | Agregar animación de click e inversión visual | EXPAND-ELEMENT | PENDING | helper Anime.js/CSS |
| 6 | Cubrir reglas con unit tests | GENERATE-DOCUMENT | PENDING | tests de dominio |
| 7 | Cubrir flujo mínimo con smoke/e2e | GENERATE-DOCUMENT | PENDING | test e2e |
| 8 | Revisar coherencia con specs y actualizar trazabilidad | REVIEW-COHERENCE / UPDATE-TRACEABILITY | PENDING | revisión y `TRACEABILITY.md` |

## Done Criteria

- [ ] Un usuario puede abrir la app, jugar Classic 3x3, ganar y repetir.
- [ ] Unit tests cubren reglas del tablero.
- [ ] Smoke/e2e cubre inicio y victoria controlada.
- [ ] No se incorporan ranking, monedas, power-ups ni backend.
- [ ] `TRACEABILITY.md` actualizado con términos nuevos.

## Inconsistencies Found

| # | Description | Docs Involved | Status | Resolution Path |
|---|---|---|---|---|
| — | *None yet* | — | — | — |

## Residuals

| # | Description | Deferred To | Status |
|---|---|---|
| Solvencia garantizada de tableros | R3/R5 según decisión de ranking | PENDING |

