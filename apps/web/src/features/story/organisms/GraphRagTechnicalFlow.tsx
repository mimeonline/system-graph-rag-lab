"use client";

import { useMemo, useState } from "react";
import { TrackedLink } from "@/components/molecules/tracked-link";
import { trackLiteEvent } from "@/lib/analytics-lite";
import { StoryChapter3DVisual } from "@/features/story/molecules/StoryChapter3DVisual";
import { StoryChapterInlineSvg } from "@/features/story/molecules/StoryChapterInlineSvg";
import { StoryChapterSvgVisual } from "@/features/story/molecules/StoryChapterSvgVisual";
import { StoryPerspectiveSwitch } from "@/features/story/molecules/StoryPerspectiveSwitch";
import { StoryProgress } from "@/features/story/molecules/StoryProgress";
import {
  STORY_CHAPTERS,
  type StoryPerspective,
  getPrimaryActionForChapter,
} from "@/features/story/story-flow-model";

export function GraphRagTechnicalFlow(): React.JSX.Element {
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [perspective, setPerspective] = useState<StoryPerspective>("architecture");

  const activeChapter = useMemo(() => STORY_CHAPTERS[activeChapterIndex], [activeChapterIndex]);
  const action = useMemo(() => getPrimaryActionForChapter(activeChapterIndex), [activeChapterIndex]);

  const handleAdvance = () => {
    setActiveChapterIndex((current) => {
      const next = Math.min(current + 1, STORY_CHAPTERS.length - 1);
      if (next !== current) {
        trackLiteEvent("story_chapter_advance", {
          from: current + 1,
          to: next + 1,
          chapter_id: STORY_CHAPTERS[next].id,
          perspective,
        });
      }
      return next;
    });
  };

  const handleStepClick = (index: number) => {
    const next = Math.max(0, Math.min(index, STORY_CHAPTERS.length - 1));
    if (next === activeChapterIndex) {
      return;
    }

    setActiveChapterIndex(next);
    trackLiteEvent("story_chapter_select", {
      from: activeChapterIndex + 1,
      to: next + 1,
      chapter_id: STORY_CHAPTERS[next].id,
      perspective,
    });
  };

  const handlePerspectiveChange = (next: StoryPerspective) => {
    if (next === perspective) {
      return;
    }

    setPerspective(next);
    trackLiteEvent("story_perspective_change", {
      chapter: activeChapter.id,
      perspective: next,
    });
  };

  return (
    <section className="space-y-4 rounded-2xl border border-slate-300/80 bg-slate-100/60 p-4 sm:p-5">
      <StoryProgress chapters={STORY_CHAPTERS} activeIndex={activeChapterIndex} onStepClick={handleStepClick} />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_330px]">
        <article key={activeChapter.id} className="space-y-3 rounded-xl border border-slate-300/80 bg-white p-4 sm:p-5">
          <header className="space-y-1.5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">{`Kapitel ${activeChapterIndex + 1} von ${STORY_CHAPTERS.length}`}</p>
            <h2 className="text-[1.45rem] font-semibold tracking-tight text-slate-950">{`${activeChapter.label}: ${activeChapter.goal}`}</h2>
          </header>

          <section className="space-y-3 text-sm leading-6 text-slate-700">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">Was in diesem Schritt passiert</p>
              <p>{activeChapter.technicalFlow}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">Warum das wichtig ist</p>
              <p>{activeChapter.structuralRelevance}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">So liest du die Visualisierung</p>
              <p>{activeChapter.visualSpec}</p>
            </div>
          </section>

          <StoryChapterInlineSvg chapterId={activeChapter.id} />

          <div className="pt-2">
            {action.isDemoLink ? (
              <TrackedLink
                href="/demo"
                label={action.label}
                eventName="story_demo_click"
                payload={{ surface: "graphrag_technical_flow", chapter: activeChapter.id }}
                className="inline-flex items-center rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-600"
              />
            ) : (
              <button
                type="button"
                onClick={handleAdvance}
                className="inline-flex items-center rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                {action.label}
              </button>
            )}
          </div>
        </article>

        <aside className="space-y-4">
          <StoryPerspectiveSwitch perspective={perspective} onChange={handlePerspectiveChange} />

          <section className="rounded-xl border border-slate-300/80 bg-white p-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Blickwinkel</p>
            <p className="mt-1 text-sm leading-6 text-slate-700">{activeChapter.perspectiveCopy[perspective]}</p>
          </section>

          {activeChapter.visualMode === "three" ? (
            <StoryChapter3DVisual />
          ) : (
            <StoryChapterSvgVisual chapterId={activeChapter.id} />
          )}
        </aside>
      </div>
    </section>
  );
}
