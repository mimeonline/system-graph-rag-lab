# QA Test Plan MVP

## Teststrategie
### Unit
1. Verbindlicher Mindestlauf pro Story ist der projektweite Testlauf in `apps/web`.
2. Fuer `E1-S3` deckt `src/features/seed-data/runtime-read.test.ts` Fehlerszenarien fuer fehlende Neo4j-Runtime-Variablen ab.
3. Regression fuer bereits freigegebene Storys bleibt mit `pnpm --dir apps/web test` aktiv.

### Integration
1. Story `E1-S3` wird ueber echten Neo4j-Zugriff gegen den lokalen Zielbetrieb geprueft.
2. Pflicht ist ein Runtime-Read mit echten Nodes und Relationen inklusive `sourceType` und `sourceFile`.
3. Der Integrationslauf wird mit reproduzierbarem Command und Exit-Code dokumentiert.

### E2E minimal
1. Fuer `E1-S3` ist ein lokaler Zielbetriebs-Smoke Pflicht, kein Vercel-Aura-Livecheck.
2. Vercel und Aura End-to-End bleiben fuer spaetere E4 und E5 Gates verpflichtend.

## Testumgebung
### local
1. Lauf in `apps/web` mit Next.js und lokalem Neo4j-Docker `neo4j:5.26.0`.
2. Ausgefuehrte QA-Checks: `pnpm --dir apps/web lint`, `pnpm --dir apps/web test`, `pnpm --dir apps/web build`.
3. Neo4j-Read-Smoke: `pnpm --dir apps/web exec vitest run src/features/seed-data/runtime-read.test.ts --testNamePattern "integration with neo4j|reads real nodes"`.

### vercel
1. Fuer den Story-Gate `E1-S3` nicht im Scope.
2. Public-Profil bleibt Epic-Risiko bis E4-Gates.

### aura
1. Fuer den Story-Gate `E1-S3` nicht im Scope.
2. Contract-Paritaet zu Aura bleibt offener Epic-Risikopunkt.

## Testdaten und Seed Voraussetzungen
1. Lokaler Container `neo4j-local` muss laufen und Port `7687` bereitstellen.
2. Runtime-Variablen `NEO4J_URI`, `NEO4J_DATABASE`, `NEO4J_USERNAME`, `NEO4J_PASSWORD` muessen gesetzt sein.
3. Der Integrationslauf schreibt Marker-Nodes und Marker-Edges in Neo4j und entfernt sie im Cleanup.

## Abnahmekriterien
### Story E1-S3 Szenario
1. Given: normalisierte Seed-Datenbasis mit Herkunftskennzeichnung, laufende lokale Next.js Runtime und Neo4j-Docker mit gesetzten `NEO4J_*`-Variablen.
2. When: Runtime-Read der lokal gestarteten Anwendung liest echte Nodes und Relationen direkt aus Neo4j.
3. Then: Nodes und Relationen werden fehlerfrei gelesen, Herkunftskennzeichnung `primary_md` oder `optional_internet` bleibt abrufbar, und der Lese-Smoke ist reproduzierbar dokumentiert.

### Gate-Regel
1. Story-Gate ist Pass, wenn Szenario und alle Pflichtkommandos reproduzierbar bestanden sind.
2. Story-Gate ist Fail, wenn der Neo4j-Read-Smoke nicht laeuft oder Herkunftsfelder nicht contract-konform geliefert werden.
