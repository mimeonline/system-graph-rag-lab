# QA to DevOps Handoff Bootstrap

## Teststatus
1. QA-Bootstrap-Artefakte wurden erstellt.
2. Story-Gate steht aktuell auf Fail, da kein ausgefuehrter Story-QA-Lauf dokumentiert ist.
3. Epic-Gates stehen auf Fail im Bootstrap-Status.
4. Eval-Bericht liegt als Template mit initialem Fail-Status vor.

## Bekannte Einschraenkungen
1. Keine End-to-End-Messwerte fuer Latenz aus local oder public Lauf vorhanden.
2. Keine verifizierten Rate-Limit-Messreihen im Bootstrap-Lauf vorhanden.
3. Kein abgeschlossenes Security-Gate fuer ein Epic verknuepfbar.

## Monitoring Hinweise
1. Beobachte in Runtime-Logs fruehzeitig `RATE_LIMIT`, `LLM_UPSTREAM_ERROR`, `GRAPH_BACKEND_UNAVAILABLE`, `UPSTREAM_TIMEOUT`.
2. Pruefe Konsistenz zwischen `Retry-After` Header und `error.retryAfterSeconds` bei 429.
3. Pruefe `state` Mapping auf Contract-Treue gegen `retrievedNodeCount`.
4. Ergaenze Alerting fuer signifikante Zunahme von 5xx Fehlern.

## Guardrails Hinweise
1. Rate-Limit Messaging muss fuer Nutzer verstaendlich und reproduzierbar sein.
2. Secrets duerfen weder in Logs noch in Build-Ausgaben erscheinen.
3. Usage-Limit des produktiven OpenAI-Keys muss vor Public-Demo aktiv und nachweisbar bleiben.
4. Local und public muessen denselben API und Retrieval Contract einhalten.
