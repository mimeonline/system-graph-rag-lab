# UX to Architect Handoff

## MVP UX Kern
1. Eine ruhige Hauptansicht mit full-width Header, zentrierter Content Area mit max width und full-width Footer.
2. Verbindliche Reihenfolge im Content: Eingabe, Antwortbereich, wichtige Bezüge, Herleitung.
3. Primary Action ist auf Mobile als Sticky Footer Bar geführt, auf Desktop regulär in der Eingabekarte.
4. Loading, Empty, Error und Rate Limit erscheinen ausschließlich inline im Antwortbereich.
5. Progressive Disclosure ist zweistufig: Herleitung und nachgelagerte Retrieval-Details.

## Drei Journeys in Kurzform
1. Erstes Erfolgserlebnis: Frage senden, inline Loading sehen, Hauptantwort und wichtige Bezüge lesen.
2. Plausibilitätsprüfung: Hauptantwort prüfen, Bezüge prüfen, Herleitung optional öffnen.
3. Recovery: Inline Zustand erkennen, eine klare Aktion ausführen, neuen Versuch starten.

## UI States
1. Loading: Inline im Antwortbereich mit kurzer Warteführung.
2. Empty: Inline im Antwortbereich mit Präzisierungsaufforderung.
3. Error: Inline im Antwortbereich mit Retry Führung.
4. Rate Limit: Inline im Antwortbereich mit kurzer Warteführung.

## Offene Fragen an Architect
1. P0: Welche Retrieval-Details sind stabil und nutzerverständlich darstellbar.
2. P0: Welche Felder für wichtige Bezüge sind verbindlich verfügbar.
3. P0: Welche minimale Herleitungsstruktur ist verlässlich lieferbar.
4. P0: Ob für Rate Limit eine belastbare relative Warteangabe bereitgestellt werden kann.
5. P1: Welche zusätzliche Retrieval-Transparenz später ergänzt werden kann, ohne die ruhige Erstführung zu brechen.

## Offene Fragen je Screen mit Priorität
### Screen Hauptansicht P0
1. Welche Pflichtfelder dürfen in Retrieval-Details sichtbar werden.
2. Welche Felder für wichtige Bezüge sind verpflichtend.

### Screen Antwortzustände P0
1. Welche technische Regel trennt Empty verbindlich von schwacher Antwort.
2. Welche Warteangabe bei Rate Limit ist verlässlich.

### Screen Hauptansicht P1
1. Welche zusätzlichen Detailfelder für Retrieval später ohne Layoutbruch möglich sind.

## UX Constraints
1. UI bleibt ruhig, polished und nicht überladen.
2. Hauptantwort bleibt visuell dominanter als Nebeninformationen.
3. Keine permanente Zustands-Seitenleiste.
4. Desktop Sticky Action nur bei späterer UX Begründung, aktuell nicht aktiv.
5. Mobile Sticky Action bleibt dauerhaft als primäre Touch Führung.

## Annahmen
1. Hauptansicht bleibt die einzige verpflichtende MVP Sicht.
2. Zustände werden als separate Signale für den Antwortbereich geliefert.
3. Retrieval-Details können als kurze, nicht technische Nutzersprache gezeigt werden.

## Harte Anforderungen
1. Keine Scope-Erweiterung und keine neuen Features.
2. Keine Verschiebung der States in eine permanente Nebenfläche.
3. Keine Aufhebung der festen vertikalen Reihenfolge.
4. Keine technische Detailtiefe in der UX-Copy über den P0-Nachweis hinaus.
