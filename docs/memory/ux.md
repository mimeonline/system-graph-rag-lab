# UX Memory

## UX Intent
1. Public MVP braucht sichtbares Plattformvertrauen ohne Bruch im Frage-Antwort-Fluss.
2. Antwort bleibt visuell dominant, Infrastruktur bleibt kontextuell.
3. Zustandskommunikation muss kurz, eindeutig und aktionsorientiert sein.

## Aktueller Stand E4-S5
1. Alle UX-Artefakte wurden auf Public Plattform Setup ausgerichtet.
2. Plattform-Statusblock mit vier festen Zeilen ist als Muster definiert.
3. Inline States `Loading`, `Empty`, `Error`, `Rate Limit` sind durchgaengig spezifiziert.

## Entscheidungen
1. Keine Verlagerung von States in Sidebar oder globale Banner.
2. Keine technischen Detailtexte im Erstkontakt.
3. Mobile nutzt gleiche Inhaltslogik wie Desktop plus Sticky Primaeraktion.

## Offene UX Fragen
1. Welche Runtime-Signale stehen stabil fuer Plattform-Statustexte bereit?
2. Ob bei `rate_limit` eine konkrete Wartezeit angezeigt werden kann.
3. Wie `empty` gegenueber `error` technisch robust getrennt wird.

## UX Risiken
1. Inkonsistentes Signal-Mapping kann falsche Nutzeraktionen ausloesen.
2. Zu technische Statusformulierungen koennen Vertrauen statt Klarheit senken.
3. Fehlende Trennung von `empty` und `error` erzeugt Recovery-Verwirrung.

## Next Instructions
1. Architect-Mapping fuer Statussignale und State-Trennung abwarten.
2. Danach Copy final auf reale Signale kalibrieren.
3. Vor Dev-Start kurzen Konsistenzcheck zwischen Copy, Wireframe und Mock durchfuehren.
