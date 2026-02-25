# Dev to Security Handoff

## Kurzer Security-Context der umgesetzten Stories
1. Bearbeitet wurde Story `E1-S2` mit Fokus auf kuratierte Quellenbasis fuer Seed-Daten.
2. Sicherheitsrelevant ist die Integritaet der Herkunftsmetadaten (`sourceType`, `sourceFile`, `internalSource`, `publicReference`) in der Seed-Basis.
3. Es wurden keine neuen extern erreichbaren Endpoints eingefuehrt.

## Welche Eingaben oder Endpoints sicherheitsrelevant beruehrt wurden
1. Kein neuer Endpoint.
2. Sicherheitsrelevante Eingabe ist der interne Quellenkatalog in `apps/web/src/features/seed-data/seed-data.ts`.
3. Der Validator verarbeitet Source-Referenzen fuer `sources`, `nodes` und `edges`.

## Welche bekannten Sicherheitsgrenzen oder offenen Risiken bestehen
1. Herkunftsdaten sind statisch kuratiert und noch nicht gegen manipulierte Runtime-Imports gehaertet.
2. DB-seitige Constraint-Durchsetzung bei spaeterem Persistieren ist nicht Teil dieser Story.
3. `optional_internet` wird verwendet, aber es gibt in dieser Story noch keinen dedizierten Review-Workflow fuer externe URL-Qualitaet und Link-Rot.

## Welche Punkte Security im Epic-Gate gezielt pruefen soll
1. Bei E1-S5 und E1-S3 sicherstellen, dass Herkunftsfelder beim Import nicht verloren gehen.
2. Pruefen, dass nur erlaubte `sourceType` Werte akzeptiert werden und unknown-source Eintraege blockiert werden.
3. Pruefen, dass spaetere Import- oder API-Pfade keine Rohquellen mit sensitiven Inhalten loggen.
4. Pruefen, dass optionale Internet-Quellen nur mit dokumentierter Inhaltsluecke und nachvollziehbarer Referenz aufgenommen werden.
