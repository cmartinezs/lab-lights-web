# Repository Guidelines

## Project Structure & Module Organization

This repository currently contains product and technical planning for **Luces del Laboratorio**.

- `.raw/` contains source specifications and roadmap drafts.
- `.raw/specs/` contains split specs by responsibility: product rules, frontend, backend, transversal architecture, and glossary.
- `.planning/` contains planning workflow templates and contributor guidance.
- Future frontend code should follow the spec structure: `src/app`, feature folders such as `src/game`, `src/profile`, `src/rankings`, and shared utilities in `src/shared`.
- Future tests should live near their feature when unit/component scoped, with end-to-end tests in `tests/e2e/`.

## Build, Test, and Development Commands

No executable app scaffold is present yet. Do not invent commands until `package.json` exists. Once the React/Vite app is added, expected commands are:

- `npm run dev`: run the local Vite dev server.
- `npm run lint`: run frontend lint checks.
- `npm run typecheck`: run TypeScript validation.
- `npm run test`: run unit/component tests.
- `npm run build`: create a production build.

For documentation-only changes, review Markdown manually and keep links relative.

## Coding Style & Naming Conventions

Use TypeScript strict mode for future application code. Organize features by layers: `domain`, `application`, `ui`, and `infra`. Build UI from smaller reusable pieces toward larger screens: `NanoComponent`, `MicroComponent`, `Component`, `Section`, `Page`, `Layout`.

Use Tailwind CSS for styling and Anime.js only for intentional game/UI sequences. Prefer clear names, small functions, and domain logic outside React components.

## Testing Guidelines

Planned frontend testing stack: Vitest, Testing Library, and Playwright. Unit tests should cover pure game rules first: board inversion, adjacency, victory, seeds, scoring, and mode constraints. Name tests after behavior, for example `board.test.ts` or `GameBoard.test.tsx`.

End-to-end tests should cover core flows: start game, win, lose, continue, rankings, login, and offline sync when implemented.

## Commit & Pull Request Guidelines

Git history is not available in this workspace, so no repository-specific commit convention can be inferred. Use concise imperative commit messages, for example `Add pre-roadmap for incremental releases`.

Pull requests should include:

- Summary of changes.
- Affected specs or modules.
- Test results, or a note when changes are documentation-only.
- Screenshots or short recordings for UI changes.
- Linked issue or planning item when applicable.

## Agent-Specific Instructions

Do not edit generated IDE files in `.idea/`. Keep `.raw/` specs authoritative and update `.raw/luces_laboratorio_spec.md` when adding new top-level planning documents.

When writing Spanish content, preserve Spanish orthography. Do not omit `ñ`, opening punctuation when appropriate, or accent marks in words that require them, for example `planificación`, `técnico`, `mínimo`, and `sincronización`.
