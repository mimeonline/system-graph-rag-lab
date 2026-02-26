# Core Policy v1

## Zweck
Diese Policy ist der statische Basiskontext fuer Rollenlaeufe. Sie ist kurz, versioniert und wird ueber `policy_ref` referenziert.

## Globaler Rahmen
- Repository-Dateien sind Source of Truth.
- Scope strikt einhalten, keine opportunistischen Erweiterungen.
- Aenderungen minimal-invasiv.
- Keine Loeschungen oder Umbenennungen ohne expliziten User-Auftrag.
- Keine Secrets oder Hardcoded Keys.

## Run-Modus
- Erwartete Modi: `bootstrap`, `review`, `hardening`.
- Wenn kein Modus gesetzt ist, verwende `review`.

## Memory-Policy
- Rolle liest zu Run-Beginn `docs/memory/<rolle>.md`, falls vorhanden.
- Rolle aktualisiert `docs/memory/<rolle>.md` am Run-Ende strategisch und kurz.
- Keine laufenden Schritt-Logs in Memory-Dateien.
