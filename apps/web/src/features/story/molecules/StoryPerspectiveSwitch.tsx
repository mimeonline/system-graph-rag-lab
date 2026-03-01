import type { StoryPerspective } from "@/features/story/story-flow-model";
import { STORY_PERSPECTIVES } from "@/features/story/story-flow-model";

type StoryPerspectiveSwitchProps = {
  perspective: StoryPerspective;
  onChange: (next: StoryPerspective) => void;
};

export function StoryPerspectiveSwitch({ perspective, onChange }: StoryPerspectiveSwitchProps): React.JSX.Element {
  return (
    <section className="space-y-2 rounded-xl border border-slate-300/80 bg-white p-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Perspektive</p>
      <div className="inline-flex w-full rounded-lg border border-slate-300 bg-slate-50 p-1">
        {STORY_PERSPECTIVES.map((option) => {
          const active = option.id === perspective;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onChange(option.id)}
              className={`flex-1 rounded-md px-2 py-1.5 text-xs font-semibold transition ${
                active ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-white"
              }`}
              aria-pressed={active}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
