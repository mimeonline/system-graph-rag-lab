"use client";

import { useEffect } from "react";
import { trackLiteEvent } from "@/lib/analytics-lite";

type TrackedPageViewProps = {
  page: string;
};

export function TrackedPageView({ page }: TrackedPageViewProps): null {
  useEffect(() => {
    trackLiteEvent("page_view", { page });
  }, [page]);

  return null;
}
