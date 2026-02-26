# Runtime Context Template v1

## Zweck
Dieser Block ist der dynamische Kontextschnipsel pro Run. Nur diese Informationen wechseln typischerweise zwischen Stories.

## Pflichtfelder
- `policy_ref`: z. B. `core-policy-v1`
- `role_ref`: z. B. `pm-v1`, `qa-v1`, `architect-v1`
- `run_mode`: `bootstrap|review|hardening`
- `story_id` oder `epic_id`
- `objective`: 1 bis 3 Saetze
- `allowed_paths`: konkrete Pfade fuer diesen Lauf
- `input_files`: konkrete Dateien fuer diesen Lauf
- `constraints`: 3 bis 7 harte Regeln nur fuer diesen Lauf
- `recent_decisions`: maximal 5 Punkte
- `open_risks`: maximal 5 Punkte
- `done_criteria`: klare Exit-Kriterien

## Token-Budget-Regeln
- Runtime-Block maximal 400 bis 800 Tokens.
- Alte Historie nicht wiederholen, nur Rolling Summary.
- Nur Dateien nennen, die fuer den aktuellen Lauf relevant sind.

## Beispiel
```yaml
policy_ref: core-policy-v1
role_ref: qa-v1
run_mode: review
story_id: story-012
objective: >
  Pruefe Story-012 gegen Akzeptanzkriterien und liefere ein reproduzierbares QA-Gate-Verdikt.
allowed_paths:
  - docs/qa/**
  - docs/handoff/qa-to-devops.md
  - docs/memory/qa.md
  - backlog/stories/story-012.md
  - backlog/progress.md
input_files:
  - backlog/stories/story-012.md
  - backlog/progress.md
  - docs/handoff/dev-to-qa.md
constraints:
  - Keine Codeaenderungen.
  - Story-Status nur auf pass oder blocked synchronisieren.
  - Verdict muss reproduzierbar begruendet sein.
recent_decisions:
  - Rate-Limit-Tests sind fuer MVP mandatory.
open_risks:
  - Unklare Error-Code-Mapping in API-Antworten.
done_criteria:
  - verdict.md mit Pass oder Fail vorhanden.
  - Status in Story und progress.md synchronisiert.
```
