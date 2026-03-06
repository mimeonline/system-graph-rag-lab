# Changelog

All notable changes to this project are documented in this file.

## [1.0.7] - 2026-03-06

### Added

1. Introduced bilingual `de`/`en` GraphRAG query handling with locale-aware prompts, structured answer fallbacks and English essay content.

### Changed

1. Completed locale-aware graph surfaces across landing, story and essay experiences, including localized SVG variants and language switching in the header.
2. Expanded legal pages to a fuller shared template with localized header and footer chrome plus project-specific privacy and legal notice content.

### Fixed

1. Restored the dedicated demo hero stage and removed remaining German copy from key English routes.
2. Improved error handling with structured localized 404 and 5xx pages.
3. Stabilized story visualization timing and line-to-node attachment during chapter reveals.

## [1.0.6] - 2026-03-06

### Fixed

1. Reworked mobile navigation with a dedicated burger menu and more reliable tap targets in the header.
2. Stabilized the demo route so `/demo` presents a distinct operational demo surface instead of mirroring the home entry view.
3. Improved responsive headline wrapping and graph legend layout to prevent mobile viewport overflow across landing, essay and story surfaces.

## [1.0.5] - 2026-03-03

### Fixed

1. Hardened production site URL resolution to prevent `localhost` values in canonical URLs, OpenGraph metadata and sitemap output.
2. Added guard logic to ignore localhost-like `NEXT_PUBLIC_SITE_URL` values in production.

### Changed

1. Updated environment documentation and examples to include `NEXT_PUBLIC_SITE_URL` as required public runtime configuration.

## [1.0.4] - 2026-03-03

### Changed

1. Removed all "Projekt anfragen" calls to action from the header and about page.
2. Simplified global site configuration by removing inquiry-specific CTA constants.
3. Updated SEO metadata and organization URL references to use the LinkedIn profile URL.

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
