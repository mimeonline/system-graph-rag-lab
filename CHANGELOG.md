# Changelog

All notable changes to this project are documented in this file.

## [1.0.3] - 2026-03-03

### Added

1. Global analytics script integration in the application head for `stats.meierhoff-systems.de`.

## [1.0.2] - 2026-03-03

### Changed

1. Release pipeline now calls a dedicated reusable production deploy workflow.
2. Deployment responsibilities were split into build-push and deploy stages for clearer operations.

### Added

1. New standalone workflow `.github/workflows/deploy-prod.yml` for production deployment by image tag.

## [1.0.1] - 2026-03-03

### Added

1. Release deployment workflow with SemVer tag trigger and manual image tag dispatch.
2. Automated image build and push to GHCR as part of release pipeline.

### Changed

1. CI now includes an explicit `typecheck` gate before test and build.

## [1.0.0] - 2026-03-02

Initial public release of System GraphRAG Lab.

### Added

1. Public GraphRAG experience with dedicated surfaces for demo, story and essays.
2. 5-step GraphRAG story flow from question to action with chapter-specific visuals.
3. Essay hub with interconnected long-form architecture content and embedded diagrams.
4. Legal and profile pages: About, Datenschutz and Impressum.
5. Seed data curation and local reset-reseed tooling for Neo4j.
6. Development scripts for local startup and shutdown.
7. Repository baseline for public release with MIT license and onboarding README.

### Changed

1. Landing and demo UX were iteratively refined for executive readability and decision transparency.
2. Story visuals and copy were aligned to a more realistic GraphRAG decision process.
3. Blog routing and terminology were consolidated to essay-focused navigation.
4. Footer and navigation links were updated with project and profile references.
5. CI workflow documentation and README project context were clarified.

### Fixed

1. ESLint compatibility and lint rule regressions in React and Next.js surfaces.
2. Hydration and interaction issues in story visualization components.
3. Multiple diagram and asset layout issues across essay pages.
4. Import resolution stability for local editor and TypeScript alias handling.

### Security and Repository Hygiene

1. Local-only files and runtime env files excluded from version control.
2. Output artifacts removed from tracked files.
3. Playwright CLI artifacts removed from repository history before public release.
