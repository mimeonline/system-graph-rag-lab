# DevOps Memory

## Deployment Status
1. E1 DevOps-Gate ist auf `Pass` gesetzt fuer lokalen Betriebsfokus.
2. CI-Mindestpipeline fuer `apps/web` mit Lint, Test und Build ist vorhanden.
3. Public Runtime bleibt Zielbild auf Vercel plus Neo4j Aura und wird in E4 final verifiziert.

## Environment Configuration
1. Secrets und Keys bleiben strikt environment-only.
2. Lokal gilt `apps/web/.env.local` primaer, `apps/web/.env` optional.
3. Pflichtkeys sind fuer OpenAI, Neo4j und Rate-Limit dokumentiert, inklusive `NEO4J_DATABASE`.
4. `.env` und `.env.local` duerfen nicht versioniert werden.

## Observability Setup
1. Minimalstandard bleibt ein strukturiertes Abschluss-Event pro Request.
2. Pflichtfelder fuer Korrelation und Triage sind dokumentiert.
3. Rohqueries und Secrets bleiben aus Logs ausgeschlossen.

## Rate Limiting Status
1. Fixed-Window-Strategie und `429` Contract sind dokumentiert.
2. Konsistenz von `Retry-After` Header und Body bleibt Guardrail.
3. Public-Haertung und Live-Verifikation bleiben E4-Aufgabe.

## Operational Risks
1. Public Deploy Smoke gegen Vercel plus Aura ist fuer E1 noch nicht als Live-Evidenz vorhanden.
2. Dependency-Sicherheitschecks sind im CI nur advisory und nicht blockierend.
3. Konfigurationsdrift local versus public kann spaete Integrationsfehler ausloesen.

## Next Instructions
1. In E4 Vercel-Deploy mit produktionsnahen Smokes und Rollback-Drill belegen.
2. Rate-Limit und Log-Redaction im Public Profil mit reproduzierbarer Evidenz gate'n.
3. CI-Security-Checks fuer Release-Branch auf blockierendes Niveau entscheiden.
