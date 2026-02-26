# Story E2-S1 Kontextkandidaten pro Frage bereitstellen

## Status
pass

## Umsetzung
1. Deterministische Keyword-Matching-Indizierung aller Seed-Nodes über Titel + Summary.
2. Stabilisierte Sortierung nach Score, Hop, Node-Type und Node-ID mit TOP_K=6.
3. Tokenbudget wird bei Kontextzusammenstellung strikt geprüft, Deduplizierung über Node-ID natürlich gegeben.
4. API-Antwort setzt `state="answer"` sobald Referenzen vorliegen, meta-Felder spiegeln Tokenverbrauch sowie Anzahl wider.

## Tests
1. `pnpm --dir apps/web test -- src/features/query/retrieval.test.ts`
2. `pnpm --dir apps/web test -- src/app/api/query/route.test.ts`

## Ziel
Zu einer Nutzerfrage belastbare Kontextkandidaten in definierter Struktur liefern.

## Priorität
P0

## Abhängigkeiten
1. E1-S2

## Aufwand
<= 1 Tag

## Akzeptanzkriterien
### Szenario 1: Kernverhalten

**Given**
eine Nutzerfrage und verfügbare Wissensbasis

**When**
die Kontextsuche ausgeführt wird

**Then**
1. Das System liefert eine Kandidatenliste ohne Duplikate.
2. Bei drei identischen Testläufen im selben Datenstand bleibt die Reihenfolge der ersten drei Kandidaten identisch.

## Test Notes
Prüfe für dieselbe Frage drei Läufe hintereinander auf identische Top-3-Reihenfolge und Duplikatfreiheit.
