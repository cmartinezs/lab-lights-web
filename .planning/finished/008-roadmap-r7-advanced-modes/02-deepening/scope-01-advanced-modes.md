# DEEPENING: Scope 01 - Advanced modes

> **Status:** DONE  
> [← 01-expansion.md](../01-expansion.md)

## Objective

Implementar modos avanzados con reglas extensibles, eventos registrados y feedback visual propio.

## Tasks

| # | Task | Workflow | Status | Output |
|---|---|---|---|---|
| 1 | Implementar Blind con conteo y power-ups específicos (usar claves i18n en nombres, descripciones y tutorial) | GENERATE-DOCUMENT | DONE | GameBoard `blind` prop, `??` en HUD |
| 2 | Implementar Mirror con ejes horizontal, vertical y ambos (usar claves i18n) | GENERATE-DOCUMENT | DONE | `toggleCellMirror`, moveSequence doble |
| 3 | Implementar Chaos con perturbaciones distinguibles (usar claves i18n) | GENERATE-DOCUMENT | DONE | `applyChaosPerturbation` c/3 movs, HUD countdown |
| 4 | Implementar Chain Reaction con animación de cadena (usar claves i18n) | GENERATE-DOCUMENT | DONE | `toggleCellChain`, replay correcto |
| 5 | Implementar Puzzle practice con banco inicial reducido (usar claves i18n) | GENERATE-DOCUMENT | DONE | PUZZLE_BANK 10 seeds, puzzlePar, score |
| 6 | Separar rankings locales por modo avanzado | EXPAND-ELEMENT | DONE | RankingsPage 9 modos, bug loadAllModeResults corregido |
| 7 | Registrar eventos de sistema vs jugador para replay/validación | EXPAND-ELEMENT | DONE | verifyBoardIntegrity por modo; chaos/invert skip replay |
| 8 | Agregar tests de reglas, eventos y paridad cuando aplique | GENERATE-DOCUMENT | DONE | 14 nuevos tests (board + session) |
| 9 | Revisar coherencia y trazabilidad | REVIEW-COHERENCE / UPDATE-TRACEABILITY | DONE | TRACEABILITY.md actualizado |

## Done Criteria

- [x] Cada modo avanzado tiene tutorial o entrada suficiente.
- [x] Eventos quedan registrados para replay/validación.
- [x] La UI mantiene legibilidad con efectos avanzados.
- [x] `TRACEABILITY.md` actualizado con términos nuevos.

## Inconsistencies Found

| # | Description | Docs Involved | Status | Resolution Path |
|---|---|---|---|---|
| — | *None yet* | — | — | — |

## Residuals

| # | Description | Deferred To | Status |
|---|---|---|
| Banco completo de 100 puzzles | R9 | PENDING |

