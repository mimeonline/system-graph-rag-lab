# Retrieval Contract Public MVP

## Ziel
1. Der Contract definiert die feste Retrieval Schnittstelle zwischen API Layer und LLM Kontextbau.
2. Der Contract ist deterministisch, budgetiert und testbar.
3. Der Contract gilt identisch für die Laufzeitprofile `public` und `local`.

## Laufzeitprofile
1. Profil `public` nutzt Neo4j Aura als Graph Backend.
2. Profil `local` nutzt Neo4j Docker auf localhost als Graph Backend.
3. Retrieval Parameter, Sortierung, Dedupe und Budgetregeln bleiben in beiden Profilen identisch.

## Konstante Parameter
1. `TOP_K = 6`
2. `HOP_DEPTH = 1`
3. `CONTEXT_BUDGET_TOKENS = 1400`
4. `MAX_EVIDENCE_ITEMS = 8`
5. `MAX_SUMMARY_CHARS_PER_ITEM = 280`

## Input Schema Retrieval
```json
{
  "requestId": "uuid",
  "query": "string",
  "queryEmbedding": [0.0],
  "topK": 6,
  "hopDepth": 1,
  "contextBudgetTokens": 1400
}
```

## Output Schema Retrieval
```json
{
  "requestId": "uuid",
  "retrieval": {
    "topK": 6,
    "hopDepth": 1,
    "seedCount": 6,
    "expandedCount": 0,
    "selectedCount": 0,
    "contextTokens": 0
  },
  "evidence": [
    {
      "rank": 1,
      "nodeId": "concept:feedback_loops",
      "nodeType": "Concept",
      "title": "Feedback Loops",
      "summary": "...",
      "score": 0.812345,
      "hop": 0,
      "paths": ["problem:local_optimization RELATES_TO concept:feedback_loops"]
    }
  ]
}
```

## Retrieval Ablauf
1. Berechne Query Embedding.
2. Hole TopK Seeds aus Neo4j Vektorindex über `Concept` und `Problem`.
3. Erweitere jeden Seed mit Hop Depth 1 über erlaubte Relationen.
4. Führe Dedupe auf Knotenebene über `nodeId` aus.
5. Sortiere Kandidaten stabil nach festem Sortierschlüssel.
6. Trunkiere Summaries auf maximal 280 Zeichen.
7. Füge Evidenzknoten hinzu, bis `MAX_EVIDENCE_ITEMS` oder `CONTEXT_BUDGET_TOKENS` erreicht ist.

## Erlaubte Relationen für Hop Expansion
1. Zulässige Relationstypen sind `WROTE`, `EXPLAINS`, `ADDRESSES`, `RELATES_TO`, `INFLUENCES`, `CONTRASTS_WITH`.
2. Expansion nutzt die im Graph gespeicherte Richtung der Relation.
3. Kanten außerhalb dieser Liste werden im Retrieval verworfen.

## Kontextformat für LLM
```json
{
  "question": "<user_query>",
  "retrieval_summary": {
    "topK": 6,
    "hopDepth": 1,
    "selectedCount": 8,
    "contextTokens": 1320
  },
  "evidence": [
    {
      "rank": 1,
      "node_id": "concept:feedback_loops",
      "node_type": "Concept",
      "title": "Feedback Loops",
      "summary": "Kurztext",
      "hop": 0,
      "score": 0.812345,
      "supporting_paths": ["problem:local_optimization RELATES_TO concept:feedback_loops"]
    }
  ],
  "output_contract": {
    "answer_main": "string",
    "answer_core_rationale": "string",
    "references": ["node_id"]
  }
}
```

## Tokenbudget Regeln
1. Token Schätzung erfolgt deterministisch mit `estimatedTokens = ceil(charCount / 4)`.
2. Budget zählt nur Retrieval Kontext inklusive Evidenz und Pfadangaben.
3. Wird das Budget überschritten, fallen Elemente mit niedrigstem Rang zuerst weg.
4. Bei Einzelüberschreitung wird zuerst `summary` auf 180 Zeichen reduziert, danach wird das Element verworfen.
5. Dedupe entfernt doppelte `nodeId` vor Budgetierung.

## Determinismus Regeln
1. Kandidatensortierung: `score DESC`, `hop ASC`, `nodeType ASC`, `nodeId ASC`.
2. Pfadsortierung je Evidenz: `sourceNodeId ASC`, `relationType ASC`, `targetNodeId ASC`.
3. Floating Scores werden auf 6 Nachkommastellen gerundet.
4. Gleiches Input Payload muss bei unverändertem Graph identisches Output Ranking liefern.

## Lokale Betriebsannahmen
1. Local Profil nutzt dieselben Node Types, Relationstypen, Constraints und Vektorindex Vorgaben wie public.
2. Local Profil gilt nur dann als reproduzierbar, wenn die lokale Datenbasis gegenüber dem Referenzsnapshot nicht driftet.
3. Unterschiede zwischen Neo4j Aura und Neo4j Docker dürfen den Retrieval Contract nicht verändern.

## Testkriterien für QA
1. Gleiches Query Input auf gleichem Graph liefert identische `evidence.rank` Reihenfolge.
2. `retrieval.topK` bleibt immer 6.
3. `retrieval.hopDepth` bleibt immer 1.
4. `retrieval.contextTokens` überschreitet nie 1400.
5. `evidence` enthält nie doppelte `nodeId`.
