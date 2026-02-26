# QA Memory

## Quality Focus Areas
1. Story-Gates mit klarer Command-Evidenz und Exit Codes dokumentieren.
2. AK-Abdeckung strikt auf Given When Then pruefen und in Matrix plus Verdict spiegeln.
3. Security-Recheck fuer lokale destruktive Ablaufe mit Guard- und Delete-Scope-Nachweis pro Story dokumentieren.
4. Story-Status und `backlog/progress.md` im selben Run synchron halten.

## Known Failure Patterns
1. Story-spezifische Tests werden durch breite Suite-Laeufe unscharf, wenn `pnpm test -- <file>` statt direktem Vitest-Run genutzt wird.
2. Integrationspfade gegen Neo4j koennen wegen fehlender Env-Variablen stillschweigend geskippt werden.
3. Drift zwischen QA-Artefakten und Backlog-Status.
4. Security-Finding-Dateien koennen formal `Open` bleiben, obwohl QA-Recheck-Tests bereits gruen sind.

## Eval Status
1. Story-Gate `E1-S6` wurde am 2026-02-26 mit `Pass` abgeschlossen.
2. Security-Recheck-Tests fuer `E1-S6` wurden am 2026-02-26 erneut erfolgreich ausgefuehrt.
3. Eval-Set mit fuenf Fragen ist weiterhin nicht ausgefuehrt und bleibt `Fail` auf Laufebene.
4. Epic-Gate `E1` bleibt `Fail`, bis Security- und DevOps-Gates abgeschlossen sind.

## Open Quality Risks
1. Local-Pass garantiert keine Public-Paritaet auf Vercel plus Aura.
2. Reset-Reseed ist env-abhaengig und kann bei falscher Konfiguration lokal destruktiv wirken.
3. Story-Handoffs enthalten teils unpraezise Story-Testkommandos mit zu breitem Scope.
4. Ausstehende Epic-Gates blockieren die belastbare E1-Freigabe.

## Next Instructions
1. Security soll den formalen Status der Findings und des Blockers fuer E1-S6 nach Recheck aktualisieren.
2. Dev soll Story- und Handoff-Testkommandos fuer E1-S6 auf direkten Vitest-Scoped-Run normieren.
3. DevOps-Gate fuer E1 mit Fokus auf Local-versus-Public-Betriebsparitaet ausfuehren.
4. Vor finaler Epic-Abnahme den vollstaendigen Eval-Lauf fuer Q1 bis Q5 ausfuehren.
