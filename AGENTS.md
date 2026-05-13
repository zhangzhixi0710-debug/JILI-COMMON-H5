# Repository Guidelines

## Project Structure & Module Organization
This repository is a Vue 2 + Vue CLI H5 project. Main code lives in `src/`.
- `src/pages/`: page-level views.
- `src/components/`: reusable UI components.
- `src/api/`: API request wrappers.
- `src/router/`, `src/store/`, `src/i18n/`: routing, state, and localization.
- `src/utils/`, `src/mixins/`, `src/constants/`: shared helpers and constants.
- `src/assets/`: static assets imported by source code.
- `public/index.html`: HTML template entry.

Keep feature changes localized: page logic in `pages`, shared logic in `components`/`utils`, and network access in `api`.

## Build, Test, and Development Commands
Install dependencies:
```bash
npm install
```
Run local dev server (hot reload):
```bash
npm run serve
```
Build bundles:
```bash
npm run build
npm run build:dev
npm run build:test
npm run build:prod
```
Quality and formatting:
```bash
npm run lint
npm run format
```
Use `build:test` before QA deployments and `build:prod` for release artifacts.

## Coding Style & Naming Conventions
- Use UTF-8 (no BOM) for all files.
- Use 4 spaces (no tabs), semicolons, double quotes, max line length 100.
- Follow ESLint + Prettier config in `.eslintrc.js` and `.prettierrc`.
- Vue SFC naming: components in PascalCase (e.g., `UserCard.vue`), route pages by feature path (e.g., `pages/order/List.vue`).
- JS identifiers: `camelCase`; constants: `UPPER_SNAKE_CASE`.

## Testing Guidelines
There is currently no dedicated `npm test` script in this snapshot. Minimum validation for each change:
- `npm run lint`
- `npm run build:test` (or `npm run build`)
- Manual verification on affected pages and flows.

If adding tests, place unit tests under `tests/unit/` with `*.spec.js` naming.

## Commit & Pull Request Guidelines
Git history metadata is not available in this workspace snapshot, so follow Conventional Commits:
- `feat: ...`, `fix: ...`, `refactor: ...`, `chore: ...`

PRs should include:
- Scope and purpose.
- Linked issue/task ID.
- Screenshots or screen recordings for UI changes.
- Validation evidence (lint/build/manual test notes).

## Agent-Specific Notes
- Keep changes minimal and module-scoped.
- Do not mix refactors with business fixes in one PR.
- Update related docs/config when behavior or scripts change.
