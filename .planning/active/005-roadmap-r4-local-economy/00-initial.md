# INITIAL: R4 - Economía local

> **Status:** Initial written  
> [← active/README.md](../README.md)

## Intent

Incorporar progresión local mediante monedas, power-ups, continuaciones y mejoras permanentes iniciales.

## Why

La economía local aumenta retención y permite modelar elegibilidad ranked/casual antes de conectar online.

## Approximate Scope

- [ ] `src/game/domain/` — penalizaciones, elegibilidad y eventos de ayudas.
- [ ] `src/profile/` — saldo local y mejoras permanentes.
- [ ] Futuro `src/shop/` — tienda local.
- [ ] `src/game/infra/` — historial de transacciones local.

## Initiator

- **Requested by:** human
- **Date:** 2026-05-19
- **Related planning:** `004-roadmap-r3-base-variants`

## Next Step

- [ ] Ejecutar scopes solo cuando R3 esté cerrado.

### Open Questions

- ¿El ledger local debe ser append-only desde R4 o basta historial simple hasta R5/R6?

