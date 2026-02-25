# Visual Guidelines

## Zweck
1. Dieses Dokument operationalisiert den Light Theme Stil für konsistente UX Entscheidungen im MVP.
2. Fokus bleibt auf ruhiger, hochwertiger, selbsterklärender Darstellung ohne visuelle Überladung.

## Visuelle Prinzipien
1. Klarer Primärfokus auf Frage und Hauptantwort.
2. Sekundäre Information bleibt sichtbar, aber visuell untergeordnet.
3. Detailtiefe wird erst nach dem Erstverständnis geöffnet.
4. Jede Fläche muss einen klaren Informationszweck haben.

## Farbrollen
1. Hintergrundfarbe trägt Ruhe und trennt die App von der Browserfläche.
2. Surface Farbe markiert interaktive und inhaltliche Karten.
3. Primärtextfarbe trägt die Hauptleselast.
4. Sekundärtextfarbe trägt Hilfen und Metaebenen.
5. Brand Farbe markiert nur Primäraktion und aktive Hervorhebung.
6. Statusfarben markieren Loading, Empty, Error, Rate Limit konsistent.

## Flächennutzung und Dichte
1. Weißraum ist funktional und steuert Lesetempo.
2. Kartenfläche bleibt ruhig ohne dekorative Überladung.
3. Dichte ist so gewählt, dass Erstkontakt ohne Scrollstress möglich bleibt.
4. Wiederholte Muster nutzen gleiche Abstände und gleiche Kantenlogik.

## Screen Komposition
### Primäre Blickführung
1. Erste Blickstation ist Titel mit kurzer Subline.
2. Zweite Blickstation ist Frageeingabe mit Primäraktion.
3. Dritte Blickstation ist Hauptantwort.
4. Danach folgen Referenzkonzepte und Kernnachweis.

### Sekundäre Blickführung
1. Zustände sind separat und visuell sekundär.
2. Statusblöcke konkurrieren nicht mit der Hauptantwort.

## Layout Rhythmus
### Vertikaler Ablauf
1. Jeder Hauptabschnitt erhält klaren Einstieg über Label.
2. Zwischen Abschnitten liegt ein klarer Rhythmus mit konstanten Abständen.
3. Inhaltliche Tiefe nimmt von oben nach unten zu.

### Horizontale Ordnung
1. Desktop trennt Kerninhalt und Zustandskommunikation in zwei Spalten.
2. Mobile führt beide Bereiche nacheinander in einer Spalte.

## Typografie Anwendung
1. Titel bleibt prägnant und nüchtern.
2. Hauptantwort nutzt die höchste Lesbarkeit und ruhige Zeilenhöhe.
3. Referenz Metadaten sind kürzer, leichter und klar untergeordnet.
4. Zustandsaktionen sind deutlich, aber nicht alarmistisch formuliert.

## Komponenten Verhalten visuell
### Frageeingabe
1. Eingabefeld zeigt ausreichende Höhe für komplexe Fragen.
2. Primärbutton bleibt im Ruhezustand klar sichtbar.
3. Helper Text steht direkt unter der Eingabe und bleibt knapp.

### Hauptantwort
1. Antworttext bleibt ohne Inline Deko oder konkurrierende Badges.
2. Bei längeren Antworten wird Lesbarkeit über Absatzstruktur gesichert.

### Referenzkonzepte
1. Referenzen erscheinen in homogener Listenstruktur.
2. Jeder Eintrag enthält Name und knappen direkten Bezug zur Antwort.
3. Reihenfolge der Referenzen folgt wahrgenommener Relevanz.

### Kernnachweis
1. Disclosure signalisiert optionalen Detailgrad.
2. Nachweis nutzt maximal drei kurze Schritte im P0.

### Zustände
1. Loading kommuniziert Ruhe und Prozessfortschritt.
2. Empty fordert zur Präzisierung auf.
3. Error fordert neutral zum erneuten Versuch auf.
4. Rate Limit fordert zu kurzer Pause auf.

## Informationsgewichtung und Prioritäten
1. Priorität 1: Frageeingabe und Primäraktion müssen sofort verständlich sein.
2. Priorität 2: Hauptantwort dominiert jede Ergebnisdarstellung.
3. Priorität 3: Referenzkonzepte stützen die Antwort, ohne sie zu überlagern.
4. Priorität 4: Kernnachweis bleibt als kontrollierte Detailoffenlegung.
5. Priorität 5: Zustände bleiben eindeutig, knapp und handlungsorientiert.

## Accessibility Regeln
### Kontrast und Lesbarkeit
1. Primärtext erfüllt AA Kontrast auf allen Flächen.
2. Statusfarbe wird immer mit Textlabel kombiniert.

### Fokus und Interaktion
1. Fokus ist auf allen interaktiven Elementen sichtbar.
2. Fokusstil hat ausreichende Dicke und Kontrast.
3. Interaktive Elemente bleiben auch ohne Maus nutzbar.

### Tastatur
1. Tab Reihenfolge folgt der visuellen Reihenfolge.
2. Disclosure ist per Tastatur erreichbar und steuerbar.
3. Primäraktion ist ohne Pointer eindeutig erreichbar.

## Responsive Regeln
### Desktop ab breiter Ansicht
1. Zwei Spalten mit klarer Dominanz der Inhaltsseite.
2. Zustandsspalte bleibt kompakt und stabil lesbar.

### Mobile bis schmale Ansicht
1. Einspaltiges Stapeln ohne Funktionsverlust.
2. Primärbutton nutzt volle Breite.
3. Kartenabstände bleiben konsistent für schnelles Scannen.
4. Kein horizontales Scrollen in Kernkomponenten.

## Do und Dont
### Do
1. Nutze konsistente Labels, Abstände und Kartenstrukturen.
2. Halte Statuskommunikation kurz mit genau einer Aktion.
3. Verwende visuelle Mittel so, dass Hauptantwort klar dominiert.
4. Stelle sichtbare Fokuszustände auf allen interaktiven Elementen sicher.

### Dont
1. Keine konkurrierenden Primärfarben in Inhaltskarten.
2. Keine zweite Primäraktion im selben Zustand.
3. Keine Statusdarstellung nur über Farbe ohne Textlabel.
4. Keine zusätzliche Detailtiefe oberhalb der Hauptantwort.

## Konsistenz zu UX-Artefakten
1. User Flows bleiben unverändert und werden visuell nur geschärft.
2. Informationsarchitektur bleibt auf einer Pflichtansicht mit klarer Hierarchie.
3. Wireframes bleiben strukturelle Referenz für Desktop und Mobile.
4. UI Copy bleibt führend für Zustands- und Aktionssprache.
5. Mock bleibt visuelle Referenz für P0 Reihenfolge und State Pattern.
