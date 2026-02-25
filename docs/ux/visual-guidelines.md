# Visual Guidelines

## Zweck
1. Dieses Dokument operationalisiert den Light Theme Stil für konsistente UX Entscheidungen im MVP.
2. Fokus bleibt auf ruhiger, hochwertiger und selbsterklärender Darstellung.

## Visuelle Prinzipien
1. Primärfokus liegt auf Frage und Hauptantwort.
2. Sekundäre Information bleibt sichtbar, aber visuell untergeordnet.
3. Detailtiefe wird erst über Disclosure geöffnet.
4. Jede Fläche hat einen klaren Informationszweck.

## Farbrollen
1. Hintergrundfarbe trägt Ruhe und trennt die App von der Browserfläche.
2. Surface Farbe markiert interaktive und inhaltliche Karten.
3. Primärtextfarbe trägt die Hauptleselast.
4. Sekundärtextfarbe trägt Hilfen und Metaebenen.
5. Brand Farbe markiert nur Primäraktion und aktive Hervorhebung.
6. Statusfarben markieren Loading, Empty, Error und Rate Limit konsistent.

## Flächennutzung und Dichte
1. Weißraum steuert Lesetempo und Orientierung.
2. Kartenflächen bleiben ruhig ohne dekorative Überladung.
3. Erstkontakt bleibt ohne visuelle Reizspitzen.
4. Wiederholte Muster nutzen gleiche Abstände und gleiche Kantenlogik.

## Screen Komposition
### Primäre Blickführung
1. Erste Blickstation ist ruhiger full-width Header mit klarer Einordnung.
2. Zweite Blickstation ist die zentrierte Content Area mit Titel und kurzer Subline.
3. Dritte Blickstation ist Frageeingabe mit Primäraktion.
4. Danach folgen Antwortbereich, wichtige Bezüge und Herleitung.

### Sekundäre Blickführung
1. Zustände erscheinen inline im Antwortbereich.
2. In Variante B unterstützt eine leise rechte Hilfespalte den Ablauf.
3. Es gibt keine permanente Zustandsliste als Nebenfläche.

## Layout Rhythmus
### Vertikaler Ablauf
1. Jeder Hauptabschnitt erhält klaren Einstieg über Label.
2. Zwischen Abschnitten liegt ein konstanter Abstandsrhythmus.
3. Inhaltliche Tiefe nimmt von oben nach unten zu.

### Horizontale Ordnung
1. Variante A bleibt einspaltig.
2. Variante B trennt Kerninhalt links und kontextuelle Hilfe rechts.
3. Mobile führt alle Inhalte nacheinander in einer Spalte.

## Typografie Anwendung
1. Titel bleibt prägnant und nüchtern.
2. Hauptantwort nutzt höchste Lesbarkeit und ruhige Zeilenhöhe.
3. Bezüge sind kürzer, leichter und klar untergeordnet.
4. Zustandsaktionen sind deutlich und nicht alarmistisch.

## Komponenten Verhalten visuell
### Frageeingabe
1. Eingabefeld hat ausreichende Höhe für komplexe Fragen.
2. Primärbutton bleibt im Ruhezustand klar sichtbar.
3. Hilfetext steht direkt unter der Eingabe und bleibt knapp.

### Antwortbereich
1. Antworttext bleibt ohne konkurrierende Badges oder Deko.
2. Loading, Empty, Error und Rate Limit erscheinen als Inline Zustände am selben Ort.
3. Bei längeren Antworten wird Lesbarkeit über Absatzstruktur gesichert.

### Wichtige Bezüge
1. Bezüge erscheinen in homogener Listenstruktur.
2. Jeder Eintrag enthält Name und knappen Bezug zur Antwort.
3. Reihenfolge folgt wahrgenommener Relevanz.

### Herleitung
1. Disclosure signalisiert optionalen Detailgrad.
2. Inhalt nutzt maximal drei kurze Schritte im P0.

### Rechte Spalte Variante B
1. Es ist immer nur ein Hilfeblock sichtbar.
2. Der Hilfeblock passt zum aktuellen Zustand des Hauptflusses.
3. Der Hilfeblock bleibt visuell sekundär.

## Informationsgewichtung und Prioritäten
1. Priorität 1: Frageeingabe und Primäraktion sind sofort verständlich.
2. Priorität 2: Hauptantwort dominiert jede Ergebnisdarstellung.
3. Priorität 3: Wichtige Bezüge stützen die Antwort ohne Überlagerung.
4. Priorität 4: Herleitung bleibt kontrollierte Detailoffenlegung.
5. Priorität 5: Zustände bleiben eindeutig, knapp und handlungsorientiert.

## Accessibility Regeln
### Kontrast und Lesbarkeit
1. Primärtext erfüllt AA Kontrast auf allen Flächen.
2. Statusfarbe wird immer mit Textlabel kombiniert.

### Fokus und Interaktion
1. Fokus ist auf allen interaktiven Elementen sichtbar.
2. Fokusstil hat ausreichende Dicke und Kontrast.
3. Interaktive Elemente bleiben ohne Maus nutzbar.

### Tastatur
1. Tab Reihenfolge folgt der visuellen Reihenfolge.
2. Disclosure ist per Tastatur erreichbar und steuerbar.
3. Primäraktion ist ohne Pointer eindeutig erreichbar.

## Responsive Regeln
### Desktop
1. Variante A zeigt einen ruhigen Einspaltenfluss.
2. Variante B zeigt eine sekundäre rechte Hilfespalte.
3. Hauptfluss bleibt stets links priorisiert.

### Mobile
1. Einspaltiges Stapeln ohne Funktionsverlust.
2. Primärbutton nutzt als Sticky Footer Bar volle Breite.
3. Kartenabstände bleiben konsistent für schnelles Scannen.
4. Kein horizontales Scrollen in Kernkomponenten.

## Do und Dont
### Do
1. Nutze konsistente Labels, Abstände und Kartenstrukturen.
2. Halte Statuskommunikation kurz mit genau einer Aktion.
3. Stelle sichtbare Fokuszustände auf allen interaktiven Elementen sicher.
4. Halte rechte Hilfespalte in Variante B klar sekundär.

### Dont
1. Keine konkurrierenden Primärfarben in Inhaltskarten.
2. Keine zweite Primäraktion im selben Zustand.
3. Keine Zustandsdarstellung nur über Farbe ohne Textlabel.
4. Keine zusätzliche Detailtiefe oberhalb der Hauptantwort.

## Konsistenz zu UX Artefakten
1. User Flows definieren Trigger, Ablauf und Recovery.
2. Informationsarchitektur definiert Hierarchie und Ordnungsprinzip.
3. Wireframes definieren Layoutvariante A und B.
4. UI Copy definiert die sichtbare Sprache.
5. Mock zeigt die Hauptansicht in Variante B und die Inline Zustandslogik.
