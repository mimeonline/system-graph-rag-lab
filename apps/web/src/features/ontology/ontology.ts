export const ONTOLOGY_NODE_TYPES = ["Concept", "Tool", "Author", "Book", "Problem"] as const;

export type OntologyNodeType = (typeof ONTOLOGY_NODE_TYPES)[number];

export const ONTOLOGY_RELATION_TYPES = [
  "WROTE",
  "EXPLAINS",
  "ADDRESSES",
  "RELATES_TO",
  "INFLUENCES",
  "CONTRASTS_WITH",
] as const;

export type OntologyRelationType = (typeof ONTOLOGY_RELATION_TYPES)[number];

export type OntologyRelationDefinition = {
  type: OntologyRelationType;
  from: OntologyNodeType;
  to: OntologyNodeType;
};

export const ONTOLOGY_RELATIONS: readonly OntologyRelationDefinition[] = [
  { type: "WROTE", from: "Author", to: "Book" },
  { type: "EXPLAINS", from: "Book", to: "Concept" },
  { type: "EXPLAINS", from: "Book", to: "Tool" },
  { type: "ADDRESSES", from: "Book", to: "Problem" },
  { type: "RELATES_TO", from: "Problem", to: "Concept" },
  { type: "INFLUENCES", from: "Concept", to: "Concept" },
  { type: "INFLUENCES", from: "Concept", to: "Tool" },
  { type: "INFLUENCES", from: "Tool", to: "Concept" },
  { type: "INFLUENCES", from: "Tool", to: "Tool" },
  { type: "CONTRASTS_WITH", from: "Concept", to: "Concept" },
  { type: "CONTRASTS_WITH", from: "Concept", to: "Tool" },
  { type: "CONTRASTS_WITH", from: "Tool", to: "Concept" },
  { type: "CONTRASTS_WITH", from: "Tool", to: "Tool" },
] as const;

/**
 * Zweck:
 * Prueft, ob eine Relation entsprechend der Ontologie fuer Quell- und Zieltyp erlaubt ist.
 *
 * Input:
 * - relationType: Typ der Relation
 * - from: Quell-Node-Typ
 * - to: Ziel-Node-Typ
 *
 * Output:
 * - boolean (`true` wenn die Kombination erlaubt ist)
 *
 * Fehlerfall:
 * - Kein Throw, ungueltige Kombination ergibt `false`
 *
 * Beispiel:
 * - isAllowedOntologyRelation("WROTE", "Author", "Book") === true
 */
export function isAllowedOntologyRelation(
  relationType: OntologyRelationType,
  from: OntologyNodeType,
  to: OntologyNodeType,
): boolean {
  return ONTOLOGY_RELATIONS.some(
    (relation) =>
      relation.type === relationType && relation.from === from && relation.to === to,
  );
}
