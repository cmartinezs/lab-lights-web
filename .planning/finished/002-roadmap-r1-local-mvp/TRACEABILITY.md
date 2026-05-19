# Traceability: R1 - MVP local

> [← README.md](README.md)

## Term Matrix

| Term / Concept | R | S | V | T | W | Notes |
|---|---|---|---|---|---|---|
| Classic 3x3 | ✅ | ✅ | ✅ | ✅ | ✅ | MVP local implementado |
| Tablero | ✅ | ✅ | ✅ | ✅ | ✅ | Reglas puras en `src/game/domain/board.ts` |
| Seed local | ✅ | N/A | ✅ | ✅ | ✅ | Seed determinística local para Classic 3x3 |
| Resultado | ✅ | ✅ | ✅ | ✅ | ✅ | Puntaje simple en `ResultPanel` modal |
| Iniciales arcade | ✅ | ✅ | ✅ | ✅ | ✅ | Grabación local mínima de resultado con iniciales |
| Historial local de tableros | ✅ | ✅ | ✅ | ✅ | ✅ | Seed actual y seeds jugadas en `localStorage` |
| Temporizador Classic | ✅ | ✅ | ✅ | ✅ | ✅ | Visible como minutos:segundos.décimas |
| Ranking local modal | ✅ | ✅ | ✅ | ✅ | ✅ | Acceso desde botón superior, ordenado por puntaje y tiempo |

## Decisions Made

| ID | Decision | Rationale | Affects | Date |
|---|---|---|---|---|
| R1-D1 | Planificación escrita sin ejecución | El usuario solicitó no comenzar implementación | W | 2026-05-19 |
| R1-D2 | R1 ejecutado en rama feature desde `develop` | El flujo GitFlow requiere implementar features desde `develop` | V / T / W | 2026-05-19 |
| R1-D3 | Resultado como modal y registro local mínimo | La victoria debe aparecer sobre el tablero y permitir grabar iniciales sin backend | S / V / T | 2026-05-19 |

## Residuals

| ID | Term / Issue | Blocker | Status | Target Resolution |
|---|---|---|---|---|
| R1-R1 | Solvencia garantizada fuera de Classic 3x3 local | Classic 3x3 usa seed reproducible basada en movimientos; faltan reglas generales para tamaños/modos futuros | PENDING | R3 o R5 |
