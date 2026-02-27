# Seed Embedding Flow

## Ziel
Dieser Ablauf beschreibt den technischen Pfad von Seed-Embedding-Refresh bis zur Retrieval-Nutzung in der Runtime.

## Mermaid Ablauf
```mermaid
flowchart TD
  A["Seed-Dataset laden: createSeedDataset()"] --> B["Embedding Input bauen: title/name + summary"]
  B --> C["OpenAI Embeddings API: text-embedding-3-small"]
  C --> D["Dimensionen validieren: expected 4"]
  D --> E["Embedding Arrays in seed-data.ts ersetzen"]
  E --> F["Local Reset and Reseed starten"]
  F --> G["Nodes und Edges nach Neo4j schreiben: Concept/Tool/Problem mit embedding"]
  G --> H["Query Runtime"]
  H --> I["Frage-Embedding bei OpenAI erzeugen"]
  I --> J["Neo4j Vector Index Suche"]
  J --> K["Kontextknoten fuer LLM Antwort"]
```

## Schritte
1. Embeddings refreshen mit `pnpm --dir apps/web seed:embeddings:refresh`.
2. Das Script ruft `POST /v1/embeddings` auf und schreibt die Vektoren direkt in `apps/web/src/features/seed-data/seed-data.ts`.
3. Seed neu einspielen mit `pnpm --dir apps/web seed:local:reset-reseed`.
4. Die Runtime nutzt bei jeder Frage ein Query-Embedding und sucht damit im Neo4j-Vector-Index.

## Relevante Dateien
1. `apps/web/scripts/refresh-seed-embeddings.ts`
2. `apps/web/src/features/seed-data/seed-data.ts`
3. `apps/web/src/features/seed-data/local-seed-reset.ts`
4. `apps/web/src/features/query/retrieval.ts`
