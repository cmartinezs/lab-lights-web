# DEEPENING: Scope 02 - Board Integrity (Anti-hacking)

> **Status:** DONE — cerrado 2026-05-20  
> [← 01-expansion.md](../01-expansion.md)

## Objective

Detectar y rechazar resultados obtenidos manipulando el DOM, el estado de React o localStorage, sin afectar la experiencia del jugador legítimo.

## Threat Model

| Amenaza | Vector | Facilidad | Impacto | Mitigación principal |
|---|---|---|---|---|
| Manipulación DOM | DevTools → cambiar `aria-pressed`, clases CSS | Baja | Nulo* | Arquitectura React (estado no deriva del DOM) |
| React DevTools state injection | Extension → modificar `useState` del board | Media | Alto | Validación por replay de secuencia de movimientos |
| localStorage injection | DevTools → crear/editar registros de puntuación | Alta | Alto | Firma HMAC ligera sobre campos clave del resultado |
| Tiempo manipulado | SO / DevTools → congelar/acelerar reloj | Baja | Medio | Validación de plausibilidad temporal por movimiento |
| Seed + moves fabricados | Manipulación directa del objeto de sesión | Alta | Alto | Replay del juego completo desde seed en victoria |

> *La arquitectura React ya protege contra manipulación DOM pura: los clicks en celdas llaman `applyMove()` que modifica `GameSession` (React state), y la UI es un reflejo del estado. Cambiar el DOM directamente no modifica el estado y será sobreescrito en el siguiente render.

## Core Defense: Move-Sequence Integrity

El mecanismo central es **replay de movimientos**: al ganar, se reproducen todos los movimientos registrados desde el seed para verificar que el tablero resultante coincide con el estado ganador declarado.

```
seed → createBoardFromSeed(seed) → apply(move₁) → … → apply(moveₙ) → ¿isVictory()?
```

Si el replay no produce victoria, el resultado se marca como inválido y no accede al ranking ni cobra monedas.

## Tasks

| # | Task | Workflow | Status | Output |
|---|---|---|---|---|
| 1 | Agregar `moveSequence: CellPosition[]` a `GameSession` | EXPAND-ELEMENT | DONE | `gameSession.ts` — registro acumulativo de movimientos |
| 2 | Implementar `verifyBoardIntegrity(session)` | GENERATE-DOCUMENT | DONE | `gameSession.ts` — replay desde seed, retorna `boolean` |
| 3 | Agregar `verified: boolean` a `GameResultRecord` | EXPAND-ELEMENT | DONE | `gameLocalStore.ts` |
| 4 | Llamar `verifyBoardIntegrity` en victoria antes de acreditar monedas | EXPAND-ELEMENT | DONE | `GamePage.tsx` → `ResultPage.tsx` — si `!verified`, no acreditar coins ni mostrar botón ranking |
| 5 | Firma HMAC-SHA256 ligera sobre resultado (seed + score + moves) | GENERATE-DOCUMENT | DONE | `integrityService.ts` — `Web Crypto API`; firma almacenada async en background |
| 6 | Filtrar por `verified !== false` al leer resultados del ranking | EXPAND-ELEMENT | DONE | `gameLocalStore.ts` — `loadAllModeResults` filtra records marcados como inválidos |
| 7 | Plausibility check de timestamps (velocidad mínima por movimiento) | EXPAND-ELEMENT | DONE | `gameSession.ts` — `MIN_MS_PER_MOVE = 200`, mínimo 100ms total para activar |
| 8 | Tests de integridad: replay válido, replay alterado, firma inválida | GENERATE-DOCUMENT | DONE | `boardIntegrity.test.ts` — 9 tests (replay, plausibilidad, HMAC) |
| 9 | Revisar coherencia y trazabilidad | REVIEW-COHERENCE / UPDATE-TRACEABILITY | DONE | revisión y `TRACEABILITY.md` actualizados |

## Implementation Notes

### `moveSequence` accumulation

En `applyMove`, acumular la posición en la secuencia:
```typescript
moveSequence: [...session.moveSequence, position],
```

### `verifyBoardIntegrity`

```typescript
export function verifyBoardIntegrity(session: GameSession): boolean {
  if (session.status !== 'won') return false;
  // Replay from scratch
  const { board: initial } = createBoardFromSeed(session.seed, session.config.size);
  const finalBoard = session.moveSequence.reduce(
    (b, pos) => toggleCellAndAdjacent(b, pos),
    initial,
  );
  return isVictory(finalBoard);
}
```

### HMAC-SHA256 (Web Crypto API)

```typescript
const key = await crypto.subtle.importKey('raw', keyBytes, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
const sig  = await crypto.subtle.sign('HMAC', key, encoder.encode(`${seed}:${score}:${moves}`));
```

La clave puede ser una constante del bundle (ofuscada). No es seguridad perfecta, pero eleva el costo de hacking casual a "requiere desensamblado del bundle".

### Timestamp plausibility

```typescript
const MIN_MS_PER_MOVE = 200; // ~5 clicks/second absolute max
if (session.elapsedMilliseconds / session.moves < MIN_MS_PER_MOVE) return false;
```

## Done Criteria

- [x] Un tablero ganado por replay de movimientos reales supera la verificación.
- [x] Un resultado con `moveSequence` alterada es rechazado por `verifyBoardIntegrity`.
- [x] Records con `verified === false` no aparecen en el ranking (filtro en `loadAllModeResults`).
- [x] El tiempo total / número de movimientos no viola el umbral mínimo.
- [x] Tests cubren escenarios válidos e inválidos (52 tests verdes).

## Inconsistencies Found

| # | Description | Docs Involved | Status | Resolution Path |
|---|---|---|---|---|
| — | *None yet* | — | — | — |

## Residuals

| # | Description | Deferred To | Status |
|---|---|---|
| Validación server-side de resultados | R5 (online core) | PENDING |
| Rate limiting de envío de scores al backend | R5 | PENDING |
| Anti-tamper en power-ups (verificar gasto real de monedas) | R5 | PENDING |
