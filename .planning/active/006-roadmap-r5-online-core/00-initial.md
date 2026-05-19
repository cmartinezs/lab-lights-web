# INITIAL: R5 - Online core

> **Status:** Initial written  
> [← active/README.md](../README.md)

## Intent

Agregar cuenta, API Go, Supabase, validación de partidas y ranking online inicial.

## Why

La beta competitiva requiere servidor autoritativo, contrato OpenAPI y ranking online antes de Daily o sincronización completa.

## Approximate Scope

- [ ] `lab-lights-api` — API Go, Supabase, OpenAPI y validación básica.
- [ ] `lab-lights-web` — login, envío de puntaje y ranking online.
- [ ] Contratos — OpenAPI versionado y cliente generado.
- [ ] CI/e2e — smoke contra staging o mock contractual.

## Initiator

- **Requested by:** human
- **Date:** 2026-05-19
- **Related planning:** `005-roadmap-r4-local-economy`

## Next Step

- [ ] Ejecutar scopes solo cuando R4 esté cerrado y exista repo/API objetivo.

### Open Questions

- ¿La autenticación se implementará primero con Supabase Auth completo o mock contractual para frontend?

