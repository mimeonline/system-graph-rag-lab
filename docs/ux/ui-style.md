# UI Style Guide

## Zielbild
1. Light Theme mit ruhiger, professioneller Wirkung.
2. Primärfokus bleibt auf Hauptantwort vor Detailtiefe.
3. Jede visuelle Entscheidung unterstützt die feste Reihenfolge Frageeingabe, Hauptantwort, Referenzkonzepte, P0 Kernnachweis.

## Visuelle Tokens
### Farbe
1. Hintergrund: sehr helles Grau für ruhige Fläche.
2. Surface: reines oder nahezu reines Weiß für Karten.
3. Text primär: dunkles Blau Grau mit hoher Lesbarkeit.
4. Text sekundär: entsättigtes Grau Blau für Hilfstexte.
5. Brand Akzent: kühles Blau nur für Primäraktion und aktive Hervorhebung.
6. Statusfarben: klar getrennt für Loading, Empty, Error, Rate Limit.

### Radius und Schatten
1. Kartenradius: mittelgroß für hochwertige, weiche Kontur.
2. Eingaben und Buttons: leicht kleinerer Radius für funktionale Klarheit.
3. Schatten: weich und zurückhaltend, nur auf primären Flächen.

## Typografie
### Hierarchie
1. H1 dient Orientierung beim Erstkontakt und bleibt kompakt.
2. Bereichslabels sind klein, konsistent und schnell scannbar.
3. Fließtext der Hauptantwort hat höchste Lesbarkeit und klare Zeilenhöhe.
4. Metadaten und Hilfstexte sind kleiner, aber kontraststabil.

### Rhythmus
1. Maximal drei sichtbare Schriftstufen pro Screenabschnitt.
2. Zeilenlänge der Hauptantwort bleibt im gut lesbaren Bereich.
3. Großbuchstaben nur für kurze Funktionslabels.

## Layout und Spacing
### Raster
1. Desktop nutzt Zwei-Spalten-Raster mit dominanter Hauptspalte.
2. Mobile nutzt Ein-Spalten-Stapel in identischer Inhaltsreihenfolge.

### Abstände
1. Einheitlicher 8-Punkt-Rhythmus für Innenabstände und Zwischenräume.
2. Größere vertikale Abstände markieren Abschnittswechsel.
3. Dichte bleibt moderat, um den ruhigen Charakter zu halten.

## Komponenten Patterns
### Eingabe und Aktion
1. Fragefeld ist visuell dominant vor allen Ergebnisbereichen.
2. Primärbutton ist eindeutig erkennbar und je Zustand singulär.

### Antwortkarte
1. Hauptantwort ist in eigener Karte mit ruhigem Textbild.
2. Keine konkurrierenden visuellen Akzente im Antwortblock.

### Referenzkonzepte
1. Konzepte erscheinen als gleichartige Listeneinträge.
2. Jeder Eintrag zeigt Name und knappen Kontextsatz.

### Kernnachweis
1. Disclosure bleibt standardmäßig reduziert oder kontrolliert offen je Demo-Kontext.
2. Nachweistext bleibt knapp und schrittbasiert.

### Zustände
1. Jede Zustandskarte hat klare Titelzeile, kurzen Kontext und genau eine Aktion.
2. Statusfarbe unterstützt Orientierung, ersetzt aber nicht den Klartext.

## Accessibility Grundlagen
### Kontrast
1. Text auf Surface erfüllt mindestens AA-Kontrast für normale Schrift.
2. Sekundärtext bleibt lesbar und nicht ornamental.

### Fokus und Tastatur
1. Fokuszustand ist auf Eingabe, Button und Disclosure deutlich sichtbar.
2. Fokusindikator ist nicht nur farbabhängig.
3. Tab-Reihenfolge folgt der inhaltlichen Reihenfolge.

### Semantik und Sprache
1. Bereichstitel und Labels bleiben konsistent zwischen UI Copy und Visual.
2. Zustände werden mit Klartext benannt, nicht nur mit Icons oder Farbe.

## Responsive Regeln
### Desktop
1. Zustandsübersicht bleibt als sekundärer Bereich neben dem Hauptfluss sichtbar.
2. Hauptspalte erhält Priorität in Breite und Blickführung.

### Mobile
1. Alle Kernkomponenten werden in Originalreihenfolge gestapelt.
2. Primärbutton nutzt volle Breite für sichere Touch-Bedienung.
3. Zustandsbereich folgt nach Ergebnissen, bleibt aber vollständig vorhanden.

## Konsistenzregeln zu bestehenden UX-Artefakten
1. Journey 1 priorisiert schnelles Erstverständnis durch starke Antworthierarchie.
2. Journey 2 unterstützt Plausibilitätsprüfung durch klare Trennung von Antwort, Referenz und Nachweis.
3. Journey 3 erhält ruhige Recovery durch konsistente Statuskarten mit einer Aktion.
