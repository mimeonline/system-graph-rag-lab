# Epic E1 Wissensmodell und Seed-Daten

## Status
accepted

## Ziel
Ein fachlich konsistentes Wissensmodell und eine kuratierte Seed-Datenbasis aus bereitgestellten Quellen im freigegebenen MVP-Rahmen bereitstellen.

## Scope
1. Ontologie für die MVP-Domäne fachlich definieren.
2. Kuratierte Quellbasis aus bereitgestellten MD-Quellen erfassen.
3. Optional ergänzende Internet-Quellen nur bei inhaltlichen Lücken aufnehmen.
4. Quelleninhalte auf die freigegebene Ontologie extrahieren und normalisieren.
5. Normalisierte Datenbasis im Zielbetrieb verfügbar machen.
6. Qualitätsprüfung für Konsistenz, Herkunft und Duplikate ausführen.

### Ablauf Quellen-zu-Seed-Daten
1. Zweck: Aus echten Inhalten eine belastbare Seed-Datenbasis für die Public Demo bereitstellen.
2. Input: Freigegebene Ontologie, bereitgestellte MD-Quellen und optional ergänzende Internet-Quellen.
3. Output: Kuratierter Quellenkatalog und normalisierte Seed-Datenbasis mit Herkunftskennzeichnung je Eintrag.
4. Fehlerfall oder Sonderfall: Bei fehlender Abdeckung in MD-Quellen werden optionale Internet-Quellen markiert ergänzt; ohne belastbare Quelle wird kein Eintrag übernommen.
5. Beispiel: Ein Konzept aus einer bereitgestellten MD-Datei wird als Concept-Node mit Quellenreferenz übernommen; eine ergänzende Definition aus dem Internet wird als optionaler Herkunftsbeleg markiert.

## Abgrenzung
1. Keine Erweiterung der Ontologie über die freigegebenen Typen und Relationen hinaus.
2. Keine Vollautomatisierung kuratorischer Fachentscheidungen im MVP.
3. Keine Scope-Erweiterung auf zusätzliche Domänen außerhalb der bereitgestellten Quellenbasis.

## Stories
1. E1-S1 Ontologie fachlich definieren
2. E1-S2 Kuratierte Quellbasis aus bereitgestellten Quellen erfassen
3. E1-S5 Quelleninhalte extrahieren und normalisieren
4. E1-S3 Datenbasis im Zielbetrieb verfügbar machen
5. E1-S6 Neo4j lokal Seed Reset und Reseed
6. E1-S4 Qualitätsprüfung für kuratierte Seed-Daten ausführen
