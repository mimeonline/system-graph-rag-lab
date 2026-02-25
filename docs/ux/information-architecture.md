# Informationsarchitektur

## Seiten und Views
1. Public Demo besteht aus einer zentralen Hauptansicht.
2. Zwei Layoutvarianten nutzen dieselbe Inhaltslogik.
3. Variante A ist einspaltig und maximal reduziert.
4. Variante B ergänzt eine funktionale rechte Hilfespalte.

## Informationshierarchie
### Primär
1. Eingabe mit klarer Handlungsaufforderung.
2. Hauptantwort als dominanteste Ergebnisebene.

### Sekundär
1. Wichtige Bezüge direkt unter der Hauptantwort.
2. Inline Zustände für Loading, Empty, Error und Rate Limit im Antwortbereich.
3. In Variante B ein einzelner kontextueller Hilfeblock in der rechten Spalte.

### Details
1. Herleitung als aufklappbarer Bereich unter den Bezügen.
2. Kurzer Hilfetext unter der Eingabe.

## Ordnungsprinzip
1. Feste Reihenfolge im Hauptfluss: Eingabe, Antwortbereich, wichtige Bezüge, Herleitung.
2. Zustände erscheinen nur im Antwortbereich und ersetzen dort temporär den Inhaltsblock.
3. Progressive Disclosure startet erst nach sichtbarer Hauptantwort.
4. Pro Zustand wird genau eine empfohlene Aktion angeboten.
5. Rechte Spalte in Variante B ergänzt Orientierung und ersetzt keine Kerninformation.
