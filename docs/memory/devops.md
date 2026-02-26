# DevOps Memory

## Deployment Status
1. E1 DevOps-Gate ist auf `Pass` gesetzt fuer lokalen Betriebsfokus.
2. CI-Mindestpipeline fuer `apps/web` mit Lint, Test und Build ist vorhanden.
3. Epic E2 Gate wurde nach E2-S1 bis E2-S4 als `Pass` dokumentiert; Observability und Guardrails decken neue Retrieval-Referenzen ab.
4. Public Runtime bleibt Zielbild auf Vercel plus Neo4j Aura und wird in E4 final verifiziert.
5. Epic E3 Gate ist mit `Pass` dokumentiert; die Query-ViewModel-Tests plus die manuellen QueryPanel-Checks (Status, Referenzen, Herleitungsdetails) sind reproduzierbar und teilen sich die bestehenden Observability/Guardrail-Flows.

## Environment Configuration
1. Secrets und Keys bleiben strikt environment-only.
2. Lokal gilt `apps/web/.env.local` primaer, `apps/web/.env` optional.
3. Pflichtkeys sind fuer OpenAI, Neo4j und Rate-Limit dokumentiert, inklusive `NEO4J_DATABASE`.
4. `.env` und `.env.local` duerfen nicht versioniert werden.

## Observability Setup
1. Minimalstandard bleibt ein strukturiertes Abschluss-Event pro Request.
2. Pflichtfelder fuer Korrelation und Triage sind dokumentiert; E2-Fields `referenceCount`, `contextCandidateCount`, `referenceQuality`, `referenceFallbackUsed` sind jetzt Teil der Logs.
3. Rohqueries und Secrets bleiben aus Logs ausgeschlossen.
4. Die E3-UI-Antworten nutzen denselben `/api/query`-Logstrom; `requestId`-Korrelation, Statusfelder und `reference*`-Metriken stehen weiter im Mittelpunkt der Triage.

## Rate Limiting Status
1. Fixed-Window-Strategie und `429` Contract sind dokumentiert.
2. Konsistenz von `Retry-After` Header und Body bleibt Guardrail.
3. Public-Haertung und Live-Verifikation bleiben E4-Aufgabe.
4. Die QueryPanel-Statussteuerung (Loading/Empty/Error) deaktiviert Submit, was die Rate-Limit-Injektionsfläche zusätzlich schützt (siehe Guardrail-Doku und QA-Checks).

## Operational Risks
1. Public Deploy Smoke gegen Vercel plus Aura ist fuer E1 noch nicht als Live-Evidenz vorhanden.
2. Dependency-Sicherheitschecks sind im CI nur advisory und nicht blockierend.
3. Konfigurationsdrift local versus public kann spaete Integrationsfehler ausloesen.
4. Public Hardening wird bewusst fuer E4 aufgehoben; dieser Aufwand darf jetzt nicht als abgeschlossen kommuniziert werden.
5. UI-Template-Änderungen oder API-Response-Modifikationen nach E3 könnten kurzfristige Drift zwischen QA/DevOps-Checks und echten Query-Requests hervorrufen; diese sind zu dokumentieren, bevor E4 abgeschlossen ist.

## Next Instructions
1. In E4 Vercel-Deploy mit produktionsnahen Smokes und Rollback-Drill belegen.
2. Rate-Limit und Log-Redaction im Public Profil mit reproduzierbarer Evidenz gate'n.
3. CI-Security-Checks fuer Release-Branch auf blockierendes Niveau entscheiden.
4. Schnellvalidierung der E2-Referenz-Metriken (`referenceCount`, `referenceFallbackUsed`) in Logs und API-Response-Smoke bei jedem E2-Regressionstest sicherstellen.
5. Nach E3 darf keine neue Query-Template-Variation live gehen, ohne vorherige DevOps-/QA-Reproduktion der `buildQueryViewModel`-Flows und der QueryPanel-Statusanzeigen sicherzustellen.
