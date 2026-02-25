export const ONTOLOGY_NODE_TYPES = ["Concept", "Author", "Book", "Problem"] as const;

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
  { type: "ADDRESSES", from: "Book", to: "Problem" },
  { type: "RELATES_TO", from: "Problem", to: "Concept" },
  { type: "INFLUENCES", from: "Concept", to: "Concept" },
  { type: "CONTRASTS_WITH", from: "Concept", to: "Concept" },
] as const;

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
