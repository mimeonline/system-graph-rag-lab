# UX Memory

## UX Intent
1. Erstkontakt soll den Mehrwert von GraphRAG in unter einer Minute verständlich machen.
2. Nutzer soll Antwortinhalt und Herkunft gleichzeitig erfassen, ohne kognitive Überlastung.
3. Das UI soll im Light Theme ruhig, hochwertig und selbsterklärend wirken.

## Core User Journeys
1. Erstes Erfolgserlebnis von Frage zu verständlicher Hauptantwort mit sichtbaren Referenzkonzepten.
2. Plausibilitätsprüfung über Referenzkonzepte und knappen P0 Kernnachweis.
3. Recovery bei Empty, Error und Rate Limit mit eindeutiger nächster Aktion.

## Interaction Principles
1. Primär zuerst: Hauptantwort hat Vorrang vor Detailinformationen.
2. Progressive Offenlegung: Nachweis bleibt als Disclosure organisiert.
3. Pro Zustand genau eine empfohlene Aktion.
4. Sprache bleibt ruhig, präzise und nicht alarmistisch.
5. Visual Hierarchie bleibt über Desktop und Mobile konsistent.

## Open UX Questions
1. Welche Nachweisstruktur kann Architect im P0 garantiert liefern.
2. Welche Referenzkonzept Metadaten sind stabil genug für Name plus Kontextsatz.
3. Wie präzise darf Rate Limit Wartezeit angezeigt werden.
4. Welche Regel entscheidet robust zwischen Empty und schwacher Antwort.

## UX Risks
1. Zu viel Retrieval Detail kann die Hauptbotschaft im Erstkontakt verdrängen.
2. Zu wenig Nachweis kann Vertrauen bei Architekten und AI Engineers schwächen.
3. Unklare Empty Schwelle kann zu inkonsistenten Zuständen führen.
4. Fehlende Feldstabilität für Referenzen kann UI Copy und Visual Patterns brechen.
5. Unzureichender Fokuskontrast kann Tastaturführung im Public MVP schwächen.

## Entscheidungen
1. Light Theme bleibt verbindlicher visueller Standard für den Public MVP.
2. Zwei-Spalten-Layout auf Desktop und Ein-Spalten-Layout auf Mobile bleiben gesetzt.
3. Pro Zustand bleibt exakt eine empfohlene Aktion als UX-Konstante erhalten.

## Next Instructions
1. Architect Antwort zu stabilen Referenz und Nachweisfeldern auf Mock und UI Copy abgleichen.
2. Danach Zustandsmatrix mit finalen Datenbeispielen für Loading, Empty, Error, Rate Limit ergänzen.
3. Vor Dev Umsetzung mobile Lesbarkeit und Textlängen an realen Antwortbeispielen validieren.
4. Nächsten UX Run gegen `.codex/agents/ux.toml` starten und Pflichtinputliste vorab abgleichen.
