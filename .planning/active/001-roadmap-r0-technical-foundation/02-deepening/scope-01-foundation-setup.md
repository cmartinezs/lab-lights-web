# DEEPENING: Scope 01 - Foundation setup

> **Status:** DONE  
> [← 01-expansion.md](../01-expansion.md)

## Objective

Dejar preparada la base técnica del frontend y su validación mínima, sin implementar gameplay completo.

## Tasks

| # | Task | Workflow | Status | Output |
|---|---|---|---|---|
| 1 | Generar scaffold React + TypeScript + Vite cuando se autorice ejecución | GENERATE-DOCUMENT | DONE | `src/`, `package.json`, configuración Vite |
| 2 | Configurar Tailwind CSS con tokens base y responsive mobile first | EXPAND-ELEMENT | DONE | `tailwind.config.ts`, estilos base |
| 3 | Integrar Anime.js mediante helpers/hooks acotados | EXPAND-ELEMENT | DONE | `src/shared/motion/createTimeline.ts` |
| 4 | Crear estructura `app`, `game`, `profile`, `rankings`, `shared` con capas por feature | GENERATE-DOCUMENT | DONE | árbol `src/` |
| 5 | Configurar scripts esperados: `dev`, `lint`, `typecheck`, `test`, `build` | GENERATE-DOCUMENT | DONE | `package.json` |
| 6 | Configurar pre-commit para formato/lint rápido | GENERATE-DOCUMENT | DONE | `.githooks/pre-commit` |
| 7 | Revisar coherencia con specs y roadmap | REVIEW-COHERENCE | DONE | lint, typecheck, test y build ejecutados |
| 8 | Actualizar trazabilidad de términos nuevos | UPDATE-TRACEABILITY | DONE | `TRACEABILITY.md` |

## Done Criteria

- [x] La app levanta localmente.
- [x] Existe sistema visual base y componentes atómicos iniciales.
- [x] CI mínimo queda preparado o documentado.
- [x] Existe una pantalla navegable validable en mobile y desktop.
- [x] `TRACEABILITY.md` actualizado con términos nuevos.

## Inconsistencies Found

| # | Description | Docs Involved | Status | Resolution Path |
|---|---|---|---|---|
| 1 | `npm prepare` no pudo ejecutar `git config core.hooksPath .githooks` porque `.git` no es un directorio Git válido en este workspace. | `.githooks/pre-commit`, workspace Git | RECORDED | Ejecutar `git init` o restaurar `.git` válido antes de activar hooks. |

## Residuals

| # | Description | Deferred To | Status |
|---|---|---|
| 1 | Activación efectiva de hooks Git | Repo Git válido | PENDING |
