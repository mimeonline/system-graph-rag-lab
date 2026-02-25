# DevOps Memory

## Deployment Status
1. Local-Profil basiert auf Next.js lokal plus Neo4j Docker (`neo4j:5.26.0`).
2. Public-Zielbild bleibt GitHub plus Vercel plus Neo4j Aura.
3. Deployment-Readiness folgt Epic-Gates, nicht Einzelstorys.

## Environment Configuration
1. Lokale Konfiguration ueber `.env.local`, optional `.env`.
2. Neo4j-Lokalbetrieb erfordert `NEO4J_URI`, `NEO4J_DATABASE`, `NEO4J_USERNAME`, `NEO4J_PASSWORD`.
3. Secrets werden nie committed.

## Observability Setup
1. Ein strukturiertes Abschluss-Event pro API-Request bleibt Mindestanforderung.
2. Keine Roh-User-Queries oder Secret-Daten in Logs.
3. Pflichtfelder folgen API- und Architektur-Spec.

## Rate Limiting Status
1. Basisstrategie bleibt profilkonsistent.
2. Public und local duerfen unterschiedliche Adapter, aber kein unterschiedliches Contractverhalten haben.
3. `429` Verhalten bleibt reproduzierbar pruefbar.

## Operational Risks
1. Env-Fehlkonfigurationen koennen lokale und spaetere Public-Smokes blockieren.
2. Drift zwischen QA-Evidenz und Ops-Runbook kann Gate-Entscheidungen verzoegern.
3. Unterschiede zwischen local und public koennen spaete Integrationsfehler erzeugen.

## Next Instructions
1. Vor Epic-Gate QA-Handoff und QA-Verdict explizit gegenpruefen.
2. Ops-Doku nur auf existierende Pfade/Artefakte referenzieren.
3. DevOps- und Security-Gate vor Epic-Abschluss klar dokumentieren.
