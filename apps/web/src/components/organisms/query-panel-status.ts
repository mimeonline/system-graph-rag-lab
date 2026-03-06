export type QueryPanelStatus = "idle" | "loading" | "success" | "error" | "empty";

export type QueryPanelStatusHint = {
  statusText: string;
  nextAction: string;
};

/**
 * Returns user-facing status copy and optional error override for the query panel.
 */
export function getStatusHint(
  status: QueryPanelStatus,
  copy: Record<QueryPanelStatus, QueryPanelStatusHint>,
  errorMessage?: string | null,
): QueryPanelStatusHint {
  const hint = copy[status];

  if (status === "error" && errorMessage) {
    return {
      statusText: errorMessage,
      nextAction: hint.nextAction,
    };
  }

  return hint;
}
