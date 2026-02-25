# Security Checklist (MVP)

## 1. AuthN/AuthZ

- Gibt es zentrale AuthN (Session/JWT/OIDC) und ist sie überall konsistent?
- Sind Objekt-Level-Checks vorhanden (IDOR verhindern): Zugriff auf Ressource nur, wenn Owner/Role passt?
- Sind Admin-Funktionen strikt getrennt und serverseitig geschützt?
- Werden Rollen/Scopes serverseitig geprüft, nicht nur im Frontend?

## 2. Input Validation und Injection

- Validierung auf Server: Typen, Längen, Whitelists, erlaubte Werte.
- SQL Injection: nur prepared statements/ORM, keine String-Konkatenation.
- SSRF: keine frei konfigurierbaren URLs ohne Allowlist; DNS-Rebinding bedenken.
- XSS: output encoding, keine untrusted HTML injection; sichere rendering patterns.
- Command Injection: keine Shell-Aufrufe mit untrusted Input.

## 3. Session, Cookies, CSRF, CORS

- Cookies: HttpOnly, Secure, SameSite (Lax/Strict nach Bedarf).
- CSRF-Schutz bei Cookie-basierter Auth.
- CORS: restriktiv (keine Wildcards mit Credentials).
- Logout invalidiert Sessions/Tokens korrekt.

## 4. Secrets und Konfiguration

- Keine Secrets im Repo (Keys, Tokens, Passwörter).
- Secrets nur über ENV/Secret Store.
- Logging: keine Tokens, Passwörter, PII.
- .env Dateien nicht committen; gitignore geprüft.

## 5. Fehlerbehandlung und Informationsabfluss

- Keine Stacktraces/Interna im Client.
- Error Codes konsistent, keine sensiblen Details.
- Rate-Limit Fehler klar, aber ohne interne Hinweise.

## 6. Daten und Datenschutz

- Minimierung: nur benötigte Daten speichern.
- PII: klar markieren, Zugriff begrenzen, Logging vermeiden.
- Verschlüsselung in Transit: HTTPS überall.
- Verschlüsselung at rest: abhängig vom Deployment, mindestens DB/Volume best practice dokumentieren.

## 7. File Uploads (falls vorhanden)

- Content-Type nicht vertrauen, serverseitig prüfen.
- Größenlimits, Virenscan optional.
- Storage Pfad: keine Path Traversal, keine executable uploads.
- Downloads: Content-Disposition korrekt.

## 8. Abhängigkeiten und Supply Chain

- Lockfiles vorhanden und aktuell.
- Dependency-Scan (z. B. GitHub Dependabot) aktiv.
- Keine ungeprüften Skripte in CI.
- Build reproduzierbar.

## 9. API Security

- Auth überall, außer explizit public endpoints.
- Rate limiting / throttling (mindestens konzeptionell fürs MVP).
- Pagination und Limits, um DoS zu vermeiden.
- Idempotency bei kritischen Writes (wenn relevant).

## 10. Observability und Incident Basics

- Security-relevante Events loggen: Login fail/success, 권한 errors, admin actions.
- Logs strukturieren, Retention festlegen.
- Minimaler Runbook-Abschnitt: Was tun bei Verdacht auf Leak/Abuse?
