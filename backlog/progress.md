# Story Progress Übersicht

## Legende

| Status | Bedeutung |
| --- | --- |
| ⚪ `todo` | Noch nicht gestartet |
| 🔵 `in_progress` | Aktive Bearbeitung läuft |
| 🟡 `qa` | Entwicklung abgeschlossen, wartet auf QA |
| 🟢 `pass` | QA erfolgreich, bereit für PM-Freigabe |
| ✅ `accepted` | Durch PM final freigegeben |
| 🔴 `blocked` | Bearbeitung blockiert |

## Verbindliche Epic-Statuslogik

1. Ein Epic muss auf `in_progress` gesetzt werden, sobald die erste Story dieses Epics einen Status ungleich `todo` hat.
2. Wenn eine Story eines Epics den Status `in_progress`, `qa`, `pass`, `accepted` oder `blocked` hat, darf das Epic nicht `todo` bleiben.

## Epic Übersicht

| Epic-Datei | Titel | Status | Letztes Update |
| --- | --- | --- | --- |
| `e1-wissensmodell-seed-daten.md` | Epic E1 Wissensmodell und Seed-Daten | 🔵 `in_progress` | 2026-02-26 |
| `e2-retrieval-antwortpipeline.md` | Epic E2 Retrieval und Antwortpipeline | ⚪ `todo` | 2026-02-25 |
| `e3-frontend-nutzerfuehrung.md` | Epic E3 MVP-Frontend und Nutzerführung | ⚪ `todo` | 2026-02-25 |
| `e4-deployment-sicherheit-guardrails.md` | Epic E4 Deployment, Sicherheit und Guardrails | ⚪ `todo` | 2026-02-25 |
| `e5-qualitaetssicherung-abnahme.md` | Epic E5 Qualitätssicherung und MVP-Abnahme | ⚪ `todo` | 2026-02-25 |

## Story Übersicht

| Story-Datei | Titel | Status | Letztes Update |
| --- | --- | --- | --- |
| `e1-s1-ontologie-fachlich-definieren.md` | E1-S1 Ontologie fachlich definieren | ✅ `accepted` | 2026-02-25 |
| `e1-s2-seed-datenbasis-erzeugen.md` | E1-S2 Kuratierte Quellbasis aus bereitgestellten Quellen erfassen | ✅ `accepted` | 2026-02-25 |
| `e1-s3-datenbasis-verfuegbar-machen.md` | E1-S3 Normalisierte Datenbasis im Zielbetrieb verfügbar machen | ✅ `accepted` | 2026-02-25 |
| `e1-s4-qualitaetspruefung-seed-daten.md` | E1-S4 Qualitätsprüfung für kuratierte Seed-Daten ausführen | ✅ `accepted` | 2026-02-25 |
| `e1-s5-quellen-extraktion-normalisierung.md` | E1-S5 Quelleninhalte extrahieren und normalisieren | ✅ `accepted` | 2026-02-25 |
| `e1-s6-neo4j-lokal-seed-reset.md` | E1-S6 Neo4j lokal Seed Reset und Reseed | 🔴 `blocked` | 2026-02-26 |
| `e2-s1-kontextkandidaten-bereitstellen.md` | E2-S1 Kontextkandidaten pro Frage bereitstellen | ⚪ `todo` | 2026-02-25 |
| `e2-s2-kontext-konsistent-erweitern.md` | E2-S2 Kontext für Antwort konsistent erweitern | ⚪ `todo` | 2026-02-25 |
| `e2-s3-antwort-aus-kontext-erzeugen.md` | E2-S3 Antwort aus strukturiertem Kontext erzeugen | ⚪ `todo` | 2026-02-25 |
| `e2-s4-referenzkonzepte-absichern.md` | E2-S4 Referenzkonzepte in Ausgabe absichern | ⚪ `todo` | 2026-02-25 |
| `e3-s1-query-und-antwortansicht.md` | E3-S1 Query-Eingabe und Antwortansicht bereitstellen | ⚪ `todo` | 2026-02-25 |
| `e3-s2-loading-fehler-leere-zustaende.md` | E3-S2 Zustände für Loading, Fehler und Leere bereitstellen | ⚪ `todo` | 2026-02-25 |
| `e3-s3-herleitungsdetails-sichtbar-machen.md` | E3-S3 Herleitungsdetails sichtbar machen | ⚪ `todo` | 2026-02-25 |
| `e4-s5-public-plattform-setup.md` | E4-S5 Public Plattform Setup vorbereiten | ⚪ `todo` | 2026-02-25 |
| `e4-s1-public-deployment-lauffaehig.md` | E4-S1 Public Deployment lauffähig machen | ⚪ `todo` | 2026-02-25 |
| `e4-s2-api-key-schutz-usage-limit.md` | E4-S2 API-Key-Schutz und Usage-Limit verifizieren | ⚪ `todo` | 2026-02-25 |
| `e4-s3-basis-rate-limit.md` | E4-S3 Basis-Rate-Limit aktivieren | ⚪ `todo` | 2026-02-25 |
| `e4-s4-log-minimum-privacy.md` | E4-S4 Log-Minimum und Privacy-Regeln prüfen | ⚪ `todo` | 2026-02-25 |
| `e5-s1-eval-set-fuenf-fragen.md` | E5-S1 Eval-Set mit fünf Fragen definieren | ⚪ `todo` | 2026-02-25 |
| `e5-s2-abnahmelauf-durchfuehren.md` | E5-S2 End-to-End-Abnahmelauf durchführen | ⚪ `todo` | 2026-02-25 |
| `e5-s3-lessons-learned-priorisieren.md` | E5-S3 Lessons Learned priorisieren | ⚪ `todo` | 2026-02-25 |
