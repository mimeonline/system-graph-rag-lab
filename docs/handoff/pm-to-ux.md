# PM to UX Handoff MVP

## MVP-Kern
1. Public Demo für Systemfragen mit klarem Frage-zu-Antwort-Fluss.
2. Antwortdarstellung enthält Hauptantwort und sichtbare Referenzkonzepte.
3. Scope bleibt auf freigegebenem Domänenrahmen von mehr als 100 Nodes und mehr als 200 Edges.
4. Referenzen und Seed-Inhalte basieren auf kuratierten MD-Quellen mit optional markierter Internet-Ergänzung bei Lücken.
5. Abnahme nutzt die verbindliche Referenzregel mit Eval-Erwartungslisten pro Frage.
6. P0 enthält nur Kernnachweis der Herleitung, P1 enthält Detailvertiefung.
7. Für Erstkontakt sind die Zustände Loading, Fehler und Leere jeweils klar unterscheidbar mit nächster Aktion.

## Harte Prioritätenreihenfolge Erstkontakt
1. Priorität 1: Nutzer kann ohne Einweisung eine Frage absenden.
2. Priorität 2: Hauptantwort ist unmittelbar erkennbar und verständlich.
3. Priorität 3: Referenzkonzepte sind klar auffindbar und von der Hauptantwort unterscheidbar.
4. Priorität 4: Bei fehlender Referenzqualität ist ein klarer Fallback-Hinweis sichtbar.
5. Priorität 5: P1-Herleitungsvertiefung darf Erstkontakt nicht blockieren.

## Top 3 User Journeys mit Priorität
1. Journey 1 Erstes Erfolgserlebnis: Nutzer öffnet die Demo, stellt eine Frage, erkennt Hauptantwort und Referenzkonzepte ohne zusätzliche Erklärung.
2. Journey 2 Plausibilitätsprüfung: Nutzer prüft, ob Referenzkonzepte die Antwort stützen, erkennt deren Herkunft und kann den Kernnachweis nachvollziehen.
3. Journey 3 Unsicherheitsfall: Nutzer erhält bei leerem Ergebnis oder Fehlerfall einen klaren Zustand mit nächster sinnvoller Aktion.

## Offene Fragen an UX
1. Welche Informationsabfolge erfüllt die Prioritäten 1 bis 3 im Erstkontakt am zuverlässigsten.
2. Welche Darstellung trennt Hauptantwort, Referenzkonzepte und deren Herkunft klar, ohne zusätzliche kognitive Last.
3. Welche Formulierung für den Fallback-Hinweis ist in Journey 3 am schnellsten verständlich.
4. Wie bleibt der P0-Kernnachweis sichtbar, ohne P1-Detailvertiefung vorwegzunehmen.
5. Welche Mindestdarstellung ist mobil erforderlich, damit die Prioritäten 1 bis 4 und die drei Pflichtzustände erhalten bleiben.
