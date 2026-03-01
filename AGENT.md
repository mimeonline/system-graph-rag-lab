# Agent Instructions

## Package Management & Workspace
- **Package Manager:** You MUST use `pnpm` for all dependency installations and script executions. Do not use `npm` or `yarn`.
- **Working Directory:** All next.js application commands (e.g., `pnpm install`, `pnpm run dev`, `pnpm run typecheck`, `pnpm run build`) MUST be executed from within the `apps/web` directory. The root directory is not configured as the primary package root for the Next.js app in this setup.

### Example Commands
- **Install dependencies:** `cd apps/web && pnpm install`
- **Run Typecheck:** `cd apps/web && pnpm run typecheck`
- **Run Dev Server:** `cd apps/web && pnpm run dev`
