# Informationsarchitektur

## Seitenstruktur
1. Eine zentrale Public Demo Seite mit drei Informationszonen.
2. Zone A: Header mit Produktkontext.
3. Zone B: Hauptfluss mit Eingabe, Antwort, Bezuegen, Herleitung.
4. Zone C: Leiser Plattform-Statusblock fuer Vertrauen und Betriebsrahmen.

## Inhaltsreihenfolge im Hauptfluss
1. Eingabe mit Primaeraktion.
2. Antwortbereich mit Inline States.
3. Wichtige Bezuege.
4. Optionale Herleitung.

## Plattform-Statusblock
1. Zeigt Readiness-Status in Klartext.
2. Zeigt Deployment-Hinweis als nicht-klickpflichtige Textinformation.
3. Zeigt Secret-Hygiene-Hinweis: keine Secrets im Repository.
4. Zeigt bei Bedarf einen kompakten Hinweis zu Rate-Limit-Verhalten.

## Hierarchie
### Primaer
1. Frage senden.
2. Hauptantwort lesen.

### Sekundaer
1. Bezuege pruefen.
2. Herleitung optional oeffnen.

### Tertiaer
1. Plattform-Status als Vertrauenssignal.
2. Betriebsrahmenhinweise ohne Unterbrechung des Leseflusses.

## State Platzierung
1. `Loading` nur inline im Antwortbereich.
2. `Empty` nur inline im Antwortbereich.
3. `Error` nur inline im Antwortbereich.
4. `Rate Limit` nur inline im Antwortbereich.
5. Plattform-Statusblock zeigt keine konkurrierenden Error-Meldungen.

## Responsive Ordnung
1. Desktop: Hauptfluss links, Plattform-Status rechts.
2. Mobile: Plattform-Status unter Header, dann Hauptfluss in gleicher Reihenfolge.
3. Sticky Primaeraktion auf Mobile bleibt sichtbar und verdeckt keinen Status.
