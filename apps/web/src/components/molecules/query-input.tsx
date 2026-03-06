"use client";

import type { FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type QuerySuggestionGroup = {
  category: string;
  questions: string[];
};

type QueryInputProps = {
  query: string;
  onQueryChange: (value: string) => void;
  suggestionGroups: QuerySuggestionGroup[];
  onSuggestionSelect: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onResetQuestionSession: () => void;
  helperText?: string;
  nextAction?: string;
  isSubmitting: boolean;
  isQuestionSelectionLocked: boolean;
};

/**
 * Renders the query form with helper status text and submit action.
 */
export function QueryInput({
  query,
  suggestionGroups,
  onSuggestionSelect,
  onSubmit,
  onResetQuestionSession,
  onQueryChange,
  helperText,
  nextAction,
  isSubmitting,
  isQuestionSelectionLocked,
}: QueryInputProps): React.JSX.Element {
  const t = useTranslations("Query");

  return (
    <form className="space-y-4 rounded-xl border border-slate-200/70 bg-white/60 p-4 sm:p-5" onSubmit={onSubmit}>
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{t("suggestionsTitle")}</p>
        <Select onValueChange={onSuggestionSelect} disabled={isQuestionSelectionLocked}>
          <SelectTrigger className="w-full bg-slate-50 text-left text-sm text-slate-700">
            <SelectValue placeholder={t("suggestionPlaceholder")} />
          </SelectTrigger>
          <SelectContent>
            {suggestionGroups.map((group) => (
              <SelectGroup key={group.category}>
                <SelectLabel>{group.category}</SelectLabel>
                {group.questions.map((question) => (
                  <SelectItem key={question} value={question}>
                    {question}
                  </SelectItem>
                ))}
              </SelectGroup>
            ))}
          </SelectContent>
        </Select>
        {isQuestionSelectionLocked ? (
          <p className="text-xs text-slate-600">
            {t("selectionLocked")}
          </p>
        ) : null}
      </div>

      <label className="block space-y-2" htmlFor="query">
        <span className="text-sm font-medium text-slate-900">{t("label")}</span>
        <textarea
          className="h-32 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-500"
          id="query"
          value={query}
          onChange={(event) => onQueryChange(event.currentTarget.value)}
        />
      </label>
      <p className="text-sm text-slate-600">{helperText ?? t("defaultHelper")}</p>
      {nextAction && (
        <p className="text-xs font-semibold text-slate-900">
          {t("nextAction")}: {nextAction}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="submit"
          className="w-full bg-sky-600 shadow-sm transition hover:bg-sky-700 sm:w-auto"
          disabled={isSubmitting}
        >
          {isSubmitting ? t("submitting") : t("submit")}
        </Button>
        {isQuestionSelectionLocked ? (
          <Button
            type="button"
            variant="secondary"
            className="w-full sm:w-auto"
            onClick={onResetQuestionSession}
          >
            {t("reset")}
          </Button>
        ) : null}
      </div>
    </form>
  );
}
