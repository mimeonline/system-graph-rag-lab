# PM Memory

## Current Product Intent
Öffentlich erreichbares GraphRAG-MVP für System-Thinking mit klarem Frage-zu-Antwort-Fluss, sichtbaren Referenzkonzepten und einer kuratierten Seed-Datenbasis aus bereitgestellten MD-Quellen mit optional markierter Internet-Ergänzung bei dokumentierten Lücken.

## MVP Scope Guardrails In Out
### In
1. Public Demo mit strukturierter Hauptantwort, Referenzkonzepten und P0-Kernnachweis.
2. Wissensbasis mit mehr als 100 Nodes und mehr als 200 Edges aus kuratierten Quellen.
3. Verbindliche Relevanzprüfung für Referenzkonzepte im fünfteiligen Eval-Set.
4. Öffentlicher Betriebsrahmen mit Secret-Hygiene, Usage-Limit und Basis-Rate-Limit.

### Out
1. Neue Epics oder Domänenerweiterung über den freigegebenen Rahmen hinaus.
2. PM-seitige Architektur-, Retrieval- oder UX-Detailentscheidungen.
3. Konten, Rollenmodell, Multi-Tenant, Personalisierung und Enterprise-Compliance-Ausbau.
4. P1-Herleitungsvertiefung als Blocker für P0-Readiness.

## Open Assumptions
1. Die bereitgestellten MD-Quellen decken den Kern der MVP-Domäne ausreichend ab.
2. Optionale Internet-Ergänzungen bleiben auf echte Lücken begrenzt und verändern den Scope nicht.
3. Die Quellenkennzeichnung `primary_md` und `optional_internet` ist für QA und Abnahme ausreichend eindeutig.
4. Die Mengenziele von mehr als 100 Nodes und mehr als 200 Edges sind mit kuratierten Quellen ohne synthetische Füllinhalte erreichbar.

## Open Decisions
1. Wie streng die PM-Freigabe für optionale Internet-Ergänzungen pro Lücke ausfällt.
2. In welcher Mindesttiefe Herkunft in der UI sichtbar gemacht wird, ohne Erstkontakt zu überladen.
3. PM-Entscheidung vom 2026-02-25: Story `E1-S2` wurde nach QA-`Pass` final auf `accepted` gesetzt.
4. PM-Entscheidung vom 2026-02-25: Story `E1-S3` ist `nicht accepted`, da kein Story-QA-`Pass` vorliegt und der Status weiterhin `todo` ist.

## Risks to Monitor
1. Qualitätsrisiko durch uneinheitliche Kuration zwischen MD-Quellen und Internet-Ergänzungen.
2. Scope-Risiko, falls Internet-Ergänzungen ohne dokumentierte Lücke wachsen.
3. Nachverfolgbarkeitsrisiko, wenn Herkunftskennzeichnung in späteren Storys verloren geht.
4. Gate-Risiko für Epic E1, solange Security- und DevOps-Gates pro Epic noch ausstehen.
5. Tracking-Risiko bei Status-Divergenz zwischen Story-Dateien, Epic und `backlog/progress.md`.
6. Abnahmerisiko für `E1-S3`, solange kein QA-Evidenzpaket für den Zielbetriebs-Lese-Smoke-Test dokumentiert ist.

## Next Instructions for PM Agent
1. Halte E1-Datenfluss verbindlich: S2 Kuration, S5 Extraktion und Normalisierung, S3 Verfügbarkeit, S4 Qualitätsprüfung.
2. Erlaube Internet-Ergänzungen nur mit dokumentierter Inhaltslücke und klarer Kennzeichnung.
3. Synchronisiere bei jeder Statusänderung in E1 sofort `backlog/progress.md`.
4. Setze `pass` nur nach dokumentiertem QA-Pass und PM-Review.
5. Setze `accepted` nur nach vorherigem `pass` und explizitem PM-OK.
6. Fokus E1-Gates: `E1-S5`, `E1-S3` und `E1-S4` inkl. QA sowie Epic-Gates Security und DevOps als Pflicht vor Epic-Abschluss.
7. `E1-S3` erst zur PM-Abnahme vorlegen, wenn Story-Status `pass` ist und QA-Evidenz den Lese-Smoke-Test mit Herkunftskennzeichnung im Zielbetrieb dokumentiert.
