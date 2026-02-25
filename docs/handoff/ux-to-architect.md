# UX to Architect Handoff

## UX-Kern fuer Technikabgleich
1. Hauptreihenfolge bleibt stabil: Eingabe, Antwort, Bezuege, Herleitung.
2. States (`loading`, `empty`, `error`, `rate_limit`) erscheinen inline im Antwortbereich.
3. Progressive Disclosure bleibt zweistufig und optional.

## Architekturfragen an Architect
1. Welche Felder fuer Bezuge sind stabil verpflichtend verfuegbar?
2. Welche minimale Herleitungsstruktur ist fuer P0 sicher lieferbar?
3. Welche technische Regel trennt `empty` eindeutig von schwacher Antwort?
4. Welche verlaessliche Warteangabe ist bei `rate_limit` verfuegbar?

## UX-Leitplanken
1. Keine Scope-Erweiterung.
2. Keine Verschiebung der States in permanente Nebenflaechen.
3. Keine technische Ueberfrachtung im Erstkontakt.
