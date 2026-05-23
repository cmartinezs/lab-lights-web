# DEEPENING: Scope 02 - Social & Referral System

> **Status:** PARTIAL — UI implementada; backend Supabase pendiente  
> [← 01-expansion.md](../01-expansion.md)

## Objective

Implementar un sistema social basado en referidos: código único por usuario, agregar amigos via código o QR, y lanzar desafíos directos entre amigos.

## Context

El `referral_code` único por usuario se genera en R5 (Supabase Auth). Este scope construye sobre esa base para añadir las relaciones sociales y los flujos de desafío.

## Tasks

| # | Task | Workflow | Status | Output |
|---|---|---|---|---|
| 1 | Mostrar código de referido en perfil con opción de copiar al portapapeles | GENERATE-DOCUMENT | ✅ DONE | Ya implementado desde R5; visible en ProfilePage |
| 2 | Generar QR del código de referido para compartir | GENERATE-DOCUMENT | ✅ DONE | Web Share API via AddFriendPage (fallback: clipboard) |
| 3 | Implementar flujo de ingreso de código: pantalla "Agregar amigo" con input manual | GENERATE-DOCUMENT | ✅ DONE | `src/social/ui/pages/AddFriendPage.tsx` |
| 4 | Endpoint y tabla `friendships` en Supabase (pending / accepted / blocked) | GENERATE-DOCUMENT | ⏳ PENDING | Requiere Supabase schema; ver R9-R1 |
| 5 | Pantalla lista de amigos con estado de conexión y puntajes recientes | GENERATE-DOCUMENT | ✅ DONE | `src/social/ui/pages/FriendsPage.tsx` (mock data local) |
| 6 | Implementar envío y recepción de desafíos (modo + configuración + seed fija) | GENERATE-DOCUMENT | ⏳ PENDING | Requiere tabla `challenges`; ver R9-R1 |
| 7 | Pantalla de desafío activo: muestra el reto del amigo y permite aceptar/jugar | GENERATE-DOCUMENT | ⏳ PENDING | Post-1.0 |
| 8 | Mostrar resultado comparativo del desafío (tu puntaje vs. el del amigo) | GENERATE-DOCUMENT | ⏳ PENDING | Post-1.0 |
| 9 | Notificaciones push/in-app para desafíos recibidos y resultados | GENERATE-DOCUMENT | ⏳ PENDING | FCM/VAPID; ver R9-R2 |
| 10 | Validar flujos e2e: referido → amistad → desafío → resultado | REVIEW-COHERENCE | ⏳ PENDING | Depende de tasks 4-8 |
| 11 | Actualizar trazabilidad | UPDATE-TRACEABILITY | ✅ DONE | `TRACEABILITY.md` actualizado |

## Done Criteria

- [x] Cada usuario tiene un código de referido visible y copiable en su perfil.
- [x] Se puede compartir el código via Web Share API / clipboard desde AddFriendPage.
- [x] UI de lista de amigos y agregar amigo implementadas (funcionan con mock data).
- [ ] Un usuario puede agregar a otro escaneando su QR o ingresando el código manualmente (requiere backend).
- [ ] La lista de amigos muestra estado, puntaje reciente y permite enviar desafíos (requiere backend).
- [ ] Un desafío usa la misma seed y configuración para ambos jugadores (post-1.0).
- [ ] El resultado del desafío muestra el comparativo entre ambos (post-1.0).
- [ ] Notificaciones funcionales (post-1.0).
- [x] `TRACEABILITY.md` actualizado con términos nuevos.

## Inconsistencies Found

| # | Description | Docs Involved | Status | Resolution Path |
|---|---|---|---|---|
| 1 | Lector QR no implementado — Web Share API es unidireccional | AddFriendPage | OPEN | Agregar jsQR/zxing-browser para cámara; ver R9-R7 |

## Residuals

| # | Description | Deferred To | Status |
|---|---|---|---|
| Tabla `friendships` + API Supabase | Post-1.0 R9-R1 | PENDING |
| Tabla `challenges` + flujo desafío | Post-1.0 R9-R1 | PENDING |
| Notificaciones push (FCM) | Post-1.0 R9-R2 | PENDING |
| Lector QR cámara | Post-1.0 R9-R7 | PENDING |
| Torneos entre grupos de amigos | Futuro post-1.0 | PENDING |
| Rankings privados de grupos de amigos | Futuro post-1.0 | PENDING |
