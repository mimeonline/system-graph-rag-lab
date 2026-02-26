# Context Layering Audit 2026-02-26

## Ziel
Erster Schritt der Umstellung auf Kontext-Schichtung fuer PM, QA und Architect.

## PM Audit
### Core
- Rollenidentitaet und Zielbild der PM-Rolle.
- Run-Modi inklusive Default auf `review`.
- Memory-Mechanik.
- Scope-Grenzen und Strict Write Paths.
- Status-Workflow (`todo` bis `accepted`) und Gate-Abhaengigkeiten.
- Format- und Abschlussregeln.

### Runtime
- Konkrete Storys/Epics dieses Laufs.
- Konkrete zu lesende Dateien im aktuellen Lauf.
- Offene Fragen aus dem letzten Handoff.
- Laufbezogene Prioritaeten und Risiken.

## QA Audit
### Core
- QA als verpflichtendes Gate nach Story und vor Epic-Freigaben.
- Run-Modi inklusive Default auf `review`.
- Memory-Mechanik.
- Scope-Grenzen, Strict Write Paths, Story-Status-Sync-Regeln.
- Pflicht-Output-Artefakte (Testplan, Matrix, Rubrik, Report, Verdict).
- Format- und Abschlussregeln.

### Runtime
- Zu pruefende Story/Epic-ID.
- Welche Akzeptanzkriterien jetzt geprueft werden.
- Laufbezogene Testfoki und reproduzierbare Blocker.
- Konkrete Eingangsartefakte aus Dev/Handoffs.

## Architect Audit
### Core
- Rollenidentitaet und Architekturziel fuer Public Demo.
- Run-Modi inklusive Default auf `review`.
- Memory-Mechanik.
- Scope-Grenzen und Strict Write Paths.
- Pflicht-Artefakte (C4, arc42, Deployment View, ADRs, Retrieval/API Contract).
- Stack-Invarianten (Next.js 16.1.6, Tailwind, shadcn/ui, Atomic Design).
- Format- und Abschlussregeln.

### Runtime
- Konkrete Architekturfrage oder Story-Kontext dieses Laufs.
- Relevante UX/PM Inputs fuer den Lauf.
- Laufbezogene offene Entscheidungen und Risiken.
- Konkrete Outputs fuer diesen Lauf statt Vollproduktion aller Artefakte.

## Sofortmassnahmen
1. `docs/policy/core-policy-v1.md` als statische Referenz eingefuehrt.
2. `docs/policy/runtime-context-template-v1.md` als dynamische Prompt-Vorlage eingefuehrt.
3. Naechster Schritt: `developer_instructions` in den Rollen-TOMLs auf diese Schichtung umstellen.
