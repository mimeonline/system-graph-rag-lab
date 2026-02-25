# AGENTS

## Projektziel

Ziel ist der Aufbau eines öffentlich erreichbaren, optisch hochwertigen GraphRAG-MVP im Bereich System Thinking.

Das Projekt dient gleichzeitig als:

- Technischer Showcase
- Lernplattform für Multi-Agent-Workflows
- Referenz für Spec-First, iteratives Arbeiten
- Basis für fachlichen Content

Repository-Dateien sind die Quelle der Wahrheit. Chat-Kontext ist nicht bindend.

---

## Grundprinzip

Das System arbeitet rollenbasiert mit Subagents.

Der Main-Agent ist ausschließlich:

- Orchestrator
- Reviewer
- Gatekeeper

Er darf keine Rollen-Artefakte selbst erzeugen.

---

## Subagent-Pflicht

Wenn eine Aufgabe einer Rolle zugeordnet ist (pm, ux, architect, dev, qa, devops, security):

- Es muss ein Subagent mit passendem agent_type gestartet werden.
- Der Hauptagent darf die Aufgabe nicht selbst ausführen.
- Der Subagent muss:
  - relevante Eingabedokumente lesen
  - Artefakte im erlaubten Pfad erzeugen
  - seine Memory-Datei aktualisieren
  - ein Handoff-Dokument erstellen

Vor Beginn der Arbeit muss jede Rolle:

- ihre Memory-Datei lesen
- relevante Punkte explizit berücksichtigen

Ein Rollenlauf gilt als unvollständig ohne:

- Memory-Update
- Handoff-Datei

---

## Memory-Policy

Jede Rolle besitzt eine persistente Memory-Datei unter:

`docs/memory/<rolle>.md`

Zweck:

- Persistenter Rollen-Kontext unabhängig vom Chat-Verlauf
- Dokumentation von Annahmen, offenen Entscheidungen und Risiken
- Vorbereitung für Iterationen
- Reduktion von Kontextverlust bei Subagent-Ausführung

Regeln:

- Memory ist kein PRD-Ersatz.
- Memory ist kein Backlog-Duplikat.
- Memory enthält nur strategisch relevante Informationen.
- Jede Rolle aktualisiert ihre Memory-Datei am Ende eines Runs.
- Der Orchestrator prüft, ob die Memory-Datei aktualisiert wurde.

Memory ist bewusst kurz und strategisch.

---

## Repository-Struktur als Source of Truth

Kickoff:

- docs/discovery/feature-kickoff.md

Discovery:

- docs/discovery/**

UX:

- docs/ux/**

Architektur:

- docs/architecture/**
- docs/spec/**

Backlog:

- backlog/**

QA:

- docs/qa/**
- evals/**

Betrieb:

- ops/**

Handoffs:

- handoff/<rolle>-to-next.md

Memory:

- docs/memory/<rolle>.md

Entscheidungen müssen in Dateien dokumentiert werden.

---

## Rollenrahmen (High-Level)

Detaillierte Rollenbeschreibungen befinden sich in den jeweiligen `.toml`-Dateien unter `.codex/roles/`.

Hier nur die Verantwortungsebene:

PM:

- Produktvision
- Scope
- Backlog
- Akzeptanzkriterien
- Risiken
- KPIs

UX:

- User Journeys
- Informationsarchitektur
- Interaktionskonzept
- UX-Handoff

Architect:

- Architekturmodell
- Datenmodell
- Retrieval-Strategie
- Nicht-funktionale Anforderungen

Dev:

- Implementierung
- Tests
- Story-Status

QA:

- Testpläne
- Eval-Durchläufe
- Qualitätsberichte

DevOps:

- Deployment
- Infrastruktur
- Guardrails
- Observability

Security:

- Threat Review
- Secret Handling
- Abuse Prevention

Rollen dürfen ihren Scope nicht überschreiten.

---

## Review-Gates

Nach jeder Rollen-Ausführung prüft der Orchestrator:

- Wurden nur erlaubte Pfade genutzt?
- Existiert das Handoff-Dokument?
- Wurde die Memory-Datei aktualisiert?
- Gibt es Scope-Verletzungen?
- Gibt es unbeabsichtigte Architektur- oder Scope-Entscheidungen?

Erst danach darf die nächste Rolle gestartet werden.

---

## Markdown-Regeln

- Jede Markdown-Datei darf genau eine H1-Überschrift enthalten.
- Weitere Struktur nur mit H2/H3.
- Keine Gedankenstriche als Stilmittel.
- Listen Obsidian-kompatibel.
- Klar, testbar, ohne Buzzwords.

---

## Betriebsrahmen für Public MVP

- GitHub als öffentliches Repository
- Deployment über Vercel
- Neo4j Aura als Graph-Datenbank
- Keine Secrets im Repository
- OpenAI API-Key mit Usage-Limit
- Basis-Rate-Limiting vor öffentlicher Freigabe aktivieren

## MODES

Build Mode:

- Direktarbeit mit Main Agent.
- UX/PM dürfen schnell iterieren.
- Nur Memory aktualisieren.
- Keine vollständige Rollenpipeline.

Process Mode:

- Strikte Rollen.
- Subagent Spawn.
- Handoffs verpflichtend.
- QA/Security Gate aktiv.
