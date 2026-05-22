# Traceability: R7 - Modos avanzados

> [← README.md](README.md)

## Term Matrix

| Term / Concept | R | S | V | T | W | Notes |
|---|---|---|---|---|---|---|
| Blind | ✅ | ✅ | ✅ | ✅ | ✅ | `blind` prop en GameBoard, HUD ?? |
| Mirror | ✅ | ✅ | ✅ | ✅ | ✅ | `toggleCellMirror`, moveSeq doble |
| Chaos | ✅ | ✅ | ✅ | ✅ | ✅ | `applyChaosPerturbation`, HUD countdown |
| Chain Reaction | ✅ | ✅ | ✅ | ✅ | ✅ | `toggleCellChain`, replay por modo |
| Puzzle practice | ✅ | ✅ | ✅ | ✅ | ✅ | PUZZLE_BANK, puzzlePar, calculatePuzzleScore |

## Decisions Made

| ID | Decision | Rationale | Affects | Date |
|---|---|---|---|---|
| R7-D1 | Planificación escrita sin ejecución | El usuario solicitó no comenzar implementación | W | 2026-05-19 |
| R7-D2 | Chaos skip replay en verifyBoardIntegrity | Las perturbaciones son deterministas pero el replay completo es complejo; garantía al nivel de servidor via seed | S, T | 2026-05-22 |
| R7-D3 | Mirror registra 2 posiciones en moveSequence | Permite replay estándar sin caso especial: toggleCellAndAdjacent × 2 reproduce el mismo estado | S, T | 2026-05-22 |
| R7-D4 | Puzzle usa PUZZLE_BANK con 10 seeds fijas | Seeds reproducibles entre dispositivos; banco amplio diferido a R9 | S, V | 2026-05-22 |

## Residuals

| ID | Term / Issue | Blocker | Status | Target Resolution |
|---|---|---|---|---|
| R7-R1 | Banco amplio de puzzles | Requiere curaduría/balance | PENDING | R9 |

