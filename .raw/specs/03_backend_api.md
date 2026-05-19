# Luces del Laboratorio — Especificación Backend API

**Versión:** 1.5  
**Fecha:** Mayo 2026  
**Responsabilidad:** Backend  
**Repo destino:** `lab-lights-api`

---

## Propósito

Este documento contiene las responsabilidades del backend: API Go, validación autoritativa de partidas, economía, rankings online, usuarios, persistencia, Supabase, CQRS, seguridad de datos, idempotencia y pruebas backend. La UI y experiencia visual pertenecen al frontend.

---

## Sistema de rankings y leaderboards

### Ranking local fuera de alcance

El ranking local vive en el dispositivo y es responsabilidad del frontend. El backend no lo almacena, valida ni sincroniza salvo cuando el usuario decide enviar una partida elegible al ranking online.

### Ranking online

- Requiere usuario registrado.
- Servidor centralizado recibe y valida puntajes.
- El cliente envía al servidor: user_id, modo, tamaño, puntaje, movimientos, tiempo, seed del tablero, power-ups usados, continuaciones usadas, reordenamientos usados, hash de verificación.
- El servidor puede **rechazar** puntajes que no pasen la validación (ver sección 5.4).

### Estructura de rankings online

Hay un ranking separado por cada combinación significativa de modo y configuración:

| Ranking | Descripción |
|---|---|
| Classic · Global | Todos los tamaños, sin restricciones |
| Classic · 3×3 | Solo tableros 3×3 |
| Classic+ · Blind | Modo ciego, cualquier tamaño |
| Classic+ · Time Attack · 3×3 | Time Attack en 3×3 |
| Classic+ · Time Attack · NxM | Un ranking por tamaño de tablero |
| Classic+ · Move Limit · NxM | Un ranking por tamaño |
| Chaos · Global | Cualquier tamaño |
| Mirror · Horizontal/Vertical/Ambos | Un ranking por eje |
| Chain Reaction · Global | Cualquier tamaño |
| Daily Challenge | Un ranking por fecha |
| Puzzle · NombrePuzzle | Un ranking por puzzle individual |
| All-Time | Puntaje más alto histórico, todos los modos |

### Validación de puntajes (anti-cheat básico)

- La seed del tablero inicial se registra junto al puntaje.
- El servidor puede reproducir la partida con la misma seed para verificar que los movimientos sean coherentes con el resultado.
- Puntajes con tiempo imposiblemente corto (< umbral mínimo calculado por tamaño) son rechazados automáticamente.
- Los power-ups usados se descuentan del multiplicador esperado; una discrepancia invalida el puntaje.
- Las continuaciones y reordenamientos usados deben coincidir con el tipo de ranking al que se intenta enviar la partida.

### Visibilidad del ranking

- El backend solo es responsable de rankings online.
- **Vista online global:** Top 100 por modo.
- **Vista semanal:** Top 20 de la semana, se resetea cada lunes.
- **Vista de amigos:** (futuro) filtro para ver solo usuarios seguidos.
- El ranking local es responsabilidad del frontend y del almacenamiento del dispositivo.

---

## Sistema de usuarios online

### Modo online (con registro)

- El jugador crea una cuenta con: nombre de usuario (único), correo electrónico, contraseña.
- El nombre de usuario se muestra en los rankings online.
- El perfil online sincroniza: historial de partidas, puntajes, monedas acumuladas, power-ups permanentes desbloqueados.
- Al vincular un perfil local a una cuenta online, las monedas locales se migran (una sola vez).

### Datos del perfil online

| Campo | Responsabilidad backend |
|---|---|
| Nombre de usuario | Identidad visible y única |
| Historial de puntajes | Últimas 500 partidas o política vigente |
| Monedas | Saldo sincronizado y ledger transaccional |
| Power-ups permanentes | Inventario sincronizado |
| Estadísticas globales | Agregados online |
| Ranking global | Participación en rankings online |
| Daily Challenge | Estado competitivo validado por servidor |

### Estadísticas online

El backend calcula o proyecta las siguientes estadísticas:

- Total de partidas jugadas (por modo).
- Total de victorias / derrotas.
- Porcentaje de victorias.
- Mejor puntaje por modo.
- Promedio de movimientos por victoria.
- Promedio de tiempo por victoria.
- Racha más larga de días consecutivos jugando.
- Monedas totales ganadas (historial acumulado, no saldo actual).
- Power-ups usados en total.
- Continuaciones usadas.
- Reordenamientos solicitados.
- Logros/hitos completados por ámbito local y online.

---

## Persistencia online

El servidor mantiene:
- Perfiles de usuario (autenticación, datos del perfil).
- Partidas registradas (con datos de validación).
- Rankings globales y semanales.
- Estado del Daily Challenge por usuario y fecha.
- Saldo y transacciones de monedas (log completo para auditoría).
- Hitos, logros y recompensas reclamadas.
- Eventos de continuación, power-ups y reordenamiento para validación.

### Sincronización offline-online

- El juego debe ser **completamente jugable sin conexión** en todos los modos excepto los que requieran ranking online.
- Las partidas jugadas offline con usuario logueado se encolan y sincronizan cuando se recupera la conexión.
- El Daily Challenge offline no cuenta para el ranking online (para evitar manipulación), pero sí otorga monedas locales.
- Los hitos locales se pueden reclamar offline. Los hitos online solo se reclaman tras validación del servidor.

---

## Backend Go

Buenas prácticas:
- Organizar por dominio/capacidad, no por tipo técnico global.
- Mantener handlers HTTP delgados: parsean, validan entrada superficial, llaman casos de uso y serializan respuesta.
- El dominio debe usar errores explícitos y tipos fuertes para evitar estados inválidos.
- Usar `context.Context` en operaciones de IO.
- Definir interfaces en el lado consumidor, especialmente para repositorios, reloj, generador de IDs y publicador de eventos.
- Validar partidas en servidor reproduciendo seed, movimientos, power-ups, continuaciones y reordenamientos.
- Registrar transacciones de monedas como ledger append-only; no mutar saldo sin evento transaccional.
- Usar migraciones versionadas para Supabase/PostgreSQL.
- Exponer endpoints idempotentes para reclamar recompensas y sincronizar partidas offline.

Estructura sugerida:

```
internal/
  game/
    domain/
    application/
    ports/
    adapters/
  economy/
  rankings/
  profile/
  platform/
    http/
    postgres/
    supabase/
    config/
```

## Supabase estilo CQRS

Supabase se usa principalmente como PostgreSQL administrado, autenticación, políticas de seguridad y realtime. El backend Go conserva la autoridad sobre reglas críticas.

**Command side (escrituras):**
- Enviar comandos al backend Go: crear partida, finalizar partida, registrar movimientos, reclamar recompensa, gastar monedas.
- Validar permisos, consistencia, idempotencia y reglas de negocio en Go.
- Persistir cambios en tablas normalizadas y transaccionales.
- Emitir eventos de dominio (`game_completed`, `coins_earned`, `reward_claimed`, `score_validated`).

**Query side (lecturas):**
- Mantener vistas/materializaciones para rankings, perfil, historial y recompensas pendientes.
- Optimizar lecturas para UI sin afectar modelo transaccional.
- Usar Supabase Realtime solo para actualizaciones no críticas: rankings, estado de sincronización, eventos visuales.

**Políticas:**
- Activar Row Level Security en tablas expuestas directamente.
- No exponer tablas sensibles de economía, validación anti-cheat o ledger para escritura directa desde cliente.
- Usar funciones SQL o RPC solo para operaciones simples y seguras; reglas complejas deben vivir en Go.

## Modelo CQRS mínimo

Tablas transaccionales sugeridas:
- `profiles`
- `games`
- `game_events`
- `score_submissions`
- `coin_ledger`
- `reward_claims`
- `powerup_inventory`

Lecturas/proyecciones sugeridas:
- `leaderboard_global_view`
- `leaderboard_weekly_view`
- `profile_stats_view`
- `pending_rewards_view`
- `daily_challenge_status_view`

Cada comando debe tener `command_id` para idempotencia. Cada evento debe tener `event_id`, `aggregate_id`, `event_type`, `payload`, `created_at` y versión de esquema.

## Contratos API

La API debe versionarse desde el inicio:

```
POST /v1/games
POST /v1/games/{id}/moves
POST /v1/games/{id}/power-ups
POST /v1/games/{id}/continue
POST /v1/games/{id}/finish
POST /v1/rewards/{id}/claim
GET  /v1/rankings
GET  /v1/profile/me
```

Los contratos deben definirse con OpenAPI en `lab-lights-api`. El frontend debe consumir tipos generados o contratos validados para evitar divergencias entre cliente y servidor. No se deben copiar manualmente DTOs entre repositorios.

---

## Resiliencia y cache backend

- Todos los comandos críticos deben ser idempotentes mediante `command_id`.
- Usar timeouts por request y por dependencia; ninguna llamada externa debe bloquear indefinidamente.
- Implementar retries solo para errores transitorios y solo cuando la operación sea idempotente.
- Usar circuit breakers o degradación controlada ante fallas de Supabase, realtime o servicios auxiliares.
- Separar errores de negocio, validación, concurrencia, dependencia y sistema.
- Proteger endpoints con rate limiting y límites de payload.
- Cachear lecturas frecuentes de bajo riesgo: catálogos, configuración remota, rankings públicos y estado de Daily Challenge.
- No cachear saldos de monedas, inventario consumible, validaciones anti-cheat ni resultados de comandos sin estrategia explícita de invalidación.


---

## Resiliencia y cache Supabase/PostgreSQL

- Usar índices adecuados para rankings, historial, `user_id`, `created_at`, `mode`, `score` y `command_id`.
- Mantener constraints únicas para idempotencia, por ejemplo `command_id`, `reward_id` por usuario y submissions por partida.
- Usar transacciones para economía, recompensas y finalización de partida.
- Usar vistas/materialized views para query side de CQRS cuando la lectura lo justifique.
- Definir política de refresco de materialized views: por evento, por intervalo o bajo demanda, según frescura requerida.
- Evitar triggers complejos con reglas de negocio difíciles de testear; preferir eventos y handlers en Go.
- Preparar backups, migraciones reversibles cuando sea posible y pruebas de restore en staging.


---

## Testing backend

- Unit tests con `go test ./...` para dominio, casos de uso y servicios de aplicación.
- Pruebas de integración contra PostgreSQL/Supabase local o contenedor.
- Verificar migraciones, constraints, RLS, idempotencia y transacciones.
- Validar que comandos duplicados no cobren monedas ni reclamen recompensas dos veces.
- Casos obligatorios: inversión de salas, adyacencias, seeds, victoria/derrota, puntuación, monedas, continuaciones, reordenamiento, logros y validación anti-cheat.


---

## CI mínimo backend (`lab-lights-api`)

- `go test ./...`
- `go vet ./...`
- `gofmt` / `goimports`
- Migraciones Supabase contra entorno local/staging.
- Análisis SonarQube.
- Publicación de contrato OpenAPI versionado.
