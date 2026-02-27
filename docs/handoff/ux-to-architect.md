# UX to Architect Handoff

## Story Scope
1. Dieser Handoff deckt Story `E4-S5 Public Plattform Setup vorbereiten` ab.
2. Fokus ist UX fuer sichtbare Plattform-Readiness und stabile State-Kommunikation im Public MVP.
3. Keine Architektur- oder API-Entscheidung wird hier festgelegt.

## Verbindliche UX Entscheidungen
1. Hauptfluss bleibt unveraendert: Eingabe, Antwort, Bezuege, Herleitung.
2. Plattform-Status wird als eigene, leise Kontextflaeche dargestellt.
3. Plattform-Status enthaelt genau vier Zeilen: `Setup Status`, `Deployment`, `Secrets`, `Nutzungsschutz`.
4. States `Loading`, `Empty`, `Error`, `Rate Limit` erscheinen ausschliesslich inline im Antwortbereich.
5. Pro Zustand gibt es genau eine empfohlene Aktion.
6. Mobile zeigt denselben Inhalt in gleicher Reihenfolge, mit Sticky Primaeraktion.

## Architect Ready UX Anforderungen
### Benoetigte UI-Signale fuer Rendering
1. Signal fuer Plattform-Readiness mit mindestens zwei Werten: bereit oder in Vorbereitung.
2. Signal fuer Deployment-Hinweis mit neutralem oder positivem Textstatus.
3. Signal fuer Secret-Hygiene-Hinweis mit neutralem oder positivem Textstatus.
4. Signal fuer Nutzungsschutz-Hinweis zu Lastspitzen.
5. Signal fuer Antwortzustand mit den vier Werten `loading`, `empty`, `error`, `rate_limit`.

### Verhaltensregeln fuer Mapping
1. Wenn ein Antwortzustand aktiv ist, ersetzt er den Antwortinhalt im selben Container.
2. Plattform-Status bleibt auch bei Antwortzustand sichtbar, aber ohne konkurrierende Fehlermeldung.
3. `rate_limit` wird nie als generischer `error` beschriftet.
4. `empty` wird nur verwendet, wenn kein ausreichend passender Kontext vorliegt.

## Offene Fragen an Architect
1. Welche bestehenden Runtime-Signale koennen die vier Plattform-Statuszeilen speisen, ohne neue Produktflaechen zu oeffnen?
2. Ist fuer `rate_limit` eine verlässliche Retry-Spanne als Klartext verfuegbar oder bleibt die Formulierung bewusst generisch?
3. Wie wird systematisch getrennt zwischen `empty` und `error`, damit die UX-Aktion immer korrekt ist?
4. Gibt es eine stabile Quelle fuer den Deployment-Hinweis, die ohne URL-Anzeige auskommt?

## Input Referenzen fuer diesen Run
1. `docs/handoff/pm-to-ux.md`
2. `backlog/stories/e4-s5-public-plattform-setup.md`
3. `docs/ops/vercel.md`
4. `apps/web/.env.example`
5. `docs/discovery/feature-kickoff.md`

## Erwartung an Folge-Handoff Architect to Dev
1. Klare Zuordnung der benoetigten UI-Signale zu bestehenden Runtime-Daten.
2. Explizites Mapping fuer `loading`, `empty`, `error`, `rate_limit`.
3. Bestaetigung, dass die UX-Reihenfolge und Inhaltspriorisierung unveraendert umgesetzt werden.
