# UI Copy

## Hauptansicht
### Titel und Kontext
1. Titel: Public System GraphRAG Demo
2. Subline: Stelle eine Frage und erhalte eine klare Hauptantwort mit nachvollziehbaren Bezuegen.
3. Plattformblock Titel: Public Plattform Status

### Eingabe
1. Label: Deine Frage
2. Placeholder: Welche Zielkonflikte entstehen zwischen Resilienz und Effizienz in verteilten Systemen?
3. Helper: Je konkreter die Frage, desto belastbarer sind Antwort und Bezuege.
4. Primaeraktion Desktop: Antwort anzeigen
5. Primaeraktion Mobile Sticky Bar: Antwort anzeigen

### Antwort und Bezuege
1. Bereichstitel Antwort: Antwort
2. Bereichstitel Bezuege: Wichtige Bezuege
3. Bereichstitel Herleitung: So wurde die Antwort hergeleitet
4. Disclosure zu Herleitung geschlossen: Herleitung anzeigen
5. Disclosure zu Herleitung geoeffnet: Herleitung ausblenden

## Plattform-Status Copy
### Readiness
1. Label: Setup Status
2. Wert positiv: Setup bereit fuer Public MVP
3. Wert neutral: Setup in Vorbereitung

### Deployment Hinweis
1. Label: Deployment
2. Text positiv: Public Deployment Ziel ist verknuepft.
3. Text neutral: Public Deployment wird aktuell vorbereitet.

### Secret Hygiene
1. Label: Secrets
2. Text positiv: Secrets liegen nur in Vercel und Aura, nie im Repository.
3. Text neutral: Secret-Verkabelung wird vor Public Freigabe abgeschlossen.

### Betriebsgrenze
1. Label: Nutzungsschutz
2. Text: Bei hoher Last kann eine kurze Wartezeit bis zur naechsten Anfrage auftreten.

## Inline States im Antwortbereich
### Loading
1. Titel: Antwort wird vorbereitet
2. Text: Relevante Inhalte werden zusammengestellt.
3. Aktion: Bitte kurz warten.

### Empty
1. Titel: Keine passende Antwort gefunden
2. Text: Fuer diese Formulierung wurde kein ausreichend passender Kontext gefunden.
3. Aktion: Frage praezisieren.

### Error
1. Titel: Antwort aktuell nicht verfuegbar
2. Text: Die Anfrage konnte nicht verarbeitet werden.
3. Aktion: Erneut versuchen.

### Rate Limit
1. Titel: Kurz warten
2. Text: Das Anfragekontingent ist voruebergehend erreicht.
3. Aktion: In kurzer Zeit erneut senden.
