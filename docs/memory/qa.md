# QA Memory

## Quality Focus Areas
1. Story-Gates mit klarer Command-Evidenz und Exit Codes dokumentieren.
2. AK-Abdeckung strikt auf Given When Then pruefen und in Matrix plus Verdict spiegeln.
3. Story-Status und `backlog/progress.md` im selben Run synchron halten.
4. Destruktive lokale Seed-Ablaufe nur mit expliziter Runtime-Evidenz und Read-Checks freigeben.

## Known Failure Patterns
1. Story steht auf `qa`, aber QA-Evidenz ist nicht vollstaendig dokumentiert.
2. Story-spezifische Tests werden durch breite Suite-Laeufe unscharf.
3. Integrationspfade gegen Neo4j koennen wegen fehlender Env-Variablen stillschweigend geskippt werden.
4. Drift zwischen QA-Artefakten und Backlog-Status.

## Eval Status
1. Story-Gate `E1-S6` wurde am 2026-02-26 mit `Pass` abgeschlossen.
2. Eval-Set mit fuenf Fragen ist weiterhin nicht ausgefuehrt und bleibt `Fail` auf Laufebene.
3. Epic-Gate `E1` bleibt `Fail`, bis Security- und DevOps-Gates abgeschlossen sind.

## Open Quality Risks
1. Local-Pass garantiert keine Public-Paritaet auf Vercel plus Aura.
2. Reset-Reseed ist env-abhaengig und kann bei falscher Konfiguration lokal destruktiv wirken.
3. Ausstehende Epic-Gates blockieren die belastbare E1-Freigabe.

## Next Instructions
1. Security-Gate fuer E1 mit Fokus auf Secret-Hygiene und lokalen Reset-Guardrails ausfuehren.
2. DevOps-Gate fuer E1 mit Fokus auf Local-versus-Public-Betriebsparitaet ausfuehren.
3. Vor finaler Epic-Abnahme den vollstaendigen Eval-Lauf fuer Q1 bis Q5 ausfuehren.
