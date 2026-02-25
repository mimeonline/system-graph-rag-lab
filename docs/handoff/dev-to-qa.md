# Dev to QA Handoff

## Was ist fertig
1. `apps/web` ist als Next.js `16.1.6` App mit TypeScript und `strict=true` aufgebaut.
2. Tailwind ist aktiv, shadcn/ui-Basis ist vorbereitet (`components.json`, `cn` Utility, `Button` Basis).
3. Atomic-Design-Grundstruktur ist angelegt: `atoms`, `molecules`, `organisms`, `templates`.
4. API-Skelett für `POST /api/query` ist vorhanden unter `src/app/api/query/route.ts`.
5. Request-Validierung und Contract-nahes Response-Mapping sind als Bootstrap-Logik implementiert.
6. Env-Handling ist vorbereitet mit `apps/web/.env.example` und lokaler `apps/web/.env.local`.
7. Tests und Verifikationsbefehle sind eingerichtet und erfolgreich ausgeführt.

## Welche Stories wurden umgesetzt
1. Keine fachliche Story umgesetzt.
2. Dieser Run ist reines `RUN_MODE=bootstrap` Grundgerüst.

## Wie QA lokal testen kann
1. In das Projektverzeichnis wechseln.
2. `cd apps/web`
3. `pnpm install --frozen-lockfile` ausführen.
4. `pnpm lint`
5. `pnpm test`
6. `pnpm build`
7. Optional Laufzeitstart: `pnpm dev` und danach Request ausführen:
```bash
curl -s -X POST http://localhost:3000/api/query \
  -H 'Content-Type: application/json' \
  -d '{"query":"Wie wirken Feedback Loops auf lokale Optimierung?"}'
```

## Testdaten oder Seeds
1. Für den Bootstrap sind keine Seed-Daten erforderlich.
2. Der Endpoint liefert absichtlich ein `state=empty` Bootstrap-Response.

## Bekannte Einschränkungen
1. Retrieval-Pipeline gegen Neo4j ist noch nicht implementiert.
2. OpenAI-Aufruf ist noch nicht implementiert.
3. Rate-Limit-Adapter ist noch nicht implementiert.
4. Endpoint dient aktuell als Contract-Skelett und nicht als fachliche Antwortpipeline.

## Erwartete Failure Modes
1. Fehlendes `OPENAI_MODEL` liefert `500 INTERNAL_ERROR`.
2. Ungültiger Request-Body liefert `400 INVALID_REQUEST`.
3. Fachliche States wie `answer` fehlen bis zu den Story-Implementierungen.

## Verifikationskommandos und Ergebnis
1. `pnpm lint` erfolgreich.
2. `pnpm test` erfolgreich, 2 Testdateien und 5 Tests bestanden.
3. `pnpm typecheck` erfolgreich.
4. `pnpm build` erfolgreich, Route `/api/query` gebaut.

## Blocker
1. Keine Docker-Setup-Artefakte für lokales Neo4j im Dev-Schreibbereich vorhanden.
2. Falls Docker-Artefakte unter nicht erlaubten Pfaden ergänzt werden müssen, ist Architect oder DevOps-Handover erforderlich.
