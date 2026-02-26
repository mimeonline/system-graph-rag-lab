# QA Memory

## Quality Focus Areas
1. Story-Gates mit klarer Command-Evidenz und Exit Codes dokumentieren.
2. AK-Abdeckung strikt auf Given When Then pruefen und in Matrix plus Verdict spiegeln.
3. Story-Status und `backlog/progress.md` im selben Run synchron halten.
4. Story-Gate und Epic-Gate weiterhin getrennt bewerten.

## Known Failure Patterns
1. Story steht auf `qa`, aber QA-Evidenz ist nicht vollstaendig dokumentiert.
2. Story-spezifische Tests werden durch breite Suite-Laeufe unscharf.
3. Integrationspfade gegen Neo4j koennen wegen fehlender Env-Variablen stillschweigend geskippt werden.
4. Drift zwischen QA-Artefakten und Backlog-Status.

## Eval Status
1. Story-Gate `E1-S5` wurde am 2026-02-25 mit `Pass` abgeschlossen.
2. Eval-Set mit fuenf Fragen ist weiterhin nicht ausgefuehrt und bleibt `Fail` auf Laufebene.
3. Epic-Gate `E1` bleibt `Fail`, bis `E1-S6` sowie Security- und DevOps-Gates abgeschlossen sind.

## Open Quality Risks
1. Local-Pass garantiert keine Public-Paritaet auf Vercel plus Aura.
2. Env-abhaengige Runtime-Read-Tests koennen weiterhin teilweise skippbar sein.
3. Ausstehender E1-S6-Gate blockiert die Epic-Abnahme.

## Next Instructions
1. E1-S6 mit reproduzierbarem Reset- und Reseed-Lauf als naechsten Story-Gate-Run pruefen.
2. Danach Epic-Gates Security und DevOps fuer E1 mit QA-Artefakten verknuepfen.
3. Vor Epic-Abnahme den vollstaendigen Eval-Lauf fuer Q1 bis Q5 ausfuehren.
