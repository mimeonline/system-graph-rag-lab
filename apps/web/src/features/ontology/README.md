# Ontology Feature E1-S1

## Zweck
Diese Feature-Definition dokumentiert die fachliche MVP-Ontologie fuer Story `E1-S1`.

## Node Types
| Node Type | Bedeutung |
| --- | --- |
| `Concept` | Kernkonzept aus System Thinking |
| `Tool` | Methode oder Werkzeug zur Analyse und Intervention |
| `Author` | Autor als Quellenanker |
| `Book` | Buch als semantische Quelle |
| `Problem` | Problemtyp im Systemkontext |

## Erlaubte Beziehungen
| Relation | Von | Nach |
| --- | --- | --- |
| `WROTE` | `Author` | `Book` |
| `EXPLAINS` | `Book` | `Concept` |
| `EXPLAINS` | `Book` | `Tool` |
| `ADDRESSES` | `Book` | `Problem` |
| `RELATES_TO` | `Problem` | `Concept` |
| `INFLUENCES` | `Concept` | `Concept` |
| `INFLUENCES` | `Concept` | `Tool` |
| `INFLUENCES` | `Tool` | `Concept` |
| `INFLUENCES` | `Tool` | `Tool` |
| `CONTRASTS_WITH` | `Concept` | `Concept` |
| `CONTRASTS_WITH` | `Concept` | `Tool` |
| `CONTRASTS_WITH` | `Tool` | `Concept` |
| `CONTRASTS_WITH` | `Tool` | `Tool` |
