# Runtime Context Template v1

## Zweck
Minimaler dynamischer Kontext pro Run.

## Pflichtfelder
- `policy_ref`
- `role_ref`
- `run_mode`
- `story_id` oder `epic_id`
- `objective`
- `allowed_paths`
- `input_files`
- `constraints`
- `recent_decisions`
- `open_risks`
- `done_criteria`

## Hard Limits
- `input_files`: max 8
- `constraints`: max 7
- `recent_decisions`: max 3
- `open_risks`: max 3
- Gesamtziel: 250 bis 500 Tokens

## Minimalbeispiel
```yaml
policy_ref: core-policy-v1
role_ref: qa-v1
run_mode: review
story_id: story-012
objective: Pruefe Story-012 gegen Akzeptanzkriterien und liefere QA-Gate.
allowed_paths:
  - docs/qa/**
  - backlog/stories/story-012.md
  - backlog/progress.md
input_files:
  - backlog/stories/story-012.md
  - docs/handoff/dev-to-qa.md
constraints:
  - Keine Codeaenderungen.
  - Nur gepruefte Story synchronisieren.
recent_decisions:
  - Rate-Limit-Tests sind mandatory.
open_risks:
  - Unklare Error-Code-Mapping.
done_criteria:
  - verdict.md mit Pass oder Fail vorhanden.
```
