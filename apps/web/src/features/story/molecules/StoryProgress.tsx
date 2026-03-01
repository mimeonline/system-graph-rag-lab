import type { StoryChapter } from "@/features/story/story-flow-model";

type StoryProgressProps = {
  chapters: StoryChapter[];
  activeIndex: number;
  onStepClick: (index: number) => void;
};

export function StoryProgress({ chapters, activeIndex, onStepClick }: StoryProgressProps): React.JSX.Element {
  return (
    <section className="space-y-3 rounded-xl border border-slate-300/80 bg-white p-3 sm:p-4">
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-sky-600 transition-all duration-500 ease-out"
          style={{ width: `${((activeIndex + 1) / chapters.length) * 100}%` }}
        />
      </div>
      <ol className="grid gap-2 sm:grid-cols-5" aria-label="Story Fortschritt">
        {chapters.map((chapter, index) => {
          const isActive = index === activeIndex;
          const isCompleted = index < activeIndex;

          return (
            <li key={chapter.id} aria-current={isActive ? "step" : undefined}>
              <button
                type="button"
                onClick={() => onStepClick(index)}
                className={`w-full rounded-lg border px-2.5 py-2 text-left transition-all duration-200 ${
                  isActive
                    ? "border-sky-500 bg-sky-50 shadow-sm shadow-sky-100"
                    : isCompleted
                      ? "border-sky-200 bg-sky-50/40"
                      : "border-slate-200 bg-slate-50"
                } cursor-pointer hover:border-sky-300 hover:bg-white`}
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                  {isCompleted ? "✓ " : ""}{`${index + 1}. ${chapter.label}`}
                </p>
                <p className="mt-1 text-xs text-slate-700">{chapter.goal}</p>
              </button>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

