# AGENTS

## Projektziel
Dieses Repository enthält System GraphRAG Lab: eine öffentliche GraphRAG-Demo für System Thinking.

Ziel ist ein technischer Showcase, der nachvollziehbar zeigt, wie eine Systemfrage in strukturierte Antwortlogik, sichtbare Referenzkonzepte und prüfbare Kontextpfade übersetzt wird.

Repository-Dateien sind die Quelle der Wahrheit. Chat-Kontext ist nicht bindend.

## Sprache und Stil
- Hauptsprache: Deutsch
- In deutschen Texten echte Umlaute verwenden
- Technische Begriffe, API-Namen, Frameworks, IDs und Dateinamen dürfen Englisch bleiben
- Ton: präzise, didaktisch, veröffentlichbar
- Keine unnötigen Superlative
- Keine Gedankenstriche als Stilmittel im deutschen Fließtext

## Struktur
- `docs/`: Company-artige Projektunterlagen für Product, Feature, Tech, Business, Marketing, Research und Discovery
- `docs/product/PRD.md`: maßgebliche Produktreferenz
- `docs/product/roadmap.md`: leichte Priorisierung nach Horizonten
- `docs/product/ideas/`: frühe Ideen und explorative Produktgedanken, noch keine Umsetzungszusage
- `docs/product/PDR/`: Produkt-, Scope- und Discovery-Entscheidungen
- `docs/feature/`: aktive Feature-Notizen und Übergänge aus Roadmap oder Ideen in konkrete Umsetzung
- `docs/tech/SPEC.md`: technischer Einstiegspunkt
- `docs/tech/architecture/`: Architekturüberblick, C4-Sichten und Deployment-Sicht
- `docs/tech/models/`: Daten- und Graphmodelle
- `docs/tech/spec/`: API-Vertrag, OpenAPI-Datei und Retrieval Contract
- `docs/tech/ADR/`: langfristige Architekturentscheidungen
- `docs/tech/operations/`: lokale Entwicklung, Deployment, Environment, Observability und Betriebsnotizen
- `docs/business/`: Business-, Markt-, Pricing- und Monetarisierungsnotizen
- `docs/marketing/`: Launch Readiness, Positionierung, Kanalnotizen und Marketing-Artefakte
- `docs/research/`: Quellen, externe Referenzen, Snapshots und Evidenz
- `docs/discovery/`: frühe Discovery- und Kickoff-Artefakte
- `evals/`: fachliche Eval-Fragen und Rubrics
- `input/`: lokale Quellenbasis für Seed- und Graph-Kuration
- `apps/web/`: Next.js App Router Anwendung

## Dokumentationsregeln
- Neue lose Ideen zuerst unter `docs/product/ideas/` ablegen
- Dauerhafte Produktentscheidungen als PDR unter `docs/product/PDR/` dokumentieren
- Dauerhafte Architekturentscheidungen als ADR unter `docs/tech/ADR/` dokumentieren
- Recherchematerial zuerst unter `docs/research/` sammeln
- Feature-Schnitte unter `docs/feature/` dokumentieren, wenn eine Idee konkret genug für Umfang, Nutzerwert und Akzeptanzkriterien ist
- Kein separates Backlog-, Rollen-Memory-, Handoff- oder Gate-Verzeichnis einführen, solange nicht ausdrücklich gewünscht
- Historie liegt in Git, nicht in zusätzlichen Archivordnern

## Markdown-Regeln
- Jede Markdown-Datei hat genau eine H1
- Weitere Struktur nur mit H2 und H3
- Inhalte klar, testbar und ohne Buzzwords formulieren
- Interne Links nach Strukturänderungen direkt aktualisieren

## Betriebsrahmen Public MVP
- GitHub als öffentliches Repository
- Deployment über Vercel
- Neo4j Aura als Graph-Datenbank
- OpenAI API mit Usage-Limit
- Keine Secrets im Repository
- Basis-Rate-Limiting vor öffentlicher Freigabe aktiv

## Tech-Stack Invarianten
- Next.js ist verbindlich in Version `16.1.6`
- API Layer wird in Next.js als Route Handler umgesetzt
- UI wird verbindlich mit Tailwind CSS und shadcn/ui umgesetzt
- UI-Architektur folgt dem Pattern Atomic Design
- Abweichungen sind nur über dokumentierte ADR-Entscheidung zulässig

## Next.js Frontend Regeln
- `apps/web/src/app/**/page.tsx` bleibt orchestration-only
- `page.tsx` darf `params` und `searchParams` lesen und ein Feature-Template zusammensetzen
- `page.tsx` darf keine Business-Logik und kein umfangreiches Markup enthalten
- Page-Templates liegen unter `apps/web/src/features/<feature>/templates/*Template.tsx`
- UI-Struktur pro Feature folgt Atomic Design unter `apps/web/src/features/<feature>/`
- Globale, featureübergreifende Komponenten liegen unter `apps/web/src/components`
- shadcn/ui-Primitives liegen unter `apps/web/src/components/ui`
- Globale Hilfslogik und Datenzugriffe gehören nach `apps/web/src/lib`
- Globale Typen, Interfaces und DTOs gehören nach `apps/web/src/types`

## Architektur-Invarianten
- C4 Kontext und C4 Container müssen Mermaid-Diagramme enthalten
- `docs/tech/architecture/arc42.md` ist verpflichtender Architekturüberblick mit Mermaid Kontext-, Container- und Sequenzsicht
- `docs/tech/architecture/deployment-view.md` ist verpflichtend inklusive Mermaid Deployment-Diagramm
- API-Vertrag liegt in `docs/tech/spec/api.md` und maschinenlesbar in `docs/tech/spec/api.openapi.yaml`

## Package Management und Workspace
- Package Manager: `pnpm`
- Keine Nutzung von `npm` oder `yarn` für Installationen oder Scripts
- Alle Next.js-App-Kommandos aus `apps/web` ausführen
- Beispiele:
  - `cd apps/web && pnpm install`
  - `cd apps/web && pnpm run typecheck`
  - `cd apps/web && pnpm run dev`

## Qualität
- Nach App-Code-Änderungen mindestens `cd apps/web && pnpm run typecheck` und `cd apps/web && pnpm run lint` ausführen, sofern Abhängigkeiten installiert sind
- Bei größeren UI-, Routing- oder Runtime-Änderungen zusätzlich `cd apps/web && pnpm run build`
- Nach reinen Dokumentationsänderungen keinen Build ausführen
- API Keys und `.env.local` niemals committen

## Sub-Agenten und Modellwahl

- Sub-Agenten eigenständig für klar abgegrenzte Teilaufgaben einsetzen, wenn dadurch ein effizienteres Vorgehen zu erwarten ist. Kleine Aufgaben direkt erledigen, wenn Delegation mehr Aufwand erzeugt.
- Das kleinste ausreichend leistungsfähige verfügbare Modell bevorzugen: Luna (`gpt-5.6-luna`) für einfache, mechanische Aufgaben, Terra (`gpt-5.6-terra`) für gewöhnliche Implementierung, Sol (`gpt-5.6-sol`) für anspruchsvollere Teilaufgaben. Bei unzureichenden Ergebnissen gezielt höher einstufen; aktuelle Modellverfügbarkeit beachten.
- Nur benötigten Kontext übergeben, Aufträge und Rückgaben knapp halten, Doppelarbeit vermeiden. Den Gesamtaufwand einschließlich Koordination, Prüfung und Nacharbeit optimieren; Tokenzahl allein belegt keine Kosteneinsparung.
- Zuständigkeiten und erlaubte Dateien eindeutig zuweisen. Unabhängige Teilaufgaben parallel bearbeiten, überlappende Schreibzugriffe vermeiden und vorhandene Agenten sinnvoll weiterverwenden.
- Der Hauptagent verantwortet Entscheidungen, Zusammenführung, Prüfung und Ergebnisqualität. Die geltenden Prüfungen bleiben verbindlich.
- Separate nutzereigene Tasks und Automationen nur auf ausdrücklichen Auftrag anlegen. Die Erlaubnis zur Delegation erweitert weder den fachlichen Auftrag noch sonstige Befugnisse.
