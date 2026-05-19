# INITIAL: R7 - Modos avanzados

> **Status:** Initial written  
> [← active/README.md](../README.md)

## Intent

Ampliar profundidad estratégica con modos avanzados y efectos visuales diferenciados.

## Why

El juego necesita complejidad real y variedad mecánica una vez que el loop local, economía y online core estén estabilizados.

## Approximate Scope

- [ ] `src/game/domain/` — reglas para Blind, Mirror, Chaos, Chain Reaction y Puzzle.
- [ ] `src/game/ui/` — tutoriales, feedback de perturbación, espejo y cadena.
- [ ] `src/rankings/` — rankings locales por modo.
- [ ] Testing — paridad y eventos si reglas existen en TypeScript y Go.

## Initiator

- **Requested by:** human
- **Date:** 2026-05-19
- **Related planning:** `007-roadmap-r6-sync-resilience`

## Next Step

- [ ] Ejecutar scopes solo cuando R6 esté cerrado.

### Open Questions

- ¿Puzzle practice debe usar un banco manual inicial o generador de puzzles con solución conocida?

