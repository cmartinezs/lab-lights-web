# INITIAL: R6 - Sincronización y resiliencia

> **Status:** Initial written  
> [← active/README.md](../README.md)

## Intent

Implementar sincronización offline-online confiable, idempotencia, recompensas online iniciales y estados claros.

## Why

El juego debe tolerar red intermitente sin duplicar monedas, recompensas ni perder progreso local.

## Approximate Scope

- [ ] Frontend — cola offline y estados de sincronización.
- [ ] Backend — `command_id`, ledger, rewards y rate limiting.
- [ ] Data model — eventos, recompensas y proyecciones.
- [ ] Testing — reintentos, duplicados y errores de validación.

## Initiator

- **Requested by:** human
- **Date:** 2026-05-19
- **Related planning:** `006-roadmap-r5-online-core`

## Next Step

- [ ] Ejecutar scopes solo cuando R5 esté cerrado.

### Open Questions

- ¿Qué comandos entran en la primera cola offline: solo partidas completadas o también recompensas y preferencias?

