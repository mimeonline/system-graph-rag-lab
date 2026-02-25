# UX Memory

## UX Intent
1. Erstkontakt bleibt ruhig, klar und selbsterklaerend.
2. Hauptantwort bleibt visuell dominant.
3. Bezuege und Herleitung unterstuetzen Nachvollziehbarkeit ohne Ueberladung.

## Core User Journeys
1. Frage stellen, Antwort lesen, Bezuege erfassen.
2. Antwort plausibilisieren ueber Bezuege und optionale Herleitung.
3. Bei Empty/Error/Rate-Limit mit klarer Folgeaktion fortsetzen.

## Interaction Principles
1. Reihenfolge bleibt stabil: Eingabe, Antwort, Bezuege, Herleitung.
2. States erscheinen inline im Antwortbereich.
3. Progressive Disclosure bleibt optional und zweistufig.
4. Mobile Primary Action bleibt erreichbar ohne Inhaltsverdeckung.

## Open UX Questions
1. Welche Bezugsfelder sind stabil verpflichtend verfuegbar.
2. Welche minimale Herleitungsstruktur ist fuer P0 robust.
3. Wie wird `empty` technisch eindeutig von schwacher Antwort getrennt.

## UX Risks
1. Instabile Datenfelder destabilisieren Copy und Layout.
2. Uneinheitliche State-Trigger erzeugen inkonsistente UX.
3. Zu viele technische Details brechen den Erstkontakt.

## Entscheidungen
1. States bleiben inline und nicht in dauerhaften Nebenflaechen.
2. Hauptantwort bleibt vor Nebensignalen priorisiert.
3. Disclosure nur dort, wo sie Verstaendlichkeit verbessert.

## Next Instructions
1. Offene Feldfragen mit Architect abstimmen.
2. Handoffs auf konkrete Decisions und offene Fragen begrenzen.
3. UX-Copy entlang derselben State-Definitionen konsistent halten.
