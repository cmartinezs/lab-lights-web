# INITIAL: R3 - Variantes base

> **Status:** Initial written  
> [← active/README.md](../README.md)

## Intent

Agregar variantes locales de baja complejidad técnica: Dimensional, Time Attack y Move Limit.

## Why

Después del MVP+ local, el juego necesita variedad y desafío antes de introducir economía u online.

## Approximate Scope

- [ ] `src/game/domain/` — reglas parametrizables por tamaño, tiempo y movimientos.
- [ ] `src/game/application/` — configuración de partida.
- [ ] `src/game/ui/` — selección de modo, configuración y resultado extendido.
- [ ] `src/rankings/` — separación local por modo/configuración.

## Initiator

- **Requested by:** human
- **Date:** 2026-05-19
- **Related planning:** `003-roadmap-r2-local-mvp-plus`

## Next Step

- [ ] Ejecutar scopes solo cuando R2 esté cerrado.

### Open Questions

- ¿Qué tamaños se exponen inicialmente en la UI: todos 3x3 a 10x10 o una progresión limitada?

