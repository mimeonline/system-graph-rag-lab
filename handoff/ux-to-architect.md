# UX to Architect Handoff

## MVP UX Kern
1. Verbindliche UX Referenzen liegen in `docs/ux/mock.html`, `docs/ux/ui-style.md` und `docs/ux/visual-guidelines.md`.
2. Primärfluss bleibt unverändert: Frageeingabe, Hauptantwort, Referenzkonzepte, P0 Kernnachweis.
3. Visual Ziel bleibt ruhig, hochwertig, selbsterklärend und nicht überladen.
4. Light Theme ist für P0 als verbindlicher Stilrahmen definiert.

## Drei Journeys in Kurzform
1. Erstes Erfolgserlebnis: Frage stellen, Hauptantwort verstehen, Referenzkonzepte sehen.
2. Plausibilitätsprüfung: Referenzkonzepte prüfen und P0 Kernnachweis öffnen.
3. Recovery: Empty, Error oder Rate Limit erkennen und mit klarer Aktion fortsetzen.

## UI States
1. Loading: Antwort wird hergeleitet, Nutzer wartet.
2. Empty: Keine belastbare Antwort, Nutzer präzisiert die Frage.
3. Error: Anfrage konnte nicht verarbeitet werden, Nutzer versucht erneut.
4. Rate Limit: Kurz pausieren, Nutzer sendet nach kurzer Wartezeit erneut.

## Offene Fragen an Architect je Screen
### Screen Hauptansicht P0
1. Welche minimalen Felder für Referenzkonzepte sind stabil verfügbar.
2. Welche Felder für den P0 Kernnachweis sind stabil verfügbar.
3. Ob pro Referenzkonzept ein kurzer Kontextsatz zuverlässig lieferbar ist.

### Screen Zustände P0
1. Welche fachliche Regel entscheidet robust zwischen Empty und schwacher Antwort.
2. Ob eine konkrete Wartezeit im Rate Limit Zustand sicher und stabil angezeigt werden kann.

### Screen Hauptansicht P1
1. Ob zusätzliche Nachweisdetails später ohne Bruch der P0 Informationshierarchie integrierbar sind.

## UX Constraints
1. Informationsreihenfolge bleibt strikt erhalten.
2. Pro Zustand existiert genau eine empfohlene Aktion.
3. Hauptantwort bleibt visuell und inhaltlich primär.
4. Accessibility Mindestregeln müssen erfüllbar sein: AA Kontrast, sichtbarer Fokus, vollständige Tastaturbedienung.
5. Desktop und Mobile behalten denselben semantischen Fluss.

## Annahmen
1. P0 liefert pro Antwort mindestens einen kompakten Nachweispfad.
2. Referenzkonzepte können mit kurzen menschenlesbaren Namen dargestellt werden.
3. Rate Limit wird als eigener Zustand zuverlässig signalisiert.

## Harte Anforderungen
1. Keine Scope-Erweiterung über die vorhandene Pflichtansicht hinaus.
2. Keine P1 Vertiefung in der Primäransicht.
3. UI bleibt ruhig, polished und nicht überladen.
4. Alle vier Zustände bleiben mit klarer Textaktion darstellbar.
