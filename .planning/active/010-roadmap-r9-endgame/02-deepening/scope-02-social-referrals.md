# DEEPENING: Scope 02 - Social & Referral System

> **Status:** PENDING  
> [← 01-expansion.md](../01-expansion.md)

## Objective

Implementar un sistema social basado en referidos: código único por usuario, agregar amigos via código o QR, y lanzar desafíos directos entre amigos.

## Context

El `referral_code` único por usuario se genera en R5 (Supabase Auth). Este scope construye sobre esa base para añadir las relaciones sociales y los flujos de desafío.

## Tasks

| # | Task | Workflow | Status | Output |
|---|---|---|---|---|
| 1 | Mostrar código de referido en perfil con opción de copiar al portapapeles | GENERATE-DOCUMENT | PENDING | UI perfil |
| 2 | Generar QR del código de referido para compartir | GENERATE-DOCUMENT | PENDING | pantalla "Compartir" |
| 3 | Implementar flujo de ingreso de código: pantalla "Agregar amigo" con input manual + lector QR | GENERATE-DOCUMENT | PENDING | pantalla "Agregar amigo" |
| 4 | Endpoint y tabla `friendships` en Supabase (pending / accepted / blocked) | GENERATE-DOCUMENT | PENDING | esquema y API |
| 5 | Pantalla lista de amigos con estado de conexión y puntajes recientes | GENERATE-DOCUMENT | PENDING | pantalla "Amigos" |
| 6 | Implementar envío y recepción de desafíos (modo + configuración + seed fija) | GENERATE-DOCUMENT | PENDING | tabla `challenges` y notificación |
| 7 | Pantalla de desafío activo: muestra el reto del amigo y permite aceptar/jugar | GENERATE-DOCUMENT | PENDING | pantalla "Desafío" |
| 8 | Mostrar resultado comparativo del desafío (tu puntaje vs. el del amigo) | GENERATE-DOCUMENT | PENDING | pantalla "Resultado desafío" |
| 9 | Notificaciones push/in-app para desafíos recibidos y resultados | GENERATE-DOCUMENT | PENDING | sistema de notificaciones |
| 10 | Validar flujos e2e: referido → amistad → desafío → resultado | REVIEW-COHERENCE | PENDING | reporte |
| 11 | Actualizar trazabilidad | UPDATE-TRACEABILITY | PENDING | `TRACEABILITY.md` |

## Done Criteria

- [ ] Cada usuario tiene un código de referido visible y copiable en su perfil.
- [ ] Se puede compartir el código via QR generado en el cliente.
- [ ] Un usuario puede agregar a otro escaneando su QR o ingresando el código manualmente.
- [ ] La lista de amigos muestra estado, puntaje reciente y permite enviar desafíos.
- [ ] Un desafío usa la misma seed y configuración para ambos jugadores; el ganador es el de mayor puntaje.
- [ ] El resultado del desafío muestra el comparativo entre ambos.
- [ ] Notificaciones funcionales (in-app mínimo; push como mejora).
- [ ] `TRACEABILITY.md` actualizado con términos nuevos.

## Inconsistencies Found

| # | Description | Docs Involved | Status | Resolution Path |
|---|---|---|---|---|
| — | *None yet* | — | — | — |

## Residuals

| # | Description | Deferred To | Status |
|---|---|---|
| Torneos entre grupos de amigos | Futuro post-1.0 | PENDING |
| Rankings privados de grupos de amigos | Futuro post-1.0 | PENDING |
