# Dokumentation

Dieses Verzeichnis bündelt die dauerhaften Projektunterlagen für System GraphRAG Lab. Die Struktur behandelt das Projekt wie eine kleine Company: Product, Feature, Tech, Business, Marketing, Research und Discovery haben jeweils einen klaren Zuständigkeitsbereich.

## Struktur
1. `product/`: PRD, Roadmap, Scope, Ideen und Product Decision Records.
2. `feature/`: aktive Feature-Notizen und Übergänge aus Roadmap oder Ideen in konkrete Umsetzung.
3. `tech/`: SPEC, Architektur, Datenmodell, API-Verträge, Operations und technische Entscheidungen.
4. `business/`: Business-, Markt-, Pricing-, Monetarisierungs- und Positionierungsnotizen.
5. `marketing/`: Launch Readiness, Kanalnotizen, Content-Entwürfe und Kampagnenartefakte.
6. `research/`: externe Referenzen, Quellenarbeit, Snapshots und Evidenz.
7. `discovery/`: frühe Discovery- und Kickoff-Artefakte.

## Zentrale Dokumente
1. [PRD](./product/PRD.md)
2. [Roadmap](./product/roadmap.md)
3. [Product Ideas](./product/ideas/README.md)
4. [Product Decision Records](./product/PDR/README.md)
5. [Feature](./feature/README.md)
6. [SPEC](./tech/SPEC.md)
7. [Architecture Overview](./tech/architecture/arc42.md)
8. [Data Model](./tech/models/data-model.md)
9. [API Contract](./tech/spec/api.md)
10. [Architecture Decision Records](./tech/ADR/README.md)
11. [Operations](./tech/operations/runbook.md)
12. [Research](./research/README.md)

## Update-Regel
Neue dauerhafte Produktentscheidungen gehören als PDR unter `product/PDR/`. Neue dauerhafte Architekturentscheidungen gehören als ADR unter `tech/ADR/`. Frühe, noch offene Produktideen bleiben zuerst unter `product/ideas/`, bis sie priorisiert oder verworfen werden. Recherchematerial bleibt unter `research/`, solange daraus noch keine Entscheidung oder priorisierte Roadmap-Arbeit entstanden ist.
