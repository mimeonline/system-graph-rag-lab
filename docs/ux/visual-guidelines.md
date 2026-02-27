# Visual Guidelines

## Ziel
1. E4-S5 benoetigt sichtbares Plattformvertrauen ohne den Antwortfluss zu stoeren.
2. Visuelle Sprache bleibt klar, ruhig und demo-tauglich fuer Public Publikum.

## Blickfuehrung
### Primaer
1. Titel und Eingabe sind der erste Fokus.
2. Hauptantwort ist der zweite Fokus.
3. Bezuege sind der dritte Fokus.

### Sekundaer
1. Plattform-Status liefert Vertrauen im Hintergrund.
2. Herleitung ist optionale Vertiefung.

## Plattform-Status als Vertrauensflaeche
1. Die Flaeche zeigt nur komprimierte Signale, keine technischen Interna.
2. Jeder Eintrag besteht aus Label plus kurzem Klartext.
3. Positive und neutrale Formulierungen vermeiden Alarmton.
4. Bei fehlender Readiness wird neutral informiert, nicht dramatisiert.

## State Visualisierung
### Loading
1. Ruhige Flaeche mit blauer Akzentkante.
2. Kein Spinner-Zwang, Text reicht fuer Orientierung.

### Empty
1. Amber-Akzentkante fuer Suchluecke.
2. Aktion bleibt Fragepraezisierung.

### Error
1. Rote Akzentkante fuer Verarbeitungsfehler.
2. Aktion bleibt erneuter Versuch.

### Rate Limit
1. Gruene Akzentkante fuer Betriebsgrenze.
2. Aktion bleibt kurze Wartezeit und erneutes Senden.

## Dichte und Rhythmus
1. Ein Kartenmuster fuer alle Hauptsektionen.
2. Konstante vertikale Abstaende im 8-Punkt-Rhythmus.
3. Keine dekorative Ueberlagerung oder Badge-Flut.

## Responsive Verhalten
1. Desktop: Zwei-Spalten-Komposition mit linker Dominanz.
2. Mobile: Eine Spalte, Plattform-Status vor Eingabe.
3. Sticky Aktion auf Mobile bleibt immer erreichbar.

## Konsistenzregeln
1. Labels in UI Copy und Mock muessen identisch sein.
2. State Namen `Loading`, `Empty`, `Error`, `Rate Limit` werden in allen Artefakten gleich verwendet.
3. Plattform-Status bleibt in allen Varianten gleich strukturiert.
4. Keine neue Information nur in einer einzelnen Darstellung einfuehren.
