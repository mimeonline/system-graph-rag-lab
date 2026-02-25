# Wireframes

## Screen Hauptansicht Desktop
### Zweck
1. Erstkontakt von Frage zu Antwort mit nachvollziehbarer Herkunft.

### Layoutstruktur
1. Zwei Spalten mit breiter Hauptspalte links und Zustandsübersicht rechts.
2. Linke Spalte folgt der festen Reihenfolge Frageeingabe, Hauptantwort, Referenzkonzepte, P0 Kernnachweis.

### Komponentenrollen
1. Frageeingabe steuert den Start der Analyse.
2. Hauptantwort trägt die primäre Information.
3. Referenzkonzepte stützen die Antwort.
4. P0 Kernnachweis liefert den knappen Herleitungsbeleg.
5. Zustandsübersicht zeigt Loading, Empty, Error, Rate Limit mit Aktion.

### Interaktionen
1. Primäraktion startet Analyse.
2. Disclosure öffnet oder schließt den Kernnachweis.
3. Zustandskarten bleiben informativ und nicht interaktiv.

### States
1. Loading zeigt ruhige Warteführung.
2. Empty zeigt Hinweis zur Präzisierung.
3. Error zeigt neutrale Retry Führung.
4. Rate Limit zeigt kurze Warteführung.

### Progressive Disclosure
1. Hauptantwort ist immer sichtbar vor Detailinformationen.
2. Nachweis ist reduziert und wird bewusst geöffnet.

## Screen Hauptansicht Mobile
### Zweck
1. Erhalt derselben Klarheit auf kleiner Fläche.

### Layoutstruktur
1. Einspaltiges Stapellayout in derselben Informationsreihenfolge.
2. Zustandsübersicht steht unter dem Ergebnisbereich.

### Komponentenrollen
1. Komponenten bleiben identisch zur Desktopansicht.

### Interaktionen
1. Primäraktion wird volle Breite für klare Touch Bedienung.

### States
1. Zustände bleiben vollständig sichtbar mit jeweils einer Aktion.

### Progressive Disclosure
1. Disclosure Verhalten bleibt unverändert.
