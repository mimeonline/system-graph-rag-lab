# Low Token Orchestrator Checklist

## Ziel
Jeden Run mit minimalem Kontext starten.

## Vor Spawn
1. Nutze nur ein kurzes Runtime-Objekt nach `runtime-context-template-v1.md`.
2. Begrenze `input_files` auf maximal 8.
3. Entferne doppelte Constraints, Decisions und Risks.
4. Sende keine Historie, nur Rolling Summary.
5. Nutze Standardmodell `gpt-5.1-codex-mini`.

## Eskalation
Nur auf groesseres Modell eskalieren bei:
1. wiederholtem Schema-Fail
2. kritischem Security-Blocker
3. architekturellem Richtungsentscheid mit hoher Unsicherheit

## Tracking pro Run
- role
- model
- story_id oder epic_id
- input_tokens
- output_tokens
- cached_tokens
- cost
- latency
