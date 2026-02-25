# User Flows

## Journey 1 Erstes Erfolgserlebnis
### Trigger
1. Nutzer öffnet die Public Demo mit einer konkreten Systemfrage im Kopf.

### Schritte
1. Nutzer liest die kurze Einstiegszeile mit dem Nutzenversprechen.
2. Nutzer gibt eine Frage in das zentrale Eingabefeld ein.
3. Nutzer startet die Anfrage.
4. Nutzer sieht zuerst den Ladezustand mit ruhiger Rückmeldung.
5. Nutzer erhält die Hauptantwort.
6. Nutzer sieht direkt darunter die referenzierten Konzepte.
7. Nutzer sieht den knappen Kernnachweis zur Herleitung.

### Ergebnis
1. Nutzer versteht Antwort und Herkunft ohne zusätzliche Erklärung.

### Varianten
1. Nutzer nutzt eine vorgeschlagene Beispielfrage statt eigener Eingabe.
2. Nutzer passt die Frage nach erster Antwort einmal an und sendet erneut.

## Journey 2 Plausibilitätsprüfung
### Trigger
1. Nutzer möchte prüfen, ob die Antwort durch den Graph belastbar gestützt wird.

### Schritte
1. Nutzer liest die Hauptantwort vollständig.
2. Nutzer öffnet den Bereich Referenzkonzepte.
3. Nutzer prüft pro Konzept den sichtbaren Bezug zur Antwort.
4. Nutzer öffnet den Kernnachweis.
5. Nutzer verifiziert, ob der Nachweis zur Frage passt.

### Ergebnis
1. Nutzer kann die Antwort als plausibel oder als unsicher einstufen.

### Varianten
1. Nutzer erkennt ausreichende Plausibilität und beendet die Session.
2. Nutzer erkennt Lücke und stellt eine präzisere Folgefrage.

## Journey 3 Unsicherheitsfall und Recovery
### Trigger
1. Anfrage liefert kein verwertbares Ergebnis oder endet im Fehlerzustand.

### Schritte
1. Nutzer erhält einen klar benannten Zustand für leeres Ergebnis, Fehler oder Rate Limit.
2. Nutzer liest die konkrete nächste Aktion im Statusblock.
3. Nutzer wählt die empfohlene Aktion.
4. Nutzer sendet erneut oder wartet gemäß Hinweis.

### Ergebnis
1. Nutzer bleibt orientiert und kann ohne Frust fortsetzen.

### Varianten
1. Empty: Nutzer konkretisiert die Frage mit mehr Kontext.
2. Error: Nutzer versucht es erneut mit unveränderter Frage.
3. Rate Limit: Nutzer wartet die genannte Zeit und sendet danach erneut.
