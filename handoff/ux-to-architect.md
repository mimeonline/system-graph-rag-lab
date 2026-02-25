# UX to Architect Handoff

## MVP UX Kern
1. Eine ruhige Einseiten-Demo führt von Frage zu Hauptantwort zu Referenzkonzepten.
2. Retrieval-Transparenz wird über sichtbare Referenzkonzepte und einen einklappbaren Kernnachweis erreicht.
3. Die Hauptantwort bleibt visuell und inhaltlich primär, Detailtiefe bleibt nachgelagert.
4. Jeder nicht reguläre Zustand enthält genau eine klare nächste Aktion.

## Drei Journeys in Kurzform
1. Erstes Erfolgserlebnis: Frage eingeben, Antwort verstehen, Referenzkonzepte erkennen.
2. Plausibilitätsprüfung: Antwort lesen, Referenzkonzepte prüfen, Kernnachweis öffnen.
3. Unsicherheitsfall: Empty, Error oder Rate Limit verstehen und mit klarer Aktion fortsetzen.

## UI States
1. Loading: Nutzer erhält ruhige Rückmeldung, dass Konzepte gesucht und Antwort aufgebaut wird.
2. Empty: Nutzer erfährt, dass keine belastbare Antwort vorliegt und wie die Frage zu präzisieren ist.
3. Error: Nutzer erhält neutralen Fehlerhinweis und Retry-Aktion.
4. Rate Limit: Nutzer erhält kurze Warteanweisung und erneute Sendeoption.

## Offene Fragen an Architect
1. Welche Retrieval-Details sind im P0 fachlich belastbar darstellbar, ohne interne Komplexität offenzulegen.
2. Welche minimale Granularität der Referenzkonzepte ist konsistent mit der Retrieval-Pipeline.
3. Welche Form des Kernnachweises ist im P0 stabil lieferbar, damit UX-Text und Datenstruktur sauber zusammenpassen.
4. Welche Signale erlauben im Ergebnisfall einen sicheren Empty-Fallback statt irreführender Antwort.
5. Welche Rate-Limit-Information darf im UI konkret gezeigt werden, ohne Angriffsfläche oder Fehlanreize zu erzeugen.

## UX Constraints
1. UI wirkt ruhig, hochwertig und selbsterklärend im Erstkontakt.
2. Oberfläche bleibt bewusst reduziert und nicht überladen.
3. Informationsabfolge bleibt strikt Frage, Antwort, Referenz, Nachweis.
4. Keine P1-Herleitungsvertiefung in der Primäransicht.
