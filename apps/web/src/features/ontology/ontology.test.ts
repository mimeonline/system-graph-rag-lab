import { describe, expect, it } from "vitest";
import {
  ONTOLOGY_NODE_TYPES,
  ONTOLOGY_RELATIONS,
  ONTOLOGY_RELATION_TYPES,
  isAllowedOntologyRelation,
} from "@/features/ontology/ontology";

describe("ontology definition", () => {
  it("contains the required ontology node types", () => {
    expect(ONTOLOGY_NODE_TYPES).toEqual(["Concept", "Author", "Book", "Problem"]);
  });

  it("contains the complete set of allowed relation definitions", () => {
    expect(ONTOLOGY_RELATIONS).toEqual([
      { type: "WROTE", from: "Author", to: "Book" },
      { type: "EXPLAINS", from: "Book", to: "Concept" },
      { type: "ADDRESSES", from: "Book", to: "Problem" },
      { type: "RELATES_TO", from: "Problem", to: "Concept" },
      { type: "INFLUENCES", from: "Concept", to: "Concept" },
      { type: "CONTRASTS_WITH", from: "Concept", to: "Concept" },
    ]);
    expect(ONTOLOGY_RELATION_TYPES).toEqual([
      "WROTE",
      "EXPLAINS",
      "ADDRESSES",
      "RELATES_TO",
      "INFLUENCES",
      "CONTRASTS_WITH",
    ]);
  });

  it("accepts allowed relations and rejects disallowed relations", () => {
    expect(isAllowedOntologyRelation("WROTE", "Author", "Book")).toBe(true);
    expect(isAllowedOntologyRelation("RELATES_TO", "Problem", "Concept")).toBe(true);
    expect(isAllowedOntologyRelation("WROTE", "Book", "Author")).toBe(false);
    expect(isAllowedOntologyRelation("EXPLAINS", "Author", "Concept")).toBe(false);
  });
});
