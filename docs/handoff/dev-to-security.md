# Dev to Security Handoff E1-S6

## Kurzer Security-Context der umgesetzten Stories
1. Story `E1-S6` betrifft den lokalen destruktiven Seed-Reset-Pfad.
2. Der Reopen-Lauf hat die bestehenden Security-Fixes verifiziert und erneut mit Tests abgesichert.

## Welche Eingaben oder Endpoints sicherheitsrelevant beruehrt wurden
1. Runtime-Eingaben: `NEO4J_URI`, `NEO4J_DATABASE`, `NEO4J_USERNAME`, `NEO4J_PASSWORD`, `ALLOW_DESTRUCTIVE_SEED_RESET`.
2. Betroffene Implementierung: `apps/web/src/features/seed-data/local-seed-reset.ts`.
3. Betroffener Command: `pnpm --dir apps/web seed:local:reset-reseed`.

## Welche bekannten Sicherheitsgrenzen oder offenen Risiken bestehen
1. Der Ablauf ist weiterhin destruktiv fuer Seed-Nodes, aber lokal und opt-in-gebunden.
2. Daten mit kollidierenden IDs koennen durch den Seed-Reset entfernt werden, da Scope auf Seed-IDs basiert.
3. Security-Gate fuer Epic E1 bleibt bis Security-Recheck formal offen.

## Welche Punkte Security im Epic-Gate gezielt pruefen soll
1. Non-local URI muss vor DB-Nutzung abgelehnt werden.
2. Fehlendes Opt-In muss vor DB-Nutzung abgelehnt werden.
3. Delete-Query muss auf `seedNodeIds` begrenzt sein.
4. Bei Guard-Fail darf kein delete-query-run stattfinden.

## Epic Gate Hinweis
1. Epic E1 ist noch nicht abgeschlossen.
2. Bei Epic-Abschluss bleiben Security Gate und DevOps Gate verpflichtend vor finaler Freigabe.
