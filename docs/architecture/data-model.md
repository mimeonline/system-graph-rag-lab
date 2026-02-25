# Datenmodell Public MVP GraphRAG

## Node Types
### Concept
1. Zweck: Kernkonzepte aus System Thinking.
2. Pflichtfelder: `id`, `title`, `summary`, `embedding`.

### Author
1. Zweck: Autor als Quellenanker.
2. Pflichtfelder: `id`, `name`, `summary`.

### Book
1. Zweck: Buch als semantische Quelle.
2. Pflichtfelder: `id`, `title`, `summary`.

### Problem
1. Zweck: Problemtyp, der mit Konzepten verknüpft wird.
2. Pflichtfelder: `id`, `title`, `summary`, `embedding`.

## Relation Types
1. `(:Author)-[:WROTE]->(:Book)`
2. `(:Book)-[:EXPLAINS]->(:Concept)`
3. `(:Book)-[:ADDRESSES]->(:Problem)`
4. `(:Problem)-[:RELATES_TO]->(:Concept)`
5. `(:Concept)-[:INFLUENCES]->(:Concept)`
6. `(:Concept)-[:CONTRASTS_WITH]->(:Concept)`

## Minimale Constraints
1. Pro Node Type gilt `id` als eindeutig.
2. `summary` ist für alle Node Types Pflicht.
3. `title` ist Pflicht für `Concept`, `Book`, `Problem`.
4. `name` ist Pflicht für `Author`.
5. Vektorindex ist Pflicht für `Concept.embedding` und `Problem.embedding`.

## Constraint Skizze in Cypher
```cypher
CREATE CONSTRAINT concept_id_unique IF NOT EXISTS
FOR (n:Concept) REQUIRE n.id IS UNIQUE;

CREATE CONSTRAINT author_id_unique IF NOT EXISTS
FOR (n:Author) REQUIRE n.id IS UNIQUE;

CREATE CONSTRAINT book_id_unique IF NOT EXISTS
FOR (n:Book) REQUIRE n.id IS UNIQUE;

CREATE CONSTRAINT problem_id_unique IF NOT EXISTS
FOR (n:Problem) REQUIRE n.id IS UNIQUE;
```

## Vektorindex Vorgabe
1. Für `Concept.embedding` muss ein Neo4j Vector Index vorhanden sein.
2. Für `Problem.embedding` muss ein Neo4j Vector Index vorhanden sein.
3. Indexname und exakte DDL werden in der Dev Implementierung auf Neo4j Aura Version abgestimmt.

## Beispielgraph als Text
1. `(a:Author {id:"author:donella_meadows", name:"Donella Meadows"})`
2. `(b:Book {id:"book:thinking_in_systems", title:"Thinking in Systems"})`
3. `(c1:Concept {id:"concept:feedback_loops", title:"Feedback Loops"})`
4. `(c2:Concept {id:"concept:leverage_points", title:"Leverage Points"})`
5. `(p:Problem {id:"problem:local_optimization", title:"Local Optimization"})`
6. `(a)-[:WROTE]->(b)`
7. `(b)-[:EXPLAINS]->(c1)`
8. `(b)-[:EXPLAINS]->(c2)`
9. `(b)-[:ADDRESSES]->(p)`
10. `(p)-[:RELATES_TO]->(c1)`
11. `(c1)-[:INFLUENCES]->(c2)`
