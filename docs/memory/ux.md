# UX Memory

## UX Intent
1. Erstkontakt soll in unter einer Minute den Mehrwert von GraphRAG verständlich machen.
2. Nutzer soll Antwortinhalt und Herkunft gleichzeitig erfassen, ohne kognitive Überlastung.

## Core User Journeys
1. Erstes Erfolgserlebnis von Frage zu verständlicher Antwort mit sichtbaren Referenzkonzepten.
2. Plausibilitätsprüfung über Referenzkonzepte und knappen Kernnachweis.
3. Recovery bei Empty, Error und Rate Limit mit eindeutiger nächster Aktion.

## Interaction Principles
1. Primär zuerst: Hauptantwort hat immer Vorrang vor Detailinformationen.
2. Progressive Offenlegung: Nachweis nur auf Nutzeraktion öffnen.
3. Pro Zustand genau eine empfohlene Aktion.
4. Sprache bleibt ruhig, präzise, nicht alarmistisch.

## Open UX Questions
1. Welche Nachweisstruktur kann Architect im P0 garantiert liefern.
2. Welche Referenzkonzept-Metadaten sind stabil genug für den UI-Kontexttext.
3. Wie präzise darf Rate-Limit-Wartezeit angezeigt werden.

## UX Risks
1. Zu viel Retrieval-Detail kann die Hauptbotschaft im Erstkontakt verdrängen.
2. Zu wenig Nachweis kann Vertrauen bei Architekten und AI Engineers schwächen.
3. Unklare Empty-Schwelle kann zu inkonsistenten Zuständen führen.

## Next Instructions
1. Architect-Antworten zu Nachweisformat und Referenzgranularität einarbeiten.
2. Danach UI-Text auf reale Datenfelder und Zustandslogik feinjustieren.
3. Vor Dev-Handoff eine kompakte Zustandsmatrix mit Beispielen ergänzen.
