# UI Style Guide

## Zielbild
1. Light Theme mit ruhiger, professioneller Wirkung.
2. Primärfokus liegt auf Eingabe und Hauptantwort.
3. Reihenfolge bleibt stabil: Eingabe, Antwortbereich, wichtige Bezüge, Herleitung.

## Visuelle Tokens
### Farbe
1. Hintergrund: sehr helles Grau für ruhige Fläche.
2. Surface: reines oder nahezu reines Weiß für Karten.
3. Text primär: dunkles Blau Grau mit hoher Lesbarkeit.
4. Text sekundär: entsättigtes Grau Blau für Hilfstexte.
5. Brand Akzent: kühles Blau nur für Primäraktion und aktive Hervorhebung.
6. Statusfarben: klar getrennt für Loading, Empty, Error und Rate Limit.

### Radius und Schatten
1. Kartenradius: mittelgroß für weiche Kontur.
2. Eingaben und Buttons: leicht kleinerer Radius für funktionale Klarheit.
3. Schatten: weich und zurückhaltend, nur auf primären Flächen.

## Typografie
### Hierarchie
1. H1 dient Orientierung beim Erstkontakt und bleibt kompakt.
2. Bereichslabels sind klein, konsistent und gut scannbar.
3. Fließtext der Hauptantwort hat höchste Lesbarkeit.
4. Metadaten und Hilfstexte sind kleiner, aber kontraststabil.

### Rhythmus
1. Maximal drei sichtbare Schriftstufen pro Screenabschnitt.
2. Zeilenlänge der Hauptantwort bleibt im gut lesbaren Bereich.
3. Großbuchstaben nur für kurze Funktionslabels.

## Layout und Spacing
### Raster
1. Header und Footer sind full width mit geringer Höhe.
2. Content Area ist zentriert mit max width und klarer vertikaler Hierarchie.
3. Mobile nutzt Ein-Spalten-Stapel in identischer Inhaltsreihenfolge.

### Abstände
1. Einheitlicher 8 Punkt Rhythmus für Innenabstände und Zwischenräume.
2. Größere vertikale Abstände markieren Abschnittswechsel.
3. Dichte bleibt moderat für ruhigen Erstkontakt.

## Komponenten Patterns
### Eingabe und Aktion
1. Fragefeld ist visuell dominant vor allen Ergebnisbereichen.
2. Primärbutton ist je Zustand singulär.
3. Auf Mobile ist die Primäraktion als Sticky Footer Bar über volle Breite geführt.
4. Auf Desktop bleibt die Primäraktion regulär im Eingabebereich.

### Antwortbereich
1. Antwortbereich zeigt entweder Hauptantwort oder einen Inline Zustand.
2. Keine parallele zweite Zustandsfläche neben dem Hauptfluss.

### Wichtige Bezüge
1. Bezüge erscheinen als gleichartige Listeneinträge.
2. Jeder Eintrag zeigt Name und knappen Kontextsatz.

### Herleitung
1. Disclosure bleibt standardmäßig geschlossen.
2. Herleitungstext bleibt kurz und schrittbasiert.

### Rechte Spalte in Variante B
1. Rechte Spalte enthält genau einen kontextabhängigen Hilfeblock.
2. Rechte Spalte bleibt typografisch leiser als linke Spalte.
3. Rechte Spalte ersetzt keine Kerninformation.

## Accessibility Grundlagen
### Kontrast
1. Text auf Surface erfüllt mindestens AA Kontrast für normale Schrift.
2. Sekundärtext bleibt lesbar und nicht ornamental.

### Fokus und Tastatur
1. Fokuszustand ist auf Eingabe, Button und Disclosure deutlich sichtbar.
2. Fokusindikator ist nicht nur farbabhängig.
3. Tab Reihenfolge folgt der inhaltlichen Reihenfolge.

### Semantik und Sprache
1. Bereichstitel und Labels bleiben konsistent zu UI Copy.
2. Zustände werden mit Klartext benannt, nicht nur mit Farbe.

## Responsive Regeln
### Desktop
1. Variante A bleibt einspaltig.
2. Variante B zeigt die funktionale Hilfespalte rechts.
3. Hauptantwort bleibt in beiden Varianten visuell dominant.

### Mobile
1. Alle Kernkomponenten werden in Originalreihenfolge gestapelt.
2. Primärbutton nutzt volle Breite für sichere Touch Bedienung.
3. Rechter Hilfeblock aus Variante B folgt unter dem Hauptfluss.

## Konsistenzregeln zu UX Artefakten
1. User Flows definieren die verbindliche Zustandslogik im Antwortbereich.
2. Informationsarchitektur definiert die feste Inhaltsreihenfolge.
3. Wireframes definieren die zwei Layoutvarianten mit gleicher Informationslogik.
4. UI Copy definiert alle sichtbaren Labels und Zustandsformulierungen.
5. Mock zeigt die Hauptansicht in Variante B ohne zusätzliche Features.
