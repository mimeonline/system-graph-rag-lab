# PM Memory

## Current Product Intent
Öffentlich erreichbares GraphRAG-MVP für System-Thinking mit klarem Frage-zu-Antwort-Fluss, sichtbaren Referenzkonzepten, messbarer Abnahme und verbindlichem Fortschrittstracking auf Story- und Epic-Ebene ohne Scope-Erweiterung. Ein Epic wechselt auf `in_progress`, sobald die erste Story dieses Epics nicht mehr `todo` ist.

## MVP Scope Guardrails In Out
### In
1. Public Demo mit strukturierter Hauptantwort, Referenzkonzepten und P0-Kernnachweis.
2. Wissensbasis im freigegebenen Rahmen von mehr als 100 Nodes und mehr als 200 Edges.
3. Verbindliche Abnahmeregel für Referenzkonzepte im fünfteiligen Eval-Set.
4. Operative MVP-Schutzmaßnahmen mit Secret-Hygiene, Usage-Limit und Basis-Rate-Limit.

### Out
1. Neue Epics oder Domänenerweiterung über den freigegebenen Rahmen hinaus.
2. Konten, Rollenmodell, Multi-Tenant, Personalisierung und Enterprise-Compliance-Ausbau.
3. PM-seitige Architekturentscheidungen und UX-Detailentscheidungen.
4. P1-Herleitungsvertiefung als Blocker für P0-Readiness.

## Open Assumptions
1. Die Erwartungslisten mit drei bis sechs Referenzkonzepten je Eval-Frage sind fachlich stabil genug für konsistente Bewertung.
2. Der P0-Kernnachweis reicht der Zielgruppe für Erstvertrauen vor P1-Vertiefung.
3. Die Vier-von-Fünf-Abnahmegrenze ist für Public-Demo-Readiness ausreichend robust.
4. Story-Status in `backlog/stories/*.md` bleiben die führende Quelle für die Epic-Statusableitung in `backlog/epics/*.md` und `backlog/progress.md`.

## Open Decisions
1. Welche P1-Stories bei Timeline-Risiko vor Public Demo vorgezogen werden.
2. Ob der Abnahmelauf nach UX-Finalisierung einmalig oder als wiederholter Qualitätsgate betrieben wird.
3. Wie die Pflicht zur Epic-Statusführung in `.codex/agents/pm.toml` umgesetzt wird, da der Pfad außerhalb der aktuellen PM-Write-Guardrails liegt.

## Risks to Monitor
1. Scope-Drift durch spätere Re-Expansion des Graphumfangs ohne PM-Freigabe.
2. Qualitätsrisiko, falls Erwartungslisten pro Eval-Frage zu breit oder zu eng gepflegt werden.
3. Abnahmerisiko, falls Fallback-Hinweise inkonsistent angewendet und dadurch Ergebnisse verzerrt werden.
4. Betriebsrisiko durch öffentliche Lastspitzen trotz Basis-Guardrails.
5. Tracking-Risiko durch mögliche Status-Divergenz zwischen Story-, Epic- und Progress-Status bei zukünftigen Updates.
6. Governance-Risiko, solange die Epic-Statuslogik nicht zusätzlich in `.codex/agents/pm.toml` technisch verankert ist.

## Next Instructions for PM Agent
1. Halte Relevanzregel und Vier-von-Fünf-Grenze in allen nachfolgenden Rollenartefakten unverändert.
2. Lass UX den Erstkontakt strikt nach Priorität 1 bis 5 aus dem PM-Handoff ausarbeiten.
3. Plane mit QA einen Abnahmelauf, der je Frage Erwartungsliste, Treffer und Fallback separat dokumentiert.
4. Prüfe vor Umsetzung, dass P0-Stories keinen impliziten P1-Detailumfang enthalten.
5. Wende bei jeder Story-Statusänderung die Epic-Statuslogik strikt an: sobald eine Story eines Epics nicht `todo` ist, steht das Epic auf `in_progress`.
6. Synchronisiere bei jeder Epic- oder Story-Statusänderung die Tabellen in `backlog/progress.md` im selben Run.
7. Kläre mit dem Orchestrator einen erlaubten Run zur Aktualisierung von `.codex/agents/pm.toml`, damit Epic-Status dort technisch verpflichtend wird.
