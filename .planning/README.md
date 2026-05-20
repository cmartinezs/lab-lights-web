# 📋 Planning

Central directory for all project plannings. Every planning follows a three-phase lifecycle and maintains its own term traceability matrix.

> For detailed structure, lifecycle, and naming conventions, see [`GUIDE.md`](GUIDE.md).

---

## 🚨 Fundamental Rule

> **Nothing is executed without being inside a planning.**

Before performing any action in this repository — generating a phase document, modifying a template, refactoring a guide, updating a process — there must be a task in a scope of an active planning that covers it.

### Bypass Parameters

When a prompt contains one of these parameters (at the start or end):

| Parameter | Behavior |
|-----------|----------|
| `--no-plan` | Ask: *"Are you sure you want to proceed without a planning entry?"*. If confirmed → execute. If not → do nothing. |
| `--no-plan-force` | Execute directly without asking or planning. |

**If something is requested that is not in any planning (and without a bypass parameter):**
1. Stop execution.
2. Ask: is this part of an existing planning or a new one?
3. If part of an existing one → identify which scope and task it belongs to, and wait for the flow to reach it.
4. If it's new → create the planning (at minimum the Initial phase) before executing.

---

## 📂 Plannings

> **In progress** (EXPANSION / DEEPENING): [`active/`](active/README.md) · **Completed**: [`finished/`](finished/README.md)

### 🚧 In Progress → see [`active/README.md`](active/README.md)

| ID | Prefijo | Nombre | Prioridad |
|----|---------|--------|-----------|
| [003](active/003-roadmap-r2-local-mvp-plus/README.md) | R2 | MVP+ local | Secuencial / MVP+ |
| [005](active/005-roadmap-r4-local-economy/README.md) | R4 | Economía local | Secuencial |
| [006](active/006-roadmap-r5-online-core/README.md) | R5 | Online core | Secuencial / Beta competitiva |
| [007](active/007-roadmap-r6-sync-resilience/README.md) | R6 | Sincronización y resiliencia | Secuencial |
| [008](active/008-roadmap-r7-advanced-modes/README.md) | R7 | Modos avanzados | Secuencial |
| [009](active/009-roadmap-r8-daily-liveops/README.md) | R8 | Daily y live ops | Secuencial |
| [010](active/010-roadmap-r9-endgame/README.md) | R9 | Endgame | Secuencial / Cierre |

### ✅ Completed → see [`finished/README.md`](finished/README.md)

| ID | Prefijo | Nombre | Fecha cierre |
|----|---------|--------|--------------|
| [001](finished/001-roadmap-r0-technical-foundation/README.md) | R0 | Fundación técnica | 2026-05-19 |
| [002](finished/002-roadmap-r1-local-mvp/README.md) | R1 | MVP local | 2026-05-19 |
| [004](finished/004-roadmap-r3-base-variants/README.md) | R3 | Variantes base | 2026-05-20 |

---

## 🔄 Workflows

Every task within a planning follows a defined workflow. The complete catalog of workflows and sub-workflows is in [`WORKFLOWS/README.md`](WORKFLOWS/README.md).

Workflow types are referenced in the **Workflow** field of each task within a scope.

For the vocabulary of the planning system, see the **[`GLOSSARY.md`](GLOSSARY.md)** — operational glossary (planning, scope, workflow, PDR, done, etc.).

---
