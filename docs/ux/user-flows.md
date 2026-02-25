# User Flows

## Journey 1 Erstes Erfolgserlebnis
### Ziel
1. Nutzer versteht in einem Durchlauf die Kernaussage und die stützenden Bezüge.

### Trigger
1. Nutzer öffnet die Public Demo mit einer konkreten Systemfrage.

### Schritte
1. Nutzer liest Titel, Subline und den kurzen Hilfetext unter der Eingabe.
2. Nutzer gibt eine Frage ein und wählt Antwort anzeigen.
3. Im Antwortbereich erscheint inline der Loading Zustand.
4. Der gleiche Bereich zeigt danach die Hauptantwort.
5. Darunter erscheinen die wichtigen Bezüge.
6. Nutzer öffnet bei Bedarf die Herleitung.

### Ergebnis
1. Nutzer versteht die Kernaussage und erkennt die stützenden Bezüge ohne Kontextwechsel.

### Varianten
1. Nutzer startet mit der vorgeschlagenen Beispielfrage.
2. Nutzer startet direkt mit einer eigenen Frage.
3. Loading dauert länger, der Zustand bleibt ruhig im Antwortbereich sichtbar.

### Fehlerpfad
1. Bei Empty, Error oder Rate Limit wechselt der Ablauf in Journey 3 Recovery.

### Erfolgskriterium
1. Nutzer kann die Kernaussage und mindestens einen stützenden Bezug benennen.

## Journey 2 Plausibilitätsprüfung
### Ziel
1. Nutzer bewertet die Belastbarkeit der Antwort ohne visuelle Überlastung.

### Trigger
1. Nutzer möchte die Belastbarkeit der Antwort prüfen.

### Schritte
1. Nutzer liest zuerst die Hauptantwort vollständig.
2. Nutzer prüft die wichtigen Bezüge auf fachliche Passung.
3. Nutzer öffnet die Herleitung nur bei Bedarf.
4. Nutzer entscheidet, ob die Aussage für den aktuellen Zweck plausibel genug ist.

### Ergebnis
1. Nutzer kann die Antwort einordnen, ohne von Detailtiefe überlastet zu werden.

### Varianten
1. Hauptantwort plus Bezüge reichen für die Entscheidung.
2. Die Herleitung dient als zweite Prüfebene.
3. Nutzer präzisiert die Frage für einen zweiten Lauf.

### Fehlerpfad
1. Wenn Bezüge unklar bleiben, präzisiert der Nutzer die Frage und startet erneut.

### Erfolgskriterium
1. Nutzer kann klar benennen, ob Antwort und Bezüge zusammenpassen.

## Journey 3 Recovery bei Unsicherheit
### Ziel
1. Nutzer bleibt orientiert und kann mit einer klaren Aktion fortsetzen.

### Trigger
1. Im Antwortbereich erscheint inline ein Empty, Error oder Rate Limit Zustand.

### Schritte
1. Nutzer erkennt den Zustand direkt am Ort der erwarteten Antwort.
2. Nutzer liest Titel, kurze Erklärung und eine empfohlene Aktion.
3. Nutzer führt die empfohlene Aktion aus.
4. Nutzer startet den nächsten Versuch.

### Ergebnis
1. Nutzer bleibt orientiert und setzt den Fluss ohne zusätzliche Navigation fort.

### Varianten
1. Empty: Nutzer präzisiert die Frage.
2. Error: Nutzer versucht es erneut.
3. Rate Limit: Nutzer wartet kurz und sendet dann erneut.

### Fehlerpfad
1. Bei wiederholtem Error beendet der Nutzer den Versuch und startet später neu.

### Erfolgskriterium
1. Nutzer findet ohne Umweg die nächste sinnvolle Aktion.
