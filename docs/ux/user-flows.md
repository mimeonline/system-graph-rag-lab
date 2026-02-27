# User Flows

## Journey 1 Public Readiness verstehen
### Ziel
1. Nutzer erkennt vor der ersten Anfrage, dass die Public Plattform vorbereitet ist und wie mit Secrets umgegangen wird.

### Trigger
1. Nutzer oeffnet die Public Demo Startseite.

### Schritte
1. Nutzer liest Titel, Subline und den kompakten Plattform-Statusblock oberhalb der Eingabe.
2. Nutzer sieht den Status `Setup bereit` oder `Setup in Vorbereitung` als Klartext.
3. Nutzer liest den Secret-Hinweis, dass Schluessel nicht im Repository liegen.
4. Nutzer startet mit einer Frage den Hauptfluss.

### Ergebnis
1. Nutzer vertraut dem Betriebsrahmen, bevor eine Anfrage gesendet wird.

### Erfolgskriterium
1. Nutzer kann den aktuellen Plattformstatus und die Secret-Hygiene-Regel benennen.

## Journey 2 Frage senden und Antwort einordnen
### Ziel
1. Nutzer bekommt Hauptantwort und Bezuege ohne Ablenkung durch Infrastrukturdetails.

### Trigger
1. Nutzer sendet eine konkrete Systemfrage.

### Schritte
1. Im Antwortbereich erscheint `Loading` inline.
2. Nach Abschluss erscheint die Hauptantwort im selben Bereich.
3. Darunter erscheinen wichtige Bezuege.
4. Optional oeffnet Nutzer die Herleitung.
5. Plattform-Status bleibt als leiser Kontextblock sichtbar, aber nicht dominant.

### Ergebnis
1. Der inhaltliche Fluss bleibt stabil, waehrend Infrastrukturvertrauen bestehen bleibt.

### Erfolgskriterium
1. Nutzer kann die Kernaussage und mindestens einen Bezug wiedergeben.

## Journey 3 Recovery bei Betriebsgrenzen
### Ziel
1. Nutzer kann bei Stoerungen sofort eine naechste sinnvolle Aktion ausfuehren.

### Trigger
1. Der Antwortbereich zeigt `Empty`, `Error` oder `Rate Limit`.

### Schritte
1. Nutzer erkennt den Zustand direkt im Antwortbereich.
2. Nutzer liest eine kurze Ursache in Klartext.
3. Nutzer fuehrt genau eine empfohlene Aktion aus.
4. Optional liest Nutzer im Plattform-Statusblock den stabilen Betriebsrahmen.

### Zustandslogik
1. `Loading`: Anfrage wird verarbeitet, Aktion ist warten.
2. `Empty`: kein ausreichend passender Kontext gefunden, Aktion ist Frage praezisieren.
3. `Error`: Anfrage konnte nicht verarbeitet werden, Aktion ist erneut senden.
4. `Rate Limit`: Anfragekontingent kurzzeitig erreicht, Aktion ist kurz warten und erneut senden.

### Ergebnis
1. Nutzer bleibt orientiert und setzt den Fluss ohne Seitenwechsel fort.

### Erfolgskriterium
1. Nutzer findet in jedem Zustand in unter zehn Sekunden die naechste Aktion.
