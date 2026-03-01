# AGENTS

## Projektziel
Ziel ist der Aufbau eines öffentlich erreichbaren, optisch hochwertigen GraphRAG-MVP im Bereich System Thinking.

Das Projekt dient als:
- Technischer Showcase
- Lernplattform für strukturierte Main-Agent-Workflows
- Referenz für spec-first, iteratives Arbeiten
- Basis für fachlichen Content

Repository-Dateien sind die Quelle der Wahrheit. Chat-Kontext ist nicht bindend.

## Arbeitsmodell
Das System arbeitet im Main-Agent-Thread.

Der Main-Agent übernimmt:
- Orchestrator
- Reviewer
- Umsetzer
- Gatekeeper

Alle Artefakte werden direkt im Main-Agent-Thread erzeugt und gepflegt.

## Rollen und Scope
Rollen im Projekt:
- PM
- UX
- Architect
- Dev
- QA
- DevOps
- Security

Die Rollen dienen als Denkraster und Qualitäts-Scope innerhalb eines einzelnen Main-Agent-Runs.

## Rollenlauf im Main-Agent
Wenn eine Aufgabe einer Rolle zugeordnet ist:
- Der Main-Agent bearbeitet sie direkt im selben Thread.
- Die jeweiligen Rollen-Scope-Regeln bleiben inhaltlich verbindlich.

Ein Rollenlauf ist nur vollständig, wenn:
- relevante Inputs gelesen wurden
- Artefakte in erlaubten Pfaden erzeugt oder aktualisiert wurden
- `docs/memory/<rolle>.md` aktualisiert wurde
- das Rollen-Handoff aktualisiert wurde

## Memory-Policy
Jede Rolle hat eine persistente Memory-Datei unter:
- `docs/memory/<rolle>.md`

Regeln:
- Memory ist strategisch, kurz, nicht redundant.
- Memory ersetzt kein PRD, kein Backlog und keine Specs.
- Jede Rolle liest ihre Memory-Datei zu Run-Beginn.
- Jede Rolle aktualisiert ihre Memory-Datei am Run-Ende.
- Der Orchestrator prüft das Memory-Update als Gate.

## Source of Truth Pfade
- Kickoff: `docs/discovery/feature-kickoff.md`
- Discovery: `docs/discovery/**`
- UX: `docs/ux/**`
- Architektur: `docs/architecture/**`, `docs/spec/**`
- Backlog: `backlog/**`
- QA: `docs/qa/**`, `evals/**`
- Betrieb: `docs/ops/**`
- Handoffs: `docs/handoff/**`
- Memory: `docs/memory/**`

Entscheidungen müssen in Dateien dokumentiert werden.

## Review-Gates
Nach jeder Rollen-Ausführung prüft der Orchestrator:
- Wurden nur erlaubte Pfade geändert?
- Ist das erwartete Handoff vorhanden?
- Wurde die Memory-Datei aktualisiert?
- Gibt es Scope-Verletzungen?
- Gibt es unbeabsichtigte Architektur- oder Scope-Entscheidungen?

Erst danach startet die nächste Rolle.

Zusätzliche Gate-Taktung:
- QA nach jeder Story.
- Security pro Epic verpflichtend.
- DevOps pro Epic verpflichtend.
- Vor Public Demo oder Release zusätzlich vollständiger Gate-Run mit QA, Security und DevOps.

## Story-Fortschritt und PM-Freigabe
Nach jedem Story-Finish durch Dev gilt verbindlich:
- `backlog/stories/<story>.md` wird aktualisiert mit Status und Test Notes.
- `backlog/progress.md` wird im selben Run synchron aktualisiert.
- Dev setzt zu Run-Beginn als ersten operativen Schritt den Story-Status auf `in_progress` und synchronisiert sofort `backlog/progress.md`.
- Dev setzt den Story-Status nach Abschluss der Implementierung auf `qa` oder `blocked`, nicht auf `accepted`.
- QA liefert ein Gate-Verdict `Pass` oder `Fail` in den QA-Artefakten.
- QA setzt bei QA-`Pass` den Story-Status auf `pass` und synchronisiert `backlog/progress.md` im selben Run.
- PM gibt das finale `accepted` erst nach PM-Review auf Basis von `pass` frei.
- Erst nach PM-OK gilt eine Story als abgeschlossen.

## Markdown-Regeln
- Jede Markdown-Datei hat genau eine H1.
- Weitere Struktur nur mit H2 und H3.
- Keine Gedankenstriche als Stilmittel.
- Inhalte klar, testbar, ohne Buzzwords.

## Betriebsrahmen Public MVP
- GitHub als öffentliches Repository
- Deployment über Vercel
- Neo4j Aura als Graph-Datenbank
- OpenAI API mit Usage-Limit
- Keine Secrets im Repository
- Basis-Rate-Limiting vor öffentlicher Freigabe aktiv

## Tech-Stack Invarianten
- Next.js ist verbindlich in Version `16.1.6`.
- API Layer wird in Next.js als Route Handler umgesetzt.
- UI wird verbindlich mit Tailwind CSS und shadcn/ui umgesetzt.
- UI-Architektur folgt dem Pattern Atomic Design.
- Abweichungen sind nur über dokumentierte ADR-Entscheidung zulässig.

## Next.js Frontend Regeln
- `apps/web/src/app/**/page.tsx` bleibt orchestration-only.
- `page.tsx` darf:
  - `params` und `searchParams` lesen
  - ein Feature-Template zusammensetzen
- `page.tsx` darf nicht:
  - Business-Logik enthalten
  - umfangreiches Markup enthalten
- Page-Templates liegen unter `apps/web/src/features/<feature>/templates/*Template.tsx`.
- UI-Struktur pro Feature folgt Atomic Design unter `apps/web/src/features/<feature>/`:
  - `templates/`
  - `organisms/`
  - `molecules/`
  - `atoms/` nur falls feature-lokal nötig

## Architektur-Invarianten
- C4 Kontext und C4 Container müssen Mermaid-Diagramme enthalten.
- `docs/architecture/arc42.md` ist verpflichtender Architekturüberblick mit Mermaid Kontext-, Container- und Sequenzsicht.
- `docs/architecture/deployment-view.md` ist verpflichtend inklusive Mermaid Deployment-Diagramm.
- API-Vertrag liegt in `docs/spec/api.md` und maschinenlesbar in `docs/spec/api.openapi.yaml`.

## Modusrahmen
### Build Mode
- Direktarbeit mit Main-Agent für schnelle Iteration
- Fokus auf Momentum
- Rollenpipeline kann verkürzt sein

### Process Mode
- Strikte Rollenpipeline im Main-Agent-Thread
- Handoffs und Memory-Updates verpflichtend
- QA nach jeder Story als Qualitätsgate
- Security und DevOps pro Epic als Betriebs- und Risikogate

## Package Management & Workspace
- **Package Manager:** You MUST use `pnpm` for all dependency installations and script executions. Do not use `npm` or `yarn`.
- **Working Directory:** All next.js application commands (e.g., `pnpm install`, `pnpm run dev`, `pnpm run typecheck`, `pnpm run build`) MUST be executed from within the `apps/web` directory. The root directory is not configured as the primary package root for the Next.js app in this setup.

### Example Commands
- **Install dependencies:** `cd apps/web && pnpm install`
- **Run Typecheck:** `cd apps/web && pnpm run typecheck`
- **Run Dev Server:** `cd apps/web && pnpm run dev`
