# AGENTS

## Projektziel
Ziel ist der Aufbau eines öffentlich erreichbaren, optisch hochwertigen GraphRAG-MVP im Bereich System Thinking.

Das Projekt dient als:
- Technischer Showcase
- Lernplattform für Multi-Agent-Workflows
- Referenz für spec-first, iteratives Arbeiten
- Basis für fachlichen Content

Repository-Dateien sind die Quelle der Wahrheit. Chat-Kontext ist nicht bindend.

## Arbeitsmodell
Das System arbeitet rollenbasiert mit Subagents.

Der Main-Agent ist ausschließlich:
- Orchestrator
- Reviewer
- Gatekeeper

Der Main-Agent erzeugt keine Rollen-Artefakte selbst.

## Rollen und Scope
Rollen im Projekt:
- PM
- UX
- Architect
- Dev
- QA
- DevOps
- Security

Jede Rolle arbeitet strikt in ihrem Scope und den erlaubten Schreibpfaden aus der jeweiligen `.codex/agents/<rolle>.toml`.

## Subagent-Pflicht
Wenn eine Aufgabe einer Rolle zugeordnet ist:
- Es muss ein Subagent mit passendem `agent_type` gestartet werden.
- Der Hauptagent darf diese Rollenarbeit nicht selbst ausführen.

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
- Betrieb: `ops/**`
- Handoffs: `handoff/**`
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
- Strikte Rollenpipeline mit Subagents
- Handoffs und Memory-Updates verpflichtend
- QA und Security fungieren als Gate vor Release
