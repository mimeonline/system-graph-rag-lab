# QA Memory

## Quality Focus Areas
1. Reproduzierbare Story-Gates mit Command-Evidenz und Exit Codes.
2. Konsistenz zwischen Akzeptanzkriterien, Testscope und dokumentiertem Verdict.
3. Strikte Trennung von Story-Gate und Epic-Gate.
4. Status-Sync zwischen Story-Datei und `backlog/progress.md` im selben Run.

## Known Failure Patterns
1. Story steht auf `qa`, aber es fehlt ein nachvollziehbarer QA-Lauf.
2. Story-spezifische Kommandos laufen ungewollt die Gesamtsuite und verwischen Scope-Evidenz.
3. Integrationschecks werden wegen fehlender Runtime-Variablen stillschweigend geskippt.
4. Drift zwischen QA-Artefakten und Backlog-Status.

## Eval Status
1. Story-Gates fuer E1 laufen schrittweise und werden getrennt vom Epic-Gate bewertet.
2. End-to-End-Eval bleibt bis zum expliziten Gesamtlauf offen.
3. Offene Bugs werden nach Schweregrad als blocking oder non-blocking bewertet.

## Open Quality Risks
1. Local- und Public-Laufzeit koennen unterschiedliche Failure-Modes zeigen.
2. Epic-Abnahme bleibt blockiert, solange offene Story-Gates oder Pflicht-Gates fehlen.
3. Unklare Testkommandos erhoehen Reproduktionsrisiko.

## Next Instructions
1. Story-spezifische Tests bevorzugt ueber direkte `vitest run <file>` Kommandos ausfuehren.
2. Bei `Pass` Story und Progress sofort auf `pass` synchronisieren.
3. QA-Artefakte knapp halten: Verdict, Matrix, Plan und nur noetige Bugs.
