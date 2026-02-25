# Wireframes

## Hauptansicht Layout
1. Oberer Bereich mit Produkttitel und kurzer Einordnung des Demo-Zwecks.
2. Zentrale Input-Zone mit einzeiligem Feld, Senden-Button und optionalen Beispielfragen.
3. Ergebnisbereich direkt unter der Input-Zone, damit der Blickpfad stabil bleibt.

## Sektionen und Komponentenrollen
### Input Zone
1. Rolle Einstieg und Kontrolle.
2. Komponenten Fragefeld, Primärbutton, Helper Text.

### Answer Zone
1. Rolle Hauptinformation.
2. Komponenten Antworttitel, Antworttext, Kernaussage-Block.

### Evidence Zone
1. Rolle Transparenz ohne Überladung.
2. Komponenten Liste der Referenzkonzepte mit kurzem Kontext.

### Proof Zone
1. Rolle Herleitungsbeleg im P0-Rahmen.
2. Komponenten einklappbarer Kernnachweis mit knapper Struktur.

### State Zone
1. Rolle Rückmeldung bei nicht regulären Zuständen.
2. Komponenten Loading Text, Empty Hinweis, Error Hinweis, Rate Limit Hinweis.

## Progressive Disclosure
1. Stufe 1 zeigt nur Eingabe und Hauptantwort.
2. Stufe 2 zeigt Referenzkonzepte als kompakten Sekundärblock.
3. Stufe 3 zeigt Kernnachweis nur nach aktivem Öffnen.
4. Jeder Zustand bietet genau eine empfohlene nächste Aktion.
