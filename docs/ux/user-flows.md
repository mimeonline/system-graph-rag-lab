# User Flows

## Journey 1 Erstes Erfolgserlebnis
### Ziel
1. Nutzer versteht in einem Durchlauf Antwort und Herkunft.

### Trigger
1. Nutzer öffnet die Public Demo mit einer konkreten Systemfrage.

### Schritte
1. Nutzer liest Titel und Subline.
2. Nutzer gibt eine Frage in die Eingabe ein.
3. Nutzer startet die Analyse.
4. Nutzer sieht den Loading Zustand.
5. Nutzer liest die Hauptantwort.
6. Nutzer sieht Referenzkonzepte.
7. Nutzer öffnet den P0 Kernnachweis.

### Ergebnis
1. Nutzer kann den Grundgedanken der Antwort nachvollziehen.

### Varianten
1. Nutzer nutzt die vorbefüllte Beispielfrage.
2. Nutzer stellt direkt eine eigene Frage.

### Fehlerpfad
1. Bei Error oder Rate Limit wechselt der Nutzer in Journey 3 Recovery.

### Erfolgskriterium
1. Nutzer kann in eigenen Worten den zentralen Trade off und mindestens ein Referenzkonzept benennen.

## Journey 2 Plausibilitätsprüfung
### Ziel
1. Nutzer bewertet die Belastbarkeit der Antwort.

### Trigger
1. Nutzer möchte die Herleitung zur Hauptantwort prüfen.

### Schritte
1. Nutzer liest die Hauptantwort vollständig.
2. Nutzer vergleicht Referenzkonzepte mit der Kernaussage.
3. Nutzer öffnet den P0 Kernnachweis.
4. Nutzer prüft, ob der Nachweis zur Frage passt.

### Ergebnis
1. Nutzer stuft die Antwort als plausibel oder unsicher ein.

### Varianten
1. Nutzer akzeptiert die Antwort und beendet die Session.
2. Nutzer präzisiert die Frage für einen zweiten Lauf.

### Fehlerpfad
1. Bei fehlender Stützung durch Referenzkonzepte wechselt der Nutzer zurück zur Eingabe und präzisiert den Prompt.

### Erfolgskriterium
1. Nutzer kann klar sagen, ob Antwort und Referenzen zusammenpassen.

## Journey 3 Recovery bei Unsicherheit
### Ziel
1. Nutzer bleibt orientiert und kann kontrolliert fortsetzen.

### Trigger
1. System zeigt Empty, Error oder Rate Limit.

### Schritte
1. Nutzer erkennt den benannten Zustand.
2. Nutzer liest die eine empfohlene Aktion.
3. Nutzer führt die Aktion aus.
4. Nutzer startet einen neuen Versuch.

### Ergebnis
1. Nutzer setzt den Fluss ohne Frust fort.

### Varianten
1. Empty: Nutzer konkretisiert die Frage.
2. Error: Nutzer versucht erneut mit gleicher Frage.
3. Rate Limit: Nutzer wartet kurz und sendet erneut.

### Fehlerpfad
1. Bei wiederholtem Error beendet der Nutzer die Session mit klarer Erwartung, später erneut zu testen.

### Erfolgskriterium
1. Nutzer findet innerhalb eines Schritts eine nächste sinnvolle Aktion.
