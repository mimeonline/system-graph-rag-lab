# QA Test Plan MVP

## Teststrategie
### Unit
1. Verbindlicher Mindestlauf pro Story ist ein story-naher Testlauf plus Projektregression in `apps/web`.
2. Fuer `E1-S2` ist der Pflichtlauf `pnpm --dir apps/web test -- src/features/seed-data/seed-data.test.ts`.
3. Zusaetzlicher Regressionslauf fuer `E1-S2` ist `pnpm --dir apps/web test`.

### Integration
1. Story-Artefakte werden gegen Akzeptanzkriterien und Dev-Handoff geprueft.
2. Fuer `E1-S2` werden Quellenkatalog, Herkunftstypen, `internalSource` und `publicReference` in `seed-data.ts` und `README.md` abgeglichen.
3. Konsistenzcheck erfolgt gegen Ontologie-Regeln aus `docs/architecture/data-model.md`.

### E2E minimal
1. Fuer `E1-S2` ist kein Runtime-E2E gegen Vercel oder Aura gate-kritisch.
2. E2E bleibt fuer `E1-S3` und spaetere Retrieval-Stories verpflichtend.

## Testumgebung
### local
1. Ausfuehrung in `apps/web` mit lokalem Node- und Package-Setup.
2. Ausgefuehrte QA-Checks fuer `E1-S2`: `pnpm --dir apps/web test -- src/features/seed-data/seed-data.test.ts`, `pnpm --dir apps/web lint`, `pnpm --dir apps/web test`, `pnpm --dir apps/web build`.

### vercel
1. Fuer `E1-S2` nicht erforderlich, da Story keine Public-Runtime-Abfrage im AK fordert.
2. Verbindlich ab `E1-S3`.

### aura
1. Fuer `E1-S2` nicht erforderlich, da Story auf kuratierte Quellenbasis im Code abzielt.
2. Verbindlich ab `E1-S3` und `E1-S4`.

## Testdaten und Seed Voraussetzungen
1. Keine externen Seeds erforderlich.
2. Seed-Daten liegen deterministisch in `apps/web/src/features/seed-data/seed-data.ts`.
3. Erwartete Herkunftstypen sind nur `primary_md` und `optional_internet`.

## Abnahmekriterien
### Story E1-S2 Szenario
1. Given: eine freigegebene Ontologie und bereitgestellte MD-Quellen.
2. When: die Quellen fuer die Seed-Datenbasis gesichtet und kuratiert werden.
3. Then: der Quellenkatalog enthaelt relevante bereitgestellte MD-Quellen, dokumentiert je Quelle `primary_md` oder `optional_internet` und markiert optionale Internet-Quellen nur als dokumentierte Lueckenergaenzung.

### Gate-Regel
1. Story-Gate ist Pass, wenn Szenario, Pflichtkommandos und Dokumentationsabgleich reproduzierbar bestanden sind.
2. Story-Gate ist Fail, wenn ein Akzeptanzkriterium, ein Pflichtkommando oder die Herkunftskennzeichnung nicht reproduzierbar belegt ist.
