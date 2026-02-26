# Security Memory

## Threat Model Snapshot
1. Hauptbedrohung in E1 war destruktiver Fehlbetrieb des lokalen Seed-Resets gegen nicht-lokale Neo4j Ziele.
2. Diese Bedrohung ist durch Local-Host-Guard plus explizites Opt-In mitigiert.
3. Der Reset bleibt lokal fuer Seed-IDs destruktiv und erzeugt Restrisiko bei ID-Kollisionen.
4. Epic E2 Response liefert `answer.*` mit interpoliertem User-Query; Frontends muessen die Werte als Text behandeln, damit reflektiertes XSS unterbunden wird.

## Secret Handling Status
1. Keine harten Secrets in den geprueften E1-Artefakten gefunden.
2. `apps/web/.env.local` ist lokal vorhanden und im Recheck nicht als tracked Datei gefunden.
3. Secret-Hygiene bleibt abhaengig von konsequenter Env-Nutzung ohne Repo-Commit.

## Abuse Prevention Measures
1. Destruktive Seed-Operation ist auf lokale Hosts `localhost`, `127.0.0.1`, `::1` begrenzt.
2. Explizites Opt-In `ALLOW_DESTRUCTIVE_SEED_RESET=true` ist verpflichtend.
3. Guard-Fail verhindert Driver-Initialisierung und damit Delete-Ausfuehrung.

## Security Findings Summary
1. Mitigated: E1 Local Reset Missing Runtime Guard.
2. Mitigated: E1 Local Reset Overbroad Delete Scope.
3. E1 hat im aktuellen Recheck keine offenen Critical oder High Findings.
4. E2-Review erzeugt keine offenen Findings, aber betont reflektierte Query-Interpolation und Erwartungs-Fallback als kontrollierte Risiken.

## Open Security Risks
1. Lokale Daten mit kollidierenden Seed-IDs koennen weiterhin vom Reset betroffen sein.
2. Public Runtime Hardening zu Rate-Limit, Headern und Abuse-Schutz bleibt in E4 zu gate'n.
3. Vollstaendige Dependency- und Supply-Chain-Pruefung ist in diesem Recheck nicht enthalten.
4. `/api/query` sendet Meta-Daten ohne Abuse-Checks; zudem offenbart der Erwartungs-Fallback statische Referenz-IDs, sodass neue Einträge kuratiert bleiben muessen.

## Next Instructions for Security Agent
1. Beim naechsten Epic-Gate fuer E4 Public-Hardening strikt gegen API- und Ops-Vertrag pruefen.
2. Bei Aenderungen am Seed-Reset erneut verifizieren, dass Guard und ID-scope Delete unveraendert aktiv bleiben.
3. Vor Public Demo einen finalen Security-Gesamtlauf mit QA und DevOps durchfuehren.
4. Vornaechsten Review-Einsatz fuer die Antwortpipeline: prüfen, dass Frontends `textContent` (nicht `innerHTML`) nutzen, Expectation-IDs nicht sensible Graph-IDs enthalten und `/api/query` mit Monitoring/Rate-Limit in E4 ausgestattet wird.
