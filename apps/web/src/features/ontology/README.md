# Ontology Feature E1-S1

## Zweck
Diese Feature-Definition dokumentiert die fachliche MVP-Ontologie fuer Story `E1-S1`.

## Node Types
| Node Type | Bedeutung |
| --- | --- |
| `Concept` | Kernkonzept aus System Thinking |
| `Author` | Autor als Quellenanker |
| `Book` | Buch als semantische Quelle |
| `Problem` | Problemtyp im Systemkontext |

## Erlaubte Beziehungen
| Relation | Von | Nach |
| --- | --- | --- |
| `WROTE` | `Author` | `Book` |
| `EXPLAINS` | `Book` | `Concept` |
| `ADDRESSES` | `Book` | `Problem` |
| `RELATES_TO` | `Problem` | `Concept` |
| `INFLUENCES` | `Concept` | `Concept` |
| `CONTRASTS_WITH` | `Concept` | `Concept` |
