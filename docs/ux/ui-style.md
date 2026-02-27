# UI Style Guide

## Zielbild fuer E4-S5
1. Professioneller, ruhiger Erstkontakt mit sichtbarem Vertrauenssignal zur Public Plattform.
2. Inhaltliche Antwort bleibt visuell wichtiger als Infrastrukturhinweise.
3. Statuskommunikation ist knapp, klar und handlungsorientiert.

## Design Tokens
### Farben
1. Hintergrund: helles Blau-Grau fuer ruhige Flaeche.
2. Surface: weiss fuer Inhaltskarten.
3. Text primaer: dunkles Blau mit hohem Kontrast.
4. Text sekundaer: entsaettigtes Blau-Grau fuer Hinweise.
5. Primaeraktion: sattes Blau nur fuer Hauptaktion.
6. Loading: klarer Blau-Ton.
7. Empty: warmer Amber-Ton.
8. Error: klares Rot.
9. Rate Limit: gedecktes Gruen.

### Radius und Linien
1. Kartenradius mittel, konsistent ueber alle Inhaltskacheln.
2. Linien dezent zur Trennung von Inhalten.
3. Inline States mit linker Statuskante.

### Typografie
1. Titel kompakt und sachlich.
2. Antworttext hat hoechste Lesbarkeit.
3. Statuslabels sind kurz, nicht alarmistisch.
4. Plattformblock typografisch leiser als Antwortbereich.

## Layout Regeln
### Desktop
1. Zweispaltig: Hauptfluss links, Plattform-Status rechts.
2. Linke Spalte nimmt visuelle Prioritaet ein.
3. Rechte Spalte bleibt funktional und ruhig.

### Mobile
1. Einspaltig in fester Reihenfolge.
2. Plattform-Status direkt nach Header.
3. Sticky Primaeraktion am unteren Rand ohne Inhaltsverdeckung.

## Komponentenregeln
### Hauptfluss
1. Eingabekarte steht immer vor der Antwortkarte.
2. Antwortkarte zeigt Inhalt oder genau einen Inline State.
3. Bezuege folgen direkt unter der Antwort.
4. Herleitung bleibt standardmaessig geschlossen.

### Plattform-Statusblock
1. Enthalten sind nur vier Zeilen: Setup Status, Deployment, Secrets, Nutzungsschutz.
2. Keine technischen Detaillisten in dieser Flaeche.
3. Keine konkurrierenden Alerts gegenueber dem Antwortbereich.

## Zustandsdarstellung
1. `Loading` ist neutral informierend.
2. `Empty` fordert zur Praezisierung auf.
3. `Error` bietet klaren Retry.
4. `Rate Limit` kommuniziert kurze Wartezeit plus Retry.
5. Alle States stehen inline im Antwortbereich.

## Accessibility
1. Kontrast mindestens AA fuer Text und Controls.
2. Fokusstil klar sichtbar auf Eingabe, Button, Disclosure.
3. Statusfarbe immer mit Textlabel kombinieren.
4. Tab-Reihenfolge folgt der visuellen Reihenfolge.

## Umsetzungskompatibilitaet
1. Kompatibel mit Next.js 16.1.6.
2. Styling auf Tailwind- und shadcn/ui-Muster uebertragbar.
3. Komponentenstruktur auf Atomic Design abbildbar.
