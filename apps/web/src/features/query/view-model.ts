import type {
  QueryContextElement,
  QueryReference,
  QuerySuccessResponse,
} from "@/features/query/contracts";
import { buildStructuredAnswer } from "@/features/query/answer";

export type QueryViewModel = {
  query: string;
  answer: QuerySuccessResponse["answer"];
  references: QueryReference[];
  contextElements: QueryContextElement[];
  contextTokens: number;
};

export function buildQueryViewModel(
  response: QuerySuccessResponse,
  submittedQuery: string,
): QueryViewModel {
  const cleanedQuery = submittedQuery.trim();
  const effectiveQuery = cleanedQuery.length > 0 ? cleanedQuery : "Unbenannte Anfrage";

  const structuredAnswer = buildStructuredAnswer({
    query: effectiveQuery,
    references: response.references,
    contextElements: response.context.elements ?? [],
  });

  return {
    query: effectiveQuery,
    answer: structuredAnswer.answer,
    references: structuredAnswer.references,
    contextElements: structuredAnswer.contextElements,
    contextTokens: structuredAnswer.contextTokens,
  };
}
