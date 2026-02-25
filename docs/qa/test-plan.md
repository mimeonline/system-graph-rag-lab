# QA Test Plan MVP

## Teststrategie
### Unit
1. Verbindlicher Mindestlauf pro Story ist `pnpm test` im relevanten Projektpfad.
2. Fokus fuer `E1-S1` liegt auf Vollstaendigkeit der Ontologie-Typen und Relationstabellen.

### Integration
1. Verbindlicher Story-Check gegen Story-Artefakte und Vertragskontext aus `docs/spec/**` und `docs/architecture/**`.
2. Fuer `E1-S1` wird geprueft, dass dokumentierte Ontologie-Regeln mit der implementierten Definition konsistent sind.

### E2E minimal
1. E2E ist fuer `E1-S1` nicht gate-kritisch, da Story nur fachliche Ontologie-Definition ohne Runtime-Endpunkt liefert.
2. E2E bleibt Pflicht fuer spaetere Stories mit Datenzugriff und Antwortpipeline.

## Testumgebung
### local
1. Ausfuehrung in `apps/web` mit lokalem Node- und Package-Setup.
2. QA-Checks in diesem Run: `pnpm test`, `pnpm lint`, `pnpm build`.

### vercel
1. Fuer `E1-S1` nicht erforderlich, da keine Public-Runtime-Funktion geliefert wird.
2. Wird ab Stories mit Runtime-Verhalten verpflichtend.

### aura
1. Fuer `E1-S1` nicht erforderlich, da keine Datenbankinteraktion im Story-Scope liegt.
2. Wird ab Seed- und Retrieval-Stories verpflichtend.

## Testdaten und Seed Voraussetzungen
1. Kein Seed-Datensatz erforderlich fuer `E1-S1`.
2. Erforderlich sind die fuenf Node-Typen `Concept`, `Tool`, `Author`, `Book`, `Problem`.
3. Erforderlich sind die sechs Relationen `WROTE`, `EXPLAINS`, `ADDRESSES`, `RELATES_TO`, `INFLUENCES`, `CONTRASTS_WITH`.

## Abnahmekriterien
### Story E1-S1 Szenario
1. Given: ein leeres Wissensmodell.
2. When: die Ontologie dokumentiert wird.
3. Then: die Typen `Concept`, `Tool`, `Author`, `Book`, `Problem` und ihre erlaubten Beziehungen sind klar beschrieben.

### Gate-Regel
1. Story-Gate ist Pass, wenn Szenario, Unit-Checks und Dokumentationsabgleich reproduzierbar bestanden sind.
2. Story-Gate ist Fail, wenn mindestens ein Akzeptanzkriterium fehlt oder eine Evidenz nicht reproduzierbar ist.
