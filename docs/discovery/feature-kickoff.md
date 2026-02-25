# System GraphRAG Lab – Public MVP Edition

## 1. Vision

Dieses Projekt ist ein öffentlich deploybares GraphRAG-MVP, das demonstriert, wie ein semantischer Knowledge Graph mit LLM-Retrieval kombiniert wird, um strukturierte und nachvollziehbare Antworten auf komplexe System-Thinking-Fragen zu liefern.

Das Projekt dient gleichzeitig als:

- Technischer Showcase
- Lernplattform
- Content-Basis für Medium, LinkedIn und YouTube
- Referenz für Multi-Agent-Produktentwicklung mit OpenAI Codex

---

## 2. Problem

Standard-LLM-Antworten sind:

- nicht strukturell erklärbar  
- kontextabhängig inkonsistent  
- nicht nachvollziehbar in ihrer Wissensbasis  

GraphRAG soll:

- Konzepte explizit modellieren  
- Relationen sichtbar machen  
- Retrieval kontrollierbar machen  
- Antworten strukturierter und erklärbarer erzeugen  

---

## 3. Produktpositionierung

Dies ist eine Public Demo mit klarem experimentellen Charakter, aber professioneller Präsentation und UI-Qualität.

Es ist kein Enterprise-Produkt, sondern ein bewusst designtes MVP.

---

## 4. Zielgruppe

Primär:

- Software-Architekten  
- AI Engineers  
- Technische Entscheider  
- Personen mit Interesse an GraphRAG  

Sekundär:

- Leser technischer Blogartikel  
- Recruiter  
- Potenzielle Kunden für AI- und Architekturberatung  

---

## 5. Erfolgskriterien

Das MVP ist erfolgreich, wenn:

- Es öffentlich auf Vercel erreichbar ist  
- Neo4j Aura produktiv angebunden ist  
- Mindestens 5 definierte System-Thinking-Fragen korrekt beantwortet werden  
- Jede Antwort mindestens 3 relevante Konzepte referenziert  
- Retrieval nachvollziehbar beschrieben ist  
- UI hochwertig und klar strukturiert wirkt  
- OpenAI API-Nutzung limitiert und abgesichert ist  

---

## 6. Muss-Kriterien (Scope)

### Domäne

- 20–30 Nodes (Concept, Author, Book, Problem)  
- 10–20 Relationen  
- Klar definierte Ontologie  

### Retrieval

- Embedding-basierte Vektorsuche  
- Top-K Selektion  
- 1–2 Hop Graph Expansion  
- Kontextstrukturierung vor LLM-Aufruf  

### UI

- Minimalistische, hochwertige Oberfläche  
- Query Input  
- Strukturierte Antwortdarstellung  
- Referenzierte Konzepte sichtbar  
- Modernes Design (z. B. shadcn + Tailwind)  

### Deployment

- GitHub Public Repository  
- Deployment auf Vercel  
- Neo4j Aura Free Tier  
- Environment Variables sauber getrennt  
- Kein Secret im Repo  

---

## 7. Operational Guardrails

- Separater OpenAI API Key mit Usage Limit  
- Einfaches Rate Limiting im API Handler  
- Keine Persistenz von Nutzereingaben  
- Logging minimal und anonymisiert  
- Basic Error Handling  

---

## 8. Development Approach

Dieses Projekt folgt einem Multi-Agent-Workflow:

PM → UX → Architect → Dev → QA → DevOps → Security

Prinzipien:

- Spec First, aber iterativ  
- Dual Track Discovery und Delivery  
- Klare Handoffs über Repo-Dateien  
- Eval-Driven AI-Qualität  
- Jede Phase erzeugt überprüfbare Artefakte  

---

## 9. Definition of MVP Completion

Das Projekt gilt als abgeschlossen, wenn:

- Die Demo öffentlich erreichbar ist  
- Alle Rollen durchlaufen wurden  
- Alle Handoff-Dateien existieren  
- Eval-Fragen erfolgreich beantwortet werden  
- Architektur dokumentiert ist  
- Lessons Learned dokumentiert sind  
