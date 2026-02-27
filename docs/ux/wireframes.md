# Wireframes

## Ansicht A Desktop mit Statusspalte
### Layout
1. Header full width mit Titel und kurzer Einordnung.
2. Zwei Spalten im Content.
3. Linke Spalte ist der Hauptfluss.
4. Rechte Spalte ist der Plattform-Statusblock.
5. Footer full width mit knapper Betriebsnotiz.

### Linke Spalte Hauptfluss
1. Karte `Frage stellen` mit Textarea und Button `Antwort anzeigen`.
2. Karte `Antwort` zeigt entweder Inhalt oder Inline State.
3. Karte `Wichtige Bezuege` als kompakte Liste.
4. Karte `Herleitung` als Disclosure.

### Rechte Spalte Plattform-Status
1. Abschnitt `Public Plattform Status` mit Badge Text.
2. Abschnitt `Deployment Hinweis` mit neutralem Statussatz.
3. Abschnitt `Secret Hygiene` mit klarer Nicht-Repo-Aussage.
4. Abschnitt `Betriebsgrenzen` mit kurzem Rate-Limit-Hinweis.

## Ansicht B Mobile gestapelt
### Layout
1. Header.
2. Plattform-Statusblock.
3. Hauptfluss in identischer Reihenfolge.
4. Sticky Footer Bar mit Primaeraktion.

### Interaktion
1. Button in Karte auf Mobile optional ausblendbar, Sticky Action ist fuehrend.
2. Fokusreihenfolge folgt visueller Reihenfolge.
3. Disclosure bleibt tastaturbedienbar.

## State Darstellungen im Antwortbereich
### Loading
1. Titel und Kurztext in neutraler Infoflaeche.
2. Keine zweite Aktion ausser warten.

### Empty
1. Klartext, dass kein passender Kontext gefunden wurde.
2. Eine Aktion `Frage praezisieren`.

### Error
1. Klartext, dass Verarbeitung fehlgeschlagen ist.
2. Eine Aktion `Erneut versuchen`.

### Rate Limit
1. Klartext, dass das Kontingent kurz erreicht ist.
2. Eine Aktion `Kurz warten und erneut senden`.

## Atomic Mapping fuer Umsetzung
1. Template: `PublicPlatformSetupTemplate`.
2. Organisms: `QuestionComposer`, `AnswerPanel`, `ReferenceList`, `DerivationDisclosure`, `PlatformStatusPanel`.
3. Molecules: `InlineStateCard`, `StatusBadge`, `InfoRow`.
4. Atoms: `Label`, `HintText`, `ActionButton`.
