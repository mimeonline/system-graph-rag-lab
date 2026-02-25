# Eval Rubric MVP Bootstrap

## Eval Fragen
### Frage Q1
1. Frage: Wie wirken Feedback Loops auf lokale Optimierung in komplexen Systemen?
2. Expected References: `concept:feedback_loops`, `problem:local_optimization`, `concept:leverage_points`.

### Frage Q2
1. Frage: Welche Rolle spielen Leverage Points fuer nachhaltige Systemveraenderung?
2. Expected References: `concept:leverage_points`, `book:thinking_in_systems`, `concept:feedback_loops`.

### Frage Q3
1. Frage: Wie unterscheiden sich verstaerkende und ausgleichende Rueckkopplungen?
2. Expected References: `concept:feedback_loops`, `concept:contrasts_with`, `concept:system_behavior`.

### Frage Q4
1. Frage: Warum scheitert lokale Optimierung haeufig auf Gesamtsystemebene?
2. Expected References: `problem:local_optimization`, `concept:feedback_loops`, `concept:system_boundary`.

### Frage Q5
1. Frage: Wie hilft System Thinking bei der Priorisierung von Interventionen?
2. Expected References: `concept:leverage_points`, `concept:system_boundary`, `book:thinking_in_systems`.

## Bewertungskriterien pro Frage
1. Kriterium A: `answer.main` ist fachlich konsistent, nicht leer und beantwortet die Frage direkt.
2. Kriterium B: `answer.coreRationale` ist vorhanden und als knapper Kernnachweis nachvollziehbar.
3. Kriterium C: Es werden bis zu drei Referenzkonzepte gezeigt und mindestens zwei davon sind in der Expected-Reference-Liste oder es existiert ein klarer Fallback-Hinweis.
4. Kriterium D: Response-Contract ist gueltig mit `status`, `state`, `requestId`, `meta` und konsistenten Limits.
5. Kriterium E: Antwortlatenz liegt im akzeptierten Bereich fuer Smoke-Tests und wird pro Lauf dokumentiert.

## Pass und Fail Regeln
1. Frage-Pass gilt nur, wenn Kriterien A bis D bestanden sind.
2. Frage-Fail gilt, wenn eines der Kriterien A bis D failt.
3. Kriterium E ist Beobachtungskriterium fuer Risiko, kein harter Einzelblocker im Bootstrap.
4. Gesamt-Pass fuer den Abnahmelauf erfordert mindestens 4 von 5 Frage-Passes.
5. Gesamt-Fail gilt bei weniger als 4 von 5 Frage-Passes.

## Hinweise zu Expected References
1. Wenn fuer eine Frage mindestens drei geeignete Konzepte verfuegbar sind, muss die Expected-Reference-Liste mindestens drei Eintraege enthalten.
2. Wenn weniger als drei geeignete Konzepte verfuegbar sind, muss der Lauf einen klaren Fallback-Hinweis enthalten.
3. Erwartungslisten muessen vor dem Abnahmelauf freigegeben und versioniert sein.
