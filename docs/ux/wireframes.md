# Wireframes

## Hauptansicht Public MVP
### Zweck
1. Ruhiger, professioneller Erstkontakt mit klarer Führung von Frage zu Antwort.

### Layoutstruktur
1. Header ist full width, kompakt und visuell zurückhaltend.
2. Content Area ist zentriert mit fester max width und klarer vertikaler Reihenfolge.
3. Reihenfolge im Content bleibt verbindlich: Eingabe, Antwortbereich, wichtige Bezüge, Herleitung.
4. Footer ist full width und schließt die Seite als ruhiger Abschluss.

### Komponentenrollen
1. Header dient nur der Einordnung und trägt keine sekundären Aktionen.
2. Eingabekarte startet den Hauptfluss.
3. Antwortbereich zeigt Hauptantwort oder einen Inline Zustand an derselben Stelle.
4. Wichtige Bezüge stützen die Hauptantwort und bleiben visuell sekundär.
5. Herleitung ist optional und standardmäßig geschlossen.
6. Retrieval-Details sind optional und nachgelagert zur Herleitung.

### Interaktionen
1. Primäraktion Antwort anzeigen steht auf Desktop direkt in der Eingabekarte.
2. Primäraktion erscheint auf Mobile als Sticky Footer Bar über volle Breite.
3. Disclosure 1 öffnet oder schließt die Herleitung.
4. Disclosure 2 öffnet oder schließt Retrieval-Details als zusätzliche Vertiefung.

### States
1. Loading erscheint inline im Antwortbereich mit Warteführung.
2. Empty erscheint inline im Antwortbereich mit Präzisierungsführung.
3. Error erscheint inline im Antwortbereich mit Retry Führung.
4. Rate Limit erscheint inline im Antwortbereich mit kurzer Warteführung.
5. Es gibt keine permanente Zustands-Seitenleiste.

### Progressive Disclosure
1. Stufe 1: Hauptantwort ist direkt sichtbar.
2. Stufe 2: Wichtige Bezüge sind direkt sichtbar und untergeordnet.
3. Stufe 3: Herleitung ist optional über Disclosure.
4. Stufe 4: Retrieval-Details sind optional über zweite Disclosure.
