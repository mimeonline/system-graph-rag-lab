# UX Memory

## UX Intent
1. Public MVP wirkt ruhig, hochwertig und selbsterklärend im Erstkontakt.
2. Hauptantwort bleibt visuell dominant vor Nebeninformationen.
3. Zustände erscheinen kontextnah inline im Antwortbereich.
4. Mobile Führung bleibt mit Sticky Primary Action klar und touch sicher.

## Core User Journeys
1. Frage stellen, inline Loading sehen, Hauptantwort und wichtige Bezüge erfassen.
2. Antwort plausibilisieren über wichtige Bezüge und optional geöffnete Herleitung.
3. Bei Empty, Error oder Rate Limit mit genau einer Aktion fortsetzen.

## Interaction Principles
1. Feste Hauptreihenfolge: Eingabe, Antwortbereich, wichtige Bezüge, Herleitung.
2. Progressive Disclosure ist zweistufig: Herleitung, danach Retrieval-Details.
3. Zustände bleiben inline und ersetzen den Antwortinhalt am selben Ort.
4. Pro Zustand gibt es genau eine klare Aktion.
5. Desktop bleibt ohne Sticky Primary Action, Mobile nutzt Sticky Footer Bar.

## Open UX Questions
1. Welche stabilen Felder sind für wichtige Bezüge verbindlich verfügbar.
2. Welche minimale Herleitungsstruktur ist im P0 verlässlich lieferbar.
3. Welche Retrieval-Details in P0 darstellbar sind, ohne technische Überlastung.
4. Ob für Rate Limit eine belastbare relative Warteangabe bereitgestellt werden kann.
5. Welche robuste Regel Empty eindeutig von schwacher Antwort trennt.

## UX Risks
1. Feldinstabilität bei Bezügen oder Retrieval-Details kann Copy und Disclosure destabilisieren.
2. Uneinheitliche State Trigger können inkonsistente Inline Zustände erzeugen.
3. Mobile Sticky Bar kann Inhalt verdecken, falls Safe-Area oder Bottom-Spacing fehlt.
4. Zu viele Retrieval-Details können den ruhigen Erstkontakt brechen.

## Entscheidungen
1. Header und Footer sind full width mit geringer visueller Höhe.
2. Content bleibt zentriert mit max width und klarer vertikaler Hierarchie.
3. Mobile Primary Action ist als Sticky Footer Bar verbindlich im Mock.
4. States bleiben ausschließlich inline im Antwortbereich.
5. Retrieval-Details sind nur als optionale zweite Disclosure sichtbar.

## Next Instructions
1. Architect-Antwort zu verpflichtenden Feldern für Bezüge und Retrieval-Details einarbeiten.
2. Dev-Handoff soll Mobile Sticky Bar Spacing und Safe-Area explizit prüfen.
3. Inline-State-Texte gegen reale Triggerfälle validieren.
4. Disclosure-Reihenfolge in Implementierung strikt erhalten.
